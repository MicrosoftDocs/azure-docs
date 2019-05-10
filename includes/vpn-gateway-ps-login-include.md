---
 title: include file
 description: include file
 services: vpn-gateway
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 03/21/2018
 ms.author: cherylmc
 ms.custom: include file
---
Before beginning this configuration, you must sign in to your Azure account. The cmdlet prompts you for the sign-in credentials for your Azure account. After signing in, it downloads your account settings so they are available to Azure PowerShell. For more information, see [Using Windows PowerShell with Resource Manager](../articles/powershell-azure-resource-manager.md).

To sign in, open your PowerShell console with elevated privileges, and connect to your account. Use the following example to help you connect:

```powershell
Connect-AzAccount
```

If you have multiple Azure subscriptions, check the subscriptions for the account.

```powershell
Get-AzSubscription
```

Specify the subscription that you want to use.

```powershell
Select-AzSubscription -SubscriptionName "Replace_with_your_subscription_name"
 ```
