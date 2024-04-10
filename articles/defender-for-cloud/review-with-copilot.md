---
title: Review recommendations wih Copilot
author: Elazark
ms.author: elkrieger
description: Learn how to review recommendations with Copilot in Microsoft Defender for Cloud.
ms.topic: how-to
ms.date: 04/10/2024
#customer intent: As a security professional, I want to understand how to use Copilot to review recommendations in Defender for Cloud so that I can improve my security posture.
---

# Review recommendations with Copilot

Microsoft Copilot is a generative AI-powered security solution that increases the efficiency and capabilities of users in order to improve security outcomes at machine speed and scale. Copilot provides a natural language, assistive copilot experience. Defender for Cloud has integrated Copilot into the Defender for Cloud experience in order to provide users with the ability to ask questions and get answers in natural language. Copilot can help you understand the context of a recommendation, the impact of implementing a recommendation, and the steps to take to implement a recommendation. Copilot can also help you understand the security posture of your organization and the impact of implementing a recommendation on your security posture.

Copilot's integration in Defender for Cloud allows you to analyze all of the recommendations presented on the recommendations page. By narrowing the scope of the recommendations page you can focus on specific areas of interest and get a better understanding of your security posture.

Once you have narrowed down the list of recommendations you can view a specific recommendation and get a summary of the recommendation using Copilot. The summary will provide you with a quick overview of the recommendation in natural language. You can then use Copilot to learn more about the recommendation or remediate it using prompts within Copilot.

## Analyze with Copilot

Copilot gives you the ability to analyze your recommendations. By using prompts, you can filter and refine the presented recommendations to focus on specific areas of interest.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Microsoft Defender for Cloud**.

1. Navigate to **Recommendations**.

1. Select **Analyze with Copilot**.

    :::image type="content" source="media/review-with-copilot/analyze-with-copilot.png" alt-text="Screenshot of the recommendations page that shows where the analyze with Copilot button is located." lightbox="media/review-with-copilot/analyze-with-copilot.png":::

1. Select one of the suggested prompts or enter a question in natural language.

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

The recommendations page will update with the approriate filters applied based on the prompt you provided.

## Summarize with Copilot

Copilot gives you the ability to summarize a recommendation. By using prompts, you can get a quick overview of the recommendation in natural language.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Microsoft Defender for Cloud**.

1. Navigate to **Recommendations**.

1. Select a recommendation.

1.  
