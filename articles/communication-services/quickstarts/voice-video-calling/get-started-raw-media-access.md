---
title: Quickstart - Add RAW media access to your app (Android)
titleSuffix: An Azure Communication Services quickstart
description: In this quickstart, you'll learn how to add raw media access calling capabilities to your app using Azure Communication Services.
author: LaithRodan 

ms.author: larodan
ms.date: 11/18/2021
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: calling
ms.custom: mode-other
---

# Raw media access

[!INCLUDE [Public Preview](../../includes/public-preview-include-document.md)]

In this quickstart, you'll learn how implement raw media access using the Azure Communication Services Calling SDK for Android.

## Outbound virtual video device

The Azure Communication Services Calling SDK offers APIs allowing apps to generate their own video frames to send to remote participants.

This quick start builds upon [QuickStart: Add 1:1 video calling to your app](./get-started-with-video-calling.md?pivots=platform-android) for Android.


## Overview

Once an outbound virtual video device is created, use DeviceManager to make a new virtual video device that behaves just like any other webcam connected to your computer or mobile phone.

Since the app will be generating the video frames, the app must inform the Azure Communication Services Calling SDK about the video formats the app is capable of generating. This is required to allow the Azure Communication Services Calling SDK to pick the best video format configuration given the network conditions at any giving time.

The app must register a delegate to get notified about when it should start or stop producing video frames. The delegate event will inform the app which video format is more appropriate for the current network conditions.

The following is an overview of the steps required to create an outbound virtual video device.

1. Create a `VirtualDeviceIdentification` with basic identification information for the new outbound virtual video device.

    ```java
    VirtualDeviceIdentification deviceId = new VirtualDeviceIdentification();
    deviceId.setId("QuickStartVirtualVideoDevice");
    deviceId.setName("My First Virtual Video Device");
    ```

2. Create an array of `VideoFormat` with the video formats supported by the app. It is fine to have only one video format supported, but at least one of the provided video formats must be of the `MediaFrameKind::VideoSoftware` type. When multiple formats are provided, the order of the format in the list does not influence or prioritize which one will be used. The selected format is based on external factors like network bandwidth.

    ```java
    ArrayList<VideoFormat> videoFormats = new ArrayList<VideoFormat>();

    VideoFormat format = new VideoFormat();
    format.setWidth(1280);
    format.setHeight(720);
    format.setPixelFormat(PixelFormat.RGBA);
    format.setMediaFrameKind(MediaFrameKind.VIDEO_SOFTWARE);
    format.setFramesPerSecond(30);
    format.setStride1(1280 * 4); // It is times 4 because RGBA is a 32-bit format.

    videoFormats.add(format);
    ```

3. Create `OutboundVirtualVideoDeviceOptions` and set `DeviceIdentification` and `VideoFormats` with the previously created objects.

    ```java
    OutboundVirtualVideoDeviceOptions m_options = new OutboundVirtualVideoDeviceOptions();

    // ...

    m_options.setDeviceIdentification(deviceId);
    m_options.setVideoFormats(videoFormats);
    ```

4. Make sure the `OutboundVirtualVideoDeviceOptions::OnFlowChanged` delegate is defined. This delegate will inform its listener about events requiring the app to start or stop producing video frames. In this quick start, `m_mediaFrameSender` is used as trigger to let the app know when it's time to start generating frames. Feel free to use any mechanism in your app as a trigger.

    ```java
    private MediaFrameSender m_mediaFrameSender;

    // ...

    m_options.addOnFlowChangedListener(virtualDeviceFlowControlArgs -> {
        if (virtualDeviceFlowControlArgs.getMediaFrameSender().getRunningState() == VirtualDeviceRunningState.STARTED) {
            // Tell the app's frame generator to start producing frames.
            m_mediaFrameSender = virtualDeviceFlowControlArgs.getMediaFrameSender();
        } else {
            // Tell the app's frame generator to stop producing frames.
            m_mediaFrameSender = null;
        }
    });
    ```

5. Use `DeviceManager::CreateOutboundVirtualVideoDevice` to create an outbound virtual video device. The returning `OutboundVirtualVideoDevice` should be kept alive as long as the app needs to keep acting as a virtual video device. It is ok to register multiple outbound virtual video devices per app.

    ```java
    private OutboundVirtualVideoDevice m_outboundVirtualVideoDevice;

    // ...

    m_outboundVirtualVideoDevice = m_deviceManager.createOutboundVirtualVideoDevice(m_options).get();
    ```

6. Tell device manager to use the recently created virtual camera on calls.

    ```java
    private LocalVideoStream m_localVideoStream;

    // ...

    for (VideoDeviceInfo videoDeviceInfo : m_deviceManager.getCameras())
    {
        String deviceId = videoDeviceInfo.getId();
        if (deviceId.equalsIgnoreCase("QuickStartVirtualVideoDevice")) // Same id used in step 1.
        {
            m_localVideoStream = LocalVideoStream(videoDeviceInfo, getApplicationContext());
        }
    }
    ```

7.  In a non-UI thread or loop in the app, cast the `MediaFrameSender` to the appropriate type defined by the `MediaFrameKind` property of `VideoFormat`. For example, cast it to `SoftwareBasedVideoFrame` and then call the `send` method according to the number of planes defined by the MediaFormat.
After that, create the ByteBuffer backing the video frame if needed. Then, update the content of the video frame. Finally, send the video frame to other participants with the `sendFrame` API.

    ```java
    java.nio.ByteBuffer plane1 = null;
    Random rand = new Random();
    byte greyValue = 0;

    // ...
    java.nio.ByteBuffer plane1 = null;
    Random rand = new Random();

    while (m_outboundVirtualVideoDevice != null) {
        while (m_mediaFrameSender != null) {
            if (m_mediaFrameSender.getMediaFrameKind() == MediaFrameKind.VIDEO_SOFTWARE) {
                SoftwareBasedVideoFrame sender = (SoftwareBasedVideoFrame) m_mediaFrameSender;
                VideoFormat videoFormat = sender.getVideoFormat();

                // Gets the timestamp for when the video frame has been created.
                // This allows better synchronization with audio.
                int timeStamp = sender.getTimestamp();

                // Adjusts frame dimensions to the video format that network conditions can manage.
                if (plane1 == null || videoFormat.getStride1() * videoFormat.getHeight() != plane1.capacity()) {
                    plane1 = ByteBuffer.allocateDirect(videoFormat.getStride1() * videoFormat.getHeight());
                    plane1.order(ByteOrder.nativeOrder());
                }

                // Generates random gray scaled bands as video frame.
                int bandsCount = rand.nextInt(15) + 1;
                int bandBegin = 0;
                int bandThickness = videoFormat.getHeight() * videoFormat.getStride1() / bandsCount;

                for (int i = 0; i < bandsCount; ++i) {
                    byte greyValue = (byte)rand.nextInt(254);
                    java.util.Arrays.fill(plane1.array(), bandBegin, bandBegin + bandThickness, greyValue);
                    bandBegin += bandThickness;
                }

                // Sends video frame to the other participants in the call.
                FrameConfirmation fr = sender.sendFrame(plane1, timeStamp).get();

                // Waits before generating the next video frame.
                // Video format defines how many frames per second app must generate.
                Thread.sleep((long) (1000.0f / videoFormat.getFramesPerSecond()));
            }
        }

        // Virtual camera hasn't been created yet.
        // Let's wait a little bit before checking again.
        // This is for demo only purposes.
        // Feel free to use a better synchronization mechanism.
        Thread.sleep(100);
    }
    ```
