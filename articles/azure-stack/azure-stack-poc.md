---
title: What is Azure Stack? | Microsoft Docs
description: Azure Stack allows you to run Azure services in your datacenter.  
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
ms.date: 09/25/2017
ms.author: helaw
ms.custom: mvc

---
# What is Azure Stack?

Microsoft Azure Stack is a hybrid cloud platform that lets you deliver Azure services from your organization’s datacenter.  Azure Stack is designed to enable new scenarios for your modern applications in key scenarios, like edge and disconnected scenarios, or meeting specific security and compliance requirements.  Azure Stack is offered in two deployment options to meet your needs.

## Azure Stack integrated system
The Azure Stack integrated system is offered through a partnership of Microsoft and [hardware partners](https://azure.microsoft.com/overview/azure-stack/integrated-systems/), creating a solution which offers cloud-paced innovation balanced with simplicity in management.  Because Azure Stack is offered as an integrated system of hardware and software, you are offered the right amount of flexibility and control, while still adopting innovation from the cloud.  Azure Stack integrated systems range in size from 4-12 nodes, and are jointly supported by the hardware partner and Microsoft.  Use Azure Stack integrated systems to enable new scenarios for your production workloads.    

## Azure Stack Development Kit
Microsoft Azure Stack Development Kit is a single-node deployment of Azure Stack, which you can use to evaluate and learn about Azure Stack.  You can also use Azure Stack Development Kit as a developer environment, where you can develop using consistent APIs and tooling.  Azure Stack Development Kit is not intended to be used as a production environment.

Azure Stack development kit has the following limitations:
* Azure Stack development kit is associated with a single Azure Active Directory or Active Directory Federation Services identity provider. You can create multiple users in this directory and assign subscriptions to each user.
* With all components deployed on the single machine, there are limited physical resources available for tenant resources. This configuration is not intended for scale or performance evaluation.
* Networking scenarios are limited due to the single host/NIC requirement.  

## Next steps
[Key features and concepts](azure-stack-key-features.md)

[Hybrid Application innovation with Azure and Azure Stack (pdf)](https://go.microsoft.com/fwlink/?LinkId=842846&clcid=0x409)

