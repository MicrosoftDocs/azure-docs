---
title: Azure API Management terminology | Microsoft Docs
description: This article gives definitions for the terms that are specific to API Management.
services: api-management
documentationcenter: ''
author: dlepow
manager: cfowler
editor: ''

ms.service: api-management
ms.workload: integration
ms.topic: article
ms.date: 05/09/2022
ms.author: danlep
---

# Azure API Management terminology

This article gives definitions for the terms that are specific to Azure API Management.

## Term definitions

-   **Backend API** - A service, most commonly HTTP-based, that implements an API and its operations. Sometimes backend APIs are referred to simply as backends. For more information, see [Backends](backends.md).
-   **Frontend API** - API Management serves as mediation layer over the backend APIs. Frontend API is an API that is exposed to API consumers from API Management. You can customize the shape and behavior of a frontend API in API Management without making changes to the backend API(s) that it represents. Sometimes frontend APIs are referred to simply as APIs. For more information, see [Import and publish an API](import-and-publish.md).
-   **Product** - A product is a bundle of frontend APIs that can be made available to a specified group of API consumers for self-service onboarding under a single access credential and a set of usage limits. An API can be part of multiple products. For more information, see [Create and publish a product](api-management-howto-add-products.md).
-   **API operation** - A frontend API in API Management can define multiple operations. An operation is a combination of an HTTP verb and a URL template uniquely resolvable within the frontend API. Often operations map one-to-one to backend API endpoints. For more information, see [Mock API responses](mock-api-responses.md).
-   **Version** - A version is a distinct variant of existing frontend API that differs in shape or behavior from the original. Versions give customers a choice of sticking with the original API or upgrading to a new version at the time of their choosing. Versions are a mechanism for releasing breaking changes without impacting API consumers. For more information, see [Publish multiple versions of your API](api-management-get-started-publish-versions.md).
-   **Revision** - A revision is a copy of an existing API that can be changed without impacting API consumers and swapped with the version currently in use by consumers usually after validation and testing. Revisions provide a mechanism for safely implementing nonbreaking changes. For more information, see [Use revisions](api-management-get-started-revise-api.md).
-   **Policy** - A policy is a reusable and composable component, implementing some commonly used API-related functionality. API Management offers over 50 built-in policies that take care of critical but undifferentiated horizontal concerns - for example, request transformation, routing, security, protection, caching. The policies can be applied at various scopes, which determine the affected APIs or operations and dynamically configured using policy expressions. For more information, see [Policies in Azure API Management](api-management-howto-policies.md).
-   **Developer portal** - The developer portal is a component of API Management. It provides a customizable experience for API discovery and self-service onboarding to API consumers. For more information, see [Customize the Developer portal](api-management-customize-styles.md).

## Next steps

> [!div class="nextstepaction"]
> 
> [Create an instance](get-started-create-service-instance.md)
