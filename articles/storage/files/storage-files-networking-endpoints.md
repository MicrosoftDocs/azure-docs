---
title: Configuring Azure Files network endpoints
description: Learn how to configure Azure File network endpoints.
author: khdownie
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 07/02/2021
ms.author: kendownie
ms.custom: devx-track-azurepowershell, devx-track-azurecli
---

# Configuring Azure Files network endpoints

Azure Files provides two main types of endpoints for accessing Azure file shares: 
- Public endpoints, which have a public IP address and can be accessed from anywhere in the world.
- Private endpoints, which exist within a virtual network and have a private IP address from within the address space of that virtual network.

Public and private endpoints exist on the Azure storage account. A storage account is a management construct that represents a shared pool of storage in which you can deploy multiple file shares, as well as other storage resources, such as blob containers or queues.

This article focuses on how to configure a storage account's endpoints for accessing the Azure file share directly. Most of the detail provided within this document also applies to how Azure File Sync interoperates with public and private endpoints for the storage account, however for more information about networking considerations for an Azure File Sync deployment, see [configuring Azure File Sync proxy and firewall settings](../file-sync/file-sync-firewall-and-proxy.md).

We recommend reading [Azure Files networking considerations](storage-files-networking-overview.md) prior to reading this how to guide.

## Applies to
| File share type | SMB | NFS |
|-|:-:|:-:|
| Standard file shares (GPv2), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Standard file shares (GPv2), GRS/GZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Premium file shares (FileStorage), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |

## Prerequisites

- This article assumes that you have already created an Azure subscription. If you don't already have a subscription, then create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- This article assumes that you have already created an Azure file share in a storage account that you would like to connect to from on-premises. To learn how to create an Azure file share, see [Create an Azure file share](storage-how-to-create-file-share.md).
- If you intend to use Azure PowerShell, [install the latest version](/powershell/azure/install-azure-powershell).
- If you intend to use the Azure CLI, [install the latest version](/cli/azure/install-azure-cli).

## Endpoint configurations

You can configure your endpoints to restrict network access to your storage account. There are two approaches to restricting access to a storage account to a virtual network:

