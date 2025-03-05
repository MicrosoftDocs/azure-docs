---
title: Call the Azure Digital Twins APIs
titleSuffix: Azure Digital Twins
description: Learn how to use Visual Studio .http support to make requests to the Azure Digital Twins APIs. This article shows you how to use both the control and data plane APIs.
ms.author: baanders
author: baanders
ms.service: azure-digital-twins
services: digital-twins
ms.topic: how-to
ms.date: 08/07/2024
---

# How to send requests to the Azure Digital Twins APIs using Visual Studio

[Visual Studio 2022](https://visualstudio.microsoft.com/vs/preview/) has support for `.http` files, which can be used to structure, store, and directly send HTTP requests from the application. Using this functionality of Visual Studio is one way to craft HTTP requests and submit them to the [Azure Digital Twins REST APIs](/rest/api/azure-digitaltwins/). This article describes how to set up an `.http` file in Visual Studio that can interface with the Azure Digital Twins APIs.

This article contains information about the following steps:

1. Set up a Visual Studio project and `.http` file, with variables that represent your Azure Digital Twins instance.
1. Use the Azure CLI to [get a bearer token](#add-bearer-token) that you can use to make API requests in Visual Studio.
1. Use the [Azure Digital Twins REST API documentation](/rest/api/azure-digitaltwins/) as a resource to craft requests in the `.http` file, and send them to the Azure Digital Twins APIs.

Azure Digital Twins has two sets of APIs that you can work with: *data plane* and *control plane*. For more information about the difference between these API sets, see [Azure Digital Twins APIs and SDKs](concepts-apis-sdks.md). This article contains instructions for both API sets.

For more information about `.http` file support in Visual Studio, see [Use .http files in Visual Studio 2022](/aspnet/core/test/http-files).

## Prerequisites

To make requests to the Azure Digital Twins APIs using Visual Studio, you need to set up an Azure Digital Twins instance and download Visual Studio 2022. This section is for these steps.

### Set up Azure Digital Twins instance

[!INCLUDE [digital-twins-prereq-instance.md](../../includes/digital-twins-prereq-instance.md)]

### Download Visual Studio 2022

Next, [download Visual Studio 2022](https://visualstudio.microsoft.com/vs/preview/). Make sure to include the **ASP.NET and web development** workload in your installation.

## Set up Visual Studio project

In this section, you set up the project in Visual Studio that will be used to craft HTTP requests.

Open Visual Studio on your machine, and create a new project. Use the **ASP.NET Core Empty** project template.

:::image type="content" source="media/how-to-use-apis/new-project.png" alt-text="Screenshot of an ASP.NET Core Empty project template in Visual Studio." lightbox="media/how-to-use-apis/new-project.png":::

Follow the instructions in [Create an .http file](/aspnet/core/test/http-files#create-an-http-file) to create a new `.http` file in your project.

### Add variables

Next, add some variables at the top of your `.http` file that will be used to connect to your Azure Digital Twins resource. 

The set of variables you need depends on which set of APIs you're using, so use the tabs below to select between [data plane](concepts-apis-sdks.md#data-plane-overview) and [control plane](concepts-apis-sdks.md#control-plane-overview) APIs.

# [Data plane](#tab/data-plane)

Add the following variables for data plane requests. There's one placeholder for the host name of your Azure Digital Twins instance (it ends in *digitaltwins.azure.net*).

```http
@hostName=<host-name-of-your-Azure-Digital-Twins-instance>
@DPversion=2023-10-31
```

# [Control plane](#tab/control-plane)

Add the following variables for control plane requests. They contain placeholders for your resource values.

```http
@instance=<name-of-your-Azure-Digital-Twins-instance>
@subscription=<ID-of-your-Azure-subscription>
@resourceGroup=<resource-group>
@CPversion=2023-01-31
```
---

## Add bearer token 

Now that you've set up your Azure Digital Twins instance and Visual Studio project, you need to get a bearer token that HTTP requests can use to authorize against the Azure Digital Twins APIs.

There are multiple ways to obtain this token. This article uses the [Azure CLI](/cli/azure/install-azure-cli) to sign into your Azure account and obtain a token that way.

If you have an [Azure CLI installed locally](/cli/azure/install-azure-cli), you can start a command prompt on your machine to run the following commands.
Otherwise, you can open an [Azure Cloud Shell](https://shell.azure.com) window in your browser and run the commands there.

1. First, make sure you're logged into Azure with the right credentials, by running this command:

    ```azurecli-interactive
    az login
    ```

2. Next, use the [az account get-access-token](/cli/azure/account#az-account-get-access-token()) command to get a bearer token with access to the Azure Digital Twins service. In this command, you pass in the resource ID for the Azure Digital Twins service endpoint, in order to get an access token that can access Azure Digital Twins resources. 

    The required context for the token depends on which set of APIs you're using, so use the tabs below to select between [data plane](concepts-apis-sdks.md#data-plane-overview) and [control plane](concepts-apis-sdks.md#control-plane-overview) APIs.

    # [Data plane](#tab/data-plane)
    
    To get a token to use with the data plane APIs, use the following static value for the token context: `0b07f429-9f4b-4714-9392-cc5e8e80c8b0`. This value is the resource ID for the Azure Digital Twins service endpoint.
    
    ```azurecli-interactive
    az account get-access-token --resource 0b07f429-9f4b-4714-9392-cc5e8e80c8b0
    ```
    
    # [Control plane](#tab/control-plane)
    
    To get a token to use with the control plane APIs, use the following value for the token context: `https://management.azure.com/`.
    
    ```azurecli-interactive
    az account get-access-token --resource https://management.azure.com/
    ```
    ---

    >[!NOTE]
    > If you need to access your Azure Digital Twins instance using a service principal or user account that belongs to a different Microsoft Entra tenant from the instance, you need to request a token from the Azure Digital Twins instance's "home" tenant. For more information on this process, see [Write app authentication code](how-to-authenticate-client.md#authenticate-across-tenants).

3. Copy the value of `accessToken` in the result. This value is your **token value** that you'll paste into Visual Studio to authorize your requests.

   :::image type="content" source="media/how-to-use-apis/console-access-token.png" alt-text="Screenshot of the console showing the result of the az account get-access-token command. The accessToken field with a sample value is highlighted." lightbox="media/how-to-use-apis/console-access-token.png":::

>[!TIP]
>This token is valid for at least five minutes and a maximum of 60 minutes. If you run out of time allotted for the current token, you can repeat the steps in this section to get a new one.

### Add token to `.http` file

In your `.http` file in Visual Studio, add another variable that holds the value of your token.

# [Data plane](#tab/data-plane)

```http
@token=<paste-data-plane-token>
```

Your variables should now look something like this:

:::image type="content" source="media/how-to-use-apis/variables-token-data.png" alt-text="Screenshot of the data plane variables, including a token." lightbox="media/how-to-use-apis/variables-token-data.png":::

# [Control plane](#tab/control-plane)

```http
@token=<paste-control-plane-token>
```

Your variables should now look something like this:

:::image type="content" source="media/how-to-use-apis/variables-token-control.png" alt-text="Screenshot of the control plane variables, including a token." lightbox="media/how-to-use-apis/variables-token-control.png":::

---

## Add requests

Now that your `.http` file is set up, you can add requests to the Azure Digital Twin APIs.

Start by opening the [Azure Digital Twins REST API reference](/rest/api/azure-digitaltwins/). This documentation contains details of all the operations covered by the APIs. Navigate to the reference page of the request you want to run. 

This article will use the [DigitalTwins Update API](/rest/api/digital-twins/dataplane/twins/digital-twins-update) from the data plane as an example.

1. **Add request template**: Copy the HTTP request shown in the reference documentation.

   :::image type="content" source="media/how-to-use-apis/copy-request.png" alt-text="Screenshot of the HTTP request in the Digital Twins API documentation." lightbox="media/how-to-use-apis/copy-request.png":::
 
    In Visual Studio, paste the request in a new line below the variables in your `.http` file. 
1. **Add parameters**: Look at the **URI Parameters** section of the reference documentation to see which parameter values are needed by the request. You can replace some with the [variables](#add-variables) you created earlier, and fill in other parameter values as appropriate. To reference a variable, put the variable name in double curly braces, like `{{variable}}`. For more details, see [Variables](/aspnet/core/test/http-files#variables).

    >[!NOTE]
    >For data plane requests, `digitaltwins-hostname` is also a parameter. Replace this with `{{hostName}}` to use the value of your host name variable.

    Here's how this step looks in an example request:
    
    :::image type="content" source="media/how-to-use-apis/add-parameters.png" alt-text="Screenshot of the request with parameters in Visual Studio." lightbox="media/how-to-use-apis/add-parameters.png":::

1. **Add authorization**: Add the following line (exactly as written) directly underneath the request, to specify authentication with your bearer token variable.

    ```http
    Authorization: Bearer {{token}}
    ```

    Here's how this step looks in an example request:

   :::image type="content" source="media/how-to-use-apis/add-authorization.png" alt-text="Screenshot of the request with authorization line in Visual Studio." lightbox="media/how-to-use-apis/add-authorization.png":::
1. **Add additional headers**: Look at the **Request Header** section of the reference documentation to see which header values can accompany the request. You may also want to include traditional HTTP headers like `Content-Type`. Add each header on its own line in the format `HeaderName: Value`. For more details, see [Request headers](/aspnet/core/test/http-files#request-headers).

    Here's how this step looks in an example request:

    :::image type="content" source="media/how-to-use-apis/add-header.png" alt-text="Screenshot of the request with another header in Visual Studio." lightbox="media/how-to-use-apis/add-header.png":::

1. **Add body**: Look at the **Request Body** section of the reference documentation to see what body information might be needed by the request. Add the request body after a blank line. For more details, see [Request body](/aspnet/core/test/http-files#request-body).

    Here's how this step looks in an example request:
    :::image type="content" source="media/how-to-use-apis/add-body.png" alt-text="Screenshot of the request with a body in Visual Studio." lightbox="media/how-to-use-apis/add-body.png"::: 

1. When the request is ready, select **Send request** above the request to send it.

    :::image type="content" source="media/how-to-use-apis/send.png" alt-text="Screenshot of Send request in Visual Studio." lightbox="media/how-to-use-apis/send.png"::: 

Visual Studio brings up a pane with the details of the response. Look at the **Responses** section of the reference documentation to interpret the status code and any data in the response body.

:::image type="content" source="media/how-to-use-apis/response.png" alt-text="Screenshot of the response in Visual Studio." lightbox="media/how-to-use-apis/response.png":::

### Add additional requests

To add more requests to the `.http` file, separate them with `###` as a delimiter.

:::image type="content" source="media/how-to-use-apis/multiple-requests.png" alt-text="Screenshot of multiple requests in one file in Visual Studio." lightbox="media/how-to-use-apis/multiple-requests.png":::

## Next steps

For more details about sending requests with `.http` files in Visual Studio, including syntax details and advanced scenarios, see [Use .http files in Visual Studio 2022](/aspnet/core/test/http-files).

To learn more about the Digital Twins APIs, read [Azure Digital Twins APIs and SDKs](concepts-apis-sdks.md), or view the [reference documentation for the REST APIs](/rest/api/azure-digitaltwins/).
