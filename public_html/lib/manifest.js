(function () {
  "use strict";
  window.__BRAND__ = {
    name: "Stackbit",
    tagline: "Webs que generan resultados.",
    email: "contacto@stackbitcr.com",
    phone: "+50672849920",
    phoneDisplay: "+506 7284-9920",
    whatsapp: "https://wa.me/50672849920",
    location: "Costa Rica",

    services: [
      {
        id: "landing-basica",
        title: "Landing Básica",
        desc: "Página principal profesional: quiénes son, servicios, fotos y formulario de contacto.",
        detail: "Ideal para emprendedores, profesionales independientes y negocios que necesitan presencia digital rápida y efectiva. Diseño responsive, formulario de contacto y optimización básica SEO.",
        icon: "file",
        idealFor: ["Emprendedores", "Profesionales", "Negocios nuevos"]
      },
      {
        id: "restaurante-menu",
        title: "Restaurante / Menú",
        desc: "Sitio con menú digital, galería de platos, horarios y botón de pedidos por WhatsApp.",
        detail: "Perfecto para restaurantes, cafeterías, sodas y food trucks. Incluye menú visual por categorías, galería de platos, horarios de atención y botón directo de pedido por WhatsApp.",
        icon: "coffee",
        idealFor: ["Restaurantes", "Cafés", "Sodas", "Food trucks"]
      },
      {
        id: "barberia-servicios",
        title: "Barbería / Servicios",
        desc: "Web con galería de trabajos, lista de servicios, agenda en línea y WhatsApp directo.",
        detail: "Diseñado para barberías, salones de belleza, spas y clínicas. Galería de trabajos, lista de servicios con descripción, sistema de agenda y contacto directo por WhatsApp.",
        icon: "user",
        idealFor: ["Barberías", "Salones", "Spas", "Clínicas"],
        badge: "Más solicitado"
      },
      {
        id: "catalogo-whatsapp",
        title: "Catálogo + WhatsApp",
        desc: "Catálogo visual de productos con botón de pedido directo por WhatsApp.",
        detail: "Para tiendas físicas, distribuidores y artesanos que quieren mostrar sus productos en línea sin la complejidad de un e-commerce. Catálogo por categorías con botón de pedido por WhatsApp.",
        icon: "truck",
        idealFor: ["Tiendas", "Distribuidores", "Artesanos"]
      }
    ],

    extras: [
      { id: "panel-admin",       title: "Panel de Administración", desc: "Gestiona tu contenido sin tocar código." },
      { id: "agenda-online",     title: "Agenda en Línea",         desc: "Sistema de citas y reservas automatizado." },
      { id: "catalogo-dinamico", title: "Catálogo Dinámico",       desc: "Actualiza productos sin depender de nosotros." },
      { id: "paypal",            title: "Pasarela PayPal",          desc: "Acepta pagos en línea de forma segura." },
      { id: "carga-productos",   title: "Carga de Productos",      desc: "Importa inventario masivo desde Excel." },
      { id: "formulario-avz",    title: "Formulario Avanzado",     desc: "Multi-paso con campos personalizados." }
    ],

    portfolio: [
      {
        id: "exploremos-colombia",
        title: "Exploremos Colombia",
        category: "Agencia de Viajes",
        desc: "Sitio web para agencia de viajes con paquetes a Colombia, Argentina, México y Guatemala. Diseñado para el mercado costarricense.",
        img: "assets/img/ExpCol.PNG",
        url: "https://exploremoscolombiacr.com/",
        tech: ["HTML", "CSS", "JavaScript"]
      }
    ],

    faqs: [
      { q: "¿Cuánto tiempo tarda en estar lista mi web?", a: "Depende del alcance. Una landing page puede estar en 3-5 días hábiles. Un sitio corporativo tarda 1-2 semanas. Un e-commerce, 2-4 semanas." },
      { q: "¿Qué necesito proveer para comenzar?", a: "Texto de tu empresa (quiénes son, servicios, contacto), logotipo si tienes uno, y referencia de algún sitio que te guste. El resto lo manejamos nosotros." },
      { q: "¿El sitio funcionará en celulares?", a: "Sí, todos los sitios que desarrollamos son 100% responsive. Se ven y funcionan perfectamente en móvil, tablet y escritorio." },
      { q: "¿El dominio y hosting están incluidos?", a: "No están incluidos en el precio del desarrollo, pero te asesoramos en la compra y configuración. El costo de hosting suele ser ₡15,000–65,000 al año." },
      { q: "¿Qué pasa si necesito cambios después de la entrega?", a: "Incluimos hasta 2 rondas de revisiones durante el desarrollo. Posterior a la entrega ofrecemos planes de mantenimiento mensual." }
    ]
  };
})();
