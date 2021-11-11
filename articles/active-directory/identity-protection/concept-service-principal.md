---
title: Azure AD Identity Protection 
description: 

services: active-directory
ms.service: active-directory
ms.subservice: identity-protection
ms.topic: conceptual
ms.date: 11/10/2021

ms.author: joflore
author: MicrosoftGuyJFlo
manager: karenhoran
ms.reviewer: sahandle

ms.collection: M365-identity-device-management
---
# Securing applications and service principals with Identity Protection

A key component to any organization’s Zero Trust approach must include securing identities for users and applications. This new capability builds upon Identity Protection’s foundation in detecting identity-based threats and expands that foundation to include threat detection for applications and service principals. We are now combining this signal with Conditional Access to enable adaptive risk-based authentication controls. 

Organizations can view risky application or service principal accounts and risk detection events using two new API collections:

1.	One new detection, entitled Suspicious Sign-ins. This risk detection indicates sign-in properties or patterns that are unusual for this service principal and may be an indicator of compromise. The detection baselines sign-in behavior between 2 and 60 days, and fires if one or more of the following unfamiliar properties occur during a subsequent sign-in:

   1. IP address / ASN
   1. Target resource
   1. User agent
   1. Hosting/non-hosting IP change
   1. IP country
   1. Credential type

   > [!IMPORTANT]
   > We mark accounts at high risk when this detection fires because this can indicate account takeover for the subject application. Legitimate changes to an application’s configuration sometimes trigger this detection. 

1.	Conditional Access for workload identities: This allows you to block access for specific accounts you designate when Identity Protection marks them “at risk.” Enforcement through Conditional Access is currently limited to single-tenant apps only. Multi-tenant apps and services using a Managed Identity are not in scope. 


