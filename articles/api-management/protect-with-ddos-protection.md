---
title: Defend API Management against DDoS attacks 
description: Learn how to protect your API Management instance in an external virtual network against volumetric and protocol DDoS attacks by using Azure DDoS Protection.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: how-to
ms.date: 01/24/2023
ms.author: danlep
---
# Defend your Azure API Management instance against DDoS attacks

This article shows how to defend your Azure API Management instance against distributed denial of service (DDoS) attacks by enabling [Azure DDoS Protection](../ddos-protection/ddos-protection-overview.md). Azure DDoS Protection provides enhanced DDoS mitigation features to defend against volumetric and protocol DDoS attacks.​

[!INCLUDE [ddos-waf-recommendation](../../includes/ddos-waf-recommendation.md)]

[!INCLUDE [premium-dev.md](../../includes/api-management-availability-premium-dev.md)]

## Supported configurations

Enabling Azure DDoS Protection for API Management is supported only for instances **deployed (injected) in a VNet** in [external mode](api-management-using-with-vnet.md) or [internal mode](api-management-using-with-internal-vnet.md).

* External mode - All API Management endpoints are protected
* Internal mode - Only the management endpoint accessible on port 3443 is protected

### Unsupported configurations

* Instances that aren't VNet-injected
* Instances configured with a [private endpoint](private-endpoint.md)


## Prerequisites

* An API Management instance
    * The instance must be deployed in an Azure VNet in [external mode](api-management-using-with-vnet.md) or [internal mode](api-management-using-with-internal-vnet.md).
    * The instance must be configured with an Azure public IP address resource, which is supported only on the API Management `stv2` [compute platform](compute-infrastructure.md). 
        > [!NOTE]
        > If the instance is hosted on the `stv1` platform, you must [migrate](compute-infrastructure.md#how-do-i-migrate-to-the-stv2-platform) to the `stv2` platform.
* An Azure DDoS Protection [plan](../ddos-protection/manage-ddos-protection.md)
    * The plan you select can be in the same, or different, subscription than the virtual network and the API Management instance. If the subscriptions differ, they must be associated to the same Azure Active Directory tenant.
    * You may use a plan created using either the Network DDoS protection SKU or IP DDoS Protection SKU (preview). See [Azure DDoS Protection SKU Comparison](../ddos-protection/ddos-protection-sku-comparison.md).

        > [!NOTE]
        > Azure DDoS Protection plans incur additional charges. For more information, see [Pricing](https://azure.microsoft.com/pricing/details/ddos-protection/).
     
## Enable DDoS Protection

Depending on the DDoS Protection plan you use, enable DDoS protection on the virtual network used for your API Management instance, or the IP address resource configured for your virtual network.

### Enable DDoS Protection on the virtual network used for your API Management instance

1. In the [Azure portal](https://portal.azure.com), navigate to the VNet where your API Management is injected.
1. In the left menu, under **Settings**, select **DDoS protection**.
1. Select **Enable**, and then select your **DDoS protection plan**.
1. Select **Save**.

    :::image type="content" source="media/protect-with-ddos-protection/enable-ddos-protection.png" alt-text="Screenshot of enabling a DDoS Protection plan on a VNet in the Azure portal.":::

### Enable DDoS protection on the API Management public IP address

If your plan uses the IP DDoS Protection SKU, see [Enable DDoS IP Protection for a public IP address](../ddos-protection/manage-ddos-protection-powershell-ip.md#disable-ddos-ip-protection-for-an-existing-public-ip-address).

## Next steps

* Learn how to verify DDoS protection of your API Management instance by [testing with simulation partners](../ddos-protection/test-through-simulations.md)
* Learn how to [view and configure Azure DDoS Protection telemetry](../ddos-protection/telemetry.md)
