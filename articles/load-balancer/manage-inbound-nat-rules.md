---
title: Manage inbound NAT rules for Azure Load Balancer
description: In this article, you learn how to add and remove and inbound NAT rule using the Azure portal, PowerShell and CLI.
author: mbender-ms
ms.author: mbender
ms.service: load-balancer
ms.topic: how-to
ms.date: 05/01/2023
ms.custom: template-how-to, devx-track-azurepowershell, devx-track-azurecli,engagement-fy23
---

# Manage inbound NAT rules for Azure Load Balancer

An inbound NAT rule is used to forward traffic from a load balancer frontend to one or more instances in the backend pool. 

There are two types of inbound NAT rule:

* Single virtual machine - An inbound NAT rule that targets a single machine in the backend pool of the load balancer

* Multiple virtual machines - An inbound NAT rule that targets multiple virtual machines in the backend pool of the load balancer

In this article, you learn how to add and remove an inbound NAT rule for both types. You learn how to change the frontend port allocation in a multiple instance inbound NAT rule. You can choose from the Azure portal, PowerShell, or CLI examples.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

- A standard public load balancer in your subscription. For more information on creating an Azure Load Balancer, see [Quickstart: Create a public load balancer to load balance VMs using the Azure portal](quickstart-load-balancer-standard-public-portal.md). The load balancer name for the examples in this article is **myLoadBalancer**.
- If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 5.4.1 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell). If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.
[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]


## Add a single VM inbound NAT rule

Choose this option to configure a rule for a single VM. Select Azure portal, PowerShell, or CLI for instructions.

# [**Portal**](#tab/inbound-nat-rule-portal)

In this example, you create an inbound NAT rule to forward port **500** to backend port **443**. 

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **Load balancer**. Select **Load balancers** in the search results.

3. Select **myLoadBalancer** or your load balancer.

4. In the load balancer page, select **Inbound NAT rules** in **Settings**.

5. Select **+ Add** in **Inbound NAT rules** to add the rule.

    :::image type="content" source="./media/manage-inbound-nat-rules/add-rule.png" alt-text="Screenshot of the inbound NAT rules page for Azure Load Balancer":::

6. Enter or select the following information in **Add inbound NAT rule**.

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **myInboundNATrule**. |
    | Type | Select **Azure Virtual Machine**. |
    | Target virtual machine | Select the virtual machine that you wish to forward the port to. In this example, it's **myVM1**. |
    | Network IP configuration | Select the IP configuration of the virtual machine. In this example, it's **ipconfig1(10.1.0.4)**. |
    | Frontend IP address | Select **myFrontend**. |
    | Frontend Port | Enter **500**. |
    | Service Tag | Leave the default of **Custom**. |
    | Backend port | Enter **443**. |
    | Protocol | Select **TCP**. |

7. Leave the rest of the settings at the defaults and select **Add**.

    :::image type="content" source="./media/manage-inbound-nat-rules/add-single-instance-rule.png" alt-text="Screenshot of the create inbound NAT rule page":::

# [**PowerShell**](#tab/inbound-nat-rule-powershell)

Use [Get-AzLoadBalancer](/powershell/module/az.network/get-azloadbalancer) to place the load balancer information into a variable.

Use [Add-AzLoadBalancerInboundNatRuleConfig](/powershell/module/az.network/add-azloadbalancerinboundnatruleconfig) to create the inbound NAT rule.

To save the configuration to the load balancer, use [Set-AzLoadBalancer](/powershell/module/az.network/set-azloadbalancer).

Use [Get-AzLoadBalancerInboundNatRuleConfig](/powershell/module/az.network/get-azloadbalancerinboundnatruleconfig) to place the newly created inbound NAT rule information into a variable. 

Use [Get-AzNetworkInterface](/powershell/module/az.network/get-aznetworkinterface) to place the network interface information into a variable.

Use [Set-AzNetworkInterfaceIpConfig](/powershell/module/az.network/set-aznetworkinterfaceipconfig) to add the newly created inbound NAT rule to the IP configuration of the network interface. 

To save the configuration to the network interface, use [Set-AzNetworkInterface](/powershell/module/az.network/set-aznetworkinterface).




