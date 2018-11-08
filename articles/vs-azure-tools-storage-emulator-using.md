---
title: Configuring and using the Storage Emulator with Visual Studio | Microsoft Docs
description: Configuring and using the Storage Emulator with Visual Studio
services: visual-studio-online
author: ghogen
manager: douge
assetId: c8e7996f-6027-4762-806e-614b93131867
ms.prod: visual-studio-dev15
ms.technology: vs-azure
ms.custom: vs-azure
ms.workload: azure-vs
ms.topic: conceptual
ms.date: 8/17/2017
ms.author: ghogen

---
# Configuring and Using the Storage Emulator with Visual Studio
[!INCLUDE [storage-try-azure-tools](../includes/storage-try-azure-tools.md)]

## Overview
The Azure SDK development environment includes the storage emulator, a utility that simulates the Blob, Queue, and Table storage services available in Azure on your local development machine. If you are building a cloud service that employs the Azure storage services, or writing any external application that calls the storage services, you can test your code locally against the storage emulator. The Azure Tools for Microsoft Visual Studio integrate management of the storage emulator into Visual Studio. The Azure Tools initialize the storage emulator database on first use, starts the storage emulator service when you run or debug your code from Visual Studio, and provides read-only access to the storage emulator data via the Azure Storage Explorer.

For detailed information on the storage emulator, including system requirements and custom configuration instructions, see [Use the Azure Storage Emulator for Development and Testing](storage/common/storage-use-emulator.md).

> [!NOTE]
> There are some differences in functionality between the storage emulator simulation and the Azure storage services. See [Differences Between the Storage Emulator and Azure Storage Services](storage/common/storage-use-emulator.md) in the Azure SDK documentation for information on the specific differences.
> 
> 

## Configuring a connection string for the storage emulator
To access the storage emulator from code within a role, you will want to configure a connection string that points to the storage emulator and that can later be changed to point to an Azure storage account. A connection string is a configuration setting that your role can read at runtime to connect to a storage account. For more information about how to create connection strings, see [Configure Azure Storage connection strings](/azure/storage/common/storage-configure-connection-string).

> [!NOTE]
> You can return a reference to the storage emulator account from your code by using the **DevelopmentStorageAccount** property. This approach works correctly if you want to access the storage emulator from your code, but if you plan to publish your application to Azure, you will need to create a connection string to access your Azure storage account and modify your code to use that connection string before you publish it. If you are switching between the storage emulator account and an Azure storage account frequently, a connection string will simplify this process.
> 
> 

## Initializing and running the storage emulator
You can specify that when you run or debug your service in Visual Studio, Visual Studio automatically launches the storage emulator. In Solution Explorer, open the shortcut menu for your **Azure** project and choose **Properties**. On the **Development** tab, in the **Start Azure Storage Emulator** list, choose **True** (if it isn't already set to that value).

The first time you run or debug your service from Visual Studio, the storage emulator launches an initialization process. This process reserves local ports for the storage emulator and creates the storage emulator database. Once complete, this process does not need to run again unless the storage emulator database is deleted.

> [!NOTE]
> Starting with the June 2012 release of the Azure Tools, the storage emulator runs, by default, in SQL Express LocalDB. In earlier releases of the Azure Tools, the storage emulator runs against a default instance of SQL Express 2005 or 2008, which you must install before you can install the Azure SDK. You can also run the storage emulator against a named instance of SQL Express or a named or default instance of Microsoft SQL Server. If you need to configure the storage emulator to run against an instance other than the default instance, see [Use the Azure Storage Emulator for Development and Testing](storage/common/storage-use-emulator.md).
> 
> 

The storage emulator provides a user interface to view the status of the local storage services and to start, stop, and reset them. Once the storage emulator service has been started, you can display the user interface or start or stop the service by right-clicking the notification area icon for the Microsoft Azure Emulator in the Windows taskbar.

## Viewing storage emulator data in Server Explorer
The Azure Storage node in Server Explorer enables you to view data and change settings for blob and table data in your storage accounts, including the storage emulator. See [Manage Azure Blob Storage resources with Storage Explorer](https://docs.microsoft.com/azure/vs-azure-tools-storage-explorer-blobs) for more information.

