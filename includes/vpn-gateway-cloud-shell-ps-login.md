---
 title: include file
 description: include file
 services: vpn-gateway
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 10/29/2020
 ms.author: cherylmc
 ms.custom: include file
---

If you are running PowerShell locally, open the PowerShell console with elevated privileges and connect to your Azure account. The *Connect-AzAccount* cmdlet prompts you for credentials. After authenticating, it downloads your account settings so that they are available to Azure PowerShell.

If you are using Azure Cloud Shell instead of running PowerShell locally, you will notice that you don't need to run *Connect-AzAccount*. Azure Cloud Shell connects to your Azure account automatically after you select **Try It**.

1. If you are running PowerShell locally, sign in.

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
