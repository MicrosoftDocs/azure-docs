---
title: "Snowflake (using Azure Function) connector for Microsoft Sentinel"
description: "Learn how to install the connector Snowflake (using Azure Function) to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 02/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Snowflake (using Azure Functions) connector for Microsoft Sentinel

The Snowflake data connector provides the capability to ingest Snowflake [login logs](https://docs.snowflake.com/en/sql-reference/account-usage/login_history.html) and [query logs](https://docs.snowflake.com/en/sql-reference/account-usage/query_history.html) into Microsoft Sentinel using the Snowflake Python Connector. Refer to [Snowflake  documentation](https://docs.snowflake.com/en/user-guide/python-connector.html) for more information.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Azure functions app code** | https://aka.ms/sentinel-SnowflakeDataConnector-functionapp |
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

- **Microsoft.Web/sites permissions**: Read and write permissions to Azure Functions to create a Function App is required. [See the documentation to learn more about Azure Functions](/azure/azure-functions).
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
2. Switch role to SECURITYADMIN and [create a new role](https://docs.snowflake.com/en/sql-reference/sql/create-role.html):

USE ROLE SECURITYADMIN;
CREATE OR REPLACE ROLE EXAMPLE_ROLE_NAME;

3. Switch role to SYSADMIN and [create warehouse](https://docs.snowflake.com/en/sql-reference/sql/create-warehouse.html) and [grand access](https://docs.snowflake.com/en/sql-reference/sql/grant-privilege.html) to it:

USE ROLE SYSADMIN;
CREATE OR REPLACE WAREHOUSE EXAMPLE_WAREHOUSE_NAME
  WAREHOUSE_SIZE = 'SMALL' 
  AUTO_SUSPEND = 5
  AUTO_RESUME = true
  INITIALLY_SUSPENDED = true;
GRANT USAGE, OPERATE ON WAREHOUSE EXAMPLE_WAREHOUSE_NAME TO ROLE EXAMPLE_ROLE_NAME;

4. Switch role to SECURITYADMIN and [create a new user](https://docs.snowflake.com/en/sql-reference/sql/create-user.html):

USE ROLE SECURITYADMIN;
CREATE OR REPLACE USER EXAMPLE_USER_NAME
   PASSWORD = 'example_password'
   DEFAULT_ROLE = EXAMPLE_ROLE_NAME
   DEFAULT_WAREHOUSE = EXAMPLE_WAREHOUSE_NAME
;

5. Switch role to ACCOUNTADMIN and [grant access to snowflake database](https://docs.snowflake.com/en/sql-reference/account-usage.html#enabling-account-usage-for-other-roles) for role.

USE ROLE ACCOUNTADMIN;
GRANT IMPORTED PRIVILEGES ON DATABASE SNOWFLAKE TO ROLE EXAMPLE_ROLE_NAME;

6. Switch role to SECURITYADMIN and [assign role](https://docs.snowflake.com/en/sql-reference/sql/grant-role.html) to user:

USE ROLE SECURITYADMIN;
GRANT ROLE EXAMPLE_ROLE_NAME TO USER EXAMPLE_USER_NAME;

>**IMPORTANT:** Save user and API password created during this step as they will be used during deployment step.


**STEP 2 - Choose ONE from the following two deployment options to deploy the connector and the associated Azure Function**

>**IMPORTANT:** Before deploying the data connector, have the Workspace ID and Workspace Primary Key (can be copied from the following), as well as Snowflake credentials, readily available.



Option 1 - Azure Resource Manager (ARM) Template

Use this method for automated deployment of the data connector using an ARM Template.

1. Click the **Deploy to Azure** button below. 

	[![Deploy To Azure](https://aka.ms/deploytoazurebutton)](https://aka.ms/sentinel-SnowflakeDataConnector-azuredeploy)
2. Select the preferred **Subscription**, **Resource Group** and **Location**. 
3. Enter the **Snowflake Account Identifier**, **Snowflake User**, **Snowflake Password**, **Microsoft Sentinel Workspace Id**, **Microsoft Sentinel Shared Key**
4. Mark the checkbox labeled **I agree to the terms and conditions stated above**.
5. Click **Purchase** to deploy.

Option 2 - Manual Deployment of Azure Functions

Use the following step-by-step instructions to deploy the data connector manually with Azure Functions (Deployment via Visual Studio Code).


**1. Deploy a Function App**

> **NOTE:** You will need to [prepare VS code](/azure/azure-functions/create-first-function-vs-code-python) for Azure function development.

1. Download the [Azure Function App](https://aka.ms/sentinel-SnowflakeDataConnector-functionapp) file. Extract archive to your local development computer.
2. Start VS Code. Choose File in the main menu and select Open Folder.
3. Select the top level folder from extracted files.
4. Choose the Azure icon in the Activity bar, then in the **Azure: Functions** area, choose the **Deploy to function app** button.
If you aren't already signed in, choose the Azure icon in the Activity bar, then in the **Azure: Functions** area, choose **Sign in to Azure**
If you're already signed in, go to the next step.
5. Provide the following information at the prompts:

	a. **Select folder:** Choose a folder from your workspace or browse to one that contains your function app.

	b. **Select Subscription:** Choose the subscription to use.

	c. Select **Create new Function App in Azure** (Don't choose the Advanced option)

	d. **Enter a globally unique name for the function app:** Type a name that is valid in a URL path. The name you type is validated to make sure that it's unique in Azure Functions. (e.g. Snowflake12).

	e. **Select a runtime:** Choose Python 3.8.

	f. Select a location for new resources. For better performance and lower costs choose the same [region](https://azure.microsoft.com/regions/) where Microsoft Sentinel is located.

6. Deployment will begin. A notification is displayed after your function app is created and the deployment package is applied.
7. Go to Azure Portal for the Function App configuration.


**2. Configure the Function App**

1. In the Function App, select the Function App Name and select **Configuration**.
2. In the **Application settings** tab, select **+ New application setting**.
3. Add each of the following application settings individually, with their respective string values (case-sensitive): 
		SNOWFLAKE_ACCOUNT
		SNOWFLAKE_USER
		SNOWFLAKE_PASSWORD
		WORKSPACE_ID
		SHARED_KEY
		logAnalyticsUri (optional)
 - Use logAnalyticsUri to override the log analytics API endpoint for dedicated cloud. For example, for public cloud, leave the value empty; for Azure GovUS cloud environment, specify the value in the following format: `https://WORKSPACE_ID.ods.opinsights.azure.us`. 
4. Once all application settings have been entered, click **Save**.



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-snowflake?tab=Overview) in the Azure Marketplace.
