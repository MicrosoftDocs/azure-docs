---
title: Azure AI resource concepts
titleSuffix: Azure AI Studio
description: This article introduces concepts about Azure AI resources.
author: eric-urban
manager: nitinme
ms.service: azure-ai-studio
ms.custom:
  - ignite-2023
ms.topic: conceptual
ms.date: 11/15/2023
ms.author: eur
---

# Azure AI resources

[!INCLUDE [Azure AI Studio preview](../includes/preview-ai-studio.md)]

In Azure, resources enable access to Azure services for individuals and teams. Access to many Azure AI capabilities is available via a unified resource called Azure AI. 

The preview 'Azure AI' resource used in AI studio can be used to access multiple Azure AI services with a single setup. Previously, different Azure AI services including [Azure OpenAI](), [Azure Machine Learning](), [Azure Speech](), required their individual setup. The AI resource provides the working environment for a team to build and manage AI applications, catering to two main user persona:

* To AI developers, the Azure AI resource provides the working environment for building AI applications granting access to various tools for AI model building. Tools can be used together, and lets you use and produce shareable components including datasets, indexes, models. AI resources allows you to configure connections to external resources, provide compute resources used by tools and [endpoints and access keys to pre-built AI models]((#azure-ai-services-resource-keys).
* To IT administrators and team leads, the Azure AI resource provides a single pane of glass on projects created by a team, audit connections that are in use to external resources, and governance controls to help meet compliance requirements. Security settings are configured on the Azure AI resource, and once set up apply to all projects created under it.

In this article, you learn more about Azure AI resource's capabilities, and how to set up Azure AI for your organization. You can see the resources that have created in the [Azure portal](https://portal.azure.com/) and in [Azure AI Studio](https://ai.azure.com).

## Unified assets across projects

An **Azure AI resource** can be used to access multiple Azure AI services. An Azure AI resource is the top-level resource for access management, security configuration and governance. 

Each Azure AI resource has its own:

| Asset | Description |
| --- | --- |
| Endpoints | The location of deployed models or flows |
| Compute instances | However the runtimes are project assets |
| Connections | Connections to Azure and third-party resources |
| Managed network | A managed virtual network is shared between all projects that share the same AI resource |
| Storage | Storage account to store artifacts for your projects, such as uploaded data, and output logs when you use Azure |
| Key vault | Key vault to store secrets for your projects, such as when you create connections |
| AI services resource | To access foundation models such as Azure OpenAI, Speech, Vision, and Content Safety with one [API key](#azure-ai-services-resource-keys) |

All associated [Azure AI projects](#project-assets) can use the configurations that are set up here. 

## Project assets

An Azure AI resource hosts an **Azure AI project** which provides enterprise-grade security and a collaborative environment. 

An Azure AI project has tools for AI experimentation, lets you organize your work, save state across different tools like prompt flow, and share your work with others. For example, you can share files and connections to data sources. Multiple projects can use an Azure AI resource, and a project can be used by multiple users. A project also helps you keep track of billing, upload files, and manage access.

A project has its own settings and components that you can manage in Azure AI Studio:

| Asset | Description |
| --- | --- |
| Compute instances | A managed cloud-based workstation.<br/><br/>Compute can only be shared across projects by the same user. |
| Prompt flow runtime | Prompt flow is a feature that can be used to generate, customize, or run a flow. To use prompt flow, you need to create a runtime on top of a compute instance. |
| Flows | An executable instruction set that can implement the AI logic.​​ |
| Evaluations | Evaluations of a model or flow. You can run manual or metrics-based evaluations. |
| Indexes | Vector search indexes generated from your data |
| Data | Data sources that can be used to create indexes, train models, and evaluate models |

> [!NOTE]
> In AI Studio you can also manage language and notification settings that apply to all Azure AI Studio projects that you can access regardless of the Azure AI resource.

## Azure AI services resource keys

The Azure AI resource doesn't directly contain the keys and endpoints needed to authenticate your requests to **Azure AI services**. Instead, the Azure AI resource contains among other resources, an "Azure AI services" resource. To see how this is represented in Azure AI Studio and in the Azure portal, see [Find Azure AI Studio resources in the Azure portal](#find-azure-ai-studio-resources-in-the-azure-portal) later in this article.

> [!NOTE]
> This Azure AI services resource is not to be confused with the standalone "Azure AI services multi-service account" resource. Their capabilities vary, and the standalone resource is not supported in Azure AI Studio. Going forward, we recommend using the Azure AI services resource that's provided with your Azure AI resource.

The Azure AI services resource contains the keys and endpoints needed to authenticate your requests to Azure AI services. With the same API key, you can access all of the following Azure AI services:

| Service | Description |
| --- | --- |
| ![Azure OpenAI Service icon](../../ai-services/media/service-icons/azure.svg) [Azure OpenAI](../../ai-services/openai/index.yml) | Perform a wide variety of natural language tasks |
| ![Content Safety icon](../../ai-services/media/service-icons/content-safety.svg) [Content Safety](../../ai-services/content-safety/index.yml) | An AI service that detects unwanted contents |
| ![Speech icon](../../ai-services/media/service-icons/speech.svg) [Speech](../../ai-services/speech-service/index.yml) | Speech to text, text to speech, translation and speaker recognition |
| ![Vision icon](../../ai-services/media/service-icons/vision.svg) [Vision](../../ai-services/computer-vision/index.yml) | Analyze content in images and videos |

Large language models that can be used to generate text, speech, images, and more, are hosted by the AI resource. Fine-tuned models and open models deployed from the [model catalog](../how-to/model-catalog.md) are always created in the project context for isolation.

## Centralized setup and governance

An Azure AI resource lets you configure security and shared configurations that are shared across projects. 

Resources and security configurations are passed down to each project that shares the same Azure AI resource. If changes are made to the Azure AI resource, those changes are applied to any current and new projects.

You can set up Azure resources and security once, and reuse this environment for a group of projects. Data is stored separately per project on Azure AI associated resources such as Azure storage.

The following settings are configured on the Azure AI resource and shared with every project:

|Configuration|Note|
|---|---|
|Managed network isolation mode|The resource and associated projects share the same managed virtual network resource.|
|Public network access|The resource and associated projects share the same managed virtual network resource.|
|Encryption settings|One managed resource group is created for the resource and associated projects combined. Currently encryption configuration doesn't yet pass down from AI resource to AI Services provider and must be separately set up.|
|Azure Storage account|Stores artifacts for your projects like flows and evaluations. For data isolation, storage containers are prefixed using the project GUID, and conditionally secured using Azure ABAC for the project identity.|
|Azure Key Vault| Stores secrets like connection strings for your resource connections. For data isolation, secrets can't be retrieved across projects via APIs.|
|Azure Container Registry| For data isolation, docker images are prefixed using the project GUID.|

### Managed Networking

Azure AI resource and projects share the same managed virtual network. After you configure the managed networking settings during the Azure AI resource creation process, all new projects created using that Azure AI resource will inherit the same network settings. Therefore, any changes to the networking settings are applied to all current and new project in that Azure AI resource. By default, Azure AI resources provide public network access.

## Shared computing resources across projects

When you create compute to use in Azure AI for Visual Studio Code interactive development, or for use in prompt flow, it's reusable across all projects that share the same Azure AI resource.

Compute instances are managed cloud-based workstations that are bound to an individual user. 

Every project comes with a unique fileshare that can be used to share files across all users that collaborate on a project. This fileshare gets mounted on your compute instance.

## Connections to Azure and third-party resources

Azure AI offers a set of connectors that allows you to connect to different types of data sources and other Azure tools. You can take advantage of connectors to connect with data such as indices in Azure AI Search to augment your flows.

Connections can be set up as shared with all projects in the same Azure AI resource, or created exclusively for one project. As an administrator, you can audit both shared and project-scoped connections on an Azure AI resource level.

## Azure AI dependencies

Azure AI studio layers on top of existing Azure services including Azure AI and Azure Machine Learning services. Some of the architectural details are apparent when you open the Azure portal. For example, an Azure AI resource is a specific kind of Azure Machine Learning workspace hub, and a project is an Azure Machine Learning workspace. 

Across Azure AI Studio, Azure portal, and Azure Machine Learning studio, the displayed resource type of some resources vary. The following table shows some of the resource display names that are shown in each portal:

|Portal|Azure AI resource|Azure AI project|
|---|---|---|
|Azure AI Studio|Azure AI resource|Project|
|Azure portal resource group view|Azure AI|Azure AI project|
|Azure portal cost analysis view|Azure AI service|Azure Machine Learning workspace|
|Azure Machine Learning studio|Not applicable|Azure Machine Learning workspace (kind: project)|
|Resource provider (ARM templates, REST API, Bicep) | Microsoft.Machinelearningservices/kind="hub" | Microsoft.Machinelearningservices/kind="project"|

## Managing cost

Azure AI costs accrue by [various Azure resources](#centralized-setup-and-governance). 

In general, an Azure AI resource and project don't have a fixed monthly cost, and only charge for usage in terms of compute hours and tokens used. Azure Key Vault, Storage, and Application Insights charge transaction and volume-based, dependent on the amount of data stored with your Azure AI projects. 

If you require to group costs of these different services together, we recommend creating Azure AI resources in one or more dedicated resource groups and subscriptions in your Azure environment.

You can use [cost management](/azure/cost-management-billing/costs/quick-acm-cost-analysis) and [Azure resource tags](/azure/azure-resource-manager/management/tag-resources) to help with a detailed resource-level cost breakdown, or run [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/) on the above listed resources to obtain a pricing estimate. For more information, see [Plan and manage costs for Azure AI services](../how-to/costs-plan-manage.md).

## Find Azure AI Studio resources in the Azure portal

In the Azure portal, you can find resources that correspond to your Azure AI project in Azure AI Studio.

> [!NOTE]
> This section assumes that the Azure AI resource and Azure AI project are in the same resource group. 

In Azure AI Studio, go to **Build** > **Settings** to view your Azure AI project resources such as connections and API keys. There's a link to view the corresponding resources in the Azure portal and a link to your Azure AI resource in Azure AI Studio.

:::image type="content" source="../media/concepts/azureai-project-view-ai-studio.png" alt-text="Screenshot of the Azure AI project and related resources in the Azure AI Studio." lightbox="../media/concepts/azureai-project-view-ai-studio.png":::

In Azure AI Studio, go to **Manage** (or select the Azure AI resource link from the project settings page) to view your Azure AI resource, including projects and shared connections. There's also a link to view the corresponding resources in the Azure portal.

:::image type="content" source="../media/concepts/azureai-resource-view-ai-studio.png" alt-text="Screenshot of the Azure AI resource and related resources in the Azure AI Studio." lightbox="../media/concepts/azureai-resource-view-ai-studio.png":::

After you select **View in the Azure Portal**, you see your Azure AI resource in the Azure portal. 

:::image type="content" source="../media/concepts/docs-azure-ai-resource.png" alt-text="Screenshot of the Azure AI resource in the Azure portal." lightbox="../media/concepts/docs-azure-ai-resource.png":::

Select the resource group name to see all associated resources, including the Azure AI project, storage account, and key vault. 

:::image type="content" source="../media/concepts/rg-docs-azure-ai-resource.png" alt-text="Screenshot of the Azure AI resource group in the Azure portal." lightbox="../media/concepts/rg-docs-azure-ai-resource.png":::

From the resource group, you can select the Azure AI project for more details.

:::image type="content" source="../media/concepts/docs-project.png" alt-text="Screenshot of the Azure AI project in the Azure portal." lightbox="../media/concepts/docs-project.png":::

Also from the resource group, you can select the **Azure AI service** resource to see the keys and endpoints needed to authenticate your requests to Azure AI services.

:::image type="content" source="../media/concepts/docs-azure-ai-resource-aiservices-keys.png" alt-text="Screenshot of the Azure AI service resource in the Azure portal." lightbox="../media/concepts/docs-azure-ai-resource-aiservices-keys.png":::

You can use the same API key to access all of the supported service endpoints that are listed.

:::image type="content" source="../media/concepts/docs-azure-ai-resource-aiservices-keys-endpoints.png" alt-text="Screenshot of the Azure AI service resource endpoints in the Azure portal." lightbox="../media/concepts/docs-azure-ai-resource-aiservices-keys-endpoints.png":::

## Next steps

- [Quickstart: Generate product name ideas in the Azure AI Studio playground](../quickstarts/playground-completions.md)
- [Learn more about Azure AI Studio](../what-is-ai-studio.md)
- [Learn more about Azure AI Studio projects](../how-to/create-projects.md)
