---
title: Quickstart - Add raw media access to your app (Windows)
titleSuffix: An Azure Communication Services quickstart
description: In this quickstart, you'll learn how to add raw media access calling capabilities to your app by using Azure Communication Services.
author: yassirbisteni

ms.author: yassirb
ms.date: 06/09/2022
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: calling
ms.custom: mode-other
---

[!INCLUDE [Public Preview](../../../../includes/public-preview-include-document.md)]

In this quickstart, you'll learn how to implement raw media access by using the Azure Communication Services Calling SDK for Windows.

The Azure Communication Services Calling SDK offers APIs that allow apps to generate their own video frames to send to remote participants in a call.

This quickstart builds on [Quickstart: Add 1:1 video calling to your app](../../get-started-with-video-calling.md?pivots=platform-windows) for Windows.

## Overview of virtual video streams

Because the app will generate the video frames, the app must inform the Azure Communication Services Calling SDK about the video formats that the app can generate. This information allows the Azure Communication Services Calling SDK to pick the best video format configuration for the network conditions at that time.

The app must register a delegate to get notified about when it should start or stop producing video frames. The delegate event will inform the app which video format is most appropriate for the current network conditions.

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

1. Create an array of `VideoFormat` with the video formats that the app supports. It's fine to have only one supported video format, but at least one of the provided video formats must be of the `VideoFrameKind::VideoSoftware` type.

   When multiple formats are available, the order of the formats in the list doesn't influence or prioritize which one will be used. The criteria for format selection are based on external factors like network bandwidth.

    ```csharp
    var videoFormat = new VideoFormat
    {
        Width = 1280,
        Height = 720,
        PixelFormat = PixelFormat.Rgba,
        VideoFrameKind = VideoFrameKind.VideoSoftware,
        FramesPerSecond = 30,
        Stride1 = 1280 * 4 // It is times 4 because RGBA is a 32-bit format.
    };

    VideoFormat[] videoFormats = { videoFormat };
    ```

2. Create `RawOutgoingVideoStreamOptions`, and set `VideoFormats` with the previously created object.

    ```csharp
    RawOutgoingVideoStreamOptions rawOutgoingVideoStreamOptions = new RawOutgoingVideoStreamOptions();
    rawOutgoingVideoStreamOptions.SetVideoFormats(videoFormats);
    ```

3. Subscribe to the `RawOutgoingVideoStreamOptions::addOnOutgoingVideoStreamStateChangedListener` delegate. This delegate will inform the state of the current stream. Don't send frames if the state is not equal to `OutgoingVideoStreamState.STARTED`.

    ```csharp
    private OutgoingVideoStreamState outgoingVideoStreamState;

    rawOutgoingVideoStreamOptions.OnOutgoingVideoStreamStateChanged += (object sender, OutgoingVideoStreamStateChangedEventArgs args) =>
    {
        outgoingVideoStreamState = args.OutgoingVideoStreamState();
    };
    ```

4. Make sure the `RawOutgoingVideoStreamOptions::addOnVideoFrameSenderChangedListener` delegate is defined. This delegate will inform its listener about events that require the app to start or stop producing video frames.

   This quickstart uses `videoFrameSender` as a trigger to let the app know when it's time to start generating frames. Feel free to use any mechanism in your app as a trigger.

    ```csharp
    private VideoFrameSender videoFrameSender;

    rawOutgoingVideoStreamOptions.OnVideoFrameSenderChanged += (object sender, VideoFrameSenderChangedEventArgs args) =>
    {
        videoFrameSender = args.VideoFrameSender;
    };
    ```

5. Create an instance of `VirtualRawOutgoingVideoStream` by using the `RawOutgoingVideoStreamOptions` instance that you created previously.

    ```csharp
    private VirtualRawOutgoingVideoStream virtualRawOutgoingVideoStream;

    virtualRawOutgoingVideoStream = new VirtualRawOutgoingVideoStream(rawOutgoingVideoStreamOptions);
    ```

