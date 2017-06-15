---
title: Create and publish a Marketplace item in Azure Stack | Microsoft Docs
description: Create and publish a Marketplace item in Azure Stack.
services: azure-stack
documentationcenter: ''
author: rupisure
manager: byronr
editor: ''

ms.assetid: 77e5f60c-a86e-4d54-aa8d-288e9a889386
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/09/2016
ms.author: rupisure

---
# Create and publish a Marketplace item
## Create a Marketplace item
1. [Download](http://www.aka.ms/azurestackmarketplaceitem) the Azure Gallery Packager tool and the sample Azure Stack Marketplace item.
2. Open the sample Marketplace item and rename the **SimpleVMTemplate** folder. (Use the same name as your Marketplace item--for example, **Contoso.TodoList**.) This folder contains:
   
       /Contoso.TodoList/
       /Contoso.TodoList/Manifest.json
       /Contoso.TodoList/UIDefinition.json
       /Contoso.TodoList/Icons/
       /Contoso.TodoList/Strings/
       /Contoso.TodoList/DeploymentTemplates/
3. [Create an Azure Resource Manager template](../azure-resource-manager/resource-group-authoring-templates.md) or choose a template from GitHub. The Marketplace item uses this template to create a resource.
4. Test the template with the Microsoft Azure Stack APIs to make sure that the resource can be deployed successfully.
5. If your template relies on a virtual machine image, follow the instructions to [add a virtual machine image to Azure Stack](azure-stack-add-vm-image.md).
6. Save your Azure Resource Manager template in the **/Contoso.TodoList/DeploymentTemplates/** folder.
7. Choose the icons and text for your Marketplace item. Add icons to the **Icons** folder, and add text to the **resources** file in the **Strings** folder. Use the Small, Medium, Large, and Wide naming convention for icons. See [Marketplace item UI reference](#reference-marketplace-item-ui) for a detailed description.
   
   > [!NOTE]
   > All four icon sizes (small, medium, large, wide) are required for building the Marketplace item correctly.
   > 
   > 
8. In the **manifest.json** file, change the information for **name** to the name of your Marketplace item and the information for **publisher** to your name or company.
9. Under **artifacts**, change the information for **name** and **path** to the correct information for the Azure Resource Manager template that you included.
   
         "artifacts": [
            {
                "name": "Type your template name",
                "type": "Template",
                "path": "DeploymentTemplates\\Type your path",
                "isDefault": true
            }
10. Replace **My Marketplace Items** with a list of the categories where your Marketplace item should appear.
    
             "categories":[
                 "My Marketplace Items"
              ],
11. For any further edits to manifest.json, refer to [Reference: Marketplace item manifest.json](#reference-marketplace-item-manifestjson).
12. Open a command prompt and run the following command to package the folders into an .azpkg file:
    
        AzureGalleryPackager.exe package –m <path to manifest.json> -o <output location for the package>
    
    > [!NOTE]
    > The full path to the output package must exist. For example, if the output path is C:\MarketPlaceItem\yourpackage.azpkg, the folder C:\MarketPlaceItem must exist.
    > 
    > 

## Publish a Marketplace item
1. Use PowerShell or Azure Storage Explorer to upload your Marketplace item (.azpkg) to Azure Blob storage. You can upload to local Azure Stack storage or upload to Azure Storage. (It's a temporary location for the package.) Make sure that the blob is publicly accessible.
2. On the client virtual machine in the Microsoft Azure Stack environment, ensure that your PowerShell session is set up with your service administrator credentials. You can find instructions for how to authenticate PowerShell in Azure Stack in [Deploy a template with PowerShell](azure-stack-deploy-template-powershell.md).
3. Use the **Add-AzureRMGalleryItem** PowerShell cmdlet to publish the Marketplace item to Azure Stack. For example:
   
       Add-AzureRMGalleryItem -GalleryItemUri `
       https://sample.blob.core.windows.net/gallerypackages/Microsoft.SimpleTemplate.1.0.0.azpkg –Verbose
   
   | Parameter | Description |
   | --- | --- |
   | SubscriptionID |Admin subscription ID. You can retrieve it by using PowerShell or, in the Azure Stack portal, by going to the provider subscription and copying the subscription ID. |
   | GalleryItemUri |Blob URI for your gallery package that has already been uploaded to storage. |
   | Apiversion |Set as **2015-04-01**. |
4. Go to the portal. You can now see the Marketplace item in the portal--as an admin or as a tenant.
   
   > [!NOTE]
   > The package might take several minutes to appear.
   > 
   > 
5. Your Marketplace item has now been saved to the Azure Stack Marketplace. You can choose to delete it from your Blob storage location.
6. You can remove a Marketplace item by using the **Remove-AzureRMGalleryItem** cmdlet. Example:
   
        Remove-AzureRMGalleryItem -Name Microsoft.SimpleTemplate.1.0.0  –Verbose
   
   > [!NOTE]
   > The Marketplace UI may show an error after you remove an item. To fix this, click **Settings** in the portal. Then, select **Discard modifications** under **Portal customization**.
   > 
   > 

## Reference: Marketplace item manifest.json
### Identity information
| Name | Required | Type | Constraints | Description |
| --- | --- | --- | --- | --- |
| Name |X |String |[A-Za-z0-9]+ | |
| Publisher |X |String |[A-Za-z0-9]+ | |
| Version |X |String |[SemVer v2](http://semver.org/) | |

### Metadata
| Name | Required | Type | Constraints | Description |
| --- | --- | --- | --- | --- |
| DisplayName |X |String |Recommendation of 80 characters |If longer than 80, the portal might not display your item name gracefully. |
| PublisherDisplayName |X |String |Recommendation of 30 characters |If longer than 30, the portal might not display your publisher name gracefully. |
| PublisherLegalName |X |String |Maximum of 256 characters | |
| Summary |X |String |60 to 100 characters | |
| LongSummary |X |String |140 to 256 characters |Not yet applicable in Azure Stack. |
| Description |X |[HTML](https://auxdocs.azurewebsites.net/en-us/documentation/articles/gallery-metadata#html-sanitization) |500 to 5,000 characters | |

### Images
The Marketplace uses the following icons.

| Name | Width | Height | Notes |
| --- | --- | --- | --- |
| Wide |255 px |115 px |Always required |
| Large |115 px |115 px |Always required |
| Medium |90 px |90 px |Always required |
| Small |40 px |40 px |Always required |
| Screenshot |533 px |32 px |Optional |

### Categories
Each Marketplace item should be tagged with a category. This dictates the category where the item appears on the portal UI. You can choose one of the existing categories in Azure Stack (Compute, Data + Storage, etc.) or choose a new one.

### Links
Each Marketplace item can include various links to additional content. The links are specified as a list of names and URIs.

| Name | Required | Type | Constraints | Description |
| --- | --- | --- | --- | --- |
| DisplayName |X |String |Maximum of 64 characters | |
| Uri |X |URI | | |

### Additional properties
In addition to the preceding metadata, Marketplace authors can provide custom key/value pair data in the following form.

| Name | Required | Type | Constraints | Description |
| --- | --- | --- | --- | --- |
| DisplayName |X |String |Maximum of 25 characters | |
| Value |X |String |Maximum of 30 characters | |

### HTML sanitization
For any field that allows HTML, the following elements and attributes are allowed:

h1, h2, h3, h4, h5, p, ol, ul, li, a[target|href], br, strong, em, b, i

## Reference: Marketplace item UI
Icons and text for Marketplace items as seen in the Azure Stack portal are as follows.

### Create blade
![Create blade](media/azure-stack-marketplace-item-ui-reference/image1.png)

### Marketplace item details blade
![Marketplace item details blade](media/azure-stack-marketplace-item-ui-reference/image3.png)

