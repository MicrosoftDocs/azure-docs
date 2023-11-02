---
title: 'File transfer via native client'
titleSuffix: Azure Bastion
description: Learn how to upload or download files using Azure Bastion and a native client.
author: cherylmc
ms.service: bastion
ms.topic: how-to
ms.date: 06/13/2023
ms.author: cherylmc
# Customer intent: I want to upload or download files using Bastion.

---

# File transfer using a native client

Azure Bastion offers support for file transfer between your target VM and local computer using Bastion and a native RDP or native SSH client. To learn more about native client support, refer to [Configure Bastion native client support](native-client.md). While it may be possible to use third-party clients and tools to upload or download files, this article focuses on working with supported native clients.

* File transfers are supported using the native client only. You can't upload or download files using PowerShell or via the Azure portal.
* To both [upload and download files](#rdp), you must use the Windows native client and RDP.
* You can [upload files](#tunnel-command) to a VM using the native client of your choice and either RDP or SSH.
* This feature requires the Standard SKU. The Basic SKU doesn't support using the native client.

## Prerequisites

* Install Azure CLI (version 2.32 or later) to run the commands in this article. For information about installing the CLI commands, see [Install the Azure CLI](/cli/azure/install-azure-cli) and [Get Started with Azure CLI](/cli/azure/get-started-with-azure-cli).
* Get the Resource ID for the VM to which you want to connect. The Resource ID can be easily located in the Azure portal. Go to the Overview page for your VM and select the *JSON View* link to open the Resource JSON. Copy the Resource ID at the top of the page to your clipboard to use later when connecting to your VM.

## <a name="rdp"></a>Upload and download files - RDP

The steps in this section apply when connecting to a target VM from a Windows local computer using the native Windows client and RDP. The **az network bastion rdp** command uses the native client MSTSC. Once connected to the target VM, you can upload and download files using **right-click**, then **Copy** and **Paste**. To learn more about this command and how to connect, see [Connect from a Windows native client](connect-vm-native-client-windows.md).

> [!NOTE]
> File transfer over SSH is not supported using this method. Instead, use the [az network bastion tunnel command](#tunnel-command) to upload files over SSH.
>

1. Sign in to your Azure account. If you have more than one subscription, select the subscription containing your Bastion resource.

   ```azurecli
   az login
   az account list
   az account set --subscription "<subscription ID>"
   ```

1. Sign in to your target VM via RDP using the following command. You can use either a local username and password, or your Microsoft Entra credentials. To learn more about how to use Microsoft Entra ID to sign in to your Azure Windows VMs, see [Azure Windows VMs and Microsoft Entra ID](../active-directory/devices/howto-vm-sign-in-azure-ad-windows.md).

    ```azurecli
    az network bastion rdp --name "<BastionName>" --resource-group "<BastionResourceGroupName>" --target-resource-id "<VMResourceId>"
    ```

1. Once you sign in to your target VM, the native client on your computer will open up with your VM session. You can now transfer files between your VM and local machine using right-click, then **Copy** and **Paste**.

## <a name="tunnel-command"></a>Upload files - SSH and RDP

The steps in this section apply to native clients other than Windows, as well as Windows native clients that want to connect over SSH to upload files.
This section helps you upload files from your local computer to your target VM over SSH or RDP using the **az network bastion tunnel** command. To learn more about the tunnel command and how to connect, see [Connect from a Linux native client](connect-vm-native-client-linux.md).

> [!NOTE]
> This command can be used to upload files from your local computer to the target VM. File download is not supported.
>

1. Sign in to your Azure account. If you have more than one subscription, select the subscription containing your Bastion resource.

   ```azurecli
   az login
   az account list
   az account set --subscription "<subscription ID>"
   ```

1. Open the tunnel to your target VM using the following command:

    ```azurecli
   az network bastion tunnel --name "<BastionName>" --resource-group "<ResourceGroupName>" --target-resource-id "<VMResourceId>" --resource-port "<TargetVMPort>" --port "<LocalMachinePort>"
    ```

1. Open a second command prompt to connect to your target VM through the tunnel. In this second command prompt window, you can upload files from your local machine to your target VM using the following command:

    ```azurecli
    scp -P <LocalMachinePort>  <local machine file path>  <username>@127.0.0.1:<target VM file path>
    ```

1. Connect to your target VM using SSH or RDP, the native client of your choice, and the local machine port you specified in Step 3.

   For example, you can use the following command if you have the OpenSSH client installed on your local computer:

    ```azurecli
    ssh <username>@127.0.0.1 -p <LocalMachinePort>
    ```

## Next steps

For more VM features, see [About VM connections and features](vm-about.md).
