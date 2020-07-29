---
title: Create a Cognitive Services resource using the Azure Management client library
titleSuffix: Azure Cognitive Services
description: Get started with Azure Cognitive Services by creating and subscribing to a resource using the Azure Management client library.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.topic: conceptual
ms.date: 07/29/2020
ms.author: pafarley
---

# Create a Cognitive Services resource using the Azure Management client library

Use this quickstart to get started with Azure Cognitive Services using the Azure Management client library. You'll learn how to sign up for Azure Cognitive Services and create an account that has a single-service or multi-service subscription. These services are represented by Azure [resources](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-portal) that you create in your Azure subscription. After creating the resource, you use the keys and endpoint generated to authenticate your applications.

[Reference documentation](https://docs.microsoft.com/en-us/dotnet/api/overview/azure/cognitiveservices/management?view=azure-dotnet) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/cognitiveservices/Microsoft.Azure.Management.CognitiveServices) | [Package (NuGet)](https://www.nuget.org/packages/Microsoft.Azure.Management.CognitiveServices/) | [Samples](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/cognitiveservices/Microsoft.Azure.Management.CognitiveServices/tests)

## Prerequisites

* A valid Azure subscription - [Create one for free](https://azure.microsoft.com/free/).
* The current version of [.NET Core](https://dotnet.microsoft.com/download/dotnet-core).

## Create an Azure Service Principal

In order to have your application interact with your Azure account, you need an Azure service principal to manage permissions. Follow the instructions in [Create an Azure service principal](https://docs.microsoft.com/powershell/azure/create-azure-service-principal-azureps?view=azps-4.4.0&viewFallbackFrom=azps-3.3.0).

When you create a service principal, you'll see it has a secret value, an ID, and an application ID. Save the application ID and secret to a temporary location for later steps.

## Create a resource group

Before you create a Cognitive Services resource, your account must have an Azure resource group to contain the resource. If you don't already have a resource group, create one in the [Azure portal](https://ms.portal.azure.com/) before continuing.

## Create a new C# application

Create a new .NET Core application. In a console window (such as cmd, PowerShell, or Bash), use the `dotnet new` command to create a new console app with the name `azure-management-quickstart`. This command creates a simple "Hello World" C# project with a single source file: *program.cs*. 

```console
dotnet new console -n azure-management-quickstart
```

Change your directory to the newly created app folder. You can build the application with:

```console
dotnet build
```

The build output should contain no warnings or errors. 

```console
...
Build succeeded.
 0 Warning(s)
 0 Error(s)
...
```

### Install the client library

Within the application directory, install the Azure Management client library for .NET with the following command:

```console
dotnet add package Microsoft.Azure.Management.CognitiveServices
dotnet add package Microsoft.Azure.Management.Fluent
dotnet add package Microsoft.Azure.Management.ResourceManager.Fluent
```

If you're using the Visual Studio IDE, the client library is available as a downloadable NuGet package.

### Import libraries

Open *program.cs* and add the following `using` statements to the top of the file:

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/azure_management_service/create_delete_resource.cs?name=snippet_using)]

## Authenticate the client

Add the following fields to the root of *program.cs* and populate their values, using the service principal you created and your Azure account information.

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/azure_management_service/create_delete_resource.cs?name=snippet_constants)]

Then, in your **Main** method, use these values to construct a **CognitiveServicesManagementClient** object. This object is needed for all of your Azure management operations.

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/azure_management_service/create_delete_resource.cs?name=snippet_assigns)]

## Call management methods

Add the following code to your **Main** method to list available resources, create a sample resource, list your owned resources, and then delete the sample resource. You'll define these methods in the next steps.

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/azure_management_service/create_delete_resource.cs?name=snippet_calls)]

## Create a Cognitive Services resource

### Choose a service and pricing tier

