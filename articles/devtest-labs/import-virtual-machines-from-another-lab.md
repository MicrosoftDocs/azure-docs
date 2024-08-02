---
title: Import virtual machines from another lab
titleSuffix: Azure DevTest Labs
description: Learn how to import virtual machines from one lab to another in Azure DevTest Labs by using the REST API or PowerShell.
ms.topic: how-to
ms.author: rosemalcolm
author: RoseHJM
ms.date: 05/30/2024
ms.custom: UpdateFrequency2

#customer intent: As a developer, I want to import VMs from one lab to another in Azure DevTest Labs so I can copy and use existing VM configuration settings and data.
---

# Import virtual machines from one lab to another

This article describes the import feature for Azure DevTest Labs and how to import virtual machines (VMs) from a source lab to a destination lab. The import process is currently supported for PowerShell and the REST API.

Some scenarios where you might want to import VMs from one lab to another include:

- A user moves to a new team and wants to take their developer desktop to the new team's lab.
- A team reaches their [subscription-level quota](../azure-resource-manager/management/azure-subscription-service-limits.md) and wants to support membership by using multiple Azure subscriptions.
- A company transitions to Azure ExpressRoute or other networking topology and a team wants to move their VMs to the new infrastructure.

## Prerequisites

- You must be the owner of the virtual machine (VM) in the source lab.
- You must be the owner of the destination lab.
- VMs in the source lab can't be in a _claimable_ state. For more information, see [Create and manage claimable VMs in Azure DevTest Labs](devtest-lab-add-claimable-vm.md).
- To import VMs across subscriptions and across regions, all subscriptions must be associated with the same Microsoft Entra tenant.

## Explore the import process

The import process is a _copy_ operation, not a move operation. DevTest Labs imports VMs from the source lab to the destination lab.

The import copies all dependencies for the VMs to the destination lab, including disks, schedules, and network settings. During the process, you can specify new names for the VMs in the destination lab. 

The import can take some time to complete. The total time depends in part on the following factors:

- Number and size of disks attached to the source machine
- Distance between the source and destination regions

When the import finishes, the process shuts down the source VM and starts the new VM in the destination lab.

## Use a PowerShell script

You can use PowerShell to import one or all VMs in your source lab to your destination lab.

Follow these steps to use a PowerShell script:

1. Download and run the [ImportVirtualMachines.ps1](https://github.com/Azure/azure-devtestlab/tree/master/samples/DevTestLabs/Scripts/ImportVirtualMachines) script from the Azure DevTest Labs repository on GitHub.

   The script lets you import a single VM or all VMs from a specified source lab into a designated destination lab.

1. Gather the following information to use with the script:

   - `SourceDevTestLabName`: Source lab name.
   - `SourceSubscriptionId`: Source lab subscription ID.
   - `SourceVirtualMachineName`: Name of VM in source lab to import to destination lab.
   - `DestinationDevTestLabName`: Destination lab name.
   - `DestinationSubscriptionId`: Destination lab subscription ID.
   - `DestinationVirtualMachineName`: (Optional) Name of VM after import to destination lab.

   > [!NOTE]
   > When you run the script, if you don't specify a new name for the VM (`DestinationVirtualMachineName`) in the destination lab, the import uses the name of the VM in the source lab.

1. Run the script and replace the `<placeholder>` values with your information:

   ```powershell
   ./ImportVirtualMachines.ps1 -SourceSubscriptionId "<ID of the subscription that contains the source lab>"`
                            -SourceDevTestLabName "<Name of the source lab>"`
                            -SourceVirtualMachineName "<Name of the VM to import from the source lab>" `
                            -DestinationSubscriptionId "<ID of the subscription that contains the destination lab>"`
                            -DestinationDevTestLabName "<Name of the destination lab>"`
                            -DestinationVirtualMachineName "<Optional: Specify a new name for the imported VM in the destination lab>"
   ```

   > [!NOTE]
   > When you run the script, if you don't specify a source VM name (`SourceVirtualMachineName`), the process imports _all_ VMs in the source lab to the destination lab. In this case, the process uses the names of the VMs in the source lab to name the VMs in the destination lab.

## Use the REST API

It's easy to use the REST API to complete the import. The operation runs on the destination lab resource.

This approach is similar to the process for the PowerShell command. You provide the information to identify the source and destination resources. For the API call, you also need to specify the resource group for both labs. 

Follow these steps to complete the import process by calling the REST API:

1. Gather the following information to use with the API:

   - `<SourceLab>`: Source lab name.
   - `<SourceSubscriptionID>`: Source lab subscription ID.
   - `<SourceResourceGroup>`: Resource group for the source lab.
   - `<NameofVMTobeImported>`: Name of VM in source lab to import to destination lab.
   - `<DestinationLab>`: Destination lab name.
   - `<DestinationSubscriptionID>`: Destination lab subscription ID.
   - `<DestinationResourceGroup>`: Resource group for the destination lab.
   - `<NewNameForImportedVM>`: (Optional) Name of VM after import to destination lab.

1. Call the HTTP REST API as follows and replace the `<placeholder>` values with your information:

   ```http
   POST https://management.azure.com/subscriptions/<DestinationSubscriptionID>/resourceGroups/<DestinationResourceGroup>/providers/Microsoft.DevTestLab/labs/<DestinationLab>/ImportVirtualMachine?api-version=2017-04-26-preview
   {
      sourceVirtualMachineResourceId: "/subscriptions/<SourceSubscriptionID>/resourcegroups/<SourceResourceGroup>/providers/microsoft.devtestlab/labs/<SourceLab>/virtualmachines/<NameofVMTobeImported>",
      destinationVirtualMachineName: "<NewNameForImportedVM>"
   }
   ```

## Related content

- [Set policies for a lab](devtest-lab-set-lab-policy.md)
