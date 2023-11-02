---
title: Tutorial to return Azure Data Box
description: In this tutorial, learn how to return Azure Data Box, including shipping the device, verifying data upload to Azure, and erasing data from Data Box.
services: databox
author: stevenmatthew

ms.service: databox
ms.subservice: pod
ms.topic: tutorial
ms.custom: references_regions
ms.date: 01/23/2023
ms.author: shaas
zone_pivot_groups: data-box-shipping

# Customer intent: As an IT admin, I need to be able to return a Data Box to upload on-premises data from my server onto Azure.
---

::: zone target="docs"

# Tutorial: Return Azure Data Box and verify data has been uploaded to Azure

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
> * Ship Data Box to Microsoft
> * Verify data upload to Azure
> * Erasure of data from Data Box

## Prerequisites

Before you begin, make sure:

* You've completed the [Tutorial: Prepare to ship Azure Data Box](data-box-deploy-prepare-to-ship.md).
* The data copy to the device completed and the **Prepare to ship** run was successful.

::: zone-end

## Ship Data Box back 

Based on the region where you're shipping the device, the procedure is different. In many countries/regions, you can use Microsoft managed shipping or [self-managed shipping](#self-managed-shipping).

::: zone pivot="americas" 

If using Microsoft managed shipping, follow these steps. 

## Shipping in Americas 

### US & Canada

[!INCLUDE [data-box-shipping-in-us-canada](../../includes/data-box-shipping-in-us-canada.md)]

::: zone-end

::: zone pivot="europe" 

If using Microsoft managed shipping, follow these steps. 

## Shipping in Europe 

### [EU](#tab/in-europe)

[!INCLUDE [data-box-shipping-in-eu](../../includes/data-box-shipping-in-eu.md)]

**If you're shipping back to Azure datacenters in Germany or Switzerland,** you can also [use self-managed shipping](#self-managed-shipping).

### [UK](#tab/in-uk)

[!INCLUDE [data-box-shipping-in-uk](../../includes/data-box-shipping-in-uk.md)]

### [Norway](#tab/in-norway)
[!INCLUDE [data-box-shipping-in-norway](../../includes/data-box-shipping-in-norway.md)]

::: zone-end

::: zone pivot="asia" 

If using Microsoft managed shipping, follow these steps. 

## Shipping in Asia

### [Japan](#tab/in-japan)

[!INCLUDE [data-box-shipping-in-japan](../../includes/data-box-shipping-in-japan.md)]

### [Singapore](#tab/in-singapore)

[!INCLUDE [data-box-shipping-in-singapore](../../includes/data-box-shipping-in-singapore.md)]

### [Hong Kong Special Administrative Region](#tab/in-hk)

[!INCLUDE [data-box-shipping-in-hk](../../includes/data-box-shipping-in-hk.md)]

### [Korea](#tab/in-korea)

[!INCLUDE [data-box-shipping-in-korea](../../includes/data-box-shipping-in-korea.md)]

### [UAE](#tab/in-uae)

[!INCLUDE [data-box-shipping-in-uae](../../includes/data-box-shipping-in-uae.md)]

### [India](#tab/in-india)

[!INCLUDE [data-box-shipping-in-india](../../includes/data-box-shipping-in-india.md)]


::: zone-end

::: zone pivot="australia"

If using Microsoft managed shipping, follow these steps.

## Shipping in Australia

### Australia

[!INCLUDE [data-box-shipping-in-australia](../../includes/data-box-shipping-in-australia.md)]

::: zone-end

::: zone pivot="africa" 

If using Microsoft managed shipping, follow these steps. 

## Shipping in Africa

### S Africa

[!INCLUDE [data-box-shipping-in-sa](../../includes/data-box-shipping-in-sa.md)]

::: zone-end

## Self-managed shipping

Self-managed shipping is available as an option when you [Order Azure Data Box](data-box-disk-deploy-ordered.md). For detailed steps, see [Use self-managed shipping](data-box-portal-customer-managed-shipping.md).

[!INCLUDE [data-box-shipping-regions](../../includes/data-box-shipping-regions.md)]

[!INCLUDE [data-box-shipping-self-managed](../../includes/data-box-shipping-self-managed.md)]

::: zone pivot="americas"

### Shipping in Brazil

To schedule a device return in Brazil, send an email to [adbops@microsoft.com](mailto:adbops@microsoft.com) with the following information:

```
Subject: Request Azure Data Box Disk drop-off for order: <ordername>

- Order name
- Contact name of the person who will drop off the Data Box Disk (A government-issued photo ID will be required to validate the contact’s identity upon arrival.) 
- Inbound Nota Fiscal (A copy of the inbound Nota Fiscal will be required at drop-off.)   
```

::: zone-end

::: zone target="chromeless"

## Verify data has been uploaded to Azure 

[!INCLUDE [data-box-verify-upload](../../includes/data-box-verify-upload.md)]

## Data erasure from Data Box
 
Once the upload to Azure is complete, the Data Box erases the data on its disks as per the [NIST SP 800-88 Revision 1 guidelines](https://csrc.nist.gov/News/2014/Released-SP-800-88-Revision-1,-Guidelines-for-Medi).

::: zone-end


::: zone target="docs"

## Verify data has uploaded to Azure

[!INCLUDE [data-box-verify-upload-return](../../includes/data-box-verify-upload-return.md)]

::: zone-end

