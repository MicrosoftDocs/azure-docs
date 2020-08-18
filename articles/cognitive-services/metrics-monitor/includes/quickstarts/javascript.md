---
title: Metrics Monitor JavaScript quickstart
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.topic: include
ms.date: 07/30/2020
ms.author: aahi
---

<!--
    Include the following single line of links targeting the library's companion content at the bottom of the introduction; make adjustments as necessary, but try not to include any other links or content in the introduction.
-->

[Reference documentation](https://docs.microsoft.com/dotnet/api/Microsoft.Azure.CognitiveServices.AnomalyDetector?view=azure-dotnet-preview) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/cognitiveservices/AnomalyDetector) | [Package (npm)](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.AnomalyDetector/) | [Samples](https://github.com/Azure-Samples/anomalydetector)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/)
* The current version of [Node.js](https://nodejs.org/)
<!-- this <a> link opens the Azure portal in a new tab/window. Replace the link with one to your service's resource create blade-->
* Once you have your Azure subscription, <a href="https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics"  title="Create a [Product Name] resource"  target="_blank">create a [Product Name] resource <span class="docon docon-navigate-external x-hidden-focus"></span></a> in the Azure portal to get your key and endpoint. Wait for it to deploy and click the **Go to resource** button.
    * You will need the key and endpoint from the resource you create to connect your application to [Product Name]. You'll paste your key and endpoint into the code below later in the quickstart.
    You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.
    
## Setting up

<!--
    Walk the reader through preparing their environment for working with the client library. Include instructions for creating the Azure resources required to make calls to the service, obtaining credentials, and setting up their local development environment.

    See the "setting up" section for more details: 
    https://review.docs.microsoft.com/en-us/help/contribute/contribute-how-to-write-library-quickstart-v2?branch=pr-en-us-2187#setting-up 
-->

<!-- 
    Consider turning this setup section into a reusable include file for your service 
-->

### Create a new Node.js application

In a console window (such as cmd, PowerShell, or Bash), create a new directory for your app, and navigate to it. 

```console
mkdir myapp && cd myapp
```

Run the `npm init` command to create a node application with a `package.json` file. 

```console
npm init
```

### Install the client library

<!--
    replace the product with your product 
-->

Install the `ms-rest-azure` and `azure-cognitiveservices-[Product Name]` NPM packages:

```console
npm install azure-cognitiveservices-[Product Name] ms-rest-azure
```

Your app's `package.json` file will be updated with the dependencies.

Create a file named `index.js` and import the following libraries:

> [!TIP]
> Want to view the whole quickstart code file at once? You can find it on [GitHub](), which contains the code examples in this quickstart.

```javascript

```

Create variables for your resource's Azure endpoint and key. 

> [!IMPORTANT]
> Go to the Azure portal. If the [Product name] resource you created in the **Prerequisites** section deployed successfully, click the **Go to Resource** button under **Next Steps**. You can find your key and endpoint in the resource's **key and endpoint** page, under **resource management**. 
>
> Remember to remove the key from your code when you're done, and never post it publicly. For production, consider using a secure way of storing and accessing your credentials. See the Cognitive Services [security](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-security) article for more information.

```javascript
key = "<paste-your-[product-name]-key-here>"
endpoint = "<paste-your-[product-name]-endpoint-here>"
```

## Object model

<!-- 
    Briefly introduce and describe the functionality of the library's main classes. Include links to their reference pages.

    Explain the object hierarchy and how the classes work together to manipulate resources in the service.
-->

## Code examples

<!--
    Include code snippets and short descriptions for each task you list in the the bulleted list. Briefly explain each operation, but include enough clarity to explain complex or otherwise tricky operations.

    Include links to the service's reference content when introducing a class for the first time
-->

These code snippets show you how to do the following with the [Product Name] client library for .NET:

* [Authenticate the client](#)
* [Check ingestion status](#)
* [Setup detection configuration and alert configuration](#)
* [Query anomaly detection results](#)
* [Diagnose Anomalies](#)

### Authenticate the client

In a new method, instantiate a client with your endpoint and key. Create an object with your key, and use it with your endpoint to create an [ApiClient]() object.

```javascript

```

### Add a data feed from a sample or data source

### Check ingestion status

###	Setup detection configuration and alert configuration

###	Query anomaly detection results

###	Diagnose anomalies

## Run the application

Run the application with the `node` command on your quickstart file.

```console
node index.js
```
