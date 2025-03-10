---
title: Include file
description: Include file
author: lrtoyou1223
ms.subservice: integration-runtime
ms.topic: include
ms.date: 10/09/2019
ms.author: lle
---
| Domain names                                          | Outbound ports | Description                |
| ----------------------------------------------------- | -------------- | ---------------------------|
| Public Cloud: `*.servicebus.windows.net` <br> Azure Government: `*.servicebus.usgovcloudapi.net` <br> China: `*.servicebus.chinacloudapi.cn`   | 443            | Required by the self-hosted integration runtime for interactive authoring. Not required if self-contained interactive authoring is enabled.|
| Public Cloud: `{datafactory}.{region}.datafactory.azure.net`<br> or `*.frontend.clouddatahub.net` <br> Azure Government: `{datafactory}.{region}.datafactory.azure.us` <br> China: `{datafactory}.{region}.datafactory.azure.cn` | 443            | Required by the self-hosted integration runtime to connect to the Data Factory service. <br>For new created Data Factory in public cloud, find the fully qualified domain name (FQDN) from your Self-hosted Integration Runtime key, which is in format {data factory}.{region}.datafactory.azure.net. For old Data factory and any version of Azure Synapse Analytics, if you don't see the FQDN in your Self-hosted Integration key, use *.frontend.clouddatahub.net instead. |
| `download.microsoft.com`    | 443            | Required by the self-hosted integration runtime for downloading the updates. If you disabled autoupdate, you can skip configuring this domain. |
| Key Vault URL | 443           | Required by Azure Key Vault if you store the credential in Key Vault. |
