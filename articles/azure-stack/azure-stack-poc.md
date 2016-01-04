<properties 
	pageTitle="What is Azure Stack POC?" 
	description="What is Azure Stack POC?" 
	services="" 
	documentationCenter="" 
	authors="v-anpasi" 
	manager="v-kiwhit" 
	editor=""/>

<tags 
	ms.service="multiple" 
	ms.workload="na" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="1/04/2016" 
	ms.author="v-anpasi"/>

# What is Azure Stack POC?

Microsoft Azure Stack POC (Proof of Concept) is an environment for learning and demonstrating Azure Stack features. It lets you deploy all required components on a single physical machine where you’ll have an ideal developer environment for evaluating features and validating the Azure Stack extensibility model for APIs.

## Scope of Azure Stack POC 

-   Azure Stack POC must not be used as a production environment. Since the Azure Stack POC is single machine environment, it does not provide high-availability features. You might have data loss in the POC deployment due the risk of a pre-release environment.

-   Your deployment of Azure Stack is associated with a single Azure Active Directory directory. You can create multiple users in this directory and assign subscriptions to each user.

-   With all components deployed on the single machine, there are limited physical resources available for tenant resources. This configuration is not intended for scale and performance evaluation.

-   Limited Networking scenarios due to single host/NIC requirement


