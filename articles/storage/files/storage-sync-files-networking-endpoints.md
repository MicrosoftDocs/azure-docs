---
title: Configuring Azure File Sync network endpoints | Microsoft Docs
description: An overview of networking options for Azure File Sync.
author: roygara
ms.service: storage
ms.topic: overview
ms.date: 5/11/2020
ms.author: rogarana
ms.subservice: files
---

# Configuring Azure File Sync network endpoints
Azure Files and Azure File Sync provide two main types of endpoints for accessing Azure file shares: 
- Public endpoints, which have a public IP address and can be accessed from anywhere in the world.
- Private endpoints, which exist within a virtual network and have a private IP address from within the address space of that virtual network.

For both Azure Files and Azure File Sync, the Azure management object, the storage account and the Storage Sync Service respectively, controls both the public and private endpoints. The storage account is a management construct that represents a shared pool of storage in which you can deploy multiple file shares, as well as other storage resources, such as blob containers or queues. The Storage Sync Service is a management construct that represents a container of Windows file servers which are registered with Azure File Sync and sync groups, which define the topology of the sync relationship. 

This article focuses on how to configure the networking endpoints for both Azure Files and Azure File Sync. To learn more about how to configure networking endpoints for accessing Azure file shares directly, rather than caching on-premises with Azure File Sync, see [Configuring Azure Files network endpoints](storage-files-networking-endpoints.md).

This article is geared towards deploying Azure Files and Azure File Sync in a normal networking environment, where your on-premises (or Azure VM) Windows file server has regular internet access. If you want to run Azure File Sync on an isolated network, meaning on a Windows file server without internet access, see [Configuring Azure File Sync on an isolated network](storage-sync-files-networking-isolation.md).

We recommend reading [Azure File Sync networking considerations](storage-sync-files-networking-overview.md) prior to reading this how to guide.

## Prerequisites 
This article assumes that:
- You have an Azure subscription. If you don't already have a subscription, then create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- You have already created an Azure file share in a storage account which you would like to connect to from on-premises. To learn how to create an Azure file share, see [Create an Azure file share](storage-how-to-create-file-share.md).
- You have already created a Storage Sync Service and registered your Windows file server with it. To learn how to deploy Azure File Sync, see [Deploying Azure File Sync](storage-sync-files-deployment-guide.md).

