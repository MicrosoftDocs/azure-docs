---
title: Enable managed identity on Azure Event Grid system topic
description: This article describes how enable managed service identity for an Azure Event Grid system topic. 
ms.topic: how-to
ms.date: 03/25/2021
---

# Assign a system-managed identity to an Event Grid system topic
In this article, you learn how to enable system-managed identity for an existing Event Grid system topic. To learn about managed identities, see [What are managed identities for Azure resources](../active-directory/managed-identities-azure-resources/overview.md).  

> [!IMPORTANT]
> Currently, you can't enable a system-managed identity when creating a new system topic, that is, when creating an event subscription on an Azure resource that supports system topics. 


## Use Azure portal
The following procedure shows you how to enable system-managed identity for a system topic. 

1. Go to the [Azure portal](https://portal.azure.com).
2. Search for **event grid system topics** in the search bar at the top.
3. Select the **system topic** for which you want to enable the managed identity. 
4. Select **Identity** on the left menu. You don't see this option for a system topic that's in the global location. 
5. Turn **on** the switch to enable the identity. 
1. Select **Save** on the toolbar to save the setting. 

    :::image type="content" source="./media/managed-service-identity/identity-existing-system-topic.png" alt-text="Identity page for a system topic"::: 
1. Select **Yes** on the confirmation message. 

    :::image type="content" source="./media/managed-service-identity/identity-existing-system-topic-confirmation.png" alt-text="Assign identity to a system topic - confirmation"::: 
1. Confirm that you see the object ID of the system-assigned managed identity and see a link to assign roles. 

    :::image type="content" source="./media/managed-service-identity/identity-existing-system-topic-completed.png" alt-text="Assign identity to a system topic - completed"::: 

## Global Azure sources
You can enable system-managed identity only for the regional Azure resources. You can't enable it for system topics associated with global Azure resources such as Azure subscriptions, resource groups, or Azure Maps. The system topics for these global sources are also not associated with a specific region. You don't see the **Identity** page for the system topic whose location is set to **Global**. 

:::image type="content" source="./media/managed-service-identity/system-topic-location-global.png" alt-text="System topic with location set to Global"::: 



## Next steps
Add the identity to an appropriate role (for example, Service Bus Data Sender) on the destination (for example, a Service Bus queue). For detailed steps, see [Grant managed identity the access to Event Grid destination](add-identity-roles.md). 