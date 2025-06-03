---
title: Intelligent app with Azure OpenAI (Express.js)
description: Learn how to build and deploy a Node.js web app to Azure App Service that connects to Azure OpenAI using managed identity.
author: jefmarti
ms.author: jefmarti
ms.date: 05/19/2025
ms.topic: tutorial
ms.custom:
  - devx-track-node
  - linux-related-content
  - build-2025
ms.collection: ce-skilling-ai-copilot
---

# Tutorial: Build a chatbot with Azure App Service and Azure OpenAI (Express.js)

In this tutorial, you'll build an intelligent AI application by integrating Azure OpenAI with a Node.js application and deploying it to Azure App Service. You'll create an Express app with a view and a controller that sends chat completion requests to a model in Azure OpneAI.

:::image type="content" source="media/tutorial-ai-openai-chatbot-nodejs/chat-in-browser.png" alt-text="Screenshot showing chatbot running in Azure App Service.":::

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create an Azure OpenAI resource and deploy a language model.
> * Build an Express.js application that connects to Azure OpenAI.
> * Deploy the application to Azure App Service.
> * Implement passwordless secure authentication both in the development environment and in Azure.

## Prerequisites

- An [Azure account](https://azure.microsoft.com/free/) with an active subscription
- A [GitHub account](https://github.com/join) for using GitHub Codespaces

## 1. Create an Azure OpenAI resource

[!INCLUDE [tutorial-ai-openai-chatbot/create-openai-resource](includes/tutorial-ai-openai-chatbot/create-openai-resource.md)]

## 2. Create and set up an Express.js web app

1. In your Codespace terminal, create an Express.js template in the workspace and try running it the first time.

    ```bash
    npx express-generator . --view ejs
    npm audit fix --force
    npm install && npm start
    ```

    You should see a notification in GitHub Codespaces indicating that the app is available at a specific port. Select **Open in browser** to launch the app in a new browser tab.

2. Back in the Codespace terminal, stop the app with Ctrl+C.

3. Install the NPM dependencies for working with Azure OpenAI:

    ```bash
    npm install openai @azure/openai @azure/identity
    ```
    
4. Open *views/index.ejs* and replace it with the following code, for a simple chat interface.

    ```html
    <!DOCTYPE html>
    <html>
      <head>
        <title><%= title %></title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
      </head>
      <body class="bg-light">
        <div class="container py-4">
          <h1 class="mb-4"><%= title %></h1>
          <div class="card mb-3">
            <div class="card-body" style="min-height: 80px;">
              <form action="/chat" method="POST" class="d-flex gap-2 mb-3">
                <input type="text" name="message" class="form-control" placeholder="Type your message..." autocomplete="off" required />
                <button type="submit" class="btn btn-primary">Send</button>
              </form>
              <% if (aiMessage) { %>
                <div class="mb-2">
                  <span class="fw-bold text-success">AI:</span>
                  <span class="ms-2"><%= aiMessage %></span>
                </div>
              <% } %>
            </div>
          </div>
        </div>
      </body>
    </html>
    ```
    
5. Open routes/index.js and replace its content with the following code, for a simple chat completion call with Azure OpenAI:

    ```javascript
    var express = require('express');
    var router = express.Router();
    const { AzureOpenAI } = require('openai');
    const { getBearerTokenProvider, DefaultAzureCredential } = require('@azure/identity');
    
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const deployment = 'gpt-4o-mini';
    const apiVersion = '2024-10-21';
    
    const credential = new DefaultAzureCredential();
    const scope = 'https://cognitiveservices.azure.com/.default';
    const azureADTokenProvider = getBearerTokenProvider(credential, scope);
    
    // Initialize Azure OpenAI client using Microsoft Entra authentication
    const openai = new AzureOpenAI({ endpoint, azureADTokenProvider, deployment, apiVersion });
    
    router.get('/', function(req, res, next) {
      res.render('index', { title: 'Express Chat', aiMessage: null });
    });
    
    router.post('/chat', async function(req, res, next) {
      const userMessage = req.body.message;
      if (!userMessage) {
        return res.redirect('/');
      }
      let aiMessage = '';
      try {
        // Call Azure OpenAI chat completion
        const result = await openai.chat.completions.create({
          model: deployment,
          messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: userMessage }
          ],
        });
        aiMessage = result.choices[0]?.message?.content || '';
      } catch (err) {
        aiMessage = 'Error: Unable to get response from Azure OpenAI.';
      }
      res.render('index', { title: 'Express Chat', aiMessage });
    });
    
    module.exports = router;
    ```
    
6. In the terminal, retrieve your OpenAI endpoint:

    ```bash
    az cognitiveservices account show \
      --name $OPENAI_SERVICE_NAME \
      --resource-group $RESOURCE_GROUP \
      --query properties.endpoint \
      --output tsv
    ```

7. Run the app again by adding `AZURE_OPENAI_ENDPOINT` with its value from the CLI output:

   ```bash
   AZURE_OPENAI_ENDPOINT=<output-from-previous-cli-command> npm start
   ```

8. Select **Open in browser** to launch the app in a new browser tab. Submit a question and see if you get a response message.

## 3. Deploy to Azure App Service and configure OpenAI connection

Now that your app works locally, let's deploy it to Azure App Service and set up a service connection to Azure OpenAI using managed identity.

1. First, deploy your app to Azure App Service using the Azure CLI command `az webapp up`. This command creates a new web app and deploys your code to it:

    ```azurecli
    az webapp up \
      --resource-group $RESOURCE_GROUP \
      --location $LOCATION \
      --name $APPSERVICE_NAME \
      --plan $APPSERVICE_NAME \
      --sku B1 \
      --os-type Linux \
      --track-status false
    ```

   This command might take a few minutes to complete. It creates a new web app in the same resource group as your OpenAI resource.

2. After the app is deployed, create a service connection between your web app and the Azure OpenAI resource using managed identity:

    ```azurecli
    az webapp connection create cognitiveservices \
      --resource-group $RESOURCE_GROUP \
      --name $APPSERVICE_NAME \
      --target-resource-group $RESOURCE_GROUP \
      --account $OPENAI_SERVICE_NAME \
      --connection azure-openai \
      --system-identity
    ```

   This command creates a connection between your web app and the Azure OpenAI resource by: 

    - Generating system-assigned managed identity for the web app.
    - Adding the Cognitive Services OpenAI Contributor role to the managed identity for the Azure OpenAI resource.
    - Adding the `AZURE_OPENAI_ENDPOINT` app setting to your web app.

3. Open the deployed web app in the browser. Find the URL of the deployed web app in the terminal output. Open your web browser and navigate to it.

    ```azurecli
    az webapp browse
    ```    

4. Type a message in the textbox and select "**Send**, and give the app a few seconds to reply with the message from Azure OpenAI.

    :::image type="content" source="media/tutorial-ai-openai-chatbot-nodejs/chat-in-browser.png" alt-text="Screenshot showing chatbot running in Azure App Service.":::

Your app is now deployed and connected to Azure OpenAI with managed identity.

## Frequently asked questions

- [What if I want to connect to OpenAI instead of Azure OpenAI?](#what-if-i-want-to-connect-to-openai-instead-of-azure-openai)
- [Can I connect to Azure OpenAI with an API key instead?](#can-i-connect-to-azure-openai-with-an-api-key-instead)
- [How does DefaultAzureCredential work in this tutorial?](#how-does-defaultazurecredential-work-in-this-tutorial)

---

### What if I want to connect to OpenAI instead of Azure OpenAI?

To connect to OpenAI instead, use the following code:

```javascript
const { OpenAI } = require('openai');

const client = new OpenAI({
  apiKey: "<openai-api-key>",
});
```

For more information, see [OpenAI API authentication](https://platform.openai.com/docs/api-reference/authentication).

When working with connection secrets in App Service, you should use [Key Vault references](app-service-key-vault-references.md) instead of storing secrets directly in your codebase. This ensures that sensitive information remains secure and is managed centrally.

---

### Can I connect to Azure OpenAI with an API key instead?

Yes, you can connect to Azure OpenAI using an API key instead of managed identity. For more information, see the [Azure OpenAI JavaScript quickstart](/azure/ai-services/openai/chatgpt-quickstart?pivots=programming-language-javascript).

When working with connection secrets in App Service, you should use [Key Vault references](app-service-key-vault-references.md) instead of storing secrets directly in your codebase. This ensures that sensitive information remains secure and is managed centrally.

---

### How does DefaultAzureCredential work in this tutorial?

The `DefaultAzureCredential` simplifies authentication by automatically selecting the best available authentication method:

- **During local development**: After you run `az login`, it uses your local Azure CLI credentials.
- **When deployed to Azure App Service**: It uses the app's managed identity for secure, passwordless authentication.

This approach lets your code run securely and seamlessly in both local and cloud environments without modification.

## Next steps

- [Tutorial: Build a Retrieval Augmented Generation with Azure OpenAI and Azure AI Search (Express.js)](tutorial-ai-openai-search-nodejs.md)
- [Tutorial: Run chatbot in App Service with a Phi-4 sidecar extension (Express.js)](tutorial-ai-slm-expressjs.md)
- [Create and deploy an Azure OpenAI Service resource](/azure/ai-services/openai/how-to/create-resource)
- [Configure Azure App Service](/azure/app-service/configure-common)
- [Enable managed identity for your app](overview-managed-identity.md)
