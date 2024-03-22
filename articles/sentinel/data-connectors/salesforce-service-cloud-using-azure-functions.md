---
title: "Salesforce Service Cloud (using Azure Functions) connector for Microsoft Sentinel"
description: "Learn how to install the connector Salesforce Service Cloud (using Azure Functions) to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 10/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Salesforce Service Cloud (using Azure Functions) connector for Microsoft Sentinel

The Salesforce Service Cloud data connector provides the capability to ingest information about your Salesforce operational events into Microsoft Sentinel through the REST API. The connector provides ability to review events in your org on an accelerated basis, get [event log files](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/event_log_file_hourly_overview.htm) in hourly increments for recent activity.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | SalesforceServiceCloud_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com/) |

## Query samples

**Last Salesforce Service Cloud EventLogFile Events**
   ```kusto
SalesforceServiceCloud
 
   | sort by TimeGenerated desc
   ```



## Prerequisites

To integrate with Salesforce Service Cloud (using Azure Functions) make sure you have: 

- **Microsoft.Web/sites permissions**: Read and write permissions to Azure Functions to create a Function App is required. [See the documentation to learn more about Azure Functions](/azure/azure-functions/).
- **REST API Credentials/permissions**: **Salesforce API Username**, **Salesforce API Password**, **Salesforce Security Token**, **Salesforce Consumer Key**, **Salesforce Consumer Secret** is required for REST API. [See the documentation to learn more about API](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/quickstart.htm).


## Vendor installation instructions


> [!NOTE]
   >  This connector uses Azure Functions to connect to the Salesforce Lightning Platform REST API to pull its logs into Microsoft Sentinel. This might result in additional data ingestion costs. Check the [Azure Functions pricing page](https://azure.microsoft.com/pricing/details/functions/) for details.


>**(Optional Step)** Securely store workspace and API authorization key(s) or token(s) in Azure Key Vault. Azure Key Vault provides a secure mechanism to store and retrieve key values. [Follow these instructions](/azure/app-service/app-service-key-vault-references) to use Azure Key Vault with an Azure Function App.


**NOTE:** This data connector depends on a parser based on a Kusto Function to work as expected which is deployed as part of the solution. To view the function code in Log Analytics, open Log Analytics/Microsoft Sentinel Logs blade, click Functions and search for the alias SalesforceServiceCloud and load the function code or click [here](https://aka.ms/sentinel-SalesforceServiceCloud-parser). The function usually takes 10-15 minutes to activate after solution installation/update.


**STEP 1 - Configuration steps for the Salesforce Lightning Platform REST API**

1. See the [link](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/quickstart.htm) and follow the instructions for obtaining Salesforce API Authorization credentials. 
2. On the **Set Up Authorization** step choose **Session ID Authorization** method.
3. You must provide your client id, client secret, username, and password with user security token.


> [!NOTE]
   >  Ingesting data from on an hourly interval may require additional licensing based on the edition of the Salesforce Service Cloud being used. Please refer to [Salesforce documentation](https://www.salesforce.com/editions-pricing/service-cloud/) and/or support for more details.


**STEP 2 - Choose ONE from the following two deployment options to deploy the connector and the associated Azure Function**

>**IMPORTANT:** Before deploying the Salesforce Service Cloud data connector, have the Workspace ID and Workspace Primary Key (can be copied from the following), as well as the Salesforce API Authorization credentials, readily available.







## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-salesforceservicecloud?tab=Overview) in the Azure Marketplace.
