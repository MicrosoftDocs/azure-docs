---
title: Quickstart - Add raw media access to your app (iOS)
titleSuffix: An Azure Communication Services quickstart
description: In this quickstart, you learn how to add raw media access calling capabilities to your app by using Azure Communication Services.
author: lucianopa-msft

ms.author: lucianopa
ms.date: 09/04/2022
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: calling
ms.custom: mode-other
---

In this quickstart, you learn how to implement raw media access by using the Azure Communication Services Calling SDK for iOS.

The Azure Communication Services Calling SDK offers APIs that allow apps to generate their own video frames to send to remote participants in a call.

This quickstart builds on [Quickstart: Add 1:1 video calling to your app](../../get-started-with-video-calling.md?pivots=platform-ios) for iOS.


## RawAudio access 
Accessing raw audio media gives you access to the incoming call's audio stream, along with the ability to view and send custom outgoing audio streams during a call.

### Send Raw Outgoing audio
Make an options object specifying the raw stream properties we want to send. 

```swift
    let outgoingAudioStreamOptions = RawOutgoingAudioStreamOptions()
    let properties = RawOutgoingAudioStreamProperties()
    properties.sampleRate = .hz44100
    properties.bufferDuration = .inMs20
    properties.channelMode = .mono
    properties.format = .pcm16Bit
    outgoingAudioStreamOptions.properties = properties
```

Create a `RawOutgoingAudioStream` and attach it to join call options and the stream automatically starts when call is connected.

```swift 
    let options = JoinCallOptions() // or StartCallOptions()

    let outgoingAudioOptions = OutgoingAudioOptions()
    self.rawOutgoingAudioStream = RawOutgoingAudioStream(rawOutgoingAudioStreamOptions: outgoingAudioStreamOptions)
    outgoingAudioOptions.stream = self.rawOutgoingAudioStream
    options.outgoingAudioOptions = outgoingAudioOptions

    // Start or Join call passing the options instance.

```

### Attach stream to a call

Or you can also attach the stream to an existing `Call` instance instead:

```swift

    call.startAudio(stream: self.rawOutgoingAudioStream) { error in 
        // Stream attached to `Call`.
    }
```
### Start sending Raw Samples

We can only start sending data once the stream state is `AudioStreamState.started`. 
To observe the audio stream state change, we implement the `RawOutgoingAudioStreamDelegate`. And set it as the stream delegate.

```swift
    func rawOutgoingAudioStream(_ rawOutgoingAudioStream: RawOutgoingAudioStream,
                                didChangeState args: AudioStreamStateChangedEventArgs) {
        // When value is `AudioStreamState.started` we will be able to send audio samples.
    }

    self.rawOutgoingAudioStream.delegate = DelegateImplementer()
```

or use closure based 

```swift
    self.rawOutgoingAudioStream.events.onStateChanged = { args in
        // When value is `AudioStreamState.started` we will be able to send audio samples.
    }
```

