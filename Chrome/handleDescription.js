$(function() {
    //Obligé d'attendre le chargement de la page avec un timeout car les éléments sont chargés après le chargement de la page
    setTimeout(function(){
        displayElements();
        addCompletedHelperBtn();
        inject();
    }, 2000);
});

function inject() {
    console.info("Injecting...");
    var leftHubContentLinks = $(".query-folder-tree.tree-view");
    $(leftHubContentLinks).on("click", function() {
        setTimeout(function(){
            displayElements();
            addCompletedHelperBtn();
            prepareTasksEvents();
        }, 300);
    });
    prepareTasksEvents();
}

function displayElements() {
    $(".tfs_helper_btn").remove();
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
    var toInsert = description.contentWindow.document.body.innerHTML;
    var workItemView = $(".work-item-view").filter(function () {
        return $(this).css('display') !== 'none';
    });
    var history = workItemView.find(".message-list").clone();
    console.log(history);
    $(history).hide();
    var historyCount = history.find(".message-section").length || 0;
    var historyBtn = $('<input id="historyBtn" type="checkbox"/>');
    historyBtn.on('change', function () {
        if (historyBtn[0].checked) {
            $(history).show();
        }
        else {
            $(history).hide();
        }
    });
    $(content.document.body).append("<h3>" + iframeTitle + "</h3>");
    $(content.document.body).append(toInsert);
    $(content.document.body).append(historyBtn);
    $(content.document.body).append('<label for="historyBtn">History (' + historyCount + ')</label>');
    $(content.document.body).append(history);
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

function prepareTasksEvents() {
    $(".grid-row.grid-row-normal").on('click', function(){
        setTimeout(function () {
            addCompletedHelperBtn();
        }, 300);
    });
}

function addCompletedHelperBtn() {
    $(".tfs_helper_el").remove();
    var workItemView = $(".work-item-view").filter(function () {
        return $(this).css('display') !== 'none';
    });
    var wiLabels = workItemView.find(".workitemcontrol-label");
    var completedWorkLabel;
    var completedWorkInput;
    for (var i = 0; i < wiLabels.length; i++) {
        if (wiLabels[i].title.indexOf("Completed Work]") !== -1) {
            completedWorkLabel = wiLabels[i];
        }
    }
    if (completedWorkLabel !== undefined) {
        completedWorkInput = $("#" + completedWorkLabel.htmlFor)[0];

        var addTimeBtn = $('<button class="tfs_helper_el" style="padding: 0 3px; margin-left: 5px; height: 20px; border: none;"><span class="icon icon-add-small"></span></button>');
        var addTimeInput = $('<input class="tfs_helper_el" type="text" style="display: none; width: 20px; margin-left: 5px; height: 20px !important; padding: 0;"/>');
        addTimeBtn.on('click', function () {
            addTimeBtn.hide();
            addTimeInput.show();
            addTimeInput.focus();
        });
        addTimeInput.on('keyup', function (e) {
            if (e.keyCode == 13) {
                if (addTimeInput.val() !== '') {
                    var t;
                    if (completedWorkInput.title === '') {
                        t = 0;
                    } else {
                        t = parseFloat(completedWorkInput.title);
                    }
                    t += parseFloat(addTimeInput.val());
                    if (t%1 === 0) {
                        completedWorkInput.title = t.toFixed(0);
                        $(completedWorkInput).val(t.toFixed(0));
                    } else {
                        completedWorkInput.title = t.toFixed(1);
                        $(completedWorkInput).val(t.toFixed(1));
                    }
                    var evt = document.createEvent("HTMLEvents");
                    evt.initEvent("change", false, true);
                    completedWorkInput.dispatchEvent(evt);
                }
                resetAddTimeInput();
            }
            if (e.keyCode == 27) {
                resetAddTimeInput();
            }
        });
        addTimeInput.on('blur', function () {
            resetAddTimeInput();
        });
        $(completedWorkLabel).append(addTimeBtn);
        $(completedWorkLabel).append(addTimeInput);
    }

    function resetAddTimeInput() {
        addTimeInput.val('');
        addTimeInput.hide();
        addTimeBtn.show();
    }
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
    if (request.action == "tfsh_reload") {
        displayElements();
        inject();
    }
});