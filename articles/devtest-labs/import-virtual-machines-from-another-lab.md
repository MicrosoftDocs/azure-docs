---
title: Import virtual machines from another lab
description: Learn how to import virtual machines from one lab to another in Azure DevTest Labs.
ms.topic: how-to
ms.date: 11/08/2021
---

# Import virtual machines from one lab to another

This article discusses and describes how to import virtual machines (VMs) from one DevTest Labs lab to another lab.

## Scenarios
Here are some scenarios where you might need to import VMs from one lab into another lab:

- An individual is moving from one group to another and wants to take their developer desktop to the new team's lab.
- The group has hit a [subscription-level quota](../azure-resource-manager/management/azure-subscription-service-limits.md) and wants to split up the teams into more than one Azure subscription.
- The company is moving to Azure ExpressRoute or some other new networking topology, and the team wants to move the VMs to use the new infrastructure.

## Requirements and constraints

The import process imports the VMs from the source lab into the destination lab. You can optionally rename the VM in the process. The import process includes all dependencies like disks, schedules, and network settings.

The process is a copy operation, not a move operation, and can take a long time. The import time depends on the following factors:

- Number and size of the disks attached to the source machine
- Distance between the source and destination regions

When the process finishes, the source VM is shut down, and the new VM is running in the destination lab.

There are several requirements and constraints for importing VMs from one lab to another lab:

- You can import VMs across subscriptions and across regions, but both subscriptions must be associated with the same Azure Active Directory tenant.
- VMs can't be in a claimable state in the source lab.
- You must be the owner of the VM in the source lab, and the owner of the destination lab.
- Currently, this feature is supported only through Powershell and REST API.

## Use PowerShell

Download and run [ImportVirtualMachines.ps1](https://github.com/Azure/azure-devtestlab/tree/master/samples/DevTestLabs/Scripts/ImportVirtualMachines). You can use the script to import a single VM or all VMs from the source lab into the destination lab.

### Use PowerShell to import a single VM or all lab VMs

Executing this PowerShell script requires identifying the source VM and the destination lab, and optionally supplying a new name to use for the destination VM.

```powershell
./ImportVirtualMachines.ps1 -SourceSubscriptionId "<ID of the subscription that contains the source lab>"`
                            -SourceDevTestLabName "<Name of the source lab>"`
                            -SourceVirtualMachineName "<Name of the VM to import from the source lab>" `
                            -DestinationSubscriptionId "<ID of the subscription that contains the destination lab>"`
                            -DestinationDevTestLabName "<Name of the destination lab>"`
                            -DestinationVirtualMachineName "<Optional: specify a new name for the imported VM in the destination lab>"
```
If you don't specify a the source VM, the script automatically imports all VMs in the source lab.

## Use HTTP REST to import a VM

The REST call is simple. You provide the information to identify the source and destination resources. The operation takes place on the destination lab resource.

```REST
POST https://management.azure.com/subscriptions/<DestinationSubscriptionID>/resourceGroups/<DestinationResourceGroup>/providers/Microsoft.DevTestLab/labs/<DestinationLab>/ImportVirtualMachine?api-version=2017-04-26-preview
{
   sourceVirtualMachineResourceId: "/subscriptions/<SourceSubscriptionID>/resourcegroups/<SourceResourceGroup>/providers/microsoft.devtestlab/labs/<SourceLab>/virtualmachines/<NameofVMTobeImported>",
   destinationVirtualMachineName: "<NewNameForImportedVM>"
}
```

## Next steps

- [Set policies for a lab](devtest-lab-set-lab-policy.md)
- [DevTest Labs frequently asked questions](devtest-lab-faq.yml)
