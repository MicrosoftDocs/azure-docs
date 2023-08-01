---
title: Walkthrough Request Direct Peering Type Conversion
description: How to request a type conversion for a Direct Peering
services: internet-peering
author: hugobaldner
ms.service: internet-peering
ms.topic: how-to
ms.date: 07/30/2023
ms.author: hugobaldner 
ms.custom: template-how-to, engagement-fy23
---

# Direct Peering Type Conversion Request Walkthrough

In this article, you learn how to use the Azure portal to request a direct peering type conversion


## Before you begin

A direct peering type conversion for a peering connection can only be requested if the following prerequisites apply:
-  There must be redundant connection(s) within the peering
-  The redundant connection must be of equal bandwidth 
-  Connections must be fully provisioned (Connection State should be set to "Active")
-  No connection in the peering can be in the process of decommission or device migration
-  Peering must be represented as an Azure Resource with a valid Subscription
-  Bandwidth updates cannot be requested to other connections in the peering during the conversion
-  No adding or removing of connections can occur during the conversion
-  The type conversion will run during the business hours of Pacific Daylight Time.
-  For Voice conversions you will need to be ready to set up bfd as soon as notified as well as configuring the new ip addresses provided through email

> [!NOTE]
> IF your peering is not currently an Azure Resource please refer to the [legacy subscription conversion document](./howto-legacy-direct-portal.md).
## Finding the type conversions page

Select the "Configuration" Page under the Settings section of your Peering's Page
:::image type="content" source="./media/walkthrough-type-conversion/conversionstab.png" alt-text="Screenshot shows how to view Conversions tab in the Azure portal." lightbox="./media/walkthrough-type-conversion/conversionstab.png":::


## Converting from PNI to Voice
PNI or MAPS to Voice will be done to all connections as it is done at a peering level.

Select the "Configuration" Page under the Settings section of your Peering's Page

Select the "(with Voice)"" option
:::image type="content" source="./media/walkthrough-type-conversion/conversionselection.png" alt-text="Screenshot shows how to select within the Conversions tab in the Azure portal." lightbox="./media/walkthrough-type-conversion/conversionselection.png":::

Select Save
:::image type="content" source="./media/walkthrough-type-conversion/savepage.png" alt-text="Screenshot shows how to save the changes within the  Conversions tab in the Azure portal." lightbox="./media/walkthrough-type-conversion/savepage.png":::

## Enabling Peering Service on a Connection
PNI to MAPS can be done on a connection basis.

Navigate to the Connection tab in order to request conversions to Peering Service on a connection basis
:::image type="content" source="./media/walkthrough-type-conversion/conversionselection.png" alt-text="Screenshot shows how to select within the Conversions tab in the Azure portal." lightbox="./media/walkthrough-type-conversion/conversionselection.png":::

## What Happens Next
Your request will  be approved by a member of our team.

After approval connections will be processed one at a time making sure to keep redundant connection(s) open.

Connections will go through the TypeChangeRequested state until the type change is completed at which point it will return to active

## FAQ

**Q.** Will there be an interuption to my connection?

**A.** We do our absolute best and take various steps to prevent any interuption to service. These steps include:
-  Guaranteeing a redundant connection with equivelent bandwidth is up at time of conversion.
-  Performing any conversions one connection at a time.
-  Only bringing down old connections if it is necessary.
-  Only bringing down old connections once the new connection is established 
-  Only bringing down old connections once the traffic has ceased.
-  Only preforming conversions at times were engineers are online and capable of assisting in any unlikely issues.  

**Q.** Will I get any emails to follow along with the process?

**A.**You will be kept up to date through emails at the following steps:
-  Request Received
-  Request Approved
-  Session Address Changes (if any)
-  Conversion complete
-  Peering Azure Resource removal (if any)

In the case of a request rejection or any action needed by you from our team you will also recieve an email

**Q.** I have more questions what is a good place to contact you at?

**A.** The best contact email is: [Microsoft Azure Peering](mailto:mapschamps@microsoft.com).
