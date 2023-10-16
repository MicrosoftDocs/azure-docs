---
title: include file
description: include file
services: cognitive-services
manager: nitinme
ms.service: azure-ai-personalizer
ms.topic: include
ms.custom: cog-serv-seo-aug-2020
ms.date: 02/02/2023
---

[Reference documentation](/javascript/api/@azure/cognitiveservices-personalizer) |[Library source code](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/cognitiveservices/cognitiveservices-personalizer) | [Package (npm)](https://www.npmjs.com/package/@azure/cognitiveservices-personalizer) | [Quickstart code sample](https://github.com/Azure-Samples/cognitive-services-quickstart-code/tree/master/javascript/Personalizer)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* Install [Node.js](https://nodejs.org) and npm (verified with Node.js v14.16.0 and npm 6.14.11).
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesPersonalizer"  title="Create a Personalizer resource"  target="_blank">create a Personalizer resource </a> in the Azure portal to get your key and endpoint. After it deploys, select **Go to resource**.
    * You'll need the key and endpoint from the resource you create to connect your application to the Personalizer API. You'll paste your key and endpoint into the code below later in the quickstart.
    * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

## Model configuration

[!INCLUDE [Change model frequency](change-model-frequency.md)]

[!INCLUDE [Change reward wait time](change-reward-wait-time.md)]

## Create a new Node.js application

In a console window (such as cmd, PowerShell, or Bash), create a new directory for your app, and navigate to it.

```console
mkdir myapp && cd myapp
```

Run the `npm init -y` command to create a `package.json` file.

```console
npm init -y
```

Create a new Node.js script in your preferred editor or IDE named `personalizer-quickstart.js` and create variables for your resource's endpoint and subscription key.

### Install the client library

Install the Personalizer client library for Node.js with the following command:

```console
npm install @azure/cognitiveservices-personalizer --save
```

Install the remaining npm packages for this quickstart:

```console
npm install @azure/ms-rest-azure-js @azure/ms-rest-js readline-sync uuid --save
```


## Code block 1: Generate sample data

Personalizer is meant to run on applications that receive and interpret real-time data. In this quickstart, you'll use sample code to generate imaginary customer actions on a grocery website. The following code block defines three key methods: **getActionsList**, **getContextFeaturesList** and **getReward**.

- **getActionsList** returns a list of the choices that the grocery website needs to rank. In this example, the actions are meal products. Each action choice has details (features) that may affect user behavior later on. Actions are used as input for the Rank API

- **getContextFeaturesList** returns a simulated customer visit. It selects randomized details (context features) like which customer is present and what time of day the visit is taking place. In general, a context represents the current state of your application, system, environment, or user. The context object is used as input for the Rank API.

   The context features in this quickstart are simplistic. However, in a real production system, designing your [features](../concepts-features.md) and [evaluating their effectiveness](../how-to-feature-evaluation.md) is important. Refer to the linked documentation for guidance.

- **getReward** prompts the user to score the service's recommendation as a success or failure. It returns a score between zero and one that represents the success of a customer interaction. In a real scenario, Personalizer will learn user preferences from real-time customer interactions.

    In a real production system, the [reward score](../concept-rewards.md) should be designed to align with your business objectives and KPIs. Determining how to calculate the reward metric may require some experimentation.

Open _personalizer-quickstart.js_ in a text editor or IDE and paste in the code below.

:::code language="js" source="~/cognitive-services-quickstart-code/javascript/Personalizer/quickstart-sdk/personalizer-quickstart.js" id="snippet_1":::

## Code block 2: Iterate the learning loop

The next block of code defines the **main** method and closes out the script. It runs a learning loop iteration, in which it asks the user their preferences at the command line and sends that information to Personalizer to select the best action. It presents the selected action to the user, who makes a choice using the command-line. Then it sends a reward score to the Personalizer service to signal how well the service did in its selection.

The Personalizer learning loop is a cycle of **Rank** and **Reward** calls. In this quickstart, each Rank call, to personalize the content, is followed by a Reward call to tell Personalizer how well the service performed.

1. Add the code below to _personalizer-quickstart.js_.

1. Find your key and endpoint. Your endpoint has the form `https://<your_resource_name>.cognitiveservices.azure.com/`.

    [!INCLUDE [Personalizer find resource info](find-azure-resource-info.md)]

1. Paste your key and endpoint into the code where indicated.

    > [!IMPORTANT]
    > Remember to remove the key from your code when you're done, and never post it publicly. For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../key-vault/general/overview.md). For more information about security, see the Azure AI services [security](../../security-features.md) article.

    :::code language="js" source="~/cognitive-services-quickstart-code/javascript/Personalizer/quickstart-sdk/personalizer-quickstart.js" id="snippet_2":::

## Run the program

Run the application with the Node.js command from your application directory.

```console
node personalizer-quickstart.js
```

Iterate through a few learning loops. After about 10 minutes, the service will start to show improvements in its recommendations.


The source code for this quickstart is available on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/javascript/Personalizer/quickstart-sdk/personalizer-quickstart.js).
