
## Sign in to Azure and set the subscription for your PowerShell session

First you need to have [Azure PowerShell](https://msdn.microsoft.com/library/mt619274.aspx) (1.0 or later) installed and running. For detailed information, see [How to install and configure Azure PowerShell](../powershell-install-configure.md).


>[AZURE.NOTE] Many new features of SQL Database are only supported using the [Azure Resource Manager (ARM) deployment model](../resource-group-overview.md) so examples use ARM based [Azure SQL Database PowerShell cmdlets](https://msdn.microsoft.com/library/azure/mt574084.aspx). The existing classic deployment model [Azure SQL Database (classic) cmdlets](https://msdn.microsoft.com/library/azure/dn546723.aspx) are supported for backward compatibility, but using the ARM based cmdlets are recommended. 


Run the [**Add-AzureRmAccount**](https://msdn.microsoft.com/library/mt619267.aspx) cmdlet and you will be presented with a sign in screen to enter your credentials. Use the same credentials that you use to sign in to the Azure portal.

	Add-AzureRmAccount

If you have multiple subscriptions use the [**Set-AzureRmContext**](https://msdn.microsoft.com/library/mt619263.aspx) cmdlet to select which subscription your PowerShell session should use. To see what subscription the current PowerShell session is using, run [**Get-AzureRmContext**](https://msdn.microsoft.com/library/mt619265.aspx). To see all your subscriptions, run [**Get-AzureRmSubscription**](https://msdn.microsoft.com/library/mt619284.aspx).

	Set-AzureRmContext -SubscriptionId '4cac86b0-1e56-bbbb-aaaa-000000000000'

After successfully signing in you're ready to proceed.