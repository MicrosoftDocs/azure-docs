---
title: "Palo Alto Prisma Cloud CSPM (using Azure Functions) connector for Microsoft Sentinel"
description: "Learn how to install the connector Palo Alto Prisma Cloud CSPM (using Azure Functions) to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 08/28/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Palo Alto Prisma Cloud CSPM (using Azure Functions) connector for Microsoft Sentinel

The Palo Alto Prisma Cloud CSPM data connector provides the capability to ingest [Prisma Cloud CSPM alerts](https://prisma.pan.dev/api/cloud/cspm/alerts#operation/get-alerts) and [audit logs](https://prisma.pan.dev/api/cloud/cspm/audit-logs#operation/rl-audit-logs) into Microsoft sentinel using the Prisma Cloud CSPM API. Refer to [Prisma Cloud CSPM API documentation](https://prisma.pan.dev/api/cloud/cspm) for more information.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | PaloAltoPrismaCloudAlert_CL<br/> PaloAltoPrismaCloudAudit_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |

## Query samples

**All Prisma Cloud alerts**
   ```kusto
PaloAltoPrismaCloudAlert_CL

   | sort by TimeGenerated desc
   ```

**All Prisma Cloud audit logs**
   ```kusto
PaloAltoPrismaCloudAudit_CL

   | sort by TimeGenerated desc
   ```



## Prerequisites

To integrate with Palo Alto Prisma Cloud CSPM (using Azure Functions) make sure you have: 

- **Microsoft.Web/sites permissions**: Read and write permissions to Azure Functions to create a Function App is required. [See the documentation to learn more about Azure Functions](/azure/azure-functions/).
- **Palo Alto Prisma Cloud API Credentials**: **Prisma Cloud API Url**, **Prisma Cloud Access Key ID**, **Prisma Cloud Secret Key** are required for Prisma Cloud API connection. See the documentation to learn more about [creating Prisma Cloud Access Key](https://docs.paloaltonetworks.com/prisma/prisma-cloud/prisma-cloud-admin/manage-prisma-cloud-administrators/create-access-keys.html) and about [obtaining Prisma Cloud API Url](https://prisma.pan.dev/api/cloud/api-urls)


## Vendor installation instructions


> [!NOTE]
   >  This connector uses Azure Functions to connect to the Palo Alto Prisma Cloud REST API to pull logs into Microsoft sentinel. This might result in additional data ingestion costs. Check the [Azure Functions pricing page](https://azure.microsoft.com/pricing/details/functions/) for details.


>**(Optional Step)** Securely store workspace and API authorization key(s) or token(s) in Azure Key Vault. Azure Key Vault provides a secure mechanism to store and retrieve key values. [Follow these instructions](/azure/app-service/app-service-key-vault-references) to use Azure Key Vault with an Azure Function App.


> [!NOTE]
   >  This data connector depends on a parser based on a Kusto Function to work as expected [**PaloAltoPrismaCloud**](https://aka.ms/sentinel-PaloAltoPrismaCloud-parser) which is deployed with the Microsoft sentinel Solution.


**STEP 1 - Configuration of the Prisma Cloud**

Follow the documentation to [create Prisma Cloud Access Key](https://docs.paloaltonetworks.com/prisma/prisma-cloud/prisma-cloud-admin/manage-prisma-cloud-administrators/create-access-keys.html) and [obtain Prisma Cloud API Url](https://api.docs.prismacloud.io/reference)

 NOTE: Please use SYSTEM ADMIN role for giving access to Prisma Cloud API because only SYSTEM ADMIN role is allowed to View Prisma Cloud Audit Logs. Refer to [Prisma Cloud Administrator Permissions (paloaltonetworks.com)](https://docs.paloaltonetworks.com/prisma/prisma-cloud/prisma-cloud-admin/manage-prisma-cloud-administrators/prisma-cloud-admin-permissions) for more details of administrator permissions.


**STEP 2 - Choose ONE from the following two deployment options to deploy the connector and the associated Azure Function**

>**IMPORTANT:** Before deploying the Prisma Cloud data connector, have the Workspace ID and Workspace Primary Key (can be copied from the following), as well as Prisma Cloud API credentials, readily available.







## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-paloaltoprisma?tab=Overview) in the Azure Marketplace.
