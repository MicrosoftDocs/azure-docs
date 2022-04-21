---
title: Microsoft Purview private endpoints frequently asked questions (FAQ)
description: This article answers frequently asked questions about Microsoft Purview private endpoints.
author: zeinam
ms.author: zeinam
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 05/11/2021
# Customer intent: As a Microsoft Purview admin, I want to set up private endpoints for my Microsoft Purview account for secure access.
---
# FAQ about Microsoft Purview private endpoints

This article answers common questions that customers and field teams often ask about Microsoft Purview network configurations by using [Azure Private Link](../private-link/private-link-overview.md). It's intended to clarify questions about Microsoft Purview firewall settings, private endpoints, DNS configuration, and related configurations.

To set up Microsoft Purview by using Private Link, see [Use private endpoints for your Microsoft Purview account](./catalog-private-link.md).

## Common questions

Check out the answers to the following common questions.

### What's the purpose of deploying the Microsoft Purview account private endpoint?

The Microsoft Purview account private endpoint is used to add another layer of security by enabling scenarios where only client calls that originate from within the virtual network are allowed to access the account. This private endpoint is also a prerequisite for the portal private endpoint.

### What's the purpose of deploying the Microsoft Purview portal private endpoint?

The Microsoft Purview portal private endpoint provides private connectivity to the Microsoft Purview governance portal.

### What's the purpose of deploying the Microsoft Purview ingestion private endpoints?

Microsoft Purview can scan data sources in Azure or an on-premises environment by using ingestion private endpoints. Three other private endpoint resources are deployed and linked to Microsoft Purview managed resources when ingestion private endpoints are created:

- **Blob** is linked to a Microsoft Purview managed storage account.
- **Queue** is linked to a Microsoft Purview managed storage account.
- **namespace** is linked to a Microsoft Purview managed event hub namespace.

### Can I scan data through a public endpoint if a private endpoint is enabled on my Microsoft Purview account?

Yes. Data sources that aren't connected through a private endpoint can be scanned by using a public endpoint while Microsoft Purview is configured to use a private endpoint.

### Can I scan data through a service endpoint if a private endpoint is enabled?

Yes. Data sources that aren't connected through a private endpoint can be scanned by using a service endpoint while Microsoft Purview is configured to use a private endpoint.

Make sure you enable **Allow trusted Microsoft services** to access the resources inside the service endpoint configuration of the data source resource in Azure. For example, if you're going to scan Azure Blob Storage in which the firewalls and virtual networks settings are set to **selected networks**, make sure the **Allow trusted Microsoft services to access this storage account** checkbox is selected as an exception.

### Can I access the Microsoft Purview governance portal from a public network if Public network access is set to Deny in Microsoft Purview account networking?

No. Connecting to Microsoft Purview from a public endpoint where **Public network access** is set to **Deny** results in the following error message:

"Not authorized to access this Microsoft Purview account. This Microsoft Purview account is behind a private endpoint. Please access the account from a client in the same virtual network (VNet) that has been configured for the Microsoft Purview account's private endpoint."

In this case, to open the Microsoft Purview governance portal, either use a machine that's deployed in the same virtual network as the Microsoft Purview portal private endpoint or use a VM that's connected to your CorpNet in which hybrid connectivity is allowed.

### Is it possible to restrict access to the Microsoft Purview managed storage account and event hub namespace (for private endpoint ingestion only) but keep portal access enabled for users across the web?

No. When you set **Public network access** to **Deny**, access to the Microsoft Purview managed storage account and event hub namespace is automatically set for private endpoint ingestion only. When you set **Public network access** to **Allow**, access to the Microsoft Purview managed storage account and event hub namespace is automatically set for **All Networks**. You can't modify the private endpoint ingestion manually for the managed storage account or event hub namespace manually.

### If public network access is set to Allow, does it mean the managed storage account and event hub namespace can be publicly accessible?

No. As protected resources, access to the Microsoft Purview managed storage account and event hub namespace is restricted to Microsoft Purview only. These resources are deployed with a deny assignment to all principals, which prevents any applications, users, or groups from gaining access to them.

