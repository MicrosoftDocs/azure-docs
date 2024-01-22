---
title: Tutorial to order Azure Data Box Heavy | Microsoft Docs
description: In this tutorial, learn about Azure Data Box Heavy, a hybrid solution that allows you to import on-premises data into Azure, and how to order Data Box Heavy.
services: databox
author: stevenmatthew

ms.service: databox
ms.subservice: heavy
ms.topic: tutorial
ms.date: 01/04/2022
ms.author: shaas
ms.custom: contperf-fy22q1
#Customer intent: As an IT admin, I need to be able to order Data Box Heavy to upload on-premises data from my server onto Azure.
---

# Tutorial: Order Azure Data Box Heavy


Azure Data Box Heavy is a hybrid solution that allows you to import your on-premises data into Azure in a quick, easy, and reliable way. You transfer your data to a Microsoft-supplied 770 TB (approximate usable capacity) storage device and then ship the device back. This data is then uploaded to Azure.

This tutorial describes how you can order an Azure Data Box Heavy. In this tutorial, you learn about:

> [!div class="checklist"]
> * Prerequisites for Data Box Heavy
> * Order a Data Box Heavy
> * Track the order
> * Cancel the order

## Prerequisites

Complete the following configuration prerequisites for Data Box service and device before you deploy the device.

### For installation site

Before you begin, make sure that:

- The device fits through standard doorways and entryways. However, do make sure that the device can fit through all your entryways. Device dimensions are: width: 26" length: 48" height: 28".
- If installed on a floor other than the ground floor, you need access for the device via an elevator or a ramp. The device weighs approximately ~500 lbs.
- Make sure that you have a flat site in the datacenter with proximity to an available network connection that can accommodate a device with this footprint.

### For service

[!INCLUDE [Data Box service prerequisites](../../includes/data-box-supported-subscriptions.md)]

### For device

Before you begin, make sure that:
- Your device is unpacked.
- You should have a host computer connected to the datacenter network. Data Box Heavy will copy the data from this computer. Your host computer must run a supported operating system as described in [Azure Data Box Heavy system requirements](data-box-system-requirements.md).
- You need to have a laptop with RJ-45 cable to connect to the local UI and configure the device. Use the laptop to configure each node of the device once.
- Your datacenter needs to have high-speed network. We strongly recommend that you have at least one 10-GbE connection.
- You need one 40-Gbps or 10-Gbps cable per device node. Choose cables that are compatible with the Mellanox MCX314A-BCCT network interface:

    - For the 40-Gbps cable, device end of the cable needs to be QSFP+.
    - For the 10-Gbps cable, you need an SFP+ cable that plugs into a 10 G switch on one end, with a QSFP+ to SFP+ adapter (or the QSA adapter) for the end that plugs into the device.
    - The power cables are included with the device.

## Order Data Box Heavy

[!INCLUDE [order-data-box-via-portal](../../includes/data-box-order-portal.md)]

The Data Box team will contact you to get more information about your requirements so they can determine whether Data Box Heavy service is available in the needed location. The order remains in an **Ordered** state while they review the order. They'll notify you if for some reason they can't fill your order.

## Track the order

After you have placed the order, you can track the status of the order from Azure portal. Go to your Data Box Heavy order and then go to **Overview** to view the status. The portal shows the order in **Ordered** state.

If the device is not available, you receive a notification. If the device is available, Microsoft identifies the device for shipment and prepares the shipment. During device preparation, following actions occur:

- SMB shares are created for each storage account associated with the device.
- For each share, access credentials such as username and password are generated.
- Device password that helps unlock the device is also generated.
- The Data Box Heavy is locked to prevent unauthorized access to the device at any point.

When the device preparation is complete, the portal shows the order in **Processed** state.

![Data Box Heavy order processed](media/data-box-overview/data-box-order-status-processed.png)

Microsoft then prepares and dispatches your device via a regional carrier. You receive a tracking number once the device is shipped. The portal shows the order in **Dispatched** state.

![Data Box Heavy order dispatched](media/data-box-overview/data-box-order-status-dispatched.png)

## Cancel the order

To cancel this order, in the Azure portal, go to **Overview** and click **Cancel** from the command bar.

After placing an order, you can cancel it at any point before the order status is marked processed.
 
To delete a canceled order, go to **Overview** and click **Delete** from the command bar.

## Next steps

In this tutorial, you learned about Azure Data Box Heavy topics such as:

> [!div class="checklist"]
> * Prerequisites
> * Order Data Box Heavy
> * Track the order
> * Cancel the order

Advance to the next tutorial to learn how to set up your Data Box Heavy.

> [!div class="nextstepaction"]
> [Set up your Azure Data Box Heavy](./data-box-heavy-deploy-set-up.md)
