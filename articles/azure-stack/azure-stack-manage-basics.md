---
title: Azure Stack administration basics | Microsoft Docs
description: Learn what you need to know to administer Azure Stack.
services: azure-stack
documentationcenter: ''
author: twooley
manager: byronr
editor: ''

ms.assetid: 856738a7-1510-442a-88a8-d316c67c757c
ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/05/2017
ms.author: twooley

---
# Azure Stack administration basics

There are several things you need to know if you're new to Azure Stack administration. This guidance helps you understand how Azure Stack works, and your responsibilities as an administrator. For the Azure Stack Technical Preview 3 (TP3) timeframe, this guidance is scoped to the Azure Stack Proof of Concept (PoC).

## About the Azure Stack PoC

With the Azure Stack PoC, you can deploy Azure Stack on one physical server. You should use the PoC as a test environment, where you can evaluate, experiment, and develop your apps. The PoC software is available at no cost. However, there are [specific hardware requirements](azure-stack-deploy.md).
 
On a single server, you can't test all scenarios. For example, you can't test scenarios that involve failover and resiliency, or evaluate scale and performance. Networking is also limited; with one NIC and limited connectivity to your corporate infrastructure.

Don't use the PoC for production workloads. The PoC is designed for you to try out the latest software. Like Azure, we innovate rapidly and will regularly release new builds. When we do, and you want to move to the latest software, you must [redeploy Azure Stack](azure-stack-redeploy.md). The PoC documentation reflects the latest official build.

## What services are available?

Azure Stack includes a set of "foundational services" that are included by default when you deploy Azure Stack. The foundational services include:

- Compute
- Storage
- Networking
- Key Vault

These services let you make Infrastructure-as-a-Service (IaaS) services available to your users, with minimal configuration.

Additional supported services currently include:

- App Service
- Azure Functions
- SQL and MySQL databases

These services require additional configuration before you can make them available to your users. See the "Offer services" section of our documentation.

Azure Stack continues to add support for more Azure services. To see the projected roadmap, see the [Hybrid Application Innovation with Azure and Azure Stack](https://go.microsoft.com/fwlink/?LinkId=842846&clcid=0x409) whitepaper. You can also monitor the Azure Stack blog posts for new announcements at [https://azure.microsoft.com/blog/tag/azure-stack-technical-preview](https://azure.microsoft.com/blog/tag/azure-stack-technical-preview).

## How do I manage?
 
You can use the [administrator portal](azure-stack-manage-portals.md) or PowerShell to manage Azure Stack. The easiest way to learn the concepts is through the portal.

Azure Stack uses Azure Resource Manager as its underlying delivery mechanism. If you're going to manage or use Azure Stack, you should learn about Resource Manager. See the [Getting Started with Azure Resource Manager](http://download.microsoft.com/download/E/A/4/EA4017B5-F2ED-449A-897E-BD92E42479CE/Getting_Started_With_Azure_Resource_Manager_white_paper_EN_US.pdf) whitepaper.

## What are you responsible for?

Your users want to use services. From their perspective, your main role is to make these services available to them through their subscriptions. You must decide which services to offer, and make those services available by creating plans and offers. You'll also need to add items to the marketplace.

> [!NOTE]
> If you want to test your plans, offers, and services, you should use the user portal; not the administrator portal.

In addition to providing services, you must perform all the regular operational duties of a cloud administrator. The following list is scoped to what you can do in the TP3 PoC environment.

- Add user accounts
- Assign role-based access control (RBAC) roles
- Monitor infrastructure health
- Manage network and storage resources
- Replace bad hardware

## What do you need to tell your users?

In a PoC environment, if a user doesn't have Remote Desktop access to the PoC host, they must configure a virtual private network (VPN) connection before they can access Azure Stack.

Your users will want to know how to access the user portal or how to connect through PowerShell. If using PowerShell, users must register resource providers. (A service is managed by a resource provider. For example, the networking resource provider manages resources (resource types) such as virtual networks, network interfaces, and load balancers. Each resource type has a set of properties.)

App developers or anyone who uses Resource Manager templates will need to know which API versions to use. API versions depend on which build of Azure Stack you're running. To determine the build number, see [Manage updates in Azure Stack](azure-stack-updates.md#determine-the-current-version).

Users must understand how to work with services in Azure Stack. Because Azure Stack requires specific API versions, and Azure Stack is not at the same scale as Azure, there are differences to consider between an Azure and Azure Stack service. For more information, see:

- [Key considerations: Using services or building apps for Azure Stack](azure-stack-considerations.md)
- [Considerations for Virtual Machines in Azure Stack](azure-stack-vm-considerations.md)
- [Storage: differences and considerations](azure-stack-acs-differences-tp2.md)

Users can find service-specific information in the "Use services" section of [our documentation](https://docs.microsoft.com/azure/azure-stack/).

## Where do I get support?

For the Azure Stack PoC, you can ask support-related questions in the [Microsoft forums](https://social.msdn.microsoft.com/Forums/azure/home?forum=azurestack). These forums are regularly monitored.

## Next steps

[Make virtual machines available to your Azure Stack users](azure-stack-tutorial-tenant-vm.md)


