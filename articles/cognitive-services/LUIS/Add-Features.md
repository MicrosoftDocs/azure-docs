---
title: Add features in LUIS applications | Microsoft Docs
description: Use Language Understanding Intelligent Services (LUIS) to add app features that can improve the detection or prediction of intents and entities.
services: cognitive-services
author: cahann
manager: hsalama

ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 03/01/2017
ms.author: cahann
---

# Add Features

Features help you improve the detection or prediction of intents and entities in utterances. For example, when your app fails to identify an entity, adding a “phrase list” feature with some or all of the entity’s potential values will improve the detection of this entity. Also, adding a “pattern” feature helps your application easily recognize regular patterns that are frequently used in your application's domain, such as the pattern of flight numbers in a travel app or product codes in a shopping app. 


## Phrase list features
You can create a “phrase list” including a group of values (words or phrases) that belong to the same class and must be treated similarly (e.g. names of cities or products), so that what LUIS learns about one of them will be automatically applied to the others as well. For example in the TravelAgent app, London, Paris, Cairo, etc. can be values of a phrase list named as “Cities”. If you label one of these values as an entity, others will mostly be predicted the same. 

LUIS may be unable to recognize rare and proprietary words, as well as foreign words (out of the culture of the app), and therefore they should be added to a phrase list feature. 

**To add a phrase list:**

1. Open your app by clicking its name on **My Apps** page, and then click **Features** in your app's left panel. 
2. On the **Features** page, click **Add phrase list**. 
 
    ![Features page - Phrase List Features tab](./Images/Features.JPG)
3. In the **Add Phrase List** dialog box, type "Cities" as the name of the phrase list in the **Phrase list name** text box.
4. In **Phrase list values**, type the values you want to include in the phrase list, separated by **commas** (e.g. London, Paris, Seattle, Berlin, Dubai, Cairo)  

    ![Add phrase list dialog box](./Images/Features-AddPhraseList.JPG)
5. Click **Is exchangeable**if the added phrase list values are alternatives that can be used interchangeably.
6. Click **Is active** if you want this phrase list to be active (i.e. applicable and used) in your app.
7. Click **Save**. The phrase list will be added to phrase list features on the **Features** page. 

**To edit a phrase list:**

* Click the phrase list name in the list of phrase list features. In the **Edit Phrase List** dialog box that opens, make the required editing changes and then click **Save**.

    ![Edit Phrase List dialog box](./Images/Features-EditPhraseList.JPG)

**To delete a phrase list:** 

* Click the trash bin icon ![Trash bin button](./Images/trashbin-button.JPG) next to the phrase list name in the list of phrase list features.

## Pattern features
You can create a structured “pattern” to represent a certain class of objects (e.g. flight numbers, product codes, etc.). A pattern is defined in regular expression (Regex). This will help LUIS easily recognize the string of the defined pattern in utterances, and thus classify it correctly. For example, in a travel app, flight numbers might follow a regular pattern of two letters followed by three digits. 


**To add a pattern:**

1. Open your app by clicking its name on **My Apps** page, and then click **Features** in your app's left panel. 
2. On the **Features** page, click the **Pattern Features** tab, and then click **Add Pattern Feature**.

    ![Features page - Pattern Features tab](./Images/Features-patternTab.JPG)
3. In the **Add Pattern** dialog box, type "Flight number" in the **Pattern name** text box.
4.  To learn about the supported regex syntax, click **learn about supported regex syntax** to expand the dialog and display it, as in the screen below. To collapse the dialog and hide syntax, click it again.

    ![The supported regex syntax](./Images/Features-Pattern-RegexSyntax.JPG)
5. In the **Pattern value** text box, type [A-Za-z]{2}[0-9]{3} as the value of the flight number pattern.

    ![Add pattern feature](./Images/Features-AddPattern.JPG)
6. Click **Is active** if you want this pattern to be active (i.e. applicable and used) in your app. A feature is active by default.
7. Click **Save**. The pattern will be added to pattern features on the **Features** page.

**To edit a pattern:**

* Click the pattern name in the list of pattern features. In the **Edit Pattern** dialog box that opens, make the required editing changes and then click **Save**.

    ![Edit Pattern dialog box](./Images/Features-EditPattern.JPG)

**To delete a pattern:** 

* Click the trash icon button ![Trash bin button](./Images/trashbin-button.JPG) next to the pattern name in the list of pattern features.
