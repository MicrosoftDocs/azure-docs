---
title: Autoscaling and Zone-redundant Application Gateway v2
description: This article introduces the Azure Application Standard_v2 and WAF_v2 SKU, which includes Autoscaling and Zone-redundant features.
services: application-gateway
author: vhorne
ms.service: application-gateway
ms.topic: article
ms.date: 06/06/2020
ms.author: victorh
ms.custom: fasttrack-edit, references_regions
---

# Autoscaling and Zone-redundant Application Gateway v2 

Application Gateway and Web Application Firewall (WAF) are also available under a Standard_v2 and WAF_v2 SKU. The v2 SKU offers performance enhancements and adds support for critical new features like autoscaling, zone redundancy, and support for static VIPs. Existing features under the Standard and WAF SKU continue to be supported in the new v2 SKU, with a few exceptions listed in [comparison](#differences-from-v1-sku) section.

The new v2 SKU includes the following enhancements:

- **Autoscaling**: Application Gateway or WAF deployments under the autoscaling SKU can scale up or down based on changing traffic load patterns. Autoscaling also removes the requirement to choose a deployment size or instance count during provisioning. This SKU offers true elasticity. In the Standard_v2 and WAF_v2 SKU, Application Gateway can operate both in fixed capacity (autoscaling disabled) and in autoscaling enabled mode. Fixed capacity mode is useful for scenarios with consistent and predictable workloads. Autoscaling mode is beneficial in applications that see variance in application traffic.
- **Zone redundancy**: An Application Gateway or WAF deployment can span multiple Availability Zones, removing the need to provision separate Application Gateway instances in each zone with a Traffic Manager. You can choose a single zone or multiple zones where Application Gateway instances are deployed, which makes it more resilient to zone failure. The backend pool for applications can be similarly distributed across availability zones.

  Zone redundancy is available only where Azure Zones are available. In other regions, all other features are supported. For more information, see [Regions and Availability Zones in Azure](../availability-zones/az-overview.md)
- **Static VIP**: Application Gateway v2 SKU supports the static VIP type exclusively. This ensures that the VIP associated with the application gateway doesn't change for the lifecycle of the deployment, even after a restart.  There isn't a static VIP in v1, so you must use the application gateway URL instead of the IP address for domain name routing to App Services via the application gateway.
- **Header Rewrite**: Application Gateway allows you to add, remove, or update HTTP request and response headers with v2 SKU. For more information, see [Rewrite HTTP headers with Application Gateway](rewrite-http-headers.md)
- **Key Vault Integration**: Application Gateway v2 supports integration with Key Vault for server certificates that are attached to HTTPS enabled listeners. For more information, see [TLS termination with Key Vault certificates](key-vault-certs.md).
- **Azure Kubernetes Service Ingress Controller**: The Application Gateway v2 Ingress Controller allows the Azure Application Gateway to be used as the ingress for an Azure Kubernetes Service (AKS) known as AKS Cluster. For more information, see [What is Application Gateway Ingress Controller?](ingress-controller-overview.md).
- **Performance enhancements**: The v2 SKU offers up to 5X better TLS offload performance as compared to the Standard/WAF SKU.
- **Faster deployment and update time** The v2 SKU provides faster deployment and update time as compared to Standard/WAF SKU. This also includes WAF configuration changes.

![Diagram of auto-scaling zone.](./media/application-gateway-autoscaling-zone-redundant/application-gateway-autoscaling-zone-redundant.png)

## Supported regions

The Standard_v2 and WAF_v2 SKU is available in the following regions: North Central US, South Central US, West US, West US 2, East US, East US 2, Central US, North Europe, West Europe, Southeast Asia, France Central, UK West, Japan East, Japan West, Australia East, Australia Southeast, Brazil South, Canada Central, Canada East, East Asia, Korea Central, Korea South, UK South, Central India, West India, South India.

## Pricing

With the v2 SKU, the pricing model is driven by consumption and is no longer attached to instance counts or sizes. The v2 SKU pricing has two components:

- **Fixed price** - This is hourly (or partial hour) price to provision a Standard_v2 or WAF_v2 Gateway. Please note that 0 additional minimum instances still ensures high availability of the service which is always included with fixed price.
- **Capacity Unit price** - This is a consumption-based cost that is charged in addition to the fixed cost. Capacity unit charge is also computed hourly or partial hourly. There are three dimensions to capacity unit - compute unit, persistent connections, and throughput. Compute unit is a measure of processor capacity consumed. Factors affecting compute unit are TLS connections/sec, URL Rewrite computations, and WAF rule processing. Persistent connection is a measure of established TCP connections to the application gateway in a given billing interval. Throughput is average Megabits/sec processed by the system in a given billing interval.  The billing is done at a Capacity Unit level for anything above the reserved instance count.

Each capacity unit is composed of at most: 1 compute unit, 2500 persistent connections, and 2.22-Mbps throughput.

Compute unit guidance:

- **Standard_v2** - Each compute unit is capable of approximately 50 connections per second with RSA 2048-bit key TLS certificate.
- **WAF_v2** - Each compute unit can support approximately 10 concurrent requests per second for 70-30% mix of traffic with 70% requests less than 2 KB GET/POST and remaining higher. WAF performance is not affected by response size currently.

> [!NOTE]
> Each instance can currently support approximately 10 capacity units.
> The number of requests a compute unit can handle depends on various criteria like TLS certificate key size, key exchange algorithm, header rewrites, and in case of WAF incoming request size. We recommend you perform application tests to determine request rate per compute unit. Both capacity unit and compute unit will be made available as a metric before billing starts.

The following table shows example prices and are for illustration purposes only.

**Pricing in US East**:

|              SKU Name                             | Fixed price ($/hr)  | Capacity Unit price ($/CU-hr)   |
| ------------------------------------------------- | ------------------- | ------------------------------- |
| Standard_v2                                       |    0.20             | 0.0080                          |
| WAF_v2                                            |    0.36             | 0.0144                          |

For more pricing information, see the [pricing page](https://azure.microsoft.com/pricing/details/application-gateway/). 

**Example 1**

An Application Gateway Standard_v2 is provisioned without autoscaling in manual scaling mode with fixed capacity of five instances.

Fixed price = 744(hours) * $0.20 = $148.8 <br>
Capacity units = 744 (hours) * 10 capacity unit per instance * 5 instances * $0.008 per capacity unit hour = $297.6

Total price = $148.8 + $297.6 = $446.4

**Example 2**

An Application Gateway standard_v2 is provisioned for a month, with zero minimum instances, and during this time it receives 25 new TLS connections/sec, average of 8.88-Mbps data transfer. Assuming connections are short lived, your price would be:

Fixed price = 744(hours) * $0.20 = $148.8

Capacity unit price = 744(hours) * Max (25/50 compute unit for connections/sec, 8.88/2.22 capacity unit for throughput) * $0.008 = 744 * 4 * 0.008 = $23.81

Total price = $148.8+23.81 = $172.61

As you can see, you are only billed for four Capacity Units, not for the entire instance. 

> [!NOTE]
> The Max function returns the largest value in a pair of values.


**Example 3**

An Application Gateway standard_v2 is provisioned for a month, with a minimum of five instances. Assuming that there is no traffic and connections are short lived, your price would be:

Fixed price = 744(hours) * $0.20 = $148.8

Capacity unit price = 744(hours) * Max (0/50 compute unit for connections/sec, 0/2.22 capacity unit for throughput) * $0.008 = 744 * 50 * 0.008 = $297.60

Total price = $148.80+297.60 = $446.4

In this case, you're billed for the entirety of the five instances even though there is no traffic.

**Example 4**

An Application Gateway standard_v2 is provisioned for a month, with a minimum of five instances, but this time there is an average of 125-mbps data transfer, and 25 TLS connections per second. Assuming that there is no traffic and connections are short lived, your price would be:

Fixed price = 744(hours) * $0.20 = $148.8

Capacity unit price = 744(hours) * Max (25/50 compute unit for connections/sec, 125/2.22 capacity unit for throughput) * $0.008 = 744 * 57 * 0.008 = $339.26

Total price = $148.80+339.26 = $488.06

In this case, you are billed for the full five instances, plus seven Capacity Units (which is 7/10 of an instance).  

**Example 5**

An Application Gateway WAF_v2 is provisioned for a month. During this time, it receives 25 new TLS connections/sec, average of 8.88-Mbps data transfer and does 80 request per second. Assuming connections are short lived, and that compute unit calculation for the application supports 10 RPS per compute unit, your price would be:

Fixed price = 744(hours) * $0.36 = $267.84

Capacity unit price = 744(hours) * Max (compute unit Max(25/50 for connections/sec, 80/10 WAF RPS), 8.88/2.22 capacity unit for throughput) * $0.0144 = 744 * 8 * 0.0144 = $85.71

Total price = $267.84 + $85.71 = $353.55

> [!NOTE]
> The Max function returns the largest value in a pair of values.

## Scaling Application Gateway and WAF v2

Application Gateway and WAF can be configured to scale in two modes:

- **Autoscaling** - With autoscaling enabled, the Application Gateway and WAF v2 SKUs scale up or  down based on application traffic requirements. This mode offers better elasticity to your application and eliminates the need to guess the application gateway size or instance count. This mode also allows you to save cost by not requiring the gateway to run at peak provisioned capacity for anticipated maximum traffic load. You must specify a minimum and optionally maximum instance count. Minimum capacity ensures that Application Gateway and WAF v2 don't fall below the minimum instance count specified, even in the absence of traffic. Each instance is roughly equivalent to  10 additional reserved Capacity Units. Zero signifies no reserved capacity and is purely autoscaling in nature. You can also optionally specify a maximum instance count, which ensures that the Application Gateway doesn't scale beyond the specified number of instances. You will only be billed for the amount of traffic served by the Gateway. The instance counts can range from 0 to 125. The default value for maximum instance count is 20 if not specified.
- **Manual** - You can alternatively choose Manual mode where the gateway won't autoscale. In this mode, if there is more traffic than what Application Gateway or WAF can handle, it could result in traffic loss. With manual mode, specifying instance count is mandatory. Instance count can vary from 1 to 125 instances.

## Autoscaling and High Availability

Azure Application Gateways are always deployed in a highly available fashion. The service is made out of multiple instances that are created as configured (if autoscaling is disabled) or required by the application load (if autoscaling is enabled). Note that from the user's perspective you do not necessarily have visibility into the individual instances, but just into the Application Gateway service as a whole. If a certain instance has a problem and stops being functional, Azure Application Gateway will transparently create a new instance.

Please note that even if you configure autoscaling with zero minimum instances the service will still be highly available, which is always included with the fixed price.

However, creating a new instance can take some time (around six or seven minutes). Hence, if you do not want to cope with this downtime you can configure a minimum instance count of 2, ideally with Availability Zone support. This way you will have at least two instances inside of your Azure Application Gateway under normal circumstances, so if one of them had a problem the other will try to cope with the traffic, during the time a new instance is being created. Note that an Azure Application Gateway instance can support around 10 Capacity Units, so depending on how much traffic you typically have you might want to configure your minimum instance autoscaling setting to a value higher than 2.

## Feature comparison between v1 SKU and v2 SKU

The following table compares the features available with each SKU.

|                                                   | v1 SKU   | v2 SKU   |
| ------------------------------------------------- | -------- | -------- |
| Autoscaling                                       |          | &#x2713; |
| Zone redundancy                                   |          | &#x2713; |
| Static VIP                                        |          | &#x2713; |
| Azure Kubernetes Service (AKS) Ingress controller |          | &#x2713; |
| Azure Key Vault integration                       |          | &#x2713; |
| Rewrite HTTP(S) headers                           |          | &#x2713; |
| URL-based routing                                 | &#x2713; | &#x2713; |
| Multiple-site hosting                             | &#x2713; | &#x2713; |
| Traffic redirection                               | &#x2713; | &#x2713; |
| Web Application Firewall (WAF)                    | &#x2713; | &#x2713; |
| WAF custom rules                                  |          | &#x2713; |
| Transport Layer Security (TLS)/Secure Sockets Layer (SSL) termination            | &#x2713; | &#x2713; |
| End-to-end TLS encryption                         | &#x2713; | &#x2713; |
| Session affinity                                  | &#x2713; | &#x2713; |
| Custom error pages                                | &#x2713; | &#x2713; |
| WebSocket support                                 | &#x2713; | &#x2713; |
| HTTP/2 support                                    | &#x2713; | &#x2713; |
| Connection draining                               | &#x2713; | &#x2713; |

> [!NOTE]
> The autoscaling v2 SKU now supports [default health probes](application-gateway-probe-overview.md#default-health-probe) to automatically monitor the health of all resources in its back-end pool and highlight those backend members that are considered unhealthy. The default health probe is automatically configured for backends that don't have any custom probe configuration. To learn more, see [health probes in application gateway](application-gateway-probe-overview.md).

## Differences from v1 SKU

This section describes features and limitations of the v2 SKU that differ from the v1 SKU.

|Difference|Details|
|--|--|
|Authentication certificate|Not supported.<br>For more information, see [Overview of end to end TLS with Application Gateway](ssl-overview.md#end-to-end-tls-with-the-v2-sku).|
|Mixing Standard_v2 and Standard Application Gateway on the same subnet|Not supported|
|User-Defined Route (UDR) on Application Gateway subnet|Supported (specific scenarios). In preview.<br> For more information about supported scenarios, see [Application Gateway configuration overview](configuration-overview.md#user-defined-routes-supported-on-the-application-gateway-subnet).|
|NSG for Inbound port range| - 65200 to 65535 for Standard_v2 SKU<br>- 65503 to 65534 for Standard SKU.<br>For more information, see the [FAQ](application-gateway-faq.md#are-network-security-groups-supported-on-the-application-gateway-subnet).|
|Performance logs in Azure diagnostics|Not supported.<br>Azure metrics should be used.|
|Billing|Billing scheduled to start on July 1, 2019.|
|FIPS mode|These are currently not supported.|
|ILB only mode|This is currently not supported. Public and ILB mode together is supported.|
|Net watcher integration|Not supported.|
|Azure Security Center integration|Not yet available.

## Migrate from v1 to v2

An Azure PowerShell script is available in the PowerShell gallery to help you migrate from your v1 Application Gateway/WAF to the v2 Autoscaling SKU. This script helps you copy the configuration from your v1 gateway. Traffic migration is still your responsibility. For more information, see [Migrate Azure Application Gateway from v1 to v2](migrate-v1-v2.md).

## Next steps

- [Quickstart: Direct web traffic with Azure Application Gateway - Azure portal](quick-create-portal.md)
- [Create an autoscaling, zone redundant application gateway with a reserved virtual IP address using Azure PowerShell](tutorial-autoscale-ps.md)
- Learn more about [Application Gateway](overview.md).
- Learn more about [Azure Firewall](../firewall/overview.md).
