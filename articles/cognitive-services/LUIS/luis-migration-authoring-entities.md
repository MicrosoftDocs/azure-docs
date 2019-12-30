---
title:
titleSuffix: Azure Cognitive Services
description:
services: cognitive-services
author: diberry
manager: nitinme

ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: conceptual
ms.date:
ms.author: diberry
---

# Migrate to V3 Authoring entity

The V3 authoring provides one new entity type, the machine-learned entity, along with the ability to add relationships to the machine-learned entity and other entities or features of the application.

## Entities are decomposable in V3

Entities created with the V3 authoring APIs, either using the APIs or with the preview portal, allow you to build a layered entity model with a parent and children. The parent is known to as the **machine-learned entity** and the children are known as **subcomponents** of the machine learned entity.

Each subcomponent is also a machine-learned entity but with the added configuration options of constraints and descriptors.

* **Constraints** are exact text matching rules that help the entity identify and extract data. The current constraints are the prebuilt, regular expression, and list entity types.
* **Descriptors** are phrase lists or entities that are used to strongly indicate the entity.

The V3 authoring provides one new entity type, the machine-learned entity, along with the ability to add relationships to the machine-learned entity and other entities or features of the application.

## How do these new relationships compare to V2 authoring

V2 authoring provided hierarchical and composite entities along with roles and features to accomplish this same task. Because the entities, features, and roles were not explicitly related to each other, it was difficult to understand how LUIS implied the relationships.

With V3, the relationship is explicit and designed by the app authors. This allows you, as the app author, to:

* Visually see how LUIS is predicting these relationships, in the example utterances
* Test for these relationships either with the interactive test pane or at the endpoint
* Use these relationships in the client application, via a well-structured, named, nested .json object

## Migrating from V2 entities

As you begin to move to the V3 authoring model, you should consider how to move to the machine-learned entity, its subcomponents including the constraints and descriptors.

The following show three examples of moving from a V2 to a V3 entity design.

|V2 authoring entity type|V3 authoring entity type|
|--|--|
|||

## Next steps
