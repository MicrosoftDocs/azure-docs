---
title: "Cohesity (using Azure Functions) connector for Microsoft Sentinel"
description: "Learn how to install the connector Cohesity (using Azure Functions) to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 07/26/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Cohesity (using Azure Functions) connector for Microsoft Sentinel

The Cohesity function apps provide the ability to ingest Cohesity Datahawk ransomware alerts into Microsoft Sentinel.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | Cohesity_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Cohesity](https://support.cohesity.com/) |

## Query samples

**All Cohesity logs**
   ```kusto
Cohesity_CL

   | sort by TimeGenerated desc
   ```



## Prerequisites

To integrate with Cohesity (using Azure Functions) make sure you have: 

- **Microsoft.Web/sites permissions**: Read and write permissions to Azure Functions to create a Function App is required. [See the documentation to learn more about Azure Functions](/azure/azure-functions/).
- **Azure Blob Storage connection string and container name**: Azure Blob Storage connection string and container name


## Vendor installation instructions


> [!NOTE]
   >  This connector uses Azure Functions that connect to the Azure Blob Storage and KeyVault. This might result in additional costs. Check the [Azure Functions pricing page](https://azure.microsoft.com/pricing/details/functions/), [Azure Blob Storage pricing page](https://azure.microsoft.com/pricing/details/storage/blobs/) and [Azure KeyVault pricing page](https://azure.microsoft.com/pricing/details/key-vault/) for details.


>**(Optional Step)** Securely store workspace and API authorization key(s) or token(s) in Azure Key Vault. Azure Key Vault provides a secure mechanism to store and retrieve key values. [Follow these instructions](/azure/app-service/app-service-key-vault-references) to use Azure Key Vault with an Azure Functions App.


**STEP 1 - Get a Cohesity DataHawk API key (see troubleshooting [instruction 1](https://github.com/Azure/Azure-Sentinel/tree/master/Solutions/CohesitySecurity/Data%20Connectors/Helios2Sentinel/IncidentProducer))**


**STEP 2 - Register Azure app ([link](https://portal.azure.com/#view/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/~/RegisteredApps)) and save Application (client) ID, Directory (tenant) ID, and Secret Value ([instructions](/azure/healthcare-apis/register-application)). Grant it Azure Storage (user_impersonation) permission. Also, assign the 'Microsoft Sentinel Contributor' role to the application in the appropriate subscription.**


**STEP 3 - Deploy the connector and the associated Azure Functions**.

Azure Resource Manager (ARM) Template

Use this method for automated deployment of the Cohesity data connector using an ARM Template.

1. Click the **Deploy to Azure** button below. 

	[![Deploy To Azure](https://aka.ms/deploytoazurebutton)](https://aka.ms/sentinel-Cohesity-azuredeploy)
2. Select the preferred **Subscription**, **Resource Group** and **Location**. 
3. Enter the parameters that you created at the previous steps
4. Mark the checkbox labeled **I agree to the terms and conditions stated above**.
5. Click **Purchase** to deploy.



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/cohesitydev1592001764720.cohesity_sentinel_data_connector?tab=Overview) in the Azure Marketplace.
