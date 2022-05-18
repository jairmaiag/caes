window.onload = function () {
    criarMenu();
    exibeConteudo('home');
    ajustarLinkHome();
    window.litaPais = [];
    window.litaFilhotes = [];

    window.jsonPais = $.getJSON('assets/json/caes.json');
    window.jsonPais.done(data => {
        const { lista } = data;
        lista.forEach((dado, index) => {
            const { id, nome, nascimento, sexo, raca, descricao } = dado;
            lista[index].linkDetalhe = `<a href='#/cao/${id}' onclick="exibeConteudo('detalhes')">`;
            lista[index].titulo = `${lista[index].linkDetalhe}${nome}</a>`;
            lista[index].textoprincipal = `Descrição: ${descricao}`;
            textos = [];
            textos.push(`Raça: ${raca}`);
            textos.push("Sexo: " + (sexo === "F" ? "Fêmea" : "Macho"));
            const { toString } = trataDate(new Date(nascimento), true);
            textos.push(`Nascimento: ${toString}`);
            lista[index].outrosTextos = textos;
            window.litaPais.push(dado);
        });
    });

    window.jsonFilhotes = $.getJSON('assets/json/filhotes.json');
    window.jsonFilhotes.done(data => {
        const { lista: filhotes } = data;
        filhotes.forEach((cao, index) => {
            const { id, nome, nascimento, paiId, maeId, sexo, raca, descricao, valor, vendido } = cao;
            if(!vendido){
                const pai = findCao(paiId);
                const mae = findCao(maeId);
                filhotes[index].linkDetalhe = `<a href='#/filhotes/${id}' onclick="exibeConteudo('detalhes')">`;
                filhotes[index].titulo = `${filhotes[index].linkDetalhe}${nome}</a>`;
                filhotes[index].textoprincipal = `Descrição: ${descricao}`;
                filhotes[index].pai = pai;
                filhotes[index].mae = mae;
                textos = [];
                textos.push(`Raça: ${raca}`);
                textos.push("Sexo: " + (sexo === "F" ? "Fêmea" : "Macho"));
                const { toString } = trataDate(new Date(nascimento), true);
                textos.push(`Nascimento: ${toString}`);
                textos.push(`Pai: <a href='#/caes/${pai.id}' onclick="exibeConteudo('detalhes')">${pai.nome}</a>`);
                textos.push(`Mãe: <a href='#/caes/${mae.id}' onclick="exibeConteudo('detalhes')">${mae.nome}</a>`);
                const real = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
                textos.push(`Valor: ${real}`);
                filhotes[index].outrosTextos = textos;
                window.litaFilhotes.push(filhotes[index]);
            }
        });
    });
    delete window.jsonPais;
    delete window.jsonFilhotes;
}
function findCao(id, tipo) {
    if (!id) {
        return null;
    }
    let jsonCao;
    if (!tipo) {
        jsonCao = window.litaPais.filter(cao => cao.id == id)[0];
    } else {
        jsonCao = window.litaFilhotes.filter(cao => cao.id == id)[0];
    }
    return jsonCao;
}
function findFilhotes(id, tipo) {
    return window.litaFilhotes.filter(cao => tipo ? cao.paiId === id : cao.maeId === id);
}
function Detalhes(dados, destino) {
    this.dados = dados;
    this.destino = $(`#${destino}`);

}
Detalhes.prototype.mount = function () {
    const tabela = $('#tabBodyCao');
    const trbody = $(document.createElement('tr'));
    const { nome, nascimento, sexo, raca, descricao, pai, mae, filhotes } = this.dados;
    const descri = $('#descricao');
    descri.html(descricao);

    criarTh(nome, trbody);
    const { toString } = trataDate(new Date(nascimento), true);
    criarTd(toString, trbody);
    criarTd((sexo === "F" ? "Fêmea" : "Macho"), trbody);
    criarTd(raca, trbody);

    if (pai) {
        criarTd(pai.nome, trbody);
    }
    if (mae) {
        criarTd(mae.nome, trbody);
    }
    if (filhotes && filhotes.length > 0) {
        const div = $('#divFilhotes');
        div.removeClass('ocultar');
        const tabF = $('#tabFilhotes');
        tabF.removeClass('ocultar');
        const bodyF = $('#tabBodyFilho');
        filhotes.forEach(f => {
            const tr = $(document.createElement('tr'));
            const linkNome = `${f.linkDetalhe}${f.nome}</a>`;
            criarTh(linkNome, tr);
            const { toString } = trataDate(new Date(f.nascimento), true);
            criarTd(toString, tr);
            criarTd((f.sexo === "F" ? "Fêmea" : "Macho"), tr);
            criarTd(f.raca, tr);
            criarTd(f.pai.nome, tr);
            criarTd(f.mae.nome, tr);
            tr.appendTo(bodyF);
        });
    }
    trbody.appendTo(tabela);
    this.fotos();
}
Detalhes.prototype.fotos = function () {
    const divFotos = $('#divFotos');
    const {  imagens } = this.dados;
    if (imagens && imagens.length > 0) {
        imagens.forEach(im => {
            const image = criarImage(im);
            image.addClass('mr-3');
            image.addClass('mt-3');
            image.appendTo(divFotos);
        });
    }
}
function criarImage(imagem) {
    const imagePrincipal = $(document.createElement('img'));
    imagePrincipal.addClass('rounded');
    imagePrincipal.attr('width', imagem.largura);
    imagePrincipal.attr('height', imagem.altura);
    imagePrincipal.attr('src', imagem.arquivo);
    imagePrincipal.attr('alt', imagem.alt);
    return imagePrincipal;
}
function criarTd(conteudo, tr) {
    const td = $(document.createElement('td'));
    td.html(conteudo);
    td.appendTo(tr);
}
function criarTh(conteudo, tbody) {
    const th = $(document.createElement('th'));
    th.attr('scope', 'row');
    th.html(conteudo);
    th.appendTo(tbody);
}

