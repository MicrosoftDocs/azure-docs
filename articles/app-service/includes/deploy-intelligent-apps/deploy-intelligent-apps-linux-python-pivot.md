---
author: jefmarti
ms.service: app-service
ms.devlang: python
ms.topic: article
ms.date: 04/10/2024
ms.author: jefmarti
---

You can use Azure App Service to work with popular AI frameworks like LangChain and Semantic Kernel connected to OpenAI for creating intelligent apps. In the following tutorial, we are adding an Azure OpenAI service using LangChain to a Python (Flask) application.

#### Prerequisites

- An [Azure OpenAI resource](../../../ai-services/openai/quickstart.md?pivots=programming-language-csharp&tabs=command-line%2Cpython#set-up) or an [OpenAI account](https://platform.openai.com/overview).
- A Flask web application. Create the sample app using our [quickstart](../../quickstart-python.md?tabs=flask%2Cwindows%2Cazure-cli%2Cvscode-deploy%2Cdeploy-instructions-azportal%2Cterminal-bash%2Cdeploy-instructions-zip-azcli#1---sample-application).

### Setup flask web app

For this Flask web application, we are building off the [quickstart](../../quickstart-python.md?tabs=flask%2Cwindows%2Cazure-cli%2Cvscode-deploy%2Cdeploy-instructions-azportal%2Cterminal-bash%2Cdeploy-instructions-zip-azcli#1---sample-application) app and updating the *app.py* file to send and receive requests to an Azure OpenAI OR OpenAI service using LangChain.

First, copy and replace the *index.html* file with the following code:

```html
<!doctype html>
<head>
    <title>Hello Azure - Python Quickstart</title>
    <link rel="stylesheet" href="{{ url_for('static', filename='bootstrap/css/bootstrap.min.css') }}">
    <link rel="shortcut icon" href="{{ url_for('static', filename='favicon.ico') }}">
</head>
<html>
   <body>
     <main>
        <div class="px-4 py-3 my-2 text-center">
            <img class="d-block mx-auto mb-4" src="{{ url_for('static', filename='images/azure-icon.svg') }}" alt="Azure Logo" width="192" height="192"/>
            <!-- <img  src="/docs/5.1/assets/brand/bootstrap-logo.svg" alt="" width="72" height="57"> -->
            <h1 class="display-6 fw-bold text-primary">Welcome to Azure</h1>            
          </div>
        <form method="post" action="{{url_for('hello')}}">
            <div class="col-md-6 mx-auto text-center">
                <label for="req" class="form-label fw-bold fs-5">Input query below:</label>

                <!-- <p class="lead mb-2">Could you please tell me your name?</p> -->
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

Next, copy and replace the *hello.html* file with the following code:

```html
<!doctype html>
<head>
    <title>Hello Azure - Python Quickstart</title>
    <link rel="stylesheet" href="{{ url_for('static', filename='bootstrap/css/bootstrap.min.css') }}">
    <link rel="shortcut icon" href="{{ url_for('static', filename='favicon.ico') }}">
</head>
<html>
   <body>
     <main>
        <div class="px-4 py-3 my-2 text-center">
            <img class="d-block mx-auto mb-4" src="{{ url_for('static', filename='images/azure-icon.svg') }}" alt="Azure Logo" width="192" height="192"/>
            <!-- <img  src="/docs/5.1/assets/brand/bootstrap-logo.svg" alt="" width="72" height="57"> -->
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

In order to make calls to OpenAI with your client, you need to first grab the Keys and Endpoint values from Azure OpenAI, or OpenAI and add them as secrets for use in your application. Retrieve and save the values for later use.

For Azure OpenAI, see [this documentation](../../../ai-services/openai/quickstart.md?pivots=programming-language-csharp&tabs=command-line%2Cpython#retrieve-key-and-endpoint) to retrieve the key and endpoint values. For our application, you need the following values:

- `api_key`
- `api_version`
- `azure_deployment`
- `model_name`

For OpenAI, see this [documentation](https://platform.openai.com/docs/api-reference) to retrieve the API keys. For our application, you need the following values:

- `apiKey`

Since we are deploying to App Service, we can secure these secrets in **Azure Key Vault** for protection. Follow the [Quickstart](../../../key-vault/secrets/quick-create-cli.md#create-a-key-vault) to set up your Key Vault and add the secrets you saved from earlier.

Next, we can use Key Vault references as app settings in our App Service resource to reference in our application. Follow the instructions in the [documentation](../../app-service-key-vault-references.md?source=recommendations&tabs=azure-cli) to grant your app access to your Key Vault and to set up Key Vault references.

Then, go to the portal Environment Variables blade in your resource and add the following app settings:

For Azure OpenAI, use the following:

| Setting name| Value |
|-|-|-|
| `DEPOYMENT_NAME` | @Microsoft.KeyVault(SecretUri=https://myvault.vault.azure.net/secrets/mysecret/) |
| `ENDPOINT` | @Microsoft.KeyVault(SecretUri=https://myvault.vault.azure.net/secrets/mysecret/) |
| `API_KEY` | @Microsoft.KeyVault(SecretUri=https://myvault.vault.azure.net/secrets/mysecret/) |
| `MODEL_ID` | @Microsoft.KeyVault(SecretUri=https://myvault.vault.azure.net/secrets/mysecret/) |


For OpenAI, use the following:

| Setting name| Value |
|-|-|-|
| `OPENAI_API_KEY` | @Microsoft.KeyVault(SecretUri=https://myvault.vault.azure.net/secrets/mysecret/) |

Once your app settings are saved, you can access the app settings in your code by referencing them in your application. Add the following to the *app.py `http://app.py` file:*

For Azure OpenAI:
```python
# Azure OpenAI
api_key = os.environ['API_KEY']
api_version = os.environ['API_VERSION']
azure_deployment = os.environ['AZURE_DEPLOYMENT']
model_name = os.environ['MODEL_NAME']
```

For OpenAI: 
```python
# OpenAI
openai_api_key = os.environ['OPENAI_API_KEY']
```

### LangChain

LangChain is a framework that enables easy development with OpenAI for your applications. You can use LangChain with Azure OpenAI and OpenAI models.

To create the OpenAI client, we'll first start by installing the LangChain library.

To install LangChain, navigate to your application using Command Line or PowerShell and run the following pip command:

```python
pip install langchain-openai
```

Once the package is installed, you can import and use LangChain. Update the * app.py `http://app.py`* file with the following code:

```python
import os

# OpenAI
from langchain_openai import ChatOpenAI

~~# Azure OpenAI
from langchain_openai import AzureOpenAI~~

```

After LangChain is imported into our file, you can add the code that will call to OpenAI with the LangChain invoke chat method. Update *app.py `http://app.py`* to include the following code:

For Azure OpenAI, use the following code:

```python
@app.route('/hello', methods=['POST'])
def hello():
   req = request.form.get('req')

   llm = AzureOpenAI(
       api_key=api_key,
       api_version=api_version,
       azure_deployment=azure_deployment,
       model_name=model_name,
   )
   text = llm.invoke(req)
```

For OpenAI, use the following code:

```python
@app.route('/hello', methods=['POST'])
def hello():
   req = request.form.get('name')

   llm = ChatOpenAI(openai_api_key=openai_api_key)
   text = llm.invoke(req)

```

Here's the example in its completed form. In this example, use the Azure OpenAI chat completion service OR the OpenAI chat completion service, not both.

```python
import os
# Azure OpenAI
from langchain_openai import AzureOpenAI
# OpenAI
from langchain_openai import ChatOpenAI

from flask import (Flask, redirect, render_template, request,
                   send_from_directory, url_for)

app = Flask(__name__)

@app.route('/')
def index():
   print('Request for index page received')
   return render_template('index.html')

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                               'favicon.ico', mimetype='image/vnd.microsoft.icon')

# Azure OpenAI
api_key = os.environ['API_KEY']
api_version = os.environ['API_VERSION']
azure_deployment = os.environ['AZURE_DEPLOYMENT']
model_name = os.environ['MODEL_NAME']

# OpenAI
# openai_api_key = os.environ['OPENAI_API_KEY']

@app.route('/hello', methods=['POST'])
def hello():
   req = request.form.get('req')

   # Azure OpenAI
   llm = AzureOpenAI(
       api_key=api_key,
       api_version=api_version,
       azure_deployment=azure_deployment,
       model_name=model_name,
   )
   text = llm.invoke(req)

   # OpenAI
	 # llm = ChatOpenAI(openai_api_key=openai_api_key)
	 # text = llm.invoke(req)

   if req:
       print('Request for hello page received with req=%s' % req)
       return render_template('hello.html', req = text)
   else:
       print('Request for hello page received with no name or blank name -- redirecting')
       return redirect(url_for('index'))

if __name__ == '__main__':
   app.run()

```

Now save the application and follow the next steps to deploy it to App Service. If you would like to test it locally first at this step, you can swap out the key and endpoint values with the literal string values of your OpenAI service. For example: model_name = 'gpt-4-turbo';

### Deploy to App Service

Before deploying to App Service, you need to edit the *requirments.txt* file and add an environment variable to your web app so it recognizes the LangChain library and build properly.

First, add the following package to your *requirements.txt* file:

```python
langchain-openai
```

Then, go to the Azure portal and navigate to the Environment variables. If you're using Visual Studio to deploy, this app setting enables the same build automation as Git deploy. Add the following App setting to your web app:

- `SCM_DO_BUILD_DURING_DEPLOYMENT` = true

If you have followed the steps above, you're ready to deploy to App Service and you can deploy as you normally would. If you run into any issues remember that you need to have done the following: grant your app access to your Key Vault, add the app settings with key vault references as your values. App Service resolves the app settings in your application that match what you've added in the portal.

### Authentication

Although optional, it's highly recommended that you also add authentication to your web app when using an Azure OpenAI or OpenAI service. This can add a level of security with no other code. Learn how to enable authentication for your web app [here](../../scenario-secure-app-authentication-app-service.md).

Once deployed, browse to the web app and navigate to the OpenAI tab. Enter a query to the service and you should see a populated response from the server. The tutorial is now complete and you now know how to use OpenAI services to create intelligent applications.