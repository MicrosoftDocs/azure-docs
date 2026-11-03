---
title: Networking considerations for Azure Files
description: An overview of networking considerations and options for Azure Files, including encryption in transit, public and private endpoints, network security perimeters, VPN, ExpressRoute, DNS, and firewall settings.
author: khdownie
ms.service: azure-file-storage
ms.topic: overview
ms.date: 10/22/2026
ms.author: kendownie
---

# Azure Files networking considerations
:heavy_check_mark: **Applies to:** All Azure file shares

This article describes the networking decisions to make before you deploy Azure Files: how to protect data in transit, how clients connect to a file share, and how to control inbound and outbound access. For configuration steps, see [Configure network endpoints for Azure file shares](storage-files-networking-endpoints.md). For other deployment decisions, see [Plan an Azure Files deployment](storage-files-planning.md).

The available options depend on the resource provider that you use to create the file share, and on the protocol that clients use. Classic file shares (Microsoft.Storage) support SMB, NFS, and FileREST. File shares created with Microsoft.FileShares support NFS only. For other differences between the resource providers, see [Azure Files management concepts](files-management-concepts.md).

The following table shows how clients can reach a file share, by client location and protocol:

| Client location | SMB | NFS | FileREST |
|---|---|---|---|
| Azure virtual network | Public endpoint or private endpoint | Public endpoint through a service endpoint, or private endpoint | Public endpoint or private endpoint |
| On-premises, with VPN or ExpressRoute private peering | Private endpoint | Private endpoint | Private endpoint |
| On-premises or internet, without VPN or ExpressRoute private peering | Public endpoint | Not supported | Public endpoint |

- SMB communicates over TCP port 445. Some organizations and internet service providers block outbound traffic on this port. Clients that can't use port 445 can connect through a VPN or ExpressRoute, or use [SMB over QUIC](#connect-from-on-premises) through Azure File Sync.
- NFS uses network-based authentication, so it doesn't support access from internet clients.

