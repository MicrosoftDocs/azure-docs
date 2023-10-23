---
title: 'Configure Bastion for native client connections'
titleSuffix: Azure Bastion
description: Learn how to configure Bastion for native client connections.
author: cherylmc
ms.service: bastion
ms.topic: how-to
ms.date: 06/23/2023
ms.author: cherylmc
---

# Configure Bastion for native client connections

This article helps you configure your Bastion deployment to accept connections from the native client (SSH or RDP) on your local computer to VMs located in the VNet. The native client feature lets you connect to your target VMs via Bastion using Azure CLI, and expands your sign-in options to include local SSH key pair and Microsoft Entra ID. Additionally, you can also upload or download files, depending on the connection type and client.

:::image type="content" source="./media/native-client/native-client-architecture.png" alt-text="Diagram shows a connection via native client." lightbox="./media/native-client/native-client-architecture.png":::

You can configure this feature by modifying an existing Bastion deployment, or you can deploy Bastion with the feature configuration already specified. Your capabilities on the VM when connecting via native client are dependent on what is enabled on the native client.

>[!NOTE]
>[!INCLUDE [Pricing](../../includes/bastion-pricing.md)]

## Deploy Bastion with the native client feature

If you haven't already deployed Bastion to your VNet, you can deploy with the native client feature specified by deploying Bastion using manual settings. For steps, see [Tutorial - Deploy Bastion with manual settings](tutorial-create-host-portal.md#createhost). When you deploy Bastion, specify the following settings:

1. On the **Basics** tab, for **Instance Details -> Tier** select **Standard**. Native client support requires the Standard SKU.

   :::image type="content" source="./media/native-client/standard.png" alt-text="Settings for a new bastion host with Standard SKU selected." lightbox="./media/native-client/standard.png":::
1. Before you create the bastion host, go to the **Advanced** tab and check the box for **Native Client Support**, along with the checkboxes for any other features that you want to deploy.

   :::image type="content" source="./media/native-client/new-host.png" alt-text="Screenshot that shows settings for a new bastion host with Native Client Support box selected." lightbox="./media/native-client/new-host.png":::

1. Select **Review + create** to validate, then select **Create** to deploy your Bastion host.

## Modify an existing Bastion deployment

If you've already deployed Bastion to your VNet, modify the following configuration settings:

1. Navigate to the **Configuration** page for your Bastion resource. Verify that the SKU Tier is **Standard**. If it isn't, select **Standard**.
1. Select the box for **Native Client Support**, then apply your changes.

    :::image type="content" source="./media/native-client/update-host.png" alt-text="Screenshot that shows settings for updating an existing host with Native Client Support box selected." lightbox="./media/native-client/update-host.png":::

## <a name="secure"></a>Secure your native client connection

If you want to further secure your native client connection, you can limit port access by only providing access to port 22/3389. To restrict port access, you must deploy the following NSG rules on your AzureBastionSubnet to allow access to select ports and deny access from any other ports.

:::image type="content" source="./media/native-client/network-security-group.png" alt-text="Screenshot that shows NSG configurations." lightbox="./media/native-client/network-security-group.png":::

## <a name="connect"></a>Connecting to VMs

After you deploy this feature, there are different connection instructions, depending on the host computer you're connecting from, and the client VM to which you're connecting.

Use the following table to understand how to connect from native clients. Notice that different supported combinations of native client and target VMs allow for different features and require specific commands.

| Client | Target VM | Method | Microsoft Entra authentication | File transfer | Concurrent VM sessions | Custom port |
|---|---|---|---| --- |---|---|
| Windows native client | Windows VM | [RDP](connect-vm-native-client-windows.md) | Yes | [Upload/Download](vm-upload-download-native.md#rdp) | Yes | Yes |
|  | Linux VM | [SSH](connect-vm-native-client-windows.md) | Yes |No | Yes | Yes |
| | Any VM|[az network bastion tunnel](connect-vm-native-client-windows.md)  |No |[Upload](vm-upload-download-native.md#tunnel-command)| No | No |
| Linux native client | Linux VM |[SSH](connect-vm-native-client-linux.md#ssh)| Yes | No | Yes | Yes |
| | Windows or any VM| [az network bastion tunnel](connect-vm-native-client-linux.md) | No | [Upload](vm-upload-download-native.md#tunnel-command) | No | No |
| Other native client (putty) | Any VM | [az network bastion tunnel](connect-vm-native-client-linux.md) | No | [Upload](vm-upload-download-native.md#tunnel-command) | No | No |

**Limitations:**

* Signing in using an SSH private key stored in Azure Key Vault isn’t supported with this feature. Before signing in to a Linux VM using an SSH key pair, download your private key to a file on your local machine.
* Connecting using a native client isn't supported on Cloud Shell.

## Next steps

* [Connect from a Windows native client](connect-vm-native-client-windows.md)
* [Connect using the az network bastion tunnel command](connect-vm-native-client-linux.md)
* [Upload or download files](vm-upload-download-native.md)