6. After `outgoingVideoStreamState` is equal to `OutgoingVideoStreamState.STARTED`, create an instance of the `FrameGenerator` class.

   This step starts a non-UI thread and sends frames. It will call `FrameGenerator.SetVideoFrameSender` each time you get an updated `VideoFrameSender` instance on the previous delegate. It will also cast `VideoFrameSender` to the appropriate type defined by the `VideoFrameKind` property of `VideoFormat`.

   For example, cast `VideoFrameSender` to `SoftwareBasedVideoFrameSender`. Then, call the `send` method according to the number of planes that `VideoFormat` defines.

   After that, create the byte buffer that backs the video frame if needed. Then, update the content of the video frame. Finally, send the video frame to other participants by using the `sendFrame` API.

    ```csharp
    [ComImport]
    [Guid("5B0D3235-4DBA-4D44-865E-8F1D0E4FD04D")]
    [InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
    unsafe interface IMemoryBufferByteAccess
    {
        void GetBuffer(out byte* buffer, out uint capacity);
    }

    public class VideoFrameGenerator
    {
        private VideoFrameSender videoFrameSender;
        private Thread frameIteratorThread;
        private Random random;
        private volatile bool stopFrameIterator = false;

        public VideoFrameGenerator()
        {
            random = new Random();
        }

        public void VideoFrameIterator()
        {
            while (!stopFrameIterator && videoFrameSender != null)
            {
                GenerateVideoFrame().Wait();
            }
        }

        private async Task GenerateVideoFrame()
        {
            try
            {
                var softwareBasedVideoFrameSender = videoFrameSender as SoftwareBasedVideoFrameSender;
                VideoFormat videoFormat = softwareBasedVideoFrameSender.VideoFormat;
                uint bufferSize = (uint)(videoFormat.Width * videoFormat.Height) * 4;

                var memoryBuffer = new MemoryBuffer(bufferSize);
                IMemoryBufferReference memoryBufferReference = memoryBuffer.CreateReference();
                var memoryBufferByteAccess = memoryBufferReference as IMemoryBufferByteAccess;
                int w = softwareBasedVideoFrameSender.VideoFormat.Width;
                int h = softwareBasedVideoFrameSender.VideoFormat.Height;

                unsafe
                {
                    memoryBufferByteAccess.GetBuffer(out byte* destBytes, out uint destCapacity);

                    byte r = (byte)random.Next(1, 255);
                    byte g = (byte)random.Next(1, 255);
                    byte b = (byte)random.Next(1, 255);

                    for (int y = 0; y < h; ++y)
                    {
                        for (int x = 0; x < w; x += 4)
                        {
                            destBytes[(w * 4 * y) + x] = (byte)(y % b);
                            destBytes[(w * 4 * y) + x + 1] = (byte)(y % g);
                            destBytes[(w * 4 * y) + x + 2] = (byte)(y % r);
                            destBytes[(w * 4 * y) + x + 3] = 0;
                        }
                    }
                }

                await softwareBasedVideoFrameSender.SendFrameAsync(memoryBuffer, videoFrameSender.TimestampInTicks);
                int delayBetweenFrames = (int)(1000.0 / softwareBasedVideoFrameSender.VideoFormat.FramesPerSecond);
                await Task.Delay(delayBetweenFrames);
            }
            catch (Exception) { }
        }

        private void Start()
        {
            frameIteratorThread = new Thread(VideoFrameIterator);
            frameIteratorThread.Start();
        }

        public void Stop()
        {
            try
            {
                if (frameIteratorThread != null)
                {
                    stopFrameIterator = true;
                    frameIteratorThread.Join();
                    frameIteratorThread = null;
                    stopFrameIterator = false;
                }
            }
            catch (Exception) { }
        }

        public void OnVideoFrameSenderChanged(object sender, VideoFrameSenderChangedEventArgs args)
        {
            Stop();
            this.videoFrameSender = args.VideoFrameSender;
            Start();
        }
    }
    ```

## Overview of screen share video streams

Repeat steps 1 to 4 from the previous [Steps to create a virtual video stream](#steps-to-create-a-virtual-video-stream) procedure.

Because the Windows system generates the frames, you must implement your own foreground service to capture the frames and send them by using the Azure Communication Services Calling API.

### Supported video resolutions

| Aspect ratio | Resolution  | Maximum FPS  |
| :--: | :-: | :-: |
| Anything | Anything | 30 |

### Steps to create a screen share video stream

1. Create an instance of `ScreenShareRawOutgoingVideoStream` by using the `RawOutgoingVideoStreamOptions` instance that you created previously.

    ```csharp
    private ScreenShareRawOutgoingVideoStream screenShareRawOutgoingVideoStream;

    screenShareRawOutgoingVideoStream = new ScreenShareRawOutgoingVideoStream(rawOutgoingVideoStreamOptions);
    ```

2. Capture the frames from the screen by using Windows APIs.

    ```csharp
    MemoryBuffer memoryBuffer = // Fill it with the content you got from the Windows APIs
    ```

3. Send the video frames in the following way.

    ```csharp
    private async Task GenerateVideoFrame(MemoryBuffer memoryBuffer)
    {
        try
        {
            var softwareBasedVideoFrameSender = videoFrameSender as SoftwareBasedVideoFrameSender;
            VideoFormat videoFormat = softwareBasedVideoFrameSender.VideoFormat;

            await softwareBasedVideoFrameSender.SendFrameAsync(memoryBuffer, videoFrameSender.TimestampInTicks);
            int delayBetweenFrames = (int)(1000.0 / softwareBasedVideoFrameSender.VideoFormat.FramesPerSecond);
            await Task.Delay(delayBetweenFrames);
        }
        catch (Exception) { }
    }
    ```
