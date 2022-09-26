---
author: cherylmc
ms.author: cherylmc
ms.date: 04/11/2022
ms.service: vpn-gateway
ms.topic: include
---

If you're running PowerShell locally, open the PowerShell console with elevated privileges and connect to your Azure account. The *Connect-AzAccount* cmdlet prompts you for credentials. After you authenticate, it downloads your account settings so that they're available to Azure PowerShell.

If you're using Azure Cloud Shell instead of running PowerShell locally, you'll notice that you don't need to run *Connect-AzAccount*. Azure Cloud Shell connects to your Azure account automatically after you select **Try It**.

1. If you're running PowerShell locally, sign in.

   ```azurepowershell
   Connect-AzAccount
   ```

1. If you have more than one subscription, get a list of your Azure subscriptions.

   ```azurepowershell-interactive
   Get-AzSubscription
   ```

1. Specify the subscription that you want to use.

   ```azurepowershell-interactive
   Select-AzSubscription -SubscriptionName "Name of subscription"
   ```
