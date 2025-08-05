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
	const heroProgressBar = document.getElementById("hero-progress-bar");

	let currentSlide = 0;
	let autoSlideInterval;
	const slideDuration = 15000;
	const imageSources = [
		"./media/images/placeholder.png",
		"./media/images/placeholder.png",
		"./media/images/placeholder.png",
	];

	const progressBarColors = [
		"progress-fill-petroleo",
		"progress-fill-ciberseguranca",
		"progress-fill-motores",
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

		if (heroProgressBar) {
			// 1. Remove a animação de transição para resetar a barra instantaneamente
			heroProgressBar.style.transitionDuration = "0s";
			heroProgressBar.style.width = "0%";

			// Remove todas as classes de cor anteriores e adiciona a nova
			heroProgressBar.classList.remove(...progressBarColors);
			heroProgressBar.classList.add(progressBarColors[index]);

			// 2. Aguarda um momento para que o navegador renderize o reset da barra
			setTimeout(() => {
				// 3. Adiciona a transição e inicia a animação de preenchimento
				heroProgressBar.style.transitionDuration = `${
					slideDuration / 1000
				}s`;
				heroProgressBar.style.width = "100%";
			}, 20); // 20ms é o suficiente para forçar a renderização
		}
	};

	const nextSlide = () => {
		currentSlide = (currentSlide + 1) % heroSlides.length;
		showSlide(currentSlide);
	};

	const startAutoSlide = () => {
		clearInterval(autoSlideInterval);
		autoSlideInterval = setInterval(nextSlide, slideDuration);
	};

	heroTabs.forEach((tab, index) => {
		tab.addEventListener("click", () => {
			currentSlide = index;
			showSlide(currentSlide);
			startAutoSlide(); // O temporizador é reiniciado ao clicar
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

	// === Lógica de Validação do Formulário (Revisada) ===
	const contactForm = document.getElementById("contact-form");
	const nameInput = document.getElementById("name");
	const emailInput = document.getElementById("email");
	const telephoneInput = document.getElementById("telephone");
	const howMetSelect = document.getElementById("how-met");
	const messageTextarea = document.getElementById("message");

	const formFields = [
		nameInput,
		emailInput,
		telephoneInput,
		howMetSelect,
		messageTextarea,
	];

	// Gerencia o feedback visual do campo (valid, invalid)
	const setFeedback = (input, state, message = "") => {
		const formGroup = input.parentElement;
		const helper = formGroup.querySelector(".helper-text");

		// Limpa classes de feedback anteriores
		formGroup.classList.remove("invalid", "valid");

		if (state === "invalid") {
			formGroup.classList.add("invalid");
			helper.textContent = message;
		} else if (state === "valid") {
			formGroup.classList.add("valid");
			helper.textContent = "";
		} else {
			helper.textContent = "";
		}
	};

	// Função de validação individual
	const validateField = (input) => {
		const value = input.value.trim();

		if (input.required && !value) {
			setFeedback(input, "invalid", "Este campo é obrigatório.");
			return false;
		}

		if (input.type === "email" && !/^\S+@\S+\.\S+$/.test(value)) {
			setFeedback(
				input,
				"invalid",
				"Por favor, insira um e-mail válido."
			);
			return false;
		}

		// Regex aprimorada para validar números de telefone com e sem máscara
		const phoneRegex =
			/^\+?(\d{2,3})\s?\(?(\d{2,3})\)?\s?(\d{4,5})[-.\s]?(\d{4})$/;
		if (input.id === "telephone" && !phoneRegex.test(value)) {
			setFeedback(
				input,
				"invalid",
				"Insira um número de telefone válido."
			);
			return false;
		}

		// Se passar, define como válido
		setFeedback(input, "valid");
		return true;
	};

	// Máscara de telefone
	const applyPhoneMask = (input) => {
		let value = input.value.replace(/\D/g, ""); // Remove tudo que não é dígito

		let maskedValue = "";
		if (value.length > 10) {
			// Formato brasileiro (+55 11 99999-9999)
			maskedValue = value.replace(
				/^(\d{2})(\d{2})(\d{5})(\d{4})$/,
				"+$1 ($2) $3-$4"
			);
		} else if (value.length > 9) {
			// Formato norte-americano (+1 555 555-5555)
			maskedValue = value.replace(
				/^(\d{1})(\d{3})(\d{3})(\d{4})$/,
				"+$1 ($2) $3-$4"
			);
		} else {
			maskedValue = input.value; // Não aplica a máscara se o número for muito curto
		}

		input.value = maskedValue;
	};

	// Adiciona o prefixo "+" no campo de telefone quando ele está vazio
	telephoneInput.addEventListener("focus", () => {
		if (!telephoneInput.value) {
			telephoneInput.value = "+";
		}
	});

	// Event listeners para a validação ao "clicar fora"
	formFields.forEach((field) => {
		field.addEventListener("blur", () => {
			validateField(field);
		});
	});

	// Event listener para a máscara de telefone
	telephoneInput.addEventListener("input", () => {
		applyPhoneMask(telephoneInput);
	});

	// Event listener para a submissão do formulário
	contactForm.addEventListener("submit", (event) => {
		event.preventDefault();

		let isFormValid = true;
		formFields.forEach((field) => {
			if (!validateField(field)) {
				isFormValid = false;
			}
		});

		if (isFormValid) {
			const data = {
				name: nameInput.value,
				email: emailInput.value,
				telephone: telephoneInput.value,
				howMet: howMetSelect.value,
				message: messageTextarea.value,
			};
			alert(
				"Formulário enviado com sucesso!\n\nDados:\n" +
				JSON.stringify(data, null, 2)
				
			);
			contactForm.reset();
			formFields.forEach(field => {
					setFeedback(field, "none");
			});
		}
	});
});
