---
title: Security architecture
description: Security architecture guidelines and considerations for Azure IoT solutions illustrated using the IoT reference architecture
author: dominicbetts
ms.service: iot
services: iot
ms.topic: conceptual
ms.date: 02/10/2023
ms.author: dobett
---

# Security architecture for IoT solutions

When you design and architect an IoT solution, it's important to understand the potential threats and include appropriate defenses. Understanding how an attacker might compromise a system helps you to make sure that the appropriate mitigations are in place from the start.

## Threat modeling

Microsoft recommends using a threat modeling process as part of your IoT solution design. If you're not familiar with threat modeling and the secure development lifecycle, see:

- [Threat modeling](https://www.microsoft.com/securityengineering/sdl/threatmodeling)
- [Secure development best practices on Azure](../security/develop/secure-dev-overview.md)
- [Getting started guide](../security/develop/threat-modeling-tool-getting-started.md)

## Security in IoT

It's helpful to divide your IoT architecture into several zones as part of the threat modeling exercise:

- Device
- Field gateway
- Cloud gateway
- Service

Each zone often has its own data and authentication and authorization requirements. You can also use zones to isolate damage and restrict the impact of low trust zones on higher trust zones.

Each zone is separated by a _trust boundary_, shown as the dotted red line in the following diagram. It represents a transition of data from one source to another. During this transition, the data could be subject to the following threats:

- Spoofing
- Tampering
- Repudiation
- Information disclosure
- Denial of service
- Elevation of privilege

To learn more, see the [STRIDE model](../security/develop/threat-modeling-tool-threats.md#stride-model).

:::image type="content" source="media/iot-security-architecture/iot-security-architecture-fig1.png" alt-text="A diagram that shows the  zones and trust boundaries in a typical IoT solution architecture." border="false":::

You can use STRIDE to model the threats to each component within each zone. The following sections elaborate on each of the components and specific security concerns and solutions that should be put into place.

The remainder of this article discusses the threats and mitigations for these zones and components in more detail.

## Device zone

The device environment is the space around the device where physical access and local network digital access to the device is feasible. A local network is assumed to be distinct and insulated from – but potentially bridged to – the public internet. The device environment includes any short-range wireless radio technology that permits peer-to-peer communication of devices. It doesn't include any network virtualization technology creating the illusion of such a local network. It doesn't include public operator networks that require any two devices to communicate across public network space if they were to enter a peer-to-peer communication relationship.

## Field gateway zone

A field gateway is a device, appliance, or general-purpose server computer software that acts as communication enabler and, potentially, as a device control system and device data processing hub. The field gateway zone includes the field gateway itself and all the devices attached to it. Field gateways act outside dedicated data processing facilities, are usually location bound, are potentially subject to physical intrusion, and have limited operational redundancy. A field gateway is typically a thing that an attacker could physically sabotage if they gained physical access.

A field gateway differs from a traffic router in that it has had an active role in managing access and information flow. The field gateway has two distinct surface areas. One faces the devices attached to it and represents the inside of the zone. The other faces all external parties and is the edge of the zone.

## Cloud gateway zone

A cloud gateway is a system that enables remote communication from and to devices or field gateways deployed in multiple sites. The cloud gateway typically enables a cloud-based control and data analysis system, or a federation of such systems. In some cases, a cloud gateway may immediately facilitate access to special-purpose devices from terminals such as tablets or phones. In the cloud gateway zone, operational measures prevent targeted physical access and aren't necessarily exposed to a public cloud infrastructure.  

A cloud gateway may be mapped into a network virtualization overlay to insulate the cloud gateway and all of its attached devices or field gateways from any other network traffic. The cloud gateway itself isn't a device control system or a processing or storage facility for device data; those facilities interface with the cloud gateway. The cloud gateway zone includes the cloud gateway itself along with all field gateways and devices directly or indirectly attached to it. The edge of the zone is a distinct surface area that all external parties communicate through.

## Services zone

A service in this context is any software component or module that interfaces with devices through a field or cloud gateway. A service can collect data from the devices and command and control those devices. A service is a mediator that acts under its identity towards gateways and other subsystems to:

- Store and analyze data
- Issue commands to devices based on data insights or schedules
- Expose information and control capabilities to authorized end users

## IoT devices

IoT devices are often special-purpose devices that range from simple temperature sensors to complex factory production lines with thousands of components inside them. Example IoT device capabilities include:

- Measuring and reporting environmental conditions
- Turning valves
- Controlling servos
- Sounding alarms
- Switching lights on or off

The purpose of these devices dictates their technical design and the available budget for their production and scheduled lifetime operation. The combination of these factors constrains the available operational energy budget, physical footprint, and available storage, compute, and security capabilities.

Things that can go wrong with an automated or remotely controlled IoT device include:

- Physical defects
- Control logic defects
- Willful unauthorized intrusion and manipulation.

The consequences of these failures could be severe such as destroyed production lots, buildings burnt down, or injury and death. Therefore, there's a high security bar for devices that make things move or that report sensor data that results in commands that cause things to move.

### Device control and device data interactions

Connected special-purpose devices have a significant number of potential interaction surface areas and interaction patterns, all of which must be considered to provide a framework for securing digital access to those devices. _Digital access_ refers to operations that are carried out through software and hardware rather than through direct physical access to the device. For example, physical access could be controlled by putting the device into a room with a lock on the door. While physical access can't be denied using software and hardware, measures can be taken to prevent physical access from leading to system interference.

As you explore the interaction patterns, look at _device control_ and _device data_ with the same level of attention. Device control refers to any information provided to a device with the intention of modifying its behavior. Device data refers to information that a device emits to any other party about its state and the observed state of its environment.

## Threat modeling for the Azure IoT reference architecture

This section uses the [Azure IoT reference architecture](/azure/architecture/reference-architectures/iot) to demonstrate how to think about threat modeling for IoT and how to address the threats identified:

:::image type="content" source="media/iot-security-architecture/iot-security-architecture-fig2.png" alt-text="Diagram that shows the Azure IoT reference architecture." border="false":::

The following diagram provides a simplified view of the reference architecture by using a data flow diagram model:

:::image type="content" source="media/iot-security-architecture/iot-security-architecture-fig3.png" alt-text="A data flow diagram derived from the Azure IoT reference architecture." border="false":::

The architecture separates the device and field gateway capabilities. This approach enables you to use more secure field gateway devices. Field gateway devices can communicate with the cloud gateway using secure protocols, which typically require greater processing power than a simple device, such as a thermostat, could provide on its own. In the **Azure Services Zone** in the diagram, the Azure IoT Hub service is the cloud gateway.

Based on the architecture outlined previously, the following sections show some threat modeling examples. The examples focus on the core elements of a threat model:

- Processes
- Communication
- Storage

### Processes

Here are some examples of threats in the processes category. The threats are categorized based on the STRIDE model:

**Spoofing**: An attacker may extract cryptographic keys from a device, either at the software or hardware level. The attacked then uses these keys to access the system from a different physical or virtual device by using the identity of the original device.

**Denial of Service**: A device can be rendered incapable of functioning or communicating by interfering with radio frequencies or cutting wires. For example, a surveillance camera that had its power or network connection intentionally knocked out can't report data, at all.

**Tampering**: An attacker may partially or wholly replace the software on the device. If the device's cryptographic keys are available to the attackers code, it can then use the identity of the device.

**Tampering**: A surveillance camera that's showing a visible-spectrum picture of an empty hallway could be aimed at a photograph of such a hallway. A smoke or fire sensor could be reporting someone holding a lighter under it. In either case, the device may be technically fully trustworthy towards the system, but it reports manipulated information.

**Tampering**: An attacker may use extracted cryptographic keys  to intercept and suppress data sent from the device and replace it with false data that's authenticated with the stolen keys.

**Information Disclosure**: If the device is running manipulated software, such manipulated software could potentially leak data to unauthorized parties.

**Information Disclosure**: An attacker may use extracted cryptographic keys to inject code into the communication path between the device and field gateway or cloud gateway to siphon off information.

**Denial of Service**: The device can be turned off or turned into a mode where communication isn't possible (which is intentional in many industrial machines).

**Tampering**: The device can be reconfigured to operate in a state unknown to the control system (outside of known calibration parameters) and thus provide data that can be misinterpreted

**Elevation of Privilege**: A device that does specific function can be forced to do something else. For example, a valve that is programmed to open half way can be tricked to open all the way.

**Spoofing/Tampering/Repudiation**: If not secured (which is rarely the case with consumer remote controls), an attacker can manipulate the state of a device anonymously. A good illustration is a remote control that can turn off any TV.

The following table shows example mitigations to these threats. The values in the threat column are abbreviations:

- Spoofing (S)
- Tampering (T)
- Repudiation (R)
- Information disclosure (I)
- Denial of service (D)
- Elevation of privilege (E)

| Component | Threat | Mitigation | Risk | Implementation |
| --- | --- | --- | --- | --- |
| Device |S |Assigning identity to the device and authenticating the device |Replacing device or part of the device with some other device. How do you know you're talking to the right device? |Authenticating the device, using Transport Layer Security (TLS) or IPSec. Infrastructure should support using pre-shared key (PSK) on those devices that can't handle full asymmetric cryptography. Use Azure AD, [OAuth](https://www.rfc-editor.org/pdfrfc/rfc6755.txt.pdf) |
|| TRID |Apply tamperproof mechanisms to the device, for example,  by making it hard to impossible to extract keys and other cryptographic material from the device. |The risk is if someone is tampering the device (physical interference). How are you sure, that device hasn't been tampered with. |The most effective mitigation is a trusted platform module (TPM). A TPM stores keys in special on-chip circuitry from which the keys can't be read, but can only be used for cryptographic operations that use the key. Memory encryption of the device. Key management for the device. Signing the code. |
|| E |Having access control of the device. Authorization scheme. |If the device allows for individual actions to be performed based on commands from an outside source, or even compromised sensors, it allows the attack to perform operations not otherwise accessible. |Having authorization scheme for the device |
| Field Gateway |S |Authenticating the Field gateway to Cloud Gateway (such as cert based, PSK, or Claim based.) |If someone can spoof Field Gateway, then it can present itself as any device. |TLS RSA/PSK, IPSec, [RFC 4279](https://tools.ietf.org/html/rfc4279). All the same key storage and attestation concerns of devices in general – best case is use TPM. 6LowPAN extension for IPSec to support Wireless Sensor Networks (WSN). |
|| TRID |Protect the Field Gateway against tampering (TPM) |Spoofing attacks that trick the cloud gateway thinking it's talking to field gateway could result in information disclosure and data tampering |Memory encryption, TPMs, authentication. |
|| E |Access control mechanism for Field Gateway | | |

### Communication

Here are some examples of threats in the communication category. The threats are categorized based on the STRIDE model:

**Denial of Service**: Constrained devices are generally under DoS threat when they actively listen for inbound connections or unsolicited datagrams on a network. An attacker can open many connections in parallel and either not service them or service them slowly, or flood the device with unsolicited traffic. In both cases, the device can effectively be rendered inoperable on the network.

**Spoofing, Information Disclosure**: Constrained devices and special-purpose devices often have one-for-all security facilities such as password or PIN protection. Sometimes they wholly rely on trusting the network, and grant access to information to any device is on the same network. If the network is protected by a shared key that gets disclosed, an attacker could control the device or observe the data it transmits.  

**Spoofing**: an attacker may intercept or partially override the broadcast and spoof the originator.

**Tampering**: An attacker may intercept or partially override the broadcast and send false information.

**Information Disclosure:** An attacker may eavesdrop on a broadcast and obtain information without authorization.

**Denial of Service:** An attacker may jam the broadcast signal and deny information distribution.

The following table shows example mitigations to these threats:

| Component | Threat | Mitigation | Risk | Implementation |
| --- | --- | --- | --- | --- |
| Device IoT Hub |TID |(D)TLS (PSK/RSA) to encrypt the traffic |Eavesdropping or interfering the communication between the device and the gateway |Security on the protocol level. With custom protocols, you need to figure out how to protect them. In most cases, the communication takes place from the device to the IoT Hub (device initiates the connection). |
| Device to Device |TID |(D)TLS (PSK/RSA) to encrypt the traffic. |Reading data in transit between devices. Tampering with the data. Overloading the device with new connections |Security on the protocol level (MQTT/AMQP/HTTP/CoAP. With custom protocols, you need to figure out how to protect them. The mitigation for the DoS threat is to peer devices through a cloud or field gateway and have them only act as clients towards the network. The peering may result in a direct connection between the peers after having been brokered by the gateway |
| External Entity Device |TID |Strong pairing of the external entity to the device |Eavesdropping the connection to the device. Interfering the communication with the device |Securely pairing the external entity to the device NFC/Bluetooth LE. Controlling the operational panel of the device (Physical) |
| Field Gateway Cloud Gateway |TID |TLS (PSK/RSA) to encrypt the traffic. |Eavesdropping or interfering the communication between the device and the gateway |Security on the protocol level (MQTT/AMQP/HTTP/CoAP). With custom protocols, you need to figure out how to protect them. |
| Device Cloud Gateway |TID |TLS (PSK/RSA) to encrypt the traffic. |Eavesdropping or interfering the communication between the device and the gateway |Security on the protocol level (MQTT/AMQP/HTTP/CoAP). With custom protocols, you need to figure out how to protect them. |

### Storage

The following table shows example mitigations to the storage threats:

| Component | Threat | Mitigation | Risk | Implementation |
| --- | --- | --- | --- | --- |
| Device storage |TRID |Storage encryption, signing the logs |Reading data from the storage, tampering with telemetry data. Tampering with queued or cached command control data. Tampering with configuration or firmware update packages while cached or queued locally can lead to OS and/or system components being compromised |Encryption, message authentication code (MAC), or digital signature. Where possible, strong access control through resource access control lists (ACLs) or permissions. |
| Device OS image |TRID | |Tampering with OS /replacing the OS components |Read-only OS partition, signed OS image, encryption |
| Field Gateway storage (queuing the data) |TRID |Storage encryption, signing the logs |Reading data from the storage, tampering with telemetry data, tampering with queued or cached command control data. Tampering with configuration or firmware update packages (destined for devices or field gateway) while cached or queued locally can lead to OS and/or system components being compromised |BitLocker |
| Field Gateway OS image |TRID | |Tampering with OS /replacing the OS components |Read-only OS partition, signed OS image, Encryption |

## See also

Read about IoT Hub security in [Control access to IoT Hub](../iot-hub/iot-hub-devguide-security.md) in the IoT Hub developer guide.