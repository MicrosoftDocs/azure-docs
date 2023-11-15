---
title: Add a bot to your chat app
titleSuffix: An Azure Communication Services quickstart 
description: Learn how to build a chat experience with a bot by using the Azure Communication Services Chat SDK and Azure Bot Service. 
author: tariqzafa700
manager: potsang
services: azure-communication-services
ms.author: tariqzafar
ms.date: 10/18/2022
ms.topic: quickstart
ms.service: azure-communication-services
ms.custom: mode-other
---

# Quickstart: Add a bot to your chat app

[!INCLUDE [Public Preview Notice](../../includes/public-preview-include.md)]

Learn how to build conversational AI experiences in a chat application by using the Azure Communication Services Chat messaging channel that's available in Azure Bot Service. In this quickstart, you create a bot by using the BotFramework SDK. Then, you integrate the bot into a chat application you create by using the Communication Services Chat SDK.

In this quickstart, you learn how to:

- [Create and deploy a bot in Azure](#create-and-deploy-a-bot-in-azure)
- [Get a Communication Services resource](#get-a-communication-services-resource)
- [Enable the Communication Services Chat channel for the bot](#enable-the-communication-services-chat-channel)
- [Create a chat app and add the bot as a participant](#create-a-chat-app-and-add-the-bot-as-a-participant)
- [Explore more features for your bot](#more-things-you-can-do-with-a-bot)

## Prerequisites

- An Azure account and an active subscription. Create an [account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Visual Studio 2019 or later](https://visualstudio.microsoft.com/vs/).
- The latest version of .NET Core. In this quickstart, we use [.NET Core 3.1](https://dotnet.microsoft.com/download/dotnet-core/3.1). Be sure to install the version that corresponds with your instance of Visual Studio, 32-bit or 64-bit.

## Create and deploy a bot in Azure

To use Azure Communication Services chat as a channel in Azure Bot Service, first deploy a bot. To deploy a bot, you complete these steps:

- Create an Azure Bot Service resource
- Get the bot's app ID and password
- Create a web app to hold the bot logic
- Create a messaging endpoint for the bot

### Create an Azure Bot Service resource

First, [use the Azure portal to create an Azure Bot Service resource](/azure/bot-service/abs-quickstart?tabs=userassigned).

This quickstart uses a multi-tenant bot. To use a single-tenant bot or a managed identity bot, see [Support for single-tenant and managed identity bots](#support-for-single-tenant-and-managed-identity-bots).

### Get the bot's app ID and app password

Next, [get the Microsoft app ID and password](/azure/bot-service/abs-quickstart?tabs=userassigned#to-get-your-app-or-tenant-id) that are assigned to your bot when it's deployed. You use these values for later configurations.

### Create a web app to hold the bot logic

To create a web app for your bot, you can revise [Bot Builder samples](https://github.com/Microsoft/BotBuilder-Samples) for your scenario or use the [Bot Builder SDK](/composer/introduction) to create a web app. One of the simplest samples is [Echo Bot](https://github.com/microsoft/BotBuilder-Samples/tree/main/samples/csharp_dotnetcore/02.echo-bot).

Azure Bot Service typically expects the Bot Application Web App Controller to expose an endpoint in the form `/api/messages`. The endpoint handles all messages that are sent to the bot.

To create the bot app, either use the Azure CLI to [create an Azure App Service resource](/azure/bot-service/provision-app-service?tabs=singletenant%2Cexistingplan) or create the app in the Azure portal.

To create a bot web app by using the Azure portal:

1. In the portal, select **Create a resource**. In the search box, enter **web app**. Select the **Web App** tile.
  
   :::image type="content" source="./media/web-app.png" alt-text="Screenshot that shows creating a web app resource in the Azure portal.":::

1. In **Create Web App**, select or enter details for the app, including the region where you want to deploy the app.
  
   :::image type="content" source="./media/web-app-create-options.png" alt-text="Screenshot that shows details to set to create a web app deployment.":::

1. Select **Review + Create** to validate the deployment and review the deployment details. Then, select **Create**.

1. When the web app resource is created, copy the hostname URL that's shown in the resource details. The URL is part of the endpoint you create for the web app.
  
   :::image type="content" source="./media/web-app-endpoint.png" alt-text="Screenshot that shows how to copy the web app endpoint URL.":::

### Create a messaging endpoint for the bot

Next, in the bot resource, create a web app messaging endpoint:

1. In the Azure portal, go to your Azure Bot resource. In the resource menu, select **Configuration**.

1. In **Configuration**, for **Messaging endpoint**, paste the hostname URL of the web app you copied in the preceding section. Append the URL with `/api/messages`.

1. Select **Save**.

:::image type="content" source="./media/smaller-bot-configure-with-endpoint.png" alt-text="Screenshot that shows how to create a bot messaging endpoint by using the web app hostname." lightbox="./media/bot-configure-with-endpoint.png":::

### Deploy the web app

The final step to create a bot is to deploy the web app. For this quickstart, use the Echo Bot sample. The Echo Bot functionality is limited to echoing the user input. Here's how you deploy it to your web app in Azure:

1. Use Git to clone this GitHub repository:

   ```console
   git clone https://github.com/Microsoft/BotBuilder-Samples.git
   cd BotBuilder-Samples
   ```

1. In Visual Studio, open the [Echo Bot project](https://github.com/microsoft/BotBuilder-Samples/tree/main/samples/csharp_dotnetcore/02.echo-bot).

1. In the Visual Studio project, open the *Appsettings.json* file. Paste the [Microsoft app ID and app password](#get-the-bots-app-id-and-app-password) you copied earlier:

   ```json
      {
        "MicrosoftAppId": "<App-registration-ID>",
        "MicrosoftAppPassword": "<App-password>"
      }
    ```

   Next, use Visual Studio for C# bots to deploy the bot.

   You also can use a Command Prompt window to [deploy an Azure bot](/azure/bot-service/provision-and-publish-a-bot?tabs=userassigned%2Ccsharp). 

1. In Visual Studio, in Solution Explorer, right-click the **EchoBot** project and select **Publish**:

   :::image type="content" source="./media/publish-app.png" alt-text="Screenshot that shows publishing your web app from Visual Studio.":::

1. Select **New** to create a new publishing profile. For **Target**, select **Azure**:

   :::image type="content" source="./media/select-azure-as-target.png" alt-text="Screenshot that shows how to select Azure as target in a new publishing profile.":::
  
   For the specific target, select **Azure App Service**:
  
   :::image type="content" source="./media/select-app-service.png" alt-text="Screenshot that shows how to select Azure App Service as the specific target.":::

1. In the deployment configuration, select the web app in the results that appear after you sign in to your Azure account. To complete the profile, select **Finish**, and then select **Publish** to start the deployment.
  
   :::image type="content" source="./media/smaller-deployment-config.png" alt-text="Screenshot that shows setting the deployment configuration with the web app name." lightbox="./media/deployment-config.png":::

## Get a Communication Services resource

Now that your bot is created and deployed, create a Communication Services resource to use to set up a Communication Services channel:

1. Complete the steps to [create a Communication Services resource](../../quickstarts/create-communication-resource.md).

1. Create a Communication Services user and issue a [user access token](../../quickstarts/identity/access-tokens.md). Be sure to set the scope to **chat**. *Copy the token string and the user ID string*.

## Enable the Communication Services Chat channel

When you have a Communication Services resource, you can set up a Communication Services channel in the bot resource. In this process, a user ID is generated for the bot.

1. In the Azure portal, go to your Azure Bot resource. In the resource menu, select **Channels**. In the list of available channels, select **Azure Communications Services - Chat**.

   :::image type="content" source="./media/smaller-demoapp-launch-acs-chat.png" alt-text="Screenshot that shows opening the Communication Services Chat channel." lightbox="./media/demoapp-launch-acs-chat.png":::

1. Select **Connect** to see a list of Communication Services resources that are available in your subscription.

   :::image type="content" source="./media/smaller-bot-connect-acs-chat-channel.png" alt-text="Screenshot that shows how to connect a Communication Service resource to the bot." lightbox="./media/bot-connect-acs-chat-channel.png":::

1. In the **New Connection** pane, select the Communication Services chat resource, and then select **Apply**.

   :::image type="content" source="./media/smaller-bot-choose-resource.png" alt-text="Screenshot that shows how to save the selected Communication Service resource to create a new Communication Services user ID." lightbox="./media/bot-choose-resource.png":::

1. When the resource details are verified, a bot ID is shown in the **Bot Azure Communication Services Id** column. You can use the bot ID to represent the bot in a chat thread by using the Communication Services Chat AddParticipant API. After you add the bot to a chat as participant, the bot starts to receive chat-related activities, and it can respond in the chat thread.

   :::image type="content" source="./media/smaller-acs-chat-channel-saved.png" alt-text="Screenshot that shows the new Communication Services user ID assigned to the bot." lightbox="./media/acs-chat-channel-saved.png":::

## Create a chat app and add the bot as a participant

Now that you have the bot's Communication Services ID, you can create a chat thread with the bot as a participant.

### Create a new C# application

1. Run the following command to create a C# application:

   ```console
   dotnet new console -o ChatQuickstart
   ```

1. Change your directory to the new app folder and use the `dotnet build` command to compile your application:

   ```console
   cd ChatQuickstart
   dotnet build
   ```

### Install the package

Install the Communication Services Chat SDK for .NET:

```powershell
dotnet add package Azure.Communication.Chat
```

### Create a chat client

To create a chat client, use your Communication Services endpoint and the user access token you generated earlier. Use the `CommunicationIdentityClient` class from the Identity SDK to create a user and issue a token to pass to your chat client.

Copy the following code and paste it in the *Program.cs* source file:

```csharp
using Azure;
using Azure.Communication;
using Azure.Communication.Chat;
using System;

namespace ChatQuickstart
{
    class Program
    {
        static async System.Threading.Tasks.Task Main(string[] args)
        {
            // Your unique Communication Services endpoint
            Uri endpoint = new Uri("https://<RESOURCE_NAME>.communication.azure.com");

            CommunicationTokenCredential communicationTokenCredential = new CommunicationTokenCredential(<Access_Token>);
            ChatClient chatClient = new ChatClient(endpoint, communicationTokenCredential);
        }
    }
}
```

### Start a chat thread with the bot

Use the `createChatThread` method on `chatClient` to create a chat thread. Replace the ID with the bot's Communication Services ID.

```csharp
var chatParticipant = new ChatParticipant(identifier: new CommunicationUserIdentifier(id: "<BOT_ID>"))
{
    DisplayName = "BotDisplayName"
};
CreateChatThreadResult createChatThreadResult = await chatClient.CreateChatThreadAsync(topic: "Hello Bot!", participants: new[] { chatParticipant });
ChatThreadClient chatThreadClient = chatClient.GetChatThreadClient(threadId: createChatThreadResult.ChatThread.Id);
string threadId = chatThreadClient.Id;
```

### Get a chat thread client

The `GetChatThreadClient` method returns a thread client for a thread that already exists:

```csharp
string threadId = "<THREAD_ID>";
ChatThreadClient chatThreadClient = chatClient.GetChatThreadClient(threadId: threadId);
```

### Send a message to a chat thread

To use `SendMessage` to send a message to a thread:

```csharp
SendChatMessageOptions sendChatMessageOptions = new SendChatMessageOptions()
{
    Content = "Hello World",
    MessageType = ChatMessageType.Text
};

SendChatMessageResult sendChatMessageResult = await chatThreadClient.SendMessageAsync(sendChatMessageOptions);

string messageId = sendChatMessageResult.Id;
```

### Receive chat messages from a chat thread

You can get chat messages by polling the `GetMessages` method on the chat thread client at set intervals:

```csharp
AsyncPageable<ChatMessage> allMessages = chatThreadClient.GetMessagesAsync();
await foreach (ChatMessage message in allMessages)
{
    Console.WriteLine($"{message.Id}:{message.Content.Message}");
}
```

Check the list of messages for the bot's echo reply to "Hello World".

You can use JavaScript or the Azure mobile SDKs to subscribe to incoming message notifications:

```javascript
// Open notifications channel
await chatClient.startRealtimeNotifications();
// Subscribe to new notifications
chatClient.on("chatMessageReceived", (e) => {
  console.log("Notification chatMessageReceived!");
  // Your code here
});
```

### Clean up the chat thread

When you're finished using the chat thread, delete the thread:

```csharp
chatClient.DeleteChatThread(threadId);
```

### Deploy the C# chat application

To deploy the chat application:

1. In Visual Studio, open the chat project.

1. Right-click the **ChatQuickstart** project and select **Publish**:

   :::image type="content" source="./media/deploy-chat-application.png" alt-text="Screenshot that shows deploying the chat application to Azure from Visual Studio.":::

## More things you can do with a bot

A bot can receive more than a plain-text message from a user in a Communications Services Chat channel. Some of the activities a bot can receive from a user include:

- Conversation update
- Message update
- Message delete
- Typing indicator  
- Event activity
- Various attachments, including adaptive cards
- Bot channel data

The next sections show some samples to illustrate these features.

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

> [!NOTE] 
> Adaptive cards are only supported within Azure Communication Services use cases where all chat participants are Azure Communication Services users, and not for Teams interoprability use cases.

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

Learn more about [throttle limits](../../concepts/service-limits.md#chat).

## Troubleshoot

The following sections describe ways to troubleshoot common scenarios.

### Chat channel can't be added

In the [Microsoft Bot Framework developer portal](https://dev.botframework.com/bots), go to **Configuration** > **Bot Messaging** to verify that the endpoint has been set correctly.

### Bot gets a forbidden exception while replying to a message

Verify that the bot's Microsoft app ID and password are saved correctly in the bot configuration file you upload to the web app.

### Bot can't be added as a participant

Verify that the bot's Communication Services ID is used correctly when a request is sent to add a bot to a chat thread.

## Next steps

Try the [chat bot demo app](https://github.com/Azure/communication-preview/tree/master/samples/AzureBotService-Sample-App) for a 1:1 chat between a chat user and a bot via the BotFramework WebChat UI component.
