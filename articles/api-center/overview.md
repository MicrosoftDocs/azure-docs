---
title: Azure API Center (preview) - Overview
description: Introduction to key scenarios and capabilities of Azure API Center. API Center inventories an organization's APIs for discovery, reuse, and governance at scale.
author: dlepow
 
ms.service: api-center
ms.topic: overview
ms.date: 11/07/2023
ms.author: danlep 
ms.custom: references_regions
---

# What is Azure API Center (preview)?

API Center enables tracking all of your APIs in a centralized location for discovery, reuse, and governance. Use API Center to develop and maintain a structured and organized inventory of your organization's APIs - regardless of their type, lifecycle stage, or deployment location - along with related information such as version details, API definition files, and common metadata. 

With API Center, stakeholders throughout your organization - including API program managers, IT administrators, application developers, and API developers - can discover, reuse, and govern APIs.  

[!INCLUDE [api-center-preview-feedback](includes/api-center-preview-feedback.md)]

> [!NOTE]
> API Center is a solution for organizations to catalog and manage their API inventory. Azure also offers the API Management service, a solution to manage, secure, and publish your organization's API backends through an API gateway. [Learn more](#q-whats-the-difference-between-azure-api-management-and-azure-api-center) about the difference.

## Benefits

* **Create and maintain an organizational inventory​** - Organizations can build a **complete inventory of APIs** available in their organization. Foster communication and let API program managers and developers collaborate for increased API reuse, quality, security, compliance, and developer productivity.​

*  **Govern your organization's APIs** - With more complete visibility into the APIs being produced and used within an organization, API program managers and IT administrators can govern this inventory to ensure it meets organizational standards by **defining custom metadata** to enforce governance.​

* **Easy API discovery** - Organizations want to promote API reuse to maximize developer productivity and ensure developers are using the right APIs. API Center helps program managers and developers  discover the API inventory and filter using built-in and custom metadata properties. ​

* **Accelerate API consumption** - Maximize developer productivity when consuming APIs and ensure they are consumed in a secure manner consistent with organizational standards. 

## Key capabilities

In preview, create and use an API center in the Azure portal for the following:

* **API inventory management** - Register all of your organization's APIs for inclusion in a centralized inventory.

* **Real-world API representation** - Add real-world information about each API including versions and definitions such as OpenAPI definitions. List API deployments and associate them with runtime environments, for example representing Azure API Management or other API management solutions.

* **Metadata properties** - Organize and filter APIs and related resources using built-in and custom metadata properties, to help with API governance and discovery by API consumers.  

For more information about the information you can manage and the capabilities in API Center, see [Key concepts](key-concepts.md).

## Available regions

API Center is currently available in the following Azure regions:

* Australia East
* Central India
* East US
* UK South
* West Europe 
             
## API Center and the API ecosystem

API Center can serve a key role in an organization's API ecosystem. Consider the hypothetical Contoso organization, which has adopted an API-first strategy, emphasizing the importance of APIs in their software development and integration. 

Contoso's API developers, app developers, API program managers, and API managers collaborate through Azure API Center to develop and use the organization's API inventory. See the following diagram and explanation.

:::image type="content" source="media/overview/api-ecosystem-example.png" alt-text="Diagram showing API Center in an example API ecosystem.":::

Contoso's API ecosystem includes the following:

* **API development** - Contoso's developers regularly build ASP.NET web APIs. They also create Azure Functions with HTTP triggers.

* **API deployment environments** - Contoso deploys a portion of their APIs to Azure App Service. Another subset of their APIs is deployed to an Azure Function app. 

* **API management** - Contoso uses Azure API Management to manage, publish, and secure their APIs. They use separate instances for Development, Test, and Production, each with a distinct name: APIM-DEV, APIM-TEST and APIM-PROD. 

* **API Center** - Contoso has adopted Azure API Center as their centralized hub for API discovery, governance, and consumption. API Center serves as a structured and organized API hub that provides comprehensive information about all organizational APIs, maintaining related information including versions and associated deployments. 

## Frequently asked questions

### Q: What's the difference between Azure API Management and Azure API Center? 

A: [Azure API Management](../api-management/api-management-key-concepts.md) is a fully managed Azure service that helps organizations to securely expose their APIs to external and internal customers. It provides a set of tools and services for creating, publishing, and managing APIs, as well as enforcing security, scaling, and monitoring API usage. 

On the other hand, Azure API Center helps organizations create a catalog of APIs that are available within the organization. Azure API Center provides basic information about the APIs, such as their name, description, and version, but additional information can be added to these APIs using custom metadata. Azure API Center helps different stakeholders like API managers or API developers to discover and reuse existing APIs within the organization.  

While both services provide tools for governing APIs, they serve different purposes. Azure API Management is a platform for creating, publishing, and managing APIs, while API Center provides a centralized location for discovering and reusing existing APIs within an organization. 


### Q: How do I use API Center with my API Management solution? 

A: API Center is a stand-alone Azure service that's complementary to Azure API Management and API management services from other providers. API Center provides a unified API inventory for all APIs in the organization, including APIs that don't run in API gateways (such as those that are still in design) and those that are managed with different API management solutions.

For APIs that are managed using an API management solution, API Center can store metadata such as the runtime environment and deployment details. 

### Q: Is my data encrypted in API Center?

A: Yes, all data in API Center is encrypted at rest.

## Next steps

> [!div class="nextstepaction"]
> [Set up your API center](set-up-api-center.md)

