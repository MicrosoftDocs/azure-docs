---
title: 'Quickstart: Custom voice-first virtual assistant, C# (UWP) - Speech Services'
titleSuffix: Azure Cognitive Services
description: In this article, you create a C# Universal Windows Platform (UWP) application by using the Cognitive Services Speech SDK. You connect your client application to a previously created Bot Framework bot configured to use the Direct Line Speech channel. The application is built with the Speech SDK NuGet Package and Microsoft Visual Studio 2017.
services: cognitive-services
author: trrwilson
manager: 
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: quickstart
ms.date: 05/06/2019
ms.author: travisw
ms.custom: 
---

# Quickstart: Use a voice-first virtual assistant (Preview) from a UWP app with the Speech SDK

In this article, you develop a C# Universal Windows Platform (UWP; Windows version 1709 later) application by using the [Cognitive Services Speech SDK](speech-sdk.md). The program will connect to a previously authored and configured bot to enable a voice-first virtual assistant experience from the client application. The application is built with the [Speech SDK NuGet Package](https://aka.ms/csspeech/nuget) and Microsoft Visual Studio 2017 (any edition).

> [!NOTE]
> The Universal Windows Platform lets you develop apps that run on any device that supports Windows 10, including PCs, Xbox, Surface Hub, and other devices.

## Prerequisites

This quickstart requires:

