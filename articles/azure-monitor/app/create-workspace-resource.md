---
title: Create a new Azure Monitor Application Insights workspace-based resource
description: Learn about the steps required to enable the new Azure Monitor Application Insights workspace-based resources. 
ms.topic: conceptual
ms.date: 04/12/2023
ms.reviewer: cogoodson
ms.custom: devx-track-azurepowershell, devx-track-azurecli
---

# Workspace-based Application Insights resources

[Azure Monitor](../overview.md) [Application Insights](app-insights-overview.md#application-insights-overview) workspace-based resources integrate [Application Insights](app-insights-overview.md#application-insights-overview) and [Log Analytics](../logs/log-analytics-overview.md#overview-of-log-analytics-in-azure-monitor).

With workspace-based resources, [Application Insights](app-insights-overview.md#application-insights-overview) sends telemetry to a common [Log Analytics](../logs/log-analytics-overview.md#overview-of-log-analytics-in-azure-monitor) workspace, providing full access to all the features of [Log Analytics](../logs/log-analytics-overview.md#overview-of-log-analytics-in-azure-monitor) while keeping your application, infrastructure, and platform logs in a single consolidated location. This integration allows for common [Azure role-based access control](../roles-permissions-security.md) across your resources and eliminates the need for cross-app/workspace queries.

> [!NOTE]
> Data ingestion and retention for workspace-based Application Insights resources are billed through the Log Analytics workspace where the data is located. To learn more about billing for workspace-based Application Insights resources, see [Azure Monitor Logs pricing details](../logs/cost-logs.md).

## New capabilities

With workspace-based Application Insights, you can take advantage of the latest capabilities of Azure Monitor and Log Analytics. For example:

* [Customer-managed key](../logs/customer-managed-keys.md) provides encryption at rest for your data with encryption keys to which only you have access.
* [Azure Private Link](../logs/private-link-security.md) allows you to securely link Azure platform as a service (PaaS) services to your virtual network by using private endpoints.
* [Bring your own storage (BYOS) for Profiler and Snapshot Debugger](./profiler-bring-your-own-storage.md) allows you to control this data associated with Application Insights [Profiler](../profiler/profiler-overview.md) and [Snapshot Debugger](../snapshot-debugger/snapshot-debugger.md).
    * Encryption-at-rest policy
    * Lifetime management policy
    * Network access
* [Commitment tiers](../logs/cost-logs.md#commitment-tiers) enable you to save as much as 30% compared to the pay-as-you-go price.
* Log Analytics streaming ingests data faster.

## Create a workspace-based resource

Sign in to the [Azure portal](https://portal.azure.com), and create an Application Insights resource.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/create-workspace-resource/create-workspace-based.png" lightbox="./media/create-workspace-resource/create-workspace-based.png" alt-text="Screenshot that shows a workspace-based Application Insights resource.":::

If you don't have an existing Log Analytics workspace, see the [Log Analytics workspace creation documentation](../logs/quick-create-workspace.md).

*Workspace-based resources are currently available in all commercial regions and Azure Government. Having Application Insights and Log Analytics in two different regions can impact latency and reduce overall reliability of the monitoring solution. *

After you create your resource, you'll see corresponding workspace information in the **Overview** pane.

:::image type="content" source="./media/create-workspace-resource/workspace-name.png" lightbox="./media/create-workspace-resource/workspace-name.png" alt-text="Screenshot that shows a workspace name.":::

Select the blue link text to go to the associated Log Analytics workspace where you can take advantage of the new unified workspace query environment.

> [!NOTE]
> We still provide full backward compatibility for your Application Insights classic resource queries, workbooks, and log-based alerts. To query or view the [new workspace-based table structure or schema](convert-classic-resource.md#workspace-based-resource-changes), you must first go to your Log Analytics workspace. Select **Logs (Analytics)** in the **Application Insights** panes for access to the classic Application Insights query experience.

## Copy the connection string

The [connection string](./sdk-connection-string.md?tabs=net) identifies the resource that you want to associate your telemetry data with. You can also use it to modify the endpoints your resource uses as a destination for your telemetry. You must copy the connection string and add it to your application's code or to an environment variable.

## Configure monitoring

After you've created a workspace-based Application Insights resource, you configure monitoring.

### Code-based application monitoring

For code-based application monitoring, you install the appropriate Application Insights SDK and point the connection string to your newly created resource.

For information on how to set up an Application Insights SDK for code-based monitoring, see the following documentation specific to the language or framework:

- [ASP.NET](./asp-net.md)
- [ASP.NET Core](./asp-net-core.md)
- [Background tasks and modern console applications (.NET/.NET Core)](./worker-service.md)
- [Classic console applications (.NET)](./console.md)
- [Java](./opentelemetry-enable.md?tabs=java)
- [JavaScript](./javascript.md)
- [Node.js](./nodejs.md)
- [Python](/previous-versions/azure/azure-monitor/app/opencensus-python)

### Codeless monitoring and Visual Studio resource creation

For codeless monitoring of services like Azure Functions and Azure App Services, you first create your workspace-based Application Insights resource. Then you point to that resource when you configure monitoring.

These services offer the option to create a new Application Insights resource within their own resource creation process. But resources created via these UI options are currently restricted to the classic Application Insights experience.

The same restriction applies to the Application Insights resource creation experience in Visual Studio for ASP.NET and ASP.NET Core. You must select an existing workspace-based resource in the Visual Studio UI where you enable monitoring. Selecting **Create new resource** in Visual Studio limits you to creating a classic Application Insights resource.

## Create a resource automatically

### Azure CLI

To access the preview Application Insights Azure CLI commands, you first need to run:

```azurecli
 az extension add -n application-insights
```

If you don't run the `az extension add` command, you see an error message that states `az : ERROR: az monitor: 'app-insights' is not in the 'az monitor' command group. See 'az monitor --help'`.

Now you can run the following code to create your Application Insights resource:

```azurecli
az monitor app-insights component create --app
                                         --location
                                         --resource-group
                                         [--application-type]
                                         [--ingestion-access {Disabled, Enabled}]
                                         [--kind]
                                         [--only-show-errors]
                                         [--query-access {Disabled, Enabled}]
                                         [--tags]
                                         [--workspace]
```

#### Example

```azurecli
az monitor app-insights component create --app demoApp --location eastus --kind web -g my_resource_group --workspace "/subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/test1234/providers/microsoft.operationalinsights/workspaces/test1234555"
```

For the full Azure CLI documentation for this command, see the [Azure CLI documentation](/cli/azure/monitor/app-insights/component#az-monitor-app-insights-component-create).

### Azure PowerShell

Create a new workspace-based Application Insights resource.

```powershell
New-AzApplicationInsights -Name <String> -ResourceGroupName <String> -Location <String> -WorkspaceResourceId <String>
   [-SubscriptionId <String>]
   [-ApplicationType <ApplicationType>]
   [-DisableIPMasking]
   [-DisableLocalAuth]
   [-Etag <String>]
   [-FlowType <FlowType>]
   [-ForceCustomerStorageForProfiler]
   [-HockeyAppId <String>]
   [-ImmediatePurgeDataOn30Day]
   [-IngestionMode <IngestionMode>]
   [-Kind <String>]
   [-PublicNetworkAccessForIngestion <PublicNetworkAccessType>]
   [-PublicNetworkAccessForQuery <PublicNetworkAccessType>]
   [-RequestSource <RequestSource>]
   [-RetentionInDays <Int32>]
   [-SamplingPercentage <Double>]
   [-Tag <Hashtable>]
   [-DefaultProfile <PSObject>]
   [-Confirm]
   [-WhatIf]
   [<CommonParameters>]
```

#### Example

```powershell
New-AzApplicationInsights -Kind java -ResourceGroupName testgroup -Name test1027 -location eastus -WorkspaceResourceId "/subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/test1234/providers/microsoft.operationalinsights/workspaces/test1234555"
```

For the full PowerShell documentation for this cmdlet, and to learn how to retrieve the connection string, see the [Azure PowerShell documentation](/powershell/module/az.applicationinsights/new-azapplicationinsights).

### Azure Resource Manager templates

 To create a workspace-based resource, use the following Azure Resource Manager templates and deploy them with PowerShell.

#### Template file

```json
{
    "$schema": "http://schema.management.azure.com/schemas/2014-04-01-preview/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "name": {
            "type": "string"
        },
        "type": {
            "type": "string"
        },
        "regionId": {
            "type": "string"
        },
        "tagsArray": {
            "type": "object"
        },
        "requestSource": {
            "type": "string"
        },
        "workspaceResourceId": {
            "type": "string"
        }
    },
    "resources": [
        {
            "name": "[parameters('name')]",
            "type": "microsoft.insights/components",
            "location": "[parameters('regionId')]",
            "tags": "[parameters('tagsArray')]",
            "apiVersion": "2020-02-02-preview",
            "properties": {
                "ApplicationId": "[parameters('name')]",
                "Application_Type": "[parameters('type')]",
                "Flow_Type": "Bluefield",
                "Request_Source": "[parameters('requestSource')]",
                "WorkspaceResourceId": "[parameters('workspaceResourceId')]"
            }
        }
    ]
}
```

> [!NOTE]
> For more information on resource properties, see [Property values](/azure/templates/microsoft.insights/components?tabs=bicep#property-values).
> `Flow_Type` and `Request_Source` aren't used but are included in this sample for completeness.

#### Parameters file

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "type": {
            "value": "web"
        },
        "name": {
            "value": "customresourcename"
        },
        "regionId": {
            "value": "eastus"
        },
        "tagsArray": {
            "value": {}
        },
        "requestSource": {
            "value": "Custom"
        },
        "workspaceResourceId": {
            "value": "/subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/my_resource_group/providers/microsoft.operationalinsights/workspaces/myworkspacename"
        }
    }
}

```

## Modify the associated workspace

After you've created a workspace-based Application Insights resource, you can modify the associated Log Analytics workspace.

In the Application Insights resource pane, select **Properties** > **Change Workspace** > **Log Analytics Workspaces**.

## Export telemetry

The legacy continuous export functionality isn't supported for workspace-based resources. Instead, select **Diagnostic settings** > **Add diagnostic setting** in your Application Insights resource. You can select all tables, or a subset of tables, to archive to a storage account. You can also stream to an Azure event hub.

> [!NOTE]
> Diagnostic settings export might increase costs. For more information, see [Export telemetry from Application Insights](export-telemetry.md#diagnostic-settings-based-export).
> For pricing information for this feature, see the [Azure Monitor pricing page](https://azure.microsoft.com/pricing/details/monitor/). Prior to the start of billing, notifications will be sent. If you continue to use telemetry export after the notice period, you'll be billed at the applicable rate.

## Next steps

* [Explore metrics](../essentials/metrics-charts.md)
* [Write Log Analytics queries](../logs/log-query-overview.md)
