---
title: Azure API Management policy reference - publish-to-dapr | Microsoft Docs
description: Reference for the publish-to-dapr policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: article
ms.date: 12/07/2022
ms.author: danlep
---

# Send message to Pub/Sub topic

The `publish-to-dapr` policy instructs API Management gateway to send a message to a Dapr Publish/Subscribe topic. The policy accomplishes that by making an HTTP POST request to `http://localhost:3500/v1.0/publish/{{pubsub-name}}/{{topic}}`, replacing template parameters and adding content specified in the policy statement.

The policy assumes that Dapr runtime is running in a sidecar container in the same pod as the gateway. Dapr runtime implements the Pub/Sub semantics. Learn more about [Dapr integration with API Management](api-management-dapr-policies.md).

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]

## Policy statement

```xml
<publish-to-dapr pubsub-name="pubsub-name" topic="topic-name" ignore-error="false|true" response-variable-name="resp-var-name" timeout="in seconds" template="Liquid" content-type="application/json">
    <!-- message content -->
</publish-to-dapr>
```


## Attributes

| Attribute        | Description                     | Required | Default |
|------------------|---------------------------------|----------|---------|
| pubsub-name      | The name of the target PubSub component. Maps to the [pubsubname](https://github.com/dapr/docs/blob/master/daprdocs/content/en/reference/api/pubsub_api.md) parameter in Dapr. If not present, the `topic` attribute value must be in the form of `pubsub-name/topic-name`. Policy expressions are allowed.   | No       | None    |
| topic            | The name of the topic. Maps to the [topic](https://github.com/dapr/docs/blob/master/daprdocs/content/en/reference/api/pubsub_api.md) parameter in Dapr. Policy expressions are allowed.              | Yes      | N/A     |
| ignore-error     | If set to `true`, instructs the policy not to trigger ["on-error"](api-management-error-handling-policies.md) section upon receiving error from Dapr runtime. Policy expressions aren't allowed. | No | `false` |
| response-variable-name | Name of the [Variables](api-management-policy-expressions.md#ContextVariables) collection entry to use for storing response from Dapr runtime. Policy expressions aren't allowed. | No | None |
| timeout | Time (in seconds) to wait for Dapr runtime to respond. Can range from 1 to 240 seconds. Policy expressions are allowed. | No | 5 |
| template | Templating engine to use for transforming the message content. "Liquid" is the only supported value. | No | None |
| content-type | Type of the message content. "application/json" is the only supported value. | No | None |

## Usage

- [**Policy sections:**](./api-management-howto-policies.md#sections) inbound
- [**Policy scopes:**](./api-management-howto-policies.md#scopes) global, product, API, operation
-  [**Gateways:**](api-management-gateways-overview.md) self-hosted

### Usage notes

Dapr support must be [enabled](api-management-dapr-policies.md#enable-dapr-support-in-the-self-hosted-gateway) in the self-hosted gateway.

## Example

The following example demonstrates sending the body of the current request to the "new" [topic](https://github.com/dapr/docs/blob/master/daprdocs/content/en/reference/api/pubsub_api.md#url-parameters) of the "orders" Pub/Sub [component](https://github.com/dapr/docs/blob/master/daprdocs/content/en/reference/api/pubsub_api.md#url-parameters). Response received from the Dapr runtime is stored in the "dapr-response" entry of the Variables collection in the [context](api-management-policy-expressions.md#ContextVariables) object.

If Dapr runtime can't locate the target topic, for example, and responds with an error, the "on-error" section is triggered. The response received from the Dapr runtime is returned to the caller verbatim. Otherwise, default `200 OK` response is returned.

The "backend" section is empty and the request is not forwarded to the backend.

```xml
<policies>
     <inbound>
        <base />
        <publish-to-dapr
           pubsub-name="orders"
               topic="new"
               response-variable-name="dapr-response">
            @(context.Request.Body.As<string>())
        </publish-to-dapr>
    </inbound>
    <backend>
    </backend>
    <outbound>
        <base />
    </outbound>
    <on-error>
        <base />
        <return-response response-variable-name="pubsub-response" />
    </on-error>
</policies>
```

## Related policies

* [API Management Dapr integration policies](api-management-dapr-policies.md)

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]