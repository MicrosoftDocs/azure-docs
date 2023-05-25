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

[!INCLUDE [Public Preview](../../../../includes/public-preview-include-document.md)]

In this quickstart, you learn how to implement raw media access by using the Azure Communication Services Calling SDK for Android.

The Azure Communication Services Calling SDK offers APIs that allow apps to generate their own video frames to send to remote participants in a call.

This quickstart builds on [Quickstart: Add 1:1 video calling to your app](../../get-started-with-video-calling.md?pivots=platform-android) for Android.

## Raw Audio Access 
Accessing raw audio media gives you access to the incoming audio stream of the call, along with the ability to view and send custom outgoing audio streams during a call.

### Sending Raw Outgoing Audio

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

### Attach Stream to a call

Or you can also attach the stream to an existing `Call` instance instead:

```java
    CompletableFuture<Void> result = call.startAudio(context, rawOutgoingAudioStream);
```

### Start sending Raw Samples

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

### Receiving Raw Incoming Audio

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

## Raw Video Access

Because the app generates the video frames, the app must inform the Azure Communication Services Calling SDK about the video formats that the app can generate. This information allows the Azure Communication Services Calling SDK to pick the best video format configuration for the network conditions at that time.

The app must register a delegate to get notified about when it should start or stop producing video frames. The delegate event informs the app, which video format is most appropriate for the current network conditions.

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

### Steps to create a virtual video stream

1. Create an array of `VideoFormat` with the video formats that the app supports. It's fine to have only one video format supported, but at least one of the provided video formats must be of the `VideoFrameKind::VideoSoftware` type. 

   When multiple formats are provided, the order of the format in the list doesn't influence or prioritize which one is used. The criteria for format selection are based on external factors like network bandwidth.

    ```java
    ArrayList<VideoFormat> videoFormats = new ArrayList<VideoFormat>();

    VideoFormat format = new VideoFormat();
    format.setWidth(1280);
    format.setHeight(720);
    format.setPixelFormat(PixelFormat.RGBA);
    format.setVideoFrameKind(VideoFrameKind.VIDEO_SOFTWARE);
    format.setFramesPerSecond(30);
    format.setStride1(1280 * 4); // It is times 4 because RGBA is a 32-bit format.

    videoFormats.add(format);
    ```

2. Create `RawOutgoingVideoStreamOptions`, and set `VideoFormats` with the previously created object.

    ```java
    RawOutgoingVideoStreamOptions rawOutgoingVideoStreamOptions = new RawOutgoingVideoStreamOptions();
    rawOutgoingVideoStreamOptions.setVideoFormats(videoFormats);
    ```

3. Subscribe to the `RawOutgoingVideoStreamOptions::addOnOutgoingVideoStreamStateChangedListener` delegate. This delegate informs the state of the current stream. Don't send frames if the state isn't equal to `OutgoingVideoStreamState.STARTED`.

    ```java
    private OutgoingVideoStreamState outgoingVideoStreamState;

    rawOutgoingVideoStreamOptions.addOnOutgoingVideoStreamStateChangedListener(event -> {

        outgoingVideoStreamState = event.getOutgoingVideoStreamState();
    });
    ```

4. Make sure the `RawOutgoingVideoStreamOptions::addOnVideoFrameSenderChangedListener` delegate is defined. This delegate informs its listener about events that require the app to start or stop producing video frames. 

   This quickstart uses `mediaFrameSender` as a trigger to let the app know when it's time to start generating frames. Feel free to use any mechanism in your app as a trigger.

    ```java
    private VideoFrameSender mediaFrameSender;

    rawOutgoingVideoStreamOptions.addOnVideoFrameSenderChangedListener(event -> {

        mediaFrameSender = event.getVideoFrameSender();
    });
    ```

5. Create an instance of `VirtualRawOutgoingVideoStream` by using the `RawOutgoingVideoStreamOptions` instance that you created previously.

    ```java
    private VirtualRawOutgoingVideoStream virtualRawOutgoingVideoStream;

    virtualRawOutgoingVideoStream = new VirtualRawOutgoingVideoStream(rawOutgoingVideoStreamOptions);
    ```

