---
title: Deploy custom language projects to multiple regions in Azure AI Language
titleSuffix: Azure AI services
description: Learn about deploying your language projects to multiple regions.
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: conceptual
ms.date: 12/19/2023
ms.author: aahi
ms.custom: language-service-clu
---

# Deploy custom language projects to multiple regions

> [!NOTE]
> This article applies to the following custom features in Azure AI Language:
> * [Conversational language understanding](../../conversational-language-understanding/overview.md)
> * [Custom text classification](../../custom-text-classification/overview.md)
> * [Custom NER](../../custom-named-entity-recognition/overview.md)
> * [Orchestration workflow](../../orchestration-workflow/overview.md)

Custom Language service features enable you to deploy your project to more than one region, making it much easier to access your project globally while managing only one instance of your project in one place. 

Before you deploy a project, you can assign **deployment resources** in other regions. Each deployment resource is a different Language resource from the one you use to author your project. You deploy to those resources and then target your prediction requests to that resource in their respective regions and your queries are served directly from that region.

When creating a deployment, you can select which of your assigned deployment resources and their corresponding regions you would like to deploy to. The model you deploy is then replicated to each region and accessible with its own endpoint dependent on the deployment resource's custom subdomain. 

## Example

Suppose you want to make sure your project, which is used as part of a customer support chatbot, is accessible by customers across the US and India. You would author a project with the name **ContosoSupport** using a _West US 2_ Language resource named **MyWestUS2**. Before deployment, you would assign two deployment resources to your project - **MyEastUS** and **MyCentralIndia** in _East US_ and _Central India_, respectively.

When deploying your project, You would select all three regions for deployment: the original _West US 2_ region and the assigned ones through _East US_ and _Central India_.

You would now have three different endpoint URLs to access your project in all three regions:
* West US 2: `https://mywestus2.cognitiveservices.azure.com/language/:analyze-conversations`
* East US: `https://myeastus.cognitiveservices.azure.com/language/:analyze-conversations`
* Central India: `https://mycentralindia.cognitiveservices.azure.com/language/:analyze-conversations`

The same request body to each of those different URLs serves the exact same response directly from that region. 

## Validations and requirements

Assigning deployment resources requires Microsoft Entra authentication. Microsoft Entra ID is used to confirm you have access to the resources you are interested in assigning to your project for multi-region deployment. In the Language Studio, you can automatically [enable Microsoft Entra authentication](https://aka.ms/rbac-language) by assigning yourself the _Cognitive Services Language Owner_ role to your original resource. To programmatically use Microsoft Entra authentication, learn more from the [Azure AI services documentation](../../../authentication.md?source=docs&tabs=powershell&tryIt=true#authenticate-with-azure-active-directory).

Your project name and resource are used as its main identifiers. Therefore, a Language resource can only have a specific project name in each resource. Any other projects with the same name will not be deployable to that resource. 

For example, if a project **ContosoSupport** was created by resource **MyWestUS2** in _West US 2_ and deployed to resource **MyEastUS** in _East US_, the resource **MyEastUS** cannot create a different project called **ContosoSupport** and deploy a project to that region. Similarly, your collaborators cannot then create a project **ContosoSupport** with resource **MyCentralIndia** in _Central India_ and deploy it to either **MyWestUS2** or **MyEastUS**.

You can only swap deployments that are available in the exact same regions, otherwise swapping will fail.

If you remove an assigned resource from your project, all of the project deployments to that resource will then be deleted.

> [!NOTE]
> Orchestration workflow only:
>
> You **cannot** assign deployment resources to orchestration workflow projects with custom question answering or LUIS connections. You subsequently cannot add custom question answering or LUIS connections to projects that have assigned resources.
>
> For multi-region deployment to work as expected, the connected CLU projects **must also be deployed** to the same regional resources you've deployed the orchestration workflow project to. Otherwise the orchestration workflow project will attempt to route a request to a deployment in its region that doesn't exist.

Some regions are only available for deployment and not for authoring projects.

## Next steps

Learn how to deploy models for:
* [Conversational language understanding](../../conversational-language-understanding/how-to/deploy-model.md)
* [Custom text classification](../../custom-text-classification/how-to/deploy-model.md)
* [Custom NER](../../custom-named-entity-recognition/how-to/deploy-model.md)
* [Orchestration workflow](../../orchestration-workflow/how-to/deploy-model.md)
