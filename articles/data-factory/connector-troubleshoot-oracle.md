---
title: Troubleshoot the Oracle connector
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to troubleshoot issues with the Oracle connector in Azure Data Factory and Azure Synapse Analytics. 
author: jianleishen
ms.service: data-factory
ms.subservice: data-movement
ms.topic: troubleshooting
ms.date: 05/27/2024
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
    
## Error code: UserErrorFailedToConnectOdbcSource

There are three error messages associated with this error code. Check the cause and recommendation for each error message correspondingly.

- **Message**: `"Cannot load trust store", or "SSL Handshake Failure reason [error:OA000086:SSL routines::certificate verify failed]"` 

- **Cause**: The `truststore` is not appropriate for OpenSSL 3.0, as the `truststore` file is generated using weak ciphers like RC4, MD5 and SHA1.

- **Recommendation**: You need to re-create the `truststore` using the strong ciphers like AES256. Refer to this [section](connector-oracle.md#linked-service-properties) for details about setting up the TLS connection using `truststore`.

<br>

- **Message**: <br>
    `SSL Handshake Failure reason[Unknown SSL Error]`  
    `SSL Handshake Failure reason [error:OA000410:SSL routines::sslv3 alert handshake failure]`

- **Cause**: The server is not configured with strong ciphers for SSL communication. OpenSSL 3.0 should use either TLS 1.0 and higher as it deprecated SSL protocol versions. For example, the server might accept connections with TLS protocol versions until TLS 1.0.

- **Recommendation**: Revise the server configuration to use stronger TLS versions.

<br>

- **Message**: `SSL Handshake Failure reason [error:0A00014D:SSL routines::legacy sigalg disallowed or unsupported].` 

- **Cause**: CryptoProtocolVersion is set to use deprecated TLS protocol versions with OpenSSL 3.0.

- **Recommendation**: Specify the connection string property `CryptoProtocolVersion=TLSv1.2`.


## Related content

For more troubleshooting help, try these resources:

- [Connector troubleshooting guide](connector-troubleshoot-guide.md)
- [Data Factory blog](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/bg-p/AzureDataFactoryBlog)
- [Data Factory feature requests](/answers/topics/azure-data-factory.html)
- [Azure videos](https://azure.microsoft.com/resources/videos/index/?sort=newest&services=data-factory)
- [Microsoft Q&A page](/answers/topics/azure-data-factory.html)
- [Stack Overflow forum for Data Factory](https://stackoverflow.com/questions/tagged/azure-data-factory)
- [Twitter information about Data Factory](https://twitter.com/hashtag/DataFactory)
