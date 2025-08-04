document.addEventListener("DOMContentLoaded", () => {
	// === Lógica do Menu Mobile ===
	const openMenuButton = document.getElementById("open-menu");
	const closeMenuButton = document.getElementById("close-menu");
	const menuOverlay = document.getElementById("menu-overlay");
	const mobileMenu = document.getElementById("menu-mobile");

	if (menuOverlay && mobileMenu) {
		menuOverlay.classList.add("hidden-mobile-menu");
		mobileMenu.classList.add("slide-out-mobile");
	}

	const openMenu = () => {
		if (menuOverlay && mobileMenu) {
			menuOverlay.classList.remove("hidden-mobile-menu");
			mobileMenu.classList.remove("slide-out-mobile");
			menuOverlay.classList.add("open-mobile-menu");
			mobileMenu.classList.add("slide-in-mobile");
			document.body.style.overflow = "hidden";
		}
	};

	const closeMenu = () => {
		if (menuOverlay && mobileMenu) {
			menuOverlay.classList.remove("open-mobile-menu");
			mobileMenu.classList.remove("slide-in-mobile");
			menuOverlay.classList.add("hidden-mobile-menu");
			mobileMenu.classList.add("slide-out-mobile");

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

				if (
					menuOverlay &&
					!menuOverlay.classList.contains("hidden-mobile-menu")
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
});
