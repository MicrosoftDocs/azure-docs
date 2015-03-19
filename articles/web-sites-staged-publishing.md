<properties 
	pageTitle="Deploy to Staging Environments for Web Apps in Azure App Service" 
	description="Learn how to use staged publishing for web apps in Azure App Service." 
	services="app-service\web" 
	documentationCenter="" 
	authors="cephalin" 
	writer="cephalin" 
	manager="wpickett" 
	editor="mollybos"/>

<tags 
	ms.service="app-service-web" 
	ms.workload="web" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="03/24/2015" 
	ms.author="cephalin"/>

<a name="Overview"></a>
# Deploy to Staging Environments for Web Apps in Azure App Service

When you deploy your web app to Azure App Service, you can deploy to a separate deployment slot instead of the default production slot, which are actually live web apps with their own hostnames. This option is available in any **Standard** App Service plan mode. Furthermore, you can swap the apps and app configurations between two deployment slots, including the production slot. Deploying your application to a deployment slot has the following benefits:

- You can validate web app changes in a staging deployment slot before swapping it with the production slot.

- After a swap, the slot with previously staged web app now has the previous production web app. If the changes swapped into the production slot are not as you expected, you can perform the same swap immediately to get your "last known good site" back. 
 
- Deploying a web app to a slot first and swapping it into production ensures that all instances of the slot are warmed up before being swapped into production. This eliminates downtime when you deploy your web app. The traffic redirection is seamless, and no requests are dropped as a result of swap operations. This entire workflow can be automated simply by configuring [Auto Swap](#Configure-Auto-Swap-for-your-web-app). 

## Deployment Slots Support Details ##

Four deployment slots in addition to the production slot are supported for each web app in the **Standard** mode. 

- Multiple deployment slots are only available for web apps in the **Standard** mode. When your web app has multiple slots, you cannot change the mode.

- Scaling is not available for non-production slots.

- Linked resource management is not supported for non-production slots. 

- By default, your deployment slots share the same resources as your production slots and run on the same VMs. If you run stress testing on a stage slot, your production environment will experience a comparable stress load. 
	
	> [AZURE.NOTE] In the [Azure Preview Portal](https://portal.azure.com) only, you can avoid this potential impact on a production slot by temporarily moving the non-production slot to a different App Service plan mode. Note that the non-production slot must once again share the same mode with the production slot before you can swap the two slots.

<a name="Add"></a>
## Add a deployment slot to a web app ##

The web app must be running in the **Standard** mode to enable multiple deployment slots. 

1. In the [Azure Preview Portal](https://portal.azure.com/), open your web app's blade.
2. Click **Deployment slots**. Then, in the **Deployment slots** blade, click **Add Slot**. 
	
	![Add a new deployment slot][QGAddNewDeploymentSlot]
	
	> [AZURE.NOTE]
	> If the web app is not already in **Standard** mode, you will receive the message **You must be in the standard mode to enable staged publishing**. At this point, you have the option to select **Upgrade** and navigate to the **Scale** tab of your web app before continuing.
	
2. In the **Add a slot** blade, give the slot a name, and select whether to clone web app configuration from another existing deployment slot. Click the check mark to continue. 
	
	![Configuration Source][ConfigurationSource1]
	
	The first time you add a slot, you will only have two choices: clone configuration from the default slot in production or not at all. 
	
	After you have created several slots, you will be able to clone configuration from a slot other than the one in production:
	
	![Configuration sources][MultipleConfigurationSources]

5. In the **Deployment slots** blade, click the deployment slot to open a blade for the slot, with a set of metrics and configuration just like any other web app. <strong><i>your-web-app-name</i>-<i>deployment-slot-name</i></strong> will appear at the top of blade to remind you that you are viewing the deployment slot.
	
	![Deployment Slot Title][StagingTitle]
	
5. Click the app URL in the slot's blade. Notice the the deployment slot has its own hostname and is also a live app. To limit public access to the deployment slot, see [App Service Web App – block web access to non-production deployment slots](http://ruslany.net/2014/04/azure-web-sites-block-web-access-to-non-production-deployment-slots/).

There is no content. You can deploy to the slot from a different repository branch, or an altogether different repository. You can also change the slot's configuration. Use the publish profile or deployment credentials associated with the deployment slot for content updates.  For example, you can [publish to this slot with git](../web-sites-publish-source-control/).

<a name="AboutConfiguration"></a>
## Configuration for Deployment Slots ##
When you clone configuration from another deployment slot, the cloned configuration is editable. Furthermore, some settings will follow the content across a swap (not slot specific) while other settings will stay in the same slot after a swap (slot specific). The following lists show the configuration that will change when you swap slots.

**Settings that are swapped**:

- General settings - such as framework version, 32/64-bit, Web sockets 
- App settings (can be configured to stick to a slot)
- Connection strings (can be configured to stick to a slot)
- Handler mappings
- Monitoring and diagnostic settings
- Unscheduled WebJobs

**Settings that are not swapped**:

- Publishing endpoints
- Custom Domain Names
- SSL certificates and bindings
- Scale settings
- Scheduled WebJobs

<a name="Swap"></a>
## To Swap Deployment Slots ##

>[AZURE.IMPORTANT] Before you swap a staging web app from a deployment slot into production, make sure that all non-slot specific settings are configured exactly as you want to have it in production.

1. To swap deployment slots, click the **Swap** button in the command bar of the web app or in the command bar of a deployment slot. Make sure that the swap source and swap target are set properly. Usually, the swap target should be the production slot.  
	
	![Swap Button][SwapButtonBar]
	
3. Click **OK** to complete the operation. When the operation finishes, the deployment slots have been swapped.

## Configure Auto Swap for your web app ##

Auto Swap streamlines DevOps scenarios where you want to continuously deploy your web app with zero downtime. When a deployment slot is configured for Auto Swap into production, every time you push your code update to that slot, Web Apps will automatically swap the web app into production after it has already warmed up in the slot. This configuration removes any downtime in your customer's experience of the production web app through out the code update.

You can only configure Auto Swap for a non-production slot.

When you configure Auto Swap for a slot

>[AZURE.IMPORTANT] When you configure Auto Swap for a slot, make sure that the slot has identical configuration settings with the target slot (usually the production slot).

Configuring Auto Swap for a slot is easy. Follow the steps below:

1. In the **Deployment Slots** blade, select a non-production slot, click **All Settings** for that slot's blade.  

	![][Autoswap1]

2. Click **Application Settings**. Select **On** for **Auto Swap**, select the desired target slot in **Auto Swap Slot**, and click **Save** in the command bar. Make sure that the application settings for your slot is identical to those of the target slot.

	The **Notifications** tab will flash a green **SUCCESS** once the operation is complete.

	![][Autoswap2]

	>[AZURE.NOTE] To test Auto Swap for your web app, you can select a non-production target slot in **Auto Swap Slot** to determine the target slot's responsiveness to user requests across a code push.  

3. Execute a code push to that deployment slot. Auto Swap will happen after a short time and the update will be reflected at your target slot's URL.

<a name="Rollback"></a>
## To Rollback a Production App to Staging ##
If any errors are identified in production after a slot swap, roll the slots back to their pre-swap states by swapping the same two slots immediately. 

<a name="Delete"></a>
## To Delete a Deployment Slot##

In the blade for a deployment slot, click **Delete** in the command bar.  

![Delete a Deployment Slot][DeleteStagingSiteButton]

<!-- ======== AZURE POWERSHELL CMDLETS =========== -->

<a name="PowerShell"></a>
## Azure PowerShell cmdlets for Deployment Slots 

Azure PowerShell is a module that provides cmdlets to manage Azure through Windows PowerShell, including support for managing web app deployment slots in Azure App Service. 

- For information on installing and configuring Azure PowerShell, and on authenticating Azure PowerShell with your Azure subscription, see [How to install and configure Microsoft Azure PowerShell](../install-configure-powershell/).  

- To list the cmdlets available for Azure App Service in PowerShell, call `help AzureWebsite`. 

----------

### Get-AzureWebsite
The **Get-AzureWebsite** cmdlet presents information about Azure web apps for the current subscription, as in the following example. 

`Get-AzureWebsite webappslotstest`

----------

### New-AzureWebsite
You can create a deployment slot for any web app in **Standard** mode by using the **New-AzureWebsite** cmdlet and specifying the names of both the web app and slot. Also indicate the same region as the web app for deployment slot creation, as in the following example. 

`New-AzureWebsite webappslotstest -Slot staging -Location "West US"`

----------

### Publish-AzureWebsiteProject
You can use the **Publish-AzureWebsiteProject** cmdlet for content deployment, as in the following example. 

`Publish-AzureWebsiteProject -Name webappslotstest -Slot staging -Package [path].zip`

----------

### Show-AzureWebsite
After content and configuration updates have been applied to the new slot, you can validate the updates by browsing to the slot using the **Show-AzureWebsite** cmdlet, as in the following example.

`Show-AzureWebsite -Name webappslotstest -Slot staging`

----------

### Switch-AzureWebsiteSlot
The **Switch-AzureWebsiteSlot** cmdlet can perform a swap operation to make the updated deployment slot the production site, as in the following example. The production app will not experience any down time, nor will it undergo a cold start. 

`Switch-AzureWebsiteSlot -Name webappslotstest`

----------

### Remove-AzureWebsite
If a deployment slot is no longer needed, it can be deleted by using the **Remove-AzureWebsite** cmdlet, as in the following example.

`Remove-AzureWebsite -Name webappslotstest -Slot staging` 

----------

<!-- ======== XPLAT-CLI =========== -->

<a name="CLI"></a>
## Azure Cross-Platform Command-Line Interface (xplat-cli) commands for Deployment Slots

The Azure Cross-Platform Command-Line Interface (xplat-cli) provides cross-platform commands for working with Azure, including support for managing deployment slots on Web App. 

- For instructions on installing and configuring the xplat-cli, including information on how to connect xplat-cli to your Azure subscription, see [Install and Configure the Azure Cross-Platform Command-Line Interface](../xplat-cli/). 

-  To list the commands available for Azure App Service in the xplat-cli, call `azure site -h`. 

----------
### Azure site list
For information about the web apps in the current subscription, call **azure site list**, as in the following example.
 
`azure site list webappslotstest`

----------
### azure site create
To create a deployment slot for any web app in **Standard** mode, call **azure site create** and specify the name of an existing web app and the name of the slot to create, as in the following example.

`azure site create webappslotstest --slot staging`

To enable source control for the new slot, use the **--git** option, as in the following example.
 
`azure site create --git webappslotstest --slot staging`

----------
### azure site swap
To make the updated deployment slot the production app, use the **azure site swap** command to perform a swap operation, as in the following example. The production app will not experience any down time, nor will it undergo a cold start. 

`azure site swap webappslotstest`

----------
### azure site delete
To delete a deployment slot that is no longer needed, use the **azure site delete** command, as in the following example.

`azure site delete webappslotstest --slot staging`

----------
## Next Steps ##
[Azure App Service Web App – block web access to non-production deployment slots](http://ruslany.net/2014/04/azure-web-sites-block-web-access-to-non-production-deployment-slots/)

[Microsoft Azure Free Trial](/pricing/free-trial/)


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
[Autoswap1]: ./media/web-sites-staged-publishing/AutoSwap01.png
[Autoswap2]: ./media/web-sites-staged-publishing/AutoSwap02.png
