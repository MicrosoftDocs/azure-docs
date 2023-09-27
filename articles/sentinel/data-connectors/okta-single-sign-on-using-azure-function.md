---
title: "Okta Single Sign-On (using Azure Functions) connector for Microsoft Sentinel"
description: "Learn how to install the connector Okta Single Sign-On (using Azure Functions) to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 02/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Okta Single Sign-On (using Azure Functions) connector for Microsoft Sentinel

The [Okta Single Sign-On (SSO)](https://www.okta.com/products/single-sign-on/) connector provides the capability to ingest audit and event logs from the Okta API into Microsoft Sentinel. The connector provides visibility into these log types in Microsoft Sentinel to view dashboards, create custom alerts, and to improve monitoring and investigation capabilities.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Azure functions app code** | https://aka.ms/sentineloktaazurefunctioncodev2 |
| **Log Analytics table(s)** | Okta_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |

## Query samples

**Top 10 Active Applications**

   ```kusto
   Okta_CL 
   | mv-expand todynamic(target_s)  
   | where target_s.type == "AppInstance"  
   | summarize count() by tostring(target_s.alternateId)  
   | top 10 by count_
   ```

**Top 10 Client IP Addresses**
   ```kusto
   Okta_CL 
   | summarize count() by client_ipAddress_s 
   | top 10 by count_
   ```
## Prerequisites

To integrate with Okta Single Sign-On (using Azure Function), make sure you have the following prerequisites: 

- **Microsoft.Web/sites permissions**: Read and write permissions to Azure Functions to create a Function App is required. [See the documentation to learn more about Azure Functions](/azure/azure-functions).
- **Okta API Token**: An Okta API Token is required. See the documentation to learn more about the [Okta System Log API](https://developer.okta.com/docs/reference/api/system-log/).

## Vendor installation instructions

> [!NOTE]
> This connector uses Azure Functions to connect to Okta SSO to pull its logs into Microsoft Sentinel. This might result in additional data ingestion costs. Check the [Azure Functions pricing page](https://azure.microsoft.com/pricing/details/functions/) for details.


> [!NOTE]
>  This connector has been updated. If you have previously deployed an earlier version, and want to update, please delete the existing Okta Azure Function before redeploying this version.


>**(Optional Step)** Securely store workspace and API authorization key(s) or token(s) in Azure Key Vault. Azure Key Vault provides a secure mechanism to store and retrieve key values. [Follow these instructions](/azure/app-service/app-service-key-vault-references) to use Azure Key Vault with an Azure Function App.


**STEP 1 - Configuration steps for the Okta SSO API**

 [Follow these instructions](https://developer.okta.com/docs/guides/create-an-api-token/create-the-token/) to create an API Token.

   > [!NOTE]
   > For more information on the rate limit restrictions enforced by Okta, see **[OKTA developer reference documentation](https://developer.okta.com/docs/reference/rl-global-mgmt/)**.

**STEP 2 - Choose ONE from the following two deployment options to deploy the connector and the associated Azure Function**

> [!IMPORTANT]
> Before deploying the Okta SSO connector, have the Workspace ID and Workspace Primary Key (can be copied from the following), as well as the Okta SSO API Authorization Token, readily available.

### Option 1 - Azure Resource Manager (ARM) Template

This method provides an automated deployment of the Okta SSO connector using an ARM Template.

1. Select the following **Deploy to Azure** button. 

   [![Deploy To Azure](https://aka.ms/deploytoazurebutton)](https://aka.ms/sentineloktaazuredeployv2-solution)

2. Select the preferred **Subscription**, **Resource Group** and **Location**. 

3. Enter the **Workspace ID**, **Workspace Key**, **API Token** and **URI**. 

   Use the following schema for the `uri` value: `https://<OktaDomain>/api/v1/logs?since=` Replace `<OktaDomain>` with your domain. [Click here](https://developer.okta.com/docs/reference/api-overview/#url-namespace) for further details on how to identify your Okta domain namespace. There's no need to add a time value to the URI. The Function App will dynamically append the initial start time of logs to UTC 0:00 for the current UTC date as a time value to the URI in the proper format. 

   > [!NOTE]
   >  If using Azure Key Vault secrets for any of the preceding values, use the`@Microsoft.KeyVault(SecretUri={Security Identifier})`schema in place of the string values. Refer to [Key Vault references documentation](/azure/app-service/app-service-key-vault-references) for further details. 

4. Mark the checkbox labeled **I agree to the terms and conditions stated above**.
   
5. Select **Purchase** to deploy.

### Option 2 - Manual Deployment of Azure Functions

Use the following step-by-step instructions to deploy the Okta SSO connector manually with Azure Functions.

**1. Create a Function App**

1.  From the Azure portal, navigate to [Function App](https://portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.Web%2Fsites/kind/functionapp), and select **+ Add**.
2. In the **Basics** tab, ensure Runtime stack is set to **Powershell Core**. 
3. In the **Hosting** tab, ensure the **Consumption (Serverless)** plan type is selected.
4. Make other preferable configuration changes, if needed, then click **Create**.

**2. Import Function App Code**

1. In the newly created Function App, select **Functions** on the left pane and click **+ Add**.
2. Select **Timer Trigger**.
3. Enter a unique Function **Name** and change the default cron schedule to every 10 minutes, then click **Create**.
4. Click on **Code + Test** on the left pane. 
5. Copy the [Function App Code](https://aka.ms/sentineloktaazurefunctioncodev2) and paste into the Function App `run.ps1` editor.
5. Click **Save**.


**3. Configure the Function App**

1. In the Function App, select the Function App Name and select **Configuration**.

2. In the **Application settings** tab, select **+ New application setting**.

3. Add each of the following five (5) application settings individually, with their respective string values (case-sensitive): 
   - apiToken
   - workspaceID
   - workspaceKey
   - uri
   - logAnalyticsUri (optional)

   Use the following schema for the `uri` value: `https://<OktaDomain>/api/v1/logs?since=` Replace `<OktaDomain>` with your domain. For more information on how to identify your Okta domain namespace, see the [Okta Developer reference](https://developer.okta.com/docs/reference/api-overview/#url-namespace). There's no need to add a time value to the URI. The Function App dynamically appends the initial start time of logs to UTC 0:00 (for the current UTC date) as a time value to the URI in the proper format.
     
    > [!NOTE]
    > If using Azure Key Vault secrets for any of the preceding values, use the`@Microsoft.KeyVault(SecretUri={Security Identifier})`schema in place of the string values. Refer to [Key Vault references documentation](/azure/app-service/app-service-key-vault-references) for further details.
    
   Use logAnalyticsUri to override the log analytics API endpoint for a dedicated cloud. For example, for the public cloud, leave the value empty; for the Azure GovUS cloud environment, specify the value in the following format: `https://<CustomerId>.ods.opinsights.azure.us`.
 
5. Once all application settings have been entered, click **Save**.

## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-okta?tab=Overview) in the Azure Marketplace.
