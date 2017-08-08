---
title: Azure Active Directory PoC Playbook Ingredients | Microsoft Docs
description: Explore and quickly implement Identity and Access Management scenarios 
services: active-directory
keywords: azure active directory, playbook, Proof of Concept, PoC
documentationcenter: ''
author: dstefanMSFT
manager: asuthar

ms.assetid: 
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 4/12/2017
ms.author: dstefan

---
# Azure Active Directory Proof of Concept Playbook Ingredients 

## Theme
Azure AD provides identity and access solutions across multiple areas in the enterprise. We classify the scenarios in the following areas: 

* [Lots of apps, one identity](active-directory-playbook-implementation.md#theme---lots-of-apps-one-identity) 
* [Increase your security](active-directory-playbook-implementation.md#theme---increase-your-security) 
* [Scale with Self Service](active-directory-playbook-implementation.md#theme---scale-with-self-service) 

Defining a theme to frame the PoC helps to focus the efforts that resonates with business goals, which oftentimes are the triggers of the interest in a proof of concept in the first place. 

## Environment

It is important to determine the details of the environment where you will deliver the PoC. Ideally you can build upon it after the PoC is completed. The target environment is crucial and you should find the right balance between making it as real as possible and the overhead of constraints or extra considerations. The typical environments for PoCs are:
* **Production:** The scenarios will be implemented in your live environment and already deployed Microsoft Cloud services (production AD, Office 365, Azure AD tenant/SSO solution). 
* **User Acceptance Test (UAT)/Dev environment:** You have test infrastructure (parallel AD and potentially Azure AD tenant/SSO solution) with test data that resembles production. Typically, the test environment is shared across multiple projects in the enterprise.

Most scenarios in this guide are additive in nature. As a result, they can be deployed in the production tenant without affecting users outside the PoC. Throughout this document, we will be calling out which scenarios would have tenant-wide effect. In those cases, you might want to consider a non-production environment. 


## Target Users

It is important to determine the target set of users that will exercise the scenarios, especially when the environment is production or test. The categories of target users for PoC are:
* **Pilot Users:** Real users in the environment that will be using the solution with the account they use for their day to day job functions
* **Test Users:** Test accounts created in the environment 

Most scenarios in this guide can be exercised by pilot users. Throughout this document, we will be calling out target user considerations if needed.


[!INCLUDE [active-directory-playbook-toc](../../includes/active-directory-playbook-steps.md)]