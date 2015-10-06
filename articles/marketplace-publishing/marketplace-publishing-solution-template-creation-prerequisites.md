<properties
   pageTitle="Technical Pre-requisites for creating a Solution Template for the Marketplace | Microsoft Azure"
   description="Understand the requirements for creating a Solution Template to deploy and sell on the Azure Marketplace"
   services="marketplace-publishing"
   documentationCenter=""
   authors="HannibalSII"
   manager=""
   editor=""/>

<tags
   ms.service="marketplace-publishing"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="10/05/2015"
   ms.author="hascipio; v-divte" />

# Technical Pre-requisites for creating a Solution Template for the Azure Marketplace
Read the process thoroughly before beginning and understand where and why each step is performed. As much as possible, you should prepare your company information and other data, download necessary tools, and/or create technical components before beginning the offer creation process. This items should be clear from reviewing this article.  

## Topology Definition & Platform Evaluation
At this point, you may already be familiar with Azure compute artifact and be thinking what exactly should I be building?  VM Images, extensions, ARM templates?  

Before trying to map your application to Azure artifacts, it will help to understand the different topologies that make sense for your solution that you would likely also recommend to a customer who considers deploying your application on-premises.  Most enterprises generally go through some variation of the following four stages: Evaluation, Proof of Concept, Pre-Production, and Production.   Usually, you are working with them through these different stages evaluating their requirements and recommending the exact layout and scale needed for their scenarios.
While every customer isn’t the same, generally we expect that there are common topologies and sizes that you recommend given the size of the customer deployment.  So even before beginning to develop any solutions, think through the different layouts that make sense for your application and what could meet a fair share of your customer’s needs without major customizations.  Again, we realize, that there will always be customers who need something very exact, but we are looking for the common case.

For each type of deployment – Evaluation, Proof of Concept, Pre-Production, and Production – think through the exact layout and topology needed for your application.  What are the different tiers?  What resources are needed for each tier and of what size?  What are the building blocks needed to create these resources?  A production deployment, or even a dev/test environment, can vary significantly in size depending on the customer and their needs.  Decide upon what a small, medium, large, and extra-large topology would look like for your workload and think through availability, scalability, and performance requirements needed to be successful.

Once you have thought through the different topology layouts and corresponding sizes (you may have most of this already complete with your experiences with on-premises deployments with customers), it’s time to start bringing it back to what Azure has to offer.  

Evaluate your topology requirements against what the Azure Resource Manager and Compute on Azure Resource Manager offers. While most customers will start with smaller deployments, **we strongly recommend that you evaluate the performance, scale, and capability requirements of your large topology on the Compute on Azure Resource manager even if you may not initially be onboarding a large topology.**  This is mostly to ensure that as customers begin to adopt your smaller solutions they have a substantial amount of room to grow successfully to larger scale deployments. Any scale, performance, or capability limitations should be raised  to your Microsoft counterparts to ensure that we continue to improve in the areas needed by you, our Marketplace partner, and in turn by your customers.

> [AZURE.TIP] **Recommended:** Evaluate and build a template to match the largest expected deployment size of your application in order to offer growth opportunities to your end customers.

## Azure Compute Building Blocks
Let’s start off by identifying what compute artifacts are available to you and how to think about your application in terms of these artifacts.
1.	Using Existing Virtual Machines

  The building blocks for any virtual machine are VM Images.  VM Images are the complete storage profile of a virtual machine, containing one operating system VHD and zero or more data disks.  You can create a VM Image to package your software application with the operating system bits, in addition to any additional data needed.  For example, today in the Azure marketplace, there are a handful of VM Images for SQL Server, which package the Windows operating system, with the SQL Server application.  While this document will not go into the details of creating and onboarding VM Images into the Azure Marketplace, it is important to understand what a VM image is, since it will likely be the building block to your application solution.  Please refer to steps for [Creating a VM Image for the Marketplace](marketplace-publishing-vm-image-creation.md).

