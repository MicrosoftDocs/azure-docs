
## Start your PowerShell session
First you need to have the latest [Azure PowerShell](http://msdn.microsoft.com/library/mt619274.aspx) installed and running. For detailed information, see [How to install and configure Azure PowerShell](/powershell/azureps-cmdlets-docs).

> [!NOTE]
> The examples in this topic use [Azure Resource Manager deployment model](../articles/azure-resource-manager/resource-group-overview.md), so examples use the [Azure Resource Manager cmdlets](http://msdn.microsoft.com/library/azure/mt125356.aspx). 
> 
> 

Run the [**Connect-AzureRmAccount**](https://docs.microsoft.com/powershell/module/azurerm.profile/connect-azurermaccount) cmdlet and you will be presented with a sign-in screen to enter your credentials. Use the same credentials that you use to sign in to the Azure portal.

    Connect-AzureRmAccount

If you have multiple subscriptions use the [**Set-AzureRmContext**](https://docs.microsoft.com/powershell/module/azurerm.profile/set-azurermcontext) cmdlet to select which subscription your PowerShell session should use. To see what subscription the current PowerShell session is using, run [**Get-AzureRmContext**](https://docs.microsoft.com/powershell/module/azurerm.profile/get-azurermcontext). To see all your subscriptions, run [**Get-AzureRmSubscription**](https://docs.microsoft.com/powershell/module/servicemanagement/azurerm.profile/get-azurermsubscription).

    Set-AzureRmContext -SubscriptionId '4cac86b0-1e56-bbbb-aaaa-000000000000'

