<properties 
   pageTitle="Configuring Azure Automation"
   description="Describes steps that you must perform to configure Azure Automation for initial use."
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
   ms.date="04/13/2015"
   ms.author="bwren" />

# Configuring Azure Automation

This article describes the actions you must perform to initially start using Azure Automation.

## Automation accounts

When you start Azure Automation for the first time, you must create at least one Automation account. Automation accounts allow you to isolate your Automation resources (runbooks, assets) from the Automation resources contained in other Automation accounts. You can use Automation accounts to separate Automation resources into separate logical environments. For example, you might use one account for development and another for production.

The Automation resources for each Automation account are associated with a single Azure region, but Automation accounts can manage Azure services in any region. The main reason to create Automation accounts in different regions would be if you have policies that require data and resources to be isolated to a specific region.

An Automation account may be suspended if there is an issue with your Azure account, such as an overdue payment. In this case, you can’t access the account, any running jobs will be suspended, and all schedules will be disabled. You will be able to view the account, but you won’t be able to see any resources in it. Once you correct the issue and the Automation account is enabled, you will have to enable your schedules and restart any runbooks that were suspended.


## Configuring authentication to Azure resources

When you access Azure resources using the [Azure cmdlets](http://msdn.microsoft.com/library/azure/jj554330.aspx), you need to provide authentication to your Azure subscription. In Azure Automation, this is done with an organizational account in Azure Active Directory that you configure as an administrator for your subscription. You can then create a [credential](http://msdn.microsoft.com/library/dn940015.aspx) for this user account and use it with [Add-AzureAccount](http://msdn.microsoft.com/library/azure/dn722528.aspx) in your runbook.

>[AZURE.NOTE] Microsoft accounts, formerly known as LiveIDs, cannot be used with Azure Automation.

## Create a new Azure Active Directory user to manage an Azure subscription

1. Log in to the Azure portal as a service administrator for the Azure subscription you want to manage.
2. Select **Active Directory**
3. Select the directory name that is associated with your Azure subscription. If necessary, you can change this association from **Settings > Subscriptions > Edit Directory**.
4. [Create a new Active Directory user](http://msdn.microsoft.com/library/azure/hh967632.aspx).  Select **New user in your organization** for the **Type of user** and do not **Enable Multi-Factor Authentication**.
5. Note the user’s full name and temporary password.
7. Select **Settings > Administrators > Add**.
8. Type the full user name of the user that you created.
9. Select the subscription that you want the user to manage.
10. Log out of Azure and then log back in with the account you just created. You will be prompted to change the user’s password.
11. Create a new [Azure Automation Credential asset](http://msdn.microsoft.com/library/dn940015.aspx) for the user account that you created. The **Credential Type** should be **Windows PowerShell Credential**.


## Use the credential in a runbook

You can retrieve the credential in a runbook using the [Get-AutomationPSCredential](http://msdn.microsoft.com/library/dn940015.aspx) activity and then use it with [Add-AzureAccount](http://msdn.microsoft.com/library/azure/dn722528.aspx) to connect to your Azure subscription. If the credential is an administrator of multiple Azure subscriptions, then you should also use [Select-AzureSubscription](http://msdn.microsoft.com/library/dn495203.aspx) to specify the correct one. This is shown in the sample Windows PowerShell below that will typically appear at the top of most Azure Automation runbooks.

    $cred = Get-AutomationPSCredential –Name "myuseraccount.onmicrosoft.com"
	Add-AzureAccount –Credential $cred
	Select-AzureSubscription –SubscriptionName "My Subscription"

You should repeat these lines after any [checkpoints](automation-runbook-execution/#checkpoints) in your runbook. If the runbook is suspended and then resumes on another worker, then it will need to perform the authentication again.

# Related articles
- [Azure Automation: Authenticating to Azure using Azure Active Directory](http://azure.microsoft.com/blog/2014/08/27/azure-automation-authenticating-to-azure-using-azure-active-directory/) 

