---
title: "Quickstart: Azure management client library for Node.js"
description: In this quickstart, get started with the Azure management client library for Node.js.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: azure-ai-services
ms.topic: include
ms.date: 06/04/2021
ms.author: pafarley
---

[Reference documentation](/javascript/api/@azure/arm-cognitiveservices/) | [Library source code](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/cognitiveservices/arm-cognitiveservices) | [Package (npm)](https://www.npmjs.com/package/@azure/arm-cognitiveservices) | [Samples](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/cognitiveservices/arm-cognitiveservices#sample-code)

## JavaScript prerequisites

* A valid Azure subscription - [Create one for free](https://azure.microsoft.com/free/).
* The current version of [Node.js](https://nodejs.org/)
* [!INCLUDE [contributor-requirement](./contributor-requirement.md)]
* [!INCLUDE [terms-azure-portal](./terms-azure-portal.md)]

[!INCLUDE [Create a service principal](./create-service-principal.md)]

[!INCLUDE [Create a resource group](./create-resource-group.md)]

## Create a new Node.js application

In a console window (such as cmd, PowerShell, or Bash), create a new directory for your app, and navigate to it. 

```console
mkdir myapp && cd myapp
```

Run the ` init` command to create a node application with a `package.json` file. 

```console
 init
```

Create a file named _index.js_ before going on.

### Install the client library

Install the following npm packages:

```console
npm install @azure/arm-cognitiveservices
npm install @azure/identity
```

Your app's `package.json` file will be updated with the dependencies.

### Import libraries

Open your _index.js_ script and import the following libraries.

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/azure_management_service/create_delete_resource.js?name=snippet_imports)]

## Authenticate the client

Add the following fields to the root of your script and fill in their values, using the service principal you created and your Azure account information.

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/azure_management_service/create_delete_resource.js?name=snippet_constants)]

Next, add the following `quickstart` function to handle the main work of your program. The first block of code constructs a **CognitiveServicesManagementClient** object using the credential variables you entered above. This object is needed for all of your Azure management operations.

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/azure_management_service/create_delete_resource.js?name=snippet_main_auth)]

## Call management functions

Add the following code to the end of your `quickstart` function to list available resources, create a sample resource, list your owned resources, and then delete the sample resource. You'll define these functions in the next steps.

## Create an Azure AI services resource (Node.js)

To create and subscribe to a new Azure AI services resource, use the **Create** function. This function adds a new billable resource to the resource group you pass in. When you create your new resource, you'll need to know the "kind" of service you want to use, along with its pricing tier (or SKU) and an Azure location. The following function takes all of these arguments and creates a resource.

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/azure_management_service/create_delete_resource.js?name=snippet_create)]

### Choose a service and pricing tier

When you create a new resource, you'll need to know the "kind" of service you want to use, along with the [pricing tier](https://azure.microsoft.com/pricing/details/cognitive-services/) (or SKU) you want. You'll use this and other information as parameters when creating the resource. The following function lists the available Azure AI services "kinds."

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/azure_management_service/create_delete_resource.js?name=snippet_list_avail)]

[!INCLUDE [SKUs and pricing](./sku-pricing.md)]

## View your resources

To view all of the resources under your Azure account (across all resource groups), use the following function:

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/azure_management_service/create_delete_resource.js?name=snippet_list)]

## Delete a resource

The following function deletes the specified resource from the given resource group.

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/azure_management_service/create_delete_resource.js?name=snippet_delete)]

## Run the application

Add the following code to the bottom of your script to call your main `quickstart` function with error handling.

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/azure_management_service/create_delete_resource.js?name=snippet_main)]

Then, in your console window, run the application with the `node` command.

```console
node index.js
```
