---
title: Add a bot to your chat app
titleSuffix: A quickstart on how to use Azure Chat SDK with Azure Bot Services 
description: This quickstart shows you how to build chat experience with a bot using Communication Services Chat SDK and Bot Services. 
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

In this quickstart, you will learn how to build conversational AI experiences in a chat application using Azure Communication Services Chat messaging channel that is available under Azure Bot Services. This article will describe how to create a bot using BotFramework SDK and how to integrate this bot into any chat application that is built using Communication Services Chat SDK.

You will learn how to:

- [Create and deploy an Azure bot](#step-1---create-and-deploy-an-azure-bot)
- [Get an Azure Communication Services resource](#step-2---get-an-azure-communication-services-resource)
- [Enable Communication Services Chat channel for the bot](#step-3---enable-azure-communication-services-chat-channel)
- [Create a chat app and add bot as a participant](#step-4---create-a-chat-app-and-add-bot-as-a-participant)
- [Explore more features available for bot](#more-things-you-can-do-with-a-bot)

## Prerequisites
- Create an Azure account with an active subscription. For details, see [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
- [Visual Studio (2019 and above)](https://visualstudio.microsoft.com/vs/)
- Latest version of .NET Core. For this tutorial, we have used [.NET Core 3.1](https://dotnet.microsoft.com/download/dotnet-core/3.1) (Make sure to install the version that corresponds with your visual studio instance, 32 vs 64 bit)

## Step 1 - Create and deploy an Azure bot

To use Azure Communication Services chat as a channel in Azure Bot Service, the first step is to deploy a bot. You can do so by following below steps:

### Create an Azure bot service resource in Azure

   Refer to the Azure Bot Service documentation on how to [create a bot](/azure/bot-service/abs-quickstart?tabs=userassigned).

   For this example, we have selected a multitenant bot but if you wish to use single tenant or managed identity bots refer to [configuring single tenant and managed identity bots](#support-for-single-tenant-and-managed-identity-bots).
   

### Get Bot's MicrosoftAppId and MicrosoftAppPassword

   Fetch your Azure bot's [Microsoft App ID and secret](/azure/bot-service/abs-quickstart?tabs=userassigned#to-get-your-app-or-tenant-id) as you will need those values for configurations.

### Create a Web App where the bot logic resides

 You can check out some samples at [Bot Builder Samples](https://github.com/Microsoft/BotBuilder-Samples) and tweak them or use [Bot Builder SDK](/composer/introduction) to create one. One of the simplest samples is [Echo Bot](https://github.com/microsoft/BotBuilder-Samples/tree/main/samples/csharp_dotnetcore/02.echo-bot). Generally, the Azure Bot Service expects the Bot Application Web App Controller to expose an endpoint `/api/messages`, which handles all the messages reaching the bot. To create the bot application, you can either use Azure CLI to [create an App Service](/azure/bot-service/provision-app-service?tabs=singletenant%2Cexistingplan) or directly create from the portal using below steps.

   1. Select `Create a resource` and in the search box, search for web app and select `Web App`. 
   
   :::image type="content" source="./media/web-app.png" alt-text="Screenshot of creating a Web app resource in Azure portal.":::


   2. Configure the options you want to set including the region you want to deploy it to.
   
   :::image type="content" source="./media/web-app-create-options.png" alt-text="Screenshot of specifying Web App create options to set.":::

   3. Review your options and create the Web App and  once it has been created, copy the hostname URL exposed by the Web App.
   
   :::image type="content" source="./media/web-app-endpoint.png" alt-text="Diagram that shows how to copy the newly created Web App endpoint.":::


### Configure the Azure Bot

Configure the Azure Bot you created with its Web App endpoint where the bot logic is located. To do this configuration, copy the hostname URL of the Web App from previous step and append it with `/api/messages` 

   :::image type="content" source="./media/smaller-bot-configure-with-endpoint.png" alt-text="Diagram that shows how to set bot messaging endpoint with the copied Web App endpoint." lightbox="./media/bot-configure-with-endpoint.png":::


### Deploy the Azure Bot

The final step would be to deploy the Web App we created. The Echo bot functionality is limited to echoing the user input. Here's how we deploy it to Azure Web App.

   1. To use the samples, clone this GitHub repository using Git.
     ``` 
     git clone https://github.com/Microsoft/BotBuilder-Samples.git
     cd BotBuilder-Samples
     ```
   2. Open the project located here [Echo bot](https://github.com/microsoft/BotBuilder-Samples/tree/main/samples/csharp_dotnetcore/02.echo-bot) in Visual Studio.

   3. Go to the appsettings.json file inside the project and copy the [Microsoft application ID and secret](#get-bots-microsoftappid-and-microsoftapppassword)  in their respective placeholders.
      ```js
      {
        "MicrosoftAppId": "<App-registration-id>",
        "MicrosoftAppPassword": "<App-password>"
      }
      ```
   For deploying the bot, you can either use command line to [deploy an Azure bot](/azure/bot-service/provision-and-publish-a-bot?tabs=userassigned%2Ccsharp) or use Visual studio for C# bots as described below.

   1. Select the project to publish the Web App code to Azure. Choose the publish option in Visual Studio. 

   :::image type="content" source="./media/publish-app.png" alt-text="Screenshot of publishing your Web App from Visual Studio.":::

   2. Select New to create a new publishing profile, choose Azure as the target, and Azure App Service as the specific target.

   :::image type="content" source="./media/select-azure-as-target.png" alt-text="Diagram that shows how to select Azure as target in a new publishing profile.":::
   
   :::image type="content" source="./media/select-app-service.png" alt-text="Diagram that shows how to select specific target as Azure App Service.":::

   3. Lastly, the above option opens the deployment config. Choose the Web App we had created from the list of options it comes up with after signing into your Azure account. Once ready select `Finish` to complete the profile, and then select `Publish` to start the deployment.
   
   :::image type="content" source="./media/smaller-deployment-config.png" alt-text="Screenshot of setting deployment config with the created Web App name." lightbox="./media/deployment-config.png":::

## Step 2 - Get an Azure Communication Services Resource
Now that bot is created and deployed, you will need an Azure Communication Services resource, which you can use to configure the Azure Communication Services channel.
1. Create an Azure Communication Services resource. For details, see [Create an Azure Communication Services resource](../../quickstarts/create-communication-resource.md).

2. Create an Azure Communication Services User and issue a [User Access Token](../../quickstarts/access-tokens.md). Be sure to set the scope to **chat**, and **note the token string as well as the userId string**.

## Step 3 - Enable Azure Communication Services Chat channel
With the Azure Communication Services resource, you can set up the Azure Communication Services channel in Azure Bot to assign an Azure Communication Services User ID to a bot.

1. Go to your Bot Services resource on Azure portal. Navigate to `Channels` configuration on the left pane and select `Azure Communications Services - Chat` channel from the list provided. 
 
   :::image type="content" source="./media/smaller-demoapp-launch-acs-chat.png" alt-text="Screenshot of launching Azure Communication Services Chat channel." lightbox="./media/demoapp-launch-acs-chat.png":::

   
2. Select the connect button to see a list of Communication resources available under your subscriptions.

   :::image type="content" source="./media/smaller-bot-connect-acs-chat-channel.png" alt-text="Diagram that shows how to connect an Azure Communication Service Resource to this bot." lightbox="./media/bot-connect-acs-chat-channel.png":::

3. Once you have selected the required Azure Communication Services resource from the resources dropdown list, press the apply button.

   :::image type="content" source="./media/smaller-bot-choose-resource.png" alt-text="Diagram that shows how to save the selected Azure Communication Service resource to create a new Azure Communication Services user ID." lightbox="./media/bot-choose-resource.png":::

4. Once the provided resource details are verified, you will see the **bot's Azure Communication Services ID** assigned. With this ID, you can add the bot to the conversation whenever appropriate using Chat's AddParticipant API. Once the bot is added as participant to a chat, it will start receiving chat related activities, and can respond back in the chat thread. 

   :::image type="content" source="./media/smaller-acs-chat-channel-saved.png" alt-text="Screenshot of new Azure Communication Services user ID assigned to the bot." lightbox="./media/acs-chat-channel-saved.png":::


## Step 4 - Create a chat app and add bot as a participant
Now that you have the bot's Azure Communication Services ID, you can create a chat thread with the bot as a participant.

### Create a new C# application

```console
dotnet new console -o ChatQuickstart
```

Change your directory to the newly created app folder and use the `dotnet build` command to compile your application.

```console
cd ChatQuickstart
dotnet build
```

### Install the package

Install the Azure Communication Chat SDK for .NET

```PowerShell
dotnet add package Azure.Communication.Chat
```

### Create a chat client

To create a chat client, you will use your Azure Communication Services endpoint and the access token that was generated as part of Step 2. You need to use the `CommunicationIdentityClient` class from the Identity SDK to create a user and issue a token to pass to your chat client.


Copy the following code snippets and paste into source file: **Program.cs**
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

Use the `createChatThread` method on the chatClient to create a chat thread, replace with the bot's Azure Communication Services ID you obtained.
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

Use `SendMessage` to send a message to a thread.
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

You can retrieve chat messages by polling the `GetMessages` method on the chat thread client at specified intervals.

```csharp
AsyncPageable<ChatMessage> allMessages = chatThreadClient.GetMessagesAsync();
await foreach (ChatMessage message in allMessages)
{
    Console.WriteLine($"{message.Id}:{message.Content.Message}");
}
```
You should see bot's echo reply to "Hello World" in the list of messages.
When creating the chat applications, you can also receive real-time notifications by subscribing to listen for new incoming messages using our JavaScript or mobile SDKs. An example using JavaScript SDK would be:
```js
// open notifications channel
await chatClient.startRealtimeNotifications();
// subscribe to new notification
chatClient.on("chatMessageReceived", (e) => {
  console.log("Notification chatMessageReceived!");
  // your code here
});
```

### Clean up the chat thread

Delete the thread when finished.

```csharp
chatClient.DeleteChatThread(threadId);
```

### Deploy the C# chat application
Follow these steps to deploy the chat application:
1. Open the chat project in Visual Studio.
2. Select the ChatQuickstart project and from the right-click menu, select Publish

   :::image type="content" source="./media/deploy-chat-application.png" alt-text="Screenshot of deploying chat application to Azure from Visual Studio.":::


## More things you can do with a bot
In addition to sending a plain text message, a bot is also able to receive many other activities from the user through Azure Communications Services Chat channel including
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
You can find sample payloads for adaptive cards at [Samples and Templates](https://adaptivecards.io/samples)

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

* ### Send a message from user to bot

You can send a simple text message from user to bot just the same way you send a text message to another user.
However, when sending a message carrying an attachment from a user to the bot, you will need to add this flag to the Communication Services Chat metadata `"microsoft.azure.communication.chat.bot.contenttype": "azurebotservice.adaptivecard"`. For sending an event activity from user to bot, you will need to add to Communication Services Chat metadata `"microsoft.azure.communication.chat.bot.contenttype": "azurebotservice.event"`. Below are sample formats for user to bot Chat messages.

  * #### Simple text message

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

  * #### Message with an attachment

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

  * #### Message with an event activity

Event payload comprises all json fields in the message content except name field, which should contain the name of the event. Below event name `endOfConversation` with the payload `"{field1":"value1", "field2": { "nestedField":"nestedValue" }}` is sent to the bot.
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

> The metadata field `"microsoft.azure.communication.chat.bot.contenttype"` is only needed in user to bot direction. It is not needed in bot to user direction.

## Supported bot activity fields

### Bot to user flow

#### Activities

- Message activity
- Typing activity

#### Message activity fields
- `Text`
- `Attachments`
- `AttachmentLayout`
- `SuggestedActions`
- `From.Name` (Converted to Azure Communication Services SenderDisplayName)
- `ChannelData` (Converted to Azure Communication Services Chat Metadata. If any `ChannelData` mapping values are objects, then they'll be serialized in JSON format and sent as a string)

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

- `Recipient.Id` and `Recipeint.Name` (Azure Communication Services Chat user ID and display name)
- `From.Id` and `From.Name` (Azure Communication Services Chat user ID and display name)
- `Conversation.Id` (Azure Communication Services Chat thread ID)
- `ChannelId` (AcsChat if empty)
- `ChannelData` (Azure Communication Services Chat message metadata)

## Support for single tenant and managed identity bots

Azure Communication Services Chat channel supports single tenant and managed identity bots as well. Refer to [bot identity information](/azure/bot-service/bot-builder-authentication?tabs=userassigned%2Caadv2%2Ccsharp#bot-identity-information) to set up your bot web app.

For managed identity bots, additionally, you might have to [update bot service identity](/azure/bot-service/bot-builder-authentication?tabs=userassigned%2Caadv2%2Ccsharp#to-update-your-app-service).

## Bot handoff patterns

Sometimes the bot wouldn't be able to understand or answer a question or a customer can request to be connected to a human agent. Then it will be necessary to handoff the chat thread from a bot to a human agent. In such cases, you can design your application to [transition conversation from bot to human](/azure/bot-service/bot-service-design-pattern-handoff-human).

## Handling bot to bot communication

 There may be certain use cases where two bots need to be added to the same chat thread to provide different services. In such use cases, you may need to ensure that bots don't start sending automated replies to each other's messages. If not handled properly, the bots' automated interaction between themselves may result in an infinite loop of messages. You can verify the Azure Communication Services user identity of the sender of a message from the activity's `From.Id` field to see if it belongs to another bot and take required action to prevent such a communication flow. If such a scenario results in high call volumes, then Azure Communication Services Chat channel will start throttling the requests, which will result in the bot not being able to send and receive the messages. You can learn more about the [throttle limits](/azure/communication-services/concepts/service-limits#chat).

## Troubleshooting

### Chat channel cannot be added

- Verify that in the Azure Bot Framework (ABS) portal, Configuration -> Bot Messaging endpoint has been set correctly.

### Bot gets a forbidden exception while replying to a message

- Verify that bot's Microsoft App ID and secret are saved correctly in the bot configuration file uploaded to the webapp.

### Bot is not able to be added as a participant

- Verify that bot's Azure Communication Services ID is being used correctly while sending a request to add bot to a chat thread.

## Next steps

Try the [Sample App](https://github.com/Azure/communication-preview/tree/master/samples/AzureBotService-Sample-App), which showcases a 1:1 chat between the end user and chat bot, and uses BotFramework's WebChat UI component.
