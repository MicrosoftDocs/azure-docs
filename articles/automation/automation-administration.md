<properties 
   pageTitle="Azure Automation administration"
   description="This article contains multiple topics for administering an Azure Automation environment.  Currently includes Data Retention and Backing up Azure Automation."
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
   ms.date="10/01/2015"
   ms.author="bwren" />

# Azure Automation administration

This article contains multiple topics for administering an Azure Automation environment.

## Data retention

When you delete a resource in Azure Automation, it is retained for 90 days for auditing purposes before being removed permanently.  You can’t see or use the resource during this time.  This policy also applies to resources that belong to an automation account that is deleted.

Azure Automation automatically deletes and permanently removes jobs older than 90 days.

The following table summarizes the retention policy for different resources.

|Data|Policy|
|:---|:---|
|Accounts|Permanently removed 90 days after the account is deleted by a user.|
|Assets|Permanently removed 90 days after the asset is deleted by a user, or 90 days after the account that holds the asset is deleted by a user.|
|Modules|Permanently removed 90 days after the module is deleted by a user, or 90 days after the account that holds the module is deleted by a user.|
|Runbooks|Permanently removed 90 days after the resource is deleted by a user, or 90 days after the account that holds the resource is deleted by a user.|
|Jobs|Deleted and permanently removed 90 days after last being modified. This could be after the job completes, is stopped, or is suspended.|

The retention policy applies to all users and currently cannot be customized.

## Backing up Azure Automation

When you delete an automation account in Microsoft Azure, all objects in the account are deleted including runbooks, modules, settings, jobs, and assets. The objects cannot be recovered after the account is deleted.  You can use the following information to backup the contents of your automation account before deleting it. 

### Runbooks

You can export your runbooks to script files using either the Azure Management Portal or the [Get-AzureAutomationRunbookDefinition](https://msdn.microsoft.com/library/dn690269.aspx) cmdlet in Windows PowerShell.  These script files can be imported into another automation account as discussed in [Creating or Importing a Runbook](https://msdn.microsoft.com/library/dn643637.aspx).


### Integration modules

You cannot export integration modules from Azure Automation.  You must ensure that they are available outside of the automation account.

### Assets

You cannot export [assets](https://msdn.microsoft.com/library/dn939988.aspx) from Azure Automation.  Using the Azure Management Portal, you must note the details of variables, credentials, certificates, connections, and schedules.  You must then manually create any assets that are used by runbooks that you import into another automation.

You can use [Azure cmdlets](https://msdn.microsoft.com/library/dn690262.aspx) to retrieve details of unencrypted assets and either save them for future reference or create equivalent assets in another automation account.

You cannot retrieve the value for encrypted variables or the password field of credentials using cmdlets.  If you don't know these values, then you can retrieve them from a runbook using the [Get-AutomationVariable](https://msdn.microsoft.com/library/dn940012.aspx) and [Get-AutomationPSCredential](https://msdn.microsoft.com/library/dn940015.aspx) activities.

You cannot export certificates from Azure Automation.  You must ensure that any certificates are available outside of Azure.

