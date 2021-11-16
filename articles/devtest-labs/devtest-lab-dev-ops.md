---
title: Integrate Azure DevTest Labs and DevOps
description: Learn how to use labs within a continuous integration (CI) and continuous delivery (CD) pipeline in an enterprise environment. 
ms.topic: conceptual
ms.date: 06/26/2020
---

# Integrate Azure DevTest Labs and Azure DevOps
DevOps is a software development methodology that integrates software development (Dev) with operations (Ops) for a system. This system may deliver new features, updates, and fixes in alignment with business goals. This methodology encompasses everything from designing new features based on goals, usage patterns, and customer feedback; to fixing, recovering and hardening the system when issues occur. An easily identified component of this methodology is the continuous integration (CI) and continuous delivery (CD) pipeline. A CI/CD pipeline takes information, code, and resources from a commit through a series of steps to produce the system. Steps include building, testing, and deployment. This article focuses on different ways to effectively use labs within a pipeline in an enterprise environment. 

## Benefits of using labs in DevOps workflow 

### Focused access 
Using a lab as a component allows a specific ecosystem to associate with a limited group of people. Usually, a team or group that is working in a common area or a specific feature has a lab assigned to them.   

### Infrastructure replication in the cloud 
A developer can quickly set up a development ecosystem that includes a dev box with source code and tools. The developer can also create an environment that's nearly identical to the production configuration. This environment helps with the faster inner loop development. 

### Pre-production 
Having a lab in the CI/CD pipeline makes it easier to have multiple different pre-production environments or machines running at the same time for asynchronous testing. Different support infrastructures such as build agents can be deployed and managed within a lab. 

## DevOps with DevTest Labs 

### Development / Operation 
A lab should be focused on a team that is working in a feature area. This common focus allows for sharing of area-specific resources, like tools, scripts, or Resource Manager templates. The common focus allows faster changes while limiting the negative effects to a smaller group. Shared resources allow the developer to create development VMs with all the necessary code, tools, and configuration. Resources can either be created dynamically or in a system that creates base images with  customizations. The developer can create VMs, and can also create DevTest Labs environments based on the necessary templates to create the appropriate Azure resources in the lab. Any changes or destructive work can be done against the lab environment without affecting anyone else. Consider the scenario where the product is a standalone system installed on the customer's machine. In this scenario, DevTest Labs has improved VM creation that includes installing software using artifacts and pre-building customer configurations for quicker inner loop testing of the code. 
  
## CI/CD pipeline 
The CI/CD pipeline is one of the critical components in DevOps. The pipeline moves code from a developer's pull request, integrates it with the existing code, and deploys it to the production ecosystem. All resources don't need to be within a lab. For example, a Jenkins host could be set up outside of lab as a more persistent resource. Here are some specific examples of integrating labs into the pipeline. 

### Build 
The build pipeline is focused on creating a package of components that are tested together to be handed off to the release pipeline. Labs can be part of the build pipeline as the locations for build agents and other support resources. Having the ability to dynamically build the infrastructure allows for greater control. With the ability to have multiple environments in a lab, each build can run asynchronously. The build ID is part of the environment information that uniquely identifies the resources to the specific build.   

For build agents, the lab’s ability to restrict access increases security and reduces the possibility of accidental corruption.  

### Test 
DevTest Labs allows a CI/CD pipeline to automate the creation of Azure resources like VMs and environments) to use for automated and manual testing. The VMs are created using artifacts or formulas that use information from the build process to create the different custom configurations necessary for testing.   

### Release 
DevTest Labs is commonly used for verification in the release section before the code is deployed. The process is similar to testing in the Build section. Production resources shouldn't be deployed within DevTest Labs. 

### Customization 
In Azure DevOps, there are existing tasks that allow manipulation of VMs and environments within specific labs. Azure DevOps Services is one way to manage the CI/CD pipeline. You can integrate the lab into any system that supports the ability to call REST APIs, execute PowerShell scripts, or use Azure CLI. 

Some CI/CD pipeline managers have existing open-source plugins that can manage resources within Azure and DevTest Labs. You might need to use some custom scripting to fit the specific needs of the pipeline.  With that in mind, when executing a task, use a service principal with the appropriate role to access the lab. The service principal usually needs Contributor role access to the lab. For more information, see [Integrate Azure DevTest Labs into your Azure DevOps continuous integration and delivery pipeline](devtest-lab-integrate-ci-cd.md). 
 