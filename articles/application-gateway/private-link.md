---
title: Azure Application Gateway Private Link
description: This article is an overview of Application Gateway Private Link.
services: application-gateway
author: mbender-ms
ms.service: azure-application-gateway
ms.topic: concept-article
ms.date: 08/19/2026
ms.author: mbender

# Customer intent: "As a network administrator, I want to implement Private Link for Application Gateway, so that I can securely connect my workloads over a private network while maintaining the benefits of Layer 7 load balancing."
---

# Application Gateway Private Link

Today, you can deploy your critical workloads securely behind Application Gateway, gaining the flexibility of Layer 7 load balancing features. Access to the backend workloads is possible in two ways:

- Public IP address - your workloads are accessible over the Internet. 
- Private IP address- your workloads are accessible privately via your virtual network / connected networks

Private Link for Application Gateway allows you to connect workloads over a private connection spanning across VNets and subscriptions. When configured, a private endpoint is placed into a defined virtual network's subnet, providing a private IP address for clients looking to communicate to the gateway. For a list of other PaaS services that support Private Link functionality, see [What is Azure Private Link](../private-link/private-link-overview.md).

:::image type="content" source="media/private-link/private-link.png" alt-text="Diagram showing Application Gateway Private Link":::

## Features and capabilities

Private Link allows you to extend private connectivity to Application Gateway via a Private Endpoint in the following scenarios:
-	VNet in the same or different region from Application Gateway
-	VNet in the same or different subscription from Application Gateway
-	VNet in the same or different subscription and the same or different Microsoft Entra tenant from Application Gateway

You may also choose to block inbound public (Internet) access to Application Gateway and allow access only via private endpoints. Inbound management traffic still needs to be allowed to application gateway. For more information, see [Application Gateway infrastructure configuration](configuration-infrastructure.md#network-security-groups)

All features supported by Application Gateway are supported when accessed through a private endpoint, including support for AGIC.

> [!NOTE]
> If your client application connects to App Gateway via a private IP, requires an idle timeout greater > than 4 minutes, and the client application does not send TCP keep-alive packets, contact > agprivateip-keepalive@microsoft.com to request initiation of keep‑alive from Application Gateway.

## Identify traffic from a private endpoint

When an HTTP or HTTPS request reaches Application Gateway through a private endpoint, Azure Private Link provides a `LINKID` value in the TCP Proxy Protocol v2 header. The identifier distinguishes private endpoint connections, including connections from consumers that use overlapping IP address spaces. Application Gateway converts the `LINKID` from its hexadecimal, little-endian representation to a decimal value and exposes it in the following locations:

| Location | Name | Description |
| --- | --- | --- |
| Request forwarded to the backend | `X-Azure-PrivateEndpoint-ID` | Application Gateway adds this header before forwarding the request. Its value is the decimal private endpoint link identifier, for example, `123456`. |
| Application Gateway access log | `LinkId` | Contains the same decimal link identifier as a string value. For more information, see [Access log category](monitor-application-gateway-reference.md#access-log-category). |

For example, a backend receives the following header for a request that arrived through a private endpoint:

```http
X-Azure-PrivateEndpoint-ID: 123456
```

> [!NOTE]
> Despite its name, `X-Azure-PrivateEndpoint-ID` doesn't contain the Azure resource ID of the private endpoint. It contains the decimal value of the private endpoint connection's `linkIdentifier` property.
>
> The `X-Azure-PrivateEndpoint-ID` HTTP header applies to Layer 7 HTTP and HTTPS traffic. It isn't added to Layer 4 TCP/TLS proxy traffic.

Compare either value with the `linkIdentifier` property of the corresponding private endpoint connection in Azure Resource Manager. This comparison lets you associate backend requests and access-log records with a specific private endpoint connection for auditing or access-control decisions.

Application Gateway populates the header and access-log property only for requests received through a private endpoint. For requests sent directly to an Application Gateway public or private frontend IP address, Application Gateway doesn't populate `X-Azure-PrivateEndpoint-ID` or `LinkId`. This behavior applies when the Private Link configuration is associated with either a public or a private Application Gateway frontend.

For more information about the `LINKID` value in TCP Proxy Protocol v2, see [Get connection information using TCP Proxy v2](../private-link/private-link-service-overview.md#getting-connection-information-using-tcp-proxy-v2).

## Private Link components

Four components are required to implement Private Link with Application Gateway:

- Application Gateway Private Link Configuration

   A Private link configuration can be associated with an Application Gateway Frontend IP address, which is then used to establish a connection using a Private Endpoint. If there's no association to an Application Gateway frontend IP address, then the Private Link feature isn't enabled.

- Application Gateway Frontend IP address

   The public or private IP address where the Application Gateway Private Link Configuration needs to be associated to enable the Private Link Capabilities.

- Private Endpoint

   An Azure network resource that allocates a private IP address in your VNet address space. It's used to connect to the Application Gateway via the private IP address similar to many other Azure Services that provide private link access; for example, Storage and KeyVault. 

- Private Endpoint Connection

   A connection on Application Gateway originated by Private Endpoints. You can autoapprove, manually approve, or reject connections to grant or deny access.

## Pricing

| Component | Service Provider/Private Link (Application Gateway resource owner)  | Consumer/Private Endpoint | 
| ---------- | ---------- | ---------- |
| **Private link service** | No charges | Not applicable | 
| **Private endpoint** | Not applicable | [Billed as per Private Link](https://azure.microsoft.com/pricing/details/private-link/#pricing) | 
| **Data processing (Bi-directional)** | No charges | [Billed as per Private Link](https://azure.microsoft.com/pricing/details/private-link/#pricing) | 
| **Data transfers** | [Billed as per Bandwidth](https://azure.microsoft.com/pricing/details/bandwidth/#pricing) | [Billed as per Bandwidth](https://azure.microsoft.com/pricing/details/bandwidth/#pricing) | 


## Limitations
- API version 2020-03-01 or later should be used to configure Private Link configurations.
- Static IP allocation method in the Private Link Configuration object isn't supported.
- The subnet used for PrivateLinkConfiguration can't be same as the Application Gateway subnet.
- Private link configuration for Application Gateway doesn't expose the "Alias" property and must be referenced via resource URI.
- Private Endpoint creation doesn't create a \*.privatelink DNS record or zone. All DNS records should be entered in existing zones used for your Application Gateway.
- Private Link Configuration for Application Gateway has an idle timeout of ~5 minutes (300 seconds). To avoid hitting this limit, applications connecting through private endpoints to Application Gateway must use TCP keepalive intervals of less than 300 seconds.

## Next steps

- [Configure Azure Application Gateway Private Link](private-link-configure.md).
- [What is Azure Private Link](../private-link/private-link-overview.md).
