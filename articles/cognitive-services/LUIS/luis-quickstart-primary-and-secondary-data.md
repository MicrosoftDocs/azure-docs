---
title: Tutorial creating a LUIS app to extract data - Azure | Microsoft Docs 
description: In this tutorial, learn how to create a simple LUIS app using intents and a simple entity to extract machine-learned data. 
services: cognitive-services
author: diberry
manager: cjgronlund 

ms.service: cognitive-services
ms.component: luis
ms.topic: tutorial
ms.date: 08/02/2018
ms.author: diberry
#Customer intent: As a new user, I want to understand how and why to use the simple entity.  
--- 

# Tutorial: 7. Add simple entity and phrase list
In this tutorial, create an app that demonstrates how to extract machine-learned data from an utterance using the **Simple** entity.

<!-- green checkmark -->
> [!div class="checklist"]
> * Understand simple entities 
> * Create new LUIS app for the Human Resources (HR) domain 
> * Add simple entity to extract jobs from app
> * Train, and publish app
> * Query endpoint of app to see LUIS JSON response
> * Add phrase list to boost signal of job words
> * Train, publish app, and requery endpoint

[!INCLUDE [LUIS Free account](../../../includes/cognitive-services-luis-free-key-short.md)]

## Before you begin
If you don't have the Human Resources app from the [composite entity](luis-tutorial-composite-entity.md) tutorial, [import](luis-how-to-start-new-app.md#import-new-app) the JSON into a new app in the [LUIS](luis-reference-regions.md#luis-website) website. The app to import is found in the [LUIS-Samples](https://github.com/Microsoft/LUIS-Samples/blob/master/documentation-samples/quickstarts/custom-domain-composite-HumanResources.json) Github repository.

