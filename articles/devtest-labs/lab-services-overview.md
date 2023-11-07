---
title: Azure Lab Services vs. Azure DevTest Labs
description: Compare features, scenarios, and use cases for Azure DevTest Labs and Azure Lab Services.
ms.topic: overview
ms.author: rosemalcolm
author: RoseHJM
ms.date: 11/15/2021
ms.custom: UpdateFrequency2
---

# Compare Azure DevTest Labs and Azure Lab Services

You can use two different Azure services to set up lab environments in the cloud:

- [Azure DevTest Labs](devtest-lab-overview.md) provides development or test cloud environments for your team.

  In DevTest Labs, a lab owner [creates a lab](devtest-lab-create-lab.md) and makes it available to lab users. The owner provisions the lab with Windows or Linux virtual machines (VMs) that have all necessary software and tools. Lab users connect to lab VMs for daily work and short-term projects. Lab administrators can analyze resource usage and costs across multiple labs, and set overarching policies to optimize organization or team costs.

- [Azure Lab Services](../lab-services/lab-services-overview.md) provides managed classroom labs.

  Lab Services does all infrastructure management, from spinning up VMs and scaling infrastructure to handling errors. After an IT administrator creates a Lab Services lab account, instructors can [create labs](../lab-services/quick-create-lab-plan-portal.md) in the account. An instructor specifies the number and type of VMs they need for the class, and adds users to the class. Once users register in the class, they can access the VMs to do class exercises and homework.

## Key capabilities

DevTest Labs and Lab Services support the following key capabilities and features:

- **Fast and flexible lab setup**. Lab owners and instructors can quickly set up labs for their needs. Lab Services takes care of all Azure infrastructure work, and provides built-in infrastructure scaling and resiliency for managed labs. In DevTest Labs, lab owners can self-manage and customize infrastructure.

- **Simplified lab user experience**. In a Lab Services classroom lab, users can register with a code and access the lab to use resources. A DevTest Labs lab owner can give permissions for lab users to create and access VMs, manage and reuse data disks, and set up reusable secrets.

- **Cost optimization and analysis**. In Lab Services, you can give each student a limited number of hours for using the VMs. A DevTest Labs lab owner can set a lab schedule to specify when lab VMs are accessible to users. The schedule can automatically shut down and start up VMs at specified times. The lab owner can set usage policies per user or per lab to optimize costs. Lab owners can analyze lab usage and activity trends. Classroom labs offer a smaller subset of cost optimization and analysis options.

DevTest Labs also supports the following features:

- **Embedded security**. A lab owner can set up a private virtual network and subnets for a lab, and enable a shared public IP address. DevTest Labs lab users can securely access virtual network resources by using Azure ExpressRoute or a site-to-site virtual private network (VPN).

- **Workflow and tool integration**. In DevTest Labs, you can automatically provision environments from within your continuous integration/continuous deployment (CI/CD) tools. You can integrate DevTest Labs into your organization's website and management systems.

## Scenarios

Here are typical scenarios for Lab Services and DevTest Labs:

### Set up a resizable classroom computer lab in the cloud

- To create a managed classroom lab, you just tell Lab Services what you need. The service creates and manages lab infrastructure so you can focus on teaching your class, not technical details.
- Lab Services provides students with a lab of VMs that are configured with exactly what's needed. You can give each student a limited number of hours for using the VMs.
- You can move your school's physical computer lab into the cloud. Lab Services automatically scales the number of VMs to only the maximum usage and cost threshold you set.
- You can delete labs with a single click when you're done with them.

### Use DevTest Labs for development and test environments

You can use DevTest Labs for many key scenarios. One primary scenario is to host development and test machines. DevTest Labs provides these benefits for developers and testers:

- Lab owners and users can provision Windows and Linux environments by using reusable templates and artifacts.
- Developers can quickly provision development machines on demand, and easily customize their machines when necessary.
- Testers can test the latest application version, and scale up load testing by provisioning multiple test agents.
- Administrators can control costs by ensuring that developers and testers can't get more VMs than they need.
- Administrators can ensure that VMs are shut down when not in use.

For more information, see [Use DevTest Labs for development](devtest-lab-developer-lab.md) and [Use DevTest Labs for testing](devtest-lab-test-env.md).

## Types of labs

You can create two types of labs: **managed labs** with Lab Services, or **labs** with DevTest Labs. If you just want to input your needs and let the service set up and manage required lab infrastructure, select **classroom lab** from the **managed lab types** in Lab Services. If you want to manage your own infrastructure, create labs by using DevTest Labs.

The following sections provide more details about these lab types.

### Managed labs

Managed labs are Lab Services labs with infrastructure that Azure manages. Managed lab types can fit specific needs, like classroom labs.

With managed labs, you can get started right away, with minimal setup. To create a classroom lab, first you create a lab account for your organization. The lab account serves as the central account for managing all the labs in the organization.

For managed labs, Lab Services creates and manages Azure resources in internal Microsoft subscriptions, not in your own Azure subscription. The service keeps track of resource usage in the internal subscriptions, and bills usage back to the Azure subscription that contains the lab account.

Here are some use cases for managed lab types:

- Provide students with a lab of VMs that have exactly what's needed for a class.
- Limit the number of hours that students can use VMs.
- Set up a pool of high-performance VMs to do compute-intensive or graphics-intensive research.
- Move a school's physical computer lab into the cloud.
- Quickly provision a lab of VMs for hosting a hackathon.

### DevTest Labs

You might want to manage all lab infrastructure and configuration yourself, within your own Azure subscription. For this scenario, create a DevTest Labs lab in the Azure portal. You don't create or use a lab account for DevTest Labs.

Here are some use cases for DevTest Labs:

- Quickly provision a lab of VMs to host a hackathon or hands-on conference session.
- Create a pool of VMs configured with an application to use for bug bashes.
- Provide developers with VMs configured with all the tools they need.
- Repeatedly create labs of test machines to test the latest bits.
- Set up differently configured VMs and multiple test agents for scale and performance testing.
- Offer customer training sessions in a lab configured with a product's latest version.

## Lab Services vs. DevTest Labs

The following table compares the two types of Azure lab environments: 

| Feature | Azure Lab Services | Azure DevTest Labs
| -------- | ----------- | ----------- |
| Management of Azure infrastructure | Automatically infrastructure management | You manage the infrastructure manually |
| Built-in resiliency | Automatic handling of resiliency | You handle resiliency manually |
| Subscription management | The service handles allocation of resources within Microsoft subscriptions that back the service. | You manage the subscription within your own Azure subscription.  |
| Autoscaling. | Service automatically scales | No subscription autoscaling |
| Azure Resource Manager deployment within the lab | Not available | Available |

