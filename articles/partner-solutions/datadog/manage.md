---
title: Manage a Datadog resource - Azure partner solutions
description: This article describes management of a Datadog resource in the Azure portal. How to set up single sign-on, delete a Confluent organization, and get support.
ms.topic: conceptual
ms.date: 05/28/2021
author: flang-msft
ms.author: franlanglois
---

# Manage the Datadog resource

This article shows how to manage the settings for your Azure integration with Datadog.

## Resource overview

To see details of your Datadog resource, select **Overview** in the left pane.

:::image type="content" source="media/manage/resource-overview.png" alt-text="Datadog resource overview" border="true" lightbox="media/manage/resource-overview.png":::

The details include:

- Resource group name
- Location/Region
- Subscription
- Tags
- Single sign-on link to Datadog organization
- Datadog offer/plan
- Billing term

It also provides links to Datadog dashboards, logs, and host maps.

The overview screen provides a summary of the resources sending logs and metrics to Datadog.

- Resource type – Azure resource type.
- Total resources – Count of all resources for the resource type.
- Resources sending logs – Count of resources sending logs to Datadog through the integration.
- Resources sending metrics – Count of resources sending metrics to Datadog through the integration.

## Reconfigure rules for metrics and logs

To change the configuration rules for metrics and logs, select **Metrics and Logs** in the left pane.

:::image type="content" source="media/manage/reconfigure-metrics-and-logs.png" alt-text="Modify the configuration of logs and metrics for the Datadog resource." border="true":::

