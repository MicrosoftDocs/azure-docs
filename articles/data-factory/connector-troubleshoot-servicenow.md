---
title: Troubleshoot the ServiceNow connector
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to troubleshoot issues with the ServiceNow connector in Azure Data Factory and Azure Synapse Analytics. 
author: jianleishen
ms.subservice: data-movement
ms.topic: troubleshooting
ms.date: 04/17/2025
ms.author: jianleishen
ms.custom: has-adal-ref, synapse
---

# Troubleshoot the ServiceNow connector in Azure Data Factory and Azure Synapse

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article provides suggestions to troubleshoot common problems with the ServiceNow connector in Azure Data Factory and Azure Synapse. 

## Error code: DEDICATED_DPERORCODE0

- **Cause**: Object reference not set to an instance of an object.

- **Recommendation**: You are recommended to have a role with at least read access to *sys_glide_object* tables in ServiceNow.    
 
## Related content

For more troubleshooting help, try these resources:

- [Connector troubleshooting guide](connector-troubleshoot-guide.md)
- [Data Factory blog](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/bg-p/AzureDataFactoryBlog)
- [Data Factory feature requests](https://feedback.azure.com/d365community/forum/1219ec2d-6c26-ec11-b6e6-000d3a4f032c)
- [Azure videos](/shows/data-exposed/?products=azure&terms=data-factory)
- [Microsoft Q&A page](/answers/topics/azure-data-factory.html)
- [Stack Overflow forum for Data Factory](https://stackoverflow.com/questions/tagged/azure-data-factory)
- [X information about Data Factory](https://x.com/hashtag/DataFactory)
