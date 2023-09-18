---
title: "MailRisk by Secure Practice (using Azure Functions) connector for Microsoft Sentinel"
description: "Learn how to install the connector MailRisk by Secure Practice (using Azure Functions) to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 07/26/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# MailRisk by Secure Practice (using Azure Functions) connector for Microsoft Sentinel

Data connector to push emails from MailRisk into Microsoft Sentinel Log Analytics.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | MailRiskEmails_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Secure Practice](https://securepractice.co/support) |

## Query samples

**All emails**
   ```kusto
MailRiskEmails_CL

   | sort by TimeGenerated desc
   ```

**Emails with SPF pass**
   ```kusto
MailRiskEmails_CL

   | where spf_s == 'pass' 

   | sort by TimeGenerated desc
   ```

**Emails with specific category**
   ```kusto
MailRiskEmails_CL

   | where Category == 'scam' 

   | sort by TimeGenerated desc
   ```

**Emails with link urls that contain the string "microsoft"**
   ```kusto
MailRiskEmails_CL

   | sort by TimeGenerated desc

   | mv-expand link = parse_json(links_s)

   | where link.url contains "microsoft"
   ```



## Prerequisites

To integrate with MailRisk by Secure Practice (using Azure Functions) make sure you have: 

- **Microsoft.Web/sites permissions**: Read and write permissions to Azure Functions to create a Function App is required. [See the documentation to learn more about Azure Functions](/azure/azure-functions/).
- **API credentials**: Your Secure Practice API key pair is also needed, which are created in the [settings in the admin portal](https://manage.securepractice.co/settings/security). If you have lost your API secret, you can generate a new key pair (WARNING: Any other integrations using the old key pair will stop working).


## Vendor installation instructions


> [!NOTE]
   >  This connector uses Azure Functions to connect to the Secure Practice API to push logs into Microsoft Sentinel. This might result in additional data ingestion costs. Check the [Azure Functions pricing page](https://azure.microsoft.com/pricing/details/functions/) for details.


Please have these the Workspace ID and Workspace Primary Key (can be copied from the following), readily available.



Azure Resource Manager (ARM) Template

Use this method for automated deployment of the MailRisk data connector using an ARM Template.

1. Click the **Deploy to Azure** button below. 

	[![Deploy To Azure](https://aka.ms/deploytoazurebutton)](https://aka.ms/sentinel-mailrisk-azuredeploy)
2. Select the preferred **Subscription**, **Resource Group** and **Location**. 
3. Enter the **Workspace ID**, **Workspace Key**, **Secure Practice API Key**, **Secure Practice API Secret** 
4. Mark the checkbox labeled **I agree to the terms and conditions stated above**.
5. Click **Purchase** to deploy.

Manual deployment

In the open source repository on [GitHub](https://github.com/securepractice/mailrisk-sentinel-connector) you can find instructions for how to manually deploy the data connector.



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/securepracticeas1650887373770.microsoft-sentinel-solution-mailrisk?tab=Overview) in the Azure Marketplace.
