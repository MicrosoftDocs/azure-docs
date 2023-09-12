---
title: include file
description: include file
services: cognitive-services
manager: nitinme
ms.author: jacodel
author: jcodella
ms.service: azure-ai-personalizer
ms.topic: include
ms.custom: cog-serv-seo-aug-2020
ms.date: 02/02/2023
---

[Reference documentation](/dotnet/api/Microsoft.Azure.CognitiveServices.Personalizer) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/cognitiveservices/Personalizer) | [Package (NuGet)](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Personalizer/) | [.NET code sample](https://github.com/Azure-Samples/cognitive-services-quickstart-code/tree/master/dotnet/Personalizer)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* The current version of [.NET Core](https://dotnet.microsoft.com/download/dotnet-core).
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesPersonalizer"  title="Create a Personalizer resource"  target="_blank">create a Personalizer resource </a> in the Azure portal to get your key and endpoint. After it deploys, select **Go to resource**.
   * You'll need the key and endpoint from the resource you create to connect your application to the Personalizer API. You'll paste your key and endpoint into the code below later in the quickstart.
   * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

## Model configuration

[!INCLUDE [Change model frequency](change-model-frequency.md)]

[!INCLUDE [Change reward wait time](change-reward-wait-time.md)]


## Create a new C# application

Create a new .NET Core application in your preferred editor or IDE.

In a console window (such as cmd, PowerShell, or Bash), use the `dotnet new` command to create a new console app with the name `personalizer-quickstart`. This command creates a simple "Hello World" C# project with a single source file: `Program.cs`.

```console
dotnet new console -n personalizer-quickstart
```

Change your directory to the newly created app folder. Then build the application with:

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

Within the application directory, install the Personalizer client library for .NET with the following command:

```console
dotnet add package Microsoft.Azure.CognitiveServices.Personalizer --version 1.0.0
```

> [!TIP]
> If you're using the Visual Studio IDE, the client library is available as a downloadable NuGet package.

## Code block 1: Generate sample data

Personalizer is meant to run on applications that receive and interpret real-time data. In this quickstart, you'll use sample code to generate imaginary customer actions on a grocery website. The following code block defines three key methods: **GetActions**, **GetContext** and **GetRewardScore**.

- **GetActions** returns a list of the choices that the grocery website needs to rank. In this example, the actions are meal products. Each action choice has details (features) that may affect user behavior later on. Actions are used as input for the Rank API

- **GetContext** returns a simulated customer visit. It selects randomized details (context features) like which customer is present and what time of day the visit is taking place. In general, a context represents the current state of your application, system, environment, or user. The context object is used as input for the Rank API.

   The context features in this quickstart are simplistic. However, in a real production system, designing your [features](../concepts-features.md) and [evaluating their effectiveness](../how-to-feature-evaluation.md) is important. Refer to the linked documentation for guidance.

- **GetRewardScore** returns a score between zero and one that represents the success of a customer interaction. It uses simple logic to determine how different contexts respond to different action choices. For example, a certain user will always give a 1.0 for vegetarian and vegan products, and a 0.0 for other products. In a real scenario, Personalizer will learn user preferences from the data sent in Rank and Reward API calls. You won't define these explicitly as in the example code.

    In a real production system, the [reward score](../concept-rewards.md) should be designed to align with your business objectives and KPIs. Determining how to calculate the reward metric may require some experimentation.

    In the code below, the users' preferences and responses to the actions is hard-coded as a series of conditional statements, and explanatory text is included in the code for demonstrative purposes.

1. Find your key and endpoint.

    [!INCLUDE [Personalizer find resource info](find-azure-resource-info.md)]

1. Open _Program.cs_ in a text editor or IDE and paste in the following code.

     [!code-csharp[](~/cognitive-services-quickstart-code/dotnet/Personalizer/quickstart-sdk/personalizer-quickstart.cs?name=snippet_1)]

1. Paste your key and endpoint into the code where indicated. Your endpoint has the form `https://<your_resource_name>.cognitiveservices.azure.com/`.

    > [!IMPORTANT]
    > Remember to remove the key from your code when you're done, and never post it publicly. For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../key-vault/general/overview.md). See the Azure AI services [security](../../security-features.md) article for more information.

## Code block 2: Iterate the learning loop

The next block of code defines the **main** method and closes out the script. It runs a learning loop iteration, in which it generates a context (including a customer), requests a ranking of actions in that context using the Rank API, calculates the reward score, and passes that score back to the Personalizer service using the Reward API. It prints relevant information to the console at each step.

In this example, each Rank call is made to determine which product should be displayed in the "Featured Product" section. Then the Reward call indicates whether or not the featured product was purchased by the user. Rewards are associated with their decisions through a common `EventId` value. 

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/Personalizer/quickstart-sdk/personalizer-quickstart.cs?name=snippet_2)]


## Run the program

Run the application with the dotnet `dotnet run` command from your application directory.

```console
dotnet run
```

On the first iteration, Personalizer will recommend a random action, because it hasn't done any training yet. You can optionally run more iterations. After about 10 minutes, the service will start to show improvements in its recommendations.

![The quickstart program asks a couple of questions to gather user preferences, known as features, then provides the top action.](../media/csharp-quickstart-commandline-feedback-loop/quickstart-program-feedback-loop-example.png)

## Generate many events for analysis (optional)

You can easily generate, say, 5,000 events from this quickstart scenario, which is sufficient to get experience using Apprentice mode and Online mode, running offline evaluations, and creating feature evaluations. Replace the **main** method above with:

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/Personalizer/quickstart-sdk/personalizer-quickstart.cs?name=snippet_multi)]

The source code for this quickstart is available on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/tree/master/dotnet/Personalizer).
