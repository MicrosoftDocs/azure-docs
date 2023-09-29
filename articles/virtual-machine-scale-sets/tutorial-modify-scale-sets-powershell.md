---
title: Modify an Azure Virtual Machine Scale Set using PowerShell
description: Learn how to modify and update an Azure Virtual Machine Scale Set using PowerShell
author: ju-shim
ms.author: jushiman
ms.topic: how-to
ms.service: virtual-machine-scale-sets
ms.custom: devx-track-azurepowershell
ms.date: 12/16/2022
ms.reviewer: mimckitt
---
# Tutorial: Modify a Virtual Machine Scale Set using PowerShell
Throughout the lifecycle of your applications, you may need to modify or update your Virtual Machine Scale Set. These updates may include how to update the configuration of the scale set, or change the application configuration. This article describes how to modify an existing scale set using PowerShell.

## Update the scale set model
A scale set has a "scale set model" that captures the *desired* state of the scale set as a whole. To query the model for a scale set, you can use [Get-AzVmss](/powershell/module/az.compute/get-azvmss).

```azurepowershell-interactive
Get-AzVmss -ResourceGroupName myResourceGroup -Name myScaleSet
```

The exact presentation of the output depends on the options you provide to the command. The following example shows condensed sample output from PowerShell:

```output
Sku                                         : 
  Name                                      : Standard_DS1_v2
  Tier                                      : Standard
  Capacity                                  : 2
ProvisioningState                           : Succeeded
SinglePlacementGroup                        : False
Id                                          : /subscriptions/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myScaleSet
Name                                        : myScaleSet
Type                                        : Microsoft.Compute/virtualMachineScaleSets
Location                                    : eastus
VirtualMachineProfile                       : 
    ComputerNamePrefix                      : myScaleSe
      ProvisionVMAgent                      : True
      EnableAutomaticUpdates                : True
        PatchMode                           : AutomaticByOS
        AssessmentMode                      : ImageDefault
      EnableVMAgentPlatformUpdates          : False
    AllowExtensionOperations                : True
  StorageProfile                            : 
      Publisher                             : MicrosoftWindowsServer
      Offer                                 : WindowsServer
      Sku                                   : 2016-Datacenter
      Version                               : latest
    OsDisk                                  : 
      Caching                               : None
      CreateOption                          : FromImage
      DiskSizeGB                            : 127
      OsType                                : Windows
        StorageAccountType                  : Premium_LRS
      DeleteOption                          : Delete
  NetworkProfile                            : 
    NetworkInterfaceConfigurations[0]       : 
      Name                                  : myScaleSet
      Primary                               : True
      DisableTcpStateTracking               : False
        Name                                : myScaleSet
        Subnet                              : 
          Id                                : /subscriptions/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/myScaleSet/subnets/myScaleSet
        PrivateIPAddressVersion             : IPv4
        LoadBalancerBackendAddressPools[0]  : 
/subscriptions/resourceGroups/myResourceGroup/providers/Microsoft.Network/loadBalancers/myScaleSet/backendAddressPools/myScaleSet
      EnableIPForwarding                    : False
      DeleteOption                          : Delete
    NetworkApiVersion                       : 2020-11-01
OrchestrationMode                           : Flexible
TimeCreated                                 : 12/2/2022 5:41:21 PM
```

You can also use [Update-AzVmss](/powershell/module/az.compute/update-azvmss) to update various properties of your scale set. For example, updating your license type. 

```azurepowershell-interactive
$myVmss = Get-AzVmss -ResourceGroupName myResourceGroup -Name myScaleSet
Update-AzVmss -ResourceGroupName myResourceGroup -VirtualMachineScaleSet $myVMss -VMScaleSetName myScaleSet -LicenseType Windows_Server
```

## Updating individual VM instances in a scale set
Similar to how a scale set has a model view, each VM instance in the scale set has its own model view. To query the model view for a particular VM instance in a scale set, you can use [Get-AzVM](/powershell/module/az.compute/get-azvm).

```azurepowershell-interactive
Get-AzVM -ResourceGroupName myResourceGroup -name MyScaleSet_Instance1
```

```output
ResourceGroupName      : myResourceGroup
Id                     : /subscriptions/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/myScaleSet_Instance1
Name                   : myScaleSet_Instance1
Type                   : Microsoft.Compute/virtualMachines
Location               : eastus
Extensions             : {MicrosoftMonitoringAgent}
HardwareProfile        : {VmSize}
NetworkProfile         : {NetworkInterfaces}
OSProfile              : {ComputerName, AdminUsername, WindowsConfiguration, Secrets, AllowExtensionOperations, RequireGuestProvisionSignal}
ProvisioningState      : Succeeded
StorageProfile         : {ImageReference, OsDisk, DataDisks}
VirtualMachineScaleSet : {Id}
TimeCreated            : 12/2/2022 5:41:23 PM
```

You can also add the `-Status` flag to get the Instance View, which provides more details about the VM. 

```azurepowershell-interactive
Get-AzVM -ResourceGroupName myResourceGroup -name MyScaleSet_Instance1 -Status                                    
```

