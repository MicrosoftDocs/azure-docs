---
title: Threats - Microsoft Threat Modeling Tool - Azure | Microsoft Docs
description: Threat category page for the Microsoft Threat Modeling Tool, containing categories for all exposed generated threats.
services: security
documentationcenter: na
author: jegeib
manager: jegeib
editor: jegeib

ms.assetid: na
ms.service: security
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/17/2017
ms.author: rodsan

---

# Microsoft Threat Modeling Tool threats

The Threat Modeling Tool is a core element of the Microsoft Security Development Lifecycle (SDL). It allows software architects to identify and mitigate potential security issues early, when they are relatively easy and cost-effective to resolve. As a result, it greatly reduces the total cost of development. Also, we designed the tool with non-security experts in mind, making threat modeling easier for all developers by providing clear guidance on creating and analyzing threat models.

> Visit the **[Threat Modeling Tool](./azure-security-threat-modeling-tool.md)** to get started today!

The Threat Modeling Tool helps you answer certain questions, such as the ones below:

* How can an attacker change the authentication data?
* What is the impact if an attacker can read the user profile data?
* What happens if access is denied to the user profile database?

## STRIDE model

To better help you formulate these kinds of pointed questions, Microsoft uses the STRIDE model, which categorizes different types of threats and simplifies the overall security conversations.

| Category | Description |
| -------- | ----------- |
| **Spoofing** | Involves illegally accessing and then using another user's authentication information, such as username and password |
| **Tampering** | Involves the malicious modification of data. Examples include unauthorized changes made to persistent data, such as that held in a database, and the alteration of data as it flows between two computers over an open network, such as the Internet |
| **Repudiation** | Associated with users who deny performing an action without other parties having any way to prove otherwise—for example, a user performs an illegal operation in a system that lacks the ability to trace the prohibited operations. Non-Repudiation refers to the ability of a system to counter repudiation threats. For example, a user who purchases an item might have to sign for the item upon receipt. The vendor can then use the signed receipt as evidence that the user did receive the package |
| **Information Disclosure** | Involves the exposure of information to individuals who are not supposed to have access to it—for example, the ability of users to read a file that they were not granted access to, or the ability of an intruder to read data in transit between two computers |
| **Denial of Service** | Denial of service (DoS) attacks deny service to valid users—for example, by making a Web server temporarily unavailable or unusable. You must protect against certain types of DoS threats simply to improve system availability and reliability |
| **Elevation of Privilege** | An unprivileged user gains privileged access and thereby has sufficient access to compromise or destroy the entire system. Elevation of privilege threats include those situations in which an attacker has effectively penetrated all system defenses and become part of the trusted system itself, a dangerous situation indeed |

## Next steps

Proceed to **[Threat Modeling Tool Mitigations](./azure-security-threat-modeling-tool-mitigations.md)** to learn the different ways you can mitigate these threats with Azure.