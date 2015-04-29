<properties 
	pageTitle="Using tags to organize your Azure resources" 
	description="" 
	services="" 
	documentationCenter="" 
	authors="flanakin" 
	writer="" 
	manager="wpickett" 
	editor=""/>

<tags 
	ms.service="multiple" 
	ms.workload="multiple" 
	ms.tgt_pltfrm="AzurePortal" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/28/2015" 
	ms.author="micflan"/>


# Using tags to organize your Azure resources

The Azure portal and the underlying Resource Manager are about organizing your resources and customizing your experience to be tailor-fit just for you. 

In the Azure classic portal, subscriptions are the only way to categorize and group your resources. With the Azure portal, [we introduced resource groups](./resource-group-portal.md), which enable you to group related entities. This became even more valuable when [we introduced role-based access](./role-based-access-control-configure.md). Now, in that same spirit, you can tag your resources with key/value pairs to further categorize and view resources across resource groups and, within the portal, across subscriptions.

Group resources by team, project, or even environment to focus on exactly what you want to see, when you need to see it. 


## Tags in the Azure portal

Tagging resources and resource groups in the portal is easy. Use the Browse hub to navigate to the resource or resource group you’d like to tag and click the Tags part in the Overview section at the top of the blade. 

![Tags part on resource and resource group blades](./media/resource-group-using-tags/rgblade.png)

This will open a blade with the list of tags that have already been applied. If this is your first tag, the list will be empty. To add a tag, simply specify a name and value and press Enter. After you've added a few tags, you'll notice autocomplete options based on pre-existing tag names and values to better ensure a consistent taxonomy across your resources and to avoid common mistakes, like misspellings.

![Tag resources with name/value pairs](./media/resource-group-using-tags/tag-resources.png)

From here, you can click on each individual tag to view a list of all the resources with the same tag. Of course, if this is your first tag, that list won't be very interesting. For now, let's jump over to PowerShell to tag all of our resources quickly.


## Tagging with PowerShell

First thing's first, grab the latest [Azure PowerShell module](./install-configure-powershell.md). If this is your first time using the Azure PowerShell module, [read the documentation](./install-configure-powershell.md) to get up to speed. For the purposes of this article, we'll assume you're already added an account and selected a subscription with the resources you want to tag.

Tagging is only available for resources and resource groups available from [Resource Manager](http://msdn.microsoft.com/library/azure/dn790568.aspx), so the next thing we need to do is switch to use Resource Manager. For more information, see [Using Azure PowerShell with Azure Resource Manager](powershell-azure-resource-manager.md).

    Switch-AzureMode AzureResourceManager

Tags exist directly on resources and resource groups, so to see what tags are already applied, we can simply get a resource or resource group with `Get-AzureResource` or `Get-AzureResourceGroup`, respectively. Let's start with a resource group.

![Getting tags with Get-AzureResourceGroup in PowerShell](./media/resource-group-using-tags/Get-AzureResourceGroup-in-PowerShell.png)

This cmdlet returns several bits of metadata on the resource group including what tags have been applied, if any. To tag a resource group, we'll simply use `Set-AzureResourceGroup` and specify a tag name and value.

![Setting tags with Set-AzureResourceGroup in PowerShell](./media/resource-group-using-tags/Set-AzureResourceGroup-in-PowerShell.png)

Remember that tags are updated as a whole, so if you are adding one tag to a resource that's already been tagged, you'll need to save use an array with all the tags you want to keep. To remove one, simply save the array without the one you want to remove. 

The process is the same for resources, except you'll use the `Get-AzureResource` and `Set-AzureResource` cmdlets. To get resources or resource groups with a specific tag, use `Get-AzureResource` or `Get-AzureResourceGroup` cmdlet with the `-Tag` parameter.

![Getting tagged resources and resource groups with Get-AzureResource and Get-AzureResourceGroup in PowerShell](./media/resource-group-using-tags/Get-AzureResourceGroup-with-tags-in-PowerShell.png)


## Tagging with Resource Manager

The portal and PowerShell both use the [Resource Manager REST API](http://msdn.microsoft.com/library/azure/dn790568.aspx) behind the scenes. If you need to integrate tagging into another environment, you can get tags with a GET on the resource id and update the set of tags with a PATCH call.


## Managing your taxonomy

Earlier, we talked about how autocomplete helps you ensure consistency and avoid mistakes. Autocomplete is populated based on the taxonomy of available tags setup for the subscription. Each tag you add to a resource or resource group is automatically added to the subscription-wide taxonomy, but you can also prepopulate that taxonomy with tag names and values you'd like to use as resources are tagged in the future.

To get a list of all tags within a subscription using PowerShell, use the `Get-AzureTag` cmdlet.

![Get-AzureTag in PowerShell](./media/resource-group-using-tags/Get-AzureTag-in-PowerShell.png)


You may see tags that start with "hidden-" and "link:". These are internal tags, which you should ignore and avoid changing. 

Use the `New-AzureTag` cmdlet to add new tags to the taxonomy. These tags will be included in the autocomplete even though they haven't been applied to any resources or resource groups, yet. To remove a tag name/value, first remove the tag from any resources it may be used with and then use the `Remove-AzureTag` cmdlet to remove it from the taxonomy.

To view your taxonomy of tags in the portal, use the Browse hub to view Everything and then select Tags.

![Find tags via the Browse hub](./media/resource-group-using-tags/browse-tags.png)

Pin the most important tags to your Startboard for quick access and you're ready to go. Have fun!

![Pin tags to the Startboard](./media/resource-group-using-tags/pin-tags.png)

## Next Steps
Getting Started  

- [Azure Resource Manager Overview](./resource-group-overview.md)  
- [Using Azure PowerShell with Azure Resource Manager](./powershell-azure-resource-manager.md)
- [Using the Azure CLI for Mac, Linux, and Windows with Azure Resource Management](./xplat-cli-azure-resource-manager.md)  
- [Using the Azure Portal to manage your Azure resources](./resource-group-portal.md)  
  
Creating and Deploying Applications  
  
- [Authoring Azure Resource Manager Templates](./resource-group-authoring-templates.md)  
- [Deploy an application with Azure Resource Manager Template](./resource-group-template-deploy.md)  
- [Troubleshooting Resource Group Deployments in Azure](./resource-group-deploy-debug.md)  
- [Azure Resource Manager Template Functions](./resource-group-template-functions.md)  
- [Advanced Template Operations](./resource-group-advanced-template.md)  
  
Managing and Auditing Access  
  
- [Managing and Auditing Access to Resources](./resource-group-rbac.md)  
- [Authenticating a Service Principal with Azure Resource Manager](./resource-group-authenticate-service-principal.md)  
- [Create a new Azure Service Principal using the Azure classic portal](./resource-group-create-service-principal-portal.md)  
  

