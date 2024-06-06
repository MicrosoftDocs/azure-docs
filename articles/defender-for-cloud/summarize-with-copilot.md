---
title: Summarize recommendations with Copilot for Security
author: Elazark
ms.author: elkrieger
description: Learn how to summarize recommendations with Copilot for Security in Microsoft Defender for Cloud and improve your security posture.
ms.topic: how-to
ms.date: 06/05/2024
#customer intent: As a security professional, I want to understand how to use Copilot to summarize recommendations in Defender for Cloud so that I can improve my security posture.
---

# Summarize recommendations with Copilot for Security

Microsoft Defender for Cloud's integration with Microsoft Copilot for Security allows you to summarize a recommendation to get a better understanding of the risks and vulnerabilities that are present in your environment.

By summarizing a recommendation, you can get a quick overview of the recommendation in natural language. Summarizing the recommendation helps you understand the information presented in a recommendation and allows you to prioritize your remediation efforts.

## Prerequisites

- [Enable Defender for Cloud on your environment](connect-azure-subscription.md).

- [Have access to Azure Copilot](../copilot/overview.md).

- [Have Security Compute Units assigned for Copilot for Security](/copilot/security/get-started-security-copilot).

## Summarize with Copilot

Once a recommendation is selected, you can summarize it with Copilot. By using prompts, you can get a better understanding of the recommendation and decide how best to handle it.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Microsoft Defender for Cloud**.

1. Navigate to **Recommendations**.

1. Select a recommendation.

1. Select **Summarize with Copilot**.

    :::image type="content" source="media/summarize-with-copilot/summarize-with-copilot.png" alt-text="Screenshot of a recommendation that shows where the Summarize with Copilot button is located." lightbox="media/summarize-with-copilot/summarize-with-copilot.png":::

1. Review the provided summary.

1. Enter more prompts as needed.

    :::image type="content" source="media/summarize-with-copilot/summarize-with-copilot-results.png" alt-text="Screenshot of the Copilot window that shows the summary of the recommendation." lightbox="media/summarize-with-copilot/summarize-with-copilot-results.png":::

Once you have a better understanding of the recommendation, you can decide how best to handle it. Copilot remains open and you can enter other prompts as needed.

## Next step

> [!div class="nextstepaction"]
> [Remediate recommendations with Copilot for Security](remediate-with-copilot.md)
