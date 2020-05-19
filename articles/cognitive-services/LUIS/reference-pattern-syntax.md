---
title: Pattern syntax reference - LUIS
description: Create entities to extract key data from user utterances in Language Understanding (LUIS) apps. Extracted data is used by the client application.
ms.topic: reference
ms.date: 04/14/2020
ms.author: diberry
---

# Pattern syntax

Pattern syntax is a template for an utterance. The template should contain words and entities you want to match as well as words and [punctuation](luis-reference-application-settings.md#punctuation-normalization) you want to ignore. It is **not** a regular expression.

> [!CAUTION]
> Patterns only include machine-learning entity parents, not subentities.

Entities in patterns are surrounded by curly brackets, `{}`. Patterns can include entities, and entities with roles. [Pattern.any](luis-concept-entity-types.md#patternany-entity) is an entity only used in patterns.

Pattern syntax supports the following syntax:

|Function|Syntax|Nesting level|Example|
|--|--|--|--|
|entity| {} - curly brackets|2|Where is form {entity-name}?|
|optional|[] - square brackets<BR><BR>There is a limit of 3 on nesting levels of any combination of optional and grouping |2|The question mark is optional [?]|
|grouping|() - parentheses|2|is (a \| b)|
|or| \| - vertical bar (pipe)<br><br>There is a limit of 2 on the vertical bars (Or) in one group |-|Where is form ({form-name-short} &#x7c; {form-name-long} &#x7c; {form-number})|
|beginning and/or end of utterance|^ - caret|-|^begin the utterance<br>the utterance is done^<br>^strict literal match of entire utterance with {number} entity^|

## Nesting syntax in patterns

The **optional** syntax, with square brackets, can be nested two levels. For example: `[[this]is] a new form`. This example allows for the following utterances:

|Nested optional utterance example|Explanation|
|--|--|
|this is a new form|matches all words in pattern|
|is a new form|matches outer optional word and non-optional words in pattern|
|a new form|matches required words only|

The **grouping** syntax, with parentheses, can be nested two levels. For example: `(({Entity1.RoleName1} | {Entity1.RoleName2} ) | {Entity2} )`. This feature allows any of the three entities to be matched.

If Entity1 is a Location with roles such as origin (Seattle) and destination (Cairo) and Entity 2 is a known building name from a list entity (RedWest-C), the following utterances would map to this pattern:

|Nested grouping utterance example|Explanation|
|--|--|
|RedWest-C|matches outer grouping entity|
|Seattle|matches one of the inner grouping entities|
|Cairo|matches one of the inner grouping entities|

## Nesting limits for groups with optional syntax

A combination of **grouping** with **optional** syntax has a limit of 3 nesting levels.

|Allowed|Example|
|--|--|
|Yes|( [ ( test1 &#x7c; test2 ) ] &#x7c; test3 )|
|No|( [ ( [ test1 ] &#x7c; test2 ) ] &#x7c; test3 )|

## Nesting limits for groups with or-ing syntax

A combination of **grouping** with **or-ing** syntax has a limit of 2 vertical bars.

|Allowed|Example|
|--|--|
|Yes|( test1 &#x7c; test2 &#x7c; ( test3 &#x7c; test4 ) )|
|No|( test1 &#x7c; test2 &#x7c; test3 &#x7c; ( test4 &#x7c; test5 ) ) |

## Syntax to add an entity to a pattern template
To add an entity into the pattern template, surround the entity name with curly braces, such as `Who does {Employee} manage?`.

|Pattern with entity|
|--|
|`Who does {Employee} manage?`|

## Syntax to add an entity and role to a pattern template
An entity role is denoted as `{entity:role}` with the entity name followed by a colon, then the role name. To add an entity with a role into the pattern template, surround the entity name and role name with curly braces, such as `Book a ticket from {Location:Origin} to {Location:Destination}`.

|Pattern with entity roles|
|--|
|`Book a ticket from {Location:Origin} to {Location:Destination}`|

## Syntax to add a pattern.any to pattern template
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

The words of the book title are not confusing to LUIS because LUIS knows where the book title ends, based on the Pattern.any entity.

## Explicit lists

create an [Explicit List](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5ade550bd5b81c209ce2e5a8) through the authoring API to allow the exception when:

* Your pattern contains a [Pattern.any](luis-concept-entity-types.md#patternany-entity)
* And that pattern syntax allows for the possibility of an incorrect entity extraction based on the utterance.

For example, suppose you have a pattern containing both optional syntax, `[]`, and entity syntax, `{}`, combined in a way to extract data incorrectly.

Consider the pattern `[find] email about {subject} [from {person}]'.

In the following utterances, the **subject** and **person** entity are extracted correctly and incorrectly:

|Utterance|Entity|Correct extraction|
|--|--|:--:|
|email about dogs from Chris|subject=dogs<br>person=Chris|✔|
|email about the man from La Mancha|subject=the man<br>person=La Mancha|X|

In the preceding table, the subject should be `the man from La Mancha` (a book title) but because the subject includes the optional word `from`, the title is incorrectly predicted.

To fix this exception to the pattern, add `the man from la mancha` as an explicit list match for the {subject} entity using the [authoring API for explicit list](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5ade550bd5b81c209ce2e5a8).

## Syntax to mark optional text in a template utterance
Mark optional text in the utterance using the regular expression square bracket syntax, `[]`. The optional text can nest square brackets up to two brackets only.

|Pattern with optional text|Meaning|
|--|--|
|`[find] email about {subject} [from {person}]`|`find` and `from {person}` are optional|
|`Can you help me[?]|The punctuation mark is optional|

Punctuation marks (`?`, `!`, `.`) should be ignored and you need to ignore them using the square bracket syntax in patterns.

## Next steps

Learn more about patterns:

* [How to add patterns](luis-how-to-model-intent-pattern.md)
* [How to add pattern.any entity](luis-how-to-add-entities.md#add-a-patternany-entity)
* [Patterns Concepts](luis-concept-patterns.md)

Understand how [sentiment](luis-reference-prebuilt-sentiment.md) is returned in the .json response.