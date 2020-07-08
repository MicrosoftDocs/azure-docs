---
title: Deliver a proof of concept - Azure DevTest Labs | Microsoft Docs
description: Learn how to deliver a proof of concept so Azure DevTest Labs can be successfully incorporated into an enterprise environment.
ms.topic: article
ms.date: 06/2/2020
---

# Deliver a proof of concept 

One of the key scenarios for Azure DevTest Labs is enabling development and testing environments in the cloud. Examples include:

* Creating developer desktops in the cloud.
* Configuring environments for testing.
* Enabling access to virtual machines and other Azure resources.
* Setting up a sandbox area for developers to learn and experiment.

DevTest Labs also provides the policy guardrails and cost controls to empower the enterprise to provide “self-serve Azure” to developers that adhere to corporate security, regulatory, and compliance policies. 

Every enterprise has different requirements for how Azure DevTest Labs can be successfully incorporated into their environment. This article describes the most common steps that enterprises need to complete to ensure a successful proof of concept. A proof of concept is the first step toward a successful end-to-end deployment. 

## Getting started 

To get started on delivering a proof of concept. It’s important to spend some time to learn about Azure and DevTest Labs.  Here are some starting resources: 

* [Understanding the Azure portal](https://azure.microsoft.com/features/azure-portal/)
* [Basics of DevTest Labs](devtest-lab-overview.md)
* [DevTest Labs supported scenarios](devtest-lab-guidance-get-started.md)
* [DevTest Labs enterprise documentation](devtest-lab-guidance-prescriptive-adoption.md)
* [Intro to Azure networking](../virtual-network/virtual-networks-overview.md)

## Prerequisites 

To successfully complete a pilot or proof of concept with DevTest Labs, there are a few prerequisites: 

* **Azure subscription**: Enterprises often have an existing [Enterprise Agreement](https://azure.microsoft.com/pricing/purchase-options/enterprise-agreement/) in place that enables access to Azure, and they can use an existing or new subscription for DevTest Labs. Alternatively, enterprises can use a [Visual Studio subscription](https://azure.microsoft.com/pricing/member-offers/visual-studio-subscriptions/) during the pilot (taking advantage of the free Azure credits). If neither of those options is available, an enterprise can create and use a [free Azure account](https://azure.microsoft.com/free/search/?&OCID=AID719825_SEM_g4lyBqgB&lnkd=Bing_Azure_Brand&msclkid=ecc4275a31b61375749e7a5322c20de8&dclid=CMGW5-m78-ICFaLt4QodmUwGtQ). If there is an Enterprise Agreement in place, using an [Enterprise Dev/Test subscription](https://azure.microsoft.com/offers/ms-azr-0148p/) is a great option to get access to Windows 10/Windows 8.1 client operating systems and discounted rates for development and testing workloads. 
* **Azure Active Directory tenant**: To enable managing users (for example, adding users or adding lab owners), those users must be a part of the [Azure Active Directory tenant](https://azure.microsoft.com/services/active-directory/) used in the Azure subscription for the pilot. Often enterprises will set up [hybrid identity](../active-directory/hybrid/whatis-hybrid-identity.md) to enable users to use their on-premises identity in the cloud, but this is not required for the DevTest Labs pilot. 

## Scoping of the pilot 

It's important to plan a pilot before you start the implementation. Knowing in advance that the resources won’t stay around indefinitely sets appropriate expectations for users of the pilot. 

> [!IMPORTANT]
> We can't emphasize enough the importance of crisply scoping the pilot and setting expectations up front.

Answer these key questions before you kick off the pilot: 

* What do you want to learn, and what does success look like for the pilot? 
* What workloads or scenarios will be covered in the pilot? It’s important to define only a small set to ensure that the pilot can be scoped and completed quickly. 
* What resources must be available in the lab? For example: custom images, marketplace images, policies, network topology. 
* Who are the users and teams that will be involved in the pilot to verify the experience?  
* What is the duration of the pilot? Choose a timeframe that aligns well to planned scope, like two weeks or one month. 
* After the pilot is complete, what will happen with the allocated resources that were used during the pilot? Do you plan to discard the pilot resources? You might think:
   
   "If we can plan on throwing away the virtual machines and labs at the end of the pilot, then we can set up a single subscription for the pilot and do all our work there while we resolve the scale rollout questions in parallel." 

There's a general tendency to make the pilot "perfect" so it identically represents what the final state will be after the service is rolled out at the company. This is a false assumption. The closer you get to "perfect," the more you have to complete *before* getting started on the pilot. The purpose of the pilot is to make the right decisions on scaling up and rolling out the final service. 

The focus of the pilot should be on picking the minimum necessary workloads and dependencies in order to answer the question of whether Azure DevTest Labs is the right service for your enterprise. We recommend that you choose the simplest workload with the least dependencies to help ensure a quick and clean success. If that isn't possible, pick a most representative workload that exposes potential complexities so that success in the pilot phase can be replicated in the scale-out phase. 

The following example demonstrates a well-scoped proof of concept. 

## Example: proof-of-concept plan 

This section shows a sample to use for scoping a proof of concept of the pilot for DevTest Labs. 

> [!TIP]
> To minimize the possibility of setting up your project for failure, we highly recommend that you don't skip the example described in this section. 

### Overview 

We're planning to develop a new environment in Azure based on DevTest Labs for vendors to use as an isolated environment from the corporate network. To determine if the solution will meet the requirements, we'll develop a proof of concept to validate the end-to-end solution. We've included several vendors to try out and verify the experience. 

### Outcomes 

When building a proof of concept, we focus first on the outcomes (what are we trying to achieve). By the end of the proof of concept, we expect: 

* A working end-to-end solution for vendors to use guest accounts in Azure Active Directory (Azure AD) to access an isolated environment in Azure. The environment has the resources required for them to be productive. 
* Any potential blocking issues that affect broader scale use and adoption are enumerated and understood.
* The individuals involved in developing the proof of concept have a good understanding of all code. They also understand collateral involved and are confident in broader adoption.

### Open questions and prerequisites 

* Do we have a subscription created that we can use for this project? 
* Do we have an Azure AD tenant and an Azure AD global admin identified who can provide help and guidance for Azure AD-related questions? 
* Do we have a place to collaborate for the individuals working on the project? 

   * Source code and scripts (like Azure Repos) 
   * Documents (like Microsoft Teams or SharePoint)  
   * Conversations (like Microsoft Teams) 
   * Work items (like Azure Boards) 
* What are the required resources for vendors? This includes applications available on the network, both locally on the virtual machines and on other required servers. 
* Will the virtual machines be joined to a domain in Azure? If so, will this be Azure Active Directory Domain Services (Azure AD DS) or something else? 
* Have we identified the team or vendors that will be the target of the proof of concept? Who will be the customers for the environment?
* Which Azure region will we use for the proof of concept? 
* Do we have a list of services the vendors are allowed to use via DevTest Labs besides IaaS (VMs)? 
* How do we plan to train vendors/users on using the lab? 

### Components of the proof-of-concept solution 

We are expecting the solution to have the following components: 

* Various vendor teams will use a set of labs in Azure.
* The labs are connected to a network infrastructure that supports the requirements.
* The vendors have access to the labs via Azure AD and role assignments.
* Vendors have a way to successfully connect to their resources. Specifically, a site-to-site VPN enables accessing virtual machines directly without public IP addresses.
* A set of artifacts covers the required software that the vendors need on the virtual machines.

## Additional planning and design decisions 

Before you release a full DevTest Labs solution, you have to make some important planning and design decisions. The experience of working on a proof of concept can help you make these decisions. Further consideration includes: 

* **Subscription topology**: The enterprise-level requirements for resources in Azure can extend beyond the [available quotas within a single subscription](https://docs.microsoft.com/azure/azure-resource-manager/management/azure-subscription-service-limits). This necessitates multiple Azure subscriptions and/or service requests to increase initial subscription limits. It’s important to decide up front how to distribute resources across subscriptions. One valuable resource is the [subscription decision guide](https://docs.microsoft.com/azure/architecture/cloud-adoption/decision-guides/subscriptions/) because it’s difficult to move resources to another subscription later. For example, a lab can't be moved to another subscription after it’s created.  
* **Network topology**: The [default network infrastructure](../app-service/networking-features.md) that DevTest Labs automatically creates might not be sufficient to meet the requirements and constraints for the enterprise users. It’s common to see [Azure ExpressRoute connected virtual networks](https://docs.microsoft.com/azure/architecture/reference-architectures/hybrid-networking/), [hub-and-spoke](https://docs.microsoft.com/azure/architecture/reference-architectures/hybrid-networking/hub-spoke) for connectivity across subscriptions, and even [forced routing](../vpn-gateway/vpn-gateway-forced-tunneling-rm.md) to ensure on-premises connectivity only. DevTest Labs allows for existing virtual networks to be connected to the lab to enable their use when you're creating new virtual machines in the lab. 
* **Remote access of virtual machines**: There are many options to remotely access the virtual machines located in DevTest Labs. The easiest is to use public IPs or shared public IPs. These are [settings available in the lab](devtest-lab-shared-ip.md). If these options aren’t sufficient, using a remote access gateway is also an option. This option is shown on the [DevTest Labs enterprise reference architecture](devtest-lab-reference-architecture.md) and described further in the [DevTest Labs remote desktop gateway documentation](configure-lab-remote-desktop-gateway.md). Enterprises can also use ExpressRoute or a site-to-site VPN to connect their labs to their on-premises network. This option enables direct remote desktop or SSH connections to the virtual machines based on their private IP address with no exposure to the internet. 
* **Handling permissions**: The two key permissions commonly used in DevTest Labs are [Owner and Lab User](devtest-lab-add-devtest-user.md). It’s important to decide before rolling out DevTest Labs broadly who will be entrusted with each level of access in the lab. A common model is the budget owner (team lead, for example) as the lab owner and the team members as lab users. This model enables the person (team lead) responsible for the budget to adjust the policy settings and keep the team within budget.  

## Completing the proof of concept 

After the expected learnings have been covered, it’s time to complete the pilot. This is the time to gather feedback from the users, determine if the pilot was successful, and decide if the organization will move ahead on a scale rollout of DevTest Labs in the enterprise. It’s also a great time to consider automating deployment of DevTest Labs and associated resources to ensure consistency throughout the scale rollout. 

## Next steps 

* [DevTest Labs enterprise documentation](devtest-lab-guidance-prescriptive-adoption.md)
* [Reference architecture for an enterprise](devtest-lab-reference-architecture.md)
* [Scaling up your DevTest Labs deployment](devtest-lab-guidance-orchestrate-implementation.md)
* [Orchestrate the implementation of Azure DevTest Labs](devtest-lab-guidance-orchestrate-implementation.md)