```output
ResourceGroupName       : myResourceGroup
Name                    : MyScaleSet_Instance1
OsName                  : Windows Server 2016 Datacenter
OsVersion               : 10.0.14393.5501
HyperVGeneration        : V1
Disks[0]                : 
  Name                  : myScaleSet_Instance1_disk1_cab60acccff7414b81d60572eeecb9e3
  Statuses[0]           : 
    Code                : ProvisioningState/succeeded
    Level               : Info
    DisplayStatus       : Provisioning succeeded
    Time                : 12/2/2022 5:41:25 PM
Disks[1]                : 
  Name                  : disk1
  Statuses[0]           : 
    Code                : ProvisioningState/succeeded
    Level               : Info
    DisplayStatus       : Provisioning succeeded
    Time                : 12/2/2022 6:33:36 PM
Extensions[0]           : 
  Name                  : MicrosoftMonitoringAgent
  Type                  : Microsoft.EnterpriseCloud.Monitoring.MicrosoftMonitoringAgent
  TypeHandlerVersion    : 1.0.18067.0
  Statuses[0]           : 
    Code                : ProvisioningState/succeeded
    Level               : Info
    DisplayStatus       : Provisioning succeeded
    Message             : Latest configuration has been applied to the Microsoft Monitoring Agent.
VMAgent                 : 
  VmAgentVersion        : 2.7.41491.1071
  ExtensionHandlers[0]  : 
    Type                : Microsoft.EnterpriseCloud.Monitoring.MicrosoftMonitoringAgent
    TypeHandlerVersion  : 1.0.18067.0
    Status              : 
      Code              : ProvisioningState/succeeded
      Level             : Info
      DisplayStatus     : Ready
      Message           : This virtual machine has successfully connected to Azure Log Analytics.
  Statuses[0]           : 
    Code                : ProvisioningState/succeeded
    Level               : Info
    DisplayStatus       : Ready
    Message             : GuestAgent is running and processing the extensions.
    Time                : 12/2/2022 6:34:55 PM
Statuses[0]             : 
  Code                  : ProvisioningState/succeeded
  Level                 : Info
  DisplayStatus         : Provisioning succeeded
  Time                  : 12/2/2022 6:33:42 PM
Statuses[1]             : 
  Code                  : PowerState/running
  Level                 : Info
  DisplayStatus         : VM running
```

These properties describe the configuration of a VM instance within a scale set, not the configuration of the scale set as a whole. 

You can perform updates to individual VM instances in a scale set just like you would a standalone VM. For example, attaching a new data disk to instance 1:

```azurepowershell-interactive
$VirtualMachine = Get-AzVM -ResourceGroupName "myResourceGroup" -Name "myScaleSet_Instance1".
Add-AzVMDataDisk -VM $VirtualMachine -Name "disk1" -LUN 0 -Caching ReadOnly -DiskSizeinGB 128 -CreateOption Empty
Update-AzVM -ResourceGroupName "myResourceGroup" -VM $VirtualMachine
```

## Add an Instance to your scale set
There are times where you might want to add a new VM to your scale set but want different configuration options than then listed in the scale set model. VMs can be added to a scale set during creation by using the [Get-AzVmss](/powershell/module/az.compute/get-azvmss) command and specifying the scale set name you want the instance added to. 

```azurepowershell-interactive
New-AzVM -Name myNewInstance -ResourceGroupName myResourceGroup -image Ubuntu2204 -VmssId /subscriptions/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myScaleSet
```

```output
ResourceGroupName        : myResourceGroup                                                                              
Id                       : /subscriptions/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/myNewInstance
Name                     : myNewInstance                                                                                
Type                     : Microsoft.Compute/virtualMachines                                                            
Location                 : eastus                                                                                       
Tags                     : {}                                                                                           
HardwareProfile          : {VmSize}                                                                                     
NetworkProfile           : {NetworkInterfaces}                                                                          
OSProfile                : {ComputerName, AdminUsername, LinuxConfiguration, Secrets, AllowExtensionOperations, RequireGuestProvisionSignal}
ProvisioningState        : Succeeded                                                                                    
StorageProfile           : {ImageReference, OsDisk, DataDisks}                                                          
FullyQualifiedDomainName : mynewinstance-21bc01.eastus.cloudapp.azure.com                                               
VirtualMachineScaleSet   : {Id}                                                                                         
TimeCreated              : 12/2/2022 6:40:20 PM   
``` 
By running [Get-AzVM](/powershell/module/az.compute/get-azvmss) again, we can see the new instance was created and added to the existing scale set.

```azurepowershell-interactive
Get-AzVm -ResourceGroupName myResourceGroup 
```

```output
ResourceGroupName   Name                   Location   VmSize            OsType     NIC                  ProvisioningState 
-----------------   ----                   --------   ------            ------     ---                  ----------------- 
myResourceGroup     myNewInstance          eastus     Standard_D2s_v3   Linux      myNewInstance         Succeeded     
myResourceGroup     myScaleSet_Instance1   eastus     Standard_DS1_v2   Windows    myScaleSet-a9f1d54c   Succeeded     
myResourceGroup     myScaleSet_Instance2   eastus     Standard_DS1_v2   Windows    myScaleSet-4dc708e5   Succeeded   
```


