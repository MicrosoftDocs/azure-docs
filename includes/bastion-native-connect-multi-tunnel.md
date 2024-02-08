---
author: cherylmc
ms.service: bastion
ms.topic: include
ms.date: 08/08/2023
ms.author: cherylmc
---

1. Add the following to your $HOME\.ssh\config.

   ```azurecli
   Host tunneltunnel
     HostName 127.0.0.1
     Port 2222
     User mylogin
     StrictHostKeyChecking=No
     UserKnownHostsFile=\\.\NUL
   ```

1. Add the tunnel connection to your established tunnel connection.

   ```azurecli
   az network bastion tunnel --name mybastion --resource-group myrg --target-resource-id /subscriptions/<mysubscription>/resourceGroups/myrg/providers/Microsoft.Compute/virtualMachines/myvm --resource-port 22 --port 22
   ```

1. Create an ssh tunnel in the bastion tunnel.

   ```azurecli
   ssh -L 2222:127.0.0.1:22 mylogin@127.0.0.1
   ```

1. Use VS Code to connect to your tunnel connection.