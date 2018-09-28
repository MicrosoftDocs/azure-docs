---
title: Learn how Patterns increase prediction accuracy
titleSuffix: Azure Cognitive Services
description: Patterns are designed to improve accuracy when several utterances are very similar. A pattern allows you to gain more accuracy for an intent without providing many more utterances.
services: cognitive-services
author: diberry
manager: cgronlun

ms.service: cognitive-services
ms.component: language-understanding
ms.topic: article
ms.date: 09/10/2018
ms.author: diberry
---
# Patterns improve prediction accuracy
Patterns are designed to improve accuracy when several utterances are very similar.  A pattern allows you to gain more accuracy for an intent without providing many more utterances. 

## Patterns solve low intent confidence
Consider a Human Resources app that reports on the organizational chart in relation to an employee. Given an employee's name and relationship, LUIS returns the employees involved. Consider an employee, Tom, with a manager name Alice, and a team of subordinates named: Michael, Rebecca, and Carl.

![Image of Organization chart](./media/luis-concept-patterns/org-chart.png)

|Utterances|Intent predicted|Intent score|
|--|--|--|
|Who is Tom's subordinate?|GetOrgChart|.30|
|Who is the subordinate of Tom?|GetOrgChart|.30|

If an app has between 10 and 20 utterances with different lengths of sentence, different word order, and even different words (synonyms of "subordinate", "manage", "report"), LUIS may return a low confidence score. In order to help LUIS understand the importance of the word order, create a pattern. 

Patterns solve the following situations: 

* When the intent score is low
* When the correct intent is not the top score but too close to the top score. 

## Patterns are not a guarantee of intent
Patterns use a mix of prediction technologies. Setting an intent for a template utterance in a pattern is not a guarantee of the intent prediction but it is a strong signal. 

## Patterns do not improve entity detection
While patterns require entities, a pattern does not help detect the entity. A pattern is only meant to help the prediction with intents and roles.  

## Patterns use entity roles
If two or more entities in a pattern are contextually related, patterns use entity [roles](luis-concept-roles.md) to extract contextual information about entities. This is equivalent to hierarchical entity children, but is **only** available in patterns. 

## Prediction scores with and without patterns
Given enough example utterances, LUIS would be able to increase prediction confidence without patterns. Patterns increase the confidence score without having to provide as many utterances.  

## Pattern matching
A pattern is matched based on detecting the entities inside the pattern first, then validating the rest of the words and word order of the pattern. Entities are required in the pattern for a pattern to match. 

## Pattern syntax
Pattern syntax is a template for an utterance. The template should contain words and entities you want to match as well as words and punctuation you want to ignore. It is **not** a regular expression. 

Entities in patterns are surrounded by curly brackets, `{}`. Patterns can include entities, and entities with roles. Pattern.any is an entity only used in patterns. The syntax is explained in the following sections.

### Syntax to add an entity to a pattern template
To add an entity into the pattern template, surround the entity name with curly braces, such as `Who does {Employee} manage?`. 

|Pattern with entity|
|--|
|`Who does {Employee} manage?`|

### Syntax to add an entity and role to a pattern template
An entity role is denoted as `{entity:role}` with the entity name followed by a colon, then the role name. To add an entity with a role into the pattern template, surround the entity name and role name with curly braces, such as `Book a ticket from {Location:Origin} to {Location:Destination}`. 

|Pattern with entity roles|
|--|
|`Book a ticket from {Location:Origin} to {Location:Destination}`|

### Syntax to add a pattern.any to pattern template
The Pattern.any entity allows you to add an entity of varying length to the pattern. As long as the pattern template is followed, the pattern.any can be any length. 

To add a **Pattern.any** entity into the pattern template, surround the Pattern.any entity with the curly braces, such as `How much does {Booktitle} cost and what format is it available in?`.  

|Pattern with Pattern.any entity|
|--|
|`How much does {Booktitle} cost and what format is it available in?`|

|Book titles in the pattern|
|--|
|How much does **steal this book** cost and what format is it available in?|
|How much does **ask** cost and what format is it available in?|
|How much does **The Curious Incident of the Dog in the Night-Time** cost and what format is it available in?| 

In these book title examples, the contextual words of the book title are not confusing to LUIS. LUIS knows where the book title ends because it is in a pattern and marked with a Pattern.any entity.

### Explicit lists
If your pattern contains a Pattern.any, and the pattern syntax allows for the possibility of an incorrect entity extraction based on the utterance, create an [Explicit List](https://aka.ms/ExplicitList) through the authoring API to allow the exception. 

For example, suppose you have a pattern containing both optional syntax, `[]`, and entity syntax, `{}`, combined in a way to extract data incorrectly.

Consider the pattern `[find] email about {subject} [from {person}]'. In the following utterances, the **subject** and **person** entity are extracted correctly and incorrectly:

|Utterance|Entity|Correct extraction|
|--|--|:--:|
|email about dogs from Chris|subject=dogs<br>person=Chris|✔|
|email about the man from La Mancha|subject=the man<br>person=La Mancha|X|

In the preceding table, the utterance `email about the man from La Mancha`, the subject should be `the man from La Mancha` (a book title) but because the subject includes the optional word `from`, the title is incorrectly predicted. 

To fix this exception to the pattern, add `the man from la mancha` as an explicit list match for the {subject} entity using the [authoring API for explicit list](https://aka.ms/ExplicitList).

### Syntax to mark optional text in a template utterance
Mark optional text in the utterance using the regular expression square bracket syntax, `[]`. The optional text can nest square brackets up to two brackets only.

|Pattern with optional text|
|--|
|`[find] email about {subject} [from {person}]`|

Punctuation marks such as `.`, `!`, and `?` can be ignored using the square brackets. In order to ignore these marks, each mark must be in a separate pattern. The optional syntax doesn't currently support ignoring an item in a list of several items.

## Patterns only
LUIS allows an app without any example utterances in intent. This usage is allowed only if patterns are used. Patterns require at least one entity in each pattern. For a pattern-only app, the pattern should not contain machine-learned entities because these do require example utterances. 

## Best practices
Learn [best practices](luis-concept-best-practices.md).

## Next steps

> [!div class="nextstepaction"]
> [Learn how to implement patterns in this tutorial](luis-tutorial-pattern.md)