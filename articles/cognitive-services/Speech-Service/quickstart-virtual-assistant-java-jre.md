---
title: 'Quickstart: Custom voice-first virtual assistant (Preview), Java (Windows, Linux) - Speech Services'
titleSuffix: Azure Cognitive Services
description: In this quickstart, you'll learn how to use the Cognitive Services Speech Software Development Kit (SDK) in a Java console application. You will learn how you can connect your client application to a previously created Bot Framework bot configured to use the Direct Line Speech channel and enable a voice-first virtual assistant experience.
services: cognitive-services
author: bidishac
manager: 
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: quickstart
ms.date: 05/02/2019
ms.author: bidishac
---

# Quickstart: Use a voice-first virtual assistant from a Java app with the Cognitive Services Speech SDK

In this article, you create a Java console application by using the [Cognitive Services Speech SDK](speech-sdk.md). The application will connect to a previously authored bot configured to use "Direct Line Speech" channel, send a voice request and return a voice response activity (if configured). The application is built with the Speech SDK Maven package, and the Eclipse Java IDE (v4.8) on 64-bit Windows, 64-bit Ubuntu Linux 16.04 / 18.04 or on macOS 10.13 or later. It runs on a 64-bit Java 8 runtime environment (JRE).

## Prerequisites

This quickstart requires:

