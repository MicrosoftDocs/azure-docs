---
title: Versions in Azure API Management | Microsoft Docs
description: Learn about the concept of versions in Azure API Management.
services: api-management
documentationcenter: ''
author: johndowns
 
ms.service: api-management
ms.topic: article
ms.date: 06/12/2020
ms.author: jodowns
ms.custom: fasttrack-new
---
# Versions in Azure API Management

Versions allow you to present groups of related APIs to your developers. You can use versions to handle breaking changes in your API safely. Clients can choose to use your new API version when they are ready, while existing clients can continue to use an older version. Versions are differentiated through a version identifier (which is any string value you choose), and a versioning scheme allows clients to identify which version of an API they want to use.

For most purposes, each API version can be considered its own independent API. Two different API versions might have different sets of operations and different policies.

With versions you can:

- Publish multiple versions of your API at the same time.
- Use a path, query string, or header to differentiate between versions.
- Use any string value you wish to identify your version, which could be a number, a date, or a name.
- Show your API versions grouped together on the developer portal.
- Take an existing, non-versioned, API and create a new version of it without breaking existing clients.

[Get started with versions by following our walkthrough.](./api-management-get-started-publish-versions.md)

## Versioning schemes

Different API developers have different requirements for versioning. Azure API Management doesn't prescribe a single approach to versioning, but instead provides several options.

### Path-based versioning

When the path versioning scheme is used, the version identifier needs to be included in the URL path for any API requests.

For example, `https://apis.contoso.com/products/v1` and `https://apis.contoso.com/products/v2` could refer to the same `products` API but to versions `v1` and `v2` respectively.

The format of an API request URL when using header-based versioning is: `https://{yourDomain}/{apiName}/{versionIdentifier}/{operationId}`.

### Header-based versioning

When the header versioning scheme is used, the version identifier needs to be included in an HTTP request header for any API requests. You can specify the name of the HTTP request header.

For example, you might create a custom header named `Api-Version`, and clients could specify `v1` or `v2` in the value of this header.

### Query string-based versioning

When the query string versioning scheme is used, the version identifier needs to be included in a query string parameter for any API requests. You can specify the name of the query string parameter.

The format of an API request URL when using query string-based versioning is: `https://{yourDomain}/{apiName}/{operationId}?{queryStringParameterName}={versionIdentifier}`.

For example, `https://apis.contoso.com/products?api-version=v1` and `https://apis.contoso.com/products/api-version=v2` could refer to the same `products` API but to versions `v1` and `v2` respectively.

## Original versions

If you add a version to a non-versioned API, an `Original` version will be automatically created and will respond on the default URL, without a version identifier specified. The `Original` version ensures that any existing callers are not broken by the process of adding a version. If you create a new API with versions enabled at the start, an `Original` version isn't created.

## How versions are represented

Azure API Management maintains a resource called a *version set*, which represents a set of versions for a single logical API. When you use the Azure portal to manage versions you don't see the version set, but if you interact with your API Management service using PowerShell, Resource Manager templates, or the Azure Resource Manager API, you can directly view and manage version sets. A version set contains the display name of the versioned API, as well as the [versioning scheme used](#versioning-schemes) to direct requests to specified versions.

Each version of an API is maintained as its own API resource, which is then associated with a version set. A version set might contain APIs with very different operations or policies, which reflects the fact that you might make significant changes between versions of your API.

### Migrating a non-versioned API to a versioned API

When you use the Azure portal to enable versioning on an existing API, the following changes are made to your API Management resources:

 * A new version set is created.
 * The existing version is maintained and [configured as the `Original` API version](#original-versions). The API is linked to the version set but doesn't require a version identifier to be specified.
 * The new version is created as a new API, and is linked to the version set. This new API must be accessed using the versioning scheme and identifier.
