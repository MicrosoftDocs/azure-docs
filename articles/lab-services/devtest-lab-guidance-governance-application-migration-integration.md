---
title: Application migration and integration in Azure DevTest Labs
description: This article provides guidance for governance of Azure DevTest Labs infrastructure in the context of application migration and integration. 
services: devtest-lab,virtual-machines,lab-services
documentationcenter: na
author: spelluru
manager: femila

ms.service: lab-services
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/26/2019
ms.author: spelluru
ms.reviewer: christianreddington,anthdela,juselph

---

# Governance of Azure DevTest Labs infrastructure - Application migration and integration
Once your development/test lab environment has been established, you need to think about the following questions:

- How do you utilize the environment within your project team?
- How do you ensure that you follow any required organizational policies, and maintain the agility to add value to your application?

## Azure Marketplace images vs. custom images

### Question
When should I use an Azure Marketplace image vs. my own custom organizational image?

### Answer
Azure Marketplace should be used by default unless you have specific concerns or organizational requirements. Some common examples include;

- Complex software setup that requires an application to be included as part of the base image.
- Installation and setup of an application could take many hours, which are not an efficient use of compute time to be added on an Azure Marketplace image.
- Developers and testers require access to a virtual machine quickly, and want to minimize the setup time of a new virtual machine.
- Compliance or regulatory conditions (for example, security policies) that must be in place for all machines.

Using custom images should not be considered lightly. They introduce extra complexity, as you now have to manage VHD files for those underlying base images. You also need to routinely patch those base images with software updates. These updates include new operating system (OS) updates, and any updates or configuration changes needed for the software package itself.

## Formula vs. custom image

### Question
When should I use a formula vs. custom image?

### Answer
Typically, the deciding factor in this scenario is cost and reuse.

If you have a scenario where many users/labs require an image with a lot of software on top of the base image, then you could reduce cost by creating a custom image. This means that the image is created once. It reduces the setup time of the virtual machine and the cost incurred due to the virtual machine running when setup occurs.

However, an additional factor to note is the frequency of changes to your software package. If you run daily builds and require that software to be on your users’ virtual machines, consider using a formula instead of a custom image.

## Use custom organizational images

### Question
How can I set up an easily repeatable process to bring my custom organizational images into a DevTest Labs environment?

