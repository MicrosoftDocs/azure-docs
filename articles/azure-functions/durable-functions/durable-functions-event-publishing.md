---
author: hhunter-ms
ms.author: hannahhunter
title: "Configure Durable Functions Publishing to Azure Event Grid"
description: "Learn how to configure automatic Azure Event Grid publishing for Durable Functions orchestration lifecycle events. Set up managed identity, create custom topics, and verify event delivery in this step-by-step guide."
ms.topic: how-to
ms.service: azure-functions
ms.date: 01/22/2026
ms.devlang: csharp
# ms.devlang: csharp, javascript
ms.custom: devx-track-azurecli
---

# Configure Durable Functions publishing to Azure Event Grid

Publishing orchestration lifecycle events to [Azure Event Grid](../../event-grid/overview.md) enables DevOps automation (such as blue/green deployments), real-time monitoring dashboards, and tracking of long-running background processes.

> [!NOTE]
> This guide uses .NET examples, but the concepts and Azure CLI commands apply to all supported Durable Functions languages.

> [!TIP]
> If you already have an Event Grid custom topic and managed identity configured, skip to [Configure the Durable Functions publisher app](#configure-the-durable-functions-publisher-app).

## Prerequisites

- A Durable Functions project deployed to Azure. If you don't have one, create one using the quickstart for your preferred language:
  - [C# (isolated worker model)](./durable-functions-isolated-create-first-csharp.md) | [JavaScript](./quickstart-js-vscode.md) | [Python](./quickstart-python-vscode.md) | [PowerShell](./quickstart-powershell-vscode.md) | [Java](./quickstart-java.md)
- The correct Durable Functions extension version. For .NET, update your extension to the latest version:
    - **2.7.0+** (in-process)  
       ```bash
       dotnet add package Microsoft.Azure.WebJobs.Extensions.DurableTask
       ```
       
    - **1.1.0+** (isolated worker)  
       ```bash
       dotnet add package Microsoft.Azure.Functions.Worker.Extensions.DurableTask
       ```

   For other languages, check your `package.json`, `requirements.txt`, `pom.xml`, or `requirements.psd1`.

- Managed identity [enabled](../../app-service/overview-managed-identity.md) and [configured](./durable-functions-configure-managed-identity.md) on your function app.
- A [running storage provider](../../durable-task/common/durable-task-storage-providers.md) or the local [Azurite storage emulator](../../storage/common/storage-use-azurite.md).
- [Azure CLI](/cli/azure/) or [Azure Cloud Shell](../../cloud-shell/overview.md).
- An [HTTP test tool](../functions-develop-local.md#http-test-tools) that keeps your data secure.

## Create a custom Event Grid topic

You can create an Event Grid topic for sending events from Durable Functions by using [the Azure CLI](../../event-grid/custom-event-quickstart.md), [PowerShell](../../event-grid/custom-event-quickstart-powershell.md), or [the Azure portal](../../event-grid/custom-event-quickstart-portal.md). 

This guide uses the Azure CLI.

### Create a resource group

Create a resource group with the `az group create` command. Pick a location that supports Event Grid and matches where you want to deploy your resources.

> [!NOTE]
> Currently, Azure Event Grid doesn't support all regions. For information about which regions are supported, see the [Azure Event Grid overview](../../event-grid/overview.md).

```azurecli
az group create --name <resource-group-name> --location <location>
```

[!INCLUDE [register-provider-cli.md](../../event-grid/includes/register-provider-cli.md)]

### Create a custom topic

An Event Grid topic provides a user-defined endpoint that you post your event to. Replace `<topic-name>` in the following command with a unique name for your topic. The topic name must be unique because it becomes a DNS entry.

```azurecli
az eventgrid topic create --name <topic-name> --location <location> --resource-group <resource-group-name>
```

## Get the topic endpoint

Get the endpoint of the topic. Replace `<topic-name>` in the following commands with the name you chose.

```azurecli
az eventgrid topic show --name <topic-name> --resource-group <resource-group-name> --query "endpoint" --output tsv
```

Save this endpoint for later.

## Configure Event Grid publishing with Managed Identity (recommended)

Managed identities in Azure allow resources to authenticate to Azure services without storing credentials, simplifying security and identity management. [Assign the managed identity associated with your Durable Function app to your Event Grid custom topic.](../../event-grid/enable-identity-custom-topics-domains.md#enable-identity-for-an-existing-custom-topic-or-domain)

### Configure the Durable Functions publisher app

Although your Durable Functions app automatically publishes orchestration lifecycle events to Event Grid, you need to configure the connection settings. Add the following to the `extensions.durableTask` section in your `host.json`:

```json
{
  "version": "2.0",
  "extensions": {
    "durableTask": {
      "eventGridTopicEndpoint": "%EventGrid__topicEndpoint%",
      "eventGridKeySettingName": "EventGrid__credential"
    }
  }
}
```

> [!NOTE]
> The `eventGridTopicEndpoint` setting references the Event Grid custom topic endpoint you saved earlier. The credential setting handles both managed identity and connection string scenarios.

### Assign Event Grid Data Sender role

Grant your [managed identity](../../app-service/overview-managed-identity.md) permission to publish events to the Event Grid topic.

# [User-assigned managed identity](#tab/user-assigned-role)

```azurecli
az role assignment create \
  --assignee <client-id-of-managed-identity> \
  --assignee-principal-type ServicePrincipal \
  --role "EventGrid Data Sender" \
  --scope /subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.EventGrid/topics/<topic-name>
```

Replace the following values:
- `<client-id-of-managed-identity>`: The client ID of your user-assigned managed identity
- `<subscription-id>`: Your Azure subscription ID
- `<resource-group-name>`: The name of the resource group containing your Event Grid topic
- `<topic-name>`: The name of your Event Grid topic

# [System-assigned managed identity](#tab/system-assigned-role)

```azurecli
az role assignment create \
  --assignee-object-id <object-id-of-function-app-identity> \
  --assignee-principal-type ServicePrincipal \
  --role "EventGrid Data Sender" \
  --scope /subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.EventGrid/topics/<topic-name>
```

To get the `<object-id-of-function-app-identity>`:

```azurecli
az functionapp identity show \
  --name <function-app-name> \
  --resource-group <resource-group-name> \
  --query principalId --output tsv
```

---

> [!NOTE]
> Role assignments can take 5-10 minutes to propagate. You may see authentication errors if you proceed immediately after assignment.

### Configure app settings

Once you've enabled managed identity for your function app and topic, configure the Event Grid app settings on your Durable Functions function app.

# [User-assigned identity (recommended)](#tab/user-assigned-settings)

Add the following app settings:
- `EventGrid__topicEndpoint` — the Event Grid topic endpoint.
- `EventGrid__credential` — set to `managedidentity`.
- `EventGrid__clientId` — the user-assigned managed identity client ID.

```azurecli
az functionapp config appsettings set --name <function app name> --resource-group <resource group name> --settings EventGrid__topicEndpoint="<topic endpoint>" EventGrid__credential="managedidentity" EventGrid__clientId="<client id>"
```

# [System-assigned identity](#tab/system-assigned-settings)

Add an `EventGrid__topicEndpoint` app setting with the value as the Event Grid topic endpoint.

```azurecli
az functionapp config appsettings set --name <function app name> --resource-group <resource group name> --settings EventGrid__topicEndpoint="<topic endpoint>"
```

---

## Subscribe to events

To receive the published lifecycle events, create an [Event Grid subscription](../../event-grid/concepts.md) that routes events from your custom topic to a subscriber. Common subscriber types include Azure Functions (with an Event Grid trigger), Logic Apps, and webhooks.

The following example creates a subscriber function app with an Event Grid trigger using the Azure CLI. If you already have a subscriber, skip to [Create an Event Grid subscription](#create-an-event-grid-subscription).

### Create a listener function app

Create a function app to host the Event Grid trigger. The listener must be in the same region as the Event Grid topic.

```azurecli
# Create a resource group
az group create --name <listener-resource-group-name> --location <location>

# Create a storage account
az storage account create \
  --name <storage-account-name> \
  --resource-group <listener-resource-group-name> \
  --location <location> \
  --sku Standard_LRS \
  --allow-blob-public-access false

# Create the function app
az functionapp create \
  --resource-group <listener-resource-group-name> \
  --consumption-plan-location <location> \
  --runtime <preferred-runtime> \
  --functions-version 4 \
  --name <listener-function-app-name> \
  --storage-account <storage-account-name>
```

### Create and deploy an Event Grid trigger function

Scaffold a local project, add an Event Grid trigger, and publish it:

```bash
mkdir EventGridListenerFunction && cd EventGridListenerFunction
func init --name EventGridListener --runtime dotnet-isolated
func new --template "Event Grid trigger" --name EventGridTrigger
func azure functionapp publish <listener-function-app-name>
```

> [!NOTE]
> Replace `dotnet-isolated` with your preferred runtime (`node`, `python`, `java`, or `powershell`). For detailed deployment instructions, see [Publish to Azure](../functions-run-local.md#publish).

### Create an Event Grid subscription

Create the subscription using the `azurefunction` endpoint type, which automatically handles webhook validation:

```azurecli
az eventgrid event-subscription create \
  --name <subscription-name> \
  --source-resource-id /subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.EventGrid/topics/<topic-name> \
  --endpoint /subscriptions/<subscription-id>/resourceGroups/<listener-resource-group-name>/providers/Microsoft.Web/sites/<listener-function-app-name>/functions/EventGridTrigger \
  --endpoint-type azurefunction
```

> [!TIP]
> Using `--endpoint-type azurefunction` with the function's resource ID is the recommended approach. It automatically handles webhook validation and is more reliable than using `--endpoint-type webhook` with a URL.

## Event schema

When an orchestration state changes, the Durable Functions runtime publishes an event with the following structure. Events are generated automatically for each state transition — you don't need to add any code.

| Field | Description |
| --- | --- |
| `id` | Unique identifier for the Event Grid event. |
| `subject` | `durable/orchestrator/{orchestrationRuntimeStatus}` — the status can be `Running`, `Completed`, `Failed`, or `Terminated`. |
| `eventType` | Always `orchestratorEvent`. |
| `eventTime` | Event time (UTC). |
| `data.hubName` | [TaskHub](../../durable-task/common/durable-task-hubs.md) name. |
| `data.functionName` | Orchestrator function name. |
| `data.instanceId` | Unique orchestration instance ID. |
| `data.runtimeStatus` | `Running`, `Completed`, `Failed`, or `Canceled`. |
| `data.reason` | Additional tracking data. For more information, see [Diagnostics in Durable Functions](durable-functions-diagnostics.md). |

Event Grid ensures at-least-once delivery, so you may receive duplicate events in rare failure scenarios. Consider adding deduplication logic using the `instanceId` if needed.

## Verify event delivery

To verify the end-to-end setup, deploy your Durable Functions app and trigger an orchestration:

1. [Publish the function code to Azure](../functions-develop-vs-code.md#publish-to-azure) and verify your function app shows "Running" in the Azure portal.
1. In the Azure portal, verify your app settings under **Settings** > **Environment variables** include `EventGrid__topicEndpoint` and (if using managed identity) `EventGrid__credential`.
1. Trigger an orchestration using an HTTP client:

   ```bash
   curl -X POST https://<function_app_name>.azurewebsites.net/api/HelloOrchestration_HttpStart
   ```

1. In the Azure portal, navigate to your **listener function app** > **EventGridTrigger** > **Monitor** to view received events. You should see events with subjects like `durable/orchestrator/Running` and `durable/orchestrator/Completed`.

### Verify in Application Insights (optional)

For a more comprehensive view, run this KQL query in your function app's Application Insights **Logs**:

```kusto
traces
| where message contains "Event type" or message contains "Event subject"
| project timestamp, message
| order by timestamp desc
```

## Troubleshooting

### Events are not being published to Event Grid

**Problem**: The listener function is not receiving events.

**Solutions**:
- Verify the Durable Functions function app has the correct app settings:
  - `EventGrid__topicEndpoint` must point to your custom topic endpoint
  - `EventGrid__credential` must be set to `managedidentity`
  - `EventGrid__clientId` must be set if using a user-assigned identity
- Verify the managed identity has the **EventGrid Data Sender** role assigned to the Event Grid custom topic.
- Check the Durable Functions function app logs in Application Insights for errors.
- Verify the Event Grid topic exists and is accessible in the same subscription.

### Listener function is not being triggered

**Problem**: The listener function exists but isn't executing when events are published.

**Solutions**:
- Verify the Event Grid subscription was created and is enabled:
  - In the Azure portal, navigate to your Event Grid topic → **Subscriptions**
  - Confirm your listener function's subscription is listed with status **Enabled**
- Verify the Event Grid subscription is using the correct endpoint type:
  - For Azure Functions, use `--endpoint-type azurefunction` with the function's resource ID
  - If you used `--endpoint-type webhook`, ensure the webhook URL is in the correct format: `https://<function-app>.azurewebsites.net/runtime/webhooks/eventgrid?functionName=<function-name>&code=<system-key>`
- Check the listener function app logs for errors or delivery issues.
- In the Event Grid topic → **Metrics**, check for **Dropped Events** which may indicate delivery failures.

### "Forbidden" or authentication errors in logs

**Problem**: Authentication errors when publishing to Event Grid.

**Solutions**:
- Verify the managed identity is properly configured and enabled on the Durable Functions function app:
  - In the Azure portal, navigate to your function app → **Identity**
  - Confirm "Status" shows **On** for either system-assigned or user-assigned identity
- Verify the role assignment is correct:
  - Navigate to your Event Grid topic → **Access Control (IAM)**
  - Confirm your managed identity has the **EventGrid Data Sender** role (note: no space between "Event" and "Grid")
  - The role assignment may take 5-10 minutes to propagate

### "Connection refused" or "endpoint not found" errors

**Problem**: Connection errors to the Event Grid topic.

**Solutions**:
- Verify the Event Grid topic endpoint in your app settings is correct and includes the full URL (for example, `https://my-topic.eventgrid.azure.net/api/events`)
- Verify the Event Grid topic resource exists in the same subscription and region
- Check that your Durable Functions app has network access to the Event Grid endpoint

### Test locally

To test locally, see [Local testing with viewer web app](../event-grid-how-tos.md#local-testing-with-viewer-web-app). When testing locally with managed identity, use your developer credentials to authenticate against the Event Grid topic. See [Configure Durable Functions with managed identity - Local development](durable-functions-configure-managed-identity.md#local-development-setup) for details.

## Clean up resources

If you're not going to continue to use the resources created in this tutorial, delete them to avoid incurring charges.

### Delete the resource groups

Delete both resource groups and all their contained resources:

```azurecli
az group delete --name <resource-group-name> --yes
az group delete --name <listener-resource-group-name> --yes
```

### Delete individual resources

If you want to keep some resources, you can delete them individually:

1. Delete the Event Grid subscription:

    ```azurecli
    az eventgrid event-subscription delete \
      --name <subscription-name> \
      --source-resource-id /subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.EventGrid/topics/<topic-name>
    ```

1. Delete the Event Grid topic:

    ```azurecli
    az eventgrid topic delete --name <topic-name> --resource-group <resource-group-name>
    ```

1. Delete the function apps:

    ```azurecli
    az functionapp delete --name <publisher-function-app-name> --resource-group <resource-group-name>
    az functionapp delete --name <listener-function-app-name> --resource-group <listener-resource-group-name>
    ```

1. Delete the storage accounts:

    ```azurecli
    az storage account delete --name <storage-account-name> --resource-group <resource-group-name> --yes
    az storage account delete --name <listener-storage-account-name> --resource-group <listener-resource-group-name> --yes
    ```

## Next steps

Learn more about:
- [Instance management](../../durable-task/common/durable-task-instance-management.md)
- [Versioning in Durable Functions](durable-functions-versioning.md)
