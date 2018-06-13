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
# Import a VM in from another lab in Azure DevTest Labs
The Azure DevTest Labs service significantly improves management of virtual machines for development and testing activities. When a developer or tester moves from one team to another team, the VM that developer or tester uses need to be moved from the old team's lab to new team's lab. Azure DevTest Labs allows you to import a virtual machine (VM) from one lab into another. This article explains how to do so. 

## Scenarios
Here are some common scenarios where you may need to move a VM from one lab to another:

- An individual on the team moves to another group within the enterprise and wants to take the virtual machines he uses to the new team’s DevTest Lab instance.
- The group has reached the subscription-level quota and wants to split up teams into a multiple subscriptions.
- The company plans to move to Express Route (or some other new networking topology) and the team wants to move VMs to leverage this new infrastructure.

## Solution and constraints
Azure DevTest Labs enables a lab owner to import VMs in a source lab into a destination lab. The lab owner can optionally provide a new name for the destination VM in the process. The import process includes all the dependencies like disks, schedules, network settings, etc. It does take some time and is impacted by the number/size of the disks attached to the source machine and the distance to the destination (East US region to Southeast Asia region for example). Once the import process is complete, the source VM remains shutdown and the new one is running in the destination lab.

There are two key constraints to be aware of when planning to import VMs to another DevTest Lab instance:

- Importing VMs across subscriptions and across regions are supported, but the subscriptions must be associated to the same Azure Active Directory tenant.
- VMs must not be in a claimable state in the source lab.

In addition, to be able to import a VM from one lab to another, you need to be the owner of the VM in the source lab and owner of the lab in the destination lab.

## Steps to import a VM from another lab
Currently, you can import a VM from one lab into another only by using Azure PowerShell and REST API. Here are the steps to import a VM: 

### Use PowerShell

#### Import a single machine from another lab
Executing the powershell script requires identifying the source Virtual Machine and the destination lab, and optionally supplying a new name to use for the destination machine:

```powershell
./ImportVirtualMachines.ps1 -SourceSubscriptionId "<ID of the subscription that contains the source VM>" `
                            -SourceDevTestLabName "<Name of the lab that contains the source VM>" `
                            -SourceVirtualMachineName "<Name of the machine. Optional. If not specified, all VMs are copied>" `
                            -DestinationSubscriptionId "<ID of the target/destination subscription>" `
                            -DestinationDevTestLabName "<Name of the lab to which the VM is copied>" `
                            -DestinationVirtualMachineName "<New name for the VM. Optional>"
```


#### Importing all machines from another lab
If the Source Virtual Machine isn’t specified, the script will automatically import all Virtual Machines in the DevTest Lab.  For example:

```powershell
./ImportVirtualMachines.ps1 -SourceSubscriptionId "<ID of the subscription that contains the source VM>" `
                            -SourceDevTestLabName "<Name of the lab that contains the source VM>" `
                            -DestinationSubscriptionId "<ID of the target/destination subscription>" `
                            -DestinationDevTestLabName "<Name of the lab to which the VMs are copied>"
```

### Use REST API
The REST call is simple; just enough information to identify the source and destination resources – just remember that the operation takes place on the destination lab resource:

```json
POST https://management.azure.com/subscriptions/<ID of the target/destination subscription>/resourceGroups/<Name of the resource group that contains the destination lab>/providers/Microsoft.DevTestLab/labs/<Name of the lab to which the VMs are copied>/ImportVirtualMachine?api-version=2017-04-26-preview
{
   sourceVirtualMachineResourceId: "/subscriptions/<ID of the subscription that contains the source VM>/resourcegroups/<Name of the resource group that contains the source lab>/providers/microsoft.devtestlab/labs/<Name of the lab that contains the source VM>/virtualmachines/MyVm",
   destinationVirtualMachineName: "MyVmNew"
}
```

## Next steps
For detailed information about the resize feature supported by Azure virtual machines, see [Resize virtual machines](https://azure.microsoft.com/blog/resize-virtual-machines/).


