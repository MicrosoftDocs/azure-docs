---
title: Azure API Management backends | Microsoft Docs
description: Learn about custom backends in API Management
services: api-management
documentationcenter: ''
author: dlepow
editor: ''

ms.service: api-management
ms.topic: article
ms.date: 01/29/2021
ms.author: apimpm 
ms.custom: devx-track-azurepowershell
---

# Backends in API Management

A *backend* (or *API backend*) in API Management is an HTTP service that implements your front-end API and its operations.

When importing certain APIs, API Management configures the API backend automatically. For example, API Management configures the backend when importing an [OpenAPI specification](import-api-from-oas.md), [SOAP API](import-soap-api.md), or Azure resources such as an HTTP-triggered [Azure Function App](import-function-app-as-api.md) or [Logic App](import-logic-app-as-api.md).

API Management also supports using other Azure resources such as a [Service Fabric cluster](how-to-configure-service-fabric-backend.md) or a custom service as an API backend. Using these custom backends requires extra configuration, for example, to authorize credentials of requests to the backend service and to define API operations. You configure and manage these backends in the Azure portal or using Azure APIs or tools.

After creating a backend, you can reference the backend URL in your APIs. Use the [`set-backend-service`](api-management-transformation-policies.md#SetBackendService) policy to redirect an incoming API request to the custom backend instead of the default backend for that API.

## Benefits of backends

A custom backend has several benefits, including:

* Abstracts information about the backend service, promoting reusability across APIs and improved governance  
* Easily used by configuring a transformation policy on an existing API
* Takes advantage of API Management functionality to maintain secrets in Azure Key Vault if [named values](api-management-howto-properties.md) are configured for header or query parameter authentication

## Next steps

* Set up a [Service Fabric backend](how-to-configure-service-fabric-backend.md) using the Azure portal.
* Backends can also be configured using the API Management [REST API](/rest/api/apimanagement), [Azure PowerShell](/powershell/module/az.apimanagement/new-azapimanagementbackend), or [Azure Resource Manager templates](../service-fabric/service-fabric-tutorial-deploy-api-management.md).

