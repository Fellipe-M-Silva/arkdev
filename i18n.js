const path = require("path");
const fs = require("fs");

const i18n = {};

i18n.translate = (req, res, next) => {
	const userLang = req.cookies.language || "pt"; // Usa cookie ou 'pt' como padrão
	const langFilePath = path.join(__dirname, "locales", `${userLang}.json`);

	// Verifica se o arquivo de idioma existe
	if (fs.existsSync(langFilePath)) {
		try {
			const translations = JSON.parse(
				fs.readFileSync(langFilePath, "utf8")
			);
			res.locals.t = (key) => translations[key] || key; // Função de tradução
		} catch (error) {
			console.error(
				`Error parsing translation file for ${userLang}:`,
				error
			);
			res.locals.t = (key) => key;
		}
	} else {
		console.warn(
			`Translation file not found for language: ${userLang}. Using default keys.`
		);
		res.locals.t = (key) => key;
	}

	next();
};

module.exports = i18n;
