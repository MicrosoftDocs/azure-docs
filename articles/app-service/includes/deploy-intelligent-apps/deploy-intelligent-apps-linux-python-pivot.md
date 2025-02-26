---
author: jefmarti
ms.service: azure-app-service
ms.devlang: python
ms.custom: linux-related-content
ms.topic: article
ms.date: 04/10/2024
ms.author: jefmarti
---

You can use Azure App Service to work with popular AI frameworks like LangChain and Semantic Kernel, and connect them to OpenAI for creating intelligent apps. In the following tutorial, we are using LangChain to connect to Azure OpenAI in a Python (Flask) application.

#### Prerequisites

- An [Azure OpenAI resource](/azure/ai-services/openai/quickstart?pivots=programming-language-csharp&tabs=command-line%2Cpython#set-up) or an [OpenAI account](https://platform.openai.com/overview).
- A Flask web application. Create the sample app using our [quickstart](../../quickstart-python.md?tabs=flask%2Cwindows%2Cazure-cli%2Cvscode-deploy%2Cdeploy-instructions-azportal%2Cterminal-bash%2Cdeploy-instructions-zip-azcli#sample-application).

### Setup flask web app

For this Flask web application, we are building off the [quickstart](../../quickstart-python.md?tabs=flask%2Cwindows%2Cazure-cli%2Cvscode-deploy%2Cdeploy-instructions-azportal%2Cterminal-bash%2Cdeploy-instructions-zip-azcli#sample-application) app and updating the *app.py* file to send and receive requests to an Azure OpenAI OR OpenAI service using LangChain.

First, copy, and replace the *index.html* file with the following code:

```html
<!doctype html>
<head>
    <title>Hello Azure - Python AI App</title>
    <link rel="stylesheet" href="{{ url_for('static', filename='bootstrap/css/bootstrap.min.css') }}">
    <link rel="shortcut icon" href="{{ url_for('static', filename='favicon.ico') }}">
</head>
<html>
   <body>
     <main>
        <div class="px-4 py-3 my-2 text-center">
            <img class="d-block mx-auto mb-4" src="{{ url_for('static', filename='images/azure-icon.svg') }}" alt="Azure Logo" width="192" height="192"/>
            <h1 class="display-6 fw-bold text-primary">Welcome to Azure</h1>            
          </div>
        <form method="post" action="{{url_for('hello')}}">
            <div class="col-md-6 mx-auto text-center">
                <label for="req" class="form-label fw-bold fs-5">Input query below:</label>

                <div class="d-grid gap-2 d-sm-flex justify-content-sm-center align-items-center my-1">
                    <input type="text" class="form-control" id="req" name="req" style="max-width: 456px;">
                  </div>            
                <div class="d-grid gap-2 d-sm-flex justify-content-sm-center my-2">
                  <button type="submit" class="btn btn-primary btn-lg px-4 gap-3">Submit Request</button>
                </div>            
            </div>
        </form>
     </main>      
   </body>
</html>
```

Next, copy, and replace the *hello.html* file with the following code:

```html
<!doctype html>
<head>
    <title>Hello Azure - Python AI App</title>
    <link rel="stylesheet" href="{{ url_for('static', filename='bootstrap/css/bootstrap.min.css') }}">
    <link rel="shortcut icon" href="{{ url_for('static', filename='favicon.ico') }}">
</head>
<html>
   <body>
     <main>
        <div class="px-4 py-3 my-2 text-center">
            <img class="d-block mx-auto mb-4" src="{{ url_for('static', filename='images/azure-icon.svg') }}" alt="Azure Logo" width="192" height="192"/>
            <h1 class="display-6 fw-bold">OpenAI response:</h1>
            <p class="fs-5">
                {{req}}
            </p>
            <a href="{{ url_for('index') }}" class="btn btn-primary btn-lg px-4 gap-3">Back home</a>
          </div>
     </main>      
   </body>
</html>
```

After the files are updated, we can start preparing our environment variables to work with OpenAI.

### API Keys and Endpoints

In order to make calls to OpenAI with your client, you need to first grab the Keys and Endpoint values from Azure OpenAI, or OpenAI, and add them as secrets for use in your application. Retrieve and save the values for later use.

For Azure OpenAI, see [this documentation](/azure/ai-services/openai/quickstart?pivots=programming-language-csharp&tabs=command-line%2Cpython#retrieve-key-and-endpoint) to retrieve the following values. If you're planning to use [managed identity](../../overview-managed-identity.md) to secure your app, you won't need the API key value.

- API key: Make sure to save this value as a secret. Only needed if you're not using managed identity.
- Model name: The name of the chat completion model, like "gpt-4o".
- Deployment name: This is sometimes the same as the model name, but you may have chosen to use a different name. This differentiates between different deployments of the same model.
- Endpoint: A URL like "https://cog-xxk4qzq3tahic.openai.azure.com/"
- API version: The desired API version, like "2024-10-21". See the [version history documentation](https://learn.microsoft.com/azure/ai-services/openai/api-version-deprecation) for the latest version.

For OpenAI, see this [documentation](https://platform.openai.com/docs/api-reference) to retrieve the API keys. For our application, you need the following values:

- API key: Make sure to save this value as a secret.
- Model name: The name of the chat completion model, like "gpt-4o".

#### Secure your API keys in KeyVault

Since we are deploying to App Service, we can secure the API key in **Azure Key Vault** for protection. Follow the [Quickstart](/azure/key-vault/secrets/quick-create-cli#create-a-key-vault) to set up your Key Vault and add the key as a secret named 'openaikey'.

Next, we can use Key Vault references as app settings in our App Service resource to reference in our application. Follow the instructions in the [documentation](../../app-service-key-vault-references.md?source=recommendations&tabs=azure-cli) to grant your app access to your Key Vault and to set up Key Vault references.

Then, go to the portal Environment Variables blade in your resource and add the following app settings:

| Setting name| Value |
|:-----------------:|:------------------------------------------------------------------------------------------:|
| `OPENAI_API_KEY` | @Microsoft.KeyVault(SecretUri=https://myvault.vault.azure.net/secrets/openaikey/) |

#### Store your app settings

The remaining app settings can be stored as standard environment variables. Go to the portal Environment Variables blade in your resource and add the following app settings:

For Azure OpenAI:

| Setting name                | Value            |
|----------------------------|------------------|
| `OPENAI_MODEL_NAME`        | Model name       |
| `AZURE_OPENAI_DEPLOYMENT_NAME` | Deployment name |
| `AZURE_OPENAI_ENDPOINT`    | Endpoint         |
| `AZURE_OPENAI_API_VERSION` | API version      |

For OpenAI, you only need one environment variable:

| Setting name         | Value       |
|---------------------|-------------|
| `OPENAI_MODEL_NAME` | Model name  |

Once your app settings are saved, you can access the app settings in your code by referencing them in your application. Add the following to the *app.py* file:

For Azure OpenAI:

```python
azure_endpoint = os.environ['AZURE_OPENAI_ENDPOINT']
azure_deployment = os.environ['AZURE_OPENAI_DEPLOYMENT_NAME']
model_name = os.environ['OPENAI_MODEL_NAME']
api_version = os.environ['AZURE_OPENAI_API_VERSION']
# Only needed if you're not using managed identity
api_key = os.environ['OPENAI_API_KEY']
```

For OpenAI:

```python
api_key = os.environ['OPENAI_API_KEY']
model_name = os.environ['OPENAI_MODEL_NAME']
```

### LangChain

LangChain is a framework that enables easy development with OpenAI for your applications. You can use LangChain with Azure OpenAI and OpenAI models.

To create the OpenAI client, we'll first start by installing the LangChain library.

To install LangChain, open the `requirements.txt` file and add `langchain-openai` to the file. Then, run the following command to install the package:

```python
pip install -r requirements.txt
```

Once the package is installed, you can import and use LangChain. Update the *app.py* file with the following code:

```python
import os

# OpenAI
from langchain_openai import ChatOpenAI

# Azure OpenAI
from langchain_openai import AzureChatOpenAI
```

After LangChain is imported into our file, you can add the code that will call OpenAI with LangChain's `invoke` method. Update *app.py* to include the following code:

For Azure OpenAI, use the following code. If you plan to use managed identity, you can use the credentials outlined in the following section for the Azure OpenAI parameters. 

```python
@app.route('/hello', methods=['POST'])
def hello():
   req = request.form.get('req')

   llm = AzureChatOpenAI(
       api_key=api_key,
       api_version=api_version,
       azure_deployment=azure_deployment,
       model_name=model_name,
   )
   text = llm.invoke(req).content
```

For OpenAI, use the following code:

```python
@app.route('/hello', methods=['POST'])
def hello():
   req = request.form.get('req')

   llm = ChatOpenAI(openai_api_key=api_key)
   text = llm.invoke(req).content
```

Here's the example in its completed form. In this example, use the Azure OpenAI chat completion service OR the OpenAI chat completion service, not both.

```python
import os
# Azure OpenAI
from langchain_openai import AzureChatOpenAI
# OpenAI
from langchain_openai import ChatOpenAI

from flask import (Flask, redirect, render_template, request,
                   send_from_directory, url_for)

app = Flask(__name__)

# Azure OpenAI
azure_endpoint = os.environ['AZURE_OPENAI_ENDPOINT']
azure_deployment = os.environ['AZURE_OPENAI_DEPLOYMENT_NAME']
model_name = os.environ['OPENAI_MODEL_NAME']
api_version = os.environ['AZURE_OPENAI_API_VERSION']
# Only needed if you're not using managed identity
api_key = os.environ['OPENAI_API_KEY']

# OpenAI
# api_key = os.environ['OPENAI_API_KEY']

@app.route('/')
def index():
   print('Request for index page received')
   return render_template('index.html')

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                               'favicon.ico', mimetype='image/vnd.microsoft.icon')

@app.route('/hello', methods=['POST'])
def hello():
    req = request.form.get('req')

    # Azure OpenAI
    llm = AzureChatOpenAI(
        azure_endpoint=azure_endpoint,
        azure_deployment=azure_deployment,
        model_name=model_name,
        api_version=api_version,
        api_key=api_key
    )
    text = llm.invoke(req).content

    # OpenAI
    #llm = ChatOpenAI(openai_api_key=api_key)
    #text = llm.invoke(req).content

    if req:
        print('Request for hello page received with req=%s' % req)
        return render_template('hello.html', req=text)
    else:
        print('Request for hello page received with no name or blank name -- redirecting')
        return redirect(url_for('index'))

if __name__ == '__main__':
    app.run()
```

Now save the application and either follow the [deployment steps](#deploy-to-app-service) to deploy the application to Azure App Service, or [run the application locally](#local-development-server) to test it.


### Secure your app with managed identity

Although optional, it's highly recommended to secure your application using [managed identity](../../overview-managed-identity.md) to authenticate your app to your Azure OpenAI resource. Skip this step if you are not using Azure OpenAI. This enables your application to access the Azure OpenAI resource without needing to manage API keys.

Follow the steps below to secure your application:

1. Add the identity package `azure-identity` to your `requirements.txt` file and reinstall the packages:

    ```bash
    pip install -r requirements.txt
    ```

2. Import the default credential and bearer token provider.

    ```python
    from azure.identity import DefaultAzureCredential, get_bearer_token_provider
    ```

3. Create a token provider based off of `DefaultAzureCredential`, and pass that to the `AzureChatOpenAI` options.

    ```python
    token_provider = get_bearer_token_provider(
        DefaultAzureCredential(), "https://cognitiveservices.azure.com/.default"
    )

    llm = AzureChatOpenAI(
        api_version=api_version,
        azure_deployment=azure_deployment,
        azure_endpoint=azure_endpoint,
        model_name=model_name,
        azure_ad_token_provider=token_provider
    )
    ```

Once the credential code is added to the application, you'll then need to enable managed identity in your application and grant access to the resource.

1. In your web app resource, navigate to the **Identity** blade and turn on **System assigned** and click **Save**
2. Once System assigned identity is turned on, it registers the web app with Microsoft Entra ID and the web app can be granted permissions to access protected resources.  
3. Go to your Azure OpenAI resource and navigate to the **Access control (IAM)** blade on the left pane.  
4. Find the Grant access to this resource card and click on **Add role assignment**
5. Search for the **Cognitive Services OpenAI User** role and click **Next**
6. On the **Members** tab, find **Assign access to** and choose the **Managed identity** option
7. Next, click on **+Select Members**  and find your web app
8. Click **Review + assign**

Your web app is now added as a "Cognitive Service OpenAI User" and can communicate to your Azure OpenAI resource.

### Deploy to App Service

Go to the Azure portal and navigate to the Environment variables. If you're using Visual Studio to deploy, this app setting enables the same build automation as Git deploy. 
Add the following App setting to your web app:

| Setting name| Value |
|-|-|
| `SCM_DO_BUILD_DURING_DEPLOYMENT` | true |

You're ready to deploy to App Service and you can deploy as you normally would. If you run into any issues remember that you need to have done the following: grant your app access to your Key Vault, add the app settings with key vault references as your values. App Service resolves the app settings in your application that match what you've added in the portal.

## Local development server

If you would like to test the app locally, create a `.env` file with the appropriate values:

Azure OpenAI:

```bash
OPENAI_MODEL_NAME=gpt-4o
AZURE_OPENAI_DEPLOYMENT_NAME=chat
AZURE_OPENAI_ENDPOINT=https://cog-xxk4qzq3tahic.openai.azure.com/
AZURE_OPENAI_API_VERSION=2024-10-21
# Only needed if you're not using managed identity
OPENAI_API_KEY=keyhere
```

OpenAI:

```bash
OPENAI_MODEL_NAME=gpt-4o
OPENAI_API_KEY=keyhere
```

Add the `python-dotenv` package to `requirements.txt` and reinstall the packages:

```bash
pip install -r requirements.txt
```

Then, update the *app.py* file to include the following code:

```python
from dotenv import load_dotenv

load_dotenv()
```

Now you can run the application locally using the following command:

```bash
python app.py
```

### Authentication

Although optional, it's highly recommended that you also add authentication to your web app when using an Azure OpenAI or OpenAI service. This can add a level of security with no other code. Learn how to enable authentication for your web app [here](../../scenario-secure-app-authentication-app-service.md).

Once deployed, browse to the web app and navigate to the OpenAI tab. Enter a query to the service and you should see a populated response from the server.
