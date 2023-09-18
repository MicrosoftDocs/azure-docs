---
title: Transparency note for Personalizer
titleSuffix: Azure AI services
description: Transparency Note for Personalizer
author: jcodella
ms.author: jacodel
manager: nitinme
ms.service: cognitive-services
ms.subservice: personalizer
ms.date: 05/23/2022
ms.topic: conceptual
---

# Use cases for Personalizer

## What is a Transparency Note?

An AI system includes not only the technology, but also the people who will use it, the people who will be affected by it, and the environment in which it is deployed. Creating a system that is fit for its intended purpose requires an understanding of how the technology works, its capabilities and limitations, and how to achieve the best performance.

Microsoft provides *Transparency Notes* to help you understand how our AI technology works. This includes the choices system owners can make that influence system performance and behavior, and the importance of thinking about the whole system, including the technology, the people, and the environment. You can use Transparency Notes when developing or deploying your own system, or share them with the people who will use or be affected by your system.

Transparency Notes are part of a broader effort at Microsoft to put our AI principles into practice. To find out more, see [Microsoft AI Principles](https://www.microsoft.com/ai/responsible-ai).

## Introduction to Personalizer

Azure AI Personalizer is a cloud-based service that helps your applications choose the best content item to show your users. You can use Personalizer to determine what product to suggest to shoppers or to figure out the optimal position for an advertisement. After the content is shown to the user, your application monitors the user's reaction and reports a reward score back to Personalizer. The reward score is used to continuously improve the machine learning model using reinforcement learning. This enhances the ability of Personalizer to select the best content item in subsequent interactions based on the contextual information it receives for each.

For more information, see:

- [What is Personalizer?](what-is-personalizer.md)
- [Where can you use Personalizer](where-can-you-use-personalizer.md)
- [How Personalizer works](how-personalizer-works.md)

## Key terms  

|Term| Definition|
|:-----|:----|
|**Learning Loop** | You create a Personalizer resource, called a learning loop, for every part of your application that can benefit from personalization. If you have more than one experience to personalize, create a loop for each. |
|**Online model** | The default [learning behavior](terminology.md#learning-behavior) for Personalizer where your learning loop, uses machine learning to build the model that predicts the **top action** for your content. |
|**Apprentice mode** | A [learning behavior](terminology.md#learning-behavior) that helps warm-start a Personalizer model to train without impacting the applications outcomes and actions. |
|**Rewards**| A measure of how the user responded to the Rank API's returned reward action ID, as a score between 0 to 1. The 0 to 1 value is set by your business logic, based on how the choice helped achieve your business goals of personalization. The learning loop doesn't store this reward as individual user history. |
|**Exploration**| The Personalizer service is exploring when, instead of returning the best action, it chooses a different action for the user. The Personalizer service avoids drift, stagnation, and can adapt to ongoing user behavior by exploring. |

For more information, and additional key terms, please refer to the [Personalizer Terminology](terminology.md) and [conceptual documentation](how-personalizer-works.md).

## Example use cases

Some common customer motivations for using Personalizer are to:

- **User engagement**: Capture user interest by choosing content to increase clickthrough, or to prioritize the next best action to improve average revenue. Other mechanisms to increase user engagement might include selecting videos or music in a dynamic channel or playlist.
- **Content optimization**: Images can be optimized for a product (such as selecting a movie poster from a set of options) to optimize clickthrough, or the UI layout, colors, images, and blurbs can be optimized on a web page to increase conversion and purchase.
- **Maximize conversions using discounts and coupons**: To get the best balance of margin and conversion choose which discounts the application will provide to users, or decide which product to highlight from the results of a recommendation engine to maximize conversion.
- **Maximize positive behavior change**: Select which wellness tip question to send in a notification, messaging, or SMS push to maximize positive behavior change.
- **Increase productivity** in customer service and technical support by highlighting the most relevant next best actions or the appropriate content when users are looking for documents, manuals, or database items.

## Considerations when choosing a use case

- Using a service that learns to personalize content and user interfaces is useful. However, it can also be misapplied if the personalization creates harmful side effects in the real world. Consider how personalization also helps your users achieve their goals.
- Consider what the negative consequences in the real world might be if Personalizer isn't suggesting particular items because the system is trained with a bias to the behavior patterns of the majority of the system users.
- Consider situations where the exploration behavior of Personalizer might cause harm.
- Carefully consider personalizing choices that are consequential or irreversible, and that should not be determined by short-term signals and rewards.
- Don't provide actions to Personalizer that shouldn't be chosen. For example, inappropriate movies should be filtered out of the actions to personalize if making a recommendation for an anonymous or underage user.

Here are some scenarios where the above guidance will play a role in whether, and how, to apply Personalizer:

- Avoid using Personalizer for ranking offers on specific loan, financial, and insurance products, where personalization features are regulated, based on data the individuals don't know about, can't obtain, or can't dispute; and choices needing years and information “beyond the click” to truly assess how good recommendations were for the business and the users.
- Carefully consider personalizing highlights of school courses and education institutions where recommendations without enough exploration might propagate biases and reduce users' awareness of other options.
- Avoid using Personalizer to synthesize content algorithmically with the goal of influencing opinions in democracy and civic participation, as it is consequential in the long term, and can be manipulative if the user's goal for the visit is to be informed, not influenced.


## Next steps

* [Characteristics and limitations for Personalizer](responsible-characteristics-and-limitations.md)
* [Where can you use Personalizer?](where-can-you-use-personalizer.md)
