---
title: Manage settings for your Datadog resource via Azure portal
description: Manage settings, view resources, reconfigure metrics/logs, and more for your Datadog resource via Azure portal.

ms.topic: conceptual
ms.date: 12/11/2024
ms.custom:
  - ai-gen-docs-bap
  - ai-gen-desc
  - ai-seo-date:12/03/2024
  - ai-gen-title
---

# Manage settings for your Datadog resource via Azure portal

<!--conceptual content isn't listed as an option for this service. Should this move to the partner's site?-->

This article shows how to manage the settings for Datadog.

## Resource overview

To see details of your Datadog resource, select **Overview** in the left pane.

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

|Term  |Description  |
|---------|---------|
|Resource type    |Azure resource type.         |
|Total resources    |Count of all resources for the resource type.         |
|Resources sending logs     |Count of resources sending logs in Datadog through the integration.         |
|Resources sending metrics    |Count of resources sending metrics to Datadog through the integration.         |

## Reconfigure rules for metrics and logs

To change the configuration rules for metrics and logs, select **Metrics and Logs** in the left pane.

<!--Review the information UI: To send Microsoft Entra ID logs to Datadog – enable Datadog as a destination in Microsoft Entra ID diagnostic settings.
Learn more-->

> [!NOTE]
> If there's a conflict between inclusion and exclusion rules, exclusion takes priority.

Metrics are collected for all resources, except virtual machines. You can filter Virtual Machine Scale Sets, and App Service plans by tags.

- Virtual machines, Virtual Machine Scale Sets, and App Service plan with _Include_ tags send metrics to Datadog.
- Virtual machines, Virtual Machine Scale Sets, and App Service plan with _Exclude_ tags don't send metrics to Datadog.

Logs for all defined sources are sent to Datadog based on the tags inclusion/exclusion criteria. By default, logs are collected for all resources.

- Azure resources with _Include_ tags send logs to Datadog. 
- Azure resources with _Exclude_ tags don't send logs to Datadog.

There are three types of logs that you can send from Azure to Datadog.

- **Subscription level logs** - Provide insight into the operations on your resources at the [control plane](../../azure-resource-manager/management/control-plane-and-data-plane.md). Updates on service health events are also included. Use the activity log to determine the what, who, and when for any write operations (PUT, POST, DELETE). There's a single activity log for each Azure subscription.

- **Azure resource logs** - Provide insight into operations that were taken on an Azure resource at the [data plane](../../azure-resource-manager/management/control-plane-and-data-plane.md). For example, getting a secret from a Key Vault is a data plane operation. Or, making a request to a database is also a data plane operation. The content of resource logs varies by the Azure service and resource type.

- **Microsoft Entra logs** - As an IT administrator, you want to monitor your IT environment. The information about your system's health enables you to assess potential issues and decide how to respond.

The Microsoft Entra admin center gives you access to three activity logs:

- [Sign-in](../../active-directory/reports-monitoring/concept-sign-ins.md) – Information about sign-ins and how your resources are used by your users.
- [Audit](../../active-directory/reports-monitoring/concept-audit-logs.md) – Information about changes applied to your tenant such as users and group management or updates applied to your tenant's resources.
- [Provisioning](../../active-directory/reports-monitoring/concept-provisioning-logs.md) – Activities performed by the provisioning service, such as the creation of a group in ServiceNow or a user imported from Workday.

To send subscription level logs to Datadog, select **Send subscription activity logs**. If this option is left unchecked, none of the subscription level logs are sent to Datadog.

To send Azure resource logs to Datadog, select **Send Azure resource logs for all defined resources**. The types of Azure resource logs are listed in [Azure Monitor Resource Log categories](/azure/azure-monitor/essentials/resource-logs-categories). To filter the set of Azure resources sending logs to Datadog, use Azure resource tags.

You can request your IT Administrator to route Microsoft Entra logs to Datadog. For more information, see [Microsoft Entra activity logs in Azure Monitor](../../active-directory/reports-monitoring/concept-activity-logs-azure-monitor.md).

