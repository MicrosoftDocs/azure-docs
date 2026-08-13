---
title: Networking Considerations for Azure Files
description: An overview of networking considerations and options for Azure Files, including secure transfer, public and private endpoints, VPN, ExpressRoute, DNS, and firewall settings.
author: khdownie
ms.service: azure-file-storage
ms.topic: overview
ms.date: 04/16/2026
ms.author: kendownie
# Customer intent: As a network administrator, I want to configure secure access to Azure Files, so that I can manage file share access in accordance with my organization’s networking and security policies.
---

# Azure Files networking considerations

:heavy_check_mark: **Applies to:** All Azure file shares

You can access your Azure file shares over the public internet accessible endpoint, over one or more private endpoints on your network(s), or by caching your Azure file share on-premises with Azure File Sync (SMB file shares only). This article focuses on how to configure Azure Files for direct access over public and/or private endpoints. To learn how to cache your Azure file share on-premises with Azure File Sync, see [Introduction to Azure File Sync](../file-sync/file-sync-introduction.md).

Read [Planning for an Azure Files deployment](storage-files-planning.md) before reading this guide.

Directly accessing an Azure file share often requires additional thought with respect to networking:

- SMB file shares communicate over port 445, which many organizations and internet service providers (ISPs) block for outbound (internet) traffic. This practice originates from legacy security guidance about deprecated and non-internet safe versions of the SMB protocol. Although SMB 3.x is an internet-safe protocol, organizational or ISP policies may not be possible to change. Therefore, mounting an SMB file share often requires additional networking configuration to use outside of Azure.

- NFS file shares rely on network-level authentication and are therefore only accessible via restricted networks. Using an NFS file share always requires some level of networking configuration.

You configure public and private endpoints for Azure Files on the top-level management object for Azure Files: the Azure storage account. A storage account is a management construct that represents a shared pool of storage in which you can deploy multiple Azure file shares, as well as the storage resources for other Azure storage services, such as blob containers or queues.

