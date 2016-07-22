<properties 
    pageTitle="AMQP 1.0 in Azure Service Bus and Event Hubs protocol guide | Microsoft Azure" 
    description="Protocol guide to expressions and description of AMQP 1.0 in Azure Service Bus and Event Hubs" 
    services="service-bus,event-hubs" 
    documentationCenter=".net" 
    authors="clemensv" 
    manager="timlt" 
    editor=""/>

<tags
    ms.service="service-bus"
    ms.devlang="na"
    ms.topic="article"
    ms.tgt_pltfrm="na"
    ms.workload="na" 
    ms.date="07/01/2016"
    ms.author="clemensv;jotaub;hillaryc;sethm"/>

# AMQP 1.0 in Azure Service Bus and Event Hubs protocol guide

The Advanced Message Queueing Protocol 1.0 is a standardized framing and transfer protocol for asynchronously, securely, and reliably transferring messages between two parties. It is the primary protocol of Azure Service Bus Messaging and Azure Event Hubs. Both services also support HTTPS. The proprietary SBMP protocol that is also supported is being phased out in favor of AMQP.

AMQP 1.0 is the result of broad industry collaboration that brought together middleware vendors, such as Microsoft and Red Hat, with many messaging middleware users such as JP Morgan Chase representing the financial services industry. The technical standardization forum for the AMQP protocol and extension specifications is OASIS, and it has achieved formal approval as an international standard as ISO/IEC 19494.

## Goals

This article briefly summarizes the core concepts of the AMQP 1.0 messaging specification along with a small set of draft extension specifications that are currently being finalized in the OASIS AMQP technical committee and explains how Azure Service Bus implements and builds on these specifications.

The goal is for any developer using any existing AMQP 1.0 client stack on any platform to be able to interact with Azure Service Bus via AMQP 1.0.

Common general purpose AMQP 1.0 stacks, such as Apache Proton or AMQP.NET Lite, already implement all core AMQP 1.0 gestures. Those foundational gestures are sometimes wrapped with a higher level API; Apache Proton even offers two, the imperative Messenger API and the reactive Reactor API.

In the following discussion, we will assume that the management of AMQP connections, sessions, and links and the handling of frame transfers and flow control are handled by the respective stack (such as Apache Proton-C) and do not require much if any specific attention from application developers. We will abstractly assume the existence of a few API primitives like the ability to connect, and to create some form of *sender* and *receiver* abstraction objects, which then have some shape of `send()` and `receive()` operations, respectively.

When discussing advanced capabilities of Azure Service Bus, such as message browsing or management of sessions, those will be explained in AMQP terms, but also as a layered pseudo-implementation on top of this assumed API abstraction.

## What is AMQP?

AMQP is a framing and transfer protocol. Framing means that it provides structure for binary data streams that flow in either direction of a network connection. The structure provides delineation for distinct blocks of data – frames – to be exchanged between the connected parties. The transfer capabilities make sure that both communicating parties can establish a shared understanding about when frames shall be transferred, and when transfers shall be considered complete.

Unlike earlier expired draft versions produced by the AMQP working group that are still in use by a few message brokers, the working group's final, and standardized AMQP 1.0 protocol does not prescribe the presence of a message broker or any particular topology for entities inside a message broker.

The protocol can be used for symmetric peer-to-peer communication, for interaction with message brokers that support queues and publish/subscribe entities, as Azure Service Bus does. It can also be used for interaction with messaging infrastructure where the interaction patterns are different from regular queues, as is the case with Azure Event Hubs. An Event Hub acts like a queue when events are sent to it, but acts more like a serial storage service when events are read from it; it somewhat resembles a tape drive. The client picks an offset into the available data stream and is then served all events from that offset to the latest available.

The AMQP 1.0 protocol is designed to be extensible, allowing further specifications to enhance its capabilities. The three extension specifications we will discuss in this document illustrate this. For communication over existing HTTPS/WebSockets infrastructure where configuring the native AMQP TCP ports may be difficult, a binding specification defines how to layer AMQP over WebSockets. For interacting with the messaging infrastructure in a request/response fashion for management purposes or to provide advanced functionality, the AMQP Management specification defines the required basic interaction primitives. For federated authorization model integration, the AMQP claims-based-security specification defines how to associate and renew authorization tokens associated with links.

