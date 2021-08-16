---
title: troubleshooting private endpoint configuration for Purview accounts
description: This article describes how to troubleshoot problems with your Purview account related to private endpoints configurations
author: zeinam
ms.author: zeinam
ms.service: purview
ms.subservice: purview-data-catalog-overview
ms.topic: how-to
ms.date: 08/16/2021
# Customer intent: As a Purview admin, I want to set up private endpoints for my Purview account, for secure access.
---

# Troubleshooting private endpoint configuration for Purview accounts

## Known limitations

- We currently do not support ingestion private endpoints that work with your AWS sources.
- Scanning Azure Multiple Sources using self-hosted integration runtime is not supported.
- Using Azure integration runtime to scan data sources behind private endpoint is not supported.
- Using Azure Portal, The ingestion private endpoints can be created via the Azure Purview portal experience described in the preceding steps. They can't be created from the Private Link Center.
- Creating DNS A records for ingestion private endpoints inside existing Azure DNS Zones, while the Azure Private DNS Zones are located in a different subscription than the private endpoints is not supported via the Azure Purview portal experience. A records can be added manually in the destination DNS Zones in the other subscription. 
- Self-hosted integration runtime machine must be deployed in the same VNet where Azure Purview ingestion private endpoint is deployed.
- We currently do not support ingestion private endpoints to connect to Azure Data Factory.
- For limitation related to Private Link service, see [Azure Private Link limits](../azure-resource-manager/management/azure-subscription-service-limits.md#private-link-limits).

## Recommended troubleshooting steps  

1. Once you deploy private endpoints for your Purview account, review your Azure environment to make sure private endpoint resources are deployed successfully. Depending on your scenario, one or more of the following Azure private endpoints must be deployed in your Azure subscription:

    |Private endpoint  |Private endpoint assigned to | Example|
    |---------|---------|---------|
    |Account  |Azure Purview Account         |mypurview-private-account  |
    |Portal     |Azure Purview Account         |mypurview-private-portal  |
    |Ingestion     |Managed Storage Account (Blob)         |mypurview-ingestion-blob  |
    |Ingestion     |Managed Storage Account (Queue)         |mypurview-ingestion-queue  |
    |Ingestion     |Managed Event Hubs Namespace         |mypurview-ingestion-namespace  |

2. If portal private endpoint is deployed, and public network access is set to deny in your Azure Purview account, make sure you launch Azure Purview Studio from internal network. 
  <br>
    - To verify the correct name resolution, you can use a **NSlookup.exe** command line tool to query `web.purview.azure.com`. The result must return a private IP address that belongs to portal private endpoint. 
    - To verify network connectivity you can use any network test tools to test outbound connectivity to `web.purview.azure.com` endpoint to port **443**. The connection must be successful.    

3. If Azure Private DNS Zones are used, make sure the required Azure DNS Zones are deployed and there is DNS (A) record for each private endpoint.

4. Test network connectivity and name resolution from management machine to Purview endpoint and purview web url. If account and portal private endpoints are deployed, the endpoints must be resolved through private IP addresses.
  
  :::image type="content" source="media/catalog-private-link/purview-private-link-tr01.png" alt-text="Screenshot that shows how to troubleshoot Azure Purview with Private Endpoints."::: 


5. From self-hosted integration runtime VM, test network connectivity and name resolution to Purview endpoint:

  :::image type="content" source="media/catalog-private-link/purview-private-link-tr02.png" alt-text="Screenshot that shows how to troubleshoot Azure Purview with Private Endpoints."::: 


6. From self-hosted integration runtime, test network connectivity and name resolution to Azure Purview managed resources such as blob queue and event hub through port 443 and private IP addresses.

  :::image type="content" source="media/catalog-private-link/purview-private-link-tr02.png" alt-text="Screenshot that shows how to troubleshoot Azure Purview with Private Endpoints."::: 

 7. From the network where data source is located, test network connectivity and name resolution to Purview endpoint and managed resources endpoints.

8. If data sources are located in on-premises network, review your DNS forwarder configuration. Test name resolution from within the same network where data sources are located to self-hosted integration runtime, Azure Purview endpoints and managed resources. It is expected to obtain a valid private IP address from DNS query for each endpoint.
   
   For more information, see [Virtual network workloads without custom DNS server](../private-link/private-endpoint-dns.md#virtual-network-workloads-without-custom-dns-server) and [On-premises workloads using a DNS forwarder](../private-link/private-endpoint-dns.md#on-premises-workloads-using-a-dns-forwarder) scenarios in [Azure Private Endpoint DNS configuration](../private-link/private-endpoint-dns.md).

9.  If ingestion private endpoint is used, make sure self-hosted integration runtime is registered successfully inside Purview account and shows as running both inside the SHIR VM and in Azure Purview Studio.
  
  :::image type="content" source="media/catalog-private-link/purview-private-link-tr03.png" alt-text="Screenshot that shows how to troubleshoot Azure Purview with Private Endpoints."::: 

10. If management machine and self-hosted integration runtime VMs are deployed in on-premises network and you have set up DNS forwarder in your environment, verify DNS and network settings in your environment. 

## Common errors and messages

### Issue 
Purview account is behind a private endpoint and I could not retrieve scanned asset counts.

### Cause

### Resolution 


### Issue
I have created an Azure Purview account with private endpoints. When I click to launch Azure Purview Studio, I receive an error message that  can't be reached error page. I have also seen an error page where studio loads partially and throws a Network Error message. 

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

## Next steps

If your problem isn't listed in this article or you can't resolve it, get support by visiting one of
the following channels:

- Get answers from experts through
  [Microsoft Q&A](/answers/topics/azure-purview.html).
- Connect with [@AzureSupport](https://twitter.com/azuresupport). This official Microsoft Azure resource on Twitter helps improve the customer experience by connecting the Azure community to the right answers, support, and experts.
- If you still need help, go to the [Azure support site](https://azure.microsoft.com/support/options/) and select **Submit a support
  request**.
