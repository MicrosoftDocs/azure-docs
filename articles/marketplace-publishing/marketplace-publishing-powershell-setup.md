<properties
   pageTitle="Setup PowerShell to create a VM for the Marketplace | Microsoft Azure"
   description="Instructions for setting up Azure PowerShell and use as an optional process flow to create VM images to deploy to and sell on the Azure Marketplace"
   services="marketplace-publishing"
   documentationCenter=""
   authors="HannibalSII"
   manager=""
   editor=""/>

<tags
   ms.service="marketplace-publishing"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="10/08/2015"
   ms.author="hascipio"/>

# Setting up Azure PowerShell for
For detailed information on how to set up PowerShell in Azure, visit [How to Install and configure Azure PowerShell](../powershell-install-configure.md). A simple approach is to use the certificate method, which downloads and imports a certificate needed to authenticate. To obtain the needed certificate, use the *Get-AzurePublishSettingsFile* cmdlet. Save the file once prompted. To import the certificate into a PowerShell session, use the *Import-AzurePublishSettingsFile*.

To configure and store the common Microsoft Azure subscription settings for the PowerShell session, use the *Set-AzureSubscription* and *Select-AzureSubscription* cmdlets:

        Set-AzureSubscription -SubscriptionName “mySubName” -CurrentStorageAccountName “mystorageaccount”
        Select-AzureSubscription -SubscriptionName "mySubName" –Current

The first command associates a default storage account with the subscription (needed for some VM provisioning operations).  The second makes the subscription the current one (recognized by other cmdlets).

## See also
- [Getting Started: How to publish an offer to the Azure Marketplace](marketplace-publishing-getting-started.md)
- [Creating a Virtual Machine Image for the Marketplace](marketplace-publishing-vm-image-creation.md)
