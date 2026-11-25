const app = document.querySelector('#app');
const isIssue = location.pathname.endsWith('/issue.html');
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const issueHref = issue => `issue.html?n=${issue.number}`;
const image = (item, className = '') => item.image ? `<img class="${className}" src="${esc(item.image)}" alt="${esc(item.title)}相关配图" loading="lazy" onerror="this.closest('.image-frame')?.classList.add('image-missing');this.remove()">` : '';
const mosaic = issue => {
  const picks = issue.items.filter(x => x.image).slice(0, 4);
  return `<div class="mosaic">${picks.length ? picks.map((x,i) => `<div class="image-frame mosaic-cell cell-${i+1}">${image(x)}</div>`).join('') : '<div class="mosaic-placeholder">TECHNICAL ART<br>DIGEST</div>'}</div>`;
};
const issueLabel = issue => `${issue.start} — ${issue.end}`;
const categoryClass = item => ['AIGC', 'AI 开发'].includes(item.category) ? 'ai' : item.category.includes('游戏') ? 'games' : 'ta';
const itemTags = item => `<span class="tag ${categoryClass(item)}">${esc(item.category)}</span>${item.topic ? `<span class="tag">${esc(item.topic)}</span>` : ''}${item.module ? `<span class="tag">${esc(item.module)}</span>` : ''}`;
const card = (item, issue) => `<article class="result-card"><a class="image-frame result-image" href="${issueHref(issue)}#item-${item.id}">${image(item)}</a><div class="result-body"><div class="meta">${itemTags(item)}<span>${esc(item.published)}</span><span>Vol. ${issue.number}</span></div><h3><a href="${issueHref(issue)}#item-${item.id}">${esc(item.title)}</a></h3><p>${esc(item.summary)}</p><a class="text-link" href="${issueHref(issue)}#item-${item.id}">阅读本条</a></div></article>`;
function renderHome(issues) {
  const latest = issues[0];
  app.innerHTML = `<section class="intro"><h1>技术美术，<em>每周精选。</em></h1><p class="intro-copy">汇集图形学、制作工具与 AI 工作流的新进展。</p></section>
  <section class="featured"><div class="section-top"><span class="eyebrow">LATEST ISSUE / 最新一期</span><span>${esc(issueLabel(latest))}</span></div><a class="featured-layout" href="${issueHref(latest)}"><div class="featured-copy"><div class="volume">VOL. ${String(latest.number).padStart(2,'0')}</div><h2>${esc(latest.title)}</h2><p>本周精选 ${latest.items.length} 条资讯，聚焦技术美术、AIGC 与游戏制作。</p><div class="feature-list">${latest.recommendations.slice(0,3).map((r,i) => `<div><b>0${i+1}</b><span>${esc(r.title)}</span></div>`).join('')}</div><span class="featured-action">阅读本期 <span aria-hidden="true">↗</span></span></div>${mosaic(latest)}</a></section>
  <section class="archive" id="archive"><div class="section-heading"><div><p class="eyebrow">THE ARCHIVE</p><h2>周报归档</h2></div><p>按期浏览，或直接检索单条资讯。</p></div><div class="filters"><label class="search-wrap"><span class="sr-only">搜索资讯</span><input id="search" type="search" placeholder="搜索标题、摘要、来源…"></label><label><span class="sr-only">主题</span><select id="topic"><option value="">全部主题</option><option value="module:综合 TA">综合 TA</option><option value="module:角色">角色</option><option value="module:场景">场景</option><option value="module:特效">特效</option><option value="module:动画">动画</option><option value="技术美术">技术美术 · 全部</option><option value="技术美术:渲染">技术美术 · 渲染</option><option value="技术美术:工具">技术美术 · 工具</option><option value="技术美术:引擎">技术美术 · 引擎</option><option value="技术美术:PCG">技术美术 · PCG</option><option value="技术美术:绑定与动画">技术美术 · 绑定与动画</option><option value="AIGC">AIGC</option><option value="AI 开发">AI 开发</option><option value="游戏资讯">游戏资讯</option></select></label><label><span class="sr-only">年份</span><select id="year"><option value="">全部年份</option>${[...new Set(issues.map(x=>x.start.slice(0,4)))].map(y=>`<option>${y}</option>`).join('')}</select></label><label><span class="sr-only">月份</span><select id="month"><option value="">全部月份</option>${[...new Set(issues.map(x=>x.start.slice(0,7)))].sort().reverse().map(m=>`<option>${m}</option>`).join('')}</select></label></div><p id="result-count" class="result-count"></p><div id="results" class="issue-grid"></div></section>`;
  const controls = ['search','topic','year','month'].map(id => document.getElementById(id));
  const results = document.getElementById('results');
  const count = document.getElementById('result-count');
  function filter() {
    const [query, topic, year, month] = controls.map(x => x.value.trim());
    const q = query.toLocaleLowerCase();
    const filtered = issues.filter(x => (!year || x.start.startsWith(year)) && (!month || x.start.startsWith(month)));
    if (q || topic) {
      const rows = filtered.flatMap(issue => issue.items.filter(item => (!topic || (topic.startsWith('module:') ? item.module === topic.slice(7) : topic.includes(':') ? `${item.category}:${item.topic}` === topic : item.category === topic)) && (!q || [item.title,item.summary,item.source,item.category,item.topic,item.module,issue.title].join(' ').toLocaleLowerCase().includes(q))).map(item => ({item,issue})));
      results.className = 'results-list';
      results.innerHTML = rows.map(({item,issue})=>card(item,issue)).join('') || '<p class="empty">没有找到匹配的资讯。试试其他关键词或筛选条件。</p>';
      count.textContent = `找到 ${rows.length} 条资讯`;
    } else {
      results.className = 'issue-grid';
      results.innerHTML = filtered.map(issue => `<a class="issue-card" href="${issueHref(issue)}">${mosaic(issue)}<div class="issue-card-meta"><span>VOL. ${String(issue.number).padStart(2,'0')}</span><span>${esc(issueLabel(issue))}</span></div><h3>${esc(issue.title)}</h3><p>${issue.items.length} 条精选 · ${esc(issue.items.slice(0,2).map(x=>x.title).join(' / '))}</p></a>`).join('') || '<p class="empty">该时间范围暂无周报。</p>';
      count.textContent = `共 ${filtered.length} 期周报`;
    }
  }
  controls.forEach(x => x.addEventListener(x.id === 'search' ? 'input':'change', filter));
  filter();
}
function renderIssue(issues) {
  const number = Number(new URLSearchParams(location.search).get('n'));
  const issue = issues.find(x=>x.number===number);
  if (!issue) { app.innerHTML = '<div class="not-found"><h1>未找到这期周报</h1><a href="./">返回首页</a></div>'; return; }
  document.title = `${issue.title} | Technical Art Digest`;
  const next = issues.find(x=>x.number===number+1);
  const previous = issues.find(x=>x.number===number-1);
  app.innerHTML = `<article class="issue-page"><a class="back-link" href="./#archive">← 所有周报</a><header class="issue-hero"><div><p class="eyebrow">WEEKLY DIGEST / VOL. ${String(number).padStart(2,'0')}</p><h1>${esc(issue.title)}</h1><p class="issue-date">${esc(issueLabel(issue))} · ${issue.items.length} 条精选</p></div>${mosaic(issue)}</header><section class="top-picks"><div class="section-heading"><div><p class="eyebrow">EDITOR’S PICKS</p><h2>本周最值得看</h2></div></div><div class="picks-grid">${issue.recommendations.slice(0,3).map((r,i)=>`<div><span>0${i+1}</span><h3>${esc(r.title)}</h3><p>${esc(r.reason)}</p></div>`).join('')}</div></section><section class="stories"><div class="section-heading"><div><p class="eyebrow">ALL STORIES</p><h2>本期内容</h2></div></div>${issue.items.map((item,i)=>`${item.module && (i===0 || item.module !== issue.items[i-1].module) ? `<h3 class="module-heading">${esc(item.module)}</h3>` : ''}<article class="story" id="item-${item.id}"><div class="story-index">${String(i+1).padStart(2,'0')}</div><div class="story-main"><div class="meta">${itemTags(item)}<span>${esc(item.published)}</span><span>${esc(item.source)}</span></div><h3>${esc(item.title)}</h3><p>${esc(item.summary)}</p>${item.weeklyJudgment ? `<div class="value"><strong>周报判断</strong><p>${esc(item.weeklyJudgment)}</p></div>`: ""}${item.value ? `<div class="value"><strong>为什么值得关注</strong><p>${esc(item.value)}</p></div>`:''}<a class="source-link" href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">阅读原文 ↗</a></div>${item.image ? `<figure class="story-figure"><div class="image-frame">${image(item)}</div><figcaption>图片来源：<a href="${esc(item.imageSource || item.url)}" target="_blank" rel="noopener noreferrer">${esc(item.source)}</a></figcaption></figure>` : ''}</article>`).join('')}</section>${issue.trend ? `<section class="closing"><p class="eyebrow">WEEK IN CONTEXT</p><h2>本周观察</h2><p>${esc(issue.trend)}</p>${issue.practice ? `<div><strong>值得动手试</strong><p>${esc(issue.practice)}</p></div>`:''}${issue.watch ? `<div><strong>持续观察</strong><p>${esc(issue.watch)}</p></div>`:''}</section>`:''}<nav class="issue-pagination">${previous?`<a href="${issueHref(previous)}">← Vol. ${previous.number}</a>`:'<span></span>'}${next?`<a href="${issueHref(next)}">Vol. ${next.number} →</a>`:'<span></span>'}</nav></article>`;
}
fetch('content/issues.json', {cache: 'no-store'}).then(response => { if (!response.ok) throw new Error(response.status); return response.json(); }).then(issues => { issues.sort((a,b)=>b.number-a.number); isIssue ? renderIssue(issues) : renderHome(issues); }).catch(() => { app.innerHTML = '<div class="not-found"><h1>内容暂时无法载入</h1><p>请稍后刷新页面。</p></div>'; });
