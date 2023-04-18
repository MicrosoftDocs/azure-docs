---
title: Get schema supported by an Azure Event Grid topic
description: This article describes how to get the type of schema (Event Grid event schema, cloud event schema, or custom input schema) supported by an Azure Event Grid topic. 
ms.topic: how-to
ms.date: 07/14/2022 
---

# Get the type of schema supported by an Azure Event Grid topic
This article describes how to get the type of schema (Event Grid event schema, cloud event schema, or custom input schema) supported by an Azure Event Grid topic. 


[!INCLUDE [Get topic's endpoint and access key](./includes/get-topic-endpoint-access-key.md)]
 
## Get the schema type
Here's a sample Curl command that sends an **HTTP OPTIONS** message to the topic. The response would contain the header property `aeg-input-event-schema` that gives you the schema type supported by the topic.

```bash
curl -X OPTIONS "<TOPIC ENDPOINT>" -H "aeg-sas-key: <ACCESS KEY>"
```

Here's the sample header output from the command:

```bash
Allow: POST,OPTIONS
Content-Length: 0
Server: Microsoft-HTTPAPI/2.0
Strict-Transport-Security: max-age=31536000; includeSubDomains
api-supported-versions: 2018-01-01
x-ms-request-id: 2dd9ca30-c2d9-4c08-b9e1-d29c5ebd9802
aeg-input-event-schema: EventGridEvent
Date: Wed, 13 Jul 2022 20:04:06 GMT
```

The value of the `aeg-input-event-schema` header property gives you the type of the schema supported by the topic. In this example, it's the Event Grid event schema. The value for this property is set to one of these values: `EventGridEvent`, `CustomInputEvent`, `CloudEventV10`.


## Next steps
For information about schemas, see the following articles:

- [Event Grid event schema](event-schema.md) 
- [Cloud event schema](cloud-event-schema.md) 
- [Custom input schema](input-mappings.md)