---
ms.date: 11/02/2023
author: jfggdl
ms.author: jafernan
title: Concepts for Event Grid namespace topics
description: General concepts of Event Grid namespace topics and their main functionality such as pull and push delivery.
ms.topic: conceptual
ms.custom:
  - ignite-2023
---

# Azure Event Grid namespace concepts

This article introduces you to the main concepts and functionality associated to namespace topics.

## Events
An **event** is the smallest amount of information that fully describes something that happened in a system. We often refer to an event as a discrete event because it represents a distinct, self-standing fact about a system that provides an insight that can be actionable. Every event has common information like `source` of the event, `time` the event took place, and a unique identifier. Event every also has a `type`, which usually is a unique identifier that describes the kind of announcement the event is used for. 

For example, an event about a new file being created in Azure Storage has details about the file, such as the `lastTimeModified` value. An Event Hubs event has the URL of the captured file. An event about a new order in your Orders microservice might have an `orderId` attribute and a URL attribute to the order’s state representation. A few more examples of event types include: `com.yourcompany.Orders.OrderCreated`, `org.yourorg.GeneralLedger.AccountChanged`, `io.solutionname.Auth.MaximumNumberOfUserLoginAttemptsReached`. 

Here's a sample event:

```json
{
    "specversion" : "1.0",
    "type" : "com.yourcompany.order.created",
    "source" : "/orders/account/123",
    "subject" : "O-28964",
    "id" : "A234-1234-1234",
    "time" : "2018-04-05T17:31:00Z",
    "comexampleextension1" : "value",
    "comexampleothervalue" : 5,
    "datacontenttype" : "application/json",
    "data" : {
       "orderId" : "O-28964",
       "URL" : "https://com.yourcompany/orders/O-28964"
    }
}
```


### Another kind of event
The user community also refers as "events" to messages that carry a data point, such as a single device reading or a click on a web application page. That kind of event is usually analyzed over a time window to derive insights and take an action. In Event Grid’s documentation, we refer to that kind of event as a **data point**, **streaming data**, or simply as **telemetry**. Among other type of messages, this kind of events is used with Event Grid’s Message Queuing Telemetry Transport (MQTT) broker feature.

