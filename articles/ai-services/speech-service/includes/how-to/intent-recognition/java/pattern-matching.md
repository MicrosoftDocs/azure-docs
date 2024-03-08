---
author: ralphe
manager: travisw
ms.service: azure-ai-speech
ms.date: 11/15/2021
ms.topic: include
ms.author: ralphe
---

[!INCLUDE [Create project](../../../quickstarts/platform/java.md)]

## Start with some boilerplate code

1. Open `Main.java` from the src dir.

1. Replace the contents of the file with following:

```java
import java.util.ArrayList;
import java.util.Dictionary;
import java.util.concurrent.ExecutionException;


import com.microsoft.cognitiveservices.speech.*;
import com.microsoft.cognitiveservices.speech.intent.*;

public class Main {
    public static void main(String[] args) throws InterruptedException, ExecutionException {
        IntentPatternMatchingWithMicrophone();
    }

    public static void IntentPatternMatchingWithMicrophone() throws InterruptedException, ExecutionException {
        SpeechConfig config = SpeechConfig.fromSubscription("YOUR_SUBSCRIPTION_KEY", "YOUR_SUBSCRIPTION_REGION");
    }
}
```

## Create a Speech configuration

Before you can initialize an `IntentRecognizer` object, you need to create a configuration that uses the key and Azure region for your Azure AI services prediction resource.

* Replace `"YOUR_SUBSCRIPTION_KEY"` with your Azure AI services prediction key.
* Replace `"YOUR_SUBSCRIPTION_REGION"` with your Azure AI services resource region.

This sample uses the `fromSubscription()` method to build the `SpeechConfig`. For a full list of available methods, see [SpeechConfig Class](/java/api/com.microsoft.cognitiveservices.speech.speechconfig).

## Initialize an IntentRecognizer

Now create an `IntentRecognizer`. Insert this code right below your Speech configuration. We do this in a try so that we take
advantage of the autoclosable interface.

```java
try (IntentRecognizer recognizer = new IntentRecognizer(config)) {

}
```

## Add some intents

You need to associate some patterns with a `PatternMatchingModel` and apply it to the `IntentRecognizer`.
We will start by creating a `PatternMatchingModel` and adding a few intents to it.

> [!Note]
> We can add multiple patterns to a `PatternMatchingIntent`.

Insert this code inside the `try` block:

```java
// Creates a Pattern Matching model and adds specific intents from your model. The
// Id is used to identify this model from others in the collection.
PatternMatchingModel model = new PatternMatchingModel("YourPatternMatchingModelId");

// Creates a pattern that uses groups of optional words. "[Go | Take me]" will match either "Go", "Take me", or "".
String patternWithOptionalWords = "[Go | Take me] to [floor|level] {floorName}";

// Creates a pattern that uses an optional entity and group that could be used to tie commands together.
String patternWithOptionalEntity = "Go to parking [{parkingLevel}]";

// You can also have multiple entities of the same name in a single pattern by adding appending a unique identifier
// to distinguish between the instances. For example:
String patternWithTwoOfTheSameEntity = "Go to floor {floorName:1} [and then go to floor {floorName:2}]";
// NOTE: Both floorName:1 and floorName:2 are tied to the same list of entries. The identifier can be a string
//       and is separated from the entity name by a ':'

// Creates the pattern matching intents and adds them to the model
model.getIntents().put(new PatternMatchingIntent("ChangeFloors", patternWithOptionalWords, patternWithOptionalEntity, patternWithTwoOfTheSameEntity));
model.getIntents().put(new PatternMatchingIntent("DoorControl", "{action} the doors", "{action} doors", "{action} the door", "{action} door"));
```

## Add some custom entities

To take full advantage of the pattern matcher you can customize your entities. We will make "floorName" a list of the available floors. We will also make "parkingLevel" an integer entity.

Insert this code below your intents:

```java
// Creates the "floorName" entity and set it to type list.
// Adds acceptable values. NOTE the default entity type is Any and so we do not need
// to declare the "action" entity.
model.getEntities().put(PatternMatchingEntity.CreateListEntity("floorName", PatternMatchingEntity.EntityMatchMode.Strict, "ground floor", "lobby", "1st", "first", "one", "1", "2nd", "second", "two", "2"));

// Creates the "parkingLevel" entity as a pre-built integer
model.getEntities().put(PatternMatchingEntity.CreateIntegerEntity("parkingLevel"));
```

