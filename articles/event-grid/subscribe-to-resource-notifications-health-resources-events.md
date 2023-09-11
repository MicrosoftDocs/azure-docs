---
title: Subscribe to Resource Notifications - Health Resources Event Grid events
description: This article explains how to subscribe to events published by Azure Resource Notifications - Health Resources. 
ms.topic: how-to
ms.date: 09/08/2023
---

# Subscribe to events raised by Azure Resource Notifications - Health Resources
This article describes steps to subscribe to events published by Azure Resource Notification - Health Resources. 

## Create Health Resources system topic

# [Azure CLI](#tab/#azure-cli)

1. Set the account to the Azure subscription where you wish to create the system topic.

    ```azurecli-interactive
    az account set –s AZURESUBSCRIPTIONID
    ```
2. Create a system topic of type `microsoft.resourcenotifications.healthresources` using the [`az eventgrid system-topic create`](/cli/azure/eventgrid/system-topic#az-eventgrid-system-topic-create) command.

    ```azurecli-interactive
    az eventgrid system-topic create --name SYSTEMTOPICNAME --resource-group RESOURCEGROUPNAME --source /subscriptions/AZURESUBSCRIPTIONID --topic-type microsoft.resourcenotifications.healthresources --location Global        
    ```
# [Azure PowerShell](#tab/#azure-powershell)

1. Set the account to the Azure subscription where you wish to create the system topic. 

    ```azurepowershell-interactive
    Set-AzContext -Subscription AZURESUBSCRIPTIONID
    ```
2. Create a system topic of type `microsoft.resourcenotifications.healthresources` using the [New-AzEventGridSystemTopic](/powershell/module/az.eventgrid/new-azeventgridsystemtopic) command.

    ```azurecli-interactive
    New-AzEventGridSystemTopic -name SYSTEMTOPICNAME -resourcegroup RESOURCEGROUPNAME -source /subscriptions/AZURESUBSCRIPTIONID -topictype microsoft.resourcenotifications.healthresources -location global    
    ```

# [Azure portal](#tab/#azure-portal)
Currently, you can't create a system topic for the Azure Resource Notifications source in the Azure portal. However, you can view system topics that are created using the CLI or PowerShell, and then add subscriptions to topics in the Azure portal. 

---

## Subscribe to events

# [Azure CLI](#tab/#azure-cli)
Create an event subscription for the above topic using the [`az eventgrid system-topic event-subscription create`](/cli/azure/eventgrid/system-topic/event-subscription#az-eventgrid-system-topic-event-subscription-create) command.

The following sample command creates an event subscription for the **AvailabilityStatusChanged** event. 

```azurecli-interactive
az eventgrid system-topic event-subscription create --name EVENTSUBSCRIPTIONNAME --resource-group RESOURCEGROUPNAME --system-topic-name SYSTEMTOPICNAME –included-event-types Microsoft.ResourceNotifications.HealthResources.AvailabilityStatusChanged --endpoint /subscriptions/AZURESUBSCRIPTIONID/ resourceGroups/RESOURCEGROUPNAME/providers/Microsoft.EventHub/namespaces/MYEVENTHUBSNAMESPACE/eventhubs/MYEVENTHUB --endpoint-type eventhub        
```

The following sample command creates an event subscription for the **ResourceAnnotated** event. 

```azurecli-interactive
az eventgrid system-topic event-subscription create --name EVENTSUBSCRIPTIONNAME --resource-group RESOURCEGROUPNAME --system-topic-name SYSTEMTOPICNAME –included-event-types Microsoft.ResourceNotifications.HealthResources.ResourceAnnotated --endpoint /subscriptions/AZURESUBSCRIPTIONID/ resourceGroups/RESOURCEGROUPNAME/providers/Microsoft.EventHub/namespaces/MYEVENTHUBSNAMESPACE/eventhubs/MYEVENTHUB --endpoint-type eventhub        
```

If you don't specify `included-event-types`, all the event types are included by default. 

To **filter events** from a specific resource, use the `--subject-begins-with` parameter. The example shows how to subscribe to `AvailabilityStatusChanged` events for resources in a specified resource group. 

```azurecli-interactive
az eventgrid system-topic event-subscription create --name EVENTSUBSCRIPTIONNAME --resource-group RESOURCEGROUPNAME --system-topic-name SYSTEMTOPICNAME –included-event-types Microsoft.ResourceNotifications.HealthResources.AvailabilityStatusChanged --endpoint /subscriptions/AZURESUBSCRIPTIONID/ resourceGroups/RESOURCEGROUPNAME/providers/Microsoft.EventHub/namespaces/MYEVENTHUBSNAMESPACE/eventhubs/MYEVENTHUB --endpoint-type eventhub --subject-begins-with /subscriptions/AZURESUBSCRIPTIONID/resourceGroups/SOURCERESOURCEGROUP/  
```

# [Azure PowerShell](#tab/#azure-powershell)

Create an event subscription for the above topic using the [New-AzEventGridSystemTopicEventSubscription](/powershell/module/az.eventgrid/new-azeventgridsystemtopiceventsubscription) command. 

The following sample command creates an event subscription for the **AvailabilityStatusChanged** event. 

```azurecli-interactive
New-AzEventGridSystemTopicEventSubscription -EventSubscriptionName EVENTSUBSCRIPTIONNAME -ResourceGroupName RESOURCEGROUPNAME -SystemtopicName SYSTEMTOPICNAME -IncludedEventType Microsoft.ResourceNotifications.HealthResources.AvailabilityStatusChanged -Endpoint /subscriptions/AZURESUBSCRIPTIONID/ resourceGroups/RESOURCEGROUPNAME/providers/Microsoft.EventHub/namespaces/EVENTHUBSNAMESPACE/eventhubs/EVENTHUB -EndpointType eventhub
```

The following sample command creates an event subscription for the **ResourceAnnotated** event. 

```azurecli-interactive
New-AzEventGridSystemTopicEventSubscription -EventSubscriptionName EVENTSUBSCRIPTIONNAME -ResourceGroupName RESOURCEGROUPNAME -SystemtopicName SYSTEMTOPICNAME -IncludedEventType Microsoft.ResourceNotifications.HealthResources.ResourceAnnotated -Endpoint /subscriptions/AZURESUBSCRIPTIONID/ resourceGroups/RESOURCEGROUPNAME/providers/Microsoft.EventHub/namespaces/EVENTHUBSNAMESPACE/eventhubs/EVENTHUB -EndpointType eventhub
```

If you don't specify `IncludedEventType`, all the event types are included by default.    

To **filter events** from a specific resource, use the `--subject-begins-with` parameter. The example shows how to subscribe to `AvailabilityStatusChanged` events from resources in a specified resource group. 

```azurecli-interactive
New-AzEventGridSystemTopicEventSubscription -EventSubscriptionName EVENTSUBSCRIPTIONNAME -ResourceGroupName RESOURCEGROUPNAME -SystemtopicName SYSTEMTOPICNAME -IncludedEventType Microsoft.ResourceNotifications.HealthResources.AvailabilityStatusChanged -Endpoint /subscriptions/AZURESUBSCRIPTIONID/ resourceGroups/RESOURCEGROUPNAME/providers/Microsoft.EventHub/namespaces/EVENTHUBSNAMESPACE/eventhubs/EVENTHUB -EndpointType eventhub -SubjectBeginsWith /subscriptions/AZURESUBSCRIPTIONID/resourceGroups/SOURCERESOURCEGROUP/
```

# [Azure portal](#tab/#azure-portal)
Currently, you can't create a system topic for the Azure Resource Notifications source in the Azure portal. However, you can view system topics that are created using the CLI or PowerShell, and then add subscriptions to topics in the Azure portal. 

---

## Delete system topic and event subscription
To delete a system topic, use the [`az eventgrid system-topic delete`](/cli/azure/eventgrid/system-topic#az-eventgrid-system-topic-delete) command, and to delete an event subscription, use the [`az eventgrid system-topic event-subscription delete`](/cli/azure/eventgrid/system-topic/event-subscription#az-eventgrid-system-topic-event-subscription-delete) command.



## Next steps


