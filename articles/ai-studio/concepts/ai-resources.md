---
title: Azure AI hub resource concepts
titleSuffix: Azure AI Studio
description: This article introduces concepts about Azure AI hub resources.
manager: scottpolly
ms.service: azure-ai-studio
ms.custom:
  - ignite-2023
ms.topic: conceptual
ms.date: 2/5/2024
ms.reviewer: deeikele
ms.author: larryfr
author: Blackmist
---

# Azure AI hub resources

[!INCLUDE [Azure AI Studio preview](../includes/preview-ai-studio.md)]

The Azure AI hub resource is the top-level Azure resource for AI Studio and provides the working environment for a team to build and manage AI applications. In Azure, resources enable access to Azure services for individuals and teams. Resources also provide a container for billing, security configuration and monitoring.

The Azure AI hub resource can be used to access [multiple Azure AI services](#azure-ai-services-api-access-keys) with a single setup. Previously, different Azure AI services including [Azure OpenAI](../../ai-services/openai/overview.md), [Azure Machine Learning](../../machine-learning/overview-what-is-azure-machine-learning.md), [Azure AI Speech](../../ai-services/speech-service/overview.md), required their individual setup.

In this article, you learn more about Azure AI hub resource's capabilities, and how to set up Azure AI for your organization. You can see the resources created in the [Azure portal](https://portal.azure.com/) and in [Azure AI Studio](https://ai.azure.com).

## Collaboration environment for a team

The Azure AI hub resource provides the collaboration environment for a team to build and manage AI applications, catering to two personas:

* To AI developers, the Azure AI hub resource provides the working environment for building AI applications granting access to various tools for AI model building. Tools can be used together, and lets you use and produce shareable components including datasets, indexes, models. An Azure AI hub resource allows you to configure connections to external resources, provide compute resources used by tools and [endpoints and access keys to prebuilt AI models](#azure-ai-services-api-access-keys). When you use a project to customize AI capabilities, it's hosted by an Azure AI hub resource and can access the same shared resources.
* To IT administrators, team leads and risk officers, the Azure AI hub resource provides a single pane of glass on projects created by a team, audit connections that are in use to external resources, and other governance controls to help meet cost and compliance requirements. Security settings are configured on the Azure AI hub resource, and once set up apply to all projects created under it, allowing administrators to enable developers to self-serve create projects to organize work.

## Central setup and management concepts

Various management concepts are available on Azure AI hub resources to support team leads and admins to centrally manage a team's environment. 

* **Security configuration** including public network access, [virtual networking](#virtual-networking), customer-managed key encryption, and privileged access to whom can create projects for customization. Security settings configured on the Azure AI hub resource automatically pass down to each project. A managed virtual network is shared between all projects that share the same Azure AI hub resource.
* **Connections** are named and authenticated references to Azure and non-Azure resources like data storage providers. Use a connection as a means for making an external resource available to a group of developers without having to expose its stored credential to an individual.
* **Compute and quota allocation** is managed as shared capacity for all projects in AI Studio that share the same Azure AI hub resource. This includes compute instance as managed cloud-based workstation for an individual. Compute instance can be used across projects by the same user.
* **AI services access keys** to endpoints for prebuilt AI models are managed on the Azure AI hub resource scope. Use these endpoints to access foundation models from Azure OpenAI, Speech, Vision, and Content Safety with one [API key](#azure-ai-services-api-access-keys)
* **Policy** enforced in Azure on the Azure AI hub resource scope applies to all projects managed under it.
* **Dependent Azure resources** are set up once per Azure AI hub resource and associated projects and used to store artifacts you generate while working in AI Studio such as logs or when uploading data. See [Azure AI dependencies](#azure-ai-dependencies) for more details.

## Organize work in projects for customization

An Azure AI hub resource provides the hosting environment for [Azure AI projects](../how-to/create-projects.md) in AI Studio. A project is an organizational container that has tools for AI customization and orchestration, lets you organize your work, save state across different tools like prompt flow, and collaborate with others. For example, you can share uploaded files and connections to data sources.

Multiple projects can use an Azure AI hub resource, and a project can be used by multiple users. A project also helps you keep track of billing, and manage access and provides data isolation. Every project has dedicated storage containers to let you upload files and share it with only other project members when using the 'data' experiences.

Projects let you create and group reusable components that can be used across tools in AI Studio:

| Asset | Description |
| --- | --- |
| Data | Dataset that can be used to create indexes, fine-tune models, and evaluate models. |
| Flows | An executable instruction set that can implement the AI logic.​​ |
| Evaluations | Evaluations of a model or flow. You can run manual or metrics-based evaluations. |
| Indexes | Vector search indexes generated from your data. |

Projects also have specific settings that only hold for that project:

| Asset | Description |
| --- | --- |
| Project connections | Connections to external resources like data storage providers that only you and other project members can use. They complement shared connections on the Azure AI hub resource accessible to all projects.|
| Prompt flow runtime | Prompt flow is a feature that can be used to generate, customize, or run a flow. To use prompt flow, you need to create a runtime on top of a compute instance. |

> [!NOTE]
> In AI Studio you can also manage language and notification settings that apply to all Azure AI Studio projects that you can access regardless of the Azure AI hub resource or project.

## Azure AI services API access keys

The Azure AI hub resource exposes API endpoints and keys for prebuilt AI services that are created by Microsoft such as Azure OpenAI Service. Which precise services are available to you is subject to your Azure region and your chosen Azure AI services provider at the time of setup ('advanced' option):

* If you create an Azure AI hub resource together with an existing Azure OpenAI Service resource, you only have capabilities for Azure OpenAI Service. Use this option if you'd like to reuse existing Azure OpenAI quota and models deployments. Currently, there's no upgrade path to get Speech and Vision capabilities after the AI hub is created.
* If you create an Azure AI hub resource together with an Azure AI services provider, you can use Azure OpenAI Service and other AI services such as Speech and Vision. Currently, this option is only available via the Azure AI CLI and SDK.

To understand the full layering of Azure AI hub resources and its Azure dependencies including the Azure AI services provider, and how these is represented in Azure AI Studio and in the Azure portal, see [Find Azure AI Studio resources in the Azure portal](#find-azure-ai-studio-resources-in-the-azure-portal).

With the same API key, you can access all of the following Azure AI services:

| Service | Description |
| --- | --- |
| ![Azure OpenAI Service icon](../../ai-services/media/service-icons/azure.svg) [Azure OpenAI](../../ai-services/openai/index.yml) | Perform a wide variety of natural language tasks |
| ![Content Safety icon](../../ai-services/media/service-icons/content-safety.svg) [Content Safety](../../ai-services/content-safety/index.yml) | An AI service that detects unwanted contents |
| ![Speech icon](../../ai-services/media/service-icons/speech.svg) [Speech](../../ai-services/speech-service/index.yml) | Speech to text, text to speech, translation and speaker recognition |
| ![Vision icon](../../ai-services/media/service-icons/vision.svg) [Vision](../../ai-services/computer-vision/index.yml) | Analyze content in images and videos |

Large language models that can be used to generate text, speech, images, and more, are hosted by the Azure AI hub resource. Fine-tuned models and open models deployed from the [model catalog](../how-to/model-catalog.md) are always created in the project context for isolation.

### Virtual networking

Azure AI hub resources, compute resources, and projects share the same Microsoft-managed Azure virtual network. After you configure the managed networking settings during the Azure AI hub resource creation process, all new projects created using that Azure AI hub resource will inherit the same virtual network settings. Therefore, any changes to the networking settings are applied to all current and new project in that Azure AI hub resource. By default, Azure AI hub resources provide public network access.

To establish a private inbound connection to your Azure AI hub resource environment, create an Azure Private Link endpoint on the following scopes:
* The Azure AI hub resource
* The dependent `Azure AI services` providing resource
* Any other [Azure AI dependency](#azure-ai-dependencies) such as Azure storage

While projects show up as their own tracking resources in the Azure portal, they don't require their own private link endpoints to be accessed. New projects that are created after Azure AI hub resource setup, do automatically get added to the network-isolated environment.

## Connections to Azure and third-party resources

Azure AI offers a set of connectors that allows you to connect to different types of data sources and other Azure tools. You can take advantage of connectors to connect with data such as indices in Azure AI Search to augment your flows.

Connections can be set up as shared with all projects in the same Azure AI hub resource, or created exclusively for one project. To manage project connections via Azure AI Studio, navigate to a project page, then navigate to **AI project settings** > **Connections**. To manage shared connections, navigate to the **Manage** page. As an administrator, you can audit both shared and project-scoped connections on an Azure AI hub resource level to have a single pane of glass of connectivity across projects.

## Azure AI dependencies

Azure AI Studio layers on top of existing Azure services including Azure AI and Azure Machine Learning services. While this might not be visible on the display names in Azure portal, AI Studio, or when using the SDK or CLI, some of these architectural details become apparent when you work with the Azure REST APIs, use Azure cost reporting, or use infrastructure-as-code templates such as Azure Bicep or Azure Resource Manager. From an Azure Resource Provider perspective, Azure AI Studio resource types map to the following resource provider kinds:

[!INCLUDE [Resource provider kinds](../includes/resource-provider-kinds.md)]

When you create a new Azure AI hub resource, a set of dependent Azure resources are required to store data that you upload or get generated when working in AI studio. If not provided by you, and required, these resources are automatically created.

[!INCLUDE [Dependent Azure resources](../includes/dependent-resources.md)]

## Managing cost

Azure AI costs accrue by [various Azure resources](#central-setup-and-management-concepts). 

In general, an Azure AI hub resource and project don't have a fixed monthly cost, and you're only charged for usage in terms of compute hours and tokens used. Azure Key Vault, Storage, and Application Insights charge transaction and volume-based, dependent on the amount of data stored with your Azure AI projects. 

If you require to group costs of these different services together, we recommend creating Azure AI hub resources in one or more dedicated resource groups and subscriptions in your Azure environment.

You can use [cost management](/azure/cost-management-billing/costs/quick-acm-cost-analysis) and [Azure resource tags](/azure/azure-resource-manager/management/tag-resources) to help with a detailed resource-level cost breakdown, or run [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/) on the above listed resources to obtain a pricing estimate. For more information, see [Plan and manage costs for Azure AI services](../how-to/costs-plan-manage.md).

## Find Azure AI Studio resources in the Azure portal

In the Azure portal, you can find resources that correspond to your Azure AI project in Azure AI Studio.

> [!NOTE]
> This section assumes that the Azure AI hub resource and Azure AI project are in the same resource group. 

1. In [Azure AI Studio](https://ai.azure.com), go to **Build** > **AI project settings** to view your Azure AI project resources such as connections and API keys. There's a link to your Azure AI hub resource in Azure AI Studio and links to view the corresponding project resources in the [Azure portal](https://portal.azure.com).

    :::image type="content" source="../media/concepts/azureai-project-view-ai-studio.png" alt-text="Screenshot of the Azure AI project and related resources in the Azure AI Studio." lightbox="../media/concepts/azureai-project-view-ai-studio.png":::

1. Select the AI hub name to view your Azure AI hub's projects and shared connections. There's also a link to view the corresponding resources in the [Azure portal](https://portal.azure.com).

    :::image type="content" source="../media/concepts/azureai-resource-view-ai-studio.png" alt-text="Screenshot of the Azure AI hub resource and related resources in the Azure AI Studio." lightbox="../media/concepts/azureai-resource-view-ai-studio.png":::

1. Select **View in the Azure Portal** to see your Azure AI hub resource in the Azure portal. 

    :::image type="content" source="../media/concepts/ai-hub-azure-portal.png" alt-text="Screenshot of the Azure AI hub resource in the Azure portal." lightbox="../media/concepts/ai-hub-azure-portal.png":::

    - Select the **AI Services provider** to see the keys and endpoints needed to authenticate your requests to Azure AI services such as Azure OpenAI. For more information, see [Azure AI services API access keys](#azure-ai-services-api-access-keys). 
    - Also from the Azure AI hub page, you can select the **Project resource group** to find your Azure AI project. 


## Next steps

- [Quickstart: Analyze images and video with GPT-4 for Vision in the playground](../quickstarts/multimodal-vision.md)
- [Learn more about Azure AI Studio](../what-is-ai-studio.md)
- [Learn more about Azure AI Studio projects](../how-to/create-projects.md)
