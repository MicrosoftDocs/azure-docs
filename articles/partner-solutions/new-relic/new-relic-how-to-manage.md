---
title: Manage Azure Native New Relic Service
description: Learn how to manage your Azure Native New Relic Service settings.
ms.topic: how-to

ms.date: 04/04/2023

---

# Manage Azure Native New Relic Service

This article describes how to manage the settings for Azure Native New Relic Service.

## Resource overview

To see the details of your New Relic resource, select **Overview** on the left pane.

:::image type="content" source="media/new-relic-how-to-manage/new-relic-overview.png" alt-text="Screenshot that shows an overview for a New Relic resource.":::

The details include:

- Resource group
- Region
- Subscription
- Tags
- New Relic account
- New Relic organization
- Status
- Pricing plan
- Billing term

At the bottom:

- The **Get started** tab provides deep links to New Relic dashboards, logs, and alerts.
- The **Monitoring** tab provides a summary of the resources that send logs and metrics to New Relic.

If you select **Monitored resources**, the pane that opens includes a table with information about the Azure resources that are sending logs and metrics to New Relic.

:::image type="content" source="media/new-relic-how-to-manage/new-relic-monitored-resources.png" alt-text="Screenshot showing a table of monitored resources below properties.":::

The columns in the table denote valuable information for your resource:

|Property  | Description  |
|---------|---------|
| **Resource type**      |   Azure resource type      |
| **Total resources**      | Count of all resources for the resource type      |
| **Logs to New Relic**        |    Count of logs for the resource type       |
| **Metrics to New Relic**         |   Count of resources that are sending metrics to New Relic through the integration      |

If New Relic currently manages billing and you want to change to Azure Marketplace billing to consume your Azure commitment, you should work with New Relic to align on timeline as per the current contract tenure. Then, switch your billing using the **Bill via Marketplace**  from the working pane of the Overview page or your New Relic resource.

:::image type="content" source="media/new-relic-how-to-manage/new-relic-bill-marketplace.png" alt-text="Screenshot with 'Bill via Azure Marketplace' selection highlighted.":::

## Reconfigure rules for logs or metrics

To change the configuration rules for logs or metrics, select **Metrics and Logs** in the Resource menu.

:::image type="content" source="media/new-relic-how-to-manage/new-relic-metrics.png" alt-text="Screenshot that shows metrics and logs for a New Relic resource.":::

For more information, see [Configure metrics and logs](new-relic-how-to-configure-prereqs.md).

## View monitored resources

To see the list of resources that are sending metrics and logs to New Relic, select **Monitored resources** on the left pane.

:::image type="content" source="media/new-relic-how-to-manage/new-relic-monitoring.png" alt-text="Screenshot that shows monitored resources for a New Relic resource.":::

You can filter the list of resources by resource type, resource group name, region, and whether the resource is sending metrics and logs.

The column **Logs to New Relic** indicates whether the resource is sending logs to New Relic. If the resource isn't sending logs, the reasons could be:

- **Resource does not support sending logs**: Only resource types with monitoring log categories can be configured to send logs. See [Supported categories](../../azure-monitor/essentials/resource-logs-categories.md).
- **Limit of five diagnostic settings reached**: Each Azure resource can have a maximum of five diagnostic settings. For more information, see [Diagnostic settings](/cli/azure/monitor/diagnostic-settings).
- **Error**: The resource is configured to send logs to New Relic but an error blocked it.
- **Logs not configured**: Only Azure resources that have the appropriate resource tags are configured to send logs to New Relic.
- **Agent not configured**: Virtual machines or app services without the New Relic agent installed don't send logs to New Relic.

The column **Metrics to New Relic** indicates whether New Relic is receiving metrics that correspond to this resource.

## Monitor virtual machines by using the New Relic agent

You can install the New Relic agent on virtual machines as an extension. Select **Virtual Machines** on the left pane. The **Virtual machine agent** pane shows a list of all virtual machines in the subscription.

:::image type="content" source="media/new-relic-how-to-manage/new-relic-virtual-machines.png" alt-text="Screenshot that shows virtual machines for a New Relic resource.":::

For each virtual machine, the following info appears:

  |  Property | Description |
  |--|--|
  | **Virtual machine name** | Name of the virtual machine. |
  | **Resource status**  | Indicates whether the virtual machine is stopped or running. The New Relic agent can be installed only on virtual machines that are running. If the virtual machine is stopped, installing the New Relic agent is disabled. |
  | **Agent status**  | Indicates whether the New Relic agent is running on the virtual machine. |
  | **Agent version**    | Version number of the New Relic agent. |

> [!NOTE]
> If a virtual machine shows that an agent is installed, but the option **Uninstall extension** is disabled, the agent was configured through a different New Relic resource in the same Azure subscription. To make any changes, go to the other New Relic resource in the Azure subscription.

## Monitor app services by using the New Relic agent

You can install the New Relic agent on app services as an extension. Select **App Services** on the left pane. The working pane shows a list of all app services in the subscription.

:::image type="content" source="media/new-relic-how-to-manage/new-relic-app-services.png" alt-text="Screenshot that shows app services for a New Relic resource.":::

For each app service, the following information appears:

 |Property |         Description |
 |--|----|
 | **Resource name**         | App service name.|
 | **Resource status**       | Indicates whether the App service is running or stopped. The New Relic agent can be installed only on app services that are running.|
 | **App Service plan**      | The plan that's configured for the app service.|
 | **Agent status**          | Status of the agent. |
  
To install the New Relic agent, select the app service and then select **Install Extension**. The application settings for the selected app service are updated, and the app service is restarted to complete the configuration of the New Relic agent.

> [!NOTE]
> App Service extensions are currently supported only for app services that are running on Windows operating systems. The list doesn't show app services that use Linux operating systems.

> [!NOTE]
> This page currently shows only the web app type of app services. Managing agents for function apps is not supported at this time.

## Delete a New Relic resource

1. Select **Overview** on the left pane. Then, select **Delete**.

   :::image type="content" source="media/new-relic-how-to-manage/new-relic-delete.png" alt-text="Screenshot of the delete button on a resource overview.":::

1. Confirm that you want to delete the New Relic resource. Select **Delete**.

If only one New Relic resource is mapped to a New Relic account, logs and metrics are no longer sent to New Relic.

For a New Relic organization where billing is managed through Azure Marketplace, deleting the last associated New Relic resource also removes the corresponding Azure Marketplace billing relationship.

If you map more than one New Relic resource to the New Relic account by using the link option, deleting the New Relic resource only stops sending logs for Azure resources associated with that New Relic resource. Because other Azure Native New Relic Service resources are linked with this New Relic account, billing continues through Azure Marketplace.

## Next steps

- [Troubleshoot Azure Native New Relic Service](new-relic-troubleshoot.md)
- [Quickstart: Get started with New Relic](new-relic-create.md)
- Get started with Azure Native New Relic Service on

    > [!div class="nextstepaction"]
    > [Azure portal](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/NewRelic.Observability%2Fmonitors)

    > [!div class="nextstepaction"]
    > [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/newrelicinc1635200720692.newrelic_liftr_payg?tab=Overview)
