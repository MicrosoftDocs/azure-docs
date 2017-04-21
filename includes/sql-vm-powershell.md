
## Start your PowerShell session
First you need to have the latest [Azure PowerShell](http://msdn.microsoft.com/library/mt619274.aspx) installed and running. For detailed information, see [How to install and configure Azure PowerShell](/powershell/azureps-cmdlets-docs).

> [!NOTE]
> The examples in this topic use [Azure Resource Manager deployment model](../articles/azure-resource-manager/resource-group-overview.md), so examples use the [Azure Resource Manager cmdlets](http://msdn.microsoft.com/library/azure/mt125356.aspx). 
> 
> 

Run the [**Add-AzureRmAccount**](http://msdn.microsoft.com/library/mt619267.aspx) cmdlet and you will be presented with a sign in screen to enter your credentials. Use the same credentials that you use to sign in to the Azure portal.

    Add-AzureRmAccount

If you have multiple subscriptions use the [**Set-AzureRmContext**](http://msdn.microsoft.com/library/mt619263.aspx) cmdlet to select which subscription your PowerShell session should use. To see what subscription the current PowerShell session is using, run [**Get-AzureRmContext**](http://msdn.microsoft.com/library/mt619265.aspx). To see all your subscriptions, run [**Get-AzureRmSubscription**](http://msdn.microsoft.com/library/mt619284.aspx).

    Set-AzureRmContext -SubscriptionId '4cac86b0-1e56-bbbb-aaaa-000000000000'

