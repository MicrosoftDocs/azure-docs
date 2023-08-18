---
author: ralphe
manager: travisw
ms.service: cognitive-services
ms.subservice: speech-service
ms.date: 11/15/2021
ms.topic: include
ms.author: ralphe
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

Before you can initialize an `IntentRecognizer` object, you need to create a configuration that uses the key and Azure region for your Azure AI services prediction resource.

* Replace `"YOUR_SUBSCRIPTION_KEY"` with your Azure AI services prediction key.
* Replace `"YOUR_SUBSCRIPTION_REGION"` with your Azure AI services resource region.

This sample uses the `FromSubscription()` method to build the `SpeechConfig`. For a full list of available methods, see [SpeechConfig Class](/dotnet/api/microsoft.cognitiveservices.speech.speechconfig).

## Initialize an IntentRecognizer

Now create an `IntentRecognizer`. Insert this code right below your Speech configuration.

```C#
using (var recognizer = new IntentRecognizer(config))
{
    
}
```

## Add some intents

You need to associate some patterns with a `PatternMatchingModel` and apply it to the `IntentRecognizer`.
We will start by creating a `PatternMatchingModel` and adding a few intents to it.

> [!Note]
> We can add multiple patterns to a `PatternMatchingIntent`.

Insert this code inside the `using` block:

```C#
// Creates a Pattern Matching model and adds specific intents from your model. The
// Id is used to identify this model from others in the collection.
var model = new PatternMatchingModel("YourPatternMatchingModelId");

// Creates a pattern that uses groups of optional words. "[Go | Take me]" will match either "Go", "Take me", or "".
var patternWithOptionalWords = "[Go | Take me] to [floor|level] {floorName}";

// Creates a pattern that uses an optional entity and group that could be used to tie commands together.
var patternWithOptionalEntity = "Go to parking [{parkingLevel}]";

// You can also have multiple entities of the same name in a single pattern by adding appending a unique identifier
// to distinguish between the instances. For example:
var patternWithTwoOfTheSameEntity = "Go to floor {floorName:1} [and then go to floor {floorName:2}]";
// NOTE: Both floorName:1 and floorName:2 are tied to the same list of entries. The identifier can be a string
//       and is separated from the entity name by a ':'

// Creates the pattern matching intents and adds them to the model
model.Intents.Add(new PatternMatchingIntent("ChangeFloors", patternWithOptionalWords, patternWithOptionalEntity, patternWithTwoOfTheSameEntity));
model.Intents.Add(new PatternMatchingIntent("DoorControl", "{action} the doors", "{action} doors", "{action} the door", "{action} door"));
```

## Add some custom entities

To take full advantage of the pattern matcher you can customize your entities. We will make "floorName" a list of the available floors. We will also make "parkingLevel" an integer entity.

Insert this code below your intents:

```C#
// Creates the "floorName" entity and set it to type list.
// Adds acceptable values. NOTE the default entity type is Any and so we do not need
// to declare the "action" entity.
model.Entities.Add(PatternMatchingEntity.CreateListEntity("floorName", EntityMatchMode.Strict, "ground floor", "lobby", "1st", "first", "one", "1", "2nd", "second", "two", "2"));

// Creates the "parkingLevel" entity as a pre-built integer
model.Entities.Add(PatternMatchingEntity.CreateIntegerEntity("parkingLevel"));
```

## Apply our model to the Recognizer

Now it is necessary to apply the model to the `IntentRecognizer`. It is possible to use multiple models at once so the API takes a collection of models.

Insert this code below your entities:

```C#
var modelCollection = new LanguageUnderstandingModelCollection();
modelCollection.Add(model);

recognizer.ApplyLanguageModels(modelCollection);
```

## Recognize an intent

From the `IntentRecognizer` object, you're going to call the `RecognizeOnceAsync()` method. This method asks the Speech service to recognize speech in a single phrase, and stop recognizing speech once the phrase is identified.

Insert this code after applying the language models:

```C#
Console.WriteLine("Say something...");

var result = await recognizer.RecognizeOnceAsync();
```

## Display the recognition results (or errors)

When the recognition result is returned by the Speech service, we will print the result.

Insert this code below `var result = await recognizer.RecognizeOnceAsync();`:

