---
title: Azure API Center (preview) - Key concepts
description: Key concepts of Azure API Center. API Center enables tracking APIs in a centralized location for discovery, reuse, and governance.
author: dlepow
editor: ''
 
ms.service: api-center
ms.topic: conceptual
ms.date: 10/31/2023
ms.author: danlep
ms.custom: 
---

# Azure API Center (preview) - key concepts

This article explains key concepts of [Azure API Center](overview.md). API Center enables tracking APIs in a centralized location for discovery, reuse, and governance.

[!INCLUDE [api-center-preview-feedback](includes/api-center-preview-feedback.md)]

## Data model

The following diagram shows the main entities in API Center and how they relate to each other. See the following sections for more information about each entity.

:::image type="content" source="media/key-concepts/api-center-data-model.png" alt-text="Diagram that shows the data model in API Center." border="false":::

### Highlighted relationships

1. **APIs** have **versions** and **deployments**.
1. Each **version** has **definitions**.
1. **Deployments** associate a **definition** with an **environment**.

## API

A top-level logical entity in API Center, an API represents any real-world API that you want to track. In API Center, you can include APIs of any type, including REST, GraphQL, gRPC, SOAP, WebSocket, and Webhook.

An API can be managed by any API management solution (such as Azure [API Management](../api-management/api-management-key-concepts.md) or solutions from other providers), or unmanaged.

## Environment

An environment represents a location where an API runtime could be deployed, for example, an Azure API Management service, an Apigee service, an AKS cluster, a Web App, or an Azure Function. Each environment has a type (such as production or staging) and may include information about developer portal or management interfaces.

## API version

API versioning is the practice of managing changes to an API and ensuring that these changes are made without disrupting clients. An API can have multiple versions across lifecycle stages, each aligned with specific API changes. Some versions may introduce major or breaking changes, while others add minor improvements. An API version can be at any lifecycle stage – from design, to preview, production, or deprecated. 

## API definition

Each API version may be defined with one or more definition files, such as an OpenAPI definition for a REST API. API Center allows any API definition file formatted as text (YAML, JSON, Markdown, and so on). You can upload OpenAPI, gRPC, GraphQL, AsyncAPI, WSDL, and WADL definitions, among others. API Center also supports importing API definitions from a URL.

## Deployment

A deployment is a location (an address) where users can access an API. An API can have multiple deployments, such as different staging environments or regions. For example, one deployment could be a staging Azure API Management service and a second deployment could be a production Azure API Management service. Each deployment is associated with a specific API definition.

In API Center, a deployment identifies a specific environment used for an API runtime. An API could have multiple deployments. 

## Metadata properties

In API Center, organize your APIs, deployments, and other entities by setting values of metadata properties, which can be used for search and filtering and to enforce governance standards. API Center provides several common built-in properties such as "API type" and "Version lifecycle". An API Center owner can augment the built-in properties by defining custom properties in a metadata schema to organize their APIs, deployments, and environments according to their organization's requirements. For example, create a *Line of business* property to identify the business unit that owns an API. 

API Center supports properties of type array, boolean, number, object, predefined choices, and string. 

API Center's metadata schema is compatible with JSON and YAML schema specifications, to allow for schema validation in developer tooling and automated pipelines.


## Next steps

* [Set up your API center](set-up-api-center.md)

