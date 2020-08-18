---
title: About Azure DevTest Labs | Microsoft Docs
description: Learn how DevTest Labs can make it easy to create, manage, and monitor Azure virtual machines
ms.topic: article
ms.date: 06/20/2020
---

# About Azure DevTest Labs
Azure DevTest Labs enables developers on teams to efficiently self-manage virtual machines (VMs) and PaaS resources without waiting for approvals.

DevTest Labs creates labs consisting of pre-configured bases or Azure Resource Manager templates. These have all the necessary tools and software that you can use to create environments. You can create environments in a few minutes, as opposed to hours or days.

By using DevTest Labs, you can test the latest versions of your applications by doing the following tasks:

- Quickly provision Windows and Linux environments by using reusable templates and artifacts.
- Easily integrate your deployment pipeline with DevTest Labs to provision on-demand environments.
- Scale up your load testing by provisioning multiple test agents and create pre-provisioned environments for training and demos.

> [!VIDEO https://channel9.msdn.com/Blogs/Azure/What-is-Azure-DevTest-Labs/player]

## Capabilities
DevTest Labs provides the following capabilities to developers working with VMs:

- Create VMs quickly by following fewer than five simple steps.
- Choose from a curated list of VM bases that are configured, approved, and authorized by the team lead or central IT.
- Create VMs from pre-created custom images that have all the software and tools already installed. 
- Create VMs from formulas that are essentially custom images combined with the latest builds of the software that's installed when the VMs are created. 
- Install artifacts that are extensions deployed on VMs after they're provisioned.
- Set auto-shutdown and auto-start schedules on VMs.
- Claim a pre-created VM without going through the creation process.

DevTest Labs provides the following capabilities to developers working with PaaS environments:

- Use Resource Manager to quickly create PaaS environments by following fewer than three simple steps.
- Choose from a curated list of Resource Manager templates, which are configured, and authorized by the team lead or central IT.
- Spin up an empty resource group (sandbox) by using a Resource Manager template to explore Azure within the context of a lab.

DevTest Labs also enables central IT to control wastes, optimize costs on resources, and stay within budgets by doing the following tasks:  

- Setting auto-shutdown and auto-start schedules on VMs.
- Setting policies on the number of VMs that users can create.
- Setting policies on VMs' sizes and gallery images that users choose from.
- Tracking costs and setting targets on labs.
- Getting notified on high projected costs for labs so you can take necessary actions.

DevTest Labs provides the following benefits in creating, configuring, and managing environments in the cloud.

## Cost control and governance
DevTest Labs makes it easier to control costs by allowing you to do the following tasks:

- [Set policies on your labs](devtest-lab-set-lab-policy.md), such as number of VMs per user or per lab. 
- Create [policies to automatically shut down](devtest-lab-set-lab-policy.md) and start VMs.
- Track costs on VMs and PaaS resources spun up inside labs to stay within [your budget](devtest-lab-configure-cost-management.md).
- Stay within the context of your labs so you don't spin up resources outside of them.

## Quickly get to ready-to-test
DevTest Labs lets you create pre-provisioned environments equipped with everything your team needs to develop and test applications. Just [claim the environments](devtest-lab-add-claimable-vm.md) where the last good build of your application is installed and start working. Or use containers for even faster, leaner environment creation.

## Create once, use everywhere
Capture and share PaaS [environment templates](devtest-lab-create-environment-from-arm.md) and [artifacts](add-artifact-repository.md) within your team or organization—all in source control—to easily create developer and test environments.

## Worry-free self-service
DevTest Labs enables your developers and testers to quickly and easily [create IaaS VMs](devtest-lab-add-vm.md) and [PaaS resources](devtest-lab-create-environment-from-arm.md) by using a set of pre-configured resources.

## Use IaaS and PaaS resources 
Developers can also spin up PaaS resources, such as Azure Service Fabric clusters, the Web Apps feature of Azure App Service, and SharePoint farms, by using Resource Manager templates. To get started on PaaS in labs, use the templates from the [public environment repository](devtest-lab-configure-use-public-environments.md) or [connect the lab to your own Git repository](devtest-lab-create-environment-from-arm.md#configure-your-own-template-repositories). You can also track costs on these resources to stay within your budget.

## Integrate with your existing toolchain
Use pre-made plug-ins or the API to provision development/testing environments directly from your preferred [continuous integration (CI) tool](devtest-lab-integrate-ci-cd.md), integrated development environment (IDE), or automated release pipeline. You can also use the comprehensive command-line tool.

## Next steps
See the following articles:

- To learn more about DevTest Labs, see [DevTest Labs concepts](devtest-lab-concepts.md).
- For a walkthrough with step-by-step instructions, see [Tutorial: Set up a lab by using Azure DevTest Labs](tutorial-create-custom-lab.md).