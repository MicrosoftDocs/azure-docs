---
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: include
ms.date: 08/30/2023
ms.author: aahi
---

## Clearly label utterances 

* Ensure that the concepts that your entities refer to are well defined and separable. Check if you can easily determine the differences reliably. If you can't, this may be an indication that the learned component will also have difficulty. 

* If there's a similarity between entities ensure that there's some aspect of your data that provides a signal for the difference between them. 

    For example, if you built a model to book flights, a user might use an utterance like "*I want a flight from Boston to Seattle.*" The *origin city* and  *destination city* for such utterances would be expected to be similar. A signal to differentiate "*Origin city*" might be that it's often be preceded by the word "*from.*"

* Ensure that you label all instances of each entity in both your training and testing data. One approach is to use the search function to find all instances of a word or phrase in your data to check if they're correctly labeled.

*	Label test data for entities that have no [learned component](../concepts/entity-components.md#learned-component) and also for those that do. This will help ensure that your evaluation metrics are accurate.

