---
title: 'Connect to a VM using Bastion - Linux native client'
titleSuffix: Azure Bastion
description: Learn how to connect to a VM from a Linux computer by using Bastion and a native client.
author: cherylmc
ms.service: bastion
ms.topic: how-to
ms.date: 06/12/2023
ms.author: cherylmc
---

# Connect to a VM using Bastion and a Linux native client

This article helps you connect to a VM in the VNet using the native client (SSH or RDP) on your local Linux computer. The native client feature lets you connect to your target VMs via Bastion using Azure CLI, and expands your sign-in options to include local SSH key pair and Azure Active Directory (Azure AD).

Additionally, you can now also upload or download files, depending on the connection type and client. Your capabilities on the VM when connecting via native client are dependent on what is enabled on the native client. Controlling access to features such as file transfer via Bastion isn't supported.

For more information and steps to configure Bastion for native client connections, see [Configure Bastion for native client connections](native-client.md).

:::image type="content" source="./media/native-client/native-client-architecture.png" alt-text="Diagram shows a connection via native client." lightbox="./media/native-client/native-client-architecture.png":::

> [!NOTE]
> This configuration requires the Standard SKU tier for Azure Bastion.

After you've configured Bastion for native client support, you can connect to a VM using the **az network bastion tunnel** command. When you use this command, you can do the following:

  * Use native clients on *non*-Windows local computers (example: a Linux computer).
  * Use the native client of your choice. (This includes the Windows native client.)
  * Connect using SSH or RDP. (The bastion tunnel doesn't relay web servers or hosts.)
  * Set up concurrent VM sessions with Bastion.
  * [Upload files](vm-upload-download-native.md#tunnel-command) to your target VM from your local computer. File download from the target VM to the local client is currently not supported for this command.

**Limitations**

* Signing in using an SSH private key stored in Azure Key Vault isn’t supported with this feature. Before signing in to your Linux VM using an SSH key pair, download your private key to a file on your local machine.
* This feature isn't supported on Cloud Shell.

## <a name="prereq"></a>Prerequisites

[!INCLUDE [VM connect prerequisites](../../includes/bastion-native-pre-vm-connect.md)]

## <a name="verify"></a>Verify roles and ports

Verify that the following roles and ports are configured in order to connect to the VM.

[!INCLUDE [roles and ports](../../includes/bastion-native-roles-ports.md)]

## <a name="connect-tunnel"></a>Connect to a VM

This section helps you connect to your virtual machine from native clients on *non*-Windows local computers (example: Linux) using the **az network bastion tunnel** command. You can also connect using this method from a Windows computer. This is helpful when you require an SSH connection and want to upload files to your VM. The bastion tunnel supports RDP/SSH connection, but doesn't relay web servers or hosts.

This connection supports file upload from the local computer to the target VM. For more information, see [Upload files](vm-upload-download-native.md).

[!INCLUDE [non-Windows-clients](../../includes/bastion-native-non-windows.md)]

## <a name="connect-IP"></a>Connect to VM via IP Address

[!INCLUDE [IP address](../../includes/bastion-ip-address.md)]

## Next steps

[Upload or download files](vm-upload-download-native.md)
