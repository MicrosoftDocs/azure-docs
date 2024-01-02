---
title: Azure Firewall easy upgrade/downgrade
description: Learn about Azure Firewall easy upgrade/downgrade
services: firewall
author: vhorne
ms.service: firewall
ms.topic: conceptual
ms.date: 04/06/2023
ms.author: victorh
---

# Azure Firewall easy upgrade/downgrade

You can now easily upgrade your existing Firewall Standard SKU to Premium SKU and downgrade from Premium to Standard SKU.

> [!IMPORTANT]
> Always perform any upgrade/downgrade operations during off-business hours and scheduled maintenance times.

## Policies

In the upgrade process, you can select the policy to be attached to the upgraded Premium SKU. You can select an existing Premium Policy or an existing Standard Policy. You can use your existing Standard policy and let the system automatically duplicate, upgrade to Premium Policy, and then attach it to the newly created Premium Firewall.

## Availability

This new capability is available through the Azure portal as shown here. It's also available via PowerShell and Terraform by changing the sku_tier attribute.

:::image type="content" source="media/premium-features/upgrade.png" alt-text="Screenshot showing SKU upgrade." lightbox="media/premium-features/upgrade.png":::

> [!NOTE]
> This new upgrade/downgrade capability doesn't currently support the [Azure Firewall Basic SKU](overview.md#azure-firewall-basic).

## Next steps


- To learn more about Azure Firewall, see [What is Azure Firewall?](overview.md).