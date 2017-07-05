---
title: Create and publish Azure Stack marketplace items with the Marketplace Publishing tool | Microsoft Docs
description: Learn how to quickly create marketplace items with the publishing tool
services: azure-stack
documentationcenter: ''
author: HeathL17
manager: ByronR
editor: ''

ms.assetid: 
ms.service: azure-stack
ms.workload: app-service
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 7/10/2017
ms.author: helaw

---

#  Add marketplace items using publishing tool
Adding your content to the [Azure Stack Marketplace](azure-stack-marketplace.md) makes your solutions available to you and your tenants for deployment.  The Marketplace Publishing tool creates Azure Marketplace Packages (.azpkg) files based on your IaaS Azure Resource Manager templates or VM Extensions.  You can also use the Marketplace Publishing tool to publish .azpkg files, either created with the tool or using [manual](azure-stack-create-and-publish-marketplace-item.md) steps.  This topic guides you through downloading the tool, creating a marketplace item based on a VM template, and then publishing that item to the Azure Stack Marketplace.     


## Prerequisites
 - You must run the tool from the Azure Stack host or have [VPN](azure-stack-connect-azure-stack.md#connect-with-vpn) connectivity from the machine where you run the tool.

 - Download the [Azure Stack Quickstart templates](https://github.com/Azure/AzureStack-QuickStart-Templates/archive/master.zip) and extract.

 - Download the [Azure Gallery Packaging tool](http://aka.ms/azurestackmarketplaceitem) (AzureGalleryPackage.exe). 

 - Publishing to the marketplace requires icons and a thumbnail file.  You can use your own, or save the [sample](azure-stack-marketplace-publisher.md#support-files) files locally for this example:

## Download the tool
The Marketplace Publishing tool is hosted in the Azure Stack Tools repo, and can be downloaded with the following PowerShell:

   > [!NOTE]
   > The following steps require PowerShell 5.0.  To check your version, run $PSVersionTable.PSVersion and compare the "Major" version.  
   > 
   > 

```PowerShell
#Download the tools archive
invoke-webrequest https://github.com/Azure/AzureStack-Tools/archive/master.zip -OutFile master.zip

#Expand the downloaded files. 
expand-archive master.zip -DestinationPath . -Force

#Change to the tools directory
cd AzureStack-Tools-master
```

##  Create marketplace items
In this section, you use the Marketplace Publishing tool to create a marketplace item package in .azpkg format.  

### Provide marketplace information with Wizard
1. Run the Marketplace Publisher in the previously opened PowerShell session:
```PowerShell
    .\MarketplacePublisher.ps1
```

2. Click the **Solution** tab.  This screen accepts information about your marketplace item. Enter information about your item as you want it to appear in the marketplace.  You can also specify a (parameters file)[azure-stack-marketplace-publisher.md#Use-a-parameters-file] to prepopulate the form.  
    
    ![screenshot of Marketplace Publisher first screen](./media/azure-stack-marketplace-publisher/image7.png)
3. Click **Browse** and select an image file for icon and screenshot fields.
4. Once all fields are populated, select "Preview Solution" for a preview of the solution within the Marketplace.  You can revise and edit the text, images, and screenshot before clicking **Next**.  

### Import template and create package
In this section, you import the template and work with input for your solution.

1.  Click **Browse** and select the *azuredeploy.json* from the 101-Simple-Windows-VM folder in the downloaded templates.

    ![screenshot of Marketplace Publisher second screen](./media/azure-stack-marketplace-publisher/image8.png)
2.  The Deployment Wizard populates with a *Basic* step and input items for each parameter specified in the template.  You can add additional steps and move inputs between steps.  As an example, you may want "Front-End Configuration" and "Back-End Configuration" steps for your solution.
3.  Specify the path to AzureGalleryPackager.exe.  
4.  Click **Create** and the Marketplace Publishing tool packages your solution into an .azpkg file.  Once complete, the wizard displays the path to your solution file and give you the option to continue publishing your package to Azure Stack.


## Publish marketplace items
In this section, you publish your newly created marketplace item your Azure Stack Marketplace.

![screenshot of Marketplace Publisher first screen](./media/azure-stack-marketplace-publisher/image9.png)

1.  The wizard requires information to publish your solution:
    
    |Field|Description|
    |-----|-----|
    | Service Admin Name | Service Administrator account.  Example:  ServiceAdmin@mydomain.onmicrosoft.com |
    | Password | Password for Service Administrator account. |
    | API Endpoint | Azure Stack Azure Resource Manager endpoint.  Example: api.azurestack.local |
2.  Click **Publish** and the publishing log is displayed.
3.  You are now able to deploy your published item via the Azure Stack portal.


## Use a parameters file
You can also use a parameters file to complete the marketplace item information.  

The Marketplace Publishing tool includes a *solution.parameters.ps1* you can use to create your own parameters file.


## Support files
| Description | Sample |
| ----- | ----- |
| 40x40 .png icon | ![](./media/azure-stack-marketplace-publisher/image1.png) |
| 90x90 .png icon | ![](./media/azure-stack-marketplace-publisher/image2.png) |
| 115x115 .png icon | ![](./media/azure-stack-marketplace-publisher/image3.png) |
| 255x115 .png icon | ![](./media/azure-stack-marketplace-publisher/image4.png) |
| 533x324 .png thumbnail | ![](./media/azure-stack-marketplace-publisher/image5.png) |


