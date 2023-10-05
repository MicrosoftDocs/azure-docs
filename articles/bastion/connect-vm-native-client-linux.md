---
title: 'Connect to a VM using Bastion - Linux native client'
titleSuffix: Azure Bastion
description: Learn how to connect to a VM from a Linux computer by using Bastion and a native client.
author: cherylmc
ms.service: bastion
ms.custom: devx-track-azurecli
ms.topic: how-to
ms.date: 08/08/2023
ms.author: cherylmc
---

# Connect to a VM using Bastion and a Linux native client

This article helps you connect via Azure Bastion to a VM in VNet using the native client on your local Linux computer. The native client feature lets you connect to your target VMs via Bastion using Azure CLI, and expands your sign-in options to include local SSH key pair and Azure Active Directory (Azure AD). For more information and steps to configure Bastion for native client connections, see [Configure Bastion for native client connections](native-client.md). Connections via native client require the Bastion Standard SKU.

:::image type="content" source="./media/native-client/native-client-architecture.png" alt-text="Diagram shows a connection via native client." lightbox="./media/native-client/native-client-architecture.png":::

After you've configured Bastion for native client support, you can connect to a VM using a native Linux client. The method you use to connect depends on both the client you're connecting from, and the VM you're connecting to. The following list shows some of the available ways you can connect from a Linux native client. See [Connect to VMs](native-client.md#connect) for the full list showing available client connection/feature combinations.

* Connect to a Linux VM using **az network bastion ssh**.
* Connect to a Windows VM using **az network bastion tunnel**.
* Connect to any VM using **az network bastion tunnel**.
* [Upload files](vm-upload-download-native.md#tunnel-command) to your target VM over SSH using **az network bastion tunnel**. File download from the target VM to the local client is currently not supported for this command.

## Prerequisites

[!INCLUDE [VM connect prerequisites](../../includes/bastion-native-pre-vm-connect.md)]

## Verify roles and ports

Verify that the following roles and ports are configured in order to connect to the VM.

[!INCLUDE [roles and ports](../../includes/bastion-native-roles-ports.md)]

## <a name="ssh"></a>Connect to a Linux VM

The steps in the following sections help you connect to a Linux VM from a Linux native client using the **az network bastion** command.  This extension can be installed by running, `az extension add --name bastion`.

When you connect using this command, file transfers aren't supported. If you want to upload files, connect using the [az network bastion tunnel](#tunnel) command instead.

This command lets you do the following:

* Connect to a Linux VM using SSH.
* Authenticate via Azure Active Directory
* Connect to concurrent VM sessions within the virtual network.

To sign in, use one of the following examples. Once you sign in to your target VM, the native client on your computer opens up with your VM session.

**SSH key pair**

To sign in to your VM using an SSH key pair, use the following example.

```azurecli
az network bastion ssh --name "<BastionName>" --resource-group "<ResourceGroupName>" --target-resource-id "<VMResourceId>" --auth-type "ssh-key" --username "<Username>" --ssh-key "<Filepath>"
```

**Azure AD authentication**

If you’re signing in to an Azure AD login-enabled VM, use the following example. For more information, see [Azure Linux VMs and Azure AD](../active-directory/devices/howto-vm-sign-in-azure-ad-linux.md).

```azurecli
az network bastion ssh --name "<BastionName>" --resource-group "<ResourceGroupName>" --target-resource-id "<VMResourceId or VMSSInstanceResourceId>" --auth-type "AAD"
```

**Username/password**

If you’re signing in to your VM using a local username and password, use the following example. You’ll then be prompted for the password for the target VM.

```azurecli
az network bastion ssh --name "<BastionName>" --resource-group "<ResourceGroupName>" --target-resource-id "<VMResourceId or VMSSInstanceResourceId>" --auth-type "password" --username "<Username>"
```

#### <a name="VM-IP"></a>SSH to a Linux VM IP address

You can connect to a VM private IP address instead of the resource ID. Be aware that Azure AD authentication, and custom ports and protocols aren't supported when using this type of connection. For more information about IP-based connections, see [Connect to a VM - IP address](connect-ip-address.md).

Using the `az network bastion` command, replace `--target-resource-id` with `--target-ip-address` and the specified IP address to connect to your VM. The following example uses --ssh-key for the authentication method.

```azurecli
az network bastion ssh --name "<BastionName>" --resource-group "<ResourceGroupName>" --target-ip-addres "<VMIPAddress>" --auth-type "ssh-key" --username "<Username>" --ssh-key "<Filepath>"
```

## <a name="tunnel"></a>Connect to a VM - tunnel command

[!INCLUDE [tunnel command](../../includes/bastion-native-connect-tunnel.md)]

### <a name="tunnel-IP"></a>Tunnel to a VM IP address

[!INCLUDE [IP address](../../includes/bastion-native-ip-address.md)]

### Multi-connection tunnel

[!INCLUDE [multi-connection tunnel](../../includes/bastion-native-connect-multi-tunnel.md)]

## Next steps

[Upload or download files](vm-upload-download-native.md)
