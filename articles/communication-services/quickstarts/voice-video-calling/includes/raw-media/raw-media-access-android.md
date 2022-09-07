---
title: Quickstart - Add RAW media access to your app (Android)
titleSuffix: An Azure Communication Services quickstart
description: In this quickstart, you'll learn how to add raw media access calling capabilities to your app using Azure Communication Services.
author: yassirbisteni

ms.author: yassirb
ms.date: 06/09/2022
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: calling
ms.custom: mode-other
---

## Raw video

[!INCLUDE [Public Preview](../../../../includes/public-preview-include-document.md)]

In this quickstart, you'll learn how to implement raw media access using the Azure Communication Services Calling SDK for Android.

The Azure Communication Services Calling SDK offers APIs allowing apps to generate their own video frames to send to remote participants.

This quick start builds upon [QuickStart: Add 1:1 video calling to your app](../../get-started-with-video-calling.md?pivots=platform-android) for Android.


## Virtual video stream overview

Since the app will be generating the video frames, the app must inform the Azure Communication Services Calling SDK about the video formats the app is capable of generating. This is required to allow the Azure Communication Services Calling SDK to pick the best video format configuration given the network conditions at any giving time.

The app must register a delegate to get notified about when it should start or stop producing video frames. The delegate event will inform the app which video format is more appropriate for the current network conditions.

### Supported video resolutions

| Aspect Ratio | Resolution  | Maximum FPS  |
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

The following is an overview of the steps required to create a virtual video stream.

1. Create an array of `VideoFormat` with the video formats supported by the app. It is fine to have only one video format supported, but at least one of the provided video formats must be of the `VideoFrameKind::VideoSoftware` type. When multiple formats are provided, the order of the format in the list doesn't influence or prioritize which one will be used. The selected format is based on external factors like network bandwidth.

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

2. Create `RawOutgoingVideoStreamOptions` and set `VideoFormats` with the previously created object.

    ```java
    RawOutgoingVideoStreamOptions rawOutgoingVideoStreamOptions = new RawOutgoingVideoStreamOptions();
    rawOutgoingVideoStreamOptions.setVideoFormats(videoFormats);
    ```

3. Subscribe to `RawOutgoingVideoStreamOptions::addOnOutgoingVideoStreamStateChangedListener` delegate. This delegate will inform the state of the current stream, it's important that you don't send frames if the state is no equal to `OutgoingVideoStreamState.STARTED`.

    ```java
    private OutgoingVideoStreamState outgoingVideoStreamState;

    rawOutgoingVideoStreamOptions.addOnOutgoingVideoStreamStateChangedListener(event -> {

        outgoingVideoStreamState = event.getOutgoingVideoStreamState();
    });
    ```

4. Make sure the `RawOutgoingVideoStreamOptions::addOnVideoFrameSenderChangedListener` delegate is defined. This delegate will inform its listener about events requiring the app to start or stop producing video frames. In this quick start, `mediaFrameSender` is used as trigger to let the app know when it's time to start generating frames. Feel free to use any mechanism in your app as a trigger.

    ```java
    private VideoFrameSender mediaFrameSender;

    rawOutgoingVideoStreamOptions.addOnVideoFrameSenderChangedListener(event -> {

        mediaFrameSender = event.getVideoFrameSender();
    });
    ```

5. Create an instance of `VirtualRawOutgoingVideoStream` using the `RawOutgoingVideoStreamOptions` we created previously

    ```java
    private VirtualRawOutgoingVideoStream virtualRawOutgoingVideoStream;

    virtualRawOutgoingVideoStream = new VirtualRawOutgoingVideoStream(rawOutgoingVideoStreamOptions);
    ```

7.  Once outgoingVideoStreamState is equal to `OutgoingVideoStreamState.STARTED` create and instance of `FrameGenerator` class this will start a non-UI thread and will send frames, call `FrameGenerator.SetVideoFrameSender` each time we get an updated `VideoFrameSender` on the previous delegate, cast the `VideoFrameSender` to the appropriate type defined by the `VideoFrameKind` property of `VideoFormat`. For example, cast it to `SoftwareBasedVideoFrameSender` and then call the `send` method according to the number of planes defined by the VideoFormat.
After that, create the ByteBuffer backing the video frame if needed. Then, update the content of the video frame. Finally, send the video frame to other participants with the `sendFrame` API.

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

## Screen share video stream overview

Repeat steps `1 to 4` from the previous VirtualRawOutgoingVideoStream tutorial.

Since the Android system generates the frames, you must implement your own foreground service to capture the frames and send them through using our Azure Communication Services Calling API

### Supported video resolutions

| Aspect Ratio | Resolution  | Maximum FPS  |
| :--: | :-: | :-: |
| Anything | Anything | 30 |

The following is an overview of the steps required to create a screen share video stream.

1. Add this permission to your `Manifest.xml` file inside your Android project

    ```xml
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
    ```

2. Create an instance of `ScreenShareRawOutgoingVideoStream` using the `RawOutgoingVideoStreamOptions` we created previously

    ```java
    private ScreenShareRawOutgoingVideoStream screenShareRawOutgoingVideoStream;

    screenShareRawOutgoingVideoStream = new ScreenShareRawOutgoingVideoStream(rawOutgoingVideoStreamOptions);
    ```

3. Request needed permissions for screen capture on Android, once this method is called Android will call automatically `onActivityResult` containing the request code we've sent and the result of the operation, expect `Activity.RESULT_OK` if the permission has been provided by the user if so attach the screenShareRawOutgoingVideoStream to the call and start your own foreground service to capture the frames.
    
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

4. Once you receive a frame on your foreground service send it through using the `VideoFrameSender` provided

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
