### Send a welcome message when a new user is added to the thread

The current Echo Bot logic accepts input from the user and echoes it back. If you want to add more logic, such as responding to a participant-added Communication Services event, copy the following code and paste it in the [EchoBot.cs](https://github.com/microsoft/BotBuilder-Samples/blob/main/samples/csharp_dotnetcore/02.echo-bot/Bots/EchoBot.cs) source file:

```csharp
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Bot.Builder;
using Microsoft.Bot.Schema;

namespace Microsoft.BotBuilderSamples.Bots
{
    public class EchoBot : ActivityHandler
    {
        public override async Task OnTurnAsync(ITurnContext turnContext, CancellationToken cancellationToken)
        {
            if (turnContext.Activity.Type == ActivityTypes.Message)
            {
                var replyText = $"Echo: {turnContext.Activity.Text}";
                await turnContext.SendActivityAsync(MessageFactory.Text(replyText, replyText), cancellationToken);
            }
            else if (ActivityTypes.ConversationUpdate.Equals(turnContext.Activity.Type))
            {
                if (turnContext.Activity.MembersAdded != null)
                {
                    foreach (var member in turnContext.Activity.MembersAdded)
                    {
                        if (member.Id != turnContext.Activity.Recipient.Id)
                        {
                            await turnContext.SendActivityAsync(MessageFactory.Text("Hello and welcome to chat with EchoBot!"), cancellationToken);
                        }
                    }
                }
            }
        }
    }
}
```

### Send an adaptive card

You can send an adaptive card to the chat thread to increase engagement and efficiency. An adaptive card also helps you communicate with users in various ways. You can send an adaptive card from a bot by adding the card as a bot activity attachment.

Here's an example of how to send an adaptive card:

```csharp
var reply = Activity.CreateMessageActivity();
var adaptiveCard = new Attachment()
{
    ContentType = "application/vnd.microsoft.card.adaptive",
    Content = {/* the adaptive card */}
};
reply.Attachments.Add(adaptiveCard);   
await turnContext.SendActivityAsync(reply, cancellationToken);             
```

Get sample payloads for adaptive cards at [Samples and templates](https://adaptivecards.io/samples).

For a chat user, the Communication Services Chat channel adds a field to the message metadata that indicates the message has an attachment. In the metadata, the `microsoft.azure.communication.chat.bot.contenttype` property is set to `azurebotservice.adaptivecard`.

Here's an example of a chat message that has an adaptive card attached:

```json
{
    "content": "{\"attachments\":[{\"contentType\":\"application/vnd.microsoft.card.adaptive\",\"content\":{/* the adaptive card */}}]}",
    "senderDisplayName": "BotDisplayName",
    "metadata": {
    "microsoft.azure.communication.chat.bot.contenttype": "azurebotservice.adaptivecard"
    },
 "messageType": "Text"
}
```

#### Send a message from user to bot

You can send a basic text message from a user to the bot the same way you send a text message to another user.

However, when you send a message that has an attachment from a user to a bot, add this flag to the Communication Services Chat metadata:

`"microsoft.azure.communication.chat.bot.contenttype": "azurebotservice.adaptivecard"`

To send an event activity from a user to a bot, add this flag to the Communication Services Chat metadata:

`"microsoft.azure.communication.chat.bot.contenttype": "azurebotservice.event"`

The following sections show sample formats for chat messages from a user to a bot.

#### Simple text message

```json
{
    "content":"Simple text message",
    "senderDisplayName":"Acs-Dev-Bot",
    "metadata":{
        "text":"random text",
        "key1":"value1",
        "key2":"{\r\n  \"subkey1\": \"subValue1\"\r\n
        "}, 
    "messageType": "Text"
}
```

#### Message with an attachment

```json
{
    "content": "{
                        \"text\":\"sample text\", 
                        \"attachments\": [{
                            \"contentType\":\"application/vnd.microsoft.card.adaptive\",
                            \"content\": { \"*adaptive card payload*\" }
                        }]
        }",
    "senderDisplayName": "Acs-Dev-Bot",
    "metadata": {
        "microsoft.azure.communication.chat.bot.contenttype": "azurebotservice.adaptivecard",
        "text": "random text",
        "key1": "value1",
        "key2": "{\r\n  \"subkey1\": \"subValue1\"\r\n}"
    },
        "messageType": "Text"
}
```

#### Message with an event activity

An event payload includes all JSON fields in the message content except `Name`. The `Name` field contains the name of the event.

In the following example, the event name `endOfConversation` with the payload `"{field1":"value1", "field2": { "nestedField":"nestedValue" }}` is sent to the bot:

```json
{
    "content":"{
                   \"name\":\"endOfConversation\",
                   \"field1\":\"value1\",
                   \"field2\": {  
                       \"nestedField\":\"nestedValue\"
                    }
               }",
    "senderDisplayName":"Acs-Dev-Bot",
    "metadata":{  
                   "microsoft.azure.communication.chat.bot.contenttype": "azurebotservice.event",
                   "text":"random text",
                   "key1":"value1",
                   "key2":"{\r\n  \"subkey1\": \"subValue1\"\r\n}"
               },
    "messageType": "Text"
}
```

The metadata field `microsoft.azure.communication.chat.bot.contenttype` is required only in a message that's sent from a user to a bot.

## Supported bot activity fields

The following sections describe supported bot activity fields for bot-to-user flows and user-to-bot flows.

### Bot-to-user flow

The following bot activity fields are supported for bot-to-user flows.

#### Activities

- Message
- Typing

#### Message activity fields

- `Text`
- `Attachments`
- `AttachmentLayout`
- `SuggestedActions`
- `From.Name` (Converted to Communication Services `SenderDisplayName`.)
- `ChannelData` (Converted to Communication Services `Chat Metadata`. If any `ChannelData` mapping values are objects, they're serialized in JSON format and sent as a string.)

### User-to-bot flow

These bot activity fields are supported for user-to-bot flows.

#### Activities and fields

- Message

  - `Id` (Communication Services Chat message ID)
  - `TimeStamp`
  - `Text`
  - `Attachments`

- Conversation update

  - `MembersAdded`
  - `MembersRemoved`
  - `TopicName`

- Message update

  - `Id` (Updated Communication Services Chat message ID)
  - `Text`
  - `Attachments`

- Message delete

  - `Id` (Deleted Communication Services Chat message ID)

- Event

  - `Name`
  - `Value`

- Typing

#### Other common fields

- `Recipient.Id` and `Recipient.Name` (Communication Services Chat user ID and display name)
- `From.Id` and `From.Name` (Communication Services Chat user ID and display name)
- `Conversation.Id` (Communication Services Chat thread ID)
- `ChannelId` (Communication Services Chat if empty)
- `ChannelData` (Communication Services Chat message metadata)

## Support for single-tenant and managed identity bots

Communication Services Chat channel supports single-tenant bots, managed identity bots, and multi-tenant bots. To set up a single-tenant or managed identity bot, review [Bot identity information](/azure/bot-service/bot-builder-authentication?tabs=userassigned%2Caadv2%2Ccsharp#bot-identity-information).

For a managed identity bot, you might have to [update the bot service identity](/azure/bot-service/bot-builder-authentication?tabs=userassigned%2Caadv2%2Ccsharp#to-update-your-app-service).

## Bot handoff patterns

Sometimes, a bot doesn't understand a question, or it can't answer a question. A customer might ask in the chat to be connected to a human agent. In these scenarios, the chat thread must be handed off from the bot to a human agent. You can design your application to [transition a conversation from a bot to a human](/azure/bot-service/bot-service-design-pattern-handoff-human).

## Handling bot-to-bot communication

In some use cases, two bots need to be added to the same chat thread to provide different services. In this scenario, you might need to ensure that a bot doesn't send automated replies to another bot's messages. If not handled properly, the bots' automated interaction between themselves might result in an infinite loop of messages.

You can verify the Communication Services user identity of a message sender in the activity's `From.Id` property. Check to see whether it belongs to another bot. Then, take the required action to prevent a bot-to-bot communication flow. If this type of scenario results in high call volumes, the Communication Services Chat channel throttles the requests and a bot can't send and receive messages.

Learn more about [throttle limits](/azure/communication-services/concepts/service-limits#chat).

## Troubleshoot

The following sections describe ways to troubleshoot common scenarios.

### Chat channel can't be added

In the [Microsoft Bot Framework developer portal](https://dev.botframework.com/bots), go to **Configuration** > **Bot Messaging** to verify that the endpoint has been set correctly.

### Bot gets a forbidden exception while replying to a message

Verify that the bot's Microsoft app ID and password are saved correctly in the bot configuration file you upload to the web app.

### Bot can't be added as a participant

Verify that the bot's Communication Services ID is used correctly when a request is sent to add a bot to a chat thread.
