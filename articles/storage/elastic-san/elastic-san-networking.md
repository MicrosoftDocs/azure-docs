---
title: Azure Elastic SAN Preview networking
description: How to configure networking for Azure Elastic SAN Preview, a service that enables you to create and use network file shares in the cloud using either SMB or NFS protocols.
author: roygara
ms.service: storage
ms.topic: how-to
ms.date: 05/09/2023
ms.author: rogarana
ms.subservice: elastic-san
ms.custom: ignite-2022, devx-track-azurepowershell, devx-track-azurecli
---

# Configure networking for an Elastic SAN Preview

Azure Elastic storage area network (SAN) preview allows you to secure and control the level of access to your Elastic SAN volumes that your applications and enterprise environments require. This article describes how to configure your Elastic SAN to allow access from your Azure virtual network infrastructure.

You can configure your Elastic SAN, and the volume groups that belong to it, to allow access only from endpoints on specific virtual network subnets. The allowed subnets may belong to a virtual network in the same subscription, or those in a different subscription, including subscriptions belonging to a different Azure Active Directory tenant. Before configuring endpoint access, determine the type of endpoint that best suits your needs. For more details, see [Compare Private Endpoints and Service Endpoints](../../virtual-network/vnet-integration-for-azure-services.md#compare-private-endpoints-and-service-endpoints).

Once you determine the type of endpoint to use:

1. [Configure endpoint access to the Elastic SAN](#configure-endpoint-access-to-the-elastic-san).
1. Configure endpoint access to the desired volume groups in the Elastic SAN.
1. [Configure network rules](#configure-virtual-network-rules) to control the source and type of traffic to your Elastic SAN.
1. [Configure access to Elastic SAN volumes from clients](#configure-access-to-elastic-san-volumes-from-clients)

## Configure endpoint access to the Elastic SAN

To configure endpoint access to the Elastic from a virtual network subnet endpoint, the endpoint must be enabled from the subnet and the appropriate administrator must approve access to the SAN and the desired volume groups. The process for doing so, varies by the endpoint type:

- [Configure Storage service endpoint](#configure-storage-service-endpoint)
- [Configure private endpoint](#configure-private-endpoint)

### Configure Storage service endpoint

In your virtual network, enable the Storage service endpoint on your subnet. This ensures traffic is routed optimally to your Elastic SAN. To enable service point for Azure Storage, you must have the appropriate permissions for the virtual network. This operation can be performed by a user that has been given permission to the Microsoft.Network/virtualNetworks/subnets/joinViaServiceEndpoint/action [Azure resource provider operation](../../role-based-access-control/resource-provider-operations.md#microsoftnetwork) via a custom Azure role. An Elastic SAN and the virtual networks granted access may be in different subscriptions, including subscriptions that are a part of a different Azure AD tenant.

> [!NOTE]
> Configuration of rules that grant access to subnets in virtual networks that are a part of a different Azure Active Directory tenant are currently only supported through PowerShell, CLI and REST APIs. These rules cannot be configured through the Azure portal, though they may be viewed in the portal.

# [Portal](#tab/azure-portal)
1. Navigate to your virtual network and select **Service Endpoints**.
1. Select **+ Add** and for **Service** select **Microsoft.Storage**.
1. Select any policies you like, and the subnet you deploy your Elastic SAN into and select **Add**.

:::image type="content" source="media/elastic-san-create/elastic-san-service-endpoint.png" alt-text="Screenshot of the virtual network service endpoint page, adding the storage service endpoint." lightbox="media/elastic-san-create/elastic-san-service-endpoint.png":::

# [PowerShell](#tab/azure-powershell)

```powershell
$resourceGroupName = "yourResourceGroup"
$vnetName = "yourVirtualNetwork"
$subnetName = "yourSubnet"

$virtualNetwork = Get-AzVirtualNetwork -ResourceGroupName $resourceGroupName -Name $vnetName

$subnet = Get-AzVirtualNetworkSubnetConfig -VirtualNetwork $virtualNetwork -Name $subnetName

$virtualNetwork | Set-AzVirtualNetworkSubnetConfig -Name $subnetName -AddressPrefix $subnet.AddressPrefix -ServiceEndpoint "Microsoft.Storage.Global" | Set-AzVirtualNetwork
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az network vnet subnet update --resource-group "myresourcegroup" --vnet-name "myvnet" --name "mysubnet" --service-endpoints "Microsoft.Storage.Global"
```
---

#### Available virtual network regions

Service endpoints for Azure Storage work between virtual networks and service instances in any region. They also work between virtual networks and service instances in [paired regions](../../availability-zones/cross-region-replication-azure.md) to allow continuity during a regional failover. When planning for disaster recovery during a regional outage, you should create the virtual networks in the paired region in advance. Enable service endpoints for Azure Storage, with network rules granting access from these alternative virtual networks. Then apply these rules to your zone-redundant SANs.

##### Azure Storage cross-region service endpoints

Cross-region service endpoints for Azure became generally available in April of 2023. With cross-region service endpoints, subnets will no longer use a public IP address to communicate with any storage account. Instead, all the traffic from subnets to storage accounts will use a private IP address as a source IP. As a result, any storage accounts that use IP network rules to permit traffic from those subnets will no longer have an effect.

To use cross-region service endpoints, it might be necessary to delete existing **Microsoft.Storage** endpoints and recreate them as cross-region (**Microsoft.Storage.Global**).

### Configure private endpoint

In your virtual network, enable the Storage service endpoint on your subnet. This ensures traffic is routed optimally to your Elastic SAN. To enable a service endpoint for Azure Storage, you must have the appropriate permissions for the virtual network. This operation can be performed by a user that has been given permission to the Microsoft.Network/virtualNetworks/subnets/joinViaServiceEndpoint/action [Azure resource provider operation](../../role-based-access-control/resource-provider-operations.md#microsoftnetwork). Permission for this action is included in the Elastic SAN Network Admin role, but can also be granted via a custom Azure role. An Elastic SAN and the virtual networks granted access may be in different subscriptions, including subscriptions that are a part of a different Azure AD tenant.

To create a private endpoint by using the Azure Portal, see [Connect privately to a storage account from the Storage Account experience in the Azure portal](../../private-link/tutorial-private-endpoint-storage-portal.md).

To create a private endpoint by using PowerShell or the Azure CLI, see either of these articles. Both of them feature an Azure web app as the target service, but the steps to create a private link are the same for an Azure Storage account.

- [Create a private endpoint using Azure CLI](../../private-link/create-private-endpoint-cli.md)

- [Create a private endpoint using Azure PowerShell](../../private-link/create-private-endpoint-powershell.md)

When you create a private endpoint, you must specify the Elastic SAN and the volume group to which it connects.

If you create a private endpoint for the Data Lake Storage Gen2 storage resource, then you should also create one for the Blob Storage resource. That's because operations that target the Data Lake Storage Gen2 endpoint might be redirected to the Blob endpoint. Similarly, if you add a private endpoint for Blob Storage only, and not for Data Lake Storage Gen2, some operations (such as Manage ACL, Create Directory, Delete Directory, etc.) will fail since the Gen2 APIs require a DFS private endpoint. By creating a private endpoint for both resources, you ensure that all operations can complete successfully.

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

- Install the [Azure PowerShell](/powershell/azure/install-Az-ps) and [sign in](/powershell/azure/authenticate-azureps).

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

## Configure access to Elastic SAN volumes from clients

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
