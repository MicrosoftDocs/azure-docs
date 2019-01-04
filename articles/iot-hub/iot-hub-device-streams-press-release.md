# IoT Hub Device Streams Press Release


*January 14, 2019*

Today, we are announcing *IoT Hub device streams* to further improve the security of network-connected IoT devices. This feature extends IoT Hub's support beyond the traditional core areas of device telemetry and  management, and enables us to serve the connectivity needs of a broader spectrum of device applications including remote access, web, and file transfer, among others.
	 
An IoT hub device stream is a TLS-enabled data transport tunnel that proxies application traffic to and from devices through IoT Hub endpoints in the Azure cloud. As such establishing streaming tunnels to IoT devices only relies on outbound connectivity from the devices to IoT Hub. This eliminates the need to open inbound firewall ports on the devices or their network. As a result, IoT Hub device streams remain firewall-friendly and help significantly reduce devices' connectivity exposure to the public Internet.
	
Furthermore, IoT Hub device streams are general-purpose and compatible with TCP/IP-based applications. This enables customers, application developers and platform builders to leverage IoT Hub device streams as a building block to enable secure end-to-end connectivity to devices for their proprietary application protocols. Additionally, device streams also support a wide range of standards-based protocols including Remote Desktop Protocol (RDP), Secure Shell (SSH), and Web (HTTP/HTTPS), and File Transfer Protocol (FTP).
	
As an example, consider an IoT device or equipment deployed in a factory's local area network that needs to be accessed by operators from remote sites for maintenance or troubleshooting. Traditionally, this scenario necessitates the setup of a complex Virtual Private Network (VPN) or opening of the factory's network firewall to allow for direct inbound connections to the device. Using this feature, the device leverages its outbound connectivity to IoT Hub to also receive inbound connections. This enables remote access applications such as RDP or SSH to communicate with the device in a firewall-friendly manner. In particular, the devices' ports and network interfaces are not exposed to external threats on the Internet. Furthermore, authentication of both sides of the tunnel and encryption of its traffic are additional benefits provided by device streams.
	
During public preview, device steams will be available to IoT Hub instances created in Central US, and Central US EUAP regions. The service will be free of charge during preview and will allow for up-to 50 concurrent streams per Hub and 10 GB of aggregated transferred data per month. These caps will be relaxed when the feature becomes generally available.
	
To learn more, see device streams [documentation page](iot-hub-device-streams-overview.md) for feature information, or refer to [Azure pricing page](https://azure.microsoft.com/en-us/pricing/details/iot-hub/) for updates on pricing.

## FAQ
- **How much will IoT Hub device streams cost?**<br/>
  The final pricing for device streams will be announced when the feature is generally available. But as a general frame of reference, each unit of S1, S2, S3 SKU would provide sufficient streaming capacity to remotely access  100, 1000, and 10000 devices, respectively, for 1 hour per month per device. This available stream capacity can be used for other application scenarios such as file transfer, remote debugging, or your custom application protocols as well.