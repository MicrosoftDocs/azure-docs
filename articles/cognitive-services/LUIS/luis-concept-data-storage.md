---
title: Data storage 
titleSuffix: Language Understanding - Azure Cognitive Services
description: LUIS stores data encrypted in an Azure data store corresponding to the region specified by the key. 
services: cognitive-services
author: diberry
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: conceptual
ms.date: 03/28/2019
ms.author: diberry
---

# Data storage and removal in Language Understanding (LUIS) Cognitive Services
LUIS stores data encrypted in an Azure data store corresponding to the region specified by the key. This data is stored for 30 days. 

## Export and delete app
Users have full control over [exporting](luis-how-to-start-new-app.md#export-app) and [deleting](luis-how-to-start-new-app.md#delete-app) the app. 

## Utterances

Utterances can be stored in two different places. 

* During **the authoring process**, utterances are created and stored in the Intent. Utterances in intents are required for a successful LUIS app. Once the app is published and receives queries at the endpoint, the endpoint request's querystring, `log=false`, determines if the endpoint utterance is stored. If the endpoint is stored, it becomes part of the active learning utterances found in the **Build** section of the portal, in the **Review endpoint utterances** section. 
* When you **review endpoint utterances**, and add an utterance to an intent, the utterance is no longer stored as part of the endpoint utterances to be reviewed. It is added to the app's intents. 

<a name="utterances-in-an-intent"></a>

### Delete example utterances from an intent
Delete example utterances used for training [LUIS](luis-reference-regions.md). If you delete an example utterance from your LUIS app, it is removed from the LUIS web service and is unavailable for export.

<a name="utterances-in-review"></a>

### Delete utterances in review from active learning

You can delete utterances from the list of user utterances that LUIS suggests in the **[Review endpoint utterances page](luis-how-to-review-endpoint-utterances.md)**. Deleting utterances from this list prevents them from being suggested, but doesn't delete them from logs.

If you don't want active learning utterances, you can [disable active learning](luis-how-to-review-endpoint-utterances.md#disable-active-learning). Disabling active learning also disables logging.

### Disable logging utterances
[Disabling active learning](luis-how-to-review-endpoint-utterances.md#disable-active-learning) is disables logging.


<a name="accounts"></a>

## Delete an account
If you delete an account, all apps are deleted, along with their example utterances and logs. The data is retained for 60 days before the account and data are deleted permanently.

Deleting account is available from the **Settings** page. Select your account name in the top right navigation bar to get to the **Settings** page.

## Data inactivity as an expired subscription
For the purposes of data retention and deletion, an inactive LUIS app may at _Microsoft’s discretion_ be treated as an expired subscription. An app is considered inactive if it meets the following criteria for the last 90 days: 

* Has had **no** calls made to it.
* Has not been modified.
* Does not have a current key assigned to it.
* Has not had a user sign in to it.

## Next steps

> [!div class="nextstepaction"]
> [Learn about exporting and deleting an app](luis-how-to-start-new-app.md)
