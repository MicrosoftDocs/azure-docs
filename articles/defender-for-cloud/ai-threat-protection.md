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

> [!IMPORTANT]
> The Defender for Workloads AI plan is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

The Defender for AI Workloads plan in Microsoft Defender for Cloud provides AI threat protection capabilities through that help you secure generative AI applications help you identify and respond to security issues in generative AI applications.

Defender for Cloud's AI threat protection integrates with [Azure AI Content Safety Prompt Shields](../ai-services/content-safety/concepts/jailbreak-detection.md) and Microsoft's intelligence signals to secure your generative AI applications by providing alerts for the following types of threats:

- **Sensitive data leak and data poisoning** - The inadvertent exposure or manipulation of sensitive organizational data, poses significant risks to confidentiality and compliance.

- **Jailbreak** - When threat actors exploit vulnerabilities in generative AI applications to bypass safety mechanisms, provoke restricted behaviors, and compromise the integrity of AI applications.

- **Credential threat** - Unauthorized attempts to obtain privileged information, such as usernames and passwords, from AI systems can lead to unauthorized access and data breaches.

## Defender XDR integration

AI workload alerts are included in the [Defender for Cloud's alerts and incidents that are integrated with Defender XDR](concept-integration-365.md). 

Security teams can handle AI Workloads alerts on within the Defender portal. Security teams can correlate alerts and incidents, and gain an understanding of the full scope of an attack, including malicious activities associated with generative AI applications from the XDR dashboard.

## Signing up for the limited public preview

To use the Defender for Workloads AI plan, enroll in the limited public preview program by filling out the [registration form](https://aka.ms/D4AI/PublicPreviewAccess).

After you fill out the registration form and are accepted into the preview program, you can onboard your Azure subscription to the preview program.

## Related content

- [Onboard Defender for AI Workloads (Preview)](ai-onboarding.md)
