## Submission Instructions
* Create a PR to your master from your working branch.
* Submit on canvas:
  * a question and observation
  * how long you spent
  * link to your pull request
  * **Travis CI not required for this lab as you are not writing tests**

## Feature Tasks  
For this assignment, you will be building a TCP chatroom. 
Clients should be able to connect to the chatroom through the use of telnet. 
Clients should also be able to run special commands to exit the chatroom, list all users, reset their nickname, and send direct messages. 
You may add as many features to this application as you would like. 
Do not use any third party libraries and testing is *not* required.

##### Minimum Requirements 
  * The client should send `@dm <to-username> <message>` to send a message directly to another user by their nickname

* Connected clients should be maintained in an in-memory collection called the `clientPool`
  * When a socket emits the `close` event, the socket should be removed from the client pool
  * When a socket emits the `error` event, the error should be logged on the server
  * When a socket emits the `data` event, the data should be logged on the server and the commands above should be implemented

##  Documentation  
Write documention for starting your server connection and using the chatroom application.  Write this documentation as if you are directing someone who has no idea of the tools you are using (netcat, Putty, etc.) how to go through all the steps *from the start* with installing the right dependencies, etc. Be sure to use proper markdown constructs and `highlight blocks of code`.
