---
author: chschrae
manager: travisw
ms.service: cognitive-services
ms.subservice: speech-service
ms.date: 01/03/2022
ms.topic: include
ms.author: chschrae
zone_pivot_groups: programming-languages-set-two
---

## Create a project

Create a new C# console application project in Visual Studio 2019 and [install the Speech SDK](../../../../quickstarts/setup-platform.md?pivots=programming-language-csharp).

## Start with some boilerplate code

Let's open `Program.cs` and add some code that works as a skeleton for our project.

```C#
using System;
using System.Threading.Tasks;
using Microsoft.CognitiveServices.Speech;
using Microsoft.CognitiveServices.Speech.Intent;

namespace helloworld
{
    class Program
    {
        static void Main(string[] args)
        {
            IntentPatternMatchingWithMicrophoneAsync().Wait();
        }

        private static async Task IntentPatternMatchingWithMicrophoneAsync()
        {
            var config = SpeechConfig.FromSubscription("YOUR_SUBSCRIPTION_KEY", "YOUR_SUBSCRIPTION_REGION");
        }
    }
}
```

## Create a Speech configuration

Before you can initialize an `IntentRecognizer` object, you need to create a configuration that uses the key and location for your Azure AI services prediction resource.

* Replace `"YOUR_SUBSCRIPTION_KEY"` with your Azure AI services prediction key.
* Replace `"YOUR_SUBSCRIPTION_REGION"` with your Azure AI services resource region.

This sample uses the `FromSubscription()` method to build the `SpeechConfig`. For a full list of available methods, see [SpeechConfig Class](/dotnet/api/microsoft.cognitiveservices.speech.speechconfig).

## Initialize an IntentRecognizer

Now create an `IntentRecognizer`. Insert this code right below your Speech configuration.

```C#
using (var intentRecognizer = new IntentRecognizer(config))
{
    
}
```

## Add some intents

You need to associate some patterns with the `IntentRecognizer` by calling `AddIntent()`.
We will add 2 intents with the same ID for changing floors, and another intent with a separate ID for opening and closing doors.
Insert this code inside the `using` block:

```C#
intentRecognizer.AddIntent("Take me to floor {floorName}.", "ChangeFloors");
intentRecognizer.AddIntent("Go to floor {floorName}.", "ChangeFloors");
intentRecognizer.AddIntent("{action} the door.", "OpenCloseDoor");
```

> [!NOTE]
> There is no limit to the number of entities you can declare, but they will be loosely matched. If you add a phrase like "{action} door" it will match any time there is text before the word "door". Intents are evaluated based on their number of entities. If two patterns would match, the one with more defined entities is returned.

## Recognize an intent

From the `IntentRecognizer` object, you're going to call the `RecognizeOnceAsync()` method. This method asks the Speech service to recognize speech in a single phrase, and stop recognizing speech once the phrase is identified. For simplicity we'll wait on the future returned to complete.

Insert this code below your intents:

```C#
Console.WriteLine("Say something...");

var result = await intentRecognizer.RecognizeOnceAsync();
```

## Display the recognition results (or errors)

When the recognition result is returned by the Speech service, we will print the result.

Insert this code below `var result = await recognizer.RecognizeOnceAsync();`:

```C#
string floorName;
switch (result.Reason)
{
    case ResultReason.RecognizedSpeech:
        Console.WriteLine($"RECOGNIZED: Text= {result.Text}");
        Console.WriteLine($"    Intent not recognized.");
        break;
    case ResultReason.RecognizedIntent:
        Console.WriteLine($"RECOGNIZED: Text= {result.Text}");
        Console.WriteLine($"       Intent Id= {result.IntentId}.");
        var entities = result.Entities;
        if (entities.TryGetValue("floorName", out floorName))
        {
            Console.WriteLine($"       FloorName= {floorName}");
        }
    
        if (entities.TryGetValue("action", out floorName))
        {
            Console.WriteLine($"       Action= {floorName}");
        }
    
        break;
    case ResultReason.NoMatch:
    {
        Console.WriteLine($"NOMATCH: Speech could not be recognized.");
        var noMatch = NoMatchDetails.FromResult(result);
        switch (noMatch.Reason)
        {
            case NoMatchReason.NotRecognized:
                Console.WriteLine($"NOMATCH: Speech was detected, but not recognized.");
                break;
            case NoMatchReason.InitialSilenceTimeout:
                Console.WriteLine($"NOMATCH: The start of the audio stream contains only silence, and the service timed out waiting for speech.");
                break;
            case NoMatchReason.InitialBabbleTimeout:
                Console.WriteLine($"NOMATCH: The start of the audio stream contains only noise, and the service timed out waiting for speech.");
                break;
            case NoMatchReason.KeywordNotRecognized:
                Console.WriteLine($"NOMATCH: Keyword not recognized");
                break;
        }
        break;
    }
    case ResultReason.Canceled:
    {
        var cancellation = CancellationDetails.FromResult(result);
        Console.WriteLine($"CANCELED: Reason={cancellation.Reason}");
    
        if (cancellation.Reason == CancellationReason.Error)
        {
            Console.WriteLine($"CANCELED: ErrorCode={cancellation.ErrorCode}");
            Console.WriteLine($"CANCELED: ErrorDetails={cancellation.ErrorDetails}");
            Console.WriteLine($"CANCELED: Did you set the speech resource key and region values?");
        }
        break;
    }
    default:
        break;
}
```

