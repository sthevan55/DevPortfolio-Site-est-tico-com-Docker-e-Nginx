/* DevPortfolio — interacoes em JavaScript puro, sem dependencias. */
(() => {
  'use strict';

  const root = document.documentElement;
  const themeToggle = document.querySelector('#theme-toggle');
  const menuToggle = document.querySelector('#menu-toggle');
  const navigation = document.querySelector('#site-nav');
  const topButton = document.querySelector('#back-to-top');
  const toast = document.querySelector('#toast');
  const dialog = document.querySelector('#project-dialog');
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  let toastTimer;

  // Tema salvo localmente no proprio navegador (nao exige backend).
  function applyTheme(theme) {
    root.dataset.theme = theme;
    if (themeToggle) {
      themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro');
      themeToggle.title = theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro';
    }
    if (themeMeta) themeMeta.content = theme === 'dark' ? '#090e1b' : '#f7f9ff';
  }

  try {
    const savedTheme = localStorage.getItem('devportfolio-theme');
    if (savedTheme === 'light' || savedTheme === 'dark') applyTheme(savedTheme);
  } catch (_) {
    // O site continua funcional se o navegador bloquear o armazenamento.
  }

  themeToggle?.addEventListener('click', () => {
    const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    try { localStorage.setItem('devportfolio-theme', nextTheme); } catch (_) { /* opcional */ }
  });

  // Menu acessivel em telas menores.
  function closeMenu() {
    navigation?.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', 'Abrir menu de navegação');
  }

  menuToggle?.addEventListener('click', () => {
    const open = navigation.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
  });

  navigation?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('click', (event) => {
    if (!navigation?.contains(event.target) && !menuToggle?.contains(event.target)) closeMenu();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 870) closeMenu();
  }, { passive: true });

  // Animacao somente ao entrar na area visivel. Sem JS, o conteudo permanece visivel.
  const revealElements = document.querySelectorAll('.reveal');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion && 'IntersectionObserver' in window) {
    root.classList.add('js-ready');
    const revealObserver = new IntersectionObserver((entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.07, rootMargin: '0px 0px -25px 0px' });
    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add('is-visible'));
  }

  // Destaca a secao aberta no menu.
  const sectionIds = ['inicio', 'sobre', 'habilidades', 'projetos', 'docker', 'contato'];
  const navLinks = Array.from(navigation?.querySelectorAll('a[href^="#"]') || []);
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (!visible.length) return;
      navLinks.forEach((link) => link.classList.toggle('is-current', link.getAttribute('href') === `#${visible[0].target.id}`));
    }, { rootMargin: '-20% 0px -60% 0px', threshold: 0 });
    sectionIds.forEach((id) => {
      const section = document.getElementById(id);
      if (section) sectionObserver.observe(section);
    });
  }

  // Filtro da galeria de projetos, preservando os elementos no HTML.
  const filterButtons = document.querySelectorAll('[data-filter]');
  const projectCards = document.querySelectorAll('.project-card[data-category]');
  const filterStatus = document.getElementById('filter-status');
  filterButtons.forEach((button) => button.addEventListener('click', () => {
    const selected = button.dataset.filter;
    filterButtons.forEach((option) => {
      const isActive = option === button;
      option.classList.toggle('is-active', isActive);
      option.setAttribute('aria-pressed', String(isActive));
    });
    let count = 0;
    projectCards.forEach((card) => {
      const show = selected === 'todos' || card.dataset.category === selected;
      card.hidden = !show;
      if (show) count += 1;
    });
    if (filterStatus) filterStatus.textContent = `${count} projeto${count === 1 ? '' : 's'} exibido${count === 1 ? '' : 's'}.`;
  }));

  // Conteudo do modal gerado localmente: os cards nao abrem links ficticios.
  const projectDetails = {
    nexus: {
      title: 'NEXUS ERP', category: 'SISTEMAS / GESTÃO',
      description: 'Conceito de aplicação para organização de operações empresariais, com recursos relacionados a estoque, vendas e indicadores de acompanhamento.',
      highlights: ['Painel de indicadores com foco na leitura rápida.', 'Organização de produtos e dados operacionais.', 'Estrutura visual de uma aplicação administrativa.'],
      tags: ['React', 'Python', 'Banco de dados']
    },
    studyhub: {
      title: 'StudyHub', category: 'WEB / EDUCAÇÃO',
      description: 'Ideia de plataforma acadêmica dedicada a tornar o processo de estudo mais organizado, com disciplinas, materiais de revisão e simulados.',
      highlights: ['Separação de conteúdos por disciplina.', 'Navegação intuitiva e foco em produtividade.', 'Estrutura preparada para diferentes tipos de estudo.'],
      tags: ['HTML/CSS', 'JavaScript', 'UI/UX']
    },
    climaview: {
      title: 'ClimaView', category: 'WEB / VISUALIZAÇÃO',
      description: 'Projeto de interface meteorológica que organiza temperaturas e outros indicadores climáticos em um painel de fácil compreensão.',
      highlights: ['Cartões responsivos para visualizar informações.', 'Representação gráfica de tendências climáticas.', 'Interface planejada para desktop e celular.'],
      tags: ['JavaScript', 'Chart.js', 'CSS3']
    },
    financeflow: {
      title: 'FinanceFlow', category: 'DADOS / FINANÇAS',
      description: 'Conceito de sistema para acompanhar entradas e saídas financeiras, priorizando a organização e a visualização dos dados.',
      highlights: ['Organização dos registros por categoria.', 'Visão consolidada de gastos e receitas.', 'Painéis para apoiar a análise de informações.'],
      tags: ['JavaScript', 'Python', 'SQL']
    }
  };

  document.querySelectorAll('[data-project]').forEach((button) => button.addEventListener('click', () => {
    const project = projectDetails[button.dataset.project];
    if (!project || !dialog) return;
    document.getElementById('dialog-title').textContent = project.title;
    document.getElementById('dialog-category').textContent = project.category;
    document.getElementById('dialog-description').textContent = project.description;
    const highlights = document.getElementById('dialog-highlights');
    const tags = document.getElementById('dialog-tags');
    highlights.replaceChildren();
    tags.replaceChildren();
    project.highlights.forEach((highlight) => {
      const li = document.createElement('li');
      li.textContent = highlight;
      highlights.appendChild(li);
    });
    project.tags.forEach((tag) => {
      const span = document.createElement('span');
      span.textContent = tag;
      tags.appendChild(span);
    });
    if (typeof dialog.showModal === 'function') dialog.showModal();
  }));

  document.getElementById('dialog-close')?.addEventListener('click', () => dialog?.close());
  dialog?.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 2700);
  }

  async function copyToClipboard(value) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard API indisponível');
      await navigator.clipboard.writeText(value);
      showToast('✓ Conteúdo copiado para a área de transferência!');
    } catch (_) {
      const field = document.createElement('textarea');
      field.value = value;
      field.setAttribute('readonly', '');
      field.style.position = 'fixed';
      field.style.opacity = '0';
      document.body.appendChild(field);
      field.select();
      const copied = document.execCommand('copy');
      field.remove();
      showToast(copied ? '✓ Conteúdo copiado para a área de transferência!' : 'Não foi possível copiar automaticamente.');
    }
  }

  document.querySelectorAll('[data-copy]').forEach((button) => button.addEventListener('click', () => {
    copyToClipboard(button.getAttribute('data-copy'));
  }));

  function updateScrollButton() {
    topButton?.classList.toggle('is-visible', window.scrollY > 480);
  }
  window.addEventListener('scroll', updateScrollButton, { passive: true });
  updateScrollButton();
  topButton?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

  const year = document.getElementById('current-year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
