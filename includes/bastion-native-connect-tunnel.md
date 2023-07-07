---
author: cherylmc
ms.service: bastion
ms.topic: include
ms.date: 06/22/2023
ms.author: cherylmc
---
The **az network bastion tunnel** command is another way that you can connect to your VMs.  When you use this command, you can do the following:

* Connect from native clients on *non*-Windows local computers. (For example,  a Linux computer.)
* Connect to a VM using SSH or RDP. (The bastion tunnel doesn't relay web servers or hosts.)
* Use the native client of your choice.
* [Upload files](../articles/bastion/vm-upload-download-native.md#tunnel-command) to your target VM from your local computer. File download from the target VM to the local client is currently not supported for this command.

Limitations:

* Signing in using an SSH private key stored in Azure Key Vault isn’t supported with this feature. Before signing in to your Linux VM using an SSH key pair, download your private key to a file on your local machine.
* This feature isn't supported on Cloud Shell.

Steps:

1. Sign in to your Azure account using `az login`. If you have more than one subscription, you can view them using `az account list` and select the subscription containing your Bastion resource using `az account set --subscription "<subscription ID>"`.

1. Open the tunnel to your target VM.

   ```azurecli
   az network bastion tunnel --name "<BastionName>" --resource-group "<ResourceGroupName>" --target-resource-id "<VMResourceId or VMSSInstanceResourceId>" --resource-port "<TargetVMPort>" --port "<LocalMachinePort>"
   ```

1. Connect to your target VM using SSH or RDP, the native client of your choice, and the local machine port you specified in the previous step.

   For example, you can use the following command if you have the OpenSSH client installed on your local computer:

   ```azurecli
   ssh <username>@127.0.0.1 -p <LocalMachinePort>
   ```
