---
title: Migrate Consumption plan apps to Flex Consumption in Azure Functions
description: Learn how to migrate an existing function app in Azure running in an Azure Functions Consumption hosting plan to instead run in the Flex Consumption hosting plan.
ms.service: azure-functions
ms.collection: 
 - migration
ms.date: 06/23/2025
ms.topic: concept-article

#customer intent: As a developer, I want to learn how to migrate my existing serverless applications in Azure Functions from the Consumption host plan to the Flex Consumption hosting plan.
---

# Migrate Consumption plan apps to the Flex Consumption plan

This article provides step-by-step instructions for migrating your existing function apps hosted in the [Consumption plan](../consumption-plan.md) in Azure Functions to instead use the [Flex Consumption plan](../flex-consumption-plan.md). 

When you migrate your existing serverless apps, your functions can easily take advantage of these benefits of the Flex Consumption plan:

+ Enhanced performance: your apps benefit from faster cold starts and improved scalability.
+ Improved controls: fine-tune your functions with per-function scaling and concurrency settings.
+ Expanded networking: virtual network integration and private endpoints let you run your functions in both public and private networks.
+ Managed identity support: easily connect to remote Azure services using Microsoft Entra ID authentication.

The Flex Consumption plan is the recommended serverless hosting option for your functions going forward. For more information, see [Flex Consumption plan benefits](../flex-consumption-plan.md#benefits). For a detailed comparison between hosting plans, see [Azure Functions hosting options](../functions-scale.md). 

## Considerations

Before staring a migration, keep these considerations in mind:

+ Due to the significant configuration and behavior differences between the two plans, you aren't able to _shift_ an existing Consumption plan app to the Flex Consumption plan. The migration process instead has you create a new Flex Consumption plan app that is equivalent to your current app and running in the same resource group and with the same dependencies.

+ You should prioritize the migration of your apps that run in a Consumption plan on Linux.  

+ If you have a [Premium plan app](../functions-premium-plan.md) on Windows, you must first [migrate your app to a Consumption plan](../functions-how-to-use-azure-function-app-settings.md?tabs=to-consumption#plan-migration) before you can migrate to the Flex Consumption plan using this guide. This migration path isn't available for Linux apps in the Premium plan. 

+ This article assumes that you have a general understanding of Functions concepts and architectures and are familiar with features of your apps being migrated. Such concepts include triggers and bindings, authentication, and networking customization. 

+ Where possible, this article is targeted to a specific language runtime stack. Make sure to choose your app's language at the top of the article. 

+ This article shows you how to both evaluate the current app and deploy your new Flex Consumption plan app using either the [Azure portal] or the [Azure CLI](/cli/azure). If your current app deployment is defined by using infrastructure-as-code (IaC), you can generally follow the same steps. You can perform the same actions directly in your ARM templates or Bicep files, with these resource-specific considerations:

    + The Flex Consumption plan introduced a new section in the `Microsoft.Web/sites` resource type called `functionAppConfig`, which contains many of the configurations that were application settings. For more information, see [Flex Consumption plan deprecations](../functions-app-settings.md#flex-consumption-plan-deprecations). 
    + You can find resource configuration details for a Flex Consumption plan app in [Automate resource deployment for your function app in Azure Functions](../functions-infrastructure-as-code.md?pivots=flex-consumption-plan). 
    + Functions maintains a set of canonical Flex Consumption plan deployment examples for [ARM templates](https://github.com/Azure-Samples/azure-functions-flex-consumption-samples/tree/main/IaC/armtemplate), [Bicep files](https://github.com/Azure-Samples/azure-functions-flex-consumption-samples/tree/main/IaC/bicep), and [Terraform files](https://github.com/Azure-Samples/azure-functions-flex-consumption-samples/tree/main/IaC/terraform).

## Prerequisites

#### [Azure CLI](#tab/azure-cli)

+ Access to the Azure subscription containing one or more function apps to migrate. The account used to run Azure CLI commands must be able to:

   + Create and manage function apps and App Service hosting plans.
   + Assign roles to managed identities.
   + Create and manage storage accounts.
   + Access all dependent resources of your app, such as Azure Key Vault, Azure Service Bus, or Azure Event Hubs.
   
    Being assigned to the **Owner** or **Contributor** roles in your resource group generally provides sufficient permissions.

+ [Azure CLI](/cli/azure), version v2.71.0, or a later version. Scripts are testing using Azure CLI in [Azure Cloud Shell](/azure/cloud-shell/overview).

+ The [resource-graph](../../governance/resource-graph/first-query-azurecli.md) extension, which you can install by using the [`az extension add`](/cli/azure/extension#az-extension-add) command: 

    ```azurecli
    az extension add --name resource-graph
    ```

+ The [`jq` tool](https://jqlang.org/download/), which is used to work with JSON output.
 
#### [Azure portal](#tab/azure-portal)

+ Access to the [Azure portal] 

+ Access to the Azure subscription containing one or more function apps to migrate. The account used to access the portal must be able to:

   + Create and manage function apps and App Service hosting plans.
   + Assign roles to managed identities.
   + Create and manage storage accounts.
   + Access all dependent resources of your app, such as Azure Key Vault, Azure Service Bus, or Azure Event Hubs.
   
    Being assigned to the **Owner** or **Contributor** roles in your resource group generally provides sufficient permissions.

+ A modern web browser that is up-to-date. 

---

## Assess your existing app

Before migrating to the Flex Consumption plan, you should perform these checks to make sure that your function app can be migrated successfully:

> [!div class="checklist"]
> + [Identify potential apps to migrate](#identify-potential-apps-to-migrate) 
> + [Confirm region compatibility](#confirm-region-compatibility)
> + [Verify language stack compatibility](#verify-language-stack-compatibility)
> + [Verify stack version compatibility](#verify-stack-version-compatibility)
> + [Verify deployment slots usage](#verify-deployment-slots-usage)
> + [Verify the use of certificates](#verify-the-use-of-certificates)
> + [Verify your Blob storage triggers](#verify-your-blob-storage-triggers)

### Identify potential apps to migrate

Use these steps to make a list of the function apps you need to migrate, noting their names, resource groups, locations, and runtime stacks, then follow the rest of this guide for each app you want to migrate.

The way that function app information is maintained depends on whether your app runs on Linux or Windows. 

#### [Linux](#tab/linux/azure-cli)

Use this [`az graph query`](/cli/azure/graph#az-graph-query) command to list all function apps in your subscription that are running in a Consumption plan: 

```azurecli
az graph query -q "resources | where subscriptionId == '$(az account show --query id -o tsv)' \
   | where type == 'microsoft.web/sites' | where ['kind'] == 'functionapp,linux' | where properties.sku == 'Dynamic' \
   | extend siteProperties=todynamic(properties.siteProperties.properties) | mv-expand siteProperties \
   | where siteProperties.name=='LinuxFxVersion' | project name, location, resourceGroup, stack=siteProperties.value" \
   --query data --output table
```

This command generates a table with the app name, location, resource group, and runtime stack for all Consumption apps running on Linux in the current subscription. 

You're promoted to install the [resource-graph extension](/cli/azure/graph), if it isn't already installed.

#### [Linux](#tab/linux/azure-portal)

1. Navigate to the [Azure Resource Graph Explorer](https://portal.azure.com/#view/HubsExtension/ArgQueryBlade) in the Azure portal.

1. Copy this Kusto query, paste it in the query window, and select **Run query**:  
    
    ```kusto
    resources 
    | where type == 'microsoft.web/sites' 
    | where ['kind'] == 'functionapp,linux' 
    | where properties.sku == 'Dynamic'
    | extend siteProperties=todynamic(properties.siteProperties.properties) 
    | mv-expand siteProperties 
    | where siteProperties.name=='LinuxFxVersion' 
    | project name, location, resourceGroup, stack=tostring(siteProperties.value)
    ```

This command generates a table with the app name, location, resource group, and runtime stack for all Consumption apps running on Linux in the current subscription.

#### [Windows](#tab/windows/azure-cli)

Use this [`az graph query`](/cli/azure/graph#az-graph-query) command to list all function apps in your subscription that are running in a Consumption plan:

```azurecli
az graph query -q "resources | where subscriptionId == '$(az account show --query id -o tsv)' \
   | where type == 'microsoft.web/sites' | where ['kind'] == 'functionapp' | where properties.sku == 'Dynamic' \
   | project name, location, resourceGroup" \
   --query data --output table
```

This command generates a table with the app name, location, and resource group for all Consumption apps running on Windows in the current subscription.

You're promoted to install the [resource-graph extension](/cli/azure/graph), if it isn't already installed. 

#### [Windows](#tab/windows/azure-portal)

1. Navigate to the [Azure Resource Graph Explorer](https://portal.azure.com/#view/HubsExtension/ArgQueryBlade) in the Azure portal.

1. Copy this Kusto query, paste it in the query window, and select **Run query**:  
    
    ```kusto
    resources 
    	| where type == 'microsoft.web/sites' 
    	| where ['kind'] == 'functionapp' 
    	| where properties.sku == 'Dynamic'
    	| project name, location, resourceGroup
    ```

This command generates a table with the app name, location, and resource group for all Consumption apps running on Windows in the current subscription.

---

### Confirm region compatibility

Confirm that the Flex Consumption plan is currently supported in the same region as the Consumption plan app you intend to migrate. 

#### [Azure CLI](#tab/azure-cli)

Use this [`az functionapp list-flexconsumption-locations`](/cli/azure/functionapp#az-functionapp-list-flexconsumption-locations) command to list all regions where Flex Consumption plan is available:

```azurecli
az functionapp list-flexconsumption-locations --query "sort_by(@, &name)[].{Region:name}" -o table
```

This command generates a table of Azure regions where the Flex Consumption plan is currently supported. 

#### [Azure portal](#tab/azure-portal)

The create process for a function app in the Azure portal filters out regions that aren't currently supported by the Flex Consumption plan.

1. In the [Azure portal], select **Create a resource** in the left-hand menu and select **Function app** > **Create**.

1. Select **Flex Consumption** > **Select** and in the **Basics** tab expand **Region**.

1. Review the supported Flex Consumption plan regions.
  
---

Make sure that the region in which the Consumption plan app you want to migrate runs is included in the list. 

>[!TIP]
>If your region isn't currently supported and you still choose to migrate your function app, your app must run in a different region where the Flex Consumption plan is supported. However, running your app in a different region from other connected services can introduce extra latency. Make sure that the new region can meet your application's performance requirements before you complete the migration.

### Verify language stack compatibility

Flex Consumption plans don't yet support all [Functions language stacks](../supported-languages.md). This table indicates which language stacks are currently supported: 

| Stack setting  | Stack name  | Supported |
|---------|--------|--------------|
| `dotnet-isolated` | [.NET (isolated worker model)](../dotnet-isolated-process-guide.md) | ✅ Yes |
| `node` | [JavaScript/TypeScript](../functions-reference-node.md)  | ✅ Yes  |
| `java`  | [Java](../functions-reference-java.md)  | ✅ Yes |
| `python` | Python   | ✅ Yes                        |
| `powershell`  | [PowerShell](../functions-reference-powershell.md)  | ✅ Yes |
| `dotnet`  | [.NET (in-process model)](../functions-dotnet-class-library.md) | ❌ No  |
| `custom`  | [Custom handlers](../functions-custom-handlers.md) | ❌ No  |

If your function app uses an unsupported runtime stack:

+ For C# apps that run in-process with the runtime (`dotnet`), you must first migrate your app to .NET isolated. For more information, see [Migrate C# apps from the in-process model to the isolated worker model](../migrate-dotnet-to-isolated-model.md). 

+ Non-native language apps that rely on custom handlers can't currently be migrated to run in a Flex Consumption plan.

### Verify stack version compatibility

The Flex Consumption plan doesn't currently support all of the language stack versions supported by the Consumption plan. You must verify that your app's runtime stack version is supported in your region before you migrate your app.

#### [Azure CLI](#tab/azure-cli)

Use this [`az functionapp list-flexconsumption-runtimes`](/cli/azure/functionapp#az-functionapp-list-flexconsumption-runtimes) command to verify Flex Consumption plan support for your language stack version in a specific region: 

```azurecli 
az functionapp list-flexconsumption-runtimes --location <REGION> --runtime <LANGUAGE_STACK> --query '[].{version:version}' -o tsv
```

In this example, replace `<REGION>` with your current region and `<LANGUAGE_STACK>` with one of these values:

| Language stack | Value |
| ------- | ----- |
| [C# (isolated worker model)](../dotnet-isolated-process-guide.md) | `dotnet-isolated` |
| [Java](../functions-reference-java.md)    | `java` |
| [JavaScript](../functions-reference-node.md) | `node` |
| [PowerShell](../functions-reference-powershell.md) | `powershell` |
| [Python](../functions-reference-python.md)     | `python` |
| [TypeScript](../functions-reference-node.md) | `node` |

 This command displays all versions of the specified language stack  supported by the Flex Consumption plan in your region. 

#### [Azure portal](#tab/azure-portal)

The create process for a function app in the Azure portal filters out language stack versions that aren't currently supported by the Flex Consumption plan.

1. In the [Azure portal], select **Create a resource** in the left-hand menu and select **Function app** > **Create**.

1. Select **Flex Consumption** > **Select** and in the **Basics** tab select your language **Runtime stacK** and **Region**.

1. Expand **Version** and review the supported versions of your language stack in your chosen region.

---

If your function app uses an unsupported language stack version, you must first [upgrade your app code to a supported version](../update-language-versions.md) before migrating to the Flex Consumption plan.

### Verify deployment slots usage

Consumption plan apps can have an other deployment slot defined. For more information, see [Azure Functions deployment slots](../functions-deployment-slots.md). However, the Flex Consumption plan doesn't currently support deployment slots. Before you migrate, you must determine if your app has a deployment slot. If so, you need to define a strategy for how to manage your app without deployment slots when running in a Flex Consumption plan.

#### [Azure CLI](#tab/azure-cli)

Use this [`az functionapp deployment slot list`](/cli/azure/functionapp/deployment/slot#az-functionapp-deployment-slot-list) command to list any deployment slots defined in your function app:

```azurecli
az functionapp deployment slot list --name <APP_NAME> --resource-group <RESOURCE_GROUP> --output table
```

In this example, replace `<RESOURCE_GROUP>` and `<APP_NAME>` with your resource group name and app name, respectively. If the command returns an entry, your app has deployment slots enabled. 

#### [Azure portal](#tab/azure-portal)

To determine whether your function app has deployment slots enabled:

1. In the [Azure portal], search for or otherwise navigate to your function app page.

1. In the left menu, select **Deployment** > **Deployment slots**. 

1. If you see any slots listed in the **Deployment slots** page, your function app is currently using deployment slots.

---

If your function app is currently using deployment slots, you can't currently reproduce this functionality in the Flex Consumption plan. Before migrating, you should...

+ Migrate any new code or features from the deployment slot into the main (**production**) slot. 
+ Consider rearchitecting your application so that you can develop, test, and deploy your function code without having to use slots.

### Verify the use of certificates

Transport Layer Security (TLS) certificates, previously known as Secure Sockets Layer (SSL) certificates, are used to help secure internet connections. TSL/SSL certificates, which include managed certificates, bring-your-own certificates (BYOC), or public-key certificates, aren't currently supported by the Flex Consumption plan. 

#### [Azure CLI](#tab/azure-cli)

Use the [`az webapp config ssl list`](/cli/azure/webapp/config/ssl#az-webapp-config-ssl-list) command to list any TSL/SSL certificates available to your function app:

```azurecli
az webapp config ssl list --resource-group <RESOURCE_GROUP>  
```

In this example, replace `<RESOURCE_GROUP>` with your resource group name. If this command produces output, your app is likely using certificates. 

#### [Azure portal](#tab/azure-portal)

To determine whether your function app is using TSL/SSL certificates:

1. In the [Azure portal], search for or otherwise navigate to your function app page.

1. In the left menu, select **Settings** > **Certificates**. 

1. Check the **Managed certificates**, **Bring your own certificates (.pfx)**, **Public key certificates (.cer)** tabs for any installed certificates. 

---

If your app currently relies on TSL/SSL certificates, you shouldn't proceed with the migration until after support for certificates is added to the Flex Consumption plan.

### Verify your Blob storage triggers

Currently, the Flex Consumption plan only supports event-based triggers for Azure Blob storage. Blob storage triggers that use container polling (with a `Source` setting of `LogsAndContainerScan`) aren't supported in Flex Consumption. Because container polling is the default, you must determine if any of your Blob storage triggers are using this source setting. For more information, see [Trigger on a blob container](../storage-considerations.md#trigger-on-a-blob-container).

#### [Azure CLI](#tab/azure-cli)

Use this [`az functionapp function list`] command to determine if your app has any Blob storage triggers that don't use Event Grid as the source:

```azurecli
az functionapp function list  --name <APP_NAME> --resource-group <RESOURCE_GROUP> \
  --query "[?config.bindings[0].type=='blobTrigger' && config.bindings[0].source!='EventGrid'].{Function:name,TriggerType:config.bindings[0].type,Source:config.bindings[0].source}" \
  --output table
```

In this example, replace `<RESOURCE_GROUP>` and `<APP_NAME>` with your resource group name and app name, respectively. If the command returns rows, there is at least one trigger using container polling in your function app. 

#### [Azure portal](#tab/azure-portal)

To determine whether your function app has any Blob storage triggers that don't use Event Grid as the source:

1. In the [Azure portal], search for or otherwise navigate to your function app page.

1. In the **Overview** on the **Functions** tab, look for any functions with a **Trigger** type of `Blob`. 

1. Select a blob trigger function and in the **Code + Test** select **Resource JSON**.

1. Locate the `properties.config.bindings` section of the function definition. This section should have a `bindings.type` of `blobTrigger`. If the `bindings` object has no `source` property or `source` has a value of `LogsAndContainerScan`, then the trigger is using container polling. An Event Grid source trigger instead has a `source` value of `EventGrid`.

1. Repeat steps 3-4 for any remaining Blob storage trigger functions in your app.

---

If your app has any Blob storage triggers that don't have an Event Grid source, you must change to an Event Grid source before you migrate to the Flex Consumption plan. 

The basic steps to change an existing Blob storage trigger to an Event Grid source are:

1. [Build the endpoint URL](../functions-event-grid-blob-trigger.md#build-the-endpoint-url) in your function app used to by the event subscription. 

1. [Create an event subscription](../functions-event-grid-blob-trigger.md#create-the-event-subscription) on your Blob storage container.

1. Add or update the `source` property in your Blob storage trigger definition to `EventGrid`. 

For more information, see [Tutorial: Trigger Azure Functions on blob containers using an event subscription](../functions-event-grid-blob-trigger.md).

## Consider dependent services

Because Azure Functions is a compute service, you must consider the effect of migration on data and services both upstream and downstream of your app. 

### Data protection strategies

Here are some strategies to protect both upstream and downstream data during the migration:

+ **Idempotency**: Ensure your functions can safely process the same message multiple times without negative side effects. For more information, see [Designing Azure Functions for identical input](../functions-idempotent.md).
+ **Logging and monitoring**: Enable detailed logging in both apps during migration to track message processing. For more information, see [Monitor executions in Azure Functions](../functions-monitoring.md). 
3. **Checkpointing**: For streaming triggers, such as the Event Hubs trigger, implement correct checkpoint behaviors to track processing position. For more information, see [Azure Functions reliable event processing](../functions-reliable-event-processing.md).
4. **Parallel processing**: Consider temporarily running both apps in parallel during the cutover. Make sure to carefully monitor and validate how data is processed from the upstream service. For more information, see [Active-active pattern for non-HTTPS trigger functions](../../reliability/reliability-functions.md#active-active-pattern-for-non-https-trigger-functions).
5. **Gradual cutover**: For high-volume systems, consider implementing a gradual cutover by redirecting portions of traffic to the new app. You can manage routing upstream of your apps by using services such as [Azure API Management](../functions-openapi-definition.md) or [Azure Application Gateway](../../app-service/overview-app-gateway-integration.md). 

### Mitigations by trigger type

You should plan mitigation strategies to protect data for the specific function triggers you might have in your app:

| Trigger | Risk to data | Strategy | 
| ----- | ----- | ----- |
| [Azure Blob storage](../functions-event-grid-blob-trigger.md) | High | Create a separate container for the event-based trigger in the new app.<br/>With the new app running, switch clients to use the new container.<br/>Allow the original container to be processed completely before stopping the old app.  |
| [Azure Cosmos DB](../functions-bindings-cosmosdb-v2-trigger.md) | High | Create a dedicated lease container specifically for the new app.<br/>Set this new lease container as the `leaseCollectionName` configuration in your new app.<br/>Requires that your [functions be idempotent](../functions-idempotent.md) or you must be able to handle the results of duplicate change feed processing.<br/>Set the `StartFromBeginning` configuration to `false` in the new app to avoid reprocessing the entire feed. |
| [Azure Event Grid](../functions-bindings-event-grid-trigger.md) | Medium | Recreate the same event subscription in the new app.<br/>Requires that your [functions be idempotent](../functions-idempotent.md) or you must be able to handle the results of duplicate event processing. | 
| [Azure Event Hubs](../functions-bindings-event-hubs-trigger.md) | Medium | Create a new [consumer group](../../event-hubs/event-hubs-features.md#consumer-groups) for use by the new app. For more information, see [Migration strategies for Event Grid triggers](../functions-reliable-event-processing.md#migration-strategies-for-event-grid-triggers).| 
| [Azure Service Bus](../functions-bindings-service-bus-trigger.md) | High | Create a new topic for use by the new app.<br/>Update senders and clients to use the new topic.<br/>After the original topic is empty, shut down the old app. |
| [Azure Storage queue](../functions-bindings-storage-queue-trigger.md) | High | Create a new queue for use by the new app.<br/>Update senders and clients to use the new queue.<br/>After the original queue is empty, shut down the old app. |
| [HTTP](../functions-bindings-http-webhook-trigger.md) |  Low | Usually not needed. |
| [Timer](../functions-bindings-timer.md) | Low | During cutover, make sure to offset the timer schedule between the two apps to avoid simultaneous executions from both apps.<br/>[Disable the timer trigger](../disable-function.md) in the old app after the new app runs successfully.  | 

## Premigration tasks 

Before proceeding with the migration, you must collect key information about and resources used by your Consumption plan app to help make a smooth transition to running in the Flex Consumption plan. 

You should complete these tasks before you migrate your app to run in a Flex Consumption plan:

> [!div class="checklist"]
> + [Collect app settings](#collect-app-settings)
> + [Collect application configurations](#collect-application-configurations)
> + [Identify managed identities and role-based access](#identify-managed-identities-and-role-based-access)
> + [Identify client authentication settings](#identify-client-authentication-settings)
> + [Review inbound access restrictions](#review-inbound-access-restrictions)
> + [Get the code deployment package](#get-the-code-deployment-package)
> + [Capture performance benchmarks](#capture-performance-benchmarks-optional)

### Collect app settings

If you plan to use the same trigger and bindings sources and other settings from app settings, you need to first take note of the current app settings in your existing Consumption plan app. 

#### [Azure CLI](#tab/azure-cli)

Use this [`az functionapp config appsettings list`](/cli/azure/functionapp/config/appsettings#az-functionapp-config-appsettings-list) command to return an `app_settings` object that that contains the existing app setting as JSON:

```azurecli
app_settings=$(az functionapp config appsettings list --name `<APP_NAME>` --resource-group `<RESOURCE_GROUP>`)
echo $app_settings
```

In this example, replace `<RESOURCE_GROUP>` and `<APP_NAME>` with your resource group name and app name, respectively.

#### [Azure portal](#tab/azure-portal)

To get your current function app settings:

1. In the [Azure portal], search for or otherwise navigate to your function app page.

1. In the left menu, expand **Settings** and select **Environment variables**. 

1. In the **App settings** tab, select **Advanced edit** then copy and save the JSON app settings content.

---

>[!CAUTION]  
>App settings frequently contain keys and other shared secrets. Always store applications settings securely, ideally encrypted. For improved security, you should use Microsoft Entra ID authentication with managed identities in the new Flex Consumption plan app instead of shared secrets.

### Collect application configurations

There are other app configurations not found in app settings. You should also capture these configurations from your existing app so that you can be sure to properly recreate them in the new app. 

Review these settings. If any of them exist in the current app, you must decide whether they must also be recreated in the new Flex Consumption plan app:

| Configuration | Setting | Comment |
| ----- | ----- | ----- |
| CORS settings | `cors` | Determines any existing cross-origin resource sharing (CORS) settings, which might be required by your clients. | 
| Custom domains |  | If your app is currently using a domain other than `*.azurewebsites.net`, you would need to replace this custom domain mapping with a mapping to your new app.  |
| HTTP version | `http20Enabled` | Determines if HTTP 2.0 is required by your app. |
| HTTPS only | `httpsOnly` | Determines if TSL/SSL is required to access your app. |
| Incoming client certificates | `clientCertEnabled`<br/>`clientCertMode`<br/>`clientCertExclusionPaths` | Sets requirements for client requests that use certificates for authentication. | 
| Maximum scale-out limit |`WEBSITE_MAX_DYNAMIC_APPLICATION_SCALE_OUT` | Sets the limit on scaled-out instances. The default maximum value is 200. This value is found in your app settings, but in a Flex Consumption plan app it instead gets added as a site setting (`maximumInstanceCount`). |
| Minimum inbound TLS version | `minTlsVersion` | Sets a minimum version of TLS required by your app. |
| Minimum inbound TLS Cipher | `minTlsCipherSuite` | Sets a minimum TLS cipher requirement for your app. |
| Mounted Azure Files shares | `azureStorageAccounts` | Determines if any explicitly mounted file shares exist in your app (Linux-only). |
| SCM basic auth publishing credentials | `scm.allow` | Determines if the [`scm` publishing site is enabled](../../app-service/configure-basic-auth-disable.md). While not recommended for security, it's required by some [publishing methods](../functions-deployment-technologies.md). |

#### [Azure CLI](#tab/azure-cli)

Use this script to obtain the relevant application configurations of your existing app:

```azurecli
# Set the app and resource group names
appName=<APP_NAME>
rgName=<RESOURCE_GROUP>

echo "Getting commonly used site settings..."
az functionapp config show --name $appName --resource-group $rgName \
    --query "{http20Enabled:http20Enabled, httpsOnly:httpsOnly, minTlsVersion:minTlsVersion, \
    minTlsCipherSuite:minTlsCipherSuite, clientCertEnabled:clientCertEnabled, \
    clientCertMode:clientCertMode, clientCertExclusionPaths:clientCertExclusionPaths}"

echo "Checking for SCM basic publishing credentials policies..."
az resource show --resource-group $rgName --name scm --namespace Microsoft.Web \
    --resource-type basicPublishingCredentialsPolicies --parent sites/$appName --query properties

echo "Checking for the maximum scale-out limit configuration..."
az functionapp config appsettings list --name $appName --resource-group $rgName \
    --query "[?name=='WEBSITE_MAX_DYNAMIC_APPLICATION_SCALE_OUT'].value" -o tsv

echo "Checking for any file share mount configurations..."
az webapp config storage-account list --name $appName --resource-group $rgName

echo "Checking for any custom domains..."
az functionapp config hostname list --webapp-name $appName --resource-group $rgName --query "[?contains(name, 'azurewebsites.net')==\`false\`]" --output table

echo "Checking for any CORS settings..."
az functionapp cors show --name $appName --resource-group $rgName 
```

In this example, replace `<RESOURCE_GROUP>` and `<APP_NAME>` with your resource group name and app name, respectively. If any of the site settings or checks return non-null values, make a note of them.

#### [Azure portal](#tab/azure-portal)

To review the relevant application configurations of your existing app:

1. In the [Azure portal], search for or otherwise navigate to your function app page.

1. In the left menu, expand **Settings** and select **Configuration**.
 
1. In the **General settings** tab, make a note of these settings:

  + **SCM Basic Auth Publishing Credentials**
  + **HTTP version**
  + **HTTPS Only**
  + **Minimum Inbound TLS Version**
  + **Minimum Inbound TLS Cipher**
  + **Incoming client certificates**

1. In the **Path mappings** tab, verify if there are any existing file share mounts required by your app. If there are, note the storage **Account name**, **Share name**, **Mount path**, and access **Type** for each mounted share.

1. Under **Settings** > **Scale out**, if **Enforce Scale Out Limit** is set to **Yes**,  note the **Maximum Scale Out Limit** value.  

1. Under **Settings** > **Custom domains**, note any domain names other than `*.azurewebsites.net`, the binding type, and SSL certificate information. 

1. Under **API** > **CORS**, note an explicitly allowed CORS origins and any other CORS settings.

---

### Identify managed identities and role-based access

Before migrating, you should document whether your app relies on the system-assigned managed identity or any user-assigned managed identities. You must also determine the role-based access control (RBAC) permissions granted to these identities. You must recreate the system-assigned managed identity and any role  assignments in your new app. You should be able to reuse your user-assigned managed identities in your new app.

#### [Azure CLI](#tab/azure-cli)

This script checks for both the system-assigned managed identity and any user-assigned managed identities associated with your app:

```azurecli
appName=<APP_NAME>
rgName=<RESOURCE_GROUP>

echo "Checking for a system-assigned managed identity..."
systemUserId=$(az functionapp identity show --name $appName --resource-group $rgName --query "principalId" -o tsv) 

if [[ -n "$systemUserId" ]]; then
echo "System-assigned identity principal ID: $systemUserId"
echo "Checking for role assignments..."
az role assignment list --assignee $systemUserId --all
else
  echo "No system-assigned identity found."
fi

echo "Checking for user-assigned managed identities..."
userIdentities=$(az functionapp identity show --name $appName --resource-group $rgName --query 'userAssignedIdentities' -o json)
if [[ "$userIdentities" != "{}" && "$userIdentities" != "null" ]]; then
  echo "$userIdentities" | jq -c 'to_entries[]' | while read -r identity; do
    echo "User-assigned identity name: $(echo "$identity" | jq -r '.key' | sed 's|.*/userAssignedIdentities/||')"
	echo "Checking for role assignments..."
    az role assignment list --assignee $(echo "$identity" | jq -r '.value.principalId') --all --output json
    echo
  done
else
  echo "No user-assigned identities found."
fi
```

In this example, replace `<RESOURCE_GROUP>` and `<APP_NAME>` with your resource group name and app name, respectively. Make a note of all identities and their role assignments. 

#### [Azure portal](#tab/azure-portal)

1. In the [Azure portal], search for or otherwise navigate to your function app page.

1. In the left menu, expand **Settings** and select **Identity**.

1. Check the **System assigned** tab to see if the system-assigned managed identity is enabled. If enabled, select **Azure role assignments** to view the roles assigned to this identity.

1. Check the **User assigned** tab to see if there any user-assigned managed identities are assigned. Note the names of any user-assigned identities.

1. For each user-assigned managed identity, select the identity and in the identity page select **Azure role assignments**. 

1. Make a note of each role assignment granted to the identity and determine whether it's required by your app.

Document all identities and their role assignments so that you can recreate the same permissions structure for your new Flex Consumption app.

---

### Identify client authentication settings

Before migrating to Flex Consumption, you should collect information about any built-in authentication configurations. If you want to have your app use the same client authentication behaviors, you must recreate them in the new app.

Pay special attention to redirect URIs, allowed external redirects, and token settings to ensure a smooth transition for authenticated users.

#### [Azure CLI](#tab/azure-cli)

Use this [`az webapp auth show`](/cli/azure/webapp/auth#az-webapp-auth-show) command to determine if [built-in authentication](../../app-service/overview-authentication-authorization.md) is configured in your function app:

```azurecli
az webapp auth show --name <APP_NAME> --resource-group <RESOURCE_GROUP>
```

In this example, replace `<RESOURCE_GROUP>` and `<APP_NAME>` with your resource group name and app name, respectively. Review the output to determine if authentication is enabled and which identity providers are configured. 

You should recreate these setting in your new app post-migration so that your clients can maintain access using their preferred provider. 

#### [Azure portal](#tab/azure-portal)

To determine if built-in client authentication is configured:

1. In the [Azure portal], search for or otherwise navigate to your function app page.

1. In the left menu, expand **Settings** and select **Authentication**.

1. If built-in authentication is enabled, make a note of which client identity providers are configured. Also note any advanced settings such as token store, allowed external redirects, and allowed token audiences.

---

### Review inbound access restrictions

It's possible to set inbound access restrictions on apps in a Consumption plan.  You might want to maintain these restrictions in your new app. For each restriction defined, make sure to capture these properties:

+ IP addresses or CIDR ranges
+ Priority values
+ Action type (Allow/Deny)
+ Names of the rules

#### [Azure CLI](#tab/azure-cli)

This [`az functionapp config access-restriction show`]() command returns a list of any existing IP-based access restrictions:

```azurecli
az functionapp config access-restriction show --name <APP_NAME> --resource-group <RESOURCE_GROUP>
```

In this example, replace `<RESOURCE_GROUP>` and `<APP_NAME>` with your resource group name and app name, respectively. 

#### [Azure portal](#tab/azure-portal)

1. In the [Azure portal], search for or otherwise navigate to your function app page.

1. In the left menu, expand **Settings** and select **Networking**.

1. If you see **Enabled with no access restrictions** for **Public network access** then there's no inbound access restrictions. Otherwise Select **Access restrictions**.

1. Document all configured IP-based access restrictions currently configured.
 
---

When running in the Flex Consumption plan, you can recreate these inbound IP-based restrictions. You can further secure your app by implementing other networking restrictions, such as virtual network integration and inbound private endpoints. For more information, see [Virtual network integration](../flex-consumption-plan.md#virtual-network-integration).

### Get the code deployment package 

To be able to redeploy your app, you must have either your project's source files or the deployment package. Ideally, your project files are maintained in source control so that you can easily redeploy function code to your new app. If you have your source code files, you can skip this section.

If you no longer have access to your project source files, you can download the current deployment package from the existing Consumption plan app in Azure. The location of the deployment package depends on whether you run on Linux or Windows.

#### [Linux](#tab/linux)
    
Consumption plan apps on Linux maintain the deployment zip package file in one of these locations:

+ An Azure Blob storage container named `scm-releases` in the default host storage account (`AzureWebJobsStorage`). This container is the default deployment source for a Consumption plan app on Linux.

+ If your app has a `WEBSITE_RUN_FROM_PACKAGE` setting that is a URL, the package is in an externally accessible location that is maintained by you. An external package should be hosted in a blob storage container with restricted access. For more information, see [External package URL](../functions-deployment-technologies.md#external-package-url). 

>[!TIP]  
>If your storage account is restricted to managed identity access only, you might need to grant your Azure account read access to the storage container by adding it to the `Storage Blob Data Reader` role. 

#### [Windows](#tab/windows)

The location of your project source files depends on the `WEBSITE_RUN_FROM_PACKAGE` app setting as follows:

| `WEBSITE_RUN_FROM_PACKAGE` value | Source file location | 
| ---- | ---- | 
| `1` | The files are in a zip package that is stored in the Azure Files share of the storage account defined by the `WEBSITE_CONTENTAZUREFILECONNECTIONSTRING` setting. The name of the files share is defined by the `WEBSITE_CONTENTSHARE` setting. |
| An endpoint URL | The files are in a zip package in an externally accessible location that is maintained by you. An external package should be hosted in a blob storage container with restricted access. For more information, see [External package URL](../functions-deployment-technologies.md#external-package-url). |

---  

Use these steps to download the deployment package from your current app: 

#### [Linux](#tab/linux/azure-cli)

1. Use this [`az functionapp config appsettings list`](/cli/azure/functionapp/config/appsettings#az-functionapp-config-appsettings-list) command to get the  `WEBSITE_RUN_FROM_PACKAGE` app setting, if present:

    ```azurecli
    az functionapp config appsettings list --name <APP_NAME> --resource-group <RESOURCE_GROUP> \
        --query "[?name=='WEBSITE_RUN_FROM_PACKAGE'].value" -o tsv
    ```

    In this example, replace `<RESOURCE_GROUP>` and `<APP_NAME>` with your resource group name and app name, respectively. If this command returns a URL, then you can download the deployment package file from that remote location and skip to the next section.

1. If the `WEBSITE_RUN_FROM_PACKAGE` value is `1` or nothing, use this script to get the deployment package for the existing app:

    ```azurecli
    appName=<APP_NAME>
    rgName=<RESOURCE_GROUP>
    
    echo "Getting the storage account connection string from app settings..."
    storageConnection=$(az functionapp config appsettings list --name $appName --resource-group $rgName \
             --query "[?name=='AzureWebJobsStorage'].value" -o tsv)

    echo "Getting the package name..."
    packageName=$(az storage blob list --connection-string $storageConnection --container-name scm-releases \
    --query "[0].name" -o tsv)

    echo "Download the package? $packageName? (Y to proceed, any other key to exit)"
    read -r answer
    if [[ "$answer" == "Y" || "$answer" == "y" ]]; then
       echo "Proceeding with download..."
       az storage blob download --connection-string $storageConnection --container-name scm-releases \
    --name $packageName --file $packageName
    else
       echo "Exiting script."
       exit 0
    fi
    ```

    Again, replace `<RESOURCE_GROUP>` and `<APP_NAME>` with your resource group name and app name. The package .zip file is downloaded to the directory from which you executed the command. 

#### [Linux](#tab/linux/azure-portal)

1. In the [Azure portal], search for or otherwise navigate to your function app page.

1. In the left menu, expand **Settings** > **Environment variables** and see if a setting named `WEBSITE_RUN_FROM_PACKAGE` exists.

1. If `WEBSITE_RUN_FROM_PACKAGE` exists, check if it's set to a value of `1` or a URL. If set to a URL, that URL is the location of the package file for your app content. Download the .zip file from that URL location that is owned by you.

1. If the `WEBSITE_RUN_FROM_PACKAGE` setting doesn't exist or is set to `1`, you must download the package from the specific storage account, which depends on whether you're running on Linux or Windows.

1. Get the storage account name from the `AzureWebJobsStorage` or `AzureWebJobsStorage__accountName` application setting. For a connection string, the `AccountName` is the name your storage account.

1. In the portal, search for your storage account name. 

1. In the storage account page, locate the deployment package and download it.

1. Expand **Data storage** > **Containers** and select `scm_releases`. Choose the file named `scm-latest-<APP_NAME>.zip` and select **Download**. 

#### [Windows](#tab/windows/azure-cli)

1. Use this [`az functionapp config appsettings list`](/cli/azure/functionapp/config/appsettings#az-functionapp-config-appsettings-list) command to get the  `WEBSITE_RUN_FROM_PACKAGE` app setting, if present:

    ```azurecli
    az functionapp config appsettings list --name <APP_NAME> --resource-group <RESOURCE_GROUP> \
        --query "[?name=='WEBSITE_RUN_FROM_PACKAGE'].value" -o tsv
    ```

    In this example, replace `<RESOURCE_GROUP>` and `<APP_NAME>` with your resource group name and app name, respectively. If this command returns a URL, then you can download the deployment package file from that remote location and skip to the next section.

1. If the `WEBSITE_RUN_FROM_PACKAGE` value is `1` or nothing, use this script to get the deployment package for the existing app:
    
    ```azurecli
    appName=<APP_NAME>
    rgName=<RESOURCE_GROUP>
    
    echo "Getting the storage account connection string and file share from app settings..."
    json=$(az functionapp config appsettings list --name $appName --resource-group $rgName \
        --query "[?name=='WEBSITE_CONTENTAZUREFILECONNECTIONSTRING' || name=='WEBSITE_CONTENTSHARE'].value" -o json)
    
    storageConnection=$(echo "$json" | jq -r '.[0]')
    fileShare=$(echo "$json" | jq -r '.[1]')

    echo "Getting the package name..."
    packageName=$(az storage file list --share-name $fileShare --connection-string $storageConnection \
      --path "data/SitePackages" --query "[?ends_with(name, '.zip')] | sort_by(@, &properties.lastModified)[-1].name" \
      -o tsv) 
      
    echo "Download the package? $packageName? (Y to proceed, any other key to exit)"
    read -r answer
    if [[ "$answer" == "Y" || "$answer" == "y" ]]; then
        echo "Proceeding with download..."
        az storage file download --connection-string $storageConnection --share-name $fileShare \
    	--path "data/SitePackages/$packageName"
    else
        echo "Exiting script."
        exit 0
    fi
    ```

    Again, replace `<RESOURCE_GROUP>` and `<APP_NAME>` with your resource group name and app name. The package .zip file is downloaded to the directory from which you executed the command. 

#### [Windows](#tab/windows/azure-portal)

1. In the [Azure portal], search for or otherwise navigate to your function app page.

1. In the left menu, expand **Settings** > **Environment variables** and see if a setting named `WEBSITE_RUN_FROM_PACKAGE` exists.

1. If `WEBSITE_RUN_FROM_PACKAGE` exists, check if it's set to a value of `1` or a URL. If set to a URL, that URL is the location of the package file for your app content. Download the .zip file from that URL location that is owned by you.

1. If the `WEBSITE_RUN_FROM_PACKAGE` setting doesn't exist or is set to `1`, you must download the package from the specific storage account, which depends on whether you're running on Linux or Windows.

1. Get the storage account name from the `WEBSITE_CONTENTAZUREFILECONNECTIONSTRING` setting, where the `AccountName` is the name your storage account. Also, make a note of the `WEBSITE_CONTENTSHARE` value, which is the name of the file share. 

1. In the portal, search for your storage account name. 

1. In the storage account page, locate the deployment package and download it.

1. Expand **Data storage** > **File shares**, select the share name from `WEBSITE_CONTENTSHARE`, and browse to the `data\SitePackages` subfolder. Choose the most recent .zip file and select **Download**.  

---

The deployment package is compressed using the `squashfs` format. To see what's inside the package, you must use tools that can decompress this format.

### Capture performance benchmarks (optional)

If you plan to validate performance improvement in your app based on the migration to the Flex Consumption plan, you should (optionally) capture the performance benchmarks of your current plan. Then, you can compare them to the same benchmarks for your app running in a Flex Consumption plan for comparison.

>[!TIP]  
>Always compare performance under similar conditions, such as time-of-day, day-of-week, and client load. Try to run the two benchmarks as close together as possible.
 
Here are some benchmarks to consider for your structured performance testing:

| Suggested benchmark | Comment |
| ----- | ----- |
| **Cold-start** | Measure the time from first request to the first response after an idle period. |
| **Throughput** | Measure the maximum requests-per-second using [load testing tools](/azure/load-testing/how-to-optimize-azure-functions) to determine how the app handles concurrent requests. |
| **Latency** | Track the `P50`, `P95`, and `P99` response times under various load conditions. You can monitor these metrics in Application Insights. |

You can use this Kusto query to review the suggested latency response times in Application Insights:
 
```kusto
requests
| where timestamp > ago(1d)
| summarize percentiles(duration, 50, 95, 99) by bin(timestamp, 1h)
| render timechart
```

## Migration Steps

The actual migration of your functions from a Consumption plan app to a Flex Consumption plan app follows these main steps:

> [!div class="checklist"]
> + [Step 1: Final review of the plan](#step-1-final-review-of-the-plan)
> + [Step 2: Create an app in the Flex Consumption plan](#step-2-create-an-app-in-the-flex-consumption-plan)
> + [Step 3: Apply migrated app settings in the new app](#step-3-apply-migrated-app-settings-in-the-new-app)
> + [Step 4: Apply other app configurations](#step-4-apply-other-app-configurations)
> + [Step 5: Configure scale and concurrency settings](#step-5-configure-scale-and-concurrency-settings)
> + [Step 6: Configure storage mounts](#step-6-configure-storage-mounts)
> + [Step 7: Configure any custom domains and CORS access](#step-7-configure-any-custom-domains-and-cors-access)
> + [Step 8: Configure managed identities and assign roles](#step-8-configure-managed-identities-and-assign-roles)
> + [Step 9: Configure built-in authentication](#step-9-configure-built-in-authentication)
> + [Step 10: Configure Network Access Restrictions](#step-10-configure-network-access-restrictions)
> + [Step 11: Deploy Your App Code to the New Flex Consumption App](#step-11-deploy-your-app-code-to-the-new-flex-consumption-app)

### Step 1: Final review of the plan

Before proceeding with the migration process, take a moment to perform these last preparatory steps:

+ **Review all the collected information**: Go through all the notes, configuration details, and application settings you documented in the previous assessment and premigration sections. If anything is unclear, rerun the Azure CLI commands again or get the information from the portal.

+ **Define your migration plan**: Based on your findings, create a checklist for your migration that highlights:

   + Any settings that need special attention
   + Triggers and bindings or other dependencies that might be affected during migration
   + Testing strategy for post-migration validation
   + Rollback plan if there are unexpected issues

+ **Downtime planning**: Consider when to stop the original function app to avoid both data loss and duplicate processing of events, and how this might affect your users or downstream systems. In some cases, you might need to [disable specific functions](../disable-function.md) before stopping the entire app.

A careful final review helps ensure a smoother migration process and minimizes the risk of overlooking important configurations.

### Step 2: Create an app in the Flex Consumption plan

You can There are various ways to create a function app in the Flex Consumption plan along with other required Azure resources: 

| Create option | Reference articles |
| ----- | ----- |
| Azure CLI | [Command line quickstart](../create-first-function-cli-csharp.md#create-supporting-azure-resources-for-your-function)|
| Azure portal | [Create a function app in the Azure portal](../functions-create-function-app-portal.md) |
| Infrastructure-as-code | [ARM template](../functions-create-first-function-resource-manager.md)<br/>[azd](../create-first-function-azure-developer-cli.md)<br/>[Bicep](../functions-create-first-function-bicep.md)<br/>[Terraform](../functions-create-first-function-terraform.md) |
| Visual Studio Code | [Visual Studio Code deployment](../functions-develop-vs-code.md#publish-to-azure) |
| Visual Studio | [Visual Studio deployment](../functions-develop-vs.md#publish-to-azure) |

>[!TIP]  
>When possible, you should use Microsoft Entra ID for authentication instead of connection strings, which contain shared keys. Using managed identities is a best practice that improves security by eliminating the need to store shared secrets directly in application settings. If your original app used connection strings, the Flex Consumption plan is designed to support managed identities. Most of these links show you how to enable managed identities in your function app. 

### Step 3: Apply migrated app settings in the new app

Before deploying your code, you must configure the new app with the relevant Flex Consumption plan app settings from your original function app.

>[!IMPORTANT]  
>Not all Consumption plan app settings are supported when running in a Flex Consumption plan. For more information, see [Flex Consumption plan deprecations](../functions-app-settings.md#flex-consumption-plan-deprecations).

#### [Azure CLI](#tab/azure-cli)

Run this script that performs these tasks:

1. Gets app settings from the old app, ignoring settings that don't apply in a Flex Consumption plan or that already exist in the new app. 
1. Writes the collected settings locally to a temporary file.
1. Applies settings from the file to your new app.
1. Deletes the temporary file.

```azurecli
sourceAppName=<SOURCE_APP_NAME>
destAppName=<DESTINATION_APP_NAME>
rgName=<RESOURCE_GROUP>

echo "Getting app settings from the old app..."
app_settings=$(az functionapp config appsettings list --name $sourceAppName --resource-group $rgName)

# Filter out settings that don't apply to Flex Consumption apps or that will already have been created
filtered_settings=$(echo "$app_settings" | jq 'map(select(
  (.name | ascii_downcase) != "website_use_placeholder_dotnetisolated" and
  (.name | ascii_downcase | startswith("azurewebjobsstorage") | not) and
  (.name | ascii_downcase) != "website_mount_enabled" and
  (.name | ascii_downcase) != "enable_oryx_build" and
  (.name | ascii_downcase) != "functions_extension_version" and
  (.name | ascii_downcase) != "functions_worker_runtime" and
  (.name | ascii_downcase) != "functions_worker_runtime_version" and
  (.name | ascii_downcase) != "functions_max_http_concurrency" and
  (.name | ascii_downcase) != "functions_worker_process_count" and
  (.name | ascii_downcase) != "functions_worker_dynamic_concurrency_enabled" and
  (.name | ascii_downcase) != "scm_do_build_during_deployment" and
  (.name | ascii_downcase) != "website_contentazurefileconnectionstring" and
  (.name | ascii_downcase) != "website_contentovervnet" and
  (.name | ascii_downcase) != "website_contentshare" and
  (.name | ascii_downcase) != "website_dns_server" and
  (.name | ascii_downcase) != "website_max_dynamic_application_scale_out" and
  (.name | ascii_downcase) != "website_node_default_version" and
  (.name | ascii_downcase) != "website_run_from_package" and
  (.name | ascii_downcase) != "website_skip_contentshare_validation" and
  (.name | ascii_downcase) != "website_vnet_route_all" and
  (.name | ascii_downcase) != "applicationinsights_connection_string"
))')

echo "Settings to migrate..."
echo "$filtered_settings"

echo "Writing settings to a local a local file (app_settings_filtered.json)..."
echo "$filtered_settings" > app_settings_filtered.json

echo "Applying settings to the new app..."
output=$(az functionapp config appsettings set --name $destAppName --resource-group $rgName --settings @app_settings_filtered.json)

echo "Deleting the temporary settings file..."
rm -rf app_settings_filtered.json  

echo "Current app settings in the new app..."
az functionapp config appsettings list --name $destAppName --resource-group $rgName 
```

In this example, replace `<RESOURCE_GROUP>`, `<SOURCE_APP_NAME>`, and `<DEST_APP_NAME>` with your resource group name and the old a new app names, respectively. This script assumes that both apps are in the same resource group.  

#### [Azure portal](#tab/azure-portal)

To transfer settings:

1. In the [Azure portal], search for or otherwise navigate to the page for your new app.

1. In the left menu, expand **Settings** > **Environment variables** and in the **App settings** tab select **+ Add**.

1. Type or paste-in both the setting **Name** and **Value** and then select **Apply**.
 
1. Repeat the previous step for each setting in the old app that you need to recreate in the new app. If a setting already exists in the new app, skip it. You should also skip any setting that's [deprecated in the Flex Consumption plan](../functions-app-settings.md#flex-consumption-plan-deprecations).

1. After adding all relevant settings, select **Apply** > **Save**.

---

### Step 4: Apply other app configurations

Find the list of other app configurations from your old app that you [collected during premigration](#collect-application-configurations) and also set them in the new app. 

#### [Azure CLI](#tab/azure-cli)

In this script, set the value for any configuration set in the original app and comment-out any commands for any configuration not set (`null`):

```azurecli
appName=<APP_NAME>
rgName=<RESOURCE_GROUP>
http20Setting=<YOUR_HTTP_20_SETTING>
minTlsVersion=<YOUR_TLS_VERSION>
minTlsCipher=<YOUR_TLS_CIPHER>
httpsOnly=<YOUR_HTTPS_ONLY_SETTING>
certEnabled=<CLIENT_CERT_ENABLED>
certMode=<YOUR_CLIENT_CERT_MODE>
certExPaths=<CERT_EXCLUSION_PATHS>
scmAllowBasicAuth=<ALLOW_SCM_BASIC_AUTH>

# Apply HTTP version and minimum TLS settings
az functionapp config set --name $appName --resource-group $rgName --http20-enabled $http20Setting  
az functionapp config set --name $appName --resource-group $rgName --min-tls-version $minTlsVersion

# Apply the HTTPS-only setting
az functionapp update --name $appName --resource-group $rgName --set HttpsOnly=$httpsOnly

# Apply incoming client cert settings
az functionapp update --name $appName --resource-group $rgName --set clientCertEnabled=$certEnabled
az functionapp update --name $appName --resource-group $rgName --set clientCertMode=$certMode
az functionapp update --name $appName --resource-group $rgName --set clientCertExclusionPaths=$certExPaths

# Apply the TLS cipher suite setting
az functionapp update --name $appName --resource-group $rgName --set minTlsCipherSuite=$minTlsCipher

# Apply the allow scm basic auth configuration
az resource update --resource-group $rgName --name scm --namespace Microsoft.Web --resource-type basicPublishingCredentialsPolicies \
	--parent sites/$appName --set properties.allow=$scmAllowBasicAuth
```

In this example, replace `<RESOURCE_GROUP>` and `<APP_NAME>` with your resource group and function app names, respectively. Also, replace the placeholders of any variable definitions for existing settings you want to recreate in the new app, and comment-out any `null` settings.   

#### [Azure portal](#tab/azure-portal)

1. In the [Azure portal], search for or otherwise navigate to the page for your new app.

1. In the left menu, expand **Settings** > **Configuration** and on the **General settings** tab update these settings to match what you documented from your original Consumption plan app:

  + **SCM Basic Auth Publishing Credentials**
  + **HTTP version**
  + **HTTPS Only**
  + **Minimum Inbound TLS Version and cypher**
  + **Client Certificate settings**

1. Select **Save** to apply the configuration changes.

---

### Step 5: Configure scale and concurrency settings

The Flex Consumption plan implements per-function scaling, where each function within your app can scale independently based on its workload. Scaling is also more strictly related to concurrency settings, which are used to make scaling decisions based on the current concurrent executions. For more information, see both [Per-function scaling](../flex-consumption-plan.md#per-function-scaling) and [Concurrency](../flex-consumption-plan.md#concurrency) in the Flex Consumption plan article.

Consider concurrency settings first if you want your new app to scale similarly to your original app. Setting higher concurrency values can result in fewer instances being created to handle the same load.

If you had a custom scale-out limit set in your original app, you can also apply it to your new app. Otherwise, you can skip to the next section. The maximum instance count you set must be higher than 40, which is the default.

#### [Azure CLI](#tab/azure-cli)

Use this [`az functionapp scale config set`](/cli/azure/functionapp/scale/config#az-functionapp-scale-config-set) command to set the maximum scale-out.

```azurecli
az functionapp scale config set --name <APP_NAME> --resource-group <RESOURCE_GROUP> \
    --maximum-instance-count <MAX_SCALE_SETTING>
```

In this example, replace `<RESOURCE_GROUP>` and `<APP_NAME>` with your resource group and function app names, respectively. Replace `<MAX_SCALE_SETTING>` with the maximum scale value you're setting.

#### [Azure portal](#tab/azure-portal)

To configure scale and concurrency in your new app: 

1. In the [Azure portal], search for or otherwise navigate to the page for your new app.

1. In the left menu, expand **Settings** > **Scale and concurrency** and for **Maximum instance count** set a maximum value out to which your app is allowed to scale.

1. Select `Save` to apply the changes.

---

### Step 6: Configure storage mounts

If your original app ran on Linux and had one or more explicitly connected storage shares, you might want to reconnect the same storage shares in your new app.

#### [Azure CLI](#tab/azure-cli)

Use this [`az webapp config storage-account add`](/cli/azure/webapp/config/storage-account#az-webapp-config-storage-account-add) command to reconnect each storage share in your new app.

```azurecli
az webapp config storage-account add --name <APP_NAME> --resource-group <RESOURCE_GROUP> \
  --custom-id <MOUNT_NAME> --storage-type AzureFiles --account-name <STORAGE_ACCOUNT> \
  --share-name <STORAGE_SHARE_NAME> --access-key <ACCESS_KEY> --mount-path <MOUNT_PATH>
```

In this example, make these replacements based on the details you documented during premigration:

| Placeholder | Description | 
| ----- | ----- | 
| `<APP_NAME>` | The name of your function app. |
| `<RESOURCE_GROUP>` | The name of your resource group. |
| `<STORAGE_ACCOUNT>` | The name of your storage account to connect. |
| `<ACCESS_KEY>` | The key used access the storage account, which is only needed when using key-based access. |
| `<STORAGE_SHARE_NAME>` | Name of the Azure Files share in your storage account. |
| `<MOUNT_NAME>` | The name used for the connected share in your app. |
| `<MOUNT_PATH>` | The path to your connected share in your app. |

Repeat this step for each file share being reconnected.

#### [Azure portal](#tab/azure-portal)

To reconnect file shares in your new app: 

1. In the [Azure portal], search for or otherwise navigate to the page for your new app.

1. In the left menu, expand **Settings** > **Configuration** and on the **Path mappings** tab select **+ New Azure Storage Mount** and set these mount properties based on the details you documented during premigration:

    | Property | Description | 
    | ----- | ----- | 
    | **Name** | The name used for the connected share in your app. |
    | **Storage account** | Select the storage account to connect. |
    | **Storage type** | Choose **Azure Files**. |
    | **Protocol** | Choose **SMB**. |
    | **Storage container** | Select the name of the share in your storage account. |
    | **Mount path** | The path to your connected share in your app. |
    
1. Select `OK` and repeat the previous step for any other shares you need to reconnect. 

1. When you're done adding shares, select `Save`.

---

### Step 7: Configure any custom domains and CORS access

If your original app had any bound custom domains or any CORS settings defined, recreate them in your new app. For more information about custom domains, see [Set up an existing custom domain in Azure App Service](../../app-service/app-service-web-tutorial-custom-domain.md).

#### [Azure CLI](#tab/azure-cli)

1. Use this [`az functionapp config hostname add`](/cli/azure/functionapp/config/hostname#az-functionapp-config-hostname-add) command to rebind any custom domain mappings to your app: 

    ```azurecli
    az functionapp config hostname add --name <APP_NAME> --resource-group <RESOURCE_GROUP> \
        --hostname <CUSTOM_DOMAIN>
    ```

    In this example, replace `<RESOURCE_GROUP>` and `<APP_NAME>` with your resource group and function app names, respectively. Replace `<CUSTOM_DOMAIN>` with your custom domain name. 

1. Use this [`az functionapp cors add`](/cli/azure/functionapp/cors#az-functionapp-cors-add) command to replace any CORS settings:

    ```azurecli
    az functionapp cors add --name <APP_NAME> --resource-group <RESOURCE_GROUP> \
        --allowed-origins <ALLOWED_ORIGIN_1> <ALLOWED_ORIGIN_2> <ALLOWED_ORIGIN_N>
    ```

    In this example, replace `<RESOURCE_GROUP>` and `<APP_NAME>` with your resource group and function app names, respectively. Replace `<ALLOWED_ORIGIN_*>` with your allowed origins. 

#### [Azure portal](#tab/azure-portal)

1. In the [Azure portal], search for or otherwise navigate to the page for your new app.

1. In the left menu, expand **Settings** > **Custom domains**, select **+ Add custom domain**, configure the custom domain, select **Validate**, and then select **Add**.

1. Repeat the previous step to add any other custom domains.  

1. In the left menu, expand **API** > **CORS**, add one or more **Allowed origins**, and select **Save**.

---

### Step 8: Configure managed identities and assign roles

The way that you configure managed identities in your new app depends on the kind of managed identity:

| Managed identity type | Create identity | Role assignments | 
| ----- | ----- | ----- |
| System-assigned | Yes | Because each function app has its own system-assigned managed identity, you must enable the system-assigned managed identity in the new app and reassign the same roles as in the original app. |
| User-assigned | Optional | You can continue to use the same user-assigned managed identities with the new app. You must reassign these identities to your app and verify that verify that they still have the correct role assignments in remote services. If you choose to create new identities for the new app, you must assign the same roles as the existing identities. |  

Recreating the role assignments correctly is key to ensuring your function app has the same access to Azure resources after the migration.

>[!TIP]  
>If your original app used connection strings or other shared secrets for authentication, this is a great opportunity to improve your app's security by switching to using Microsoft Entra ID authentication with managed identities. For more information, see [Tutorial: Create a function app that connects to Azure services using identities instead of secrets](../functions-identity-based-connections-tutorial.md). 

#### [System-assigned](#tab/system-assigned/azure-cli)

1. Use this [`az functionapp identity assign`](/cli/azure/functionapp/identity#az-functionapp-identity-assign) command to enable the system-assigned managed identity in your new app:

    ```azurecli
    az functionapp identity assign --name <APP_NAME> --resource-group <RESOURCE_GROUP>
    ```
    
    In this example, replace `<RESOURCE_GROUP>` and `<APP_NAME>` with your resource group and function app names, respectively.

1. Use this script to get the principal ID of the system assigned identity and add it to the required roles: 

    ```azurecli
    # Get the principal ID of the system identity
    principalId=$(az functionapp identity show --name <APP_NAME> --resource-group <RESOURCE_GROUP> \
        --query principalId -o tsv)
    
    # Assign a role in a specific resource (scope) to the system identity
    az role assignment create --assignee $principalId --role "<ROLE_NAME>" --scope "<RESOURCE_ID>"
    ```
    
    In this example, replace `<RESOURCE_GROUP>` and `<APP_NAME>` with your resource group and function app names, respectively. Replace `<ROLE_NAME>` and `<RESOURCE_ID>` with the role name and specific resource you captured from the original app. 

1. Repeat the previous commands for each role required by the new app. 

#### [User-assigned](#tab/user-assigned/azure-cli)

Use this script to get the ID of an existing user-assigned managed identity and associate it with your new app:

```azurecli
appName=<APP_NAME>
rgName=<RESOURCE_GROUP>
userName=<USER_IDENTITY_NAME>

userId=$(az identity show --name $userName --resource-group $rgName --query 'id' -o tsv)
az functionapp identity assign --name $appName --resource-group $rgName --identities $userId
```

Repeat this script for each role required by the new app.

#### [System-assigned](#tab/system-assigned/azure-portal)

1. In the [Azure portal], search for or otherwise navigate to the page for your new app.

1. In the left menu, expand **Settings** > **Identity** and on the **System assigned** tab set **Status** to **On**.

1. Select **Azure role assignments** in the left pane. 

1. Select **+ Add role assignment** the set these assignment properties for a role you documented in the original app:

    | Property | Description | 
    | ----- | ----- | 
    | **Scope** | The resource type being accessed. |
    | **Subscription** | The subscription of the resource. |
    | **Resource** | The specific resource within the selected scope. |
    | **Role** | Search for and select the role being assigned. |

1. Select **Save** to add the scope, and repeat the previous step for each documented role required by the new app.

#### [User-assigned](#tab/user-assigned/azure-portal)

1. In the [Azure portal], search for or otherwise navigate to the page for your new app.

1. In the left menu, expand **Settings** > **Identity** and on the **User assigned** tab select **+ Add**.

1. Select an existing identity and then **Add**.

1. Select the identity you just added and select **Azure role assignments** in the left pane.

1. Select **+ Add role assignment** the set these assignment properties for a role you documented in the original app:

    | Property | Description | 
    | ----- | ----- | 
    | **Scope** | The resource type being accessed. |
    | **Subscription** | The subscription of the resource. |
    | **Resource** | The specific resource within the selected scope. |
    | **Role** | Search for and select the role being assigned. |

1. Select **Save** to add the scope, and repeat the previous step for each documented role required by the new app.

---

### Step 9: Configure built-in authentication

If your original app used built-in client authentication, you should recreate it in your new app. If you're planning to reuse the same client registration, make sure to set the new app's authenticated endpoints in the authentication provider. Follow the steps for your specific authentication provider.

#### [Microsoft Entra](#tab/microsoft-entra/azure-cli)

Use this [`az webapp auth update`](/cli/azure/webapp/auth#az-webapp-auth-update) command to recreate the client-based authentication for both Microsoft Entra ID and in your new app:

```azurecli
az webapp auth update --name <APP_NAME> --resource-group <RESOURCE_GROUP> \
   --enabled true --action LoginWithAzureActiveDirectory \
   --aad-client-id <AAD_CLIENT_ID> --aad-issuer-url <AAD_ISSUER_URL>
```

In this example, replace `<RESOURCE_GROUP>` and `<APP_NAME>` with your resource group and function app names, respectively. Replace the remaining variables with the credentials required to connect to the authenticator. For more information, see [Configure your Azure Functions app to use Microsoft Entra sign-in](../../app-service/configure-authentication-provider-aad.md). 

#### [Google](#tab/google/azure-cli)

Use this [`az webapp auth update`](/cli/azure/webapp/auth#az-webapp-auth-update) command to recreate the client-based authentication in your new app:

```azurecli
az webapp auth update --name <APP_NAME> --resource-group <RESOURCE_GROUP> \
   --enabled true --action LoginWithGoogle --google-client-id <GOOGLE_CLIENT_ID> \
   --google-client-secret <GOOGLE_CLIENT_SECRET>
```

In this example, replace `<RESOURCE_GROUP>` and `<APP_NAME>` with your resource group and function app names, respectively. Replace the remaining variables with the credentials required to connect to the authenticator. For more information, see [Configure your Azure Functions app to use Google authentication](../../app-service/configure-authentication-provider-google.md). 
 

#### [Facebook](#tab/facebook/azure-cli)

Use this [`az webapp auth update`](/cli/azure/webapp/auth#az-webapp-auth-update) command to recreate the client-based authentication in your new app:

```azurecli
az webapp auth update --name <APP_NAME> --resource-group <RESOURCE_GROUP> \
   --enabled true --action LoginWithFacebook --facebook-app-id <FACEBOOK_APP_ID> \
   --facebook-app-secret <FACEBOOK_APP_SECRET>
```

In this example, replace `<RESOURCE_GROUP>` and `<APP_NAME>` with your resource group and function app names, respectively. Replace the remaining variables with the credentials required to connect to the authenticator. For more information, see [Configure your Azure Functions app to use Facebook login](../../app-service/configure-authentication-provider-facebook.md). 

#### [GitHub](#tab/github/azure-cli)

Use this [`az webapp auth update`](/cli/azure/webapp/auth#az-webapp-auth-update) command to recreate the client-based authentication in your new app:

```azurecli
az webapp auth update --name <APP_NAME> --resource-group <RESOURCE_GROUP> \
   --enabled true --action LoginWithGitHub --github-client-id <GITHUB_CLIENT_ID> \
   --github-client-secret <GITHUB_CLIENT_SECRET>
```

In this example, replace `<RESOURCE_GROUP>` and `<APP_NAME>` with your resource group and function app names, respectively. Replace the remaining variables with the credentials required to connect to the authenticator. For more information, see [Configure your Azure Functions app to use GitHub login](../../app-service/configure-authentication-provider-github.md). 

#### [X](#tab/twitter/azure-cli)

Use this [`az webapp auth update`](/cli/azure/webapp/auth#az-webapp-auth-update) command to recreate the client-based authentication in your new app:

```azurecli
az webapp auth update --name <APP_NAME> --resource-group <RESOURCE_GROUP> \
   --enabled true --action LoginWithTwitter --twitter-consumer-key <TWITTER_CONSUMER_KEY> \
   --twitter-consumer-secret <TWITTER_CONSUMER_SECRET>
```

In this example, replace `<RESOURCE_GROUP>` and `<APP_NAME>` with your resource group and function app names, respectively. Replace the remaining variables with the credentials required to connect to the authenticator. For more information, see [Configure your Azure Functions app to use X login](../../app-service/configure-authentication-provider-twitter.md). 

#### [Microsoft Entra](#tab/microsoft-entra/azure-portal)

1. In the [Azure portal], search for or otherwise navigate to the page for your new app.

1. In the left menu, expand **Settings** > **Authentication** and select **Add identity provider**.

1. Select **Microsoft** as the **Identity provider** and set the configurations and permissions required by the authenticator. For more information, see [Configure your Azure Functions app to use Microsoft Entra sign-in](../../app-service/configure-authentication-provider-aad.md).
 
1. Select **Add** to add the authenticator.

#### [Google](#tab/google/azure-portal)

1. In the [Azure portal], search for or otherwise navigate to the page for your new app.

1. In the left menu, expand **Settings** > **Authentication** and select **Add identity provider**.

1. Select **Google** as the **Identity provider** and set the configurations and permissions required by the authenticator. For more information, see [Configure your Azure Functions app to use Google authentication](../../app-service/configure-authentication-provider-google.md). 
 
1. Select **Add** to add the authenticator.

#### [Facebook](#tab/facebook/azure-portal)

1. In the [Azure portal], search for or otherwise navigate to the page for your new app.

1. In the left menu, expand **Settings** > **Authentication** and select **Add identity provider**.

1. Select **Facebook** as the **Identity provider** and set the configurations and permissions required by the authenticator. For more information, see [Configure your Azure Functions app to use Facebook login](../../app-service/configure-authentication-provider-facebook.md). 
 
1. Select **Add** to add the authenticator.

#### [GitHub](#tab/github/azure-portal)

1. In the [Azure portal], search for or otherwise navigate to the page for your new app.

1. In the left menu, expand **Settings** > **Authentication** and select **Add identity provider**.

1. Select **GitHub** as the **Identity provider** and set the configurations and permissions required by the authenticator. For more information, see [Configure your Azure Functions app to use GitHub login](../../app-service/configure-authentication-provider-github.md). 
 
1. Select **Add** to add the authenticator.

#### [X](#tab/twitter/azure-portal)

1. In the [Azure portal], search for or otherwise navigate to the page for your new app.

1. In the left menu, expand **Settings** > **Authentication** and select **Add identity provider**.

1. Select **Twitter** as the **Identity provider** and set the configurations and permissions required by the authenticator. For more information, see [Configure your Azure Functions app to use X login](../../app-service/configure-authentication-provider-twitter.md). 
 
1. Select **Add** to add the authenticator.

---

### Step 10: Configure Network Access Restrictions

If your original app had any IP-based inbound access restrictions, you can recreate any of the same inbound access rules you want to keep in your new app. 

>[!TIP]
>The Flex Consumption plan fully supports virtual network integration. For more information, see [Virtual network integration](../flex-consumption-plan.md#virtual-network-integration).  

#### [Azure CLI](#tab/azure-cli)

Use this [`az functionapp config access-restriction add`](/cli/azure/functionapp/config/access-restriction#az-functionapp-config-access-restriction-add) command for each IP access restriction you want to replicate in the new app:

```azurecli
az functionapp config access-restriction add --name <APP_NAME> --resource-group <RESOURCE_GROUP> \
  --rule-name <RULE_NAME> --action Deny --ip-address <IP_ADDRESS> --priority <PRIORITY>
```

In this example, replace these placeholders with the values from your original app:

| Placeholder | Value |
| ---- | ----- |
| `<APP_NAME>` | Your function app name. |
| `<RESOURCE_GROUP>` | Your resource group. |
| `<RULE_NAME>` | Friendly name for the IP rule. |
| `<Priority>` | Priority for the exclusion. |
| `<IP_Address>` | The IP address to exclude. |

Run this command for each documented IP restriction from the original app.

#### [Azure portal](#tab/azure-portal)

To add IP-based networking restrictions:

1. In the [Azure portal], search for or otherwise navigate to the page for your new app.

1. In the left menu, expand **Settings** > **Networking** and select the link next to **Public network access**.

1. In the **Access restrictions** page under **Site access and rules**, select **+ Add** and enter these settings for a specific IP restriction:

    | Setting | Value |
    | ---- | ----- |
    | **Name** | Friendly name for the IP rule. |
    | **Action** | **Deny** |
    | **Priority** | Priority for the exclusion. |
    | **Type** | Select either **IPv4** or **IPv6**. |
    | **IP Address Block** | The IP addresses to exclude. |
   
1. Select **Add rule** and repeat the previous step for each access restriction you documented. 

1. After you enter all of the IP restrictions from the original app, select **Save**.

---

### Step 11: Deploy Your App Code to the New Flex Consumption App

With your new Flex Consumption plan app fully configured based on the settings from the original app, it's time to deploy your code to the new app resources in Azure. 

>[!CAUTION]
>After successful deployment, triggers in your new app immediately start processing data from connected services. To minimize duplicated data and prevent data loss while starting the new app and shutting-down the original app, you should review the strategies that you defined in [mitigations by trigger type](#mitigations-by-trigger-type). 

Functions provides several ways to deploy your code, either from the code project or as a ready-to-run deployment package.

>[!TIP]  
>If your project code is maintained in a source code repository, now is the perfect time to configure a continuous deployment pipeline. Continuous deployment lets you automatically deploy application updates based on changes in a connected repository. 

#### [Continuous code deployment](#tab/continuous)

You should update your existing deployment workflows to deploy your source code to your new app:

+ [Build and deploy using Azure Pipelines](../functions-how-to-azure-devops.md)
+ [Build and deploy using GitHub Actions](../functions-how-to-github-actions.md)

You can also create a new continuous deployment workflow for your new app. For more information, see [Continuous deployment for Azure Functions](../functions-continuous-deployment.md)

#### [Ad-hoc code deployment](#tab/ad-hoc)

You can use these tools to achieve a one-off deployment of your code project to your new plan:

+ [Visual Studio Code](../functions-develop-vs-code.md#republish-project-files)
+ [Visual Studio](../functions-develop-vs.md#publish-to-azure)
+ [Azure Functions Core Tools](../functions-run-local.md#project-file-deployment) 

#### [Package deployment](#tab/package)

You can use this [az functionapp deployment source config-zip](/cli/azure/functionapp/deployment/source#az-functionapp-deployment-source-config-zip) command to redeploy a downloaded package or a newly created deployment package: 

  ```azurecli
  az functionapp deployment source config-zip --resource-group <RESOURCE_GROUP> --name <APP_NAME> --src <PACKAGE_PATH>
  ```

In this example, replace `<RESOURCE_GROUP>` and `<APP_NAME>` with your resource group and function app names, respectively. Replace `<PACKAGE_PATH>` with the path and file name of your deployment package, such as `/path/to/function/package.zip`.

---

## Post-migration tasks

After a successful migration, you should perform these follow-up tasks:

> [!div class="checklist"]
> + [Verify basic functionality](#verify-basic-functionality)
> + [Enable monitoring](#enable-monitoring)
> + [Capture performance benchmarks](#capture-performance-benchmarks)
> + [Create custom dashboards](#create-custom-dashboards)
> + [Refine plan settings](#refine-plan-settings)
> + [Remove the original app (optional)](#remove-the-original-app-optional)

### Verify basic functionality

1. Verify the new app is running in a Flex Consumption plan:

    #### [Azure CLI](#tab/azure-cli)
    
    Use this [`az functionapp show`](/cli/azure/functionap#az-functionapp-show) command two view the details about the hosting plan:
    
    ```azurecli    
    az functionapp show --name <APP_NAME> --resource-group <RESOURCE_GROUP> --query "serverFarmId"
    ```
    
    In this example, replace `<RESOURCE_GROUP>` and `<APP_NAME>` with your resource group and function app names, respectively. 
    
    #### [Azure portal](#tab/azure-portal)
    
    1. In the [Azure portal], search for or otherwise navigate to the page for your new app.

    1. In **Overview** > **Essentials**, verify that the **Status** of your app is `Running` and that the **Plan type** is `Flex Consumption`.
    
    ---

1. Use an HTTP client to call at least one HTTP trigger endpoint on your new app to make sure it responds as expected.

### Enable monitoring

After a successful migration, make sure that Application Insights in enabled in your new app. Implement a comprehensive monitoring strategy that covers app metrics, logs, and costs. By using such a strategy, you can validate the success of your migration, identify any issues promptly, and optimize the performance and cost of your new app. For more information, see [Configure monitoring](../flex-consumption-how-to.md#monitor-your-app-in-azure).

### Capture performance benchmarks 

With your new app running, you can run the same performance benchmarks that you collected from your original app, such as:

| Suggested benchmark | Comment |
| ----- | ----- |
| **Cold-start** | Measure the time from first request to the first response after an idle period. |
| **Throughput** | Measure the maximum requests-per-second using [load testing tools](/azure/load-testing/how-to-optimize-azure-functions) to determine how the app handles concurrent requests. |
| **Latency** | Track the `P50`, `P95`, and `P99` response times under various load conditions. You can monitor these metrics in Application Insights. |

You can use this Kusto query to review the suggested latency response times in Application Insights:
 
```kusto
requests
| where timestamp > ago(1d)
| summarize percentiles(duration, 50, 95, 99) by bin(timestamp, 1h)
| render timechart
```

>[!NOTE]  
>Flex Consumption plan metrics differ from Consumption plan metrics. When comparing performance before and after migration, keep in mind that you must use different metrics to track similar performance characteristics. For more information, see [Configure monitoring](../flex-consumption-how-to.md#monitor-your-app-in-azure). 

### Create custom dashboards

Azure Monitor metrics and Application Insights enable you to [create dashboards in the Azure portal](/azure/azure-portal/azure-portal-dashboards) that display charts from both platform metrics and runtime logs and analytics.

Consider setting-up dashboards and alerts on your key metrics in the Azure portal. For more information, see [Monitor your app in Azure](../flex-consumption-how-to.md?tabs=azure-portal#monitor-your-app-in-azure). 

### Refine plan settings

Actual performance improvements and cost implications of the migration can vary based on your app-specific workloads and configuration. The Flex Consumption plan provides several settings that you can adjust to refine the performance of your app. You might want to make adjustments to more closely match the behavior of the original app or to balance cost versus performance. For more information, see [Fine-tune your app](../flex-consumption-how-to.md#fine-tune-your-app) in the Flex Consumption article.

### Remove the original app (optional)

After thoroughly testing your new Flex Consumption function app and validating that everything is working as expected, you might want to clean up resources to avoid unnecessary costs. Even though triggers in the original app are likely already disabled, you might wait a few days or even weeks before removing the original app entirely. This delay, which depends on your application's usage patterns, makes sure that all scenarios, including infrequent ones, are properly tested. Only after you're satisfied with the migration results, should you proceed to remove your original function app.

>[!IMPORTANT]  
>This action deletes your original function app. The Consumption plan remains intact if other apps are using it. Before you proceed, make sure you've successfully migrated all functionality to the new Flex Consumption app, verified no traffic is being directed to the original app, and backed up any relevant logs, configuration, or data that might be needed for reference.

#### [Azure CLI](#tab/azure-cli)

Use the [`az functionapp delete`](/cli/azure/functionapp#az-functionapp-delete) command to delete the original function app:

```azurecli
az functionapp delete --name <ORIGINAL_APP_NAME> --resource-group <RESOURCE_GROUP>
```
In this example, replace `<RESOURCE_GROUP>` and `<APP_NAME>` with your resource group and function app names, respectively. 

#### [Azure portal](#tab/azure-portal)

1. In the [Azure portal], search for or otherwise navigate to the page for your new app.

1. Select **Delete** from the top menu. 

1. Confirm the deletion by typing the app name and selecting **Delete**.

---

## Troubleshooting and Recovery Strategies

Despite careful planning, migration issues may occur. Here's how to handle potential issues during migration:

| Issue | Solution |
|-------|----------|
| Cold start performance issues | • Review [concurrency settings](../flex-consumption-how-to.md#set-http-concurrency-limits)<br/>• Check for missing dependencies |
| Missing bindings | • Verify [extension bundles](../extension-bundles.md)<br/>• Update binding configurations |
| Permission errors | • Check identity assignments and role permissions |
| Network connectivity issues | • Validate access restrictions and networking settings |
| Missing application insights | • Recreate the [Application Insights connection](../configure-monitoring.md#enable-application-insights-integration) |
| App fails to start | See [General troubleshooting steps](#general-troubleshooting-steps) |
| Triggers aren't processing events | See [General troubleshooting steps](#general-troubleshooting-steps) |

If you experience issues migrating a production app, you might want to [rollback the migration to the original app](#rollback-steps-for-critical-production-apps) while you troubleshoot.

### General troubleshooting steps

Use these steps for cases where the new app fails to start or function triggers aren't processing events:

1. In your new app page in the [Azure portal], select **Diagnose and solve problems** in the left pane of the app page. Select **Availability and Performance** and review the **Function App Down or Reporting Errors** detector. For more information, see [Azure Functions diagnostics overview](../functions-diagnostics.md).

1. In the app page, select **Monitoring** > **Application Insights** > **View Application Insights data** then select **Investigate** > **Failures** and check for any failure events. 

1. Select **Monitoring** > **Logs** and run this Kusto query to check these  tables for errors:

    #### [traces](#tab/traces-table)
    ```kusto
    traces
        | where severityLevel == 3
        | where cloud_RoleName == "<APP_NAME>"
        | where timestamp > ago(1d)
        | project timestamp, message, operation_Name, customDimensions
        | order by timestamp desc
    ```

    #### [requests](#tab/requests-table)

    ```kusto
    requests
        | where success == false
        | where cloud_RoleName == "<APP_NAME>"
        | where timestamp > ago(1d)
        | project timestamp, name, resultCode, url, operation_Name, customDimensions
        | order by timestamp desc
    ```  

    ---

    In these queries, replace `<APP_NAME>` with the name of your new app. These queries check for errors in the past day (`where timestamp > ago(1d)`). 

1. Back in the app page, select **Settings** > **Environment variables** and verify that all critical application settings were correctly transferred. Look for any [deprecated settings](../functions-app-settings.md#flex-consumption-plan-deprecations) that might have been incorrectly migrated or any typos or incorrect connection strings. Verify the [default host storage connection](../functions-recover-storage-account.md). 

1. Select **Settings** > **Identity** and double-check that the expected identities exist and that they have been assigned to the correct roles.  

1. In your code, verify that all binding configurations are correct, paying particular attention to connection string names, storage queue and container names, and consumer group settings in Event Hubs triggers.

### Rollback steps for critical production apps

If you aren't able to troubleshoot successfully, you might want to revert to using your original app while you continue to troubleshoot. 

1. If the original app was stopped, restart it:

    #### [Azure CLI](#tab/azure-cli)

    Use this [`az functionapp start`](/cli/azure/functionapp#az-functionapp-start) command to restart the original function app:
    
    ```azurecli
    az functionapp delete --name <ORIGINAL_APP_NAME> --resource-group <RESOURCE_GROUP>
    ```
    
    #### [Azure portal](#tab/azure-portal)
    
    In the [Azure portal], search for or otherwise navigate to the page for your new app and select **Start** from the top menu. 
    
    ---

1. If you created new queues/topics/containers, ensure clients are redirected back to the original resources.

1. If you modified DNS or custom domains, revert these changes to point to the original app.

## Providing feedback

If you encounter issues with your migration using this article or want to provide other feedback on this guidance, use this Microsoft Q&A question to provide your feedback: `<<QUESTION>>`

## Related articles

+ [Flex Consumption plan overview](../flex-consumption-plan.md)
+ [How to use the Flex Consumption plan](../flex-consumption-how-to.md)
+ [Flex Consumption plan general availability announcement](https://techcommunity.microsoft.com/blog/appsonazureblog/azure-functions-flex-consumption-is-now-generally-available/4298778)
+ [Flex Consumption plan-specific samples](https://github.com/Azure-Samples/azure-functions-flex-consumption-samples)

[Azure portal]: https://portal.azure.com