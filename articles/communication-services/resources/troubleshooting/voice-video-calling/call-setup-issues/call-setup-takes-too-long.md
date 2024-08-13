---
title: Call setup issues - The call setup takes too long
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Learn how to troubleshoot when the call setup takes too long.
author: sloanster
ms.author: micahvivion

services: azure-communication-services
ms.date: 04/10/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
---

# The call setup takes too long
When the user makes a call or accepts a call, multiple steps and messages are exchanged between the signaling layer and media transport.
If the call setup takes too long, it's often due to network issues.
Another factor that contributes to call setup delay is the stream acquisition delay, which is the time it takes for a browser to get the media stream.
Additionally, device performance can also affect call setup time. For example, a busy browser may take longer to schedule the API request, resulting in a longer call setup time.

## How to detect using the SDK
The application can calculate the delay between when the call is initiated and when it's connected.

## How to mitigate or resolve
If a user consistently experiences long call setup times, they should check their network for issues such as slow network speed, long round trip time, or high packet loss.
These issues can affect call setup time because the signaling layer uses a `TCP` connection, and factors such as retransmissions can cause delays.
Additionally, if the user suspects the delay comes from stream acquisition, they should check their devices. For example, they can choose a different audio input device.
If a user consistently experiences this issue and you're unable to determine the cause, you may consider filing a support ticket for further assistance.

### Check the duration of stream acquisition
The stream acquisition is part of the call setup flow. You can get this information from webrtc-internals page.
To access the page, open a new tab and enter edge://webrtc-internals (Edge) or chrome://webrtc-internals (Chrome).

:::image type="content" source="./media/get-user-media-duration.png" alt-text="Screenshot of getUserMedia requests.":::

Once you're on the webrtc-internals page, you can calculate the duration of the stream acquisition by comparing the timestamp of the getUserMedia call and the result. If the duration is abnormally long, you may need to check the devices.

### Check the duration of HTTP requests
You can also check the Network tab of the Developer tools to see the size of requests and how long they take to finish.
If the issue is due to the long duration of the signaling request, you should be able to see some requests taking very long time from the network trace.

If you need to file a support ticket, we may request the browser HAR file.
To learn how to collect a HAR file, see [Capture a browser trace for troubleshooting](../../../../../azure-portal/capture-browser-trace.md).
