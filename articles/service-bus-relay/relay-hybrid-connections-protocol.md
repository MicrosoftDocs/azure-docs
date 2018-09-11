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
ms.date: 05/02/2018
ms.author: clemensv
---

# Azure Relay Hybrid Connections protocol

Azure Relay is one of the key capability pillars of the Azure Service Bus
platform. The new _Hybrid Connections_ capability of Relay is a secure,
open-protocol evolution based on HTTP and WebSockets. It supersedes the former,
equally named _BizTalk Services_ feature that was built on a proprietary
protocol foundation. The integration of Hybrid Connections into Azure App
Services will continue to function as-is.

Hybrid Connections enables bi-directional, binary stream communication and
simple datagram flow between two networked applications. Either or
both parties can reside behind NATs or firewalls.

This article describes the client-side interactions with the Hybrid Connections
relay for connecting clients in listener and sender roles. It also describes how 
listeners accept new connections and requests.

## Interaction model

The Hybrid Connections relay connects two parties by providing a rendezvous
point in the Azure cloud that parties can discover and connect to from
their own network’s perspective. The rendezvous point is called "Hybrid
Connection" in this and other documentation, in the APIs, and also in the Azure
portal. The Hybrid Connections service endpoint is referred to as the "service"
for the rest of this article.

The service allows for relaying Web Socket connections and HTTP(S)
requests and responses.

The interaction model leans on the nomenclature established by many other
networking APIs. There is a listener that first indicates readiness to handle
incoming connections, and subsequently accepts them as they arrive. On the
other side, a client connects towards the listener, expecting that connection
to be accepted for establishing a bi-directional communication path. "Connect,"
"Listen," and "Accept" are the same terms you find in most socket APIs.

Any relayed communication model has either party making outbound connections
towards a service endpoint. This makes the "listener" also a "client" in
colloquial use, and may also cause other terminology overloads. The precise
terminology therefore used for Hybrid Connections is as follows:

The programs on both sides of a connection are called "clients," since they are
clients to the service. The client that waits for and accepts connections is
the "listener," or is said to be in the "listener role." The client that
initiates a new connection towards a listener via the service is called the
"sender," or is in the "sender role."

### Listener interactions

The listener has five interactions with the service; all wire details are
described later in this article in the reference section.

The Listen, Accept, and Request messages are received from the service. The
Renew, and Ping operations are sent by the listener.

#### Listen message

To indicate readiness to the service that a listener is ready to accept
connections, it creates an outbound WebSocket connection. The connection
handshake carries the name of a Hybrid Connection configured on the Relay
namespace, and a security token that confers the "Listen" right on that name.

When the WebSocket is accepted by the service, the registration is complete and
the established WebSocket is kept alive as the "control channel" for
enabling all subsequent interactions. The service allows up to 25 concurrent
listeners one Hybrid Connection. The quota for AppHooks is to be determined.

For Hybrid Connections, if there are two or more active listeners, incoming
connections are balanced across them in random order; fair distribution is
attempted with best effort.

#### Accept message

When a sender opens a new connection on the service, the service chooses and
notifies one of the active listeners on the Hybrid Connection. This
notification is sent to the listener over the open control channel as a JSON
message. The message contains the URL of the WebSocket endpoint that the
listener must connect to for accepting the connection.

The URL can and must be used directly by the listener without any extra work.
The encoded information is only valid for a short period of time, essentially
for as long as the sender is willing to wait for the connection to be
established end-to-end. The maximum to assume is 30 seconds. The URL can only
be used for one successful connection attempt. As soon as the WebSocket
connection with the rendezvous URL is established, all further activity on this
WebSocket is relayed from and to the sender. This happens without any
intervention or interpretation by the service.

### Request message

In addition to WebSocket connections, the listener can also receive HTTP
request frames from a sender, if this capability is explicitly enabled on
the Hybrid Connection.

Listeners that attach to Hybrid Connections with HTTP support MUST handle the
`request` gesture. A listener that doesn't handle `request` and therefore
causes repeated timeout errors while being connected MAY be blacklisted by the
service in the future.

HTTP frame header metadata is translated into JSON for simpler handling by the
listener framework, also because HTTP header parsing libraries are rarer than
JSON parsers. HTTP metadata that is only relevant for the relationship between
the sender and the Relay HTTP gateway, including authorization information, is
not forwarded. HTTP request bodies are transparently transferred as binary
WebSocket frames.

