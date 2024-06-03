---
title: Deliver a proof of concept
description: Use a proof of concept or pilot deployment to investigate incorporating Azure DevTest Labs into an enterprise environment.
ms.topic: how-to
ms.author: rosemalcolm
author: RoseHJM
ms.date: 09/30/2023
ms.custom: UpdateFrequency2
---

# Deliver a proof of concept for Azure DevTest Labs enterprise deployment

Enterprises are rapidly adopting the cloud because of [benefits](/azure/architecture/cloud-adoption/business-strategy/cloud-migration-business-case) that include agility, flexibility, and economics. The first steps are often development and test workloads. Azure DevTest Labs provides [features](devtest-lab-concepts.md) that benefit the enterprise and support [key dev/test scenarios](devtest-lab-guidance-get-started.md).

This article describes how an enterprise can deliver a successful proof of concept or pilot for an Azure DevTest Labs deployment. Proof of concept uses a concentrated effort from a single team to establish organizational value.

Every enterprise has different requirements for incorporating Azure DevTest Labs into their organization. Proof of concept is a first step toward a successful end-to-end deployment.

For a successful proof of concept:

1. Pick one or two teams.
1. Identify the teams' scenarios, such as developer virtual machines (VMs) or test environments.
1. Document current use cases.
1. Deploy DevTest Labs to fulfill the teams' scenarios and use cases.
1. Evaluate success and lessons learned.

Key [DevTest Labs scenarios](devtest-lab-guidance-get-started.md) include cloud development, testing, and training environments. Use cases include:

- Creating developer desktops.
- Configuring test environments.
- Enabling VM and Azure resource access.
- Setting up sandboxes for learning and experimentation.
- Configuring lab policies and cost controls that comply with corporate regulations.

## Prerequisites 

To successfully complete a DevTest Labs proof of concept, fulfill the following prerequisites:

### Learn the basics

Learn about Azure and DevTest Labs by using the following resources:

