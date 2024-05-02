---
title: Overview - AI threat protection
description: Learn about AI threat protection in Microsoft Defender for Cloud and how it protects your resources from AI threats.
ms.date: 05/01/2024
ms.topic: overview
ms.author: elkrieger
author: Elazark
#customer intent: As a cloud security professional, I want to understand how to secure my generative AI resources using Defender for Cloud's AI security posture management capabilities.
---

# Overview - AI threat protection

The Defender for AI Workloads plan in Microsoft Defender for Cloud provides AI threat protection capabilities that can help you identify and respond in real time to  security issues in your generative AI applications.

> [!IMPORTANT]
> The Defender for AI Workloads plan is currently in preview.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Defender for Cloud's AI threat protection integrates with [Azure AI Content Safety Prompt Shields](../ai-services/content-safety/concepts/jailbreak-detection.md) and Microsoft's threat intelligence signals to deliver contextual and actionable security alerts associated with a range of threats such as sensitive data leakage, data poisoning, jailbreak and credentials theft.

:::image type="content" source="media/ai-threat-protection/threat-protection-ai.png" alt-text="Conceptual image that shows how enabling, detection and response works for threat protection." lightbox="media/ai-threat-protection/threat-protection-ai.png":::

> [!NOTE]
> Defender for AI Workloads relies on [Azure Open AI content filtering](../ai-services/openai/concepts/content-filter.md) for prompt-base triggered alert. If you opt out of prompt-based trigger alerts and removed that capability, it can affect Defender for Cloud's ability to monitor and detect such attacks.

## Defender XDR integration

Defender for Cloud AI workloads security alerts are integrated into [Defender XDR](concept-integration-365.md), enabling security teams to centralize alerts on AI workloads within the Defender XDR portal.

Security teams can correlate AI workloads alerts and incidents within the Defender XDR portal, and gain an understanding of the full scope of an attack, including malicious activities associated with their generative AI applications from the XDR dashboard.

## Signing up for the limited public preview

To use the Defender for AI Workloads plan, you must enroll in the limited public preview program by filling out the [registration form](https://aka.ms/D4AI/PublicPreviewAccess).

## Related content

After you're accepted into the preview program, you can [onboard Defender for AI Workloads (Preview)](ai-onboarding.md).
