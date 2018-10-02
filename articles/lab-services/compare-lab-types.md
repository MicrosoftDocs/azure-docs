---
title: Compare different types of labs in Azure Lab Services | Microsoft Docs
description: Explains and compares different types of labs you can create by using Azure Lab Services 
services: lab-services
documentationcenter: na
author: spelluru
manager: 
editor: ''

ms.service: lab-services
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: overview
ms.date: 05/17/2018
ms.author: spelluru

---
# Compare managed labs in Azure Lab Services and DevTest Labs
You can create two types of labs, **managed labs** with Azure Lab Services, and **custom labs** with Azure DevTest Labs. If you want to just input what you need in a lab and let the service set up and manage infrastructure required for the lab, choose from one of the **managed labs**. Currently, **classroom lab** is the only type of managed lab that you can create with Azure Lab Services. If you want to manage your own infrastructure, create a lab by using Azure DevTest Labs.

The following sections provide more details about these labs. 

## Managed lab types
Azure Lab Services allows you to create labs whose infrastructure is managed by Azure. This article refers to them as managed labs. Managed labs offer different types of labs that fit for your specific need. Currently, only type of managed lab that's supported is **classroom lab**. 

Managed labs enable you to get started right away, with minimal setup. The service itself handles all the management of the infrastructure for the lab, from spinning up the VMs to handling errors, and scaling the infrastructure. To create a managed lab such as a classroom lab, you need to create a lab account for your organization first. The lab account serves as the central account in which all labs in the organization are managed. 

When you create and use Azure resources in these managed labs, the service creates and manages resources in internal Microsoft subscriptions. They are not created in your own Azure subscription. The service keeps track of usage of these resources in internal Microsoft subscriptions. This usage is billed back to your Azure subscription that contains the lab account.   

Here are some of the **use cases for managed labs**: 

- Provide students with a lab of virtual machines that are configured with exactly what’s needed for a class. Give each student a limited number of hours for using the VMs for homework or personal projects.
- Set up a pool of high performance compute VMs to perform compute-intensive or graphics-intensive research. Run the VMs as needed, and clean up the machines once you are done. 
- Move your school’s physical computer lab into the cloud. Automatically scale the number of VMs only to the maximum usage and cost threshold that you set on the lab.  
- Quickly provision a lab of virtual machines for hosting a hackathon. Delete the lab with a single click once you’re done. 


## DevTest Labs
You may have scenarios where you want to manage all infrastructure and configuration yourself, within your own subscription. To do so, you can create a lab with Azure DevTest Labs in the Azure portal. For these labs, you do not need to create a lab account. These labs do not show up in the lab account (which exists for the managed labs).  

Here are some of the **use cases for using DevTest Labs**: 

- Quickly provision a lab of virtual machines to host a hackathon or a hands-on session at a conference. Delete the lab with a single click once you’re done. 
- Create a pool of VMs configured with your application, and let your team easily use a virtual machine for bug-bashes.  
- Provide developers with virtual machines configured with all the tools they need. Schedule automatic start and shut down to minimize cost. 
- Repeatedly create a lab of test machines as part of your deployment. Test your latest bits and clean up the test machines once you are done. 
- Set up a variety of differently configured virtual machines and multiple test agents for scale and performance testing. 
- Offer training sessions to your customers using a lab configured with the latest version of your product. Give each customer limited number of hours for using in the lab. 


## Managed lab types vs. DevTest Labs
The following table compares two types of labs that are supported by Azure Lab Services: 

| Features | Managed labs | DevTest Labs |
| -------- | ----------------- | ---------- |
| Management of Azure infrastructure in the lab. | 	Automatically managed by the service | You manage on your own  |
| Built-in resiliency to infrastructure issues | Automatically handled by the service | You manage on your own  |
| Subscription management | Service handles allocation of resources within Microsoft subscriptions backing the service. Scaling is automatically handled by the service. | You manage on your own in your own Azure subscription. No auto-scaling of subscriptions. |
| Azure Resource Manager deployment within the lab | Not available | Available |

## Next steps
Get started with setting up a lab using Azure Lab Services:

- [Set up a classroom lab](classroom-labs/tutorial-setup-classroom-lab.md)
- [Set up a lab](tutorial-create-custom-lab.md)
