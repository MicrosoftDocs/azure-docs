---
title: Use web app - Personalizer
description: Customize a C# .NET web app with a Personalizer loop to provide the correct content to a user based on actions (with features) and context features.
ms.topic: troubleshooting
ms.date: 03/09/2020
ms.author: diberry
---
# Add Personalizer to a .NET web app

Customize a C# .NET web app with a Personalizer loop to provide the correct content to a user based on actions (with features) and context features.

**In this tutorial, you learn how to:**

<!-- green checkmark -->
> [!div class="checklist"]
> * Set up Personalizer key and endpoint
> * Collect features
> * Call Rank API
> * Display top action, designated as _rewardActionId_

## Select the best content for a web app

A web app should use Personalizer when there is an _action_ (some type of content) on the web page that needs to be personalized to a single top item (rewardActionId) to display. Examples of action lists include news articles, button placement locations, and word choices for product names.

You send the list to the Personalizer loop, Personalizer selects the single best content, then your web app displays that content.

In this tutorial, the actions are types of food:

* pasta
* ice cream
* juice
* salad

To help Personalizer learn about your actions, send both __actions with features_ and _context features_ with each Rank API request.

A **feature** of the model is information about the action or context that can be aggregated (grouped) across members of your web app user base. A feature _isn't_ individually specific (such as a user ID) or highly specific (such as an exact time of day).

### Actions with features

Each action (content item) has features to help distinguish the food item:

* taste - such as salty or sweet
* spiceLevel - none, low, medium
* nutritionLevel - a number within a range such as 1-10

The features aren't configured as part of the loop configuration in the Azure portal. Instead they are sent as a JSON object with each Rank API call. This allows flexibility for the actions and their features to grow, change, and shrink over time, which allows Personalizer to follow trends.

```json
"actions": [
    {
      "id": "pasta",
      "features": [
        {
          "taste": "salty",
          "spiceLevel": "medium"
        },
        {
          "nutritionLevel": 5,
          "cuisine": "italian"
        }
      ]
    },
    {
      "id": "ice cream",
      "features": [
        {
          "taste": "sweet",
          "spiceLevel": "none"
        },
        {
          "nutritionalLevel": 2
        }
      ]
    },
    {
      "id": "juice",
      "features": [
        {
          "taste": "sweet",
          "spiceLevel": "none"
        },
        {
          "nutritionLevel": 5
        },
        {
          "drink": true
        }
      ]
    },
    {
      "id": "salad",
      "features": [
        {
          "taste": "salty",
          "spiceLevel": "low"
        },
        {
          "nutritionLevel": 8
        }
      ]
    }
  ]
```

## Context features

Context features help Personalizer understand the context of the actions. The context for this sample application includes:

* time of day - morning, afternoon, evening, night
* user's preference for taste - salty or sweet
* browser's context - user agent, geographical location, referrer

```json
"contextFeatures": [
    {
      "time": "morning"
    },
    {
      "taste": "sweet"
    },
    {
      "httpRequestFeatures": {
        "_synthetic": false,
        "OUserAgent": {
          "_ua": "",
          "_DeviceBrand": "",
          "_DeviceFamily": "Other",
          "_DeviceIsSpider": false,
          "_DeviceModel": "",
          "_OSFamily": "Windows",
          "_OSMajor": "10",
          "DeviceType": "Desktop"
        }
      }
    }
  ]
```

## How does the web app use Personalizer?

The web app uses Personalizer to select the best action from the list of pasta, ice cream, juice, and salad. It does this by sending the following information with each Rank API call:
* **actions** with their features such as `taste` and `spiceLevel`
* **context** features such as `time` of day, user's `taste` preference, and the browser's user agent information, and context features
* **actions to exclude** such as juice
* **eventid, which is different for each call to Rank API.

## Personalizer model features in a web app

Personalizer needs features about the actions (content) and the context (user and environment). Features are used to align actions and context in the model.

The model, including features, is updated on a schedule based on your **Model update frequency** setting in the Azure portal.

> [!CAUTION]
> Features in this application are meant to illustrate features and feature values but not necessarily to the best features to use in a web app.

### Plan for features and their values

Features should be selected with the same planning and design that you would apply to any schema or model in your technical architecture. The feature values can be set with business logic or third-party systems. Feature values should not be so highly specific that they don't apply across a group or class.

### Generalize feature values

#### Generalize into categories

