<properties
	pageTitle="Publish a marketplace item"
	description="Publish a marketplace item"
	services="azure-stack" 
	documentationCenter=""
	authors="v-anpasi"
	manager="v-kiwhit"
	editor=""/>

<tags
	ms.service="multiple"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="01/04/2016"
	ms.author="v-anpasi"/>

# Publish a marketplace item

1.  On the Client VM in Microsoft Azure Stack environment, ensure that your PowerShell Session is set up right for service administrator credentials.

    For example, local environment setup using the Add-AzureRMEnvironment and Add-AzureRMAccount with ServiceAdmin Credentials.

2.  Use the Add-AzureRMGalleryItem cmdlet from the Azure SDK to publish the marketplace item to your Azure Stack. The GalleryItemName must match the Publisher.Name.Version given to the item in Manifest.json file. If not, then other cmdlets may not work correctly. For example:

		Add-AzureRMGalleryItem -SubscriptionId $SubscriptionId -ResourceGroup $resourceGroupName -Name $GalleryItemName -Path $Package  -Apiversion "2015-04-01" –Verbose

3.  You can now see the marketplace item in the portal.

4.  You can remove a marketplace item by using the Remove-AzureRMGalleryItem cmdlet.

>[AZURE.NOTE] Do not upload the same package with different names in the cmdlet, it will cause the resources to be orphaned.
