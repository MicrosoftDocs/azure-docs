---
title: GitOps & Azure Dev/Test offer
description: Use GitOps in association with Azure Dev/Test
author: jenp
ms.author: jenp
ms.prod: visual-studio-family
ms.technology: vs-subscriptions
ms.topic: how-to 
ms.date: 10/18/2023
ms.custom: devtestoffer
---
# Using GitOps with Azure Dev/Test offer to optimize and secure applications

GitOps is an operational framework. It takes DevOps best practices used for developing applications and applies them to infrastructure automation.  

When teams practice GitOps, they use configuration files stored as code (infrastructure as code). These files generate the same environment every time it's deployed. Think of it like application source code generating the same application binaries every time you build.  

## GitOps Methodology  

This process, or methodology, uses Git repositories. These repositories are your source of truth for a state and configuration you define for your application. They contain declarative descriptions of the infrastructure you need in production. An automated process makes that environment match the described state in the repository.  

To deploy a new application or update an existing one, you only need to update the repository - the automated process handles everything else.  

## Benefits Of GitOps  

- Enables collaboration on infrastructure changes  
- Improved access control  
- Faster time to market  
- Less risk  
- Reduced costs  
- Less error prone  

## Use GitOps with Dev/Test  

GitOps as a process and framework should be applied to your nonproduction instances. It can be verified or used in your DevTest environments. You can use GitOps principles to improve your DevOps processes. Use your DevTest benefits and environments with GitOps principles to optimize your activities and maintain the security and reliability of your applications.  

GitOps combines automation and commonly used collaboration frameworks like git. They can be combined to provide rapid delivery of cloud infrastructure while complying with enterprise security standards.  

Learn more about GitOps and Azure:  

- [Azure Friday Video: Azure Arc Enabled Kubernetes With GitOps](https://azure.microsoft.com/resources/videos/azure-friday-azure-arc-enabled-kubernetes-with-gitops/)  
- [Azure Friday Blog: Azure Arc Enabled Kubernetes With GitOps](https://techcommunity.microsoft.com/t5/azure-arc/azure-arc-enabled-kubernetes-with-gitops/ba-p/1654171?ocid=AID754288&wt.mc_id=azfr-c9-scottha&wt.mc_id=CFID0570)  
- [GitOps for Azure Infrastructure Lifecycle Automation](https://github.com/travisnielsen/azure-gitops)