## CloudEvents
Event Grid namespace topics accepts events that comply with the Cloud Native Computing Foundation (CNCF)’s open standard [CloudEvents 1.0](https://github.com/cloudevents/spec) specification using the [HTTP protocol binding](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/bindings/http-protocol-binding.md) with [JSON format](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/formats/json-format.md). A CloudEvent is a kind of message that contains what is being communicated, referred as event data, and metadata about it. The event data in event-driven architectures typically carries the information announcing a system state change. The CloudEvents metadata is composed of a set of attributes that provide contextual information about the message like where it originated (the source system), its type, etc. All valid messages adhering to the CloudEvents specifications must include the following required [context attributes](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/spec.md#required-attributes): 

* [`id`](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/spec.md#id)
* [`source`](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/spec.md#source-1)
* [`specversion`](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/spec.md#specversion)
* [`type`](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/spec.md#type)

The CloudEvents specification also defines [optional](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/spec.md#optional-attributes) and [extension context attributes](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/spec.md#extension-context-attributes) that you can include when using Event Grid.

When using Event Grid, CloudEvents is the preferred event format because of its well-documented use cases ([modes](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/bindings/http-protocol-binding.md#13-content-modes) for transferring events, [event formats](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/bindings/http-protocol-binding.md#14-event-formats), etc.), extensibility, and improved interoperability. CloudEvents improves interoperability by providing a common event format for publishing and consuming events. It allows for uniform tooling and standard ways of routing & handling events.

### CloudEvents content modes

The CloudEvents specification defines three [content modes](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/bindings/http-protocol-binding.md#13-content-modes): [binary](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/bindings/http-protocol-binding.md#31-binary-content-mode), [structured](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/bindings/http-protocol-binding.md#32-structured-content-mode), and [batched](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/bindings/http-protocol-binding.md#33-batched-content-mode).

>[!IMPORTANT]
> With any content mode you can exchange text (JSON, text/*, etc.) or binary encoded event data. The binary content mode is not exclusively used for sending binary data.

The content modes aren't about the encoding you use, binary, or text, but about how the event data and its metadata are described and exchanged. The structured content mode uses a single structure, for example, a JSON object, where both the context attributes and event data are together in the HTTP payload. The binary content mode separates context attributes, which are mapped to HTTP headers, and event data, which is the HTTP payload encoded according to the media type set in ```Content-Type```.

### CloudEvents support

This table shows the current support for CloudEvents specification:

| CloudEvents content mode   | Supported?             |
|--------------|-----------|
| [Structured JSON](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/bindings/http-protocol-binding.md#32-structured-content-mode) | Yes      |
| [Structured JSON batched](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/bindings/http-protocol-binding.md#33-batched-content-mode)      | Yes, for publishing events  |
|[Binary](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/bindings/http-protocol-binding.md#31-binary-content-mode) | Yes, for publishing events|

The maximum allowed size for an event is 1 MB. Events over 64 KB are charged in 64-KB increments. 

### Structured content mode

A message in CloudEvents structured content mode has both the context attributes and the event data together in an HTTP payload.

>[!Important]
> Currently, Event Grid supports the [CloudEvents JSON format](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/formats/json-format.md) with HTTP.

Here's an example of a CloudEvents in structured mode using the JSON format. Both metadata (all attributes that aren't "data") and the message/event data (the "data" object) are described using JSON. Our example includes all required context attributes along with some optional attributes (`subject`, `time`, and `datacontenttype`) and extension attributes (`comexampleextension1`, `comexampleothervalue`).

```json
{
    "specversion" : "1.0",
    "type" : "com.yourcompany.order.created",
    "source" : "/orders/account/123",
    "subject" : "O-28964",
    "id" : "A234-1234-1234",
    "time" : "2018-04-05T17:31:00Z",
    "comexampleextension1" : "value",
    "comexampleothervalue" : 5,
    "datacontenttype" : "application/json",
    "data" : {
       "orderId" : "O-28964",
       "URL" : "https://com.yourcompany/orders/O-28964"
    }
}
```

You can use the JSON format with structured content to send event data that isn't a JSON value. To that end, you do the following steps:

1. Include a ```datacontenttype``` attribute with the media type in which the data is encoded.
1. If the media type is encoded in a text format like ```text/plain```, ```text/csv```, or ```application/xml```, you should use a ```data``` attribute with a JSON string containing what you are communicating as value.
1. If the media type represents a binary encoding, you should use a ```data_base64``` attribute whose value is a [JSON string](https://tools.ietf.org/html/rfc7159#section-7) containing the [BASE64](https://tools.ietf.org/html/rfc4648#section-4) encoded binary value.

For example, this CloudEvent carries event data encoded in ```application/protobuf``` to exchange Protobuf messages.

```json
{
    "specversion" : "1.0",
    "type" : "com.yourcompany.order.created",
    "source" : "/orders/account/123",
    "id" : "A234-1234-1234",
    "time" : "2018-04-05T17:31:00Z",
    "datacontenttype" : "application/protbuf",
    "data_base64" : "VGhpcyBpcyBub3QgZW5jb2RlZCBpbiBwcm90b2J1ZmYgYnV0IGZvciBpbGx1c3RyYXRpb24gcHVycG9zZXMsIGltYWdpbmUgdGhhdCBpdCBpcyA6KQ=="
}
```

For more information on the use of the ```data``` or ```data_base64``` attributes, see [Handling of data](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/formats/json-format.md#31-handling-of-data) . 

For more information about this content mode, see the CloudEvents [HTTP structured content mode specifications](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/bindings/http-protocol-binding.md#32-structured-content-mode) .

### Batched content mode

Event Grid currently supports the [JSON batched content mode](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/formats/json-format.md#4-json-batch-format) when **publishing** CloudEvents to Event Grid. This content mode uses a JSON array filled with CloudEvents in structured content mode. For example, your application can publish two events using an array like the following. Likewise, if you're using Event Grid's [data plane SDK](https://azure.github.io/azure-sdk/releases/latest/java.html), this payload is also what is being sent:

```json
[
    {
        "specversion": "1.0",
        "id": "E921-1234-1235",
        "source": "/mycontext",
        "type": "com.example.someeventtype",
        "time": "2018-04-05T17:31:00Z",
        "data": "some data"
    },
    {
        "specversion": "1.0",
        "id": "F555-1234-1235",
        "source": "/mycontext",
        "type": "com.example.someeventtype",
        "time": "2018-04-05T17:31:00Z",
        "data": {
            "somekey" : "value",
            "someOtherKey" : 9
        }
    }
]
```

For more information, see CloudEvents [Batched Content Mode](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/bindings/http-protocol-binding.md#33-batched-content-mode) specs.

### Batching

Your application should  batch several events together in an array to attain greater efficiency and higher throughput with a single publishing request. Batches can be up to 1 MB and the maximum size of an event is 1 MB.

### Binary content mode

A CloudEvent in binary content mode has its context attributes described as HTTP headers. The names of the HTTP headers are the name of the context attribute prefixed with ```ce-```. The ```Content-Type``` header reflects the media type in which the event data is encoded.

>[!IMPORTANT]
> When using the binary content mode the ```ce-datacontenttype``` HTTP header MUST NOT also be present.

>[!IMPORTANT]
> If you are planing to include your own attributes (i.e. extension attributes) when using the binary content mode, make sure that their names consist of lower-case letters ('a' to 'z') or digits ('0' to '9') from the ASCII character and that they do not exceed 20 character in lenght. That is, the naming convention for [naming CloudEvents context attributes](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/spec.md#attribute-naming-convention) is more restrictive than that of valid HTTP header names. Not every valid HTTP header name is a valid extension attribute name.

The HTTP payload is the event data encoded according to the media type in ```Content-Type```.

An HTTP request used to publish a CloudEvent in content binary mode can look like this example:

```http
POST / HTTP/1.1
HOST mynamespace.eastus-1.eventgrid.azure.net/topics/mytopic
ce-specversion: 1.0
ce-type: com.example.someevent
ce-source: /mycontext
ce-id: A234-1234-1234
ce-time: 2018-04-05T17:31:00Z
ce-comexampleextension1: value
ce-comexampleothervalue: 5
content-type: application/protobuf

Binary data according to protobuf encoding format. No context attributes are included.
```

### When to use CloudEvents' binary or structured content mode

You could use structured content mode if you want a simple approach for forwarding CloudEvents across hops and protocols. As structured content mode CloudEvents contain the message along its metadata together, it's easy for clients to consume it as a whole and forward it to other systems.

You could use binary content mode if you know downstream applications require only the message without any extra information (that is, the context attributes). While with structured content mode you can still get the event data (message) out of the CloudEvent, it's easier if a consumer application just has it in the HTTP payload. For example, other applications can use other protocols and could be interested only in your core message, not its metadata. In fact, the metadata could be relevant just for the immediate first hop. In this case, having the data that you want to exchange apart from its metadata lends itself for easier handling and forwarding.

## Publishers

A publisher is the application that sends events to Event Grid. It could be the same application where the events originated, the event source. You can publish events from your own application when using namespace topics.

## Event sources

An event source is where the event happens. Each event source supports one or more event types. For example, your application is the event source for custom events that your system defines. When using namespace topics, the event sources supported are your own applications.

## Namespaces

An Event Grid namespace is a management container for the following resources:

| Resource   | Protocol supported |
| :--- | :---: |
| Namespace topics | HTTP |
| Topic Spaces | MQTT |
| Clients | MQTT |
| Client Groups | MQTT |
| CA Certificates | MQTT |
| Permission bindings | MQTT |

With an Azure Event Grid namespace, you can group related resources and manage them as a single unit in your Azure subscription. It gives you a unique fully qualified domain name (FQDN). 

A Namespace exposes two endpoints:

* An HTTP endpoint to support general messaging requirements using namespace topics.
* An MQTT endpoint for IoT messaging or solutions that use MQTT.
  
A namespace also provides DNS-integrated network endpoints. It also provides a range of access control and network integration management features such as public IP ingress filtering and private links. It's also the container of managed identities used for contained resources in the namespace.

Here are few more points about namespaces:

- Namespace is a tracked resource with `tags` and `location` properties, and once created, it can be found on `resources.azure.com`.  
- The name of the namespace can be 3-50 characters long. It can include alphanumeric, and hyphen(-), and no spaces.  
- The name needs to be unique per region.
- **Current supported regions:** Central US, East Asia, East US, East US 2, North Europe, South Central US, Southeast Asia, UAE North, West Europe, West US 2, West US 3.

## Throughput units

Throughput units (TUs) define the ingress and egress event rate capacity in namespaces. For more information, see [Azure Event Grid quotas and limits](quotas-limits.md).

## Topics

A topic holds events that have been published to Event Grid. You typically use a topic resource for a collection of related events. We often referred to topics inside a namespace as **namespace topics**.

## Namespace topics
Namespace topics are topics that are created within an Event Grid namespace. Your application publishes events to an HTTP namespace endpoint specifying a namespace topic where published events are logically contained. When designing your application, you have to decide how many topics to create. For relatively large solutions, create a namespace topic for each category of related events. For example, consider an application that manages user accounts and another application about customer orders. It's unlikely that all event subscribers want events from both applications. To segregate concerns, create two namespace topics: one for each application. Let event consumers subscribe to the topic according to their requirements. For small solutions, you might prefer to send all events to a single topic.

Namespace topics support [pull delivery](pull-delivery-overview.md#pull-delivery) and [push delivery](namespace-push-delivery-overview.md). See [when to use pull or push delivery](pull-delivery-overview.md#push-and-pull-delivery) to help you decide if pull delivery is the right approach given your requirements.

## Event subscriptions

An event subscription is a configuration resource associated with a single topic. Among other things, you use an event subscription to set the event selection criteria to define the event collection available to a subscriber out of the total set of events available in a topic. You can filter events according to subscriber's requirements. For example, you can filter events by its event type. You can also define filter criteria on event data properties, if using a JSON object as the value for the *data* property. For more information on resource properties, look for control plane operations in the Event Grid [REST API](/rest/api/eventgrid).

:::image type="content" source="media/pull-and-push-delivery-overview/topic-event-subscriptions-namespace.png" alt-text="Diagram showing a topic and associated event subscriptions." lightbox="media/pull-and-push-delivery-overview/topic-event-subscriptions-namespace.png" border="false":::

For an example of creating subscriptions for namespace topics, see [Publish and consume messages using namespace topics using CLI](publish-events-using-namespace-topics.md).

> [!NOTE]
> The event subscriptions under a namespace topic feature a simplified resource model when compared to that used for custom, domain, partner, and system topics (Event Grid Basic). For more information, see Create, view, and managed [event subscriptions](create-view-manage-event-subscriptions.md#simplified-resource-model).


## Pull delivery

With pull delivery, your application connects to Event Grid to read messages using queue-like semantics. As applications connect to Event Grid to consume events, they are in control of the event consumption rate and its timing. Consumer applications can also use private endpoints when connecting to Event Grid to read events using private IP space.

Pull delivery supports the following operations for reading messages and controlling message state: *receive*, *acknowledge*, *release*, *reject*, and *renew lock*. For more information, see [pull delivery overview](pull-delivery-overview.md).

[!INCLUDE [data-shape-of-events-delivered-with-pull-delivery](./includes/data-shape-when-delivering-with-pull-delivery.md)]

## Push delivery

With push delivery, Event Grid sends events to a destination configured in a *push* (delivery mode in) event subscription. It provides a robust retry logic in case the destination isn't able to receive events.

>[!IMPORTANT]
>Event Grid namespaces' push delivery currently supports **Azure Event Hubs** as a destination. In the future, Event Grid namespaces will support more destinations, including all destinations supported by Event Grid basic.

### Event Hubs event delivery

Event Grid uses Event Hubs'SDK to send events to Event Hubs using [AMQP](https://www.amqp.org/about/what). Events are sent as a byte array with every element in the array containing a CloudEvent.

[!INCLUDE [differences-between-consumption-modes](./includes/differences-between-consumption-modes.md)]

## Next steps

* For an introduction to Event Grid, see [About Event Grid](overview.md).
* To get started using namespace topics, refer to [publish events using namespace topics](publish-events-using-namespace-topics.md).
