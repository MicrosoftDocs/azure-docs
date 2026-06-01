---
title: Troubleshoot the Teradata connector
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to troubleshoot issues with the Teradata connector in Azure Data Factory and Azure Synapse Analytics. 
author: jianleishen
ms.subservice: data-movement
ms.topic: troubleshooting
ms.date: 05/08/2025
ms.author: jianleishen
ms.custom: has-adal-ref, synapse
---

# Troubleshoot the Teradata connector in Azure Data Factory and Azure Synapse

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article provides suggestions to troubleshoot common problems with the Teradata connector in Azure Data Factory and Azure Synapse. 

## Applies to: Version 2.0 (Preview)

This section provides troubleshooting guidance for issues encountered when using Teradata connector version 2.0 (Preview) in Azure Data Factory and Azure Synapse.

### Error Message: Could not resolve Data Source=xxx.xxx.xxx to an available node after 1 attempts.

- **Symptoms**: Copy activity fails with the following error:

    **Message**: `[.NET Data Provider for Teradata] [115025] Could not resolve Data Source=xxx.xxx.xxx to an available node after 1 attempts. [Socket Transport] [10060] System.Net.Sockets.SocketException (0x80004005): A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond xx.xx.xx.xx.`

- **Cause**: A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond xx.xx.xx.xx.

- **Resolution**: You are recommended to use a different SSL mode.

### Error Message: Remote certificate error.

- **Symptoms**: Copy activity fails with the following error:

    **Message**: `[.NET Data Provider for Teradata] [115056] Remote certificate error. Details: SslPolicyErrors: RemoteCertificateNameMismatch.`

- **Cause**: The Subject Alternative Name (SAN) extension of the remote TLS certificate does not contain the hostname or the IP address which was used to establish the connection.

- **Resolution**: You are recommended to use a different SSL mode.

## Related content

For more troubleshooting help, try these resources:

- [Connector troubleshooting guide](connector-troubleshoot-guide.md)
- [Data Factory blog](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/bg-p/AzureDataFactoryBlog)
- [Data Factory feature requests](https://feedback.azure.com/d365community/forum/1219ec2d-6c26-ec11-b6e6-000d3a4f032c)
- [Microsoft Q&A page](/answers/topics/azure-data-factory.html)
- [Stack Overflow forum for Data Factory](https://stackoverflow.com/questions/tagged/azure-data-factory)
- [X information about Data Factory](https://x.com/hashtag/DataFactory)
