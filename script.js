const API_KEY = 'e33037afabeca93913590502e9ab556b';

// 🟢 DICCIONARIO DE TRADUCCIONES PARA EL FOOTER (AVISO LEGAL)
const footerTranslations = {
    en: {
        note: "Language Note: The news displayed depends on the language selected in the top menu. Some categories or sections may vary in the number of articles available depending on the region of the chosen language.",
        disclaimer: "<strong>Legal Disclaimer:</strong> This website is a personal and demonstrative informative project. All information and news are automatically gathered through the public GNews API. Nova Pulse does not store, edit, or own the displayed articles, which belong exclusively to their respective media outlets. The site may contain limited and non-invasive advertising spaces with the sole purpose of supporting the technical maintenance of the platform.",
        copyright: "© 2026 Nova Pulse. All rights reserved to their original authors."
    },
    es: {
        note: "Nota sobre los idiomas: Las noticias mostradas dependen del idioma seleccionado en el menú superior. Algunas categorías o secciones pueden variar en cantidad de artículos disponibles según la región del idioma elegido.",
        disclaimer: "<strong>Aviso Legal (Disclaimer):</strong> Este sitio web es un proyecto informativo de carácter personal y demostrativo. Toda la información y noticias son recopiladas de forma automática a través de la API pública de GNews. Nova Pulse no almacena, edita ni es propietaria de los artículos mostrados, los cuales pertenecen exclusivamente a sus respectivos medios de comunicación. El sitio puede contener espacios publicitarios limitados y no invasivos con el único fin de sustentar el mantenimiento técnico de la plataforma.",
        copyright: "© 2026 Nova Pulse. Todos los derechos reservados a sus autores originales."
    },
    pt: {
        note: "Nota sobre os idiomas: As notícias exibidas dependem do idioma selecionado no menu superior. Algumas categorias ou seções podem variar na quantidade de artigos disponíveis, dependendo da região do idioma escolhido.",
        disclaimer: "<strong>Aviso Legal (Disclaimer):</strong> Este site é um projeto informativo de caráter pessoal e demonstrativo. Todas as informações e notícias são coletadas automaticamente por meio da API pública do GNews. Nova Pulse não armazena, edita ou possui os artigos exibidos, que pertencem exclusivamente aos seus respectivos meios de comunicação. O site pode conter espaços publicitários limitados e não invasivos com o único objetivo de sustentar a manutenção técnica da plataforma.",
        copyright: "© 2026 Nova Pulse. Todos os direitos reservados aos seus autores originais."
    }
};

// 🟢 FUNÇÃO PARA TRADUCIR EL PIE DE PÁGINA
function translateFooter(lang) {
    const noteEl = document.getElementById('footer-lang-note');
    const disclaimerEl = document.getElementById('footer-disclaimer');
    const copyrightEl = document.getElementById('footer-copyright');

    if (noteEl) noteEl.textContent = footerTranslations[lang].note;
    if (disclaimerEl) disclaimerEl.innerHTML = footerTranslations[lang].disclaimer;
    if (copyrightEl) copyrightEl.textContent = footerTranslations[lang].copyright;
}

document.addEventListener('DOMContentLoaded', () => {
    const newsContainer = document.getElementById('news-container') || document.body;
    const langSelector = document.getElementById('lang-selector');

    // 1. DETECTOR DE PESTAÑAS 
    const path = window.location.pathname.toLowerCase();
    let category = 'general';
    let isGaming = false; 
    
    if (path.includes('world')) category = 'world';
    else if (path.includes('technology')) category = 'technology';
    else if (path.includes('sports')) category = 'sports';
    else if (path.includes('entertainment')) category = 'entertainment';
    else if (path.includes('science') || path.includes('curiosities')) category = 'science';
    else if (path.includes('gaming')) {
        isGaming = true; 
    }

    // 2. FUNCIÓN PRINCIPAL
    async function fetchNews(lang) {
        if (newsContainer) {
            newsContainer.innerHTML = '<p class="loading" style="text-align:center;">Cargando noticias...</p>';
        }

        let targetUrl = '';
        if (isGaming) {
            targetUrl = `/api/news/search?q=(gaming OR videojuegos OR games)&lang=${lang}&token=${API_KEY}`;
        } else {
            targetUrl = `/api/news/top-headlines?category=${category}&lang=${lang}&token=${API_KEY}`;
        }

        try {
            const response = await fetch(targetUrl);
            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
            
            const data = await response.json();
            displayNews(data.articles);
        } catch (error) {
            console.error("Error cargando noticias:", error);
            if (newsContainer) {
                newsContainer.innerHTML = '<p style="color: #ff4a4a; text-align: center; grid-column: 1/-1;">⚠️ Error al cargar las noticias. Revisa tu conexión.</p>';
            }
        }
    }

    // 3. RENDERIZADOR DE TARJETAS
    function displayNews(articles) {
        if (!newsContainer) return;
        newsContainer.innerHTML = '';

        if (!articles || articles.length === 0) {
            newsContainer.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">No hay noticias disponibles en esta categoría o idioma.</p>';
            return;
        }

        articles.forEach(article => {
            const card = document.createElement('div');
            card.className = 'news-card'; 

            const imageUrl = article.image || 'https://via.placeholder.com/300x180?text=Nova+Pulse';

            card.innerHTML = `
                <img src="${imageUrl}" alt="${article.title}" onerror="this.src='https://via.placeholder.com/300x180?text=Nova+Pulse'">
                <div class="news-content">
                    <h3>${article.title}</h3>
                    <p>${article.description || ''}</p>
                    <a href="${article.url}" target="_blank" class="read-more">Leer más</a>
                </div>
            `;
            newsContainer.innerHTML += card.outerHTML;
        });
    }

    // 4. CONTROLADOR DE IDIOMAS WITH LOCALSTORAGE
    const savedLang = localStorage.getItem('appLanguage') || 'en'; 

    if (langSelector) {
        langSelector.value = savedLang; 
        langSelector.addEventListener('change', (e) => {
            const newLang = e.target.value;
            localStorage.setItem('appLanguage', newLang); 
            fetchNews(newLang); 
            translateFooter(newLang); // 🟢 Se traduce el footer al cambiar de idioma
        });
    }

    fetchNews(savedLang);
    translateFooter(savedLang); // 🟢 Se traduce el footer al cargar por primera vez
});