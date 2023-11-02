---
title: Troubleshoot the Snowflake connector
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to troubleshoot issues with the Snowflake connector in Azure Data Factory and Azure Synapse Analytics. 
author: jianleishen
ms.service: data-factory
ms.subservice: data-movement
ms.topic: troubleshooting
ms.date: 10/20/2023
ms.author: jianleishen
ms.custom: has-adal-ref, synapse
---

# Troubleshoot the Snowflake connector in Azure Data Factory and Azure Synapse

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article provides suggestions to troubleshoot common problems with the Snowflake connector in Azure Data Factory and Azure Synapse. 

## Error code: NotAllowToAccessSnowflake

- **Symptoms**: The copy activity fails with the following error: 

    `IP % is not allowed to access Snowflake. Contact your local security administrator. `

- **Cause**: It's a connectivity issue and usually caused by firewall IP issues when integration runtimes access your Snowflake.  

- **Recommendation**:  

    - If you configure a [self-hosted integration runtime](create-self-hosted-integration-runtime.md) to connect to Snowflake, make sure to add your self-hosted integration runtime IPs to the allowed list in Snowflake. 
    - If you use an Azure Integration Runtime and the access is restricted to IPs approved in the firewall rules, you can add [Azure Integration Runtime IPs](azure-integration-runtime-ip-addresses.md) to the allowed list in Snowflake.
    - If you use a managed private endpoint and a network policy is in place on your Snowflake account, ensure Managed VNet CIDR is allowed. For more steps, refer to [How To: Set up a managed private endpoint from Azure Data Factory or Synapse to Snowflake](https://community.snowflake.com/s/article/How-to-set-up-a-managed-private-endpoint-from-Azure-Data-Factory-or-Synapse-to-Snowflake). 

## Error code: SnowflakeFailToAccess

- **Symptoms**:<br>
The copy activity fails with the following error when using Snowflake as source:<br> 
    `Failed to access remote file: access denied. Please check your credentials`<br>
The copy activity fails with the following error when using Snowflake as sink:<br>
    `Failure using stage area. Cause: [This request is not authorized to perform this operation. (Status Code: 403; Error Code: AuthorizationFailure)`<br>

- **Cause**: The error pops up by the Snowflake COPY command and is caused by missing access permission on source/sink when execute Snowflake COPY commands. 

- **Recommendation**: Check your source/sink to make sure that you have granted proper access permission to Snowflake. 

    - Direct copy: Make sure to grant access permission to Snowflake in the other source/sink. Currently, only Azure Blob Storage that uses shared access signature authentication is supported as source or sink. When you generate the shared access signature, make sure to set the allowed permissions and IP addresses to Snowflake in the Azure Blob Storage. For more information, see this [article](https://docs.snowflake.com/en/user-guide/data-load-azure-config.html#option-2-generating-a-sas-token). 
    - Staged copy: The staging Azure Blob Storage linked service must use shared access signature authentication. When you generate the shared access signature, make sure to set the allowed permissions and IP addresses to Snowflake in the staging Azure Blob Storage. For more information, see this [article](https://docs.snowflake.com/en/user-guide/data-load-azure-config.html#option-2-generating-a-sas-token).
 
## Next steps

For more troubleshooting help, try these resources:

- [Connector troubleshooting guide](connector-troubleshoot-guide.md)
- [Data Factory blog](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/bg-p/AzureDataFactoryBlog)
- [Data Factory feature requests](/answers/topics/azure-data-factory.html)
- [Azure videos](https://azure.microsoft.com/resources/videos/index/?sort=newest&services=data-factory)
- [Microsoft Q&A page](/answers/topics/azure-data-factory.html)
- [Stack Overflow forum for Data Factory](https://stackoverflow.com/questions/tagged/azure-data-factory)
- [Twitter information about Data Factory](https://twitter.com/hashtag/DataFactory)
