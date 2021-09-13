---
title: Quickstart - Join a Teams meeting from a Windows app
description: In this tutorial, you learn how to join a Teams meeting using the Azure Communication Services Calling SDK for Windows
author: aurighet
ms.author: aurighet
ms.date: 05/13/2021
ms.topic: include
ms.service: azure-communication-services
---

In this quickstart, you'll learn how to join a Teams meeting using the Azure Communication Services Calling SDK for Windows.

## Prerequisites

- A working [Communication Services calling Windows app](../../getting-started-with-calling.md).
- A [Teams deployment](/deployoffice/teams-install).

## Add the Teams UI controls and Enable the Teams UI controls

Replace code in MainPage.xaml with following snippet. The text box will be used to enter the Teams meeting context and the button will be used to join the specified meeting:

```xml
<Page
    x:Class="CallingQuickstart.MainPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:local="using:CallingQuickstart"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    mc:Ignorable="d"
    Background="{ThemeResource ApplicationPageBackgroundThemeBrush}">
    <StackPanel>
        <TextBox PlaceholderText="Please enter the Teams meeting link." TextWrapping="Wrap" x:Name="TeamsLinkTextBox" Margin="10,10,10,10" />
        <StackPanel Orientation="Horizontal" HorizontalAlignment="Center">
            <Button Content="Join Teams Meeting" Click="JoinButton_ClickAsync" x:Name="JoinButton" Margin="10,10,10,10" />
            <Button Content="Leave Meeting" Click="LeaveButton_ClickAsync" x:Name="LeaveButton" Margin="10,10,10,10" />
        </StackPanel>
        <TextBlock TextWrapping="Wrap" x:Name="CallStatusTextBlock" Margin="10,10,10,10" />
        <TextBlock TextWrapping="Wrap" x:Name="RecordingStatusTextBlock" Margin="10,10,10,10" />
    </StackPanel>
</Page>
```

## Enable the Teams UI controls

Replace the content of `MainPage.xaml.cs` with following snippet:

```csharp
using System;
using System.Threading.Tasks;

using Windows.UI.Core;
using Windows.UI.Popups;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;

using Azure.Communication;
using Azure.Communication.Calling;

namespace CallingQuickstart
{
    public sealed partial class MainPage : Page
    {
        string user_token_ = "<User_Access_Token>";

        Call call_;

        public MainPage()
        {
            this.InitializeComponent();
        }

        private async void JoinButton_ClickAsync(object sender, RoutedEventArgs e)
        {
            if (!await ValidateInput())
            {
                return;
            }

            //
            //  Create CallClient
            //
            CallClient call_client = new CallClient();

            //
            //  Create CallAgent
            //
            CommunicationTokenCredential token_credential;
            CallAgent call_agent;

            try
            {
                token_credential = new CommunicationTokenCredential(user_token_);

                CallAgentOptions call_agent_options = new CallAgentOptions();
                call_agent = await call_client.CreateCallAgent(token_credential, call_agent_options);
            }
            catch
            {
                await new MessageDialog("It was not possible to create call agent. Please check if token is valid.").ShowAsync();
                return;
            }

            //
            //  Join a Teams meeting
            //
            try
            {
                JoinCallOptions joinCallOptions = new JoinCallOptions();
                TeamsMeetingLinkLocator teamsMeetingLinkLocator = new TeamsMeetingLinkLocator(TeamsLinkTextBox.Text);
                call_ = await call_agent.JoinAsync(teamsMeetingLinkLocator, joinCallOptions);
            }
            catch
            {
                await new MessageDialog("It was not possible to join the Teams meeting. Please check if Teams Link is valid.").ShowAsync();
                return;
            }

            //
            //  Set up call callbacks
            //
            call_.OnStateChanged += Call_OnStateChangedAsync;
            call_.OnIsRecordingActiveChanged += Call_OnIsRecordingActiveChangedAsync;
        }

        private async void Call_OnStateChangedAsync(object sender, PropertyChangedEventArgs args)
        {
            await Dispatcher.RunAsync(CoreDispatcherPriority.Normal, () =>
            {
                CallStatusTextBlock.Text = call_.State.ToString();
            });
        }
        
        private async void Call_OnIsRecordingActiveChangedAsync(object sender, PropertyChangedEventArgs args)
        {
            await Dispatcher.RunAsync(CoreDispatcherPriority.Normal, () =>
            {
                RecordingStatusTextBlock.Text = call_.IsRecordingActive ? "Recording is active." : "Recording is inactive.";
            });
        }
        
        private async void LeaveButton_ClickAsync(object sender, RoutedEventArgs e)
        {
            try
            {
                await call_.HangUp(new HangUpOptions());
            }
            catch
            {
                await new MessageDialog("It was not possible to leave the Teams meeting.").ShowAsync();
            }
        }
        
        private async Task<bool> ValidateInput()
        {
            if (user_token_.StartsWith("<"))
            {
                await new MessageDialog("Please enter token in source code.").ShowAsync();
                return false;
            }
        
            if (TeamsLinkTextBox.Text.Trim().Length == 0 || !TeamsLinkTextBox.Text.StartsWith("http"))
            {
                await new MessageDialog("Please enter Teams meeting link.").ShowAsync();
                return false;
            }
        
            return true;
        }
    }
}
```

## Get the Teams meeting link

The Teams meeting link can be retrieved using Graph APIs. This is detailed in [Graph documentation](/graph/api/onlinemeeting-createorget?tabs=http&view=graph-rest-beta&preserve-view=true).
The Communication Services Calling SDK accepts a full Teams meeting link. This link is returned as part of the `onlineMeeting` resource, accessible under the [`joinWebUrl` property](/graph/api/resources/onlinemeeting?view=graph-rest-beta&preserve-view=true). You can also get the required meeting information from the **Join Meeting** URL in the Teams meeting invite itself.

## Launch the app and join Teams meeting

You can build and run your app on Visual Studio by selecting **Debug** > **Start Debugging** or by using the (F5) keyboard shortcut.

Insert the Teams context into the text box and press *Join Teams Meeting* to join the Teams meeting from within your Communication Services application.
