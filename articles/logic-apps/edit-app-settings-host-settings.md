---
title: Edit runtime and environment settings for Standard logic apps
description: Change the runtime and environment settings for Standard logic apps in single-tenant Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 01/14/2024
ms.custom: fasttrack-edit
---

# Edit host and app settings for Standard logic apps in single-tenant Azure Logic Apps

[!INCLUDE [logic-apps-sku-standard](../../includes/logic-apps-sku-standard.md)]

In *single-tenant* Azure Logic Apps, the *app settings* for a Standard logic app specify the global configuration options that affect *all the workflows* in that logic app. However, these settings apply *only* when these workflows run in your *local development environment*. Locally running workflows can access these app settings as *local environment variables*, which are used by local development tools for values that can often change between environments. For example, these values can contain connection strings. When you deploy to Azure, app settings are ignored and aren't included with your deployment.

Your logic app also has *host settings*, which specify the runtime configuration settings and values that apply to *all the workflows* in that logic app, for example, default values for throughput, capacity, data size, and so on, *whether they run locally or in Azure*.

Settings are *key-value* pairs that define the setting name and value.

<a name="app-settings-parameters-deployment"></a>

## App settings, parameters, and deployment

In multitenant Azure Logic Apps, deployment depends on Azure Resource Manager templates (ARM templates), which combine and handle resource provisioning for both logic apps and infrastructure. This design poses a challenge when you have to maintain environment variables for logic apps across various dev, test, and production environments. Everything in an ARM template is defined at deployment. If you need to change just a single variable, you have to redeploy everything.

In *single-tenant* Azure Logic Apps, deployment becomes easier because you can separate resource provisioning between apps and infrastructure. You can use *parameters* to abstract values that might change between environments. By defining parameters to use in your workflows, you can first focus on designing your workflows, and then insert your environment-specific variables later. You can call and reference your environment variables at runtime by using app settings and parameters. That way, you don't have to redeploy as often.

App settings integrate with Azure Key Vault. You can [directly reference secure strings](../app-service/app-service-key-vault-references.md), such as connection strings and keys. Similar to Azure Resource Manager templates (ARM templates), where you can define environment variables at deployment time, you can define app settings within your [logic app workflow definition](/azure/templates/microsoft.logic/workflows). You can then capture dynamically generated infrastructure values, such as connection endpoints, storage strings, and more. However, app settings have size limitations and can't be referenced from certain areas in Azure Logic Apps.

> [!NOTE]
>
> If you use Key Vault, make sure that you store only secrets, such as passwords, credentials, and certificates. 
> In a logic app workflow, don't use Key Vault to store non-secret values, such as URL paths, that the workflow designer needs to make calls. 
> The designer can't dereference an app setting that references a Key Vault resource type, which results in an 
> error and a failed call. For non-secret values, store them directly in app settings.

For more information about setting up your logic apps for deployment, see the following documentation:

- [Create parameters for values that change in workflows between environments for single-tenant Azure Logic Apps](parameterize-workflow-app.md)
- [DevOps deployment overview for single-tenant based logic apps](devops-deployment-single-tenant-azure-logic-apps.md)
- [Set up DevOps deployment for single-tenant based logic apps](set-up-devops-deployment-single-tenant-azure-logic-apps.md)

## Visual Studio Code project structure

[!INCLUDE [Visual Studio Code - logic app project structure](includes/logic-apps-single-tenant-project-structure-visual-studio-code.md)]

<a name="reference-local-settings-json"></a>

## Reference for app settings - local.settings.json

In Visual Studio Code, at your logic app project's root level, the **local.settings.json** file contain global configuration options that affect *all workflows* in that logic app while running in your local development environment. When your workflows run locally, these settings are accessed as local environment variables, and their values can often change between the various environments where you run your workflows. To view and manage these settings, review [Manage app settings - local.settings.json](#manage-app-settings).

App settings in Azure Logic Apps work similarly to app settings in Azure Functions or Azure Web Apps. If you've used these other services before, you might already be familiar with app settings. For more information, review [App settings reference for Azure Functions](../azure-functions/functions-app-settings.md) and [Work with Azure Functions Core Tools - Local settings file](../azure-functions/functions-develop-local.md#local-settings-file).

For your workflow to run properly, some app settings are required.

