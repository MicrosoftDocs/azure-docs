---
title: Manage Administrative State in Azure Load Balancer
description: Learn how to manage the admin state for a backend pool instance in Azure Load Balancer. You can set, update, or remove the admin state using the Azure portal, Azure PowerShell, or Azure CLI.
author: mbender-ms
ms.author: mbender
ms.service: load-balancer
ms.topic: how-to
ms.date: 05/30/2024
ms.custom: references_regions
---

# Manage Administrative (Admin) State in Azure Load Balancer

Administrative State (Admin State) is a feature of Azure Load Balancer that allows you to override the Load Balancer’s health probe behavior on a per backend pool instance basis. There are three types of admin state values: **Up**, **Down**, **None**.

You can use the Azure portal, Azure PowerShell, or Azure CLI to manage the admin state for a backend pool instance. Each section provides instructions for each method with examples for setting, updating, or removing an admin state configuration.

[!INCLUDE [load-balancer-admin-state-preview](../../includes/load-balancer-admin-state-preview.md)]

## Prerequisites

# [Azure portal](#tab/azureportal)

- Access to the Azure portal using [https://preview.portal.azure.com].
- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/)
- Self-registration of the feature name **SLBAllowAdminStateChangeForConnectionDraining** in your subscription. For information on registering the feature in your subscription, see [Register preview feature doc](../azure-resource-manager/management/preview-features.md).
- An existing resource group for all resources.
- Two or more existing [Virtual Machines](../virtual-machines/windows/quick-create-portal.md).
- An existing [standard load balancer](quickstart-load-balancer-standard-internal-portal.md) in the same subscription and virtual network as the virtual machines.
  - The load balancer should have a backend pool with health probes and load balancing rules attached.

> [!IMPORTANT]
> This feature is supported via Azure Portal Preview. To use this feature in Azure Portal, make sure you are using [Azure Portal Preview link] (https://preview.portal.azure.com)
# [Azure PowerShell](#tab/azurepowershell)

- Access to the Azure portal.
- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/)
- Self-registration of the feature name **SLBAllowAdminStateChangeForConnectionDraining** in your subscription. For information on registering the feature in your subscription, see [Register preview feature doc](../azure-resource-manager/management/preview-features.md).
- An existing resource group for all resources.
- Existing [Virtual Machines](../virtual-machines/windows/quick-create-powershell.md).
- An existing [standard load balancer](quickstart-load-balancer-standard-internal-powershell.md) in the same subscription and virtual network as the virtual machine.
  - The load balancer should have a backend pool with health probes and load balancing rules attached.

# [Azure CLI](#tab/azurecli)

- Access to the Azure portal.
- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/)
- Self-registration of the feature name **SLBAllowAdminStateChangeForConnectionDraining** in your subscription. For information on registering the feature in your subscription, see [Register preview feature doc](../azure-resource-manager/management/preview-features.md).
- An existing resource group for all resources.
- Existing [Virtual Machines](../virtual-machines/windows/quick-create-cli.md).
- An existing [standard load balancer](quickstart-load-balancer-standard-internal-cli.md) in the same subscription and virtual network as the virtual machine.
  - The load balancer should have a backend pool with health probes and load balancing rules attached.

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]


---

## Set admin state on a new backend pool instance
In this section, you learn how to set an admin state to **Up** or **Down** as part of a new backend pool create. 

# [Azure portal](#tab/azureportal)

1. Sign in to the Azure portal.
2. In the search box at the top of the portal, enter **Load balancer**. Select **Load balancers** in the search results.
3. Select your load balancer from the list.
4. In your load balancer's page, select **Backend pools** under **Settings**.
5. Select **+ Add** in **Backend pools** to add a new backend pool.
6. In the **Add backend pool** window, enter or select the following information:
  
  | **Setting** | **Value** |
  |------------------------|----------------------------|
  | **Name**                   | Enter `myBackendpool`.     |
  | **Backend Pool Configuration** | Select **IP Address**. |
  | **IP addresses**       | |
  | **Backend Address Name** | Enter the name of your backend address. |
  | **IP Address**         | Select the IP address to be added to the backend pool. |

