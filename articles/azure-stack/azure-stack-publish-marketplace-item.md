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

1.  First, ensure that you have a marketplace item (.azpkg) ready to upload. If you do not, follow [these instructions](azure-stack-create-marketplace-item.md) to create a marketplace item.

2.  On the Client VM in Microsoft Azure Stack environment, ensure that your PowerShell Session is set up with your service administrator credentials. To do this, follow the instructions [here](azure-stack-deploy-template-powershell.md) under <i>Authenticate PowerShell with Microsoft Azure Stack</i>.

3.  Use the Add-AzureRMGalleryItem PowerShell cmdlet to publish the marketplace item to your Azure Stack. The GalleryItemName <b>must</b> match the Publisher.Name.Version given to the item in Manifest.json file. If not, then other cmdlets may not work correctly. For example:

		Add-AzureRMGalleryItem -SubscriptionId $SubscriptionId -ResourceGroup MarketplaceItems -Name Microsoft.SimpleTemplate.1.0.0 -Path C:\Users\adminuser\Microsoft.SimpleTemplate.1.0.0.azpkg  -Apiversion "2015-04-01" –Verbose

3.  You can now see the marketplace item in the portal.

4.  You can remove a marketplace item by using the Remove-AzureRMGalleryItem cmdlet. Example:

		Remove-AzureRMGalleryItem -SubscriptionId $SubscriptionId -ResourceGroup MarketplaceItems -Name Microsoft.SimpleTemplate.1.0.0 -Apiversion "2015-04-01" –Verbose

>[AZURE.NOTE] Do not upload the same package with different names in the cmdlet, it will cause the resources to be orphaned.

>[AZURE.NOTE] The marketplace UI may error after you remove an item. To fix this, click on <b>Settings</b> in the portal. And then select <b>Discard modifications</b> under Portal customization.

## Next Steps

[Marketplace Item Metadata](azure-stack-marketplace-item-metadata.md)
