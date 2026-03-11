---
title: Connect to a Windows VM using native RDP client
description: Steps to connect to a Windows virtual machine using Azure Bastion with a native RDP client via Azure CLI.
author: abell
ms.service: azure-bastion
ms.topic: include
ms.date: 03/06/2026
ms.author: abell
---
When a user connects to a Windows VM via RDP, they must have rights on the target VM. If the user isn't a local administrator, add the user to the Remote Desktop Users group on the target VM.

1. Sign in to your Azure account using `az login`. If you have more than one subscription, you can view them using `az account list` and select the subscription containing your Bastion resource using `az account set --subscription "<subscription ID>"`.

1. To connect via RDP, use the following example.

   ```azurecli
   az network bastion rdp --name "<BastionName>" --resource-group "<ResourceGroupName>" --target-resource-id "<VMResourceId>"
   ```

1. After running the command, you're prompted to input your credentials. You can use either a local username and password, or your Microsoft Entra credentials. Once you sign in to your target VM, the native client on your computer opens up with your VM session via **MSTSC**.

   > [!IMPORTANT]
   > Remote connection to VMs that are joined to Microsoft Entra ID is allowed only from Windows 10 or later PCs that are Microsoft Entra registered (starting with Windows 10 20H1), Microsoft Entra joined, or Microsoft Entra hybrid joined to the *same* directory as the VM.

#### Specify authentication method

Optionally, you can also specify the authentication method as part of the command.

* **Microsoft Entra authentication:** For Windows 10 version 20H2+, Windows 11 21H2+, and Windows Server 2022, use `--enable-mfa`. For more information, see [az network bastion rdp - optional parameters](/cli/azure/network/bastion?#az-network-bastion-rdp(bastion)-optional-parameters).

#### Specify a custom port

You can specify a custom port when you connect to a Windows VM via RDP.

One scenario where this could be especially useful would be connecting to a Windows VM via port 22. This is a potential workaround for the limitation with the *az network bastion ssh* command, which can't be used by a Windows native client to connect to a Windows VM.

To specify a custom port, include the field **--resource-port** in the sign-in command, as shown in the following example.

```azurecli
az network bastion rdp --name "<BastionName>" --resource-group "<ResourceGroupName>" --target-resource-id "<VMResourceId>" --resource-port "22"
```

#### RDP to a Windows VM IP address

You can also connect to a VM private IP address, instead of the resource ID. Microsoft Entra authentication, and custom ports and protocols aren't supported when using this type of connection. For more information about IP-based connections, see [Connect to a VM - IP address](../articles/bastion/connect-ip-address.md).

Using the `az network bastion` command, replace `--target-resource-id` with `--target-ip-address` and the specified IP address to connect to your VM.

```azurecli
az network bastion rdp --name "<BastionName>" --resource-group "<ResourceGroupName>" --target-ip-address "<VMIPAddress>"
```
