---
title: Azure API Center (preview) - Key concepts
description: Key concepts of Azure API Center. API Center enables tracking APIs in a centralized location for discovery, reuse, and governance.
author: dlepow
editor: ''
 
ms.service: api-center
ms.topic: conceptual
ms.date: 06/05/2023
ms.author: danlep
ms.custom: 
---

# Azure API Center (preview) - key concepts

This article goes into more detail about key concepts of [Azure API Center](overview.md). API Center enables tracking APIs in a centralized location for discovery, reuse, and governance.

[!INCLUDE [api-center-preview-feedback](includes/api-center-preview-feedback.md)]

## API

A top-level logical entity in API Center that represents any real-world API. API Center supports APIs of any type, including REST, GraphQL, gRPC, SOAP, WebSocket, and Webhook.

An API can be managed by any API management solution (such as Azure [API Management](../api-management/api-management-key-concepts.md) or solutions from other providers), or unmanaged.

## API version

APIs typically have multiple versions across lifecycle stages. In API Center, associate one or more versions with each API, aligned with specific API changes. Some versions may introduce major or breaking changes, while others add minor improvements. An API version can be at any lifecycle stage – from design, to preview, production, or deprecated. 

Each API version may be defined with a specification file, such as an OpenAPI definition for a REST API. API Center allows any specification file formatted as text (YAML, JSON, markdown, and so on). You can upload OpenAPI, gRPC, GraphQL, AsyncAPI, WSDL, and WADL specifications, among others.

## Environment

Use API Center to maintain information about your APIs' environments. An environment represents a location where an API runtime could be deployed, typically an API management platform, API gateway, or compute service. Each environment has a type (such as production or staging) and may include information about developer portal or management interfaces.

## Deployment

In API Center, a deployment identifies a specific environment used for the runtime of an API version. For example, an API version could have two deployments: a deployment in a staging Azure API Management service and a deployment in a production Azure API Management service.

## Metadata and metadata schema

In API Center, you organize your APIs and other assets by setting values of metadata properties, which can be used for searching and filtering and to enforce governance standards. API Center provides several common built-in properties such as "API type" and "Lifecycle". An API Center owner can augment the built-in properties by defining custom properties in a metadata schema to organize their APIs, deployments, and environments according to their organization's requirements. For example, create a *Line of business* property to identify the business unit that owns an API. 

API Center supports properties of type array, boolean, number, object, predefined choices, and string. 

API Center's metadata schema is compatible with JSON and YAML schema specifications, to allow for schema validation in developer tooling and automated pipelines.

## Workspace

To enable multiple teams to work independently in a single deployment, API Center provides workspaces. Similar to API Management [workspaces](../api-management/workspaces-overview.md), workspaces in API Center allow separate teams to access and manage a part of the API inventory. Access is controlled through Azure role-based access control (RBAC).

## Next steps

* [Set up your API center](set-up-api-center.md)

