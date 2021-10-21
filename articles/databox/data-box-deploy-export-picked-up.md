---
title: Tutorial to ship Azure Data Box back in export order | Microsoft Docs
description: Learn how to ship your Azure Data Box to Microsoft after the export order is complete
services: databox
author: alkohli

ms.service: databox
ms.subservice: pod
ms.topic: tutorial
ms.date: 10/21/2021
ms.author: alkohli

# Customer intent: As an IT admin, I need to be able to return Data Box to upload on-premises data from my server onto Azure.
---

# Tutorial: Return Azure Data Box

This tutorial describes how to return Azure Data Box and the data is erased once the device is received at the Azure data.

In this tutorial, you will learn about topics such as:

> [!div class="checklist"]
>
> * Prerequisites
> * Prepare to ship
> * Ship Data Box to Microsoft
> * Erasure of data from Data Box

## Prerequisites

Before you begin, make sure:

* You've have completed the [Tutorial: Copy data from Azure Data Box](data-box-deploy-export-copy-data.md).
* Copy jobs are complete. Prepare to ship can't run if copy jobs are in progress.

## Prepare to ship

[!INCLUDE [data-box-export-prepare-to-ship](../../includes/data-box-export-prepare-to-ship.md)]

The next steps are determined by where you are returning the device.

## Ship Data Box back

Ensure that the data copy from the device is complete and **Prepare to ship** run is successful. Based on the region where you're shipping the device, the procedure is different.

## [US & Canada](#tab/in-us-canada)

[!INCLUDE [data-box-shipping-in-us-canada](../../includes/data-box-shipping-in-us-canada.md)]

## [Europe](#tab/in-eu)

[!INCLUDE [data-box-shipping-in-eu](../../includes/data-box-shipping-in-eu.md)]

## [Australia](#tab/in-australia)

[!INCLUDE [data-box-shipping-in-australia](../../includes/data-box-shipping-in-australia.md)]

## [Japan](#tab/in-japan)

[!INCLUDE [data-box-shipping-in-japan](../../includes/data-box-shipping-in-japan.md)]

## [Singapore](#tab/in-singapore)

[!INCLUDE [data-box-shipping-in-singapore](../../includes/data-box-shipping-in-singapore.md)]

## [South Africa](#tab/in-sa)

[!INCLUDE [data-box-shipping-in-sa](../../includes/data-box-shipping-in-sa.md)]

## [Hong Kong](#tab/in-hk)

[!INCLUDE [data-box-shipping-in-hk](../../includes/data-box-shipping-in-hk.md)]

## [United Arab Emirates](#tab/in-uae)

[!INCLUDE [data-box-shipping-in-uae](../../includes/data-box-shipping-in-uae.md)]

## [Self-Managed](#tab/in-selfmanaged)

[!INCLUDE [data-box-shipping-self-managed](../../includes/data-box-shipping-self-managed.md)]

<!--Final note in Include is part of Data Box import shipping instructions but not in Data Box export shipping instructions. Verify whether it's applicable to both. If not, move the note to Data Box import.-->

---

## Erasure of data from Data Box

Once the device reaches Azure datacenter, the Data Box erases the data on its disks as per the [NIST SP 800-88 Revision 1 guidelines](https://csrc.nist.gov/News/2014/Released-SP-800-88-Revision-1,-Guidelines-for-Medi).

## Next steps

In this tutorial, you learned about topics such as:

> [!div class="checklist"]
> * Prerequisites
> * Prepare to ship
> * Ship Data Box to Microsoft
> * Erasure of data from Data Box

Advance to the next article to learn how to manage your Data Box.

> [!div class="nextstepaction"]
> [Manage Data Box via Azure portal](./data-box-portal-admin.md)