## Bring VMs up-to-date with the latest scale set model
> [!NOTE]
> Upgrade modes are not currently supported on Virtual Machine Scale Sets using Flexible orchestration mode. 

Scale sets have an "upgrade policy" that determine how VMs are brought up-to-date with the latest scale set model. The three modes for the upgrade policy are:

- **Automatic** - In this mode, the scale set makes no guarantees about the order of VMs being brought down. The scale set may take down all VMs at the same time. 
- **Rolling** - In this mode, the scale set rolls out the update in batches with an optional pause time between batches.
- **Manual** - In this mode, when you update the scale set model, nothing happens to existing VMs until a manual update is triggered.
 
If your scale set is set to manual upgrades, you can trigger a manual upgrade using [Update-AzVmss](/powershell/module/az.compute/update-azvmss).

```azurepowershell-interactive
$myVmss = Get-AzVmss -ResourceGroupName myResourceGroup -Name myScaleSet
Update-AzVmss -ResourceGroupName myResourceGroup -VirtualMachineScaleSet $myVMss -VMScaleSetName myScaleSet
```

>[!NOTE]
> Service Fabric clusters can only use *Automatic* mode, but the update is handled differently. For more information, see [Service Fabric application upgrades](../service-fabric/service-fabric-application-upgrade.md).

## Reimage a scale set
Virtual Machine Scale Sets will generate a unique name for each VM in the scale set. The naming convention differs by orchestration mode:

- Flexible orchestration Mode: `{scale-set-name}_{8-char-guid}`
- Uniform orchestration mode: `{scale-set-name}_{instance-id}`
 
In the cases where you need to reimage a specific instance, use [Set-AzVmss](/powershell/module/az.compute/set-azvmss) and specify the instance name.

```azurepowershell-interactive
Set-AzVmssVM -ResourceGroupName myResourceGroup -VMScaleSetName myScaleSet -InstanceId myScaleSet_Instance1 -Reimage
```

To reimage all instances in a scale set simply specify the scale set name and omit any instanceIDs. 

```azurepowershell-interactive
Set-AzVmssVM -Reimage -ResourceGroupName myResourceGroup -VMScaleSetName myScaleSet
```

## Update the OS image for your scale set
You may have a scale set that runs an old version of Ubuntu LTS 18.04. You want to update to a newer version of Ubuntu LTS 16.04, such as version *18.04.202210180*. The image reference version property isn't part of a list, so you can directly modify these properties using [Update-AzVmss](/powershell/module/az.compute/update-azvmss).

```azurepowershell-interactive
$myVmss = Get-AzVmss -ResourceGroupName myResourceGroup -Name myScaleSet      
  
Update-AzVmss -ResourceGroupName myResourceGroup -VirtualMachineScaleSet $myVMss -VMScaleSetName myScaleSet -ImageReferenceVersion virtualMachineProfile.storageProfile.imageReference.version=18.04.202210180
```

Alternatively, you may want to change the image your scale set uses. For example, you may want to update or change a custom image used by your scale set. You can change the image your scale set uses by updating the image reference ID property. The image reference ID property isn't part of a list, so you can directly modify this property using [Update-AzVmss](/powershell/module/az.compute/update-azvmss).

```azurepowershell-interactive
$myVmss = Get-AzVmss -ResourceGroupName myResourceGroup -Name myScaleSet     
   
Update-AzVmss -ResourceGroupName myResourceGroup -VirtualMachineScaleSet $myVMss -VMScaleSetName myScaleSet -ImageReferenceVersion virtualMachineProfile.storageProfile.imageReference.id=/subscriptions/{subscriptionID}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/images/myNewImage
```

If you use Azure platform images, you can update the image by modifying the *imageReference* (more information, see the [REST API documentation](/rest/api/compute/virtualmachinescalesets/createorupdate)).

>[!NOTE]
> With platform images, it is common to specify "latest" for the image reference version. When you create, scale out, and reimage, VMs are created with the latest available version. However, it **does not** mean that the OS image is automatically updated over time as new image versions are released. A separate feature provides automatic OS upgrades. For more information, see the [Automatic OS Upgrades documentation](virtual-machine-scale-sets-automatic-upgrade.md).

If you use custom images, you can update the image by updating the *imageReference* ID (more information, see the [REST API documentation](/rest/api/compute/virtualmachinescalesets/createorupdate)).

## Next steps
In this tutorial, you learned how to modify various aspects of your scale set and individual instances using PowerShell.

> [!div class="checklist"]
> * Update the scale set model
> * Update an individual VM instance in a scale set
> * Add an instance to your scale set
> * Bring VMs up-to-date with the latest scale set model
> * Reimage a scale set
> * Update the OS image for your scale set

> [!div class="nextstepaction"]
> [Use data disks with scale sets](tutorial-use-disks-powershell.md)
