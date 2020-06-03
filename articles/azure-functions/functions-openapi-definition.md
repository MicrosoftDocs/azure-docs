---
title: Expose your functions with OpenAPI using Azure API Management
description: Create an OpenAPI definition that enables other apps and services to call your function in Azure.
ms.topic: tutorial
ms.date: 04/21/2020
ms.reviewer: sunayv
ms.custom: mvc, cc996988-fb4f-47, references_regions
---

# Create an OpenAPI definition for a serverless API using Azure API Management

REST APIs are often described using an OpenAPI definition. This definition contains information about what operations are available in an API and how the request and response data for the API should be structured.

In this tutorial, you create a function that determines whether an emergency repair on a wind turbine is cost-effective. You then create an OpenAPI definition for the function app using [Azure API Management](../api-management/api-management-key-concepts.md) so that the function can be called from other apps and services.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a function in Azure
> * Generate an OpenAPI definition using Azure API Management
> * Test the definition by calling the function
> * Download the OpenAPI definition

## Create a function app

You must have a function app to host the execution of your functions. A function app lets you group functions as a logical unit for easier management, deployment, scaling, and sharing of resources.

[!INCLUDE [Create function app Azure portal](../../includes/functions-create-function-app-portal.md)]

## Create the function

This tutorial uses an HTTP triggered function that takes two parameters:

* The estimated time to make a turbine repair, in hours.
* The capacity of the turbine, in kilowatts. 

The function then calculates how much a repair will cost, and how much revenue the turbine could make in a 24-hour period. To create the HTTP triggered function in the [Azure portal](https://portal.azure.com):

1. From the left menu of your functions app, select **Functions**, and then select **Add** from the top menu.

1. In the **New Function** window, select **Http trigger**.

1. For **New Function**, enter `TurbineRepair`. 

1. Choose **Function** from the **[Authorization level](functions-bindings-http-webhook-trigger.md#http-auth)** drop-down list, and then select **Create Function**.

    :::image type="content" source="media/functions-openapi-definition/select-http-trigger-openapi.png" alt-text="Create HTTP function for OpenAPI":::

1. Select **Code + Test**, and then select **run.csx** from the drop-down list. Replace the contents of the run.csx C# script file with the following code, then choose **Save**:

    ```csharp
    #r "Newtonsoft.Json"
    
    using System.Net;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Primitives;
    using Newtonsoft.Json;
    
    const double revenuePerkW = 0.12;
    const double technicianCost = 250;
    const double turbineCost = 100;
    
    public static async Task<IActionResult> Run(HttpRequest req, ILogger log)
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
        if (capacity == null || hours == null){
            return new BadRequestObjectResult("Please pass capacity and hours on the query string or in the request body");
        }
        // Formulas to calculate revenue and cost
        double? revenueOpportunity = capacity * revenuePerkW * 24;  
        double? costToFix = (hours * technicianCost) +  turbineCost;
        string repairTurbine;
    
        if (revenueOpportunity > costToFix){
            repairTurbine = "Yes";
        }
        else {
            repairTurbine = "No";
        };
    
        return (ActionResult)new OkObjectResult(new{
            message = repairTurbine,
            revenueOpportunity = "$"+ revenueOpportunity,
            costToFix = "$"+ costToFix
        });
    }
    ```

    This function code returns a message of `Yes` or `No` to indicate whether an emergency repair is cost-effective. It also returns the revenue opportunity that the turbine represents and the cost to fix the turbine.

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
