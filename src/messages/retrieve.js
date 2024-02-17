export function retrieveMessages(url) {
    var http = new XMLHttpRequest()
    http.open("GET", url, true)
    http.send(null)
    return http.responseText;
}