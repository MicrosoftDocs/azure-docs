---
title: Configuring DNS forwarding for Azure Files | Microsoft Docs
description: An overview of networking options for Azure Files.
author: roygara
ms.service: storage
ms.topic: how-to
ms.date: 3/19/2020
ms.author: rogarana
ms.subservice: files
---

# Configuring DNS forwarding for Azure Files
Azure Files enables you to create private endpoints for the storage accounts containing your file shares. Although useful for many different applications, private endpoints are especially useful for connecting to your Azure file shares from your on-premises network using a VPN or ExpressRoute connection using private-peering. 

In order for connections to your storage account to go over your network tunnel, the fully qualified domain name (FQDN) of your storage account must resolve to your private endpoint's private IP address. To achieve this, you must forward the storage endpoint suffix (`core.windows.net` for public cloud regions) to the Azure private DNS service accessible from within your virtual network. This guide will show how to setup and configure DNS forwarding to properly resolve to your storage account's private endpoint IP address.

We strongly recommend that you read [Planning for an Azure Files deployment](storage-files-planning.md) and [Azure Files networking considerations](storage-files-networking-overview.md) before you complete the steps described in this article.

## Overview
Azure Files provides two main types of endpoints for accessing Azure file shares: 
- Public endpoints, which have a public IP address and can be accessed from anywhere in the world.
- Private endpoints, which exist within a virtual network and have a private IP address from within the address space of that virtual network.

Public and private endpoints exist on the Azure storage account. A storage account is a management construct that represents a shared pool of storage in which you can deploy multiple file shares, as well as other storage resources, such as blob containers or queues.

Every storage account has a fully qualified domain name (FQDN). For the public cloud regions, this FQDN follows the pattern `storageaccount.file.core.windows.net` where `storageaccount` is the name of the storage account. When you make requests against this name, such as mounting the share on your workstation using SMB, your operating system performs a DNS lookup to resolve the fully qualified domain name to an IP address which it can use to send the SMB requests to.

By default, `storageaccount.file.core.windows.net` resolves to the public endpoint's IP address. The public endpoint for a storage account is hosted on an Azure storage cluster which hosts many other storage accounts' public endpoints. When you create a private endpoint, a private DNS zone is linked to the virtual network it was added to, with a CNAME record mapping `storageaccount.file.core.windows.net` to an A record entry for the private IP address of your storage account's private endpoint. This enables you to use `storageaccount.file.core.windows.net` FQDN within the virtual network and have it resolve to the private endpoint's IP address.

Since our ultimate objective is to access the Azure file shares hosted within the storage account from on-premises using a network tunnel such as a VPN or ExpressRoute connection, you must configure your on-premises DNS servers to forward requests made to the Azure Files service to the Azure private DNS service. To accomplish this, you need to set up *conditional forwarding* of `*.core.windows.net` (or the appropriate storage endpoint suffix for the US Government, Germany, or China national clouds) to a DNS server hosted within your Azure virtual network. This DNS server will then recursively forward the request on to Azure's private DNS service that will resolve the fully qualified domain name of the storage account to the appropriate private IP address.

Configuring DNS forwarding for Azure Files will require running a virtual machine to host a DNS server to forward the requests, however this is a one time step for all the Azure file shares hosted within your virtual network. Additionally, this is not an exclusive requirement to Azure Files - any Azure service that supports private endpoints that you want to access from on-premises can make use of the DNS forwarding you will configure in this guide: Azure Blob storage, SQL Azure, Cosmos DB, etc. 

This guide shows the steps for configuring DNS forwarding for the Azure storage endpoint, so in addition to Azure Files, DNS name resolution requests for all of the other Azure storage services (Azure Blob storage, Azure Table storage, Azure Queue storage, etc.) will be forwarded to Azure's private DNS service. Additional endpoints for other Azure services can also be added if desired. DNS forwarding back to your on-premises DNS servers will also be configured, enabling cloud resources within your virtual network (such as a DFS-N server) to resolve on-premises machine names. 

## Prerequisites
Before you can setup DNS forwarding to Azure Files, you need to have completed the following steps:

