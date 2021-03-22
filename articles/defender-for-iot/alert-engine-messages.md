---
title: Alert types and descriptions
description: Review Defender for IoT Alert descriptions.
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 03/22/2021
ms.topic: how-to
ms.service: azure
---

# Defender for IoT Engine alerts

This article describes alerts that may be generated from the Defender for IoT engines. Alerts appear in the Alerts window, where you can manage the alert event. 

## Policy engine alerts

Policy engine alerts describe deviations from learned baseline network behavior.

| Title  | Description | Severity |
|--|--|--|
| Abnormal usage of MAC Addresses | A new source device was detected on the network but has not been authorized. | Minor |
| Beckhoff Software Changed | Firmware was updated on a source device. This may be authorized activity, for example a planned maintenance procedure. | Major |
| Database Login Failed | A failed login attempt was detected from a source device to a destination server. This might be the result of human error, but could also indicate a malicious attempt to compromise the server or data on it. | Major |
| Emerson ROC Firmware Version Changed | Firmware was updated on a source device. This may be authorized activity, for example a planned maintenance procedure. | Major |
| External address within the network communicated with Internet | A source device defined as part of your network is communicating with Internet addresses. The source is not authorized to communicate with Internet addresses. | Critical |
| Field Device Discovered Unexpectedly | A new source device was detected on the network but has not been authorized. | Major |
| Firmware Change Detected | Firmware was updated on a source device. This may be authorized activity, for example a planned maintenance procedure. | Major |
| Firmware Version Changed | Firmware was updated on a source device. This may be authorized activity, for example a planned maintenance procedure. | Major |
| Foxboro I/A Unauthorized Operation | New traffic parameters were detected. This parameter combination has not been authorized as learned traffic on your network. The following combination is unauthorized. | Major |
| FTP Login Failed | A failed login attempt was detected from a source device to a destination server. This might be the result of human error, but could also indicate a malicious attempt to compromise the server or data on it. | Major |
| Function Code Raised Unauthorized Exception | A source device (slave) returned an exception to a destination device (master). | Major |
| GOOSE Message Type Settings | Message (identified by protocol ID) settings were changed on a source device. | Warning |
| Honeywell Firmware Version Changed | Firmware was updated on a source device. This may be authorized activity, for example a planned maintenance procedure. | Major |
| Illegal HTTP Communication | New traffic parameters were detected. This parameter combination has not been authorized as learned traffic on your network. The following combination is unauthorized. | Major |
| Internet Access Detected | A source device defined as part of your network is communicating with Internet addresses. The source is not authorized to communicate with Internet addresses. | Major |
| Mitsubishi Firmware Version Changed | Firmware was updated on a source device. This may be authorized activity, for example a planned maintenance procedure. | Major |
| Modbus Address Range Violation | A master device requested access to a new slave memory address. | Major |
| Modbus Firmware Version Changed | Firmware was updated on a source device. This may be authorized activity, for example a planned maintenance procedure. | Major |
| New Activity Detected - CIP Class | New traffic parameters were detected. This parameter combination has not been authorized as learned traffic on your network. The following combination is unauthorized. | Major |
| New Activity Detected - CIP Class Service | New traffic parameters were detected. This parameter combination has not been authorized as learned traffic on your network. The following combination is unauthorized. | Major |
| New Activity Detected - CIP PCCC Command | New traffic parameters were detected. This parameter combination has not been authorized as learned traffic on your network. The following combination is unauthorized. | Major |
| New Activity Detected - CIP Symbol | New traffic parameters were detected. This parameter combination has not been authorized as learned traffic on your network. The following combination is unauthorized. | Major |
| New Activity Detected - EtherNet/IP I/O Connection | New traffic parameters were detected. This parameter combination has not been authorized as learned traffic on your network. The following combination is unauthorized. | Major |
| New Activity Detected - EtherNet/IP Protocol Command | New traffic parameters were detected. This parameter combination has not been authorized as learned traffic on your network. The following combination is unauthorized. | Major |
| New Activity Detected - GSM Message Code | New traffic parameters were detected. This parameter combination has not been authorized as learned traffic on your network. The following combination is unauthorized. | Major |
| New Activity Detected - LonTalk Command Codes | New traffic parameters were detected. This parameter combination has not been authorized as learned traffic on your network. The following combination is unauthorized. | Major |
| New Port Discovery | New traffic parameters were detected. This parameter combination has not been authorized as learned traffic on your network. The following combination is unauthorized. | Warning |
| New Activity Detected - LonTalk Network Variable | New traffic parameters were detected. This parameter combination has not been authorized as learned traffic on your network. The following combination is unauthorized. | Major |
| New Activity Detected - Ovation Data Request | New traffic parameters were detected. This parameter combination has not been authorized as learned traffic on your network. The following combination is unauthorized. | Major |
| New Activity Detected - Read/Write Command (AMS Index Group) | New traffic parameters were detected. This parameter combination has not been authorized as learned traffic on your network. The following combination is unauthorized. | Major |
| New Activity Detected - Read/Write Command (AMS Index Offset) | New traffic parameters were detected. This parameter combination has not been authorized as learned traffic on your network. The following combination is unauthorized. | Major |
| New Activity Detected - Unauthorized DeltaV Message Type | New traffic parameters were detected. This parameter combination has not been authorized as learned traffic on your network. The following combination is unauthorized. | Major |
| New Activity Detected - Unauthorized DeltaV ROC Operation | New traffic parameters were detected. This parameter combination has not been authorized as learned traffic on your network. The following combination is unauthorized. | Major |
| New Activity Detected - Unauthorized RPC Message Type | New traffic parameters were detected. This parameter combination has not been authorized as learned traffic on your network. The following combination is unauthorized. | Major |
| New Activity Detected - Unauthorized RPC Procedure Invocation | New traffic parameters were detected. This parameter combination has not been authorized as learned traffic on your network. The following combination is unauthorized. | Major |
| New Activity Detected - Using AMS Protocol Command | New traffic parameters were detected. This parameter combination has not been authorized as learned traffic on your network. The following combination is unauthorized. | Major |
| New Activity Detected - Using Siemens SICAM Command | New traffic parameters were detected. This parameter combination has not been authorized as learned traffic on your network. The following combination is unauthorized. | Major |
| New Activity Detected - Using Suitelink Protocol command | New traffic parameters were detected. This parameter combination has not been authorized as learned traffic on your network. The following combination is unauthorized. | Major |
| New Activity Detected - Using Suitelink Protocol sessions | New traffic parameters were detected. This parameter combination has not been authorized as learned traffic on your network. The following combination is unauthorized. | Major |
| New Activity Detected - Using Yokogawa VNetIP Command | New traffic parameters were detected. This parameter combination has not been authorized as learned traffic on your network. The following combination is unauthorized. | Major |
| New Asset Detected | A new source device was detected on the network but has not been authorized. | Major |
| New LLDP Device Configuration | A new source device was detected on the network but has not been authorized. | Major |
| New Port Discovery | New traffic parameters were detected. This parameter combination has not been authorized as learned traffic on your network. The following combination is unauthorized. | Warning |
| Omron FINS Unauthorized Command | New traffic parameters were detected. This parameter combination has not been authorized as learned traffic on your network. The following combination is unauthorized. | Major |
| S7 Plus PLC Firmware Changed | Firmware was updated on a source device. This may be authorized activity, for example a planned maintenance procedure. | Major |
| Sampled Values Message Type Settings | Message (identified by protocol ID) settings were changed on a source device. | Warning |
| Suspicion of Illegal Integrity Scan | A scan was detected on a DNP3 source device (outstation). This scan was not authorized as learned traffic on your network. | Major |
| Toshiba Computer Link Unauthorized Command | New traffic parameters were detected. This parameter combination has not been authorized as learned traffic on your network. The following combination is unauthorized. | Minor |
| Unauthorized ABB Totalflow File Operation | New traffic parameters were detected. This parameter combination has not been authorized as learned traffic on your network. The following combination is unauthorized. | Major |
| Unauthorized ABB Totalflow Register Operation | New traffic parameters were detected. This parameter combination has not been authorized as learned traffic on your network. The following combination is unauthorized. | Major |
| Unauthorized Access to Siemens S7 Data Block | A source device attempted to access a resource on another device. An access attempt to this resource between these two devices has not been authorized as learned traffic on your network. | Warning |
| Unauthorized Access to Siemens S7 Plus Object | New traffic parameters were detected. This parameter combination has not been authorized as learned traffic on your network. The following combination is unauthorized. | Major |
| Unauthorized Access to Wonderware Tag | A source device attempted to access a resource on another device. An access attempt to this resource between these two devices has not been authorized as learned traffic on your network. | Major |
| Unauthorized BACNet Object Access | New traffic parameters were detected. This parameter combination has not been authorized as learned traffic on your network. The following combination is unauthorized. | Major |
| Unauthorized BACNet Route | New traffic parameters were detected. This parameter combination has not been authorized as learned traffic on your network. The following combination is unauthorized. | Major |
| Unauthorized Database Login | A login attempt between a source client and destination server was detected. Communication between these devices has not been authorized as learned traffic on your network. | Major |
| Unauthorized Database Operation | New traffic parameters were detected. This parameter combination has not been authorized as learned traffic on your network. The following combination is unauthorized. | Major |
| Unauthorized Emerson ROC Operation | New traffic parameters were detected. This parameter combination has not been authorized as learned traffic on your network. The following combination is unauthorized. | Major |
| Unauthorized GE SRTP File Access | New traffic parameters were detected. This parameter combination has not been authorized as learned traffic on your network. The following combination is unauthorized. | Major |
| Unauthorized GE SRTP Protocol Command | New traffic parameters were detected. This parameter combination has not been authorized as learned traffic on your network. The following combination is unauthorized. | Major |
| Unauthorized GE SRTP System Memory Operation | New traffic parameters were detected. This parameter combination has not been authorized as learned traffic on your network. The following combination is unauthorized. | Major |
| Unauthorized HTTP Activity | New traffic parameters were detected. This parameter combination has not been authorized as learned traffic on your network. The following combination is unauthorized. | Major |
| Unauthorized HTTP Server | An unauthorized application was detected on a source device. The application has not been authorized as a learned application on your network. | Major |
| Unauthorized HTTP SOAP Action | New traffic parameters were detected. This parameter combination has not been authorized as learned traffic on your network. The following combination is unauthorized. | Major |
| Unauthorized HTTP User Agent | An unauthorized application was detected on a source device. The application has not been authorized as a learned application on your network. | Major |
| Unauthorized Internet Connectivity Detected | A source device defined as part of your network is communicating with Internet addresses. The source is not authorized to communicate with Internet addresses. | Critical |
| Unauthorized Mitsubishi MELSEC Command | New traffic parameters were detected. This parameter combination has not been authorized as learned traffic on your network. The following combination is unauthorized. | Major |
| Unauthorized MMS Program Access | A source device attempted to access a resource on another device. An access attempt to this resource between these two devices has not been authorized as learned traffic on your network. | Major |
| Unauthorized MMS Service | New traffic parameters were detected. This parameter combination has not been authorized as learned traffic on your network. The following combination is unauthorized. | Major |
| Unauthorized Multicast/Broadcast Connection | A Multicast/Broadcast connection was detected between a source device and other devices. Multicast/Broadcast communication is not authorized. | Critical |
| Unauthorized Name Query | New traffic parameters were detected. This parameter combination has not been authorized as learned traffic on your network. The following combination is unauthorized. | Major |
| Unauthorized OPC UA Activity | New traffic parameters were detected. This parameter combination has not been authorized as learned traffic on your network. The following combination is unauthorized. | Major |
| Unauthorized OPC UA Request/Response | New traffic parameters were detected. This parameter combination has not been authorized as learned traffic on your network. The following combination is unauthorized. | Major |
| Unauthorized Operation was detected by a User Defined Rule | Traffic was detected between two devices. This activity is unauthorized based on a Custom Alert Rule defined by a user. | Major |
| Unauthorized PLC Configuration Read | The source device is not defined as a programming device but performed a read/write operation on a destination controller. Programming changes should only be performed by programming devices. A programming application may have been installed on this device. | Warning |
| Unauthorized PLC Configuration Write | The source device sent a command to read/write the program of a destination controller. This activity was not previously seen. | Major |
| Unauthorized PLC Program Upload | The source device sent a command to read/write the program of a destination controller. This activity was not previously seen. | Major |
| Unauthorized PLC Programming | The source device is not defined as a programming device but performed a read/write operation on a destination controller. Programming changes should only be performed by programming devices. A programming application may have been installed on this device. | Critical |
| Unauthorized Profinet Frame Type | New traffic parameters were detected. This parameter combination has not been authorized as learned traffic on your network. The following combination is unauthorized. | Major |
| Unauthorized SAIA S-Bus Command | New traffic parameters were detected. This parameter combination has not been authorized as learned traffic on your network. The following combination is unauthorized. | Major |
| Unauthorized Siemens S7 Execution of Control Function | New traffic parameters were detected. This parameter combination has not been authorized as learned traffic on your network. The following combination is unauthorized. | Major |
| Unauthorized Siemens S7 Execution of User Defined Function | New traffic parameters were detected. This parameter combination has not been authorized as learned traffic on your network. The following combination is unauthorized. | Major |
| Unauthorized Siemens S7 Plus Block Access | New traffic parameters were detected. This parameter combination has not been authorized as learned traffic on your network. The following combination is unauthorized. | Major |
| Unauthorized Siemens S7 Plus Operation | New traffic parameters were detected. This parameter combination has not been authorized as learned traffic on your network. The following combination is unauthorized. | Major |
| Unauthorized SMB Login | A login attempt between a source client and destination server was detected. Communication between these devices has not been authorized as learned traffic on your network. | Major |
| Unauthorized SNMP Operation | New traffic parameters were detected. This parameter combination has not been authorized as learned traffic on your network. The following combination is unauthorized. | Major |
| Unauthorized SSH Access | New traffic parameters were detected. This parameter combination has not been authorized as learned traffic on your network. The following combination is unauthorized. | Major |
| Unauthorized Windows Process | An unauthorized application was detected on a source device. The application has not been authorized as a learned application on your network. | Major |
| Unauthorized Windows Service | An unauthorized application was detected on a source device. The application has not been authorized as a learned application on your network. | Major |
| Unauthorized Operation was detected by a User Defined Rule | New traffic parameters were detected. This parameter combination violates a user defined rule | Major |
| Unpermitted Modbus Schneider Electric Extension | New traffic parameters were detected. This parameter combination has not been authorized as learned traffic on your network. The following combination is unauthorized. | Major |
| Unpermitted Usage of ASDU Types | New traffic parameters were detected. This parameter combination has not been authorized as learned traffic on your network. The following combination is unauthorized. | Major |
| Unpermitted Usage of DNP3 Function Code | New traffic parameters were detected. This parameter combination has not been authorized as learned traffic on your network. The following combination is unauthorized. | Major |
| Unpermitted Usage of Internal Indication (IIN) | A DNP3 source device (outstation) reported an internal indication (IIN) that has not authorized as learned traffic on your network. | Major |
| Unpermitted Usage of Modbus Function Code | New traffic parameters were detected. This parameter combination has not been authorized as learned traffic on your network. The following combination is unauthorized. | Major |

