---
title: Create and publish a Marketplace item in Azure Stack | Microsoft Docs
description: Create and publish a Marketplace item in Azure Stack.
services: azure-stack
documentationcenter: ''
author: sethmanheim
manager: femila
editor: ''

ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/03/2018
ms.author: sethm
ms.reviewer: avishwan

---
# Create and publish a Marketplace item

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

## Create a Marketplace item
1. [Download](http://www.aka.ms/azurestackmarketplaceitem) the Azure Gallery Packager tool and the sample Azure Stack Marketplace item.
2. Open the sample Marketplace item and rename the **SimpleVMTemplate** folder. (Use the same name as your Marketplace item--for example, **Contoso.TodoList**.) This folder contains:
   
   ```shell
   /Contoso.TodoList/
   /Contoso.TodoList/Manifest.json
   /Contoso.TodoList/UIDefinition.json
   /Contoso.TodoList/Icons/
   /Contoso.TodoList/Strings/
   /Contoso.TodoList/DeploymentTemplates/
   ```

3. [Create an Azure Resource Manager template](../azure-resource-manager/resource-group-authoring-templates.md) or choose a template from GitHub. The Marketplace item uses this template to create a resource.

    > [!Note]  
    > Never hard code any secrets like product keys, password or any customer identifiable information in the Azure Resource Manager template. Template json files are accessible without the need for authentication once published in the gallery.  Store all secrets in [Key Vault](https://docs.microsoft.com/azure/azure-resource-manager/resource-manager-keyvault-parameter) and call them from within the template.

4. To make sure that the resource can be deployed successfully, test the template with the Microsoft Azure Stack APIs.
5. If your template relies on a virtual machine image, follow the instructions to [add a virtual machine image to Azure Stack](azure-stack-add-vm-image.md).
6. Save your Azure Resource Manager template in the **/Contoso.TodoList/DeploymentTemplates/** folder.
7. Choose the icons and text for your Marketplace item. Add icons to the **Icons** folder, and add text to the **resources** file in the **Strings** folder. Use the Small, Medium, Large, and Wide naming convention for icons. See [Marketplace item UI reference](#reference-marketplace-item-ui) for a detailed description.
   
   > [!NOTE]
   > All four icon sizes (small, medium, large, wide) are required for building the Marketplace item correctly.
   > 
   > 
8. In the **manifest.json** file, change **name** to the name of your Marketplace item. Also change **publisher** to your name or company.
9. Under **artifacts**, change **name** and **path** to the correct information for the Azure Resource Manager template that you included.
   
   ```json
   "artifacts": [
      {
          "name": "Type your template name",
          "type": "Template",
          "path": "DeploymentTemplates\\Type your path",
          "isDefault": true
      }
   ```

10. Replace **My Marketplace Items** with a list of the categories where your Marketplace item should appear.
    
   ```json
   "categories":[
   "My Marketplace Items"
   ],
   ```

11. For any further edits to manifest.json, refer to [Reference: Marketplace item manifest.json](#reference-marketplace-item-manifestjson).
12. To package the folders into an .azpkg file, open a command prompt and run the following command:
    
   ```shell
   AzureGalleryPackager.exe package –m <path to manifest.json> -o <output location for the package>
   ```
    
    > [!NOTE]
    > The full path to the output package must exist. For example, if the output path is C:\MarketPlaceItem\yourpackage.azpkg, the folder C:\MarketPlaceItem must exist.
    > 
    > 

## Publish a Marketplace item
1. Use PowerShell or Azure Storage Explorer to upload your Marketplace item (.azpkg) to Azure Blob storage. You can upload to local Azure Stack storage or upload to Azure Storage. (It's a temporary location for the package.) Make sure that the blob is publicly accessible.
2. On the client virtual machine in the Microsoft Azure Stack environment, make sure that your PowerShell session is set up with your service administrator credentials. You can find instructions for how to authenticate PowerShell in Azure Stack in [Deploy a template with PowerShell](user/azure-stack-deploy-template-powershell.md).
3. When you use [PowerShell 1.3.0]( azure-stack-powershell-install.md) or later, you can use the **Add-AzsGalleryItem** PowerShell cmdlet to publish the Marketplace item to Azure Stack. Prior to using PowerShell 1.3.0, use the cmdlet **Add-AzureRMGalleryitem** in place of **Add-AzsGalleryItem**.  For example, when you use PowerShell 1.3.0 or later:
   
   ```powershell
   Add-AzsGalleryItem -GalleryItemUri `
   https://sample.blob.core.windows.net/gallerypackages/Microsoft.SimpleTemplate.1.0.0.azpkg –Verbose
   ```
   
   | Parameter | Description |
   | --- | --- |
   | SubscriptionID |Admin subscription ID. You can retrieve it by using PowerShell. If you'd prefer to get it in the portal, go to the provider subscription and copy the subscription ID. |
   | GalleryItemUri |Blob URI for your gallery package that has already been uploaded to storage. |
   | Apiversion |Set as **2015-04-01**. |
4. Go to the portal. You can now see the Marketplace item in the portal--as an operator or as a user.
   
   > [!NOTE]
   > The package might take several minutes to appear.
   > 
   > 
5. Your Marketplace item has now been saved to the Azure Stack Marketplace. You can choose to delete it from your Blob storage location.
    > [!Caution]  
    > All default gallery artifacts and your custom gallery artifacts are now accessible without authentication under the following URLs:  
`https://adminportal.[Region].[external FQDN]:30015/artifact/20161101/[Template Name]/DeploymentTemplates/Template.json`  
`https://portal.[Region].[external FQDN]:30015/artifact/20161101/[Template Name]/DeploymentTemplates/Template.json`  
`https://systemgallery.blob.[Region].[external FQDN]/dev20161101-microsoft-windowsazure-gallery/[Template Name]/UiDefinition.json`

6. You can remove a Marketplace item by using the **Remove-AzureRMGalleryItem** cmdlet. Example:
   
   ```powershell
   Remove-AzsGalleryItem -Name Microsoft.SimpleTemplate.1.0.0  –Verbose
   ```
   
   > [!NOTE]
   > The Marketplace UI may show an error after you remove an item. To fix the error, click **Settings** in the portal. Then, select **Discard modifications** under **Portal customization**.
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
| DisplayName |X |String |Recommendation of 80 characters |The portal might not display your item name gracefully if it is longer than 80 characters. |
| PublisherDisplayName |X |String |Recommendation of 30 characters |The portal might not display your publisher name gracefully if it is longer than 30 characters. |
| PublisherLegalName |X |String |Maximum of 256 characters | |
| Summary |X |String |60 to 100 characters | |
| LongSummary |X |String |140 to 256 characters |Not yet applicable in Azure Stack. |
| Description |X |[HTML](https://auxdocs.azurewebsites.net/en-us/documentation/articles/gallery-metadata#html-sanitization) |500 to 5,000 characters | |

### Images
The Marketplace uses the following icons:

| Name | Width | Height | Notes |
| --- | --- | --- | --- |
| Wide |255 px |115 px |Always required |
| Large |115 px |115 px |Always required |
| Medium |90 px |90 px |Always required |
| Small |40 px |40 px |Always required |
| Screenshot |533 px |32 px |Optional |

### Categories
Each Marketplace item should be tagged with a category that identifies where the item appears on the portal UI. You can choose one of the existing categories in Azure Stack (Compute, Data + Storage, etc.) or choose a new one.

### Links
Each Marketplace item can include various links to additional content. The links are specified as a list of names and URIs.

| Name | Required | Type | Constraints | Description |
| --- | --- | --- | --- | --- |
| DisplayName |X |String |Maximum of 64 characters | |
| Uri |X |URI | | |

### Additional properties
In addition to the preceding metadata, Marketplace authors can provide custom key/value pair data in the following form:

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

