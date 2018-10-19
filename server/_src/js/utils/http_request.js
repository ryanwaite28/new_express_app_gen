const client = (function(){
  let Client = {};

  /* --- */

  function send_request(route, method, data, content_type) {
    let obj = {
      method: method || "GET",
      credentials: "include"
    }
    if(data) {
      if(data.constructor === Object) {
        obj.body = JSON.stringify(data);
        obj.headers = {};
        obj.headers["Content-Type"] = content_type || "application/json";
        obj.headers["Accept"] = "application/json";
      }
      if(data.constructor === FormData) {
        obj.body = data;
      }
    }
    return fetch(route, obj).then(function(resp){ return resp.json() });
  }



  Client.send_request = send_request;

  Client.test_route = function test_route() {
    return send_request("/test_route", "GET", null, null);
  }
  Client.check_session = function check_session() {
    return send_request("/check_session", "GET", null, null);
  }



  return Client;
})();

Object.freeze(client);
