---
title: Configure Azure Files Network Endpoints
description: Learn how to configure public and private network endpoints for Azure file shares. Restrict access to file shares by setting up a private link.
author: khdownie
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 10/03/2026
ms.author: kendownie
ms.custom: devx-track-azurepowershell, devx-track-azurecli
zone_pivot_groups: azure-files-resource-provider-options
# Customer intent: "As a cloud administrator, I want to configure network endpoints for Azure file shares, so that I can manage access and enhance security for my organization's data storage solutions."
---

# Configure network endpoints for accessing Azure file shares

Azure Files provides two main types of endpoints for accessing Azure file shares:

- Public endpoints, which have a public IP address. Access depends on the protocol and network rules. NFS clients use service endpoints from allowed subnets.
- Private endpoints, which exist within a virtual network and have a private IP address from within the address space of that virtual network.

For classic file shares (created with the `Microsoft.Storage` resource provider), the Azure storage account has public and private endpoints. For file shares created with the `Microsoft.FileShares` resource provider, you create public and private endpoints at the file share level rather than the storage account level.

This article explains how to configure private endpoints and restrict public endpoint access for both resource providers. The classic file share guidance also applies to storage accounts used with Azure File Sync, which supports classic SMB file shares. For File Sync networking requirements, see [Configure Azure File Sync proxy and firewall settings](../file-sync/file-sync-firewall-and-proxy.md).

Before reading this guide, review [Azure Files networking considerations](storage-files-networking-overview.md).

## Prerequisites

- This article assumes that you already created an Azure subscription. If you don't already have a subscription, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- You'll need an Azure file share that you want to connect to. To learn how to create an Azure file share, see [Create a classic file share](create-classic-file-share.md) or [Create an Azure file share with Microsoft.FileShares](create-file-share.md).
- If you intend to use Azure PowerShell, [install the latest version](/powershell/azure/install-azure-powershell).
- If you intend to use the Azure CLI, [install the latest version](/cli/azure/install-azure-cli).

## Create and configure endpoints

You can restrict network access to your file shares by configuring the storage account for classic shares or the individual Microsoft.FileShares resource. To restrict access to a virtual network, use one of the following approaches:

- [Create one or more private endpoints](#create-a-private-endpoint) and restrict all access to the public endpoint (recommended). This approach ensures that only traffic originating from within the desired virtual networks can access the Azure file shares. See [Private Link cost](https://azure.microsoft.com/pricing/details/private-link/).
- [Restrict the public endpoint to one or more virtual networks](#restrict-access-to-the-public-endpoint-to-specific-networks). This approach uses *service endpoints* on the client subnets and network rules on the storage account or file share. Clients reach the public endpoint over the Azure backbone.

### Create a private endpoint

When you create a private endpoint for your file shares, you deploy the following Azure resources:

- **A private endpoint**: An Azure resource that represents the private endpoint. You can think of this resource as a connector between a target resource and a network interface.
- **A network interface (NIC)**: The network interface that maintains a private IP address within the specified virtual network and subnet. This resource is the same as the one you deploy when you deploy a virtual machine (VM). However, instead of assigning it to a VM, the private endpoint owns it.
- **A private Domain Name System (DNS) zone**: These steps create or reuse an Azure private DNS zone linked to the virtual network and add an A record for the private endpoint. You can use your own DNS infrastructure instead, provided clients resolve the file share's host name to the private endpoint's IP address.

> [!NOTE]
> In Azure public cloud, both resource providers use the private DNS zone `privatelink.file.core.windows.net`. Their client host names differ; see [Verify connectivity](#verify-connectivity) for examples. For classic file shares in other Azure clouds, use the storage endpoint suffix for that cloud. Check [regional availability](files-management-concepts.md#regional-availability) before deploying Microsoft.FileShares.

#### Classic versus Microsoft.FileShares

The private endpoint creation process differs slightly depending on whether you're using classic file shares or the new file share model. For classic file shares, you create a private endpoint for the storage account that contains the file shares. For file shares created with Microsoft.FileShares, you create a private endpoint for the file share itself.

Many of the steps are identical for both experiences. Only the resource reference, group ID, and DNS record name differ, as shown in the following table.
 
| | Classic file shares (`Microsoft.Storage`) | File shares (`Microsoft.FileShares`) |
|---|---|---|
| **Private endpoint target** | Storage account | File share |
| **Resource cmdlet** | `Get-AzStorageAccount` | `Get-AzFileShare` |
| **Group ID (sub-resource)** | `file` | `FileShare` |
| **DNS A record name** | Storage account name | Host name prefix (for example, `fs-xxxxxxxxxxxxxxxxx`) |

# [Portal](#tab/azure-portal)
Go to the resource group where you want to create a private endpoint. Select **+ Create** and search for **Private Endpoint**. Select the private endpoint resource, and then select **Create**.

The wizard has multiple pages to complete.

In the **Basics** page, select the subscription, resource group, name, network interface name, and region for your private endpoint. You must create the private endpoint in the same region as the virtual network you want to create the private endpoint in. Then select **Next: Resource**.

:::image type="content" source="media/storage-files-networking-endpoints/private-endpoint-basics.png" alt-text="Screenshot showing how to provide the project and instance details for a new private endpoint." lightbox="media/storage-files-networking-endpoints/private-endpoint-basics.png":::

::: zone pivot="microsoft-storage"

On the **Resource** page, select **Microsoft.Storage/storageAccounts** from the drop-down menu for **Resource type**. For **Resource**, select the specific storage account you want to connect to. For **Target sub-resource**, select `file`. Then select **Next: Virtual Network**.

:::image type="content" source="media/storage-files-networking-endpoints/private-endpoint-resources.png" alt-text="Screenshot showing how to select the resource type, resource, and target sub-resource for the new private endpoint." lightbox="media/storage-files-networking-endpoints/private-endpoint-resources.png":::

::: zone-end

::: zone pivot="microsoft-fileshares"

On the **Resource** page, select **Microsoft.FileShares/fileShares** from the drop-down menu for **Resource type**. For **Resource**, select the specific file share you want to connect to. The target sub-resource auto-populates with `FileShare`. Then select **Next: Virtual Network**.

::: zone-end

The **Virtual Network** page allows you to select the specific virtual network and subnet you want to add your private endpoint to. Select dynamic or static IP address allocation for the new private endpoint. If you select static, you also need to provide a name and a private IP address. You can also optionally specify an application security group. When you're finished, select **Next: DNS**.

:::image type="content" source="media/storage-files-networking-endpoints/private-endpoint-virtual-network.png" alt-text="Screenshot showing how to provide virtual network, subnet, and IP address details for the new private endpoint." lightbox="media/storage-files-networking-endpoints/private-endpoint-virtual-network.png":::

The **DNS** page contains the information for integrating your private endpoint with a private DNS zone. Make sure the subscription and resource group are correct, and then select **Next: Tags**.

:::image type="content" source="media/storage-files-networking-endpoints/private-endpoint-dns.png" alt-text="Screenshot showing how to integrate your private endpoint with a private DNS zone." lightbox="media/storage-files-networking-endpoints/private-endpoint-dns.png":::

You can optionally apply tags to categorize your resources, such as applying the name **Environment** and the value **Test** to all testing resources. Enter name/value pairs if desired, and then select **Next: Review + create**.

:::image type="content" source="media/storage-files-networking-endpoints/private-endpoint-tags.png" alt-text="Screenshot showing how to optionally tag your private endpoint with name/value pairs for easy categorization." lightbox="media/storage-files-networking-endpoints/private-endpoint-tags.png":::

Select **Create** to create the private endpoint.

# [PowerShell](#tab/azure-powershell)

To create a private endpoint, first get a reference to your storage account or your file share and the virtual network subnet where you want to add the private endpoint. Replace the placeholder values in the following code with your own values.

::: zone pivot="microsoft-storage"

Get a reference to the storage account:

```PowerShell
$storageAccountResourceGroupName = "<storage-account-resource-group-name>"
$storageAccountName = "<storage-account-name>"
 
$storageAccount = Get-AzStorageAccount `
                -ResourceGroupName $storageAccountResourceGroupName `
                -Name $storageAccountName `
                -ErrorAction SilentlyContinue
 
if ($null -eq $storageAccount) {
        $errorMessage = "Storage account $storageAccountName not found "
        $errorMessage += "in resource group $storageAccountResourceGroupName."
        Write-Error -Message $errorMessage -ErrorAction Stop
}
 
# Set common variables for private endpoint creation
$resourceGroupName = $storageAccountResourceGroupName
$privateLinkResourceId = $storageAccount.Id
$groupId = "file"
$dnsRecordName = $storageAccountName
```

::: zone-end

::: zone pivot="microsoft-fileshares"

Get a reference to the file share:

```PowerShell
$fileShareResourceGroupName = "<resource-group-name>"
$fileShareName = "<file-share-name>"
 
$fileShare = Get-AzFileShare `
                -ResourceGroupName $fileShareResourceGroupName `
                -ResourceName $fileShareName `
                -ErrorAction SilentlyContinue
 
if ($null -eq $fileShare) {
        $errorMessage = "File share $fileShareName not found "
        $errorMessage += "in resource group $fileShareResourceGroupName."
        Write-Error -Message $errorMessage -ErrorAction Stop
}
 
# Extract hostName and hostNamePrefix for DNS record
$hostName = $fileShare.HostName
$hostNamePrefix = $hostName.Split('.')[0]
 
# Set common variables for private endpoint creation
$resourceGroupName = $fileShareResourceGroupName
$privateLinkResourceId = $fileShare.Id
$groupId = "FileShare"
$dnsRecordName = $hostNamePrefix
```

::: zone-end

Get references to the virtual network and subnet:

```PowerShell
 $virtualNetworkResourceGroupName = "<vnet-resource-group-name>"
 $virtualNetworkName = "<vnet-name>"
 $subnetName = "<vnet-subnet-name>"
 
 # Get virtual network reference, and throw error if it doesn't exist
 $virtualNetwork = Get-AzVirtualNetwork `
         -ResourceGroupName $virtualNetworkResourceGroupName `
         -Name $virtualNetworkName `
         -ErrorAction SilentlyContinue
 
 if ($null -eq $virtualNetwork) {
     $errorMessage = "Virtual network $virtualNetworkName not found "
     $errorMessage += "in resource group $virtualNetworkResourceGroupName."
     Write-Error -Message $errorMessage -ErrorAction Stop
 }
 
 # Get reference to virtual network subnet, and throw error if it doesn't exist
 $subnet = $virtualNetwork | `
     Select-Object -ExpandProperty Subnets | `
     Where-Object { $_.Name -eq $subnetName }
 
 if ($null -eq $subnet) {
     Write-Error `
             -Message "Subnet $subnetName not found in virtual network $virtualNetworkName." `
             -ErrorAction Stop
 }
```

To create a private endpoint, you must create a private link service connection. The private link service connection is an input to the creation of the private endpoint.

```powerShell
 # Disable private endpoint network policies
 $subnet.PrivateEndpointNetworkPolicies = "Disabled"
 $virtualNetwork = $virtualNetwork | `
     Set-AzVirtualNetwork -ErrorAction Stop
 
 # Create a private link service connection.
 $privateEndpointConnection = New-AzPrivateLinkServiceConnection `
         -Name "$dnsRecordName-Connection" `
         -PrivateLinkServiceId $privateLinkResourceId `
         -GroupId $groupId `
         -ErrorAction Stop
 
 # Create a new private endpoint.
 $privateEndpoint = New-AzPrivateEndpoint `
         -ResourceGroupName $resourceGroupName `
         -Name "$dnsRecordName-PrivateEndpoint" `
         -Location $virtualNetwork.Location `
         -Subnet $subnet `
         -PrivateLinkServiceConnection $privateEndpointConnection `
         -ErrorAction Stop
```

Link the Azure private DNS zone to the virtual network so clients resolve the file share's original host name to the private endpoint's IP address. The following steps apply to both resource providers.

```PowerShell
 # Get the host name suffix (core.windows.net for public cloud).
 # This is done like this so this script will seamlessly work for non-public Azure.
 $hostNameSuffix = Get-AzContext | `
     Select-Object -ExpandProperty Environment | `
     Select-Object -ExpandProperty StorageEndpointSuffix
 
 # For public cloud, this will generate the following DNS suffix:
 # privatelink.file.core.windows.net.
 $dnsZoneName = "privatelink.file.$hostNameSuffix"
 
 # Find a DNS zone matching desired name attached to this virtual network.
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

Now that you have a reference to the private DNS zone, you must create a record.

```PowerShell
 $privateEndpointIP = $privateEndpoint | `
     Select-Object -ExpandProperty NetworkInterfaces | `
     Select-Object @{ 
         Name = "NetworkInterfaces"; 
         Expression = { Get-AzNetworkInterface -ResourceId $_.Id } 
     } | `
     Select-Object -ExpandProperty NetworkInterfaces | `
     Select-Object -ExpandProperty IpConfigurations | `
     Select-Object -ExpandProperty PrivateIpAddress
 
 $privateDnsRecordConfig = New-AzPrivateDnsRecordConfig `
         -IPv4Address $privateEndpointIP
 
 New-AzPrivateDnsRecordSet `
         -ResourceGroupName $virtualNetworkResourceGroupName `
         -Name $dnsRecordName `
         -RecordType A `
         -ZoneName $dnsZoneName `
         -Ttl 600 `
         -PrivateDnsRecords $privateDnsRecordConfig `
         -ErrorAction Stop | `
     Out-Null
```

# [Azure CLI](#tab/azure-cli)

To create a private endpoint, first get a reference to your storage account or file share, plus the virtual network subnet where you want to add the private endpoint. Replace the placeholder values in the following steps with your own values.

::: zone pivot="microsoft-storage"

Get a reference to the storage account:

```bash
storageAccountResourceGroupName="<storage-account-resource-group-name>"
storageAccountName="<storage-account-name>"

# Get storage account ID
privateLinkResourceId=$(az storage account show \
        --resource-group $storageAccountResourceGroupName \
        --name $storageAccountName \
        --query "id" --output tsv)

# Set common variables for private endpoint creation
resourceGroupName=$storageAccountResourceGroupName
groupId="file"
dnsRecordName=$storageAccountName
```

::: zone-end

::: zone pivot="microsoft-fileshares"

Get a reference to the file share:

```bash
# Install the fileshare extension
az extension add --name fileshare

fileShareResourceGroupName="<resource-group-name>"
fileShareName="<file-share-name>"

# Get the file share resource ID and host name
privateLinkResourceId=$(az fileshare show \
        --resource-group $fileShareResourceGroupName \
        --name $fileShareName \
        --query "id" --output tsv)

hostName=$(az fileshare show \
        --resource-group $fileShareResourceGroupName \
        --name $fileShareName \
        --query "properties.hostName" --output tsv)

hostNamePrefix=$(echo $hostName | cut -d'.' -f1)

# Set common variables for private endpoint creation
resourceGroupName=$fileShareResourceGroupName
groupId="FileShare"
dnsRecordName=$hostNamePrefix
```

::: zone-end

After setting the common variables, the remaining steps are the same for both experiences. Get references to the virtual network and subnet:

```bash
virtualNetworkResourceGroupName="<vnet-resource-group-name>"
virtualNetworkName="<vnet-name>"
subnetName="<vnet-subnet-name>"

virtualNetwork=$(az network vnet show \
        --resource-group $virtualNetworkResourceGroupName \
        --name $virtualNetworkName \
        --query "id" --output tsv)

subnet=$(az network vnet subnet show \
        --resource-group $virtualNetworkResourceGroupName \
        --vnet-name $virtualNetworkName \
        --name $subnetName \
        --query "id" --output tsv)
```

To create a private endpoint, ensure the subnet's private endpoint network policy is disabled, and then create the private endpoint with `az network private-endpoint create`.

```bash
# Disable private endpoint network policies
az network vnet subnet update \
        --ids $subnet \
        --disable-private-endpoint-network-policies \
        --output none

# Get virtual network location
region=$(az network vnet show \
        --ids $virtualNetwork \
        --query "location" --output tsv)

# Create a private endpoint
privateEndpoint=$(az network private-endpoint create \
        --resource-group $resourceGroupName \
        --name "$dnsRecordName-PrivateEndpoint" \
        --location $region \
        --subnet $subnet \
        --private-connection-resource-id $privateLinkResourceId \
        --group-id $groupId \
        --connection-name "$dnsRecordName-Connection" \
        --query "id" --output tsv)
```

Link the Azure private DNS zone to the virtual network so clients resolve the file share's original host name to the private endpoint's IP address. The following steps apply to both resource providers.

```bash
# Get the desired storage account suffix (core.windows.net for public cloud).
# This is done so the script will work for non-public Azure clouds.
storageAccountSuffix=$(az cloud show \
        --query "suffixes.storageEndpoint" --output tsv)

# For public cloud, this generates the DNS suffix:
# privatelink.file.core.windows.net.
dnsZoneName="privatelink.file.$storageAccountSuffix"

# Find a DNS zone matching the desired name attached to this virtual network.
possibleDnsZones=$(az network private-dns zone list \
        --query "[?name == '$dnsZoneName'].id" \
        --output tsv)

dnsZone=""
for possibleDnsZone in $possibleDnsZones
do
    possibleResourceGroupName=$(az resource show \
            --ids $possibleDnsZone \
            --query "resourceGroup" --output tsv)

    link=$(az network private-dns link vnet list \
            --resource-group $possibleResourceGroupName \
            --zone-name $dnsZoneName \
            --query "[?virtualNetwork.id == '$virtualNetwork'].id" \
            --output tsv)

    if [ -n "$link" ]
    then
        dnsZoneResourceGroup=$possibleResourceGroupName
        dnsZone=$possibleDnsZone
        break
    fi
done

if [ -z "$dnsZone" ]
then
    # No matching DNS zone attached to the virtual network, so create a new one.
    dnsZone=$(az network private-dns zone create \
            --resource-group $virtualNetworkResourceGroupName \
            --name $dnsZoneName \
            --query "id" --output tsv)

    az network private-dns link vnet create \
            --resource-group $virtualNetworkResourceGroupName \
            --zone-name $dnsZoneName \
            --name "$virtualNetworkName-DnsLink" \
            --virtual-network $virtualNetwork \
            --registration-enabled false \
            --output none

    dnsZoneResourceGroup=$virtualNetworkResourceGroupName
fi
```

Now that you have a reference to the private DNS zone, create an A record.

```bash
privateEndpointNIC=$(az network private-endpoint show \
        --ids $privateEndpoint \
        --query "networkInterfaces[0].id" --output tsv)

privateEndpointIP=$(az network nic show \
        --ids $privateEndpointNIC \
        --query "ipConfigurations[0].privateIPAddress" --output tsv)

az network private-dns record-set a create \
        --resource-group $dnsZoneResourceGroup \
        --zone-name $dnsZoneName \
        --name $dnsRecordName \
        --output none

az network private-dns record-set a add-record \
        --resource-group $dnsZoneResourceGroup \
        --zone-name $dnsZoneName \
        --record-set-name $dnsRecordName \
        --ipv4-address $privateEndpointIP \
        --output none
```

---

## Verify connectivity

Run the checks from a client in the virtual network, or from a connected network with DNS configured to resolve the private endpoint. For the differences between resource providers, see [DNS resolution](storage-files-networking-overview.md#dns-resolution). Use the original host name to mount the share, not the `privatelink` name.

# [Portal](#tab/azure-portal)

Run the following DNS lookup from PowerShell, the command line, or a terminal on Windows, Linux, or macOS.

::: zone pivot="microsoft-storage"

Replace `<storage-account-name>` with the appropriate storage account name:

```
nslookup <storage-account-name>.file.core.windows.net
```

If successful, you see output similar to the following, where `192.168.0.5` is the private IP address of the private endpoint in your virtual network (output shown for Windows).

```Output
Server:  UnKnown
Address:  10.2.4.4

Non-authoritative answer:
Name:    storageaccount.privatelink.file.core.windows.net
Address:  192.168.0.5
Aliases:  storageaccount.file.core.windows.net
```

::: zone-end

::: zone pivot="microsoft-fileshares"

Use the file share's host name. In the overview tab of the file share, select **JSON view** from the upper right. In the JSON view, under properties, copy the value for **hostName**. The format looks like `fs-xxxxxxxxxxxxxxxxx.xx.file.storage.azure.net`.

```
nslookup <file-share-host-name>
```

If successful, you see output similar to the following, where `192.168.0.5` is the private IP address of the private endpoint in your virtual network (output shown for Windows).

```Output
Server:  UnKnown
Address:  10.2.4.4

Non-authoritative answer:
Name:    <hostNamePrefix>.privatelink.file.core.windows.net
Address:  192.168.0.5
Aliases:  <hostNamePrefix>.<zone>.file.storage.azure.net
```

::: zone-end

# [PowerShell](#tab/azure-powershell)

Run the following PowerShell commands to verify DNS resolution:

::: zone pivot="microsoft-storage"

```PowerShell
$storageAccountHostName = [System.Uri]::new($storageAccount.PrimaryEndpoints.file) | `
        Select-Object -ExpandProperty Host

Resolve-DnsName -Name $storageAccountHostName
```

If successful, you see output similar to the following, where `192.168.0.5` is the private IP address of the private endpoint in your virtual network.

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

::: zone-end

::: zone pivot="microsoft-fileshares"

```PowerShell
Resolve-DnsName -Name $fileShare.HostName
```

If successful, you see output similar to the following, where `192.168.0.5` is the private IP address of the private endpoint in your virtual network.

```Output
Name                                       Type   TTL   Section    NameHost
----                                       ----   ---   -------    --------
<hostNamePrefix>.<zone>.file.storage.azur  CNAME  60    Answer     <hostNamePrefix>.privatelink.file.core.windows.net
e.net

Name       : <hostNamePrefix>.privatelink.file.core.windows.net
QueryType  : A
TTL        : 600
Section    : Answer
IP4Address : 192.168.0.5
```

::: zone-end

# [Azure CLI](#tab/azure-cli)

Run the following commands to retrieve the host name and verify DNS resolution:

::: zone pivot="microsoft-storage"

```bash
httpEndpoint=$(az storage account show \
        --resource-group $storageAccountResourceGroupName \
        --name $storageAccountName \
        --query "primaryEndpoints.file" --output tsv)

hostName=$(echo $httpEndpoint | cut -c7-$(expr length $httpEndpoint) | tr -d "/")
nslookup $hostName
```

If successful, you see output similar to the following, where `192.168.0.5` is the private IP address of the private endpoint in your virtual network. You should still use the original host name (`storageaccount.file.core.windows.net`) to mount your file share instead of the `privatelink` path.

```Output
Server:         127.0.0.53
Address:        127.0.0.53#53

Non-authoritative answer:
storageaccount.file.core.windows.net      canonical name = storageaccount.privatelink.file.core.windows.net.
Name:   storageaccount.privatelink.file.core.windows.net
Address: 192.168.0.5
```

::: zone-end

::: zone pivot="microsoft-fileshares"

```bash
hostName=$(az fileshare show \
        --resource-group $fileShareResourceGroupName \
        --name $fileShareName \
        --query "properties.hostName" --output tsv)

nslookup $hostName
```

If successful, you see output similar to the following, where `192.168.0.5` is the private IP address of the private endpoint in your virtual network. You should still use the file share's original `hostName` to mount your file share instead of the `privatelink` path.

```Output
Server:         127.0.0.53
Address:        127.0.0.53#53

Non-authoritative answer:
<hostNamePrefix>.<zone>.file.storage.azure.net      canonical name = <hostNamePrefix>.privatelink.file.core.windows.net.
Name:   <hostNamePrefix>.privatelink.file.core.windows.net
Address: 192.168.0.5
```

::: zone-end
---

## Restrict public endpoint access

You can disable public network access or keep it enabled for selected networks. These are separate configurations. Private endpoints continue to work in either configuration.

For classic file shares, configure public access on the storage account. For Microsoft.FileShares, configure it on the individual file share. Classic file shares can also use a [network security perimeter](files-network-security-perimeter.md), subject to its protocol limitations. In Enforced mode, a perimeter blocks NFS traffic through service endpoints.

### Disable access to the public endpoint

When you disable public network access, clients can't connect through the public endpoint, including through service endpoints. Clients can still connect through private endpoints. This setting doesn't restrict outbound traffic from the clients.

> [!NOTE]
> For classic file shares, existing trusted service and resource instance exceptions can remain in effect after you disable public network access. Review these exceptions if you require access only through private endpoints. See [Azure Storage network security limitations](../common/storage-network-security-limitations.md?toc=/azure/storage/files/toc.json#general-guidelines-and-limitations).

# [Portal](#tab/azure-portal)

::: zone pivot="microsoft-storage"

To disable public network access for classic file shares, follow these steps:

1. Go to the storage account where you want to restrict all inbound access to the public endpoint.
1. From the service menu, under **Security + networking**, select **Networking**.
1. Under **Public network access**, select **Manage**.
1. Select **Disable**, and then select **Proceed**.
1. Select **Save**.

:::image type="content" source="media/storage-files-networking-endpoints/disable-public-network-access.png" alt-text="Screenshot showing how to disable public network access on a storage account." lightbox="media/storage-files-networking-endpoints/disable-public-network-access.png":::

::: zone-end

::: zone pivot="microsoft-fileshares"

Go to the file share where you want to disable public access. In the service menu, under **Settings**, select **Configuration**. Set **Public network access** to **Disabled**, and then select **Save**.

::: zone-end

# [PowerShell](#tab/azure-powershell)

::: zone pivot="microsoft-storage"

For classic file shares, set `-PublicNetworkAccess` to `Disabled` on the storage account.

```PowerShell
# Use the storage account variables from the beginning of this guide.
Set-AzStorageAccount `
        -ResourceGroupName $storageAccountResourceGroupName `
        -Name $storageAccountName `
        -PublicNetworkAccess Disabled `
        -ErrorAction Stop |
    Out-Null
```

::: zone-end

::: zone pivot="microsoft-fileshares"

Set `-PublicNetworkAccess` to `Disabled` on the file share.

```PowerShell
# To learn more about the Az.FileShare module, see https://www.powershellgallery.com/packages/Az.FileShare/1.0.0
Install-Module -Name Az.FileShare -Repository PSGallery -RequiredVersion 1.0.0

$fileShareResourceGroupName = "<resource-group-name>"
$fileShareName = "<file-share-name>"

Update-AzFileShare `
        -ResourceGroupName $fileShareResourceGroupName `
        -ResourceName $fileShareName `
        -PublicNetworkAccess Disabled
```

::: zone-end

# [Azure CLI](#tab/azure-cli)

::: zone pivot="microsoft-storage"

For classic file shares, set `--public-network-access` to `Disabled` on the storage account.

```bash
# This assumes $storageAccountResourceGroupName and $storageAccountName
# are still defined from the beginning of this guide.
az storage account update \
    --resource-group $storageAccountResourceGroupName \
    --name $storageAccountName \
    --public-network-access Disabled \
    --output none
```

::: zone-end

::: zone pivot="microsoft-fileshares"

Set `--public-network-access` to `Disabled` on the file share.

```bash
# Install the fileshare extension
az extension add --name fileshare

fileShareResourceGroupName="<resource-group-name>"
fileShareName="<file-share-name>"

az fileshare update \
    --name $fileShareName \
    --resource-group $fileShareResourceGroupName \
    --public-network-access Disabled
```

::: zone-end

---

### Restrict access to the public endpoint to specific networks

To allow clients from selected subnets, keep public network access enabled, enable service endpoints on those subnets, and add the subnets to the resource's network rules. You can use service endpoints with or without private endpoints. Classic SMB and FileREST access can also use IP address rules; NFS access requires allowed subnets.

The PowerShell and CLI examples assume public network access is already enabled. The Microsoft.FileShares examples also assume the client subnet already has the `Microsoft.Storage` service endpoint. To configure that endpoint, see [Enable service endpoints on a subnet](../../virtual-network/virtual-network-service-endpoints-overview.md#configuration).

# [Portal](#tab/azure-portal)

::: zone pivot="microsoft-storage"

For classic file shares, follow these steps to restrict the public endpoint to specific networks.

1. Go to the storage account where you want to restrict the public endpoint to specific networks.
1. From the service menu, under **Security + networking**, select **Networking**.
1. Under **Public network access scope**, select **Enable from selected networks**. This selection reveals a number of settings for controlling the restriction of the public endpoint. 
1. Under **Virtual networks**, select **Add a virtual network** > **Add existing virtual network** to select the virtual network that should be allowed to access the storage account through the public endpoint. Select a virtual network and a subnet for that virtual network, and then select **Enable**. If you want to create a new virtual network for this purpose, select **Add a virtual network** > **Add new virtual network**, provide the details, and then select **Create**.
1. For SMB or FileREST access, use **IPv4 Addresses** to specify any public internet IP addresses that you want to allow. IP address rules don't grant NFS access.
1. If a service integration requires trusted service access, select the **Allow trusted Microsoft services to access this resource** checkbox.
1. Select **Save**.

:::image type="content" source="media/storage-files-networking-endpoints/restrict-public-endpoint.png" alt-text="Screenshot showing how to restrict a storage account's public endpoint to selected networks." lightbox="media/storage-files-networking-endpoints/restrict-public-endpoint.png":::

::: zone-end

::: zone pivot="microsoft-fileshares"

Go to the file share where you want to restrict public access. From the service menu, under **Settings**, select **Configuration**. Under **Public network access**, select **Enabled from selected virtual networks**, add the virtual networks and subnets allowed to access the share, and select **Save**.

::: zone-end

# [PowerShell](#tab/azure-powershell)

::: zone pivot="microsoft-storage"

For classic file shares, restrict access to the storage account's public endpoint to specific virtual networks by using service endpoints. First, collect information about the storage account and virtual network. Replace the placeholder values in the following steps with your own values.

```PowerShell
$storageAccountResourceGroupName = "<storage-account-resource-group>"
$storageAccountName = "<storage-account-name>"
$restrictToVirtualNetworkResourceGroupName = "<vnet-resource-group-name>"
$restrictToVirtualNetworkName = "<vnet-name>"
$subnetName = "<subnet-name>"

$storageAccount = Get-AzStorageAccount `
        -ResourceGroupName $storageAccountResourceGroupName `
        -Name $storageAccountName `
        -ErrorAction Stop

$virtualNetwork = Get-AzVirtualNetwork `
        -ResourceGroupName $restrictToVirtualNetworkResourceGroupName `
        -Name $restrictToVirtualNetworkName `
        -ErrorAction Stop

$subnet = $virtualNetwork | `
    Select-Object -ExpandProperty Subnets | `
    Where-Object { $_.Name -eq $subnetName }

if ($null -eq $subnet) {
    Write-Error `
            -Message "Subnet $subnetName not found in virtual network $restrictToVirtualNetworkName." `
            -ErrorAction Stop
}
```

To allow traffic from the virtual network, the Azure network fabric must expose the `Microsoft.Storage` service endpoint to the virtual network's subnet. The following PowerShell commands add the `Microsoft.Storage` service endpoint to the subnet if it's not already there.

```PowerShell
$serviceEndpoints = $subnet | `
    Select-Object -ExpandProperty ServiceEndpoints | `
    Select-Object -ExpandProperty Service

if ($serviceEndpoints -notcontains "Microsoft.Storage") {
    if ($null -eq $serviceEndpoints) {
        $serviceEndpoints = @("Microsoft.Storage")
    } elseif ($serviceEndpoints -is [string]) {
        $serviceEndpoints = @($serviceEndpoints, "Microsoft.Storage")
    } else {
        $serviceEndpoints += "Microsoft.Storage"
    }

    $virtualNetwork = $virtualNetwork | Set-AzVirtualNetworkSubnetConfig `
            -Name $subnetName `
            -AddressPrefix $subnet.AddressPrefix `
            -ServiceEndpoint $serviceEndpoints `
            -WarningAction SilentlyContinue `
            -ErrorAction Stop | `
        Set-AzVirtualNetwork `
            -ErrorAction Stop
}
```

The final step in restricting traffic to the storage account is to create a networking rule and add it to the storage account's network rule set.

```PowerShell
$networkRule = $storageAccount | Add-AzStorageAccountNetworkRule `
    -VirtualNetworkResourceId $subnet.Id `
    -ErrorAction Stop

$storageAccount | Update-AzStorageAccountNetworkRuleSet `
        -DefaultAction Deny `
        -VirtualNetworkRule $networkRule `
        -WarningAction SilentlyContinue `
        -ErrorAction Stop | `
    Out-Null
```

These commands preserve existing bypass settings. If an integration requires trusted service access, add `-Bypass AzureServices` to the update command. The parameter replaces the bypass setting, so include any other bypass options that your workload still requires.

::: zone-end

::: zone pivot="microsoft-fileshares"

Pass the allowed subnet resource IDs to `Update-AzFileShare` by using `-AllowedSubnet`. Network rules apply directly to the file share, so there's no storage account to configure. The client subnet still needs a service endpoint, as described in the prerequisites above.

```PowerShell
# To learn more about the Az.FileShare module, see https://www.powershellgallery.com/packages/Az.FileShare/1.0.0
Install-Module -Name Az.FileShare -Repository PSGallery -RequiredVersion 1.0.0

$fileShareResourceGroupName = "<resource-group-name>"
$fileShareName = "<file-share-name>"
$virtualNetworkResourceGroupName = "<vnet-resource-group-name>"
$virtualNetworkName = "<vnet-name>"
$subnetName = "<subnet-name>"

$subnet = Get-AzVirtualNetwork `
        -ResourceGroupName $virtualNetworkResourceGroupName `
        -Name $virtualNetworkName | `
    Select-Object -ExpandProperty Subnets | `
    Where-Object { $_.Name -eq $subnetName }

Update-AzFileShare `
        -ResourceGroupName $fileShareResourceGroupName `
        -ResourceName $fileShareName `
        -AllowedSubnet @($subnet.Id)
```

::: zone-end

# [Azure CLI](#tab/azure-cli)

::: zone pivot="microsoft-storage"

For classic file shares, restrict access to the storage account's public endpoint to specific virtual networks by using service endpoints. First, collect information about the storage account and virtual network. Replace the placeholder values in the following steps with your own values.

```bash
storageAccountResourceGroupName="<storage-account-resource-group>"
storageAccountName="<storage-account-name>"
restrictToVirtualNetworkResourceGroupName="<vnet-resource-group-name>"
restrictToVirtualNetworkName="<vnet-name>"
subnetName="<subnet-name>"

storageAccount=$(az storage account show \
        --resource-group $storageAccountResourceGroupName \
        --name $storageAccountName \
        --query "id" --output tsv)

virtualNetwork=$(az network vnet show \
        --resource-group $restrictToVirtualNetworkResourceGroupName \
        --name $restrictToVirtualNetworkName \
        --query "id" --output tsv)

subnet=$(az network vnet subnet show \
        --resource-group $restrictToVirtualNetworkResourceGroupName \
        --vnet-name $restrictToVirtualNetworkName \
        --name $subnetName \
        --query "id" --output tsv)
```

To allow traffic from the virtual network, the Azure network fabric must expose the `Microsoft.Storage` service endpoint to the virtual network's subnet. The following CLI commands add the `Microsoft.Storage` service endpoint to the subnet if it's not already there.

```bash
serviceEndpoints=$(az network vnet subnet show \
        --resource-group $restrictToVirtualNetworkResourceGroupName \
        --vnet-name $restrictToVirtualNetworkName \
        --name $subnetName \
        --query "serviceEndpoints[].service" \
        --output tsv)

foundStorageServiceEndpoint=false
for serviceEndpoint in $serviceEndpoints
do
    if [ $serviceEndpoint = "Microsoft.Storage" ]
    then
        foundStorageServiceEndpoint=true
    fi
done

if [ $foundStorageServiceEndpoint = false ]
then
    serviceEndpointList=""

    for serviceEndpoint in $serviceEndpoints
    do
        serviceEndpointList+=$serviceEndpoint
        serviceEndpointList+=" "
    done

    serviceEndpointList+="Microsoft.Storage"

    az network vnet subnet update \
            --ids $subnet \
            --service-endpoints $serviceEndpointList \
            --output none
fi
```

The final step in restricting traffic to the storage account is to create a networking rule and add it to the storage account's network rule set.

```bash
az storage account network-rule add \
        --resource-group $storageAccountResourceGroupName \
        --account-name $storageAccountName \
        --subnet $subnet \
        --output none

az storage account update \
        --resource-group $storageAccountResourceGroupName \
        --name $storageAccountName \
        --default-action "Deny" \
        --output none
```

These commands preserve existing bypass settings. If an integration requires trusted service access, add `--bypass AzureServices` to the update command. The option replaces the bypass setting, so include any other bypass options that your workload still requires.

::: zone-end

::: zone pivot="microsoft-fileshares"

Pass the allowed subnet resource IDs to `az fileshare update` by using `--allowed-subnets`. Network rules apply directly to the file share, so there's no storage account to configure. The client subnet still needs a service endpoint, as described in the prerequisites above.

```bash
# Install the fileshare extension
az extension add --name fileshare

fileShareResourceGroupName="<resource-group-name>"
fileShareName="<file-share-name>"
virtualNetworkResourceGroupName="<vnet-resource-group-name>"
virtualNetworkName="<vnet-name>"
subnetName="<subnet-name>"

subnetId=$(az network vnet subnet show \
        --resource-group $virtualNetworkResourceGroupName \
        --vnet-name $virtualNetworkName \
        --name $subnetName \
        --query "id" --output tsv)

az fileshare update \
        --name $fileShareName \
        --resource-group $fileShareResourceGroupName \
        --allowed-subnets $subnetId
```

::: zone-end

---

### Restrict outbound access to specific storage accounts

Network rules for a file share control inbound access. They don't limit which other storage resources clients can access. For classic file shares, you can optionally use a [service endpoint policy](../../virtual-network/virtual-network-service-endpoint-policies-overview.md) to limit which storage accounts clients in a subnet can access through service endpoints. The policy filters destinations for traffic that bypasses Azure Firewall and network virtual appliances. It doesn't restrict other outbound paths or replace the destination's network rules and authorization requirements. For more information, see [Restrict outbound access with service endpoint policies](storage-files-networking-overview.md#restrict-outbound-access-with-service-endpoint-policies).

> [!IMPORTANT]
> Service endpoint policies aren't currently supported for Microsoft.FileShares file shares. A policy on the client subnet blocks access to those file shares through service endpoints, even if it allows their subscription or resource group. This restriction also applies to subnets that access both classic and Microsoft.FileShares file shares. Clients in that subnet must use a [private endpoint](#create-a-private-endpoint) to access Microsoft.FileShares file shares.

::: zone pivot="microsoft-storage"

A service endpoint policy defines the allowed storage destinations for clients in the associated subnet. It blocks those clients from accessing other storage accounts through service endpoints. Keep these points in mind:

- Add every storage account that clients in the subnet use before you associate the policy with the subnet. This list includes storage accounts that other workloads in the subnet use.
- The service endpoint policy must be in the same region and subscription as the virtual network.
- A policy can contain only one policy definition for the `Microsoft.Storage` service. To allow more storage accounts, add their resource IDs to the same policy definition. You can also allow all storage accounts in a resource group or subscription.
- After you associate a policy with a subnet, the policy applies to traffic to storage accounts in all regions.
- These steps assume that the subnet has no service endpoint policies. If policies are already associated, review and update those policies instead of replacing their associations. The PowerShell and CLI examples stop if they find existing associations.

# [Portal](#tab/azure-portal)

To create a service endpoint policy and associate it with a subnet, follow these steps. For detailed steps, see [Create and associate service endpoint policies](../../virtual-network/virtual-network-service-endpoint-policies.md).

1. In the search box at the top of the Azure portal, enter **Service endpoint policy**. Select **Service endpoint policies** in the search results.
1. Select **+ Create**.
1. On the **Basics** tab, select the subscription and region of your virtual network. Select a resource group, and enter a name for the policy.
1. Select **Next: Policy definitions**.
1. Select **+ Add a resource**. For **Service**, select **Microsoft.Storage**. For **Scope**, select **Single account**, and then select the storage account that contains your file shares. Select **Add**. Repeat this step for each storage account that clients in the subnet use.
1. Select **Review + Create**, and then select **Create**.
1. Go to the new service endpoint policy. From the service menu, under **Settings**, select **Associated subnets**.
1. Select **+ Edit subnet association**, select the virtual network and subnet, and then select **Apply**.

# [PowerShell](#tab/azure-powershell)

The following PowerShell commands create a service endpoint policy and associate it with a subnet. The policy limits client access from that subnet to one storage account through the service endpoint. The subnet must already have the `Microsoft.Storage` service endpoint. Replace the placeholder values with your own values.

```PowerShell
$storageAccountResourceGroupName = "<storage-account-resource-group>"
$storageAccountName = "<storage-account-name>"
$virtualNetworkResourceGroupName = "<vnet-resource-group-name>"
$virtualNetworkName = "<vnet-name>"
$subnetName = "<subnet-name>"
$policyName = "<service-endpoint-policy-name>"

$storageAccount = Get-AzStorageAccount `
        -ResourceGroupName $storageAccountResourceGroupName `
        -Name $storageAccountName `
        -ErrorAction Stop

$virtualNetwork = Get-AzVirtualNetwork `
        -ResourceGroupName $virtualNetworkResourceGroupName `
        -Name $virtualNetworkName `
        -ErrorAction Stop

$subnet = $virtualNetwork.Subnets | Where-Object { $_.Name -eq $subnetName }
if ($null -eq $subnet) {
    throw "Subnet '$subnetName' wasn't found in virtual network '$virtualNetworkName'."
}

if ($subnet.ServiceEndpointPolicies.Count -gt 0) {
    throw "The subnet already has service endpoint policies. Review and update them before changing the configuration."
}

# To allow clients to access more storage accounts, add their resource IDs to -ServiceResource.
$policyDefinition = New-AzServiceEndpointPolicyDefinition `
        -Name "allowed-storage-accounts" `
        -Service "Microsoft.Storage" `
        -ServiceResource @($storageAccount.Id) `
        -ErrorAction Stop

$policy = New-AzServiceEndpointPolicy `
        -ResourceGroupName $virtualNetworkResourceGroupName `
        -Name $policyName `
        -Location $virtualNetwork.Location `
        -ServiceEndpointPolicyDefinition $policyDefinition `
        -ErrorAction Stop

$subnet.ServiceEndpointPolicies = @($policy)
$virtualNetwork | Set-AzVirtualNetwork -ErrorAction Stop | Out-Null
```

# [Azure CLI](#tab/azure-cli)

The following CLI commands create a service endpoint policy and associate it with a subnet. The policy limits client access from that subnet to one storage account through the service endpoint. The subnet must already have the `Microsoft.Storage` service endpoint. Replace the placeholder values with your own values.

```bash
storageAccountResourceGroupName="<storage-account-resource-group>"
storageAccountName="<storage-account-name>"
virtualNetworkResourceGroupName="<vnet-resource-group-name>"
virtualNetworkName="<vnet-name>"
subnetName="<subnet-name>"
policyName="<service-endpoint-policy-name>"

existingPolicyIds=$(az network vnet subnet show \
        --resource-group $virtualNetworkResourceGroupName \
        --vnet-name $virtualNetworkName \
        --name $subnetName \
        --query "serviceEndpointPolicies[].id" --output tsv) || exit 1

if [ -n "$existingPolicyIds" ]; then
    echo "The subnet already has service endpoint policies. Review and update them before changing the configuration." >&2
    exit 1
fi

storageAccountId=$(az storage account show \
        --resource-group $storageAccountResourceGroupName \
        --name $storageAccountName \
        --query "id" --output tsv) || exit 1

location=$(az network vnet show \
        --resource-group $virtualNetworkResourceGroupName \
        --name $virtualNetworkName \
        --query "location" --output tsv) || exit 1

az network service-endpoint policy create \
        --resource-group $virtualNetworkResourceGroupName \
        --name $policyName \
        --location $location \
        --output none || exit 1

# To allow clients to access more storage accounts, add their resource IDs to --service-resources.
az network service-endpoint policy-definition create \
        --resource-group $virtualNetworkResourceGroupName \
        --policy-name $policyName \
        --name "allowed-storage-accounts" \
        --service "Microsoft.Storage" \
        --service-resources $storageAccountId \
        --output none || exit 1

az network vnet subnet update \
        --resource-group $virtualNetworkResourceGroupName \
        --vnet-name $virtualNetworkName \
        --name $subnetName \
        --service-endpoint-policy $policyName \
        --output none || exit 1
```

---

::: zone-end

::: zone pivot="microsoft-fileshares"

To access a Microsoft.FileShares file share from a subnet that has a service endpoint policy, [create a private endpoint](#create-a-private-endpoint) for the file share. Service endpoint policies don't apply to traffic that goes through a private endpoint.

::: zone-end

## See also

- [Azure Files networking considerations](storage-files-networking-overview.md)
- [Configure DNS forwarding for classic file shares](storage-files-networking-dns.md)
- [Azure private endpoint DNS integration](../../private-link/private-endpoint-dns-integration.md)
- [Configure site-to-site VPN for classic file shares](storage-files-configure-s2s-vpn.md)