## Apply our model to the Recognizer

Now it is necessary to apply the model to the `IntentRecognizer`. It is possible to use multiple models at once so the API takes a collection of models.

Insert this code below your entities:

```java
ArrayList<LanguageUnderstandingModel> modelCollection = new ArrayList<LanguageUnderstandingModel>();
modelCollection.add(model);

recognizer.applyLanguageModels(modelCollection);
```

## Recognize an intent

From the `IntentRecognizer` object, you're going to call the `RecognizeOnceAsync()` method. This method asks the Speech service to recognize speech in a single phrase, and stop recognizing speech once the phrase is identified.

Insert this code after applying the language models:

```C#
System.out.println("Say something...");

IntentRecognitionResult result = recognizer.recognizeOnceAsync().get();
```

## Display the recognition results (or errors)

When the recognition result is returned by the Speech service, we will print the result.

Insert this code below `IntentRecognitionResult result = recognizer.recognizeOnceAsync.get();`:

```java
if (result.getReason() == ResultReason.RecognizedSpeech) {
    System.out.println("RECOGNIZED: Text= " + result.getText());
    System.out.println(String.format("%17s", "Intent not recognized."));
}
else if (result.getReason() == ResultReason.RecognizedIntent)
{
    System.out.println("RECOGNIZED: Text= " + result.getText());
    System.out.println(String.format("%17s %s", "Intent Id=", result.getIntentId() + "."));
    Dictionary<String, String> entities = result.getEntities();

    switch (result.getIntentId())
    {
        case "ChangeFloors":
            if (entities.get("floorName") != null) {
                System.out.println(String.format("%17s %s", "FloorName=", entities.get("floorName")));
            }
            if (entities.get("floorName:1") != null) {
                System.out.println(String.format("%17s %s", "FloorName:1=", entities.get("floorName:1")));
            }
            if (entities.get("floorName:2") != null) {
                System.out.println(String.format("%17s %s", "FloorName:2=", entities.get("floorName:2")));
            }
            if (entities.get("parkingLevel") != null) {
                System.out.println(String.format("%17s %s", "ParkingLevel=", entities.get("parkingLevel")));
            }
            break;
        case "DoorControl":
            if (entities.get("action") != null) {
                System.out.println(String.format("%17s %s", "Action=", entities.get("action")));
            }
            break;
    }
}
else if (result.getReason() == ResultReason.NoMatch) {
    System.out.println("NOMATCH: Speech could not be recognized.");
}
else if (result.getReason() == ResultReason.Canceled) {
    CancellationDetails cancellation = CancellationDetails.fromResult(result);
    System.out.println("CANCELED: Reason=" + cancellation.getReason());

    if (cancellation.getReason() == CancellationReason.Error)
    {
        System.out.println("CANCELED: ErrorCode=" + cancellation.getErrorCode());
        System.out.println("CANCELED: ErrorDetails=" + cancellation.getErrorDetails());
        System.out.println("CANCELED: Did you update the subscription info?");
    }
}
```

## Check your code

At this point, your code should look like this:

