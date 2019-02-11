---
title: Connect to and manage Microsoft Azure Data Box Edge device via the Windows PowerShell interface | Microsoft Docs
description: Describes how to connect to and then manage Data Box Edge via the Windows PowerShell interface.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: article
ms.date: 02/08/2019
ms.author: alkohli
#Customer intent: As an IT admin, I need to understand what Data Box Edge is and how it works so I can use it to process and transform data before sending to Azure.
---
# Use Windows PowerShell to manage Azure Data Box Edge

Azure Data Box Edge is a storage solution that allows you to process data and send it over the network to Azure. This article describes some of the configuration and management tasks that you can perform on the Data Box Edge device. You can manage your Data Box Edge using the Azure portal UI, the local web UI, and the Windows PowerShell interface of the device.

This article focuses on the tasks that you can perform using the PowerShell interface. Use the PowerShell interface to get Azure container logs, reset the device, generate a log package for Microsoft Support, and run diagnostic tests.

This article includes the following tutorials:

- Connect to the PowerShell interface
- Generate a Support package
- View device information
- Skip checksum validation The Data Box Edge device can be managed in the Azure portal, using the local web UI and also using the PowerShell interface.

This article describes how you can manage Data Box Edge device using the PowerShell interface.

## Connect to the PowerShell interface

Depending on the operating system of your client, the procedures to remotely connect to the device are different. 

### Remotely connect from a Windows client

Before you begin, make sure that your Windows client is running Windows PowerShell 5.0 or later.

Follow these steps to remotely connect from a Windows client.

1.
2. $ip = "IP of the device"; 
Set-Item WSMan:\localhost\Client\TrustedHosts $ip -Force 
Enter-PSSession -ComputerName $ip -Credential $ip\EdgeUser -ConfigurationName Minishell
 
Provide EdgeUser's password (same password used to login into Local UI) when prompted


### Remotely connect from an NSF client

Before you begin, ensure that Follow these steps to remotely connect from a Linux client.


1. Run PowerShell as an administrator and run the following commands- 
 
 
If you experience any device issues, you can create a Support package from the system logs. Microsoft Support uses this package to troubleshoot the issue. To generate a Support package, perform the following steps:

1. In the local web UI, go to **Contact Support** and click **Create Support package**.

    ![Create Support package 1](media/data-box-local-web-ui-admin/create-support-package-1.png)

2. A Support package is gathered. This operation takes a few minutes.

    ![Create Support package 2](media/data-box-local-web-ui-admin/create-support-package-2.png)

3. Once the Support package creation is complete, click **Download Support package**. 

    ![Create Support package 4](media/data-box-local-web-ui-admin/create-support-package-4.png)

4. Browse and choose the download location. Open the folder to view the contents.

    ![Create Support package 5](media/data-box-local-web-ui-admin/create-support-package-5.png)

## Key capabilities

Data Box Edge has the following capabilities:

|Capability |Description  |
|---------|---------|
|High performance     | Fully automated and highly optimized data transfer and bandwidth.|
|Supported protocols     | Support for standard SMB and NFS protocols for data ingestion. <br> For more information on supported versions, go to [Data Box Edge system requirements](https://aka.ms/dbe-docs).|
|Computing       |Allows analysis, processing, filtering of data.|
|Data access     | Direct data access from Azure Storage Blobs and Azure Files using cloud APIs for additional data processing in the cloud.|
|Fast access     | Local cache on the device for fast access of most recently used files.|
|Offline upload     | Disconnected mode supports offline upload scenarios.|
|Data refresh     | Ability to refresh local files with the latest from cloud.|
|Encryption    | BitLocker support to locally encrypt data and secure data transfer to cloud over *https*.       |
|Resiliency     | Built-in network resiliency.        |


## Next steps

- Review the [Data Box Edge system requirements](https://aka.ms/dbe-docs).
- Understand the [Data Box Edge limits](https://aka.ms/dbe-docs).
- Deploy [Azure Data Box Edge](https://aka.ms/dbe-docs) in Azure portal.
