---
title: "Qualys VM KnowledgeBase (using Azure Functions) connector for Microsoft Sentinel"
description: "Learn how to install the connector Qualys VM KnowledgeBase (using Azure Functions) to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 10/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Qualys VM KnowledgeBase (using Azure Functions) connector for Microsoft Sentinel

The [Qualys Vulnerability Management (VM)](https://www.qualys.com/apps/vulnerability-management/) KnowledgeBase (KB) connector provides the capability to ingest the latest vulnerability data from the Qualys KB into Microsoft Sentinel. 

 This data can used to correlate and enrich vulnerability detections found by the [Qualys Vulnerability Management (VM)](/azure/sentinel/connect-qualys-vm) data connector.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | QualysKB_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com/) |

## Query samples

**Vulnerabilities by Category**
   ```kusto
QualysKB
 
   | summarize count() by Category
   ```

**Top 10 Software Vendors**
   ```kusto
QualysKB
 
   | summarize count() by SoftwareVendor 

   | top 10 by count_
   ```



## Prerequisites

To integrate with Qualys VM KnowledgeBase (using Azure Functions) make sure you have: 

- **Microsoft.Web/sites permissions**: Read and write permissions to Azure Functions to create a Function App is required. [See the documentation to learn more about Azure Functions](/azure/azure-functions/).
- **Qualys API Key**: A Qualys VM API username and password is required. [See the documentation to learn more about Qualys VM API](https://www.qualys.com/docs/qualys-api-vmpc-user-guide.pdf).


## Vendor installation instructions


**NOTE:** This data connector depends on a parser based on a Kusto Function to work as expected which is deployed as part of the solution. To view the function code in Log Analytics, open Log Analytics/Microsoft Sentinel Logs blade, click Functions and search for the alias QualysVM Knowledgebase and load the function code or click [here](https://aka.ms/sentinel-crowdstrikefalconendpointprotection-parser), on the second line of the query, enter the hostname(s) of your QualysVM Knowledgebase device(s) and any other unique identifiers for the logstream. The function usually takes 10-15 minutes to activate after solution installation/update.


>This data connector depends on a parser based on a Kusto Function to work as expected. [Follow the steps](https://aka.ms/sentinel-qualyskb-parser) to use the Kusto function alias, **QualysKB**


>**(Optional Step)** Securely store workspace and API authorization key(s) or token(s) in Azure Key Vault. Azure Key Vault provides a secure mechanism to store and retrieve key values. [Follow these instructions](/azure/app-service/app-service-key-vault-references) to use Azure Key Vault with an Azure Function App.


**STEP 1 - Configuration steps for the Qualys API**

1. Log into the Qualys Vulnerability Management console with an administrator account, select the **Users** tab and the **Users** subtab. 
2. Click on the **New** drop-down menu and select **Users**.
3. Create a username and password for the API account. 
4. In the **User Roles** tab, ensure the account role is set to **Manager** and access is allowed to **GUI** and **API**
4. Log out of the administrator account and log into the console with the new API credentials for validation, then log out of the API account. 
5. Log back into the console using an administrator account and modify the API accounts User Roles, removing access to **GUI**. 
6. Save all changes.


**STEP 2 - Choose ONE from the following two deployment options to deploy the connector and the associated Azure Function**

>**IMPORTANT:** Before deploying the Qualys KB connector, have the Workspace ID and Workspace Primary Key (can be copied from the following), as well as the Qualys API username and password, readily available.







## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-qualysvmknowledgebase?tab=Overview) in the Azure Marketplace.
