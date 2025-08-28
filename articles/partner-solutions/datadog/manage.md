---
title: Manage settings for your Datadog resource via Azure portal
description: Manage settings, view resources, reconfigure metrics/logs, and more for your Datadog resource via Azure portal.
ms.topic: how-to
ms.date: 03/10/2025
ms.custom:
  - ai-gen-docs-bap
  - ai-gen-desc
  - ai-seo-date:12/03/2024
  - ai-gen-title
---

# Manage Datadog resources

This article shows how to manage the settings for Datadog.

## Resource overview

[!INCLUDE [manage](../includes/manage.md)]

:::image type="content" source="media/manage/resource-overview.png" alt-text="A screenshot of a Datadog resource in the Azure portal with the overview displayed in the working pane." lightbox="media/manage/resource-overview.png":::

The details include:

- Resource group name
- Location
- Subscription
- Subscription ID
- Tags
- Datadog organization
- Status
- Pricing Plan
- Billing Term

To manage your resource, select the links next to corresponding details.

Below the essentials, you can navigate to other details about your resource by selecting the links.

- **View Dashboards** provides insights on health and performance.
- **View Logs** allows you to search and analyze logs using adhoc queries.
- **View host maps** provides a complete view of all hosts (Azure Virtual Machines, Azure Virtual Machine Scale Sets, Azure App service plans)

A summary of resources is also displayed in the working pane. 

|Term                         |Description                                                                    |
|-----------------------------|-------------------------------------------------------------------------------|
|Resource type                |Azure resource type.                                                           |
|Total resources              |Count of all resources for the resource type.                                  |
|Resources sending logs       |Count of resources sending logs in Datadog through the integration.            |
|Resources sending metrics    |Count of resources sending metrics to Datadog through the integration.         |

## Reconfigure rules for metrics and logs

To change the configuration rules for metrics and logs:

1. Select **Datadog organization configurations > Metrics and Logs** from the service menu.

## View monitored resources

To view the list of resources emitting logs to Datadog, select **Datadog organization configurations > Monitored Resources** in the service menu.

> [!TIP]
> You can filter the list of resources by resource type, subscription, resource group name, location, and whether the resource is sending logs and metrics. 

The column **Logs to Datadog** indicates whether the resource is sending logs to Datadog. 

## Monitor multiple subscriptions

To monitor multiple subscriptions:

1. Select **Datadog organization configurations > Monitored Subscriptions**.

1. Select **Add subscriptions** from the Command bar.

    The **Add Subscriptions** experience that opens and shows subscriptions you have _Owner_ role assigned to and any Datadog resource created in those subscriptions that is already linked to the same Datadog organization as the current resource.
    
    If the subscription you want to monitor has a resource already linked to the same Datadog org, delete the Datadog resources to avoid shipping duplicate data and incurring double the charges.

1. Select the subscriptions you want to monitor through the Datadog resource and select **Add**.

    > [!IMPORTANT]
    > Setting separate tag rules for different subscriptions isn't supported.

    Diagnostics settings are automatically added to the subscription's resources that match the defined tag rules.

    Select **Refresh**  to view the subscriptions and their monitoring status. 

Once the subscription is added, the status changes to *Active*.  

### Remove subscriptions

To unlink subscriptions from a Datadog resource:

1. Select **Datadog organization configurations > Monitored Subscriptions** from the service menu. 

1. Select the subscription you want to remove.

1. Choose **Remove subscriptions**. 

To view the updated list of monitored subscriptions, select **Refresh** from the Command bar.

## API keys

To view the list of API keys for your Datadog resource:

1. Select **Settings > Keys** from the service menu.

    The Azure portal provides a read-only view of the API keys. 

1. Select the **Datadog portal** link.

    The Datadog portal opens in a new tab.  

After making changes in the Datadog portal, refresh the Azure portal view.

## Monitor resources with Datadog agents

You can install Datadog agents on virtual machines, App Service extensions, Azure Kubernetes Services, and Azure Arc Machines. 

> [!IMPORTANT]
> If a default key isn't selected, your Datadog agent installation fails. See [API keys](#api-keys).

#### [Virtual machines](#tab/virtual-machines)

To monitor resources for virtual machines, select **Datadog organization configurations > Virtual machine agent** from the Resource pane.

[!INCLUDE [agent](../includes/agent.md)]

#### [App Service](#tab/app-service)

To monitor resources for App Service, select **Datadog organization configurations > App Service extension** from the Resource pane.

[!INCLUDE [agent](../includes/agent.md)]

#### [Azure Kubernetes Services](#tab/azure-kubernetes-services)

To monitor resources Azure Kubernetes Services, select **Datadog organization configurations > Azure Kubernetes Services** from the Resource pane.

[!INCLUDE [agent](../includes/agent.md)]

#### [Azure Arc Machines](#tab/azure-arc-machines)

To monitor resources for Azure Arc Machines, select **Datadog organization configurations > Azure Arc Machines** from the Resource pane.

[!INCLUDE [agent](../includes/agent.md)]

---

## Reconfigure single sign-on

[!INCLUDE [reconfigure-sso](../includes/reconfigure-sso.md)]

## Change your billing plan

[!INCLUDE [change-plan](../includes/change-plan.md)]
  
## Manage logs and metrics

To stop sending logs and metrics from Azure to Datadog:

[!INCLUDE [manage](../includes/manage.md)]

1. Select **Disable** from the Command bar.

> [!IMPORTANT]
> Billing continues for other Datadog services that aren't related to monitoring metrics and logs.

## Delete a resource

[!INCLUDE [delete-resource](../includes/delete-resource.md)]

## Get support

Contact [Datadog](https://www.datadoghq.com/support) for customer support. 

You can also request support in the Azure portal from the [resource overview](#resource-overview).  

Select **Support + Troubleshooting** > **New support request** from the service menu, then choose the link to [log a support request in the Datadog portal](https://www.datadoghq.com/support). 

