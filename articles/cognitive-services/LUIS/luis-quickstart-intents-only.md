---
title: Predict intentions
titleSuffix: Azure Cognitive Services
description: In this tutorial, create a custom app that predicts a user's intention. This app is the simplest type of LUIS app because it doesn't extract various data elements from the utterance text such as email addresses or dates. 
services: cognitive-services
author: diberry
manager: cgronlun
ms.custom: seodec18
ms.service: cognitive-services
ms.component: language-understanding
ms.topic: tutorial
ms.date: 12/21/2018
ms.author: diberry
#Customer intent: As a new user, I want to create a Human Resources app, so that I can analyze user text in that subject domain.
---

# Tutorial: Build custom app to determine user intentions

In this tutorial, you create a custom Human Resources (HR) app that predicts a user's intention based on the utterance (text). 

**In this tutorial, you learn how to:**

> [!div class="checklist"]
> * Create a new app 
> * Create intents
> * Add example utterances
> * Train app
> * Publish app
> * Get intent from endpoint


[!INCLUDE [LUIS Free account](../../../includes/cognitive-services-luis-free-key-short.md)]

## Create a new app

[!INCLUDE [Follow these steps to create a new LUIS app](../../../includes/cognitive-services-luis-create-new-app-steps.md)]


## User intentions as intents

The purpose of the app is to determine the intention of conversational, natural language text: 

`Are there any new positions in the Seattle office?`

These intentions are categorized into **Intents**. 

This app has a few intents. 

|Intent|Purpose|
|--|--|
|ApplyForJob|Determine if user is applying for a job.|
|GetJobInformation|Determine if user is looking for information about jobs in general or a specific job.|
|None|Determine if user is asking something app is not supposed to answer. This intent if provided as part of app creation and can't be deleted. |

Determining which job-related intent may be tricky due to word choice and word order.

## Create the GetJobInformation intent to hold example utterances about job information

1. Select **Create new intent**. Enter the new intent name `GetJobInformation`. This intent is predicted any time a user wants information about open jobs in the company.

    ![Screenshot of Language Understanding (LUIS) New intent dialog](media/luis-quickstart-intents-only/create-intent.png "Screenshot of Language Understanding (LUIS) New intent dialog")

