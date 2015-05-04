<properties
   pageTitle="Getting started in Azure RemoteApp with Powershell"
   description="Learn how to get started in Azure RemoteApp with Powershell"
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
   ms.date="04/14/2015"
   ms.author="guscatal;spatnaik"/>



Getting started in Azure RemoteApp with Powershell
=====================================


Get the cmdlets 
-------------
First we need to download Azure Powershell commandlets [here](http://go.microsoft.com/?linkid=9811175), the RemoteApp ones are included in it.

Configure Azure cmdlets to use your subscription
------------------
Follow [this guide](powershell-install-configure.md) so you can use the cmdlets against your Azure subscription.

Create a cloud collection
--------------------
It's simple, run the following command:

    New-AzureRemoteAppCollection -Collectionname RAppO365Col1 -ImageName "Office 365 ProPlus (Subscription required)" -Plan Basic -Location "West US" - Description "Office 365 Collection."

The above command automatically publishes Microsoft Office 365 applications (Excel, OneNote, Outlook, PowerPoint, Visio and Word).

Collection creation can take 30 minutes or longer to complete. Therefore, this command returns a tracking ID that you can use as follows:


    Get-AzureRemoteAppOperationResult -TrackingId xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

After the collection is done, you can add users to the collection with the following command:

    Add-AzureRemoteAppUser -CollectionName RAppO365Col1 -Type microsoftAccount -UserUpn someone@domain.com

And you're done! That user should be able to connect to the application using the Azure RemoteApp client found [here](https://www.remoteapp.windowsazure.com/).

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