Azure charges for the logs sent to Datadog. For more information, see the [pricing of platform logs](https://azure.microsoft.com/pricing/details/monitor/) sent to Azure Marketplace partners.

## View monitored resources

To see the list of resources emitting logs to Datadog, select **Monitored Resources** in the Resource menu.

You can filter the list of resources by resource type, subscription, resource group name, location, and whether the resource is sending logs and metrics. Only the resource types supported by Azure Monitor are monitored. Check out the list of [resource types supported by Azure Monitor](/azure/azure-monitor/essentials/resource-logs-categories).

The column **Logs to Datadog** indicates whether the resource is sending logs to Datadog. If the resource isn't sending logs, this field indicates why logs aren't being sent to Datadog. The reasons could be:

- Resource doesn't support sending logs. Only resources types with monitoring log categories can be configured to send logs to Datadog.
- Limit of five diagnostic settings reached. Each Azure resource can have a maximum of five diagnostic settings. For more information, see [diagnostic settings](/azure/azure-monitor/essentials/diagnostic-settings).
- Error. The resource is configured to send logs to Datadog, an error is blocking it.
- Logs not configured. Only Azure resources that have the appropriate resource tags are configured to send logs to Datadog.
- Region not supported. The Azure resource is in a region that doesn't currently support sending logs to Datadog.
- Datadog agent not configured. Virtual machines without the Datadog agent installed don't emit logs to Datadog.

## Monitor multiple subscriptions

While monitoring resources in a subscription is straightforward, observing multiple subscriptions, each with their own set of resources becomes tricky. Instead, you can monitor multiple subscriptions by linking them to a single Datadog resource tied to a Datadog organization, which provides a single pane of glass view for all resources across multiple subscriptions.

To manage multiple subscriptions that you want to monitor, select **Monitored Subscriptions** in the **Datadog organization configurations** section of the Resource menu.

From **Monitored Subscriptions** in the Resource menu, select the **Add Subscriptions**. The **Add Subscriptions** experience that opens and shows the subscriptions you have _Owner_ role assigned to and any Datadog resource created in those subscriptions that is already linked to the same Datadog organization as the current resource.

If the subscription you want to monitor has a resource already linked to the same Datadog org, delete the Datadog resources to avoid shipping duplicate data, and incurring double the charges.

Select the subscriptions you want to monitor through the Datadog resource and select **Add**.

If the list doesn’t get updated automatically, select **Refresh**  to view the subscriptions and their monitoring status. You might see an intermediate status of _In Progress_ while a subscription gets added. When the subscription is successfully added, you see the status is updated to **Active**. If a subscription fails to get added, **Monitoring Status** shows as **Failed**.

The set of tag rules for metrics and logs defined for the Datadog resource apply to all subscriptions that are added for monitoring. Setting separate tag rules for different subscriptions isn't supported. Diagnostics settings are automatically added to resources in the added subscriptions that match the tag rules defined for the Datadog resource. To reconfigure the rules, check [Reconfigure rules for metrics and logs](#reconfigure-rules-for-metrics-and-logs).

### Remove/unlink subscriptions from a Datadog resource

You can unlink subscriptions you don't want monitored through the Datadog resource by selecting **Monitored Subscriptions** from the Resource menu. Then, select any subscription you want to remove, and select **Remove subscriptions**. Select **Refresh** to view the updated list of subscriptions being monitored.

## API keys

To view the list of API keys for your Datadog resource, select the **Keys** in the left pane. You see information about the keys.

The Azure portal provides a read-only view of the API keys. To manage the keys, select the Datadog portal link. After making changes in the Datadog portal, refresh the Azure portal view.

The Azure Datadog integration provides you with the ability to install Datadog agent on a virtual machine or app service. If a default key isn't selected, the Datadog agent installation fails.

## Monitor virtual machines using the Datadog agent

You can install Datadog agents on virtual machines as an extension. Go to **Virtual machine agent** under the **Datadog organization configurations** in the Resource menu. This screen shows all the virtual machines across all subscriptions you have the *Owner* role assigned to. All subscriptions are selected by default. You can select a subset of subscriptions to narrow down the list of virtual machines shown in the subscription.

For each virtual machine, the following data is displayed:

- Resource Name – Virtual machine name
- Resource Status – Whether the virtual machine is stopped or running. The Datadog agent can only be installed on virtual machines that are running. If the virtual machine is stopped, installing the Datadog agent is disabled.
- Agent version – The Datadog agent version number.
- Agent status – Whether the Datadog agent is running on the virtual machine.
- Integrations enabled – The key metrics collected by the Datadog agent.
- Install Method – The specific tool used to install the Datadog agent. For example, Chef or Script.
- Sending logs – Whether the Datadog agent is sending logs to Datadog.

Select the virtual machine to install the Datadog agent on. Select **Install Agent**.

The portal asks for confirmation that you want to install the agent with the default key. Select **OK** to begin installation. Azure shows the status as **Installing** until the agent is installed and provisioned.

After the Datadog agent is installed, the status changes to Installed.

To see that the Datadog agent is installed, select the virtual machine and navigate to the Extensions window.

You can uninstall Datadog agents on a virtual machine by going to **Virtual machine agent**. Select the virtual machine and **Uninstall agent**.

## Monitor App Services using the Datadog agent as an extension

You can install Datadog agents on app services as an extension. Go to **App Service extension** in left pane. This screen shows the list of all app services across all subscriptions you have *Owner* role assigned to. All subscriptions are selected by default. You can select a subset of subscriptions to narrow down the list of app services shown.

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

## Change Plan

To change the Datadog billing plan, go to **Overview** and select **Change Plan**.

The portal retrieves all the available Datadog plans for your tenant. 

Choose the appropriate plan and select **Change Plan**.
  
## Disable or enable integration

You can stop sending logs and metrics from Azure to Datadog. You continue to be billed for other Datadog services that aren't related to monitoring metrics and logs.

To disable the Azure integration with Datadog, go to **Overview**. Select **Disable** and **OK**.

To enable the Azure integration with Datadog, go to **Overview**. Select **Enable** and **OK**. 

Selecting **Enable** retrieves any previous configuration for metrics and logs. The configuration determines which Azure resources emit metrics and logs to Datadog. After you complete this step, metrics and logs are sent to Datadog.

## Delete a Datadog resource

If only one Datadog resource is mapped to a Datadog organization, logs and metrics are no longer sent to Datadog. All billing stops for Datadog through Azure Marketplace.

If more than one Datadog resource is mapped to the Datadog organization, deleting the Datadog resource only stops sending logs and metrics for that Datadog resource. Because the Datadog organization is linked to other Azure resources, billing continues through Azure Marketplace.

If you're done using your resource and would like to delete it, follow these steps:

1. From the **Resource** menu, select the resource you would like to delete.

1. On the working pane of the **Overview** menu, select **Delete**.

1. Confirm deletion.

1. Select a reason for deleting the resource.

1. Select **Delete**.

## Next steps

- [Troubleshooting Datadog solutions](troubleshoot.md)
- Get started with Datadog on

    > [!div class="nextstepaction"]
    > [Azure portal](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Datadog%2Fmonitors)

    > [!div class="nextstepaction"]
    > [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/datadog1591740804488.dd_liftr_v2?tab=Overview)
