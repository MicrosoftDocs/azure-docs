---
title: Azure Relay Hybrid Connections protocol guide | Microsoft Docs
description: Azure Relay Hybrid Connections protocol guide.
services: service-bus-relay
documentationcenter: na
author: clemensv
manager: timlt
editor: ''

ms.assetid: 149f980c-3702-4805-8069-5321275bc3e8
ms.service: service-bus-relay
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 07/03/2017
ms.author: sethm;clemensv

---
# Azure Relay Hybrid Connections protocol
Azure Relay is one of the key capability pillars of the Azure Service Bus
platform. The new *Hybrid Connections* capability of Relay is a secure,
open-protocol evolution based on HTTP and WebSockets. It supersedes the former,
equally named *BizTalk Services* feature that was built on a proprietary
protocol foundation. The integration of Hybrid Connections into Azure App
Services will continue to function as-is.

Hybrid Connections enables bi-directional, binary stream
communication between two networked applications, during which either or both parties
can reside behind NATs or firewalls. This article describes the client-side
interactions with the Hybrid Connections relay for connecting clients in
listener and sender roles, and how listeners accept new connections.

## Interaction model
The Hybrid Connections relay connects two parties by providing a rendezvous
point in the Azure cloud that both parties can discover and connect to from
their own network’s perspective. That rendezvous point is called "Hybrid
Connection" in this and other documentation, in the APIs, and also in the Azure
portal. The Hybrid Connections service endpoint is referred to as the "service"
for the rest of this article. The interaction model leans on the nomenclature
established by many other networking APIs.

There is a listener that first indicates readiness to handle incoming
connections, and subsequently accepts them as they arrive. On the other side,
there is a connecting client that connects towards the listener, expecting that
connection to be accepted for establishing a bi-directional communication path.
"Connect," "Listen," and "Accept" are the same terms you find in most socket
APIs.

Any relayed communication model has either party making outbound connections
towards a service endpoint, which makes the "listener" also a "client" in
colloquial use, and may also cause other terminology overloads. The precise
terminology we therefore use for Hybrid Connections is as follows:

The programs on both sides of a connection are called "clients," since they are
clients to the service. The client that waits for and accepts connections is the
"listener," or is said to be in the "listener role." The client that initiates a new
connection towards a listener via the service is called the "sender," or is in the
"sender role."

### Listener interactions
The listener has four interactions with the service; all wire details are
described later in this article in the reference section.

#### Listen
To indicate readiness to the service that a listener is ready to accept
connections, it creates an outbound WebSocket connection. The connection
handshake carries the name of a Hybrid Connection configured on the Relay
namespace, and a security token that confers the "Listen" right on that name.
When the WebSocket is accepted by the service, the registration is complete and
the established web WebSocket is kept alive as the "control channel" for enabling
all subsequent interactions. The service allows up to 25 concurrent listeners on
a Hybrid Connection. If there are two or more active listeners, incoming
connections are balanced across them in random order; fair distribution is
not guaranteed.

#### Accept
When a sender opens a new connection on the service, the service chooses and notifies one of the active listeners on the Hybrid Connection. This notification is sent to the listener over the open control channel as a JSON message containing the URL of the WebSocket endpoint that the listener must connect to for accepting the connection.

The URL can and must be used directly by the listener without any extra work.
The encoded information is only valid for a short period of time, essentially
for as long as the sender is willing to wait for the connection to be
established end-to-end, but up to a maximum of 30 seconds. The URL can only be
used for one successful connection attempt. As soon as the WebSocket connection
with the rendezvous URL is established, all further activity on this WebSocket
is relayed from and to the sender, without any intervention or interpretation by
the service.

#### Renew
The security token that must be used to register the listener and maintain the
control channel may expire while the listener is active. The token expiry does
not affect ongoing connections, but it does cause the control channel to be
dropped by the service at or soon after the moment of expiry. The "renew"
operation is a JSON message that the listener can send to replace the token
associated with the control channel, so that the control channel can be
maintained for extended periods.