:::row:::
    :::column:::
        > [!VIDEO https://www.youtube-nocookie.com/embed/jd49W33DxkQ]
    :::column-end:::
    :::column:::
        This video shows networking for classic file shares. This article also describes Microsoft.FileShares where applicable.
    :::column-end:::
:::row-end:::

## Encryption in transit
Encryption in transit protects data between clients and Azure Files from interception and modification, including by a man-in-the-middle attacker. It applies to traffic through both public and private endpoints.

- **SMB**: SMB 3.x protects data through SMB channel encryption. Azure Files supports AES-128-CCM with SMB 3.0, and AES-128-GCM and AES-256-GCM with SMB 3.1.1. The client and the service negotiate the algorithm from the algorithms that both allow. SMB 2.1 doesn't support channel encryption. If you restrict the allowed algorithms, some clients can't connect. For example, older Windows clients don't support AES-256-GCM.
- **NFS**: NFS file shares with either resource provider support encryption in transit through a TLS tunnel. The [AzNFS mount helper](https://github.com/Azure/AZNFS-mount) uses stunnel to carry NFS traffic through a TLS 1.2 or TLS 1.3 connection, and validates the server's certificate. Applications use the NFS protocol without changes. TLS doesn't add user-based authentication to NFS.
- **FileREST**: FileREST protects data in transit through HTTPS, with TLS 1.2 or TLS 1.3. New storage accounts require HTTPS by default and reject unencrypted HTTP requests. Keep this requirement enabled. You can also set a minimum TLS version.

Encryption requirements and defaults depend on the resource provider. To view and change them, see:

- **Classic file shares**: [Configure encryption in transit for Azure Files](files-encryption-in-transit.md). To restrict SMB encryption algorithms, see [SMB security settings](files-smb-protocol.md#smb-security-settings). To mount an NFS file share with encryption, see [Mount a classic NFS share by using the AzNFS mount helper](storage-files-how-to-mount-nfs-shares.md#mount-a-classic-nfs-share-by-using-the-aznfs-mount-helper).
- **Microsoft.FileShares**: [Encryption requirements when creating a file share](create-file-share.md#advanced) and [Update file share properties with PowerShell or Azure CLI](modify-file-share.md#change-the-cost-and-performance-characteristics-of-a-file-share-microsoftfileshares).

## Connection paths
A client reaches a file share through the public endpoint or through a private endpoint. Both endpoints use the same host name. [DNS resolution](#dns-resolution) determines which endpoint a client uses.

### Public endpoint
A public endpoint has a public IP address. A public address doesn't imply unrestricted access: protocol requirements, [inbound access controls](#inbound-access-control), and authorization determine whether a request is allowed.

Each protocol has its own limits on public endpoint access, separate from the network rules that you configure:

- **SMB**: Encrypted SMB 3.x connections can come from clients inside or outside Azure. Azure Files limits them only through authentication and authorization. Unencrypted SMB connections are limited to clients in the same Azure region and require a configuration that permits unencrypted access. Clients in that region outside your virtual networks can also connect. If you permit unencrypted SMB, restrict the public endpoint by using [network rules](#network-rules).
- **NFS**: Clients can only access the public endpoint through a [service endpoint](#service-endpoints). The file share's network rules must allow the client subnet. NFS doesn't support direct access from internet clients.
- **FileREST**: Requests can come from clients inside or outside Azure. Azure Files limits them only through authentication and authorization. By default, Azure Files also rejects unencrypted HTTP requests.

#### Service endpoints
A service endpoint lets clients in a virtual network subnet use the public endpoint when network rules restrict it to selected subnets. Traffic from the subnet goes to Azure Files over the Azure backbone, but it still uses the public endpoint's IP address. The networking layer identifies the source subnet of this traffic, so Azure Files can check the subnet against the network rules. To allow a subnet, add a [virtual network rule](#virtual-network-rules) for it.

#### Public endpoint network routing
Routing preference is available only for classic HDD file shares that use the pay-as-you-go billing model in `StorageV2` storage accounts. It isn't supported for provisioned file shares in `FileStorage` storage accounts or for Microsoft.FileShares.

For these pay-as-you-go accounts, [routing preference](../../virtual-network/ip-services/routing-preference-overview.md) determines how internet traffic reaches the public endpoint:

- **Microsoft routing** (default): Traffic between the client and the storage account travels over the Microsoft global network backbone for as long as possible before it goes to the internet. This option supports Active Directory (AD) domain join scenarios and Azure File Sync.
- **Internet routing**: Traffic goes over the public internet as early as possible. This option doesn't support AD domain join scenarios or Azure File Sync.

> [!IMPORTANT]
> Don't use internet routing for Azure Files. Keep the default, Microsoft routing. Routing preference is a storage account setting. It's available because `StorageV2` storage accounts also hold blobs, queues, and tables, which share the setting.

To check or change the routing preference, see [Configure routing preference](storage-files-networking-endpoints.md#configure-routing-preference).

### Private endpoints
A private endpoint gives the resource (a storage account or a Microsoft.FileShares file share) a private IP address in a subnet of your virtual network. Clients can reach that address from the same virtual network, from peered virtual networks, and from on-premises networks that connect to the virtual network through a VPN or ExpressRoute. To give access from more virtual networks, you can create more than one private endpoint for the same resource.

The public endpoint stays available after you create a private endpoint. To allow access only through private endpoints, disable [public network access](#public-network-access). A private endpoint also doesn't limit where clients can send traffic. For those controls, see [Outbound access control](#outbound-access-control).

To create a private endpoint, see [Create a private endpoint](storage-files-networking-endpoints.md#create-a-private-endpoint).

### Connect from on-premises
On-premises clients can reach a private endpoint through a VPN or ExpressRoute private peering connection. This approach applies to both SMB and NFS. SMB and FileREST clients can also reach the public endpoint over the internet or ExpressRoute Microsoft peering. If network rules restrict the public endpoint, add an [IP address rule](#ip-address-rules) for the clients' public IP addresses.

For SMB, a connection to the public endpoint often doesn't work from on-premises networks. This limitation exists because SMB uses TCP port 445, and many organizations and internet service providers block outbound traffic on this port. A VPN or ExpressRoute connection carries SMB traffic to the private endpoint inside the connection, so the block doesn't apply. For on-premises SMB clients, plan for a private endpoint with a VPN or ExpressRoute connection, unless you confirm that your network allows outbound TCP port 445 to Azure.

The following options connect on-premises clients to Azure:

- **Point-to-site VPN**: Connects an individual client to an Azure virtual network. It supports remote users and devices that aren't connected through an organization's site network. For setup steps, see [Configure server settings for P2S VPN Gateway certificate authentication](../../vpn-gateway/point-to-site-certificate-gateway.md?toc=/azure/storage/files/toc.json).
- **Site-to-site VPN**: Connects an organization's network to an Azure virtual network through a VPN gateway. Clients on the connected network share that connection. For setup steps, see [Tutorial: Create a site-to-site VPN connection in the Azure portal](../../vpn-gateway/tutorial-site-to-site-portal.md?toc=/azure/storage/files/toc.json).
- **ExpressRoute**: Private peering connects an on-premises network to Azure virtual networks without going over the public internet. ExpressRoute doesn't encrypt traffic by default. Use [encryption in transit](#encryption-in-transit) to protect file data on the connection. For connectivity options, see [What is Azure ExpressRoute?](../../expressroute/expressroute-introduction.md?toc=/azure/storage/files/toc.json).
- **SMB over QUIC**: Carries SMB traffic over UDP port 443, so it works when TCP port 445 is blocked. Azure Files doesn't support SMB over QUIC directly. Clients connect to a Windows Server cache of a classic SMB file share, and Azure File Sync keeps the cache in sync with the file share. The cache can be on-premises or in Azure. The cache server provides the QUIC endpoint, and clients need SMB over QUIC support. For more information, see [SMB over QUIC](/windows-server/storage/file-server/smb-over-quic) in the Windows Server documentation and [SMB over QUIC](../file-sync/file-sync-networking-overview.md#smb-over-quic) for Azure File Sync.

  The following diagram shows SMB over QUIC with an Azure File Sync cache:

  :::image type="content" source="media/storage-files-networking-overview/smb-over-quic.png" alt-text="Diagram for creating a lightweight cache of your Azure file shares on a Windows Server 2022 Azure Edition VM using Azure File Sync." border="false":::

To set up access for on-premises clients through a private endpoint, follow these steps:

1. Create a private endpoint for the file share. See [Create a private endpoint](storage-files-networking-endpoints.md#create-a-private-endpoint).
2. Connect the on-premises network or client to the private endpoint's virtual network with one of the options in the previous list.
3. Configure DNS so that on-premises clients resolve the file share's host name to the private endpoint's IP address. See [Configure DNS forwarding for Azure Files](storage-files-networking-dns.md). Point-to-site clients might not use your on-premises DNS servers. For those clients, add the DNS forwarder or resolver as a custom DNS server in the VPN client. See [Azure VPN Client optional settings](../../vpn-gateway/azure-vpn-client-optional-configurations.md).
4. Check that the host name resolves to the private endpoint's IP address. See [Verify DNS forwarding is working](storage-files-networking-dns.md#verify-dns-forwarding-is-working).
5. Mount the file share. See [Mount SMB Azure file share on Windows](storage-how-to-use-files-windows.md), [Mount an Azure file share on macOS](storage-how-to-use-files-mac.md), [Mount SMB Azure file shares on Linux clients](storage-how-to-use-files-linux.md), or [Mount NFS Azure file shares on Linux](storage-files-how-to-mount-nfs-shares.md).

### DNS resolution
Clients use the same host name for the public endpoint and for a private endpoint. DNS determines which IP address the host name resolves to.

- **Classic file shares**: The host name is `<storage-account-name>.file.core.windows.net`.
- **Microsoft.FileShares**: Each file share has its own generated host name, in the file share's `hostName` property. The host name is separate from the file share's resource name and from its mount name.

When you create a private endpoint, the public DNS record for the host name becomes an alias (CNAME) for a name in the `privatelink.file.core.windows.net` zone. Clients in a virtual network that's linked to a private DNS zone with that name resolve the alias to the private endpoint's IP address. Other clients resolve the alias to the public endpoint's IP address. To create the private DNS zone with the private endpoint, see [Create a private endpoint](storage-files-networking-endpoints.md#create-a-private-endpoint). To check the result, see [Verify connectivity](storage-files-networking-endpoints.md#verify-connectivity).

On-premises clients don't use Azure DNS by default, so a VPN or ExpressRoute connection alone doesn't give them private resolution. Forward their DNS queries for the file share's domain to Azure through Azure DNS Private Resolver or a DNS forwarder virtual machine. For steps, see [Configure DNS forwarding for Azure Files](storage-files-networking-dns.md). For other on-premises DNS designs, see [Azure private endpoint DNS integration](../../private-link/private-endpoint-dns-integration.md).

The host names and zone names in this section are for the Azure public cloud. Other Azure clouds use a different domain, such as `core.usgovcloudapi.net` in Azure Government. For the private DNS zone names in each cloud, see [Azure Private Endpoint private DNS zone values](../../private-link/private-endpoint-dns.md).

## Inbound access control
Inbound access controls decide which clients can reach a file share:

- **Private endpoint traffic** isn't subject to the public network access setting, network rules, or a network security perimeter.
- **Public endpoint traffic** must pass the [public network access](#public-network-access) setting. If the storage account is associated with a [network security perimeter](#network-security-perimeter), the perimeter's access rules take precedence over the [network rules](#network-rules). Otherwise, the network rules decide access.
- **Authorization** applies to every request that reaches the file share, through either endpoint.

### Public network access
You can disable public network access, or keep it enabled and restrict it with network rules. Disabling public network access also prevents client access through service endpoints. Private endpoint access is independent of this setting. For classic file shares, existing [trusted service and resource instance exceptions](#exceptions-for-azure-services) remain in effect after you disable public network access.

For configuration steps for both resource providers, see [Restrict public endpoint access](storage-files-networking-endpoints.md#restrict-public-endpoint-access).

### Network rules
Network rules control which clients can reach the public endpoint. There are two kinds:

- **[Virtual network rules](#virtual-network-rules)** allow clients in a subnet that has a [service endpoint](#service-endpoints). Both resource providers support virtual network rules. NFS clients need a service endpoint, so virtual network rules are how you allow them.
- **[IP address rules](#ip-address-rules)** allow clients by public IP address. Only classic file shares support IP address rules, for SMB and FileREST.

Network rules apply to data access through SMB, NFS, and FileREST. They don't apply to management operations through Azure Resource Manager, such as creating a file share or changing its properties. When you browse file data in the Azure portal, your browser sends FileREST requests to the file service endpoint, so the network rules must allow your computer. For the permissions that portal browsing needs, see [Authorize access to file data in the Azure portal](authorize-data-operations-portal.md).

#### Virtual network rules
A virtual network rule allows traffic from a subnet that has a `Microsoft.Storage` or `Microsoft.Storage.Global` service endpoint. Both the Microsoft.Storage (storage accounts) and Microsoft.FileShares resource providers use these service endpoint names. Keep these points in mind:

- The subnet can be in a different region from the resource. For access from other regions, use the `Microsoft.Storage.Global` service endpoint. A subnet can have only one of these two service endpoints.
- The subnet can be in a different subscription or Microsoft Entra tenant. To add a subnet from another tenant, use Azure PowerShell or Azure CLI. The Azure portal doesn't show subnets in other tenants.
- Each resource supports up to 400 virtual network rules. To add a rule, you need the `Microsoft.Network/virtualNetworks/subnets/joinViaServiceEndpoint/action` permission on the subnet.
- Deleting a subnet removes it from the storage account's network rules. A new subnet with the same name doesn't get access until you add it to the network rules. (Classic file shares only.)
- If you plan to fail over a geo-redundant storage account, create the virtual networks in the secondary region before you need them. Add virtual network rules for their subnets so clients in those virtual networks can connect after a failover. (Classic file shares only.)

#### IP address rules
Classic file shares support IP address rules for SMB and FileREST access from the internet. Microsoft.FileShares doesn't support IP address rules. Keep these points in mind:

- IP address rules accept only public IPv4 addresses. You can't add private address ranges, such as addresses that start with 10, 172.16 to 172.31, or 192.168.
- Specify address ranges in CIDR notation, such as `203.0.113.0/24`. Ranges with a `/31` or `/32` prefix aren't supported. Add these addresses as individual IP address rules.
- IP address rules have no effect on requests from clients in the same Azure region as the storage account, or from clients in a subnet that has a service endpoint. Use virtual network rules for these clients. The exception is a rule for the IP address of a [standard service endpoint](#standard-service-endpoints).
- A storage account supports up to 400 IP address rules.
- To allow clients in an on-premises network, add the public IP addresses that the network uses for internet traffic. If you use Azure ExpressRoute with Microsoft peering, add the network address translation (NAT) IP addresses that Microsoft peering uses.

#### Exceptions for Azure services
For classic file shares, you can allow Azure services that can't use virtual network or IP address rules:

- **Trusted services**: The **Allow trusted Microsoft services to access this resource** exception allows services such as Azure File Sync. Enable it only when an integration needs it. For the list of services, see [Trusted Azure services](../common/storage-network-security-trusted-azure-services.md?toc=/azure/storage/files/toc.json).
- **Resource instances**: A resource instance rule allows a specific Azure resource in your Microsoft Entra tenant to reach the public endpoint. The resource still needs authorization to access file data.

A [network security perimeter](#network-security-perimeter) is the newer way to allow Azure services. It controls access for many resources in one place. We recommend a perimeter when the services that you use are onboarded to it. You might still need these exceptions for services that aren't onboarded, such as Azure Backup, or if you don't use a perimeter.

Microsoft.FileShares doesn't support these exceptions.

### Network security perimeter
A [network security perimeter](../../private-link/network-security-perimeter-concepts.md) puts PaaS resources inside a logical boundary and controls public network access to them. Only classic file shares support network security perimeters.

When you associate a storage account with a perimeter, the access rules in the perimeter profile override the storage account's network rules. The perimeter has two access modes:

- **Transition**: The default mode. If no perimeter rule allows a connection, the storage account's own network rules and [exceptions for Azure services](#exceptions-for-azure-services) apply. By using [diagnostic logs](../../private-link/network-security-perimeter-diagnostic-logs.md), you can find traffic that the perimeter rules don't allow. Use Transition mode only as a temporary step.
- **Enforced**: Only perimeter rules apply. The storage account's virtual network rules, IP address rules, and exceptions for Azure services don't apply. To allow an Azure service that isn't [onboarded to network security perimeter](../../private-link/network-security-perimeter-concepts.md#onboarded-private-link-resources), add an inbound subscription-based access rule.

A perimeter decides which clients can reach the storage account through the public endpoint. It allows clients in two ways:

- **Resource to resource**: Other PaaS resources in the perimeter, and Azure resources in subscriptions that an inbound subscription-based rule allows. The perimeter identifies these clients by their Microsoft Entra identity, which only OAuth requests carry. For Azure Files, this access applies only to FileREST with OAuth.
- **Clients by IP address**: Inbound IP-based rules allow clients by public IP address.
  - Clients in Azure virtual networks connect through a [standard service endpoint](#standard-service-endpoints). An IP-based rule for the service endpoint's IP address allows SMB, NFS, and FileREST. In Enforced mode, the perimeter denies traffic through service endpoints that don't have an assigned IP address.
  - Clients outside Azure connect from their public IP address. An IP-based rule for that address allows SMB and FileREST. NFS doesn't support clients outside Azure.

Private endpoint traffic isn't subject to perimeter rules.

The following table shows which inbound rules apply to each protocol and authentication method:

| Access | Inbound perimeter rules that apply |
|---|---|
| FileREST with OAuth | All rules: IP-based, subscription-based, and access from other resources in the perimeter |
| FileREST with Shared Key or SAS | IP-based rules only |
| SMB with NTLM or Kerberos | IP-based rules only |
| NFS | IP-based rules for the IP address of a [standard service endpoint](#standard-service-endpoints) only |

Check these integrations before you associate a storage account with a perimeter:

- **Customer-managed keys**: If the key vault that holds the [customer-managed key](customer-managed-keys.md) is in a perimeter, put the storage account in the same perimeter. Otherwise, configure the key vault's perimeter profile to allow the storage account.
- **Azure Backup**: Azure Backup isn't onboarded to network security perimeter. Don't use a perimeter for storage accounts that use Azure Backup.
- **Azure File Sync**: You can't associate a Storage Sync Service with a perimeter. [Configure the Storage Sync Service to use managed identities](../file-sync/file-sync-managed-identities.md). Then add an inbound subscription-based access rule that allows the subscription of the Storage Sync Service.

To associate a perimeter with a storage account, see [Transition to a network security perimeter in Azure](../../private-link/network-security-perimeter-transition.md).

#### Standard service endpoints
A [standard service endpoint](../../private-link/service-endpoint-standard-overview.md) is a service endpoint that has a public IP address assigned to it. You create the public IP address and assign it to the subnet's `Microsoft.Storage` service endpoint. Azure Storage then uses that address to identify traffic from the subnet. The address only labels the traffic. Traffic isn't routed through it, and clients don't use it, so a client's own public IP address doesn't work in its place. The Azure networking documentation calls this address a *network identifier*, and calls a service endpoint without one a *basic service endpoint*.

Standard service endpoints let clients in virtual networks reach a storage account in a network security perimeter without a private endpoint. To allow them, add an inbound IP-based access rule for the service endpoint's IP address to the perimeter profile. The rule allows SMB, NFS, and FileREST traffic from every subnet that uses the IP address. One IP address can represent many subnets and virtual networks in the same region, including virtual networks in other subscriptions in the same Microsoft Entra tenant. When you add or remove subnets that use the IP address, you don't need to change the perimeter's rules.

A storage account's IP address rules can also allow the service endpoint's IP address, without a perimeter. Without a perimeter, a basic service endpoint with [virtual network rules](#virtual-network-rules) gives the same access at no extra charge.

Keep these points in mind:

- A standard service endpoint still identifies the source subnet. Virtual network rules that allow the subnet continue to apply after you assign an IP address, until the perimeter is in Enforced mode.
- Assigning or changing the IP address resets active connections from the subnet. Plan the change for a maintenance window.
- Standard service endpoints don't support traffic from on-premises networks. Use a [private endpoint](#private-endpoints) for on-premises access.
- Standard service endpoints are a paid feature, charged for each virtual network. For more information, see [Azure Private Link pricing](https://azure.microsoft.com/pricing/details/private-link/).

Clients in a subnet that has a standard service endpoint can still access a Microsoft.FileShares file share if the subnet is in the file share's allowed subnets.

To configure a standard service endpoint, see [Allow access from a standard service endpoint](storage-files-networking-endpoints.md#allow-access-from-a-standard-service-endpoint).

## Outbound access control
Network rules for a file share control inbound access. They don't restrict clients' outbound destinations. For example, a client that can read a file share could copy data to another resource it has permission to write to.

### Restrict outbound access with service endpoint policies
For classic file shares, you can use a [service endpoint policy](../../virtual-network/virtual-network-service-endpoint-policies-overview.md) to limit which storage accounts clients in a subnet can access through service endpoints. The policy applies to all clients in that subnet. The destination's network rules and authorization requirements still apply.

Service endpoint policies work alongside other network controls:

- Service endpoint routes override user-defined routes (UDRs) for the matching service address prefixes. Traffic routed through a service endpoint doesn't go through Azure Firewall or a network virtual appliance (NVA), so these devices can't inspect or log it. For more information, see [Virtual network service endpoints](../../virtual-network/virtual-network-service-endpoints-overview.md).
- Network security group (NSG) rules can use service tags such as `Storage.WestUS` to restrict outbound traffic to a region. Service tags can't restrict traffic to a specific storage account.

The policy's allow list can contain individual storage accounts, resource groups, or subscriptions. The policy blocks clients in the associated subnet from accessing other storage accounts through service endpoints. It doesn't restrict other outbound paths from the subnet.

> [!IMPORTANT]
> Service endpoint policies don't support Microsoft.FileShares file shares. You can't add these file shares to a policy. A policy on the client subnet blocks access to them through service endpoints, even if it allows their subscription or resource group. Clients in that subnet must use a [private endpoint](#private-endpoints) to access Microsoft.FileShares file shares.

Service endpoint policies don't apply to private endpoint traffic.

To configure a service endpoint policy, see [Restrict outbound access to specific storage accounts](storage-files-networking-endpoints.md#restrict-outbound-access-to-specific-storage-accounts).

## Related content
- [Azure Files overview](storage-files-introduction.md)
- [Plan an Azure Files deployment](storage-files-planning.md)
