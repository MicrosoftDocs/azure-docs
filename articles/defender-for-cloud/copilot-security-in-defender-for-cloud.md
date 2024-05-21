---
title: Copilot for Security in Defender for Cloud
description: Learn about the benefits of copilot in Microsoft Defender for Cloud and how it applies to analyzing your security posture.
ms.date: 05/21/2024
author: dcurwin
ms.author: dacurwin
ms.topic: concept-article
# customer intent: As a security professional, I want to understand the benefits of Copilot in Microsoft Defender for Cloud and how it can help me analyze my security posture.
---

# Copilot for Security in Defender for Cloud

Microsoft Copilot for Security is a generative AI-powered security solution that helps increase the efficiency and capabilities of defenders to improve security outcomes at machine speed and scale. Copilot for Security provides a natural language, assistive experience that support security professionals in end-to-end scenarios such as incident response, threat hunting, intelligence gathering, and posture management.

Microsoft Defender for Cloud has integrated Copilot into the security experience in order to provide users with the ability to ask questions and get answers in natural language. Copilot can help you understand the context of a recommendation, the impact of implementing a recommendation, and the steps to take to implement a recommendation. Copilot can also help you understand the security posture of your organization and the impact of implementing a recommendation on your security posture.

## How does Copilot for Security work?

Microsoft Copilot for Security capabilities can be accessed through an immersive standalone experience and through intuitive embedded experiences available in other Microsoft security products. The foundation language model and proprietary Microsoft technologies work together in an underlying system that helps increase the efficiency and capabilities of defenders.

- Microsoft security solutions such as Microsoft Defender XDR, Microsoft Sentinel, Microsoft Intune integrate seamlessly with Copilot for Security. There are some embedded experiences available in Microsoft security solutions that give access to Copilot for Security and prompting capabilities in the context of their work within those solutions.

- Plugins from Microsoft and third-party security products are a means to extend and integrate services with Copilot for Security. Plugins bring more context from event logs, alerts, incidents, and policies from both Microsoft security products and supported third-party solutions such as ServiceNow.

- Copilot for Security also has access to threat intelligence and authoritative content through plugins. These plugins can search across Microsoft Defender Threat Intelligence articles and intel profiles, Microsoft Defender XDR threat analytics reports, and vulnerability disclosure publications, among others.

    :::image type="content" source="media/copilot-security-in-defender-for-cloud/security-copilot-diagram.png" alt-text="Image of how Copilot for Security works." lightbox="media/security-copilot-diagram.png":::

Here's an explanation of how Microsoft Copilot for Security works:

- User prompts from security products are sent to Copilot for Security.

- Copilot for Security then preprocesses the input prompt through an approach called grounding, which improves the specificity of the prompt to help you get answers that are relevant and actionable to your prompt. Copilot for Security accesses plugins for preprocessing, then sends the modified prompt to the language model.

- Copilot for Security takes the response from the language model and post-processes it. This post-processing includes accessing plugins to gain contextualized information.

- Copilot for Security returns the response, where the user can review and assess the response.

Copilot for Security iteratively processes and orchestrates these sophisticated services to help produce results that are relevant to your organization because they're contextually based on your organizational data.

## How Copilot for Security works  in Defender for Cloud

Defender for Cloud has integrated copilot into the recommendation experience by allowing you to analyze your recommendations with Copilot.

:::image type="content" source="media/copilot-security-in-defender-for-cloud/analyze-copilot.png" alt-text="Screenshot that shows the analyze with copilot button located on the recommendations page." lightbox="media/copilot/analyze-copilot.png":::

When you open Copilot, you can use natural language prompts to ask questions about the recommendation. Copilot will provide you with a response in natural language that helps you understand the context of the recommendation, the impact of implementing the recommendation, and the steps to take to implement the recommendation.

Some sample prompts include:

- Show critical risks for publicly exposed resources
- Show critical risks to sensitive data
- Show resources with high severity vulnerabilities

Copilot is also available within recommendations and give you the ability to summarize the recommendations with Copilot.

:::image type="content" source="media/copilot-security-in-defender-for-cloud/summarize-copilot.png" alt-text="Screenshot of a recommendation that shows where the Summarize with Copilot button is located." lightbox="media/copilot/summarize-copilot.png":::

By selecting summarize with Copilot, you are presented a quick summary of the recommendation in natural language. You can then use Copilot to learn more about the recommendation or remediate it using common language.

## Related content

- [Review recommendations with Copilot](review-with-copilot.md)
