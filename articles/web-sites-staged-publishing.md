<properties linkid="web-sites-staged-publishing" urlDisplayName="How to stage sites on Windows Azure" pageTitle="Staged Publishing on Windows Azure Web Sites" metaKeywords="Windows Azure Web Sites, Staged Publishing, Site Slots" description="Learn how to use staged publishing on Windows Azure Web Sites." metaCanonical="" services="web-sites" documentationCenter="" title="Staged Publishing on Windows Azure Web Sites" authors=""  solutions="" writer="timamm" manager="paulettm" editor="mollybos"  />

#Staged Publishing on Windows Azure Web Sites#

## Table of Contents ##
- [Overview](#Overview)
- [To Enable Staged Publishing for a Web Site](#Enable)
- [About Configuration for Staged and Production Sites](#AboutConfiguration)
- [To Swap the Staging Site Slot with the Production Site Slot](#Swap)
- [To Rollback a Production Site to Staging](#Rollback)
- [To Delete a Staging Site](#Delete)

<a name="Overview"></a>
##Overview##
The option to create multiple site slots with Standard mode sites running on Windows Azure Web Sites enables you to perform staged publishing. Staged publishing creates a staging site slot for each default production site (which now becomes a production slot) and enables you to swap these slots with no down time. Staged publishing is invaluable for the following scenarios:

- **Validating before deployment** - After you deploy content or configuration to a staging site slot, you can validate changes before swapping these changes to production.

- **Building and integrating site content** - You can incrementally add content updates to your staging site slot, and then swap the staging site slot into production when your updates are  completed.

- **Rolling back a production site** - If the changes swapped into production are not as you expected, you can swap the original content back to production right away. 

A Windows Azure Web Sites site slot swap warms up all instances of the staging slot before the swap to production, eliminating cold starts when you deploy content. The traffic redirection is seamless, and no requests are dropped as a result of swap operations. Currently, only one site slot in addition to the default production slot is supported per Standard web site.

<a name="Enable"></a>
##To Enable Staged Publishing for a Web Site##

The site must be in the Standard mode to enable staged publishing.

1. On the Quick Start page, or in the Quick Glance section of the Dashboard page for your web site, click **Enable staged publishing**. 
	
	![Enable Staged Publishing][EnableStagedPub]
		
	<div class="dev-callout">
	<strong>Note</strong>
	<p>If your site is not already in Standard mode, you will receive the message <strong>You must be in the standard mode to enable staged publishing</strong>. At this point, you have the option to select <strong>Upgrade</strong> and upgrade the site on the <strong>Scale</strong> tab of your web site before continuing.</p></div>
	
2. When prompted **Are you sure you want to enable staged publishing for the web site '**[your website name]**'**, choose **Yes**.

3. In the list of web sites, expand the mark to the left of your web site name to reveal the staging site slot. It will have the name of your site followed by **(staging)**. 
	
	![Site List with Staging Site][SiteListWStagedSite]
	
4. When you select the name of the staging site slot, a page will open with a set of tabs just like any other web site. ***your-website-name* (staging)** will appear at the top of the portal page to remind you that you are viewing the staging site slot.
	
	![Staging Site Title][StagingTitle]
	
You can now add and update content for the staging site slot using the publish profile or deployment credentials associated with the staging site slot. 

<a name="AboutConfiguration"></a>
##About Configuration for Staged and Production Sites##
When a staging site slot is created, the configuration for the staging site slot is cloned from the production site slot by default. Configuration for all site slots is editable.

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

- Staged publishing is only available for sites in Standard mode.

- If you change a site to Free mode or Shared mode, it will no longer be swappable.

- Your staged site needs to be configured exactly as you want to have it in production.

<a name="Swap"></a>
##To Swap the Staging Site Slot with the Production Site Slot##

1. To swap the staging site slot to production, select the staging site slot in the web sites list and click the **Swap** button in the command bar. 
	
	![Swap Button][SwapButtonBar]
	
2. An "Are you sure you want to swap web site deployments?" confirmation dialog will appear, reminding you of the configuration that will change and the configuration that will not change. 
	
	![Swap Confirmation Dialog][SwapConfirmationDialog]
	
3. After you answer **Yes**, the site slot that was in production now becomes your staging site slot.

	<div class="dev-callout">
	<strong>Note</strong>
	<p>To swap the production site slot to staging, simply select the production site in the web site list before choosing <strong>Swap</strong>.</p>
	</div>

<a name="Rollback"></a>
##To Rollback a Production Site to Staging##
If any errors are identified for the content or configuration swapped to production, you can simply swap the staging site slot (formerly your production site) back into production, and then make further fixes to the new version of your site while it is in staging mode. 

<div class="dev-callout">
<strong>Note</strong>
<p>For a rollback to be successful, the staging site slot must still contain the unaltered content and configuration of the previous production site.</p>
</div>

<a name="Delete"></a>
##To Delete a Staging Site##

In the command bar at the bottom of the Windows Azure Web Sites portal page, click **Delete**. You will be given the option to delete both production and staging sites, or delete the staging site only. 

![Delete Staging Site][DeleteStagingSiteButton]

After you answer **Yes** to the confirmation message, one or both sites will be deleted, depending on the option that you chose.

**Notes**:

- AutoScale is not available for non-production site slots. It is only available for production site slots.

- Linked resource management is not supported for non-production site slots. 

- You can still publish directly to your production site slot if you wish. 

<!-- IMAGES -->
[EnableStagedPub]:  ./media/web-sites-staged-publishing/EnableStagedPub.png
[SiteListWStagedSite]: ./media/web-sites-staged-publishing/SiteListWStagedSite.png
[StagingTitle]: ./media/web-sites-staged-publishing/StagingTitle.png
[SwapButtonBar]: ./media/web-sites-staged-publishing/SwapButtonBar.png
[SwapConfirmationDialog]:  ./media/web-sites-staged-publishing/SwapConfirmationDialog.png
[DeleteStagingSiteButton]: ./media/web-sites-staged-publishing/DeleteStagingSiteButton.png