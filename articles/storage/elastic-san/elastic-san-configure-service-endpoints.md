---
title: Configure Service Endpoints for Azure Elastic SAN
description: Learn how to configure service endpoints to access Azure Elastic SAN volumes.
author: roygara
ms.service: azure-elastic-san-storage
ms.topic: how-to
ms.date: 01/24/2025
ms.author: rogarana
ms.custom: references_regions, devx-track-azurecli, devx-track-azurepowershell
---

# Configure service endpoints for Azure Elastic SAN

Before you can connect to an Azure Elastic SAN volume, you need to configure how the network traffic will reach it. Azure Elastic SAN offers multiple ways to securely connect from your virtual network, and the right choice depends on your environment’s architecture and needs. This article helps you understand the available access methods: Private Endpoint, Service Endpoint and Public Network Access- and walk you through how to set up the one that fits your scenario. You’ll learn what each option does, how they interact with your network and public access settings, and how to configure them.  

## Prerequisites

- If you're using Azure PowerShell, install the [latest Azure PowerShell module](/powershell/azure/install-azure-powershell).
- If you're using Azure CLI, install the [latest version](/cli/azure/install-azure-cli).
- Once you've installed the latest version, run `az extension add -n elastic-san` to install the extension for Elastic SAN.
There are no extra registration steps required.

## Access via Service Endpoint:  

A service endpoint enables secure connectivity to Elastic SAN from a subnet within your virtual network, without requiring a private IP. Virtual network service endpoints are public and accessible via the internet. You can [Configure virtual network rules](#configure-virtual-network-rules) to control access to your volume group when using storage service endpoints.
To use a service endpoint, you must configure [Network Policies](../../private-link/disable-private-endpoint-network-policy.md) on your Elastic SAN volume group to allow traffic from specific subnets. These network rules apply only to the public endpoint of the volume group — they are not used for private endpoints. In other words, traffic from a subnet using a service endpoint must be explicitly permitted through a configured rule at the volume group level.Once network access is configured for a volume group, the configuration is inherited by all volumes belonging to the group. 

### Configure an Azure Storage service endpoint

To configure an Azure Storage service endpoint from the virtual network where access is required, you must have permission to the `Microsoft.Network/virtualNetworks/subnets/joinViaServiceEndpoint/action` [Azure resource provider operation](../../role-based-access-control/resource-provider-operations.md#microsoftnetwork) via a custom Azure role to configure a service endpoint.

Virtual network service endpoints are public and accessible via the internet. You can [Configure virtual network rules](#configure-virtual-network-rules) to control access to your volume group when using storage service endpoints. 

> [!NOTE]
> Configuration of rules that grant access to subnets in virtual networks that are a part of a different Microsoft Entra tenant are currently only supported through PowerShell, CLI and REST APIs. These rules cannot be configured through the Azure portal, though they can be viewed in the portal.

### [Portal](#tab/azure-portal)

1. Navigate to your virtual network and select **Service Endpoints**.
1. Select **+ Add**.
1. On the **Add service endpoints** screen:
    1. For **Service** select **Microsoft.Storage.Global** to add a [cross-region service endpoint](../common/storage-network-security.md#azure-storage-cross-region-service-endpoints).

    > [!NOTE]
    > You might see **Microsoft.Storage** listed as an available storage service endpoint. That option is for intra-region endpoints which exist for backward compatibility only. Always use cross-region endpoints unless you have a specific reason for using intra-region ones.

1. For **Subnets** select all the subnets where you want to allow access.
1. Select **Add**.

:::image type="content" source="media/elastic-san-create/elastic-san-service-endpoint.png" alt-text="Screenshot of the virtual network service endpoint page, adding the storage service endpoint." lightbox="media/elastic-san-create/elastic-san-service-endpoint.png":::

### [PowerShell](#tab/azure-powershell)

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

### [Azure CLI](#tab/azure-cli)

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

### Configure virtual network rules

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