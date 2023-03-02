---
title: Azure Firewall easy upgrade/downgrade (preview)
description: Learn about Azure Firewall easy upgrade/downgrade (preview)
services: firewall
author: vhorne
ms.service: firewall
ms.topic: conceptual
ms.date: 01/26/2023
ms.author: victorh
---

# Azure Firewall easy upgrade/downgrade (preview)


> [!IMPORTANT]
> This feature is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

You can now easily upgrade your existing Firewall Standard SKU to Premium SKU and downgrade from Premium to Standard SKU. The process is fully automated and has no service impact (zero service downtime).

## Policies

In the upgrade process, you can select the policy to be attached to the upgraded Premium SKU. You can select an existing Premium Policy or an existing Standard Policy. You can use your existing Standard policy and let the system automatically duplicate, upgrade to Premium Policy, and then attach it to the newly created Premium Firewall.

## Availability

This new capability is available through the Azure portal as shown here. It's also available via PowerShell and Terraform by changing the sku_tier attribute.

:::image type="content" source="media/premium-features/upgrade.png" alt-text="Screenshot showing SKU upgrade." lightbox="media/premium-features/upgrade.png":::

> [!NOTE]
> This new upgrade/downgrade capability will also support the Basic SKU for GA.

## Next steps


- To learn more about Azure Firewall, see [What is Azure Firewall?](overview.md).