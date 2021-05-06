---
 title: include file
 description: include file
 services: vpn-gateway
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 02/01/2019
 ms.author: cherylmc
 ms.custom: include file
---

 If you are using the Azure Cloud Shell, you sign in to your Azure account automatically after clicking 'Try it'. To sign in locally, open your PowerShell console with elevated privileges and run the cmdlet to connect.

```azurepowershell
Connect-AzAccount
```

If you have more than one subscription, get a list of your Azure subscriptions.

```azurepowershell-interactive
Get-AzSubscription
```

Specify the subscription that you want to use.

```azurepowershell-interactive
Select-AzSubscription -SubscriptionName "Name of subscription"
```