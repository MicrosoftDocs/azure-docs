---
title: include file
description: include file
services: cognitive-services
manager: nitinme
ms.author: jacodel
author: jcodella
ms.service: cognitive-services
ms.subservice: personalizer
ms.topic: include
ms.custom: cog-serv-seo-aug-2020
ms.date: 09/19/2022
---

You will need to install the Personalizer client library for .NET to:
* Authenticate the quickstart example client with a Personalizer resource in Azure.
* Send context and action features to the Reward API, which will return the best action from the Personalizer model
* Send a reward score to the Rank API and train the Personalizer model.

[Reference documentation](/dotnet/api/Microsoft.Azure.CognitiveServices.Personalizer) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/cognitiveservices/Personalizer) | [Package (NuGet)](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Personalizer/) | [.NET code sample](https://github.com/Azure-Samples/cognitive-services-quickstart-code/tree/master/dotnet/Personalizer)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* The current version of [.NET Core](https://dotnet.microsoft.com/download/dotnet-core).
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesPersonalizer"  title="Create a Personalizer resource"  target="_blank">create a Personalizer resource </a> in the Azure portal to get your key and endpoint. After it deploys, click **Go to resource**.
    * You will need the key and endpoint from the resource you create to connect your application to the Personalizer API. You'll paste your key and endpoint into the code below later in the quickstart.
    * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

## Setting Up

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
dotnet add package Microsoft.Azure.CognitiveServices.Personalizer --version 1.0.0
```

> [!TIP]
> If you're using the Visual Studio IDE, the client library is available as a downloadable NuGet package.

From the project directory, open the `Program.cs` file in your preferred editor or IDE. Add the following using directives:

```csharp
using Microsoft.Azure.CognitiveServices.Personalizer;
using Microsoft.Azure.CognitiveServices.Personalizer.Models;
```

## Object model

The client is a [PersonalizerClient](/dotnet/api/microsoft.azure.cognitiveservices.personalizer.personalizerclient) object that authenticates to Azure using Microsoft.Rest.ServiceClientCredentials containing your key.

To request the best action from Personalizer, create a [RankRequest](/dotnet/api/microsoft.azure.cognitiveservices.personalizer.models.rankrequest) containing a list of [RankableActions](/dotnet/api/azure-cognitiveservices-personalizer/azure.cognitiveservices.personalizer.models.rankableaction) that Personalizer will choose from, and the context features. The RankRequest will be passed to the client.Rank method, which returns a RankResponse.

To send a reward score to Personalizer, create a [RewardRequest](/dotnet/api/microsoft.azure.cognitiveservices.personalizer.models.rewardrequest) with the event ID corresponding to the Rank call that returned the best action, and the reward score. Then, pass it to the [client.Reward](/dotnet/api/microsoft.azure.cognitiveservices.personalizer.personalizerclientextensions.reward) method.

Later in this quick-start, we'll define an example reward score. However, the reward is one of the most important considerations when designing your Personalizer architecture. In a production system, determining what factors affect the [reward score](../concept-rewards.md) can be challenging, and you may decide to change your reward score as your scenario or business needs change.

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

> [!IMPORTANT]
> Remember to remove the key from your code when you're done, and never post it publicly. For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../key-vault/general/overview.md). See the Cognitive Services [security](../../cognitive-services-security.md) article for more information.

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

## Define actions and their features

Actions represent the choices from which Personalizer decides the best to use given the current context. The following code snippet creates a dictionary of four actions and the features (defined in the ActionFeatures class) that describe them. The function `GetActions()` assembles a list of `RankableAction` objects used in calling the Rank API for inference later in the quick-start.

Recall for our grocery website scenario, actions are the possible food items to be displayed in the "Featured Product" section on the website. The features here are simple examples that may be relevant in such a scenario.

## Get food items as rankable actions

Actions represent the content choices from which you want Personalizer to select the best content item. Add the following methods to the Program class to represent the set of actions and their features. 

```csharp
static Dictionary<string, ActionFeatures> actions = new Dictionary<string, ActionFeatures>
{
    {"pasta", new ActionFeatures(
                    new BrandInfo(company: "pasta_inc"),
                    new ItemAttributes(
                        quantity: 1,
                        category: "Italian",
                        price: 12),
                    new DietaryAttributes(
                        vegan: false,
                        lowCarb: false,
                        highProtein: false,
                        vegetarian: false,
                        lowFat: true,
                        lowSodium: true))},
    {"bbq", new ActionFeatures(
                    new BrandInfo(company: "ambisco"),
                    new ItemAttributes(
                        quantity: 2,
                        category: "bbq",
                        price: 20),
                    new DietaryAttributes(
                        vegan: false,
                        lowCarb: true,
                        highProtein: true,
                        vegetarian: false,
                        lowFat: false,
                        lowSodium: false))},
    {"bao", new ActionFeatures(
                    new BrandInfo(company: "bao_and_co"),
                    new ItemAttributes(
                        quantity: 4,
                        category: "Chinese",
                        price: 8),
                    new DietaryAttributes(
                        vegan: false,
                        lowCarb: true,
                        highProtein: true,
                        vegetarian: false,
                        lowFat: true,
                        lowSodium: false))},
    {"hummus", new ActionFeatures(
                    new BrandInfo(company: "garbanzo_inc"),
                    new ItemAttributes(
                        quantity: 1,
                        category: "Breakfast",
                        price: 5),
                    new DietaryAttributes(
                        vegan: true,
                        lowCarb: false,
                        highProtein: true,
                        vegetarian: true,
                        lowFat: false,
                        lowSodium: false))},
    {"veg_platter", new ActionFeatures(
                    new BrandInfo(company: "farm_fresh"),
                    new ItemAttributes(
                        quantity: 1,
                        category: "produce",
                        price: 7),
                    new DietaryAttributes(
                        vegan: true,
                        lowCarb: true,
                        highProtein: false,
                        vegetarian: true,
                        lowFat: true,
                        lowSodium: true ))},
};

static IList<RankableAction> GetActions()
{
    IList<RankableAction> rankableActions = new List<RankableAction>();
    foreach (var action in actions)
    {
        rankableActions.Add(new RankableAction
        {
            Id = action.Key,
            Features = new List<object>() { action.Value }
        });
    }
    
    return rankableActions;
}

public class BrandInfo
{
    public string Company { get; set; }
    public BrandInfo(string company)
    {
        Company = company;
    }
}

public class ItemAttributes
{
    public int Quantity { get; set; }
    public string Category { get; set; }
    public double Price { get; set; }
    public ItemAttributes(int quantity, string category, double price)
    {
        Quantity = quantity;
        Category = category;
        Price = price;
    }
}

public class DietaryAttributes
{
    public bool Vegan { get; set; }
    public bool LowCarb { get; set; }
    public bool HighProtein { get; set; }
    public bool Vegetarian { get; set; }
    public bool LowFat { get; set; }
    public bool LowSodium { get; set; }
    public DietaryAttributes(bool vegan, bool lowCarb, bool highProtein, bool vegetarian, bool lowFat, bool lowSodium)
    {
        Vegan = vegan;
        LowCarb = lowCarb;
        HighProtein = highProtein;
        Vegetarian = vegetarian;
        LowFat = lowFat;
        LowSodium = lowSodium;

    }
}

public class ActionFeatures
{
    public BrandInfo BrandInfo { get; set; }
    public ItemAttributes ItemAttributes { get; set; }
    public DietaryAttributes DietaryAttributes { get; set; }
    public ActionFeatures(BrandInfo brandInfo, ItemAttributes itemAttributes, DietaryAttributes dietaryAttributes)
    {
        BrandInfo = brandInfo;
        ItemAttributes = itemAttributes;
        DietaryAttributes = dietaryAttributes;
    }
}
```

## Define users and their context features

Context can represent the current state of your application, system, environment, or user. The following code creates a list with user preferences, and the `GetContext()` function selects a random user, random time of day, random location and random app type and assembles the features into a `Context` object, which will be used later when calling the Rank API. In our grocery website scenario, the user info consists of dietary preferences, a historical average of the order price. Let's assume our users are always on the move and include a location, time of day, and application type, which we choose randomly to simulate changing contexts every time `GetContext()` is called.

```csharp
public static Context GetContext()
{
    return new Context(
            user: GetRandomUser(),
            timeOfDay: GetRandomTimeOfDay(),
            location: GetRandomLocation(),
            appType: GetRandomAppType());
}

static string[] timesOfDay = new string[] { "morning", "afternoon", "evening" };

static string[] locations = new string[] { "west", "east", "midwest" };

static string[] appTypes = new string[] { "edge", "safari", "edge_mobile", "mobile_app" };

static IList<UserProfile> users = new List<UserProfile>
{
    new UserProfile(
        name: "Bill",
        dietaryPreferences: new Dictionary<string, bool> { { "low_carb", true } },
        avgOrderPrice: "0-20"),
    new UserProfile(
        name: "Satya",
        dietaryPreferences: new Dictionary<string, bool> { { "low_sodium", true} },
        avgOrderPrice: "201+"),
    new UserProfile(
        name: "Amy",
        dietaryPreferences: new Dictionary<string, bool> { { "vegan", true }, { "vegetarian", true } },
        avgOrderPrice: "21-50")
};

static string GetRandomTimeOfDay()
{
    var random = new Random();
    var timeOfDayIndex = random.Next(timesOfDay.Length);
    Console.WriteLine($"TimeOfDay: {timesOfDay[timeOfDayIndex]}");
    return timesOfDay[timeOfDayIndex];
}

static string GetRandomLocation()
{
    var random = new Random();
    var locationIndex = random.Next(locations.Length);
    Console.WriteLine($"Location: {locations[locationIndex]}");
    return locations[locationIndex];
}

static string GetRandomAppType()
{
    var random = new Random();
    var appIndex = random.Next(appTypes.Length);
    Console.WriteLine($"AppType: {appTypes[appIndex]}");
    return appTypes[appIndex];
}

static UserProfile GetRandomUser()
{
    var random = new Random();
    var userIndex = random.Next(users.Count);
    Console.WriteLine($"\nUser: {users[userIndex].Name}");
    return users[userIndex];
}

public class UserProfile
{
    // Mark name as non serializable so that it is not part of the context features
    [NonSerialized()]
    public string Name;
    public Dictionary<string, bool> DietaryPreferences { get; set; }
    public string AvgOrderPrice { get; set; }

    public UserProfile(string name, Dictionary<string, bool> dietaryPreferences, string avgOrderPrice)
    {
        Name = name;
        DietaryPreferences = dietaryPreferences;
        AvgOrderPrice = avgOrderPrice;
    }
}

public class Context
{
    public UserProfile User { get; set; }
    public string TimeOfDay { get; set; }
    public string Location { get; set; }
    public string AppType { get; set; }

    public Context(UserProfile user, string timeOfDay, string location, string appType)
    {
        User = user;
        TimeOfDay = timeOfDay;
        Location = location;
        AppType = appType;
    }
}
```

The context features in this quick-start are simplistic, however, in a real production system, designing your [features](../concepts-features.md) and [evaluating their effectiveness](../concept-feature-evaluation.md) can be non-trivial. You can refer to the aforementioned documentation for guidance.

## Define a reward score based on user behavior

The reward score can be considered an indication how "good" the personalized action is. In a real production system, the reward score should be designed to align with your business objectives and KPIs. For example, your application code can be instrumented to detect a desired user behavior (for example, a purchase) that aligns with your business objective (for example, increased revenue).

In our grocery website scenario, we have three users: Bill, Satya, and Amy each with their own preferences. If a user purchases the product chosen by Personalizer, a reward score of 1.0 will be sent to the Reward API. Otherwise, the default reward of 0.0 will be used. In a real production system, determining how to design the [reward](../concept-rewards.md) may require some experimentation.

In the code below, the users' preferences and responses to the actions is hard-coded as a series of conditional statements, and explanatory text is included in the code for demonstrative purposes. In a real scenario, Personalizer will learn user preferences from the data sent in Rank and Reward API calls. You won't define these explicitly as in the example code.

The hard-coded preferences and reward can be succinctly described as:

* Bill will purchase any product less than $10 as long as he isn't in the midwest.
* When Bill is in the midwest, he'll purchase any product as long as it's low in carbs.
* Satya will purchase any product that's low in sodium.
* Amy will purchase any product that's either vegan or vegetarian.

```csharp
public static float GetRewardScore(Context context, string actionId)
{
    float rewardScore = 0.0f;
    string userName = context.User.Name;
    ActionFeatures actionFeatures = actions[actionId];
    if (userName.Equals("Bill"))
    {
        if (actionFeatures.ItemAttributes.Price < 10 && !context.Location.Equals("midwest"))
        {
            rewardScore = 1.0f;
            Console.WriteLine($"\nBill likes to be economical when he's not in the midwest visiting his friend Warren. He bought {actionId} because it was below a price of $10.");
        }
        else if (actionFeatures.DietaryAttributes.LowCarb && context.Location.Equals("midwest"))
        {
            rewardScore = 1.0f;
            Console.WriteLine($"\nBill is visiting his friend Warren in the midwest. There he's willing to spend more on food as long as it's low carb, so Bill bought {actionId}.");
        }
        else if (actionFeatures.ItemAttributes.Price >= 10 && !context.Location.Equals("midwest"))
        {
            rewardScore = 1.0f;
            Console.WriteLine($"\nBill didn't buy {actionId} because the price was too high when not visting his friend Warren in the midwest.");
        }
        else if (actionFeatures.DietaryAttributes.LowCarb && context.Location.Equals("midwest"))
        {
            rewardScore = 1.0f;
            Console.WriteLine($"\nBill didn't buy {actionId} because it's not low-carb, and he's in the midwest visitng his friend Warren.");
        }
    }
    else if (userName.Equals("Satya"))
    {
        if (actionFeatures.DietaryAttributes.LowSodium)
        {
            rewardScore = 1.0f;
            Console.WriteLine($"\nSatya is health conscious, so he bought {actionId} since it's low in sodium.");
        }
        else
        {
            Console.WriteLine($"\nSatya did not buy {actionId} because it's not low sodium.");
        }
    }
    else if (userName.Equals("Amy"))
    {
        if (actionFeatures.DietaryAttributes.Vegan || actionFeatures.DietaryAttributes.Vegetarian)
        {
            rewardScore = 1.0f;
            Console.WriteLine($"\nAmy likes to eat plant-based foods, so she bought {actionId} because it's vegan or vegetarian friendly.");
        }
        else
        {
            Console.WriteLine($"\nAmy did not buy {actionId} because it's not vegan or vegetarian.");
        }
    }
    return rewardScore;
}
```

## Run Rank and Reward calls for each user

A Personalizer event cycle consists of [Rank](#request-the-best-action) and [Reward](#send-a-reward) API calls. In our grocery website scenario, each Rank call is made to determine which product should be displayed in the "Featured Product" section. Then the Reward call tells Personalizer whether or not the featured product was purchased by the user.


### Request the best action

In a Rank call, you need to provide at least two arguments: a list of `RankableActions` (_actions and their features_), and a list of (_context_) features. The response will include the `RewardActionId`, which is the ID of the action Personalizer has determined is best for the given context. The response also includes the `EventId`, which is needed in the Reward API so Personalize knows how to link the data from the corresponding Rank and Reward calls. For more information, refer to the [Rank API docs](/rest/api/personalizer/1.0/rank/rank).


### Send a reward

In a Reward call, you need to provide two arguments: the `EventId`, which links the Rank and Reward calls to the same unique event, and the `value` (reward score). Recall that the reward score is a signal that tells Personalizer if the decision made in the Rank call was a good or not. A reward score is typically a number between 0.0 and 1.0. It's worth reiterating that determining how to design the [reward](../concept-rewards.md) can be non-trivial.


### Run a Rank and Reward cycle

The following code loops through a single cycle of Rank and Reward calls for a randomly selected user, then prints relevant information to the console at each step.

```csharp
static void Main(string[] args)
{
    int iteration = 1;
    bool runLoop = true;

    // Get the actions list to choose from personalizer with their features.
    IList<RankableAction> actions = GetActions();

    // Initialize Personalizer client.
    PersonalizerClient client = InitializePersonalizerClient(ServiceEndpoint);

    do
    {
        Console.WriteLine("\nIteration: " + iteration++);

        // <rank>
        // Get context information.
        Context context = GetContext();

        // Create current context from user specified data.
        IList<object> currentContext = new List<object>() {
            context
        };

        // Generate an ID to associate with the request.
        string eventId = Guid.NewGuid().ToString();

        // Rank the actions
        var request = new RankRequest(actions: actions, contextFeatures: currentContext, eventId: eventId);
        RankResponse response = client.Rank(request);
        // </rank>

        Console.WriteLine($"\nPersonalizer service thinks {context.User.Name} would like to have: {response.RewardActionId}.");

        // <reward>
        float reward = GetRewardScore(context, response.RewardActionId);

        // Send the reward for the action based on user response.
        client.Reward(response.EventId, new RewardRequest(reward));
        // </reward>

        Console.WriteLine("\nPress q to break, any other key to continue:");
        runLoop = !(GetKey() == "Q");

    } while (runLoop);
}

private static string GetKey()
{
    return Console.ReadKey().Key.ToString().Last().ToString().ToUpper();
}
```


## Run the program

Run the application with the dotnet `run` command from your application directory.

```console
dotnet run
```

![The quickstart program asks a couple of questions to gather user preferences, known as features, then provides the top action.](../media/csharp-quickstart-commandline-feedback-loop/quickstart-program-feedback-loop-example.png)

The [source code for this quickstart](https://github.com/Azure-Samples/cognitive-services-quickstart-code/tree/master/dotnet/Personalizer) is available.
