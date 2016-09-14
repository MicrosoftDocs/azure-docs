<properties
   pageTitle="Use PowerShell cmdlets with Azure RemoteApp | Microsoft Azure"
   description="Learn how to use Windows PowerShell cmdlets in Azure RemoteApp."
   services="remoteapp"
   documentationCenter=""
   authors="guscatalano"
   manager="mbaldwin"
   editor=""/>

<tags
   ms.service="remoteapp"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="compute"
   ms.date="08/15/2016"
   ms.author="elizapo"/>



# Use Windows PowerShell cmdlets with Azure RemoteApp

> [AZURE.IMPORTANT]
> Azure RemoteApp is being discontinued. Read the [announcement](https://go.microsoft.com/fwlink/?linkid=821148) for details.

 You can use the Azure RemoteApp PowerShell cmdlets to administer and maintain your collections. Use the following information to get started.

## Get the cmdlets 
-------------
First download the Azure Powershell cmdlets [here](http://go.microsoft.com/?linkid=9811175), the RemoteApp cmdlets are included in it. 

Check out the [Azure RemoteApp cmdlet help](https://msdn.microsoft.com/library/mt428031.aspx).

## Configure Azure cmdlets to use your subscription
------------------
Follow [this guide](../powershell-install-configure.md) so you can use the cmdlets against your Azure subscription.

You can use these steps to get started quickly:

1.	Download and install the [Azure PowerShell cmdlets](http://go.microsoft.com/?linkid=9811175).
2.	Launch Microsoft Azure PowerShell.
3.	Run **Add-AzureAccount** to authenticate to your Azure subscription. When prompted, enter the same user name and password that you use to sign in to Azure portal.  
4.	Run **Get-AzureSubscription** to list the subscriptions associated with your user account. 
5.	Run **Select-AzureSubscription** and specify the subscription name or ID to use in the PowerShell console.

Congratulations, your Azure PowerShell console is configured and ready to use. Be aware that you'll need to repeate steps 2 through 5 each time you start the the Azure PowerShell console.  

## Create a cloud collection
--------------------
It's simple, run the following command:

    New-AzureRemoteAppCollection -Collectionname RAppO365Col1 -ImageName "Office 365 ProPlus (Subscription required)" -Plan Basic -Location "West US" - Description "Office 365 Collection."

The above command automatically publishes Microsoft Office 365 applications (Excel, OneNote, Outlook, PowerPoint, Visio and Word).

Collection creation can take 30 minutes or longer to complete. Therefore, this command returns a tracking ID that you can use as follows:


    Get-AzureRemoteAppOperationResult -TrackingId xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

After the collection is done, you can add users to the collection with the following command:

    Add-AzureRemoteAppUser -CollectionName RAppO365Col1 -Type microsoftAccount -UserUpn someone@domain.com

And you're done! That user should be able to connect to the application using the Azure RemoteApp client found [here](https://www.remoteapp.windowsazure.com/).

## Available cmdlets
There are lots of other commands that we have, the documentation for them will be coming shortly:

Basic RemoteApp Collection  cmdlets: 

- New-AzureRemoteAppCollection
- Get-AzureRemoteAppCollection
- Set-AzureRemoteAppCollection
- Update-AzureRemoteAppCollection
- Remove-AzureRemoteAppCollection
- Add-AzureRemoteAppUser
- Get-AzureRemoteAppUser
- Remove-AzureRemoteAppUser
- Get-AzureRemoteAppSession
- Disconnect-AzureRemoteAppSession
- Invoke-AzureRemoteAppSessionLogoff
- Send-AzureRemoteAppSessionMessage
- Get-AzureRemoteAppProgram
- Get-AzureRemoteAppStartMenuProgram
- Publish-AzureRemoteAppProgram
- Unpublish-AzureRemoteAppProgram
- Get-AzureRemoteAppCollectionUsageDetails
- Get-AzureRemoteAppCollectionUsageSummary
- Get-AzureRemoteAppPlan

RemoteApp virtual network cmdlets:

- New-AzureRemoteAppVNet
- Get-AzureRemoteAppVNet
- Set-AzureRemoteAppVNet
- Remove-AzureRemoteAppVNet
- Get-AzureRemoteAppVpnDevice
- Get-- AzureRemoteAppVpnDeviceConfigScript
- Reset-AzureRemoteAppVpnSharedKey

RemoteApp template image cmdlets:

- New-AzureRemoteAppTemplateImage
- Get-AzureRemoteAppTemplateImage
- Rename-AzureRemoteAppTemplateImage
- Remove-AzureRemoteAppTemplateImage

Other RemoteApp cmdlets:

- Get-AzureRemoteAppLocation
- Get-AzureRemoteAppWorkspace
- Set-AzureRemoteAppWorkspace
- Get-AzureRemoteAppOperationResult
 
