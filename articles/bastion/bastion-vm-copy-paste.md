---
title: 'Copy and paste to and from a virtual machine via Azure Bastion'
titleSuffix: Azure Bastion
description: Learn how to copy and paste text between your local device and a remote VM session using Azure Bastion, including browser Clipboard API support and the clipboard tool palette.
author: cherylmc
ms.service: azure-bastion
ms.topic: how-to
ms.date: 04/28/2026
ms.author: cherylmc
# Customer intent: As an administrator or developer connecting to VMs through Azure Bastion, I want to copy and paste text between my local device and the remote session, so that I can efficiently transfer commands, configuration values, and other text without manually retyping them.

---

# Copy and paste to and from a VM via Bastion

Azure Bastion supports copying and pasting text between your local device and a remote VM session directly through the browser. This lets you transfer commands, configuration values, and other text without having to retype them manually. If your browser supports the Clipboard API (such as Microsoft Edge or Google Chrome), you can use standard keyboard shortcuts. For browsers that don't support the Clipboard API, Bastion provides a clipboard tool palette.

> [!IMPORTANT]
> Only text copy/paste is supported. You can't copy and paste files or passwords. To transfer files, use a [native client connection](vm-upload-download-native.md).

These steps apply to both Windows and Linux VMs connected through the browser. If you connect using a native client, see [Configure Bastion for native client connections](native-client.md).

## Prerequisites

Before you begin, verify that you meet the following criteria:

* An Azure Bastion host deployed in the virtual network where the virtual machine is located, or in a [peered virtual network](vnet-peering.md). To set up a Bastion host, see [Create a bastion host](quickstart-host-portal.md#createhost).

* A virtual machine in the virtual network.

* **Required roles:**

  * Reader role on the virtual machine.
  * Reader role on the NIC with the IP of the virtual machine.
  * Reader role on the Azure Bastion resource.
  * Reader role on the virtual network of the target virtual machine (if the Bastion deployment is in a peered virtual network).

* Copy and paste is enabled by default for all Bastion sessions. To disable or re-enable this setting, you need the [Standard SKU or higher](bastion-sku-comparison.md). See [Configure copy and paste](#configure).

See the [Azure Bastion FAQ](bastion-faq.md) for additional requirements.

## <a name="configure"></a> Configure copy and paste

Copy and paste is enabled by default for all Bastion sessions — you don't need to configure anything. If your organization's security policies require restricting clipboard access, you can disable copy and paste for web-based clients. Changing this setting requires the [Standard SKU or higher](bastion-sku-comparison.md). If you're using the Basic SKU, you must [upgrade your SKU](upgrade-sku.md) before you can toggle this feature.

To change the setting:

1. In the Azure portal, go to your Bastion resource.
1. Select **Configuration** on the left side.
   * To disable, clear the **Copy and paste** checkbox.
   * To enable, select the **Copy and paste** checkbox.
1. Select **Apply**. The bastion host updates with the new configuration.

## <a name="to"></a> Copy and paste

# [Clipboard API (Edge, Chrome)](#tab/clipboard-api)

If your browser supports the Clipboard API (such as Microsoft Edge or Google Chrome), you can copy and paste text between your local device and the remote session using standard keyboard shortcuts. This is the simplest method and works the same way as copying between applications on your local device.

1. Connect to your virtual machine.
1. When the Bastion session initializes, your browser prompts you for clipboard access. Select **Allow** to grant the Bastion web page access to your clipboard. Without this permission, copy and paste won't work in the session.
1. Use keyboard shortcuts to copy and paste as usual. On macOS, the keyboard shortcut to paste is `Shift+Ctrl+V`.
1. To copy text from the VM to your local device, select the text in the remote session, copy it (`Ctrl+C`), and paste it into any application on your local device.

# [Clipboard tool palette](#tab/clipboard-palette)

If your browser doesn't support the Clipboard API, use the Bastion clipboard tool palette to transfer text. The tool palette acts as an intermediary — text passes through its text area before reaching the remote session or your local clipboard.

### Copy text from your local device to the VM

1. Connect to your virtual machine.
1. Copy text on your local device.
1. Select the double-arrow icon (**>>**) on the left edge of the session window to open the clipboard tool palette.
1. The copied text typically appears automatically in the tool palette. If it doesn't, paste the text into the text area on the tool palette. Once the text appears in the text area, you can paste it into the remote session.

   :::image type="content" source="./media/bastion-vm-copy-paste/clipboard-copy.png" alt-text="Screenshot shows the clipboard for text copied in Bastion." lightbox="./media/bastion-vm-copy-paste/clipboard-copy.png":::

### Copy text from the VM to your local device

1. In the remote session, copy the text you want to transfer.
1. Open the clipboard tool palette by selecting the double-arrow icon (**>>**).
1. The copied text appears in the text area. You can now paste it into any application on your local device.

---

## Next steps

* Learn about [VM connections and features](vm-about.md) when connecting using Azure Bastion.
* Learn how to [upload or download files](vm-upload-download-native.md) using Azure Bastion and a native client.
* Learn how to [configure Bastion for native client connections](native-client.md).
* Learn about the different [Azure Bastion SKU tiers](bastion-sku-comparison.md) and choose the right one for your requirements.
