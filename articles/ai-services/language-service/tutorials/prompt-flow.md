---
title: Use Language in Azure prompt flow
description: Learn how to use Azure AI Language in prompt flow.
author: jboback
ms.author: jboback
ms.service: azure-ai-language
ms.topic: how-to
ms.date: 07/09/2024
---

# Use Language in Azure prompt flow

> [!IMPORTANT]
> Some of the features described in this article might only be available in preview. This preview is provided without a service-level agreement, and we don't recommend it for production workloads. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

[Prompt flow in Azure AI Studio](../../../ai-studio/how-to/prompt-flow.md) is a development tool designed to streamline the entire development cycle of AI applications powered by Large Language Models (LLMs). You can explore and quickly start to use and fine-tune various natural language processing capabilities from Azure AI Language, reducing your time to value and deploying solutions with reliable evaluation.

This tutorial teaches you how to use Language in prompt flow utilizing [Azure AI Studio](https://ai.azure.com).                            

## Prerequisites

- An Azure subscription - <a href="https://azure.microsoft.com/free/cognitive-services" target="_blank">Create one for free</a>.

- You need an Azure AI Studio hub or permissions to create one. Your user role must be **Azure AI Developer**, **Contributor**, or **Owner** on the hub. For more information, see [hubs](../../../ai-studio/concepts/ai-resources.md) and [Azure AI roles](../../../ai-studio/concepts/rbac-ai-studio.md).
     - If your role is **Contributor** or **Owner**, you can [create a hub in this tutorial](#create-a-project-in-azure-ai-studio). 
     - If your role is **Azure AI Developer**, the hub must already be created. 

- Your subscription needs to be below your [quota limit](../../../ai-studio/how-to/quota.md) to deploy a new flow in this tutorial.

## Create a project in Azure AI Studio

Your project is used to organize your work and save state. 

[!INCLUDE [Create project](../../../ai-studio/includes/create-projects.md)]

## Using Azure AI Language via the prompt flow gallery

You can create an Azure AI Language flow by either cloning the samples available in the gallery or creating a flow from scratch. If you already have flow files in local or file share, you can also import the files to create a flow. For the purposes of this tutorial we'll be using the prebuilt **Analyze Conversations** flow.

To create a prompt flow from the gallery in Azure AI Studio:

1. Sign in to Azure AI Studio and select your project.

1. From the collapsible left menu, select Prompt flow.

1. Select + Create.

1. Find the **Analyze Conversations** tile in the gallery and select *Clone*.

1. In the right sidebar, name the folder and click the **Clone** button.

1. After the process is complete, you'll be taken to the prompt flow wizard. Click **Start Compute Session** in the upper right hand corner to begin. The various parts of the wizard are out lined below:

    :::image type="content" source="../media/prompt-flow/prompt-flow-wizard.png" alt-text="Screenshot of the prompt flow wizard page with each part of the tool numbered." lightbox="../media/prompt-flow/prompt-flow-wizard.png":::

    1. A graph view of your flow.
    1. Files in your flow. Click the arrow to expand this section.
    1. Azure AI Language tools in the "More tools" dropdown menu, which you can add capabilities that you need for your flow. There are more tools that you can add from LLM, Prompt, and Python menu. This menu is only accessible after the compute session has started.
    1. Configure your output.
    1. Configure steps (or tools) in the flow.
    1. Run, evaluate, and deploy your flow.

1. Once you've configured everything to your liking, press the run button in the upper right hand corner.

## Related content

* [Azure AI Language homepage](https://aka.ms/azure-language)
* [Azure AI Language product demo videos](https://aka.ms/language-videos)
* [Explore Azure AI Language in Azure AI Studio](https://aka.ms/AzureAiLanguage)