---
title: Azure API Center - Key concepts
description: Key concepts of Azure API Center. API Center inventories an organization's APIs for discovery, reuse, and governance at scale.

ms.service: azure-api-center
ms.topic: conceptual
ms.date: 11/15/2024

---

# Azure API Center - key concepts

Explore the key concepts of [Azure API Center](overview.md), which lets you track APIs in a centralized location for discovery, reuse, and governance.

## Data model

The main entities in an Azure API Center configuration include your APIs and their versions, definitions, and deployments. The possible runtime environments for each API and descriptive metadata supplement the configuration.

The following diagram shows the main entities and how they relate to each other.

:::image type="content" source="media/key-concepts/api-center-data-model.png" border="false" alt-text="Diagram that shows the key features of the data model in Azure API Center.":::

## API

A top-level logical entity in Azure API Center, an API represents any real-world API that you want to track. An API center can include APIs of any type, including REST, GraphQL, gRPC, SOAP, WebSocket, and Webhook.

You can manage an API in the inventory by any API management solution. For example, use Azure [API Management](../api-management/api-management-key-concepts.md), Apigee API Management, Kong Konnect, MuleSoft API Management, or another platform. An API represented in Azure API Center can also be unmanaged.

API program managers or IT administrators can create and manage the API inventory in Azure API Center. Azure API Center also includes features for API developers to register API definitions directly from their development environments, such as Visual Studio Code or CI/CD pipelines.

## API version

API versioning is the practice of managing changes to an API and ensuring the changes are made without disrupting clients. An API can have multiple versions across lifecycle stages, each aligned with specific API changes. Some versions might introduce major or breaking changes, while others add minor improvements. An API version can be at any lifecycle stage from design, to preview, production, or deprecated. 

## API definition

There should be at least one definition for each API version, such as an OpenAPI definition for a REST API. Azure API Center allows any API definition file formatted as text (YAML, JSON, Markdown, and so on). You can upload OpenAPI, gRPC, GraphQL, AsyncAPI, WSDL, and WADL definitions, among others.

To help with API governance, Azure API Center provides linting capabilities to analyze API definitions for quality and compliance with organizational standards.

## Environment

An environment represents a location where an API runtime is deployable such as an Azure API Management service or an Apigee API Management service. You might also deploy to a compute service like a Kubernetes cluster, Web App, or Azure Functions app. Each environment is aligned with a lifecycle stage such as development, testing, staging, or production. An environment might also include information about developer portal or management interfaces. 

> [!NOTE]
> Use Azure API Center to track any of your API runtime environments, regardless of whether they're hosted on Azure infrastructure. These environments aren't the same as Azure Deployment Environments. 

## Deployment

A deployment is a location (an address) where users can access an API. An API can have multiple deployments, such as different staging environments or regions. For example, an API could have one deployment in an internal staging environment and a second in a production environment. Each deployment is associated with a specific API definition.

## Metadata 

In Azure API Center, organize your APIs, deployments, and other entities by setting metadata values. The metadata is useful for searching and filtering and enforcing governance standards. An API center provides several common built-in metadata properties such as `API type` and `lifecycle stage`. The API center owner can augment the built-in metadata by defining custom metadata in a metadata schema to organize their APIs, deployments, and environments. For example, create an `API approver` metadata property to identify the individual responsible for approving an API for use. 

Azure API Center supports custom metadata of type array, boolean, number, object, predefined choices, and string. 

Azure API Center's metadata schema is compatible with JSON and YAML schema specifications, to allow for schema validation in developer tooling and automated pipelines.

## Related content

- [What is Azure API Center?](overview.md)
- [Metadata for API governance](metadata.md)
- [API analysis and linting](enable-managed-api-analysis-linting.md)