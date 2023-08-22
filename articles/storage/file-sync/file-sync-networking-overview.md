---
title: Azure File Sync networking considerations
description: Learn how to configure networking to use Azure File Sync to cache files on-premises.
author: khdownie
ms.service: azure-file-storage
ms.topic: conceptual
ms.date: 09/14/2022
ms.author: kendownie
---

# Azure File Sync networking considerations
You can connect to an Azure file share in two ways:

- Accessing the share directly via the SMB or FileREST protocols. This access pattern is primarily employed to eliminate as many on-premises servers as possible.
- Creating a cache of the Azure file share on an on-premises server (or Azure VM) with Azure File Sync, and accessing the file share's data from the on-premises server with your protocol of choice (SMB, NFS, FTPS, etc.) for your use case. This access pattern is handy because it combines the best of both on-premises performance and cloud scale and serverless attachable services, such as Azure Backup.

This article focuses on how to configure networking when your use case calls for using Azure File Sync to cache files on-premises rather than directly mounting the Azure file share over SMB. For more information about networking considerations for an Azure Files deployment, see [Azure Files networking considerations](../files/storage-files-networking-overview.md?toc=/azure/storage/filesync/toc.json).

Networking configuration for Azure File Sync spans two different Azure objects: a Storage Sync Service and an Azure storage account. A storage account is a management construct that represents a shared pool of storage in which you can deploy multiple file shares, as well as other storage resources, such as blob containers or queues. A Storage Sync Service is a management construct that represents registered servers, which are Windows file servers with an established trust relationship with Azure File Sync, and sync groups, which define the topology of the sync relationship.

> [!Important]  
> Azure File Sync doesn't support internet routing. The default network routing option, Microsoft routing, is supported by Azure File Sync.

## Connecting Windows file server to Azure with Azure File Sync 
To set up and use Azure Files and Azure File Sync with an on-premises Windows file server, no special networking to Azure is required beyond a basic internet connection. To deploy Azure File Sync, you install the Azure File Sync agent on the Windows file server you would like to sync with Azure. The Azure File Sync agent achieves synchronization with an Azure file share via two channels:

- The FileREST protocol, which is an HTTPS-based protocol used for accessing your Azure file share. Because the FileREST protocol uses standard HTTPS for data transfer, only port 443 must be accessible outbound. Azure File Sync does not use the SMB protocol to transfer data between your on-premises Windows Servers and your Azure file share.
- The Azure File Sync sync protocol, which is an HTTPS-based protocol used for exchanging synchronization knowledge, i.e. the version information about the files and folders between endpoints in your environment. This protocol is also used to exchange metadata about the files and folders in your environment, such as timestamps and access control lists (ACLs).

Because Azure Files offers direct SMB protocol access on Azure file shares, customers often wonder if they need to configure special networking to mount the Azure file shares using SMB for the Azure File Sync agent to access. This is not required and is discouraged except in administrator scenarios, due to the lack of quick change detection on changes made directly to the Azure file share (changes may not be discovered for more than 24 hours depending on the size and number of items in the Azure file share). If you want to use the Azure file share directly, i.e. not use Azure File Sync to cache on-premises, see [Azure Files networking overview](../files/storage-files-networking-overview.md?toc=/azure/storage/filesync/toc.json).

Although Azure File Sync does not require any special networking configuration, some customers may wish to configure advanced networking settings to enable the following scenarios:

- Interoperate with your organization's proxy server configuration.
- Open your organization's on-premises firewall to the Azure Files and Azure File Sync services.
- Tunnel Azure Files and Azure File Sync traffic over ExpressRoute or a VPN connection.

### Configuring proxy servers
Many organizations use a proxy server as an intermediary between resources inside their on-premises network and resources outside their network, such as in Azure. Proxy servers are useful for many applications such as network isolation and security, and monitoring and logging. Azure File Sync can interoperate fully with a proxy server, however you must manually configure the proxy endpoint settings for your environment with Azure File Sync. This must be done via PowerShell using the Azure File Sync server cmdlet `Set-StorageSyncProxyConfiguration`.

For more information on how to configure Azure File Sync with a proxy server, see [Configuring Azure File Sync with a proxy server](file-sync-firewall-and-proxy.md).