7. Select **Save**.
8. In your **Backend pools** page, select the corresponding **Admin State** value of your recently added backend pool instance.
   
   :::image type="content" source="media/manage-admin-state-how-to/select-admin-state-backend-pools-window.png" alt-text="Screenshot of backend pools window with admin state link highlighted.":::

9.  In your **Admin state details** window, select **Down** from the dropdown menu.

    :::image type="content" source="media/manage-admin-state-how-to/set-admin-state-backend-pool-down.png" alt-text="Screenshot of admin state details windows with down selected for admin state.":::
    
10. Select **Save**.

# [Azure PowerShell](#tab/azurepowershell)

1. Connect to your Azure subscription with Azure PowerShell.
2. Create a new backend pool with a backend pool instance while setting the admin state value to UP or DOWN with [`New-AzLoadBalancerBackendAddressConfig`](/powershell/module/az.network/new-azloadbalancerbackendaddressconfig). Replace the values in brackets with the names of the resources in your configuration.

    ```azurepowershell
    $rsg = <resource-group>
    $vnt = <virtual-network-name>
    $lbn = <load-balancer-name>
    $bep = <backend-pool-name>
    $ip = <ip-address>
    $ben = <backend-address-name>
    
    $vnet = Get-AzVirtualNetwork -Name $vnt -ResourceGroupName $rsg
    $lb = Get-AzLoadBalancer -ResourceGroupName $rsg -Name $lbn
    $ip1 = New-AzLoadBalancerBackendAddressConfig -IpAddress $ip -Name $ben -VirtualNetworkId $vnet.Id -AdminState “DOWN”
    $lb | New-AzLoadBalancerBackendAddressPool -LoadBalancerBackendAddress $ip1 -Name $bep
    ```

This example sets a new backend pool instance admin state to DOWN with the following defined values:

[!INCLUDE [load-balancer-admin-state-example-values](../../includes/load-balancer-admin-state-example-values.md)]

```azurepowershell

$rsg = "MyResourceGroup"
$vnt = "MyVnet"
$lbn = "MyLB"
$bep = "MyAddressPool"
$ip = "10.0.2.4"
$ben = "MyBackend"

$vnet = Get-AzVirtualNetwork -Name $vnt -ResourceGroupName $rsg
$lb = Get-AzLoadBalancer -ResourceGroupName $rsg -Name $lbn
$ip1 = New-AzLoadBalancerBackendAddressConfig -IpAddress $ip -Name $ben -VirtualNetworkId $vnet.Id -AdminState “DOWN”
$lb | New-AzLoadBalancerBackendAddressPool -LoadBalancerBackendAddress $ip1 -Name $bep

```

# [Azure CLI](#tab/azurecli)

