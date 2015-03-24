<properties 
   pageTitle="Configuring Azure for Management by Runbooks"
   description="Configuring Azure for Management by Runbooks"
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

# Configuring Azure for Management by Runbooks

When you access Azure resources using the [Azure cmdlets](http://aka.ms/runbookauthor/azurecmdlets), you need to provide authentication to your Azure subscription. In Azure Automation, this is done with an organizational account in Azure Active Directory that you configure as an administrator for your subscription. You can then create a [credential](http://aka.ms/runbookauthor/assets/credentials) for this user account and use it with [Add-AzureAccount](http://aka.ms/runbookauthor/cmdlet/addazureaccount) in your runbook.

>[AZURE.NOTE] Microsoft accounts, formerly known as LiveIDs, cannot be used with Azure Automation.

## To create a new Azure Active Directory User to Manage an Azure Subscription

1. Log in to the Azure portal as a service administrator for the Azure subscription you want to manage.

2. Select **Active Directory**

3. Select the directory name that is associated with your Azure subscription. If necessary, you can change this association from **Settings > Subscriptions > Edit Directory**.

4. [Create a new Active Directory user](https://msdn.microsoft.com/library/azure/hh967632.aspx).  Select **New user in your organization** for the **Type of user** and do not **Enable Multi-Factor Authentication**.

5. Note the user’s full name and temporary password.

7. Select **Settings > Administrators > Add**.

8. Type the full user name of the user that you created.

9. Select the subscription that you want the user to manage.

10. Log out of Azure and then log back in with the account you just created. You will be prompted to change the user’s password.

11. Create a new [Azure Automation Credential asset](../automation-credentials) for the user account that you created. The **Credential Type** should be **Windows PowerShell Credential**.


## To use the credential in a runbook

You can retrieve the credential in a runbook using the [Get-AutomationPSCredential](http://../automation-credentials) activity and then use it with [Add-AzureAccount](http://aka.ms/runbookauthor/cmdlet/addazureaccount) to connect to your Azure subscription. If the credential is an administrator of multiple Azure subscriptions, then you should also use [Select-AzureSubscription](http://aka.ms/runbookauthor/cmdlet/selectazuresubscription) to specify the correct one. This is shown in the sample Windows PowerShell below that will typically appear at the top of most Azure Automation runbooks.

    $cred = Get-AutomationPSCredential –Name "myuseraccount.onmicrosoft.com"
	Add-AzureAccount –Credential $cred
	Select-AzureSubscription –SubscriptionName "My Subscription"

You should repeat these lines after any [checkpoints](http://aka.ms/runbookauthor/checkpoints) in your runbook. If the runbook is suspended and then resumes on another worker, then it will need to perform the authentication again.



