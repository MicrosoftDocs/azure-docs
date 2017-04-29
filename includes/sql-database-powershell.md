
## Start your PowerShell session
First, you should have the latest Azure PowerShell installed and running. For detailed information, see [How to install and configure Azure PowerShell](/powershell/azureps-cmdlets-docs).

> [!NOTE]
> Many new features of SQL Database are only supported when you are using the [Azure Resource Manager deployment model](../articles/azure-resource-manager/resource-group-overview.md), so examples use the [Azure SQL Database PowerShell cmdlets](https://msdn.microsoft.com/library/azure/mt574084\(v=azure.300\).aspx) for Resource Manager. The service management (classic) deployment model [Azure SQL Database Service Management cmdlets](https://msdn.microsoft.com/library/azure/dn546723\(v=azure.300\).aspx) are supported for backward compatibility, but we recommend you use the Resource Manager cmdlets.
> 
> 

Run the [**Add-AzureRmAccount**](https://msdn.microsoft.com/library/azure/mt619267\(v=azure.300\).aspx) cmdlet, and you will be presented with a sign-in screen to enter your credentials. Use the same credentials that you use to sign in to the Azure portal.

```PowerShell
Add-AzureRmAccount
```

If you have multiple subscriptions, use the [**Set-AzureRmContext**](https://msdn.microsoft.com/library/azure/mt619263\(v=azure.300\).aspx) cmdlet to select which subscription your PowerShell session should use. To see what subscription the current PowerShell session is using, run [**Get-AzureRmContext**](https://msdn.microsoft.com/library/azure/mt619265\(v=azure.300\).aspx). To see all your subscriptions, run [**Get-AzureRmSubscription**](https://msdn.microsoft.com/library/azure/mt619284\(v=azure.300\).aspx).

```PowerShell
Set-AzureRmContext -SubscriptionId '4cac86b0-1e56-bbbb-aaaa-000000000000'
```
