---
title: Open ports to a VM using the Azure portal 
description: Learn how to open a port / create an endpoint to your VM using the Azure portal
author: cynthn
ms.service: virtual-machines
ms.subservice: networking
ms.topic: how-to
ms.workload: infrastructure-services
ms.date: 02/14/2023
ms.author: cynthn

---
# How to open ports to a virtual machine with the Azure portal

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets 

[!INCLUDE [virtual-machines-common-nsg-quickstart](../../../includes/virtual-machines-common-nsg-quickstart.md)]



### [CLI](#tab/cli)

You open a port, or create an endpoint, to a virtual machine (VM) in Azure by creating a network filter on a subnet or VM network interface. You place these filters, which control both inbound and outbound traffic, on a Network Security Group attached to the resource that receives the traffic. Let's use a common example of web traffic on port 80. This article shows you how to open a port to a VM with the Azure CLI. 


To create a Network Security Group and rules you need the latest [Azure CLI](/cli/azure/install-az-cli2) installed and logged in to an Azure account using [az login](/cli/azure/reference-index).

In the following examples, replace example parameter names with your own values. Example parameter names include *myResourceGroup*, *myNetworkSecurityGroup*, and *myVnet*.


## Quickly open a port for a VM
If you need to quickly open a port for a VM in a dev/test scenario, you can use the [az vm open-port](/cli/azure/vm) command. This command creates a Network Security Group, adds a rule, and applies it to a VM or subnet. The following example opens port *80* on the VM named *myVM* in the resource group named *myResourceGroup*.

```azurecli
az vm open-port --resource-group myResourceGroup --name myVM --port 80
```

For more control over the rules, such as defining a source IP address range, continue with the additional steps in this article.


## Create a Network Security Group and rules
Create the network security group with [az network nsg create](/cli/azure/network/nsg). The following example creates a network security group named *myNetworkSecurityGroup* in the *eastus* location:

```azurecli
az network nsg create \
    --resource-group myResourceGroup \
    --location eastus \
    --name myNetworkSecurityGroup
```

Add a rule with [az network nsg rule create](/cli/azure/network/nsg/rule) to allow HTTP traffic to your webserver (or adjust for your own scenario, such as SSH access or database connectivity). The following example creates a rule named *myNetworkSecurityGroupRule* to allow TCP traffic on port 80:

```azurecli
az network nsg rule create \
    --resource-group myResourceGroup \
    --nsg-name myNetworkSecurityGroup \
    --name myNetworkSecurityGroupRule \
    --protocol tcp \
    --priority 1000 \
    --destination-port-range 80
```


Associate the Network Security Group with your VM's network interface (NIC) with [az network nic update](/cli/azure/network/nic). The following example associates an existing NIC named *myNic* with the Network Security Group named *myNetworkSecurityGroup*:

```azurecli
az network nic update \
    --resource-group myResourceGroup \
    --name myNic \
    --network-security-group myNetworkSecurityGroup
```

Alternatively, you can associate your Network Security Group with a virtual network subnet with [az network vnet subnet update](/cli/azure/network/vnet/subnet) rather than just to the network interface on a single VM. The following example associates an existing subnet named *mySubnet* in the *myVnet* virtual network with the Network Security Group named *myNetworkSecurityGroup*:

```azurecli
az network vnet subnet update \
    --resource-group myResourceGroup \
    --vnet-name myVnet \
    --name mySubnet \
    --network-security-group myNetworkSecurityGroup
```


