---
author: jefmarti
ms.service: azure-app-service
ms.devlang: node
ms.custom: linux-related-content
ms.topic: article
ms.date: 09/30/2024
ms.author: jefmarti
---

You can use Azure App Service to create applications by using Azure OpenAI and OpenAI. In this article, you add Azure OpenAI Service to an Express application by using the Azure SDK.

#### Prerequisites

- An [Azure OpenAI resource](/azure/ai-services/openai/quickstart?pivots=programming-language-csharp&tabs=command-line%2Cpython#set-up) or an [OpenAI account](https://platform.openai.com/overview).
- A Node.js Express application. Create the sample app by using the [quickstart](/azure/app-service/quickstart-nodejs?tabs=linux&pivots=development-environment-vscode).

### Set up a web app

For this application, you're building off the [quickstart](/azure/app-service/quickstart-nodejs?tabs=linux&pivots=development-environment-vscode) Express app and adding an extra feature to make a request to an Azure OpenAI or OpenAI service.

First, copy and replace the `index.ejs` file with the following code:

```html
<!DOCTYPE html>
<html>
  <head>
    <title><%= title %></title>
    <link rel='stylesheet' href='/stylesheets/style.css' />
  </head>
    <body>
      <h1><%= title %></h1>
      <p>Welcome to <%= title %></p>
      <form action="/api/completions" method="post">
          <label for="prompt"><b>Input query:</b></label>
          <input type="text" id="prompt" name="prompt" style="width: 10%">
          <input type="submit" value="Submit" id="submitBtn">
      </form>
    </body>

  <script src="./index.js"></script>
</html>
```

The preceding code adds an input box to the index page to submit requests to OpenAI.

### API keys and endpoints

Get the keys and endpoint values from Azure OpenAI or OpenAI and add them as secrets for use in your application. Retrieve and save the values for later use to build the client.

For Azure OpenAI, see [this documentation](/azure/ai-services/openai/quickstart?pivots=programming-language-csharp&tabs=command-line%2Cpython#retrieve-key-and-endpoint) to retrieve the key and endpoint values. If you're planning to use a managed identity to secure your app, you need only the `deploymentName` and `apiVersion` values.

Otherwise, you need each of the following values:

For Azure OpenAI, use the following settings:

- `endpoint`
- `apiKey`
- `deploymentName`
- `apiVersion`

For OpenAI, see [this documentation](https://platform.openai.com/docs/api-reference) to retrieve the API keys. For this application, you need the following values:

- `apiKey`

Because you're deploying to App Service, you can put these secrets in Azure Key Vault for protection. Follow the [quickstart](/azure/key-vault/secrets/quick-create-cli#create-a-key-vault) to set up your key vault and add the secrets that you saved from earlier.

Next, you can use key vault references as app settings in your App Service resource to reference in the application. Follow the instructions in the [documentation](../../app-service-key-vault-references.md?source=recommendations&tabs=azure-cli) to grant your app access to your key vault and to set up key vault references.

Then, go to the portal **Environment Variables** page in your resource and add the following app settings.

For Azure OpenAI, use the following settings:

| Setting name| Value |
|-|-|-|
| `DEPLOYMENT_NAME` | @Microsoft.KeyVault(SecretUri=https://myvault.vault.azure.net/secrets/mysecret/) |
| `ENDPOINT` | @Microsoft.KeyVault(SecretUri=https://myvault.vault.azure.net/secrets/mysecret/) |
| `API_KEY` | @Microsoft.KeyVault(SecretUri=https://myvault.vault.azure.net/secrets/mysecret/) |
| `API_VERSION` | @Microsoft.KeyVault(SecretUri=https://myvault.vault.azure.net/secrets/mysecret/) |

For OpenAI, use the following settings:

| Setting name| Value |
|-|-|-|
| `OPENAI_API_KEY` | @Microsoft.KeyVault(SecretUri=https://myvault.vault.azure.net/secrets/mysecret/) |

Your app settings are saved. You can access the app settings in your code by referencing them in your application. Add the following to the `app.js` file:

For Azure OpenAI:

```jsx
// access environment variables
const endpoint = process.env.ENDPOINT;
const apiKey = process.env.API_KEY;
const deployment = process.env.DEPLOYMENT_NAME;
const apiVersion = process.env.API_VERSION;
```

For OpenAI:

```jsx
const apiKey = process.env.API_KEY;
```

### Add the OpenAI package

Before you can create the client, add the Azure OpenAI package. Add the following OpenAI package by using the Node package manager.

For Azure OpenAI:

```powershell
npm install openai @azure/openai
```

For OpenAI:

```powershell
npm install openai
```

### Create OpenAI client

After the package and environment variables are set up, you can create the client that enables chat completion calls.

Add the following code to create the OpenAI client:

For Azure OpenAI:

```jsx
  const { AzureOpenAI } = require("openai");
  
  const client = new AzureOpenAI({
    endpoint: endpoint,
    deployment: deployment,
    apiKey: apiKey,
    apiVersion: apiVersion,
  });
```

For OpenAI:

```jsx
import OpenAI from 'openai';

  const client = OpenAI({
    apiKey: apiKey,
  });
```

### Secure your app by using a managed identity

Although optional, we highly recommend that you secure your application by using a [managed identity](../../overview-managed-identity.md) to authenticate your app to your Azure OpenAI resource. This process enables your application to access the Azure OpenAI resource without needing to manage API keys. Skip this step if you're not using Azure OpenAI.

To secure your application, complete the following tasks.

Install the Azure identity package using the Node package manager.

```powershell
npm install @azure/identity
```

Create a token provider by using the default Azure credential.

```jsx
const credential = new DefaultAzureCredential();
const scope = "https://cognitiveservices.azure.com/.default";
const azureADTokenProvider = getBearerTokenProvider(credential, scope);
```

Create the Azure OpenAI client with the token provider.

```jsx
  const deployment = deployment;
  const apiVersion = apiVersion;
  const client = new AzureOpenAI({ azureADTokenProvider, deployment, apiVersion });
```

After the credentials are added to the application, enable a managed identity in your application and grant access to the resource:

1. In your web app resource, go to the **Identity** pane and turn on **System assigned**. Select **Save**.
1. After system-assigned identity is turned on, it will register the web app with Microsoft Entra ID and the web app can be granted permissions to access protected resources.
1. Go to your Azure OpenAI resource, and then go to **Access control (IAM)** on the left pane.
1. Find the **Grant access to this resource** card and select **Add role assignment**.
1. Search for the **Cognitive Services OpenAI User** role and select **Next**.
1. On the **Members** tab, find **Assign access to** and choose the **Managed identity** option.
1. Choose **+Select Members** and find your web app.
1. Select **Review + assign**.

Your web app is now added as a cognitive service OpenAI user and can communicate to your Azure OpenAI resource.

### Set up a prompt and call to OpenAI

You can use chat completions to send your request message to OpenAI and return a response. Add your chat message prompt to the code to be passed to the chat completions method. Use the following code to set up chat completions:

```jsx
app.post("/api/completions", async (req, res) => {

  // Azure OpenAI client 
  const client = new AzureOpenAI({
    endpoint: endpoint,
    deployment: deployment,
    apiKey: apiKey,
    apiVersion: apiVersion,
  });
  
  // OpenAI client
  const client = OpenAI({
    apiKey: apiKey,
  });

  const prompt = req.body.prompt;

  const chatCompletions = await client.chat.completions.create({
    messages: [
      { role: "system", content: "You are a helpful assistant" },
      { role: "user", content: prompt },
    ],
    model: "",
    max_tokens: 128,
    stream: true,
  });

  var response = "";

  for await (const chatCompletion of chatCompletions) {
    for (const choice of chatCompletion.choices) {
      response += choice.delta?.content;
    }
  }

  console.log(response);

  res.send(response);
});
```

This post function creates the OpenAI client and adds the message being sent to OpenAI with a returned response.

Here's the example in its completed form. In this example, use the Azure OpenAI chat completion service *or* the OpenAI chat completion service, not both.

```jsx
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { AzureOpenAI } = require("openai");
//import OpenAI from 'openai';

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// variables
const endpoint = "your-openai-endpoint";
const apiKey = "your-openai-apikey";
const deployment = "your-openai-deployment-name";
const apiVersion = "your-openai-api-version";

// chat completion
app.post("/api/completions", async (req, res) => {

  const client = new AzureOpenAI({
     endpoint: endpoint,
     deployment: deployment,
     apiKey: apiKey,
     apiVersion: apiVersion,
   });

  // OpenAI client
  // const client = OpenAI({
  //   apiKey: apiKey,
  // });

  const prompt = req.body.prompt;

  const chatCompletions = await client.chat.completions.create({
    messages: [
      { role: "system", content: "You are a helpful assistant" },
      { role: "user", content: prompt },
    ],
    model: "",
    max_tokens: 128,
    stream: true,
  });

  var response = "";

  for await (const chatCompletion of chatCompletions) {
    for (const choice of chatCompletion.choices) {
      response += choice.delta?.content;
    }
  }

  console.log(response);

  res.send(response);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

```

### Deploy to App Service

You can now deploy to App Service as you normally would. If you run into any issues, make sure that you completed the following steps: granted your app access to your key vault and added the app settings with key vault references as your values. App Service resolves the app settings in your application that match what you added in the portal.

After the app is deployed, you can visit your site URL and see the text that contains the response from your chat message prompt.

### Authentication

Although optional, we highly recommend that you also add authentication to your web app when using an Azure OpenAI or OpenAI service. Adding authentication can add a level of security with no other code. Learn how to enable authentication for your web app [here](../../scenario-secure-app-authentication-app-service.md).

After deployment, browse to the web app and go to the OpenAI tab. Enter a query to the service and you should see a populated response from the server.
