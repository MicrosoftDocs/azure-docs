# Introducing IoT Hub Device Streams

In today's security-first digital age, ensuring secure connectivity to IoT devices is of paramount importance. A wide range of operational and maintenance scenarios in the IoT space rely on end-to-end device connectivity in order to enable users and services to interact with, login, troubleshoot, send or receive data from devices. Security and compliance with the organization's policies are therefore an essential ingredient across all these scenarios.

Azure IoT Hub device streams is a new PaaS service that addresses these needs by providing a foundation for secure end-to-end connectivity to IoT devices. Customers, application developers and third-party platform providers can leverage device streams to communicate securely with IoT devices that reside behind firewalls or are deployed inside of private networks. Furthermore, built-in compatibility with the TCP/IP stack makes device streams applicable to a wide range of applications involving both custom proprietary protocols as well standards-based protocols such as remote shell, web, file transfer and video streaming, among others.

At its core, an IoT Hub device stream is a data transfer tunnel that provides connectivity between two TCP/IP-enabled endpoints: one side of the tunnel is an IoT device and the other side is a customer endpoint that intends to communicate with the device (the latter is referred here as service endpoint). We have seen many setups where direct connectivity to a device is prohibited based on the organization's security policies and connectivity restrictions placed on its networks. These restrictions, while justified, frequently impact various legitimate scenarios that require connectivity to an IoT device. Examples of these scenarios include:
- An operator wishes to login to a device for inspection or maintenance. This commonly involves logging to the device using Secure Shell (SSH) for Linux and Remote Desktop Protocol (RDP) for windows. The device or network firewall configuration often block the operator's workstation from reaching the device.
- An operator needs to remotely access device's diagnostics portal for troubleshooting. Diagnostic portals are commonly in the form of a web server hosted on the device. A device's private IP or its firewall configuration may similarly block the user from interacting with the device's web server.
- An application developer needs to remotely retrieve logs and other runtime diagnostics information from a device's file system. Protocols commonly used for this purpose may include File Transfer Protocol (FTP) or Secure Copy (SCP), among others. Again, the firewall configurations typically restrict these types of traffic.


IoT Hub device streams address the end-to-end connectivity needs of the above scenarios by leveraging an IoT Hub cloud endpoint that acts as a proxy for application traffic exchanged between the device and service. This is depicted in the figure below and works as follows.
<p align="center"> 
  <img src="./media/iot-hub-device-streams-blog/iot-hub-device-streams-overview.png">
</p>

- Device and service endpoints each create separate outbound connections to an IoT Hub endpoint that acts as a proxy for the traffic being transmitted between them;
- IoT Hub endpoint will relay traffic packets from device to service and vice-versa. This establishes an end-to-end bi-directional tunnel through which device and service applications can communicate;
- The established tunnel through IoT Hub provides reliability, ordered packet delivery guarantees. Furthermore, the transfer of traffic through IoT Hub as an intermediary is masked from the applications, giving them the seamless experience of direct bi-direction communication that is on par with TCP.

## Benefits
IoT Hub device streams provide the following benefits:
- **Firewall-friendly secure connectivity:** IoT devices can be reached from service endpoints without opening of inbound firewall port at the device or network perimeters. All that is needed is the ability to create outbound connections to IoT Hub cloud endpoints over port 443 (devices that use IoT Hub SDK already maintain such a connection).
- **Authentication enforcement:** To establish a stream, both device and service endpoints need to authenticate with IoT Hub using their corresponding credentials. This enhances security of the device's communication layer, by ensuring that the identity of each side of the tunnel is verified prior to any communication taking place between them.
- **Encryption:** By default, IoT Hub device streams use TLS-enabled connections. This ensures that the application traffic is encrypted regardless of whether the application uses encryption or not.
- **Simplicity of connectivity:** The use of device streams eliminates the need for complex setup of Virtual Private Networks to enable connectivity to IoT devices. Furthermore, unlike VPN which give broad access to the entire network, device streams are point-to-point involving a single device and a single service at each side of the tunnel.
- **Compatibility with TCP/IP stack:** IoT Hub device streams can accommodate TCP/IP application traffic. This means that a wide range of proprietary as well as standards-based protocols can leverage this feature. This includes well established protocols such as Remote Desktop Protocol (RDP), Secure Shell (SSH), File Transfer Protocol (FTP), HTTP/REST, among many others.
- **Ease of use in private network setups:** Devices that are deployed inside of private networks can be reached without the need to assign publicly routable IP addresses to each device. Another similar case involves devices with dynamic IP assignment which might not be known by the service at all times. In both cases, device streams enable connectivity to a target device using its device ID (rather than IP address) as identifier.

As outlined above, IoT Hub device streams are particularly helpful when devices are placed behind a firewall or inside a private network (with no publicly reachable IP address). Next we review one such setup as a case study where direct connectivity to the device is restricted. 

## A case study: Remote device access
To further illustrate the applicability of device streams in real-world IoT scenarios, consider a setup involving equipment and machinery (i.e., IoT devices) on a factory floor that are connected to the factory's local area network. The LAN typically is connected to the internet through a network gateway or an HTTP proxy, and is protected by a firewall at the network boundary. In this setup, the firewall is configured based on the organizations security policies which may prohibit opening of certain firewall ports. For example, port 3389 used by Remote Desktop Protocol is often blocked. Therefore, users from outside of the network cannot access devices over this port.

While such a network setup is in widespread use, it introduces challenges to many common IoT scenarios. For example, if operators need to access equipment from outside of the LAN, the firewall may need to allow inbound connectivity on arbitrary ports used by the application. In the case of a windows machine that uses the RDP protocol, this comes at odds with the security policies that block port 3389.

Using device streams, the RDP traffic to target devices is tunneled through IoT Hub. Specifically, this tunnel is established over port 443 using outbound connections originating from device and service. As a result, there is no need to relax firewall policies in the factory network. In our quick start guides available in [C](./iot-hub-device-streams-c-proxy-quickstart.md), [C#](./iot-hub-device-streams-csharp-proxy-quickstart.md) and [NodeJS](./iot-hub-device-streams-csharp-nodejs-quickstart.md) languages, we have included instructions on how to leverage IoT Hub device streams to enable the RDP scenario. Other protocols, can use a similar approach by simply configuring their corresponding communication port.


## Next Steps
We are excited about the possibilities that can be enabled to communicate with IoT devices securely via IoT Hub device streams. Use the following links to learn more about this feature:
- [Device streams documentation page](./iot-hub-device-streams-overview.md)
- [Device streams tutorials page](./iot-hub-device-streams-tutorial.md)
- [IoT Show recording on Channel 9](https://channel9.msdn.com/)
- [Quickstart: Communicate with IoT devices using device streams (echo) (C#)](iot-hub-device-streams-csharp-echo-quickstart.md)
- [Quickstart: Communicate with IoT devices using device streams (echo) (NodeJS)](iot-hub-device-streams-nodejs-echo-quickstart.md)
- [Quickstart: Communicate with IoT devices using device streams (echo) (C)](iot-hub-device-streams-c-echo-quickstart.md)
- [Quickstart: SSH/RDP to your IoT device device streams (C#)](iot-hub-device-streams-nodejs-csharp-quickstart.md)
- [Quickstart: SSH/RDP to your IoT device device streams (NodeJS)](iot-hub-device-streams-nodejs-proxy-quickstart.md)
- [Quickstart: SSH/RDP to your IoT device using device streams (C)](iot-hub-device-streams-c-proxy-quickstart.md)