function CardDeck(dados, destino) {
    this.dados = dados;
    this.cardDecks = [];
    this.cards = [];
    this.destino = destino;
    this.mount();
    this.toString();
}
CardDeck.prototype.mount = function () {
    const resto = this.dados.length % 3;
    let divCardDeck = this.mountCardDeck();
    this.cardDecks.push(divCardDeck);
    this.dados.forEach((data, i) => {
        if (i > 0 && (i % 3) === 0) {
            divCardDeck = this.mountCardDeck();
            this.cardDecks.push(divCardDeck);
        }
        const card = this.mountCard(data);
        this.cards.push(card);
        card.appendTo(divCardDeck);
    });
    if (resto !== 0) {
        for (let i = 1; i <= (3 - resto); i++) {
            const card = this.mountCard({}, true);
            this.cards.push(card);
            card.appendTo(divCardDeck);
        }
    }
    return divCardDeck;
};
CardDeck.prototype.mountCardDeck = function () {
    const divCardDeck = $(document.createElement('div'));
    divCardDeck.addClass("card-deck");
    divCardDeck.addClass("row");
    divCardDeck.addClass("mb-3");
    return divCardDeck;
}
CardDeck.prototype.mountImage = function (data) {
    let { imagem, linkDetalhe } = data;
    const imageCard = $(document.createElement('img'));
    const aDetalhe = $(linkDetalhe);
    if (imagem === undefined || imagem === null || imagem.length === 0) {
        imagem = {
            arquivo: 'assets/images/logo.png',
            alt: 'logo',
            largura: 200,
            altura: 400
        }
    }
    imageCard.addClass('card-img-top');
    imageCard.attr('width', imagem.largura);
    imageCard.attr('height', imagem.altura);
    imageCard.attr('src', imagem.arquivo);
    imageCard.attr('alt', imagem.alt);
    if (imagem.idmodal) {
        const linkImageCard = $(document.createElement('a'));
        linkImageCard.attr('data-toggle', 'modal');
        linkImageCard.attr('data-target', imagem.idmodal);
        linkImageCard.attr('href', '#');
        imageCard.appendTo(linkImageCard);
        return linkImageCard;
    }
    imageCard.appendTo(aDetalhe);
    return aDetalhe;
};
CardDeck.prototype.mountCard = function (data, vazio) {
    const divCard = $(document.createElement('div'));
    divCard.addClass("card");
    if (vazio) {
        divCard.addClass("border-0");
        return divCard;
    } else {
        divCard.addClass("shadow");
        divCard.addClass("rounded");
    }
    this.mountHead(data.titulo).appendTo(divCard);
    this.mountImage(data).appendTo(divCard);
    this.mountBody(data.textoprincipal, data.outrosTextos).appendTo(divCard);
    return divCard;
};
CardDeck.prototype.mountHead = function (titulo) {
    const divCardHead = $(document.createElement('div'));
    divCardHead.addClass("card-header");
    divCardHead.addClass("text-primary");
    if (!titulo) {
        return divCardHead;
    }
    divCardHead.html(titulo);
    return divCardHead;
}
CardDeck.prototype.mountBody = function (mainText, textos) {
    const divCardBody = $(document.createElement('div'));
    divCardBody.addClass("card-body");
    if (!mainText) {
        return divCardBody;
    }
    new TextCard(mainText, divCardBody);
    if (textos && textos.length > 0) {
        textos.forEach(texto => {
            new TextCard(texto, divCardBody);
        });
    }
    return divCardBody;
}
CardDeck.prototype.toString = function () {
    this.cardDecks.forEach(cardeck => {
        cardeck.appendTo(this.destino);
    });
}
function TextCard(text, target) {
    this.text = text;
    this.target = target;
    this.mount();
}
TextCard.prototype.mount = function () {
    const paragrafo = $(document.createElement('p'));
    paragrafo.addClass("card-text");
    paragrafo.html(this.text);
    paragrafo.appendTo(this.target);
}
const montarListaCards = function (dados, destino) {
    new CardDeck(dados, destino);
}
const ajustarLinkHome = function () {
    const link = window.location.href;
    const logoMenu = $('#linklogomenu');
    logoMenu.attr('href', link);
    const logoBanner = $('#linkbanner');
    logoBanner.attr('href', link);
}
const criarParagrafoCard = function (texto) {
    const paragrafo = $(document.createElement('p'));
    paragrafo.addClass("card-text");
    paragrafo.html(texto);
    return paragrafo;
};

const exibeConteudo = function (link, id) {
    const endereco = `paginas/${link}/index.html`;
    const pagina = $.get(endereco);
    pagina.done(data => {
        const pirncipal = $('main');
        pirncipal.html(data);
    });
};
const clickLink = function (event) {
    const idClicado = event.target.id;
    const pagina = $(event.target).attr('href');
    const lista = $('.nav-item');
    event.preventDefault();
    for (let i = 0; i < lista.length; i++) {
        let item = $(lista[i]);
        let id = item.children().attr('id');
        item.removeClass('active');
        if (idClicado == id) {
            item.addClass('active');
        }
    }
    if (pagina != '#') {
        exibeConteudo(pagina);
    }
    const botaoHamburger = $('#hamburger');
    if (!botaoHamburger.hasClass('collapsed')) {
        botaoHamburger.addClass('collapsed');

    }
    const divMenuPrincipal = $('#menuprincipal');
    if (divMenuPrincipal.hasClass('show')) {
        divMenuPrincipal.removeClass('show');
    }
};
const criarMenu = function () {
    const jsonMenu = getMenu();
    jsonMenu.done(data => {
        const nav = $('nav');
        const divMenu = $(document.createElement('div')).attr('id', 'menuprincipal');
        const rodape = $('#containerRodape');
        const divLinksRodape = $(document.createElement('div')).attr('id', 'linksRodape');
        const ulRodape = $(document.createElement('ul'));
        const pRodape = $(document.createElement('p'));
        const copyRightRodape = $(document.createElement('em')).attr('aria-hidden', 'true');
        copyRightRodape.addClass('fa');
        copyRightRodape.addClass('fa-copyright');
        copyRightRodape.html('');

        ulRodape.addClass('list-unstyled');
        pRodape.addClass('container');
        pRodape.addClass('text-center');
        pRodape.html('Copyrigth ');
        copyRightRodape.appendTo(pRodape);

        const contato = $(document.createElement('span'));
        const linkEmail = `<a href="mailto:jairmaiag@gmail.com?subject=Informações%20sobre%20projetos" target="_blank" title="Enviar email" id="contatoDesenvolvedor">Jair M. Diniz</a>`
        contato.html(` 2022 | ${linkEmail}`);

        divLinksRodape.appendTo(rodape);
        contato.appendTo(pRodape);
        pRodape.appendTo(rodape);

        divMenu.addClass('collapse');
        divMenu.addClass('navbar-collapse');
        divMenu.appendTo(nav);

        const ulMneu = $(document.createElement('ul'));
        ulMneu.attr('id', 'listaMenu');
        ulMneu.addClass('navbar-nav');
        ulMneu.addClass('mr-auto');

        ulMneu.appendTo(divMenu);
        data.itensMenu.forEach((item, index) => {
            const menu = $(document.createElement('li'));
            const link = $(document.createElement('a'));

            const liRodape = $(document.createElement('li'));
            const linkRodape = $(document.createElement('a'));
            linkRodape.click(clickLink);

            link.addClass('nav-link');
            link.addClass('corFontMenu');
            link.click(clickLink);

            menu.addClass('nav-item');
            if (index === 0) {
                menu.addClass('active');
            }
            link.attr('href', item.link);
            link.html(`${item.label}`);
            link.attr('id', `${item.id}_${item.label}`);

            link.appendTo(menu);
            menu.appendTo(ulMneu);

            linkRodape.attr('href', item.link);
            linkRodape.html(`${item.label}`);

            linkRodape.appendTo(liRodape);
            liRodape.appendTo(ulRodape);
        });
        ulRodape.appendTo(divLinksRodape);
    });
};
const getMenu = function () {
    const jsonMenu = $.getJSON('assets/json/menu.json');
    return jsonMenu;
}
const montarCarrossel = function (idDivCarrossel, arquivoJson) {
    if (idDivCarrossel === undefined) {
        return null;
    }
    if (arquivoJson === undefined) {
        return null;
    }
    const carro = $(`#${idDivCarrossel}`);
    const jsonCarro = $.getJSON(`assets/json/${arquivoJson}`);
    jsonCarro.done(data => {
        const divInner = $(document.createElement('div'));
        divInner.addClass('carousel-inner');

        const olIndicador = $(document.createElement('ol'));
        olIndicador.addClass('carousel-indicators');
        data.imagens.forEach((image, index) => {
            const liIndicador = $(document.createElement('li'));
            liIndicador.attr('data-target', `#${idDivCarrossel}`);
            liIndicador.attr('data-slide-to', index);
            const divCarroItem = $(document.createElement('div'));
            divCarroItem.addClass('carousel-item')
            if (index === 0) {
                liIndicador.addClass('active');
                divCarroItem.addClass('active');
            }
            const imgImagem = $(document.createElement('img'));
            imgImagem.addClass('d-block');
            imgImagem.addClass('w-100');

            imgImagem.appendTo(divCarroItem);
            imgImagem.attr('src', `${image.local}/${image.nome}`);
            imgImagem.attr('alt', `${image.textoAlternativo}`);
            imgImagem.attr('width', `${image.largura}`);
            imgImagem.attr('height', `${image.largura}`);

            liIndicador.appendTo(olIndicador);
            divCarroItem.appendTo(divInner);

            const divLegendaItem = $(document.createElement('div'));
            divLegendaItem.addClass('carousel-caption');
            divLegendaItem.addClass('d-none');
            divLegendaItem.addClass('d-md-block');
            divLegendaItem.addClass('fundo-carousel-caption');
            divLegendaItem.appendTo(divCarroItem);

            const h5TituloLegenda = $(document.createElement('h5'));
            h5TituloLegenda.html(`${image.tituloSlide}`);
            h5TituloLegenda.appendTo(divLegendaItem);

            const pTextoLegenda = $(document.createElement('p'));
            pTextoLegenda.html(`${image.descricaoSlide}`);
            pTextoLegenda.appendTo(divLegendaItem);
        });
        olIndicador.appendTo(carro);
        divInner.appendTo(carro);
        const aAnterior = $(document.createElement('a'));
        aAnterior.addClass('carousel-control-prev');
        aAnterior.attr('href', `#${idDivCarrossel}`);
        aAnterior.attr('role', `button`);
        aAnterior.attr('data-slide', `prev`);

        const spAnteriorIcon = $(document.createElement('span'));
        spAnteriorIcon.addClass('carousel-control-prev-icon')
        spAnteriorIcon.attr(`aria-hidden`, 'true');
        spAnteriorIcon.appendTo(aAnterior);

        const spAnteriorSr = $(document.createElement('span'));
        spAnteriorSr.addClass('sr-only');
        spAnteriorSr.html('Anterior')
        spAnteriorSr.appendTo(aAnterior);

        aAnterior.appendTo(carro);

        const aProximo = $(document.createElement('a'));
        aProximo.addClass('carousel-control-next');
        aProximo.attr('href', `#${idDivCarrossel}`);
        aProximo.attr('role', `button`);
        aProximo.attr('data-slide', `next`);

        const spProximoIcon = $(document.createElement('span'));
        spProximoIcon.addClass('carousel-control-next-icon')
        spProximoIcon.attr(`aria-hidden`, 'true');
        spProximoIcon.appendTo(aProximo);

        const spProximoSr = $(document.createElement('span'));
        spProximoSr.addClass('sr-only');
        spProximoSr.html('Próximo')
        spProximoSr.appendTo(aProximo);

        aProximo.appendTo(carro);
        carro.carousel();
    });
}
const trataDate = function (date, comIdade) {
    if (!date) {
        return null;
    }
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const dia = day < 10 ? "0" + day : day;
    const mes = month < 10 ? "0" + month : month;
    let anos = null;
    let meses = null;
    let dias = null;

    if (comIdade) {
        let agora = new Date();
        anos = agora.getFullYear() - date.getFullYear();
    }
    return {
        toString: dia + "/" + mes + "/" + date.getFullYear(),
        anos: anos,
        meses: meses,
        dias: dias
    }
}