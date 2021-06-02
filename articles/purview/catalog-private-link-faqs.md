---
title: Azure Purview private endpoints frequently asked questions (FAQ)
description: This article answers frequently asked questions about Azure Purview Private Endpoints
author: zeinam
ms.author: zeinam
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 05/11/2021
# Customer intent: As a Purview admin, I want to set up private endpoints for my Purview account, for secure access.
---

# Frequently asked questions (FAQ) about Azure Purview Private Endpoints

This article answers common questions that customers and field teams often ask about Azure Purview network configurations using [Azure Private Link](../private-link/private-link-overview.md). It is intended to clarify questions about Azure Purview Firewall settings, Private Endpoints, DNS configuration and related configurations.

To setup Azure Purview using Private Link, see [Use private endpoints for your Purview account](./catalog-private-link.md).

## Common questions

### What is purpose of deploying Azure Purview 'Account' Private Endpoint?

Azure Purview _Account_ Private Endpoint is used to add an additional layer of security by enabling scenarios where only client calls originating from within the V-net are allowed to access the account. This private endpoint is also a prerequisites for Portal Private Endpoint.
    
### What is purpose of deploying  Azure Purview 'Portal' Private Endpoint?
Azure Purview _Portal_ Private Endpoint is aimed to provide private connectivity to Azure Purview Studio.
    
### What is purpose of deploying Azure Purview 'Ingestion' Private Endpoints?

Azure Purview can scan data sources in Azure or on-premises environment using ingestion Private Endpoints. 3 additional Private Endpoint resources are deployed and linked to Azure Purview managed resources when ingestion private endpoints are created:
- _Blob_ linked to Azure Purview managed storage account 
- _Queue_ linked to Azure Purview managed storage account  
- _namespace_ linked to Azure Purview managed event hub namespace
     
### Can I scan data through Public Endpoint if Private Endpoint is enabled on my Azure Purview account?

Yes, data sources that are not connected through private endpoint can be scanned using public endpoint, meanwhile Azure Purview is configured to use private endpoint.
    
### Can I scan data through Service Endpoint if Private Endpoint is enabled?

Yes, data sources that are not connected through private endpoint can be scanned using service endpoint meanwhile Azure Purview is configured to use private endpoint.
Make sure you enable Allow trusted Microsoft services to access the resources inside Service Endpoint configuration of the data source resource in Azure. For example, if you are going to scan an Azure Blob Storage in which the Firewalls and virtual networks settings are set to _selected networks_, you need to make sure _Allow trusted Microsoft services to access this storage account_ is checked as exception. 
    
###  Can I access Azure Purview Studio from public network if Public network access is set to Deny in Azure Purview Account Networking?

No. Connecting to Azure Purview from public endpoint _public network access_ is set to _Deny_, results an error message as the following:

_Not authorized to access this Purview account_
_This Purview account is behind a private endpoint. Please access the account from a client in the same virtual network (VNet) that has been configured for the Purview account's private endpoint._

In this case, to launch Azure Purview Studio, you need to use a machine that is either deployed in the same VNet as Azure Purview portal Private Endpoint or use a VM that is connected to your CorpNet in which hybrid connectivity is allowed.

### Is it possible to restrict access to Azure Purview managed Storage Account and Event Hub namespace (for Private Endpoint Ingestion only), but keep Portal access enabled for end-users across the Web?

No. When you set _Public network access_ to _Deny_, access to Azure Purview managed Storage Account and Event Hub namespace is automatically set for Private Endpoint Ingestion only. 
When you set _Public network access_ to _Allow_, access to Azure Purview managed Storage Account and Event Hub namespace is automatically set for _All Networks_. 
You cannot modify the Private Endpoint ingestion manually for the managed Storage Account or Event Hub namespace manually.
    
### If Public network access is set to Allow, does it mean the managed Storage Account and Event Hub can be publicly accessible?

