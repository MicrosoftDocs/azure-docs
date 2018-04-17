---
title: Add pattern templates in LUIS apps | Microsoft Docs
titleSuffix: Azure
description: Learn how to add pattern templates in Language Understanding (LUIS) applications to improve prediction accuracy.
services: cognitive-services
author: v-geberr
manager: kaiqb 

ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 05/07/2018
ms.author: v-geberr;
---

# How to add Patterns to improve prediction accuracy
After a LUIS receives endpoint utterances, use Patterns to improve prediction accuracy for utterances that reveal a pattern in word order. 

## Add pattern template
1. Open your app by selecting its name on **My Apps** page, and then select **Intents** in the left panel. 

2. On the **Intents** page, select **Patterns**.

    ![Screenshot of Patterns List](./media/luis-how-to-model-intent-pattern/patterns-1.png)

3. In the template textbox, type the utterance template and select Enter.

    ![Screenshot of Add pattern template](./media/luis-how-to-model-intent-pattern/patterns-2.png)

## Search patterns
Searching allows you to find patterns that contain text.  

Type the search text in the search box at the top right corner of the patterns list and select Enter. The patterns list is updated to display only the patterns including your search text. 

To cancel the search and restore your full list of patterns, delete the search text you've typed.

## Edit a pattern
To edit a pattern, select the three dots (...) icon at the right end of the line for that pattern then select **Edit**. 

![Screenshot of Edit pattern](./media/luis-how-to-model-intent-pattern/patterns-three-dots.png) 

## Delete a pattern
To delete a pattern, select the three dots (...) icon at the right end of the line for that pattern then select **Delete**. 

![Screenshot of Delete utterance](./media/luis-how-to-model-intent-pattern/patterns-three-dots-ddl.png)

## Add entity to a pattern template
To add an entity into the pattern template, surround the entity name with curly braces, such as "Who does **{Employee}** manage?". 

## Add entity role to a pattern template
To add an entity role into the pattern template, surround the entity role name with curly braces, such as "Book a ticket from **{Location.Origin}** to **{Location.Destination}**". 

## Add Pattern.any to pattern template
To add a Pattern.any entity into the pattern template, surround the Pattern.any with the curly braces, such as "How much does **{Booktitle}** cost and what format is it available in?"
