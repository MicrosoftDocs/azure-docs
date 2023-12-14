---
title: "Cisco Umbrella (using Azure Functions) connector for Microsoft Sentinel"
description: "Learn how to install the connector Cisco Umbrella (using Azure Functions) to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 10/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Cisco Umbrella (using Azure Functions) connector for Microsoft Sentinel

The Cisco Umbrella data connector provides the capability to ingest [Cisco Umbrella](https://docs.umbrella.com/) events stored in Amazon S3 into Microsoft Sentinel using the Amazon S3 REST API. Refer to [Cisco Umbrella log management documentation](https://docs.umbrella.com/deployment-umbrella/docs/log-management) for more information.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Kusto function alias** | Cisco_Umbrella |
| **Kusto function url** | https://aka.ms/sentinel-ciscoumbrella-function |
| **Log Analytics table(s)** | Cisco_Umbrella_dns_CL<br/> Cisco_Umbrella_proxy_CL<br/> Cisco_Umbrella_ip_CL<br/> Cisco_Umbrella_cloudfirewall_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com/) |

## Query samples

**All Cisco Umbrella Logs**
   ```kusto
Cisco_Umbrella

   | sort by TimeGenerated desc
   ```

**Cisco Umbrella DNS Logs**
   ```kusto
Cisco_Umbrella
 
   | where EventType == 'dnslogs'

   | sort by TimeGenerated desc
   ```

**Cisco Umbrella Proxy Logs**
   ```kusto
Cisco_Umbrella
 
   | where EventType == 'proxylogs'

   | sort by TimeGenerated desc
   ```

**Cisco Umbrella IP Logs**
   ```kusto
Cisco_Umbrella
 
   | where EventType == 'iplogs'

   | sort by TimeGenerated desc
   ```

**Cisco Umbrella Cloud Firewall Logs**
   ```kusto
Cisco_Umbrella
 
   | where EventType == 'cloudfirewalllogs'

   | sort by TimeGenerated desc
   ```



## Prerequisites

To integrate with Cisco Umbrella (using Azure Functions) make sure you have: 

- **Microsoft.Web/sites permissions**: Read and write permissions to Azure Functions to create a Function App is required. [See the documentation to learn more about Azure Functions](/azure/azure-functions/).
- **Amazon S3 REST API Credentials/permissions**: **AWS Access Key Id**, **AWS Secret Access Key**, **AWS S3 Bucket Name** are required for Amazon S3 REST API.


## Vendor installation instructions


> [!NOTE]
   >  This connector uses Azure Functions to connect to the Amazon S3 REST API to pull logs into Microsoft Sentinel. This might result in additional data ingestion costs. Check the [Azure Functions pricing page](https://azure.microsoft.com/pricing/details/functions/) for details.


> [!NOTE]
   >  This connector has been updated to support [cisco umbrella version 5 and version 6.](https://docs.umbrella.com/deployment-umbrella/docs/log-formats-and-versioning)


>**(Optional Step)** Securely store workspace and API authorization key(s) or token(s) in Azure Key Vault. Azure Key Vault provides a secure mechanism to store and retrieve key values. [Follow these instructions](/azure/app-service/app-service-key-vault-references) to use Azure Key Vault with an Azure Functions App.


> [!NOTE]
   >  This connector uses a parser based on a Kusto Function to normalize fields. [Follow these steps](https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Parsers/CiscoUmbrella/Cisco_Umbrella) to create the Kusto function alias **Cisco_Umbrella**.


**STEP 1 - Configuration of the Cisco Umbrella logs collection**

[See documentation](https://docs.umbrella.com/deployment-umbrella/docs/log-management#section-logging-to-amazon-s-3) and follow the instructions for set up logging and obtain credentials.


**STEP 2 - Choose ONE from the following two deployment options to deploy the connector and the associated Azure Functions**

>**IMPORTANT:** Before deploying the Cisco Umbrella data connector, have the Workspace ID and Workspace Primary Key (can be copied from the following), as well as the Amazon S3 REST API Authorization credentials, readily available.







## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-ciscoumbrella?tab=Overview) in the Azure Marketplace.
