---
title: What is Azure Application Gateway v2?
description: Learn about Azure application Gateway v2 features.
services: application-gateway
author: greg-lindsay
ms.service: application-gateway
ms.topic: overview
ms.date: 04/30/2024
ms.author: greglin
ms.custom: references_regions
---

# What is Azure Application Gateway v2?

Application Gateway v2 is the latest version of Application Gateway. It provides advantages over Application Gateway v1 such as performance enhancements, autoscaling, zone redundancy, and static VIPs.

> [!IMPORTANT]
> Deprecation of Application Gateway V1 was [announced on April 28, 2023](v1-retirement.md). If you use Application Gateway V1 SKU, start planning your migration to V2 now and complete your migration to Application Gateway v2 by April 28, 2026. The v1 service isn't supported after this date.

## Key capabilities

The v2 SKU includes the following enhancements:

- **TCP/TLS proxy (Preview)**: Azure Application Gateway now also supports Layer 4 (TCP protocol) and TLS (Transport Layer Security) proxying. This feature is currently in public preview. For more information, see [Application Gateway TCP/TLS proxy overview](tcp-tls-proxy-overview.md).
- **Autoscaling**: Application Gateway or WAF deployments under the autoscaling SKU can scale out or in based on changing traffic load patterns. Autoscaling also removes the requirement to choose a deployment size or instance count during provisioning. This SKU offers true elasticity. In the Standard_v2 and WAF_v2 SKU, Application Gateway can operate both in fixed capacity (autoscaling disabled) and in autoscaling enabled mode. Fixed capacity mode is useful for scenarios with consistent and predictable workloads. Autoscaling mode is beneficial in applications that see variance in application traffic.
- **Zone redundancy**: An Application Gateway or WAF deployment can span multiple Availability Zones, removing the need to provision separate Application Gateway instances in each zone with a Traffic Manager. You can choose a single zone or multiple zones where Application Gateway instances are deployed, which makes it more resilient to zone failure. The backend pool for applications can be similarly distributed across availability zones.

  Zone redundancy is available only where Azure Zones are available. In other regions, all other features are supported. For more information, see [Regions and Availability Zones in Azure](../reliability/availability-zones-service-support.md)
- **Static VIP**: Application Gateway v2 SKU supports the static VIP type exclusively. Static VIP ensures that the VIP associated with the application gateway doesn't change for the lifecycle of the deployment, even after a restart. You must use the application gateway URL for domain name routing to App Services via the application gateway, as v1 doesn't have a static VIP.
- **Header Rewrite**: Application Gateway allows you to add, remove, or update HTTP request and response headers with v2 SKU. For more information, see [Rewrite HTTP headers with Application Gateway](./rewrite-http-headers-url.md)
- **Key Vault Integration**: Application Gateway v2 supports integration with Key Vault for server certificates that are attached to HTTPS enabled listeners. For more information, see [TLS termination with Key Vault certificates](key-vault-certs.md).
- **Mutual Authentication (mTLS)**: Application Gateway v2 supports authentication of client requests. For more information, see [Overview of mutual authentication with Application Gateway](mutual-authentication-overview.md).
- **Azure Kubernetes Service Ingress Controller**: The Application Gateway v2 Ingress Controller allows the Azure Application Gateway to be used as the ingress for an Azure Kubernetes Service (AKS) known as AKS Cluster. For more information, see [What is Application Gateway Ingress Controller](ingress-controller-overview.md).
- **Private link**: The v2 SKU offers private connectivity from other virtual networks in other regions and subscriptions by using private endpoints.
- **Performance enhancements**: The v2 SKU offers up to 5X better TLS offload performance as compared to the Standard/WAF SKU.
- **Faster deployment and update time**: The v2 SKU provides faster deployment and update time as compared to Standard/WAF SKU. The faster time also includes WAF configuration changes.

![Diagram of auto-scaling zone.](./media/application-gateway-autoscaling-zone-redundant/application-gateway-autoscaling-zone-redundant.png)

> [!NOTE]
> Some of the capabilities listed here are dependent on the SKU type.

## SKU types

