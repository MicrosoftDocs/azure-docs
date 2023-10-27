---
title: Conditional cognitive skill
titleSuffix: Azure AI Search
description: The conditional skill in Azure AI Search enables filtering, creating defaults, and merging values in a skillset definition.
author: LiamCavanagh
ms.author: liamca
ms.service: cognitive-search
ms.topic: reference
ms.date: 08/12/2021
---

# Conditional cognitive skill

The **Conditional** skill enables Azure AI Search scenarios that require a Boolean operation to determine the data to assign to an output. These scenarios include filtering, assigning a default value, and merging data based on a condition.

The following pseudocode demonstrates what the conditional skill accomplishes:

```
if (condition) 
    { output = whenTrue } 
else 
    { output = whenFalse } 
```

> [!NOTE]
> This skill isn't bound to Azure AI services. It is non-billable and has no Azure AI services key requirement.

## @odata.type  
Microsoft.Skills.Util.ConditionalSkill


## Evaluated fields

This skill is special because its inputs are evaluated fields.

The following items are valid values of an expression:

-	Annotation paths (paths in expressions must be delimited by "$(" and ")")
 <br/>
    Examples:
    ```
        "= $(/document)"
        "= $(/document/content)"
    ```

-  Literals (strings, numbers, true, false, null) <br/>
    Examples:
    ```
       "= 'this is a string'"   // string (note the single quotation marks)
       "= 34"                   // number
       "= true"                 // Boolean
       "= null"                 // null value
    ```

-  Expressions that use comparison operators (==, !=, >=, >, <=, <) <br/>
    Examples:
    ```
        "= $(/document/language) == 'en'"
        "= $(/document/sentiment) >= 0.5"
    ```

-	Expressions that use Boolean operators  (&&, ||, !, ^) <br/>
    Examples:
    ```
        "= $(/document/language) == 'en' && $(/document/sentiment) > 0.5"
        "= !true"
    ```

-	Expressions that use numeric operators (+, -, \*, /, %) <br/>
    Examples: 
    ```
        "= $(/document/sentiment) + 0.5"         // addition
        "= $(/document/totalValue) * 1.10"       // multiplication
        "= $(/document/lengthInMeters) / 0.3049" // division
    ```

Because the conditional skill supports evaluation, you can use it in minor-transformation scenarios. For example, see [skill definition 4](#transformation-example).

## Skill inputs
Inputs are case-sensitive.

| Input	  | Description |
|-------------|-------------|
| condition   | This input is an [evaluated field](#evaluated-fields) that represents the condition to evaluate. This condition should evaluate to a Boolean value (*true* or *false*).   <br/>  Examples: <br/> "= true" <br/> "= $(/document/language) =='fr'" <br/> "= $(/document/pages/\*/language) == $(/document/expectedLanguage)" <br/> |
| whenTrue    | This input is an [evaluated field](#evaluated-fields) that represents the value to return if the condition is evaluated to *true*. Constants strings should be returned in single quotation marks (' and '). <br/>Sample values: <br/> "= 'contract'"<br/>"= $(/document/contractType)" <br/> "= $(/document/entities/\*)" <br/> |
| whenFalse   | This input is an [evaluated field](#evaluated-fields) that represents the value to return if the condition is evaluated to *false*. <br/>Sample values: <br/> "= 'contract'"<br/>"= $(/document/contractType)" <br/> "= $(/document/entities/\*)" <br/>

## Skill outputs
There's a single output that's simply called "output." It returns the value *whenFalse* if the condition is false or *whenTrue* if the condition is true.

## Examples

###	Sample skill definition 1: Filter documents to return only French documents

The following output returns an array of sentences ("/document/frenchSentences") if the language of the document is French. If the language isn't French, the value is set to *null*.

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
If "/document/frenchSentences" is used as the *context* of another skill, that skill only runs if "/document/frenchSentences" isn't set to *null*.


###	Sample skill definition 2: Set a default value for a value that doesn't exist

The following output creates an annotation ("/document/languageWithDefault") that's set to the language of the document or to "es" if the language isn't set.

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

###	Sample skill definition 3: Merge values from two fields into one

In this example, some sentences have a *frenchSentiment* property. Whenever the *frenchSentiment* property is null, we want to use the *englishSentiment* value. We assign the output to a member that's called *sentiment* ("/document/sentences/*/sentiment").

```json
{
    "@odata.type": "#Microsoft.Skills.Util.ConditionalSkill",
    "context": "/document/sentences/*",
    "inputs": [
        { "name": "condition", "source": "= $(/document/sentences/*/frenchSentiment) == null" },
        { "name": "whenTrue", "source": "/document/sentences/*/englishSentiment" },
        { "name": "whenFalse", "source": "/document/sentences/*/frenchSentiment" }
    ],
    "outputs": [ { "name": "output", "targetName": "sentiment" } ]
}
```

## Transformation example
###	Sample skill definition 4: Data transformation on a single field

In this example, we receive a *sentiment* that's between 0 and 1. We want to transform it to be between -1 and 1. We can use the conditional skill to do this minor transformation.

In this example, we don't use the conditional aspect of the skill because the condition is always *true*.

```json
{
    "@odata.type": "#Microsoft.Skills.Util.ConditionalSkill",
    "context": "/document/sentences/*",
    "inputs": [
        { "name": "condition", "source": "= true" },
        { "name": "whenTrue", "source": "= $(/document/sentences/*/sentiment) * 2 - 1" },
        { "name": "whenFalse", "source": "= 0" }
    ],
    "outputs": [ { "name": "output", "targetName": "normalizedSentiment" } ]
}
```

## Special considerations
Some parameters are evaluated, so you need to be especially careful to follow the documented pattern. Expressions must start with an equals sign. A path must be delimited by "$(" and ")". Make sure to put strings in single quotation marks. That helps the evaluator distinguish between strings and actual paths and operators. Also, make sure to put white space around operators (for instance, a "*" in a path means something different than multiply).


## Next steps

+ [Built-in skills](cognitive-search-predefined-skills.md)
+ [How to define a skillset](cognitive-search-defining-skillset.md)
