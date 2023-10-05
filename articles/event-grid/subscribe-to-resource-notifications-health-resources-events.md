---
title: Subscribe to Azure Resource Notifications - Health Resources events
description: This article explains how to subscribe to events published by Azure Resource Notifications - Health Resources. 
ms.topic: how-to
ms.custom: devx-track-azurecli, devx-track-azurepowershell
ms.date: 09/08/2023
---

# Subscribe to events raised by Azure Resource Notifications - Health Resources system topic
This article explains the steps needed to subscribe to events published by Azure Resource Notifications - Health Resources. For detailed information about these events, see [Azure Resource Notifications - Health Resources events](event-schema-health-resources.md).

## Create Health Resources system topic

# [Azure CLI](#tab/azure-cli)

1. Set the account to the Azure subscription where you wish to create the system topic.

    ```azurecli-interactive
    az account set –s AZURESUBSCRIPTIONID
    ```
2. Create a system topic of type `microsoft.resourcenotifications.healthresources` using the [`az eventgrid system-topic create`](/cli/azure/eventgrid/system-topic#az-eventgrid-system-topic-create) command.

    ```azurecli-interactive
    az eventgrid system-topic create --name SYSTEMTOPICNAME --resource-group RESOURCEGROUPNAME --source /subscriptions/AZURESUBSCRIPTIONID --topic-type microsoft.resourcenotifications.healthresources --location Global        
    ```
# [Azure PowerShell](#tab/azure-powershell)

1. Set the account to the Azure subscription where you wish to create the system topic. 

    ```azurepowershell-interactive
    Set-AzContext -Subscription AZURESUBSCRIPTIONID
    ```
2. Create a system topic of type `microsoft.resourcenotifications.healthresources` using the [New-AzEventGridSystemTopic](/powershell/module/az.eventgrid/new-azeventgridsystemtopic) command.

    ```azurepowershell-interactive
    New-AzEventGridSystemTopic -name SYSTEMTOPICNAME -resourcegroup RESOURCEGROUPNAME -source /subscriptions/AZURESUBSCRIPTIONID -topictype microsoft.resourcenotifications.healthresources -location global    
    ```

# [Azure portal](#tab/azure-portal)

1. Sign into the [Azure portal](https://portal.azure.com).
1. In the search bar, type **Event Grid System Topics**, and select it from the drop-down list. 
1. On the **Event Grid system topics** page, select **+ Create** on the toolbar. 
1. On the **Create Event Grid System Topic** page, select **Azure Resource Notifications - Health events** for **Topic type**.    

    :::image type="content" source="./media/subscribe-to-resource-notifications-health-resources-events/create-topic.png" alt-text="Screenshot that shows the Create topic page in the Azure portal." lightbox="./media/subscribe-to-resource-notifications-health-resources-events/create-topic.png" :::
1. Select the **resource group** in which you want to create the system topic.
1. Enter a **name** for the system topic.
1. Select **Review + create** 

    :::image type="content" source="./media/subscribe-to-resource-notifications-health-resources-events/create-topic-full.png" alt-text="Screenshot that shows the full Create topic page with details in the Azure portal.":::    
1. On the **Review + create** page, select **Create**. 
1. On the successful deployment page, select **Go to resource** to navigate to the page for your system topic. You see the details about your system topic on this page. 

    :::image type="content" source="./media/subscribe-to-resource-notifications-health-resources-events/system-topic-home-page.png" alt-text="Screenshot that shows the System topic page in the Azure portal." lightbox="./media/subscribe-to-resource-notifications-health-resources-events/system-topic-home-page.png" :::
    
---

## Subscribe to events

# [Azure CLI](#tab/azure-cli)
Create an event subscription for the above topic using the [`az eventgrid system-topic event-subscription create`](/cli/azure/eventgrid/system-topic/event-subscription#az-eventgrid-system-topic-event-subscription-create) command.

The following sample command creates an event subscription for the **AvailabilityStatusChanged** event. 

```azurecli-interactive
az eventgrid system-topic event-subscription create --name EVENTSUBSCRIPTIONNAME --resource-group RESOURCEGROUPNAME --system-topic-name SYSTEMTOPICNAME –included-event-types Microsoft.ResourceNotifications.HealthResources.AvailabilityStatusChanged --endpoint /subscriptions/AZURESUBSCRIPTIONID/resourceGroups/RESOURCEGROUPNAME/providers/Microsoft.EventHub/namespaces/MYEVENTHUBSNAMESPACE/eventhubs/MYEVENTHUB --endpoint-type eventhub        
```

The following sample command creates an event subscription for the **ResourceAnnotated** event. 

```azurecli-interactive
az eventgrid system-topic event-subscription create --name EVENTSUBSCRIPTIONNAME --resource-group RESOURCEGROUPNAME --system-topic-name SYSTEMTOPICNAME –included-event-types Microsoft.ResourceNotifications.HealthResources.ResourceAnnotated --endpoint /subscriptions/AZURESUBSCRIPTIONID/resourceGroups/RESOURCEGROUPNAME/providers/Microsoft.EventHub/namespaces/MYEVENTHUBSNAMESPACE/eventhubs/MYEVENTHUB --endpoint-type eventhub        
```

If you don't specify `included-event-types`, all the event types are included by default. 

To **filter events** from a specific resource, use the `--subject-begins-with` parameter. The example shows how to subscribe to `AvailabilityStatusChanged` events for resources in a specified resource group. 

```azurecli-interactive
az eventgrid system-topic event-subscription create --name EVENTSUBSCRIPTIONNAME --resource-group RESOURCEGROUPNAME --system-topic-name SYSTEMTOPICNAME –included-event-types Microsoft.ResourceNotifications.HealthResources.AvailabilityStatusChanged --endpoint /subscriptions/AZURESUBSCRIPTIONID/resourceGroups/RESOURCEGROUPNAME/providers/Microsoft.EventHub/namespaces/MYEVENTHUBSNAMESPACE/eventhubs/MYEVENTHUB --endpoint-type eventhub --subject-begins-with /subscriptions/AZURESUBSCRIPTIONID/resourceGroups/SOURCERESOURCEGROUP/  
```

# [Azure PowerShell](#tab/azure-powershell)

Create an event subscription for the above topic using the [New-AzEventGridSystemTopicEventSubscription](/powershell/module/az.eventgrid/new-azeventgridsystemtopiceventsubscription) command. 

The following sample command creates an event subscription for the **AvailabilityStatusChanged** event. 

```azurepowershell-interactive
New-AzEventGridSystemTopicEventSubscription -EventSubscriptionName EVENTSUBSCRIPTIONNAME -ResourceGroupName RESOURCEGROUPNAME -SystemtopicName SYSTEMTOPICNAME -IncludedEventType Microsoft.ResourceNotifications.HealthResources.AvailabilityStatusChanged -Endpoint /subscriptions/AZURESUBSCRIPTIONID/resourceGroups/RESOURCEGROUPNAME/providers/Microsoft.EventHub/namespaces/EVENTHUBSNAMESPACE/eventhubs/EVENTHUB -EndpointType eventhub
```

The following sample command creates an event subscription for the **ResourceAnnotated** event. 

```azurepowershell-interactive
New-AzEventGridSystemTopicEventSubscription -EventSubscriptionName EVENTSUBSCRIPTIONNAME -ResourceGroupName RESOURCEGROUPNAME -SystemtopicName SYSTEMTOPICNAME -IncludedEventType Microsoft.ResourceNotifications.HealthResources.ResourceAnnotated -Endpoint /subscriptions/AZURESUBSCRIPTIONID/resourceGroups/RESOURCEGROUPNAME/providers/Microsoft.EventHub/namespaces/EVENTHUBSNAMESPACE/eventhubs/EVENTHUB -EndpointType eventhub
```

If you don't specify `IncludedEventType`, all the event types are included by default.    

To **filter events** from a specific resource, use the `-SubjectBeginsWith` parameter. The example shows how to subscribe to `AvailabilityStatusChanged` events from resources in a specified resource group. 

```azurepowershell-interactive
New-AzEventGridSystemTopicEventSubscription -EventSubscriptionName EVENTSUBSCRIPTIONNAME -ResourceGroupName RESOURCEGROUPNAME -SystemtopicName SYSTEMTOPICNAME -IncludedEventType Microsoft.ResourceNotifications.HealthResources.AvailabilityStatusChanged -Endpoint /subscriptions/AZURESUBSCRIPTIONID/resourceGroups/RESOURCEGROUPNAME/providers/Microsoft.EventHub/namespaces/EVENTHUBSNAMESPACE/eventhubs/EVENTHUB -EndpointType eventhub -SubjectBeginsWith /subscriptions/AZURESUBSCRIPTIONID/resourceGroups/SOURCERESOURCEGROUP/
```

# [Azure portal](#tab/azure-portal)

1. On the **Event Grid System Topic** page, select **+ Event Subscription**  on the toolbar. 
1. Confirm that the **Topic Type**, **Source Resource**, and **Topic Name** are automatically populated. 
1. Enter a name for the event subscription. 
1. For **Filter to event types**, select the event, for example, **Availability status changed** or **Resource annotated**. 

    :::image type="content" source="./media/subscribe-to-resource-notifications-health-resources-events/create-event-subscription-select-event.png" alt-text="Screenshot that shows the Create Event Subscription page." lightbox="./media/subscribe-to-resource-notifications-health-resources-events/create-event-subscription-select-event.png":::
1. Select **endpoint type**. 
1. Configure event handler based no the endpoint type you selected. In the following example, an Azure event hub is selected. 

    :::image type="content" source="./media/subscribe-to-resource-notifications-health-resources-events/select-endpoint.png" alt-text="Screenshot that shows the Create Event Subscription page with an event handler." lightbox="./media/subscribe-to-resource-notifications-health-resources-events/select-endpoint.png":::
1. Select the **Filters** tab to provide subject filtering and advanced filtering. For example, to filter for events from resources in a specific resource group, follow these steps:
    1. Select **Enable subject filtering**. 
    1. In the **Subject Filters** section, for **Subject begins with**, provide the value of the resource group in this format: `/subscriptions/{subscription-id}/resourceGroups/{resourceGroup-id}`.

        :::image type="content" source="./media/subscribe-to-resource-notifications-health-resources-events/filter.png" alt-text="Screenshot that shows the Filters tab of the Create Event Subscription page." lightbox="./media/subscribe-to-resource-notifications-health-resources-events/filter.png":::
1. Then, select **Create** to create the event subscription.

---

## Delete event subscription and system topic

# [Azure CLI](#tab/azure-cli)

To delete the event subscription, use the [`az eventgrid system-topic event-subscription delete`](/cli/azure/eventgrid/system-topic/event-subscription#az-eventgrid-system-topic-event-subscription-delete) command. Here's an example:

```azurecli-interactive
az eventgrid system-topic event-subscription delete --name firstEventSubscription --resourcegroup sampletestrg --system-topic-name arnSystemTopicHealth
```

To delete the system topic, use the [`az eventgrid system-topic delete`](/cli/azure/eventgrid/system-topic#az-eventgrid-system-topic-delete) command. Here's an example:

```azurecli-interactive
az eventgrid system-topic delete --name arnsystemtopicHealth --resource-group sampletestrg
```

# [Azure PowerShell](#tab/azure-powershell)
To delete an event subscription, use the [`Remove-AzEventGridSystemTopicEventSubscription`](/powershell/module/az.eventgrid/remove-azeventgridsystemtopiceventsubscription) command. Here's an example:

```azurepowershell-interactive
Remove-AzEventGridSystemTopicEventSubscription -EventSubscriptionName firstEventSubscription -ResourceGroupName sampletestrg -SystemTopicName arnSystemTopicHealth
```

To delete the system topic, use the [`Remove-AzEventGridSystemTopic`](/powershell/module/az.eventgrid/remove-azeventgridsystemtopic) command. Here's an example:

```azurepowershell-interactive
Remove-AzEventGridSystemTopic -ResourceGroupName sampletestrg -Name arnsystemtopicHealth
```


# [Azure portal](#tab/azure-portal)

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the search bar, type **Event Grid System Topics**, and press ENTER.
1. Select the system topic.
1. On the **Event Grid System Topic** page, select **Delete**  on the toolbar. 

---

## Filtering examples

### Subscribe to Platform Initiated annotations belonging to Unplanned category.
You might want to filter to events that require an action. Near real-time alerts are critical in enabling quick mitigation actions. By filtering to Azure initiated and unplanned activity, you can become instantly aware of unanticipated activity across the workloads that requires immediate attention. You might want to redeploy or trigger communication to your end-users to notify the impact.

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az eventgrid system-topic event-subscription create \
	--name firstEventSubscription \
	--resource-group sampletestrg \
	--system-topic-name arnSystemTopicHealth 
	--included-event-types Microsoft.ResourceNotifications.HealthResources.ResourceAnnotated \
	--endpoint /subscriptions/000000000-0000-0000-0000-000000000000/resourceGroups/sampletestrg/providers/Microsoft.EventHub/namespaces/testEventHub/eventhubs/ehforsystemtopicresources \
	--endpoint-type evenhub \
	--advanced-filter data.resourceInfo.properties.context StringEndsWith Platform Initiated \
	--advanced-filter data.resourceInfo.properties.category StringEndsWith Unplanned 
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
New-AzEventGridSystemTopicEventSubscription -EventSubscriptionName firstEventSubscription -ResourceGroupName sampletestrg -SystemtopicName arnSystemTopicHealth -IncludedEventType Microsoft.ResourceNotifications.HealthResources.ResourceAnnotated -Endpoint /subscriptions/000000000-0000-0000-0000-000000000000/resourceGroups/sampletestrg/providers/Microsoft.EventHub/namespaces/testEventHub/eventhubs/ehforsystemtopicresources  -EndpointType eventhub -AdvancedFilter @(@{operator = "StringEndsWith"; key = "data.resourceInfo.properties.context" ; value ="Platform Initiated"}, @{operator = "StringEndsWith"; key = "data.resourceInfo.properties.category" ; value ="Unplanned"})
```

# [Azure portal](#tab/azure-portal)

1. Choose **Resource Annotated** as the event type. 
1. In the **Filters** tab of the event subscription, choose the following advanced filters.

    ```
    - Key = data.resourceInfo.properties.context 
    - Operator = StringEndsWith 
    - Value = Platform Initiated

        AND

    - Key = data.resourceInfo.properties.category 
    - Operator = StringEndsWith 
    - Value = Unplanned
    ```

---

### Subscribe to annotations scoped to a particular target type
Having the ability to filter to the resource types that require attention or mitigation upon impact can enable you to focus on what matters. Even within VMs, perhaps you only care when health of the parent or entire virtual machine scale set is affected versus when an instance in a virtual machine scale set is affected. This filter allows you to precisely hone in on the type of resources for which you want the near real-time alerts.

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az eventgrid system-topic event-subscription create \
	--name firstEventSubscription \
	--resource-group sampletestrg \
	--system-topic-name arnSystemTopicHealth \
	--included-event-types Microsoft.ResourceNotifications.HealthResources.ResourceAnnotated \
	--endpoint/subscriptions/000000000-0000-0000-0000-0000000000000/resourceGroups/sampletestrg/providers/Microsoft.EventHub/namespaces/testEventHub/eventhubs/ehforsystemtopicresources \
	--endpoint-type evenhub \
	--advanced-filter data.resourceInfo.targetResourceType StringContains Microsoft.Compute/virtualMachines
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
New-AzEventGridSystemTopicEventSubscription -EventSubscriptionName firstEventSubscription -ResourceGroupName sampletestrg -SystemtopicName arnSystemTopicHealth -IncludedEventType Microsoft.ResourceNotifications.HealthResources.ResourceAnnotated -Endpoint /subscriptions/000000000-0000-0000-0000-000000000000/resourceGroups/sampletestrg/providers/Microsoft.EventHub/namespaces/testEventHub/eventhubs/ehforsystemtopicresources  -EndpointType eventhub -AdvancedFilter @(@{operator = "StringContains"; key = "data.resourceInfo.properties.targetResourceType" ; value ="Microsoft.Compute/virtualMachines"})
```

# [Azure portal](#tab/azure-portal)

In the **Filters** tab of the event subscription, choose the following advanced filters.

```
Key = data.resourceInfo.properties.targetResourceType
Operator = String contains
Value = Microsoft.Compute/virtualMachines
```

---


## Next steps
For detailed information about these events, see [Azure Resource Notifications - Health Resources events](event-schema-health-resources.md).
