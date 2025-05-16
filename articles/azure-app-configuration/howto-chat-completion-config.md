---
title: Getting started with chat completion configuration
titleSuffix: Azure App Configuration
description: Learn how to create chat completion configuration in Azure App Configuration.
ms.service: azure-app-configuration
author: mgichohi
ms.author: mgichohi
ms.topic: how-to
ms.date: 04/20/2025
ms.collection: ce-skilling-ai-copilot
---

# Chat Completion configuration in Azure App Configuration

Chat completion is an AI capability that enables models to generate conversational responses based on a series of messages. Unlike simple text completion, chat completion maintains context across multiple exchanges, simulating a natural conversation. Chat completion configuration allows you to define and manage how AI models generate responses in your application. A simple configuration includes the model selection and basic prompts. Azure OpenAI chat models support several [configuration options](/azure/ai-services/openai/reference#request-body-2) that control how responses are generated.

## Prerequisites
- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free)
- An App Configuration store. [Create a store](./quickstart-azure-app-configuration-create.md#create-an-app-configuration-store).
- [Azure OpenAI access](/azure/ai-services/openai/overview#get-started-with-azure-openai-service)

> [!NOTE]
> This tutorial demonstrates chat completion configuration management using Azure OpenAI models. However the configuration management demonstrated in the tutorial can be applied to any AI model you choose to work with in your application.
>

## Create a chat completion configuration

In this section, we will create a chat completion configuration in Azure Portal using the GPT-4o model as our example.

 1. In Azure portal, navigate to your App configuration store. From the **Operations** menu, select **Configuration explorer** > **Create**. Then select **AI configuration**.

 1. Specify the following values:
    - **Key**: Type **ChatLLM:Model**.
    - **Label**: Leave this value blank.
    - **Model**: Select **gpt-4o**.
    
    > [!div class="mx-imgBorder"]
    > ![Screen shot shows the create new AI configuration form](./media/create-ai-chat-completion-config.png)
    
1. Leave the rest of the values as default then select **Apply**.

## Create and deploy an Azure OpenAI service resource

1. [Create and deploy an Azure OpenAI service resource](/azure/ai-services/openai/how-to/create-resource) and configure the following fields:

    | Field           | value   |
    |-----------------|---------|
    | Select a model  | gpt-4o  |
    | Deployment name | gpt-4o  |

1. Select the new model you just deployed in the deployment table, locate the **Endpoint** section and copy the model endpoint url in the format `"https://<open-ai-resource-name>.openai.azure.com"`.

1. Select **Operations** > **Configuration explorer** > **Create** > **Key-Value**

1. Specify the following values:
    - **Key**: Type **ChatLLM:Endpoint**.
    - **Label**: Leave this value blank.
    - **Value**: Paste the model endpoint we copied in the previous step.
    
    Leave the **Label** and the **Content type** with their default values then select **Apply**.

1. Continue to the following instructions to implement the chat completion configuration into your application for the language or platform you are using.

    - [.NET](./quickstart-chat-completion-dotnet.md)

## Next steps

> [!div class="nextstepaction"]
> [AI configuration](./concept-ai-configuration.md)