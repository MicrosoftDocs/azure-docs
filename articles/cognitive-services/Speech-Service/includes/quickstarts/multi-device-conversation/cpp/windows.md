---
title: 'Quickstart: Multi-Device Conversation, C++ (Windows) - Speech Service'
titleSuffix: Azure Cognitive Services
description: In this quickstart, you'll learn how to use the conversation translator to create a new conversation, as well as join an existing conversation.
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
> * [Setup your development environment](../../../../quickstarts/setup-platform.md?tabs=windows)
<!-- >> * [Create an empty sample project](../../../../quickstarts/create-project.md?tabs=windows) -->


## Create Empty Project

1. Open Visual Studio 2019 to display the **Start** window.

   ![Start window - Visual Studio](../../../../media/sdk/vs-start-window.png)

1. Click on **Create a new project**.

1. Find and select **Console App**. Make sure that you select the C++ version of this project type (as opposed to C# or Visual Basic).

    ![Create a new project, C++ - Visual Studio](../../../../media/sdk/qs-cpp-windows-01-new-console-app.png)
    
1. Select **Next** to display the **Configure your new project** screen.

   ![Configure your new project, C++ - Visual Studio](../../../../media/sdk/vs-enable-cpp-configure-your-new-project.png)

1. In **Project name**, enter `helloworld`.

1. In **Location**, navigate to and select or create the folder to save your project in.

1. Right click on the **helloworld** project and click on **Open Folder in File Explorer**.

1. Right click on **helloworld.vcxproj** and choose **Open with** --> **Choose another app**.

1. If you see **Notepad** in the list, click on that. If you don't, click on **More apps** and choose Notepad from the list.

1. Scroll to the end of the file and add the following just after the ```<Import Project="$(VCTargetsPath)\Microsoft.Cpp.targets" />``` line:

    ```Xml
    <Import Project="$(SolutionDir)\ext\Microsoft.CognitiveServices.Speech.targets" />
    ```

1. Navigate one directory up. You should see a **helloworld.sln** file.

1. Create a new folder called **ext**.

1. Download the [multi-device conversation preview DLLs](https://aka.ms/mdc-preview) and extract its contents to the **ext** folder you created in the previous step.

## Add sample code

1. From Visual Studio, open the source file **helloworld.cpp**.

1. Replace all the code with the following snippet:

    ```C++
    #define WIN32_LEAN_AND_MEAN
    #include <Windows.h>
    
    #include <iostream>
    #include <thread>
    #include <future>
    #include <string>
    #include <speechapi_cxx.h>
    
    using namespace std::chrono_literals;
    using namespace Microsoft::CognitiveServices::Speech;
    using namespace Microsoft::CognitiveServices::Speech::Audio;
    using namespace Microsoft::CognitiveServices::Speech::Transcription;
    
    // create a promise that we will set when the user presses Ctrl-C
    std::promise<bool> promise;
    // create the future we will use to wait for the promise to be fulfilled
    std::future<bool> future = promise.get_future();
    
    void StartNewConversation()
    {
        // set these
        std::string subscriptionKey("a3165ad6b5e04874a4e67415af503de5 ");
        std::string region("westus");
        std::string speechLanguage("en-US");
    
        // Create the conversation object you'll need to manage the conversation
        auto speechConfig = SpeechConfig::FromSubscription(subscriptionKey, region);
        speechConfig->SetSpeechRecognitionLanguage(speechLanguage);
        auto conversation = Conversation::CreateConversationAsync(speechConfig).get();
    
        // Start the conversation so you and others can join
        conversation->StartConversationAsync().get();
    
        // Get the conversation ID. It will be up to your scenario to determine how this is shared
        // with other participants.
        std::cout << "Created conversation: " << conversation->GetConversationId() << std::endl;
    
        // You can now call various commands to manage the room. For example:
        conversation->MuteAllParticipantsAsync().get();
    
        // Create the conversation translator you'll need to send audio, send IMs, and receive conversation events
        auto audioConfig = AudioConfig::FromDefaultMicrophoneInput();
        auto conversationTranslator = ConversationTranslator::FromConfig(audioConfig);
    
        // add any event handlers
        conversationTranslator->SessionStarted += [](const SessionEventArgs& args)
        {
            std::cout << "Session started " << args.SessionId << std::endl;
        };
        conversationTranslator->SessionStopped += [](const SessionEventArgs& args)
        {
            std::cout << "Session stopped " << args.SessionId << std::endl;
        };
        conversationTranslator->Canceled += [](const ConversationTranslationCanceledEventArgs& args)
        {
            switch (args.Reason)
            {
                case CancellationReason::EndOfStream:
                    std::cout << "End of audio reached" << std::endl;
                    break;
    
                case CancellationReason::Error:
                    std::cout << "Canceled due to error. " << (long)args.ErrorCode << ": " << args.ErrorDetails << std::endl;
                    break;
            }
        };
        conversationTranslator->ConversationExpiration += [](const ConversationExpirationEventArgs& args)
        {
            std::cout << "Conversation will expire in " << args.ExpirationTime.count() << " minutes" << std::endl;
        };
        conversationTranslator->ParticipantsChanged += [](const ConversationParticipantsChangedEventArgs& args)
        {
            std::cout << "The following participant(s) have ";
            switch (args.Reason)
            {
                case ParticipantChangedReason::JoinedConversation:
                    std::cout << "joined";
                    break;
    
                case ParticipantChangedReason::LeftConversation:
                    std::cout << "left";
                    break;
    
                case ParticipantChangedReason::Updated:
                    std::cout << "been updated";
                    break;
            }
    
            std::cout << ":" << std::endl;
    
            for(std::shared_ptr<Participant> participant : args.Participants)
            {
                std::cout << "\t" << participant->DisplayName << std::endl;
            }
        };
        conversationTranslator->Transcribing += [](const ConversationTranslationEventArgs& args)
        {
            std::cout << "Received a partial transcription from " << args.Result->ParticipantId << ": " << args.Result->Text << std::endl;
            for (const auto& entry : args.Result->Translations)
            {
                std::cout << "\t" << entry.first << ": " << entry.second << std::endl;
            }
        };
        conversationTranslator->Transcribed += [](const ConversationTranslationEventArgs& args)
        {
            std::cout << "Received a transcription from " << args.Result->ParticipantId << ": " << args.Result->Text << std::endl;
            for (const auto& entry : args.Result->Translations)
            {
                std::cout << "\t" << entry.first << ": " << entry.second << std::endl;
            }
        };
        conversationTranslator->TextMessageReceived += [](const ConversationTranslationEventArgs& args)
        {
            std::cout << "Received an instant message from " << args.Result->ParticipantId << ": " << args.Result->Text << std::endl;
            for (const auto& entry : args.Result->Translations)
            {
                std::cout << "\t" << entry.first << ": " << entry.second << std::endl;
            }
        };
    
        // Join the conversation so you can start receiving events
        conversationTranslator->JoinConversationAsync(conversation, "Test Host").get();
    
        // Send an instant message
        conversationTranslator->SendTextMessageAsync("This is a short test message").get();
    
        // Start sending audio
        conversationTranslator->StartTranscribingAsync().get();
        std::cout << "Started transcribing. Press Ctrl + C to stop" << std::endl;
        future.get(); // wait for Ctrl - C to be pressed
    
        // Stop audio capture
        conversationTranslator->StopTranscribingAsync().get();
    
        // Leave the conversation. You will stop receiving events
        conversationTranslator->LeaveConversationAsync().get();
    
        // Once you are done, remember to delete the conversation.
        conversation->EndConversationAsync().get(); // You will not be able to rejoin after this
        conversation->DeleteConversationAsync().get(); // All participants still in the room will be ejected
    }
    
    int main()
    {
        // Register a handler for the Ctrl - C callback
        SetConsoleCtrlHandler(
            [](DWORD dwCtrlType) -> BOOL
            {
                if (dwCtrlType == CTRL_C_EVENT)
                {
                    // signal that the user has pressed ctrl + C
                    promise.set_value(true);
                    return TRUE;
                }
    
                return FALSE;
            },
            TRUE);
    
        StartNewConversation();
    }
    ```

1. In the same file, replace the string `YourSubscriptionKey` with your subscription key.

1. Replace the string `YourServiceRegion` with the [region](~/articles/cognitive-services/Speech-Service/regions.md) associated with your subscription (for example, `westus` for the free trial subscription).

1. From the menu bar, choose **File** > **Save All**.

## Build and run the application to create a new conversation

1. From the menu bar, select **Build** > **Build Solution** to build the application. The code should compile without errors now.

1. Choose **Debug** > **Start Debugging** (or press **F5**) to start the **helloworld** application.

1. Once you see the ```Started transcribing``` message appear, you can start speaking. You will the transcriptions appear as you speak
    - If you share the conversation code with the others and they join the conversation, you will see their transcriptions as well.

1. Once you are done speaking, press `Ctrl + C` on your keyboard to stop audio capture.

## Build and run the application to join an existing conversation

1. Copy and paste the following function into your **helloworld.cpp** just before the `int main()` function:

    ```C++
    void JoinExistingConversation()
    {
        // set this to the conversation you want to join
        std::string conversationId("");
        std::string speechLanguage("en-US");
    
        // You'll now need to create a ConversationTranslator to send audio, send IMs, and receive conversation events
        auto audioConfig = AudioConfig::FromDefaultMicrophoneInput();
        auto conversationTranslator = ConversationTranslator::FromConfig(audioConfig);
    
        // attach event handlers here. For example:
        conversationTranslator->Transcribed += [](const ConversationTranslationEventArgs& args)
        {
            std::cout << "Received a transcription from " << args.Result->ParticipantId << ": " << args.Result->Text << std::endl;
            for (const auto& entry : args.Result->Translations)
            {
                std::cout << "\t" << entry.first << ": " << entry.second << std::endl;
            }
        };
    
        // Join the conversation
        conversationTranslator->JoinConversationAsync(conversationId, "participant", speechLanguage).get();
    
        // you can start audio, stop audio, and send IMs here
    
        // Once you are done, leave the conversation
        conversationTranslator->LeaveConversationAsync().get();
    }
    ```

[!INCLUDE [create-from-web](../create-from-web.md)]

3. Replace `StartNewConversation();` in your `int main()` function with:

    ```C++
    // set this to the conversation you want to join
    JoinExistingConversation("YourConversationId");
    ```

1. Replace `YourConversationId` in step with the conversation ID from step 2.

1. From the menu bar, select **Build** > **Build Solution** to build the application. The code should compile without errors now.

1. Choose **Debug** > **Start Debugging** (or press **F5**) to start the **helloworld** application.

1. Once you see the ```Started transcribing``` message appear, you can start speaking. You will the transcriptions appear as you speak.
    - If you go back to your browser, you should see your transcriptions appear there as you speak as well.

1.  Once you are done speaking, press Ctrl + c to stop audio capture, and end the conversation.

1. Go back to your browser and exit the conversation using the <img src="../../../../media/scenarios/conversation_translator_web_exit_button.png" width="20" /> button in the upper right corner.

## Next steps

[!INCLUDE [footer](./footer.md)]