Version 3.0 of the AzureRm.Resources module included significant changes in how you work with tags. Before proceeding, check your version:

```powershell
Get-Module -ListAvailable -Name AzureRm.Resources | Select Version
```

If your results show version 3.0 or later, the examples in this topic work with your environment. If you do not have version 3.0 or later, [update your version](/powershell/azureps-cmdlets-docs/) by using PowerShell Gallery or Web Platform Installer before proceeding with this topic.

```powershell
Version
-------
3.5.0
```

Every time you apply tags to a resource or resource group, you overwrite the existing tags on that resource or resource group. Therefore, you must use a different approach based on whether the resource or resource group has existing tags that you want to preserve. To add tags to a:

* resource group without existing tags.

  ```powershell
  Set-AzureRmResourceGroup -Name TagTestGroup -Tag @{ Dept="IT"; Environment="Test" }
  ```

* resource group with existing tags.

  ```powershell
  $tags = (Get-AzureRmResourceGroup -Name TagTestGroup).Tags
  $tags += @{Status="Approved"}
  Set-AzureRmResourceGroup -Tag $tags -Name TagTestGroup
  ```

* resource without existing tags.

  ```powershell
  Set-AzureRmResource -Tag @{ Dept="IT"; Environment="Test" } -ResourceName storageexample -ResourceGroupName TagTestGroup -ResourceType Microsoft.Storage/storageAccounts
  ```

* resource with existing tags.

  ```powershell
  $tags = (Get-AzureRmResource -ResourceName storageexample -ResourceGroupName TagTestGroup).Tags
  $tags += @{Status="Approved"}
  Set-AzureRmResource -Tag $tags -ResourceName storageexample -ResourceGroupName TagTestGroup -ResourceType Microsoft.Storage/storageAccounts
  ```

To apply all tags from a resource group to its resources, and **not retain existing tags on the resources**, use the following script:

```powershell
$groups = Get-AzureRmResourceGroup
foreach ($g in $groups) 
{
    Find-AzureRmResource -ResourceGroupNameEquals $g.ResourceGroupName | ForEach-Object {Set-AzureRmResource -ResourceId $_.ResourceId -Tag $g.Tags -Force } 
}
```

To apply all tags from a resource group to its resources, and **retain existing tags on resources that are not duplicates**, use the following script:

```powershell
$groups = Get-AzureRmResourceGroup
foreach ($g in $groups) 
{
    if ($g.Tags -ne $null) {
        $resources = Find-AzureRmResource -ResourceGroupNameEquals $g.ResourceGroupName 
        foreach ($r in $resources)
        {
            $resourcetags = (Get-AzureRmResource -ResourceId $r.ResourceId).Tags
            foreach ($key in $g.Tags.Keys)
            {
                if ($resourcetags.ContainsKey($key)) { $resourcetags.Remove($key) }
            }
            $resourcetags += $g.Tags
            Set-AzureRmResource -Tag $resourcetags -ResourceId $r.ResourceId -Force
        }
    }
}
```

To remove all tags, pass an empty hash table.

```powershell
Set-AzureRmResourceGroup -Tag @{} -Name TagTestGgroup
```

To get resource groups with a specific tag, use `Find-AzureRmResourceGroup` cmdlet.

```powershell
(Find-AzureRmResourceGroup -Tag @{ Dept="Finance" }).Name 
```

To get all the resources with a particular tag and value, use the `Find-AzureRmResource` cmdlet.

```powershell
(Find-AzureRmResource -TagName Dept -TagValue Finance).Name
```

