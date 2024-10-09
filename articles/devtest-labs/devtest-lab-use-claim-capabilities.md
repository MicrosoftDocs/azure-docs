---
title: Use claim capabilities
description: Learn about different scenarios for using claim/unclaim capabilities of Azure DevTest Labs
ms.topic: conceptual
ms.author: rosemalcolm
author: RoseHJM
ms.date: 06/26/2020
ms.custom: UpdateFrequency2
---

# Use claim capabilities in Azure DevTest Labs
The Azure DevTest Labs service improves effectiveness and efficiency of developers and testers. This article focuses on the ability to claim or unclaim virtual machines in Azure DevTest Labs. It also lists various ways that this feature improves the user experience. Before looking at different scenarios where this feature may be used, let’s look at what **claiming** is and how it works.

## Claimable machines
A claimable machine is a virtual machine (VM) that's created in a lab without an owner. Once the machine is claimed, the user has a full range of options for that VM. When a user claims a machine, a few changes are made. The VM is moved from the **Claimable virtual machines** list to the **My virtual machines** list in the Azure portal. 

The user can connect to the VM, customize artifacts, restart, stop, or unclaim the machine. There are a couple of ways to make a VM claimable:

- Create a machine and unclaim it so that it moves to the claimable pool. 
- Create a VM and place in the shared pool using [advanced settings](https://azure.microsoft.com/updates/azure-devtest-labs-claim-lab-vms-from-a-shared-pool/).

There are two cases where the claim/un-claim capabilities can be used effectively. The first case requires more forethought and planning, to be designed and executed properly. And, the second is more situational. The following are some examples of the different cases.

## Designed use of claimable machines

- **Software development / testing:** Allow developers or testers to be more productive by having configured machines ready and in an unclaimed state. Having a set of VMs with different configurations, necessary tools, and with the latest code allows users to claim a VM and begin work without having to spend the time to set up a machine. Before the VMs are claimed, the machines are provisioned but are shutdown minimizing the cost of having machines that are used less often. When the VMs are needed, a user simply claims the VM, which starts the machine. The unclaim option isn't as useful in this case since creating a new VM is often easier and cheaper.
- **Classroom/Labs:** Have VMs pre-configured for a class or a lab so that students can immediately connect to a machine using the Azure portal.  Once a student claims a VM, the lab ensures that no one can claim the same machine. Automating this process ensures that the required number of machines with the specified environment are available. If students do not show up or are running late, the unclaimed machines can be kept available until the session is over with minimal cost. The unclaim option isn’t as effective in this scenario since the VM is in an unknown state when the previous user is done.
- **Demonstrations:** Use machines for demonstrations, where the machines in the lab are set up with specific environments. This capability is useful where multiple people may be giving a demonstration at the same time or at random times, such as at a conference. The unclaim option may be useful in this situation as the demo shouldn’t change the state of the machine, allowing users to return a VM back to the claimable pool for the next demonstration. With the unclaimed machine being de-provisioned and incurring minimal cost, VMs can be left in the lab for longer time periods.
- **Temporary/Contract workers:** Allow users to use a machine. When they leave, they return the VM to the claimable pool without loss of data. With the VM unclaimed, another user can claim the VM and continue or review the machine for additional information.
- **In General:** The ability to have a sole source automatically configure and deploy VMs, on a specific cadence, is useful in many different situations. There are several different situations where the claim/unclaim feature helps users be more efficient by having an automated process to build the VMs in an unclaimed state with a set configuration. The configuration(s) may include different operating systems, languages, disks, or [other software (artifacts)](devtest-lab-artifact-author.md) depending on your needs. The ability to claim a VM from the lab allows the lab user to get a properly configured system without spending the time or effort in configuring the machine. The lab manager could use the claimed state of the VMs to improve the number of machines generated, clean up machines, and determine priority of configurations. The [Image factory](image-factory-create.md) is a good example of an automated process to build VMs and images for multiple labs. The scripts could be modified to execute any of the following situations with the appropriate changes or be used as a reference for creating a custom system.

## Situational use of claimable machines

- Use the claim/un-claim capability that allows users to pass control of machines from one to another and not having to know explicitly who will be picking up the machine next.
- Development, testing and debugging of a scenario where a specific machine configuration can reproduce a bug then the machine can be unclaimed allowing another developer can claim the machine and continue the work. This feature is especially useful as more people are working remotely in different areas of the world. 
- Team members can work with a single environment. For example, you can manually set up a complex environment that can’t be automated or create resources that can only handle modifications for a single input like images. In the past, this problem was dealt with by having a dedicated machine up and running. The claimable feature is an improvement over the manual process by having built-in user access control,and  visual identification when available. When unclaimed, the VM is de-provisioned to reduce costs.
- Have a data disk that's attached to a VM. Each disk up to ~ 1 TB of data allows a large volume of data to be passed without having to copy or duplicate the data. The VM would be  initially created with an attached disk that had  the large volume of data.  Any user could  then claim the machine and access the data. When done, unclaim the VM to allow other users to the machine.

There are some caveats to using claimable machines, most commonly around gaining access to the machine. If the machine is domain joined, then the user claiming the machine will need to have already been granted access, usually it's done by granting access to a group that encompasses all users in the lab when the VM is created. If the machine isn’t domain joined, the **Reset VM Password** artifact in the public repository will need to be run to add the user as an administrator.  Artifacts can be applied even after the machine has been started or claimed.

## Next steps
See the following article: [Create and manage claimable VMs in Azure DevTest Labs](devtest-lab-add-claimable-vm.md)
