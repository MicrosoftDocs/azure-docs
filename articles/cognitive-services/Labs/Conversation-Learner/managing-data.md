---
title: Managing user data with Conversation Learner - Microsoft Cognitive Services | Microsoft Docs
titleSuffix: Azure
description: Learn how to manage user data with Conversation Learner.
services: cognitive-services
author: nitinme
manager: nolachar
ms.service: cognitive-services
ms.subservice: conversation-learner
ms.topic: article
ms.date: 04/30/2018
ms.author: nitinme
---

# Managing user data

This page describes what the Conversation Learner cloud service logs when conducting dialogs with end users.  It also describes how to associate Conversation Learner logs with user IDs, so that you can retrieve or delete all logs associated with a particular user.

## Overview of end-user data logging

By default, the Conversation Learner cloud service logs interactions between end users and your bot.  These logs are important for improving your bot, enabling you to identify cases where your bot extracted the incorrect entity or selected the incorrect action.  These errors can then be corrected by going to the "Log Dialogs" page of the UI, making corrections, and storing this corrected dialog as a new train dialog. For more information, see the tutorial on "Log Dialogs."

## How to disable logging

You can control whether conversations with end users are on the "Settings" page for your Conversation Learner model.  There is a checkbox for "Log Conversations."  By unchecking this box, conversations with end users will not be logged.

## What is logged 

In log dialogs, Conversation Learner stores the user input, entity values, selected actions, and timestamps for each turn.  These logs are stored for a period of time, and then discarded (see the help page on "Default value and boundaries" for details).  

Conversation Learner creates a unique ID for each logged dialog.  Conversation Learner does *not* store a user identifier with logged dialogs.  

## Associating logged dialogs with a user ID

It is often important to be able to associate logged dialogs with the ID of the user -- for example, to be able to retrieve or delete logged dialogs from a particular user.  Since Conversation Learner does not store a user identifier, this association needs to be maintained by the developer's code.  

To create this mapping, obtain the ID of the logged dialog in `EntityDetectionCallback`; then in your bot's storage, store the association between the user ID and this logged dialog.  

```
cl.EntityDetectionCallback(async (text: string, memoryManager: ClientMemoryManager): Promise<void> => {

    // Get user and session info
    var sessionData = memoryManager.SessionInfo();

    // sessionData.sessionId is the ID of this logged dialog.
    // In your bot-specific data store, store an association
    // between your user identifier and this session ID.
    console.log(sessionData.logDialogId)

    // sessionData.userId and sessionData.userName are the 
    // user ID and user name as defined by the channel the user
    // is on (eg, Skype, Teams, Facebook Messenger, etc.).
    // For some channels, this will be undefined.
    // This information is NOT stored with the logged dialog.
    console.log(sessionData.userId);
    console.log(sessionData.userName);

})
```

## Headers for HTTP calls

In each of the HTTP calls below, add the following header:

```
Ocp-Apim-Subscription-Key=<LUIS_AUTHORING_KEY>
```

where `<LUIS_AUTHORING_KEY>` is the LUIS authoring key used to access your Conversation Learner Applications.

## How to obtain raw data for a logged dialog

To obtain the raw data for a log dialog, you can use this HTTP call:

```
GET https://westus.api.cognitive.microsoft.com/conversationlearner/v1.0/app/<appId>/logdialog/<logDialogId>
```

Where `<appId>` is the GUID for this Conversation Learner model, and `<logDialgoId>` is the ID of the log dialog you want to retrieve.  

> [!NOTE]
> Log dialogs may be edited by the developer, and then stored as train dialogs.  When this is done, Conversation Learner stores the ID of the "source" log dialog with the train dialog.  Further, a train dialog can be "branched" in the UI; if a train dialog has an associated source log dialog ID, then branches from that train dialog will be marked with the same log dialog ID.

To obtain all train dialogs that were derived from a log dialog, follow these steps.

First, retrieve all train dialogs:

```
GET https://westus.api.cognitive.microsoft.com/conversationlearner/v1.0/app/<appId>/traindialogs
```

Where `<appId>` is the GUID for this Conversation Learner model.  

This returns all train dialogs.  Search this list for the associated `sourceLogDialogId`, and note the associated `trainDialogId`. 

To a single train dialog by ID:

```
GET https://westus.api.cognitive.microsoft.com/conversationlearner/v1.0/app/<appId>/traindialog/<trainDialogId>
```

Where `<appId>` is the GUID for this Conversation Learner model, and `<trainDialogId>` is the ID of the train dialog you want to retrieve.  

## How to delete a logged dialog

If you wish to delete a log dialog given its ID, you can use this HTTP call:

```
DELETE https://westus.api.cognitive.microsoft.com/conversationlearner/v1.0/app/<appId>/logdialog/<logDialogId>
```

Where `<appId>` is the GUID for this Conversation Learner model, and `<logDialogId>` is the ID of the log dialog you wish to delete. 

If you wish to delete a train dialog given its ID, you can use this HTTP call:

```
DELETE https://westus.api.cognitive.microsoft.com/conversationlearner/v1.0/app/<appId>/traindialog/<trainDialogId>
```

Where `<appId>` is the GUID for this Conversation Learner model, and `<trainDialogId>` is the ID of the train dialog you wish to delete. 
