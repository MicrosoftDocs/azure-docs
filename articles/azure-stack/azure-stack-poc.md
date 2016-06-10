<properties
	pageTitle="What is Azure Stack Technical Preview 1? | Microsoft Azure"
	description="Azure Stack POC is an environment for learning about core Azure Stack features and scenarios."
	services="azure-stack"
	documentationCenter=""
	authors="ErikjeMS"
	manager="byronr"
	editor=""/>

<tags
	ms.service="azure-stack"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="05/25/2016"
	ms.author="erikje"/>

# What is Azure Stack Technical Preview 1?

Microsoft Azure Stack is a new hybrid cloud platform product that lets you deliver Azure services from your organization’s datacenter. Microsoft Azure Stack Technical Preview 1 release is being made available through a Proof of Concept (POC). The POC is an environment for learning and demonstrating Azure Stack features. It lets you deploy all required components on a single physical machine where you’ll have an ideal developer environment for evaluating [concepts and capabilities](azure-stack-overview.md), and validating the Azure Stack extensibility model for APIs.

## Scope of Azure Stack POC

-   Azure Stack POC must not be used as a production environment. Since the Azure Stack POC is a single machine environment, it does not provide high-availability features. You might have data loss in the POC deployment due to the risks associated with a pre-release environment.

-   Your deployment of Azure Stack is associated with a single Azure Active Directory directory. You can create multiple users in this directory and assign subscriptions to each user.

-   With all components deployed on the single machine, there are limited physical resources available for tenant resources. This configuration is not intended for scale and performance evaluation.

-   Networking scenarios are limited due to the single host/NIC requirement.

## Next steps

[Key features and concepts](azure-stack-key-features.md)

[Taking the cloud to your datacenter whitepaper (pdf)](http://download.microsoft.com/download/3/F/3/3F3811C0-969D-422C-9EDA-42CB79BABA96/Bring-the-cloud-to-your-datacenter-Microsoft-Azure-Stack.pdf)
