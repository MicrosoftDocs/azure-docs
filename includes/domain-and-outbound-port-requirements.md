---
title: include file
description: include file
services: data-factory
author: nabhishek
ms.service: data-factory
ms.topic: include
ms.date: 10/09/2019
ms.author: abnarain
---
| Domain names                  | Outbound ports | Description                              |
| ----------------------------- | -------------- | ---------------------------------------- |
| `*.servicebus.windows.net`    | 443            | Required by the self-hosted integration runtime to connect to data movement services in Data Factory. |
| `*.frontend.clouddatahub.net` | 443            | Required by the self-hosted integration runtime to connect to the Data Factory service. |
| `download.microsoft.com`    | 443            | Required by the self-hosted integration runtime for downloading the updates. If you have disabled auto-update then you may skip this. |
| `*.core.windows.net`          | 443            | Used by the self-hosted integration runtime to connect to the Azure storage account when you use the [staged copy](https://docs.microsoft.com/azure/data-factory/copy-activity-performance#staged-copy) feature. |
| `*.database.windows.net`      | 1433           | (Optional) Required when you copy from or to Azure SQL Database or Azure SQL Data Warehouse. Use the staged copy feature to copy data to Azure SQL Database or Azure SQL Data Warehouse without opening port 1433. |
| `*.azuredatalakestore.net`<br>`login.microsoftonline.com/<tenant>/oauth2/token`    | 443            | (Optional) Required when you copy from or to  Azure Data Lake Store. |
