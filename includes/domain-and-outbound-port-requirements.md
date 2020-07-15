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
| `*.servicebus.windows.net`    | 443            | Required by the self-hosted integration runtime to connect to data movement services in Azure Data Factory. |
| `*.frontend.clouddatahub.net` | 443            | Required by the self-hosted integration runtime to connect to the Data Factory service. |
| `download.microsoft.com`    | 443            | Required by the self-hosted integration runtime for downloading the updates. If you have disabled auto-update, you can skip configuring this domain. |
| `*.core.windows.net`          | 443            | Used by the self-hosted integration runtime to connect to the Azure storage account when you use the [staged copy](https://docs.microsoft.com/azure/data-factory/copy-activity-performance#staged-copy) feature. |
| `*.database.windows.net`      | 1433           | Required only when you copy from or to Azure SQL Database or Azure SQL Data Warehouse and optional otherwise. Use the staged-copy feature to copy data to SQL Database or SQL Data Warehouse without opening port 1433. |
| `*.azuredatalakestore.net`<br>`login.microsoftonline.com/<tenant>/oauth2/token`    | 443            | Required only when you copy from or to Azure Data Lake Store and optional otherwise. |
