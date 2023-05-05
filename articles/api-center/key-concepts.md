---
title: Azure API Center (Preview) - Key concepts
description: Key concepts of Azure API Center. API Center inventories an organization's APIs to promote API discovery and governance at scale.
author: dlepow
editor: ''
 
ms.service: api-center
ms.topic: conceptual
ms.date: 05/05/2023
ms.author: danlep
ms.custom: 
---

# Azure API Center (Preview) - key concepts

This article goes into more detail about key concepts of [Azure API Center](overview.md).

## API

A top-level logical entity in API Center that represents any real-world API:
* Any type (REST, GraphQL, gRPC, and so on)
* Any lifecycle stage (such as design, development, or production)
* In any deployment location (Azure or other clouds, on-premises)
* Managed by any API management solution (such as Azure [API Management](../api-management/api-management-key-concepts.md) or solutions from other providers), or unmanaged

## API version

In API Center, you can associate one or more versions with each API, aligned with specific API changes. APIs typically have multiple versions across lifecycle stages. Some versions may introduce major or breaking changes, while others add minor improvements. An API version can be at any lifecycle stage – from design, to preview, production, or deprecated. 

Each API version may be defined with a specification file, such as an OpenAPI definition for a REST API.

## Environment

Use API Center to maintain information about your APIs' environments. An environment represents a location where an API runtime could be deployed, typically an API management platform, API gateway, or compute service. Environments have a type (such as production or staging) and may include links to developer portal or management interfaces.

## Deployment

In API Center, a deployment identifies a specific environment used for the runtime of an API version. For example, an API version could have two deployments: a deployment in a staging Azure API Management service and a deployment in a production Azure API Management service.

## Metadata schema

Each API Center provides a metadata schema to organize and structure assets using common properties. Metadata properties can be used for searching and filtering and to enforce governance standards. API Center natively provides several common metadata properties such as "API type"; others can be custom-defined. For example, define a simple "Line of business" property of type string, or a complex property represented with an object. Apply properties when creating or updating assets in API Center.

API Center's metadata schema is compatible with JSON and YAML schema specifications, to allow for schema validation in developer tooling and automated pipelines.

## Workspace

To enable multiple teams to work independently in a single deployment, API Center provides workspaces. Like API Management [workspaces](../api-management/workspaces-overview.md), workspaces in API Center provide access to certain assets that only the workspace collaborators access and manage. Access is controlled through Azure role-based access control (RBAC).

## Next steps
<!-- Link to quickstart when available -->

Learn more about [API Center](overview.md)

