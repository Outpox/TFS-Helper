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
        }, 250);
        //Timer pour attendre le chargement des nouvelles tâches dans le DOM
    });
}

function displayElements() {
    $(".tfs_helper_btn").remove();
    console.info("Description events loaded...");
    var el = $(".query-result-grid > .grid-canvas > .grid-row-normal");
    var menuBar = $(".toolbar.workitem-tool-bar .menu-bar");
    var liBtn = $("<li class='menu-item tfs_helper_btn'>Agrandir la description</li>");
    $(liBtn).on("click", function(){
        displayIframe();
    });
    menuBar.prepend(liBtn);
}

function displayIframe() {
	var content = window.open("", "content", "width=1000, height=800, scrollbars=yes");
    var rightPane = $("div.rightPane.hub-no-content-gutter");
    var iframes = rightPane.find("iframe");
    var description = iframes[0];
    var toInsert = description.contentWindow.document.body.innerHTML;;
    $(content.document.body).append(toInsert);
}