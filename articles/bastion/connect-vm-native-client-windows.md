---
title: 'Connect to a VM using Bastion - Windows native client'
titleSuffix: Azure Bastion
description: Learn how to connect to a VM from a Windows computer by using Bastion and a native client.
author: cherylmc
ms.service: bastion
ms.topic: how-to
ms.date: 06/12/2023
ms.author: cherylmc
---

# Connect to a VM using Bastion and the Windows native client

This article helps you connect to a VM in the VNet using the native client (SSH or RDP) on your local Windows computer. The native client feature lets you connect to your target VMs via Bastion using Azure CLI, and expands your sign-in options to include local SSH key pair and Azure Active Directory (Azure AD). For more information and steps to configure Bastion for native client connections, see [Configure Bastion for native client connections](native-client.md). Connections via native client require the Bastion Standard SKU.

:::image type="content" source="./media/native-client/native-client-architecture.png" alt-text="Diagram shows a connection via native client." lightbox="./media/native-client/native-client-architecture.png":::

After you've configured Bastion for native client support, you can connect to a VM using the native Windows client. This lets you do the following:

  * Connect using SSH or RDP.
  * [Upload and download files](vm-upload-download-native.md#rdp) over RDP.
  * If you want to connect using SSH and need to upload files to your target VM, you can use the instructions for the [az network bastion tunnel](connect-vm-native-client-linux.md) command instead.

Limitations:

* Signing in using an SSH private key stored in Azure Key Vault isn’t supported with this feature. Before signing in to your Linux VM using an SSH key pair, download your private key to a file on your local machine.
* This feature isn't supported on Cloud Shell.

## <a name="prereq"></a>Prerequisites

[!INCLUDE [VM connect prerequisites](../../includes/bastion-native-pre-vm-connect.md)]

## <a name="verify"></a>Verify roles and ports

Verify that the following roles and ports are configured in order to connect to the VM.

[!INCLUDE [roles and ports](../../includes/bastion-native-roles-ports.md)]

## <a name="connect-windows"></a>Connect to a Windows VM

1. Sign in to your Azure account. If you have more than one subscription, select the subscription containing your Bastion resource.

   ```azurecli
   az login
   az account list
   az account set --subscription "<subscription ID>"
   ```

1. Sign in to your target Windows VM using one of the following example options. If you want to specify a custom port value, you should also include the field **--resource-port** in the sign-in command.

   **RDP:**

   To connect via RDP, use the following command. You’ll then be prompted to input your credentials. You can use either a local username and password, or your Azure AD credentials. For more information, see [Azure Windows VMs and Azure AD](../active-directory/devices/howto-vm-sign-in-azure-ad-windows.md).

   ```azurecli
   az network bastion rdp --name "<BastionName>" --resource-group "<ResourceGroupName>" --target-resource-id "<VMResourceId>"
   ```

   > [!IMPORTANT]
   > Remote connection to VMs that are joined to Azure AD is allowed only from Windows 10 or later PCs that are Azure AD registered (starting with Windows 10 20H1), Azure AD joined, or hybrid Azure AD joined to the *same* directory as the VM. 

   **SSH:**

   The extension can be installed by running, ```az extension add --name ssh```. To sign in using an SSH key pair, use the following example.

   ```azurecli
   az network bastion ssh --name "<BastionName>" --resource-group "<ResourceGroupName>" --target-resource-id "<VMResourceId>" --auth-type "ssh-key" --username "<Username>" --ssh-key "<Filepath>"
   ```

   Once you sign in to your target VM, the native client on your computer opens up with your VM session; **MSTSC** for RDP sessions, and **SSH CLI extension (az ssh)** for SSH sessions.

## <a name="connect-linux"></a>Connect to a Linux VM

1. Sign in to your Azure account. If you have more than one subscription, select the subscription containing your Bastion resource.

   ```azurecli
   az login
   az account list
   az account set --subscription "<subscription ID>"
   ```

1. Sign in to your target Linux VM using one of the following example options. If you want to specify a custom port value, you should also include the field **--resource-port** in the sign-in command.

   **Azure AD:**

   If you’re signing in to an Azure AD login-enabled VM, use the following command. For more information, see [Azure Linux VMs and Azure AD](../active-directory/devices/howto-vm-sign-in-azure-ad-linux.md).

     ```azurecli
     az network bastion ssh --name "<BastionName>" --resource-group "<ResourceGroupName>" --target-resource-id "<VMResourceId or VMSSInstanceResourceId>" --auth-type  "AAD"
     ```

   **SSH:**

   The extension can be installed by running, ```az extension add --name ssh```. To sign in using an SSH key pair, use the following example.

     ```azurecli
     az network bastion ssh --name "<BastionName>" --resource-group "<ResourceGroupName>" --target-resource-id "<VMResourceId or VMSSInstanceResourceId>" --auth-type "ssh-key" --username "<Username>" --ssh-key "<Filepath>"
     ```

   **Username/password:**

   If you’re signing in using a local username and password, use the following command. You’ll then be prompted for the password for the target VM.

      ```azurecli
      az network bastion ssh --name "<BastionName>" --resource-group "<ResourceGroupName>" --target-resource-id "<VMResourceId or VMSSInstanceResourceId>" --auth-type "password" --username "<Username>"
      ```

   1. Once you sign in to your target VM, the native client on your computer opens up with your VM session; **MSTSC** for RDP sessions, and **SSH CLI extension (az ssh)** for SSH sessions.

## <a name="connect-IP"></a>Connect to VM via IP Address

[!INCLUDE [IP address](../../includes/bastion-native-ip-address.md)]

Use the following commands as examples:

   **RDP:**
   
   ```azurecli
   az network bastion rdp --name "<BastionName>" --resource-group "<ResourceGroupName>" --target-ip-address "<VMIPAddress>
   ```
   
   **SSH:**
   
   ```azurecli
   az network bastion ssh --name "<BastionName>" --resource-group "<ResourceGroupName>" --target-ip-addres "<VMIPAddress>" --auth-type "ssh-key" --username "<Username>" --ssh-key "<Filepath>"
   ```

## Next steps

[Upload or download files](vm-upload-download-native.md)
