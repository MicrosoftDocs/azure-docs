---
title: Use metadata to organize and govern APIs
description: Learn about metadata in Azure API Center. Use built in and custom metadata to organize your inventory and enforce governance standards.
author: dlepow
ms.service: api-center
ms.topic: concept-article
ms.date: 04/19/2024
ms.author: danlep
#customer intent: As an API program manager, I want to learn about using metadata to govern the APIs in my API center.
---

# Use metadata for API governance 

This article provides background about metadata and how to use it for API governance in [Azure API Center](overview.md). You define and set metadata to organize and filter APIs and other [entities](key-concepts.md) in your API center. Metadata can be built in or custom, and you can develop a metadata schema to enforce consistency across your APIs, environments, and deployments.  

## Built-in metadata

When creating or updating APIs, environments, and deployments in your API center, you set certain built-in metadata properties, such as the API type (REST, WSDL, and so on).

The following tables list built-in metadata provided for Azure API Center entities. For details, see the [API Center REST API reference](/rest/api/resource-manager/apicenter/operation-groups). Tables don't include standard Azure properties such as resource identifiers, display titles, and descriptions. Not all properties are required.

### APIs

| Metadata | Description | Example values |
|--------|----------|-------------|
| kind|  kind (type) of API | REST, SOAP, GraphQL |
| lifecycle stage  | stage of the API development lifecycle | design, development |
| license | license information for the API |  SPDX identifier, link to license text |
| external documentation | site for external documentation for the API | URL pointing to documentation | 
| contact information | points of contact for the API | email address, name, URL |
| terms of service | terms of service for the API | URL pointing to terms of service |

### Environments

| Metadata | Description | Example values |
|--------|----------|-------------|
| kind | kind (type) of environment | production, staging, development |
| server |  server information of the environment   |  type and URL pointing to the environment server   |
| server type |   type of environment server   | API Management server, Kubernetes server, Apigee server    |
| onboarding | onboarding information for the environment | instructions and URL pointing to environment's developer portal |

### Deployments

| Metadata | Description | Example values |
|--------|----------|-------------|
| server | server information of the deployment | URL pointing to the deployment server |
| state | state of the deployment | active, inactive |


## Custom metadata

Define custom metadata using the [Azure portal](add-metadata-properties.md), the Azure API Center [REST API](/rest/api/resource-manager/apicenter/metadata-schemas), or the [Azure CLI](/cli/azure/apic/metadata) to help organize and filter APIs, environments, and deployments in your API center. Azure API Center supports custom metadata of the following types. 

Type | Description | Example name |
|--------|----------|-------------|
| boolean | true or false | *IsInternal* |
| number | numeric value | *YearOfCreation*  |
| string | text value | *GitHubRepository* |
| array | list of values | *Tags* |
| built-in choice | built-in list of choices | *Department* |
| object | complex object composed of multiple types | *APIApprover* |

[!INCLUDE [metadata-sensitive-data](includes/metadata-sensitive-data.md)]

### Assign metadata to entities

Custom metadata properties can be assigned to APIs, environments, or deployments in your API center. For example, define and assign *Department* metadata to APIs, so that when an API is registered or a new API version is added, the department responsible for the API is specified. 

If assigned to an entity, metadata is either optional or required. For example, you might require that the *Department* metadata is set only for APIs, but allow *YearOfCreation* to be optional metadata for environments.

> [!NOTE]
> * Define custom metadata at any time and apply to APIs and other entities in your API center. 
> * After defining custom metadata, you can change its assignment to an entity, for example from required to optional for APIs.
> * You can change metadata values, but you can't delete or change the type of custom metadata that is currently set in APIs, environments, and deployments. Unassign the custom metadata from the entities first, and then you can delete or change them.

## Use metadata for governance

Use built-in and custom metadata to organize your APIs, environments, and deployments in your API center. For example:

* Enforce governance standards in your organization by requiring certain metadata to be set for APIs, environments, and deployments.

* Search and filter APIs in your API center by metadata values. You can filter directly on the APIs page in the Azure portal, or use the Azure API Center REST API or Azure CLI to query APIs based on values of certain metadata.

    :::image type="content" source="media/metadata/filter-on-properties.png" alt-text="Screenshot of filtering APIs in the portal." lightbox="media/metadata/filter-on-properties.png":::

## Related content

* [What is Azure API Center?](overview.md)
* [API Center - key concepts](key-concepts.md)
* [Tutorial: Define custom metadata](add-metadata-properties.md)

