---
title: Quickstart - Add a bot to your chat app
titleSuffix: A quickstart on how to use Chat SDK with  Bot Services 
description: This quickstart shows you how to build chat experience with a bot using Communication Services Chat SDK and Bot Services. 
author: gelli
manager: juramir
services: azure-communication-services
ms.author: gelli
ms.date: 01/25/2022
ms.topic: quickstart
ms.service: azure-communication-services
ms.custom: mode-other
---

# Quickstart: Add a bot to your chat app

> [!IMPORTANT]
> This functionality is in private preview, and restricted to a limited number of Azure Communication Services early adopters. You can [submit this form to request participation in the preview](https://forms.office.com/r/HBm8jRuuGZ) and we will review your scenario(s) and evaluate your participation in the preview.
>
> Private Preview APIs and SDKs are provided without a service-level agreement, and are not appropriate for production workloads and should only be used with test users and test data. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
> 
> For support, questions or to provide feedback or report issues, please use the [early adopters Teams channel](https://teams.microsoft.com/l/team/19%3af93daaae01b8427f8920eb7d3a552692%40thread.tacv2/conversations?groupId=d78f76f3-4229-4262-abfb-172587b7a6bb&tenantId=72f988bf-86f1-41af-91ab-2d7cd011db47). You must be a member of the Azure Communication Service TAP team.

In this quickstart, we'll learn how to build conversational AI experiences in our chat application using 'Communication Services-Chat' messaging channel available under Azure Bot Services. We will create a bot using BotFramework SDK and learn how to integrate this bot into our chat application that is built using Communication Services Chat SDK.

You will learn how to:

- [Create and deploy a bot](#step-1---create-and-deploy-a-bot)
- [Get an Azure Communication Services Resource](#step-2---get-an-azure-communication-services-resource)
- [Enable Communication Services' Chat Channel for the bot](#step-3---enable-acs-chat-channel)
- [Create a chat app and add bot as a participant](#step-4---create-a-chat-app-and-add-bot-as-a-participant)
- [explore additional features available for bot](#more-things-you-can-do-with-bot)

## Prerequisites
- Create an Azure account with an active subscription. For details, see [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
- Get your azure subscription and azure account allowlisted, currently for private preview, only allowlisted azure subscription will be able to see ACS channel option.
- [Visual Studio (2019 and above)](https://visualstudio.microsoft.com/vs/)
- [.NET Core 3.1](https://dotnet.microsoft.com/download/dotnet-core/3.1) (Make sure to install version that corresponds with your visual studio instance, 32 vs 64 bit)



## Step 1 - Create and deploy a bot

In order to use ACS chat as a channel in Azure Bot Service, the first step would be to deploy a bot. To do so one can follow these steps:

### Provision a bot service resource in Azure

   - Click on create a resource option in Azure portal.<br/><br/>![Create a new resource.png](./media/Create%20a%20new%20resource.png)


   - Search Azure Bot in the list of available resource types.<br/><br/>![Search Azure Bot.png](./media/Search%20Azure%20Bot.png)



   - Choose Azure Bot to create it.<br/><br/> 
![Creat Azure Bot.png](./media/Creat%20Azure%20Bot.png)


   - Finally create an Azure Bot resource. You might use an existing Microsoft app Id that you must have created or create a new one that gets created automatically. <br/><br/> 
 ![Provision Azure Bot.png](./media/Provision%20Azure%20Bot.png)

### Get Bot's MicrosoftAppId and MicrosoftAppPassword

After creating the Azure Bot resource, next step would be to set a password for the App Id we set for the Bot credential if you chose to create one automatically in the first step.

 - Go to Azure Active Directory
![Azure Active Directory](./media/AAD.png)


- Find your app in the App Registration blade

![App Registration.png](./media/App%20Registration.png)

- Create a new password for your app from the `Certificates and Secrets` blade and copy the password you create as you will not be able to copy it again.. <br/><br/> 
![Save password.png](./media/Save%20password.png)

### Create a Web App where actual bot logic resides

Create a Web App where actual bot logic resides. You could check out some samples [here](https://github.com/Microsoft/BotBuilder-Samples) and tweak them or use Bot Builder SDK to create one: [Bot Builder documentation](https://docs.microsoft.com/composer/introduction). One of the simplest ones to play around with is Echo Bot located here with steps on how to use it and it is the one we will use in this example [Echo Bot](https://github.com/microsoft/BotBuilder-Samples/tree/main/samples/csharp_dotnetcore/02.echo-bot). Generally, the Bot Service expects the Bot Application Web App Controller to expose an endpoint `/api/messages` which handles all the messages reaching the bot. To create the Bot application, follow these steps.

   - As in previously shown create a resource and choose `Web App` in search. <br/><br/> 
![Web app.png](./media/Web%20app.png)



   - Configure the options you want to set including the region you want to deploy it to. <br/><br/> 
![Web App Create Options.png](./media/Web%20App%20Create%20Options.png)




   - Review your options and create the Web App and move to the resource once its been provisioned and copy the hostname URL exposed by the Web App.<br/><br/>  ![Web App endpoint.png](./media/Web%20App%20endpoint.png)



### Configure the Azure Bot

Configure the Azure Bot we created with its Web App endpoint where the bot logic is located. To do this, copy the hostname URL of the Web App and append it with `/api/messages` <br/><br/> ![Bot Configure with Endpoint.png](./media/Bot%20Configure%20with%20Endpoint.png)



### Deploy the Azure Bot

The final step would be to deploy the bot logic to the Web App we created. As we mentioned for this tutorial we will be using the Echo Bot. This bot only demonstrates a limited set of capabilities, such as echoing the user input. Here is how we deploy it to Azure Web App.

   - To use the samples, clone this Github repository using Git.

     ``` 
     git clone https://github.com/Microsoft/BotBuilder-Samples.gitcd BotBuilder-Samples
     ```
   - Open the project located here [Echo bot](https://github.com/microsoft/BotBuilder-Samples/tree/main/samples/csharp_dotnetcore/02.echo-bot) in Visual Studio.

   - Go to the appsettings.json file inside the project and copy the AAD application ID and password we created in step 2 in respective places.
      ```js
      {
        "MicrosoftAppId": "<App-registration-id>",
        "MicrosoftAppPassword": "<App-password>"
      }
      ```

   - Click on the project to publish the web app code to Azure. Choose the publish option in Visual Studio. <br/><br/>![Publish app.png](./media/Publish%20app.png)


   - Click on New to create a new publishing profile, choose Azure as the target, and Azure App Service as the specific target.

![Select Azure as Target.png](./media/Select%20Azure%20as%20Target.png)
![Select App Service.png](./media/Select%20App%20Service.png)

   - Lastly, the above option opens the deployment config. Choose the Web App we had provisioned from the list of options it comes up with after signing into your Azure account. Once ready click on `Finish` to start the deployment. <br/><br/>![Deployment config.png](./media/Deployment%20config.png)

## Step 2 - Get an Azure Communication Services Resource
Now that you got the bot part sorted out, we will need to get an ACS resource which we would use for configuring the ACS channel.
- Create an Azure Communication Services resource. For details, see [Create an Azure Communication Services resource](../../quickstarts/create-communication-resource.md). You'll need to **record your resource endpoint and key** for this quickstart.
- Create a ACS User and issue a user access token [User Access Token](../../quickstarts/access-tokens.md). Be sure to set the scope to **chat**, and **note the token string as well as the userId string**.

## Step 3 - Enable ACS Chat Channel
With the ACS resource, we can configure the ACS channel in Azure Bot to bind an ACS user ID with a bot. Note that currently, only the allowlisted azure subscription will be able to see ACS channel option.
1. Go to your Bot Services resource on Azure portal. Navigate to `Channels` blade and click on `Azure Communications Services - Chat` channel from the list provided. <br/><br/> 
![DemoApp Launch Acs Chat.png](./media/DemoApp-LaunchAcsChat.png)

   
2. Provide the resource endpoint and the key belonging to the ACS resource that you want to connect with.

   ![DemoApp Connect Acs Resource.png](./media/DemoApp-ConnectAcsResource.png)


3. Once the provided resource details are verified, you will see the **bot's ACS ID** assigned. With this ID, you can add the bot to the conversation at whenever appropriate using Chat's AddParticipant API. Once the bot is added as participant to a chat, it will start receiving chat related activities and can respond back in the chat thread. 

 ![DemoApp Bot Detail.png](./media/DemoApp-BotDetail.png)



## Step 4 - Create a chat app and add bot as a participant
Now that you have the bot's ACS ID, you will be able to create a chat thread with bot as a participant. 
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

To create a chat client, you'll use your Communication Services endpoint and the access token that was generated as part of Step 2. You need to use the `CommunicationIdentityClient` class from the Identity SDK to create a user and issue a token to pass to your chat client.


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

Use the `createChatThread` method on the chatClient to create a chat thread, replace with the bot's ACS ID you obtained.
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
When creating the actual chat applications, you can also receive real-time chat messages by subscribing to listen for new incoming messages using our Javascript or mobile SDKs. An example using Javascript SDK would be:
```js
// open notifications channel
await chatClient.startRealtimeNotifications();
// subscribe to new notification
chatClient.on("chatMessageReceived", (e) => {
  console.log("Notification chatMessageReceived!");
  // your code here
});
```


### Deploy the C# chat application
If you would like to deploy the chat application, you can follow the steps below:
- Open the chat project in Visual Studio.
- Right click on the ChatQuickstart project and click Publish

![Deploy Chat Application.png](./media/Deploy%20Chat%20Application.png)


## More things you can do with bot
Besides simple text message, bot is also able to receive and send many other activities including
- Conversation update
- Message update
- Message delete 
- Typing indicator  
- Event activity

### Send a welcome message when a new user is added to the thread
With the current Echo Bot logic, it accepts input from the user and echoes it back. If you would like to add additional logic such as responding to a participant added ACS event, copy the following code snippets and paste into the source file: [EchoBot.cs](https://github.com/microsoft/BotBuilder-Samples/blob/main/samples/csharp_dotnetcore/02.echo-bot/Bots/EchoBot.cs)

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

To help you increase engagement and efficiency and communicate with users in a variety of ways, you can send adaptive cards to the chat thread. You can send adaptive cards from a bot by adding them as bot activity attachments.


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

And on the ACS user side, the ACS message's metadata field will indicate this is a message with attachment.The key is microsoft.azure.communication.chat.bot.contenttype which is set to the value azurebotservice.adaptivecard. This is an example of the chat message that will be received:

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

## Next steps

Try the [Sample App](/SPOOL/Services-and-Teams/Chat/Tech-Briefs/BotFramework-integration-:-Acs-Channel/Documentation-for-Private-Preview/Demo-App-Quickstart), which showcases a 1:1 chat between the end user and chat bot, and uses BotFramework's WebChat UI component.
