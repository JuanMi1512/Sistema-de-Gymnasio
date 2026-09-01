import {useMemo,useState} from 'react';
import {BadgeCheck,CalendarDays,Edit3,Layers3,Plus,Power,Search,Tag} from 'lucide-react';
import './members-table-premium.css';
import './members-hero.css';
import './members-hero-layout.css';
import './plans-premium.css';
import './plans-client-theme.css';
import './plans-backdrop.css';
import './plans-banner-refine.css';
import './plans-banner-clients-layout.css';
import './global-plan-cards.css';

const money = value => `S/ ${Number(value).toFixed(2)}`;
const months = plan => plan.duration_months || Math.max(1, Math.min(12, Math.round(Number(plan.duration_days || 30) / 30)));

export default function PlansManager({plans, request, token, onDone}) {
  const [plan, setPlan] = useState(null), [query, setQuery] = useState(''), [message, setMessage] = useState('');
  const visible = useMemo(() => plans.filter(item => item.name.toLowerCase().includes(query.toLowerCase())), [plans, query]);
  const active = plans.filter(item => item.status === 'active').length;
  async function save(event) { event.preventDefault(); const f = new FormData(event.currentTarget); try { await request(plan?.id ? `/plans/${plan.id}` : '/plans', token, {method:plan?.id ? 'PUT' : 'POST',body:JSON.stringify({name:f.get('name'),price:Number(f.get('price')),durationMonths:Number(f.get('durationMonths'))})}); setPlan(null);setMessage('Plan guardado correctamente');onDone(); } catch (error) { setMessage(error.message); } }
  async function toggle(id) { try { await request(`/plans/${id}/toggle`, token, {method:'POST'});setMessage('Estado del plan actualizado');onDone(); } catch (error) { setMessage(error.message); } }
  return <>
    <section className="plans-client-hero">
      <div className="plans-hero-copy"><p className="eyebrow">BLUE FIT · CONFIGURACIÓN COMERCIAL</p><h1>Planes de membresía</h1><span>Organiza tus modalidades, precios y vigencias desde un solo lugar.</span><label className="member-search plans-search"><Search size={18}/><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar plan"/></label></div>
      <div className="plans-hero-side"><div className="plans-hero-stats"><span><Layers3 size={16}/><b>{plans.length}</b> planes</span><span><BadgeCheck size={16}/><b>{active}</b> activos</span></div><button className="new-member" onClick={() => setPlan({})}><Plus size={17}/>Nuevo plan</button></div>
    </section>
    <div className="kpis top member-kpis plan-kpis"><article><span><Layers3 size={16}/>Total planes</span><b>{plans.length}</b><small>Catálogo registrado</small></article><article><span><BadgeCheck size={16}/>Planes activos</span><b>{active}</b><small>Disponibles para venta</small></article><article><span><CalendarDays size={16}/>Vigencia promedio</span><b>{plans.length ? `${Math.round(plans.reduce((sum,item) => sum + months(item), 0) / plans.length)} m` : '0 m'}</b><small>Duración comercial</small></article></div>
    {message && <div className="notice">{message}</div>}
    <section className="plans-client-catalog"><div className="catalog-head"><div><p className="eyebrow">CATÁLOGO DE MEMBRESÍAS</p><h2>Modalidades disponibles</h2><small>{visible.length} plan{visible.length === 1 ? '' : 'es'} encontrado{visible.length === 1 ? '' : 's'}</small></div></div><div className="plans-client-grid">{visible.map(item => <article className={`card premium-plan client-plan-card ${item.status}`} key={item.id}><div className="plan-topline"><span className={`plan-state ${item.status}`}><i/>{item.status === 'active' ? 'Activo' : 'Inactivo'}</span><button className="plan-edit" title="Editar plan" onClick={() => setPlan(item)}><Edit3 size={16}/></button></div><div className="plan-name"><span className="plan-symbol"><Tag size={19}/></span><h2>{item.name}</h2></div><div className="plan-price"><small>Precio de venta</small><b>{money(item.price)}</b></div><div className="plan-duration"><CalendarDays size={16}/><span><b>{months(item)}</b> {months(item) === 1 ? 'mes calendario' : 'meses calendario'}</span></div><div className="plan-actions"><button onClick={() => setPlan(item)}><Edit3 size={15}/>Editar</button><button className={item.status === 'active' ? 'pause' : ''} onClick={() => toggle(item.id)}><Power size={15}/>{item.status === 'active' ? 'Desactivar' : 'Activar'}</button></div></article>)}{!visible.length && <div className="plans-empty">No se encontraron planes con esa búsqueda.</div>}</div></section>
    {plan && <div className="modal"><form className="modal-box plan-form" onSubmit={save}><h2>{plan.id ? 'Editar plan' : 'Nuevo plan'}</h2><label>Nombre del plan<input name="name" placeholder="Ej. Membresía trimestral" defaultValue={plan.name || ''} required/></label><label>Precio en soles<input name="price" type="number" min="0.01" step="0.01" placeholder="0.00" defaultValue={plan.price || ''} required/></label><label>Duración en meses<input name="durationMonths" type="number" min="1" max="12" step="1" defaultValue={months(plan)} required/></label><small>Selecciona un periodo de 1 a 12 meses calendario.</small><div><button type="button" onClick={() => setPlan(null)}>Cancelar</button><button>Guardar plan</button></div></form></div>}
  </>;
}
