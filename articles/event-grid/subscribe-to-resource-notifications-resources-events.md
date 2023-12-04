---
title: Subscribe to Azure Resource Notifications - Resource Management events
description: This article explains how to subscribe to Azure Resource Notifications - Azure Resource Management events.
ms.topic: how-to
ms.date: 10/08/2023
---

# Subscribe to Azure Resource Management events in Event Grid (Preview)
This article explains the steps needed to subscribe to events published by Azure Resource Notifications - Resources. For detailed information about these events, see [Azure Resource Notifications - Resources events](event-schema-resources.md).

## Create Resources system topic
This section shows you how to create a system topic of type `microsoft.resourcenotifications.resources`.

# [Azure CLI](#tab/azure-cli)

1. Set the account to the Azure subscription where you wish to create the system topic.

    ```azurecli-interactive
    az account set –s AZURESUBSCRIPTIONID
    ```
2. Create a system topic of type `microsoft.resourcenotifications.resources` using the [`az eventgrid system-topic create`](/cli/azure/eventgrid/system-topic#az-eventgrid-system-topic-create) command.

    ```azurecli-interactive
    az eventgrid system-topic create \
                --name SYSTEMTOPICNAME \
                --resource-group RESOURCEGROUPNAME \
                --source /subscriptions/AZURESUBSCRIPTIONID \
                --topic-type microsoft.resourcenotifications.resources \
                --location Global        
    ```
# [Azure PowerShell](#tab/azure-powershell)

1. Set the account to the Azure subscription where you wish to create the system topic. 

    ```azurepowershell-interactive
    Set-AzContext -Subscription AZURESUBSCRIPTIONID
    ```
2. Create a system topic of type `microsoft.resourcenotifications.resources` using the [New-AzEventGridSystemTopic](/powershell/module/az.eventgrid/new-azeventgridsystemtopic) command.

    ```azurepowershell-interactive
    New-AzEventGridSystemTopic -name SYSTEMTOPICNAME `
                    -resourcegroup RESOURCEGROUPNAME `
                    -source /subscriptions/AZURESUBSCRIPTIONID `
                    -topictype microsoft.resourcenotifications.resources `
                    -location global    
    ```

# [Azure portal](#tab/azure-portal)

1. Sign into the [Azure portal](https://portal.azure.com).
1. In the search bar, type **Event Grid System Topics**, and select it from the drop-down list. 
1. On the **Event Grid system topics** page, select **Create** on the toolbar. 
1. On the **Create Event Grid System Topic** page, select **Azure Resource Management - Preview** for **Topic type**.    

    :::image type="content" source="./media/subscribe-to-resources-events/create-system-topic.png" alt-text="Screenshot that shows the Create System Topic page." lightbox="./media/subscribe-to-resources-events/create-system-topic.png":::
1. Select the **resource group** in which you want to create the system topic.
1. Enter a **name** for the system topic.
1. Select **Review + create** 
1. On the **Review + create** page, select **Create**. 
1. On the successful deployment page, select **Go to resource** to navigate to the page for your system topic. You see the details about your system topic on this page. 
    
---

## Subscribe to events

# [Azure CLI](#tab/azure-cli)
Create an event subscription for the above topic using the [`az eventgrid system-topic event-subscription create`](/cli/azure/eventgrid/system-topic/event-subscription#az-eventgrid-system-topic-event-subscription-create) command.

The following sample command creates an event subscription for both **CreatedOrUpdated** and **Deleted** events. If you don't specify `included-event-types`, all the event types are included by default. 

```azurecli-interactive
az eventgrid system-topic event-subscription create \
                --name EVENTSUBSCRIPTIONNAME \
                --resource-group RESOURCEGROUPNAME \
                --system-topic-name SYSTEMTOPICNAME \
                –-included-event-types Microsoft.ResourceNotifications.Resources.CreatedOrUpdated, Microsoft.ResourceNotifications.Resources.Deleted \
                --endpoint /subscriptions/AZURESUBSCRIPTIONID/resourceGroups/RESOURCEGROUPNAME/providers/Microsoft.EventHub/namespaces/MYEVENTHUBSNAMESPACE/eventhubs/MYEVENTHUB \
                --endpoint-type eventhub        
```

# [Azure PowerShell](#tab/azure-powershell)

Create an event subscription for the above topic using the [New-AzEventGridSystemTopicEventSubscription](/powershell/module/az.eventgrid/new-azeventgridsystemtopiceventsubscription) command. 

The following sample command creates an event subscription for both **CreatedOrUpdated** and **Deleted** events. If you don't specify `IncludedEventType`, all the event types are included by default.    

```azurepowershell-interactive
New-AzEventGridSystemTopicEventSubscription -EventSubscriptionName EVENTSUBSCRIPTIONNAME `
                -ResourceGroupName RESOURCEGROUPNAME `
                -SystemtopicName SYSTEMTOPICNAME `
                -IncludedEventType Microsoft.ResourceNotifications.Resources.CreatedOrUpdated, Microsoft.ResourceNotifications.Resources.Deleted `
                -Endpoint /subscriptions/AZURESUBSCRIPTIONID/resourceGroups/RESOURCEGROUPNAME/providers/Microsoft.EventHub/namespaces/EVENTHUBSNAMESPACE/eventhubs/EVENTHUB `
                -EndpointType eventhub
```

# [Azure portal](#tab/azure-portal)

1. On the **Event Grid System Topic** page, select **Event Subscription**  on the toolbar. 
1. Confirm that the **Topic Type**, **Source Resource**, and **Topic Name** are automatically populated. 
1. Enter a name for the event subscription. 
1. For **Filter to event types**, select the event, for example, **CreatedOrUpdated** or **Deleted**. 

    :::image type="content" source="./media/subscribe-to-resources-events/create-event-subscription-select-event.png" alt-text="Screenshot that shows the Create Event Subscription page." lightbox="./media/subscribe-to-resources-events/create-event-subscription-select-event.png":::
1. Select **endpoint type**. 
1. Configure event handler based no the endpoint type you selected. In the following example, an Azure event hub is selected. 

    :::image type="content" source="./media/subscribe-to-resources-events/select-endpoint.png" alt-text="Screenshot that shows the Create Event Subscription page with an event handler." lightbox="./media/subscribe-to-resources-events/select-endpoint.png":::
1. Select the **Filters** tab to provide subject filtering and advanced filtering. For example, to filter for events from resources in a specific resource group, follow these steps:
    1. Select **Enable subject filtering**. 
    1. In the **Subject Filters** section, for **Subject begins with**, provide the value of the resource group in this format: `/subscriptions/{subscription-id}/resourceGroups/{resourceGroup-id}`.

        :::image type="content" source="./media/subscribe-to-resources-events/filter.png" alt-text="Screenshot that shows the Filters tab of the Create Event Subscription page." lightbox="./media/subscribe-to-resources-events/filter.png":::
1. Then, select **Create** to create the event subscription.

---

## Delete event subscription and system topic

# [Azure CLI](#tab/azure-cli)

To delete the event subscription, use the [`az eventgrid system-topic event-subscription delete`](/cli/azure/eventgrid/system-topic/event-subscription#az-eventgrid-system-topic-event-subscription-delete) command. Here's an example:

```azurecli-interactive
az eventgrid system-topic event-subscription delete --name firstEventSubscription --resourcegroup sampletestrg --system-topic-name arnSystemTopicResources
```

To delete the system topic, use the [`az eventgrid system-topic delete`](/cli/azure/eventgrid/system-topic#az-eventgrid-system-topic-delete) command. Here's an example:

```azurecli-interactive
az eventgrid system-topic delete --name arnSystemTopicResources --resource-group sampletestrg
```

# [Azure PowerShell](#tab/azure-powershell)
To delete an event subscription, use the [`Remove-AzEventGridSystemTopicEventSubscription`](/powershell/module/az.eventgrid/remove-azeventgridsystemtopiceventsubscription) command. Here's an example:

```azurepowershell-interactive
Remove-AzEventGridSystemTopicEventSubscription -EventSubscriptionName firstEventSubscription -ResourceGroupName sampletestrg -SystemTopicName arnSystemTopicResources
```

To delete the system topic, use the [`Remove-AzEventGridSystemTopic`](/powershell/module/az.eventgrid/remove-azeventgridsystemtopic) command. Here's an example:

```azurepowershell-interactive
Remove-AzEventGridSystemTopic -ResourceGroupName sampletestrg -Name arnSystemTopicResources
```


# [Azure portal](#tab/azure-portal)

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the search bar, type **Event Grid System Topics**, and press ENTER.
1. Select the system topic.
1. On the **Event Grid System Topic** page, select **Delete**  on the toolbar. 

---

## Filtering examples

### Subscribe to create, update, delete notifications for virtual machines in an Azure subscription
This section shows filtering example of subscribing to create, update, and delete notifications for virtual machines in an Azure subscription.

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az eventgrid system-topic event-subscription create \
	--name firstEventSubscription \
	--resource-group sampletestrg \
	--system-topic-name arnSystemTopicResources 
	--included-event-types Microsoft.ResourceNotifications.Resources.CreatedOrUpdated, Microsoft.ResourceNotifications.Resources.Deleted \
	--endpoint /subscriptions/000000000-0000-0000-0000-000000000000/resourceGroups/sampletestrg/providers/Microsoft.EventHub/namespaces/testEventHub/eventhubs/ehforsystemtopicresources \
	--endpoint-type evenhub \
    --advanced-filter data.resourceInfo.type StringEndsWith virtualMachines
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
New-AzEventGridSystemTopicEventSubscription -EventSubscriptionName firstEventSubscription `
            -ResourceGroupName sampletestrg `
            -SystemtopicName arnSystemTopicResources `
            -IncludedEventType Microsoft.ResourceNotifications.Resources.CreatedOrUpdated, Microsoft.ResourceNotifications.Resources.Deleted `
            -Endpoint /subscriptions/000000000-0000-0000-0000-000000000000/resourceGroups/sampletestrg/providers/Microsoft.EventHub/namespaces/testEventHub/eventhubs/ehforsystemtopicresources `
            -EndpointType eventhub `
            -AdvancedFilter @(@{operator = "StringEndsWith"; key = "data.resourceInfo.type" ; value ="virtualMachines"})
```

# [Azure portal](#tab/azure-portal)

1. Choose **CreatedOrUpdated** and **Deleted** event types. 
1. In the **Filters** tab of the event subscription, choose the following advanced filters.

    ```
    Key = "data.resourceInfo.type"
    Operator = "StringEndsWith" 
    Value = "virtualMachines"
    ```

---

### Subscribe to VM create, update, and delete notifications by a particular resource group

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az eventgrid system-topic event-subscription create \
	--name firstEventSubscription \
	--resource-group sampletestrg \
	--system-topic-name arnSystemTopicResources \
	--included-event-types Microsoft.ResourceNotifications.Resources.CreatedOrUpdated, Microsoft.ResourceNotifications.Resources.Deleted \
	--endpoint/subscriptions/000000000-0000-0000-0000-0000000000000/resourceGroups/sampletestrg/providers/Microsoft.EventHub/namespaces/testEventHub/eventhubs/ehforsystemtopicresources \
	--endpoint-type evenhub \
    --subject-begins-with /subscription/{Azure subscription ID}/resourceGroups/<Resource group name>/
	--advanced-filter data.resourceInfo.type StringEndsWith virtualMachines
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
New-AzEventGridSystemTopicEventSubscription -EventSubscriptionName firstEventSubscription `
            -ResourceGroupName sampletestrg `
            -SystemtopicName arnSystemTopicResources `
            -IncludedEventType Microsoft.ResourceNotifications.Resources.CreatedOrUpdated, Microsoft.ResourceNotifications.Resources.Deleted `
            -Endpoint /subscriptions/000000000-0000-0000-0000-000000000000/resourceGroups/sampletestrg/providers/Microsoft.EventHub/namespaces/testEventHub/eventhubs/ehforsystemtopicresources `
            -EndpointType eventhub -AdvancedFilter @(@{operator = "StringEndsWith"; key = "data.resourceInfo.type" ; value ="virtualMachines"})
```

# [Azure portal](#tab/azure-portal)

In the **Filters** tab of the event subscription, enable subject filtering, and use the following subject filter:

```
Subject begins with = /subscriptions/{subscription-id}/resourceGroups/{resourceGroup-id}
```

Then, choose the following advanced filters.

```
Key = "data.resourceInfo.type"
Operator = "String ends with"
Value = "virtualMachines"
```

---

### Subscribe to VM create and update notifications by a particular location within a subscription

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az eventgrid system-topic event-subscription create \
	--name firstEventSubscription \
	--resource-group sampletestrg \
	--system-topic-name arnSystemTopicResources \
	--included-event-types Microsoft.ResourceNotifications.Resources.CreatedOrUpdated \
	--endpoint/subscriptions/000000000-0000-0000-0000-0000000000000/resourceGroups/sampletestrg/providers/Microsoft.EventHub/namespaces/testEventHub/eventhubs/ehforsystemtopicresources \
	--endpoint-type evenhub \
    --subject-begins-with /subscription/{Azure subscription ID}/resourceGroups/<Resource group name>/
    --advanced-filter data.resourceInfo.location StringIn eastus 
    –-advanced-filter data.resourceInfo.type StringEndsWith virtualMachines
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
New-AzEventGridSystemTopicEventSubscription -EventSubscriptionName firstEventSubscription `
            -ResourceGroupName sampletestrg `
            -SystemtopicName arnSystemTopicResources `
            -IncludedEventType Microsoft.ResourceNotifications.Resources.CreatedOrUpdated, Microsoft.ResourceNotifications.Resources.Deleted `
            -Endpoint /subscriptions/000000000-0000-0000-0000-000000000000/resourceGroups/sampletestrg/providers/Microsoft.EventHub/namespaces/testEventHub/eventhubs/ehforsystemtopicresources `
            -EndpointType eventhub `
            -AdvancedFilter @(@{operator = "StringIn"; key = "data.resourceInfo.location"; value ="eastus"}, @{operator = "StringEndsWith"; key = "data.resourceInfo.type" ; value ="virtualMachines"})
```

# [Azure portal](#tab/azure-portal)

In the **Filters** tab of the event subscription, enable subject filtering, and use the following subject filter:

```
Subject begins with = /subscriptions/{subscription-id}/resourceGroups/{resourceGroup-id}
```

Then, choose the following advanced filters.

```
Key = "data.resourceInfo.location",
Operator = "String is in"
Value = "eastus"
```

AND

Key = "data.resourceInfo.type",
Operator = "String ends with"
Value = "virtualMachines"

---

[!INCLUDE [contact-resource-notifications](./includes/contact-resource-notifications.md)]

## Next steps
For detailed information about these events, see [Azure Resource Notifications - Resources events](event-schema-resources.md).
