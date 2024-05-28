---
title: Manage Administrative State in Azure Load Balancer
description: 
author: mbender-ms
ms.author: mbender
ms.service: load-balancer
ms.topic: how-to
ms.date: 05/29/2024
ms.custom: 
---

# Manage Administrative (Admin) State in Azure Load Balancer

In this article, you will learn how to set admin state on a new backend pool instance, update admin state on existing backend pool instance, and remove admin state from existing backend pool instance. You can choose from the Azure portal, PowerShell, or CLI examples.

Administrative State (Admin State) is a feature of Azure Load Balancer that allows you to override the Load Balancer’s health probe behavior on a per backend pool instance basis. There are three types of admin state values: UP, DOWN, NONE. 

[!INCLUDE [load-balancer-admin-state-preview](../../includes/load-balancer-admin-state-preview.md)]

## Pre-requisites

# [Azure portal](#tab/azureportal)

- Access to the Azure portal.
- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/)
- An existing resource group for all resources.
- Existing [Virtual Machines](../virtual-machines/windows/quick-create-portal.md).
- An existing [standard SKU load balancer](quickstart-load-balancer-standard-internal-portal.md) in the same subscription and virtual network as the virtual machine.
  - The load balancer should have a backend pool with health probes and load balancing rules attached.

# [Azure PowerShell](#tab/azurepowershell)

- Access to the Azure portal.
- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/)
- An existing resource group for all resources.
- Existing [Virtual Machines](../virtual-machines/windows/quick-create-powershell.md).
- An existing [standard SKU load balancer](quickstart-load-balancer-standard-internal-powershell.md) in the same subscription and virtual network as the virtual machine.
  - The load balancer should have a backend pool with health probes and load balancing rules attached.
- 
# [Azure CLI](#tab/azurecli/)

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]
- Access to the Azure portal.
- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/)
- An existing resource group for all resources.
- Existing [Virtual Machines](../virtual-machines/windows/quick-create-cli.md).
- An existing [standard SKU load balancer](quickstart-load-balancer-standard-internal-cli.md) in the same subscription and virtual network as the virtual machine.
  - The load balancer should have a backend pool with health probes and load balancing rules attached.
[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]
---
## Set admin state as part of new backendpool create

# [Azure portal](#tab/azureportal)
# [Azure PowerShell](#tab/azurepowershell)
# [Azure CLI](#tab/azurecli/)

---
## Set admin state as part of new backendpool instance add

# [Azure portal](#tab/azureportal)
# [Azure PowerShell](#tab/azurepowershell)
# [Azure CLI](#tab/azurecli/)

---
## Update admin state on existing backendpool instance

# [Azure portal](#tab/azureportal)
# [Azure PowerShell](#tab/azurepowershell)
# [Azure CLI](#tab/azurecli/)

---
## Removing admin state from existing backendpool instance

# [Azure portal](#tab/azureportal)
# [Azure PowerShell](#tab/azurepowershell)
# [Azure CLI](#tab/azurecli/)

---

How to Manage Admin State 

Administrative State (Admin State) is a feature of Azure Load Balancer that allows you to override the Load Balancer’s health probe behavior on a per backend pool instance basis. There are three types of admin state values: UP, DOWN, NONE. 

In this article, you will learn how to set admin state on a new backend pool instance, update admin state on existing backend pool instance, and remove admin state from existing backend pool instance. You can choose from the Azure portal, PowerShell, or CLI examples. 

If you don't have an Azure subscription, create an Azure free account before you begin. 

Prerequisites 

Portal 

Access to the Azure portal 

An Azure account with an active subscription. Create an account for free 

An existing resource group for all resources. 

Existing Virtual Machines 

An existing standard SKU load balancer in the same subscription and virtual network as the Virtual Machine. 

The load balancer should have a backend pool with health probes and load balancing rules attached. 

PowerShell 

An Azure account with an active subscription. Create an account for free 

An existing resource group for all resources. 

Existing Virtual Machines 

An existing standard SKU load balancer in the same subscription and virtual network as the Virtual Machine. 

The load balancer should have a backend pool with health probes and load balancing rules attached. 

CLI 

An Azure account with an active subscription. Create an account for free 

An existing resource group for all resources. 

Existing Virtual Machines 

An existing standard SKU load balancer in the same subscription and virtual network as the Virtual Machine. 

The load balancer should have a backend pool with health probes and load balancing rules attached. 

Access to the Azure portal CLI 

 Note: If you choose to use Azure CLI, you have can run AZ CLI in Azure Cloud Shell or as a local install. Review the following to ensure you are ready to use Azure CLI in the environment you choose. 

Use the Bash environment in Azure Cloud Shell  

