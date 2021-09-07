---
title: Tutorial - Add authentication and permissions to your application when using Azure Web PubSub service
description: A tutorial to walk through how to add authentication and permissions to your application when using Azure Web PubSub service
author: vicancy
ms.author: lianwei
ms.service: azure-web-pubsub
ms.topic: tutorial 
ms.date: 08/26/2021
---

# Tutorial: Add authentication and permissions to your application when using Azure Web PubSub service

In [Build a chat app tutorial](./tutorial-build-chat.md), you've learned how to use WebSocket APIs to send and receive data with Azure Web PubSub. You may have noticed that for simplicity it does not require any authentication. Though Azure Web PubSub requires access token to be connected, the `negotiate` API we used in the tutorial to generate access token doesn't need authentication, so anyone can call this API to get an access token.

In a real world application it's common that you want user to log in first before they can use your application to protect it from being abused. In this tutorial, you'll learn how to integrate Azure Web PubSub with the authentication/authorization system of your application to make it more secure.

The complete code sample of this tutorial can be found [here][code].

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Enable GitHub authentication
> * Add authentication middleware to your application
> * Add permissions to the clients

## Add authentication to the chat room app

This tutorial reuses the chat application created in [Build a chat app tutorial](./tutorial-build-chat.md). You can also clone the complete code sample for the chat app from [here][chat-js]. 

In this tutorial, we will add authentication to the chat application and integrate it with Azure Web PubSub service.

First let's add GitHub authentication to the chat room so user can use GitHub account to log in.

1.  Install dependencies

    ```bash
    npm install --save cookie-parser
    npm install --save express-session
    npm install --save passport
    npm install --save passport-github2
    ```

