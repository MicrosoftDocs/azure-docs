---
title: "Quickstart: [Product Name] client library for Node.js | Microsoft Docs"
description: Get started with the [Product Name] client library for Node.js...
services: cognitive-services
author: 
manager: nitinme
ms.service: cognitive-services
ms.subservice: 
ms.topic: quickstart
ms.date: 
ms.author: 
---

<!-- 
You can find more guidance for formatting these quickstarts at: 
https://review.docs.microsoft.com/help/contribute/contribute-how-to-write-library-quickstart-v2?branch=pr-en-us-2187


Title: 
    The H1 of your Quickstart should be in the format: # Quickstart: [Product Name] client library for [Language]
-->

# Quickstart: [Product Name] client library for Node.js

Get started with the [Product Name] client library for Node.js. Follow these steps to install the package and try out the example code for basic tasks. 

<!-- 
    After the above line, briefly describe the service. You can often use the first line of the service's docs landing page for this.

    Next, add a bulleted list of the most common tasks supported by the library, prefaced with "Use the [Product Name] client library for [Language] to:". You provide code snippets for these tasks in the Code examples section later in the Quickstart. Keep the list short but include those tasks most developers need to perform with the library.

    Lastly, include the following single line of links targeting the library's companion content at the bottom of the introduction; make adjustments as necessary, for example NuGet instead of PyPi:
-->

Use the [Product Name] client library for Node.js to:

* TBD
* TBD

<!--
    Include the following single line of links targeting the library's companion content at the bottom of the introduction; make adjustments as necessary, but try not to include any other links or content in the introduction.
-->

