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
| `*.servicebus.windows.net`    | 443            | Required by the self-hosted integration runtime for interactive authoring. |
| `{datafactory}.{region}.datafactory.azure.net`<br> or `*.frontend.clouddatahub.net` | 443            | Required by the self-hosted integration runtime to connect to the Data Factory service. <br>For new created Data Factory, please find the FQDN from your Self-hosted Integration Runtime key which is in format {datafactory}.{region}.datafactory.azure.net. For old Data factory, if you don't see the FQDN in your Self-hosted Integration key, please use *.frontend.clouddatahub.net instead. |
| `download.microsoft.com`    | 443            | Required by the self-hosted integration runtime for downloading the updates. If you have disabled auto-update, you can skip configuring this domain. |
| `*.core.windows.net`          | 443            | Used by the self-hosted integration runtime to connect to the Azure storage account when you use the [staged copy](../copy-activity-performance.md#staged-copy) feature. |
| `*.database.windows.net`      | 1433           | Required only when you copy from or to Azure SQL Database or Azure Synapse Analytics and optional otherwise. Use the staged-copy feature to copy data to SQL Database or Azure Synapse Analytics without opening port 1433. |
| `*.azuredatalakestore.net`<br>`login.microsoftonline.com/<tenant>/oauth2/token`    | 443            | Required only when you copy from or to Azure Data Lake Store and optional otherwise. |
