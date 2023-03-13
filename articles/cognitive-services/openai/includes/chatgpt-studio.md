---
title: 'Quickstart: Use ChatGPT (Preview) via the Azure OpenAI Studio'
titleSuffix: Azure OpenAI Service
description: Walkthrough on how to get started with Azure OpenAI and make your first completions call with Azure OpenAI Studio. 
services: cognitive-services
manager: nitinme
ms.service: cognitive-services
ms.subservice: openai
ms.topic: include
ms.date: 03/01/2023
keywords: 
---

## Prerequisites

- An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services?azure-portal=true).
- Access granted to Azure OpenAI in the desired Azure subscription.

    Currently, access to this service is granted only by application. You can apply for access to Azure OpenAI by completing the form at [https://aka.ms/oai/access](https://aka.ms/oai/access?azure-portal=true). Open an issue on this repo to contact us if you have an issue.
- An Azure OpenAI Service resource with the `gpt-35-turbo` model deployed. This model is currently available in East US and South Central US. For more information about model deployment, see the [resource deployment guide](../how-to/create-resource.md).

## Go to Azure OpenAI Studio

Navigate to Azure OpenAI Studio at [https://oai.azure.com/](https://oai.azure.com/) and sign-in with credentials that have access to your OpenAI resource. During or after the sign-in workflow, select the appropriate directory, Azure subscription, and Azure OpenAI resource.

From the Azure OpenAI Studio landing page, select **ChatGPT playground (Preview)**

:::image type="content" source="../media/quickstarts/chatgpt-playground.png" alt-text="Screenshot of the Azure OpenAI Studio landing page with ChatGPT playground highlighted." lightbox="../media/quickstarts/chatgpt-playground.png":::

## Playground

Start exploring OpenAI capabilities with a no-code approach through the Azure OpenAI Studio ChatGPT playground. From this page, you can quickly iterate and experiment with the capabilities.

:::image type="content" source="../media/quickstarts/chatgpt-playground-load.png" alt-text="Screenshot of the ChatGPT playground page." lightbox="../media/quickstarts/chatgpt-playground-load.png":::

### Assistant setup

You can use the **Assistant setup** dropdown to select a few pre-loaded **System message** examples to get started.

**System messages** give the model instructions about how it should behave and any context it should reference when generating a response. You can describe the assistant's personality, tell it what it should and shouldn't answer, and tell it how to format responses.

**Add few-shot examples** allows you to provide conversational examples that are used by the model for [in-context learning](/azure/cognitive-services/openai/overview#in-context-learning).

At any time while using the ChatGPT playground you can select **View code** to see Python, curl, and json code samples pre-populated based on your current chat session and settings selections. You can then take this code and write an application to complete the same task you're currently performing with the playground.

### Chat session

Selecting the **Send** button sends the entered text to the completions API and the results are returned back to the text box.

Select the **Clear chat** button to delete the current conversation history.

### Settings

| **Name**            | **Description**   |
|:--------------------|:-------------------------------------------------------------------------------|
| Deployments         | Your deployment name that is associated with a specific model. For ChatGPT, you need to use the `gpt-35-turbo` model. |
| Temperature         | Controls randomness. Lowering the temperature means that the model produces more repetitive and deterministic responses. Increasing the temperature results in more unexpected or creative responses. Try adjusting temperature or Top P but not both. |
| Max length (tokens) | Set a limit on the number of tokens per model response. The API supports a maximum of 4096 tokens shared between the prompt (including system message, examples, message history, and user query) and the model's response. One token is roughly four characters for typical English text.|
| Top probabilities   | Similar to temperature, this controls randomness but uses a different method. Lowering Top P narrows the model’s token selection to likelier tokens. Increasing Top P lets the model choose from tokens with both high and low likelihood. Try adjusting temperature or Top P but not both.|
| Multi-turn conversations | Select the number of past messages to include in each new API request. This helps give the model context for new user queries. Setting this number to 10 results in five user queries and five system responses.|
| Stop sequences      | Stop sequence make the model end its response at a desired point. The model response ends before the specified sequence, so it won't contain the stop sequence text. For ChatGPT, using `<|im_end|>` ensures that the model response doesn't generate a follow-up user query. You can include as many as four stop sequences.|

### Show panels

By default there are three panels: assistant setup, chat session, and settings. **Show panels** allows you to add, remove, and rearrange the panels. If you ever close a panel and need to get it back, use **Show panels** to restore the lost panel.

## Start a chat session

1. From the assistant setup drop-down, select **Xbox customer support agent**
2. You'll be prompted asking if you want to update the system message, select **Continue**.
3. In the chat session pane, enter the following question: "I'm interested in buying a new Xbox", and select **Send**.
4. You'll receive a response similar to:

    :::image type="content" source="../media/quickstarts/xbox.png" alt-text="Screenshot of a first question and answer in playground." lightbox="../media/quickstarts/xbox.png":::

5. Enter a follow-up question like: "What models are available?"

    :::image type="content" source="../media/quickstarts/xbox.png" alt-text="Screenshot of follow-up question and answer in playground." lightbox="../media/quickstarts/xbox.png":::

6. Now that you have a basic conversation select **View code** from under **Assistant setup** and you'll have a replay of the code behind the entire conversation so far:

```python
#Note: The openai-python library support for Azure OpenAI is in preview.
import os
import openai
openai.api_type = "azure"
openai.api_base = "https://docs-test-001.openai.azure.com/"
openai.api_version = "2022-12-01"
openai.api_key = os.getenv("OPENAI_API_KEY")

response = openai.Completion.create(
  engine="gpt-35-turbo",
  prompt="<|im_start|>system\nYou are an Xbox customer support agent whose primary goal is to help users with issues they are experiencing with their Xbox devices. You are friendly and concise. You only provide factual answers to queries, and do not provide answers that are not related to Xbox.\n<|im_end|>\n<|im_start|>user\nI am interested in buying an Xbox?\n<|im_end|>\n<|im_start|>assistant\nGreat! Xbox is a popular gaming console that offers a wide variety of games and features. You can purchase an Xbox from various retailers such as Amazon, Best Buy, and the Microsoft Store. Additionally, you can also purchase an Xbox bundle that includes games and accessories. If you have any specific questions about the Xbox or the purchasing process, please let me know and I'll be happy to assist you.\n\n<|im_end|>\n<|im_start|>user\nWhat models are available?\n<|im_end|>\n<|im_start|>assistant\nCurrently, there are three Xbox models available for purchase: Xbox Series X, Xbox Series S, and Xbox One X. \n\nThe Xbox Series X is the most powerful Xbox console to date, with a custom-designed processor, 12 teraflops of processing power, and 16GB of memory. It also supports 4K gaming and has a built-in 4K Ultra HD Blu-ray player.\n\nThe Xbox Series S is a more affordable option, with a custom-\n<|im_end|>\n",
  temperature=0,
  max_tokens=100,
  top_p=0.95,
  frequency_penalty=0,
  presence_penalty=0,
  best_of=1,
  stop=["<|im_end|>"])
```

### Understanding the prompt structure

If you examine the sample from **View code** you'll notice some unique tokens that weren't part of a typical GPT completion call. ChatGPT was trained to use special tokens to delineate different parts of the prompt. Content is provided to the model in between `<|im_start|>` and `<|im_end|>` tokens. The prompt begins with a system message that can be used to prime the model by including context or instructions for the model. After that, the prompt contains a series of messages between the user and the assistant.

The assistant's response to the prompt will then be returned below the `<|im_start|>assistant` token and will end with `<|im_end|>` denoting that the assistant has finished its response. You can also use the **Show raw syntax** toggle button to display these tokens within the chat session panel.

The [ChatGPT how-to guide](../how-to/chatgpt.md) provides an in-depth introduction into the new prompt structure and how to use the `gpt-35-turbo` model effectively.

## Clean up resources

Once you're done testing out the ChatGPT playground, if you want to clean up and remove an OpenAI resource, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

- [Portal](../../cognitive-services-apis-create-account.md#clean-up-resources)
- [Azure CLI](../../cognitive-services-apis-create-account-cli.md#clean-up-resources)

## Next steps

* Learn more about how to work with ChatGPT and the new `gpt-35-turbo` model with the [ChatGPT how-to guide](../how-to/chatgpt.md).
* For more examples check out the [Azure OpenAI Samples GitHub repository](https://github.com/Azure/openai-samples)
