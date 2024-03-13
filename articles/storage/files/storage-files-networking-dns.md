---
title: Configuring DNS forwarding for Azure Files
description: Learn how to configure DNS forwarding for Azure Files.
author: khdownie
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 08/29/2023
ms.author: kendownie
---

# Configuring DNS forwarding for Azure Files
Azure Files enables you to create private endpoints for the storage accounts containing your file shares. Although useful for many different applications, private endpoints are especially useful for connecting to your Azure file shares from your on-premises network using a VPN or ExpressRoute connection using private-peering. 

In order for connections to your storage account to go over your network tunnel, the fully qualified domain name (FQDN) of your storage account must resolve to your private endpoint's private IP address. To achieve this, you must forward the storage endpoint suffix (`core.windows.net` for public cloud regions) to the Azure private DNS service accessible from within your virtual network. This guide will show how to setup and configure DNS forwarding to properly resolve to your storage account's private endpoint IP address.

We strongly recommend that you read [Planning for an Azure Files deployment](storage-files-planning.md) and [Azure Files networking considerations](storage-files-networking-overview.md) before you complete the steps described in this article.

## Applies to
| File share type | SMB | NFS |
|-|:-:|:-:|
| Standard file shares (GPv2), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Standard file shares (GPv2), GRS/GZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Premium file shares (FileStorage), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |

## Overview
Azure Files provides the following types of endpoints for accessing Azure file shares:

- Public endpoints, which have a public IP address and can be accessed from anywhere in the world.
- Private endpoints, which exist within a virtual network and have a private IP address from within the address space of that virtual network.
- Service endpoints, which restrict access to the public endpoint to specific virtual networks. You still access the storage account via the public IP address, but access is only possible from the locations you specify in your configuration.

Public and private endpoints exist on the Azure storage account. A storage account is a management construct that represents a shared pool of storage in which you can deploy multiple file shares, as well as other storage resources, such as blob containers or queues.

Every storage account has a fully qualified domain name (FQDN). For the public cloud regions, this FQDN follows the pattern `storageaccount.file.core.windows.net` where `storageaccount` is the name of the storage account. When you make requests against this name, such as mounting the share on your workstation, your operating system performs a DNS lookup to resolve the fully qualified domain name to an IP address.

By default, `storageaccount.file.core.windows.net` resolves to the public endpoint's IP address. The public endpoint for a storage account is hosted on an Azure storage cluster which hosts many other storage accounts' public endpoints. When you create a private endpoint, a private DNS zone is linked to the virtual network it was added to, with a CNAME record mapping `storageaccount.file.core.windows.net` to an A record entry for the private IP address of your storage account's private endpoint. This enables you to use `storageaccount.file.core.windows.net` FQDN within the virtual network and have it resolve to the private endpoint's IP address.

Because our ultimate objective is to access the Azure file shares hosted within the storage account from on-premises using a network tunnel such as a VPN or ExpressRoute connection, you must configure your on-premises DNS servers to forward requests made to the Azure Files service to the Azure private DNS service. 

You can configure DNS forwarding one of two ways:

- **Use DNS server VMs:** Set up *conditional forwarding* of `*.core.windows.net` (or the appropriate storage endpoint suffix for the US Government, Germany, or China national clouds) to a DNS server virtual machine hosted within your Azure virtual network. This DNS server will then recursively forward the request on to Azure's private DNS service, which will resolve the FQDN of the storage account to the appropriate private IP address. This is a one-time step for all the Azure file shares hosted within your virtual network.

- **Use Azure DNS Private Resolver:** If you don't want to deploy a VM-based DNS server, you can accomplish the same task using Azure DNS Private Resolver.

In addition to Azure Files, DNS name resolution requests for other Azure storage services (Azure Blob storage, Azure Table storage, Azure Queue storage, etc.) will be forwarded to Azure's private DNS service. You can add additional endpoints for other Azure services if desired.

## Prerequisites
Before you can set up DNS forwarding to Azure Files, you'll need the following:

