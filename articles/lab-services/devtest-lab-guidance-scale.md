---
title: Scale up your Azure DevTest Labs infrastructure
description: This article provides guidance for scaling up your Azure DevTest Labs infrastructure.  
services: devtest-lab,virtual-machines,lab-services
documentationcenter: na
author: spelluru
manager: femila

ms.service: lab-services
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/03/2018
ms.author: spelluru

---

# Scale up your Azure DevTest Labs infrastructure
Prior to implementing DevTest Labs at enterprise scale, there are several key decision points. Understanding these decision points at a high level helps an organization with design decisions in the future. However, these points should not hold back an organization from starting a proof of concept. The top three areas for initial scale-up planning are:

- Networking and security
- Subscription topology
- Roles and responsibilities

## Networking and security
Networking and security are cornerstones for all organizations. While an enterprise-wide deployment requires a much deeper analysis, there are a reduced number of requirements to successfully accomplish a proof of concept. A few key areas of focus include:

- **Azure Subscription** – To deploy DevTest Labs, you must have access to an Azure Subscription with appropriate rights to create resources. There are a number of ways to gain access to Azure subscriptions including an Enterprise Agreement and Pay As You Go. For more information on gaining access to an Azure Subscription, see [Licensing Azure for the enterprise](https://azure.microsoft.com/pricing/enterprise-agreement/).
- **Access to on-premises resources** – Some organizations require their resources in DevTest Labs have access to on-premises resources. A secure connection from your on-premises environment to Azure is needed. Therefore, it is important that you set up/configure either a VPN or Express Route connection before getting started. For more information, see [Virtual Networks overview](../virtual-network/virtual-networks-overview.md).
- **Additional security requirements** – Other security requirements such as machine policies, access to public IP addresses, connecting to the internet are scenarios that may need to be reviewed before implementing a proof of concept. 

## Subscription topology
Subscription Topology is a critical design consideration when deploying DevTest Labs to the Enterprise. However, it is not required to solidify all decisions until after a proof of concept has been completed. When evaluating the number of subscriptions required for an enterprise implementation, there are two extremes: 

- One subscription for the entire organization
- Subscription per user

Next, we highlight the Pros of each approach.

### One subscription
Often the approach of one subscription is not manageable in a large enterprise. However, limiting the number of subscriptions provides the following benefits:

- **Forecasting** costs for enterprise.  Budgeting becomes much easier in a single subscription because all resources are in a single pool. This approach allows for simpler decision making on when to exercise cost control measures at any given time in a billing cycle.
- **Manageability** of VMs, artifacts, formulas, network configuration, permissions, policies, etc is easier since all the updates are only required in one subscription as opposed to making updates across many subscriptions.
- **Networking** effort is greatly simplified in a single subscription for enterprises where on-premises connectivity is a requirement. Connecting virtual networks across subscriptions (hub-spoke model) is required with additional subscriptions, which requires additional configuration, management, IP address spaces, etc.
- **Team collaboration** is easier when everyone is working in the same subscription – for example, it’s easier to reassign a VM to a co-worker, share team resources, etc.

### Subscription per user
A separate subscription per user provides equal opportunities to the alternative spectrum. The benefits of having many subscriptions include:

- **Azure scaling quotas** are not going to impede adoption. For example, as of this writing Azure allows 200 storage accounts per subscription. There are operational quotas for most services in Azure (many can be customized, some cannot). In this model of a subscription per user, it’s highly unlikely that most quotas are reached. For more information on current Azure scaling quotas, see [Azure subscription and service limits, quotas, and constraints](../azure-subscription-service-limits.md).
- **Chargebacks** to groups or individual developers become much easier allowing organizations to account for costs using their current model.
- **Ownership & permissions** of the DevTest Labs environments are simple. You give developers the subscription-level access and they are 100% responsible for everything including the networking configuration, lab policies, and VM management.

In the Enterprise, there may be enough constraints on the extremes of the spectrum. Therefore, you may need to set up subscriptions in a way that falls in the middle of these extremes. As a best practice, the goal of an organization should be to use the minimal number of subscriptions as possible keeping in mind the forcing functions that increase the total number of subscriptions. To reiterate, subscription topology is critical for an enterprise deployment of DevTest Labs but should not delay a proof of concept. There are additional details in the [Governance](devtest-lab-guidance-governance-policy-compliance.md) article on how to decide on subscription and lab granularity in the organization.

## Roles and responsibilities
A DevTest Labs proof of concept has three primary roles with defined responsibilities – Subscription owner, DevTest Labs owner, DevTest Labs user, and optionally a Contributor.

- **Subscription owner** – The subscription owner has rights to administer an Azure Subscription including assigning users, managing policies, creating & managing networking topology, requesting quota increases, etc. For more information, see [this article](../role-based-access-control/rbac-and-directory-admin-roles.md).
- **DevTest Labs owner** – The DevTest Labs owner has full administrative access to the lab. This person is responsible for add/removing users, managing cost settings, general lab settings, and other VM/artifact-based tasks. A lab owner also has all the rights of a DevTest Labs User.
- **DevTest Labs user** – The DevTest Labs user can create and consume the virtual machines in the lab. These individuals have some minimal administrative capabilities on VMs they create (start/stop/delete/configure their VMs). The users can't manage VMs of other users.

## Next steps
See the next article in this series: [Orchestrate the implementation of Azure DevTest Labs](devtest-lab-guidance-orchestrate-implementation.md)