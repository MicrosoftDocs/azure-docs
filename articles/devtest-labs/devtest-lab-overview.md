---
title: 'Azure DevTest Labs overview: Features, scenarios, and benefits'
description: Azure DevTest Labs enables fast, cost-effective creation and management of Azure virtual machines for development and testing. Discover key features and benefits.
ms.topic: overview
ms.author: rosemalcolm
author: RoseHJM
ms.date: 05/29/2025
ms.custom:
  - UpdateFrequency2
  - ai-gen-docs-bap
  - ai-gen-title
  - ai-seo-date:05/29/2025
  - ai-gen-description
# customer intent: As a business decision-maker, I want to understand how Azure DevTest Labs can help my team quickly create and manage development and testing environments, so that I can evaluate its value for our workflows.
---

# What is Azure DevTest Labs?

Azure DevTest Labs is a service that enables developers and testers to quickly create and manage Azure virtual machines for development and testing. With a self-service model, built-in cost control, and automation features, DevTest Labs helps teams efficiently provision environments, reduce costs, and streamline workflows. 

DevTest Labs resources are organized into Labs, which provide preconfigured bases and artifacts for creating VMs. Lab owners create preconfigured VMs with the tools and software lab users need. Lab users claim preconfigured VMs, or create and set up their own VMs. Lab policies and other methods track and control lab usage and costs.

## Common DevTest Labs scenarios

Common [DevTest Labs scenarios](devtest-lab-guidance-get-started.md) include VMs for development, testing, and classroom or training labs. DevTest Labs helps you work efficiently, consistently, and control costs by keeping all resource usage within the lab context.

Use DevTest Labs when you need:

- Fast, repeatable VM provisioning
- Cost control for dev/test workloads
- Integration with CI/CD pipelines
- Lightweight governance for distributed teams

## How does DevTest Labs work?
DevTest Labs is built on Azure Resource Manager (ARM) and uses the Azure portal to create and manage labs, VMs, and other resources. Lab owners can create labs with preconfigured bases, artifacts, and templates. Lab users can claim VMs or create their own VMs from the lab's resources.

1. Create a Lab
   From the Azure portal, search for "DevTest Labs" and create a new lab. You define basic settings like lab name, region, and autoshutdown policies.

1. Configure Policies
   Set limits on VM sizes, number of VMs per user, and total VMs. These policies help enforce governance and budget constraints.

1. Add Custom Images and Artifacts
   Upload your own VM images or use Azure Marketplace images. Attach artifacts to automate software installation and configuration.

1. Provision VMs
   Users can create VMs from the lab's templates. These VMs inherit the lab's policies and can be managed individually or as part of a lab.

1. Monitor Usage
   Use built-in dashboards to track cost trends and resource usage, helping teams stay within budget and optimize resource allocation.

## Custom VM bases, artifacts, and templates

DevTest Labs uses custom images, formulas, artifacts, and templates to create and manage labs and VMs. The [DevTest Labs public GitHub repository](https://github.com/Azure/azure-devtestlab) has many ready-to-use VM artifacts and ARM templates for creating labs or sandbox resource groups. Lab owners create [custom images](devtest-lab-create-custom-image-from-vm-using-portal.md), [formulas](devtest-lab-manage-formulas.md), and ARM templates to create and manage labs and [VMs](devtest-lab-use-resource-manager-template.md#view-edit-and-save-arm-templates-for-vms).

Lab owners store artifacts and ARM templates in private Git repositories and connect the [artifact repositories](add-artifact-repository.md) and [template repositories](devtest-lab-use-resource-manager-template.md#add-template-repositories-to-labs) to their labs so lab users can access them directly from the Azure portal. Add the same repositories to multiple labs in your organization to promote consistency, reuse, and sharing.

## Lab policies and procedures to control costs

Lab owners can take several steps to reduce waste and control lab costs.

- [Set lab policies](devtest-lab-set-lab-policy.md), like the allowed number or size of VMs per user or lab.
- [Set autoshutdown](devtest-lab-auto-shutdown.md) and [autostartup](devtest-lab-auto-startup-vm.yml) schedules to shut down and start up lab VMs at specific times of day.
- [Monitor costs](devtest-lab-configure-cost-management.md) to track lab and resource usage and estimate trends.
- [Set VM expiration dates](devtest-lab-use-resource-manager-template.md#set-vm-expiration-date) or [delete labs or lab VMs](devtest-lab-delete-lab-vm.md) when you no longer need them.


## Next steps

- [DevTest Labs concepts](devtest-lab-concepts.md)
- [Quickstart: Create a lab in Azure DevTest Labs](devtest-lab-create-lab.md)

[!INCLUDE [devtest-lab-try-it-out](../../includes/devtest-lab-try-it-out.md)]
