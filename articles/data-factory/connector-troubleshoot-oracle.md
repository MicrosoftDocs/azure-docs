---
title: Troubleshoot the Oracle connector
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to troubleshoot issues with the Oracle connector in Azure Data Factory and Azure Synapse Analytics. 
author: jianleishen
ms.service: data-factory
ms.subservice: data-movement
ms.topic: troubleshooting
ms.date: 04/30/2024
ms.author: jianleishen
ms.custom: has-adal-ref, synapse
---

# Troubleshoot the Oracle connector in Azure Data Factory and Azure Synapse

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article provides suggestions to troubleshoot common problems with the Oracle connector in Azure Data Factory and Azure Synapse.

## Error code: ArgumentOutOfRangeException

- **Message**: `Hour, Minute, and Second parameters describe an un-representable DateTime.`

- **Cause**: In Azure Data Factory and Synapse pipelines, DateTime values are supported in the range from 0001-01-01 00:00:00 to 9999-12-31 23:59:59. However, Oracle supports a wider range of DateTime values, such as the BC century or min/sec>59, which leads to failure.

- **Recommendation**: 

    To see whether the value in Oracle is in the supported range of dates, run `select dump(<column name>)`. 

    To learn the byte sequence in the result, see [How are dates stored in Oracle?](https://stackoverflow.com/questions/13568193/how-are-dates-stored-in-oracle).


## Add secure algorithms when using the self-hosted integration runtime version 5.36.8726.3 or higher

- **Symptoms**: When you use the self-hosted integration runtime version 5.36.8726.3 or higher, you meet this error message: `[Oracle]ORA-12650: No common encryption or data integrity algorithm`.

- **Cause**: The secure algorithm is not added to your Oracle server. 

- **Recommendation**: Update your Oracle server settings to add these secure algorithms:

    - The following algorithms are deemed as secure by OpenSSL, and will be sent along to the server for OAS (Oracle Advanced Security) encryption.
        - AES256 
        - AES192 
        - 3DES168 
        - AES128 
        - 3DES112 
        - DES
        
    - The following algorithms are deemed as secure by OpenSSL, and will be sent along to the server for OAS (Oracle Advanced Security) data integrity.
        - SHA256 
        - SHA384 
        - SHA512
    
## Related content

For more troubleshooting help, try these resources:

- [Connector troubleshooting guide](connector-troubleshoot-guide.md)
- [Data Factory blog](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/bg-p/AzureDataFactoryBlog)
- [Data Factory feature requests](/answers/topics/azure-data-factory.html)
- [Azure videos](https://azure.microsoft.com/resources/videos/index/?sort=newest&services=data-factory)
- [Microsoft Q&A page](/answers/topics/azure-data-factory.html)
- [Stack Overflow forum for Data Factory](https://stackoverflow.com/questions/tagged/azure-data-factory)
- [Twitter information about Data Factory](https://twitter.com/hashtag/DataFactory)
