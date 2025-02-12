---
ms.author: cherylmc
author: cherylmc
ms.date: 12/02/2024
ms.service: azure-vpn-gateway
ms.topic: include
---

### <a name="noconnection"></a>To modify local network gateway IP address prefixes - no gateway connection

If you want to add or remove IP address prefixes and your gateway doesn't have a connection yet, you can update the prefixes using [az network local-gateway create](/cli/azure/network/local-gateway). To overwrite the current settings, use the existing name of your local network gateway. If you use a different name, you create a new local network gateway, instead of overwriting the existing one. You can also use this command to update the gateway IP address for the VPN device.

Each time you make a change, the entire list of prefixes must be specified, not just the prefixes that you want to change. Specify only the prefixes that you want to keep. In this case, 10.0.0.0/24 and 10.3.0.0/16

```azurecli
az network local-gateway create --gateway-ip-address 203.0.113.34 --name Site2 -g TestRG1 --local-address-prefixes 10.0.0.0/24 10.3.0.0/16
```

### <a name="withconnection"></a>To modify local network gateway IP address prefixes - existing gateway connection

If you have a gateway connection and want to add or remove IP address prefixes, you can update the prefixes using [az network local-gateway update](/cli/azure/network/local-gateway). This results in some downtime for your VPN connection.

Each time you make a change, the entire list of prefixes must be specified, not just the prefixes that you want to change. In this example, 10.0.0.0/24 and 10.3.0.0/16 are already present. We add the prefixes 10.5.0.0/16 and 10.6.0.0/16 and specify all 4 of the prefixes when updating.

```azurecli
az network local-gateway update --local-address-prefixes 10.0.0.0/24 10.3.0.0/16 10.5.0.0/16 10.6.0.0/16 --name VNet1toSite2 -g TestRG1
```
