---
title: Create a new Azure Monitor Application Insights workspace-based resource
description: Learn about the steps required to enable the new Azure Monitor Application Insights workspace-based resources. 
ms.topic: conceptual
ms.date: 12/15/2023
ms.reviewer: cogoodson
ms.custom: devx-track-azurepowershell, devx-track-azurecli
---

# Workspace-based Application Insights resources

[Azure Monitor](../overview.md) [Application Insights](app-insights-overview.md#application-insights-overview) workspace-based resources integrate [Application Insights](app-insights-overview.md#application-insights-overview) and [Log Analytics](../logs/log-analytics-overview.md#overview-of-log-analytics-in-azure-monitor).

With workspace-based resources, [Application Insights](app-insights-overview.md#application-insights-overview) sends telemetry to a common [Log Analytics](../logs/log-analytics-overview.md#overview-of-log-analytics-in-azure-monitor) workspace, providing full access to all the features of [Log Analytics](../logs/log-analytics-overview.md#overview-of-log-analytics-in-azure-monitor) while keeping your application, infrastructure, and platform logs in a single consolidated location. This integration allows for common [Azure role-based access control](../roles-permissions-security.md) across your resources and eliminates the need for cross-app/workspace queries.

> [!NOTE]
> Data ingestion and retention for workspace-based Application Insights resources are billed through the Log Analytics workspace where the data is located. To learn more about billing for workspace-based Application Insights resources, see [Azure Monitor Logs pricing details](../logs/cost-logs.md).

## New capabilities

Workspace-based Application Insights integrates with Azure Monitor and Log Analytics to enhance capabilities:

- [Customer-managed key](../logs/customer-managed-keys.md) encrypts your data at rest with keys only you access.
- [Azure Private Link](../logs/private-link-security.md) securely connects Azure PaaS services to your virtual network using private endpoints.
- [Bring your own storage (BYOS) for Profiler and Snapshot Debugger](./profiler-bring-your-own-storage.md) lets you manage data from Application Insights [Profiler](../profiler/profiler-overview.md) and [Snapshot Debugger](../snapshot-debugger/snapshot-debugger.md) with policies on encryption, lifetime, and network access.
- [Commitment tiers](../logs/cost-logs.md#commitment-tiers) offer up to a 30% saving over pay-as-you-go pricing.
- Log Analytics streaming processes data more quickly.

## Create a workspace-based resource

Sign in to the [Azure portal](https://portal.azure.com), and create an Application Insights resource.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/create-workspace-resource/create-workspace-based.png" lightbox="./media/create-workspace-resource/create-workspace-based.png" alt-text="Screenshot that shows a workspace-based Application Insights resource.":::

If you don't have an existing Log Analytics workspace, see the [Log Analytics workspace creation documentation](../logs/quick-create-workspace.md).

*Workspace-based resources are currently available in all commercial regions and Azure Government. Having Application Insights and Log Analytics in two different regions can impact latency and reduce overall reliability of the monitoring solution.*

After you create your resource, you'll see corresponding workspace information in the **Overview** pane.

:::image type="content" source="./media/create-workspace-resource/workspace-name.png" lightbox="./media/create-workspace-resource/workspace-name.png" alt-text="Screenshot that shows a workspace name.":::

Select the blue link text to go to the associated Log Analytics workspace where you can take advantage of the new unified workspace query environment.

> [!NOTE]
> We still provide full backward compatibility for your Application Insights classic resource queries, workbooks, and log-based alerts. To query or view the [new workspace-based table structure or schema](convert-classic-resource.md#workspace-based-resource-changes), you must first go to your Log Analytics workspace. Select **Logs (Analytics)** in the **Application Insights** panes for access to the classic Application Insights query experience.

## Copy the connection string

The [connection string](./sdk-connection-string.md?tabs=net) identifies the resource that you want to associate your telemetry data with. You can also use it to modify the endpoints your resource uses as a destination for your telemetry. You must copy the connection string and add it to your application's code or to an environment variable.

## Configure monitoring

After creating a workspace-based Application Insights resource, you configure monitoring.

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

# [Bicep](#tab/bicep)

```bicep
@description('Name of Application Insights resource.')
param name string

@description('Type of app you are deploying. This field is for legacy reasons and will not impact the type of App Insights resource you deploy.')
param type string

@description('Which Azure Region to deploy the resource to. This must be a valid Azure regionId.')
param regionId string

@description('See documentation on tags: https://learn.microsoft.com/azure/azure-resource-manager/management/tag-resources.')
param tagsArray object

@description('Source of Azure Resource Manager deployment')
param requestSource string

@description('Log Analytics workspace ID to associate with your Application Insights resource.')
param workspaceResourceId string

resource component 'Microsoft.Insights/components@2020-02-02' = {
  name: name
  location: regionId
  tags: tagsArray
  kind: 'other'
  properties: {
    Application_Type: type
    Flow_Type: 'Bluefield'
    Request_Source: requestSource
    WorkspaceResourceId: workspaceResourceId
  }
}
```

# [JSON](#tab/json)

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "name": {
      "type": "string",
      "metadata": {
        "description": "Name of Application Insights resource."
      }
    },
    "type": {
      "type": "string",
      "metadata": {
        "description": "Type of app you are deploying. This field is for legacy reasons and will not impact the type of App Insights resource you deploy."
      }
    },
    "regionId": {
      "type": "string",
      "metadata": {
        "description": "Which Azure Region to deploy the resource to. This must be a valid Azure regionId."
      }
    },
    "tagsArray": {
      "type": "object",
      "metadata": {
        "description": "See documentation on tags: https://learn.microsoft.com/azure/azure-resource-manager/management/tag-resources."
      }
    },
    "requestSource": {
      "type": "string",
      "metadata": {
        "description": "Source of Azure Resource Manager deployment"
      }
    },
    "workspaceResourceId": {
      "type": "string",
      "metadata": {
        "description": "Log Analytics workspace ID to associate with your Application Insights resource."
      }
    }
  },
  "resources": [
    {
      "type": "Microsoft.Insights/components",
      "apiVersion": "2020-02-02",
      "name": "[parameters('name')]",
      "location": "[parameters('regionId')]",
      "tags": "[parameters('tagsArray')]",
      "kind": "other",
      "properties": {
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

---

### Parameter file

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "name": {
      "value": "my_workspace_based_resource"
    },
    "type": {
      "value": "web"
    },
    "regionId": {
      "value": "westus2"
    },
    "tagsArray": {
      "value": {}
    },
    "requestSource": {
      "value": "CustomDeployment"
    },
    "workspaceResourceId": {
      "value": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourcegroups/testxxxx/providers/microsoft.operationalinsights/workspaces/testworkspace"
    }
  }
}
```

## Modify the associated workspace

After creating a workspace-based Application Insights resource, you can modify the associated Log Analytics workspace.

In the Application Insights resource pane, select **Properties** > **Change Workspace** > **Log Analytics Workspaces**.

## Export telemetry

The legacy continuous export functionality isn't supported for workspace-based resources. Instead, select **Diagnostic settings** > **Add diagnostic setting** in your Application Insights resource. You can select all tables, or a subset of tables, to archive to a storage account. You can also stream to an Azure event hub.

> [!NOTE]
> Diagnostic settings export might increase costs. For more information, see [Export telemetry from Application Insights](export-telemetry.md#diagnostic-settings-based-export).
> For pricing information for this feature, see the [Azure Monitor pricing page](https://azure.microsoft.com/pricing/details/monitor/). Prior to the start of billing, notifications will be sent. If you continue to use telemetry export after the notice period, you'll be billed at the applicable rate.

## How many Application Insights resources should I deploy?

When you're developing the next version of a web application, you don't want to mix up the [Application Insights](../../azure-monitor/app/app-insights-overview.md) telemetry from the new version and the already released version.

To avoid confusion, send the telemetry from different development stages to separate Application Insights resources with separate connection strings.

If your system is an instance of Azure Cloud Services, there's [another method of setting separate connection strings](../../azure-monitor/app/azure-web-apps-net-core.md).

### About resources and connection strings

When you set up Application Insights monitoring for your web app, you create an Application Insights resource in Azure. You open the resource in the Azure portal to see and analyze the telemetry collected from your app. A connection string identifies the resource. When you install the Application Insights package to monitor your app, you configure it with the connection string so that it knows where to send the telemetry.

Each Application Insights resource comes with metrics that are available out of the box. If separate components report to the same Application Insights resource, it might not make sense to alert on these metrics.

#### When to use a single Application Insights resource

Use a single Application Insights resource for:

- Streamlining DevOps/ITOps management for applications deployed together, typically developed and managed by the same team.
- Centralizing key performance indicators, such as response times and failure rates, in a dashboard by default. Segment by role name in the metrics explorer if necessary.
- When there's no need for different Azure role-based access control management between application components.
- When identical metrics alert criteria, continuous exports, and billing/quotas management across components suffice.
- When it's acceptable for an API key to access data from all components equally, and 10 API keys meet the needs across all components.
- When the same smart detection and work item integration settings are suitable across all roles.

> [!NOTE]
> If you want to consolidate multiple Application Insights resources, you can point your existing application components to a new, consolidated Application Insights resource. The telemetry stored in your old resource won't be transferred to the new resource. Only delete the old resource when you have enough telemetry in the new resource for business continuity.

#### Other considerations

To activate portal experiences, add custom code to assign meaningful values to the [Cloud_RoleName](./app-map.md?tabs=net#set-or-override-cloud-role-name) attribute. Without these values, portal features don't function.

For Azure Service Fabric applications and classic cloud services, the SDK automatically configures services by reading from the Azure Role Environment. For other app types, you typically need to set it explicitly.

Live Metrics can't split data by role name.

### Create more Application Insights resources

To create an Applications Insights resource, see [Create an Application Insights resource](#workspace-based-application-insights-resources).

> [!WARNING]
> You might incur additional network costs if your Application Insights resource is monitoring an Azure resource (i.e., telemetry producer) in a different region. Costs will vary depending on the region the telemetry is coming from and where it is going. Refer to [Azure bandwidth pricing](https://azure.microsoft.com/pricing/details/bandwidth/) for details.

#### Get the connection string
The connection string identifies the resource that you created.

You need the connection strings of all the resources to which your app sends data.

### Filter on the build number
When you publish a new version of your app, you want to be able to separate the telemetry from different builds.

You can set the **Application Version** property so that you can filter [search](../../azure-monitor/app/transaction-search-and-diagnostics.md?tabs=transaction-search) and [metric explorer](../../azure-monitor/essentials/metrics-charts.md) results.

There are several different methods of setting the **Application Version** property.

* Set directly:

    `telemetryClient.Context.Component.Version = typeof(MyProject.MyClass).Assembly.GetName().Version;`
* Wrap that line in a [telemetry initializer](../../azure-monitor/app/api-custom-events-metrics.md#defaults) to ensure that all `TelemetryClient` instances are set consistently.
* ASP.NET: Set the version in `BuildInfo.config`. The web module picks up the version from the `BuildLabel` node. Include this file in your project and remember to set the **Copy Always** property in Solution Explorer.

    ```xml
    <?xml version="1.0" encoding="utf-8"?>
    <DeploymentEvent xmlns:xsi="https://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="https://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/VisualStudio/DeploymentEvent/2013/06">
      <ProjectName>AppVersionExpt</ProjectName>
      <Build type="MSBuild">
        <MSBuild>
          <BuildLabel kind="label">1.0.0.2</BuildLabel>
        </MSBuild>
      </Build>
    </DeploymentEvent>

    ```

* ASP.NET: Generate `BuildInfo.config` automatically in the Microsoft Build Engine. Add a few lines to your `.csproj` file:

    ```xml
    <PropertyGroup>
      <GenerateBuildInfoConfigFile>true</GenerateBuildInfoConfigFile>    <IncludeServerNameInBuildInfo>true</IncludeServerNameInBuildInfo>
    </PropertyGroup>
    ```

    This step generates a file called *yourProjectName*`.BuildInfo.config`. The Publish process renames it to `BuildInfo.config`.

    The build label contains a placeholder `(*AutoGen_...*)` when you build with Visual Studio. But when built with the Microsoft Build Engine, it's populated with the correct version number.

    To allow the Microsoft Build Engine to generate version numbers, set the version like `1.0.*` in `AssemblyReference.cs`.

### Version and release tracking
To track the application version, make sure your Microsoft Build Engine process generates `buildinfo.config`. In your `.csproj` file, add:

```xml
<PropertyGroup>
  <GenerateBuildInfoConfigFile>true</GenerateBuildInfoConfigFile>
  <IncludeServerNameInBuildInfo>true</IncludeServerNameInBuildInfo>
</PropertyGroup>
```

When the Application Insights web module has the build information, it automatically adds **Application Version** as a property to every item of telemetry. For this reason, you can filter by version when you perform [diagnostic searches](../../azure-monitor/app/transaction-search-and-diagnostics.md?tabs=transaction-search) or when you [explore metrics](../../azure-monitor/essentials/metrics-charts.md).

The Microsoft Build Engine exclusively generates the build version number, not the developer build from Visual Studio.

#### Release annotations

If you use Azure DevOps, you can [get an annotation marker](./release-and-work-item-insights.md?tabs=release-annotations) added to your charts whenever you release a new version.

## Frequently asked questions

This section provides answers to common questions.

### How do I move an Application Insights resource to a new region?

Transferring existing Application Insights resources between regions isn't supported, and you can't migrate historical data to a new region. The workaround involves:

- Creating a new workspace-based Application Insights resource in the desired region.
- Re-creating any unique customizations from the original resource in the new one.
- Updating your application with the new region resource's [connection string](./sdk-connection-string.md).
- Testing to ensure everything works as expected with the new Application Insights resource.
- Decide to either keep or delete the original Application Insights resource. Deleting a classic resource means losing all historical data. If the resource is workspace-based, the data remains in Log Analytics, enabling access to historical data until the retention period expires.

          
Unique customizations that commonly need to be manually re-created or updated for the resource in the new region include but aren't limited to:
          
- Re-create custom dashboards and workbooks.
- Re-create or update the scope of any custom log/metric alerts.
- Re-create availability alerts.
- Re-create any custom Azure role-based access control settings that are required for your users to access the new resource.
- Replicate settings involving ingestion sampling, data retention, daily cap, and custom metrics enablement. These settings are controlled via the **Usage and estimated costs** pane.
- Any integration that relies on API keys, such as [release annotations](./release-and-work-item-insights.md?tabs=release-annotations) and [live metrics secure control channel](./live-stream.md#secure-the-control-channel). You need to generate new API keys and update the associated integration.
- Continuous export in classic resources must be configured again.
- Diagnostic settings in workspace-based resources must be configured again.
          
> [!NOTE]
> If the resource you're creating in a new region is replacing a classic resource, we recommend that you explore the benefits of [creating a new workspace-based resource](#workspace-based-application-insights-resources). Alternatively, [migrate your existing resource to workspace based](./convert-classic-resource.md).

### Can I use providers('Microsoft.Insights', 'components').apiVersions[0] in my Azure Resource Manager deployments?

We don't recommend using this method of populating the API version. The newest version can represent preview releases, which might contain breaking changes. Even with newer nonpreview releases, the API versions aren't always backward compatible with existing templates. In some cases, the API version might not be available to all subscriptions.

## Next steps

* [Explore metrics](../essentials/metrics-charts.md)
* [Write Log Analytics queries](../logs/log-query-overview.md)
* [Shared resources for multiple roles](./app-map.md)
* [Create a Telemetry Initializer to distinguish A|B variants](./api-filtering-sampling.md#add-properties)
