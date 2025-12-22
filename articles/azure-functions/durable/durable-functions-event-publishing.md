---
title: Durable Functions publishing to Azure Event Grid
description: Learn how to configure automatic Azure Event Grid publishing for Durable Functions.
ms.topic: article
ms.date: 05/11/2020
ms.devlang: csharp
# ms.devlang: csharp, javascript
ms.custom: devx-track-azurecli
---

# Durable Functions publishing to Azure Event Grid

This article shows how to set up Durable Functions to publish orchestration lifecycle events (such as created, completed, and failed) to a custom [Azure Event Grid topic](../../event-grid/overview.md).

Following are some scenarios where this feature is useful:

* **DevOps scenarios like blue/green deployments**: You might want to know if any tasks are running before implementing the [side-by-side deployment strategy](durable-functions-versioning.md#side-by-side-deployments).

* **Advanced monitoring and diagnostics support**: You can keep track of orchestration status information in an external store optimized for queries, such as Azure SQL Database or Azure Cosmos DB.

* **Long-running background activity**: If you use Durable Functions for a long-running background activity, this feature helps you to know the current status.

## Prerequisites

* Install [Microsoft.Azure.WebJobs.Extensions.DurableTask](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.DurableTask) in your Durable Functions project.
* Install the [Azurite storage emulator](../../storage/common/storage-use-azurite.md) or use an existing Azure Storage account.
* Install [Azure CLI](/cli/azure/) or use [Azure Cloud Shell](../../cloud-shell/overview.md)

## Create a custom Event Grid topic

Create an Event Grid topic for sending events from Durable Functions. The following instructions show how to create a topic by using Azure CLI. You can also create the topic by [using PowerShell](../../event-grid/custom-event-quickstart-powershell.md) or by [using the Azure portal](../../event-grid/custom-event-quickstart-portal.md).

### Create a resource group

Create a resource group with the `az group create` command. Currently, Azure Event Grid doesn't support all regions. For information about which regions are supported, see the [Azure Event Grid overview](../../event-grid/overview.md).

```azurecli
az group create --name eventResourceGroup --location westus2
```

### Create a custom topic

An Event Grid topic provides a user-defined endpoint that you post your event to. Replace `<topic_name>` with a unique name for your topic. The topic name must be unique because it becomes a DNS entry.

```azurecli
az eventgrid topic create --name <topic_name> -l westus2 -g eventResourceGroup
```

## Get the endpoint and key

Get the endpoint of the topic. Replace `<topic_name>` with the name you chose.

```azurecli
az eventgrid topic show --name <topic_name> -g eventResourceGroup --query "endpoint" --output tsv
```

Get the topic key if you're using key based authentication. Replace `<topic_name>` with the name you chose.

```azurecli
az eventgrid topic key list --name <topic_name> -g eventResourceGroup --query "key1" --output tsv
```

Now you can send events to the topic.

## Configure Event Grid publishing with key based authentication

In your Durable Functions project, find the `host.json` file.

### Durable Functions 1.x

Add `eventGridTopicEndpoint` and `eventGridKeySettingName` in a `durableTask` property.

```json
{
  "durableTask": {
    "eventGridTopicEndpoint": "https://<topic_name>.westus2-1.eventgrid.azure.net/api/events",
    "eventGridKeySettingName": "EventGridKey"
  }
}
```

### Durable Functions 2.x

Add a `notifications` section to the `durableTask` property of the file, replacing `<topic_name>` with the name you chose. If the `durableTask` or `extensions` properties don't exist, create them like this example:

```json
{
  "version": "2.0",
  "extensions": {
    "durableTask": {
      "notifications": {
        "eventGrid": {
          "topicEndpoint": "https://<topic_name>.westus2-1.eventgrid.azure.net/api/events",
          "keySettingName": "EventGridKey"
        }
      }
    }
  }
}
```

The possible Azure Event Grid configuration properties can be found in the [host.json documentation](../functions-host-json.md#durabletask). After you configure the `host.json` file, your function app sends lifecycle events to the Event Grid topic. This action starts when you run your function app both locally and in Azure.

Set the app setting for the topic key in the Function App and `local.settings.json`. The following JSON is a sample of the `local.settings.json` for local debugging using an Azure Storage emulator. Replace `<topic_key>` with the topic key.  

```json
{
    "IsEncrypted": false,
    "Values": {
        "AzureWebJobsStorage": "UseDevelopmentStorage=true",
        "EventGridKey": "<topic_key>"
    }
}
```

If you're using the [Storage Emulator](../../storage/common/storage-use-emulator.md) instead of a real Azure Storage account, make sure it's running. It's a good idea to clear any existing storage data before executing.

If you're using a real Azure Storage account, replace `UseDevelopmentStorage=true` in `local.settings.json` with its connection string.

## Configure Event Grid publishing with Managed Identity

Managed identities in Azure allow resources to authenticate to Azure services without storing credentials, simplifying security and identity management. _System-assigned_ managed identity is automatically created when you enable it on an Azure resource and is tied to that resource’s lifecycle. If the resource is deleted, the identity is also removed. _User-assigned_ managed identity is created as a standalone Azure resource and can be assigned to multiple resources. It persists independently of any resource, offering flexibility for shared access and centralized identity management. It's recommended that you use user-assigned identity because it's not attached to the lifecycle of the app.

For more information, visit [Use managed identities for App Service and Azure Functions](../../app-service/overview-managed-identity.md).

### System Assigned Identity
To configure system assigned identity follow the instructions below:

#### Configuration
1. Turn on system assigned identity for the function app
    - Go to the function app's **Identity** section and in the **System Assigned** tab, toggle the **Status** switch to on.

      :::image type="content" source="./media/durable-functions-event-publishing/enable-system-assigned-identity.png" alt-text="Screenshot of enabling system assigned identity in the function app." border="true":::

2. In the Event Grid topic resource, give the function app the EventGrid Data Sender role.
    - Go to the **Access Control (IAM)** section, click **+ Add**.

      :::image type="content" source="./media/durable-functions-event-publishing/add-role.png" alt-text="Screenshot of adding a role to event grid topic resource." border="true":::

    - Select the **EventGrid Data Sender** role, click **Next**.

      :::image type="content" source="./media/durable-functions-event-publishing/event-grid-data-sender.png" alt-text="Screenshot of selecting the EventGrid Data Sender Role." border="true":::

    - Choose **Managed Identity** in the **Assign access to** section, click **+ Select Members** in the **Members** section, select the managed identity, then click **Review + Assign**.

      :::image type="content" source="./media/durable-functions-event-publishing/select-managed-identity.png" alt-text="Screenshot of selecting a managed identity." border="true":::


#### App Settings
Add an `EventGrid__topicEndpoint` app setting with the value as the Event Grid topic endpoint.

You can use the following command:
`az functionapp config appsettings set --name <function app name> --resource-group <resource group name> --settings EventGrid__topicEndpoint="<topic endpoint>"`

### User Assigned Identity
To configure user assigned managed identity follow the instructions below:

#### Configuration
1. Create a user assigned managed identity.
    - In the Azure portal, search for _Managed Identities_ in the global search bar. 

    - Create a user assigned managed identity (UAMI) and select **Review + create**.
  
      :::image type="content" source="./media/durable-functions-event-publishing/create-user-assigned-managed-identity.png" alt-text="Screenshot of creating user assigned managed identity." border="true":::

2. Attach the UAMI to the function app resource
     - Go to the function app, **Identity** section, click **Add +**.
  
       :::image type="content" source="./media/durable-functions-event-publishing/function-app-add-user-assigned-managed-identity.png" alt-text="Screenshot of the function app identity section for user assigned managed identity." border="true":::

    - Choose the UAMI created above, then click **Add**.

       :::image type="content" source="./media/durable-functions-event-publishing/function-app-add-specific-user-assigned-managed-identity.png" alt-text="Screenshot of selecting specific user assigned managed identity." border="true":::

3. Attach the UAMI to the event grid topic resource.
    - Go to the event grid topic resource, **Identity** section, choose the **User assigned** tab, then click **Add +**. Choose the user assigned managed identity, then click **Add**.

      :::image type="content" source="./media/durable-functions-event-publishing/add-user-assigned-managed-identity-to-event-grid-topic.png" alt-text="Screenshot of adding a user assigned managed identity to event grid topic." border="true":::

4. Create an Event Grid subscription and select an endpoint.
    - In the **Overview** tab of the Event Grid Topic resource, select **+ Event Subscription**, and create the event subscription.
  
      :::image type="content" source="./media/durable-functions-event-publishing/event-subscription.png" alt-text="Screenshot of the + Event Subscription button." border="true":::

    - Based on the endpoint you choose in **Endpoint Details**, you will see a **Managed Identity for Delivery** section. Choose **User Assigned** for the **Managed Identity** type and select the UAMI.
  
      :::image type="content" source="./media/durable-functions-event-publishing/event-subscription-managed-identity.png" alt-text="Screenshot of adding a user assigned managed identity to event grid subscription." border="true":::

6. In the Event Grid topic resource, assign the **EventGrid Data Sender** role to the UAMI.

    - Go to the **Access Control (IAM)** section, click **+ Add**.

      :::image type="content" source="./media/durable-functions-event-publishing/add-role.png" alt-text="Screenshot of adding a role to an event grid topic resource." border="true":::

    - Select the **EventGrid Data Sender** role, click **Next**.

      :::image type="content" source="./media/durable-functions-event-publishing/event-grid-data-sender.png" alt-text="Screenshot of selecting the EventGrid Data Sender Role." border="true":::

    - Choose **Managed Identity** in the **Assign access to** section, click **+ Select Members** in the **Members** section, select the UAMI, then click **Review + Assign**.

      :::image type="content" source="./media/durable-functions-event-publishing/select-managed-identity.png" alt-text="Screenshot of selecting a managed identity." border="true":::

#### App Settings
- Add an `EventGrid__topicEndpoint` app setting with the value as the Event Grid topic endpoint.
- Add an `EventGrid__credential` app setting with the value `managedidentity`.
- Add an `EventGrid__clientId` app setting with the value of the user assigned managed identity client ID.

## Create functions that listen for events

Using the Azure portal, create another function app to listen for events published by your Durable Functions app. It's best to locate it in the same region as the Event Grid topic.

### Create an Event Grid trigger function

1. In your function app, select **Functions**, and then select **+ Add** 

   :::image type="content" source="./media/durable-functions-event-publishing/function-add-function.png" alt-text="Add a function in the Azure portal." border="true":::

1. Search for **Event Grid**, and then select the **Azure Event Grid trigger** template. 

    :::image type="content" source="./media/durable-functions-event-publishing/function-select-event-grid-trigger.png" alt-text="Select the Event Grid trigger template in the Azure portal." border="true":::

1. Name the new trigger, and then select **Create Function**.

    :::image type="content" source="./media/durable-functions-event-publishing/function-name-event-grid-trigger.png" alt-text="Name the Event Grid trigger in the Azure portal." border="true":::


    A function with the following code is created:

    # [C# Script](#tab/csharp-script)

    ```csharp
    #r "Newtonsoft.Json"
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;
    using Microsoft.Extensions.Logging;

    public static void Run(JObject eventGridEvent, ILogger log)
    {
        log.LogInformation(eventGridEvent.ToString(Formatting.Indented));
    }
    ```

   # [JavaScript](#tab/javascript)

   ```javascript
   module.exports = async function(context, eventGridEvent) {
       context.log(typeof eventGridEvent);
       context.log(eventGridEvent);
   }
   ```

---

### Add an Event Grid subscription

You can now add an Event Grid subscription for the Event Grid topic that you created. For more information, see [Concepts in Azure Event Grid](../../event-grid/concepts.md).

1. In your new function, select **Integration** and then select **Event Grid Trigger (eventGridEvent)**. 

    :::image type="content" source="./media/durable-functions-event-publishing/eventgrid-trigger-link.png" alt-text="Select the Event Grid Trigger link." border="true":::

1. Select **Create Event Grid Description**.

    :::image type="content" source="./media/durable-functions-event-publishing/create-event-grid-subscription.png" alt-text="Create the Event Grid subscription." border="true":::

1. Name your event subscription and select the **Event Grid Topics** topic type. 

1. Select the subscription. Then, select the resource group and resource that you created for the Event Grid topic. 

1. Select **Create**.

    :::image type="content" source="./media/durable-functions-event-publishing/event-grid-subscription-details.png" alt-text="Create an Event Grid subscription." border="true":::

Now you're ready to receive lifecycle events.

## Run Durable Functions app to send the events

In the Durable Functions project that you configured earlier, start debugging on your local machine and start an orchestration. The app publishes Durable Functions lifecycle events to Event Grid. Verify that Event Grid triggers the listener function you created by checking its logs in the Azure portal.

```
2019-04-20T09:28:21.041 [Info] Function started (Id=3301c3ef-625f-40ce-ad4c-9ba2916b162d)
2019-04-20T09:28:21.104 [Info] {
    "id": "054fe385-c017-4ce3-b38a-052ac970c39d",
    "subject": "durable/orchestrator/Running",
    "data": {
        "hubName": "DurableFunctionsHub",
        "functionName": "Sample",
        "instanceId": "055d045b1c8a415b94f7671d8df693a6",
        "reason": "",
        "runtimeStatus": "Running"
    },
    "eventType": "orchestratorEvent",
    "eventTime": "2019-04-20T09:28:19.6492068Z",
    "dataVersion": "1.0",
    "metadataVersion": "1",
    "topic": "/subscriptions/<your_subscription_id>/resourceGroups/eventResourceGroup/providers/Microsoft.EventGrid/topics/durableTopic"
}

2019-04-20T09:28:21.104 [Info] Function completed (Success, Id=3301c3ef-625f-40ce-ad4c-9ba2916b162d, Duration=65ms)
2019-04-20T09:28:37.098 [Info] Function started (Id=36fadea5-198b-4345-bb8e-2837febb89a2)
2019-04-20T09:28:37.098 [Info] {
    "id": "8cf17246-fa9c-4dad-b32a-5a868104f17b",
    "subject": "durable/orchestrator/Completed",
    "data": {
        "hubName": "DurableFunctionsHub",
        "functionName": "Sample",
        "instanceId": "055d045b1c8a415b94f7671d8df693a6",
        "reason": "",
        "runtimeStatus": "Completed"
    },
    "eventType": "orchestratorEvent",
    "eventTime": "2019-04-20T09:28:36.5061317Z",
    "dataVersion": "1.0",
    "metadataVersion": "1",
    "topic": "/subscriptions/<your_subscription_id>/resourceGroups/eventResourceGroup/providers/Microsoft.EventGrid/topics/durableTopic"
}
2019-04-20T09:28:37.098 [Info] Function completed (Success, Id=36fadea5-198b-4345-bb8e-2837febb89a2, Duration=0ms)
```

## Event Schema

The following list explains the lifecycle events schema:

* **`id`**: Unique identifier for the Event Grid event.
* **`subject`**: Path to the event subject. `durable/orchestrator/{orchestrationRuntimeStatus}`. `{orchestrationRuntimeStatus}` will be `Running`, `Completed`, `Failed`, and `Terminated`.  
* **`data`**: Durable Functions Specific Parameters.
  * **`hubName`**: [TaskHub](durable-functions-task-hubs.md) name.
  * **`functionName`**: Orchestrator function name.
  * **`instanceId`**: Durable Functions instanceId.
  * **`reason`**: Additional data associated with the tracking event. For more information, see [Diagnostics in Durable Functions (Azure Functions)](durable-functions-diagnostics.md)
  * **`runtimeStatus`**: Orchestration Runtime Status. Running, Completed, Failed, Canceled.
* **`eventType`**: "orchestratorEvent"
* **`eventTime`**: Event time (UTC).
* **`dataVersion`**: Version of the lifecycle event schema.
* **`metadataVersion`**:  Version of the metadata.
* **`topic`**: Event Grid topic resource.

## How to test locally

To test locally, read [Local testing with viewer web app](../event-grid-how-tos.md#local-testing-with-viewer-web-app).

## Next steps

> [!div class="nextstepaction"]
> [Learn instance management in Durable Functions](durable-functions-instance-management.md)

> [!div class="nextstepaction"]
> [Learn versioning in Durable Functions](durable-functions-versioning.md)