```C#
if (result.Reason == ResultReason.RecognizedIntent)
{
    Console.WriteLine($"RECOGNIZED: Text={result.Text}");
    Console.WriteLine($"       Intent Id={result.IntentId}.");

    var entities = result.Entities;
    switch (result.IntentId)
    {
        case "ChangeFloors":
            if (entities.TryGetValue("floorName", out string floorName))
            {
                Console.WriteLine($"       FloorName={floorName}");
            }

            if (entities.TryGetValue("floorName:1", out floorName))
            {
                Console.WriteLine($"     FloorName:1={floorName}");
            }

            if (entities.TryGetValue("floorName:2", out floorName))
            {
                Console.WriteLine($"     FloorName:2={floorName}");
            }

            if (entities.TryGetValue("parkingLevel", out string parkingLevel))
            {
                Console.WriteLine($"    ParkingLevel={parkingLevel}");
            }

            break;

        case "DoorControl":
            if (entities.TryGetValue("action", out string action))
            {
                Console.WriteLine($"          Action={action}");
            }
            break;
    }
}
else if (result.Reason == ResultReason.RecognizedSpeech)
{
    Console.WriteLine($"RECOGNIZED: Text={result.Text}");
    Console.WriteLine($"    Intent not recognized.");
}
else if (result.Reason == ResultReason.NoMatch)
{
    Console.WriteLine($"NOMATCH: Speech could not be recognized.");
}
else if (result.Reason == ResultReason.Canceled)
{
    var cancellation = CancellationDetails.FromResult(result);
    Console.WriteLine($"CANCELED: Reason={cancellation.Reason}");

    if (cancellation.Reason == CancellationReason.Error)
    {
        Console.WriteLine($"CANCELED: ErrorCode={cancellation.ErrorCode}");
        Console.WriteLine($"CANCELED: ErrorDetails={cancellation.ErrorDetails}");
        Console.WriteLine($"CANCELED: Did you set the speech resource key and region values?");
    }
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

            using (var recognizer = new IntentRecognizer(config))
            {
                // Creates a Pattern Matching model and adds specific intents from your model. The
                // Id is used to identify this model from others in the collection.
                var model = new PatternMatchingModel("YourPatternMatchingModelId");

                // Creates a pattern that uses groups of optional words. "[Go | Take me]" will match either "Go", "Take me", or "".
                var patternWithOptionalWords = "[Go | Take me] to [floor|level] {floorName}";

                // Creates a pattern that uses an optional entity and group that could be used to tie commands together.
                var patternWithOptionalEntity = "Go to parking [{parkingLevel}]";

                // You can also have multiple entities of the same name in a single pattern by adding appending a unique identifier
                // to distinguish between the instances. For example:
                var patternWithTwoOfTheSameEntity = "Go to floor {floorName:1} [and then go to floor {floorName:2}]";
                // NOTE: Both floorName:1 and floorName:2 are tied to the same list of entries. The identifier can be a string
                //       and is separated from the entity name by a ':'

                // Adds some intents to look for specific patterns.
                model.Intents.Add(new PatternMatchingIntent("ChangeFloors", patternWithOptionalWords, patternWithOptionalEntity, patternWithTwoOfTheSameEntity));
                model.Intents.Add(new PatternMatchingIntent("DoorControl", "{action} the doors", "{action} doors", "{action} the door", "{action} door"));

                // Creates the "floorName" entity and set it to type list.
                // Adds acceptable values. NOTE the default entity type is Any and so we do not need
                // to declare the "action" entity.
                model.Entities.Add(PatternMatchingEntity.CreateListEntity("floorName", EntityMatchMode.Strict, "ground floor", "lobby", "1st", "first", "one", "1", "2nd", "second", "two", "2"));

                // Creates the "parkingLevel" entity as a pre-built integer
                model.Entities.Add(PatternMatchingEntity.CreateIntegerEntity("parkingLevel"));

                var modelCollection = new LanguageUnderstandingModelCollection();
                modelCollection.Add(model);

                recognizer.ApplyLanguageModels(modelCollection);

                Console.WriteLine("Say something...");

                var result = await recognizer.RecognizeOnceAsync();

                if (result.Reason == ResultReason.RecognizedIntent)
                {
                    Console.WriteLine($"RECOGNIZED: Text={result.Text}");
                    Console.WriteLine($"       Intent Id={result.IntentId}.");

                    var entities = result.Entities;
                    switch (result.IntentId)
                    {
                        case "ChangeFloors":
                            if (entities.TryGetValue("floorName", out string floorName))
                            {
                                Console.WriteLine($"       FloorName={floorName}");
                            }

                            if (entities.TryGetValue("floorName:1", out floorName))
                            {
                                Console.WriteLine($"     FloorName:1={floorName}");
                            }

                            if (entities.TryGetValue("floorName:2", out floorName))
                            {
                                Console.WriteLine($"     FloorName:2={floorName}");
                            }

                            if (entities.TryGetValue("parkingLevel", out string parkingLevel))
                            {
                                Console.WriteLine($"    ParkingLevel={parkingLevel}");
                            }

                            break;

                        case "DoorControl":
                            if (entities.TryGetValue("action", out string action))
                            {
                                Console.WriteLine($"          Action={action}");
                            }
                            break;
                    }
                }
                else if (result.Reason == ResultReason.RecognizedSpeech)
                {
                    Console.WriteLine($"RECOGNIZED: Text={result.Text}");
                    Console.WriteLine($"    Intent not recognized.");
                }
                else if (result.Reason == ResultReason.NoMatch)
                {
                    Console.WriteLine($"NOMATCH: Speech could not be recognized.");
                }
                else if (result.Reason == ResultReason.Canceled)
                {
                    var cancellation = CancellationDetails.FromResult(result);
                    Console.WriteLine($"CANCELED: Reason={cancellation.Reason}");

                    if (cancellation.Reason == CancellationReason.Error)
                    {
                        Console.WriteLine($"CANCELED: ErrorCode={cancellation.ErrorCode}");
                        Console.WriteLine($"CANCELED: ErrorDetails={cancellation.ErrorDetails}");
                        Console.WriteLine($"CANCELED: Did you set the speech resource key and region values?");
                    }
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

For example if you say "Take me to floor 2", this should be the output:

```text
Say something...
RECOGNIZED: Text=Take me to floor 2.
       Intent Id=ChangeFloors.
       FloorName=2
```

As another example if you say "Take me to floor 7", this should be the output:

```text
Say something...
RECOGNIZED: Text=Take me to floor 7.
    Intent not recognized.
```

No intent was recognized because 7 was not in our list of valid values for floorName.