If you want to keep the original Human Resources app, clone the version on the [Settings](luis-how-to-manage-versions.md#clone-a-version) page, and name it `simple`. Cloning is a great way to play with various LUIS features without affecting the original version.  

## Purpose of the app
This app demonstrates how to pull data out of an utterance. Consider the following utterances from a chatbot:

|Utterance|Extractable job name|
|:--|:--|
|I want to apply for the new accounting job.|accounting|
|Please submit my resume for the engineering position.|engineering|
|Fill out application for job 123456|123456|

This tutorial adds a new entity to extract the job name. 

## Purpose of the simple entity
The purpose of the simple entity in this LUIS app is to teach LUIS what a job name is and where it can be found in an utterance. The part of the utterance that is the job can change from utterance to utterance based on word choice and utterance length. LUIS needs examples of jobs in any utterance across all intents.  

The job name is difficult to determine because a name can be a noun, verb, or a phrase of several words. For example:

|Jobs|
|--|
|engineer|
|software engineer|
|senior software engineer|
|engineering team lead |
|air traffic controller|
|motor vehicle operator|
|ambulance driver|
|tender|
|extruder|
|millwright|

This LUIS app has job names in several intents. By labeling these words in all the intents' utterances, LUIS learns more about what a job is and where it is found in utterances.

## Create job simple entity

1. Make sure your Human Resources app is in the **Build** section of LUIS. You can change to this section by selecting **Build** on the top, right menu bar. 

2. On the **Intents** page, select **ApplyForJob** intent. 

    [![](media/luis-quickstart-primary-and-secondary-data/hr-select-applyforjob.png "Screenshot of LUIS with 'ApplyForJob' intent highlighted")](media/luis-quickstart-primary-and-secondary-data/hr-select-applyforjob.png#lightbox)

3. In the utterance, `I want to apply for the new accounting job`, select `accounting`, enter `Job` in the top field of the pop-up menu, then select **Create new entity** in the pop-up menu. 

    [![](media/luis-quickstart-primary-and-secondary-data/hr-create-entity.png "Screenshot of LUIS with 'ApplyForJob' intent with create entity steps highlighted")](media/luis-quickstart-primary-and-secondary-data/hr-create-entity.png#lightbox)

4. In the pop-up window, verify the entity name and type and select **Done**.

    ![Create simple entity pop-up modal dialog with name of Job and type of simple](media/luis-quickstart-primary-and-secondary-data/hr-create-simple-entity-popup.png)

5. In the utterance, `Submit resume for engineering position`, label the word `engineering` as a Job entity. Select the word `engineering`, then select **Job** from the pop-up menu. 

    [![](media/luis-quickstart-primary-and-secondary-data/hr-label-simple-entity.png "Screenshot of LUIS labeling job entity highlighted")](media/luis-quickstart-primary-and-secondary-data/hr-label-simple-entity.png#lightbox)

    All the utterances are labeled but five utterances aren't enough to teach LUIS about job-related words and phrases. The jobs that use the number value do not need more examples because that uses a regular expression entity. The jobs that are words or phrases need at least 15 more examples. 

6. Add more utterances and mark the job words or phrases as **Job** entity. The job types are general across employment for an employment service. If you wanted jobs related to a specific industry, the job words should reflect that. 

    |Utterance|Job entity|
    |:--|:--|
    |I'm applying for the Program Manager desk in R&D|Program Manager|
    |Here is my line cook application.|line cook|
    |My resume for camp counselor is attached.|camp counselor|
    |This is my c.v. for administrative assistant.|administrative assistant|
    |I want to apply for the management job in sales.|management, sales|
    |This is my resume for the new accounting position.|accounting|
    |My application for barback is included.|barback|
    |I'm submitting my application for roofer and framer.|roofer, framer|
    |My c.v. for bus driver is here.|bus driver|
    |I'm a registered nurse. Here is my resume.|registered nurse|
    |I would like to submit my paperwork for the teaching position I saw in the paper.|teaching|
    |This is my c.v. for the stocker post in fruits and vegetables.|stocker|
    |Apply for tile work.|tile|
    |Attached resume for landscape architect.|landscape architect|
    |My curriculum vitae for professor of biology is enclosed.|professor of biology|
    |I would like to apply for the position in photography.|photography|git 

## Label entity in example utterances for GetJobInformation intent
1. Select **Intents** from the left menu.

2. Select **GetJobInformation** from the list of intents. 

3. Label the jobs in the example utterances:

    |Utterance|Job entity|
    |:--|:--|
    |Is there any work in databases?|databases|
    |Looking for a new situation with responsibilities in accounting|accounting|
    |What positions are available for senior engineers?|senior engineers|

    There are other example utterances but they do not contain job words.

## Train the LUIS app

[!INCLUDE [LUIS How to Train steps](../../../includes/cognitive-services-luis-tutorial-how-to-train.md)]

## Publish the app to get the endpoint URL

[!INCLUDE [LUIS How to Publish steps](../../../includes/cognitive-services-luis-tutorial-how-to-publish.md)]

## Query the endpoint with a different utterance

1. [!INCLUDE [LUIS How to get endpoint first step](../../../includes/cognitive-services-luis-tutorial-how-to-get-endpoint.md)]

2. Go to the end of the URL in the address and enter `Here is my c.v. for the programmer job`. The last querystring parameter is `q`, the utterance **query**. This utterance is not the same as any of the labeled utterances so it is a good test and should return the `ApplyForJob` utterances.

```JSON
{
  "query": "Here is my c.v. for the programmer job",
  "topScoringIntent": {
    "intent": "ApplyForJob",
    "score": 0.9826467
  },
  "intents": [
    {
      "intent": "ApplyForJob",
      "score": 0.9826467
    },
    {
      "intent": "GetJobInformation",
      "score": 0.0218927357
    },
    {
      "intent": "MoveEmployee",
      "score": 0.007849265
    },
    {
      "intent": "Utilities.StartOver",
      "score": 0.00349470088
    },
    {
      "intent": "Utilities.Confirm",
      "score": 0.00348804821
    },
    {
      "intent": "None",
      "score": 0.00319909188
    },
    {
      "intent": "FindForm",
      "score": 0.00222647213
    },
    {
      "intent": "Utilities.Help",
      "score": 0.00211193133
    },
    {
      "intent": "Utilities.Stop",
      "score": 0.00172086991
    },
    {
      "intent": "Utilities.Cancel",
      "score": 0.00138010911
    }
  ],
  "entities": [
    {
      "entity": "programmer",
      "type": "Job",
      "startIndex": 24,
      "endIndex": 33,
      "score": 0.5230502
    }
  ]
}
```

## Names are tricky
The LUIS app found the correct intent with high confidence and it extracted the job name, but names are tricky. Try the utterance `This is the lead welder paperwork`.  

In the following JSON, LUIS responds with the correct intent, `ApplyForJob`, but didn't extract the `lead welder` job name. 

```JSON
{
  "query": "This is the lead welder paperwork.",
  "topScoringIntent": {
    "intent": "ApplyForJob",
    "score": 0.468558252
  },
  "intents": [
    {
      "intent": "ApplyForJob",
      "score": 0.468558252
    },
    {
      "intent": "GetJobInformation",
      "score": 0.0102701457
    },
    {
      "intent": "MoveEmployee",
      "score": 0.009442534
    },
    {
      "intent": "Utilities.StartOver",
      "score": 0.00639619166
    },
    {
      "intent": "None",
      "score": 0.005859333
    },
    {
      "intent": "Utilities.Cancel",
      "score": 0.005087704
    },
    {
      "intent": "Utilities.Stop",
      "score": 0.00315379258
    },
    {
      "intent": "Utilities.Help",
      "score": 0.00259344373
    },
    {
      "intent": "FindForm",
      "score": 0.00193389168
    },
    {
      "intent": "Utilities.Confirm",
      "score": 0.000420796918
    }
  ],
  "entities": []
}
```

Because a name can be anything, LUIS predicts entities more accurately if it has a phrase list of words to boost the signal.

## To boost signal, add jobs phrase list
Open the [jobs-phrase-list.csv](https://github.com/Microsoft/LUIS-Samples/blob/master/documentation-samples/quickstarts/job-phrase-list.csv) from the LUIS-Samples Github repository. The list is over one thousand job words and phrases. Look through the list for job words that are meaningful to you. If your words or phrases are not on the list, add your own.

1. In the **Build** section of the LUIS app, select **Phrase lists** found under the **Improve app performance** menu.

    [![](media/luis-quickstart-primary-and-secondary-data/hr-select-phrase-list-left-nav.png "Screenshot of Phrase lists left nav button highlighted")](media/luis-quickstart-primary-and-secondary-data/hr-select-phrase-list-left-nav.png#lightbox)

2. Select **Create new phrase list**. 

    [![](media/luis-quickstart-primary-and-secondary-data/hr-create-new-phrase-list.png "Screenshot of create new phrase list button highlighted")](media/luis-quickstart-primary-and-secondary-data/hr-create-new-phrase-list.png#lightbox)

3. Name the new phrase list `Jobs` and copy the list from jobs-phrase-list.csv into the **Values** text box. Select enter. 

    [![](media/luis-quickstart-primary-and-secondary-data/hr-create-phrase-list-1.png "Screenshot of create new phrase list dialog pop-up")](media/luis-quickstart-primary-and-secondary-data/hr-create-phrase-list-1.png#lightbox)

    If you want more words added to the phrase list, review the **Related Values** and add any that are relevant. 

4. Select **Save** to activate the phrase list.

    [![](media/luis-quickstart-primary-and-secondary-data/hr-create-phrase-list-2.png "Screenshot of create new phrase list dialog pop-up with words in phrase list values box")](media/luis-quickstart-primary-and-secondary-data/hr-create-phrase-list-2.png#lightbox)

5. [Train](#train-the-luis-app) and [publish](#publish-the-app-to-get-the-endpoint-URL) the app again to use phrase list.

6. Requery at the endpoint with the same utterance: `This is the lead welder paperwork.`

    The JSON response includes the extracted entity:

    ```JSON
    {
        "query": "This is the lead welder paperwork.",
        "topScoringIntent": {
            "intent": "ApplyForJob",
            "score": 0.920025647
        },
        "intents": [
            {
            "intent": "ApplyForJob",
            "score": 0.920025647
            },
            {
            "intent": "GetJobInformation",
            "score": 0.003800706
            },
            {
            "intent": "Utilities.StartOver",
            "score": 0.00299335527
            },
            {
            "intent": "MoveEmployee",
            "score": 0.0027167045
            },
            {
            "intent": "None",
            "score": 0.00259556063
            },
            {
            "intent": "FindForm",
            "score": 0.00224019377
            },
            {
            "intent": "Utilities.Stop",
            "score": 0.00200693542
            },
            {
            "intent": "Utilities.Cancel",
            "score": 0.00195913855
            },
            {
            "intent": "Utilities.Help",
            "score": 0.00162656687
            },
            {
            "intent": "Utilities.Confirm",
            "score": 0.0002851904
            }
        ],
        "entities": [
            {
            "entity": "lead welder",
            "type": "Job",
            "startIndex": 12,
            "endIndex": 22,
            "score": 0.8295959
            }
        ]
    }
    ```

## Phrase lists
Adding the phrase list boosted the signal of the words in the list but is **not** used as an exact match. The phrase list has several jobs with the first word of `lead` and also has the job `welder` but does not have the job `lead welder`. This phrase list for jobs may not be complete. As you regularly [review endpoint utterances](luis-how-to-review-endoint-utt.md) and find other job words, add those to your phrase list. Then retrain and republish.

## What has this LUIS app accomplished?
This app, with a simple entity and a phrase list of words, identified a natural language query intention and returned the job data. 

Your chatbot now has enough information to determine the primary action of applying for a job and a parameter of that action, which job is referenced. 

## Where is this LUIS data used? 
LUIS is done with this request. The calling application, such as a chatbot, can take the topScoringIntent result and the data from the entity to use a third-party API to send the job information to a Human Resources representative. If there are other programmatic options for the bot or calling application, LUIS doesn't do that work. LUIS only determines what the user's intention is. 

## Clean up resources

[!INCLUDE [LUIS How to clean up resources](../../../includes/cognitive-services-luis-tutorial-how-to-clean-up-resources.md)]

## Next steps

> [!div class="nextstepaction"]
> [Add a prebuilt keyphrase entity](luis-quickstart-intent-and-key-phrase.md)