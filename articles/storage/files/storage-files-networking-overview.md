---
title: Azure Files networking considerations
description: An overview of networking options for Azure Files.
author: khdownie
ms.service: azure-file-storage
ms.topic: overview
ms.date: 05/23/2022
ms.author: kendownie
---

# Azure Files networking considerations
You can access your Azure file shares over the public internet accessible endpoint, over one or more private endpoints on your network(s), or by caching your Azure file share on-premises with Azure File Sync (SMB file shares only). This article focuses on how to configure Azure Files for direct access over public and/or private endpoints. To learn how to cache your Azure file share on-premises with Azure File Sync, see [Introduction to Azure File Sync](../file-sync/file-sync-introduction.md).

We recommend reading [Planning for an Azure Files deployment](storage-files-planning.md) prior to reading this conceptual guide.

Directly accessing the Azure file share often requires additional thought with respect to networking:

- SMB file shares communicate over port 445, which many organizations and internet service providers (ISPs) block for outbound (internet) traffic. This practice originates from legacy security guidance about deprecated and non-internet safe versions of the SMB protocol. Although SMB 3.x is an internet-safe protocol, organizational or ISP policies may not be possible to change. Therefore, mounting an SMB file share often requires additional networking configuration to use outside of Azure.

- NFS file shares rely on network-level authentication and are therefore only accessible via restricted networks. Using an NFS file share always requires some level of networking configuration.

Configuring public and private endpoints for Azure Files is done on the top-level management object for Azure Files, the Azure storage account. A storage account is a management construct that represents a shared pool of storage in which you can deploy multiple Azure file shares, as well as the storage resources for other Azure storage services, such as blob containers or queues. 

