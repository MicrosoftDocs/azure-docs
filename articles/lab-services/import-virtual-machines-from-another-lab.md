---
title: Import virtual machines from another lab in Azure DevTest Labs
description: Learn how to import virtual machines from another lab into the current lab.
services: devtest-lab, lab-services
documentationcenter: na
author: spelluru
manager: femila

ms.service: lab-services
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/16/2020
ms.author: spelluru

---

# Import virtual machines from another lab in Azure DevTest Labs
This article provides information about how to import virtual machines from another lab into your lab.

## Scenarios
Here are some scenarios where you need to import VMs from one lab into another lab:

- An individual on the team is moving to another group within the enterprise and wants to take the developer desktop to the new team’s DevTest Labs.
- The group has hit a [subscription-level quota](../azure-resource-manager/management/azure-subscription-service-limits.md) and wants to split up the teams into a few subscriptions
- The company is moving to Express Route (or some other new networking topology) and the team wants to move the Virtual Machines to use this new infrastructure

## Solution and constraints
This feature enables you to import VMs in one lab (source) into another lab (destination). You can optionally give a new name for the destination VM in the process. The import process includes all the dependencies like disks, schedules, network settings, and so on.

The process does take some time and is impacted by the following factors:

- Number/size of the disks that are attached to the source machine (since it’s a copy operation and not a move operation)
- Distance to the destination (For example, East US region to Southeast Asia).

Once the process is complete, the source Virtual Machine remains shutdown and the new one is running in the destination lab.

There are two key constraints to be aware of when planning to import VMs from one lab in to another lab:

- Virtual Machine imports across subscriptions and across regions are supported, but the subscriptions must be associated to the same Azure Active Directory tenant.
- Virtual Machines must not be in a claimable state in the source lab.
- You're the owner of the VM in the source lab and owner of the lab in the destination lab.
- Currently, this feature is supported only through Powershell and REST API.

## Use PowerShell
Download ImportVirtualMachines.ps1 file from the [GitHub](https://github.com/Azure/azure-devtestlab/tree/master/samples/DevTestLabs/Scripts/ImportVirtualMachines). You can use the script to import a single VM or all VMs in the source lab into the destination lab.

### Use PowerShell to import a single VM
Executing this powershell script requires identifying the source VM and the destination lab, and optionally supplying a new name to use for the destination machine:

```powershell
./ImportVirtualMachines.ps1 -SourceSubscriptionId "<ID of the subscription that contains the source lab>" `
                            -SourceDevTestLabName "<Name of the source lab>" `
                            -SourceVirtualMachineName "<Name of the VM to be imported from the source lab> " `
                            -DestinationSubscriptionId "<ID of the subscription that contians the destination lab>" `
                            -DestinationDevTestLabName "<Name of the destination lab>" `
                            -DestinationVirtualMachineName "<Optional: specify a new name for the imported VM in the destination lab>"
```

### Use PowerShell to import all VMs in the source lab
If the Source Virtual Machine isn’t specified, the script automatically imports all VMs in the DevTest Labs.  For example:

```powershell
./ImportVirtualMachines.ps1 -SourceSubscriptionId "<ID of the subscription that contains the source lab>" `
                            -SourceDevTestLabName "<Name of the source lab>" `
                            -DestinationSubscriptionId "<ID of the subscription that contians the destination lab>" `
                            -DestinationDevTestLabName "<Name of the destination lab>"
```

## Use HTTP REST to import a VM
The REST call is simple. You give enough information to identify the source and destination resources. Remember that the operation takes place on the destination lab resource.

```REST
POST https://management.azure.com/subscriptions/<DestinationSubscriptionID>/resourceGroups/<DestinationResourceGroup>/providers/Microsoft.DevTestLab/labs/<DestinationLab>/ImportVirtualMachine?api-version=2017-04-26-preview
{
   sourceVirtualMachineResourceId: "/subscriptions/<SourceSubscriptionID>/resourcegroups/<SourceResourceGroup>/providers/microsoft.devtestlab/labs/<SourceLab>/virtualmachines/<NameofVMTobeImported>",
   destinationVirtualMachineName: "<NewNameForImportedVM>"
}
```

## Next steps
See the following articles:

- [Set policies for a lab](devtest-lab-get-started-with-lab-policies.md)
- [Frequently asked questions](devtest-lab-faq.md)
