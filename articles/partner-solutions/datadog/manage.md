---
title: Manage a Datadog resource
description: This article describes management of a Datadog resource in the Azure portal. How to set up single sign-on, delete a Confluent organization, and get support.
author: flang-msft

ms.author: franlanglois
ms.topic: conceptual
ms.date: 06/01/2023
---

# Manage a Datadog - An Azure Native ISV Service resource

This article shows how to manage the settings for your Datadog - An Azure Native ISV Service.

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

- Resource type - Azure resource type.
- Total resources  - Count of all resources for the resource type.
- Resources sending logs - Count of resources sending logs to Datadog through the integration.
- Resources sending metrics - Count of resources sending metrics to Datadog through the integration.

## Reconfigure rules for metrics and logs

To change the configuration rules for metrics and logs, select **Metrics and Logs** in the left pane.

:::image type="content" source="media/manage/reconfigure-metrics-and-logs.png" alt-text="Screenshot showing how to modify the configuration of logs and metrics for the Datadog resource." border="true":::

For more information, see [Configure metrics and logs](create.md#configure-metrics-and-logs).

## View monitored resources

To see the list of resources emitting logs to Datadog, select **Monitored Resources** in the Resource menu.

:::image type="content" source="media/manage/view-monitored-resources.png" alt-text="View resources monitored by Datadog" border="true":::

You can filter the list of resources by resource type, subscription, resource group name, location, and whether the resource is sending logs and metrics. Only the resource types supported by Azure Monitor are monitored. Check out the list of [resource types supported by Azure Monitor](/azure/azure-monitor/essentials/resource-logs-categories).

The column **Logs to Datadog** indicates whether the resource is sending logs to Datadog. If the resource isn't sending logs, this field indicates why logs aren't being sent to Datadog. The reasons could be:

- Resource doesn't support sending logs. Only resources types with monitoring log categories can be configured to send logs to Datadog.
- Limit of five diagnostic settings reached. Each Azure resource can have a maximum of five diagnostic settings. For more information, see [diagnostic settings](../../azure-monitor/essentials/diagnostic-settings.md).
- Error. The resource is configured to send logs to Datadog, but is blocked by an error.
- Logs not configured. Only Azure resources that have the appropriate resource tags are configured to send logs to Datadog.
- Region not supported. The Azure resource is in a region that doesn't currently support sending logs to Datadog.
- Datadog agent not configured. Virtual machines without the Datadog agent installed don't emit logs to Datadog.

## Monitor multiple subscriptions

While monitoring resources in a subscription is straightforward, observing multiple subscriptions, each with their own set of resources becomes tricky. Instead, you can monitor multiple subscriptions by linking them to a single Datadog resource that is tied to a Datadog organization. This provides a single pane of glass view for all resources across multiple subscriptions.

To manage multiple subscriptions that you want to monitor, select **Monitored Subscriptions** in the **Datadog organization configurations** section of the Resource menu.

:::image type="content" source="media/manage/datadog-monitored-subscriptions.png" alt-text="Screenshot showing Monitored Subscriptions selected in the Resource menu.":::

From **Monitored Subscriptions** in the Resource menu, select the **Add Subscriptions**. The **Add Subscriptions** experience that opens and shows the subscriptions you have _Owner_ role assigned to and any Datadog resource created in those subscriptions that is already linked to the same Datadog organization as the current resource.

If the subscription you want to monitor has a resource already linked to the same Datadog org, we recommended that you delete the Datadog resources to avoid shipping duplicate data, and incurring double the charges.

Select the subscriptions you want to monitor through the Datadog resource and select **Add**.

:::image type="content" source="media/manage/datadog-add-subscription.png" alt-text="Screenshot showing subscriptions to add.":::

If the list doesn’t get updated automatically, select **Refresh**  to view the subscriptions and their monitoring status. You might see an intermediate status of _In Progress_ while a subscription gets added. When the subscription is successfully added, you see the status is updated to **Active**. If a subscription fails to get added, **Monitoring Status** shows as **Failed**.

:::image type="content" source="media/manage/datadog-monitored-subscriptions-list.png" alt-text="Screenshot showing statuses of monitored subscriptions.":::

The set of tag rules for metrics and logs defined for the Datadog resource apply to all subscriptions that are added for monitoring. Setting separate tag rules for different subscriptions isn't supported. Diagnostics settings are automatically added to resources in the added subscriptions that match the tag rules defined for the Datadog resource. To reconfigure the rules, check [Reconfigure rules for metrics and logs](#reconfigure-rules-for-metrics-and-logs).

### Remove/unlink subscriptions from a Datadog resource

You can unlink subscriptions you don't want monitored through the Datadog resource by selecting **Monitored Subscriptions** from the Resource menu. Then, select any subscription you want to remove, and select **Remove subscriptions**. Select **Refresh** to view the updated list of subscriptions being monitored.

:::image type="content" source="media/manage/datadog-remove-subscriptions.png" alt-text="Screenshot showing subscriptions to remove.":::

## API keys

To view the list of API keys for your Datadog resource, select the **Keys** in the left pane. You see information about the keys.

:::image type="content" source="media/manage/keys.png" alt-text="API keys for the Datadog organization." border="true":::

The Azure portal provides a read-only view of the API keys. To manage the keys, select the Datadog portal link. After making changes in the Datadog portal, refresh the Azure portal view.

The Azure Datadog integration provides you with the ability to install Datadog agent on a virtual machine or app service. If a default key isn't selected, the Datadog agent installation fails.

## Monitor virtual machines using the Datadog agent

You can install Datadog agents on virtual machines as an extension. Go to **Virtual machine agent** under the **Datadog organization configurations** in the Resource menu. This screen shows all the virtual machines across all subscriptions where you have the “Owner” role assigned to. All subscriptions are selected by default. You can select a subset of subscriptions to narrow down the list of virtual machines shown in the subscription.

<!-- screenshot - pending Showing Virtual machine agent selected in the Resource menu and a list of virtual machines in the working pane. -->

For each virtual machine, the following data is displayed:

- Resource Name – Virtual machine name
- Resource Status – Whether the virtual machine is stopped or running. The Datadog agent can only be installed on virtual machines that are running. If the virtual machine is stopped, installing the Datadog agent is disabled.
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

You can install Datadog agents on app services as an extension. Go to **App Service extension** in left pane. This screen shows the list of all app services across all subscriptions you have “Owner” role assigned to. All subscriptions are selected by default. You can select a subset of subscriptions to narrow down the list of app services shown.

:::image type="content" source="media/manage/datadog-app-services.png" alt-text="Screenshot showing App Service extension selected in the Resource menu.":::

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

To establish single sign-on through Microsoft Entra ID, select **Enable single sign-on through Microsoft Entra ID**.

The portal retrieves the appropriate Datadog application from Microsoft Entra ID. The app comes from the enterprise app name you selected when setting up integration. Select the Datadog app name:

:::image type="content" source="media/manage/reconfigure-single-sign-on.png" alt-text="Reconfigure single sign-on application." border="true":::

## Change Plan

To change the Datadog billing plan, go to **Overview** and select **Change Plan**.

:::image type="content" source="media/manage/datadog-select-change-plan.png" alt-text="Select change Datadog billing plan." border="true":::

The portal retrieves all the available Datadog plans for your tenant. Select the appropriate plan and select on **Change Plan**.

:::image type="content" source="media/manage/datadog-change-plan.png" alt-text="Select the Datadog billing plan to change." border="true":::
  
## Disable or enable integration

You can stop sending logs and metrics from Azure to Datadog. You continue to be billed for other Datadog services that aren't related to monitoring metrics and logs.

To disable the Azure integration with Datadog, go to **Overview**. Select **Disable** and **OK**.

:::image type="content" source="media/manage/disable.png" alt-text="Disable Datadog resource." border="true":::

To enable the Azure integration with Datadog, go to **Overview**. Select **Enable** and **OK**. Selecting **Enable** retrieves any previous configuration for metrics and logs. The configuration determines which Azure resources emit metrics and logs to Datadog. After you complete this step, metrics and logs are sent to Datadog.

:::image type="content" source="media/manage/enable.png" alt-text="Enable Datadog resource." border="true":::

## Delete Datadog resource

Go to **Overview** in left pane and select **Delete**. Confirm that you want to delete Datadog resource. Select **Delete**.

:::image type="content" source="media/manage/delete.png" alt-text="Delete Datadog resource" border="true":::

If only one Datadog resource is mapped to a Datadog organization, logs and metrics are no longer sent to Datadog. All billing stops for Datadog through Azure Marketplace.

If more than one Datadog resource is mapped to the Datadog organization, deleting the Datadog resource only stops sending logs and metrics for that Datadog resource. Because the Datadog organization is linked to other Azure resources, billing continues through the Azure Marketplace.

## Next steps

- For help with troubleshooting, see [Troubleshooting Datadog solutions](troubleshoot.md).
- Get started with Datadog – An Azure Native ISV Service on

    > [!div class="nextstepaction"]
    > [Azure portal](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Datadog%2Fmonitors)

    > [!div class="nextstepaction"]
    > [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/datadog1591740804488.dd_liftr_v2?tab=Overview)
