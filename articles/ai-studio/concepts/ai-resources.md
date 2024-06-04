---
title: Manage, collaborate, and organize with hubs
titleSuffix: Azure AI Studio
description: This article introduces concepts about Azure AI Studio hubs for your AI Studio projects.
manager: scottpolly
ms.service: azure-ai-studio
ms.custom:
  - ignite-2023
  - build-2024
ms.topic: conceptual
ms.date: 5/21/2024
ms.reviewer: deeikele
ms.author: larryfr
author: Blackmist
---

# Manage, collaborate, and organize with hubs

[!INCLUDE [Feature preview](../includes/feature-preview.md)]

The Azure AI Studio hub is the top-level Azure resource for AI Studio and provides the working environment for a team to build and manage AI applications. In Azure, resources enable access to Azure services for individuals and teams. Resources also provide a container for billing, security configuration, and monitoring. The hub also connects to Azure and third party resources, bringing the resources you need together in Azure AI Studio.

In this article, you learn more about hub capabilities, and how to set up a hub for your organization. You can see the resources created in the [Azure portal](https://portal.azure.com/) and in [Azure AI Studio](https://ai.azure.com).

## Collaboration environment for a team

The hub provides the collaboration environment for a team to build and manage AI applications, catering to two personas:

* To AI developers, the hub provides the working environment for building AI applications granting access to various tools for AI model building. Tools can be used together, and lets you use and produce shareable components including datasets, indexes, models. A hub allows you to configure connections to external resources, provide compute resources used by tools and [endpoints, and access keys to prebuilt AI models](#azure-ai-services-api-access-keys). When you use an Azure AI Studio project to customize AI capabilities, a hub hosts the project and can access the same shared resources.
* To IT administrators, team leads and risk officers, the hub provides a single pane of glass on projects created by a team. The team can audit connections that are in use to external resources and other governance controls to help meet cost and compliance requirements. Security settings are configured on the hub, and once set up apply to all projects created under it, allowing administrators to enable developers to self-serve create projects to organize work.

## Central setup and management concepts

Various management concepts are available on hubs to support team leads and admins to centrally manage a team's environment. 

* **Security configuration** including public network access, [virtual networking](#virtual-networking), customer-managed key encryption, and privileged access to whom can create projects for customization. Security settings configured on the hub automatically pass down to each project. A managed virtual network is shared between all projects that share the same hub.
* **Connections** are named and authenticated references to Azure and non-Azure resources like data storage providers. Use a connection as a means for making an external resource available to a group of developers without having to expose its stored credential to an individual.
* **Compute and quota allocation** is managed as shared capacity for all projects in AI Studio that share the same hub. This quota includes compute instance as managed cloud-based workstation for an individual. The same user can use a compute instance across projects.
* **AI services access keys** to endpoints for prebuilt AI models are managed on the hub scope. Use these endpoints to access foundation models from Azure OpenAI, Speech, Vision, and Content Safety with one [API key](#azure-ai-services-api-access-keys)
* **Policy** enforced in Azure on the hub scope applies to all projects managed under it.
* **Dependent Azure resources** are set up once per hub and associated projects and used to store artifacts you generate while working in AI Studio such as logs or when uploading data. For more information, see [Azure AI dependencies](#azure-ai-dependencies).

## Organize work in projects for customization

A hub provides the hosting environment for [projects](../how-to/create-projects.md) in AI Studio. A project is an organizational container that has tools for AI customization and orchestration. It lets you organize your work, save state across different tools like prompt flow, and collaborate with others. For example, you can share uploaded files and connections to data sources.

Multiple projects can use a hub, and multiple users can use a project. A project also helps you keep track of billing, and manage access and provides data isolation. Every project uses dedicated storage containers to let you upload files and share it with only other project members when using the 'data' experiences.

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
| Project connections | Connections to external resources like data storage providers that only you and other project members can use. They complement shared connections on the hub accessible to all projects.|
| Prompt flow runtime | Prompt flow is a feature that can be used to generate, customize, or run a flow. To use prompt flow, you need to create a runtime on top of a compute instance. |

> [!NOTE]
> In AI Studio you can also manage language and notification settings that apply to all projects that you can access regardless of the hub or project.

## Azure AI services API access keys

The hub allows you to set up connections to existing Azure OpenAI or Azure AIServices resource types, which can be used to host model deployments. You can access these model deployments from connected resources in AI Studio. Keys to connected resources can be listed from the AI Studio or Azure portal. For more information, see [Find Azure AI Studio resources in the Azure portal](#find-azure-ai-studio-resources-in-the-azure-portal).

### Virtual networking

Hubs, compute resources, and projects share the same Microsoft-managed Azure virtual network. After you configure the managed networking settings during the hub creation process, all new projects created using that hub will inherit the same virtual network settings. Therefore, any changes to the networking settings are applied to all current and new project in that hub. By default, hubs provide public network access.

To establish a private inbound connection to your hub environment, create an Azure Private Link endpoint on the following scopes:
* The hub
* The dependent `Azure AI services` providing resource
* Any other [Azure AI dependency](#azure-ai-dependencies) such as Azure storage

While projects show up as their own tracking resources in the Azure portal, they don't require their own private link endpoints to be accessed. New projects that are created after hub setup, do automatically get added to the network-isolated environment.

## Connections to Azure and third-party resources

Azure AI offers a set of connectors that allows you to connect to different types of data sources and other Azure tools. You can take advantage of connectors to connect with data such as indexes in Azure AI Search to augment your flows.

Connections can be set up as shared with all projects in the same hub, or created exclusively for one project. To manage project connections via Azure AI Studio, go to your project and then select **Settings** > **Connections**. To manage shared connections for a hub, go to your hub settings. As an administrator, you can audit both shared and project-scoped connections on a hub level to have a single pane of glass of connectivity across projects.

## Azure AI dependencies

Azure AI Studio layers on top of existing Azure services including Azure AI and Azure Machine Learning services. While it might not be visible on the display names in Azure portal, AI Studio, or when using the SDK or CLI, some of these architectural details become apparent when you work with the Azure REST APIs, use Azure cost reporting, or use infrastructure-as-code templates such as Azure Bicep or Azure Resource Manager. From an Azure Resource Provider perspective, Azure AI Studio resource types map to the following resource provider kinds:

[!INCLUDE [Resource provider kinds](../includes/resource-provider-kinds.md)]

When you create a new hub, a set of dependent Azure resources are required to store data that you upload or get generated when working in AI studio. If not provided by you, and required, these resources are automatically created.

[!INCLUDE [Dependent Azure resources](../includes/dependent-resources.md)]

## Managing cost

Azure AI costs accrue by [various Azure resources](#central-setup-and-management-concepts). 

In general, a hub and project don't have a fixed monthly cost, and you're only charged for usage in terms of compute hours and tokens used. Azure Key Vault, Storage, and Application Insights charge transaction and volume-based, dependent on the amount of data stored with your projects. 

If you require to group costs of these different services together, we recommend creating hubs in one or more dedicated resource groups and subscriptions in your Azure environment.

You can use [cost management](/azure/cost-management-billing/costs/quick-acm-cost-analysis) and [Azure resource tags](/azure/azure-resource-manager/management/tag-resources) to help with a detailed resource-level cost breakdown, or run [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/) on the above listed resources to obtain a pricing estimate. For more information, see [Plan and manage costs for Azure AI services](../how-to/costs-plan-manage.md).

## Find Azure AI Studio resources in the Azure portal

In the Azure portal, you can find resources that correspond to your project in Azure AI Studio.

> [!NOTE]
> This section assumes that the hub and project are in the same resource group. 
1. In [Azure AI Studio](https://ai.azure.com), go to a project and select **Settings** to view your project resources such as connections and API keys. There's a link to your hub in Azure AI Studio and links to view the corresponding project resources in the [Azure portal](https://portal.azure.com).
    
    :::image type="content" source="../media/concepts/azureai-project-view-ai-studio.png" alt-text="Screenshot of the AI Studio project overview page with links to the Azure portal." lightbox="../media/concepts/azureai-project-view-ai-studio.png":::

1. Select **Manage in Azure Portal** to see your hub in the [Azure portal](https://portal.azure.com). 

## Next steps

- [Quickstart: Analyze images and video with GPT-4 for Vision in the playground](../quickstarts/multimodal-vision.md)
- [Learn more about Azure AI Studio](../what-is-ai-studio.md)
- [Learn more about projects](../how-to/create-projects.md)
