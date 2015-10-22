<properties
   pageTitle="Technical prerequisites for creating a solution template for the Marketplace | Microsoft Azure"
   description="Understand the requirements for creating a solution template to deploy and sell on the Azure Marketplace"
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
   ms.date="10/09/2015"
   ms.author="hascipio; v-divte" />

# Technical prerequisites for creating a solution template for the Azure Marketplace
Read the process thoroughly before beginning and understand where and why each step is performed. As much as possible, you should prepare your company information and other data, download necessary tools, and/or create technical components before beginning the offer creation process.  

## Topology definition & platform evaluation
At this point, you may already be familiar with Azure compute artifacts and may be asking what should you be building.  Virtual machine images? Extensions? Azure Resource Manager templates?  

Before trying to map your application to Azure artifacts, it helps to understand the different topologies that make sense for your solution.  Most enterprises generally go through some variation of the following four stages: evaluation, proof of concept, pre-production, and production.   Usually, you are working with them through these different stages, evaluating their requirements, and recommending the exact layout and scale needed for their scenarios.
Although every customer isn’t the same, generally we expect that there are common topologies and sizes that you recommend given the size of the customer deployment.  So even before beginning to develop any solutions, think through the different layouts that make sense for your application and what could meet a fair share of your customer’s needs without major customizations.  Again, there will always be customers who need something very exact, but we are looking for the common case.

For each type of deployment--evaluation, proof of concept, pre-production, and production--think through the exact layout and topology needed for your application.  What are the different tiers?  What resources are needed for each tier and of what size?  What are the building blocks needed to create these resources?  A production deployment, or even a dev/test environment, can vary significantly in size depending on the customer and their needs.  Determine what a small, medium, large, and extra-large topology would look like for your workload and think through availability, scalability, and performance requirements needed to be successful.

After you have thought through the different topology layouts and corresponding sizes (you may have most of this already complete with your experiences with on-premises deployments with customers), it’s time to focus on what Azure has to offer.  

Evaluate your topology requirements against what the Azure Resource Manager and Compute on Azure Resource Manager offers. Although most customers will start with smaller deployments, we strongly recommend that you evaluate the performance, scale, and capability requirements of your large topology on the Compute on Azure Resource Manager even if you may not initially be onboarding a large topology.  This is mostly to ensure that as customers begin to adopt your smaller solutions, they have a substantial amount of room to grow successfully to larger scale deployments. Any scale, performance, or capability limitations should be communicated to Microsoft. That will enable Microsoft to improve in the areas needed by you, our Marketplace partner, and in turn by your customers.

> [AZURE.TIP] **Recommended:** Evaluate and build a template to match the largest expected deployment size of your application in order to offer growth opportunities to your customers.

## Azure compute building blocks
Let’s start by identifying what compute artifacts are available to you and how to think about your application in terms of these artifacts.

### 1. Use existing virtual machines
The building blocks for any virtual machine are virtual machine images.  Virtual machine images are the complete storage profile of a virtual machine. They contain one operating system virtual hard disk and zero or more data disks.  You can create a virtual machine image to package your software application with the operating system bits, in addition to any additional data needed.  For example, today in the Azure marketplace, there are a handful of virtual machine images for SQL Server, which package the Windows operating system, with the SQL Server application. This document does not go into the details of creating and onboarding virtual machine images into the Azure Marketplace, but it is important to understand what a virtual machine image is. The image will likely be the building block to your application solution.  Refer to steps for [Creating a VM image for the Marketplace](marketplace-publishing-vm-image-creation.md).

### 2. Virtual machine extension
Sometimes, an image isn’t what you may be looking for, because you do not want to own and manage the underlying operating system as an application provider.  In the Azure Marketplace today, there are a handful of operating system companies that publish Windows, Linux, and Unix operating systems on a regular basis.  You can find images for Windows Server, Ubuntu, CentOS-based, CoreOS, Oracle Linux, and so on.  Instead of publishing your own virtual machine image, which involves packaging both the operating system and application, you can consider writing a virtual machine extension handler or leveraging an existing one.  A virtual machine extension is a software mechanism to simplify virtual machine configuration and management, which leverages the guest agent (a secured, light-weight process) in an Azure virtual machine.  For example, the Custom Script Extension takes in a custom script, as the name suggests, and executes it within the virtual machine.  This allows any sort of configuration that a generic script would allow.

In a traditional image scenario, you would have installed all the bits on the image from the start and completed any necessary configurations before or even possibly after virtual machine startup (with a startup task).  This image could get very customized and would not necessarily be easily reusable.  In some cases, this makes the most sense.  In others, especially with light-weight applications or more complicated configurations that require being done after the virtual machine is provisioned, the extension model can help. Sometimes, customers deploy a combination of extensions and virtual machine images to have both pre-installed solutions but also enable complex post-startup configuration.

Images and extensions are quite useful to configure a single virtual machine.  However, one virtual machine is not sufficient to offer customers high availability in the cloud and scale to meet the needs of growing traffic. Therefore, for any production workload, we highly recommend planning for a high-available solution for multiple virtual machines that use availability sets and load balancing.

>[AZURE.TIP] **Recommended:** All production workloads in the marketplace should be deployed using multiple virtual machines that serve traffic into an availability set (with three fault domains) and with a load balancer.

