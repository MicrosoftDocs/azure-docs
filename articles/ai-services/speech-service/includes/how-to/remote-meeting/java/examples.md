---
author: eric-urban
ms.service: azure-ai-speech
ms.topic: include
ms.date: 04/25/2022
ms.author: eur
---

## Upload the audio

Before asynchronous transcription can be performed, you need to send the audio to Meeting Transcription Service using the Speech SDK.

This example code shows how to create meeting transcriber for asynchronous-only mode. In order to stream audio to the transcriber, you will need to add audio streaming code derived from [Transcribe meetings in real-time with the Speech SDK](../../../../how-to-use-meeting-transcription.md). Refer to the **Limitations** section of that topic to see the supported platforms and languages APIs.

```java
// Create the speech config object
// Substitute real information for "YourSubscriptionKey" and "Region"
SpeechConfig speechConfig = SpeechConfig.fromSubscription("YourSubscriptionKey", "Region");
speechConfig.setProperty("ConversationTranscriptionInRoomAndOnline", "true");

// Set the property for asynchronous transcription
speechConfig.setServiceProperty("transcriptionMode", "async", ServicePropertyChannel.UriQueryParameter);

// Set the property for real-time plus asynchronous transcription
//speechConfig.setServiceProperty("transcriptionMode", "RealTimeAndAsync", ServicePropertyChannel.UriQueryParameter);

// pick a meeting Id that is a GUID.
String meetingId = UUID.randomUUID().toString();

// Create a Meeting
Future<Meeting> meetingFuture = Meeting.createMeetingAsync(speechConfig, meetingId);
Meeting meeting = meetingFuture.get();

// Create an audio stream from a wav file or from the default microphone if you want to stream live audio from the supported devices
// Replace with your own audio file name and Helper class which implements AudioConfig using PullAudioInputStreamCallback
PullAudioInputStreamCallback wavfilePullStreamCallback = Helper.OpenWavFile("16kHz16Bits8channelsOfRecordedPCMAudio.wav");
// Create an audio stream format assuming the file used above is 16kHz, 16 bits and 8 channel pcm wav file
AudioStreamFormat audioStreamFormat = AudioStreamFormat.getWaveFormatPCM((long)16000, (short)16,(short)8);
// Create an input stream
AudioInputStream audioStream = AudioInputStream.createPullStream(wavfilePullStreamCallback, audioStreamFormat);

// Create a meeting transcriber
MeetingTranscriber transcriber = new MeetingTranscriber(AudioConfig.fromStreamInput(audioStream));

// join a meeting
transcriber.joinMeetingAsync(meeting);

// Add the event listener for the real-time events
transcriber.transcribed.addEventListener((o, e) -> {
    System.out.println("Meeting transcriber Recognized:" + e.toString());
});

transcriber.canceled.addEventListener((o, e) -> {
    System.out.println("Meeting transcriber canceled:" + e.toString());
    try {
        transcriber.stopTranscribingAsync().get();
    } catch (InterruptedException ex) {
        ex.printStackTrace();
    } catch (ExecutionException ex) {
        ex.printStackTrace();
    }
});

transcriber.sessionStopped.addEventListener((o, e) -> {
    System.out.println("Meeting transcriber stopped:" + e.toString());

    try {
        transcriber.stopTranscribingAsync().get();
    } catch (InterruptedException ex) {
        ex.printStackTrace();
    } catch (ExecutionException ex) {
        ex.printStackTrace();
    }
});

// start the transcription.
Future<?> future = transcriber.startTranscribingAsync();
...
```

If you want real-time _plus_ asynchronous, comment and uncomment the appropriate lines of code as follows:

```java
// Set the property for asynchronous transcription
//speechConfig.setServiceProperty("transcriptionMode", "async", ServicePropertyChannel.UriQueryParameter);

// Set the property for real-time plus asynchronous transcription
speechConfig.setServiceProperty("transcriptionMode", "RealTimeAndAsync", ServicePropertyChannel.UriQueryParameter);
```

