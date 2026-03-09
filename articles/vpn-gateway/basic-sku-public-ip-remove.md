---
title: Remove the Basic Public IP Reference from a Basic SKU VPN Gateway - Azure portal
description: Learn how to remove the Basic public IP resource reference from an existing Basic SKU VPN gateway using the Azure portal.
author: cherylmc
ms.author: cherylmc
ms.service: azure-vpn-gateway
ms.topic: how-to
ms.date: 03/06/2026
---

# Remove the Basic public IP reference from a Basic SKU VPN gateway - Azure portal

Basic public IP addresses are being retired in Azure. The steps in this article help you remove the Basic SKU public IP resource reference from an existing Basic SKU VPN gateway. This change doesn't update the gateway's public IP address and doesn't interrupt connectivity.

These steps apply only to Basic SKU VPN gateways that have a Basic SKU public IP resource reference. If your gateway doesn't have a Basic public IP reference, see [About migrating a Basic SKU public IP address to a Standard SKU public IP address](basic-public-ip-migrate-about.md) for information about public IP addresses and VPN Gateway.

> [!NOTE]
> * Your gateway's public IP address remains the same.
> * There's no network interruption when you make this change.

## Remove the Basic SKU public IP reference

Use the following steps to remove the Basic SKU public IP resource reference from a Basic SKU VPN gateway in the Azure portal.

1. In the [Azure portal](https://portal.azure.com), go to your **Virtual network gateway** resource.
1. On the left menu, under **Settings**, select **Configuration**.
1. On the Configuration page, verify that in the Validation section, all of the resources are showing as **Succeeded**.

   :::image type="content" source="media/basic-sku-public-ip-remove/delete-reference.png" alt-text="Screenshot that shows the Configuration page with the Delete Basic Public iP Reference option.":::

1. If the resources are showing as **Succeeded**, you can delete the Basic SKU public IP reference. Click **Delete Basic Public Ip Reference**.

## Next steps

[Learn about VPN Gateway settings](vpn-gateway-about-vpn-gateway-settings.md)