## Anomaly engine alerts

| Title | Description | Severity |
|--|--|--|
| Abnormal Exception Pattern in Slave | An excessive number of errors were detected on a source device. This may be the result of an operational issue. | Minor |
| Abnormal HTTP Header Length | The source device sent an abnormal message. This may indicate an attempt to attack the destination device. | Critical |
| Abnormal Number of Parameters in HTTP Header | The source device sent an abnormal message. This may indicate an attempt to attack the destination device. | Critical |
| Abnormal Periodic Behavior In Communication Channel | A change in the frequency of communication between the source and destination devices was detected. | Minor |
| Abnormal Termination of Applications | An excessive number of stop commands were detected on a source device. This may be the result of an operational issue or an attempt to manipulate the device. | Major |
| Abnormal Traffic Bandwidth | Abnormal bandwidth was detected on a channel. Bandwidth appears to be significantly lower/higher than previously detected. For details, work with the Total Bandwidth widget. | Warning |
| Abnormal Traffic Bandwidth Between Devices | Abnormal bandwidth was detected on a channel. Bandwidth appears to be significantly lower/higher than previously detected. For details, work with the Total Bandwidth widget. | Warning |
| Address Scan Detected | A source device was detected scanning network devices. This device has not been authorized as a network scanning device. | Critical |
| ARP Address Scan Detected | A source device was detected scanning network devices using Address Resolution Protocol (ARP). This device address has not been authorized as valid ARP scanning address. | Critical |
| ARP Address Scan Detected | A source device was detected scanning network devices using Address Resolution Protocol (ARP). This device address has not been authorized as valid ARP scanning address. | Critical |
| ARP Spoofing | An abnormal quantity of packets was detected in the network. This could indicate an attack, for example, an ARP spoofing or ICMP flooding attack. | Warning |
| Excessive Login Attempts | A source device was seen performing excessive login attempts to a destination server. This may be a brute force attack. The server may be compromised by a malicious actor. | Critical |
| Excessive Number of Sessions | A source device was seen performing excessive login attempts to a destination server. This may be a brute force attack. The server may be compromised by a malicious actor. | Critical |
| Excessive Restart Rate of an Outstation | An excessive number of restart commands were detected on a source device. This may be the result of an operational issue or an attempt to manipulate the device. | Major |
| Excessive SMB login attempts | A source device was seen performing excessive login attempts to a destination server. This may be a brute force attack. The server may be compromised by a malicious actor. | Critical |
| ICMP Flooding | An abnormal quantity of packets was detected in the network. This could indicate an attack, for example, an ARP spoofing or ICMP flooding attack. | Warning |
| Illegal HTTP Header Content | The source device initiated an invalid request. | Critical |
| Inactive Communication Channel | A communication channel between two devices was inactive during a period in which activity is usually seen. This might indicate that the program generating this traffic was changed, or the program might be unavailable. It is recommended to review the configuration of installed program and verify it is configured properly. | Warning |
| Long Duration Address Scan Detected | A source device was detected scanning network devices. This device has not been authorized as a network scanning device. | Critical |
| Password Guessing Attempt Detected | A source device was seen performing excessive login attempts to a destination server. This may be a brute force attack. The server may be compromised by a malicious actor. | Critical |
| PLC Scan Detected | A source device was detected scanning network devices. This device has not been authorized as a network scanning device. | Critical |
| Port Scan Detected | A source device was detected scanning network devices. This device has not been authorized as a network scanning device. | Critical |
| Unexpected message length | The source device sent an abnormal message. This may indicate an attempt to attack the destination device. | Critical |
| Unexpected Traffic for Standard Port | Traffic was detected on a device using a port reserved for another protocol. | Major |

