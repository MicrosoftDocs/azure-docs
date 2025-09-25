---
title: Troubleshooting client response time-outs and errors with API Management
description: Troubleshoot intermittent connection errors and related latency issues in API Management
author: dlepow
ms.topic: troubleshooting
ms.date: 04/15/2025
ms.author: danlep
ms.service: azure-api-management
---

# Troubleshooting client response time-outs and errors with API Management

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

This article helps you troubleshoot intermittent connection errors and related latency issues in [Azure API Management](./api-management-key-concepts.md). Specifically, this article provides information and troubleshooting for the exhaustion of source network address translation (SNAT) ports. If you require more help, contact the Azure experts at [Azure Community Support](https://azure.microsoft.com/support/community/) or file a support request with [Azure Support](https://azure.microsoft.com/support/options/).

## Symptoms

Client applications calling APIs through your API Management service may exhibit one or more of the following symptoms:

* Intermittent HTTP 500 errors
* Time-out error messages

These symptoms manifest as instances of `BackendConnectionFailure` in your [Azure Monitor resource logs](/azure/azure-monitor/essentials/resource-logs).

In certain API Management service tiers, you may also see diagnostic information related to SNAT port exhaustion in the Azure portal on the **Diagnose and solve problems** > **SNAT Port Analysis** page for your API Management instance.

## Cause

This pattern of symptoms often occurs due to SNAT port limits with your API Management service.

Whenever a client calls one of your API Management APIs, Azure API Management service opens a SNAT port to access your backend API. As discussed in [Outbound connections in Azure](../load-balancer/load-balancer-outbound-connections.md), Azure uses source network address translation (SNAT) and a load balancer (not exposed to customers) to communicate with endpoints outside Azure in the public IP address space, and to endpoints internal to Azure that aren't using [Virtual Network service endpoints](../virtual-network/virtual-network-service-endpoints-overview.md). This situation is only applicable to backend APIs exposed on public IPs.

Each instance of the API Management service is initially given a preallocated number of SNAT ports. That limit affects opening connections to the same host and port combination. SNAT ports are used up when you have repeated calls to the same address and port combination. Once a SNAT port has been released, the port is available for reuse as needed. The Azure network load balancer reclaims SNAT ports from closed connections only after waiting four minutes.

A rapid succession of client requests to your APIs may exhaust the preallocated quota of SNAT ports if these ports aren't closed and recycled fast enough, preventing your API Management service from processing client requests in a timely manner.

## Mitigations and solutions

General strategies for mitigating SNAT port exhaustion are discussed in [Troubleshooting outbound connections failures](../load-balancer/troubleshoot-outbound-connection.md) in the Azure Load Balancer documentation. Of these strategies, the following are applicable to API Management.

### Enable Azure NAT Gateway

For a virtual network-injected instance in the Premium tier of API Management, you can enable [Azure NAT Gateway](/azure/virtual-network/nat-gateway/nat-overview) to provide a larger number of SNAT ports (up to 64K) than are available by default in API Management. If supported in your scenario, this solution is the most effective way to avoid SNAT port exhaustion.

To enable Azure NAT Gateway in the API Management instance's virtual network, set the instance's `natGatewayState` property to `enabled` by using the [API Management Service - Create Or Update](/rest/api/apimanagement/api-management-service/create-or-update#apimanagementcreateservicewithnatgatewayenabled) REST API.

> [!NOTE]
> * Currently, to set the `natGatewayState` property, the instance can't be in a zonal or zone-redundant configuration.
> * For an instance injected into a virtual network in internal mode, the NAT gateway works only for outbound traffic to the internet.
> * Azure NAT Gateway may incur extra costs.

The default idle time-out set in the NAT gateway is 4 minutes. You can change the idle time-out to a maximum of 120 minutes. For more information, see [Manage NAT Gateway](/azure/nat-gateway/manage-nat-gateway?tabs=manage-nat-portal).

If you're unable to use a NAT gateway for outbound connectivity, refer to the other mitigation options described in this section.

### Scale your API Management instance

Each API Management instance is allocated a number of SNAT ports, based on API Management units. You can allocate more SNAT ports by scaling your API Management instance with more units. For more information, see [Scale your API Management service](upgrade-and-scale.md#scale-your-api-management-instance).

> [!NOTE]
> SNAT port usage is currently not available as a metric for autoscaling API Management units.

### Use multiple IPs for your backend URLs

Each connection from your API Management instance to the same destination IP and destination port of your backend service uses a SNAT port, in order to maintain a distinct traffic flow. Without different SNAT ports for the return traffic from your background service, API Management has no way to separate one response from another.

Because SNAT ports can be reused if the destination IP or destination port are different, another way to avoid SNAT port exhaustion is by using multiple IPs for your backend service URLs.

For more, see [Outbound proxy Azure Load Balancer](../load-balancer/load-balancer-outbound-connections.md).

### Place your API Management and backend service in the same VNet

If your backend API is hosted on an Azure service that supports *service endpoints* such as App Service, you can avoid SNAT port exhaustion issues by placing your API Management instance and backend service in the same virtual network and exposing it through [service endpoints](../virtual-network/virtual-network-service-endpoints-overview.md) or [private endpoints](../private-link/private-endpoint-overview.md). When you use a common VNet and place service endpoints on the integration subnet, outbound traffic from your API Management instance to those services bypasses the internet, thus avoiding SNAT port restrictions. Likewise, if you use a VNet and private endpoints, you will not have any outbound SNAT port issues to that destination.

For details, see [How to use Azure API Management with virtual networks](api-management-using-with-vnet.md) and [Integrate App Service with an Azure virtual network](../app-service/overview-vnet-integration.md).

### Place your API Management service in a virtual network and route outbound calls to Azure Firewall

Similar to placing your API Management and backend services in a virtual network, you can employ Azure Firewall in a VNet with your API Management service, then route outbound API Management calls to Azure Firewall. Between API Management and Azure Firewall (when placed in the same VNet), no SNAT ports are required. For SNAT connections to your backend services, Azure Firewall has 64,000 available ports, a much higher amount than is allocated to API Management instances.

Refer to [Azure Firewall](../firewall/overview.md) documentation for more information.

### Consider response caching and other backend performance tuning

Another potential mitigation is to improve processing times for your backend APIs. One way to do this is by configuring certain APIs with response caching to reduce latency between client applications calling your API and your API Management backend load.

For more, see [Add caching to improve performance in Azure API Management](api-management-howto-cache.md).

### Consider implementing access restriction policies

If it makes sense for your business scenario, you can implement access restriction policies for your API Management product. For example, the [rate-limit-by-key](rate-limit-by-key-policy.md) policy can be used to prevent API usage spikes on a per key basis by limiting the call rate per a specified time period.

See [Rate limiting and quota policies](api-management-policies.md#rate-limiting-and-quotas) for more information.

## Related content

* [Azure Load Balancer: Troubleshooting outbound connections failures](../load-balancer/troubleshoot-outbound-connection.md)
* [Azure App Service: Troubleshooting intermittent outbound connection errors](../app-service/troubleshoot-intermittent-outbound-connection-errors.md)
