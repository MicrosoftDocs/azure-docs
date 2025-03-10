---
title: Manage settings for your Datadog resource via Azure portal
description: Manage settings, view resources, reconfigure metrics/logs, and more for your Datadog resource via Azure portal.

ms.topic: how-to
ms.date: 12/11/2024
ms.custom:
  - ai-gen-docs-bap
  - ai-gen-desc
  - ai-seo-date:12/03/2024
  - ai-gen-title
---

# Manage settings for your Datadog resource via Azure portal

This article shows how to manage the settings for Datadog.

## Resource overview

To see details of your Datadog resource, select **Overview** in the left pane.

The details include:

- Resource group name
- Location
- Subscription
- Subscription ID
- Tags
- Datadog organization
- Status
- Pricing Plan
- Billing Plan

To manage your resource, select the links next to corresponding details.

Below the essentials, you can navigate to other details about your resource by selecting the links.

- **View Dashboards** provides insights on health and performance.
- **View Logs** allows you to search and analyze logs using adhoc queries.
- **View host maps** provides a complete view of all hosts (VMs, VMSS, App service plans)

A summary of resources is also displayed in the working pane. 

|Term                         |Description                                                                    |
|-----------------------------|-------------------------------------------------------------------------------|
|Resource type                |Azure resource type.                                                           |
|Total resources              |Count of all resources for the resource type.                                  |
|Resources sending logs       |Count of resources sending logs in Datadog through the integration.            |
|Resources sending metrics    |Count of resources sending metrics to Datadog through the integration.         |

## Reconfigure rules for metrics and logs

To change the configuration rules for metrics and logs, select **Datadog organization configurations > Metrics and Logs** in the Resource menu.

## View monitored resources

To see the list of resources emitting logs to Datadog, select **Datadog organization configurations > Monitored Resources** in the Resource menu.

You can filter the list of resources by resource type, subscription, resource group name, location, and whether the resource is sending logs and metrics. 

The column **Logs to Datadog** indicates whether the resource is sending logs to Datadog. 

## Monitor multiple subscriptions

You can monitor multiple subscriptions by linking them to a single Datadog resource tied to a Datadog organization, which provides a single pane of glass view for all resources across multiple subscriptions.

To manage multiple subscriptions that you want to monitor, select **Monitored Subscriptions** in the **Datadog organization configurations** section of the Resource menu.

From **Monitored Subscriptions** in the Resource menu, select the **Add Subscriptions**. The **Add Subscriptions** experience that opens and shows the subscriptions you have _Owner_ role assigned to and any Datadog resource created in those subscriptions that is already linked to the same Datadog organization as the current resource.

If the subscription you want to monitor has a resource already linked to the same Datadog org, delete the Datadog resources to avoid shipping duplicate data, and incurring double the charges.

Select the subscriptions you want to monitor through the Datadog resource and select **Add**.

If the list doesn’t get updated automatically, select **Refresh**  to view the subscriptions and their monitoring status. You might see an intermediate status of _In Progress_ while a subscription gets added. When the subscription is successfully added, you see the status is updated to **Active**. If a subscription fails to get added, **Monitoring Status** shows as **Failed**.

The set of tag rules for metrics and logs defined for the Datadog resource apply to all subscriptions that are added for monitoring. Setting separate tag rules for different subscriptions isn't supported. Diagnostics settings are automatically added to resources in the added subscriptions that match the tag rules defined for the Datadog resource. 

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

## Monitor AKS clusters using the Datadog extension
You can collect monitoring data from your containerized applications deployed on Azure Kubernetes Service (AKS) by installing the Datadog Agent on your AKS clusters.
- Select **Datadog organization configurations** > **Azure Kubernetes Services** from the *Service menu*. 

    A list of all AKS Clusters in the subscription displays in the working pane. If you have added multiple subscriptions via the **Monitored Subscriptions** blade, AKS clusters across all of those subscriptions are listed. Filters include *Resource Group*, *Subscription*, *Resource Status* and *Agent Status*.

For each AKS resource, the following info appears:

|  Property                | Description                                                              |
|--------------------------|--------------------------------------------------------------------------|
| **Resource Name**        | Name of the AKS Cluster.                                                 |
| **Resource Group**       | Name of the resource group containing the AKS resource.                  |
| **Subscription**         | Name of the subscription containing the AKS resource.                    |
| **Kubernetes Version**   | The version of Kubernetes running in the cluster.                        |
| **Resource Status**      | Indicates whether the AKS resource is stopped or running.                |
| **Agent Status**         | Indicates whether the Datadog agent is running on the AKS Cluster.       |
| **Agent Version**        | Version of the Datadog agent.                                            |

- To install the agent, choose the AKS clusters you would like to monitor and click on **Install Extension**. Select **OK** to begin the installation process for the Datadog agent. After the Datadog agent is installed, the agent status changes to *Installed*.

You can uninstall the Datadog agent on a cluster by selecting the AKS resource and clicking on **Uninstall Extension**.

## Monitor Arc enabled servers using the Datadog agent
You can monitor your Azure Arc-enabled servers by installing the Datadog agent as an extension.
- Select **Datadog organization configurations** > **Azure Arc Machines** from the *Service menu*. 

    A list of all Arc-enabled servers in the subscription displays in the working pane. If you have added multiple subscriptions via the **Monitored Subscriptions** blade, resources across all of those subscriptions are listed. Filters include *Resource Group*, *Subscription*, *Resource Status* and *Agent Status*.

For each Arc-enabled server, the following info appears:

|  Property                | Description                                                              |
|--------------------------|--------------------------------------------------------------------------|
| **Resource Name**        | Name of the Azure Arc-enabled server.                                    |
| **Resource Group**       | Name of the resource group containing the Arc-enabled server.            |
| **Subscription**         | Name of the subscription containing the Arc-enabled server.              |
| **Resource Status**      | Indicates whether the Arc-enabled server is stopped or running.          |
| **Agent Status**         | Indicates whether the Datadog agent is running on the Arc-enabled server.|
| **Agent Version**        | Version of the Datadog agent.                                            |

- To install the agent, choose the Arc-enabled servers you would like to monitor and click on **Install Extension**. Select **OK** to begin the installation process for the Datadog agent. After the Datadog agent is installed, the agent status changes to *Installed*.

You can uninstall the Datadog agent on an Arc server by selecting the resource and clicking on **Uninstall Extension**.

## Reconfigure single sign-on

If you would like to reconfigure single sign-on, select **Single sign-on** in the left pane.

To establish single sign-on through Microsoft Entra ID, select **Enable single sign-on through Microsoft Entra ID**.

The portal retrieves the appropriate Datadog application from Microsoft Entra ID. The app comes from the enterprise app name you selected when setting up integration. Select the Datadog app name:

## Change your billing plan

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
