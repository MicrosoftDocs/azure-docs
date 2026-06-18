---
title: Configure Azure Files Network Endpoints
description: Learn how to configure public and private network endpoints for Server Message Block (SMB) and Network File System (NFS) Azure file shares. Restrict access by setting up a privatelink.
author: khdownie
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 06/17/2026
ms.author: kendownie
ms.custom: devx-track-azurepowershell, devx-track-azurecli
# Customer intent: "As a cloud administrator, I want to configure network endpoints for Azure file shares, so that I can manage access and enhance security for my organization's data storage solutions."
---

# Configure network endpoints for accessing Azure file shares

:heavy_check_mark: **Applies to:** Classic file shares created with the Microsoft.Storage resource provider

:heavy_check_mark: **Applies to:** File shares created with the Microsoft.FileShares resource provider

Azure Files provides two main types of endpoints for accessing Azure file shares:

- Public endpoints, which have a public IP address and you can access from anywhere in the world.
- Private endpoints, which exist within a virtual network and have a private IP address from within the address space of that virtual network.

For classic file shares (created with the `Microsoft.Storage` resource provider), the Azure storage account has public and private endpoints. For file shares created with the `Microsoft.FileShares` resource provider, you create public and private endpoints at the file share level rather than the storage account level.

This article focuses on how to configure a private endpoint for accessing the Azure file share directly. Much of this article also applies to how Azure File Sync interoperates with public and private endpoints for the storage account. For more information about networking considerations for Azure File Sync, see [configuring Azure File Sync proxy and firewall settings](../file-sync/file-sync-firewall-and-proxy.md).

Before reading this guide, review [Azure Files networking considerations](storage-files-networking-overview.md).

## Prerequisites

- This article assumes that you already created an Azure subscription. If you don't already have a subscription, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- This article assumes that you already created an Azure file share in a storage account that you want to connect to from on-premises. To learn how to create an Azure file share, see [Create an Azure file share](storage-how-to-create-file-share.md).
- If you intend to use Azure PowerShell, [install the latest version](/powershell/azure/install-azure-powershell).
- If you intend to use the Azure CLI, [install the latest version](/cli/azure/install-azure-cli).

## Endpoint configurations

You can configure your endpoints to restrict network access to your storage account. To restrict access to a storage account to a virtual network, use one of the following approaches:

- [Create one or more private endpoints](#create-a-private-endpoint) and restrict all access to the public endpoint. This approach ensures that only traffic originating from within the desired virtual networks can access the Azure file shares. See [Private Link cost](https://azure.microsoft.com/pricing/details/private-link/).
- [Restrict the public endpoint to one or more virtual networks](#restrict-public-endpoint-access). This approach uses a capability of the virtual network called *service endpoints*. When you restrict the traffic to a storage account through a service endpoint, you're accessing the storage account through the public IP address, but access is only possible from the locations you specify in your configuration.

### Create a private endpoint

When you create a private endpoint for your file shares, you deploy the following Azure resources:

- **A private endpoint**: An Azure resource that represents the private endpoint. You can think of this resource as a connector between a target resource and a network interface.
- **A network interface (NIC)**: The network interface that maintains a private IP address within the specified virtual network and subnet. This resource is the same as the one you deploy when you deploy a virtual machine (VM). However, instead of assigning it to a VM, the private endpoint owns it.
- **A private Domain Name System (DNS) zone**: If you didn't previously deploy a private endpoint for this virtual network, a new private DNS zone is deployed for your virtual network. A DNS record is also created in this DNS zone. If you already deployed a private endpoint in this virtual network, a new record is added to the existing DNS zone. Deploying a DNS zone is optional. However, it's highly recommended, and required if you're mounting your Azure file shares with an AD service principal or using the FileREST API.

> [!NOTE]
> This article uses the DNS suffix for the Azure public regions, `core.windows.net`. This commentary also applies to Azure Sovereign clouds such as the Azure US Government cloud and the Azure operated by 21Vianet cloud. Just substitute the appropriate suffixes for your environment.

#### Classic vs. new file share experience
 
 The private endpoint creation process differs slightly depending on whether you're using classic file shares or the new file share:
 
 | | Classic file shares (`Microsoft.Storage`) | New file shares (`Microsoft.FileShares`) |
 |---|---|---|
 | **Private endpoint target** | Storage account | File share |
 | **Resource cmdlet** | `Get-AzStorageAccount` | `Get-AzFileShare` |
 | **Group ID (sub-resource)** | `file` | `FileShare` |
 | **DNS A record name** | Storage account name | Host name prefix (for example, `fs-xxxxxxxxxxxxxxxxx`) |
 
 The virtual network setup, private endpoint creation, and DNS zone configuration steps are identical for both experiences. Only the resource reference, group ID, and DNS record name differ.

# [Portal](#tab/azure-portal)
Go to the resource group where you want to create a private endpoint. Select **+ Create** and search for **Private Endpoint**. Select the private endpoint resource, and then select **Create**.

The wizard has multiple pages to complete.

In the **Basics** page, select the subscription, resource group, name, network interface name, and region for your private endpoint. You must create the private endpoint in the same region as the virtual network you want to create the private endpoint in. Then select **Next: Resource**.

[![Screenshot showing how to provide the project and instance details for a new private endpoint.](../../../includes/media/storage-files-networking-endpoints-private-portal/private-endpoint-basics.png)](../../../includes/media/storage-files-networking-endpoints-private-portal/private-endpoint-basics.png#lightbox)

If you're using classic file shares: 

In the **Resource** page, choose **Microsoft.Storage/storageAccounts** from the drop-down menu for the resource type. Then select the specific storage account you want to connect to as Resource. The target sub-resource auto-populates with `file`. Then select **Next: Virtual Network**.

If you're using the new file share: 

In the **Resource** page, choose **Microsoft.FileShares/fileShares** from the drop-down menu for the resource type. Then select the specific file share you want to connect to as Resource. The target sub-resource auto-populates with `FileShare`. Then select **Next: Virtual Network**.

The **Virtual Network** page allows you to select the specific virtual network and subnet you want to add your private endpoint to. Select dynamic or static IP address allocation for the new private endpoint. If you select static, you also need to provide a name and a private IP address. You can also optionally specify an application security group. When you're finished, select **Next: DNS**.

[![Screenshot showing how to provide virtual network, subnet, and IP address details for the new private endpoint.](../../../includes/media/storage-files-networking-endpoints-private-portal/private-endpoint-virtual-network.png)](../../../includes/media/storage-files-networking-endpoints-private-portal/private-endpoint-virtual-network.png#lightbox)

The **DNS** page contains the information for integrating your private endpoint with a private DNS zone. Make sure the subscription and resource group are correct, and then select **Next: Tags**.

[![Screenshot showing how to integrate your private endpoint with a private DNS zone.](../../../includes/media/storage-files-networking-endpoints-private-portal/private-endpoint-dns.png)](../../../includes/media/storage-files-networking-endpoints-private-portal/private-endpoint-dns.png#lightbox)

You can optionally apply tags to categorize your resources, such as applying the name **Environment** and the value **Test** to all testing resources. Enter name/value pairs if desired, and then select **Next: Review + create**.

[![Screenshot showing how to optionally tag your private endpoint with name/value pairs for easy categorization.](../../../includes/media/storage-files-networking-endpoints-private-portal/private-endpoint-tags.png)](../../../includes/media/storage-files-networking-endpoints-private-portal/private-endpoint-tags.png#lightbox)

Select **Create** to create the private endpoint.

# [PowerShell](#tab/azure-powershell)

To create a private endpoint, first get a reference to your storage account or your file share and the virtual network subnet where you want to add the private endpoint. Replace the placeholder values in the following code with your own values.
 
 For classic file shares, get a reference to the storage account:
 
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

For file shares created with the Microsoft.FileShares resource provider, get a reference to the file share:

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

After setting the common variables, the remaining steps are the same for both experiences. Get references to the virtual network and subnet:

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

If you create an Azure private DNS zone, the original host name resolves to the private IP inside of the virtual network. Although optional from the perspective of creating a private endpoint, it is explicitly required for mounting
the Azure file share directly using an AD user principal or accessing via the REST API.

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

For classic file shares, get a reference to the storage account:

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

For file shares created with the Microsoft.FileShares resource provider, get a reference to the file share:

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

If you create an Azure private DNS zone, the original host name resolves to the private IP inside the virtual network. Although optional from the perspective of creating a private endpoint, it's required for mounting the Azure file share by using an AD user principal or accessing via the FileREST API.

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

# [Portal](#tab/azure-portal)

If you have a VM inside your virtual network, or you configured DNS forwarding as described in [Configuring DNS forwarding for Azure Files](storage-files-networking-dns.md), you can test that your private endpoint is set up correctly. Run the following commands from PowerShell, the command line, or the terminal (works for Windows, Linux, or macOS).

For classic file shares, replace `<storage-account-name>` with the appropriate storage account name:

```
nslookup <storage-account-name>.file.core.windows.net
```

For file shares created with the Microsoft.FileShares resource provider, use the file share's host name. In the overview tab of the file share, select **JSON view** from the upper right. In the JSON view, under properties, copy the value for **hostName**. The format looks like `fs-xxxxxxxxxxxxxxxxx.xx.file.storage.azure.net`.

```
nslookup <file-share-host-name>
```

If successful, you see output similar to the following, where `192.168.0.5` is the private IP address of the private endpoint in your virtual network (output shown for Windows).

For classic file shares:

```Output
Server:  UnKnown
Address:  10.2.4.4

Non-authoritative answer:
Name:    storageaccount.privatelink.file.core.windows.net
Address:  192.168.0.5
Aliases:  storageaccount.file.core.windows.net
```

For file shares created with the Microsoft.FileShares resource provider:

```Output
Server:  UnKnown
Address:  10.2.4.4

Non-authoritative answer:
Name:    <hostNamePrefix>.privatelink.file.core.windows.net
Address:  192.168.0.5
Aliases:  <hostNamePrefix>.<zone>.file.storage.azure.net
```

# [PowerShell](#tab/azure-powershell)

If you have a VM inside your virtual network, or you configured DNS forwarding as described in [Configuring DNS forwarding for Azure Files](storage-files-networking-dns.md), you can test that your private endpoint is set up correctly by running the following commands:

For classic file shares:


```PowerShell
 $storageAccountHostName = [System.Uri]::new($storageAccount.PrimaryEndpoints.file) | `
     Select-Object -ExpandProperty Host
 
 Resolve-DnsName -Name $storageAccountHostName
 ```

For file shares created with the Microsoft.FileShares resource provider:

```PowerShell
 Resolve-DnsName -Name $fileShare.HostName
```

If successful, you see output similar to the following, where `192.168.0.5` is the private IP address of the private endpoint in your virtual network.

For classic file shares:

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

For file shares created with the Microsoft.FileShares resource provider:

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

# [Azure CLI](#tab/azure-cli)

If you have a VM inside your virtual network, or you configured DNS forwarding as described in [Configuring DNS forwarding for Azure Files](storage-files-networking-dns.md), you can test that your private endpoint is set up correctly by running the following commands:

For classic file shares:

```bash
httpEndpoint=$(az storage account show \
        --resource-group $storageAccountResourceGroupName \
        --name $storageAccountName \
        --query "primaryEndpoints.file" --output tsv)

hostName=$(echo $httpEndpoint | cut -c7-$(expr length $httpEndpoint) | tr -d "/")
nslookup $hostName
```

For file shares created with the Microsoft.FileShares resource provider:

```bash
hostName=$(az fileshare show \
        --resource-group $fileShareResourceGroupName \
        --name $fileShareName \
        --query "properties.hostName" --output tsv)

nslookup $hostName
```

If successful, you see output similar to the following, where `192.168.0.5` is the private IP address of the private endpoint in your virtual network. You should still use the original host name (`storageaccount.file.core.windows.net` for classic, or the file share's `hostName` for the new experience) to mount your file share instead of the `privatelink` path.

For classic file shares:

```Output
Server:         127.0.0.53
Address:        127.0.0.53#53

Non-authoritative answer:
storageaccount.file.core.windows.net      canonical name = storageaccount.privatelink.file.core.windows.net.
Name:   storageaccount.privatelink.file.core.windows.net
Address: 192.168.0.5
```

For file shares created with the Microsoft.FileShares resource provider:

```Output
Server:         127.0.0.53
Address:        127.0.0.53#53

Non-authoritative answer:
<hostNamePrefix>.<zone>.file.storage.azure.net      canonical name = <hostNamePrefix>.privatelink.file.core.windows.net.
Name:   <hostNamePrefix>.privatelink.file.core.windows.net
Address: 192.168.0.5
```
---

## Restrict public endpoint access

To limit public endpoint access, first disable general access to the public endpoint. Disabling access to the public endpoint doesn't affect private endpoints. After you disable the public endpoint, select specific networks or IP addresses that can continue to access it. In general, most firewall policies for a storage account restrict networking access to one or more virtual networks.

#### Disable access to the public endpoint

When you disable access to the public endpoint, you can still access the storage account through its private endpoints. Otherwise, valid requests to the storage account's public endpoint are rejected, unless they're from [a specifically allowed source](#restrict-access-to-the-public-endpoint-to-specific-virtual-networks).

# [Portal](#tab/azure-portal)

For classic file shares:

Go to the storage account where you want to restrict all access to the public endpoint. In the table of contents for the storage account, select **Networking**.

At the top of the page, select the **Enabled from selected virtual networks and IP addresses** option. This selection reveals settings for controlling the restriction of the public endpoint. Select **Allow Azure services on the trusted services list to access this storage account** to allow trusted first-party Microsoft services such as Azure File Sync to access the storage account.

:::image type="content" source="../../../includes/media/storage-files-networking-endpoints-public-disable-portal/disable-public-endpoint.png" alt-text="Screenshot of the Networking blade with the required settings to disable access to the storage account public endpoint." lightbox="../../../includes/media/storage-files-networking-endpoints-public-disable-portal/disable-public-endpoint.png":::

For file shares created with the Microsoft.FileShares resource provider:

Go to the file share where you want to disable public access. In the service menu, under **Settings**, select **Configuration**. Set **Public network access** to **Disabled**, and then select **Save**.

# [PowerShell](#tab/azure-powershell)

For classic file shares, the following PowerShell command denies all traffic to the storage account's public endpoint. Set the `-Bypass` parameter to `AzureServices` to allow trusted first-party services such as Azure File Sync to access the storage account through the public endpoint.

```PowerShell
# This assumes $storageAccount is still defined from the beginning of this guide.
$storageAccount | Update-AzStorageAccountNetworkRuleSet `
        -DefaultAction Deny `
        -Bypass AzureServices `
        -WarningAction SilentlyContinue `
        -ErrorAction Stop | `
    Out-Null
```

For file shares created with the Microsoft.FileShares resource provider, set `-PublicNetworkAccess` to `Disabled` on the file share.

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

# [Azure CLI](#tab/azure-cli)

For classic file shares, the following CLI command blocks all traffic to the storage account's public endpoint. Set the `--bypass` parameter to `AzureServices` to allow trusted first-party services such as Azure File Sync to access the storage account through the public endpoint.

```bash
# This assumes $storageAccountResourceGroupName and $storageAccountName
# are still defined from the beginning of this guide.
az storage account update \
    --resource-group $storageAccountResourceGroupName \
    --name $storageAccountName \
    --bypass "AzureServices" \
    --default-action "Deny" \
    --output none
```

For file shares created with the Microsoft.FileShares resource provider, set `--public-network-access` to `Disabled` on the file share.

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

---

#### Restrict access to the public endpoint to specific virtual networks

When you restrict the storage account to specific virtual networks, you allow requests to the public endpoint from within the specified virtual networks. This restriction works by using a capability of the virtual network called *service endpoints*. You can use this capability with or without private endpoints.

# [Portal](#tab/azure-portal)

For classic file shares:

Go to the storage account where you want to restrict the public endpoint to specific virtual networks. In the table of contents for the storage account, select **Networking**.

At the top of the page, select the **Enabled from selected virtual networks and IP addresses** option. This selection reveals a number of settings for controlling the restriction of the public endpoint. Select **+Add existing virtual network** to select the specific virtual network that should be allowed to access the storage account through the public endpoint. Select a virtual network and a subnet for that virtual network, and then select **Enable**.

Select **Allow Azure services on the trusted services list to access this storage account** to allow trusted first-party Microsoft services such as Azure File Sync to access the storage account.

:::image type="content" source="../../../includes/media/storage-files-networking-endpoints-public-restrict-portal/restrict-public-endpoint.png" alt-text="Screenshot of the Networking blade with a specific virtual network allowed to access the storage account via the public endpoint." lightbox="../../../includes/media/storage-files-networking-endpoints-public-restrict-portal/restrict-public-endpoint.png":::

For file shares created with the Microsoft.FileShares resource provider:

Go to the file share where you want to restrict public access. In the service menu, under **Settings**, select **Configuration**. Under **Public network access**, select **Enabled from selected virtual networks**, add the virtual networks and subnets allowed to access the share, and select **Save**.

# [PowerShell](#tab/azure-powershell)

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
        -Bypass AzureServices `
        -VirtualNetworkRule $networkRule `
        -WarningAction SilentlyContinue `
        -ErrorAction Stop | `
    Out-Null
```

For file shares created with the Microsoft.FileShares resource provider, pass the allowed subnet resource IDs directly to `Update-AzFileShare` by using `-AllowedSubnet`. There's no need for separate service endpoint or network rule configuration on the storage account.

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

# [Azure CLI](#tab/azure-cli)

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
        --bypass "AzureServices" \
        --default-action "Deny" \
        --output none
```

For file shares created with the Microsoft.FileShares resource provider, pass the allowed subnet resource IDs directly to `az fileshare update` by using `--allowed-subnets`. There's no need for separate service endpoint or network rule configuration on the storage account.

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

---

## See also

- [Azure Files networking considerations](storage-files-networking-overview.md)
- [Configure DNS forwarding for Azure Files](storage-files-networking-dns.md)
- [Configure site-to-site VPN for Azure Files](storage-files-configure-s2s-vpn.md)
