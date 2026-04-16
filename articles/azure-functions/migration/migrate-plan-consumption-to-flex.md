---
title: Migrate Consumption plan apps to Flex Consumption in Azure Functions
description: Learn how to migrate an existing function app in Azure running in an Azure Functions Consumption hosting plan to instead run in the Flex Consumption hosting plan.
ms.service: azure-functions
ms.collection: 
 - migration
ms.date: 04/09/2026
ms.topic: concept-article
zone_pivot_groups: app-service-platform-windows-linux

#customer intent: As a developer, I want to learn how to migrate my existing serverless applications in Azure Functions from the Consumption host plan to the Flex Consumption hosting plan.
---

# Migrate Consumption plan apps to the Flex Consumption plan

This article shows you how to migrate your existing function apps from the [Consumption plan](../consumption-plan.md) to the [Flex Consumption plan](../flex-consumption-plan.md). For most apps, this migration is straightforward and your code doesn't need to change.

> [!IMPORTANT]
> Support for hosting function apps on Linux in a Consumption plan retires on September 30, 2028. As of today, feature and language enhancements aren't being made to the Linux Consumption plan. 
> Follow this article to migrate your Consumption plan apps to instead run in the Flex Consumption plan. 
> To learn more about Linux Consumption plan end-of-support dates, see [Azure Functions Consumption plan hosting (legacy)](../consumption-plan.md).

## Migration methods

This article supports migrating to a Linux function app in a Flex Consumption plan for both Linux and Windows apps. Functions provides several ways to streamline most of the migration steps, particularly for Linux apps. 

The following table shows which migration methods are available for each operating system and are covered in this article.