Application Gateway v2 is available under two SKUs: 
- **Basic** (preview): The Basic SKU is designed for applications that have lower traffic and SLA requirements, and don't need advanced traffic management features. For information on how to register for the public preview of Application Gateway Basic SKU, see [Register for the preview](#register-for-the-preview).
- **Standard_v2 SKU**: The Standard_v2 SKU is designed for running production workloads and high traffic. It also includes auto scale that can automatically adjust the number of instances to match your traffic needs. 

The following table displays a comparison between Basic and Standard_v2.

|      Feature             | Capabilities                             | Basic SKU (preview)|   Standard SKU    |
|     :---:                | :---                                     |     :---:      |     :---:         |
| Reliability              | SLA                                      | 99.9           | 99.95             |
| Functionality - basic    | HTTP/HTTP2/HTTPS<br>Websocket<br>Public/Private IP<br>Cookie Affinity<br>Path-based affinity<br>Wildcard<br>Multisite<br>KeyVault<br>AKS (via AGIC)<br>Zone | &#x2713;<br>&#x2713;<br>&#x2713;<br>&#x2713;<br>&#x2713;<br>&#x2713;<br>&#x2713;<br>&#x2713;<br>&#x2713;<br>&#x2713;<br> | &#x2713;<br>&#x2713;<br>&#x2713;<br>&#x2713;<br>&#x2713;<br>&#x2713;<br>&#x2713;<br>&#x2713;<br>&#x2713;<br>&#x2713;|
| Functionality - advanced | URL rewrite<br>mTLS<br>Private Link<br>Private-only<sup>1</sup><br>TCP/TLS Proxy |  | &#x2713;<br>&#x2713;<br>&#x2713;<br>&#x2713;<br>&#x2713; |
| Scale                    | Max. connections per second<br>Number of listeners<br>Number of backend pools<br>Number of backend servers per pool<br>Number of rules | 200<sup>1</sup><br>5<br>5<br>5<br>5  | 62500<sup>1</sup><br>100<br>100<br>1200<br>400 |
| Capacity Unit            | Connections per second per compute unit<br>Throughput<br>Persistent new connections  | 10<br>2.22 Mbps<br>2500 | 50<br>2.22 Mbps<br>2500 |

<sup>1</sup>Estimated based on using an RSA 2048-bit key TLS certificate.

## Pricing

With the v2 SKU, consumption drives the pricing model and is no longer attached to instance counts or sizes. To learn more, see [Understanding pricing](understanding-pricing.md).

## Unsupported regions

Currently, the Standard_v2 and WAF_v2 SKUs aren't available in the following regions:

- UK North
- UK South 2
- China East
- China North
- US DOD East
- US DOD Central

## Migrate from v1 to v2

An Azure PowerShell script is available in the PowerShell gallery to help you migrate from your v1 Application Gateway/WAF to the v2 Autoscaling SKU. This script helps you copy the configuration from your v1 gateway. Traffic migration is still your responsibility. For more information, see [Migrate Azure Application Gateway from v1 to v2](migrate-v1-v2.md).

### Feature comparison between v1 SKU and v2 SKU

The following table compares the features available with each SKU.

