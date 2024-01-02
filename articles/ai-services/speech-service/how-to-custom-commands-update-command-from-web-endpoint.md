---
title: 'Update a command from a web endpoint'                             
titleSuffix: Azure AI services
description: Learn how to update the state of a command by using a call to a web endpoint.
author: eric-urban
manager: nitinme
ms.service: azure-ai-speech
ms.topic: how-to
ms.date: 10/20/2020
ms.author: eur
ms.custom: cogserv-non-critical-speech
---

# Update a command from a web endpoint

[!INCLUDE [deprecation notice](./includes/custom-commands-retire.md)]

If your client application requires an update to the state of an ongoing command without voice input, you can use a call to a web endpoint to update the command.

In this article, you'll learn how to update an ongoing command from a web endpoint.

## Prerequisites
> [!div class = "checklist"]
> * A previously [created Custom Commands app](quickstart-custom-commands-application.md)

## Create an Azure function 

For this example, you'll need an HTTP-triggered [Azure function](../../azure-functions/index.yml) that supports the following input (or a subset of this input):

```JSON
{
  "conversationId": "SomeConversationId",
  "currentCommand": {
    "name": "SomeCommandName",
    "parameters": {
      "SomeParameterName": "SomeParameterValue",
      "SomeOtherParameterName": "SomeOtherParameterValue"
    }
  },
  "currentGlobalParameters": {
      "SomeGlobalParameterName": "SomeGlobalParameterValue",
      "SomeOtherGlobalParameterName": "SomeOtherGlobalParameterValue"
  }
}
```

Let's review the key attributes of this input:

| Attribute | Explanation |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **conversationId** | The unique identifier of the conversation. Note that this ID can be generated from the client app. |
| **currentCommand** | The command that's currently active in the conversation. |
| **name** | The name of the command. The `parameters` attribute is a map with the current values of the parameters. |
| **currentGlobalParameters** | A map like `parameters`, but used for global parameters. |

The output of the Azure function needs to support the following format:

```JSON
{
  "updatedCommand": {
    "name": "SomeCommandName",
    "updatedParameters": {
      "SomeParameterName": "SomeParameterValue"
    },
    "cancel": false
  },
  "updatedGlobalParameters": {
    "SomeGlobalParameterName": "SomeGlobalParameterValue"
  }
}
```

You might recognize this format because it's the same one that you used when [updating a command from the client](./how-to-custom-commands-update-command-from-client.md). 

Now, create an Azure function based on Node.js. Copy/paste this code:

```nodejs
module.exports = async function (context, req) {
    context.log(req.body);
    context.res = {
        body: {
            updatedCommand: {
                name: "IncrementCounter",
                updatedParameters: {
                    Counter: req.body.currentCommand.parameters.Counter + 1
                }
            }
        }
    };
}
```

When you call this Azure function from Custom Commands, you'll send the current values of the conversation. You'll return the parameters that you want to update or if you want to cancel the current command.

## Update the existing Custom Commands app

Let's hook up the Azure function with the existing Custom Commands app:

1. Add a new command named `IncrementCounter`.
1. Add just one example sentence with the value `increment`.
1. Add a new parameter called `Counter` (same name as specified in the Azure function) of type `Number` with a default value of `0`.
1. Add a new web endpoint called `IncrementEndpoint` with the URL of your Azure function, with **Remote updates** set to **Enabled**.
    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/custom-commands/set-web-endpoint-with-remote-updates.png" alt-text="Screenshot that shows setting a web endpoint with remote updates.":::
1. Create a new interaction rule called **IncrementRule** and add a **Call web endpoint** action.
    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/custom-commands/increment-rule-web-endpoint.png" alt-text="Screenshot that shows the creation of an interaction rule.":::
1. In the action configuration, select `IncrementEndpoint`. Configure **On success** to **Send speech response** with the value of `Counter`,  and configure **On failure** with an error message.
    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/custom-commands/set-increment-counter-call-endpoint.png" alt-text="Screenshot that shows setting an increment counter for calling a web endpoint.":::
1. Set the post-execution state of the rule to **Wait for user's input**.

## Test it

1. Save and train your app.
1. Select **Test**.
1. Send `increment` a few times (which is the example sentence for the `IncrementCounter` command).
    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/custom-commands/increment-counter-example-no-mic.png" alt-text="Screenshot that shows an increment counter example.":::

Notice how the Azure function increments the value of the `Counter` parameter on each turn.

## Next steps

> [!div class="nextstepaction"]
> [Enable a CI/CD process for your Custom Commands application](./how-to-custom-commands-deploy-cicd.md)