The listener can respond to HTTP requests using an equivalent response gesture.

The request/response flow uses the control channel by default, but can be
"upgraded" to a distinct rendezvous WebSocket whenever required. Distinct
WebSocket connections improve throughput for each client conversation, but they
burden the listener with more connections that need to be handled, which may
not be desire able for lightweight clients.

On the control channel, request and response bodies are limited to at most 64 kB
in size. HTTP header metadata is limited to a total of 32 kB. If either the
request or the response exceeds that threshold, the listener MUST upgrade
to a rendezvous WebSocket using a gesture equivalent to handling the
[Accept](#accept-message).

For requests, the service decides whether to route requests over the control
channel. This includes, but may not be limited to cases where a request exceeds
64 kB (headers plus body) outright, or if the request is sent with ["chunked"
transfer-encoding](https://tools.ietf.org/html/rfc7230#section-4.1) and the
service has reason to expect for the request to exceed 64kB or reading the
request is not instantaneous. If the service chooses to deliver the request
over rendezvous, it only passes the rendezvous address to the listener.
The listener then MUST establish the rendezvous WebSocket and the service
promptly delivers the full request including bodies over the rendezvous 
WebSocket. The response MUST also use the rendezvous WebSocket.

For requests that arrive over the control channel, the listener decides
whether to respond over the control channel or via rendezvous. The service MUST
include a rendezvous address with every request routed over the control
channel. This address is only valid for upgrading from the current request.

If the listener chooses to upgrade, it connects and promptly delivers the
response over the established rendezvous socket.

Once the rendezvous WebSocket has been established, the listener SHOULD
maintain it for further handling of requests and responses from the same
client. The service will maintain the WebSocket for as long as the HTTPS socket
connection with the sender persists and will route all subsequent requests from
that sender over the maintained WebSocket. If the listener chooses to drop the
rendezvous WebSocket from its side, the service will also drop the connection
to the sender, irrespective of whether a subsequent request might already be
in progress.

#### Renew operation

The security token that must be used to register the listener and maintain the
control channel may expire while the listener is active. The token expiry does
not affect ongoing connections, but it does cause the control channel to be
dropped by the service at or soon after the moment of expiry. The "renew"
operation is a JSON message that the listener can send to replace the token
associated with the control channel, so that the control channel can be
maintained for extended periods.

#### Ping operation

If the control channel stays idle for a long time, intermediaries on the way,
such as load balancers or NATs may drop the TCP connection. The "ping"
operation avoids that by sending a small amount of data on the channel that
reminds everyone on the network route that the connection is meant to be alive,
and it also serves as a "live" test for the listener. If the ping fails, the
control channel should be considered unusable and the listener should
reconnect.

### Sender interaction

The sender has two interactions with the service: it connects a Web Socket or
it sends requests via HTTPS. Requests cannot be sent over a Web Socket from the
sender role.

#### Connect operation

The "connect" operation opens a WebSocket on the service, providing the name of
the Hybrid Connection and (optionally, but required by default) a security
token conferring "Send" permission in the query string. The service then
interacts with the listener in the way described previously, and the listener
creates a rendezvous connection that is joined with this WebSocket. After the
WebSocket has been accepted, all further interactions on that WebSocket are
with a connected listener.

#### Request operation

For Hybrid Connections for which the feature has been enabled, the sender can
send largely unrestricted HTTP requests to listeners.

Except for a Relay access token that is either embedded in the query string
or in an HTTP header of the request, the Relay is fully transparent to all
HTTP operations on the Relay address and all suffixes of the Relay address
path, leaving the listener fully in control of end-to-end authorization and
even HTTP extension features like [CORS](https://www.w3.org/TR/cors/).

Sender authorization with the Relay endpoint is turned on by default, but is
OPTIONAL. The owner of the Hybrid Connection can choose to allow anonymous
senders. The service will intercept, inspect, and strip authorization
information as follows:

1. If the query string contains a `sb-hc-token` expression, the expression
   will ALWAYS be stripped from the query string. It will be evaluated if
   Relay authorization is turned on.
2. If the request headers contain a `ServiceBusAuthorization` header,
   the header expression will ALWAYS be stripped from the header collection.
   It will be evaluated if Relay authorization is turned on.
3. Only if Relay authorization is turned on, and if the request headers
   contain an `Authorization` header, and neither of the prior expressions
   is present, the header will be evaluated and stripped. Otherwise, the
   `Authorization`is always passed on as-is.

If there is no active listener, the service will return a 502 "Bad Gateway"
error code. If the service does not appear to handle the request, the service
will return a 504 "Gateway Timeout" after 60 seconds.

### Interaction summary

The result of this interaction model is that the sender client comes out of the
handshake with a "clean" WebSocket, which is connected to a listener and that
needs no further preambles or preparation. This model enables practically any
existing WebSocket client implementation to readily take advantage of the
Hybrid Connections service by supplying a correctly constructed URL into their
WebSocket client layer.

The rendezvous connection WebSocket that the listener obtains through the
accept interaction is also clean and can be handed to any existing WebSocket
server implementation with some minimal extra abstraction that distinguishes
between "accept" operations on their framework's local network listeners and
Hybrid Connections remote "accept" operations.

The HTTP request/response model gives the sender a largely unrestricted HTTP
protocol surface area with an OPTIONAL authorization layer. The listener
gets a pre-parsed HTTP request header section that can be turned back into a
downstream HTTP request or handled as is, with binary frames carrying HTTP
bodies. Responses use the same format. Interactions with less than 64 KB of
request and response body can be handled over a single Web Socket that is
shared for all senders. Larger requests and responses can be handled using
the rendezvous model.

## Protocol reference

This section describes the details of the protocol interactions described
previously.

All WebSocket connections are made on port 443 as an upgrade from HTTPS 1.1,
which is commonly abstracted by some WebSocket framework or API. The
description here is kept implementation neutral, without suggesting a specific
framework.

### Listener protocol

The listener protocol consists of two connection gestures and three message
operations.

#### Listener control channel connection

The control channel is opened with creating a WebSocket connection to:

`wss://{namespace-address}/$hc/{path}?sb-hc-action=...[&sb-hc-id=...]&sb-hc-token=...`

The `namespace-address` is the fully qualified domain name of the Azure Relay
namespace that hosts the Hybrid Connection, typically of the form
`{myname}.servicebus.windows.net`.

The query string parameter options are as follows.

| Parameter        | Required | Description
| ---------------- | -------- | -------------------------------------------
| `sb-hc-action`   | Yes      | For the listener role, the parameter must be **sb-hc-action=listen**
| `{path}`         | Yes      | The URL-encoded namespace path of the pre-configured Hybrid Connection to register this listener on. This expression is appended to the fixed `$hc/` path portion.
| `sb-hc-token`    | Yes\*    | The listener must provide a valid, URL-encoded Service Bus Shared Access Token for the namespace or Hybrid Connection that confers the **Listen** right.
| `sb-hc-id`       | No       | This client-supplied optional ID enables end-to-end diagnostic tracing.

If the WebSocket connection fails due to the Hybrid Connection path not being
registered, or an invalid or missing token, or some other error, the error
feedback is provided using the regular HTTP 1.1 status feedback model. The
status description contains an error tracking-id that can be communicated to
Azure support personnel:

| Code | Error          | Description
| ---- | -------------- | -------------------------------------------------------------------
| 404  | Not Found      | The Hybrid Connection path is invalid or the base URL is malformed.
| 401  | Unauthorized   | The security token is missing or malformed or invalid.
| 403  | Forbidden      | The security token is not valid for this path for this action.
| 500  | Internal Error | Something went wrong in the service.

If the WebSocket connection is intentionally shut down by the service after it
was initially set up, the reason for doing so is communicated using an
appropriate WebSocket protocol error code along with a descriptive error
message that also includes a tracking ID. The service will not shut down the
control channel without encountering an error condition. Any clean shutdown is
client controlled.

| WS Status | Description
| --------- | -------------------------------------------------------------------------------
| 1001      | The Hybrid Connection path has been deleted or disabled.
| 1008      | The security token has expired, therefore the authorization policy is violated.
| 1011      | Something went wrong in the service.

#### Accept handshake

The "accept" notification is sent by the service to the listener over the
previously established control channel as a JSON message in a WebSocket text
frame. There is no reply to this message.

The message contains a JSON object named "accept", which defines the following
properties at this time:

* **address** – the URL string to be used for establishing the WebSocket to the
  service to accept an incoming connection.
* **id** – the unique identifier for this connection. If the ID was supplied by
  the sender client, it is the sender supplied value, otherwise it is a system
  generated value.
* **connectHeaders** – all HTTP headers that have been supplied to the Relay
  endpoint by the sender, which also includes the Sec-WebSocket-Protocol and the
  Sec-WebSocket-Extensions headers.

```json
{
    "accept" : {
        "address" : "wss://dc-node.servicebus.windows.net:443/$hc/{path}?..."
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

##### Accepting the socket

To accept, the listener establishes a WebSocket connection to the provided
address.

If the "accept" message carries a `Sec-WebSocket-Protocol` header, it is
expected that the listener only accepts the WebSocket if it supports that
protocol. Additionally, it sets the header as the WebSocket is established.

The same applies to the `Sec-WebSocket-Extensions` header. If the framework
supports an extension, it should set the header to the server-side reply of the
required `Sec-WebSocket-Extensions` handshake for the extension.

The URL must be used as-is for establishing the accept socket, but contains the
following parameters:

| Parameter      | Required | Description
| -------------- | -------- | -------------------------------------------------------------------
| `sb-hc-action` | Yes      | For accepting a socket, the parameter must be `sb-hc-action=accept`
| `{path}`       | Yes      | (see the following paragraph)
| `sb-hc-id`     | No       | See previous description of **id**.

`{path}` is the URL-encoded namespace path of the preconfigured Hybrid
Connection on which to register this listener. This expression is appended to the
fixed `$hc/` path portion.

The `path` expression may be extended with a suffix and a query string
expression that follows the registered name after a separating forward slash.
This enables the sender client to pass dispatch arguments to the accepting
listener when it is not possible to include HTTP headers. The expectation is
that the listener framework parses out the fixed path portion and the
registered name from the path and makes the remainder, possibly without any
query string arguments prefixed by `sb-`, available to the application for
deciding whether to accept the connection.

For more information, see the following "Sender Protocol" section.

If there is an error, the service can reply as follows:

| Code | Error          | Description
| ---- | -------------- | -----------------------------------
| 403  | Forbidden      | The URL is not valid.
| 500  | Internal Error | Something went wrong in the service

 After the connection has been established, the server shuts down the WebSocket
 when the sender WebSocket shuts down, or with the following status:

| WS Status | Description                                                                     |
| --------- | ------------------------------------------------------------------------------- |
| 1001      | The sender client shuts down the connection.                                    |
| 1001      | The Hybrid Connection path has been deleted or disabled.                        |
| 1008      | The security token has expired, therefore the authorization policy is violated. |
| 1011      | Something went wrong in the service.                                            |

##### Rejecting the socket

 Rejecting the socket after inspecting the `accept` message requires a similar
 handshake so that the status code and status description communicating the
 reason for the rejection can flow back to the sender.

 The protocol design choice here is to use a WebSocket handshake (that is
 designed to end in a defined error state) so that listener client
 implementations can continue to rely on a WebSocket client and do not need to
 employ an extra, bare HTTP client.

 To reject the socket, the client takes the address URI from the `accept`
 message and appends two query string parameters to it, as follows:

| Param                   | Required | Description                              |
| ----------------------- | -------- | ---------------------------------------- |
| sb-hc-statusCode        | Yes      | Numeric HTTP status code.                |
| sb-hc-statusDescription | Yes      | Human readable reason for the rejection. |

The resulting URI is then used to establish a WebSocket connection.

When completing correctly, this handshake intentionally fails with an HTTP
error code 410, since no WebSocket has been established. If something goes wrong,
the following codes describe the error:

| Code | Error          | Description                          |
| ---- | -------------- | ------------------------------------ |
| 403  | Forbidden      | The URL is not valid.                |
| 500  | Internal Error | Something went wrong in the service. |

#### Request message

The `request` message is sent by the service to the listener over
the control channel. The same message is also sent over the rendezvous
WebSocket once established.

The `request` consists of two parts: a header and binary body frame(s).
If there is no body, the body frames are omitted. The indicator for
whether a body is present is the boolean `body` property in the request
message.

For a request with a request body, the structure may look like this:

``` text
----- Web Socket text frame ----
{
    "request" :
    {
        "body" : true,
        ...
    }
}
----- Web Socket binary frame ----
FEFEFEFEFEFEFEFEFEFEF...
----- Web Socket binary frame ----
FEFEFEFEFEFEFEFEFEFEF...
----- Web Socket binary frame -FIN
FEFEFEFEFEFEFEFEFEFEF...
----------------------------------
```

The listener MUST handle receiving the request body split across multiple
binary frames (see [WebSocket fragments](https://tools.ietf.org/html/rfc6455#section-5.4)).
The request ends when a binary frame with the FIN flag set has been received.

For a request without a body, there's only one text frame.

``` text
----- Web Socket text frame ----
{
    "request" :
    {
        "body" : false,
        ...
    }
}
----------------------------------
```

The JSON content for `request` is as follows:

* **address** - URI string. This is the rendezvous address to use for this request. If the
  incoming request is larger than 64 kB, the remainder of this message is left
  empty, and the client MUST initiate a rendezvous handshake equivalent to the
  `accept` operation described below. The service will then put the complete
  `request` on the established Web socket. If the response can be expected to
   exceed 64 kB, the listener MUST also initiate a rendezvous handshake, and
   then transfer the response over the established Web socket.
* **id** – string. The unique identifier for this request.
* **requestHeaders** – this object contains all HTTP headers that have been supplied
   to the endpoint by the sender, with exception of authorization information as
   explained [above](#request-operation), and headers that strictly relate to the
   connection with the gateway. Specifically, ALL headers defined or reserved in
   [RFC7230](https://tools.ietf.org/html/rfc7230), except `Via`, are stripped and 
   not forwarded:

  * `Connection` (RFC7230, Section 6.1)
  * `Content-Length`  (RFC7230, Section 3.3.2)
  * `Host`  (RFC7230, Section 5.4)
  * `TE`  (RFC7230, Section 4.3)
  * `Trailer`  (RFC7230, Section 4.4)
  * `Transfer-Encoding`  (RFC7230, Section 3.3.1)
  * `Upgrade` (RFC7230, Section 6.7)
  * `Close`  (RFC7230, Section 8.1)

* **requestTarget** – string. This property holds the  ["Request Target" (RFC7230, Section 5.3)](https://tools.ietf.org/html/rfc7230#section-5.3) of the request. This includes
  the query string portion, which is stripped of ALL `sb-hc-` prefixed parameters.
* **method** - string. This is the method of the request, per [RFC7231, Section 4](https://tools.ietf.org/html/rfc7231#section-4). The `CONNECT` method MUST NOT
 be used.
* **body** – boolean. Indicates whether one or more binary body frame follows.

``` JSON
{
    "request" : {
        "address" : "wss://dc-node.servicebus.windows.net:443/$hc/{path}?...",
        "id" : "42c34cb5-7a04-4d40-a19f-bdc66441e736",
        "requestTarget" : "/abc/def?myarg=value&otherarg=...",
        "method" : "GET",
        "requestHeaders" : {
            "Host" : "...",
            "Content-Type" : "...",
            "User-Agent" : "..."
        },
        "body" : true
     }
}
```

##### Responding to requests

The receiver MUST respond. Repeated failure to respond to requests while
maintaining the connection might result in the listener getting blacklisted.

Responses may be sent in any order, but each request must be responded to
within 60 seconds or the delivery will be reported as having failed. The
60-second deadline is counted until the `response` frame has been received
by the service. An ongoing response with multiple binary frames cannot
become idle for more than 60 seconds or it is terminated.

If the request is received over the control channel, the response MUST
either be sent on the control channel from where the request was received
or it MUST be sent over a rendezvous channel.

The response is a JSON object named "response". The rules for handling
body content are exactly like with the `request` message and based on
the `body` property.

* **requestId** – string. REQUIRED. The `id` property value of the `request` message being
  responded to.
* **statusCode** – number. REQUIRED. a numerical HTTP status code that indicates the outcome of
  the notification. All status codes of [RFC7231, Section 6](https://tools.ietf.org/html/rfc7231#section-6)
  are permitted, except for [502 "Bad Gateway"](https://tools.ietf.org/html/rfc7231#section-6.6.3) and [504 "Gateway Timeout"](https://tools.ietf.org/html/rfc7231#section-6.6.5).
* **statusDescription** - string. OPTIONAL. HTTP status-code reason phrase per [RFC7230, Section 3.1.2](https://tools.ietf.org/html/rfc7230#section-3.1.2)
* **responseHeaders** – HTTP headers to be set in an external HTTP reply.
  As with the `request`, RFC7230 defined headers MUST NOT be used.
* **body** – boolean. Indicates whether binary body frame(s) follow(s).

``` text
----- Web Socket text frame ----
{
    "response" : {
        "requestId" : "42c34cb5-7a04-4d40-a19f-bdc66441e736",
        "statusCode" : "200",
        "responseHeaders" : {
            "Content-Type" : "application/json",
            "Content-Encoding" : "gzip"
        }
         "body" : true
     }
}
----- Web Socket binary frame -FIN
{ "hey" : "mydata" }
----------------------------------
```

##### Responding via rendezvous

For responses that exceed 64 kB, the response MUST be delivered over a
rendezvous socket. Also, if the request exceeds 64 kB, and the `request`
only contains the address field, a rendezvous socket must be established
to obtain the `request`. Once a rendezvous socket has been established,
responses to the respective client and subsequent requests from that respective
client MUST be delivered over the rendezvous socket while it persists.

The `address` URL in the `request` must be used as-is for establishing
the rendezvous socket, but contains the following parameters:

| Parameter      | Required | Description
| -------------- | -------- | -------------------------------------------------------------------
| `sb-hc-action` | Yes      | For accepting a socket, the parameter must be `sb-hc-action=request`

If there is an error, the service can reply as follows:

| Code | Error           | Description
| ---- | --------------- | -----------------------------------
| 400  | Invalid Request | Unrecognized action or URL not valid.
| 403  | Forbidden       | The URL has expired.
| 500  | Internal Error  | Something went wrong in the service

 After the connection has been established, the server shuts down the WebSocket
 when the client's HTTP socket shuts down, or with the following status:

| WS Status | Description                                                                     |
| --------- | ------------------------------------------------------------------------------- |
| 1001      | The sender client shuts down the connection.                                    |
| 1001      | The Hybrid Connection path has been deleted or disabled.                        |
| 1008      | The security token has expired, therefore the authorization policy is violated. |
| 1011      | Something went wrong in the service.                                            |


#### Listener token renewal

When the listener token is about to expire, it can replace it by sending a
text frame message to the service via the established control channel. The
message contains a JSON object called `renewToken`, which defines the following
property at this time:

* **token** – a valid, URL-encoded Service Bus Shared Access token for the
  namespace or Hybrid Connection that confers the **Listen** right.

```json
{
  "renewToken": {
    "token":
      "SharedAccessSignature sr=http%3a%2f%2fcontoso.servicebus.windows.net%2fhyco%2f&amp;sig=XXXXXXXXXX%3d&amp;se=1471633754&amp;skn=SasKeyName"
  }
}
```

If the token validation fails, access is denied, and the cloud service closes
the control channel WebSocket with an error. Otherwise there is no reply.

| WS Status | Description                                                                     |
| --------- | ------------------------------------------------------------------------------- |
| 1008      | The security token has expired, therefore the authorization policy is violated. |

### Web Socket connect protocol

The sender protocol is effectively identical to the way a listener is established.
The goal is maximum transparency for the end-to-end WebSocket. The address to
connect to is the same as for the listener, but the "action" differs and the
token needs a different permission:

```
wss://{namespace-address}/$hc/{path}?sb-hc-action=...&sb-hc-id=...&sbc-hc-token=...
```

The _namespace-address_ is the fully qualified domain name of the Azure Relay
namespace that hosts the Hybrid Connection, typically of the form
`{myname}.servicebus.windows.net`.

The request can contain arbitrary extra HTTP headers, including
application-defined ones. All supplied headers flow to the listener and can be
found on the `connectHeader` object of the **accept** control message.

The query string parameter options are as follows:

| Param          | Required? | Description
| -------------- | --------- | -------------------------- |
| `sb-hc-action` | Yes       | For the sender role, the parameter must be `sb-hc-action=connect`.
| `{path}`       | Yes       | (see the following paragraph)
| `sb-hc-token`  | Yes\*     | The listener must provide a valid, URL-encoded Service Bus Shared Access Token for the namespace or Hybrid Connection that confers the **Send** right.
| `sb-hc-id`     | No        | An optional ID that enables end-to-end diagnostic tracing and is made available to the listener during the accept handshake.

 The `{path}` is the URL-encoded namespace path of the preconfigured Hybrid
 Connection on which to register this listener. The `path` expression can be
 extended with a suffix and a query string expression to communicate further. If
 the Hybrid Connection is registered under the path `hyco`, the `path`
 expression can be `hyco/suffix?param=value&...` followed by the query string
 parameters defined here. A complete expression may then be as follows:

```
wss://{namespace-address}/$hc/hyco/suffix?param=value&sb-hc-action=...[&sb-hc-id=...&]sbc-hc-token=...
```

The `path` expression is passed through to the listener in the address URI contained in the "accept" control message.

If the WebSocket connection fails due to the Hybrid Connection path not being
registered, an invalid or missing token, or some other error, the error
feedback is provided using the regular HTTP 1.1 status feedback model. The
status description contains an error tracking ID that can be communicated to
Azure support personnel:

| Code | Error          | Description
| ---- | -------------- | -------------------------------------------------------------------
| 404  | Not Found      | The Hybrid Connection path is invalid or the base URL is malformed.
| 401  | Unauthorized   | The security token is missing or malformed or invalid.
| 403  | Forbidden      | The security token is not valid for this path and for this action.
| 500  | Internal Error | Something went wrong in the service.

If the WebSocket connection is intentionally shut down by the service after it
has been initially set up, the reason for doing so is communicated using an
appropriate WebSocket protocol error code along with a descriptive error
message that also includes a tracking ID.

| WS Status | Description
| --------- | ------------------------------------------------------------------------------- 
| 1000      | The listener shut down the socket.
| 1001      | The Hybrid Connection path has been deleted or disabled.
| 1008      | The security token has expired, therefore the authorization policy is violated.
| 1011      | Something went wrong in the service.

### HTTP request protocol

The HTTP request protocol allows arbitrary HTTP requests, except protocol upgrades.
HTTP requests are pointed at the entity's regular runtime address, without the
$hc infix that is used for hybrid connections WebSocket clients.

```
https://{namespace-address}/{path}?sbc-hc-token=...
```

The _namespace-address_ is the fully qualified domain name of the Azure Relay
namespace that hosts the Hybrid Connection, typically of the form
`{myname}.servicebus.windows.net`.

The request can contain arbitrary extra HTTP headers, including
application-defined ones. All supplied headers, except those directly defined
in RFC7230 (see [request message](#Request message)) flow to the listener and
can be found on the `requestHeader` object of the **request** message.

The query string parameter options are as follows:

| Param          | Required? | Description
| -------------- | --------- | ---------------- |
| `sb-hc-token`  | Yes\*     | The listener must provide a valid, URL-encoded Service Bus Shared Access Token for the namespace or Hybrid Connection that confers the **Send** right.

The token can also be carried in either the `ServiceBusAuthorization` or `Authorization`
HTTP header. The token can be omitted if the Hybrid Connection is configured
to permit anonymous requests.

Because the service effectively acts as a proxy, even if not as a true HTTP
proxy, it either adds a `Via` header or annotates the existing `Via` header
compliant with [RFC7230, Section 5.7.1](https://tools.ietf.org/html/rfc7230#section-5.7.1).
The service adds the Relay namespace hostname to `Via`.

| Code | Message  | Description                    |
| ---- | -------- | ------------------------------ |
| 200  | OK       | The request has been handled by at least one listener.  |
| 202  | Accepted | The request has been accepted by at least one listener. |

If there is an error, the service can reply as follows. Whether the response originates
from the service or from the listener can be identified through presence of the `Via`
header. If the header is present, the response is from the listener.

| Code | Error           | Description
| ---- | --------------- |--------- |
| 404  | Not Found       | The Hybrid Connection path is invalid or the base URL is malformed.
| 401  | Unauthorized    | The security token is missing or malformed or invalid.
| 403  | Forbidden       | The security token is not valid for this path and for this action.
| 500  | Internal Error  | Something went wrong in the service.
| 503  | Bad Gateway     | The request could not be routed to any listener.
| 504  | Gateway Timeout | The request was routed to a listener, but the listener did not acknowledge receipt in the required time.

## Next steps

* [Relay FAQ](relay-faq.md)
* [Create a namespace](relay-create-namespace-portal.md)
* [Get started with .NET](relay-hybrid-connections-dotnet-get-started.md)
* [Get started with Node](relay-hybrid-connections-node-get-started.md)
