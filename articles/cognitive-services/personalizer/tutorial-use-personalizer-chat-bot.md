---
title: Use Personalizer in chat bot - Personalizer
description: Customize a C# .NET chat bot with a Personalizer loop to provide the correct content to a user based on actions (with features) and context features.
ms.topic: tutorial
ms.date: 07/09/2020
ms.author: diberry
---

# Tutorial: Use Personalizer in .NET chat bot

Use a C# .NET chat bot with a Personalizer loop to provide the correct content to a user based on actions (with features) and context features.

This chat bot suggests a specific coffee or tea to a user. The user can accept or reject that suggestion. This gives Personalizer information to help make the next suggestion.

**In this tutorial, you learn how to:**

<!-- green checkmark -->
> [!div class="checklist"]
> * Set up Personalizer key and endpoint
> * Collect features
> * Call Rank and Reward APIs
> * Display top action, designated as _rewardActionId_

## Install required software
- [Visual Studio 2019](https://visualstudio.microsoft.com/downloads/)
- [Microsoft Bot Framework Emulator](https://aka.ms/botframeworkemulator) is a desktop application that allows bot developers to test and debug their bots on localhost or running remotely through a tunnel.

## Download the sample code of the chat bot

The chat bot is available in the Personalizer samples repository. Clone the repository, then open the sample in the `/samples/ChatbotExample` directory with Visual Studio 2019.

```bash
git clone https://github.com/Azure-Samples/cognitive-services-personalizer-samples.git
```

## Create and configure Personalizer and LUIS resources

### Create Azure resources

To use this chat bot, you need to create Azure resources for Personalizer and Language Understanding (LUIS).

* [Create LUIS resources](../luis/luis-how-to-azure-subscription.md#create-luis-resources-in-azure-portal). Select **both** in the creation step because you need both an authoring and prediction resources.
* [Create Personalizer resource](how-to-create-resource.md) then copy the key and endpoint from the Azure portal. You will need to set these values in the `appsettings.json` file of the .NET project.

### Create LUIS app

If you are new to LUIS, you need to [sign in](https://www.luis.ai) and immediately migrate your account. You don't need to create new resources, instead select the resources you created in the previous section of this tutorial.

1. To create a new LUIS application, in the [LUIS portal](https://www.luis.ai), select your subscription and authoring resource.
1. Then, still on the same page, select **+ New app for conversation**, then **Import as JSON**.
1. In the pop-up dialog, select **Choose file** then select the `/samples/ChatbotExample/CognitiveModels/coffeebot.json` file. Enter the name `Personalizer Coffee bot`.
1. Select the **Train** button in the top right navigation of the LUIS portal.
1. Select the **Publish** button to publish the app to the **Production slot** for the prediction runtime.
1. Select **Manage**, then **Settings**. Copy the value of the **App ID**. You will need to set this value in the `appsettings.json` file of the .NET project.
1. Still in the **Manage** section, select **Azure Resources**. This displays the associated resources on the app.
1. Select **Add prediction resource**. In the pop-up dialog, select your subscription, and the prediction resource created in a previous section of this tutorial, then select **Done**.
1. Copy the values of the **Primary key** and **Endpoint URL**. You will need to set these values in the `appsettings.json` file of the .NET project.

### Set values in appsettings.json file

1. Open the chat bot solution file, `ChatbotSamples.sln`, with Visual Studio 2019.
1. Open `appsettings.json` in the root directory of the project.
1. Set all 5 settings copied in the previous section of this tutorial.

    ```json
    {
      "PersonalizerChatbot": {
        "LuisAppId": "",
        "LuisAPIKey": "",
        "LuisServiceEndpoint": "",
        "PersonalizerServiceEndpoint": "",
        "PersonalizerAPIKey": ""
      }
    }
    ```

### Build and run the bot

Once you have configured the `appsettings.json`, you are ready to build and run the chat bot. When you do, a browser opens to the running website, `http://localhost:3978`.

:::image type="content" source="media/tutorial-chat-bot/chat-bot-web-site.png" alt-text="Screenshot of browser displaying chat bot web site.":::

Keep the web site running because the tutorial explains what the bot is doing, so you can interact with the bot.

## How does the chat bot work?

A chat bot is typically a back-and-forth conversation with a user. This specific chat bot uses Personalizer to select the best action (coffee or tea) to offer the user. Personalizer uses reinforcement learning to make that selection.

The chat bot needs to manage turns in conversation. The chat bot uses [Bot Framework](https://github.com/microsoft/botframework-sdk) to manage the bot architecture and conversation and uses the Cognitive Service, [Language Understanding](../LUIS/index.yml) (LUIS), to understand the intent of the natural language from the user.

The chat bot is a web site with a specific route available to answer requests, `http://localhost:3978/api/messages`. You can use the bot emulator to visually interact with the running chat bot while you are developing a bot locally.

### User interactions with the bot

This is a simple chat bot which allows you to enter text queries.

|User enters text|Bot responds with text|Description of action bot takes to determine response text|
|--|--|--|
|No text entered - bot begins the conversation.|`This is a simple chatbot example that illustrates how to use Personalizer. The bot learns what coffee or tea order is preferred by customers given some context information (such as weather, temperature, and day of the week) and information about the user.`<br>`To use the bot, just follow the prompts. To try out a new imaginary context, type “Reset” and a new one will be randomly generated.`<br>`Welcome to the coffee bot, please tell me if you want to see the menu or get a coffee or tea suggestion for today. Once I’ve given you a suggestion, you can reply with ‘like’ or ‘don’t like’. It’s Tuesday today and the weather is Snowy.`|The bot begins the conversation with instructional text and lets you know what the context is: `Tuesday`, `Snowy`.|
|`Show menu`|`Here is our menu: Coffee: Cappuccino Espresso Latte Macchiato Mocha Tea: GreenTea Rooibos`|Determine intent of query using LUIS, then display menu choices of coffee and tea items. Features of the actions are |
|`What do you suggest`|`How about Latte?`|Determine intent of query using LUIS, then call **Rank API**, and display top choice as a question `How about {response.RewardActionId}?`. Also displays JSON call and response for illustration purposes.|
|`I like it`|`That’s great! I’ll keep learning your preferences over time.`<br>`Would you like to get a new suggestion or reset the simulated context to a new day?`|Determine intent of query using LUIS, then call **Reward API** with reward of `1`, displays JSON call and response for illustration purposes.|
|`I don't like it`|`Oh well, maybe I’ll guess better next time.`<br>`Would you like to get a new suggestion or reset the simulated context to a new day?`|Determine intent of query using LUIS, then call **Reward API** with reward of `0`, displays JSON call and response for illustration purposes.|
|`Reset`|Returns instructional text.|Determine intent of query using LUIS, then displays the instructional text and resets the context.|

### Use bot for demonstration only

There are a few cautions to note about this conversation:
* **Bot interaction**: The conversation is very simple because it is demonstrating Rank and Reward in a simple use case. It is not demonstrating the full functionality of the Bot Framework SDK or of the Emulator.
* **Personalizer**: The features are selected randomly to simulate usage. Do not randomize features in a production Personalizer scenario.
* **Language Understanding (LUIS)**: The few example utterances of the LUIS model are meant for this sample only. Do not use so few example utterances in your production LUIS application.

## Personalizer in a chat bot

This chat bot uses Personalizer to select the top action (specific coffee or tea), based on a list of _actions_ (some type of content) and context features.

You send the list of actions, along with context features, to the Personalizer loop. Personalizer selects the single best action, then your chat bot displays that action.

In this tutorial, the **actions** are types of coffee and tea:

* Coffee
    * Cappuccino
    * Espresso
    * Latte
    * Macchiato
    * Mocha
* Tea
    * GreenTea
    * Rooibos

**Rank API:** To help Personalizer learn about your actions, the bot sends the following with each Rank API request:

* Actions _with features_
* Context features

A **feature** of the model is information about the action or context that can be aggregated (grouped) across members of your chat bot user base. A feature _isn't_ individually specific (such as a user ID) or highly specific (such as an exact time of day).

Features are used to align actions to the current context in the model. The model is a representation of Personalizer's past knowledge about actions, context, and their features that allows it to make educated decisions.

The model, including features, is updated on a schedule based on your **Model update frequency** setting in the Azure portal.

Features should be selected with the same planning and design that you would apply to any schema or model in your technical architecture. The feature values can be set with business logic or third-party systems.

> [!CAUTION]
> Features in this application are for demonstration and may not necessarily be the best features to use in a your web app for your use case.

### Action features

Each action (content item) has features to help distinguish the coffee or tea item.

The features aren't configured as part of the loop configuration in the Azure portal. Instead they are sent as a JSON object with each Rank API call. This allows flexibility for the actions and their features to grow, change, and shrink over time, which allows Personalizer to follow trends.

Features for coffee and tea include:

* Origin location of coffee bean such as Kenya and Brazil
* Is the coffee or tea organic?
* Light or dark roast of coffee

While the coffee has three features in the preceding list, tea only has one. Only pass features to Personalizer that make sense to the action. Don't pass in an empty value for a feature if it doesn't apply to the action.

### Context features

Context features help Personalizer understand the context of the environment such as the display device, the user, the location, and other features your system knows about the environment that are relevant to your use case.

The context for this chat bot includes:

* Type of weather (snowy, rainy, sunny)
* Day of the week

Selection of features is randomized in this chat bot. In a real bot, use real data for your context features.

## Set up the bot emulator

1. Open the Bot Emulator, and select **Open Bot**.

    :::image type="content" source="media/tutorial-chat-bot/bot-emulator-startup.png" alt-text="Screenshot of bot emulator startup screen.":::


1. Configure the bot with the following **bot URL** then select **Connect**:

    `http://localhost:3978/api/messages`

    :::image type="content" source="media/tutorial-chat-bot/bot-emulator-open-bot-settings.png" alt-text="Screenshot of bot emulator open bot settings.":::

    The emulator connects to the chat bot and displays the instructional text, along with logging and debug information helpful for local development.

    :::image type="content" source="media/tutorial-chat-bot/bot-emulator-bot-conversation-first-turn.png" alt-text="Screenshot of bot emulator in first turn of conversation.":::

## Use the bot in the bot emulator

1. Ask to see the menu by entering `I would like to see the menu`. The chat bot displays the items.
1. Let the bot suggest an item by entering `Please suggest a drink for me.`
    The emulator displays the Rank request and response in the chat window, so you can see the full JSON. And the bot makes a suggestion, something like `How about Latte?`
1. Answer that you would like that which means you accept Personalizer's top Ranked selection, `I like it.`
    The emulator displays the Reward request with reward score 0 and response in the chat window, so you can see the full JSON. And the bot responds with `That’s great! I’ll keep learning your preferences over time.` and `Would you like to get a new suggestion or reset the simulated context to a new day?`

    If you response with `no` to the selection, the reward score of 1 is sent to Personalizer.

## Personalizer in the bot solution

The .NET solution is a simple bot framework chat bot. The code related to Personalier is in `/samples/ChatbotExample/Bots/PersonalizerChatbot.cs` file

## Clean up resources

When you are done with this tutorial, clean up the following resources:

* Delete your sample project directory.
* Delete your Personalizer resource - think of a Personalizer resource as dedicated to the actions and context - only reuse the resource if you are still using the foods as actions subject domain.


## Next steps
* [How Personalizer works](how-personalizer-works.md)
* [Features](concepts-features.md): learn concepts about features using with actions and context
* [Rewards](concept-rewards.md): learn about calculating rewards
