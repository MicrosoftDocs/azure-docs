---
title: include file
description: include file
services: cognitive-services
author: jcodella
ms.author: jacodel
manager: nitinme
ms.service: cognitive-services
ms.subservice: personalizer
ms.topic: include
ms.date: 09/06/2022
---

You will need to install the Personalizer client library for .NET to:
* Authenticate the quickstart example client with a Personalizer resource in Azure.
* Send context and action features to the Reward API, which will return the best action from the Personalizer model
* Send a reward score to the Rank API and train the Personalizer model.

[Reference documentation](/dotnet/api/Microsoft.Azure.CognitiveServices.Personalizer) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/personalizer) | [Package (NuGet)](https://www.nuget.org/packages/Azure.AI.Personalizer/2.0.0-beta.2)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* The current version of [.NET Core](https://dotnet.microsoft.com/download/dotnet-core).
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesPersonalizer"  title="Create a Personalizer resource"  target="_blank">create a Personalizer resource </a> in the Azure portal to get your key and endpoint. After it deploys, select **Go to resource**.
    * You will need the key and endpoint from the resource you create to connect your application to the Personalizer API. You'll paste your key and endpoint into the code below later in the quickstart.
    * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

## Setting up

[!INCLUDE [Change model frequency](change-model-frequency.md)]

[!INCLUDE [Change reward wait time](change-reward-wait-time.md)]

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

### Install the client library

Within the application directory, install the Personalizer client library for .NET with the following command:

```console
dotnet add package Azure.AI.Personalizer --version 2.0.0-beta.2
```

> [!TIP]
> If you're using the Visual Studio IDE, the client library is available as a downloadable NuGet package.

From the project directory, open the `Program.cs` file in your preferred editor or IDE. Add the following using directives:

```csharp
using Azure;
using Azure.AI.Personalizer;
using System;
using System.Collections.Generic;
using System.Linq;
```

## Object model

The Personalizer client is a [PersonalizerClient](/dotnet/api/azure.ai.personalizer.personalizerclient?branch=main) object that authenticates to Azure using Azure.AzureKeyCredential, which contains your key.

To ask for the single best item to show the user, create a [PersonalizerRankOptions](/dotnet/api/azure.ai.personalizer.personalizerrankoptions?branch=main), then pass it to [PersonalizerClient.Rank](/dotnet/api/azure.ai.personalizer.personalizerclient.rank?branch=main#azure-ai-personalizer-personalizerclient-rank(azure-ai-personalizer-personalizerrankoptions-system-threading-cancellationtoken)) method. The Rank method returns a [PersonalizerRankResult](/dotnet/api/azure.ai.personalizer.personalizerrankresult?branch=main).

To send a reward score to Personalizer, pass the event ID and the reward score to the [PersonalizerClient.Reward](/dotnet/api/azure.ai.personalizer.personalizerclient.reward?branch=main#azure-ai-personalizer-personalizerclient-reward(system-string-system-single-system-threading-cancellationtoken)) method.

Determining the reward score, in this quickstart is trivial. In a production system, the determination of what impacts the [reward score](../concept-rewards.md) and by how much can be a complex process, that you may decide to change over time. This design decision should be one of the primary decisions in your Personalizer architecture.


## Code examples

These code snippets show you how to do the following tasks with the Personalizer client library for .NET:

* [Create a Personalizer client](#authenticate-the-client)
* Multi-Slot Rank API
* Multi-Slot Reward API


## Authenticate the client

In this section you'll do two things:
* Specify your key and endpoint
* Create a Personalizer client

Start by adding the following lines to your Program class. Make sure to add your key and endpoint from your Personalizer resource.

[!INCLUDE [Personalizer find resource info](find-azure-resource-info.md)]

```csharp
private const string ServiceEndpoint  = "https://REPLACE-WITH-YOUR-PERSONALIZER-RESOURCE-NAME.cognitiveservices.azure.com";
private const string ResourceKey = "<REPLACE-WITH-YOUR-PERSONALIZER-KEY>";
```

Next, construct the Rank and Reward URLs. Note that setting `useLocalInference: true` as a parameter for `PersonalizerClientOptions` is required to enable local inference. 

```csharp
static PersonalizerClient InitializePersonalizerClient(Uri url)
{
    // Set the local inference flag to true when initializing the client.
    return new PersonalizerClient(url, new AzureKeyCredential(ResourceKey), new PersonalizerClientOptions(useLocalInference: true));
}
```

## Get content choices represented as actions

Actions represent the content choices from which you want Personalizer to select the best content item. Add the following methods to the Program class to represent the set of actions and their features. 

```csharp
static IList<PersonalizerRankableAction> GetActions()
{
    IList<PersonalizerRankableAction> actions = new List<PersonalizerRankableAction>
    {
        new PersonalizerRankableAction(
            id: "pasta",
            features: new List<object>() { new { taste = "salty", spiceLevel = "medium" }, new { nutritionLevel = 5, cuisine = "italian" } }
        ),

        new PersonalizerRankableAction(
            id: "ice cream",
            features: new List<object>() { new { taste = "sweet", spiceLevel = "none" }, new { nutritionalLevel = 2 } }
        ),

        new PersonalizerRankableAction(
            id: "juice",
            features: new List<object>() { new { taste = "sweet", spiceLevel = "none" }, new { nutritionLevel = 5 }, new { drink = true } }
        ),

        new PersonalizerRankableAction(
            id: "salad",
            features: new List<object>() { new { taste = "salty", spiceLevel = "low" }, new { nutritionLevel = 8 } }
        )
    };

    return actions;
}
```

## Get user preferences for context

Add the following methods to the Program class to get a user's input from the command line for the time of day and user taste preference. These will be used as context features.

```csharp
static string GetTimeOfDayForContext()
{
    string[] timeOfDayFeatures = new string[] { "morning", "afternoon", "evening", "night" };

    Console.WriteLine("\nWhat time of day is it (enter number)? 1. morning 2. afternoon 3. evening 4. night");
    if (!int.TryParse(GetKey(), out int timeIndex) || timeIndex < 1 || timeIndex > timeOfDayFeatures.Length)
    {
        Console.WriteLine("\nEntered value is invalid. Setting feature value to " + timeOfDayFeatures[0] + ".");
        timeIndex = 1;
    }

    return timeOfDayFeatures[timeIndex - 1];
}
```

```csharp
static string GetUsersTastePreference()
{
    string[] tasteFeatures = new string[] { "salty", "sweet" };
    var random = new Random();
    var taste = random.Next(1, 2);

    Console.WriteLine("\nWhat type of food would you prefer (enter number)? 1. salty 2. sweet");
    if (!int.TryParse(GetKey(), out int tasteIndex) || tasteIndex < 1 || tasteIndex > tasteFeatures.Length)
    {
        Console.WriteLine("\nEntered value is invalid. Setting feature value to " + tasteFeatures[0] + ".");
        tasteIndex = 1;
    }

    return tasteFeatures[taste - 1];
}
```

Both methods use the `GetKey` method to read the user's selection from the command line.

```csharp
private static string GetKey()
{
    return Console.ReadKey().Key.ToString().Last().ToString().ToUpper();
}
```

```csharp
private static IList<object> GetContext(string time, string taste)
{
    return new List<object>()
    {
        new { time = time },
        new { taste = taste }
    };
}
```

## Create the learning loop

The Personalizer learning loop is a cycle of Rank and Reward calls. In this quickstart, each Rank call, to personalize the content, is followed by a Reward call to tell Personalizer how well the service performed.

The following code loops through a cycle of asking the user their preferences through the command line, sending that information to Personalizer to select the best action for each slot, presenting the selection to the customer to choose from among the list, then sending a reward score to Personalizer signaling how well the service did in its selection.

```csharp
static void Main(string[] args)
{
    Console.WriteLine($"Welcome to this Personalizer Quickstart!\n" +
    $"This code will help you understand how to use the Personalizer APIs (rank and reward).\n" +
    $"Each iteration represents a user interaction and will demonstrate how context, actions, and rewards work.\n" +
    $"Note: Personalizer AI models learn from a large number of user interactions:\n" +
    $"You won't be able to tell the difference in what Personalizer returns by simulating a few events by hand.\n" +
    $"If you want a sample that focuses on seeing how Personalizer learns, see the Python Notebook sample.");

    int iteration = 1;
    bool runLoop = true;

    IList<PersonalizerRankableAction> actions = GetActions();
    PersonalizerClient client = InitializePersonalizerClient(new Uri(ServiceEndpoint));

    do
    {
        Console.WriteLine("\nIteration: " + iteration++);

        string timeOfDayFeature = GetTimeOfDayForContext();
        string deviceFeature = GetUsersTastePreference();

        IList<object> currentContext = GetContext(timeOfDayFeature, deviceFeature);

        string eventId = Guid.NewGuid().ToString();

        var rankOptions = new PersonalizerRankOptions(actions: actions, contextFeatures: currentContext, eventId: eventId);
        PersonalizerRankResult rankResult = client.Rank(rankOptions);

        Console.WriteLine("\nPersonalizer service thinks you would like to have: " + rankResult.RewardActionId + ". Is this correct? (y/n)");

        float reward = 0.0f;
        string answer = GetKey();

        if (answer == "Y")
        {
            reward = 1.0f;
            Console.WriteLine("\nGreat! Enjoy your food.");
        }
        else if (answer == "N")
        {
            reward = 0.0f;
            Console.WriteLine("\nYou didn't like the recommended food choice.");
        }
        else
        {
            Console.WriteLine("\nEntered choice is invalid. Service assumes that you didn't like the recommended food choice.");
        }

        client.Reward(rankResult.EventId, reward);

        Console.WriteLine("\nPress q to break, any other key to continue:");
        runLoop = !(GetKey() == "Q");

    } while (runLoop);
}
```

## Run the program

Run the application with the dotnet `run` command from your application directory.

```console
dotnet run
```

![The quickstart program asks a couple of questions to gather user preferences, known as features, then provides the top action.](../media/csharp-quickstart-commandline-feedback-loop/quickstart-program-feedback-loop-example.png)
