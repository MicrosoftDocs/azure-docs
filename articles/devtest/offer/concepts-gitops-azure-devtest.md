---
title: GitOps & Azure Dev/Test offer
description: Use GitOps in association with Azure Dev/Test
ms.author: amast
author: joseb-rdc
ms.service: visual-studio-family
ms.subservice: subscriptions
ms.topic: how-to 
ms.date: 06/25/2026
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

GitOps should be applied to your nonproduction instances, where environments can be validated and tested in Dev/Test scenarios. It's especially useful when environments need to be frequently recreated, validated, and kept consistent across teams.

You can use GitOps principles to improve your Dev/Test environments to optimize your activities and maintain the security and reliability of your applications.

GitOps combines automation with collaboration frameworks like Git to provide rapid delivery of cloud infrastructure while complying with enterprise security standards.