## Check your code

At this point, your code should look like this:

```C#
using System;
using System.Threading.Tasks;
using Microsoft.CognitiveServices.Speech;
using Microsoft.CognitiveServices.Speech.Intent;

namespace helloworld
{
    class Program
    {
        static void Main(string[] args)
        {
            IntentPatternMatchingWithMicrophoneAsync().Wait();
        }

        private static async Task IntentPatternMatchingWithMicrophoneAsync()
        {
            var config = SpeechConfig.FromSubscription("YOUR_SUBSCRIPTION_KEY", "YOUR_SUBSCRIPTION_REGION");
            using (var intentRecognizer = new IntentRecognizer(config))
            {
                intentRecognizer.AddIntent("Take me to floor {floorName}.", "ChangeFloors");
                intentRecognizer.AddIntent("Go to floor {floorName}.", "ChangeFloors");
                intentRecognizer.AddIntent("{action} the door.", "OpenCloseDoor");

                Console.WriteLine("Say something...");

                var result = await intentRecognizer.RecognizeOnceAsync();

                string floorName;
                switch (result.Reason)
                {
                    case ResultReason.RecognizedSpeech:
                        Console.WriteLine($"RECOGNIZED: Text= {result.Text}");
                        Console.WriteLine($"    Intent not recognized.");
                        break;
                    case ResultReason.RecognizedIntent:
                        Console.WriteLine($"RECOGNIZED: Text= {result.Text}");
                        Console.WriteLine($"       Intent Id= {result.IntentId}.");
                        var entities = result.Entities;
                        if (entities.TryGetValue("floorName", out floorName))
                        {
                            Console.WriteLine($"       FloorName= {floorName}");
                        }

                        if (entities.TryGetValue("action", out floorName))
                        {
                            Console.WriteLine($"       Action= {floorName}");
                        }

                        break;
                    case ResultReason.NoMatch:
                    {
                        Console.WriteLine($"NOMATCH: Speech could not be recognized.");
                        var noMatch = NoMatchDetails.FromResult(result);
                        switch (noMatch.Reason)
                        {
                            case NoMatchReason.NotRecognized:
                                Console.WriteLine($"NOMATCH: Speech was detected, but not recognized.");
                                break;
                            case NoMatchReason.InitialSilenceTimeout:
                                Console.WriteLine($"NOMATCH: The start of the audio stream contains only silence, and the service timed out waiting for speech.");
                                break;
                            case NoMatchReason.InitialBabbleTimeout:
                                Console.WriteLine($"NOMATCH: The start of the audio stream contains only noise, and the service timed out waiting for speech.");
                                break;
                            case NoMatchReason.KeywordNotRecognized:
                                Console.WriteLine($"NOMATCH: Keyword not recognized");
                                break;
                        }
                        break;
                    }
                    case ResultReason.Canceled:
                    {
                        var cancellation = CancellationDetails.FromResult(result);
                        Console.WriteLine($"CANCELED: Reason={cancellation.Reason}");

                        if (cancellation.Reason == CancellationReason.Error)
                        {
                            Console.WriteLine($"CANCELED: ErrorCode={cancellation.ErrorCode}");
                            Console.WriteLine($"CANCELED: ErrorDetails={cancellation.ErrorDetails}");
                            Console.WriteLine($"CANCELED: Did you set the speech resource key and region values?");
                        }
                        break;
                    }
                    default:
                        break;
                }
            }
        }
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
RECOGNIZED: Text= Take me to floor 7.
  Intent Id= ChangeFloors
  FloorName= 7
```
