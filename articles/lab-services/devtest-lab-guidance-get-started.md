---
title: Get started with using Azure DevTest Labs
description: This article provides the primary scenarios for using Azure DevTest Labs and two general paths to start using the service in your organization. 
services: devtest-lab,virtual-machines,lab-services
documentationcenter: na
author: spelluru
manager: femila

ms.service: lab-services
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/29/2019
ms.author: spelluru
ms.reviewer: christianreddington,anthdela,juselph

---

# Get started with using Azure DevTest Labs
Depending on the needs of an enterprise, DevTest Labs can be configured to meet different requirements.  This article discusses the popular scenarios. Each scenario covers benefits brought by using DevTest Labs and resources to use to implement those scenarios.  

- Developer desktops
- Test environments
- Training sessions, hands-on labs, and hackathons
- Sandboxed investigations
- Classroom labs

## Developer desktops
Developers often have different requirements for development machines for different projects. With DevTest Labs, developers can have access to on-demand virtual machines that are configured to suit their most common scenarios. DevTest Labs provides the following benefits:

- Organizations can provide common development machines ensuring consistency across teams.
- Developers can quickly provision their development machines on demand or [claim an existing pre-configured machine](devtest-lab-add-claimable-vm.md).
- Developers can provision resources in a self-service way without needing subscription-level permissions.
- IT or admins can [pre-define the networking topology](devtest-lab-configure-vnet.md) and developers can directly use it in a simple and intuitive way without requiring any special access.
- Developers can easily [customize](devtest-lab-add-vm.md#add-an-existing-artifact-to-a-vm) their development machines as needed.
- Administrators can control costs by ensuring that:
    - Developers [cannot get more VMs](devtest-lab-set-lab-policy.md#set-virtual-machines-per-user) than they need for development
    - [VMs are shut down](devtest-lab-set-lab-policy.md#set-auto-shutdown) when not in use
    - Only [allowing a subset of VM instance sizes](devtest-lab-set-lab-policy.md#set-allowed-virtual-machine-sizes) for the specific labs
    - [Managing cost targets and notifications](devtest-lab-configure-cost-management.md) for each lab.

For further reading, see [Use Azure DevTest Labs for developers](devtest-lab-developer-lab.md). 

## Test environments
Creating and managing test environments across an enterprise can require a significant effort. With DevTest Labs, test environments can be easily created, updated, or duplicated. It allows teams to access a fully configured environment when it’s needed. In this scenario, DevTest Labs provides the following benefits:

- Organizations can provide common testing environments ensuring consistency across teams.
- Testers can test the latest version of their application by quickly provisioning Windows and Linux environments by using reusable templates.
- Administrators can connect the lab to Azure DevOps to enable DevOps scenarios
- Lab Owners can control costs by ensuring that:
    - [VMs in environments are shut down](devtest-lab-set-lab-policy.md#set-auto-shutdown) when not in use
    - Only [allowing a subset of VM instance sizes for](devtest-lab-set-lab-policy.md#set-allowed-virtual-machine-sizes) the specific labs
    - [Managing cost targets and notifications](devtest-lab-configure-cost-management.md) for each lab.

For further information, see Use Azure DevTest Labs for VM and PaaS test environments.



## Next steps
See the next article in this series: [Scale up your DevTest Labs deployment](devtest-lab-guidance-scale.md)
