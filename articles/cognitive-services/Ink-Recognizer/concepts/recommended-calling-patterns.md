---
title: Recommended calling patterns for the Ink Recognizer API
titlesuffix: Azure Cognitive Services
description: Learn about calling the Ink Analyzer API for different applications
services: cognitive-services
author: erhopf
manager: nitinme
ms.service: cognitive-services
ms.subservice: ink-recognizer
ms.topic: tutorial
ms.date: 06/06/2019
ms.author: erhopf
---

# Recommended API calling patterns 


You can call the Ink Recognizer REST API in different patterns according to different scenarios. 

## User initiated API calls

If you're building an app that takes user input (for example, a notetaking or annotation app), you probably want to give them control of when and which ink gets sent to the Ink Recognizer API. This is especially useful when text and shapes are both present on the canvas, and users want to perform different actions for each. Consider adding shape selection features (like a lasso or rectangle selection tool), that enable users to choose what gets sent to the API.  

## App initiated API calls

There’s another option that you can call the service based on timeout during user is creating inks. This could reduce user’s waiting time when he triggers the above features, as there will be network communication time and ink strokes processing time. 

For example, when user is writing down inks, you call the service after a certain timeout, get the recognized results back, and store them in local. Then user triggers searching feature, you don’t need to send all pages of ink strokes to the service and wait for results, so you can show search result more quickly in App. 

It’s a common habit that people have some pause during writing. So, the timeout can be set as an estimated average time which reflects user finishes writing one line or paragraph. Or else, you can also detect the writing position and call the service when the position has big change. 

Using App initiated pattern gives more possibility to selection functions. Besides lasso select and rectangle select, you can provide tap select as well. With the recognition results from the service in advance, you know the grouping logic of the ink stokes – which inks are grouped in a same word, shape, line, list item or paragraph. Then user can tap one ink stroke to select the whole group, which makes the selection more accurate and intelligent.  

For example, user can tap to select the ink strokes representing one word, and then convert them to that word. User can double tap to select the ink strokes representing one paragraph and left align the ink lines in this paragraph. 

With App initiated calling pattern, you can build your App in more scenarios beyond notetaking and annotation. If you’re building an enterprise App which requires user to fill in textboxes by handwriting, you can call the service automatically for user and show the recognized results to him to confirm, which makes user be aware of the final text and modify any unclear inks during his handwriting. 

## Next steps

* TBD