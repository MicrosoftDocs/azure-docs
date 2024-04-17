---
title: Overview - AI threat protection
description: Learn about AI threat protection in Microsoft Defender for Cloud and how it protects your resources from AI threats.
ms.date: 04/15/2024
ms.topic: overview
ms.author: elkrieger
author: Elazark
#customer intent: As a cloud security professional, I want to understand how to secure my generative AI resources using Defender for Cloud's AI security posture management capabilities.
---

# Overview - AI threat protection

Defender for Cloud provides AI threat protection capabilities that help you secure your generative AI applications. These capabilities help you identify and respond to security issues in your generative AI applications.

Generative AI workloads are come with distinct vulnerabilities where threat actors can target not only the model itself, but also the entire application ecosystem, including the training and grounding data it leverages. As organizations embed AI into their workflows, security teams must secure their systems against attack techniques that exploit these vulnerabilities.

Defender for Cloud's AI threat protection integrates with [Azure AI Content Safety Prompt Shields](../ai-services/content-safety/concepts/jailbreak-detection.md) and Microsoft's intelligence signals to secure your generative AI applications by providing alerts for the following types of threats:

- **Sensitive data leak and data poisoning** - The inadvertent exposure or manipulation of sensitive organizational data, poses significant risks to confidentiality and compliance.

- **Jailbreak** - When threat actors exploit vulnerabilities in generative AI applications to bypass safety mechanisms, provoke restricted behaviors, and compromise the integrity of AI applications.

- **Credential threat** - Unauthorized attempts to obtain privileged information, such as usernames and passwords, from AI systems can lead to unauthorized access and data breaches.

Defender for Cloud relies on [Azure Open AI content filtering](../ai-services/openai/concepts/content-filter.md) for prompt-base triggered alert. If you have opted out of prompt-based trigger alerts and removed that capability, it can affect Defender for Cloud's ability to monitor and detect such attacks.

## Defender XDR integration

[Defender for Cloud's alerts and incidents integrated with Defender XDR](concept-integration-365.md), allow security teams to handle AI Workloads alerts on within the Defender XDR portal. Security teams can correlate alerts and incidents, and gain an understanding of the full scope of an attack, including malicious activities associated with generative AI applications from the XDR dashboard.

## Limited public preview

To gain the benefits provided by the Defender for Workloads AI threat protection capabilities, you must be enrolled in the limited public preview program. To enroll in the preview you must fill out the [registration form](https://aka.ms/D4AI/PublicPreviewAccess).

The plan is offered in a preview capacity to scale, fine tune and enhance product offering with relevant features.

Once you have filled out the registration form and been accepted into the preview program, you will be able to oboard your Azure subscription to the preview program.

## Related content

- [Onboard Defender for AI Workloads (Preview)](ai-onboarding.md)
- [Security alerts and incidents](alerts-overview.md)
- [Manage and respond to security alerts](managing-and-responding-alerts.md)
