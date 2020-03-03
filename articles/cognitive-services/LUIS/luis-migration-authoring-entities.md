---
title: Migrate to V3 machine-learned entity
titleSuffix: Azure Cognitive Services
description: The V3 authoring provides one new entity type, the machine-learned entity, along with the ability to add relationships to the machine-learned entity and other entities or features of the application.
services: cognitive-services
author: diberry
manager: nitinme

ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: conceptual
ms.date: 12/30/2019
ms.author: diberry
---

# Migrate to V3 Authoring entity

The V3 authoring provides one new entity type, the machine-learned entity, along with the ability to add relationships to the machine-learned entity and other entities or features of the application.

## Entities are decomposable in V3

Entities created with the V3 authoring APIs, either using the [APIs](https://westeurope.dev.cognitive.microsoft.com/docs/services/luis-programmatic-apis-v3-0-preview) or with the [preview portal](https://preview.luis.ai/), allow you to build a layered entity model with a parent and children. The parent is known to as the **machine-learned entity** and the children are known as **subcomponents** of the machine learned entity.

Each subcomponent is also a machine-learned entity but with the added configuration options of constraints and descriptors.

* **Constraints** are exact text matching rules that guarantee an entity is extracted when it matches a rule. The rule is defined by an exact text matching entity, currently: a [prebuilt entity](luis-reference-prebuilt-entities.md), a [regular expression entity](reference-entity-regular-expression.md), or [list entity](reference-entity-list.md).
* **Descriptors** are [features](luis-concept-feature.md), such as phrase lists or entities, that are used to strongly indicate the entity.

The V3 authoring provides one new entity type, the machine-learned entity, along with the ability to add relationships to the machine-learned entity and other entities or features of the application.

## How do these new relationships compare to V2 authoring

V2 authoring provided hierarchical and composite entities along with roles and features to accomplish this same task. Because the entities, features, and roles were not explicitly related to each other, it was difficult to understand how LUIS implied the relationships during prediction.

With V3, the relationship is explicit and designed by the app authors. This allows you, as the app author, to:

* Visually see how LUIS is predicting these relationships, in the example utterances
* Test for these relationships either with the [interactive test pane](luis-interactive-test.md) or at the endpoint
* Use these relationships in the client application, via a well-structured, named, nested [.json object](reference-entity-machine-learned-entity.md)

## Planning

When you migrate, consider the following in your migration plan:

* Back up your LUIS app, and perform the migration on a separate app. Having a V2 and V3 app available at the same time allows you to validate the changes required and the impact on the prediction results.
* Capture current prediction success metrics
* Capture current dashboard information as a snapshot of app status
* Review existing intents, entities, phrase lists, patterns, and batch tests
* The following elements can be migrated **without change**:
    * Intents
    * Entities
        * Regular expression entity
        * List entity
    * Features
        * Phrase list
* The following elements need to be migrated **with changes**:
    * Entities
        * Hierarchical entity
        * Composite entity
    * Roles - roles can only be applied to a machine-learned (parent) entity. Roles can't be applied to subcomponents
    * Batch tests and patterns that use the hierarchical and composite entities

When you design your migration plan, leave time to review the final machine-learned entities, after all hierarchical and composite entities have been migrated. While a straight migration will work, after you make the change and review your batch test results, and prediction JSON, the more unified JSON may lead you to make changes so the final information delivered to the client-side app is organized differently. This is similar to code refactoring and should be treated with the same review process your organization has in place.

If you don't have batch tests in place for your V2 model, and migrate the batch tests to the V3 model as part of the migration, you won't be able to validate how the migration will impact the endpoint prediction results.

## Migrating from V2 entities

As you begin to move to the V3 authoring model, you should consider how to move to the machine-learned entity, and its subcomponents including the constraints and descriptors.

The following table notes which entities need to migrate from a V2 to a V3 entity design.

|V2 authoring entity type|V3 authoring entity type|Example|
|--|--|--|
|Composite entity|Machine learned entity|[learn more](#migrate-v2-composite-entity)|
|Hierarchical entity|Machine-learned entity's role|[learn more](#migrate-v2-hierarchical-entity)|

## Migrate V2 Composite entity

Each child of the V2 composite should be represented with a subcomponent of the V3 machine-learned entity. If the composite child is a prebuilt, regular expression, or a list entity, this should be applied as a **constraint** on the subcomponent representing the child.

Considerations when planning to migrate a composite entity to a machine-learned entity:
* Child entities can't be used in patterns
* Child entities are no longer shared
* Child entities need to be labeled if they used to be non-machine-learned

### Existing descriptors

Any phrase list used to boost words in the composite entity should be applied as a descriptor to either the machine-learned (parent) entity, the subcomponent (child) entity, or the intent (if the phrase list only applies to one intent). Plan to add the descriptor to the entity it should boost most significantly. Do not add the descriptor generically to the machine-learned (parent) entity, if it will most significantly boost the prediction of a subcomponent (child).

### New descriptors

In V3 authoring, add a planning step to evaluate entities as possible descriptors for all the entities and intents.

### Example entity

This entity is an example only. Your own entity migration may require other considerations.

Consider a V2 composite for modifying a pizza `order` that uses:
* prebuilt datetimeV2 for delivery time
* phrase list to boost certain words such as pizza, pie, crust, and topping
* list entity to detect toppings such as mushrooms, olives, pepperoni.

An example utterance for this entity is:

`Change the toppings on my pie to mushrooms and delivery it 30 minutes later`

The following table demonstrates the migration:

|V2 models|V3 models|
|--|--|
|Parent - Component entity named `Order`|Parent - Machine-learned entity named `Order`|
|Child - Prebuilt datetimeV2|* Migrate prebuilt entity to new app.<br>* Add Constraint on parent for prebuilt datetimeV2.|
|Child - list entity for toppings|* Migrate list entity to new app.<br>* Then add a constraint on the parent for the list entity.|


## Migrate V2 Hierarchical entity

In V2 authoring, a hierarchical entity was provided before roles existing in LUIS. Both served the same purpose of extracting entities based on context usage. If you have hierarchical entities, you can think of them as simple entities with roles.

In V3 authoring:
* A role can be applied on the machine-learned (parent) entity.
* A role can't be applied to any subcomponents.

This entity is an example only. Your own entity migration may require other considerations.

Consider a V2 hierarchical entity for modifying a pizza `order`:
* where each child determines either an original topping or the final topping

An example utterance for this entity is:

`Change the topping from mushrooms to olives`

The following table demonstrates the migration:

|V2 models|V3 models|
|--|--|
|Parent - Component entity named `Order`|Parent - Machine-learned entity named `Order`|
|Child - Hierarchical entity with original and final pizza topping|* Add role to `Order` for each topping.|

## Next steps

* [Developer resources](developer-reference-resource.md)
