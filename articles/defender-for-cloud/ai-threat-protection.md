---
title: AI threat protection
description: Learn about AI threat protection in Microsoft Defender for Cloud and how it protects your resources from AI threats.
ms.date: 04/15/2024
ms.topic: overview
ms.author: elkrieger
author: Elazark
#customer intent: As a cloud security professional, I want to understand how to secure my GenAI resources using Defender for Cloud's AI security posture management capabilities.
---

# AI threat protection

Generative Artificial Intelligence (GenAI) based applications introduce various new risks and threats to organizations including Disruption of Service (DOS) attacks and User Prompt Injection Attacks (UPIA). These risks can generate the following alerts in Microsoft Defender for Cloud:

- **Jailbreak** - UPIA - an intentional attempt by a user to exploit the vulnerabilities of an LLM-powered system, bypass its safety mechanisms, and provoke restricted behaviors.

- **Credential threat** - UPIA - an attempt by a user to get privileged information such as usernames and passwords from the AI.

- **Sensitive data leak** - UPIA - an attempt by a user to bypass the model and application guardrails and obtain unauthorized sensitive data.

- **Wallet / DOS** - an attempt by a user to disrupt the service by sending a large number of requests to the AI model.

Organizations need to identify, catalog, monitor, and govern the utilization of GenAI applications against potential risks such as sensitive information disclosure and insecure response handling.

To combat these risks, Microsoft Defender for Cloud provides alerts that help you identify and respond to security issues in your GenAI applications.