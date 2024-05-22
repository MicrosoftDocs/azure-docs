---
title: How to get started with Azure AI SDKs
titleSuffix: Azure AI Studio
description: This article provides instructions on how to get started with Azure AI SDKs.
manager: nitinme
ms.service: azure-ai-studio
ms.custom:
  - build-2024
ms.topic: overview
ms.date: 5/21/2024
ms.reviewer: eur
ms.author: eur
author: eric-urban
---

# Overview of the Azure AI SDKs

[!INCLUDE [Feature preview](../../includes/feature-preview.md)]

Microsoft offers a variety of packages that you can use for building generative AI applications in the cloud. In most applications, you need to use a combination of packages to manage and use various Azure services that provide AI functionality. We also offer integrations with open-source libraries like LangChain and mlflow for use with Azure. In this article we'll give an overview of the main services and SDKs you can use with Azure AI Studio.

For building generative AI applications, we recommend using the following services and SDKs:
 * [Azure Machine Learning](../../../machine-learning/overview-what-is-azure-machine-learning.md) for the hub and project infrastructure used in AI Studio to organize your work into projects, manage project artifacts (data, evaluation runs, traces), fine-tune & deploy models, and connect to external services and resources
 * [Azure AI Services](../../../ai-services/what-are-ai-services.md) provides pre-built and customizable intelligent APIs and models, with support for Azure OpenAI, Search, Speech, Vision, and Language
 * [Prompt flow](https://microsoft.github.io/promptflow/index.html) for developer tools to streamline the end-to-end development cycle of LLM-based AI application, with support for inferencing, indexing, evaluation, deployment, and monitoring.

For each of these, there are separate sets of management libraries and client libraries.

## Management libraries for creating and managing cloud resources

Azure [Management libraries](/azure/developer/python/sdk/azure-sdk-overview#create-and-manage-azure-resources-with-management-libraries) (also "control plane" or "management plane"), for creating and managing cloud resources that are used by your application.

Azure Machine Learning
 * [Azure Machine Learning Python SDK (v2)](/python/api/overview/azure/ai-ml-readme)
 * [Azure Machine Learning CLI (v2)](/azure/machine-learning/how-to-configure-cli?view=azureml-api-2&tabs=public)
 * [Azure Machine Learning REST API](/rest/api/azureml) 

Azure AI Services
 * [Azure AI Services Python Management Library](/python/api/overview/azure/mgmt-cognitiveservices-readme?view=azure-python)
 * [Azure AI Search Python Management Library](/python/api/azure-mgmt-search/azure.mgmt.search?view=azure-python)
 * [Azure CLI commands for Azure AI Search](/azure/search/search-manage-azure-cli)
 * [Azure CLI commands for Azure AI Services](/cli/azure/cognitiveservices?view=azure-cli-latest)

Prompt flow
 * [pfazure CLI](https://microsoft.github.io/promptflow/reference/pfazure-command-reference.html)
 * [pfazure Python library](https://microsoft.github.io/promptflow/reference/python-library-reference/promptflow-azure/promptflow.azure.html)

## Client libraries used in runtime application code

Azure [Client libraries](/azure/developer/python/sdk/azure-sdk-overview#connect-to-and-use-azure-resources-with-client-libraries) (also called "data plane") for connecting to and using provisioned services from runtime application code.

Azure AI Services
 * [Azure AI services SDKs](../../../ai-services/reference/sdk-package-resources.md?context=/azure/ai-studio/context/context)
 * [Azure AI services REST APIs](../../../ai-services/reference/rest-api-resources.md?context=/azure/ai-studio/context/context) 

Prompt flow
 * [Prompt flow SDK](https://microsoft.github.io/promptflow/how-to-guides/quick-start.html)

## Related content

- [Get started building a chat app using the prompt flow SDK](../../quickstarts/get-started-code.md)
- [Work with projects in VS Code](vscode.md)
