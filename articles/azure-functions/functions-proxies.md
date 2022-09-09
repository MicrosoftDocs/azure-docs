---
title: Create serverless APIs using Azure Functions 
description: Describes how to use Azure Functions as the basis of a cohesive set of serverless APIs. 
ms.topic: conceptual
ms.date: 09/07/2022

---
# Serverless REST APIs using Azure Functions

Azure Functions is an essential compute service that you use to build serverless REST-based APIs. HTTP triggers expose REST endpoints that can be called by your clients, like browsers, mobile apps, and other backend services. With [native support for routes](functions-bindings-http-webhook-trigger.md#customize-the-http-endpoint), a single HTTP triggered function can expose a highly functional REST API. Functions even natively provides a basic key-based authorization scheme to help limit access only to specific clients. For more information, see [Azure Functions HTTP trigger](functions-bindings-http-webhook-trigger.md)

In some scenarios, you may need your API to support a more complex set of REST behaviors. For example, you may need to combine more multiple HTTP triggered functions into a single API. You might also want to pass requests through to one or more backend REST-based services. Finally, you might want to implement a higher-degree of security for your API and potentially monetize its use.

The recommend approach to build more complex and robust APIs based on your functions is to leverage the comprehensive API services provided by [Azure API Management](../api-management/api-management-key-concepts.md). The legacy [Functions Proxies feature](legacy-proxies.md) also provided a subset of these features for version 3.x and older version of the Functions runtime. The following table compares API Management with the legacy Proxies feature:

| | API Management | Functions proxies |
| --- | --- | --- |
| Runtime versions | All | v1.x-v3.x<br/>v4.x (legacy-only)  |  
| Hosting | API Management  | Functions| 

Azure Functions proxies 

We are no longer investing in Azure Functions proxy support and strongly recommend customers to Azure API Management (in premium or consumption tier) when building API's with Azure Functions. It provides the same capabilities as Functions Proxies as well as other tools for defining, securing, and maintaining APIs, such as OpenAPI integration, rate limiting, and advanced policies. The key reason for this decision is to avoid duplication of functionality and provide a richer set of capabilities as detailed in [Azure APIM](https://docs.microsoft.com/en-us/azure/api-management/). 

This article has basic pointers on migrating to APIM, however we are fully aware that it is not exhaustive and would be interested to learn more if Azure API Management does not fit your scenarios or if you have challenges. Please fill out this survey OR create issues on <github repo> so we can build seamless integration experiences.

This article explains how to configure and work with Azure Functions Proxies. With this feature, you can specify endpoints on your function app that are implemented by another resource. You can use these proxies to break a large API into multiple function apps (as in a microservice architecture), while still presenting a single API surface for clients.

Standard Functions billing applies to proxy executions. For more information, see [Azure Functions pricing](https://azure.microsoft.com/pricing/details/functions/).

> [!NOTE] 
> Proxies is available in Azure Functions [versions](./functions-versions.md) 1.x to 3.x. In general, you will need to upgrade your Function applications to the 4.x host runtime by December 13th, 2022 due to EOL support. See more [here], so migrating to using API Management will ensure your applications are continued to be supported. Only for cases where migration is absolutely not possible, we are adding proxy support back in Functions 4.x, so your applications can keep running without disruption.


## Next steps
