---
title: "Quickstart: Build your app in LUIS portal"
description: This quickstart shows how to create a LUIS app that uses the prebuilt domain `HomeAutomation` for turning lights and appliances on and off. This prebuilt domain provides intents, entities, and example utterances for you. When you're finished, you'll have a LUIS endpoint running in the cloud.
ms.service: cognitive-services
ms.subservice: language-understanding
ms.author: aahi
author: aahill
ms.manager: nitinme
ms.topic: quickstart
ms.date: 07/19/2022
ms.custom: ignite-fall-2021, mode-ui
#Customer intent: As a new user, I want to quickly get a LUIS app created so I can understand the model and actions to train, test, publish, and query.
---

# Quickstart: Build your app in LUIS portal

[!INCLUDE [deprecation notice](./includes/deprecation-notice.md)]

In this quickstart, create a LUIS app using the prebuilt home automation domain for turning lights and appliances on and off. This prebuilt domain provides intents, entities, and example utterances for you. Next, try customizing your app by adding more intents and entities. When you're finished, you'll have a LUIS endpoint running in the cloud.

[!INCLUDE [Sign in to LUIS](./includes/sign-in-process.md)]

[!INCLUDE [Select authoring resource](./includes/select-authoring-resource.md)]

## Create a new app

You can create and manage your applications on **My Apps**.

### Create an application

To create an application, click  **+ New app**. 

In the window that appears, enter the following information:

|Name  |Description  |
|---------|---------|
|Name     | A name for your app. For example, "home automation".        |
|Culture     | The language that your app understands and speaks.   |
|Description | A description for your app.
|Prediction resource | The prediction resource that will receive queries. |

Select **Done**.

>[!NOTE]
>The culture cannot be changed once the application is created.

## Add prebuilt domain

LUIS offers a set of prebuilt domains that can help you get started with your application. A prebuilt domain app is already populated with [intents](./concepts/intents.md), [entities](concepts/entities.md) and [utterances](concepts/utterances.md).

1. In the left navigation, select **Prebuilt domains**.
2. Search for **HomeAutomation**.
3. Select **Add domain** on the HomeAutomation card.

    > [!div class="mx-imgBorder"]
    > ![Select 'Prebuilt domains' then search for 'HomeAutomation'. Select 'Add domain' on the HomeAutomation card.](media/luis-quickstart-new-app/home-automation.png)

    When the domain is successfully added, the prebuilt domain box displays a **Remove domain** button.

## Check out intents and entities

1. Select **Intents** in the left navigation menu to see the HomeAutomation domain intents. It has example utterances, such as `HomeAutomation.QueryState` and     `HomeAutomation.SetDevice`.

    > [!NOTE]
    > **None** is an intent provided by all LUIS apps. You use it to handle utterances that don't correspond to functionality your app provides.

2. Select the **HomeAutomation.TurnOff** intent. The intent contains a list of example utterances that are labeled with entities.

    > [!div class="mx-imgBorder"]
    > [![Screenshot of HomeAutomation.TurnOff intent](media/luis-quickstart-new-app/home-automation-turnoff.png "Screenshot of HomeAutomation.TurnOff intent")](media/luis-quickstart-new-app/home-automation-turnoff.png)

3. If you want to view the entities for the app, select **Entities**. If you select one of the entities, such as **HomeAutomation.DeviceName** you will see a list of values associated with it. 
 
    :::image type="content" source="media/luis-quickstart-new-app/entities-page.png" alt-text="Image alt text" lightbox="media/luis-quickstart-new-app/entities-page.png":::

## Train the LUIS app
After your application is populated with intents, entities, and utterances, you need to train the application so that the changes you made can be reflected.

[!INCLUDE [LUIS How to Train steps](includes/howto-train.md)]

## Test your app

Once you've trained your app, you can test it.

1. Select **Test** from the top-right navigation.

1. Type a test utterance into the interactive test pane, and press Enter. For example, *Turn off the lights*.

    In this example, *Turn off the lights* is correctly identified as the top scoring intent of **HomeAutomation.TurnOff**.

    :::image type="content" source="media/luis-quickstart-new-app/review-test-inspection-pane-in-portal.png" alt-text="Screenshot of test panel with utterance highlighted" lightbox="media/luis-quickstart-new-app/review-test-inspection-pane-in-portal.png":::

1. Select **Inspect** to view more information about the prediction.

    :::image type="content" source="media/luis-quickstart-new-app/test.png" alt-text="Screenshot of test panel with inspection information" lightbox="media/luis-quickstart-new-app/test.png":::

1. Close the test pane.

## Customize your application