| Migration method | Description | Linux | Windows |
| --- | --- | --- | --- |
| [Azure Skills in GitHub Copilot](https://github.com/microsoft/GitHub-Copilot-for-Azure/blob/main/plugin/skills/azure-upgrade/references/services/functions/consumption-to-flex.md).  | Let Copilot guide and automate your migration interactively (recommended for Linux). | ✅ | ❌ |
| CLI migration command | Use [`az functionapp flex-migration`](/cli/azure/functionapp/flex-migration) to automate migration. | ✅ | ❌ |
| Standard CLI commands | Stepwise migration using Azure CLI commands. | ➖ | ✅ |
| [Azure portal](https://portal.azure.com) | Stepwise migration in the Azure portal. | ✅ | ✅ |
| [Infrastructure as code](#resource-based-deployments) | Create repeatable migration code using ARM templates, Bicep files, or Terraform. | ➖ | ➖ |

✅ Supported and featured &nbsp;|&nbsp; ➖ Supported, not featured &nbsp;|&nbsp; ❌ Not supported

To see the right instructions for your app, select your operating system at the top of the article.

## What to expect

The specific steps required to migrate your Consumption plan app depends on both the operating system and your specific migration method:

::: zone pivot="platform-linux"

#### [GitHub Copilot](#tab/github-copilot)

The Azure skill automates most of the migration for you. Your high-level steps are:

> [!div class="checklist"]
> + [Set up GitHub Copilot](#prerequisites)
> + [Identify and migrate your apps](#identify-potential-apps-to-migrate)
> + [Review dependent services](#consider-dependent-services)
> + [Complete migration steps](#migration-steps)
> + [Post-migration tasks](#post-migration-tasks)

> [!TIP]
> To jumpstart your GitHub Copilot-based migration, see [Quickstart: Migrate Linux Consumption apps to Flex Consumption using GitHub Copilot](scenario-migrate-linux-consumption-to-flex.md). 

#### [Azure CLI](#tab/azure-cli)

The `flex-migration` CLI commands automate app creation and configuration. Your high-level steps are:

> [!div class="checklist"]
> + [Identify potential apps to migrate](#identify-potential-apps-to-migrate)
> + [Assess your existing app](#assess-your-existing-app)
> + [Review dependent services](#consider-dependent-services)
> + [Start the migration](#start-the-migration)
> + [Get the code deployment package](#get-the-code-deployment-package)
> + [Complete migration steps](#migration-steps)
> + [Post-migration tasks](#post-migration-tasks)

#### [Azure portal](#tab/azure-portal)

The portal provides a manual migration path. Your high-level steps are:

> [!div class="checklist"]
> + [Identify potential apps to migrate](#identify-potential-apps-to-migrate)
> + [Assess your existing app](#assess-your-existing-app)
> + [Review dependent services](#consider-dependent-services)
> + [Get the code deployment package](#get-the-code-deployment-package)
> + [Complete migration steps](#migration-steps)
> + [Post-migration tasks](#post-migration-tasks)

---

::: zone-end  
::: zone pivot="platform-windows"

#### [GitHub Copilot](#tab/github-copilot)

[!INCLUDE [functions-copilot-linux-only](~/includes/functions-copilot-linux-only.md)]

#### [Azure CLI](#tab/azure-cli)

Windows migration requires manual steps for app creation and configuration. Your high-level steps are:

> [!div class="checklist"]
> + [Identify potential apps to migrate](#identify-potential-apps-to-migrate)
> + [Assess your existing app](#assess-your-existing-app)
> + [Review dependent services](#consider-dependent-services)
> + [Complete premigration tasks](#premigration-tasks)
> + [Get the code deployment package](#get-the-code-deployment-package)
> + [Complete migration steps](#migration-steps)
> + [Post-migration tasks](#post-migration-tasks)

#### [Azure portal](#tab/azure-portal)

Windows migration requires manual steps for app creation and configuration. Your high-level steps are:

> [!div class="checklist"]
> + [Identify potential apps to migrate](#identify-potential-apps-to-migrate)
> + [Assess your existing app](#assess-your-existing-app)
> + [Review dependent services](#consider-dependent-services)
> + [Complete premigration tasks](#premigration-tasks)
> + [Get the code deployment package](#get-the-code-deployment-package)
> + [Complete migration steps](#migration-steps)
> + [Post-migration tasks](#post-migration-tasks)

---

::: zone-end

Regardless of your migration method, here are the general principles of the migration:

- **Your code stays the same.** You don't need to rewrite your functions if you're on a Flex Consumption supported language version. This guide helps you check.
- **You must create a new app.** The migration process creates a new Flex Consumption app alongside your existing one, so you can test before switching over.
- **Use the same resource group.** Your new app runs in the same resource group with access to the same dependencies.
- **You control the timing.** Test your new app thoroughly before redirecting traffic and retiring the old one.

> [!NOTE]
> If you're using Azure Government, Flex Consumption isn't available there yet. Review this guidance now so you're ready when it becomes available.

## Benefits of migrating to Flex Consumption

When you migrate, your functions get these benefits without changing your code:

+ **Faster cold starts**: Always-ready instances mean your functions respond more quickly.
+ **Better scaling**: Per-function scaling and concurrency controls give you more control.
+ **Virtual network support**: Connect your functions to private networks and use private endpoints.
+ **Active investment**: Flex Consumption is where new features and improvements land first.

For more information, see [Flex Consumption plan benefits](../flex-consumption-plan.md#benefits) and [hosting plan comparison](../functions-scale.md).

## Resource-based deployments

This article doesn't explicitly show how to use infrastructure-as-code (IaC) for migration. However, you can follow the same migration steps to convert your ARM templates, Bicep files, and Terraform configurations.

The Flex Consumption plan introduces a new `functionAppConfig` section in the `Microsoft.Web/sites` resource definition, which replaces several legacy app settings. For details on these changes, see [Flex Consumption plan deprecations](../functions-app-settings.md#flex-consumption-plan-deprecations).

These resources can help you get started with Flex Consumption resource deployments:

+ [Automate resource deployment](../functions-infrastructure-as-code.md?pivots=flex-consumption-plan) covers the full resource configuration details.
+ Ready-to-use examples are available for [ARM templates](https://github.com/Azure-Samples/azure-functions-flex-consumption-samples/tree/main/IaC/armtemplate), [Bicep](https://github.com/Azure-Samples/azure-functions-flex-consumption-samples/tree/main/IaC/bicep), and [Terraform](https://github.com/Azure-Samples/azure-functions-flex-consumption-samples/tree/main/IaC).

After a successful migration, [update your resource deployment files](#update-your-resource-deployment-files) to match the new Flex Consumption configuration.

## Prerequisites

+ Access to the Azure subscription containing one or more function apps to migrate. The account used to perform the migration tasks must have the following permissions:

    + Create and manage function apps and App Service hosting plans.
    + Assign roles to managed identities.
    + Create and manage storage accounts.
    + Create and manage Application Insights resources.
    + Access all dependent resources of your app, such as Azure Key Vault, Azure Service Bus, or Azure Event Hubs.

    Assigning the **Owner** or **Contributor** roles in your resource group generally provides sufficient permissions.

+ To migrate using the Azure CLI or GitHub Copilot: 

    + [Azure CLI](/cli/azure), version 2.77.0 or later. Required when using Azure CLI commands. The scripts are tested by using Azure CLI in [Azure Cloud Shell](/azure/cloud-shell/overview).
    + Sign in to Azure CLI by running [`az login`](/cli/azure/authenticate-azure-cli). Make sure you're signed in to the subscription that contains the function apps you want to migrate.  
    ::: zone pivot="platform-windows"   
    + The [resource-graph](../../governance/resource-graph/first-query-azurecli.md) extension, which you can install by using the [`az extension add`](/cli/azure/extension#az-extension-add) command:

    ```azurecli
    az extension add --name resource-graph
    ```

    + The [`jq` tool](https://jqlang.org/download/), which is used to work with JSON output.    
    ::: zone-end  
::: zone pivot="platform-linux"
+ To migrate using GitHub Copilot, configure GitHub Copilot in your desired mode: 

    [!INCLUDE [functions-copilot-setup](~/includes/functions-copilot-setup.md)]

::: zone-end  

## Identify potential apps to migrate

> [!TIP]
> **Already know which app to migrate?** You can skip this section and go straight to [Assess your existing app](#assess-your-existing-app).

If you have multiple function apps and aren't sure which ones need to migrate, this section helps you find them. You get a list of app names, resource groups, locations, and runtime stacks.

::: zone pivot="platform-linux" 

### [GitHub Copilot](#tab/github-copilot)

To start an interactive migration that scans your subscription and prompts you to choose which apps to migrate, use this prompt:

```
migrate my linux function apps in azure from consumption to flex consumption
```

Copilot identifies your eligible Linux Consumption apps, lets you choose which ones to migrate, and then walks you through assessment, app creation, configuration, and deployment for each app. Continue to [Migration steps](#migration-steps).

If you just want to see which apps are eligible without starting the migration, use this prompt instead:

```
list my linux consumption apps eligible for flex consumption migration
```

Copilot returns a list of eligible and ineligible apps, along with the reasons for any incompatibilities. You can then migrate a specific app by using the prompt in [Start the migration for Linux](#start-the-migration).

### [Azure CLI](#tab/azure-cli)

Run this command to see which of your Linux Consumption apps are ready to migrate:

```azurecli
az functionapp flex-migration list
```

This command automatically scans your subscription and returns two arrays:
- **eligible_apps**: Linux Consumption apps that can be migrated to Flex Consumption. These apps are compatible with Flex Consumption.
- **ineligible_apps**: Apps that can't be migrated, along with the specific reasons why. Review and address the reasons for incompatibility before continuing.

> [!NOTE]
> This command only evaluates function apps running on the **Linux Consumption plan**. Apps running on other hosting plans (Windows Consumption, Premium, Dedicated, or Flex Consumption) don't appear in either the `eligible_apps` or `ineligible_apps` arrays. If you have many function apps and aren't sure which hosting plan each one uses, run `az functionapp list --query "[].{name:name, sku:sku}" -o table` to see all apps and their SKUs, where `Dynamic` indicates a Consumption plan app.

The output includes the app name, resource group, location, and runtime stack for each app, along with eligibility status and migration readiness information.

### [Azure portal](#tab/azure-portal)

1. Go to the [Azure Resource Graph Explorer](https://portal.azure.com/#view/HubsExtension/ArgQueryBlade) in the Azure portal.

1. Copy the following Kusto query, paste it in the query window, and select **Run query**:  

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

This command creates a table with the app name, location, resource group, and runtime stack for all Consumption apps running on Linux in the current subscription.

---

::: zone-end

::: zone pivot="platform-windows" 

### [GitHub Copilot](#tab/github-copilot)

[!INCLUDE [functions-copilot-linux-only](~/includes/functions-copilot-linux-only.md)]

### [Azure CLI](#tab/azure-cli)

Use the [`az graph query`](/cli/azure/graph#az-graph-query) command to list all function apps in your subscription that run in a Consumption plan:

```azurecli
az graph query -q "resources | where subscriptionId == '$(az account show --query id -o tsv)' \
   | where type == 'microsoft.web/sites' | where ['kind'] == 'functionapp' | where properties.sku == 'Dynamic' \
   | project name, location, resourceGroup" \
   --query data --output table
```

This command creates a table with the app name, location, and resource group for all Consumption apps running on Windows in the current subscription.

If you don't already have it, you're prompted to install the [resource-graph extension](/cli/azure/graph).

### [Azure portal](#tab/azure-portal)

1. Go to the [Azure Resource Graph Explorer](https://portal.azure.com/#view/HubsExtension/ArgQueryBlade) in the Azure portal.

1. Copy the following Kusto query, paste it in the query window, and select **Run query**:  

    ```kusto
    resources 
    	| where type == 'microsoft.web/sites' 
    	| where ['kind'] == 'functionapp' 
    	| where properties.sku == 'Dynamic'
    	| project name, location, resourceGroup
    ```

This command creates a table with the app name, location, and resource group for all Consumption apps running on Windows in the current subscription.

---

::: zone-end

## Assess your existing app

:::zone pivot="platform-linux"  
_The Azure skill perform these tasks for you automatically. When using the Azure skill, go directly to [Start the migration](#start-the-migration)._
::: zone-end  

Before migrating, run through this quick checklist to make sure your app is ready. Most apps pass these checks without problems:

> [!div class="checklist"]
> + [Confirm region compatibility](#confirm-region-compatibility)
> + [Verify language stack compatibility](#verify-language-stack-compatibility)
> + [Verify stack version compatibility](#verify-stack-version-compatibility)
> + [Verify deployment slots usage](#verify-deployment-slots-usage)
> + [Verify the use of certificates](#verify-the-use-of-certificates)
> + [Verify your Blob storage triggers](#verify-your-blob-storage-triggers)

### Confirm region compatibility

Confirm that the Flex Consumption plan is currently supported in the same region as the Consumption plan app you intend to migrate.

:::zone pivot="platform-linux"

>**Confirmed:** When the `az functionapp flex-migration list` command output or Copilot assessment includes your app in the `eligible_apps` list, the Flex Consumption plan is supported in the same region used by your current Linux Consumption app. In this case, you can continue to [Verify language stack compatibility](#verify-language-stack-compatibility).

>**Action required:** When the output includes your app in the `ineligible_apps` list, you see an error message stating `The site '<name>' is not in a region supported in Flex Consumption. Please see the list of regions supported in Flex Consumption by running az functionapp list-flexconsumption-locations`. In this case, the Flex Consumption plan isn't supported in the region used by your current Linux Consumption app.

:::zone-end

:::zone pivot="platform-windows"

#### [GitHub Copilot](#tab/github-copilot)

[!INCLUDE [functions-copilot-linux-only](~/includes/functions-copilot-linux-only.md)]

#### [Azure CLI](#tab/azure-cli)

Use this [`az functionapp list-flexconsumption-locations`](/cli/azure/functionapp#az-functionapp-list-flexconsumption-locations) command to list all regions where the Flex Consumption plan is available:

```azurecli
az functionapp list-flexconsumption-locations --query "sort_by(@, &name)[].{Region:name}" -o table
```

This command generates a table of Azure regions where the Flex Consumption plan is currently supported.

#### [Azure portal](#tab/azure-portal)

The create process for a function app in the Azure portal filters out regions that the Flex Consumption plan doesn't currently support.

1. In the [Azure portal], select **Create a resource** in the left-hand menu and select **Function app** > **Create**.

1. Select **Flex Consumption** > **Select** and in the **Basics** tab expand **Region**.

1. Review the supported Flex Consumption plan regions.

Make sure that the region in which the Consumption plan app you want to migrate runs is included in the list.

---

:::zone-end

If your region isn't currently supported and you still choose to migrate your function app, your app must run in a different region where the Flex Consumption plan is supported. However, running your app in a different region from other connected services can introduce extra latency. Make sure that the new region can meet your application's performance requirements before you complete the migration.

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
| `custom`  | [Custom handlers](../functions-custom-handlers.md) | ✅ Yes   |

:::zone pivot="platform-linux"

>**Confirmed:** If the `az functionapp flex-migration list` command or Copilot assessment included your app in the `eligible_apps` list, your Linux Consumption app is already using a supported language stack by Flex Consumption and you can continue to [Verify stack version compatibility](#verify-stack-version-compatibility).

>**Action required:** If the output included your app in the `ineligible_apps` list with an error message stating `Runtime '<name>' not supported for function apps on the Flex Consumption plan.`, your Linux Consumption app isn't running a supported runtime by Flex Consumption.

:::zone-end

If your function app uses an unsupported runtime stack:

+ For C# apps that run in-process with the runtime (`dotnet`), you must first migrate your app to .NET isolated. For more information, see [Migrate C# apps from the in-process model to the isolated worker model](../migrate-dotnet-to-isolated-model.md).

### Verify stack version compatibility

Before migrating, make sure that your app's runtime stack version is supported when running in a Flex Consumption plan in the current region.

:::zone pivot="platform-linux"

>**Confirmed:** If the `az functionapp flex-migration list` command or Copilot assessment includes your app in the `eligible_apps` list, your Linux Consumption app is already using a supported language stack version by Flex Consumption and you can continue to [Verify deployment slots usage](#verify-deployment-slots-usage).

>**Action required:** If the output includes your app in the `ineligible_apps` list with an error message stating `Invalid version {0} for runtime {1} for function apps on the Flex Consumption  plan. Supported versions for runtime {1} are {2}.`, your Linux Consumption app isn't running a supported runtime by Flex Consumption.

:::zone-end

:::zone pivot="platform-windows"

#### [GitHub Copilot](#tab/github-copilot)

[!INCLUDE [functions-copilot-linux-only](~/includes/functions-copilot-linux-only.md)]

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

The create process for a function app in the Azure portal filters out language stack versions that the Flex Consumption plan doesn't currently support.

1. In the [Azure portal], select **Create a resource** in the left-hand menu and select **Function app** > **Create**.

1. Select **Flex Consumption** > **Select** and in the **Basics** tab select your language **Runtime stack** and **Region**.

1. Expand **Version** and review the supported versions of your language stack in your chosen region.

---

:::zone-end

If your function app uses an unsupported language stack version, first [upgrade your app code to a supported version](../update-language-versions.md) before migrating to the Flex Consumption plan.

### Verify deployment slots usage

Consumption plan apps can have a deployment slot defined. For more information, see [Azure Functions deployment slots](../functions-deployment-slots.md). However, the Flex Consumption plan doesn't currently support deployment slots. Before you migrate, determine if your app has a deployment slot. If it does, define a strategy for how to manage your app without deployment slots when running in a Flex Consumption plan.

:::zone pivot="platform-linux"

>**Confirmed:** When your current app has deployment slots enabled, the `az functionapp flex-migration list` command or Copilot assessment shows your function app in the `eligible_apps` list without a warning. Continue to [Verify the use of certificates](#verify-the-use-of-certificates).

>**Action required:** Your current app has deployment slots enabled, and the output shows your function app in the `eligible_apps` list but adds a warning that states: `The site '<name>' has slots configured. This condition doesn't block migration, but please note that slots aren't supported in Flex Consumption.` 

:::zone-end

:::zone pivot="platform-windows"

#### [GitHub Copilot](#tab/github-copilot)

[!INCLUDE [functions-copilot-linux-only](~/includes/functions-copilot-linux-only.md)]

#### [Azure CLI](#tab/azure-cli)

Use this [`az functionapp deployment slot list`](/cli/azure/functionapp/deployment/slot#az-functionapp-deployment-slot-list) command to list any deployment slots defined in your function app:

```azurecli
az functionapp deployment slot list --name <APP_NAME> --resource-group <RESOURCE_GROUP> --output table
```

In this example, replace `<RESOURCE_GROUP>` and `<APP_NAME>` with your resource group name and app name, respectively. If the command returns an entry, your app has deployment slots enabled.

#### [Azure portal](#tab/azure-portal)

To determine whether your function app has deployment slots enabled:

1. In the [Azure portal], search for or otherwise go to your function app page.

1. In the left menu, select **Deployment** > **Deployment slots**.

1. If you see any slots listed in the **Deployment slots** page, your function app is currently using deployment slots.

---

:::zone-end

If your function app is currently using deployment slots, you can't currently reproduce this functionality in the Flex Consumption plan. Before migrating, consider the following options:

+ Rearchitect your application to use separate function apps. In this way, you can develop, test, and deploy your function code to a second nonproduction app instead of using slots.
+ Migrate any new code or features from the deployment slot into the main (**production**) slot.

### Verify the use of certificates

Transport Layer Security (TLS) certificates, previously known as Secure Sockets Layer (SSL) certificates, help secure internet connections. The Flex Consumption plan doesn't currently support TLS/SSL certificates, which include managed certificates, bring-your-own certificates (BYOC), or public-key certificates.

:::zone pivot="platform-linux"

>**Confirmed:** If the `az functionapp flex-migration list` command or Copilot assessment includes your app in the `eligible_apps` list, your Linux Consumption app isn't using certificates, and you can continue to [Verify your Blob storage triggers](#verify-your-blob-storage-triggers).

>**Action required:** If the output includes your app in the `ineligible_apps` list with an error message stating `The site '<name>' is using TSL/SSL certificates. TSL/SSL certificates are not supported in Flex Consumption.` or `The site '<name>' has the WEBSITE_LOAD_CERTIFICATES app setting configured. Certificate loading is not supported in Flex Consumption.`, your Linux Consumption app isn't compatible with Flex Consumption.

:::zone-end

:::zone pivot="platform-windows"

#### [GitHub Copilot](#tab/github-copilot)

[!INCLUDE [functions-copilot-linux-only](~/includes/functions-copilot-linux-only.md)]

#### [Azure CLI](#tab/azure-cli)

Use the [`az webapp config ssl list`](/cli/azure/webapp/config/ssl#az-webapp-config-ssl-list) command to list any TLS/SSL certificates available to your function app:

```azurecli
az webapp config ssl list --resource-group <RESOURCE_GROUP>  
```

In this example, replace `<RESOURCE_GROUP>` with your resource group name. If this command returns output, your app is likely using certificates. 

#### [Azure portal](#tab/azure-portal)

To determine whether your function app is using TLS/SSL certificates:

1. In the [Azure portal], search for or otherwise go to your function app page.

1. In the left menu, select **Settings** > **Certificates**.

1. Check the **Managed certificates**, **Bring your own certificates (.pfx)**, and **Public key certificates (.cer)** tabs for any installed certificates. 

---

:::zone-end

If your app currently relies on TLS/SSL certificates, don't proceed with the migration until support for certificates is added to the Flex Consumption plan.

### Verify your Blob storage triggers

Currently, the Flex Consumption plan only supports event-based triggers for Azure Blob storage, which are defined with a `Source` setting of `EventGrid`. The plan doesn't support Blob storage triggers that use container polling and use a `Source` setting of `LogsAndContainerScan`. Because container polling is the default, you must determine if any of your Blob storage triggers use the default `LogsAndContainerScan` source setting. For more information, see [Trigger on a blob container](../storage-considerations.md#trigger-on-a-blob-container).

:::zone pivot="platform-linux"

>**Confirmed:** If the `az functionapp flex-migration list` command or Copilot assessment includes your app in the `eligible_apps` list, your Linux Consumption app isn't using Blob storage triggers with `EventGrid` as the source. You can continue to [Consider dependent services](#consider-dependent-services).

>**Action required:** If the output includes your app in the `ineligible_apps` list with an error message stating `The site '<name>' has blob storage triggers that don't use Event Grid as the source: <list> Flex Consumption only supports Event Grid-based blob triggers. Please convert these triggers to use Event Grid or replace them with Event Grid triggers before migration.`, your Linux Consumption app isn't compatible with Flex Consumption.

:::zone-end
:::zone pivot="platform-windows"

#### [GitHub Copilot](#tab/github-copilot)

[!INCLUDE [functions-copilot-linux-only](~/includes/functions-copilot-linux-only.md)]

#### [Azure CLI](#tab/azure-cli)

Use this [`az functionapp function list`] command to determine if your app has any Blob storage triggers that don't use Event Grid as the source:

```azurecli
az functionapp function list  --name <APP_NAME> --resource-group <RESOURCE_GROUP> \
  --query "[?config.bindings[0].type=='blobTrigger' && config.bindings[0].source!='EventGrid'].{Function:name,TriggerType:config.bindings[0].type,Source:config.bindings[0].source}" \
  --output table
```

In this example, replace `<RESOURCE_GROUP>` and `<APP_NAME>` with your resource group name and app name, respectively. If the command returns rows, there's at least one trigger using container polling in your function app.

#### [Azure portal](#tab/azure-portal)

To determine whether your function app has any Blob storage triggers that don't use Event Grid as the source:

1. In the [Azure portal], search for or otherwise go to your function app page.

1. In the **Overview** on the **Functions** tab, look for any functions with a **Trigger** type of `Blob`.

1. Select a blob trigger function and in the **Code + Test** select **Resource JSON**.

1. Locate the `properties.config.bindings` section of the function definition. This section should have a `bindings.type` of `blobTrigger`. If the `bindings` object has no `source` property or `source` has a value of `LogsAndContainerScan`, the trigger uses container polling. An Event Grid source trigger instead has a `source` value of `EventGrid`.

1. Repeat steps 3-4 for any remaining Blob storage trigger functions in your app.

---

:::zone-end

If your app has any Blob storage triggers that don't have an Event Grid source, you must change to an Event Grid source before you migrate to the Flex Consumption plan.

The basic steps to change an existing Blob storage trigger to an Event Grid source are:

1. Add or update the `source` property in your Blob storage trigger definition to `EventGrid` and redeploy the app.

1. [Build the endpoint URL](../functions-event-grid-blob-trigger.md#build-the-endpoint-url) in your function app used to be used by the event subscription.

1. [Create an event subscription](../functions-event-grid-blob-trigger.md#create-the-event-subscription) on your Blob storage container.

For more information, see [Tutorial: Trigger Azure Functions on blob containers using an event subscription](../functions-event-grid-blob-trigger.md).

## Consider dependent services

> [!TIP]
> **Simple HTTP-only app?** If your functions only use HTTP triggers and don't connect to other Azure services, you can likely skip most of this section. Just remember to update any clients to point to your new app's URL after migration.

Because Azure Functions is a compute service, consider the effect of migration on data and services both upstream and downstream of your app.

### Data protection strategies

To protect both upstream and downstream data during the migration, use these strategies:

+ **Idempotency**: Ensure your functions can safely process the same message multiple times without negative side effects. For more information, see [Designing Azure Functions for identical input](../functions-idempotent.md).
+ **Logging and monitoring**: To track message processing, enable detailed logging in both apps during migration. For more information, see [Monitor executions in Azure Functions](../functions-monitoring.md).
+ **Checkpointing**: For streaming triggers, such as the Event Hubs trigger, implement correct checkpoint behaviors to track processing position. For more information, see [Azure Functions reliable event processing](../functions-reliable-event-processing.md).
+ **Parallel processing**: Consider temporarily running both apps in parallel during the cutover. Make sure to carefully monitor and validate how data is processed from the upstream service. For more information, see [Custom multi-region solutions for resiliency](/azure/reliability/reliability-functions#custom-multi-region-solutions-for-resiliency).
+ **Gradual cutover**: For high-volume systems, consider implementing a gradual cutover by redirecting portions of traffic to the new app. You can manage the routing of requests upstream from your apps by using services such as [Azure API Management](../functions-openapi-definition.md) or [Azure Application Gateway](../../app-service/overview-app-gateway-integration.md).

### Mitigations by trigger type

Plan mitigation strategies to protect data for the specific function triggers in your app:

| Trigger | Risk to data | Strategy |
| ----- | ----- | ----- |
| [Azure Blob storage](../functions-event-grid-blob-trigger.md) | High | Create a separate container for the event-based trigger in the new app.<br/>With the new app running, switch clients to use the new container.<br/>Allow the original container to be processed completely before stopping the old app.  |
| [Azure Cosmos DB](../functions-bindings-cosmosdb-v2-trigger.md) | High | Create a dedicated lease container specifically for the new app.<br/>Set this new lease container as the `leaseCollectionName` configuration in your new app.<br/>Requires that your [functions be idempotent](../functions-idempotent.md) or you must be able to handle the results of duplicate change feed processing.<br/>Set the `StartFromBeginning` configuration to `false` in the new app to avoid reprocessing the entire feed. |
| [Azure Event Grid](../functions-bindings-event-grid-trigger.md) | Medium | Recreate the same event subscription in the new app.<br/>Requires that your [functions be idempotent](../functions-idempotent.md) or you must be able to handle the results of duplicate event processing. |
| [Azure Event Hubs](../functions-bindings-event-hubs-trigger.md) | Medium | Create a new [consumer group](../../event-hubs/event-hubs-features.md#consumer-groups) for use by the new app. For more information, see [Migration strategies for Event Grid triggers](../functions-reliable-event-processing.md#migration-strategies-for-event-grid-triggers).|
| [Azure Service Bus](../functions-bindings-service-bus-trigger.md) | High | Create a new topic or queue for use by the new app.<br/>Update senders and clients to use the new topic or queue.<br/>After the original topic is empty, shut down the old app. |
| [Azure Storage queue](../functions-bindings-storage-queue-trigger.md) | High | Create a new queue for use by the new app.<br/>Update senders and clients to use the new queue.<br/>After the original queue is empty, shut down the old app. |
| [HTTP](../functions-bindings-http-webhook-trigger.md) |  Low | Remember to switch clients and other apps or services to target the new HTTP endpoints after the migration. |
| [Timer](../functions-bindings-timer.md) | Low | During cutover, make sure to offset the timer schedule between the two apps to avoid simultaneous executions from both apps.<br/>[Disable the timer trigger](../disable-function.md) in the old app after the new app runs successfully. |

::: zone pivot="platform-windows"

## Premigration tasks

Before creating your new Flex Consumption app, gather some information about your current app. This step ensures you don't lose any settings during the transition.

> [!TIP]
> **This step is mostly copy-paste work.** Collect settings from your existing app so you can apply them to the new app.

Complete these tasks before migrating:

> [!div class="checklist"]
> + [Collect app settings](#collect-app-settings)
> + [Collect application configurations](#collect-application-configurations)
> + [Identify managed identities and role-based access](#identify-managed-identities-and-role-based-access)
> + [Identify built-in authentication settings](#identify-built-in-authentication-settings)
> + [Review inbound access restrictions](#review-inbound-access-restrictions)

### Collect app settings

If you plan to use the same trigger and bindings sources and other settings from app settings, first note the current app settings in your existing Consumption plan app.

#### [GitHub Copilot](#tab/github-copilot)

[!INCLUDE [functions-copilot-linux-only](~/includes/functions-copilot-linux-only.md)]

#### [Azure CLI](#tab/azure-cli)

Use the [`az functionapp config appsettings list`](/cli/azure/functionapp/config/appsettings#az-functionapp-config-appsettings-list) command to return an `app_settings` object that contains the existing app settings as JSON:

```azurecli
app_settings=$(az functionapp config appsettings list --name `<APP_NAME>` --resource-group `<RESOURCE_GROUP>`)
echo $app_settings
```

In this example, replace `<RESOURCE_GROUP>` and `<APP_NAME>` with your resource group name and app name.

#### [Azure portal](#tab/azure-portal)

To get your current function app settings:

1. In the [Azure portal], search for or otherwise go to your function app page.

1. In the left menu, expand **Settings** and select **Environment variables**.

1. In the **App settings** tab, select **Advanced edit** and copy and save the JSON app settings content.

---

>[!CAUTION]  
>App settings frequently contain keys and other shared secrets. Always store application settings securely, ideally encrypted. For improved security, use Microsoft Entra ID authentication with managed identities in the new Flex Consumption plan app instead of shared secrets.

### Collect application configurations

Other app configurations exist beyond app settings. Capture these configurations from your existing app so that you can properly recreate them in the new app.

Review these settings. If any of them exist in the current app, decide whether to recreate them in the new Flex Consumption plan app:

| Configuration | Setting | Comment |
| ----- | ----- | ----- |
| CORS settings | `cors` | Determines any existing cross-origin resource sharing (CORS) settings, which your clients might require. |
| Custom domains |  | If your app currently uses a domain other than `*.azurewebsites.net`, you need to replace this custom domain mapping with a mapping to your new app.  |
| HTTP version | `http20Enabled` | Determines if HTTP 2.0 is required by your app. |
| HTTPS only | `httpsOnly` | Determines if TSL/SSL is required to access your app. |
| Incoming client certificates | `clientCertEnabled`<br/>`clientCertMode`<br/>`clientCertExclusionPaths` | Sets requirements for client requests that use certificates for authentication. |
| Maximum scale-out limit |`WEBSITE_MAX_DYNAMIC_APPLICATION_SCALE_OUT` | Sets the limit on scaled-out instances. The default maximum value is 200. This value is found in your app settings, but in a Flex Consumption plan app it instead gets added as a site setting (`maximumInstanceCount`). |
| Minimum inbound TLS version | `minTlsVersion` | Sets a minimum version of TLS required by your app. |
| Minimum inbound TLS Cipher | `minTlsCipherSuite` | Sets a minimum TLS cipher requirement for your app. |
| Mounted Azure Files shares | `azureStorageAccounts` | Determines if any explicitly mounted file shares exist in your app (Linux-only). |
| SCM basic auth publishing credentials | `scm.allow` | Determines if the [`scm` publishing site is enabled](../../app-service/configure-basic-auth-disable.md). While not recommended for security, some [publishing methods](../functions-deployment-technologies.md) require it. |

#### [GitHub Copilot](#tab/github-copilot)

[!INCLUDE [functions-copilot-linux-only](~/includes/functions-copilot-linux-only.md)]

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

1. In the [Azure portal], search for or otherwise go to your function app page.

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

1. Under **API** > **CORS**, note any explicitly allowed CORS origins and other CORS settings.

---

### Identify managed identities and role-based access

Before migrating, document whether your app relies on the system-assigned managed identity or any user-assigned managed identities. Determine the role-based access control (RBAC) permissions granted to these identities. You must recreate the system-assigned managed identity and any role assignments in your new app. You can reuse your user-assigned managed identities in your new app.

#### [GitHub Copilot](#tab/github-copilot)

[!INCLUDE [functions-copilot-linux-only](~/includes/functions-copilot-linux-only.md)]

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

In this example, replace `<RESOURCE_GROUP>` and `<APP_NAME>` with your resource group name and app name. Make a note of all identities and their role assignments.

#### [Azure portal](#tab/azure-portal)

1. In the [Azure portal], search for or otherwise go to your function app page.

1. In the left menu, expand **Settings** and select **Identity**.

1. Check the **System assigned** tab to see if the system-assigned managed identity is enabled. If enabled, select **Azure role assignments** to view the roles assigned to this identity.

1. Check the **User assigned** tab to see if any user-assigned managed identities are assigned. Note the names of any user-assigned identities.

1. For each user-assigned managed identity, select the identity. In the identity page, select **Azure role assignments**.

1. Make a note of each role assignment granted to the identity and determine whether your app requires it.

Document all identities and their role assignments so that you can recreate the same permissions structure for your new Flex Consumption app.

---

### Identify built-in authentication settings

Before migrating to Flex Consumption, collect information about any built-in authentication configurations. If you want your app to use the same client authentication behaviors, you must recreate them in the new app. For more information, see [Authentication and authorization in Azure Functions](../../app-service/overview-authentication-authorization.md).

Pay special attention to redirect URIs, allowed external redirects, and token settings to ensure a smooth transition for authenticated users.

#### [GitHub Copilot](#tab/github-copilot)

[!INCLUDE [functions-copilot-linux-only](~/includes/functions-copilot-linux-only.md)]

#### [Azure CLI](#tab/azure-cli)

Use the [`az webapp auth show`](/cli/azure/webapp/auth#az-webapp-auth-show) command to check if [built-in authentication](../../app-service/overview-authentication-authorization.md) is configured in your function app:

```azurecli
az webapp auth show --name <APP_NAME> --resource-group <RESOURCE_GROUP>
```

In this example, replace `<RESOURCE_GROUP>` and `<APP_NAME>` with your resource group name and app name. Review the output to determine if authentication is enabled and which identity providers are configured.

Recreate these settings in your new app after migration so that your clients can maintain access by using their preferred provider.

#### [Azure portal](#tab/azure-portal)

To check if built-in client authentication is configured:

1. In the [Azure portal], search for or otherwise go to your function app page.

1. In the left menu, expand **Settings** and select **Authentication**.

1. If built-in authentication is enabled, note which client identity providers are configured. Also note any advanced settings such as token store, allowed external redirects, and allowed token audiences.

---

### Review inbound access restrictions

You can set [inbound access restrictions](../functions-networking-options.md#inbound-access-restrictions) on apps in a Consumption plan. You might want to maintain these restrictions in your new app. For each restriction you define, make sure to capture these properties:

+ IP addresses or CIDR ranges
+ Priority values
+ Action type (Allow/Deny)
+ Names of the rules

#### [GitHub Copilot](#tab/github-copilot)

[!INCLUDE [functions-copilot-linux-only](~/includes/functions-copilot-linux-only.md)]

#### [Azure CLI](#tab/azure-cli)

This [`az functionapp config access-restriction show`]() command returns a list of any existing IP-based access restrictions:

```azurecli
az functionapp config access-restriction show --name <APP_NAME> --resource-group <RESOURCE_GROUP>
```

In this example, replace `<RESOURCE_GROUP>` and `<APP_NAME>` with your resource group name and app name.

#### [Azure portal](#tab/azure-portal)

1. In the [Azure portal], search for or otherwise go to your function app page.

1. In the left menu, expand **Settings** and select **Networking**.

1. If you see **Enabled with no access restrictions** for **Public network access**, then there are no inbound access restrictions. Otherwise, select **Access restrictions**.

1. Document all configured IP-based access restrictions.

---

When running in the Flex Consumption plan, you can recreate these inbound IP-based restrictions. You can further secure your app by implementing other networking restrictions, such as virtual network integration and inbound private endpoints. For more information, see [Virtual network integration](../flex-consumption-plan.md#virtual-network-integration).

:::zone-end  
::: zone pivot="platform-linux"

## Start the migration

### [GitHub Copilot](#tab/github-copilot)

If you used the discovery prompt in the [Identify](#identify-potential-apps-to-migrate) section, the skill has already assessed, created, and configured your new Flex Consumption app. You can skip this section and continue to [Migration steps](#migration-steps).

If you already know which app to migrate, use this prompt:

```
migrate my app <APP_NAME> to flex consumption
```

The skill automatically handles assessment, app creation, and configuration migration — equivalent to the `az functionapp flex-migration start` command and its verification steps.

### [Azure CLI](#tab/azure-cli)

The [`az functionapp flex-migration start`](/cli/azure/functionapp/flex-migration#az-functionapp-flex-migration-start) command collects your app's configuration and creates a new Flex Consumption app with the same settings.

```azurecli
az functionapp flex-migration start \
    --source-name <SOURCE_APP_NAME> \
    --source-resource-group <SOURCE_RESOURCE_GROUP> \
    --name <NEW_APP_NAME> \
    --resource-group <RESOURCE_GROUP>
```

In this example, replace these placeholders with the values for your scenario:

| Placeholder | Value |
| ---- | ----- |
| `<SOURCE_APP_NAME>` | The name of your original app. |
| `<SOURCE_RESOURCE_GROUP>` | The resource group of the original app. |
| `<NEW_APP_NAME>` | The name of the new app. |
| `<RESOURCE_GROUP>` | The resource group of the new app. |

The `az functionapp flex-migration start` command performs these basic tasks:

- Assesses your source app for compatibility with the Flex Consumption hosting plan.
- Creates a function app in the Flex Consumption plan. 
- Migrates most configurations, including app settings, identity assignments, storage mounts, CORS settings, custom domains, and access restrictions.

The migration command supports several options to customize the migration:

| Option | Description |
|--------|-------------|
| `--storage-account` | Specify a different storage account for the new app |
| `--maximum-instance-count` | Set the maximum number of instances for scaling |
| `--skip-access-restrictions` | Skip migrating IP access restrictions |
| `--skip-cors` | Skip migrating CORS settings |
| `--skip-hostnames` | Skip migrating custom domains |
| `--skip-managed-identities` | Skip migrating managed identity configurations |
| `--skip-storage-mount` | Skip migrating storage mount configurations |

For complete command options, use `az functionapp flex-migration start --help`.

### [Azure portal](#tab/azure-portal)

The Azure portal doesn't provide an automated migration command for Linux apps. Use the **Azure CLI** or **GitHub Copilot** tabs for the recommended Linux migration experience.

---

After you successfully start the migration, continue to [Get the code deployment package](#get-the-code-deployment-package).

::: zone-end

## Get the code deployment package

To redeploy your app, you need either your project's source files or the deployment package. Ideally, you maintain your project files in source control so you can easily redeploy function code to your new app. If you have your source code files, you can skip this section and continue to [Capture performance benchmarks (optional)](#capture-performance-benchmarks-optional).

If you no longer have access to your project source files, you can download the current deployment package from the existing Consumption plan app in Azure. The location of the deployment package depends on whether you run on Linux or Windows.

::: zone pivot="platform-linux"

Consumption plan apps on Linux maintain the deployment zip package file in one of these locations:

+ An Azure Blob storage container named `scm-releases` in the default host storage account (`AzureWebJobsStorage`). This container is the default deployment source for a Consumption plan app on Linux.

+ If your app has a `WEBSITE_RUN_FROM_PACKAGE` setting that is a URL, the package is in an externally accessible location that you maintain. An external package should be hosted in a blob storage container with restricted access. For more information, see [External package URL](../functions-deployment-technologies.md#external-package-url).

>[!TIP]  
>If you restrict your storage account to managed identity access only, you might need to grant your Azure account read access to the storage container by adding it to the `Storage Blob Data Reader` role.

The deployment package is compressed by using the `squashfs` format. To see what's inside the package, you must use tools that can decompress this format.

Use these steps to download the deployment package from your current app:
 
### [GitHub Copilot](#tab/github-copilot)

The Copilot migration skill attempts to download and redeploy your existing code project to your new app. If unsuccessful, it instead guides you through obtaining and deploying your code package as part of the migration workflow. You can skip this section and continue to [Migration Steps](#migration-steps).

### [Azure CLI](#tab/azure-cli)

1. Use the [`az functionapp config appsettings list`](/cli/azure/functionapp/config/appsettings#az-functionapp-config-appsettings-list) command to get the `WEBSITE_RUN_FROM_PACKAGE` app setting, if present:

    ```azurecli
    az functionapp config appsettings list --name <APP_NAME> --resource-group <RESOURCE_GROUP> \
        --query "[?name=='WEBSITE_RUN_FROM_PACKAGE'].value" -o tsv
    ```

    In this example, replace `<RESOURCE_GROUP>` and `<APP_NAME>` with your resource group name and app name. If this command returns a URL, you can download the deployment package file from that remote location and skip to the next section.

1. If the `WEBSITE_RUN_FROM_PACKAGE` value is `1` or empty, use this script to get the deployment package for the existing app:

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

### [Azure portal](#tab/azure-portal)

1. In the [Azure portal], search for or otherwise go to your function app page.

1. In the left menu, expand **Settings** > **Environment variables** and see if a setting named `WEBSITE_RUN_FROM_PACKAGE` exists.

1. If `WEBSITE_RUN_FROM_PACKAGE` exists, make sure to set it to a value of `1` or a URL. If set to a URL, that URL is the location of the package file for your app content. Download the .zip file from that URL location that you own.

1. If the `WEBSITE_RUN_FROM_PACKAGE` setting doesn't exist or is set to `1`, you must download the package from the specific storage account, which depends on whether you're running on Linux or Windows.

1. Get the storage account name from the `AzureWebJobsStorage` or `AzureWebJobsStorage__accountName` application setting. For a connection string, the `AccountName` is the name your storage account.

1. In the portal, search for your storage account name.

1. In the storage account page, locate the deployment package and download it.

1. Expand **Data storage** > **Containers** and select `scm_releases`. Choose the file named `scm-latest-<APP_NAME>.zip` and select **Download**.

---
::: zone-end
::: zone pivot="platform-windows" 

The location of your project source files depends on the `WEBSITE_RUN_FROM_PACKAGE` app setting as follows:

| `WEBSITE_RUN_FROM_PACKAGE` value | Source file location |
| ---- | ---- |
| `1` | The files are in a zip package that is stored in the Azure Files share of the storage account defined by the `WEBSITE_CONTENTAZUREFILECONNECTIONSTRING` setting. The `WEBSITE_CONTENTSHARE` setting defines The name of the files share. |
| An endpoint URL | The files are in a zip package in an externally accessible location that you maintain. An external package should be hosted in a blob storage container with restricted access. For more information, see [External package URL](../functions-deployment-technologies.md#external-package-url). |


### [GitHub Copilot](#tab/github-copilot)

[!INCLUDE [functions-copilot-linux-only](~/includes/functions-copilot-linux-only.md)]

### [Azure CLI](#tab/azure-cli)

1. Use the [`az functionapp config appsettings list`](/cli/azure/functionapp/config/appsettings#az-functionapp-config-appsettings-list) command to get the `WEBSITE_RUN_FROM_PACKAGE` app setting, if present:

    ```azurecli
    az functionapp config appsettings list --name <APP_NAME> --resource-group <RESOURCE_GROUP> \
        --query "[?name=='WEBSITE_RUN_FROM_PACKAGE'].value" -o tsv
    ```

    In this example, replace `<RESOURCE_GROUP>` and `<APP_NAME>` with your resource group name and app name. If this command returns a URL, you can download the deployment package file from that remote location and skip to the next section.

1. If the `WEBSITE_RUN_FROM_PACKAGE` value is `1` or empty, use this script to get the deployment package for the existing app:

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

### [Azure portal](#tab/azure-portal)

1. In the [Azure portal], search for or otherwise go to your function app page.

1. In the left menu, expand **Settings** > **Environment variables** and see if a setting named `WEBSITE_RUN_FROM_PACKAGE` exists.

1. If `WEBSITE_RUN_FROM_PACKAGE` exists, make sure to set it to a value of `1` or a URL. If set to a URL, that URL is the location of the package file for your app content. Download the .zip file from that URL location that you own.

1. If the `WEBSITE_RUN_FROM_PACKAGE` setting doesn't exist or is set to `1`, you must download the package from the specific storage account, which depends on whether you're running on Linux or Windows.

1. Get the storage account name from the `WEBSITE_CONTENTAZUREFILECONNECTIONSTRING` setting, where the `AccountName` is the name of your storage account. Also, make a note of the `WEBSITE_CONTENTSHARE` value, which is the name of the file share.

1. In the portal, search for your storage account name.

1. In the storage account page, locate the deployment package and download it.

1. Expand **Data storage** > **File shares**, select the share name from `WEBSITE_CONTENTSHARE`, and browse to the `data\SitePackages` subfolder. Choose the most recent .zip file and select **Download**.  

---
::: zone-end

## Capture performance benchmarks (optional)

If you plan to validate performance improvement in your app based on the migration to the Flex Consumption plan, consider capturing the performance benchmarks of your current plan. Then, you can compare them to the same benchmarks for your app running in a Flex Consumption plan.

>[!TIP]  
>Always compare performance under similar conditions, such as time of day, day of week, and client load. Try to run the two benchmarks as close together as possible.

Here are some benchmarks to consider for your structured performance testing:

| Suggested benchmark | Comment |
| ----- | ----- |
| **Cold-start** | Measure the time from first request to the first response after an idle period. |
| **Throughput** | Measure the maximum requests per second using [load testing tools](/azure/app-testing/load-testing/how-to-optimize-azure-functions) to determine how the app handles concurrent requests. |
| **Latency** | Track the `P50`, `P95`, and `P99` response times under various load conditions. You can monitor these metrics in Application Insights. |

Use this Kusto query to review the suggested latency response times in Application Insights:

```kusto
requests
| where timestamp > ago(1d)
| summarize percentiles(duration, 50, 95, 99) by bin(timestamp, 1h)
| render timechart
```

## Migration steps

To migrate your functions from a Consumption plan app to a Flex Consumption plan app, follow these main steps:

::: zone pivot="platform-linux"

> [!div class="checklist"]
> + [Verify Flex Consumption app created and configured](#verify-flex-consumption-app-created-and-configured)
> + [Configure built-in authentication](#configure-built-in-authentication)
> + [Deploy your app code to the new Flex Consumption resource](#deploy-your-app-code-to-the-new-flex-consumption-resource)

### Verify Flex Consumption app created and configured 

After running the [az functionapp flex-migration start] command, verify that your new Flex Consumption app is created successfully and properly configured. Here are some steps to validate the migration results:

#### [GitHub Copilot](#tab/github-copilot)

The Copilot migration skill automatically verifies the new app as part of the migration. If you started the migration using a Copilot prompt in [Start the migration for Linux](#start-the-migration), the skill has already verified that the app was created and configured correctly. You can skip this section and continue to [Configure built-in authentication](#configure-built-in-authentication).

#### [Azure CLI](#tab/azure-cli)

1. **Verify the new app exists and is running:**
    ```azurecli
    az functionapp show --name <NEW_APP_NAME> --resource-group <RESOURCE_GROUP> \
         --query "{name:name, kind:kind, sku:properties.sku}" --output table
    ```

1. **Review migrated app settings:**
    ```azurecli
    az functionapp config appsettings list --name <NEW_APP_NAME> --resource-group <RESOURCE_GROUP> \
         --output table
    ```
    
    Compare these settings with your source app to ensure critical configurations are transferred.

1. **Check managed identity configuration:**
    ```azurecli
    az functionapp identity show --name <NEW_APP_NAME> --resource-group <RESOURCE_GROUP>
    ```

1. **Verify any custom domains were migrated:**
    ```azurecli
    az functionapp config hostname list --webapp-name <NEW_APP_NAME> --resource-group <RESOURCE_GROUP> \
         --output table
    ```

#### [Azure portal](#tab/azure-portal)

1. In the [Azure portal], search for your new function app by name.

1. In the app's **Overview** page, verify:
    - **Status** shows as `Running`
    - **Plan type** shows as `Flex Consumption`
    - The **Resource group** and **Location** match your expectations

1. In the left menu, expand **Settings** > **Environment variables** and review the **App settings** tab to ensure your application settings migrated correctly.

1. Check **Settings** > **Identity** to verify that managed identities are configured as expected.

1. If applicable, check **Settings** > **Custom domains** to confirm any custom domain mappings.

1. Review **Settings** > **Networking** to verify access restrictions if they existed in the source app.

---

### Review migration summary

The automated migration command transfers most configurations. However, manually verify that these items are migrated. You might need to configure them manually:

- **Certificates**: TLS/SSL certificates aren't supported in Flex Consumption yet.
- **Deployment slots**: Not supported in Flex Consumption.
- **Built-in authentication settings**: You need to reconfigure these settings manually.
- **CORS settings**: You might need to verify these settings manually depending on your configuration.

If any critical settings are missing or incorrect, manually configure them by using the steps outlined in the [Windows migration process](#create-an-app-in-the-flex-consumption-plan) sections of this article.

:::zone-end

::: zone pivot="platform-windows"

> [!div class="checklist"]
> + [Final review of the plan](#final-review-of-the-plan)
> + [Create an app in the Flex Consumption plan](#create-an-app-in-the-flex-consumption-plan)
> + [Apply migrated app settings in the new app](#apply-migrated-app-settings-in-the-new-app)
> + [Apply other app configurations](#apply-other-app-configurations)
> + [Configure scale and concurrency settings](#configure-scale-and-concurrency-settings)
> + [Configure any custom domains and CORS access](#configure-any-custom-domains-and-cors-access)
> + [Configure managed identities and assign roles](#configure-managed-identities-and-assign-roles)
> + [Configure Network Access Restrictions](#configure-network-access-restrictions)
> + [Enable monitoring](#enable-monitoring)
> + [Configure built-in authentication](#configure-built-in-authentication)
> + [Deploy your app code to the new Flex Consumption resource](#deploy-your-app-code-to-the-new-flex-consumption-resource)

### Final review of the plan

Before proceeding with the migration process, take a moment to perform these last preparatory steps:

+ **Review all the collected information**: Go through all the notes, configuration details, and application settings you documented in the previous assessment and premigration sections. If anything is unclear, rerun the Azure CLI commands again or get the information from the portal.

+ **Define your migration plan**: Based on your findings, create a checklist for your migration that highlights:

   + Any settings that need special attention
   + Triggers and bindings or other dependencies that might be affected during migration
   + Testing strategy for post-migration validation
   + Rollback plan if there are unexpected issues

+ **Downtime planning**: Consider when to stop the original function app to avoid both data loss and duplicate processing of events, and how this migration might affect your users or downstream systems. In some cases, you might need to [disable specific functions](../disable-function.md) before stopping the entire app.

A careful final review helps ensure a smoother migration process and minimizes the risk of overlooking important configurations.

### Create an app in the Flex Consumption plan

You can create a function app in the Flex Consumption plan along with other required Azure resources in various ways:

| Create option | Reference articles |
| ----- | ----- |
| Azure CLI | [Create a Flex Consumption app](../flex-consumption-how-to.md?tabs=azure-cli#create-a-flex-consumption-app)|
| Azure portal | [Create a function app in the Azure portal](../functions-create-function-app-portal.md) |
| Infrastructure as code | [ARM template](../functions-create-first-function-resource-manager.md)<br/>[azd](../create-first-function-azure-developer-cli.md)<br/>[Bicep](../functions-create-first-function-bicep.md)<br/>[Terraform](../functions-create-first-function-terraform.md) |
| Visual Studio Code | [Visual Studio Code deployment](../functions-develop-vs-code.md#publish-to-azure) |
| Visual Studio | [Visual Studio deployment](../functions-develop-vs.md#publish-to-azure) |

>[!TIP]  
>When possible, use Microsoft Entra ID for authentication instead of connection strings, which contain shared keys. Using managed identities is a best practice that improves security by eliminating the need to store shared secrets directly in application settings. If your original app used connection strings, the Flex Consumption plan supports managed identities. Most of these links show you how to enable managed identities in your function app.

### Apply migrated app settings in the new app

Before deploying your code, configure the new app with the relevant Flex Consumption plan app settings from your original function app.

>[!IMPORTANT]  
>Not all Consumption plan app settings are supported when running in a Flex Consumption plan. For more information, see [Flex Consumption plan deprecations](../functions-app-settings.md#flex-consumption-plan-deprecations).

#### [GitHub Copilot](#tab/github-copilot)

[!INCLUDE [functions-copilot-linux-only](~/includes/functions-copilot-linux-only.md)]

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

In this example, replace `<RESOURCE_GROUP>`, `<SOURCE_APP_NAME>`, and `<DEST_APP_NAME>` with your resource group name and the old and new app names, respectively. This script assumes that both apps are in the same resource group.  

#### [Azure portal](#tab/azure-portal)

To transfer settings:

1. In the [Azure portal], search for or otherwise go to the page for your new app.

1. In the left menu, expand **Settings** > **Environment variables**. In the **App settings** tab, select **+ Add**.

1. Type or paste both the setting **Name** and **Value**, and then select **Apply**.

1. Repeat the previous step for each setting in the old app that you need to recreate in the new app. If a setting already exists in the new app, skip it. Also skip any [deprecated settings in the Flex Consumption plan](../functions-app-settings.md#flex-consumption-plan-deprecations).

1. After you add all relevant settings, select **Apply** > **Save**.

---

### Apply other app configurations

Find the list of other app configurations from your old app that you [collected during premigration](#collect-application-configurations) and set them in the new app.

#### [GitHub Copilot](#tab/github-copilot)

[!INCLUDE [functions-copilot-linux-only](~/includes/functions-copilot-linux-only.md)]

#### [Azure CLI](#tab/azure-cli)

In this script, set the value for any configuration set in the original app and comment out any commands for any configuration not set (`null`):

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

In this example, replace `<RESOURCE_GROUP>` and `<APP_NAME>` with your resource group and function app names. Also, replace the placeholders of any variable definitions for existing settings you want to recreate in the new app, and comment out any `null` settings.

#### [Azure portal](#tab/azure-portal)

1. In the [Azure portal], search for or otherwise go to the page for your new app.

1. In the left menu, expand **Settings** > **Configuration** and on the **General settings** tab update these settings to match what you documented from your original Consumption plan app:

	+ **SCM Basic Auth Publishing Credentials**
	+ **HTTP version**
	+ **HTTPS Only**
	+ **Minimum Inbound TLS Version and cypher**
	+ **Client Certificate settings**

1. Select **Save** to apply the configuration changes.

---

### Configure scale and concurrency settings

The Flex Consumption plan uses per-function scaling. Each function within your app scales independently based on its workload. Scaling is more strictly related to concurrency settings. These settings help you make scaling decisions based on the current concurrent executions. For more information, see both [Per-function scaling](../flex-consumption-plan.md#per-function-scaling) and [Concurrency](../flex-consumption-plan.md#concurrency) in the Flex Consumption plan article.

If you want your new app to scale like your original app, consider the concurrency settings. Setting higher concurrency values can result in fewer instances being created to handle the same load.

If you set a custom scale-out limit in your original app, you can apply it to your new app. Otherwise, skip to the next section.

The default maximum instance count is 100. Set it to a value between 1 and 1,000.

> [!NOTE]
> Reducing the maximum instance count below 40 for HTTP function apps can cause frequent request failures and prolonged throttling windows when traffic exceeds capacity. This setting is intended only for advanced scenarios where limited scale-out is acceptable and is fully tested.

#### [GitHub Copilot](#tab/github-copilot)

[!INCLUDE [functions-copilot-linux-only](~/includes/functions-copilot-linux-only.md)]

#### [Azure CLI](#tab/azure-cli)

Use the [`az functionapp scale config set`](/cli/azure/functionapp/scale/config#az-functionapp-scale-config-set) command to set the maximum scale-out.

```azurecli
az functionapp scale config set --name <APP_NAME> --resource-group <RESOURCE_GROUP> \
    --maximum-instance-count <MAX_SCALE_SETTING>
```

In this example, replace `<RESOURCE_GROUP>` and `<APP_NAME>` with your resource group and function app names. Replace `<MAX_SCALE_SETTING>` with the maximum scale value you want to set.

#### [Azure portal](#tab/azure-portal)

To configure scale and concurrency in your new app:

1. In the [Azure portal], search for or otherwise go to the page for your new app.

1. In the left menu, expand **Settings** > **Scale and concurrency**. For **Maximum instance count**, set a maximum value for how far your app can scale.

1. Select `Save` to apply the changes.

---

### Configure any custom domains and CORS access

If your original app had any bound custom domains or CORS settings, recreate them in your new app. For more information about custom domains, see [Set up an existing custom domain in Azure App Service](../../app-service/app-service-web-tutorial-custom-domain.md).

#### [GitHub Copilot](#tab/github-copilot)

[!INCLUDE [functions-copilot-linux-only](~/includes/functions-copilot-linux-only.md)]

#### [Azure CLI](#tab/azure-cli)

1. Use the [`az functionapp config hostname add`](/cli/azure/functionapp/config/hostname#az-functionapp-config-hostname-add) command to rebind custom domain mappings to your app:

    ```azurecli
    az functionapp config hostname add --name <APP_NAME> --resource-group <RESOURCE_GROUP> \
        --hostname <CUSTOM_DOMAIN>
    ```

    In this example, replace `<RESOURCE_GROUP>` and `<APP_NAME>` with your resource group and function app names. Replace `<CUSTOM_DOMAIN>` with your custom domain name.

1. Use the [`az functionapp cors add`](/cli/azure/functionapp/cors#az-functionapp-cors-add) command to replace CORS settings:

    ```azurecli
    az functionapp cors add --name <APP_NAME> --resource-group <RESOURCE_GROUP> \
        --allowed-origins <ALLOWED_ORIGIN_1> <ALLOWED_ORIGIN_2> <ALLOWED_ORIGIN_N>
    ```

    In this example, replace `<RESOURCE_GROUP>` and `<APP_NAME>` with your resource group and function app names. Replace `<ALLOWED_ORIGIN_*>` with your allowed origins.

#### [Azure portal](#tab/azure-portal)

1. In the [Azure portal], search for or otherwise go to the page for your new app.

1. In the left menu, expand **Settings** > **Custom domains**, select **+ Add custom domain**, configure the custom domain, select **Validate**, and then select **Add**.

1. Repeat the previous step to add any other custom domains.  

1. In the left menu, expand **API** > **CORS**, add one or more **Allowed origins**, and select **Save**.

---

### Configure managed identities and assign roles

How you configure managed identities in your new app depends on the kind of managed identity:

| Managed identity type | Create identity | Role assignments |
| ----- | ----- | ----- |
| User-assigned | Optional | You can continue to use the same user-assigned managed identities with the new app. You must reassign these identities to your Flex Consumption app and verify that they still have the correct role assignments in remote services. If you choose to create new identities for the new app, you must assign the same roles as the existing identities. |  
| System-assigned | Yes | Because each function app has its own system-assigned managed identity, you must enable the system-assigned managed identity in the new app and reassign the same roles as in the original app. |

Recreating the role assignments correctly is key to ensuring your function app has the same access to Azure resources after the migration.

>[!TIP]  
>If your original app used connection strings or other shared secrets for authentication, this is a great opportunity to improve your app's security by switching to using Microsoft Entra ID authentication with managed identities. For more information, see [Tutorial: Create a function app that connects to Azure services using identities instead of secrets](../functions-identity-based-connections-tutorial.md).

#### [System-assigned](#tab/system-assigned/github-copilot)

[!INCLUDE [functions-copilot-linux-only](~/includes/functions-copilot-linux-only.md)]

#### [User-assigned](#tab/user-assigned/github-copilot)

[!INCLUDE [functions-copilot-linux-only](~/includes/functions-copilot-linux-only.md)]

#### [System-assigned](#tab/system-assigned/azure-cli)

1. Use the [`az functionapp identity assign`](/cli/azure/functionapp/identity#az-functionapp-identity-assign) command to enable the system-assigned managed identity in your new app:

    ```azurecli
    az functionapp identity assign --name <APP_NAME> --resource-group <RESOURCE_GROUP>
    ```

    In this example, replace `<RESOURCE_GROUP>` and `<APP_NAME>` with your resource group and function app names.

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

1. In the [Azure portal], search for or otherwise go to the page for your new app.

1. In the left menu, expand **Settings** > **Identity** and on the **System assigned** tab set **Status** to **On**.

1. Select **Azure role assignments** in the left pane.

1. Select **+ Add role assignment** and set these assignment properties for a role you documented in the original app:

    | Property | Description |
    | ----- | ----- |
    | **Scope** | The resource type being accessed. |
    | **Subscription** | The subscription of the resource. |
    | **Resource** | The specific resource within the selected scope. |
    | **Role** | Search for and select the role being assigned. |

1. Select **Save** to add the scope. To add more roles, repeat the previous step for each documented role required by the new app.

#### [User-assigned](#tab/user-assigned/azure-portal)

1. In the [Azure portal], search for or otherwise go to the page for your new app.

1. In the left menu, expand **Settings** > **Identity** and on the **User assigned** tab select **+ Add**.

1. Select an existing identity and then select **Add**.

1. Select the identity you just added and select **Azure role assignments** in the left pane.

1. Select **+ Add role assignment** and set these assignment properties for a role you documented in the original app:

    | Property | Description |
    | ----- | ----- |
    | **Scope** | The resource type being accessed. |
    | **Subscription** | The subscription of the resource. |
    | **Resource** | The specific resource within the selected scope. |
    | **Role** | Search for and select the role being assigned. |

1. Select **Save** to add the scope. To add more roles, repeat the previous step for each documented role required by the new app.

---

### Configure network access restrictions

If your original app had any IP-based inbound access restrictions, recreate any of the same inbound access rules you want to keep in your new app.

>[!TIP]
>The Flex Consumption plan [fully supports virtual network integration](../flex-consumption-plan.md#virtual-network-integration). Because of this support, you can also use inbound private endpoints after migration. For more information, see [Private endpoints](../functions-networking-options.md#private-endpoints).

#### [GitHub Copilot](#tab/github-copilot)

[!INCLUDE [functions-copilot-linux-only](~/includes/functions-copilot-linux-only.md)]

#### [Azure CLI](#tab/azure-cli)

Use the [`az functionapp config access-restriction add`](/cli/azure/functionapp/config/access-restriction#az-functionapp-config-access-restriction-add) command for each IP access restriction you want to replicate in the new app:

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

1. In the [Azure portal], search for or otherwise go to the page for your new app.

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

### Enable monitoring

Before you start your new app in the Flex Consumption plan, make sure that Application Insights is enabled. When you configure Application Insights, you can troubleshoot any problems that come up during code deployment and start-up.

Implement a comprehensive monitoring strategy that covers app metrics, logs, and costs. By using this strategy, you can validate the success of your migration, identify any problems quickly, and optimize the performance and cost of your new app.

If you plan to compare this new app with your current app, make sure your scheme also collects the required benchmarks for comparison. For more information, see [Configure monitoring](../flex-consumption-how-to.md#monitor-your-app-in-azure).

:::zone-end

### Configure built-in authentication

If your original app used built-in client authentication (sometimes called Easy Auth), recreate it in your new app. If you plan to reuse the same client registration, make sure to set the new app's authenticated endpoints in the authentication provider.

#### [GitHub Copilot](#tab/github-copilot)

The Copilot migration skill for Linux doesn't automate built-in authentication configuration. Use the **Azure CLI** or **Azure portal** tabs to manually recreate your authentication settings.

#### [Azure CLI](#tab/azure-cli)

Based on the information you collected earlier, use the [`az webapp auth update`](/cli/azure/webapp/auth#az-webapp-auth-update) command to recreate each built-in authentication registration required by your app.

#### [Azure portal](#tab/azure-portal)

1. In the [Azure portal], search for or otherwise go to the page for your new app.

1. In the left menu, expand **Settings** > **Authentication** and select **Add identity provider**.

1. Select your desired **Identity provider** and set the configurations and permissions required by the authenticator.

For more information, see these provider-specific articles:

+ [Configure your Azure Functions app to use Microsoft Entra sign-in](../../app-service/configure-authentication-provider-aad.md)
+ [Configure your Azure Functions app to use GitHub login](../../app-service/configure-authentication-provider-github.md)
+ [Configure your Azure Functions app to use Google authentication](../../app-service/configure-authentication-provider-google.md)
+ [Configure your Azure Functions app to use Facebook login](../../app-service/configure-authentication-provider-facebook.md)
+ [Configure your Azure Functions app to use X login](../../app-service/configure-authentication-provider-twitter.md)

---

### Deploy your app code to the new Flex Consumption resource

After you configure your new Flex Consumption plan app based on the settings from the original app, deploy your code to the new app resources in Azure.

>[!CAUTION]
>After a successful deployment, triggers in your new app immediately start processing data from connected services. To minimize duplicated data and prevent data loss while starting the new app and shutting down the original app, review the strategies that you defined in [mitigations by trigger type](#mitigations-by-trigger-type).

Functions provides several ways to deploy your code, either from the code project or as a ready-to-run deployment package.

>[!TIP]  
>If you maintain your project code in a source code repository, now is the perfect time to configure a continuous deployment pipeline. Continuous deployment lets you automatically deploy application updates based on changes in a connected repository.

#### [Continuous code deployment](#tab/continuous)

Update your existing deployment workflows to deploy your source code to your new app:

+ [Build and deploy using Azure Pipelines](../functions-how-to-azure-devops.md)
+ [Build and deploy using GitHub Actions](../functions-how-to-github-actions.md)

You can also create a new continuous deployment workflow for your new app. For more information, see [Continuous deployment for Azure Functions](../functions-continuous-deployment.md).

#### [Ad-hoc code deployment](#tab/ad-hoc)

Use these tools to achieve a one-off deployment of your code project to your new plan:

+ [Visual Studio Code](../functions-develop-vs-code.md#republish-project-files)
+ [Visual Studio](../functions-develop-vs.md#publish-to-azure)
+ [Azure Functions Core Tools](../functions-run-local.md#project-file-deployment)

#### [Package deployment](#tab/package)

To redeploy a downloaded package or a newly created deployment package, use the [az functionapp deployment source config-zip](/cli/azure/functionapp/deployment/source#az-functionapp-deployment-source-config-zip) command:

  ```azurecli
  az functionapp deployment source config-zip --resource-group <RESOURCE_GROUP> --name <APP_NAME> --src <PACKAGE_PATH>
  ```

In this example, replace `<RESOURCE_GROUP>` and `<APP_NAME>` with your resource group and function app names, respectively. Replace `<PACKAGE_PATH>` with the path and file name of your deployment package, such as `/path/to/function/package.zip`.

---

## Post-migration tasks

🎉 **Congratulations!** Your app is now running on Flex Consumption. To get the most out of your new plan, consider these optional follow-up tasks:

> [!div class="checklist"]
> + [Verify basic functionality](#verify-basic-functionality)
> + [Capture performance benchmarks](#capture-performance-benchmarks)
> + [Create custom dashboards](#create-custom-dashboards)
> + [Refine plan settings](#refine-plan-settings)
> + [Update your resource deployment files](#update-your-resource-deployment-files)
> + [Remove the original app (optional)](#remove-the-original-app-optional)

### Verify basic functionality

1. Verify the new app is running in a Flex Consumption plan:

    #### [GitHub Copilot](#tab/github-copilot)

    The Copilot migration skill for Linux automatically validates your new app after deployment, including verifying the app is reachable and running on the Flex Consumption plan. If you need to revalidate, use this prompt:

    ```
    verify my flex consumption app <APP_NAME> is running correctly
    ```

    #### [Azure CLI](#tab/azure-cli)

    Use the [`az functionapp show`](/cli/azure/functionapp#az-functionapp-show) command to view the details about the hosting plan:

    ```azurecli
    az functionapp show --name <APP_NAME> --resource-group <RESOURCE_GROUP> --query "serverFarmId"
    ```

    In this example, replace `<RESOURCE_GROUP>` and `<APP_NAME>` with your resource group and function app names. 

    #### [Azure portal](#tab/azure-portal)

    1. In the [Azure portal], search for or otherwise go to the page for your new app.

    1. In **Overview** > **Essentials**, verify that the **Status** of your app is `Running` and that the **Plan type** is `Flex Consumption`.

    ---

1. Use an HTTP client to call at least one HTTP trigger endpoint on your new app to make sure it responds as expected.

### Capture performance benchmarks

With your new app running, run the same performance benchmarks that you collected from your original app, such as:

| Suggested benchmark | Comment |
| ----- | ----- |
| **Cold-start** | Measure the time from first request to the first response after an idle period. |
| **Throughput** | Measure the maximum requests per second using [load testing tools](/azure/app-testing/load-testing/how-to-optimize-azure-functions) to determine how the app handles concurrent requests. |
| **Latency** | Track the `P50`, `P95`, and `P99` response times under various load conditions. You can monitor these metrics in Application Insights. |

Use this Kusto query to review the suggested latency response times in Application Insights:

```kusto
requests
| where timestamp > ago(1d)
| summarize percentiles(duration, 50, 95, 99) by bin(timestamp, 1h)
| render timechart
```

>[!NOTE]  
>Flex Consumption plan metrics differ from Consumption plan metrics. When comparing performance before and after migration, keep in mind that you must use different metrics to track similar performance characteristics. For more information, see [Configure monitoring](../flex-consumption-how-to.md#monitor-your-app-in-azure).

### Create custom dashboards

By using Azure Monitor metrics and Application Insights, you can [create dashboards in the Azure portal](/azure/azure-portal/azure-portal-dashboards) that display charts from both platform metrics and runtime logs and analytics.

Consider setting up dashboards and alerts on your key metrics in the Azure portal. For more information, see [Monitor your app in Azure](../flex-consumption-how-to.md?tabs=azure-portal#monitor-your-app-in-azure).

### Refine plan settings

Actual performance improvements and cost implications of the migration can vary based on your app-specific workloads and configuration. The Flex Consumption plan provides several settings that you can adjust to refine the performance of your app. You might want to make adjustments to more closely match the behavior of the original app or to balance cost versus performance. For more information, see [Fine-tune your app](../flex-consumption-how-to.md#fine-tune-your-app) in the Flex Consumption article.

### Update your resource deployment files

If you manage your function app infrastructure by using Bicep or Terraform, update your deployment files to now target the Flex Consumption plan. This section shows the key differences between Consumption and Flex Consumption plan resource definitions.

> [!IMPORTANT]
> You can't convert an existing Consumption plan app to Flex Consumption in place. You need to create new resources with a new name or delete the existing resources before deploying the Flex Consumption equivalents.

#### Key differences

When migrating your resource deployments from Consumption to Flex Consumption, consider these important changes:

| Aspect | Consumption plan | Flex Consumption plan |
| ------ | ---------------- | --------------------- |
| Hosting plan SKU | `Y1` (Dynamic) | `FC1` (FlexConsumption) |
| Plan required | Optional (autocreated) | Required (must be explicit) |
| Operating system | Windows or Linux | Linux only |
| Configuration | App settings | `functionAppConfig` section |
| Storage content share | `WEBSITE_CONTENTSHARE` setting | `deployment.storage` in `functionAppConfig` |

The following examples demonstrate the key differences between Consumption and Flex Consumption plan resource definitions. They use system assigned managed identity but aren't complete. They don't include all required resources such as storage accounts, Application Insights, or all necessary role assignments. For complete, production-ready examples, review the [Flex Consumption IaC samples](https://github.com/Azure-Samples/azure-functions-flex-consumption-samples/tree/main/IaC).

#### [Bicep](#tab/bicep)

**Consumption plan (before):**

```bicep
// Consumption plan (optional - auto-created if omitted)
resource hostingPlan 'Microsoft.Web/serverfarms@2022-03-01' = {
  name: hostingPlanName
  location: location
  sku: {
    name: 'Y1'
    tier: 'Dynamic'
  }
  properties: {
    reserved: true // Linux
  }
}

resource functionApp 'Microsoft.Web/sites@2022-03-01' = {
  name: functionAppName
  location: location
  kind: 'functionapp,linux'
  properties: {
    serverFarmId: hostingPlan.id
    siteConfig: {
      linuxFxVersion: 'DOTNET-ISOLATED|8.0'
      appSettings: [
        { name: 'FUNCTIONS_EXTENSION_VERSION', value: '~4' }
        { name: 'FUNCTIONS_WORKER_RUNTIME', value: 'dotnet-isolated' }
        { name: 'AzureWebJobsStorage__accountName', value: storageAccount.name }
        { name: 'WEBSITE_CONTENTAZUREFILECONNECTIONSTRING__accountName', value: storageAccount.name }
        { name: 'WEBSITE_CONTENTSHARE', value: functionAppName }
        { name: 'APPLICATIONINSIGHTS_CONNECTION_STRING', value: appInsights.properties.ConnectionString }
        { name: 'APPLICATIONINSIGHTS_AUTHENTICATION_STRING', value: 'Authorization=AAD' }
      ]
    }
  }
  identity: {
    type: 'SystemAssigned'
  }
}
```

**Flex Consumption plan (after):**

```bicep
// Flex Consumption plan (required)
resource hostingPlan 'Microsoft.Web/serverfarms@2023-12-01' = {
  name: hostingPlanName
  location: location
  sku: {
    name: 'FC1'
    tier: 'FlexConsumption'
  }
  kind: 'functionapp'
  properties: {
    reserved: true
  }
}

// Deployment storage container (required)
resource deploymentContainer 'Microsoft.Storage/storageAccounts/blobServices/containers@2023-05-01' = {
  name: '${storageAccount.name}/default/deployments'
}

resource functionApp 'Microsoft.Web/sites@2023-12-01' = {
  name: functionAppName
  location: location
  kind: 'functionapp,linux'
  properties: {
    serverFarmId: hostingPlan.id
    functionAppConfig: {
      deployment: {
        storage: {
          type: 'blobContainer'
          value: '${storageAccount.properties.primaryEndpoints.blob}deployments'
          authentication: {
            type: 'SystemAssignedIdentity'
          }
        }
      }
      scaleAndConcurrency: {
        maximumInstanceCount: 100
        instanceMemoryMB: 2048
      }
      runtime: {
        name: 'dotnet-isolated'
        version: '8.0'
      }
    }
    siteConfig: {
      appSettings: [
        { name: 'AzureWebJobsStorage__accountName', value: storageAccount.name }
        { name: 'APPLICATIONINSIGHTS_CONNECTION_STRING', value: appInsights.properties.ConnectionString }
        { name: 'APPLICATIONINSIGHTS_AUTHENTICATION_STRING', value: 'Authorization=AAD' }
      ]
    }
  }
  identity: {
    type: 'SystemAssigned'
  }
}
```

> [!NOTE]
> When you use `APPLICATIONINSIGHTS_AUTHENTICATION_STRING` with `Authorization=AAD`, you must also assign the **Monitoring Metrics Publisher** role to the function app's managed identity on the Application Insights resource.

For complete Bicep examples, see the [Flex Consumption Bicep samples](https://github.com/Azure-Samples/azure-functions-flex-consumption-samples/tree/main/IaC/bicep).

#### [Terraform](#tab/terraform)

**Consumption plan (before):**

```terraform
resource "azurerm_service_plan" "consumption" {
  name                = var.hosting_plan_name
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  os_type             = "Linux"
  sku_name            = "Y1"
}

resource "azurerm_linux_function_app" "consumption" {
  name                                   = var.function_app_name
  location                               = azurerm_resource_group.rg.location
  resource_group_name                    = azurerm_resource_group.rg.name
  service_plan_id                        = azurerm_service_plan.consumption.id
  storage_account_name                   = azurerm_storage_account.sa.name
  storage_uses_managed_identity          = true

  identity {
    type = "SystemAssigned"
  }

  site_config {
    application_insights_connection_string = azurerm_application_insights.appInsights.connection_string
    application_stack {
      dotnet_version              = "8.0"
      use_dotnet_isolated_runtime = true
    }
  }

  app_settings = {
    "FUNCTIONS_WORKER_RUNTIME"                  = "dotnet-isolated"
    "APPLICATIONINSIGHTS_AUTHENTICATION_STRING" = "Authorization=AAD"
  }
}
```

**Flex Consumption plan (after):**

```terraform
resource "azurerm_service_plan" "flex" {
  name                   = var.functionPlanName
  resource_group_name    = azurerm_resource_group.rg.name
  location               = var.location
  sku_name               = "FC1"
  os_type                = "Linux"
}

resource "azurerm_storage_container" "deploymentpackage" {
  name                  = "deploymentpackage"
  storage_account_id    = azurerm_storage_account.sa.id
  container_access_type = "private"
}

locals {
  blobStorageAndContainer = "${azurerm_storage_account.sa.primary_blob_endpoint}deploymentpackage"
}

resource "azurerm_function_app_flex_consumption" "flex" {
  name                        = var.functionAppName
  resource_group_name         = azurerm_resource_group.rg.name
  location                    = var.location
  service_plan_id             = azurerm_service_plan.flex.id
  storage_container_type      = "blobContainer"
  storage_container_endpoint  = local.blobStorageAndContainer
  storage_authentication_type = "SystemAssignedIdentity"
  runtime_name                = var.functionAppRuntime
  runtime_version             = var.functionAppRuntimeVersion
  maximum_instance_count      = var.maximumInstanceCount
  instance_memory_in_mb       = var.instanceMemoryMB

  identity {
    type = "SystemAssigned"
  }

  site_config {
    application_insights_connection_string = azurerm_application_insights.appInsights.connection_string
  }

  app_settings = {
    "AzureWebJobsStorage"                       = "" # Required: see note below
    "AzureWebJobsStorage__accountName"          = azurerm_storage_account.sa.name
    "APPLICATIONINSIGHTS_AUTHENTICATION_STRING" = "Authorization=AAD"
  }
}

resource "azurerm_role_assignment" "storage_roleassignment" {
  scope                = azurerm_storage_account.sa.id
  role_definition_name = "Storage Blob Data Owner"
  principal_id         = azurerm_function_app_flex_consumption.flex.identity.0.principal_id
  principal_type       = "ServicePrincipal"
}
```

> [!NOTE]
> When you use the `azurerm` provider with Flex Consumption, set `AzureWebJobsStorage` to an empty string (`""`) as a workaround until [this fix](https://github.com/hashicorp/terraform-provider-azurerm/pull/29099) is released. Use `AzureWebJobsStorage__accountName` with managed identity authentication for the actual storage connection.

For complete Terraform examples, see the [Flex Consumption Terraform samples](https://github.com/Azure-Samples/azure-functions-flex-consumption-samples/tree/main/IaC/terraformazurerm).

---

#### Reconciling resource deployments after migration

If you use infrastructure as code to manage your Azure resource deployments, update your deployment files after migrating to Flex Consumption to prevent configuration drift. Here's a recommended approach:

1. **Don't mix manual and resource-based deployments**: If you used the Azure CLI or portal to create your Flex Consumption app during migration, update your resource files before the next deployment. Otherwise, your deployments might attempt to recreate the old Consumption plan resources.

1. **Update resource names or use lifecycle management**: Since you can't convert a Consumption app to Flex Consumption in place, you have two options:
   + **New resource names**: Update your deployment code to use new names for the hosting plan and function app. This approach keeps your old resources intact until you're confident the migration succeeded.
   + **Import existing resources**: If you want to keep the same names, delete the old resources first, then let your deployment create the new Flex Consumption resources. Alternatively, import the manually created resources into your Terraform state by using `terraform import` or reference existing resources in Bicep.

1. **Verify state alignment**: After updating your deployment files, run a plan or preview operation (`terraform plan` or `az deployment group what-if`) to confirm no unexpected changes occur.

4. **Update CI/CD pipelines**: If your deployment pipelines reference the old Consumption plan configuration, update them to use the new Flex Consumption resource definitions and deployment methods.

> [!TIP]
> To minimize disruption, consider running both the old Consumption app and new Flex Consumption app in parallel during a transition period. Update your deployment to manage the new Flex Consumption app, verify it works correctly, then remove the old Consumption app resources from both Azure and your deployment files.

### Remove the original app (optional)

> [!TIP]
> **No rush here.** Keep your original app for a few days or weeks while you verify everything works. The Consumption plan only charges for actual usage, so keeping the old app (with triggers disabled) costs little.

When you're confident the new app is working correctly, you can clean up the original. This step is optional - some teams keep the old app as a reference or rollback option.

>[!IMPORTANT]  
>This action deletes your original function app. The Consumption plan remains intact if other apps use it. Before you proceed, make sure you:
>+ Successfully migrate all functionality to the new Flex Consumption app.
>+ Verify no traffic is directed to the original app.
>+ Backed up any relevant logs, configuration, or data that might be needed for reference.

#### [GitHub Copilot](#tab/github-copilot)

The Copilot migration skill for Linux can remove the original app when you're ready. Copilot always asks for your explicit confirmation before deleting anything. Use this prompt:

```
delete my original consumption app <ORIGINAL_APP_NAME>
```

#### [Azure CLI](#tab/azure-cli)

Use the [`az functionapp delete`](/cli/azure/functionapp#az-functionapp-delete) command to delete the original function app:

```azurecli
az functionapp delete --name <ORIGINAL_APP_NAME> --resource-group <RESOURCE_GROUP>
```
In this example, replace `<RESOURCE_GROUP>` and `<APP_NAME>` with your resource group and function app names. 

#### [Azure portal](#tab/azure-portal)

1. In the [Azure portal], search for or otherwise go to the page for your new app.

1. Select **Delete** from the top menu.

1. Confirm the deletion by typing the app name and selecting **Delete**.

---

## Troubleshooting and recovery strategies

Most migrations finish without problems. If something doesn't work as expected, try these solutions for common problems:

| Issue | Solution |
|-------|----------|
| Cold start performance problems | • Review [concurrency settings](../flex-consumption-how-to.md#set-http-concurrency-limits)<br/>• Check for missing dependencies |
| Missing bindings | • Verify [extension bundles](../extension-bundles.md)<br/>• Update binding configurations |
| Permission errors | • Check identity assignments and role permissions |
| Network connectivity problems | • Validate access restrictions and networking settings |
| Missing Application Insights | • Recreate the [Application Insights connection](../configure-monitoring.md#enable-application-insights-integration) |
| App fails to start | See [General troubleshooting steps](#general-troubleshooting-steps) |
| Triggers aren't processing events | See [General troubleshooting steps](#general-troubleshooting-steps) |

If you experience problems migrating a production app, consider [rolling back the migration to the original app](#rollback-steps-for-critical-production-apps) while you troubleshoot.

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

1. Back in the app page, select **Settings** > **Environment variables** and verify that all critical application settings are correctly transferred. Look for any [deprecated settings](../functions-app-settings.md#flex-consumption-plan-deprecations) that might be incorrectly migrated or any typos or incorrect connection strings. Verify the [default host storage connection](../functions-recover-storage-account.md).

1. Select **Settings** > **Identity** and double-check that the expected identities exist and that they're assigned to the correct roles.  

1. In your code, verify that all binding configurations are correct, paying particular attention to connection string names, storage queue and container names, and consumer group settings in Event Hubs triggers.

### Rollback steps for critical production apps

If you can't troubleshoot the problem, consider reverting to your original app while you continue to troubleshoot.

1. If the original app is stopped, restart it:

    #### [GitHub Copilot](#tab/github-copilot)

    Ask Copilot to restart the original app and revert the migration:

    ```
    restart my original consumption app <ORIGINAL_APP_NAME>
    ```

    #### [Azure CLI](#tab/azure-cli)

    Use the [`az functionapp start`](/cli/azure/functionapp#az-functionapp-start) command to restart the original function app:

    ```azurecli
    az functionapp start --name <ORIGINAL_APP_NAME> --resource-group <RESOURCE_GROUP>
    ```

    #### [Azure portal](#tab/azure-portal)

    In the [Azure portal], search for or otherwise navigate to the page for your new app and select **Start** from the top menu.

    ---

1. If you created new queues, topics, or containers, ensure clients are redirected back to the original resources.

1. If you modified DNS or custom domains, revert these changes to point to the original app.

## Providing feedback

If you encounter issues with your migration using this article or want to provide other feedback on this guidance, use one of these methods to get help or provide your feedback:

+ [Get help at Microsoft Q&A](/answers/tags/87/azure-functions/)  
+ Create an issue in the [Azure Functions repo](https://github.com/Azure/Azure-Functions/issues)  
+ [Provide product feedback](https://feedback.azure.com/d365community/forum/9df02822-f224-ec11-b6e6-000d3a4f0da0)  
+ [Create a support ticket](https://azure.microsoft.com/support/create-ticket)  

## Related articles

+ [Flex Consumption plan overview](../flex-consumption-plan.md)
+ [How to use the Flex Consumption plan](../flex-consumption-how-to.md)
+ [Azure CLI flex-migration commands](/cli/azure/functionapp/flex-migration) (Linux only)
+ [Flex Consumption plan general availability announcement](https://techcommunity.microsoft.com/blog/appsonazureblog/azure-functions-flex-consumption-is-now-generally-available/4298778)
+ [Flex Consumption plan-specific samples](https://github.com/Azure-Samples/azure-functions-flex-consumption-samples)

[Azure portal]: https://portal.azure.com
[az functionapp flex-migration start]: /cli/azure/functionapp/flex-migration#az-functionapp-flex-migration-start
