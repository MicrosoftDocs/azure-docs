---
title: Autoscaling and Zone-redundant Application Gateway in Azure
description: This article introduces the Azure Application Standard_v2 and WAF_v2 SKU, which includes Autoscaling and Zone-redundant features.
services: application-gateway
author: vhorne
ms.service: application-gateway
ms.topic: article
ms.date: 4/30/2019
ms.author: victorh
---

# Autoscaling and Zone-redundant Application Gateway 

Application Gateway and Web Application Firewall (WAF) are available under a new Standard_v2 and WAF_v2 SKU that offers performance enhancements and adds support for critical new features like autoscaling, zone redundancy, and support for static VIPs. Existing features under the Standard and WAF SKU continue to be supported in the new v2 SKU, with a few exceptions listed in known limitations section. The new v2 SKUs include the following enhancements:

- **Autoscaling**: Application Gateway or WAF deployments under the autoscaling SKU can scale up or down based on changing traffic load patterns. Autoscaling also removes the requirement to choose a deployment size or instance count during provisioning. This SKU offers true elasticity. In the new SKU, Application Gateway can operate both in fixed capacity (autoscaling disabled) and in autoscaling enabled mode. Fixed capacity mode is useful for scenarios with consistent and predictable workloads. Autoscaling mode is beneficial in applications that see lots of variances in the application traffic.

- **Zone redundancy**: An Application Gateway or WAF deployment can span multiple Availability Zones, removing the need to provision and spin separate Application Gateway instances in each zone with a Traffic Manager. You can choose a single zone or multiple zones where Application Gateway instances are deployed, thus ensuring zone failure resiliency. The backend pool for applications can be similarly distributed across availability zones.
- **Performance enhancements**: The autoscaling SKU offers up to 5X better SSL offload performance as compared to the generally available SKU.
- **Faster deployment and update time** The autoscaling SKU provides faster deployment and update time as compared to the generally available SKU.
- **Static VIP**: The application gateway VIP now supports the static VIP type exclusively. This ensures that the VIP associated with application gateway doesn't change even after a restart.

![](./media/application-gateway-autoscaling-zone-redundant/application-gateway-autoscaling-zone-redundant.png)

## Feature comparison between v1 SKU and v2 SKU

The following table compares the features available with each SKU.

|                                                   | v1 SKU   | v2 SKU   |
| ------------------------------------------------- | -------- | -------- |
| Autoscaling                                       |          | &#x2713; |
| Zone redundancy                                   |          | &#x2713; |
| Static VIP                                        |          | &#x2713; |
| Azure Kubernetes Service (AKS) Ingress controller |          | &#x2713; |
| Azure Key Vault integration                       |          | &#x2713; |
| URL-based routing                                 | &#x2713; | &#x2713; |
| Multiple-site hosting                             | &#x2713; | &#x2713; |
| Traffic redirection                               | &#x2713; | &#x2713; |
| Web application firewall (WAF)                    | &#x2713; | &#x2713; |
| Secure Sockets Layer (SSL) termination            | &#x2713; | &#x2713; |
| End-to-end SSL encryption                         | &#x2713; | &#x2713; |
| Session affinity                                  | &#x2713; | &#x2713; |
| Custom error pages                                | &#x2713; | &#x2713; |
| Rewrite HTTP(S) headers                           |          | &#x2713; |
| WebSocket support                                 | &#x2713; | &#x2713; |
| HTTP/2 support                                    | &#x2713; | &#x2713; |
| Connection draining                               | &#x2713; | &#x2713; |

> [!NOTE]
> The autoscaling and zone-redundant application gateway SKU now supports [default health probe](https://docs.microsoft.com/azure/application-gateway/application-gateway-probe-overview#default-health-probe) to automatically monitor the health of all resources in its back-end pool and highlight those backend members that are considered unhealthy. The default health probe wil be automatically configured for all those backends for which you haven't set up any custom probe configuration. To learn more, see [health probes in application gateway](https://docs.microsoft.com/azure/application-gateway/application-gateway-probe-overview).

## Supported regions

The Standard_v2 and WAF_v2 SKU is available in the following regions: North Central US, South Central US, West US, West US 2, East US, East US 2, Central US, North Europe, West Europe, Southeast Asia, France Central, UK West, Japan East, Japan West. Support for more regions is upcoming.

## Pricing

Pricing will be announced on May 14. See the pricing page for more details. The v2 SKU pricing has two components:
- **Fixed cost** - This is hourly (or partial hour) price to provision a Standard_v2 or WAF_v2 Gateway.
- **Capacity Unit cost** - This is consumption-based cost that is charged in addition to fixed cost.

Capacity Unit details:
- **Standard_v2** - Each capacity unit is capable of approximately 50 connections per second with RSA 2048-bit key TLS certificate or 2500 persistent connections or 2.22 Mbps of traffic.
- **WAF_v2** - Each capacity unit is capable of approximately 

## Autoscaling

Application Gateway and WAF v2 support autoscaling by default. Two modes are offered:

- **Autoscaling** - Autoscaling is the default mode. In this mode, Application Gateway and WAF v2 SKUs will scale up or  down based on application traffic requirements. This mode offers you better elasticity for your applications and eliminates the need to guess Application Gateway size or instance count. This mode also allows you to save cost by not requiring you to run gateways at size capable of handling peak anticipated traffic for the application. You can optionally specify a minimum and maximum instance count. Minimum capacity ensures that Application Gateway and WAF v2 do not fall below the minimum instance count specified even in absence of traffic. You will be billed for this minimum capacity even in absence of any traffic. You can also specify maximum instance count that ensures that the Application Gateway does not scale beyond the specified number of instances. You will continue to be billed for the amount of traffic served by the Gateway.
- **Manual** - You can alternatively choose Manual mode where the gateway will not autoscale. In this mode, if more traffic is sent than what Application Gateway or WAF is capable of handling, it could result in traffic loss. You must specify instance count with manual mode. Instance count can vary from 2 to 125 instances.

## Differences with v1 SKU

|Difference|Details|
|--|--|
|Authentication certificate|Not supported.<br>For more information, see [Overview of end to end SSL with Application Gateway](ssl-overview.md#end-to-end-ssl-with-the-v2-sku).|
|Mixing Standard_v2 and Standard Application Gateway on the same subnet|Not supported|
|User Defined Route (UDR) on Application Gateway subnet|Not supported|
|NSG for Inbound port range| - 65200 to 65535 for Standard_v2 SKU<br>- 65503 to 65534 for Standard SKU.<br>For more information, see the [FAQ](application-gateway-faq.md#are-network-security-groups-supported-on-the-application-gateway-subnet).|
|Performance logs in Azure diagnostics|Not supported.<br>Azure metrics should be used.|
|Billing|Billing to be announced on May 14, 2019|
|FIPS mode|These are currently not supported.|
|ILB only mode|This is currently not supported. Public and ILB mode together is supported.|
|Netwatcher integration|Not supported.|

## Next steps

- [Create an autoscaling, zone redundant application gateway with a reserved virtual IP address using Azure PowerShell](tutorial-autoscale-ps.md)
- Learn more about [Application Gateway](overview.md).
- Learn more about [Azure Firewall](../firewall/overview.md).