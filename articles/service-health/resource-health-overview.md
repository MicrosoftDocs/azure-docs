---
title: Azure Resource Health overview
description: Learn how Azure Resource Health helps you diagnose and get support for service problems that affect your Azure resources.
ms.topic: conceptual
ms.date: 02/14/2023

---
# Resource Health overview
 
Azure Resource Health helps you diagnose and get support for service problems that affect your Azure resources. It reports on the current and past health of your resources.

[Azure status](https://azure.status.microsoft) reports on service problems that affect a broad set of Azure customers. Resource Health gives you a personalized dashboard of the health of your resources. Resource Health shows all the times that your resources have been unavailable because of Azure service problems. This data makes it easy for you to see if an SLA was violated.

## Resource definition and health assessment

A *resource* is a specific instance of an Azure service, such as a virtual machine, web app, or SQL Database. Resource Health relies on signals from different Azure services to assess whether a resource is healthy. If a resource is unhealthy, Resource Health analyzes additional information to determine the source of the problem. It also reports on actions that Microsoft is taking to fix the problem and identifies things that you can do to address it.

For more information on how health is assessed, see the list of resource types and health checks at [Azure Resource Health](resource-health-checks-resource-types.md).

## Health status

The health of a resource is displayed as one of the following statuses.

### Available

*Available* means that there are no events detected that affect the health of the resource. In cases where the resource recovered from unplanned downtime during the last 24 hours, you'll see a "Recently resolved" notification.

![Status of *Available* for a virtual machine that has a "Recently resolved" notification](./media/resource-health-overview/Available.png)

### Unavailable

*Unavailable* means that the service detected an ongoing platform or non-platform event that affects the health of the resource.

#### Platform events

Platform events are triggered by multiple components of the Azure infrastructure. They include both scheduled actions (for example, planned maintenance) and unexpected incidents (for example, an unplanned host reboot or degraded host hardware that is predicted to fail after a specified time window).

Resource Health provides additional details about the event and the recovery process. It also enables you to contact Microsoft  Support even if you don't have an active support agreement.

![Status of *Unavailable* for a virtual machine because of a platform event](./media/resource-health-overview/Unavailable.png)

#### Non-platform events

Non-platform events are triggered by user actions. Examples include stopping a virtual machine or reaching the maximum number of connections to Azure Cache for Redis.

![Status of "Unavailable" for a virtual machine because of a non-platform event](./media/resource-health-overview/Unavailable_NonPlatform.png)

### Unknown

*Unknown* means that Resource Health hasn't received information about the resource for more than 10 minutes. This commonly occurs when virtual machines have been deallocated. Although this status isn't a definitive indication of the state of the resource, it can be an important data point for troubleshooting.

If the resource is running as expected, the status of the resource will change to *Available* after a few minutes.

If you experience problems with the resource, the *Unknown* health status might mean that an event in the platform is affecting the resource.

![Status of *Unknown* for a virtual machine](./media/resource-health-overview/Unknown.png)

### Degraded

*Degraded* means that your resource detected a loss in performance, although it's still available for use.

Different resources have their own criteria for when they report that they are degraded.

![Status of *Degraded* for a virtual machine](./media/resource-health-overview/degraded.png)

For Virtual Machine Scale Sets, visit [Resource health state is "Degraded" in Azure Virtual Machine Scale Set](/troubleshoot/azure/virtual-machine-scale-sets/resource-health-degraded-state) page for more information.

### Health not supported

The message *Health not supported* or *RP has no information about the resource, or you don't have read/write access for that resource* means that your resource is not supported for the health metrics.

To know which resources support health metrics, refer to [Supported Resource Types](resource-health-checks-resource-types.md) page.

## History information

> [!NOTE]
> You can list current service health events in subscription and query data up to 1 year using the QueryStartTime parameter of [Events - List By Subscription Id](/rest/api/resourcehealth/2022-05-01/events/list-by-subscription-id) REST API but currently there is no QueryStartTime parameter under [Events - List By Single Resource](/rest/api/resourcehealth/2022-05-01/events/list-by-single-resource) REST API so you cannot query data up to 1 year while listing current service health events for given resource.
 
You can access up to 30 days of history in the **Health history** section of Resource Health from Azure portal.

![List of Resource Health events over the last two weeks](./media/resource-health-overview/history-blade.png)

## Root cause information

If Azure has further information about the root cause of a platform-initiated unavailability, that information may be posted in resource health up to 72 hours after the initial unavailability. This information is only available for virtual machines at this time. 

## Get started

To open Resource Health for one resource:

1. Sign in to the Azure portal.
2. Browse to your resource.
3. On the resource menu in the left pane, select **Resource health**.
4. From the health history grid, you can either download a PDF or click the "Share/Manage" RCA button.

![Opening Resource Health from the resource view](./media/resource-health-overview/from-resource-blade.png)

:::image type="content" source="./media/resource-health-overview/resource-health-history-grid.png" lightbox="./media/resource-health-overview/resource-health-history-grid.png" alt-text="Screenshot of the Resource Health pane in the Azure portal. The Unavailable message and Download as PDF and Share/Manage RCA buttons are highlighted.":::

You can also access Resource Health by selecting **All services** and typing **resource health** in the filter text box. In the **Help + support** pane, select [Resource health](https://portal.azure.com/#blade/Microsoft_Azure_Monitoring/AzureMonitoringBrowseBlade/resourceHealth).

![Opening Resource Health from "All services"](./media/resource-health-overview/FromOtherServices.png)

## Next steps

Check out these references to learn more about Resource Health:
-  [Resource types and health checks in Azure Resource Health](resource-health-checks-resource-types.md)
-  [Resource Health virtual machine Health Annotations](resource-health-vm-annotation.md)
-  [Frequently asked questions about Azure Resource Health](resource-health-faq.yml)
