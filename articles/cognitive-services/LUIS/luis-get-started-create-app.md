---
title: "Quickstart: create app - LUIS"
description:  This quickstart shows how to create a LUIS app that uses the prebuilt domain `HomeAutomation` for turning lights and appliances on and off. This prebuilt domain provides intents, entities, and example utterances for you. When you're finished, you'll have a LUIS endpoint running in the cloud.
ms.topic: quickstart
ms.date: 03/24/2020
#Customer intent: As a new user, I want to quickly get a LUIS app created so I can understand the model and actions to train, test, publish, and query.
---

# Quickstart: Use prebuilt Home automation app

In this quickstart, create a LUIS app that uses the prebuilt domain `HomeAutomation` for turning lights and appliances on and off. This prebuilt domain provides intents, entities, and example utterances for you. When you're finished, you'll have a LUIS endpoint running in the cloud.

[!INCLUDE [Sign in to LUIS](./includes/sign-in-process.md)]

[!INCLUDE [Select authoring resource](./includes/select-authoring-resource.md)]

## Create a new app
You can create and manage your applications on **My Apps**.

1. On the My apps list, select **+ New app for conversation**.

1. In the dialog box, name your application `Home Automation`. Select **English** as the culture. The description is optional and isn't used for authoring or prediction. The prediction resource is also optional when creating a LUIS app. Select **Done**.

    LUIS creates the app. When you publish your app to production, you should assign a prediction resource so your app can handle many requests.

    ![In the dialog box, name your application `Home Automation`](./media/create-new-app-details.png)

    >[!NOTE]
    >The culture cannot be changed once the application is created.

## Add prebuilt domain

Select **Prebuilt domains** then search for **HomeAutomation**. Select **Add domain** on the HomeAutomation card.

![Select 'Prebuilt domains' then search for 'HomeAutomation'. Select 'Add domain' on the HomeAutomation card.](media/luis-quickstart-new-app/home-automation.png)

When the domain is successfully added, the prebuilt domain box displays a **Remove domain** button.

## Intents and entities

Select **Intents** to review the HomeAutomation domain intents. The prebuilt domain intents have sample utterances.

![Screenshot of HomeAutomation intents list](media/luis-quickstart-new-app/home-automation-intents.png "Screenshot of HomeAutomation intents list")

> [!NOTE]
> **None** is an intent provided by all LUIS apps. You use it to handle utterances that don't correspond to functionality your app provides.

Select the **HomeAutomation.TurnOff** intent. You can see that the intent contains a list of utterances that are labeled with entities.

[![Screenshot of HomeAutomation.TurnOff intent](media/luis-quickstart-new-app/home-automation-turnoff.png "Screenshot of HomeAutomation.TurnOff intent")](media/luis-quickstart-new-app/home-automation-turnoff.png)

## Train the LUIS app

[!INCLUDE [LUIS How to Train steps](includes/howto-train.md)]

## Test your app
Once you've trained your app, you can test it.

1. Select **Test** from the top-right navigation. 1. Type a test utterance like `Turn off the lights` into the interactive test pane, and press Enter.

    ```
    Turn off the lights
    ```

    Check that the top scoring intent corresponds to the intent you expected for each test utterance.

    In this example, `Turn off the lights` is correctly identified as the top scoring intent of **HomeAutomation.TurnOff**.

    ![Screenshot of Test panel with utterance highlighted](media/luis-quickstart-new-app/review-test-inspection-pane-in-portal.png)

1. Select **Inspect** to review more information about the prediction.

    ![Screenshot of Test panel with inspection information](media/luis-quickstart-new-app/test.png)

1. Close the test pane.

<a name="publish-your-app"></a>

## Publish the app to get the endpoint URL

[!INCLUDE [LUIS How to Publish steps](./includes/howto-publish.md)]

<a name="query-the-v2-api-prediction-endpoint"></a>

## Query the V3 API prediction endpoint

[!INCLUDE [LUIS How to get endpoint first step](./includes/v3-prediction-endpoint.md)]

2. In the browser address bar, for the query string, make sure the following name and value bars are in the URL. If they are not in the query string, add them:

    |Name/value pair|
    |--|
    |`verbose=true`|
    |`show-all-intents=true`|

3. In the browser address bar, go to the end of the URL and enter `turn off the living room light` for the _query_ value, then press Enter.

    ```json
    {
        "query": "turn off the living room light",
        "prediction": {
            "topIntent": "HomeAutomation.TurnOff",
            "intents": {
                "HomeAutomation.TurnOff": {
                    "score": 0.984315455
                },
                "HomeAutomation.QueryState": {
                    "score": 0.009912962
                },
                "HomeAutomation.TurnDown": {
                    "score": 0.00626645749
                },
                "HomeAutomation.TurnUp": {
                    "score": 0.00572059769
                },
                "HomeAutomation.SetDevice": {
                    "score": 0.00379381469
                },
                "HomeAutomation.TurnOn": {
                    "score": 0.00366983772
                },
                "None": {
                    "score": 0.000623856
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
                            "score": 0.907323956,
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

You can call the endpoint from code:

> [!div class="nextstepaction"]
> [Call a LUIS endpoint using code](luis-get-started-cs-get-intent.md)
