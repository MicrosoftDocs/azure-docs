---
title: "Quickstart: Personalizer client library for Node.js | Microsoft Docs"
titleSuffix: Azure Cognitive Services
description:  Get started with the Personalizer client library for Node.js using a learning loop. 
services: cognitive-services
author: diberry
manager: nitinme
ms.service: cognitive-services
ms.subservice: personalizer
ms.topic: quickstart
ms.date: 10/23/2019
ms.author: diberry
#Customer intent: As a developer, I want implement a Personalizer loop so that I can understand how to use the Rank and Reward calls.

---

# Quickstart: Personalizer client library for Node.js

Display personalized content in this Node.js quickstart with the Personalizer service.

Get started with the Personalizer client library for Node.js. Follow these steps to install the package and try out the example code for basic tasks.

 * Rank a list of actions for personalization.
 * Report reward score indicating success of top ranked action.

[Library source code](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/cognitiveservices/cognitiveservices-personalizer) | [Package (NPM)](https://www.npmjs.com/package/@azure/cognitiveservices-personalizer) | [Samples](https://github.com/Azure-Samples/cognitive-services-personalizer-samples/blob/master/quickstarts/node/sample.js)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/)
* The current version of [Node.js](https://nodejs.org) and NPM.

## Using this quickstart


There are several steps to use this quickstart:

* In the Azure portal, create a Personalizer resource
* In the Azure portal, for the Personalizer resource, on the **Configuration** page, change the model update frequency
* In a code editor, create a code file and edit the code file
* In the command line or terminal, install the SDK from the command line
* In the command line or terminal, run the code file


## Create a Personalizer Azure resource

Azure Cognitive Services are represented by Azure resources that you subscribe to. Create a resource for Personalizer using the [Azure portal](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) or [Azure CLI](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account-cli) on your local machine. You can also:

* Get a [trial key](https://azure.microsoft.com/try/cognitive-services) valid for 7 days for free. After signing up, it will be available on the [Azure website](https://azure.microsoft.com/try/cognitive-services/my-apis/).  
* View your resource on the [Azure portal](https://portal.azure.com/).

After you get a key from your trial subscription or resource, create two [environment variables](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account#configure-an-environment-variable-for-authentication):

* `PERSONALIZER_KEY` for the resource key.
* `PERSONALIZER_ENDPOINT` for the resource endpoint.

In the Azure portal, both the key and endpoint values are available from the **Quick start** page.


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

## Change the model update frequency

In the Azure portal, in the Personalizer resource on the **Configuration** page, change the **Model update frequency** to 10 seconds. This will train the service rapidly, allowing you to see how the top action changes for each iteration.

![Change model update frequency](./media/settings/configure-model-update-frequency-settings.png)

When a Personalizer loop is first instantiated, there is no model since there has been no Reward API calls to train from. Rank calls will return equal probabilities for each item. Your application should still always rank content using the output of RewardActionId.

## Object model

The Personalizer client is a PersonalizerClient object that authenticates to Azure using Microsoft.Rest.ServiceClientCredentials, which contains your key.

To ask for a rank of the content, create a RankRequest, then pass it to client.Rank method. The Rank method returns a RankResponse, containing the ranked content. 

To send a reward to Personalizer, create a RewardRequest, then pass it to the client.Reward method. 

Determining the reward, in this quickstart is trivial. In a production system, the determination of what impacts the [reward score](concept-rewards.md) and by how much can be a complex process, that you may decide to change over time. This should be one of the primary design decisions in your Personalizer architecture. 

## Code examples

These code snippets show you how to do the following with the Personalizer client library for Node.js:

* [Create a Personalizer client](#create-a-personalizer-client)
* [Request a rank](#request-a-rank)
* [Send a reward](#send-a-reward)

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

Actions represent the content choices you want Personalizer to rank. Add the following methods to the Program class to get a user's input from the command line for the time of day and current food preference.

[!code-javascript[Create user features](~/samples-personalizer/quickstarts/node/sample.js?name=createUserFeatureTimeOfDay)]

[!code-javascript[Create actions](~/samples-personalizer/quickstarts/node/sample.js?name=getActions)]

## Create the learning loop

The Personalizer learning loop is a cycle of [rank](#request-a-rank) and [reward](#send-a-reward) calls. In this quickstart, each rank call, to personalize the content, is followed by a reward call to tell Personalizer how well the service ranked the content. 

The following looping code loops through a cycle of asking the user their preferences at the command line, sending that information to Personalizer to rank, presenting the ranked selection to the customer to choose from among the list, then sending a reward to Personalizer signaling how well the service did in ranking the selection.

[!code-javascript[Create the learning loop](~/samples-personalizer/quickstarts/node/sample.js?name=mainLoop)]

Take a closer look at the rank and reward calls in the following sections.

Add the following methods, which [get the content choices](#get-content-choices-represented-as-actions), before running the code file:

* getActionsList
* getContextFeaturesList

## Request a rank

To complete the rank request, the program asks the user's preferences to create content choices. The process can create content to exclude from the rank, shown as `excludeActions`. The rank request needs the [actions](concepts-features.md#actions-represent-a-list-of-options), currentContext, excludeActions, and a unique rank event ID (as a GUID), to receive the ranked response. 

This quickstart has simple context features of time of day and user food preference. In production systems, determining and [evaluating](concept-feature-evaluation.md) [actions and features](concepts-features.md) can be a non-trivial matter.  

[!code-javascript[The Personalizer learning loop ranks the request.](~/samples-personalizer/quickstarts/node/sample.js?name=rank)]

## Send a reward

To complete the reward request, the program gets the user's selection from the command line, assigns a numeric value to each selection, then sends the unique rank event ID and the numeric value to the reward method.

This quickstart assigns a simple number as a reward, either a zero or a 1. In production systems, determining when and what to send to the [reward](concept-rewards.md) call can be a non-trivial matter, depending on your specific needs. 

[!code-javascript[The Personalizer learning loop sends a reward.](~/samples-personalizer/quickstarts/node/sample.js?name=reward)]

## Run the program

Run the application with the Node.js from your application directory.

```console
node sample.js
```

![The quickstart program asks a couple of questions to gather user preferences, known as features, then provides the top action.](./media/csharp-quickstart-commandline-feedback-loop/quickstart-program-feedback-loop-example.png)

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
* The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-personalizer-samples/blob/master/quickstarts/node/sample.js).
