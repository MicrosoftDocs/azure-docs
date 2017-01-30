### Tag cmdlet changes in latest PowerShell version
The August 2016 release of Azure PowerShell included significant changes in how you work with tags. Before proceeding, make sure you have at least version 3.0 of the AzureRm.Resources module.

```powershell
Get-Module -ListAvailable -Name AzureRm.Resources | Select Version
```

If you have updated Azure PowerShell since August 2016, your results show version 3.0 or later.

```powershell
Version
-------
3.5.0
```

If you do not have version 3.0 or later of the module, please [update your version](/powershell/azureps-cmdlets-docs/) by using PowerShell Gallery or Web Platform Installer.

To add tags to a resource group that does not have existing tags, use `Set-AzureRmResourceGroup` and specify a tag object.

```powershell
Set-AzureRmResourceGroup -Name test-group -Tag @{ Dept="IT"; Environment="Test" }
```

To add tags to a resource that does not have existing tags, use `Set-AzureRmResource` and specify a tag object. 

```powershell
Set-AzureRmResource -Tag @{ Dept="IT"; Environment="Test" } -ResourceName storageexample -ResourceGroupName TagTestGroup -ResourceType Microsoft.Storage/storageAccounts
```

Tags are updated as a whole. To add tags to a resource that already has tags, retrieve the existing tags with the `Get-AzureRmResource` cmdlet and store it in a variable. Add the new tags to the existing tags, and reapply the variable to the resource.

```powershell
$tags = (Get-AzureRmResource -ResourceName storageexample -ResourceGroupName TagTestGroup).Tags
$tags += @{Status="Approved"}
Set-AzureRmResource -Tag $tags -ResourceName storageexample -ResourceGroupName TagTestGroup -ResourceType Microsoft.Storage/storageAccounts
```

To remove one or more tags, save the array without the ones you want to remove.

Instead of viewing the tags for a particular resource group or resource, you often want to retrieve all the resources or resource groups with a particular tag and value. 

To get resource groups with a specific tag, use `Find-AzureRmResourceGroup` cmdlet, as shown below:

```powershell
(Find-AzureRmResourceGroup -Tag @{ Dept="Finance" }).Name 
```

To get all the resources with a particular tag and value, use the `Find-AzureRmResource` cmdlet.

```powershell
(Find-AzureRmResource -TagName Dept -TagValue Finance).Name
```
