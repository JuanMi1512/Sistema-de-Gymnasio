import './page-banner.css';
export default function PageBanner({eyebrow, title, description, image, children, className=''}) {
  return <section className={`page-banner ${className}`} style={{'--banner-image':`url(${image})`}}>
    <div className="page-banner-copy"><p>{eyebrow}</p><h1>{title}</h1><span>{description}</span>{children}</div>{title==='Planes de membresía'&&<button className="global-new-plan" onClick={()=>document.querySelector('.plans-client-hero .new-member')?.click()}>+ Nuevo plan</button>}
  </section>;
}