* [Visual Studio 2017](https://visualstudio.microsoft.com/downloads/)
* An Azure subscription key for the Speech Service. [Get one for free](get-started.md).
* A previously created bot configured with the [Direct Line Speech channel](../../bot-service/bot-service-channel-connect-directlinespeech.md)
    > [!NOTE]
    > In preview, the Direct Line Speech channel currently supports only the **westus2** region. Further region support will be added in the future.

    > [!NOTE]
    > The 30-day trial for the standard pricing tier described in [Try Speech Services for free](get-started.md) is restricted to **westus** (not **westus2**) and is thus not compatible with Direct Line Speech. Free and standard tier **westus2** subscriptions are compatible.

## Create a Visual Studio project

[!INCLUDE [](../../../includes/cognitive-services-speech-service-quickstart-uwp-create-proj.md)]

## Add sample code

1. The application's user interface is defined by using XAML. Open `MainPage.xaml` in Solution Explorer. In the designer's XAML view, insert the following XAML snippet into the Grid tag (between `<Grid>` and `</Grid>`).

    > [!NOTE]
    > PREPUBLISH TODO: Add XAML once UI paradigm figured out

    ```xml
    <StackPanel Orientation="Vertical" HorizontalAlignment="Center"  Margin="20,50,0,0" VerticalAlignment="Center" Width="800">
        <Button x:Name="EnableMicrophoneButton" Content="Enable Microphone"  Margin="0,0,10,0" Click="EnableMicrophone_ButtonClicked" Height="35"/>
        <Button x:Name="ListenButton" Content="Talk to your bot" Margin="0,10,10,0" Click="ListenButton_ButtonClicked" Height="35"/>
        <StackPanel x:Name="StatusPanel" Orientation="Vertical" RelativePanel.AlignBottomWithPanel="True" RelativePanel.AlignRightWithPanel="True" RelativePanel.AlignLeftWithPanel="True">
            <TextBlock x:Name="StatusLabel" Margin="0,10,10,0" TextWrapping="Wrap" Text="Status:" FontSize="20"/>
            <Border x:Name="StatusBorder" Margin="0,0,0,0">
                <ScrollViewer VerticalScrollMode="Auto"  VerticalScrollBarVisibility="Auto" MaxHeight="200">
                    <!-- Use LiveSetting to enable screen readers to announce the status update. -->
                    <TextBlock x:Name="StatusBlock" FontWeight="Bold" AutomationProperties.LiveSetting="Assertive"
                    MaxWidth="{Binding ElementName=Splitter, Path=ActualWidth}" Margin="10,10,10,20" TextWrapping="Wrap"  />
                </ScrollViewer>
            </Border>
        </StackPanel>
    </StackPanel>
    ```

1. Open the code-behind source file `MainPage.xaml.cs` (find it grouped under `MainPage.xaml`). Ensure your namespaces include the following.

    ```csharp
    using Microsoft.CognitiveServices.Speech;
    using Microsoft.CognitiveServices.Speech.Dialog;
    ```

1. Find the `MainPage` class in the file and replace its implementation with the following starter code. This includes basic prerequisites needed for microphone access and updating text.

    ```csharp
    public sealed partial class MainPage : Page
    {
        private SpeechBotConnector botConnector;

        public MainPage()
        {
            this.InitializeComponent();
            InitializeBotConnector();
        }

        private async void EnableMicrophone_ButtonClicked(object sender, RoutedEventArgs e)
        {
            bool isMicAvailable = true;
            try
            {
                var mediaCapture = new Windows.Media.Capture.MediaCapture();
                var settings = new Windows.Media.Capture.MediaCaptureInitializationSettings();
                settings.StreamingCaptureMode = Windows.Media.Capture.StreamingCaptureMode.Audio;
                await mediaCapture.InitializeAsync(settings);
            }
            catch (Exception)
            {
                isMicAvailable = false;
            }
            if (!isMicAvailable)
            {
                await Windows.System.Launcher.LaunchUriAsync(new Uri("ms-settings:privacy-microphone"));
            }
            else
            {
                NotifyUser("Microphone was enabled", NotifyType.StatusMessage);
            }
        }

        private void NotifyUser(string strMessage, NotifyType type)
        {
            // If called from the UI thread, then update immediately.
            // Otherwise, schedule a task on the UI thread to perform the update.
            if (Dispatcher.HasThreadAccess)
            {
                UpdateStatus(strMessage, type);
            }
            else
            {
                var task = Dispatcher.RunAsync(Windows.UI.Core.CoreDispatcherPriority.Normal, () => UpdateStatus(strMessage, type));
            }
        }

        private void InitializeBotConnector()
        {
            // New code will go here
        }
    }
    ```

1. Now you'll create the SpeechBotConnector from your own configuration details. Add the following to `InitializeBotConnector`, replacing the connection ID and subscription key with your own. Replace the strings `YourBotConnectionId`, `YourSpeechSubscriptionKey`, and `YourServiceRegion` with your own values for your bot, speech subscription, and [region](regions.md).

    > [!NOTE]
    > In preview, the Direct Line Speech channel currently supports only the **westus2** region. Further region support will be added in the future.

    ```csharp
    // create a BotConnectorConfig by providing bot connection id and Cognitive Services subscription key
    string botConnectionId = "YourBotConnectionId"; // Speech channel secret;
    string speechSubscriptionKey = "YourSpeechSubscriptionKey";
    string region = "YourServiceRegion";

    var botConnectorConfig = BotConnectorConfig.FromBotConnectionId(botConnectionId, speechSubscriptionKey, region);
    botConnector = new SpeechBotConnector(botConnectorConfig);
    ```

1. `SpeechBotConnector` relies on several events to communicate its results and other information. Add handlers for those next.

    ```csharp
    // ActivityReceived is the main way your bot will communicate with the client and uses bot framework activities
    botConnector.ActivityReceived += BotConnector_ActivityReceived;
    // Canceled will be signaled when a turn is aborted or experiences an error condition
    botConnector.Canceled += BotConnector_Canceled;
    // Recognizing will provide the intermediate recognized text while an audio stream is being processed
    botConnector.Recognizing += BotConnector_Recognizing;
    // Recognized will provide the final recognized text once audio capture is completed
    botConnector.Recognized += BotConnector_Recognized;
    // SessionStarted will notify when audio begins flowing to the service for a turn
    botConnector.SessionStarted += BotConnector_SessionStarted;
    // SessionStopped will notify when a turn is complete and it's safe to begin listening again
    botConnector.SessionStopped += BotConnector_SessionStopped;
    // Synthesizing contains text-to-speech audio for spoken text originating from your bot
    botConnector.Synthesizing += BotConnector_Synthesizing;
    ```

1. These event handlers that were just referenced don't exist yet. Add the following to implement them.

    > [!NOTE]
    > PREPUBLISH TODO: Complete/revise these handlers

    ```csharp
    /// <summary>
    /// Processes incoming Synthesis events, writing audio chunks to a stream and finally creating a WAV for playback
    /// </summary>
    private void BotConnector_Synthesizing(object sender, Microsoft.CognitiveServices.Speech.Translation.TranslationSynthesisEventArgs e)
    {
        switch (e.Result.Reason)
        {
            case ResultReason.SynthesizingAudio:
                Debug.Log($"Synthesizing audio");

                // some optional action

                // e.Result.GetAudio() will return a byte[], which we can process as needed

                break;
            case ResultReason.SynthesizingAudioCompleted:               
                // some optional action
                Debug.Log($"Synthesis complete");
                break;
            default:
                break;
        }
    }

    /// <summary>
    /// Processes Recognizing events, used here to display hypothesis results
    /// </summary> 
    private void BotConnector_Recognizing(object sender, SpeechRecognitionEventArgs e)
    {
        Debug.LogFormat($"Hypothesis received:\r\n { e.Result.Text }");
    }

    /// <summary>
    /// Processes Recognized events, used here to display final result
    /// </summary> 
    private void BotConnector_Recognized(object sender, SpeechRecognitionEventArgs e)
    {
        if (e.Result.Reason == ResultReason.RecognizedSpeech)
        {
            Debug.LogFormat($"Final recognition:\r\n {e.Result.Text}");
        }
        else if (e.Result.Reason == ResultReason.NoMatch)
        {
            Debug.LogFormat($"Speech could not be recognized.");
        }
    }
    ```

1. With the configuration established and the event handlers registered, the `SpeechBotConnector` now just needs to listen. Add the following to the end of the `MainPage` class.

    > [!NOTE]
    > PREPUBLISH TODO: Add once minimal UI XAML is finalized

    ```csharp
    private async void ListenButton_ButtonClicked(object sender, RoutedEventArgs e)
    {
        try
        {
            // Optional step to speed up first interaction: if not called, connection happens automatically on first use
            botConnector.ConnectAsync();

            // Start sending audio to your speech-enabled bot
            botConnector.ListenOnceAsync();
        }
        catch (Exception ex)
        {
            NotifyUser($"Exception: {ex.ToString()}", NotifyType.ErrorMessage);
        }
    }
    ```

1. Save all changes to the project.

## Build and run the app

1. Build the application. From the menu bar, select **Build** > **Build Solution**. The code should compile without errors now.

    ![Screenshot of Visual Studio application, with Build Solution option highlighted](media/sdk/qs-csharp-uwp-08-build.png "Successful build")

1. Start the application. From the menu bar, select **Debug** > **Start Debugging**, or press **F5**.

    ![Screenshot of Visual Studio application, with Start Debugging option highlighted](media/sdk/qs-csharp-uwp-09-start-debugging.png "Start the app into debugging")

1. A window pops up. Select **Enable Microphone**, and acknowledge the permission request that pops up.

    ![Screenshot of permission request](media/sdk/qs-csharp-uwp-10-access-prompt.png "Start the app into debugging")

1. Select **Talk to your bot**, and speak an English phrase or sentence into your device's microphone. Your speech is transmitted to the Direct Line Speech channel and transcribed to text, which appears in the window.

    > [!NOTE]
    > PREPUBLISH TODO: Add screenshot of a turn

## Next steps

> [!div class="nextstepaction"]
> [Explore C# samples on GitHub](https://aka.ms/csspeech/samples)

## See also

- [Translate speech](how-to-translate-speech-csharp.md)
- [Customize acoustic models](how-to-customize-acoustic-models.md)
- [Customize language models](how-to-customize-language-model.md)
