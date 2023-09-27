---
title: Connect an emulator to Azure Storage Explorer
description: Documentation on using an emulator with Azure Storage Explorer
services: storage
author: MRayermannMSFT
ms.service: azure-storage
ms.subservice: storage-common-concepts
ms.topic: article
ms.date: 11/23/2021
ms.author: marayerm
---

# Connect an emulator to Storage Explorer

Storage Explorer can be connected to an Azure Storage emulator to aid in development. Emulators provide a free local environment for testing your code and applications. And once you're satisfied with how your application is working locally, you can switch to using a real Azure Storage account in the cloud.

## Supported emulators

Storage Explorer officially supports and recommends using [Azurite](./storage-use-azurite.md). Azurite is a cross platform, open-source emulator made by Microsoft. It supports blobs, queues, and tables. However, any emulator that functions similarly to Azurite will also likely work with Storage Explorer. Also note that Storage Explorer doesn't ship with an emulator. You'll need to download an emulator on your own.

## How to connect to an emulator

Before you can connect Storage Explorer to an emulator, you must first start the emulator. Storage Explorer doesn't start your emulator for you. If you attempt to access an emulator storage account before starting your emulator, you'll receive a message reminding you to start your emulator. If you attempt to access an emulator container, queue, or table, before starting your emulator you'll receive an error message.

Assuming you have started your emulator and it is:
- Running locally
- Configured to listen on the typical default ports of:
    - Blobs: `10000`
    - Queues: `10001`
    - Tables: `10002`
- Configured to use HTTP

Then you can quickly access your emulator resources by navigating in the resource tree view to **Local & Attached** > **Storage Accounts** > **Emulator (Default Ports)**.

If any of the above aren't true, then you'll need to manually add a connection to your emulator.

## Manually connect to an emulator

### Local emulator

If you need to manually connect to an emulator that is running locally, open the Connect dialog (plug icon in the left side) and choose **Local storage emulator**. Then fill out all required fields. Make sure to set the ports for each service type to their appropriate values. If your emulator is configured to use HTTPS, also make sure to check the checkbox for HTTPS. After you finish connecting, you can find the storage account node for your emulator under  **Local & Attached** > **Storage Accounts**.

### Remote emulator

> [!NOTE]
> Although Storage Explorer supports connnecting to a remote emulator, it is not reccomended. Certain remote emulator configurations may make it difficult for Storage Explorer to understand that an emulator is being connected to, which may affect some features. For best results, configure your emulator to use the default development account name and key, and then use a name and key connection string to connect.

If you need to manually connect to an emulator running on a different machine, then you will need to construct a connection string that details how to connect to your emulator. The connection string will likely need to explicitly define the endpoint for each service type.

Once you have a connection string, open the Connect dialog (plug icon in the left side) and choose **Storage account or service**. Then select the **Connection string** option, proceed to the next page, and use your connection string to complete the connection process. You can then find the storage account node for your emulator under **Local & Attached** > **Storage Accounts**.

## Next steps

- [Troubleshoot issues](./storage-explorer-troubleshooting.md#sign-in-issues)