2. By providing _example utterances_, you are training LUIS what kinds of utterances should be predicted for this intent. Add several example utterances to this intent that you expect a user to ask, such as:

    | Example utterances|
    |--|
    |Any new jobs posted today?|
    |Are there any new positions in the Seattle office?|
    |Are there any remote worker or telecommute jobs open for engineers?|
    |Is there any work with databases?|
    |I'm looking for a co-working situation in the tampa office.|
    |Is there an internship in the san francisco office?|
    |Is there any part-time work for people in college?|
    |Looking for a new situation with responsibilities in accounting|
    |Looking for a job in new york city for bilinguial speakers.|
    |Looking for a new situation with responsibilities in accounting.|
    |New jobs?|
    |Show me all the jobs for engineers that were added in the last 2 days.|
    |Today's job postings?|
    |What accounting positions are open in the london office?|
    |What positions are available for Senior Engineers?|
    |Where is the job listings|

    [![Screenshot of entering new utterances for MyStore intent](media/luis-quickstart-intents-only/utterance-getstoreinfo.png "Screenshot of entering new utterances for MyStore intent")](media/luis-quickstart-intents-only/utterance-getstoreinfo.png#lightbox)

    [!INCLUDE [Do not use too few utterances](../../../includes/cognitive-services-luis-too-few-example-utterances.md)]    


## Add example utterances that are outside the scope of the app to the None intent 

The client application needs to know if an utterance is not meaningful or appropriate for the application. The **None** intent is added to each application as part of the creation process to determine if an utterance can't be answered by the client application.

If LUIS returns the **None** intent for an utterance, your client application can ask if the user wants to end the conversation or give more directions for continuing the conversation. 

> ![CAUTION] Do not leave it empty. 

1. Select **Intents** from the left panel.

2. Select the **None** intent. Add three utterances that your user might enter but are not relevant to your Human Resources app:

    | Example utterances|
    |--|
    |Barking dogs are annoying|
    |Order a pizza for me|
    |Penguins in the ocean|


## Train the app so the changes to the intent can be tested 

[!INCLUDE [LUIS How to Train steps](../../../includes/cognitive-services-luis-tutorial-how-to-train.md)]

## Publish the app so the trained model is queryable from the endpoint

[!INCLUDE [LUIS How to Publish steps](../../../includes/cognitive-services-luis-tutorial-how-to-publish.md)] 

## Get intent prediction from the endpoint

1. [!INCLUDE [LUIS How to get endpoint first step](../../../includes/cognitive-services-luis-tutorial-how-to-get-endpoint.md)]

2. Go to the end of the URL in the address bar and enter `I'm looking for a job with Natural Language Processing`. The last query string parameter is `q`, the utterance **query**. This utterance is not the same as any of the example utterances. It is a good test and should return the `GetJobInformation` intent as the top scoring intent. 

    ```JSON
    {
      "query": "I'm looking for a job with Natural Language Processing",
      "topScoringIntent": {
        "intent": "GetJobInformation",
        "score": 0.8965092
      },
      "intents": [
        {
          "intent": "GetJobInformation",
          "score": 0.8965092
        },
        {
          "intent": "None",
          "score": 0.147104025
        }
      ],
      "entities": []
    }
    ```

    The `verbose=true` querystring parameter means include **all the intents** in the app's query results. The entities array is empty because this app currently does not have any entities. 

    The JSON result identifies the top scoring intent as **`topScoringIntent`** property. All scores are between 1 and 0, with the better score being close to 1. 

## Create the ApplyForJob intent to determine if a user is applying for a job

Return to the LUIS portal and create a new intent to determine if the user utterance is about applying for a job.

1. Select **Build** from the top, right menu to return to app building.

2. Select **Intents** from the left menu to get to the list of intents.

3. Select **Create new intent** and enter the name `ApplyForJob`. 

    ![LUIS dialog to create new intent](./media/luis-quickstart-intents-only/create-applyforjob-intent.png)

4. Add several utterances to this intent that you expect a user to ask for, such as:

    | Example utterances|
    |--|
    |Fill out application for Job 123456|
    |Here is my c.v. for position 654234|
    |Here is my resume for the part-time receptionist post.|
    |I'm applying for the art desk job with this paperwork.|
    |I'm applying for the summer college internship in Research and Development in San Diego|
    |I'm requesting to submit my resume to the temporary position in the cafeteria.|
    |I'm submitting my resume for the new Autocar team in Columbus, OH|
    |I want to apply for the new accounting job|
    |Job 456789 accounting internship paperwork is here|
    |Job 567890 and my paperwork|
    |My papers for the tulsa accounting internship are attached.|
    |My paperwork for the holiday delivery position|
    |Please send my resume for the new accounting job in seattle|
    |Submit resume for engineering position|
    |This is my c.v. for post 234123 in Tampa.|

    [![Screenshot of entering new utterances for ApplyForJob intent](media/luis-quickstart-intents-only/utterance-applyforjob.png "Screenshot of entering new utterances for ApplyForJob intent")](media/luis-quickstart-intents-only/utterance-applyforjob.png#lightbox)

    The labeled intent is outlined in red because LUIS is currently uncertain the intent is correct. Training the app tells LUIS the utterances are on the correct intent. 

## Train again

[!INCLUDE [LUIS How to Train steps](../../../includes/cognitive-services-luis-tutorial-how-to-train.md)]

## Publish again

[!INCLUDE [LUIS How to Publish steps](../../../includes/cognitive-services-luis-tutorial-how-to-publish.md)] 

## Get intent again

1. [!INCLUDE [LUIS How to get endpoint first step](../../../includes/cognitive-services-luis-tutorial-how-to-get-endpoint.md)]

2. In the new browser window, enter `Can I submit my resume for job 235986` at the end of the URL. 

    ```json
    {
      "query": "Can I submit my resume for job 235986",
      "topScoringIntent": {
        "intent": "ApplyForJob",
        "score": 0.9166808
      },
      "intents": [
        {
          "intent": "ApplyForJob",
          "score": 0.9166808
        },
        {
          "intent": "GetJobInformation",
          "score": 0.07162977
        },
        {
          "intent": "None",
          "score": 0.0262826588
        }
      ],
      "entities": []
    }
    ```

    The results include the new intent **ApplyForJob** as well as the existing intents. 

## Client-application next steps

After LUIS returns the JSON response, LUIS is done with this request. LUIS doesn't provide answers to user utterances, it only identifies what type of information is being asked for in natural language. The conversational follow-up is provided by the client application such as an [Azure Bot](https://docs.microsoft.com/azure/bot-service/?view=azure-bot-service-4.0). 

## Clean up resources

[!INCLUDE [LUIS How to clean up resources](../../../includes/cognitive-services-luis-tutorial-how-to-clean-up-resources.md)]

## Next steps

This tutorial created the Human Resources (HR) app, created 2 intents, added example utterances to each intent, added example utterances to the None intent, trained, published, and tested at the endpoint. These are the basic steps of building a LUIS model. 

> [!div class="nextstepaction"]
> [Add prebuilt intents and entities to this app](luis-tutorial-prebuilt-intents-entities.md)
