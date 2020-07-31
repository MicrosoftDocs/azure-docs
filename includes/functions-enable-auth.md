---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 04/21/2020
ms.author: glenga
---

#### Enable App Service Authentication/Authorization

The App Service platform lets you use Azure Active Directory (AAD) and several third-party identity providers to authenticate clients. You can use this strategy to implement custom authorization rules for your functions, and you can work with user information from your function code. To learn more, see [Authentication and authorization in Azure App Service](../articles/app-service/overview-authentication-authorization.md) and [Working with client identities](../articles/azure-functions/functions-bindings-http-webhook-trigger.md#working-with-client-identities).

#### Use Azure API Management (APIM) to authenticate requests

APIM provides a variety of API security options for incoming requests. To learn more, see [API Management authentication policies](../articles/api-management/api-management-authentication-policies.md). With APIM in place, you can configure your function app to accept requests only from the IP address of your APIM instance. To learn more, see [IP address restrictions](../articles/azure-functions/ip-addresses.md#ip-address-restrictions).
