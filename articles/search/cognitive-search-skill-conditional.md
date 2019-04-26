---
title: Conditional cognitive search skill (Azure Search) | Microsoft Docs
description: Conditional Skill that allows filtering, creating defaults, and merging values.
services: search
manager: pablocas
author: luiscabrer

ms.service: search
ms.devlang: NA
ms.workload: search
ms.topic: conceptual
ms.date: 05/01/2019
ms.author: luisca
---


#	Conditional Skill 

The **Conditional skill** enables a variety of scenarios that require a boolean operation to decide the data that should be assigned to an output. These scenarios include: filtering, assigning a default value and merging data based on a condition.

The following pseudocode explains what the Conditional Skill accomplishes:

```
if (condition) 
    { output = whenTrue } 
else 
    { output = whenFalse } 
```

> [!NOTE]
> This skill is not bound to a Cognitive Services API and you are not charged for using it. You should still [attach a Cognitive Services resource](cognitive-search-attach-cognitive-services.md), however, to override the **Free** resource option that limits you to a small number of daily enrichments per day.

## @odata.type  
Microsoft.Skills.Util.ConditionalSkill


## Evaluated Fields

Note that this skill is special because its inputs are actually evaluated fields.

The following are valid values of an expression:

1.	Annotation Paths (paths in expressions must be delimited by "$(" and ")") <br/>
    Examples:
    ```
        "= $(/document)"
        "= $(/document/content)"
    ```

2.  Literals (strings, numbers, true, false, null) <br/>
    Examples:
    ```
       "= 'this is a string'"   // string, note the single quotes
       "= 34"                   // number
       "= true"                 // boolean
       "= null"                 // null value
    ```

3.  Expressions that use a comparison operator (==, !=, >=, >, <=, <)
    Examples:
    ```
        "= $(/document/language) == 'en'"
        "= $(/document/sentiment) >= 0.5"
    ```

4.	Expressions that use boolean operators  (&&, ||, !, ^)
    Examples:
    ```
        "= $(/document/language) == 'en' && $(/document/sentiment) > 0.5"
        "= !true"
    ```

5.	Expressions that use a numeric operator (+, -, \*, /, %)
    Examples: 
    ```
        "= $(/document/sentiment) + 0.5"         // addition
        "= $(/document/totalValue) * 1.10"       // multiplication
        "= $(/document/lengthInMeters) / 0.3049" // division
    ```

Because of the evaluation supported, the Conditional Skill can be used for minor transformation scenarios. See sample [skill definition 4](#transformation-examples) for an example.

## Skill inputs
Inputs are case-sensitive.

| Inputs	  | Description |
|-------------|-------------|
| condition   | This is an [evaluated field](#evaluated-fields) that represents the condition to evaluate. This condition should evaluate to a boolean value (true or false).   <br/>  Examples: <br/> "= true" <br/> "= $(/document/language) =='fr'" <br/> "= $(/document/pages/\*/language) == $(/document/expectedLanguage)" <br/> |
| whenTrue    | This is an [evaluated field](#evaluated-fields). The value to return if the condition is evaluated to true. Constants strings should be returned in ' ' quotes. <br/>Sample values: <br/> "= 'contract'"<br/>"= $(/document/contractType)" <br/> "= $(/document/entities/\*)" <br/> |
| whenFalse   | This is an [evaluated field](#evaluated-fields). The value to return if the condition is evaluated to false.  <br/>Sample values: <br/> "= 'contract'"<br/>"= $(/document/contractType)" <br/> "= $(/document/entities/\*)" <br/>

## Skill outputs
There is a single ouput called 'output'. It will return the value of whenFalse if the condition is false, or whenTrue if the condition is true.

## Examples

###	Sample skill definition 1: Filtering documents to return only "French" documents

The following output will return an array of sentences ("/document/frenchSentences") if the language of the document is french. If the language is not french, that value will be set to null.

```json
{
    "@odata.type": "#Microsoft.Skills.Util.ConditionalSkill",
    "context": "/document",
    "inputs": [
        { "name": "condition", "source": "= $(/document/language) == 'fr'" },
        { "name": "whenTrue", "source": "/document/sentences" },
        { "name": "whenFalse", "source": "= null" }
    ],
    "outputs": [ { "name": "output", "targetName": "frenchSentences" } ]
}
```
Note that if "/document/frenchSentences" is used as the *context* of another skill, that skill will only run if "/document/frenchSentences" is not set to null


###	Sample skill definition 2: Setting a default value when it does not exist.

The following output will create an annotation ("/document/languageWithDefault") that is set to either the language of the document, or "es" if the language is not set.

```json
{
    "@odata.type": "#Microsoft.Skills.Util.ConditionalSkill",
    "context": "/document",
    "inputs": [
        { "name": "condition", "source": "= $(/document/language) == null" },
        { "name": "whenTrue", "source": "= 'es'" },
        { "name": "whenFalse", "source": "= $(/document/language)" }
    ],
    "outputs": [ { "name": "output", "targetName": "languageWithDefault" } ]
}
```

###	Sample skill definition 3: Merging values from 2 different fields into a single field

In this example some sentences have a *frenchSentiment* property. Whenever the *frenchSentiment* property is null, we would like to use the *englishSentiment* value. We assign the output to a member called simply *sentiment* ("/document/sentiment/*/sentiment").

```json
{
    "@odata.type": "#Microsoft.Skills.Util.ConditionalSkill",
    "context": "/document/sentences/*",
    "inputs": [
        { "name": "condition", "source": "= $(/document/sentences/*/frenchSentiment) == null" },
        { "name": "whenTrue", "source": "document/sentences/*/englishSentiment" },
        { "name": "whenFalse", "source": "document/sentences/*/frenchSentiment" }
    ],
    "outputs": [ { "name": "output", "targetName": "sentiment" } ]
}
```

## Transformation Examples
###	Sample skill definition 4: Performing data transformations on a single field

In this example we receive a sentiment between 0 and 1, and we would like to transform it so that it is between -1 and 1. This is a small math transformation that we could do using the Conditional Skill.

In this specific example, we never use the conditional aspect of the skill as the condition is always true. 

```json
{
    "@odata.type": "#Microsoft.Skills.Util.ConditionalSkill",
    "context": "/document/sentences/*",
    "inputs": [
        { "name": "condition", "source": "= true" },
        { "name": "whenTrue", "source": "= $(document/sentences/*/sentiment) * 2 - 1" },
        { "name": "whenFalse", "source": "= 0" }
    ],
    "outputs": [ { "name": "output", "targetName": "normalizedSentiment" } ]
}
```


## Special considerations
Please note that some of the parameters are evaluated, so you need to be especially careful following the documented pattern. Expressions must start with an equals sign "=" and paths must be delimited by "$(" and ")". Please make sure to put your strings in 'single quotes' as that will help the evaluator distinguish between strings and actual paths and operators. Also, make sure to put a whitespace around operators (for instance a * in a path has a different meaning than the multiplication operator).


## See also

+ [Predefined skills](cognitive-search-predefined-skills.md)
+ [How to define a skillset](cognitive-search-defining-skillset.md)
