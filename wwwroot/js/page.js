//Autocomplation flag
var autoCopleteActivated = false;

//Result array for searched entities
var finalArray = [];

searchBarAutoCompleteActivate();

function searchBarAutoCompleteActivate() {
    var words = [];
    var data = {};
    $('#qryinput').textcomplete([{
        match: /(^|\b)(\w{2,})$/,
        search: function (term, callback) {

            data = searchTextOnWikidata($('#qryinput').val());
            words = [];
            data.search.forEach(element => {
                words.push(element.label);
            });
            callback($.map(words, function (word) {
                return word;
            }));
        },
        replace: function (word) {
            var i = 0;
            for (i; i < words.length; i++) {
                if (words[i] == word) {
                    break;
                }
            }

            $('#qryinput').remove();
            $('#queryInputHolder').append('<textarea id="qryinput" type="text" style="resize: none; height: 26px;">' + data.search[i].title +'</textarea>');

            searchBarAutoCompleteActivate();

            return data.search[i].title;
        }
    }], {
        maxCount: 20,
        onKeydown: function (e, commands) {
            if (e.keyCode === 39) {
                var activeLi = $("ul[id*=textcomplete-dropdown] li.active");
                var activeIndex = activeLi.index();

                imageQ = "https://www.wikidata.org/w/api.php?action=wbgetclaims&entity=" + data.search[
                        activeIndex].title +
                    "&property=P18&format=json"

                imageSource = '';

                try {
                    var imgText = searchWithGivenQuery(imageQ).claims.P18[0].mainsnak.datavalue.value.split(' ')
                        .join(
                            '_');
                    var hash = md5(imgText);
                    var a = hash.substring(0, 1);
                    var b = hash.substring(1, 2);
                    imageSource = "https://upload.wikimedia.org/wikipedia/commons/" + a + "/" + a + b +
                        "/" + imgText;
                } catch (e) {
                    console.log("Image not found");
                }
                openDiag(words[activeIndex], imageSource, data.search[activeIndex].description);
                return true;
            }
        }
    });
}

function convertStringToJson(JsonString){
    if(JsonString == ""){
        return;
    }
    var jsonThing = JSON.parse(JsonString);
    return jsonThing;
}

function addNewItemToArray(JsonArray, title){
    var flag = false;
    JsonArray.forEach(job => {
        if(job.item == title){
            flag = true;
            job.count++;
        }
    });

    if(!flag){
        JsonArray.push({
            "count":1,
            "item":title,
        })
    }
}

function getPropertiesOfItem(item){
    responseArray = [];
    var response = searchWithGivenQuery("https://www.wikidata.org/wiki/Special:EntityData/" + item + ".json");
        var entities = response.entities;
        for (var entity in entities) {
            var tempArray = [];
            var claims = entities[entity].claims;
            for (var t in claims) {
                var claim = claims[t];
                for (var k in claim) {
                    try {
                        var value = claim[k].mainsnak.datavalue.value;
                        var id = value.id;
                        if (id != null) {
                            tempArray.push(id);
                        }
                    } catch (error) {}
                }
            }
        }
        return tempArray;
}

function annotationAutoCompleteActivate() {
    var words = [];
    var data = {};
    $('#textarea').textcomplete([{
        match: /(^|\b)(\w{2,})$/,
        search: function (term, callback) {

            data = searchTextOnWikidata($('#textarea').val());
            words = [];
            data.search.forEach(element => {
                words.push(element.label);
            });
            callback($.map(words, function (word) {
                return word;
            }));
        },
        replace: function (word) {
            var i = 0;
            for (i; i < words.length; i++) {
                if (words[i] == word) {
                    break;
                }
            }
            
            //Adds title to memory body
            AddTitleToMemo(i);

            //Add related instances to memory body
            AddInstancesToMemo(i);

            //Add related subclasses to memory body
            AddSubclassesToMemo(i);

            //Add related properties to memory body
            AddPropertiesToMemo(i);

            $('.ql-editor').append('<a class="wikidata" data-instances="21627" href="' + data.search[i].url + '">' + word + '</a>');
            $('#textarea').remove();
            $('#textDiv').append('<textarea class="form-control" id="textarea" style="resize: none;"></textarea>');

            annotationAutoCompleteActivate();
            return '';
        }
    }], {
        maxCount: 20,
        onKeydown: function (e, commands) {

            if (e.keyCode === 39) {
                var activeLi = $("ul[id*=textcomplete-dropdown] li.active");
                var activeIndex = activeLi.index();

                imageQ = "https://www.wikidata.org/w/api.php?action=wbgetclaims&entity=" + data.search[
                        activeIndex].title +
                    "&property=P18&format=json"

                imageSource = '';

                try {
                    var imgText = searchWithGivenQuery(imageQ).claims.P18[0].mainsnak.datavalue.value.split(' ')
                        .join(
                            '_');
                    var hash = md5(imgText);
                    var a = hash.substring(0, 1);
                    var b = hash.substring(1, 2);
                    imageSource = "https://upload.wikimedia.org/wikipedia/commons/" + a + "/" + a + b +
                        "/" + imgText;
                } catch (e) {
                    console.log("Image not found");
                }
                openDiag(words[activeIndex], imageSource, data.search[activeIndex].description);
                return true;
            }
        }
    });

    function AddPropertiesToMemo(i) {
        var hiddenProperties = getPropertiesOfItem(data.search[i].title);
        var spanHiddenProperties = $('#hiddenProperties');
        var jsonArray = [];
        jsonArray = convertStringToJson(spanHiddenProperties.text());
        hiddenProperties.forEach(property => {
            addNewItemToArray(jsonArray, property);
        });
        spanHiddenProperties.text(JSON.stringify(jsonArray));
    }

    function AddSubclassesToMemo(i) {
        var hiddenSubclasses = hiddenSubclassObjectCreator(data.search[i].title);
        var spanHiddenSubclasses = $('#hiddenSubclasses');
        var jsonArray = [];
        jsonArray = convertStringToJson(spanHiddenSubclasses.text());
        hiddenSubclasses.forEach(subclasses => {
            addNewItemToArray(jsonArray, subclasses);
        });
        spanHiddenSubclasses.text(JSON.stringify(jsonArray));
    }

    function AddInstancesToMemo(i) {
        var hiddenInstance = hiddenInstanceObjectCreator(data.search[i].title);
        var spanHiddenInstances = $('#hiddenInstances');
        var jsonArray = [];
        jsonArray = convertStringToJson(spanHiddenInstances.text());
        hiddenInstance.forEach(instance => {
            addNewItemToArray(jsonArray, instance);
        });
        spanHiddenInstances.text(JSON.stringify(jsonArray));
    }

    function AddTitleToMemo(i) {
        var hiddenTitle = data.search[i].title;
        var spanHiddenInstances = $('#hiddenTitles');
        var jsonArray = [];
        jsonArray = convertStringToJson(spanHiddenInstances.text());
        addNewItemToArray(jsonArray, hiddenTitle);
        spanHiddenInstances.text(JSON.stringify(jsonArray));
        return spanHiddenInstances;
    }
}

function autoCompleteSwitch() {
    if (!autoCopleteActivated) {
        annotationAutoCompleteActivate();
        $('#textDiv').show();
        autoCopleteActivated = true;
    } else {
        destroyAutoComplete();
        autoCopleteActivated = false;
        $('#textDiv').hide();
    }
}

function destroyAutoComplete() {
    $('#textarea').textcomplete('destroy');
}

function searchTextOnWikidata(text) {
    const Http = new XMLHttpRequest();
    const url = wdk.searchEntities(text, 'en', 20, 'json');
    Http.open("GET", url, false);
    Http.send();
    if (Http.readyState == 4 && Http.status == 200) {
        var response = JSON.parse(Http.response);
        return response;
    }
}

function searchWithGivenQuery(query) {
    const Http = new XMLHttpRequest();
    const url = query
    Http.open("GET", url, false);
    Http.send();
    if (Http.readyState == 4 && Http.status == 200) {
        var response = JSON.parse(Http.response);
        return response;
    }
}

function hiddenInstanceObjectCreator(item){
    var instances = [];
    finalArray = [];

    var response = searchWithGivenQuery("https://www.wikidata.org/wiki/Special:EntityData/" + item + ".json");
    var entities = response.entities;
    for (var entity in entities) {
        var claims = entities[entity].claims;
        var P31 = claims.P31;
        for (var index in P31) {
            var value = P31[index].mainsnak.datavalue.value;
            var id = value.id;
            if (id != null) {   
                instances.push(id);
            }
        }
    }

    var diffArray = [];
    finalArray = finalArray.concat(instances);
    recursiveInstanceSearch(instances, diffArray);
    return finalArray;
}

function recursiveInstanceSearch(givenArray, diffArray) {
    givenArray.forEach(element => {
        var response = searchWithGivenQuery("https://www.wikidata.org/wiki/Special:EntityData/" + element + ".json");
        var entities = response.entities;
        for (var entity in entities) {
            var claims = entities[entity].claims;

            //Search by instances
            var P31 = claims.P31;
            for (var index in P31) {
                var value = P31[index].mainsnak.datavalue.value;
                var id = value.id;
                if (id != null) {
                    if (!finalArray.includes(id)) {
                        diffArray.push(id);
                        finalArray.push(id);
                    }
                }
            }
        }
    });

    var newDiffArray = [];
    if (diffArray.length != 0) {
        recursiveInstanceSearch(diffArray, newDiffArray);
    } 

}

function hiddenSubclassObjectCreator(item){
    var instances = [];
    finalArray = [];

    var response = searchWithGivenQuery("https://www.wikidata.org/wiki/Special:EntityData/" + item + ".json");
    var entities = response.entities;
    for (var entity in entities) {
        var claims = entities[entity].claims;
        var P279 = claims.P279;
        for (var index in P279) {
            var value = P279[index].mainsnak.datavalue.value;
            var id = value.id;
            if (id != null) {
                instances.push(id);
            }
        }
    }

    var diffArray = [];
    finalArray = finalArray.concat(instances);
    recursiveSubclassSearch(instances, diffArray);
    return finalArray;
}

function recursiveSubclassSearch(givenArray, diffArray) {
    givenArray.forEach(element => {
        var response = searchWithGivenQuery("https://www.wikidata.org/wiki/Special:EntityData/" + element + ".json");
        var entities = response.entities;
        for (var entity in entities) {
            var claims = entities[entity].claims;

            //Search by subclass
            var P279 = claims.P279;
            for (var index in P279) {
                var value = P279[index].mainsnak.datavalue.value;
                var id = value.id;
                if (id != null) {
                    if (!finalArray.includes(id)) {
                        diffArray.push(id);
                        finalArray.push(id);
                    }
                }
            }
        }
    });

    var newDiffArray = [];
    if (diffArray.length != 0) {
        recursiveSubclassSearch(diffArray, newDiffArray);
    } 

}

function closeDiag() {
    $('#heading').show();
    $('#minDiv').show();
    $('#modal').remove();
}

function openDiag(title, imgSource, content) {
    $('ul').hide();
    $('#heading').hide();
    $('#minDiv').hide();
    $('#modalHolder').append('<div id="modal"></div>')
    $("#modal").append('<h1><a id="diagTitle" href="">' + title + '</a></h1>')
        .append('<img id="diagImage"  height="250" width="250" src="' + imgSource + '" alt="Image not found";>')
        .append('<p id="diagContent">' + content + '</p>')
        .append('<button data-dialog-close onclick="closeDiag()">Close</button>')
        .dialog({});
}

//Sparql queries
function getInstances(item) {
    var instance = 'P31';
    var lang = 'en';
    const sparql =
        "SELECT ?item ?instance_of ?instance_ofLabel" +
        " WHERE " +
        "{" +
        " ?item wdt:" + instance + " wd:" + item +
        " SERVICE wikibase:label { bd:serviceParam wikibase:language \"[AUTO_LANGUAGE]," + lang + "\" }" +
        " OPTIONAL { ?item wdt:" + instance + " ?instance_of. }" +
        "}";

    const url = wdk.sparqlQuery(sparql)
    return url;
}

//NIU OLD
function searchByInsance() {
    var searchText = $('#qryinput').val();
    var select = document.querySelectorAll('p > a');
    var tempArray = [];

    for (let i = 0; i < select.length; i++) {
        var splitedArray = select[i].href.split('/');
        var itemQ = splitedArray[splitedArray.length - 1]
        var response = searchWithGivenQuery("https://www.wikidata.org/wiki/Special:EntityData/" + itemQ + ".json");
        var entities = response.entities;
        for (var entity in entities) {
            var claims = entities[entity].claims;
            var P31 = claims.P31;
            for (var index in P31) {
                var value = P31[index].mainsnak.datavalue.value;
                var id = value.id;
                if (id != null) {
                    tempArray.push(id);
                }
            }
        }
    }
    var diffArray = [];
    finalArray = [];
    finalArray = finalArray.concat(tempArray);
    recursiveInstanceSearch(tempArray, diffArray);

    finalArray.forEach(function (val) {
        alert(val.includes(searchText));
    })

    return finalArray;
}

