---
title: What is Azure Stack? | Microsoft Docs
description: Azure Stack lets you to run Azure services in your datacenter.  
services: azure-stack
documentationcenter: ''
author: jeffgilb
manager: femila
editor: ''

ms.assetid: d9e6aee1-4cba-4df5-b5a3-6f38da9627a3
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: overview
ms.date: 10/15/2018
ms.author: jeffgilb
ms.reviewer: unknown
ms.custom: mvc

---
# What is Azure Stack?

Microsoft Azure Stack is a hybrid cloud platform that lets you deliver Azure services in your datacenter. This platform is designed to support your evolving business requirements. Azure Stack can enable new scenarios for your modern applications, such as edge and disconnected environments, or meet specific security and compliance requirements.

Azure Stack is offered in two deployment options to meet your needs.

## Azure Stack integrated systems
Azure Stack integrated systems are offered through a partnership of Microsoft and [hardware partners](https://azure.microsoft.com/overview/azure-stack/integrated-systems/), creating a solution that offers cloud-paced innovation and computing management simplicity. Because Azure Stack is offered as an integrated hardware and software system, you have the flexibility and control you need, along with the ability to innovate from the cloud. Azure Stack integrated systems range in size from 4-12 nodes, and are jointly supported by the hardware partner and Microsoft.  Use Azure Stack integrated systems to create new scenarios and deploy new solutions for your production workloads.

## Azure Stack Development Kit

Microsoft [Azure Stack Development Kit (ASDK)](.\asdk\asdk-what-is.md) is a single-node deployment of Azure Stack, that you can use to evaluate and learn about Azure Stack.  You can also use ASDK as a developer environment to build apps using the APIs and tooling that's consistent with Azure.

>[!Note]
>The ASDK isn't intended to be used as a production environment.

The ASDK has the following limitations:

* ASDK is associated with a single Azure Active Directory (Azure AD) or Active Directory Federation Services (AD FS) identity provider. You can create multiple users in this directory and assign subscriptions to each user.
* Because Azure Stack components are deployed on one host computer, there are limited physical resources available for tenant resources. This configuration is not intended to scale or performance evaluation.
* Networking scenarios are limited because of the single host and NIC deployment requirements.

## Next steps

[Key features and concepts](azure-stack-key-features.md)

[Azure Stack: An extension of Azure (pdf)](https://azure.microsoft.com/resources/azure-stack-an-extension-of-azure/)
