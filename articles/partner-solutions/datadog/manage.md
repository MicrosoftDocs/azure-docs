---
title: Manage a Datadog resource - Azure partner solutions
description: This article describes management of a Datadog resource in the Azure portal. How to set up single sign-on, delete a Confluent organization, and get support.
ms.service: partner-services
ms.topic: conceptual
ms.date: 02/16/2021
author: tfitzmac
ms.author: tomfitz
---

# Manage the Datadog resource

## Resource Overview

The Datadog resource overview screen shows details of the resource.

:::image type="content" source="media/manage/resourceoverview.png" alt-text="Datadog resource overview" border="true":::

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

:::image type="content" source="media/manage/reconfiguremetricsandlogs.png" alt-text="Modify the configuration of logs and metrics for the Datadog resource." border="true":::

For information about how you configure the rules, see [Configure metrics and logs](create.md#configure-metrics-and-logs).

## View monitored resources

To see the list of resources emitting logs to Datadog, select **Monitored Resources** in the left pane.

:::image type="content" source="media/manage/viewmonitoredresources.png" alt-text="View resources monitored by Datadog" border="true":::

You can filter the list of resources by resource type, resource group name, location, and whether the resource is sending logs and metrics.

The column **Logs to Datadog** indicates whether the resource is sending logs to Datadog. If the resource is not sending logs, this field indicates why logs aren't being sent to Datadog. The reasons could be:

- Resource does not support sending logs. Only resources types with monitoring log categories can be configured to send logs to Datadog.
- Limit of 5 diagnostic settings reached. Each Azure resource can have a maximum of 5 diagnostic settings. For more information, see [diagnostic settings](../../azure-monitor/platform/diagnostic-settings.md).
- Error. The resource is configured to send logs to Datadog, but is blocked by an error.
- Logs not configured. Only Azure resources that have the appropriate resource tags are configured to send logs to Datadog.
- Region not supported. The Azure resource is in a region that doesn't currently support sending logs to Datadog.
- Datadog agent not configured. Virtual machines without the Datadog agent installed don't emit logs to Datadog.

## API Keys

To View the list of API keys setup when your new Datadog resource was created , select the **Keys** menu item. You see the key name, last 6 digits of the key, created by, and timestamp details. 

 
:::image type="content" source="media/datadog-marketplace-integration/keys.png" alt-text="API keys for the Datadog organization." border="true":::

Azure portal provides a view only screen of the API keys. Select the Datadog portal link to manage the API keys for your Datadog organization. Once the changes have been made in Datadog portal, select Refresh icon, to get the latest set of API keys from Datadog to Azure portal.

The Azure Datadog integration provides you the ability to install Datadog agent on a Virtual Machine/App Service. For configuring the Datadog agent the API key selected as **Default Key** in the Keys screen. If a default key is not selected, the Datadog agent installation will fail in error. 

## Monitor Virtual machines using the Datadog agent

You can install Datadog agents on Virtual machines as an extension, by navigating to **Virtual machine agent** menu item under the Datadog org configurations left navigation. This screen shows the list of all Virtual machines in the subscription.

For each virtual machine, the following data elements are displayed:

- Resource Name – Virtual machine name
- Resource Status – Indicates whether the Virtual machine is stopped or running. The Datadog agent can only be installed on virtual machines which are Running. If the virtual machine is stopped, the Datadog agent install will be disabled.
- Agent version – Indicates the Datadog agent version number
- Agent status – Indicates whether the Datadog agent is running on the virtual machine. 
- Integrations enabled – Indicates the key metrics are being collected by the Datadog agent
- Install Method – Indicates the specific tool (for example, Chef, Script etc) used to install the Datadog agent 
- Sending logs – Indicates whether the Datadog agent is sending logs to Datadog

Select the Virtual machine to install the Datadog agent on and then select **Install Agent**.  Azure asks for confirmation that you want to install the agent with the default key selected in the Keys screen. Select **OK** to begin the installation process. Azure shows the status as **Installing** until the agent is installed and provisioned. 

Once the Datadog agent is installed, the status changes to Installed.
 
:::image type="content" source="media/datadog-marketplace-integration/vmagent.png" alt-text="Install or uninstall Datadog agents as Virtual machine extensions." border="true":::

You can select the virtual machine and navigate to the Extensions screen to see the Datadog agent which has been installed and provisioned. 
You can un-install Datadog agents on Virtual machine, by navigating to **Virtual machine agent** under the Datadog org configurations left navigation, selecting the specific virtual machine and Selecting on **Uninstall agent**

## Monitor App Services using the Datadog agent as an extension

You can install Datadog agents on App Services as an extension, by navigating to **App Service extension** menu item under the Datadog org configurations left navigation. This screen shows the list of all app services in the subscription.

For each app service, the following data elements are displayed:
- Resource Name – Virtual machine name
- Resource Status – Indicates whether the app service is stopped or running. The Datadog agent can only be installed on app services which are Running. If the app service is stopped, the Datadog agent install will be disabled.
- App service plan – Indicates the specific plan configured for the app service
- Agent version – Indicates the Datadog agent version number

You can select the app service to install the Datadog agent on and then Select **Install Extension**.  The latest Datadog agent is installed on the app service as an extension.

Once you Select **Install Extension**, Azure will seek a confirmation that you would like to install the Datadog agent. Also, the application settings for the specific app service will be updated with the default key selected in the API Keys screen. The app service will be restarted once the install of the Datadog agent is complete. 

Select **OK** to begin the installation process for the Datadog agent. Azure will show the status as **Installing** until the agent is installed and provisioned. 

Once the Datadog agent is installed, the status will change to Installed.


:::image type="content" source="media/datadog-marketplace-integration/appserviceextension.png" alt-text="Install or uninstall Datadog agents as app service extensions." border="true":::


You can select the App Service and navigate to the Extensions screen to see the Datadog agent which has been installed and provisioned.

You can un-install Datadog agents on the App Service, by navigating to **App Service Extension** under the Datadog org configurations left navigation, selecting the specific App Service and selecting on **Uninstall Extension**

## Re-configure single sign-on

If you would like to re-configure single sign-on, select **Single sign-on** in the left pane.

To establish single sign-on through Azure Active directory, select **Enable single sign-on through Azure Active Directory**.

The portal retrieves the appropriate Datadog application from Azure Active Directory. The app comes from the enterprise app name you selected when setting up integration. Select the Datadog app name as shown below:
 
:::image type="content" source="media/manage/reconfiguresinglesignon.png" alt-text="Reconfigure single sign-on application." border="true":::
 
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

## Getting support

To contact support about the Azure Datadog integration, select **New Support request** in the left pane. Select the link to the Datadog portal.

:::image type="content" source="media/manage/supportrequest.png" alt-text="Create a new Datadog support request" border="true":::

## Next steps

For help with troubleshooting, see [Troubleshooting Datadog solutions](troubleshoot.md).
