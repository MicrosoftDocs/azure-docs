---
title: Ship Microsoft Azure Data Box back| Microsoft Docs
description: Learn how to ship your Azure Data Box to Microsoft
services: databox
documentationcenter: NA
author: alkohli
manager: twooley
editor: ''

ms.assetid: 
ms.service: databox
ms.devlang: NA
ms.topic: tutorial
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 08/07/2018
ms.author: alkohli
---

# Tutorial: Return Azure Data Box and verify data upload to Azure

This tutorial describes how to return Azure Data Box and verify the data uploaded to Azure.

In this tutorial, you will learn about:

> [!div class="checklist"]
> * Ship Data Box to Microsoft
> * Verify data upload to Azure
> * Erasure of data from Data Box

## Prerequisites

Before you begin, make sure that you have completed the [Tutorial: Copy data to Azure Data Box and verify](data-box-deploy-copy-data.md).

## Ship Data Box back

1. Ensure that the device is powered off and cables are removed.
2. Ensure that the shipping label is visible and schedule a pickup with your carrier. If the label is damaged or lost, download the shipping label from the Azure portal and affix on the device. Go to **Overview > Download shipping label**.
4. Schedule a pickup with UPS if returning the device in US. If you are returning the device in Europe with DHL, request for pickup from DHL by visiting their website and specifying the airway bill number. Go to the country DHL Express website and choose **Book a Courier Collection > eReturn Shipment**. 

    Specify the waybill number and click **Schedule Pickup** to arrange for pickup.

5. Once the Data Box is picked up by your carrier, the order status in the portal updates to **Picked up**. A tracking ID is also displayed.

## Verify data upload to Azure

When Microsoft receives and scans the device, order status is updated to **Received**. 

The data copy starts automatically once the Data Box is connected to the network in the Azure datacenter. Depending upon the data size, the copy operation may take a few hours to days to complete. You can monitor the copy job progress in the portal.

Once the copy is complete, order status updates to **Completed**.

Verify that your data is in the storage account(s) before you delete it from the source. To verify that the data has uploaded into Azure, perform the following steps:

## Erasure of data from Data Box
 
 Once the upload to Azure is complete, the Data Box securely erases its disks as per the NIST standard. 

In this tutorial, you learned about Azure Data Box topics such as:

> [!div class="checklist"]
> * Ship Data Box to Microsoft
> * Verify data upload to Azure
> * Erasure of data from Data Box

Advance to the following article to learn how to manage Data Box via the local web UI.

> [!div class="nextstepaction"]
> [Use local web UI to administer Azure Data Box](./data-box-portal-ui-admin.md)


