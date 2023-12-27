---
author: chschrae
manager: travisw
ms.service: azure-ai-speech
ms.date: 11/15/2021
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

Before you can initialize an `IntentRecognizer` object, you need to create a configuration that uses the key and Azure region for your Azure AI services prediction resource.

* Replace `"YOUR_SUBSCRIPTION_KEY"` with your Azure AI services prediction key.
* Replace `"YOUR_SUBSCRIPTION_REGION"` with your Azure AI services resource region.

This sample uses the `FromSubscription()` method to build the `SpeechConfig`. For a full list of available methods, see [SpeechConfig Class](/cpp/cognitive-services/speech/speechconfig).

## Initialize an IntentRecognizer

Now create an `IntentRecognizer`. Insert this code right below your Speech configuration.

```cpp
    auto intentRecognizer = IntentRecognizer::FromConfig(config);
```

## Add some intents

You need to associate some patterns with a `PatternMatchingModel` and apply it to the `IntentRecognizer`.
We will start by creating a `PatternMatchingModel` and adding a few intents to it. A PatternMatchingIntent is a struct so we will just use the in-line syntax.

> [!Note]
> We can add multiple patterns to a `PatternMatchingIntent`.

```cpp
auto model = PatternMatchingModel::FromId("myNewModel");

model->Intents.push_back({"Take me to floor {floorName}.", "Go to floor {floorName}."} , "ChangeFloors");
model->Intents.push_back({"{action} the door."}, "OpenCloseDoor");
```

## Add some custom entities

To take full advantage of the pattern matcher you can customize your entities. We will make "floorName" a list of the available floors.

```cpp
model->Entities.push_back({ "floorName" , Intent::EntityType::List, Intent::EntityMatchMode::Strict, {"one", "1", "two", "2", "lobby", "ground floor"} });
```

## Apply our model to the Recognizer

Now it is necessary to apply the model to the `IntentRecognizer`. It is possible to use multiple models at once so the API takes a collection of models.

```cpp
std::vector<std::shared_ptr<LanguageUnderstandingModel>> collection;

collection.push_back(model);
intentRecognizer->ApplyLanguageModels(collection);
```

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

    auto model = PatternMatchingModel::FromId("myNewModel");

    model->Intents.push_back({"Take me to floor {floorName}.", "Go to floor {floorName}."} , "ChangeFloors");
    model->Intents.push_back({"{action} the door."}, "OpenCloseDoor");

    model->Entities.push_back({ "floorName" , Intent::EntityType::List, Intent::EntityMatchMode::Strict, {"one", "1", "two", "2", "lobby", "ground floor"} });

    std::vector<std::shared_ptr<LanguageUnderstandingModel>> collection;

    collection.push_back(model);
    intentRecognizer->ApplyLanguageModels(collection);

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

For example if you say "Take me to floor 2", this should be the output:

```text
Say something ...
RECOGNIZED: Text = Take me to floor 2.
  Intent Id = ChangeFloors
  Floor name: = 2
```

Another example if you say "Take me to floor 7", this should be the output:

```text
Say something ...
RECOGNIZED: Text = Take me to floor 7.
NO INTENT RECOGNIZED!
```

The Intent ID is empty because 7 was not in our list.
