---
title: Tutorial - Add authentication and permissions to your application when using Azure Web PubSub
description: Walk through how to add authentication and permissions to your application when using Azure Web PubSub.
author: vicancy
ms.author: lianwei
ms.service: azure-web-pubsub
ms.topic: tutorial 
ms.date: 11/01/2021
---

# Tutorial: Add authentication and permissions to your application when using Azure Web PubSub

In [Build a chat app](./tutorial-build-chat.md), you learned how to use WebSocket APIs to send and receive data with Azure Web PubSub. You might have noticed that, for simplicity, it doesn't require any authentication. Though Azure Web PubSub requires an access token to be connected, the `negotiate` API used in the tutorial to generate the access token doesn't need authentication. Anyone can call this API to get an access token.

In a real-world application, you typically want the user to sign in first, before they can use your application. In this tutorial, you learn how to integrate Web PubSub with the authentication and authorization system of your application, to make it more secure.

You can find the complete code sample of this tutorial on [GitHub][code].

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Enable GitHub authentication
> * Add authentication middleware to your application
> * Add permissions to the clients

## Add authentication to the chat room app

This tutorial reuses the chat application created in [Build a chat app](./tutorial-build-chat.md). You can also clone the complete code sample for the chat app from [GitHub][chat-js]. 

In this tutorial, you add authentication to the chat application and integrate it with Web PubSub.

First, add GitHub authentication to the chat room so the user can use a GitHub account to sign in.

1.  Install dependencies.

    ```bash
    npm install --save cookie-parser
    npm install --save express-session
    npm install --save passport
    npm install --save passport-github2
    ```

