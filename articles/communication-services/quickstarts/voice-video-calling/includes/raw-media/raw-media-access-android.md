---
title: Quickstart - Add raw media access to your app (Android)
titleSuffix: An Azure Communication Services quickstart
description: In this quickstart, you learn how to add raw media access calling capabilities to your app by using Azure Communication Services.
author: yassirbisteni

ms.author: yassirb
ms.date: 06/09/2022
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: calling
ms.custom: mode-other
---

In this quickstart, you learn how to implement raw media access by using the Azure Communication Services Calling SDK for Android.

The Azure Communication Services Calling SDK offers APIs that allow apps to generate their own video frames to send to remote participants in a call.

This quickstart builds on [Quickstart: Add 1:1 video calling to your app](../../get-started-with-video-calling.md?pivots=platform-android) for Android.

## RawAudio access 
Accessing raw audio media gives you access to the incoming audio stream of the call, along with the ability to view and send custom outgoing audio streams during a call.

### Send Raw Outgoing audio

Make an options object specifying the raw stream properties we want to send. 

```java
    RawOutgoingAudioStreamProperties outgoingAudioProperties = new RawOutgoingAudioStreamProperties()
                .setAudioFormat(AudioStreamFormat.PCM16_BIT)
                .setSampleRate(AudioStreamSampleRate.HZ44100)
                .setChannelMode(AudioStreamChannelMode.STEREO)
                .setBufferDuration(AudioStreamBufferDuration.IN_MS20);

    RawOutgoingAudioStreamOptions outgoingAudioStreamOptions = new RawOutgoingAudioStreamOptions()
                .setProperties(outgoingAudioProperties);
```

Create a `RawOutgoingAudioStream` and attach it to join call options and the stream automatically starts when call is connected.

```java 
    JoinCallOptions options = JoinCallOptions() // or StartCallOptions()

    OutgoingAudioOptions outgoingAudioOptions = new OutgoingAudioOptions();
    RawOutgoingAudioStream rawOutgoingAudioStream = new RawOutgoingAudioStream(outgoingAudioStreamOptions);

    outgoingAudioOptions.setStream(rawOutgoingAudioStream);
    options.setOutgoingAudioOptions(outgoingAudioOptions);

    // Start or Join call with those call options.

```

### Attach stream to a call

Or you can also attach the stream to an existing `Call` instance instead:

```java
    CompletableFuture<Void> result = call.startAudio(context, rawOutgoingAudioStream);
```

### Start sending raw samples

We can only start sending data once the stream state is `AudioStreamState.STARTED`. 
To observe the audio stream state change, add a listener to the `OnStateChangedListener` event.

```java
    private void onStateChanged(PropertyChangedEvent propertyChangedEvent) {
        // When value is `AudioStreamState.STARTED` we'll be able to send audio samples.
    }

    rawOutgoingAudioStream.addOnStateChangedListener(this::onStateChanged)
```

