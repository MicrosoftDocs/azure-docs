---
title: 'Quickstart: Multi-Device Conversation, C# (.Net Framework Windows) - Speech Service'
titleSuffix: Azure Cognitive Services
description: In this quickstart, you'll learn how to create a new multi-device conversation or join an existing one.
services: cognitive-services
author: ralphe
manager: cpoulain
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: quickstart
ms.date: 11/08/2019
ms.author: ralphe
---

## Prerequisites

Before you get started, make sure to:

> [!div class="checklist"]
> * [Create an Azure Speech Resource](../../../../get-started.md)
> * [Setup your development environment](../../../../quickstarts/setup-platform.md?tabs=dotnet)
> * [Create an empty sample project](../../../../quickstarts/create-project.md?tabs=dotnet)

## Add sample code

1. Open **Program.cs**, and replace all code in it with the following code:

    ```Csharp
    using Microsoft.CognitiveServices.Speech;
    using Microsoft.CognitiveServices.Speech.Audio;
    using Microsoft.CognitiveServices.Speech.Transcription;
    using System;
    using System.Threading.Tasks;
    
    namespace helloworld
    {
        class Program
        {
            public static void Main(string[] args)
            {
                CreateConversationAsync().Wait();
            }
    
            static async Task CreateConversationAsync()
            {
                // replace these values with the details of your Cognitive Speech subscriptions
                string subscriptionKey = "YourSubscriptionKey";
                string region = "YourServiceRegion";
    
                // Sets source and target languages.
                // Replace with the languages of your choice, from list found here: https://aka.ms/speech/sttt-languages
                string fromLanguage = "en-US";
                string toLanguage = "de";
    
                // Set this to the display name you want for the conversation host
                string displayName = "The host";
    
                // create the task completion source that will be used to wait until the user presses Ctrl + c
                var completionSource = new TaskCompletionSource<bool>();
    
                // register to listen for Ctrl + C
                Console.CancelKeyPress += (s, e) =>
                {
                    completionSource.TrySetResult(true);
                    e.Cancel = true; // don't terminate the current process
                };
    
                // Create an instance of the speech translation config
                var config = SpeechTranslationConfig.FromSubscription(subscriptionKey, region);
                config.SpeechRecognitionLanguage = fromLanguage;
                config.AddTargetLanguage(toLanguage);
    
                // create the conversation
                using (var conversation = await Conversation.CreateConversationAsync(config).ConfigureAwait(false))
                {
                    // start the conversation so you and others can join
                    await conversation.StartConversationAsync().ConfigureAwait(false);
    
                    // get the conversation ID. It will be up to your scenario to determine how this is shared
                    // with other participants.
                    string conversationId = conversation.ConversationId;
                    Console.WriteLine($"Created '{conversationId}' conversation");
    
                    // at this point, you can use the conversation object to manage the conversation. For example,
                    // to mute everyone else in the room you can call this method:
                    await conversation.MuteAllParticipantsAsync().ConfigureAwait(false);
    
                    // configure which audio source you want to use. If you are using a text only language, you
                    // can use the other overload of the constructor that takes no arguments
                    var audioConfig = AudioConfig.FromDefaultMicrophoneInput();
                    using (var conversationTranslator = new ConversationTranslator(audioConfig))
                    {
                        // you should connect all the event handlers you need at this point
                        conversationTranslator.SessionStarted += (s, e) =>
                        {
                            Console.WriteLine($"Session started: {e.SessionId}");
                        };
                        conversationTranslator.SessionStopped += (s, e) =>
                        {
                            Console.WriteLine($"Session stopped: {e.SessionId}");
                        };
                        conversationTranslator.Canceled += (s, e) =>
                        {
                            switch (e.Reason)
                            {
                                case CancellationReason.EndOfStream:
                                    Console.WriteLine($"End of audio reached");
                                    break;
    
                                case CancellationReason.Error:
                                    Console.WriteLine($"Canceled due to error. {e.ErrorCode}: {e.ErrorDetails}");
                                    break;
                            }
                        };
                        conversationTranslator.ConversationExpiration += (s, e) =>
                        {
                            Console.WriteLine($"Conversation will expire in {e.ExpirationTime.TotalMinutes} minutes");
                        };
                        conversationTranslator.ParticipantsChanged += (s, e) =>
                        {
                            Console.Write("The following participant(s) have ");
                            switch (e.Reason)
                            {
                                case ParticipantChangedReason.JoinedConversation:
                                    Console.Write("joined");
                                    break;
    
                                case ParticipantChangedReason.LeftConversation:
                                    Console.Write("left");
                                    break;
    
                                case ParticipantChangedReason.Updated:
                                    Console.Write("been updated");
                                    break;
                            }
    
                            Console.WriteLine(":");
    
                            foreach (var participant in e.Participants)
                            {
                                Console.WriteLine($"\t{participant.DisplayName}");
                            }
                        };
                        conversationTranslator.TextMessageReceived += (s, e) =>
                        {
                            Console.WriteLine($"Received an instant message from '{e.Result.ParticipantId}': '{e.Result.Text}'");
                            foreach (var entry in e.Result.Translations)
                            {
                                Console.WriteLine($"\tTranslated into '{entry.Key}': '{entry.Value}'");
                            }
                        };
                        conversationTranslator.Transcribed += (s, e) =>
                        {
                            Console.WriteLine($"Received a transcription from '{e.Result.ParticipantId}': '{e.Result.Text}'");
                            foreach (var entry in e.Result.Translations)
                            {
                                Console.WriteLine($"\tTranslated into '{entry.Key}': '{entry.Value}'");
                            }
                        };
                        conversationTranslator.Transcribing += (s, e) =>
                        {
                            Console.WriteLine($"Received a partial transcription from '{e.Result.ParticipantId}': '{e.Result.Text}'");
                            foreach (var entry in e.Result.Translations)
                            {
                                Console.WriteLine($"\tTranslated into '{entry.Key}': '{entry.Value}'");
                            }
                        };
    
                        // enter the conversation to start receiving events
                        await conversationTranslator.JoinConversationAsync(conversation, displayName).ConfigureAwait(false);
    
                        // you can now send an instant message to all other participants in the room
                        await conversationTranslator.SendTextMessageAsync("The instant message to send").ConfigureAwait(false);
    
                        // if specified a speech to text language, you can start capturing audio
                        await conversationTranslator.StartTranscribingAsync().ConfigureAwait(false);
                        Console.WriteLine("Started transcribing. Press Ctrl + c to stop");
    
                        // at this point, you should start receiving transcriptions for what you are saying using
                        // the default microphone. Press Ctrl+c to stop audio capture
                        await completionSource.Task.ConfigureAwait(false);
    
                        // stop audio capture
                        await conversationTranslator.StopTranscribingAsync().ConfigureAwait(false);
    
                        // leave the conversation. After this you will no longer receive events
                        await conversationTranslator.LeaveConversationAsync().ConfigureAwait(false);
                    }
    
                    // end the conversation
                    await conversation.EndConversationAsync().ConfigureAwait(false);
    
                    // delete the conversation. Any other participants that are still in the conversation will be removed
                    await conversation.DeleteConversationAsync().ConfigureAwait(false);
                }
            }
        }
    }
    ```

