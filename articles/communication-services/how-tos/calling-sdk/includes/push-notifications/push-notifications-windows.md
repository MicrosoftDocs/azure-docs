---
author: probableprime
ms.service: azure-communication-services
ms.topic: include
ms.date: 03/26/2024
ms.author: jsaurezlee
---
[!INCLUDE [Install SDK](../install-sdk/install-sdk-windows.md)]

## Overview
Push notifications on Windows platform are delivered using `Windows Push Notification Service (WNS),`.

> [!NOTE]
> To Register for Push Notifications and handling of the Push Notifications for a Custom Teams Endpoint (CTE) the API's are the same. The API's described below can also be invoked on the `CommonCallAgent` or `TeamsCallAgent` class for Custom Teams Endpoint (CTE).

## Set up push notifications

A push notification is the pop-up notification that you get in your device. For calling, we'll focus on VoIP (voice over Internet Protocol) push notifications. 

The following sections describe how to register for, handle, and show a Windows notification to answer/decline an incoming call. Before you start those tasks, complete these prerequisites:

1. Follow [Tutorial: Send notifications to Universal Windows Platform apps using Azure Notification Hubs](/azure/notification-hubs/notification-hubs-windows-store-dotnet-get-started-wns-push-notification). After following this tutorial, you have:
    - An application that has the `WindowsAzure.Messaging.Managed` and `Microsoft.Toolkit.Uwp.Notifications` packages.
    - An Azure PNH (Push Notifications Hub) Hub name referenced as `<AZURE_PNH_HUB_NAME>` and the Azure PNH Connection String referenced as `<AZURE_PNH_HUB_CONNECTION_STRING>` in this quickstart.
  
3. To register for a WNS (Windows Notification Service) channel on every application init, make sure you add the initialization code on your App.xaml.cs file:

```C#
// App.xaml.cs

protected override async void OnLaunched(LaunchActivatedEventArgs e)
{
    await InitNotificationsAsync();
    
    ...
}

private async Task InitNotificationsAsync()
{
    if (AZURE_PNH_HUB_NAME != "<AZURE_PNH_HUB_NAME>" && AZURE_PNH_HUB_CONNECTION_STRING != "<AZURE_PNH_HUB_CONNECTION_STRING>")
    {
        var channel = await PushNotificationChannelManager.CreatePushNotificationChannelForApplicationAsync();
        channel.PushNotificationReceived += Channel_PushNotificationReceived;
    
        var hub = new NotificationHub(AZURE_PNH_HUB_NAME, AZURE_PNH_HUB_CONNECTION_STRING);
        var result = await hub.RegisterNativeAsync(channel.Uri);
    
        if (result.ChannelUri != null)
        {
            PNHChannelUri = new Uri(result.ChannelUri);
        }
        else
        {
            Debug.WriteLine("Cannot register WNS channel");
        }
    }
}
```
3. Register the event handler activated when a new push notification message arrives on App.xaml.cs:

```C#
// App.xaml.cs

private void Channel_PushNotificationReceived(PushNotificationChannel sender, PushNotificationReceivedEventArgs args)
{
    switch (args.NotificationType)
    {
      case PushNotificationType.Toast:
      case PushNotificationType.Tile:
      case PushNotificationType.TileFlyout:
      case PushNotificationType.Badge:
          break;
      case PushNotificationType.Raw:
          var frame = (Frame)Window.Current.Content;
          if (frame.Content is MainPage)
          {
              var mainPage = frame.Content as MainPage;
              await mainPage.HandlePushNotificationIncomingCallAsync(args.RawNotification.Content);
          }
          break;
    }
}
```

### Register for push notifications
To register for push notifications, call `RegisterForPushNotificationAsync()` on a `CallAgent` instance with the WNS registration channel obtained on application init.

Registration for push notifications needs to happen after successful initialization.

```C#
// MainPage.xaml.cs

this.callAgent = await this.callClient.CreateCallAgentAsync(tokenCredential, callAgentOptions);
                
if ((Application.Current as App).PNHChannelUri != null)
{
    await this.callAgent.RegisterForPushNotificationAsync((Application.Current as App).PNHChannelUri.ToString());
}

this.callAgent.CallsUpdated += OnCallsUpdatedAsync;
this.callAgent.IncomingCallReceived += OnIncomingCallAsync;
```

## Handle push notifications
To receive push notifications for incoming calls, call `handlePushNotification()` on a `CallAgent` instance with a dictionary payload.

```C#
// MainPage.xaml.cs

public async Task HandlePushNotificationIncomingCallAsync(string notificationContent)
{
    if (this.callAgent != null)
    {
        PushNotificationDetails pnDetails = PushNotificationDetails.Parse(notificationContent);
        await callAgent.HandlePushNotificationAsync(pnDetails);
    }
}
```

This triggers an incoming call event on CallAgent that shows the incoming call notification.

```C#
// MainPage.xaml.cs

private async void OnIncomingCallAsync(object sender, IncomingCallReceivedEventArgs args)
{
    incomingCall = args.IncomingCall;
    (Application.Current as App).ShowIncomingCallNotification(incomingCall);
}
```

```C#
// App.xaml.cs

public void ShowIncomingCallNotification(IncomingCall incomingCall)
{
    string incomingCallType = incomingCall.IsVideoEnabled ? "Video" : "Audio";
    string caller = incomingCall.CallerDetails.DisplayName != "" ? incomingCall.CallerDetails.DisplayName : incomingCall.CallerDetails.Identifier.RawId;
    new ToastContentBuilder()
    .SetToastScenario(ToastScenario.IncomingCall)
    .AddText(caller + " is calling you.")
    .AddText("New Incoming " + incomingCallType + " Call")
      .AddButton(new ToastButton()
          .SetContent("Decline")
          .AddArgument("action", "decline"))
      .AddButton(new ToastButton()
          .SetContent("Accept")
          .AddArgument("action", "accept"))
      .Show();
}
```

Add the code to handle the button press for the notification in the OnActivated method:

```C#
// App.xaml.cs

protected override async void OnActivated(IActivatedEventArgs e)
{   
    // Handle notification activation
    if (e is ToastNotificationActivatedEventArgs toastActivationArgs)
    {
      ToastArguments args = ToastArguments.Parse(toastActivationArgs.Argument);
      string action = args?.Get("action");
    
      if (!string.IsNullOrEmpty(action))
      {
          var frame = Window.Current.Content as Frame;
          if (frame.Content is MainPage)
          {
              var mainPage = frame.Content as MainPage;
              await mainPage.AnswerIncomingCall(action);
          }
      }
    }
}
```

```C#
// MainPage.xaml.cs

public async Task AnswerIncomingCall(string action)
{
    if (action == "accept")
    {
      var acceptCallOptions = new AcceptCallOptions()
      {
          IncomingVideoOptions = new IncomingVideoOptions()
          {
              StreamKind = VideoStreamKind.RemoteIncoming
          }
      };
    
      call = await incomingCall?.AcceptAsync(acceptCallOptions);
      call.StateChanged += OnStateChangedAsync;
      call.RemoteParticipantsUpdated += OnRemoteParticipantsUpdatedAsync;
    }
    else if (action == "decline")
    {
      await incomingCall?.RejectAsync();
    }
}
```
