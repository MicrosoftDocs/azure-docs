---
author: chschrae
manager: travisw
ms.service: azure-ai-speech
ms.date: 01/03/2022
ms.topic: include
ms.author: chschrae
---

[!INCLUDE [Create project](../../../quickstarts/platform/java.md)]

## Start with some boilerplate code

1. Open `Main.java` from the src dir.

1. Replace the contents of the file with following:

```java
package quickstart;
import java.util.Dictionary;
import java.util.concurrent.ExecutionException;

import com.microsoft.cognitiveservices.speech.*;
import com.microsoft.cognitiveservices.speech.intent.*;

public class Program {
    public static void main(String[] args) throws InterruptedException, ExecutionException {
        IntentPatternMatchingWithMicrophone();
    }

    public static void IntentPatternMatchingWithMicrophone() throws InterruptedException, ExecutionException {
        SpeechConfig config = SpeechConfig.fromSubscription("YOUR_SUBSCRIPTION_KEY", "YOUR_SUBSCRIPTION_REGION");
    }
}
```

## Create a Speech configuration

Before you can initialize an `IntentRecognizer` object, you need to create a configuration that uses the key and location for your Azure AI services prediction resource.

* Replace `"YOUR_SUBSCRIPTION_KEY"` with your Azure AI services prediction key.
* Replace `"YOUR_SUBSCRIPTION_REGION"` with your Azure AI services resource region.

This sample uses the `FromSubscription()` method to build the `SpeechConfig`. For a full list of available methods, see [SpeechConfig Class](/java/api/com.microsoft.cognitiveservices.speech.speechconfig).

## Initialize an IntentRecognizer

Now create an `IntentRecognizer`. Insert this code right below your Speech configuration.

```java
try (IntentRecognizer intentRecognizer = new IntentRecognizer(config)) {
    
}
```

## Add some intents

You need to associate some patterns with the `IntentRecognizer` by calling `addIntent()`.
We will add 2 intents with the same ID for changing floors, and another intent with a separate ID for opening and closing doors.
Insert this code inside the `try` block:

```java
intentRecognizer.addIntent("Take me to floor {floorName}.", "ChangeFloors");
intentRecognizer.addIntent("Go to floor {floorName}.", "ChangeFloors");
intentRecognizer.addIntent("{action} the door.", "OpenCloseDoor");
```

> [!NOTE]
> There is no limit to the number of entities you can declare, but they will be loosely matched. If you add a phrase like "{action} door" it will match any time there is text before the word "door". Intents are evaluated based on their number of entities. If two patterns would match, the one with more defined entities is returned.

## Recognize an intent

From the `IntentRecognizer` object, you're going to call the `recognizeOnceAsync()` method. This method asks the Speech service to recognize speech in a single phrase, and stop recognizing speech once the phrase is identified. For simplicity we'll wait on the future returned to complete.

Insert this code below your intents:

```java
System.out.println("Say something...");

IntentRecognitionResult result = intentRecognizer.recognizeOnceAsync().get();
```

## Display the recognition results (or errors)

When the recognition result is returned by the Speech service, we will print the result.

Insert this code below ` IntentRecognitionResult result = recognizer.recognizeOnceAsync().get();`:

```java
if (result.getReason() == ResultReason.RecognizedSpeech) {
    System.out.println("RECOGNIZED: Text= " + result.getText());
    System.out.println(String.format("%17s", "Intent not recognized."));
}
else if (result.getReason() == ResultReason.RecognizedIntent) {
    System.out.println("RECOGNIZED: Text= " + result.getText());
    System.out.println(String.format("%17s %s", "Intent Id=", result.getIntentId() + "."));
    Dictionary<String, String> entities = result.getEntities();

    if (entities.get("floorName") != null) {
        System.out.println(String.format("%17s %s", "FloorName=", entities.get("floorName")));
    }
    if (entities.get("action") != null) {
        System.out.println(String.format("%17s %s", "Action=", entities.get("action")));
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

        try (IntentRecognizer intentRecognizer = new IntentRecognizer(config)) {
            intentRecognizer.addIntent("Take me to floor {floorName}.", "ChangeFloors");
            intentRecognizer.addIntent("Go to floor {floorName}.", "ChangeFloors");
            intentRecognizer.addIntent("{action} the door.", "OpenCloseDoor");

            System.out.println("Say something...");

            IntentRecognitionResult result = intentRecognizer.recognizeOnceAsync().get();
            if (result.getReason() == ResultReason.RecognizedSpeech) {
            System.out.println("RECOGNIZED: Text= " + result.getText());
            System.out.println(String.format("%17s", "Intent not recognized."));
            }
            else if (result.getReason() == ResultReason.RecognizedIntent) {
                System.out.println("RECOGNIZED: Text= " + result.getText());
                System.out.println(String.format("%17s %s", "Intent Id=", result.getIntentId() + "."));
                Dictionary<String, String> entities = result.getEntities();

                if (entities.get("floorName") != null) {
                    System.out.println(String.format("%17s %s", "FloorName=", entities.get("floorName")));
                }
                if (entities.get("action") != null) {
                    System.out.println(String.format("%17s %s", "Action=", entities.get("action")));
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


For example if you say "Take me to floor 7", this should be the output:

```
Say something ...
RECOGNIZED: Text= Take me to floor 7.
  Intent Id= ChangeFloors
  FloorName= 7
```

## Next steps

> Improve your pattern matching by using [custom entities](../../../../how-to-use-custom-entity-pattern-matching.md).

