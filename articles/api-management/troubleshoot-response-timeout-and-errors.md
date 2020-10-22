---
title: Troubleshooting client response timeouts and errors with API Management
description: Troubleshoot intermittent connection errors and related latency issues in API Management
author: vladvino
ms.topic: troubleshooting
ms.date: 10/30/2020
ms.author: apimpm
ms.service: api-management
---

# Troubleshooting client response timeouts and errors with API Management

This article helps you troubleshoot intermittent connection errors and related latency issues in [Azure API Management](./api-management-key-concepts.md). Specifically, this topic will provide information and troubleshooting for the exhaustion of source address network translation (SNAT) ports. If you require more help, contact the Azure experts at [Azure Community Support](https://azure.microsoft.com/support/community/) or file a support request with [Azure Support](https://azure.microsoft.com/support/options/).

## Symptoms

Clients using your API Management (APIM) product may exhibit one or more of the following symptoms:

* Slow response times when calling your APIs
* Intermittent HTTP 500 errors
* Timeout error messages

These symptoms manifest as instances of `BackendConnectionFailure` in your [Azure Monitor resource logs](../azure-monitor/platform/resource-logs.md).

## Cause

This pattern of symptoms often occurs when a large volume of concurrent client connections results in slow response times from your backend API due to source network address translation (SNAT) port limits.

Whenever a client calls one of your APIM APIs, Azure API Management service opens a SNAT port to access your backend API. As discussed in [Outbound connections in Azure](../load-balancer/load-balancer-outbound-connections.md), Azure uses source network address translation (SNAT) and a Load Balancer (not exposed to customers) to communicate with end points outside Azure in the public IP address space, as well as end points internal to Azure that arn't using [Virtual Network service endpoints](../virtual-network/virtual-network-service-endpoints-overview.md).

Each instance of API Management service is initially given a pre-allocated number of SNAT ports. That limit affects opening connections to the same host and port combination. SNAT ports are used up when you have repeated calls to the same address and port combination. Once a SNAT port has been released, the port is available for reuse as needed. The Azure Network load balancer reclaims SNAT ports from closed connections only after waiting four minutes.

A rapid succession of client requests to your APIM APIs can quickly exhaust the pre-allocated quota of SNAT ports from your API Management instance to your backend services, preventing your APIM product from processing client requests in a timely manner.

## Mitigations and solutions

Addressing the problem of SNAT port exhaustion first requires diagnosing and optimizing the performance of your backend services.

General strategies for mitigating SNAT port exhaustion are discussed in [Troubleshooting outbound connections failures](../load-balancer/troubleshoot-outbound-connection.md) from *Azure Load Balancer* documentation. Of these strategies, the following are applicable to API Management.

### Scale your APIM instance

Each API Management instance is allocated a number of SNAT ports, based on APIM units. You can allocate additional SNAT ports by scaling your API Management instance with additional units. If you're already using the maximum units available, consider upgrading to a higher service tier. For more info, see [Upgrade and scale an Azure API Management instance](upgrade-and-scale.md)

> [!NOTE]
> SNAT port usage is currently not available as a metric for autoscaling API Management units.

### Use multiple IPs for your backend URLs

Each connection from your APIM instance to the same destination IP and destination port of your backend service will use a SNAT port, in order to maintain a distinct traffic flow. Without different SNAT ports for the return traffic from your background service, APIM would have no way to separate one response from another.

Because SNAT ports can be reused if the destination IP or destination port are different, another way to avoid SNAT port exhaustion is by using multiple IPs for your different backend service URLs.

For more, see [Outbound proxy Azure Load Balancer](../load-balancer/load-balancer-outbound-connections.md).

### Place your APIM and backend service together in a virtual network

If your backend API is hosted on an Azure service that supports [service endpoints](../virtual-network/virtual-network-service-endpoints-overview.md) such as App Service, you can avoid SNAT port exhaustion issues by using [regional VNet Integration](./web-sites-integrate-with-vnet.md) and service endpoints or private endpoints. When you use regional VNet Integration and place service endpoints on the integration subnet, outbound traffic from your APIM instance to those services bypasses the internet, thus avoiding SNAT port restrictions. Likewise, if you use regional VNet Integration and private endpoints, you will not have any outbound SNAT port issues to that destination.

For details, see [How to use Azure API Management with virtual networks](api-management-using-with-vnet.md) and [Integrate App Service with an Azure virtual network](../app-service/web-sites-integrate-with-vnet.md).

### Place your APIM in a virtual network and route outbound calls to Azure firewall

TODO more details

### Consider implementing access restriction policies

If it makes sense for your business scenario, you can implement access restriction policies for your API Management product. For example, the `rate-limit-by-key` policy can be used to prevent API usage spikes on a per key basis by limiting the call rate per a specified time period.

See [API Management access restriction policies](api-management-access-restriction-policies.md) for more info.

## See also

* [Azure Load Balancer: Troubleshooting outbound connections failures](../load-balancer/troubleshoot-outbound-connection.md)
* [Azure App Service: Troubleshooting intermittent outbound connection errors](../app-service/troubleshoot-intermittent-outbound-connection-errors.md)