- A storage account containing an Azure file share you would like to mount. To learn how to create a storage account and an Azure file share, see [Create an Azure file share](storage-how-to-create-file-share.md).
- A private endpoint for the storage account. To learn how to create a private endpoint for Azure Files, see [Create a private endpoint](storage-files-networking-endpoints.md#create-a-private-endpoint).
- The [latest version](https://docs.microsoft.com/powershell/azure/install-az-ps) of the Azure PowerShell module.

> [!Important]  
> This guide assumes you are using the DNS server within Windows Server in your on-premises environment. All of the steps described in this guide are possible with any DNS server, not just the Windows DNS Server.

## Manually configuring DNS forwarding
If you already have DNS servers in place within your Azure virtual network, or if you simply prefer to deploy your own virtual machines to be DNS servers by whatever methodology your organization uses, you can configure DNS manually with the built-in DNS server PowerShell cmdlets.

On your on-premises DNS servers, create a conditional forwarder using `Add-DnsServerConditionalForwarderZone`. This conditional forwarder must be deployed on all of your on-premises DNS servers to be effective at properly forwarding traffic to Azure. Remember to replace `<azure-dns-server-ip>` with the appropriate IP addresses for your environment.

```powershell
$vnetDnsServers = "<azure-dns-server-ip>", "<azure-dns-server-ip>"

$storageAccountEndpoint = Get-AzContext | `
    Select-Object -ExpandProperty Environment | `
    Select-Object -ExpandProperty StorageEndpointSuffix

Add-DnsServerConditionalForwarderZone `
        -Name $storageAccountEndpoint `
        -MasterServers $vnetDnsServers
```

On the DNS servers within your Azure virtual network, you also will need to put a forwarder in place such that requests for the storage account DNS zone are directed to the Azure private DNS service, which is fronted by the reserved IP address `168.63.129.16`. (Remember to populate `$storageAccountEndpoint` if you are running the commands within a different PowerShell session.)

```powershell
Add-DnsServerConditionalForwarderZone `
        -Name $storageAccountEndpoint `
        -MasterServers "168.63.129.16"
```

## Using the Azure Files Hybrid module to configure DNS forwarding
In order to make configuring DNS forwarding as easy as possible, we have provided automation in the Azure Files Hybrid module. The cmdlets provided for manipulating DNS in this module will help you deploy DNS servers in your Azure virtual network and update your on-premises DNS servers to forward to them. 

If you've never used the Azure Files Hybrid module, you must first install it on your workstation. Download the [latest version](https://github.com/Azure-Samples/azure-files-samples/releases) of the Azure Files Hybrid PowerShell module:

```PowerShell
# Unzip the downloaded file
Expand-Archive -Path AzFilesHybrid.zip

# Change the execution policy to unblock importing AzFilesHybrid.psm1 module
Set-ExecutionPolicy -ExecutionPolicy Unrestricted

# Navigate to where AzFilesHybrid is unzipped and stored and run to copy the files into your path
.\AzFilesHybrid\CopyToPSPath.ps1 

# Import AzFilesHybrid module
Import-Module -Name AzFilesHybrid
```

Deploying the DNS forwarding solution has two steps, creating a DNS forwarding rule set, which defines which Azure services you want to forward requests to, and the actual deployment of the DNS forwarders. 

The following example forwards requests to the storage account, inclusive requests to Azure Files, Azure Blob storage, Azure Table storage, and Azure Queue storage. If desired, you can add forwarding for additional Azure service to the rule via the `-AzureEndpoints` parameter of the `New-AzDnsForwardingRuleSet` cmdlet. Remember to replace `<virtual-network-resource-group>`, `<virtual-network-name>`, and `<subnet-name>` with the appropriate values for your environment.

```PowerShell
# Create a rule set, which defines the forwarding rules
$ruleSet = New-AzDnsForwardingRuleSet -AzureEndpoints StorageAccountEndpoint

# Deploy and configure DNS forwarders
New-AzDnsForwarder `
        -DnsForwardingRuleSet $ruleSet `
        -VirtualNetworkResourceGroupName "<virtual-network-resource-group>" `
        -VirtualNetworkName "<virtual-network-name>" `
        -VirtualNetworkSubnetName "<subnet-name>"
```

You may additionally find it useful/necessary to supply several additional parameters:

| Parameter name | Type | Description |
|----------------|------|-------------|
| `DnsServerResourceGroupName` | `string` | By default, the DNS servers will be deployed into the same resource group as the virtual network. If this is not desired, this parameter allows you to pick an alternate resource group for them to be deployed into. |
| `DnsForwarderRootName` | `string` | By default, the DNS servers that are deployed in Azure have the names `DnsFwder-*`, where the asterisk is populated by a iterator. This parameter changes the root of that name (i.e. `DnsFwder`). |
| `VmTemporaryPassword` | `SecureString` | By default, a random password is chosen for the temporary default account a VM has before it is domain joined. After it is domain joined, the default account is disabled. |
| `DomainToJoin` | `string` | The domain to join the DNS VM(s) to join. By default, this domain is chosen based on the domain of the computer where you are running the cmdlets. |
| `DnsForwarderRedundancyCount` | `int` | The number of DNS VMs to deploy for your virtual network. By default, `New-AzDnsForwarder` deploys two DNS servers in your Azure virtual network, in an Availability Set, to ensure redundancy. This number may be modified as desired. |
| `OnPremDnsHostNames` | `HashSet<string>` | A manually specified list of on-premises DNS host names to create forwarders on. This parameter is useful when you do not want to apply forwarders on all on-premises DNS servers, such as when you have a range of clients with manually specified DNS names. |
| `Credential` | `PSCredential` | A credential to use when updating the DNS servers. This is useful when the user account you have logged in with does not have permissions to modify DNS settings. |
| `SkipParentDomain` | `SwitchParameter` | By default, DNS forwarders are applied to the highest level domain that exists in your environment. For example, if `northamerica.corp.contoso.com` is a child domain of `corp.contoso.com`, the forwarder will be created for the DNS servers associated with `corp.contoso.com`. This parameter will cause forwarders to be created in `northamerica.corp.contoso.com`. |

## Confirm DNS forwarders
Before testing to see if the DNS forwarders have successfully been applied, we recommend clearing the DNS cache on your local workstation using `Clear-DnsClientCache`. To test to see if you can successfully resolve the fully qualified domain name of your storage account, use `Resolve-DnsName` or `nslookup`.

```powershell
# Replace storageaccount.file.core.windows.net with the appropriate FQDN for your storage account.
# Note the proper suffix (core.windows.net) depends on the cloud your deployed in.
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

If you have already set up a VPN or ExpressRoute connection, you can also use `Test-NetConnection` to see that a TCP connection can be successfully made to your storage account.

```PowerShell
Test-NetConnection -ComputerName storageaccount.file.core.windows.net -CommonTCPPort SMB
```

## See also
- [Planning for an Azure Files deployment](storage-files-planning.md)
- [Azure Files networking considerations](storage-files-networking-overview.md)
- [Configuring Azure Files network endpoints](storage-files-networking-endpoints.md)