When the stream started, we can start sending [`java.nio.ByteBuffer`](https://docs.oracle.com/javase/7/docs/api/java/nio/ByteBuffer.html) audio samples to the call.

The audio buffer format should match the specified stream properties.

```java
    Thread thread = new Thread(){
        public void run() {
            RawAudioBuffer buffer;
            Calendar nextDeliverTime = Calendar.getInstance();
            while (true)
            {
                nextDeliverTime.add(Calendar.MILLISECOND, 20);
                byte data[] = new byte[outgoingAudioStream.getExpectedBufferSizeInBytes()];
                //can grab microphone data from AudioRecord
                ByteBuffer dataBuffer = ByteBuffer.allocateDirect(outgoingAudioStream.getExpectedBufferSizeInBytes());
                dataBuffer.rewind();
                buffer = new RawAudioBuffer(dataBuffer);
                outgoingAudioStream.sendOutgoingAudioBuffer(buffer);
                long wait = nextDeliverTime.getTimeInMillis() - Calendar.getInstance().getTimeInMillis();
                if (wait > 0)
                {
                    try {
                        Thread.sleep(wait);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
            }
        }
    };
    thread.start();
```

### Receive Raw Incoming audio

We can also receive the call audio stream samples as [`java.nio.ByteBuffer`](https://docs.oracle.com/javase/7/docs/api/java/nio/ByteBuffer.html) if we want to process the audio before playback.


Create a `RawIncomingAudioStreamOptions` object specifying the raw stream properties we want to receive.

```java
    RawIncomingAudioStreamOptions options = new RawIncomingAudioStreamOptions();
    RawIncomingAudioStreamProperties properties = new RawIncomingAudioStreamProperties()
                .setAudioFormat(AudioStreamFormat.PCM16_BIT)
                .setSampleRate(AudioStreamSampleRate.HZ44100)
                .setChannelMode(AudioStreamChannelMode.STEREO);
    options.setProperties(properties);
```

Create a `RawIncomingAudioStream` and attach it to join call options

```java
    JoinCallOptions options =  JoinCallOptions() // or StartCallOptions()
    IncomingAudioOptions incomingAudioOptions = new IncomingAudioOptions();

    RawIncomingAudioStream rawIncomingAudioStream = new RawIncomingAudioStream(audioStreamOptions);
    incomingAudioOptions.setStream(rawIncomingAudioStream);
    options.setIncomingAudioOptions(incomingAudioOptions);
```

Or we can also attach the stream to an existing `Call` instance instead:

```java

    CompletableFuture<Void> result = call.startAudio(context, rawIncomingAudioStream);
```

For starting to receive raw audio buffers from the incoming stream add listeners to the incoming stream state and
buffer received events.

```java
    private void onStateChanged(PropertyChangedEvent propertyChangedEvent) {
        // When value is `AudioStreamState.STARTED` we'll be able to receive samples.
    }

    private void onMixedAudioBufferReceived(IncomingMixedAudioEvent incomingMixedAudioEvent) {
        // Received a raw audio buffers(java.nio.ByteBuffer).
    }

    rawIncomingAudioStream.addOnStateChangedListener(this::onStateChanged);
    rawIncomingAudioStream.addMixedAudioBufferReceivedListener(this::onMixedAudioBufferReceived);
```

It's also important to remember to stop the audio stream in the current call `Call` instance:

```java

    CompletableFuture<Void> result = call.stopAudio(context, rawIncomingAudioStream);
```

## RawVideo access

Because the app generates the video frames, the app must inform the Azure Communication Services Calling SDK about the video formats that the app can generate. This information allows the Azure Communication Services Calling SDK to pick the best video format configuration for the network conditions at that time.

## Virtual Video

### Supported video resolutions

| Aspect ratio | Resolution  | Maximum FPS  |
| :--: | :-: | :-: |
| 16x9 | 1080p | 30 |
| 16x9 | 720p | 30 |
| 16x9 | 540p | 30 |
| 16x9 | 480p | 30 |
| 16x9 | 360p | 30 |
| 16x9 | 270p | 15 |
| 16x9 | 240p | 15 |
| 16x9 | 180p | 15 |
| 4x3 | VGA (640x480) | 30 |
| 4x3 | 424x320 | 15 |
| 4x3 | QVGA (320x240) | 15 |
| 4x3 | 212x160 | 15 |

1. Create an array of `VideoFormat` using the VideoStreamPixelFormat the SDK supports.

   When multiple formats are available, the order of the formats in the list doesn't influence or prioritize which one is used. The criteria for format selection are based on external factors like network bandwidth.

    ```java
    VideoStreamFormat videoStreamFormat = new VideoStreamFormat();
    videoStreamFormat.setResolution(VideoStreamResolution.P360);
    videoStreamFormat.setPixelFormat(VideoStreamPixelFormat.RGBA);
    videoStreamFormat.setFramesPerSecond(framerate);
    videoStreamFormat.setStride1(w * 4); // It is times 4 because RGBA is a 32-bit format

    List<VideoStreamFormat> videoStreamFormats = new ArrayList<>();
    videoStreamFormats.add(videoStreamFormat);
    ```

2. Create `RawOutgoingVideoStreamOptions`, and set `Formats` with the previously created object.

    ```java
    RawOutgoingVideoStreamOptions rawOutgoingVideoStreamOptions = new RawOutgoingVideoStreamOptions();
    rawOutgoingVideoStreamOptions.setFormats(videoStreamFormats);
    ```

3. Create an instance of `VirtualOutgoingVideoStream` by using the `RawOutgoingVideoStreamOptions` instance that you created previously.

    ```java
    VirtualOutgoingVideoStream rawOutgoingVideoStream = new VirtualOutgoingVideoStream(rawOutgoingVideoStreamOptions);
    ```

4. Subscribe to the `RawOutgoingVideoStream.addOnFormatChangedListener` delegate. This event informs whenever the `VideoStreamFormat` has been changed from one of the video formats provided on the list.

    ```java
    virtualOutgoingVideoStream.addOnFormatChangedListener((VideoStreamFormatChangedEvent args) -> 
    {
        VideoStreamFormat videoStreamFormat = args.Format;
    });

6. Create an instance of the following helper class to generate random `RawVideoFrame`'s using `VideoStreamPixelFormat.RGBA`

    ```java
    public class VideoFrameSender
    {
        private RawOutgoingVideoStream rawOutgoingVideoStream;
        private Thread frameIteratorThread;
        private Random random = new Random();
        private volatile boolean stopFrameIterator = false;

        public VideoFrameSender(RawOutgoingVideoStream rawOutgoingVideoStream)
        {
            this.rawOutgoingVideoStream = rawOutgoingVideoStream;
        }

        public void VideoFrameIterator()
        {
            while (!stopFrameIterator)
            {
                if (rawOutgoingVideoStream != null && 
                    rawOutgoingVideoStream.getFormat() != null && 
                    rawOutgoingVideoStream.getState() == VideoStreamState.STARTED)
                {
                    SendRandomVideoFrameRGBA();
                }
            }
        }

        private void SendRandomVideoFrameRGBA()
        {
            int rgbaCapacity = rawOutgoingVideoStream.getFormat().getWidth() * rawOutgoingVideoStream.getFormat().getHeight() * 4;

            RawVideoFrame videoFrame = GenerateRandomVideoFrameBuffer(rawOutgoingVideoStream.getFormat(), rgbaCapacity);

            try
            {
                rawOutgoingVideoStream.sendRawVideoFrame(videoFrame).get();

                int delayBetweenFrames = (int)(1000.0 / rawOutgoingVideoStream.getFormat().getFramesPerSecond());
                Thread.sleep(delayBetweenFrames);
            }
            catch (Exception ex)
            {
                String msg = ex.getMessage();
            }
            finally
            {
                videoFrame.close();
            }
        }

        private RawVideoFrame GenerateRandomVideoFrameBuffer(VideoStreamFormat videoStreamFormat, int rgbaCapacity)
        {
            ByteBuffer rgbaBuffer = ByteBuffer.allocateDirect(rgbaCapacity); // Only allocateDirect ByteBuffers are allowed
            rgbaBuffer.order(ByteOrder.nativeOrder());

            GenerateRandomVideoFrame(rgbaBuffer, rgbaCapacity);

            RawVideoFrameBuffer videoFrameBuffer = new RawVideoFrameBuffer();
            videoFrameBuffer.setBuffers(Arrays.asList(rgbaBuffer));
            videoFrameBuffer.setStreamFormat(videoStreamFormat);

            return videoFrameBuffer;
        }

        private void GenerateRandomVideoFrame(ByteBuffer rgbaBuffer, int rgbaCapacity)
        {
            int w = rawOutgoingVideoStream.getFormat().getWidth();
            int h = rawOutgoingVideoStream.getFormat().getHeight();

            byte rVal = (byte)random.nextInt(255);
            byte gVal = (byte)random.nextInt(255);
            byte bVal = (byte)random.nextInt(255);
            byte aVal = (byte)255;

            byte[] rgbaArrayBuffer = new byte[rgbaCapacity];

            int rgbaStride = w * 4;

            for (int y = 0; y < h; y++)
            {
                for (int x = 0; x < rgbaStride; x += 4)
                {
                    rgbaArrayBuffer[(w * 4 * y) + x + 0] = rVal;
                    rgbaArrayBuffer[(w * 4 * y) + x + 1] = gVal;
                    rgbaArrayBuffer[(w * 4 * y) + x + 2] = bVal;
                    rgbaArrayBuffer[(w * 4 * y) + x + 3] = aVal;
                }
            }

            rgbaBuffer.put(rgbaArrayBuffer);
            rgbaBuffer.rewind();
        }

        public void Start()
        {
            frameIteratorThread = new Thread(this::VideoFrameIterator);
            frameIteratorThread.start();
        }

        public void Stop()
        {
            try
            {
                if (frameIteratorThread != null)
                {
                    stopFrameIterator = true;

                    frameIteratorThread.join();
                    frameIteratorThread = null;

                    stopFrameIterator = false;
                }
            }
            catch (InterruptedException ex)
            {
                String msg = ex.getMessage();
            }
        }
    }
    ```

7. Subscribe to the `VideoStream.addOnStateChangedListener` delegate. This delegate informs the state of the current stream. Don't send frames if the state isn't equal to `VideoStreamState.STARTED`.

    ```java
    private VideoFrameSender videoFrameSender;

    rawOutgoingVideoStream.addOnStateChangedListener((VideoStreamStateChangedEvent args) ->
    {
        CallVideoStream callVideoStream = args.getStream();

        switch (callVideoStream.getState())
        {
            case AVAILABLE:
                videoFrameSender = new VideoFrameSender(rawOutgoingVideoStream);
                break;
            case STARTED:
                // Start sending frames
                videoFrameSender.Start();
                break;
            case STOPPED:
                // Stop sending frames
                videoFrameSender.Stop();
                break;
        }
    });
    ```

## ScreenShare Video

Because the Windows system generates the frames, you must implement your own foreground service to capture the frames and send them by using the Azure Communication Services Calling API.

### Supported video resolutions

| Aspect ratio | Resolution  | Maximum FPS  |
| :--: | :-: | :-: |
| Anything | Anything up to 1080p | 30 |

### Steps to create a screen share video stream

1. Create an array of `VideoFormat` using the VideoStreamPixelFormat the SDK supports.

   When multiple formats are available, the order of the formats in the list doesn't influence or prioritize which one is used. The criteria for format selection are based on external factors like network bandwidth.

    ```java
    VideoStreamFormat videoStreamFormat = new VideoStreamFormat();
    videoStreamFormat.setWidth(1280); // Width and height can be used for ScreenShareOutgoingVideoStream for custom resolutions or use one of the predefined values inside VideoStreamResolution
    videoStreamFormat.setHeight(720);
    //videoStreamFormat.setResolution(VideoStreamResolution.P360);
    videoStreamFormat.setPixelFormat(VideoStreamPixelFormat.RGBA);
    videoStreamFormat.setFramesPerSecond(framerate);
    videoStreamFormat.setStride1(w * 4); // It is times 4 because RGBA is a 32-bit format

    List<VideoStreamFormat> videoStreamFormats = new ArrayList<>();
    videoStreamFormats.add(videoStreamFormat);
    ```

2. Create `RawOutgoingVideoStreamOptions`, and set `VideoFormats` with the previously created object.

    ```java
    RawOutgoingVideoStreamOptions rawOutgoingVideoStreamOptions = new RawOutgoingVideoStreamOptions();
    rawOutgoingVideoStreamOptions.setFormats(videoStreamFormats);
    ```

3. Create an instance of `VirtualOutgoingVideoStream` by using the `RawOutgoingVideoStreamOptions` instance that you created previously.

    ```java
    ScreenShareOutgoingVideoStream rawOutgoingVideoStream = new ScreenShareOutgoingVideoStream(rawOutgoingVideoStreamOptions);
    ```

4. Capture and send the video frame in the following way.

    ```java
    private void SendRawVideoFrame()
    {
        ByteBuffer byteBuffer = // Fill it with the content you got from the Windows APIs
        RawVideoFrameBuffer videoFrame = new RawVideoFrameBuffer();
        videoFrame.setBuffers(Arrays.asList(byteBuffer)); // The number of buffers depends on the VideoStreamPixelFormat
        videoFrame.setStreamFormat(rawOutgoingVideoStream.getFormat());

        try
        {
            rawOutgoingVideoStream.sendRawVideoFrame(videoFrame).get();
        }
        catch (Exception ex)
        {
            String msg = ex.getMessage();
        }
        finally
        {
            videoFrame.close();
        }
    }
    ```

## Raw Incoming Video

This feature gives you access the video frames inside the `IncomingVideoStream` objects in order to manipulate those frames locally

1. Create an instance of `IncomingVideoOptions` that sets through `JoinCallOptions` setting `VideoStreamKind.RawIncoming`

    ```java
    IncomingVideoOptions incomingVideoOptions = new IncomingVideoOptions()
            .setStreamType(VideoStreamKind.RAW_INCOMING);

    JoinCallOptions joinCallOptions = new JoinCallOptions()
            .setIncomingVideoOptions(incomingVideoOptions);
    ```

2. Once you receive a `ParticipantsUpdatedEventArgs` event attach `RemoteParticipant.VideoStreamStateChanged` delegate. This event informs the state of the `IncomingVideoStream` object.

    ```java
    private List<RemoteParticipant> remoteParticipantList;

    private void OnRemoteParticipantsUpdated(ParticipantsUpdatedEventArgs args)
    {
        for (RemoteParticipant remoteParticipant : args.getAddedParticipants())
        {
            List<IncomingVideoStream> incomingVideoStreamList = remoteParticipant.getIncomingVideoStreams(); // Check if there are IncomingVideoStreams already before attaching the delegate
            for (IncomingVideoStream incomingVideoStream : incomingVideoStreamList)
            {
                OnRawIncomingVideoStreamStateChanged(incomingVideoStream);
            }

            remoteParticipant.addOnVideoStreamStateChanged(this::OnVideoStreamStateChanged);
            remoteParticipantList.add(remoteParticipant); // If the RemoteParticipant ref is not kept alive the VideoStreamStateChanged events are going to be missed
        }

        for (RemoteParticipant remoteParticipant : args.getRemovedParticipants())
        {
            remoteParticipant.removeOnVideoStreamStateChanged(this::OnVideoStreamStateChanged);
            remoteParticipantList.remove(remoteParticipant);
        }
    }

    private void OnVideoStreamStateChanged(object sender, VideoStreamStateChangedEventArgs args)
    {
        CallVideoStream callVideoStream = args.getStream();

        OnRawIncomingVideoStreamStateChanged((RawIncomingVideoStream) callVideoStream);
    }

    private void OnRawIncomingVideoStreamStateChanged(RawIncomingVideoStream rawIncomingVideoStream)
    {
        switch (incomingVideoStream.State)
        {
            case AVAILABLE:
                // There is a new IncomingvideoStream
                rawIncomingVideoStream.addOnRawVideoFrameReceived(this::OnVideoFrameReceived);
                rawIncomingVideoStream.Start();

                break;
            case STARTED:
                // Will start receiving video frames
                break;
            case STOPPED:
                // Will stop receiving video frames
                break;
            case NOT_AVAILABLE:
                // The IncomingvideoStream should not be used anymore
                rawIncomingVideoStream.removeOnRawVideoFrameReceived(this::OnVideoFrameReceived);

                break;
        }
    }
    ```

3. At the time, the `IncomingVideoStream` has `VideoStreamState.Available` state attach `RawIncomingVideoStream.RawVideoFrameReceived` delegate as shown on the previous step. That delegate provides the new `RawVideoFrame` objects.

    ```java
    private void OnVideoFrameReceived(RawVideoFrameReceivedEventArgs args)
    {
        // Render/Modify/Save the video frame
        RawVideoFrameBuffer videoFrame = (RawVideoFrameBuffer) args.getFrame();
    }
    ```