//Alert if exist NIU OLD
function searchByProperty() {
    var searchText = $('#qryinput').val();
    var select = document.querySelectorAll('p > a');
    var responseArray = [];
    select.forEach(function (val) {
        var splitedArray = val.href.split('/');
        var itemQ = splitedArray[splitedArray.length - 1]
        var response = searchWithGivenQuery("https://www.wikidata.org/wiki/Special:EntityData/" + itemQ + ".json");
        var entities = response.entities;
        for (var entity in entities) {
            var tempArray = [];
            var claims = entities[entity].claims;
            for (var t in claims) {
                var claim = claims[t];
                for (var k in claim) {
                    try {
                        var value = claim[k].mainsnak.datavalue.value;
                        var id = value.id;
                        if (id != null) {
                            tempArray.push(id);
                        }
                    } catch (error) {}
                }
            }
            responseArray.push(tempArray);
        }
    })
    responseArray.forEach(function (val) {
        alert(val.includes(searchText));
    })
    return responseArray;
}

function searchByInstanceNew(){
    hiddenInstance = convertStringToJson($('#hiddenInstances').text());
    
    var searchText = $('#qryinput').val();

    var result = searchInJson(hiddenInstance, "item", searchText);

    alert(result[0]["item"] + " " + "found " + result[0]["count"] + " times.")
}

function searchByPropertyNew(){
    hiddenProperties = convertStringToJson($('#hiddenProperties').text());
    
    var searchText = $('#qryinput').val();

    var result = searchInJson(hiddenProperties, "item", searchText);

    alert(result[0]["item"] + " " + "found " + result[0]["count"] + " times.")
}

function searchInJson(jsonArray, searchField, searchVal){
    var results = [];

    for (var i=0 ; i < jsonArray.length ; i++)
    {
        if (jsonArray[i][searchField] == searchVal) {
            results.push(jsonArray[i]);
        }
    }
    return results;
}


// Searches from DB....
function generalSearch(index){

    var spanSearchInput = $('#searchInput');
    var text = convertStringToJson(spanSearchInput.text());            

    $.ajax({
        type: "GET",
        url: "/home/GetDataFromMemo",
        data: {
            "text":JSON.stringify(text),
            "searchType":index
        },
        dataType: "json"
    })
    .done(function(response) {
        jumboRemove();
        response.forEach(el => {
            if(el.score>0){
                jumboPush(el.memory.id,el.memory.memoryTitle,el.score);
            }
        });
        
        array = [];
        $('#searchQuery').text('');
        console.log(response);
    })
    .fail(function (jqXHR, exception) {
        var msg_err = "";
        if (jqXHR.status === 0) {
            msg_err = "Not connect. Verify Network.";
        } else if (jqXHR.status == 404) {
            msg_err = "Requested page not found. [404]";
        } else if (jqXHR.status == 500) {
            msg_err = "Internal Server Error [500].";
        } else if (exception === "parsererror") {
            msg_err = "Requested JSON parse failed.";
        } else if (exception === "timeout") {
            msg_err = "Time out error.";
        } else if (exception === "abort") {
            msg_err = "Ajax request aborted.";
        } else {
            msg_err = "Uncaught Error. "+ jqXHR.responseText;
        }
        array = [];
        $('#searchQuery').text('');
        alert(msg_err);
    })
    .always(function() {
    });
}

function jumboPush(Id, Title, Score){
    var jumbo = 
    '<div class="jumbotron">' + 
        '<h3>' + 
            '<a  href="../Home/MemoryView/'+ Id +'">' + Title + '</a>' + 
        '</h3>' + 
        '<p>Tom\'s Score: ' + Score + '</p>' + 
    '</div>';
    $("#JumboHolderDiv").append(jumbo);
}

function jumboRemove(){
    $("div[class='jumbotron']").remove();
}