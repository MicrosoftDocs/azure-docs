---
title: Download marketplace items from Azure | Microsoft Docs
description: I can download marketplace items from Azure to my Azure Stack deployment.
services: azure-stack
documentationcenter: ''
author: brenduns  
manager: femila
editor: ''

ms.assetid:
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 05/08/2018
ms.author: brenduns
ms.reviewer: jeffgo
---
# Download marketplace items from Azure to Azure Stack

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

As a cloud operator, download items from the Azure Marketplace and make them available in Azure Stack. The items you can choose are from a curated list of Azure Marketplace items that are pre-tested and supported to work with Azure Stack. New items are frequently added to this list, so continue to check back for new content. 

There are two scenarios for connecting to the Azure Marketplace: 

- **A connected scenario** - that requires your Azure Stack environment to be connected to the internet. You use the Azure Stack portal to locate and download items. 
- **A disconnected or partially connected scenario** - that requires you to access the internet using the marketplace syndication tool to download marketplace items. Then, you transfer your downloads to your disconnected Azure Stack installation. This scenario uses PowerShell.
   > [!NOTE]  
   > The disconnected scenario cannot add virtual machine extensions to Azure Stack at this time.  


See [Azure Marketplace items for Azure Stack](azure-stack-marketplace-azure-items.md) for a list of the marketplace items you can download.


## Connected scenario
If Azure Stack connects to the internet, you can use the admin portal to download marketplace items.

### Prerequisites
Your Azure Stack deployment must have internet connectivity, and be [registered with Azure](azure-stack-register.md).

### Use the portal to download marketplace items  
1. Sign in to the Azure Stack administrator portal.

