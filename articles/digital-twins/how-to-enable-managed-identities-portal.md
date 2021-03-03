---
# Mandatory fields.
title: Enable a managed identity for routing events (preview) - portal
titleSuffix: Azure Digital Twins
description: See how to enable a system-assigned identity for Azure Digital Twins and use it to forward events, using the Azure portal.
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

# Enable a managed identity for routing Azure Digital Twins events (preview): Azure portal

[!INCLUDE [digital-twins-managed-service-identity-selector.md](../../includes/digital-twins-managed-service-identity-selector.md)]

This article describes how to enable a [system-assigned identity for an Azure Digital Twins instance](concepts-security.md#managed-identity-for-accessing-other-resources-preview) (currently in preview), and use the identity when forwarding events to supported destinations such as [Event Hub](../event-hubs/event-hubs-about.md), [Service Bus](../service-bus-messaging/service-bus-messaging-overview.md) destinations, and [Azure Storage Container](../storage/blobs/storage-blobs-introduction.md).

This article walks through the process using the [**Azure portal**](https://portal.azure.com).

Here are the steps that are covered in this article: 

1. Create an Azure Digital Twins instance with a system-assigned identity or enable system-assigned identity on an existing Azure Digital Twins instance. 
1. Add an appropriate role or roles to the identity. For example, assign the **Azure Event Hub Data Sender** role to the identity if the endpoint is Event Hub, or **Azure Service Bus Data Sender role** if the endpoint is Service Bus.
1. Create an endpoint in Azure Digital Twins that is able to use system-assigned identities for authentication.

## Enable system-managed identities for an instance 

When you enable a system-assigned identity on your Azure Digital Twins instance, Azure automatically creates an identity for it in [Azure Active Directory (Azure AD)](../active-directory/fundamentals/active-directory-whatis.md). That identity can then be used to authenticate to Azure Digital Twins endpoints for event forwarding.

You can enable system-managed identities for an Azure Digital Twins instance **as part of the instance's initial setup**, or **enable it later on an instance that already exists**.

Either of these creation methods will give the same configuration options and the same end result for your instance. This section describes how to do both.

### Add a system-managed identity during instance creation

In this section, you'll learn how to enable a system-managed identity on an Azure Digital Twins instance that is currently being created. This section focuses on the managed identity step of the creation process; for a complete walkthrough of creating a new Azure Digital Twins instance, see [*How-to: Set up an instance and authentication*](how-to-set-up-instance-portal.md).

The system-managed identity option is located in the **Advanced** tab of instance setup.

In this tab, select the **On** option for **System managed identity** to turn on this feature.

:::image type="content" source="media/how-to-enable-managed-identities/create-instance-advanced.png" alt-text="Screenshot of the Azure portal showing the Advanced tab of the Create Resource dialog for Azure Digital Twins. There's a highlight around the tab name, the On option for System managed identity, and the navigation buttons (Review + create, Previous, Next: Advanced).":::

You can then use the bottom navigation buttons to continue with the rest of instance setup.

### Add a system-managed identity to an existing instance

In this section, you'll add a system-managed identity to an Azure Digital Twins instance that already exists.

1. First, navigate to the [Azure portal](https://portal.azure.com) in a browser.

1. Search for the name of your instance in the portal search bar, and select it to view its details.

1. Select **Identity (preview)** in the left-hand menu.

1. On this page, select the **On** option to turn on this feature.

1. Hit the **Save** button, and **Yes** to confirm.

    :::image type="content" source="media/how-to-enable-managed-identities/identity-digital-twins.png" alt-text="Screenshot of the Azure portal showing the Identity (preview) page for an Azure Digital Twins instance. There's a highlight around the page name in the Azure Digital Twins instance menu, the On option for Status, the Save button, and the Yes confirmation button.":::

After the change is saved, more fields will appear on this page for the new identity's **Object ID** and **Permissions**.

You can copy the **Object ID** from here if needed, and use the **Permissions** button to view the Azure roles that are assigned to the identity. To set up some roles, continue to the next section.

## Assign Azure roles to the identity 

Once a system-assigned identity is created for your Azure Digital Twins instance, you'll need to assign it appropriate roles to authenticate with different types of [endpoints](concepts-route-events.md) for forwarding events to supported destinations. This section describes the role options and how to assign them to the system-assigned identity.

>[!NOTE]
> This is an important step—without it, the identity won't be able to access your endpoints and events won't be delivered.

### Supported destinations and Azure roles 

Here are the minimum roles that an identity needs to access an endpoint, depending on the type of destination. Roles with higher permissions (like Data Owner roles) will also work.

| Destination | Azure role |
| --- | --- |
| Azure Event Hubs | Azure Event Hubs Data Sender |
| Azure Service Bus | Azure Service Bus Data Sender |
| Azure storage container | Storage Blob Data Contributor |

For more about endpoints, routes, and the types of destinations supported for routing in Azure Digital Twins, see [*Concepts: Event routes*](concepts-route-events.md).

### Assign the role

[!INCLUDE [digital-twins-permissions-required.md](../../includes/digital-twins-permissions-required.md)]

To assign a role to the identity, start by opening the [Azure portal](https://portal.azure.com).

1. Navigate to your endpoint resource (your event hub, Service Bus topic, or storage container) by searching for its name in the portal search bar. 
1. Select **Access control (IAM)** in the left-hand menu.
1. Select the **+ Add** button to add a new role assignment.

    :::image type="content" source="media/how-to-enable-managed-identities/add-role-assignment-1.png" alt-text="Screenshot of the Azure portal showing the Access control (IAM) page for an event hub. The + Add button is highlighted." lightbox="media/how-to-enable-managed-identities/add-role-assignment-1.png":::

1. On the following **Add role assignment** page, fill in the values:
    * **Role**: Select the desired role from the dropdown menu.
    * **Assign access to**: Under **System assigned managed identity**, select **Digital Twins**.
    * **Subscription**: Select your subscription. This will display all the Azure Digital Twins managed identities within the selected subscription.
    * **Select**: Here, you'll select the managed identity of your Azure Digital Twins instance that's being assigned the role. The name of the managed identity matches the name of the instance, so choose the name of your Azure Digital Twins instance. When you select it, the identity for the instance will show up in the **Selected members** section at the bottom of the pane.

    :::row:::
        :::column:::
            :::image type="content" source="media/how-to-enable-managed-identities/add-role-assignment-2.png" alt-text="Filling the listed fields into the 'Add role assignment' dialog":::
        :::column-end:::
        :::column:::
        :::column-end:::
    :::row-end:::

When you're finished entering the details, select **Save**.

## Create an endpoint with identity-based authentication

After setting up a system-managed identity for your Azure Digital Twins instance and assigning it the appropriate role(s), you can create Azure Digital Twins [endpoints](how-to-manage-routes-portal.md#create-an-endpoint-for-azure-digital-twins) that are capable of using the identity for authentication. This option is only available for Event Hub and Service Bus-type endpoints (it's not supported for Event Grid).

>[!NOTE]
> You cannot edit an endpoint that has already been created with key-based identity to change to identity-based authentication. You must choose the authentication type when the endpoint is first created.

Follow the [instructions to create an Azure Digital Twins endpoint](how-to-manage-routes-portal.md#create-an-endpoint-for-azure-digital-twins).

When you get to the step of completing the details required for your endpoint type, make sure to select **Identity-based** for the Authentication type.

:::row:::
    :::column:::
        :::image type="content" source="media/how-to-manage-routes-portal/create-endpoint-event-hub-authentication.png" alt-text="Screenshot of creating an endpoint of type Event Hub." lightbox="media/how-to-manage-routes-portal/create-endpoint-event-hub-authentication.png":::
    :::column-end:::
    :::column:::
    :::column-end:::
:::row-end:::

Finish setting up your endpoint and select **Save**.

## Considerations for disabling system-managed identities

Because an identity is managed separately from the endpoints that use it, it's important to consider the effects that any changes to the identity or its roles can have on the endpoints in your Azure Digital Twins instance. If the identity is disabled, or a necessary role for an endpoint is removed from it, the endpoint can become inaccessible and the flow of events will be disrupted.

To continue using an endpoint that was set up with a managed identity that's now been disabled, you'll need to delete the endpoint and [re-create it](how-to-manage-routes-portal.md#create-an-endpoint-for-azure-digital-twins) with a different authentication type. It may take up to an hour for events to resume delivery to the endpoint after this change.

## Next steps

Learn more about managed identities in Azure AD: 
* [*Managed identities for Azure resources*](../active-directory/managed-identities-azure-resources/overview.md)