## Basic AMQP scenarios

This section explains basic usage of AMQP 1.0 with Azure Service Bus, which includes creating connections, sessions, and links, and transferring messages to and from Service Bus entities such as queues, topics, and subscriptions.

The most authoritative source to learn about how AMQP works is the AMQP 1.0 specification, but the specification was written to precisely guide implementation and not to teach the protocol. This section focuses on introducing as much terminology as needed for describing how Service Bus uses AMQP 1.0. For a more comprehensive introduction to AMQP, as well as a broader discussion of AMQP 1.0, you can review [this video course][].

### Connections and sessions

![][1]

AMQP calls the communicating programs *containers*; those contain *nodes*, which are the communicating entities inside of those containers. A queue can be such a node. AMQP allows for multiplexing, so a single connection can be used for many communication paths between nodes; for example, an application client can concurrently receive from one queue and send to another queue over the same network connection.

The network connection is thus anchored on the container. It is initiated by the container in the client role making an outbound TCP socket connection to a container in the receiver role which listens for and accepts inbound TCP connections. The connection handshake includes negotiating the protocol version, declaring or negotiating the use of Transport Level Security (TLS/SSL), and an authentication/authorization handshake at the connection scope that is based on SASL.

Azure Service Bus requires the use of TLS at all times. It supports connections over TCP port 5671, whereby the TCP connection is first overlaid with TLS before entering the AMQP protocol handshake, and also supports connections over TCP port 5672 whereby the server immediately offers a mandatory upgrade of connection to TLS using the AMQP-prescribed model. The AMQP WebSockets binding creates a tunnel over TCP port 443 that is then equivalent to AMQP 5671 connections.

After setting up the connection and TLS, Service Bus offers two SASL mechanism options:

-   SASL PLAIN is commonly used for passing username and password credentials to a server. Service Bus does not have accounts, but named [Shared Access Security rules](service-bus-shared-access-signature-authentication.md), which confer rights and are associated with a key. The name of a rule is used as the user name and the key (as base64 encoded text) is used as the password. The rights associated with the chosen rule govern the operations allowed on the connection.

-   SASL ANONYMOUS is used for bypassing SASL authorization when the client wants to use the claims-based-security (CBS) model that will be described later. With this option, a client connection can be established anonymously for a short time during which the client can only interact with the CBS endpoint and the CBS handshake must complete.

After the transport connection is established, the containers each declare the maximum frame size they are willing to handle, and after which idle timeout they’ll unilaterally disconnect if there is no activity on the connection.

They also declare how many concurrent channels are supported. A channel is a unidirectional, outbound, virtual transfer path on top of the connection. A session takes a channel from each of the interconnected containers to form a bi-directional communication path.

Sessions have a window-based flow control model; when a session is created, each party declares how many frames it is willing to accept into its receive window. As the parties exchange frames, transferred frames fill that window and transfers stop when the window is full and until the window gets reset or expanded using the *flow performative* (*performative* is the AMQP term for protocol-level gestures exchanged between the two parties).

This window-based model is roughly analogous to the TCP concept of window-based flow control, but at the session level inside the socket. The protocol’s concept of allowing for multiple concurrent sessions exists so that high priority traffic could be rushed past throttled normal traffic, like on a highway express lane.

