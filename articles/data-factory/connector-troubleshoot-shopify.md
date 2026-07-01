---
title: Troubleshoot the Shopify connector
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to troubleshoot issues with the Shopify connector in Azure Data Factory and Azure Synapse Analytics. 
author: jianleishen
ms.subservice: data-movement
ms.topic: troubleshooting
ms.date: 03/30/2026
ms.author: jianleishen
ms.custom: has-adal-ref, synapse
---

# Troubleshoot the Shopify connector in Azure Data Factory and Azure Synapse

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article provides suggestions to troubleshoot common problems with the Shopify connector in Azure Data Factory and Azure Synapse. 

### Error message: Object reference not set to an instance of an object

- **Symptoms**: Copy activity fails with the following error:

    `'Type=System.NullReferenceException,Message=Object reference not set to an instance of an object.,Source=Microsoft.DI.Driver.Shopify,StackTrace=   at Microsoft.DI.Driver.Shopify.Context.ShopifyContext.GetEdgeNodeNameFromTableName(String tableNameGraphTypeName)`

- **Cause**: The table name specified in the source configuration is not valid. This usually happens when upgrading from Shopify connector version 1.0 to 2.0, as the table name formats are different in version 2.0.

- **Resolution**: Check and update the table name to ensure it follows the Shopify connector version 2.0 naming conventions. For more information, see this [article](connector-shopify.md#dataset-properties). 
 
## Related content

For more troubleshooting help, try these resources:

- [Connector troubleshooting guide](connector-troubleshoot-guide.md)
- [Data Factory blog](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/bg-p/AzureDataFactoryBlog)
- [Data Factory feature requests](https://feedback.azure.com/d365community/forum/1219ec2d-6c26-ec11-b6e6-000d3a4f032c)
- [Azure videos](/shows/data-exposed/?products=azure&terms=data-factory)
- [Microsoft Q&A page](/answers/topics/azure-data-factory.html)
- [Stack Overflow forum for Data Factory](https://stackoverflow.com/questions/tagged/azure-data-factory)
- [X information about Data Factory](https://x.com/hashtag/DataFactory)
