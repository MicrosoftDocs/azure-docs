---
title: Microsoft Threat Modeling Tool - Azure | Microsoft Docs
description: main page for the Microsoft Threat Modeling Tool, containing mitigations for the most exposed generated threats
services: security
documentationcenter: na
author: RodSan
manager: RodSan
editor: RodSan

ms.assetid: na
ms.service: security
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/16/2017
ms.author: rodsan

---

# Microsoft Threat Modeling Tool 
The Threat Modeling Tool is a core element of the Microsoft Security Development Lifecycle (SDL). It allows software architects to identify and mitigate potential security issues early, when they are relatively easy and cost-effective to resolve. As a result, it greatly reduces the total cost of development. Also, we designed the tool with non-security experts in mind, making threat modeling easier for all developers by providing clear guidance on creating and analyzing threat models. 

The tool enables anyone to:
* Communicate about the security design of their systems
* Analyze those designs for potential security issues using a proven methodology
* Suggest and manage mitigations for security issues

Here are some tooling capabilities and innovations, just to name a few:
* **Automation:** Guidance and feedback in drawing a model
* **STRIDE per Element:** Guided analysis of threats and mitigations
* **Reporting:** Security activities and testing in the verification phase
* **Unique Methodology:** Enables users to better visualize and understand threats
* **Designed for Developers and Centered on Software:** many approaches are centered on assets or attackers. We are centered on software. We build on activities that all software developers and architects are familiar with -- such as drawing pictures for their software architecture
* **Focused on Design Analysis:** The term "threat modeling" can refer to either a requirements or a design analysis technique. Sometimes, it refers to a complex blend of the two. The Microsoft SDL approach to threat modeling is a focused design analysis technique

## Threats

The Threat Modeling Tool helps you answer certain questions, such as the ones below:

* How can an attacker change the authentication data?
* What is the impact if an attacker can read the user profile data?
* What happens if access is denied to the user profile database?

To better help you formulate these kinds of pointed questions, Microsoft uses the STRIDE model, which categorizes different types of threats and simplifies the overall security conversations.

| Category | Description |
| -------- | ----------- |
| Spoofing | Involves illegally accessing and then using another user's authentication information, such as username and password |
| Tampering | Involves the malicious modification of data. Examples include unauthorized changes made to persistent data, such as that held in a database, and the alteration of data as it flows between two computers over an open network, such as the Internet |
| Repudiation | Associated with users who deny performing an action without other parties having any way to prove otherwise—for example, a user performs an illegal operation in a system that lacks the ability to trace the prohibited operations. Nonrepudiation refers to the ability of a system to counter repudiation threats. For example, a user who purchases an item might have to sign for the item upon receipt. The vendor can then use the signed receipt as evidence that the user did receive the package |
| Information Disclosure | Involves the exposure of information to individuals who are not supposed to have access to it—for example, the ability of users to read a file that they were not granted access to, or the ability of an intruder to read data in transit between two computers |
| Denial of Service | Denial of service (DoS) attacks deny service to valid users—for example, by making a Web server temporarily unavailable or unusable. You must protect against certain types of DoS threats simply to improve system availability and reliability |
| Elevation of Privilege | An unprivileged user gains privileged access and thereby has sufficient access to compromise or destroy the entire system. Elevation of privilege threats include those situations in which an attacker has effectively penetrated all system defenses and become part of the trusted system itself, a dangerous situation indeed |

## Mitigations

The Threat Modeling Tool mitigations are categorized according to the Web Application Security Frame, which consists of the following:

| Category | Description |
| -------- | ----------- |
| [Auditing and Logging](https://docs.microsoft.com/azure/security/azure-security-threat-modeling-tool-auditing-and-logging) | Who did what and when? Auditing and logging refer to how your application records security-related events |
| [Authentication](https://docs.microsoft.com/azure/security/azure-security-threat-modeling-tool-authentication) | Who are you? Authentication is the process where an entity proves the identity of another entity, typically through credentials, such as a user name and password |
| [Authorization](https://docs.microsoft.com/azure/security/azure-security-threat-modeling-tool-authorization) | What can you do? Authorization is how your application provides access controls for resources and operations | 
| [Communication Security](https://docs.microsoft.com/azure/security/azure-security-threat-modeling-tool-communication-security) | Who are you talking to? Communication Security ensures all communication done is as secure as possible |
| [Configuration Management](https://docs.microsoft.com/azure/security/azure-security-threat-modeling-tool-configuration-management) | Who does your application run as? Which databases does it connect to? How is your application administered? How are these settings secured? Configuration management refers to how your application handles these operational issues | 
| [Cryptography](https://docs.microsoft.com/azure/security/azure-security-threat-modeling-tool-cryptography) | How are you keeping secrets (confidentiality)? How are you tamper-proofing your data or libraries (integrity)? How are you providing seeds for random values that must be cryptographically strong? Cryptography refers to how your application enforces confidentiality and integrity | 
| [Exception Management](https://docs.microsoft.com/azure/security/azure-security-threat-modeling-tool-exception-management) | When a method call in your application fails, what does your application do? How much do you reveal? Do you return friendly error information to end users? Do you pass valuable exception information back to the caller? Does your application fail gracefully? |
| [Input Validation](https://docs.microsoft.com/azure/security/azure-security-threat-modeling-tool-input-validation) | How do you know that the input your application receives is valid and safe? Input validation refers to how your application filters, scrubs, or rejects input before additional processing. Consider constraining input through entry points and encoding output through exit points. Do you trust data from sources such as databases and file shares? |
| [Sensitive Data](https://docs.microsoft.com/azure/security/azure-security-threat-modeling-tool-sensitive-data) | How does your application handle sensitive data? Sensitive data refers to how your application handles any data that must be protected either in memory, over the network, or in persistent stores | 
| [Session Management](https://docs.microsoft.com/azure/security/azure-security-threat-modeling-tool-session-management) | How does your application handle and protect user sessions? A session refers to a series of related interactions between a user and your Web application | 

This helps you identify: 

* Where are the most common mistakes made
* Where are the most actionable improvements

As a result, you use these categories to focus and prioritize your security work, so that if you know the most prevalent security issues occur in the input validation, authentication and authorization categories, you can start there. For more information click [here](https://www.google.com/patents/US7818788)

## Next Steps
Check out these valuable links to get started today:
* [Download Link](https://www.microsoft.com/download/details.aspx?id=49168)
* [Getting Started](https://msdn.microsoft.com/magazine/dd347831.aspx)
* [Core Training](https://www.microsoft.com/download/details.aspx?id=16420)

While you're at it, check out what a few Threat Modeling Tool experts have done:
* [Threats Manager](https://simoneonsecurity.com/threatsmanagersetup-v1-5-10/)
* [Simone Curzi Security Blog](https://simoneonsecurity.com/)