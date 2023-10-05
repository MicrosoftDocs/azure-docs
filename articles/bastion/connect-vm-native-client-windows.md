---
title: 'Connect to a VM using Bastion - Windows native client'
titleSuffix: Azure Bastion
description: Learn how to connect to a VM from a Windows computer by using Bastion and a native client.
author: cherylmc
ms.service: bastion
ms.custom: devx-track-azurecli
ms.topic: how-to
ms.date: 09/21/2023
ms.author: cherylmc
---

# Connect to a VM using Bastion and the Windows native client

This article helps you connect to a VM in the VNet using the native client (SSH or RDP) on your local Windows computer. The native client feature lets you connect to your target VMs via Bastion using Azure CLI, and expands your sign-in options to include local SSH key pair and Azure Active Directory (Azure AD). For more information and steps to configure Bastion for native client connections, see [Configure Bastion for native client connections](native-client.md). Connections via native client require the Bastion Standard SKU.

:::image type="content" source="./media/native-client/native-client-architecture.png" alt-text="Diagram shows a connection via native client." lightbox="./media/native-client/native-client-architecture.png":::

After you've configured Bastion for native client support, you can connect to a VM using a native Windows client. The method you use to connect depends on both the client you're connecting from, and the VM you're connecting to. The following list shows some of the available ways you can connect from a Windows native client. See [Connect to VMs](native-client.md#connect) for the full list showing available client connection/feature combinations.

* Connect to a Windows VM using **az network bastion rdp**.
* Connect to a Linux VM using **az network bastion ssh**.
* Connect to a VM using **az network bastion tunnel**.
* [Upload and download files](vm-upload-download-native.md#rdp) over RDP.
* Upload files over SSH using **az network bastion tunnel**.

## <a name="prereq"></a>Prerequisites

[!INCLUDE [VM connect prerequisites](../../includes/bastion-native-pre-vm-connect.md)]

## <a name="verify"></a>Verify roles and ports

Verify that the following roles and ports are configured in order to connect to the VM.

[!INCLUDE [roles and ports](../../includes/bastion-native-roles-ports.md)]

## Connect to a VM

The steps in the following sections help you connect to a VM from a Windows native client using the **az network bastion** command.

### <a name="connect-windows"></a>RDP to a Windows VM

[!INCLUDE [Remote Desktop Users](../../includes/bastion-remote-desktop-users.md)]

1. Sign in to your Azure account using `az login`. If you have more than one subscription, you can view them using `az account list` and select the subscription containing your Bastion resource using `az account set --subscription "<subscription ID>"`.

1. To connect via RDP, use the following example.

   ```azurecli
   az network bastion rdp --name "<BastionName>" --resource-group "<ResourceGroupName>" --target-resource-id "<VMResourceId>"
   ```

1. After running the command, you're prompted to input your credentials. You can use either a local username and password, or your Azure AD credentials. Once you sign in to your target VM, the native client on your computer opens up with your VM session via **MSTSC**.

   > [!IMPORTANT]
   > Remote connection to VMs that are joined to Azure AD is allowed only from Windows 10 or later PCs that are Azure AD registered (starting with Windows 10 20H1), Azure AD joined, or hybrid Azure AD joined to the *same* directory as the VM.

#### Specify authentication method

Optionally, you can also specify the authentication method as part of the command.

* **Azure AD authentication:** For Windows 10 version 20H2+, Windows 11 21H2+, and Windows Server 2022, use `--enable-mfa`. For more information, see [az network bastion rdp - optional parameters](/cli/azure/network/bastion?#az-network-bastion-rdp(bastion)-optional-parameters).

#### Specify a custom port

You can specify a custom port when you connect to a Windows VM via RDP.

One scenario where this could be especially useful would be connecting to a Windows VM via port 22. This is a potential workaround for the limitation with the *az network bastion ssh* command, which can't be used by a Windows native client to connect to a Windows VM.

To specify a custom port, include the field **--resource-port** in the sign-in command, as shown in the following example.

```azurecli
az network bastion rdp --name "<BastionName>" --resource-group "<ResourceGroupName>" --target-resource-id "<VMResourceId>" --resource-port "22"
```

#### RDP to a Windows VM IP address

You can also connect to a VM private IP address, instead of the resource ID. Azure AD authentication, and custom ports and protocols aren't supported when using this type of connection. For more information about IP-based connections, see [Connect to a VM - IP address](connect-ip-address.md).

Using the `az network bastion` command, replace `--target-resource-id` with `--target-ip-address` and the specified IP address to connect to your VM.

```azurecli
az network bastion rdp --name "<BastionName>" --resource-group "<ResourceGroupName>" --target-ip-address "<VMIPAddress>"
```

### <a name="connect-linux"></a>SSH to a Linux VM

1. Sign in to your Azure account using `az login`. If you have more than one subscription, you can view them using `az account list` and select the subscription containing your Bastion resource using `az account set --subscription "<subscription ID>"`.

1. Sign in to your target Linux VM using one of the following example options. If you want to specify a custom port value, include the field **--resource-port** in the sign-in command.

   **Azure AD:**

   If you’re signing in to an Azure AD login-enabled VM, use the following command. For more information, see [Azure Linux VMs and Azure AD](../active-directory/devices/howto-vm-sign-in-azure-ad-linux.md).

     ```azurecli
     az network bastion ssh --name "<BastionName>" --resource-group "<ResourceGroupName>" --target-resource-id "<VMResourceId or VMSSInstanceResourceId>" --auth-type "AAD"
     ```

   **SSH key pair:**

   The extension can be installed by running, ```az extension add --name ssh```. To sign in using an SSH key pair, use the following example.

     ```azurecli
     az network bastion ssh --name "<BastionName>" --resource-group "<ResourceGroupName>" --target-resource-id "<VMResourceId or VMSSInstanceResourceId>" --auth-type "ssh-key" --username "<Username>" --ssh-key "<Filepath>"
     ```

   **Username/password:**

   If you’re signing in using a local username and password, use the following command. You’ll then be prompted for the password for the target VM.

      ```azurecli
      az network bastion ssh --name "<BastionName>" --resource-group "<ResourceGroupName>" --target-resource-id "<VMResourceId or VMSSInstanceResourceId>" --auth-type "password" --username "<Username>"
      ```

1. Once you sign in to your target VM, the native client on your computer opens up with your VM session using **SSH CLI extension (az ssh)**.

#### SSH to a Linux VM IP address

You can also connect to a VM private IP address, instead of the resource ID. Azure AD authentication, and custom ports and protocols aren't supported when using this type of connection. For more information about IP-based connections, see [Connect to a VM - IP address](connect-ip-address.md).

Using the `az network bastion` command, replace `--target-resource-id` with `--target-ip-address` and the specified IP address to connect to your VM.

```azurecli
az network bastion ssh --name "<BastionName>" --resource-group "<ResourceGroupName>" --target-ip-address "<VMIPAddress>" --auth-type "ssh-key" --username "<Username>" --ssh-key "<Filepath>"
```

## Connect to a VM - tunnel command

[!INCLUDE [tunnel command](../../includes/bastion-native-connect-tunnel.md)]

### <a name="tunnel-IP"></a>Tunnel to a VM IP address

[!INCLUDE [IP address](../../includes/bastion-native-ip-address.md)]

### Multi-connection tunnel

[!INCLUDE [multi-connection tunnel](../../includes/bastion-native-connect-multi-tunnel.md)]

## Next steps

[Upload or download files](vm-upload-download-native.md)