If you prefer to run CLI reference commands locally, install the Azure CLI. If you're running on Windows or macOS, consider running Azure CLI in a Docker container. For more information, see How to run the Azure CLI in a Docker container. 

If you're using a local installation, sign in to the Azure CLI by using the az sign-in command. To finish the authentication process, follow the steps displayed in your terminal. For other sign-in options, see Sign in with the Azure CLI. 

When you're prompted, install the Azure CLI extension on first use. For more information about extensions, see Use extensions with the Azure CLI. 

Run az version to find the version and dependent libraries that are installed. To upgrade to the latest version, run az upgrade. 

 

 

 

Setting admin state as part of new backendpool create  

In this section, you will learn how to set an admin state to UP or DOWN as part of a new backendpool create.  

Portal 

Sign in to the Azure portal. 

In the search box at the top of the portal, enter Load balancer. Select Load balancers in the search results. 

Select your balancer from the list. 

In your load balancer's page, select Backend pools under Settings. 

Select + Add in Backend pools to add a new backend pool. 

A screenshot of a computer

Description automatically generated 

Enter or select the following information in Add backend pool. 

Setting 

Value 

Name 

Enter myBackendpool 

Backend Pool Configuration 

Select NIC 

IP configuration 

Select + Add under IP configurations 

Select the VM that you want to add to the backend pool. 

Select Add  

 

Save. 

In your backend pool’s page, select the corresponding Admin State value of your recently added backendpool instance. 

In your admin state’s pane, select Down from the dropdown menu. 

A screenshot of a computer

Description automatically generated 

Save. 

PowerShell 

Connect to your Azure subscription with Azure PowerShell. 

Create a new backendpool with a backendpool instance while setting admin state value to UP or DOWN with New-AzLoadBalancerBackendAddressConfig. Replace the values in brackets with the names of the resources in your configuration. 

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

This example sets a new backendpool instance admin state to DOWN with the following defined values: 

Resource group named MyResourceGroup 

Virtual Network named MyVnet 

Azure Load Balancer named MyLb 

Load Balancer backend pool named MyAddressPool 

Load Balancer backend pool instance named mybackend and ip-address 10.0.2.4 

 

$rsg = “MyResourceGroup” 

$vnt = “MyVnet” 

$lbn = “MyLb” 

$bep = “MyAddressPool” 

$ip = “10.0.2.4” 

$ben = “mybackend” 

 

$vnet = Get-AzVirtualNetwork -Name $vnt -ResourceGroupName $rsg 

$lb = Get-AzLoadBalancer -ResourceGroupName $rsg -Name $lbn 

$ip1 = New-AzLoadBalancerBackendAddressConfig -IpAddress $ip -Name $ben -VirtualNetworkId $vnet.Id -AdminState “DOWN” 

$lb | New-AzLoadBalancerBackendAddressPool -LoadBalancerBackendAddress $ip1 -Name $bep 

 

CLI 

Connect to your Azure subscription with Azure CLI. 

Create a new backendpool with a backendpool instance while setting admin state value to UP or DOWN with az network lb address-pool create. Replace the values in brackets with the names of the resources in your configuration. 

az network lb address-pool create \ 

-g <resource-group> \ 

--lb-name <lb-name> \ 

-n <lb-backend-pool-name> \ 

--vnet <virtual-network-name> \ 

--backend-address “{name: <new-lb-backend-pool-address-name>,ip-address:<new-lb-backend-pool-address>}” | 

--admin-state <admin-state-value> 

This example updates a backendpool instance admin state to DOWN with the following defined values: 

Resource group named MyResourceGroup 

Azure Load Balancer named MyLb 

Load Balancer backend pool named MyAddressPool 

Virtual network named MyVnet 

Load Balancer backend pool instance named mybackend and ip-address 10.0.2.4 

 

az network lb address-pool create \ 

-g MyResourceGroup \ 

--lb-name MyLb \ 

-n MyAddressPool \ 

--vnet MyVnet \ 

--backend-address “{name: mybackend,ip-address:10.0.2.4}” | 

--admin-state DOWN 

 

Setting admin state as part of new backendpool instance add  

In this section, you will learn how to set an admin state to UP or DOWN as part of a new backendpool instance add.  

Portal 

Sign in to the Azure portal. 

In the search box at the top of the portal, enter Load balancer. Select Load balancers in the search results. 

Select your balancer from the list. 

In your load balancer's page, select Backend pools under Settings. 

Select your backendpool. 

In your backend pool's page, select + Add under IP configurations 

Note: This step is assuming your backendpool is NIC-based. 

Select the VM that you want to add to the backend pool. 

Select Add and Save. 

In your backend pool’s page, select the corresponding Admin State value of your recently added backendpool instance. 

