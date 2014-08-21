<properties linkid="web-sites-staged-publishing" urlDisplayName="How to stage sites on Microsoft Azure" pageTitle="Staged Deployment on Microsoft Azure Web Sites" metaKeywords="Microsoft Azure Web Sites, Staged Deployment, Site Slots" description="Learn how to use staged publishing on Microsoft Azure Web Sites." metaCanonical="" services="web-sites" documentationCenter="" title="Staged Deployment on Microsoft Azure Web Sites" authors="timamm"  solutions="" writer="timamm" manager="paulettm" editor="mollybos"  />

#Staged Deployment on Microsoft Azure Web Sites#

## Table of Contents ##
- [Overview](#Overview)
- [To Add a Deployment Slot to a Web Site](#Add)
- [About Configuration for Deployment Slots](#AboutConfiguration)
- [To Swap Deployment Slots](#Swap)
- [To Rollback a Production Site to Staging](#Rollback)
- [To Delete a Site Slot](#Delete)
- [Azure PowerShell cmdlets for Site Slots](#PowerShell)
- [Azure Cross-Platform Command-Line Interface (xplat-cli) commands for Site Slots](#CLI)

<a name="Overview"></a>
##Overview##
The option to create site slots for Standard mode sites running on Microsoft Azure Web Sites enables a staged deployment workflow. Create development or staging site slots for each default production site (which now becomes a production slot) and swap these slots with no down time. Staged deployment is invaluable for the following scenarios:

- **Validating before deployment** - After you deploy content or configuration to a staging site slot, you can validate changes before swapping these changes to production.

- **Building and integrating site content** - You can incrementally add content updates to your staging deployment slot, and then swap the deployment slot into production when your updates are  completed.

- **Rolling back a production site** - If the changes swapped into production are not as you expected, you can swap the original content back to production right away. 

Microsoft Azure warms up all instances of the source site slot before the swap to production, eliminating cold starts when you deploy content. The traffic redirection is seamless, and no requests are dropped as a result of swap operations. Four deployment slots in addition to the default production slot are supported per Standard web site.   

<a name="Add"></a>
##To Add a Deployment Slot to a Web Site##

The site must be running in Standard mode to enable site slot creation. The Azure Web Sites platform supports 4 deployment slots in addition to the production slot per Standard web site. 

1. On the Quick Start page, or in the Quick Glance section of the Dashboard page for your web site, click **Add a new deployment slot**. 
	
	![Add a new deployment slot][QGAddNewDeploymentSlot]
	
	> [WACOM.NOTE]
	> If the web site is not already in Standard mode, you will receive the message **You must be in the standard mode to enable staged publishing**. At this point, you have the option to select **Upgrade** and navigate to the **Scale** tab of your web site before continuing.
	
2. The **Add New Deployment Slot** dialog appears.
	
	![Add New Deployment Slot dialog][AddNewDeploymentSlotDialog]
	
	Provide a name for the deployment slot. The name cannot exceed 60 alphanumeric characters. No special characters or spaces are allowed.
	
3. Use the **Configuration Source** option to clone web site configuration from the production site slot, from another existing deployment slot, or to choose to not clone any configuration at all. The default option is **Don't  clone configuration from an existing slot**.
	
	![Configuration Source][ConfigurationSource1]
	
	The first time you create a slot, you will only have two choices: clone configuration from the production main site, or none at all. 
	
	After you have created several slots, you will be able to clone configuration from a slot other than production:
	
	![Configuration sources][MultipleConfigurationSources]

4. Click the check mark to continue.
	
5. In the list of web sites, expand the mark to the left of your web site name to reveal the deployment slot. It will have the name of your production site followed in parentheses by the deployment slot name that you provided. 
	
	![Site List with Deployment Slot][SiteListWithStagedSite]
	
4. When you click the name of the deployment site slot, a page will open with a set of tabs just like any other web site. <strong><i>your-website-name</i>(<i>deployment-slot-name</i>)</strong> will appear at the top of the portal page to remind you that you are viewing the deployment site slot.
	
	![Deployment Slot Title][StagingTitle]
	
You can now update content and configuration for the deployment site slot. Use the publish profile or deployment credentials associated with the deployment site slot for content updates. 

<a name="AboutConfiguration"></a>
##About Configuration for Deployment Slots##
When you clone configuration from the production site or another slot, the cloned configuration is editable. The following lists show the configuration that will change when you swap slots.

**Configuration that will change on slot swap**:

- General settings
- Connection strings
- Handler mappings
- Monitoring and diagnostic settings

**Configuration that will not change on slot swap**:

- Publishing endpoints
- Custom Domain Names
- SSL certificates and bindings
- Scale settings

**Notes**:

- Deployment slots are only available for sites in Standard mode.

- If you change a site to Free, Shared, or Basic mode, it will no longer be swappable.

- A deployment slot that you intend to swap into production needs to be configured exactly as you want to have it in production.

- By default, a deployment slot will point to the same database as the production site. However, you can configure the deployment slot to point to an alternate database by changing the database connection string(s) for the deployment slot. You can then restore the original database connection string(s) on the deployment slot right before you swap it into production.


<a name="Swap"></a>
##To Swap Deployment Slots##

1. To swap deployment slots, select the deployment slot in the web sites list that you want to swap and click the **Swap** button in the command bar. 
	
	![Swap Button][SwapButtonBar]
	
2. The Swap Deployments dialog appears. The dialog lets you choose which site slot should be the source and which site should be the destination.
	
	![Swap Deployments Dialog][SwapDeploymentsDialog]
	
3. Click the checkmark to complete the operation. When the operation finishes, the site slots have been swapped.


<a name="Rollback"></a>
##To Rollback a Production Site to Staging##
If any errors are identified for the content or configuration swapped to production, you can simply swap a deployment slot (formerly your production site) back into production, and then make further fixes to the new version of your site while it is in staging mode. 

> [WACOM.NOTE]
> For a rollback to be successful, the deployment site slot must still contain the unaltered content and configuration of the previous production site.

<a name="Delete"></a>
##To Delete a Site Slot##

In the command bar at the bottom of the Azure Web Sites portal page, click **Delete**. You will be given the option to delete the web site and all deployment slots, or delete only the deployment slot. 

![Delete a Site Slot][DeleteStagingSiteButton]

After you answer **Yes** to the confirmation message, one or all slots will be deleted, depending on the option that you chose.

**Notes**:

- Scaling is not available for non-production site slots. It is only available for production site slots.

- Linked resource management is not supported for non-production site slots. 

- You can still publish directly to your production site slot if you wish.

- By default, your deployment slots (sites) share the same resources as your production slots (sites) and run on the same VMs. If you run stress testing on a stage slot, your production environment will experience a comparable stress load. 
	
	> [WACOM.NOTE] In the [Azure Preview Portal](https://portal.azure.com) only, you can avoid this potential impact on a production slot by temporarily moving the non-production slot to a different Web Hosting Plan. Note that the test and production slots must once again share the same Web Hosting Plan before you can swap the test slot into production.

<!-- ======== AZURE POWERSHELL CMDLETS =========== -->

<a name="PowerShell"></a>
##Azure PowerShell cmdlets for Site Slots 

Azure PowerShell is a module that provides cmdlets to manage Azure through Windows PowerShell, including support for managing Azure Web Sites deployment slots. 

- For information on installing and configuring Azure PowerShell, and on authenticating Azure PowerShell with your Windows Azure subscription, see [How to install and configure Windows Azure PowerShell](http://www.windowsazure.com/en-us/documentation/articles/install-configure-powershell).  

- To list the cmdlets available for Azure Web Sites in PowerShell, call `help AzureWebsite`. 

----------

###Get-AzureWebsite
The **Get-AzureWebsite** cmdlet presents information about Azure web sites for the current subscription, as in the following example. 

`Get-AzureWebsite siteslotstest`

----------

###New-AzureWebsite
You can create a site slot for any web site in Standard mode by using the **New-AzureWebsite** cmdlet and specifying the names of both the site and slot. Also indicate the same region as the site for deployment slot creation, as in the following example. 

`New-AzureWebsite siteslotstest -Slot staging -Location "West US"`

----------

###Publish-AzureWebsiteProject
You can use the **Publish-AzureWebsiteProject** cmdlet for content deployment, as in the following example. 

`Publish-AzureWebsiteProject -Name siteslotstest -Slot staging -Package [path].zip`

----------

###Show-AzureWebsite
After content and configuration updates have been applied to the new slot, you can validate the updates by browsing to the slot using the **Show-AzureWebsite** cmdlet, as in the following example.

`Show-AzureWebsite -Name siteslotstest -Slot staging`

----------

###Switch-AzureWebsiteSlot
The **Switch-AzureWebsiteSlot** cmdlet can perform a swap operation to make the updated deployment slot the production site, as in the following example. The production site will not experience any down time, nor will it undergo a cold start. 

`Switch-AzureWebsiteSlot -Name siteslotstest`

----------

###Remove-AzureWebsite
If a deployment slot is no longer needed, it can be deleted by using the **Remove-AzureWebsite** cmdlet, as in the following example.

`Remove-AzureWebsite -Name siteslotstest -Slot staging` 

----------

<!-- ======== XPLAT-CLI =========== -->

<a name="CLI"></a>
##Azure Cross-Platform Command-Line Interface (xplat-cli) commands for Site Slots

The Azure Cross-Platform Command-Line Interface (xplat-cli) provides cross-platform commands for working with Azure, including support for managing deployment slots on Azure Web Sites. 

- For instructions on installing and configuring the xplat-cli, including information on how to connect xplat-cli to your Azure subscription, see [Install and Configure the Azure Cross-Platform Command-Line Interface](http://www.windowsazure.com/en-us/documentation/articles/xplat-cli). 

-  To list the commands available for Azure Web Sites in the xplat-cli, call `azure site -h`. 

----------
###azure site list
For information about the Azure web sites in the current subscription, call **azure site list**, as in the following example.
 
`azure site list siteslotstest`

----------
###azure site create
To create a site slot for any web site in Standard mode, call **azure site create** and specify the name of an existing site and the name of the slot to create, as in the following example.

`azure site create siteslotstest --slot staging`

To enable source control for the new slot, use the **--git** option, as in the following example.
 
`azure site create –-git siteslotstest --slot staging`

----------
###azure site swap
To make the updated deployment slot the production site, use the **azure site swap** command to perform a swap operation, as in the following example. The production site will not experience any down time, nor will it undergo a cold start. 

`azure site swap siteslotstest`

----------
###azure site delete
To delete a deployment slot that is no longer needed, use the **azure site delete** command, as in the following example.

`azure site delete siteslotstest --slot staging`

----------
## Next Steps ##
To get started with Azure, see [Microsoft Azure Free Trial](http://azure.microsoft.com/en-us/pricing/free-trial/).


<!-- IMAGES -->
[QGAddNewDeploymentSlot]:  ./media/web-sites-staged-publishing/QGAddNewDeploymentSlot.png
[AddNewDeploymentSlotDialog]: ./media/web-sites-staged-publishing/AddNewDeploymentSlotDialog.png
[ConfigurationSource1]: ./media/web-sites-staged-publishing/ConfigurationSource1.png
[MultipleConfigurationSources]: ./media/web-sites-staged-publishing/MultipleConfigurationSources.png
[SiteListWithStagedSite]: ./media/web-sites-staged-publishing/SiteListWithStagedSite.png
[StagingTitle]: ./media/web-sites-staged-publishing/StagingTitle.png
[SwapButtonBar]: ./media/web-sites-staged-publishing/SwapButtonBar.png
[SwapConfirmationDialog]:  ./media/web-sites-staged-publishing/SwapConfirmationDialog.png
[DeleteStagingSiteButton]: ./media/web-sites-staged-publishing/DeleteStagingSiteButton.png
[SwapDeploymentsDialog]: ./media/web-sites-staged-publishing/SwapDeploymentsDialog.png
