---
title: Add managed identity to a role on Azure Event Grid destination
description: This article describes how to add managed identity to Azure roles on destinations such as Azure Service Bus and Azure Event Hubs. 
ms.topic: how-to
ms.custom: devx-track-azurecli
ms.date: 03/25/2021
---

# Grant managed identity the access to Event Grid destination
This section describes how to add the identity for your system topic, custom topic, or domain to an Azure role. 

## Prerequisites
Assign a system-assigned managed identity by using instructions from the following articles:

- [Custom topics or domains](enable-identity-custom-topics-domains.md)
- [System topics](enable-identity-system-topics.md)

## Supported destinations and Azure roles
After you enable identity for your event grid custom topic or domain, Azure automatically creates an identity in Microsoft Entra ID. Add this identity to appropriate Azure roles so that the custom topic or domain can forward events to supported destinations. For example, add the identity to the **Azure Event Hubs Data Sender** role for an Azure Event Hubs namespace so that the event grid custom topic can forward events to event hubs in that namespace. 

Currently, Azure event grid supports custom topics or domains configured with a system-assigned managed identity to forward events to the following destinations. This table also gives you the roles that the identity should be in so that the custom topic can forward the events.

| Destination | Azure role | 
| ----------- | --------- | 
| Service Bus queues and topics | [Azure Service Bus Data Sender](../service-bus-messaging/authenticate-application.md#azure-built-in-roles-for-azure-service-bus) |
| Azure Event Hubs | [Azure Event Hubs Data Sender](../event-hubs/authorize-access-azure-active-directory.md#azure-built-in-roles-for-azure-event-hubs) | 
| Azure Blob storage | [Storage Blob Data Contributor](../storage/blobs/assign-azure-role-data-access.md) |
| Azure Queue storage |[Storage Queue Data Message Sender](../storage/blobs/assign-azure-role-data-access.md) | 

## Use the Azure portal
You can use the Azure portal to assign the custom topic or domain identity to an appropriate role so that the custom topic or domain can forward events to the destination. 

The following example adds a managed identity for an event grid custom topic named **msitesttopic** to the **Azure Service Bus Data Sender** role for a Service Bus namespace that contains a queue or topic resource. When you add to the role at the namespace level, the event grid custom topic can forward events to all entities within the namespace. 

1. Go to your **Service Bus namespace** in the [Azure portal](https://portal.azure.com). 
1. Select **Access Control** in the left pane. 
1. Select **Add** in the **Add role assignment (Preview)** section. 

    :::image type="content" source="./media/add-identity-roles/add-role-assignment-menu.png" alt-text="Image showing the selection of Add role assignment (Preview) menu":::
1. On the **Add role assignment** page, select **Azure Service Bus Data Sender**, and select **Next**.  
    
    :::image type="content" source="./media/add-identity-roles/select-role.png" alt-text="Image showing the selection of the Azure Service Bus Data Sender role":::
1. In the **Members** tab, follow these steps: 
    1. Select **Use, group, or service principal**, and click **+ Select members**. The **Managed identity** option doesn't support Event Grid identities yet. 
    1. In the **Select members** window, search for and select the service principal with the same name as your custom topic. In the following example, it's **spcustomtopic0728**.
    
        :::image type="content" source="./media/add-identity-roles/select-managed-identity-option.png" alt-text="Image showing the selection of the User, group, or service principal option":::    
    1. In the **Select members** window, click **Select**. 

        :::image type="content" source="./media/add-identity-roles/managed-identity-selected.png" alt-text="Image showing the selection of the Managed identity option":::            
1. Now, back on the **Members** tab, select **Next**. 

    :::image type="content" source="./media/add-identity-roles/members-select-next.png" alt-text="Image showing the selection of the Next button on the Members page":::                
1. On the **Review + assign** page, select **Review + assign** after reviewing the settings. 

The steps are similar for adding an identity to other roles mentioned in the table. 

## Use the Azure CLI
The example in this section shows you how to use the Azure CLI to add an identity to an Azure role. The sample commands are for event grid custom topics. The commands for event grid domains are similar. 

### Get the principal ID for the custom topic's system identity 
First, get the principal ID of the custom topic's system-managed identity and assign the identity to appropriate roles.

```azurecli-interactive
topic_pid=$(az ad sp list --display-name "$<TOPIC NAME>" --query [].objectId -o tsv)
```

### Create a role assignment for event hubs at various scopes 
The following CLI example shows how to add a custom topic's identity to the **Azure Event Hubs Data Sender** role at the namespace level or at the event hub level. If you create the role assignment at the namespace level, the custom topic can forward events to all event hubs in that namespace. If you create a role assignment at the event hub level, the custom topic can forward events only to that specific event hub. 


```azurecli-interactive
role="Azure Event Hubs Data Sender" 
namespaceresourceid=$(az eventhubs namespace show -n $<EVENT HUBS NAMESPACE NAME> -g <RESOURCE GROUP of EVENT HUB> --query "{I:id}" -o tsv) 
eventhubresourceid=$(az eventhubs eventhub show -n <EVENT HUB NAME> --namespace-name <EVENT HUBS NAMESPACE NAME> -g <RESOURCE GROUP of EVENT HUB> --query "{I:id}" -o tsv) 

# create role assignment for the whole namespace 
az role assignment create --role "$role" --assignee "$topic_pid" --scope "$namespaceresourceid" 

# create role assignment scoped to just one event hub inside the namespace 
az role assignment create --role "$role" --assignee "$topic_pid" --scope "$eventhubresourceid" 
```

### Create a role assignment for a Service Bus topic at various scopes 
The following CLI example shows how to add an event grid custom topic's identity to the **Azure Service Bus Data Sender** role at the namespace level or at the Service Bus topic level. If you create the role assignment at the namespace level, the event grid topic can forward events to all entities (Service Bus queues or topics) within that namespace. If you create a role assignment at the Service Bus queue or topic level, the event grid custom topic can forward events only to that specific Service Bus queue or topic. 

```azurecli-interactive
role="Azure Service Bus Data Sender" 
namespaceresourceid=$(az servicebus namespace show -n $RG\SB -g "$RG" --query "{I:id}" -o tsv 
sbustopicresourceid=$(az servicebus topic show -n topic1 --namespace-name $RG\SB -g "$RG" --query "{I:id}" -o tsv) 

# create role assignment for the whole namespace 
az role assignment create --role "$role" --assignee "$topic_pid" --scope "$namespaceresourceid" 

# create role assignment scoped to just one hub inside the namespace 
az role assignment create --role "$role" --assignee "$topic_pid" --scope "$sbustopicresourceid" 
```

## Next steps
Now that you have assigned a system-assigned identity to your system topic, custom topic, or domain, and added the identity to appropriate roles on destinations, see [Deliver events using the managed identity](managed-service-identity.md) on delivering events to destinations using the identity.
