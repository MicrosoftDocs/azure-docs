---
title: Create an OpenAPI definition for a function | Microsoft Docs
description: Create an OpenAPI definition that enables other apps and services to call your function in Azure.
services: functions
keywords: OpenAPI, Swagger, cloud apps, cloud services,
author: ggailey777
manager: jeconnoc

ms.assetid: ''
ms.service: azure-functions
ms.topic: tutorial
ms.date: 11/26/2018
ms.author: glenga
ms.reviewer: sunayv
ms.custom: mvc, cc996988-fb4f-47
---

# Create an OpenAPI definition for a function with Azure API Management

REST APIs are often described using an OpenAPI definition. This definition contains information about what operations are available in an API and how the request and response data for the API should be structured.

In this tutorial, you create a function that determines whether an emergency repair on a wind turbine is cost-effective. You then create an OpenAPI definition for the function app using [Azure API Management](../api-management/api-management-key-concepts.md) so that the function can be called from other apps and services.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a function in Azure
> * Generate an OpenAPI definition using Azure API Management
> * Test the definition by calling the function

## Create a function app

You must have a function app to host the execution of your functions. A function app lets you group functions as a logical unit for easier management, deployment, scaling, and sharing of resources.

[!INCLUDE [Create function app Azure portal](../../includes/functions-create-function-app-portal.md)]

## Create the function

This tutorial uses an HTTP triggered function that takes two parameters: the estimated time to make a turbine repair (in hours); and the capacity of the turbine (in kilowatts). The function then calculates how much a repair will cost, and how much revenue the turbine could make in a 24 hour period.

1. Expand your function app and select the **+** button next to **Functions**. Select In-portal option and select **Continue**.

1. Select More templates... option and select **Finish and view templates**

1. Select HTTP trigger

1. Type `TurbineRepair` for the function **Name**, choose `Function` for **[Authentication level](functions-bindings-http-webhook.md#http-auth)**, and then select **Create**.  

![Create HTTP function for OpenAPI](media/functions-openapi-definition/select-http-trigger-openapi.png)

1. Replace the contents of the run.csx file with the following code, then click **Save**:

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

    This function code returns a message of `Yes` or `No` to indicate whether an emergency repair is cost-effective, as well as the revenue opportunity that the turbine represents, and the cost to fix the turbine.

1. To test the function, click **Test** at the far right to expand the test tab. Enter the following value for the **Request body**, and then click **Run**.

    ```json
    {
    "hours": "6",
    "capacity": "2500"
    }
    ```

    ![Test the function in the Azure portal](media/functions-openapi-definition/test-function.png)

    The following value is returned in the body of the response.

    ```json
    {"message":"Yes","revenueOpportunity":"$7200","costToFix":"$1600"}
    ```

Now you have a function that determines the cost-effectiveness of emergency repairs. Next, you generate an OpenAPI definition for the function app.

## Generate the OpenAPI definition

Now you're ready to generate the OpenAPI definition.

1. Select the function app and then select **Platform features**, **All settings**

    ![Test the function in the Azure portal](media/functions-openapi-definition/select-all-settings-openapi.png)

1. Select API Management from page

    ![Link function](media/functions-openapi-definition/link-apim-openapi.png)

1. Select **Create new** to create a new API Management service

1. Select **West US** for the location

1. Enter **Contoso** for the Organization name 

1. Select Consumption (preview) for the Pricing tier

1. Accept the remaining defaults and select **Create**

    ![Create new API Management service](media/functions-openapi-definition/new-apim-service-openapi.png)

The API instance should get created in a couple of minutes

1. Select **Enable Application Insights** to send logs to the same place as the function application

1. Accept the remaining defaults and select **Link API** 

1. The **Import Azure Functions** page will open with the TurbineRepair function selected. Press **Select** to continue

    ![Import Azure Functions into API Management](media/functions-openapi-definition/import-function-openapi.png)

1. The **Create from Function App** page will open. Accept the defaults and select **Create**

    ![Create from Function App](media/functions-openapi-definition/create-function-openapi.png)

The API is now created for the function.

## Test the OpenAPI definition

Before you use the API definition, it's a good idea to test it.

1. On the **Test** tab of your function, select **POST** operation

1. Enter values for **hours** and **capacity**

```json
{
"hours": "6",
"capacity": "2500"
}
```

1. Click **Send**, then view the HTTP response.

    ![Test function API](media/functions-openapi-definition/test-function-api-openapi.png)

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Create a function in Azure
> * Generate an OpenAPI definition using Azure API Management
> * Test the definition by calling the function

Advance to the next topic to learn about API Management.

> [!div class="nextstepaction"]
> [API Management](../api-management/api-management-key-concepts.md)