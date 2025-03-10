---
title: Configure networking for Azure Elastic SAN
description: Learn how to secure Azure Elastic SAN volumes through access configuration.
author: roygara
ms.service: azure-elastic-san-storage
ms.topic: how-to
ms.date: 01/24/2025
ms.author: rogarana
ms.custom: references_regions, devx-track-azurecli, devx-track-azurepowershell
---

# Configure network access for Azure Elastic SAN

You can control access to your Azure Elastic storage area network (SAN) volumes. Controlling access allows you to secure your data and meet the needs of your applications and enterprise environments.

This article describes how to configure your Elastic SAN to allow access from your Azure virtual network infrastructure.

To configure network access to your Elastic SAN:

> [!div class="checklist"]
> - [Configure public network access](#configure-public-network-access)
> - [Configure a virtual network endpoint](#configure-a-virtual-network-endpoint).
> - [Configure client connections](#configure-client-connections).

## Prerequisites

- If you're using Azure PowerShell, install the [latest Azure PowerShell module](/powershell/azure/install-azure-powershell).
- If you're using Azure CLI, install the [latest version](/cli/azure/install-azure-cli).
- Once you've installed the latest version, run `az extension add -n elastic-san` to install the extension for Elastic SAN.
There are no extra registration steps required.

## Limitations

[!INCLUDE [elastic-san-regions](../../../includes/elastic-san-regions.md)]

## Configure public network access

You enable public Internet access to your Elastic SAN endpoints at the SAN level. Enabling public network access for an Elastic SAN allows you to configure public access to individual volume groups over storage service endpoints. By default, public access to individual volume groups is denied even if you allow it at the SAN level. You must explicitly configure your volume groups to permit access from specific IP address ranges and virtual network subnets.

You can enable public network access when you create an elastic SAN, or enable it for an existing SAN using the Azure PowerShell module or the Azure CLI.

# [Portal](#tab/azure-portal)

Use the Azure PowerShell module or the Azure CLI to enable public network access.

# [PowerShell](#tab/azure-powershell)

Use this sample code to create an Elastic SAN with public network access enabled using PowerShell. Replace the variable values before running the sample.

```powershell
# Set the variable values.
# The name of the resource group where the Elastic San is deployed.
$RgName       = "<ResourceGroupName>"
# The name of the Elastic SAN.
$EsanName     = "<ElasticSanName>"
# The region where the new Elastic San will be created.
$Location     = "<Location>"
# The SKU of the new Elastic SAN - `Premium_LRS` or `Premium_ZRS`.
$SkuName      = "<SkuName>"
# The base size of the new Elastic SAN.
$BaseSize     = "<BaseSize>"
# The extended size of the new Elastic SAN.
$ExtendedSize = "<ExtendedSize>"
# Setup the parameters to create an Elastic San with public network access enabled.
$NewEsanArguments = @{
    Name                    = $EsanName
    ResourceGroupName       = $RgName
    BaseSizeTiB             = $BaseSize
    ExtendedCapacitySizeTiB = $ExtendedSize
    Location                = $Location
    SkuName                 = $SkuName
    PublicNetworkAccess     = "Enabled"
}
# Create the Elastic San.
New-AzElasticSan @NewEsanArguments
```

Use this sample code to update an Elastic SAN to enable public network access using PowerShell. Replace the values of `RgName` and `EsanName` with your own, then run the sample:

```powershell
# Set the variable values.
$RgName       = "<ResourceGroupName>"
$EsanName     = "<ElasticSanName>"
# Update the Elastic San.
Update-AzElasticSan -Name $EsanName -ResourceGroupName $RgName -PublicNetworkAccess Enabled
```

# [Azure CLI](#tab/azure-cli)

Use this sample code to create an Elastic SAN with public network access enabled using the Azure CLI. Replace the variable values before running the sample.

```azurecli
# Set the variable values.
# The name of the resource group where the Elastic San is deployed.
$RgName="<ResourceGroupName>"
# The name of the Elastic SAN.
$EsanName="<ElasticSanName>"
# The region where the new Elastic San will be created.
$Location="<Location>"
# The SKU of the new Elastic SAN - `Premium_LRS` or `Premium_ZRS`.
$SkuName="<SkuName>"
# The base size of the new Elastic SAN.
$BaseSize="<BaseSize>"
# The extended size of the new Elastic SAN.
$ExtendedSize="<ExtendedSize>"

# Create the Elastic San.
az elastic-san create \
    --elastic-san-name $EsanName \
    --resource-group $RgName \
    --location $Location \
    --base-size-tib $BaseSize \
    --extended-capacity-size-tib $ExtendedSize \
    --sku $SkuName \
    --public-network-access enabled
```

Use this sample code to update an Elastic SAN to enable public network access using the Azure CLI. Replace the values of `RgName` and `EsanName` with your own values:

```azurecli
# Set the variable values.
$RgName="<ResourceGroupName>"
$EsanName="<ElasticSanName>"
# Update the Elastic San.
az elastic-san update \
    --elastic-san-name $EsanName \
    --resource-group $RgName \
    --public-network-access enabled
```

---

## Configure iSCSI error detection

### Enable iSCSI error detection

To enable CRC-32C checksum verification for iSCSI headers or data payloads, set CRC-32C on header or data digests for all connections on your clients that connect to Elastic SAN volumes. To do this, connect your clients to Elastic SAN volumes using multi-session scripts generated either in the Azure portal or provided in either the [Windows](elastic-san-connect-windows.md) or [Linux](elastic-san-connect-Linux.md) Elastic SAN connection articles.

If you need to, you can do this without the multi-session connection scripts. On Windows, you can do this by setting header or data digests to 1 during login to the Elastic SAN volumes (`LoginTarget` and `PersistentLoginTarget`). On Linux, you can do this by updating the global iSCSI configuration file (iscsid.conf, generally found in /etc/iscsi directory). When a volume is connected, a node is created along with a configuration file specific to that node (for example, on Ubuntu it can be found in /etc/iscsi/nodes/$volume_iqn/portal_hostname,$port directory) inheriting the settings from global configuration file. If you have already connected volumes to your client before updating your global configuration file, update the node specific configuration file for each volume directly, or using the following command:

```sudo iscsiadm -m node -T $volume_iqn -p $portal_hostname:$port -o update -n $iscsi_setting_name -v $setting_value```

Where
- $volume_iqn: Elastic SAN volume IQN
- $portal_hostname: Elastic SAN volume portal hostname
- $port: 3260
- $iscsi_setting_name: node.conn[0].iscsi.HeaderDigest (or) node.conn[0].iscsi.DataDigest 
- $setting_value: CRC32C

### Enforce iSCSI error detection

To enforce iSCSI error detection, set CRC-32C for both header and data digests on your clients and enable the CRC protection property on the volume group that contains volumes already connected to or have yet to be connected to from your clients. If your Elastic SAN volumes are already connected and don't have CRC-32C for both digests, you should disconnect the volumes and reconnect them using multi-session scripts generated in the Azure portal when connecting to an Elastic SAN volume, or from the [Windows](elastic-san-connect-windows.md) or [Linux](elastic-san-connect-Linux.md) Elastic SAN connection articles.

> [!NOTE]
> CRC protection feature isn't currently available in North Europe and South Central US.

To enable CRC protection on the volume group:

# [Portal](#tab/azure-portal)

Enable CRC protection on a new volume group:

:::image type="content" source="media/elastic-san-networking/elastic-san-crc-protection-create-volume-group.png" alt-text="Screenshot of CRC protection enablement on new volume group." lightbox="media/elastic-san-networking/elastic-san-crc-protection-create-volume-group.png":::

Enable CRC protection on an existing volume group:

:::image type="content" source="media/elastic-san-networking/elastic-san-crc-protection-update-volume-group.png" alt-text="Screenshot of CRC protection enablement on an existing volume group." lightbox="media/elastic-san-networking/elastic-san-crc-protection-update-volume-group.png":::

# [PowerShell](#tab/azure-powershell)

Use this script to enable CRC protection on a new volume group using the Azure PowerShell module. Replace the values of `$RgName`, `$EsanName`, `$EsanVgName` before running the script.

```powershell
# Set the variable values.
# The name of the resource group where the Elastic San is deployed.
$RgName = "<ResourceGroupName>"
# The name of the Elastic SAN.
$EsanName = "<ElasticSanName>"
# The name of volume group within the Elastic SAN.
$EsanVgName = "<VolumeGroupName>"

# Create a volume group by enabling CRC protection
New-AzElasticSanVolumeGroup -ResourceGroupName $RgName -ElasticSANName $EsanName -Name $EsanVgName -EnforceDataIntegrityCheckForIscsi $true

```

Use this script to enable CRC protection on an existing volume group using the Azure PowerShell module. Replace the values of `$RgName`, `$EsanName`, `$EsanVgName` before running the script.

```powershell
# Set the variable values.
$RgName = "<ResourceGroupName>"
$EsanName = "<ElasticSanName>"
$EsanVgName = "<VolumeGroupName>"

# Edit a volume group to enable CRC protection
Update-AzElasticSanVolumeGroup -ResourceGroupName $RgName -ElasticSANName $EsanName -Name $EsanVgName -EnforceDataIntegrityCheckForIscsi $true
```

# [Azure CLI](#tab/azure-cli)

The following code sample enable CRC protection on a new volume group using Azure CLI. Replace the values of `RgName`, `EsanName`, `EsanVgName`, before running the sample.

```azurecli
# Set the variable values.
# The name of the resource group where the Elastic San is deployed.
RgName="<ResourceGroupName>"
# The name of the Elastic SAN.
EsanName="<ElasticSanName>"
# The name of volume group within the Elastic SAN.
EsanVgName= "<VolumeGroupName>"

# Create the Elastic San.
az elastic-san volume-group create \
    --elastic-san-name $EsanName \
    --resource-group $RgName \
    --volume-group-name $EsanVgName \
    --data-integrity-check true
```

The following code sample enable CRC protection on an existing volume group using Azure CLI. Replace the values of `RgName`, `EsanName`, `EsanVgName`, before running the sample.

```azurecli
# Set the variable values.
RgName="<ResourceGroupName>"
EsanName="<ElasticSanName>"
EsanVgName= "<VolumeGroupName>"

# Create the Elastic San.
az elastic-san volume-group update \
    --elastic-san-name $EsanName \
    --resource-group $RgName \
    --volume-group-name $EsanVgName \
    --data-integrity-check true
```

---


## Configure a virtual network endpoint

You can configure your Elastic SAN volume groups to allow access only from endpoints on specific virtual network subnets. The allowed subnets can belong to virtual networks in the same subscription, or those in a different subscription, including a subscription belonging to a different Microsoft Entra tenant.

You can allow access to your Elastic SAN volume group from two types of Azure virtual network endpoints:

- [Private endpoints](../../private-link/private-endpoint-overview.md)
- [Storage service endpoints](../../virtual-network/virtual-network-service-endpoints-overview.md)

A private endpoint uses one or more private IP addresses from your virtual network subnet to access an Elastic SAN volume group over the Microsoft backbone network. With a private endpoint, traffic between your virtual network and the volume group are secured over a private link.

Virtual network service endpoints are public and accessible via the internet. You can [Configure virtual network rules](#configure-virtual-network-rules) to control access to your volume group when using storage service endpoints. 

Network rules only apply to the public endpoints of a volume group, not private endpoints. The process of approving the creation of a private endpoint grants implicit access to traffic from the subnet that hosts the private endpoint. You can use [Network Policies](../../private-link/disable-private-endpoint-network-policy.md) to control traffic over private endpoints if you want to refine access rules. If you want to use private endpoints exclusively, don't enable service endpoints for the volume group.

To decide which type of endpoint works best for you, see [Compare Private Endpoints and Service Endpoints](../../virtual-network/vnet-integration-for-azure-services.md#compare-private-endpoints-and-service-endpoints).

Once network access is configured for a volume group, the configuration is inherited by all volumes belonging to the group.

The process for enabling each type of endpoint follows:

- [Configure a private endpoint](#configure-a-private-endpoint)
- [Configure an Azure Storage service endpoint](#configure-an-azure-storage-service-endpoint)

### Configure a private endpoint

There are two steps involved in configuring a private endpoint connection:

> [!div class="checklist"]
> - Creating the endpoint and the associated connection.
> - Approving the connection.

You can also use [Network Policies](../../private-link/disable-private-endpoint-network-policy.md) to refine access control over private endpoints.

To create a private endpoint for an Elastic SAN volume group, you must have the [Elastic SAN Volume Group Owner](../../role-based-access-control/built-in-roles.md#elastic-san-volume-group-owner) role. To approve a new private endpoint connection, you must have permission to the [Azure resource provider operation](../../role-based-access-control/resource-provider-operations.md#microsoftelasticsan) `Microsoft.ElasticSan/elasticSans/PrivateEndpointConnectionsApproval/action`. Permission for this operation is included in the [Elastic SAN Network Admin](../../role-based-access-control/built-in-roles.md#elastic-san-owner) role, but it can also be granted via a custom Azure role.

If you create the endpoint from a user account that has all of the necessary roles and permissions required for creation and approval, the process can be completed in one step. If not, it requires two separate steps by two different users.

The Elastic SAN and the virtual network could be in different resource groups, regions, and subscriptions, including subscriptions that belong to different Microsoft Entra tenants. In these examples, we're creating the private endpoint in the same resource group as the virtual network.

# [Portal](#tab/azure-portal)

You can create a private endpoint connection to your volume group in the Azure portal either when you create a volume group or when modifying an existing volume group. You need an existing virtual network to create a private endpoint.

When creating or modifying a volume group, select **Networking**, then select **+ Create a private endpoint** under **Private endpoint connections**.

Fill out the values in the menu that pops up, select the virtual network and the subnet that your applications will use to connect. When you're done, select **Add**, and **Save**. 

:::image type="content" source="media/elastic-san-create/elastic-san-private-endpoint.png" alt-text="Screenshot of the volume group private endpoint creation experience." lightbox="media/elastic-san-create/elastic-san-private-endpoint.png":::

# [PowerShell](#tab/azure-powershell)

Deploying a private endpoint for an Elastic SAN Volume group using PowerShell involves these steps:

1. Get the subnet from the applications that will connect.
1. Get the Elastic SAN Volume Group.
1. Create a private link service connection using the volume group as input.
1. Create the private endpoint using the subnet and the private link service connection as input.
1. **(Optional)** *if you're using the two-step process (creation, then approval))*: The Elastic SAN Network Admin approves the connection.

Use this sample code to create a private endpoint for your Elastic SAN volume group with PowerShell. Replace the values of `RgName`, `VnetName`, `SubnetName`, `EsanName`, `EsanVgName`, `PLSvcConnectionName`, `EndpointName`, and `Location`(Region) with your own values:

```powershell
# Set the resource group name.
$RgName     = "<ResourceGroupName>"

# Set the virtual network and subnet, which is used when creating the private endpoint.
$VnetName   = "<VnetName>"
$SubnetName = "<SubnetName>"

$Vnet = Get-AzVirtualNetwork -Name $VnetName -ResourceGroupName $RgName
$Subnet = $Vnet | Select -ExpandProperty subnets | Where-Object {$_.Name -eq $SubnetName}

# Set the Elastic SAN, which is used when creating the private endpoint service connection.
$EsanName   = "<ElasticSanName>"
$EsanVgName = "<ElasticSanVolumeGroupName>"

$Esan = Get-AzElasticSan -Name $EsanName -ResourceGroupName $RgName

# Create the private link service connection, which is input to creating the private endpoint.
$PLSvcConnectionName = "<PrivateLinkSvcConnectionName>"
$EsanPlSvcConn = New-AzPrivateLinkServiceConnection -Name $PLSvcConnectionName -PrivateLinkServiceId $Esan.Id -GroupId $EsanVgName

# Create the private endpoint.
$EndpointName       = '<PrivateEndpointName>'
$Location           = '<Location>'
$PeArguments        = @{
    Name                         = $EndpointName
    ResourceGroupName            = $RgName
    Location                     = $Location
    Subnet                       = $Subnet
    PrivateLinkServiceConnection = $EsanPlSvcConn
}
New-AzPrivateEndpoint @PeArguments # -ByManualRequest # (Uncomment the `-ByManualRequest` parameter if you are using the two-step process).
```

Use this sample code to approve the private link service connection if you're using the two-step process. Use the same variables from the previous code sample:

```powershell
# Get the private endpoint and associated connection.
$PrivateEndpoint = Get-AzPrivateEndpoint -Name $EndpointName -ResourceGroupName $RgName
$PeConnArguments  = @{
    ServiceName                  = $EsanName
    ResourceGroupName            = $RgName
    PrivateLinkResourceType      = "Microsoft.ElasticSan/elasticSans"
}
$EndpointConnection = Get-AzPrivateEndpointConnection @PeConnArguments | 
Where-Object {($_.PrivateEndpoint.Id -eq $PrivateEndpoint.Id)}

# Approve the private link service connection.
$ApprovalDesc="<ApprovalDesc>"
Approve-AzPrivateEndpointConnection @PeConnArguments -Name $EndpointConnection.Name -Description $ApprovalDesc

# Get the private endpoint connection anew and verify the connection status.
$EndpointConnection = Get-AzPrivateEndpointConnection @PeConnArguments | 
Where-Object {($_.PrivateEndpoint.Id -eq $PrivateEndpoint.Id)}
$EndpointConnection.PrivateLinkServiceConnectionState
```

# [Azure CLI](#tab/azure-cli)

Deploying a private endpoint for an Elastic SAN Volume group using the Azure CLI involves three steps:

1. Get the private connection resource ID of the Elastic SAN.
1. Create the private endpoint using inputs:
    1. Private connection resource ID
    1. Volume group name
    1. Resource group name
    1. Subnet name
    1. Virtual network name
1. **(Optional** *if you're using the two-step process (creation, then approval))*: The Elastic SAN Network Admin approves the connection.

Use this sample code to create a private endpoint for your Elastic SAN volume group with the Azure CLI. Uncomment the `--manual-request` parameter if you're using the two-step process. Replace all example variable values with your own:

```azurecli
# Define some variables.
# The name of the resource group where the resources are deployed.
RgName="<ResourceGroupName>"
# The name of the subnet from which access to the volume group will be configured.
VnetName="<VnetName>"
# The name of the virtual network that includes the subnet.
SubnetName="<SubnetName>"
# The name of the Elastic SAN that the volume group belongs to.
EsanName="<ElasticSanName>"
# The name of the Elastic SAN Volume Group to which a connection is to be created.
EsanVgName="<ElasticSanVolumeGroupName>"
# The name of the new private endpoint
EndpointName="<PrivateEndpointName>"
# The name of the new private link service connection to the volume group.
PLSvcConnectionName="<PrivateLinkSvcConnectionName>"
# The region where the new private endpoint will be created.
Location="<Location>"
# The description provided for the approval of the private endpoint connection.
ApprovalDesc="<ApprovalDesc>"

# Get the id of the Elastic SAN.
id=$(az elastic-san show \
    --elastic-san-name $EsanName \
    --resource-group $RgName \
    --query 'id' \
    --output tsv)

# Create the private endpoint.
az network private-endpoint create \
    --connection-name $PLSvcConnectionName \
    --name $EndpointName \
    --private-connection-resource-id $id \
    --resource-group $RgName \
    --vnet-name $VnetName \
    --subnet $SubnetName \
    --location $Location \
    --group-id $EsanVgName # --manual-request

# Verify the status of the private endpoint connection.
PLConnectionName=$(az network private-endpoint-connection list \
    --name $EsanName \
    --resource-group $RgName \
    --type Microsoft.ElasticSan/elasticSans \
    --query "[?properties.groupIds[0]=='$EsanVgName'].name" -o tsv)

az network private-endpoint-connection show  \
    --resource-name $EsanName \
    --resource-group $RgName \
    --type Microsoft.ElasticSan/elasticSans \
    --name $PLConnectionName
```

Use this sample code to approve the private link service connection if you're using the two-step process. Use the same variables from the previous code sample:

```azurecli
az network private-endpoint-connection approve \
    --resource-name $EsanName \
    --resource-group $RgName \
    --name $PLConnectionName \
    --type Microsoft.ElasticSan/elasticSans \
    --description $ApprovalDesc
```

---

### Configure an Azure Storage service endpoint

To configure an Azure Storage service endpoint from the virtual network where access is required, you must have permission to the `Microsoft.Network/virtualNetworks/subnets/joinViaServiceEndpoint/action` [Azure resource provider operation](../../role-based-access-control/resource-provider-operations.md#microsoftnetwork) via a custom Azure role to configure a service endpoint.

Virtual network service endpoints are public and accessible via the internet. You can [Configure virtual network rules](#configure-virtual-network-rules) to control access to your volume group when using storage service endpoints. 

> [!NOTE]
> Configuration of rules that grant access to subnets in virtual networks that are a part of a different Microsoft Entra tenant are currently only supported through PowerShell, CLI and REST APIs. These rules cannot be configured through the Azure portal, though they can be viewed in the portal.

# [Portal](#tab/azure-portal)

1. Navigate to your virtual network and select **Service Endpoints**.
1. Select **+ Add**.
1. On the **Add service endpoints** screen:
    1. For **Service** select **Microsoft.Storage.Global** to add a [cross-region service endpoint](../common/storage-network-security.md#azure-storage-cross-region-service-endpoints).

    > [!NOTE]
    > You might see **Microsoft.Storage** listed as an available storage service endpoint. That option is for intra-region endpoints which exist for backward compatibility only. Always use cross-region endpoints unless you have a specific reason for using intra-region ones.

1. For **Subnets** select all the subnets where you want to allow access.
1. Select **Add**.

:::image type="content" source="media/elastic-san-create/elastic-san-service-endpoint.png" alt-text="Screenshot of the virtual network service endpoint page, adding the storage service endpoint." lightbox="media/elastic-san-create/elastic-san-service-endpoint.png":::

# [PowerShell](#tab/azure-powershell)

Use this sample code to create a storage service endpoint for your Elastic SAN volume group with PowerShell.

```powershell
# Define some variables
$RgName     = "<ResourceGroupName>"
$VnetName   = "<VnetName>"
$SubnetName = "<SubnetName>"

# Get the virtual network and subnet
$Vnet = Get-AzVirtualNetwork -ResourceGroupName $RgName -Name $VnetName
$Subnet = Get-AzVirtualNetworkSubnetConfig -VirtualNetwork $Vnet -Name $SubnetName

# Enable the storage service endpoint
$Vnet | Set-AzVirtualNetworkSubnetConfig -Name $SubnetName -AddressPrefix $Subnet.AddressPrefix -ServiceEndpoint "Microsoft.Storage.Global" | Set-AzVirtualNetwork
```

# [Azure CLI](#tab/azure-cli)

Use this sample code to create a storage service endpoint for your Elastic SAN volume group with the Azure CLI.

```azurecli
# Define some variables
RgName="<ResourceGroupName>"
VnetName="<VnetName>"
SubnetName="<SubnetName>"

# Enable the storage service endpoint
az network vnet subnet update --resource-group $RgName --vnet-name $VnetName --name $SubnetName --service-endpoints "Microsoft.Storage.Global"
```

---

#### Configure virtual network rules

All incoming requests for data over a service endpoint are blocked by default. Only applications that request data from allowed sources that you configure in your network rules are able to access your data. 

You can manage virtual network rules for volume groups through the Azure portal, PowerShell, or CLI.

> [!IMPORTANT]
> If you want to enable access to your storage account from a virtual network/subnet in another Microsoft Entra tenant, you must use PowerShell or the Azure CLI. The Azure portal does not show subnets in other Microsoft Entra tenants.
>
> If you delete a subnet that has been included in a network rule, it will be removed from the network rules for the volume group. If you create a new subnet with the same name, it won't have access to the volume group. To allow access, you must explicitly authorize the new subnet in the network rules for the volume group.

### [Portal](#tab/azure-portal)

1. Navigate to your SAN and select **Volume groups**.
1. Select a volume group and select **Create**.
1. Add an existing virtual network and subnet and select **Save**.

### [PowerShell](#tab/azure-powershell)

- Install the [Azure PowerShell](/powershell/azure/install-azure-powershell) and [sign in](/powershell/azure/authenticate-azureps).

- List virtual network rules.

    ```azurepowershell
    $Rules = Get-AzElasticSanVolumeGroup -ResourceGroupName $RgName -ElasticSanName $sanName -Name $volGroupName
    $Rules.NetworkAclsVirtualNetworkRule
    ```

- Enable service endpoint for Azure Storage on an existing virtual network and subnet.

    ```azurepowershell
    Get-AzVirtualNetwork -ResourceGroupName "myresourcegroup" -Name "myvnet" | Set-AzVirtualNetworkSubnetConfig -Name "mysubnet" -AddressPrefix "10.0.0.0/24" -ServiceEndpoint "Microsoft.Storage.Global" | Set-AzVirtualNetwork
    ```

- Add a network rule for a virtual network and subnet.

    ```azurepowershell
    $rule = New-AzElasticSanVirtualNetworkRuleObject -VirtualNetworkResourceId $Subnet.Id -Action Allow
    
    Add-AzElasticSanVolumeGroupNetworkRule -ResourceGroupName $RgName -ElasticSanName $EsanName -VolumeGroupName $EsanVgName -NetworkAclsVirtualNetworkRule $rule
    ```

    > [!TIP]
    > To add a network rule for a subnet in a virtual network belonging to another Microsoft Entra tenant, use a fully qualified **VirtualNetworkResourceId** parameter in the form "/subscriptions/subscription-ID/resourceGroups/resourceGroup-Name/providers/Microsoft.Network/virtualNetworks/vNet-name/subnets/subnet-name".

- Remove a virtual network rule.

    ```azurepowershell
    ## You can remove a virtual network rule by object, by resource ID, or by removing all the rules in a volume group
    ### remove by networkRule object
    Remove-AzElasticSanVolumeGroupNetworkRule -ResourceGroupName myRGName -ElasticSanName mySANName -VolumeGroupName myVolGroupName -NetworkAclsVirtualNetworkRule $virtualNetworkRule1,$virtualNetworkRule2
    ### remove by networkRuleResourceId
    Remove-AzElasticSanVolumeGroupNetworkRule -ResourceGroupName myRGName -ElasticSanName mySANName -VolumeGroupName myVolGroupName -NetworkAclsVirtualNetworkResourceId "myResourceID"
    ### Remove all network rules in a volume group by pipeline
    ((Get-AzElasticSanVolumeGroup -ResourceGroupName myRGName -ElasticSanName mySANName -VolumeGroupName myVolGroupName).NetworkAclsVirtualNetworkRule) | Remove-AzElasticSanVolumeGroupNetworkRule -ResourceGroupName myRGName -ElasticSanName mySANName -VolumeGroupName myVolGroupName
    ```

### [Azure CLI](#tab/azure-cli)

- Install the [Azure CLI](/cli/azure/install-azure-cli) and [sign in](/cli/azure/authenticate-azure-cli).

- List information from a particular volume group, including their virtual network rules.

    ```azurecli
    az elastic-san volume-group show -e $sanName -g $RgName -n $volumeGroupName
    ```

- Enable service endpoint for Azure Storage on an existing virtual network and subnet.

    ```azurecli
    az network vnet subnet update --resource-group "myresourcegroup" --vnet-name "myvnet" --name "mysubnet" --service-endpoints "Microsoft.Storage.Global"
    ```

- Add a network rule for a virtual network and subnet.

    > [!TIP]
    > To add a rule for a subnet in a virtual network belonging to another Microsoft Entra tenant, use a fully-qualified subnet ID in the form `/subscriptions/\<subscription-ID\>/resourceGroups/\<resourceGroup-Name\>/providers/Microsoft.Network/virtualNetworks/\<vNet-name\>/subnets/\<subnet-name\>`.
    >
    > You can use the **subscription** parameter to retrieve the subnet ID for a virtual network belonging to another Microsoft Entra tenant.

    ```azurecli
    # First, get the current length of the list of virtual networks. This is needed to ensure you append a new network instead of replacing existing ones.
    virtualNetworkListLength = az elastic-san volume-group show -e $sanName -n $volumeGroupName -g $RgName --query 'length(networkAcls.virtualNetworkRules)'
    
    az elastic-san volume-group update -e $sanName -g $RgName --name $volumeGroupName --network-acls virtual-network-rules[$virtualNetworkListLength] "{virtualNetworkRules:[{id:/subscriptions/subscriptionID/resourceGroups/RGName/providers/Microsoft.Network/virtualNetworks/$VnetName/subnets/default, action:Allow}]}"
    ```

- Remove a network rule. The following command removes the first network rule, modify it to remove the network rule you'd like.
    
    ```azurecli
    az elastic-san volume-group update -e $sanName -g $RgName -n $volumeGroupName --network-acls virtual-network-rules[1]=null
    ```

---

## Configure client connections

After you have enabled the desired endpoints and granted access in your network rules, you're ready to configure your clients to connect to the appropriate Elastic SAN volumes.

> [!NOTE]
> If a connection between a virtual machine (VM) and an Elastic SAN volume is lost, the connection will retry for 90 seconds until terminating. Losing a connection to an Elastic SAN volume won't cause the VM to restart.

## Next steps

- [Connect Azure Elastic SAN volumes to an Azure Kubernetes Service cluster](elastic-san-connect-aks.md)
- [Connect to Elastic SAN volumes - Linux](elastic-san-connect-linux.md)
- [Connect to Elastic SAN volumes - Windows](elastic-san-connect-windows.md)
