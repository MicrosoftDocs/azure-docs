---
title: About Azure DevTest Labs | Microsoft Docs
description: Learn how DevTest Labs can make it easy to create, manage, and monitor Azure virtual machines
services: devtest-lab,virtual-machines,lab-services
documentationcenter: na
author: spelluru
manager: femila
editor: ''

ms.assetid: 1b9eed3b-c69a-4c49-a36e-f388efea6f39
ms.service: lab-services
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/21/2019
ms.author: spelluru

---
# About Azure DevTest Labs
Azure DevTest Labs is a service that enables developers on a team to efficiently self-service virtual machines and/or PaaS resources that they need for developing, testing, training, and demos etc. without waiting for constant approvals on the tools that they need. 

The lab already consists of pre-configured bases or Resource Manager templates with all the necessary tools and software that developers can use to create environments. Developers can create their environments in a few minutes as opposed to hours or days. 

Using DevTest Labs, you can test the latest version of your application by doing the following tasks:

- Quickly provisioning Windows and Linux environments using reusable templates and artifacts
- Easily integrate your deployment pipeline with DevTest Labs to provision on-demand environments
- Scale up your load testing by provisioning multiple test agents and create pre-provisioned environments for training and demos.

> [!VIDEO https://channel9.msdn.com/Blogs/Azure/What-is-Azure-DevTest-Labs/player]
> 
> 

## Capabilities
DevTest Labs provides the following capabilities to developers working with virtual machines:

- Create a virtual machine quickly by following less than five simple steps.
- Choose from a curated list of VM bases that are configured, approved, and authorized by the team lead or central IT.
- Create machines from pre-created custom images that have all the software and tools installed in the image. 
- Create machines from formulas that are essentially custom images and a latest build of the software that is installed at the time of creation of the virtual machine.
- Install artifacts that are extensions deployed on the VM after it's provisioned.
- Set up auto shutdown and auto start schedules on the machines to have shutdown at the end of the day and then up and running next morning.
- Simply claim a pre-created virtual machine without having to go through the process of machine creation. 

DevTest Labs provides the following capabilities to developers working with PaaS environments:

- Create PaaS Azure Resource Manager environments quickly following less than three simple steps.
- Choose from a curated list of Resource Manager templates, which are configured, approved, and authorized by the team lead or central IT.
- Spin up an empty resource group (Sandbox) using a Resource Manager template to explore entire of Azure while still staying within the context of the lab.
- DevTest Labs provides the following benefits in creating, configuring, and managing developer and test environments in the cloud

Apart from a self-service model for developers on a team, the service enables central IT to control wastes, optimize costs on resources and stay within budgets by doing the following tasks: 

- Setting auto shutdown and auto start schedules on virtual machines.
- Setting policies on the number of virtual machines users can create.
- Setting policies on the virtual machines sizes and gallery images users can pick from.
- Tracking costs and setting targets on the lab.
- Getting notified on high projected costs for the lab so that you can take necessary actions. 

DevTest Labs provides the following benefits in creating, configuring, and managing environments in the cloud:

## Cost control and governance
DevTest Labs makes it easier to control costs by allowing you to do the following tasks:

- Set policies on your lab - such as number of virtual machines (VM) per user and number of VMs per lab. 
- Create policies to automatically shut down and start VMs.
- Enables you to track costs on virtual machines and PaaS resources spun up inside your lab so that you can stay within your predefined budget. 
- Helps developers stay within the context of the lab so that they don’t end up spinning up any resources outside of it either in the underlying resource group or subscription.

## Quickly get to ready-to-test
DevTest Labs enables you to create pre-provisioned environments with everything your team needs to start developing and testing applications. Simply claim the environments where the last good build of your application is installed and start working right away. Or, use containers for even faster and leaner environment creation.

## Create once, use everywhere
Capture and share PaaS environment templates and artifacts within your team or organization - all in source control - to create developer and test environments easily.

## Worry-free self-service
DevTest Labs enables your developers and testers quickly and easily creates virtual machines (IaaS) and PaaS resources within a few clicks using a set of resources pre-configured for them.

## Use IaaS and PaaS resources 
DevTest Labs also enables developers to spin up PaaS resources such as Web Apps, Service Fabric clusters, SharePoint Farms, and so on. inside the lab using a Resource Manager template. Use the Resource Manager templates from our public environment repository or connect the lab to your own Git repository to get started on PaaS in labs. You can also track costs on these resources to stay within your predefined budgets. 

## Integrate with your existing toolchain
Use pre-made plug-ins or our API to provision Dev/Test environments directly from your preferred continuous integration (CI) tool, integrated development environment (IDE), or automated release pipeline. You can also use our comprehensive command-line tool.

## Next steps
See the following articles: 

- To learn more about DevTest Labs, see [DevTest Labs concepts](devtest-lab-concepts.md)
- For a walkthrough with step-by-step instructions, see [Tutorial: Set up a lab by using Azure DevTest Labs](tutorial-create-custom-lab.md)


