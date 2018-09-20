---
title: Governance of Azure DevTest Labs infrastructure
description: This article provides guidance for governance of Azure DevTest Labs infrastructure. 
services: devtest-lab,virtual-machines,lab-services
documentationcenter: na
author: spelluru
manager: femila

ms.service: lab-services
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/11/2018
ms.author: spelluru

---

# Governance of Azure DevTest Labs infrastructure - Application migration and integration
Once your Development and Test lab environment has been established, how do you then begin utilizing that environment within your project team? How do you ensure that you are following any required organizational policies, and maintaining the agility to add value to your application?

## Azure Marketplace images vs. custom images

### Question
When should I use the Azure Marketplace image vs. bring my own custom organizational image?

### Answer
Azure Marketplace should be used by default unless you have specific concerns or organizational requirements. Some common examples include;

- Complex software setup requires application to be included as part of the base image
- Installation and setup of application could take many hours, and is not an efficient use of compute time to be added on top of an Azure Marketplace image
- Developers and Testers require access to a Virtual Machine quickly, and want to minimize the setup time of a new Virtual Machine
- Compliance or regulatory conditions (for example, security policies) that must be in place for all machines.

Using custom images should not be considered lightly. They introduce extra complexity, as you now have to manage VHD files for those underlying base images and need to routinely patch those base images with software updates. This behavior applies for new Operating System updates, but also any updates or configuration changes needed for the software package itself.

## Formula vs. custom image

### Question
When should I use a formula vs. custom image?

### Answer
Typically, the deciding factor in this scenario is cost and reuse.

If you have a scenario where many users/labs require a base image that installs a lot of software on top of that base image, then this cost could be saved by creating a custom image instead. This would then mean that the image is created once, and reduces the setup time of the Virtual Machine and the cost incurred due to the Virtual Machine running when setup occurs.

However, an additional factor to note is the frequency of your software package changes. If you are running daily builds and require that software to be on your users’ virtual machines, then you should consider using a formula instead of a custom image.

## Use custom organizational images

### Question
How can I set up an easily repeatable process to bring my custom organizational images into a DevTest Labs environment?

