---
author: chschrae
manager: travisw
ms.service: azure-ai-speech
ms.date: 01/03/2022
ms.topic: include
ms.author: chschrae
zone_pivot_groups: programming-languages-set-two
---

## Create a project

Create a new C++ console application project in Visual Studio 2019 and [install the Speech SDK](../../../../quickstarts/setup-platform.md?pivots=programming-language-cpp).

## Start with some boilerplate code

Let's open `helloworld.cpp` and add some code that works as a skeleton for our project.

```cpp
    #include <iostream>
    #include <speechapi_cxx.h>

    using namespace Microsoft::CognitiveServices::Speech;
    using namespace Microsoft::CognitiveServices::Speech::Intent;

    int main()
    {
        std::cout << "Hello World!\n";

        auto config = SpeechConfig::FromSubscription("YOUR_SUBSCRIPTION_KEY", "YOUR_SUBSCRIPTION_REGION");
    }
```

## Create a Speech configuration

Before you can initialize an `IntentRecognizer` object, you need to create a configuration that uses the key and location for your Azure AI services prediction resource.

* Replace `"YOUR_SUBSCRIPTION_KEY"` with your Azure AI services prediction key.
* Replace `"YOUR_SUBSCRIPTION_REGION"` with your Azure AI services resource region.

This sample uses the `FromSubscription()` method to build the `SpeechConfig`. For a full list of available methods, see [SpeechConfig Class](/cpp/cognitive-services/speech/speechconfig).

## Initialize an IntentRecognizer

Now create an `IntentRecognizer`. Insert this code right below your Speech configuration.

```cpp
    auto intentRecognizer = IntentRecognizer::FromConfig(config);
```

## Add some intents

You need to associate some patterns with the `IntentRecognizer` by calling `AddIntent()`.
We will add 2 intents with the same ID for changing floors, and another intent with a separate ID for opening and closing doors.

```cpp
    intentRecognizer->AddIntent("Take me to floor {floorName}.", "ChangeFloors");
    intentRecognizer->AddIntent("Go to floor {floorName}.", "ChangeFloors");
    intentRecognizer->AddIntent("{action} the door.", "OpenCloseDoor");
```

> [!NOTE]
> There is no limit to the number of entities you can declare, but they will be loosely matched. If you add a phrase like "{action} door" it will match any time there is text before the word "door". Intents are evaluated based on their number of entities. If two patterns would match, the one with more defined entities is returned.

## Recognize an intent

From the `IntentRecognizer` object, you're going to call the `RecognizeOnceAsync()` method. This method asks the Speech service to recognize speech in a single phrase, and stop recognizing speech once the phrase is identified. For simplicity we'll wait on the future returned to complete.

Insert this code below your intents:

```cpp
    std::cout << "Say something ..." << std::endl;
    auto result = intentRecognizer->RecognizeOnceAsync().get();
```

## Display the recognition results (or errors)

When the recognition result is returned by the Speech service, we will print the result.

Insert this code below `auto result = intentRecognizer->RecognizeOnceAsync().get();`:

```cpp
switch (result->Reason)
{
case ResultReason::RecognizedSpeech:
        std::cout << "RECOGNIZED: Text = " << result->Text.c_str() << std::endl;
        std::cout << "NO INTENT RECOGNIZED!" << std::endl;
        break;
case ResultReason::RecognizedIntent:
    std::cout << "RECOGNIZED: Text = " << result->Text.c_str() << std::endl;
    std::cout << "  Intent Id = " << result->IntentId.c_str() << std::endl;
    auto entities = result->GetEntities();
    if (entities.find("floorName") != entities.end())
    {
        std::cout << "  Floor name: = " << entities["floorName"].c_str() << std::endl;
    }

    if (entities.find("action") != entities.end())
    {
        std::cout << "  Action: = " << entities["action"].c_str() << std::endl;
    }

    break;
case ResultReason::NoMatch:
{
    auto noMatch = NoMatchDetails::FromResult(result);
    switch (noMatch->Reason)
    {
    case NoMatchReason::NotRecognized:
        std::cout << "NOMATCH: Speech was detected, but not recognized." << std::endl;
        break;
    case NoMatchReason::InitialSilenceTimeout:
        std::cout << "NOMATCH: The start of the audio stream contains only silence, and the service timed out waiting for speech." << std::endl;
        break;
    case NoMatchReason::InitialBabbleTimeout:
        std::cout << "NOMATCH: The start of the audio stream contains only noise, and the service timed out waiting for speech." << std::endl;
        break;
    case NoMatchReason::KeywordNotRecognized:
        std::cout << "NOMATCH: Keyword not recognized" << std::endl;
        break;
    }
    break;
}
case ResultReason::Canceled:
{
    auto cancellation = CancellationDetails::FromResult(result);

    if (!cancellation->ErrorDetails.empty())
    {
        std::cout << "CANCELED: ErrorDetails=" << cancellation->ErrorDetails.c_str() << std::endl;
        std::cout << "CANCELED: Did you set the speech resource key and region values?" << std::endl;
    }
}
default:
    break;
}
```

