---
 title: include file
 description: include file
 services: vpn-gateway
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 02/10/2020
 ms.author: cherylmc
 ms.custom: include file
---

Open your PowerShell console with elevated privileges.

If you are running Azure PowerShell locally, connect to your Azure account. The *Connect-AzAccount* cmdlet prompts you for credentials. After authenticating, it downloads your account settings so that they are available to Azure PowerShell. If you are using Azure Cloud Shell instead, you do not need to run *Connect-AzAccount*. Azure Cloud Shell connects to your Azure account automatically.

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