To read more about Azure deny assignment, see [Understand Azure deny assignments](../role-based-access-control/deny-assignments.md).

### What are the supported authentication types when you use a private endpoint?

Azure Key Vault or Service Principal.

### What private DNS zones are required for Microsoft Purview for a private endpoint?

For Microsoft Purview _account_ and _portal_ private endpoints:

- `privatelink.purview.azure.com`

For Microsoft Purview _ingestion_ private endpoints:

- `privatelink.blob.core.windows.net`
- `privatelink.queue.core.windows.net`
- `privatelink.servicebus.windows.net`

### Do I have to use a dedicated virtual network and dedicated subnet when I deploy Microsoft Purview private endpoints?

No. However, `PrivateEndpointNetworkPolicies` must be disabled in the destination subnet before you deploy the private endpoints. Consider deploying Microsoft Purview into a virtual network that has network connectivity to data source virtual networks through VNet Peering and access to an on-premises network if you plan to scan data sources cross-premises.

Read more about [Disable network policies for private endpoints](../private-link/disable-private-endpoint-network-policy.md).

### Can I deploy Microsoft Purview private endpoints and use existing private DNS zones in my subscription to register the A records?

Yes. Your private endpoint DNS zones can be centralized in a hub or data management subscription for all internal DNS zones required for Microsoft Purview and all data source records. We recommend this method to allow Microsoft Purview to resolve data sources by using their private endpoint internal IP addresses.

You're also required to set up a [virtual network link](../dns/private-dns-virtual-network-links.md) for virtual networks for the existing private DNS zone.

### Can I use Azure integration runtime to scan data sources through a private endpoint?

No. You have to deploy and register a self-hosted integration runtime to scan data by using private connectivity. Azure Key Vault or Service Principal must be used as the authentication method to data sources.

### What are the outbound ports and firewall requirements for virtual machines with self-hosted integration runtime for Microsoft Purview when you use a private endpoint?

The VMs in which self-hosted integration runtime is deployed must have outbound access to Azure endpoints and a Microsoft Purview private IP address through port 443.

### Do I need to enable outbound internet access from the virtual machine running self-hosted integration runtime if a private endpoint is enabled?

No. However, it's expected that the virtual machine running self-hosted integration runtime can connect to your instance of Microsoft Purview through an internal IP address by using port 443. Use common troubleshooting tools for name resolution and connectivity testing, such as nslookup.exe and Test-NetConnection.

### Why do I receive the following error message when I try to launch Microsoft Purview governance portal from my machine?

"This Microsoft Purview account is behind a private endpoint. Please access the account from a client in the same virtual network (VNet) that has been configured for the Microsoft Purview account's private endpoint."

It's likely your Microsoft Purview account is deployed by using Private Link and public access is disabled on your Microsoft Purview account. As a result, you have to browse the Microsoft Purview governance portal from a virtual machine that has internal network connectivity to Microsoft Purview.

If you're connecting from a VM behind a hybrid network or using a jump machine connected to your virtual network, use common troubleshooting tools for name resolution and connectivity testing, such as nslookup.exe and Test-NetConnection.

1. Validate if you can resolve the following addresses through your Microsoft Purview account's private IP addresses.

   - `Web.Purview.Azure.com`
   - `<YourPurviewAccountName>.Purview.Azure.com`

1. Verify network connectivity to your Microsoft Purview account by using the following PowerShell command:

   ```powershell
   Test-NetConnection -ComputerName <YourPurviewAccountName>.Purview.Azure.com -Port 443
   ```

1. Verify your cross-premises DNS configuration if you use your own DNS resolution infrastructure.

For more information about DNS settings for private endpoints, see [Azure private endpoint DNS configuration](../private-link/private-endpoint-dns.md).

## Next steps

To set up Microsoft Purview by using Private Link, see [Use private endpoints for your Microsoft Purview account](./catalog-private-link.md).
