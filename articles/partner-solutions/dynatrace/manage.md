---
title: Manage settings for your Dynatrace resource via Azure portal
description: Manage settings, view resources, reconfigure metrics/logs, and more for your Dynatrace resource via Azure portal.

ms.topic: how-to
ms.date: 10/21/2025

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

You can install Dynatrace OneAgents on virtual machines, App Service extensions, Azure Kubernetes Services (AKS), and Azure Arc Machines.

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

#### [AKS](#tab/aks)

To monitor resources for AKS, select **Dynatrace environment config** > **Azure Kubernetes Services** in the left pane. 

[!INCLUDE [agent](../includes/agent.md)]

If AKS installation or uninstallation is inactive, see [AKS agent installation/uninstallation not available](https://go.microsoft.com/fwlink/?linkid=2331926).
 
#### [Azure Arc Machines](#tab/azure-arc-machines)

To monitor resources for Azure Arc Machines, select **Dynatrace environment config > Azure Arc Machines** from the Resource pane.

[!INCLUDE [agent](../includes/agent.md)]

---

## Monitor multiple subscriptions

When you add or remove subscriptions for Dynatrace monitoring, the system updates the Monitoring Reader role assignment on the system-managed identity that's linked to the resource. 

### Prerequisites

- To perform these actions, you must have both of the following Azure permissions:

   - `Microsoft.Authorization/roleAssignments/write`
   - `Microsoft.Authorization/roleAssignments/delete`

- The resource provider for Dynatrace (Dynatrace.Observability) must be registered in the target subscription.

### Add subscriptions 

> [!IMPORTANT]
> When you link a subscription to a Dynatrace resource, ensure that the subscription isn't scope locked (read-only or delete locks). Scope locks can prevent the addition and removal of diagnostic settings. For more information, see [Lock your Azure resources](../../azure-resource-manager/management/lock-resources.md).

To monitor multiple subscriptions: 

1. In the left pane, select **Dynatrace environment config** > **Monitored Subscriptions**. 

1. Select **Add subscriptions** in the top menu. 

   The **Add Subscriptions** pane opens. It shows the subscriptions for which you're assigned Owner and any Dynatrace resource created in those subscriptions that's already linked to the same Dynatrace environment as the current resource. 

   If the subscription you want to monitor has a resource already linked to the same Dynatrace environment, delete the resource to avoid shipping duplicate data and incurring double charges. 

1. Select the subscriptions you want to monitor via the Dynatrace resource, and then select **Add**. 

> [!note]
> You can link to as many as 20 subscriptions.

> [!important]
> Setting separate tag rules for different subscriptions isn't supported. 

Diagnostics settings are automatically added to the subscription's resources that match the defined tag rules. 

Select **Refresh** to view the subscriptions and their monitoring status. 

After a subscription is added, the status changes to **Active**. 

## Remove subscriptions 

> [!IMPORTANT]
> When you unlink a subscription from a Dynatrace resource, ensure that the subscription isn't scope locked (read-only or delete locks). Scope locks can prevent the addition and removal of diagnostic settings. For more information, see [Lock your Azure resources](../../azure-resource-manager/management/lock-resources.md). 

To unlink subscriptions from a Dynatrace resource: 

1. Select **Dynatrace environment config** > **Monitored Subscriptions** in the left pane. 

1. Select the subscription you want to remove. 

1. Select **Remove subscriptions**. 

To view the updated list of monitored subscriptions, select **Refresh** in the top menu. 

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
- [Monitor & Observe Azure resources with Azure Native Integrations](../metrics-logs.md)

