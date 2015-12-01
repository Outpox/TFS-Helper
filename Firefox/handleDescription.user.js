// ==UserScript==
// @name        TFS Helper
// @namespace   tfsh
// @description Ajoute un bouton pour ouvrir la description d'une tâche dans une nouvelle fenêtre
// @include     http://tfs2013:8080/tfs/JuxtaCollection/*
// @version     1.5
// @grant       none
// ==/UserScript==

$(function() {
    //Obligé d'attendre le chargement de la page avec un timeout car les éléments sont chargés après le chargement de la page
    setTimeout(function(){
        displayElements();
        inject();
    }, 2000);
});

function inject() {
    console.info("Injecting...");
    var leftHubContentLinks = $(".query-folder-tree.tree-view");
    $(leftHubContentLinks).on("click", function() {
        setTimeout(function(){
            displayElements();
        }, 300);
        //Timer pour attendre le chargement des nouvelles tâches dans le DOM
    });
}

function displayElements() {
    $(".tfs_helper_btn").remove();
    console.info("Description events loaded...");
    var el = $(".query-result-grid > .grid-canvas > .grid-row-normal");
    var menuBar = $(".toolbar.workitem-tool-bar .menu-bar");
    // var liBtn = $("<li class='menu-item tfs_helper_btn'>Agrandir la description</li>");
    var liBtn = $("<li class='menu-item right-align tfs_helper_btn'><img style='position:relative;top:2px;' width='16' height='16' title='Zoom description' alt='' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAAAQAAAAEABcxq3DAAAA40lEQVQ4y6XTMU7DQBQE0IdFgYSEayjSRTInoOEMSXwRanpukDpdkoaKROIGHAApBZQ0UQ5Aj2l+pJW1CQuM9GXt/PF49nuXf+LkAH+NEZpYv2ONt58ML7DAF3Z4jtoFtwhNFjVesUWLKulVwW1DU+cM5iEYJNxN1B6D0Mz7LzcRse3xy6gUbWibfTSYxD5XBYNfhXYCp0EOsQnnW9wlW4DHeE7xEtphmuAvOEsX9zGcvmFuBlVol2mCJ1xiXPDlMa5yjd/8xi6TrPggdYcMOH6Uu17NKLtM55n+Jx7wUTCz4/gGyXY8T/fqxF8AAAAASUVORK5CYII=' /></li>");
    $(liBtn).hover(function() {
        $(this).toggleClass("hover");
    });
    $(liBtn).on("click", function() {
        displayIframe();
    });
    menuBar.append(liBtn);
}

function displayIframe() {
	var content = window.open("", "content", "width=1000, height=800, scrollbars=yes");
    var rightPane = $("div.rightPane.hub-no-content-gutter");
    var iframes = rightPane.find("iframe");
    var id = findIframeId();
    var description = iframes[id];
    var workItem = document.querySelectorAll(".caption")[0].innerText;
    var title = document.querySelectorAll(".info-text")[0].innerText;
    var iframeTitle = workItem + " " + title;
    var toInsert = description.contentWindow.document.body.innerHTML;;
    $(content.document.body).append("<h3>" + iframeTitle + "</h3>");
    $(content.document.body).append(toInsert);
    $(content.document.body).append("<hr>");
}

function fullscreenWorkItem() {
    return window.location.hash.match(/(id=\d+)/) !== null;
}

function findIframeId() {
    var iframes = $("div.rightPane.hub-no-content-gutter").find("iframe");
    for (var i = 0; i < iframes.length; i++) {
        var iframeDocument = iframes[i].contentDocument || iframes[i].contentWindow.document;
        if (iframeDocument) {
            iframeContent = iframeDocument.getElementsByTagName('body');
            if (iframeContent[0].innerHTML.length > 0) {
                return i; 
            }
        }
    }
    return 0;
}