### Answer
See [this video on Image Factory pattern](https://blogs.msdn.microsoft.com/devtestlab/2017/04/17/video-custom-image-factory-with-azure-devtest-labs/). This scenario is an advanced scenario, and the scripts provided are sample scripts only. If any changes are required, you need to manage and maintain the scripts used in your environment.

Using DevTest Labs to create a custom image pipeline in Azure Pipelines:

- [Introduction: Get VMs ready in minutes by setting up an image factory in Azure DevTest Labs](https://blogs.msdn.microsoft.com/devtestlab/2016/09/14/introduction-get-vms-ready-in-minutes-by-setting-up-image-factory-in-azure-devtest-labs/)
- [Image Factory – Part 2! Setup Azure Pipelines and Factory Lab to Create VMs](https://blogs.msdn.microsoft.com/devtestlab/2017/10/25/image-factory-part-2-setup-vsts-to-create-vms-based-on-devtest-labs/)
- [Image Factory – Part 3: Save Custom Images and Distribute to Multiple Labs](https://blogs.msdn.microsoft.com/devtestlab/2018/01/10/image-factory-part-3-save-custom-images-and-distribute-to-multiple-labs/)
- [Video: Custom Image Factory with Azure DevTest Labs](https://blogs.msdn.microsoft.com/devtestlab/2017/04/17/video-custom-image-factory-with-azure-devtest-labs/)

## Patterns to set up network configuration

### Question
How do I ensure that development and test virtual machines are unable to reach the public internet? Are there any recommended patterns to set up network configuration?

### Answer
Yes. There are two aspects to consider – inbound and outbound traffic.

**Inbound traffic** – If the virtual machine does not have a public IP address, then it cannot be reached by the internet. A common approach is to ensure that a subscription-level policy is set, such that no user is able to create a public IP address.

**Outbound traffic** – If you want to prevent virtual machines going directly to public internet and force traffic through a corporate firewall, then you can route traffic on-premises via express route or VPN, by using forced routing.

> [!NOTE]
> If you have a proxy server that blocks traffic without proxy settings, do not forget to add exceptions to the lab’s artifact storage account, .

You could also use network security groups for virtual machines or subnets. This step adds an additional layer of protection to allow / block traffic.

## New vs. existing virtual network

### Question
When should I create a new virtual network for my DevTest Labs environment vs. using an existing virtual network?

### Answer
If your VMs need to interact with existing infrastructure, then you should consider using an existing virtual network inside your DevTest Labs environment. In addition, if you use ExpressRoute, you may want to minimize the amount of VNets / Subnets so that you don’t fragment your IP address space that gets assigned for use in the subscriptions. You should also consider using the VNet peering pattern here (Hub-Spoke model). This approach enables vnet/subnet communication across subscriptions within a given region although peering across regions is an up-coming feature in Azure networking.

Otherwise, each DevTest Labs environment could have its own virtual network. However, note that there are [limits](../azure-resource-manager/management/azure-subscription-service-limits.md) on the number of virtual networks per subscription. The default amount is 50, though this limit can be raised to 100.

## Shared, public, or private IP

### Question
When should I use a shared IP vs. public IP vs. private IP?

### Answer
If you use a site-to-site VPN or Express Route, consider using private IPs so that your machines are accessible via your internal network, and inaccessible over public internet.

> [!NOTE]
> Lab owners can change this subnet policy to ensure that no one accidentally creates public IP addresses for their VMs. The subscription owner should create a subscription policy preventing public IPs from being created.

When using shared public IPs, the virtual machines in a lab share a public IP address. This approach can be helpful when you need to avoid breaching the limits on public IP addresses for a given subscription.

## Limits of number of virtual machines per user or lab

### Question
Is there a rule in terms of how many virtual machines I should set per user, or per lab?

### Answer
When considering the number of virtual machines per user or per lab, there are three main concerns:

- The **overall cost** that the team can spend on resources in the lab. It’s easy to spin up many machines. To control costs, one mechanism is to limit the number of VMs per user and/or per lab
- The total number of virtual machines in a lab is impacted by the [subscription level quotas](../azure-resource-manager/management/azure-subscription-service-limits.md) available. One of the upper limits is 800 resource groups per subscription. DevTest Labs currently creates a new resource group for each VM (unless shared public IPs are used). If there are 10 labs in a subscription, labs could fit approximately 79 virtual machines in each lab (800 upper limit – 10 resource groups for the 10 labs themselves) = 79 virtual machines per lab.
- If the lab is connected to on-premises via Express Route (for example), there are **defined IP address spaces available** for the VNet/Subnet. To ensure that VMs in the lab don't fail to be created (error: can’t get IP address), lab owners can specify the max VMs per lab aligned with the IP address space available.

## Use Resource Manager templates

### Question
How can I use Resource Manager templates in my DevTest Labs Environment?

### Answer
You deploy your Resource Manager templates into a DevTest Labs environment by using steps mentioned in the [Environments feature in DevTest labs](devtest-lab-test-env.md) article. Basically, you check your Resource Manager templates into a Git Repository (either Azure Repos or GitHub), and add a [private repository for your templates](devtest-lab-test-env.md) to the lab.

This scenario may not be useful if you are using DevTest Labs to host development machines, but may be useful if you are building a staging environment, which is representative of production.

It is also worth noting that the number of virtual machines per lab or per user option only limits the number of machines natively created in the lab itself, and not by any environments (Resource Manager templates).

## Next steps
See [Use environments in DevTest Labs](devtest-lab-test-env.md).