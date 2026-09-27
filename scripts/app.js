//JS
// Datos de las unidades que aparecen en la lista de flota.
const trucks = [
  {id:'RD-101', plate:'JLM-2201', route:'León → CDMX', dest:'Bodega Central', status:'ruta', eta:'14:20', color:'#2F6BFF'},
  {id:'RD-102', plate:'JLM-2214', route:'León → CDMX', dest:'Bodega Norte', status:'ruta', eta:'14:20', color:'#22D3EE'},
  {id:'RD-104', plate:'HTX-0983', route:'Patio central', dest:'—', status:'disp', eta:'—', color:'#12B8A6'},
  {id:'RD-108', plate:'HTX-1187', route:'Patio norte', dest:'—', status:'disp', eta:'—', color:'#12B8A6'},
  {id:'RD-110', plate:'MCA-4471', route:'Querétaro → Puebla', dest:'Planta 3', status:'ruta', eta:'18:05', color:'#2F6BFF'},
  {id:'RD-112', plate:'MCA-4508', route:'Taller Sur', dest:'Frenos y suspensión', status:'mant', eta:'Mañana', color:'#F5A623'},
  {id:'RD-115', plate:'JLM-2260', route:'Patio central', dest:'—', status:'disp', eta:'—', color:'#12B8A6'},
  {id:'RD-118', plate:'HTX-1290', route:'Monterrey → Saltillo', dest:'Cedis Saltillo', status:'ruta', eta:'11:50', color:'#8B7BF7'},
  {id:'RD-121', plate:'MCA-4590', route:'Autopista 57, km 88', dest:'Falla mecánica', status:'detenido', eta:'—', color:'#FB6B5B'},
  {id:'RD-124', plate:'JLM-2299', route:'Toluca → CDMX', dest:'Bodega Poniente', status:'ruta', eta:'16:40', color:'#2F6BFF'},
];

// Datos de los conductores mostrados en la tarjeta lateral.
const drivers = [
  {name:'Iván Rosales', truck:'RD-101', on:true},
  {name:'Paola Núñez', truck:'RD-102', on:true},
  {name:'Sergio Beltrán', truck:'RD-110', on:true},
  {name:'Ana Palafox', truck:'RD-118', on:true},
  {name:'Rubén Cota', truck:'Sin asignar', on:false},
];

// Etiquetas visibles para cada estado interno de una unidad.
const statusLabel = {ruta:'En ruta', disp:'Disponible', mant:'Mantenimiento', detenido:'Detenido'};
const fleetList = document.getElementById('fleetList');
let activeFilter = 'todos';
let query = '';

// Obtiene el número de unidad para mostrarlo dentro del avatar.
function initials(id){ return id.replace('RD-',''); }

// Filtra la flota y reconstruye sus filas en el HTML.
function render(){
  const rows = trucks.filter(t=>{
    const matchesFilter = activeFilter === 'todos' || t.status === activeFilter;
    const q = query.trim().toLowerCase();
    const matchesQuery = !q || t.id.toLowerCase().includes(q) || t.plate.toLowerCase().includes(q) || t.route.toLowerCase().includes(q);
    return matchesFilter && matchesQuery;
  });

  fleetList.innerHTML = rows.map(t => `
    <div class="truck-row" tabindex="0" role="button" aria-label="Camión ${t.id}, ${statusLabel[t.status]}">
      <div class="truck-avatar" style="background:${t.color}">${initials(t.id)}</div>
      <div>
        <div class="truck-id">${t.id}</div>
        <div class="truck-plate">${t.plate}</div>
      </div>
      <div class="truck-route">${t.route}<div class="to">${t.dest}</div></div>
      <span class="status-pill ${t.status}">${statusLabel[t.status]}</span>
      <div class="truck-eta"><b>${t.eta}</b>${t.status==='ruta' ? 'llegada' : ''}</div>
      <svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
    </div>
  `).join('') || `<p style="color:var(--text-mute);font-size:13.5px;padding:20px 4px;">No hay camiones que coincidan con esta búsqueda.</p>`;
}

// Cambia el filtro activo cuando se pulsa uno de los botones.
document.getElementById('filters').addEventListener('click', (e)=>{
  const btn = e.target.closest('button');
  if(!btn) return;
  document.querySelectorAll('#filters button').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  activeFilter = btn.dataset.filter;
  render();
});

// Actualiza la lista mientras el usuario escribe en el buscador.
document.getElementById('searchInput').addEventListener('input', (e)=>{
  query = e.target.value;
  render();
});

// Genera la lista de conductores una sola vez al cargar la página.
document.getElementById('driverList').innerHTML = drivers.map(d=>`
  <div class="driver-row">
    <div class="driver-avatar">${d.name.split(' ').map(w=>w[0]).slice(0,2).join('')}</div>
    <div class="driver-info">
      <div class="name">${d.name}</div>
      <div class="truck">${d.truck}</div>
    </div>
    <span class="dot-status ${d.on?'on':'off'}"></span>
  </div>
`).join('');

// Primera renderización de la flota.
render();