:::row:::
    :::column:::
        > [!VIDEO https://www.youtube-nocookie.com/embed/jd49W33DxkQ]
    :::column-end:::
    :::column:::
        This video is a guide and demo for how to securely expose Azure file shares directly to information workers and apps in five simple steps. The sections below provide links and additional context to the documentation referenced in the video. Azure Active Directory is now Microsoft Entra ID. For more information, see [New name for Azure AD](https://aka.ms/azureadnewname).
   :::column-end:::
:::row-end:::

## Secure transfer

By default, Azure storage accounts require secure transfer, regardless of whether data is accessed over the public or private endpoint. For Azure Files, encryption in transit is controlled at the protocol level:

| Protocol | Setting name | Default (Azure portal) | Default (PowerShell / CLI / API) |
|---|---|---|---|
| SMB | **Require Encryption in Transit for SMB** | Enabled | Not selected |
| NFS | **Require Encryption in Transit for NFS** | Enabled | Not selected |
| FileREST | **Secure transfer required** | Enabled | Enabled |

### Encryption in Transit for SMB

The **Require Encryption in Transit for SMB** setting controls whether encryption is required for SMB access. For new storage accounts created by using the Azure portal, this setting is enabled by default. Storage accounts created by using Azure PowerShell, Azure CLI, or the FileREST API set this value as **Not selected** to ensure backward compatibility. For existing storage accounts, the **Secure transfer required** setting continues to govern SMB encryption behavior until you explicitly configure the per-protocol SMB setting. When SMB encryption in transit is required, all SMB file shares in that storage account require the SMB 3.x protocol with AES-128-CCM, AES-128-GCM, or AES-256-GCM encryption algorithms. You can toggle which algorithms are allowed via the [SMB security settings](files-smb-protocol.md#smb-security-settings). Disabling this setting enables SMB 2.1 and SMB 3.x mounts without encryption.

### Encryption in Transit for NFS

The **Require Encryption in Transit for NFS** setting controls whether encryption is required for NFS access. NFS Azure file shares use the AZNFS utility package to simplify encrypted mounts by installing and setting up Stunnel (an open-source TLS wrapper) on the client. See [Encryption in transit for NFS Azure file shares](encryption-in-transit-for-nfs-shares.md). For new storage accounts created by using the Azure portal, this setting is enabled by default. Storage accounts created by using Azure PowerShell, Azure CLI, or the FileREST API set this value as **Not selected** to ensure backward compatibility. For existing storage accounts, the **Secure transfer required** setting continues to govern NFS encryption behavior until you explicitly configure the per-protocol NFS setting.

### Encryption in Transit for FileREST

The **Secure transfer required** setting applies to REST/HTTPS traffic. When enabled, the FileREST protocol may only be used with HTTPS.

> [!NOTE]
> Communication between a client and an Azure storage account is encrypted using Transport Layer Security (TLS). Azure Files relies on a Windows implementation of SSL that isn't based on OpenSSL and therefore isn't exposed to OpenSSL related vulnerabilities. Users who prefer to maintain flexibility between TLS and non-TLS connections on the same storage account should explicitly disable the **Require Encryption in Transit for SMB** or **Require Encryption in Transit for NFS** per-protocol setting, as appropriate.

## Public endpoint

The public endpoint for the Azure file shares within a storage account is an internet exposed endpoint. The public endpoint is the default endpoint for a storage account, however, it can be disabled if desired.

The SMB, NFS, and FileREST protocols can all use the public endpoint. However, each has slightly different rules for access:

- SMB file shares are accessible from anywhere in the world via the storage account's public endpoint with SMB 3.x with encryption. This means that authenticated requests, such as requests authorized by a user's logon identity, can originate securely from inside or outside of the Azure region. If SMB 2.1 or SMB 3.x without encryption is desired, two conditions must be met:
    1. The **Require Encryption in Transit for SMB** setting must be disabled (or, for existing accounts where this setting hasn't been explicitly configured, the **Secure transfer required** setting must be disabled).
    2. The request must originate from inside of the Azure region. As previously mentioned, encrypted SMB requests are allowed from anywhere, inside or outside of the Azure region.

- NFS file shares are accessible from the storage account's public endpoint if and only if the storage account's public endpoint is restricted to specific virtual networks using *service endpoints*. See [public endpoint firewall settings](#public-endpoint-firewall-settings) for additional information on *service endpoints*.

- FileREST is accessible via the public endpoint. If secure transfer is required, only HTTPS requests are accepted. If secure transfer is disabled, HTTP requests are accepted by the public endpoint regardless of origin.

### Public endpoint firewall settings

The storage account firewall restricts access to the public endpoint for a storage account. You can restrict access to certain IP addresses or IP address ranges, to specific virtual networks, or disable the public endpoint entirely.

When you [restrict the public endpoint to one or more networks](storage-files-networking-endpoints.md#restrict-access-to-the-public-endpoint-to-specific-networks), you're using a capability of the virtual network called *service endpoints*. Requests directed to the service endpoint of Azure Files still go to the storage account public IP address. However, the networking layer performs extra verification of the request to validate that it's coming from an authorized virtual network. The SMB, NFS, and FileREST protocols all support service endpoints. Unlike SMB and FileREST, however, NFS file shares can only be accessed by using the public endpoint through use of a *service endpoint*.

#### Azure portal access and the storage account firewall

When you access Azure file shares through the Azure portal, two separate requests occur:

1. A request from your browser to the Azure portal UI (`https://portal.azure.com`).
2. A request from your browser directly to the Azure Files data-plane endpoint (for example, `https://<storage-account-name>.file.core.windows.net`), typically using a SAS token issued for the portal experience.

The storage account firewall evaluates only the direct request to the Azure Files data-plane endpoint, not the request to `portal.azure.com`. Therefore, even if you can access the Azure portal without issues, you might receive a **403 (Forbidden)** error when browsing file share data if the public egress IP address on the browser-to-storage request isn't allowed by the firewall. This restriction applies only to FileREST/HTTPS traffic, not SMB or NFS. For more information, see [Authorize access to file data in the Azure portal](authorize-data-operations-portal.md).

> [!NOTE]
> Due to factors such as proxies, VPNs, NAT, or differences in network routing, the IP address shown in an error message might not match the actual source IP address as seen by the storage account. To verify the source IP address that's actually reaching the storage account, enable **Azure Monitor diagnostic settings** for the storage account and collect **storage resource logs**. Then review the relevant file service request entries and check the **CallerIpAddress** field to confirm which IP address reached the storage account.

### Public endpoint network routing

Azure Files supports two network routing options:

- **Microsoft routing** (default): Traffic between the client and the storage account travels over the Microsoft global network backbone for as long as possible before egressing to the internet. This option works with all Azure Files configurations, including Active Directory (AD) domain join scenarios and Azure File Sync.
- **Internet routing**: Traffic is routed over the public internet as early as possible. This option doesn't support Active Directory (AD) domain join scenarios or Azure File Sync.

## Private endpoints

In addition to the default public endpoint for a storage account, Azure Files provides the option to have one or more private endpoints. A private endpoint is an endpoint that is only accessible within an Azure virtual network. When you create a private endpoint for your storage account, your storage account gets a private IP address from within the address space of your virtual network, much like how an on-premises file server or NAS device receives an IP address within the dedicated address space of your on-premises network.

An individual private endpoint is associated with a specific Azure virtual network subnet. A storage account may have private endpoints in more than one virtual network.

Using private endpoints with Azure Files enables you to:

- Securely connect to your Azure file shares from on-premises networks using a VPN or ExpressRoute connection with private-peering.
- Secure your Azure file shares by configuring the storage account firewall to block all connections on the public endpoint. By default, creating a private endpoint doesn't block connections to the public endpoint.
- Increase security for the virtual network by enabling you to block exfiltration of data from the virtual network (and peering boundaries).

To create a private endpoint, see [Configuring private endpoints for Azure Files](storage-files-networking-endpoints.md#create-a-private-endpoint).

### Tunneling traffic over a virtual private network or ExpressRoute

To use private endpoints to access SMB or NFS file shares from on-premises, you must establish a network tunnel between your on-premises network and Azure. A [virtual network](../../virtual-network/virtual-networks-overview.md) is similar to a traditional on-premises network. Like an Azure storage account or an Azure VM, a virtual network is an Azure resource that you deploy in a resource group. 

Azure Files supports the following mechanisms to tunnel traffic between your on-premises workstations and servers and Azure SMB/NFS file shares:

#### Point-to-site VPN

[Azure VPN Gateway](../../vpn-gateway/vpn-gateway-about-vpngateways.md) supports [point-to-site VPN](../../vpn-gateway/point-to-site-about.md) connections, which are VPN connections between Azure and an individual client. This solution is primarily useful for devices that aren't part of your organization's on-premises network. A common use case is for telecommuters who want to be able to mount their Azure file share from home, a coffee shop, or hotel while on the road. To use a point-to-site VPN connection with Azure Files, you need to configure a Point-to-Site VPN connection for each client that wants to connect. See [Configure a Point-to-Site VPN on Windows for use with Azure Files](storage-files-configure-p2s-vpn-windows.md) and [Configure a Point-to-Site VPN on Linux for use with Azure Files](storage-files-configure-p2s-vpn-linux.md).

#### Site-to-site VPN

[Azure VPN Gateway](../../vpn-gateway/vpn-gateway-about-vpngateways.md) also supports [site-to-site VPN](../../vpn-gateway/design.md#s2smulti) connections, which are VPN connections between Azure and your organization's network. A site-to-site VPN connection enables you to configure a VPN connection once for a VPN server or device hosted on your organization's network, rather than configuring a connection for every client device that needs to access your Azure file share. See [Configure a Site-to-Site VPN for use with Azure Files](storage-files-configure-s2s-vpn.md).

#### ExpressRoute

[ExpressRoute](../../expressroute/expressroute-introduction.md) enables you to create a defined route between Azure and your on-premises network that doesn't traverse the internet. Because ExpressRoute provides a dedicated path between your on-premises datacenter and Azure, ExpressRoute can be useful when network performance is a consideration. ExpressRoute is also a good option when your organization's policy or regulatory requirements require a deterministic path to your resources in the cloud.

> [!NOTE]
> Although Microsoft recommends using private endpoints to assist in extending your on-premises network into Azure, it's technically possible to route to the public endpoint over the VPN connection. However, this method requires hard-coding the IP address for the public endpoint for the Azure storage cluster that serves your storage account. Because storage accounts might be moved between storage clusters at any time and new clusters are frequently added and removed, this method requires regularly hard-coding all the possible Azure storage IP addresses into your routing rules.

### DNS configuration

When you create a private endpoint, Azure also creates or updates a private DNS zone corresponding to the `privatelink` subdomain. Strictly speaking, creating a private DNS zone isn't required to use a private endpoint for your storage account. However, it's highly recommended, and it's explicitly required when mounting your Azure file share with an Active Directory user principal or accessing it from the FileREST API.

> [!NOTE]
> This article uses the storage account DNS suffix for the Azure Public regions, `core.windows.net`. This commentary also applies to Azure Sovereign clouds such as the Azure US Government cloud and the Microsoft Azure operated by 21Vianet cloud - just substitute the appropriate suffixes for your environment.

In your private DNS zone, Azure creates an A record for `storageaccount.privatelink.file.core.windows.net` and a CNAME record for the regular name of the storage account, which follows the pattern `storageaccount.file.core.windows.net`. Because your Azure private DNS zone is connected to the virtual network containing the private endpoint, you can observe the DNS configuration by calling the [`Resolve-DnsName`](/powershell/module/dnsclient/resolve-dnsname) cmdlet from PowerShell in an Azure VM (alternately `nslookup` in Windows and Linux):

```powershell
Resolve-DnsName -Name "storageaccount.file.core.windows.net"
```

In this example, the storage account `storageaccount.file.core.windows.net` resolves to the private IP address of the private endpoint, which happens to be `192.168.0.4`.

```Output
Name                              Type   TTL   Section    NameHost
----                              ----   ---   -------    --------
storageaccount.file.core.windows. CNAME  29    Answer     storageaccount.privatelink.file.core.windows.net
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

If you run the same command from on-premises, you'll see that the same storage account name resolves to the public IP address of the storage account instead. For example, `storageaccount.file.core.windows.net` is a CNAME record for `storageaccount.privatelink.file.core.windows.net`, which in turn is a CNAME record for the Azure storage cluster hosting the storage account:

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

This configuration reflects that the storage account can expose both the public endpoint and one or more private endpoints. To ensure that the storage account name resolves to the private endpoint's private IP address, you must change the configuration on your on-premises DNS servers. You can do this in several ways:

- Modifying the *hosts* file on your clients to make `storageaccount.file.core.windows.net` resolve to the desired private endpoint's private IP address. This is strongly discouraged for production environments, because you'll need to make these changes to every client that wants to mount your Azure file shares, and changes to the storage account or private endpoint won't be automatically handled.
- Creating an A record for `storageaccount.file.core.windows.net` in your on-premises DNS servers. This has the advantage that clients in your on-premises environment will be able to automatically resolve the storage account without needing to configure each client. However, this solution is similarly brittle to modifying the *hosts* file because changes aren't reflected. Although this solution is brittle, it might be the best choice for some environments.
- Forward the `core.windows.net` zone from your on-premises DNS servers to your Azure private DNS zone. The Azure private DNS host can be reached through a special IP address (`168.63.129.16`) that is only accessible inside virtual networks that are linked to the Azure private DNS zone. To work around this limitation, you can run additional DNS servers within your virtual network that forward `core.windows.net` on to the Azure private DNS zone. To simplify this setup, Microsoft provides PowerShell cmdlets that auto-deploy DNS servers in your Azure virtual network and configure them as desired. To learn how to set up DNS forwarding, see [Configuring DNS with Azure Files](storage-files-networking-dns.md).

## SMB over QUIC

Windows Server 2022 Azure Edition supports a transport protocol called QUIC for the SMB server provided by the File Server role. QUIC is a replacement for TCP that's built on top of UDP, providing numerous advantages over TCP while still providing a reliable transport mechanism. One key advantage for the SMB protocol is that instead of using port 445, all transport is done over port 443, which is widely open outbound to support HTTPS. This configuration effectively means that SMB over QUIC offers an "SMB VPN" for file sharing over the public internet. Windows 11 ships with an SMB over QUIC capable client.

Currently, Azure Files doesn't support SMB over QUIC. However, you can get access to Azure file shares via Azure File Sync running on Windows Server as in the diagram following. This configuration also gives you the option to have Azure File Sync caches both on-premises or in different Azure datacenters to provide local caches for a distributed workforce. To learn more about this option, see [the Windows Server documentation](/windows-server/storage/file-server/smb-over-quic). For Azure File Sync-specific networking details, see [SMB over QUIC](../file-sync/file-sync-networking-overview.md#smb-over-quic).

:::image type="content" source="media/storage-files-networking-overview/smb-over-quic.png" alt-text="Diagram for creating a lightweight cache of your Azure file shares on a Windows Server 2022 Azure Edition VM using Azure File Sync." border="false":::

## See also

- [Azure Files overview](storage-files-introduction.md)
- [Plan for an Azure Files deployment](storage-files-planning.md)
