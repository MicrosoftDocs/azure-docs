---
title: Prompt tool for flows in Azure AI Studio
titleSuffix: Azure AI services
description: This article introduces the Prompt tool for flows in Azure AI Studio.
author: eric-urban
manager: nitinme
ms.service: azure-ai-services
ms.topic: conceptual
ms.date: 10/1/2023
ms.author: eur
---

# Prompt tool for flows in Azure AI Studio

[!INCLUDE [Azure AI Studio preview](../../includes/preview-ai-studio.md)]

The prompt flow *Prompt* tool offers a collection of textual templates that serve as a starting point for creating prompts. These templates, based on the [Jinja](https://jinja.palletsprojects.com/en/3.1.x/) template engine, facilitate the definition of prompts. The tool proves useful when prompt tuning is required prior to feeding the prompts into the large language model (LLM) in prompt flow.

## Prerequisites

Prepare a prompt. The [LLM tool](llm-tool.md) and Prompt tool both support [Jinja](https://jinja.palletsprojects.com/en/3.1.x/) templates. 

In this example, the prompt incorporates Jinja templating syntax to dynamically generate the welcome message and personalize it based on the user's name. It also presents a menu of options for the user to choose from. Depending on whether the user_name variable is provided, it either addresses the user by name or uses a generic greeting.
    
```jinja
Welcome to {{ website_name }}!
{% if user_name %}
    Hello, {{ user_name }}!
{% else %}
    Hello there!
{% endif %}
Please select an option from the menu below:
1. View your account
2. Update personal information
3. Browse available products
4. Contact customer support
```

For more information and best practices, see [prompt engineering techniques](../../../ai-services/openai/concepts/advanced-prompt-engineering.md).

## Build with the Prompt tool

1. Create or open a flow in Azure AI Studio. For more information, see [Create a flow](../flow-develop.md).
1. Select **+ Prompt** to add the Prompt tool to your flow.

    :::image type="content" source="../../media/prompt-flow/prompt-tool.png" alt-text="Screenshot of the Prompt tool added to a flow in Azure AI Studio." lightbox="../../media/prompt-flow/prompt-tool.png":::

1. Enter values for the Prompt tool input parameters described [here](#inputs). For information about how to prepare the prompt input, see [prerequisites](#prerequisites).
1. Add more tools (such as the [LLM tool](llm-tool.md)) to your flow as needed, or select **Run** to run the flow.
1. The outputs are described [here](#outputs).


## Inputs

The following are available input parameters:

| Name               | Type   | Description                                              | Required |
|--------------------|--------|----------------------------------------------------------|----------|
| prompt             | string | The prompt template in Jinja                            | Yes      |
| Inputs             | -      | List of variables of prompt template and its assignments | -        |

## Outputs

### Example 1

Inputs

| Variable      | Type   | Sample Value | 
|---------------|--------|--------------|
| website_name  | string | "Microsoft"  |
| user_name     | string | "Jane"       |

Outputs

```
Welcome to Microsoft! Hello, Jane! Please select an option from the menu below: 1. View your account 2. Update personal information 3. Browse available products 4. Contact customer support
```

### Example 2

Inputs

| Variable     | Type   | Sample Value   | 
|--------------|--------|----------------|
| website_name | string | "Bing"         |
| user_name    | string | "              |

Outputs

```
Welcome to Bing! Hello there! Please select an option from the menu below: 1. View your account 2. Update personal information 3. Browse available products 4. Contact customer support
```

## Next steps

- [Learn more about how to create a flow](../flow-develop.md)

