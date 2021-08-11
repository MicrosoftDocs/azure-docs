---
title: troubleshooting private endpoint configuration for Purview accounts
description: This article describes how to troubleshoot problems with your Purview account related to private endpoints configurations
author: zeinam
ms.author: zeinam
ms.service: purview
ms.subservice: purview-data-catalog-overview
ms.topic: how-to
ms.date: 08/06/2021
# Customer intent: As a Purview admin, I want to set up private endpoints for my Purview account, for secure access.
---

# Troubleshooting private endpoint configuration for Purview accounts

### Issue 

### Cause

### Resolution 



### Issue 
You may receive the following error message when running a scan:

  ```Internal system error. Please contact support with correlationId:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx System Error, contact support.```

### Cause 
This can be an indication of issues related to connectivity or name resolution between the VM running self-hosted integration runtime and Azure Purview's managed resources storage account or event hub.

### Resolution 
Validate if name resolution between the VM running Self-Hosted Integration Runtime 


### Issue 
Error: (3815) Failed to access the Azure blob storage account with the Managed Identity

### Cause
'_Allow Azure services on the trusted services list to access this storage account._' is disabled on Azure data source.

### Resolution


## Azure Policy Violation - Disallowed Azure resource types 

### Issue 
The template deployment failed because of policy violation 

### Cause
This error suggests that there may be an existing Azure Policy Assignment on your Azure subscription that is preventing the deployment of any of the required Azure resources. 

### Resolution 
Review your existing Azure Policy Assignments and make sure deployment of the following Azure resources are allowed in your Azure subscription. 
   
> [!NOTE]
> Depending on your scenario, you may need to deploy one or more of the following Azure resource types: 
>  -   Azure Purview (Microsoft.Purview/Accounts)
>  -   Private Endpoint (Microsoft.Network/privateEndpoints)
>  -   Private DNS Zones (Microsoft.Network/privateDnsZones)
>  -   Event Hub Name Space (Microsoft.EventHub/namespaces)
>  -   Storage Account (Microsoft.Storage/storageAccounts)

## Access to Purview Studio - Not authorized to access this Purview account.

### Issue
Not authorized to access this Purview account. This Purview account is behind a private endpoint. Please access the account from a client in the same virtual network (VNet) that has been configured for the Purview account's private endpoint.


### Cause 
Connecting to Azure Purview from a public endpoint where **Public network access** is set to **Deny** results in the following error message:

### Resolution
In this case, to open Azure Purview Studio, either use a machine that's deployed in the same virtual network as the Azure Purview portal private endpoint or use a VM that's connected to your CorpNet in which hybrid connectivity is allowed.

## Known limitations

- We currently do not support ingestion private endpoints that work with your AWS sources.
- Ingestion private endpoints can be created only via the Azure Purview portal experience described in the preceding steps. They can't be created from the Private Link Center.
- Creating DNS A records for ingestion private endpoints while Azure Private DNS Zones are located in a different subscription which is not the same as where private endpoints are being created. A records can be added manually in the destination DNS Zones in the other subscription. 
- For limitation related to Private Link service, see [Azure Private Link limits](../azure-resource-manager/management/azure-subscription-service-limits.md#private-link-limits).


## Next steps

If your problem isn't listed in this article or you can't resolve it, get support by visiting one of
the following channels:

- Get answers from experts through
  [Microsoft Q&A](/answers/topics/azure-purview.html).
- Connect with [@AzureSupport](https://twitter.com/azuresupport). This official Microsoft Azure resource on Twitter helps improve the customer experience by connecting the Azure community to the right answers, support, and experts.
- If you still need help, go to the [Azure support site](https://azure.microsoft.com/support/options/) and select **Submit a support
  request**.
