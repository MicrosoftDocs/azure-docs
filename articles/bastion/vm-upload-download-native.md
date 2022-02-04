---
title: 'Upload and download files - native client'
titleSuffix: Azure Bastion
description: Learn how to upload and download files using Azure Bastion and a native client.
services: bastion
author: cherylmc

ms.service: bastion
ms.topic: how-to
ms.date: 01/31/2022
ms.author: cherylmc
# Customer intent: I want to upload or download files using Bastion.

---

# Upload and download files using the native client: Azure Bastion (Preview)

Azure Bastion offers support for file transfer between your target VM and local computer using Bastion and a native RDP or SSH client. To learn more about native client support, refer to [Connect to a VM using the native client](connect-native-client-windows.md). You can use either SSH or RDP to upload files to a VM from your local computer. To download files from a VM, you must use RDP.

> [!NOTE]
> * Uploading and downloading files is supported using the native client only. You can't upload and download files using PowerShell or via the Azure portal.
> * This feature requires the Standard SKU. The Basic SKU doesn't support using the native client.
>

## Upload and download files - RDP

This section helps you transfer files between your local Windows computer and your target VM over RDP. Once connected to the target VM, you can transfer files using right-click, then **Copy** and **Paste**.

1. Sign in to your Azure account and select the subscription containing your Bastion resource.

    ```azurecli-interactive
    az login
    az account list
    az account set --subscription "<subscription ID>"
    ```

1. Sign in to your target VM via RDP using the following command. You can use either a local username and password, or your Azure AD credentials. To learn more about how to use Azure AD to sign in to your Azure Windows VMs, see [Azure Windows VMs and Azure AD](../active-directory/devices/howto-vm-sign-in-azure-ad-windows.md).

    ```azurecli-interactive
    az network bastion rdp --name "<BastionName>" --resource-group "<ResourceGroupName>" --target-resource-id "<VMResourceId>"
    ```

1. Once you sign in to your target VM, the native client on your computer will open up with your VM session. You can now transfer files between your VM and local machine using right-click, then **Copy** and **Paste**.

## Upload files - SSH

This section helps you upload files from your local computer to your target VM over SSH using the *az network bastion tunnel* command. To learn more about the tunnel command, refer to [Connect to a VM using the *az network bastion tunnel* command](connect-native-client-windows.md#connect-tunnel).

> [!NOTE]
> File download over SSH is not currently supported.
>

1. Sign in to your Azure account and select the subscription containing your Bastion resource.

    ```azurecli-interactive
    az login
    az account list
    az account set --subscription "<subscription ID>"
    ```

1. Open the tunnel to your target VM using the following command:

    ```azurecli-interactive
   az network bastion tunnel --name "<BastionName>" --resource-group "<ResourceGroupName>" --target-resource-id "<VMResourceId>" --resource-port "<TargetVMPort>" --port "<LocalMachinePort>"
    ```

1. Upload files to your local machine to your target VM using the following command:

    ```azurecli-interactive
    scp -P <LocalMachinePort>  <local machine file path>  <username>@127.0.0.1:<target VM file path>
    ```

1. Connect to your target VM using SSH, the native client of your choice, and the local machine port you specified in Step 3. For example, you can use the following command if you have the OpenSSH client installed on your local computer:

    ```azurecli-interactive
    ssh <username>@127.0.0.1 -p <LocalMachinePort>
    ```

## Next steps

- Read the [Bastion FAQ](bastion-faq.md) 
