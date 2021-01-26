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

This article describes how to enable a [system-assigned identity for an Azure Digital Twins instance](concepts-security.md#managed-identity-for-accessing-other-resources) and use it to forward events to supported destinations such as [Event Hub](../event-hubs/event-hubs-about.md) and [Service Bus](../service-bus-messaging/service-bus-messaging-overview.md) destinations, as well as [Azure Storage Container](../storage/blobs/storage-blobs-introduction.md).

Here are the steps that are covered in this article: 

1. Create an Azure Digital Twins instance with a system-assigned identity or enable system-assigned identity on an existing Azure Digital Twins instance. 
1. Add an appropriate role or roles to the identity. For example, assign the **Azure Event Hub Data Sender** role to the identity if the endpoint is Event Hub, or **Azure Service Bus Data Sender role** if the endpoint is Service Bus.

Later, when you create endpoints in Azure Digital Twins, you can enable the usage of system-assigned identities to authenticate to the endpoints for forwarding events.

## Enable system-managed identities for an Azure Digital Twins instance 

When you enable a system-assigned identity on your Azure Digital Twins instance, Azure automatically creates an identity for it in [Azure Active Directory (Azure AD)](../active-directory/fundamentals/active-directory-whatis.md). That identity can then be used to authenticate to Azure Digital Twins endpoints for event forwarding.

You can enable system-managed identities for an Azure Digital Twins instance as part of the instance's initial setup, or enable it later on an instance that already exists.

Either of these creation methods will give the same configuration options and the same end result for your instance. This section describes how to do both.

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

Once a system-assigned identity is created for your Azure Digital Twins instance, you'll need to assign it appropriate roles to authenticate with different types of [endpoints](concepts-route-events.md) for forwarding events to supported destinations. This section describes the role options and how to assign them to the system-assigned identity.

### Supported destinations and Azure roles 

Here are the roles that should be assigned to an identity depending on the event destination. For more about endpoints, routes, and the types of destinations supported for routing in Azure Digital Twins, see [*Concepts: Event routes*](concepts-route-events.md).

| Destination | Azure role |
| --- | --- |
| Azure Event Hubs | Azure Event Hub Data Sender |
| Service Bus | Azure Service Bus Data Sender |
| Azure Storage Container | Storage Blob Data Contributor |

### Assign the role

>[!NOTE]
> This section must be completed by an Azure user with permissions to manage user access to Azure resources (including granting and delegating permissions). Common roles that meet this requirement are *Owner*, *Account admin*, or the combination of *User Access Administrator* and *Contributor*. For more details about permission requirements for Azure Digital Twins roles, see [*How-to: Set up instance and authentication*](how-to-set-up-instance-portal.md#prerequisites-permission-requirements).

To assign a role to the identity, open the [Azure portal](https://portal.azure.com) and navigate to your Azure Digital Twins instance.

1. Select **Access control (IAM)** in the left-hand menu.
1. Select the **+ Add** button to add a new role assignment.

    :::image type="content" source="media/how-to-route-managed-identities/add-role-assignment-1.png" alt-text="Screenshot of the Azure portal showing the Access control (IAM) page for an Azure Digital Twins instance. The + Add button is highlighted.":::

1. On the following **Add role assignment** page, fill in the values:
    * **Role**: Select the desired role from the dropdown menu
    * **Assign access to**: Choose **User, group or service principal**
    * **Select**: Search for the name of this Azure Digital Twins instance. When you select the result, the instance will show up in a **Selected members** section.

    :::row:::
        :::column:::
            :::image type="content" source="media/how-to-route-managed-identities/add-role-assignment-2.png" alt-text="Filling the listed fields into the 'Add role assignment' dialog":::
        :::column-end:::
        :::column:::
        :::column-end:::
    :::row-end:::

When you're finished entering the details, select **Save**.

## Next steps

Learn more about managed identities in Azure AD: [*Managed identities for Azure resources*](../active-directory/managed-identities-azure-resources/overview.md)