:::row:::
    :::column:::
        > [!VIDEO https://www.youtube-nocookie.com/embed/jd49W33DxkQ]
    :::column-end:::
    :::column:::
        This video is a guide and demo for how to securely expose Azure file shares directly to information workers and apps in five simple steps. The sections below provide links and additional context to the documentation referenced in the video.
   :::column-end:::
:::row-end:::

## Applies to
| File share type | SMB | NFS |
|-|:-:|:-:|
| Standard file shares (GPv2), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Standard file shares (GPv2), GRS/GZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Premium file shares (FileStorage), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |

## Secure transfer
By default, Azure storage accounts require secure transfer, regardless of whether data is accessed over the public or private endpoint. For Azure Files, the **require secure transfer** setting is enforced for all protocol access to the data stored on Azure file shares, including SMB, NFS, and FileREST. You can disable the **require secure transfer** setting to allow unencrypted traffic. In the Azure portal, you may also see this setting labeled as **require secure transfer for REST API operations**.

The SMB, NFS, and FileREST protocols have slightly different behavior with respect to the **require secure transfer** setting:

- When **require secure transfer** is enabled on a storage account, all SMB file shares in that storage account will require the SMB 3.x protocol with AES-128-CCM, AES-128-GCM, or AES-256-GCM encryption algorithms, depending on the available/required encryption negotiation between the SMB client and Azure Files. You can toggle which SMB encryption algorithms are allowed via the [SMB security settings](files-smb-protocol.md#smb-security-settings). Disabling the **require secure transfer** setting enables SMB 2.1 and SMB 3.x mounts without encryption.

- NFS file shares don't support an encryption mechanism, so in order to use the NFS protocol to access an Azure file share, you must disable **require secure transfer** for the storage account.

- When secure transfer is required, the FileREST protocol may only be used with HTTPS. FileREST is only supported on SMB file shares today.

## Public endpoint
The public endpoint for the Azure file shares within a storage account is an internet exposed endpoint. The public endpoint is the default endpoint for a storage account, however, it can be disabled if desired.

The SMB, NFS, and FileREST protocols can all use the public endpoint. However, each has slightly different rules for access:

- SMB file shares are accessible from anywhere in the world via the storage account's public endpoint with SMB 3.x with encryption. This means that authenticated requests, such as requests authorized by a user's logon identity, can originate securely from inside or outside of the Azure region. If SMB 2.1 or SMB 3.x without encryption is desired, two conditions must be met: 
    1. The storage account's **require secure transfer** setting must be disabled.
    2. The request must originate from inside of the Azure region. As previously mentioned, encrypted SMB requests are allowed from anywhere, inside or outside of the Azure region.

- NFS file shares are accessible from the storage account's public endpoint if and only if the storage account's public endpoint is restricted to specific virtual networks using *service endpoints*. See [public endpoint firewall settings](#public-endpoint-firewall-settings) for additional information on *service endpoints*.

- FileREST is accessible via the public endpoint. If secure transfer is required, only HTTPS requests are accepted. If secure transfer is disabled, HTTP requests are accepted by the public endpoint regardless of origin.

### Public endpoint firewall settings
The storage account firewall restricts access to the public endpoint for a storage account. Using the storage account firewall, you can restrict access to certain IP addresses/IP address ranges, to specific virtual networks, or disable the public endpoint entirely.

When you restrict the traffic of the public endpoint to one or more virtual networks, you are using a capability of the virtual network called *service endpoints*. Requests directed to the service endpoint of Azure Files are still going to the storage account public IP address; however, the networking layer is doing additional verification of the request to validate that it is coming from an authorized virtual network. The SMB, NFS, and FileREST protocols all support service endpoints. Unlike SMB and FileREST, however, NFS file shares can only be accessed with the public endpoint through use of a *service endpoint*.

To learn more about how to configure the storage account firewall, see [configure Azure storage firewalls and virtual networks](storage-files-networking-endpoints.md#restrict-access-to-the-public-endpoint-to-specific-virtual-networks).

### Public endpoint network routing
Azure Files supports multiple network routing options. The default option, Microsoft routing, works with all Azure Files configurations. The internet routing option does not support AD domain join scenarios or Azure File Sync.

## Private endpoints
In addition to the default public endpoint for a storage account, Azure Files provides the option to have one or more private endpoints. A private endpoint is an endpoint that is only accessible within an Azure virtual network. When you create a private endpoint for your storage account, your storage account gets a private IP address from within the address space of your virtual network, much like how an on-premises file server or NAS device receives an IP address within the dedicated address space of your on-premises network. 

An individual private endpoint is associated with a specific Azure virtual network subnet. A storage account may have private endpoints in more than one virtual network.

Using private endpoints with Azure Files enables you to:
- Securely connect to your Azure file shares from on-premises networks using a VPN or ExpressRoute connection with private-peering.
- Secure your Azure file shares by configuring the storage account firewall to block all connections on the public endpoint. By default, creating a private endpoint does not block connections to the public endpoint.
- Increase security for the virtual network by enabling you to block exfiltration of data from the virtual network (and peering boundaries).

To create a private endpoint, see [Configuring private endpoints for Azure Files](storage-files-networking-endpoints.md#create-a-private-endpoint).

### Tunneling traffic over a virtual private network or ExpressRoute
To use private endpoints to access SMB or NFS file shares from on-premises, you must establish a network tunnel between your on-premises network and Azure. A [virtual network](../../virtual-network/virtual-networks-overview.md), or VNet, is similar to a traditional on-premises network. Like an Azure storage account or an Azure VM, a VNet is an Azure resource that is deployed in a resource group. 

Azure Files supports the following mechanisms to tunnel traffic between your on-premises workstations and servers and Azure SMB/NFS file shares:

- [Azure VPN Gateway](../../vpn-gateway/vpn-gateway-about-vpngateways.md): A VPN gateway is a specific type of virtual network gateway that is used to send encrypted traffic between an Azure virtual network and an alternate location (such as on-premises) over the internet. An Azure VPN Gateway is an Azure resource that can be deployed in a resource group alongside of a storage account or other Azure resources. VPN gateways expose two different types of connections:
    - [Point-to-Site (P2S) VPN](../../vpn-gateway/point-to-site-about.md) gateway connections, which are VPN connections between Azure and an individual client. This solution is primarily useful for devices that are not part of your organization's on-premises network. A common use case is for telecommuters who want to be able to mount their Azure file share from home, a coffee shop, or hotel while on the road. To use a P2S VPN connection with Azure Files, you'll need to configure a P2S VPN connection for each client that wants to connect. To simplify the deployment of a P2S VPN connection, see [Configure a Point-to-Site (P2S) VPN on Windows for use with Azure Files](storage-files-configure-p2s-vpn-windows.md) and [Configure a Point-to-Site (P2S) VPN on Linux for use with Azure Files](storage-files-configure-p2s-vpn-linux.md).
    - [Site-to-Site (S2S) VPN](../../vpn-gateway/design.md#s2smulti), which are VPN connections between Azure and your organization's network. A S2S VPN connection enables you to configure a VPN connection once for a VPN server or device hosted on your organization's network, rather than configuring a connection for every client device that needs to access your Azure file share. To simplify the deployment of a S2S VPN connection, see [Configure a Site-to-Site (S2S) VPN for use with Azure Files](storage-files-configure-s2s-vpn.md).
- [ExpressRoute](../../expressroute/expressroute-introduction.md), which enables you to create a defined route between Azure and your on-premises network that doesn't traverse the internet. Because ExpressRoute provides a dedicated path between your on-premises datacenter and Azure, ExpressRoute may be useful when network performance is a consideration. ExpressRoute is also a good option when your organization's policy or regulatory requirements require a deterministic path to your resources in the cloud.

> [!Note]  
> Although we recommend using private endpoints to assist in extending your on-premises network into Azure, it is technically possible to route to the public endpoint over the VPN connection. However, this requires hard-coding the IP address for the public endpoint for the Azure storage cluster that serves your storage account. Because storage accounts may be moved between storage clusters at any time and new clusters are frequently added and removed, this requires regularly hard-coding all the possible Azure storage IP addresses into your routing rules.

### DNS configuration
When you create a private endpoint, by default we also create a (or update an existing) private DNS zone corresponding to the `privatelink` subdomain. Strictly speaking, creating a private DNS zone is not required to use a private endpoint for your storage account. However, it is highly recommended in general and explicitly required when mounting your Azure file share with an Active Directory user principal or accessing it from the FileREST API.

> [!Note]  
> This article uses the storage account DNS suffix for the Azure Public regions, `core.windows.net`. This commentary also applies to Azure Sovereign clouds such as the Azure US Government cloud and the Microsoft Azure operated by 21Vianet cloud - just substitute the appropriate suffixes for your environment. 

In your private DNS zone, we create an A record for `storageaccount.privatelink.file.core.windows.net` and a CNAME record for the regular name of the storage account, which follows the pattern `storageaccount.file.core.windows.net`. Because your Azure private DNS zone is connected to the virtual network containing the private endpoint, you can observe the DNS configuration by calling the `Resolve-DnsName` cmdlet from PowerShell in an Azure VM (alternately `nslookup` in Windows and Linux):

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

This reflects the fact that the storage account can expose both the public endpoint and one or more private endpoints. To ensure that the storage account name resolves to the private endpoint's private IP address, you must change the configuration on your on-premises DNS servers. This can be accomplished in several ways:

- Modifying the *hosts* file on your clients to make `storageaccount.file.core.windows.net` resolve to the desired private endpoint's private IP address. This is strongly discouraged for production environments, because you will need to make these changes to every client that wants to mount your Azure file shares, and changes to the storage account or private endpoint will not be automatically handled.
- Creating an A record for `storageaccount.file.core.windows.net` in your on-premises DNS servers. This has the advantage that clients in your on-premises environment will be able to automatically resolve the storage account without needing to configure each client. However, this solution is similarly brittle to modifying the *hosts* file because changes are not reflected. Although this solution is brittle, it may be the best choice for some environments.
- Forward the `core.windows.net` zone from your on-premises DNS servers to your Azure private DNS zone. The Azure private DNS host can be reached through a special IP address (`168.63.129.16`) that is only accessible inside virtual networks that are linked to the Azure private DNS zone. To work around this limitation, you can run additional DNS servers within your virtual network that will forward `core.windows.net` on to the Azure private DNS zone. To simplify this set up, we have provided PowerShell cmdlets that will auto-deploy DNS servers in your Azure virtual network and configure them as desired. To learn how to set up DNS forwarding, see [Configuring DNS with Azure Files](storage-files-networking-dns.md).

## SMB over QUIC
Windows Server 2022 Azure Edition supports a new transport protocol called QUIC for the SMB server provided by the File Server role. QUIC is a replacement for TCP that is built on top of UDP, providing numerous advantages over TCP while still providing a reliable transport mechanism. One key advantage for the SMB protocol is that instead of using port 445, all transport is done over port 443, which is widely open outbound to support HTTPS. This effectively means that SMB over QUIC offers an "SMB VPN" for file sharing over the public internet. Windows 11 ships with an SMB over QUIC capable client.

At this time, Azure Files doesn't directly support SMB over QUIC. However, you can get access to Azure file shares via Azure File Sync running on Windows Server as in the diagram below. This also gives you the option to have Azure File Sync caches both on-premises or in different Azure datacenters to provide local caches for a distributed workforce. To learn more about this option, see [Deploy Azure File Sync](../file-sync/file-sync-deployment-guide.md) and [SMB over QUIC](/windows-server/storage/file-server/smb-over-quic).

:::image type="content" source="media/storage-files-networking-overview/smb-over-quic.png" alt-text="Diagram for creating a lightweight cache of your Azure file shares on a Windows Server 2022 Azure Edition V M using Azure File Sync." border="false":::

## See also
- [Azure Files overview](storage-files-introduction.md)
- [Planning for an Azure Files deployment](storage-files-planning.md)
