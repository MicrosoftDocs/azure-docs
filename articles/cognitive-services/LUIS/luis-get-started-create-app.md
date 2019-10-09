---
title: "Quickstart: create app - LUIS" 
titleSuffix: Azure Cognitive Services
description:  Create a LUIS app that uses the prebuilt domain `HomeAutomation` for turning lights and appliances on and off. This prebuilt domain provides intents, entities, and example utterances for you. When you're finished, you'll have a LUIS endpoint running in the cloud.
services: cognitive-services
author: diberry
ms.custom: seodec18
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: quickstart
ms.date: 09/27/2019
ms.author: diberry
#Customer intent: As a new user, I want to quickly get a LUIS app created so I can understand the model and actions to train, test, publish, and query. 
---

# Quickstart: Use prebuilt Home automation app

In this quickstart, create a LUIS app that uses the prebuilt domain `HomeAutomation` for turning lights and appliances on and off. This prebuilt domain provides intents, entities, and example utterances for you. When you're finished, you'll have a LUIS endpoint running in the cloud.

## Prerequisites

For this article, you need a free LUIS account, created on the LUIS portal at [https://www.luis.ai](https://www.luis.ai). 

[!INCLUDE [Sign in to LUIS](./includes/sign-in-process.md)]

## Create a new app
You can create and manage your applications on **My Apps**. 

1. Select **Create new app**.

    [![Screenshot of app list](media/luis-quickstart-new-app/app-list.png "Screenshot of app list")](media/luis-quickstart-new-app/app-list.png)

1. In the dialog box, name your application "Home Automation".

    [![Screenshot of Create new app pop-up dialog](media/luis-quickstart-new-app/create-new-app-dialog.png "Screenshot of Create new app pop-up dialog")](media/luis-quickstart-new-app/create-new-app-dialog.png)

1. Choose your application culture. For this Home Automation app, choose English. Then select **Done**. LUIS creates the Home Automation app. 

    >[!NOTE]
    >The culture cannot be changed once the application is created. 

## Add prebuilt domain

Select **Prebuilt domains** in the left-side navigation pane. Then search for "Home". Select **Add domain**.

[![Screenshot of Home Automation domain called out in prebuilt domain menu](media/luis-quickstart-new-app/home-automation.png "Screenshot of Home Automation domain called out in prebuilt domain menu")](media/luis-quickstart-new-app/home-automation.png)

When the domain is successfully added, the prebuilt domain box displays a **Remove domain** button.

[![Screenshot of Home Automation domain with remove button](media/luis-quickstart-new-app/remove-domain.png "Screenshot of Home Automation domain with remove button")](media/luis-quickstart-new-app/remove-domain.png)

## Intents and entities

Select **Intents** in the left-side navigation pane to review the HomeAutomation domain intents. Each intent has sample utterances.

![Screenshot of HomeAutomation intents list](media/luis-quickstart-new-app/home-automation-intents.png "Screenshot of HomeAutomation intents list")]

> [!NOTE]
> **None** is an intent provided by all LUIS apps. You use it to handle utterances that don't correspond to functionality your app provides. 

Select the **HomeAutomation.TurnOff** intent. You can see that the intent contains a list of utterances that are labeled with entities.

[![Screenshot of HomeAutomation.TurnOff intent](media/luis-quickstart-new-app/home-automation-turnoff.png "Screenshot of HomeAutomation.TurnOff intent")](media/luis-quickstart-new-app/home-automation-turnoff.png)

## Train the LUIS app

[!INCLUDE [LUIS How to Train steps](../../../includes/cognitive-services-luis-tutorial-how-to-train.md)]

## Test your app
Once you've trained your app, you can test it. Select **Test** in the top navigation. Type a test utterance like "Turn off the lights" into the Interactive Testing pane, and press Enter. 

```
Turn off the lights
```

Check that the top scoring intent corresponds to the intent you expected for each test utterance.

In this example, `Turn off the lights` is correctly identified as the top scoring intent of **HomeAutomation.TurnOff**.

[![Screenshot of Test panel with utterance highlighted](media/luis-quickstart-new-app/test.png "Screenshot of Test panel with utterance highlighted")](media/luis-quickstart-new-app/test.png)


Select **Inspect** to review more information about the prediction.

![Screenshot of Test panel with utterance highlighted](media/luis-quickstart-new-app/review-test-inspection-pane-in-portal.png)

Select **Test** again to collapse the test pane. 

<a name="publish-your-app"></a>

## Publish the app to get the endpoint URL

[!INCLUDE [LUIS How to Publish steps](../../../includes/cognitive-services-luis-tutorial-how-to-publish.md)]

## Query the V2 API prediction endpoint

1. [!INCLUDE [LUIS How to get endpoint first step](../../../includes/cognitive-services-luis-tutorial-how-to-get-endpoint.md)] 

1. Go to the end of the URL in the address and enter `turn off the living room light`, and then press Enter. 

    #### [V2 prediction endpoint](#tab/V2)

    `https://<region>.api.cognitive.microsoft.com/luis/**v2.0**/apps/<appID>?subscription-key=<YOUR_KEY>&**q=<user-utterance-text>**`

    The browser displays the **V2 API** version of the JSON response of your HTTP endpoint.

    ```json
    {
      "query": "turn off the lights",
      "topScoringIntent": {
        "intent": "HomeAutomation.TurnOff",
        "score": 0.995867
      },
      "entities": [
        {
          "entity": "lights",
          "type": "HomeAutomation.DeviceType",
          "startIndex": 13,
          "endIndex": 18,
          "resolution": {
            "values": [
              "light"
            ]
          }
        }
      ]
    }
    ```
    
    #### [V3 prediction endpoint](#tab/V3)

    For a [V3 API query](luis-migration-api-v3.md), in the browser, change the GET method HTTPS request, changing out the values in angle brackets for your own values.     

    `https://<region>.api.cognitive.microsoft.com/luis/**v3.0-preview**/apps/<appID>/**slots**/**production**/**predict**?subscription-key=<YOUR_KEY>&**query=<user-utterance-text>**`

    ```json
    {
        "query": "turn off the lights",
        "prediction": {
            "normalizedQuery": "turn off the lights",
            "topIntent": "HomeAutomation.TurnOff",
            "intents": {
                "HomeAutomation.TurnOff": {
                    "score": 0.99649024
                }
            },
            "entities": {
                "HomeAutomation.DeviceType": [
                    [
                        "light"
                    ]
                ]
            }
        }
    }
    ```


    Learn more about the [V3 prediction endpoint](luis-migration-api-v3.md).
    
    * * * 

## Clean up resources

[!INCLUDE [LUIS How to clean up resources](../../../includes/cognitive-services-luis-tutorial-how-to-clean-up-resources.md)]

## Next steps

You can call the endpoint from code:

> [!div class="nextstepaction"]
> [Call a LUIS endpoint using code](luis-get-started-cs-get-intent.md)
