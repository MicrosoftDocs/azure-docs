---
title: Subscribe to Azure Resource Notifications - AKS Resources events
description: This article explains how to subscribe to events published by Azure Resource Notifications - AKS Resources. 
ms.topic: how-to
ms.custom: devx-track-azurecli, devx-track-azurepowershell
ms.date: 11/03/2025
---

# Subscribe to events raised by Azure Resource Notifications - AKS Resources system topic (Preview)
This article explains the steps needed to subscribe to events published by Azure Resource Notifications - AKS Resources. For detailed information about these events, see [Azure Resource Notifications - AKS Resources events](event-schema-aks-resources.md).

## Create AKS Resources system topic

# [Azure CLI](#tab/azure-cli)

1. Set the account to the Azure subscription where you wish to create the system topic.

    ```azurecli-interactive
    az account set –s AZURESUBSCRIPTIONID
    ```
2. Create a system topic of type `microsoft.resourcenotifications.AKSResources` using the [`az eventgrid system-topic create`](/cli/azure/eventgrid/system-topic#az-eventgrid-system-topic-create) command.

    ```azurecli-interactive

    az eventgrid system-topic create \
        --name SYSTEMTOPICNAME \
        --resource-group RESOURCEGROUPNAME \
        --source /subscriptions/AZURESUBSCRIPTIONID \
        --topic-type microsoft.resourcenotifications.AKSResources\
        --location Global   
     
    ```

# [Azure PowerShell](#tab/azure-powershell)

1. Set the account to the Azure subscription where you wish to create the system topic. 

    ```azurepowershell-interactive
    Set-AzContext -Subscription AZURESUBSCRIPTIONID
    ```
2. Create a system topic of type `microsoft.resourcenotifications.AKSResources` using the [New-AzEventGridSystemTopic](/powershell/module/az.eventgrid/new-azeventgridsystemtopic) command.

    ```azurepowershell-interactive

    New-AzEventGridSystemTopic`
      -name SYSTEMTOPICNAME` 
      -resourcegroup RESOURCEGROUPNAME` 
      -source /subscriptions/AZURESUBSCRIPTIONID -topictype microsoft.resourcenotifications.AKSResources`
      -location global    

    ```
    
# [Azure portal](#tab/azure-portal)

1. Sign into the [Azure portal](https://portal.azure.com).
1. In the search bar, type **Event Grid System Topics**, and select it from the drop-down list. 
1. On the **Event Grid system topics** page, select **+ Create** on the toolbar. 
1. On the **Create Event Grid System Topic** page, select **Azure Resource Notifications - AKS Resources events** for **Topic type**.    

    :::image type="content" source="./media/subscribe-to-resource-notifications-kubernetes-events/create-topic.png" alt-text="Screenshot that shows the Create topic page in the Azure portal." lightbox="./media/subscribe-to-resource-notifications-kubernetes-events/create-topic.png" :::
1. Select the **resource group** in which you want to create the system topic.
1. Enter a **name** for the system topic.
1. Select **Review + create** 

    :::image type="content" source="./media/subscribe-to-resource-notifications-kubernetes-events/create-topic-full.png" alt-text="Screenshot that shows the full Create topic page with details in the Azure portal.":::    
1. On the **Review + create** page, select **Create**. 
1. On the successful deployment page, select **Go to resource** to navigate to the page for your system topic. You see the details about your system topic on this page. 

    :::image type="content" source="./media/subscribe-to-resource-notifications-kubernetes-events/system-topic-home-page.png" alt-text="Screenshot that shows the System topic page in the Azure portal." lightbox="./media/subscribe-to-resource-notifications-kubernetes-events/system-topic-home-page.png" :::
        
---

## Subscribe to events

# [Azure CLI](#tab/azure-cli)
Create an event subscription for the above topic using the [`az eventgrid system-topic event-subscription create`](/cli/azure/eventgrid/system-topic/event-subscription#az-eventgrid-system-topic-event-subscription-create) command.

The following sample command creates an event subscription for the **FleetGateCreated** event. 

```azurecli-interactive

az eventgrid system-topic event-subscription create \
  --name stes-fleet-gates-sales-before-dev \
  --resource-group $GROUP \
  --system-topic-name stpc-aks-resource-notifications \
  --included-event-types Microsoft.ResourceNotifications.AKSResources.FleetGateCreated \
  --advanced-filter data.resourceInfo.properties.target.id StringContains "fleets/flt-mgr-approvals-01" \
  --advanced-filter data.resourceInfo.properties.gateType StringIn Approval \
  --advanced-filter data.resourceInfo.properties.state StringIn Pending \
  --advanced-filter data.resourceInfo.properties.displayName StringContains "Check with sales teams" \
  --advanced-filter data.resourceInfo.properties.target.updateRunProperties.timing StringIn Before \
  --advanced-filter data.resourceInfo.properties.target.updateRunProperties.stage StringIn Dev \
  --endpoint-type azurefunction \
  --endpoint /subscriptions/$SUBSCRIPTION_ID/resourceGroups/$GROUP/providers/Microsoft.Web/sites/fap-process-fleet-events/functions/fa-handle-pre-dev-events \
  --max-delivery-attempts 10 \
  --event-ttl 120       
```
     
If you don't specify `included-event-types`, all the event types are included by default. 

To **filter events** from a specific resource, use the `--subject-begins-with` parameter. The example shows how to subscribe to `FleetGateUpdated` events for resources in a specified resource group. 

```azurecli-interactive
az eventgrid system-topic event-subscription create \
  --name EVENTSUBSCRIPTIONNAME \
  --resource-group RESOURCEGROUPNAME \
  --system-topic-name SYSTEMTOPICNAME \
  --included-event-types Microsoft.ResourceNotifications.AKSResources.FleetGateUpdated \
  --advanced-filter data.resourceInfo.properties.target.id StringContains "fleets/flt-mgr-approvals-01" \
  --endpoint /subscriptions/$SUBSCRIPTION_ID/resourceGroups/$GROUP/providers/Microsoft.Web/sites/fap-process-fleet-events/functions/fa-handle-pre-dev-events \
  --endpoint-type azurefunction \
  --subject-begins-with /subscriptions/AZURESUBSCRIPTIONID/resourceGroups/RESOURCEGROUPNAME/
```

# [Azure PowerShell](#tab/azure-powershell)

Create an event subscription for the above topic using the [New-AzEventGridSystemTopicEventSubscription](/powershell/module/az.eventgrid/new-azeventgridsystemtopiceventsubscription) command. 

The following sample command creates an event subscription for the **FleetGateCreated** event. 

```azurepowershell-interactive
New-AzEventGridSubscription `
  -EventSubscriptionName "stes-fleet-gates-sales-before-dev" `
  -Scope "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$GROUP/providers/Microsoft.EventGrid/systemTopics/stpc-aks-resource-notifications" `
  -IncludedEventType @("Microsoft.ResourceNotifications.AKSResources.FleetGateCreated") `
  -AdvancedFilter @(
    (New-AzEventGridAdvancedFilterObject -StringContainsAdvancedFilter -Key "data.resourceInfo.properties.target.id" -Value @("fleets/flt-mgr-approvals-01")),
    (New-AzEventGridAdvancedFilterObject -StringInAdvancedFilter -Key "data.resourceInfo.properties.gateType" -Value @("Approval")),
    (New-AzEventGridAdvancedFilterObject -StringInAdvancedFilter -Key "data.resourceInfo.properties.state" -Value @("Pending")),
    (New-AzEventGridAdvancedFilterObject -StringContainsAdvancedFilter -Key "data.resourceInfo.properties.displayName" -Value @("Check with sales teams")),
    (New-AzEventGridAdvancedFilterObject -StringInAdvancedFilter -Key "data.resourceInfo.properties.target.updateRunProperties.timing" -Value @("Before")),
    (New-AzEventGridAdvancedFilterObject -StringInAdvancedFilter -Key "data.resourceInfo.properties.target.updateRunProperties.stage" -Value @("Dev"))
  ) `
  -EndpointType AzureFunction `
  -Endpoint "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$GROUP/providers/Microsoft.Web/sites/fap-process-fleet-events/functions/fa-handle-pre-dev-events" `
  -MaxDeliveryAttempt 10 

```
If you don’t specify -IncludedEventType, all event types are included by default

To **filter events** from a specific resource, use the `-SubjectBeginsWith` parameter. The example shows how to subscribe to `FleetGateUpdated` events for resources in a specified resource group. 

```azurepowershell-interactive
New-AzEventGridSubscription `
  -EventSubscriptionName "EVENTSUBSCRIPTIONNAME" `
  -Scope "/subscriptions/AZURESUBSCRIPTIONID/resourceGroups/RESOURCEGROUPNAME/providers/Microsoft.EventGrid/systemTopics/SYSTEMTOPICNAME" `
  -IncludedEventType @("Microsoft.ResourceNotifications.AKSResources.FleetGateUpdated") `
  -AdvancedFilter @(
    (New-AzEventGridAdvancedFilterObject -StringContainsAdvancedFilter -Key "data.resourceInfo.properties.target.id" -Value @("fleets/flt-mgr-approvals-01"))
  ) `
  -EndpointType AzureFunction `
  -Endpoint "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$GROUP/providers/Microsoft.Web/sites/fap-process-fleet-events/functions/fa-handle-pre-dev-events" `
  -SubjectBeginsWith "/subscriptions/AZURESUBSCRIPTIONID/resourceGroups/RESOURCEGROUPNAME/"
```
# [Azure portal](#tab/azure-portal)

1. On the **Event Grid System Topic** page, select **+ Event Subscription**  on the toolbar. 
1. Confirm that the **Topic Type**, **Source Resource**, and **Topic Name** are automatically populated. 
1. Enter a name for the event subscription. 
1. For **Filter to event types**, select the event, for example, **FleetGateCreated**. 

    :::image type="content" source="./media/subscribe-to-resource-notifications-kubernetes-events/create-event-subscription-select-event.png" alt-text="Screenshot that shows the Create Event Subscription page." lightbox="./media/subscribe-to-resource-notifications-kubernetes-events/create-event-subscription-select-event.png":::
1. Select **endpoint type**. 
1. Configure event handler based on the endpoint type you selected. In the following example, an Azure event hub is selected. 

    :::image type="content" source="./media/subscribe-to-resource-notifications-kubernetes-events/select-endpoint.png" alt-text="Screenshot that shows the Create Event Subscription page with an event handler." lightbox="./media/subscribe-to-resource-notifications-kubernetes-events/select-endpoint.png":::
1. Select the **Filters** tab to provide subject filtering and advanced filtering. For example, to filter for events from resources in a specific resource group, follow these steps:
    1. Select **Enable subject filtering**. 
    1. In the **Subject Filters** section, for **Subject begins with**, provide the value of the resource group in this format: `/subscriptions/{subscription-id}/resourceGroups/{resourceGroup-id}`.

        :::image type="content" source="./media/subscribe-to-resource-notifications-kubernetes-events/filter.png" alt-text="Screenshot that shows the Filters tab of the Create Event Subscription page." lightbox="./media/subscribe-to-resource-notifications-kubernetes-events/filter.png":::
1. Then, select **Create** to create the event subscription.

---

## Delete event subscription and system topic

# [Azure CLI](#tab/azure-cli)

To delete the event subscription, use the [`az eventgrid system-topic event-subscription delete`](/cli/azure/eventgrid/system-topic/event-subscription#az-eventgrid-system-topic-event-subscription-delete) command. Here's an example:

```azurecli-interactive
az eventgrid system-topic event-subscription delete \
   --name EVENTSUBSCRIPTIONNAME \
   --resourcegroup RESOURCEGROUPNAME \
  --system-topic-name SYSTEMTOPICNAME
```

To delete the system topic, use the [`az eventgrid system-topic delete`](/cli/azure/eventgrid/system-topic#az-eventgrid-system-topic-delete) command. Here's an example:

```azurecli-interactive
az eventgrid system-topic delete \
  --name SYSTEMTOPICNAME \
  --resource-group RESOURCEGROUPNAME
```

# [Azure PowerShell](#tab/azure-powershell)
To delete an event subscription, use the [`Remove-AzEventGridSystemTopicEventSubscription`](/powershell/module/az.eventgrid/remove-azeventgridsystemtopiceventsubscription) command. Here's an example:

```azurepowershell-interactive
Remove-AzEventGridSystemTopicEventSubscription`
       -EventSubscriptionName EVENTSUBSCRIPTIONNAME`
       -ResourceGroupName RESOURCEGROUPNAME`
       -SystemTopicName SYSTEMTOPICNAME
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

### Subscribe to Gate creation events to be notified of pending approvals.

You might want to route approvals to different people or teams. To achieve that, you can set up multiple subscriptions to the Event Grid System Topic, with different filters for each one. For example, if you have a team's clusters in a single update run group, you can filter on that group and set the endpoint to their Azure function which runs a post-update health check:

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az eventgrid system-topic event-subscription create \
  --name fleet-approvals-group-subscription \
  --resource-group <resource-group> \
  --system-topic-name system-topic-aksresources \
  --included-event-types Microsoft.ResourceNotifications.AKSResources.FleetGateCreated \
  --advanced-filter data.resourceInfo.properties.gateType StringIn Approval \
  --advanced-filter data.resourceInfo.properties.state StringIn Pending \
  --advanced-filter data.resourceInfo.properties.target.updateRunProperties.timing StringIn After \
  --advanced-filter data.resourceInfo.properties.target.updateRunProperties.group StringIn teamName-group \
  --endpoint-type azurefunction \
  --endpoint /subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCEGROUP/providers/Microsoft.Web/sites/teamname/functions/health-check
```
You can also use the gate **displayName** as a filter for events:

```azurecli-interactive
az eventgrid system-topic event-subscription create \
  --name fleet-approvals-group-subscription \
  --resource-group <resource-group> \
  --system-topic-name system-topic-aksresources \
  --included-event-types Microsoft.ResourceNotifications.AKSResources.FleetGateCreated \
  --advanced-filter data.resourceInfo.properties.gateType StringIn Approval \
  --advanced-filter data.resourceInfo.properties.state StringIn Pending \
  --advanced-filter data.resourceInfo.properties.displayName StringContains "Check with sales teams" \
  --endpoint-type eventhub \
  --endpoint /subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCEGROUP/providers/Microsoft.EventHub/namespaces/EVENTHUBNAMESPACE/eventhubs/EVENTHUBNAME
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive

New-AzEventGridSubscription `
  -EventSubscriptionName "fleet-approvals-group-subscription" `
  -Scope "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.EventGrid/systemTopics/system-topic-aksresources" `
  -IncludedEventType @("Microsoft.ResourceNotifications.AKSResources.FleetGateCreated") `
  -AdvancedFilter @(
    (New-AzEventGridAdvancedFilterObject -StringInAdvancedFilter `
        -Key   "data.resourceInfo.properties.gateType" `
        -Value @("Approval")
    ),
    (New-AzEventGridAdvancedFilterObject -StringInAdvancedFilter `
        -Key   "data.resourceInfo.properties.state" `
        -Value @("Pending")
    ),
    (New-AzEventGridAdvancedFilterObject -StringInAdvancedFilter `
        -Key   "data.resourceInfo.properties.target.updateRunProperties.timing" `
        -Value @("After")
    ),
    (New-AzEventGridAdvancedFilterObject -StringInAdvancedFilter `
        -Key   "data.resourceInfo.properties.target.updateRunProperties.group" `
        -Value @("teamName-group")
    )
  ) `
  -EndpointType AzureFunction `
  -Endpoint "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Web/sites/teamname/functions/health-check"

```

You can also use the gate **displayName** as a filter for events:

```azurepowershell-interactive

New-AzEventGridSubscription `
  -EventSubscriptionName "fleet-approvals-group-subscription" `
  -Scope "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.EventGrid/systemTopics/system-topic-aksresources" `
  -IncludedEventType @("Microsoft.ResourceNotifications.AKSResources.FleetGateCreated") `
  -AdvancedFilter @(
    (New-AzEventGridAdvancedFilterObject -StringInAdvancedFilter `
        -Key   "data.resourceInfo.properties.gateType" `
        -Value @("Approval")
    ),
    (New-AzEventGridAdvancedFilterObject -StringInAdvancedFilter `
        -Key   "data.resourceInfo.properties.state" `
        -Value @("Pending")
    ),
    (New-AzEventGridAdvancedFilterObject -StringContainsAdvancedFilter `
        -Key   "data.resourceInfo.properties.displayName" `
        -Value @("Check with sales teams")
    )
  ) `
  -EndpointType EventHub `

```
# [Azure portal](#tab/azure-portal)

1. Choose **FleetGateCreated** as the event type. 
1. In the **Filters** tab of the event subscription, choose the following advanced filters.

    ```
    Key = data.resourceInfo.properties.gateType
    Operator = String contains 
    Value = Approval

            AND

    Key = data.resourceInfo.properties.state
    Operator = String contains 
    Value = Pending

            AND

    Key = data.resourceInfo.properties.displayName
    Operator = String contains 
    Value = Check with sales teams

    ```

---

[!INCLUDE [contact-resource-notifications](./includes/contact-resource-notifications.md)]

## Next steps
For detailed information about these events, see [Azure Resource Notifications - AKS Resources events](event-schema-aks-resources.md).
