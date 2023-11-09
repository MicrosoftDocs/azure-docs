---
title: Azure API Center (preview) - Overview
description: Introduction to key scenarios and capabilities of Azure API Center. API Center inventories an organization's APIs to promote API discovery, reuse, and governance at scale.
author: dlepow
editor: ''
 
ms.service: api-center
ms.topic: overview
ms.date: 09/19/2023
ms.author: danlep
ms.custom: references_regions
---

# What is Azure API Center (preview)?

API Center enables tracking all of your APIs in a centralized location for discovery, reuse, and governance. Use API Center to develop and maintain a structured and organized inventory of your organization's APIs - regardless of their type, lifecycle stage, or deployment location - along with related information such as version details, API definition files, and common metadata. 

[!INCLUDE [api-center-preview-feedback](includes/api-center-preview-feedback.md)]

> [!NOTE]
> API Center is a solution for API inventory management. If you're looking for a solution to manage, secure, and publish your organization's API backends through an API gateway, see the [Azure API Management](../api-management/api-management-key-concepts.md) service.

## Benefits

With API Center, stakeholders throughout your organization - including API program managers, application developers, and API developers - can discover, govern, and reuse APIs.  

* **API program managers**, usually IT or enterprise architects leading organizational API programs, who foster API reuse, quality, and compliance. API Center provides these users with a centralized inventory view of all APIs in the organization and information about those APIs, such as their deployments.
* **Application developers**, including both professional developers and low-code/no-code developers, who discover and consume APIs to accelerate or enable development of applications. API Center helps these users find, understand, and get access to available APIs and reach the API developer teams who support them.
* **API developers**, who design, develop, document, and publish APIs that meet organizational standards and comply with industry regulations. API Center helps these users reduce duplication, boost adoption, and track their APIs throughout their lifecycles.  

## Key capabilities

In preview, create and use an API Center in the Azure portal for the following:

* **API inventory management** - Register all of your organization's APIs for inclusion in a centralized inventory.
* **Real-world API representation** - Add real-world information about each API including versions and definitions such as OpenAPI definitions. List API deployments and associate them with runtime environments, for example representing API management solutions.
* **Metadata properties** - Organize and filter APIs and related resources using built-in and custom metadata properties, to help with API governance and discoverability by API consumers.  

For more information about the information you can manage and the capabilities in API Center, see [Key concepts](key-concepts.md).

## Available regions

* In preview, API Center is available in the following Azure regions:
   * Australia East
   * Central India
   * East US
   * UK South
   * West Europe 

               
## Frequently asked questions

### Q: Is API Center part of Azure API Management? 

A: API Center is a stand-alone Azure service that's complementary to Azure API Management and API management services from other providers. API Center provides a unified API inventory for all APIs in the organization, including APIs that don't run in API gateways (such as those that are still in design) and those that are managed with different API management solutions. 

### Q: Is my data encrypted in API Center?

A: Yes, all data in API Center is encrypted at rest.

## Next steps

> [!div class="nextstepaction"]
> [Set up your API center](set-up-api-center.md)

> [!div class="nextstepaction"]
> [Provide feedback](https://aka.ms/apicenter/preview/feedback)

