---
title: Chat completion configuration
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

Chat completion is an AI capability that enables models to generate conversational responses based on a series of messages. Unlike simple text completion, chat completion maintains context across multiple exchanges, simulating a natural conversation. With chat completion configuration, you can define and manage how AI models respond within your application. A typical configuration includes model selection, system and user prompts, and model-specific settings such as temperature or token limits.

## Prerequisites
- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free)
- An App Configuration store. [Create a store](./quickstart-azure-app-configuration-create.md#create-an-app-configuration-store).

> [!NOTE]
> This tutorial demonstrates how to use chat completion configuration with an Azure OpenAI model. However, the chat completion configuration demonstrated in the tutorial can be applied to any AI model you choose to work with in your application.
>

## Create a chat completion configuration

In this section, you will create a chat completion configuration in Azure Portal using the GPT-4o model as an example.

 1. In Azure portal, navigate to your App configuration store. From the **Operations** menu, select **Configuration explorer** > **Create**. Then select **AI configuration**.

 1. Specify the following values:
    - **Key**: Type **ChatLLM:Model**.
    - **Label**: Leave this value blank.
    - **Model**: Select **gpt-4o**.
    
    > [!div class="mx-imgBorder"]
    > ![Screen shot shows the create new AI configuration form](./media/create-ai-chat-completion-config.png)
    
1. Leave the rest of the values as default then select **Apply**.

## Create and deploy an Azure OpenAI service resource

1. Follow the [Get started with Azure OpenAI Service](/azure/ai-services/openai/overview#get-started-with-azure-openai-service) to create and deploy an Azure OpenAI service resource with following settings:

    | Field           | value   |
    |-----------------|---------|
    | Select a model  | gpt-4o  |
    | Deployment name | gpt-4o  |

1. In your Azure OpenAI resource, from the **Resource Management** menu, select **Keys and Endpoint** section and copy your Azure OpenAI resource endpoint. It should follow the format: `https://<open-ai-resource-name>.openai.azure.com`.

1. Select **Operations** > **Configuration explorer** > **Create** > **Key-Value**

1. Navigate to your App Configuration store and add the following key-value. Leave **Label** and **Content Type** with their default values. For more information about how to add key-values to a store using the Azure portal or the CLI, go to [Create a key-value](./quickstart-azure-app-configuration-create.md#create-a-key-value).

    | **Key**             | **Value**                                                   |
    |---------------------|-------------------------------------------------------------|
    | _ChatLLM:Endpoint_  | _Paste the model endpoint you copied in the previous step_  |
    
> [!TIP]
> To store your model API key securely, consider storing it as a Key Vault reference.  
> - In your Azure OpenAI resource, go to the **Keys and Endpoint** section and copy your API key.
> - In your App Configuration store, add a new Key Vault reference with the **Key** set to `ChatLLM:ApiKey` and the **Value** set as a Key Vault reference.
> - For step-by-step guidance, see [Add a Key Vault reference to App Configuration](./use-key-vault-references-dotnet-core.md#add-a-key-vault-reference-to-app-configuration).

1. Continue to the following instructions to implement the chat completion configuration into your application for the language or platform you are using.

    - [.NET](./quickstart-chat-completion-dotnet.md)

## Next steps

> [!div class="nextstepaction"]
> [AI configuration](./concept-ai-configuration.md)