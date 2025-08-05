const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// Define o caminho absoluto para a pasta de arquivos estáticos (a pasta src)
const staticPath = path.join(__dirname);
app.use(express.static(staticPath));

// Define o caminho absoluto para a pasta de traduções (na raiz do projeto)
const localesPath = path.join(__dirname, "..", "locales");

// Middleware para ler cookies
app.use(cookieParser());

// Função para injetar traduções no HTML
const injectTranslations = (htmlContent, translations) => {
	// Percorre todas as chaves de tradução
	let translatedHtml = htmlContent;
	for (const key in translations) {
		if (translations.hasOwnProperty(key)) {
			const regex = new RegExp(`data-i18n="${key}"`, "g");
			translatedHtml = translatedHtml.replace(
				regex,
				`data-i18n="${key}">${translations[key]}`
			);
		}
	}

	// Lida com placeholders
	for (const key in translations) {
		if (translations.hasOwnProperty(key)) {
			const placeholderRegex = new RegExp(
				`data-i18n-placeholder="${key}"`,
				"g"
			);
			translatedHtml = translatedHtml.replace(
				placeholderRegex,
				`data-i18n-placeholder="${key}" placeholder="${translations[key]}"`
			);
		}
	}

	return translatedHtml;
};

// Endpoint para carregar os arquivos de tradução
app.get("/api/translations/:lang", (req, res) => {
	let lang = req.params.lang;
	if (lang === "pt") {
		lang = "pt-br";
	}
	const langFilePath = path.join(localesPath, `${lang}.json`);

	if (fs.existsSync(langFilePath)) {
		try {
			const translations = JSON.parse(
				fs.readFileSync(langFilePath, "utf8")
			);
			res.json(translations);
		} catch (error) {
			console.error(
				`[i18n] Erro ao analisar o arquivo JSON: ${langFilePath}`,
				error
			);
			res.status(500).send("Internal Server Error");
		}
	} else {
		console.error(
			`[i18n] Arquivo de tradução não encontrado: ${langFilePath}`
		);
		res.status(404).send("Not Found");
	}
});

// Endpoint para definir o cookie de idioma
app.post("/api/set-language/:lang", (req, res) => {
	const lang = req.params.lang;
	res.cookie("language", lang, { maxAge: 900000 });
	res.status(200).send(`Idioma definido para: ${lang}`);
});

// Rota principal que envia o arquivo HTML com as traduções injetadas
app.get("/", (req, res) => {
	const userLang = req.cookies.language || "pt-br";
	const htmlFilePath = path.join(staticPath, "index.html");

	if (fs.existsSync(htmlFilePath)) {
		const htmlContent = fs.readFileSync(htmlFilePath, "utf8");
		const langFilePath = path.join(localesPath, `${userLang}.json`);

		if (fs.existsSync(langFilePath)) {
			try {
				const translations = JSON.parse(
					fs.readFileSync(langFilePath, "utf8")
				);
				const translatedHtml = injectTranslations(
					htmlContent,
					translations
				);
				res.send(translatedHtml);
			} catch (error) {
				console.error(
					`[i18n] Erro ao analisar o arquivo JSON: ${langFilePath}`,
					error
				);
				res.status(500).send("Internal Server Error");
			}
		} else {
			console.warn(
				`[i18n] Arquivo de tradução não encontrado para ${userLang}. Enviando HTML original.`
			);
			res.sendFile(htmlFilePath);
		}
	} else {
		res.status(404).send("HTML file not found");
	}
});

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
