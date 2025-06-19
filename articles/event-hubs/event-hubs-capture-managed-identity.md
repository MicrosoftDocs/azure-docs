---
title: Use managed Identities to capture events
description: This article explains how to use managed identities to capture events to a destination such as Azure Blob Storage and Azure Data Lake Storage. 
ms.topic: concept-article
ms.date: 01/29/2025
# Customer intent: I want to learn whether and how I can use managed identity of a namespace to capture events to an Azure Storage or Data Lake Store. 
---


# Authenticate modes for capturing events to destinations in Azure Event Hubs

Azure Event Hubs allows you to select different authentication modes when capturing events to a destination such as [Azure Blob storage](https://azure.microsoft.com/services/storage/blobs/) or [Azure Data Lake Storage Gen 1 or Gen 2](https://azure.microsoft.com/services/data-lake-store/) account of your choice. The authentication mode determines how the capture agent running in Event Hubs authenticate with the capture destination. 

## Prerequisites

1. Enable system-assigned or user-assigned managed identity by following instructions from the article: [Enable a managed identity for an Event Hubs namespace](enable-managed-identity.md). After you enable an identity for a namespace, you can use the identity when configuring the Capture feature for an event hub in the namespace.  
1. On the target Azure Storage or Data Lake Store account, use the **Access control** page, and add this managed identity to the **Storage Blob Data Contributor** role. 

## Use managed identity to capture events

[Managed identity](../active-directory/managed-identities-azure-resources/overview.md) is the preferred way to seamlessly access the capture destination from your event hub, using Microsoft Entra ID based authentication and authorization.

:::image type="content" source="./media/event-hubs-capture-overview/event-hubs-capture-msi.png" alt-text="Image showing capturing of Event Hubs data into Azure Storage or Azure Data Lake Storage using Managed Identity":::

You can use system-assigned or user-assigned managed identities with Event Hubs Capture destinations.

## Use a system-assigned managed identity
System-assigned Managed Identity is automatically created and associated with an Azure resource, which is an Event Hubs namespace in this case. 

To use system assigned identity, the capture destination must have the required role assignment enabled for the corresponding system assigned identity. 
Then you can select `System Assigned` managed identity option when enabling the capture feature in an event hub.

:::image type="content" source="./media/event-hubs-capture-overview/event-hubs-captute-system-assigned.png" alt-text="Image showing capturing of Event Hubs data into Azure Storage or Azure Data Lake Storage using System Assigned managed identity.":::

Then capture agent would use the identity of the namespace for authentication and authorization with the capture destination. 

### Use a user-assigned managed identity
You can create a user-assigned managed identity and use it for authenticate and authorize with the capture destination of Event hubs. Once the managed identity is created, you can assign it to the Event Hubs namespace and make sure that the capture destination has the required role assignment enabled for the corresponding user assigned identity. 

Then you can select `User Assigned` managed identity option when enabling the capture feature in an event hub and assign the required user assigned identity when enabling the capture feature. 


:::image type="content" source="./media/event-hubs-capture-overview/event-hubs-capture-user-assigned.png" alt-text="Image showing capturing of Event Hubs data into Azure Storage or Azure Data Lake Storage." lightbox="./media/event-hubs-capture-overview/event-hubs-capture-user-assigned.png":::

 Then capture agent would use the configured user assigned identity for authentication and authorization with the capture destination. 


#### Capturing events to a capture destination in a different subscription 
The Event Hubs Capture feature also support capturing data to a capture destination in a different subscription with the use of managed identity.

> [!IMPORTANT]
> To enable capture with a storage account in a different subscription, the **Microsoft.EventHub Resource Provider must be registered for the subscription** which owns the storage account.
>
> To learn more about registering a Resource Provider with a specific Azure Subscription, refer to the [documentation](../azure-resource-manager/management/resource-providers-and-types.md#register-resource-provider).
>

You may use the portal or use the ARM templates in [guide](./event-hubs-resource-manager-namespace-event-hub-enable-capture.md) with corresponding managed identity.

## Related content

Learn more about the feature and how to enable it using the Azure portal and Azure Resource Manager template:

- [Capture events through Azure Event Hubs in Azure Blob Storage or Azure Data Lake Storage](event-hubs-capture-overview.md)
- [Use the Azure portal to enable Event Hubs Capture](event-hubs-capture-enable-through-portal.md)
- [Use an Azure Resource Manager template to enable Event Hubs Capture](event-hubs-resource-manager-namespace-event-hub-enable-capture.md)
