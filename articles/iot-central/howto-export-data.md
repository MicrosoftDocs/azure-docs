---
title: Export your data in Azure IoT Central | Microsoft Docs
description: How to export data from your Azure IoT Central application
services: iot-central
author: viv-liu
ms.author: viviali
ms.date: 12/07/2018
ms.topic: conceptual
ms.service: iot-central
manager: peterpr
---

# Export your data in Azure IoT Central

*This topic applies to administrators.*

This article describes how to use the continuous data export feature in Azure IoT Central to export your data to your own **Azure Blob Storage**, **Azure Event Hubs**, and **Azure Service Bus** instances. You can export **measurements**, **devices**, and **device templates** to your own destination for warm path and cold path analytics. You can export data to Blob storage to run long-term trend analysis in Microsoft Power BI, or export data to Event Hubs and Service Bus to transform and augment your data in near-realtime with Azure Logic Apps or Azure Functions.

> [!Note]
> When you turn on continuous data export, you get only the data from that moment onward. Currently, data can't be retrieved for a time when continuous data export was off. To retain more historical data, turn on continuous data export early.


## Prerequisites

- You must be an administrator in your IoT Central application

## Export to Azure Event Hubs and Azure Service Bus

Measurements, devices, and device templates data are exported to your event hub or Service Bus queue or topic in near-realtime. Exported measurements data contains the entirety of the message your devices sent to IoT Central, not just the values of the measurements themselves. Exported devices data contains changes to properties and settings of all devices, and exported device templates contains changes to all device templates. The exported data is in JSON format.

> [!NOTE]
> Devices deleted and device templates deleted aren't exported. Currently, there is no indicator in the data streams that show devices or device templates being deleted.

## Export to Azure Blob Storage

Measurements, devices, and device templates data are exported to your storage account once per minute, with each file containing the batch of changes since the last exported file. The exported data is in [Apache AVRO](https://avro.apache.org/docs/current/index.html) format.

## Set up continuous data export

1. If you don't have an Azure storage account, [create a new storage account](https://ms.portal.azure.com/#create/Microsoft.StorageAccount-ARM) in the Azure portal. Create the storage account **in the Azure subscription that has your IoT Central application**.
    - For the account type, choose **General purpose** or **Blob storage**.
    - Select the subscription that has your IoT Central application. If you don't see the subscription, you might need to sign in to a different Azure account or request access to the subscription.
    - Choose an existing resource group or create a new one. Learn about [how to create a new storage account](https://aka.ms/blobdocscreatestorageaccount).

2. Create a container in your storage account to export your IoT Central data. Go to your storage account. Under **Blob Service**, select **Browse Blobs**. Select **Container** to create a new container.

   ![Create a container](media/howto-export-data/createcontainer.png)

3. Sign in to your IoT Central application by using the same Azure account.

4. Under **Administration**, select **Data Export**.

5. In the **Storage account** drop-down list box, select your storage account. In the **Container** drop-down list box, select your container. Under **Data to export**, specify each type of data to export by setting the type to **On**.

6. To turn on continuous data export, set **Data export** to **On**. Select **Save**.

  ![Configure continuous data export](media/howto-export-data/continuousdataexport.PNG)

7. After a few minutes, your data appears in your storage account. Browse to your storage account. Select **Browse blobs** > your container. You see three folders for the export data. The default paths for the AVRO files with the export data are:
    - Messages: {container}/measurements/{hubname}/{YYYY}/{MM}/{dd}/{hh}/{mm}/{filename}.avro
    - Devices: {container}/devices/{YYYY}/{MM}/{dd}/{hh}/{mm}/{filename}.avro
    - Device templates: {container}/deviceTemplates/{YYYY}/{MM}/{dd}/{hh}/{mm}/{filename}.avro

## Next steps

Now that you know how to export your data, continue to the next step:

> [!div class="nextstepaction"]
> [How to visualize your data in Power BI](howto-connect-powerbi.md)
