---
title: Tutorial to ship Azure Data Box
description: In this tutorial, learn how to prepare to ship Data Box for return.
services: databox
author: stevenmatthew

ms.service: databox
ms.subservice: pod
ms.topic: tutorial
ms.custom: references_regions
ms.date: 07/21/2022
ms.author: shaas

# Customer intent: As an IT admin, I need to be able to return a Data Box to upload on-premises data from my server onto Azure.
---

::: zone target="docs"

# Tutorial: Prepare to ship Azure Data Box

::: zone-end

::: zone target="docs"

This tutorial describes how to prepare your Azure Data Box to ship.

In this tutorial, you will learn about topics such as:

> [!div class="checklist"]
>
> * Prerequisites
> * Prepare to ship

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

::: zone target="docs"

## Next steps
In this tutorial, you learned about Azure Data Box topics such as:

> [!div class="checklist"]
> * Prerequisites
> * Prepare to ship

Advance to the following article to learn how to ship your Azure Data Box and verify the data uploaded to Azure. 

> [!div class="nextstepaction"]
> [Tutorial: Return Azure Data Box and verify data upload to Azure](data-box-deploy-picked-up.md)

::: zone-end