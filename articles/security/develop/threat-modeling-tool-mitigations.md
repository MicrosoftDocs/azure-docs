---
title: Mitigations - Microsoft Threat Modeling Tool - Azure | Microsoft Docs
description: Mitigations page for the Microsoft Threat Modeling Tool highlighting possible solutions to the most exposed generated threats.
services: security
documentationcenter: na
author: jegeib
manager: jegeib
editor: jegeib

ms.assetid: na
ms.service: information-protection
ms.subservice: aiplabels
ms.workload: na
ms.tgt_pltfrm: na
ms.topic: article
ms.date: 08/17/2017
ms.author: rodsan

---

# Microsoft Threat Modeling Tool mitigations

The Threat Modeling Tool is a core element of the Microsoft Security Development Lifecycle (SDL). It allows software architects to identify and mitigate potential security issues early, when they are relatively easy and cost-effective to resolve. As a result, it greatly reduces the total cost of development. Also, we designed the tool with non-security experts in mind, making threat modeling easier for all developers by providing clear guidance on creating and analyzing threat models.

Visit the **[Threat Modeling Tool](threat-modeling-tool.md)** to get started today!

## Mitigation categories

The Threat Modeling Tool mitigations are categorized according to the Web Application Security Frame, which consists of the following:

| Category | Description |
| -------- | ----------- |
| **[Auditing and Logging](threat-modeling-tool-auditing-and-logging.md)** | Who did what and when? Auditing and logging refer to how your application records security-related events |
| **[Authentication](threat-modeling-tool-authentication.md)** | Who are you? Authentication is the process where an entity proves the identity of another entity, typically through credentials, such as a user name and password |
| **[Authorization](threat-modeling-tool-authorization.md)** | What can you do? Authorization is how your application provides access controls for resources and operations |
| **[Communication Security](threat-modeling-tool-communication-security.md)** | Who are you talking to? Communication Security ensures all communication done is as secure as possible |
| **[Configuration Management](threat-modeling-tool-configuration-management.md)** | Who does your application run as? Which databases does it connect to? How is your application administered? How are these settings secured? Configuration management refers to how your application handles these operational issues |
| **[Cryptography](threat-modeling-tool-cryptography.md)** | How are you keeping secrets (confidentiality)? How are you tamper-proofing your data or libraries (integrity)? How are you providing seeds for random values that must be cryptographically strong? Cryptography refers to how your application enforces confidentiality and integrity |
| **[Exception Management](threat-modeling-tool-exception-management.md)** | When a method call in your application fails, what does your application do? How much do you reveal? Do you return friendly error information to end users? Do you pass valuable exception information back to the caller? Does your application fail gracefully? |
| **[Input Validation](threat-modeling-tool-input-validation.md)** | How do you know that the input your application receives is valid and safe? Input validation refers to how your application filters, scrubs, or rejects input before additional processing. Consider constraining input through entry points and encoding output through exit points. Do you trust data from sources such as databases and file shares? |
| **[Sensitive Data](threat-modeling-tool-sensitive-data.md)** | How does your application handle sensitive data? Sensitive data refers to how your application handles any data that must be protected either in memory, over the network, or in persistent stores |
| **[Session Management](threat-modeling-tool-session-management.md)** | How does your application handle and protect user sessions? A session refers to a series of related interactions between a user and your Web application |

This helps you identify:

* Where are the most common mistakes made
* Where are the most actionable improvements

As a result, you use these categories to focus and prioritize your security work, so that if you know the most prevalent security issues occur in the input validation, authentication and authorization categories, you can start there. For more information visit **[this patent link](https://www.google.com/patents/US7818788)**

## Next steps

Visit **[Threat Modeling Tool Threats](threat-modeling-tool-threats.md)** to learn more about the threat categories the tool uses to generate possible design threats.