When you create a new resource, you'll need to know the "kind" of service you want to use, along with the [pricing tier](https://azure.microsoft.com/pricing/details/cognitive-services/) (or SKU) you want. You will use this and other information as parameters when creating the resource. You can find a list of available Cognitive Service "kinds" by calling the following method in your script:

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/azure_management_service/create_delete_resource.cs?name=snippet_list_avail)]

[!INCLUDE [cognitive-services-subscription-types](../../includes/cognitive-services-subscription-types.md)]

Or, see the list of SKUs and pricing information below. 

#### Multi-service

| Service                    | Kind                      |
|----------------------------|---------------------------|
| Multiple services. See the [pricing](https://azure.microsoft.com/pricing/details/cognitive-services/) page for more details.            | `CognitiveServices`     |


#### Vision

| Service                    | Kind                      |
|----------------------------|---------------------------|
| Computer Vision            | `ComputerVision`          |
| Custom Vision - Prediction | `CustomVision.Prediction` |
| Custom Vision - Training   | `CustomVision.Training`   |
| Face                       | `Face`                    |
| Form Recognizer            | `FormRecognizer`          |
| Ink Recognizer             | `InkRecognizer`           |

#### Search

| Service            | Kind                  |
|--------------------|-----------------------|
| Bing Autosuggest   | `Bing.Autosuggest.v7` |
| Bing Custom Search | `Bing.CustomSearch`   |
| Bing Entity Search | `Bing.EntitySearch`   |
| Bing Search        | `Bing.Search.v7`      |
| Bing Spell Check   | `Bing.SpellCheck.v7`  |

#### Speech

| Service            | Kind                 |
|--------------------|----------------------|
| Speech Services    | `SpeechServices`     |
| Speech Recognition | `SpeakerRecognition` |

#### Language

| Service            | Kind                |
|--------------------|---------------------|
| Form Understanding | `FormUnderstanding` |
| LUIS               | `LUIS`              |
| QnA Maker          | `QnAMaker`          |
| Text Analytics     | `TextAnalytics`     |
| Text Translation   | `TextTranslation`   |

#### Decision

| Service           | Kind               |
|-------------------|--------------------|
| Anomaly Detector  | `AnomalyDetector`  |
| Content Moderator | `ContentModerator` |
| Personalizer      | `Personalizer`     |


#### Pricing tiers and billing

Pricing tiers (and the amount you get billed) are based on the number of transactions you send using your authentication information. Each pricing tier specifies the:
* maximum number of allowed transactions per second (TPS).
* service features enabled within the pricing tier.
* cost for a predefined amount of transactions. Going above this amount will cause an extra charge as specified in the [pricing details](https://azure.microsoft.com/pricing/details/cognitive-services/custom-vision-service/) for your service.

> [!NOTE]
> Many of the Cognitive Services have a free tier you can use to try the service. To use the free tier, use `F0` as the SKU for your resource.

## Create a Cognitive Services resource

To create and subscribe to a new Cognitive Services resource, use the **Create** method. This method adds a new billable resource to the resource group you pass in. When creating your new resource, you'll need to know the "kind" of service you want to use, along with its pricing tier (or SKU) and an Azure location. The following method takes all of these as arguments and creates a resource.

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/azure_management_service/create_delete_resource.cs?name=snippet_create)]

## View your resources

To view all of the resources under your Azure account (across all resource groups), use the following method:

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/azure_management_service/create_delete_resource.cs?name=snippet_list)]

## Delete a resource

The following method deletes the specified resource from the given resource group.

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/azure_management_service/create_delete_resource.cs?name=snippet_delete)]

## See also

* [Azure Management SDK reference documentation](https://docs.microsoft.com/dotnet/api/overview/azure/cognitiveservices/management?view=azure-dotnet)
* [Authenticate requests to Azure Cognitive Services](authentication.md)
* [What is Azure Cognitive Services?](Welcome.md)
* [Natural language support](language-support.md)
* [Docker container support](cognitive-services-container-support.md)