2. In the same file, replace the string `YourSubscriptionKey` with your Cognitive Speech subscription key.

1. Replace the string `YourServiceRegion` with the [region](~/articles/cognitive-services/Speech-Service/regions.md) associated with your subscription (for example, `westus` for the free trial subscription).

1. From the menu bar, choose **File** > **Save All**.

## Build and run the application to create a new conversation

1. From the menu bar, select **Build** > **Build Solution** to build the application. The code should compile without errors now.

1. Choose **Debug** > **Start Debugging** (or press **F5**) to start the **helloworld** application.

1. Once you see the ```Started transcribing``` message appear, you can start speaking. You'll see the transcriptions appear as you speak.
    - If you share the conversation code with the others and they join the conversation, you'll see their transcriptions as well.

1. Once you're done speaking, press `Ctrl + C` to stop audio capture, and end the conversation.

## Build and run the application to join an existing conversation

1. Copy and paste the following function into your **Program.cs**:

    ```C#
    static async Task JoinConversationAsync(string conversationId)
    {
        // Set this to the display name you want for the participant
        string displayName = "participant";

        // Set the speech to text, or text language you want to use
        string language = "en-US";

        // create the task completion source that will be used to wait until the user presses Ctrl + c
        var completionSource = new TaskCompletionSource<bool>();

        // register to listen for Ctrl + C
        Console.CancelKeyPress += (s, e) =>
        {
            completionSource.TrySetResult(true);
            e.Cancel = true; // don't terminate the current process
        };

        // as a participant, you don't need to specify any subscription key, or region. You can directly create
        // the conversation translator object
        var audioConfig = AudioConfig.FromDefaultMicrophoneInput();
        using (var conversationTranslator = new ConversationTranslator(audioConfig))
        {
            // register for any events you are interested here. For now let's just register for
            // transcription, and instant message events
            conversationTranslator.TextMessageReceived += (s, e) =>
            {
                Console.WriteLine($"Received an instant message from '{e.Result.ParticipantId}': '{e.Result.Text}'");
                foreach (var entry in e.Result.Translations)
                {
                    Console.WriteLine($"\tTranslated into '{entry.Key}': '{entry.Value}'");
                }
            };
            conversationTranslator.Transcribed += (s, e) =>
            {
                Console.WriteLine($"Received a transcription from '{e.Result.ParticipantId}': '{e.Result.Text}'");
                foreach (var entry in e.Result.Translations)
                {
                    Console.WriteLine($"\tTranslated into '{entry.Key}': '{entry.Value}'");
                }
            };
            conversationTranslator.Transcribing += (s, e) =>
            {
                Console.WriteLine($"Received a partial transcription from '{e.Result.ParticipantId}': '{e.Result.Text}'");
                foreach (var entry in e.Result.Translations)
                {
                    Console.WriteLine($"\tTranslated into '{entry.Key}': '{entry.Value}'");
                }
            };
    
            // to start receiving events, you will need to join the conversation
            await conversationTranslator.JoinConversationAsync(conversationId, displayName, language).ConfigureAwait(false);

            // you can now send an instant message
            await conversationTranslator.SendTextMessageAsync("Message from participant").ConfigureAwait(false);

            // start capturing audio if you specified a speech to text language
            await conversationTranslator.StartTranscribingAsync().ConfigureAwait(false);
            Console.WriteLine("Started transcribing. Press Ctrl-C to stop");

            // at this point, you should start receiving transcriptions for what you are saying using
            // the default microphone. Press Ctrl+c to stop audio capture
            await completionSource.Task.ConfigureAwait(false);

            // stop audio capture
            await conversationTranslator.StopTranscribingAsync().ConfigureAwait(false);

            // leave the conversation. You will stop receiving events after this
            await conversationTranslator.LeaveConversationAsync().ConfigureAwait(false);
        }
    }
    ```

1. Replace `CreateConversationAsync().Wait();` in your `public static void Main(string[] args)` function with:

    ```C#
    // set this to the conversation you want to join
    JoinConversationAsync("YourConversationId").Wait();
    ```

[!INCLUDE [create-from-web](../create-from-web.md)]

4. Go back to Visual Studio and replace the string ```YourConversationId``` with the conversation ID you created in the previous step.

1. From the menu bar, select **Build** > **Build Solution** to build the application. The code should compile without errors now.

1. Choose **Debug** > **Start Debugging** (or press **F5**) to start the **helloworld** application.

1. Once you see the ```Started transcribing``` message appear, you can start speaking. You'll see the transcriptions appear as you speak.
    - If you go back to your browser, you should see your transcriptions appear there as you speak as well.

1. Once you're done speaking, press `Ctrl + C` to stop audio capture, and end the conversation.

1. Go back to your browser and exit the conversation using the ![exit button](../../../../media/scenarios/conversation_translator_web_exit_button.png) button in the upper right corner.

## Next Steps

[!INCLUDE [footer](./footer.md)]