For more information, see [Configure metrics and logs](create.md#configure-metrics-and-logs).

## View monitored resources

To see the list of resources emitting logs to Datadog, select **Monitored Resources** in the left pane.

:::image type="content" source="media/manage/view-monitored-resources.png" alt-text="View resources monitored by Datadog" border="true":::

You can filter the list of resources by resource type, resource group name, location, and whether the resource is sending logs and metrics.

The column **Logs to Datadog** indicates whether the resource is sending logs to Datadog. If the resource isn't sending logs, this field indicates why logs aren't being sent to Datadog. The reasons could be:

- Resource doesn't support sending logs. Only resources types with monitoring log categories can be configured to send logs to Datadog.
- Limit of five diagnostic settings reached. Each Azure resource can have a maximum of five diagnostic settings. For more information, see [diagnostic settings](../../azure-monitor/essentials/diagnostic-settings.md).
- Error. The resource is configured to send logs to Datadog, but is blocked by an error.
- Logs not configured. Only Azure resources that have the appropriate resource tags are configured to send logs to Datadog.
- Region not supported. The Azure resource is in a region that doesn't currently support sending logs to Datadog.
- Datadog agent not configured. Virtual machines without the Datadog agent installed don't emit logs to Datadog.

## API Keys

To view the list of API keys for your Datadog resource, select the **Keys** in the left pane. You see information about the keys.

:::image type="content" source="media/manage/keys.png" alt-text="API keys for the Datadog organization." border="true":::

The Azure portal provides a read-only view of the API keys. To manage the keys, select the Datadog portal link. After making changes in the Datadog portal, refresh the Azure portal view.

The Azure Datadog integration provides you the ability to install Datadog agent on a virtual machine or app service. If a default key isn't selected, the Datadog agent installation fails.

## Monitor virtual machines using the Datadog agent

You can install Datadog agents on virtual machines as an extension. Go to **Virtual machine agent** under the Datadog org configurations in the left pane. This screen shows the list of all virtual machines in the subscription.

For each virtual machine, the following data is displayed:

- Resource Name – Virtual machine name
- Resource Status – Whether the virtual machine is stopped or running. The Datadog agent can only be installed on virtual machines that are running. If the virtual machine is stopped, installing the Datadog agent will be disabled.
- Agent version – The Datadog agent version number.
- Agent status – Whether the Datadog agent is running on the virtual machine.
- Integrations enabled – The key metrics that are being collected by the Datadog agent.
- Install Method – The specific tool used to install the Datadog agent. For example, Chef or Script.
- Sending logs – Whether the Datadog agent is sending logs to Datadog.

Select the virtual machine to install the Datadog agent on. Select **Install Agent**.

The portal asks for confirmation that you want to install the agent with the default key. Select **OK** to begin installation. Azure shows the status as **Installing** until the agent is installed and provisioned.

After the Datadog agent is installed, the status changes to Installed.

To see that the Datadog agent has been installed, select the virtual machine and navigate to the Extensions window.

You can uninstall Datadog agents on a virtual machine by going to **Virtual machine agent**. Select the virtual machine and **Uninstall agent**.

## Monitor App Services using the Datadog agent as an extension

You can install Datadog agents on app services as an extension. Go to **App Service extension** in left pane. This screen shows the list of all app services in the subscription.

For each app service, the following data elements are displayed:

- Resource Name – Virtual machine name.
- Resource Status – Whether the app service is stopped or running. The Datadog agent can only be installed on app services that are running. If the app service is stopped, installing the Datadog agent is disabled.
- App service plan – The specific plan configured for the app service.
- Agent version – The Datadog agent version number.

To install the Datadog agent, select the app service and **Install Extension**. The latest Datadog agent is installed on the app service as an extension.

The portal confirms that you want to install the Datadog agent. Also, the application settings for the specific app service are updated with the default key. The app service is restarted after the install of the Datadog agent completes.

Select **OK** to begin the installation process for the Datadog agent. The portal shows the status as **Installing** until the agent is installed. After the Datadog agent is installed, the status changes to Installed.

To uninstall Datadog agents on the app service, go to **App Service Extension**. Select the app service and **Uninstall Extension**

## Reconfigure single sign-on

If you would like to reconfigure single sign-on, select **Single sign-on** in the left pane.

To establish single sign-on through Azure Active directory, select **Enable single sign-on through Azure Active Directory**.

The portal retrieves the appropriate Datadog application from Azure Active Directory. The app comes from the enterprise app name you selected when setting up integration. Select the Datadog app name as shown below:
 
:::image type="content" source="media/manage/reconfigure-single-sign-on.png" alt-text="Reconfigure single sign-on application." border="true":::
 
## Change Plan

To change the Datadog billing plan, go to **Overview** and select **Change Plan**.

:::image type="content" source="media/manage/datadog-select-change-plan.png" alt-text="Select change Datadog billing plan." border="true":::

The portal retrieves all the available Datadog plans for your tenant. Select the appropriate plan and click on **Change Plan**.

:::image type="content" source="media/manage/datadog-change-plan.png" alt-text="Select the Datadog billing plan to change." border="true":::
  
## Disable or enable integration

You can stop sending logs and metrics from Azure to Datadog. You'll continue to be billed for other Datadog services that aren't related to monitoring metrics and logs.

To disable the Azure integration with Datadog, go to **Overview**. Select **Disable** and **OK**.
 
:::image type="content" source="media/manage/disable.png" alt-text="Disable Datadog resource." border="true":::

To enable the Azure integration with Datadog, go to **Overview**. Select **Enable** and **OK**. Selecting **Enable** retrieves any previous configuration for metrics and logs. The configuration determines which Azure resources emit metrics and logs to Datadog. After completing the step, metrics and logs are sent to Datadog.
 
:::image type="content" source="media/manage/enable.png" alt-text="Enable Datadog resource." border="true":::

## Delete Datadog resource

Go to **Overview** in left pane and select **Delete**. Confirm that you want to delete Datadog resource. Select **Delete**.

:::image type="content" source="media/manage/delete.png" alt-text="Delete Datadog resource" border="true":::

If only one Datadog resource is mapped to a Datadog organization, logs and metrics are no longer sent to Datadog. All billing stops for Datadog through Azure Marketplace.

If more than one Datadog resource is mapped to the Datadog organization, deleting the Datadog resource only stops sending logs and metrics for that Datadog resource. Because the Datadog organization is linked to other Azure resources, billing continues through the Azure Marketplace.

## Next steps

For help with troubleshooting, see [Troubleshooting Datadog solutions](troubleshoot.md).
