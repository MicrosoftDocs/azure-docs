---
title: 'Tutorial: Integrate with Azure Logic Apps to send email'
description: Learn how to create an Azure Logic apps resource to send email and invoke other business processes from your App Service app.
ms.topic: tutorial
ms.date: 07/14/2025
ms.devlang: csharp
# ms.devlang: csharp, javascript, php, python
ms.custom: devx-track-csharp, mvc, AppServiceConnectivity
author: cephalin
ms.author: cephalin
ms.service: azure-app-service
---

# Tutorial: Integrate with Azure Logic Apps to send email

In this tutorial, you learn how to integrate your App Service app with your business processes by using [Azure Logic Apps](../logic-apps/logic-apps-overview.md). You create a logic app that sends email via Gmail from your Azure App Service app.

There are other ways to send emails from a web app, such as using Simple Mail Transfer Protocol (SMTP) configuration in your language framework. However, Logic Apps provides a simple configuration interface for many business integrations without adding complexity to your code.

You can use the steps demonstrated in this tutorial to implement several common web app scenarios, such as:

- Sending confirmation email for a transaction.
- Adding users to Facebook group.
- Connecting to external systems like SAP and Salesforce.
- Exchanging standard B2B messages.

## Prerequisites

You must have the following prerequisites to complete this tutorial:

- A Gmail account.
- An Azure account with permission to create resources.
- A deployed Azure App Service app in the language of your choice. You can use the sample app from one of the following tutorials:

  ### [ASP.NET Core](#tab/dotnetcore)
  
  [Tutorial: Build an ASP.NET Core and SQL Database app in Azure App Service](tutorial-dotnetcore-sqldb-app.md)
  
  ### [ASP.NET](#tab/dotnet)
  
  [Tutorial: Build an ASP.NET app in Azure with SQL Database](app-service-web-tutorial-dotnet-sqldatabase.md)
  
  ### [Node.js](#tab/node)
  
  [Tutorial: Build a Node.js and MongoDB app in Azure](tutorial-nodejs-mongodb-app.md)
  
  ### [PHP](#tab/php)
  
  [Tutorial: Build a PHP and MySQL app in Azure](tutorial-php-mysql-app.md)
  
  ### [Python](#tab/python)
  
  [Tutorial: Run a Python (Django) web app with PostgreSQL in Azure App Service](tutorial-python-postgresql-app-django.md)

---

## Create the logic app

