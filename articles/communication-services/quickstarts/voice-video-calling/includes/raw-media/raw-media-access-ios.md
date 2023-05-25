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

[!INCLUDE [Public Preview](../../../../includes/public-preview-include-document.md)]

In this quickstart, you learn how to implement raw media access by using the Azure Communication Services Calling SDK for iOS.

The Azure Communication Services Calling SDK offers APIs that allow apps to generate their own video frames to send to remote participants in a call.

This quickstart builds on [Quickstart: Add 1:1 video calling to your app](../../get-started-with-video-calling.md?pivots=platform-ios) for iOS.


## Raw Audio Access 
Accessing raw audio media gives you access to the incoming call's audio stream, along with the ability to view and send custom outgoing audio streams during a call.

### Sending Raw Outgoing Audio

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

### Attach Stream to a call

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

### Capturing Microphone Samples

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

---
**NOTE**

The sample rate of the audio engine [input node](https://developer.apple.com/documentation/avfaudio/avaudioengine/1386063-inputnode) defaults to a value of the preferred sample rate for the shared audio session. So we can't install tap in that node using a different value. So we have to ensure that the `RawOutgoingStream`
properties sample rate matches the one we get from tap into microphone samples or convert the tap buffers to the format that 
matches what is expected on the outgoing stream.

---


With this small sample, we learned how we can capture the microphone [`AVAudioEngine`](https://developer.apple.com/documentation/avfaudio/avaudioengine) data and send those samples to a call using raw outgoing audio feature.

### Receiving Raw Incoming Audio

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

   When multiple formats are provided, the order of the formats in the list doesn't influence or prioritize which one is selected. The criteria for format selection are based on external factors like network bandwidth.

    ```swift
    let videoFormats: [VideoFormat] = []

    let videoFormat = VideoFormat()
    videoFormat.width = 1280
    videoFormat.height = 720
    videoFormat.pixelFormat = .nv12
    videoFormat.videoFrameKind = .videoSoftware
    videoFormat.framesPerSecond = 30
    videoFormat.stride1 = 1280
    videoFormat.stride2 = 1280

    videoFormats.append(videoFormat)
    ```

2. Create `RawOutgoingVideoStreamOptions`, and set `VideoFormats` with the previously created object.

    ```swift
    var options = RawOutgoingVideoStreamOptions()
    options.videoFormats = videoFormats
    ```

3. Implement the `RawOutgoingVideoStreamOptionsDelegate` delegate. This delegate observes changes to the current stream state and the frame sender. Don't send frames if the state isn't equal to `OutgoingVideoStreamState.started`.

   Remember to set `options.delegate` for the class, which implements it. This example uses `self`.

    ```swift
    options.delegate = self
    ```

    ```swift 
    var outgoingVideoStreamState: OutgoingVideoStreamState = .none

    func rawOutgoingVideoStreamOptions(_ options: RawOutgoingVideoStreamOptions, 
                                        didChangeOutgoingVideoStreamState args: OutgoingVideoStreamStateChangedEventArgs) {
        outgoingVideoStreamState = args.outgoingVideoStreamState
    }
    ```

4. Make sure the `didChangeOutgoingVideoStreamState` delegate is also implemented. This delegate informs the listener about events that require the app to start or stop producing video frames.

   This quickstart uses `mediaFrameSender` as a trigger to let the app know when it's time to start generating frames. Feel free to use any mechanism in your app as a trigger.

    ```swift
    var frameSender: VideoFrameSender?

    func rawOutgoingVideoStreamOptions(_ rawOutgoingVideoStreamOptions: RawOutgoingVideoStreamOptions,
                                       didChangeVideoFrameSender args: VideoFrameSenderChangedEventArgs) {
        self.frameSender = args.videoFrameSender        
    }
    ```

5. Create an instance of `VirtualRawOutgoingVideoStream` by using the `RawOutgoingVideoStreamOptions` instance that you created previously.

    ```swift
    let virtualRawOutgoingVideoStream = VirtualRawOutgoingVideoStream(videoStreamOptions: options)
    ```

6. After `outgoingVideoStreamState` is equal to `OutgoingVideoStreamState.started` and you receive a `VideoFrameSender` instance on the previous delegate, cast `VideoFrameSender` to the appropriate type defined by the `VideoFrameKind` property of `VideoFormat`.

   For example, for `.videoSoftware`, cast `VideoFrameSender` to `SoftwareBasedVideoFrameSender`. Then, you're able to use the `send` method to pass the frame that you want to send in a format defined by the `VideoFormat` instance that you specified in the first step.

   First, produce the frame.

   ```swift
   protocol FrameProducerProtocol {
       func nextFrame(for format: VideoFormat) -> CVImageBuffer
   }

   // Produces random gray stripes.
   final class GrayLinesFrameProducer: FrameProducerProtocol {
       var buffer: CVPixelBuffer? = nil
       private var currentFormat: VideoFormat?

       func nextFrame(for format: VideoFormat) -> CVImageBuffer {
           let bandsCount = Int.random(in: 10..<25)
           let bandThickness = Int(format.height * format.width) / bandsCount
    
           let currentFormat = self.currentFormat ?? format
           let bufferSizeChanged = currentFormat.width != format.width ||
                                currentFormat.height != format.height ||
                                currentFormat.stride1 != format.stride1 

           let newBuffer = buffer == nil || bufferSizeChanged
           if newBuffer {
               // Make ARC release previous reusable buffer
               self.buffer = nil
               let attrs = [
                   kCVPixelBufferBytesPerRowAlignmentKey: Int(format.stride1)
               ] as CFDictionary
               guard CVPixelBufferCreate(kCFAllocatorDefault, Int(format.width), Int(format.height), 
                                         kCVPixelFormatType_420YpCbCr8BiPlanarFullRange, attrs, &buffer) == kCVReturnSuccess else {
                   fatalError()
               }
           }

           self.currentFormat = format
           guard let frameBuffer = buffer else {
               fatalError()
           }
        
           CVPixelBufferLockBaseAddress(frameBuffer, .readOnly)
           defer {
               CVPixelBufferUnlockBaseAddress(frameBuffer, .readOnly)
           }

           // Fill NV12 Y plane with different luminance for each band.
           var begin = 0
           guard let yPlane = CVPixelBufferGetBaseAddressOfPlane(frameBuffer, 0) else {
               fatalError()
           }
           for _ in 0..<bandsCount {
               let luminance = Int32.random(in: 100..<255)
               memset(yPlane + begin, luminance, bandThickness)
               begin += bandThickness
           }
        
           if newBuffer {
               guard let uvPlane = CVPixelBufferGetBaseAddressOfPlane(frameBuffer, 1) else {
                   fatalError()
               }
               memset(uvPlane, 128, Int((format.height * format.width) / 2))
           }
        
           return frameBuffer
       }
   }
   ```

7. Now you can start sending the frames at the rate that you specified in the format.

   ```swift
   final class RawOutgoingVideoSender: NSObject {
       var frameSender: VideoFrameSender?
       let frameProducer: FrameProducerProtocol
       var rawOutgoingStream: RawOutgoingVideoStream!
    
       private var lock: NSRecursiveLock = NSRecursiveLock()

       private var timer: Timer?
       private var syncSema = DispatchSemaphore?
       private(set) weak var call: Call?
       private var running: Bool = false
       private let frameQueue: DispatchQueue = DispatchQueue(label: "org.microsoft.frame-sender")
       private let log = OSLog(subsystem: Bundle.main.bundleIdentifier!, category: "RawOutgoingVideoSender")

       private var options: RawOutgoingVideoStreamOptions!
       private var outgoingVideoStreamState: OutgoingVideoStreamState = .none

       init(frameProducer: FrameProducerProtocol) {
           self.frameProducer = frameProducer
           super.init()
           options = RawOutgoingVideoStreamOptions()
           options.delegate = self
           options.videoFormats = [videoFormat] // Video format we specified on step 1.
           self.rawOutgoingStream = VirtualRawOutgoingVideoStream(videoStreamOptions: options)
       }
  
       func startSending(to call: Call) {
           self.call = call
           self.startRunning()
           self.call?.startVideo(stream: rawOutgoingStream) { error in
               // Stream sending started.
           }
       }
    
       func stopSending() {
           self.stopRunning()
           call?.stopVideo(stream: rawOutgoingStream) { error in
               // Stream sending stopped.
           }
       }
    
       private func startRunning() {
           lock.lock(); defer { lock.unlock() }

           self.running = true
           if frameSender != nil {
               self.startFrameGenerator()
           }
       }
    
       private func startFrameGenerator() {
           guard let sender = self.frameSender else {
               return
           }

           // How many times per second, based on sender format FPS.
           let interval = TimeInterval((1 as Float) / sender.videoFormat.framesPerSecond)
           frameQueue.async { [weak self] in
               self?.timer = Timer.scheduledTimer(withTimeInterval: interval, repeats: true) { [weak self] _ in
                   guard let self = self, let sender = self.frameSender else {
                       return
                   }

                   let planeData = self.frameProducer.nextFrame(for: sender.videoFormat)
                   self.send(with: sender, frame: planeData)
               }
               RunLoop.current.run()
               self?.timer?.fire()
           }
       }
    
       private func sendSync(with sender: VideoFrameSender, frame: CVImageBuffer) {
           guard let softwareSender = sender as? SoftwareBasedVideoFrameSender else {
              return
           }
           // Ensure that a frame will not be sent before another finishes.
           syncSema = DispatchSemaphore(value: 0)
           softwareSender.send(frame: frame, timestampInTicks: sender.timestampInTicks) { [weak self] confirmation, error in
               self?.syncSema?.signal()
               guard let self = self else { return }
               if let confirmation = confirmation {
                   // Can check if confirmation was successful using `confirmation.status`
               } else if let error = error {
                   // Can check details about error in case of failure.
               }
           }
           syncSema?.wait()
       }

       private func stopRunning() {
           lock.lock(); defer { lock.unlock() }

           running = false
           stopFrameGeneration()
       }

       private func stopFrameGeneration() {
           lock.lock(); defer { lock.unlock() }
           timer?.invalidate()
           timer = nil
       }
    
       deinit {
           timer?.invalidate()
           timer = nil
       }
   }

   extension RawOutgoingVideoSender: RawOutgoingVideoStreamOptionsDelegate {
       func rawOutgoingVideoStreamOptions(_ rawOutgoingVideoStreamOptions: RawOutgoingVideoStreamOptions, 
                                          didChangeOutgoingVideoStreamState args: OutgoingVideoStreamStateChangedEventArgs) {
           outgoingVideoStreamState = args.outgoingVideoStreamState
       }

       func rawOutgoingVideoStreamOptions(_ rawOutgoingVideoStreamOptions: RawOutgoingVideoStreamOptions,
                                          didChangeVideoFrameSender args: VideoFrameSenderChangedEventArgs) {
           // Sender can change to start sending a more efficient format (given network conditions) of the ones specified 
           // in the list on the initial step. In that case, you should restart the sender.
           if running {
               stopRunning()
               self.frameSender = args.videoFrameSender
               startRunning()
           } else {
               sender = args.videoFrameSender
           }
       }
   }
   ```

8. Create a sender with a `FrameProducer` instance, and you can start sending frames to a call.

    ```swift
    var call: Call?
    var outgoingVideoSender: RawOutgoingVideoSender? 
    var sendingRawVideo: Bool = false

    func toggleSendingRawOutgoingVideo() {
        guard let call = call else {
            return
        }
        if sendingRawVideo {
            outgoingVideoSender?.stopSending()
            outgoingVideoSender = nil
        } else {
            let producer = GrayLinesFrameProducer()
            outgoingVideoSender = RawOutgoingVideoSender(frameProducer: producer)
            outgoingVideoSender?.startSending(to: call)
        }
        sendingRawVideo.toggle()
    }
    ```

## Overview of screen share video streams

Repeat steps 1 to 5 from the previous [Steps to create a virtual video stream](#steps-to-create-a-virtual-video-stream) procedure.

For screen sharing, you're still going to use the same sender, but you use a different `VideoStream` and `FrameProducer` instance.

You use Apple's `ReplayKit` framework to capture the frames to send to the call.

### Supported video resolutions

| Aspect ratio | Resolution  | Maximum FPS  |
| :--: | :-: | :-: |
| Anything | Anything less than 1920×1080 | 30 |

### Steps to create a screen share video stream

1. The format now is the screen bounds.

    ```swift
    let videoFormats: [VideoFormat] = []

    let videoFormat = VideoFormat()
    videoFormat.width = Int32(UIScreen.main.nativeBounds.width)
    videoFormat.height = Int32(UIScreen.main.nativeBounds.height)
    videoFormat.pixelFormat = .nv12 
    videoFormat.videoFrameKind = .videoSoftware
    videoFormat.framesPerSecond = 30
    videoFormat.stride1 = Int32(UIScreen.main.nativeBounds.width)
    videoFormat.stride2 = Int32(UIScreen.main.nativeBounds.width)

    videoFormats.append(videoFormat)
    ```

2. Instead of `VirtualRawOutgoingVideoStream`, create an instance of `ScreenShareRawOutgoingVideoStream` by using the `RawOutgoingVideoStreamOptions` instance that you created previously.

    ```swift
    screenShareRawOutgoingVideoStream = ScreenShareRawOutgoingVideoStream(videoStreamOptions: options)
    ```

3. Import a module and start a screen recording.

   ```swift
   import ReplayKit

   final class ScreenSharingProducer: FrameProducerProtocol {
       private var sampleBuffer: CMSampleBuffer?
       let lock = NSRecursiveLock()

       // Invoked when producer receives the first frame from ReplayKit.
       var onReadyCallback: (() -> Void)?
    
       // CMSSampleBuffer we get from ReplayKit produces Y and UV 4:2:0 planes data.
       func nextFrame(for format: VideoFormat) -> CVImageBuffer {
           lock.lock(); defer { lock.unlock() }
           guard let sampleBuffer = sampleBuffer, let frameBuffer = CMSampleBufferGetImageBuffer(sampleBuffer) else {
               fatalError()
           }
           return frameBuffer
       }

       func startRecording() {
           // Start a recording of the screen with ReplayKit.
           RPScreenRecorder.shared().startCapture { [weak self] sampleBuffer, type, error in
               guard type == .video, error == nil else { return }
               guard let self = self else { return }

               self.lock.lock()
               let isFirstFrame = self.sampleBuffer == nil
               if isFirstFrame {
                   self.onReadyCallback?()
                   self.onReadyCallback = nil
               }
               self.sampleBuffer = sampleBuffer
               self.lock.unlock()
           }
       }

       func stopRecording() {
           guard RPScreenRecorder.shared().isRecording else {
               return
           }
           RPScreenRecorder.shared().stopCapture()
       }
    
       deinit {
           stopRecording()
       }
   }
   ```

4. Create a `ScreenSharingProducer` instance so that when the recorder starts to produce frames, you can send them.

    ```swift
    var call: Call?
    var outgoingVideoSender: RawOutgoingVideoSender? 
    var sendingScreenShare: Bool = false
    var screenShareProducer: ScreenSharingProducer?
    func toggleSendingScreenShareOutgoingVideo() {
        guard let call = call else {
            return
        }

        if sendingScreenShare {
            screenShareProducer?.stopRecording()
            outgoingVideoSender?.stopSending()
            outgoingVideoSender = nil
            screenShareProducer = nil 
        } else {
            screenShareProducer = ScreenSharingProducer()
            screenShareProducer?.onReadyCallback = { [weak self] in
                guard let producer = self?.screenShareProducer else { return }
                outgoingVideoSender = RawOutgoingVideoSender(frameProducer: producer)
                outgoingVideoSender?.startSending(to: call)
            }
            screenShareProducer?.startRecording()
        }
        sendingScreenShare.toggle()
    }
    ```
