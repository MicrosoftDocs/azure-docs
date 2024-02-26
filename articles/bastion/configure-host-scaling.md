---
title: 'Add scale units for host scaling: Azure portal'
titleSuffix: Azure Bastion
description: Learn how to add more instances (scale units) to Azure Bastion.
author: cherylmc
ms.service: bastion
ms.topic: how-to
ms.date: 05/17/2023
ms.author: cherylmc
# Customer intent: As someone with a networking background, I want to configure host scaling using the Azure portal.

---

# Configure host scaling using the Azure portal

This article helps you add more scale units (instances) to Azure Bastion to accommodate additional concurrent client connections. The steps in this article use the Azure portal. For more information about host scaling, see [Configuration settings](configuration-settings.md#instance). You can also configure host scaling using [PowerShell](configure-host-scaling-powershell.md).

## Configuration steps

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the Azure portal, go to your Bastion host.
1. Host scaling instance count requires Standard tier. On the **Configuration** page, for **Tier**, verify the tier is **Standard**. If the tier is Basic, select **Standard**. To configure scaling, adjust the instance count. Each instance is a scale unit.

   :::image type="content" source="./media/configure-host-scaling/select-sku.png" alt-text="Screenshot of Select Tier and Instance count." lightbox="./media/configure-host-scaling/select-sku.png":::

1. Select **Apply** to apply changes.

   >[!NOTE]
   > Any changes to the host scale units will disrupt active bastion connections.
   >

## Next steps

For more information about configuration settings, see [Azure Bastion configuration settings](configuration-settings.md).
