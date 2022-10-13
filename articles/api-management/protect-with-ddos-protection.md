---
title: Defend API Management against DDoS attacks 
description: Learn how to protect your API Management instance in an external virtual network against volumetric and protocol DDoS attacks by using Azure DDoS Protection Standard.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: how-to
ms.date: 10/13/2022
ms.author: danlep
---
# Defend your Azure API Management instance against DDoS attack

This article shows how to defend your Azure API Management instance against distributed denial of service (DDoS) attacks using [Azure DDoS Protection](../ddos-protection/ddos-protection-overview.md). Azure DDoS Protection provides enhanced DDoS mitigation features to defend against volumetric and protocol DDoS attacks.​

[!INCLUDE [premium-dev.md](../../includes/api-management-availability-premium-dev.md)]

## Limitations

Enabling Azure DDoS Protection for API Management is available only for instances deployed (injected) in a VNet in [external mode](api-management-using-with-vnet.md).

DDoS Protection can't be enabled for the following API Management configurations:

* Instances that aren't VNet injected
* Instances deployed in a VNet in [internal mode](api-management-using-with-internal-vnet.md)
* Instances configured with a [private endpoint](private-endpoint.md)

## Prerequisites

* An API Management instance
    * The instance must be deployed in an Azure VNet in [external mode](api-management-using-with-vnet.md) 
    * The instance to be configured with an Azure public IP address resource, which is supported only on the API Management `stv2` [compute platform](compute-infrastructure.md). 
    * If the instance is hosted on the `stv1` platform, you must [migrate](compute-infrastructure.md#how-do-i-migrate-to-the-stv2-platform) to the `stv2` platform.
* An Azure DDoS Protection plan
    * The plan you select can be in the same, or different, subscription than the virtual network and the API Management instance. If the subscriptions differ, they must be associated to the same Azure Active Directory ten
    * [TODO: Which DDoS SKUs are supported? Network and/or IP?]

        > [!NOTE]
        > Azure DDoS Protection plans incur additional charges. For more information, see [Pricing]().
     
## Enable DDoS Protection on the VNet

Enable DDoS Protection on the virtual network used for your API Management instance.

1. In the [Azure portal](https://portal.azure.com), navigate to the VNet where your API Management is injected.
1. In the left menu, under **Settings**, select **DDoS protection**.
1. Select **Enable**, and then select your Azure DDoS Protection plan.
1. Select **Save**.

    :::image type="content" source="media/protect-with-ddos-protection/enable-ddos-protection.png" alt-text="Screenshot of enabling a DDoS Protection plan on a VNet in the Azure portal.":::
## Next steps

* Learn how to verify DDoS protection of your API Management instance by [testing with simulation partners](../ddos-protection/test-through-simulations.md)
* Learn how to [view and configure Azure DDoS Protection telemetry](../ddos-protection/telemetry.md)
