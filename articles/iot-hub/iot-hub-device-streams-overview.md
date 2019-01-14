---
title: Azure IoT Hub device streams | Microsoft Docs
description: Overview of IoT Hub device streams.
author: rezasherafat
manager: briz
services: iot-hub
ms.service: iot-hub
ms.topic: conceptual
ms.date: 01/15/2019
ms.author: rezas
---

# IoT Hub Device Streams

## Overview
Azure IoT Hub *device streams* facilitate the creation of secure bi-directional TCP tunnels for a variety of cloud-to-device communication scenarios. A device stream is mediated by an IoT Hub *streaming endpoint* which acts as a proxy between your device and service endpoints. This setup is depicted in the diagram below, which is espcially useful when devices are behind a network firewall or reside inside of a private network. As such, IoT Hub device streams help address customers' need to reach IoT devices in a firewall-friendly manner and without the need to broadly opening up incoming or outgoing network firewall ports.

<p align="center">
<img src="./media/iot-hub-device-streams-blog/iot-hub-device-streams-overview.png">
</p>

Using IoT Hub device streams, devices remain secure and will only need to open up outbound TCP connections to IoT hub's streaming endpoint over port 443. Once a stream is established, the service-side and device-side applications will each have programmatic access to a WebSocket client object to send and receive raw byte to one another. The reliability and ordering guarantees provided by this tunnel is on par with TCP.

## Benefits
IoT Hub device streams provide the following benefits:
- **Firewall-friendly secure connectivity:** IoT devices can be reached from service endpoints without opening of inbound firewall port at the device or network perimeters (only outbound connectivity to IoT Hub is needed over port 443).

- **Authentication:** Both device and service sides of the tunnel need to authenticate with IoT Hub using their corresponding credentials.

- **Encryption:** By default, IoT Hub device streams use TLS-enabled connections. This ensures that the traffic is always encrypted regardless of whether the application uses encryption or not.

- **Simplicity of connectivity:** The use of device streams eliminates the need for complex setup of Virtual Private Networks to enable connectivity to IoT devices.

- **Compatibility with TCP/IP stack:** IoT Hub device streams can accommodate TCP/IP application traffic. This means that a wide range of proprietary as well as standards-based protocols can leverage this feature.

- **Ease of use in private network setups:** Service can reach a device by referencing its device ID, rather than IP address. This is useful in situations where a device is located inside a private network and has a private IP address, or its IP address is assigned dynamically and is unknown to the service side.

## Device Stream Workflows
A device stream is initiated when the service requests to connect to a device by providing its device ID. This workflow particularly fits into client/server communication pattern, including SSH and RDP where a user intends to remotely connect to the SSH or RDP server running on the device using an SSH or RDP client program.

The device stream creation process involves a negotiation between the device, service, IoT hub's main and streaming endpoints. While IoT hub's main endpoint orchestrates the creation of a device stream, the streaming endpoint handles the traffic that flows between the service and device.

### Device stream creation flow
Programmatic creation of a device stream using the SDK involves the following steps, which are also depicted in the figure below:
<p align="center"> 
  <img src="./media/iot-hub-device-streams-blog/iot-hub-device-streams-handshake.png">
</p>

1. The device aplication registers a callback in advance to be notified of when a new device stream is initiated to the device. This step typically takes place when the device boots up and connects to IoT Hub.

2. The service-side program initiates a device stream when needed by providing the device ID (_not_ the IP address).

3. IoT hub notifies the device-side program by invoking the callback registered in step 1. The device may accept or reject the stream initiation request. This logic can be specific to your application scenario. If the stream request is rejected by the device, IoT Hub informs the service accordingly; otherwise, the steps below follow.

4. The device creates a secure outbound TCP connection to the streaming endpoint over port 443 and upgrades the connection to a WebSocket. The URL of the streaming endpoint as well as the credentials to use to authenticate are both provided to the device by IoT Hub as part of the request sent in step 3.

5. The service is notified of the result of device accepting the stream and proceeds to create its own WebSocket to the streaming endpoint. Similarly, it receives the streaming endpoint URL and authentication information from IoT Hub.

In the handshake process above:
- The handshake process must complete within 60 seconds (step 2 through 5), otherwise the handshake would fail with a timeout and the service will be notified accordingly.

- After the stream creation flow above completes, the streaming endpoint will act as a proxy and will transfer traffic between the service and the device over their respective WebSockets.

- Device and service both need outbound connectivity to IoT Hub's main endpoint as well as the streaming endpoint over port 443. The URL of these endpoints is available on Overview tab on the IoT Hub's portal.

- The reliability and ordering guarantees of an established stream is on par with TCP.

- All connections to IoT Hub and streaming endpoint use TLS and are encrypted.

