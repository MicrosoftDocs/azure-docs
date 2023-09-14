---
title: Data storage - LUIS
titleSuffix: Azure AI services
description: LUIS stores data encrypted in an Azure data store corresponding to the region specified by the key. 
services: cognitive-services
ms.author: aahi
author: aahill
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: conceptual
ms.date: 12/07/2020
---

# Data storage and removal in Language Understanding (LUIS) Azure AI services

[!INCLUDE [deprecation notice](./includes/deprecation-notice.md)]


LUIS stores data encrypted in an Azure data store corresponding to [the region](luis-reference-regions.md) specified by the key. 

* Data used to train the model such as entities, intents, and utterances will be saved in LUIS for the lifetime of the application. If an owner or contributor deletes the app, this data will be deleted with it. If an application hasn't been used in 90 days, it will be deleted. 

* Application authors can choose to [enable logging](how-to/improve-application.md#log-user-queries-to-enable-active-learning) on the utterances that are sent to a published application. If enabled, utterances will be saved for 30 days, and can be viewed by the application author. If logging isn't enabled when the application is published, this data is not stored.

## Export and delete app
Users have full control over [exporting](how-to/sign-in.md) and [deleting](how-to/sign-in.md) the app. 

## Utterances

Utterances can be stored in two different places. 

* During **the authoring process**, utterances are created and stored in the Intent. Utterances in intents are required for a successful LUIS app. Once the app is published and receives queries at the endpoint, the endpoint request's querystring, `log=false`, determines if the endpoint utterance is stored. If the endpoint is stored, it becomes part of the active learning utterances found in the **Build** section of the portal, in the **Review endpoint utterances** section. 
* When you **review endpoint utterances**, and add an utterance to an intent, the utterance is no longer stored as part of the endpoint utterances to be reviewed. It is added to the app's intents. 

<a name="utterances-in-an-intent"></a>

### Delete example utterances from an intent

Delete example utterances used for training [LUIS](luis-reference-regions.md). If you delete an example utterance from your LUIS app, it is removed from the LUIS web service and is unavailable for export.

<a name="utterances-in-review"></a>

### Delete utterances in review from active learning

You can delete utterances from the list of user utterances that LUIS suggests in the **[Review endpoint utterances page](how-to/improve-application.md)**. Deleting utterances from this list prevents them from being suggested, but doesn't delete them from logs.

If you don't want active learning utterances, you can [disable active learning](how-to/improve-application.md). Disabling active learning also disables logging.

### Disable logging utterances
[Disabling active learning](how-to/improve-application.md) is disables logging.


<a name="accounts"></a>

## Delete an account
If you are not migrated, you can delete your account and all your apps will be deleted along with their example utterances and logs. The data is retained for 90 days before the account and data are deleted permanently.

Deleting account is available from the **Settings** page. Select your account name in the top right navigation bar to get to the **Settings** page.

## Delete an authoring resource
If you have [migrated to an authoring resource](./luis-migration-authoring.md), deleting the resource itself from the Azure portal will delete all your applications associated with that resource, along with their example utterances and logs. The data is retained for 90 days before it is deleted permanently.    

To delete your resource, go to the [Azure portal](https://portal.azure.com/#home) and select your LUIS authoring resource. Go to the **Overview** tab and select the **Delete** button on the top of the page. Then confirm your resource was deleted. 

## Data inactivity as an expired subscription
For the purposes of data retention and deletion, an inactive LUIS app may at _Microsoft’s discretion_ be treated as an expired subscription. An app is considered inactive if it meets the following criteria for the last 90 days: 

* Has had **no** calls made to it.
* Has not been modified.
* Does not have a current key assigned to it.
* Has not had a user sign in to it.

## Next steps

[Learn about exporting and deleting an app](how-to/sign-in.md)
