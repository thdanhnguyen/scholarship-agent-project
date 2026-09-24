const scholarships = [
  { title: 'Erasmus Mundus Joint Masters', place: 'Liên minh Châu Âu', continent: 'Europe', degree: 'Thạc sĩ', funding: 'Toàn phần · học phí + sinh hoạt', flag: '🇪🇺', color: '#e7e4ff', fit: 92, note: 'Phù hợp nếu bạn muốn học đa quốc gia.' },
  { title: 'DAAD EPOS', place: 'Đức', continent: 'Europe', degree: 'Thạc sĩ', funding: 'Trợ cấp 992 EUR/tháng', flag: '🇩🇪', color: '#fff0cf', fit: 86, note: 'Ưu tiên ngành phát triển bền vững.' },
  { title: 'MEXT Scholarship', place: 'Nhật Bản', continent: 'Asia', degree: 'Đại học', funding: 'Học phí + sinh hoạt phí', flag: '🇯🇵', color: '#ffe7ec', fit: 82, note: 'Có lộ trình dự bị tiếng Nhật.' },
  { title: 'Australia Awards', place: 'Úc', continent: 'Oceania', degree: 'Thạc sĩ', funding: 'Toàn phần · vé máy bay + bảo hiểm', flag: '🇦🇺', color: '#ddf4ec', fit: 89, note: 'Hướng đến tác động cho cộng đồng.' },
  { title: 'Fulbright Foreign Student', place: 'Hoa Kỳ', continent: 'North America', degree: 'Thạc sĩ', funding: 'Toàn phần · học phí + sinh hoạt', flag: '🇺🇸', color: '#e4efff', fit: 84, note: 'Cần kế hoạch lãnh đạo rõ ràng.' },
  { title: 'GKS Graduate Scholarship', place: 'Hàn Quốc', continent: 'Asia', degree: 'Tiến sĩ', funding: 'Học phí + trợ cấp hằng tháng', flag: '🇰🇷', color: '#e7f8ee', fit: 88, note: 'Hỗ trợ nghiên cứu và định hướng quốc tế.' }
];
let continent = 'all', degree = 'all';
const grid = document.querySelector('#scholarshipGrid');
const count = document.querySelector('#resultCount');
const empty = document.querySelector('#emptyState');
const budget = document.querySelector('#budget');
const budgetValue = document.querySelector('#budgetValue');
const budgetLabels = ['Cần toàn phần', 'Dưới 10.000 USD', '10.000 – 20.000 USD', 'Trên 20.000 USD'];
function render(){
  const filtered = scholarships.filter(s => (continent === 'all' || s.continent === continent) && (degree === 'all' || s.degree === degree));
  grid.innerHTML = filtered.map(s => `<article class="scholarship-card"><div class="card-top"><span class="flag" style="--card-color:${s.color}">${s.flag}</span><span class="fit">${s.fit}% phù hợp</span></div><h3>${s.title}</h3><p>${s.place} · ${s.note}</p><div class="card-meta"><span>${s.degree}</span><span>${s.continent === 'North America' ? 'Bắc Mỹ' : s.continent === 'Oceania' ? 'Châu Đại Dương' : s.continent === 'Europe' ? 'Châu Âu' : 'Châu Á'}</span></div><div class="funding">${s.funding}</div></article>`).join('');
  count.textContent = `${filtered.length} cơ hội phù hợp`;
  empty.hidden = filtered.length !== 0;
}
function bindChoice(container, kind){
  document.querySelector(container).addEventListener('click', event => { const btn=event.target.closest('button'); if(!btn) return; document.querySelectorAll(`${container} .choice`).forEach(x=>x.classList.remove('selected')); btn.classList.add('selected'); if(kind==='continent') continent=btn.dataset.continent; else degree=btn.dataset.degree; render(); });
}
bindChoice('#continentChoices','continent'); bindChoice('#degreeChoices','degree'); render();
budget.addEventListener('input',()=> budgetValue.textContent = budgetLabels[budget.value]);
function toast(message){const node=document.querySelector('#toast');node.textContent=message;node.classList.add('show');setTimeout(()=>node.classList.remove('show'),2700)}
document.querySelector('#completeProfile').addEventListener('click',()=>toast('Bạn có thể thêm chứng chỉ ngoại ngữ ở bước tiếp theo.'));
document.querySelector('#askAgent').addEventListener('click',()=>toast('AI Compass sẽ sớm giúp bạn phân tích hồ sơ chi tiết.'));
document.querySelector('#resetFilters').addEventListener('click',()=>{continent='all';degree='all';document.querySelectorAll('.choice').forEach(x=>x.classList.toggle('selected',x.dataset.continent==='all'||x.dataset.degree==='all'));render()});