No. As protected resources, access to Azure Purview managed Storage Account and Event Hub namespace is restricted to Azure Purview only. These resources are deployed with a deny assignment to all principals which prevents any applications, users or groups gaining access to them.

To read more about Azure Deny Assignment see, [Understand Azure deny assignments](../role-based-access-control/deny-assignments.md).
    
### What are the supported authentication type when using Private Endpoint?

Azure Key Vault or Service Principal.
  
### What are Private DNS Zones required for Azure Purview for Private Endpoint?

**For Azure Purview resource:** 
- `privatelink.purview.azure.com`

**For Azure Purview managed resources:**
- `privatelink.blob.core.windows.net`
- `privatelink.queue.core.windows.net`
- `privatelink.servicebus.windows.net`
    
### Do I have to use a dedicated Virtual Network and dedicated subnet when deploying Azure Purview Private Endpoints?

No, however _PrivateEndpointNetworkPolicies_ must be disabled in the destination subnet before deploying the Private Endpoints.
Consider deploying Azure Purview into a Virtual Network that has network connectivity to data sources VNets through VNet Peering and access to on-premises network if you are planning to scan data sources cross premises.
    
Read more about [Disable network policies for private endpoints](../private-link/disable-private-endpoint-network-policy.md).

### Can I deploy Azure Purview Private Endpoints and use existing Private DNS Zones in my subscription to register the A records?

Yes. Your Private Endpoints DNS zones can be centralized in a hub or data management subscription for all internal DNS zones required for Azure Purview and all data sources records. This is the recommended method to allow Azure Purview resolve data sources using their Private Endpoint internal IP addresses.

Additionally, it is required to setup a [virtual network link](../dns/private-dns-virtual-network-links.md) for VNet for the existing private DNS zone.
    
### Can I use Azure integration runtime to scan data sources through Private Endpoint? 

No. You have to deploy and register a self-hosted integration runtime to scan data using private connectivity. Azure Key Vault or Service Principal must be used as authentication method to data sources.
    
### What are the outbound ports and firewall requirements for virtual machines with self-hosted integration runtime for Azure Purview when using private endpoint?

The VMs in which self-hosted integration runtime is deployed, must have outbound access to Azure endpoints and Azure Purview Private IP address through port 443. 
    
### Do I need to enable outbound internet access from the virtual machine running self-hosted integration runtime if Private Endpoint is enabled?

No. However, it is expected that virtual machine running self-hosted integration runtime can connect to your Azure Purview through internal IP address using port 443. 
Use common tools for name resolution and connectivity test such as nslookup.exe and Test-NetConnection for troubleshooting.
    
### Why do I receive the following error message when I try to launch Azure Purview Studio from my machine?

_This Purview account is behind a private endpoint. Please access the account from a client in the same virtual network (VNet) that has been configured for the Purview account's private endpoint._

It is likely your Azure Purview account is deployed using Azure Private Link and public access is disabled on your Azure Purview account, therefore, you have to browse Azure Purview Studio from a virtual machine that has internal network connectivity to Azure Purview.

If you are connecting from a VM behind a hybrid network or using a jump machine connected to your VNet, use common troubleshooting tools for name resolution and connectivity test such as nslookup.exe and Test-NetConnection.

1. Validate if you can resolve the following addresses through your Azure Purview account's private IP addresses:

   - `Web.Purview.Azure.com`
   - `<YourPurviewAccountName>.Purview.Azure.com`

2. Verify network connectivity to your Azure Purview Account using the following PowerShell command:

   ```powershell
   Test-NetConnection -ComputerName <YourPurviewAccountName>.Purview.Azure.com -Port 443
   ```

3. Verify your cross-premises DNS configuration if your use your own DNS resolution infrastructure. 

   For more information about DNS settings for Private Endpoints, see [Azure Private Endpoint DNS configuration](../private-link/private-endpoint-dns.md).

## Next steps

To setup Azure Purview using Private Link, see [Use private endpoints for your Purview account](./catalog-private-link.md).
