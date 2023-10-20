---
author: jamescadd
ms.service: azure-communication-services
ms.topic: include
ms.date: 10/20/2023
ms.author: jacadd
---
[!INCLUDE [Install SDK](../install-sdk/install-sdk-web.md)]

## Send or receive a reaction from other participants
> [!NOTE]
> This API is provided as a preview for developers and may change based on feedback that we receive. To use this api please use 'beta' release of Azure Communication Services Calling Web SDK version 1.18.1 or higher

Within ACS you can send and receive reactions when on a group call:
- Like ![Like reaction](media/reaction-like.png)
- Love ![Love reaction](media/reaction-love.png)
- Applause ![Applause reaction](media/reaction-applause.png)
- Laugh ![Laugh reaction](media/reaction-laugh.png)
- Surprise ![Like reaction](media/reaction-surprise.png)

To send a reaction you'll use the `sendReaction(reactionMessage)` API. To receive a reaction message will be built with Type `ReactionMessage` which uses `Reaction` enums as an attribute. 

You'll need to subscribe for events which provide the subscriber event data as:
```javascript
export interface ReactionEventPayload {
    /**
     * identifier for a participant
     */
    identifier: CommunicationUserIdentifier | MicrosoftTeamsUserIdentifier;
    /**
     * reaction type received
     */
    reactionMessage: ReactionMessage;
}
```

You can determine which reaction is coming from which participant with `identifier` attribute and gets the reaction type from `ReactionMessage`. 

### Sample on how to send a reaction in a meeting
```javascript
const reaction = call.feature(SDK.Features.Reaction);
const reactionMessage: SDK.ReactionMessage = {
       reactionType: 'like'
};
await reaction.sendReaction(reactionMessage);
```

### Sample on how to receive a reaction in a meeting
```javascript
const reaction = call.feature(SDK.Features.Reaction);
reaction.on('reaction', event => {
    // user identifier
    console.log("User Mri - " + event.identifier);
    // received reaction
    console.log("User Mri - " + event.reactionMessage.reactionType);
    // reaction message
    console.log("reaction message - " + JSON.stringify(event.reactionMessage));
}
```

### Key things to note about using Reactions:
- For teams interoperability scenarios, the functionality of the feature depends on the meeting poilicy for the reaction capability.
- On direct 1:1 calls between a CTE user and a teams user, the reaction functionality is disabled.