## Check your code

At this point, your code should look like this:

```cpp
#include <iostream>
#include <speechapi_cxx.h>

using namespace Microsoft::CognitiveServices::Speech;
using namespace Microsoft::CognitiveServices::Speech::Intent;

int main()
{
    auto config = SpeechConfig::FromSubscription("YOUR_SUBSCRIPTION_KEY", "YOUR_SUBSCRIPTION_REGION");
    auto intentRecognizer = IntentRecognizer::FromConfig(config);

    intentRecognizer->AddIntent("Take me to floor {floorName}.", "ChangeFloors");
    intentRecognizer->AddIntent("Go to floor {floorName}.", "ChangeFloors");
    intentRecognizer->AddIntent("{action} the door.", "OpenCloseDoor");

    std::cout << "Say something ..." << std::endl;

    auto result = intentRecognizer->RecognizeOnceAsync().get();

    switch (result->Reason)
    {
    case ResultReason::RecognizedSpeech:
        std::cout << "RECOGNIZED: Text = " << result->Text.c_str() << std::endl;
        std::cout << "NO INTENT RECOGNIZED!" << std::endl;
        break;
    case ResultReason::RecognizedIntent:
        std::cout << "RECOGNIZED: Text = " << result->Text.c_str() << std::endl;
        std::cout << "  Intent Id = " << result->IntentId.c_str() << std::endl;
        auto entities = result->GetEntities();
        if (entities.find("floorName") != entities.end())
        {
            std::cout << "  Floor name: = " << entities["floorName"].c_str() << std::endl;
        }

        if (entities.find("action") != entities.end())
        {
            std::cout << "  Action: = " << entities["action"].c_str() << std::endl;
        }

        break;
    case ResultReason::NoMatch:
    {
        auto noMatch = NoMatchDetails::FromResult(result);
        switch (noMatch->Reason)
        {
        case NoMatchReason::NotRecognized:
            std::cout << "NOMATCH: Speech was detected, but not recognized." << std::endl;
            break;
        case NoMatchReason::InitialSilenceTimeout:
            std::cout << "NOMATCH: The start of the audio stream contains only silence, and the service timed out waiting for speech." << std::endl;
            break;
        case NoMatchReason::InitialBabbleTimeout:
            std::cout << "NOMATCH: The start of the audio stream contains only noise, and the service timed out waiting for speech." << std::endl;
            break;
        case NoMatchReason::KeywordNotRecognized:
            std::cout << "NOMATCH: Keyword not recognized." << std::endl;
            break;
        }
        break;
    }
    case ResultReason::Canceled:
    {
        auto cancellation = CancellationDetails::FromResult(result);

        if (!cancellation->ErrorDetails.empty())
        {
            std::cout << "CANCELED: ErrorDetails=" << cancellation->ErrorDetails.c_str() << std::endl;
            std::cout << "CANCELED: Did you set the speech resource key and region values?" << std::endl;
        }
    }
    default:
        break;
    }
}
```
## Build and run your app

Now you're ready to build your app and test our speech recognition using the Speech service.

1. **Compile the code** - From the menu bar of Visual Studio, choose **Build** > **Build Solution**.
2. **Start your app** - From the menu bar, choose **Debug** > **Start Debugging** or press <kbd>F5</kbd>.
3. **Start recognition** - It will prompt you to say something. The default language is English. Your speech is sent to the Speech service, transcribed as text, and rendered in the console.

For example if you say "Take me to floor 7", this should be the output:

```
Say something ...
RECOGNIZED: Text = Take me to floor 7.
  Intent Id = ChangeFloors
  Floor name: = 7
```
