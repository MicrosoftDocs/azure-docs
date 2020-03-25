---
title: Popular scenarios for using Azure DevTest Labs
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
ms.date: 04/01/2019
ms.author: spelluru
ms.reviewer: christianreddington,anthdela,juselph

---

# Popular scenarios for using Azure DevTest Labs
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
    - Developers [can't get more VMs](devtest-lab-set-lab-policy.md#set-virtual-machines-per-user) than they need for development
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

For more information, see [Use Azure DevTest Labs for VM and PaaS test environments](devtest-lab-test-env.md).

## Sandboxed investigations
Developers often investigate different technologies or infrastructure design. By default, all environments created with DevTest Labs are created in their own resource group. The DevTest Labs user gets only read access to those resources. However, for developers who need more control, a lab-wide setting can be updated to give [contributor rights](https://azure.microsoft.com/updates/azure-devtest-labs-view-and-set-access-rights-to-an-environment-rg/) to the originating DevTest Labs user for every environment they create.  With DevTest Labs, developers can be given contributor permission automatically to environments that they create in the lab.  This scenario allows developers to add and/or change Azure resources as they need for their development or test environments. The [cost by resource](devtest-lab-configure-cost-management.md#view-cost-by-resource) page allows Lab Owners to track the cost of each environment used for investigations.

For more information, see [Set access rights to an environment resource group](https://aka.ms/dtl-sandbox).

## Trainings, hands-on labs, and hackathons 
A lab in Azure DevTest Labs acts as a great container for transient activities like workshops, hands-on labs, trainings, or hackathons.  The service allows you to create a lab where you can provide custom templates that each trainee can use to create identical and isolated environments for training. In this scenario, DevTest Labs provides the following benefits:

- [Policies](devtest-lab-set-lab-policy.md) ensure trainees only get the number of resources, such as virtual machines, that they need.
- Pre-configured and created machines are [claimed](devtest-lab-add-claimable-vm.md) with single action from trainee.
- Labs are shared with trainees by accessing [URL for the lab](devtest-lab-faq.md#how-do-i-share-a-direct-link-to-my-lab).
- [Expiration dates](devtest-lab-add-vm.md#steps-to-add-a-vm-to-a-lab-in-azure-devtest-labs) on virtual machines ensure that machines are deleted after they are no longer needed.
- It’s easy to [delete a lab](devtest-lab-delete-lab-vm.md#delete-a-lab) and all [related resources](devtest-lab-faq.md#how-do-i-automate-the-process-of-deleting-all-the-vms-in-my-lab) when the training is over.

For more information, see [Use Azure DevTest Labs for training](devtest-lab-training-lab.md).  

## Proof of concept vs. scaled deployment
Once you decide to explore DevTest Labs, there are two general paths forward: Proof of Concept vs Scaled Deployment.  

A **scaled deployment** consists of weeks/months of reviewing and planning with an intent of deploying DevTest Labs to the entire enterprise that has hundreds or thousands of developers.

A **proof of concept** deployment focuses on a concentrated effort from a single team to establish organizational value. While it can be tempting to think of a scaled deployment, the approach tends to fail more often than the proof of concept option. Therefore, we recommend that you start small, learn from the first team, repeat the same approach with two to three additional teams, and then plan for a scaled deployment based on the knowledge gained. For a successful proof of concept, we recommend that you pick one or two teams, and identify their scenarios (dev environment vs test environments), document their current use cases, and deploy DevTest Labs.

## Next steps
Read the following articles:

- [DevTest Labs concepts](devtest-lab-concepts.md)
- [DevTest Labs FAQ](devtest-lab-faq.md)

