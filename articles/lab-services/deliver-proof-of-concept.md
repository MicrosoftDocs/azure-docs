---
title: Deliver a proof of concept - Azure DevTest Labs  
description: Learn how to deliver a proof of concept so Azure DevTest Labs can be successfully incorporated into an enterprise environment.
services: devtest-lab,virtual-machines,lab-services
documentationcenter: na
author: Juliako
manager: femila
editor: ''

ms.service: lab-services
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/23/2018
ms.author: juliako

---

# Delivering a proof of concept 

One of the key scenarios for Azure DevTest Labs is enabling development and testing environments in the cloud. Examples include:

* Creating developer desktops in the cloud
* Configuring environments for testing
* Enabling access to virtual machines and other Azure resource
* Setting up a sandbox area for developers to learn and experiment

DevTest Labs also provides the policy guardrails and cost controls to empower the enterprise to provide “self-serve Azure” to developers that adhere to corporate security, regulatory, and compliance policies. 

Every enterprise has different requirements on how Azure DevTest Labs can be successfully incorporated into their environment. This article describes the most common steps enterprises typically need to complete to ensure a successful proof of concept, which is the first step toward a successful end to end deployment. 

## Getting Started 

To get started on delivering a proof of concept. It’s important to spend some time to learn about Azure and DevTest Labs.  Here are some starting resources: 

* [Understanding the Azure portal]()
* [Basics of DevTest Labs]()
* [DevTest Labs Supported Scenarios]()
* [DevTest Labs Enterprise Documentation]()
* [Intro to Azure Networking]()

## Prerequisites 

To successfully complete a pilot or proof of concept with DevTest Labs, there are a few prerequisites needed: 

* **Azure subscription**: Enterprises often have an existing [Enterprise Agreement]() in place that enables access to Azure and an existing or new subscription can be used for DevTest Labs. Alternatively, a [Visual Studio Subscription]() can be used during the pilot (leveraging the free Azure Credits). If neither of those options are available, a [free Azure account]() can be created and used. If there is an Enterprise Agreement in place, using an [Enterprise Dev/Test subscription]() is a great option to get access to Windows 10/Windows 8.1 client operating systems and discounted rates for development and testing workloads. 
* **Azure Active Directory tenant**:  To enable managing users (adding users, adding lab owners for example), those users must be a part of the [Azure Active Directory Tenant]() used in the Azure Subscription for the pilot. Often enterprises will set up [hybrid identity]() to enable users to leverage their on-premises identity in the cloud but this is not required for the DevTest Labs pilot. 

## Scoping of the pilot 

It is very important to plan a proper pilot before you start the implementation. Knowing in advance that the resources won’t stay around indefinitely, sets appropriate expectations for users of the pilot. 

> [!NOTE]
> We can't emphasize enough the importance of crisply scoping the pilot and setting expectation upfront.

There are key questions to answer before kicking off the pilot: 

* What do you want to learn and what does success look like for the pilot? 
* What workload(s) or scenario(s) will be covered in the pilot? It’s important to define only a small set to ensure that the pilot can be scoped and completed quickly. 
* What resources must be available in the lab? For example: custom images, marketplace images, policies, networking topology, etc. 
* Who are the end users/teams that will be involved in the pilot to verify the experience?  
* What is the duration of the pilot? Choose a timeframe that aligns well to planned scope like two weeks or one month. 
* Once the pilot is complete, what will happen with the allocated resources that were used during the pilot? Do you plan to discard the pilot resources?
   
   If we can plan on throwing away the virtual machines and labs at the end of the pilot, then we can simply setup a single subscription for the pilot and do all our work there while we resolve the scale rollout questions in parallel. 

There is a general tendency to make the pilot "perfect" so it identically represents what the final state will be once the service is rolled out at the company. This is a false assumption. The closer you get to "perfect" the more you have to complete *before* getting started on the pilot. The purpose of the pilot is to make the right decisions on scaling up and rolling out the final service. 

The focus of the pilot should be on picking the absolute minimum necessary workloads and dependencies in order to answer the question of whether Azure DevTest Labs is the right service for your enterprise. It is advisable to choose the simplest workload with the least dependencies to ensure a quicker and clean success. If that is not possible, the next best option is to pick a most representative workload that exposes potential complexities so that success in the pilot phase can be replicated in the scale-out phase. 

The following example demonstrates a well scoped proof of concept. 

## Example: proof of concept plan 

This section shows a sample to use for scoping a proof of concept of the pilot for DevTest Labs. 

> [!TIP]
> To minimize the possibility of setting up your project for failure, we highly recommand that you do not skip the example described in this section. 

### Overview 

