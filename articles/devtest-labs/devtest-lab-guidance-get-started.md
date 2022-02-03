---
title: Popular scenarios for using Azure DevTest Labs
description: This article describes primary scenarios for using Azure DevTest Labs, and how an organization can begin exploring DevTest Labs.
ms.topic: conceptual
ms.date: 01/31/2022
ms.reviewer: christianreddington,anthdela,juselph
---

# Azure DevTest Labs scenarios

You can configure DevTest Labs for many different scenarios. This article discusses resources and deployment steps for popular DevTest Labs scenarios, including:

- Creating and configuring virtual machines (VMs) for developers and testers
- Creating preconfigured environments for development, test, and sandboxed investigations
- Using DevTest Labs for hands-on training, classroom labs, and hackathons
- Controlling costs and access with lab policies

## Create development and test VMs

Developers need different development and test machines for different projects. DevTest Labs users can create, configure, and access virtual machines (VMs) on demand to meet their needs. Common development and test machines ensure consistency across teams.

Developers and testers can:

- Quickly provision VMs on demand, or [claim existing pre-configured VMs](devtest-lab-add-claimable-vm.md).
- Self-service VMs without needing subscription-level permissions.
- Directly use [networking topology](devtest-lab-configure-vnet.md) that lab owners and admins set up, without needing special permissions.
- Easily customize their VMs by [adding artifacts](devtest-lab-add-vm.md#add-artifacts-after-installation) as needed.

## Create development and test environments

Creating and managing development or test environments across enterprises can require significant effort. With DevTest Labs, teams can easily create, update, or duplicate environments. Lab users can use the fully configured environments to develop and test the latest versions of their applications.

Users can quickly provision Windows and Linux environments by using reusable templates. DevTest Labs environments ensure consistency across teams.

## Hold trainings, hands-on labs, and hackathons

In DevTest Labs, you can create labs to use for transient activities like workshops, hands-on labs, training, or hackathons.

Trainees can:

- Access the lab by using a [URL for the lab](/azure/devtest-labs/devtest-lab-faq#how-do-i-share-a-direct-link-to-my-lab).
- Claim already-created, preconfigured machines with a single action.
- Use custom templates to create identical, isolated VMs or environments.

## Control costs, access, and contributor rights

To control costs, lab administrators and owners can:

- Set policies to [ensure that users get only the number of VMs they need](devtest-lab-set-lab-policy.md#set-virtual-machines-per-user).
- Configure [auto-shutdown policies](devtest-lab-set-lab-policy.md#set-auto-shutdown) to shut down VMs when not in use.
- Allow only certain [VM instance sizes](devtest-lab-set-lab-policy.md#set-allowed-virtual-machine-sizes) in the lab.
- [Manage cost targets and notifications](devtest-lab-configure-cost-management.md) for the lab.
- Use the [cost by resource](devtest-lab-configure-cost-management.md#view-cost-by-resource) page to track costs of environments.
- Set [expiration dates](devtest-lab-add-vm.md#create-and-add-virtual-machines) on VMs to ensure they're deleted when no longer needed.
- [Delete labs](devtest-lab-delete-lab-vm.md#delete-a-lab) and all [related resources](/azure/devtest-labs/devtest-lab-faq#how-do-i-automate-the-process-of-deleting-all-the-vms-in-my-lab) when no longer needed.

Lab owners and administrators can also:

- Connect labs to Azure DevOps to enable DevOps scenarios.
- Give users contributor rights to resources

  By default, DevTest Labs creates environments in their own resource groups, and DevTest Labs users get only read access to those environments. But developers often need to investigate different technologies or infrastructure designs.

  Lab owners can allow users more control over their environments by giving them contributor rights to environments they create. With contributor rights, users can add or change Azure resources as necessary for their development or test environments. For more information, see [Configure environment user rights](devtest-lab-create-environment-from-arm#configure-environment-user-rights).

## Proof of concept and scaled deployments

To start exploring DevTest Labs, organizations can use proof of concept and scaled deployments.

- Proof of concept uses a concentrated effort from a single team to establish organizational value.
- A scaled deployment uses weeks or months of reviewing and planning to deploy DevTest Labs to an enterprise with hundreds or thousands of developers.

While an immediate scaled deployment sounds tempting, this approach often fails without a proof of concept. It's best to start small, learn from a single team, repeat the same approach with a few more teams, and then plan a scaled deployment based on the knowledge gained.

For a successful proof of concept:

1. Pick one or two teams.
1. Identify the teams' scenarios, such as developer VMs or test environments.
1. Document current use cases.
1. Deploy DevTest Labs to fulfill the teams' scenarios and use cases.

## Next steps
Read the following articles:

- [DevTest Labs concepts](devtest-lab-concepts.md)
- [DevTest Labs FAQ](devtest-lab-faq.yml)
