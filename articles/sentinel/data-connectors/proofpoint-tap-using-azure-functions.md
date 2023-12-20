---
title: "Proofpoint TAP (using Azure Functions) connector for Microsoft Sentinel"
description: "Learn how to install the connector Proofpoint TAP (using Azure Functions) to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 10/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Proofpoint TAP (using Azure Functions) connector for Microsoft Sentinel

The [Proofpoint Targeted Attack Protection (TAP)](https://www.proofpoint.com/us/products/advanced-threat-protection/targeted-attack-protection) connector provides the capability to ingest Proofpoint TAP logs and events into Microsoft Sentinel. The connector provides visibility into Message and Click events in Microsoft Sentinel to view dashboards, create custom alerts, and to improve monitoring and investigation capabilities.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
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







## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-proofpoint?tab=Overview) in the Azure Marketplace.
