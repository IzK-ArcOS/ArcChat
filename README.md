# ArcChat
Special chatting app made in Electron for the ArcOS team.


# How does it work?

It connects to the server using the `config.js` file located in `src/`, and then checks whether you have a token saved. If you have a token, it asks the server for information of the user that is associated with that token, by requesting `/usrget` with the request header `token`.  If you haven't got a token saved, it prompts the login, where when the user has entered details, it sends a request to `/login`, with the request headers `user` and `pwd` which should return a token if successful, 403 if unsuccessful. When sending a message, it gets the token and sends a request to `/getmsgs` with the request headers `token`, `community` (can safely be assumed as 0 for now), and `channel` (which can also be assumed as 1 as of right now, but should be implemented ready for multi-channel support). The messages should be returned as JSON, as `{"user":user,"time":timestamp,"text":message}\\<next message>` When sending a message, the program makes a POST request to `/sendmsg` with headers `token`, `community`, `channel` and `message`. This message is JSON like the `/getmsg`. 

Hopefully this is useful for the backend developers!
