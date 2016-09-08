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

# Create and publish a marketplace item

## Create a marketplace item

1. [Download](http://www.aka.ms/azurestackmarketplaceitem) the Azure Gallery Packaging Tool and Sample Marketplace Item.

2.  Open the Sample Marketplace Item and rename the **SimpleVMTemplate** folder (use the same name as your Marketplace item. For example, Contoso.TodoList). This folder contains:

		/Contoso.TodoList/
		/Contoso.TodoList/Manifest.json
		/Contoso.TodoList/UIDefinition.json
		/Contoso.TodoList/Icons/
		/Contoso.TodoList/Strings/
		/Contoso.TodoList/DeploymentTemplates/

3. [Create an Azure Resource Manager template](../resource-group-authoring-templates.md) or choose a template from GitHub. The Marketplace item will use this template to create a new resource.

4. Test the template with the Microsoft Azure Stack APIs to make sure the resource can be deployed successfully.

5. If your template relies on a virtual machine image, follow the instructions to [publish a virtual machine image to Azure Stack](azure-stack-add-image-pir.md).

6. Save your Azure Resource Manager template in the ``/Contoso.TodoList/DeploymentTemplates/`` folder.

7. Choose the icons and text for your Marketplace item. Add icons to the **Icons** folder and text to the **resources** file in the **Strings** folder. Use the Small, Medium, Large, and Wide naming convention for icons. (Note: all four icons are required) See [marketplace item UI reference](## Reference: marketplace item UI) for detailed description.

8. In the **manifest.json** file, change the **name** to the name of your Marketplace item and **publisher** to your name or company.

9. Under **artifacts**, change the **name** and **path** with the correct information for the Azure Resource Manager template you included.

         "artifacts": [
            {
	            "name": "Type your template name",
	            "type": "Template",
	            "path": "DeploymentTemplates\\Type your path",
	            "isDefault": true
            }

10. Replace **My Marketplace Items** with a list of the categories where your Marketplace item will appear.

             "categories":[
         		"My Marketplace Items"
              ],

11. For any further edits to the manifest.json, refer to [Reference: marketplace item manifest.json](## Reference: marketplace item manifest.json).

12. Open a command prompt and run the following command to package the folders into an .azpkg file:

    	AzureGalleryPackager.exe package –m <path to manifest.json> -o <output location for the package>
    Note: The full path to output package must exist. For example, if the output path is C:\MarketPlaceItem\yourpackage.azpkg, the folder C:\MarketPlaceItem must exist.

## Pubish a marketplace item

1. Use PowerShell or Azure Storage Explorer to upload your marketplace item (.azpkg) to blob storage. You can upload to local Azure Stack storage or upload to Azure storage. This will just be a temporary location. Make sure the blob is publically accessible. 

2.  On the Client VM in Microsoft Azure Stack environment, ensure that your PowerShell Session is set up with your service administrator credentials. You can find instructions for how to authenticate PowerShell in Azure Stack in  [Deploy a Template with PowerShell](azure-stack-deploy-template-powershell.md).

3.  Use the Add-AzureRMGalleryItem PowerShell cmdlet to publish the marketplace item to your Azure Stack. For example:

		Add-AzureRMGalleryItem -SubscriptionId $SubscriptionId -GalleryItemUri https://sample.blob.core.windows.net/gallerypackages/Microsoft.SimpleTemplate.1.0.0.azpkg  -Apiversion "2015-04-01" –Verbose

	| Parameter | Description |
	|-----------|-------------|
	| SubscriptionID | Admin subscription ID. This can be retrieved using PowerShell or in the portal by navigating to the provider Subscription and copying the Subscription ID |
	| GalleryItemUri | The blob uri for your gallery package that has already been uploaded to storage |
	| Apiversion | Set as "2015-04-01" |

4. Navigate to the portal. You can now see the marketplace item in the portal -- as an admin or as a tenant. Note: it may take several minutes for the package to appear.

5. Your marketplace item has now been saved to the Azure Stack marketplace. You may choose to delete it from your blob storage location. 

6. You can remove a marketplace item by using the Remove-AzureRMGalleryItem cmdlet. Example:

		Remove-AzureRMGalleryItem -SubscriptionId $SubscriptionId -Name Microsoft.SimpleTemplate.1.0.0 -Apiversion "2015-04-01" –Verbose

>[AZURE.NOTE] The marketplace UI may error after you remove an item. To fix this, click **Settings** in the portal. Then, select **Discard modifications** under Portal customization.


## Reference: marketplace item manifest.json

### Identity information

| NAME      | REQUIRED | TYPE   | CONSTRAINTS                     | DESCRIPTION |
|-----------|----------|--------|---------------------------------|-------------|
| Name      | X        | string | [A-Za-z0-9]+                    |             |
| Publisher | X        | string | [A-Za-z0-9]+                    |             |
| Version   | X        | string | [SemVer v2](http://semver.org/) |             |

### Metadata

| NAME                 | REQUIRED | TYPE                                                                                                      | CONSTRAINTS                  | DESCRIPTION                                                              |
|----------------------|----------|-----------------------------------------------------------------------------------------------------------|------------------------------|--------------------------------------------------------------------------|
| DisplayName          | X        | string                                                                                                    | recommendation 80 characters | if longer than 80, Portal may not display your item name gracefully      |
| PublisherDisplayName | X        | string                                                                                                    | recommendation 30 characters | if longer than 30, Portal may not display your publisher name gracefully |
| PublisherLegalName   | X        | string                                                                                                    | max of 256 characters        |                                                                          |
| Summary              | X        | string                                                                                                    | 60 to 100 characters         |                                                                          |
| LongSummary          | X        | string                                                                                                    | 140 to 256 characters        | Not yet applicable in Azure Stack                                        |
| Description          | X        | [html](https://auxdocs.azurewebsites.net/en-us/documentation/articles/gallery-metadata#html-sanitization) | 500 to 5000 characters       |                                                                          |

### Images

Below is the list of icons used in the marketplace.

| NAME          | WIDTH | HEIGHT | NOTES                             |
|---------------|-------|--------|-----------------------------------|
| Large         | 115px | 115px  | Always required.                  |
| Medium        | 90px  | 90px   | Always required.                  |
| Small         | 40px  | 40px   | Always required.                  |
| Screenshot(s) | 533px | 324px  | Optional.                         |

### Categories

Each marketplace item should be tagged with a category. This dictates which category the item appears in the portal UI. You can choose one of the existing categories in Azure Stack (Compute, Data + Storage, etc.) or choose a completely new one.

### Links

Each marketplace item can include a variety of links to additional content. The links are specified as a list of names and URIs.

| NAME        | REQUIRED | TYPE   | CONSTRAINTS          | DESCRIPTION |
|-------------|----------|--------|----------------------|-------------|
| DisplayName | X        | string | max of 64 characters |             |
| Uri         | X        | uri    |                      |             |

### Additional properties

In addition to the above metadata, marketplace authors can also provide custom key/value pair data in the following form.

| NAME        | REQUIRED | TYPE   | CONSTRAINTS          | DESCRIPTION |
|-------------|----------|--------|----------------------|-------------|
| DisplayName | X        | string | max of 25 characters |             |
| Value       | X        | string | max of 30 characters |             |

### HTML sanitization

For any field that allows HTML, the following elements and attributes are allowed.

"h1", "h2", "h3", "h4", "h5", "p", "ol", "ul", "li", "a[target|href]", "br", "strong", "em", "b", "i"

## Reference: marketplace item UI

Icons and text for marketplace items as seen in the Azure Stack portal:

### Create blade

![](media/azure-stack-marketplace-item-ui-reference/image1.png)


### Marketplace item details blade

![](media/azure-stack-marketplace-item-ui-reference/image3.png)

