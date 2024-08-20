---
title: Create the pre and post maintenance configuration events in Azure Update Manager
description: The article provides the steps to create the pre and post maintenance events in Azure Update Manager.
ms.service: azure-update-manager
ms.date: 07/24/2024
ms.topic: how-to
ms.author: sudhirsneha
author: SnehaSudhirG
zone_pivot_groups: create-pre-post-events-maintenance-configuration
---

# Create pre and post events

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure Arc-enabled servers :heavy_check_mark: Azure VMs.

Pre and post events allows you to execute user-defined actions before and after the scheduled maintenance configuration. For more information, go through the [workings of a pre and post event in Azure Update Manager](pre-post-scripts-overview.md).

This article describes on how to create pre and post events in Azure Update Manager.

## Event Grid in schedule maintenance configurations

Azure Update Manager leverages Event Grid to create and manage pre and post events. For more information, go through the [overview of Event Grid](../event-grid/overview.md). To trigger an event either before or after a schedule maintenance window, you require the following:

1. **Schedule maintenance configuration** - You can create Pre and post events for a schedule maintenance configuration in Azure Update Manager. For more information, see [schedule updates using maintenance configurations](scheduled-patching.md).
1. **Action to be performed in the pre or post event** - You can use the [Event handlers](../event-grid/event-handlers.md) (Endpoints) supported by Event Grid to define actions or tasks. Here are examples on how to create Azure Automation Runbooks via Webhooks and Azure Functions. Within these Event handlers/Endpoints, you must define the actions that should be performed as part of pre and post events. 
    1. **Webhook** - [Create a PowerShell 7.2 Runbook](../automation/automation-runbook-types.md#powershell-runbooks) and [link the Runbook to a webhook](../automation/automation-webhooks.md).
    1. **Azure Function** - [Create an Azure Function](../azure-functions/functions-create-function-app-portal.md).
1. **Pre and post event** - You can follow the steps shared in the following section to create a pre and post event for schedule maintenance configuration. To learn more about the terms used in the Basics tab of Event Grid, see [Event Grid](../event-grid/concepts.md) terms.


## Create a pre and post event 

::: zone pivot="new-mc"

### Create pre and post events while creating a new schedule maintenance configuration

#### [Using Azure portal](#tab/portal)

1. Sign in to the [Azure portal](https://portal.azure.com/) and go to **Azure Update Manager**.
2. Under **Manage**, select **Machines**.
3. Select **Schedule updates** from the ribbon at the top.
4. In the **Create a maintenance configuration** page, select the **Events** tab.
5. Select **+Event Subscription** to create pre/post event.
6. On the **Add Event Subscription** page, enter the following details:
In the **Event Subscription Details** section, provide an appropriate name.
   - Keep the schema as **Event Grid Schema**.
   - Enter the **System Topic Name** for the first event you create in this maintenance configuration. The same System Topic name will be auto populated for the consequent events.
   - In the **Event Types** section, **Filter to Event Types**, select the event types that you want to get pushed to the endpoint or destination. You can select either **Pre Maintenance Event** or **Post Maintenance Event** or both. To learn more about event types that are specific to schedule maintenance configurations, see [Azure Event Types](../event-grid/event-schema-maintenance-configuration.md).
   - In the **Endpoint details** section, select the endpoint where you want to receive the response from.
7. Select **Add** to create the pre and post events for the schedule upon its creation.

    :::image type="content" source="./media/manage-pre-post-events/add-event-subscription.png" alt-text="Screenshot that shows how to add an event subscription." lightbox="./media/manage-pre-post-events/add-event-subscription.png"::: 

> [!NOTE]
> In the above flow, Webhook and Azure Functions are the two Event handlers/endpoints you can choose from. When you select **Add**, the event subscription is not created but added to the maintenance configuration. Event subscription is created along with the schedule maintenance configuration.

#### [Using PowerShell](#tab/powershell)

1. Create a maintenance configuration by following the steps listed [here](/azure/virtual-machines/maintenance-configurations-powershell#guest).

1. ```powershell-interactive
    # Obtain the Maintenance Configuration ID from Step 1 and assign it to MaintenanceConfigurationResourceId variable  
    
    $MaintenanceConfigurationResourceId = "/subscriptions/<subId>/resourceGroups/<Resource group>/providers/Microsoft.Maintenance/maintenanceConfigurations/<Maintenance configuration Name>"
    
    # Use the same Resource Group that you used to create maintenance configuration in Step 1
    
    $ResourceGroupForSystemTopic = "<Resource Group for System Topic>"
    
    $SystemTopicName = "<System topic name>"
    
    $TopicType = "Microsoft.Maintenance.MaintenanceConfigurations"
    
    $SystemTopicLocation = "<System topic location>"
    
    # System topic creation
    
    New-AzEventGridSystemTopic -ResourceGroupName $ResourceGroupForSystemTopic -Name $SystemTopicName -Source $MaintenanceConfigurationResourceId -TopicType $TopicType -Location $SystemTopicLocation
    
    # Event subscription creation
    
    $IncludedEventTypes = @("Microsoft.Maintenance.PreMaintenanceEvent")
    
    # Webhook
    
    $EventSubscriptionName = "PreEventWebhook"
    
    $PreEventWebhookEndpoint = "<Webhook URL>"
    
    New-AzEventGridSystemTopicEventSubscription -ResourceGroupName $ResourceGroupForSystemTopic -SystemTopicName $SystemTopicName -EventSubscriptionName $EventSubscriptionName -Endpoint $PreEventWebhookEndpoint -IncludedEventType $IncludedEventTypes
    
    # Azure Function
    
    $dest = New-AzEventGridAzureFunctionEventSubscriptionDestinationObject -ResourceId "<Azure Function Resource Id>"
    
    New-AzEventGridSystemTopicEventSubscription -ResourceGroupName $ResourceGroupForSystemTopic -SystemTopicName $SystemTopicName -EventSubscriptionName $EventSubscriptionName -Destination $dest -IncludedEventType $IncludedEventTypes

   ```

#### [Using CLI](#tab/cli)

1. Create a maintenance configuration by following the steps listed [here](/azure/virtual-machines/maintenance-configurations-cli#guest-vms).

1. ```azurecli-interactive

    SystemTopicName="<System topic name> 

    # Use the same Resource Group that you used to create maintenance configuration in Step 1
    
    ResourceGroupName="<Resource Group mentioned in Step 1>"
    
    # Obtain the Maintenance Configuration ID from Step 1 and assign it to Source variable
    
    Source="/subscriptions/<subId>/resourceGroups/<Resource group>/providers/Microsoft.Maintenance/maintenanceConfigurations/<Maintenance configuration Name>"
    
    TopicType="Microsoft.Maintenance.MaintenanceConfigurations"
    
    Location="<System topic location> "
    
    # System topic creation
    
    az eventgrid system-topic create --name $SystemTopicName --resource-group $ResourceGroupName --source $Source --topic-type $TopicType --location $Location
    
    # Event subscription creation
    
    IncludedEventTypes='("Microsoft.Maintenance.PreMaintenanceEvent")'
    
    # Webhook
    
    az eventgrid system-topic event-subscription create --name "<Event subscription name>" --resource-group $ResourceGroupName --system-topic-name $SystemTopicName --endpoint-type webhook --endpoint "<webhook URL>" --included-event-types IncludedEventTypes
    
    # Azure Function
    
    az eventgrid system-topic event-subscription create –name "<Event subscription name>" --resource-group $ResourceGroupName --system-topic-name $SystemTopicName --endpoint-type azurefunction --endpoint "<Azure Function ResourceId>" --included-event-types IncludedEventTypes
    
   ```

#### [Using API](#tab/api)

1. Create a maintenance configuration by following the steps listed [here](/rest/api/maintenance/maintenance-configurations/create-or-update?view=rest-maintenance-2023-09-01-preview&tabs=HTTP).

1. **# System topic creation [Learn more](/rest/api/eventgrid/controlplane/system-topics/create-or-update)**

    ```rest
    PUT /subscriptions/<subscription Id>/resourceGroups/<resource group name>/providers/Microsoft.EventGrid/systemTopics/<system topic name>?api-version=2022-06-15
    ```
     
    Request Body:
    ```
    {
      "properties": {
        "source": "/subscriptions/<subscription Id>/resourceGroups/<resource group>/providers/Microsoft.Maintenance/maintenanceConfigurations/<maintenance configuration name> ",
        "topicType": "Microsoft.Maintenance.MaintenanceConfigurations"
      },
      "location": "<location>"
    }
    ```
    
    **# Event subscription creation [Learn more](/rest/api/eventgrid/controlplane/system-topic-event-subscriptions/create-or-update)**
    
    Allowed Event types - Microsoft.Maintenance.PreMaintenanceEvent, Microsoft.Maintenance.PostMaintenanceEvent
     
    **Webhook**
     
    ```rest
    PUT /subscriptions/<subscription Id>/resourceGroups/<resource group name>/providers/Microsoft.EventGrid/systemTopics/<system topic name>/eventSubscriptions/<Event Subscription name>?api-version=2022-06-15
    ```
     
    Request Body:
    
    ```
    {
      "properties": {
        "destination": {
          "endpointType": "WebHook",
          "properties": {
            "endpointUrl": "<Webhook URL>"
          }
        },
        "filter": {
          "includedEventTypes": [
            "Microsoft.Maintenance.PreMaintenanceEvent"
          ]
        }
      }
    }
    ```
    **Azure Function**
    
    ```rest
    PUT /subscriptions/<subscription Id>/resourceGroups/<resource group name>/providers/Microsoft.EventGrid/systemTopics/<system topic name>/eventSubscriptions/<Event Subscription name>?api-version=2022-06-15
    ```
     
    **Request Body**
    ```
    {
        "properties": {
            "destination": {
                "endpointType": "AzureFunction",
                "properties": {
                    "resourceId": "<Azure Function Resource Id>"
                }
            }
        },
        "filter": {
            "includedEventTypes": [
                "Microsoft.Maintenance.PostMaintenanceEvent"
            ]
        }
    }
    ```
   ---

:::zone-end

::: zone pivot="existing-mc"

### Create pre and post events on an existing schedule maintenance configuration

#### [Using Azure portal](#tab/az-portal)

1. Sign in to the [Azure portal](https://portal.azure.com) and go to **Azure Update Manager**.
1. Under **Manage**, select **Machines**, **Maintenance Configurations**.
1. In the **Maintenance Configuration** page, select the maintenance configuration to which you want to add a pre and post event.
1. In the selected **Maintenance configuration** page, under **Settings**, select **Events**. Alternatively, under the **Overview**, select the card **Create a maintenance event**.
   
   :::image type="content" source="./media/manage-pre-post-events/create-maintenance-event-inline.png" alt-text="Screenshot that shows the options to select to create a maintenance event." lightbox="./media/manage-pre-post-events/create-maintenance-event-expanded.png":::
   
1. Select **+Event Subscription** to create Pre/Post Maintenance Event.

    :::image type="content" source="./media/manage-pre-post-events/maintenance-events-inline.png" alt-text="Screenshot that shows the maintenance events." lightbox="./media/manage-pre-post-events/maintenance-events-expanded.png":::

1. On the **Create Event Subscription** page, enter the following details:
    - In the **Event Subscription Details** section, provide an appropriate name. 
    - Keep the schema as **Event Grid Schema**.
    - In the **Topic Details** section, provide an appropriate name to the **System Topic Name**.
    - In the **Event Types** section, **Filter to Event Types**, select the event types that you want to get pushed to the endpoint or destination. You can select between **Pre Maintenance Event** and **Post Maintenance Event**. To learn more about event types that are specific to schedule maintenance configurations, see [Azure Event Types](../event-grid/event-schema-maintenance-configuration.md).
    - In the **Endpoint details** section, select the endpoint from where you want to receive the response from. 
       
      :::image type="content" source="./media/manage-pre-post-events/create-event-subscription.png" alt-text="Screenshot on how to create event subscription.":::

1. Select **Create** to configure the pre and post events on an existing schedule.  

#### [Using PowerShell](#tab/az-powershell)


```powershell-interactive
    $MaintenanceConfigurationResourceId = "/subscriptions/<subId>/resourceGroups/<Resource group>/providers/Microsoft.Maintenance/maintenanceConfigurations/<Maintenance configuration Name>"
    
    $ResourceGroupForSystemTopic = "<Resource Group for System Topic>"
    
    $SystemTopicName = "<System topic name>"
    
    $TopicType = "Microsoft.Maintenance.MaintenanceConfigurations"
    
    $SystemTopicLocation = "<System topic location>"
 
    # System topic creation
    
    New-AzEventGridSystemTopic -ResourceGroupName $ResourceGroupForSystemTopic -Name $SystemTopicName -Source $MaintenanceConfigurationResourceId -TopicType $TopicType -Location $SystemTopicLocation
 
    # Event subscription creation
    
    $IncludedEventTypes = @("Microsoft.Maintenance.PreMaintenanceEvent")
 
    # Webhook
    
    $EventSubscriptionName = "PreEventWebhook"
    
    $PreEventWebhookEndpoint = "<Webhook URL>"
    
    New-AzEventGridSystemTopicEventSubscription -ResourceGroupName $ResourceGroupForSystemTopic -SystemTopicName $SystemTopicName -EventSubscriptionName $EventSubscriptionName -Endpoint $PreEventWebhookEndpoint -IncludedEventType $IncludedEventTypes
 
    # Azure Function
    
    $dest = New-AzEventGridAzureFunctionEventSubscriptionDestinationObject -ResourceId "<Azure Function Resource Id>"
    
    New-AzEventGridSystemTopicEventSubscription -ResourceGroupName $ResourceGroupForSystemTopic -SystemTopicName $SystemTopicName -EventSubscriptionName $EventSubscriptionName -Destination $dest -IncludedEventType $IncludedEventTypes
```

#### [Using CLI](#tab/az-cli)

```azurecli-interactive

   SystemTopicName="<System topic name> 

   ResourceGroupName="<Resource Group for System Topic>"

   Source="/subscriptions/<subId>/resourceGroups/<Resource group>/providers/Microsoft.Maintenance/maintenanceConfigurations/<Maintenance configuration Name>"
   
    TopicType="Microsoft.Maintenance.MaintenanceConfigurations"
    
    Location="<System topic location> "
 
   # System topic creation
     
    az eventgrid system-topic create --name $SystemTopicName --resource-group $ResourceGroupName --source $Source --topic-type $TopicType --location $Location
 
   # Event subscription creation
   
    IncludedEventTypes='("Microsoft.Maintenance.PreMaintenanceEvent")'
 
   # Webhook
   
    az eventgrid system-topic event-subscription create --name "<Event subscription name>" --resource-group $ResourceGroupName --system-topic-name $SystemTopicName --endpoint-type webhook --endpoint "<webhook URL>" --included-event-types IncludedEventTypes
 
   # Azure Function
   
    az eventgrid system-topic event-subscription create –name "<Event subscription name>" --resource-group $ResourceGroupName --system-topic-name $SystemTopicName --endpoint-type azurefunction --endpoint "<Azure Function ResourceId>" --included-event-types IncludedEventTypes
```
#### [Using API](#tab/az-api)

**# System topic creation [Learn more](/rest/api/eventgrid/controlplane/system-topics/create-or-update)**

```rest
PUT /subscriptions/<subscription Id>/resourceGroups/<resource group name>/providers/Microsoft.EventGrid/systemTopics/<system topic name>?api-version=2022-06-15
```
 
Request Body:
```
{
  "properties": {
    "source": "/subscriptions/<subscription Id>/resourceGroups/<resource group>/providers/Microsoft.Maintenance/maintenanceConfigurations/<maintenance configuration name> ",
    "topicType": "Microsoft.Maintenance.MaintenanceConfigurations"
  },
  "location": "<location>"
}
```

**# Event subscription creation [Learn more](/rest/api/eventgrid/controlplane/system-topic-event-subscriptions/create-or-update)**

Allowed Event types - Microsoft.Maintenance.PreMaintenanceEvent, Microsoft.Maintenance.PostMaintenanceEvent
 
**Webhook**
 
```rest
PUT /subscriptions/<subscription Id>/resourceGroups/<resource group name>/providers/Microsoft.EventGrid/systemTopics/<system topic name>/eventSubscriptions/<Event Subscription name>?api-version=2022-06-15
```
 
Request Body:

```
{
  "properties": {
    "destination": {
      "endpointType": "WebHook",
      "properties": {
        "endpointUrl": "<Webhook URL>"
      }
    },
    "filter": {
      "includedEventTypes": [
        "Microsoft.Maintenance.PreMaintenanceEvent"
      ]
    }
  }
}
```
**Azure Function**

```rest
PUT /subscriptions/<subscription Id>/resourceGroups/<resource group name>/providers/Microsoft.EventGrid/systemTopics/<system topic name>/eventSubscriptions/<Event Subscription name>?api-version=2022-06-15
```
 
**Request Body**
```
{
    "properties": {
        "destination": {
            "endpointType": "AzureFunction",
            "properties": {
                "resourceId": "<Azure Function Resource Id>"
            }
        }
    },
    "filter": {
        "includedEventTypes": [
            "Microsoft.Maintenance.PostMaintenanceEvent"
        ]
    }
}
```
---

:::zone-end


## Next steps
- For an overview of pre and post events in Azure Update Manager, refer [here](pre-post-scripts-overview.md).
- To learn on how to manage pre and post events or to cancel a schedule run, see [pre and post maintenance configuration events](manage-pre-post-events.md).
- To learn how to use pre and post events to turn on and off your VMs using Webhooks, refer [here](tutorial-webhooks-using-runbooks.md).
- To learn how to use pre and post events to turn on and off your VMs using Azure Functions, refer [here](tutorial-using-functions.md).