2.	Review the available storage space before downloading marketplace items. Later, when you select items for download, you can compare the download size to your available storage capacity. If capacity is limited, consider options for [managing available space](azure-stack-manage-storage-shares.md#manage-available-space). 

    To review available space, in **Region management** select the region you want to explore, and then go to **Resource Providers** > **Storage**.

    ![Review storage space](media/azure-stack-download-azure-marketplace-item/storage.png)  

    
3. Open the Azure Stack Marketplace and connect to Azure. To do so, select **Marketplace management**, and then select **Add from Azure**.

    ![marketplace management](media/azure-stack-download-azure-marketplace-item/marketplace.png)

    The portal displays the list of items available for download from the Azure Marketplace. You can click on each item to view its description and additional information about it, including its download size. 

    ![Marketplace list](media/azure-stack-download-azure-marketplace-item/image03.png)

4. Select the item you want, and then select **Download**. Download times vary.

    ![Download message](media/azure-stack-download-azure-marketplace-item/image04.png)

    After the download completes, you can deploy the new marketplace item as either an Azure Stack operator or user.

5. To deploy the downloaded item, select **+New**, and then search among the categories for the new marketplace item. Next select the item to begin the deployment process. The process varies for different marketplace items. 

## Disconnected or a partially connected scenario

If Azure Stack is in a disconnected mode (without internet connectivity), you use PowerShell and the *marketplace syndication tool* to download the marketplace items to a machine with internet connectivity, and then transfer them to your Azure Stack environment. In a disconnected environment, you can’t download marketplace items by using the Azure Stack portal. 

The marketplace syndication tool can also be used in a connected scenario. 

There are two steps to this scenario:
1. On the computer with internet access you configure PowerShell, download the syndication tool, and then download items form the Azure Marketplace.
2. You move the files you downloaded to your Azure Stack environment, import them to Azure Stack, and then publish them to the Azure Stack Marketplace.  


### Prerequisites
- Your Azure Stack deployment must be [registered with Azure](azure-stack-register.md).  
- The computer that has internet connectivity must have **Azure Stack PowerShell Module version 1.2.11** or higher. If not already present, [install Azure Stack specific PowerShell modules](azure-stack-powershell-install.md).  
- To enable import of a downloaded marketplace item, the [PowerShell environement for the Azure Stack operator](azure-stack-powershell-configure-admin.md) must be configured.  

- The marketplace syndication tool is downloaded during the first procedure. 

### Use the marketplace syndication tool to download marketplace items

1. On a computer with a an internet connection, open a PowerShell console as an administrator.

2. Add the Azure account that you have used to register Azure Stack. To add the account, in PowerShell run `Add-AzureRmAccount` without any parameters. You are prompted to enter your Azure account credentials and you might have to use 2-factor authentication based on your account’s configuration.

3. If you have multiple subscriptions, run the following command to select the one you have used for registration:  

   ```powershell
   Get-AzureRmSubscription -SubscriptionID '<Your Azure Subscription GUID>' | Select-AzureRmSubscription
   $AzureContext = Get-AzureRmContext
   ```

4. Download the latest version of marketplace syndication tool by using the following script:  

   ```PowerShell
   # Download the tools archive.
   [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12 
   invoke-webrequest https://github.com/Azure/AzureStack-Tools/archive/master.zip `
     -OutFile master.zip

   # Expand the downloaded files.
   expand-archive master.zip `
     -DestinationPath . `
     -Force

   # Change to the tools directory.
   cd .\AzureStack-Tools-master

   ```

5. Import the syndication module and then launch the tool by running the following script. Replace the *destination folder path* with a location to store the download.   

   ```powershell
   Import-Module .\Syndication\AzureStack.MarketplaceSyndication.psm1

   Sync-AzSOfflineMarketplaceItem `
     -destination "Destination folder path" `
     -AzureTenantID $AzureContext.Tenant.TenantId `
     -AzureSubscriptionId $AzureContext.Subscription.Id  
   ```

6. When the tool runs, you are prompted to enter your Azure account credentials. Sign in to the Azure account that you have used to register Azure Stack. After the login succeeds, you should see a screen like the following image, with the list of available marketplace items.  

   ![Azure Marketplace items popup](./media/azure-stack-download-azure-marketplace-item/image05.png)

7. Select the item that you want to download and make a note of the *version*. (You can select multiple images by holding the *Ctrl* key.) You will reference the *version* when you import the item in the next procedure. 
   
   You can also filter the list of images by using the **Add criteria** option.

8. Select **OK**, and then review and accept the legal terms. 

9. The download time takes depends on the size of the item. After the download completes, the item is available in the folder that you specified in the script. The download includes a VHD file (for virtual machines) or a .ZIP file (for virtual machine extensions). It also includes a gallery package in the .azpkg format. (A .azpkg package is a .zip file.)
 

### Import the download and publish to Azure Stack Marketplace
There are three different types of items in the marketplace: Virtual Machines, Virtual Machine Extensions, and Solution Templates. 
> [!NOTE]
> Virtual Machine Extensions cannot be added to Azure Stack at this time.


1. After you download the item and gallery package, copy both and the contents of the AzureStack-Tools-master folder to a removable disk drive. Next, transfer the files to the Azure Stack environment. You can place all of the files in the same folder of your choice, like *C:\MarketplaceImages*.     

2. If your download includes a small 3 MB VHD file named **fixed3.vhd**, the download is a solution template. Because the *fixed3.vhd* file is not needed, skip to step 4 (Use portal to upload your Marketplace item). Make sure you also download any dependent items as indicated in the description for the download.

3. Import the image to Azure Stack by using the Add-AzsVMImage cmdlet. When using this cmdlet, make sure to replace the *publisher*, *offer*, and other parameter values with the values of the image that you are importing. You can get the *publisher*, *offer*, and *sku* values of the image from the imageReference object of the Azpkg file that you downloaded earlier and the *version* value from step 6 in the previous section.

   To find the imageReference, you will need to rename the AZPKG file with the .ZIP extension, extract it to a temporary location and open the DeploymentTemplates\CreateUiDefinition.json file with a text editor. Find this section:

   ```json
   "imageReference": {
      "publisher": "MicrosoftWindowsServer",
      "offer": "WindowsServer",
      "sku": "2016-Datacenter-Server-Core"
    }
   ```

   Replace the parameter values and run the following command:

   ```powershell
   Import-Module .\ComputeAdmin\AzureStack.ComputeAdmin.psm1

   Add-AzsVMImage `
    -publisher "MicrosoftWindowsServer" `
    -offer "WindowsServer" `
    -sku "2016-Datacenter-Server-Core" `
    -osType Windows `
    -Version "2016.127.20171215" `
    -OsDiskLocalPath "C:\AzureStack-Tools-master\Syndication\Windows-Server-2016-DatacenterCore-20171215-en.us-127GB.vhd" `
    -CreateGalleryItem $False `
    -Location Local
   ```

4. Use portal to upload your Marketplace item (.Azpkg) to Azure Stack Blob storage. You can upload to local Azure Stack storage or upload to Azure Storage. (It's a temporary location for the package.) Make sure that the blob is publicly accessible and note the URI.  

5. Publish the marketplace item to Azure Stack by using the **Add-AzsGalleryItem**. For example:

   ```powershell
   Add-AzsGalleryItem `
     -GalleryItemUri "https://mystorageaccount.blob.local.azurestack.external/cont1/Microsoft.WindowsServer2016DatacenterServerCore-ARM.1.0.2.azpkg" `
     –Verbose
   ```

7. After the gallery item is published, you can view it from the **New** > **Marketplace** pane. If your download was a solution template, make sure you also downloaded the dependent VHD image.

   ![Marketplace](./media/azure-stack-download-azure-marketplace-item/image06.png)

## Next steps

[Create and publish a Marketplace item](azure-stack-create-and-publish-marketplace-item.md)
