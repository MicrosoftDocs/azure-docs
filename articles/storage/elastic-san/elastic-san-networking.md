---
title: Azure Elastic SAN networking (preview)
description: An overview of Azure Elastic SAN (preview), a service that enables you to create and use network file shares in the cloud using either SMB or NFS protocols.
author: roygara
ms.service: storage
ms.topic: how-to
ms.date: 10/12/2022
ms.author: rogarana
ms.subservice: elastic-san
ms.custom: ignite-2022
---

# Configure Elastic SAN networking (preview)

Azure Elastic storage area network (SAN) allows you to secure and control the level of access to your Elastic SAN volumes that your applications and enterprise environments demand, based on the type and subset of networks or resources used. When network rules are configured, only applications requesting data over the specified set of networks or through the specified set of Azure resources that can access an Elastic SAN (preview). Access to your SAN's volumes are limited to resources in subnets in the same Azure Virtual Network that your SAN's volume group is configured with.

Volume groups are configured to allow access only from specific subnets. The allowed subnets may belong to a virtual network in the same subscription, or those in a different subscription, including subscriptions belonging to a different Azure Active Directory tenant.

You must enable a [Service endpoint](../../virtual-network/virtual-network-service-endpoints-overview.md) for Azure Storage within the virtual network. The service endpoint routes traffic from the virtual network through an optimal path to the Azure Storage service. The identities of the subnet and the virtual network are also transmitted with each request. Administrators can then configure network rules for the SAN that allow requests to be received from specific subnets in a virtual network. Clients granted access via these network rules must continue to meet the authorization requirements of the Elastic SAN to access the data.

Each volume group supports up to 200 virtual network rules.

> [!IMPORTANT]
> If you delete a subnet that has been included in a network rule, it will be removed from the network rules for the volume group. If you create a new subnet with the same name, it won't have access to the volume group. To allow access, you must explicitly authorize the new subnet in the network rules for the volume group.

## Required permissions

