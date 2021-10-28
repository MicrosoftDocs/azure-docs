---
title: What is Azure DevTest Labs?
description: Learn how DevTest Labs can make it easy to create, manage, and monitor Azure virtual machines
ms.topic: overview
ms.date: 10/20/2021
---

# What is Azure DevTest Labs?
Azure DevTest Labs is a service that enables developers to efficiently self-manage virtual machines (VMs) and Platform as a service (PaaS) resources without waiting for approvals. DevTest Labs creates labs consisting of pre-configured bases or Azure Resource Manager templates. These labs have all the necessary tools and software that you can use to create environments.

By using DevTest Labs, you can test the latest versions of your applications by doing the following tasks:

- Quickly create Windows and Linux environments by using reusable templates and artifacts.
- Easily integrate your deployment pipeline with DevTest Labs to create on-demand environments.
- Scale up your load testing by creating multiple test agents and pre-prepared environments for training and demos.

> [!VIDEO https://channel9.msdn.com/Blogs/Azure/What-is-Azure-DevTest-Labs/player]

## Cost control and governance
DevTest Labs makes it easier to control costs by allowing you to do the following tasks:

- [Set policies on your labs](devtest-lab-set-lab-policy.md), such as number of VMs per user or per lab. 
- Create [policies to automatically shut down](devtest-lab-set-lab-policy.md) and start VMs.
- Track costs on VMs and PaaS resources spun up inside labs to stay within [your budget](devtest-lab-configure-cost-management.md). Receive notice of high-projected costs for labs so you can take necessary actions.
- Stay within the context of your labs so you don't spin up resources outside of them.

## Quickly get to ready-to-test
DevTest Labs lets you create pre-provisioned environments to develop and test applications. Just [claim the environment](devtest-lab-add-claimable-vm.md) of your application's last good build and start working. Or use containers for even faster, leaner environment creation.

## Create once, use everywhere
Capture and share PaaS [environment templates](devtest-lab-create-environment-from-arm.md) and [artifacts](add-artifact-repository.md) within your team or organization—all in source control—to easily create developer and test environments.

## Worry-free self-service
DevTest Labs enables your developers and testers to quickly and easily [create IaaS VMs](devtest-lab-add-vm.md) and [PaaS resources](devtest-lab-create-environment-from-arm.md) by using a set of pre-configured resources.

## Use IaaS and PaaS resources 
Spin up resources, such as Azure Service Fabric clusters, or SharePoint farms, by using Resource Manager templates. The templates come from the [public environment repository](devtest-lab-configure-use-public-environments.md) or [connect the lab to your own Git repository](devtest-lab-create-environment-from-arm.md#configure-your-own-template-repositories). You can also spin up an empty resource group (sandbox) by using a Resource Manager template to explore Azure within the context of a lab.

## Integrate with your existing toolchain
Use pre-made plug-ins or the API to create development/testing environments directly from your preferred [continuous integration (CI) tool](devtest-lab-integrate-ci-cd.md), integrated development environment (IDE), or automated release pipeline. You can also use the comprehensive command-line tool.

## Next steps
See the following articles:

- To learn more about DevTest Labs, see [DevTest Labs concepts](devtest-lab-concepts.md).
- For a walkthrough with step-by-step instructions, see [Tutorial: Set up a lab by using Azure DevTest Labs](tutorial-create-custom-lab.md).
