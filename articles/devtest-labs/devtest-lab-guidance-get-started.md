---
title: Popular scenarios for using Azure DevTest Labs
description: This article describes primary Azure DevTest Labs scenarios, and how an organization can begin exploring DevTest Labs.
ms.topic: conceptual
ms.date: 01/31/2022
ms.reviewer: christianreddington,anthdela,juselph
---

# Azure DevTest Labs scenarios

You can configure Azure DevTest Labs for many different scenarios. This article discusses DevTest Labs features and deployment procedures for popular development, test, and training scenarios. Here are some common DevTest Labs scenarios:

- Developers need many, sometimes different virtual machines (VMs) and environments as they iterate on apps.
- Testers use many identical or different VMs and environments for performance testing and sandboxed investigations.
- Teachers and trainers periodically need new classroom, lab, and hackathon VMs and environments.

The following sections describe how DevTest Labs supports these scenarios while helping lab owners and administrators control lab costs and access.

## Lab creation

Labs are the starting point in DevTest Labs. Once you create a lab, you can:

- Add lab users.
- Set policies to control lab costs and access.
- Define images and formulas for VMs and environments that lab users can create quickly.
- Connect the lab to Azure DevOps to enable automated processes.
- Link the lab to public and private Git repositories for access to artifacts and templates.

To learn how to create a lab in the Azure portal, see [Create a lab in Azure DevTest Labs](devtest-lab-create-lab.md).

