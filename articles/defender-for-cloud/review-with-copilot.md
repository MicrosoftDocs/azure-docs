---
title: Analyze recommendations wih Copilot for Security
author: Elazark
ms.author: elkrieger
description: Learn how to analyze recommendations with Copilot in Microsoft Defender for Cloud.
ms.topic: how-to
ms.date: 05/23/2024
#customer intent: As a security professional, I want to understand how to use Copilot to analyze recommendations in Defender for Cloud so that I can improve my security posture.
---

# Analyze recommendations with Copilot for Security

Microsoft Copilot for Security integration in Microsoft Defender for Cloud allows you to analyze all of the recommendations presented on the recommendations page. By narrowing the scope of the recommendations page you can focus on specific recommendations and get a better understanding of your security posture.

Once you have narrowed down the list of recommendations you can investigate specific recommendations and gain a better understanding of the risks and vulnerabilities that are present in your environment.

## Analyze a recommendation

Copilot gives you the ability to analyze your recommendations. By using prompts, you can filter and refine the presented recommendations to focus on specific areas of interest.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Microsoft Defender for Cloud**.

1. Navigate to **Recommendations**.

1. Select **Analyze with Copilot**.

    :::image type="content" source="media/review-with-copilot/analyze-with-copilot.png" alt-text="Screenshot of the recommendations page that shows where the analyze with Copilot button is located." lightbox="media/review-with-copilot/analyze-with-copilot.png":::

1. Select one of the suggested prompts or enter a prompt in natural language.

    Some sample prompts include:

    - Show critical risks for publicly exposed resources
    - Show critical risks to sensitive data
    - Show resources with high severity vulnerabilities

1. Review the answer given by Copilot and select **Show results**.

    :::image type="content" source="media/review-with-copilot/show-results-copilot.png" alt-text="Screenshot that shows where the show results button is located in the Copilot window." lightbox="media/review-with-copilot/show-results-copilot.png":::

1. (Optional) You can further refine the results by prompting Copilot with additional questions such as:

    - Focus on risks to sensitive data
    - Focus on resources with high severity vulnerabilities
    - Focus on host code execution

1. Select **Show results** to view the updated recommendations.

The recommendations page will update with the appropriate filters applied based on the prompt you provided.

## Next step

> [!div class="nextstepaction"]
> [Remediate recommendations](implement-security-recommendations.md)
