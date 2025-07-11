---
title: 'Tutorial: Integrate with Azure Logic Apps to send email'
description: Learn how to create an Azure Logic apps resource to send email and invoke other business processes from your App Service app.
ms.topic: tutorial
ms.date: 07/10/2025
ms.devlang: csharp
# ms.devlang: csharp, javascript, php, python
ms.custom: devx-track-csharp, mvc, AppServiceConnectivity
author: cephalin
ms.author: cephalin
---

# Tutorial: Integrate with Azure Logic Apps to send email

In this tutorial, you learn how to integrate your App Service app with your business processes by using [Azure Logic Apps](../logic-apps/logic-apps-overview.md). You create a logic app that sends email via Gmail from your Azure App Service app. Although there are other ways to send emails from a web app, such as SMTP configuration in your language framework, Logic Apps provides a simple configuration interface for many popular business integrations without adding complexity to your code.

You can use the steps demonstrated in this tutorial to implement many common web app scenarios, such as:

- Sending confirmation email for a transaction.
- Adding users to Facebook group.
- Connecting to third-party systems like SAP and Salesforce.
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

1. In the Azure portal, create an [Azure Logic Apps](../logic-apps/logic-apps-overview.md) app by following the instructions at [Create a Consumption logic app resource](../logic-apps/quickstart-create-example-consumption-workflow.md#create-a-consumption-logic-app-resource). When the app is created, select **Go to resource**.

1. Select **Logic app designer** under **Development Tools** in the left navigation menu.

1. On the Logic app designer page, select **Add a trigger**.

   :::image type="content" source="./media/tutorial-send-email/http-request-url.png" alt-text="Screenshot that shows the Logic Apps designer canvas with Add a trigger highlighted.":::

1. On the **Add a trigger** screen under **Built-in tools**, select **Request**, and then select **When a HTTP request is received**.

   :::image type="content" source="./media/tutorial-send-email/receive-http-request.png" alt-text="Screenshot that shows the splash page for the designer with When an HTTP request is received highlighted.":::

   The **When a HTTP request is received** trigger appears on the designer canvas.

1. On the **When a HTTP request is received** screen, select **Use sample payload to generate schema**.

1. Paste the following code into the editor screen, and then select **Done**.

   ```json
   {
       "task": "<description>",
       "due": "<date>",
       "email": "<email-address>"
   }
   ```

   Azure generates the schema for the request data you want. In practice, you can capture the actual request data your application code generates and use it to generate the JSON schema.

1. On the Logic App designer top toolbar, select **Save**.

1. The generated HTTP URL now appears under **HTTP URL** on the **When a HTTP request is received** screen. Select the icon to copy the URL, and keep it to invoke in your App Service app.

   The HTTP request definition is a trigger for anything you want to do in this logic app workflow, such as sending mail. For more information on the request trigger, see the [Receive and respond to inbound HTTPS calls sent to workflows in Azure Logic Apps](/azure/connectors/connectors-native-reqres).

1. On the designer canvas, select the **+** under the **When a HTTP request is received** trigger and select **Add an action**.

1. On the **Add an action** screen, enter *gmail* in the search box and then select **Send email (V2)**.

   > [!TIP]
   > You can search for other types of integrations, such as SendGrid, MailChimp, Microsoft 365, and SalesForce. For more information, see [Managed connectors for Azure Logic Apps](/connectors/connector-reference/connector-reference-logicapps-connectors).

1. On the **Create connection** screen, select **Sign in** to authenticate access to the Gmail account you want to send the email from.

   :::image type="content" source="./media/tutorial-send-email/gmail-sign-in.png" alt-text="Screenshot that shows the Gmail action where you sign in to your Gmail account.":::

1. After you sign in, on the **Send email (V2)** screen, click or tap inside the **To** field to display the dynamic content icon. Select the upper, lightning bolt part of the icon.

1. The dynamic content list displays the three HTTP request properties you entered earlier. You use these properties to construct an email. Select **email** from the list.

   :::image type="content" source="./media/tutorial-send-email/expand-dynamic-content.png" alt-text="Screenshot that shows the dynamic content icon and list with email highlighted.":::

1. On the **Send email (V2)** screen, the **email** item appears in the **To** field. Drop down the list under **Advanced parameters**, and select **Subject** and **Body**.

   :::image type="content" source="./media/tutorial-send-email/hide-dynamic-content.png" alt-text="Screenshot that shows selecting Subject and Body from the parameters list.":::

1. The **Subject** and **Body** fields appear on the screen. Click or tap in the **Subject** field to display the dynamic content icon, and select **task** from the dynamic content list.

1. In the **Subject** field next to **task**, enter a space followed by *created*.

1. Click or tap inside the **Body** field, display the dynamic content list, and select **due**.

1. In the **Body** field, move the cursor before **due** and enter *This work item is due on* followed by a space.

1. Add an asynchronous HTTP response to the HTTP trigger. On the designer canvas, select the **+** between the HTTP request trigger and the Gmail action, and select **Add a parallel branch**.

   :::image type="content" source="./media/tutorial-send-email/add-http-response.png" alt-text="Screenshot that shows the + sign and Add a parallel branch option highlighted.":::

1. On the **Add an action** screen, enter *response* in the Search field, and then select **Response**.

   :::image type="content" source="./media/tutorial-send-email/choose-response-action.png" alt-text="Screenshot that shows the search bar and Response action highlighted.":::

   By default, the response action sends an `HTTP 200`, which is sufficient for this tutorial. For more information, see [Receive and respond to inbound HTTPS calls sent to workflows in Azure Logic Apps](/azure/connectors/connectors-native-reqres).

1. Select **Save** on the Logic app designer top toolbar.

## Add HTTP request code to app

Copy the URL of the HTTP request trigger if you didn't already. Because it contains sensitive information, it's best not to put this URL directly into your code. You can reference it as an environment variable in App Service app settings instead. The following command creates an app setting called `LOGIC_APP_URL`.

1. In Azure [Cloud Shell](https://shell.azure.com), run the following Azure CLI command to create the App Service app setting. Replace `<app-name>` and `<resource-group-name>` with the names of your App Service app and resource group. Replace `<logic-app-url>` with the HTTP URL you copied from your logic app.

   ```azurecli-interactive
   az webapp config appsettings set --name <app-name> --resource-group <resource-group-name> --settings LOGIC_APP_URL="<logic-app-url>"
   ```

1. In your code, make a standard HTTP post to the URL using an HTTP client language available to your language framework, with the following configuration:

   - Make sure the request contains the heading `Content-Type: application/json`. 

   - Use the same JSON format that you supplied to your logic app in the request body.

   ```json
   {
       "task": "<description>",
       "due": "<date>",
       "email": "<email-address>"
   }
   ```

   - To optimize performance, send the request asynchronously if possible.

Select your preferred language/framework to see an example request:

### [ASP.NET Core](#tab/dotnetcore)

In ASP.NET Core, you can send the HTTP post with the [System.Net.Http.HttpClient](/dotnet/api/system.net.http.httpclient) class. The following code sample requires using `System.Net.Http` and `System.Text.Json`.

The `HttpResponseMessage` requires dependency injection (DI) configuration to access app settings. For more information, see [Access environment variables](configure-language-dotnetcore.md#access-environment-variables).

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
> - This demo code is written for simplicity. In practice, don't instantiate an `HttpClient` object for each request. Follow the guidance at [Use IHttpClientFactory to implement resilient HTTP requests](/dotnet/architecture/microservices/implement-resilient-applications/use-httpclientfactory-to-implement-resilient-http-requests).
>
> - If you're using the sample app from [Tutorial: Build an ASP.NET Core and SQL Database app in Azure App Service](tutorial-dotnetcore-sqldb-app.md), you could use this code to send an email confirmation in the [Create action](https://github.com/Azure-Samples/dotnetcore-sqldb-tutorial/blob/master/Controllers/TodosController.cs#L56-L65) after you add a `Todo` item.

### [ASP.NET](#tab/dotnet)

In ASP.NET, you can send the HTTP post with the [System.Net.Http.HttpClient](/dotnet/api/system.net.http.httpclient) class. For example:

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
> If you're using the sample app from [Tutorial: Build an ASP.NET app in Azure with SQL Database](app-service-web-tutorial-dotnet-sqldatabase.md), you could use this code to send an email confirmation in the [Create action](https://github.com/Azure-Samples/dotnet-sqldb-tutorial/blob/master/DotNetAppSqlDb/Controllers/TodosController.cs#L52-L63) after you add a `Todo` item. To use this asynchronous code, convert the `Create` action to asynchronous.

### [Node.js](#tab/node)

In Node.js, you can send the HTTP post with an npm package like [Axios](https://www.npmjs.com/package/axios). To install Axios, run `npm install --save axios`.

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
> If you're using the sample app from [Tutorial: Build a Node.js and MongoDB app in Azure](tutorial-nodejs-mongodb-app.md), you could use this code to send an email confirmation in the [create function](https://github.com/Azure-Samples/meanjs/blob/master/modules/articles/server/controllers/articles.server.controller.js#L14-L27) after [you save the article successfully](https://github.com/Azure-Samples/meanjs/blob/master/modules/articles/server/controllers/articles.server.controller.js#L24).

### [PHP](#tab/php)

In PHP, you can send the HTTP post with [Guzzle](http://docs.guzzlephp.org/en/stable/index.html), which you can install using [Composer](https://getcomposer.org/) with `composer require guzzlehttp/guzzle:~6.0`.

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
// Requires Laravel to run Log::info(). Check the documentation of your preferred framework for logging instructions.
Log::info(print_r($response, TRUE));
```

> [!NOTE]
> If you're using the sample app from [Tutorial: Build a PHP and MySQL app in Azure](tutorial-php-mysql-app.md), you could use this code to send an email confirmation in the [Route::post function](https://github.com/Azure-Samples/laravel-tasks/blob/master/routes/web.php#L30-L48), just before the return statement.

### [Python](#tab/python)

In Python, you can send the HTTP post with [requests](https://pypi.org/project/requests/). To install, run `pip install requests`.

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
