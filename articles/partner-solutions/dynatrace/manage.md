---
title: Manage settings for your Dynatrace resource via Azure portal
description: Manage settings, view resources, reconfigure metrics/logs, and more for your Dynatrace resource via Azure portal.

ms.topic: how-to
ms.date: 3/13/2025

---

# Manage Dynatrace resources

This article describes how to manage the settings for Dynatrace for Azure.

## Resource overview

To see the details of your Dynatrace resource, select **Overview** in the left pane.

:::image type="content" source="media/manage/resource-overivew.png" alt-text="A screenshot of a Dynatrace resource in the Azure portal with the overview displayed in the working pane.":::

The details include:

- Resource group name
- Region
- Subscription
- Subscription ID
- Tags
- Dynatrace environment
- Status
- Pricing plan
- Billing term
- Dynatrace account

To manage your resource, select the links next to corresponding details.

Below the essentials, you can navigate to other details about your resource by selecting the links.

- **Get started** provides access to Dashboards, Logs, and Smartscape Topology.
- **Monitoring** provides a summary of resources sending logs to Dynatrace.

## Reconfigure rules for metrics and logs

To change the configuration rules for logs, select **Metrics and logs** in the service menu on the left.

For more information, see [Configure metrics and logs](dynatrace-create.md#configure-metrics-and-logs).

## View monitored resources

To view the list of resources emitting logs to Dynatrace, select **Dynatrace environment config > Monitored Resources** in the service menu.

> [!TIP]
> You can filter the list of resources by resource type, resource group name, region, and whether the resource is sending logs and/or metrics. 

- The column **Logs to Dynatrace** indicates whether the resource is sending logs to Dynatrace. 
- The column **Metrics to Dynatrace** indicates whether the resource is sending metrics to Dynatrace.

## Monitor resources using Dynatrace OneAgent

You can install Dynatrace OneAgents on virtual machines, App Service extensions, and Azure Arc Machines.

#### [Virtual machines](#tab/virtual-machines)

To monitor resources for virtual machines, select **Dynatrace environment config > Virtual Machines** from the Resource pane.

> [!IMPORTANT]
>
> - If the virtual machine is stopped, installing the Dynatrace OneAgent is disabled. Dynatrace OneAgent can only be installed on virtual machines that are running.    
> - If a virtual machine shows that a OneAgent is installed and the option Uninstall extension is disabled, another resource configured the agent. To make changes, go to the other Dynatrace resource in the Azure subscription.

[!INCLUDE [agent](../includes/agent.md)]

#### [App Service](#tab/app-service)

To monitor resources for App Service, select **Dynatrace environment config > App Service** from the Resource pane.

[!INCLUDE [agent](../includes/agent.md)]
 
#### [Azure Arc Machines](#tab/azure-arc-machines)

To monitor resources for Azure Arc Machines, select **Dynatrace environment config > Azure Arc Machines** from the Resource pane.

[!INCLUDE [agent](../includes/agent.md)]

---

## Reconfigure single sign-on

[!INCLUDE [reconfigure-sso](../includes/reconfigure-sso.md)]

## Delete a resource

[!INCLUDE [delete-resource](../includes/delete-resource.md)]


## Get support

Contact [Dynatrace](https://support.dynatrace.com/) for customer support. 

You can also request support in the Azure portal from the [resource overview](#resource-overview).  

Select **Support + Troubleshooting** from the service menu, then choose the link to [log a support request in the Dynatrace portal](https://support.dynatrace.com/).

## Related content

- [Get started with infrastructure monitoring](https://www.dynatrace.com/support/help/how-to-use-dynatrace/hosts/basic-concepts/get-started-with-infrastructure-monitoring)