To enable service point for Azure Storage, the user must have the appropriate permissions for the virtual network. This operation can be performed by a user that has been given permission to the Microsoft.Network/virtualNetworks/subnets/joinViaServiceEndpoint/action [Azure resource provider operation](../../role-based-access-control/resource-provider-operations.md#microsoftnetwork) via a custom Azure role.

An Elastic SAN and the virtual networks granted access may be in different subscriptions, including subscriptions that are a part of a different Azure AD tenant.

> [!NOTE]
> Configuration of rules that grant access to subnets in virtual networks that are a part of a different Azure Active Directory tenant are currently only supported through PowerShell, CLI and REST APIs. Such rules cannot be configured through the Azure portal, though they may be viewed in the portal.

## Available virtual network regions

By default, service endpoints work between virtual networks and service instances in the same Azure region. When using service endpoints with Azure Storage, service endpoints also work between virtual networks and service instances in a [paired region](../../availability-zones/cross-region-replication-azure.md). If you want to use a service endpoint to grant access to virtual networks in other regions, you must register the `AllowGlobalTagsForStorage` feature in the subscription of the virtual network. This capability is currently in public preview. 

Service endpoints allow continuity during a regional failover. When planning for disaster recovery during a regional outage, you should create the virtual networks in the paired region in advance. Enable service endpoints for Azure Storage, with network rules granting access from these alternative virtual networks. Then apply these rules to your zone-redundant SANs.

## Enabling access to virtual networks in other regions (preview)

> 
> [!IMPORTANT]
> This capability is currently in PREVIEW.
>
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

To enable access from a virtual network that is located in another region over service endpoints, register the `AllowGlobalTagsForStorage` feature in the subscription of the virtual network.

> [!NOTE]
> For updating the existing service endpoints to access a volume group in another region, perform an [update subnet](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-update) operation on the subnet after registering the subscription with the `AllowGlobalTagsForStorage` feature. Similarly, to go back to the old configuration, perform an [update subnet](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-update) operation after deregistering the subscription with the `AllowGlobalTagsForStorage` feature. 


### [Portal](#tab/azure-portal)

During the preview you must use either PowerShell or the Azure CLI to enable this feature.

### [PowerShell](#tab/azure-powershell)

- Open a Windows PowerShell command window.

- Sign in to your Azure subscription with the `Connect-AzAccount` command and follow the on-screen directions.

   ```powershell
   Connect-AzAccount
   ```

- If your identity is associated with more than one subscription, then set your active subscription to the subscription of the virtual network.

   ```powershell
   $context = Get-AzSubscription -SubscriptionId <subscription-id>
   Set-AzContext $context
   ```

   Replace the `<subscription-id>` placeholder value with the ID of your subscription.

- Register the `AllowGlobalTagsForStorage` feature by using the [Register-AzProviderFeature](/powershell/module/az.resources/register-azproviderfeature) command.

   ```powershell
   Register-AzProviderFeature -ProviderNamespace Microsoft.Network -FeatureName AllowGlobalTagsForStorage
   ```

   > [!NOTE]
   > The registration process might not complete immediately. Verify that the feature is registered before using it.

- To verify that the registration is complete, use the [Get-AzProviderFeature](/powershell/module/az.resources/get-azproviderfeature) command.

   ```powershell
   Get-AzProviderFeature -ProviderNamespace Microsoft.Network -FeatureName AllowGlobalTagsForStorage
   ```

### [Azure CLI](#tab/azure-cli)

- Open the [Azure Cloud Shell](../../cloud-shell/overview.md), or if you've [installed](/cli/azure/install-azure-cli) the Azure CLI locally, open a command console application such as Windows PowerShell.

- If your identity is associated with more than one subscription, then set your active subscription to subscription of the virtual network.

   ```azurecli-interactive
   az account set --subscription <subscription-id>
   ```

   Replace the `<subscription-id>` placeholder value with the ID of your subscription.

- Register the `AllowGlobalTagsForStorage` feature by using the [az feature register](/cli/azure/feature#az-feature-register) command.

   ```azurecli
   az feature register --namespace Microsoft.Network --name AllowGlobalTagsForStorage
   ```

   > [!NOTE]
   > The registration process might not complete immediately. Make sure to verify that the feature is registered before using it.

- To verify that the registration is complete, use the [az feature](/cli/azure/feature#az-feature-show) command.

   ```azurecli
   az feature show --namespace Microsoft.Network --name AllowGlobalTagsForStorage
   ```

---

## Managing virtual network rules

You can manage virtual network rules for volume groups through the Azure portal, PowerShell, or CLI. 

> [!NOTE]
> If you registered the `AllowGlobalTagsForStorage` feature, and you want to enable access to your volumes from a virtual network/subnet in another Azure AD tenant, or in a region other than the region of the SAN or its paired region, then you must use PowerShell or the Azure CLI. The Azure portal does not show subnets in other Azure AD tenants or in regions other than the region of the storage account or its paired region, and hence cannot be used to configure access rules for virtual networks in other regions.

### [Portal](#tab/azure-portal)

Currently, you must use either the Azure PowerShell module or Azure CLI to manage virtual network rules for a volume group.

### [PowerShell](#tab/azure-powershell)

- Install the [Azure PowerShell](/powershell/azure/install-Az-ps) and [sign in](/powershell/azure/authenticate-azureps).

- List virtual network rules.

    ```azurepowershell
    $Rules = Get-AzElasticSanVolumeGroup -ResourceGroupName $rgName -ElasticSanName $sanName -Name $volGroupName
    $Rules.NetworkAclsVirtualNetworkRule
    ```

- Enable service endpoint for Azure Storage on an existing virtual network and subnet.

    ```azurepowershell
    Get-AzVirtualNetwork -ResourceGroupName "myresourcegroup" -Name "myvnet" | Set-AzVirtualNetworkSubnetConfig -Name "mysubnet" -AddressPrefix "10.0.0.0/24" -ServiceEndpoint "Microsoft.Storage" | Set-AzVirtualNetwork
    ```

- Add a network rule for a virtual network and subnet.

    ```azurepowershell
    $rule1 = New-AzElasticSanVirtualNetworkRuleObject -VirtualNetworkResourceId <resourceIDHere> -Action Allow
    
    Update-AzElasticSanVolumeGroup -ResourceGroupName $rgName -ElasticSanName $sanName -Name $volGroupName -NetworkAclsVirtualNetworkRule $rule1
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
    az network vnet subnet update --resource-group "myresourcegroup" --vnet-name "myvnet" --name "mysubnet" --service-endpoints "Microsoft.Storage"
    ```

- Add a network rule for a virtual network and subnet.

    > [!TIP]
    > To add a rule for a subnet in a virtual network belonging to another Azure AD tenant, use a fully-qualified subnet ID in the form `/subscriptions/\<subscription-ID\>/resourceGroups/\<resourceGroup-Name\>/providers/Microsoft.Network/virtualNetworks/\<vNet-name\>/subnets/\<subnet-name\>`.
    >
    > You can use the **subscription** parameter to retrieve the subnet ID for a virtual network belonging to another Azure AD tenant.

    ```azurecli
    az elastic-san volume-group update -e $sanName -g $resourceGroupName --name $volumeGroupName --network-acls "{virtualNetworkRules:[{id:/subscriptions/subscriptionID/resourceGroups/RGName/providers/Microsoft.Network/virtualNetworks/vnetName/subnets/default, action:Allow}]}"
    ```

- Remove a network rule. The following command removes the first network rule, modify it to remove the network rule you'd like.
    
    ```azurecli
    az elastic-san volume-group update -e $sanName -g $resourceGroupName -n $volumeGroupName --network-acls virtual-network-rules[1]=null
    ```

---
---

## Next steps

[Plan for deploying an Elastic SAN (preview)](elastic-san-planning.md)
