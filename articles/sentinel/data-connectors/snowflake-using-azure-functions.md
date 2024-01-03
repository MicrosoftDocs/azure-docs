---
title: "Snowflake (using Azure Functions) connector for Microsoft Sentinel"
description: "Learn how to install the connector Snowflake (using Azure Functions) to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 10/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Snowflake (using Azure Functions) connector for Microsoft Sentinel

The Snowflake data connector provides the capability to ingest Snowflake [login logs](https://docs.snowflake.com/en/sql-reference/account-usage/login_history.html) and [query logs](https://docs.snowflake.com/en/sql-reference/account-usage/query_history.html) into Microsoft Sentinel using the Snowflake Python Connector. Refer to [Snowflake  documentation](https://docs.snowflake.com/en/user-guide/python-connector.html) for more information.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | Snowflake_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |

## Query samples

**All Snowflake Events**
   ```kusto
Snowflake_CL

   | sort by TimeGenerated desc
   ```



## Prerequisites

To integrate with Snowflake (using Azure Functions) make sure you have: 

- **Microsoft.Web/sites permissions**: Read and write permissions to Azure Functions to create a Function App is required. [See the documentation to learn more about Azure Functions](/azure/azure-functions/).
- **Snowflake Credentials**: **Snowflake Account Identifier**, **Snowflake User** and **Snowflake Password** are required for connection. See the documentation to learn more about [Snowflake Account Identifier](https://docs.snowflake.com/en/user-guide/admin-account-identifier.html#). Instructions on how to create user for this connector you can find below.


## Vendor installation instructions


> [!NOTE]
   >  This connector uses Azure Functions to connect to the Azure Blob Storage API to pull logs into Microsoft Sentinel. This might result in additional costs for data ingestion and for storing data in Azure Blob Storage costs. Check the [Azure Functions pricing page](https://azure.microsoft.com/pricing/details/functions/) and [Azure Blob Storage pricing page](https://azure.microsoft.com/pricing/details/storage/blobs/) for details.


>**(Optional Step)** Securely store workspace and API authorization key(s) or token(s) in Azure Key Vault. Azure Key Vault provides a secure mechanism to store and retrieve key values. [Follow these instructions](/azure/app-service/app-service-key-vault-references) to use Azure Key Vault with an Azure Function App.


> [!NOTE]
   >  This data connector depends on a parser based on a Kusto Function to work as expected [**Snowflake**](https://aka.ms/sentinel-SnowflakeDataConnector-parser) which is deployed with the Microsoft Sentinel Solution.


**STEP 1 - Creating user in Snowflake**

To query data from Snowflake you need a user that is assigned to a role with sufficient privileges and a virtual warehouse cluster. The initial size of this cluster will be set to small but if it is insufficient, the cluster size can be increased as necessary.

1. Enter the Snowflake console.
1. Switch role to SECURITYADMIN and [create a new role](https://docs.snowflake.com/en/sql-reference/sql/create-role.html):

   ```
   USE ROLE SECURITYADMIN;
   CREATE OR REPLACE ROLE EXAMPLE_ROLE_NAME;
   ```

1. Switch role to SYSADMIN and [create warehouse](https://docs.snowflake.com/en/sql-reference/sql/create-warehouse.html) and [grand access](https://docs.snowflake.com/en/sql-reference/sql/grant-privilege.html) to it:

    ```
    USE ROLE SYSADMIN;
    CREATE OR REPLACE WAREHOUSE EXAMPLE_WAREHOUSE_NAME
      WAREHOUSE_SIZE = 'SMALL' 
      AUTO_SUSPEND = 5
      AUTO_RESUME = true
      INITIALLY_SUSPENDED = true;
    GRANT USAGE, OPERATE ON WAREHOUSE EXAMPLE_WAREHOUSE_NAME TO ROLE EXAMPLE_ROLE_NAME;
    ```

1. Switch role to SECURITYADMIN and [create a new user](https://docs.snowflake.com/en/sql-reference/sql/create-user.html):

    ```
    USE ROLE SECURITYADMIN;
    CREATE OR REPLACE USER EXAMPLE_USER_NAME
       PASSWORD = 'example_password'
       DEFAULT_ROLE = EXAMPLE_ROLE_NAME
       DEFAULT_WAREHOUSE = EXAMPLE_WAREHOUSE_NAME
    ;

    ```

1. Switch role to ACCOUNTADMIN and [grant access to snowflake database](https://docs.snowflake.com/en/sql-reference/account-usage.html#enabling-account-usage-for-other-roles) for role.

    ```
    USE ROLE ACCOUNTADMIN;
    GRANT IMPORTED PRIVILEGES ON DATABASE SNOWFLAKE TO ROLE EXAMPLE_ROLE_NAME;
    ```

1. Switch role to SECURITYADMIN and [assign role](https://docs.snowflake.com/en/sql-reference/sql/grant-role.html) to user:

    ```
    USE ROLE SECURITYADMIN;
    GRANT ROLE EXAMPLE_ROLE_NAME TO USER EXAMPLE_USER_NAME;
    ```

>**IMPORTANT:** Save user and API password created during this step as they will be used during deployment step.


**STEP 2 - Choose ONE from the following two deployment options to deploy the connector and the associated Azure Function**

>**IMPORTANT:** Before deploying the data connector, have the Workspace ID and Workspace Primary Key (can be copied from the following), as well as Snowflake credentials, readily available.







## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-snowflake?tab=Overview) in the Azure Marketplace.
