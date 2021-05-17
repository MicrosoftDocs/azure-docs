---
title: Entity types - LUIS
description: An entity extracts data from a user utterance at prediction runtime. An _optional_, secondary purpose is to boost the prediction of the intent or other entities by using the entity as a feature.
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: conceptual
ms.date: 04/26/2021
---

# Entities in LUIS

An entity is an item or an element that is relevant to the user's intent. Entities define data that can be extracted from the utterance and is essential to complete a user's required action. For example:

|Utterance|Intent predicted|Entities extracted|Explanation|
|--|--|--|--|
|Hello, how are you?|Greeting|-|Nothing to extract.|
|I want to order a small pizza|orderPizza| "small" | "Size" entity is extracted as "small" .|
|Turn off bedroom light|turnOff| "bedroom" | "Room" entity is extracted as "bedroom" .|
|Check balance in my savings account ending in 4406|checkBalance| "savings", "4406" | "accountType" entity is extracted as "savings" and "accountNumber" entity is extracted as "4406".|
|Buy 3 tickets to New York|buyTickets| "3", "New York" | "ticketsCount" entity is extracted as "3" and "Destination" entity is extracted as "New York".|

Entities are optional but recommended. You don't need to create entities for every concept in your app, only for those where:

* The client application needs the data, or 
* The entity acts as a hint or signal to another entity or intent. To learn more about entities as Features go to [Entities as features](#entities-as-features).

## Entity types

To create an entity, you have to give it a name and a type. There are several types of entities in LUIS. 

## List entity

A list entity represents a fixed, closed set of related words along with their synonyms. You can use list entities to recognize multiple synonyms or variations and extract a normalized output for them. Use the *recommend* option to see suggestions for new words based on the current list. 

A list entity isn't machine-learned, meaning that LUIS does not discover additional values for list entities. LUIS marks any match to an item in any list as an entity in the response.

Matching in list entities is both case sensitive and it has to be an exact match to be extracted. Normalized values are also used when matching the list entity. For example:

|Normalized value|Synonyms|
|--|--|
|Small|sm, sml, tiny, smallest|
|Medium|md, mdm, regular, average, middle|
|Large|lg, lrg, big|

See the [list entities reference article](reference-entity-list.md) for more information.

## Regex entity

A regular expression entity extracts an entity based on a regular expression pattern you provide. It ignores case and ignores cultural variant. Regular expression is best for structured text or a predefined sequence of alphanumeric values that are expected in a certain format. For example:

|Entity|Regular expression|Example|
|--|--|--|
|Flight Number|flight [A-Z]{2} [0-9]{4}| flight AS 1234|
|Credit Card Number|[0-9]{16}|5478789865437632|

See the [regex entities reference article](reference-entity-regular-expression.md) for more information.

## Prebuilt entity

LUIS offers a set of prebuilt entities for recognizing common types of data like name, date, number, and currency.  The behavior of prebuilt entities is fixed. Prebuilt entity support varies according to the culture of the LUIS app. For example:

|Prebuilt entity|Example value|
|--|--|
|PersonName|James, Bill, Tom|
|DatetimeV2|2019-05-02, May 2nd, 8am on may 2nd 2019|

See the [prebuilt entities reference article](./luis-reference-prebuilt-entities.md) for more information.

## Pattern.Any entity

A pattern.Any entity is a variable-length placeholder used only in a pattern's template utterance to mark where the entity begins and ends. It follows a specific rule or pattern and best used for sentences with fixed lexical structure. For example:

|Example utterance|Pattern|Entity|
|--|--|--|
|Can I have a burger please?|Can I have a {meal} [please][?]| burger
|Can I have a pizza?|Can I have a {meal} [please][?]| pizza
|Where can I find The Great Gatsby?|Where can I find {bookName}?| The Great Gatsby|

See the [Pattern.Any entities reference article](./reference-entity-pattern-any.md) for more information.

## Machine learned (ML) entity

Machine learned entity uses context to extract entities based on labeled examples. It is the preferred entity for building LUIS applications. It relies on machine learning algorithms and requires labeling to be tailored to your application successfully. Use an ML entity to identify data that is not always well formatted but have the same meaning. 

|Example utterance|Extracted *product* entity|
|--|--|
|I want to buy a book.|"book"|
|Can I get these shoes please?|"shoes"|
|Add those shorts to my basket.|"shorts"|

You can learn more about Machine learned entities [here](./reference-entity-machine-learned-entity.md).

See the [machine learned entities reference article](./reference-entity-pattern-any.md) for more information.

#### ML Entity with Structure

An ML entity can be composed of smaller sub-entities, each of which can have its own properties. For example, *Address* could have the following structure:

* Address: 4567 Main Street, NY, 98052, USA
    * Building Number: 4567
    * Street Name: Main Street
    * State: NY
    * Zip Code: 98052
    * Country: USA


## Building effective ML entities

To build machine learned entities effectively, follow these best practices:

* If you have a machine learned entity with sub-entities, make sure that the different orders and variants of the entity and sub-entities are presented in the labeled utterances. Labeled example utterances should include all valid forms, and include entities that appear and are absent and also reordered within the utterance.

* Avoid overfitting the entities to a very fixed set. Overfitting happens when the model doesn't generalize well, and is a common problem in machine learning models. This implies the app would not work on new types of examples adequately. In turn, you should vary the labeled example utterances so the app can generalize beyond the limited examples you provide.

* Your labeling should be consistent across the intents. This includes even utterances you provide in the *None* intent that includes this entity. Otherwise the model will not be able to determine the sequences effectively.

## Entities as features

Another important function of entities is to use them as features or distinguishing traits for another intents or entities so that your system observes and learns through them.

## Entities as features for intents

You can use entities as a signal for an intent. For example, the presence of a certain entity in the utterance can distinguish which intent does it fall under.

|Example utterance|Entity|Intent|
|--|--|--|
|Book me a *fight to New York*.|City|Book Flight|
|Book me the *main conference room*.|Room|Reserve Room|

## Entities as Feature for entities

You can also use entities as an indicator of the presence of other entities. A common example of this is using a prebuilt entity as a feature for another ML entity.
If you are  building a flight booking system and your utterance looks like "Book me a flight from Cairo to Seattle", you will have *Origin City* and *Destination City* as ML entities. A good practice would be to use the prebuilt `GeographyV2` entity as a feature for both entities.

See the [GeographyV2 entities reference article](./luis-reference-prebuilt-geographyv2.md) for more information.

You can also use entities as required features for other entities. This helps in the resolution of extracted entities. For example, if you are creating a pizza ordering application and you have a `Size` ML entity, you can create `SizeList` list entity and use it as a required feature for the `Size` entity. Your application will return the normalized value as the extracted entity from the utterance. 

See [features](luis-concept-feature.md) for more information, and [prebuilt entities](./luis-reference-prebuilt-entities.md) to learn more about prebuilt entities resolution available in your culture. 


## Entity prediction status and errors

The LUIS portal shows the following when the entity has a different entity prediction than the entity you labeled for an example utterance. This different score is based on the current trained model. 

:::image type="content" source="./media/luis-concept-entities/portal-entity-prediction-error.png" alt-text="The LUIS portal shows when the entity has a different entity prediction than the entity you selected for an example utterance":::

The text causing the error is highlighted within the example utterance, and the example utterance line has an error indicator to the right, shown as a red triangle. 

To resolve entity errors, try one or more of the following:

* The highlighted text is mislabeled. To fix, review the label, correct it, and retrain the app. 
* Create a [feature](luis-concept-feature.md) for the entity to help identify the entity's concept.
* Add more [example utterances](luis-concept-utterance.md) and label with the entity.
* [Review active learning suggestions](luis-concept-review-endpoint-utterances.md) for any utterances received at the prediction endpoint that can help identify the entity's concept.


## Next steps

* Learn about good example [utterances](luis-concept-utterance.md).
* See [Add entities](luis-how-to-add-entities.md) to learn more about how to add entities to your LUIS app.
* Learn more about LUIS [application limits](./luis-limits.md). 
* Use a [tutorial](tutorial-machine-learned-entity.md) to learn how to extract structured data from an utterance using the machine-learning entity.
