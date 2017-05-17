You can verify that your connection succeeded by using the [az network vpn-connection show](/cli/azure/network/vpn-connection#show) command. Configure the values to match your own. In the example, --name refers to the name of the connection that you created and want to test.

```azurecli
az network vpn-connection show --name VNet1toSite2 --resource-group TestRG1
```

When the connection is still in the process of being established, its connection status shows 'Connecting'. Once the connection is established, the status changes to "Connected" and you can see ingress and egress bytes.