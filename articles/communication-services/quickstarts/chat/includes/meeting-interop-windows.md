---
title: Quickstart - Join a Teams meeting
author: juramir
ms.author: juramir
ms.date: 10/15/2021
ms.topic: include
ms.service: azure-communication-services
---

In this quickstart, you'll learn how to chat in a Teams meeting using the Azure Communication Services Chat SDK for C#.

## Sample code
Find the code for this quickstart on [GitHub](https://github.com/Azure-Samples/communication-services-dotnet-quickstarts/tree/main/ChatTeamsInteropQuickStart).

## Prerequisites 

* A [Teams deployment](/deployoffice/teams-install). 
* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).  
* Install [Visual Studio 2019](https://visualstudio.microsoft.com/downloads/) with Universal Windows Platform development workload.  
* A deployed Communication Services resource. [Create a Communication Services resource](../../create-communication-resource.md). 
* A Teams Meeting Link.

## Joining the meeting chat 

A Communication Services user can join a Teams meeting as an anonymous user using the Calling SDK. Joining the meeting will add them as a participant to the meeting chat as well, where they can send and receive messages with other users in the meeting. The user will not have access to chat messages that were sent before they joined the meeting and they will not be able to send or receive messages after the meeting ends. To join the meeting and start chatting, you can follow the next steps.

## Run the code
You can build and run the code on Visual Studio. Please note the solution platforms we support `x64`,`x86` and `ARM64`. 

1. Open an instance of PowerShell, Windows Terminal, Command Prompt or equivalent and navigate to the directory that you'd like to clone the sample to.
2. `git clone https://github.com/Azure-Samples/Communication-Services-dotnet-quickstarts.git`
3. Open the project ChatTeamsInteropQuickStart/ChatTeamsInteropQuickStart.csproj in Visual Studio.
4. Install the following NuGet packages versions (or higher):
``` csharp
Install-Package Azure.Communication.Calling -Version 1.0.0-beta.29
Install-Package Azure.Communication.Chat -Version 1.1.0
Install-Package Azure.Communication.Common -Version 1.0.1
Install-Package Azure.Communication.Identity -Version 1.0.1

```

5. With the Communication Services resource procured in pre-requisites, add the connectionstring to the **ChatTeamsInteropQuickStart/MainPage.xaml.cs** file. 

``` csharp
//Azure Communication Services resource connection string i.e = "endpoint=https://your-resource.communication.azure.net/;accesskey=your-access-key";
private const string connectionString_ = "";
```

> [!IMPORTANT]
> * Select the proper platform from the 'Solution Platforms' dropdown list in Visual Studio <b>before</b> running the code. i.e `x64`
> * Make sure you have the 'Developer Mode' in Windows 10 enabled [(Developer Settings)](/windows/apps/get-started/enable-your-device-for-development)
>  
>  *The next steps will not work if this is not configured properly*


6. Press F5 to start the project in debugging mode.
7. Paste a valid teams meeting link on the 'Teams Meeting Link' box (see next section)
8. Press 'Join Teams meeting' to start chatting.

> [!IMPORTANT]
> Once the calling SDK establishes the connection with the teams meeting [See Communication Services calling Windows app](../../voice-video-calling/getting-started-with-calling.md), the key functions to handle chat operations are: 
> StartPollingForChatMessages and SendMessageButton_Click. Both code snippets are in ChatTeamsInteropQuickStart\MainPage.xaml.cs 

```csharp
        /// <summary>
        /// Background task that keeps polling for chat messages while the call connection is stablished
        /// </summary>
        private async Task StartPollingForChatMessages()
        {
            CommunicationTokenCredential communicationTokenCredential = new(user_token_);
            chatClient_ = new ChatClient(EndPointFromConnectionString(), communicationTokenCredential);
            await Task.Run(async () =>
            {
                keepPolling_ = true;

                ChatThreadClient chatThreadClient = chatClient_.GetChatThreadClient(thread_Id_);
                int previousTextMessages = 0;
                while (keepPolling_)
                {
                    try
                    {
                        CommunicationUserIdentifier currentUser = new(user_Id_);
                        AsyncPageable<ChatMessage> allMessages = chatThreadClient.GetMessagesAsync();
                        SortedDictionary<long, string> messageList = new();
                        int textMessages = 0;
                        string userPrefix;
                        await foreach (ChatMessage message in allMessages)
                        {
                            if (message.Type == ChatMessageType.Html || message.Type == ChatMessageType.Text)
                            {
                                textMessages++;
                                userPrefix = message.Sender.Equals(currentUser) ? "[you]:" : "";
                                messageList.Add(long.Parse(message.SequenceId), $"{userPrefix}{StripHtml(message.Content.Message)}");
                            }
                        }

                        //Update UI just when there are new messages
                        if (textMessages > previousTextMessages)
                        {
                            previousTextMessages = textMessages;
                            await Dispatcher.RunAsync(CoreDispatcherPriority.Normal, () =>
                            {
                                TxtChat.Text = string.Join(Environment.NewLine, messageList.Values.ToList());
                            });

                        }
                        if (!keepPolling_)
                        {
                            return;
                        }

                        await SetInCallState(true);
                        await Task.Delay(3000);
                    }
                    catch (Exception e)
                    {
                        await Dispatcher.RunAsync(CoreDispatcherPriority.Normal, () =>
                        {
                            _ = new MessageDialog($"An error ocurred while fetching messages in PollingChatMessagesAsync(). The application will shutdown. Details : {e.Message}").ShowAsync();
                            throw e;
                        });
                        await SetInCallState(false);
                    }
                }
            });
        }
        private async void SendMessageButton_Click(object sender, RoutedEventArgs e)
        {
            SendMessageButton.IsEnabled = false;
            ChatThreadClient chatThreadClient = chatClient_.GetChatThreadClient(thread_Id_);
            _ = await chatThreadClient.SendMessageAsync(TxtMessage.Text);
            
            TxtMessage.Text = "";
            SendMessageButton.IsEnabled = true;
        }
```



## Get a Teams meeting link

The Teams meeting link can be retrieved using Graph APIs, detailed in [Graph documentation](/graph/api/onlinemeeting-createorget?tabs=http&view=graph-rest-beta&preserve-view=true). This link is returned as part of the `onlineMeeting` resource, accessible under the [`joinWebUrl` property](/graph/api/resources/onlinemeeting?view=graph-rest-beta&preserve-view=true). 

You can also get the required meeting link from the **Join Meeting** URL in the Teams meeting invite itself.
A Teams meeting link looks like this: `https://teams.microsoft.com/l/meetup-join/meeting_chat_thread_id/1606337455313?context=some_context_here`. 

:::image type="content" source="../join-teams-meeting-chat-quickstart-windows.png" alt-text="Screenshot of the completed csharp Application.":::

> [!NOTE] 
> Certain features are currently not supported for interoperability scenarios with Teams. Learn more about the supported features, please see [Teams meeting capabilities for Teams external users](../../../concepts/interop/guest/capabilities.md)