The quick commands here allow you to get up and running with traffic flowing to your VM. Network Security Groups provide many great features and granularity for controlling access to your resources. You can read more about [creating a Network Security Group and ACL rules here](tutorial-virtual-network.md#secure-network-traffic).

For highly available web applications, you should place your VMs behind an Azure Load Balancer. The load balancer distributes traffic to VMs, with a Network Security Group that provides traffic filtering. For more information, see [How to load balance Linux virtual machines in Azure to create a highly available application](tutorial-load-balancer.md).


### [PowerShell](#tab/poweshell)

To create a Network Security Group and ACL rules you need [the latest version of Azure PowerShell installed](/powershell/azure/). You can also [perform these steps using the Azure portal](nsg-quickstart-portal.md).

Log in to your Azure account:

```powershell
Connect-AzAccount
```

In the following examples, replace parameter names with your own values. Example parameter names included *myResourceGroup*, *myNetworkSecurityGroup*, and *myVnet*.

Create a rule with [New-AzNetworkSecurityRuleConfig](/powershell/module/az.network/new-aznetworksecurityruleconfig). The following example creates a rule named *myNetworkSecurityGroupRule* to allow *tcp* traffic on port *80*:

```powershell
$httprule = New-AzNetworkSecurityRuleConfig `
    -Name "myNetworkSecurityGroupRule" `
    -Description "Allow HTTP" `
    -Access "Allow" `
    -Protocol "Tcp" `
    -Direction "Inbound" `
    -Priority 100 `
    -SourceAddressPrefix "Internet" `
    -SourcePortRange * `
    -DestinationAddressPrefix * `
    -DestinationPortRange "80"
```

Next, create your Network Security group with [New-AzNetworkSecurityGroup](/powershell/module/az.network/new-aznetworksecuritygroup) and assign the HTTP rule you just created as follows. The following example creates a Network Security Group named *myNetworkSecurityGroup*:

```powershell
$nsg = New-AzNetworkSecurityGroup `
    -ResourceGroupName "myResourceGroup" `
    -Location "EastUS" `
    -Name "myNetworkSecurityGroup" `
    -SecurityRules $httprule
```

Now let's assign your Network Security Group to a subnet. The following example assigns an existing virtual network named *myVnet* to the variable *$vnet* with [Get-AzVirtualNetwork](/powershell/module/az.network/get-azvirtualnetwork):

```powershell
$vnet = Get-AzVirtualNetwork `
    -ResourceGroupName "myResourceGroup" `
    -Name "myVnet"
```

Associate your Network Security Group with your subnet with [Set-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/set-azvirtualnetworksubnetconfig). The following example associates the subnet named *mySubnet* with your Network Security Group:

```powershell
$subnetPrefix = $vnet.Subnets|?{$_.Name -eq 'mySubnet'}

Set-AzVirtualNetworkSubnetConfig `
    -VirtualNetwork $vnet `
    -Name "mySubnet" `
    -AddressPrefix $subnetPrefix.AddressPrefix `
    -NetworkSecurityGroup $nsg
```

Finally, update your virtual network with [Set-AzVirtualNetwork](/powershell/module/az.network/set-azvirtualnetwork) in order for your changes to take effect:

```powershell
Set-AzVirtualNetwork -VirtualNetwork $vnet
```




### [Portal](#tab/portal)

1. Sign in to the Azure portal at https://portal.azure.com.
1. Search for and select the resource group for the VM, choose **Add**, then search for and select **Network security group**.

1. Select **Create**.

    The **Create network security group** window opens.

    :::image type="content" source="media/nsg-quickstart-portal/create-nsg.png" alt-text="Create a network security group.":::

1. Enter a name for your network security group. 

1. Select or create a resource group, then select a location.

1. Select **Create** to create the network security group.


Create an inbound security rule

1. Select your new network security group.

1. Select **Inbound security rules** from the left menu, then select **Add**.

    :::image type="content" source="media/nsg-quickstart-portal/advanced.png" alt-text="Add an inbound security rule.":::

1. You can limit the **Source** and **Source port ranges** as needed or leave the default of *Any*.
1. You can limit the **Destination** as needed or leave the default of *Any*.
1. Choose a common **Service** from the drop-down menu, such as **HTTP**. You can also select **Custom** if you want to provide a specific port to use. 

1. Optionally, change the **Priority** or **Name**. The priority affects the order in which rules are applied: the lower the numerical value, the earlier the rule is applied.

1. Select **Add** to create the rule.

Associate your network security group with a subnet

Your final step is to associate your network security group with a subnet or a specific network interface. For this example, we'll associate the network security group with a subnet. 

1. Select **Subnets** from the left menu, then select **Associate**.

1. Select your virtual network, and then select the appropriate subnet.

    ![Associating a network security group with virtual networking](./media/nsg-quickstart-portal/select-vnet-subnet.png)

1. When you are done, select **OK**.


---
## Next steps

- The quick commands here allow you to get up and running with traffic flowing to your VM. Network Security Groups provide many great features and granularity for controlling access to your resources. You can read more about [creating a Network Security Group and ACL rules here](tutorial-virtual-network.md#secure-network-traffic).

- For highly available web applications, you should place your VMs behind an Azure Load Balancer. The load balancer distributes traffic to VMs, with a Network Security Group that provides traffic filtering. For more information, see [How to load balance virtual machines in Azure to create a highly available application](tutorial-load-balancer.md).
