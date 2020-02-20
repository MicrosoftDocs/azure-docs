---
title: Active and inactive events - Personalizer
description: This article discusses the use of active and inactive events within the Personalizer service.
ms.topic: conceptual
ms.date: 02/20/2020
---

# Active and inactive events

When your application calls the Rank API, you receive the action the application should show in the **rewardActionId** field.  From that moment, Personalizer expects a Reward call that has the same eventId. The reward score will be used to train the model for future Rank calls. If no Reward call is received for the eventId, a default reward is applied. Default rewards are set in the Azure portal.

In some scenarios, the application might need to call Rank before it even knows if the result will be used or displayed to the user. This might happen in situations where, for example, the page rendering of promoted content is overwritten by a marketing campaign. If the result of the Rank call was never used and the user never saw it, don't send a corresponding Reward call.

Typically, these scenarios happen when:

* You're prerendering UI that the user might or might not get to see.
* Your application is doing predictive personalization in which Rank calls are made with little real-time context and the application might or might not use the output.

In these cases, use Personalizer to call Rank, requesting the event to be _inactive_. Personalizer won't expect a reward for this event, and it won't apply a default reward.
Later in your business logic, if the application uses the information from the Rank call, just _activate_ the event. As soon as the event is active, Personalizer expects an event reward. If no explicit call is made to the Reward API, Personalizer applies a default reward.

## Inactive events

To disable training for an event, call Rank by using `learningEnabled = False`. For an inactive event, learning is implicitly activated if you send a reward for the eventId or call the `activate` API for that eventId.

## Next steps

* Learn [how to determine reward score and what data to consider](concept-rewards.md).
