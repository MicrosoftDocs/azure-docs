<properties 
   pageTitle="Runbook Gallery"
   description="Runbook Gallery"
   services="automation"
   documentationCenter=""
   authors="bwren"
   manager="stevenka"
   editor="tysonn" />
<tags 
   ms.service="automation"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="03/16/2015"
   ms.author="bwren" />

# Runbook Gallery

The <a href ="http://gallery.technet.microsoft.com/scriptcenter/site/search?f[0].Type=RootCategory&f[0].Value=WindowsAzure&f[0].Text=Windows Azure&f[1].Type=SubCategory&f[1].Value=WindowsAzure_automation&f[1].Text=Automation">Runbook Gallery</a> provides a variety of runbooks from Microsoft and the community that you can import into Azure Automation. You can either download a runbook from the gallery which is hosted in the [TechNet Script Center](http://gallery.technet.microsoft.com/), or you can access a wizard from the Azure Portal to discover runbooks from the gallery and directly import them.

## Finding and Importing Runbooks in the Runbook Gallery

You can access the wizard to find and import a runbook from the Runbook Gallery when you select the option to create a new runbook. The detailed procedure is available in [To import a runbook from the Runbook Gallery](../automation-creating-or-importing-a-runbook#ImportGallery).

## Adding a Runbook to the Runbook Gallery

Microsoft encourages you to add runbooks to the Runbook Gallery that you think would be useful to other customers.  You can add a runbook by [uploading it to the Script Center](http://gallery.technet.microsoft.com/site/upload) with the following details.

- You must specify the Category Windows Azure and the Sub category Automation for the runbook to be displayed in the wizard.  Any script in the script center with that category and sub category is considered part of the Runbook Gallery and will be available to Azure Automation.

- The upload must be a single .ps1 file.  If the runbook requires any modules, child runbooks, or assets, then you should list those in the Description of the submission and in the comments section of the runbook.

- The Summary for the upload will be displayed in the Runbook Gallery results so you should provide detailed information that will help a user identify the functionality of the runbook.

- The runbook should follow [best practices for Automation runbooks](https://technet.microsoft.com/en-us/library/dn469262.aspx).

- You should assign one to three of the following Tags to the upload.  The runbook will be listed in the wizard under the categories that match its tags.  Any tags not on this list will be ignored by the wizard. If you don’t specify any matching tags, the runbook will be listed under the Other category.

 - Backup
 - Capacity Management
 - Change Control
 - Compliance
 - Dev / Test Environments
 - Disaster Recovery
 - Monitoring
 - Patching
 - Provisioning
 - Remediation
 - VM Lifecycle Management


## Frequently Asked Questions

### I just uploaded a runbook to Script Center, why don’t I see it in the Gallery?

Automation updates the Gallery once an hour, so you won’t see your contributions immediately.  If you don’t see your runbook in the gallery after an hour, check the requirements in the [Adding a Runbook to the Runbook Gallery](#AddRunbook) section.

### I can’t find what I’m looking for in the Gallery, how do I request a sample runbook?

You can request a script on [User Voice](http://feedback.azure.com/[forum](http://social.msdn.microsoft.com/Forums/windowsazure/en-US/home?forum=azureautomation&filter=alltypes&sort=lastpostdesc)s/246290-azure-automation).  If you need help writing a runbook or have a question about PowerShell Workflows post a question to our [forum](http://social.msdn.microsoft.com/Forums/windowsazure/en-US/home?forum=azureautomation&filter=alltypes&sort=lastpostdesc).

### Will I need to make any changes to a runbook from the gallery for it to work in my environment?

This depends on the runbook.  Some may be written to run in any environment without modification.  Others may require certain hardcoded values to be changed for your environment.  You may also import a runbook that doesn’t provide the exact functionality that you need but still provides a starting point saving you time in writing the script from scratch.

### How should I upload a collection of runbooks that work together?

Since Automation will only load a single .ps1 file from the gallery, you should upload each script separately. You should then list the names of the related runbooks in each of their descriptions. Make sure that you use the same tags so that they will show up in the same category. A user will have to read the description to know that other runbooks are required for this runbook to work.

