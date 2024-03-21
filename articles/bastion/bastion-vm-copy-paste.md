---
title: 'Copy and paste to and from a Windows virtual machine: Azure'
titleSuffix: Azure Bastion
description: Learn how copy and paste to and from a Windows VM using Bastion.
author: cherylmc
ms.service: bastion
ms.topic: how-to
ms.date: 10/31/2023
ms.author: cherylmc
# Customer intent: I want to copy and paste to and from VMs using Azure Bastion.

---

# Windows VMs - copy and paste via Bastion

This article helps you copy and paste text to and from virtual machines when using Azure Bastion.

## Prerequisites

Before you proceed, make sure you have the following items.

* A virtual network with [Azure Bastion](./tutorial-create-host-portal.md) deployed.
* A Windows virtual machine deployed to your virtual network.

## <a name="configure"></a> Configure the bastion host

By default, Azure Bastion is automatically enabled to allow copy and paste for all sessions connected through the bastion resource. You don't need to configure anything extra. This applies to both the Basic and the Standard SKU tier. If you want to disable this feature, you can disable it for web-based clients on the configuration page of your Bastion resource.

1. To view or change your configuration, in the portal, go to your Bastion resource.
1. Go to the **Configuration** page.
   * To enable, select the **Copy and paste** checkbox if it isn't already selected.
   * To disable, clear the checkbox. Disable is only available with the Standard SKU. You can upgrade the SKU if necessary.
1. **Apply** changes. The bastion host updates.

## <a name="to"></a> Copy and paste

For browsers that support the advanced Clipboard API access, you can copy and paste text between your local device and the remote session in the same way you copy and paste between applications on your local device. For other browsers, you can use the Bastion clipboard access tool palette.

> [!NOTE]
> Only text copy/paste is currently supported.

### <a name="advanced"></a> Advanced Clipboard API browsers

1. Connect to your virtual machine.
1. For direct copy and paste, your browser might prompt you for clipboard access when the Bastion session is being initialized. **Allow** the web page to access the clipboard.
1. You can now use keyboard shortcuts as usual to copy and paste. If you're working from a Mac, the keyboard shortcut to paste is **SHIFT-CTRL-V**.

### <a name="other"></a>Non-advanced Clipboard API browsers

To copy text from your local computer to a virtual machine, use the following steps.

1. Connect to your virtual machine.
1. Copy the text/content from the local device into your local clipboard.
1. On the virtual machine, you'll see two arrows on the left side of the session screen about halfway down. Launch the Bastion **Clipboard** access tool palette by selecting the two arrows.
1. Copy the text from your local computer. Typically, the copied text automatically shows on the Bastion clipboard access tool palette. If it doesn't show up on the tool palette, then paste the text in the text area on the tool palette. Once the text is in the text area, you can paste it to the remote session.

   :::image type="content" source="./media/bastion-vm-copy-paste/clipboard-copy.png" alt-text="Screenshot shows the clipboard for text copied in Bastion." lightbox="./media/bastion-vm-copy-paste/clipboard-copy.png":::

1. If you want to copy the text from the virtual machine to your local computer, copy the text to the clipboard access tool. Once your text is in the text area on the palette, paste it to your local computer.

## Next steps

For more virtual machine features, see [About VM connections and features](vm-about.md).