### Termination flow
An established stream terminates when either of the TCP connections to the gateway are disconnected (by the service or device). This can take place voluntarily by closing the WebSocket on either the device or service programs, or involuntarily in case of a network connectivity timeout or process failure. Upon termination of either device or service's connection to the streaming endpoint, the other TCP connection will also be (forcefully) terminated and the service and device are responsible to re-create the stream, if needed.

## SDK Availability
Two sides of each stream (on the device and service side) use the IoT Hub SDK to establish the tunnel. During public preview, customers can choose from the following SDK languages:
- The C and C# SDK's support device streams on the device side.

- The NodeJS and C# SDK support device streams on the service side.

## IoT Hub Device Stream Samples
We have included two samples to demonstrate the use of device streams by applications. The *echo* sample demonstrates programatic use of device streams (by calling the SDK API's). The *local proxy* sample, demonstrate the use of the SDK functionality to tunnel off-the-shelf application traffic (such as SSH, RDP, or web) through device streams.

### Echo Sample
The echo sample demonstrates programmatic use of device streams to send and receive bytes between service and device application. Use the links below to access the quickstart guides (you can use service and device programs in different languages, e.g., C device program can work with C# service program):

| SDK    | Service Program                                          | Device Program                                           |
|--------|----------------------------------------------------------|----------------------------------------------------------|
| C#     | [Link](iot-hub-device-streams-csharp-echo-quickstart.md) | [Link](iot-hub-device-streams-csharp-echo-quickstart.md) |
| NodeJS | [Link](iot-hub-device-streams-nodejs-echo-quickstart.md) | -                                                        |
| C      | -                                                        | [Link](iot-hub-device-streams-c-echo-quickstart.md)      |

### Local Proxy Sample (for SSH or RDP)
The local proxy sample demonstrates a way to enable tunneling of an existing application's traffic that involves communication between a client and a server program. This set up works for client/server protocols like SSH and RDP, where the service-side acts as a client (running SSH or RDP client programs), and the device-side acts as the server (running SSH daemon or RDP server programs). 

This section describes the use of device streams to enable the SSH scenarios to a device over device streams (the case for RDP or other client/server protocols are similar by using the protocol's corresponding port).

The setup leverages two *local proxy* programs shown in the figure below, namely *device-local proxy* and *service-local proxy*. The local proxies are responsible for performing the [device stream initiation handshake](#Device-stream-creation-flow) with IoT Hub, and  interacting with SSH client and SSH daemon using regular client/server socket programming.

<p align="center"> 
  <img src="./media/iot-hub-device-streams-blog/iot-hub-device-streams-ssh.png">
</p>

1. The user runs service-local proxy to initiate a device stream to the device.

2. The device accepts the stream initiation and the tunnel is established to IoT Hub's streaming endpoint (as discussed above).

3. The device-local proxy connects to the SSH daemon endpoint listening on port 22 on the device.

4. The service-local proxy listens on a designated port awaiting new SSH connections from the user (port 2222 used in the sample is an arbitrary port). The user points the SSH client to the service-local proxy port on localhost.

### Notes
- The above steps complete an end-to-end tunnel between the SSH client (on the right) to the SSH daemon (on the left). 

- The arrows in the figure indicate the direction in which connections are established between endpoints. Specifically, note that there is no inbound connections going to the device (this is often blocked by a firewall).

- The choice of using port `2222` on the service-local proxy is an arbitrary choice. The proxy can be configured to use any other available port.

- The choice of port `22` is procotocol-dependent and specific to SSH in this case. For the case of RDP, the port `3389` must be used. This can be configured in the provided sample programs.

Use the links below for instructions on how to run the local proxy programs in your language of choice. Similar to the echo sample, you can run device- and service-local proxies in different languages, as they are fully interoperable.

| SDK    | Service-Local Proxy                                       | Device-Local Proxy                                        |
|--------|-----------------------------------------------------------|-----------------------------------------------------------|
| C#     | [Link](iot-hub-device-streams-csharp-proxy-quickstart.md) | [Link](iot-hub-device-streams-csharp-proxy-quickstart.md) |
| NodeJS | [Link](iot-hub-device-streams-nodejs-proxy-quickstart.md) | -                                                         |
| C      | -                                                         | [Link](iot-hub-device-streams-c-proxy-quickstart.md)      |

## Next steps

Use the links below to learn more about device streams:

> [!div class="nextstepaction"]
> [Device streams tutorial](./tutorial-device-streams.md)
> [Try a device stream quickstart guide](/azure/iot-hub)

<iframe src="https://channel9.msdn.com/Shows/Internet-of-Things-Show/Azure-IoT-Hub-Device-Streams"/player?format=ny" width="960" height="540" allowFullScreen frameBorder="0"></iframe>

