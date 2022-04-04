---
title: Tutorial to ship Azure Data Box back| Microsoft Docs
description: In this tutorial, learn how to return Azure Data Box, including preparing to ship, shipping Data Box, verifying data upload, and erasing data from Data Box.
services: databox
author: alkohli

ms.service: databox
ms.subservice: pod
ms.topic: tutorial
ms.custom: references_regions
ms.date: 03/31/2022
ms.author: alkohli

# Customer intent: As an IT admin, I need to be able to return a Data Box to upload on-premises data from my server onto Azure.
---

::: zone target="docs"

# Tutorial: Return Azure Data Box and verify data upload to Azure

::: zone-end

::: zone target="chromeless"

## Return Data Box and verify data upload to Azure

::: zone-end

::: zone target="docs"

This tutorial describes how to return Azure Data Box and verify the data uploaded to Azure.

In this tutorial, you will learn about topics such as:

> [!div class="checklist"]
>
> * Prerequisites
> * Prepare to ship
> * Ship Data Box to Microsoft
> * Verify data upload to Azure
> * Erasure of data from Data Box

## Prerequisites

Before you begin, make sure:

* You've have completed the [Tutorial: Copy data to Azure Data Box and verify](data-box-deploy-copy-data.md).
* Copy jobs are complete and there are no errors on the **Connect and copy** page. **Prepare to ship** can't run if copy jobs are in progress or there are errors in the **Connect and copy** page.

## Prepare to ship

[!INCLUDE [data-box-prepare-to-ship](../../includes/data-box-prepare-to-ship.md)]

::: zone-end

::: zone target="chromeless"

After the data copy is complete, you prepare and ship the device. When the device reaches Azure datacenter, data is automatically uploaded to Azure.

## Prepare to ship

Before you prepare to ship, make sure that copy jobs are complete.

1. Go to **Prepare to ship** page in the local web UI and start the ship preparation.
2. Turn off the device from the local web UI. Remove the cables from the device.

The next steps are determined by where you're returning the device.

::: zone-end


## Ship Data Box back

Make sure the data copy to the device completed and the **Prepare to ship** run was successful. 

Based on the region where you're shipping the device, the procedure is different. In many countries/regions, you can use [Microsoft managed shipping](#microsoft-managed-shipping) or [self-managed shipping](#self-managed-shipping).

### Microsoft managed shipping

Follow the guidelines for the region you're shipping from if you're using Microsoft managed shipping.

## [US & Canada](#tab/in-us-canada)

[!INCLUDE [data-box-shipping-in-us-canada](../../includes/data-box-shipping-in-us-canada.md)]

## [EU](#tab/in-europe)

[!INCLUDE [data-box-shipping-in-eu](../../includes/data-box-shipping-in-eu.md)]

**If you're shipping back to Azure datacenters in Germany or Switzerland,** you can also [use self-managed shipping](#self-managed-shipping).

## [UK](#tab/in-uk)

[!INCLUDE [data-box-shipping-in-uk](../../includes/data-box-shipping-in-uk.md)]

## [Australia](#tab/in-australia)

[!INCLUDE [data-box-shipping-in-australia](../../includes/data-box-shipping-in-australia.md)]

## [Japan](#tab/in-japan)

[!INCLUDE [data-box-shipping-in-japan](../../includes/data-box-shipping-in-japan.md)]

## [Singapore](#tab/in-singapore)

[!INCLUDE [data-box-shipping-in-singapore](../../includes/data-box-shipping-in-singapore.md)]

## [Hong Kong](#tab/in-hk)

[!INCLUDE [data-box-shipping-in-hk](../../includes/data-box-shipping-in-hk.md)]

## [Korea](#tab/in-korea)

[!INCLUDE [data-box-shipping-in-korea](../../includes/data-box-shipping-in-korea.md)]

## [S Africa](#tab/in-sa)

[!INCLUDE [data-box-shipping-in-sa](../../includes/data-box-shipping-in-sa.md)]

## [UAE](#tab/in-uae)

[!INCLUDE [data-box-shipping-in-uae](../../includes/data-box-shipping-in-uae.md)]

## [Norway](#tab/in-norway)
[!INCLUDE [data-box-shipping-in-norway](../../includes/data-box-shipping-in-norway.md)]


---

### Self-managed shipping

[!INCLUDE [data-box-shipping-regions](../../includes/data-box-shipping-regions.md)]

[!INCLUDE [data-box-shipping-self-managed](../../includes/data-box-shipping-self-managed.md)]

::: zone target="chromeless"

## Verify data upload to Azure

[!INCLUDE [data-box-verify-upload](../../includes/data-box-verify-upload.md)]

## Erasure of data from Data Box
 
Once the upload to Azure is complete, the Data Box erases the data on its disks as per the [NIST SP 800-88 Revision 1 guidelines](https://csrc.nist.gov/News/2014/Released-SP-800-88-Revision-1,-Guidelines-for-Medi).

::: zone-end


::: zone target="docs"

## Verify data upload to Azure

[!INCLUDE [data-box-verify-upload-return](../../includes/data-box-verify-upload-return.md)]

::: zone-end