In your admin state’s pane, select Up from the dropdown menu. 

A screenshot of a computer

Description automatically generated 

Save. 

 

PowerShell 

Connect to your Azure subscription with Azure PowerShell. 

Add a new backendpool instance with the admin state value set to UP or DOWN with New-AzLoadBalancerBackendAddressConfig. Replace the values in brackets with the names of the resources in your configuration. 

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

This example sets a new backendpool instance admin state to UP with the following defined values: 

Resource group named MyResourceGroup 

Virtual Network named MyVnet 

Azure Load Balancer named MyLb 

Load Balancer backend pool named MyAddressPool 

Load Balancer backend pool instance named mybackend and ip-address 10.0.2.4 

 

$rsg = “MyResourceGroup” 

$vnt = “MyVnet” 

$lbn = “MyLb” 

$bep = “MyAddressPool” 

$ip = “10.0.2.4” 

$ben = “mybackend” 

 

$vnet = Get-AzVirtualNetwork -Name $vnt -ResourceGroupName $rsg 

$lb = Get-AzLoadBalancer -ResourceGroupName $rsg -Name $lbn 

$ip1 = New-AzLoadBalancerBackendAddressConfig -IpAddress $ip -Name $ben -VirtualNetworkId $vnet.Id -AdminState “UP” 

$lb | Set-AzLoadBalancerBackendAddressPool -LoadBalancerBackendAddress $ip1 -Name $bep 

 

CLI 

Connect to your Azure subscription with Azure CLI. 

Add a new backendpool instance with the admin state value set to UP or DOWN with az network lb address-pool update , and replace the values in brackets with the names of the resources in your configuration. 

az network lb address-pool update \ 

-g <resource-group> \ 

--lb-name <lb-name> \ 

-n <lb-backend-pool-name> \ 

--vnet <virtual-network-name> \ 

--backend-address “{name: <new-lb-backend-pool-address-name>,ip-address:<new-lb-backend-pool-address>}” | 

--admin-state <admin-state-value> 

This example sets a new backendpool instance admin state to UP with the following defined values: 

Resource group named MyResourceGroup 

Azure Load Balancer named MyLb 

Load Balancer backend pool named MyAddressPool 

Virtual network named MyVnet 

Load Balancer backend pool instance named mybackend and ip-address 10.0.2.4 

 

az network lb address-pool update \ 

-g MyResourceGroup \ 

--lb-name MyLb \ 

-n MyAddressPool \ 

--vnet MyVnet \ 

--backend-address “{name: mybackend,ip-address:10.0.2.4}” | 

--admin-state UP 

Note: You can also use az network lb address-pool address add to set admin state on as part of a new backendpool instance add.  

 

Updating admin state on existing backendpool instance  

In this section, you will learn how to update an existing admin state from existing backendpool instance by setting the value to UP or DOWN.  

Portal 

Sign in to the Azure portal. 

In the search box at the top of the portal, enter Load balancer. Select Load balancers in the search results. 

Select your balancer from the list. 

In your load balancer's page, select Backend pools under Settings. 

Select the corresponding Admin State value of your backendpool instance that you would like to update. 

In your admin state’s pane, select Down from the dropdown menu. 

A screenshot of a computer

Description automatically generated 

Save. 

 

PowerShell 

Connect to your Azure subscription with Azure PowerShell. 

Update the admin state value on your existing backendpool instance to UP or DOWN with New-AzLoadBalancerBackendAddressConfig. Replace the values in brackets with the names of the resources in your configuration. 

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

This example updates a backendpool instance admin state to DOWN with the following defined values: 

Resource group named MyResourceGroup 

Virtual Network named MyVnet 

Azure Load Balancer named MyLb 

Load Balancer backend pool named MyAddressPool 

Load Balancer backend pool instance named mybackend and ip-address 10.0.2.4 

 

$rsg = “MyResourceGroup” 

$vnt = “MyVnet” 

$lbn = “MyLb” 

$bep = “MyAddressPool” 

$ip = “10.0.2.4” 

$ben = “mybackend” 

 

$vnet = Get-AzVirtualNetwork -Name $vnt -ResourceGroupName $rsg 

$lb = Get-AzLoadBalancer -ResourceGroupName $rsg -Name $lbn 

$ip1 = New-AzLoadBalancerBackendAddressConfig -IpAddress $ip -Name $ben -VirtualNetworkId $vnet.Id -AdminState “DOWN” 

$lb | Set-AzLoadBalancerBackendAddressPool -LoadBalancerBackendAddress $ip1 -Name $bep 

 

CLI 

Connect to your Azure subscription with Azure CLI. 

