---
title: "Tutorial: Reviewing endpoint utterances - LUIS"
description: In this tutorial, improve app predictions by verifying or correcting utterances received via the LUIS HTTP endpoint that LUIS is unsure of. Some utterances may be to be verified for intent and others may need to be verified for entity.
services: cognitive-services
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: tutorial
ms.date: 07/02/2020
#Customer intent: As a new user, I want to understand why and when to review endpoint utterances.

---

# Tutorial: Fix unsure predictions by reviewing endpoint utterances
In this tutorial, improve app predictions by verifying or correcting utterances, received via the LUIS HTTPS endpoint, that LUIS is unsure of. You should review endpoint utterances as a regular part of your scheduled LUIS maintenance.

This review process allows LUIS to learn your app domain. LUIS selects the utterances that appear in the review list. This list is:

* Specific to the app.
* Is meant to improve the app's prediction accuracy.
* Should be reviewed on a periodic basis.

By reviewing the endpoint utterances, you verify or correct the utterance's predicted intent.

**In this tutorial, you learn how to:**

<!-- green checkmark -->
> [!div class="checklist"]
> * Import example app
> * Review endpoint utterances
> * Train and publish app
> * Query endpoint of app to see LUIS JSON response

[!INCLUDE [LUIS Free account](../../../includes/cognitive-services-luis-free-key-short.md)]

## Download JSON file for app

