---
title: Authentication mechanisms with the COPY statement
description: Outlines the authentication mechanisms to bulk load data
services: synapse-analytics
author: kevinvngo
ms.service: synapse-analytics
ms.topic: overview
ms.subservice:
ms.date: 05/06/2020
ms.author: kevin
ms.reviewer: jrasnick
---

# Securely load data using Synapse SQL

This article highlights and provides examples on the secure authentication mechanisms for the [COPY statement](https://docs.microsoft.com/sql/t-sql/statements/copy-into-transact-sql?view=azure-sqldw-latest). The COPY statement is the most flexible and secure way of bulk loading data in Synapse SQL.
## Supported authentication mechanisms

The following matrix describes the supported authentication methods for each file type and storage account. This applies to the source storage location and the error file location.

|                      |                CSV                |              Parquet              |                ORC                |
| :------------------: | :-------------------------------: | :-------------------------------: | :-------------------------------: |
|  Azure blob storage  | SAS/MSI/SERVICE PRINCIPAL/KEY/AAD |              SAS/KEY              |              SAS/KEY              |
| Azure Data Lake Gen2 | SAS/MSI/SERVICE PRINCIPAL/KEY/AAD | SAS/MSI/SERVICE PRINCIPAL/KEY/AAD | SAS/MSI/SERVICE PRINCIPAL/KEY/AAD |

## A. Storage account key with LF as the row terminator (Unix-style new line)


```sql
--Note when specifying the column list, input field numbers start from 1
COPY INTO target_table (Col_one default 'myStringDefault' 1, Col_two default 1 3)
FROM 'https://adlsgen2account.dfs.core.windows.net/myblobcontainer/folder1/'
WITH (
	FILE_TYPE = 'CSV'
	,CREDENTIAL=(IDENTITY= 'Storage Account Key', SECRET='<Your_Account_Key>')
	--CREDENTIAL should look something like this:
	--CREDENTIAL=(IDENTITY= 'Storage Account Key', SECRET='x6RWv4It5F2msnjelv3H4DA80n0QW0daPdw43jM0nyetx4c6CpDkdj3986DX5AHFMIf/YN4y6kkCnU8lb+Wx0Pj+6MDw=='),
	,ROWTERMINATOR='0x0A' --0x0A specifies to use the Line Feed character (Unix based systems)
)
```
> [!IMPORTANT]
>
> - Use the hexadecimal value (0x0A) to specify the Line Feed/Newline character. Note the COPY statement will interpret the '\n' string as '\r\n' (carriage return newline).

## B. Shared Access Signatures (SAS) with CRLF as the row terminator (Windows style new line)
```sql
COPY INTO target_table
FROM 'https://adlsgen2account.dfs.core.windows.net/myblobcontainer/folder1/'
WITH (
    FILE_TYPE = 'CSV'
    ,CREDENTIAL=(IDENTITY= 'Shared Access Signature', SECRET='<Your_SAS_Token>')
	--CREDENTIAL should look something like this:
    --CREDENTIAL=(IDENTITY= 'Shared Access Signature', SECRET='?sv=2018-03-28&ss=bfqt&srt=sco&sp=rl&st=2016-10-17T20%3A14%3A55Z&se=2021-10-18T20%3A19%3A00Z&sig=IEoOdmeYnE9%2FKiJDSFSYsz4AkNa%2F%2BTx61FuQ%2FfKHefqoBE%3D'),
    ,ROWTERMINATOR='\n'-- COPY command automatically prefixes the \r character when \n (newline) is specified. This results in carriage return newline (\r\n) for Windows based systems.
)
```

> [!IMPORTANT]
>
> - Do not specify the ROWTERMINATOR as '\r\n' which will be interpreted as '\r\r\n' and can result in parsing issues

## C. Managed Identity

Managed Identity authentication is required when your storage account is attached to a VNet. 

### Prerequisites

1. Install Azure PowerShell using this [guide](/powershell/azure/install-az-ps?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json).
2. If you have a general-purpose v1 or blob storage account, you must first upgrade to general-purpose v2 using this [guide](../../storage/common/storage-account-upgrade.md?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json).
3. You must have **Allow trusted Microsoft services to access this storage account** turned on under Azure Storage account **Firewalls and Virtual networks** settings menu. Refer to this [guide](../../storage/common/storage-network-security.md?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json#exceptions) for more information.
#### Steps

1. In PowerShell, **register your SQL server** with Azure Active Directory (AAD):

   ```powershell
   Connect-AzAccount
   Select-AzSubscription -SubscriptionId your-subscriptionId
   Set-AzSqlServer -ResourceGroupName your-database-server-resourceGroup -ServerName your-database-servername -AssignIdentity
   ```

2. Create a **general-purpose v2 Storage Account** using this [guide](../../storage/common/storage-account-create.md?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json).

   > [!NOTE]
   > If you have a general-purpose v1 or blob storage account, you must **first upgrade to v2** using this [guide](../../storage/common/storage-account-upgrade.md?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json).

3. Under your storage account, navigate to **Access Control (IAM)**, and select **Add role assignment**. Assign **Storage Blob Data Owner, Contributor, or Reader** RBAC role to your SQL server.

   > [!NOTE]
   > Only members with Owner privilege can perform this step. For various built-in roles for Azure resources, refer to this [guide](../../role-based-access-control/built-in-roles.md?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json).
   
4. You can now run the COPY statement specifying "Managed Identity":

	```sql
	COPY INTO dbo.target_table
	FROM 'https://myaccount.blob.core.windows.net/myblobcontainer/folder1/*.txt'
	WITH (
	    FILE_TYPE = 'CSV',
	    CREDENTIAL = (IDENTITY = 'Managed Identity'),
	)
	```

> [!IMPORTANT]
>
> - Specify the **Storage** **Blob Data** Owner, Contributor, or Reader RBAC role. These roles are different than the Azure built-in roles of Owner, Contributor, and Reader. 

## D. Azure Active Directory Authentication (AAD)
#### Steps

1. Under your storage account, navigate to **Access Control (IAM)**, and select **Add role assignment**. Assign **Storage Blob Data Owner, Contributor, or Reader** RBAC role to your AAD user. 

2. Configure Azure AD authentication by going through the following [documentation](https://docs.microsoft.com/azure/sql-database/sql-database-aad-authentication-configure?tabs=azure-powershell#create-an-azure-ad-administrator-for-azure-sql-server). 

3. Connect to your SQL pool using Active Directory where you can now run the COPY statement without specifying any credentials:

	```sql
	COPY INTO dbo.target_table
	FROM 'https://myaccount.blob.core.windows.net/myblobcontainer/folder1/*.txt'
	WITH (
	    FILE_TYPE = 'CSV'
	)
	```

> [!IMPORTANT]
>
> - Specify the **Storage** **Blob Data** Owner, Contributor, or Reader RBAC role. These roles are different than the Azure built-in roles of Owner, Contributor, and Reader. 

## E. Service Principal Authentication
#### Steps

1. [Create an Azure Active Directory (AAD) application](https://docs.microsoft.com/azure/active-directory/develop/howto-create-service-principal-portal#create-an-azure-active-directory-application)
2. [Get application ID](https://docs.microsoft.com/azure/active-directory/develop/howto-create-service-principal-portal#get-values-for-signing-in)
3. [Get the authentication key](https://docs.microsoft.com/azure/active-directory/develop/howto-create-service-principal-portal#create-a-new-application-secret)
4. [Get the V1 OAuth 2.0 token endpoint](https://docs.microsoft.com/azure/data-lake-store/data-lake-store-service-to-service-authenticate-using-active-directory?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json#step-4-get-the-oauth-20-token-endpoint-only-for-java-based-applications)
5. [Assign read, write, and execution permissions to your AAD application](https://docs.microsoft.com/azure/data-lake-store/data-lake-store-service-to-service-authenticate-using-active-directory?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json#step-3-assign-the-azure-ad-application-to-the-azure-data-lake-storage-gen1-account-file-or-folder) on your storage account
6. You can now run the COPY statement:

	```sql
	COPY INTO dbo.target_table
	FROM 'https://myaccount.blob.core.windows.net/myblobcontainer/folder0/*.txt'
	WITH (
	    FILE_TYPE = 'CSV'
	    ,CREDENTIAL=(IDENTITY= '<application_ID>@<OAuth_2.0_Token_EndPoint>' , SECRET= '<authentication_key>')
	    --CREDENTIAL should look something like this:
		--,CREDENTIAL=(IDENTITY= '92761aac-12a9-4ec3-89b8-7149aef4c35b@https://login.microsoftonline.com/72f714bf-86f1-41af-91ab-2d7cd011db47/oauth2/token', SECRET='juXi12sZ6gse]woKQNgqwSywYv]7A.M')
	)
	```

> [!IMPORTANT]
>
> - Use the **V1** version of the OAuth 2.0 token endpoint

## Next steps

- Check the [COPY statement article](https://docs.microsoft.com/sql/t-sql/statements/copy-into-transact-sql?view=azure-sqldw-latest#syntax) article for the detailed syntax
- Check the [data loading overview](https://docs.microsoft.com/azure/synapse-analytics/sql-data-warehouse/design-elt-data-loading#what-is-elt) article for loading best practices
