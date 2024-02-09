---
title: Quickstart - Add raw media access to your app (Unity)
titleSuffix: An Azure Communication Services quickstart
description: In this quickstart, you learn how to add raw media access calling capabilities to your Unity app by using Azure Communication Services.
author: jowang-msft
ms.author: jowang
ms.date: 02/02/2024
ms.topic: include
ms.service: azure-communication-services
ms.subservice: calling
---

In this quickstart, you learn how to implement raw media access by using the Azure Communication Services Calling SDK for Unity.
The Azure Communication Services Calling SDK offers APIs that allow apps to generate their own video frames to send or render raw video frames from remote participants in a call.
This quickstart builds on [Quickstart: Add 1:1 video calling to your app](../../get-started-with-video-calling.md?pivots=platform-unity) for Unity.

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

1. Follow the steps here [Quickstart: Add 1:1 video calling to your app](../../get-started-with-video-calling.md?pivots=platform-unity) to create Unity game. The goal is to obtain a `CallAgent` object ready to begin the call.
   Find the finalized code for this quickstart on [GitHub](https://github.com/Azure-Samples/communication-services-dotnet-quickstarts/tree/main/Unity/RawVideo).
2. Create an array of `VideoFormat` using the VideoStreamPixelFormat the SDK supports.
   When multiple formats are available, the order of the formats in the list doesn't influence or prioritize which one is used. The criteria for format selection are based on external factors like network bandwidth.
    ```csharp
    var videoStreamFormat = new VideoStreamFormat
    {
        Resolution = VideoStreamResolution.P360, // For VirtualOutgoingVideoStream the width/height should be set using VideoStreamResolution enum
        PixelFormat = VideoStreamPixelFormat.Rgba,
        FramesPerSecond = 15,
        Stride1 = 640 * 4 // It is times 4 because RGBA is a 32-bit format
    };
    VideoStreamFormat[] videoStreamFormats = { videoStreamFormat };
    ```
3. Create `RawOutgoingVideoStreamOptions`, and set `Formats` with the previously created object.
    ```csharp
    var rawOutgoingVideoStreamOptions = new RawOutgoingVideoStreamOptions
    {
        Formats = videoStreamFormats
    };
    ```
3. Create an instance of `VirtualOutgoingVideoStream` by using the `RawOutgoingVideoStreamOptions` instance that you created previously.
    ```csharp
    var rawOutgoingVideoStream = new VirtualOutgoingVideoStream(rawOutgoingVideoStreamOptions);
    ```
4. Subscribe to the `RawOutgoingVideoStream.FormatChanged` delegate. This event informs whenever the `VideoStreamFormat` has been changed from one of the video formats provided on the list.
    ```csharp
    rawOutgoingVideoStream.FormatChanged += (object sender, VideoStreamFormatChangedEventArgs args)
    {
        VideoStreamFormat videoStreamFormat = args.Format;
    }
    ```
5. Subscribe to the `RawOutgoingVideoStream.StateChanged` delegate. This event informs whenever the `State` has changed.
    ```csharp
    rawOutgoingVideoStream.StateChanged += (object sender, VideoStreamFormatChangedEventArgs args)
    {
        CallVideoStream callVideoStream = e.Stream;

        switch (callVideoStream.Direction)
        {
            case StreamDirection.Outgoing:
                OnRawOutgoingVideoStreamStateChanged(callVideoStream as OutgoingVideoStream);
                break;
            case StreamDirection.Incoming:
                OnRawIncomingVideoStreamStateChanged(callVideoStream as IncomingVideoStream);
                break;
        }
    }
    ```
6. Handle raw outgoing video stream state transactions such as Start and Stop and begin to generate custom video frames or suspend the frame generating algorithm.
    ```csharp
    private async void OnRawOutgoingVideoStreamStateChanged(OutgoingVideoStream outgoingVideoStream)
    {
        switch (outgoingVideoStream.State)
        {
            case VideoStreamState.Started:
                switch (outgoingVideoStream.Kind)
                {
                    case VideoStreamKind.VirtualOutgoing:
                        outgoingVideoPlayer.StartGenerateFrames(outgoingVideoStream); // This is where a background worker thread can be started to feed the outgoing video frames.
                        break;
                }
                break;

            case VideoStreamState.Stopped:
                switch (outgoingVideoStream.Kind)
                {
                    case VideoStreamKind.VirtualOutgoing:
                        break;
                }
                break;
        }
    }
    ```
    Here is a sample of outgoing video frame generator:
    ```csharp
    private unsafe RawVideoFrame GenerateRawVideoFrame(RawOutgoingVideoStream rawOutgoingVideoStream)
    {
        var format = rawOutgoingVideoStream.Format;
        int w = format.Width;
        int h = format.Height;
        int rgbaCapacity = w * h * 4;

        var rgbaBuffer = new NativeBuffer(rgbaCapacity);
        rgbaBuffer.GetData(out IntPtr rgbaArrayBuffer, out rgbaCapacity);

        byte r = (byte)random.Next(1, 255);
        byte g = (byte)random.Next(1, 255);
        byte b = (byte)random.Next(1, 255);

        for (int y = 0; y < h; y++)
        {
            for (int x = 0; x < w*4; x += 4)
            {
                ((byte*)rgbaArrayBuffer)[(w * 4 * y) + x + 0] = (byte)(y % r);
                ((byte*)rgbaArrayBuffer)[(w * 4 * y) + x + 1] = (byte)(y % g);
                ((byte*)rgbaArrayBuffer)[(w * 4 * y) + x + 2] = (byte)(y % b);
                ((byte*)rgbaArrayBuffer)[(w * 4 * y) + x + 3] = 255;
            }
        }

        // Call ACS Unity SDK API to deliver the frame
        rawOutgoingVideoStream.SendRawVideoFrameAsync(new RawVideoFrameBuffer() {
            Buffers = new NativeBuffer[] { rgbaBuffer },
            StreamFormat = rawOutgoingVideoStream.Format,
            TimestampInTicks = rawOutgoingVideoStream.TimestampInTicks
        }).Wait();

        return new RawVideoFrameBuffer()
        {
            Buffers = new NativeBuffer[] { rgbaBuffer },
            StreamFormat = rawOutgoingVideoStream.Format
        };
    }
    ```
    > [!NOTE]
    > `unsafe` modifier is used on this method since `NativeBuffer` requires access to native memory resources. Therefore, `Allow unsafe` option needs to be enabled in Unity Editor as well.

7. Similarly, we can handle incoming video frames in response to video stream `StateChanged` event.
    ```csharp
    private void OnRawIncomingVideoStreamStateChanged(IncomingVideoStream incomingVideoStream)
    {
        switch (incomingVideoStream.State)
        {
            case VideoStreamState.Available:
                {
                    var rawIncomingVideoStream = incomingVideoStream as RawIncomingVideoStream;
                    rawIncomingVideoStream.RawVideoFrameReceived += OnRawVideoFrameReceived;
                    rawIncomingVideoStream.Start();
                    break;
                }
            case VideoStreamState.Stopped:
                break;
            case VideoStreamState.NotAvailable:
                break;
        }
    }

    private void OnRawVideoFrameReceived(object sender, RawVideoFrameReceivedEventArgs e)
    {
        incomingVideoPlayer.RenderRawVideoFrame(e.Frame);
    }

    public void RenderRawVideoFrame(RawVideoFrame rawVideoFrame)
    {
        var videoFrameBuffer = rawVideoFrame as RawVideoFrameBuffer;
        pendingIncomingFrames.Enqueue(new PendingFrame() {
                frame = rawVideoFrame,
                kind = RawVideoFrameKind.Buffer });
    }
    ```

8. It is highly recommended to manage both incoming and outgoing video frames through a buffering mechanism to avoid overload the `MonoBehaviour.Update()` call back method, which should be kept light and avoid CPU or network heavy duties and ensure a smoother video experience. This optional optimization is left to developers to decide what works the best in theirs scenarios.

    Here is sample of how the incoming frames can be rendered to a Unity `VideoTexture` by calling `Graphics.Blit` out of an internal queue:
    ```csharp
    private void Update()
    {
        if (pendingIncomingFrames.TryDequeue(out PendingFrame pendingFrame))
        {
            switch (pendingFrame.kind)
            {
                case RawVideoFrameKind.Buffer:
                    var videoFrameBuffer = pendingFrame.frame as RawVideoFrameBuffer;
                    VideoStreamFormat videoFormat = videoFrameBuffer.StreamFormat;
                    int width = videoFormat.Width;
                    int height = videoFormat.Height;
                    var texture = new Texture2D(width, height, TextureFormat.RGBA32, mipChain: false);

                    var buffers = videoFrameBuffer.Buffers;
                    NativeBuffer buffer = buffers.Count > 0 ? buffers[0] : null;
                    buffer.GetData(out IntPtr bytes, out int signedSize);

                    texture.LoadRawTextureData(bytes, signedSize);
                    texture.Apply();

                    Graphics.Blit(source: texture, dest: rawIncomingVideoRenderTexture);
                    break;

                case RawVideoFrameKind.Texture:
                    break;
            }
            pendingFrame.frame.Dispose();
        }
    }
    ```
