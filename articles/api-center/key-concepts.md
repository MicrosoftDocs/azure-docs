---
title: Azure API Center - Key concepts
description: Key concepts of Azure API Center. API Center inventories an organization's APIs for discovery, reuse, and governance at scale.
author: dlepow
ms.service: api-center
ms.topic: conceptual
ms.date: 04/23/2024
ms.author: danlep
---

# Azure API Center - key concepts

This article explains key concepts of [Azure API Center](overview.md). Azure API Center enables tracking APIs in a centralized location for discovery, reuse, and governance.

## Data model

The following diagram shows the main entities in Azure API Center and how they relate to each other. See the following sections for more information about these entities and related concepts.

:::image type="content" source="media/key-concepts/api-center-data-model.png" alt-text="Diagram that shows key features of the data model in Azure API Center." border="true":::

## API

A top-level logical entity in Azure API Center, an API represents any real-world API that you want to track. An API center can include APIs of any type, including REST, GraphQL, gRPC, SOAP, WebSocket, and Webhook.

An API can be managed by any API management solution (such as Azure [API Management](../api-management/api-management-key-concepts.md) or solutions from other providers), or unmanaged.

The API inventory in Azure API Center is designed to be created and managed by API program managers or IT administrators. 

## API version

API versioning is the practice of managing changes to an API and ensuring that these changes are made without disrupting clients. An API can have multiple versions across lifecycle stages, each aligned with specific API changes. Some versions may introduce major or breaking changes, while others add minor improvements. An API version can be at any lifecycle stage – from design, to preview, production, or deprecated. 

## API definition

Each API version should ideally be defined by at least one definition, such as an OpenAPI definition for a REST API. Azure API Center allows any API definition file formatted as text (YAML, JSON, Markdown, and so on). You can upload OpenAPI, gRPC, GraphQL, AsyncAPI, WSDL, and WADL definitions, among others.

## Environment

An environment represents a location where an API runtime could be deployed, for example, an Azure API Management service, an Apigee API Management service, or a compute service such as a Kubernetes cluster, a Web App, or an Azure Function. Each environment is aligned with a lifecycle stage such as development, testing, staging, or production. An environment may also include information about developer portal or management interfaces. 

> [!NOTE]
> Use Azure API Center to track any of your API runtime environments, whether or not they're hosted on Azure infrastructure. These environments aren't the same as Azure Deployment Environments. 

## Deployment

A deployment is a location (an address) where users can access an API. An API can have multiple deployments, such as different staging environments or regions. For example, an API could have one deployment in an internal staging environment and a second in a production environment. Each deployment is associated with a specific API definition.

## Metadata 

In Azure API Center, organize your APIs, deployments, and other entities by setting metadata values, which can be used for search and filtering and to enforce governance standards. An API center provides several common built-in metadata properties such as "API type" and "lifecycle stage". The API center owner can augment the built-in metadata by defining custom metadata in a metadata schema to organize their APIs, deployments, and environments. For example, create an *API approver* property to identify the individual responsible for approving an API for use. 

Azure API Center supports custom metadata of type array, boolean, number, object, predefined choices, and string. 

Azure API Center's metadata schema is compatible with JSON and YAML schema specifications, to allow for schema validation in developer tooling and automated pipelines.


## Related content

* [What is Azure API Center?](overview.md)
* [Metadata for API governance](metadata.md)

