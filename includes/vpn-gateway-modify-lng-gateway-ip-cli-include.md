---
ms.author: cherylmc
author: cherylmc
ms.date: 12/02/2024
ms.service: azure-vpn-gateway
ms.topic: include
---
### To modify the local network gateway 'gatewayIpAddress'

If you change the public IP address for your VPN device, you need to modify the local network gateway with the updated IP address. When modifying the gateway, be sure to specify the existing name of your local network gateway. If you use a different name, you create a new local network gateway, instead of overwriting the existing gateway information.

To modify the gateway IP address, replace the values 'Site2' and 'TestRG1' with your own using the [az network local-gateway update](/cli/azure/network/local-gateway) command.

```azurecli-interactive
az network local-gateway update --gateway-ip-address 203.0.113.170 --name Site2 --resource-group TestRG1
```

Verify that the IP address is correct in the output:

```azurecli-interactive
"gatewayIpAddress": "203.0.113.170",
```
