document.addEventListener("DOMContentLoaded", () => {
	// === Lógica do Menu Mobile ===
	const openMenuButton = document.getElementById("open-menu");
	const closeMenuButton = document.getElementById("close-menu");
	const menuOverlay = document.getElementById("menu-overlay");
	const mobileMenu = document.getElementById("menu-mobile");

	const openMenu = () => {
		if (menuOverlay && mobileMenu) {
			menuOverlay.classList.remove("opacity-0", "pointer-events-none");
			menuOverlay.classList.add("opacity-100");
			mobileMenu.classList.remove("translate-x-full");
			mobileMenu.classList.add("translate-x-0");
			document.body.style.overflow = "hidden";
		}
	};

	const closeMenu = () => {
		if (menuOverlay && mobileMenu) {
			menuOverlay.classList.remove("opacity-100");
			menuOverlay.classList.add("opacity-0", "pointer-events-none");
			mobileMenu.classList.remove("translate-x-0");
			mobileMenu.classList.add("translate-x-full");

			setTimeout(() => {
				document.body.style.overflow = "auto";
			}, 300);
		}
	};

	if (openMenuButton) openMenuButton.addEventListener("click", openMenu);
	if (closeMenuButton) closeMenuButton.addEventListener("click", closeMenu);
	if (menuOverlay) {
		menuOverlay.addEventListener("click", (e) => {
			if (e.target === menuOverlay) {
				closeMenu();
			}
		});
	}

	// === Lógica de Rolagem Suave e Fechamento do Menu ===
	// Seleciona os links do menu principal e do menu mobile
	const allLinks = document.querySelectorAll("a[href^='#']");

	allLinks.forEach((link) => {
		link.addEventListener("click", (e) => {
			e.preventDefault();
			const targetId = e.currentTarget.getAttribute("href");
			const targetElement = document.querySelector(targetId);

			if (targetElement) {
				window.scrollTo({
					top: targetElement.offsetTop - 72,
					behavior: "smooth",
				});

				// Verifica se o menu mobile está aberto e o fecha
				if (
					mobileMenu &&
					!mobileMenu.classList.contains("translate-x-full")
				) {
					closeMenu();
				}
			}
		});
	});

	// === Lógica do Carrossel do Hero ===
	const heroTabs = document.querySelectorAll("#caroussel-tabs ul li");
	const heroSlides = document.querySelectorAll(".hero-slide");
	const heroMaskedImage = document.getElementById("hero-masked-image");

	let currentSlide = 0;
	let autoSlideInterval;
	const imageSources = [
		"./media/images/placeholder.png",
		"./media/images/placeholder.png",
		"./media/images/placeholder.png",
	];

	const showSlide = (index) => {
		heroSlides.forEach((slide) => slide.classList.remove("active"));
		heroTabs.forEach((tab) => tab.classList.remove("active"));

		heroSlides[index].classList.add("active");
		heroTabs[index].classList.add("active");

		if (heroMaskedImage) {
			heroMaskedImage.style.backgroundImage = `url('${imageSources[index]}')`;
			heroMaskedImage.style.backgroundSize = "cover";
			heroMaskedImage.style.backgroundPosition = "center";
			heroMaskedImage.style.backgroundRepeat = "no-repeat";
		}
	};

	const nextSlide = () => {
		currentSlide = (currentSlide + 1) % heroSlides.length;
		showSlide(currentSlide);
	};

	const startAutoSlide = () => {
		clearInterval(autoSlideInterval);
		autoSlideInterval = setInterval(nextSlide, 15000);
	};

	heroTabs.forEach((tab, index) => {
		tab.addEventListener("click", () => {
			currentSlide = index;
			showSlide(currentSlide);
			startAutoSlide();
		});
	});

	if (heroSlides.length > 0) {
		showSlide(currentSlide);
		startAutoSlide();
	}

	// === Lógica do Carrossel de Depoimentos ===
	const testimonialCarousel = document.querySelector(".testimonial-carousel");
	const prevButton = document.getElementById("prev-testimonial");
	const nextButton = document.getElementById("next-testimonial");
	const testimonialItems = document.querySelectorAll(".testimonial");

	if (
		testimonialCarousel &&
		prevButton &&
		nextButton &&
		testimonialItems.length > 0
	) {
		const itemWidth = testimonialItems[0].offsetWidth + 24; // Largura do item + gap (gap-6 = 24px)
		let currentScrollPosition = 0;

		// Navega para a esquerda (depoimento anterior)
		prevButton.addEventListener("click", () => {
			if (currentScrollPosition > 0) {
				currentScrollPosition -= itemWidth;
				testimonialCarousel.scrollTo({
					left: currentScrollPosition,
					behavior: "smooth",
				});
			}
		});

		// Navega para a direita (próximo depoimento) e reseta no final
		nextButton.addEventListener("click", () => {
			const maxScroll =
				testimonialCarousel.scrollWidth -
				testimonialCarousel.clientWidth;

			// Se não for o último item, avança
			if (currentScrollPosition < maxScroll) {
				currentScrollPosition += itemWidth;
				testimonialCarousel.scrollTo({
					left: currentScrollPosition,
					behavior: "smooth",
				});
			} else {
				// Se for o último, volta para o início
				currentScrollPosition = 0;
				testimonialCarousel.scrollTo({
					left: currentScrollPosition,
					behavior: "smooth",
				});
			}
		});
	}
});
