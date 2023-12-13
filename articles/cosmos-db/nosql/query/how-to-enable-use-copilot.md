---
title: Query NoSQL with Microsoft Copilot for Azure (preview)
titleSuffix: Azure Cosmos DB for NoSQL
description: Generate suggestions from natural language prompts to write NoSQL queries using Microsoft Copilot for Azure in Cosmos DB (preview).
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.custom:
  - ignite-2023
ms.topic: how-to
ms.date: 11/10/2023
# CustomerIntent: As a developer, I want to use Copilot so that I can write queries faster and easier.
---

# Generate NoSQL queries with Microsoft Copilot for Azure in Cosmos DB (preview)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Microsoft Copilot for Azure in Cosmos DB (preview) can assist with authoring Azure Cosmos DB for NoSQL queries by generating queries based on your natural English-language prompts. Copilot is available to use in the API for NoSQL's query editor within the Data Explorer. With Copilot in the API for NoSQL, you can:

- Ask questions about your data as you would in text or conversation to generate a NoSQL query.
- Learn to write queries faster through detailed explanations of the generated query.
  
> [!WARNING]
> Copilot is a preview feature that is powered by large language models (LLMs). Output produced by Copilot may contain inaccuracies, biases, or other unintended content. This occurs because the model powering Copilot was trained on information from the internet and other sources. As with any generative AI model, humans should review the output produced by Copilot before use.

## Prerequisites

- An existing Azure Cosmos DB for NoSQL account
  - If you don't have an Azure subscription, [create an account for free](https://azure.microsoft.com/free).
  - If you have an existing Azure subscription, [create a new Azure Cosmos DB for NoSQL account](../quickstart-portal.md).

## Access the feature

Before starting with Copilot, you must first enable the feature in your subscription and access the feature in the Data Explorer for your target API for NoSQL account.

1. Navigate to the [Azure portal](https://portal.azure.com).

    > [!IMPORTANT]
    > Review these [preview terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/#AzureOpenAI-PoweredPreviews) before using query Copilot for NoSQL.

1. Enable the **Copilot** in Azure Feature Enablement Control (AFEC). For more information, see [enable preview features](../../../azure-resource-manager/management/preview-features.md).

1. Navigate to any API for NoSQL resource.

1. Select **Data Explorer** from the navigation pane.

    :::image type="content" source="media/how-to-enable-use-copilot/initial-screen.png" lightbox="media/how-to-enable-use-copilot/initial-screen.png" alt-text="Screenshot of the Data Explorer welcome screen with Copilot card.":::

1. Next, open the query editor experience from one of two ways:

   - Select the **Query faster with Copilot** card on the Data Explorer's welcome screen. This option includes the `CopilotSampledb` database and `SampleContainer` container, which contains sample data for you to use with Copilot.

   - Select an existing API for NoSQL database and container. Then, select **New SQL Query** from the menu bar.

## Generate a query

You can use Copilot to generate NoSQL queries from natural language text on any container in your database.

1. Make sure the Copilot interface is enabled. You can enable the interface by selecting the **Copilot** button in the Data Explorer's menu.

1. Enter a prompt or question about your data in the input area and then trigger the prompt. Then, trigger the generation of a NoSQL query and explanation in the query editor.

    :::image type="content" source="media/how-to-enable-use-copilot/interface.png" lightbox="media/how-to-enable-use-copilot/interface.png" alt-text="Screenshot of the Copilot interface in the query editor.":::

    > [!WARNING]
    > As with any generative AI model, humans should review the output produced by Copilot before use.

1. Run the query by selecting **Execute query** in the Data Explorer's menu.

## Give feedback

We use feedback on generated queries to help improve and train Copilot. This feedback is crucial to improving the quality of the suggestions from Copilot.

1. To send feedback on queries, use the feedback mechanism within the query editor.

1. Select either the **positive** or **negative** feedback option.

    - Positive feedback triggers the tooling to send the generated query to Microsoft as a data point for where the Copilot was successful.

    - Negative feedback triggers a dialog, which requests more information. The tooling sends this information, and the generated query, to Microsoft to help improve Copilot.

        :::image type="content" source="media/how-to-enable-use-copilot/feedback-dialog.png" alt-text="Screenshot of the Microsoft Copilot feedback form.":::

## Write effective prompts

Here are some tips for writing effective prompts.

- When crafting prompts for Copilot, be sure to start with a clear and concise description of the specific information you're looking. If you're unsure of your data's structure, run the `SELECT TOP 1 - FROM c` query to see the first item in the container.

- Use keywords and context that are relevant to the structure of items in your container. This context helps Copilot generate accurate queries. Specify properties and any filtering criteria as explicitly as possible. Copilot should be able to correct typos or understand context given the properties of the existing items in your container.

- Avoid ambiguous or overly complex language in your prompts. Simplify the question while maintaining its clarity. This editing ensures Copilot can effectively translate it into a meaningful NoSQL query that retrieves the desired data from the container.

- The following example prompts are clear, specific, and tailored to the properties of your data items, making it easier for Copilot to generate accurate NoSQL queries:

  - `Show me a product`
  - `Show all products that have the word "ultra" in the name or description`
  - `Find the products from Japan`
  - `Count all the products, group by each category`
  - `Show me all names and prices of products that reviewed by someone with a username that contains "Mary"`

## Next step

> [!div class="nextstepaction"]
> [Review the Copilot FAQ](../../copilot-faq.yml)
