---
title: Azure API Center - Overview
description: Introduction to key scenarios and capabilities of Azure API Center. API Center inventories an organization's APIs for discovery, reuse, and governance at scale.

 
ms.service: azure-api-center
ms.topic: overview
ms.date: 01/06/2025
 
ms.custom: references_regions
---

# What is Azure API Center?

Azure API Center enables you to track all your APIs in a centralized location for discovery, reuse, and governance. Use an API center to develop and maintain a structured and organized inventory of your organization's APIs - regardless of their type, lifecycle stage, or deployment location - along with related information such as version details, API definition files, and common metadata. 

> [!TIP]
> You can get started quickly with Azure API Center by taking advantage of the Free plan, which has no time constraints. Compare the [Free plan and Standard plan limits](/azure/azure-resource-manager/management/azure-subscription-service-limits?toc=/azure/api-center/toc.json&bc=/azure/api-center/breadcrumb/toc.json#azure-api-center-limits).

By using an API center, stakeholders throughout your organization, including API program managers, IT administrators, application developers, and API developers can design, discover, reuse, and govern APIs.  

> [!NOTE]
> Azure API Center is a solution for design-time API governance and centralized API discovery. Azure also offers complementary services such as Azure API Management, a solution for runtime API governance and observability by using an API gateway. [Review the differences](/azure/api-center/frequently-asked-questions#what-s-the-difference-between-azure-api-management-and-azure-api-center) and see [how they can work together](/azure/api-center/frequently-asked-questions#how-do-i-use-azure-api-center-with-my-api-management-solution).

## Benefits

Azure API Center offers the following benefits:

- **Create and maintain an organizational inventory**: Build a **complete inventory of APIs** available in your organization. Register APIs managed in all your API management solutions, including Azure API Management and platforms from other providers. Also include your unmanaged APIs and APIs under development. Foster communication and let API program managers and developers collaborate for increased API reuse, quality, security, compliance, and developer productivity.​

- **Govern your organization's APIs**: Access more complete visibility into the APIs being developed and used within your organization. API program managers and IT administrators can govern this inventory to ensure it meets organizational standards by **defining custom metadata** and **analyzing API definitions** to enforce conformance to API style guidelines.​

- **Easy API discovery**: Promote API reuse to maximize developer productivity and ensure developers are using the right APIs. Azure API Center helps program managers and developers discover the API inventory and filter by using built-in and custom metadata. ​

- **Accelerate API consumption**: Maximize developer productivity when consuming APIs and ensure they're consumed in a secure manner consistent with organizational standards.

## Key capabilities

Create and use an API center for the following capabilities:

- **API inventory management**: Enable API developers and API program managers to register all of the organization's APIs for inclusion in a centralized inventory. They can use the Azure portal, the Azure CLI, developer tooling like CI/CD pipelines, and links to API sources like Azure API Management services. 

- **API design and development**: Allow developers to use the [Azure API Center extension for Visual Studio Code](build-register-apis-vscode-extension.md) to register APIs directly from the same development environment where they create their APIs and apps. 

   Developers can take advantage of the extension's integration with GitHub Copilot to [create API definitions from code](build-register-apis-vscode-extension.md#generate-openapi-spec-from-api-code) and GitHub Copilot for Azure to [design APIs with AI assistance](design-api-github-copilot-azure.md).  

- **Real-world API representation**: Add real-world information about each API including versions and definitions such as OpenAPI definitions. Create a list of API deployments and associate them with runtime environments, for example, represent Azure API Management or other API management solutions.

- **API governance**: Organize and filter APIs and related resources by using built-in and custom metadata, to help with API governance and discovery by API consumers. Set up [linting and analysis](enable-managed-api-analysis-linting.md) to enforce API definition quality. 

   API developers can shift-left API design conformance checks into Visual Studio Code by using integrated linting support and breaking change detection. Integrate with tools such as Dev Proxy to ensure apps don't use unregistered [shadow APIs](discover-shadow-apis-dev-proxy.md) or APIs that don't meet organizational standards.

- **API discovery and reuse**: Enable enterprise developers and API program managers to discover APIs through an [Azure API Center portal](set-up-api-center-portal.md). You can also enable the portal by using the [Azure API Center Visual Studio Code extension](enable-api-center-portal-vs-code-extension.md).

For more information about the entities you can manage and the capabilities in Azure API Center, see [Key concepts](key-concepts.md).

## Tiers and SKUs

Azure API Center is offered in a [Free plan and Standard plan](../azure-resource-manager/management/azure-subscription-service-limits.md?toc=/azure/api-center/toc.json&bc=/azure/api-center/breadcrumb/toc.json#azure-api-center-limits).

> [!NOTE]
> Azure API Center is also included free with Azure API Management Premium and Standard tiers.

## Available regions

Azure API Center is currently available in the following Azure regions:

* Australia East
* Canada Central
* Central India
* East US
* France Central
* Sweden Central
* UK South
* West Europe
             
## Azure API Center and the API ecosystem

Azure API Center can serve a key role in an organization's API ecosystem. Consider the hypothetical Contoso organization, which adopts an API-first strategy, emphasizing the importance of APIs in their software development and integration. 

Contoso's API developers, app developers, API program managers, and API managers collaborate through Azure API Center to develop and use the organization's API inventory. The following diagram and explanation demonstrates this scenario:

:::image type="content" source="media/overview/api-ecosystem-example.png" border="false" alt-text="Diagram showing Azure API Center in an example API ecosystem.":::

Contoso's API ecosystem includes the following features:

- **API development**: Contoso's developers regularly build ASP.NET web APIs. They also create Azure Functions with HTTP triggers.

- **API deployment environments**: Contoso deploys a portion of their APIs to Azure App Service. They deploy another subset of their APIs to an Azure Function app. 

- **Azure API Management**: Contoso uses the Azure [API Management](../api-management/api-management-key-concepts.md) service to manage, publish, and secure their APIs. They use separate instances for development, test, and production, each with a distinct name. 

- **Azure API Center**: Contoso adopts Azure API Center as their centralized hub for API discovery, governance, and consumption. Azure API Center serves as a structured and organized API hub that provides comprehensive information about all organizational APIs, maintaining related information including versions and associated deployments. 

## Related content

- [Create your API center (Azure portal)](set-up-api-center.md)