2.  Add the following code to `server.js` to enable GitHub authentication

    ```javascript
    const app = express();

    const users = {};
    passport.use(
      new GitHubStrategy({
        clientID: process.argv[3],
        clientSecret: process.argv[4]
      },
      (accessToken, refreshToken, profile, done) => {
        users[profile.id] = profile;
        return done(null, profile);
      }
    ));

    passport.serializeUser((user, done) => {
      done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
      if (users[id]) return done(null, users[id]);
      return done(`invalid user id: ${id}`);
    });

    app.use(cookieParser());
    app.use(session({
      resave: false,
      saveUninitialized: true,
      secret: 'keyboard cat'
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));
    app.get('/auth/github/callback', passport.authenticate('github', { successRedirect: '/' }));
    ```

    The code above uses [Passport.js](http://www.passportjs.org/) to enable GitHub authentication. Here is a simple illustration of how it works:

    1. `/auth/github` will redirect to github.com for login
    2. After login is completed, GitHub will redirect you to `/auth/github/callback` with a code for your application to complete the authentication (see the verify callback in `passport.use()` to see how the profile returned from GitHub is verified and persisted in the server).
    3. After authentication is completed, you'll be redirected to the homepage (`/`) of the site.
 
    For more details about GitHub OAuth and Passport.js, see the following articles:

    - [Authorizing OAuth Apps](https://docs.github.com/en/developers/apps/authorizing-oauth-apps)
    - [Passport.js doc](http://www.passportjs.org/docs/)

    To test this, you need to first create a GitHub OAuth app:

    1. Go to https://www.github.com, open your profile -> Settings -> Developer settings
    2. Go to OAuth Apps, click "New OAuth App"
    3. Fill in application name, homepage URL (can be anything you like), and set Authorization callback URL to `http://localhost:8080/auth/github/callback` (which matches the callback API you exposed in the server)
    4. After the application is registered, copy the Client ID and click "Generate a new client secret" to generate a new client secret

    Then run `node server <connection-string> <client-id> <client-secret>`, open `http://localhost:8080/auth/github`, you'll be redirected to GitHub to log in. After the login is succeeded, you'll be redirected to the chat application.

3.  Then let's update the chat room to make use of the identity we get from GitHub, instead of popping up a dialog to ask for username.

    Update `public/index.html` to directly call `/negotiate` without passing in a user ID.

    ```javascript
    let messages = document.querySelector('#messages');
    let res = await fetch(`/negotiate`);
    if (res.status === 401) {
      let m = document.createElement('p');
      m.innerHTML = 'Not authorized, click <a href="/auth/github">here</a> to login';
      messages.append(m);
      return;
    }
    let data = await res.json();
    let ws = new WebSocket(data.url);
    ```

    When a user is logged in, the request will automatically carry the user's identity through cookie. So we just need to check whether the user exists in the `req` object and add the username to Web PubSub access token:

    ```javascript
    app.get('/negotiate', async (req, res) => {
      if (!req.user || !req.user.username) {
        res.status(401).send('missing user id');
        return;
      }
      let options = {
        userId: req.user.username
      };
      let token = await serviceClient.getAuthenticationToken(options);
      res.json({
        url: token.url
      });
    });
    ```

    Now rerun the server and you'll see a "not authorized" message for the first time you open the chat room. Click the login link to log in, then you'll see it works as before.

## Working with permissions

In the previous tutorials, you have learned to use `WebSocket.send()` to directly publish messages to other clients using subprotocol. In a real application, you may not want client to be able to publish/subscribe to any group without permission control. In this section, you'll see how to control clients using the permission system of Azure Web PubSub.

In Azure Web PubSub there are three types of operations a client can do with subprotocol:

- Send events to server
- Publish messages to a group
- Join (subscribe) a group

Send event to server is the default operation of client even no protocol is used, so it's always allowed. To publish and subscribe to a group, client needs to get permission. There are two ways for server to grant permission to clients:

- Specify roles when a client is connected (role is a concept to represent initial permissions when a client is connected)
- Use API to grant permission to a client after it's connected

For join group permission, client still needs to join the group using join group message after it gets the permission. Or server can use API to add client to a group even it doesn't have the join permission.

Now let's use this permission system to add a new feature to the chat room. We will add a new type of user called administrator to the chat room, for administrator, we will allow them to send system message (message starts with "[SYSTEM]") directly from client.

First we need to separate system and user messages into two different groups so their permissions can be controlled separately.

Change `server.js` to send different messages to different groups:

```javascript
let handler = new WebPubSubEventHandler(hubName, ['*'], {
  path: '/eventhandler',
  handleConnect: (req, res) => {
    res.success({
      groups: ['system', 'message'],
    });
  },
  onConnected: req => {
    console.log(`${req.context.userId} connected`);
    serviceClient.group('system').sendToAll(`${req.context.userId} joined`, { contentType: 'text/plain' });
  },
  handleUserEvent: (req, res) => {
    if (req.context.eventName === 'message') {
      serviceClient.group('message').sendToAll({
        user: req.context.userId,
        message: req.data
      });
    }
    res.success();
  }
});
```

You can see the code above uses `WebPubSubServiceClient.group().sendToAll()` to send message to group instead of the hub.

Since the message is now sent to groups, we need to add clients to groups so they can continue receiving messages. This is done in the `handleConnect` handler.

> [!Note]
> `handleConnect` is triggered when a client is trying to connect to Azure Web PubSub. In this handler you can return groups and roles, so service can add connection to groups or grant roles, as soon as the connection is established. It can also `res.fail()` to deny the connection.
>

To make `handleConnect` be triggered, go to event handler settings in Azure portal, and check `connect` in system events.

We also need to update client HTML since now server sends JSON messages instead of plain text:

```javascript
let ws = new WebSocket(data.url, 'json.webpubsub.azure.v1');
ws.onopen = () => console.log('connected');

ws.onmessage = event => {
  let m = document.createElement('p');
  let message = JSON.parse(event.data);
  switch (message.type) {
    case 'message':
      if (message.group === 'system') m.innerText = `[SYSTEM] ${message.data}`;
      else if (message.group === 'message') m.innerText = `[${message.data.user}] ${message.data.message}`;
      break;
  }
  messages.appendChild(m);
};

let message = document.querySelector('#message');
message.addEventListener('keypress', e => {
  if (e.charCode !== 13) return;
  ws.send(JSON.stringify({
    type: 'event',
    event: 'message',
    dataType: 'text',
    data: message.value
  }));
  message.value = '';
});
```

Then change the client code to send to system group when users click "system message":

```html
<button id="system">system message</button>
...
<script>
  (async function() {
    ...
    let system = document.querySelector('#system');
    system.addEventListener('click', e => {
      ws.send(JSON.stringify({
        type: 'sendToGroup',
        group: 'system',
        dataType: 'text',
        data: message.value
      }));
      message.value = '';
    });
  })();
</script>
```

By default client doesn't have permission to send to any group, update server code to grant permission for admin user (for simplicity the ID of the admin is provided as a command-line argument).

```javascript
app.get('/negotiate', async (req, res) => {
  ...
  if (req.user.username === process.argv[5]) options.claims = { role: ['webpubsub.sendToGroup.system'] };
  let token = await serviceClient.getAuthenticationToken(options);
});
```

Now run `node server <connection-string> <client-id> <client-secret> <admin-id>`, you'll see you can send a system message to every client when you log in as `<admin-id>`.

But if you log in as a different user, when you click "system message", nothing will happen. You may expect service give you an error to let you know the operation is not allowed. This can be done by setting an `ackId` when publishing the message. Whenever `ackId` is specified, Azure Web PubSub will return an ack message with a matching `ackId` to indicate whether the operation is succeeded or not.

Change the code of sending system message to the following code:

```javascript
let ackId = 0;
system.addEventListener('click', e => {
  ws.send(JSON.stringify({
    type: 'sendToGroup',
    group: 'system',
    ackId: ++ackId,
    dataType: 'text',
    data: message.value
    }));
  message.value = '';
});
```

Also change the code of processing messages to handle ack message:

```javascript
ws.onmessage = event => {
  ...
  switch (message.type) {
    case 'ack':
      if (!message.success && message.error.name === 'Forbidden') m.innerText = 'No permission to send system message';
      break;
  }
};
```

Now rerun server and login as a different user, you'll see an error message when trying to send system message.

The complete code sample of this tutorial can be found [here][code].

## Next steps

This tutorial provides you a basic idea of how to connect to the Web PubSub service and how to publish messages to the connected clients using subprotocol.

Check other tutorials to further dive into how to use the service.

> [!div class="nextstepaction"]
> [Explore more Azure Web PubSub samples](https://aka.ms/awps/samples)

[code]: https://github.com/Azure/azure-webpubsub/tree/main/samples/javascript/githubchat/
[chat-js]: https://github.com/Azure/azure-webpubsub/tree/main/samples/javascript/chatapp