* Operating System: Windows (64-bit), Ubuntu Linux 16.04/18.04 (64-bit), or macOS 10.13 or later
* [Eclipse Java IDE](https://www.eclipse.org/downloads/)
* [Java 8](https://www.oracle.com/technetwork/java/javase/downloads/jre8-downloads-2133155.html) or [JDK 8](https://www.oracle.com/technetwork/java/javase/downloads/index.html)
* An Azure subscription key for the Speech Service. [Get one for free](get-started.md).
* A pre-configured bot created using Bot Framework version 4.2 or above. The bot would need to subscribe to the new "Direct Line Speech" channel to receive voice inputs.

    > [!NOTE]
    > In preview, the Direct Line Speech channel currently supports only the **westus2** region. Further region support will be added in the future.

    > [!NOTE]
    > The 30-day trial for the standard pricing tier described in [Try Speech Services for free](get-started.md) is restricted to **westus** (not **westus2**) and is thus not compatible with Direct Line Speech. Free and standard tier **westus2** subscriptions are compatible.

If you're running Ubuntu 16.04/18.04, make sure these dependencies are installed before starting Eclipse.

```console
sudo apt-get update
sudo apt-get install build-essential libssl1.0.0 libasound2 wget
```

If you're running Windows (64-bit), ensure you have installed the Microsoft Visual C++ Redistributable for your platform.
* [Download Microsoft Visual C++ Redistributable for Visual Studio 2017](https://support.microsoft.com/help/2977003/the-latest-supported-visual-c-downloads)

## Optional: Get started fast

This quickstart will describe, step by step, how to make a simple client application to connect to your speech-enabled bot. If you prefer to dive right in, the complete, ready-to-compile source code used in this quickstart is available in the [Speech SDK Samples](https://aka.ms/csspeech/samples) under the `quickstart` folder.

## Create and configure project

[!INCLUDE [](../../../includes/cognitive-services-speech-service-quickstart-java-create-proj.md)]

Additionally, to enable logging, update the **pom.xml** file to include the following dependency.

   ```xml
    <dependency>
        <groupId>org.slf4j</groupId>
        <artifactId>slf4j-simple</artifactId>
        <version>1.7.5</version>
    </dependency>
   ```

## Add sample code

1. To add a new empty class to your Java project, select **File** > **New** > **Class**.

1. In the **New Java Class** window, enter **speechsdk.quickstart** into the **Package** field, and **Main** into the **Name** field.

   ![Screenshot of New Java Class window](media/sdk/qs-java-jre-06-create-main-java.png)

1. Open the newly created **Main** class and replace the contents of the `Main.java` file with the following starting code.

    ```java
    package speechsdk.quickstart;

    import java.io.IOException;
    import java.io.PipedOutputStream;
    import java.util.HashMap;

    import org.slf4j.Logger;
    import org.slf4j.LoggerFactory;

    import com.microsoft.cognitiveservices.speech.ResultReason;
    import com.microsoft.cognitiveservices.speech.audio.AudioConfig;
    import com.microsoft.cognitiveservices.speech.dialog.BotConnectorConfig;
    import com.microsoft.cognitiveservices.speech.dialog.SpeechBotConnector;

    public class Main {
        final Logger log = LoggerFactory.getLogger(Main.class);

        public static void main(String[] args) {
            // New code will go here
        }
    }
    ```

1. In the **main** method, you will first configure your `BotConnectorConfig` and use it to create a `SpeechBotConnector` instance. This will connect to the Direct line speech channel to interact with your bot. An `AudioConfig` instance is also used to specify the source for audio input. In this example, the default microphone is used with `AudioConfig.fromDefaultMicrophoneInput()`.

    * Replace the string `YourSubscriptionKey` with your subscription key, which you can get from [here](get-started.md).
    * Replace the string `YourServiceRegion` with the [region](regions.md) associated with your subscription.
    * Replace the string `YourChannelSecret` with your direct line speech channel secret.

    > [!NOTE]
    > In preview, the Direct Line Speech channel currently supports only the **westus2** region. Further region support will be added in the future.

    > [!NOTE]
    > The 30-day trial for the standard pricing tier described in [Try Speech Services for free](get-started.md) is restricted to **westus** (not **westus2**) and is thus not compatible with Direct Line Speech. Free and standard tier **westus2** subscriptions are compatible.

   ```java
    final String channelSecret = "YourChannelSecret"; // Your channel secret
    final String subscriptionKey = "YourSubscriptionKey"; // your subscription key
    final String region = "YourServiceRegion"; // Your service region. Currently assumed to be westus2
    final BotConnectorConfig botConnectorConfig = BotConnectorConfig.fromSecretKey(channelSecret, subscriptionKey, region);

    // Configure audio input from microphone.
    final AudioConfig audioConfig = AudioConfig.fromDefaultMicrophoneInput();

    // Create a SpeechjBotConnector instance
    final SpeechBotConnector botConnector = new SpeechBotConnector(botConnectorConfig, audioConfig);
    ```

1. `SpeechBotConnector` relies on several events to communicate its results and other information. Add these event listeners next.

    ```java
    // Recognizing will provide the intermediate recognized text while an audio stream is being processed
    botConnector.recognizing.addEventListener((o, speechRecognitionResultEventArgs) -> {
        log.info("Recognizing speech event text: {}", speechRecognitionResultEventArgs.getResult().getText());
    });

    // Recognized will provide the final recognized text once audio capture is completed
    botConnector.recognized.addEventListener((o, speechRecognitionResultEventArgs) -> {
        log.info("Recognized speech event reason text: {}", speechRecognitionResultEventArgs.getResult().getText());
    });

    // SessionStarted will notify when audio begins flowing to the service for a turn
    botConnector.sessionStarted.addEventListener((o, sessionEventArgs) -> {
        log.info("Session Started event id: {} ", sessionEventArgs.getSessionId());
    });

    // SessionStopped will notify when a turn is complete and it's safe to begin listening again
    botConnector.sessionStopped.addEventListener((o, sessionEventArgs) -> {
        log.info("Session stopped event id: {}", sessionEventArgs.getSessionId());
    });

    // Canceled will be signaled when a turn is aborted or experiences an error condition
    botConnector.canceled.addEventListener((o, canceledEventArgs) -> {
        log.info("Canceled event details: {}", canceledEventArgs.getErrorDetails());
        botConnector.disconnectAsync();
    });

    // ActivityReceived is the main way your bot will communicate with the client and uses bot framework activities
    botConnector.activityReceived.addEventListener((o, activityEventArgs) -> {
        String act = activityEventArgs.getActivity().serialize();
        log.info("Received activity: {}", act);
    });
    ```

1. Connect to the `SpeechBotConnector` invoking the `connectAsync()` API. To test your bot, you can invoke the `listenOnceAsync` API to send direct speech from your microphone. Additionally, you can also use the `sendActivityAsync` API to send an activity as a serialized string.

    ```java
    botConnector.connectAsync();
    // Start listening.
    System.out.println("Say something ...");
    botConnector.listenOnceAsync();

    // botConnector.sendActivityAsync(...)
    ```

1. Save changes to the `Main` file.

1. For supporting response playback, you will add an additional class that will include utility methods to support audio. To enable audio, add another new empty class to your Java project, select **File** > **New** > **Class**.

1. In the **New Java Class** window, enter **speechsdk.quickstart** into the **Package** field, and **AudioPlayer** into the **Name** field.

   ![Screenshot of New Java Class window](media/sdk/qs-java-jre-06-create-main-java.png)

1. Open the newly created **AudioPlayer** class and replace with code provided below.

    ```java
    import static javax.sound.sampled.AudioFormat.Encoding.PCM_SIGNED;

    import java.io.InputStream;
    import java.io.PipedInputStream;
    import java.io.PipedOutputStream;
    import java.util.concurrent.ExecutorService;
    import java.util.concurrent.Executors;
    import java.util.concurrent.atomic.AtomicBoolean;

    import javax.sound.sampled.AudioFormat;
    import javax.sound.sampled.AudioSystem;
    import javax.sound.sampled.DataLine;
    import javax.sound.sampled.SourceDataLine;

    import org.slf4j.Logger;
    import org.slf4j.LoggerFactory;


    public class AudioPlayer {

        public static final int SAMPLE_RATE = 16000; // 16Hz sampling rate
        public static final int SAMPLE_SIZE_IN_BITS = 16; // 16 bit PCM
        public static final int CHANNELS = 1; // Use Mono / Single channel

        public static final int FRAME_RATE = 16000;
        public static final int FRAME_SIZE = 2;

        private static final Logger log = LoggerFactory.getLogger(AudioPlayer.class);
        private AtomicBoolean isPlaying = new AtomicBoolean(false);
        private ExecutorService executorService = Executors.newSingleThreadExecutor();

        public boolean isPlaying() {
            return isPlaying.get();
        }

        public void stopPlaying() {
            isPlaying.set(false);
        }

        public void play(final PipedOutputStream pipedOutputStream) {
            // The current audio supported by the Microsoft Bot framework ~ 16-bit PCM encoding, 16KHz sampling rate.
            final AudioFormat defaultFormat = new AudioFormat(PCM_SIGNED, SAMPLE_RATE, SAMPLE_SIZE_IN_BITS, CHANNELS, FRAME_SIZE, FRAME_RATE, false);
            try {
                final PipedInputStream inputStream = new PipedInputStream(pipedOutputStream);

                executorService.submit(() -> {
                    try {
                        isPlaying.set(true);
                        play(inputStream, defaultFormat);
                        inputStream.close();
                    } catch (Exception e) {
                        log.error("Exception thrown during playback. Message: {}", e.getMessage(), e);
                    }
                });
            } catch (Exception e) {
                log.error("Exception thrown during playback. Message: {}", e.getMessage(), e);
            }
        }

        private void play(final InputStream inputStream, final AudioFormat targetFormat) throws Exception {
            final byte[] buffer = new byte[1024];
            final DataLine.Info info = new DataLine.Info(SourceDataLine.class, targetFormat);
            final SourceDataLine line = (SourceDataLine) AudioSystem.getLine(info);
            line.open();
            if (line != null) {
                line.start();
                int bytesRead = 0;
                while (bytesRead != -1) {
                    bytesRead = inputStream.read(buffer, 0, buffer.length);
                    if (bytesRead != -1) {
                        line.write(buffer, 0, bytesRead);
                    }
                }
                line.drain();
                line.stop();
                line.close();
            }
        }
    }
    ```

1. Save changes to the `AudioPlayer` file.

## Build and run the app

Press F11, or select **Run** > **Debug**.
The console will display a message "Say something"
At this point, you may speak an English phrase or sentence that your bot will understand. Your speech will be transmitted to your bot through the Direct Line Speech channel where it will be recognized, processed by your bot and the response will be returned as an activity. If your bot returns speech as response, the audio will be played back using the `AudioPlayer` class.


![Screenshot of console output after successful recognition](media/sdk/qs-java-jre-07-console-output.png)

## Next steps

Additional samples, such as how to read speech from an audio file, are available on GitHub.

> [!div class="nextstepaction"]
> [Explore Java samples on GitHub](https://aka.ms/csspeech/samples)
## See also

- [Quickstart: Translate speech, Java (Windows, Linux)](quickstart-translate-speech-java-jre.md)
- [Customize acoustic models](how-to-customize-acoustic-models.md)
- [Customize language models](how-to-customize-language-model.md)