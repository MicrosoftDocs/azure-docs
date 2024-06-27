---
title: Delegate recommendations with Copilot for Security
author: Elazark
ms.author: elkrieger
description: Learn how to delegate recommendations with Copilot in Microsoft Defender for Cloud and improve your security posture.
ms.topic: how-to
ms.date: 06/10/2024
#customer intent: As a security professional, I want to understand how to use Copilot to delegate recommendations in Defender for Cloud so that I can improve my security posture.
---

# Delegate recommendations with Copilot for Security

Microsoft Defender for Cloud's integration with Microsoft Copilot for Security allows you to delegate recommendations that are present on the recommendations page with natural language prompts. Recommendations can be delegated to another person or team. 

Delegating recommendations can improve your security posture by having the right people address the risks and vulnerabilities presented by the recommendations that are present in your environment.

## Prerequisites

- [Enable Defender for Cloud on your environment](connect-azure-subscription.md).

- [Have access to Azure Copilot](../copilot/overview.md).

- [Have Security Compute Units assigned for Copilot for Security](/copilot/security/get-started-security-copilot).

## Delegate a recommendation

You can use Copilot to delegate recommendations to ensure the right person or team is handling the risks and vulnerabilities that are present in your environment.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Microsoft Defender for Cloud**.

1. Navigate to **Recommendations**.

1. Select a recommendation.

1. Select **Summarize with Copilot**.

1. Review the summary.

1. Select **Delegate the remediation to the resource owner**.

    :::image type="content" source="media/delegate-with-copilot/delegate-recommendation.png" alt-text="Screenshot that shows where the Delegate the recommendation prompt is located." lightbox="media/delegate-with-copilot/delegate-recommendation.png":::

1. Review the result.

1. Select **here** to send an email to your colleague.

1. Review the email and add recipients.

1. Select **Send**.

Once the recommendation is delegated, you can monitor the progress of the remediation on Defender for Cloud's recommendations page. Copilot remains open and you can enter other prompts as needed.

## Next step

> [!div class="nextstepaction"]
> [Remediate code with Copilot for Security](remediate-code-with-copilot.md)