#### Ping
If the control channel stays idle for a long time, intermediaries on the way,
such as load balancers or NATs may drop the TCP connection. The "ping" operation
avoids that by sending a small amount of data on the channel that reminds
everyone on the network route that the connection is meant to be alive, and it
also serves as a "live" test for the listener. If the ping fails, the control
channel should be considered unusable and the listener should reconnect.

### Sender interaction
The sender only has a single interaction with the service: it connects.

#### Connect
The "connect" operation opens a WebSocket on the service, providing the name of
the Hybrid Connection and (optionally, but required by default) a security token
conferring "Send" permission in the query string. The service then interacts
with the listener in the way described previously, and the listener creates a
rendezvous connection that is joined with this WebSocket. After the WebSocket has been accepted, all further interactions on that WebSocket are
with a connected listener.

### Interaction summary
The result of this interaction model is that the sender client comes out of the
handshake with a "clean" WebSocket, which is connected to a listener and that
needs no further preambles or preparation. This model enables practically any existing
WebSocket client implementation to readily take advantage of the Hybrid
Connections service by supplying a correctly-constructed URL into their WebSocket client layer.

The rendezvous connection WebSocket that the listener obtains through the
accept interaction is also clean and can be handed to any existing WebSocket
server implementation with some minimal extra abstraction that distinguishes
between "accept" operations on their framework's local network listeners and
Hybrid Connections remote "accept" operations.

## Protocol reference

This section describes the details of the protocol interactions described previously.

All WebSocket connections are made on port 443 as an upgrade from HTTPS 1.1,
which is commonly abstracted by some WebSocket framework or API. The
description here is kept implementation neutral, without suggesting a specific
framework.

### Listener protocol
The listener protocol consists of two connection gestures and three message
operations.

#### Listener control channel connection
The control channel is opened with creating a WebSocket connection to:

```
wss://{namespace-address}/$hc/{path}?sb-hc-action=...[&sb-hc-id=...]&sb-hc-token=...
```

The `namespace-address` is the fully qualified domain name of the Azure Relay
namespace that hosts the Hybrid Connection, typically of the form
`{myname}.servicebus.windows.net`.

The query string parameter options are as follows.

| Parameter | Required | Description |
| --- | --- | --- |
| `sb-hc-action` |Yes |For the listener role the parameter must be **sb-hc-action=listen** |
| `{path}` |Yes |The URL-encoded namespace path of the preconfigured Hybrid Connection to register this listener on. This expression is appended to the fixed `$hc/` path portion. |
| `sb-hc-token` |Yes\* |The listener must provide a valid, URL-encoded Service Bus Shared Access Token for the namespace or Hybrid Connection that confers the **Listen** right. |
| `sb-hc-id` |No |This client-supplied optional ID enables end-to-end diagnostic tracing. |

If the WebSocket connection fails due to the Hybrid Connection path not being
registered, or an invalid or missing token, or some other error, the error
feedback is provided using the regular HTTP 1.1 status feedback model. The
status description contains an error tracking-id that can be communicated to
Azure support personnel:

| Code | Error | Description |
| --- | --- | --- |
| 404 |Not Found |The Hybrid Connection path is invalid or the base URL is malformed. |
| 401 |Unauthorized |The security token is missing or malformed or invalid. |
| 403 |Forbidden |The security token is not valid for this path for this action. |
| 500 |Internal Error |Something went wrong in the service. |

If the WebSocket connection is intentionally shut down by the service after it
was initially set up, the reason for doing so is communicated using an
appropriate WebSocket protocol error code along with a descriptive error
message that also includes a tracking ID. The service will not shut down the
control channel without encountering an error condition. Any clean shutdown is
client controlled.

| WS Status | Description |
| --- | --- |
| 1001 |The Hybrid Connection path has been deleted or disabled. |
| 1008 |The security token has expired, therefore the authorization policy is violated. |
| 1011 |Something went wrong in the service. |

### Accept handshake
The "accept" notification is sent by the service to the listener over the
previously established control channel as a JSON message in a WebSocket text
frame. There is no reply to this message.

The message contains a JSON object named "accept," which defines the following
properties at this time:

