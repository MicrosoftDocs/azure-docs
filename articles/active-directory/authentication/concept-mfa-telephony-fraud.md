---
title: Understanding telephony fraud risk for Microsoft Entra multifactor authentication | Microsoft Entra ID
description: Understanding International Revenue Share Fraud (IRSF) is crucial for implementing preventive measures for Microsoft Entra multifactor authentication telephony verification.

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 09/11/2023

author: aloom3
ms.author: justinha
manager: amycolannino
ms.reviewer: aloom3

ms.collection: M365-identity-device-management
ms.custom: references_regions
---

# Understanding telephony fraud  

In today's digital landscape, telecommunication services have seamlessly integrated into our daily lives. But technological progress also brings the risk of fraudulent activities like International Revenue Share Fraud (IRSF), which poses financial consequences and service disruptions. IRSF involves exploiting telecommunication billing systems by unauthorized actors. They divert telephony traffic and generate profits through a technique called *traffic pumping*. Traffic pumping targets multifactor authentication systems, and causes inflated charges, service unreliability, and system errors. 

To counter this risk, a thorough understanding of IRSF is crucial for implementing preventive measures like regional restrictions and phone number verification, while our system aims to minimize disruptions and safeguard both our business, users, and your business we prioritize your security and as such we may sometimes take proactive measures.  

## How we help fight telephony fraud 

To protect our customers and vigilantly defend against bad actors who attempt fraud, we may engage in proactive remediation in the event of a fraud attack. Telephony fraud is a very dynamic space where even seconds can result in massive financial impact. To limit that impact, we may proactively engage temporary throttling when we detect excessive authentication requests from a particular region, phone, or user. These throttles normally clear after a few hours to a few days.  

## How you can help fight telephony fraud  

To help fight telephony fraud, B2C customers can take steps to improve security of authentication activities such as sign-in, MFA, password reset, and forgot username: 

- Use the recommended versions of user flows
- Remove region codes that aren't relevant to your organization
- Use CAPTCHA to help distinguish between human users and automated bots
- Review your telecom usage to make sure it matches the expected behavior from your users  

For more information, see [Securing phone-based MFA in B2C](/azure/active-directory-b2c/phone-based-mfa).

In addition, you may sometimes encounter throttles because you're requesting traffic from a region that requires an opt-in. For more information, see [Regions that need to opt in for MFA telephony verification](concept-mfa-regional-opt-in.md). 

## Next steps

* [Authentication methods in Microsoft Entra ID](concept-authentication-authenticator-app.md)
* [Securing phone-based MFA in B2C](/azure/active-directory-b2c/phone-based-mfa)
* [Regions that need to opt in for MFA telephony verification](concept-mfa-regional-opt-in.md)
