---
title: Azure NAT Gateway Resource Health
titleSuffix: Azure NAT Gateway
description: Get started learning how to use resource health to provide information about the health of your Azure NAT gateway.
author: asudbring
ms.service: nat-gateway
# Customer intent: As an IT administrator, I want to understand how to use resource health to monitor NAT gateway.
ms.topic: how-to
ms.date: 01/30/2024
ms.author: allensu
---
# Azure NAT Gateway Resource Health

This article provides guidance on how to use Azure Resource Health to monitor and troubleshoot connectivity issues with your NAT gateway resource. Resource health provides an automatic check to keep you informed on the current availability of your NAT gateway.

## Resource health status

[Azure Resource Health](../service-health/overview.md) provides information about the health of your NAT gateway resource. You can use resource health and Azure monitor notifications to keep you informed on the availability and health status of your NAT gateway resource. Resource health can help you quickly assess whether an issue is due to a problem in your Azure infrastructure or because of an Azure platform event. The resource health of your NAT gateway is evaluated by measuring the data-path availability of your NAT gateway endpoint.

You can view the status of your NAT gateway’s health status on the **Resource Health** page, found under **Support + troubleshooting** for your NAT gateway resource.  

The health of your NAT gateway resource is displayed as one of the following statuses: 

| Resource health status | Description |
|---|---|
| Available | Your NAT gateway resource is healthy and available. |
| Degraded | Your NAT gateway resource has platform or user initiated events affect the health of your NAT gateway. The metric for the data-path availability reports less than 80% but greater than 25% health for the last 15 minutes. You experience moderate to severe performance effect. |
| Unavailable | Your NAT gateway resource isn't healthy. The metric for the data-path availability reports less than 25% for the past 15 minutes. You experience significant performance effect or unavailability of your NAT gateway resource for outbound connectivity. There might be user or platform events causing unavailability. |
| Unknown | Health status for your NAT gateway resource isn't updated or received information for data-path availability for more than 5 minutes. This state should be transient and reflects the correct status as soon as data is received. |

For more information about Azure Resource Health, see [Resource Health overview](../service-health/resource-health-overview.md).

To view the health of your NAT gateway resource:

1. From the NAT gateway resource page, under **Support + troubleshooting**, select **Resource health**.

1. In the health history section, select the drop-down arrows next to dates to get more information on health history events of your NAT gateway resource. You can view up to 30 days of history in the health history section. 

1. Select the **+ Add resource health alert** at the top of the page to set up an alert for a specific health status of your NAT gateway resource. 

## Resource health alerts

Azure Resource Health alerts can notify you in near real-time when the health state of your NAT gateway resource changes. Set resource health alerts to notify you when your NAT gateway resource changes to a **Degraded** or **Unavailable** health state.

After you create Azure resource health alerts for NAT gateway, Azure sends resource health notifications to your Azure subscription when the health state of NAT gateway changes. You can create and customize alerts based on:

* The subscription affected

* The resource group affected

* The resource type affected (Microsoft.Network/NATGateways)

* The specific resource (any NAT gateway resource you choose to set up an alert for)

* The event status of the NAT gateway resource affected

* The current status of the NAT gateway resource affected

* The previous status of the NAT gateway resource affected

* The reason type of the NAT gateway resource affected

You can also configure who the alert should be sent to:

* A new action group (that can be used for future alerts)

* An existing action group

For more information on how to set up these resource health alerts, see:

* [Resource health alerts using Azure portal](/azure/service-health/resource-health-alert-monitor-guide#create-a-resource-health-alert-rule-in-the-azure-portal)

* [Resource health alerts using Resource Manager templates](/azure/service-health/resource-health-alert-arm-template-guide)

## Next steps

- Learn about [Azure NAT Gateway](./nat-overview.md)
- Learn about [metrics and alerts for NAT gateway](./nat-metrics.md)
- Learn about [troubleshooting NAT gateway resources](./troubleshoot-nat.md)
- Learn about [Azure resource health](../service-health/resource-health-overview.md)
