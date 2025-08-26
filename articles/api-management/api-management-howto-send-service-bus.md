---
title: How to log events to Azure Event Hubs in Azure API Management | Microsoft Docs
description: Learn how to log events to Azure Event Hubs in Azure API Management. Event Hubs is a highly scalable data ingress service.
services: api-management
author: dlepow

ms.service: azure-api-management
ms.topic: how-to
ms.date: 09/04/2024
ms.author: danlep
ms.custom:
  - build-2025
---
# How to log events to Azure Event Hubs in Azure API Management

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

This article describes how to send messages from API Management to Azure Service Bus.

[Example scenarios]
[!INCLUDE [api-management-workspace-availability](../../includes/api-management-workspace-availability.md)]

## Prerequisites

* An API Management service instance. If you don't have one, see [Create an API Management service instance](get-started-create-service-instance.md).
* An Azure Service Bus. For detailed steps, see []. If you plan to send messages to a queue, you must create the queue in advance.
    > [!NOTE]
    > The Event Hubs resource **can be** in a different subscription or even a different tenant than the API Management resource

## Configure access to the service bus

To log events to the service bus, you need to configure credentials for access from API Management. API Management supports a managed identity for your API Management instance (recommended)

1. Enable a system-assigned or user-assigned [managed identity for API Management](api-management-howto-use-managed-service-identity.md) in your API Management instance.

    * If you enable a user-assigned managed identity, take note of the identity's **Client ID**.

1. Assign the identity the **Azure Service Bus Data Sender** role, scoped to the service bus. To assign the role, use the [Azure portal](../role-based-access-control/role-assignments-portal.yml) or other Azure tools.



## Configure send-service-bus-message policy

Configure the [send-service-bus-message](send-service-bus-message-policy.md) policy to send the messages to the desired queue or topic. For example, use the `send-service-bus-message` policy in the inbound policy section to send messages when a request is received by the gateway

1. Browse to your API Management instance.
1. Select **APIs**, and then select the API to which you want to add the policy. In this example, we're adding a policy to the **Echo API** in the **Unlimited** product.
1. Select **All operations**.
1. On the top of the screen, select the **Design** tab.
1. In the Inbound processing or Outbound processing window, select the `</>` (code editor) icon. For more information, see [How to set or edit policies](set-edit-policies.md).
1. Position your cursor in the `inbound` or `outbound` policy section.
1. In the window on the right, select **Advanced policies** > **Log to EventHub**. This inserts the `log-to-eventhub` policy statement template.

    ```xml

    ```

 
      You can use any expression that returns a string as the value for the `payload` element. In this example, ..

1. Select **Save** to save the updated policy configuration. As soon as it's saved, the policy is active and message are sent to the designated service bus.



## Related content
* 
