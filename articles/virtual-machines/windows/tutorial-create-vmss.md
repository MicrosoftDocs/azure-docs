---
title: "Tutorial: Create a Windows virtual machine scale set"
description: Learn how to use Azure PowerShell to create and deploy a highly available application on Windows VMs using a virtual machine scale set.
author: ju-shim
ms.author: jushiman
ms.topic: tutorial
ms.service: virtual-machine-scale-sets
ms.subservice: windows
ms.date: 10/14/2021
ms.reviewer: mimckitt
ms.custom: mimckitt, devx-track-azurepowershell

---

# Tutorial: Create a virtual machine scale set and deploy a highly available app on Windows with Azure PowerShell
**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets

Virtual machine scale sets with [Flexible orchestration](flexible-virtual-machine-scale-sets.md) let you create and manage a group of load balanced VMs. The number of VM instances can automatically increase or decrease in response to demand or a defined schedule. 

In this tutorial, you deploy a virtual machine scale set in Azure and learn how to:

> [!div class="checklist"]
> * Use the Custom Script Extension to define an IIS site to scale
> * Create a load balancer for your scale set
> * Create a virtual machine scale set
> * Increase or decrease the number of instances in a scale set
> * Create autoscale rules

## Launch Azure Cloud Shell

The Azure Cloud Shell is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account. 

To open the Cloud Shell, just select **Try it** from the upper right corner of a code block. You can also launch Cloud Shell in a separate browser tab by going to [https://shell.azure.com/powershell](https://shell.azure.com/powershell). Select **Copy** to copy the blocks of code, paste it into the Cloud Shell, and press enter to run it.

## Scale Set overview

Scale sets provide the following key benefits:
- Easy to create and manage multiple VMs
- Provides high availability and application resiliency by distributing VMs across fault domains
- Allows your application to automatically scale as resource demand changes
- Works at large-scale

With Flexible orchestration, Azure provides a unified experience across the Azure VM ecosystem. Flexible orchestration offers high availability guarantees (up to 1000 VMs) by spreading VMs across fault domains in a region or within an Availability Zone. This enables you to scale out your application while maintaining fault domain isolation that is essential to run quorum-based or stateful workloads, including:
- Quorum-based workloads
- Open-source databases
- Stateful applications
- Services that require high availability and large scale
- Services that want to mix virtual machine types or leverage Spot and on-demand VMs together
- Existing Availability Set applications

Learn more about the differences between Uniform scale sets and Flexible scale sets in [Orchestration Modes](../virtual-machine-scale-sets/virtual-machine-scale-sets-orchestration-modes.md).



## Create a scale set


Create IP address configuration.

```azurepowershell-interactive
$ipConfig = New-AzVmssIpConfig -Name "myIPConfig"
   -SubnetId "${vnetid}/subnets/default" `
   -LoadBalancerBackendAddressPoolsId $lb.BackendAddressPools[0].Id
```

Create the scale set configuration. In this example, we are creating a Flexible scale set in the *East US* location, using the *Standard_DS1_v2* VM size, and a fault domain count of *1*.

```azurepowershell-interactive
$vmssConfig = New-AzVmssConfig -Location "East US"
   -SkuCapacity 2 -SkuName "Standard_DS1_v2"
   -OrchestrationMode "Flexible" `
   -PlatformFaultDomainCount 1 
```

Set the image to use when creating the virtual machines:

```azurepowershell-interactive
Set-AzVmssStorageProfile $vmssConfig `
   -OsDiskCreateOption "FromImage" `
   -ImageReferencePublisher "MicrosoftWindowsServer" `
   -ImageReferenceOffer "WindowsServer"
   -ImageReferenceSku "2019-Datacenter" `
   -ImageReferenceVersion "latest"
```

Set up user information for the virtual machines. When prompted, enter a username and password to be used for the virtual machines.

```azurepowershell-interactive
$cred = Get-Credential `
   -Message "Enter a username and password for the virtual machines."
Set-AzVmssOsProfile $vmssConfig -AdminUsername $cred.UserName
  -AdminPassword $cred.Password -ComputerNamePrefix "myVM"
```

Attach the virtual network to the configuration object.

```azurepowershell-interactive
Add-AzVmssNetworkInterfaceConfiguration -VirtualMachineScaleSet $vmssConfig
   -Name "network-config" -Primary $true
   -IPConfiguration $ipConfig `
   -NetworkApiVersion '2020-11-01'
    ```

Create the scale set with the config object.

```azurepowershell-interactive
New-AzVmss -ResourceGroupName $rgname
   -Name $vmssName `
   -VirtualMachineScaleSet $vmssConfig
```

This step might take a few minutes to complete. 

## View VMs in a scale set



## Add a VM to a scale set



## Next steps
In this tutorial, you created a virtual machine scale set. You learned how to:

> [!div class="checklist"]
> * Use the Custom Script Extension to define an IIS site to scale
> * Create a load balancer for your scale set
> * Create a virtual machine scale set
> * Increase or decrease the number of instances in a scale set
> * Create autoscale rules

Advance to the next tutorial to learn more about load balancing concepts for virtual machines.

> [!div class="nextstepaction"]
> [Load balance virtual machines](tutorial-load-balancer.md)