Additionally:
- If you intend to use Azure PowerShell, [install the latest version](https://docs.microsoft.com/powershell/azure/install-az-ps).
- If you intend to use the Azure CLI, [install the latest version](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest).

## Create the private endpoints
When you creating a private endpoint for an Azure resource, the following resources are deployed:

- **A private endpoint**: An Azure resource representing either the private endpoint for the storage account or the Storage Sync Service. You can think of this as a resource that connects your Azure resource and a network interface.
- **A network interface (NIC)**: The network interface that maintains a private IP address within the specified virtual network/subnet. This is the exact same resource that gets deployed when you deploy a virtual machine, however instead of being assigned to a VM, it's owned by the private endpoint.
- **A private DNS zone**: If you've never deployed a private endpoint for this virtual network before, a new private DNS zone will be deployed for your virtual network. A DNS A record will also be created for Azure resource in this DNS zone. If you've already deployed a private endpoint in this virtual network, a new A record for Azure resource will be added to the existing DNS zone. Deploying a DNS zone is optional, however highly recommended to simplify the DNS management required.

> [!Note]  
> This article uses the DNS suffixes for the Azure Public regions, `core.windows.net` for storage accounts and `afs.azure.net` for Storage Sync Services. This commentary also applies to Azure Sovereign clouds such as the Azure US Government cloud - just substitute the the appropriate suffixes for your environment.

### Create the storage account private endpoint
# [Portal](#tab/azure-portal)
[!INCLUDE [storage-files-networking-endpoints-private-portal](../../../includes/storage-files-networking-endpoints-private-portal.md)]

# [PowerShell](#tab/azure-powershell)
[!INCLUDE [storage-files-networking-endpoints-private-powershell](../../../includes/storage-files-networking-endpoints-private-powershell.md)]

# [Azure CLI](#tab/azure-cli)
[!INCLUDE [storage-files-networking-endpoints-private-cli](../../../includes/storage-files-networking-endpoints-private-cli.md)]

---

### Create the storage sync private endpoint
# [Portal](#tab/azure-portal)
Navigate to the **Private Link Center** by typing *Private Link Center* into the search bar at the top of the Azure Portal. In the table of contents for the Private Link Center, select **Private endpoints**, and then **+ Add** to create a new private endpoint.

![A screenshot of the private link center](media/storage-sync-files-networking-endpoints/create-sss-private-endpoint-0.png)

The resulting wizard has multiple pages to complete.

In the **Basics** blade, select the desired resource group, name, and region for your private endpoint. These can be whatever you want, they don't have to match the Storage Sync Service in any way, although you must create the private endpoint in the same region as the virtual network you wish to create the private endpoint in.

![A screenshot of the Basics section of the create private endpoint section](media/storage-sync-files-networking-endpoints/create-sss-private-endpoint-1.png)

In the **Resource** blade, select the radio button for **Connect to an Azure resource in my directory**. Under the **Resource type**, select **Microsoft.StorageSync/storageSyncServices** for the resource type. 

The **Configuration** blade allows you to select the specific virtual network and subnet you would like to add your private endpoint to. Select the same virtual network as the one you used for the storage account above. The Configuration blade also contains the information for creating/updating the private DNS zone. We recommend using the default `privatelink.afs.azure.net` zone.

Click **Review + create** to create the private endpoint.

If you have a virtual machine inside of your virtual network, or you've configured DNS forwarding as described in [Configuring DNS forwarding for Azure File Sync](storage-sync-files-networking-dns.md), you can test that your private endpoint has been setup correctly by running the following commands from PowerShell. 

```powershell
$privateEndpointResourceGroupName = "<your-private-endpoint-resource-group>"
$privateEndpointName = "<your-private-endpoint-name>"

Get-AzPrivateEndpoint `
        -ResourceGroupName $privateEndpointResourceGroupName `
        -Name $privateEndpointName `
        -ErrorAction Stop | `
    Select-Object -ExpandProperty NetworkInterfaces | `
    Select-Object -ExpandProperty Id | `
    ForEach-Object { Get-AzNetworkInterface -ResourceId $_ } | `
    Select-Object -ExpandProperty IpConfigurations | `
    Select-Object -ExpandProperty PrivateLinkConnectionProperties | `
    Select-Object -ExpandProperty Fqdns | `
    ForEach-Object { Resolve-DnsName -Name $_ } | `
    Format-List
```

If everything has worked correctly, you should see the following output where `192.168.1.4`, `192.168.1.5`, `192.168.1.6`, and `192.168.1.7` are the private IP addresses assigned to the private endpoint:

```Output
Name     : mysssmanagement.westus2.afs.azure.net
Type     : CNAME
TTL      : 60
Section  : Answer
NameHost : mysssmanagement.westus2.privatelink.afs.azure.net


Name       : mysssmanagement.westus2.privatelink.afs.azure.net
QueryType  : A
TTL        : 60
Section    : Answer
IP4Address : 192.168.1.4

Name     : myssssyncp.westus2.afs.azure.net
Type     : CNAME
TTL      : 60
Section  : Answer
NameHost : myssssyncp.westus2.privatelink.afs.azure.net


Name       : myssssyncp.westus2.privatelink.afs.azure.net
QueryType  : A
TTL        : 60
Section    : Answer
IP4Address : 192.168.1.5

Name     : myssssyncs.westus2.afs.azure.net
Type     : CNAME
TTL      : 60
Section  : Answer
NameHost : myssssyncs.westus2.privatelink.afs.azure.net


Name       : myssssyncs.westus2.privatelink.afs.azure.net
QueryType  : A
TTL        : 60
Section    : Answer
IP4Address : 192.168.1.6

Name     : mysssmonitoring.westus2.afs.azure.net
Type     : CNAME
TTL      : 60
Section  : Answer
NameHost : mysssmonitoring.westus2.privatelink.afs.azure.net


Name       : mysssmonitoring.westus2.privatelink.afs.azure.net
QueryType  : A
TTL        : 60
Section    : Answer
IP4Address : 192.168.1.7

```

# [PowerShell](#tab/azure-powershell)
To create a private endpoint for your Storage Sync Service, first you will need to get a reference to your Storage Sync Service. Remember to replace `<storage-sync-service-resource-group>` and `<storage-sync-service>` with the correct values for your environment. The following PowerShell commands assume that you are using have already populated the virtual network information from above. 

```powershell
$storageSyncServiceResourceGroupName = "<storage-sync-service-resource-group>"
$storageSyncServiceName = "<storage-sync-service>"

# Uncomment if you are running the steps independently of the above
# steps to create a private endpoint for Azure Files.
# $virtualNetworkResourceGroupName = "<vnet-resource-group-name>"
# $virtualNetworkName = "<vnet-name>"
# $subnetName = "<vnet-subnet-name>"

# These are the production commands, but they are commented out
# since they won't work with the INT RP.
# $storageSyncService = Get-AzStorageSyncService `
#         -ResourceGroupName $storageSyncServiceResourceGroupName `
#         -Name $storageSyncServiceName `
#         -ErrorAction SilentlyContinue

$storageSyncService = Get-AzResource `
        -ResourceGroupName $storageSyncServiceResourceGroupName `
        -ResourceName $storageSyncServiceName `
        -ResourceType "Microsoft.StorageSyncInt/storageSyncServices"

if ($null -eq $storageSyncService) {
    $errorMessage = "Storage Sync Service $storageSyncServiceName not found "
    $errorMessage += "in resource group $storageSyncServiceResourceGroupName."
    Write-Error -Message $errorMessage -ErrorAction Stop
}

# Uncomment if you are running the steps independently of the above
# steps to create a private endpoint for Azure Files.

# Get virtual network reference, and throw error if it doesn't exist
# $virtualNetwork = Get-AzVirtualNetwork `
#         -ResourceGroupName $virtualNetworkResourceGroupName `
#         -Name $virtualNetworkName `
#         -ErrorAction SilentlyContinue

# if ($null -eq $virtualNetwork) {
#     $errorMessage = "Virtual network $virtualNetworkName not found "
#     $errorMessage += "in resource group $virtualNetworkResourceGroupName."
#     Write-Error -Message $errorMessage -ErrorAction Stop
# }

# Get reference to virtual network subnet, and throw error if it doesn't exist
# $subnet = $virtualNetwork | `
#     Select-Object -ExpandProperty Subnets | `
#     Where-Object { $_.Name -eq $subnetName }

# if ($null -eq $subnet) {
#     Write-Error `
#             -Message "Subnet $subnetName not found in virtual network $virtualNetworkName." `
#             -ErrorAction Stop
# }
```

To create a private endpoint, you must create a private link service connection to the Storage Sync Service. The private link connection is an input to the creation of the private endpoint.

```PowerShell 
# Disable private endpoint network policies
$subnet.PrivateEndpointNetworkPolicies = "Disabled"
$virtualNetwork = $virtualNetwork | `
    Set-AzVirtualNetwork -ErrorAction Stop

# Create a private link service connection to the storage account.
$privateEndpointConnection = New-AzPrivateLinkServiceConnection `
        -Name "$storageSyncServiceName-Connection" `
        -PrivateLinkServiceId $storageSyncService.ResourceId `
        -GroupId "Afs" `
        -ErrorAction Stop

# Create a new private endpoint.
$privateEndpoint = New-AzPrivateEndpoint `
        -ResourceGroupName $storageSyncServiceResourceGroupName `
        -Name "$storageSyncServiceName-PrivateEndpoint" `
        -Location $virtualNetwork.Location `
        -Subnet $subnet `
        -PrivateLinkServiceConnection $privateEndpointConnection `
        -ErrorAction Stop
```

Creating an Azure private DNS zone enables the original name of the storage account, such as `mysssmanagement.westus2.afs.azure.net` to resolve to the private IP inside of the virtual network. Although optional from the perspective of creating a private endpoint, it is explicitly required for the Azure File Sync agent to access the Storage Sync Service. 

```powershell
# Get the desired Storage Sync Service suffix (afs.azure.net for public cloud).
# This is done like this so this script will seamlessly work for non-public Azure.
$azureEnvironment = Get-AzContext | `
    Select-Object -ExpandProperty Environment | `
    Select-Object -ExpandProperty Name

switch($azureEnvironment) {
    "AzureCloud" {
        # Commented out for testing
        # $storageSyncSuffix = "afs.azure.net"
        $storageSyncSuffix = "afsint.azure.net"
    }

    "AzureUSGovernment" {
        $storageSyncSuffix = "afs.azure.us"
    }
    
    default {
        Write-Error 
                -Message "The Azure environment $_ is not currently supported by Azure File Sync." `
                -ErrorAction Stop
    }
}

