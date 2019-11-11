---
title: 'Quickstart: Conversation Translator, C++ (Windows) - Speech Service'
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
> * [Create an empty sample project](../../../../quickstarts/create-project.md?tabs=windows)

## Add sample code

1. Open the source file **helloworld.cpp**.

1. Replace all the code with the following snippet:

    ```C++
    #include <iostream>
    #include <thread>
    #include <chrono>
    #include <string>
    #include <speechapi_cxx.h>
    
    using namespace std::chrono_literals;
    using namespace Microsoft::CognitiveServices::Speech;
    using namespace Microsoft::CognitiveServices::Speech::Audio;
    using namespace Microsoft::CognitiveServices::Speech::Transcription;

    void CreateConversation()
    {
        // set these
        std::string subscriptionKey("YourSubscriptionKey");
        std::string region("YourServiceRegion");
        std::string speechLanguage("en-US");
    
        // Create the conversation object you'll need to manage the conversation
        auto speechConfig = SpeechConfig::FromSubscription(subscriptionKey, region);
        speechConfig->SetSpeechRecognitionLanguage(speechLanguage);
        auto conversation = Conversation::CreateConversationAsync(speechConfig).get();
    
        // Start the conversation so you and others can join
        conversation->StartConversationAsync().get();
    
        // You can now call various commands to manage the room. For example:
        conversation->MuteAllParticipantsAsync().get();
    
        // Create the conversation translator you'll need to send audio, send IMs, and receive conversation events
        auto audioConfig = AudioConfig::FromDefaultMicrophoneInput();
        auto conversationTranslator = ConversationTranslator::FromConfig(audioConfig);
    
        // add any event handlers. For example to get final transcriptions for your speech recognitions
        conversationTranslator->Transcribed += [](const ConversationTranslationEventArgs& args)
        {
            std::cout << "Received a final transcription: '" << args.Result->Text << "'" << std::endl;
        };
    
        // Join the conversation so you can start receiving events
        conversationTranslator->JoinConversationAsync(conversation, "Test Host").get();
    
        // Send an instant message
        conversationTranslator->SendTextMessageAsync("This is a short test message").get();
    
        // Start and stop sending audio
        conversationTranslator->StartTranscribingAsync().get();
        std::this_thread::sleep_for(15s);
        conversationTranslator->StopTranscribingAsync().get();
    
        // Leave the conversation. You will stop receiving events
        conversationTranslator->LeaveConversationAsync().get();
    
        // Once you are done, remember to delete the conversation.
        conversation->EndConversationAsync().get(); // You will not be able to rejoin after this
        conversation->DeleteConversationAsync().get(); // All participants still in the room will be ejected
    }

    int main()
    {
        CreateConversation();
    }
    ```

1. In the same file, replace the string `YourSubscriptionKey` with your subscription key.

1. Replace the string `YourServiceRegion` with the [region](~/articles/cognitive-services/Speech-Service/regions.md) associated with your subscription (for example, `westus` for the free trial subscription).

1. From the menu bar, choose **File** > **Save All**.

## Build and run the application

## Build and run the application

1. From the menu bar, select **Build** > **Build Solution** to build the application. The code should compile without errors now.

1. Choose **Debug** > **Start Debugging** (or press **F5**) to start the **helloworld** application.

1. TODO

## Next steps

[!INCLUDE [footer](./footer.md)]
