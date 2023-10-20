window.addEventListener('DOMContentLoaded', event => {
    const SIDEBAR_TOGGLE = document.body.querySelector('#sidebarToggle');
    if (SIDEBAR_TOGGLE) {
         if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
             document.body.classList.toggle('sb-sidenav-toggled');
         }
        SIDEBAR_TOGGLE.addEventListener('click', event => {
            event.preventDefault();
            document.body.classList.toggle('sb-sidenav-toggled');
            localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
        });
    }
});