When the stream started, we can start sending [`AVAudioPCMBuffer`](https://developer.apple.com/documentation/avfaudio/avaudiopcmbuffer) audio samples to the call. 

The audio buffer format should match the specified stream properties.

```swift
    protocol SamplesProducer {
        func produceSample(_ currentSample: Int, 
                           options: RawOutgoingAudioStreamOptions) -> AVAudioPCMBuffer
    }

    // Let's use a simple Tone data producer as example.
    // Producing PCM buffers.
    func produceSamples(_ currentSample: Int,
                        stream: RawOutgoingAudioStream,
                        options: RawOutgoingAudioStreamOptions) -> AVAudioPCMBuffer {
        let sampleRate = options.properties.sampleRate
        let channelMode = options.properties.channelMode
        let bufferDuration = options.properties.bufferDuration
        let numberOfChunks = UInt32(1000 / bufferDuration.value)
        let bufferFrameSize = UInt32(sampleRate.valueInHz) / numberOfChunks
        let frequency = 400

        guard let format = AVAudioFormat(commonFormat: .pcmFormatInt16,
                                         sampleRate: sampleRate.valueInHz,
                                         channels: channelMode.channelCount,
                                         interleaved: channelMode == .stereo) else {
            fatalError("Failed to create PCM Format")
        }

        guard let buffer = AVAudioPCMBuffer(pcmFormat: format, frameCapacity: bufferFrameSize) else {
            fatalError("Failed to create PCM buffer")
        }

        buffer.frameLength = bufferFrameSize

        let factor: Double = ((2 as Double) * Double.pi) / (sampleRate.valueInHz/Double(frequency))
        var interval = 0
        for sampleIdx in 0..<Int(buffer.frameCapacity * channelMode.channelCount) {
            let sample = sin(factor * Double(currentSample + interval))
            // Scale to maximum amplitude. Int16.max is 37,767.
            let value = Int16(sample * Double(Int16.max))
            
            guard let underlyingByteBuffer = buffer.mutableAudioBufferList.pointee.mBuffers.mData else {
                continue
            }
            underlyingByteBuffer.assumingMemoryBound(to: Int16.self).advanced(by: sampleIdx).pointee = value
            interval += channelMode == .mono ? 2 : 1
        }

        return buffer
    }

    final class RawOutgoingAudioSender {
        let stream: RawOutgoingAudioStream
        let options: RawOutgoingAudioStreamOptions
        let producer: SamplesProducer

        private var timer: Timer?
        private var currentSample: Int = 0
        private var currentTimestamp: Int64 = 0

        init(stream: RawOutgoingAudioStream,
             options: RawOutgoingAudioStreamOptions,
             producer: SamplesProducer) {
            self.stream = stream
            self.options = options
            self.producer = producer
        }

        func start() {
            let properties = self.options.properties
            let interval = properties.bufferDuration.timeInterval

            let channelCount = AVAudioChannelCount(properties.channelMode.channelCount)
            let format = AVAudioFormat(commonFormat: .pcmFormatInt16,
                                       sampleRate: properties.sampleRate.valueInHz,
                                       channels: channelCount,
                                       interleaved: channelCount > 1)!
            self.timer = Timer.scheduledTimer(withTimeInterval: interval, repeats: true) { [weak self] _ in
                guard let self = self else { return }
                let sample = self.producer.produceSamples(self.currentSample, options: self.options)
                let rawBuffer = RawAudioBuffer()
                rawBuffer.buffer = sample
                rawBuffer.timestampInTicks = self.currentTimestamp
                self.stream.send(buffer: rawBuffer, completionHandler: { error in
                    if let error = error {
                        // Handle possible error.
                    }
                })

                self.currentTimestamp += Int64(properties.bufferDuration.value)
                self.currentSample += 1
            }
        }

        func stop() {
            self.timer?.invalidate()
            self.timer = nil
        }

        deinit {
            stop()
        }
    }
```


It's also important to remember to stop the audio stream in the current call `Call` instance:

```swift

    call.stopAudio(stream: self.rawOutgoingAudioStream) { error in 
        // Stream detached from `Call` and stopped.
    }
```

### Capturing microphone samples

Using Apple's [`AVAudioEngine`](https://developer.apple.com/documentation/avfaudio/avaudioengine) we can capture microphone frames by tapping into the audio engine [input node](https://developer.apple.com/documentation/avfaudio/avaudioengine/1386063-inputnode). And capturing the microphone data and being able to use raw audio functionality, we're able to process the audio before sending it to a call. 

```swift 
    import AVFoundation
    import AzureCommunicationCalling

    enum MicrophoneSenderError: Error {
        case notMatchingFormat
    }

    final class MicrophoneDataSender {
        private let stream: RawOutgoingAudioStream
        private let properties: RawOutgoingAudioStreamProperties
        private let format: AVAudioFormat
        private let audioEngine: AVAudioEngine = AVAudioEngine()

        init(properties: RawOutgoingAudioStreamProperties) throws {
            // This can be different depending on which device we are running or value set for
            // `try AVAudioSession.sharedInstance().setPreferredSampleRate(...)`.
            let nodeFormat = self.audioEngine.inputNode.outputFormat(forBus: 0)
            let matchingSampleRate = AudioSampleRate.allCases.first(where: { $0.valueInHz == nodeFormat.sampleRate })
            guard let inputNodeSampleRate = matchingSampleRate else {
                throw MicrophoneSenderError.notMatchingFormat
            }

            // Override the sample rate to one that matches audio session (Audio engine input node frequency).
            properties.sampleRate = inputNodeSampleRate

            let options = RawOutgoingAudioStreamOptions()
            options.properties = properties

            self.stream = RawOutgoingAudioStream(rawOutgoingAudioStreamOptions: options)
            let channelCount = AVAudioChannelCount(properties.channelMode.channelCount)
            self.format = AVAudioFormat(commonFormat: .pcmFormatInt16,
                                        sampleRate: properties.sampleRate.valueInHz,
                                        channels: channelCount,
                                        interleaved: channelCount > 1)!
            self.properties = properties
        }

        func start() throws {
            guard !self.audioEngine.isRunning else {
                return
            }

            // Install tap documentations states that we can get between 100 and 400 ms of data.
            let framesFor100ms = AVAudioFrameCount(self.format.sampleRate * 0.1)

            // Note that some formats may not be allowed by `installTap`, so we have to specify the 
            // correct properties.
            self.audioEngine.inputNode.installTap(onBus: 0, bufferSize: framesFor100ms, 
                                                  format: self.format) { [weak self] buffer, _ in
                guard let self = self else { return }
                
                let rawBuffer = RawAudioBuffer()
                rawBuffer.buffer = buffer
                // Although we specified either 10ms or 20ms, we allow sending up to 100ms of data
                // as long as it can be evenly divided by the specified size.
                self.stream.send(buffer: rawBuffer) { error in
                    if let error = error {
                        // Handle error
                    }
                }
            }

            try audioEngine.start()
        }

        func stop() {
            audioEngine.stop()
        }
    }
```

>[!NOTE]
>The sample rate of the audio engine [input node](https://developer.apple.com/documentation/avfaudio/avaudioengine/1386063-inputnode) defaults to a >value of the preferred sample rate for the shared audio session. So we can't install tap in that node using a different value. 
>So we have to ensure that the `RawOutgoingStream` properties sample rate matches the one we get from tap into microphone samples or convert the tap buffers to the format that matches what is expected on the outgoing stream.
>

With this small sample, we learned how we can capture the microphone [`AVAudioEngine`](https://developer.apple.com/documentation/avfaudio/avaudioengine) data and send those samples to a call using raw outgoing audio feature.

### Receive Raw Incoming audio

We can also receive the call audio stream samples as [`AVAudioPCMBuffer`](https://developer.apple.com/documentation/avfaudio/avaudiopcmbuffer) if we want to process the audio before playback.


Create a `RawIncomingAudioStreamOptions` object specifying the raw stream properties we want to receive.

```swift
    let options = RawIncomingAudioStreamOptions()
    let properties = RawIncomingAudioStreamProperties()
    properties.format = .pcm16Bit
    properties.sampleRate = .hz44100
    properties.channelMode = .stereo
    options.properties = properties
```

Create a `RawOutgoingAudioStream` and attach it to join call options

```swift 
    let options =  JoinCallOptions() // or StartCallOptions()
    let incomingAudioOptions = IncomingAudioOptions()

    self.rawIncomingStream = RawIncomingAudioStream(rawIncomingAudioStreamOptions: audioStreamOptions)
    incomingAudioOptions.stream = self.rawIncomingStream
    options.incomingAudioOptions = incomingAudioOptions
```
Or we can also attach the stream to an existing `Call` instance instead:

```swift

    call.startAudio(stream: self.rawIncomingStream) { error in 
        // Stream attached to `Call`.
    }
```

For starting to receive raw audio buffer from the incoming stream implement the `RawIncomingAudioStreamDelegate`:

```swift
    class RawIncomingReceiver: NSObject, RawIncomingAudioStreamDelegate {
        func rawIncomingAudioStream(_ rawIncomingAudioStream: RawIncomingAudioStream,
                                    didChangeState args: AudioStreamStateChangedEventArgs) {
            // To be notified when stream started and stopped.
        }
        
        func rawIncomingAudioStream(_ rawIncomingAudioStream: RawIncomingAudioStream,
                                    mixedAudioBufferReceived args: IncomingMixedAudioEventArgs) {
            // Receive raw audio buffers(AVAudioPCMBuffer) and process using AVAudioEngine API's.
        }
    }

    self.rawIncomingStream.delegate = RawIncomingReceiver()
```

or

```swift
    rawIncomingAudioStream.events.mixedAudioBufferReceived = { args in
        // Receive raw audio buffers(AVAudioPCMBuffer) and process them using AVAudioEngine API's.
    }

    rawIncomingAudioStream.events.onStateChanged = { args in
        // To be notified when stream started and stopped.
    }
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

    ```swift
    var videoStreamFormat = VideoStreamFormat()
    videoStreamFormat.resolution = VideoStreamResolution.p360
    videoStreamFormat.pixelFormat = VideoStreamPixelFormat.nv12
    videoStreamFormat.framesPerSecond = framerate
    videoStreamFormat.stride1 = w // w is the resolution width
    videoStreamFormat.stride2 = w / 2 // w is the resolution width

    var videoStreamFormats: [VideoStreamFormat] = [VideoStreamFormat]()
    videoStreamFormats.append(videoStreamFormat)
    ```

2. Create `RawOutgoingVideoStreamOptions`, and set formats with the previously created object.

    ```swift
    var rawOutgoingVideoStreamOptions = RawOutgoingVideoStreamOptions()
    rawOutgoingVideoStreamOptions.formats = videoStreamFormats
    ```

3. Create an instance of `VirtualOutgoingVideoStream` by using the `RawOutgoingVideoStreamOptions` instance that you created previously.
    ```swift
    var rawOutgoingVideoStream = VirtualOutgoingVideoStream(videoStreamOptions: rawOutgoingVideoStreamOptions)
    ```

4. Implement to the `VirtualOutgoingVideoStreamDelegate` delegate. The `didChangeFormat` event informs whenever the `VideoStreamFormat` has been changed from one of the video formats provided on the list.

    ```swift
    virtualOutgoingVideoStream.delegate = /* Attach delegate and implement didChangeFormat */
    ```

5. Create an instance of the following helper class to access `CVPixelBuffer` data

    ```swift
    final class BufferExtensions: NSObject {
        public static func getArrayBuffersUnsafe(cvPixelBuffer: CVPixelBuffer) -> Array<UnsafeMutableRawPointer?>
        {
            var bufferArrayList: Array<UnsafeMutableRawPointer?> = [UnsafeMutableRawPointer?]()
                
            let cvStatus: CVReturn = CVPixelBufferLockBaseAddress(cvPixelBuffer, .readOnly)
            
            if cvStatus == kCVReturnSuccess {
                let bufferListSize = CVPixelBufferGetPlaneCount(cvPixelBuffer);
                for i in 0...bufferListSize {
                    let bufferRef = CVPixelBufferGetBaseAddressOfPlane(cvPixelBuffer, i)
                    bufferArrayList.append(bufferRef)
                }
            }
    
            return bufferArrayList
        }
    }
    ```

6. Create an instance of the following helper class to generate random `RawVideoFrameBuffer`'s using `VideoStreamPixelFormat.rgba`

    ```swift
    final class VideoFrameSender : NSObject
    {
        private var rawOutgoingVideoStream: RawOutgoingVideoStream
        private var frameIteratorThread: Thread
        private var stopFrameIterator: Bool = false

        public VideoFrameSender(rawOutgoingVideoStream: RawOutgoingVideoStream)
        {
            self.rawOutgoingVideoStream = rawOutgoingVideoStream
        }

        @objc private func VideoFrameIterator()
        {
            while !stopFrameIterator {
                if rawOutgoingVideoStream != nil &&
                   rawOutgoingVideoStream.format != nil &&
                   rawOutgoingVideoStream.state == .started {
                    SendRandomVideoFrameNV12()
                }
           }
        }

        public func SendRandomVideoFrameNV12() -> Void
        {
            let videoFrameBuffer = GenerateRandomVideoFrameBuffer()
            
            rawOutgoingVideoStream.send(frame: videoFrameBuffer) { error in
                /*Handle error if non-nil*/
            }
            
            let rate = 0.1 / rawOutgoingVideoStream.format.framesPerSecond
            let second: Float = 1000000
            usleep(useconds_t(rate * second))
        }

        private func GenerateRandomVideoFrameBuffer() -> RawVideoFrame
        {
            var cvPixelBuffer: CVPixelBuffer? = nil
            guard CVPixelBufferCreate(kCFAllocatorDefault,
                                    rawOutgoingVideoStream.format.width,
                                    rawOutgoingVideoStream.format.height,
                                    kCVPixelFormatType_420YpCbCr8BiPlanarFullRange,
                                    nil,
                                    &cvPixelBuffer) == kCVReturnSuccess else {
                fatalError()
            }
            
            GenerateRandomVideoFrameNV12(cvPixelBuffer: cvPixelBuffer!)
            
            CVPixelBufferUnlockBaseAddress(cvPixelBuffer!, .readOnly)
            
            let videoFrameBuffer = RawVideoFrameBuffer()
            videoFrameBuffer.buffer = cvPixelBuffer!
            videoFrameBuffer.streamFormat = rawOutgoingVideoStream.format
            
            return videoFrameBuffer
        }
        
       private func GenerateRandomVideoFrameNV12(cvPixelBuffer: CVPixelBuffer) {
            let w = rawOutgoingVideoStream.format.width
            let h = rawOutgoingVideoStream.format.height

            let bufferArrayList = BufferExtensions.getArrayBuffersUnsafe(cvPixelBuffer: cvPixelBuffer)
        
            guard bufferArrayList.count >= 2, let yArrayBuffer = bufferArrayList[0], let uvArrayBuffer = bufferArrayList[1] else {
                return
            }

            let yVal = Int32.random(in: 1..<255)
            let uvVal = Int32.random(in: 1..<255)

            for y in 0...h
            {
                for x in 0...w
                {
                    yArrayBuffer.storeBytes(of: yVal, toByteOffset: Int((y * w) + x), as: Int32.self)
                }
            }

            for y in 0...(h/2)
            {
                for x in 0...(w/2)
                {
                    uvArrayBuffer.storeBytes(of: uvVal, toByteOffset: Int((y * w) + x), as: Int32.self)
                }
            }
        }
        
        public func Start() {
            stopFrameIterator = false
            frameIteratorThread = Thread(target: self, selector: #selector(VideoFrameIterator), object: "VideoFrameSender")
            frameIteratorThread?.start()
        }
        
        public func Stop() {
            if frameIteratorThread != nil {
                stopFrameIterator = true
                frameIteratorThread?.cancel()
                frameIteratorThread = nil
            }
        }
    }
    ```

7. Implement to the `VirtualOutgoingVideoStreamDelegate`. The `didChangeState` event informs the state of the current stream. 
   Don't send frames if the state isn't equal to `VideoStreamState.started`.

    ```swift
    /*Delegate Implementer*/ 
    private var videoFrameSender: VideoFrameSender
    func virtualOutgoingVideoStream(
        _ virtualOutgoingVideoStream: VirtualOutgoingVideoStream,
        didChangeState args: VideoStreamStateChangedEventArgs) {
        switch args.stream.state {
            case .available:
                videoFrameSender = VideoFrameSender(rawOutgoingVideoStream)
                break
            case .started:
                /* Start sending frames */
                videoFrameSender.Start()
                break
            case .stopped:
                /* Stop sending frames */
                videoFrameSender.Stop()
                break
        }
    }
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

    ```swift
    let videoStreamFormat = VideoStreamFormat()
    videoStreamFormat.width = 1280 /* Width and height can be used for ScreenShareOutgoingVideoStream for custom resolutions or use one of the predefined values inside VideoStreamResolution */
    videoStreamFormat.height = 720
    /*videoStreamFormat.resolution = VideoStreamResolution.p360*/
    videoStreamFormat.pixelFormat = VideoStreamPixelFormat.rgba
    videoStreamFormat.framesPerSecond = framerate
    videoStreamFormat.stride1 = w * 4 /* It is times 4 because RGBA is a 32-bit format */
    
    var videoStreamFormats: [VideoStreamFormat] = []
    videoStreamFormats.append(videoStreamFormat)
    ```

2. Create `RawOutgoingVideoStreamOptions`, and set `VideoFormats` with the previously created object.

    ```swift
    var rawOutgoingVideoStreamOptions = RawOutgoingVideoStreamOptions()
    rawOutgoingVideoStreamOptions.formats = videoStreamFormats
    ```

3. Create an instance of `VirtualOutgoingVideoStream` by using the `RawOutgoingVideoStreamOptions` instance that you created previously.

    ```swift
    var rawOutgoingVideoStream = ScreenShareOutgoingVideoStream(rawOutgoingVideoStreamOptions)
    ```

4. Capture and send the video frame in the following way.

    ```swift
    private func SendRawVideoFrame() -> Void
    {
        CVPixelBuffer cvPixelBuffer = /* Fill it with the content you got from the Windows APIs, The number of buffers depends on the VideoStreamPixelFormat */
        let videoFrameBuffer = RawVideoFrameBuffer()
        videoFrameBuffer.buffer = cvPixelBuffer!
        videoFrameBuffer.streamFormat = rawOutgoingVideoStream.format

        rawOutgoingVideoStream.send(frame: videoFrame) { error in
            /*Handle error if not nil*/
        }
    }
    ```

## Raw Incoming Video

This feature gives you access the video frames inside the `IncomingVideoStream`'s in order to manipulate those stream objects locally

1. Create an instance of `IncomingVideoOptions` that sets through `JoinCallOptions` setting `VideoStreamKind.RawIncoming`

    ```swift
    var incomingVideoOptions = IncomingVideoOptions()
    incomingVideoOptions.streamType = VideoStreamKind.rawIncoming
    var joinCallOptions = JoinCallOptions()
    joinCallOptions.incomingVideoOptions = incomingVideoOptions
    ```

2. Once you receive a `ParticipantsUpdatedEventArgs` event attach `RemoteParticipant.delegate.didChangedVideoStreamState` delegate. This event informs the state of the `IncomingVideoStream` objects.
    ```swift
    private var remoteParticipantList: [RemoteParticipant] = []

    func call(_ call: Call, didUpdateRemoteParticipant args: ParticipantsUpdatedEventArgs) {
        args.addedParticipants.forEach { remoteParticipant in
            remoteParticipant.incomingVideoStreams.forEach { incomingVideoStream in
                OnRawIncomingVideoStreamStateChanged(incomingVideoStream: incomingVideoStream)
            }
            remoteParticipant.delegate = /* Attach delegate OnVideoStreamStateChanged*/
        }
            
        args.removedParticipants.forEach { remoteParticipant in
            remoteParticipant.delegate = nil
        }
    }

    func remoteParticipant(_ remoteParticipant: RemoteParticipant, 
                           didVideoStreamStateChanged args: VideoStreamStateChangedEventArgs) {
        OnRawIncomingVideoStreamStateChanged(rawIncomingVideoStream: args.stream)
    }

    func OnRawIncomingVideoStreamStateChanged(rawIncomingVideoStream: RawIncomingVideoStream) {
        switch incomingVideoStream.state {
            case .available:
                /* There is a new IncomingVideoStream */
                rawIncomingVideoStream.delegate /* Attach delegate OnVideoFrameReceived*/
                rawIncomingVideoStream.start()
                break;
            case .started:
                /* Will start receiving video frames */
                break
            case .stopped:
                /* Will stop receiving video frames */
                break
            case .notAvailable:
                /* The IncomingVideoStream should not be used anymore */
                rawIncomingVideoStream.delegate = nil
                break
        }
    }
    ```

3. At the time, the `IncomingVideoStream` has `VideoStreamState.available` state attach `RawIncomingVideoStream.delegate.didReceivedRawVideoFrame` delegate as shown on the previous step. That event provides the new `RawVideoFrame` objects.

    ```swift
    func rawIncomingVideoStream(_ rawIncomingVideoStream: RawIncomingVideoStream, 
                                didRawVideoFrameReceived args: RawVideoFrameReceivedEventArgs) {
        /* Render/Modify/Save the video frame */
        let videoFrame = args.frame as! RawVideoFrameBuffer
    }
    ```
