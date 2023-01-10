---
title: Add a bot to your chat app
titleSuffix: An Azure Communication Services quickstart 
description: Learn how to build a chat experience with a bot by using the Azure Communication Services Chat SDK and Azure Bot Service. 
author: tariqzafar
manager: potsang
services: azure-communication-services
ms.author: tariqzafar
ms.date: 10/18/2022
ms.topic: quickstart
ms.service: azure-communication-services
ms.custom: mode-other
---

# Add a bot to your chat app

[!INCLUDE [Public Preview Notice](../../includes/public-preview-include.md)]

Learn how to build conversational AI experiences in a chat application by using the Azure Communication Services Chat messaging channel that's available in Azure Bot Service. In this quickstart, you create a bot by using the BotFramework SDK. Then, you integrate the bot into a chat application you create by using the Azure Communication Services Chat SDK.

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

To use Azure Communication Services chat as a channel in Azure Bot Service, the first step is to deploy a bot:

- Create an Azure Bot Service resource
- Get the bot's app ID and paassword
- Create a web app to hold the bot logic
- Create a messaging endpoint for the bot

### Create an Azure Bot Service resource

First, [use the Azure portal to create an Azure bot resource](/azure/bot-service/abs-quickstart?tabs=userassigned).

This quickstart uses a multitenant bot. To use a single-tenant bot or a managed identity bot, see [Support for single-tenant and managed identity bots](#support-for-single-tenant-and-managed-identity-bots).

### Get the bot's app ID and app password

Next, [get the Microsoft App ID and password](/azure/bot-service/abs-quickstart?tabs=userassigned#to-get-your-app-or-tenant-id) that are assigned to your bot when it's deployed. You use these values for later configurations.

### Create a web app to hold the bot logic

To create a web app for your bot, you can revise [Bot Builder samples](https://github.com/Microsoft/BotBuilder-Samples) for your scenario or use the [Bot Builder SDK](/composer/introduction) to create a web app. One of the simplest samples is [Echo Bot](https://github.com/microsoft/BotBuilder-Samples/tree/main/samples/csharp_dotnetcore/02.echo-bot).

The Azure Bot Service typically expects the Bot Application Web App Controller to expose an endpoint in the form `/api/messages`. The endpoint handles all messages that are sent to the bot.

To create the bot app, either use the Azure CLI to [create an App Service](/azure/bot-service/provision-app-service?tabs=singletenant%2Cexistingplan) or create the app in the Azure portal.

To create a bot web app by using the Azure portal:

1. In the portal, select **Create a resource**. In the search box, enter **web app**. Select the **Web App** tile.
  
   :::image type="content" source="./media/web-app.png" alt-text="Screenshot that shows creating a web app resource in the Azure portal.":::

1. In **Create Web App**, select or enter details for the app, including the region you want to deploy it to.
  
   :::image type="content" source="./media/web-app-create-options.png" alt-text="Screenshot that shows details to set to create a web app deployment.":::

1. Select **Review + Create** to validate the deployment and review the deployment details. Then, select **Create**.

1. When the web app resource is created, copy the hostname URL that's shown in the resource details. The URL is part of the endpoint you create for the web app.
  
   :::image type="content" source="./media/web-app-endpoint.png" alt-text="Screenshot that shows how to copy the web app endpoint URL.":::

### Create a messaging endpoint for the bot

Next, in the bot resource, create a web app messaging endpoint:

1. In the Azure portal, go to the bot resource. In the resource menu, select **Configuration**.

1. In **Configuration**, for **Messaging endpoint**, paste the hostname URL of the Web App from the previous step and append it with `/api/messages`.

1. Select **Save**.

:::image type="content" source="./media/smaller-bot-configure-with-endpoint.png" alt-text="Screenshot that shows how to create a bot messaging endpoint by using the web app hostname." lightbox="./media/bot-configure-with-endpoint.png":::

### Deploy the web app

The final step is to deploy the web app. For this quickstart, use the Echo Bot sample. The Echo Bot functionality is limited to echoing the user input. Here's how you deploy it to your web app in Azure:

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

1. Lastly, the above option opens the deployment config. Choose the Web App we had created from the list of options it comes up with after signing into your Azure account. Once ready select `Finish` to complete the profile, and then select `Publish` to start the deployment.
  
   :::image type="content" source="./media/smaller-deployment-config.png" alt-text="Screenshot of setting deployment config with the created Web App name." lightbox="./media/deployment-config.png":::

## Get a Communication Services resource

Now that bot is created and deployed, you will need an Azure Communication Services resource, which you can use to configure the Azure Communication Services channel.

1. Create an Azure Communication Services resource. For details, see [Create an Azure Communication Services resource](../../quickstarts/create-communication-resource.md).

1. Create an Azure Communication Services User and issue a [User Access Token](../../quickstarts/access-tokens.md). Be sure to set the scope to **chat**, and **note the token string as well as the userId string**.

## Enable the Communication Services Chat channel

With the Azure Communication Services resource, you can set up the Azure Communication Services channel in Azure Bot to assign an Azure Communication Services User ID to a bot.

1. Go to your Bot Services resource on Azure portal. Navigate to `Channels` configuration on the left pane and select `Azure Communications Services - Chat` channel from the list provided.

   :::image type="content" source="./media/smaller-demoapp-launch-acs-chat.png" alt-text="Screenshot of launching Azure Communication Services Chat channel." lightbox="./media/demoapp-launch-acs-chat.png":::

1. Select the connect button to see a list of Communication resources available under your subscriptions.

   :::image type="content" source="./media/smaller-bot-connect-acs-chat-channel.png" alt-text="Diagram that shows how to connect an Azure Communication Service Resource to this bot." lightbox="./media/bot-connect-acs-chat-channel.png":::

1. Once you have selected the required Azure Communication Services resource from the resources dropdown list, press the apply button.

   :::image type="content" source="./media/smaller-bot-choose-resource.png" alt-text="Diagram that shows how to save the selected Azure Communication Service resource to create a new Azure Communication Services user ID." lightbox="./media/bot-choose-resource.png":::

1. Once the provided resource details are verified, you will see the **bot's Azure Communication Services ID** assigned. With this ID, you can add the bot to the conversation whenever appropriate using Chat's AddParticipant API. Once the bot is added as participant to a chat, it will start receiving chat related activities, and can respond back in the chat thread. 

   :::image type="content" source="./media/smaller-acs-chat-channel-saved.png" alt-text="Screenshot of new Azure Communication Services user ID assigned to the bot." lightbox="./media/acs-chat-channel-saved.png":::

## Create a chat app and add the bot as a participant

Now that you have the bot's Azure Communication Services ID, you can create a chat thread with the bot as a participant.

### Create a new C# application

1. Run the following command to create a new C# application:

   ```console
   dotnet new console -o ChatQuickstart
   ```

1. Change your directory to the newly created app folder and use the `dotnet build` command to compile your application:

   ```console
   cd ChatQuickstart
   dotnet build
   ```

### Install the package

Install the Azure Communication Chat SDK for .NET:

```powerahell
dotnet add package Azure.Communication.Chat
```

### Create a chat client

To create a chat client, use your Azure Communication Services endpoint and the access token that was generated as part of Step 2. You need to use the `CommunicationIdentityClient` class from the Identity SDK to create a user and issue a token to pass to your chat client.

Copy the following code snippets and paste into the *Program.cs* source file:

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
            // Your unique Azure Communication service endpoint
            Uri endpoint = new Uri("https://<RESOURCE_NAME>.communication.azure.com");

            CommunicationTokenCredential communicationTokenCredential = new CommunicationTokenCredential(<Access_Token>);
            ChatClient chatClient = new ChatClient(endpoint, communicationTokenCredential);
        }
    }
}
```

### Start a chat thread with the bot

Use the `createChatThread` method on `chatClient` to create a chat thread, replace with the bot's Azure Communication Services ID you obtained.

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

The `GetChatThreadClient` method returns a thread client for a thread that already exists.

```csharp
string threadId = "<THREAD_ID>";
ChatThreadClient chatThreadClient = chatClient.GetChatThreadClient(threadId: threadId);
```

### Send a message to a chat thread

Use `SendMessage` to send a message to a thread:

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

You can get chat messages by polling the `GetMessages` method on the chat thread client at specified intervals:

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

In addition to sending a plain-text message, a bot also can receive many other activities from the user through Azure Communications Services Chat channel including

- Conversation update
- Message update
- Message delete
- Typing indicator  
- Event activity
- Various attachments including Adaptive cards
- Bot channel data

Below are some samples to illustrate these features:

### Send a welcome message when a new user is added to the thread

The current Echo Bot logic accepts input from the user and echoes it back. If you would like to add extra logic such as responding to a participant added Azure Communication Services event, copy the following code snippets and paste into the source file: [EchoBot.cs](https://github.com/microsoft/BotBuilder-Samples/blob/main/samples/csharp_dotnetcore/02.echo-bot/Bots/EchoBot.cs)

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

Sending adaptive cards to the chat thread can help you increase engagement and efficiency and communicate with users in a variety of ways. You can send adaptive cards from a bot by adding them as bot activity attachments.

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

You can find sample payloads for adaptive cards at [Samples and Templates](https://adaptivecards.io/samples).

On the Azure Communication Services User side, the Azure Communication Services Chat channel will add a field to the message's metadata that will indicate that this  message has an attachment. The key in the metadata is `microsoft.azure.communication.chat.bot.contenttype`, which is set to the value `azurebotservice.adaptivecard`. Here is an example of the chat message that will be received:

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

You can send a simple text message from user to bot just the same way you send a text message to another user.

However, when sending a message carrying an attachment from a user to the bot, you will need to add this flag to the Communication Services Chat metadata `"microsoft.azure.communication.chat.bot.contenttype": "azurebotservice.adaptivecard"`. For sending an event activity from user to bot, you will need to add to Communication Services Chat metadata `"microsoft.azure.communication.chat.bot.contenttype": "azurebotservice.event"`. Below are sample formats for user to bot Chat messages.

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

Event payload comprises all JSON fields in the message content except `Name`,  which should contain the name of the event. Below event name `endOfConversation` with the payload `"{field1":"value1", "field2": { "nestedField":"nestedValue" }}` is sent to the bot.

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

The metadata field `"microsoft.azure.communication.chat.bot.contenttype"` is needed only in the user-to-bot direction. It's not needed in the bot-to-user direction.

## Supported bot activity fields

### Bot-to-user flow

#### Activities

- Message activity
- Typing activity

#### Message activity fields

- `Text`
- `Attachments`
- `AttachmentLayout`
- `SuggestedActions`
- `From.Name` (converted to Azure Communication Services `SenderDisplayName`)
- `ChannelData` (Converted to Azure Communication Services `Chat Metadata`. If any `ChannelData` mapping values are objects, they're serialized in JSON format and sent as a string.)

### User to bot flow

#### Activities and fields

- Message activity

  - `Id` (Azure Communication Services Chat message ID)
  - `TimeStamp`
  - `Text`
  - `Attachments`

- Conversation update activity

  - `MembersAdded`
  - `MembersRemoved`
  - `TopicName`

- Message update activity

  - `Id` (Updated Azure Communication Services Chat message ID)
  - `Text`
  - `Attachments`

- Message delete activity

  - `Id` (Deleted Azure Communication Services Chat message ID)

- Event activity

  - `Name`
  - `Value`

- Typing activity

#### Other common fields

- `Recipient.Id` and `Recipient.Name` (Azure Communication Services Chat user ID and display name)
- `From.Id` and `From.Name` (Azure Communication Services Chat user ID and display name)
- `Conversation.Id` (Azure Communication Services Chat thread ID)
- `ChannelId` (AcsChat if empty)
- `ChannelData` (Azure Communication Services Chat message metadata)

## Support for single tenant and managed identity bots

Azure Communication Services Chat channel supports single tenant and managed identity bots as well. Refer to [bot identity information](/azure/bot-service/bot-builder-authentication?tabs=userassigned%2Caadv2%2Ccsharp#bot-identity-information) to set up your bot web app.

For managed identity bots, additionally, you might have to [update bot service identity](/azure/bot-service/bot-builder-authentication?tabs=userassigned%2Caadv2%2Ccsharp#to-update-your-app-service).

## Bot handoff patterns

Sometimes the bot doesn't understand or can't answer a question, or a customer requests to be connected to a human agent. In this scenario, it's necessary to hand off the chat thread from the bot to a human agent. You can design your application to [transition conversation from bot to human](/azure/bot-service/bot-service-design-pattern-handoff-human).

## Handling bot-to-bot communication

There may be certain use cases where two bots need to be added to the same chat thread to provide different services. In such use cases, you may need to ensure that bots don't start sending automated replies to each other's messages. If not handled properly, the bots' automated interaction between themselves may result in an infinite loop of messages. You can verify the Azure Communication Services user identity of the sender of a message from the activity's `From.Id` field to see if it belongs to another bot and take required action to prevent such a communication flow. If such a scenario results in high call volumes, then Azure Communication Services Chat channel will start throttling the requests, which will result in the bot not being able to send and receive the messages. You can learn more about the [throttle limits](/azure/communication-services/concepts/service-limits#chat).

## Troubleshoot

The following sections describe ways to troubleshoot common scenarios.

### Chat channel can't be added

In the Azure Bot Framework portal, go to **Configuration** > **Bot Messaging** to verify that the endpoint has been set correctly.

### Bot gets a forbidden exception while replying to a message

Verify that bot's Microsoft App ID and password are saved correctly in the bot configuration file uploaded to the web app.

### Bot can't be added as a participant

Verify that the bot's Azure Communication Services ID is being used correctly while sending a request to add bot to a chat thread.

## Next steps

Try the [Sample App](https://github.com/Azure/communication-preview/tree/master/samples/AzureBotService-Sample-App), which showcases a 1:1 chat between the chat user and the chat bot, and uses BotFramework's WebChat UI component.