2.	VM Extension

  Sometimes, an image isn’t what you may be looking for, since you do not want to own and manage the underlying operating system as an application provider.  In the Azure Marketplace today, there are a handful of operating system companies who publish Windows, Linux, and Unix operating systems on a regular basis.  You can find images for Windows Server, Ubuntu, CentOS-based, CoreOS, Oracle Linux, etc.  Instead of publishing your own VM Image, packaging both the operating system and application, you can consider writing a VM Extension Handler or leveraging an existing one.  A VM extension is a software mechanism to simplify VM configuration and management, which leverages the guest agent (a secured, light-weight process) in an Azure VM.  For example, the Custom Script Extension, takes in a custom script as the name suggests, and executes it within the VM.  This allows any sort of configuration that a generic script would allow.

  In a traditional image scenario, you would have installed all the bits on the image from the start, done any necessary configurations before or even possibly after VM start up (with a startup task).  This image could get very customized and would not necessarily be easily re-usable.  In some cases, this makes the most sense.  In others, especially with light-weight applications or more complicated configurations which require being done after the VM is provisioned, the extension model can help. Sometimes, customers deploy a combination of extensions and VM images to have both pre-installed solutions but also enable complex post-start-up configuration.

  Images and extensions are quite useful to configure a single VM, as you are well aware.  However, one VM is not sufficient to offer customers high availability in the cloud and scale to meet the needs of rowing traffic. Therefore, for any production workload, we highly recommend planning for a multi-VM high available solution using availability sets and load-balancing.

  >[AZURE.TIP] **Recommended:** All production workloads in the marketplace should be deployed using multiple Virtual Machines serving traffic into an Availability Set (with three fault domains) and with a load-balancer.

  To support these numerous  deployment topologies your application can support and recommend, the Azure Marketplace offers the Azure Resource Manager (ARM for short) and ARM templates. The Azure Resource Manager deploys and manages the lifecycle of a collection of resources through declarative, model-based template language.  This template is simply a parameterized JSON file which expresses the set of resources and their relationship to be used for deployments.  Each resources is placed in a resource group, which is simply a container for resources.  The Resource Manager also offers a set of very valuable additional capabilities to end-customers, including centralized operation auditing, resource tagging through to the customer bill, Resource Based Access Control for granular security, support for 3 compute Fault domains for highest availability, and all  its operations are idempotent.

  > [AZURE.IMPORTANT] **Mandatory:** Given the benefits for end-customers, all marketplace content must be deployed using Azure Resource Manager templates.  

  With ARM and ARM templates, you can express more complex deployments of Azure resources, such as Virtual Machines, Storage Accounts, and Virtual Networks, which build upon Marketplace content such as VM Images and VM Extensions.

## Developing building blocks
Once you have figured out your application topologies and which ones you will develop and onboard to the Marketplace in your first stage, it is time to identify and develop the VM building blocks.  As discussed above, you will have to decide whether you want to package the contents of the VM as your own published VM Image or to leverage an already existing VM Image in the Azure Marketplace, configuring it with a published extension handler or with your own handler.  There isn’t a single correct solution; it is highly dependent how much control you want around the underlying operating system and requirements on how you install, configure, and manage your application.You can find a good amount of information about images and extensions on MSDN and on the Azure Blogs.  A list of potentially useful articles can be found below in **See Also** section.

Note, that for any image or extension handler used, it must first be published through the Marketplace.  

## Developing ARM Templates
If you are new to Azure Resource Manager and ARM Templates, it may be worthwhile to review some of the documentation around Azure Resource Manager and Compute on Azure Resource Manager.  The guidance and examples provided below assume a basic level of understanding of the ARM Templating language and about how to use Compute with ARM.  This section is mostly devoted to the best practices and requirements to help you develop good templates specifically for the Azure Marketplace.  These take into account the requirements that allow for a unified, easy-to-use, and relevant experience for customers from both the Ibiza Portal and programmatically.

Your solution will likely be expressed with a set of templates.  These templates are logical pieces of your topology.  There are many reasons why to break-up the topology expression into multiple files, from ease of development and manageability, to reusability of certain subsets, to modular testing and expansion of template solutions.  After working with many partners, one such breakdown proposed by the Azure team is to divide the topology into a templates for common resources (such as VNets, storage accounts, etc.), called the Shared Resource template, zero or more templates for optional resources, called the Optional Resource template, and one or more templates for the topology specific resources, called Known Configuration Resource templates.

A complete template solution in the Marketplace will consist of the following items:

