---
title: "Proofpoint TAP (using Azure Functions) connector for Microsoft Sentinel"
description: "Learn how to install the connector Proofpoint TAP (using Azure Functions) to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 08/28/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Proofpoint TAP (using Azure Functions) connector for Microsoft Sentinel

The [Proofpoint Targeted Attack Protection (TAP)](https://www.proofpoint.com/us/products/advanced-threat-protection/targeted-attack-protection) connector provides the capability to ingest Proofpoint TAP logs and events into Microsoft Sentinel. The connector provides visibility into Message and Click events in Microsoft Sentinel to view dashboards, create custom alerts, and to improve monitoring and investigation capabilities.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Application settings** | apiUsername<br/>apipassword<br/>workspaceID<br/>workspaceKey<br/>uri<br/>logAnalyticsUri (optional) |
| **Azure function app code** | https://aka.ms/sentinelproofpointtapazurefunctioncode |
| **Log Analytics table(s)** | ProofPointTAPClicksPermitted_CL<br/> ProofPointTAPClicksBlocked_CL<br/> ProofPointTAPMessagesDelivered_CL<br/> ProofPointTAPMessagesBlocked_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com/) |

## Query samples

**Malware click events permitted**
   ```kusto
ProofPointTAPClicksPermitted_CL
 
   | where classification_s == "malware" 
 
   | take 10
   ```

**Phishing click events blocked**
   ```kusto
ProofPointTAPClicksBlocked_CL
 
   | where classification_s == "phish" 
 
   | take 10
   ```

**Malware messages events delivered**
   ```kusto
ProofPointTAPMessagesDelivered_CL
 
   | mv-expand todynamic(threatsInfoMap_s)
 
   | extend classification = tostring(threatsInfoMap_s.classification)
 
   | where classification == "malware" 
 
   | take 10
   ```

**Phishing message events blocked**
   ```kusto
ProofPointTAPMessagesBlocked_CL
 
   | mv-expand todynamic(threatsInfoMap_s)
 
   | extend classification = tostring(threatsInfoMap_s.classification)
 
   | where classification == "phish"
   ```



## Prerequisites

To integrate with Proofpoint TAP (using Azure Functions) make sure you have: 

- **Microsoft.Web/sites permissions**: Read and write permissions to Azure Functions to create a Function App is required. [See the documentation to learn more about Azure Functions](/azure/azure-functions/).
- **Proofpoint TAP API Key**: A Proofpoint TAP API username and password is required. [See the documentation to learn more about Proofpoint SIEM API](https://help.proofpoint.com/Threat_Insight_Dashboard/API_Documentation/SIEM_API).


## Vendor installation instructions


> [!NOTE]
   >  This connector uses Azure Functions to connect to Proofpoint TAP to pull its logs into Microsoft Sentinel. This might result in additional data ingestion costs. Check the [Azure Functions pricing page](https://azure.microsoft.com/pricing/details/functions/) for details.


>**(Optional Step)** Securely store workspace and API authorization key(s) or token(s) in Azure Key Vault. Azure Key Vault provides a secure mechanism to store and retrieve key values. [Follow these instructions](/azure/app-service/app-service-key-vault-references) to use Azure Key Vault with an Azure Function App.


**STEP 1 - Configuration steps for the Proofpoint TAP API**

1. Log into the Proofpoint TAP console 
2. Navigate to **Connect Applications** and select **Service Principal**
3. Create a **Service Principal** (API Authorization Key)


**STEP 2 - Choose ONE from the following two deployment options to deploy the connector and the associated Azure Function**

>**IMPORTANT:** Before deploying the Proofpoint TAP connector, have the Workspace ID and Workspace Primary Key (can be copied from the following), as well as the Proofpoint TAP API Authorization Key(s), readily available.



Option 1 - Azure Resource Manager (ARM) Template

Use this method for automated deployment of the Proofpoint TAP connector.

1. Click the **Deploy to Azure** button below. 

	[![Deploy To Azure](https://aka.ms/deploytoazurebutton)](https://aka.ms/sentinelproofpointtapazuredeploy) 
2. Select the preferred **Subscription**, **Resource Group** and **Location**. 
3. Enter the **Workspace ID**, **Workspace Key**, **API Username**, **API Password**, and validate the **Uri**.
> - The default URI is pulling data for the last 300 seconds (5 minutes) to correspond with the default Function App Timer trigger of 5 minutes. If the time interval needs to be modified, it is recommended to change the Function App Timer Trigger accordingly (in the function.json file, post deployment) to prevent overlapping data ingestion. 
> - Note: If using Azure Key Vault secrets for any of the values above, use the`@Microsoft.KeyVault(SecretUri={Security Identifier})`schema in place of the string values. Refer to [Key Vault references documentation](/azure/app-service/app-service-key-vault-references) for further details. 
4. Mark the checkbox labeled **I agree to the terms and conditions stated above**. 
5. Click **Purchase** to deploy.

Option 2 - Manual Deployment of Azure Functions

This method provides the step-by-step instructions to deploy the Proofpoint TAP connector manually with Azure Function.


**1. Create a Function App**

1.  From the Azure Portal, navigate to [Function App](https://portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.Web%2Fsites/kind/functionapp), and select **+ Add**.
2. In the **Basics** tab, ensure Runtime stack is set to **Powershell Core**. 
3. In the **Hosting** tab, ensure the **Consumption (Serverless)** plan type is selected.
4. Make other preferrable configuration changes, if needed, then click **Create**.


**2. Import Function App Code**

1. In the newly created Function App, select **Functions** on the left pane and click **+ Add**.
2. Select **Timer Trigger**.
3. Enter a unique Function **Name** and modify the cron schedule, if needed. The default value is set to run the Function App every 5 minutes. (Note: the Timer trigger should match the `timeInterval` value below to prevent overlapping data), click **Create**.
4. Click on **Code + Test** on the left pane. 
5. Copy the [Function App Code](https://aka.ms/sentinelproofpointtapazurefunctioncode) and paste into the Function App `run.ps1` editor.
5. Click **Save**.


**3. Configure the Function App**

1. In the Function App, select the Function App Name and select **Configuration**.
2. In the **Application settings** tab, select **+ New application setting**.
3. Add each of the following six (6) application settings individually, with their respective string values (case-sensitive): 
		apiUsername
		apipassword
		workspaceID
		workspaceKey
		uri
		logAnalyticsUri (optional)
> - Set the `uri` value to: `https://tap-api-v2.proofpoint.com/v2/siem/all?format=json&sinceSeconds=300`
> - The default URI is pulling data for the last 300 seconds (5 minutes) to correspond with the default Function App Timer trigger of 5 minutes. If the time interval needs to be modified, it is recommended to change the Function App Timer Trigger accordingly to prevent overlapping data ingestion.
> - Note: If using Azure Key Vault secrets for any of the values above, use the`@Microsoft.KeyVault(SecretUri={Security Identifier})`schema in place of the string values. Refer to [Key Vault references documentation](/azure/app-service/app-service-key-vault-references) for further details.
> - Use logAnalyticsUri to override the log analytics API endpoint for dedicated cloud. For example, for public cloud, leave the value empty; for Azure GovUS cloud environment, specify the value in the following format: `https://<CustomerId>.ods.opinsights.azure.us`
4. Once all application settings have been entered, click **Save**.



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-proofpoint?tab=Overview) in the Azure Marketplace.