To support these numerous deployment topologies that your application can support and recommend, the Azure Marketplace offers the Azure Resource Manager and its templates. The Azure Resource Manager deploys and manages the lifecycle of a collection of resources through declarative, model-based template language.  This template is simply a parameterized JSON file that expresses the set of resources and their relationship to be used for deployments.  Each resource is placed in a resource group, which is simply a container for resources.  The Resource Manager also offers a set of very valuable additional capabilities to customers, including centralized operation auditing, resource tagging through to the customer bill, resource-based access control for granular security, support for three compute fault domains for highest availability, and all its operations are independent.

> [AZURE.IMPORTANT] **Mandatory:** Given the benefits for customers, all Marketplace content must be deployed using Azure Resource Manager templates.  

With the Azure Resource Manager and its templates, you can express more complex deployments of Azure resources, such as virtual machines, storage accounts, and virtual networks, which build upon Marketplace content such as virtual machine images and virtual machine extensions.

## Develop building blocks
After you have figured out your application topologies and which ones you will develop and onboard to the Marketplace in your first stage, it is time to identify and develop the virtual machine building blocks.  As discussed above, you will have to decide whether you want to package the contents of the VM as your own published virtual machine image or to leverage an already existing virtual machine image in the Azure Marketplace, configuring it with a published extension handler or with your own handler.  There isn’t a single correct solution; it is highly dependent on how much control you want around the underlying operating system and requirements regarding how you install, configure, and manage your application. You can find a good amount of information about images and extensions on MSDN and on the Azure blogs.  A list of potentially useful articles can be found below in the "See also" section.

Note that for any image or extension handler used, it must first be published through the Marketplace.  

## Develop Azure Resource Manager templates
If you are new to Azure Resource Manager and its templates, it may be worthwhile to review some of the documentation around Azure Resource Manager and Compute on Azure Resource Manager.  The guidance and examples provided below assume a basic level of understanding of the Azure Resource Manager templating language and how to use Compute with Azure Resource Manager.  This section is mostly devoted to best practices and requirements to help you develop good templates specifically for the Azure Marketplace.  These take into account the requirements that allow for a unified, easy-to-use, and relevant experience for customers from both the Azure preview portal and programmatically.

Your solution will likely be expressed with a set of templates.  These templates are logical pieces of your topology.  There are many reasons to break up the topology expression into multiple files, from ease of development and manageability, to reusability of certain subsets, to modular testing and expansion of template solutions.  After working with many partners, one such breakdown proposed by the Azure team is to divide the topology into a template for common resources (such as VNets and storage accounts), called the Shared Resource template, zero or more templates for optional resources, called the Optional Resource template, and one or more templates for the topology specific resources, called Known Configuration Resource templates.

A complete template solution in the Marketplace consist of the following items:

1. **One main template (mainTemplate.json)**: This is the entry point to the overall deployment expressed in the Azure Resource Manager JSON templating file.  It is the first file that is evaluated for the template solution and the one used to stitch together (link) all the rest of the templates.  This file must also contain all desired input (parameters) from the customer.
2. **Zero or more linked templates**: The rest of the templates that are linked from the main template to express the complete solution topology.
3. **Zero or more script files**: Any relevant script files that are expected as input to extensions to be used to configure a virtual machine.
4. **One Create UI definition file (uiDefinition.json createUiDefinition.json)**: This file maps the parameters in the Azure Resource Manager template to elements in the user experience.  This file allows partners to control the UI rendered to their customers in the Azure preview portal. All the inputs required from the customer are expressed in this file. Each entry allows you to control all the UI aspect associated with each input (for example, UI widgets, defaults, validation rules, and error messages).
As you begin to develop each of these files to express your complete topology, consider the following criteria to ensure the best template for your Marketplace offering.

## Additional requirements and recommendations

### Standardized minimum set of user input
Parameters allow you to express values that should be provided by the user at time of deployment in the template.  User input can vary from application to application, and even from topology tier to tier. The parameter list needs to provide a good balance between asking a fewer number of required questions and providing the user the right knobs to control their deployment. Although there are no requirements on the full list of user input, we want to ensure that all Marketplace template solutions have a set of common input that many customers want to control.
Ensure that you have defined parameters for the following values:

1. **Location**: The Azure region where resources are deployed.
2.	**Virtual network name**: For deployments that create a new virtual network, the name to use for creating that resource.  For deployments that use an existing virtual network, the name of the VNet to deploy into.
3.	**Storage account**: For deployments that create a new storage account, the storage account name to create.  For deployments that use an existing virtual network, the name of the storage account to use.
4.	**DNS name**: Domain name of the virtual machine or load balancer to which a customer may connect.
5.	**User name**: User name for the virtual machine and potentially the application.  More than one user name can be requested from the customer, but at least one must be prompted.
6.	**Password**: Password for the virtual machine and potentially the application.  More than one password can be requested from the customer for different virtual machines or applications, but at least one must be prompted.
7.	**SSH public key (only for Linux virtual machines)**: SSH key for the virtual machine.  More than one key can be requested from the customer for different virtual machines, but at least one must be prompted.

## Next steps
Now that you reviewed the prerequisites and completed the necessary tasks, you can move forward with creating your solution template offer as detailed in the [Guide to creating a solution template](marketplace-publishing-solution-template-creation.md)

## See also
- [Getting started: How to publish an offer to the Azure Marketplace](marketplace-publishing-getting-started.md)
- [Creating solution template best practices](marketplace-publishing-solution-template-best-practices.md)

[link-acct]:marketplace-publishing-accounts-creation-registration.md
