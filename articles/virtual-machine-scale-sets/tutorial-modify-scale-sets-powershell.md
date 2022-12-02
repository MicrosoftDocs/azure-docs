---
title: Modify an Azure Virtual Machine Scale Set using PowerShell
description: Learn how to modify and update an Azure Virtual Machine Scale Set using PowerShell
author: ju-shim
ms.author: jushiman
ms.topic: how-to
ms.service: virtual-machine-scale-sets
ms.date: 11/22/2022
ms.reviewer: mimckitt
ms.custom: mimckitt, devx-track-azurepowershell, devx-track-azurepowershell

---
# Tutorial: Modify a Virtual Machine Scale Set using PowerShell

Throughout the lifecycle of your applications, you may need to modify or update your Virtual Machine Scale Set. These updates may include how to update the configuration of the scale set, or change the application configuration. This article describes how to modify an existing scale set using PowerShell.

## Update the scale set model
A scale set has a "scale set model" that captures the *desired* state of the scale set as a whole. To query the model for a scale set, you can use [az vmss show](/cli/azure/vmss#az-vmss-show):

```azurepowershell
Get-AzVMSS -ResourceGroupName myResourceGroup -Name myScaleSet
```

The exact presentation of the output depends on the options you provide to the command. The following example shows condensed sample output from PowerShell:

```output
                : myResourceGroup
Sku                                         : 
  Name                                      : Standard_DS1_v2
  Tier                                      : Standard
  Capacity                                  : 2
ProvisioningState                           : Succeeded
UniqueId                                    : 8720ed5a-b2f4-4cc4-abdf-15ac06f1b1d5
SinglePlacementGroup                        : False
PlatformFaultDomainCount                    : 1
Id                                          : /subscriptions/49d84582-7207-4a4f-824e-044e83c71887/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myScaleSet
Name                                        : myScaleSet
Type                                        : Microsoft.Compute/virtualMachineScaleSets
Location                                    : eastus
Tags                                        : {}
VirtualMachineProfile                       : 
  OsProfile                                 : 
    ComputerNamePrefix                      : myScaleSe
    AdminUsername                           : azureuser
    WindowsConfiguration                    : 
      ProvisionVMAgent                      : True
      EnableAutomaticUpdates                : True
      PatchSettings                         : 
        PatchMode                           : AutomaticByOS
        AssessmentMode                      : ImageDefault
      EnableVMAgentPlatformUpdates          : False
    AllowExtensionOperations                : True
  StorageProfile                            : 
    ImageReference                          : 
      Publisher                             : MicrosoftWindowsServer
      Offer                                 : WindowsServer
      Sku                                   : 2016-Datacenter
      Version                               : latest
    OsDisk                                  : 
      Caching                               : None
      CreateOption                          : FromImage
      DiskSizeGB                            : 127
      OsType                                : Windows
      ManagedDisk                           : 
        StorageAccountType                  : Premium_LRS
      DeleteOption                          : Delete
  NetworkProfile                            : 
    NetworkInterfaceConfigurations[0]       : 
      Name                                  : myScaleSet
      Primary                               : True
      DisableTcpStateTracking               : False
      DnsSettings                           : 
      IpConfigurations[0]                   : 
        Name                                : myScaleSet
        Subnet                              : 
          Id                                : /subscriptions/49d84582-7207-4a4f-824e-044e83c71887/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/myScaleSet/subnets/myScaleSet
        PrivateIPAddressVersion             : IPv4
        LoadBalancerBackendAddressPools[0]  : 
          Id                                : 
/subscriptions/49d84582-7207-4a4f-824e-044e83c71887/resourceGroups/myResourceGroup/providers/Microsoft.Network/loadBalancers/myScaleSet/backendAddressPools/myScaleSet
      EnableIPForwarding                    : False
      DeleteOption                          : Delete
    NetworkApiVersion                       : 2020-11-01
OrchestrationMode                           : Flexible
TimeCreated                                 : 12/2/2022 5:41:21 PM
```

You can use [az vmss update](/cli/azure/vmss#az-vmss-update) to update various properties of your scale set. For example, updating your license type or enabling automatic instance repair.

```azurepowershell-interactive
$myVmss = Get-AzVmss -ResourceGroupName myResourceGroup -Name myScaleSet
Update-AzVmss -ResourceGroupName myResourceGroup -VirtualMachineScaleSet $myVMss -VMScaleSetName myScaleSet -LicenseType Windows_Server
```

```azurepowershell-interactive
az vmss update --name MyScaleSet --resource-group MyResourceGroup --instance-id 4 --protect-from-scale-set-actions False --protect-from-scale-in
```


## Updating individual VM instances in a scale set
Similar to how a scale set has a model view, each VM instance in the scale set has its own model view. To query the model view for a particular VM instance in a scale set, you can use [az vm show](/cli/azure/vm#az-vm-show).

```azurepowershell
Get-AzVM -ResourceGroupName myResourceGroup -name MyScaleSet_941afe84
```

```output
ResourceGroupName      : myResourceGroup
Id                     : /subscriptions/49d84582-7207-4a4f-824e-044e83c71887/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/myScaleSet_941afe84
VmId                   : 5a5c2c5f-ec50-4848-ba29-3736a27643f6
Name                   : myScaleSet_941afe84
Type                   : Microsoft.Compute/virtualMachines
Location               : eastus
Tags                   : {}
Extensions             : {MicrosoftMonitoringAgent}
HardwareProfile        : {VmSize}
NetworkProfile         : {NetworkInterfaces}
OSProfile              : {ComputerName, AdminUsername, WindowsConfiguration, Secrets, AllowExtensionOperations, RequireGuestProvisionSignal}
ProvisioningState      : Succeeded
StorageProfile         : {ImageReference, OsDisk, DataDisks}
VirtualMachineScaleSet : {Id}
TimeCreated            : 12/2/2022 5:41:23 PM
```

You can also add the `-Status` flag to get the Instance View which provides additional details about the VM. 

```azurepowershell
Get-AzVM -ResourceGroupName myResourceGroup -name MyScaleSet_941afe84 -Status                                    
```

```output
ResourceGroupName       : myResourceGroup
Name                    : MyScaleSet_941afe84
ComputerName            : myScaleSeTXQ8AK
OsName                  : Windows Server 2016 Datacenter
OsVersion               : 10.0.14393.5501
HyperVGeneration        : V1
Disks[0]                : 
  Name                  : myScaleSet_941afe84_disk1_cab60acccff7414b81d60572eeecb9e3
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


These properties describe the configuration of a VM instance within a scale set, not the configuration of the scale set as a whole. 

You can perform updates to individual VM instances in a scale set just like you would a standalone VM. For example, attaching a new data disk to instance 1:

```azurepowershell-interactive
$VirtualMachine = Get-AzVM -ResourceGroupName "myResourceGroup" -Name "myScaleSet_941afe84"
Add-AzVMDataDisk -VM $VirtualMachine -Name "disk1" -LUN 0 -Caching ReadOnly -DiskSizeinGB 128 -CreateOption Empty
Update-AzVM -ResourceGroupName "myResourceGroup" -VM $VirtualMachine
```


## Add an Instance to your scale set

There are times where you might want to add a new VM to your scale set but want different configuration options than then listed in the scale set model. VMs can be added to a scale set during creation by using the [az vm create](/cli/azure/vmss#az-vmss-create) command and specifying the scale set name you want the instance added to. 

```azurepowershell-interactive
Get-AzVmss -ResourceGroup myResourceGroup -name myScaleSet
```

```output
ResourceGroupName                           : myResourceGroup
Sku                                         : 
  Name                                      : Standard_DS1_v2
  Tier                                      : Standard
  Capacity                                  : 2
ProvisioningState                           : Succeeded
UniqueId                                    : 8720ed5a-b2f4-4cc4-abdf-15ac06f1b1d5
SinglePlacementGroup                        : False
PlatformFaultDomainCount                    : 1
Id                                          : /subscriptions/49d84582-7207-4a4f-824e-044e83c71887/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myScaleSet
Name                                        : myScaleSet
Type                                        : Microsoft.Compute/virtualMachineScaleSets
Location                                    : eastus
Tags                                        : {}
```

```azurepowershell
New-AzVM -Name myNewInstance -ResourceGroupName myResourceGroup -image UbuntuLTS -VmssId /subscriptions/49d84582-7207-4a4f-824e-044e83c71887/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myScaleSet
```

```output
ResourceGroupName        : myResourceGroup                                                                              
Id                       : /subscriptions/49d84582-7207-4a4f-824e-044e83c71887/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/myNewInstance
VmId                     : bce32ac6-6c63-4189-b14b-0cbebd5f9a79                                                         
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

```azurepowershell
Get-AzVm -ResourceGroupName myResourceGroup 
```

```output
ResourceGroupName                Name Location          VmSize  OsType                 NIC ProvisioningState Zone
-----------------                ---- --------          ------  ------                 --- ----------------- ----
myResourceGroup         myNewInstance   eastus Standard_D2s_v3   Linux       myNewInstance         Succeeded     
myResourceGroup   myScaleSet_941afe84   eastus Standard_DS1_v2 Windows myScaleSet-a9f1d54c         Succeeded     
myResourceGroup   myScaleSet_cde381b6   eastus Standard_DS1_v2 Windows myScaleSet-4dc708e5         Succeeded   
```


## Bring VMs up-to-date with the latest scale set model
Scale sets have an "upgrade policy" that determine how VMs are brought up-to-date with the latest scale set model. The three modes for the upgrade policy are:

- **Automatic** - In this mode, the scale set makes no guarantees about the order of VMs being brought down. The scale set may take down all VMs at the same time. 
- **Rolling** - In this mode, the scale set rolls out the update in batches with an optional pause time between batches.
- **Manual** - In this mode, when you update the scale set model, nothing happens to existing VMs until a manual update is triggered.
 
If your scale set is set to manual upgrades, you can trigger a manual upgrade using [az vmss update](/cli/azure/vmss#az-vmss-update).

```azurepowershell
$myVmss = Get-AzVmss -ResourceGroupName myResourceGroup -Name myScaleSet
Update-AzVmss -ResourceGroupName myResourceGroup -VirtualMachineScaleSet $myVMss -VMScaleSetName myScaleSet
```

>[!NOTE]
> Service Fabric clusters can only use *Automatic* mode, but the update is handled differently. For more information, see [Service Fabric application upgrades](../service-fabric/service-fabric-application-upgrade.md).


## Reimage a scale set

Virtual Machine Scale Sets will generate a unique name for each VM in the scale set. The naming convention differs by orchestration mode:

- Flexible orchestration Mode: `{scale-set-name}_{8-char-guid}`
- Uniform orchestration mode: `{scale-set-name}_{instance-id}`
 
In the cases where you need to reimage a specific instance, use [az vmss reimage](/cli/azure/vmss#az-vmss-reimage) and specify the instance names.

```azurepowershell
az vmss reimage --resource-group myResourceGroup --name myScaleSet --instance-id myScaleSet_Instance1
```

## Update the OS image for your scale set
You may have a scale set that runs an old version of Ubuntu LTS 18.04. You want to update to a newer version of Ubuntu LTS 16.04, such as version *18.04.202210180*. The image reference version property isn't part of a list, so you can directly modify these properties using [az vmss update](/cli/azure/vmss#az-vmss-update).

```azurepowershell
az vmss update --resource-group myResourceGroup --name myScaleSet --set virtualMachineProfile.storageProfile.imageReference.version=18.04.202210180
```

Alternatively, you may want to change the image your scale set uses. For example, you may want to update or change a custom image used by your scale set. You can change the image your scale set uses by updating the image reference ID property. The image reference ID property isn't part of a list, so you can directly modify this property using [az vmss update](/cli/azure/vmss#az-vmss-update).

```azurepowershell
az vmss update \
--resource-group myResourceGroup \
--name myScaleSet \
--set virtualMachineProfile.storageProfile.imageReference.id=/subscriptions/{subscriptionID}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/images/myNewImage
```

If you use Azure platform images, you can update the image by modifying the *imageReference* (more information, see the [REST API documentation](/rest/api/compute/virtualmachinescalesets/createorupdate)).

>[!NOTE]
> With platform images, it is common to specify "latest" for the image reference version. When you create, scale out, and reimage, VMs are created with the latest available version. However, it **does not** mean that the OS image is automatically updated over time as new image versions are released. A separate feature provides automatic OS upgrades. For more information, see the [Automatic OS Upgrades documentation](virtual-machine-scale-sets-automatic-upgrade.md).

If you use custom images, you can update the image by updating the *imageReference* ID (more information, see the [REST API documentation](/rest/api/compute/virtualmachinescalesets/createorupdate)).

## Update the load balancer for your scale set
Let's say you have a scale set with an Azure Load Balancer, and you want to replace the Azure Load Balancer with an Azure Application Gateway. The load balancer and Application Gateway properties for a scale set are part of a list, so you can use the commands to remove or add list elements instead of modifying the properties directly.

```azurepowershell-interactive
# Remove the load balancer backend pool from the scale set model
az vmss update --resource-group myResourceGroup --name myScaleSet --remove virtualMachineProfile.networkProfile.networkInterfaceConfigurations[0].ipConfigurations[0].loadBalancerBackendAddressPools 0
    
# Remove the load balancer backend pool from the scale set model; only necessary if you have NAT pools configured on the scale set
az vmss update --resource-group myResourceGroup --name myScaleSet --remove virtualMachineProfile.networkProfile.networkInterfaceConfigurations[0].ipConfigurations[0].loadBalancerInboundNatPools 0
    
# Add the application gateway backend pool to the scale set model
az vmss update --resource-group myResourceGroup --name myScaleSet --add virtualMachineProfile.networkProfile.networkInterfaceConfigurations[0].ipConfigurations[0].ApplicationGatewayBackendAddressPools '{"id": "/subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.Network/applicationGateways/{applicationGatewayName}/backendAddressPools/{applicationGatewayBackendPoolName}"}'
```

>[!NOTE]
> These commands assume there is only one IP configuration and load balancer on the scale set. If there are multiple, you may need to use a list index other than *0*.


## Next steps
In this tutorial, you learned how to modify various aspects of your scale set and individual instances using PowerShell.

> [!div class="checklist"]
> * Update the scale set model
> * Update an individual VM instance in a scale set
> * Add an instance to your scale set
> * Bring VMs up-to-date with the latest scale set model
> * Reimage a scale set
> * Update the OS image for your scale set
> * Update the load balancer for your scale set


> [!div class="nextstepaction"]
> [Use data disks with scale sets](tutorial-use-disks-powershell.md)