1. Create a multitenant Consumption app in [Azure Logic Apps](../logic-apps/logic-apps-overview.md) by following the instructions at [Create a Consumption logic app resource](../logic-apps/quickstart-create-example-consumption-workflow.md#create-a-consumption-logic-app-resource). When the app is created, select **Go to resource**.

1. On your logic app page, select **Logic app designer** under **Development Tools** in the left navigation menu.

### Add the trigger

1. Select **Add a trigger** on the logic app designer canvas.

   :::image type="content" source="./media/tutorial-send-email/http-request-url.png" alt-text="Screenshot that shows the Logic Apps designer canvas with Add a trigger highlighted.":::

1. On the **Add a trigger** screen under **Built-in tools**, select **Request**, and on the next screen select **When a HTTP request is received**.

   :::image type="content" source="./media/tutorial-send-email/receive-http-request.png" alt-text="Screenshot that shows Request and When an HTTP request is received highlighted.":::

   The trigger appears on the designer canvas.

1. On the **When a HTTP request is received** screen, select **Use sample payload to generate schema**.

   :::image type="content" source="./media/tutorial-send-email/use-sample-payload.png" alt-text="Screenshot that shows the When an HTTP request is received screen with generate schema link highlighted.":::

1. Paste the following code in the **Enter or paste a sample JSON payload** screen, and then select **Done**.

   ```json
   {
       "task": "<description>",
       "due": "<date>",
       "email": "<email-address>"
   }
   ```

   Azure generates the schema for the request data you entered. In practice, you can capture the actual request data from your application code and use it to generate the JSON schema.

1. On the Logic App designer top toolbar, select **Save**.

1. The generated HTTP URL now appears under **HTTP URL** on the **When a HTTP request is received** screen. Select the copy icon to copy the URL to use later.

   :::image type="content" source="./media/tutorial-send-email/generate-schema-with-payload.png" alt-text="Screenshot that shows the When an HTTP request is received screen with generate schema link and HTTP URL highlighted.":::

The HTTP request definition is a trigger for anything you want to do in this logic app workflow, such as sending mail. Later you invoke this URL in your App Service app. For more information on the request trigger, see [Receive and respond to inbound HTTPS calls sent to workflows in Azure Logic Apps](/azure/connectors/connectors-native-reqres).

### Create the email

Add a send email action and populate the email with the three HTTP request properties you entered earlier.

1. On the designer canvas, select the **+** under the trigger and select **Add an action**.

1. On the **Add an action** screen, enter *gmail* in the search box, and then select **Send email (V2)**.

   > [!TIP]
   > You can search for other types of integrations, such as SendGrid, MailChimp, Microsoft 365, and SalesForce. For more information, see [Managed connectors for Azure Logic Apps](/connectors/connector-reference/connector-reference-logicapps-connectors).

1. On the **Create connection** screen, select **Sign in** to authenticate access to the Gmail account you want to send the email from.

   :::image type="content" source="./media/tutorial-send-email/gmail-sign-in.png" alt-text="Screenshot that shows the Gmail action where you sign in to your Gmail account.":::

1. After you sign in, select inside the **To** field on the **Send email (V2)** screen to display the dynamic content icon. Select the upper, lightning bolt part of the icon.

1. The dynamic content list appears, showing the three HTTP request properties you entered earlier. Select **email** from the list.

   :::image type="content" source="./media/tutorial-send-email/expand-dynamic-content.png" alt-text="Screenshot that shows the dynamic content icon and list with email highlighted.":::

1. On the **Send email (V2)** screen, the **email** item appears in the **To** field. Drop down the list under **Advanced parameters**, and select **Subject** and **Body**.

   :::image type="content" source="./media/tutorial-send-email/hide-dynamic-content.png" alt-text="Screenshot that shows selecting Subject and Body from the parameters list.":::

1. The **Subject** and **Body** fields appear on the **Send email (V2)** screen. Select in the **Subject** field to display the dynamic content icon, and select **task** from the dynamic content list.

1. In the **Subject** field next to **task**, type a space followed by *created*.

1. Select inside the **Body** field, display the dynamic content list, and select **due**.

1. In the **Body** field, move the cursor before **due** and enter *This work item is due on* followed by a space.

   :::image type="content" source="./media/tutorial-send-email/completed-email.png" alt-text="Screenshot that shows the completed Send email (V2) form.":::

### Add a response

Add an asynchronous HTTP response to the HTTP trigger.

1. On the designer canvas, select the **+** between the HTTP request trigger and the Gmail action, and select **Add a parallel branch**.

   :::image type="content" source="./media/tutorial-send-email/add-http-response.png" alt-text="Screenshot that shows the + sign and Add a parallel branch option highlighted.":::

1. On the **Add an action** screen, enter *response* in the search field, and then select **Response**.

   :::image type="content" source="./media/tutorial-send-email/choose-response-action.png" alt-text="Screenshot that shows the search bar and Response action highlighted.":::

   By default, the response action sends an `HTTP 200`, which is sufficient for this tutorial. For more information, see [Receive and respond to inbound HTTPS calls sent to workflows in Azure Logic Apps](/azure/connectors/connectors-native-reqres).

1. Select **Save** on the Logic app designer toolbar.

## Add the HTTP request code to your App Service app

You should avoid putting sensitive information like the request trigger URL directly into your App Service app code. Instead, you can reference the URL as an environment variable from App Service app settings. The following command creates an environment variable called `LOGIC_APP_URL` for your logic app HTTP URL.

1. In Azure [Cloud Shell](https://shell.azure.com), run the following Azure CLI command to create the app setting. Replace `<app-name>` and `<resource-group-name>` with your App Service app and resource group names. Replace `<http-url>` with the HTTP URL you copied from your logic app.

   ```azurecli-interactive
   az webapp config appsettings set --name <app-name> --resource-group <resource-group-name> --settings LOGIC_APP_URL="<http-url>"
   ```

1. In your code, make a standard HTTP post to the logic app URL using an HTTP client language available to your language framework, with the following configuration:

   - Make sure the request contains the heading `Content-Type: application/json`. 
   - Use the same JSON format that you supplied to your logic app in the request body:

     ```json
     {
         "task": "<description>",
         "due": "<date>",
         "email": "<email-address>"
     }
     ```

   - To optimize performance, send the request asynchronously if possible.
   - For logging instructions, check the documentation for your preferred framework.

### Example request/response code samples

Select your preferred language/framework to see an example request and response. Some examples require using or installing code packages.

### [ASP.NET Core](#tab/dotnetcore)

In ASP.NET Core, you can send the HTTP post with the [System.Net.Http.HttpClient](/dotnet/api/system.net.http.httpclient) class. The following code sample requires using `System.Net.Http` and `System.Text.Json`. The `HttpResponseMessage` requires dependency injection (DI) configuration to access app settings. For more information, see [Access environment variables](configure-language-dotnetcore.md#access-environment-variables).

```csharp
// requires using System.Net.Http;
var client = new HttpClient();
// requires using System.Text.Json;
var jsonData = JsonSerializer.Serialize(new
{
    email = "someone@example.com",
    due = "4/1/2025",
    task = "My new task!"
});

HttpResponseMessage result = await client.PostAsync(
    // Requires DI configuration to access app settings
    _configuration["LOGIC_APP_URL"],
    new StringContent(jsonData, Encoding.UTF8, "application/json"));
    
var statusCode = result.StatusCode.ToString();
```

> [!NOTE]
> This demo code is written for simplicity. In practice, you don't instantiate an `HttpClient` object for each request. Follow the guidance at [Use IHttpClientFactory to implement resilient HTTP requests](/dotnet/architecture/microservices/implement-resilient-applications/use-httpclientfactory-to-implement-resilient-http-requests).

> [!TIP]
> If you're using the sample app from [Tutorial: Build an ASP.NET Core and SQL Database app in Azure App Service](tutorial-dotnetcore-sqldb-app.md), you could use this code to send an email confirmation in the [Create action](https://github.com/Azure-Samples/dotnetcore-sqldb-tutorial/blob/master/Controllers/TodosController.cs#L56-L65) after you add a `Todo` item.

### [ASP.NET](#tab/dotnet)

In ASP.NET, you can send the HTTP post with the [System.Net.Http.HttpClient](/dotnet/api/system.net.http.httpclient) class. The code requires using `System.Net.Http`, `System.Text.Json`, and `System.Configuration`.

```csharp
// requires using System.Net.Http;
var client = new HttpClient();
// requires using System.Text.Json;
var jsonData = JsonSerializer.Serialize(new
{
    email = "someone@example.com",
    due = "4/1/2025",
    task = "My new task!"
});

HttpResponseMessage result = await client.PostAsync(
    // requires using System.Configuration;
    ConfigurationManager.AppSettings["LOGIC_APP_URL"],
    new StringContent(jsonData, Encoding.UTF8, "application/json"));
    
var statusCode = result.StatusCode.ToString();
```

> [!NOTE]
> This demo code is written for simplicity. In practice, you don't instantiate an `HttpClient` object for each request. Follow the guidance at [Use IHttpClientFactory to implement resilient HTTP requests](/dotnet/architecture/microservices/implement-resilient-applications/use-httpclientfactory-to-implement-resilient-http-requests).

> [!TIP]
> If you're using the sample app from [Tutorial: Build an ASP.NET app in Azure with SQL Database](app-service-web-tutorial-dotnet-sqldatabase.md), you could use this code to send an email confirmation in the [Create action](https://github.com/Azure-Samples/dotnet-sqldb-tutorial/blob/master/DotNetAppSqlDb/Controllers/TodosController.cs#L52-L63) after you add a `Todo` item. To use this asynchronous code, convert the `Create` action to asynchronous.

### [Node.js](#tab/node)

In Node.js, you can send the HTTP post with an npm package like [Axios](https://www.npmjs.com/package/axios), which you can install with `npm install --save axios`.

```javascript
// Requires npm install --save axios
const axios = require('axios');

var jsonData = {
        email: "someone@example.com",
        due: "4/1/2025",
        task: "My new task!"
};

(async function(data) {
    try {
        const response = await axios.post(process.env.LOGIC_APP_URL, jsonData);
        console.log(response.status);
    } catch (error) {
        console.log(error);
    }
})(jsonData);

```

> [!NOTE]
> If you're using the sample app from [Tutorial: Build a Node.js and MongoDB app in Azure](tutorial-nodejs-mongodb-app.md), you could use this code to send an email confirmation in the [create function](https://github.com/Azure-Samples/meanjs/blob/master/modules/articles/server/controllers/articles.server.controller.js#L14-L27) after you [save the article successfully](https://github.com/Azure-Samples/meanjs/blob/master/modules/articles/server/controllers/articles.server.controller.js#L24).

### [PHP](#tab/php)

In PHP, you can use [Guzzle](http://docs.guzzlephp.org/en/stable/index.html) to send the HTTP post. The response requires [Laravel](https://laravel.com/) to run `Log::info()`. You can install both packages using [Composer](https://getcomposer.org/).

```php
// Requires composer require guzzlehttp/guzzle:~6.0
use GuzzleHttp\Client;
...
$client = new Client();
$options = [
    'json' => [ 
        'email' => "someone@example.com",
        'due' => '4/1/2025',
        'task' => "My new task!"
    ]
];

$promise = $client-> postAsync(getenv($LOGIC_APP_URL), $options)->then( 
    function ($response) {
        return $response->getStatusCode();
    }, function ($exception) {
        return $exception->getResponse();
    }
);

$response = $promise->wait();
// Requires Laravel to run Log::info().
Log::info(print_r($response, TRUE));
```

> [!NOTE]
> If you're using the sample app from [Tutorial: Build a PHP and MySQL app in Azure](tutorial-php-mysql-app.md), you could use this code to send an email confirmation in the [Route::post function](https://github.com/Azure-Samples/laravel-tasks/blob/master/routes/web.php#L30-L48), just before the return statement.

### [Python](#tab/python)

The following Python code uses [requests](https://pypi.org/project/requests/), which you can install with `pip install requests`.

```python
# Requires pip install requests && pip freeze > requirements.txt
import requests
import os
...
payload = {
    "email": "someone@example.com",
    "due": "4/1/2025",
    "task": "My new task!"
}
response = requests.post(os.environ['LOGIC_APP_URL'], data = payload)
print(response.status_code)
```
<!-- ```python
# Requires pip install aiohttp && pip freeze > requirements.txt
import aiohttp
...
payload = {
        'email': 'a-valid@emailaddress.com',
        'due': '4/1/2020',
        'task': 'My new task!'
}
async with aiohttp.post('http://httpbin.org/post', data=json.dump(payload)) as resp:
    print(await resp.status())
``` -->

> [!NOTE]
> If you're using the sample app from [Tutorial: Run a Python (Django) web app with PostgreSQL in Azure App Service](tutorial-python-postgresql-app-django.md), you could use this code to send an email confirmation in the [Route::post function](https://github.com/Azure-Samples/laravel-tasks/blob/master/routes/web.php#L30-L48), just before the return statement.

---

## Related content

- [Tutorial: Host a RESTful API with CORS in Azure App Service](app-service-web-tutorial-rest-api.md)
- [Receive and respond to inbound HTTPS calls sent to workflows in Azure Logic Apps](/azure/connectors/connectors-native-reqres)
- [Quickstart: Create an example Consumption workflow in multitenant Azure Logic Apps - Azure portal](../logic-apps/quickstart-create-example-consumption-workflow.md)
- [Environment variables and app settings reference](reference-app-settings.md)
