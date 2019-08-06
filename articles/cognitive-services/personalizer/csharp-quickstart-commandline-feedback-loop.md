---
title: "Quickstart: Personalizer client library for .NET | Microsoft Docs"
titleSuffix: Azure Cognitive Services
description:  Get started with the Personalizer client library for .NET using a learning loop. 
services: cognitive-services
author: diberry
manager: nitinme
ms.service: cognitive-services
ms.subservice: personalizer
ms.topic: quickstart
ms.date: 08/5/2019
ms.author: diberry
#Customer intent: 

---

# Quickstart: Personalize client library for .NET

Display personalized content in this C# quickstart with the Personalizer service.

Get started with the Personalizer client library for .NET. Follow these steps to install the package and try out the example code for basic tasks.

 * Rank a list of actions for personalization.
 * Report reward to allocate to the top ranked action based on user selection for the specified event.

[Reference documentation](https://docs.microsoft.com/dotnet/api/Microsoft.Azure.CognitiveServices.Personalizer?view=azure-dotnet-preview) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/cognitiveservices/Personalizer) | [Package (NuGet)](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Personalizer/) | [Samples](https://github.com/Azure-Samples/cognitive-services-personalizer-samples)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/)
* The current version of [.NET Core](https://dotnet.microsoft.com/download/dotnet-core).

## Setting up

### Create a Personalizer Azure resource

Azure Cognitive Services are represented by Azure resources that you subscribe to. Create a resource for [Product name] using the [Azure portal](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) or [Azure CLI](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account-cli) on your local machine. You can also:

* Get a [trial key](https://azure.microsoft.com/try/cognitive-services) valid for 7 days for free. After signing up, it will be available on the [Azure website](https://azure.microsoft.com/try/cognitive-services/my-apis/).  
* View your resource on the [Azure portal](https://portal.azure.com/).

<!-- rename TBD_KEY to something meaningful for your service, like TEXT_ANALYTICS_KEY -->
After you get a key from your trial subscription or resource, create two [environment variable](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account#configure-an-environment-variable-for-authentication):

* `PERSONALIZER_RESOURCE_KEY` for the resource key.
* `PERSONALIZER_RESOURCE_ENDPOINT` for the resource endpoint.

### Change the model update frequency

In the Personalizer resource in the Azure portal, change the **Model update frequency** to 10 seconds. This will train the service rapidly, allowing you to see how the top action changes for each iteration.

When a Personalizer loop is first instantiated, there is no model since there has been no Reward API calls to train from. Rank calls will return equal probabilities for each item. Your application should still always rank content using the output of RewardActionId.

![Change model update frequency](./media/settings/configure-model-update-frequency-settings.png)

### Create a new C# application

Create a new .NET Core application in your preferred editor or IDE. 

In a console window (such as cmd, PowerShell, or Bash), use the dotnet `new` command to create a new console app with the name `personalizer-quickstart`. This command creates a simple "Hello World" C# project with a single source file: `Program.cs`. 

```console
dotnet new console -n personalizer-quickstart
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

### Install the SDK

Within the application directory, install the QnA Maker client library for .NET with the following command:

```console
dotnet add package Microsoft.Azure.CognitiveServices.Personalizer --version 0.8.0
```

If you're using the Visual Studio IDE, the client library is available as a downloadable NuGet package.

## Object model

The Personalizer client is a [PersonalizerClient](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.personalizer.personalizerclient?view=azure-dotnet) object that authenticates to Azure using Microsoft.Rest.ServiceClientCredentials, which contains your key.

To ask for a rank of the content, create a [RankRequest](https://docs.microsoft.com/en-us/dotnet/api/microsoft.azure.cognitiveservices.personalizer.models.rankrequest?view=azure-dotnet-preview), then pass it to [client.Rank](https://docs.microsoft.com/en-us/dotnet/api/microsoft.azure.cognitiveservices.personalizer.personalizerclientextensions.rank?view=azure-dotnet-preview) method. The Rank method returns a RankResponse, containing the ranked content. 

To send a reward to Personalizer, create a [RewardRequest](https://docs.microsoft.com/en-us/dotnet/api/microsoft.azure.cognitiveservices.personalizer.models.rewardrequest?view=azure-dotnet-preview), then pass it to the [client.Reward](https://docs.microsoft.com/en-us/dotnet/api/microsoft.azure.cognitiveservices.personalizer.personalizerclientextensions.reward?view=azure-dotnet-preview) method. 
 

## Code examples

These code snippets show you how to do the following with the QnA Maker client library for .NET:

* [Create a Personalizer client](#create-a-personalizer-client)
* [Request a rank](#request-a-rank)
* [Send a reward](#send-a-reward)

## Add the dependencies

From the project directory, open the **Program.cs** file in your preferred editor or IDE. Replace the existing `using` code with the following `using` directives:

[!code-csharp[Using statements](~/samples-personalizer/quickstarts/csharp/PersonalizerExample/Program.cs?name=Dependencies)]

## Add Personalizer resource information

In the **Program** class, create variables for your resource's Azure key and endpoint pulled from the environment variables, named `PERSONALIZER_RESOURCE_KEY` and `PERSONALIZER_RESOURCE_ENDPOINT`. If you created the environment variables after the application is launched, the editor, IDE, or shell running it will need to be closed and reloaded to access the variable. The methods will be created later.

[!code-csharp[Create variables to hold the Personalizer resource key and endpoint values found in the Azure portal.](~/samples-personalizer/quickstarts/csharp/PersonalizerExample/Program.cs?name=classVariables)]

## Create a Personalizer client

Next, create a method to return a Personalizer client.

[!code-csharp[Create the Personalizer client](~/samples-personalizer/quickstarts/csharp/PersonalizerExample/Program.cs?name=authorization)]

## Get content choices represented as actions

Actions represent the content choices you want Personalizer to rank. Add the following method to the Program class.

[!code-csharp[Present time out day preference to the user](~/samples-personalizer/quickstarts/csharp/PersonalizerExample/Program.cs?createUserFeatureTimeOfDay)]

[!code-csharp[Present food taste preference to the user](~/samples-personalizer/quickstarts/csharp/PersonalizerExample/Program.cs?createUserFeatureTastePreference)]

Both methods use the `GetKey` method to read the user's selection from the command line. 

[!code-csharp[Read user's choice from the command line](~/samples-personalizer/quickstarts/csharp/PersonalizerExample/Program.cs?readCommandLine)]

## Get user information represented as features

In this example, features represent user preferences. Add the following methods to the Program class. These methods are called when a user makes a selection at the command line for time of day and food taste preference.

[!code-csharp[Using statements](~/samples-personalizer/quickstarts/csharp/PersonalizerExample/Program.cs?name=authorization)] 

## Create the learning loop

The Personalizer learning loop is a cycle of rank and reward calls. In this quickstart, each rank call, to personalize the content, is followed by a reward call to tell Personalizer how well the service ranked the content. 

The following code in the `main` method of the program loops through a cycle of asking the user their preferences at the command line, sending that information to Personalizer to rank, presenting the ranked selection to the customer to choose from among the list, then sending a reward to Personalizer signaling how well the service did in ranking the selection.

[!code-csharp[The Personalizer learning loop is a cycle of rank and reward calls.](~/samples-personalizer/quickstarts/csharp/PersonalizerExample/Program.cs?name=mainLoop)] 

## Request a rank

To complete the rank request, the program asks the user's preferences to create a `currentContent` of the content choices. The process can create content to exclude from the rank, shown as `excludeActions`. The rank request needs the actions, currentContext, excludeActions, and a unique rank event ID (as a GUID), to receive the ranked response. 

This quickstart has simple context features of time of day and user food preference. In production systems, determining and [evaluating](concept-feature-evaluation.md) [actions and features](concepts-features.md) can be a non-trivial matter.  

[!code-csharp[The Personalizer learning loop ranks the request.](~/samples-personalizer/quickstarts/csharp//PersonalizerExample/Program.cs?name=rank)]

## Send a reward

To complete the reward request, the program gets the user's selection from the command line, assigns a numeric value to each selection, then sends the unique rank event ID and the numeric value to the reward method.

This quickstart assigns a simple number as a reward, either a zero or a 1. In production systems, determining when and what to send to the [reward](concept-rewards.md) call can be a non-trivial matter, depending on your specific needs. 

[!code-csharp[The Personalizer learning loop ranks the request.](~/samples-personalizer/quickstarts/csharp//PersonalizerExample/Program.cs?name=reward)]

## Run the program

Run the application with the dotnet `run` command from your application directory.

```dotnet
dotnet run
```

![The quickstart program asks a couple of questions to gather user preferences, known as features, then provides the top action.](media/csharp-quickstart-commandline-feedback-loop/quickstart-program-feedback-loop-example.png)

## Clean up resources

If you want to clean up and remove a Cognitive Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Portal](../cognitive-services-apis-create-account.md#clean-up-resources)
* [Azure CLI](../cognitive-services-apis-create-account-cli.md#clean-up-resources)

## Next steps

> [!div class="nextstepaction"]
>[How Personalizer works](how-personalizer-works.md)

* [What is Personalizer?](what-is-personalizer.md)
* [Where can you use Personalizer?](where-can-you-use-personalizer.md)
* [Troubleshooting](troubleshooting.md)