Download and save [app JSON file](https://github.com/Azure-Samples/cognitive-services-sample-data-files/blob/master/luis/apps/tutorial-fix-unsure-predictions.json?raw=true).

## Import JSON file for app


1. In the [LUIS portal](https://www.luis.ai), on the **My apps** page, select **+ New app for conversation**, then **Import as JSON**. Find the saved JSON file from the previous step. You don't need to change the name of the app. Select **Done**

1. Select **Build** then **Intents** to see the intents, the main building blocks of a LUIS app.

    :::image type="content" source="media/luis-tutorial-review-endpoint-utterances/initial-intents-in-app.png" alt-text="Change from the Versions page to the Intents page.":::

## Train the app to apply the entity changes to the app

[!INCLUDE [LUIS How to Train steps](includes/howto-train.md)]

## Publish the app to access it from the HTTP endpoint

[!INCLUDE [LUIS How to Publish steps](includes/howto-publish.md)]

## Add utterances at the endpoint

In this app, you have intents and entities but you don't have any endpoint usage. This endpoint usage is required to improve the app with the endpoint utterance review.

1. [!INCLUDE [LUIS How to get endpoint first step](includes/howto-get-endpoint.md)]

1. Go to the end of the URL in the address bar and replace _YOUR_QUERY_HERE_ with the utterances in the following table. For each utterance, submit the utterance, and get the result. Then replace the utterance at the end with the next utterance.

    |Endpoint utterance|Aligned intent|
    |--|--|
    |`I'm looking for a job with Natural Language Processing`|`GetJobInformation`|
    |`I want to cancel on March 3`|`Utilities.Cancel`|
    |`When were HRF-123456 and hrf-234567 published in the last year?`|`FindForm`|
    |`shift 123-45-6789 from Z-1242 to T-54672`|`MoveEmployee`|
    |`Please relocation jill-jones@mycompany.com from x-2345 to g-23456`|`MoveEmployee`|
    |`Here is my c.v. for the programmer job`|`ApplyForJob`|
    |`This is the lead welder paperwork.`|`ApplyForJob`|
    |`does form hrf-123456 cover the new dental benefits and medical plan`|`FindForm`|
    |`Jill Jones work with the media team on the public portal was amazing`|`EmployeeFeedback`|

    There is a single pool of utterances to review, regardless of which version you are actively editing or which version of the app was published at the endpoint.

## Review endpoint utterances

Review the endpoint utterances for correctly aligned intent. While there is a single pool of utterances to review across all versions, the process of correctly aligning the intent adds the example utterance to the current _active model_ only.

1. From the **Build** section of the portal, select **Review endpoint utterances** from the left navigation. The list is filtered for the **ApplyForJob** intent.

    :::image type="content" source="./media/luis-tutorial-review-endpoint-utterances/review-endpoint-utterances-with-entity-view.png" alt-text="Screenshot of Review endpoint utterances button in left navigation.":::

    This utterance, `I'm looking for a job with Natural Language Processing`, is not in the correct intent, _GetJobInformation_. It has been mispredicted as _ApplyForJob_ because of the similarity of job names and verbs in the two intents.

1.  To align this utterance, select the correct **Aligned Intent** of `GetJobInformation`. Add the changed utterance to the app by selecting the checkmark.

    Review the remaining utterances in this intent, correcting the aligned intent as needed. Use the initial utterance table in this tutorial to view the aligned intent.

    The **Review endpoint utterances** list should no longer have the corrected utterances. If more utterances appear, continue to work through the list, correcting aligned intents until the list is empty.

    Any correction of entity labeling is done after the intent is aligned, from the Intent details page.

1. Train and publish the app again.

## Get intent prediction from endpoint

To verify the correctly aligned example utterances improved the app's prediction, try an utterance close to the corrected utterance.

1. [!INCLUDE [LUIS How to get endpoint first step](includes/howto-get-endpoint.md)]

1. Go to the end of the URL in the address bar and replace _YOUR_QUERY_HERE_ with `Are there any natural language processing jobs in my department right now?`.

   ```json
    {
        "query": "Are there any natural language processing jobs in my department right now?",
        "prediction": {
            "topIntent": "GetJobInformation",
            "intents": {
                "GetJobInformation": {
                    "score": 0.901367366
                },
                "ApplyForJob": {
                    "score": 0.0307973567
                },
                "EmployeeFeedback": {
                    "score": 0.0296942145
                },
                "MoveEmployee": {
                    "score": 0.00739785144
                },
                "FindForm": {
                    "score": 0.00449316856
                },
                "Utilities.Stop": {
                    "score": 0.00417657848
                },
                "Utilities.StartOver": {
                    "score": 0.00407167152
                },
                "Utilities.Help": {
                    "score": 0.003662492
                },
                "None": {
                    "score": 0.00335733569
                },
                "Utilities.Cancel": {
                    "score": 0.002225436
                },
                "Utilities.Confirm": {
                    "score": 0.00107437756
                }
            },
            "entities": {
                "keyPhrase": [
                    "natural language processing jobs",
                    "department"
                ],
                "datetimeV2": [
                    {
                        "type": "datetime",
                        "values": [
                            {
                                "timex": "PRESENT_REF",
                                "resolution": [
                                    {
                                        "value": "2020-07-02 21:45:50"
                                    }
                                ]
                            }
                        ]
                    }
                ],
                "$instance": {
                    "keyPhrase": [
                        {
                            "type": "builtin.keyPhrase",
                            "text": "natural language processing jobs",
                            "startIndex": 14,
                            "length": 32,
                            "modelTypeId": 2,
                            "modelType": "Prebuilt Entity Extractor",
                            "recognitionSources": [
                                "model"
                            ]
                        },
                        {
                            "type": "builtin.keyPhrase",
                            "text": "department",
                            "startIndex": 53,
                            "length": 10,
                            "modelTypeId": 2,
                            "modelType": "Prebuilt Entity Extractor",
                            "recognitionSources": [
                                "model"
                            ]
                        }
                    ],
                    "datetimeV2": [
                        {
                            "type": "builtin.datetimeV2.datetime",
                            "text": "right now",
                            "startIndex": 64,
                            "length": 9,
                            "modelTypeId": 2,
                            "modelType": "Prebuilt Entity Extractor",
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

   Now that the unsure utterances are correctly aligned, the correct intent was predicted with a **high score**.

## Can reviewing be replaced by adding more utterances?
You may wonder why not add more example utterances. What is the purpose of reviewing endpoint utterances? In a real-world LUIS app, the endpoint utterances are from users with word choice and arrangement you haven't used yet. If you had used the same word choice and arrangement, the original prediction would have a higher percentage.

## Why is the top intent on the utterance list?
Some of the endpoint utterances will have a high prediction score in the review list. You still need to review and verify those utterances. They are on the list because the next highest intent had a score too close to the top intent score. You want about 15% difference between the two top intents.

## Clean up resources

[!INCLUDE [LUIS How to clean up resources](../../../includes/cognitive-services-luis-tutorial-how-to-clean-up-resources.md)]

## Next steps

In this tutorial, you reviewed utterances submitted at the endpoint, that LUIS was unsure of. Once these utterances have been verified and moved into the correct intents as example utterances, LUIS will improve the prediction accuracy.

> [!div class="nextstepaction"]
> [Learn how to use patterns](luis-tutorial-pattern.md)
