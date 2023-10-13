---
author: eric-urban
ms.service: azure-ai-speech
ms.topic: include
ms.date: 7/27/2023
ms.author: eur
---

[!INCLUDE [Header](../../common/java.md)]

[!INCLUDE [Introduction](intro.md)]

## Prerequisites

[!INCLUDE [Prerequisites](../../common/azure-prerequisites.md)]

## Set up the environment

Before you can do anything, you need to install the Speech SDK. The sample in this quickstart works with the [Java Runtime](~/articles/cognitive-services/speech-service/quickstarts/setup-platform.md?pivots=programming-language-java&tabs=jre).

1. Install [Apache Maven](https://maven.apache.org/install.html). Then run `mvn -v` to confirm successful installation.
1. Create a new `pom.xml` file in the root of your project, and copy the following into it:
    ```xml
    <project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
        <modelVersion>4.0.0</modelVersion>
        <groupId>com.microsoft.cognitiveservices.speech.samples</groupId>
        <artifactId>quickstart-eclipse</artifactId>
        <version>1.0.0-SNAPSHOT</version>
        <build>
            <sourceDirectory>src</sourceDirectory>
            <plugins>
            <plugin>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.7.0</version>
                <configuration>
                <source>1.8</source>
                <target>1.8</target>
                </configuration>
            </plugin>
            </plugins>
        </build>
        <dependencies>
            <dependency>
            <groupId>com.microsoft.cognitiveservices.speech</groupId>
            <artifactId>client-sdk</artifactId>
            <version>1.32.1</version>
            </dependency>
        </dependencies>
    </project>
    ```
1. Install the Speech SDK and dependencies.
    ```console
    mvn clean dependency:copy-dependencies
    ```

### Set environment variables

[!INCLUDE [Environment variables](../../common/environment-variables.md)]

## Diarization from file with conversation transcription

Follow these steps to create a new console application for conversation transcription.

1. Create a new file named `ConversationTranscription.java` in the same project root directory.
1. Copy the following code into `ConversationTranscription.java`:

    ```java
    import com.microsoft.cognitiveservices.speech.*;
    import com.microsoft.cognitiveservices.speech.audio.AudioConfig;
    import com.microsoft.cognitiveservices.speech.transcription.*;
    
    import java.util.concurrent.Semaphore;
    import java.util.concurrent.ExecutionException;
    import java.util.concurrent.Future;
    
    public class ConversationTranscription {
        // This example requires environment variables named "SPEECH_KEY" and "SPEECH_REGION"
        private static String speechKey = System.getenv("SPEECH_KEY");
        private static String speechRegion = System.getenv("SPEECH_REGION");
    
        public static void main(String[] args) throws InterruptedException, ExecutionException {
            
            SpeechConfig speechConfig = SpeechConfig.fromSubscription(speechKey, speechRegion);
            speechConfig.setSpeechRecognitionLanguage("en-US");
            AudioConfig audioInput = AudioConfig.fromWavFileInput("katiesteve.wav");
            
            Semaphore stopRecognitionSemaphore = new Semaphore(0);
    
            ConversationTranscriber conversationTranscriber = new ConversationTranscriber(speechConfig, audioInput);
            {
                // Subscribes to events.
                conversationTranscriber.transcribing.addEventListener((s, e) -> {
                    System.out.println("TRANSCRIBING: Text=" + e.getResult().getText());
                });
    
                conversationTranscriber.transcribed.addEventListener((s, e) -> {
                    if (e.getResult().getReason() == ResultReason.RecognizedSpeech) {
                        System.out.println("TRANSCRIBED: Text=" + e.getResult().getText() + " Speaker ID=" + e.getResult().getSpeakerId() );
                    }
                    else if (e.getResult().getReason() == ResultReason.NoMatch) {
                        System.out.println("NOMATCH: Speech could not be transcribed.");
                    }
                });
    
                conversationTranscriber.canceled.addEventListener((s, e) -> {
                    System.out.println("CANCELED: Reason=" + e.getReason());
    
                    if (e.getReason() == CancellationReason.Error) {
                        System.out.println("CANCELED: ErrorCode=" + e.getErrorCode());
                        System.out.println("CANCELED: ErrorDetails=" + e.getErrorDetails());
                        System.out.println("CANCELED: Did you update the subscription info?");
                    }
    
                    stopRecognitionSemaphore.release();
                });
    
                conversationTranscriber.sessionStarted.addEventListener((s, e) -> {
                    System.out.println("\n    Session started event.");
                });
    
                conversationTranscriber.sessionStopped.addEventListener((s, e) -> {
                    System.out.println("\n    Session stopped event.");
                });
    
                conversationTranscriber.startTranscribingAsync().get();
    
                // Waits for completion.
                stopRecognitionSemaphore.acquire();
    
                conversationTranscriber.stopTranscribingAsync().get();
            }
    
            speechConfig.close();
            audioInput.close();
            conversationTranscriber.close();
    
            System.exit(0);
        }
    }
    ```

1. Replace `katiesteve.wav` with the filepath and filename of your `.wav` file. The intent of this quickstart is to recognize speech from multiple participants in the conversation. Your audio file should contain multiple speakers. For example, you can use the [sample audio file](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/sampledata/audiofiles/katiesteve.wav) provided in the Speech SDK samples repository on GitHub.
    > [!NOTE]
    > The service performs best with at least 7 seconds of continuous audio from a single speaker. This allows the system to differentiate the speakers properly. Otherwise the Speaker ID is returned as `Unknown`.
1. To change the speech recognition language, replace `en-US` with another [supported language](~/articles/cognitive-services/speech-service/supported-languages.md). For example, `es-ES` for Spanish (Spain). The default language is `en-US` if you don't specify a language. For details about how to identify one of multiple languages that might be spoken, see [language identification](~/articles/cognitive-services/speech-service/language-identification.md). 

Run your new console application to start conversation transcription:

```console
javac ConversationTranscription.java -cp ".;target\dependency\*"
java -cp ".;target\dependency\*" ConversationTranscription
```

> [!IMPORTANT]
> Make sure that you set the `SPEECH_KEY` and `SPEECH_REGION` environment variables as described [above](#set-environment-variables). If you don't set these variables, the sample will fail with an error message.

The transcribed conversation should be output as text: 

```console 
TRANSCRIBED: Text=Good morning, Steve. Speaker ID=Unknown
TRANSCRIBED: Text=Good morning. Katie. Speaker ID=Unknown
TRANSCRIBED: Text=Have you tried the latest real time diarization in Microsoft Speech Service which can tell you who said what in real time? Speaker ID=Guest-1
TRANSCRIBED: Text=Not yet. I've been using the batch transcription with diarization functionality, but it produces diarization result until whole audio get processed. Speaker ID=Guest-2
TRANSRIBED: Text=Is the new feature can diarize in real time? Speaker ID=Guest-2
TRANSCRIBED: Text=Absolutely. Speaker ID=GUEST-1
TRANSCRIBED: Text=That's exciting. Let me try it right now. Speaker ID=GUEST-2
CANCELED: Reason=EndOfStream
```

Speakers are identified as Guest-1, Guest-2, and so on, depending on the number of speakers in the conversation.

## Clean up resources

[!INCLUDE [Delete resource](../../common/delete-resource.md)]

