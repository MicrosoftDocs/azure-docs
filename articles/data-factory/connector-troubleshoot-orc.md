---
title: Troubleshoot the ORC format connector
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to troubleshoot issues with the ORC format connector in Azure Data Factory and Azure Synapse Analytics. 
author: jianleishen
ms.service: data-factory
ms.subservice: data-movement
ms.topic: troubleshooting
ms.date: 01/25/2023
ms.author: jianleishen
ms.custom: has-adal-ref, synapse
---

# Troubleshoot the ORC format connector in Azure Data Factory and Azure Synapse

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article provides suggestions to troubleshoot common problems with the ORC format connector in Azure Data Factory and Azure Synapse.

## Error code: OrcJavaInvocationException

- **Message**: `An error occurred when invoking Java, message: %javaException;.`
- **Causes and recommendations**: Different causes may lead to this error. Check below list for possible cause analysis and related recommendation.

    | Cause analysis                                               | Recommendation                                               |
    | :----------------------------------------------------------- | :----------------------------------------------------------- |
    | When the error message contains the strings "java.lang.OutOfMemory", "Java heap space", and "doubleCapacity", it's usually a memory management issue in an old version of integration runtime. | If you're using Self-hosted Integration Runtime, we recommend that you upgrade to the latest version. |
    | When the error message contains the string "java.lang.OutOfMemory", the integration runtime doesn't have enough resources to process the files. | Limit the concurrent runs on the integration runtime. For Self-hosted IR, scale up to a powerful machine with memory equal to or larger than 8 GB. |
    |When the error message contains the string "NullPointerReference", the cause might be a transient error. | Retry the operation. If the problem persists, contact support. |
    | When the error message contains the string "BufferOverflowException", the cause might be a transient error. | Retry the operation. If the problem persists, contact support. |
    | When the error message contains the string "java.lang.ClassCastException:org.apache.hadoop.hive.serde2.io.HiveCharWritable can't be cast to org.apache.hadoop.io.Text", the cause might be a type conversion issue inside Java Runtime. Usually, it means that the source data can't be handled well in Java Runtime. | This is a data issue. Try to use a string instead of char or varchar in ORC format data. |

## Error code: OrcDateTimeExceedLimit

- **Message**: `The Ticks value '%ticks;' for the datetime column must be between valid datetime ticks range -621355968000000000 and 2534022144000000000.`

- **Cause**: If the datetime value is '0001-01-01 00:00:00', it could be caused by the differences between the [Julian calendar and the Gregorian calendar](https://en.wikipedia.org/wiki/Proleptic_Gregorian_calendar#Difference_between_Julian_and_proleptic_Gregorian_calendar_dates).

- **Recommendation**:  Check the ticks value and avoid using the datetime value '0001-01-01 00:00:00'.

## Next steps

For more troubleshooting help, try these resources:

- [Connector troubleshooting guide](connector-troubleshoot-guide.md)
- [Data Factory blog](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/bg-p/AzureDataFactoryBlog)
- [Data Factory feature requests](/answers/topics/azure-data-factory.html)
- [Azure videos](https://azure.microsoft.com/resources/videos/index/?sort=newest&services=data-factory)
- [Microsoft Q&A page](/answers/topics/azure-data-factory.html)
- [Stack Overflow forum for Data Factory](https://stackoverflow.com/questions/tagged/azure-data-factory)
- [Twitter information about Data Factory](https://twitter.com/hashtag/DataFactory)