- [Create one or more private endpoints for the storage account](#create-a-private-endpoint)  and restrict all access to the public endpoint. This ensures that only traffic originating from within the desired virtual networks can access the Azure file shares within the storage account. 
*See [Private Link cost](https://azure.microsoft.com/pricing/details/private-link/).
- [Restrict the public endpoint to one or more virtual networks](#restrict-public-endpoint-access). This works by using a capability of the virtual network called *service endpoints*. When you restrict the traffic to a storage account via a service endpoint, you are still accessing the storage account via the public IP address, but access is only possible from the locations you specify in your configuration.

### Create a private endpoint

Creating a private endpoint for your storage account will result in the following Azure resources being deployed:

- **A private endpoint**: An Azure resource representing the storage account's private endpoint. You can think of this as a resource that connects a storage account and a network interface.
- **A network interface (NIC)**: The network interface that maintains a private IP address within the specified virtual network/subnet. This is the exact same resource that gets deployed when you deploy a virtual machine, however instead of being assigned to a VM, it's owned by the private endpoint.
- **A private DNS zone**: If you've never deployed a private endpoint for this virtual network before, a new private DNS zone will be deployed for your virtual network. A DNS A record will also be created for the storage account in this DNS zone. If you've already deployed a private endpoint in this virtual network, a new A record for the storage account will be added to the existing DNS zone. Deploying a DNS zone is optional, however highly recommended, and required if you are mounting your Azure file shares with an AD service principal or using the FileREST API.

> [!Note]  
> This article uses the storage account DNS suffix for the Azure Public regions, `core.windows.net`. This commentary also applies to Azure Sovereign clouds such as the Azure US Government cloud and the Microsoft Azure operated by 21Vianet cloud - just substitute the appropriate suffixes for your environment. 

# [Portal](#tab/azure-portal)
[!INCLUDE [storage-files-networking-endpoints-private-portal](../../../includes/storage-files-networking-endpoints-private-portal.md)]

# [PowerShell](#tab/azure-powershell)
[!INCLUDE [storage-files-networking-endpoints-private-powershell](../../../includes/storage-files-networking-endpoints-private-powershell.md)]

# [Azure CLI](#tab/azure-cli)
[!INCLUDE [storage-files-networking-endpoints-private-cli](../../../includes/storage-files-networking-endpoints-private-cli.md)]
---

## Verify connectivity

# [Portal](#tab/azure-portal)

If you have a virtual machine inside of your virtual network, or you've configured DNS forwarding as described in [Configuring DNS forwarding for Azure Files](storage-files-networking-dns.md), you can test that your private endpoint has been set up correctly by running the following commands from PowerShell, the command line, or the terminal (works for Windows, Linux, or macOS). You must replace `<storage-account-name>` with the appropriate storage account name:

```
nslookup <storage-account-name>.file.core.windows.net
```

If everything has worked successfully, you should see the following output, where `192.168.0.5` is the private IP address of the private endpoint in your virtual network (output shown for Windows):

```Output
Server:  UnKnown
Address:  10.2.4.4

Non-authoritative answer:
Name:    storageaccount.privatelink.file.core.windows.net
Address:  192.168.0.5
Aliases:  storageaccount.file.core.windows.net
```

# [PowerShell](#tab/azure-powershell)

If you have a virtual machine inside of your virtual network, or you've configured DNS forwarding as described in [Configuring DNS forwarding for Azure Files](storage-files-networking-dns.md), you can test that your private endpoint has been set up correctly with the following commands:

```PowerShell
$storageAccountHostName = [System.Uri]::new($storageAccount.PrimaryEndpoints.file) | `
    Select-Object -ExpandProperty Host

Resolve-DnsName -Name $storageAccountHostName
```

If everything has worked successfully, you should see the following output, where `192.168.0.5` is the private IP address of the private endpoint in your virtual network:

```Output
Name                             Type   TTL   Section    NameHost
----                             ----   ---   -------    --------
storageaccount.file.core.windows CNAME  60    Answer     storageaccount.privatelink.file.core.windows.net
.net

Name       : storageaccount.privatelink.file.core.windows.net
QueryType  : A
TTL        : 600
Section    : Answer
IP4Address : 192.168.0.5
```

# [Azure CLI](#tab/azure-cli)

If you have a virtual machine inside of your virtual network, or you've configured DNS forwarding as described in [Configuring DNS forwarding for Azure Files](storage-files-networking-dns.md), you can test that your private endpoint has been set up correctly with the following commands:

```azurecli
httpEndpoint=$(az storage account show \
        --resource-group $storageAccountResourceGroupName \
        --name $storageAccountName \
        --query "primaryEndpoints.file" | \
    tr -d '"')

hostName=$(echo $httpEndpoint | cut -c7-$(expr length $httpEndpoint) | tr -d "/")
nslookup $hostName
```

If everything has worked successfully, you should see the following output, where `192.168.0.5` is the private IP address of the private endpoint in your virtual network. You should still use storageaccount.file.core.windows.net to mount your file share instead of the `privatelink` path.

```Output
Server:         127.0.0.53
Address:        127.0.0.53#53

Non-authoritative answer:
storageaccount.file.core.windows.net      canonical name = storageaccount.privatelink.file.core.windows.net.
Name:   storageaccount.privatelink.file.core.windows.net
Address: 192.168.0.5
```
---

## Restrict public endpoint access

Limiting public endpoint access first requires you to disable general access to the public endpoint. Disabling access to the public endpoint does not impact private endpoints. After the public endpoint has been disabled, you can select specific networks or IP addresses that may continue to access it. In general, most firewall policies for a storage account restrict networking access to one or more virtual networks.

#### Disable access to the public endpoint

When access to the public endpoint is disabled, the storage account can still be accessed through its private endpoints. Otherwise valid requests to the storage account's public endpoint will be rejected, unless they are from [a specifically allowed source](#restrict-access-to-the-public-endpoint-to-specific-virtual-networks). 

# [Portal](#tab/azure-portal)
[!INCLUDE [storage-files-networking-endpoints-public-disable-portal](../../../includes/storage-files-networking-endpoints-public-disable-portal.md)]

# [PowerShell](#tab/azure-powershell)
[!INCLUDE [storage-files-networking-endpoints-public-disable-powershell](../../../includes/storage-files-networking-endpoints-public-disable-powershell.md)]

# [Azure CLI](#tab/azure-cli)
[!INCLUDE [storage-files-networking-endpoints-public-disable-cli](../../../includes/storage-files-networking-endpoints-public-disable-cli.md)]

---

#### Restrict access to the public endpoint to specific virtual networks

When you restrict the storage account to specific virtual networks, you are allowing requests to the public endpoint from within the specified virtual networks. This works by using a capability of the virtual network called *service endpoints*. This can be used with or without private endpoints.

# [Portal](#tab/azure-portal)
[!INCLUDE [storage-files-networking-endpoints-public-restrict-portal](../../../includes/storage-files-networking-endpoints-public-restrict-portal.md)]

# [PowerShell](#tab/azure-powershell)
[!INCLUDE [storage-files-networking-endpoints-public-restrict-powershell](../../../includes/storage-files-networking-endpoints-public-restrict-powershell.md)]

# [Azure CLI](#tab/azure-cli)
[!INCLUDE [storage-files-networking-endpoints-public-restrict-cli](../../../includes/storage-files-networking-endpoints-public-restrict-cli.md)]

---

## See also

- [Azure Files networking considerations](storage-files-networking-overview.md)
- [Configuring DNS forwarding for Azure Files](storage-files-networking-dns.md)
- [Configuring S2S VPN for Azure Files](storage-files-configure-s2s-vpn.md)
