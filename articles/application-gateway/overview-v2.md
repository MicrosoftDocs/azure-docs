---
title: What is Azure Application Gateway v2?
description: Learn about Azure application Gateway v2 features
services: application-gateway
author: greg-lindsay
ms.service: application-gateway
ms.topic: overview
ms.date: 04/19/2023
ms.author: greglin
ms.custom: references_regions
---

# What is Azure Application Gateway v2?

Application Gateway is available under a Standard_v2 SKU. Web Application Firewall (WAF) is available under a WAF_v2 SKU. The v2 SKU offers performance enhancements and adds support for critical new features like autoscaling, zone redundancy, and support for static VIPs. Existing features under the Standard and WAF SKU continue to be supported in the new v2 SKU, with a few exceptions listed in [comparison](#differences-from-v1-sku) section.

The new v2 SKU includes the following enhancements:

- **Autoscaling**: Application Gateway or WAF deployments under the autoscaling SKU can scale out or in based on changing traffic load patterns. Autoscaling also removes the requirement to choose a deployment size or instance count during provisioning. This SKU offers true elasticity. In the Standard_v2 and WAF_v2 SKU, Application Gateway can operate both in fixed capacity (autoscaling disabled) and in autoscaling enabled mode. Fixed capacity mode is useful for scenarios with consistent and predictable workloads. Autoscaling mode is beneficial in applications that see variance in application traffic.
- **Zone redundancy**: An Application Gateway or WAF deployment can span multiple Availability Zones, removing the need to provision separate Application Gateway instances in each zone with a Traffic Manager. You can choose a single zone or multiple zones where Application Gateway instances are deployed, which makes it more resilient to zone failure. The backend pool for applications can be similarly distributed across availability zones.

  Zone redundancy is available only where Azure Zones are available. In other regions, all other features are supported. For more information, see [Regions and Availability Zones in Azure](../reliability/availability-zones-service-support.md)
- **Static VIP**: Application Gateway v2 SKU supports the static VIP type exclusively. This ensures that the VIP associated with the application gateway doesn't change for the lifecycle of the deployment, even after a restart.  There isn't a static VIP in v1, so you must use the application gateway URL instead of the IP address for domain name routing to App Services via the application gateway.
- **Header Rewrite**: Application Gateway allows you to add, remove, or update HTTP request and response headers with v2 SKU. For more information, see [Rewrite HTTP headers with Application Gateway](./rewrite-http-headers-url.md)
- **Key Vault Integration**: Application Gateway v2 supports integration with Key Vault for server certificates that are attached to HTTPS enabled listeners. For more information, see [TLS termination with Key Vault certificates](key-vault-certs.md).
- **Mutual Authentication (mTLS)**: Application Gateway v2 supports authentication of client requests. For more information, see [Overview of mutual authentication with Application Gateway](mutual-authentication-overview.md).
- **Azure Kubernetes Service Ingress Controller**: The Application Gateway v2 Ingress Controller allows the Azure Application Gateway to be used as the ingress for an Azure Kubernetes Service (AKS) known as AKS Cluster. For more information, see [What is Application Gateway Ingress Controller?](ingress-controller-overview.md).
- **Private link**: The v2 SKU offers private connectivity from other virtual networks in other regions and subscriptions through the use of private endpoints.
- **Performance enhancements**: The v2 SKU offers up to 5X better TLS offload performance as compared to the Standard/WAF SKU.
- **Faster deployment and update time** The v2 SKU provides faster deployment and update time as compared to Standard/WAF SKU. This also includes WAF configuration changes.

![Diagram of auto-scaling zone.](./media/application-gateway-autoscaling-zone-redundant/application-gateway-autoscaling-zone-redundant.png)

## Unsupported regions

The Standard_v2 and WAF_v2 SKU is not currently available in the following regions:

- UK North
- UK South2
- China East
- China North
- US DOD East
- US DOD Central

## Pricing

With the v2 SKU, the pricing model is driven by consumption and is no longer attached to instance counts or sizes. The v2 SKU pricing has two components:

- **Fixed price** - This is hourly (or partial hour) price to provision a Standard_v2 or WAF_v2 Gateway. Please note that 0 additional minimum instances still ensures high availability of the service which is always included with fixed price.
- **Capacity Unit price** - This is a consumption-based cost that is charged in addition to the fixed cost. Capacity unit charge is also computed hourly or partial hourly. There are three dimensions to capacity unit - compute unit, persistent connections, and throughput. Compute unit is a measure of processor capacity consumed. Factors affecting compute unit are TLS connections/sec, URL Rewrite computations, and WAF rule processing. Persistent connection is a measure of established TCP connections to the application gateway in a given billing interval. Throughput is average Megabits/sec processed by the system in a given billing interval.  The billing is done at a Capacity Unit level for anything above the reserved instance count.

Each capacity unit is composed of at most: 1 compute unit, 2500 persistent connections, and 2.22-Mbps throughput.

To learn more, see [Understanding pricing](understanding-pricing.md).

## Feature comparison between v1 SKU and v2 SKU

The following table compares the features available with each SKU.

| Feature                                           | v1 SKU   | v2 SKU   |
| ------------------------------------------------- | -------- | -------- |
| Autoscaling                                       |          | &#x2713; |
| Zone redundancy                                   |          | &#x2713; |
| Static VIP                                        |          | &#x2713; |
| Azure Kubernetes Service (AKS) Ingress controller |          | &#x2713; |
| Azure Key Vault integration                       |          | &#x2713; |
| Rewrite HTTP(S) headers                           |          | &#x2713; |
| Enhanced Network Control (NSG, Route Table, Private IP Frontend only) |          | &#x2713; |
| URL-based routing                                 | &#x2713; | &#x2713; |
| Multiple-site hosting                             | &#x2713; | &#x2713; |
| Mutual Authentication (mTLS)                      |          | &#x2713; |
| Private Link support                              |          | &#x2713; |
| Traffic redirection                               | &#x2713; | &#x2713; |
| Web Application Firewall (WAF)                    | &#x2713; | &#x2713; |
| WAF custom rules                                  |          | &#x2713; |
| WAF policy associations                           |          | &#x2713; |
| Transport Layer Security (TLS)/Secure Sockets Layer (SSL) termination            | &#x2713; | &#x2713; |
| End-to-end TLS encryption                         | &#x2713; | &#x2713; |
| Session affinity                                  | &#x2713; | &#x2713; |
| Custom error pages                                | &#x2713; | &#x2713; |
| WebSocket support                                 | &#x2713; | &#x2713; |
| HTTP/2 support                                    | &#x2713; | &#x2713; |
| Connection draining                               | &#x2713; | &#x2713; |
| Proxy NTLM authentication                         | &#x2713; |          |

> [!NOTE]
> The autoscaling v2 SKU now supports [default health probes](application-gateway-probe-overview.md#default-health-probe) to automatically monitor the health of all resources in its backend pool and highlight those backend members that are considered unhealthy. The default health probe is automatically configured for backends that don't have any custom probe configuration. To learn more, see [health probes in application gateway](application-gateway-probe-overview.md).

## Differences from v1 SKU

This section describes features and limitations of the v2 SKU that differ from the v1 SKU.

|Difference|Details|
|--|--|
|Mixing Standard_v2 and Standard Application Gateway on the same subnet|Not supported|
|User-Defined Route (UDR) on Application Gateway subnet|For information about supported scenarios, see [Application Gateway configuration overview](configuration-infrastructure.md#supported-user-defined-routes).|
|NSG for Inbound port range| - 65200 to 65535 for Standard_v2 SKU<br>- 65503 to 65534 for Standard SKU.<br>Not required for v2 SKUs in public preview [Learn more](application-gateway-private-deployment.md).<br>For more information, see the [FAQ](application-gateway-faq.yml#are-network-security-groups-supported-on-the-application-gateway-subnet).|
|Performance logs in Azure diagnostics|Not supported.<br>Azure metrics should be used.|
|FIPS mode|Currently not supported.|
|Private frontend configuration only mode|Currently in public preview [Learn more](application-gateway-private-deployment.md).|
|Microsoft Defender for Cloud integration|Not yet available.

## Migrate from v1 to v2

An Azure PowerShell script is available in the PowerShell gallery to help you migrate from your v1 Application Gateway/WAF to the v2 Autoscaling SKU. This script helps you copy the configuration from your v1 gateway. Traffic migration is still your responsibility. For more information, see [Migrate Azure Application Gateway from v1 to v2](migrate-v1-v2.md).

## Next steps

Depending on your requirements and environment, you can create a test Application Gateway using either the Azure portal, Azure PowerShell, or Azure CLI.

- [Tutorial: Create an application gateway that improves web application access](tutorial-autoscale-ps.md)
- [Learn module: Introduction to Azure Application Gateway](/training/modules/intro-to-azure-application-gateway)