```azurepowershell
## Place the load balancer information into a variable for later use. ##
$slb = @{
    ResourceGroupName = 'myResourceGroup'
    Name = 'myLoadBalancer'
}
$lb = Get-AzLoadBalancer @slb

## Create the single virtual machine inbound NAT rule. ##
$rule = @{
    Name = 'myInboundNATrule'
    Protocol = 'Tcp'
    FrontendIpConfiguration = $lb.FrontendIpConfigurations[0]
    FrontendPort = '500'
    BackendPort = '443'
}
$lb | Add-AzLoadBalancerInboundNatRuleConfig @rule

$lb | Set-AzLoadBalancer

## Add the inbound NAT rule to a virtual machine 

$NatRule = @{                                                                                       
    Name = 'MyInboundNATrule'
    LoadBalancer = $lb
}

$NatRuleConfig = Get-AzLoadBalancerInboundNatRuleConfig @NatRule 

$NetworkInterface = @{                                                                                           
     ResourceGroupName = 'myResourceGroup'
     Name = 'MyNIC'
 }

 $NIC = Get-AzNetworkInterface @NetworkInterface
 
 $IPconfig = @{                                                                                       
    Name = 'Ipconfig'
    LoadBalancerInboundNatRule = $NatRuleConfig
}

$NIC | Set-AzNetworkInterfaceIpConfig @IPconfig

$NIC | Set-AzNetworkInterface  

```

# [**CLI**](#tab/inbound-nat-rule-cli)

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

In this example, you will create an inbound NAT rule to forward port **500** to backend port **443**. You will then attach the inbound NAT rule to a VM's NIC

