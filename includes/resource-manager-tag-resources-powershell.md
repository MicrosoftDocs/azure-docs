### Tag cmdlet changes in latest PowerShell version

The August 2016 release of Azure PowerShell includes significant changes in how you work with tags. Before proceeding, check the version of your AzureRm.Resources module.

    (Get-Module -ListAvailable | Where-Object{ $_.Name -eq 'AzureRm.Resources' }) | Select Version, Name | Format-List

If you last updated your Azure PowerShell before August 2016, your results should show a version less than 3.0.

    Version : 2.0.2
    Name    : AzureRM.Resources

If you have updated Azure PowerShell since August 2016, your results should show a version of 3.0.

    Version : 3.0.1
    Name    : AzureRM.Resources

If your version of the module is 3.0.1 or later, you have the most recent cmdlets for working with tags. If your version is earlier than 3.0.1, you can continue using that version, but you might consider updating to the latest version. The latest version includes changes that make it easier to work with tags. Both approaches are shown in this topic.

### Updating your script for changes in latest version 

In the latest release, the **Tags** parameter name changed to **Tag**, and the type changed from  **Hashtable[]**  to **Hashtable**. You no longer need to provide **Name** and **Value** for each entry. Instead you provide key-value pairings in the format **Key = "Value"**.

To update existing script, change the **Tags** parameter to **Tag**, and change the tag format as shown in the following example.

    # Old
    New-AzureRmResourceGroup -Tags @{ Name = "testtag"; Value = "testval" } -Name $resourceGroupName -Location $location

    # New
    New-AzureRmResourceGroup -Tag @{ testtag = "testval" } -Name $resourceGroupName -Location $location 

However, you should note that resource groups and resources still return a **Tags** property in their metadata. This property is not changed.

### Version 3.0.1 or later

Tags exist directly on resources and resource groups. To see the existing tags, view a resource with **Get-AzureRmResource** or a resource group with **Get-AzureRmResourceGroup**. 

Let's start with a resource group.

    Get-AzureRmResourceGroup -Name testrg1

This cmdlet returns several bits of metadata on the resource group including what tags have been applied, if any.

    ResourceGroupName : testrg1
    Location          : westus
    ProvisioningState : Succeeded
    Tags              :
                    Name         Value
                    ===========  ==========
                    Dept         Finance
                    Environment  Production

To retrieve the resource metadata including tags, use the following example.

    Get-AzureRmResource -ResourceName tfsqlserver -ResourceGroupName testrg1

You see the tag names in the results.

    Name              : tfsqlserver
    ResourceId        : /subscriptions/{guid}/resourceGroups/tag-demo-group/providers/Microsoft.Sql/servers/tfsqlserver
    ResourceName      : tfsqlserver
    ResourceType      : Microsoft.Sql/servers
    Kind              : v12.0
    ResourceGroupName : testrg1
    Location          : westus
    SubscriptionId    : {guid}
    Tags              : {Dept, Environment}

Use the **Tags** property to get tag names and values.

    (Get-AzureRmResource -ResourceName tfsqlserver -ResourceGroupName testrg1).Tags

Which returns the following results:

    Name                   Value
    ----                   -----
    Dept                   Finance
    Environment            Production

Instead of viewing the tags for a particular resource group or resource, you often want to retrieve all the resources or resource groups with a particular tag and value. To get resource groups with a specific tag, use **Find-AzureRmResourceGroup** cmdlet with the **-Tag** parameter.

To retrieve resource groups with a tag value, use the following format.

    (Find-AzureRmResourceGroup -Tag @{ Dept="Finance" }).Name 

To get all the resources with a particular tag and value, use the **Find-AzureRmResource** cmdlet.

    (Find-AzureRmResource -TagName Dept -TagValue Finance).Name
    
To add a tag to a resource group that has no existing tags, use the **Set-AzureRmResourceGroup** command and specify a tag object.

    Set-AzureRmResourceGroup -Name test-group -Tag @{ Dept="IT"; Environment="Test" }

Which returns the resource group with its new tag values.

    ResourceGroupName : test-group
    Location          : southcentralus
    ProvisioningState : Succeeded
    Tags              :
                    Name          Value
                    =======       =====
                    Dept          IT
                    Environment   Test
                    
You can add tags to a resource that has no existing tags by using the **Set-AzureRmResource** command 

    Set-AzureRmResource -Tag @{ Dept="IT"; Environment="Test" } -ResourceId /subscriptions/{guid}/resourceGroups/test-group/providers/Microsoft.Web/sites/examplemobileapp

Tags are updated as a whole. To add one tag to a resource that has other tags, use an array with all the tags you want to keep. First, select the existing tags, add one to that set, and reapply all the tags.

    $tags = (Get-AzureRmResourceGroup -Name tag-demo).Tags
    $tags += @{Status="approved"}
    Set-AzureRmResourceGroup -Name test-group -Tag $tags

To remove one or more tags, simply save the array without the ones you want to remove.

The process is the same for resources except you use the **Get-AzureRmResource** and **Set-AzureRmResource** cmdlets. 