Besides the prebuilt domains LUIS allows you to create your own custom applications or to customize on top of prebuilt ones.

### Create Intents

To add more intents to your app

1. Select **Intents** in the left navigation menu.
2. Select **Create**
3. Enter the intent name, `HomeAutomation.AddDeviceAlias`, and then select Done.

### Create Entities

To add more entities to your app

1. Select **Entities** in the left navigation menu.
2. Select **Create**
3. Enter the entity name, `HomeAutomation.DeviceAlias`, select machine learned from **type** and then select **Create**.

### Add example utterances

Example utterances are text that a user enters in a chat bot or other client applications. They map the intention of the user's text to a LUIS intent.

On the **Intents** page for `HomeAutomation.AddDeviceAlias`, add the following example utterances under **Example Utterance**,

|#|Example utterances|
|--|--|
|1|`Add alias to my fan to be wind machine`|
|2|`Alias lights to illumination`|
|3|`nickname living room speakers to our speakers a new fan`|
|4|`rename living room tv to main tv`|

[!INCLUDE [best-practice-utterances](./includes/best-practice-utterances.md)]


### Label example utterances

Labeling your utterances is needed because you added an ML entity. Labeling is used by your application to learn how to extract the ML entities you created.

[!INCLUDE [how-to-label](./includes/how-to-label.md)]

## Create Prediction resource
At this point, you have completed authoring your application. You need to create a prediction resource to publish your application in order to receive predictions in a chat bot or other client applications through the prediction endpoint

To create a Prediction resource from the LUIS portal

[!INCLUDE [add-pred-resource-portal](./includes/add-prediction-resource-portal.md)]


## Publish the app to get the endpoint URL

[!INCLUDE [LUIS How to Publish steps](./includes/howto-publish.md)]



## Query the V3 API prediction endpoint

[!INCLUDE [LUIS How to get endpoint first step](./includes/v3-prediction-endpoint.md)]

2. In the browser address bar, for the query string, make sure the following values are in the URL. If they are not in the query string, add them:

    * `verbose=true`
    * `show-all-intents=true`

3. In the browser address bar, go to the end of the URL and enter *turn off the living room light* for the query string, then press Enter.

    ```json
    {
        "query": "turn off the living room light",
        "prediction": {
            "topIntent": "HomeAutomation.TurnOff",
            "intents": {
                "HomeAutomation.TurnOff": {
                    "score": 0.969448864
                },
                "HomeAutomation.QueryState": {
                    "score": 0.0122336326
                },
                "HomeAutomation.TurnUp": {
                    "score": 0.006547436
                },
                "HomeAutomation.TurnDown": {
                    "score": 0.0050634006
                },
                "HomeAutomation.SetDevice": {
                    "score": 0.004951761
                },
                "HomeAutomation.TurnOn": {
                    "score": 0.00312553928
                },
                "None": {
                    "score": 0.000552945654
                }
            },
            "entities": {
                "HomeAutomation.Location": [
                    "living room"
                ],
                "HomeAutomation.DeviceName": [
                    [
                        "living room light"
                    ]
                ],
                "HomeAutomation.DeviceType": [
                    [
                        "light"
                    ]
                ],
                "$instance": {
                    "HomeAutomation.Location": [
                        {
                            "type": "HomeAutomation.Location",
                            "text": "living room",
                            "startIndex": 13,
                            "length": 11,
                            "score": 0.902181149,
                            "modelTypeId": 1,
                            "modelType": "Entity Extractor",
                            "recognitionSources": [
                                "model"
                            ]
                        }
                    ],
                    "HomeAutomation.DeviceName": [
                        {
                            "type": "HomeAutomation.DeviceName",
                            "text": "living room light",
                            "startIndex": 13,
                            "length": 17,
                            "modelTypeId": 5,
                            "modelType": "List Entity Extractor",
                            "recognitionSources": [
                                "model"
                            ]
                        }
                    ],
                    "HomeAutomation.DeviceType": [
                        {
                            "type": "HomeAutomation.DeviceType",
                            "text": "light",
                            "startIndex": 25,
                            "length": 5,
                            "modelTypeId": 5,
                            "modelType": "List Entity Extractor",
                            "recognitionSources": [
                                "model"
                            ]
                        }
                    ]
                }
            }
        }
    }
    ```

Learn more about the [V3 prediction endpoint](luis-migration-api-v3.md).


## Clean up resources

[!INCLUDE [LUIS How to clean up resources](../../../includes/cognitive-services-luis-tutorial-how-to-clean-up-resources.md)]

## Next steps

* [Iterative app design](./concepts/application-design.md)
* [Best practices](./faq.md)