* **address** – the URL string to be used for establishing the WebSocket to the
  service to accept an incoming connection.
* **id** – the unique identifier for this connection. If the ID was supplied by
  the sender client, it is the sender supplied value, otherwise it is a system
  generated value.
* **connectHeaders** – all HTTP headers that have been supplied to the Relay
  endpoint by the sender, which also includes the Sec-WebSocket-Protocol and the
  Sec-WebSocket-Extensions headers.

#### Accept Message

```json
{                                                           
    "accept" : {
        "address" : "wss://168.61.148.205:443/$hc/{path}?..."    
        "id" : "4cb542c3-047a-4d40-a19f-bdc66441e736",  
        "connectHeaders" : {                                         
            "Host" : "...",                                                
            "Sec-WebSocket-Protocol" : "...",                              
            "Sec-WebSocket-Extensions" : "..."                             
        }                                                            
     }                                                         
}
```

The address URL provided in the JSON message is used by the listener to
establish the WebSocket for accepting or rejecting the sender socket.

#### Accepting the socket
To accept, the listener establishes a WebSocket connection to the provided
address.

If the "accept" message carries a `Sec-WebSocket-Protocol` header, it is
expected that the listener only accepts the WebSocket if it supports that
protocol. Additionally, it sets the header as the WebSocket is established.

The same applies to the `Sec-WebSocket-Extensions` header. If the framework
supports an extension, it should set the header to the server-side reply of
the required `Sec-WebSocket-Extensions` handshake for the extension.

The URL must be used as-is for establishing the accept socket, but contains the
following parameters:

| Parameter | Required | Description |
| --- | --- | --- |
| `sb-hc-action` |Yes |For accepting a socket, the parameter must be `sb-hc-action=accept` |
| `{path}` |Yes |(see the following paragraph) |
| `sb-hc-id` |No |See previous description of **id**. |

`{path}` is the URL-encoded namespace path of the preconfigured Hybrid
Connection on which to register this listener. This expression is appended to the
fixed `$hc/` path portion. 

The `path` expression may be extended with a suffix and a query string expression
that follows the registered name after a separating forward slash. This enables
the sender client to pass dispatch arguments to the accepting listener when it
is not possible to include HTTP headers. The expectation is that the listener
framework parses out the fixed path portion and the registered name from the
path and makes the remainder, possibly without any query string arguments
prefixed by `sb-`, available to the application for deciding whether to accept
the connection.

For more information, see the following "Sender Protocol" section.

If there is an error, the service can reply as follows:

| Code | Error | Description |
| --- | --- | --- |
| 403 |Forbidden |The URL is not valid. |
| 500 |Internal Error |Something went wrong in the service |

After the connection has been established, the server shuts down the WebSocket when the sender WebSocket shuts down, or with the following status:

| WS Status | Description |
| --- | --- |
| 1001 |The sender client shuts down the connection. |
| 1001 |The Hybrid Connection path has been deleted or disabled. |
| 1008 |The security token has expired, therefore the authorization policy is violated. |
| 1011 |Something went wrong in the service. |

#### Rejecting the socket
Rejecting the socket after inspecting the "accept" message requires a similar
handshake so that the status code and status description communicating the
reason for the rejection can flow back to the sender.

The protocol design choice here is to use a WebSocket handshake (that is
designed to end in a defined error state) so that listener client
implementations can continue to rely on a WebSocket client and do not need to
employ an extra, bare HTTP client.

To reject the socket, the client takes the address URI from the "accept" message
and appends two query string parameters to it, as follows:

| Param | Required | Description |
| --- | --- | --- |
| statusCode |Yes |Numeric HTTP status code. |
| statusDescription |Yes |Human readable reason for the rejection. |

The resulting URI is then used to establish a WebSocket connection.

When completing correctly, this handshake intentionally fails with an HTTP
error code 410, since no WebSocket has been established. If something goes wrong,
the following codes describe the error:

| Code | Error | Description |
| --- | --- | --- |
| 403 |Forbidden |The URL is not valid. |
| 500 |Internal Error |Something went wrong in the service. |

