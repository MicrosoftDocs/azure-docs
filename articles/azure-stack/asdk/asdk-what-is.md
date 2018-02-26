---
title: An introduction to the Azure Stack Development Kit (ASDK) | Microsoft Docs
description: Describes what the ASDK is and common use cases for evaluating Microsoft Azure Stack.
services: azure-stack
documentationcenter: ''
author: jeffgilb
manager: femila
editor: ''

ms.assetid: 
ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: overview
ms.date: 02/29/2018
ms.author: jeffgilb
ms.reviewer: chjoy
---

# About the Azure Stack Development Kit
The Microsoft Azure Stack Development Kit (ASDK) is a single-node deployment of Azure Stack with all components installed in virtual machines running on a single host computer. The ASDK is meant to provide an environment in which you can evaluate and learn about Azure Stack. You can also use the ASDK in a developer environment, where you can develop using APIs and tooling consistent with Azure. 

The Azure Stack Development Kit is a testing and development environment that you can deploy to evaluate and demonstrate Azure Stack features and services. To get it up and running, you’ll need to prepare the environment hardware and run some scripts (this will take several hours). After that, you can sign in to the admin and user portals to manage Azure Stack and test offers.

> [!IMPORTANT]
> The ASDK is not intended to be used or supported in a production environment.

Azure Stack development kit has the following limitations:

- Azure Stack development kit is associated with a single Azure Active Directory or Active Directory Federation Services identity provider. You can create multiple users in this directory and assign subscriptions to each user.
- With all components deployed on the single machine, there are limited physical resources available for tenant resources. This configuration is not intended for scale or performance evaluation.
- Networking scenarios are limited due to the single host/NIC requirement. 

## Azure Stack Development Kit capabilities
- **In-development build of Azure Stack Development Kit**. In-development builds let early-adopters evaluate the most recent version of the Azure Stack Development Kit. They’re incremental builds based on the most recent major release. While major versions will continue to be released every few months, the in-development builds will release intermittently between the major releases.

## Common Azure Stack Development Kit evaluation scenarios
1. [**Add an Azure Stack marketplace item**](asdk-marketplace-item.md)
2. [**Offer IaaS services**](asdk-offer-services.md)
3. [**Subscribe to an offer**](asdk-subscribe-services.md)
4. [**Create a VM from a template**](asdk-create-vm-template.md)

> [!div class="nextstepaction"]
> [Deploy the ASDK](asdk-deploy-qs.md)