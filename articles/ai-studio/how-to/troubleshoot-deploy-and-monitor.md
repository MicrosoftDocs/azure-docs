---
title: How to troubleshoot your deployments and monitors in Azure AI Studio
titleSuffix: Azure AI Studio
description: This article provides instructions on how to troubleshoot your deployments and monitors in Azure AI Studio.
manager: scottpolly
ms.service: azure-ai-studio
ms.custom:
  - ignite-2023
  - build-2024
ms.topic: how-to
ms.date: 5/21/2024
ms.reviewer: fasantia
reviewer: santiagxf
ms.author: mopeakande
author: msakande
---

# How to troubleshoot your deployments and monitors in Azure AI Studio

[!INCLUDE [Feature preview](../includes/feature-preview.md)]

This article provides instructions on how to troubleshoot your deployments and monitors in Azure AI Studio. 

## Deployment issues

For the general deployment error code reference, see [Troubleshooting online endpoints deployment and scoring](/azure/machine-learning/how-to-troubleshoot-online-endpoints) in the Azure Machine Learning documentation. Much of the information there also apply to Azure AI Studio deployments.


### Error: Use of Azure OpenAI models in Azure Machine Learning requires Azure OpenAI Services resources

The full error message states: "Use of Azure OpenAI models in Azure Machine Learning requires Azure OpenAI Services resources. This subscription or region doesn't have access to this model."

This error means that you might not have access to the particular Azure OpenAI model. For example, your subscription might not have access to the latest GPT model yet or this model isn't offered in the region you want to deploy to. You can learn more about it on [Azure OpenAI Service models](../../ai-services/openai/concepts/models.md).

### Error: Out of quota

For more information about managing quota, see:

- [Quota for deploying and inferencing a model](../how-to/deploy-models-openai.md#quota-for-deploying-and-inferencing-a-model)
- [Manage Azure OpenAI Service quota documentation](/azure/ai-services/openai/how-to/quota?tabs=rest)
- [Manage and increase quotas for resources with Azure AI Studio](quota.md)

### Error: `ToolLoadError`

After you deployed a prompt flow, you got the error message: "Tool load failed in 'search_question_from_indexed_docs': (ToolLoadError) Failed to load package tool 'Vector Index Lookup': (HttpResponseError) (AuthorizationFailed)." 

To fix this error, take the following steps to manually assign the ML Data scientist role to your endpoint. It might take several minutes for the new role to take effect.

1. Go to your project in [Azure AI Studio](https://ai.azure.com) and select **Settings** from the left navigation menu to open the settings page.
1. In the section for "Project properties", select the link to your resource group to open it in the Azure portal. 
1. Select **Access control (IAM)** from the left navigation menu in the Azure portal.
1. Select **Add role assignment**.
1. Select **Azure ML Data Scientist**, and select __Next__.
1. Select **Managed Identity**.
1. Select **+ Select members**.
1. Select **Machine Learning Online Endpoints** in the Managed Identity dropdown field.
1. Select your endpoint's name.
1. Select **Select**.
1. Select **Review + Assign**.
1. Return to your project in AI Studio and select **Deployments** from the left navigation menu. 
1. Select your deployment.
1. Test the prompt flow deployment.

### Error: Deployment failure

The full error message is as follows: 

"ResourceNotFound: Deployment failed due to timeout while waiting for Environment Image to become available. Check Environment Build Log in ML Studio Workspace or Workspace storage for potential failures. Image build summary: [N/A]. Environment info: Name: CliV2AnonymousEnvironment, Version: 'Ver', you might be able to find the build log under the storage account 'NAME' in the container 'CONTAINER_NAME' at the Path 'PATH/PATH/image_build_aggregate_log.txt'."

You might have come across an `ImageBuildFailure` error: This error happens when the environment (docker image) is being built. For more information about the error, you can check the build log for your `<CONTAINER NAME>` environment. 

This error message refers to a situation where the deployment build failed. You want to read the build log to troubleshoot further. There are two ways to access the build log.

__Option 1: Find the build log for the Azure default blob storage.__

1. Go to your project in [Azure AI Studio](https://ai.azure.com) and select **Settings** from the left navigation menu to open the settings page.
1. In the section for "Project properties", select the link to your hub to open the hub overview page.
1. In the section for "Resource configuration" on the hub overview page, select the link to your storage account name. This name should be the name of the storage account listed in the error message you received. You'll be taken to the storage account page in the [Azure portal](https://portal.azure.com).
1. On the storage account page, select **Data Storage** > **Containers** from the left navigation menu.
1. Select the container name that's listed in the error message you received.
1. Select through folders to find the build logs.

__Option 2: Find the build log within Azure Machine Learning studio.__

> [!NOTE]
> This option to access the build log uses [Azure Machine Learning studio](https://ml.azure.com), which is a different portal than [Azure AI Studio](https://ai.azure.com).

1. Go to [Azure Machine Learning studio](https://ml.azure.com).
2. Select **Endpoints** from the left navigation menu.
3. Select your endpoint name. It might be identical to your deployment name.
4. Select the link to **Environment** from the deployment section.
5. Select **Build log** at the top of the environment details page.

### Error: `UserErrorFromQuotaService`

The full error message is: "UserErrorFromQuotaService: Simultaneous count exceeded for subscription."

This error message means that the shared quota pool has reached the maximum number of requests it can handle. Try again at a later time when the shared quota is freed up for use.

### Question: I deployed a web app but I don't see a way to launch it or find it

We're working on improving the user experience of web app deployment at this time. In the meantime, here's a tip: if your web app launch button doesn't become active after a while, try to deploy it again, using the __update an existing app__ option. If the web app was properly deployed, it should show up on the dropdown list of your existing web apps.

### Question: I deployed a model but I don't see it in the playground

Playground only supports select models, such as Azure OpenAI models and Llama-2. If playground support is available, you see the **Open in playground** button on the model deployment's **Details** page. 

## Related content

- [Azure AI Studio overview](../what-is-ai-studio.md)
- [Azure AI FAQ](../faq.yml)
