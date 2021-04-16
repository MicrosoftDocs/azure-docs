---
title: include file
description: include file
services: cognitive-services
manager: nitinme
ms.service: cognitive-services
ms.subservice: personalizer
ms.topic: include
ms.custom: cog-serv-seo-aug-2020
ms.date: 08/27/2020
---
[Reference documentation](/javascript/api/@azure/cognitiveservices-personalizer/) |[Library source code](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/cognitiveservices/cognitiveservices-personalizer) | [Package (NPM)](https://www.npmjs.com/package/@azure/cognitiveservices-personalizer) | [Samples](https://github.com/Azure-Samples/cognitive-services-quickstart-code/tree/master/javascript/Personalizer)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* The current version of [Node.js](https://nodejs.org) and NPM.
* Once you have your Azure subscription, <a href="https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesPersonalizer"  title="Create a Personalizer resource"  target="_blank">create a Personalizer resource </a> in the Azure portal to get your key and endpoint. After it deploys, click **Go to resource**.
    * You will need the key and endpoint from the resource you create to connect your application to the Personalizer API. You'll paste your key and endpoint into the code below later in the quickstart.
    * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

## Setting Up

[!INCLUDE [Change model frequency](change-model-frequency.md)]

### Create a new Node.js application

In a console window (such as cmd, PowerShell, or Bash), create a new directory for your app, and navigate to it.

```console
mkdir myapp && cd myapp
```

Run the `npm init -y` command to create a `package.json` file.

```console
npm init -y
```

Create a new Node.js application in your preferred editor or IDE named `sample.js` and create variables for your resource's endpoint and subscription key. 

[!INCLUDE [Personalizer find resource info](find-azure-resource-info.md)]

```javascript
const uuidv1 = require('uuid/v1');
const Personalizer = require('@azure/cognitiveservices-personalizer');
const CognitiveServicesCredentials = require('@azure/ms-rest-azure-js').CognitiveServicesCredentials;
const readline = require('readline-sync');

// The key specific to your personalization service instance; e.g. "0123456789abcdef0123456789ABCDEF"
const serviceKey = "<REPLACE-WITH-YOUR-PERSONALIZER-KEY>";

// The endpoint specific to your personalization service instance; 
// e.g. https://<your-resource-name>.cognitiveservices.azure.com
const baseUri = "https://<REPLACE-WITH-YOUR-PERSONALIZER-ENDPOINT>.cognitiveservices.azure.com";
```

### Install the Node.js library for Personalizer

Install the Personalizer client library for Node.js with the following command:

```console
npm install @azure/cognitiveservices-personalizer --save
```

Install the remaining NPM packages for this quickstart:

```console
npm install @azure/ms-rest-azure-js @azure/ms-rest-js readline-sync uuid --save
```

## Object model

The Personalizer client is a [PersonalizerClient](/javascript/api/@azure/cognitiveservices-personalizer/personalizerclient) object that authenticates to Azure using Microsoft.Rest.ServiceClientCredentials, which contains your key.

To ask for the single best item of the content, create a [RankRequest](/javascript/api/@azure/cognitiveservices-personalizer/rankrequest), then pass it to [client.Rank](/javascript/api/@azure/cognitiveservices-personalizer/personalizerclient#rank-rankrequest--msrest-requestoptionsbase-) method. The Rank method returns a RankResponse.

To send a reward to Personalizer, create a [RewardRequest](/javascript/api/@azure/cognitiveservices-personalizer/rewardrequest), then pass it to the [Reward](/javascript/api/@azure/cognitiveservices-personalizer/events#reward-string--rewardrequest--servicecallback-void--) method on the Events class.

Determining the reward, in this quickstart is trivial. In a production system, the determination of what impacts the [reward score](../concept-rewards.md) and by how much can be a complex process, that you may decide to change over time. This should be one of the primary design decisions in your Personalizer architecture.

## Code examples

These code snippets show you how to do the following with the Personalizer client library for Node.js:

* [Create a Personalizer client](#authenticate-the-client)
* [Rank API](#request-the-best-action)
* [Reward API](#send-a-reward)

## Authenticate the client

Instantiate the `PersonalizerClient` with your `serviceKey` and `baseUri` which you created earlier.

```javascript
const credentials = new CognitiveServicesCredentials(serviceKey);

// Initialize Personalization client.
const personalizerClient = new Personalizer.PersonalizerClient(credentials, baseUri);
```

## Get content choices represented as actions

Actions represent the content choices from which you want Personalizer to select the best content item. Add the following methods to the Program class to represent the set of actions  and their features.

```javascript
function getContextFeaturesList() {
  const timeOfDayFeatures = ['morning', 'afternoon', 'evening', 'night'];
  const tasteFeatures = ['salty', 'sweet'];

  let answer = readline.question("\nWhat time of day is it (enter number)? 1. morning 2. afternoon 3. evening 4. night\n");
  let selection = parseInt(answer);
  const timeOfDay = selection >= 1 && selection <= 4 ? timeOfDayFeatures[selection - 1] : timeOfDayFeatures[0];

  answer = readline.question("\nWhat type of food would you prefer (enter number)? 1. salty 2. sweet\n");
  selection = parseInt(answer);
  const taste = selection >= 1 && selection <= 2 ? tasteFeatures[selection - 1] : tasteFeatures[0];

  console.log("Selected features:\n");
  console.log("Time of day: " + timeOfDay + "\n");
  console.log("Taste: " + taste + "\n");

  return [
    {
      "time": timeOfDay
    },
    {
      "taste": taste
    }
  ];
}
```

```javascript
function getActionsList() {
  return [
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
  ];
}
```

## Create the learning loop

The Personalizer learning loop is a cycle of [Rank](#request-the-best-action) and [Reward](#send-a-reward) calls. In this quickstart, each Rank call, to personalize the content, is followed by a Reward call to tell Personalizer how well the service performed.

The following code loops through a cycle of asking the user their preferences at the command line, sending that information to Personalizer to select the best action, presenting the selection to the customer to choose from among the list, then sending a reward to Personalizer signaling how well the service did in its selection.

```javascript
let runLoop = true;

do {

  let rankRequest = {}

  // Generate an ID to associate with the request.
  rankRequest.eventId = uuidv1();

  // Get context information from the user.
  rankRequest.contextFeatures = getContextFeaturesList();

  // Get the actions list to choose from personalization with their features.
  rankRequest.actions = getActionsList();

  // Exclude an action for personalization ranking. This action will be held at its current position.
  rankRequest.excludedActions = getExcludedActionsList();

  rankRequest.deferActivation = false;

  // Rank the actions
  const rankResponse = await personalizerClient.rank(rankRequest);

  console.log("\nPersonalization service thinks you would like to have:\n")
  console.log(rankResponse.rewardActionId);

  // Display top choice to user, user agrees or disagrees with top choice
  const reward = getReward();

  console.log("\nPersonalization service ranked the actions with the probabilities as below:\n");
  for (let i = 0; i < rankResponse.ranking.length; i++) {
    console.log(JSON.stringify(rankResponse.ranking[i]) + "\n");
  }

  // Send the reward for the action based on user response.

  const rewardRequest = {
    value: reward
  }

  await personalizerClient.events.reward(rankRequest.eventId, rewardRequest);

  runLoop = continueLoop();

} while (runLoop);
```

Take a closer look at the rank and reward calls in the following sections.

Add the following methods, which [get the content choices](#get-content-choices-represented-as-actions), before running the code file:

* getActionsList
* getContextFeaturesList

## Request the best action

To complete the Rank request, the program asks the user's preferences to create content choices. The process can create content to exclude from the actions, shown as `excludeActions`. The Rank request needs the [actions](../concepts-features.md#actions-represent-a-list-of-options) and their features, currentContext features, excludeActions, and a unique rank event ID, to receive the ranked response.

This quickstart has simple context features of time of day and user food preference. In production systems, determining and [evaluating](../concept-feature-evaluation.md) [actions and features](../concepts-features.md) can be a non-trivial matter.

```javascript
let rankRequest = {}

// Generate an ID to associate with the request.
rankRequest.eventId = uuidv1();

// Get context information from the user.
rankRequest.contextFeatures = getContextFeaturesList();

// Get the actions list to choose from personalization with their features.
rankRequest.actions = getActionsList();

// Exclude an action for personalization ranking. This action will be held at its current position.
rankRequest.excludedActions = getExcludedActionsList();

rankRequest.deferActivation = false;

// Rank the actions
const rankResponse = await personalizerClient.rank(rankRequest);
```

## Send a reward

To get the reward score to send in the Reward request, the program gets the user's selection from the command line, assigns a numeric value to the selection, then sends the unique event ID and the reward score as the numeric value to the Reward API.

This quickstart assigns a simple number as a reward score, either a zero or a 1. In production systems, determining when and what to send to the [Reward](../concept-rewards.md) call can be a non-trivial matter, depending on your specific needs.

```javascript
const rewardRequest = {
  value: reward
}

await personalizerClient.events.reward(rankRequest.eventId, rewardRequest);
```

## Run the program

Run the application with the Node.js from your application directory.

```console
node sample.js
```

![The quickstart program asks a couple of questions to gather user preferences, known as features, then provides the top action.](../media/csharp-quickstart-commandline-feedback-loop/quickstart-program-feedback-loop-example.png)
