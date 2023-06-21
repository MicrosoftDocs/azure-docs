---
author: cherylmc
ms.service: bastion
ms.topic: include
ms.date: 06/12/2023
ms.author: cherylmc
---

1. Sign in to your Azure account. If you have more than one subscription, select the subscription containing your Bastion resource.

   ```azurecli
   az login
   az account list
   az account set --subscription "<subscription ID>"
   ```

1. Open the tunnel to your target VM using the following command.

   ```azurecli
   az network bastion tunnel --name "<BastionName>" --resource-group "<ResourceGroupName>" --target-resource-id "<VMResourceId or VMSSInstanceResourceId>" --resource-port "<TargetVMPort>" --port "<LocalMachinePort>"
   ```

1. Connect to your target VM using SSH or RDP, the native client of your choice, and the local machine port you specified in Step 2.

   For example, you can use the following command if you have the OpenSSH client installed on your local computer:

   ```azurecli
   ssh <username>@127.0.0.1 -p <LocalMachinePort>
   ```