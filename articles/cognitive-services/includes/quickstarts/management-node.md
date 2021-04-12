---
title: "Quickstart: Azure management client library for Node.js"
description: In this quickstart, get started with the Azure management client library for Node.js.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.topic: include
ms.date: 3/22/2021
ms.author: pafarley
---

[Reference documentation](/javascript/api/@azure/arm-cognitiveservices/) | [Library source code](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/cognitiveservices/arm-cognitiveservices) | [Package (NPM)](https://www.npmjs.com/package/@azure/arm-cognitiveservices) | [Samples](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/cognitiveservices/arm-cognitiveservices#sample-code)

## JavaScript prerequisites

* A valid Azure subscription - [Create one for free](https://azure.microsoft.com/free/).
* The current version of [Node.js](https://nodejs.org/)

[!INCLUDE [Create a service principal](./create-service-principal.md)]

[!INCLUDE [Create a resource group](./create-resource-group.md)]

## Create a new Node.js application

In a console window (such as cmd, PowerShell, or Bash), create a new directory for your app, and navigate to it. 

```console
mkdir myapp && cd myapp
```

Run the `npm init` command to create a node application with a `package.json` file. 

```console
npm init
```

Create a file named _index.js_ before going on.

### Install the client library

Install the following NPM packages:

```console
npm install @azure/arm-cognitiveservices
npm install @azure/ms-rest-js
npm install @azure/ms-rest-nodeauth
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

## Create a Cognitive Services resource (Node.js)

To create and subscribe to a new Cognitive Services resource, use the **Create** function. This function adds a new billable resource to the resource group you pass in. When you create your new resource, you'll need to know the "kind" of service you want to use, along with its pricing tier (or SKU) and an Azure location. The following function takes all of these arguments and creates a resource.

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/azure_management_service/create_delete_resource.js?name=snippet_create)]

### Choose a service and pricing tier

When you create a new resource, you'll need to know the "kind" of service you want to use, along with the [pricing tier](https://azure.microsoft.com/pricing/details/cognitive-services/) (or SKU) you want. You'll use this and other information as parameters when creating the resource. The following function lists the available Cognitive Service "kinds."

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/azure_management_service/create_delete_resource.js?name=snippet_list_avail)]

[!INCLUDE [cognitive-services-subscription-types](../../../../includes/cognitive-services-subscription-types.md)]

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

## See also

* See **[Authenticate requests to Azure Cognitive Services](../../authentication.md)** on how to securely work with Cognitive Services.
* See **[What are Azure Cognitive Services?](../../what-are-cognitive-services.md)** to get a list of different categories within Cognitive Services.
* See **[Natural language support](../../language-support.md)** to see the list of natural languages that Cognitive Services supports.
* See **[Use Cognitive Services as containers](../../cognitive-services-container-support.md)** to understand how to use Cognitive Services on-prem.
* See **[Plan and manage costs for Cognitive Services](../../plan-manage-costs.md)** to estimate cost of using Cognitive Services.
* See **[Azure Management SDK reference documentation](/javascript/api/@azure/arm-cognitiveservices/)** for more details on the management SDK.
