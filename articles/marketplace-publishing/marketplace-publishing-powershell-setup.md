<properties
   pageTitle="Set up PowerShell to create a VM for the Marketplace | Microsoft Azure"
   description="Instructions for setting up Azure PowerShell and using it as an optional process flow to create VM images to deploy to, and sell on, the Azure Marketplace"
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

# Set up Azure PowerShell to create an offer for the Azure Marketplace
For detailed information on how to set up PowerShell in Azure, see [How to install and configure Azure PowerShell](../powershell-install-configure.md). A simple approach is to use the certificate method, which downloads and imports a certificate needed for authentication. To obtain the needed certificate, use the **Get-AzurePublishSettingsFile** cmdlet. Save the file when you're prompted. To import the certificate into a PowerShell session, use the **Import-AzurePublishSettingsFile** cmdlet.

To configure and store the common Microsoft Azure subscription settings for the PowerShell session, use the **Set-AzureSubscription** and **Select-AzureSubscription** cmdlets:

        Set-AzureSubscription -SubscriptionName “mySubName” -CurrentStorageAccountName “mystorageaccount”
        Select-AzureSubscription -SubscriptionName "mySubName" –Current

The first command associates a default storage account with the subscription (needed for some VM provisioning operations).  The second makes the subscription the current one (recognized by other cmdlets).

## See also
- [Getting started: How to publish an offer to the Azure Marketplace](marketplace-publishing-getting-started.md)
- [Creating a virtual machine image for the Marketplace](marketplace-publishing-vm-image-creation.md)