## Protocol violation engine alerts

| Title | Description | Severity |
|--|--|--|
| Excessive Malformed Packets In a Single Session | An abnormal number of malformed packets sent from the source device to the destination device. This might indicate erroneous communications, or an attempt to manipulate the targeted device. | Major |
| Firmware Update | A source device sent a command to update firmware on a destination device. Verify that recent programming, configuration and  firmware upgrades made to the destination device are valid. | Warning |
| Function Code Not Supported by Outstation | The destination device received an invalid request. | Major |
| Illegal BACNet message | The source device initiated an invalid request. | Major |
| Illegal Connection Attempt on Port 0 | A source device attempted to connect to destination device on port number zero (0). For TCP, port 0 is reserved and cannot be used. For UDP, the port is optional and a value of 0 means no port. There is usually no service on a system that listens on port 0. This event may indicate an attempt to attack the destination device, or indicate that an application was programmed incorrectly. | Minor |
| Illegal DNP3 Operation | The source device initiated an invalid request. | Major |
| Illegal MODBUS Operation (Exception Raised by Master) | The source device initiated an invalid request. | Major |
| Illegal MODBUS Operation (Function Code Zero) | The source device initiated an invalid request. | Major |
| Illegal Protocol Version | The source device initiated an invalid request. | Major |
| Incorrect Parameter Sent to Outstation | The destination device received an invalid request. | Major |
| Initiation of an Obsolete Function Code (Initialize Data) | The source device initiated an invalid request. | Minor |
| Initiation of an Obsolete Function Code (Save Config) | The source device initiated an invalid request. | Minor |
| Master Requested an Application Layer Confirmation | The source device initiated an invalid request. | Warning |
| Modbus Exception | A source device (slave) returned an exception to a destination device (master). | Major |
| Slave Device Received Illegal ASDU Type | The destination device received an invalid request. | Major |
| Slave Device Received Illegal Command Cause of Transmission | The destination device received an invalid request. | Major |
| Slave Device Received Illegal Common Address | The destination device received an invalid request. | Major |
| Slave Device Received Illegal Data Address Parameter | The destination device received an invalid request. | Major |
| Slave Device Received Illegal Data Value Parameter | The destination device received an invalid request. | Major |
| Slave Device Received Illegal Function Code | The destination device received an invalid request. | Major |
| Slave Device Received Illegal Information Object Address | The destination device received an invalid request. | Major |
| Unknown Object Sent to Outstation | The destination device received an invalid request. | Major |
| Usage of a Reserved Function Code | The source device initiated an invalid request. | Major |
| Usage of Improper Formatting by Outstation | The source device initiated an invalid request. | Warning |
| Usage of Reserved Status Flags (IIN) | A DNP3 source device (outstation) used the reserved Internal Indicator 2.6. It is recommended to check the device's configuration. | Warning |

