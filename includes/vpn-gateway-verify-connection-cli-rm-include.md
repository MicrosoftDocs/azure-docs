---
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 06/13/2022
 ms.author: cherylmc
---
You can verify that your connection succeeded by using the [az network vpn-connection show](/cli/azure/network/vpn-connection) command. In the example, '--name' refers to the name of the connection that you want to test. When the connection is in the process of being established, its connection status shows 'Connecting'. Once the connection is established, the status changes to 'Connected'. Modify the following example with the values for your environment.

```azurecli-interactive
az network vpn-connection show --name <connection-name> --resource-group <resource-group-name>
```