6. After `outgoingVideoStreamState` is equal to `OutgoingVideoStreamState.STARTED`, create an instance of the `FrameGenerator` class.

   This step starts a non-UI thread and sends frames. It calls `FrameGenerator.SetVideoFrameSender` each time you get an updated `VideoFrameSender` instance on the previous delegate. It also casts `VideoFrameSender` to the appropriate type defined by the `VideoFrameKind` property of `VideoFormat`.

   For example, cast `VideoFrameSender` to `SoftwareBasedVideoFrameSender`. Then, call the `send` method according to the number of planes that `VideoFormat` defines.

   After that, create the byte buffer that backs the video frame if needed. Then, update the content of the video frame. Finally, send the video frame to other participants by using the `sendFrame` API.

    ```java
    public class FrameGenerator implements VideoFrameSenderChangedListener {

    private VideoFrameSender videoFrameSender;
    private Thread frameIteratorThread;
    private final Random random;
    private volatile boolean stopFrameIterator = false;

    public FrameGenerator() {

        random = new Random();
    }

    public void FrameIterator() {

        ByteBuffer plane = null;
        while (!stopFrameIterator && videoFrameSender != null) {

            plane = GenerateFrame(plane);
        }
    }

    private ByteBuffer GenerateFrame(ByteBuffer plane) {

        try {

            VideoFormat videoFormat = videoFrameSender.getVideoFormat();
            if (plane == null || videoFormat.getStride1() * videoFormat.getHeight() != plane.capacity()) {

                plane = ByteBuffer.allocateDirect(videoFormat.getStride1() * videoFormat.getHeight());
                plane.order(ByteOrder.nativeOrder());
            }

            int bandsCount = random.nextInt(15) + 1;
            int bandBegin = 0;
            int bandThickness = videoFormat.getHeight() * videoFormat.getStride1() / bandsCount;

            for (int i = 0; i < bandsCount; ++i) {

                byte greyValue = (byte) random.nextInt(254);
                java.util.Arrays.fill(plane.array(), bandBegin, bandBegin + bandThickness, greyValue);
                bandBegin += bandThickness;
            }

            if (videoFrameSender instanceof SoftwareBasedVideoFrameSender) {
                SoftwareBasedVideoFrameSender sender = (SoftwareBasedVideoFrameSender) videoFrameSender;

                long timeStamp = sender.getTimestampInTicks();
                sender.sendFrame(plane, timeStamp).get();
            } else {

                HardwareBasedVideoFrameSender sender = (HardwareBasedVideoFrameSender) videoFrameSender;

                int[] textureIds = new int[1];
                int targetId = GLES20.GL_TEXTURE_2D;

                GLES20.glEnable(targetId);
                GLES20.glGenTextures(1, textureIds, 0);
                GLES20.glActiveTexture(GLES20.GL_TEXTURE0);
                GLES20.glBindTexture(targetId, textureIds[0]);
                GLES20.glTexImage2D(targetId,
                        0,
                        GLES20.GL_RGB,
                        videoFormat.getWidth(),
                        videoFormat.getHeight(),
                        0,
                        GLES20.GL_RGB,
                        GLES20.GL_UNSIGNED_BYTE,
                        plane);

                long timeStamp = sender.getTimestampInTicks();
                sender.sendFrame(targetId, textureIds[0], timeStamp).get();
            }

            Thread.sleep((long) (1000.0f / videoFormat.getFramesPerSecond()));
        } catch (InterruptedException ex) {

            Log.d("FrameGenerator", String.format("FrameGenerator.GenerateFrame, %s", ex.getMessage()));
        } catch (ExecutionException ex2) {
        
            Log.d("FrameGenerator", String.format("FrameGenerator.GenerateFrame, %s", ex2.getMessage()));
        }

        return plane;
    }

    private void StartFrameIterator() {

        frameIteratorThread = new Thread(this::FrameIterator);
        frameIteratorThread.start();
    }

    public void StopFrameIterator() {

        try {

            if (frameIteratorThread != null) {

                stopFrameIterator = true;
                frameIteratorThread.join();
                frameIteratorThread = null;
                stopFrameIterator = false;
            }
        } catch (InterruptedException ex) {

            Log.d("FrameGenerator", String.format("FrameGenerator.StopFrameIterator, %s", ex.getMessage()));
        }
    }
    ```

## Overview of screen share video streams

Repeat steps 1 to 4 from the previous [Steps to create a virtual video stream](#steps-to-create-a-virtual-video-stream) procedure.

Because the Android system generates the frames, you must implement your own foreground service to capture the frames and send them by using the Azure Communication Services Calling API.

### Supported video resolutions

| Aspect ratio | Resolution  | Maximum FPS  |
| :--: | :-: | :-: |
| Anything | Anything | 30 |

### Steps to create a screen share video stream

1. Add this permission to your *Manifest.xml* file inside your Android project.

    ```xml
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
    ```

2. Create an instance of `ScreenShareRawOutgoingVideoStream` by using the `RawOutgoingVideoStreamOptions` instance that you created previously.

    ```java
    private ScreenShareRawOutgoingVideoStream screenShareRawOutgoingVideoStream;

    screenShareRawOutgoingVideoStream = new ScreenShareRawOutgoingVideoStream(rawOutgoingVideoStreamOptions);
    ```

3. Request needed permissions for screen capture on Android. After this method is called, Android will automatically call `onActivityResult`, which contains the request code that you sent and the result of the operation.

   Expect `Activity.RESULT_OK` if the user has provided the permission. If so, attach `screenShareRawOutgoingVideoStream` to the call and start your own foreground service to capture the frames.

    ```java
    public void GetScreenSharePermissions() {

        try {

            MediaProjectionManager mediaProjectionManager = (MediaProjectionManager) getSystemService(Context.MEDIA_PROJECTION_SERVICE);
            startActivityForResult(mediaProjectionManager.createScreenCaptureIntent(), Constants.SCREEN_SHARE_REQUEST_INTENT_REQ_CODE);
        } catch (Exception e) {

            String error = "Could not start screen share due to failure to startActivityForResult for mediaProjectionManager screenCaptureIntent";
            Log.d("FrameGenerator", error);
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {

        super.onActivityResult(requestCode, resultCode, data);

        if (requestCode == Constants.SCREEN_SHARE_REQUEST_INTENT_REQ_CODE) {

            if (resultCode == Activity.RESULT_OK && data != null) {

                // Attach the screenShareRawOutgoingVideoStream to the call
                // Start your foreground service
            } else {

                String error = "user cancelled, did not give permission to capture screen";
            }
        }
    }
    ```

4. After you receive a frame on your foreground service, send it by using the provided `VideoFrameSender` information.

    ````java
    public void onImageAvailable(ImageReader reader) {

        Image image = reader.acquireLatestImage();
        if (image != null) {

            final Image.Plane[] planes = image.getPlanes();
            if (planes.length > 0) {

                Image.Plane plane = planes[0];
                final ByteBuffer buffer = plane.getBuffer();
                try {

                    SoftwareBasedVideoFrameSender sender = (SoftwareBasedVideoFrameSender) videoFrameSender;
                    sender.sendFrame(buffer, sender.getTimestamp()).get();
                } catch (Exception ex) {

                    Log.d("MainActivity", "MainActivity.onImageAvailable trace, failed to send Frame");
                }
            }

            image.close();
        }
    }
    ````