## Malware engine alerts

| Title | Description| Severity |
|--|--|--|
| Connection Attempt to Known Malicious IP | Suspicious network activity was detected. This activity may be associated with an attack exploiting a method used by known malware. | Major |
| Invalid SMB Message (DoublePulsar Backdoor Implant) | Suspicious network activity was detected. This activity may be associated with an attack exploiting a method used by known malware. | Critical |
| Malicious Domain Name Request | Suspicious network activity was detected. This activity may be associated with an attack exploiting a method used by known malware. | Major |
| Malware Test File Detected - EICAR AV Success | An EICAR AV test file was detected in traffic between two devices. The file is not malware. It is used to confirm that the antivirus software is installed correctly; demonstrate what happens when a virus is found, and check internal procedures and reactions when a virus is found. Antivirus software should detect EICAR as if it were a real virus. | Major |
| Suspicion of Conficker Malware | Suspicious network activity was detected. This activity may be associated with an attack exploiting a method used by known malware. | Major |
| Suspicion of Denial Of Service Attack | A source device attempted to initiate an excessive number of new connections to a destination device. This may be a Denial Of Service (DOS) attack against the destination device, and might interrupt device functionality, impact performance and service availability, or cause unrecoverable errors. | Critical |
| Suspicion of Malicious Activity | Suspicious network activity was detected. This activity may be associated with an attack exploiting a method used by known malware. | Major |
| Suspicion of Malicious Activity (BlackEnergy) | Suspicious network activity was detected. This activity may be associated with an attack exploiting a method used by known malware. | Critical |
| Suspicion of Malicious Activity (DarkComet) | Suspicious network activity was detected. This activity may be associated with an attack exploiting a method used by known malware. | Critical |
| Suspicion of Malicious Activity (Duqu) | Suspicious network activity was detected. This activity may be associated with an attack exploiting a method used by known malware. | Critical |
| Suspicion of Malicious Activity (Flame) | Suspicious network activity was detected. This activity may be associated with an attack exploiting a method used by known malware. | Critical |
| Suspicion of Malicious Activity (Havex) | Suspicious network activity was detected. This activity may be associated with an attack exploiting a method used by known malware. | Critical |
| Suspicion of Malicious Activity (Karagany) | Suspicious network activity was detected. This activity may be associated with an attack exploiting a method used by known malware. | Critical |
| Suspicion of Malicious Activity (LightsOut) | Suspicious network activity was detected. This activity may be associated with an attack exploiting a method used by known malware. | Critical |
| Suspicion of Malicious Activity (Name Queries) | Suspicious network activity was detected. This activity may be associated with an attack exploiting a method used by known malware. | Major |
| Suspicion of Malicious Activity (Poison Ivy) | Suspicious network activity was detected. This activity may be associated with an attack exploiting a method used by known malware. | Critical |
| Suspicion of Malicious Activity (Regin) | Suspicious network activity was detected. This activity may be associated with an attack exploiting a method used by known malware. | Critical |
| Suspicion of Malicious Activity (Stuxnet) | Suspicious network activity was detected. This activity may be associated with an attack exploiting a method used by known malware. | Critical |
| Suspicion of Malicious Activity (WannaCry) | Suspicious network activity was detected. This activity may be associated with an attack exploiting a method used by known malware. | Major |
| Suspicion of NotPetya Malware - Illegal SMB Parameters Detected | Suspicious network activity was detected. This activity may be associated with an attack exploiting a method used by known malware. | Critical |
| Suspicion of NotPetya Malware - Illegal SMB Transaction Detected | Suspicious network activity was detected. This activity may be associated with an attack exploiting a method used by known malware. | Critical |
| Suspicion of Remote Code Execution with PsExec | Suspicious network activity was detected. This activity may be associated with an attack exploiting a method used by known malware. | Major |
| Suspicion of Remote Windows Service Management | Suspicious network activity was detected. This activity may be associated with an attack exploiting a method used by known malware. | Major |
| Suspicious Executable File Detected on Endpoint | Suspicious network activity was detected. This activity may be associated with an attack exploiting a method used by known malware. | Major |
| Suspicious Traffic Detected | Suspicious network activity was detected. This activity may be associated with an attack exploiting a method used by known malware. | Critical |

