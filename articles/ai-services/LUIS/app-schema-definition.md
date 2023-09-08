---
title: App schema definition
description: The LUIS app is represented in either the `.json` or `.lu` and includes all intents, entities, example utterances, features, and settings.
ms.service: cognitive-services
ms.subservice: language-understanding
ms.author: aahi
author: aahill
manager: nitinme
ms.topic: reference
ms.date: 08/22/2020
---

# App schema definition

[!INCLUDE [deprecation notice](./includes/deprecation-notice.md)]


The LUIS app is represented in either the `.json` or `.lu` and includes all intents, entities, example utterances, features, and settings.

## Format

When you import and export the app, choose either `.json` or `.lu`.

|Format|Information|
|--|--|
|`.json`| Standard programming format|
|`.lu`|Supported by the Bot Framework's [Bot Builder tools](https://github.com/microsoft/botbuilder-tools/blob/master/packages/Ludown/docs/lu-file-format.md).|

## Version 7.x

* Moving to version 7.x, the entities are represented as nested machine-learning entities.
* Support for authoring nested machine-learning entities with `enableNestedChildren` property on the following authoring APIs:
    * [Add label](https://westus.dev.cognitive.microsoft.com/docs/services/luis-programmatic-apis-v3-0-preview/operations/5890b47c39e2bb052c5b9c08)
    * [Add batch label](https://westus.dev.cognitive.microsoft.com/docs/services/luis-programmatic-apis-v3-0-preview/operations/5890b47c39e2bb052c5b9c09)
    * [Review labels](https://westus.dev.cognitive.microsoft.com/docs/services/luis-programmatic-apis-v3-0-preview/operations/5890b47c39e2bb052c5b9c0a)
    * [Suggest endpoint queries for entities](https://westus.dev.cognitive.microsoft.com/docs/services/luis-programmatic-apis-v3-0-preview/operations/5890b47c39e2bb052c5b9c2e)
    * [Suggest endpoint queries for intents](https://westus.dev.cognitive.microsoft.com/docs/services/luis-programmatic-apis-v3-0-preview/operations/5890b47c39e2bb052c5b9c2d)

```json
{
  "luis_schema_version": "7.0.0",
  "intents": [
    {
      "name": "None",
      "features": []
    }
  ],
  "entities": [],
  "hierarchicals": [],
  "composites": [],
  "closedLists": [],
  "prebuiltEntities": [],
  "utterances": [],
  "versionId": "0.1",
  "name": "example-app",
  "desc": "",
  "culture": "en-us",
  "tokenizerVersion": "1.0.0",
  "patternAnyEntities": [],
  "regex_entities": [],
  "phraselists": [
  ],
  "regex_features": [],
  "patterns": [],
  "settings": []
}
```

| element                  | Comment                              |
|--------------------------|--------------------------------------|
| "hierarchicals": [],     | Deprecated, use [machine-learning entities](concepts/entities.md).   |
| "composites": [],        | Deprecated, use [machine-learning entities](concepts/entities.md). [Composite entity](./reference-entity-machine-learned-entity.md) reference. |
| "closedLists": [],       | [List entities](reference-entity-list.md) reference, primarily used as features to entities.    |
| "versionId": "0.1",      | Version of a LUIS app.|
| "name": "example-app",   | Name of the LUIS app. |
| "desc": "",              | Optional description of the LUIS app.  |
| "culture": "en-us",      | [Language](luis-language-support.md) of the app, impacts underlying features such as prebuilt entities, machine-learning, and tokenizer.  |
| "tokenizerVersion": "1.0.0", | [Tokenizer](luis-language-support.md#tokenization)  |
| "patternAnyEntities": [],   | [Pattern.any entity](reference-entity-pattern-any.md)    |
| "regex_entities": [],    |  [Regular expression entity](reference-entity-regular-expression.md)   |
| "phraselists": [],       |  [Phrase lists (feature)](concepts/patterns-features.md#create-a-phrase-list-for-a-concept)   |
| "regex_features": [],    |  Deprecated, use [machine-learning entities](concepts/entities.md). |
| "patterns": [],          |  [Patterns improve prediction accuracy](concepts/patterns-features.md) with [pattern syntax](reference-pattern-syntax.md)   |
| "settings": []           | [App settings](luis-reference-application-settings.md)|

## Version 6.x

* Moving to version 6.x, use the new [machine-learning entity](reference-entity-machine-learned-entity.md) to represent your entities.

```json
{
  "luis_schema_version": "6.0.0",
  "intents": [
    {
      "name": "None",
      "features": []
    }
  ],
  "entities": [],
  "hierarchicals": [],
  "composites": [],
  "closedLists": [],
  "prebuiltEntities": [],
  "utterances": [],
  "versionId": "0.1",
  "name": "example-app",
  "desc": "",
  "culture": "en-us",
  "tokenizerVersion": "1.0.0",
  "patternAnyEntities": [],
  "regex_entities": [],
  "phraselists": [],
  "regex_features": [],
  "patterns": [],
  "settings": []
}
```

## Version 4.x

```json
{
  "luis_schema_version": "4.0.0",
  "versionId": "0.1",
  "name": "example-app",
  "desc": "",
  "culture": "en-us",
  "tokenizerVersion": "1.0.0",
  "intents": [
    {
      "name": "None"
    }
  ],
  "entities": [],
  "composites": [],
  "closedLists": [],
  "patternAnyEntities": [],
  "regex_entities": [],
  "prebuiltEntities": [],
  "model_features": [],
  "regex_features": [],
  "patterns": [],
  "utterances": [],
  "settings": []
}
```

## Next steps

* Migrate to the [V3 authoring APIs](luis-migration-authoring-entities.md)
