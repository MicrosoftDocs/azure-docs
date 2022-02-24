---
title: What is Azure DevTest Labs?
description: Learn how DevTest Labs makes it easy to create, manage, and monitor Azure virtual machines and environments.
ms.topic: overview
ms.date: 02/22/2022
---

# What is Azure DevTest Labs?

[Azure DevTest Labs](https://azure.microsoft.com/services/devtest-lab) is a service for easily creating, using, and managing infrastructure-as-a-service (IaaS) virtual machines (VMs) and platform-as-a-service (PaaS) environments in labs. Labs offer preconfigured bases and artifacts for creating VMs, and Azure Resource Manager (ARM) templates for creating environments like Azure Web Apps or SharePoint farms. DevTest Labs promotes efficiency, consistency, and cost control by keeping all resource usage within the lab context.

[Common DevTest Labs scenarios](devtest-lab-guidance-get-started.md) include development VMs, test environments, and classroom or training labs.

Lab owners can select preconfigured VM bases, ARM templates, and artifacts that provide the tools and software their lab users need. Lab users can create VMs and environments, and configure resources and artifacts for their own VMs and environments. Lab owners can monitor and control resource usage and costs.

## Custom VM images, artifacts, and templates

DevTest Labs can use custom images, formulas, artifacts, and templates to create and manage labs, VMs, and environments. You can store these items under source control in Git repositories, and connect the repositories to your labs so users can access them directly from the portal.

The [DevTest Labs public GitHub repository](https://github.com/Azure/azure-devtestlab) has many ready-to-use VM artifacts, and ARM templates for creating labs, environments, or sandbox resource groups. Lab owners can also create [custom images](devtest-lab-create-custom-image-from-vm-using-portal.md), [formulas](devtest-lab-manage-formulas.md), and ARM templates for lab [VMs](devtest-lab-use-resource-manager-template.md#view-edit-and-save-arm-templates-for-vms) and [environments](devtest-lab-create-environment-from-arm.md). You can [store the templates in private Git repositories](devtest-lab-use-resource-manager-template.md#store-arm-templates-in-git-repositories), and connect the private [template repositories](devtest-lab-use-resource-manager-template.md#add-template-repositories-to-labs) or [artifact repositories](add-artifact-repository.md) to DevTest Labs so that those templates and artifacts also appear in the DevTest Labs portal.

## Development, test, and training scenarios

In DevTest Labs, developers and testers can quickly and easily create [IaaS VMs](devtest-lab-add-vm.md) and [PaaS environments](devtest-lab-create-environment-from-arm.md) from preconfigured VM bases, artifacts, and ARM templates. Developers and testers can:

- Quickly create Windows and Linux environments by using reusable templates and artifacts.
- Easily integrate deployment pipelines with DevTest Labs to create environments on demand.
- Create development or testing environments directly from [continuous integration and deployment (CI/CD) tools](devtest-lab-integrate-ci-cd.md), integrated development environments (IDEs), or automated release pipelines.
- Scale up load testing by creating multiple test agents and environments.
- Test the latest versions of your applications.
- Use environments for training and demos.
- Use containers for faster, leaner environment creation.
- Use the Azure CLI command-line tool to create environments.

## Lab policies and settings to control costs

Lab owners can take several measures to reduce waste and control lab costs.

- [Set lab policies](devtest-lab-set-lab-policy.md) like allowed number or sizes of VMs per user or lab.
- Set [auto-shutdown](devtest-lab-auto-shutdown.md) and [auto-startup](devtest-lab-auto-startup-vm.md) schedules to shut down and start up all lab VMs at specific times of day.
- [View and configure cost management](devtest-lab-configure-cost-management.md) to track lab and resource costs and estimate trends.
- [Set VM expiration dates](devtest-lab-use-resource-manager-template.md#set-vm-expiration-date) when you create VMs.
- [Delete labs or lab VMs](devtest-lab-delete-lab-vm.md) when you're finished with them.

## Next steps

- [DevTest Labs concepts](devtest-lab-concepts.md)
- [Quickstart: Create a lab in Azure DevTest Labs](devtest-lab-create-lab.md)
- [DevTest Labs FAQ](devtest-lab-faq.yml)