To get a list of all tags within a subscription using PowerShell, use the **Get-AzureRmTag** cmdlet.

    Get-AzureRmTag
    
Which returns tag names and a count of the number of resources and resource groups with the tag

    Name                      Count
    ----                      ------
    Dept                       8
    Environment                8

You may see tags that start with "hidden-" and "link:". These tags are internal tags, which you should ignore and avoid changing.

Use the **New-AzureRmTag** cmdlet to add new tags to the taxonomy. These tags are included in the autocomplete even though they haven't been applied to any resources or resource groups, yet. To remove a tag name/value, first remove the tag from any resources it may be used with and then use the **Remove-AzureRmTag** cmdlet to remove it from the taxonomy.

### Versions earlier than 3.0.1

Tags exist directly on resources and resource groups. To see the existing tags, view a resource with **Get-AzureRmResource** or a resource group with **Get-AzureRmResourceGroup**. 

Let's start with a resource group.

    Get-AzureRmResourceGroup -Name testrg1

This cmdlet returns several bits of metadata on the resource group including what tags have been applied, if any.

    ResourceGroupName : testrg1
    Location          : westus
    ProvisioningState : Succeeded
    Tags              :
                    Name         Value
                    ===========  ==========
                    Dept         Finance
                    Environment  Production
                    
To retrieve the resource metadata, use the following example. The resource metadata does not directly display tags. 

    Get-AzureRmResource -ResourceName tfsqlserver -ResourceGroupName testrg1

You see in the results that the tags are only displayed as Hashtable object.

    Name              : tfsqlserver
    ResourceId        : /subscriptions/{guid}/resourceGroups/tag-demo-group/providers/Microsoft.Sql/servers/tfsqlserver
    ResourceName      : tfsqlserver
    ResourceType      : Microsoft.Sql/servers
    Kind              : v12.0
    ResourceGroupName : tag-demo-group
    Location          : westus
    SubscriptionId    : {guid}
    Tags              : {System.Collections.Hashtable}

You can view the actual tags by retrieving the **Tags** property.

    (Get-AzureRmResource -ResourceName tfsqlserver -ResourceGroupName tag-demo-group).Tags | %{ $_.Name + ": " + $_.Value }
   
Which returns formatted results:
    
    Dept: Finance
    Environment: Production
    
Instead of viewing the tags for a particular resource group or resource, you often want to retrieve all the resources or resource groups with a particular tag and value. To get resource groups with a specific tag, use **Find-AzureRmResourceGroup** cmdlet with the **-Tag** parameter.

To retrieve resource groups with a tag value, use the following format.

    Find-AzureRmResourceGroup -Tag @{ Name="Dept"; Value="Finance" } | %{ $_.Name }
    
To get all the resources with a particular tag and value, use the Find-AzureRmResource cmdlet.

    Find-AzureRmResource -TagName Dept -TagValue Finance | %{ $_.ResourceName }

To add a tag to a resource group that has no existing tags, simply use the Set-AzureRmResourceGroup command and specify a tag object.

    Set-AzureRmResourceGroup -Name test-group -Tag @( @{ Name="Dept"; Value="IT" }, @{ Name="Environment"; Value="Test"} )
    
Which returns the resource group with its new tag values.

    ResourceGroupName : test-group
    Location          : southcentralus
    ProvisioningState : Succeeded
    Tags              :
                Name          Value
                =======       =====
                Dept          IT
                Environment   Test

You can add tags to a resource that has no existing tags by using the Set-AzureRmResource command.

    Set-AzureRmResource -Tag @( @{ Name="Dept"; Value="IT" }, @{ Name="Environment"; Value="Test"} ) -ResourceId /subscriptions/{guid}/resourceGroups/test-group/providers/Microsoft.Web/sites/examplemobileapp

Tags are updated as a whole. To add one tag to a resource that has other tags, use an array with all the tags you want to keep. First, select the existing tags, add one to that set, and reapply all the tags.

    $tags = (Get-AzureRmResourceGroup -Name tag-demo).Tags
    $tags += @{Name="status";Value="approved"}
    Set-AzureRmResourceGroup -Name test-group -Tag $tags

To remove one or more tags, simply save the array without the ones you want to remove.

The process is the same for resources except you use the Get-AzureRmResource and Set-AzureRmResource cmdlets. 

To get a list of all tags within a subscription using PowerShell, use the **Get-AzureRmTag** cmdlet.

    Get-AzureRmTag
    
Which returns tag names and a count of the number of resources and resource groups with the tag

    Name                      Count
    ----                      ------
    Dept                       8
    Environment                8

You may see tags that start with "hidden-" and "link:". These tags are internal tags, which you should ignore and avoid changing.

Use the **New-AzureRmTag** cmdlet to add new tags to the taxonomy. These tags are included in the autocomplete even though they haven't been applied to any resources or resource groups, yet. To remove a tag name/value, first remove the tag from any resources it may be used with and then use the **Remove-AzureRmTag** cmdlet to remove it from the taxonomy.