## Operational engine alerts

| Title | Description | Severity |
|--|--|--|
| An S7 Stop PLC Command was Sent | The source device sent a stop command to a destination controller. The controller will stop operating until a start command is sent. | Warning |
| BACNet Operation Failed | A server returned an error code. This indicates a server error or an invalid request by a client. | Major |
| Bad MMS Device State | An MMS Virtual Manufacturing Device (VMD) sent a status message. The message indicates that the server may not be configured correctly, partially operational, or not operational at all. | Major |
| Change of Device Configuration | A configuration change was detected on a source device. | Minor |
| Continuous Event Buffer Overflow at Outstation | A buffer overflow event was detected on a source device. The event may cause data corruption, program crashes, or execution of malicious code. | Major |
| Controller Reset | A source device sent a reset command to a destination controller. The controller stopped operating temporarily and started again automatically. | Warning |
| Controller Stop | The source device sent a stop command to a destination controller. The controller will stop operating until a start command is sent. | Warning |
| Device Failed to Receive a Dynamic IP Address | The source device is configured to receive a dynamic IP address from a DHCP server but did not receive an address. This indicates a configuration error on the device, or an operational error in the DHCP server. It is recommended to notify the network administrator of the incident | Major |
| Device is Suspected to be Disconnected (Unresponsive) | A source device did not respond to a command sent to it. It may have been disconnected when the command was sent. | Major |
| EtherNet/IP CIP Service Request Failed | A server returned an error code. This indicates a server error or an invalid request by a client. | Major |
| EtherNet/IP Encapsulation Protocol Command Failed | A server returned an error code. This indicates a server error or an invalid request by a client. | Major |
| Event Buffer Overflow in Outstation | A buffer overflow event was detected on a source device. The event may cause data corruption, program crashes, or execution of malicious code. | Major |
| Expected Backup Operation Did Not Occur | Expected backup/file transfer activity did not occur between two devices. This may indicate errors in the backup / file transfer process. | Major |
| GE SRTP Command Failure | A server returned an error code. This indicates a server error or an invalid request by a client. | Major |
| GE SRTP Stop PLC Command was Sent | The source device sent a stop command to a destination controller. The controller will stop operating until a start command is sent. | Warning |
| GOOSE Control Block Requires Further Configuration | A source device sent a GOOSE message indicating that the device needs commissioning. This means the GOOSE control block requires further configuration and GOOSE messages are partially or completely non-operational. | Major |
| GOOSE Dataset Configuration was Changed | A message (identified by protocol ID) dataset was changed on a source device. This means the device will report a different dataset for this message. | Warning |
| Honeywell Controller Unexpected Status | A Honeywell Controller sent an unexpected diagnostic message indicating a status change. | Warning |
| HTTP Client Error | The source device initiated an invalid request. | Warning |
| Illegal IP Address | System detected traffic between a source device and IP address which is an invalid address. This may indicate wrong configuration or an attempt to generate illegal traffic. | Minor |
| Master-Slave Authentication Error | The authentication process between a DNP3 source device (master) and a destination device (outstation) failed. | Minor |
| MMS Service Request Failed | A server returned an error code. This indicates a server error or an invalid request by a client. | Major |
| No Traffic Detected on Sensor Interface | A sensor stopped detecting network traffic on a network interface. | Critical |
| OPC UA Server Raised an Event That Requires User's Attention | An OPC UA server sent an event notification to a client. This type of event requires user attention | Major |
| OPC UA Service Request Failed | A server returned an error code. This indicates a server error or an invalid request by a client. | Major |
| Outstation Restarted | A cold restart was detected on a source device. This means the device was physically turned off and back on again. | Warning |
| Outstation Restarts Frequently | An excessive number of cold restarts were detected on a source device. This means the device was physically turned off and back on again an excessive number of times. | Minor |
| Outstation's Configuration Changed | A configuration change was detected on a source device. | Major |
| Outstation's Corrupted Configuration Detected | This DNP3 source device (outstation) reported a corrupted configuration. | Major |
| Profinet DCP Command Failed | A server returned an error code. This indicates a server error or an invalid request by a client. | Major |
| Profinet Device Factory Reset | A source device sent a factory reset command to a Profinet destination device. The reset command clears Profinet device configurations and stops its operation. | Warning |
| RPC Operation Failed | A server returned an error code. This indicates a server error or an invalid request by a client. | Major |
| Sampled Values Message Dataset Configuration was Changed | A message (identified by protocol ID) dataset was changed on a source device. This means the device will report a different dataset for this message. | Warning |
| Slave Device Unrecoverable Failure | An unrecoverable condition error was detected on a source device. This kind of error usually indicates a hardware failure or failure to perform a specific command. | Major |
| Suspicion of Hardware Problems in Outstation | An unrecoverable condition error was detected on a source device. This kind of error usually indicates a hardware failure or failure to perform a specific command. | Major |
| Suspicion of Unresponsive MODBUS Device | A source device did not respond to a command sent to it. It may have been disconnected when the command was sent. | Minor |
| Traffic Detected on Sensor Interface | A sensor resumed detecting network traffic on a network interface. | Warning |

## Next steps

You can [Manage alert events](how-to-manage-the-alert-event.md).
Learn how to [Forward alert information](how-to-forward-alert-information-to-partners.md).
