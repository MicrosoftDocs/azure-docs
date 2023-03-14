---
title: "Lookout (using Azure Functions) connector for Microsoft Sentinel"
description: "Learn how to install the connector Lookout (using Azure Functions) to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 02/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Lookout (using Azure Functions) connector for Microsoft Sentinel

The [Lookout](https://lookout.com) data connector provides the capability to ingest [Lookout](https://enterprise.support.lookout.com/hc/en-us/articles/115002741773-Mobile-Risk-API-Guide#commoneventfields) events into Microsoft Sentinel through the Mobile Risk API. Refer to [API documentation](https://enterprise.support.lookout.com/hc/en-us/articles/115002741773-Mobile-Risk-API-Guide) for more information. The [Lookout](https://lookout.com) data connector provides ability to get events which helps to examine potential security risks and more.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | Lookout_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Lookout](https://www.lookout.com/support) |

## Query samples

**Lookout Events - All Activities.**
   ```kusto
Lookout_CL
 
   | sort by TimeGenerated desc
   ```



## Prerequisites

To integrate with Lookout (using Azure Functions) make sure you have: 

- **Microsoft.Web/sites permissions**: Read and write permissions to Azure Functions to create a Function App is required. [See the documentation to learn more about Azure Functions](https://learn.microsoft.com/azure/azure-functions/).
- **Mobile Risk API Credentials/permissions**: **EnterpriseName** & **ApiKey** are required for Mobile Risk API. [See the documentation to learn more about API](https://enterprise.support.lookout.com/hc/en-us/articles/115002741773-Mobile-Risk-API-Guide). Check all [requirements and follow  the instructions](https://enterprise.support.lookout.com/hc/en-us/articles/115002741773-Mobile-Risk-API-Guide#authenticatingwiththemobileriskapi) for obtaining credentials.


## Vendor installation instructions


> [!NOTE]
   >  This [Lookout](https://lookout.com) data connector uses Azure Functions to connect to the Mobile Risk API to pull its events into Microsoft Sentinel. This might result in additional data ingestion costs. Check the [Azure Functions pricing page](https://azure.microsoft.com/pricing/details/functions/) for details.


> [!NOTE]
   >  This data connector depends on a parser based on a Kusto Function to work as expected [**LookoutEvents**](https://aka.ms/sentinel-lookoutapi-parser) which is deployed with the Microsoft Sentinel Solution.


**STEP 1 - Configuration steps for the Mobile Risk API**

 [Follow the instructions](https://enterprise.support.lookout.com/hc/en-us/articles/115002741773-Mobile-Risk-API-Guide#authenticatingwiththemobileriskapi) to obtain the credentials. 



**STEP 2 - Follow below mentioned instructions to deploy the [Lookout](https://lookout.com) data connector and the associated Azure Function**

>**IMPORTANT:** Before starting the deployment of the [Lookout](https://lookout.com) data connector, make sure to have the Workspace ID and Workspace Key ready (can be copied from the following).


   Workspace Key

Azure Resource Manager (ARM) Template

Follow below steps for automated deployment of the [Lookout](https://lookout.com) data connector using an ARM Template.

1. Click the **Deploy to Azure** button below. 

	[![Deploy To Azure](https://aka.ms/deploytoazurebutton)](https://aka.ms/sentinel-lookoutapi-azuredeploy)
2. Select the preferred **Subscription**, **Resource Group** and **Region**. 
> **NOTE:** Within the same resource group, you can't mix Windows and Linux apps in the same region. Select existing resource group without Windows apps in it or create new resource group.
3. Enter the **Function Name**, **Workspace ID**,**Workspace Key**,**Enterprise Name** & **Api Key** and deploy. 
4. Click **Create** to deploy.



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/lookoutinc.lookout_mtd_sentinel?tab=Overview) in the Azure Marketplace.
