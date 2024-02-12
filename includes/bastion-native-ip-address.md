---
author: cherylmc
ms.service: bastion
ms.topic: include
ms.date: 06/22/2023
ms.author: cherylmc
---
You can also connect to a VM private IP address, instead of the resource ID. Microsoft Entra authentication, and custom ports and protocols aren't supported when using this type of connection. For more information about IP-based connections, see [Connect to a VM - IP address](../articles/bastion/connect-ip-address.md).

Using the `az network bastion tunnel` command, replace `--target-resource-id` with `--target-ip-address` and the specified IP address to connect to your VM.

```azurecli
az network bastion tunnel --name "<BastionName>" --resource-group "<ResourceGroupName>" --target-ip-address "<VMIPAddress>" --resource-port "<TargetVMPort>" --port "<LocalMachinePort>"
```
