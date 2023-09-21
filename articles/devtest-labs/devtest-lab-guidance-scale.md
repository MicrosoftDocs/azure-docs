---
title: Scale up your Azure DevTest Labs infrastructure
description: See information and guidance about scaling up your Azure DevTest Labs infrastructure.  
ms.topic: how-to
ms.author: rosemalcolm
author: RoseHJM
ms.date: 09/15/2023
ms.reviewer: christianreddington,anthdela,juselph
ms.custom: UpdateFrequency2
---

# Scale up your Azure DevTest Labs infrastructure

Orchestrating a successful implementation of DevTest Labs at enterprise scale requires consideration of key decision points, and planning an approach for rapid deployment and implementation of Azure DevTest Labs.

This article describes the key decision points you should consider when planning your implementation, and provides a recommended approach for deployment.

## Key decision points

Before you implement DevTest Labs at enterprise scale, there are several key decision points. Understanding these decision points at a high level helps an organization with design decisions in the future. However, these points shouldn't hold back an organization from starting a proof of concept. 

The top three areas for initial scale-up planning are:

- Networking and security
- Subscription topology
- Roles and responsibilities

### Networking and security
Networking and security are cornerstones for all organizations. While an enterprise-wide deployment requires a much deeper analysis, there are a reduced number of requirements to successfully accomplish a proof of concept. A few key areas of focus include:

- **Azure subscription** – To deploy DevTest Labs, you must have access to an Azure subscription with appropriate rights to create resources. There are several ways to gain access to Azure subscriptions, including an Enterprise Agreement and Pay As You Go. For more information on gaining access to an Azure subscription, see [Licensing Azure for the enterprise](https://azure.microsoft.com/pricing/enterprise-agreement/).
- **Access to on-premises resources** – Some organizations require their resources in DevTest Labs have access to on-premises resources. You need a secure connection from your on-premises environment to Azure. It's important to set up and configure either a VPN or Azure ExpressRoute connection before getting started. For more information, see [Virtual Networks overview](../virtual-network/virtual-networks-overview.md).
- **Other security requirements** – Other security requirements such as machine policies, access to public IP addresses, connecting to the internet are scenarios that may need to be reviewed before implementing a proof of concept. 

### Subscription topology
Subscription topology is a critical design consideration when deploying DevTest Labs to the Enterprise. However, it isn't required to solidify all decisions until after a proof of concept has been completed. When evaluating the number of subscriptions required for an enterprise implementation, there are two extremes: 

- One subscription for the entire organization
- Subscription per user

Next, we highlight the advantages of each approach.

#### One subscription
Often the approach of one subscription isn't manageable in a large enterprise. However, limiting the number of subscriptions provides the following benefits:

- **Forecasting** costs for enterprise.  Budgeting becomes much easier in a single subscription because all resources are in a single pool. This approach allows for simpler decision making on when to exercise cost control measures at any given time in a billing cycle.
- **Manageability** of VMs, artifacts, formulas, network configuration, permissions, and policies is easier since all the updates are only required in one subscription as opposed to making updates across many subscriptions.
- **Networking** effort is simpler in a single subscription for enterprises where on-premises connectivity is a requirement. Connecting virtual networks across subscriptions (hub-spoke model), required with added subscriptions, requires more configuration, management, and IP address spaces.
- **Team collaboration** is easier when everyone is working in the same subscription. For example, it's easier to reassign a VM to a coworker or share team resources.

#### Subscription per user
A separate subscription per user provides equal opportunities to the alternative spectrum. The benefits of having many subscriptions include:

- **Azure scaling quotas** won't impede adoption. For example, as of this writing Azure allows 200 storage accounts per subscription. There are operational quotas for most services in Azure (many can be customized, some can't). In this model of a subscription per user, it's highly unlikely that most quotas are reached. For more information on current Azure scaling quotas, see [Azure subscription and service limits, quotas, and constraints](../azure-resource-manager/management/azure-subscription-service-limits.md).
- **Chargebacks** to groups or individual developers become much easier allowing organizations to account for costs using their current model.
- **Ownership & permissions** of the DevTest Labs environments are simple. You give developers the subscription-level access and they are 100% responsible for everything including the networking configuration, lab policies, and VM management.

In the Enterprise, there may be enough constraints on the extremes of the spectrum. Therefore, you may need to set up subscriptions in a way that falls in the middle of these extremes. As a best practice, the goal of an organization should be to use the minimum number of subscriptions possible. Keep in mind the forcing functions that increase the total number of subscriptions. To reiterate, subscription topology is critical for an enterprise deployment of DevTest Labs but shouldn't delay a proof of concept. There are more details in the [Governance](./devtest-lab-guidance-governance-resources.md#align-devtest-labs-resources-within-an-azure-subscription) article on how to decide on subscription and lab granularity in the organization.

