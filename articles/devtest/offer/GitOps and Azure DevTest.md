---
title: GitOps and Azure Dev/Test
description: A guide for using GitOps in association with Azure Dev/Test
author: j-martens
ms.author: jmartens
ms.prod: visual-studio-windows
ms.topic: how-to 
ms.date: 10/04/2021
ms.custom: devtestoffer
---
# What is GitOps?  

GitOps is an operational framework that takes DevOps best practices used for application development and applies them to infrastructure automation.  

When teams practice GitOps, they use configuration files stored as code (infrastructure as code). These files generate the same environment every time it is deployed, just as application source code generates the same application binaries every time it’s built.  

## GitOps Methodology  

This process, or methodology, uses Git repositories as your source of truth for a desired state and configuration for your application. Git repositories contain declarative descriptions of the infrastructure needed in the production environment with an automated process to make that environment match the described state in the repository.  

To deploy a new application or update an existing one, you only need to update the repository - the automated process handles everything else.  

## Benefits Of GitOps  

- Enables collaboration on infrastructure changes  
- Improved access control  
- Faster time to market  
- Less risk  
- Reduced costs  
- Less error prone  

## Use GitOps with Dev/Test  

GitOps as a process and framework should be applied to your non-production instances and can be verified or used in conjunction with your DevTest environments. In other words, use GitOps principles to improve your DevOps processes. Use your DevTest benefits and environments with GitOps principles to optimize your activities and maintain security and reliability of your applications.  

GitOps is intended to illustrate how automation and commonly used collaboration frameworks such as git can be combined to provide rapid delivery of cloud infrastructure while complying to enterprise security standards.  

Learn more about GitOps and Azure:  

- [Azure Friday Video: Azure Arc Enabled Kubernetes With GitOps](https://azure.microsoft.com/en-us/resources/videos/azure-friday-azure-arc-enabled-kubernetes-with-gitops/)  
- [Azure Friday Blog: Azure Arc Enabled Kubernetes With GitOps](https://techcommunity.microsoft.com/t5/azure-arc/azure-arc-enabled-kubernetes-with-gitops/ba-p/1654171?ocid=AID754288&wt.mc_id=azfr-c9-scottha&wt.mc_id=CFID0570)  
- [GitOps for Azure Infrastructure Lifecycle Automation](https://github.com/travisnielsen/azure-gitops)