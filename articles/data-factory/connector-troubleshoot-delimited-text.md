---
title: Troubleshoot the delimited text format connector
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to troubleshoot issues with the delimited text format connector in Azure Data Factory and Azure Synapse Analytics. 
author: jianleishen
ms.service: data-factory
ms.subservice: data-movement
ms.topic: troubleshooting
ms.date: 01/18/2023
ms.author: jianleishen
ms.custom: has-adal-ref, synapse
---

# Troubleshoot the delimited text format connector in Azure Data Factory and Azure Synapse

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article provides suggestions to troubleshoot common problems with the delimited text formatL connector in Azure Data Factory and Azure Synapse.

## Error code: DelimitedTextColumnNameNotAllowNull

- **Message**: `The name of column index %index; is empty. Make sure column name is properly specified in the header row.`

- **Cause**: When 'firstRowAsHeader' is set in the activity, the first row is used as the column name. This error means that the first row contains an empty value (for example, 'ColumnA, ColumnB').

- **Recommendation**:  Check the first row, and fix the value if it is empty.


## Error code: DelimitedTextMoreColumnsThanDefined

- **Message**: `Error found when processing '%function;' source '%name;' with row number %rowCount;: found more columns than expected column count: %expectedColumnCount;.`

- **Causes and recommendations**: Different causes may lead to this error. Check below list for possible cause analysis and related recommendation.

  | Cause analysis                                               | Recommendation                                               |
  | :----------------------------------------------------------- | :----------------------------------------------------------- |
  | The problematic row's column count is larger than the first row's column count. It might be caused by a data issue or incorrect column delimiter or quote char settings. | Get the row count from the error message, check the row's column, and fix the data. |
  | If the expected column count is "1" in an error message, you might have specified wrong compression or format settings, which caused the files to be parsed incorrectly. | Check the format settings to make sure they match your source files. |
  | If your source is a folder, the files under the specified folder might have a different schema. | Make sure that the files in the specified folder have an identical schema. |

## Next steps

For more troubleshooting help, try these resources:

- [Connector troubleshooting guide](connector-troubleshoot-guide.md)
- [Data Factory blog](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/bg-p/AzureDataFactoryBlog)
- [Data Factory feature requests](/answers/topics/azure-data-factory.html)
- [Azure videos](https://azure.microsoft.com/resources/videos/index/?sort=newest&services=data-factory)
- [Microsoft Q&A page](/answers/topics/azure-data-factory.html)
- [Stack Overflow forum for Data Factory](https://stackoverflow.com/questions/tagged/azure-data-factory)
- [Twitter information about Data Factory](https://twitter.com/hashtag/DataFactory)
