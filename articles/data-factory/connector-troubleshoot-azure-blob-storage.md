---
title: Troubleshoot the Azure Blob Storage connector
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to troubleshoot issues with the Azure Blob Storage connector in Azure Data Factory and Azure Synapse Analytics. 
author: jianleishen
ms.service: data-factory
ms.subservice: data-movement
ms.topic: troubleshooting
ms.date: 07/20/2023
ms.author: jianleishen
ms.custom: has-adal-ref, synapse
---

# Troubleshoot the Azure Blob Storage connector in Azure Data Factory and Azure Synapse

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article provides suggestions to troubleshoot common problems with the Azure Blob Storage connector in Azure Data Factory and Azure Synapse.

## Error code: AzureBlobOperationFailed

- **Message**: "Blob operation Failed. ContainerName: %containerName;, path: %path;."

- **Cause**: A problem with the Blob Storage operation.

- **Recommendation**:  To check the error details, see [Blob Storage error codes](/rest/api/storageservices/blob-service-error-codes). For further help, contact the Blob Storage team.


## Invalid property during copy activity

- **Message**: `Copy activity \<Activity Name> has an invalid "source" property. The source type is not compatible with the dataset \<Dataset Name> and its linked service \<Linked Service Name>. Please verify your input against.`

- **Cause**: The type defined in the dataset is inconsistent with the source or sink type that's defined in the copy activity.

- **Resolution**: Edit the dataset or pipeline JSON definition to make the types consistent, and then rerun the deployment.

## Error code: FIPSModeIsNotSupport

- **Message**: `Fail to read data form Azure Blob Storage for Azure Blob connector needs MD5 algorithm which can't co-work with FIPS mode. Please change diawp.exe.config in self-hosted integration runtime install directory to disable FIPS policy following https://learn.microsoft.com/dotnet/framework/configure-apps/file-schema/runtime/enforcefipspolicy-element.`

- **Cause**: Then FIPS policy is enabled on the VM where the self-hosted integration runtime was installed.

- **Recommendation**: Disable the FIPS mode on the VM where the self-hosted integration runtime was installed. Windows doesn't recommend the FIPS mode.

## Error code: AzureBlobInvalidBlockSize

- **Message**: `Block size should between %minSize; MB and 100 MB.`

- **Cause**: The block size is over the blob limitation.

## Error code: AzureStorageOperationFailedConcurrentWrite

- **Message**: `Error occurred when trying to upload a file. It's possible because you have multiple concurrent copy activities runs writing to the same file '%name;'. Check your ADF configuration.`

- **Cause**: You have multiple concurrent copy activity runs or applications writing to the same file.

## Error code: AzureAppendBlobConcurrentWriteConflict

- **Message**: `Detected concurrent write to the same append blob file, it's possible because you have multiple concurrent copy activities runs or applications writing to the same file '%name;'. Please check your ADF configuration and retry.`

- **Cause**: Multiple concurrent writing requests occur, which causes conflicts on file content.

## Error code: AzureBlobFailedToCreateContainer

- **Message**: `Unable to create Azure Blob container. Endpoint: '%endpoint;', Container Name: '%containerName;'.`

- **Cause**: This error happens when copying data with Azure Blob Storage account public access.

- **Recommendation**: For more information about connection errors in the public endpoint, see [Connection error in public endpoint](security-and-access-control-troubleshoot-guide.md#connection-error-in-public-endpoint).

## Next steps

For more troubleshooting help, try these resources:

- [Connector troubleshooting guide](connector-troubleshoot-guide.md)
- [Data Factory blog](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/bg-p/AzureDataFactoryBlog)
- [Data Factory feature requests](/answers/topics/azure-data-factory.html)
- [Azure videos](https://azure.microsoft.com/resources/videos/index/?sort=newest&services=data-factory)
- [Microsoft Q&A page](/answers/topics/azure-data-factory.html)
- [Stack Overflow forum for Data Factory](https://stackoverflow.com/questions/tagged/azure-data-factory)
- [Twitter information about Data Factory](https://twitter.com/hashtag/DataFactory)
