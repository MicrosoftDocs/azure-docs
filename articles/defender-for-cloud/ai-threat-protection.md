---
title: Overview - AI threat protection
description: Learn about AI threat protection in Microsoft Defender for Cloud and how it protects your resources from AI threats.
ms.date: 04/18/2024
ms.topic: overview
ms.author: elkrieger
author: Elazark
#customer intent: As a cloud security professional, I want to understand how to secure my generative AI resources using Defender for Cloud's AI security posture management capabilities.
---

# Overview - AI threat protection

The Defender for AI Workloads plan in Microsoft Defender for Cloud provides AI threat protection capabilities that can help you identify and respond in real time to  security issues in your generative AI applications.

> [!IMPORTANT]
> The Defender for Workloads AI plan is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Defender for Cloud's AI threat protection integrates with [Azure AI Content Safety Prompt Shields](../ai-services/content-safety/concepts/jailbreak-detection.md) and Microsoft's threat intelligence signals to deliver contextual and actionable security alerts associated with a range of threats including:

- **Sensitive data leak and data poisoning** - The inadvertent exposure or manipulation of sensitive organizational data, poses significant risks to confidentiality and compliance.

- **Jailbreak** - When threat actors exploit vulnerabilities in generative AI applications to bypass safety mechanisms, provoke restricted behaviors, and compromise the integrity of AI applications.

- **Credential threat** - Unauthorized attempts to obtain privileged information, such as usernames and passwords, from AI systems can lead to unauthorized access and data breaches.

:::image type="content" source="media/ai-threat-protection/threat-protection-ai.png" alt-text="Conceptual image that shows how enabling, detection and response works for threat protection." lightbox="media/ai-threat-protection/threat-protection-ai.png":::

> [!NOTE]
> Defender for AI Workloads relies on [Azure Open AI content filtering](../ai-services/openai/concepts/content-filter.md) for prompt-base triggered alert. If you opt out of prompt-based trigger alerts and removed that capability, it can affect Defender for Cloud's ability to monitor and detect such attacks.

## Defender XDR integration

Defender for Cloud AI workload security alerts are integrated into the [Defender for Cloud's alerts and incidents that are integrated with Defender XDR](concept-integration-365.md), enabling security teams to centralize alerts on AI workloads within the Defender XRD portal.

Security teams can handle AI Workloads alerts on within the Defender portal. Security teams can correlate alerts and incidents, and gain an understanding of the full scope of an attack, including malicious activities associated with their generative AI applications from the XDR dashboard.

## Signing up for the limited public preview

To use the Defender for Workloads AI plan, you must enroll in the limited public preview program by filling out the [registration form](https://aka.ms/D4AI/PublicPreviewAccess).

After you fill out the registration form and are accepted into the preview program, you can [onboard your Azure subscription to the preview program](ai-onboarding.md#enable-the-defender-for-ai-workloads-plan).

## Related content

- [Onboard Defender for AI Workloads (Preview)](ai-onboarding.md)
