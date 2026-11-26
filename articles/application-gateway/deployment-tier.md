---
title: Application Gateway deployment tiers
description: Learn about the Standard, Network Isolated, and Accelerated deployment tiers for Azure Application Gateway, and how to choose the right one.
services: application-gateway
author: reyjordi
ms.author: reyjordi
ms.service: azure-application-gateway
ms.topic: concept-article
ms.date: 11/25/2026
---

# Application Gateway deployment tiers

When you create a gateway, you first select its SKU (Standard_v2 or WAF_v2), and then select its deployment tier. The deployment tier determines the gateway's network configuration and how it scales. The choice of deployment tier doesn't affect pricing. Feature availability for your selected SKU is the same across deployment tiers, except as noted in the following table.

| Tier | What it is | Choose it when | Features and regions |
| --- | --- | --- | --- |
| **Standard (default)** | The deployment tier most application gateways run on today, with a public IP address and an optional private IP address. | Your gateway can have a public IP address, and you want to keep the deployment model you use today. | All features. All regions. |
| **Network Isolated** | A platform that doesn't require a public IP address and supports private-only or public-and-private frontends. You can apply a deny-all outbound NSG rule and route all outbound traffic through a firewall or NVA with a UDR. | Your security or compliance requirements don't allow public IP addresses or unrestricted outbound internet access. | All features except Private Link. All regions. See [Private Application Gateway deployment](application-gateway-private-deployment.md). |
| **Accelerated (preview)** | A next-generation platform with the same network isolation capabilities as Network Isolated, built on a modern underlying architecture. It provides faster autoscaling and provisioning, higher scale, and seamless application connectivity during scale-out and scale-in. [Try the Accelerated tier in the Azure portal](#try-the-accelerated-tier-in-the-azure-portal). | Your workloads experience fluctuating traffic patterns and benefit from rapid scale-out, or your applications use long-running connections that require extra drain time during scale-in, so that the clients aren't disrupted. | WAF and Private Link aren't available during preview. For the full list, see [Feature availability during preview](#feature-availability-during-preview). Available in select preview regions. See [Regional availability during preview](#regional-availability). |

> [!IMPORTANT]
> Changing the deployment tier of an existing gateway isn't supported yet. To move to another tier, create a new gateway and migrate its configuration.

## Set the deployment tier in the Azure portal

Before you create an application gateway, review the [subnet requirements](quick-create-portal.md#create-a-resource-group-and-virtual-network).

1. **Create a new application gateway.** To use Accelerated, start from the [Azure portal preview link](https://portal.azure.com/?microsoft_azure_hybridnetworking_appgwdeploymenttier=true).
1. **Select the deployment tier.** On the **Basics** tab, choose **Standard**, **Network Isolated**, or **Accelerated (Preview)** under **Deployment tier**.
1. **Complete the remaining configuration.** Review the settings, select **Review + create**, and then select **Create**.

## Accelerated (preview)

Accelerated is the next-generation Application Gateway platform. It delivers sub-minute scale-out, extended connection draining, higher scale, and support for public, private-only, or combined public-and-private connectivity. Accelerated uses the same Application Gateway billing model, so selecting the tier doesn't change how the gateway is billed.

### Feature availability during preview

The Accelerated tier supports the Standard tier feature set except the following capabilities, which are unavailable during preview: Web Application Firewall (WAF), Private Link, FIPS mode, TCP/TLS proxy, the gateway health dashboard, the Get Certificate Metadata API, on-demand backend health, subnet sharing, and other Application Gateway features that are currently in preview.

## Regional availability

Standard and Network Isolated are available in all regions where Application Gateway is available.

During preview, Accelerated is available in these regions:

| Region | Region | Region |
| --- | --- | --- |
| Australia Central | Australia Southeast | Canada Central |
| Canada East | Central India | East Asia |
| India South Central | Indonesia Central | Israel Central |
| Japan West | Jio India West | Korea Central |
| Malaysia West | New Zealand North | Poland Central |
| South Africa North | Southeast Asia | Spain Central |
| Sweden Central | West Central US | West US 2 |

> [!NOTE]
> These limitations apply only during preview. Microsoft is working to add support for these features before general availability. For legal terms that apply to Azure preview features, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prepare to deploy Accelerated

- **Plan the subnet:** Keep at least 10 IP addresses available in the Application Gateway subnet when you create an Accelerated gateway.
- **Configure network security:** In your network security group (NSG), allow inbound traffic from your client IP address ranges to your listener ports.

## Try the Accelerated tier in the Azure portal

1. During preview, use the [Azure portal preview link](https://portal.azure.com/?microsoft_azure_hybridnetworking_appgwdeploymenttier=true) to access Accelerated deployment-tier selection.
1. Create a new application gateway. On the **Basics** tab, under **Deployment tier**, select **Accelerated (Preview)**.
1. Choose a [supported preview region](#regional-availability).

Accelerated is currently available only in supported preview regions.

## Next steps

- [Application Gateway configuration overview](configuration-overview.md)
- [Application Gateway infrastructure configuration](configuration-infrastructure.md)
- [Quickstart: Direct web traffic using the Azure portal](quick-create-portal.md)
