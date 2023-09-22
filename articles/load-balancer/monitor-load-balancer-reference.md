---
title: Monitoring Load Balancer data reference
titleSuffix: Azure Load Balancer
description: Important reference material needed when you monitor Load Balancer.
author: mbender-ms
ms.topic: reference
ms.author: mbender
ms.service: load-balancer
ms.date: 05/08/2023
ms.custom: subject-monitoring
---

# Monitoring load balancer data reference

See [Monitoring Load Balancer](monitor-load-balancer.md) for details on collecting and analyzing monitoring data for Load Balancer.

## Metrics

### Load balancer metrics 

| **Metric** | **Resource type** | **Description** | **Recommended aggregation** |
| ------ | ------------- | ----------- | ----------------------- |
| Data path availability | Public and internal load balancer |  Standard Load Balancer continuously exercises the data path from within a region to the load balancer front end, all the way to the SDN stack that supports your VM. As long as healthy instances remain, the measurement follows the same path as your application's load-balanced traffic. The data path that your customer's use is also validated. The measurement is invisible to your application and doesn't interfere with other operations. | Average |
| Health probe status | Public and internal load balancer | Standard Load Balancer uses a distributed health-probing service that monitors your application endpoint's health according to your configuration settings. This metric provides an aggregate or per-endpoint filtered view of each instance endpoint in the load balancer pool. You can see how Load Balancer views the health of your application, as indicated by your health probe configuration. | Average |
| SYN (synchronize) count | Public and internal load balancer | Standard Load Balancer uses a distributed health-probing service that monitors your application endpoint's health according to your configuration settings. This metric provides an aggregate or per-endpoint filtered view of each instance endpoint in the load balancer pool. You can see how Load Balancer views the health of your application, as indicated by your health probe configuration. | Average |
| SNAT connection count | Public load balancer | Standard Load Balancer reports the number of outbound flows that are masqueraded to the Public IP address front end. Source network address translation (SNAT) ports are an exhaustible resource. This metric can give an indication of how heavily your application is relying on SNAT for outbound originated flows. Counters for successful and failed outbound SNAT flows are reported and can be used to troubleshoot and understand the health of your outbound flows. | Sum |
| Allocated SNAT ports | Public load balancer | Standard Load Balancer reports the number of SNAT ports allocated per backend instance. | Average |
| Used SNAT ports | Public load balancer | Standard Load Balancer reports the number of SNAT ports that are utilized per backend instance. | Average |
| Byte count | Public and internal load balancer | Standard Load Balancer reports the data processed per front end. You may notice that the bytes aren't distributed equally across the backend instances. This is expected as Azure's Load Balancer algorithm is based on flows. | Sum |
| Packet count | Public and internal load balancer | Standard Load Balancer reports the packets processed per front end. | Sum |

For more information, see a list of [all platform metrics supported in Azure Monitor for load balancer](../azure-monitor/essentials/metrics-supported.md#microsoftnetworkloadbalancers).

## Metric dimensions

For more information on what metric dimensions are, see [Multi-dimensional metrics](../azure-monitor/essentials/data-platform-metrics.md#multi-dimensional-metrics).

Load Balancer has the following **dimensions** associated with its metrics.

| **Dimension Name** | **Description** |
| -------------- | ----------- |
| Frontend IP | The frontend IP address of the relevant load balancing rule(s) |
| Frontend Port | The frontend port of the relevant load balancing rule(s) | 
| Backend IP | The backend IP address of the relevant load balancing rule(s) |
| Backend Port | The backend port of the relevant load balancing rule(s) |
| Protocol Type | The protocol of the relevant load balancing rule, this can be TCP or UDP |
| Direction | The direction traffic is flowing. This can be inbound or outbound. | 
| Connection state | The state of SNAT connection, this can be pending, successful, or failed | 

## Resource logs

Resource logs are currently unsupported by Azure Load Balancer

## Azure Monitor logs tables
### Diagnostics tables

Diagnostics tables are currently unsupported by Azure Load Balancer.
## Activity log

The following table lists the **operations** related to Load Balancer that may be created in the Activity log.

| **Operation** | **Description** |
| --- | --- |
| Microsoft.Network/loadBalancers/read | Gets a load balancer definition |
| Microsoft.Network/loadBalancers/write | Creates a load balancer or updates an existing load balancer |
| Microsoft.Network/loadBalancers/delete | Deletes a load balancer |
| Microsoft.Network/loadBalancers/backendAddressPools/queryInboundNatRulePortMapping/action | Query inbound Nat rule port mapping. |
| Microsoft.Network/loadBalancers/backendAddressPools/read | Gets a load balancer backend address pool definition |
| Microsoft.Network/loadBalancers/backendAddressPools/write | Creates a load balancer backend address pool or updates an existing load balancer backend address pool |
| Microsoft.Network/loadBalancers/backendAddressPools/delete | Deletes a load balancer backend address pool |
| Microsoft.Network/loadBalancers/backendAddressPools/join/action | Joins a load balancer backend address pool. Not Alertable. |
| Microsoft.Network/loadBalancers/backendAddressPools/backendPoolAddresses/read | Lists the backend addresses of the Load Balancer backend address pool |
| Microsoft.Network/loadBalancers/frontendIPConfigurations/read | Gets a load balancer frontend IP configuration definition |
| Microsoft.Network/loadBalancers/frontendIPConfigurations/join/action | Joins a Load Balancer Frontend IP Configuration. Not alertable. |
| Microsoft.Network/loadBalancers/inboundNatPools/read | Gets a load balancer inbound nat pool definition |
| Microsoft.Network/loadBalancers/inboundNatPools/join/action | Joins a load balancer inbound NAT pool. Not alertable. |
| Microsoft.Network/loadBalancers/inboundNatRules/read | Gets a load balancer inbound nat rule definition |
| Microsoft.Network/loadBalancers/inboundNatRules/write | Creates a load balancer inbound nat rule or updates an existing load balancer inbound nat rule |
| Microsoft.Network/loadBalancers/inboundNatRules/delete | Deletes a load balancer inbound nat rule |
| Microsoft.Network/loadBalancers/inboundNatRules/join/action | Joins a load balancer inbound nat rule. Not Alertable. |
| Microsoft.Network/loadBalancers/loadBalancingRules/read | Gets a load balancer load balancing rule definition |
| Microsoft.Network/loadBalancers/networkInterfaces/read | Gets references to all the network interfaces under a load balancer |
| Microsoft.Network/loadBalancers/outboundRules/read | Gets a load balancer outbound rule definition |
| Microsoft.Network/loadBalancers/probes/read | Gets a load balancer probe |
| Microsoft.Network/loadBalancers/probes/join/action | Allows using probes of a load balancer. For example, with this permission healthProbe property of virtual machine scale set can reference the probe. Not alertable. |
| Microsoft.Network/loadBalancers/virtualMachines/read | Gets references to all the virtual machines under a load balancer |

For more information on the schema of Activity Log entries, see [Activity Log schema](../azure-monitor/essentials/activity-log-schema.md). 

## See Also

- See [Monitoring Azure Load Balancer](./monitor-load-balancer.md) for a description of monitoring Azure Load Balancer.