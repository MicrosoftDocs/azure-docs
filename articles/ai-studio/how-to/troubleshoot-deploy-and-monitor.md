---
title: How to troubleshoot your deployments and monitors in Azure AI Studio
titleSuffix: Azure AI Studio
description: This article provides instructions on how to troubleshoot your deployments and monitors in Azure AI Studio.
author: eric-urban
manager: nitinme
ms.service: azure-ai-studio
ms.custom:
  - ignite-2023
ms.topic: how-to
ms.date: 11/15/2023
ms.author: eur
---

# How to troubleshoot your deployments and monitors in Azure AI Studio

[!INCLUDE [Azure AI Studio preview](../includes/preview-ai-studio.md)]

This article provides instructions on how to troubleshoot your deployments and monitors in Azure AI Studio. 

## Deployment issues

For the general deployment error code reference, you can go to the [Azure Machine Learning documentation](/azure/machine-learning/how-to-troubleshoot-online-endpoints). Much of the information there also applies to Azure AI Studio deployments.

**Question:** I got the following error message. What should I do?
"Use of Azure OpenAI models in Azure Machine Learning requires Azure OpenAI services resources. This subscription or region doesn't have access to this model."

**Answer:** You might not have access to this particular Azure OpenAI model. For example, your subscription might not have access to the latest GPT model yet or this model isn't offered in the region you want to deploy to. You can learn more about it on [Azure OpenAI Service models](../../ai-services/openai/concepts/models.md).

**Question:** I got an "out of quota" error message. What should I do?

**Answer:**  For more information about managing quota, see:
-  [Quota for deploying and inferencing a model](../how-to/deploy-models-openai.md#quota-for-deploying-and-inferencing-a-model)
-  [Manage Azure OpenAI Service quota documentation](/azure/ai-services/openai/how-to/quota?tabs=rest)
- [Manage and increase quotas for resources with Azure AI Studio](quota.md)

**Question:** After I deployed a prompt flow, I got an error message "Tool load failed in 'search_question_from_indexed_docs': (ToolLoadError) Failed to load package tool 'Vector Index Lookup': (HttpResponseError) (AuthorizationFailed)". How can I resolve this?

**Answer:** You can follow this instruction to manually assign ML Data scientist role to your endpoint to resolve this issue. It might take several minutes for the new role to take effect.

1. Go to your project and select **Settings** from the left menu.
2. Select the link to your resource group.
3. Once you're redirected to the resource group in Azure portal, Select **Access control (IAM)** on the left navigation menu.
4. Select **Add role assignment**.
5. Select **Azure ML Data Scientist** and select Next.
6. Select **Managed Identity**.
7. Select **+ Select members**.
8. Select **Machine Learning Online Endpoints** in the Managed Identity dropdown field.
9. Select your endpoint name.
10. Select **Select**.
11. Select **Review + Assign**.
12. Return to AI Studio and go to the deployment details page (**YourProject** > **Deployments** > YourDeploymentName).
13. Test the prompt flow deployment.

**Question:** I got the following error message about the deployment failure. What should I do to troubleshoot?
```
ResourceNotFound: Deployment failed due to timeout while waiting for Environment Image to become available. Check Environment Build Log in ML Studio Workspace or Workspace storage for potential failures. Image build summary: [N/A]. Environment info: Name: CliV2AnonymousEnvironment, Version: ‘Ver’, you might be able to find the build log under the storage account 'NAME' in the container 'CONTAINER_NAME' at the Path 'PATH/PATH/image_build_aggregate_log.txt'.
```

You might have come across an ImageBuildFailure error: This happens when the environment (docker image) is being built. For more information about the error, you can check the build log for your `<CONTAINER NAME>` environment. 

**Answer:** These error messages refer to a situation where the deployment build failed. You want to read the build log to troubleshoot further. There are two ways to access the build log.

Option 1: Find the build log for the Azure default blob storage.

1. Go to your project and select the settings icon on the lower left corner.
2. Select YourAIResourceName under AI Resource on the Settings page.
3. On the AI resource page, select YourStorageName under Storage Account. This should be the name of storage account listed in the error message you received.
4. On the storage account page, select Container under Data Storage on the left navigation UI
5. Select the ContainerName listed in the error message you received.
6. Select through folders to find the build logs.

Option 2: Find the build log within Azure Machine Learning studio, which is a separate portal from Azure AI Studio.

1. Go to [Azure Machine Learning studio](https://ml.azure.com).
2. Select **Endpoints** on the left navigation menu.
3. Select your endpoint name. It might be identical to your deployment name.
4. Select the **Environment** link in the deployment section.
5. Select **Build log** on the top of the environment details page.

**Question:** I got an error message "UserErrorFromQuotaService: Simultaneous count exceeded for subscription". What does it mean and how can I resolve it?

**Answer:** This error message means the shared quota pool has reached the maximum number of requests it can handle. Try again at a later time when the shared quota is freed up for use.

**Question:** I deployed a web app but I don't see a way to launch it or find it.

**Answer:** We're working on improving the user experience of web app deployment at this time. For the time being, here's a tip: if your web app launch button doesn't become active after a while, try deploy again using the 'update an existing app' option. If the web app was properly deployed, it should show up on the dropdown list of your existing web apps.

**Question:** I deployed a model but I don't see it in the playground.
**Answer:** Playground only supports a few select models, such as Azure OpenAI models and Llama-2. If playground support is available, you see the **Open in playground** button on the model deployment's **Details** page. 

## Next steps

- [Azure AI Studio overview](../what-is-ai-studio.md)
- [Azure AI FAQ](../faq.yml)
