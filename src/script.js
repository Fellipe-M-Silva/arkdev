document.addEventListener("DOMContentLoaded", async () => {
	// Torna a função assíncrona
	// === Dicionário de Conteúdo de Idiomas (será carregado dinamicamente) ===
	let languageContent = {};

	// Função para carregar as traduções do servidor
	const fetchTranslations = async (lang) => {
		try {
			const response = await fetch(`/api/translations/${lang}`);
			if (!response.ok) {
				throw new Error(`Failed to fetch translations for ${lang}`);
			}
			return await response.json();
		} catch (error) {
			console.error(error);
			return {};
		}
	};

	// Função para atualizar o conteúdo da página com o idioma selecionado
	const updateContent = async (lang) => {
		// Carrega o arquivo de tradução do servidor se ainda não foi feito
		if (!languageContent[lang]) {
			languageContent[lang] = await fetchTranslations(lang);
		}

		// Atualiza todos os elementos com o atributo data-i18n
		const elementsToTranslate = document.querySelectorAll("[data-i18n]");
		elementsToTranslate.forEach((element) => {
			const key = element.getAttribute("data-i18n");
			if (languageContent[lang] && languageContent[lang][key]) {
				element.textContent = languageContent[lang][key];
			}
		});

		// Atualiza os placeholders dos campos de formulário
		const placeholderElements = document.querySelectorAll(
			"[data-i18n-placeholder]"
		);
		placeholderElements.forEach((element) => {
			const key = element.getAttribute("data-i18n-placeholder");
			if (languageContent[lang] && languageContent[lang][key]) {
				element.placeholder = languageContent[lang][key];
			}
		});

		// Atualiza o atributo alt da imagem com base no idioma
		const imgElement = document.querySelector(".header-logo-image");
		if (
			imgElement &&
			languageContent[lang] &&
			languageContent[lang]["app_description"]
		) {
			imgElement.setAttribute(
				"alt",
				languageContent[lang]["app_description"]
			);
		}

		// Atualiza o título da página
		const titleElement = document.querySelector("title");
		if (
			titleElement &&
			languageContent[lang] &&
			languageContent[lang]["app_title"]
		) {
			titleElement.textContent = languageContent[lang]["app_title"];
		}

		// Atualiza as opções do select
		const howMetOptions = document.querySelectorAll("#how-met option");
		howMetOptions.forEach((option) => {
			const key = `form_option_${
				option.value.toLowerCase() || "placeholder"
			}`;
			if (languageContent[lang] && languageContent[lang][key]) {
				option.textContent = languageContent[lang][key];
			}
		});

		const currentLangElements =
			document.querySelectorAll(".language-option");
		currentLangElements.forEach((el) => {
			el.classList.remove("active");
			if (el.dataset.lang === lang) {
				el.classList.add("active");
			}
		});
	};

	// Carrega o idioma inicial e atualiza o conteúdo da página
	const getInitialLanguage = async () => {
		const savedLang = localStorage.getItem("language") || "pt-br";
		languageContent[savedLang] = await fetchTranslations(savedLang);
		await updateContent(savedLang);
		return savedLang;
	};

	// Aguarda a resolução da promessa para garantir que currentLanguage seja uma string
	let currentLanguage = await getInitialLanguage();

	// === Lógica do Modal de Idioma ===
	const languageToggleButton = document.getElementById(
		"language-toggle-button"
	);
	const languageModal = document.getElementById("language-modal");
	const languageOptions = document.querySelectorAll(".language-option");

	const openLanguageModal = () => {
		languageModal.classList.add("active");
	};

	const closeLanguageModal = () => {
		languageModal.classList.remove("active");
	};

	const setLanguage = async (lang) => {
		await fetch(`/api/set-language/${lang}`, { method: "POST" });
		currentLanguage = lang;
		await updateContent(currentLanguage);
		localStorage.setItem("language", currentLanguage);
		closeLanguageModal();
	};

	if (languageToggleButton) {
		languageToggleButton.addEventListener("click", openLanguageModal);
	}

	// Novo event listener para fechar o modal quando o usuário clica em qualquer lugar, exceto o modal
	document.addEventListener("click", (e) => {
		if (
			languageModal.classList.contains("active") &&
			!languageModal.contains(e.target) &&
			!languageToggleButton.contains(e.target)
		) {
			closeLanguageModal();
		}
	});

	languageOptions.forEach((option) => {
		option.addEventListener("click", () => {
			setLanguage(option.dataset.lang);
		});
	});

	// === Lógica do Menu Mobile ===
	const openMenuButton = document.getElementById("open-menu");
	const closeMenuButton = document.getElementById("close-menu");
	const menuOverlay = document.getElementById("menu-overlay");
	const mobileMenu = document.getElementById("menu-mobile");
	const body = document.body;

	const openMenu = () => {
		if (menuOverlay && mobileMenu) {
			menuOverlay.classList.add("menu-overlay-active");
			mobileMenu.classList.add("mobile-nav-open");
			body.style.overflow = "hidden";
		}
	};

	const closeMenu = () => {
		if (menuOverlay && mobileMenu) {
			menuOverlay.classList.remove("menu-overlay-active");
			mobileMenu.classList.remove("mobile-nav-open");

			// Aguarda a transição de opacidade do overlay terminar para reativar a rolagem
			menuOverlay.addEventListener(
				"transitionend",
				() => {
					if (
						!menuOverlay.classList.contains("menu-overlay-active")
					) {
						body.style.overflow = "auto";
					}
				},
				{ once: true }
			);
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
					mobileMenu.classList.contains("mobile-nav-open")
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
		heroSlides.forEach((slide) => {
			slide.classList.remove("active");
			// Remova a visibilidade do slide, mas mantenha-o no DOM para interação
		});
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
			heroProgressBar.style.transitionDuration = "0s";
			heroProgressBar.style.width = "0%";

			const currentProgressBarColor = progressBarColors.find(
				(colorClass) => heroProgressBar.classList.contains(colorClass)
			);
			if (currentProgressBarColor) {
				heroProgressBar.classList.remove(currentProgressBarColor);
			}
			heroProgressBar.classList.add(progressBarColors[index]);

			setTimeout(() => {
				heroProgressBar.style.transitionDuration = `${
					slideDuration / 1000
				}s`;
				heroProgressBar.style.width = "100%";
			}, 20);
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

	// === Lógica do Carrossel de Depoimentos (Corrigida) ===
	// O seletor foi atualizado para a nova classe CSS
	const testimonialCarousel = document.querySelector(
		".testimonial-carousel-container"
	);
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
				// Usa a variável `testimonialCarousel` para a rolagem
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
				// Usa a variável `testimonialCarousel` para a rolagem
				testimonialCarousel.scrollTo({
					left: currentScrollPosition,
					behavior: "smooth",
				});
			} else {
				// Se for o último, volta para o início
				currentScrollPosition = 0;
				// Usa a variável `testimonialCarousel` para a rolagem
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
			setFeedback(
				input,
				"invalid",
				languageContent[currentLanguage].form_error_required
			);
			return false;
		}

		if (input.type === "email" && !/^\S+@\S+\.\S+$/.test(value)) {
			setFeedback(
				input,
				"invalid",
				languageContent[currentLanguage].form_error_email
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
				languageContent[currentLanguage].form_error_phone
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

	// Event listener para a submissão do formulário
	contactForm.addEventListener("submit", async (event) => {
		event.preventDefault();

		let isFormValid = true;
		for (const field of formFields) {
			if (!validateField(field)) {
				isFormValid = false;
			}
		}

		if (isFormValid) {
			const data = {
				name: nameInput.value,
				email: emailInput.value,
				telephone: telephoneInput.value,
				howMet: howMetSelect.value,
				message: messageTextarea.value,
			};
			console.log(
				"Formulário enviado com sucesso!\n\nDados:\n" +
					JSON.stringify(data, null, 2)
			);

			contactForm.reset();
			formFields.forEach((field) => {
				setFeedback(field, "none");
			});
		}
	});

	// === Lógica de Troca de Tema (Versão Final e Robusta) ===
	const themeToggleButton = document.getElementById("theme-toggle-button");
	const themeIcon = document.getElementById("theme-icon");
	const htmlElement = document.documentElement;

	const applyTheme = (theme) => {
		if (theme === "dark") {
			htmlElement.classList.add("dark");
			themeIcon.textContent = "light_mode";
		} else {
			htmlElement.classList.remove("dark");
			themeIcon.textContent = "dark_mode";
		}
	};

	const savedTheme = localStorage.getItem("theme");

	if (savedTheme) {
		applyTheme(savedTheme);
	} else if (
		window.matchMedia &&
		window.matchMedia("(prefers-color-scheme: dark)").matches
	) {
		applyTheme("dark");
	} else {
		applyTheme("light");
	}

	themeToggleButton.addEventListener("click", () => {
		themeIcon.classList.add("shrink");

		setTimeout(() => {
			const currentTheme = htmlElement.classList.contains("dark")
				? "light"
				: "dark";
			applyTheme(currentTheme);
			localStorage.setItem("theme", currentTheme);
			themeIcon.classList.remove("shrink");
		}, 150);
	});
});
