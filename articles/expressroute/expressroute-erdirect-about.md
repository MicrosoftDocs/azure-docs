---
title: 'About Azure ExpressRoute Direct'
description: Learn about key features of Azure ExpressRoute Direct and information needed to onboard to ExpressRoute Direct, like available SKUs, and technical requirements.
services: expressroute
author: duongau
ms.service: azure-expressroute
ms.custom:
  - ignite-2023
ms.topic: concept-article
ms.date: 01/31/2025
ms.author: duau
---

# About ExpressRoute Direct

ExpressRoute Direct gives you the ability to connect directly into the Microsoft global network at peering locations strategically distributed around the world. ExpressRoute Direct provides dual 100-Gbps or 10-Gbps connectivity that supports active-active connectivity at scale. You can work with any service provider to set up ExpressRoute Direct.

Key features include, but not limited to:

* Large data ingestion into services like Azure Storage and Azure Cosmos DB.
* Physical isolation for industries that regulates and require dedicated or isolated connectivity such as banks, government, and retail companies.
* Granular control of circuit distribution based on business unit.

## Onboard to ExpressRoute Direct

Before you can set up ExpressRoute Direct, you must first enroll your subscription. Run the following commands using Azure PowerShell:

1.  Sign in to Azure and select the subscription you wish to enroll.

    ```azurepowershell-interactive
    Connect-AzAccount 

    Select-AzSubscription -Subscription "<SubscriptionID or SubscriptionName>"
    ```

1. Register your subscription to **AllowExpressRoutePorts** using the following command:

    ```azurepowershell-interactive
    Register-AzProviderFeature -FeatureName AllowExpressRoutePorts -ProviderNamespace Microsoft.Network
    ```

Once enrolled, verify that **Microsoft.Network** resource provider is registered to your subscription. Registering a resource provider configures your subscription to work with the resource provider.

1. Access your subscription settings as described in [Azure resource providers and types](../azure-resource-manager/management/resource-providers-and-types.md).

1. In your subscription, for **Resource Providers**, verify **Microsoft.Network** provider shows a **Registered** status. If the Microsoft.Network resource provider isn't present in the list of registered providers, add it.

If you start using ExpressRoute Direct and find that ports at your selected peering location are unavailable, submit a support ticket to request more inventories.

## ExpressRoute using a service provider and ExpressRoute Direct

| ExpressRoute using a service provider | ExpressRoute Direct | 
| --- | --- |
| Uses a service provider to enable fast onboarding and connectivity into existing infrastructure | Requires 100-Gbps or 10-Gbps infrastructure and full management of all layers. |
| Integrates with hundreds of providers including Ethernet and MPLS | Direct and Dedicated capacity for regulated industries and large data ingestion. |
| Circuits SKUs ranging from 50 Mbps to 10 Gbps | You can select a combination of the following circuit SKUs on 100-Gbps ExpressRoute Direct: <ul><li>5 Gbps</li><li>10 Gbps</li><li>40 Gbps</li><li>100 Gbps</li></ul> You can select a combination of the following circuit SKUs on 10-Gbps ExpressRoute Direct:<ul><li>1 Gbps</li><li>2 Gbps</li><li>5 Gbps</li><li>10 Gbps</li></ul> |
| Optimized for a single tenant | Optimized for single tenant with multiple business units and multiple work environments. |

## ExpressRoute Direct circuits

Azure ExpressRoute allows you to extend your on-premises network into the Microsoft cloud over a private connection made possible through a connectivity provider. With ExpressRoute, you can establish connections to Microsoft cloud services, such as Microsoft Azure, and Microsoft 365.

Each peering location has access to the Microsoft global network and can access any region in a geopolitical zone by default. You can access any global regions when you set up a premium circuit.  

The functionality in most scenarios is equivalent to circuits that use an ExpressRoute service provider to operate. To support further granularity and new capabilities offered using ExpressRoute Direct, there are certain key capabilities that exist only with ExpressRoute Direct circuits.

You can enable or disable rate limiting for ExpressRoute Direct circuits at the circuit level. For more information, see [Rate limiting for ExpressRoute Direct circuits](rate-limit.md).

## Circuit SKUs

ExpressRoute Direct supports large data ingestion scenarios into services such as Azure storage. ExpressRoute circuits  with 100-Gbps ExpressRoute Direct also support **40 Gbps** and **100 Gbps** circuit bandwidth. The physical port pairs are **100 Gbps or 10 Gbps** only and can have multiple virtual circuits. 

