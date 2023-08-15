---
title: "Digital Shadows Searchlight (using Azure Functions) connector for Microsoft Sentinel"
description: "Learn how to install the connector Digital Shadows Searchlight (using Azure Functions) to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 07/26/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Digital Shadows Searchlight (using Azure Functions) connector for Microsoft Sentinel

The Digital Shadows data connector provides ingestion of the incidents and alerts from Digital Shadows Searchlight into the Microsoft Sentinel using the REST API. The connector will provide the incidents and alerts information such that it helps to examine, diagnose and analyse the potential security risks and threats.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Application settings** | DigitalShadowsAccountID<br/>WorkspaceID<br/>WorkspaceKey<br/>DigitalShadowsKey<br/>DigitalShadowsSecret<br/>HistoricalDays<br/>DigitalShadowsURL<br/>ClassificationFilterOperation<br/>HighVariabilityClassifications<br/>FUNCTION_NAME<br/>logAnalyticsUri (optional)(add any other settings required by the Function App)Set the <code>DigitalShadowsURL</code> value to: <code>https://api.searchlight.app/v1</code>Set the <code>HighVariabilityClassifications</code> value to: <code>exposed-credential,marked-document</code>Set the <code>ClassificationFilterOperation</code> value to: <code>exclude</code> for exclude function app or <code>include</code> for include function app |
| **Azure function app code** | https://github.com/Azure/Azure-Sentinel/blob/master/Solutions/Digital%20Shadows/Data%20Connectors/Digital%20Shadows/digitalshadowsConnector.zip |
| **Log Analytics table(s)** | DigitalShadows_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Digital Shadows](https://www.digitalshadows.com/) |

## Query samples

**All Digital Shadows incidents and alerts ordered by time most recently raised**
   ```kusto
DigitalShadows_CL 
   | order by raised_t desc
   ```



## Prerequisites

To integrate with Digital Shadows Searchlight (using Azure Functions) make sure you have: 

- **Microsoft.Web/sites permissions**: Read and write permissions to Azure Functions to create a Function App is required. [See the documentation to learn more about Azure Functions](/azure/azure-functions/).
- **REST API Credentials/permissions**: **Digital Shadows account ID, secret and key** is required.  See the documentation to learn more about API on the `https://portal-digitalshadows.com/learn/searchlight-api/overview/description`.


## Vendor installation instructions


> [!NOTE]
   >  This connector uses Azure Functions to connect to a 'Digital Shadows Searchlight' to pull its logs into Microsoft Sentinel. This might result in additional data ingestion costs. Check the [Azure Functions pricing page](https://azure.microsoft.com/pricing/details/functions/) for details.


>**(Optional Step)** Securely store workspace and API authorization key(s) or token(s) in Azure Key Vault. Azure Key Vault provides a secure mechanism to store and retrieve key values. [Follow these instructions](/azure/app-service/app-service-key-vault-references) to use Azure Key Vault with an Azure Function App.


**STEP 1 - Configuration steps for the 'Digital Shadows Searchlight' API**

The provider should provide or link to detailed steps to configure the 'Digital Shadows Searchlight' API endpoint so that the Azure Function can authenticate to it successfully, get its authorization key or token, and pull the appliance's logs into Microsoft Sentinel.


**STEP 2 - Choose ONE from the following two deployment options to deploy the connector and the associated Azure Function**

>**IMPORTANT:** Before deploying the 'Digital Shadows Searchlight' connector, have the Workspace ID  and Workspace Primary Key (can be copied from the following), as well as the 'Digital Shadows Searchlight' API authorization key(s) or Token, readily available.




**Option 1 - Azure Resource Manager (ARM) Template**

Use this method for automated deployment of the 'Digital Shadows Searchlight' connector.

1. Click the **Deploy to Azure** button below. 

	[![Deploy To Azure](https://aka.ms/deploytoazurebutton)](https://aka.ms/sentinel-Digitalshadows-azuredeploy)
2. Select the preferred **Subscription**, **Resource Group** and **Location**. 
3. Enter the **Workspace ID**, **Workspace Key**, **API Username**, **API Password**, 'and/or Other required fields'. 
>Note: If using Azure Key Vault secrets for any of the values above, use the`@Microsoft.KeyVault(SecretUri={Security Identifier})`schema in place of the string values. Refer to [Key Vault references documentation](/azure/app-service/app-service-key-vault-references) for further details. 
4. Mark the checkbox labeled **I agree to the terms and conditions stated above**. 
5. Click **Purchase** to deploy.


**Option 2 - Manual Deployment of Azure Functions**

 Use the following step-by-step instructions to deploy the 'Digital Shadows Searchlight' connector manually with Azure Functions.

1. Create a Function App

1.  From the Azure Portal, navigate to [Function App](https://portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.Web%2Fsites/kind/functionapp).
2. Click **+ Create** at the top.
3. In the **Basics** tab, ensure Runtime stack is set to **python 3.8**. 
4. In the **Hosting** tab, ensure **Plan type** is set to **'Consumption (Serverless)'**.
5.select Storage account
6. 'Add other required configurations'. 
5. 'Make other preferable configuration changes', if needed, then click **Create**.

2. Import Function App Code(Zip deployment)

1. Install Azure CLI
2. From terminal type `az functionapp deployment source config-zip -g ResourceGroup -n FunctionApp --src Zip File` and hit enter. Set the `ResourceGroup` value to: your resource group name. Set the `FunctionApp` value to: your newly created function app name. Set the `Zip File` value to: `digitalshadowsConnector.zip`(path to your zip file). Note:- Download the zip file from the link - [Function App Code](https://github.com/Azure/Azure-Sentinel/blob/master/Solutions/Digital%20Shadows/Data%20Connectors/Digital%20Shadows/digitalshadowsConnector.zip)

3. Configure the Function App

1. In the Function App screen, click the Function App name and select **Configuration**.
2. In the **Application settings** tab, select **+ New application setting**.
3. Add each of the following 'x (number of)' application settings individually, under Name, with their respective string values (case-sensitive) under Value: 
		DigitalShadowsAccountID
		WorkspaceID
		WorkspaceKey
		DigitalShadowsKey
		DigitalShadowsSecret
		HistoricalDays
		DigitalShadowsURL
		ClassificationFilterOperation
		HighVariabilityClassifications
		FUNCTION_NAME
		logAnalyticsUri (optional)
(add any other settings required by the Function App)
Set the `DigitalShadowsURL` value to: `https://api.searchlight.app/v1`
Set the `HighVariabilityClassifications` value to: `exposed-credential,marked-document`
Set the `ClassificationFilterOperation` value to: `exclude` for exclude function app or `include` for include function app 
>Note: If using Azure Key Vault secrets for any of the values above, use the`@Microsoft.KeyVault(SecretUri={Security Identifier})`schema in place of the string values. Refer to [Azure Key Vault references documentation](/azure/app-service/app-service-key-vault-references) for further details.
 - Use logAnalyticsUri to override the log analytics API endpoint for dedicated cloud. For example, for public cloud, leave the value empty; for Azure GovUS cloud environment, specify the value in the following format: https://CustomerId.ods.opinsights.azure.us. 
4. Once all application settings have been entered, click **Save**.



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/digitalshadows1662022995707.digitalshadows_searchlight_for_sentinel?tab=Overview) in the Azure Marketplace.
