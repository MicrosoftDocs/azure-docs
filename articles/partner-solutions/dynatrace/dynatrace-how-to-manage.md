---
title: Manage your Dynatrace for Azure integration - Azure partner solutions
description: This article describes how to manage Dynatrace on the Azure portal. 
author: flang-msft

ms.topic: conceptual
ms.author: franlanglois
ms.date: 10/12/2022

---

# Manage the Dynatrace integration with Azure

This article describes how to manage the settings for Dynatrace for Azure.

## Resource overview

To see the details of your Dynatrace resource, select **Overview** in the left pane.

:::image type="content" source="media/dynatrace-how-to-manage/dynatrace-overview.png" alt-text="Screenshot of overview in the resource menu.":::

The details include:

- Resource group name
- Region
- Subscription
- Tags
- Single sign-on link to Dynatrace environment
- Dynatrace billing plan
- Billing term

At the bottom, you see two tabs:

- **Get started tab** also provides links to Dynatrace dashboards, logs and Smartscape Topology.
- **Monitoring tab** provides a summary of the resources sending logs to Dynatrace.

If you select the **Monitoring** pane, you see a table with information about the Azure resources sending logs to Dynatrace.

:::image type="content" source="media/dynatrace-how-to-manage/dynatrace-monitoring.png" alt-text="Screenshot of overview working pane showing monitoring.":::

The columns in the table denote important information for your resource:

- **Resource type** - Azure resource type.
- **Total resources** - Count of all resources for the resource type.
- **Logs to Dynatrace** - Count of resources sending logs to Dynatrace through the integration.

## Reconfigure rules for logs

To change the configuration rules for logs, select **Metrics and logs** in the Resource menu on the left.

:::image type="content" source="media/dynatrace-how-to-manage/dynatrace-metrics-and-logs.png" alt-text="Screenshot showing options for metrics and logs.":::

For more information, see [Configure metrics and logs](dynatrace-create.md#configure-metrics-and-logs).

## View monitored resources

To see the list of resources emitting logs to Dynatrace, select Monitored Resources in the left pane.

:::image type="content" source="media/dynatrace-how-to-manage/dynatrace-monitored-resources.png" alt-text="Screenshot showing monitored resources in the working pane.":::

You can filter the list of resources by resource type, resource group name, region and whether the resource is sending logs.

The column **Logs to Dynatrace** indicates whether the resource is sending logs to Dynatrace. If the resource isn't sending logs, this field indicates why logs aren't being sent. The reasons could be:

- _Resource doesn't support sending logs_ - Only resource types with monitoring log categories can be configured to send logs. See [supported categories](/azure-monitor/essentials/resource-logs-categories.md).
- _Limit of five diagnostic settings reached_ - Each Azure resource can have a maximum of five diagnostic settings. For more information, see [diagnostic settings](/azure-monitor/essentials/diagnostic-settings.md).
- _Error_ - The resource is configured to send logs to Dynatrace, but is blocked by an error.
- _Logs not configured_ - Only Azure resources that have the appropriate resource tags are configured to send logs to Dynatrace.
- _Agent not configured_ - Virtual machines without the Dynatrace OneAgent installed don't emit logs to Dynatrace.

## Monitor virtual machines using Dynatrace OneAgent

You can install Dynatrace OneAgent on virtual machines as an extension. Select **Virtual Machines** under **Dynatrace environment config** in the Resource menu. In the working pane, you see a list of all virtual machines in the subscription.

For each virtual machine, the following info is displayed:

| Column header    | Definition of column   |
|------------|------------|
| **Resource Name** | Virtual machine name |
| **Resource Status** | Indicates whether the virtual machine is stopped or running. Dynatrace OneAgent can only be installed on virtual machines that are running. If the virtual machine is stopped, installing the Dynatrace OneAgent will be disabled. |
| **OneAgent status** | Whether the Dynatrace OneAgent is running on the virtual machine |
| **OneAgent version** | The Dynatrace OneAgent version number |
| **Auto-update** | Whether auto-update has been enabled for the OneAgent |
| **Log monitoring** | Whether log monitoring option was selected when OneAgent was installed |
| **Monitoring mode** | Whether the Dynatrace OneAgent is monitoring hosts in [full-stack monitoring mode or infrastructure monitoring mode](https://www.dynatrace.com/support/help/how-to-use-dynatrace/hosts/basic-concepts/get-started-with-infrastructure-monitoring) |

> [!NOTE]
> If a virtual machine shows that an OneAgent is installed, but the option Uninstall extension is disabled, then the agent was configured through a different Dynatrace resource in the same Azure subscription. To make any changes, please go to the other Dynatrace resource in the Azure subscription.

## Monitor App Services using Dynatrace OneAgent

You can install Dynatrace OneAgent on App Services as an extension. Select **App Services** in the Resource menu. In the working pane, you see This screen a list of all App Services in the subscription.

For each app service, the following information is displayed:

| Column header    | Definition of column   |
|------------|------------|
| **Resource name** | App service name |
| **Resource status** | Indicates whether the App service is running or stopped. Dynatrace OneAgent can only be installed on app services that are running. |
| **App Service plan** | The plan configured for the app service |
| **OneAgent version** | The Dynatrace OneAgent version |
| **OneAgent status** | status of the agent |

To install the Dynatrace OneAgent, select the app service and select **Install Extension.** The application settings for the selected app service are updated and the app service is restarted to complete the configuration of the Dynatrace OneAgent.

> [!NOTE]
>App Service extensions are currently supported only for App Services that are running on Windows OS. App Services using the Linux OS are not shown in the list.

> [!NOTE]
> This screen currently only shows App Services of type Web App. Managing agents for Function apps is not supported at this time.

## Reconfigure single sign-on

If you would like to reconfigure single sign-on, select **Single sign-on** in the left pane.

If single sign-on was already configured, you can disable it.

To establish single sign-on or change the application, select **Enable single sign-on through Azure Active Directory**. The portal retrieves  Dynatrace application from Azure Active Directory. The app comes from the enterprise app name selected during the [pre-configuration steps](dynatrace-how-to-configure-prereqs.md).

## Delete Dynatrace resource

Select **Overview** in Resource menu. Then, select **Delete**. Confirm that you want to delete the Dynatrace resource. Select **Delete**.

:::image type="content" source="media/dynatrace-how-to-manage/dynatrace-delete.png" alt-text="Screenshot showing overview in resource menu with a box around delete.":::

If only one Dynatrace resource is mapped to a Dynatrace environment, logs are no longer sent to Dynatrace. All billing through Azure Marketplace stops for Dynatrace.

If more than one Dynatrace resource is mapped to the Dynatrace environment using the link Azure subscription option, deleting the Dynatrace resource only stops sending logs for Azure resources associated to that Dynatrace resource. However, since this one Dynatrace environment might still be linked to other Dynatrace resources, billing continues through the Azure Marketplace.

## Next steps

For help with troubleshooting, see [Troubleshooting Dynatrace integration with Azure](dynatrace-troubleshoot.md).
