---
title: Quickstart - Add raw media access to your app (Windows)
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

In this quickstart, you learn how to implement raw media access by using the Azure Communication Services Calling SDK for Windows.
The Azure Communication Services Calling SDK offers APIs that allow apps to generate their own video frames to send to remote participants in a call.
This quickstart builds on [Quickstart: Add 1:1 video calling to your app](../../get-started-with-video-calling.md?pivots=platform-windows) for Windows.

## RawAudio access 
Accessing raw audio media gives you access to the incoming call's audio stream, along with the ability to view and send custom outgoing audio streams during a call.

### Send Raw Outgoing audio
Make an options object specifying the raw stream properties we want to send. 
```csharp
    RawOutgoingAudioStreamProperties outgoingAudioProperties = new RawOutgoingAudioStreamProperties()
    {
        Format = ACSAudioStreamFormat.Pcm16Bit,
        SampleRate = AudioStreamSampleRate.Hz48000,
        ChannelMode = AudioStreamChannelMode.Stereo,
        BufferDuration = AudioStreamBufferDuration.InMs20
    };
    RawOutgoingAudioStreamOptions outgoingAudioStreamOptions = new RawOutgoingAudioStreamOptions()
    {
        Properties = outgoingAudioProperties
    };
```
Create a `RawOutgoingAudioStream` and attach it to join call options and the stream automatically starts when call is connected.
```csharp 
    JoinCallOptions options =  JoinCallOptions(); // or StartCallOptions()
    OutgoingAudioOptions outgoingAudioOptions = new OutgoingAudioOptions();
    RawOutgoingAudioStream rawOutgoingAudioStream = new RawOutgoingAudioStream(outgoingAudioStreamOptions);
    outgoingAudioOptions.Stream = rawOutgoingAudioStream;
    options.OutgoingAudioOptions = outgoingAudioOptions;
    // Start or Join call with those call options.
```
### Attach stream to a call
Or you can also attach the stream to an existing `Call` instance instead:
```csharp
    await call.StartAudio(rawOutgoingAudioStream);
```
### Start sending raw samples
We can only start sending data once the stream state is `AudioStreamState.Started`. 
To observe the audio stream state change, add a listener to the `OnStateChangedListener` event.
```csharp
    unsafe private void AudioStateChanged(object sender, AudioStreamStateChanged args)
    {
        if (args.AudioStreamState == AudioStreamState.Started)
        {
            // We can now start sending samples.
        }
    }
    outgoingAudioStream.StateChanged += AudioStateChanged;
```
When the stream started, we can start sending [`MemoryBuffer`](/uwp/api/windows.foundation.memorybuffer) audio samples to the call.
The audio buffer format should match the specified stream properties.
```csharp
    void Start()
    {
        RawOutgoingAudioStreamProperties properties = outgoingAudioStream.Properties;
        RawAudioBuffer buffer;
        new Thread(() =>
        {
            DateTime nextDeliverTime = DateTime.Now;
            while (true)
            {
                MemoryBuffer memoryBuffer = new MemoryBuffer((uint)outgoingAudioStream.ExpectedBufferSizeInBytes);
                using (IMemoryBufferReference reference = memoryBuffer.CreateReference())
                {
                    byte* dataInBytes;
                    uint capacityInBytes;
                    ((IMemoryBufferByteAccess)reference).GetBuffer(out dataInBytes, out capacityInBytes);
                    // Use AudioGraph here to grab data from microphone if you want microphone data
                }
                nextDeliverTime = nextDeliverTime.AddMilliseconds(20);
                buffer = new RawAudioBuffer(memoryBuffer);
                outgoingAudioStream.SendOutgoingAudioBuffer(buffer);
                TimeSpan wait = nextDeliverTime - DateTime.Now;
                if (wait > TimeSpan.Zero)
                {
                    Thread.Sleep(wait);
                }
            }
        }).Start();
    }
```
### Receive Raw Incoming audio
We can also receive the call audio stream samples as [`MemoryBuffer`](/uwp/api/windows.foundation.memorybuffer) if we want to process the call audio stream before playback.
Create a `RawIncomingAudioStreamOptions` object specifying the raw stream properties we want to receive.
```csharp
    RawIncomingAudioStreamProperties properties = new RawIncomingAudioStreamProperties()
    {
        Format = AudioStreamFormat.Pcm16Bit,
        SampleRate = AudioStreamSampleRate.Hz44100,
        ChannelMode = AudioStreamChannelMode.Stereo
    };
    RawIncomingAudioStreamOptions options = new RawIncomingAudioStreamOptions()
    {
        Properties = properties
    };
```
Create a `RawIncomingAudioStream` and attach it to join call options
```csharp
    JoinCallOptions options =  JoinCallOptions(); // or StartCallOptions()
    RawIncomingAudioStream rawIncomingAudioStream = new RawIncomingAudioStream(audioStreamOptions);
    IncomingAudioOptions incomingAudioOptions = new IncomingAudioOptions()
    {
        Stream = rawIncomingAudioStream
    };
    options.IncomingAudioOptions = incomingAudioOptions;
```
Or we can also attach the stream to an existing `Call` instance instead:
```csharp
    await call.startAudio(context, rawIncomingAudioStream);
```
For starting to receive raw audio buffers from the incoming stream add listeners to the incoming stream state and
buffer received events.
```csharp
    unsafe private void OnAudioStateChanged(object sender, AudioStreamStateChanged args)
    {
        if (args.AudioStreamState == AudioStreamState.Started)
        {
            // When value is `AudioStreamState.STARTED` we'll be able to receive samples.
        }
    }
    private void OnRawIncomingMixedAudioBufferAvailable(object sender, IncomingMixedAudioEventArgs args)
    {
        // Received a raw audio buffers(MemoryBuffer).
        using (IMemoryBufferReference reference = args.IncomingAudioBuffer.Buffer.CreateReference())
        {
            byte* dataInBytes;
            uint capacityInBytes;
            ((IMemoryBufferByteAccess)reference).GetBuffer(out dataInBytes, out capacityInBytes);
            // Process the data using AudioGraph class
        }
    }
    rawIncomingAudioStream.StateChanged += OnAudioStateChanged;
    rawIncomingAudioStream.MixedAudioBufferReceived += OnRawIncomingMixedAudioBufferAvailable;
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
    ```csharp
    var videoStreamFormat = new VideoStreamFormat
    {
        Resolution = VideoStreamResolution.P720, // For VirtualOutgoingVideoStream the width/height should be set using VideoStreamResolution enum
        PixelFormat = VideoStreamPixelFormat.Rgba,
        FramesPerSecond = 30,
        Stride1 = 1280 * 4 // It is times 4 because RGBA is a 32-bit format
    };
    VideoStreamFormat[] videoStreamFormats = { videoStreamFormat };
    ```
2. Create `RawOutgoingVideoStreamOptions`, and set `Formats` with the previously created object.
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
6. Create an instance of the following helper class to access the buffer data
    ```csharp
    [ComImport]
    [Guid("5B0D3235-4DBA-4D44-865E-8F1D0E4FD04D")]
    [InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
    unsafe interface IMemoryBufferByteAccess
    {
        void GetBuffer(out byte* buffer, out uint capacity);
    }
    [ComImport]
    [Guid("905A0FEF-BC53-11DF-8C49-001E4FC686DA")]
    [InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
    unsafe interface IBufferByteAccess
    {
        void Buffer(out byte* buffer);
    }
    internal static class BufferExtensions
    {
        // For accessing MemoryBuffer
        public static unsafe byte* GetArrayBuffer(IMemoryBuffer memoryBuffer)
        {
            IMemoryBufferReference memoryBufferReference = memoryBuffer.CreateReference();
            var memoryBufferByteAccess = memoryBufferReference as IMemoryBufferByteAccess;
            memoryBufferByteAccess.GetBuffer(out byte* arrayBuffer, out uint arrayBufferCapacity);
            GC.AddMemoryPressure(arrayBufferCapacity);
            return arrayBuffer;
        }
        // For accessing MediaStreamSample
        public static unsafe byte* GetArrayBuffer(IBuffer buffer)
        {
            var bufferByteAccess = buffer as IBufferByteAccess;
            bufferByteAccess.Buffer(out byte* arrayBuffer);
            uint arrayBufferCapacity = buffer.Capacity;
            GC.AddMemoryPressure(arrayBufferCapacity);
            return arrayBuffer;
        }
    }
    ```

7. Create an instance of the following helper class to generate random `RawVideoFrame`'s using `VideoStreamPixelFormat.Rgba`
    ```csharp
    public class VideoFrameSender
    {
        private RawOutgoingVideoStream rawOutgoingVideoStream;
        private RawVideoFrameKind rawVideoFrameKind;
        private Thread frameIteratorThread;
        private Random random = new Random();
        private volatile bool stopFrameIterator = false;
        public VideoFrameSender(RawVideoFrameKind rawVideoFrameKind, RawOutgoingVideoStream rawOutgoingVideoStream)
        {
            this.rawVideoFrameKind = rawVideoFrameKind;
            this.rawOutgoingVideoStream = rawOutgoingVideoStream;
        }
        public async void VideoFrameIterator()
        {
            while (!stopFrameIterator)
            {
                if (rawOutgoingVideoStream != null &&
                    rawOutgoingVideoStream.Format != null &&
                    rawOutgoingVideoStream.State == VideoStreamState.Started)
                {
                    await SendRandomVideoFrameRGBA();
                }
            }
        }
        private async Task SendRandomVideoFrameRGBA()
        {
            uint rgbaCapacity = (uint)(rawOutgoingVideoStream.Format.Width * rawOutgoingVideoStream.Format.Height * 4);
            RawVideoFrame videoFrame = null;
            switch (rawVideoFrameKind)
            {
                case RawVideoFrameKind.Buffer:
                    videoFrame = 
                        GenerateRandomVideoFrameBuffer(rawOutgoingVideoStream.Format, rgbaCapacity);
                    break;
                case RawVideoFrameKind.Texture:
                    videoFrame = 
                        GenerateRandomVideoFrameTexture(rawOutgoingVideoStream.Format, rgbaCapacity);
                    break;
            }
            try
            {
                using (videoFrame)
                {
                    await rawOutgoingVideoStream.SendRawVideoFrameAsync(videoFrame);
                }
            }
            catch (Exception ex)
            {
                string msg = ex.Message;
            }
            try
            {
                int delayBetweenFrames = (int)(1000.0 / rawOutgoingVideoStream.Format.FramesPerSecond);
                await Task.Delay(delayBetweenFrames);
            }
            catch (Exception ex)
            {
                string msg = ex.Message;
            }
        }
        private unsafe RawVideoFrame GenerateRandomVideoFrameBuffer(VideoStreamFormat videoFormat, uint rgbaCapacity)
        {
            var rgbaBuffer = new MemoryBuffer(rgbaCapacity);
            byte* rgbaArrayBuffer = BufferExtensions.GetArrayBuffer(rgbaBuffer);
            GenerateRandomVideoFrame(&rgbaArrayBuffer);
            return new RawVideoFrameBuffer()
            {
                Buffers = new MemoryBuffer[] { rgbaBuffer },
                StreamFormat = videoFormat
            };
        }
        private unsafe RawVideoFrame GenerateRandomVideoFrameTexture(VideoStreamFormat videoFormat, uint rgbaCapacity)
        {
            var timeSpan = new TimeSpan(rawOutgoingVideoStream.TimestampInTicks);
            var rgbaBuffer = new Buffer(rgbaCapacity)
            {
                Length = rgbaCapacity
            };
            byte* rgbaArrayBuffer = BufferExtensions.GetArrayBuffer(rgbaBuffer);
            GenerateRandomVideoFrame(&rgbaArrayBuffer);
            var mediaStreamSample = MediaStreamSample.CreateFromBuffer(rgbaBuffer, timeSpan);
            return new RawVideoFrameTexture()
            {
                Texture = mediaStreamSample,
                StreamFormat = videoFormat
            };
        }
        private unsafe void GenerateRandomVideoFrame(byte** rgbaArrayBuffer)
        {
            int w = rawOutgoingVideoStream.Format.Width;
            int h = rawOutgoingVideoStream.Format.Height;
            byte r = (byte)random.Next(1, 255);
            byte g = (byte)random.Next(1, 255);
            byte b = (byte)random.Next(1, 255);
            int rgbaStride = w * 4;
            for (int y = 0; y < h; y++)
            {
                for (int x = 0; x < rgbaStride; x += 4)
                {
                    (*rgbaArrayBuffer)[(w * 4 * y) + x + 0] = (byte)(y % r);
                    (*rgbaArrayBuffer)[(w * 4 * y) + x + 1] = (byte)(y % g);
                    (*rgbaArrayBuffer)[(w * 4 * y) + x + 2] = (byte)(y % b);
                    (*rgbaArrayBuffer)[(w * 4 * y) + x + 3] = 255;
                }
            }
        }
        public void Start()
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
            catch (Exception ex)
            {
                string msg = ex.Message;
            }
        }
    }
    ```
8. Subscribe to the `VideoStream.StateChanged` delegate. This event informs the state of the current stream. Don't send frames if the state isn't equal to `VideoStreamState.Started`.
    ```csharp
    private VideoFrameSender videoFrameSender;
    rawOutgoingVideoStream.StateChanged += (object sender, VideoStreamStateChangedEventArgs args) =>
    {
        CallVideoStream callVideoStream = args.Stream;
        switch (callVideoStream.State)
            {
                case VideoStreamState.Available:
                    // VideoStream has been attached to the call
                    var frameKind = RawVideoFrameKind.Buffer; // Use the frameKind you prefer
                    //var frameKind = RawVideoFrameKind.Texture;
                    videoFrameSender = new VideoFrameSender(frameKind, rawOutgoingVideoStream);
                    break;
                case VideoStreamState.Started:
                    // Start sending frames
                    videoFrameSender.Start();
                    break;
                case VideoStreamState.Stopped:
                    // Stop sending frames
                    videoFrameSender.Stop();
                    break;
            }
    };
    ```
## Screen Share Video
Because the Windows system generates the frames, you must implement your own foreground service to capture the frames and send them by using the Azure Communication Services Calling API.
### Supported video resolutions
| Aspect ratio | Resolution  | Maximum FPS  |
| :--: | :-: | :-: |
| Anything | Anything up to 1080p | 30 |
### Steps to create a screen share video stream
1. Create an array of `VideoFormat` using the VideoStreamPixelFormat the SDK supports.
   When multiple formats are available, the order of the formats in the list doesn't influence or prioritize which one is used. The criteria for format selection are based on external factors like network bandwidth.
    ```csharp
    var videoStreamFormat = new VideoStreamFormat
    {
        Width = 1280, // Width and height can be used for ScreenShareOutgoingVideoStream for custom resolutions or use one of the predefined values inside VideoStreamResolution
        Height = 720,
        //Resolution = VideoStreamResolution.P720,
        PixelFormat = VideoStreamPixelFormat.Rgba,
        FramesPerSecond = 30,
        Stride1 = 1280 * 4 // It is times 4 because RGBA is a 32-bit format.
    };
    VideoStreamFormat[] videoStreamFormats = { videoStreamFormat };
    ```
2. Create `RawOutgoingVideoStreamOptions`, and set `VideoFormats` with the previously created object.
    ```csharp
    var rawOutgoingVideoStreamOptions = new RawOutgoingVideoStreamOptions
    {
        Formats = videoStreamFormats
    };
    ```
3. Create an instance of `VirtualOutgoingVideoStream` by using the `RawOutgoingVideoStreamOptions` instance that you created previously.
    ```csharp
    var rawOutgoingVideoStream = new ScreenShareOutgoingVideoStream(rawOutgoingVideoStreamOptions);
    ```
4. Capture and send the video frame in the following way.
    ```csharp
    private async Task SendRawVideoFrame()
    {
        RawVideoFrame videoFrame = null;
        switch (rawVideoFrameKind) //it depends on the frame kind you want to send
        {
            case RawVideoFrameKind.Buffer:
                MemoryBuffer memoryBuffer = // Fill it with the content you got from the Windows APIs
                videoFrame = new RawVideoFrameBuffer()
                {
                    Buffers = memoryBuffer // The number of buffers depends on the VideoStreamPixelFormat
                    StreamFormat = rawOutgoingVideoStream.Format
                };
                break;
            case RawVideoFrameKind.Texture:
                MediaStreamSample mediaStreamSample = // Fill it with the content you got from the Windows APIs
                videoFrame = new RawVideoFrameTexture()
                {
                    Texture = mediaStreamSample, // Texture only receive planar buffers
                    StreamFormat = rawOutgoingVideoStream.Format
                };
                break;
        }

        try
        {
            using (videoFrame)
            {
                await rawOutgoingVideoStream.SendRawVideoFrameAsync(videoFrame);
            }
        }
        catch (Exception ex)
        {
            string msg = ex.Message;
        }

        try
        {
            int delayBetweenFrames = (int)(1000.0 / rawOutgoingVideoStream.Format.FramesPerSecond);
            await Task.Delay(delayBetweenFrames);
        }
        catch (Exception ex)
        {
            string msg = ex.Message;
        }
    }
    ```
## Raw Incoming Video
This feature gives you access the video frames inside the `IncomingVideoStream`'s in order to manipulate those streams locally
1. Create an instance of `IncomingVideoOptions` that sets through `JoinCallOptions` setting `VideoStreamKind.RawIncoming`
    ```csharp
    var frameKind = RawVideoFrameKind.Buffer;  // Use the frameKind you prefer to receive
    var incomingVideoOptions = new IncomingVideoOptions
    {
        StreamKind = VideoStreamKind.RawIncoming,
        FrameKind = frameKind
    };
    var joinCallOptions = new JoinCallOptions
    {
        IncomingVideoOptions = incomingVideoOptions
    };
    ```
2. Once you receive a `ParticipantsUpdatedEventArgs` event attach `RemoteParticipant.VideoStreamStateChanged` delegate. This event informs the state of the `IncomingVideoStream` objects.
    ```csharp
    private List<RemoteParticipant> remoteParticipantList;
    private void OnRemoteParticipantsUpdated(object sender, ParticipantsUpdatedEventArgs args)
    {
        foreach (RemoteParticipant remoteParticipant in args.AddedParticipants)
        {
            IReadOnlyList<IncomingVideoStream> incomingVideoStreamList = remoteParticipant.IncomingVideoStreams; // Check if there are IncomingVideoStreams already before attaching the delegate
            foreach (IncomingVideoStream incomingVideoStream in incomingVideoStreamList)
            {
                OnRawIncomingVideoStreamStateChanged(incomingVideoStream);
            }
            remoteParticipant.VideoStreamStateChanged += OnVideoStreamStateChanged;
            remoteParticipantList.Add(remoteParticipant); // If the RemoteParticipant ref is not kept alive the VideoStreamStateChanged events are going to be missed
        }
        foreach (RemoteParticipant remoteParticipant in args.RemovedParticipants)
        {
            remoteParticipant.VideoStreamStateChanged -= OnVideoStreamStateChanged;
            remoteParticipantList.Remove(remoteParticipant);
        }
    }
    private void OnVideoStreamStateChanged(object sender, VideoStreamStateChangedEventArgs args)
    {
        CallVideoStream callVideoStream = args.Stream;
        OnRawIncomingVideoStreamStateChanged(callVideoStream as RawIncomingVideoStream);
    }
    private void OnRawIncomingVideoStreamStateChanged(RawIncomingVideoStream rawIncomingVideoStream)
    {
        switch (incomingVideoStream.State)
        {
            case VideoStreamState.Available:
                // There is a new IncomingVideoStream
                rawIncomingVideoStream.RawVideoFrameReceived += OnVideoFrameReceived;
                rawIncomingVideoStream.Start();
                break;
            case VideoStreamState.Started:
                // Will start receiving video frames
                break;
            case VideoStreamState.Stopped:
                // Will stop receiving video frames
                break;
            case VideoStreamState.NotAvailable:
                // The IncomingVideoStream should not be used anymore
                rawIncomingVideoStream.RawVideoFrameReceived -= OnVideoFrameReceived;
                break;
        }
    }
    ```
3. At the time, the `IncomingVideoStream` has `VideoStreamState.Available` state attach `RawIncomingVideoStream.RawVideoFrameReceived` delegate as shown on the previous step. That provides the new `RawVideoFrame` objects.
    ```csharp
    private async void OnVideoFrameReceived(object sender, RawVideoFrameReceivedEventArgs args)
    {
        RawVideoFrame videoFrame = args.Frame;
        switch (videoFrame.Kind) // The type will be whatever was configured on the IncomingVideoOptions
        {
            case RawVideoFrameKind.Buffer:
                // Render/Modify/Save the video frame
                break;
            case RawVideoFrameKind.Texture:
                // Render/Modify/Save the video frame
                break;
        }
    }
    ```
