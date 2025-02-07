---
author: jamescadd
ms.service: azure-communication-services
ms.topic: include
ms.date: 10/20/2023
ms.author: jacadd
---

[!INCLUDE [Install SDK](../install-sdk/install-sdk-web.md)]

## Implement reactions for meeting participants

In Azure Communication Services participants can send and receive reactions during a group call:

- Like :::image type="icon" source="media/reaction-like.png":::
- Love :::image type="icon" source="media/reaction-love.png":::
- Applause :::image type="icon" source="media/reaction-applause.png":::
- Laugh :::image type="icon" source="media/reaction-laugh.png":::
- Surprise :::image type="icon" source="media/reaction-surprise.png":::

To send a reaction, use the `sendReaction(reactionMessage)` API. To receive a reaction, the message builds with type `ReactionMessage` using `Reaction` enums as an attribute.

You need to subscribe to events that provide the subscriber event data:

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

You can determine which reaction is coming from which participant using the `identifier` attribute and getting the reaction type from `ReactionMessage`. 

### Sample showing how to send a reaction in a meeting

```javascript
const reaction = call.feature(SDK.Features.Reaction);
const reactionMessage: SDK.ReactionMessage = {
       reactionType: 'like'
};
await reaction.sendReaction(reactionMessage);
```

### Sample showing how to receive a reaction in a meeting

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

### Key points when using reactions

- Reactions are supported for Microsoft Teams interoperability scenarios. Support is based on [Teams policy](/microsoftteams/manage-reactions-meetings).
- Reactions are supported in the Web Calling SDK.
- Reactions aren't currently supported in the Native SDKs.