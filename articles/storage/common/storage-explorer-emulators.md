---
title: Connect an emulator to Azure Storage Explorer
description: Documentation on using an emulator with Azure Storage Explorer
services: storage
author: jinglouMSFT
ms.service: azure-storage
ms.subservice: storage-common-concepts
ms.topic: article
ms.date: 11/23/2021
ms.author: jinglou
ms.reviewer: cralvord,richardgao
---

# Connect an emulator to Storage Explorer

Storage Explorer can be connected to an Azure Storage emulator to aid in development. Emulators provide a free local environment for testing your code and applications. And once you're satisfied with how your application is working locally, you can switch to using a real Azure Storage account in the cloud.

## Supported emulators

Storage Explorer officially supports and recommends using [Azurite](./storage-use-azurite.md). Azurite is a cross platform, open-source emulator made by Microsoft. It supports blobs, queues, and tables. However, any emulator that functions similarly to Azurite can also work with Storage Explorer. Also note that Storage Explorer doesn't ship with an emulator. You need to download an emulator on your own.

## How to connect to an emulator

Before you can connect Storage Explorer to an emulator, you must first start the emulator. Storage Explorer doesn't start your emulator for you. If you attempt to access an emulator storage account before starting your emulator, a message reminds you to start your emulator. If you attempt to access an emulator container, queue, or table, before starting your emulator, you receive an error message.

Storage Explorer automatically connects to your emulator if the following conditions are true:
- The emulator is running locally.
- The emulator is configured to listen on the default ports:
    - Blobs: `10000`
    - Queues: `10001`
    - Tables: `10002`
- The emulator is configured to use HTTP

Then you can quickly access your emulator resources by navigating in the resource tree view to **Local & Attached** > **Storage Accounts** > **Emulator (Default Ports)**.

If any of the conditions aren't true, then you need to manually add a connection to your emulator.

## Manually connect to an emulator

### Local emulator

If you need to manually connect to an emulator that is running locally, open the "Connect" dialog (plug icon in the vertical toolbar) and choose **Local storage emulator**. Then fill out all required fields. Make sure to set the ports for each service type to their appropriate values. If your emulator is configured to use HTTPS, also make sure to check the checkbox for HTTPS. After you finish connecting, you can find the storage account node for your emulator under  **Local & Attached** > **Storage Accounts**.

### Remote emulator

> [!NOTE]
> Connecting Storage Explorer to a remote emulator isn't recommended. Certain remote emulator configurations might make it difficult for Storage Explorer to recognize these as emulator connections, which might affect some features. For best results, configure your emulator to use the default development account name and key, and then use a name and key connection string to connect.

If you need to manually connect to an emulator running on a different machine, then you need to construct a connection string that details how to connect to your emulator. The connection string likely needs to explicitly define the endpoint for each service type.

Once you have a connection string, open the "Connect" dialog (plug icon in the vertical toolbar) and choose **Storage account or service**. Then select the **Connection string** option, proceed to the next page, and use your connection string to complete the connection process. You can then find the storage account node for your emulator under **Local & Attached** > **Storage Accounts**.

## Next steps

- [Troubleshoot issues](./storage-explorer-troubleshooting.md#sign-in-issues)