### Circuit sizes

| 100-Gbps ExpressRoute Direct | 10-Gbps ExpressRoute Direct | 
| --- | --- |
| Subscribed Bandwidth: 200 Gbps | Subscribed Bandwidth: 20 Gbps |
| <ul><li>5 Gbps</li><li>10 Gbps</li><li>40 Gbps</li><li>100 Gbps</li></ul> | <ul><li>1 Gbps</li><li>2 Gbps</li><li>5 Gbps</li><li>10 Gbps</li></ul>

> [!NOTE]
> You can create logical ExpressRoute circuits on top of your selected ExpressRoute Direct resource of 10-Gbps or 100-Gbps up to the subscribed Bandwidth of 20 Gbps or 200 Gbps. For example, you can create two 10-Gbps ExpressRoute circuits within a single 10-Gbps ExpressRoute Direct resource (port pair).

## Technical Requirements

* Microsoft Enterprise Edge Router (MSEE) Interfaces:
    * Dual 10 Gigabit or 100-Gigabit Ethernet ports only across router pair
    * Single Mode LR Fiber connectivity
      * MSEE supports QSFP-100G-LR-4 for 100 Gbps (Use compatible optics on your devices) 
    * IPv4 and IPv6
    * IP MTU 1,500 bytes

* Switch/Router Layer 2/Layer three Connectivity:
    * Must support 1 802.1Q (Dot1Q) tag or two Tag 802.1Q (QinQ) tag encapsulation
    * Ethertype = 0x8100
    * Must add the outer VLAN tag (STAG) based on the VLAN ID specified by Microsoft - *applicable only on QinQ*
    * Must support multiple BGP sessions (VLANs) per port and device
    * IPv4 and IPv6 connectivity. *IPv6 address is added to existing subinterface*. 
    * Optional: [Bidirectional Forwarding Detection (BFD)](./expressroute-bfd.md) support, which is configured by default on all Private Peerings on ExpressRoute circuits
 
> [!NOTE]
> ExpressRoute Direct doesn't support Link Aggregation Control Protocol (LACP) or Multi-Chassis Link Aggregation (MLAG)

## VLAN Tagging

ExpressRoute Direct supports both QinQ and Dot1Q VLAN tagging.

* **QinQ VLAN Tagging** allows for isolated routing domains on a per ExpressRoute circuit basis. Azure dynamically gives an S-Tag at circuit creation that can't be changed. Each peering on the circuit (Private and Microsoft) uses a unique C-Tag as the VLAN. The C-Tag isn't required to be unique across circuits on the ExpressRoute Direct ports.

* **Dot1Q VLAN Tagging** allows for a single tagged VLAN on a per ExpressRoute Direct port pair basis. A C-Tag used on a peering must be unique across all circuits and peerings on the ExpressRoute Direct port pair.

## Workflows

### Set up ExpressRoute Direct

:::image type="content" source="./media/expressroute-erdirect-about/set-up-workflow.png" alt-text="Diagram of the ExpressRoute Direct setup workflow." lightbox="./media/expressroute-erdirect-about/set-up-workflow-expanded.png":::

### Delete ExpressRoute Direct

:::image type="content" source="./media/expressroute-erdirect-about/delete-workflow.png" alt-text="Diagram of the ExpressRoute Direct delete workflow." lightbox="./media/expressroute-erdirect-about/delete-workflow-expanded.png":::

## SLA

ExpressRoute Direct provides the same enterprise-grade SLA with Active/Active redundant connections into the Microsoft Global Network. ExpressRoute infrastructure is redundant and connectivity into the Microsoft Global Network is redundant and diverse and scales correctly with customer requirements. For more information, see [ExpressRoute SLA](https://azure.microsoft.com/support/legal/sla/expressroute/v1_3/).

## Pricing

For details on how ExpressRoute Direct is billed, see [ExpressRoute FAQ](expressroute-faqs.md#when-does-billing-start-and-stop-for-the-expressroute-direct-port-pairs). For pricing details, see [ExpressRoute pricing](https://azure.microsoft.com/pricing/details/expressroute/).

## Next steps

- Learn how to [configure ExpressRoute Direct](expressroute-howto-erdirect.md).
- Learn how to [Enable Rate limiting for ExpressRoute Direct circuits](rate-limit.md).
