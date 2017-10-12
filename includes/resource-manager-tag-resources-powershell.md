The examples in this article require version 3.0 or later of Azure PowerShell. If you do not have version 3.0 or later, [update your version](/powershell/azureps-cmdlets-docs/) by using PowerShell Gallery or Web Platform Installer.

To see the existing tags for a *resource group*, use:

```powershell
(Get-AzureRmResourceGroup -Name examplegroup).Tags
```

That script returns the following format:

```powershell
Name                           Value
----                           -----
Dept                           IT
Environment                    Test
```

To see the existing tags for a *resource that has a specified resource ID*, use:

```powershell
(Get-AzureRmResource -ResourceId {resource-id}).Tags
```

Or, to see the existing tags for a *resource that has a specified name and resource group*, use:

```powershell
(Get-AzureRmResource -ResourceName examplevnet -ResourceGroupName examplegroup).Tags
```

To get *resource groups that have a specific tag*, use:

```powershell
(Find-AzureRmResourceGroup -Tag @{ Dept="Finance" }).Name
```

To get *resources that have a specific tag*, use:

```powershell
(Find-AzureRmResource -TagName Dept -TagValue Finance).Name
```

Every time you apply tags to a resource or a resource group, you overwrite the existing tags on that resource or resource group. Therefore, you must use a different approach based on whether the resource or resource group has existing tags.

To add tags to a *resource group without existing tags*, use:

```powershell
Set-AzureRmResourceGroup -Name examplegroup -Tag @{ Dept="IT"; Environment="Test" }
```

To add tags to a *resource group that has existing tags*, retrieve the existing tags, add the new tag, and reapply the tags:

```powershell
$tags = (Get-AzureRmResourceGroup -Name examplegroup).Tags
$tags += @{Status="Approved"}
Set-AzureRmResourceGroup -Tag $tags -Name examplegroup
```

To add tags to a *resource without existing tags*, use:

```powershell
$r = Get-AzureRmResource -ResourceName examplevnet -ResourceGroupName examplegroup
Set-AzureRmResource -Tag @{ Dept="IT"; Environment="Test" } -ResourceId $r.ResourceId -Force
```

To add tags to a *resource that has existing tags*, use:

```powershell
$r = Get-AzureRmResource -ResourceName examplevnet -ResourceGroupName examplegroup
$r.tags += @{Status="Approved"}
Set-AzureRmResource -Tag $r.Tags -ResourceId $r.ResourceId -Force
```

To apply all tags from a resource group to its resources, and *not retain existing tags on the resources*, use the following script:

```powershell
$groups = Get-AzureRmResourceGroup
foreach ($g in $groups)
{
    Find-AzureRmResource -ResourceGroupNameEquals $g.ResourceGroupName | ForEach-Object {Set-AzureRmResource -ResourceId $_.ResourceId -Tag $g.Tags -Force }
}
```

To apply all tags from a resource group to its resources, and *retain existing tags on resources that are not duplicates*, use the following script:

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

To remove all tags, pass an empty hash table:

```powershell
Set-AzureRmResourceGroup -Tag @{} -Name examplegroup
```
