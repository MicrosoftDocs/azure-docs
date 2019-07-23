# Delivering a proof of concept 

One of the key scenarios for Azure DevTest Labs is enabling development and testing in the cloud.  This includes developer desktops in the cloud, environments for testing, access to virtual machines AND other Azure resources, sandbox area for developers to learn and experiment, etc.   DevTest Labs also provides the policy guardrails and cost controls to empower the Enterprise to provide “self-serve Azure” to developers that adhere to corporate security, regulatory, and compliance policies. 

Every enterprise has different requirements and determining how Azure DevTest Labs can be successfully incorporated into an enterprise requires effort and planning.  This article is focused on listing out the most common steps enterprises typically complete to ensure a successful proof of concept, which is the first step toward a successful end to end deployment. 

## Getting Started 

To get started on delivering a proof of concept. It’s important to spend some time to learn about Azure and DevTest Labs.  Here are some starting resources: 

* [Understanding the Azure portal]()
* [Basics of DevTest Labs]()
* [DevTest Labs Supported Scenarios]()
* [DevTest Labs Enterprise Documentation]()
* [Intro to Azure Networking]()

## Prerequisites 

To successfully complete a pilot or proof of concept with DevTest Labs, there are a few prerequisites needed: 

* **Azure Subscription**: Enterprises often have an existing [Enterprise Agreement]() in place that enables access to Azure and an existing or new subscription can be used for DevTest Labs. Alternatively, a [Visual Studio Subscription]() can be used during the pilot (leveraging the free Azure Credits). If neither of those options are available, a [free Azure account]() can be created and used. If there is an Enterprise Agreement in place, using an [Enterprise Dev/Test subscription]() is a great option to get access to Windows 10/Windows 8.1 client operating systems and discounted rates for Development and Testing workloads. 
* **Azure Active Directory tenant**:  To enable managing users (adding users, adding lab owners for example), those users must be a part of the [Azure Active Directory Tenant]() used in the Azure Subscription for the pilot. Often enterprises will set up [hybrid identity]() to enable users to leverage their on-premises identity in the cloud but this is not required for the DevTest Labs pilot. 

## Scoping of the Pilot 

It is very important to plan a proper pilot before you start the implementation. There are key questions to answer before kicking off a pilot: 

* What does success look like for the pilot? Or, what do we want to learn? 
* What workload(s) or scenario(s) will be covered in the pilot?  It’s important to define only a small set to ensure that the pilot can be scoped and completed quickly. 
* What resources must be available in the lab?  For example:  custom images, marketplace images, policies, networking topology, etc. 
* Who are the end users/teams that will be involved in the pilot to verify the experience?  
* What is the duration of the pilot?  Choose a timeframe that aligns well to planned scope like two weeks or one month. 
* Once the pilot is complete, what happens with the existing resources that were used during the pilot?  What’s worked best for customers is planning to discard the pilot resources so there is no migration needed to move to the final solution.  It also sets expectations well with users of the pilot if they know in advance that the resources won’t stay around indefinitely.  

There is a general tendency to make the pilot ‘perfect’ so it identically represents what the final state will be once the service is rolled out at the company.  This is a trap!  The closer we get to ‘perfect’ the more we have complete *before* getting started on the pilot, but we NEED the pilot so we can make the right decisions on scaling up and rolling out.  The focus of the pilot should be absolute minimum necessary to answer the question if Azure DevTest Labs is the right service for your enterprise.  To that end, it is advisable to pick the simplest workload with the least dependencies to ensure a quicker and clean success.  If that is not possible, the next best option is to pick a most representative workload that exposes potential complexities so that success in the pilot phase can be replicated in the scale-out phase. 

Prior to starting a pilot, you should focus on what’s absolutely necessary for your pilot to start with. In other words, if we can plan on throwing away the virtual machines and labs at the end of the pilot, then we can simply setup a single subscription for the pilot and do all our work there while we resolve the scale rollout questions in parallel. 

We can't emphasize enough the importance of crisply scoping the pilot and setting expectation upfront.  There is an example listed below for a well scoped proof of concept to help illustrate.  Skipping this step is likely to set up the project for failure from scope creep and mismatched expectations. 

## Example proof of concept plan 

Here is a sample to use for scoping a proof of concept or pilot for DevTest Labs: 

### Overview 

We are planning on developing a new environment in Azure based on DevTest Labs for vendors to use as an isolated environment from the corporate network.  To determine if the solution will meet the requirements, we will develop a proof of concept to validate the end to end solution and have included several vendors to try out and verify the experience. 

### Outcomes 

