---
title: Publish a virtual machine in Azure Marketplace | Microsoft Docs
description: This article gives gives details around publishing a virtual machine via the cloud partner portal
services: cloud-partner-portal
documentationcenter: ''
author: anuragdalmia
manager: hamidm

ms.robots: NOINDEX, NOFOLLOW
ms.service: cloud-partner-portal
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/22/2017
ms.author: andalmia

---
# Publish a virtual machine to Azure Marketplace

This article lists the various steps involved in publishing a virtual machine to Azure Marketplace.

## What are pre-requisites for publishing a VM

Prerequisites to listing on Azure Marketplace

1.  Technical

    -   [Technical prerequisites for creating a virtual machine image for the Azure Marketplace](https://docs.microsoft.com/azure/marketplace-publishing/marketplace-publishing-vm-image-creation-prerequisites)

    -   [Creating and uploading a Linux VHD](https://docs.microsoft.com/azure/virtual-machines/virtual-machines-linux-create-upload-generic?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)

    -   [Create & test a Linux VM from an image](https://docs.microsoft.com/azure/virtual-machines/virtual-machines-linux-upload-vhd)

    -   [Creating and uploading a Windows VHD ](https://docs.microsoft.com/azure/virtual-machines/virtual-machines-windows-prepare-for-upload-vhd-image?toc=/azure/virtual-machines/windows/toc.json)

    -   [Create & test a Windows VM from an image](https://docs.microsoft.com/azure/virtual-machines/virtual-machines-windows-create-vm-generalized-managed?toc=/azure/virtual-machines/windows/toc.json)

    -   [How to troubleshoot common issues encountered during VHD creation](https://docs.microsoft.com/azure/marketplace-publishing/marketplace-publishing-vm-image-creation-troubleshooting )


2.  Non-technical (business requirements)

    -   Your company (or its subsidiary) must be located in a sell from country supported by ​the Azure Marketplace

    -   Your product must be licensed in a way that is compatible with billing models supported ​by the Azure Marketplace

    -   You are responsible for making technical support available to customers in a commercially reasonable manner, whether free, paid, or through community support.

    -   You are responsible for licensing your software and any third-party software dependencies.

    -   You must provide content that meets criteria for your offering to be listed on Azure Marketplace and in the Azure Management Portal

    -   You must agree to the terms of the Azure Marketplace Participation Policies and Publisher Agreement​

    - You must agree to comply with the [Terms of Use](https://azure.microsoft.com/support/legal/website-terms-of-use/) , [Microsoft Privacy Statement](http://www.microsoft.com/privacystatement/default.aspx) and [Microsoft Azure Certified Program Agreement](https://azure.microsoft.com/support/legal/marketplace/certified-program-agreement/).

## How to create a new VM offer

Once all the pre-requisites have been met, you are ready to start authoring your virtual machine (VM) offer. Before we begin, a quick overview of an offer and a SKU

### Offer
A virtual machine offer corresponds to a class of product offering from a publisher. If you have a  new kind of product/virtual machine that you would like to be available in Azure Marketplace, a new offer would be the way to go. An offer is a collection of SKUs. Every offer appears as its own entity in Azure Marketplace. 

### SKU
A SKU is the smallest purchasable unit of an offer. While within the same product class (offer), SKUs allow you to differentiate between different features supported, VM image types and billing models supported. 

Add multiple SKUs if you would like to support different billing models like Bring Your Own License (BYOL), Pay as you Go (PAYG), etc. Add multiple SKUs when each SKU supports a different feature set and each of them is priced differently. Also add multiple SKUs if you have different VM images for public vs sovereign clouds. 

A SKU shows up under the parent offer in Azure Marketplace while it shows up as its own purchasable entity in Azure portal. 

1.  Login to the [cloud partner portal](http://cloudpartner.azure.com/).

2.  From the left navigation bar, click on “+ New offer” and select “Virtual Machines”.

    ![publishvm1][1]

3.  A new offer “Editor” view is now opened for you, and we are ready to start authoring.

   ![publishvm2][2]

4.  The “forms” that need to be filled out are visible on the left within the “Editor” view. Each “form” consists of a set of fields that are to be filled out. Required fields are marked with a red asterix (\*).

> There are 4 main forms for authoring a VM

-   Offer Settings

-   SKUs

-   Marketplace

-   Support

## How to fill out the Offer Settings form
The offer settings form is a basic form to specify the offer settings. The different fields are described below.

### Offer ID
This is a unique identifier for the offer within a publisher profile. This ID will be visible in product URLs, ARM templates and billing reports. It can only be composed of lowercase alphanumeric characters or dashes (-). The ID cannot end in a dash and can have a maximum of 50 characters. Note that this field is locked once an offer goes live.

For eg., if a publisher **contoso** publishers an offer with offer ID **sample-vm**, it will show up in Azure marketplace as **https://azuremarketplace.microsoft.com/marketplace/apps/contoso.sample-vm?tab=Overview**

### Publisher ID
This dropdown allows you to choose the publisher profile you want to publish this offer under. Note that this field is locked once an offer goes live.

### Name
This is the display name for your offer. This is the name that will show up in [Azure Marketplace](https://azuremarketplace.microsoft.com) and in [Azure Portal](https://portal.azure.com/). It can have a maximum of 50 characters. Guidance here is to include a recognizable brand name for your product. Dont include your company name here unless that is how it is marketed. If you are marketing this offer at your own website, ensure that the name is exactly how it shows up in your website.

Click on “Save” to save your progress. Next step would be to add SKUs for your offer.

## How to create SKUs
Click on the “SKUs” form. Here you can see an option to “Add a SKU” clicking on which will allow you to enter a “SKU ID”.

![publishvm4][4]

This is a unique identifier for the SKU within an offer. This ID will be visible in product URLs, ARM templates and billing reports. It can only be composed of lowercase alphanumeric characters or dashes (-). The ID cannot end in a dash and can have a maximum of 50 characters. Note that this field is locked once an offer goes live. You can have multiple SKUs within an offer. You need a SKU for each image you are planning to publish.

Once a SKU has been added, it will appear in the list of SKUs within the “SKUs” form. Click on the SKU name to get into the details of that particular SKU. Here are some details for some of the fields.

### Hide this SKU
This flag allows you to set if this specific SKU is visible in [Azure Marketplace](https://azuremarketplace.microsoft.com) and in [Azure Portal](https://portal.azure.com/) to customers. You may want to hide the SKU if you only want it available via solution templates and not for purchase individually.

### Cloud Availability 
This field allows you to define the availability of your SKU in the different Azure Clouds.

#### Public Azure 

This SKU will be deployable to customers in all public Azure regions that have Marketplace integration.

#### Azure Government Cloud 

This SKU will be deployable in the Azure Government Cloud. Before publishing to [Azure Government](https://docs.microsoft.com/azure/azure-government/documentation-government-manage-marketplace-partners), we recommend publishers test and validate their solution works as expected. To stage and test, request a trial account [here](https://azure.microsoft.com/offers/ms-azr-usgov-0044p). Please note that Microsoft Azure Government is a government-community cloud with controlled access for customers from the US Federal, State, local or tribal AND partners eligible to serve these entities.

### Country/Region availability
This field determines the regions in which your SKU is going to be available for purchase. You need to carefully consider where you make your SKUs available. Some countries are classified as “Microsoft Tax Remitted Country”.

-   In “Microsoft Tax Remitted Country”, Microsoft collects taxes from customers and pays (remits) taxes to the government.

-   In others, partners are responsible for collecting taxes customers and paying taxes to the government. If you choose to sell in these countries, you must have the capability to calculate and pay taxes in them.

![publishvm5][5]

### Pricing 
There are currently 2 kinds of pricing models supported.

#### Bring-Your-Own-License (BYOL)

You manage the licensing of the software running on the VM. Microsoft will only charge the infrastructure costs.

#### Usage based monthly billed SKU

Customers get charged on a per-hour basis based on the rates set by the publishers on the VM sizes. In case of **hourly billing** model of the SKUs, the total price will be the summation of the software cost charged by the publisher and the infrastructure cost charged by Microsoft. This total cost will be displayed to the customer as an hourly and monthly price when they are considering the purchase. The billing in this case will be on a monthly basis.

Within the Usage based model, there are additional settings required by you.

##### Free Trial

You can specify if you want to provide a free trial for your customers. Here the customer doesn’t get charged for software cost for the first 30 days(Free) after deploying the VM. After 30 days they get charged on a per-hour basis based on the rates set by the publishers in the hourly model.

##### Per Core Pricing

You can set pricing per core for your SKU. For this, you just need to enter a base price for a single core and we auto-compute the prices for the rest of the cores. Enter the prices in USD in the portal and we will auto-calculate the prices for other regions. You can verify the prices in the other regions by using **Export Pricing Data**

![publishvm6][6]

##### Discrete Pricing

You can set the pricing for each sets of cores individually if you would like to price each core separately.

![publishvm7][7]

##### Export-Import Pricing

You have the flexibility to export the pricing that has been configured via the portal to make changes via the excel interface. This also allows you to verify per-region pricing and pricing in local currencies. Clicking on **Export-Pricing** will download an excel file with pricing details pre-populated. You will be able to edit these within the excel and then use **Import-Pricing** to import the changes that were made. The imported pricing will reflect in the portal as well.

Within this pricing excel, the prices for the different regions are listed in local currency. The exchange rate that we use is refreshed daily.

![publishvm8][8]

##### Important notes about Pricing

-   Prices are not changeable once an offer goes live. You may still be able to add/remove supported regions.

-   This price is charged to the user in addition to [Azure's virtual machine pricing](http://aka.ms/vmpricingdetails).

-   Prices are set for all regions in local currency on available currency rates at the time of setting prices.

-   To set or view each region’s price individually, please export the pricing spreadsheet and import with custom pricing.

### VM Images
The next section to complete will be the VM Images section. Before going to this section, you need to have the VHD that you want to publish ready. Here are some links helping you to create your VHD:

-   [Technical prerequisites for creating a virtual machine image for the Azure Marketplace](https://docs.microsoft.com/azure/marketplace-publishing/marketplace-publishing-vm-image-creation-prerequisites)

-   [Creating and uploading a Linux VHD](https://docs.microsoft.com/azure/virtual-machines/virtual-machines-linux-create-upload-generic?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)

-   [Create & test a Linux VM from an image](https://docs.microsoft.com/azure/virtual-machines/virtual-machines-linux-upload-vhd)

-   [Creating and uploading a Windows VHD ](https://docs.microsoft.com/azure/virtual-machines/virtual-machines-windows-prepare-for-upload-vhd-image?toc=/azure/virtual-machines/windows/toc.json)

-   [Create & test a Windows VM from an image](https://docs.microsoft.com/azure/virtual-machines/virtual-machines-windows-create-vm-generalized-managed?toc=/azure/virtual-machines/windows/toc.json)

-   [How to troubleshoot common issues encountered during VHD creation](https://docs.microsoft.com/azure/marketplace-publishing/marketplace-publishing-vm-image-creation-troubleshooting )


Once you have your VHD ready, you can start filling out this section. Here are some details for some of the fields.

#### Recommended VM Sizes

Select up to six recommended virtual machine sizes. These are recommendations that get displayed to the customer in Azure Marketplace and the Pricing tier blade in the Azure Portal when they decide to purchase and deploy your image. **These are only recommendations. The customer is able to select any VM size that accommodates the disks specified in your image.** Below is how recommended VM sizes will appear to the customer in Azure Portal.

![publishvm9][9]

#### Open Ports

Specify the ports that you would like made open and available. These ports are opened during this VMs deployment.

#### Adding VM Images

The next step would be to add a VM image for your SKU. You can add up to 8 disk versions per SKU. Only the highest disk version number for a particular SKU will show up in Azure Marketplace. Others will be visible via APIs. 

Start by clicking the “+ New version” under the **Disk version** section. This will show a collection of fields that needs to be filled out.

##### VM image version

The VM image version needs to follow the [semantic version](http://semver.org/) format. Versions should be of the form X.Y.Z, where X, Y, and Z are integers. Images in different SKUs can have different major and minor versions. Versions within a SKU should only be incremental changes, which increase the patch version (Z from X.Y.Z).

##### OS VHD URL

Enter the [shared access signature URI](../marketplace-publishing/marketplace-publishing-vm-image-creation.md#52-get-the-shared-access-signature-uri-for-your-vm-images) created for the operating system VHD.

If there are data disks associated with this SKU, you can choose to add this by clicking the “+ New data disk” link. This will bring up additional fields to fill out.

##### LUN VHD URL

Enter the [shared access signature URI](../marketplace-publishing/marketplace-publishing-vm-image-creation.md#52-get-the-shared-access-signature-uri-for-your-vm-images) for your data disk.

##### LUN Number

Assign this LUN a number. This number will be reserved for this data disk within this SKU.

Note that once you publish a SKU with a given VM version and Data disks, these get locked and cannot be modified. For any additional VM versions that get added to the SKU, the number of data disks that it needs to support cannot change.

##### Common SAS URL issues & fixes

| **Issue**                                                           | **Failure Message**                                                           | **Fix**                                                   | **Documentation Link**                                                                                    |
|---------------------------------------------------------------------|-------------------------------------------------------------------------------|-----------------------------------------------------------|-----------------------------------------------------------------------------------------------------------|
| Failure in copying images - "?" is not found in SAS url             | Failure: Copying Images. Not able to download blob using provided SAS Uri.    | Update the SAS Url using recommended tools                | <https://azure.microsoft.com/documentation/articles/storage-dotnet-shared-access-signature-part-1/> |
| Failure in copying images - “st” and “se” parameters not in SAS url | Failure: Copying Images. Not able to download blob using provided SAS Uri.    | Update the SAS Url with Start and End dates on it         | <https://azure.microsoft.com/documentation/articles/storage-dotnet-shared-access-signature-part-1/> |
| Failure in copying images - “sp=rl” not in SAS url                  | Failure: Copying Images. Not able to download blob using provided SAS Uri     | Update the SAS Url with permissions set as “Read” & “List | <https://azure.microsoft.com/documentation/articles/storage-dotnet-shared-access-signature-part-1/> |
| Failure in copying images - SAS url have white spaces in vhd name   | Failure: Copying Images. Not able to download blob using provided SAS Uri.    | Update the SAS Url without white spaces                   | <https://azure.microsoft.com/documentation/articles/storage-dotnet-shared-access-signature-part-1/> |
| Failure in copying images – SAS Url Authorization error             | Failure: Copying Images. Not able to download blob due to authorization error | Regenerate the SAS Url                                    | <https://azure.microsoft.com/documentation/articles/storage-dotnet-shared-access-signature-part-1/> |

## Marketplace Form
The marketplace form within a virtual machine offer asks for fields that will show up on [Azure Marketplace](https://azuremarketplace.microsoft.com) and on [Azure Portal](https://portal.azure.com/). Here are some details for some of the fields.

#### Preview Subscription Ids

Enter here a list of Azure Subscription IDs that you would like to have access to the offer once its published. These white-listed subscriptions will allow you to test the previewed offer before making it live. The partner portal allows you to white-list upto 100 subscriptions.

#### Suggested Categories

Select up to 5 categories from the provided list that your offer can be best associated with. The selected categories will be used to map your offer to the product categories available in [Azure Marketplace](https://azuremarketplace.microsoft.com) and [Azure Portal](https://portal.azure.com/).

Here are some of the places that the data you provide on this form shows up in.

##### Azure Marketplace

![publishvm10][10]

![publishvm11][11]

![publishvm15][15]

##### Azure Portal

![publishvm12][12]

![publishvm13][13]

##### Logo Guidelines

All the logos uploaded in the Cloud Partner Portal should follow the below guidelines:

-   The Azure design has a simple color palette. Keep the number of primary and secondary colors on your logo low.

-   The theme colors of the Azure portal are white and black. Hence avoid using these colors as the background color of your logos. Use some color that would make your logos prominent in the Azure portal. We recommend simple primary colors. **If you are using transparent background, then make sure that the logos/text are not white or black or blue.**

-   Do not use a gradient background on the logo.

-   Avoid placing text, even your company or brand name, on the logo. The look and feel of your logo should be 'flat' and should avoid gradients.

-   The logo should not be stretched.

##### Hero Logo

The Hero logo is optional. The publisher can choose not to upload a Hero logo. However once uploaded the hero icon cannot be deleted. At that time, the partner must follow the Azure Marketplace guidelines for Hero icons.

###### Guidelines for the Hero logo icon

-   The Publisher Display Name, plan title and the offer long summary are displayed in white font color. Hence you should avoid keeping any light color in the background of the Hero Icon. Black, white and transparent background is not allowed for Hero icons.

-   The publisher display name, plan title, the offer long summary and the create button are embedded programmatically inside the Hero logo once the offer goes listed. So you should not enter any text while you are designing the Hero logo. Just leave empty space on the right because the text (i.e. publisher display name, plan title, the offer long summary) will be included programmatically by us over there. The empty space for the text should be 415x100 on the right (and it is offset by 370px from the left).

![publishvm14][14]

#### Lead Management

To fill out the lead management settings of the offer, follow instructions [here](./cloud-partner-portal-marketing-lead-management.md#how-to-connect-your-crm-system-with-the-cloud-partner-portal)

## Support Form
The next form to fill out is the support form. This form asks for support contacts from your company like engineering contact information and customer support contact information. 

## How to publish an offer
Now that you have your offer drafted, the next step would be to publish the offer to Azure Marketplace. Follow instructions to [get your offer live in Azure Marketplace](./Cloud-partner-portal-make-offer-live-on-Azure-Marketplace.md) 

[1]: ./media/cloud-partner-portal-publish-virtual-machine/publishvm1.png
[2]: ./media/cloud-partner-portal-publish-virtual-machine/publishvm2.png
[3]: ./media/cloud-partner-portal-publish-virtual-machine/publishvm3.png
[4]: ./media/cloud-partner-portal-publish-virtual-machine/publishvm4.png
[5]: ./media/cloud-partner-portal-publish-virtual-machine/publishvm5.png
[6]: ./media/cloud-partner-portal-publish-virtual-machine/publishvm6.png
[7]: ./media/cloud-partner-portal-publish-virtual-machine/publishvm7.png
[8]: ./media/cloud-partner-portal-publish-virtual-machine/publishvm8.png
[9]: ./media/cloud-partner-portal-publish-virtual-machine/publishvm9.png
[10]: ./media/cloud-partner-portal-publish-virtual-machine/publishvm10.png
[11]: ./media/cloud-partner-portal-publish-virtual-machine/publishvm11.png
[12]: ./media/cloud-partner-portal-publish-virtual-machine/publishvm12.png
[13]: ./media/cloud-partner-portal-publish-virtual-machine/publishvm13.png
[14]: ./media/cloud-partner-portal-publish-virtual-machine/publishvm14.png
[15]: ./media/cloud-partner-portal-publish-virtual-machine/publishvm15.png