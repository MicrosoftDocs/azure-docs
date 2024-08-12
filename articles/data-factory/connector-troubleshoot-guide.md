---
title: Troubleshoot connectors
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to troubleshoot connector issues in Azure Data Factory and Azure Synapse Analytics.
author: jianleishen
ms.subservice: data-movement
ms.topic: troubleshooting
ms.date: 10/20/2023
ms.author: jianleishen
ms.custom: synapse
---

# Troubleshoot Azure Data Factory and Azure Synapse Analytics connectors

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article describes how to troubleshoot connectors in Azure Data Factory and Azure Synapse Analytics.  

## Connector specific problems

You can refer to the troubleshooting pages for each connector to see problems specific to it with explanations of their causes and recommendations to resolve them.

- [Azure Blob Storage](connector-troubleshoot-azure-blob-storage.md)
- [Azure Cosmos DB (including Azure Cosmos DB for NoSQL connector)](connector-troubleshoot-azure-cosmos-db.md)
- [Azure Data Lake (Gen1 and Gen2)](connector-troubleshoot-azure-data-lake.md)
- [Azure Database for PostgreSQL](connector-troubleshoot-postgresql.md)
- [Azure Files storage](connector-troubleshoot-azure-files.md)
- [Azure Synapse Analytics, Azure SQL Database, and SQL Server](connector-troubleshoot-synapse-sql.md)
- [DB2](connector-troubleshoot-db2.md)
- [Delimited text format](connector-troubleshoot-delimited-text.md)
- [Dynamics 365, Dataverse (Common Data Service), and Dynamics CRM](connector-troubleshoot-dynamics-dataverse.md)
- [FTP, SFTP and HTTP](connector-troubleshoot-ftp-sftp-http.md)
- [Hive](connector-troubleshoot-hive.md)
- [Oracle](connector-troubleshoot-oracle.md)
- [ORC format](connector-troubleshoot-orc.md)
- [Parquet format](connector-troubleshoot-parquet.md)
- [REST](connector-troubleshoot-rest.md)
- [Salesforce and Salesforce Service Cloud](connector-troubleshoot-salesforce.md)
- [SharePoint Online list](connector-troubleshoot-sharepoint-online-list.md)
- [XML format](connector-troubleshoot-xml.md)

## General copy activity errors

The errors below are general to the copy activity and could occur with any connector.

#### Error code: 20000

- **Message**: `Java Runtime Environment cannot be found on the Self-hosted Integration Runtime machine. It is required for parsing or writing to Parquet/ORC files. Make sure Java Runtime Environment has been installed on the Self-hosted Integration Runtime machine.`

- **Cause**: The self-hosted IR can't find Java Runtime. Java Runtime is required for reading particular sources.

