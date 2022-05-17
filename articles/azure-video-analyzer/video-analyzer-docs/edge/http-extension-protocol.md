---
title: HTTP extension protocol
description: Azure Video Analyzer allows you to enhance its processing capabilities through a pipeline extension node. HTTP extension processor enables extensibility scenarios using the HTTP protocol, where performance and/or optimal resource utilization is not the primary concern.
ms.topic: reference
ms.date: 11/04/2021
ms.custom: ignite-fall-2021
---

# Use the HTTP extension protocol 

[!INCLUDE [header](includes/edge-env.md)]

[!INCLUDE [deprecation notice](../includes/deprecation-notice.md)]

Azure Video Analyzer allows you to enhance its processing capabilities through a [pipeline extension](../pipeline-extension.md) node. HTTP extension processor node enables extensibility scenarios using the HTTP extension protocol, where performance and/or optimal resource utilization is not the primary concern. In this article, you will learn about using this protocol to send messages between the Video Analyzer and an HTTP REST endpoint, which would typically be wrapped around an AI inference server.

The HTTP contract is defined between the following two components:

* HTTP server
* Video Analyzer module acts as the HTTP client

## HTTP contract

### Request

Requests from the Video Analyzer module to your HTTP server would be as follows:

|Key|Value|
|---|---|
|POST|https://hostname/optional-path?optional-query|
|Accept|application/json|
|Authorization|	Basic, Digest, Bearer (through custom header support)|
|Content-Type|	image/jpeg<br/>image/png<br/>image/bmp<br/>image/x-raw|
|Content-Length Body length, in bytes	||
|User-Agent	|Azure Media Services|
|Body|	Image bytes, binary encoded in one of the supported content types.|
```

### Example

```html
POST http://localhost:8080/inference HTTP/1.1
Host: localhost:8080
x-ms-client-request-id: d6050cd4-c9f2-42d3-9adc-53ba7e440f17
Content-Type: image/bmp
Content-Length: 519222

(Image Binary Content)
```

### Response

Responses from your inference server to the Video Analyzer module should be as follows:

|Key|	Value|
|---|----|
|Status Codes|	200 OK - Inference results found<br/>204 No Content - No result found by the AI<br/>400 Bad Request - Not expected<br/>500 Internal Server Error - Not expected<br/>503 Server Busy - Video Analyzer will backoff based on "Retry-After" header, or based on a default amount of time if the header is not present.|
|Content-Type	|application/json|
|Content-Length	|Body length, in bytes|
|Body|	JSON object with single "inferences" property.|

### Example

```html
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 468
Server: Microsoft-HTTPAPI/2.0
Date: Fri, 17 Apr 2021 04:44:01 GMT

{
  "inferences": [
    {
      "type": "entity",
      "entity": {
        "tag": { "value": "car", "confidence": 0.9048132 },
        "box": { "l": 0.42681578, "t": 0.47660735, "w": 0.019501392, "h": 0.020954132 }
      }
    },
    {
      "type": "entity",
      "entity": {
        "tag": { "value": "car", "confidence": 0.8953932 },
        "box": { "l": 0.55083525, "t": 0.4843858, "w": 0.046550274, "h": 0.046502113 }
      }
    }    
  ]
}
```

It is recommended that responses are returned using valid JSON documents following the pre-established schema defined as per [the inference metadata schema object model](inference-metadata-schema.md). Conforming to the schema will ensure interoperability with other components in Video Analyzer, such as the ability to track objects in live video, and overlay the inference metadata over video during playback, as demonstrated [here](record-stream-inference-data-with-video.md).

If your module returns a response where the content type is not "application/json", Video Analyzer will encode the message as a base 64 content and serialize it as an opaque JSON payload.

If your module returns a response with content type as "application/json" but the JSON schema doesn’t follow the above inference metadata schema, the message payload will be forwarded through the pipeline, but interoperability will be reduced.

> [!NOTE]
> If your inference server doesn’t produce any result for a given image, it must return HTTP 204 Status Code (No Content) with an empty response body. Video Analyzer will understand this as an empty result and won’t forward the event throughout the pipeline.

## Next steps

[Read about the gRPC extension protocol](grpc-extension-protocol.md)
