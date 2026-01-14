---
title: How to Send Messages to Azure Service Bus
description: Learn how to send messages to Azure Service Bus in Azure API Management. Service Bus is a messaging service that allows you to decouple applications and services.
services: api-management
author: dlepow

ms.service: azure-api-management
ms.topic: how-to
ms.date: 09/30/2025
ms.author: danlep
ms.custom:
# customer intent: As API service owner I want to send messages to Service Bus so that I can decouple my applications and services.
---
# How to send messages to Azure Service Bus from Azure API Management

[!INCLUDE [api-management-availability-premium-dev-standard-basic](../../includes/api-management-availability-premium-dev-standard-basic.md)]

This article describes how to send messages from API Management to Azure Service Bus by using policy-based integration. Use API Management to provide a secure and scalable way to send messages to Service Bus.

:::image type="content" source="media/api-management-howto-send-service-bus/scenario.png" alt-text="Diagram of integration of API Management with Service Bus for messaging.":::

[Azure Service Bus](/azure/service-bus-messaging/service-bus-messaging-overview) is a fully managed enterprise messaging service designed to decouple applications and services, enabling reliable cloud messaging between distributed systems. It supports AMQP (Advanced Message Queuing Protocol) for systems to send messages to *message queues* for one-to-one communication and *topics* for publish/subscribe patterns. Service Bus is ideal for scenarios requiring asynchronous operations, load leveling, or integration across hybrid cloud environments. For more information, see the [Azure Service Bus documentation](/azure/service-bus-messaging/).

With policy-based integration, API Management provides:

* **Secure REST-based messaging for external clients** - External systems and mobile apps that lack native AMQP support can send messages to Service Bus by using standard HTTP/REST APIs via API Management. This approach simplifies integration and enhances security by eliminating the need for custom intermediaries.
* **Governed third-party integrations** - Enterprises can expose Service Bus endpoints through API Management with built-in managed identity authentication, enabling secure and observable messaging patterns for partners and third-party applications.
* **Fire and forget model** - No other backend services are required to send messages to Service Bus, allowing for simpler architectures and reduced operational overhead.

> [!NOTE]
> * Integration of API Management with Service Bus is currently in preview.
> * Only sending messages to Service Bus is supported.

[!INCLUDE [api-management-workspace-availability](../../includes/api-management-workspace-availability.md)]

## Prerequisites

* An API Management service instance. If you don't have one, see [Create an API Management service instance](get-started-create-service-instance.md).
* An API Management API used to send messages to Service Bus.
* A queue or topic in an Azure Service Bus namespace to receive messages. For detailed steps, see one of the following:
    * [Create a Service Bus namespace and queue](/azure/service-bus-messaging/service-bus-quickstart-portal)
    * [Create a Service Bus topic and subscriptions to the topic](/azure/service-bus-messaging/service-bus-quickstart-topics-subscriptions-portal)
    
    > [!NOTE]
    > * If you want to use topics and subscriptions, choose the Service Bus Standard or Premium tier.
    > * The Service Bus resource **can be** in a different subscription or even a different tenant than the API Management resource.

* Permissions to assign roles to a managed identity.

## Configure access to the service bus

To send messages to the service bus, you need to configure a managed identity for your API Management instance:

1. Enable a system-assigned or user-assigned [managed identity for API Management](api-management-howto-use-managed-service-identity.md) in your API Management instance.

    * If you enable a user-assigned managed identity, take note of the identity's **Client ID**.

1. Assign the identity the **Azure Service Bus Data Sender** role, scoped to the service bus. To assign the role, use the [Azure portal](/azure/role-based-access-control/role-assignments-portal) or other Azure tools.

## Configure send-service-bus-message policy

Configure the [send-service-bus-message](send-service-bus-message-policy.md) policy to send messages to the desired queue or topic. 

For example, use the `send-service-bus-message` policy in the inbound policy section to send the request body of an API request when the gateway receives it:

1. In the [Azure portal](https://portal.azure.com), go to your API Management instance.
1. In the left-hand menu, select **APIs**, then select the API where you want to add the policy.
1. Select **All operations**.
1. At the top of the screen, select the **Design** tab.
1. In the **Inbound processing** or **Outbound processing** window, select the `</>` (code editor) icon. For more information, see [How to set or edit policies](set-edit-policies.md).
1. Position your cursor in the `inbound` or `outbound` policy section.
1. Add the `send-service-bus-message` policy to the policy configuration, then configure the attributes and elements as needed. 

    For example, send the request body as a message:

    ```xml
    <send-service-bus-message queue-name="my-queue">
        <payload>@(context.Request.Body.As<string>())</payload>
    </send-service-bus-message>
    ```

      You can use any expression that returns a string as the value for the `payload` element.

1. Select **Save** to save the updated policy configuration. As soon as you save it, the policy is active and messages are sent to the designated service bus.



## Related content

* [Using external services](api-management-sample-send-request.md)
* [send-service-bus-message policy](send-service-bus-message-policy.md)
