---
title: Azure DevTest Labs and DevOps | Microsoft Docs
description: Learn how to use labs of Azure DevTest Labs within a continuous integration (CI)/ continuous delivery (CD) pipelines in an enterprise environment. 
services: devtest-lab
documentationcenter: na
author: spelluru
manager: 
editor: ''

ms.service: devtest-lab
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/10/2019
ms.author: spelluru

---

# Azure DevOps and Azure DevTest Labs 
DevOps is a software development methodology that integrates software development (Dev) with operations (Ops) for a system that delivers new features, updates, and fixes in alignment with business goals. This methodology encompasses everything from designing new features based on goals, usage patterns, and customer feedback; to fixing, recovering and hardening the system when issues occur. An easily identified component of this methodology is the continuous integration (CI)/ continuous delivery (CD) pipeline. A CI/CD pipeline takes information, code, resources, and so on. from a commit through a series of steps including building, testing, and deployment, to produce the system. This article focuses on different ways to effectively use labs within a pipeline in an enterprise environment. 

## Benefits of using labs in DevOps workflow 

### Focused access 
Using a lab as a component allows for easier focusing of a specific ecosystem to a limited group of people. Usually, a team or group that is working in a common area or a specific feature will have a lab assigned to them.   

### Infrastructure replication in the cloud 
From the developer who can quickly set up a development ecosystem that includes a dev box with source code and tools to creation of an environment that is nearly identical to the production configuration is beneficial for faster inner loop development.   

### Pre-production 
Having a lab in the CI/CD pipeline makes it easier to have multiple different pre-production environments or machines running at the same time for asynchronous testing.  Different support infrastructure, like Build Agents, can be deployed and managed within a lab. 

## DevOps with DevTest Labs 

### Development / Operation 
A lab should be focused on a team that is working in a feature area.  This common focus allows for sharing of area-specific resources, like tools, scripts, or Resource Manager templates, and allows faster changes while limiting the negative effects to a smaller group.  These shared resources allow the developer to create development VMs with all the necessary code, tools, and configuration either dynamically or have a system that creates base images with the customizations.  Not only can the developer create VMs, but they can create DevTest Labs environments based on the necessary templates to create the appropriate Azure resources in the lab.  Any changes or destructive work can be done against the lab environment without effecting anyone else.  In the case where the product is a standalone system installed on the customer's machine, DevTest Labs has improved VM creation that includes being able to install additional software using artifacts and being able to pre-build customer configurations for quicker inner loop testing of the code. 
  
## CI/CD pipeline 
The CI/CD pipeline is one of the critical components in DevOps that move code from the pull request of the developer and integrates it with the existing code and deploys it to the production ecosystem.  Not all resources are required to be within a lab, for example a Jenkins host could be set up outside of lab as a more persistent resource. Here are some specific examples of integrating labs into the pipeline. 

### Build 
The build pipeline is focused on creating a package of components that will be tested together to be handed off to the release pipeline. Labs can be part of the build pipeline as the location for build agents and other support resources.  Having the ability to dynamically build infrastructure allows for greater control.  With the ability to have multiple environments in a lab each build can be run asynchronously while using the Build ID as part of the environment information to uniquely identify the resources to the specific build.   

For build agents, the lab’s ability to restrict access  increases the security and decreases the possibility of accidental corruptions.  

### Test 
DevTest Labs is designed to allow a CI/CD pipeline to automate the ability to create Azure Resource (VMs, environments) which can be used to for automated and manual testing.  The virtual machines would be created using artifacts or formulas that use information from the build process to create the different custom configurations necessary for testing.   

### Release 
DevTest Labs is commonly used for verification in the release section before the code is deployed, similar to the testing in the Build section. Production resources should not be deployed within DevTest Labs. 

### Customization 
In Azure DevOps, there are existing tasks that allow manipulation of VMs and Environments within specific labs.  While Azure DevOps is a one way to manage the CI/CD pipeline, the lab can be integrated into any system that supports the ability to call Rest APIs, execute PowerShell scripts, or use Azure CLI. 

While some CI/CD pipeline managers have existing open-source plugins that can manage resources within Azure and DevTest Labs.  Custom scripting will most likely be needed to fit the specific needs of the pipeline.  With that in mind, when executing a task, a service principal is used with the appropriate role to gain access to the lab.  The service principal will usually need contributor role access to the lab(s).   For more information, see “Integrate Azure DevTests Labs into your Azure DevOps continuous integration and delivery pipeline”. 
 