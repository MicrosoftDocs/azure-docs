---
title: Make Predictions with TensorFlow and Azure Functions | Microsoft Docs
description: How to consume TensorFlow models in Azure Functions
services: functions
author: anthonychu
manager: jeconnoc

ms.service: azure-functions
ms.devlang: python
ms.topic: tutorial
ms.date: 07/12/2019
ms.author: antchu
ms.custom: mvc
---

# Make Predictions with TensorFlow and Azure Functions

In this tutorial, you'll learn how Azure Functions allows you to import a TensorFlow model and use it to make predictions. You'll create a serverless HTTP API endpoint in Python that takes an input image and predicts if the image contains a dog or a cat. You'll also learn how to consume the serverless API from a web application.

## Prerequisites 

To create Azure Functions in Python, you need to install a few tools.

- Python 3.6
- Azure Functions Core Tools
- A code editor

You may use any editor of your choice. Visual Studio Code with the Python and Azure Functions extensions is recommended.

## Clone the tutorial repository

Open a terminal and clone the repository using Git. If you do not have Git, you can navigate to the GitHub repository and download it as a zip file.

```bash
git clone <repo-url>
cd <repo-dir>
```

The repository contains a few folders.

- **start** - you'll be creating your function app here
- **end** - the finished function app
- **resources** - TensorFlow model and helper libraries
- **web** - a frontend website that calls the function app

## Create an Azure Functions project

Change into the **start** folder and use the Azure Functions Core Tools to initialize a Python function app project in the folder.

```bash
cd start
func init --worker-runtime python
```

Create and activate a Python virtual environment in a folder named `.env`.

```bash
python3.6 -m venv .env
source .env/bin/activate
```

Open the **start** folder in an editor and examine the files that were created. The files are required but you won't modify them in this tutorial.

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

### Test the function

In the terminal with the Python virtual environment activated, start the function app.

```bash
func start
```

Open a browser and navigate to `http://localhost:7071/api/classify?name=Azure`. The function should return *Hello Azure!*

Type `Ctrl-C` to stop the function app.

## Import a TensorFlow model

For this tutorial, you'll use a TensorFlow model that was built with and exported from Azure Custom Vision Service. If you want to build your own using Custom Vision Service's free tier, you can follow the instructions in the repository.

Copy the models from **resources/models** into the **classify** folder.

*Windows*

```powershell
copy ..\resources\models\* classify
```

*Linux and macOS*

```bash
cp ../resources/models/* classify
```

## Import the helper functions

Some helper functions for preparing the input image and making a prediction using TensorFlow are in a file named **predict.py** in the **resources** folder. Copy this file info the **classify** function's folder.

```bash
cp ../resources/predict.py classify
```

### Install dependencies

The helper library has some dependencies that need to be installed. In the terminal with the virtual environment activated, run these commands in the function app root that contains **requirements.txt**.

```bash
pip install tensorflow
pip install Pillow
pip install requests
pip freeze > requirements.txt
```

### Caching the model in global variables

In the editor, open **predict.py** and look at the `_initialize` function near the top of the file. Notice that the TensorFlow model is loaded from disk the first time the function is run and save to global variables. The loading from disk is skipped on subsequent executions of the `_initialize` function. Caching the model in memory with this technique speeds up later predictions.

## Update function to run prediction

Open **classify/__init__.py** in your editor. Import the **predict** library that you added to the same folder earlier. Add this `import` statement beneath the other imports in the file.

```python
from . import predict
```

Change the function body to the following.

```python
def main(req: func.HttpRequest) -> func.HttpResponse:
    image_url = req.params.get('img')
    results = predict.predict_image_from_url(image_url)

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

There is a simple frontend web app in the **frontend** folder that consumes the HTTP API in the function app. Open a *separate* terminal and change to the **frontend** folder. Start an HTTP server with Python.

```bash
python3 -m http.server
```

In a browser, navigate to the HTTP server's URL. A web app should appear. Find a public URL of a dog or cat photo and enter it into the textbox. When you click submit, the function app is called and a prediction is returned and displayed on the page.

## Next steps

In this tutorial, you learned how to build and customize an API on Azure Functions to make predictions using TensorFlow. You also learned how to call the API using a web application. You can use these techniques to build out APIs of any complexity, all while running on the serverless compute model provided by Azure Functions.

The following references may be helpful as you develop your application further:

- [Azure Functions Python Developer Guide](https://docs.microsoft.com/azure/azure-functions/functions-reference-python)
- [Deploy Python to Azure Functions with VS Code](https://code.visualstudio.com/docs/python/tutorial-azure-functions)
