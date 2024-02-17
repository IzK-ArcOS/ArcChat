export function testConnection(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    try {xmlHttp.send( null ); }
    catch(err) {window.console.log("Something went wrong.")}
    
    return xmlHttp.responseText;
}