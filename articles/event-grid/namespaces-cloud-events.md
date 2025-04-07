---
ms.date: 09/25/2024
author: robece
ms.author: robece
title: Event Grid Namespaces - support for CloudEvents schema
description: Describes how Event Grid Namespaces support CloudEvents schema, which is an open source standard for defining events. 
ms.topic: concept-article
ms.custom: FY25Q1-Linter
#customer intent: As a developer or architect, I want to know whether and how Azure Event Grid Namespaces support CloudEvents schema.
---

# Azure Event Grid Namespaces - support for CloudEvents schema
Event Grid namespace topics accepts events that comply with the Cloud Native Computing Foundation (CNCF)’s open standard [CloudEvents 1.0](https://github.com/cloudevents/spec) specification using the [HTTP protocol binding](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/bindings/http-protocol-binding.md) with [JSON format](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/formats/json-format.md). A CloudEvent is a kind of message that contains what is being communicated, referred to as event data, and metadata about it. The event data in event-driven architectures typically carries the information announcing a system state change. The CloudEvents metadata is composed of a set of attributes that provide contextual information about the message like where it originated (the source system), its type, etc. All valid messages adhering to the CloudEvents specifications must include the following required [context attributes](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/spec.md#required-attributes): 

* [`id`](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/spec.md#id)
* [`source`](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/spec.md#source-1)
* [`specversion`](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/spec.md#specversion)
* [`type`](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/spec.md#type)

The CloudEvents specification also defines [optional](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/spec.md#optional-attributes) and [extension context attributes](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/spec.md#extension-context-attributes) that you can include when using Event Grid.

When using Event Grid, CloudEvents is the preferred event format because of its well-documented use cases ([modes](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/bindings/http-protocol-binding.md#13-content-modes) for transferring events, [event formats](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/bindings/http-protocol-binding.md#14-event-formats), etc.), extensibility, and improved interoperability. CloudEvents improves interoperability by providing a common event format for publishing and consuming events. It allows for uniform tooling and standard ways of routing & handling events.

## CloudEvents content modes

The CloudEvents specification defines three [content modes](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/bindings/http-protocol-binding.md#13-content-modes): [binary](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/bindings/http-protocol-binding.md#31-binary-content-mode), [structured](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/bindings/http-protocol-binding.md#32-structured-content-mode), and [batched](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/bindings/http-protocol-binding.md#33-batched-content-mode).

>[!IMPORTANT]
> With any content mode you can exchange text (JSON, text/*, etc.) or binary-encoded event data. The binary content mode is not exclusively used for sending binary data.

The content modes aren't about the encoding you use, binary, or text, but about how the event data and its metadata are described and exchanged. The structured content mode uses a single structure, for example, a JSON object, where both the context attributes and event data are together in the HTTP payload. The binary content mode separates context attributes, which are mapped to HTTP headers, and event data, which is the HTTP payload encoded according to the media type set in ```Content-Type```.

## CloudEvents support

This table shows the current support for CloudEvents specification:

| CloudEvents content mode   | Supported?             |
|--------------|-----------|
| [Structured JSON](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/bindings/http-protocol-binding.md#32-structured-content-mode) | Yes      |
| [Structured JSON batched](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/bindings/http-protocol-binding.md#33-batched-content-mode)      | Yes, for publishing events  |
|[Binary](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/bindings/http-protocol-binding.md#31-binary-content-mode) | Yes, for publishing events|

The maximum allowed size for an event is 1 MB. Events over 64 KB are charged in 64-KB increments. 

## Structured content mode

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
    "datacontenttype" : "application/protobuf",
    "data_base64" : "VGhpcyBpcyBub3QgZW5jb2RlZCBpbiBwcm90b2J1ZmYgYnV0IGZvciBpbGx1c3RyYXRpb24gcHVycG9zZXMsIGltYWdpbmUgdGhhdCBpdCBpcyA6KQ=="
}
```

For more information on the use of the ```data``` or ```data_base64``` attributes, see [Handling of data](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/formats/json-format.md#31-handling-of-data) . 

For more information about this content mode, see the CloudEvents [HTTP structured content mode specifications](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/bindings/http-protocol-binding.md#32-structured-content-mode) .

## Batched content mode

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

## Batching

Your application should  batch several events together in an array to attain greater efficiency and higher throughput with a single publishing request. Batches can be up to 1 MB and the maximum size of an event is 1 MB.

## Binary content mode

A CloudEvent in binary content mode has its context attributes described as HTTP headers. The names of the HTTP headers are the name of the context attribute prefixed with ```ce-```. The ```Content-Type``` header reflects the media type in which the event data is encoded.

>[!IMPORTANT]
> When using the binary content mode the ```ce-datacontenttype``` HTTP header MUST NOT also be present.

>[!IMPORTANT]
> If you are planning to include your own attributes (i.e. extension attributes) when using the binary content mode, make sure that their names consist of lower-case letters ('a' to 'z') or digits ('0' to '9') from the ASCII character and that they do not exceed 20 characters in length. That is, the naming convention for [naming CloudEvents context attributes](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/spec.md#attribute-naming-convention) is more restrictive than that of valid HTTP header names. Not every valid HTTP header name is a valid extension attribute name.

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

## When to use CloudEvents' binary or structured content mode

You could use structured content mode if you want a simple approach for forwarding CloudEvents across hops and protocols. Since a CloudEvent in structured content mode contains the message together with its metadata, it's easy for clients to consume it as a whole and forward it to other systems.

You could use binary content mode if you know downstream applications require only the message without any extra information (that is, the context attributes). While with structured content mode you can still get the event data (message) out of the CloudEvent, it's easier if a consumer application just has it in the HTTP payload. For example, other applications can use other protocols and may be interested only in your core message, not its metadata. In fact, the metadata could be relevant just for the immediate first hop. In this case, having the data that you want to exchange apart from its metadata lends itself to easier handling and forwarding.

## Related content

* For an introduction to Event Grid, see [About Event Grid](overview.md).
* To get started using namespace topics, refer to [publish events using namespace topics](publish-events-using-namespace-topics.md).
