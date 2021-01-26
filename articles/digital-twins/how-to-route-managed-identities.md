---
# Mandatory fields.
title: Route events using managed identities
titleSuffix: Azure Digital Twins
description: See how to enable a system-assigned identity for Azure Digital Twins and use it to forward events.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 1/21/2021
ms.topic: how-to
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Route events using managed identities 

This article describes how to enable a system-assigned identity for an Azure Digital Twins instance and use it to forward events to supported destinations such as [Event Hub](../event-hubs/event-hubs-about.md) and [Service Bus](../service-bus-messaging/service-bus-messaging-overview.md) destinations, as well as [Azure Storage Container](../storage/blobs/storage-blobs-introduction.md).

Here are the steps that are covered in detail in this article: 

1. Create an Azure Digital Twins instance with a system-assigned identity or enable system-assigned identity on an existing Azure Digital Twins instance. 
1. Add an appropriate role or roles to the identity. For example, assign the **Azure Event Hub Data Sender** role to the identity if the endpoint is Event Hub, or **Azure Service Bus Data Sender role** if the endpoint is Service Bus.
1. When you create custom endpoints, enable the usage of a system-assigned identity to authenticate to custom endpoints for forwarding events. 

## Enable system-managed identities for an Azure Digital Twins instance 

You can enable system-managed identities for an Azure Digital Twins instance as part of the instance's initial setup, or enable it later on an instance that already exists. 

Either of these creation methods will give the same configuration options and the same end result for your instance This section describes how to do both.

### Add a system-managed identity during instance creation

In this section, you'll learn how to enable a system-managed identity on an Azure Digital Twins instance that is currently being created. This section focuses on the managed identity step of the creation process; for a complete walkthrough of creating a new Azure Digital Twins instance, see [*How-to: Set up an instance and authentication*](how-to-set-up-instance-portal.md).

The system-managed identity option is located in the **Advanced** tab of instance setup.

In this tab, select the **On** option for **System managed identity** to turn on this feature.

:::image type="content" source="media/how-to-route-managed-identities/create-instance-advanced.png" alt-text="Screenshot of the Azure portal showing the Advanced tab of the Create Resource dialog for Azure Digital Twins. There's a highlight around the tab name, the On option for System managed identity, and the navigation buttons (Review + create, Previous, Next: Advanced).":::

You can then use the bottom navigation buttons to continue with the rest of instance setup.

### Add a system-managed identity to an existing instance

In this section, you'll use the [Azure portal](https://portal.azure.com) to add a system-managed identity to an Azure Digital Twins instance that already exists.

1. First, navigate to the [Azure portal](https://portal.azure.com) in a browser.

1. Search for the name of your instance in the portal search bar, and select it to view its details.

1. Select **Identity (preview)** in the left-hand menu.

1. On this page, select the **On** option to turn on this feature.

1. Hit the **Save** button, and **Yes** to confirm.

    :::image type="content" source="media/how-to-route-managed-identities/identity-digital-twins.png" alt-text="Screenshot of the Azure portal showing the the Identity (preview) page for an Azure Digital Twins instance. There's a highlight around the page name in the Azure Digital Twins instance menu, the On option for Status, the Save button, and the Yes confirmation button.":::

After the change is saved, additional fields will appear on this page for the new identity's **Object ID** and **Permissions**.

You can copy the object ID from here if needed, and use the Permissions button to view the Azure roles that are assigned to the identity. To set up some roles, continue to the next section.

## Assign Azure roles to the identity 

This section describes how to assign Azure role(s) to the system-assigned identity. This will allow it to authenticate to [custom endpoints](concepts-route-events.md) in your Azure Digital Twins instance for forwarding events.

### Supported destinations and Azure roles 

After you enable system-assigned identity on your Azure Digital Twins instance, Azure automatically creates an identity in Azure Active Directory. Assign to this identity appropriate Azure roles so that the Azure Digital Twins instance can forward events to supported destinations. For example, assign the Azure Event Hub Data Sender role to the identity if the endpoint is Event Hub. 

This table also gives you the roles that the identity should be in so that the Azure Digital Twin instance can forward the events. 

| Destination | Azure role |
| --- | --- |
| Azure Event Hubs | Azure Event Hub Data Sender |
| Service Bus | Azure Service Bus Data Sender |
| Azure Storage Container | *to-do* |


### Assign the role

...

## Next steps

Read about the different types of event messages you can receive:
* [*How-to: Interpret event data*](how-to-interpret-event-data.md)