# For public cloud, this will generate the following DNS suffix:
# privatelink.afs.azure.net
$dnsZoneName = "privatelink.$storageSyncSuffix"

$dnsZone = Get-AzPrivateDnsZone | `
    Where-Object { $_.Name -eq $dnsZoneName } | `
    Where-Object {
        $privateDnsLink = Get-AzPrivateDnsVirtualNetworkLink `
                -ResourceGroupName $_.ResourceGroupName `
                -ZoneName $_.Name `
                -ErrorAction SilentlyContinue
        
        $privateDnsLink.VirtualNetworkId -eq $virtualNetwork.Id
    }

if ($null -eq $dnsZone) {
    # No matching DNS zone attached to virtual network, so create new one.
    $dnsZone = New-AzPrivateDnsZone `
            -ResourceGroupName $virtualNetworkResourceGroupName `
            -Name $dnsZoneName `
            -ErrorAction Stop

    $privateDnsLink = New-AzPrivateDnsVirtualNetworkLink `
            -ResourceGroupName $virtualNetworkResourceGroupName `
            -ZoneName $dnsZoneName `
            -Name "$virtualNetworkName-DnsLink" `
            -VirtualNetworkId $virtualNetwork.Id `
            -ErrorAction Stop
}
```

```PowerShell 
$privateEndpointIpFqdnMappings = $privateEndpoint | `
    Select-Object -ExpandProperty NetworkInterfaces | `
    Select-Object -ExpandProperty Id | `
    ForEach-Object { Get-AzNetworkInterface -ResourceId $_ } | `
    Select-Object -ExpandProperty IpConfigurations | `
    ForEach-Object { 
        $privateIpAddress = $_.PrivateIpAddress; 
        $_ | `
            Select-Object -ExpandProperty PrivateLinkConnectionProperties | `
            Select-Object -ExpandProperty Fqdns | `
            Select-Object `
                @{ 
                    Name = "PrivateIpAddress"; 
                    Expression = { $privateIpAddress } 
                }, `
                @{ 
                    Name = "FQDN"; 
                    Expression = { $_ } 
                } 
    }

foreach($ipFqdn in $privateEndpointIpFqdnMappings) {
    $privateDnsRecordConfig = New-AzPrivateDnsRecordConfig `
        -IPv4Address $ipFqdn.PrivateIpAddress
    
    $dnsEntry = $ipFqdn.FQDN.Substring(0, 
        $ipFqdn.FQDN.IndexOf(".", $ipFqdn.FQDN.IndexOf(".") + 1))

    New-AzPrivateDnsRecordSet `
            -ResourceGroupName $virtualNetworkResourceGroupName `
            -Name $dnsEntry `
            -RecordType A `
            -ZoneName $dnsZoneName `
            -Ttl 600 `
            -PrivateDnsRecords $privateDnsRecordConfig `
            -ErrorAction Stop | `
        Out-Null
}
```

# [Azure CLI](#tab/azure-cli)

---

## Restrict access to the public endpoints

### Restrict access to the storage account public endpoint

### Restrict access to the Storage Sync Service public endpoint
```powershell
$storageSyncService.Properties.incomingTrafficPolicy = "AllowVirtualNetworksOnly"
$storageSyncService = $storageSyncService | Set-AzResource -Confirm:$false
```