---
title: include file
description: include file
services: cognitive-services
manager: nitinme
ms.service: cognitive-services
ms.subservice: personalizer
ms.topic: include
ms.custom: cog-serv-seo-aug-2020
ms.date: 08/25/2020
---
[Reference documentation](/dotnet/api/Microsoft.Azure.CognitiveServices.Personalizer) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/cognitiveservices/Personalizer) | [Package (NuGet)](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Personalizer/) | [Samples](https://github.com/Azure-Samples/cognitive-services-quickstart-code/tree/master/dotnet/Personalizer)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* The current version of [.NET Core](https://dotnet.microsoft.com/download/dotnet-core).
* Once you have your Azure subscription, <a href="https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesPersonalizer"  title="Create a Personalizer resource"  target="_blank">create a Personalizer resource </a> in the Azure portal to get your key and endpoint. After it deploys, click **Go to resource**.
    * You will need the key and endpoint from the resource you create to connect your application to the Personalizer API. You'll paste your key and endpoint into the code below later in the quickstart.
    * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

## Setting Up

[!INCLUDE [Change model frequency](change-model-frequency.md)]

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
dotnet add package Microsoft.Azure.CognitiveServices.Personalizer --version 0.8.0-preview
```

> [!TIP]
> If you're using the Visual Studio IDE, the client library is available as a downloadable NuGet package.

From the project directory, open the `Program.cs` file in your preferred editor or IDE. Add the following using directives:

```csharp
using Microsoft.Azure.CognitiveServices.Personalizer;
using Microsoft.Azure.CognitiveServices.Personalizer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
```

## Object model

The Personalizer client is a [PersonalizerClient](/dotnet/api/microsoft.azure.cognitiveservices.personalizer.personalizerclient) object that authenticates to Azure using Microsoft.Rest.ServiceClientCredentials, which contains your key.

To ask for the single best item of the content, create a [RankRequest](/dotnet/api/microsoft.azure.cognitiveservices.personalizer.models.rankrequest), then pass it to [client.Rank](/dotnet/api/microsoft.azure.cognitiveservices.personalizer.personalizerclientextensions.rank) method. The Rank method returns a RankResponse.

To send a reward score to Personalizer, create a [RewardRequest](/dotnet/api/microsoft.azure.cognitiveservices.personalizer.models.rewardrequest), then pass it to the [client.Reward](/dotnet/api/microsoft.azure.cognitiveservices.personalizer.personalizerclientextensions.reward) method.

Determining the reward score, in this quickstart is trivial. In a production system, the determination of what impacts the [reward score](../concept-rewards.md) and by how much can be a complex process, that you may decide to change over time. This design decision should be one of the primary decisions in your Personalizer architecture.

## Code examples

These code snippets show you how to do the following tasks with the Personalizer client library for .NET:

* [Create a Personalizer client](#authenticate-the-client)
* [Rank API](#request-the-best-action)
* [Reward API](#send-a-reward)


## Authenticate the client

In this section you'll do two things:
* Specify your key and endpoint
* Create a Personalizer client

Start by adding the following lines to your Program class. Make sure to add your key and endpoint from your Personalizer resource.

[!INCLUDE [Personalizer find resource info](find-azure-resource-info.md)]

```csharp
private static readonly string ApiKey = "REPLACE-WITH-YOUR-PERSONALIZER-KEY";
private static readonly string ServiceEndpoint = "https://REPLACE-WITH-YOUR-PERSONALIZER-RESOURCE-NAME.cognitiveservices.azure.com";
```

Next, add a method to your program to create a new Personalizer client.

```csharp
static PersonalizerClient InitializePersonalizerClient(string url)
{
    PersonalizerClient client = new PersonalizerClient(
        new ApiKeyServiceClientCredentials(ApiKey)) { Endpoint = url };

    return client;
}
```

## Get food items as rankable actions

Actions represent the content choices from which you want Personalizer to select the best content item. Add the following methods to the Program class to represent the set of actions and their features. 

```csharp
static IList<RankableAction> GetActions()
{
    IList<RankableAction> actions = new List<RankableAction>
    {
        new RankableAction
        {
            Id = "pasta",
            Features =
            new List<object>() { new { taste = "salty", spiceLevel = "medium" }, new { nutritionLevel = 5, cuisine = "italian" } }
        },

        new RankableAction
        {
            Id = "ice cream",
            Features =
            new List<object>() { new { taste = "sweet", spiceLevel = "none" }, new { nutritionalLevel = 2 } }
        },

        new RankableAction
        {
            Id = "juice",
            Features =
            new List<object>() { new { taste = "sweet", spiceLevel = "none" }, new { nutritionLevel = 5 }, new { drink = true } }
        },

        new RankableAction
        {
            Id = "salad",
            Features =
            new List<object>() { new { taste = "salty", spiceLevel = "low" }, new { nutritionLevel = 8 } }
        }
    };

    return actions;
}
```

## Get user preferences for context

Add the following methods to the Program class to get a user's input from the command line for the time of day and current food preference. These will be used as context features.

```csharp
static string GetUsersTimeOfDay()
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

    Console.WriteLine("\nWhat type of food would you prefer (enter number)? 1. salty 2. sweet");
    if (!int.TryParse(GetKey(), out int tasteIndex) || tasteIndex < 1 || tasteIndex > tasteFeatures.Length)
    {
        Console.WriteLine("\nEntered value is invalid. Setting feature value to " + tasteFeatures[0] + ".");
        tasteIndex = 1;
    }

    return tasteFeatures[tasteIndex - 1];
}
```

Both methods use the `GetKey` method to read the user's selection from the command line.

```csharp
private static string GetKey()
{
    return Console.ReadKey().Key.ToString().Last().ToString().ToUpper();
}
```

## Create the learning loop

The Personalizer learning loop is a cycle of [Rank](#request-the-best-action) and [Reward](#send-a-reward) calls. In this quickstart, each Rank call, to personalize the content, is followed by a Reward call to tell Personalizer how well the service performed.

The following code loops through a cycle of asking the user their preferences at the command line, sending that information to Personalizer to select the best action, presenting the selection to the customer to choose from among the list, then sending a reward score to Personalizer signaling how well the service did in its selection.

```csharp
static void Main(string[] args)
{
    int iteration = 1;
    bool runLoop = true;

    IList<RankableAction> actions = GetActions();

    PersonalizerClient client = InitializePersonalizerClient(ServiceEndpoint);

    do
    {
        Console.WriteLine("\nIteration: " + iteration++);

        string timeOfDayFeature = GetUsersTimeOfDay();
        string tasteFeature = GetUsersTastePreference();

        IList<object> currentContext = new List<object>() {
            new { time = timeOfDayFeature },
            new { taste = tasteFeature }
        };

        IList<string> excludeActions = new List<string> { "juice" };

        string eventId = Guid.NewGuid().ToString();

        var request = new RankRequest(actions, currentContext, excludeActions, eventId);
        RankResponse response = client.Rank(request);

        Console.WriteLine("\nPersonalizer service thinks you would like to have: " + response.RewardActionId + ". Is this correct? (y/n)");

        float reward = 0.0f;
        string answer = GetKey();

        if (answer == "Y")
        {
            reward = 1;
            Console.WriteLine("\nGreat! Enjoy your food.");
        }
        else if (answer == "N")
        {
            reward = 0;
            Console.WriteLine("\nYou didn't like the recommended food choice.");
        }
        else
        {
            Console.WriteLine("\nEntered choice is invalid. Service assumes that you didn't like the recommended food choice.");
        }

        Console.WriteLine("\nPersonalizer service ranked the actions with the probabilities as below:");
        foreach (var rankedResponse in response.Ranking)
        {
            Console.WriteLine(rankedResponse.Id + " " + rankedResponse.Probability);
        }

        client.Reward(response.EventId, new RewardRequest(reward));

        Console.WriteLine("\nPress q to break, any other key to continue:");
        runLoop = !(GetKey() == "Q");

    } while (runLoop);
}
```

Add the following methods, which [get the content choices](#get-food-items-as-rankable-actions), before running the code file:

* `GetActions`
* `GetUsersTimeOfDay`
* `GetUsersTastePreference`
* `GetKey`

## Request the best action

To complete the Rank request, the program asks the user's preferences to create a `currentContext` of the content choices. The process can create content to exclude from the actions, shown as `excludeActions`. The Rank request needs the actions and their features, currentContext features, excludeActions, and a unique event ID, to receive the response.

This quickstart has simple context features of time of day and user food preference. In production systems, determining and [evaluating](../concept-feature-evaluation.md) [actions and features](../concepts-features.md) can be a non-trivial matter.

```csharp
string timeOfDayFeature = GetUsersTimeOfDay();
string tasteFeature = GetUsersTastePreference();

