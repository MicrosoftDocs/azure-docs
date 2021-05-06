---
title: Expose your C# functions using the OpenAPI extension
description: Create an OpenAPI definition that enables other apps and services to call your C# class library HTTP triggered function in Azure.
ms.service: azure-functions
ms.topic: conceptual 
ms.date: 05/03/2021
zone_pivot_groups: development-environment-functions
#Customer intent: As a developer, I need to know how to configure my C# project to generate OpenAPI/Swagger files so that my APIs can be more easily consumed by client apps.
---

# Create an OpenAPI definition for C# class library functions (preview)

REST APIs are often described using an [OpenAPI definition][openapi]. This definition contains information about what operations are available in an API and how the request and response data for the API should be structured. This metadata enables a wide variety of other software and applications to your HTTP trigger function APIs. Applications and services that use OpenAPI definitions, include the [Microsoft Power Platform][power platform], [Azure API Management][az apim], and third-party tools, like [Postman][postman].

The [Azure Functions OpenAPI Extension][az func openapi extension] lets you generate OpenAPI metadata for your HTTP trigger functions in a C# class library (.NET Core 3.1) project. 

> [!IMPORTANT]
> The following considerations apply when using the OpenAPI Extension:
> 
> * The OpenAPI Extension is in preview.
> * The extension is only supported for version 2.x and later of the Azure Functions runtime.  
> * The extension is currently only supported for C# class library (.NET Core 3.1) apps.
> * For all unsupported scenarios, use [API Management integration](functions-openapi-definition.md) to generate OpenAPI definitions for your functions.

## Prerequisite 

