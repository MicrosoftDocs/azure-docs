<properties
	pageTitle="Set up staging environments for web apps in Azure App Service"
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
	ms.date="04/29/2015"
	ms.author="cephalin"/>

# Set up staging environments for web apps in Azure App Service
<a name="Overview"></a>

When you deploy your web app to [App Service](http://go.microsoft.com/fwlink/?LinkId=529714), you can deploy to a separate deployment slot instead of the default production slot when running in the **Standard** or **Premium** App Service plan mode. Deployment slots are actually live web apps with their own hostnames. Web app content and configurations elements can be swapped between two deployment slots, including the production slot. Deploying your application to a deployment slot has the following benefits:

- You can validate web app changes in a staging deployment slot before swapping it with the production slot.

- Deploying a web app to a slot first and swapping it into production ensures that all instances of the slot are warmed up before being swapped into production. This eliminates downtime when you deploy your web app. The traffic redirection is seamless, and no requests are dropped as a result of swap operations. This entire workflow can be automated by configuring [Auto Swap](#configure-auto-swap-for-your-web-app) when pre-swap validation is not needed.

- After a swap, the slot with previously staged web app now has the previous production web app. If the changes swapped into the production slot are not as you expected, you can perform the same swap immediately to get your "last known good site" back.

Each App Service plan mode supports a different number of deployment slots. To find out the number of slots your web app's mode supports, see [App Service Pricing](/pricing/details/app-service/). 

- When your web app has multiple slots, you cannot change the mode.

- Scaling is not available for non-production slots.

- Linked resource management is not supported for non-production slots.

	> [AZURE.NOTE] In the [Azure preview portal](http://go.microsoft.com/fwlink/?LinkId=529715) only, you can avoid this potential impact on a production slot by temporarily moving the non-production slot to a different App Service plan mode. Note that the non-production slot must once again share the same mode with the production slot before you can swap the two slots.

<a name="Add"></a>
## Add a deployment slot to a web app ##

The web app must be running in the **Standard** or **Premium** mode in order for you to enable multiple deployment slots.

1. In the [Azure Preview Portal](https://portal.azure.com/), open your web app's blade.
2. Click **Deployment slots**. Then, in the **Deployment slots** blade, click **Add Slot**.

	![Add a new deployment slot][QGAddNewDeploymentSlot]

	> [AZURE.NOTE]
	> If the web app is not already in the **Standard** or **Premium** mode, you will receive a message indicating the supported modes for enabling staged publishing. At this point, you have the option to select **Upgrade** and navigate to the **Scale** tab of your web app before continuing.

2. In the **Add a slot** blade, give the slot a name, and select whether to clone web app configuration from another existing deployment slot. Click the check mark to continue.

	![Configuration Source][ConfigurationSource1]

	The first time you add a slot, you will only have two choices: clone configuration from the default slot in production or not at all.

	After you have created several slots, you will be able to clone configuration from a slot other than the one in production:

	![Configuration sources][MultipleConfigurationSources]

5. In the **Deployment slots** blade, click the deployment slot to open a blade for the slot, with a set of metrics and configuration just like any other web app. <strong><i>your-web-app-name</i>-<i>deployment-slot-name</i></strong> will appear at the top of blade to remind you that you are viewing the deployment slot.

	![Deployment Slot Title][StagingTitle]

5. Click the app URL in the slot's blade. Notice the the deployment slot has its own hostname and is also a live app. To limit public access to the deployment slot, see [App Service Web App – block web access to non-production deployment slots](http://ruslany.net/2014/04/azure-web-sites-block-web-access-to-non-production-deployment-slots/).

There is no content after deployment slot creation. You can deploy to the slot from a different repository branch, or an altogether different repository. You can also change the slot's configuration. Use the publish profile or deployment credentials associated with the deployment slot for content updates.  For example, you can [publish to this slot with git](web-sites-publish-source-control.md).

<a name="AboutConfiguration"></a>
## Configuration for deployment slots ##
When you clone configuration from another deployment slot, the cloned configuration is editable. Furthermore, some configuration elements will follow the content across a swap (not slot specific) while other configuration elements will stay in the same slot after a swap (slot specific). The following lists show the configuration that will change when you swap slots.

**Settings that are swapped**:

- General settings - such as framework version, 32/64-bit, Web sockets
- App settings (can be configured to stick to a slot)
- Connection strings (can be configured to stick to a slot)
- Handler mappings
- Monitoring and diagnostic settings
- WebJobs content

**Settings that are not swapped**:

- Publishing endpoints
- Custom Domain Names
- SSL certificates and bindings
- Scale settings
- WebJobs schedulers

To configure an app setting or connection string to stick to a slot (not swapped), access the **Application Settings** blade for a specific slot, then select the **Slot Setting** box for the configuration elements that should stick the slot. Note that marking a configuration element as slot specific has the effect of establishing that element as not swappable across all the deployment slots associated with the web app.

![Slot settings][SlotSettings]

<a name="Swap"></a>
## To swap deployment slots ##

>[AZURE.IMPORTANT] Before you swap a web app from a deployment slot into production, make sure that all non-slot specific settings are configured exactly as you want to have it in the swap target.

1. To swap deployment slots, click the **Swap** button in the command bar of the web app or in the command bar of a deployment slot. Make sure that the swap source and swap target are set properly. Usually, the swap target would be the production slot.  

	![Swap Button][SwapButtonBar]

3. Click **OK** to complete the operation. When the operation finishes, the deployment slots have been swapped.

## Configure Auto Swap for your web app ##

Auto Swap streamlines DevOps scenarios where you want to continuously deploy your web app with zero cold start and zero downtime for end customers of the web app. When a deployment slot is configured for Auto Swap into production, every time you push your code update to that slot, App Service will automatically swap the web app into production after it has already warmed up in the slot.

>[AZURE.IMPORTANT] When you enable Auto Swap for a slot, make sure the slot configuration is exactly the configuration intended for the target slot (usually the production slot).

Configuring Auto Swap for a slot is easy. Follow the steps below:

1. In the **Deployment Slots** blade, select a non-production slot, click **All Settings** for that slot's blade.  

	![][Autoswap1]

2. Click **Application Settings**. Select **On** for **Auto Swap**, select the desired target slot in **Auto Swap Slot**, and click **Save** in the command bar. Make sure configuration for the slot is exactly the configuration intended for the target slot.

	The **Notifications** tab will flash a green **SUCCESS** once the operation is complete.

	![][Autoswap2]

	>[AZURE.NOTE] To test Auto Swap for your web app, you can first select a non-production target slot in **Auto Swap Slot** to become familiar with the feature.  

3. Execute a code push to that deployment slot. Auto Swap will happen after a short time and the update will be reflected at your target slot's URL.

<a name="Rollback"></a>
## To rollback a production app after swap ##
If any errors are identified in production after a slot swap, roll the slots back to their pre-swap states by swapping the same two slots immediately.

<a name="Delete"></a>
## To delete a deployment slot##

In the blade for a deployment slot, click **Delete** in the command bar.  

![Delete a Deployment Slot][DeleteStagingSiteButton]

<!-- ======== AZURE POWERSHELL CMDLETS =========== -->

<a name="PowerShell"></a>
## Azure PowerShell cmdlets for deployment slots

Azure PowerShell is a module that provides cmdlets to manage Azure through Windows PowerShell, including support for managing web app deployment slots in Azure App Service.

- For information on installing and configuring Azure PowerShell, and on authenticating Azure PowerShell with your Azure subscription, see [How to install and configure Microsoft Azure PowerShell](install-configure-powershell.md).  

- To list the cmdlets available for Azure App Service in PowerShell, call `help AzureWebsite`.

----------

### Get-AzureWebsite
The **Get-AzureWebsite** cmdlet presents information about Azure web apps for the current subscription, as in the following example.

`Get-AzureWebsite webappslotstest`

----------

### New-AzureWebsite
You can create a deployment slot by using the **New-AzureWebsite** cmdlet and specifying the names of both the web app and slot. Also indicate the same region as the web app for deployment slot creation, as in the following example.

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

The Azure Cross-Platform Command-Line Interface (xplat-cli) provides cross-platform commands for working with Azure, including support for managing Web App deployment slots.

- For instructions on installing and configuring the xplat-cli, including information on how to connect xplat-cli to your Azure subscription, see [Install and Configure the Azure Cross-Platform Command-Line Interface](xplat-cli.md).

-  To list the commands available for Azure App Service in the xplat-cli, call `azure site -h`.

----------
### azure site list
For information about the web apps in the current subscription, call **azure site list**, as in the following example.

`azure site list webappslotstest`

----------
### azure site create
To create a deployment slot, call **azure site create** and specify the name of an existing web app and the name of the slot to create, as in the following example.

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

>[AZURE.NOTE] If you want to get started with Azure App Service before signing up for an Azure account, go to [Try App Service](http://go.microsoft.com/fwlink/?LinkId=523751), where you can immediately create a short-lived starter web app in App Service. No credit cards required; no commitments.

## Next Steps ##
[Azure App Service Web App – block web access to non-production deployment slots](http://ruslany.net/2014/04/azure-web-sites-block-web-access-to-non-production-deployment-slots/)

[Microsoft Azure Free Trial](/pricing/free-trial/)

## What's changed
* For a guide to the change from Websites to App Service see: [Azure App Service and Its Impact on Existing Azure Services](http://go.microsoft.com/fwlink/?LinkId=529714)
* For a guide to the change of the old portal to the new portal see: [Reference for navigating the preview portal](http://go.microsoft.com/fwlink/?LinkId=529715)

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
[SlotSettings]: ./media/web-sites-staged-publishing/SlotSetting.png
