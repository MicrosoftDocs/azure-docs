---
title: Manage cost and ownership
description: This article provides information that helps you optimize for cost and align ownership across your environment.
ms.topic: how-to
ms.author: rosemalcolm
author: RoseHJM
ms.date: 06/26/2020
ms.reviewer: christianreddington,anthdela,juselph
ms.custom: UpdateFrequency2
---

# Governance of Azure DevTest Labs infrastructure - Manage cost and ownership
Cost and ownership are primary concerns when you consider building your development and test environments. In this section, you find information that helps you optimize for cost and align ownership across your environment.

## Optimize for cost

### Question
How can I optimize for cost within my DevTest Labs environment?

### Answer
Several built-in features of DevTest Labs help you optimize for cost. See [cost management, thresholds](devtest-lab-configure-cost-management.md) [,and policies](devtest-lab-set-lab-policy.md) articles to limit activities of your users. 

If you use DevTest Labs for development and test workloads, consider using the [Enterprise Dev/Test Subscription Benefit](https://azure.microsoft.com/offers/ms-azr-0148p/) that's part of your Enterprise Agreement. Or if you're a Pay as you Go customer, consider the [Pay-as-you go DevTest offer](https://azure.microsoft.com/offers/ms-azr-0023p/).

This approach provides several advantages:

- Special lower Dev/Test rates on Windows virtual machines, cloud services, HDInsight, App Service, and Logic Apps
- Great Enterprise Agreement (EA) rates on other Azure services
- Access to exclusive Dev/Test images in the Gallery, including Windows 8.1 and Windows 10
 
Only active Visual Studio subscribers (standard subscriptions, annual cloud subscriptions, and monthly cloud subscriptions) can use Azure resources running within an enterprise Dev/Test subscription. However, end users can access the application to provide feedback or do acceptance testing. You can use resources within this subscription only for developing and testing applications. There's no uptime guarantee.

If you decide to use the DevTest offer, use this benefit exclusively for development and testing your applications. Usage within the subscription doesn't carry a financially backed SLA, except for the use of Azure DevOps and HockeyApp.

## Define role-based access across your organization
### Question
How do I define Azure role-based access control for my DevTest Labs environments to ensure that IT can govern while developers/test can do their work? 

### Answer
There's a broad pattern, but the detail depends on your organization.

Central IT should own only what's necessary, and enable the project and application teams to have the needed level of control. Typically, it means that central IT owns the subscription and handles core IT functions such as networking configurations. The set of **owners** for a subscription should be small. These owners can nominate other owners when there's a need, or apply subscription-level policies, for example “No Public IP”.

There may be a subset of users that require access across a subscription, such as Tier1 or Tier 2 support. In this case, we recommend that you give these users the **contributor** access so that they can manage the resources, but not provide user access or adjust policies.

DevTest Labs resource owners should be close to the project or application team. These owners understand machine and software requirements. In most organizations, the owner of the DevTest Labs resource is the project or development lead. This owner can manage users and policies within the lab environment and can manage all virtual machines in the DevTest Labs environment.

Add project and application team members to the DevTest Labs Users role. These users can create virtual machines, in line with lab and subscription-level policies. Users can also manage their own virtual machines, but can't manage virtual machines that belong to other users.

For more information, see [Azure enterprise scaffold – prescriptive subscription governance](/azure/architecture/cloud-adoption/appendix/azure-scaffold).


## Next steps
See [Corporate policy and compliance](devtest-lab-guidance-governance-policy-compliance.md).
