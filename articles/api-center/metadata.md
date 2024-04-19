---
title: Use metadata to organize and govern APIs
description: Learn about metadata properties in Azure API Center. Use predefined and custom metadata properties to organize your inventory and enforce governance standards.
author: dlepow
ms.service: api-center
ms.topic: concept-article
ms.date: 04/19/2024
ms.author: danlep
#customer intent: As an API program manager, I want to learn about using metadata properties to govern the APIs in my API center.
---

# Create and apply metadata properties

This article provides background about metadata and how to use it for API governance in [Azure API Center](overview.md). You set metadata properties to organize and filter APIs and other [entities](key-concepts.md) in your API center. Metadata properties can be predefined or custom, and you can develop a metadata schema to enforce consistency across your APIs, environments, and deployments.  


## Predefined metadata properties

When creating or updating APIs, environments, and deployments in your API center, you set certain predefined properties, such as the API type (REST, WSDL, and so on).

The following tables list common predefined metadata properties that are provided for Azure API Center entities. For details, see the [API Center REST API reference](/rest/api/resource-manager/apicenter/operation-groups). Tables don't include standard Azure properties such as resource identifiers, display titles, and descriptions. Not all properties are required.

### APIs

| Property | Description | Example values |
|--------|----------|-------------|
| kind|  kind (type) of API | REST, SOAP, GraphQL |
| lifecycle stage  | stage of the API development lifecycle | design, development |
| license | license information for the API |  SPDX identifier, link to license text |
| external documentation | site for external documentation for the API | URL pointing to documentation | 
| contact information | points of contact for the API | email address, name, URL |
| terms of service | terms of service for the API | URL pointing to terms of service |

### Environments

| Property | Description | Example values |
|--------|----------|-------------|
| kind | kind (type) of environment | production, staging, development |
| server |  server information of the environment   |  type and URL pointing to the environment server   |
| server type |   type of environment server   | API Management server, Kubernetes server, Apigee server    |
| onboarding | onboarding information for the environment | instructions and URL pointing to environment's developer portal |

### Deployments

| Property | Description | Example values |
|--------|----------|-------------|
| server | server information of the deployment | URL pointing to the deployment server |
| state | state of the deployment | active, inactive |


## Custom metadata properties

Define custom metadata properties using the [Azure portal](add-metadata-properties.md), the Azure API Center [REST API](/rest/api/resource-manager/apicenter/metadata-schemas), or the [Azure CLI](/cli/azure/apic/metadata-schema) to help organize and filter APIs, environments, and deployments in your API center. Azure API Center supports custom metadata properties of the following types. 

Type | Description | Example property name |
|--------|----------|-------------|
| boolean | true or false | *IsInternal* |
| number | numeric value | *YearOfCreation*  |
| string | text value | *GitHubRepository* |
| array | list of values | *Tags* |
| predefined choice | predefined list of choices | *Department* |
| object | complex object composed of multiple subproperties | *APIApprover* |

[!INCLUDE [metadata-sensitive-data](includes/metadata-sensitive-data.md)]

### Assign metadata properties to entities

Custom metadata properties can be assigned to APIs, environments, or deployments in your API center. For example, create and assign a *Department* property to APIs, so that when an API is registered or a new API version is added, the department responsible for the API is specified. 

If assigned to an entity, a property is either optional or required. For example, you might require that the *Department* property is set only for APIs, but allow a *YearOfCreation* property to be an optional property for environments.

## Use metadata properties for governance

Use predefined and custom metadata properties to organize your APIs, environments, and deployments in your API center. For example:

* Enforce governance standards in your organization by requiring certain metadata properties to be set for APIs, environments, and deployments.

* Search and filter APIs in your API center by metadata properties. You can filter directly on the APIs page in the Azure portal, or use the Azure API Center REST API or Azure CLI to query APIs based on metadata properties.

    :::image type="content" source="media/metadata/filter-on-properties.png" alt-text="Screenshot of filtering APIs in the portal." lightbox="media/metadata/filter-on-properties.png":::

* Use schema validation tools to ensure that metadata properties are set correctly when APIs are registered or updated, particularly when using automated pipelines.


## Related content

* [What is Azure API Center?](overview.md)
* [API Center - key concepts](key-concepts.md)
* [Tutorial: Add custom metadata properties](add-metadata-properties.md)

