---
title: Azure API Management backends | Microsoft Docs
description: Learn about custom backends in API Management
services: api-management
documentationcenter: ''
author: dlepow
editor: ''

ms.service: api-management
ms.topic: article
ms.date: 09/21/2021
ms.author: danlep 
ms.custom: devx-track-azurepowershell
---

# Backends in API Management

A *backend* (or *API backend*) in API Management is an HTTP service that implements your front-end API and its operations.

When importing certain APIs, API Management configures the API backend automatically. For example, API Management configures the backend when importing:
* An [OpenAPI specification](import-api-from-oas.md).
* A [SOAP API](import-soap-api.md).
* Azure resources, such as an HTTP-triggered [Azure Function App](import-function-app-as-api.md) or [Logic App](import-logic-app-as-api.md).

API Management also supports using other Azure resources as an API backend, such as:
* A [Service Fabric cluster](how-to-configure-service-fabric-backend.md).
* A custom service. 

Custom backends require extra configuration to authorize the credentials of requests to the backend service and define API operations. Configure and manage custom backends in the Azure portal, or using Azure APIs or tools.

After creating a backend, you can reference the backend in your APIs. Use the [`set-backend-service`](set-backend-service-policy.md) policy to redirect an incoming API request to the custom backend instead of the default backend for that API.

> [!NOTE]
> When you use the `set-backend-service` policy to redirect requests to a custom backend, refer to the backend by its name (`backend-id`), not by its URL.

## Benefits of backends

A custom backend has several benefits, including:

* Abstracts information about the backend service, promoting reusability across APIs and improved governance.  
* Easily used by configuring a transformation policy on an existing API.
* Takes advantage of API Management functionality to maintain secrets in Azure Key Vault if [named values](api-management-howto-properties.md) are configured for header or query parameter authentication.

## Limitation

For **Developer** and **Premium** tiers, an API Management instance deployed in an [internal virtual network](api-management-using-with-internal-vnet.md) can throw HTTP 500 `BackendConnectionFailure` errors when the gateway endpoint URL and backend URL are the same. If you encounter this limitation, follow the instructions in the [Self-Chained API Management request limitation in internal virtual network mode](https://techcommunity.microsoft.com/t5/azure-paas-blog/self-chained-apim-request-limitation-in-internal-virtual-network/ba-p/1940417) article in the Tech Community blog. 

## Next steps

* Set up a [Service Fabric backend](how-to-configure-service-fabric-backend.md) using the Azure portal.
* Backends can also be configured using the API Management [REST API](/rest/api/apimanagement), [Azure PowerShell](/powershell/module/az.apimanagement/new-azapimanagementbackend), or [Azure Resource Manager templates](../service-fabric/service-fabric-tutorial-deploy-api-management.md).

