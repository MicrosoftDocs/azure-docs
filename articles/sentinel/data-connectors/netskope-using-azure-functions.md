---
title: "Netskope (using Azure Functions) connector for Microsoft Sentinel"
description: "Learn how to install the connector Netskope (using Azure Functions) to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 10/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Netskope (using Azure Functions) connector for Microsoft Sentinel

The [Netskope Cloud Security Platform](https://www.netskope.com/platform) connector provides the capability to ingest Netskope logs and events into Microsoft Sentinel. The connector provides visibility into Netskope Platform Events and Alerts in Microsoft Sentinel to improve monitoring and investigation capabilities.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Application settings** | apikey<br/>workspaceID<br/>workspaceKey<br/>uri<br/>timeInterval<br/>logTypes<br/>logAnalyticsUri (optional) |
| **Azure function app code** | https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/Netskope/Data%20Connectors/Netskope/AzureFunctionNetskope/run.ps1 |
| **Log Analytics table(s)** | Netskope_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Netskope](https://www.netskope.com/services#support) |

## Query samples

**Top 10 Users**
   ```kusto
Netskope
 
   | summarize count() by SrcUserName 
 
   | top 10 by count_
   ```

**Top 10 Alerts**
   ```kusto
Netskope
 
   | where isnotempty(AlertName) 
 
   | summarize count() by AlertName 

   | top 10 by count_
   ```

## Prerequisites

To integrate with Netskope (using Azure Functions) make sure you have: 

- **Microsoft.Web/sites permissions**: Read and write permissions to Azure Functions to create a Function App is required. [See the documentation to learn more about Azure Functions](/azure/azure-functions/).
- **Netskope API Token**: A Netskope API Token is required. [See the documentation to learn more about Netskope API](https://www.netskope.com/resources). **Note:** A Netskope account is required


## Vendor installation instructions

> [!NOTE]
>  - This connector uses Azure Functions to connect to Netskope to pull logs into Microsoft Sentinel. This might result in additional data ingestion costs. Check the [Azure Functions pricing page](https://azure.microsoft.com/pricing/details/functions/) for details.
>  - This data connector depends on a parser based on a Kusto Function to work as expected which is deployed as part of the solution. To view the function code in Log Analytics, open Log Analytics/Microsoft Sentinel Logs blade, click Functions and search for the alias Netskope and load the function code or click [here](https://github.com/Azure/Azure-Sentinel/blob/master/Solutions/Netskope/Parsers/Netskope.txt), on the second line of the query, enter the hostname(s) of your Netskope device(s) and any other unique identifiers for the logstream. The function usually takes 10-15 minutes to activate after solution installation/update.

**(Optional Step)** Securely store workspace and API authorization key(s) or token(s) in Azure Key Vault. Azure Key Vault provides a secure mechanism to store and retrieve key values. [Follow these instructions](/azure/app-service/app-service-key-vault-references) to use Azure Key Vault with an Azure Function App.

**STEP 1 - Configuration steps for the Netskope API**

 [Follow these instructions](https://docs.netskope.com/en/rest-api-v1-overview.html) provided by Netskope to obtain an API Token. **Note:** A Netskope account is required

**STEP 2 - Choose ONE from the following two deployment options to deploy the connector and the associated Azure Function**

> [!IMPORTANT]
> Before deploying the Netskope connector, have the Workspace ID and Workspace Primary Key (can be copied from the following), as well as the Netskope API Authorization Token, readily available.

Option 1 - Azure Resource Manager (ARM) Template

This method provides an automated deployment of the Netskope connector using an ARM Template.

1. Click the **Deploy to Azure** button below. 

	[![Deploy To Azure](https://aka.ms/deploytoazurebutton)](https://aka.ms/sentinel-netskope-azuredeploy)
2. Select the preferred **Subscription**, **Resource Group** and **Location**. 
3. Enter the **Workspace ID**, **Workspace Key**, **API Key**, and **URI**.
 - Use the following schema for the `uri` value: `https://<Tenant Name>.goskope.com` Replace `<Tenant Name>` with your domain.
 - The default **Time Interval** is set to pull the last five (5) minutes of data. If the time interval needs to be modified, it is recommended to change the Function App Timer Trigger accordingly (in the function.json file, post deployment) to prevent overlapping data ingestion.
 - The default **Log Types** is set to pull all 6 available log types (`alert, page, application, audit, infrastructure, network`), remove any are not required. 
   > [!NOTE]
   > If using Azure Key Vault secrets for any of the values above, use the`@Microsoft.KeyVault(SecretUri={Security Identifier})`schema in place of the string values. Refer to [Key Vault references documentation](/azure/app-service/app-service-key-vault-references) for further details. 
4. Mark the checkbox labeled **I agree to the terms and conditions stated above**. 
5. Click **Purchase** to deploy.
6. After successfully deploying the connector, download the Kusto Function to normalize the data fields. [Follow the steps](https://aka.ms/sentinelgithubparsersnetskope) to use the Kusto function alias, **Netskope**.

Option 2 - Manual Deployment of Azure Functions

This method provides the step-by-step instructions to deploy the Netskope connector manually with Azure Function.

**1. Create a Function App**

1.  From the Azure portal, navigate to [Function App](https://portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.Web%2Fsites/kind/functionapp), and select **+ Add**.
2. In the **Basics** tab, ensure Runtime stack is set to **Powershell Core**. 
3. In the **Hosting** tab, ensure the **Consumption (Serverless)** plan type is selected.
4. Make other preferable configuration changes, if needed, then click **Create**.


**2. Import Function App Code**

1. In the newly created Function App, select **Functions** on the left pane and click **+ Add**.
2. Select **Timer Trigger**.
3. Enter a unique Function **Name** and modify the cron schedule, if needed. The default value is set to run the Function App every 5 minutes. (Note: the Timer trigger should match the `timeInterval` value below to prevent overlapping data), click **Create**.
4. Click on **Code + Test** on the left pane. 
5. Copy the [Function App Code](https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/Netskope/Data%20Connectors/Netskope/AzureFunctionNetskope/run.ps1) and paste into the Function App `run.ps1` editor.
6. Click **Save**.

**3. Configure the Function App**

1. In the Function App, select the Function App Name and select **Configuration**.
2. In the **Application settings** tab, select **+ New application setting**.
3. Add each of the following seven (7) application settings individually, with their respective string values (case-sensitive): 
		apikey
		workspaceID
		workspaceKey
		uri
		timeInterval
		logTypes
		logAnalyticsUri (optional)
  - Enter the URI that corresponds to your region. The `uri` value must follow the following schema: `https://<Tenant Name>.goskope.com` - There is no need to add subsequent parameters to the Uri, the Function App will dynamically append the parameters in the proper format.
  - Set the `timeInterval` (in minutes) to the default value of `5` to correspond to the default Timer Trigger of every `5` minutes. If the time interval needs to be modified, it is recommended to change the Function App Timer Trigger accordingly to prevent overlapping data ingestion.
  - Set the `logTypes` to `alert, page, application, audit, infrastructure, network` - This list represents all the available log types. Select the log types based on logging requirements, separating each by a single comma.
    > [!NOTE]
    > If using Azure Key Vault, use the`@Microsoft.KeyVault(SecretUri={Security Identifier})`schema in place of the string values. Refer to [Key Vault references documentation](/azure/app-service/app-service-key-vault-references) for further details. 
  - Use logAnalyticsUri to override the log analytics API endpoint for dedicated cloud. For example, for public cloud, leave the value empty; for Azure GovUS cloud environment, specify the value in the following format: `https://<CustomerId>.ods.opinsights.azure.us`.
4. Once all application settings have been entered, click **Save**.
5. After successfully deploying the connector, download the Kusto Function to normalize the data fields. [Follow the steps](https://aka.ms/sentinelgithubparsersnetskope) to use the Kusto function alias, **Netskope**.



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/netskope.netskope_mss?tab=Overview) in the Azure Marketplace.
