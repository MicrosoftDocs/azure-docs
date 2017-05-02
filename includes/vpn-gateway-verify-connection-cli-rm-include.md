You can verify that your connection succeeded by using the following CLI command. Configure the values to match your own. In the example, -n refers to the name of the connection that you created and want to test.

```azurecli
az network vpn-connection show -n VNet1toSite2 -g TestRG1
```

When the connection is still in the process of being established, its connection status shows 'Connecting'. Once the connection is established, the status changes to "Connected" and you can see ingress and egress bytes.