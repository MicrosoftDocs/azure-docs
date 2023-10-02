---
title: Troubleshoot the XML format connector
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to troubleshoot issues with the XML format connector in Azure Data Factory and Azure Synapse Analytics. 
author: jianleishen
ms.service: data-factory
ms.subservice: data-movement
ms.topic: troubleshooting
ms.date: 01/25/2023
ms.author: jianleishen
ms.custom: has-adal-ref, synapse
---

# Troubleshoot the XML format connector in Azure Data Factory and Azure Synapse

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article provides suggestions to troubleshoot common problems with the XML format connector in Azure Data Factory and Azure Synapse.

## Error code: XmlSinkNotSupported

- **Message**: `Write data in XML format is not supported yet, choose a different format!`

- **Cause**: An XML dataset was used as a sink dataset in your copy activity.

- **Recommendation**:  Use a dataset in a different format from that of the sink dataset.


## Error code: XmlAttributeColumnNameConflict

- **Message**: `Column names %attrNames;' for attributes of element '%element;' conflict with that for corresponding child elements, and the attribute prefix used is '%prefix;'.`

- **Cause**: An attribute prefix was used, which caused the conflict.

- **Recommendation**:  Set a different value for the "attributePrefix" property.


## Error code: XmlValueColumnNameConflict

- **Message**: `Column name for the value of element '%element;' is '%columnName;' and it conflicts with the child element having the same name.`

- **Cause**: One of the child element names was used as the column name for the element value.

- **Recommendation**:  Set a different value for the "valueColumn" property.


## Error code: XmlInvalid

- **Message**: `Input XML file '%file;' is invalid with parsing error '%error;'.`

- **Cause**: The input XML file is not well formed.

- **Recommendation**:  Correct the XML file to make it well formed.

## Next steps

For more troubleshooting help, try these resources:

- [Connector troubleshooting guide](connector-troubleshoot-guide.md)
- [Data Factory blog](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/bg-p/AzureDataFactoryBlog)
- [Data Factory feature requests](/answers/topics/azure-data-factory.html)
- [Azure videos](https://azure.microsoft.com/resources/videos/index/?sort=newest&services=data-factory)
- [Microsoft Q&A page](/answers/topics/azure-data-factory.html)
- [Stack Overflow forum for Data Factory](https://stackoverflow.com/questions/tagged/azure-data-factory)
- [Twitter information about Data Factory](https://twitter.com/hashtag/DataFactory)
