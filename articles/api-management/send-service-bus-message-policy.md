---
title: Azure API Management Policy Reference - send-service-bus-message
description: Reference for the send-service-bus-message policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management

ms.service: azure-api-management
ms.topic: reference
ms.date: 08/25/2026
---

# Send service bus message

[!INCLUDE [api-management-availability-premium-dev-standard-basic](../../includes/api-management-availability-premium-dev-standard-basic.md)]

The `send-service-bus-message` policy sends a message to an Azure Service Bus queue or topic. You can optionally forward the API request to the backend service.

> [!NOTE]
> * For background and prerequisites to send messages to Azure Service Bus, see [How to send messages to Azure Service Bus from Azure API Management](api-management-howto-send-service-bus.md).

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]


## Policy statement

```xml
<send-service-bus-message 
    queue-name="service bus queue"
    topic-name="service bus topic"
    namespace="FQDN of service bus namespace"
    client-id="ID of user-assigned managed identity"
    message-id="message ID"
    session-id="session ID"
    time-to-live="message time to live"
    response-variable-name="context variable name"
    ignore-error="false">
        <message-properties>
                <message-property name="property-name">property-value</message-property>
                <!-- if there are multiple properties, then add additional message-property elements -->
        </message-properties>
        <payload>"message content"</payload>
</send-service-bus-message>
```

## Attributes


| Attribute     | Description                                                               | Required                                                             | Default |
| ------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------- | ----|
| `queue-name` | Specifies the name of the service bus queue to send the message to. Policy expressions and named values are allowed. Either `queue-name` or `topic-name` must be specified. | No | N/A |
| `topic-name` | Specifies the name of the service bus topic to send the message to. Policy expressions and named values are allowed. Either `queue-name` or `topic-name` must be specified. | No | N/A |
| `namespace` | Specifies the fully qualified domain name of the service bus namespace. Policy expressions and named values are allowed. | No | N/A |
| `client-id` | Specifies the client ID of the user-assigned managed identity to authenticate with service bus. The identity must be assigned the Azure Service Bus Data Sender role. Policy expressions and named values are allowed. If you don't specify this attribute, the system-assigned identity is used. | No | N/A |
| `message-id` | Message identifier. Must be a valid GUID. Policy expressions are allowed. If omitted, API Management generates a GUID. | No | Generated GUID |
| `session-id` | Service Bus session identifier used to group related messages. Must be a valid GUID. Policy expressions are allowed. | No | N/A |
| `time-to-live` | How long the message remains available for processing before it expires. Use a TimeSpan value, for example `00:10:00`. | No | N/A |
| `response-variable-name` | Name of a context variable that receives information about the Service Bus send operation. | No | N/A |
| `ignore-error` | Whether a Service Bus send failure should allow policy execution to continue. `true` = continue; `false` = invoke normal error handling. | No | `false` |

> [!NOTE]
> When you specify `response-variable-name`, API Management stores information about the Service Bus send operation in that context variable. On success, it contains `MessageId`, `SessionId`, and `TimeToLive`. On an ignored send failure, it contains `Error.Reason` and `Error.Message`.

## Elements

| Element     | Description                                                               | Required                                                             | 
| ------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------- | 
| `payload` | Specifies the message payload to send to the service bus. Policy expressions and named values are allowed. | Yes |
| `message-properties` | A collection of `message-property` subelements that specify metadata to pass with the message payload. Each `message-property` consists of a name-value pair. Policy expressions and named values are allowed. | No |


## Usage

- [**Policy sections:**](./api-management-howto-policies.md#understanding-policy-configuration) inbound, outbound, on-error
- [**Policy scopes:**](./api-management-howto-policies.md#scopes) global, product, API, operation
- [**Gateways:**](api-management-gateways-overview.md) classic

### Usage notes

* You must pre-create the Azure Service Bus queue or topic that receives a message.
* You can use this policy multiple times per policy definition.
* If you omit `message-id`, API Management generates a GUID.
* Configured `message-id` and `session-id` values must be valid GUIDs.
* Use `session-id` when the Service Bus entity requires sessions.
* `time-to-live` uses a `TimeSpan` value such as `00:10:00`.
* `ignore-error` applies to send failures. Invalid message configuration, such as an invalid GUID or TTL, still causes policy failure.


## Examples

### Send a message to a service bus queue    

In this example, a message consisting of the request body is sent to the orders queue. The request ID becomes the message ID, the message expires after 10 minutes, and send information is stored in `serviceBusResult`. A send failure invokes API Management error handling. The API Management instance uses a user-assigned identity for access. The request is then forwarded to the backend service. 

```xml
<policies>
    <inbound>
        <send-service-bus-message 
          queue-name="orders"
          namespace="contoso-messaging.servicebus.windows.net"
          message-id="@(context.RequestId.ToString())"
          time-to-live="00:10:00"
          response-variable-name="serviceBusResult"
          ignore-error="false">
          <payload>
            @(context.Request.Body.As<string>(preserveContent: true))
          </payload>
        </send-service-bus-message>
    </inbound>
    <backend>
        <forward-request timeout="60"/>
    </backend>
</policies>
```    


### Send a message to a service bus topic

In this example, you send a message that contains the request body to a service bus topic. The API Management instance uses a system-assigned identity for access. Then, you forward the request to the backend service.

```xml
<policies>
    <inbound>
        <send-service-bus-message topic-name="orders" namespace="my-service-bus.servicebus.windows.net">
           <payload>@(context.Request.Body.As<string>(preserveContent: true))</payload>
        </send-service-bus-message>
    </inbound>
    <backend>
        <forward-request timeout="60"/>
    </backend>
</policies>
```


### Send a message and metadata

In this example, you send a message that contains the request body to a service bus topic and set a message property to send metadata with the payload. The API Management instance uses a system-assigned identity for access. Then, you forward the request to the backend service.

```xml
<policies>
    <inbound>
        <send-service-bus-message topic-name="orders" namespace="my-service-bus.servicebus.windows.net">
           <message-properties>
              <message-property name="Customer">Contoso</message-property>
           </message-properties>
           <payload>@(context.Request.Body.As<string>(preserveContent: true))</payload>
        </send-service-bus-message>
    </inbound>
    <backend>
        <forward-request timeout="60"/>
    </backend>
</policies>
```

### Send message and return immediately

In this example, you send a message that contains the request body to a service bus topic. The API Management instance uses a system-assigned identity for access. Then, you return a `201` response status code immediately to the caller.

```xml
<policies>
    <inbound>
        <send-service-bus-message topic-name="orders" namespace="my-service-bus.servicebus.windows.net">
           <payload>@(context.Request.Body.As<string>(preserveContent: true))</payload>
        </send-service-bus-message>
        <return-response>
            <set-status code="201" reason="Created!" />
        </return-response>
    </inbound>
</policies>
```

## Related policies

* [Integration and external communication](api-management-policies.md#integration-and-external-communication)

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]
