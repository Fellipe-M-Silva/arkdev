document.addEventListener("DOMContentLoaded", () => {
	const meuBotao = document.getElementById("meuBotao");

	if (meuBotao) {
		meuBotao.addEventListener("click", () => {
			alert("Você clicou no botão! O JavaScript está funcionando.");
		});
	}

	console.log("Script.js carregado com sucesso!");
});