### Listener token renewal
When the listener token is about to expire, it can replace it by sending a
text frame message to the service via the established control channel. The
message contains a JSON object called `renewToken`, which defines the following
property at this time:

* **token** – a valid, URL-encoded Service Bus Shared Access token for the
  namespace or Hybrid Connection that confers the **Listen** right.

#### renewToken message

```json
{                                                                                                                                                                        
    "renewToken" : {                                                                                                                                                      
        "token" : "SharedAccessSignature sr=http%3a%2f%2fcontoso.servicebus.windows.net%2fhyco%2f&amp;sig=XXXXXXXXXX%3d&amp;se=1471633754&amp;skn=SasKeyName"  
    }                                                                                                                                                                     
}
```

If the token validation fails, access is denied, and the cloud service closes
the control channel WebSocket with an error. Otherwise there is no reply.

| WS Status | Description |
| --- | --- |
| 1008 |The security token has expired, therefore the authorization policy is violated. |

## Sender protocol
The sender protocol is effectively identical to the way a listener is established.
The goal is maximum transparency for the end-to-end WebSocket. The address to
connect to is the same as for the listener, but the "action" differs and the
token needs a different permission:

```
wss://{namespace-address}/$hc/{path}?sb-hc-action=...&sb-hc-id=...&sbc-hc-token=...
```

The *namespace-address* is the fully qualified domain name of the Azure Relay
namespace that hosts the Hybrid Connection, typically of the form
`{myname}.servicebus.windows.net`.

The request can contain arbitrary extra HTTP headers, including
application-defined ones. All supplied headers flow to the listener and can be
found on the `connectHeader` object of the **accept** control message.

The query string parameter options are as follows:

| Param | Required? | Description |
| --- | --- | --- |
| `sb-hc-action` |Yes |For the sender role, the parameter must be `action=connect`. |
| `{path}` |Yes |(see the following paragraph) |
| `sb-hc-token` |Yes\* |The listener must provide a valid, URL-encoded Service Bus Shared Access Token for the namespace or Hybrid Connection that confers the **Send** right. |
| `sb-hc-id` |No |An optional ID that enables end-to-end diagnostic tracing and is made available to the listener during the accept handshake. |

The `{path}` is the URL-encoded namespace path of the preconfigured Hybrid
Connection on which to register this listener. The `path` expression can be extended
with a suffix and a query string expression to communicate further. If the Hybrid
Connection is registered under the path `hyco`, the `path` expression can be
`hyco/suffix?param=value&...` followed by the query string parameters defined
here. A complete expression may then be as follows:

```
wss://{namespace-address}/$hc/hyco/suffix?param=value&sb-hc-action=...[&sb-hc-id=...&]sbc-hc-token=...
```

The `path` expression is passed through to the listener in the address URI contained in the "accept" control message.

If the WebSocket connection fails due to the Hybrid Connection path not being
registered, an invalid or missing token, or some other error, the error
feedback is provided using the regular HTTP 1.1 status feedback model. The
status description contains an error tracking ID that can be communicated to
Azure support personnel:

| Code | Error | Description |
| --- | --- | --- |
| 404 |Not Found |The Hybrid Connection path is invalid or the base URL is malformed. |
| 401 |Unauthorized |The security token is missing or malformed or invalid. |
| 403 |Forbidden |The security token is not valid for this path and for this action. |
| 500 |Internal Error |Something went wrong in the service. |

If the WebSocket connection is intentionally shut down by the service after it
has been initially set up, the reason for doing so is communicated using an
appropriate WebSocket protocol error code along with a descriptive error
message that also includes a tracking ID.

| WS Status | Description |
| --- | --- |
| 1000 |The listener shut down the socket. |
| 1001 |The Hybrid Connection path has been deleted or disabled. |
| 1008 |The security token has expired, therefore the authorization policy is violated. |
| 1011 |Something went wrong in the service. |

## Next steps
* [Relay FAQ](relay-faq.md)
* [Create a namespace](relay-create-namespace-portal.md)
* [Get started with .NET](relay-hybrid-connections-dotnet-get-started.md)
* [Get started with Node](relay-hybrid-connections-node-get-started.md)

