---
title: 'Quickstart: Recognize speech, Java (Windows, Linux) - Speech Services'
titleSuffix: Azure Cognitive Services
description: In this quickstart, you'll learn how to use the Cognitive Services Speech SDK in a Java console application. You will learn how you can connect your client application to a previously created Bot Framework bot configured to use the Direct Line Speech channel and enable a voice-first virtual assistant experience.
services: cognitive-services
author: bidishac
manager: elsien
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: quickstart
ms.date: 4/11/2019
ms.author: bidishac
---

# Quickstart: Use a voice-first virtual assistant from a java app with the Cognitive Services Speech SDK

In this article, you create a Java console application by using the [Cognitive Services Speech SDK](speech-sdk.md). The application will connect to a previously authored bot configured to use "Direct Line Speech" channel, send a voice request and return a voice response activity (if configured). The application is built with the Speech SDK Maven package, and the Eclipse Java IDE (v4.8) on 64-bit Windows, 64-bit Ubuntu Linux 16.04 / 18.04 or on macOS 10.13 or later. It runs on a 64-bit Java 8 runtime environment (JRE).

## Prerequisites

This quickstart requires:

* Operating System: Windows (64-bit), Ubuntu Linux 16.04/18.04 (64-bit), or macOS 10.13 or later
* [Eclipse Java IDE](https://www.eclipse.org/downloads/)
* [Java 8](https://www.oracle.com/technetwork/java/javase/downloads/jre8-downloads-2133155.html) or [JDK 8](https://www.oracle.com/technetwork/java/javase/downloads/index.html)
* An Azure subscription key for the Speech Service. [Get one for free](get-started.md).
* A pre-configured bot created using Bot Framework version 4.2 or above. The bot would need to subscribe to the new "Direct Line Speech" channel to receive voice inputs.

If you're running Ubuntu 16.04/18.04, make sure these dependencies are installed before starting Eclipse.

```console
sudo apt-get update
sudo apt-get install build-essential libssl1.0.0 libasound2 wget
```

If you're running Windows (64-bit) ensure you have installed Microsoft Visual C++ Redistributable for your platform.
* [Download Microsoft Visual C++ Redistributable for Visual Studio 2017](https://support.microsoft.com/help/2977003/the-latest-supported-visual-c-downloads)


## Create and configure project

[!INCLUDE [](../../../includes/cognitive-services-speech-service-quickstart-java-create-proj.md)]

1. Additionally, to enable logging, update the **pom.xml** file to include the following dependency. 

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

1. Open the newly created **Main** class. Import the following speech SDK packages.

 ```java
    import com.microsoft.cognitiveservices.speech.ResultReason;
    import com.microsoft.cognitiveservices.speech.audio.AudioConfig;
    import com.microsoft.cognitiveservices.speech.dialog.BotConnectorConfig;
    import com.microsoft.cognitiveservices.speech.dialog.SpeechBotConnector;
    import java.io.*;
    import java.util.HashMap;

    import org.slf4j.Logger; //Optional for logging only
    import org.slf4j.LoggerFactory; //Optional for logging only
```

1. In the **main** method, you will first configure your `BotConnectorConfig`.

   ```java
    final String botSecret = "YourBotSecret"; // Your bot channel secret
    final String subscriptionKey = "YourSubscriptionKey"; // your subscription key
    final String region = "YourServiceRegion"; // Your service region. Currently assumed to be westus2
    final BotConnectorConfig botConnectorConfig = BotConnectorConfig.fromBotConnectionId(botSecret, subscriptionKey, region);
    if (botConnectorConfig == null) {
        log.error("BotConnectorConfig should not be null");
    }
    ```

1. Replace the string `YourSubscriptionKey` with your subscription key which you can get from [here](get-started.md).

1. Replace the string `YourServiceRegion` with the [region](regions.md) associated with your subscription (Currently we are only supporting 'westus2').

1. Replace the string `YourBotSecret` with your direct line speech channel secret.

1. Enable the audio input by configuring the AudioConfig. In the quick start we use the default microphone input for audio input.

    ```java
     final AudioConfig audioConfig = AudioConfig.fromDefaultMicrophoneInput();
    ```

1. Create a `SpeechBotConnector` instance
    ```java
    final SpeechBotConnector botConnector = new SpeechBotConnector(botConnectorConfig, audioConfig);
    ```

1. `SpeechBotConnector` relies on several events to communicate its results and other information. Add these event listeners next.

    ```java
    // Recognizing will provide the intermediate recognized text while an audio stream is being processed
    botConnector.recognizing.addEventListener((o, speechRecognitionResultEventArgs) -> {
        log.info("Recognising speech event text: {}", speechRecognitionResultEventArgs.getResult().getText());
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

    // TODO: Update once the TTS changes are ready
    // Synthesizing will provide the audio associated with the an activity that contains the "speak"
    final AudioPlayer audioPlayer = new AudioPlayer();
    final HashMap<String, PipedOutputStream> audioMap = new HashMap<>();
    botConnector.synthesizing.addEventListener((o, synthesisEventArgs) -> {
        final String requestId = synthesisEventArgs.getResult().getRequestId();
        final byte[] audio = synthesisEventArgs.getResult().getAudio();
        final ResultReason reason = synthesisEventArgs.getResult().getReason();

        log.info("Synthesizing event id: {}, reason: {}", requestId, reason);

        try {
            if (!audioMap.containsKey(requestId)) {
                audioMap.put(requestId, new PipedOutputStream());
            }

            final PipedOutputStream pos = audioMap.get(requestId);
            // Start playback
            if (!audioPlayer.isPlaying()) {
                audioPlayer.play(pos);
            }
            // Write audio bits to PipedOutputStream
            if (audio.length > 0) {
                pos.write(audio);
            }
            // When audio synthesis is completed, close the player and close the PipedOutputStream stream
            if (reason == ResultReason.SynthesizingAudioCompleted && audioPlayer.isPlaying()) {
                audioPlayer.stopPlaying();
                pos.close();
            }
        } catch (IOException e) {
            log.error("IOException thrown when writing to PipedOutputStream {}", e.getMessage(), e);
        }
    });

    ```

1. Connect to the `SpeechBotConnector` and invoke the `listenOnceAsync` API .

    ```java
    botConnector.connectAsync();
    // Start listening.
    System.out.println("Say something ...");
    botConnector.listenOnceAsync();
    ```
1. Save changes to the `Main` file.

1. Additionally for supporting playback, we will add a new class which can handle audio playback. To add another new empty class to your Java project, select **File** > **New** > **Class**.

1. In the **New Java Class** window, enter **speechsdk.quickstart** into the **Package** field, and **AudioPlayer** into the **Name** field.

   ![Screenshot of New Java Class window](media/sdk/qs-java-jre-06-create-main-java.png)

1. Open the newly created **AudioPlayer** class and add the following code.

    ```java
    //The current audio supported by the Botframework ~ 16-bit PCM encoding, 16KHz sampling rate.
    public static final int SAMPLE_RATE = 16000;
    public static final int SAMPLE_SIZE_IN_BITS = 16;
    public static final int CHANNELS = 1; // Mono / Single channel
    public static final int FRAME_RATE = 16000;
    public static final int FRAME_SIZE = 2;

    private static final Logger log = LoggerFactory.getLogger(AudioPlayer.class); // optional
    private AtomicBoolean isPlaying = new AtomicBoolean(false);

    /**
     * Method checks if is there is an active track playing on this audio player.
     */
    public boolean isPlaying() {
        return isPlaying.get();
    }

    /**
     * Stops the player state once playback in completed
     */
    public void stopPlaying() {
        isPlaying.set(false);
    }

    public void play(final PipedOutputStream pipedOutputStream) {
        final AudioFormat defaultFormat = new AudioFormat(PCM_SIGNED, SAMPLE_RATE, SAMPLE_SIZE_IN_BITS, CHANNELS, FRAME_SIZE, FRAME_RATE, false);
        try {
            final PipedInputStream inputStream = new PipedInputStream(pipedOutputStream);

            new Thread(() -> {
                try {
                    isPlaying.set(true);
                    playStream(inputStream, defaultFormat);
                    inputStream.close();
                } catch (Exception e) {
                    log.error("Exception thrown during playback {}", e.getMessage(), e);
                }
            }).start();
        } catch (IOException e) {
            log.error("IOException thrown during creating PipedInputStream {}", e.getMessage(), e);
        }
    }

    private void playStream(final InputStream inputStream, final AudioFormat targetFormat) throws Exception {
        final byte[] data = new byte[8];
        final SourceDataLine line = getLine(targetFormat);
        if (line != null) {
            line.start();
            int nBytesRead = 0;
            while (nBytesRead != -1) {
                nBytesRead = inputStream.read(data, 0, data.length);
                if (nBytesRead != -1) {
                    line.write(data, 0, nBytesRead);
                }
            }
            line.drain();
            line.stop();
            line.close();
        }
    }

    private SourceDataLine getLine(final AudioFormat audioFormat) throws LineUnavailableException {
        final DataLine.Info info = new DataLine.Info(SourceDataLine.class, audioFormat);
        final SourceDataLine res = (SourceDataLine) AudioSystem.getLine(info);
        res.open(audioFormat);
        return res;
    }
    ```

1. Save changes to the `AudioPlayer` file.

## Build and run the app

Press F11, or select **Run** > **Debug**.
The console will display a message "Say something"
At this point you can speak an English phrase or sentence which your bot will understand into your microphone. Your speech will be transmitted to your bot through the Direct Line Speech channel where it will be recognized, processed by your bot and the response will be returned as an activity. If your bot returns speech as response, the audio will be played back using the `AudioPlayer` class.


![Screenshot of console output after successful recognition](media/sdk/qs-java-jre-07-console-output.png)

## Next steps

Additional samples, such as how to read speech from an audio file, are available on GitHub.

> [!div class="nextstepaction"]
> [Explore Java samples on GitHub](https://aka.ms/csspeech/samples)
## See also

- [Quickstart: Translate speech, Java (Windows, Linux)](quickstart-translate-speech-java-jre.md)
- [Customize acoustic models](how-to-customize-acoustic-models.md)
- [Customize language models](how-to-customize-language-model.md)