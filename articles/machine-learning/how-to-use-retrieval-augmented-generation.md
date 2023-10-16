---
title: Get started with RAG using a prompt flow sample (preview)
titleSuffix: Azure Machine Learning
description: Set up a prompt flow using the samples gallery.
services: machine-learning
ms.author: balapv
author: balapv
ms.reviewer: ssalgado
ms.service: machine-learning
ms.subservice: core
ms.date: 06/30/2023
ms.topic: how-to
ms.custom: prompt
---

# Get started with RAG using a prompt flow sample (preview)

In this tutorial, you'll learn how to use RAG by creating a prompt flow. A prompt is an input, a text command or a question provided to an AI model, to generate desired output like content or answer. The process of crafting effective and efficient prompts is called prompt design or prompt engineering. [Prompt flow](https://techcommunity.microsoft.com/t5/ai-machine-learning-blog/harness-the-power-of-large-language-models-with-azure-machine/ba-p/3828459) is the interactive editor of Azure Machine Learning for prompt engineering projects. To get started, you can create a prompt flow sample, which uses RAG from the samples gallery in Azure Machine Learning. You can use this sample to learn how to use Vector Index in a prompt flow. 

[!INCLUDE [machine-learning-preview-generic-disclaimer](includes/machine-learning-preview-generic-disclaimer.md)]


## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/).

* Access to Azure Open AI. 

* Enable prompt flow in your Azure Machine Learning workspace

In your Azure Machine Learning workspace, you can enable prompt flow by turn-on **Build AI solutions with Prompt flow** in the **Manage preview features** panel.


## Create a prompt flow using the samples gallery

1.  Select **Prompt flow** on the left menu.

:::image type="content" source="./media/how-to-use-retrieval-augmented-generation/prompt.png" alt-text="Screenshot showing prompt flow location.":::

2.  Select **Create**.

3. In the **Create from gallery** section, select **View Detail** on the Bring your own data Q&A sample.

:::image type="content" source="./media/how-to-use-retrieval-augmented-generation/view-detail.png" alt-text="Screenshot showing view details button on the prompt flow sample.":::

4. Read the instructions and select **Clone** to create a Prompt flow in your workspace.

:::image type="content" source="./media/how-to-use-retrieval-augmented-generation/clone.png" alt-text="Screenshot showing instructions and clone button on the prompt flow sample.":::

5. This opens a prompt flow, which you can run in your workspace and explore.

:::image type="content" source="./media/how-to-use-retrieval-augmented-generation/flow.png" alt-text="Screenshot showing the prompt flow sample.":::


## Next steps

[Use Azure Machine Learning pipelines with no code to construct RAG pipelines (preview)](how-to-use-pipelines-prompt-flow.md)

[How to create vector index in Azure Machine Learning prompt flow (preview).](how-to-create-vector-index.md)

[Use Vector Stores](concept-vector-stores.md) with Azure Machine Learning (preview)