[Reference documentation](https://docs.microsoft.com/dotnet/api/Microsoft.Azure.CognitiveServices.AnomalyDetector?view=azure-dotnet-preview) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/cognitiveservices/AnomalyDetector) | [Package (npm)](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.AnomalyDetector/) | [Samples](https://github.com/Azure-Samples/anomalydetector)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/)
* The current version of [Node.js](https://nodejs.org/)

## Setting up

<!--
    Walk the reader through preparing their environment for working with the client library. Include instructions for creating the Azure resources required to make calls to the service, obtaining credentials, and setting up their local development environment.

    See the "setting up" section for more details: 
    https://review.docs.microsoft.com/help/contribute/contribute-how-to-write-library-quickstart-v2?branch=pr-en-us-2187#setting-up 
-->

<!-- 
    Consider turning this setup section into a reusable include file for your service 
-->

### Create a [Product Name] Azure resource

Begin using the [Product Name] by creating an Azure resource. Choose the resource type below that's right for you:

* A [trial resource](https://azure.microsoft.com/try/cognitive-services/#decision) (no Azure subscription needed): 
    * Valid for seven days, for free. After signing up, a trial key and endpoint will be available on the [Azure website](https://azure.microsoft.com/try/cognitive-services/my-apis/). 
    * This is a great option if you want to try [Product Name], but don't have an Azure subscription.
<!-- Link to the 'create' blade in the azure portal -->
* A [ [Product Name] resource](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesAnomalyDetector):
    * Available through the Azure portal until you delete the resource.
    * Use the free pricing tier to try the service, and upgrade later to a paid tier for production.
<!-- remove the below text if your service is not supported by the multi-service option. -->
* A [Multi-Service resource](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesAllInOne):
    * Available through the Azure portal until you delete the resource.  
    * Use the same key and endpoint for your applications, across multiple Cognitive Services.

### Create an environment variable

>[!NOTE]
> The endpoints for non-trial resources created after July 1, 2019 use the custom subdomain format shown below. For more information and a complete list of regional endpoints, see [Custom subdomain names for Cognitive Services](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-custom-subdomains). 

Using your key and endpoint from the resource you created, create two environment variables for authentication:
<!-- replace the below variable names with the names expected in the code sample.-->
* `PRODUCT_NAME_KEY` - The resource key for authenticating your requests.
* `PRODUCT_NAME_ENDPOINT` - The resource endpoint for sending API requests. It will look like this: 
  * `https://<your-custom-subdomain>.api.cognitive.microsoft.com` 

Use the instructions for your operating system.
<!-- replace the below endpoint and key examples -->
#### [Windows](#tab/windows)

```console
setx PRODUCT_NAME_KEY <replace-with-your-product-name-key>
setx PRODUCT_NAME_ENDPOINT <replace-with-your-product-name-endpoint>
```

After you add the environment variable, restart the console window.

#### [Linux](#tab/linux)

```bash
export PRODUCT_NAME_KEY=<replace-with-your-product-name-key>
export PRODUCT_NAME_ENDPOINT=<replace-with-your-product-name-endpoint>
```

After you add the environment variable, run `source ~/.bashrc` from your console window to make the changes effective.

#### [macOS](#tab/unix)

Edit your `.bash_profile`, and add the environment variable:

```bash
export PRODUCT_NAME_KEY=<replace-with-your-product-name-key>
export PRODUCT_NAME_ENDPOINT=<replace-with-your-product-name-endpoint>
```

After you add the environment variable, run `source .bash_profile` from your console window to make the changes effective.
***

### Create a new Node.js application

<!--
    replace the product with your product 
-->
In a console window (such as cmd, PowerShell, or Bash), create a new directory for your app, and navigate to it. 

```console
mkdir myapp && cd myapp
```

Run the `npm init` command to create a node application with a `package.json` file. 

```console
npm init
```

Create a file named `index.js` and import the following libraries:

```javascript

```

Create variables for your resource's Azure endpoint and key. If you created the environment variable after you launched the application, you will need to close and reopen the editor, IDE, or shell running it to access the variable.

```javascript

```

### Install the client library

Install the `ms-rest-azure` and `azure-cognitiveservices-[Product Name]` NPM packages:

```console
npm install azure-cognitiveservices-[Product Name] ms-rest-azure
```

Your app's `package.json` file will be updated with the dependencies.

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
* [Example task 1 (anchor link)](#)
* [Example task 2 (anchor link)](#)
* [Example task 3 (anchor link)](#)

## Authenticate the client
<!--

    The authentication section (and its H3) is required and must be the first code example in the section if your library requires authentication for use.

    change the environment key variable to something descriptive for your service.
    For example: TEXT_ANALYTICS_KEY
-->

> [!NOTE]
> This quickstart assumes you've [created an environment variable](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account#configure-an-environment-variable-for-authentication) for your [Product Name] key, named `TBD_KEY`.

Instantiate a client with your endpoint and key. Create an [ApiKeyServiceClientCredentials]() object with your key, and use it with your endpoint to create an [ApiClient]() object.


```javascript

```

## Example task 1

Example: Create a new method to read in the data and add it to a [Request](https://docs.microsoft.com/dotnet/) object as an array of [Points](https://docs.microsoft.com/dotnet/). Send the request with the [send()](https://docs.microsoft.com/dotnet/) method

```javascript
```

<!-- 
    If this code sample is in a function, tell the reader to call it. For example:

    Call the `example()` function.

-->

## Example task 2

Example: Create a new method to read in the data and add it to a [Request](https://docs.microsoft.com/dotnet/) object as an array of [Points](https://docs.microsoft.com/dotnet/). Send the request with the [send()](https://docs.microsoft.com/dotnet/) method

```javascript
```

<!-- 
    If this code sample is in a function, tell the reader to call it. For example:

    Call the `example()` function.

-->

## Run the application

Run the application with the `node` command on your quickstart file.

```console
node index.js
```

## Clean up resources

If you want to clean up and remove a Cognitive Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Portal](../../cognitive-services-apis-create-account.md#clean-up-resources)
* [Azure CLI](../../cognitive-services-apis-create-account-cli.md#clean-up-resources)

## Troubleshooting

<!--
    This section is optional. If you know of areas that people commonly run into trouble, help them resolve those issues in this section
-->

## Next steps

> [!div class="nextstepaction"]
>[Next article]()

* [What is the [Product Name] API?](../overview.md)
* [Article2](../overview.md)
* [Article3](../overview.md)
* The source code for this sample can be found on [GitHub]().