| Feature                                           | v1 SKU   | v2 SKU   |
| ------------------------------------------------- | -------- | -------- |
| Autoscaling                                       |          | &#x2713; |
| Zone redundancy                                   |          | &#x2713; |
| Static VIP                                        |          | &#x2713; |
| Azure Kubernetes Service (AKS) Ingress controller |          | &#x2713; |
| Azure Key Vault integration                       |          | &#x2713; |
| Rewrite HTTP(S) headers                           |          | &#x2713; |
| Enhanced Network Control (NSG, Route Table, Private IP Frontend only) |   | &#x2713; |
| URL-based routing                                 | &#x2713; | &#x2713; |
| Multiple-site hosting                             | &#x2713; | &#x2713; |
| Mutual Authentication (mTLS)                      |          | &#x2713; |
| Private Link support                              |          | &#x2713; |
| Traffic redirection                               | &#x2713; | &#x2713; |
| Web Application Firewall (WAF)                    | &#x2713; | &#x2713; |
| WAF custom rules                                  |          | &#x2713; |
| WAF policy associations                           |          | &#x2713; |
| Transport Layer Security (TLS)/Secure Sockets Layer (SSL) termination | &#x2713; | &#x2713; |
| End-to-end TLS encryption                         | &#x2713; | &#x2713; |
| Session affinity                                  | &#x2713; | &#x2713; |
| Custom error pages                                | &#x2713; | &#x2713; |
| WebSocket support                                 | &#x2713; | &#x2713; |
| HTTP/2 support                                    | &#x2713; | &#x2713; |
| Connection draining                               | &#x2713; | &#x2713; |
| Proxy NTLM authentication                         | &#x2713; |          |
| Path based rule encoding                          | &#x2713; |          |
| DHE Ciphers                                       | &#x2713; |          |
> [!NOTE]
> The autoscaling v2 SKU now supports [default health probes](application-gateway-probe-overview.md#default-health-probe) to automatically monitor the health of all resources in its backend pool and highlight those backend members that are considered unhealthy. The default health probe is automatically configured for backends that don't have any custom probe configuration. To learn more, see [health probes in application gateway](application-gateway-probe-overview.md).

### Differences from the v1 SKU

This section describes features and limitations of the v2 SKU that differ from the v1 SKU.

|Difference|Details|
|--|--|
|Mixing Standard_v2 and Standard Application Gateway on the same subnet|Not supported|
|User-Defined Route (UDR) on Application Gateway subnet|For information about supported scenarios, see [Application Gateway configuration overview](configuration-infrastructure.md#supported-user-defined-routes).|
|NSG for Inbound port range| - 65200 to 65535 for Standard_v2 SKU<br>- 65503 to 65534 for Standard SKU.<br>Not required for v2 SKUs in public preview [Learn more](application-gateway-private-deployment.md).<br>For more information, see the [FAQ](application-gateway-faq.yml#are-network-security-groups-supported-on-the-application-gateway-subnet).|
|Performance logs in Azure diagnostics|Not supported.<br>Azure metrics should be used.|
|FIPS mode|Currently not supported.|
|Private frontend configuration only mode|Currently in public preview [Learn more](application-gateway-private-deployment.md).|
|Path based rule encoding |Not supported.<br> V2 decodes paths before routing. For example, V2 treats `/abc%2Fdef` the same as `/abc/def`. |
|Chunked file transfer |In the Standard_V2 configuration, turn off request buffering to support chunked file transfer. <br> In WAF_V2, turning off request buffering isn't possible because it has to look at the entire request to detect and block any threats. Therefore, the suggested alternative is to create a path rule for the affected URL and attach a disabled WAF policy to that path rule.|
|Cookie Affinity |Current V2 doesn't support appending the domain in session affinity Set-Cookie, which means that the cookie can't be used by client for the subdomains.|
|Microsoft Defender for Cloud integration|Not yet available.

## Register for the preview

Run the following Azure CLI commands to register for the preview of Application Gateway Basic SKU. 

```azurecli-interactive
Set-AzContext -Subscription "<your subscription ID>"
Get-AzProviderFeature -FeatureName AllowApplicationGatewayBasicSku -ProviderNamespace "Microsoft.Network"
Register-AzProviderFeature -FeatureName AllowApplicationGatewayBasicSku -ProviderNamespace Microsoft.Network 
```

## Unregister the preview

To unregister from the public preview of Basic SKU:

1. Delete all instances of Application Gateway Basic SKU from your subscription.
2. Run the following Azure CLI commands: 

```azurecli-interactive
Set-AzContext -Subscription "<your subscription ID>"
Get-AzProviderFeature -FeatureName AllowApplicationGatewayBasicSku -ProviderNamespace "Microsoft.Network"
Unregister-AzProviderFeature -FeatureName AllowApplicationGatewayBasicSku -ProviderNamespace Microsoft.Network 
```

## Next steps

Depending on your requirements and environment, you can create a test Application Gateway using either the Azure portal, Azure PowerShell, or Azure CLI.



- [Tutorial: Create an application gateway that improves web application access](tutorial-autoscale-ps.md)
- [Learn module: Introduction to Azure Application Gateway](/training/modules/intro-to-azure-application-gateway)
