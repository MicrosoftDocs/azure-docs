---
title: Types of labs in Azure Lab Services | Microsoft Docs
description: Learn about different types of labs in Azure Lab Services
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
ms.date: 04/12/2018
ms.author: spelluru

---
# Types of labs in Azure Lab Services
This article describes types of labs in Azure Lab Services. 

Azure Lab Services enables you to easily and quickly create a lab in the cloud, regardless of your technical expertise of Azure/cloud/infrastructure. If you want to simply input what you need in the lab and let the service roll it out to your audience, choose from one of the **managed labs**, such as a **classroom Lab**. However, if you would like to manage your own infrastructure, choose the **custom lab** type to set up a lab in your own Azure subscription. With this do-it-yourself option, you manage and deploy resources while accommodating any of your organization’s unique or advanced policies.   

## Managed labs
Managed labs offer different lab types that fit for your purpose, such as classroom labs. Currently, Azure Lab Services supports only classroom lab as a managed lab. The managed labs enable you to get started right away, with minimal setup. The service itself handles all management of the infrastructure behind the lab, from spinning up the VMs, handling errors, and scaling. You can create a managed lab after your organization's lab account has been set up, which serves as the central account in which all labs in the organization are managed  

When you create and use Azure resources in these managed labs, the service creates and manages the resources in internal Microsoft subscriptions, and not within your own Azure subscription. It enables the service to handle all infrastructure work for you. The service keeps track of the usage of the resources and it is billed back to your Azure subscription that you created the lab account under.   

## Custom labs
You may have scenarios where you want to manage all infrastructure and configuration yourself, within your own subscription. To do so, you can create a custom lab in the Azure portal. For custom labs, you do not need to create a lab account. Custom labs do not show up in the lab account (which exists for the managed lab types).  

## Managed labs vs. Custom labs

| Features | Managed lab types | Custom lab |
| -------- | ----------------  | ---------- |
| Management of the Azure infrastructure in the lab. | 	Automatically managed by the service | You manage on your own  |
| Built-in resiliency to infrastructure issues | Automatically handled by the service | You manage on your own  |
| Subscription management | Service handles allocation of resources within Microsoft subscriptions backing the service. Scaling is automatically handled by the service. | You manage on your own in your own Azure subscription. No auto-scaling of subscriptions. |
| Azure Resource Manager deployment within the lab | Not available | Available |




## Next steps
Get started with setting up a lab using Azure Lab Services:

- [Set up a classroom lab](tutorial-setup-classroom-lab.md)
- [Set up a custom lab](tutorial-create-custom-lab.md)