```java
package quickstart;
import java.util.ArrayList;
import java.util.concurrent.ExecutionException;
import java.util.Dictionary;

import com.microsoft.cognitiveservices.speech.*;
import com.microsoft.cognitiveservices.speech.intent.*;

public class Main {
    public static void main(String[] args) throws InterruptedException, ExecutionException {
        IntentPatternMatchingWithMicrophone();
    }

    public static void IntentPatternMatchingWithMicrophone() throws InterruptedException, ExecutionException {
        SpeechConfig config = SpeechConfig.fromSubscription("YOUR_SUBSCRIPTION_KEY", "YOUR_SUBSCRIPTION_REGION");
        try (IntentRecognizer recognizer = new IntentRecognizer(config)) {
            // Creates a Pattern Matching model and adds specific intents from your model. The
            // Id is used to identify this model from others in the collection.
            PatternMatchingModel model = new PatternMatchingModel("YourPatternMatchingModelId");

            // Creates a pattern that uses groups of optional words. "[Go | Take me]" will match either "Go", "Take me", or "".
            String patternWithOptionalWords = "[Go | Take me] to [floor|level] {floorName}";

            // Creates a pattern that uses an optional entity and group that could be used to tie commands together.
            String patternWithOptionalEntity = "Go to parking [{parkingLevel}]";

            // You can also have multiple entities of the same name in a single pattern by adding appending a unique identifier
            // to distinguish between the instances. For example:
            String patternWithTwoOfTheSameEntity = "Go to floor {floorName:1} [and then go to floor {floorName:2}]";
            // NOTE: Both floorName:1 and floorName:2 are tied to the same list of entries. The identifier can be a string
            // and is separated from the entity name by a ':'

            // Creates the pattern matching intents and adds them to the model
            model.getIntents().put(new PatternMatchingIntent("ChangeFloors", patternWithOptionalWords, patternWithOptionalEntity, patternWithTwoOfTheSameEntity));
            model.getIntents().put(new PatternMatchingIntent("DoorControl", "{action} the doors", "{action} doors", "{action} the door", "{action} door"));

            // Creates the "floorName" entity and set it to type list.
            // Adds acceptable values. NOTE the default entity type is Any and so we do not need
            // to declare the "action" entity.
            model.getEntities().put(PatternMatchingEntity.CreateListEntity("floorName", PatternMatchingEntity.EntityMatchMode.Strict, "ground floor", "lobby", "1st", "first", "one", "1", "2nd", "second", "two", "2"));

            // Creates the "parkingLevel" entity as a pre-built integer
            model.getEntities().put(PatternMatchingEntity.CreateIntegerEntity("parkingLevel"));

            ArrayList<LanguageUnderstandingModel> modelCollection = new ArrayList<LanguageUnderstandingModel>();
            modelCollection.add(model);

            recognizer.applyLanguageModels(modelCollection);

            System.out.println("Say something...");

            IntentRecognitionResult result = recognizer.recognizeOnceAsync().get();

            if (result.getReason() == ResultReason.RecognizedSpeech) {
                System.out.println("RECOGNIZED: Text= " + result.getText());
                System.out.println(String.format("%17s", "Intent not recognized."));
            }
            else if (result.getReason() == ResultReason.RecognizedIntent)
            {
                System.out.println("RECOGNIZED: Text= " + result.getText());
                System.out.println(String.format("%17s %s", "Intent Id=", result.getIntentId() + "."));
                Dictionary<String, String> entities = result.getEntities();

                switch (result.getIntentId())
                {
                    case "ChangeFloors":
                        if (entities.get("floorName") != null) {
                            System.out.println(String.format("%17s %s", "FloorName=", entities.get("floorName")));
                        }
                        if (entities.get("floorName:1") != null) {
                            System.out.println(String.format("%17s %s", "FloorName:1=", entities.get("floorName:1")));
                        }
                        if (entities.get("floorName:2") != null) {
                            System.out.println(String.format("%17s %s", "FloorName:2=", entities.get("floorName:2")));
                        }
                        if (entities.get("parkingLevel") != null) {
                            System.out.println(String.format("%17s %s", "ParkingLevel=", entities.get("parkingLevel")));
                        }
                        break;

                    case "DoorControl":
                        if (entities.get("action") != null) {
                            System.out.println(String.format("%17s %s", "Action=", entities.get("action")));
                        }
                        break;
                }
            }
            else if (result.getReason() == ResultReason.NoMatch) {
                System.out.println("NOMATCH: Speech could not be recognized.");
            }
            else if (result.getReason() == ResultReason.Canceled) {
                CancellationDetails cancellation = CancellationDetails.fromResult(result);
                System.out.println("CANCELED: Reason=" + cancellation.getReason());

                if (cancellation.getReason() == CancellationReason.Error)
                {
                    System.out.println("CANCELED: ErrorCode=" + cancellation.getErrorCode());
                    System.out.println("CANCELED: ErrorDetails=" + cancellation.getErrorDetails());
                    System.out.println("CANCELED: Did you update the subscription info?");
                }
            }
        }
    }
}
```

## Build and run your app

Now you're ready to build your app and test our intent recognition using the speech service and the embedded pattern matcher.

Select the run button in Eclipse or press ctrl+F11, then watch the output for the "Say something..." prompt. Once it appears speak your utterance and watch the output.


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
