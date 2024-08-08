---
title: Deploy custom language projects to multiple regions in Azure AI Language
titleSuffix: Azure AI services
description: Learn about how to deploy your custom language projects to multiple regions.
#services: cognitive-services
author: jboback
manager: nitinme
ms.service: azure-ai-language
ms.topic: conceptual
ms.date: 12/19/2023
ms.author: jboback
ms.custom: language-service-clu
---

# Deploy custom language projects to multiple regions

> [!NOTE]
> This article applies to the following custom features in Azure AI Language:
>
> * [Conversational language understanding](../../conversational-language-understanding/overview.md)
> * [Custom text classification](../../custom-text-classification/overview.md)
> * [Custom named entity recognition (NER)](../../custom-named-entity-recognition/overview.md)
> * [Orchestration workflow](../../orchestration-workflow/overview.md)

Custom language service features enable you to deploy your project to more than one region. This capability makes it much easier to access your project globally while you manage only one instance of your project in one place.

Before you deploy a project, you can assign *deployment resources* in other regions. Each deployment resource is a different Language resource from the one that you use to author your project. You deploy to those resources and then target your prediction requests to that resource in their respective regions and your queries are served directly from that region.

When you create a deployment, you can select which of your assigned deployment resources and their corresponding regions you want to deploy to. The model you deploy is then replicated to each region and accessible with its own endpoint dependent on the deployment resource's custom subdomain.

## Example

Suppose you want to make sure your project, which is used as part of a customer support chatbot, is accessible by customers across the United States and India. You author a project with the name `ContosoSupport` by using a West US 2 Language resource named `MyWestUS2`. Before deployment, you assign two deployment resources to your project: `MyEastUS` and `MyCentralIndia` in East US and Central India, respectively.

When you deploy your project, you select all three regions for deployment: the original West US 2 region and the assigned ones through East US and Central India.

You now have three different endpoint URLs to access your project in all three regions:

* **West US 2**: `https://mywestus2.cognitiveservices.azure.com/language/:analyze-conversations`
* **East US**: `https://myeastus.cognitiveservices.azure.com/language/:analyze-conversations`
* **Central India**: `https://mycentralindia.cognitiveservices.azure.com/language/:analyze-conversations`

The same request body to each of those different URLs serves the exact same response directly from that region.

## Validations and requirements

Assigning deployment resources requires Microsoft Entra authentication. Microsoft Entra ID is used to confirm that you have access to the resources that you want to assign to your project for multiregion deployment. In Language Studio, you can automatically [enable Microsoft Entra authentication](https://aka.ms/rbac-language) by assigning yourself the Azure Cognitive Services Language Owner role to your original resource. To programmatically use Microsoft Entra authentication, learn more from the [Azure AI services documentation](../../../authentication.md?source=docs&tabs=powershell&tryIt=true#authenticate-with-azure-active-directory).

Your project name and resource are used as its main identifiers. A Language resource can only have a specific project name in each resource. Any other projects with the same name can't be deployed to that resource.

For example, if a project `ContosoSupport` was created by the resource `MyWestUS2` in West US 2 and deployed to the resource `MyEastUS` in East US, the resource `MyEastUS` can't create a different project called `ContosoSupport` and deploy a project to that region. Similarly, your collaborators can't then create a project `ContosoSupport` with the resource `MyCentralIndia` in Central India and deploy it to either `MyWestUS2` or `MyEastUS`.

You can only swap deployments that are available in the exact same regions. Otherwise, swapping fails.

If you remove an assigned resource from your project, all of the project deployments to that resource are deleted.

> [!NOTE]
> Orchestration workflow only:
>
> You *can't* assign deployment resources to orchestration workflow projects with custom question answering or LUIS connections. Subsequently, you can't add custom question answering or LUIS connections to projects that have assigned resources.
>
> For multiregion deployment to work as expected, the connected CLU projects *must also be deployed* to the same regional resources to which you deployed the orchestration workflow project. Otherwise, the orchestration workflow project attempts to route a request to a deployment in its region that doesn't exist.

Some regions are only available for deployment and not for authoring projects.

## Related content

Learn how to deploy models for:

* [Conversational language understanding](../../conversational-language-understanding/how-to/deploy-model.md)
* [Custom text classification](../../custom-text-classification/how-to/deploy-model.md)
* [Custom NER](../../custom-named-entity-recognition/how-to/deploy-model.md)
* [Orchestration workflow](../../orchestration-workflow/how-to/deploy-model.md)
