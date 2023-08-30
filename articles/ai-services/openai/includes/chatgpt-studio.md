---
title: 'Quickstart: Use GPT-35-Turbo via the Azure OpenAI Studio'
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
- An Azure OpenAI Service resource with either the `gpt-35-turbo` or the `gpt-4`<sup>1</sup> models deployed. For more information about model deployment, see the [resource deployment guide](../how-to/create-resource.md).

<sup>1</sup> **GPT-4 models are currently only available by request.** To access these models, existing Azure OpenAI customers can [apply for access by filling out this form](https://aka.ms/oai/get-gpt4).

> [!div class="nextstepaction"]
> [I ran into an issue with the prerequisites.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=STUDIO&Pillar=AOAI&Product=Chatgpt&Page=quickstart&Section=Prerequisites)

## Go to Azure OpenAI Studio

Navigate to Azure OpenAI Studio at [https://oai.azure.com/](https://oai.azure.com/) and sign-in with credentials that have access to your OpenAI resource. During or after the sign-in workflow, select the appropriate directory, Azure subscription, and Azure OpenAI resource.

From the Azure OpenAI Studio landing page, select **Chat playground**.

:::image type="content" source="../media/quickstarts/chatgpt-playground.png" alt-text="Screenshot of the Azure OpenAI Studio landing page with Chat playground highlighted." lightbox="../media/quickstarts/chatgpt-playground.png":::

## Playground

Start exploring OpenAI capabilities with a no-code approach through the Azure OpenAI Studio Chat playground. From this page, you can quickly iterate and experiment with the capabilities.

:::image type="content" source="../media/quickstarts/chatgpt-playground-load.png" alt-text="Screenshot of the Chat playground page." lightbox="../media/quickstarts/chatgpt-playground-load.png":::

### Assistant setup

You can use the **Assistant setup** dropdown to select a few pre-loaded **System message** examples to get started.

**System messages** give the model instructions about how it should behave and any context it should reference when generating a response. You can describe the assistant's personality, tell it what it should and shouldn't answer, and tell it how to format responses.

**Add few-shot examples** allows you to provide conversational examples that are used by the model for [in-context learning](../concepts/prompt-engineering.md#basics).

At any time while using the Chat playground you can select **View code** to see Python, curl, and json code samples pre-populated based on your current chat session and settings selections. You can then take this code and write an application to complete the same task you're currently performing with the playground.

### Chat session

Selecting the **Send** button sends the entered text to the completions API and the results are returned back to the text box.

Select the **Clear chat** button to delete the current conversation history.

### Settings

| **Name**            | **Description**   |
|:--------------------|:-------------------------------------------------------------------------------|
| Deployments         | Your deployment name that is associated with a specific model. |
| Temperature         | Controls randomness. Lowering the temperature means that the model produces more repetitive and deterministic responses. Increasing the temperature results in more unexpected or creative responses. Try adjusting temperature or Top P but not both. |
| Max length (tokens) | Set a limit on the number of tokens per model response. The API supports a maximum of 4096 tokens shared between the prompt (including system message, examples, message history, and user query) and the model's response. One token is roughly four characters for typical English text.|
| Top probabilities   | Similar to temperature, this controls randomness but uses a different method. Lowering Top P narrows the model’s token selection to likelier tokens. Increasing Top P lets the model choose from tokens with both high and low likelihood. Try adjusting temperature or Top P but not both.|
| Multi-turn conversations | Select the number of past messages to include in each new API request. This helps give the model context for new user queries. Setting this number to 10 results in five user queries and five system responses.|
| Stop sequences      | Stop sequence make the model end its response at a desired point. The model response ends before the specified sequence, so it won't contain the stop sequence text. For GPT-35-Turbo, using `<|im_end|>` ensures that the model response doesn't generate a follow-up user query. You can include as many as four stop sequences.|

### Show panels

By default there are three panels: assistant setup, chat session, and settings. **Show panels** allows you to add, remove, and rearrange the panels. If you ever close a panel and need to get it back, use **Show panels** to restore the lost panel.

## Start a chat session

1. From the assistant setup drop-down, select **Xbox customer support agent**
2. You'll be prompted asking if you want to update the system message, select **Continue**.
3. In the chat session pane, enter the following question: "I'm interested in buying a new Xbox", and select **Send**.
4. You'll receive a response similar to:

    :::image type="content" source="../media/quickstarts/xbox.png" alt-text="Screenshot of a first question and answer in playground." lightbox="../media/quickstarts/xbox.png":::

5. Enter a follow-up question like: "which models support 4K?"

    :::image type="content" source="../media/quickstarts/models.png" alt-text="Screenshot of follow-up question and answer in playground." lightbox="../media/quickstarts/models.png":::

6. Now that you have a basic conversation select **View code** from under **Assistant setup** and you'll have a replay of the code behind the entire conversation so far:

```python
#Note: The openai-python library support for Azure OpenAI is in preview.
import os
import openai
openai.api_type = "azure"
openai.api_base = "https://docs-test-001.openai.azure.com/"
openai.api_version = "2023-05-15"
openai.api_key = os.getenv("OPENAI_API_KEY")

response = openai.ChatCompletion.create(
  engine="gpt-35-turbo", # replace this value with the deployment name you chose when you deployed the associated model.
  messages = [{"role":"system","content":"You are an Xbox customer support agent whose primary goal is to help users with issues they are experiencing with their Xbox devices. You are friendly and concise. You only provide factual answers to queries, and do not provide answers that are not related to Xbox."},{"role":"user","content":"How much is a PS5?"},{"role":"assistant","content":"I apologize, but I do not have information about the prices of other gaming devices such as the PS5. My primary focus is to assist with issues regarding Xbox devices. Is there a specific issue you are having with your Xbox device that I may be able to help with?"},{"role":"user","content":"I am interested in buying an Xbox?"},{"role":"assistant","content":"Great! There are several Xbox models available in the market, including the Xbox Series X, Xbox Series S, and Xbox One. The Xbox Series X is the latest and most powerful console, while the Xbox Series S is a more affordable option that still offers great performance. The Xbox One is the previous generation console, but it still has a large library of games available to play.\n\nBefore purchasing an Xbox, you may want to consider factors such as your budget, the types of games you want to play, and whether you want to play games in 4K resolution. Once you have decided on a console, you can purchase it from a retailer or directly from the Xbox website. Let me know if you have any other questions or concerns!"},{"role":"user","content":"Which models are 4K?"},{"role":"assistant","content":"Both the Xbox Series X and Xbox One X support 4K resolution gaming. The Xbox Series S, on the other hand, supports up to 1440p resolution gaming, but it can upscale games to 4K. It's worth noting that in order to take advantage of 4K gaming, you'll need a 4K TV or monitor that supports HDR (High Dynamic Range) and HDMI 2.0 or higher."}],
  temperature=0,
  max_tokens=350,
  top_p=0.95,
  frequency_penalty=0,
  presence_penalty=0,
  stop=None)
```

> [!div class="nextstepaction"]
> [I ran into an issue with the playground.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=STUDIO&Pillar=AOAI&Product=Chatgpt&Page=quickstart&Section=Set-up)

### Understanding the prompt structure

If you examine the sample from **View code** you'll notice some unique tokens that weren't part of a typical GPT completion call. GPT-35-Turbo was trained to use special tokens to delineate different parts of the prompt. Content is provided to the model in between `<|im_start|>` and `<|im_end|>` tokens. The prompt begins with a system message that can be used to prime the model by including context or instructions for the model. After that, the prompt contains a series of messages between the user and the assistant.

The assistant's response to the prompt will then be returned below the `<|im_start|>assistant` token and will end with `<|im_end|>` denoting that the assistant has finished its response. You can also use the **Show raw syntax** toggle button to display these tokens within the chat session panel.

The [GPT-35-Turbo & GPT-4 how-to guide](../how-to/chatgpt.md) provides an in-depth introduction into the new prompt structure and how to use the `gpt-35-turbo` model effectively.

[!INCLUDE [deploy-web-app](deploy-web-app.md)]

## Clean up resources

Once you're done testing out the Chat playground, if you want to clean up and remove an OpenAI resource, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

- [Portal](../../multi-service-resource.md?pivots=azportal#clean-up-resources)
- [Azure CLI](../../multi-service-resource.md?pivots=azcli#clean-up-resources)

## Next steps

* Learn more about how to work with the new `gpt-35-turbo` model with the [GPT-35-Turbo & GPT-4 how-to guide](../how-to/chatgpt.md).
* For more examples check out the [Azure OpenAI Samples GitHub repository](https://aka.ms/AOAICodeSamples)
