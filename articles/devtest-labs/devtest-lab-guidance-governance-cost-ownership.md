---
title: Manage cost and ownership in Azure DevTest Labs
description: This article provides information that helps you optimize for cost and align ownership across your environment.
ms.topic: article
ms.date: 06/26/2020
ms.reviewer: christianreddington,anthdela,juselph
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
- Great Enterprise Agreement (EA) rates on other Azure services
- Access to exclusive Dev/Test images in the Gallery, including Windows 8.1 and Windows 10
 
Only active Visual Studio subscribers (standard subscriptions, annual cloud subscriptions, and monthly cloud subscriptions) can use Azure resources running within an enterprise Dev/Test subscription. However, end users can access the application to provide feedback or perform acceptance tests. Use of resources within this subscription is restricted to developing and testing applications, and no uptime guarantee is offered.

If you decide to use the DevTest offer, note that this benefit is exclusively for development and testing your applications. Usage within the subscription does not carry a financially-backed SLA, except for the use of Azure DevOps and HockeyApp.

## Define a role-based access across your organization
### Question
How do I define role-based access control for my DevTest Labs environments to ensure that IT can govern while developers/test can do their work? 

### Answer
There is a broad pattern, however the detail depends on your organization.

Central IT should own only what is necessary, and enable the project and application teams to have the needed level of control. Typically, it means that central IT owns the subscription and handles core IT functions such as networking configurations. The set of **owners** for a subscription should be small. These owners can nominate additional owners when there is a need, or apply subscription-level policies, for example “No Public IP”.

There may be a subset of users that require access across a subscription, such as Tier1 or Tier 2 support. In this case, we recommend that you give these users the **contributor** access so that they can manage the resources, but not provide user access or adjust policies.

The DevTest Labs resource should be owned by owners who are close to the project/application team. It's because they understand their requirements in terms of machines, and required software. In most organizations, the owner of this DevTest Labs resource is commonly the project/development lead. This owner can manage users and policies within the lab environment and can manage all VMs in the DevTest Labs environment.

The project/application team members should be added to the DevTest Labs Users role. These users can create virtual machines (in-line with the lab and subscription-level policies). They can also manage their own virtual machines. They can't manage virtual machines that belong to other users.

For more information, see [Azure enterprise scaffold – prescriptive subscription governance](/azure/architecture/cloud-adoption/appendix/azure-scaffold) documentation.


## Next steps
See [Corporate policy and compliance](devtest-lab-guidance-governance-policy-compliance.md).
