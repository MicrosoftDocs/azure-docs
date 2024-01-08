---
title: include file
description: include file
#services: cognitive-services
manager: nitinme
ms.service: azure-ai-personalizer
ms.topic: include
ms.custom: cog-serv-seo-aug-2020
author: jcodella
ms.author: jacodel
ms.date: 03/23/2021
---
[Reference documentation](/dotnet/api/azure.ai.personalizer) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/personalizer) | [Package (NuGet)](https://www.nuget.org/packages/Azure.AI.Personalizer/2.0.0-beta.1) | [Multi-slot conceptual](..\concept-multi-slot-personalization.md) | [Samples](https://github.com/Azure-Samples/cognitive-services-quickstart-code/tree/master/dotnet/Personalizer)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* The current version of [.NET Core](https://dotnet.microsoft.com/download/dotnet-core).
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesPersonalizer"  title="Create a Personalizer resource"  target="_blank">create a Personalizer resource </a> in the Azure portal to get your key and endpoint. After it deploys, select **Go to resource**.
    * You'll need the key and endpoint from the resource you create to connect your application to the Personalizer API. Paste your key and endpoint into the code below later in the quickstart.
    * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

## Setting up

[!INCLUDE [Upgrade Personalizer instance to multi-slot](upgrade-personalizer-multi-slot.md)]

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

From the project directory, open the `Program.cs` file in your preferred editor or IDE. Add the following using directives:

```csharp
using System;
using Azure;
using Azure.AI.Personalizer;
using System.Collections.Generic;
using System.Linq;
```

## Object model

The Personalizer client is a [PersonalizerClient](/dotnet/api/azure.ai.personalizer.personalizerclient?branch=main) object that authenticates to Azure using Azure.AzureKeyCredential, which contains your key.

To ask for the single best item of the content for each slot, create a [PersonalizerRankMultiSlotOptions](/dotnet/api/azure.ai.personalizer.personalizerrankmultislotoptions?branch=main) object, then pass it to [PersonalizerClient.RankMultiSlot](/dotnet/api/azure.ai.personalizer.personalizerclient.rankmultislot#azure-ai-personalizer-personalizerclient-rankmultislot(azure-ai-personalizer-personalizerrankmultislotoptions-system-threading-cancellationtoken)). The RankMultiSlot method returns a [PersonalizerMultiSlotRankResult](/dotnet/api/azure.ai.personalizer.personalizermultislotrankresult?branch=main).

To send a reward score to Personalizer, create a [PersonalizerRewardMultiSlotOptions](/dotnet/api/azure.ai.personalizer.personalizerrewardmultislotoptions?branch=main), then pass it to the [PersonalizerClient.RewardMultiSlot](/dotnet/api/azure.ai.personalizer.personalizerclient.rewardmultislot?branch=main#azure-ai-personalizer-personalizerclient-rewardmultislot(system-string-azure-ai-personalizer-personalizerrewardmultislotoptions-system-threading-cancellationtoken)) method along with the corresponding event ID.

The reward score in this quickstart is trivial. In a production system, the determination of what impacts the [reward score](../concept-rewards.md) and by how much can be a complex process, that you may decide to change over time. This design decision should be one of the primary decisions in your Personalizer architecture.

## Code examples

These code snippets show you how to do the following tasks with the Personalizer client library for .NET:

* [Create a Personalizer client](#authenticate-the-client)
* [Multi-Slot Rank API](#request-the-best-action)
* [Multi-Slot Reward API](#send-a-reward)


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

Next, construct the Rank and Reward URLs.

```csharp
static PersonalizerClient InitializePersonalizerClient(Uri url)
{
    return new PersonalizerClient(url, new AzureKeyCredential(ResourceKey));
}
```

## Get content choices represented as actions

Actions represent the content choices from which you want Personalizer to select the best content item. Add the following methods to the Program class to represent the set of actions and their features. 

```csharp
private static IList<PersonalizerRankableAction> GetActions()
{
    IList<PersonalizerRankableAction> actions = new List<PersonalizerRankableAction>
    {
        new PersonalizerRankableAction(
            id: "Red-Polo-Shirt-432",
            features:
            new List<object>() { new { onSale = "true", price = "20", category = "Clothing" } }
        ),

        new PersonalizerRankableAction(
            id: "Tennis-Racket-133",
            features:
            new List<object>() { new { onSale = "false", price = "70", category = "Sports" } }
        ),

        new PersonalizerRankableAction(
            id: "31-Inch-Monitor-771",
            features:
            new List<object>() { new { onSale = "true", price = "200", category = "Electronics" } }
        ),

        new PersonalizerRankableAction(
            id: "XBox-Series X-117",
            features:
            new List<object>() { new { onSale = "false", price = "499", category = "Electronics" } }
        )
    };

    return actions;
}
```

## Get slots

Slots make up the page that the user will interact with. Personalizer will decide which action to display in each one of the defined slots. Actions can be excluded from specific slots, shown as `ExcludeActions`. `BaselineAction` is the default action for the slot, which would have been displayed without the use of Personalizer.


This quickstart has simple slot features. In production systems, determining and [evaluating](../how-to-feature-evaluation.md) [features](../concepts-features.md) can be a non-trivial matter.

```csharp
private static IList<PersonalizerSlotOptions> GetSlots()
{
    IList<PersonalizerSlotOptions> slots = new List<PersonalizerSlotOptions>
    {
        new PersonalizerSlotOptions(
            id: "BigHeroPosition",
            features: new List<object>() { new { size = "large", position = "left" } },
            excludedActions: new List<string>() { "31-Inch-Monitor-771" },
            baselineAction: "Red-Polo-Shirt-432"

        ),

        new PersonalizerSlotOptions(
            id: "SmallSidebar",
            features: new List<object>() { new { size = "small", position = "right" } },
            excludedActions: new List<string>() { "Tennis-Racket-133" },
            baselineAction: "XBox-Series X-117"
        ),
    };

    return slots;
}
```

## Get user preferences for context

Add the following methods to the Program class to get a user's input from the command line for the time of day and the type of device the user is on. These methods will be used as context features.

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
static string GetDeviceForContext()
{
    string[] deviceFeatures = new string[] { "mobile", "tablet", "desktop" };

    Console.WriteLine("\nWhat is the device type (enter number)? 1. Mobile 2. Tablet 3. Desktop");
    if (!int.TryParse(GetKey(), out int deviceIndex) || deviceIndex < 1 || deviceIndex > deviceFeatures.Length)
    {
        Console.WriteLine("\nEntered value is invalid. Setting feature value to " + deviceFeatures[0] + ".");
        deviceIndex = 1;
    }

    return deviceFeatures[deviceIndex - 1];
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
private static IList<object> GetContext(string time, string device)
{
    return new List<object>()
    {
        new { time = time },
        new { device = device }
    };
}
```

## Create the learning loop

The Personalizer learning loop is a cycle of [RankMultiSlot](#request-the-best-action) and [RewardMultiSlot](#send-a-reward) calls. In this quickstart, each Rank call, to personalize the content, is followed by a Reward call to tell Personalizer how well the service performed.

The following code loops through a cycle of asking the user their preferences through the command line, sending that information to Personalizer to select the best action for each slot, presenting the selection to the customer to choose from among the list, then sending a reward score to Personalizer signaling how well the service did in its selection.

```csharp
static void Main(string[] args)
{
    Console.WriteLine($"Welcome to this Personalizer Quickstart!\n" +
    $"This code will help you understand how to use the Personalizer APIs (multislot rank and multislot reward).\n" +
    $"Each iteration represents a user interaction and will demonstrate how context, actions, slots, and rewards work.\n" +
    $"Note: Personalizer AI models learn from a large number of user interactions:\n" +
    $"You won't be able to tell the difference in what Personalizer returns by simulating a few events by hand.\n" +
    $"If you want a sample that focuses on seeing how Personalizer learns, see the Python Notebook sample.");

    int iteration = 1;
    bool runLoop = true;

    IList<PersonalizerRankableAction> actions = GetActions();
    IList<PersonalizerSlotOptions> slots = GetSlots();
    PersonalizerClient client = InitializePersonalizerClient(new Uri(ServiceEndpoint));

    do
    {
        Console.WriteLine("\nIteration: " + iteration++);

        string timeOfDayFeature = GetTimeOfDayForContext();
        string deviceFeature = GetDeviceForContext();

        IList<object> currentContext = GetContext(timeOfDayFeature, deviceFeature);

        string eventId = Guid.NewGuid().ToString();

        var multiSlotRankOptions = new PersonalizerRankMultiSlotOptions(actions, slots, currentContext, eventId);
        PersonalizerMultiSlotRankResult multiSlotRankResult = client.RankMultiSlot(multiSlotRankOptions);

        for (int i = 0; i < multiSlotRankResult.Slots.Count(); ++i)
        {
            string slotId = multiSlotRankResult.Slots[i].SlotId;
            Console.WriteLine($"\nPersonalizer service decided you should display: { multiSlotRankResult.Slots[i].RewardActionId} in slot {slotId}. Is this correct? (y/n)");

            string answer = GetKey();

            if (answer == "Y")
            {
                client.RewardMultiSlot(eventId, slotId, 1f);
                Console.WriteLine("\nGreat! The application will send Personalizer a reward of 1 so it learns from this choice of action for this slot.");
            }
            else if (answer == "N")
            {
                client.RewardMultiSlot(eventId, slotId, 0f);
                Console.WriteLine("\nYou didn't like the recommended item. The application will send Personalizer a reward of 0 for this choice of action for this slot.");
            }
            else
            {
                client.RewardMultiSlot(eventId, slotId, 0f);
                Console.WriteLine("\nEntered choice is invalid. Service assumes that you didn't like the recommended item.");
            }
        }

        Console.WriteLine("\nPress q to break, any other key to continue:");
        runLoop = !(GetKey() == "Q");

    } while (runLoop);
}
```

Take a closer look at the rank and reward calls in the following sections.
Add the following methods, which [get the content choices](#get-content-choices-represented-as-actions), [get slots](#get-slots), and [send multi-slot rank and reward requests](#make-http-requests) before running the code file:

* `GetActions`
* `GetSlots`
* `GetTimeOfDayForContext`
* `GetDeviceForContext`
* `GetKey`
* `GetContext`

## Request the best action

To complete the Rank request, the program asks the user's preferences to create a `Context` of the content choices. The request contains the context, actions and slots with their respective features and a unique event ID, to receive a response.

This quickstart has simple context features of time of day and user device. In production systems, determining and [evaluating](../how-to-feature-evaluation.md) [actions and features](../concepts-features.md) can be a non-trivial matter.

```csharp
string timeOfDayFeature = GetTimeOfDayForContext();
string deviceFeature = GetDeviceForContext();

IList<object> currentContext = GetContext(timeOfDayFeature, deviceFeature);

string eventId = Guid.NewGuid().ToString();

var multiSlotRankOptions = new PersonalizerRankMultiSlotOptions(actions, slots, currentContext, eventId);
PersonalizerMultiSlotRankResult multiSlotRankResult = client.RankMultiSlot(multiSlotRankOptions);
```

## Send a reward

To get the reward score for the Reward request, the program gets the user's selection for each slot through the command line, assigns a numeric value (reward score) to the selection, then sends the unique event ID, slot ID, and the reward score for each slot as the numeric value to the Reward API. A reward doesn't need to be defined for each slot.

This quickstart assigns a simple number as a reward score, either a zero or a 1. In production systems, determining when and what to send to the [Reward](../concept-rewards.md) call can be a non-trivial matter, depending on your specific needs.

```csharp
for (int i = 0; i < multiSlotRankResult.Slots.Count(); ++i)
{
    string slotId = multiSlotRankResult.Slots[i].SlotId;
    Console.WriteLine($"\nPersonalizer service decided you should display: { multiSlotRankResult.Slots[i].RewardActionId} in slot {slotId}. Is this correct? (y/n)");

    string answer = GetKey();

    if (answer == "Y")
    {
        client.RewardMultiSlot(eventId, slotId, 1f);
        Console.WriteLine("\nGreat! The application will send Personalizer a reward of 1 so it learns from this choice of action for this slot.");
    }
    else if (answer == "N")
    {
        client.RewardMultiSlot(eventId, slotId, 0f);
        Console.WriteLine("\nYou didn't like the recommended item. The application will send Personalizer a reward of 0 for this choice of action for this slot.");
    }
    else
    {
        client.RewardMultiSlot(eventId, slotId, 0f);
        Console.WriteLine("\nEntered choice is invalid. Service assumes that you didn't like the recommended item.");
    }
}
```

## Run the program

Run the application with the dotnet `run` command from your application directory.

```console
dotnet run
```

![The quickstart program asks a couple of questions to gather user preferences, known as features, then provides the top action.](../media/csharp-quickstart-commandline-feedback-loop/multislot-quickstart-program-feedback-loop-example-1.png)


The [source code for this quickstart](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/dotnet/Personalizer/multislot-quickstart-v2PreviewSdk) is available.
