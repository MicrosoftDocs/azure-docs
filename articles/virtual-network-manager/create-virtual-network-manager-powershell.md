---
title: 'Quickstart: Create a mesh network topology with Azure Virtual Network Manager using Azure PowerShell'
description: Use this quickstart to learn how to create a mesh network topology with Virtual Network Manager by using Azure PowerShell.
author: mbender-ms
ms.author: mbender
ms.service: virtual-network-manager
ms.topic: quickstart
ms.date: 04/12/2023
ms.custom: template-quickstart, ignite-fall-2021, mode-api, engagement-fy23, devx-track-azurepowershell
---

# Quickstart: Create a mesh network topology with Azure Virtual Network Manager by using Azure PowerShell

Get started with Azure Virtual Network Manager by using Azure PowerShell to manage connectivity for your virtual networks.

In this quickstart, you deploy three virtual networks and use Azure Virtual Network Manager to create a mesh network topology. Then you verify that the connectivity configuration was applied.

:::image type="content" source="media/create-virtual-network-manager-portal/virtual-network-manager-resources-diagram.png" alt-text="Diagram of resources deployed for a mesh virtual network topology with Azure virtual network manager.":::

[!INCLUDE [virtual-network-manager-preview](../../includes/virtual-network-manager-preview.md)]

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Perform this quickstart by using PowerShell locally, not through Azure Cloud Shell. The version of *Az.Network* in Azure Cloud Shell does not currently support the Azure Virtual Network Manager cmdlets.
- To modify dynamic network groups, you must be [granted access via Azure RBAC role](concept-network-groups.md#network-groups-and-azure-policy) assignment only. Classic Admin/legacy authorization is not supported.

## Sign in to your Azure account and select your subscription

To begin your configuration, sign in to your Azure account:

```azurepowershell
Connect-AzAccount
```

Then, connect to your subscription:

```azurepowershell
Set-AzContext -Subscription <subscription name or id>
```

## Install the Azure PowerShell module

Install the latest *Az.Network* Azure PowerShell module by using this command:

```azurepowershell
 Install-Module -Name Az.Network -RequiredVersion 5.3.0
```

## Create a resource group

Before you can create an Azure Virtual Network Manager instance, you have to create a resource group to host it. Create a resource group by using [New-AzResourceGroup](/powershell/module/az.Resources/New-azResourceGroup). This example creates a resource group named *vnm-learn-eastus-001ResourceGroup* in the East US location:

```azurepowershell

$location = "East US"
$rg = @{
    Name = 'rg-learn-eastus-001'
    Location = $location
}
New-AzResourceGroup @rg

```

## Define the scope and access type

Define the scope and access type for the Azure Virtual Network Manager instance by using [New-AzNetworkManagerScope](/powershell/module/az.network/new-aznetworkmanagerscope). This example defines a scope with a single subscription and sets the access type to *Connectivity*. Replace `<subscription_id>` with the ID of the subscription that you want to manage through Azure Virtual Network Manager.

```azurepowershell

Import-Module -Name Az.Network -RequiredVersion "5.3.0"

[System.Collections.Generic.List[string]]$subGroup = @()  
$subGroup.Add("/subscriptions/<subscription_id>")

[System.Collections.Generic.List[String]]$access = @()  
$access.Add("Connectivity"); 

$scope = New-AzNetworkManagerScope -Subscription $subGroup

```

## Create a Virtual Network Manager instance

Create a Virtual Network Manager instance by using [New-AzNetworkManager](/powershell/module/az.network/new-aznetworkmanager). This example creates an instance named *vnm-learn-eastus-001* in the East US location:
    
```azurepowershell
$avnm = @{
    Name = 'vnm-learn-eastus-001'
    ResourceGroupName = $rg.Name
    NetworkManagerScope = $scope
    NetworkManagerScopeAccess = $access
    Location = $location
}
$networkmanager = New-AzNetworkManager @avnm
```

## Create three virtual networks

Create three virtual networks by using [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork). This example creates virtual networks named *vnet-learn-prod-eastus-001*, *vnet-learn-prod-eastus-002*, and *vnet-learn-test-eastus-003* in the East US location. If you already have virtual networks that you want create a mesh network with, you can skip to the next section.

```azurepowershell
$vnet001 = @{
    Name = 'vnet-learn-prod-eastus-001'
    ResourceGroupName = $rg.Name
    Location = $location
    AddressPrefix = '10.0.0.0/16'    
}

$vnet_learn_prod_eastus_001 = New-AzVirtualNetwork @vnet001

$vnet002 = @{
    Name = 'vnet-learn-prod-eastus-002'
    ResourceGroupName = $rg.Name
    Location = $location
    AddressPrefix = '10.1.0.0/16'    
}
$vnet_learn_prod_eastus_002 = New-AzVirtualNetwork @vnet002

$vnet003 = @{
    Name = 'vnet-learn-test-eastus-003'
    ResourceGroupName = $rg.Name
    Location = $location
    AddressPrefix = '10.2.0.0/16'    
}
$vnet_learn_test_eastus_003 = New-AzVirtualNetwork @vnet003
```

### Add a subnet to each virtual network

To complete the configuration of the virtual networks, create a subnet configuration named *default* with a subnet address prefix of */24* by using [Add-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/add-azvirtualnetworksubnetconfig). Then, use [Set-AzVirtualNetwork](/powershell/module/az.network/set-azvirtualnetwork) to apply the subnet configuration to the virtual network.

```azurepowershell
$subnet_vnet001 = @{
    Name = 'default'
    VirtualNetwork = $vnet_learn_prod_eastus_001
    AddressPrefix = '10.0.0.0/24'
}
$subnetConfig_vnet001 = Add-AzVirtualNetworkSubnetConfig @subnet_vnet001
$vnet_learn_prod_eastus_001 | Set-AzVirtualNetwork

$subnet_vnet002 = @{
    Name = 'default'
    VirtualNetwork = $vnet_learn_prod_eastus_002
    AddressPrefix = '10.1.0.0/24'
}
$subnetConfig_vnet002 = Add-AzVirtualNetworkSubnetConfig @subnet_vnet002
$vnet_learn_prod_eastus_002 | Set-AzVirtualNetwork

$subnet_vnet003 = @{
    Name = 'default'
    VirtualNetwork = $vnet_learn_test_eastus_003
    AddressPrefix = '10.2.0.0/24'
}
$subnetConfig_vnet003 = Add-AzVirtualNetworkSubnetConfig @subnet_vnet003
$vnet_learn_test_eastus_003 | Set-AzVirtualNetwork
```

## Create a network group

Virtual Network Manager applies configurations to groups of virtual networks by placing them in network groups. Create a network group by using [New-AzNetworkManagerGroup](/powershell/module/az.network/new-aznetworkmanagergroup). This example creates a network group named *ng-learn-prod-eastus-001* in the East US location:

```azurepowershell
$ng = @{
        Name = 'ng-learn-prod-eastus-001'
        ResourceGroupName = $rg.Name
        NetworkManagerName = $networkManager.Name
    }
    $ng = New-AzNetworkManagerGroup @ng
```

## Define membership for a mesh configuration

After you create your network group, you define its membership by adding virtual networks. You can add these networks manually or by using Azure Policy.

# [Manual membership](#tab/manualmembership)

### Add membership manually

In this task, you add the static members *vnet-learn-prod-eastus-001* and *vnet-learn-prod-eastus-002* to the network group *ng-learn-prod-eastus-001* by using [New-AzNetworkManagerStaticMember](/powershell/module/az.network/new-aznetworkmanagerstaticmember).

Static members must have a unique name that's scoped to the network group. We recommend that you use a consistent hash of the virtual network ID. This approach uses the Azure Resource Manager template's `uniqueString()` implementation.

```azurepowershell
    function Get-UniqueString ([string]$id, $length=13)
    {
    $hashArray = (new-object System.Security.Cryptography.SHA512Managed).ComputeHash($id.ToCharArray())
    -join ($hashArray[1..$length] | ForEach-Object { [char]($_ % 26 + [byte][char]'a') })
    }
```

```azurepowershell
$sm_vnet001 = @{
        Name = Get-UniqueString $vnet_learn_prod_eastus_001.Id
        ResourceGroupName = $rg.Name
        NetworkGroupName = $ng.Name
        NetworkManagerName = $networkManager.Name
        ResourceId = $vnet_learn_prod_eastus_001.Id
    }
    $sm_vnet001 = New-AzNetworkManagerStaticMember @sm_vnet001
```

```azurepowershell
$sm_vnet002 = @{
        Name = Get-UniqueString $vnet_learn_prod_eastus_002.Id
        ResourceGroupName = $rg.Name
        NetworkGroupName = $ng.Name
        NetworkManagerName = $networkManager.Name
        ResourceId = $vnet_learn_prod_eastus_002.Id
    }
    $sm_vnet002 = New-AzNetworkManagerStaticMember @sm_vnet002
```
  
# [Azure Policy](#tab/azurepolicy)

### Create a policy definition for dynamic membership

By using [Azure Policy](concept-azure-policy-integration.md), you define a condition to dynamically add two virtual networks to your network group when the name of the virtual network includes *-prod*.

> [!NOTE]
> We recommend that you scope all of your conditionals to scan for only type `Microsoft.Network/virtualNetworks`, for efficiency.

1. Define the conditional statement and store it in a variable:

    ```azurepowershell
    $conditionalMembership = '{
        "if": {
            "allOf": [
                {
                    "field": "type",
                    "equals": "Microsoft.Network/virtualNetworks"
                },
                {
                    "field": "name",
                    "contains": "prod"
                }
            ]
        },
        "then": {
            "effect": "addToNetworkGroup",
            "details": {
                "networkGroupId": "/subscriptions/<subscription_id>/resourceGroups/rg-learn-eastus-001/providers/Microsoft.Network/networkManagers/vnm-learn-eastus-001/networkGroups/ng-learn-prod-eastus-001"}
        },
    }'
    
    ```

1. Create the Azure Policy definition by using the conditional statement defined in the previous step and using [New-AzPolicyDefinition](/powershell/module/az.resources/new-azpolicydefinition).

   In this example, the policy definition name is prefixed with *poldef-learn-prod-* and suffixed with a unique string that's generated from a consistent hash in the network group ID. Policy resources must have a scope unique name.

     ```azurepowershell
    function Get-UniqueString ([string]$id, $length=13)
        {
        $hashArray = (new-object System.Security.Cryptography.SHA512Managed).ComputeHash($id.ToCharArray())
        -join ($hashArray[1..$length] | ForEach-Object { [char]($_ % 26 + [byte][char]'a') })
        }
    
    $UniqueString = Get-UniqueString $ng.Id
     ```

     ```azurepowershell
    $polDef = @{
        Name = "poldef-learn-prod-"+$UniqueString
        Mode = 'Microsoft.Network.Data'
        Policy = $conditionalMembership
    }
    
    $policyDefinition = New-AzPolicyDefinition @polDef 
     ```

1. Assign the policy definition at a scope within your network manager's scope so that it can begin taking effect:

    ```azurepowershell
    $polAssign = @{
        Name = "polassign-learn-prod-"+$UniqueString
        PolicyDefinition  = $policyDefinition
    }
    
    $policyAssignment = New-AzPolicyAssignment @polAssign
    ```

---

## Create a connectivity configuration

In this task, you create a connectivity configuration with the network group *ng-learn-prod-eastus-001* by using [New-AzNetworkManagerConnectivityConfiguration](/powershell/module/az.network/new-aznetworkmanagerconnectivityconfiguration) and [New-AzNetworkManagerConnectivityGroupItem](/powershell/module/az.network/new-aznetworkmanagerconnectivitygroupitem):

1. Create a connectivity group item:

    ```azurepowershell
    $gi = @{
        NetworkGroupId = $ng.Id
    }
    $groupItem = New-AzNetworkManagerConnectivityGroupItem @gi
    ```

1. Create a configuration group and add a connectivity group item to it:

    ```azurepowershell
    [System.Collections.Generic.List[Microsoft.Azure.Commands.Network.Models.NetworkManager.PSNetworkManagerConnectivityGroupItem]]$configGroup = @()
    $configGroup.Add($groupItem)
    ```
    
1. Create the connectivity configuration with the configuration group:

    ```azurepowershell
    $config = @{
        Name = 'cc-learn-prod-eastus-001'
        ResourceGroupName = $rg.Name
        NetworkManagerName = $networkManager.Name
        ConnectivityTopology = 'Mesh'
        AppliesToGroup = $configGroup
    }
    $connectivityconfig = New-AzNetworkManagerConnectivityConfiguration @config
        ```                        

### Commit deployment

Commit the configuration to the target regions by using `Deploy-AzNetworkManagerCommit`. This step triggers your configuration to begin taking effect.

```azurepowershell
[System.Collections.Generic.List[string]]$configIds = @()  
$configIds.add($connectivityconfig.id) 
[System.Collections.Generic.List[string]]$target = @()   
$target.Add("westus")     

$deployment = @{
    Name = $networkManager.Name
    ResourceGroupName = $rg.Name
    ConfigurationId = $configIds
    TargetLocation = $target
    CommitType = 'Connectivity'
}
Deploy-AzNetworkManagerCommit @deployment 
```

## Clean up resources

If you no longer need the Azure Virtual Network Manager instance, make sure all of following points are true before you delete the resource:

* There are no deployments of configurations to any region.
* All configurations have been deleted.
* All network groups have been deleted.

To delete the resource:

1. Remove the connectivity deployment by deploying an empty configuration via `Deploy-AzNetworkManagerCommit`:

    ```azurepowershell
    [System.Collections.Generic.List[string]]$configIds = @()
    [System.Collections.Generic.List[string]]$target = @()   
    $target.Add("westus")     
    $removedeployment = @{
        Name = 'vnm-learn-eastus-001'
        ResourceGroupName = $rg.Name
        ConfigurationId = $configIds
        Target = $target
        CommitType = 'Connectivity'
    }
    Deploy-AzNetworkManagerCommit @removedeployment
    ```

1. Remove the connectivity configuration by using `Remove-AzNetworkManagerConnectivityConfiguration`:

    ```azurepowershell
    
    Remove-AzNetworkManagerConnectivityConfiguration -Name $connectivityconfig.Name -ResourceGroupName $rg.Name -NetworkManagerName $networkManager.Name
    
    ```

1. Remove the policy resources by using `Remove-AzPolicy*`:

    ```azurepowershell
    
    Remove-AzPolicyAssignment -Name $policyAssignment.Name
    Remove-AzPolicyAssignment -Name $policyDefinition.Name
    
    ```

1. Remove the network group by using `Remove-AzNetworkManagerGroup`:

    ```azurepowershell
    Remove-AzNetworkManagerGroup -Name $ng.Name -ResourceGroupName $rg.Name -NetworkManagerName $networkManager.Name
    ```

1. Delete the Virtual Network Manager instance by using `Remove-AzNetworkManager`:

    ```azurepowershell
    Remove-AzNetworkManager -name $networkManager.Name -ResourceGroupName $rg.Name
    ```

1. If you no longer need the resource that you created, delete the resource group by using [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup):

    ```azurepowershell
    Remove-AzResourceGroup -Name $rg.Name -Force
    ```

## Next steps

Now that you've created an Azure Virtual Network Manager instance, learn how to block network traffic by using a security admin configuration:

> [!div class="nextstepaction"]
> [Block network traffic with Azure Virtual Network Manager](how-to-block-network-traffic-powershell.md)
