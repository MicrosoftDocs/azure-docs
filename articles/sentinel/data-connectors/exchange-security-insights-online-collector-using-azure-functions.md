---
title: "Exchange Security Insights Online Collector (using Azure Functions) connector for Microsoft Sentinel"
description: "Learn how to install the connector Exchange Security Insights Online Collector (using Azure Functions) to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 10/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Exchange Security Insights Online Collector (using Azure Functions) connector for Microsoft Sentinel

Connector used to push Exchange Online Security configuration for Microsoft Sentinel Analysis

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | ESIExchangeOnlineConfig_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Community](https://github.com/Azure/Azure-Sentinel/issues) |

## Query samples

**View how many Configuration entries exist on the table**
   ```kusto
ESIExchangeOnlineConfig_CL 
   | summarize by GenerationInstanceID_g, EntryDate_s, ESIEnvironment_s
   ```



## Prerequisites

To integrate with Exchange Security Insights Online Collector (using Azure Functions) make sure you have: 

- **Microsoft.Web/sites permissions**: Read and write permissions to Azure Functions to create a Function App is required. [See the documentation to learn more about Azure Functions](/azure/azure-functions/).
- **microsoft.automation/automationaccounts permissions**: Read and write permissions to Azure Automation Account to create a it with a Runbook is required. [See the documentation to learn more about Automation Account](/azure/automation/overview).


## Vendor installation instructions


> [!NOTE]
   >  This data connector depends on a parser based on a Kusto Function to work as expected. Follow the steps for each Parser to create the Kusto Functions alias : [**ExchangeConfiguration**](https://aka.ms/sentinel-ESI-ExchangeConfiguration-Online-parser) and [**ExchangeEnvironmentList**](https://aka.ms/sentinel-ESI-ExchangeEnvironmentList-Online-parser) 

**STEP 1 - Parsers deployment**



> [!NOTE]
   >  This connector uses Azure Automation to connect to 'Exchange Online' to pull its Security analysis into Microsoft Sentinel. This might result in additional data ingestion costs. Check the [Azure Automation pricing page](https://azure.microsoft.com/pricing/details/automation/) for details.


**STEP 2 - Choose ONE from the following two deployment options to deploy the connector and the associated Azure Automation**

>**IMPORTANT:** Before deploying the 'ESI Exchange Online Security Configuration' connector, have the Workspace ID and Workspace Primary Key (can be copied from the following), as well as the Exchange Online tenant name (contoso.onmicrosoft.com), readily available.




**Option 1 - Azure Resource Manager (ARM) Template**

Use this method for automated deployment of the 'ESI Exchange Online Security Configuration' connector.

1. Click the **Deploy to Azure** button below. 

	[![Deploy To Azure](https://aka.ms/deploytoazurebutton)](https://aka.ms/sentinel-ESI-ExchangeCollector-azuredeploy)
2. Select the preferred **Subscription**, **Resource Group** and **Location**. 
3. Enter the **Workspace ID**, **Workspace Key**, **Tenant Name**, 'and/or Other required fields'. 
>4. Mark the checkbox labeled **I agree to the terms and conditions stated above**. 
5. Click **Purchase** to deploy.


**Option 2 - Manual Deployment of Azure Automation**

 Use the following step-by-step instructions to deploy the 'ESI Exchange Online Security Configuration' connector manually with Azure Automation.



**STEP 3 - Assign Microsoft Graph Permission and Exchange Online Permission to Managed Identity Account** 

To be able to collect Exchange Online information and to be able to retrieve User information and memberlist of admin groups, the automation account need multiple permission.




## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/microsoftsentinelcommunity.azure-sentinel-solution-esionline?tab=Overview) in the Azure Marketplace.
