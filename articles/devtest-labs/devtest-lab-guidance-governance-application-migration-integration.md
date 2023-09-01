---
title: Application migration and integration
description: This article provides governance guidance for Azure DevTest Labs infrastructure. The context is application migration and integration. 
ms.topic: how-to
ms.author: rosemalcolm
author: RoseHJM
ms.date: 06/26/2020
ms.reviewer: christianreddington,anthdela,juselph
ms.custom: UpdateFrequency2
---

# Governance of Azure DevTest Labs infrastructure - Application migration and integration
Once your development/test lab environment has been established, you need to think about the following questions:

- How do you use the environment within your project team?
- How do you ensure that you follow any required organizational policies, and maintain the agility to add value to your application?

## Azure Marketplace images vs. custom images

### Question
When should I use an Azure Marketplace image vs. my own custom organizational image?

### Answer
Azure Marketplace should be used by default unless you have specific concerns or organizational requirements. Some common examples include;

- Complex software setup that requires an application to be included as part of the base image.
- Installation and setup of an application could take many hours, which aren't an efficient use of compute time to be added on an Azure Marketplace image.
- Developers and testers require access to a virtual machine quickly, and want to minimize the setup time of a new virtual machine.
- Compliance or regulatory conditions (for example, security policies) that must be in place for all machines.

Consider using custom images carefully. Custom images introduce extra complexity, as you now have to manage VHD files for those underlying base images. You also need to routinely patch those base images with software updates. These updates include new operating system (OS) updates, and any updates or configuration changes needed for the software package itself.

## Formula vs. custom image

### Question
When should I use a formula vs. custom image?

### Answer
Typically, the deciding factor in this scenario is cost and reuse.

You can reduce cost by creating a custom image if:
- Many users or labs require the image.
- The required image has a lot of software on top of the base image.

This solution means that you create the image once. A custom image reduces the setup time of the virtual machine. You don't incur costs from running the virtual machine during setup.

Another factor is the frequency of changes to your software package. If you run daily builds and require that software to be on your users' virtual machines, consider using a formula instead of a custom image.

## Use custom organizational images

This scenario is an advanced scenario, and the scripts provided are sample scripts only. If any changes are required, you need to manage and maintain the scripts used in your environment.



## Patterns to set up network configuration

### Question
How do I ensure that development and test virtual machines are unable to reach the public internet? Are there any recommended patterns to set up network configuration?

### Answer
Yes. There are two aspects to consider – inbound and outbound traffic.

**Inbound traffic** – If the virtual machine doesn't have a public IP address, then the internet can't reach it. A common approach is to set a subscription-level policy that no user can create a public IP address.

**Outbound traffic** – If you want to prevent virtual machines from going directly to the public internet, and force traffic through a corporate firewall, you can route traffic on-premises via Azure ExpressRoute or VPN, by using forced routing.

> [!NOTE]
> If you have a proxy server that blocks traffic without proxy settings, do not forget to add exceptions to the lab’s artifact storage account, .

You could also use network security groups for virtual machines or subnets. This step adds another layer of protection to allow or block traffic.

## New vs. existing virtual network

### Question
When should I create a new virtual network for my DevTest Labs environment vs. using an existing virtual network?

### Answer
If your VMs need to interact with existing infrastructure, you should consider using an existing virtual network inside your DevTest Labs environment. If you use ExpressRoute, minimize the number of virtual networks and subnets so you don't fragment the IP address space assigned to your subscriptions. Also consider using the virtual network peering pattern here (Hub-Spoke model). This approach enables virtual network and subnet communication across subscriptions within a given region.

Each DevTest Labs environment could have its own virtual network, but there are [limits](../azure-resource-manager/management/azure-subscription-service-limits.md) on the number of virtual networks per subscription. The default amount is 50, though this limit can be raised to 100.

## Shared, public, or private IP

### Question
When should I use a shared IP vs. public IP vs. private IP?

### Answer
If you use a site-to-site VPN or Express Route, consider using private IPs so that your machines are accessible via your internal network, and inaccessible over public internet.

> [!NOTE]
> Lab owners can change this subnet policy to ensure that no one accidentally creates public IP addresses for their VMs. The subscription owner should create a subscription policy preventing public IPs from being created.

When using shared public IPs, the virtual machines in a lab share a public IP address. This approach can be helpful when you need to avoid breaching the limits on public IP addresses for a given subscription.

## Limits of labs per subscription
### Question
How many labs can I create under the same subscription?

### Answer

There isn't a specific limit on the number of labs that can be created per subscription. However, the amount of resources used per subscription is limited. You can read about the [limits and quotas for Azure subscriptions](../azure-resource-manager/management/azure-subscription-service-limits.md) and [how to increase these limits](https://azure.microsoft.com/blog/azure-limits-quotas-increase-requests).
          
## Limits of VMs per lab          
### Question
How many VMs can I create per lab?

### Answer: 
There is no specific limit on the number of VMs that can be created per lab. However, the resources (VM cores, public IP addresses, and so on) that are used are limited per subscription. You can read about the [limits and quotas for Azure subscriptions](../azure-resource-manager/management/azure-subscription-service-limits.md) and [how to increase these limits](https://azure.microsoft.com/blog/azure-limits-quotas-increase-requests).
          
## Limits of number of virtual machines per user or lab

### Question
Is there a rule for how many virtual machines I should set per user, or per lab?

### Answer
When considering the number of virtual machines per user or per lab, there are three main concerns:

- The **overall cost** that the team can spend on resources in the lab. It’s easy to spin up many machines. To control costs, one mechanism is to limit the number of VMs per user or per lab
- The total number of virtual machines in a lab is impacted by the [subscription level quotas](../azure-resource-manager/management/azure-subscription-service-limits.md) available. One of the upper limits is 800 resource groups per subscription. DevTest Labs currently creates a new resource group for each VM (unless shared public IPs are used). If there are 10 labs in a subscription, labs could fit approximately 79 virtual machines in each lab (800 upper limit – 10 resource groups for the 10 labs themselves) = 79 virtual machines per lab.
- If the lab is connected to on-premises via Express Route (for example), there are **defined IP address spaces available** for the VNet/Subnet. To ensure that VMs in the lab don't fail to be created (error: can’t get IP address), lab owners can specify the max VMs per lab aligned with the IP address space available.

## Use Resource Manager templates

### Question
How can I use Resource Manager templates in my DevTest Labs Environment?

### Answer
Deploy your Resource Manager templates by using the steps in [Use Azure DevTest Labs for test environments](devtest-lab-test-env.md). Basically, you check your Resource Manager templates into an Azure Repos or GitHub Git repository, and add a [private repository for your templates](devtest-lab-test-env.md) to the lab.

This scenario may not be useful if you're using DevTest Labs to host development machines. Use this scenario to build a staging environment that's representative of production.

The number of virtual machines per lab or per user option only limits the number of machines natively created in the lab itself. This option doesn't limit creation by any environments with Resource Manager templates.

## Next steps
See [Use environments in DevTest Labs](devtest-lab-test-env.md).
