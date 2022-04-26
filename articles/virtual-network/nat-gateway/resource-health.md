---
title: Resource health for Azure Virtual Network NAT
titleSuffix: Azure Virtual Network
description: Understand how to use Resource health for Virtual Network NAT.
author: asudbring
manager: KumudD
ms.service: virtual-network
ms.subservice: nat
# Customer intent: As an IT administrator, I want to understand how to use Resource health to monitor Virtual Network NAT.
ms.topic: conceptual
ms.date: 04/25/2022
ms.author: allensu
---
# Azure Virtual Network NAT Resource health

This article provides guidance on how to use Azure Resource health to monitor and troubleshoot connectivity issues with your NAT gateway resource. Resource health provides an automatic check to keep you informed on the current availability of your NAT gateway.

## Resource health status

[Azure Resource Health](/azure/service-health/overview) provides information about the health of your NAT gateway resource. You can use Resource health and Azure monitor notifications to keep you informed on the availability and health status of your NAT gateway resource. Resource health can help you quickly assess whether an issue is due to a problem in your Azure infrastructure or because of an Azure platform event.  The Resource health of your NAT gateway is evaluated by measuring the datapath availability of your NAT gateway endpoint.

You can view the status of your NAT gateway’s health status on the **Resource Health** page, found under **Support + troubleshooting** for your NAT gateway resource.  

The health of your NAT gateway resource is displayed as one of the following statuses: 

| Resource health status | Description |
|---|---|
| Available | Your NAT gateway resource is healthy and available. |
| Degraded | Your NAT gateway resource has platform or user initiated events impacting the health of your NAT gateway. The metric for the datapath availability has reported less than 80% but greater than 25% health for the last fifteen minutes. |
| Unavailable | Your NAT gateway resource is not healthy. The metric for the datapath availability has reported less than 25% for the past 15 minutes. You may experience unavailability of your NAT gateway resource for outbound connectivity. |
| Unknown | Health status for your NAT gateway resource hasn’t been updated or hasn’t received information for data path availability for more than 5 minutes. This state should be transient and will reflect the correct status as soon as data is received. |

See [Resource Health overview](/azure/service-health/resource-health-overview) for more information on the different resource health statuses.

To view the health of your NAT gateway resource:
1. From the NAT gateway resource page, under **Support + troubleshooting**, select **Resource health**.
2. In the Health history section, select the drop-down arrows next to dates to get more information on health history events of your NAT gateway resource. You can view up to 30 days of history in the Health history section. 
3. Select the **+ Add resource health alert** at the top of the page to set up an alert for a specific health status of your NAT gateway resource. 

## Next Steps

- Learn aout [Virtual Network NAT](/azure/virtual-network/nat-gateway/nat-overview)
- Learn about [metrics and alerts for NAT gateway](/azure/virtual-network/nat-gateway/nat-metrics)
- Learn about [troubleshooting NAT gateway resources](/azure/virtual-network/nat-gateway/troubleshoot-nat)
- Learn about [Azure resource health](/azure/service-health/resource-health-overview)
