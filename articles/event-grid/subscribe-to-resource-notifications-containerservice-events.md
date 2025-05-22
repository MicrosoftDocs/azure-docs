---
title: Subscribe to Azure Resource Notifications - ContainerService events
description: This article explains how to subscribe to events published by Azure Resource Notifications - ContainerService Events. 
ms.topic: how-to
ms.custom: devx-track-azurecli, devx-track-azurepowershell
ms.date: 11/14/2024
---

# Subscribe to events raised by Azure Resource Notifications - ContainerService Event Resources system topic (Preview)
This article explains the steps needed to subscribe to events published by Azure Resource Notifications - ContainerService Event Resources. For detailed information about these events, see [Azure Resource Notifications - ContainerService Event Resources](event-schema-containerservice-resources.md).

## Create Health Resources system topic

# [Azure CLI](#tab/azure-cli)

1. Set the account to the Azure subscription where you wish to create the system topic.

    ```azurecli-interactive
    az account set –s AZURESUBSCRIPTIONID
    ```
2. Create a system topic of type `microsoft.resourcenotifications.containerserviceeventresources` using the [`az eventgrid system-topic create`](/cli/azure/eventgrid/system-topic#az-eventgrid-system-topic-create) command.

    ```azurecli-interactive
    az eventgrid system-topic create --name SYSTEMTOPICNAME --resource-group RESOURCEGROUPNAME --source /subscriptions/AZURESUBSCRIPTIONID --topic-type microsoft.resourcenotifications.containerserviceeventresources --location Global        
    ```
# [Azure PowerShell](#tab/azure-powershell)

1. Set the account to the Azure subscription where you wish to create the system topic. 

    ```azurepowershell-interactive
    Set-AzContext -Subscription AZURESUBSCRIPTIONID
    ```
2. Create a system topic of type `microsoft.resourcenotifications.containerserviceeventresources` using the [New-AzEventGridSystemTopic](/powershell/module/az.eventgrid/new-azeventgridsystemtopic) command.

    ```azurepowershell-interactive
    New-AzEventGridSystemTopic -name SYSTEMTOPICNAME -resourcegroup RESOURCEGROUPNAME -source /subscriptions/AZURESUBSCRIPTIONID -topictype microsoft.resourcenotifications.containerserviceeventresources -location global    
    ```

# [Azure portal](#tab/azure-portal)

1. Sign into the [Azure portal](https://portal.azure.com).
1. In the search bar, type **Event Grid System Topics**, and select it from the drop-down list. 
1. On the **Event Grid system topics** page, select **+ Create** on the toolbar. 
1. On the **Create Event Grid System Topic** page, select **Azure Resource Notifications - ContainerService events** for **Topic type**.    

    :::image type="content" source="./media/subscribe-to-resource-notifications-containerservice-events/create-topic.png" alt-text="Screenshot that shows the Create topic page in the Azure portal." lightbox="./media/subscribe-to-resource-notifications-health-resources-events/create-topic.png" :::
1. Select the **resource group** in which you want to create the system topic.
1. Enter a **name** for the system topic.
1. Select **Review + create** 

    :::image type="content" source="./media/subscribe-to-resource-notifications-containerservice-events/create-topic-full.png" alt-text="Screenshot that shows the full Create topic page with details in the Azure portal.":::    
1. On the **Review + create** page, select **Create**. 
1. On the successful deployment page, select **Go to resource** to navigate to the page for your system topic. You see the details about your system topic on this page. 

    :::image type="content" source="./media/subscribe-to-resource-notifications-containerservice-events/system-topic-home-page.png" alt-text="Screenshot that shows the System topic page in the Azure portal." lightbox="./media/subscribe-to-resource-notifications-containerservice-events/system-topic-home-page.png" :::
    
---

## Subscribe to events

# [Azure CLI](#tab/azure-cli)
Create an event subscription for the above topic by using the [`az eventgrid system-topic event-subscription create`](/cli/azure/eventgrid/system-topic/event-subscription#az-eventgrid-system-topic-event-subscription-create) command.

The following sample command creates an event subscription for the **ScheduledEventEmitted** event. 

```azurecli-interactive
az eventgrid system-topic event-subscription create --name EVENTSUBSCRIPTIONNAME --resource-group RESOURCEGROUPNAME --system-topic-name SYSTEMTOPICNAME –included-event-types Microsoft.ResourceNotifications.ContainerServiceEventResources.ScheduledEventEmitted --endpoint /subscriptions/AZURESUBSCRIPTIONID/resourceGroups/RESOURCEGROUPNAME/providers/Microsoft.EventHub/namespaces/MYEVENTHUBSNAMESPACE/eventhubs/MYEVENTHUB --endpoint-type eventhub        
```

If you don't specify `included-event-types`, all the event types are included by default. 

To **filter events** from a specific resource, use the `--subject-begins-with` parameter. The example shows how to subscribe to `ScheduledEventsEmitted` events for resources in a specified resource group. 

```azurecli-interactive
az eventgrid system-topic event-subscription create --name EVENTSUBSCRIPTIONNAME --resource-group RESOURCEGROUPNAME --system-topic-name SYSTEMTOPICNAME –included-event-types Microsoft.ResourceNotifications.ContainerServiceEventResources.ScheduledEventEmitted --endpoint /subscriptions/AZURESUBSCRIPTIONID/resourceGroups/RESOURCEGROUPNAME/providers/Microsoft.EventHub/namespaces/MYEVENTHUBSNAMESPACE/eventhubs/MYEVENTHUB --endpoint-type eventhub --subject-begins-with /subscriptions/AZURESUBSCRIPTIONID/resourceGroups/SOURCERESOURCEGROUP/  
```

# [Azure PowerShell](#tab/azure-powershell)

Create an event subscription for the above topic using the [New-AzEventGridSystemTopicEventSubscription](/powershell/module/az.eventgrid/new-azeventgridsystemtopiceventsubscription) command. 

The following sample command creates an event subscription for the **ScheduledEventEmitted** event. 

```azurepowershell-interactive
New-AzEventGridSystemTopicEventSubscription -EventSubscriptionName EVENTSUBSCRIPTIONNAME -ResourceGroupName RESOURCEGROUPNAME -SystemtopicName SYSTEMTOPICNAME -IncludedEventType Microsoft.ResourceNotifications.ContainerServiceEventResources.ScheduledEventEmitted -Endpoint /subscriptions/AZURESUBSCRIPTIONID/resourceGroups/RESOURCEGROUPNAME/providers/Microsoft.EventHub/namespaces/EVENTHUBSNAMESPACE/eventhubs/EVENTHUB -EndpointType eventhub
```
If you don't specify `IncludedEventType`, all the event types are included by default.    

To **filter events** from a specific resource, use the `-SubjectBeginsWith` parameter. The example shows how to subscribe to `ScheduledEventEmitted` events from resources in a specified resource group. 

```azurepowershell-interactive
New-AzEventGridSystemTopicEventSubscription -EventSubscriptionName EVENTSUBSCRIPTIONNAME -ResourceGroupName RESOURCEGROUPNAME -SystemtopicName SYSTEMTOPICNAME -IncludedEventType Microsoft.ResourceNotifications.ContainerServiceEventResources.ScheduledEventEmitted -Endpoint /subscriptions/AZURESUBSCRIPTIONID/resourceGroups/RESOURCEGROUPNAME/providers/Microsoft.EventHub/namespaces/EVENTHUBSNAMESPACE/eventhubs/EVENTHUB -EndpointType eventhub -SubjectBeginsWith /subscriptions/AZURESUBSCRIPTIONID/resourceGroups/SOURCERESOURCEGROUP/
```

# [Azure portal](#tab/azure-portal)

1. On the **Event Grid System Topic** page, select **+ Event Subscription**  on the toolbar. 
1. Confirm that the **Topic Type**, **Source Resource**, and **Topic Name** are automatically populated. 
1. Enter a name for the event subscription. 
1. For **Filter to event types**, select the event, for example, **ScheduledEventEmitted**. 

    :::image type="content" source="./media/subscribe-to-resource-notifications-containerservice-events/create-event-subscription-select-event.png" alt-text="Screenshot that shows the Create Event Subscription page." lightbox="./media/subscribe-to-resource-notifications-health-resources-events/create-event-subscription-select-event.png":::
1. Select **endpoint type**. 
1. Configure event handler based on the endpoint type you selected. In the following example, an Azure event hub is selected. 

    :::image type="content" source="./media/subscribe-to-resource-notifications-containerservice-events/select-endpoint.png" alt-text="Screenshot that shows the Create Event Subscription page with an event handler." lightbox="./media/subscribe-to-resource-notifications-health-resources-events/select-endpoint.png":::
1. Select the **Filters** tab to provide subject filtering and advanced filtering. For example, to filter for events from resources in a specific resource group, follow these steps:
    1. Select **Enable subject filtering**. 
    1. In the **Subject Filters** section, for **Subject begins with**, provide the value of the resource group in this format: `/subscriptions/{subscription-id}/resourceGroups/{resourceGroup-id}`.

        :::image type="content" source="./media/subscribe-to-resource-notifications-containerservice-events/filter.png" alt-text="Screenshot that shows the Filters tab of the Create Event Subscription page." lightbox="./media/subscribe-to-resource-notifications-health-resources-events/filter.png":::
1. Then, select **Create** to create the event subscription.

---

## Delete event subscription and system topic

# [Azure CLI](#tab/azure-cli)

To delete the event subscription, use the [`az eventgrid system-topic event-subscription delete`](/cli/azure/eventgrid/system-topic/event-subscription#az-eventgrid-system-topic-event-subscription-delete) command. Here's an example:

```azurecli-interactive
az eventgrid system-topic event-subscription delete --name EVENTSUBSCRIPTIONNAME --resourcegroup RESOURCEGROUPNAME --system-topic-name SYSTEMTOPICNAME
```

To delete the system topic, use the [`az eventgrid system-topic delete`](/cli/azure/eventgrid/system-topic#az-eventgrid-system-topic-delete) command. Here's an example:

```azurecli-interactive
az eventgrid system-topic delete --name SYSTEMTOPICNAME --resource-group RESOURCEGROUPNAME
```

# [Azure PowerShell](#tab/azure-powershell)
To delete an event subscription, use the [`Remove-AzEventGridSystemTopicEventSubscription`](/powershell/module/az.eventgrid/remove-azeventgridsystemtopiceventsubscription) command. Here's an example:

```azurepowershell-interactive
Remove-AzEventGridSystemTopicEventSubscription -EventSubscriptionName EVENTSUBSCRIPTIONNAME -ResourceGroupName RESOURCEGROUPNAME -SystemTopicName SYSTEMTOPICNAME
```

To delete the system topic, use the [`Remove-AzEventGridSystemTopic`](/powershell/module/az.eventgrid/remove-azeventgridsystemtopic) command. Here's an example:

```azurepowershell-interactive
Remove-AzEventGridSystemTopic -ResourceGroupName RESOURCEGROUPNAME -Name SYSTEMTOPICNAME
```


# [Azure portal](#tab/azure-portal)

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the search bar, type **Event Grid System Topics**, and press ENTER.
1. Select the system topic.
1. On the **Event Grid System Topic** page, select **Delete**  on the toolbar. 

---

## Filtering examples

### Subscribe to Azure Kubernetes Cluster Scheduled Events by a Specific Cluster
You might want to filter the Azure Kubernetes Cluster Scheduled Events by a specific cluster on the subscriber end. This filtering helps ensure that you only receive notifications from clusters that are of interest to you.

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az eventgrid system-topic event-subscription create \
 --name EVENTSUBSCRIPTIONNAME \
 --resource-group RESOURCEGROUPNAME \
 --system-topic-name SYSTEMTOPICNAME \
 --included-event-types Microsoft.ResourceNotifications.ContainerServiceEventResources.ScheduledEventEmitted \
 --endpoint /subscriptions/000000000-0000-0000-0000-0000000000000/resourceGroups/RESOURCEGROUPNAME/providers/Microsoft.EventHub/namespaces/EVENTHUBNAMESPACE/eventhubs/EVENTHUBNAME \
 --endpoint-type evenhub \
 --advanced-filter data.resourceInfo.properties.resources StringContains clusterName

```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
New-AzEventGridSystemTopicEventSubscription -EventSubscriptionName EVENTSUBSCRIPTIONNAME
-ResourceGroupName RESOURCEGROUPNAME 
-SystemtopicName SYSTEMTOPICNAME 
-IncludedEventType Microsoft.ResourceNotifications.ContainerServiceEventResources.ScheduledEventEmitted  
-Endpoint /subscriptions/000000000-0000-0000-0000-000000000000/resourceGroups/RESOURCEGROUPNAME/providers/Microsoft.EventHub/namespaces/EVENTHUBNAMESPACE/eventhubs/EVENTHUBNAME 
-EndpointType eventhub 
-AdvancedFilter @(@{operator = "StringContains"; key = "data.resourceInfo.properties.resources" ; value ="clusterName"})

```

# [Azure portal](#tab/azure-portal)

1. Choose **ScheduledEventEmitted** as the event type. 
1. In the **Filters** tab of the event subscription, choose the following advanced filters.

    ```
    Key = data.resourceInfo.properties.resources
    Operator = String contains 
    Value = clusterName
    ```

---

### Subscribe to Azure Kubernetes Cluster Scheduled Events by "Completed" Event Status
You might want to filter the Azure Kubernetes Cluster Scheduled Events by a specific status, for example, "Completed" on the subscriber end. This filtering helps ensure that you only receive notifications from events that are of interest to you.

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az eventgrid system-topic event-subscription create \
 --name EVENTSUBSCRIPTIONNAME \
 --resource-group RESOURCEGROUPNAME \
 --system-topic-name SYSTEMTOPICNAME \
 --included-event-types Microsoft.ResourceNotifications.ContainerServiceEventResources.ScheduledEventEmitted \
 --endpoint /subscriptions/000000000-0000-0000-0000-0000000000000/resourceGroups/RESOURCEGROUPNAME/providers/Microsoft.EventHub/namespaces/EVENTHUBNAMESPACE/eventhubs/EVENTHUBNAME \
 --endpoint-type evenhub \
 --advanced-filter data.resourceInfo.properties.eventStatus StringContains Completed
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
New-AzEventGridSystemTopicEventSubscription -EventSubscriptionName EVENTSUBSCRIPTIONNAME
-ResourceGroupName RESOURCEGROUPNAME 
-SystemtopicName SYSTEMTOPICNAME 
-IncludedEventType Microsoft.ResourceNotifications.ContainerServiceEventResources.ScheduledEventEmitted  
-Endpoint /subscriptions/000000000-0000-0000-0000-000000000000/resourceGroups/RESOURCEGROUPNAME/providers/Microsoft.EventHub/namespaces/EVENTHUBNAMESPACE/eventhubs/EVENTHUBNAME 
-EndpointType eventhub 
-AdvancedFilter @(@{operator = "StringContains"; key = "data.resourceInfo.properties.eventStatus" ; value ="Completed"})

```

# [Azure portal](#tab/azure-portal)

In the **Filters** tab of the event subscription, choose the following advanced filters.

```
Key = data.resourceInfo.properties.eventStatus
Operator = String contains 
Value = Completed

```

---

[!INCLUDE [contact-resource-notifications](./includes/contact-resource-notifications.md)]

## Next steps
For detailed information about these events, see [Azure Resource Notifications - Container Service Events](event-schema-containerservice-resources.md).
