---
title: Understand LUIS app collaboration - Azure | Microsoft Docs
description: LUIS apps require a single owner and optional collaborators.
services: cognitive-services
author: v-geberr
manager: kamran.iqbal

ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 03/22/2018
ms.author: v-geberr
---
# Collaborating

LUIS provides collaboration to allow a group of people to author an app.

## LUIS account
A LUIS account is associated with a single [Microsoft Live](https://login.live.com/) account. Each LUIS account is given a free [authoring key](luis-concept-keys.md#authoring-key) to use for authoring all the LUIS apps the account has access to. 

A LUIS account may have many LUIS apps.

## LUIS app owner
The account that creates an app is the owner. Each app has a single owner. The owner is listed on app **[Settings](luis-how-to-collaborate.md)**. This is the account that can delete the app. This is also the account that receives email when the endpoint quota reaches 75%. 

## Transfer ownership
LUIS doesn't provide transfer of ownership, however any collaborator can export the app, and then create an app by importing it. Be aware the new app has a different App ID. The new app needs to be trained, published, and the new endpoint used.

## LUIS app collaborators
An app owner can add collaborators to an app. The owner needs to add the collaborator's email address on app **[Settings](luis-how-to-collaborate.md)**. The collaborator has full access to the app. If the collaborator deletes the app, the app is removed from the collaborator's account but remains in the owner's account. 

If you want to share multiple apps with collaborators, each app needs the collaborator's email added. 

## Next steps

See [App Settings](luis-how-to-collaborate.md) to learn how to manage collaborators in your LUIS app.

See [Add email to access list](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/58fcccdd5aca2f08a4104342) with the Authoring APIs.

[luis-reference-prebuilt-domains]:luis-reference-prebuilt-domains.md