| Setting | Required | Value | Description |
|---------|----------|-------|-------------|
| `APP_KIND` | Yes | `workflowApp` | Required to set the app type for the Standard logic app resource. The value must be set to **`workflowApp`**. <br><br>**Note**: In some scenarios, this app setting might be missing, for example, due to automation using Azure Resource Manager templates or other scenarios where the setting isn't included. If certain actions don't work, such as the **Execute JavaScript Code** action, or if the workflow stops working, check that the **APP_KIND** app setting exists and is set to **`workflowApp`**. |
| `AZURE_AUTHORITY_HOST` | No | None | Sets the Standard logic app's default authority to use for OAuth authentication. |
| `AzureWebJobsStorage` | Yes | None | Required to set the connection string for an Azure storage account. For more information, see [AzureWebJobsStorage](../azure-functions/functions-app-settings.md#azurewebjobsstorage). |
| `FUNCTIONS_EXTENSION_VERSION` | Yes | `~4` | Required to set the Azure Functions version. For more information, see [FUNCTIONS_EXTENSION_VERSION](/azure/azure-functions/functions-app-settings#functions_extension_version). |
| `FUNCTIONS_WORKER_RUNTIME` | Yes | `dotnet` | Required to set the language worker runtime for your logic app resource and workflows. <br><br>**Note**: This setting's value was previously set to **`node`**, but now the required value is **`dotnet`** for all new and existing deployed Standard logic apps. This change shouldn't affect your workflow's runtime, so everything should work the same way as before. <br><br>For more information, see [FUNCTIONS_WORKER_RUNTIME](../azure-functions/functions-app-settings.md#functions_worker_runtime). |
| `ServiceProviders.Sftp.FileUploadBufferTimeForTrigger` | No | `00:00:20` <br>(20 seconds) | Sets the buffer time to ignore files that have a last modified timestamp that's greater than the current time. This setting is useful when large file writes take a long time and avoids fetching data for a partially written file. |
| `ServiceProviders.Sftp.OperationTimeout` | No | `00:02:00` <br>(2 min) | Sets the time to wait before timing out on any operation. |
| `ServiceProviders.Sftp.ServerAliveInterval` | No | `00:30:00` <br>(30 min) | Sends a "keep alive" message to keep the SSH connection active if no data exchange with the server happens during the specified period. |
| `ServiceProviders.Sftp.SftpConnectionPoolSize` | No | `2` connections | Sets the number of connections that each processor can cache. The total number of connections that you can cache is *ProcessorCount* multiplied by the setting value. |
| `ServiceProviders.MaximumAllowedTriggerStateSizeInKB` | No | `10` KB, which is ~1,000 files | Sets the trigger state entity size in kilobytes, which is proportional to the number of files in the monitored folder and is used to detect files. If the number of files exceeds 1,000, increase this value. |
| `ServiceProviders.Sql.QueryTimeout` | No | `00:02:00` <br>(2 min) | Sets the request timeout value for SQL service provider operations. |
| `WEBSITE_CONTENTSHARE` | Yes | Dynamic | Required to set the name for the file share that Azure Functions uses to store function app code and configuration files and is used with [WEBSITE_CONTENTAZUREFILECONNECTIONSTRING](/azure/azure-functions/functions-app-settings#website_contentazurefileconnectionstring). The default is a unique string generated by the runtime. For more information, see [WEBSITE_CONTENTSHARE](/azure/azure-functions/functions-app-settings#website_contentshare). |
| `WEBSITE_LOAD_ROOT_CERTIFICATES` | No | None | Sets the thumbprints for the root certificates to be trusted. |
| `WEBSITE_NODE_DEFAULT_VERSION` | Yes | **~**<*version*> | Sets the Node.js version when running your logic app workflows on Windows. Use a tilde (~) to have the Azure Logic Apps runtime use the latest available version of the targeted major version. For example, if set to **~18**, the latest version of Node.js 18 is used. When you use a tilde with a major version, you don't have to manually update the minor version. <br><br>For more information, see [**WEBSITE_NODE_DEFAULT_VERSION** - Azure Functions](/azure/azure-functions/functions-app-settings#website_node_default_version). |
| `Workflows.Connection.AuthenticationAudience` | No | None | Sets the audience for authenticating a managed (Azure-hosted) connection. |
| `Workflows.CustomHostName` | No | None | Sets the host name to use for workflow and input-output URLs, for example, "logic.contoso.com". For information to configure a custom DNS name, see [Map an existing custom DNS name to Azure App Service](../app-service/app-service-web-tutorial-custom-domain.md) and [Secure a custom DNS name with a TLS/SSL binding in Azure App Service](../app-service/configure-ssl-bindings.md). |
| `Workflows.<workflowName>.FlowState` | No | None | Sets the state for <*workflowName*>. |
| `Workflows.<workflowName>.RuntimeConfiguration.RetentionInDays` | No | `90` days | Sets the amount of time in days to keep the run history for <*workflowName*>. <br><br>- Minimum: 7 days <br>- Maximum: 365 days |
| `Workflows.RuntimeConfiguration.RetentionInDays` | No | `90` days | Sets the amount of time in days to keep workflow run history after a run starts. <br><br>- Minimum: 7 days <br>- Maximum: 365 days |
| `Workflows.WebhookRedirectHostUri` | No | None | Sets the host name to use for webhook callback URLs. |

<a name="manage-app-settings"></a>

## Manage app settings - local.settings.json

To add, update, or delete app settings, select and review the following sections for Azure portal, Visual Studio Code, Azure CLI, or ARM (Bicep) template. For app settings specific to logic apps, review the [reference guide for available app settings - local.settings.json](#reference-local-settings-json).

### [Azure portal](#tab/azure-portal)

##### View app settings in the portal

1. In the [Azure portal](https://portal.azure.com/) search box, find and open your logic app.

1. On your logic app menu, under **Settings**, select **Environment variables**.

1. On the **Environment variables** page, on the **App settings** tab, review the app settings for your logic app.

   For more information about these settings, review the [reference guide for available app settings - local.settings.json](#reference-local-settings-json).

1. To view all values, on the page toolbar, select **Show Values**. Or, to view a single value, in the **Value** column, select **Show value** (eye icon).

##### Add an app setting in the portal

1. On the **App settings** tab, on the toolbar, select **Add**.

1. On the **Add/Edit application setting** pane, for **Name**, enter the *key* or name for your new setting.

1. For **Value**, enter the value for your new setting.

1. When you're done, select **Apply**.

   :::image type="content" source="./media/edit-app-settings-host-settings/portal-app-settings-values.png" alt-text="Screenshot shows Azure portal with app settings page and values for a Standard logic app resource." lightbox="./media/edit-app-settings-host-settings/portal-app-settings-values.png":::

### [Visual Studio Code](#tab/visual-studio-code)

##### View app settings in Visual Studio Code

1. In your logic app project, at the root project level, find and open the **local.settings.json** file.

1. In the `Values` object, review the app settings for your logic app.

   For more information about these settings, review the [reference guide for available app settings - local.settings.json](#reference-local-settings-json).

##### Add an app setting in Visual Studio Code

1. In the **local.settings.json** file, find the `Values` object.

1. In the `Values` object, add the app setting that you want to apply when running locally in Visual Studio Code. Some settings enable you to add a setting for a specific workflow, for example:

   ```json
   {
      "IsEncrypted": false,
      "Values": {
         "AzureWebJobsStorage": "UseDevelopmentStorage=true",
         "Workflows.WorkflowName1.FlowState" : "Disabled",
         <...>
     }
   }
   ```

### [Azure CLI](#tab/azure-cli)

To review your current app settings using the Azure CLI, run the command, `az logicapp config appsettings list`. Make sure that your command includes the `--name -n` and `--resource-group -g` parameters, for example:

```azurecli
az logicapp config appsettings list --name MyLogicApp --resource-group MyResourceGroup
```

For more information about these settings, review the [reference guide for available app settings - local.settings.json](#reference-local-settings-json).

To add or update an app setting using the Azure CLI, run the command `az logicapp config appsettings set`. Make sure that your command includes the `--name n` and `--resource-group -g` parameters. For example, the following command creates a setting with a key named `CUSTOM_LOGIC_APP_SETTING` with a value of `12345`:

```azurecli
az logicapp config appsettings set --name MyLogicApp --resource-group MyResourceGroup --settings CUSTOM_LOGIC_APP_SETTING=12345 
```
---

<a name="reference-host-json"></a>

## Reference for host settings - host.json

In Visual Studio Code, at your logic app project's root level, the **host.json** metadata file contains the runtime settings and default values that apply to *all workflows* in a logic app resource whether running locally or in Azure. To view and manage these settings, review [Manage host settings - host.json](#manage-host-settings). You can also find related limits information in the [Limits and configuration for Azure Logic Apps](logic-apps-limits-and-config.md#definition-limits) documentation.

<a name="job-orchestration"></a>

### Job orchestration throughput

These settings affect the throughput and capacity for single-tenant Azure Logic Apps to run workflow operations.

| Setting | Default value | Description |
|---------|---------------|-------------|
| `Jobs.BackgroundJobs.DispatchingWorkersPulseInterval` | `00:00:01` <br>(1 sec) | Sets the interval for job dispatchers to poll the job queue when the previous poll returns no jobs. Job dispatchers poll the queue immediately when the previous poll returns a job. |
| `Jobs.BackgroundJobs.NumPartitionsInJobDefinitionsTable` | `4` job partitions | Sets the number of job partitions in the job definition table. This value controls how much execution throughput is affected by partition storage limits. |
| `Jobs.BackgroundJobs.NumPartitionsInJobTriggersQueue` | `1` job queue | Sets the number of job queues monitored by job dispatchers for jobs to process. This value also affects the number of storage partitions where job queues exist. |
| `Jobs.BackgroundJobs.NumWorkersPerProcessorCount` | `192` dispatcher worker instances | Sets the number of *dispatcher worker instances* or *job dispatchers* to have per processor core. This value affects the number of workflow runs per core. |
| `Jobs.BackgroundJobs.StatelessNumWorkersPerProcessorCount` | `192` dispatcher worker instances | Sets the number of *dispatcher worker instances* or *job dispatchers* to have per processor core, per stateless run. This value affects the number of concurrent workflow actions that are processed per run. |

Both of the following settings are used to manually stop and immediately delete the specified workflows in Standard logic app.

> [!NOTE]
>
> Use these settings with caution and only in non-production environments, such as load 
> or performance test environments, as you can't undo or recover from these operations.

| Setting | Default value | Description |
|---------|---------------|-------------|
| `Jobs.CleanupJobPartitionPrefixes` | None | Immediately deletes all the run jobs for the specified workflows. |
| `Jobs.SuspendedJobPartitionPrefixes` | None | Stops the run jobs for the specified workflows. |

The following example shows the syntax for these settings where each workflow ID is followed by a colon (**:**) and separated by a semicolon (**;**):

```json
"Jobs.CleanupJobPartitionPrefixes": "<workflow-ID-1>:; <workflow-ID-2>:",
"Jobs.SuspendedJobPartitionPrefixes": "<workflow-ID-1>:; <workflow-ID-2>:"
```

<a name="recurrence-triggers"></a>

### Recurrence-based triggers

| Setting | Default value | Description |
|---------|---------------|-------------|
| `Microsoft.Azure.Workflows.ServiceProviders.MaximumAllowedTriggerStateSizeInKB` | `1` KB | Sets the trigger state's maximum allowed size for recurrence-based triggers such as the built-in SFTP trigger. The trigger state persists data across multiple service provider recurrence-based triggers. <br><br>**Important**: Based on your storage size, avoid setting this value too high, which can adversely affect storage and performance. |

<a name="trigger-concurrency"></a>

### Trigger concurrency

The following settings work only for workflows that start with a recurrence-based trigger for [built-in, service provider-based connectors](/azure/logic-apps/connectors/built-in/reference/). For a workflow that starts with a function-based trigger, you might try to [set up batching where supported](logic-apps-batch-process-send-receive-messages.md). However, batching isn't always the correct solution. For example, with Azure Service Bus triggers, a batch might hold onto messages beyond the lock duration. As a result, any action, such as complete or abandon, fails on such messages.

| Setting | Default value | Description |
|---------|---------------|-------------|
| `Runtime.Trigger.MaximumRunConcurrency` | `100` runs | Sets the maximum number of concurrent runs that a trigger can start. This value appears in the trigger's concurrency definition. |
| `Runtime.Trigger.MaximumWaitingRuns` | `200` runs | Sets the maximum number of runs that can wait after concurrent runs meet the maximum. This value appears in the trigger's concurrency definition. For more information, see [Change waiting runs limit](logic-apps-workflow-actions-triggers.md#change-waiting-runs). |

<a name="run-duration-history"></a>

### Run duration and history retention

| Setting | Default value | Description |
|---------|---------------|-------------|
| `Runtime.Backend.FlowRunTimeout` | `90.00:00:00` <br>(90 days) | Sets the amount of time a workflow can continue running before forcing a timeout. The minimum value for this setting is 7 days. <br><br>**Important**: Make sure this value is less than or equal to the value for the app setting named `Workflows.RuntimeConfiguration.RetentionInDays`. Otherwise, run histories can get deleted before the associated jobs are complete. |
| `Runtime.FlowMaintenanceJob.RetentionCooldownInterval` | `7.00:00:00` <br>(7 days) | Sets the amount of time in days as the interval between when to check for and delete run history that you no longer want to keep. |

<a name="run-actions"></a>

### Run actions

| Setting | Default value | Description |
|---------|---------------|-------------|
| `Runtime.FlowRunRetryableActionJobCallback.ActionJobExecutionTimeout` | `00:10:00` <br>(10 minutes) | Sets the amount of time for a workflow action job to run before timing out and retrying. |

<a name="inputs-outputs"></a>

### Inputs and outputs

| Setting | Default value | Description |
|---------|---------------|-------------|
| `Microsoft.Azure.Workflows.TemplateLimits.InputParametersLimit` | `50` | Change the default limit on [cross-environment workflow parameters](create-parameters-workflows.md) up to 500 for Standard logic apps created by [exporting Consumption logic apps](export-from-consumption-to-standard-logic-app.md). |
| `Runtime.ContentLink.MaximumContentSizeInBytes` | `104857600` bytes | Sets the maximum size in bytes that an input or output can have in a single trigger or action. |
| `Runtime.FlowRunActionJob.MaximumActionResultSize` | `209715200` bytes | Sets the maximum size in bytes that the combined inputs and outputs can have in a single action. |

<a name="pagination"></a>

### Pagination

| Setting | Default value | Description |
|---------|---------------|-------------|
| `Runtime.FlowRunRetryableActionJobCallback.MaximumPageCount` | `1000` pages | When pagination is supported and enabled on an operation, sets the maximum number of pages to return or process at runtime. |

<a name="chunking"></a>

### Chunking

| Setting | Default value | Description |
|---------|---------------|-------------|
| `Runtime.FlowRunRetryableActionJobCallback.MaximumContentLengthInBytesForPartialContent` | `1073741824` bytes | When chunking is supported and enabled on an operation, sets the maximum size in bytes for downloaded or uploaded content. |
| `Runtime.FlowRunRetryableActionJobCallback.MaxChunkSizeInBytes` | `52428800` bytes | When chunking is supported and enabled on an operation, sets the maximum size in bytes for each content chunk. |
| `Runtime.FlowRunRetryableActionJobCallback.MaximumRequestCountForPartialContent` | `1000` requests | When chunking is supported and enabled on an operation, sets the maximum number of requests that an action execution can make to download content. |

<a name="store-inline-or-blob"></a>

### Store content inline or use blobs

| Setting | Default value | Description |
|---------|---------------|-------------|
| `Runtime.FlowRunEngine.ForeachMaximumItemsForContentInlining` | `20` items | When a `For each` loop is running, each item's value is stored either inline with other metadata in table storage or separately in blob storage. Sets the number of items to store inline with other metadata. |
| `Runtime.FlowRunRetryableActionJobCallback.MaximumPagesForContentInlining` | `20` pages | Sets the maximum number of pages to store as inline content in table storage before storing in blob storage. |
| `Runtime.FlowTriggerSplitOnJob.MaximumItemsForContentInlining` | `40` items | When the `SplitOn` setting debatches array items into multiple workflow instances, each item's value is stored either inline with other metadata in table storage or separately in blob storage. Sets the number of items to store inline. |
| `Runtime.ScaleUnit.MaximumCharactersForContentInlining` | `32384` characters | Sets the maximum number of operation input and output characters to store inline in table storage before storing in blob storage. |

<a name="for-each-loop"></a>

### For each loops

| Setting | Default value | Description |
|---------|---------------|-------------|
| `Runtime.Backend.FlowDefaultForeachItemsLimit` | `100000` array items | For a *stateful workflow*, sets the maximum number of array items to process in a `For each` loop. |
| `Runtime.Backend.FlowDefaultSplitOnItemsLimit` | `100000` array items | Sets the maximum number of array items to debatch or split into multiple workflow instances based on the `SplitOn` setting. |
| `Runtime.Backend.ForeachDefaultDegreeOfParallelism` | `20` iterations | Sets the default number of concurrent iterations, or degree of parallelism, in a `For each` loop. To run sequentially, set the value to `1`. |
| `Runtime.Backend.Stateless.FlowDefaultForeachItemsLimit` | `100` items | For a *stateless workflow*, sets the maximum number of array items to process in a `For each` loop. |

<a name="until-loop"></a>

### Until loops

| Setting | Default value | Description |
|---------|---------------|-------------|
| `Runtime.Backend.MaximumUntilLimitCount` | `5000` iterations | For a *stateful workflow*, sets the maximum number possible for the `Count` property in an `Until` action. |
| `Runtime.Backend.Stateless.FlowRunTimeout` | `00:05:00` <br>(5 min) | Sets the maximum wait time for an `Until` loop in a stateless workflow. |
| `Runtime.Backend.Stateless.MaximumUntilLimitCount` | `100` iterations | For a *stateless workflow*, sets the maximum number possible for the `Count` property in an `Until` action. |

<a name="variables"></a>

### Variables

| Setting | Default value | Description |
|---------|---------------|-------------|
| `Runtime.Backend.DefaultAppendArrayItemsLimit` | `100000` array items | Sets the maximum number of items in a variable with the Array type. |
| `Runtime.Backend.VariableOperation.MaximumStatelessVariableSize` | Stateless workflow: `1024` characters | Sets the maximum size in characters for the content that a variable can store when used in a stateless workflow. |
| `Runtime.Backend.VariableOperation.MaximumVariableSize` | Stateful workflow: `104857600` characters | Sets the maximum size in characters for the content that a variable can store when used in a stateful workflow. |

<a name="http-operations"></a>

### Built-in HTTP operations

| Setting | Default value | Description |
|---------|---------------|-------------|
| `Runtime.Backend.HttpOperation.DefaultRetryCount` | `4` retries | Sets the default retry count for HTTP triggers and actions. |
| `Runtime.Backend.HttpOperation.DefaultRetryInterval` | `00:00:07` <br>(7 sec) | Sets the default retry interval for HTTP triggers and actions. |
| `Runtime.Backend.HttpOperation.DefaultRetryMaximumInterval` | `01:00:00` <br>(1 hour) | Sets the maximum retry interval for HTTP triggers and actions. |
| `Runtime.Backend.HttpOperation.DefaultRetryMinimumInterval` | `00:00:05` <br>(5 sec) | Sets the minimum retry interval for HTTP triggers and actions. |
| `Runtime.Backend.HttpOperation.MaxContentSize` | `104857600` bytes | Sets the maximum request size in bytes for HTTP actions only, not triggers. For more information, see [Limitations](#limitations). |
| `Runtime.Backend.HttpOperation.RequestTimeout` | `00:03:45` <br>(3 min and 45 sec) <br><br>**Note**: The default value is also the maximum value. | Sets the request timeout value for HTTP triggers and actions. |

<a name="http-webhook"></a>

### Built-in HTTP Webhook operations

| Setting | Default value | Description |
|---------|---------------|-------------|
| `Runtime.Backend.HttpWebhookOperation.DefaultRetryCount` | `4` retries | Sets the default retry count for HTTP webhook triggers and actions. |
| `Runtime.Backend.HttpWebhookOperation.DefaultRetryInterval` | `00:00:07` <br>(7 sec) | Sets the default retry interval for HTTP webhook triggers and actions. |
| `Runtime.Backend.HttpWebhookOperation.DefaultRetryMaximumInterval` | `01:00:00` <br>(1 hour) | Sets the maximum retry interval for HTTP webhook triggers and actions. |
| `Runtime.Backend.HttpWebhookOperation.DefaultRetryMinimumInterval` | `00:00:05` <br>(5 sec) | Sets the minimum retry interval for HTTP webhook triggers and actions. |
| `Runtime.Backend.HttpWebhookOperation.DefaultWakeUpInterval` | `01:00:00` <br>(1 hour) | Sets the default wake-up interval for HTTP webhook trigger and action jobs. |
| `Runtime.Backend.HttpWebhookOperation.MaxContentSize` | `104857600` bytes | Sets the maximum request size in bytes for HTTP webhook actions only, not triggers. For more information, see [Limitations](#limitations). |
| `Runtime.Backend.HttpWebhookOperation.RequestTimeout` | `00:02:00` <br>(2 min) | Sets the request timeout value for HTTP webhook triggers and actions. |

<a name="built-in-storage"></a>

### Built-in Azure Storage operations

<a name="built-in-blob-storage"></a>

#### Blob storage

| Setting | Default value | Description |
|---------|---------------|-------------|
| `Microsoft.Azure.Workflows.ContentStorage.RequestOptionsThreadCount` | None | Sets the thread count for blob upload and download operations. You can use this setting to force the Azure Logic Apps runtime to use multiple threads when uploading and downloading content from action inputs and outputs. |
| `Runtime.ContentStorage.RequestOptionsDeltaBackoff` | `00:00:02` <br>(2 sec) | Sets the backoff interval between retries sent to blob storage. |
| `Runtime.ContentStorage.RequestOptionsMaximumAttempts` | `4` retries | Sets the maximum number of retries sent to table and queue storage. |
| `Runtime.ContentStorage.RequestOptionsMaximumExecutionTime` | `00:02:00` <br>(2 min) | Sets the operation timeout value, including retries, for blob requests from the Azure Logic Apps runtime. |
| `Runtime.ContentStorage.RequestOptionsServerTimeout` | `00:00:30` <br>(30 sec) | Sets the timeout value for blob requests from the Azure Logic Apps runtime. |

<a name="built-in-table-queue-storage"></a>

#### Table and queue storage

| Setting | Default value | Description |
|---------|---------------|-------------|
| `Runtime.DataStorage.RequestOptionsDeltaBackoff` | `00:00:02` <br>(2 sec) | Sets the backoff interval between retries sent to table and queue storage. |
| `Runtime.DataStorage.RequestOptionsMaximumAttempts` | `4` retries | Sets the maximum number of retries sent to table and queue storage. |
| `Runtime.DataStorage.RequestOptionsMaximumExecutionTime` | `00:00:45` <br>(45 sec) | Sets the operation timeout value, including retries, for table and queue storage requests from the Azure Logic Apps runtime. |
| `Runtime.DataStorage.RequestOptionsServerTimeout` | `00:00:16` <br>(16 sec) | Sets the timeout value for table and queue storage requests from the Azure Logic Apps runtime. |

<a name="built-in-file-share"></a>

#### File share

| Setting | Default value | Description |
|---------|---------------|-------------|
| `ServiceProviders.AzureFile.MaxFileSizeInBytes` | `150000000` bytes | Sets the maximum file size in bytes for an Azure file share. |

<a name="built-in-azure-functions"></a>

### Built-in Azure Functions operations

| Setting | Default value | Description |
|---------|---------------|-------------|
| `Runtime.Backend.FunctionOperation.RequestTimeout` | `00:03:45` <br>(3 min and 45 sec) | Sets the request timeout value for Azure Functions actions. |
| `Runtime.Backend.FunctionOperation.MaxContentSize` | `104857600` bytes | Sets the maximum request size in bytes for Azure Functions actions. For more information, see [Limitations](#limitations). |
| `Runtime.Backend.FunctionOperation.DefaultRetryCount` | `4` retries | Sets the default retry count for Azure Functions actions. |
| `Runtime.Backend.FunctionOperation.DefaultRetryInterval` | `00:00:07` <br>(7 sec) | Sets the default retry interval for Azure Functions actions. |
| `Runtime.Backend.FunctionOperation.DefaultRetryMaximumInterval` | `01:00:00` <br>(1 hour) | Sets the maximum retry interval for Azure Functions actions. |
| `Runtime.Backend.FunctionOperation.DefaultRetryMinimumInterval` | `00:00:05` <br>(5 sec) | Sets the minimum retry interval for Azure Functions actions. |

<a name="built-in-azure-service-bus"></a>

### Built-in Azure Service Bus operations

| Setting | Default value | Description |
|---------|---------------|-------------|
| `ServiceProviders.ServiceBus.MessageSenderOperationTimeout` | `00:01:00` <br>(1 min) | Sets the timeout for sending messages with the built-in Service Bus operation. |
| `Runtime.ServiceProviders.ServiceBus.MessageSenderPoolSizePerProcessorCount` | `64` message senders | Sets the number of Azure Service Bus message senders per processor core to use in the message sender pool. |

<a name="built-in-sftp"></a>

### Built-in SFTP operations

| Setting | Default value | Description |
|---------|---------------|-------------|
| `Runtime.ServiceProviders.Sftp.MaxFileSizeInBytes` | `2147483648` bytes | Sets the maximum file size in bytes for the **Get file content (V2)** action. |
| `Runtime.ServiceProviders.Sftp.MaximumFileSizeToReadInBytes`| `209715200` bytes | Sets the maximum file size in bytes for the **Get file content** action. Make sure this value doesn't exceed the referenceable memory size because this action reads file content in memory. |

<a name="managed-api-connector"></a>

### Managed connector operations

| Setting | Default value | Description |
|---------|---------------|-------------|
| `Runtime.Backend.ApiConnectionOperation.RequestTimeout` | `00:02:00` <br>(2 min) | Sets the request timeout value for managed API connector triggers and actions. |
| `Runtime.Backend.ApiConnectionOperation.MaxContentSize` | `104857600` bytes | Sets the maximum request size in bytes for managed API connector triggers and actions. For more information, see [Limitations](#limitations). |
| `Runtime.Backend.ApiConnectionOperation.DefaultRetryCount` | `4` retries | Sets the default retry count for managed API connector triggers and actions. |
| `Runtime.Backend.ApiConnectionOperation.DefaultRetryInterval` | `00:00:07` <br>(7 sec) | Sets the default retry interval for managed API connector triggers and actions. |
| `Runtime.Backend.ApiWebhookOperation.DefaultRetryMaximumInterval` | `01:00:00` <br>(1 day) | Sets the maximum retry interval for managed API connector webhook triggers and actions. |
| `Runtime.Backend.ApiConnectionOperation.DefaultRetryMinimumInterval` | `00:00:05` <br>(5 sec) | Sets the minimum retry interval for managed API connector triggers and actions. |
| `Runtime.Backend.ApiWebhookOperation.DefaultWakeUpInterval` | `01:00:00` <br>(1 day) | Sets the default wake-up interval for managed API connector webhook trigger and action jobs. |

<a name="retry-policy"></a>

### Retry policy for all other operations

| Setting | Default value | Description |
|---------|---------------|-------------|
| `Runtime.ScaleMonitor.MaxPollingLatency` | `00:00:30` <br>(30 sec) | Sets the maximum polling latency for runtime scaling. |
| `Runtime.Backend.Operation.MaximumRetryCount` | `90` retries | Sets the maximum number of retries in the retry policy definition for a workflow operation. |
| `Runtime.Backend.Operation.MaximumRetryInterval` | `01:00:00:01` <br>(1 day and 1 sec) | Sets the maximum interval in the retry policy definition for a workflow operation. |
| `Runtime.Backend.Operation.MinimumRetryInterval` | `00:00:05` <br>(5 sec) | Sets the minimum interval in the retry policy definition for a workflow operation. |

### Limitations

- Maximum content size

  By default, built-in triggers, such as HTTP or Request, are limited to the message size described in [Limits and configuration reference - Messages](logic-apps-limits-and-config.md#messages). To handle files larger than the limit, try uploading your content as a blob to [Azure Blob Storage](../storage/blobs/storage-blobs-introduction.md), and then get your content using the [Azure Blob connector](../connectors/connectors-create-api-azureblobstorage.md).

<a name="manage-host-settings"></a>

## Manage host settings - host.json

You can add, update, or delete host settings, which specify the runtime configuration settings and values that apply to *all the workflows* in that logic app, such as default values for throughput, capacity, data size, and so on, *whether they run locally or in Azure*. For host settings specific to logic apps, review the [reference guide for available runtime and deployment settings - host.json](#reference-host-json).

<a name="manage-host-settings-portal"></a>

### Azure portal - host.json

To review the host settings for your single-tenant based logic app in the Azure portal, follow these steps:

1. In the [Azure portal](https://portal.azure.com/) search box, find and open your logic app.

1. On the resource menu, under **Development Tools**, select **Advanced Tools**.

1. On the **Advanced Tools** pane, select **Go**, which opens the Kudu environment for your logic app.

1. On the Kudu toolbar, open the **Debug console** menu, and select **CMD**.

   A console window opens so that you can browse to the **wwwroot** folder using the command prompt. Or, you can browse the directory structure that appears above the console window.

1. Browse along the following path to the **wwwroot** folder: `...\home\site\wwwroot`.

1. Above the console window, in the directory table, next to the **host.json** file, select **Edit**.

1. After the **host.json** file opens, review any host settings that were previously added for your logic app.

   For more information about host settings, review the [reference guide for available host settings - host.json](#reference-host-json).

To add a setting, follow these steps:

1. Before you add or edit settings, stop your logic app in the Azure portal.

   1. On the resource menu, select **Overview**.

   1. On the **Overview** pane's toolbar, select **Stop**.

1. If the **host.json** file is already open, return to the **host.json** file. Otherwise, follow the preceding steps to open the **host.json** file.

1. Under the `extensionBundle` object, add the `extensions` object, which includes the `workflow` and `settings` objects, for example:

   ```json
   {
      "version": "2.0",
      "extensionBundle": {
         "id": "Microsoft.Azure.Functions.ExtensionBundle",
         "version": "[1.*, 2.0.0)"
      },
      "extensions": {
         "workflow": {
            "settings": {
            }
         }
      }
   }
   ```

1. In the `settings` object, add a flat list with the host settings that you want to use for all the workflows in your logic app, whether those workflows run locally or in Azure, for example:

   ```json
   {
      "version": "2.0",
      "extensionBundle": {
         "id": "Microsoft.Azure.Functions.ExtensionBundle",
         "version": "[1.*, 2.0.0)"
      },
      "extensions": {
         "workflow": {
            "settings": {
               "Runtime.Trigger.MaximumWaitingRuns": "100"
            }
         }
      }
   }
   ```

1. When you're done, remember to select **Save**.

1. Now, restart your logic app. Return to your logic app's **Overview** page, and select **Restart**.

<a name="manage-host-settings-visual-studio-code"></a>

### Visual Studio Code - host.json

To review the host settings for your logic app in Visual Studio Code, follow these steps:

1. In your logic app project, at the root project level, find and open the **host.json** file.

1. In the `extensions` object, under `workflows` and `settings`, review any host settings that were previously added for your logic app. Otherwise, the `extensions` object won't appear in the file.

   For more information about host settings, review the [reference guide for available host settings - host.json](#reference-host-json).

To add a host setting, follow these steps:

1. In the **host.json** file, under the `extensionBundle` object, add the `extensions` object, which includes the `workflow` and `settings` objects, for example:

   ```json
   {
      "version": "2.0",
      "extensionBundle": {
         "id": "Microsoft.Azure.Functions.ExtensionBundle",
         "version": "[1.*, 2.0.0)"
      },
      "extensions": {
         "workflow": {
            "settings": {
            }
         }
      }
   }
   ```

1. In the `settings` object, add a flat list with the host settings that you want to use for all the workflows in your logic app, whether those workflows run locally or in Azure, for example:

   ```json
   {
      "version": "2.0",
      "extensionBundle": {
         "id": "Microsoft.Azure.Functions.ExtensionBundle",
         "version": "[1.*, 2.0.0)"
      },
      "extensions": {
         "workflow": {
            "settings": {
               "Runtime.Trigger.MaximumWaitingRuns": "100"
            }
         }
      }
   }
   ```

---

## Next steps

- [Create parameters for values that change in workflows between environments for single-tenant Azure Logic Apps](parameterize-workflow-app.md)
- [Set up DevOps deployment for single-tenant Azure Logic Apps](set-up-devops-deployment-single-tenant-azure-logic-apps.md)
