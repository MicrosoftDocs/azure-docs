---
title: Application Gateway deployment tiers
description: Learn about the Standard, Network Isolated, and Accelerated deployment tiers for Azure Application Gateway, and how to choose the right one.
services: application-gateway
author: reyjordi
ms.author: reyjordi
ms.service: azure-application-gateway
ms.topic: concept-article
ms.date: 11/11/2026
---

# Application Gateway deployment tiers

The deployment tier determines the underlying infrastructure for your Azure Application Gateway, including its platform, connectivity model, and scaling behavior. You select the tier when you create the gateway.

Deployment tiers also introduce new infrastructure improvements. Instead of changing the platform beneath your workloads, Azure offers new capabilities as a tier you can opt into. You can try them, share feedback, and adopt them at your own pace. Your input during preview helps shape each option before it becomes the standard experience.

Azure introduces Accelerated as a choice first, so you have time to get familiar with it before its planned transition to the default for eligible new gateways at general availability. Existing gateways continue to run unchanged, and in-place migration to Accelerated isn't available today. Choose the tier that fits your needs when you create the gateway.

> [!IMPORTANT]
> You can't change the deployment tier after the application gateway is created. To change tiers, deploy a new gateway with the tier you want and migrate your configuration.

## Standard

Standard runs on the current, generally available Application Gateway platform. Use it for most internet-facing and internal workloads, or when you want to continue using the existing infrastructure with no change to how your gateway is deployed.

- Requires a public frontend IP address, even if you use only a private listener.
- Azure manages the gateway through the `GatewayManager` service tag, so your network security group (NSG) must allow the required inbound traffic. For more information, see [Application Gateway infrastructure configuration](configuration-infrastructure.md).
- Requires outbound internet access from the Application Gateway subnet.

## Network isolated

Network isolated lets you create a private-only Application Gateway without registering the `EnableApplicationGatewayNetworkIsolation` flag. It removes the gateway's dependency on public management traffic, so you can lock down the subnet like any other workload subnet.

Use it when:

- Your security policy doesn't allow public IP addresses.
- You must route all outbound traffic through a firewall or network virtual appliance.
- You need a deny-all outbound NSG rule on the gateway subnet.

For network requirements and setup details, see [Private Application Gateway deployment](application-gateway-private-deployment.md?tabs=portal).

## Accelerated (preview)

Accelerated (Preview) is the new recommended Application Gateway deployment experience. The architecture supports public, private-only, and combined public-and-private connectivity without separate network registration. It delivers higher scale limits, sub-minute scale-out, and extended connection draining to adapt capacity as workload demands change.

Microsoft plans for Accelerated to become the default for eligible new deployments at general availability. Existing gateways remain unchanged.

> [!IMPORTANT]
> For Accelerated gateways, keep at least 10 IP addresses free in the gateway subnet when you create the Application Gateway.

### Limitations (preview)

The following capabilities aren't supported or are limited while the Accelerated tier is in preview:

- **In-place migration** of existing gateways to Accelerated isn't available. To use Accelerated, create a new gateway and select the Accelerated tier.
- **WAF tier** isn't supported.
- **FIPS mode** isn't supported.
- **TCP/TLS proxy** isn't supported.
- **Private Link** isn't supported.
- **NSG requirement:** Create an NSG rule that allows inbound traffic from the `AzureLoadBalancer` service tag to your listener ports.
- **Gateway health dashboard** isn't available.
- **Get certificate metadata API** isn't available.
- **On-demand backend health** isn't available.
- **Subnet sharing** isn't available.
- **Vertical scaling** isn't available during preview.
- **Other Application Gateway features currently in preview** aren't supported on the Accelerated tier.

> [!NOTE]
> These limitations apply to the preview release and are expected to change as Accelerated moves toward general availability. For legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Regional availability

Standard and Network Isolated are available in all regions where Application Gateway is available.

During preview, Accelerated is available only in the following regions:

- Australia Central
- Australia Southeast
- Canada Central
- Canada East
- Central India
- East Asia
- East US 3
- India South Central
- Indonesia Central
- Israel Central
- Japan West
- Jio India West
- Korea Central
- Malaysia West
- New Zealand North
- Northeast US 5
- Poland Central
- South Africa North
- South Central US 2
- Southeast US
- Southeast US 3
- Sweden Central
- West US 2

## Choose a deployment tier

| If you need... | Choose |
| --- | --- |
| A general-purpose gateway using the existing generally available infrastructure | Standard |
| No public IP address, forced tunneling of outbound traffic, or a deny-all outbound NSG rule | Network Isolated |
| Higher scale limits, faster scaling, and longer connection draining, with public, private-only, or combined public-and-private connectivity | Accelerated (Preview) |

## Try the Accelerated tier in the Azure portal

During preview, use the [Azure portal preview link](https://portal.azure.com/?microsoft_azure_hybridnetworking_appgwdeploymenttier=true) to access the deployment-tier selection. Create a new application gateway and select **Accelerated (Preview)** under **Deployment tier**.

The Accelerated tier is available only in [supported preview regions](#regional-availability). Existing gateways remain unchanged.

## Set the deployment tier in the Azure portal

Before you create an application gateway, review the [subnet requirements](quick-create-portal.md#create-a-resource-group-and-virtual-network).

1. Create a new application gateway in the [Azure portal](https://portal.azure.com). If you're trying Accelerated during preview, use the preview link above instead.
1. On the **Basics** tab, under **Deployment tier**, select **Standard**, **Network Isolated**, or **Accelerated (Preview)**.
1. Complete the remaining tabs, select **Review + create**, and then select **Create**.

## Next steps

- [Application Gateway configuration overview](configuration-overview.md)
- [Application Gateway infrastructure configuration](configuration-infrastructure.md)
- [Quickstart: Direct web traffic using the Azure portal](quick-create-portal.md)