### Roles and responsibilities
A DevTest Labs proof of concept has three primary roles with defined responsibilities – Subscription owner, DevTest Labs owner, DevTest Labs user, and optionally a Contributor.

- **Subscription owner** – The subscription owner has rights to administer an Azure Subscription including assigning users, managing policies, creating and managing networking topology, and requesting quota increases. For more information, see [this article](../role-based-access-control/rbac-and-directory-admin-roles.md).
- **DevTest Labs owner** – The DevTest Labs owner has full administrative access to the lab. This person is responsible for add/removing users, managing cost settings, general lab settings, and other VM/artifact-based tasks. A lab owner also has all the rights of a DevTest Labs User.
- **DevTest Labs user** – The DevTest Labs user can create and consume the virtual machines in the lab. These individuals have some minimal administrative capabilities on VMs they create (start/stop/delete/configure their VMs). The users can't manage VMs of other users.

## Orchestrate the implementation of DevTest Labs
This section provides a recommended approach for rapid deployment and implementation of Azure DevTest Labs. The following image emphasizes the overall process as prescriptive guidance while observing flexibility for supporting various industry requirements and scenarios.

:::image type="content" source="media/devtest-lab-guidance-scale/implementation-steps.png" alt-text="Diagram showing steps for implementing Azure DevTest Labs.":::
### Assumptions
This article assumes that you have the following items in place before implementing a DevTest Labs pilot:

- **Azure subscription**: The pilot team has access to deploying resources into an Azure subscription. If the workloads are only development and testing, it’s recommended to select the Enterprise DevTest offer for additional available images and lower rates on Windows virtual machines.
- **On-Premises Access**: If necessary, on-premises access has already been configured. The on-premises access can be accomplished via a Site-to-site VPN connection or via Express Route. Connectivity via Express Route can typically take many weeks to establish, it’s recommended to have the Express Route in place before starting the project.
- **Pilot Teams**: The initial development project team(s) that uses DevTest Labs has been identified along with applicable development or testing activities and establish requirements/goals/objectives for those teams.

### Milestone 1: Establish initial network topology and design
The first area of focus when deploying an Azure DevTest Labs solution is to establish the planned connectivity for the virtual machines. The following steps outline the necessary procedures:

1. Define **initial IP address ranges** that are assigned to the DevTest Labs subscription in Azure. This step requires forecasting the expected usage in number of VMs so that you can provide a large enough block for future expansion.
2. Identify **methods of desired access** into the DevTest Labs (for example, external / internal access). A key point in this step is to determine whether virtual machines have public IP addresses (that is, accessible from the internet directly).
3. Identify and establish **methods of connectivity** with the rest of the Azure cloud environment and on-premises. If the forced routing with Express Route is enabled, it’s likely that the virtual machines need appropriate proxy configurations to traverse the corporate firewall.
4. If VMs are to be **domain joined**, determine whether they join a cloud-based domain (Entra Directory Services for example) or an on-premises domain. For on-premises, determine which organizational unit (OU) within active directory that the virtual machines join. In addition, confirm that users have access to join (or establish a service account that has the ability to create machine records in the domain)

### Milestone 2: Deploy the pilot lab
Once the network topology is in place, the first/pilot lab can be created by taking the following the steps:

1. Create an initial DevTest Labs environment.
2. Determine allowable VM images and sizes for use with lab. Decide whether custom images can be uploaded into Azure for use with DevTest Labs.
3. Secure access to the lab by creating initial Azure role-based access control (Azure RBAC) for the lab (lab owners and lab users). We recommend that you use synchronized active directory accounts with Azure Active Directory for identity with DevTest Labs.
4. Configure DevTest Labs to use policies such as schedules, cost management, claimable VMs, custom images, or formulas.
5. Establish an online repository such as Azure Repos/Git.
6. Decide on the use of public or private repositories or combination of both. Organize JSON Templates for deployments and long-term sustainment.
7. If needed, create custom artifacts. This step is optional. 

### Milestone 3: Documentation, support, learn, and improve
The initial pilot teams may require in-depth support for getting started. Use their experiences to ensure the right documentation and support is in place for continued rollout of Azure DevTest Labs.

1. Introduce the pilot teams to their new DevTest Labs resources (demos, documentation)
2. Based on pilot teams' experiences, plan and deliver documentation as needed
3. Formalize process for onboarding new teams (creating and configuring labs, providing access, etc.)
4. Based on initial uptake, verify original forecast of IP address space is still reasonable and accurate
5. Ensure appropriate compliance and security reviews have been completed

## Next steps
See the next article in this series: [Governance of Azure DevTest Labs infrastructure](devtest-lab-guidance-governance-resources.md)
