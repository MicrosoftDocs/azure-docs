---
title: Get SAP media for Bill of Materials
description: How to download SAP media to use in your Bill of Materials (BOM) for the SAP on Azure Deployment Automation Framework.
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 11/17/2021
ms.topic: how-to
ms.service: sap-on-azure
ms.subservice: sap-automation
---

# Acquire media for BOM creation

The [SAP on Azure Deployment Automation Framework](deployment-framework.md) uses a Bill of Materials (BOM). To create your BOM, you have to locate and download relevant SAP installation media. Then, you need to upload these media files to your Azure storage account.

> [!NOTE]
> This guide covers advanced deployment topics. For a basic explanation of how to deploy the automation framework, see the [get started guide](get-started.md) instead.

This guide is for configurations that use either the SAP Application (DB) or HANA databases.

## Prerequisites

- An SAP account with permissions to download the SAP software and access the Maintenance Planner.
- An installation of the [SAP download manager](https://support.sap.com/en/my-support/software-downloads.html) on your computer.
- Information about your SAP system:
    - SAP account username and password.  The SAP account cannot be linked to a SAP Universal ID.
    - The SAP system product to deploy (such as **S/4HANA**)
    - The SAP System Identifier (SAP SID)
    - Any language pack requirements
    - The operating system (OS) to use in the application infrastructure
- An Azure subscription. If you don't already have an Azure subscription, [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Acquire media

To prepare for [downloading the SAP installation media](#download-media):

1. On your computer, create a unique directory for your stack SAP downloads. For example, `~/Downloads/S4HANA_1909_SP2/`.

1. Sign in to [SAP ONE Support Launchpad](https://launchpad.support.sap.com/).

1. Clear your download basket.

    1. Go to **Software Downloads**.

    1. Select **Download Basket**.

    1. Select all the items in the basket.

    1. Select the **X** to remove all items from the basket.

1. Add the utility SAPCAR to your download basket.

    1. On the search bar, make sure the search type is set to **Downloads**.

    1. Enter `SAPCAR` in the search bar and select **Search**.

    1. In the table **Items Available to Download**, select the row for **SAPCAR** with **Maintenance Software Component**. This step filters available downloads for the latest version of the utility.

    1. Make sure the drop-down menu for the table shows the correct OS type. For example, `LINUX ON X86_64 64BIT`.

    1. Select the checkbox next to the filename of the SAPCAR executable. For example, `SAPCAR_1320-80000935.EXE`.

    1. Select the shopping cart icon to add your selection to the download basket.

1. Sign in to the [Maintenance Planner](https://support.sap.com/en/alm/solution-manager/processes-72/maintenance-planner.html).

1. Design your SAP system. For example, if you're using **S/4HANA**:

    1. Select the plan for **SAP S/4HANA**.

    1. Optionally, change the Maintenance Plan name.

    1. Select **Install New S4HANA System**. 
    
    1. Select **Next**

    1. For **Install a New System**, enter the SAP SID you're using.

    1. For **Target Version**, select your target SAP version. For example, **SAP S/4HANA 2020**.

    1. For **Target Stack**, select your target stack. For example, **Initial Shipment Stack**.

    1. If necessary, select your **Target Product Instances**.

    1. Select **Next**

1. Design your codeployment.

    1. Select **Co-Deployed with Backend**.

    1. For **Target Version**, select your target version for codeployment. For example, **SAP FIORI FOR SAP S/4HANA 2020**.

    1. For **Target Stack**, select your target stack for codeployment. For example, **Initial Shipment Stack**.

    1. Select **Next**

1. Select **Continue Planning**. If you're using a *new system*, select **Next**. If you're using an *existing system*, make the following changes:

    1. For **OS/DB dependent files**, select **Linux on x86_64 64bit**.

    1. Select **Confirm Selection**.

    1. Select **Next**.

1. Optionally, under **Select Stack Independent Files**, configure settings for non-ABAP databases. You can choose to expand the database and deselect non-required language files.

1. Select **Next**.

1. Download stack XML files to the stack download directory you created earlier.

    1. Select **Push to Download Basket**.

    1. Select **Additional Downloads**.

    1. Select **Download Stack Text File**.

    1. Select **Download PDF**.

    1. Select **Export to Excel**.

    1. Go to your download basket again in the SAP Launchpad. You might need to refresh the page to see your new selections.

    1. Select the **T** icon to download a file with the URLs for your download basket.

## Get download basket manifest

> [!IMPORTANT]
> Only follow these steps if you want to run the scripted BOM generation. You must perform these actions before you run the SAP Download Manager. If you don't want to run the scripted BOM generation, [skip to the next section](#download-media).

To get your SAP Download Basket manifest JSON file (`DownloadBasket.json`):

1. Open the **Postman** utility.

1. Add a new request by selecting the plus sign (**+**) button in the workspace tab. A new page opens with your request.

1. On the **Params** tab, set the request type to `GET`.

1. For the request URL, enter `https://tech.support.sap.com:443/odata/svt/swdcuisrv/DownloadContentSet?_MODE=BASKET_CONTENT&_VERSION=3.1.2&$format=json`.

1. Select the **Authorization** tab.

1. For **Type**, select **Basic Auth**.

1. For **Username**, enter your SAP username.

1. For **Password**, enter your SAP password.

1. Select the **Headers** tab.

1. Uncheck the Accept-Encoding and User-Agent check boxes

1. Select the **Send** button.

1. On the **Body** tab, make sure to select the **Raw** view.

1. Copy the raw JSON response body. Save the response in your stack download directory.

## Download media

To download the SAP installation media:

1. On your computer, run the SAP Download Manager.

1. Sign in to the SAP Download Manager.

1. Access your SAP Download Basket.

1. Set your download directory to the stack download directory that you created. For example, ``~/Downloads/S4HANA_1909_SP2/`.

1. Download all files from your download basket into this directory.

> [!NOTE]
> The text file that contains your SAP download URLs is always `myDownloadBasketFiles.txt`. However, this file is specific to the application or database. You should keep this file with your other downloads for this particular section for use in later sections.

## Upload media

To upload the SAP media and stack files to your Azure storage account:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Under **Azure services**, select **Resource groups**. Or, enter `resource groups` in the search bar. 

1. Select the resource group for your SAP Library.

1. On the resource group page, select the `saplib` storage account in the **Resources** table.

1. On the storage account page's menu, select **Containers** under **Data storage**.

1. Select the `sapbits` container.

1. On the container page, upload your archives and tools.

    1. Select the **Upload** button.

    1. Select **Select a file**.

    1. Navigate to the [directory where you downloaded the SAP media previously](#download-media).

    1. Select all the archive files. These file names are similar to `*.SAR`, `*.RAR`, `*.ZIP`, and `SAPCAR*.EXE`.

    1. Select **Advanced** to show advanced options.

    1. For **Upload Directory**, enter `archives`.

1. Upload your stack files.

    1. Select the **Upload** button.

    1. Select **Select a file**.

    1. Navigate to the download directory that you [created in the previous section](#acquire-media).

    1. Select all your stack files. These file names are similar to `MP_*.(xml|xls|pdf|txt)`.

    1. Select **Advanced** to show advanced options.

    1. For **Upload Directory**, enter `boms/<Stack_Version>/stackfiles` where `<Stack_Version>` is a combination of your product information. For example, `S4HANA_2020_ISS_v001` indicates the product type is `S4HANA`, the product release is `2020`, the service pack is `ISS` for the initial software shipment, and the stack is `v001`.

## Next steps

> [!div class="nextstepaction"]
> [Prepare BOM](bom-prepare.md)