## Get transcription results

For the code shown here, you need **remote-meeting version 1.8.0**, supported only for Java (1.8.0 or above) on Windows, and Linux. 

### Obtaining the async meeting client SDK

You can obtain **remote-meeting** by editing your pom.xml file as follows.

1. At the end of the file, before the closing tag `</project>`, create a `repositories` element with a reference to the Maven repository for the Speech SDK:

   ```xml
   <repositories>
     <repository>
       <id>maven-cognitiveservices-speech</id>
       <name>Microsoft Cognitive Services Speech Maven Repository</name>
       <url>https://azureai.azureedge.net/maven/</url>
     </repository>
   </repositories>
   ```

2. Also add a `dependencies` element, with the remotemeeting-client-sdk 1.8.0 as a dependency:

   ```xml
   <dependencies>
     <dependency>
       <groupId>com.microsoft.cognitiveservices.speech.remotemeeting</groupId>
       <artifactId>remote-meeting</artifactId>
       <version>1.8.0</version>
     </dependency>
   </dependencies>
   ```

3. Save the changes

### Sample transcription code

After you have the `meetingId`, create a remote meeting transcription client **RemoteMeetingTranscriptionClient** at the client application to query the status of the asynchronous transcription. Use **GetTranscriptionOperation** method in **RemoteMeetingTranscriptionClient** to get a [PollerFlux](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/core/azure-core/src/main/java/com/azure/core/util/polling/PollerFlux.java) object. The PollerFlux object will have information about the remote operation status **RemoteMeetingTranscriptionOperation** and the final result **RemoteMeetingTranscriptionResult**. Once the operation has finished, get **RemoteMeetingTranscriptionResult** by calling **getFinalResult** on a [SyncPoller](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/core/azure-core/src/main/java/com/azure/core/util/polling/SyncPoller.java). In this code we simply print the result contents to system output.

```java
// Create the speech config object
SpeechConfig speechConfig = SpeechConfig.fromSubscription("YourSubscriptionKey", "Region");

// Create a remote Meeting Transcription client
RemoteMeetingTranscriptionClient client = new RemoteMeetingTranscriptionClient(speechConfig);

// Get the PollerFlux for the remote operation
PollerFlux<RemoteMeetingTranscriptionOperation, RemoteMeetingTranscriptionResult> remoteTranscriptionOperation = client.GetTranscriptionOperation(meetingId);

// Subscribe to PollerFlux to get the remote operation status
remoteTranscriptionOperation.subscribe(
        pollResponse -> {
            System.out.println("Poll response status : " + pollResponse.getStatus());
            System.out.println("Poll response status : " + pollResponse.getValue().getServiceStatus());
        }
);

// Obtain the blocking operation using getSyncPoller
SyncPoller<RemoteMeetingTranscriptionOperation, RemoteMeetingTranscriptionResult> blockingOperation =  remoteTranscriptionOperation.getSyncPoller();

// Wait for the operation to finish
blockingOperation.waitForCompletion();

// Get the final result response
RemoteMeetingTranscriptionResult resultResponse = blockingOperation.getFinalResult();

// Print the result
if(resultResponse != null) {
    if(resultResponse.getMeetingTranscriptionResults() != null) {
        for (int i = 0; i < resultResponse.getMeetingTranscriptionResults().size(); i++) {
            MeetingTranscriptionResult result = resultResponse.getMeetingTranscriptionResults().get(i);
            System.out.println(result.getProperties().getProperty(PropertyId.SpeechServiceResponse_JsonResult.name()));
            System.out.println(result.getProperties().getProperty(PropertyId.SpeechServiceResponse_JsonResult));
            System.out.println(result.getOffset());
            System.out.println(result.getDuration());
            System.out.println(result.getUserId());
            System.out.println(result.getReason());
            System.out.println(result.getResultId());
            System.out.println(result.getText());
            System.out.println(result.toString());
        }
    }
}

System.out.println("Operation finished");
```