- A storage account containing an Azure file share you'd like to mount. To learn how to create a storage account and an Azure file share, see [Create an Azure file share](storage-how-to-create-file-share.md).
- A private endpoint for the storage account. See [Create a private endpoint](storage-files-networking-endpoints.md#create-a-private-endpoint).
- The [latest version](/powershell/azure/install-azure-powershell) of the Azure PowerShell module.

## Configure DNS forwarding using VMs
If you already have DNS servers in place within your Azure virtual network, or if you prefer to deploy your own DNS server VMs by whatever methodology your organization uses, you can configure DNS with the built-in DNS server PowerShell cmdlets.

:::image type="content" source="media/storage-files-networking-dns/dns-forwarding-azure-virtual-machines.png" alt-text="Diagram showing the network topology for configuring D N S forwarding using virtual machines in Azure." lightbox="media/storage-files-networking-dns/dns-forwarding-azure-virtual-machines.png" border="false":::

> [!Important]
> This guide assumes you're using the DNS server within Windows Server in your on-premises environment. All of the steps described here are possible with any DNS server, not just the Windows DNS Server.

On your on-premises DNS servers, create a conditional forwarder using `Add-DnsServerConditionalForwarderZone`. This conditional forwarder must be deployed on all of your on-premises DNS servers to be effective at properly forwarding traffic to Azure. Remember to replace the `<azure-dns-server-ip>` entries with the appropriate IP addresses for your environment.

```powershell
$vnetDnsServers = "<azure-dns-server-ip>", "<azure-dns-server-ip>"

$storageAccountEndpoint = Get-AzContext | `
    Select-Object -ExpandProperty Environment | `
    Select-Object -ExpandProperty StorageEndpointSuffix

Add-DnsServerConditionalForwarderZone `
        -Name $storageAccountEndpoint `
        -MasterServers $vnetDnsServers
```

On the DNS servers within your Azure virtual network, you'll also need to put a forwarder in place so that requests for the storage account DNS zone are directed to the Azure private DNS service, which is fronted by the reserved IP address `168.63.129.16`. (Remember to populate `$storageAccountEndpoint` if you're running the commands within a different PowerShell session.)

```powershell
Add-DnsServerConditionalForwarderZone `
        -Name $storageAccountEndpoint `
        -MasterServers "168.63.129.16"
```

## Configure DNS forwarding using Azure DNS Private Resolver
If you prefer not to deploy DNS server VMs, you can accomplish the same task using Azure DNS Private Resolver. See [Create an Azure DNS Private Resolver using the Azure portal](../../dns/dns-private-resolver-get-started-portal.md).

:::image type="content" source="media/storage-files-networking-dns/dns-forwarding-azure-private-resolver.png" alt-text="Diagram showing the network topology for configuring D N S forwarding using Azure D N S Private Resolver." lightbox="media/storage-files-networking-dns/dns-forwarding-azure-private-resolver.png" border="false":::

There's no difference in how you configure your on-premises DNS servers, except that instead of pointing to the IP addresses of the DNS servers in Azure, you point to the resolver's inbound endpoint IP address. The resolver doesn't require any configuration, as it will forward queries to the Azure private DNS server by default. If a private DNS zone is linked to the VNet where the resolver is deployed, the resolver will be able to reply with records from that DNS zone.

> [!Warning]
> When configuring forwarders for the *core.windows.net* zone, all queries for this public domain will be forwarded to your Azure DNS infrastructure. This causes an issue when you try to access a storage account of a different tenant that has been configured with private endpoints, because Azure DNS will answer the query for the storage account public name with a CNAME that doesn’t exist in your private DNS zone. A workaround for this issue is to create a cross-tenant private endpoint in your environment to connect to that storage account.

To configure DNS forwarding using Azure DNS Private Resolver, run this script on your on-premises DNS servers. Replace `<resolver-ip>` with the resolver's inbound endpoint IP address.

```powershell
$privateResolver = "<resolver-ip>"

$storageAccountEndpoint = Get-AzContext | `
    Select-Object -ExpandProperty Environment | `
    Select-Object -ExpandProperty StorageEndpointSuffix

Add-DnsServerConditionalForwarderZone `
        -Name $storageAccountEndpoint `
        -MasterServers $privateResolver
```

## Confirm DNS forwarders
Before testing to see if the DNS forwarders have successfully been applied, we recommend clearing the DNS cache on your local workstation using `Clear-DnsClientCache`. To test if you can successfully resolve the FQDN of your storage account, use `Resolve-DnsName` or `nslookup`.

```powershell
# Replace storageaccount.file.core.windows.net with the appropriate FQDN for your storage account.
# Note that the proper suffix (core.windows.net) depends on the cloud you're deployed in.
Resolve-DnsName -Name storageaccount.file.core.windows.net
```

If the name resolution is successful, you should see the resolved IP address match the IP address of your storage account.

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
```

If you're mounting an SMB file share, you can also use the `Test-NetConnection` command to confirm that a TCP connection can be successfully made to your storage account.

```PowerShell
Test-NetConnection -ComputerName storageaccount.file.core.windows.net -CommonTCPPort SMB
```

## See also
- [Planning for an Azure Files deployment](storage-files-planning.md)
- [Azure Files networking considerations](storage-files-networking-overview.md)
- [Configuring Azure Files network endpoints](storage-files-networking-endpoints.md)