IList<object> currentContext = new List<object>() {
    new { time = timeOfDayFeature },
    new { taste = tasteFeature }
};

IList<string> excludeActions = new List<string> { "juice" };

string eventId = Guid.NewGuid().ToString();

var request = new RankRequest(actions, currentContext, excludeActions, eventId);
RankResponse response = client.Rank(request);
```

## Send a reward

To get the reward score to send in the Reward request, the program gets the user's selection from the command line, assigns a numeric value to the selection, then sends the unique event ID and the reward score as the numeric value to the Reward API.

This quickstart assigns a simple number as a reward score, either a zero or a 1. In production systems, determining when and what to send to the [Reward](../concept-rewards.md) call can be a non-trivial matter, depending on your specific needs.

```csharp
float reward = 0.0f;
string answer = GetKey();

if (answer == "Y")
{
    reward = 1;
    Console.WriteLine("\nGreat! Enjoy your food.");
}
else if (answer == "N")
{
    reward = 0;
    Console.WriteLine("\nYou didn't like the recommended food choice.");
}
else
{
    Console.WriteLine("\nEntered choice is invalid. Service assumes that you didn't like the recommended food choice.");
}

Console.WriteLine("\nPersonalizer service ranked the actions with the probabilities as below:");
foreach (var rankedResponse in response.Ranking)
{
    Console.WriteLine(rankedResponse.Id + " " + rankedResponse.Probability);
}

// Send the reward for the action based on user response.
client.Reward(response.EventId, new RewardRequest(reward));
```

## Run the program

Run the application with the dotnet `run` command from your application directory.

```console
dotnet run
```

![The quickstart program asks a couple of questions to gather user preferences, known as features, then provides the top action.](../media/csharp-quickstart-commandline-feedback-loop/quickstart-program-feedback-loop-example.png)

The [source code for this quickstart](https://github.com/Azure-Samples/cognitive-services-quickstart-code/tree/master/dotnet/Personalizer) is available.