1.  Enable GitHub authentication by adding the following code to `server.js`:

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

    The preceding code uses [Passport.js](http://www.passportjs.org/) to enable GitHub authentication. Here's a simple illustration of how it works:

    1. `/auth/github` redirects to github.com for sign-in.
    1. After you sign in, GitHub redirects you to `/auth/github/callback` with a code for your application to complete the authentication. (To see how the profile returned from GitHub is verified and persisted in the server, see the verify callback in `passport.use()`.)
    1. After authentication is completed, you're redirected to the homepage (`/`) of the site.
 
    For more details about GitHub OAuth and Passport.js, see the following articles:

    - [Authorizing OAuth Apps](https://docs.github.com/en/developers/apps/authorizing-oauth-apps)
    - [Passport.js doc](http://www.passportjs.org/docs/)

    To test this, you need to first create a GitHub OAuth app:

    1. Go to https://www.github.com, open your profile, and select **Settings** > **Developer settings**.
    1. Go to OAuth Apps, and select **New OAuth App**.
    1. Fill in the application name and homepage URL (the URL can be anything you like), and set **Authorization callback URL** to `http://localhost:8080/auth/github/callback`. This URL matches the callback API you exposed in the server.
    1. After the application is registered, copy the client ID and select **Generate a new client secret**.

    Run the below command to test the settings, don't forget to replace `<connection-string>`, `<client-id>`, and `<client-secret>` with your values.

    ```bash
    export WebPubSubConnectionString="<connection-string>"
    export GitHubClientId="<client-id>"
    export GitHubClientSecret="<client-secret>"
    node server
    ```
    
    Now open `http://localhost:8080/auth/github`. You're redirected to GitHub to sign in. After you sign in, you're redirected to the chat application.

1.  Update the chat room to make use of the identity you get from GitHub, instead of prompting the user for a username.

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

    When a user is signed in, the request automatically carries the user's identity through a cookie. So you just need to check whether the user exists in the `req` object, and add the username to Web PubSub access token:

    ```javascript
    app.get('/negotiate', async (req, res) => {
      if (!req.user || !req.user.username) {
        res.status(401).send('missing user id');
        return;
      }
      let options = {
        userId: req.user.username
      };
      let token = await serviceClient.getClientAccessToken(options);
      res.json({
        url: token.url
      });
    });
    ```

    Now rerun the server, and you'll see a "not authorized" message for the first time you open the chat room. Select the sign-in link to sign in, and then you'll see it works as before.

## Work with permissions

In the previous tutorials, you learned to use `WebSocket.send()` to directly publish messages to other clients by using subprotocol. In a real application, you might not want the client to be able to publish or subscribe to any group without permission control. In this section, you'll see how to control clients by using the permission system of Web PubSub.

In Web PubSub, a client can perform the following types of operations with subprotocol:

- Send events to server.
- Publish messages to a group.
- Join (subscribe to) a group.

Sending an event to the server is the default operation of the client. No protocol is used, so it's always allowed. To publish and subscribe to a group, the client needs to get permission. There are two ways for the server to grant permission to clients:

- Specify roles when a client is connected (*role* is a concept to represent initial permissions when a client is connected).
- Use an API to grant permission to a client after it's connected.

For permission to join a group, the client still needs to join the group by using the "join group" message after it gets the permission. Alternatively, the server can use an API to add the client to a group, even if it doesn't have the join permission.

Now let's use this permission system to add a new feature to the chat room. You'll add a new type of user called *administrator* to the chat room. You'll allow the administrator to send system messages (messages that start with "[SYSTEM]") directly from the client.

First, you need to separate system and user messages into two different groups so you can control their permissions separately.

Change `server.js` to send different messages to different groups:

```javascript
let handler = new WebPubSubEventHandler(hubName, {
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

The preceding code uses `WebPubSubServiceClient.group().sendToAll()` to send the message to a group instead of the hub.

Because the message is now sent to groups, you need to add clients to groups so they can continue receiving messages. Use the `handleConnect` handler to add clients to groups.

> [!Note]
> `handleConnect` is triggered when a client is trying to connect to Web PubSub. In this handler, you can return groups and roles, so the service can add a connection to groups or grant roles, as soon as the connection is established. The service can also use `res.fail()` to deny the connection.
>

To trigger `handleConnect`, go to the event handler settings in the Azure portal, and select **connect** in system events.

You also need to update the client HTML, because now the server sends JSON messages instead of plain text:

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

Then change the client code to send to the system group when users select **system message**:

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

By default, the client doesn't have permission to send to any group. Update server code to grant permission for the admin user (for simplicity, the ID of the admin is provided as a command-line argument).

```javascript
app.get('/negotiate', async (req, res) => {
  ...
  if (req.user.username === process.argv[2]) options.claims = { role: ['webpubsub.sendToGroup.system'] };
  let token = await serviceClient.getClientAccessToken(options);
});
```

Now run `node server <admin-id>`. You'll see that you can send a system message to every client when you sign in as `<admin-id>`.

But if you sign in as a different user, when you select **system message**, nothing happens. You might expect the service to give you an error to let you know the operation isn't allowed. To provide this feedback, you can set `ackId` when you're publishing the message. Whenever `ackId` is specified, Web PubSub will return a message with a matching `ackId` to indicate whether the operation has succeeded or not.

Change the code of sending a system message to the following code:

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

Also change the code of processing messages to handle an `ack` message:

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

Now rerun the server, and sign in as a different user. You'll see an error message when you're trying to send a system message.

The complete code sample of this tutorial can be found on [GitHub][code].

## Next steps

This tutorial provides you with a basic idea of how to connect to the Web PubSub service, and how to publish messages to connected clients by using subprotocol.

To learn more about using the Web PubSub service, read the other tutorials available in the documentation.

> [!div class="nextstepaction"]
> [Explore more Azure Web PubSub samples](https://aka.ms/awps/samples)

[code]: https://github.com/Azure/azure-webpubsub/tree/main/samples/javascript/githubchat/
[chat-js]: https://github.com/Azure/azure-webpubsub/tree/main/samples/javascript/chatapp