### Answer
The Visual Studio Customer Engagement team have documented a pattern called the Image Factory pattern. You can find more information about this [pattern on channel 9](https://blogs.msdn.microsoft.com/devtestlab/2017/04/17/video-custom-image-factory-with-azure-devtest-labs/).

This scenario is an advanced scenario, and the scripts provided are sample scripts only. If any changes are required, you need to manage and maintain the scripts used in your environment.

Using DevTest Labs to create a custom image pipeline in Visual Studio Team Services (VSTS)
- [Introduction: Get VMs ready in minutes by setting up an image factory in Azure DevTest Labs](https://blogs.msdn.microsoft.com/devtestlab/2016/09/14/introduction-get-vms-ready-in-minutes-by-setting-up-image-factory-in-azure-devtest-labs/)
- [Image Factory – Part 2! Setup VSTS and Factory Lab to Create VMs](https://blogs.msdn.microsoft.com/devtestlab/2017/10/25/image-factory-part-2-setup-vsts-to-create-vms-based-on-devtest-labs/)
- [Image Factory – Part 3: Save Custom Images and Distribute to Multiple Labs](https://blogs.msdn.microsoft.com/devtestlab/2018/01/10/image-factory-part-3-save-custom-images-and-distribute-to-multiple-labs/)
- [Video: Custom Image Factory with Azure DevTest Labs](https://blogs.msdn.microsoft.com/devtestlab/2017/04/17/video-custom-image-factory-with-azure-devtest-labs/)

## Patterns to set up network configuration

### Question
I may have a scenario where I need to ensure Development and Test Virtual Machines are unable to reach the public internet. Are there any recommended patterns to set up network configuration?

### Answer
Yes. There are two aspects to consider – Inbound and Outbound Traffic.

**Inbound Traffic** – If the Virtual Machine does not have a Public IP Address, then it cannot be reached by the internet. A common approach is to ensure that a subscription-level policy is set, such that no user is able to create a public IP address.

**Outbound Traffic** – If you want to prevent Virtual Machines going directly to public internet and force traffic through a corporate firewall, then you can route traffic on premises via express route or VPN, by using Forced Routing.

> [!NOTE] 
> Do not forget that you will need to add exceptions to the Lab’s Artefact storage account, if you have a proxy server that will block traffic without proxy settings.

You could also use Network Security Groups for Virtual Machines or subnets. This step adds an additional layer of protection to allow / block traffic.

## New vs. existing virtual network

### Question
When should I create a new Virtual Network for my DevTest Labs environment vs. using an existing Virtual Network?

### Answer
If your VMs need to interact with existing infrastructure, then you should consider using an existing Virtual Network inside of your DevTest Labs environment. Additionally, if you are using ExpressRoute, then you may want to minimize the amount of VNets / Subnets so that you don’t fragment your IP address space that gets assigned for use in the subscriptions. You should also consider using the VNet peering pattern here (Hub-Spoke model). This approach enables vnet/subnet communication across subscriptions within a given region although peering across regions is an up-coming feature in Azure networking.

Otherwise, each DevTest Labs environment could have its own Virtual Network. However, note that there are [limits](../azure-subscription-service-limits.md) on the number of Virtual Networks per subscription. The default amount is 50, though this limit can be raised to 100.

## Shared, public, or private IP

### Question
When should I use a Shared IP, Public IP or Private IP?

### Answer
If you are using a Site to Site VPN or Express Route, then you would likely consider using Private IPs, so that your machines are accessible via your internal network, and inaccessible over public internet. NOTE: Lab Owners can change this subnet policy, to really ensure that no one accidently creates public IP addresses for their VMs the subscription owner should create a subscription policy preventing public IPs from being created.

When using shared public IPs, the virtual machines in a lab share a public IP address. This approach can be helpful when you need to avoid breaching the limits on Public IP addresses for a given subscription.

## Limits of number of virtual machine per user or lab

### Question
Is there a rule in terms of how many Virtual Machines I should set per user, or per lab?

### Answer
When considering the number of Virtual machines per user or per lab, there are three main concerns:

- The **overall cost** that the team can spend on resources in the lab. It’s easy to spin up many machines, to control costs, one mechanism is to limit the number of VMs per user and/or per lab
- The total number of virtual machines in a lab is impacted by the [subscription level quotas](../azure-subscription-service-limits.md) available. One of the first upper limits is 800 resource groups per subscription, and DevTest Labs currently creates a new resource group for each VM (unless shared public IPs are used). If there are 10 DevTest Labs in a subscription, that would mean labs could fit approx. 79 virtual machines in each lab. (800 upper limit – 10 RGs for the Labs / 10 Labs) = 79 Virtual machines per lab.
- If the lab is connected to on-premises via Express Route (for example), there are **defined IP address space available** for the Vnet/Subnet. To ensure that the VMs in the lab don't fail to be created (error: can’t get IP address), lab owners can specify the max VMs per lab aligned with the IP address space available.

## Use Resource manager templates

### Question
How can I use Resource Manager templates inside of my DevTest Labs Environment?

### Answer
You deploy your Resource Manager templates into a DevTest Labs environment by using steps mentioned in the [Environments feature in DevTest labs](devtest-lab-test-env.md) article. Basically, you check your Resource Manager templates into a Git Repository (either Visual Studio Team Services or GitHub), and add a [private repository for your templates](devtest-lab-test-env.md).

This scenario would not be useful if you are using DevTest Labs to host development machines, but may be useful if you are building out a staging environment, which is representative of production.

It is also worth noting that the “Limit number of Virtual Machines” per lab or per user option only limits the number of machines natively created in the lab itself, and not any environments (Resource Manager templates).

### Next steps
See [Use environments in DevTest Labs](devtest-lab-guidance-governance-application-migration-integration.md).