---
title: 'Use the Azure Developer CLI to deploy resources for Azure OpenAI On Your Data'
titleSuffix: Azure OpenAI Service
description: Use this article to learn how to automate resource deployment for Azure OpenAI On Your Data.
manager: nitinme
ms.service: azure-ai-openai
ms.topic: quickstart
author: aahill
ms.author: aahi
ms.date: 04/09/2024
recommendations: false
---

# Use the Azure Developer CLI to deploy resources for Azure OpenAI On Your Data 

Use this article to learn how to automate resource deployment for Azure OpenAI Service On Your Data. The Azure Developer CLI (`azd`) is an open-source command-line tool that streamlines provisioning and deploying resources to Azure by using a template system. The template contains infrastructure files to provision the necessary Azure OpenAI resources and configurations. It also includes the completed sample app code.

## Prerequisites

- An Azure subscription. [Create one for free](https://azure.microsoft.com/free/cognitive-services).
- The Azure Developer CLI [installed](/azure/developer/azure-developer-cli/install-azd) on your machine.

## Clone and initialize the Azure Developer CLI template

1. For the steps ahead, clone and initialize the template:

    ```bash
    azd init --template openai-chat-your-own-data
    ```

2. The `azd init` command prompts you to create an environment name. This value is used as a prefix for all Azure resources that Azure Developer CLI creates. The name:

   - Must be unique across all Azure subscriptions.
   - Must be 3 to 24 characters.
   - Can contain numbers and lowercase letters only.

## Use the template to deploy resources

1. Sign in to Azure:

    ```bash
    azd auth login
    ```

1. Provision and deploy the Azure OpenAI resource to Azure:

    ```bash
    azd up
    ```

1. The Azure Developer CLI prompts you for the following information:

    - `Subscription`: The Azure subscription that your resources are deployed to.
    - `Location`: The Azure region where your resources are deployed.

    > [!NOTE]
    > The sample `azd` template uses the `gpt-35-turbo-16k` model. A recommended region for this template is East US, because different Azure regions support different OpenAI models. For more details about model support by region, go to the [Azure OpenAI Service Models](/azure/ai-services/openai/concepts/models) support page.

    The provisioning process might take several minutes. Wait for the task to finish before you proceed to the next steps.

1. Select the link in the `azd` outputs to go to the new resource group in the Azure portal. The following top-level resources should appear:

    - An Azure OpenAI service with a deployed model
    - An Azure Storage account that you can use to upload your own data files
    - An Azure AI Search service configured with the proper indexes and data sources

## Upload data to the storage account

The `azd` template provisioned all of the required resources for you to chat with your own data, but you still need to upload the data files that you want to make available to your AI service:

1. Go to the new storage account in the Azure portal.
1. On the left menu, select **Storage browser**.
1. Select **Blob containers**, and then go to the **File uploads** container.
1. Select the **Upload** button at the top of the pane.
1. In the flyout menu that opens, upload your data.

> [!NOTE]
> The search indexer is set to run every five minutes to index the data in the storage account. You can wait a few minutes for the uploaded data to be indexed, or you can manually run the indexer from the search service page.

## Connect or create an application

After you run the `azd` template and upload your data, you're ready to start using Azure OpenAI On Your Data. For code samples that you can use to build your applications, see the [quickstart article](../use-your-data-quickstart.md).