1. One Main Template (mainTemplate.json) – This is the entry point to the overall deployment expressed in the ARM JSON templating file.  It is the first file that is evaluated for the template solution and the one used to stitch together (link) all the rest of the templates.  This file must also contain all desired input (parameters) from the end user.
2. Zero or More Linked Templates – The rest of the templates that are linked from the main template to express the complete solution topology.
3. Zero or More Script Files – Any relevant script files which are expected as input to extensions to be used to configure a virtual machine.
4. One Create UI Definition File (uiDefinition.json createUiDefinition.json) – This is the file which maps the parameters in the ARM template to elements in the user experience.  This file allows partners to have control on the UI rendered to their end customers in Ibiza. All the inputs required from the end user should provide will be expressed in this file. Each entry allows you to control all the UI aspect associated with each input e.g. UI widget, defaults, validation rules, error messages, etc.
As you begin to develop each of these files to express your complete topology, consider the following criteria to ensure the best template for your Marketplace offering.

## Additional Requirement and Recommendations

### Standardized Minimum Set of User Input
Parameters allow you to express values that should be provided by the user at time of deployment in the template.  User input can vary from application to application, and even from topology tier to tier. The parameter list needs to provide a good balance between asking lesser number of required questions and providing the user the right knobs to control their deployment. While there are no requirements on the full list of user input, we want to ensure that all Marketplace template solutions have a set of common input that many customers want to control.
Ensure that you have defined parameters for the following values:

  a.	Location – the Azure region where resources are deployed

  b.	Virtual Network Name – For deployments that create a new Virtual Network, the name to use for creating that resource.  For deployments that use an existing Virtual Network, the name of the VNet to deploy into.

  c.	Storage Account – For deployments that create a new storage account, the storage account name to create.  For deployments that use an existing Virtual Network, the name of the storage account to use.

  d.	DNS Name – Domain name of the virtual machine or load balancer to which an end user may connect.

  e.	Username – User name for the virtual machine(s) and potentially the application(s).  More than one user name can be requested from the end user, but at least one must be prompted.

  f.	Password – Password for the virtual machine(s) and potentially the application(s).  More than one password can be requested from the end user for different VMs or applications, but at least one must be prompted.

  g.	SSH Public Key (only for Linux VMs) – SSH Key for the virtual machine(s).  More than one key can be requested from the end user for different VMs, but at least one must be prompted.

## Create an Azure compatible solution
1.	Identifying Topology and Platform Evaluation

  For each type of deployment – Evaluation, Proof of Concept, Dev/Test, and Production – think through the exact layout and topology needed for your application.  
  Question to ask:
  
  -	What are the different tiers?  
  -	What resources are needed for each tier and of what size?  
  -	What are the building blocks needed to create these resources?  
  A production deployment, or even a dev/test environment, can vary significantly in size depending on the customer and their needs.  Decide upon what a small, medium, large, and extra-large topology would look like for your workload and think through availability, scalability, and performance requirements needed to be successful.

2.	Developing and testing the identified topology
  After identifying the topology, you need to work on the following

  -	Work on the configuration (VM sizes, Storage accounts, VNet, Subnet, Network interface card, public IP etc.)
  -	Set up dev and test environment
  -	Build and iterate on the template
  -	Perform rigorous stress testing and performance testing

3.	Familiarize yourself with Azure ARM Template
  The Azure Resource Manager deploys and manages the lifecycle of a collection of resources through declarative, model-based template language.  This ARM template is simply a parameterized JSON file which expresses the set of resources and their relationship to be used for deployments.  Each resource is placed in a resource group, which is simply a container for resources.  ARM provides centralized auditing, tagging, Resource Based Access Control, and most importantly, its operations are idempotent.

  With ARM and ARM templates, you can express more complex deployments of Azure resources, such as Virtual Machines, Storage Accounts, and Virtual Networks, which build upon Marketplace content such as VM Images and VM Extensions.
4.	Create your Multi VM template solution
  For detailed information on the guidance, review the [Creating a Solution Template Best Practices](marketplace-publishing-solution-creation-best-practices.md) for best practices and requirements for Multi-VM solutions.

## Next Steps
Now that you reviewed the pre-requisites and completed the necessary tasks, you can move forward with the creating your Solution Template offer as detailed in the [Guide to creating a Solution Template](marketplace-publishing-solution-template-creation.md)

## See Also
- [Getting Started: How to publish an offer to the Azure Marketplace](marketplace-publishing-getting-started.md)
- [Creating a Solution Template Best Practices](marketplace-publishing-solution-template-best-practices.md)

[link-acct]:marketplace-publishing-accounts-creation-registration.md
