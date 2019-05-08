---
title: Import VMs from another lab in Azure DevTest Labs | Microsoft Docs
description: Learn how to import virtual machines from another lab into the current lab in Azure DevTest Labs
services: devtest-lab,virtual-machines,lab-services
documentationcenter: na
author: spelluru
manager: femila
editor: ''

ms.assetid: 8460f09e-482f-48ba-a57a-c95fe8afa001
ms.service: lab-services
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/11/2018
ms.author: spelluru

---
# Import VMs from another lab in Azure DevTest Labs
The Azure DevTest Labs service significantly improves management of virtual machines (VMs) for development and testing activities. It allows you to move a VM from one lab to another as the team or infrastructure requirements change. Here are some common scenarios where you may need to do so:

- A person on the team moves to another group within the enterprise and wants to take development VMs to the new team’s lab.
- The group has reached the subscription-level quota and wants to split up teams into multiple subscriptions.
- The company plans to move to Express Route (or some other new networking topology) and the team wants to move VMs to use this new infrastructure.

## Solution and constraints
Azure DevTest Labs enables a lab owner to import VMs in a source lab into a destination lab. The lab owner can optionally provide a new name for the destination VM in the process. The import process includes all the dependencies like disks, schedules, network settings, etc. The process does take some time and is impacted by the number/size of the disks attached to the source machine and the distance to the destination (For example, East US region to Southeast Asia region). Once the import process is complete, the source VM remains shutdown and the new one is running in the destination lab.

There are two key constraints to be aware of when planning to import VMs to another lab:

- Importing VMs across subscriptions and across regions are supported, but the subscriptions must be associated to the same Azure Active Directory tenant.
- VMs must not be in a claimable state in the source lab.

In addition, to be able to import a VM from one lab to another, you need to be the owner of the VM in the source lab and owner of the lab in the destination lab.

## Steps to import a VM from another lab
Currently, you can import a VM from one lab into another only by using Azure PowerShell and REST API.

### Use PowerShell
Download the PowerShell script file ImportVirtualMachines.ps1 from [Azure DevTest Lab Git repository](https://github.com/Azure/azure-devtestlab/tree/master/samples/DevTestLabs/Scripts/ImportVirtualMachines) to your local drive.

#### Import a single VM
Run the ImportVirtualMachines.ps1 script to import a single VM from a source lab into a destination lab. You can specify a new name for the VM that's being copied by using the DestinationVirtualMachineName paramer.

```powershell
./ImportVirtualMachines.ps1 -SourceSubscriptionId "<ID of the subscription that contains the source VM>" `
                            -SourceDevTestLabName "<Name of the lab that contains the source VM>" `
                            -SourceVirtualMachineName "<Name of the machine. Optional. If not specified, all VMs are copied>" `
                            -DestinationSubscriptionId "<ID of the target/destination subscription>" `
                            -DestinationDevTestLabName "<Name of the lab to which the VM is copied>" `
                            -DestinationVirtualMachineName "<New name for the VM. Optional>"
```


#### Importing all VMs
When you run the ImportVirtualMachines.ps1 script, if you don't specify a VM in the source lab, the script imports all VMs in the source lab into the destination lab.

```powershell
./ImportVirtualMachines.ps1 -SourceSubscriptionId "<ID of the subscription that contains the source VM>" `
                            -SourceDevTestLabName "<Name of the lab that contains the source VM>" `
                            -DestinationSubscriptionId "<ID of the target/destination subscription>" `
                            -DestinationDevTestLabName "<Name of the lab to which the VMs are copied>"
```

### Use REST API
Invoke the REST API against the target/destination lab and pass in the source lab, subscription, and VM information as parameters as shown in the following example:

```json
POST https://management.azure.com/subscriptions/<ID of the target/destination subscription>/resourceGroups/<Name of the resource group that contains the destination lab>/providers/Microsoft.DevTestLab/labs/<Name of the lab to which the VMs are copied>/ImportVirtualMachine?api-version=2017-04-26-preview
{
   sourceVirtualMachineResourceId: "/subscriptions/<ID of the subscription that contains the source VM>/resourcegroups/<Name of the resource group that contains the source lab>/providers/microsoft.devtestlab/labs/<Name of the lab that contains the source VM>/virtualmachines/MyVm",
   destinationVirtualMachineName: "MyVmNew"
}
```

## Next steps

- For information about resizing a VM, see [Resize a VM](devtest-lab-resize-vm.md).
- For information about redeploying a VM, see [Redeploy a VM](devtest-lab-redeploy-vm.md).
