---
title: Copilot for Security in Defender for Cloud
description: Learn about the benefits of copilot in Microsoft Defender for Cloud and how it applies to analyzing your security posture.
ms.date: 05/26/2024
author: dcurwin
ms.author: dacurwin
ms.topic: concept-article
# customer intent: As a security professional, I want to understand the benefits of Copilot in Microsoft Defender for Cloud and how it can help me analyze my security posture.
---

# Copilot for Security in Defender for Cloud

Microsoft Copilot for Security is a cloud-based AI platform that provides natural language copilot experience. It can help support security professionals to understand the context of a recommendation, the impact of implementing a recommendation, and assist with remediating or delegating a recommendation. For more information about what it can do, go to [What is Microsoft Copilot for Security?](/copilot/security/microsoft-security-copilot)

**Copilot for Security integrates with Microsoft Defender for Cloud**

Microsoft Defender for Cloud's integration with Copilot for Security enables users to understand the security posture of connected environments and understand and assist with the remediation process of those recommendations.

## How Copilot for Security works in Defender for Cloud

Defender for Cloud has integrated copilot into the recommendation experience by allowing you to analyze your recommendations with Copilot.

:::image type="content" source="media/copilot-security-in-defender-for-cloud/analyze-copilot.png" alt-text="Screenshot that shows the analyze with copilot button located on the recommendations page." lightbox="media/copilot-security-in-defender-for-cloud/analyze-copilot.png":::

When you open Copilot, you can use natural language prompts to ask questions about the recommendation. Copilot will provide you with a response in natural language that helps you understand the context of the recommendation, the impact of implementing the recommendation, and the steps to take to implement the recommendation.

Some sample prompts include:

- Show critical risks for publicly exposed resources
- Show critical risks to sensitive data
- Show resources with high severity vulnerabilities

Copilot is also available within recommendations and give you the ability to summarize the recommendations with Copilot.

:::image type="content" source="media/copilot-security-in-defender-for-cloud/summarize-copilot.png" alt-text="Screenshot of a recommendation that shows where the Summarize with Copilot button is located." lightbox="media/copilot-security-in-defender-for-cloud/summarize-copilot.png":::

By selecting summarize with Copilot, you are presented a quick summary of the recommendation in natural language. You can then use Copilot to learn more about the recommendation or remediate it using common language.

## Monitor your usage

Copilot for Security comes with a usage limit. When the usage in your organization is nearing its limit, you are notified of it when you submit a prompt. To avoid a disruption of service, you can contact the Azure capacity owner or contributor to increase the security compute units or limit the number of prompts.

Learn more about [usage limits](/copilot/security/manage-usage). 

## Related content

- [Analyze recommendations with Copilot for Security](analyze-with-copilot.md)
- [Summarize recommendations with Copilot for Security](summarize-with-copilot.md)
- [Remediate recommendations with Copilot for Security](remediate-with-copilot.md)
- [Delegate recommendations with Copilot for Security](delegate-with-copilot.md)
