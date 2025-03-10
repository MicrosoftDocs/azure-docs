---
title: What is Azure DevTest Labs?
description: Learn how DevTest Labs makes it easy to create, manage, and monitor Azure virtual machines.
ms.topic: overview
ms.author: rosemalcolm
author: RoseHJM
ms.date: 09/30/2023
ms.custom: UpdateFrequency2
---

# What is Azure DevTest Labs?

[Azure DevTest Labs](https://azure.microsoft.com/services/devtest-lab) is a service for easily creating, using, and managing infrastructure-as-a-service (IaaS) virtual machines (VMs) in labs. Labs offer preconfigured bases and artifacts for creating VMs.

Lab owners can create preconfigured VMs that have tools and software lab users need. Lab users can claim preconfigured VMs, or create and configure their own VMs. Lab policies and other methods track and control lab usage and costs.

### Common DevTest Labs scenarios

Common [DevTest Labs scenarios](devtest-lab-guidance-get-started.md) include VMs for development, testing, and classroom or training labs. DevTest Labs promotes efficiency, consistency, and cost control by keeping all resource usage within the lab context.

## Custom VM bases, artifacts, and templates

DevTest Labs can use custom images, formulas, artifacts, and templates to create and manage labs, and VMs. The [DevTest Labs public GitHub repository](https://github.com/Azure/azure-devtestlab) has many ready-to-use VM artifacts and ARM templates for creating labs, or sandbox resource groups. Lab owners can also create [custom images](devtest-lab-create-custom-image-from-vm-using-portal.md), [formulas](devtest-lab-manage-formulas.md), and ARM templates to use for creating and managing labs, [VMs](devtest-lab-use-resource-manager-template.md#view-edit-and-save-arm-templates-for-vms).

Lab owners can store artifacts and ARM templates in private Git repositories, and connect the [artifact repositories](add-artifact-repository.md) and [template repositories](devtest-lab-use-resource-manager-template.md#add-template-repositories-to-labs) to their labs so lab users can access them directly from the Azure portal. Add the same repositories to multiple labs in your organization to promote consistency, reuse, and sharing.

## Development, test, and training scenarios

DevTest Labs users can quickly and easily create [IaaS VMs](devtest-lab-add-vm.md) from preconfigured bases, artifacts, and templates. Developers, testers, and trainers can:

- Create Windows and Linux training and demo environments, or sandbox resource groups for exploring Azure, by using reusable ARM templates and artifacts.
- Test app versions and scale up load testing by creating multiple test agents.
- Use the [Azure CLI](devtest-lab-vmcli.md) command-line tool to manage VMs.

## Lab policies and procedures to control costs

Lab owners can take several measures to reduce waste and control lab costs.

- [Set lab policies](devtest-lab-set-lab-policy.md) like allowed number or sizes of VMs per user or lab.
- [Set auto-shutdown](devtest-lab-auto-shutdown.md) and [auto-startup](devtest-lab-auto-startup-vm.yml) schedules to shut down and start up lab VMs at specific times of day.
- [Monitor costs](devtest-lab-configure-cost-management.md) to track lab and resource usage and estimate trends.
- [Set VM expiration dates](devtest-lab-use-resource-manager-template.md#set-vm-expiration-date), or [delete labs or lab VMs](devtest-lab-delete-lab-vm.md) when no longer needed.

## Next steps

- [DevTest Labs concepts](devtest-lab-concepts.md)
- [Quickstart: Create a lab in Azure DevTest Labs](devtest-lab-create-lab.md)

[!INCLUDE [devtest-lab-try-it-out](../../includes/devtest-lab-try-it-out.md)]