When building a proof of concept, we focus first on the outcomes (what are we trying to achieve) – those are listed here.  By the end of the proof of concept, we expect: 

* A working end to end solution for vendors to leverage guest accounts in AAD to access an isolated environment in Azure that has the resources required for them to be productive 
* Any potential blocking issues impacting broader scale use and adoption are enumerated and understood 
* The individuals involved in developing the proof of concept have a good understanding of all code & collateral involved and are confident in broader adoption 

### Open questions & prerequisites 

* Do we have a subscription created that we could use for this project? 
* Do we have an AAD tenant and an AAD Global Admin identified who can provide help & guidance for AAD-related questions? 
* A place to collaborate for the individuals working on the project: 

   * Source Code & Scripts (like Azure Repos) 
   * Documents (like Teams or Sharepoint)  
   * Conversations (like Microsoft Teams) 
   * Work items (like Azure Boards) 
* What are the required resources for vendors?  This includes both locally on the virtual machines and other required servers, applications, etc., available on the network. 
* Will the virtual machines be joined to a domain in Azure?  If so, will this be AAD Domain Services or something else? 
* Do we have the team/vendors identified that will be the target of the POC?  (essentially the ‘customers’ for the environment) This ensures that we build something that works! 
* Which Azure region will we use for the POC? 
* Do we have a list of services the vendors are allowed to use via DevTest Labs besides IaaS (VMs)? 
* How do we plan on training vendors/users on using the lab? 

### Proof of concept solution components 

We are expecting the solution to have the following components: 

* A set of DevTest Labs in Azure for various vendor teams 
* The labs are connected to a networking infrastructure, which supports the requirements 
* The vendors have access to the labs via AAD & granting role assignments to the lab 
* A way for vendors to successfully connect to their resources. Specifically, a site-to-site VPN to enable accessing virtual machines directly without public IP addresses 
* A set of artifacts that cover the required software needed by the vendors on the virtual machines 

## Additional planning and design decisions 

Before releasing a full DevTest Labs solution, there are some important planning and design decisions to be made.  The experience of working on a proof of concept can help you make these decisions.  Further consideration includes: 

* **Subscription Topology**: The enterprise-level requirements for resources in Azure can extend beyond the [available quotas within a single subscription, which necessitates multiple azure subscriptions and/or service requests to increase initial subscription limits. It’s important to decide up front how to distribute resources across subscriptions, one valuable resource is the [Subscription Decision Guide]() since it’s difficult to move resources to another subscription later.  For example, a DevTest Lab cannot be moved to another subscription after it’s created.  
* **Networking Topology**: The [default networking infrastructure]() that’s automatically created by DevTest Labs may not be sufficient to meet the requirements and constraints for the enterprise users. It’s common to see [Express Route connected VNets](), [Hub-and-spoke]() for connectivity across subscriptions and even [forced routing]() ensuring on-premises connectivity only.  DevTest Lab allows for existing virtual networks to be connected to the lab to enable their use when creating new virtual machines in the lab. 
* **Remotely Accessing the Virtual Machines**: There are many options to remotely access the virtual machines located in the DevTest Lab. The easiest is to use Public IPs or Shared Public IPs, these are [settings available in the lab](). If these options aren’t sufficient, using a Remote Access Gateway is also an option as shown on the [DevTest Labs Enterprise Reference Architecture]() and described further in the [DevTest Labs Remote Desktop Gateway documentation](). Enterprises can also use Express Route or a Site-To-Site VPN to connect their DevTest Labs to their on-premises network. This enables direct remote desktop or SSH connections to the Virtual Machines based on their private IP address with no exposure to the internet. 
* **Handling Permissions**: The two key permissions commonly used in DevTest Labs is [“Owner” and “Lab User”]().  It’s important to decide before rolling out DevTest Labs broadly who will be entrusted with each level of access in the lab.  A common model is the budget owner (team lead for example) as the Lab Owner and the team members as Lab Users.  This enables the person (team lead) responsible for the budget to adjust the policy settings to keep the team within budget.  

## Completing the Proof of Concept 

Once the expected learnings have been covered it’s time to wrap up and complete the pilot.  This is the time to gather feedback from the users, determine if the pilot was successful and decide if the organization will move ahead on a scale roll out of DevTest Labs in the enterprise.  It’s also a great time to consider automating deployment of DevTest Labs and associated resources to ensure consistency throughout the scale roll out. 

## Next Steps 

* [DevTest Labs Enterprise Documentation]()
* [Reference Architecture for an enterprise]()
* [Scaling up your DevTest Labs Deployment]()
* [Orchestrate the implementation of Azure DevTest Labs]()