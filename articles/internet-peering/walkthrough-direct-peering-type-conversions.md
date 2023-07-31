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

Please note the following prequisites:
-  There are redundant connection(s) within the peering
-  The redundant connection should be of equal bandwidth 
-  Connections should be fully provisioned (Conection State should be set to "Active")
-  Connections should not be undergoing any changes (for example: device migration)
-  Peering must be represented as an Azure Resource with a valid Subscription
-  No Bandwidth Updates are expected to happen during the conversion
-  No adding or removing of connections can occur during the conversion
-  The type conversion will run during the business hours of Pacific Daylight Time.
-  Only one peering per distinct Location, Provider, and Type can be created

## Finding the type conversions page

Select the "Configuration" Page under the Settings section of your Peering's Page
:::image type="content" source="./media/walkthrough-type-conversion/conversionstab.png" alt-text="Screenshot shows how to view Conversions tab in the Azure portal." lightbox="./media/walkthrough-type-conversion/conversionstab.png":::


## Converting from PNI or Microsoft Azure Peering Service to Voice
PNI or MAPS to Voice will be done to all connections as it is done at a peering level.
Select the "(with Voice) option"
:::image type="content" source="./media/walkthrough-type-conversion/conversionselection.png" alt-text="Screenshot shows how to select within the Conversions tab in the Azure portal." lightbox="./media/walkthrough-type-conversion/conversionselection.png":::

Select Save
:::image type="content" source="./media/walkthrough-type-conversion/savepage.png" alt-text="Screenshot shows how to save the changes within the  Conversions tab in the Azure portal." lightbox="./media/walkthrough-type-conversion/savepage.png":::

## Converting from PNI to Microsoft Azure Peering Service
PNI to MAPS can be done on a connection basis.
Select the "(with Voice) option"
:::image type="content" source="./media/walkthrough-type-conversion/conversionselection.png" alt-text="Screenshot shows how to select within the Conversions tab in the Azure portal." lightbox="./media/walkthrough-type-conversion/conversionselection.png":::

Select Save
:::image type="content" source="./media/walkthrough-type-conversion/savepage.png" alt-text="Screenshot shows how to save the changes within the  Conversions tab in the Azure portal." lightbox="./media/walkthrough-type-conversion/savepage.png":::


## Next Steps

To get your request approved please contact
Contact [Microsoft Azure Peering](mailto:mapschamps@microsoft.com).

After approval connections will be processed one at a time 
