---
title: Troubleshoot the Oracle connector
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to troubleshoot issues with the Oracle connector in Azure Data Factory and Azure Synapse Analytics. 
author: jianleishen
ms.subservice: data-movement
ms.topic: troubleshooting
ms.date: 06/04/2025
ms.author: jianleishen
ms.custom: has-adal-ref, synapse
---

# Troubleshoot the Oracle connector in Azure Data Factory and Azure Synapse

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article provides suggestions to troubleshoot common problems with the Oracle connector in Azure Data Factory and Azure Synapse.

## Version 2.0

### Error message: ORA-12650: No common encryption or data integrity algorithm

- **Symptoms**: You meet the following error message: `ORA-12650: No common encryption or data integrity algorithm`

- **Cause**: The client and server failed to agree on a common encryption/data integrity behavior or algorithm during negotiation. The default client-side configurations are as follows:

    - `encryptionClient`: `required`
    - `encryptionTypesClient`: `(AES256)`
    - `cryptoChecksumClient`: `required`
    - `cryptoChecksumTypesClient`: `(SHA512)`

- **Recommendation**:

    1. Check the server-side configurations, including SQLNET.ENCRYPTION_SERVER and SQLNET.CRYPTO_CHECKSUM_SERVER. Update the linked service additional properties `encryptionClient` and `cryptoChecksumClient` on the client side if needed. Note that the actual behavior is determined by the negotiation outcome between the client and server configuration, as shown below. 
    
        | Client\Server | rejected | accepted | requested | required |
        |---------------|----------|----------|-----------|----------|
        | rejected      | OFF      | OFF      | OFF       | Connection fails |
        | accepted      | OFF      | OFF      | ON        | ON       |
        | requested     | OFF      | ON       | ON        | ON       |
        | required      | Connection fails | ON | ON | ON |
    
    1. Check the server-side configurations, including SQLNET.ENCRYPTION_TYPES_SERVER and SQLNET.CRYPTO_CHECKSUM_TYPES_SERVER. Update the linked service additional properties `encryptionTypesClient` and `cryptoChecksumTypesClient` on the client side to ensure that a common algorithm can be found between them. You can set `encryptionTypesClient` to `(AES128, AES192, AES256, 3DES112, 3DES168)` and `cryptoChecksumTypesClient` to `(SHA1, SHA256, SHA384, SHA512)` to include all supported client-side algorithms.


### Decimal precision too large error

- **Symptoms**: When copying NUMBER type columns from Oracle, the copy may fail or the data written to the sink cannot be further consumed by other tools because the decimal precision is too large. 

- **Cause**: To avoid data loss, the decimal precision used to represent the Oracle NUMBER type is 256, which exceeds the max precision supported by the sink connector or downstream consumer.

- **Recommendation**:

    Resolve this issue by using one of the two methods provided below:
    
    - Use a query to explicitly cast the column to BINARY_DOUBLE. For example:  
      `SELECT CAST(ColA AS BINARY_DOUBLE) AS ColB FROM TableA.`
    
    - Set the linked service additional property `supportV1DataTypes` to `true`, which ensures that version 2.0 uses the same data type mappings as version 1.0.

### Error message: ORA-00933: SQL command not properly ended 

- **Symptoms**: You meet the following error message: `ORA-00933: SQL command not properly ended` 

- **Cause**: Currently Oracle version 2.0 doesn’t support the query ended with a semicolon. 

- **Recommendation**: Remove the semicolon at the end of the query.  

## Version 1.0

### Error code: ArgumentOutOfRangeException

- **Message**: `Hour, Minute, and Second parameters describe an un-representable DateTime.`

- **Cause**: In Azure Data Factory and Synapse pipelines, DateTime values are supported in the range from 0001-01-01 00:00:00 to 9999-12-31 23:59:59. However, Oracle supports a wider range of DateTime values, such as the BC century or min/sec>59, which leads to failure.

- **Recommendation**: 

    To see whether the value in Oracle is in the supported range of dates, run `select dump(<column name>)`. 

    To learn the byte sequence in the result, see [How are dates stored in Oracle?](https://stackoverflow.com/questions/13568193/how-are-dates-stored-in-oracle).


### Add secure algorithms when using the self-hosted integration runtime version 5.36.8726.3 or higher

- **Symptoms**: When you use the self-hosted integration runtime version 5.36.8726.3 or higher, you meet this error message: `[Oracle]ORA-12650: No common encryption or data integrity algorithm`.

- **Cause**: The secure algorithm is not added to your Oracle server. 

- **Recommendation**: Update your Oracle server settings to add these secure algorithms if they are not already included:

    - For **SQLNET.ENCRYPTION_TYPES_SERVER**, need to add the following algorithms that are deemed as secure by OpenSSL and will be used for OAS (Oracle Advanced Security) encryption.
        - AES256 
        - AES192 
        - 3DES168 
        - AES128 
        - 3DES112 
        - DES
        
    - For **SQLNET.CRYPTO_CHECKSUM_TYPES_SERVER**, need to add the following algorithms that are deemed as secure by OpenSSL and will be used for OAS (Oracle Advanced Security) data integrity.
        - SHA256 
        - SHA384 
        - SHA512
    
        >[!Note]  
        >The recommended data integrity algorithms SHA256, SHA384 and SHA512 are available for Oracle 19c or higher. 
    
### Error code: UserErrorFailedToConnectOdbcSource

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
- [Azure videos](/shows/data-exposed/?products=azure&terms=data-factory)
- [Microsoft Q&A page](/answers/topics/azure-data-factory.html)
- [Stack Overflow forum for Data Factory](https://stackoverflow.com/questions/tagged/azure-data-factory)
- [X information about Data Factory](https://x.com/hashtag/DataFactory)
