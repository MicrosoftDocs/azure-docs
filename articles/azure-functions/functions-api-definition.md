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
# OpenAPI 2.0 Metadata support in Azure Functions (Preview)
This preview feature allows you to write an OpenAPI 2.0 (formerly Swagger) definition inside a Function App, and host that file using the Function App.

[!INCLUDE [intro](../../includes/functions-bindings-intro.md)]

### What is OpenAPI metadata?
[OpenAPI Metadata](http://swagger.io/) allows a function hosting a REST API to be consumed by a wide variety of other software. From 1st party offerings like PowerApps and [API Apps](https://docs.microsoft.com/azure/app-service-api/app-service-api-dotnet-get-started#a-idcodegena-generate-client-code-for-the-data-tier), to 3rd party developer tooling like [Postman](https://www.getpostman.com/docs/importing_swagger), and [many more packages](http://swagger.io/tools/).

>[!TIP]
>We recommend starting with the [getting started tutorial](./functions-api-definition-getting-started.md) and then returning to this document to learn more about specific features.

## <a name="enable"></a>Enabling OpenAPI definition Support
* All OpenAPI settings can be configured in the `API Definition (preview)` page in your Function App settings.
* Set `API defintion source` to `Function` to enable a hosted OpenAPI definition and quickstart definition generation.
  * `External URL` allows your Function to use an OpenAPI definition that is hosted elsewhere.

## <a name="generate-defintion"></a>Generate a Swagger Skeleton from your Function Metadata
A template is an awesome way to get started writing your first OpenAPI definition. The definition template feature creates a sparse OpenAPI definition using all the metadata in the function.json for each of your HTTP trigger functions. **You will need to fill in more information about your API from the [OpenAPI specification](http://swagger.io/specification/), such as request and response templates.**

[Check out this getting started tutorial for step by step instructions](./functions-api-definition-getting-started.md)

### <a name="templates"></a>Available templates

|Name| Description |
|:-----|:-----|
|Generated Definition|An OpenAPI definition with the maximum amount of information that can be inferred from the Function's existing metadata|

### <a name="quickstart-details"></a>Included Metadata in Generated Definition

The following table represents the portal settings and corresponding data in function.json as it is mapped to the generated skeleton Swagger.

|Swagger.json|Portal UI|Function.json|
|:----|:-----|:-----|
|[Host](http://swagger.io/specification/#fixed-fields-15)|`Function app settings` > `Go to App Service Settings` > `Overview` > `URL`|*not present*
|[Paths](http://swagger.io/specification/#paths-object-29)|`Integrate` > `Selected HTTP methods`|Bindings: Route
|[Path Item](http://swagger.io/specification/#path-item-object-32)|`Integrate` > `Route template`|Bindings: Methods
|[Security](http://swagger.io/specification/#security-scheme-object-112)|Keys|*not present*|
|operationID*|Route + Allowed verbs|Route + Allowed Verbs|

\*Operation ID is only required for integrating with PowerApps + Flow
> [!NOTE]
>  x-ms-summary provides a display name in Logic Apps, Flow, and PowerApps.
>
> Check out [customize your Swagger definition for PowerApps](https://powerapps.microsoft.com/tutorials/customapi-how-to-swagger/) to learn more.

## <a name="CICD"></a>Using CI/CD to set an API Definition

 You must enable API Definition hosting in the portal before enabling source control to modify your API Definition from source control. Follow the instructions below.

1. Navigate to `API Definition (preview)` in your Function App settings.
  1. Set `API definition source` to `Function`
  1. Click `Generate API definition template` then `Save` to create a template definition for modifying later.
  1. Note your `API definition URL` and `key`
1. [Set up CI/CD](https://docs.microsoft.com/azure/azure-functions/functions-continuous-deployment#continuous-deployment-requirements)
2. Modify your `swagger.json` in source control at `\site\wwwroot\.azurefunctions\swagger\swagger.json`

Now changes to `swagger.json` in your repository are hosted by your Function App at the `API definition URL` and `key` noted in step 1.3

## Next steps
* [Getting started tutorial](functions-api-definition-getting-started.md)
  * Try our walkthrough to see an OpenAPI definition in action!
* [Azure Functions Github repository](https://github.com/Azure/Azure-Functions/)
  * Check out the Functions Github to give us feedback on the API definition support preview! Make a github issue for anything you'd like to see updated.
* [Azure Functions developer reference](functions-reference.md)  
  * Programmer reference for coding functions and defining triggers and bindings.
