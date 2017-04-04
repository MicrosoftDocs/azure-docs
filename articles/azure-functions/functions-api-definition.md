---
title: OpenAPI Metadata in Azure Functions | Microsoft Docs
description: Overview of OpenAPI support in Azure Functions
services: functions
documentationcenter: ''
author: alexkarcher-msft
manager: erikre
editor: ''

ms.assetid:
ms.service: functions
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: multiple
ms.topic: article
ms.date: 03/23/2017
ms.author: alkarche

---
# OpenAPI 2.0 (Swagger) Metadata support in Azure Functions (Preview)
This preview feature allows you to write an OpenAPI 2.0 (Swagger) definition inside a Function App, and host that file using the Function App.

[!INCLUDE [intro](../../includes/functions-bindings-intro.md)]

### What is OpenAPI (Swagger) metadata?
[Swagger Metadata](http://swagger.io/) allows a function hosting a REST API to be consumed by a wide variety of other software. From 1st party offerings like PowerApps and [API Apps](https://docs.microsoft.com/azure/app-service-api/app-service-api-dotnet-get-started#a-idcodegena-generate-client-code-for-the-data-tier), to 3rd party developer tooling like [Postman](https://www.getpostman.com/docs/importing_swagger), and [many more packages](http://swagger.io/tools/).

>[!TIP]
>We recommend starting with the [getting started tutorial](./functions-api-definition-getting-started.md) and then returning to this document if you want to learn more about specific features.

## <a name="enable"></a>Enabling OpenAPI definition Support
* All OpenAPI settings can be configured in the `API Definition (preview)` page below your Function App settings.
* The `Swagger Source` toggle can be set to `Internal` to enable a hosted OpenAPI (Swagger) definition and quickstart definition generation.
  * The `External` Swagger source setting allows your Function to use an OpenAPI definition that is hosted elsewhere.

## <a name="generate-defintion"></a>Generate a Swagger Skeleton from your Function Metadata
A template is an awesome way to get started if it's your first time writing a Swagger file. The definition template feature creates a sparse Swagger document using all the metadata in the function.json for each of your HTTP trigger functions. You can fill in more information about your API from the [Swagger specification](http://swagger.io/specification/), such as request and response templates and additional security definitions.

[Check out this getting started tutorial for step by step instructions](./functions-api-definition-getting-started.md)

### <a name="templates"></a>Available templates

|Name| Description |
|:-----|:-----|
|Generated Definition|A Swagger file with the maximum amount of information that can be inferred from the Function's existing metadata|

### <a name="quickstart-details"></a>Included Metadata in Generated Definition

The following table represents the portal settings and corresponding data in function.json as it is mapped to the generated skeleton Swagger.

|Swagger.json|Portal UI|Function.json|
|:----|:-----|:-----|
|[Host](http://swagger.io/specification/#fixed-fields-15)|`Function app settings` > `Go to App Service Settings` > `Overview` > `URL`|*not present*
|[Paths](http://swagger.io/specification/#paths-object-29)|`Integrate` > `Selected HTTP methods`|Bindings: Route
|[Path Item](http://swagger.io/specification/#path-item-object-32)|`Integrate` > `Route template`|Bindings: Methods
|[Security](http://swagger.io/specification/#security-scheme-object-112)|Keys|*not present*|
|operationID*|Route + Allowed verbs|Route + Allowed Verbs|

*Operation ID is only required for integrating with PowerApps + Flow

## Next steps
* [Azure Functions Github repository](https://github.com/Azure/Azure-Functions/)
  * Check out the Functions Github to give us feedback on the API definition support preview! Make a github issue for anything you'd like to see updated.
* [Getting started tutorial](functions-api-definition-getting-started.md)
  * Try the our walkthrough to see on OpenAPI definition in action!
* [Azure Functions developer reference](functions-reference.md)  
  * Programmer reference for coding functions and defining triggers and bindings.
