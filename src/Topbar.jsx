import {useState} from 'react';
import {Bell,ChevronRight,Home,Menu,PanelLeftClose,Search,UserRound} from 'lucide-react';
import PageBanner from './PageBanner.jsx';
import './global-banner-cleanup.css';
import './global-data-ui.css';
import membersImage from './assets/bluefit-members-hero.png';
import plansImage from './assets/bluefit-plans-hero-v2.png';
import gymImage from './assets/bluefit-gym-dashboard-bg.png';

const banners={
  'Clientes':['Clientes','Administra altas, perfiles y accesos de tu comunidad.',membersImage],
  'Planes':['Planes de membresía','Organiza modalidades, precios y vigencias desde un solo lugar.',plansImage],
  'Membresías':['Membresías','Gestiona vigencias, renovaciones y estados de cada cliente.',plansImage],
  'Caja y pagos':['Caja y pagos','Registra cobros y controla los movimientos diarios.',gymImage],
  'Control de acceso':['Control de acceso','Valida ingresos de forma rápida y segura.',membersImage],
  'Entrenadores':['Entrenadores','Organiza a tu equipo y sus clientes asignados.',membersImage],
  'Punto de venta':['Punto de venta','Vende productos y actualiza el inventario automáticamente.',gymImage],
  'Inventario y productos':['Inventario y productos','Controla stock, precios y alertas de reposición.',gymImage],
  'Personal training':['Personal training','Gestiona paquetes, sesiones y entrenadores personales.',membersImage],
  'Reportes':['Reportes','Visualiza los indicadores clave de tu operación.',gymImage],
};
export default function Topbar({onToggle,collapsed,section,alerts=[]}){const[open,setOpen]=useState(false),banner=banners[section];return <><header className="topbar"><button className="menu-toggle" onClick={onToggle} title={collapsed?'Expandir menú':'Reducir menú'}>{collapsed?<Menu size={20}/>:<PanelLeftClose size={20}/>}</button><div className="crumb"><Home size={20}/><ChevronRight size={16}/><span>{section}</span></div><div className="topbar-tools"><label className="global-search"><Search size={18}/><input placeholder="Buscar en BLUE FIT"/></label><div className="alerts-wrap"><button onClick={()=>setOpen(!open)} title="Alertas"><Bell size={19}/>{alerts.length>0&&<i>{alerts.length}</i>}</button>{open&&<div className="alerts-popover"><b>Vencimientos próximos</b>{alerts.length?alerts.slice(0,5).map(a=><div key={a.id}><span>{a.first_name} {a.last_name}</span><small>{a.days_remaining===0?'Vence hoy':a.days_remaining===1?'Vence mañana':`Vence en ${a.days_remaining} días`}</small></div>):<p>No hay alertas pendientes.</p>}</div>}</div><button className="profile-chip" title="Perfil"><UserRound size={18}/></button></div></header>{banner&&<PageBanner eyebrow="BLUE FIT · GESTIÓN OPERATIVA" title={banner[0]} description={banner[1]} image={banner[2]}/>}</>}
