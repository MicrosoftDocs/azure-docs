---
title: Azure API Center (preview) - Overview
description: Introduction to key scenarios and capabilities of Azure API Center. API Center inventories an organization's APIs to promote API discovery and governance at scale.
author: dlepow
editor: ''
 
ms.service: api-center
ms.topic: overview
ms.date: 05/24/2023
ms.author: danlep
ms.custom: 
---

# What is Azure API Center (preview)?

API Center enables tracking all of your APIs in a centralized location for discovery, reuse, and governance. Use API Center to develop and maintain a structured and organized inventory of your organization's APIs - regardless of their type, lifecycle stage, or deployment location - along with related information such as version details, specification files, and common metadata. 

[!INCLUDE [api-center-preview-feedback](includes/api-center-preview-feedback.md)]

> [!NOTE]
> API Center is a solution for API inventory management. If you're looking for a solution to manage, secure, and publish your organization's API backends through a managed gateway, see the [Azure API Management](../api-management/api-management-key-concepts.md) service.

## Benefits

With API Center, stakeholders throughout your organization - including API program managers, application developers, and API developers - can discover, govern, and reuse APIs.  

* **API program managers**, usually IT or enterprise architects leading organizational API programs, who foster API reuse, quality, and compliance. API Center helps these users organize and manage the API inventory with common metadata and create workspaces for different teams.
* **Application developers**, including both professional developers and low-code/no-code developers, who discover and consume APIs to accelerate or enable development of applications. API Center helps these users find, understand, and get access to available APIs and reach the API developer teams who support them.
* **API developers**, who design, develop, document, and publish APIs that meet organizational standards and comply with industry regulations. API Center helps these users reduce duplication, boost adoption, and track their APIs throughout their lifecycles.  

## Key capabilities

In preview, create and use an API Center in the Azure portal for the following:

* **API inventory management** - Register all of your organization's APIs for inclusion in a centralized inventory.
* **Real-world API representation** - Add real-world information about each API including versions and specifications such as OpenAPI specifications. Connect to API deployment and management environments.
* **Metadata properties** - Organize and filter APIs and related information assets using built-in and custom metadata properties, to help with API governance and discoverability by API consumers.  
* **Workspaces** - Enable multiple teams to work independently in API Center by creating workspaces with permissions based on role-based access control.

For more information about the information assets and capabilities in API Center, see [Key concepts](key-concepts.md).

## Preview limitations

* In preview, API Center is only available in the following Azure regions:

    * East US 
    * East US 2 
    * Central US 
    * West US 2  
    * North Europe 
    * West Europe 
    * UK South     
    * Southeast Asia 
    * Central India 
    * Australia East 
    
## Frequently asked questions

### Q: How can I provide feedback about API Center?

### Q: Is API Center part of Azure API Management? 

A: API Center is a separate Azure service offering and doesn’t require an Azure API Management service to function. You can register all APIs in API Center, whether managed in Azure API Management or API management solutions from other providers. You can also register APIs that are unmanaged.

### Q: Is my data encrypted in API Center?

A: Yes, all data in API Center is encrypted at rest.

### Q: How can I provide feedback about API Center?

A: During preview, request features, report bugs, or provide feedback at this [GitHub repo](https://aka.ms/apicenter/preview/feedback).

## Next steps

> [!div class="nextstepaction"]
> [Get access to the preview](https://aka.ms/apicenter/joinpreview)


> [!div class="nextstepaction"]
> [Set up your API center](set-up-api-center.md)

