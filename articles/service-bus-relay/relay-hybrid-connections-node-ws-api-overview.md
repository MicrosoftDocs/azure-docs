---
title: Overview of the Azure Relay Node APIs | Microsoft Docs
description: Relay Node API overview
services: service-bus-relay
documentationcenter: na
author: jtaubensee
manager: timlt
editor: ''

ms.assetid: b7d6e822-7c32-4cb5-a4b8-df7d009bdc85
ms.service: service-bus-relay
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/23/2017
ms.author: jotaub
---

# Azure Relay Hybrid Connections NodeAPI overview

## Overview

The [`hyco-ws`](https://www.npmjs.com/package/hyco-ws) Node package for Azure Relay Hybrid Connections is built on and extends the 
['ws'](https://www.npmjs.com/package/ws) NPM package. This package 
re-exports all exports of that base package and adds new exports that enable 
integration with the Azure Relay service's Hybrid Connections feature. 

Existing applications that `require('ws')` can use this package instead 
with `require('hyco-ws')` , which also enables hybrid scenarios where an 
application can listen for WebSocket connections locally from "inside the firewall"
and via Relay Hybrid Connections all at the same time.
  
## Documentation

The API is [generally documented in the main 'ws' package](https://github.com/websockets/ws/blob/master/doc/ws.md)
and this document describes how this package differs from that baseline. 

The key differences between the base package and this 'hyco-ws' is that it adds 
a new server class, that is exported via `require('hyco-ws').RelayedServer`,
and a few helper methods.

### Package Helper methods

There are several utility methods available on the package export that can be 
referenced like this:

``` JavaScript
const WebSocket = require('hyco-ws');

var listenUri = WebSocket.createRelayListenUri('namespace.servicebus.windows.net', 'path');
listenUri = WebSocket.appendRelayToken(listenUri, 'ruleName', '...key...')
...

```

The helper methods are for use with this package, but might be also be used by a Node server 
for enabling web or device clients to create listeners or senders by handing them URIs that
already embed short-lived tokens and that can be used with common WebSocket stacks that do 
not support setting HTTP headers for the WebSocket handshake. Embedding authorization tokens
into the URI is primarily supported for those library-external usage scenarios. 

#### createRelayListenUri
``` JavaScript
var uri = createRelayListenUri([namespaceName], [path], [[token]], [[id]])
```

Creates a valid Azure Relay Hybrid Connection listener URI for the given namespace and path. This 
URI can then be used with the relayed version of the WebSocketServer class.

- **namespaceName** (required) - the domain-qualified name of the Azure Relay namespace to use
- **path** (required) - the name of an existing Azure Relay Hybrid Connection in that namespace
- **token** (optional) - a previously issued Relay access token that shall be embedded in
                         the listener URI (see below)
- **id** (optional) - a tracking identifier that allows end-to-end diagnostics tracking of requests

The **token** value is optional and should only be used when it is not possible to send HTTP 
headers along with the WebSocket handshake as it is the case with the W3C WebSocket stack.                  


#### createRelaySendUri 
``` JavaScript
var uri = createRelaySendUri([namespaceName], [path], [[token]], [[id]])
```

Creates a valid Azure Relay Hybrid Connection send URI for the given namespace and path. This 
URI can be used with any WebSocket client.

- **namespaceName** (required) - the domain-qualified name of the Azure Relay namespace to use
- **path** (required) - the name of an existing Azure Relay Hybrid Connection in that namespace
- **token** (optional) - a previously issued Relay access token that shall be embedded in
                         the send URI (see below)
- **id** (optional) - a tracking identifier that allows end-to-end diagnostics tracking of requests

The **token** value is optional and should only be used when it is not possible to send HTTP 
headers along with the WebSocket handshake as it is the case with the W3C WebSocket stack.                   


#### createRelayToken 
``` JavaScript
var token = createRelayToken([uri], [ruleName], [key], [[expirationSeconds]])
```

Creates an Azure Relay Shared Access Signature (SAS) token for the given target URI, SAS rule, 
and SAS rule key that is valid for the given number of seconds or for an hour from the current 
instant if the expiry argunent is omitted.

- **uri** (required) - the URI for which the token is to be issued. The URI will be normalized to 
                       using the http scheme and query string information will be stripped.
- **ruleName** (required) - SAS rule name either for the entity represented by the given URI or 
                            for the namespace represented by teh URI host-portion.
- **key** (required) - valid key for the SAS rule. 
- **expirationSeconds** (optional) - the number of seconds until the generated token should expire. 
                            The default is 1 hour (3600) if not specified.

The issued token will confer the rights associated with the chosen SAS rule for the chosen duration.

#### appendRelayToken
``` JavaScript
var uri = appendRelayToken([uri], [ruleName], [key], [[expirationSeconds]])
```

This method is functionally equivalent to the **createRelayToken** method above, but
returns the token correctly appended to the input URI.

### Class ws.RelayedServer

The `hycows.RelayedServer` class is an alternative to the `ws.Server`
class that does not listen on the local network, but delegates listening to the Azure Relay.

The two classes are largely contract compatible, meaning that an existing application using 
the `ws.Server` class can be changed to use the relayed version quite easily. The 
main differences in the constructor and the available options.

#### Constructor  

``` JavaScript 
var ws = require('hyco-ws');
var server = ws.RelayedServer;

var wss = new server(
    {
        server : ws.createRelayListenUri(ns, path),
        token: function() { return ws.createRelayToken('http://' + ns, keyrule, key); }
    });
```

The `RelayedServer` constructor supports a different set of arguments than the 
`Server` since it is neither a standalone listener nor embeddable into an existing HTTP
listener framework. There are also fewer options available since the WebSocket management is 
largely delegated to the Relay service.

Constructor arguments:

- **server** (required) - the fully qualified URI for a Hybrid Connection name on which to listen, usually
                          constructed with the WebSocket.createRelayListenUri() helper.
- **token** (required) - this argument *either* holds a previously issued token string *or* a callback
                         function that can be called to obtain such a token string. The callback option
                         is preferred as it allows token renewal.

#### Events

`RelayedServer` instances emit three Events that allow you to handle incoming requests, establish 
connections, and detect error conditions. You must subscribe to the 'connect' event to handle 
messages. 

##### headers
``` JavaScript 
function(headers)
```

The 'headers' event is raised just before an incoming connection is accepted, allowing
for modification of the headers to send to the client. 

##### connection
``` JavaScript
function(socket)
```

Emitted whenever a new WebSocket connection is accepted. The object is of type ws.WebSocket 
just as with the base package.


##### error
``` JavaScript
function(error)
```

If the underlying server emits an error, it will be forwarded here.  

#### Helpers

To simplify starting a relayed server and immediately subscribing to incoming connections,
the package exposes a simple helper function, which is also used in the samples:

##### createRelayedListener

``` JavaScript
    var WebSocket = require('hyco-ws');

    var wss = WebSocket.createRelayedServer(
        {
            server : WebSocket.createRelayListenUri(ns, path),
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

var server = createRelayedServer([options], [connectCallback] )

This method is simple syntactic sugar that calls the constructor to create a new 
instance of the RelayedServer and then subscribes the provided callback 
to the 'connection' event.
 
##### relayedConnect

Simply mirroring the `createRelayedServer` helper in function, `relayedConnect`
creates a client connection and subscribes to the 'open' event on the 
resulting socket.

``` JavaScript
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

* [Microsoft.Azure.Relay reference](/dotnet/api/microsoft.azure.relay)
* [What is Azure Relay?](relay-what-is-it.md)
* [Available Relay apis](relay-api-overview.md)

[RelayConnectionStringBuilder]: /dotnet/api/microsoft.azure.relay.relayconnectionstringbuilder
[HCStream]: /dotnet/api/microsoft.azure.relay.hybridconnectionstream
[HCClient]: /dotnet/api/microsoft.azure.relay.hybridconnectionclient
[HCListener]: /dotnet/api/microsoft.azure.relay.hybridconnectionlistener