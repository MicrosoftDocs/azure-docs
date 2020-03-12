---
title: include file
description: include file
services: cognitive-services
author: diberry
manager: nitinme
ms.service: cognitive-services
ms.subservice: personalizer
ms.topic: include
ms.custom: include file
ms.date: 01/15/2020
ms.author: diberry
---
[Reference documentation](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-personalizer/?view=azure-node-latest) |[Library source code](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/cognitiveservices/cognitiveservices-personalizer) | [Package (NPM)](https://www.npmjs.com/package/@azure/cognitiveservices-personalizer) | [Samples](https://github.com/Azure-Samples/cognitive-services-personalizer-samples/blob/master/quickstarts/node/sample.js)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/)
* The current version of [Node.js](https://nodejs.org) and NPM.

## Using this quickstart


There are several steps to use this quickstart:

* In the Azure portal, create a Personalizer resource
* In the Azure portal, for the Personalizer resource, on the **Configuration** page, change the model update frequency to a very short interval
* In a code editor, create a code file and edit the code file
* In the command line or terminal, install the SDK from the command line
* In the command line or terminal, run the code file

[!INCLUDE [Create Azure resource for Personalizer](create-personalizer-resource.md)]

[!INCLUDE [!Change model frequency](change-model-frequency.md)]

## Create a new Node.js application

In a console window (such as cmd, PowerShell, or Bash), create a new directory for your app, and navigate to it.

```console
mkdir myapp && cd myapp
```

Run the `npm init -y` command to create a `package.json` file.

```console
npm init -y
```

## Install the Node.js library for Personalizer

Install the Personalizer client library for Node.js with the following command:

```console
npm install @azure/cognitiveservices-personalizer --save
```

Install the remaining NPM packages for this quickstart:

```console
npm install @azure/ms-rest-azure-js @azure/ms-rest-js readline-sync uuid --save
```

## Object model

The Personalizer client is a [PersonalizerClient](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-personalizer/personalizerclient?view=azure-node-latest) object that authenticates to Azure using Microsoft.Rest.ServiceClientCredentials, which contains your key.

To ask for the single best item of the content, create a [RankRequest](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-personalizer/rankrequest?view=azure-node-latest), then pass it to [client.Rank](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-personalizer/personalizerclient?view=azure-node-latest#rank-rankrequest--msrest-requestoptionsbase-) method. The Rank method returns a RankResponse.

To send a reward to Personalizer, create a [RewardRequest](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-personalizer/rewardrequest?view=azure-node-latest), then pass it to the [Reward](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-personalizer/events?view=azure-node-latest#reward-string--rewardrequest--servicecallback-void--) method on the Events class.

Determining the reward, in this quickstart is trivial. In a production system, the determination of what impacts the [reward score](../concept-rewards.md) and by how much can be a complex process, that you may decide to change over time. This should be one of the primary design decisions in your Personalizer architecture.

## Code examples

These code snippets show you how to do the following with the Personalizer client library for Node.js:

* [Create a Personalizer client](#create-a-personalizer-client)
* [Rank API](#request-the-best-action)
* [Reward API](#send-a-reward)

## Create a new Node.js application

Create a new Node.js application in your preferred editor or IDE named `sample.js`.

## Add the dependencies

Open the **sample.js** file in your preferred editor or IDE. Add the following `requires` to add the NPM packages:

[!code-javascript[Add module dependencies](~/samples-personalizer/quickstarts/node/sample.js?name=Dependencies)]

## Add Personalizer resource information

Create variables for your resource's Azure key and endpoint pulled from the environment variables, named `PERSONALIZER_KEY` and `PERSONALIZER_ENDPOINT`. If you created the environment variables after the application is launched, the editor, IDE, or shell running it will need to be closed and reloaded to access the variable. The methods will be created later in this quickstart.

[!code-javascript[Add Personalizer resource information](~/samples-personalizer/quickstarts/node/sample.js?name=AuthorizationVariables)]

## Create a Personalizer client

Next, create a method to return a Personalizer client. The parameter to the method is the `PERSONALIZER_RESOURCE_ENDPOINT` and the ApiKey is the `PERSONALIZER_RESOURCE_KEY`.

[!code-javascript[Create a Personalizer client](~/samples-personalizer/quickstarts/node/sample.js?name=Client)]

## Get content choices represented as actions

Actions represent the content choices from which you want Personalizer to select the best content item. Add the following methods to the Program class to represent the set of actions  and their features.

[!code-javascript[Create user features](~/samples-personalizer/quickstarts/node/sample.js?name=createUserFeatureTimeOfDay)]

[!code-javascript[Create actions](~/samples-personalizer/quickstarts/node/sample.js?name=getActions)]

## Create the learning loop

The Personalizer learning loop is a cycle of [Rank](#request-the-best-action) and [Reward](#send-a-reward) calls. In this quickstart, each Rank call, to personalize the content, is followed by a Reward call to tell Personalizer how well the service performed.

The following code loops through a cycle of asking the user their preferences at the command line, sending that information to Personalizer to select the best action, presenting the selection to the customer to choose from among the list, then sending a reward to Personalizer signaling how well the service did in its selection.

[!code-javascript[Create the learning loop](~/samples-personalizer/quickstarts/node/sample.js?name=mainLoop)]

Take a closer look at the rank and reward calls in the following sections.

Add the following methods, which [get the content choices](#get-content-choices-represented-as-actions), before running the code file:

* getActionsList
* getContextFeaturesList

## Request the best action

To complete the Rank request, the program asks the user's preferences to create content choices. The process can create content to exclude from the actions, shown as `excludeActions`. The Rank request needs the [actions](../concepts-features.md#actions-represent-a-list-of-options) and their features, currentContext features, excludeActions, and a unique rank event ID, to receive the ranked response.

This quickstart has simple context features of time of day and user food preference. In production systems, determining and [evaluating](../concept-feature-evaluation.md) [actions and features](../concepts-features.md) can be a non-trivial matter.

[!code-javascript[The Personalizer learning loop ranks the request.](~/samples-personalizer/quickstarts/node/sample.js?name=rank)]

## Send a reward


To get the reward score to send in the Reward request, the program gets the user's selection from the command line, assigns a numeric value to the selection, then sends the unique event ID and the reward score as the numeric value to the Reward API.

This quickstart assigns a simple number as a reward score, either a zero or a 1. In production systems, determining when and what to send to the [Reward](../concept-rewards.md) call can be a non-trivial matter, depending on your specific needs.

[!code-javascript[The Personalizer learning loop sends a reward.](~/samples-personalizer/quickstarts/node/sample.js?name=reward)]

## Run the program

Run the application with the Node.js from your application directory.

```console
node sample.js
```

![The quickstart program asks a couple of questions to gather user preferences, known as features, then provides the top action.](../media/csharp-quickstart-commandline-feedback-loop/quickstart-program-feedback-loop-example.png)
