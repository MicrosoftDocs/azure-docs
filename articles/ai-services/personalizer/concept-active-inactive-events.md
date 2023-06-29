---
title: Active and inactive events - Personalizer
description: This article discusses the use of active and inactive events within the Personalizer service.
author: jcodella
ms.author: jacodel
ms.manager: nitinme
ms.service: cognitive-services
ms.subservice: personalizer
ms.topic: conceptual
ms.date: 02/20/2020
---

# Defer event activation

Deferred activation of events allows you to create personalized websites or mailing campaigns, considering that the user may never actually see the page or open the email. 
In these scenarios, the application might need to call Rank before it even knows if the result will be used or displayed to the user at all. If the content is never shown to the user, no default Reward (typically zero) should be assumed for it to learn from.
Deferred Activation allows you to use the results of a Rank call at one point in time, and decide if the Event should be learned from later on, or elsewhere in your code.

## Typical scenarios for deferred activation

Deferring activation of events is useful in the following example scenarios:

* You are pre-rendering a personalized web page for a user, but the user may never get to see it because some business logic may override the action choice of Personalizer.
* You are personalizing content "below the fold" in a web page, and it is highly possible the content will never be seen by the user.
* You are personalizing marketing emails, and you need to avoid training from emails that were never opened by users.
* You personalized a dynamic media channel, and your users may stop playing the channel before it gets to the songs or videos selected by Personalizer. 

In general terms, these scenarios happen when:

* You're pre-rendering UI that the user might or might not get to see due to UI or time constraints.
* Your application is doing predictive personalization in which you make Rank calls before you know if you will use the output.

## How to defer activation, and later activate, events

To defer activation for an event, call [Rank](https://westus2.dev.cognitive.microsoft.com/docs/services/personalizer-api/operations/Rank) with `deferActivation = True` in the bequest body.

As soon as you know your users were shown the personalized content or media, and expecting a Reward is reasonable, you must activate that event. To do so call the [Activate API](https://westus2.dev.cognitive.microsoft.com/docs/services/personalizer-api/operations/Activate) with the eventId.


The [Activate API](https://westus2.dev.cognitive.microsoft.com/docs/services/personalizer-api/operations/Activate) call for that EventID call must be received before the Reward Wait Time time window expires.

### Behavior with deferred activation 

Personalizer will learn from events and rewards as follows:
* If you call Rank with `deferActivation = True`, and *don't* call the `Activate` API for that eventId, and call Reward, Personalizer not learn from the event.
* If you call Rank with `deferActivation = True`, and *do* call the `Activate` API for that eventId, and call Reward, Personalizer will learn from the event with the specified Reward score.
* If you call Rank with `deferActivation = True`, and *do* call the `Activate` API for that eventId, but omit calling Reward, Personalizer will learn from the event with the Default Reward score set in configuration.

## Next steps
* Howe to Configure [Default rewards](how-to-settings.md#configure-rewards-for-the-feedback-loop).
* Learn [how to determine reward score and what data to consider](concept-rewards.md).
