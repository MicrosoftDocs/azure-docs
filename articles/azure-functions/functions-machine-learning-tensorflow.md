---
title: Make Machine Learning Predictions with TensorFlow and Azure Functions | Microsoft Docs
description: How to apply TensorFlow machine learning models in Azure Functions
services: functions
author: anthonychu
manager: jeconnoc

ms.service: azure-functions
ms.devlang: python
ms.topic: tutorial
ms.date: 07/19/2019
ms.author: antchu
ms.custom: mvc
---

# Make Machine Learning Predictions with TensorFlow and Azure Functions

In this tutorial, you'll learn how Azure Functions allows you to import a TensorFlow machine learning model and apply it to make predictions.

> [!div class="checklist"]
> * Initialize a local environment for developing Azure Functions in Python
> * Import a custom TensorFlow machine learning model into a function app
> * Build an HTTP API for predicting of a photo contains a dog or a cat
> * Consume the API from a web application

## Prerequisites 

To create Azure Functions in Python, you need to install a few tools.

- [Python 3.6](https://www.python.org/downloads/)
- [Azure Functions Core Tools](functions-run-local.md#install-the-azure-functions-core-tools)
- A code editor

You may use any editor of your choice. [Visual Studio Code](https://code.visualstudio.com/) with the [Python](https://marketplace.visualstudio.com/items?itemName=ms-python.python) and [Azure Functions](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) extensions is recommended.

## Clone the tutorial repository

Open a terminal and clone the repository using Git. If you don't have Git, you can browse to the [GitHub repository](https://github.com/anthonychu/functions-python-tensorflow-tutorial) and download it as a zip file.

```bash
git clone https://github.com/anthonychu/functions-python-tensorflow-tutorial.git
cd functions-python-tensorflow-tutorial
```

The repository contains a few folders.

- **start** - you'll be creating your function app here
- **end** - for your reference, the finished function app
- **resources** - TensorFlow model and helper libraries
- **frontend** - a frontend website that calls the function app

## Create and activate a Python virtual environment

Azure Functions requires Python 3.6 or higher. We recommend creating a virtual environment with the correct version of Python.

Change into the *start* folder and identify the Python executable that you'll use to create the virtual environment. Commonly, it's available as `python` or `python3`.

> [!NOTE]
> If you have the Python Launcher `py` installed on Windows, use `py -3.6` instead of `python` in the following commands.

Confirm the version of your Python executable.

```bash
cd start
python --version
```

In the **start** folder, use the correct version of Python to create a Python virtual environment in a folder named `.env`.

```bash
python -m venv .env
```

Activate the virtual environment.

*Linux and macOS*

```bash
source .env/bin/activate
```

*Windows*

```powershell
.env\Scripts\activate
```

The terminal prompt is now prefixed with `(.env)` that indicates you have properly activated the virtual environment. Confirm that `python` in the virtual environment has the correct version.

```bash
python --version
```

> [!NOTE]
> For the remainder of the tutorial, you'll be running commands in the virtual environment. If you need to reactivate the virtual environment in a terminal, execute the appropriate activate command for your operating system.

## Create an Azure Functions project

Use the Azure Functions Core Tools to initialize a Python function app in the folder.

```bash
func init --worker-runtime python
```

A function app can contain one or more Azure Functions. Open the **start** folder in an editor and examine some of files that were created.

- **local.settings.json** - application settings used for local development
- **host.json** - settings for the Azure Functions host and extensions
- **requirements.txt** - Python packages required by this application

## Create an HTTP function

The application requires a single HTTP API endpoint that takes an image URL as the input and returns a prediction of whether the image contains a dog or a cat.

In the terminal, use the Azure Functions Core Tools to scaffold a new HTTP function named **classify**.

```bash
func new --language python --template HttpTrigger --name classify
```

A new folder named **classify** is created, containing two files.

- **__init__.py** - the main function
- **function.json** - a file describing the function's trigger and its input and output bindings

### Change the function authentication level

By default, the function is configured with an authentication level of *function* that requires an authentication code to be included in each HTTP request. To allow anonymous requests, open **function.json** and change the `authLevel` to `anonymous`.

```json
{
  "scriptFile": "__init__.py",
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": [
        "get",
        "post"
      ]
    },
    {
      "type": "http",
      "direction": "out",
      "name": "$return"
    }
  ]
}
```

### Test the function

In the terminal with the Python virtual environment activated, start the function app.

```bash
func start
```

Open a browser and navigate to `http://localhost:7071/api/classify?name=Azure`. The function should return *Hello Azure!*

Use `Ctrl-C` to stop the function app.

## Import a TensorFlow model

You'll use a pre-built TensorFlow model that was trained with and exported from Azure Custom Vision Service. If you want to build your own using Custom Vision Service's free tier, you can follow the [instructions in the repository](https://github.com/anthonychu/functions-python-tensorflow-tutorial/blob/master/train-custom-vision-model.md).

The model consists of two files in the **<repository-root>/resources/model** folder: *model.db* and *labels.txt*. Copy them into the **classify** function's folder.

*Linux and macOS*

```bash
cp ../resources/model/* classify
```

*Windows*

```powershell
copy ..\resources\model\* classify
```

## Import the helper functions

Some helper functions for preparing the input image and making a prediction using TensorFlow are in a file named **predict.py** in the **resources** folder. Copy this file info the **classify** function's folder.

*Linux and macOS*

```bash
cp ../resources/predict.py classify
```

*Windows*

```powershell
copy ..\resources\predict.py classify
```

### Install dependencies

The helper library has some dependencies that need to be installed. In the terminal with the virtual environment activated, run these commands in the function app root that contains **requirements.txt**.

```bash
pip install tensorflow
pip install Pillow
pip install requests
```

Save the dependencies in **requirements.txt**.

```bash
pip freeze > requirements.txt
```

### Caching the model in global variables

In the editor, open **predict.py** and look at the `_initialize` function near the top of the file. Notice that the TensorFlow model is loaded from disk the first time the function is executed and save to global variables. The loading from disk is skipped in subsequent executions of the `_initialize` function. Caching the model in memory with this technique speeds up later predictions.

## Update function to run prediction

Open **classify/__init__.py** in your editor. Import the **predict** library that you added to the same folder earlier. Add the following `import` statements below the other imports in the file.

```python
import json
from .predict import predict_image_from_url
```

Replace the function body to the following.

```python
def main(req: func.HttpRequest) -> func.HttpResponse:
    image_url = req.params.get('img')
    results = predict_image_from_url(image_url)

    headers = {
        "Content-type": "application/json",
        "Access-Control-Allow-Origin": "*"
    }
    return func.HttpResponse(json.dumps(results), headers = headers)
```

The function receives an image URL in a query string parameter named `img`. The imported `predict_image_from_url` function downloads the image and predicts the result with the TensorFlow model. The function then returns an HTTP response with the results.

Because the HTTP endpoint will be called by a web page hosted on another domain, the HTTP response includes a `Access-Control-Allow-Origin` header to satisfy the browser's Cross-Origin Resource Sharing requirements.

> [!NOTE]
> In a production application, consider changing `*` to a specific origin for added security.

### Test the function app

Ensure the Python virtual environment is still activated. Start the function app.

```bash
func start
```

In a browser, open this URL: http://localhost:7071/api/classify?img=.... Confirm that a valid prediction result is returned.

Keep the function app running.

### Test the web app

There's a simple frontend web app in the **frontend** folder that consumes the HTTP API in the function app.

Open a *separate* terminal and change to the **frontend** folder. Start an HTTP server with your Python 3.6 executable.

```bash
cd <location of the frontend folder>
python -m http.server
```

In a browser, navigate to the HTTP server's URL. A web app should appear. Find a public URL of a dog or cat photo and enter it into the textbox. When you click submit, the function app is called and a prediction is returned and displayed on the page.

## Next steps

In this tutorial, you learned how to build and customize an HTTP API on Azure Functions to make predictions using TensorFlow. You also learned how to call the API using a web application. You can use these techniques to build out APIs of any complexity, all while running on the serverless compute model provided by Azure Functions.

The following references may be helpful as you develop your application further:

- [Azure Functions Python Developer Guide](https://docs.microsoft.com/azure/azure-functions/functions-reference-python)
- [Deploy Python to Azure Functions with VS Code](https://code.visualstudio.com/docs/python/tutorial-azure-functions)
