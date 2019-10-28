---
author: MikeRayMSFT
ms.service: virtual-machines-sql
ms.topic: include
ms.date: 11/25/2018
ms.author: mikeray
---

## Start your PowerShell session
 

Run the [**Connect-Az Account**](https://docs.microsoft.com/powershell/module/Az.Accounts/Connect-AzAccount) cmdlet and you will be presented with a sign-in screen to enter your credentials. Use the same credentials that you use to sign in to the Azure portal.

```powershell
Connect-AzAccount
```

If you have multiple subscriptions use the [**Set-AzContext**](https://docs.microsoft.com/powershell/module/az.accounts/set-azcontext) cmdlet to select which subscription your PowerShell session should use. To see what subscription the current PowerShell session is using, run [**Get-AzContext**](https://docs.microsoft.com/powershell/module/az.accounts/get-azcontext). To see all your subscriptions, run [**Get-AzSubscription**](https://docs.microsoft.com/powershell/module/az.accounts/get-azsubscription).

```powershell
Set-AzContext -SubscriptionId '4cac86b0-1e56-bbbb-aaaa-000000000000'
```

