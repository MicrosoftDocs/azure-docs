---
title: Configuring Azure Files network endpoints | Microsoft Docs
description: An overview of networking options for Azure Files.
author: roygara
ms.service: storage
ms.topic: overview
ms.date: 3/19/2020
ms.author: rogarana
ms.subservice: files
---

# Configuring Azure Files network endpoints
Azure Files provides two main types of endpoints for accessing Azure file shares: 
- Public endpoints, which have a public IP address and can be accessed from anywhere in the world.
- Private endpoints, which exist within a virtual network and have a private IP address from within the address space of that virtual network.

Public and private endpoints exist on the Azure storage account. A storage account is a management construct that represents a shared pool of storage in which you can deploy multiple file shares, as well as other storage resources, such as blob containers or queues.

This article focuses on how to configure a storage account's endpoints for accessing the Azure file share directly. Most of the detail provided within this document also applies to how Azure File Sync interoperates with public and private endpoints for the storage account, however for more information about networking considerations for an Azure File Sync deployment, see [configuring Azure File Sync proxy and firewall settings](storage-sync-files-firewall-and-proxy.md).

We recommend reading [Azure Files networking considerations](storage-files-networking-overview.md) prior to reading this how to guide.

## Prerequisites
- This article assumes that you have already created an Azure subscription. If you don't already have a subscription, then create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- This article assumes that you have already created an Azure file share in a storage account which you would like to connect to from on-premises. To learn how to create an Azure file share, see [Create an Azure file share](storage-how-to-create-file-share.md).
- If you intend to use Azure PowerShell, [install the latest version](https://docs.microsoft.com/powershell/azure/install-az-ps).
- If you intend to use the Azure CLI, [install the latest version](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest).

## Create a private endpoint
Creating a private endpoint for your storage account will result in the following Azure resources being deployed:

- **A private endpoint**: An Azure resource representing the storage account's private endpoint. You can think of this as a resource that connects a storage account and a network interface.
- **A network interface (NIC)**: The network interface that maintains a private IP address within the specified virtual network/subnet. This is the exact same resource that gets deployed when you deploy a virtual machine, however instead of being assigned to a VM, it's owned by the private endpoint.
- **A private DNS zone**: If you've never deployed a private endpoint for this virtual network before, a new private DNS zone will be deployed for your virtual network. A DNS A record will also be created for the storage account in this DNS zone. If you've already deployed a private endpoint in this virtual network, a new A record for the storage account will be added to the existing DNS zone. Deploying a DNS zone is optional, however highly recommended, and required if you are mounting your Azure file shares with an AD service principal or using the FileREST API.

> [!Note]  
> This article uses the storage account DNS suffix for the Azure Public regions, `core.windows.net`. This commentary also applies to Azure Sovereign clouds such as the Azure US Government cloud and the Azure China cloud - just substitute the the appropriate suffixes for your environment. 

# [Portal](#tab/azure-portal)
[!INCLUDE [storage-files-networking-endpoints-private-portal](../../../includes/storage-files-networking-endpoints-private-portal.md)]

If you have a virtual machine inside of your virtual network, or you've configured DNS forwarding as described in [Configuring DNS forwarding for Azure Files](../articles/storage/files/storage-files-networking-dns.md), you can test that your private endpoint has been setup correctly by running the following commands from PowerShell, the command line, or the terminal (works for Windows, Linux, or macOS). You must replace `<storage-account-name>` with the appropriate storage account name:

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
[!INCLUDE [storage-files-networking-endpoints-private-powershell](../../../includes/storage-files-networking-endpoints-private-powershell.md)]

# [Azure CLI](#tab/azure-cli)
[!INCLUDE [storage-files-networking-endpoints-private-cli](../../../includes/storage-files-networking-endpoints-private-cli.md)]

---

## Restrict access to the public endpoint
You can restrict access to the public endpoint using the storage account firewall settings. In general, most firewall policies for a storage account will restrict networking access to one or more virtual networks. There are two approaches to restricting access to a storage account to a virtual network:

- [Create one or more private endpoints for the storage account](#create-a-private-endpoint)  and restrict all access to the public endpoint. This ensures that only traffic originating from within the desired virtual networks can access the Azure file shares within the storage account.
- Restrict the public endpoint to one or more virtual networks. This works by using a capability of the virtual network called *service endpoints*. When you restrict the traffic to a storage account via a service endpoint, you are still accessing the storage account via the public IP address.

### Restrict all access to the public endpoint
When all access to the public endpoint is restricted, the storage account can still be accessed through its the private endpoints. Otherwise valid requests to the storage account's public endpoint will be rejected. 

# [Portal](#tab/azure-portal)
Navigate to the storage account for which you would like to restrict all access to the public endpoint. In the table of contents for the storage account, select **Firewalls and virtual networks**.

At the top of the page, select the **Selected networks** radio button. This will un-hide a number of settings for controlling the restriction of the public endpoint. Check **Allow trusted Microsoft services to access this service account** to allow trusted first party Microsoft services such as Azure File Sync to access the storage account.

![Screenshot of the Firewalls and virtual networks blade with the appropriate restricts in place](media/storage-files-networking-endpoints/restrict-public-endpoint-0.png)

# [PowerShell](#tab/azure-powershell)
The following PowerShell command will deny all traffic to the storage account's public endpoint. Note that this command has the `-Bypass` parameter set to `AzureServices`. This will allow trusted first party services such as Azure File Sync to access the storage account via the public endpoint.

```PowerShell
# This assumes $storageAccount is still defined from the beginning of this of this guide.
$storageAccount | Update-AzStorageAccountNetworkRuleSet `
        -DefaultAction Deny `
        -Bypass AzureServices `
        -WarningAction SilentlyContinue `
        -ErrorAction Stop | `
    Out-Null
```

# [Azure CLI](#tab/azure-cli)
The following CLI command will deny all traffic to the storage account's public endpoint. Note that this command has the `-bypass` parameter set to `AzureServices`. This will allow trusted first party services such as Azure File Sync to access the storage account via the public endpoint.

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
---

### Restrict access to the public endpoint to specific virtual networks
When you restrict the storage account to specific virtual networks, you are allowing requests to the public endpoint from within the specified virtual networks. This works by using a capability of the virtual network called *service endpoints*. This can be used with or without private endpoints.

# [Portal](#tab/azure-portal)
Navigate to the storage account for which you would like to restrict the public endpoint to specific virtual networks. In the table of contents for the storage account, select **Firewalls and virtual networks**. 

At the top of the page, select the **Selected networks** radio button. This will un-hide a number of settings for controlling the restriction of the public endpoint. Click **+Add existing virtual network** to select the specific virtual network that should be allowed to access the storage account via the public endpoint. This will require selecting a virtual network and a subnet for that virtual network. 

Check **Allow trusted Microsoft services to access this service account** to allow trusted first party Microsoft services such as Azure File Sync to access the storage account.

![Screenshot of the Firewalls and virtual networks blade with a specific virtual network allowed to access the storage account via the public endpoint](media/storage-files-networking-endpoints/restrict-public-endpoint-1.png)

# [PowerShell](#tab/azure-powershell)
To restrict access to the storage account's public endpoint to specific virtual networks using service endpoints, we first need to collect information about the storage account and virtual network. Fill in `<storage-account-resource-group>`, `<storage-account-name>`, `<vnet-resource-group-name>`, `<vnet-name>`, and `<subnet-name>` to collect this information.

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

In order for traffic from the virtual network to be allowed by the Azure network fabric to get to the storage account public endpoint, the virtual network's subnet must have the `Microsoft.Storage` service endpoint exposed. The following PowerShell commands will add the the `Microsoft.Storage` service endpoint to the subnet if it's not already there.

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

The final step in restricting traffic to the storage account is to create a networking rule and add to the storage account's network rule set.

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

# [Azure CLI](#tab/azure-cli)
To restrict access to the storage account's public endpoint to specific virtual networks using service endpoints, we first need to collect information about the storage account and virtual network. Fill in `<storage-account-resource-group>`, `<storage-account-name>`, `<vnet-resource-group-name>`, `<vnet-name>`, and `<subnet-name>` to collect this information.

```bash
storageAccountResourceGroupName="<storage-account-resource-group>"
storageAccountName="<storage-account-name>"
restrictToVirtualNetworkResourceGroupName="<vnet-resource-group-name>"
restrictToVirtualNetworkName="<vnet-name>"
subnetName="<subnet-name>"

storageAccount=$(az storage account show \
        --resource-group $storageAccountResourceGroupName \
        --name $storageAccountName \
        --query "id" | \
    tr -d '"')

virtualNetwork=$(az network vnet show \
        --resource-group $restrictToVirtualNetworkResourceGroupName \
        --name $restrictToVirtualNetworkName \
        --query "id" | \
    tr -d '"')

subnet=$(az network vnet subnet show \
        --resource-group $restrictToVirtualNetworkResourceGroupName \
        --vnet-name $restrictToVirtualNetworkName \
        --name $subnetName \
        --query "id" | \
    tr -d '"')
```

In order for traffic from the virtual network to be allowed by the Azure network fabric to get to the storage account public endpoint, the virtual network's subnet must have the `Microsoft.Storage` service endpoint exposed. The following CLI commands will add the the `Microsoft.Storage` service endpoint to the subnet if it's not already there.

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

The final step in restricting traffic to the storage account is to create a networking rule and add to the storage account's network rule set.

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

---

## See also
- [Azure Files networking considerations](storage-files-networking-overview.md)
- [Configuring DNS forwarding for Azure Files](storage-files-networking-dns.md)
- [Configuring S2S VPN for Azure Files](storage-files-configure-s2s-vpn.md)
