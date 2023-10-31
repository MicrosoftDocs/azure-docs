---
title: Azure AI resource concepts
titleSuffix: Azure AI services
description: This article introduces concepts about Azure AI resources.
author: eric-urban
manager: nitinme
ms.service: azure-ai-services
ms.topic: conceptual
ms.date: 10/1/2023
ms.author: eur
---

# Azure AI resources

An Azure AI resource can be used to access multiple Azure AI services. The Azure AI resource provides a hosted environment for teams to organize their [Azure AI project](#project-assets) work in, and is configurable with enterprise-grade security controls, which are passed down to each project environment. The Azure AI resource doesn't directly contain the keys and endpoints needed to authenticate your requests to Azure AI services. Instead, the Azure AI resource contains an [Azure AI services](#azure-ai-services-resource-keys) resource with keys and endpoints that you use to access Azure AI services.

In this article, you learn more about its capabilities, and how to set up Azure AI for your organization.

## Unified assets across projects

An **Azure AI resource** can be used to access multiple Azure AI services. An Azure AI resource is the top-level resource for access management, security configuration and governance. 

Each Azure AI resource has its own:

| Asset | Description |
| --- | --- |
| AI services resource | To access foundation models such as Azure OpenAI, Speech, Vision, and Content Safety with one [API key](#azure-ai-services-resource-keys) |
| Endpoints | The location of deployed models or flows |
| Compute instances | However the runtimes are project assets |
| Connections | Connections to Azure and third-party resources |
| Managed network | A managed virtual network that can be used to isolate your projects |
| Storage | Storage account to store artifacts for your projects |
| Key vault | Key vault to store secrets for your projects |

Configurations that are set up here can be used by all associated [Azure AI projects](#project-assets). 

## Project assets

An Azure AI resource hosts an **Azure AI project** which provides enterprise-grade security and a collaborative environment. 

An Azure AI project has tools for AI experimentation, lets you organize your work, save state across different tools like prompt flow, and share your work with others. For instance you can share files and connections to data sources. An Azure AI resource can be used by multiple projects, and a project can be used by multiple users. A project also helps you keep track of billing, upload files, and manage access.

A project has its own settings and components that you can manage in Azure AI Studio:

| Asset | Description |
| --- | --- |
| Compute instances | A managed cloud-based workstation.<br/><br/>You can opt to share compute with other projects that use the same Azure AI resource. |
| Prompt flow runtimes | Prompt flow is a feature that can be used to generate, customize, or run a flow. To use prompt flow, you need to create a runtime on top of a compute instance. |
| Flows | An executable instruction set that can implement the AI logic.​​ |
| Evaluations | Evaluations of a model or flow. You can run manual or metrics-based evaluations. |
| Indexes | Vector search indexes generated from your data |
| Data | Data sources that can be used to create indexes, train models, and evaluate models |
| Models | Large language models that can be used to generate text, speech, images, and more |

> [!NOTE]
> In AI Studio you can also manage language and notification settings that apply to all Azure AI Studio projects that you can access regardless of the Azure AI resource.

## Azure AI services resource keys

The Azure AI resource doesn't directly contain the keys and endpoints needed to authenticate your requests to **Azure AI services**. Instead, the Azure AI resource contains among other resources, an "Azure AI services" resource. 

> [!NOTE]
> This Azure AI services resource is not to be confused with the standalone "Azure AI services multi-service account" resource. Their capabilities vary, and the standalone resource is not supported in Azure AI Studio. Going forward, we recommend using the Azure AI services resource that's provided with your Azure AI resource.

:::image type="content" source="../media/concepts/resource-project-services-keys.png" alt-text="Screenshot of the playground page of the Azure AI Studio with the Generate product name ideas dropdown selection visible." lightbox="../media/concepts/resource-project-services-keys.png":::

The Azure AI services resource contains the keys and endpoints needed to authenticate your requests to Azure AI services. With the same API key, you can access all of the followig Azure AI services:

| Service | Description |
| --- | --- |
| ![Azure OpenAI Service icon](../../media/service-icons/azure.svg) [Azure OpenAI](../../openai/index.yml) | Perform a wide variety of natural language tasks |
| ![Content Safety icon](../../media/service-icons/content-safety.svg) [Content Safety](../../content-safety/index.yml) | An AI service that detects unwanted contents |
| ![Speech icon](../../media/service-icons/speech.svg) [Speech](../../speech-service/index.yml) | Speech to text, text to speech, translation and speaker recognition |
| ![Vision icon](../../media/service-icons/vision.svg) [Vision](../../computer-vision/index.yml) | Analyze content in images and videos |


## Centralized setup and governance

An Azure AI resource lets you configure security and shared configurations that are shared across projects. 

Resources and security configurations are passed down to each project that shares the same Azure AI resource. If changes are made to the Azure AI resource, those changes will be inherited by the current, and any new, projects.

You can set up Azure resources and security once, and reuse this environment for a group of projects. Data is stored seperately per project on Azure AI associated resources.

The following settings are configured on the Azure AI resource and shared with every project:

|Configuration|Note|
|---|---|
|Managed network isolation mode|The resource and associated projects share the same [managed virtual network](/azure/machine-learning/how-to-managed-network) resource.|
|Public network access|The resource and associated projects share the same managed virtual network resource.|
|Encryption settings|One managed resource group is created for the resource and associated projects combined.|
|Azure Storage account|Stores artifacts for your projects like flows and evaluations. For data isolation, storage containers are prefixed using the project (workspace) GUID, and conditionally secured using Azure ABAC for the project (workspace) identity.|
|Azure Key Vault| Stores secrets like connection strings for your resource connections. For data isolation, secrets can't be retrieved across workspaces via the Machine Learning APIs.|
|Azure Container Registry| For data isolation, docker images are prefixed using the project (workspace) GUID.|
|Azure Application Insights| Optionally used to store application logs for your deployed endpoints.|

### Managed Networking

Azure AI resource and projects share the same [managed virtual network](/azure/machine-learning/how-to-managed-network). After you configure the managed networking settings during the Azure AI resource creation process, all new projects created using that Azure AI resource will inherit the same network settings. Therefore, any changes to the networking settings will be applied to all current and new project in that Azure AI resource. By default, Azure AI resources provide public network access.

## Shared computing resources across projects

When you create compute to use in Azure AI for Visual Studio Code interactive development, or for use in prompt flow, it's reusable across all projects that share the same Azure AI resource.

Compute instances are managed cloud-based workstations that are bound to an individual user. To learn more on their configuration, see [compute instance in Azure Machine Learning](/azure/machine-learning/concept-compute-instance).

Every project comes with a unique fileshare that can be used to share files across all users that collaborate on a project. This fileshare gets mounted on your compute instance.

## Connections to Azure and third-party resources

Azure AI offers a set of connectors that allows you to connect to different types of data sources and other Azure tools. You can take advantage of connectors to connect with data such as indices in Azure AI Search to augment your flows.

Connections can be set up as shared with all projects in the same Azure AI resource, or created exclusively for one project. As an administrator, you can audit both shared and project-scoped connections on an Azure AI resource level.

During this preview, connectors are used to set up your projects for use with various Azure AI services.

## Azure Machine Learning dependencies

Azure AI studio layers on top of existing Azure services including Azure Machine Learning services. Some of the architectural details are apparent when you open the Azure portal. For example, an Azure AI resource is a specific kind of Azure Machine Learning workspace hub, and a project is an Azure Machine Learning workspace. 

Across Azure AI Studio, Azure portal, and Azure Machine Learning studio, the displayed resource type of some resources vary. The following table shows some of the resource display names that are shown in each portal:

|Portal|Azure AI resource|Azure AI project|
|---|---|---|
|Azure AI Studio|Azure AI resource|Project|
|Azure portal resource group view|Azure AI|Azure AI project|
|Azure portal cost analysis view|Azure AI service|Azure Machine Learning workspace|
|Azure portal|Azure Machine Learning workspace hub|Azure Machine Learning workspace|
|Azure Machine Learning studio|Azure Machine Learning workspace hub|Azure Machine Learning workspace|

## Managing cost

Your Azure bill for this preview of Azure AI is accrued by [various Azure resources](#centralized-setup-and-governance). 

In general, an Azure AI resource and project don't have a fixed monthly cost, and only charge for usage in terms of compute hours and tokens used. Azure Key Vault, Storage, and Application Insights charge transaction and volume-based, dependent on the amount of data stored with your Azure AI projects. 

If you require to group costs of these different services together, we recommend creating Azure AI resources in one or more dedicated resource groups and subscriptions in your Azure environment.

You can use [Azure Cost Management](/azure/cost-management-billing/costs/quick-acm-cost-analysis) and [Azure resource tags](/azure/azure-resource-manager/management/tag-resources) to help with a detailed resource-level cost breakdown, or run [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/) on the above listed resources to obtain a pricing estimate. For more information, see [Plan and manage costs for Azure AI services](../how-to/costs-plan-manage.md).

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

:::image type="content" source="../media/concepts/rg-docsazureairesource.png" alt-text="Screenshot of the Azure AI resource group in the Azure portal." lightbox="../media/concepts/rg-docsazureairesource.png":::

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
