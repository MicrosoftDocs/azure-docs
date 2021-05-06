---
title: Expose your functions with OpenAPI using Azure API Management
description: Create an OpenAPI definition that enables other apps and services to call your function in Azure.
ms.topic: tutorial
ms.date: 04/21/2020
ms.reviewer: sunayv
ms.custom: "devx-track-csharp, mvc, cc996988-fb4f-47, references_regions"
---

# Create an OpenAPI definition for a serverless API using Azure API Management

REST APIs are often described using an OpenAPI definition. This definition contains information about what operations are available in an API and how the request and response data for the API should be structured.

In this tutorial, you create a function that determines whether an emergency repair on a wind turbine is cost-effective. 

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a Functions project in Visual Studio

## Prerequisites

+ [Visual Studio 2019](https://azure.microsoft.com/downloads/), version 16.10 or a later version. Make sure you select the **Azure development** workload during installation. 

    ![Install Visual Studio with the Azure development workload](media/functions-create-your-first-function-visual-studio/functions-vs-workloads.png)

+ An active [Azure subscription](../guides/developer/azure-developer-guide.md#understanding-accounts-subscriptions-and-billing), create a [free account](https://azure.microsoft.com/free/dotnet/) before you begin.

## Create a function app project

The Azure Functions project template in Visual Studio creates a project that you can publish to a function app in Azure. You'll also create an HTTP triggered function supports OpenAPI definition file (formerly Swagger file) generation.

1. From the Visual Studio menu, select **File** > **New** > **Project**.

1. In **Create a new project**, enter *functions* in the search box, choose the **Azure Functions** template, and then select **Next**.

1. In **Configure your new project**, enter a **Project name** for your project like `TurbineRepair`, and then select **Create**. 

1. For the **Create a new Azure Functions application** settings, use the values in the following table:

    | Setting      | Value  | Description                      |
    | ------------ |  ------- |----------------------------------------- |
    | **.NET version** | **.NET Core 3 (LTS)** | This value creates a function project that uses the version 3.x runtime of Azure Functions. Other versions don't support OpenAPI file generation. |
    | **Function template** | **HTTP trigger with OpenAPI** | This value creates a function triggered by an HTTP request, with the ability to generate an OpenAPI definition file.  |
    | **Storage account (AzureWebJobsStorage)**  | **Storage emulator** | You can use the emulator for local development of HTTP trigger functions. Because a function app in Azure requires a storage account, one is assigned or created when you publish your project to Azure. |
    | **Authorization level** | **Anonymous** | The created function can be triggered by any client without providing a key. This authorization setting makes it easy to test your new function. For more information about keys and authorization, see [Authorization keys](../articles/azure-functions/functions-bindings-http-webhook-trigger.md#authorization-keys). Use anonymous authorization when you plan to expose APIs by using API Management, which has its own endpoint security mechanisms. |
    
    
    ![Azure Functions project settings](./media/functions-openapi-definitions/functions-project-settings.png)

    Make sure you set the **Authorization level** to **Anonymous**. If you choose the default level of **Function**, you're required to present the [function key](../articles/azure-functions/functions-bindings-http-webhook-trigger.md#authorization-keys) in requests to access your function endpoint.

1. Select **Create** to create the function project and HTTP trigger function, with support for OpenAPI. 

Visual Studio creates a project and class named `Function1` that contains boilerplate code for the HTTP trigger function type. Next, you replace this function template code with your own customized code. 

## Update the function code

The function uses an HTTP trigger that takes two parameters:

* The estimated time to make a turbine repair, in hours.
* The capacity of the turbine, in kilowatts. 

The function then calculates how much a repair will cost, and how much revenue the turbine could make in a 24-hour period. To create the HTTP triggered function in the [Azure portal](https://portal.azure.com). 

1. In the Function1.cs project file, replace the contents of the generated class library code with the following code:

    :::code language="csharp" source="~/functions-openapi-turbine-repair/TurbineRepair/Function1.cs":::

    ```csharp
    using System;
    using System.IO;
    using System.Net;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Azure.WebJobs;
    using Microsoft.Azure.WebJobs.Extensions.Http;
    using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
    using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
    using Microsoft.Extensions.Logging;
    using Microsoft.OpenApi.Models;
    using Newtonsoft.Json;
    
    namespace TurbineRepair
    {
        public static class Function1
        {
            const double revenuePerkW = 0.12;
            const double technicianCost = 250;
            const double turbineCost = 100;
    
            [FunctionName("TurbineRepair")]
            [OpenApiOperation(operationId: "Run", tags: new[] { "name" })]
            [OpenApiSecurity("function_key", SecuritySchemeType.ApiKey, Name = "code", In = OpenApiSecurityLocationType.Query)]
            [OpenApiParameter(name: "hours", In = ParameterLocation.Query, Required = true, Type = typeof(Int32), 
                Description = "Number of hours since turbine last serviced.")]
            [OpenApiParameter(name: "capacity", In = ParameterLocation.Query, Required = true, Type = typeof(Int32),
                Description = "Kilowatt capacity of turbine.")]
            [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(string), 
                Description = "The OK response message containing a JSON result.")]
            public static async Task<IActionResult> Run(
                [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)] HttpRequest req,
                ILogger log)
            {
                // Get query strings if they exist
                int tempVal;
                int? hours = Int32.TryParse(req.Query["hours"], out tempVal) ? tempVal : (int?)null;
                int? capacity = Int32.TryParse(req.Query["capacity"], out tempVal) ? tempVal : (int?)null;
    
                // Get request body
                string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
                dynamic data = JsonConvert.DeserializeObject(requestBody);
    
                // Use request body if a query was not sent
                capacity = capacity ?? data?.capacity;
                hours = hours ?? data?.hours;
    
                // Return bad request if capacity or hours are not passed in
                if (capacity == null || hours == null)
                {
                    return new BadRequestObjectResult("Please pass capacity and hours on the query string or in the request body");
                }
                // Formulas to calculate revenue and cost
                double? revenueOpportunity = capacity * revenuePerkW * 24;
                double? costToFix = (hours * technicianCost) + turbineCost;
                string repairTurbine;
    
                if (revenueOpportunity > costToFix)
                {
                    repairTurbine = "Yes";
                }
                else
                {
                    repairTurbine = "No";
                };
    
                return (ActionResult)new OkObjectResult(new
                {
                    message = repairTurbine,
                    revenueOpportunity = "$" + revenueOpportunity,
                    costToFix = "$" + costToFix
                });
            }
        }
    }
    ```

    This function code returns a message of `Yes` or `No` to indicate whether an emergency repair is cost-effective. It also returns the revenue opportunity that the turbine represents and the cost to fix the turbine.

## Test the function locally

1. To test the function, select **Test**, select the **Input** tab, enter the following input for the **Body**, and then select **Run**:

    ```json
    {
    "hours": "6",
    "capacity": "2500"
    }
    ```

    :::image type="content" source="media/functions-openapi-definition/test-function.png" alt-text="Test the function in the Azure portal":::

    The following output is returned in the **Output** tab:

    ```json
    {"message":"Yes","revenueOpportunity":"$7200","costToFix":"$1600"}
    ```

Now you have a function that determines the cost-effectiveness of emergency repairs. Next, you generate an OpenAPI definition for the function app.

## Publish the project to Azure

## Generate the OpenAPI definition

To generate the OpenAPI definition:

1. Select the function app, choose **API Management** from the left menu, and then select **Create new** under **API Management**.

    :::image type="content" source="media/functions-openapi-definition/select-all-settings-openapi.png" alt-text="Choose API Management":::


1. Use the API Management settings as specified in the following table:

    | Setting      | Suggested value  | Description                                        |
    | ------------ |  ------- | -------------------------------------------------- |
    | **Name** | Globally unique name | A name is generated based on the name of your function app. |
    | **Subscription** | Your subscription | The subscription under which this new resource is created. |  
    | **[Resource group](../azure-resource-manager/management/overview.md)** |  myResourceGroup | The same resource as your function app, which should get set for you. |
    | **Location** | West US | Choose the West US location. |
    | **Organization name** | Contoso | The name of the organization used in the developer portal and for email notifications. |
    | **Administrator email** | your email | Email that received system notifications from API Management. |
    | **Pricing tier** | Consumption | Consumption tier isn't available in all regions. For complete pricing details, see the [API Management pricing page](https://azure.microsoft.com/pricing/details/api-management/) |

    ![Create new API Management service](media/functions-openapi-definition/new-apim-service-openapi.png)

1. Choose **Create** to create the API Management instance, which may take several minutes.

1. After Azure creates the instance, it enables the **Enable Application Insights** option on the page. Select it to send logs to the same place as the function application, and then select **Link API**.

1. The **Import Azure Functions** opens with the **TurbineRepair** function highlighted. Choose **Select** to continue.

    ![Import Azure Functions into API Management](media/functions-openapi-definition/import-function-openapi.png)

1. In the **Create from Function App** page, accept the defaults, and then select **Create**.

    :::image type="content" source="media/functions-openapi-definition/create-function-openapi.png" alt-text="Create from Function App":::

    Azure creates the API for the function.

## Test the API

Before you use the OpenAPI definition, you should verify that the API works.

1. On your function app page, select **API Management**, select the **Test** tab, and then select **POST TurbineRepair**. 

1. Enter the following code in the **Request body**:

    ```json
    {
    "hours": "6",
    "capacity": "2500"
    }
    ```

1. Select **Send**, and then view the **HTTP response**.

    :::image type="content" source="media/functions-openapi-definition/test-function-api-openapi.png" alt-text="Test function API":::

## Download the OpenAPI definition

If your API works as expected, you can download the OpenAPI definition.

1. Select **Download OpenAPI definition** at the top of the page.
   
   ![Download OpenAPI definition](media/functions-openapi-definition/download-definition.png)

2. Save the downloaded JSON file, and then open it. Review the definition.

[!INCLUDE [clean-up-section-portal](../../includes/clean-up-section-portal.md)]

## Next steps

You have used API Management integration to generate an OpenAPI definition of your functions. You can now edit the definition in API Management in the portal. You can also [learn more about API Management](../api-management/api-management-key-concepts.md).

> [!div class="nextstepaction"]
> [Edit the OpenAPI definition in API Management](../api-management/edit-api.md)
