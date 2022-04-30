window.onload = function () {
    criarMenu();
    exibeConteudo('home');
    ajustarLinkHome();
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
CardDeck.prototype.mountImage = function (imagem) {
    const imageCard = $(document.createElement('img'));
    if (!imagem) {
        return imageCard;
    }
    imageCard.addClass('card-img-top');
    imageCard.addClass('mt-3');
    imageCard.attr('width', imagem.largura);
    imageCard.attr('height', imagem.altura);
    imageCard.attr('src', imagem.arquivo);
    imageCard.attr('alt', imagem.alt);
    return imageCard;
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
    this.mountImage(data.imagem).appendTo(divCard);
    this.mountBody(data.textoprincipal, data.outrosTextos).appendTo(divCard);
    return divCard;
};
CardDeck.prototype.mountHead = function (titulo) {
    if (!titulo) {
        return;
    }
    const divCardHead = $(document.createElement('div'));
    divCardHead.addClass("card-header");
    divCardHead.addClass("text-primary");
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

const exibeConteudo = function (link) {
    const pagina = $.get(`paginas/${link}/index.html`);
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
        return;
    }
    if (arquivoJson === undefined) {
        return;
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