- **Recommendation**:  Check your integration runtime environment, see [Use Self-hosted Integration Runtime](./format-parquet.md#using-self-hosted-integration-runtime).


#### Error code: 20002

- **Message**: `An error occurred when invoking Java Native Interface.`

- **Cause**: If the error message contains "Cannot create JVM: JNI return code [-6][JNI call failed: Invalid arguments.]", the possible cause is that JVM can't be created because some illegal (global) arguments are set.

- **Recommendation**: Log in to the machine that hosts *each node* of your self-hosted integration runtime. Check to ensure that the system variable is set correctly, as follows: `_JAVA_OPTIONS "-Xms256m -Xmx16g" with memory bigger than 8G`. Restart all the integration runtime nodes, and then rerun the pipeline.

#### Error code: 20020

- **Message**: `Wildcard in path is not supported in sink dataset. Fix the path: '%setting;'.`

- **Cause**: The sink dataset doesn't support wildcard values.

- **Recommendation**:  Check the sink dataset, and rewrite the path without using a wildcard value.


### FIPS issue

- **Symptoms**: Copy activity fails on a FIPS-enabled self-hosted IR machine with the following error message: `This implementation is not part of the Windows Platform FIPS validated cryptographic algorithms.` 

- **Cause**: This error might occur when you copy data with connectors such as Azure Blob, SFTP, and so on. Federal Information Processing Standards (FIPS) defines a certain set of cryptographic algorithms that are allowed to be used. When FIPS mode is enabled on the machine, some cryptographic classes that copy activity depends on are blocked in some scenarios.

- **Resolution**: Learn [why we’re not recommending “FIPS Mode” anymore](https://techcommunity.microsoft.com/t5/microsoft-security-baselines/why-we-8217-re-not-recommending-8220-fips-mode-8221-anymore/ba-p/701037), and evaluate whether you can disable FIPS on your self-hosted IR machine.

    Alternatively, if you only want to bypass FIPS and make the activity runs succeed, do the following:

    1. Open the folder where Self-hosted IR is installed. The path is usually *C:\Program Files\Microsoft Integration Runtime \<IR version>\Shared*.

    2. Open the *diawp.exe.config* file and then, at the end of the `<runtime>` section, add `<enforceFIPSPolicy enabled="false"/>`, as shown here:

        :::image type="content" source="./media/connector-troubleshoot-guide/disable-fips-policy.png" alt-text="Screenshot of a section of the diawp.exe.config file showing FIPS disabled.":::

    3. Save the file, and then restart the Self-hosted IR machine.

#### Error code: 20150

- **Message**: `Failed to get access token from your token endpoint. Error returned from your authorization server: %errorResponse;.`

- **Cause**: Your client ID or client secret is invalid, and the authentication failed in your authorization server.

- **Recommendation**: Correct all OAuth2 client credential flow settings of your authorization server.

#### Error code: 20151

- **Message**: `Failed to get access token from your token endpoint. Error message: %errorMessage;.`

- **Cause**: OAuth2 client credential flow settings are invalid.

- **Recommendation**: Correct all OAuth2 client credential flow settings of your authorization server.

#### Error code: 20152

- **Message**: `The toke type '%tokenType;' from your authorization server is not supported, supported types: '%tokenTypes;'.`

- **Cause**: Your authorization server is not supported.

- **Recommendation**: Use an authorization server that can return tokens with supported token types.

#### Error code: 20153

- **Message**: `The character colon(:) is not allowed in clientId for OAuth2ClientCredential authentication.`

- **Cause**: Your client ID includes the invalid character colon (`:`).

- **Recommendation**: Use a valid client ID.

#### Error code: 20523

- **Message**: `Managed identity credential is not supported in this version ('%version;') of Self Hosted Integration Runtime.`

- **Recommendation**: Check the supported version and upgrade the integration runtime to a higher version.

#### Error code: 20551

- **Message**: `The format settings are missing in dataset %dataSetName;.`

- **Cause**: The dataset type is Binary, which is not supported.

- **Recommendation**: Use the DelimitedText, Json, Avro, Orc, or Parquet dataset instead.

- **Cause**: For the file storage, the format settings are missing in the dataset.

- **Recommendation**: Deselect the "Binary copy" in the dataset, and set correct format settings.

#### Error code: 20552

- **Message**: `The command behavior "%behavior;" is not supported.`

- **Recommendation**: Don't add the command behavior as a parameter for preview or GetSchema API request URL.

#### Error code: 20701

- **Message**: `Failed to retrieve source file ('%name;') metadata to validate data consistency.`

- **Cause**: There is a transient issue on the sink data store, or retrieving metadata from the sink data store is not allowed.

#### Error code: 20703

- **Message**: `Failed to retrieve sink file ('%name;') metadata to validate data consistency.`

- **Cause**: There is a transient issue on the sink data store, or retrieving metadata from the sink data store is not allowed.

#### Error code: 20704

- **Message**: `Data consistency validation is not supported in current copy activity settings.`

- **Cause**: The data consistency validation is only supported in the direct binary copy scenario.

- **Recommendation**: Remove the 'validateDataConsistency' property in the copy activity payload.

#### Error code: 20705

- **Message**: `'validateDataConsistency' is not supported in this version ('%version;') of Self Hosted Integration Runtime.`

- **Recommendation**: Check the supported integration runtime version and upgrade it to a higher version, or remove the 'validateDataConsistency' property from copy activities.

#### Error code: 20741

- **Message**: `Skip missing file is not supported in current copy activity settings, it's only supported with direct binary copy with folder.`

- **Recommendation**: Remove 'fileMissing' of the skipErrorFile setting in the copy activity payload.

#### Error code: 20742

- **Message**: `Skip inconsistency is not supported in current copy activity settings, it's only supported with direct binary copy when validateDataConsistency is true.`

- **Recommendation**: Remove 'dataInconsistency' of the skipErrorFile setting in the copy activity payload.

#### Error code: 20743

- **Message**: `Skip forbidden file is not supported in current copy activity settings, it's only supported with direct binary copy with folder.`

- **Recommendation**: Remove 'fileForbidden' of the skipErrorFile setting in the copy activity payload.

#### Error code: 20744

- **Message**: `Skip forbidden file is not supported for this connector: ('%connectorName;').`

- **Recommendation**: Remove 'fileForbidden' of the skipErrorFile setting in the copy activity payload.

#### Error code: 20745

- **Message**: `Skip invalid file name is not supported in current copy activity settings, it's only supported with direct binary copy with folder.`

- **Recommendation**: Remove 'invalidFileName' of the skipErrorFile setting in the copy activity payload.

#### Error code: 20746

- **Message**: `Skip invalid file name is not supported for '%connectorName;' source.`

- **Recommendation**: Remove 'invalidFileName' of the skipErrorFile setting in the copy activity payload.

#### Error code: 20747

- **Message**: `Skip invalid file name is not supported for '%connectorName;' sink.`

- **Recommendation**: Remove 'invalidFileName' of the skipErrorFile setting in the copy activity payload.

#### Error code: 20748

- **Message**: `Skip all error file is not supported in current copy activity settings, it's only supported with binary copy with folder.`

- **Recommendation**: Remove 'allErrorFile' in the skipErrorFile setting in the copy activity payload.

#### Error code: 20771

- **Message**: `'deleteFilesAfterCompletion' is not support in current copy activity settings, it's only supported with direct binary copy.`

- **Recommendation**: Remove the 'deleteFilesAfterCompletion' setting or use direct binary copy.

#### Error code: 20772

- **Message**: `'deleteFilesAfterCompletion' is not supported for this connector: ('%connectorName;').`

- **Recommendation**: Remove the 'deleteFilesAfterCompletion' setting in the copy activity payload.

#### Error code: 27002

- **Message**: `Failed to download custom plugins.`

- **Cause**: Invalid download links or transient connectivity issues.

- **Recommendation**: Retry if the message shows that it's a transient issue. If the problem persists, contact the support team.

## General connector errors

#### Error code: 9611

- **Message**: `The following ODBC Query is not valid: '%'.`
 
- **Cause**: You provide a wrong or invalid query to fetch the data/schemas.

- **Recommendation**: Verify your query is valid and can return data/schemas. Use [Script activity](transform-data-using-script.md) if you want to execute non-query scripts and your data store is supported. Alternatively, consider to use stored procedure that returns a dummy result to execute your non-query scripts.

#### Error code: 11775

- **Message**: `Failed to connect to your instance of Azure Database for PostgreSQL flexible server. '%'`
 
- **Cause**: Exact cause depends on the text returned in `'%'`. If it is **The operation has timed out**, it can be because the instance of PostgreSQL is stopped or because the network connectivity method configured for your instance doesn't allow connections from the Integration Runtime selected. User or password provided are incorrect. If it is **28P01: password authentication failed for user "*youruser*"**, it means that the user provided doesn't exist in the instance or that the password is incorrect. If it is **28000: no pg_hba.conf entry for host "*###.###.###.###*", user "*youruser*", database "*yourdatabase*", no encryption**, it means that the encryption method selected is not compatible with the configuration of the server.

- **Recommendation**: Confirm that the user provided exists in your instance of PostgreSQL and that the password corresponds to the one currently assigned to that user. Make sure that the encryption method selected is accepted by your instance of PostgreSQL, based on its current configuration. If the network connectivity method of your instance is configured for Private access (VNet integration), use a Self-Hosted Integration Runtime (IR) to connect to it. If it is configured for Public access (allowed IP addresses), it is recommended to use an Azure IR with managed virtual network and deploy a managed private endpoint to connect to your instance. When it is configured for Public access (allowed IP addresses) a less recommended alternative consists in creating firewall rules in your instance to allow traffic originating on the IP addresses used by the Azure IR you're using.

## Related content

For more troubleshooting help, try these resources:

- [Data Factory blog](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/bg-p/AzureDataFactoryBlog)
- [Data Factory feature requests](/answers/topics/azure-data-factory.html)
- [Azure videos](https://azure.microsoft.com/resources/videos/index/?sort=newest&services=data-factory)
- [Microsoft Q&A page](/answers/topics/azure-data-factory.html)
- [Stack Overflow forum for Data Factory](https://stackoverflow.com/questions/tagged/azure-data-factory)
- [X information about Data Factory](https://x.com/hashtag/DataFactory)
