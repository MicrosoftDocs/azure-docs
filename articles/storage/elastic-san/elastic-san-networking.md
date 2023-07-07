---
title: Azure Elastic SAN Preview networking
description: How to configure networking for Azure Elastic SAN Preview, a service that enables you to create and use network file shares in the cloud using either SMB or NFS protocols.
author: roygara
ms.service: azure-elastic-san-storage
ms.topic: how-to
ms.date: 06/26/2023
ms.author: rogarana
ms.custom: ignite-2022, devx-track-azurepowershell
---

# Configure networking for an Elastic SAN Preview

Azure Elastic storage area network (SAN) Preview allows you to secure and control the level of access to your Elastic SAN volumes that your applications and enterprise environments require.

This article describes how to configure your Elastic SAN to allow access from your Azure virtual network infrastructure.

You can configure your Elastic SAN volume groups to allow access only from endpoints on specific virtual network subnets. The allowed subnets may belong to virtual networks in the same subscription, or those in a different subscription, including subscriptions belonging to a different Azure Active Directory tenant.

To configure network access to your Elastic SAN:

> [!div class="checklist"]
> - [Configure the virtual network endpoint](#configure-virtual-network-endpoint).
> - Configure endpoint access to the desired volume groups in the Elastic SAN.
> - [Configure network rules](#configure-virtual-network-rules) to control the source and type of traffic to your Elastic SAN.
> - [Configure client connections](#configure-client-connections).

## Configure virtual network endpoint

You can allow access to your Elastic SAN volume groups from two types of Azure virtual network endpoints:

- [Storage service endpoints](../../virtual-network/virtual-network-service-endpoints-overview.md)
- [Private endpoints](../../private-link/private-endpoint-overview.md)

To decide which type of endpoint works best for you, see [Compare Private Endpoints and Service Endpoints](../../virtual-network/vnet-integration-for-azure-services.md#compare-private-endpoints-and-service-endpoints).

Each volume group can be configured to allow access from either public storage service endpoints or private endpoints, but not both at the same time.

The process for enabling each type of endpoint:

- [Configure Azure Storage service endpoint](#configure-azure-storage-service-endpoint)
- [Configure private endpoint](#configure-private-endpoint)

### Configure Azure Storage service endpoint

You can configure an Azure Storage service endpoint from the virtual network where access is required. You must have permission to the `Microsoft.Network/virtualNetworks/subnets/joinViaServiceEndpoint/action` [Azure resource provider operation](../../role-based-access-control/resource-provider-operations.md#microsoftnetwork) via a custom Azure role to configure a service endpoint.

> [!NOTE]
> Configuration of rules that grant access to subnets in virtual networks that are a part of a different Azure Active Directory tenant are currently only supported through PowerShell, CLI and REST APIs. These rules cannot be configured through the Azure portal, though they may be viewed in the portal.

# [Portal](#tab/azure-portal)

1. Navigate to your virtual network and select **Service Endpoints**.
1. Select **+ Add**.
1. On the **Add service endpoints** screen:
    1. For **Service** select **Microsoft.Storage.Global** to add a [cross-region service endpoint](../common/storage-network-security.md#azure-storage-cross-region-service-endpoints). (You might see **Microsoft.Storage** listed as an available storage service endpoint. That option is for intra-region endpoints which exist for backward compatibility only. Always use cross-region endpoints unless you have a specific reason for using intra-region ones).
    1. For **Subnets** select all the subnets where you want to allow access.
    1. Select **Add**.

:::image type="content" source="media/elastic-san-create/elastic-san-service-endpoint.png" alt-text="Screenshot of the virtual network service endpoint page, adding the storage service endpoint." lightbox="media/elastic-san-create/elastic-san-service-endpoint.png":::

# [PowerShell](#tab/azure-powershell)

Use this sample code to create a storage service endpoint for your Elastic SAN volume group with PowerShell.

```powershell
# Define some variables
$resourceGroupName = "YourResourceGroupName"
$vnetName = "YourVirtualNetworkName"
$subnetName = "YourSubnetName"

# Get the virtual network and subnet
$virtualNetwork = Get-AzVirtualNetwork -ResourceGroupName $resourceGroupName -Name $vnetName
$subnet = Get-AzVirtualNetworkSubnetConfig -VirtualNetwork $virtualNetwork -Name $subnetName

# Enable the storage service endpoint
$virtualNetwork | Set-AzVirtualNetworkSubnetConfig -Name $subnetName -AddressPrefix $subnet.AddressPrefix -ServiceEndpoint "Microsoft.Storage.Global" | Set-AzVirtualNetwork
```

# [Azure CLI](#tab/azure-cli)

Use this sample code to create a storage service endpoint for your Elastic SAN volume group with Azure CLI.

```azurecli
# Define some variables
resourceGroupName="YourResourceGroupName"
vnetName="YourVirtualNetworkName"
subnetName="YourSubnetName"

# Enable the storage service endpoint
az network vnet subnet update --resource-group $resourceGroupName --vnet-name $vnetName --name $subnetName --service-endpoints "Microsoft.Storage.Global"
```

---

### Configure private endpoint

To configure a private endpoint, you must have permission to the [Azure resource provider operation](../../role-based-access-control/resource-provider-operations.md#microsoftelasticsan) `Microsoft.ElasticSan/elasticSans/PrivateEndpointConnectionsApproval/action`. Permission for this operation is included in the [Elastic SAN Network Admin](../../role-based-access-control/built-in-roles.md#elastic-san-owner) role, but can also be granted via a custom Azure role. The Elastic SAN and the virtual networks granted access may be in different subscriptions, including subscriptions that are a part of a different Azure AD tenant.

You can configure a private endpoint using the Azure portal, PowerShell, or the Azure CLI.

# [Portal](#tab/azure-portal)

To create your private endpoint from the volume group page in the Azure portal:

1. Navigate to your Elastic SAN volume group and select the **Networking** tab.
1. Change **Network access** from **Enable public access from select virtual networks** to **Disable public access and use private access**.
1. Under **Private endpoint connections** select **Create a private endpoint**.
1. In the **Create private endpoint dialog**, specify the appropriate values for the new endpoint:
    - **Subscription**: Select your subscription.
    - **Resource group**: Select the resource group where the private endpoint will be created.
    - **Name**: Specify the name for the private endpoint.
    - **Elastic SAN sub-resource**: Specify the name of the volume group to which the private endpoint will have access.
    - **Virtual network**: Select the virtual network that contains the subnet to which the endpoint will be connected.
    - **Subnet**: The virtual network subnet to which the endpoint will be connected.
    - **Integrate with private DNS zone**: Select this box. Elastic SAN private endpoints require integration with your private DNS zone. Integrating it with a custom DNS deployment is not supported.
    - **Private DNS zone**: Specify the FQDN of the private DNS zone for the private link.
1. Select **OK**
1. Back on the **Networking** page, select ***Save**.

:::image type="content" source="media/elastic-san-private-endpoint/elastic-san-private-endpoint-create.png" alt-text="Screenshot of the Elastic SAN private endpoint creation page." lightbox="media/elastic-san-private-endpoint/elastic-san-private-endpoint-create.png":::

# [PowerShell](#tab/azure-powershell)

Use this sample code to create a private endpoint for your Elastic SAN volume group with PowerShell.

```powershell
# Get the virtual network and subnet. The subnet is input to creating the private endpoint.
$VnetRgName = "<VnetResourceGroupName>"
$VnetName   = "<VnetName>"
$SnetName   = "<SubnetName>"

$Vnet = Get-AzVirtualNetwork -Name $VnetName -ResourceGroupName $VnetRgName
$Subnet = $Vnet | Select -ExpandProperty subnets | Where-Object {$_.Name -eq $SnetName}

# Get the Elastic SAN. The Elastic SAN is input to creating the private endpoint service connection.
$EsanRgName = "<ElasticSanResourceGroupName>"
$EsanName   = "<ElasticSanName>"
$EsanVgName = "<ElasticSanVolumeGroupName>"

$Esan = Get-AzElasticSan -Name $EsanName -ResourceGroupName $EsanRgName

# Create the private endpoint service connection which is input to creating the private endpoint.
$PLConnName = "<PrivateLinkConnectionName>"
$EsanPeSvcConn = New-AzPrivateLinkServiceConnection -Name $PLConnName -PrivateLinkServiceId $Esan.Id -GroupId $EsanVgName

<#
Create the private endpoint.
In this sample we are creating it in the same resource group as the virtual network, but you can create it in any resource group that suits your needs.
#>
$PEName      = '<PrivateEndpointName>'
$PELocation  = '<PrivateEndpointLocation>'
$PeArguments = @{
    Name                         = $PEName
    ResourceGroupName            = $VnetRgName
    Location                     = $PELocation
    Subnet                       = $Subnet
    PrivateLinkServiceConnection = $EsanPeSvcConn
}
New-AzPrivateEndpoint @PeArguments
```

# [Azure CLI](#tab/azure-cli)

Use this sample code to create a private endpoint for your Elastic SAN volume group with Azure CLI.

```azurecli
# Define some variables
VnetRgName="<VnetResourceGroupName>"
VnetName="<VnetName>"
SubnetName="<SubnetName>"
EsanRgName="<ElasticSanResourceGroupName>"
EsanName="<ElasticSanName>"
EsanVgName="<ElasticSanVolumeGroupName>"
PeName="<PrivateEndpointName>"
PLConnName="<PrivateLinkConnectionName>"

id=$(az elastic-san show \
    --elastic-san-name $EsanName \
    --resource-group $EsanRgName \
    --query '[].[id]' \
    --output tsv)

# Create private endpoint
az network private-endpoint create \
    --connection-name $PLConnName
    --name $PeName \
    --private-connection-resource-id $id \
    --resource-group $VnetRgName \
    --subnet $SubnetName \
    --group-id $EsanVgName \
    --vnet-name $VnetName 
```
---

## Configure virtual network rules

You can manage virtual network rules for volume groups through the Azure portal, PowerShell, or CLI.

> [!NOTE]
> If you want to enable access to your storage account from a virtual network/subnet in another Azure AD tenant, you must use PowerShell or the Azure CLI. The Azure portal does not show subnets in other Azure AD tenants.

> [!IMPORTANT]
> If you delete a subnet that has been included in a network rule, it will be removed from the network rules for the volume group. If you create a new subnet with the same name, it won't have access to the volume group. To allow access, you must explicitly authorize the new subnet in the network rules for the volume group.

### [Portal](#tab/azure-portal)

1. Navigate to your SAN and select **Volume groups**.
1. Select a volume group and select **Create**.
1. Add an existing virtual network and subnet and select **Save**.

### [PowerShell](#tab/azure-powershell)

- Install the [Azure PowerShell](/powershell/azure/install-azure-powershell) and [sign in](/powershell/azure/authenticate-azureps).

- List virtual network rules.

    ```azurepowershell
    $Rules = Get-AzElasticSanVolumeGroup -ResourceGroupName $rgName -ElasticSanName $sanName -Name $volGroupName
    $Rules.NetworkAclsVirtualNetworkRule
    ```

- Enable service endpoint for Azure Storage on an existing virtual network and subnet.

    ```azurepowershell
    Get-AzVirtualNetwork -ResourceGroupName "myresourcegroup" -Name "myvnet" | Set-AzVirtualNetworkSubnetConfig -Name "mysubnet" -AddressPrefix "10.0.0.0/24" -ServiceEndpoint "Microsoft.Storage.Global" | Set-AzVirtualNetwork
    ```

- Add a network rule for a virtual network and subnet.

    ```azurepowershell
    $rule = New-AzElasticSanVirtualNetworkRuleObject -VirtualNetworkResourceId $subnet.Id -Action Allow
    
    Add-AzElasticSanVolumeGroupNetworkRule -ResourceGroupName $resourceGroupName -ElasticSanName $sanName -VolumeGroupName $volGroupName -NetworkAclsVirtualNetworkRule $rule
    ```

    > [!TIP]
    > To add a network rule for a subnet in a virtual network belonging to another Azure AD tenant, use a fully qualified **VirtualNetworkResourceId** parameter in the form "/subscriptions/subscription-ID/resourceGroups/resourceGroup-Name/providers/Microsoft.Network/virtualNetworks/vNet-name/subnets/subnet-name".

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
    az elastic-san volume-group show -e $sanName -g $resourceGroupName -n $volumeGroupName
    ```

- Enable service endpoint for Azure Storage on an existing virtual network and subnet.

    ```azurecli
    az network vnet subnet update --resource-group "myresourcegroup" --vnet-name "myvnet" --name "mysubnet" --service-endpoints "Microsoft.Storage.Global"
    ```

- Add a network rule for a virtual network and subnet.

    > [!TIP]
    > To add a rule for a subnet in a virtual network belonging to another Azure AD tenant, use a fully-qualified subnet ID in the form `/subscriptions/\<subscription-ID\>/resourceGroups/\<resourceGroup-Name\>/providers/Microsoft.Network/virtualNetworks/\<vNet-name\>/subnets/\<subnet-name\>`.
    >
    > You can use the **subscription** parameter to retrieve the subnet ID for a virtual network belonging to another Azure AD tenant.

    ```azurecli
    # First, get the current length of the list of virtual networks. This is needed to ensure you append a new network instead of replacing existing ones.
    virtualNetworkListLength = az elastic-san volume-group show -e $sanName -n $volumeGroupName -g $resourceGroupName --query 'length(networkAcls.virtualNetworkRules)'
    
    az elastic-san volume-group update -e $sanName -g $resourceGroupName --name $volumeGroupName --network-acls virtual-network-rules[$virtualNetworkListLength] "{virtualNetworkRules:[{id:/subscriptions/subscriptionID/resourceGroups/RGName/providers/Microsoft.Network/virtualNetworks/vnetName/subnets/default, action:Allow}]}"
    ```

- Remove a network rule. The following command removes the first network rule, modify it to remove the network rule you'd like.
    
    ```azurecli
    az elastic-san volume-group update -e $sanName -g $resourceGroupName -n $volumeGroupName --network-acls virtual-network-rules[1]=null
    ```

---
---

## Configure client connections

After you have enabled the desired endpoints and granted access in your network rules, you are ready to configure your clients to connect to the appropriate Elastic SAN volumes. For more details on how to configure client connections, see:

- [Connect to Elastic SAN Preview volumes - AKS](elastic-san-connect-aks.md)
- [Connect to Elastic SAN Preview volumes - Linux](elastic-san-connect-linux.md)
- [Connect to Elastic SAN Preview volumes - Windows](elastic-san-connect-windows.md)

> [!NOTE]
> If a connection between a virtual machine (VM) and an Elastic SAN volume is lost, the connection will retry for 90 seconds until terminating. Losing a connection to an Elastic SAN volume won't cause the VM to restart.

## Next steps

[Connect Azure Elastic SAN Preview volumes to an Azure Kubernetes Service cluster](elastic-san-connect-aks.md)
[Connect to Elastic SAN Preview volumes - Linux](elastic-san-connect-linux.md)
[Connect to Elastic SAN Preview volumes - Windows](elastic-san-connect-windows.md)