Use [az network lb inbound-nat-rule create](/cli/azure/network/lb/inbound-nat-rule#az-network-lb-inbound-nat-rule-create) to create the NAT rule.

Use [az network nic ip-config inbound-nat-rule add](/cli/azure/network/nic/ip-config/inbound-nat-rule) to add the inbound NAT rule to a VM's NIC


```azurecli
    az network lb inbound-nat-rule create \
        --backend-port 443 \
        --lb-name myLoadBalancer \
        --name myInboundNATrule \
        --protocol Tcp \
        --resource-group myResourceGroup \
        --frontend-ip-name myFrontend \
        --frontend-port 500

    az network nic ip-config inbound-nat-rule add \
        --resource-group myResourceGroup \
        --nic-name MyNic \
        --ip-config-name MyIpConfig \
        --inbound-nat-rule MyNatRule \
        --lb-name myLoadBalancer

```
---

## Add a multiple VMs inbound NAT rule
Choose this option to configure a rule with a range of ports to a backend pool of virtual machines. Select Azure portal, PowerShell, or CLI for instructions.

# [**Portal**](#tab/inbound-nat-rule-portal)

In this example, you create an inbound NAT rule to forward a range of ports starting at port 500 to backend port 443. The maximum number of machines in the backend pool is set by the parameter **Maximum number of machines in backend pool** with a value of **500**. This setting limits the backend pool to **500** virtual machines.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **Load balancer**. Select **Load balancers** in the search results.

3. Select **myLoadBalancer** or your load balancer.

4. In the load balancer page, select **Inbound NAT rules** in **Settings**.

5. Select **+ Add** in **Inbound NAT rules** to add the rule.

    :::image type="content" source="./media/manage-inbound-nat-rules/add-rule.png" alt-text="Screenshot of the inbound NAT rules page for Azure Load Balancer":::

6. Enter or select the following information in **Add inbound NAT rule**.

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **myInboundNATrule**. |
    | Type | Select **Backend pool**. |
    | Target backend pool | Select your backend pool. In this example, it's **myBackendPool**. |
    | Frontend IP address | Select your frontend IP address. In this example, it's **myFrontend**. |
    | Frontend port range start | Enter **500**. |
    | Maximum number of machines in backend pool | Enter **500**. |
    | Backend port | Enter **443**. |
    | Protocol | Select **TCP**. |

7. Leave the rest at the defaults and select **Add**.
    
    :::image type="content" source="./media/manage-inbound-nat-rules/add-inbound-nat-rule.png" alt-text="Screenshot of the add inbound NAT rules page":::

# [**PowerShell**](#tab/inbound-nat-rule-powershell)

In this example, you create an inbound NAT rule to forward a range of ports starting at port 500 to backend port 443. The maximum number of machines in the backend pool is set by the parameter `-FrontendPortRangeEnd` with a value of **1000**. This setting limits the backend pool to **500** virtual machines.

Use [Get-AzLoadBalancer](/powershell/module/az.network/get-azloadbalancer) to place the load balancer information into a variable.

Use [Add-AzLoadBalancerInboundNatRuleConfig](/powershell/module/az.network/add-azloadbalancerinboundnatruleconfig) to create the inbound NAT rule.

To save the configuration to the load balancer, use [Set-AzLoadBalancer](/powershell/module/az.network/set-azloadbalancer) 

```azurepowershell
## Place the load balancer information into a variable for later use. ##
$slb = @{
    ResourceGroupName = 'myResourceGroup'
    Name = 'myLoadBalancer'
}
$lb = Get-AzLoadBalancer @slb

## Create the multiple virtual machines inbound NAT rule. ##
$rule = @{
    Name = 'myInboundNATrule'
    Protocol = 'Tcp'
    BackendPort = '443'
    FrontendIpConfiguration = $lb.FrontendIpConfigurations[0]
    FrontendPortRangeStart = '500'
    FrontendPortRangeEnd = '1000'
    BackendAddressPool = $lb.BackendAddressPools[0]
}
$lb | Add-AzLoadBalancerInboundNatRuleConfig @rule

$lb | Set-AzLoadBalancer

```

# [**CLI**](#tab/inbound-nat-rule-cli)

In this example, you create an inbound NAT rule to forward a range of ports starting at port 500 to backend port 443. The maximum number of machines in the backend pool is set by the parameter `--frontend-port-range-end` with a value of **1000**. This setting limits the backend pool to **500** virtual machines.

Use [az network lb inbound-nat-rule create](/cli/azure/network/lb/inbound-nat-rule#az-network-lb-inbound-nat-rule-create) to create the NAT rule.

```azurecli
    az network lb inbound-nat-rule create \
        --backend-port 443 \
        --lb-name myLoadBalancer \
        --name myInboundNATrule \
        --protocol Tcp \
        --resource-group myResourceGroup \
        --backend-pool-name myBackendPool \
        --frontend-ip-name myFrontend \
        --frontend-port-range-end 1000 \
        --frontend-port-range-start 500
        
```

---

## Change frontend port allocation for a multiple VM rule

# [**Portal**](#tab/inbound-nat-rule-portal)

To accommodate more virtual machines in the backend pool in a multiple instance rule, change the frontend port allocation in the inbound NAT rule. In this example, you change the **Maximum number of machines in backend pool** from **500** to **1000**. This setting increases the maximum number of machines in the backend pool to **1000**.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **Load balancer**. Select **Load balancers** in the search results.

3. Select **myLoadBalancer** or your load balancer.

4. In the load balancer page, select **Inbound NAT rules** in **Settings**.

5. Select the inbound NAT rule you wish to change. In this example, it's **myInboundNATrule**.

    :::image type="content" source="./media/manage-inbound-nat-rules/select-inbound-nat-rule.png" alt-text="Screenshot of inbound NAT rule overview.":::

6. In the properties of the inbound NAT rule, change the value in **Maximum number of machines in backend pool** to **1000**.

7. Select **Save**.

    :::image type="content" source="./media/manage-inbound-nat-rules/change-frontend-ports.png" alt-text="Screenshot of inbound NAT rule properties page.":::

# [**PowerShell**](#tab/inbound-nat-rule-powershell)

To accommodate more virtual machines in the backend pool in a multiple instance rule, change the frontend port allocation in the inbound NAT rule. In this example, you change the parameter `-FrontendPortRangeEnd` to **1500**. This setting increases the maximum number of machines in the backend pool to **1000**.

Use [Get-AzLoadBalancer](/powershell/module/az.network/get-azloadbalancer) to place the load balancer information into a variable.

To change the port allocation, use [Set-AzLoadBalancerInboundNatRuleConfig](/powershell/module/az.network/set-azloadbalancerinboundnatruleconfig).

```azurepowershell
## Place the load balancer information into a variable for later use. ##
$slb = @{
    ResourceGroupName = 'myResourceGroup'
    Name = 'myLoadBalancer'
}
$lb = Get-AzLoadBalancer @slb

## Set the new port allocation
$rule = @{
    Name = 'myInboundNATrule'
    Protocol = 'Tcp'
    BackendPort = '443'
    FrontendIpConfiguration = $lb.FrontendIpConfigurations[0]
    FrontendPortRangeStart = '500'
    FrontendPortRangeEnd = '1500'
    BackendAddressPool = $lb.BackendAddressPools[0]
}
$lb | Set-AzLoadBalancerInboundNatRuleConfig @rule

```

# [**CLI**](#tab/inbound-nat-rule-cli)

To accommodate more virtual machines in the backend pool, change the frontend port allocation in the inbound NAT rule. In this example, you change the parameter `--frontend-port-range-end` to **1500**. This setting increases the maximum number of machines in the backend pool to **1000**

Use [az network lb inbound-nat-rule update](/cli/azure/network/lb/inbound-nat-rule#az-network-lb-inbound-nat-rule-update) to change the frontend port allocation.

```azurecli
    az network lb inbound-nat-rule update \
        --frontend-port-range-end 1500 \
        --lb-name myLoadBalancer \
        --name myInboundNATrule \
        --resource-group myResourceGroup
        
```

---

## View port mappings

Port mappings for the virtual machines in the backend pool can be viewed by using the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **Load balancer**. Select **Load balancers** in the search results.

3. Select **myLoadBalancer** or your load balancer.

4. In the load balancer page in, select **Inbound NAT rules** in **Settings**.

5. Select **myInboundNATrule** or your inbound NAT rule.

    :::image type="content" source="./media/manage-inbound-nat-rules/view-inbound-nat-rule.png" alt-text="Screenshot of inbound NAT rule page.":::

6. Scroll to the **Port mapping** section of the inbound NAT rule properties page.

    :::image type="content" source="./media/manage-inbound-nat-rules/view-port-mappings.png" alt-text="Screenshot of inbound NAT rule port mappings.":::

## Remove an inbound NAT rule

# [**Portal**](#tab/inbound-nat-rule-portal)

In this example, you remove an inbound NAT rule.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **Load balancer**. Select **Load balancers** in the search results.

3. Select **myLoadBalancer** or your load balancer.

4. In the load balancer page in, select **Inbound NAT rules** in **Settings**.

5. Select the three dots next to the rule you want to remove.

6. Select **Delete**.

    :::image type="content" source="./media/manage-inbound-nat-rules/remove-inbound-nat-rule.png" alt-text="Screenshot of inbound NAT rule removal.":::

# [**PowerShell**](#tab/inbound-nat-rule-powershell)

In this example, you remove an inbound NAT rule.

Use [Get-AzLoadBalancer](/powershell/module/az.network/get-azloadbalancer) to place the load balancer information into a variable.

To remove the inbound NAT rule, use [Remove-AzLoadBalancerInboundNatRuleConfig](/powershell/module/az.network/remove-azloadbalancerinboundnatruleconfig).

To save the configuration to the load balancer, use [Set-AzLoadBalancer](/powershell/module/az.network/set-azloadbalancer).

```azurepowershell
## Place the load balancer information into a variable for later use. ##
$slb = @{
    ResourceGroupName = 'myResourceGroup'
    Name = 'myLoadBalancer'
}
$lb = Get-AzLoadBalancer @slb

## Remove the inbound NAT rule
$lb | Remove-AzLoadBalancerInboundNatRuleConfig -Name 'myInboundNATrule'

$lb | Set-AzLoadBalancer

```

# [**CLI**](#tab/inbound-nat-rule-cli)

In this example, you remove an inbound NAT rule.

Use [az network lb inbound-nat-rule delete](/cli/azure/network/lb/inbound-nat-rule#az-network-lb-inbound-nat-rule-delete) to remove the rule.

```azurecli
    az network lb inbound-nat-rule delete \
        --lb-name myLoadBalancer \
        --name myInboundNATrule \
        --resource-group myResourceGroup
```

---

## Next steps

In this article, you learned how to manage inbound NAT rules for an Azure Load Balancer using the Azure portal, PowerShell and CLI.

For more information about Azure Load Balancer, see:
- [What is Azure Load Balancer?](load-balancer-overview.md)
- [Frequently asked questions - Azure Load Balancer](load-balancer-faqs.yml)
