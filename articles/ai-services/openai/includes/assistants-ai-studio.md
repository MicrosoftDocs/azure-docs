---
title: Quickstart - getting started with Azure OpenAI assistants (preview) in AI Studio
titleSuffix: Azure OpenAI
description: Walkthrough on how to get started with Azure OpenAI assistants with new features like code interpreter in AI Studio (Preview).
manager: nitinme
ms.service: azure-ai-studio
ms.custom:
  - build-2024
ms.topic: include
ms.date: 03/04/2024
ms.author: mbullwin
author: mrbullwinkle
---

[!INCLUDE [Feature preview](~/reusable-content/ce-skilling/azure/includes/ai-studio/includes/feature-preview.md)]

## Prerequisites

- An Azure subscription - <a href="https://azure.microsoft.com/free/cognitive-services" target="_blank">Create one for free</a>.
- An [Azure AI hub resource](../../../ai-studio/how-to/create-azure-ai-resource.md) with a model deployed. For more information about model deployment, see the [resource deployment guide](../how-to/create-resource.md).
- An [Azure AI project](../../../ai-studio/how-to/create-projects.md) in Azure AI Studio.

## Go to the Azure AI Studio (Preview)

1. Sign in to [Azure AI Studio](https://ai.azure.com).
1. Go to your project or [create a new project](../../../ai-studio//how-to/create-projects.md) in Azure AI Studio.
1. From your project overview, select **Assistants**, located under **Project playground**.

    The Assistants playground allows you to explore, prototype, and test AI Assistants without needing to run any code. From this page, you can quickly iterate and experiment with new ideas.
    
    The playground provides several options to configure your Assistant. In the following steps, you will use the **Assistant setup** pane to create a new AI assistant.
    
    | **Name** | **Description** |
    |:---|:---|
    | **Assistant name** | Your deployment name that is associated with a specific model. |
    | **Instructions** | Instructions are similar to system messages this is where you give the model guidance about how it should behave and any context it should reference when generating a response. You can describe the assistant's personality, tell it what it should and shouldn't answer, and tell it how to format responses. You can also provide examples of the steps it should take when answering responses. |
    | **Deployment** | This is where you set which model deployment to use with your assistant. |
    | **Functions**| Create custom function definitions for the models to formulate API calls and structure data outputs based on your specifications. Not used in this quickstart. |
    | **Code interpreter** | Code interpreter provides access to a sandboxed Python environment that can be used to allow the model to test and execute code. |
    | **Files** | You can upload up to 10,000 files, with a max file size of 512 MB to use with tools. Not used in this quickstart. |
    
    :::image type="content" source="../media/quickstarts/assistants-ai-studio-playground.png" alt-text="Screenshot of the Assistant configuration screen without all the values filled in." lightbox="../media/quickstarts/assistants-ai-studio-playground.png":::

## Create your first Assistant

1. Select your deployment from the **Deployments** dropdown.
1. From the Assistant setup drop-down, select **New**.
1. Give your Assistant a name.
1. Enter the following instructions "You are an AI assistant that can write code to help answer math questions"
1. Select a model deployment. We recommend testing with one of the latest gpt-4 models.
1. Select the toggle enabling code interpreter.
1. Select Save.

    :::image type="content" source="../media/quickstarts/assistant-configuration.png" alt-text="Screenshot of the assistant with configuration details entered." lightbox="../media/quickstarts/assistant-configuration.png":::

7. Enter a question for the assistant to answer: "I need to solve the equation `3x + 11 = 14`. Can you help me?"
8. Select the **Add and run button** :::image type="icon" source="../media/quickstarts/run.png":::

    ```output
    The solution to the equation (3x + 11 = 14) is (x = 1).
    ```

    While we can see that answer is correct, to confirm that the model used code interpreter to get to this answer, and that the code it wrote is valid rather than just repeating an answer from the model's training data we'll ask another question.

9. Enter the follow-up question: "Show me the code you ran to get this solution."

    ```output
   Sure. The code is very straightforward
    ```

    ```python
    # calculation
    x = (14 - 11) / 3
    x

    ```

    ```output
    First, we subtract 11 from 14, then divide the result by 3. This gives us the value of x which is 1.0.
    ````

    :::image type="content" source="../media/quickstarts/assistant-ai-studio-session.png" alt-text="Screenshot of conversation session in the Assistant playground." lightbox="../media/quickstarts/assistant-ai-studio-session.png":::

You could also consult the logs in the right-hand panel to confirm that code interpreter was used and to validate the code that was run to generate the response. It is important to remember that while code interpreter gives the model the capability to respond to more complex math questions by converting the questions into code and running in a sandboxed Python environment, you still need to validate the response to confirm that the model correctly translated your question into a valid representation in code.

## Key concepts

While using the Assistants playground, keep the following concepts in mind. 

### Tools

An individual assistant can access up to 128 tools including `code interpreter`, as well as any custom tools you create via [functions](../how-to/assistant-functions.md).

### Chat session

Chat session also known as a *thread* within the Assistant's API is where the conversation between the user and assistant occurs. Unlike traditional chat completion calls there is no limit to the number of messages in a thread. The assistant will automatically compress requests to fit the input token limit of the model.

This also means that you are not controlling how many tokens are passed to the model during each turn of the conversation. Managing tokens is abstracted away and handled entirely by the Assistants API.

Select the **Clear chat** button to delete the current conversation history.

Underneath the text input box there are two buttons:

- Add a message without run.
- Add and run.

### Logs

Logs provide a detailed snapshot of what the assistant API activity.

### Show panels

By default there are three panels: assistant setup, chat session, and Logs. **Show panels** allows you to add, remove, and rearrange the panels. If you ever close a panel and need to get it back, use **Show panels** to restore the lost panel.

## Clean up resources

If you want to clean up and remove an Azure OpenAI resource, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

- [Azure portal](../../multi-service-resource.md?pivots=azportal#clean-up-resources)
- [Azure CLI](../../multi-service-resource.md?pivots=azcli#clean-up-resources)

Alternatively you can delete the [assistant](../assistants-reference.md#delete-assistant), or [thread](../assistants-reference-threads.md#delete-thread) via the [Assistant's API](../assistants-reference.md).

## See also

* Learn more about how to use Assistants with our [How-to guide on Assistants](../how-to/assistant.md).
* [Azure OpenAI Assistants API samples](https://github.com/Azure-Samples/azureai-samples/tree/main/scenarios/Assistants)