We are planning on developing a new environment in Azure based on DevTest Labs for vendors to use as an isolated environment from the corporate network. To determine if the solution will meet the requirements, we will develop a proof of concept to validate the end to end solution and have included several vendors to try out and verify the experience. 

### Outcomes 

When building a proof of concept, we focus first on the outcomes (what are we trying to achieve) – those are listed here.  By the end of the proof of concept, we expect: 

* A working end to end solution for vendors to leverage guest accounts in Azure Active Directory (Azure AD) to access an isolated environment in Azure that has the resources required for them to be productive. 
* Any potential blocking issues impacting broader scale use and adoption are enumerated and understood.
* The individuals involved in developing the proof of concept have a good understanding of all code. They also understand  collateral involved and are confident in broader adoption.

### Open questions & prerequisites 

* Do we have a subscription created that we could use for this project? 
* Do we have an Azure AD tenant and an Azure AD Global Admin identified who can provide help & guidance for Azure AD-related questions? 
* A place to collaborate for the individuals working on the project: 

   * Source code and scripts (like Azure Repos) 
   * Documents (like Teams or Sharepoint)  
   * Conversations (like Microsoft Teams) 
   * Work items (like Azure Boards) 
* What are the required resources for vendors? This includes both locally on the virtual machines and other required servers, applications available on the network. 
* Will the virtual machines be joined to a domain in Azure? If so, will this be Azure AD Domain Services or something else? 
* Do we have the team/vendors identified that will be the target of the proof of concept? Who will be the customers for the environment?
* Which Azure region will we use for the proof of concept? 
* Do we have a list of services the vendors are allowed to use via DevTest Labs besides IaaS (VMs)? 
* How do we plan on training vendors/users on using the lab? 

### Proof of concept solution components 

We are expecting the solution to have the following components: 

* A set of DevTest Labs in Azure for various vendor teams.
* The labs are connected to a networking infrastructure, which supports the requirements.
* The vendors have access to the labs via Azure AD and granting role assignments to the lab.
* A way for vendors to successfully connect to their resources. Specifically, a site-to-site VPN to enable accessing virtual machines directly without public IP addresses.
* A set of artifacts that cover the required software needed by the vendors on the virtual machines.

## Additional planning and design decisions 

Before releasing a full DevTest Labs solution, there are some important planning and design decisions to be made. The experience of working on a proof of concept can help you make these decisions. Further consideration includes: 

* **Subscription topology**: The enterprise-level requirements for resources in Azure can extend beyond the available quotas within a single subscription, which necessitates multiple azure subscriptions and/or service requests to increase initial subscription limits. It’s important to decide up front how to distribute resources across subscriptions, one valuable resource is the [Subscription Decision Guide]() since it’s difficult to move resources to another subscription later. For example, a DevTest Lab cannot be moved to another subscription after it’s created.  
* **Networking topology**: The [default networking infrastructure]() that’s automatically created by DevTest Labs may not be sufficient to meet the requirements and constraints for the enterprise users. It’s common to see [Express Route connected VNets](), [Hub-and-spoke]() for connectivity across subscriptions and even [forced routing]() ensuring on-premises connectivity only. DevTest Lab allows for existing virtual networks to be connected to the lab to enable their use when creating new virtual machines in the lab. 
* **Remot access of Virtual Machines**: There are many options to remotely access the virtual machines located in the DevTest Lab. The easiest is to use public IPs or shared public IPs, these are [settings available in the lab](). If these options aren’t sufficient, using a Remote Access Gateway is also an option as shown on the [DevTest Labs Enterprise Reference Architecture]() and described further in the [DevTest Labs Remote Desktop Gateway documentation](). Enterprises can also use Express Route or a Site-To-Site VPN to connect their DevTest Labs to their on-premises network. This enables direct remote desktop or SSH connections to the Virtual Machines based on their private IP address with no exposure to the internet. 
* **Handling permissions**: The two key permissions commonly used in DevTest Labs is [“Owner” and “Lab User”](). It’s important to decide before rolling out DevTest Labs broadly who will be entrusted with each level of access in the lab. A common model is the budget owner (team lead for example) as the lab owner and the team members as lab users. This enables the person (team lead) responsible for the budget to adjust the policy settings to keep the team within budget.  

## Completing the proof of concept 

Once the expected learnings have been covered it’s time to wrap up and complete the pilot. This is the time to gather feedback from the users, determine if the pilot was successful and decide if the organization will move ahead on a scale roll out of DevTest Labs in the enterprise. It’s also a great time to consider automating deployment of DevTest Labs and associated resources to ensure consistency throughout the scale roll out. 

## Next Steps 

* [DevTest Labs Enterprise Documentation]()
* [Reference Architecture for an enterprise]()
* [Scaling up your DevTest Labs Deployment]()
* [Orchestrate the implementation of Azure DevTest Labs]()