### Configuring firewalls and service tags
Many organizations isolate their file servers from most internet locations for security purposes. To use Azure File Sync in such an environment, you need to configure your firewall to allow outbound access to select Azure services. You can do this by allowing port 443 outbound access to [required cloud endpoints](file-sync-firewall-and-proxy.md#firewall) hosting those specific Azure services if your firewall supports url/domains. If it doesn't, you can retrieve the IP address ranges for these Azure services through [service tags](../../virtual-network/service-tags-overview.md).

Azure File Sync requires the IP address ranges for the following services, as identified by their service tags:

| Service | Description | Service tag |
|---------|-------------|-------------|
| Azure File Sync | The Azure File Sync service, as represented by the Storage Sync Service object, is responsible for the core activity of syncing data between an Azure file share and a Windows file server. | `StorageSyncService` |
| Azure Files | All data synchronized via Azure File Sync is stored in Azure file share. Files changed on your Windows file servers are replicated to your Azure file share, and files tiered on your on-premises file server are seamlessly downloaded when a user requests them. | `Storage` |
| Azure Resource Manager | The Azure Resource Manager is the management interface for Azure. All management calls, including Azure File Sync server registration and ongoing sync server tasks, are made through the Azure Resource Manager. | `AzureResourceManager` |
| Azure Active Directory | Azure Active Directory, or Azure AD, contains the user principals required to authorize server registration against a Storage Sync Service, and the service principals required for Azure File Sync to be authorized to access your cloud resources. | `AzureActiveDirectory` |

If you're using Azure File Sync within Azure, even if it's in a different region, you can use the name of the service tag directly in your network security group to allow traffic to that service. To learn more, see [Network security groups](../../virtual-network/network-security-groups-overview.md).

If you're using Azure File Sync on-premises, you can use the service tag API to get specific IP address ranges for your firewall's allowlist. There are two methods for getting this information:

- The current list of IP address ranges for all Azure services supporting service tags are published weekly on the Microsoft Download Center in the form of a JSON document. Each Azure cloud has its own JSON document with the IP address ranges relevant for that cloud:
    - [Azure Public](https://www.microsoft.com/download/details.aspx?id=56519)
    - [Azure US Government](https://www.microsoft.com/download/details.aspx?id=57063)
    - [Microsoft Azure operated by 21Vianet](https://www.microsoft.com/download/details.aspx?id=57062)
    - [Azure Germany](https://www.microsoft.com/download/details.aspx?id=57064)
- The service tag discovery API (preview) allows programmatic retrieval of the current list of service tags. In preview, the service tag discovery API may return information that's less current than information returned from the JSON documents published on the Microsoft Download Center. You can use the API surface based on your automation preference:
    - [REST API](/rest/api/virtualnetwork/servicetags/list)
    - [Azure PowerShell](/powershell/module/az.network/Get-AzNetworkServiceTag)
    - [Azure CLI](/cli/azure/network#az-network-list-service-tags)

To learn more about how to use the service tag API to retrieve the addresses of your services, see [Allowlist for Azure File Sync IP addresses](file-sync-firewall-and-proxy.md#allow-list-for-azure-file-sync-ip-addresses).

### Tunneling traffic over a virtual private network or ExpressRoute
Some organizations require communication with Azure to go over a network tunnel, such as a virtual private network (VPN) or ExpressRoute, for an additional layer of security or to ensure communication with Azure follows a deterministic route. 

When you establish a network tunnel between your on-premises network and Azure, you are peering your on-premises network with one or more virtual networks in Azure. A [virtual network](../../virtual-network/virtual-networks-overview.md), or VNet, is similar to a traditional network that you'd operate on-premises. Like an Azure storage account or an Azure VM, a VNet is an Azure resource that is deployed in a resource group.

Azure Files and Azure File Sync support the following mechanisms to tunnel traffic between your on-premises servers and Azure:

- [Azure VPN Gateway](../../vpn-gateway/vpn-gateway-about-vpngateways.md): A VPN gateway is a specific type of virtual network gateway that is used to send encrypted traffic between an Azure virtual network and an alternate location (such as on-premises) over the internet. An Azure VPN Gateway is an Azure resource that can be deployed in a resource group along side of a storage account or other Azure resources. Because Azure File Sync is meant to be used with an on-premises Windows file server, you would normally use a [Site-to-Site (S2S) VPN](../../vpn-gateway/design.md#s2smulti), although it is technically possible to use a [Point-to-Site (P2S) VPN](../../vpn-gateway/point-to-site-about.md). 

    Site-to-Site (S2S) VPN connections connect your Azure virtual network and your organization's on-premises network. A S2S VPN connection enables you to configure a VPN connection once, for a VPN server or device hosted on your organization's network, rather than doing for every client device that needs to access your Azure file share. To simplify the deployment of a S2S VPN connection, see [Configure a Site-to-Site (S2S) VPN for use with Azure Files](../files/storage-files-configure-s2s-vpn.md?toc=/azure/storage/filesync/toc.json).

- [ExpressRoute](../../expressroute/expressroute-introduction.md), which enables you to create a defined route (private connection) between Azure and your on-premises network that doesn't traverse the internet. Because ExpressRoute provides a dedicated path between your on-premises datacenter and Azure, ExpressRoute may be useful when network performance is a key consideration. ExpressRoute is also a good option when your organization's policy or regulatory requirements require a deterministic path to your resources in the cloud.

### Private endpoints
In addition to the default public endpoints Azure Files and Azure File Sync provide through the storage account and Storage Sync Service, they provide the option to have one or more private endpoints per resource to privately and securely connect to Azure file shares from on-premises using VPN or ExpressRoute and from within an Azure VNet. When you create a private endpoint for an Azure resource, it gets a private IP address from within the address space of your virtual network, much like how your on-premises Windows file server has an IP address within the dedicated address space of your on-premises network.

> [!Important]  
> In order to use private endpoints on the Storage Sync Service resource, you must use Azure File Sync agent version 10.1 or greater. Agent versions prior to 10.1 do not support private endpoints on the Storage Sync Service. All prior agent versions support private endpoints on the storage account resource.

An individual private endpoint is associated with a specific Azure virtual network subnet. Storage accounts and Storage Sync Services may have private endpoints in more than one virtual network.

Using private endpoints enables you to:
- Securely connect to your Azure resources from on-premises networks using a VPN or ExpressRoute connection with private peering.
- Secure your Azure resources by disabling the public endpoints for Azure Files and File Sync. By default, creating a private endpoint does not block connections to the public endpoint.
- Increase security for the virtual network by enabling you to block exfiltration of data from the virtual network (and peering boundaries).

To create a private endpoint, see [Configuring private endpoints for Azure File Sync](file-sync-networking-endpoints.md).

### Private endpoints and DNS
When you create a private endpoint, by default we also create (or update an existing) private DNS zone corresponding to the `privatelink` subdomain. For public cloud regions, these DNS zones are `privatelink.file.core.windows.net` for Azure Files and `privatelink.afs.azure.net` for Azure File Sync.

> [!Note]  
> This article uses the storage account DNS suffix for the Azure Public regions, `core.windows.net`. This commentary also applies to Azure Sovereign clouds such as the Azure US Government cloud and the Microsoft Azure operated by 21Vianet cloud - just substitute the appropriate suffixes for your environment.

When you create private endpoints for a storage account and a Storage Sync Service, we create A records for them in their respective private DNS zones. We also update the public DNS entry such that the regular fully qualified domain names are CNAMEs for the relevant `privatelink` name. This enables the fully qualified domain names to point at the private endpoint IP address(es) when the requester is inside of the virtual network and to point at the public endpoint IP address(es) when the requester is outside of the virtual network.

For Azure Files, each private endpoint has a single fully qualified domain name, following the pattern `storageaccount.privatelink.file.core.windows.net`, mapped to one private IP address for the private endpoint. For Azure File Sync, each private endpoint has four fully qualified domain names, for the four different endpoints that Azure File Sync exposes: management, sync (primary), sync (secondary), and monitoring. The fully qualified domain names for these endpoints will normally follow the name of the Storage Sync Service unless the name contains non-ASCII characters. For example, if your Storage Sync Service name is `mysyncservice` in the West US 2 region, the equivalent endpoints would be `mysyncservicemanagement.westus2.afs.azure.net`, `mysyncservicesyncp.westus2.afs.azure.net`, `mysyncservicesyncs.westus2.afs.azure.net`, and `mysyncservicemonitoring.westus2.afs.azure.net`. Each private endpoint for a Storage Sync Service will contain 4 distinct IP addresses. 

Since your Azure private DNS zone is connected to the virtual network containing the private endpoint, you can observe the DNS configuration when by calling the `Resolve-DnsName` cmdlet from PowerShell in an Azure VM (alternately `nslookup` in Windows and Linux):

```powershell
Resolve-DnsName -Name "storageaccount.file.core.windows.net"
```

For this example, the storage account `storageaccount.file.core.windows.net` resolves to the private IP address of the private endpoint, which happens to be `192.168.0.4`.

```Output
Name                              Type   TTL   Section    NameHost
----                              ----   ---   -------    --------
storageaccount.file.core.windows. CNAME  29    Answer     csostoracct.privatelink.file.core.windows.net
net

Name       : storageaccount.privatelink.file.core.windows.net
QueryType  : A
TTL        : 1769
Section    : Answer
IP4Address : 192.168.0.4


Name                   : privatelink.file.core.windows.net
QueryType              : SOA
TTL                    : 269
Section                : Authority
NameAdministrator      : azureprivatedns-host.microsoft.com
SerialNumber           : 1
TimeToZoneRefresh      : 3600
TimeToZoneFailureRetry : 300
TimeToExpiration       : 2419200
DefaultTTL             : 300
```

If you run the same command from on-premises, you'll see that the same storage account name resolves to the public IP address of the storage account instead; `storageaccount.file.core.windows.net` is a CNAME record for `storageaccount.privatelink.file.core.windows.net`, which in turn is a CNAME record for the Azure storage cluster hosting the storage account:

```Output
Name                              Type   TTL   Section    NameHost
----                              ----   ---   -------    --------
storageaccount.file.core.windows. CNAME  60    Answer     storageaccount.privatelink.file.core.windows.net
net
storageaccount.privatelink.file.c CNAME  60    Answer     file.par20prdstr01a.store.core.windows.net
ore.windows.net

Name       : file.par20prdstr01a.store.core.windows.net
QueryType  : A
TTL        : 60
Section    : Answer
IP4Address : 52.239.194.40
```

This reflects the fact that the Azure Files and Azure File Sync can expose both their public endpoints and one or more private endpoints per resource. To ensure that the fully qualified domain names for your resources resolve to the private endpoints private IP addresses, you must change the configuration on your on-premises DNS servers. This can be accomplished in several ways:

- Modifying the hosts file on your clients to make the fully qualified domain names for your storage accounts and Storage Sync Services resolve to the desired private IP addresses. This is strongly discouraged for production environments, since you will need to make these changes to every client that needs to access your private endpoints. Changes to your private endpoints/resources (deletions, modifications, etc.) will not be automatically handled.
- Creating DNS zones on your on-premises servers for `privatelink.file.core.windows.net` and `privatelink.afs.azure.net` with A records for your Azure resources. This has the advantage that clients in your on-premises environment will be able to automatically resolve Azure resources without needing to configure each client, however this solution is similarly brittle to modifying the hosts file because changes are not reflected. Although this solution is brittle, it may be the best choice for some environments.
- Forward the `core.windows.net` and `afs.azure.net` zones from your on-premises DNS servers to your Azure private DNS zone. The Azure private DNS host can be reached through a special IP address (`168.63.129.16`) that is only accessible inside virtual networks that are linked to the Azure private DNS zone. To work around this limitation, you can run additional DNS servers within your virtual network that will forward `core.windows.net` and `afs.azure.net` to the equivalent Azure private DNS zones. To simplify this set up, we have provided PowerShell cmdlets that will auto-deploy DNS servers in your Azure virtual network and configure them as desired. To learn how to set up DNS forwarding, see [Configuring DNS with Azure Files](../files/storage-files-networking-dns.md?toc=/azure/storage/filesync/toc.json).

## Encryption in transit
Connections made from the Azure File Sync agent to your Azure file share or Storage Sync Service are always encrypted. Although Azure storage accounts have a setting to disable requiring encryption in transit for communications to Azure Files (and the other Azure storage services that are managed out of the storage account), disabling this setting will not affect Azure File Sync's encryption when communicating with the Azure Files. By default, all Azure storage accounts have encryption in transit enabled.

For more information about encryption in transit, see [requiring secure transfer in Azure storage](../common/storage-require-secure-transfer.md?toc=/azure/storage/files/toc.json).

## See also
- [Planning for an Azure File Sync deployment](file-sync-planning.md)
- [Deploy Azure File Sync](file-sync-deployment-guide.md)