::: zone pivot="development-environment-vscode"  
Before starting this tutorial, you must complete the article [Quickstart: Create a C# function in Azure using Visual Studio Code](create-first-function-vs-code-csharp.md). 
::: zone-end  
::: zone pivot="development-environment-vs"  
Before starting this tutorial, you must complete the article [Quickstart: Create your first function in Azure using Visual Studio](functions-create-your-first-function-visual-studio.md).
::: zone-end  
::: zone pivot="development-environment-cli" 
Before starting this tutorial, you must complete the article [Quickstart: Create a C# function in Azure from the command line](create-first-function-cli-csharp.md).
::: zone-end 
After you've created and published the function app in this previous article, you can use the OpenAPI Extension to generate an OpenAPI definition that describes the HTTP trigger function APIs.

::: zone pivot="development-environment-cli,development-environment-vscode" 
## Install the extension

Install the [Microsoft.Azure.WebJobs.Extensions.OpenApi][az func openapi extension] NuGet package in your project by running the following command in a Terminal window:

```bash
dotnet add package Microsoft.Azure.WebJobs.Extensions.OpenApi --prerelease
```

This package supports creating an OpenAPI endpoint in your project.  

::: zone-end  

## Create the TurbineRepair function


::: zone pivot="development-environment-vscode"  
1. Select F1 to open the command palette, and then search for and run the command **Azure Functions: Create Function**. 

1. Choose your trigger type and define the required attributes of the trigger. 

A new C# class library (.cs) file is added to your project.

## Enable an OpenAPI endpoint

Open the code file for your function and add the following using statements to your code:

```csharp
using System.Net;
using Microsoft.OpenApi.Models;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
```

Add the following attributes to the `Run` method that defines the function: 

```csharp
[OpenApiOperation(operationId: "getName", tags: new[] { "name" }, Summary = "Gets the name", Description = "This gets the name.", Visibility = OpenApiVisibilityType.Important)]
[OpenApiParameter(name: "name", In = ParameterLocation.Query, Required = true, Type = typeof(string), Summary = "The name", Description = "The name", Visibility = OpenApiVisibilityType.Important)]
[OpenApiSecurity("function_key", SecuritySchemeType.ApiKey, Name = "code", In = OpenApiSecurityLocationType.Query)]
[OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "text/plain", bodyType: typeof(string), Summary = "The response", Description = "This returns the response")]
```

## Run your function locally

Now, when you run your project locally, you'll be able to access OpenAPI definitions for the function.

::: zone pivot="development-environment-cli"  
1. From the root of your project folder, use the following command to start the project locally:

```bash
func host start
```
::: zone-end  
::: zone pivot="development-environment-vs,development-environment-vscode" 
1. Press the F5 key to start your project locally.
::: zone-end  

1. In a browser, navigate to the URL `http://localhost:7071/api/swagger/ui`. Verify that a Swagger UI page is displayed. You can use this page to test out the API.

1. Navigate to the `http://localhost:7071/api/swagger.json` endpoint and verify that the OpenAPI document that describes the API is returned. 

## Redeploy and verify the updated app

::: zone pivot="development-environment-vs"
1. In **Solution Explorer**, right-click the project and select **Publish**, then choose **Publish** to republish the project to Azure.
::: zone-end
::: zone pivot="development-environment-vscode"
1. In Visual Studio Code, press F1 to open the command palette. In the command palette, search for and select `Azure Functions: Deploy to function app...`. If you aren't signed-in, you'll be asked to do so.

1. Choose the function app that you created in the first article. Because you're redeploying your project to the same app, select **Deploy** to dismiss the warning about overwriting files.
::: zone-end
::: zone pivot="development-environment-cli"
1. In the *LocalFunctionsProj* folder, use the [`func azure functionapp publish`](functions-run-local.md#project-file-deployment) command to redeploy the project, replacing`<APP_NAME>` with the name of your app.

    ```
    func azure functionapp publish <APP_NAME>
    ```
::: zone-end

1. After deployment completes, you can again use the browser to verify the same OpenAPI endpoints exist in the redeployed function.

## Publish the OpenAPI definition

`https://<FUNCTION_AP_NAME>.azurewebsites.net/api/swagger.json`



## Clean-up Resources ##

When you continue to the next step, [Integrating OpenAPI-enabled Azure Functions with Azure API Management][docs apim], you'll need to keep all your resources in place to build on what you've already done.

Otherwise, you can use the following steps to delete the function app and its related resources to avoid incurring any further costs.

1. In Visual Studio Code, press <kbd>F1</kbd> to open the command palette. In the command palette, search for and select `Azure Functions: Open in portal`.
2. Choose your function app, and press <kbd>Enter</kbd>. The function app page opens in the Azure portal.
3. In the **Overview** tab, select the named link next to **Resource group**.

    ![Select the resource group to delete from the function app page][image-10]

4. In the **Resource group** page, review the list of included resources, and verify that they are the ones you want to delete.
5. Select **Delete resource group**, and follow the instructions.

   Deletion may take a couple of minutes. When it's done, a notification appears for a few seconds. You can also select the bell icon at the top of the page to view the notification.

To learn more about Functions costs, see [Estimating Consumption plan costs][az func costs].


## Next Steps ##

You have got an Azure Functions app with OpenAPI metadata enabled. In the next articles, you will be able to integrate this OpenAPI-enabled Azure Functions app with either [Azure API Management][az apim], [Azure Logic Apps][az logapp] or [Power Platform][power platform].

* [Configuring OpenAPI Document and Swagger UI Permission and Visibility][docs ui configuration]
* [Customizing OpenAPI Document and Swagger UI][docs ui customisation]
* [Support Azure Functions v1 with OpenAPI Extension][docs v1 support]
* [Integrating OpenAPI-enabled Azure Functions to Azure API Management][docs apim]
<!-- * [Integrating OpenAPI-enabled Azure Functions to Power Platform][docs powerplatform] -->


[image-01]: images/image-01.png
[image-02]: images/image-02.png
[image-03]: images/image-03.png
[image-04]: images/image-04.png
[image-05]: images/image-05.png
[image-06]: images/image-06.png
[image-07]: images/image-07.png
[image-08]: images/image-08.png
[image-09]: images/image-09.png
[image-10]: images/image-10.png

[docs ui configuration]: openapi.md#Configure-Authorization-Level
[docs ui customisation]: openapi-core.md#OpenAPI-Metadata-Configuration
[docs v1 support]: azure-functions-v1-support.md
[docs apim]: integrate-with-apim.md
[docs powerplatform]: integrate-with-powerplatform.md

[dotnet core sdk]: https://dotnet.microsoft.com/download/dotnet-core/3.1?WT.mc_id=dotnet-0000-juyoo

[az account free]: https://azure.microsoft.com/free/?WT.mc_id=dotnet-0000-juyoo
[az account free students]: https://azure.microsoft.com/free/students/?WT.mc_id=dotnet-0000-juyoo

[az func core tools]: https://docs.microsoft.com/azure/azure-functions/functions-run-local?WT.mc_id=dotnet-0000-juyoo
[az func openapi extension]: https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.OpenApi
[az func openapi v1 preview]: https://docs.microsoft.com/azure/azure-functions/functions-api-definition?WT.mc_id=dotnet-0000-juyoo
[az func openapi community]: https://github.com/aliencube/AzureFunctions.Extensions
[az func create]: https://docs.microsoft.com/en-us/azure/azure-functions/functions-create-first-azure-function-azure-cli?tabs=bash%2Cbrowser&pivots=programming-language-csharp&WT.mc_id=dotnet-0000-juyoo
[az func costs]: https://docs.microsoft.com/azure/azure-functions/functions-consumption-costs?WT.mc_id=dotnet-0000-juyoo

[az apim]: https://docs.microsoft.com/azure/api-management/api-management-key-concepts?WT.mc_id=dotnet-0000-juyoo
[az logapp]: https://docs.microsoft.com/azure/logic-apps/logic-apps-overview?WT.mc_id=dotnet-0000-juyoo
[az region]: https://azure.microsoft.com/regions/?WT.mc_id=dotnet-0000-juyoo
[power platform]: https://powerplatform.microsoft.com/?WT.mc_id=dotnet-0000-juyoo
[openapi]: https://www.openapis.org/
[postman]: https://www.postman.com/

[vs code]: https://code.visualstudio.com/
[vs code azure tools]: https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack
