---
title: 'Use the Azure Developer CLI to deploy resources for Azure OpenAI On Your Data'
titleSuffix: Azure OpenAI
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

Use this article to learn how to automate resource deployment for Azure OpenAI On Your Data. The Azure Developer CLI (`azd`) is an open-source, command-line tool that streamlines provisioning and deploying resources to Azure using a template system. The template contains infrastructure files to provision the necessary Azure OpenAI resources and configurations and includes the completed sample app code.

## Prerequisites

- An Azure subscription - <a href="https://azure.microsoft.com/free/cognitive-services" target="_blank">Create one for free</a>.
- Access granted to Azure OpenAI in the desired Azure subscription.

  Azure OpenAI requires registration and is currently only available to approved enterprise customers and partners. [See Limited access to Azure OpenAI Service](/legal/cognitive-services/openai/limited-access?context=/azure/ai-services/openai/context/context) for more information. You can apply for access to Azure OpenAI by completing the form at <a href="https://aka.ms/oai/access" target="_blank">https://aka.ms/oai/access</a>. Open an issue on this repo to contact us if you have an issue.

- The Azure Developer CLI [installed](/azure/developer/azure-developer-cli/install-azd) on your machine

## Clone and initialize the Azure Developer CLI template



1. For the steps ahead, clone and initialize the template.

    ```bash
    azd init --template openai-chat-your-own-data
    ```
    
2. The `azd init` command prompts you for the following information:

    * Environment name: This value is used as a prefix for all Azure resources created by Azure Developer CLI. The name must be unique across all Azure subscriptions and must be between 3 and 24 characters long. The name can contain numbers and lowercase letters only.

## Use the template to deploy resources

1. Sign-in to Azure:

    ```bash
    azd auth login
    ```

1. Provision and deploy the OpenAI resource to Azure:

    ```bash
    azd up
    ```
    
    `azd` prompts you for the following information:
    
    * Subscription: The Azure subscription that your resources are deployed to.
    * Location: The Azure region where your resources are deployed.
    
    > [!NOTE]
    > The sample `azd` template uses the `gpt-35-turbo-16k` model. A recommended region for this template is East US, since different Azure regions support different OpenAI models. You can visit the [Azure OpenAI Service Models](/azure/ai-services/openai/concepts/models) support page for more details about model support by region.
    
    > [!NOTE]
    > The provisioning process may take several minutes to complete. Wait for the task to finish before you proceed to the next steps.
        
1. Click the link `azd` outputs to navigate to the new resource group in the Azure portal. You should see the following top level resources:
    
    * An Azure OpenAI service with a deployed model
    * An Azure Storage account you can use to upload your own data files
    * An Azure AI Search service configured with the proper indexes and data sources

## Upload data to the storage account

`azd` provisioned all of the required resources for you to chat with your own data, but you still need to upload the data files you want to make available to your AI service.

1. Navigate to the new storage account in the Azure portal.
1. On the left navigation, select **Storage browser**.
1. Select **Blob containers** and then navigate into the **File uploads** container.
1. Click the **Upload** button at the top of the screen. 
1. In the flyout menu that opens, upload your data.
 
> [!NOTE]
> The search indexer is set to run every 5 minutes to index the data in the storage account. You can either wait a few minutes for the uploaded data to be indexed, or you can manually run the indexer from the search service page.

## Connect or create an application

After running the `azd` template and uploading your data, you're ready to start using Azure OpenAI on Your Data. See the [quickstart article](../use-your-data-quickstart.md) for code samples you can use to build your applications.