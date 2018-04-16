---
title: Understand data storage in LUIS - Azure | Microsoft Docs
description: Learn how data is stored in Language Understanding (LUIS)
services: cognitive-services
author: v-geberr
manager: kaiqb

ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 03/16/2018
ms.author: v-geberr;
---

# Data storage and removal
LUIS stores data encrypted in an Azure data store corresponding to the region specified by the key. This data is stored for 30 days. 

## Export and delete app
Users have full control over [exporting](create-new-app.md#export-app) and [deleting](create-new-app.md#delete-app) the app. 

## Utterances in an intent
Delete example utterances used for training [LUIS][LUIS]. If you delete an example utterance from your LUIS app, it is removed from the LUIS web service and is unavailable for export.

## Utterances in review
You can delete utterances from the list of user utterances that LUIS suggests in the **[Review endpoint utterances page](label-suggested-utterances.md)**. Deleting utterances from this list prevents them from being suggested, but doesn't delete them from logs.

## Accounts
If you delete an account, all apps are deleted, along with their example utterances and logs. The data is retained for 60 days before the account and data are deleted permanently.

Deleting account is available from the **Settings** page. Select your account name in the top right navigation bar to get to the **Settings** page.

## Next steps

> [!div class="nextstepaction"]
> [Learn about exporting and deleting an app](create-new-app.md)

[LUIS]:luis-reference-regions.md