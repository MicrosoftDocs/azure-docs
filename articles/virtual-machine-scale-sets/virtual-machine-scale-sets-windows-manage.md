---
title: Manage VMs in a Virtual Machine Scale Set | Microsoft Docs
description: Manage virtual machines in a virtual machine scale set using Azure PowerShell.
services: virtual-machine-scale-sets
documentationcenter: ''
author: Thraka
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: d35fa77a-de96-4ccd-a332-eb181d1f4273
ms.service: virtual-machine-scale-sets
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/27/2016
ms.author: adegeo

---
# Manage virtual machines in a virtual machine scale set
Use the tasks in this article to manage virtual machines in your virtual machine scale set.

Most of the tasks that involve managing a virtual machine in a scale set require that you know the instance ID of the machine that you want to manage. You can use [Azure Resource Explorer](https://resources.azure.com) to find the instance ID of a virtual machine in a scale set. You also use Resource Explorer to verify the status of the tasks that you finish.

See [How to install and configure Azure PowerShell](/powershell/azure/overview) for information about installing the latest version of Azure PowerShell, selecting your subscription, and signing in to your account.

## Display information about a scale set
You can get general information about a scale set, which is also referred to as the instance view. Or, you can get more specific information, such as information about the resources in the scale set.

Replace the quoted values with the name or your resource group and scale set and then run the command:

    Get-AzureRmVmss -ResourceGroupName "resource group name" -VMScaleSetName "scale set name"

It returns something like this:

    Id                                          : /subscriptions/{sub-id}/resourceGroups/myrg1/providers/Microsoft.Compute/virtualMachineScaleSets/myvmss1
    Name                                        : myvmss1
    Type                                        : Microsoft.Compute/virtualMachineScaleSets
    Location                                    : centralus
    Sku                                         :
      Name                                      : Standard_A0
      Tier                                      : Standard
      Capacity                                  : 3
    UpgradePolicy                               :
      Mode                                      : Manual
    VirtualMachineProfile                       :
      OsProfile                                 :
        ComputerNamePrefix                      : vmss1
        AdminUsername                           : admin1
        WindowsConfiguration                    :
          ProvisionVMAgent                      : True
          EnableAutomaticUpdates                : True
    StorageProfile                              :
      ImageReference                            :
        Publisher                               : MicrosoftWindowsServer
        Offer                                   : WindowsServer
        Sku                                     : 2012-R2-Datacenter
        Version                                 : latest
      OsDisk                                    :
        Name                                    : vmssosdisk
        Caching                                 : ReadOnly
        CreateOption                            : FromImage
        VhdContainers[0]                        : https://astore.blob.core.windows.net/vmss
        VhdContainers[1]                        : https://gstore.blob.core.windows.net/vmss
        VhdContainers[2]                        : https://mstore.blob.core.windows.net/vmss
        VhdContainers[3]                        : https://sstore.blob.core.windows.net/vmss
        VhdContainers[4]                        : https://ystore.blob.core.windows.net/vmss
    NetworkProfile                              :
      NetworkInterfaceConfigurations[0]         :
        Name                                    : mync1
        Primary                                 : True
        IpConfigurations[0]                     :
          Name                                  : ip1
          Subnet                                :
            Id                                  : /subscriptions/{sub-id}/resourceGroups/myrg1/providers/Microsoft.Network/virtualNetworks/myvn1/subnets/mysn1
          LoadBalancerBackendAddressPools[0]    :
            Id                                  : /subscriptions/{sub-id}/resourceGroups/myrg1/providers/Microsoft.Network/loadBalancers/mylb1/backendAddressPools/bepool1
        LoadBalancerInboundNatPools[0]          :
            Id                                  : /subscriptions/{sub-id}/resourceGroups/myrg1/providers/Microsoft.Network/loadBalancers/mylb1/inboundNatPools/natpool1
    ExtensionProfile                            :
      Extensions[0]                             :
        Name                                    : Microsoft.Insights.VMDiagnosticsSettings
        Publisher                               : Microsoft.Azure.Diagnostics
        Type                                    : IaaSDiagnostics
        TypeHandlerVersion                      : 1.5
        AutoUpgradeMinorVersion                 : True
        Settings                                : {"xmlCfg":"...","storageAccount":"astore"}
    ProvisioningState                           : Succeeded

Replace the quoted values with the name of your resource group and scale set. Replace *#* with the instance identifier of the virtual machine that you want to get information about and then run it:

    Get-AzureRmVmssVM -ResourceGroupName "resource group name" -VMScaleSetName "scale set name" -InstanceId #

It returns something like this example:

    Id                            : /subscriptions/{sub-id}/resourceGroups/myrg1/providers/Microsoft.Compute/
                                    virtualMachineScaleSets/myvmss1/virtualMachines/0
    Name                          : myvmss1_0
    Type                          : Microsoft.Compute/virtualMachineScaleSets/virtualMachines
    Location                      : centralus
    InstanceId                    : 0
    Sku                           :
      Name                        : Standard_A0
      Tier                        : Standard
    LatestModelApplied            : True
    StorageProfile                :
      ImageReference              :
        Publisher                 : MicrosoftWindowsServer
        Offer                     : WindowsServer
        Sku                       : 2012-R2-Datacenter
        Version                   : 4.0.20160617
      OsDisk                      :
        OsType                    : Windows
        Name                      : vmssosdisk-os-0-e11cad52959b4b76a8d9f26c5190c4f8
        Vhd                       :
          Uri                     : https://astore.blob.core.windows.net/vmss/vmssosdisk-os-0-e11cad52959b4b76a8d9f26c5190c4f8.vhd
        Caching                   : ReadOnly
        CreateOption              : FromImage
    OsProfile                     :
      ComputerName                : myvmss1-0
      AdminUsername               : admin1
      WindowsConfiguration        :
        ProvisionVMAgent          : True
        EnableAutomaticUpdates    : True
    NetworkProfile                :
      NetworkInterfaces[0]        :
        Id                        : /subscriptions/{sub-id}/resourceGroups/myrg1/providers/Microsoft.Compute/virtualMachineScaleSets/
                                    myvmss1/virtualMachines/0/networkInterfaces/mync1
    ProvisioningState             : Succeeded
    Resources[0]                  :
      Id                          : /subscriptions/{sub-id}/resourceGroups/myrg1/providers/Microsoft.Compute/virtualMachines/
                                    myvmss1_0/extensions/Microsoft.Insights.VMDiagnosticsSettings
      Name                        : Microsoft.Insights.VMDiagnosticsSettings
      Type                        : Microsoft.Compute/virtualMachines/extensions
      Location                    : centralus
      Publisher                   : Microsoft.Azure.Diagnostics
      VirtualMachineExtensionType : IaaSDiagnostics
      TypeHandlerVersion          : 1.5
      AutoUpgradeMinorVersion     : True
      Settings                    : {"xmlCfg":"...","storageAccount":"astore"}
      ProvisioningState           : Succeeded

## Start a virtual machine in a scale set
Replace the quoted values with the name of your resource group and scale set. Replace *#* with the identifier of the virtual machine that you want to start and then run it:

    Start-AzureRmVmss -ResourceGroupName "resource group name" -VMScaleSetName "scale set name" -InstanceId #

In Resource Explorer, we can see that the status of the instance is **running**:

    "statuses": [
      {
        "code": "ProvisioningState/succeeded",
        "level": "Info",
        "displayStatus": "Provisioning succeeded",
        "time": "2016-03-15T02:10:08.0730839+00:00"
      },
      {
        "code": "PowerState/running",
        "level": "Info",
        "displayStatus": "VM running"
      }
    ]

You can start all the virtual machines in the scale set by not using the -InstanceId parameter.

## Stop a virtual machine in a scale set
Replace the quoted values with the name of your resource group and scale set. Replace *#* with the identifier of the virtual machine that you want to stop and then run it:

    Stop-AzureRmVmss -ResourceGroupName "resource group name" -VMScaleSetName "scale set name" -InstanceId #

In Resource Explorer, we can see that the status of the instance is **deallocated**:

    "statuses": [
      {
        "code": "ProvisioningState/succeeded",
        "level": "Info",
        "displayStatus": "Provisioning succeeded",
        "time": "2016-03-15T01:25:17.8792929+00:00"
      },
      {
        "code": "PowerState/deallocated",
        "level": "Info",
        "displayStatus": "VM deallocated"
      }
    ]

To stop a virtual machine and not deallocate it, use the -StayProvisioned parameter. You can stop all the virtual machines in the set by not using the -InstanceId parameter.

## Restart a virtual machine in a scale set
Replace the quoted values with the name of your resource group and the scale set. Replace *#* with the identifier of the virtual machine that you want to restart and then run it:

    Restart-AzureRmVmss -ResourceGroupName "resource group name" -VMScaleSetName "scale set name" -InstanceId #

You can restart all the virtual machines in the set by not using the -InstanceId parameter.

## Remove a virtual machine from a scale set
Replace the quoted values with the name of your resource group and the scale set. Replace *#* with the identifier of the virtual machine that you want to remove and then run it:  

    Remove-AzureRmVmss -ResourceGroupName "resource group name" –VMScaleSetName "scale set name" -InstanceId #

You can remove the virtual machine scale set all at once by not using the -InstanceId parameter.

## Change the capacity of a scale set
You can add or remove virtual machines by changing the capacity of the set. Get the scale set that you want to change, set the capacity to what you want it to be, and then update the scale set with the new capacity. In these commands, replace the quoted values with the name of your resource group and the scale set.

    $vmss = Get-AzureRmVmss -ResourceGroupName "resource group name" -VMScaleSetName "scale set name"
    $vmss.sku.capacity = 5
    Update-AzureRmVmss -ResourceGroupName "resource group name" -Name "scale set name" -VirtualMachineScaleSet $vmss 

If you are removing virtual machines from the scale set, the virtual machines with the highest ids are removed first.

