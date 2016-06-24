<properties
	pageTitle="Publish a marketplace item in Azure Stack | Microsoft Azure"
	description="Publish a marketplace item in Azure Stack."
	services="azure-stack"
	documentationCenter=""
	authors="rupisure"
	manager="byronr"
	editor=""/>

<tags
	ms.service="azure-stack"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="01/29/2016"
	ms.author="rupisure"/>

# Publish a Marketplace item



1.  [Create a Marketplace Item](azure-stack-create-marketplace-item.md).

2.  On the Client VM in Microsoft Azure Stack environment, ensure that your PowerShell Session is set up with your service administrator credentials. You can find instructions for how to authenticate PowerShell in Azure Stack in  [Deploy a Template with PowerShell](azure-stack-deploy-template-powershell.md).

3.  Use the Add-AzureRMGalleryItem PowerShell cmdlet to publish the marketplace item to your Azure Stack. The GalleryItemName **must** match the Publisher.Name.Version given to the item in Manifest.json file. If not, then other cmdlets may not work correctly. For example:

		Add-AzureRMGalleryItem -SubscriptionId $SubscriptionId -ResourceGroup MarketplaceItems -Name Contoso.SimpleVMTemplate.1.0.0 -Path C:\Users\adminuser\Contoso.SimpleVMTemplate.1.0.0.azpkg  -Apiversion "2015-04-01" –Verbose

	| Parameter | Description |
	|-----------|-------------|
	| SubscriptionID | Admin subscription ID. This can be retrieved using PowerShell or in the portal by navigating to the provider Subscription and copying the Subscription ID |
	| ResourceGroup | A valid resource group already created on the provider subscription |
	| Name | Name of the package which must match 'Publisher.Name.Version' as declared in the manifest of the marketplace item |
	| Path | Path to the .azpkg file |
	| Apiversion | Set as "2015-04-01" |

4. Navigate to the portal. You can now see the marketplace item in the portal -- as an admin or as a tenant.
5. You can remove a marketplace item by using the Remove-AzureRMGalleryItem cmdlet. Example:

		Remove-AzureRMGalleryItem -SubscriptionId $SubscriptionId -ResourceGroup MarketplaceItems -Name Microsoft.SimpleTemplate.1.0.0 -Apiversion "2015-04-01" –Verbose

>[AZURE.NOTE] Do not upload the same package with different names in the cmdlet, it will cause the resources to be orphaned.

>[AZURE.NOTE] The marketplace UI may error after you remove an item. To fix this, click **Settings** in the portal. Then, select **Discard modifications** under Portal customization.

## Next steps

[Marketplace Item Metadata](azure-stack-marketplace-item-metadata.md)
