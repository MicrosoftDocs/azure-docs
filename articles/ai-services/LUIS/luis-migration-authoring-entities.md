---
title: Migrate to V3 machine-learning entity
description: The V3 authoring provides one new entity type, the machine-learning entity, along with the ability to add relationships to the machine-learning entity and other entities or features of the application.
ms.service: cognitive-services
ms.subservice: language-understanding
ms.author: aahi
author: aahill
manager: nitinme
ms.topic: how-to
ms.date: 05/28/2021
---

# Migrate to V3 Authoring entity

[!INCLUDE [deprecation notice](./includes/deprecation-notice.md)]


The V3 authoring provides one new entity type, the machine-learning entity, along with the ability to add relationships to the machine-learning entity and other entities or features of the application. There is currently no date by which migration needs to be completed.

## Entities are decomposable in V3

Entities created with the V3 authoring APIs, either using the [APIs](https://westeurope.dev.cognitive.microsoft.com/docs/services/luis-programmatic-apis-v3-0-preview) or with the portal, allow you to build a layered entity model with a parent and children. The parent is known to as the **machine-learning entity** and the children are known as **subentities** of the machine learned entity.

Each subentity is also a machine-learning entity but with the added configuration options of features.

* **Required features** are rules that guarantee an entity is extracted when it matches a feature. The rule is defined by required feature to the model:
    * [Prebuilt entity](luis-reference-prebuilt-entities.md)
    * [Regular expression entity](reference-entity-regular-expression.md)
    * [List entity](reference-entity-list.md).

## How do these new relationships compare to V2 authoring

V2 authoring provided hierarchical and composite entities along with roles and features to accomplish this same task. Because the entities, features, and roles were not explicitly related to each other, it was difficult to understand how LUIS implied the relationships during prediction.

With V3, the relationship is explicit and designed by the app authors. This allows you, as the app author, to:

* Visually see how LUIS is predicting these relationships, in the example utterances
* Test for these relationships either with the [interactive test pane](how-to/train-test.md) or at the endpoint
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
    * Roles - roles can only be applied to a machine-learning (parent) entity. Roles can't be applied to subentities
    * Batch tests and patterns that use the hierarchical and composite entities

When you design your migration plan, leave time to review the final machine-learning entities, after all hierarchical and composite entities have been migrated. While a straight migration will work, after you make the change and review your batch test results, and prediction JSON, the more unified JSON may lead you to make changes so the final information delivered to the client-side app is organized differently. This is similar to code refactoring and should be treated with the same review process your organization has in place.

If you don't have batch tests in place for your V2 model, and migrate the batch tests to the V3 model as part of the migration, you won't be able to validate how the migration will impact the endpoint prediction results.

## Migrating from V2 entities

As you begin to move to the V3 authoring model, you should consider how to move to the machine-learning entity, and its subentities and features.

The following table notes which entities need to migrate from a V2 to a V3 entity design.

|V2 authoring entity type|V3 authoring entity type|Example|
|--|--|--|
|Composite entity|Machine learned entity|[learn more](#migrate-v2-composite-entity)|
|Hierarchical entity|machine-learning entity's role|[learn more](#migrate-v2-hierarchical-entity)|

## Migrate V2 Composite entity

Each child of the V2 composite should be represented with a subentity of the V3 machine-learning entity. If the composite child is a prebuilt, regular expression, or a list entity, this should be applied as a required feature on the subentity.

Considerations when planning to migrate a composite entity to a machine-learning entity:
* Child entities can't be used in patterns
* Child entities are no longer shared
* Child entities need to be labeled if they used to be non-machine-learned

### Existing features

Any phrase list used to boost words in the composite entity should be applied as a feature to either the machine-learning (parent) entity, the subentity (child) entity, or the intent (if the phrase list only applies to one intent). Plan to add the feature to the entity where it should boost most significantly. Do not add the feature generically to the machine-learning (parent) entity, if it will most significantly boost the prediction of a subentity (child).

### New features

In V3 authoring, add a planning step to evaluate entities as possible features for all the entities and intents.

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
|Parent - Component entity named `Order`|Parent - machine-learning entity named `Order`|
|Child - Prebuilt datetimeV2|* Migrate prebuilt entity to new app.<br>* Add required feature on parent for prebuilt datetimeV2.|
|Child - list entity for toppings|* Migrate list entity to new app.<br>* Then add a required feature on the parent for the list entity.|


## Migrate V2 Hierarchical entity

In V2 authoring, a hierarchical entity was provided before roles existing in LUIS. Both served the same purpose of extracting entities based on context usage. If you have hierarchical entities, you can think of them as simple entities with roles.

In V3 authoring:
* A role can be applied on the machine-learning (parent) entity.
* A role can't be applied to any subentities.

This entity is an example only. Your own entity migration may require other considerations.

Consider a V2 hierarchical entity for modifying a pizza `order`:
* where each child determines either an original topping or the final topping

An example utterance for this entity is:

`Change the topping from mushrooms to olives`

The following table demonstrates the migration:

|V2 models|V3 models|
|--|--|
|Parent - Component entity named `Order`|Parent - machine-learning entity named `Order`|
|Child - Hierarchical entity with original and final pizza topping|* Add role to `Order` for each topping.|

## API change constraint replaced with required feature

This change was made in May 2020 at the //Build conference and only applies to the v3 authoring APIs where an app is using a constrained feature. If you are migrating from v2 authoring to v3 authoring, or have not used v3 constrained features, skip this section.

**Functionality** - ability to require an existing entity as a feature to another model and only extract that model if the entity is detected. The functionality has not changed but the API and terminology have changed.

|Previous terminology|New terminology|
|--|--|
|`constrained feature`<br>`constraint`<br>`instanceOf`|`required feature`<br>`isRequired`|

#### Automatic migration

Starting **June 19 2020**, you won’t be allowed to create constraints programmatically using the previous authoring API that exposed this functionality.

All existing constraint features will be automatically migrated to the required feature flag. No programmatic changes are required to your prediction API and no resulting change on the quality of the prediction accuracy.

#### LUIS portal changes

The LUIS preview portal referenced this functionality as a **constraint**. The current LUIS portal designates this functionality as a **required feature**.

#### Previous authoring API

This functionality was applied in the preview authoring **[Create Entity Child API](https://westus.dev.cognitive.microsoft.com/docs/services/luis-programmatic-apis-v3-0-preview/operations/5d86cf3c6a25a45529767d77)** as the part of an entity's definition, using the `instanceOf` property of an entity's child:

```json
{
    "name" : "dayOfWeek",
    "instanceOf": "datetimeV2",
    "children": [
        {
           "name": "dayNumber",
           "instanceOf": "number",
           "children": []
        }
    ]
}
```

#### New authoring API

This functionality is now applied with the **[Add entity feature relation API](https://westus.dev.cognitive.microsoft.com/docs/services/luis-programmatic-apis-v3-0-preview/operations/5d9dc1781e38aaec1c375f26)** using the `featureName` and `isRequired` properties. The value of the `featureName` property is the name of the model.

```json
{
    "featureName": "YOUR-MODEL-NAME-HERE",
    "isRequired" : true
}
```


## Next steps

* [Developer resources](developer-reference-resource.md)
