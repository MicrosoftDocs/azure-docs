---
title: Getting Started with Open API Metadata in Azure Functions | Microsoft Docs
description: Getting Started with Open API support in Azure Functions
services: functions
documentationcenter: ''
author: alexkarcher-msft
manager: erikre
editor: ''

ms.assetid:
ms.service: functions
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: multiple
ms.topic: article
ms.date: 03/23/2017
ms.author: alkarche

---
# Creating Open API 2.0 (Swagger) Metadata for a Function App (Preview)

This document guides you through the step by step process of creating an Open API Definition for a simple API hosted on Azure Functions.

[!INCLUDE [intro](../../includes/functions-bindings-intro.md)]

### What is Open API (Swagger)?
[Swagger Metadata](http://swagger.io/) is a file that defines the functionality and operating modes of your API, and allows a function hosting a REST API to be consumed by a wide variety of other software. Microsoft offerings like PowerApps and [API Apps](https://docs.microsoft.com/en-us/azure/app-service-api/app-service-api-dotnet-get-started#a-idcodegena-generate-client-code-for-the-data-tier), as well as 3rd party developer tooling like [Postman](https://www.getpostman.com/docs/importing_swagger) and [many more packages](http://swagger.io/tools/) all allow your API to be consumed with a Swagger definition.

## <a name="prepare-function"></a>Creating a Function with a simple API
  To create an Open API definition, we first need to create a Function with a simple API. If you already have an API hosted on a Function App, you can skip straight to the next section
1. Create a new Function App.
  1. [Azure portal](https://portal.azure.com) > `+ New` > Search for "Function App"
1. Create a new HTTP trigger function inside your new Function App
  1. Your function is pre-populated with code defining a very simple REST API.
  1. Any string passed to the Function as a query parameter or in the body is returned as "Hello {input}"
1. Go to the `Integrate` tab of your new HTTP Trigger function
  1. Toggle `Allowed HTTP methods` to `Selected methods`
  1. In `Selected HTTP methods` uncheck every verb except POST.
  1. This step will simplify your API definition later on.

## <a name="enable"></a>Enabling API Definition Support
1. Navigate to `API Definition (preview)`
1. Set `Swagger Source` to `Internal`
  1. This step enables a suite of Open API options for your Function App, including an endpoint to host a Swagger file from your Function App's domain, an inline copy of the [Swagger Editor](http://editor.swagger.io), and a quickstart definition generator.

## <a name="create-definition"></a>Creating your API Definition from a template
1. Click `Load Generated API Definition`
  1. This step scans your Function App for HTTP Trigger functions and use the info in functions.json to generate a Swagger document.
1. Add an operation object to `paths: /api/yourfunctionroute post:`
  1. The quickstart Swagger document is an outline of a full Swagger doc. It is lacking most of the metadata necessary for a useful Swagger definition, such as operation objects and response templates.
  1. The sample operation object below has a filled out produces/consumes section, a parameter object, and a response object.
  ```yaml
  post:
        operationId: /api/yourfunctionroute/post
        consumes: [application/json]
        produces: [application/json]
        parameters:
          - name: name
            in: body
            description: Your name
            required: true
            schema:
              type: string
        description: >-
          Replace with Operation Object
          #http://swagger.io/specification/#operationObject
        responses:
          '200':
            description: A Greeting
            schema:
              type: string
        security:
          - apikeyQuery: []
  ```
1. Click `save` to save your changes

## <a name="use-definition"></a>Using Your API Definition
1. Copy your Swagger URL and paste it into a new browser tab to view your raw Swagger document.
1. You can import your Swagger document to any number of tools for testing and integration using that URL.
  1. Many Azure resources are able to automatically import your swagger using the API Definition URL that is saved in your Function application settings. As a part of the internal Swagger Source, we update that url for you.


## <a name="test-definition"></a>Using the Swagger UI to test your API definition
One method for testing an API definition is to use the smartbear [Swagger UI](http://petstore.swagger.io/). Replace the URL in the top right corner with your Swagger URL to explore your API definition visually and send sample requests using the request format specified in your API definition.

To test the API definition you just made you will need to follow the steps below:

1. Enable CORS for your Function App. Because the Swagger UI is a web application, you need to allow calls from outside your Function's domain.
  1. Head to `Function App Settings` and click `Configure CORS`
  1. Add an `Allowed Origin` of "http://petstore.swagger.io"
1. Navigate to the smartbear [Swagger UI](http://petstore.swagger.io/) and replace the URL in the top right corner with your Swagger URL
  1. Test your API by adding your Function API key to the security object at the top
  1. select `/api/yourfunctionroute` > `POST`
  1. Click `Try it out` and enter a name to test

## Learn more

Check out the full [Open API Definition in Functions](functions-api-definition.md) doc for more info.
