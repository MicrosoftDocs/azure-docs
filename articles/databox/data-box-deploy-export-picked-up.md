---
title: Tutorial to ship Azure Data Box back in export order | Microsoft Docs
description: Learn how to ship your Azure Data Box to Microsoft after the export order is complete
services: databox
author: stevenmatthew

ms.service: databox
ms.subservice: pod
ms.topic: tutorial
ms.date: 06/16/2022
ms.author: shaas
zone_pivot_groups: data-box-shipping

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
