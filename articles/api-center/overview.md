---
title: Azure API Center - Overview
description: Introduction to key scenarios and capabilities of Azure API Center. API Center inventories an organization's APIs for discovery, reuse, and governance at scale.
author: dlepow
 
ms.service: api-center
ms.topic: overview
ms.date: 04/15/2024
ms.author: danlep 
ms.custom: references_regions
---

# What is Azure API Center?

Azure API Center enables tracking all of your APIs in a centralized location for discovery, reuse, and governance. Use an API center to develop and maintain a structured and organized inventory of your organization's APIs - regardless of their type, lifecycle stage, or deployment location - along with related information such as version details, API definition files, and common metadata. 

With an API center, stakeholders throughout your organization - including API program managers, IT administrators, application developers, and API developers - can discover, reuse, and govern APIs.  

> [!NOTE]
> Azure API Center is a solution for design-time API governance and centralized API discovery. Azure also offers the API Management service, a solution for runtime API governance and observability using an API gateway. [Learn more](frequently-asked-questions.yml#what-s-the-difference-between-azure-api-management-and-azure-api-center) about the differences and how Azure API Center and API Management can work together.

## Benefits

* **Create and maintain an organizational inventory​** - Organizations can build a **complete inventory of APIs** available in their organization. Foster communication and let API program managers and developers collaborate for increased API reuse, quality, security, compliance, and developer productivity.​

*  **Govern your organization's APIs** - With more complete visibility into the APIs being produced and used within an organization, API program managers and IT administrators can govern this inventory to ensure it meets organizational standards by **defining custom metadata** and **analyzing API definitions** to enforce conformance to API style guidelines.​

* **Easy API discovery** - Organizations want to promote API reuse to maximize developer productivity and ensure developers are using the right APIs. Azure API Center helps program managers and developers discover the API inventory and filter using built-in and custom metadata. ​

* **Accelerate API consumption** - Maximize developer productivity when consuming APIs and ensure they are consumed in a secure manner consistent with organizational standards. 

## Key capabilities

Create and use an API center for the following:

* **API inventory management** - Register all of your organization's APIs for inclusion in a centralized inventory.

* **Real-world API representation** - Add real-world information about each API including versions and definitions such as OpenAPI definitions. List API deployments and associate them with runtime environments, for example, representing Azure API Management or other API management solutions.

* **API governance** - Organize and filter APIs and related resources using built-in and custom metadata, to help with API governance and discovery by API consumers. Set up linting and analysis to enforce API definition quality.  

* **API discovery and reuse** - Enable developers and API program managers to discover APIs via the Azure portal, an API Center portal, and developer tools including a [Visual Studio Code extension](use-vscode-extension.md)​.

For more about the entities you can manage and the capabilities in Azure API Center, see [Key concepts](key-concepts.md).

## Available regions
Azure API Center is currently available in the following Azure regions:

* Australia East
* Central India
* East US
* UK South
* West Europe 

API Center is offered in a Free plan and a Standard plan. [Learn more](../azure-resource-manager/management/azure-subscription-service-limits.md?toc=/azure/api-center/toc.json&bc=/azure/api-center/breadcrumb/toc.json#api-center-limits).
             
## Azure API Center and the API ecosystem

Azure API Center can serve a key role in an organization's API ecosystem. Consider the hypothetical Contoso organization, which has adopted an API-first strategy, emphasizing the importance of APIs in their software development and integration. 

Contoso's API developers, app developers, API program managers, and API managers collaborate through Azure API Center to develop and use the organization's API inventory. See the following diagram and explanation.

:::image type="content" source="media/overview/api-ecosystem-example.png" alt-text="Diagram showing API Center in an example API ecosystem.":::

Contoso's API ecosystem includes the following:

* **API development** - Contoso's developers regularly build ASP.NET web APIs. They also create Azure Functions with HTTP triggers.

* **API deployment environments** - Contoso deploys a portion of their APIs to Azure App Service. Another subset of their APIs is deployed to an Azure Function app. 

* **Azure API Management** - Contoso uses the Azure [API Management](../api-management/api-management-key-concepts.md) service to manage, publish, and secure their APIs. They use separate instances for Development, Test, and Production, each with a distinct name: APIM-DEV, APIM-TEST and APIM-PROD. 

* **Azure API Center** - Contoso has adopted Azure API Center as their centralized hub for API discovery, governance, and consumption. API Center serves as a structured and organized API hub that provides comprehensive information about all organizational APIs, maintaining related information including versions and associated deployments. 

## Next steps

> [!div class="nextstepaction"]
> [Set up your API center - portal](set-up-api-center.md)

