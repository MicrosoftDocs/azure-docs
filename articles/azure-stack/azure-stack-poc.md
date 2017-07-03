---
title: What is Azure Stack Development Kit? | Microsoft Docs
description: Azure Stack Development Kit is an environment for evaluating Azure Stack features and scenarios.
services: azure-stack
documentationcenter: ''
author: HeathL17
manager: byronr
editor: ''

ms.assetid: d9e6aee1-4cba-4df5-b5a3-6f38da9627a3
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 7/10/2017
ms.author: helaw
ms.custom: mvc

---
# What is Azure Stack Development Kit?

Microsoft Azure Stack is a hybrid cloud platform that lets you deliver Azure services from your organization’s datacenter. Microsoft Azure Stack Development Kit is a single-node version of Azure Stack that runs on your hardware, which you can use to evaluate and learn about Azure Stack features.  You can also use the Azure Stack Development Kit as a developer environment, where you can develop using consistent APIs and tooling.  

## Scope of Azure Stack Development Kit
* Azure Stack Development Kit must not be used as a production environment and should only be used for testing, evaluation, and demonstration.  
* Your deployment of Azure Stack is associated with a single Azure Active Directory or Active Directory Federation Services identity provider. You can create multiple users in this directory and assign subscriptions to each user.
* With all components deployed on the single machine, there are limited physical resources available for tenant resources. This configuration is not intended for scale or performance evaluation.
* Networking scenarios are limited due to the single host/NIC requirement.

## Next steps
[Key features and concepts](azure-stack-key-features.md)

[Hybrid Application innovation with Azure and Azure Stack (pdf)](https://go.microsoft.com/fwlink/?LinkId=842846&clcid=0x409)