This app uses `time` as a feature but groups time into categories of `morning`, `afternoon`, `evening`, and `night`. That is an example of using the information of time but not in a highly specific way, such as `10:05:01 UTC+2`.

#### Generalize into parts

This app uses the HTTP Request features from the browser. This starts with a very specific string with all the data, for example:

```http
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/530.99 (KHTML, like Gecko) Chrome/80.0.3900.140 Safari/537.36
```

The **HttpRequestFeatures** class library generalizes this string into a **userAgentInfo** object with individual values. Any values are too specific are set to an empty string. When the context features for the request are sent, it has the following JSON format:

```JSON
{
  "httpRequestFeatures": {
    "_synthetic": false,
    "OUserAgent": {
      "_ua": "",
      "_DeviceBrand": "",
      "_DeviceFamily": "Other",
      "_DeviceIsSpider": false,
      "_DeviceModel": "",
      "_OSFamily": "Windows",
      "_OSMajor": "10",
      "DeviceType": "Desktop"
    }
  }
}
```

## Download the working sample

In this tutorial, the complete sample web app is provided for you.

1. Download the [GitHub samples repository](git clone https://github.com/Azure-Samples/cognitive-services-personalizer-samples.git) for Personalizer.

    ```bash
    git clone https://github.com/Azure-Samples/cognitive-services-personalizer-samples.git
    ```

1. Use Visual Studio 2019 to open the solution, `HttpRequestFeatures.sln`. This sample is found within the `/samples/HttpRequestFeatures` folder.

    The solution includes two projects:
    * **HttpRequestFeaturesExample**, a .NET web app, which manages both the web page and the Rank API call.
        * **HomeController.cs** manages the interaction with Personalizer and passes the data to the Index.cshtml page to display.
        * **Index.cshtml** displays the values passed from HomeController.cs
    * **HttpRequestFeatures**, a class library, which create the context features for the user agent.

    > [!div class="mx-imgBorder"]
    > ![Use Visual Studio 2019 to open the solution, `HttpRequestFeatures.sln`. This sample is found within the `/samples/HttpRequestFeatures` folder.](./media/tutorial-web-app/solution-explorer-files.png)

## Create a Personalizer resource in the Azure portal

Use either the [Azure portal](how-to-create-resource.md#create-a-resource-in-the-azure-portal) or the [Azure CLI](how-to-create-resource.md#create-a-resource-with-the-azure-cli) to create a Personalizer resource.

The resource has two values you need in order to use the loop:

* **Endpoint** - an example is: `https://your-resource-name.cognitiveservices.azure.com/`
* **Key** - a 32 character string

## Configure project with your Personalizer endpoint

Using best security practices, the endpoint is stored in the `appsetings.json` file, as the property **ServiceEndpoint**. Change `your-resource-end-goes-here` to your own endpoint URL.

```JSON
{
  "PersonalizerConfiguration": {
    "ServiceEndpoint": "replace-with-your-resource-endpoint"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Warning"
    }
  },
  "AllowedHosts": "*"
}
```

## Configure project with your Personalizer key

Using best security practices, use the Visual Studio solution feature to manage user secrets.

1. In Visual Studio, on the **Solution Explorer**, right-click the **HTTPRequestFeaturesExample** project, then select **Manage User Secrets**.

1. In the secrets.json file, enter the value for the **PersonalizerApiKey**.

    ```json
    {
      "PersonalizerApiKey": "replace-with-your-resource-key"
    }
    ```

## Run the sample

1. Build and run the **HTTPRequestFeaturesExample** project. A browser window opens to `https://localhost:44332/` displaying the single page application.

    > [!div class="mx-imgBorder"]
    > ![Build and run the HTTPRequestFeaturesExample project. A browser window opens to `https://localhost:44332/` displaying the single page application.](./media/tutorial-web-app/web-app-single-page.png)

## Create the Personalizer client

This is a typical .NET web app, much of the code is provided for you and general. Any code not specific to Personalizer is removed from these code snippets so you can focus on the Personalizer-specific code.

In the **Startup.cs**, the Personalizer endpoint and key are used to create the Personalizer client.

```csharp
using Microsoft.Azure.CognitiveServices.Personalizer;
// ... other using statements removed for brevity

namespace HttpRequestFeaturesExample
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            string personalizerApiKey = Configuration.GetSection("PersonalizerApiKey").Value;
            string personalizerEndpoint = Configuration.GetSection("PersonalizerConfiguration:ServiceEndpoint").Value;
            if (string.IsNullOrEmpty(personalizerEndpoint) || string.IsNullOrEmpty(personalizerApiKey))
            {
                throw new ArgumentException("Missing Azure Personalizer endpoint and/or api key.");
            }

            // ... code unrelated to Personalizer removed for brevity

            services.AddSingleton(client =>
            {
                return new PersonalizerClient(new ApiKeyServiceClientCredentials(personalizerApiKey))
                {
                    Endpoint = personalizerEndpoint
                };
            });

            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            // general startup code unrelated to Personalizer removed for brevity
        }
    }
}
```

In the **HomeController.cs**, the constructor sets the Personalizer client object to a local variable.

```csharp
using Microsoft.Azure.CognitiveServices.Personalizer;
using Microsoft.Azure.CognitiveServices.Personalizer.Featurizers;
using Microsoft.Azure.CognitiveServices.Personalizer.Models;
// ... other using statements removed for brevity

namespace HttpRequestFeaturesExample.Controllers
{
    public class HomeController : Controller
    {
        PersonalizerClient client;

        public HomeController(PersonalizerClient personalizerClient)
        {
            this.client = personalizerClient;
        }
    }
    // other methods appear below constructor
}
```

## Application uses Personalizer to select best food item

In the **HomeController.cs**, the **Index** method summarizes the flow, first determining the features, then calling Personalizer, then setting the result from Personalizer into ViewData, including the best action, in the _rewardActionId_.

```csharp
public IActionResult Index()
{
    HttpRequestFeatures httpRequestFeatures = GetHttpRequestFeaturesFromRequest(Request);

    ViewData["UserAgent"] = JsonConvert.SerializeObject(httpRequestFeatures, Formatting.Indented);

    Tuple<string, string, string> personalizationobj = callPersonalizationService(httpRequestFeatures);
    ViewData["Personalizer Rank Request"] = personalizationobj.Item1;
    ViewData["Personalizer Rank Response"] = personalizationobj.Item2;
    ViewData["Personalizer rewardActionId"] = personalizationobj.Item3;

    return View();
}
```

The **Index.cshtml** page displays the ViewData values:

```cshtml
<p> </p>
<h2>Loading this app:</h2>
<ul>
    <li>Displays user agent information extracted from the http request.</li>
    <li>Sends a personalization rank request to the service.</li>
    <li>Displays rank request and the response received for the request.</li>
</ul>
<p> Click 'Send Request' in the nav bar to send a new rank request.</p>
<p> Returned rewardActionId: <b>@ViewData["Personalizer rewardActionId"]</p>
<asp:table >
    <asp:TableRow >
        <asp:TableCell>
            <h3>Request</h3>
            <p>User Agent</p>
            <pre>@ViewData["UserAgent"]</pre>

            <p>Content of a personalization rank request:</p>
            <pre>@ViewData["Personalizer Rank Request"]</pre>
        </asp:TableCell>
        <asp:TableCell>
            <h3>Response:</h3>
            <p>rewardActionId: <b>@ViewData["Personalizer rewardActionId"]</b></p>
            <pre>@ViewData["Personalizer Rank Response"]</pre>
        </asp:TableCell>
    </asp:TableRow>
</asp:table>
```

## Collect context feature values

In order to change the feature values, without requiring a lot of setup or interaction, the features are randomly determined.

In the HomeController.cs **callPersonalizationService** method, time of day and taste are collected, along with HTTP features and set to the `currentContext`.

```csharp
// Get context information from the user.
string timeOfDayFeature = GetUsersTimeOfDay();
string tasteFeature = GetUsersTastePreference();

// Create current context from user specified data.
IList<object> currentContext = new List<object>() {
        new { time = timeOfDayFeature },
        new { taste = tasteFeature },
        new { httpRequestFeatures }
};
```

When passed to the Rank API, the JSON for the context features looks like:

```json
"contextFeatures": [
  {
    "time": "night"
  },
  {
    "taste": "sweet"
  },
  {
    "httpRequestFeatures": {
      "_synthetic": false,
      "OUserAgent": {
        "_ua": "",
        "_DeviceBrand": "",
        "_DeviceFamily": "Other",
        "_DeviceIsSpider": false,
        "_DeviceModel": "",
        "_OSFamily": "Windows",
        "_OSMajor": "10",
        "DeviceType": "Desktop"
      }
    }
  }
]
```
## Collect action feature values

In this tutorial, the actions and their features are set with hard-coded strings. In a real-world application, these values can come from a business layer or third-party source.

In the HomeController.cs **GetActions** method, the four actions (food) and their features are set:

```csharp
private IList<RankableAction> GetActions()
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

When passed to the Rank API, the JSON for the action list looks like:

```json
"actions": [
  {
    "id": "pasta",
    "features": [
      {
        "taste": "salty",
        "spiceLevel": "medium"
      },
      {
        "nutritionLevel": 5,
        "cuisine": "italian"
      }
    ]
  },
  {
    "id": "ice cream",
    "features": [
      {
        "taste": "sweet",
        "spiceLevel": "none"
      },
      {
        "nutritionalLevel": 2
      }
    ]
  },
  {
    "id": "juice",
    "features": [
      {
        "taste": "sweet",
        "spiceLevel": "none"
      },
      {
        "nutritionLevel": 5
      },
      {
        "drink": true
      }
    ]
  },
  {
    "id": "salad",
    "features": [
      {
        "taste": "salty",
        "spiceLevel": "low"
      },
      {
        "nutritionLevel": 8
      }
    ]
  }
]
```

## Use excluded actions to ignore actions

There may be circumstances when you want to ignore certain actions. This application has a hard-coded exception for `juice` as a single item in a list.

You may want to add actions to the excluded actions list if:

* Edward/Tyler - thoughts here?

Build the list of exceptions then add it to the excludeActions variable.

```csharp
// Exclude an action for personalization ranking. This action will be held at its current position.
IList<string> excludeActions = new List<string> { "juice" };
```

When passed to the Rank API, the JSON for the excluded action list looks like:

```json
"excludedActions": [
    "juice"
]
```

## Create an event ID

The event ID can be tied to an existing business layer event ID or generated just for the Rank ID. The event ID is important so that you can call the Reward API, with the reward value and the event ID. This tells your Personalizer loop how well the Rank API did and choosing the best action for that event ID.

In this tutorial, the event ID is a generated GUID:

```csharp
// Generate an ID to associate with the request.
string eventId = Guid.NewGuid().ToString();
```

When passed to the Rank API, the JSON for the event ID looks like:

```json
"eventId": "09e77e0c-62d8-416d-8950-eb4af5b92d20"
```

## Call Rank API with actions, excluded actions, and context features.

Call the Rank API with your collection of actions (and their features), your context features, excluded actions, and the event ID. The response includes the top action as _rewardActionId_, and the rest of the actions along with their scores.

```csharp
private Tuple<string, string, string> callPersonalizationService(HttpRequestFeatures httpRequestFeatures)
{
    // Generate an ID to associate with the request.
    string eventId = Guid.NewGuid().ToString();

    // Get the actions list to choose from personalization with their features.
    IList<RankableAction> actions = GetActions();

    // Get context information from the user.
    string timeOfDayFeature = GetUsersTimeOfDay();
    string tasteFeature = GetUsersTastePreference();

    // Create current context from user specified data.
    IList<object> currentContext = new List<object>() {
            new { time = timeOfDayFeature },
            new { taste = tasteFeature },
            new { httpRequestFeatures }
    };

    // Exclude an action for personalization ranking. This action will be held at its current position.
    IList<string> excludeActions = new List<string> { "juice" };

    // Rank the actions
    var request = new RankRequest(actions, currentContext, excludeActions, eventId);
    RankResponse response = client.Rank(request);

    string rankjson = JsonConvert.SerializeObject(request, Formatting.Indented);
    string rewardjson = JsonConvert.SerializeObject(response, Formatting.Indented);
    string rewardActionId = response.RewardActionId;

    return Tuple.Create(rankjson, rewardjson, rewardActionId);
}
```

When returned from the Rank API, the JSON for the response looks like:

```json
{
  "ranking": [
    {
      "id": "pasta",
      "probability": 0.333333343
    },
    {
      "id": "ice cream",
      "probability": 0.333333343
    },
    {
      "id": "juice",
      "probability": 0.0
    },
    {
      "id": "salad",
      "probability": 0.333333343
    }
  ],
  "eventId": "09e77e0c-62d8-416d-8950-eb4af5b92d20",
  "rewardActionId": "pasta"
}
```

## Display the rewardActionId action

In this tutorial, the rewardActionId value is displayed in text. In your own application, that may be exact text, a button, or a section of the web page highlighted. The list is returned for any post-analysis of scores, not an ordering of the content. Only the rewardActionId content should be displayed.

