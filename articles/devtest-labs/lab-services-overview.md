---
title: Azure Lab Services vs. Azure DevTest Labs
description: Compare features, scenarios, and use cases for Azure DevTest Labs and Azure Lab Services.
ms.topic: overview
ms.date: 11/15/2021
---

# Compare Azure DevTest Labs and Azure Lab Services

You can use two different Azure services to set up lab environments in the cloud:

- [Azure DevTest Labs](https://azure.microsoft.com/services/devtest-lab) provides development or test cloud environments for your team. A lab owner [creates a lab](devtest-lab-create-lab.md) and provisions it with Windows or Linux virtual machines (VMs). The lab owner installs necessary software and tools, and makes the VMs available to lab users. Lab users connect to lab VMs for daily work and short-term projects. Lab administrators can analyze resource usage and costs across multiple labs, and set overarching policies to optimize organization or team costs.

- [Azure Lab Services](https://azure.microsoft.com/services/lab-services) provides managed classroom labs. The service handles all infrastructure management, from spinning up VMs and scaling infrastructure to handling errors. After an IT administrator creates a Lab Services lab account, an instructor can [create a classroom lab](/azure/lab-services/how-to-manage-classroom-labs#create-a-classroom-lab). The instructor specifies the number and type of VMs needed for class exercises, and adds users to the class. Users register in the class and can access the VMs to do class exercises and homework.

## Key capabilities

Azure DevTest Labs and Azure Lab Services support the following key capabilities and features:

- **Fast and flexible lab setup**. Lab owners can quickly set up labs for their needs. The service can take care of all Azure infrastructure work, or you can let lab owners self-manage and customize infrastructure. Lab Services provides built-in infrastructure scaling and resiliency for managed labs.

- **Simplified lab user experience**. In a classroom lab, lab users can register with a code and access the lab to use resources. A DevTest Labs lab owner can give permissions for lab users to create and access VMs, manage and reuse data disks, and set up reusable secrets.

- **Cost optimization and analysis**. A lab owner can set a lab schedule to specify when lab VMs are accessible to users. The schedule can automatically shut down and start up VMs at specified times. The owner can set usage policies per user or per lab to optimize costs. Lab owners can analyze lab usage and activity trends. Classroom labs offer a smaller subset of cost optimization and analysis options.

- **Embedded security**. A lab owner can set up a private virtual network and subnets for a lab, and enable a shared public IP address. DevTest Labs lab users can securely access virtual network resources by using Azure ExpressRoute or a site-to-site virtual private network (VPN).

- **Workflow and tool integration**. You can integrate Lab Services into your organization's website and management systems. In DevTest Labs, you can automatically provision environments from within your continuous integration/continuous deployment (CI/CD) tools.

## Scenarios

Here are some scenarios that DevTest Labs and Lab Services support:

### Set up a resizable classroom computer lab in the cloud

- To create a managed classroom lab, you just tell the service exactly what you need. The service creates and manages lab infrastructure so you can focus on teaching your class, not technical details.
- Provide students with a lab of VMs that are configured with exactly what's needed. Give each student a limited number of hours for using the VMs for class work.
- Move your school's physical computer lab into the cloud. Automatically scale the number of VMs to only the maximum usage and cost threshold you set.
- Delete the lab with a single click when you're done.

### Use DevTest Labs for development environments

You can use DevTest Labs to implement many key scenarios. One primary scenario is to host development machines. In this scenario, DevTest Labs provides these benefits:

- Developers can quickly provision their development machines on demand.
- You can provision Windows and Linux environments by using reusable templates and artifacts.
- Developers can easily customize their development machines whenever needed.
- Administrators can control costs by ensuring that developers can't get more VMs than they need.
- Administrators can ensure that VMs are shut down when not in use.

For more information, see [Use DevTest Labs for development](devtest-lab-developer-lab.md).

### Use DevTest Labs for test environments

Another primary scenario is to use DevTest Labs to host machines for testers. In this scenario, DevTest Labs provides these benefits:

- Testers can test the latest version of their application.
- You can quickly provision Windows and Linux environments using reusable templates and artifacts.
- Testers can scale up their load testing by provisioning multiple test agents.
- Administrators can control costs by ensuring that testers can't get more VMs than they need.
- Administrators can ensure that VMs are shut down when not in use.

For more information, see [Use DevTest Labs for testing](devtest-lab-test-env.md).

## Types of labs

You can create two types of labs: **managed lab types** with Lab Services, or **labs** with DevTest Labs. If you just want to input your needs and let the service set up and manage required lab infrastructure, select **classroom lab** from the **managed lab types** in Lab Services. If you want to manage your own infrastructure, create a lab by using DevTest Labs.

The following sections provide more details about these labs.

### Managed labs

Managed labs are Lab Services labs with infrastructure that Azure manages. Managed lab types can fit specific needs, like classroom labs.

With managed labs, you can get started right away, with minimal setup. To create a classroom lab, first you create a lab account for your organization. The lab account serves as the central account for managing all the labs in the organization.

For managed labs, Lab Services creates and manages Azure resources in internal Microsoft subscriptions, not in your own Azure subscription. The service keeps track of resource usage in the internal Microsoft subscriptions, and bills usage back to the Azure subscription that contains the lab account.

Here are some use cases for managed lab types:

- Provide students with a lab of VMs that have exactly what's needed for a class.
- Limit the number of hours users can use VMs.
- Set up a pool of high-performance VMs to do compute-intensive or graphics-intensive research.
- Move your school's physical computer lab into the cloud.
- Quickly provision a lab of VMs for hosting a hackathon.

### DevTest Labs

You might want to manage all infrastructure and configuration yourself, within your own Azure subscription. For these scenarios, you can create a DevTest Labs lab in the Azure portal. You don't create or use a lab account for DevTest Labs.

Here are some use cases for DevTest Labs: 

- Quickly provision a lab of VMs to host a hackathon or a hands-on session at a conference.
- Create a pool of VMs configured with your application to use for bug bashes.
- Provide developers with VMs configured with all the tools they need.
- Repeatedly create labs of test machines to test your latest bits.
- Set up differently configured VMs and multiple test agents for scale and performance testing.
- Offer training sessions to your customers in a lab configured with your product's latest version.

## Lab Services vs. DevTest Labs

The following table compares the two types of Azure lab environments: 

| Feature | Lab Services | DevTest Labs |
| -------- | ----------------- | ---------- |
| Managing Azure infrastructure in the lab. | Service automatically manages. | You manage on your own.  |
| Built-in resiliency to infrastructure issues. | Service automatically handles. | You handle on your own.  |
| Subscription management. | Service handles resource allocation in internal subscriptions. | You manage in your own Azure subscription. |
| Autoscaling. | The service handles automatic scaling. | No autoscaling of subscriptions. |
| Azure Resource Manager deployments in labs. | Not available. | Available. |

## Next steps

See the following articles: 

- [About Classroom Labs](../lab-services/classroom-labs-overview.md)
- [About DevTest Labs](devtest-lab-overview.md)
