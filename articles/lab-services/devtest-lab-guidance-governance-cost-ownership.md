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

# Governance of Azure DevTest Labs infrastructure - Manage cost and ownership
Cost and ownership are primary concerns when you consider building your development and test environments. In this section, you find information that helps you optimize for cost and align ownership across your environment.

## Optimize for cost

### Question
How can I optimize for cost within my DevTest Labs environment?

### Answer
There are a number of built-in features of DevTest Labs that help you optimize for cost. See [cost management, thresholds](devtest-lab-configure-cost-management.md) [,and policies](devtest-lab-set-lab-policy.md) articles to limit activities of your users. 

As you utilize DevTest Labs for a development and test workloads, you may consider utilizing the [Enterprise Dev/Test Subscription Benefit](https://azure.microsoft.com/offers/ms-azr-0148p/), as part of your Enterprise Agreement. Alternatively, if you are a Pay as you Go customer, you may want to consider the [Pay-as-you go DevTest offer](https://azure.microsoft.com/offers/ms-azr-0023p/).

This approach provides you with numerous advantages:

- Special lower Dev/Test rates on Windows virtual machines, cloud services, HDInsight, App Service, and Logic Apps
- Same great Enterprise Agreement (EA) rates on other Azure services
- Access to exclusive Dev/Test images in the Gallery, including Windows 8.1 and Windows 10
- 
Only active Visual Studio subscribers (standard subscriptions, annual cloud subscriptions, and monthly cloud subscriptions) can use Azure resources running within an enterprise Dev/Test subscription, though end users can also access the application to provide feedback or perform acceptance tests. Use of resources within this subscription is restricted to developing and testing applications, and no uptime guarantee is offered.

If you decide to use the DevTest offer, this benefit is exclusively for development and testing your applications. Usage within the subscription does not carry a financially-backed SLA, except for use of Visual Studio Team Services and HockeyApp.

## Define a pattern across your organization
### Question
How do I define a pattern across my organization for RBAC in my DevTest Labs Environments to ensure IT can govern while Developers and Testers can continue their work?

### Answer
There is a broad pattern, however the detail depends on your organization.

Central IT should own only what is necessary, enabling the project and application teams to remain with the needed level of control. Typically, it means that central IT owns the subscription and handles core IT functions such as networking configurations. The set of owners for a subscription should remain small. Additionally, these owners can then nominate additional owners if needed, or apply subscription-level policies, for example “No Public IP”.

There may be a subset of users that require access across a subscription, such as Tier1 or Tier 2 support. In this case, we recommend that you give these users the contributor access so that they can manage the resources, but not provide user access or adjust policies.

The DevTest Labs resource would then be owned as close to the project/application team as possible, as they understand their requirements in terms of machines, and required software. In most organizations, the owner of this DevTest Labs resource is commonly the project/development lead. This owner can manage users and policies within the Lab environment and can manage all VMs in the DevTest Labs environment.

The DevTest Labs user role would be provided to the project/application team. These users can create virtual machines (in-line with the lab and subscription-level policies). They can also manage their own virtual machines. They can't manage virtual machines that belong to other users.

For more information, see [Azure enterprise scaffold – prescriptive subscription governance](/architecture/cloud-adoption/appendix/azure-scaffold) documentation.


### Next steps
See [Corporate policy and compliance](devtest-lab-guidance-governance-policy-compliance.md).