You can automate lab creation, including custom settings, by using a reusable *Azure Resource Manager (ARM) template*. For more information, see [Create a lab by using a Resource Manager template](./devtest-lab-faq.yml#how-do-i-create-a-lab-from-a-resource-manager-template-).

## Development and test VMs

Developers and testers might need many identical machines, or different machines for different projects and tasks. DevTest Labs users can create, configure, and access virtual machines (VMs) on demand to meet their needs. Common development and test VM images ensure consistency across teams.

In DevTest Labs, developers and testers can:

- Quickly provision VMs on demand, or [claim existing preconfigured VMs](devtest-lab-add-claimable-vm.md).
- Self-service their own VMs without needing subscription-level permissions.
- Directly use [virtual networks](devtest-lab-configure-vnet.md) that lab owners and admins set up, without needing special permissions.
- Easily customize their VMs by [adding artifacts](devtest-lab-add-vm.md#add-artifacts-after-installation) as needed.

### Create VMs

Lab users can create lab VMs in minutes by choosing from a wide variety of ready-made Azure Marketplace images. To learn about making selected Markeplace images available for lab users, see [Configure Azure Marketplace images](devtest-lab-configure-marketplace-images.md).

Lab owners can also install all needed software on a VM, save the VM as a *custom image*, and make the image available to lab users for creating VMs. For more information, see [Create a custom image](devtest-lab-create-custom-image-from-vm-using-portal.md).

You can use an *image factory* to automatically build and distribute custom images on a regular basis. This configuration-as-code solution eliminates the need to manually maintain the images by keeping the base OS and components up to date. For more information, see [Create a custom image factory in Azure DevTest Labs](image-factory-create.md).

### Use reusable formulas for VMs

A DevTest Labs *formula* is a list of default property values for VMs. A lab owner can create a formula in the lab by picking a VM image, a VM size based on CPU and RAM, and a virtual network. Lab users can see the formula and use it to create VMs. For more information, see [Manage DevTest Labs formulas](devtest-lab-manage-formulas.md).

### Use artifacts for VM customization

Lab users can add *artifacts* to configure their lab VMs. Artifacts can be:

- Tools to install on the VM, like agents, Fiddler, or Visual Studio.
- Actions to run on the VM, like cloning a repo.
- Applications to test.

Many artifacts are available out-of-the-box. If you need more customization, you can create *custom artifacts*. You store the artifacts in a private Git repo you connect to your lab, so all lab users can add the artifacts to VMs. For more information, see [Create custom artifacts for DevTest Labs](devtest-lab-artifact-author.md) and [Add an artifact repository to a lab](add-artifact-repository.md).

## Multi-VM environments

Many development and test scenarios require multi-VM *environments* equipped with platform-as-a-service (PaaS) resources. Examples include Azure Web Apps, SharePoint farms, and Service Fabric clusters. Creating and managing environments across an enterprise can require significant effort.

With DevTest Labs, teams can easily create, update, or duplicate multi-VM environments. Developers can use fully configured environments to develop and test the latest versions of their apps. DevTest Labs environments ensure consistency across teams.

By using reusable ARM templates, you can:

- Repeatedly deploy multiple preconfigured VMs in a consistent state.
- Define infrastructure and configuration for Windows or Linux environments.
- Provision Azure PaaS resources and track their costs.

For more information, see [Use ARM templates to create DevTest Labs environments](devtest-lab-create-environment-from-arm.md).

## Classroom, training, and hackathon labs

DevTest Labs is perfect for transient activities like workshops, hands-on labs, training, or hackathons. In this scenario:

- Training leaders or lab owners can use custom templates to create identical, isolated VMs or environments.
- Trainees can [access the lab by using a URL](/azure/devtest-labs/devtest-lab-faq#how-do-i-share-a-direct-link-to-my-lab).
- Trainees can claim already-created, preconfigured machines with a single action.
- Lab owners can control lab costs and lifespan by configuring policies, setting VM expiration dates, and deleting VMs or labs.

## Lab policies and administration

Lab owners and administrators can:
- Use configuration and policies to manage labs.
- Link labs to public and private artifact and template repositories.
- Connect labs to Azure DevOps to enable DevOps scenarios.

For more information, see [Define lab policies](devtest-lab-set-lab-policy.md).

### Add a virtual network to a lab

DevTest Labs creates each lab in a new virtual network. You can add another virtual network configured by using Azure ExpressRoute or site-to-site VPN to your lab. That virtual network is then available for creating lab VMs. For more information, see [Configure a virtual network in Azure DevTest Labs](devtest-lab-configure-vnet.md). 

You can also add an Active Directory domain join artifact to join VMs to an Active Directory domain at creation. This artifact applies only to domains.

### Add users to labs


Owners can add users to a lab by using the Azure portal or a PowerShell script. For more information, see [Add lab owners, contributors, and users in Azure DevTest Labs](devtest-lab-add-devtest-user.md). Lab users don't need an Azure account, as long as they have a [Microsoft account](./devtest-lab-faq.yml).

Lab users can access the lab by using a link. For more information about how to get and share the link to the lab, see [Get a link to the lab](./devtest-lab-faq.yml#how-do-i-share-a-direct-link-to-my-lab-).

Lab users can't see VMs that other users create.

### Give users Contributor rights to resources

By default, DevTest Labs creates environments in their own resource groups, and DevTest Labs users get only read access to those environments. With read-only access, users can't add or change resources in their environments. But developers often need to investigate different technologies or infrastructure designs.

Lab owners can allow users more control by giving them contributor rights to the environments they create. Contributors can add or change Azure resources as necessary in their development or test environments. For more information, see [Configure environment user rights](devtest-lab-create-environment-from-arm#configure-environment-user-rights).

### Configure policies to control costs

To monitor and control costs, lab administrators and owners can:

- Set policies to [limit the number of VMs per user](devtest-lab-set-lab-policy.md#set-virtual-machines-per-user).
- Configure [auto-shutdown](devtest-lab-set-lab-policy.md#set-auto-shutdown) and auto-start policies to stop and restart all VMs at particular times of day. VM auto-shutdown doesn't apply to PaaS resources in environments.
- Allow only certain [VM instance sizes](devtest-lab-set-lab-policy.md#set-allowed-virtual-machine-sizes) in the lab.
- [Manage cost targets and notifications](devtest-lab-configure-cost-management.md) for the lab.
- Use the [cost by resource](devtest-lab-configure-cost-management.md#view-cost-by-resource) page to track costs of environments.

### Delete labs and VMs

Lab owners can also manage costs by deleting labs and VMs when they're no longer needed.

- Set [expiration dates](devtest-lab-add-vm.md#create-and-add-virtual-machines) on VMs.
- [Delete labs](devtest-lab-delete-lab-vm.md#delete-a-lab) and all [related resources](/azure/devtest-labs/devtest-lab-faq#how-do-i-automate-the-process-of-deleting-all-the-vms-in-my-lab).
- [Delete all lab VMs by running a single PowerShell script](./devtest-lab-faq.yml#how-do-i-automate-the-process-of-deleting-all-the-vms-in-my-lab-).

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

- [DevTest Labs concepts](devtest-lab-concepts.md)
- [DevTest Labs FAQ](devtest-lab-faq.yml)

[!INCLUDE devtest-lab-try-it-out]
