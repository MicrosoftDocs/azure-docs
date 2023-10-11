---
title: Migrate an Application Insights classic resource to a workspace-based resource - Azure Monitor | Microsoft Docs
description: Learn how to upgrade your Application Insights classic resource to the new workspace-based model. 
ms.topic: conceptual
ms.date: 08/11/2023
ms.reviewer: cawa
---

# Migrate to workspace-based Application Insights resources

This article walks you through migrating a classic Application Insights resource to a workspace-based resource.

Workspace-based resources:

> [!div class="checklist"]
> - Support full integration between Application Insights and [Log Analytics](../logs/log-analytics-overview.md).
> - Send Application Insights telemetry to a common [Log Analytics workspace](../logs/log-analytics-workspace-overview.md).
> - Allow you to access [the latest features of Azure Monitor](#new-capabilities) while keeping application, infrastructure, and platform logs in a consolidated location.
> - Enable common [Azure role-based access control](../../role-based-access-control/overview.md) across your resources.
> - Eliminate the need for cross-app/workspace queries.
> - Are available in all commercial regions and [Azure US Government](../../azure-government/index.yml).
> - Don't require changing instrumentation keys after migration from a classic resource.


> [!IMPORTANT]
> * On February 29, 2024, continuous export will be deprecated as part of the classic Application Insights deprecation.
> * When you [migrate to a workspace-based Application Insights resource](convert-classic-resource.md), you must use [diagnostic settings](export-telemetry.md#diagnostic-settings-based-export) for exporting telemetry. All [workspace-based Application Insights resources](./create-workspace-resource.md) must use [diagnostic settings](./create-workspace-resource.md#export-telemetry).
> * Diagnostic settings export might increase costs. For more information, see [Diagnostic settings-based export](export-telemetry.md#diagnostic-settings-based-export).

## New capabilities

Workspace-based Application Insights resources allow you to take advantage of the latest capabilities of Azure Monitor and Log Analytics:

* [Customer-managed keys](../logs/customer-managed-keys.md) provide encryption at rest for your data with encryption keys that only you have access to.
* [Azure Private Link](../logs/private-link-security.md) allows you to securely link the Azure platform as a service (PaaS) to your virtual network by using private endpoints.
* [Bring your own storage (BYOS) for Profiler and Snapshot Debugger](./profiler-bring-your-own-storage.md) gives you full control over:
    - Encryption-at-rest policy.
    - Lifetime management policy.
    - Network access for all data associated with Application Insights Profiler and Snapshot Debugger.
* [Commitment tiers](../logs/cost-logs.md#commitment-tiers) enable you to save as much as 30% compared to the pay-as-you-go price. Otherwise, billing for pay-as-you-go data ingestion and data retention in Log Analytics is similar to the billing in Application Insights.
* Data is ingested faster via Log Analytics streaming ingestion.

> [!NOTE]
> After you migrate to a workspace-based Application Insights resource, telemetry from multiple Application Insights resources might be stored in a common Log Analytics workspace. You can still pull data from a specific Application Insights resource, as described in the section [Understand log queries](#understand-log-queries).

## Migration process

When you migrate to a workspace-based resource, no data is transferred from your classic resource's storage to the new workspace-based storage. Choosing to migrate changes the location where new data is written to a Log Analytics workspace while preserving access to your classic resource data.

Your classic resource data persists and is subject to the retention settings on your classic Application Insights resource. All new data ingested post migration is subject to the [retention settings](../logs/data-retention-archive.md) of the associated Log Analytics workspace, which also supports [different retention settings by data type](../logs/data-retention-archive.md#configure-retention-and-archive-at-the-table-level).

*The migration process is permanent and can't be reversed.* After you migrate a resource to workspace-based Application Insights, it will always be a workspace-based resource. After you migrate, you can change the target workspace as often as needed.

If you don't need to migrate an existing resource, and instead want to create a new workspace-based Application Insights resource, see the [Workspace-based resource creation guide](create-workspace-resource.md).

## Prerequisites

- A Log Analytics workspace with the access control mode set to the **Use resource or workspace permissions** setting:

    - Workspace-based Application Insights resources aren't compatible with workspaces set to the dedicated **workspace-based permissions** setting. To learn more about Log Analytics workspace access control, see the [Access control mode guidance](../logs/manage-access.md#access-control-mode).
    - If you don't already have an existing Log Analytics workspace, see the [Log Analytics workspace creation documentation](../logs/quick-create-workspace.md).
    
- **Continuous export** isn't compatible with workspace-based resources and must be disabled. After the migration is finished, you can use [diagnostic settings](../essentials/diagnostic-settings.md) to configure data archiving to a storage account or streaming to Azure Event Hubs.

    > [!CAUTION]
    > * Diagnostic settings use a different export format/schema than continuous export. Migrating breaks any existing integrations with Azure Stream Analytics.
    > * Diagnostic settings export might increase costs. For more information, see [Export telemetry from Application Insights](export-telemetry.md#diagnostic-settings-based-export).

- Check your current retention settings under **Settings** > **Usage and estimated costs** > **Data Retention** for your Log Analytics workspace. This setting affects how long any new ingested data is stored after you migrate your Application Insights resource.

    > [!NOTE]
    > -  If you currently store Application Insights data for longer than the default 90 days and want to retain this longer retention period after migration, adjust your [workspace retention settings](../logs/data-retention-archive.md?tabs=portal-1%2cportal-2#configure-retention-and-archive-at-the-table-level).
    > - If you've selected data retention longer than 90 days on data ingested into the classic Application Insights resource prior to migration, data retention continues to be billed through that Application Insights resource until the data exceeds the retention period.
    > - If the retention setting for your Application Insights instance under **Configure** > **Usage and estimated costs** > **Data Retention** is enabled, use that setting to control the retention days for the telemetry data still saved in your classic resource's storage.

- Understand [workspace-based Application Insights](../logs/cost-logs.md#application-insights-billing) usage and costs.

## Migrate your resource

To migrate a classic Application Insights resource to a workspace-based resource:

1. From your Application Insights resource, select **Properties** under the **Configure** heading in the menu on the left.

   :::image type="content" source="./media/convert-classic-resource/properties.png" lightbox="./media/convert-classic-resource/properties.png" alt-text="Screenshot that shows Properties under the Configure heading.":::

1. Select **Migrate to Workspace-based**.

   :::image type="content" source="./media/convert-classic-resource/migrate.png" lightbox="./media/convert-classic-resource/migrate.png" alt-text="Screenshot that shows the Migrate to Workspace-based button.":::

1. Select the Log Analytics workspace where you want all future ingested Application Insights telemetry to be stored. It can either be a Log Analytics workspace in the same subscription or a different subscription that shares the same Microsoft Entra tenant. The Log Analytics workspace doesn't have to be in the same resource group as the Application Insights resource.

   > [!NOTE]
   > Migrating to a workspace-based resource can take up to 24 hours, but the process is usually faster. Rely on accessing data through your Application Insights resource while you wait for the migration process to finish. After it's finished, you'll see new data stored in the Log Analytics workspace tables.

   :::image type="content" source="./media/convert-classic-resource/migration.png" lightbox="./media/convert-classic-resource/migration.png" alt-text="Screenshot that shows the Migration wizard UI with the option to select target workspace.":::

   After your resource is migrated, you'll see the corresponding workspace information in the **Overview** pane.

   :::image type="content" source="./media/create-workspace-resource/workspace-name.png" lightbox="./media/create-workspace-resource/workspace-name.png" alt-text="Screenshot that shows the Workspace name.":::

   Selecting the blue link text takes you to the associated Log Analytics workspace where you can take advantage of the new unified workspace query environment.

> [!TIP]
> After you migrate to a workspace-based Application Insights resource, use the [workspace's daily cap](../logs/daily-cap.md) to limit ingestion and costs instead of the cap in Application Insights.

## Understand log queries

We provide full backward compatibility for your Application Insights classic resource queries, workbooks, and log-based alerts within the Application Insights experience.

To write queries against the [new workspace-based table structure/schema](#workspace-based-resource-changes), you must first go to your Log Analytics workspace.

To ensure the queries run successfully, validate that the query's fields align with the [new schema fields](#appmetrics).

You might have multiple Application Insights resources that store telemetry in one Log Analytics workspace, but you want to query data from one specific Application Insights resource. You have two options:

- Go to your Application Insights resource and select the **Logs** tab. All queries from this tab automatically pull data from the selected Application Insights resource.
- Go to the Log Analytics workspace that you configured as the destination for your Application Insights telemetry and select the **Logs** tab. To query data from a specific Application Insights resource, filter for the built-in `_ResourceId` property that's available in all application-specific tables.

When you query directly from the Log Analytics workspace, you only see data that's ingested post migration. To see both your classic Application Insights data and the new data ingested after migration in a unified query experience, use the **Logs** tab from within your migrated Application Insights resource.

> [!NOTE]
> If you rename your Application Insights resource after you migrate to the workspace-based model, the Application Insights **Logs** tab no longer shows the telemetry collected before renaming. You can see all old and new data on the **Logs** tab of the associated Log Analytics resource.


## Identifying the Application Insights resources by ingestion type

Use the following script to identify your Application Insights resources by ingestion type.

#### Example

```azurecli

Get-AzApplicationInsights -SubscriptionId '7faeaa41-541f-48da-82b4-3dc10c594b85' | Format-Table -Property Name, IngestionMode, WorkspaceResourceId, @{label='Type';expression={if ($_.ingestionMode -eq 'LogAnalytics') {'Workspace-based'} elseif ($_.IngestionMode -eq 'ApplicatonInsights') {'Classic'}}}

```

## Programmatic resource migration

This section helps you migrate your resources.

### Azure CLI

To access the preview Application Insights Azure CLI commands, you first need to run:

```azurecli
 az extension add -n application-insights
```

If you don't run the `az extension add` command, you see an error message that states `az : ERROR: az monitor: 'app-insights' is not in the 'az monitor' command group. See 'az monitor --help'.`

Now you can run the following code to create your Application Insights resource:

```azurecli
az monitor app-insights component update --app
                                         --resource-group
                                         [--ingestion-access {Disabled, Enabled}]
                                         [--kind]
                                         [--query-access {Disabled, Enabled}]
                                         [--retention-time]
                                         [--workspace]
```

#### Example

```azurecli
az monitor app-insights component update --app your-app-insights-resource-name -g your_resource_group --workspace "/subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/test1234/providers/microsoft.operationalinsights/workspaces/test1234555"
```

For the full Azure CLI documentation for this command, see the [Azure CLI documentation](/cli/azure/monitor/app-insights/component#az-monitor-app-insights-component-update).

### Azure PowerShell

Starting with version 8.0 or higher of [Azure PowerShell](/powershell/azure/what-is-azure-powershell), you can use the  `Update-AzApplicationInsights` PowerShell command to migrate a classic Application Insights resource to workspace based.

To use this cmdlet, you need to specify the name and resource group of the Application Insights resource that you want to update. Use the `IngestionMode` and `WorkspaceResoruceId` parameters to migrate your classic instance to workspace-based. For more information on the parameters and syntax of this cmdlet, see [Update-AzApplicationInsights](/powershell/module/az.applicationinsights/update-azapplicationinsights).

#### Example

```powershell
# Get the resource ID of the Log Analytics workspace
$workspaceResourceId = (Get-AzOperationalInsightsWorkspace -ResourceGroupName "rgName" -Name "laName").ResourceId

# Update the Application Insights resource with the workspace parameter
Update-AzApplicationInsights -Name "aiName" -ResourceGroupName "rgName" -IngestionMode LogAnalytics -WorkspaceResourceId $workspaceResourceId
```

### Azure Resource Manager templates

This section provides templates.

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
                "Flow_Type": "Redfield",
                "Request_Source": "[parameters('requestSource')]",
                "WorkspaceResourceId": "[parameters('workspaceResourceId')]"
            }
        }
    ]
}
```

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

After you create a workspace-based Application Insights resource, you can modify the associated Log Analytics workspace.

From within the Application Insights resource pane, select **Properties** > **Change Workspace** > **Log Analytics Workspaces**.

## Frequently asked questions

This section provides answers to common questions.

### Is there any implication on the cost from migration?

There's usually no difference, with a couple of exceptions:

 - Migrated Application Insights resources can use [Log Analytics commitment tiers](../logs/cost-logs.md#commitment-tiers) to reduce cost if the data volumes in the workspace are high enough.
 - Grandfathered Application Insights resources no longer get 1 GB per month free from the original Application Insights pricing model.

### How will telemetry capping work?

You can set a [daily cap on the Log Analytics workspace](../logs/daily-cap.md#application-insights).

There's no strict billing capping available.

### How will ingestion-based sampling work?

There are no changes to ingestion-based sampling.

### Are there gaps in data collected during migration?

No. We merge data during query time.

### Do old log queries continue to work?

Yes, they continue to work.

### Will my dashboards that have pinned metric and log charts continue to work after migration?

Yes, they continue to work.

### Does migration affect AppInsights API accessing data?

No. Migration doesn't affect existing API access to data. After migration, you can access data directly from a workspace by using a [slightly different schema](#workspace-based-resource-changes).

### Is there any impact on Live Metrics or other monitoring experiences?

No. There's no impact to [Live Metrics](live-stream.md#live-metrics-monitor-and-diagnose-with-1-second-latency) or other monitoring experiences.

### What happens with continuous export after migration?

Continuous export doesn't support workspace-based resources.

Switch to [diagnostic settings](../essentials/diagnostic-settings.md#diagnostic-settings-in-azure-monitor).

## Troubleshooting

This section offers troubleshooting tips for common issues.

### Access mode

**Error message:** "The selected workspace is configured with workspace-based access mode. Some APM features may be impacted. Select another workspace or allow resource-based access in the workspace settings. You can override this error by using CLI."

For your workspace-based Application Insights resource to operate properly, you need to change the access control mode of your target Log Analytics workspace to the **Resource or workspace permissions** setting. This setting is located in the Log Analytics workspace UI under **Properties** > **Access control mode**. For instructions, see the [Log Analytics configure access control mode guidance](../logs/manage-access.md#access-control-mode). If your access control mode is set to the exclusive **Require workspace permissions** setting, migration via the portal migration experience remains blocked.

If you can't change the access control mode for security reasons for your current target workspace, create a new Log Analytics workspace to use for the migration.

### Continuous export

**Error message:** "Continuous Export needs to be disabled before continuing. After migration, use Diagnostic Settings for export."

The legacy **Continuous export** functionality isn't supported for workspace-based resources. Prior to migrating, you need to disable continuous export.

1. From your Application Insights resource view, under the **Configure** heading, select **Continuous export**.

    :::image type="content" source="./media/convert-classic-resource/continuous-export.png" lightbox="./media/convert-classic-resource/continuous-export.png" alt-text="Screenshot that shows the Continuous export menu item.":::

1. Select **Disable**.

    :::image type="content" source="./media/convert-classic-resource/disable.png" lightbox="./media/convert-classic-resource/disable.png" alt-text="Screenshot that shows the Continuous export Disable button.":::

   - After you select **Disable**, you can go back to the migration UI. If the **Edit continuous export** page prompts you that your settings aren't saved, select **OK**. This prompt doesn't pertain to disabling or enabling continuous export.

   - After you've successfully migrated your Application Insights resource to workspace based, you can use diagnostic settings to replace the functionality that continuous export used to provide. Select **Diagnostics settings** > **Add diagnostic setting** in your Application Insights resource. You can select all tables, or a subset of tables, to archive to a storage account or stream to Azure Event Hubs. For more information on diagnostic settings, see the [Azure Monitor diagnostic settings guidance](../essentials/diagnostic-settings.md).

### Retention settings

**Warning message:** "Your customized Application Insights retention settings won't apply to data sent to the workspace. You'll need to reconfigure these separately."

You don't have to make any changes prior to migrating. This message alerts you that your current Application Insights retention settings aren't set to the default 90-day retention period. This warning message means you might want to modify the retention settings for your Log Analytics workspace prior to migrating and starting to ingest new data.

You can check your current retention settings for Log Analytics under **Settings** > **Usage and estimated costs** > **Data Retention** in the Log Analytics UI. This setting affects how long any new ingested data is stored after you migrate your Application Insights resource.

## Workspace-based resource changes

Prior to the introduction of [workspace-based Application Insights resources](create-workspace-resource.md), Application Insights data was stored separately from other log data in Azure Monitor. Both are based on Azure Data Explorer and use the same Kusto Query Language (KQL). Workspace-based Application Insights resources data is stored in a Log Analytics workspace, together with other monitoring data and application data. This arrangement simplifies your configuration. You can analyze data across multiple solutions more easily and use the capabilities of workspaces.

### Classic data structure

The structure of a Log Analytics workspace is described in [Log Analytics workspace overview](../logs/log-analytics-workspace-overview.md). For a classic application, the data isn't stored in a Log Analytics workspace. It uses the same query language. You create and run queries by using the same Log Analytics tool in the Azure portal. Data items for classic applications are stored separately from each other. The general structure is the same as for workspace-based applications, although the table and column names are different.

> [!NOTE]
> The classic Application Insights experience includes backward compatibility for your resource queries, workbooks, and log-based alerts. To query or view against the [new workspace-based table structure or schema](#table-structure), first go to your Log Analytics workspace. During the preview, selecting **Logs** in the Application Insights pane gives you access to the classic Application Insights query experience. For more information, see [Query scope](../logs/scope.md).

[:::image type="content" source="../logs/media/data-platform-logs/logs-structure-ai.png" lightbox="../logs/media/data-platform-logs/logs-structure-ai.png" alt-text="Diagram that shows the Azure Monitor Logs structure for Application Insights.":::

### Table structure

| Legacy table name | New table name | Description |
|:---|:---|:---|
| availabilityResults | AppAvailabilityResults |  Summary data from availability tests.|
| browserTimings | AppBrowserTimings | Data about client performance, such as the time taken to process the incoming data.|
| dependencies | AppDependencies | Calls from the application to other components (including external components) recorded via `TrackDependency()`. Examples are calls to the REST API or database or a file system.  |
| customEvents | AppEvents | Custom events created by your application. |
| customMetrics | AppMetrics | Custom metrics created by your application. |
| pageViews | AppPageViews| Data about each website view with browser information. |
| performanceCounters | AppPerformanceCounters | Performance measurements from the compute resources that support the application. An example is Windows performance counters. |
| requests | AppRequests | Requests received by your application. For example, a separate request record is logged for each HTTP request that your web app receives.  |
| exceptions | AppExceptions | Exceptions thrown by the application runtime. Captures both server side and client-side (browsers) exceptions. |
| traces | AppTraces | Detailed logs (traces) emitted through application code/logging frameworks recorded via `TrackTrace()`. |

> [!CAUTION]
> Don't take a production dependency on the Log Analytics tables until you see new telemetry records show up directly in Log Analytics. It might take up to 24 hours after the migration process started for records to appear.

### Table schemas

The following sections show the mapping between the classic property names and the new workspace-based Application Insights property names. Use this information to convert any queries by using legacy tables.

Most of the columns have the same name with different capitalization. KQL is case sensitive, so you need to change each column name along with the table names in existing queries. Columns with changes in addition to capitalization are highlighted. You can still use your classic Application Insights queries within the **Logs** pane of your Application Insights resource, even if it's a workspace-based resource. The new property names are required when you query from within the context of the Log Analytics workspace experience.

#### AppAvailabilityResults

Legacy table: availabilityResults

|ApplicationInsights|Type|LogAnalytics|Type|
|:---|:---|:---|:---|
|appId|string|ResourceGUID|string|
|application_Version|string|AppVersion|string|
|appName|string|\_ResourceId|string|
|client_Browser|string|ClientBrowser|string|
|client_City|string|ClientCity|string|
|client_CountryOrRegion|string|ClientCountryOrRegion|string|
|client_IP|string|ClientIP|string|
|client_Model|string|ClientModel|string|
|client_OS|string|ClientOS|string|
|client_StateOrProvince|string|ClientStateOrProvince|string|
|client_Type|string|ClientType|string|
|cloud_RoleInstance|string|AppRoleInstance|string|
|cloud_RoleName|string|AppRoleName|string|
|customDimensions|dynamic|Properties|Dynamic|
|customMeasurements|dynamic|Measurements|Dynamic|
|duration|real|DurationMs|real|
|`id`|string|`Id`|string|
|iKey|string|IKey|string|
|itemCount|int|ItemCount|int|
|itemId|string|\_ItemId|string|
|itemType|string|Type|String|
|location|string|Location|string|
|message|string|Message|string|
|name|string|Name|string|
|operation_Id|string|OperationId|string|
|operation_Name|string|OperationName|string|
|operation_ParentId|string|ParentId|string|
|operation_SyntheticSource|string|OperationSyntheticSource|string|
|performanceBucket|string|PerformanceBucket|string|
|sdkVersion|string|SDKVersion|string|
|session_Id|string|SessionId|string|
|size|real|Size|real|
|success|string|Success|Bool|
|timestamp|datetime|TimeGenerated|datetime|
|user_AccountId|string|UserAccountId|string|
|user_AuthenticatedId|string|UserAuthenticatedId|string|
|user_Id|string|UserId|string|

#### AppBrowserTimings

Legacy table: browserTimings

|ApplicationInsights|Type|LogAnalytics|Type|
|:---|:---|:---|:---|
|appId|string|ResourceGUID|string|
|application_Version|string|AppVersion|string|
|appName|string|\_ResourceId|string|
|client_Browser|string|ClientBrowser|string|
|client_City|string|ClientCity|string|
|client_CountryOrRegion|string|ClientCountryOrRegion|string|
|client_IP|string|ClientIP|string|
|client_Model|string|ClientModel|string|
|client_OS|string|ClientOS|string|
|client_StateOrProvince|string|ClientStateOrProvince|string|
|client_Type|string|ClientType|string|
|cloud_RoleInstance|string|AppRoleInstance|string|
|cloud_RoleName|string|AppRoleName|string|
|customDimensions|dynamic|Properties|Dynamic|
|customMeasurements|dynamic|Measurements|Dynamic|
|iKey|string|IKey|string|
|itemCount|int|ItemCount|int|
|itemId|string|\_ItemId|string|
|itemType|string|Type|string|
|name|string|Name|datetime|
|networkDuration|real|NetworkDurationMs|real|
|operation_Id|string|OperationId|string|
|operation_Name|string|OperationName|string|
|operation_ParentId|string|ParentId|string|
|operation_SyntheticSource|string|OperationSyntheticSource|string|
|performanceBucket|string|PerformanceBucket|string|
|processingDuration|real|ProcessingDurationMs|real|
|receiveDuration|real|ReceiveDurationMs|real|
|sdkVersion|string|SDKVersion|string|
|sendDuration|real|SendDurationMs|real|
|session_Id|string|SessionId|string|
|timestamp|datetime|TimeGenerated|datetime|
|totalDuration|real|TotalDurationMs|real|
|url|string|Url|string|
|user_AccountId|string|UserAccountId|string|
|user_AuthenticatedId|string|UserAuthenticatedId|string|
|user_Id|string|UserId|string|

#### AppDependencies

Legacy table: dependencies

|ApplicationInsights|Type|LogAnalytics|Type|
|:---|:---|:---|:---|
|appId|string|ResourceGUID|string|
|application_Version|string|AppVersion|string|
|appName|string|\_ResourceId|string|
|client_Browser|string|ClientBrowser|string|
|client_City|string|ClientCity|string|
|client_CountryOrRegion|string|ClientCountryOrRegion|string|
|client_IP|string|ClientIP|string|
|client_Model|string|ClientModel|string|
|client_OS|string|ClientOS|string|
|client_StateOrProvince|string|ClientStateOrProvince|string|
|client_Type|string|ClientType|string|
|cloud_RoleInstance|string|AppRoleInstance|string|
|cloud_RoleName|string|AppRoleName|string|
|customDimensions|dynamic|Properties|Dynamic|
|customMeasurements|dynamic|Measurements|Dynamic|
|data|string|Data|string|
|duration|real|DurationMs|real|
|`id`|string|`Id`|string|
|iKey|string|IKey|string|
|itemCount|int|ItemCount|int|
|itemId|string|\_ItemId|string|
|itemType|string|Type|String|
|name|string|Name|string|
|operation_Id|string|OperationId|string|
|operation_Name|string|OperationName|string|
|operation_ParentId|string|ParentId|string|
|operation_SyntheticSource|string|OperationSyntheticSource|string|
|performanceBucket|string|PerformanceBucket|string|
|resultCode|string|ResultCode|string|
|sdkVersion|string|SDKVersion|string|
|session_Id|string|SessionId|string|
|success|string|Success|Bool|
|target|string|Target|string|
|timestamp|datetime|TimeGenerated|datetime|
|type|string|DependencyType|string|
|user_AccountId|string|UserAccountId|string|
|user_AuthenticatedId|string|UserAuthenticatedId|string|
|user_Id|string|UserId|string|

#### AppEvents

Legacy table: customEvents

|ApplicationInsights|Type|LogAnalytics|Type|
|:---|:---|:---|:---|
|appId|string|ResourceGUID|string|
|application_Version|string|AppVersion|string|
|appName|string|\_ResourceId|string|
|client_Browser|string|ClientBrowser|string|
|client_City|string|ClientCity|string|
|client_CountryOrRegion|string|ClientCountryOrRegion|string|
|client_IP|string|ClientIP|string|
|client_Model|string|ClientModel|string|
|client_OS|string|ClientOS|string|
|client_StateOrProvince|string|ClientStateOrProvince|string|
|client_Type|string|ClientType|string|
|cloud_RoleInstance|string|AppRoleInstance|string|
|cloud_RoleName|string|AppRoleName|string|
|customDimensions|dynamic|Properties|Dynamic|
|customMeasurements|dynamic|Measurements|Dynamic|
|iKey|string|IKey|string|
|itemCount|int|ItemCount|int|
|itemId|string|\_ItemId|string|
|itemType|string|Type|string|
|name|string|Name|string|
|operation_Id|string|OperationId|string|
|operation_Name|string|OperationName|string|
|operation_ParentId|string|ParentId|string|
|operation_SyntheticSource|string|OperationSyntheticSource|string|
|sdkVersion|string|SDKVersion|string|
|session_Id|string|SessionId|string|
|timestamp|datetime|TimeGenerated|datetime|
|user_AccountId|string|UserAccountId|string|
|user_AuthenticatedId|string|UserAuthenticatedId|string|
|user_Id|string|UserId|string|

#### AppMetrics

Legacy table: customMetrics

|ApplicationInsights|Type|LogAnalytics|Type|
|:---|:---|:---|:---|
|appId|string|ResourceGUID|string|
|application_Version|string|AppVersion|string|
|appName|string|\_ResourceId|string|
|client_Browser|string|ClientBrowser|string|
|client_City|string|ClientCity|string|
|client_CountryOrRegion|string|ClientCountryOrRegion|string|
|client_IP|string|ClientIP|string|
|client_Model|string|ClientModel|string|
|client_OS|string|ClientOS|string|
|client_StateOrProvince|string|ClientStateOrProvince|string|
|client_Type|string|ClientType|string|
|cloud_RoleInstance|string|AppRoleInstance|string|
|cloud_RoleName|string|AppRoleName|string|
|customDimensions|dynamic|Properties|Dynamic|
|iKey|string|IKey|string|
|itemId|string|\_ItemId|string|
|itemType|string|Type|string|
|name|string|Name|string|
|operation_Id|string|OperationId|string|
|operation_Name|string|OperationName|string|
|operation_ParentId|string|ParentId|string|
|operation_SyntheticSource|string|OperationSyntheticSource|string|
|sdkVersion|string|SDKVersion|string|
|session_Id|string|SessionId|string|
|timestamp|datetime|TimeGenerated|datetime|
|user_AccountId|string|UserAccountId|string|
|user_AuthenticatedId|string|UserAuthenticatedId|string|
|user_Id|string|UserId|string|
|value|real|(removed)||
|valueCount|int|ItemCount|int|
|valueMax|real|ValueMax|real|
|valueMin|real|ValueMin|real|
|valueSum|real|ValueSum|real|

> [!NOTE]
> Older versions of Application Insights SDKs are used to report standard deviation (`valueStdDev`) in the metrics pre-aggregation. Because adoption in metrics analysis was light, the field was removed and is no longer aggregated by the SDKs. If the value is received by the Application Insights data collection endpoint, it's dropped during ingestion and isn't sent to the Log Analytics workspace. If you want to use standard deviation in your analysis, use queries against Application Insights raw events.

#### AppPageViews

Legacy table: pageViews

|ApplicationInsights|Type|LogAnalytics|Type|
|:---|:---|:---|:---|
|appId|string|ResourceGUID|string|
|application_Version|string|AppVersion|string|
|appName|string|\_ResourceId|string|
|client_Browser|string|ClientBrowser|string|
|client_City|string|ClientCity|string|
|client_CountryOrRegion|string|ClientCountryOrRegion|string|
|client_IP|string|ClientIP|string|
|client_Model|string|ClientModel|string|
|client_OS|string|ClientOS|string|
|client_StateOrProvince|string|ClientStateOrProvince|string|
|client_Type|string|ClientType|string|
|cloud_RoleInstance|string|AppRoleInstance|string|
|cloud_RoleName|string|AppRoleName|string|
|customDimensions|dynamic|Properties|Dynamic|
|customMeasurements|dynamic|Measurements|Dynamic|
|duration|real|DurationMs|real|
|`id`|string|`Id`|string|
|iKey|string|IKey|string|
|itemCount|int|ItemCount|int|
|itemId|string|\_ItemId|string|
|itemType|string|Type|String|
|name|string|Name|string|
|operation_Id|string|OperationId|string|
|operation_Name|string|OperationName|string|
|operation_ParentId|string|ParentId|string|
|operation_SyntheticSource|string|OperationSyntheticSource|string|
|performanceBucket|string|PerformanceBucket|string|
|sdkVersion|string|SDKVersion|string|
|session_Id|string|SessionId|string|
|timestamp|datetime|TimeGenerated|datetime|
|url|string|Url|string|
|user_AccountId|string|UserAccountId|string|
|user_AuthenticatedId|string|UserAuthenticatedId|string|
|user_Id|string|UserId|string|

#### AppPerformanceCounters

Legacy table: performanceCounters

|ApplicationInsights|Type|LogAnalytics|Type|
|:---|:---|:---|:---|
|appId|string|ResourceGUID|string|
|application_Version|string|AppVersion|string|
|appName|string|\_ResourceId|string|
|category|string|Category|string|
|client_Browser|string|ClientBrowser|string|
|client_City|string|ClientCity|string|
|client_CountryOrRegion|string|ClientCountryOrRegion|string|
|client_IP|string|ClientIP|string|
|client_Model|string|ClientModel|string|
|client_OS|string|ClientOS|string|
|client_StateOrProvince|string|ClientStateOrProvince|string|
|client_Type|string|ClientType|string|
|cloud_RoleInstance|string|AppRoleInstance|string|
|cloud_RoleName|string|AppRoleName|string|
|counter|string|(removed)||
|customDimensions|dynamic|Properties|Dynamic|
|iKey|string|IKey|string|
|instance|string|Instance|string|
|itemId|string|\_ItemId|string|
|itemType|string|Type|string|
|name|string|Name|string|
|operation_Id|string|OperationId|string|
|operation_Name|string|OperationName|string|
|operation_ParentId|string|ParentId|string|
|operation_SyntheticSource|string|OperationSyntheticSource|string|
|sdkVersion|string|SDKVersion|string|
|session_Id|string|SessionId|string|
|timestamp|datetime|TimeGenerated|datetime|
|user_AccountId|string|UserAccountId|string|
|user_AuthenticatedId|string|UserAuthenticatedId|string|
|user_Id|string|UserId|string|
|value|real|Value|real|

#### AppRequests

Legacy table: requests

|ApplicationInsights|Type|LogAnalytics|Type|
|:---|:---|:---|:---|
|appId|string|ResourceGUID|string|
|application_Version|string|AppVersion|string|
|appName|string|\_ResourceId|string|
|client_Browser|string|ClientBrowser|string|
|client_City|string|ClientCity|string|
|client_CountryOrRegion|string|ClientCountryOrRegion|string|
|client_IP|string|ClientIP|string|
|client_Model|string|ClientModel|string|
|client_OS|string|ClientOS|string|
|client_StateOrProvince|string|ClientStateOrProvince|string|
|client_Type|string|ClientType|string|
|cloud_RoleInstance|string|AppRoleInstance|string|
|cloud_RoleName|string|AppRoleName|string|
|customDimensions|dynamic|Properties|Dynamic|
|customMeasurements|dynamic|Measurements|Dynamic|
|duration|real|DurationMs|Real|
|`id`|string|`Id`|String|
|iKey|string|IKey|string|
|itemCount|int|ItemCount|int|
|itemId|string|\_ItemId|string|
|itemType|string|Type|String|
|name|string|Name|String|
|operation_Id|string|OperationId|string|
|operation_Name|string|OperationName|string|
|operation_ParentId|string|ParentId|string|
|operation_SyntheticSource|string|OperationSyntheticSource|string|
|performanceBucket|string|PerformanceBucket|String|
|resultCode|string|ResultCode|String|
|sdkVersion|string|SDKVersion|string|
|session_Id|string|SessionId|string|
|source|string|Source|String|
|success|string|Success|Bool|
|timestamp|datetime|TimeGenerated|datetime|
|url|string|Url|String|
|user_AccountId|string|UserAccountId|string|
|user_AuthenticatedId|string|UserAuthenticatedId|string|
|user_Id|string|UserId|string|

#### AppExceptions

Legacy table: exceptions

|ApplicationInsights|Type|LogAnalytics|Type|
|:---|:---|:---|:---|
|appId|string|ResourceGUID|string|
|application_Version|string|AppVersion|string|
|appName|string|\_ResourceId|string|
|assembly|string|Assembly|string|
|client_Browser|string|ClientBrowser|string|
|client_City|string|ClientCity|string|
|client_CountryOrRegion|string|ClientCountryOrRegion|string|
|client_IP|string|ClientIP|string|
|client_Model|string|ClientModel|string|
|client_OS|string|ClientOS|string|
|client_StateOrProvince|string|ClientStateOrProvince|string|
|client_Type|string|ClientType|string|
|cloud_RoleInstance|string|AppRoleInstance|string|
|cloud_RoleName|string|AppRoleName|string|
|customDimensions|dynamic|Properties|dynamic|
|customMeasurements|dynamic|Measurements|dynamic|
|details|dynamic|Details|dynamic|
|handledAt|string|HandledAt|string|
|iKey|string|IKey|string|
|innermostAssembly|string|InnermostAssembly|string|
|innermostMessage|string|InnermostMessage|string|
|innermostMethod|string|InnermostMethod|string|
|innermostType|string|InnermostType|string|
|itemCount|int|ItemCount|int|
|itemId|string|\_ItemId|string|
|itemType|string|Type|string|
|message|string|Message|string|
|method|string|Method|string|
|operation_Id|string|OperationId|string|
|operation_Name|string|OperationName|string|
|operation_ParentId|string|ParentId|string|
|operation_SyntheticSource|string|OperationSyntheticSource|string|
|outerAssembly|string|OuterAssembly|string|
|outerMessage|string|OuterMessage|string|
|outerMethod|string|OuterMethod|string|
|outerType|string|OuterType|string|
|problemId|string|ProblemId|string|
|sdkVersion|string|SDKVersion|string|
|session_Id|string|SessionId|string|
|severityLevel|int|SeverityLevel|int|
|timestamp|datetime|TimeGenerated|datetime|
|type|string|ExceptionType|string|
|user_AccountId|string|UserAccountId|string|
|user_AuthenticatedId|string|UserAuthenticatedId|string|
|user_Id|string|UserId|string|

#### AppTraces

Legacy table: traces

|ApplicationInsights|Type|LogAnalytics|Type|
|:---|:---|:---|:---|
|appId|string|ResourceGUID|string|
|application_Version|string|AppVersion|string|
|appName|string|\_ResourceId|string|
|client_Browser|string|ClientBrowser|string|
|client_City|string|ClientCity|string|
|client_CountryOrRegion|string|ClientCountryOrRegion|string|
|client_IP|string|ClientIP|string|
|client_Model|string|ClientModel|string|
|client_OS|string|ClientOS|string|
|client_StateOrProvince|string|ClientStateOrProvince|string|
|client_Type|string|ClientType|string|
|cloud_RoleInstance|string|AppRoleInstance|string|
|cloud_RoleName|string|AppRoleName|string|
|customDimensions|dynamic|Properties|dynamic|
|customMeasurements|dynamic|Measurements|dynamic|
|iKey|string|IKey|string|
|itemCount|int|ItemCount|int|
|itemId|string|\_ItemId|string|
|itemType|string|Type|string|
|message|string|Message|string|
|operation_Id|string|OperationId|string|
|operation_Name|string|OperationName|string|
|operation_ParentId|string|ParentId|string|
|operation_SyntheticSource|string|OperationSyntheticSource|string|
|sdkVersion|string|SDKVersion|string|
|session_Id|string|SessionId|string|
|severityLevel|int|SeverityLevel|int|
|timestamp|datetime|TimeGenerated|datetime|
|user_AccountId|string|UserAccountId|string|
|user_AuthenticatedId|string|UserAuthenticatedId|string|
|user_Id|string|UserId|string|

## Next steps

* [Explore metrics](../essentials/metrics-charts.md)
* [Write Log Analytics queries](../logs/log-query-overview.md)
