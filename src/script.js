document.addEventListener("DOMContentLoaded", () => {
	const openMenuButton = document.getElementById("open-menu");
	const closeMenuButton = document.getElementById("close-menu");
	const menuOverlay = document.getElementById("menu-overlay");
	const mobileMenu = document.getElementById("menu-mobile");

	// Função para abrir o menu
	const openMenu = () => {
		menuOverlay.classList.remove("hidden");
		menuOverlay.classList.remove("fade-out");
		menuOverlay.classList.add("fade-in");
		mobileMenu.classList.remove("slide-out");
		mobileMenu.classList.add("slide-in");
		document.body.style.overflow = "hidden"; // Impede rolagem do body
	};

	// Função para fechar o menu com animação
	const closeMenu = () => {
		menuOverlay.classList.remove("fade-in");
		menuOverlay.classList.add("fade-out");
		mobileMenu.classList.remove("slide-in");
		mobileMenu.classList.add("slide-out");

		// Adiciona a classe hidden e reativa a rolagem após a animação
		setTimeout(() => {
			menuOverlay.classList.add("hidden");
			document.body.style.overflow = "auto";
		}, 300); // O tempo do timeout deve corresponder à duração da sua animação (0.3s = 300ms)
	};

	// Adicionar ouvintes de evento para os botões
	openMenuButton.addEventListener("click", openMenu);
	closeMenuButton.addEventListener("click", closeMenu);

	// Fechar o menu ao clicar fora dele
	menuOverlay.addEventListener("click", (e) => {
		if (e.target === menuOverlay) {
			closeMenu();
		}
	});

	// Rolagem suave para os links do menu (ambos os menus)
	const allLinks = document.querySelectorAll("a[href^='#']");
	allLinks.forEach((link) => {
		link.addEventListener("click", (e) => {
			e.preventDefault();
			const targetId = e.currentTarget.getAttribute("href");
			const targetElement = document.querySelector(targetId);

			if (targetElement) {
				// Rola a página suavemente até o elemento
				window.scrollTo({
					top: targetElement.offsetTop,
					behavior: "smooth",
				});

				// Se o menu mobile estiver aberto, feche-o
				if (!menuOverlay.classList.contains("hidden")) {
					closeMenu();
				}
			}
		});
	});
});
