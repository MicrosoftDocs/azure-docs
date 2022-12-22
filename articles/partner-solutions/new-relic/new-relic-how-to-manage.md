---
title: Manage your Azure Native New Relic Service 
description: Learn how to manage your Azure Native New Relic Service
ms.topic: how-to

ms.date: 12/31/2022

---

# Manage the Azure Native New Relic Service

This article describes how to manage the settings for Azure Native New Relic Service.

## Resource overview

To see the details of your New Relic resource, select Overview in the left pane.

:::image type="content" source="media/new-relic-how-to-manage/new-relic-overview.png" alt-text="Screenshot showing overview for New Relic resource in resource menu.":::

The details include:

- **Resource Group**
- **Region**
- **Subscription**
- **Tags**
- **New Relic account**
- **New Relic organization**
- **Status**
- **Pricing plan**
- **Billing term**

At the bottom, you see:

- **Get started** tab provides deep links to New Relic dashboards, logs, and Alerts.
- **Monitoring** tab provides a summary of the resources sending logs and metrics to New Relic.

If you select the Monitoring pane, you see a table with information about the Azure resources sending logs and metrics to New Relic.

:::image type="content" source="media/new-relic-how-to-manage/new-relic-monitored-resources.png" alt-text="Screenshot showing a table of monitored resources below properties.":::

The columns in the table denote valuable information for your resource:

|Property  | Description  |
|---------|---------|
|   Resource type      |   Azure resource type      |
|   Total resources      | Count of all resources for the resource type      |
| Logs to New Relic        |    Count of all resources for the resource type       |
| Metrics to New Relic         |   Count of resources sending metrics to New Relic through the integration      |

## Reconfigure rules for logs or metrics

To change the configuration rules for logs or metrics, select **Metrics and logs** in the Resource menu on the left.

:::image type="content" source="media/new-relic-how-to-manage/new-relic-metrics.png" alt-text="Screenshot showing metrics and logs for New Relic resource selected in the Resource menu.":::

For more information, see Configure metrics and logs.

## View monitored resources

To see the list of resources emitting logs and metrics to New Relic, select Monitored Resources in the left pane.

:::image type="content" source="media/new-relic-how-to-manage/new-relic-monitored-resources.png" alt-text="Screenshot showing monitored resources for New Relic resource selected in the Resource menu.":::

You can filter the list of resources by resource type, resource group name, region and whether the resource is sending logs and metrics.

The column **Logs to New Relic** indicates whether the resource is sending logs to New Relic. If the resource is not sending logs, the reasons could be:

- Resource does not support sending logs - Only resource types with monitoring log categories can be configured to send logs. See [supported categories](/azure/azure-monitor/essentials/resource-logs-categories).
- Limit of five diagnostic settings reached - Each Azure resource can have a maximum of five diagnostic settings. For more information, see [diagnostic settings](/cli/azure/monitor/diagnostic-settings).
- Error - The resource is configured to send logs to New Relic but is blocked by an error.
- Logs not configured - Only Azure resources that have the appropriate resource tags are configured to send logs to New Relic.
- Agent not configured - Virtual machines without the New Relic Agent installed do not emit logs to New Relic.

The column 'Metrics to New Relic' indicates whether New Relic is receiving metrics corresponding to this resource.

## Monitor virtual machines using New Relic Agent

You can install New Relic Agent on virtual machines as an extension. Select Virtual Machines under New Relic account config in the Resource menu. In the working pane, you see a list of all virtual machines in the subscription.

:::image type="content" source="media/new-relic-how-to-manage/new-relic-virtual-machines.png" alt-text="Screenshot showing virtual machines for New Relic resource selected in the resource menu.":::


For each virtual machine, the following info is displayed:

  |  Property | Description |
  |--|--|
  | **Resource Name** | Virtual machine name. |
  | **Resource  Status**  | Indicates whether the virtual machine is stopped or running. New Relic Agent can only be installed on virtual machines that are running. If the virtual machine is stopped, installing the New Relic Agent will be disabled. |
  | **Agent status**  | Whether the New Relic Agent is running on the virtual machine |
  | **Agent version**    | The New Relic Agent version number. |

> [!NOTE]
> If a virtual machine shows that an Agent is installed, but the option Uninstall extension is disabled, then the agent was configured through a different New Relic resource in the same Azure subscription.
> To make any changes, please go to the other New Relic resource in the Azure subscription.

You can install New Relic Agent on App Services as an extension. Select **App Services** in the Resource menu. In the working pane, you see a list of all App Services in the subscription.

## Monitor App Services using New Relic Agent

:::image type="content" source="media/new-relic-how-to-manage/new-relic-app-services.png" alt-text="Screenshot showing app services for New Relic resource selected in the Resource menu.":::

For each app service, the following information is displayed:

 |Property |         Description |
 |--|----|
 | Resource name                  |     App service name|
 | Resource status                    | Indicates whether the App service is running or stopped. New Relic Agent can only be installed on app services that are running.|
 | App Service plan                   | The plan configured for the app service|
 | Agent status                      |  Status of the agent|
  
To install the New Relic Agent, select the app service and select Install Extension. The application settings for the selected app service are updated and the app service is restarted to complete the configuration of the New Relic Agent.

> [!NOTE]
> App Service extensions are currently supported only for App Services that are running on Windows OS (operating systems). App Services using the Linux OS are not shown in the list.

> [!NOTE]
> This screen currently only shows App Services of type Web App. Managing agents for Function apps is not supported at this time.

## Delete New Relic resource

Select Overview in Resource menu. Then, select Delete. Confirm that you want to delete the New Relic resource. Select Delete.

:::image type="content" source="media/new-relic-how-to-manage/new-relic-delete.png" alt-text="Screenshot of overview with a red box around delete.":::

If only one New Relic resource is mapped to a New Relic account, logs are no longer sent to New Relic. All billing through Azure Marketplace stops for New Relic in case your billing was managed by Azure Marketplace.

If more than one New Relic resource is mapped to the New Relic account using the link option, deleting the New Relic resource only stops sending logs for Azure resources associated to that New Relic resource. However, since there are other Azure Native New Relic Service resources linked with this New Relic account, billing continues through the Azure Marketplace.

## Next steps

- [Troubleshoot Azure Native New Relic Service](new-relic-troubleshoot.md)
- [QuickStart: Get started with New Relic](new-relic-create.md)