Update the admin state value on your existing backendpool instance to UP or DOWN with az network lb address-pool update , and replace the values in brackets with the names of the resources in your configuration. 

az network lb address-pool update \ 

-g <resource-group> \ 

--lb-name <lb-name> \ 

-n <lb-backend-pool-name> \ 

--backend-address “{name: <lb-backend-pool-address-name>,ip-address:<lb-backend-pool-address>}” | 

--admin-state <admin-state-value> 

This example updates a backendpool instance admin state to DOWN with the following defined values: 

Resource group named MyResourceGroup 

Azure Load Balancer named MyLb 

Load Balancer backend pool named MyAddressPool 

Load Balancer backend pool instance named mybackend and ip-address 10.0.2.4 

 

az network lb address-pool update \ 

-g MyResourceGroup \ 

--lb-name MyLb \ 

-n MyAddressPool \ 

--backend-address “{name: mybackend,ip-address:10.0.2.4}” | 

--admin-state DOWN 

Note: You can also use az network lb address-pool address update to update admin state on a backendpool instance.  

 

Removing admin state from existing backendpool instance 

In this section, you will learn how to remove an existing admin state from existing backendpool instance by setting the value to NONE.  

Portal 

Sign in to the Azure portal. 

In the search box at the top of the portal, enter Load balancer. Select Load balancers in the search results. 

Select your balancer from the list. 

In your load balancer's page, select Backend pools under Settings. 

Select the corresponding Admin State value of your backendpool instance that you would like to update. 

In your admin state’s pane, select None from the dropdown menu. 

A screenshot of a computer

Description automatically generated 

Save. 

 

PowerShell 

Connect to your Azure subscription with Azure PowerShell. 

Update the admin state value on your existing backendpool instance to NONE with New-AzLoadBalancerBackendAddressConfig. Replace the values in brackets with the names of the resources in your configuration. 

$rsg = <resource-group> 

$vnt = <virtual-network-name> 

$lbn = <load-balancer-name> 

$bep = <backend-pool-name> 

$ip = <ip-address> 

$ben = <backend-address-name> 

 

$vnet = Get-AzVirtualNetwork -Name $vnt -ResourceGroupName $rsg 

$lb = Get-AzLoadBalancer -ResourceGroupName $rsg -Name $lbn 

$ip1 = New-AzLoadBalancerBackendAddressConfig -IpAddress $ip -Name $ben -VirtualNetworkId $vnet.Id -AdminState “NONE” 

$lb | Set-AzLoadBalancerBackendAddressPool -LoadBalancerBackendAddress $ip1 -Name $bep 

This example updates a backendpool instance admin state to NONE with the following defined values: 

Resource group named MyResourceGroup 

Virtual Network named MyVnet 

Azure Load Balancer named MyLb 

Load Balancer backend pool named MyAddressPool 

Load Balancer backend pool instance named mybackend and ip-address 10.0.2.4 

 

$rsg = “MyResourceGroup” 

$vnt = “MyVnet” 

$lbn = “MyLb” 

$bep = “MyAddressPool” 

$ip = “10.0.2.4” 

$ben = “mybackend” 

 

$vnet = Get-AzVirtualNetwork -Name $vnt -ResourceGroupName $rsg 

$lb = Get-AzLoadBalancer -ResourceGroupName $rsg -Name $lbn 

$ip1 = New-AzLoadBalancerBackendAddressConfig -IpAddress $ip -Name $ben -VirtualNetworkId $vnet.Id -AdminState “NONE” 

$lb | Set-AzLoadBalancerBackendAddressPool -LoadBalancerBackendAddress $ip1 -Name $bep 

 

CLI 

Connect to your Azure subscription with Azure CLI. 

Update the admin state value on your existing backendpool instance to NONE with az network lb address-pool update , and replace the values in brackets with the names of the resources in your configuration. 

az network lb address-pool update \ 

-g <resource-group> \ 

--lb-name <lb-name> \ 

-n <lb-backend-pool-name> \ 

--backend-address “{name: <lb-backend-pool-address-name>,ip-address:<lb-backend-pool-address>}” | 

--admin-state <admin-state-value> 

This example updates a backendpool instance admin state to NONE with the following defined values: 

Resource group named MyResourceGroup 

Azure Load Balancer named MyLb 

Load Balancer backend pool named MyAddressPool 

Load Balancer backend pool instance named mybackend and ip-address 10.0.2.4 

 

az network lb address-pool update \ 

-g MyResourceGroup \ 

--lb-name MyLb \ 

-n MyAddressPool \ 

--backend-address “{name: mybackend,ip-address:10.0.2.4}” | 

--admin-state NONE 

Note: You can also use az network lb address-pool address update to remove admin state on a backendpool instance.  