Azure Service Bus currently uses exactly one session for each connection. The Service Bus maximum frame-size is 262,144 bytes (256K bytes) for Service Bus Standard and Event Hubs. It is 1,048,576 (1 MB) for Service Bus Premium. Service Bus does not impose any particular session-level throttling windows, but resets the window regularly as part of link-level flow control (see [the next section](#links)).

Connections, channels, and sessions are ephemeral. If the underlying connection collapses, connections, TLS tunnel, SASL authorization context, and sessions must be reestablished.

### Links

![][2]

AMQP transfers messages over links. A link is a communication path created over a session that enables transferring messages in one direction; the transfer status negotiation is over the link and bi-directional between the connected parties.

Links can be created by either container at any time and over an existing session, which makes AMQP different from many other protocols, including HTTP and MQTT, where the initiation of transfers and transfer path is an exclusive privilege of the party creating the socket connection.

The link-initiating container asks the opposite container to accept a link and it chooses a role of either sender or receiver. Therefore, either container can initiate creating unidirectional or bi-directional communication paths, with the latter modeled as pairs of links.

Links are named and associated with nodes. As stated in the beginning, nodes are the communicating entities inside a container.

In Azure Service Bus, a node is directly equivalent to a queue, a topic, a subscription, or a deadletter sub-queue of a queue or subscription. The node name used in AMQP is therefore the relative name of the entity inside of the Service Bus namespace. If a queue is named **myqueue**, that’s also its AMQP node name. A topic subscription follows the HTTP API convention by being sorted into a “subscriptions” resource collection and thus, a subscription **sub** or a topic **mytopic** has the AMQP node name **mytopic/subscriptions/sub**.

The connecting client is also required to use a local node name for creating links; Service Bus is not prescriptive about those node names and will not interpret them. AMQP 1.0 client stacks generally use a scheme to assure that these ephemeral node names are unique in the scope of the client.

### Transfers

![][3]

Once a link has been established, messages can be transferred over that link. In AMQP, a transfer is executed with an explicit protocol gesture (the *transfer* performative) that moves a message from sender to receiver over a link. A transfer is complete when it is “settled”, meaning that both parties have established a shared understanding of the outcome of that transfer.

In the simplest case, the sender can choose to send messages "pre-settled," meaning that the client isn’t interested in the outcome and the receiver will not provide any feedback about the outcome of the operation. This mode is supported by Azure Service Bus at the AMQP protocol level, but not exposed in any of the client APIs.

The regular case is that messages are being sent unsettled, and the receiver will then indicate acceptance or rejection using the *disposition* performative. Rejection occurs when the receiver cannot accept the message for any reason, and the rejection message contains information about the reason, which is an error structure defined by AMQP. If messages are rejected due to internal errors inside of Azure Service Bus, the service returns extra information inside that structure that can be used for providing diagnostics hints to support personnel if you are filing support requests. You’ll learn more details about errors later.

A special form of rejection is the *released* state, which indicates that the receiver has no technical objection to the transfer, but also no interest in settling the transfer. That case exists, for instance, when a message is delivered to a Service Bus client, and the client chooses to "abandon" the message because it cannot perform the work resulting from processing the message while the message delivery itself is not at fault. A variation of that state is the *modified* state, which allows changes to the message as it is released. That state is not used by Service Bus at present.

The AMQP 1.0 specification defines a further disposition state *received* that specifically helps to handle link recovery. Link recovery allows reconstituting the state of a link and any pending deliveries on top of a new connection and session, when the prior connection and session were lost.

Azure Service Bus does not support link recovery; if the client loses the connection to Service Bus with an unsettled message transfer pending, that message transfer is lost, and the client must reconnect, reestablish the link, and retry the transfer.

As such, Azure Service Bus and Event Hubs do support "at least once" transfers where the sender can be assured for the message having been stored and accepted, but it does not support "exactly once" transfers at the AMQP level, where the system would attempt to recover the link and continue to negotiate the delivery state to avoid duplication of the message transfer.

To compensate for possible duplicate sends, Azure Service Bus supports duplicate detection as an optional feature on queues and topics. Duplicate detection records the message IDs of all incoming messages during a user-defined time window, and silently drop all messages sent with the same message-IDs during that same window.

### Flow control

![][4]

In addition to the session-level flow control model that previously discussed, each link has its own flow control model. Session-level flow control protects the container from having to handle too many frames at once, link-level flow control puts the application in charge of how many messages it wants to handle from a link and when.

On a link, transfers can only happen when the sender has enough “link credit”. Link credit is a counter set by the receiver using the *flow* performative, which is scoped to a link. When and while the sender is assigned link credit, it will attempt to use up that credit by delivering messages. Each message delivery decrements the remaining link credit by one. When the link credit is used up, deliveries stop.

When Service Bus is in the receiver role it will instantly provide the sender with ample link credit, so that messages can be sent immediately. As link credit is being used, Service Bus will occasionally send a *flow* performative to the sender to update the link credit balance.

In the sender role, Service Bus will eagerly send messages to use up any outstanding link credit.

A "receive" call at the API level translates into a *flow* performative being sent to Service Bus by the client, and Service Bus will consume that credit by taking the first available, unlocked message from the queue, locking it and transferring it. If there is no message readily available for delivery, any outstanding credit by any link established with that particular entity will remain recorded in order of arrival and messages will be locked and transferred as they become available to use any outstanding credit.

The lock on a message is released when the transfer is settled into one of the terminal states *accepted*, *rejected*, or *released*. The message is removed from Service Bus when the terminal state is *accepted*. It remains in Service Bus and will be delivered to the next receiver when the transfer reaches any of the other states. Service Bus will automatically move the message into the entity's deadletter queue when it reaches the maximum delivery count allowed for the entity due to repeated rejections or releases.

Even though the official Service Bus APIs do not directly expose such an option today, a lower-level AMQP protocol client can use the link-credit model to turn the "pull-style" interaction of issuing one unit of credit for each receive request into a "push-style" model by issuing a very large number of link credits and then receive messages as they become available without any further interaction. Push is supported through the [MessagingFactory.PrefetchCount](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.messagingfactory.prefetchcount.aspx) or [MessageReceiver.PrefetchCount](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.messagereceiver.prefetchcount.aspx) property settings. When they are non-zero, the AMQP client uses it as the link credit.

In this context it's important to understand that the clock for the expiration of the lock on the message inside the entity starts when the message is taken from the entity and not when the message is being put on the wire. Whenever the client indicates readiness to receive messages by issuing link credit, it is therefore expected to be actively pulling messages across the network and be ready to handle them. Otherwise the message lock may have expired before the message is even delivered. The use of link-credit flow control should directly reflect the immediate readiness to deal with available messages dispatched to the receiver.

In summary, the following sections provide a schematic overview of the performative flow during different API interactions. Each section describes a different logical operation. Some of those interactions may be "lazy," meaning they may only be performed once required. Creating a message sender may not cause a network interaction until the first message is sent or requested.

The arrows show the performative flow direction.

#### Create Message Receiver

| Client                                                                                                                                            	| Service Bus                                                                                                                                	|
|---------------------------------------------------------------------------------------------------------------------------------------------------	|--------------------------------------------------------------------------------------------------------------------------------------------	|
| --> attach(<br/>name={link name},<br/>handle={numeric handle},<br/>role=**receiver**,<br/>source={entity name},<br/>target={client link id}<br/>)        	| Client attaches to entity as receiver                                                                                                      	|
| Service Bus replies attaching its end of the link                                                                                                 	| <-- attach(<br/>name={link name},<br/>handle={numeric handle},<br/>role=**sender**,<br/>source={entity name},<br/>target={client link id}<br/>)   	|

#### Create Message Sender

| Client                                                                                                           	| Service Bus                                                                                                        	|
|------------------------------------------------------------------------------------------------------------------	|--------------------------------------------------------------------------------------------------------------------	|
| --> attach(<br/>name={link name},<br/>handle={numeric handle},<br/>role=**sender**,<br/>source={client link id},<br/>target={entity name}<br/>) 	| No action                                                                                                                 	|
| No action                                                                                                               	| <-- attach(<br/>name={link name},<br/>handle={numeric handle},<br/>role=**receiver**,<br/>source={client link id},<br/>target={entity name}<br/>) 	|

#### Create Message Sender (Error)

| Client                                                                                                           	| Service Bus                                                         	|
|------------------------------------------------------------------------------------------------------------------	|---------------------------------------------------------------------	|
| --> attach(<br/>name={link name},<br/>handle={numeric handle},<br/>role=**sender**,<br/>source={client link id},<br/>target={entity name}<br/>) 	| No action                                                                  	|
| No action                                                                                                               	| <-- attach(<br/>name={link name},<br/>handle={numeric handle},<br/>role=**receiver**,<br/>source=null,<br/>target=null<br/>)<br/><br/><-- detach(<br/>handle={numeric handle},<br/>closed=**true**,<br/>error={error info}<br/>) 	|

#### Close Message Receiver/Sender

| Client                                          	| Service Bus                                     	|
|-------------------------------------------------	|-------------------------------------------------	|
| --> detach(<br/>handle={numeric handle},<br/>closed=**true**<br/>) 	| No action                                              	|
| No action                                              	| <-- detach(<br/>handle={numeric handle},<br/>closed=**true**<br/>) 	|

#### Send (Success)

| Client                                                                                                                       	| Service Bus                                                                                          	|
|------------------------------------------------------------------------------------------------------------------------------	|------------------------------------------------------------------------------------------------------	|
| --> transfer(<br/>delivery-id={numeric handle},<br/>delivery-tag={binary handle},<br/>settled=**false**,,more=**false**,<br/>state=**null**,<br/>resume=**false**<br/>) 	| No action                                                                                                   	|
| No action                                                                                                                           	| <-- disposition(<br/>role=receiver,<br/>first={delivery id},<br/>last={delivery id},<br/>settled=**true**,<br/>state=**accepted**<br/>) 	|

#### Send (Error)

| Client                                                                                                                       	| Service Bus                                                                                                                 	|
|------------------------------------------------------------------------------------------------------------------------------	|-----------------------------------------------------------------------------------------------------------------------------	|
| --> transfer(<br/>delivery-id={numeric handle},<br/>delivery-tag={binary handle},<br/>settled=**false**,,more=**false**,<br/>state=**null**,<br/>resume=**false**<br/>) 	| No action                                                                                                                          	|
| No action                                                                                                                           	| <-- disposition(<br/>role=receiver,<br/>first={delivery id},<br/>last={delivery id},<br/>settled=**true**,<br/>state=**rejected**(<br/>error={error info}<br/>)<br/>) 	|

#### Receive

| Client                                                                                               	| Service Bus                                                                                                                  	|
|------------------------------------------------------------------------------------------------------	|------------------------------------------------------------------------------------------------------------------------------	|
| --> flow(<br/>link-credit=1<br/>)                                                                              	| No action                                                                                                                           	|
| No action                                                                                                   	| < transfer(<br/>delivery-id={numeric handle},<br/>delivery-tag={binary handle},<br/>settled=**false**,<br/>more=**false**,<br/>state=**null**,<br/>resume=**false**<br/>) 	|
| --> disposition(<br/>role=**receiver**,<br/>first={delivery id},<br/>last={delivery id},<br/>settled=**true**,<br/>state=**accepted**<br/>) 	| No action                                                                                                                           	|

#### Multi-Message Receive

| Client                                                                                                 	| Service Bus                                                                                                                    	|
|--------------------------------------------------------------------------------------------------------	|--------------------------------------------------------------------------------------------------------------------------------	|
| --> flow(<br/>link-credit=3<br/>)                                                                                	| No action                                                                                                                             	|
| No action                                                                                                     	| < transfer(<br/>delivery-id={numeric handle},<br/>delivery-tag={binary handle},<br/>settled=**false**,<br/>more=**false**,<br/>state=**null**,<br/>resume=**false**<br/>)   	|
| No action                                                                                                     	| < transfer(<br/>delivery-id={numeric handle+1},<br/>delivery-tag={binary handle},<br/>settled=**false**,<br/>more=**false**,<br/>state=**null**,<br/>resume=**false**<br/>) 	|
| No action                                                                                                     	| < transfer(<br/>delivery-id={numeric handle+2},<br/>delivery-tag={binary handle},<br/>settled=**false**,<br/>more=**false**,<br/>state=**null**,<br/>resume=**false**<br/>) 	|
| --> disposition(<br/>role=receiver,<br/>first={delivery id},<br/>last={delivery id+2},<br/>settled=**true**,<br/>state=**accepted**<br/>) 	| No action                                                                                                                             	|

### Messages

The following sections explain which properties from the standard AMQP message sections are used by Service Bus and how they map to the official Service Bus APIs.

#### header

| Field Name     	| Usage                         	| API Name      	|
|----------------	|-------------------------------	|---------------	|
| durable        	| -                             	| -             	|
| priority       	| -                             	| -             	|
| ttl            	| Time to live for this message 	| [TimeToLive](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.brokeredmessage.timetolive.aspx)    	|
| first-acquirer 	| -                             	| -             	|
| delivery-count 	| -                             	| [DeliveryCount](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.brokeredmessage.deliverycount.aspx) 	|

#### properties

| Field Name           	| Usage                                                                                                                           	| API Name                                   	|
|----------------------	|---------------------------------------------------------------------------------------------------------------------------------	|--------------------------------------------	|
| message-id           	| Application-defined, free-form identifier for this message. Used for duplicate detection.                                       	| [MessageId](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.brokeredmessage.messageid.aspx)                                  	|
| user-id              	| Application-defined user identifier, not interpreted by Service Bus.                                                             	| Not accessible through the Service Bus API. 	|
| to                   	| Application-defined destination identifier, not interpreted by Service Bus.                                                      	| [To](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.brokeredmessage.to.aspx)                                         	|
| subject              	| Application-defined message purpose identifier, not interpreted by Service Bus.                                                  	| [Label](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.brokeredmessage.label.aspx)                                      	|
| reply-to             	| Application-defined reply-path indicator, not interpreted by Service Bus.                                                        	| [ReplyTo](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.brokeredmessage.replyto.aspx)                                    	|
| correlation-id       	| Application-defined correlation identifier, not interpreted by Service Bus.                                                      	| [CorrelationId](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.brokeredmessage.correlationid.aspx)                              	|
| content-type         	| Application-defined content-type indicator for the body, not interpreted by Service Bus.                                         	| [ContentType](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.brokeredmessage.contenttype.aspx)                                	|
| content-encoding     	| Application-defined content-encoding indicator for the body, not interpreted by Service Bus.                                     	| Not accessible through the Service Bus API. 	|
| absolute-expiry-time 	| Declares at which absolute instant the message will expire. Ignored on input (header ttl is observed), authoritative on output. 	| [ExpiresAtUtc](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.brokeredmessage.expiresatutc.aspx)                               	|
| creation-time        	| Declares at which time the message was created. Not used by Service Bus                                                         	| Not accessible through the Service Bus API. 	|
| group-id             	| Application-defined identifier for a related set of messages. Used for Service Bus sessions.                                    	| [SessionId](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.brokeredmessage.sessionid.aspx)                                  	|
| group-sequence       	| Counter identifying the relative sequence number of the message inside a session. Ignored by Service Bus.                       	| Not accessible through the Service Bus API. 	|
| reply-to-group-id    	| -                                                                                                                               	| [ReplyToSessionId](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.brokeredmessage.replytosessionid.aspx)                           	|

## Advanced Service Bus capabilities

This section covers advanced capabilities of Azure Service Bus that are based on draft extensions to AMQP currently being developed in the OASIS Technical Committee for AMQP. Azure Service Bus implements the latest status of these drafts and will adopt changes introduced as those drafts reach standard status.

> [AZURE.NOTE] Service Bus Messaging advanced operations are supported thought a request/response pattern. The details of these operations are described in the document [AMQP 1.0 in Service Bus: request/response-based operations](https://msdn.microsoft.com/library/azure/mt727956.aspx).

### AMQP management

The AMQP Management specification is the first of the draft extensions we’ll discuss here. This specification defines a set of protocol gestures layered on top of the AMQP protocol that allow management interactions with the messaging infrastructure over AMQP. The specification defines generic operations such as *create*, *read*, *update*, and *delete* for managing entities inside a messaging infrastructure and a set of query operations.

All those gestures require a request/response interaction between the client and the messaging infrastructure, and therefore the specification defines how to model that interaction pattern on top of AMQP: The client connects to the messaging infrastructure, initiates a session, and then creates a pair of links. On one link, the client acts as sender and on the other it acts as receiver, thus creating a pair of links that can act as a bi-directional channel.

| Logical Operation            | Client                      | Service Bus                 |
|------------------------------|-----------------------------|-----------------------------|
| Create Request Response Path | --> attach(<br/>name={*link name*},<br/>handle={*numeric handle*},<br/>role=**sender**,<br/>source=**null**,<br/>target=”myentity/$management”<br/>)                            |No action                             |
|Create Request Response Path                              |No action                             | \<-- attach(<br/>name={*link name*},<br/>handle={*numeric handle*},<br/>role=**receiver**,<br/>source=null,<br/>target=”myentity”<br/>)                            |
|Create Request Response Path                              | --> attach(<br/>name={*link name*},<br/>handle={*numeric handle*},<br/>role=**receiver**,<br/>source=”myentity/$management”,<br/>target=”myclient$id”<br/>)                            |                             |No action
|Create Request Response Path                              |No action                             | \<-- attach(<br/>name={*link name*},<br/>handle={*numeric handle*},<br/>role=**sender**,<br/>source=”myentity”,<br/>target=”myclient$id”<br/>)                            |

Having that pair of links in place, the request/response implementation is straightforward: A request is a message sent to an entity inside the messaging infrastructure that understands this pattern. In that request-message, the *reply-to* field in the *properties* section is set to the *target* identifier for the link onto which to deliver the response. The handling entity will process the request, and then deliver the reply over the link whose *target* identifier matches the indicated *reply-to* identifier.

The pattern obviously requires that the client container and the client-generated identifier for the reply destination are unique across all clients and, for security reasons, also difficult to predict.

The message exchanges used for the management protocol and for all other protocols that use the same pattern happen at the application level; they do not define new AMQP protocol-level gestures. That’s intentional so that applications can take immediate advantage of these extensions with compliant AMQP 1.0 stacks.

Azure Service Bus does not currently implement any of the core features of the management specification, but the request/response pattern defined by the management specification is foundational for the claims-based-security feature and for nearly all of the advanced capabilities we will discuss in the following sections.

### Claims-based authorization

The AMQP Claims-Based-Authorization (CBS) specification draft builds on the management specification’s request/response pattern, and describes a generalized model for how to use federated security tokens with AMQP.

The default security model of AMQP discussed in the introduction is based on SASL and integrates with the AMQP connection handshake. Using SASL has the advantage that it provides an extensible model for which a set of mechanisms have been defined from which any protocol that formally leans on SASL can benefit. Amongst those mechanisms are “PLAIN” for transfer of usernames and passwords, “EXTERNAL” to bind to TLS-level security, “ANONYMOUS” to express the absence of explicit authentication/authorization, and a broad variety of additional mechanisms that allow passing authentication and/or authorization credentials or tokens.

AMQP’s SASL integration has two drawbacks:

-   All credentials and tokens are scoped to the connection. A messaging infrastructure may want to provide differentiated access control on a per-entity basis. For example, allowing the bearer of a token to send to queue A but not to queue B. With the authorization context anchored on the connection, it’s not possible to use a single connection and yet use different access tokens for queue A and queue B.

-   Access tokens are typically only valid for a limited time. This forces the user to periodically reacquire tokens and provides an opportunity to the token issuer to refuse issuing a fresh token if the user’s access permissions have changed. AMQP connections may last for very long periods of time. The SASL model only provides a chance to set a token at connection time, which means that the messaging infrastructure either has to disconnect the client when the token expires or it needs to accept the risk of allowing continued communication with a client who’s access rights may have been revoked in the interim.

The AMQP CBS specification, implemented by Azure Service Bus, allows an elegant workaround for both of those issues: It allows a client to associate access tokens with each node, and to update those tokens before they expire, without interrupting the message flow.

CBS defines a virtual management node, named *$cbs*, to be provided by the messaging infrastructure. The management node accepts tokens on behalf of any other nodes in the messaging infrastructure.

The protocol gesture is a request/reply exchange as defined by the management specification. That means the client establishes a pair of links with the *$cbs* node and then passes a request on the outbound link, and then waits for the response on the inbound link.

The request message has the following application properties:

| Key        | Optional | Value Type | Value Contents                             |
|------------|----------|------------|--------------------------------------------|
| operation  | No       | string     | **put-token**                                |
| type       | No       | string     | The type of the token being put.            |
| name       | No       | string     | The "audience" to which the token applies. |
| expiration | Yes      | timestamp  | The expiry time of the token.              |

The *name* property identifies the entity with which the token shall be associated. In Service Bus it’s the path to the queue, or topic/subscription. The *type* property identifies the token type:

| Token Type                      | Token Description      | Body Type           | Notes                                                    |
|---------------------------------|------------------------|---------------------|----------------------------------------------------------|
| amqp:jwt                        | JSON Web Token (JWT)   | AMQP Value (string) | Not yet available.  |
| amqp:swt                        | Simple Web Token (SWT) | AMQP Value (string) | Only supported for SWT tokens issued by AAD/ACS          |
| servicebus.windows.net:sastoken | Service Bus SAS Token  | AMQP Value (string) | -                                                        |

Tokens confer rights. Service Bus knows three fundamental rights: “Send” allows sending, “Listen” allows receiving, and “Manage” allows manipulating entities. SWT tokens issued by AAD/ACS explicitly include those rights as claims. Service Bus SAS tokens refer to rules configured on the namespace or entity, and those rules are configured with rights. Signing the token with the key associated with that rule thus makes the token express the respective rights. The token associated with an entity using *put-token* will permit the connected client to interact with the entity per the token rights. A link where the client takes on the *sender* role requires the “Send” right, taking on the *receiver* role requires the “Listen” right.

The reply message has the following *application-properties* values

| Key                | Optional | Value Type | Value Contents                    |
|--------------------|----------|------------|-----------------------------------|
| status-code        | No       | int        | HTTP response code **[RFC2616]**. |
| status-description | Yes      | string     | Description of the status.        |

The client can call *put-token* repeatedly and for any entity in the messaging infrastructure. The tokens are scoped to the current client and anchored on the current connection, meaning the server will drop any retained tokens when the connection drops.

The current Service Bus implementation only allows CBS in conjunction with the SASL method “ANONYMOUS”. A SSL/TLS connection must always exist prior to the SASL handshake.

The ANONYMOUS mechanism must therefore be supported by the chosen AMQP 1.0 client. Anonymous access means that the initial connection handshake, including creating of the initial session happens without Service Bus knowing who is creating the connection.

Once the connection and session is established, attaching the links to the *$cbs* node and sending the *put-token* request are the only permitted operations. A valid token must be set successfully using a *put-token* request for some entity node within 20 seconds after the connection has been established, otherwise the connection is unilaterally dropped by Service Bus.

The client is subsequently responsible for keeping track of token expiration. When a token expires, Service Bus will promptly drop all links on the connection to the respective entity. To prevent this, the client can replace the token for the node with a new one at any time through the virtual *$cbs* management node with the same *put-token* gesture, and without getting in the way of the payload traffic that flows on different links.

## Next steps

To learn more about AMQP, see the following links:

- [Service Bus AMQP overview]
- [AMQP 1.0 support for Service Bus partitioned queues and topics]
- [AMQP in Service Bus for Windows Server]

[this video course]: https://www.youtube.com/playlist?list=PLmE4bZU0qx-wAP02i0I7PJWvDWoCytEjD
[1]: ./media/service-bus-amqp/amqp1.png
[2]: ./media/service-bus-amqp/amqp2.png
[3]: ./media/service-bus-amqp/amqp3.png
[4]: ./media/service-bus-amqp/amqp4.png

[Service Bus AMQP overview]: service-bus-amqp-overview.md
[AMQP 1.0 support for Service Bus partitioned queues and topics]: service-bus-partitioned-queues-and-topics-amqp-overview.md
[AMQP in Service Bus for Windows Server]: https://msdn.microsoft.com/library/dn574799.aspx