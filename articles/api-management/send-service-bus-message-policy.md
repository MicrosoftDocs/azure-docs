---
title: Azure API Management Policy Reference - send-service-bus-message | Microsoft Docs
description: Reference for the send-service-bus-message policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: azure-api-management
ms.topic: reference
ms.date: 09/30/2025
ms.author: danlep
---

# Send service bus message

[!INCLUDE [api-management-availability-premium-dev-standard-basic](../../includes/api-management-availability-premium-dev-standard-basic.md)]

The `send-service-bus-message` policy sends a message to an Azure Service Bus queue or topic. The API request can optionally be forwarded to the backend service.

> [!NOTE]
> * This policy is currently in preview.
> * For background and prerequisites to send messages to Azure Service Bus, see [How to send messages to Azure Service Bus from Azure API Management](api-management-howto-send-service-bus.md).

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]


## Policy statement

```xml
<send-service-bus-message queue-name="service bus queue" topic-name="service bus topic"
      namespace="FQDN of service bus namespace" client-id="ID of user-assigned managed identity">
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
| `client-id` | Specifies the client ID of the user-assigned managed identity to authenticate with service bus. The identity must be assigned the Azure Service Bus Data Sender role. Policy expressions and named values are allowed. If not specified, the system-assigned identity is used. | No | N/A |


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
* This policy can be used multiple times per policy definition.

## Examples

### Send a message to a service bus queue    

In this example, a message consisting of the request body is sent to a service bus queue. The API Management instance uses a user-assigned identity for access. The request is then forwarded to the backend service. 

```xml
<policies>
    <inbound>
        <send-service-bus-message queue-name="orders" client-id="00001111-aaaa-2222-bbbb-3333cccc4444" namespace="my-service-bus.servicebus.windows.net">
           <payload>@(context.Request.Body.As<string>(preserveContent: true))</payload>
        </send-service-bus-message>
    </inbound>
    <backend>
        <forward-request timeout="60"/>
    </backend>
</policies>
```    


### Send a message to a service bus topic

In this example, a message consisting of the request body is sent to a service bus topic. The API Management instance uses a system-assigned identity for access. The request is then forwarded to the backend service.

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

In this example, a message consisting of the request body is sent to a service bus topic and a message property is set to send metadata with the payload. The API Management instance uses a system-assigned identity for access. The request is then forwarded to the backend service.

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

In this example, a message consisting of the request body is sent to a service bus topic. The API Management instance uses a system-assigned identity for access. A `201` response status code is then returned immediately to the caller.

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