1. Connect to your Azure subscription with Azure CLI.
2. Create a new backend pool with a backend pool instance while setting admin state value to UP or DOWN with [az network lb address-pool create](/cli/azure/network/lb/address-pool#az-network-lb-pool-create). Replace the values in brackets with the names of the resources in your configuration.

    ```azurecli
    az network lb address-pool create \
        -g <resource-group> \
        --lb-name <lb-name> \
        -n <lb-backend-pool-name> \
        --vnet <virtual-network-name> \
        --backend-address “{name: <new-lb-backend-pool-address-name>,ip-address:<new-lb-backend-pool-address>}” \
        --admin-state <admin-state-value>
    ```

1. This example updates a backend pool instance admin state to DOWN with the following defined values:

[!INCLUDE [load-balancer-admin-state-example-values](../../includes/load-balancer-admin-state-example-values.md)]

```azurecli
az network lb address-pool create \
    -g MyResourceGroup \
    --lb-name MyLb \
    -n MyAddressPool \
    --vnet MyVnet \
    --backend-address “{name: MyBackend,ip-address:10.0.2.4}” \
    --admin-state DOWN
```

---

## Set admin state as part of new backend pool instance after creation

In this section, you learn how to set an admin state to **Up** or **Down** as part of a new backend pool instance add.

# [Azure portal](#tab/azureportal)

1. Sign in to the [Azure portal](https://portal.azure.com).
2. In the search box at the top of the portal, enter **Load balancer** and select **Load balancers** in the search results.
3. On the load balancer's **Overview** page, select your load balancer from the list.
4. In your load balancer's page, select **Backend pools** under **Settings**.
5. Select your backend pool.
6. In your backend pool's page, select **+ Add** under **IP configurations**.

    > [!NOTE]
    > This step is assuming your backend pool is NIC-based.

7. Select the virtual machine you want to add to the backend pool.
8. Select **Add** and **Save**.
9. In your **Backend pools** page, select the corresponding **Admin State** value of your recently added backend pool instance.
10. In your **Admin state details** window, select **Up** from the dropdown menu.
    
    :::image type="content" source="media/manage-admin-state-how-to/set-admin-state-backend-pool-up.png" alt-text="Screenshot of admin state details window with up selected for admin state.":::

11.	Select **Save**.

# [Azure PowerShell](#tab/azurepowershell)

1. Connect to your Azure subscription with Azure PowerShell.
1. Add a new backend pool instance with the admin state value configured to UP or DOWN with [New-AzLoadBalancerBackendAddressConfig](/powershell/module/az.network/new-azloadbalancerbackendaddressconfig). Replace the values in brackets with the names of the resources in your configuration.

    ```azurepowershell
    $rsg = <resource-group>
    $vnt = <virtual-network-name>
    $lbn = <load-balancer-name>
    $bep = <backend-pool-name>
    $ip = <ip-address>
    $ben = <backend-address-name>
    
    $vnet = Get-AzVirtualNetwork -Name $vnt -ResourceGroupName $rsg
    $lb = Get-AzLoadBalancer -ResourceGroupName $rsg -Name $lbn
    $ip1 = New-AzLoadBalancerBackendAddressConfig -IpAddress $ip -Name $ben -VirtualNetworkId $vnet.Id -AdminState “UP”
    $lb | Set-AzLoadBalancerBackendAddressPool -LoadBalancerBackendAddress $ip1 -Name $bep
    ```

1. This example sets a new backend pool instance admin state to UP with the following defined values:

[!INCLUDE [load-balancer-admin-state-example-values](../../includes/load-balancer-admin-state-example-values.md)]
  
```azurepowershell

# Set the values for the variables
$rsg = "MyResourceGroup"
$vnt = "MyVnet"
$lbn = "MyLB"
$bep = "MyAddressPool"
$ip = "10.0.2.4"
$ben = "MyBackend"

$vnet = Get-AzVirtualNetwork -Name $vnt -ResourceGroupName $rsg
$lb = Get-AzLoadBalancer -ResourceGroupName $rsg -Name $lbn
$ip1 = New-AzLoadBalancerBackendAddressConfig -IpAddress $ip -Name $ben -VirtualNetworkId $vnet.Id -AdminState “UP”
$lb | Set-AzLoadBalancerBackendAddressPool -LoadBalancerBackendAddress $ip1 -Name $bep

```

# [Azure CLI](#tab/azurecli)

1.	Connect to your Azure subscription with Azure CLI.
2.	Add a new backend pool instance with the admin state value is configured. The value can be set to UP or DOWN with [az network lb address-pool update](/cli/azure/network/lb/address-pool#az-network-lb-address-pool-update) . Replace the values in brackets with the names of the resources in your configuration.

    ```azurecli
    az network lb address-pool update \
        -g <resource-group> \
        --lb-name <lb-name> \
        -n <lb-backend-pool-name> \
        --vnet <virtual-network-name> \
        --backend-address “{name: <new-lb-backend-pool-address-name>,ip-address:<new-lb-backend-pool-address>}” |
        --admin-state <admin-state-value>
    ```

1. This example sets a new backend pool instance admin state to UP with the following defined values:

[!INCLUDE [load-balancer-admin-state-example-values](../../includes/load-balancer-admin-state-example-values.md)]

```azurecli

az network lb address-pool update \
    -g MyResourceGroup \
    --lb-name MyLb \
    -n MyAddressPool \
    --vnet MyVnet \
    --backend-address “{name: MyBackend,ip-address:10.0.2.4}” |
    --admin-state UP

```

> [!NOTE]
> You can also use [`az network lb address-pool address add`](/cli/azure/network/lb/address-pool/address##az-network-lb-address-pool-add) to set admin state on as part of a new backend pool instance add.


---

## Update admin state on existing backend pool instance

In this section, you learn how to update an existing admin state from existing backend pool instance by setting the value to **Up** or **Down**. 

# [Azure portal](#tab/azureportal)

1. Sign in to the [Azure portal](https://portal.azure.com).
2. In the search box at the top of the portal, enter **Load balancer** and select **Load balancers** in the search results.
3. Select your load balancer from the list.
4. In your load balancer's page, select **Backend pools** under **Settings**.
9. In your **Backend pools** page, select the corresponding **Admin State** value of your recently added backend pool instance.
10. In your **Admin state details** window, select **Up** from the dropdown menu.

    :::image type="content" source="media/manage-admin-state-how-to/set-admin-state-backend-pool-up.png" alt-text="Screenshot of admin state details window with up selected for admin state value.":::

11. Select **Save**.

# [Azure PowerShell](#tab/azurepowershell)

1. Connect to your Azure subscription with Azure PowerShell.
2. Update an existing backend pool instance with the admin state value configured to UP or DOWN with [New-AzLoadBalancerBackendAddressConfig](/powershell/module/az.network/new-azloadbalancerbackendaddressconfig).. Replace the values in brackets with the names of the resources in your configuration.

    ```azurepowershell
    
    # Set the values for the variables
    $rsg = <resource-group>
    $vnt = <virtual-network-name>
    $lbn = <load-balancer-name>
    $bep = <backend-pool-name>
    $ip = <ip-address>
    $ben = <backend-address-name>
    
    $vnet = Get-AzVirtualNetwork -Name $vnt -ResourceGroupName $rsg
    $lb = Get-AzLoadBalancer -ResourceGroupName $rsg -Name $lbn
    $ip1 = New-AzLoadBalancerBackendAddressConfig -IpAddress $ip -Name $ben -VirtualNetworkId $vnet.Id -AdminState “DOWN”
    $lb | Set-AzLoadBalancerBackendAddressPool -LoadBalancerBackendAddress $ip1 -Name $bep
    
    ```

1. This example sets an existing backend pool instance admin state to DOWN with the following defined values:

[!INCLUDE [load-balancer-admin-state-example-values](../../includes/load-balancer-admin-state-example-values.md)]

```azurepowershell

$rsg = "MyResourceGroup"
$vnt = "MyVnet"
$lbn = "MyLB"
$bep = "MyAddressPool"
$ip = "10.0.2.4"
$ben = "MyBackend"

$vnet = Get-AzVirtualNetwork -Name $vnt -ResourceGroupName $rsg
$lb = Get-AzLoadBalancer -ResourceGroupName $rsg -Name $lbn
$ip1 = New-AzLoadBalancerBackendAddressConfig -IpAddress $ip -Name $ben -VirtualNetworkId $vnet.Id -AdminState “DOWN”
$lb | Set-AzLoadBalancerBackendAddressPool -LoadBalancerBackendAddress $ip1 -Name $bep

```

# [Azure CLI](#tab/azurecli)

1. Connect to your Azure subscription with Azure CLI.
2. Update an existing backend pool instance, and configure the admin state value to UP or DOWN with [az network lb address-pool update](/cli/azure/network/lb/address-pool#az-network-lb-address-pool-update). Replace the values in brackets with the names of the resources in your configuration.

    ```azurecli
        
    az network lb address-pool update \
        -g <resource-group> \
        --lb-name <lb-name> \
        -n <lb-backend-pool-name> \
        --backend-address “{name: <lb-backend-pool-address-name>,ip-address:<lb-backend-pool-address>}” |
        --admin-state <admin-state-value>
    
    ```

1. This example updates an existing backend pool instance admin state to DOWN with the following defined values:

[!INCLUDE [load-balancer-admin-state-example-values](../../includes/load-balancer-admin-state-example-values.md)]

```azurecli

    az network lb address-pool update \
        -g MyResourceGroup \
        --lb-name MyLb \
        -n MyAddressPool \
        --backend-address “{name: MyBackend,ip-address:10.0.2.4}” |
        --admin-state DOWN
    
```

> [!NOTE]
> You can also use [`az network lb address-pool address update`](/cli/azure/network/lb/address-pool/address#az-network-lb-address-pool-update) to update admin state on an existing backend pool instance.

---

## Removing admin state from existing backend pool instance

In this section, you learn how to remove an existing admin state from an existing backend pool instance. This is done by setting the admin state value to **None**.

# [Azure portal](#tab/azureportal)

1. Sign in to the [Azure portal](https://portal.azure.com).
2. In the search box at the top of the portal, enter **Load balancer** and select **Load balancers** in the search results.
3. Select your load balancer from the list.
4. In your load balancer's page, select **Backend pools** under **Settings**.
5. Select the corresponding **Admin State** value of your backend pool instance that you would like to remove.
6. In your admin state’s window, select **None** from the dropdown menu.

    :::image type="content" source="media/manage-admin-state-how-to/set-admin-state-backend-pool-none.png" alt-text="Screenshot of admin state details windows with none selected for admin state.":::

1. Select **Save**.

# [Azure PowerShell](#tab/azurepowershell)

1. Connect to your Azure subscription with Azure PowerShell.
2. Remove an existing backend pool instance. This is done by setting the admin state value to **NONE** with [New-AzLoadBlancerBackendAddressConfig](/powershell/module/az.network/new-azloadbalancerbackendaddressconfig). Replace the values in brackets with the names of the resources in your configuration.

    ```azurepowershell
    
    # Set the values for the variables
    $rsg = <resource-group>
    $vnt = <virtual-network-name>
    $lbn = <load-balancer-name>
    $bep = <backend-pool-name>
    $ip = <ip-address>
    $ben = <backend-address-name>
    
    # Remove the admin state from the backend pool instance
    $vnet = Get-AzVirtualNetwork -Name $vnt -ResourceGroupName $rsg
    $lb = Get-AzLoadBalancer -ResourceGroupName $rsg -Name $lbn
    $ip1 = New-AzLoadBalancerBackendAddressConfig -IpAddress $ip -Name $ben -VirtualNetworkId $vnet.Id -AdminState “NONE”
    $lb | Set-AzLoadBalancerBackendAddressPool -LoadBalancerBackendAddress $ip1 -Name $bep
    
    ```

1. This example removes an existing backend pool instance admin state with the following defined values:

[!INCLUDE [load-balancer-admin-state-example-values](../../includes/load-balancer-admin-state-example-values.md)]

```azurepowershell

# Set the values for the variables
$rsg = "MyResourceGroup"
$vnt = "MyVnet"
$lbn = "MyLB"
$bep = "MyAddressPool"
$ip = “10.0.2.4"

# Remove the admin state from the backend pool instance
$vnet = Get-AzVirtualNetwork -Name $vnt -ResourceGroupName $rsg
$lb = Get-AzLoadBalancer -ResourceGroupName $rsg -Name $lbn
$ip1 = New-AzLoadBalancerBackendAddressConfig -IpAddress $ip -Name $ben -VirtualNetworkId $vnet.Id -AdminState “NONE”
$lb | Set-AzLoadBalancerBackendAddressPool -LoadBalancerBackendAddress $ip1 -Name $bep

```

# [Azure CLI](#tab/azurecli)

1. Connect to your Azure subscription with Azure CLI.
2. Remove an existing backend pool instance by setting the admin state value to **None** with [az network lb address-pool update](/cli/azure/network/lb/address-pool#az-network-lb-address-pool-update). Replace the values in brackets with the names of the resources in your configuration.

```azurecli

# Remove the admin state from the backend pool instance
az network lb address-pool update \
    -g <resource-group> \
    --lb-name <lb-name> \
    -n <lb-backend-pool-name> \
    --backend-address “{name: <lb-backend-pool-address-name>,ip-address:<lb-backend-pool-address>}” |
    --admin-state <admin-state-value>

```

1. This example removes an existing backend pool instance admin state with the following defined values:

[!INCLUDE [load-balancer-admin-state-example-values](../../includes/load-balancer-admin-state-example-values.md)]

```azurecli

az network lb address-pool update \
    -g MyResourceGroup \
    --lb-name MyLb \
    -n MyAddressPool \
    --backend-address "{name: MyBackend,ip-address:10.0.2.4}" \
    --admin-state NONE

```

> [!NOTE]
> You can also use [`az network lb address-pool address update`](/cli/azure/network/lb/address-pool/address#az-network-lb-address-pool-update) to remove admin state from an existing backend pool instance.

---

## Next Steps

> [!div class="nextstepaction"]
> [Administrative State (Admin State) in Azure Load Balancer](admin-state-overview.md)
