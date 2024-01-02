---
title: Overview of the Azure Relay Node APIs | Microsoft Docs
description: This article provides an overview of the Node.js API for the Azure Relay service. It also shows how to use the hyco-ws Node package. 
ms.topic: article
ms.date: 08/10/2023
ms.custom: devx-track-js
---

# Relay Hybrid Connections Node.js API overview

## Overview

The [`hyco-ws`](https://www.npmjs.com/package/hyco-ws) Node package for Azure Relay Hybrid Connections is built on and extends the [`ws`](https://www.npmjs.com/package/ws) NPM package. This package re-exports all exports of that base package and adds new exports that enable integration with the Azure Relay service Hybrid Connections feature. 

Existing applications that `require('ws')` can use this package with `require('hyco-ws')` instead, which also enables hybrid scenarios in which an application can listen for WebSocket connections locally from "inside the firewall" and via Hybrid Connections, all at the same time.
  
## Documentation

The APIs are [documented in the main `ws` package](https://github.com/websockets/ws/blob/master/doc/ws.md). This article describes how this package differs from that baseline. 

The key differences between the base package and this 'hyco-ws' is that it adds a new server class, exported via `require('hyco-ws').RelayedServer`, and a few helper methods.

### Package helper methods

There are several utility methods available on the package export that you can reference as follows:

```JavaScript
const WebSocket = require('hyco-ws');

var listenUri = WebSocket.createRelayListenUri('namespace.servicebus.windows.net', 'path');
listenUri = WebSocket.appendRelayToken(listenUri, 'ruleName', '...key...')
...

```

The helper methods are for use with this package, but can also be used by a Node server for enabling web or device clients to create listeners or senders. The server uses these methods by passing them URIs that embed short-lived tokens. These URIs can also be used with common WebSocket stacks that don't support setting HTTP headers for the WebSocket handshake. Embedding authorization tokens into the URI is supported primarily for those library-external usage scenarios. 

#### createRelayListenUri

```JavaScript
var uri = createRelayListenUri([namespaceName], [path], [[token]], [[id]])
```

Creates a valid Azure Relay Hybrid Connection listener URI for the given namespace and path. This 
URI can then be used with the relay version of the WebSocketServer class.

- `namespaceName` (required) - the domain-qualified name of the Azure Relay namespace to use.
- `path` (required) - the name of an existing Azure Relay Hybrid Connection in that namespace.
- `token` (optional) - a previously issued Relay access token that is embedded in the listener URI (see the following example).
- `id` (optional) - a tracking identifier that enables end-to-end diagnostics tracking of requests.

The `token` value is optional and should only be used when it isn't possible to send HTTP headers along with the WebSocket handshake, as is the case with the W3C WebSocket stack.                  


#### createRelaySendUri
 
```JavaScript
var uri = createRelaySendUri([namespaceName], [path], [[token]], [[id]])
```

Creates a valid Azure Relay Hybrid Connection send URI for the given namespace and path. This 
URI can be used with any WebSocket client.

- `namespaceName` (required) - the domain-qualified name of the Azure Relay namespace to use.
- `path` (required) - the name of an existing Azure Relay Hybrid Connection in that namespace.
- `token` (optional) - a previously issued Relay access token that is embedded in the send URI (see the following example).
- `id` (optional) - a tracking identifier that enables end-to-end diagnostics tracking of requests.

The `token` value is optional and should only be used when it isn't possible to send HTTP headers along with the WebSocket handshake, as is the case with the W3C WebSocket stack.                   


#### createRelayToken 

```JavaScript
var token = createRelayToken([uri], [ruleName], [key], [[expirationSeconds]])
```

Creates an Azure Relay Shared Access Signature (SAS) token for the given target URI, SAS rule, 
and SAS rule key that is valid for the given number of seconds or for an hour from the current 
instant if the expiry argument is omitted.

- `uri` (required) - the URI for which the token is to be issued. The URI is normalized to use the HTTP scheme, and query string information is stripped.
- `ruleName` (required) - SAS rule name for either the entity represented by the given URI, or for the namespace represented by the URI host portion.
- `key` (required) - valid key for the SAS rule. 
- `expirationSeconds` (optional) - the number of seconds until the generated token should expire. If not specified, the default is 1 hour (3600).

The issued token confers the rights associated with the specified SAS rule for the given duration.

#### appendRelayToken

```JavaScript
var uri = appendRelayToken([uri], [ruleName], [key], [[expirationSeconds]])
```

This method is functionally equivalent to the `createRelayToken` method documented previously, but
returns the token correctly appended to the input URI.

### Class ws.RelayedServer

The `hycows.RelayedServer` class is an alternative to the `ws.Server` class that doesn't listen on the local network, but delegates listening to the Azure Relay service.

The two classes are mostly contract compatible, meaning that an existing application using the `ws.Server` class can easily be changed to use the relayed version. The main differences are in the constructor and in the available options.

#### Constructor  

```JavaScript 
var ws = require('hyco-ws');
var server = ws.RelayedServer;

var wss = new server(
    {
        server: ws.createRelayListenUri(ns, path),
        token: function() { return ws.createRelayToken('http://' + ns, keyrule, key); }
    });
```

The `RelayedServer` constructor supports a different set of arguments than the `Server`, because it isn't a standalone listener, or able to be embedded into an existing HTTP listener framework. There are also fewer options available since the WebSocket management is largely delegated to the Relay service.

Constructor arguments:

- `server` (required) - the fully qualified URI for a Hybrid Connection name on which to listen, usually constructed with the WebSocket.createRelayListenUri() helper method.
- `token` (required) - this argument holds either a previously issued token string or a callback function that can be called to obtain such a token string. The callback option is preferred, as it enables token renewal.

#### Events

`RelayedServer` instances emit three events that enable you to handle incoming requests, establish connections, and detect error conditions. You must subscribe to the `connect` event to handle messages. 

##### headers

```JavaScript 
function(headers)
```

The `headers` event is raised just before an incoming connection is accepted, enabling modification of the headers to send to the client. 

##### connection

```JavaScript
function(socket)
```

Emitted when a new WebSocket connection is accepted. The object is of type `ws.WebSocket`, same as with the base package.


##### error

```JavaScript
function(error)
```

If the underlying server emits an error, it's forwarded here.  

#### Helpers

To simplify starting a relayed server and immediately subscribing to incoming connections, the package exposes a simple helper function, which is also used in the examples, as follows:

##### createRelayedListener

```JavaScript
var WebSocket = require('hyco-ws');

var wss = WebSocket.createRelayedServer(
    {
        server: WebSocket.createRelayListenUri(ns, path),
        token: function() { return WebSocket.createRelayToken('http://' + ns, keyrule, key); }
    }, 
    function (ws) {
        console.log('connection accepted');
        ws.onmessage = function (event) {
            console.log(JSON.parse(event.data));
        };
        ws.on('close', function () {
            console.log('connection closed');
        });       
});
``` 

##### createRelayedServer

```javascript
var server = createRelayedServer([options], [connectCallback] )
```

This method calls the constructor to create a new instance of the RelayedServer and then subscribes the provided callback to the 'connection' event.
 
##### relayedConnect

Mirror the `createRelayedServer` helper in function. The `relayedConnect` method creates a client connection and subscribes to the 'open' event on the resulting socket.

```JavaScript
var uri = WebSocket.createRelaySendUri(ns, path);
WebSocket.relayedConnect(
    uri,
    WebSocket.createRelayToken(uri, keyrule, key),
    function (socket) {
        ...
    }
);
```

## Next steps
To learn more about Azure Relay, visit these links:
* [What is Azure Relay?](relay-what-is-it.md)
* [Available Relay APIs](relay-api-overview.md)
