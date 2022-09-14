---
title: Create serverless APIs using Azure Functions 
description: Describes how to use Azure Functions as the basis of a cohesive set of serverless APIs. 
ms.topic: conceptual
ms.date: 09/14/2022

---
# Serverless REST APIs using Azure Functions

Azure Functions is an essential compute service that you use to build serverless REST-based APIs. HTTP triggers expose REST endpoints that can be called by your clients, like browsers, mobile apps, and other backend services. With [native support for routes](functions-bindings-http-webhook-trigger.md#customize-the-http-endpoint), a single HTTP triggered function can expose a highly-functional REST API. Functions also provides its own basic key-based authorization scheme to help limit access only to specific clients. For more information, see [Azure Functions HTTP trigger](functions-bindings-http-webhook-trigger.md)

In some scenarios, you may need your API to support a more complex set of REST behaviors. For example, you may need to combine multiple HTTP function endpoints into a single API. You might also want to pass requests through to one or more backend REST-based services. Finally, your APIs might require a higher-degree of security that let you monetize its use.

Today, the recommended approach to build more complex and robust APIs based on your functions is to leverage the comprehensive API services provided by [Azure API Management](../api-management/api-management-key-concepts.md). 
API Management uses a policy-based model to let you control routing, security, and OpenAPI integration. It also supports advanced policies like rate limiting monetization. Previous versions of the Functions runtime used the legacy Functions Proxies feature.

[!INCLUDE [functions-legacy-proxies-deprecation](../../includes/functions-legacy-proxies-deprecation.md)]

## <a name="migration"></a>Moving from Functions Proxies to API Management

When moving from Functions Proxies to using API Mananagement, you must integrate your function app with an API Managment instane and then recreate your existing set of routings and other behaviors. The following section provides links to the relevant articles that help you succeed using API Management with Azure Functions. 

If you have challenges moving from Proxies or if Azure API Management doesn't address your specific scenarios, please create an issue in the [Azure Functions github repository](https://github.com/Azure/Azure-Functions), where the issue is tagged with the label `proxy-deprecation`. 

## API Management integration

API Management lets you import an existing function app. After import, each HTTP triggered function endpoint becomes an API that you can modify and manage. After import, you can also use API Management to generated an OpenAPI definition file for your APIs. During import, any endpoints with an `admin` [authorization level](functions-bindings-http-webhook-trigger.md#http-auth) are ignored. For more information about using API Management with Functions, see the following articles:

| Article | Description |
| --- | --- |
| [Expose serverless APIs from HTTP endpoints using Azure API Management](functions-openapi-definition.md) | Shows how to create a new API Management instance from an exsiting function app in the Azure portal. Supports all languages. |
| [Create serverless APIs in Visual Studio using Azure Functions and API Management integration](openapi-apim-integrate-visual-studio.md) | Shows how to use Visual Studio to create a C# project that leverages the [OpenAPI extension](https://github.com/Azure/azure-functions-openapi-extension). The OpenAPI extension lets you define your .NET APIs by applying attributes directly to your C# code. |
| [Quickstart: Create a new Azure API Management service instance by using the Azure portal](../api-management/get-started-create-service-instance.md) | Create a new API Management instance in the portal. After you create an API Management instance, you can connect it to your function app. Other non-portal creatation methods are supported. |
| [Import an Azure function app as an API in Azure API Management](../api-management/import-function-app-as-api.md) | Shows how to import an existing function app to expose existsing HTTP trigger endpoints as a managed API. This article supports both creating a new API and adding the endpoints to an existing managed API. |

After you have your function app endpoints exposed by using API Management, the following articles provide general information about how to manage your Functions-based APIs in the API Management instance.

| Article | Description |
| --- | --- |
| [Edit an API](../api-management/edit-api.md) | Shows you how to work with an existing API hosted in API Management. | 
| [Policies in Azure API Management](../api-management/api-management-howto-policies.md) | In API Management, publishers can change API behavior through configuration using policies. Policies are a collection of statements that are run sequentially on the request or response of an API. |
| [API Management policy reference](../api-management/api-management-policies.md) | Reference that details all supported API Management policies. |
| [API Management policy samples](/azure/api-management/policies/) | Helpful collection of samples using API Management policies in key scenarios. |

## Legacy Functions Proxies

The legacy [Functions Proxies feature](legacy-proxies.md) also provides a set of basic API functionality for version 3.x and older version of the Functions runtime. 

[!INCLUDE [functions-legacy-proxies-deprecation](../../includes/functions-legacy-proxies-deprecation.md)]

Some basic hints for how to perform equivalent tasks using API Management have been added to the [Functions Proxies article](legacy-proxies.md). We don't currently have documentation or tools to help you migrate an existing Functions Proxies implementation to API Management. 

## Next steps

> [!div class="nextstepaction"]
> [Expose serverless APIs from HTTP endpoints using Azure API Management](functions-openapi-definition.md)