- [Understand the Azure portal](https://azure.microsoft.com/features/azure-portal)
- [DevTest Labs overview](devtest-lab-overview.md)
- [DevTest Labs scenarios](devtest-lab-guidance-get-started.md)
- [DevTest Labs enterprise reference architecture](devtest-lab-reference-architecture.md)

### Understand enterprise focus areas

Common concerns for enterprises that migrate workloads to the cloud include:

- [Securing development/testing resources](devtest-lab-guidance-governance-policy-compliance.md)
- [Managing and understanding costs](devtest-lab-guidance-governance-cost-ownership.md)
- Enabling self-service for developers without compromising enterprise security and compliance
- Automating and extending DevTest Labs to cover additional scenarios
- [Scaling a DevTest Labs-based solution to thousands of resources](devtest-lab-guidance-scale.md)
- [Large-scale deployments of DevTest Labs](devtest-lab-guidance-orchestrate-implementation.md)
- [Getting started with a proof of concept](devtest-lab-guidance-orchestrate-implementation.md)
### Get an Azure subscription

- Enterprises with an existing [Enterprise Agreement](https://azure.microsoft.com/pricing/purchase-options/enterprise-agreement) that enables access to Azure can use an existing or new subscription for DevTest Labs. If there's an Enterprise Agreement in place, an [Enterprise Dev/Test subscription](https://azure.microsoft.com/offers/ms-azr-0148p/) gives you access to Windows 10/Windows 8.1 client operating systems, and discounted rates for development and testing workloads.

- Alternatively, you can use a [Visual Studio subscription](https://azure.microsoft.com/pricing/member-offers/visual-studio-subscriptions) for the pilot deployment, and take advantage of free Azure credits.

- You can also create and use a [free Azure account](https://azure.microsoft.com/free/search/?&OCID=AID719825_SEM_g4lyBqgB&lnkd=Bing_Azure_Brand&msclkid=ecc4275a31b61375749e7a5322c20de8&dclid=CMGW5-m78-ICFaLt4QodmUwGtQ) for the pilot.
 
-  To use Windows client OS images (Windows 7 or a later version) for your development or testing in Azure, take one of the following steps:
    - [Buy an MSDN subscription](https://www.visualstudio.com/products/how-to-buy-vs).
    - If you have an Enterprise Agreement, create an Azure subscription with the [Enterprise Dev/Test offer](https://azure.microsoft.com/offers/ms-azr-0148p).
     
    For more information about the Azure credits for each MSDN offering, see [Monthly Azure credit for Visual Studio subscribers](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/).
          

<a name='enroll-all-users-in-azure-ad'></a>

### Enroll all users in Microsoft Entra ID

For management, such as adding users or adding lab owners, all lab users must belong to the [Microsoft Entra ID](https://azure.microsoft.com/services/active-directory) tenant for the Azure subscription the pilot uses. Many enterprises set up [hybrid identity](../active-directory/hybrid/whatis-hybrid-identity.md) to enable users to use their on-premises identities in the cloud. You don't need a hybrid identity for a DevTest Labs proof of concept.

## Scope the proof of concept

The focus of the pilot is to use the minimum necessary workloads and dependencies to decide whether Azure DevTest Labs is right for your enterprise. Choose the simplest workload with the fewest dependencies to help ensure quick and clean success. Or, pick the most representative workload that exposes potential complexities, so you can replicate pilot success in the [scale-out phase](devtest-lab-guidance-scale.md).

Plan the proof of concept carefully before you start the implementation. Be sure to set appropriate expectations with users that the pilot resources won't stay around indefinitely.

Do these tasks to scope the pilot:

- Define goals and success criteria.
- List a small set of workloads or scenarios for the pilot to cover.
- Determine what resources the lab must make available, such as custom images or Marketplace images.
- Decide on network topology and lab policies.
- Choose the users and teams to be involved in the pilot and to verify the results.
- Decide on the pilot duration, such as two weeks or a month.
- Decide how to dispose of the pilot resources when the pilot ends.

There's a tendency to try to make the pilot perfect, so it will mirror the final state after DevTest Labs rollout. However, trying to make the proof of concept perfect means too much effort before you can start the pilot. The purpose of the pilot is to determine the right decisions for scaling up and rolling out the final service.

## Make other planning and design decisions

A full DevTest Labs solution includes some important planning and design decisions. The proof of concept can help you make these decisions. Further considerations include:

### Subscription topology

The enterprise-level requirements for resources in Azure can extend beyond the [available quotas within a single subscription](../azure-resource-manager/management/azure-subscription-service-limits.md). You might need several Azure subscriptions, or you might need to make service requests to increase initial subscription limits. For more information, see [Scalability considerations](devtest-lab-reference-architecture.md#scalability-considerations).

It's important to decide how to distribute resources across subscriptions before final, full-scale rollout, because it's difficult to move resources to another subscription later. For example, you can't move a lab to another subscription after it's created. The [Subscription decision guide](/azure/architecture/cloud-adoption/decision-guides/subscriptions) is a valuable planning resource.

### Network topology

The [default network infrastructure](../app-service/networking-features.md) that DevTest Labs automatically creates might not meet requirements and constraints for enterprise users. For example, enterprises often use:

- [Azure ExpressRoute-connected virtual networks](/azure/architecture/reference-architectures/hybrid-networking) for connecting on-premises networks to Azure.
- [Peered virtual networks](../virtual-network/virtual-network-peering-overview.md) in a [hub-spoke configuration](/azure/architecture/reference-architectures/hybrid-networking/hub-spoke) for connecting virtual networks across subscriptions.
- [Forced tunneling](../vpn-gateway/vpn-gateway-forced-tunneling-rm.md) to limit traffic to on-premises networks.

For more information, see [Networking components](devtest-lab-reference-architecture.md#networking-components).

DevTest Labs also supports adding existing virtual networks to the lab to use for creating new VMs. For more information, see [Add a virtual network in Azure DevTest Labs](devtest-lab-configure-vnet.md).

### Virtual machine remote access

There are several options for enterprise users to remotely access DevTest Labs VMs:

- The easiest and most secure method is to use browser connectivity through Azure Bastion. The VMs don't need to use public IP addresses. For more information, see [Enable browser connection to DevTest Labs VMs with Azure Bastion](enable-browser-connection-lab-virtual-machines.md).

- Another option is to use public IPs or [shared public IPs](devtest-lab-shared-ip.md), and connect through Remote Desktop Protocol (RDP) or secure shell (SSH).

- If the preceding options aren't sufficient, you can connect through a remote access gateway, as shown in the [DevTest Labs enterprise reference architecture](devtest-lab-reference-architecture.md). For more information, see [Configure a lab to use Remote Desktop Gateway](configure-lab-remote-desktop-gateway.md).

- Enterprises can also connect their labs to their on-premises networks through ExpressRoute or a site-to-site VPN. This option enables direct RDP or SSH connections to the VMs based on their private IP addresses, with no exposure to the internet.

### Lab access and permissions

Before final DevTest Labs rollout, it's important to decide broadly who to give each level of lab access. The two key DevTest Labs [permission levels](devtest-lab-add-devtest-user.md) are Owner and DevTest Labs User. A common model is for the budget owner, such as the team lead, to be the lab owner, with the team members as lab users. The person responsible for the budget can then adjust lab policy settings and keep the team within budget.

## Complete the proof of concept 

After you cover the defined scenarios, complete the pilot. Gather feedback from the users, determine if the pilot was successful, and decide if the organization will move ahead on an enterprise-scale DevTest Labs rollout. Start to consider automating deployment of DevTest Labs and associated resources to ensure consistency throughout the scaled rollout.

## Example proof-of-concept plan

This following example shows a plan for scoping a DevTest Labs proof of concept deployment.

### Overview

An enterprise plans to develop a new Azure DevTest Labs environment for vendors to use, which is isolated from the corporate network. To determine if the solution will meet the requirements, the organization develops a proof of concept to validate the end-to-end scenario.

### Goals

The proof of concept has the following goals:

- A working end-to-end solution for vendors using Microsoft Entra guest accounts to access an isolated Azure environment.
- A DevTest Labs environment with all the necessary resources for vendors to be productive.
- Identification and understanding of any potential blocking issues that affect broader use and adoption.
- Good understanding of all code and collateral by the individuals developing the solution.
- Confidence in the broader adoption by all participants.

### Requirements

The solution has the following requirements:

- Vendor teams can use a set of labs in Azure DevTest Labs.
- The vendors have access to the labs via Microsoft Entra ID and role assignments.
- Vendors have a way to successfully connect to their resources, such as a site-to-site VPN that enables accessing VMs without using public IP addresses.
- The labs connect to a network infrastructure that supports the requirements.
- DevTest Labs installs the set of software artifacts that vendors need on the VMs.

### Prerequisites 

- A subscription to use for the project
- A Microsoft Entra tenant, and a Microsoft Entra Global Administrator who can provide Microsoft Entra ID help and guidance
- Ways for project members to collaborate, such as:
  - Azure Repos for source code and scripts
  - Microsoft Teams or SharePoint for documents
  - Microsoft Teams for conversations
  - Azure Boards for work items

### Setup tasks

- Decide what Azure region to use for the proof of concept.
- Decide whether to join lab VMs to the Microsoft Entra domain, and whether to use Microsoft Entra Domain Services or another method.
- Identify the vendors who will use the proof of concept environment.
- Determine the required resources for the vendors, such as software available on the VMs.
- Decide on the Azure services, other than VMs, that the vendors can use in DevTest Labs.
- Plan how to train vendors to use the lab.

## Next steps 

- [Scale up a DevTest Labs deployment](devtest-lab-guidance-orchestrate-implementation.md)
- [Orchestrate DevTest Labs implementation](devtest-lab-guidance-orchestrate-implementation.md)
