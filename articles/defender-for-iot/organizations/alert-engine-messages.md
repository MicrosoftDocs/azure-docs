---
title: OT monitoring alert types and descriptions
description: Learn more about the alerts that are triggered for traffic on OT networks.
ms.date: 11/01/2022
ms.topic: reference
---

# OT monitoring alert types and descriptions

This article provides information on the alert types, descriptions, and severity that may be generated from the Defender for IoT engines. This information can be used to help map alerts into playbooks, define Forwarding rules, Exclusion rules, and custom alerts and define the appropriate rules within a SIEM. Alerts appear in the Alerts window, which allows you to manage the alert event.

### Alert news

New alerts may be added and existing alerts may be updated or disabled. Certain disabled alerts can be re-enabled from the **Support** page of the sensor console. Alerts that can be re-enabled are marked with an asterisk (*) in the tables below.

You may have configured newly disabled alerts in your Forwarding rules. If so, you may need to update related Defender for IoT Exclusion rules, or update SIEM rules and playbooks where relevant.

## Supported alert types

| Alert type | Description |
|-|-|
| **Policy violation alerts** | Triggered when the Policy Violation engine detects a deviation from traffic previously learned. For example: <br /> - A new device is detected.  <br /> - A new configuration is detected on a device. <br /> - A device not defined as a programming device carries out a programming change. <br /> - A firmware version changed. |
| **Protocol violation alerts** | Triggered when the Protocol Violation engine detects packet structures or field values that don't comply with the protocol specification. | 
| **Operational alerts** | Triggered when the Operational engine detects network operational incidents or a device malfunctioning. For example, a network device was stopped through a Stop PLC command, or an interface on a sensor stopped monitoring traffic. |
| **Malware alerts** | Triggered when the Malware engine detects malicious network activity. For example, the engine detects a known attack such as Conficker. |
| **Anomaly alerts** | Triggered when the Anomaly engine detects a deviation. For example, a device is performing network scans but isn't defined as a scanning device. |

## Supported alert categories

Each alert has one of the following categories:

:::row:::
   :::column span="":::
      - Abnormal Communication Behavior
      - Abnormal HTTP Communication Behavior
      - Authentication
      - Backup
      - Bandwidth Anomalies
      - Buffer overflow
      - Command Failures
      - Configuration changes
      - Custom Alerts
      - Discovery
      - Firmware change
      - Illegal commands
   :::column-end:::
   :::column span="":::
      - Internet Access
      - Operation Failures
      - Operational issues
      - Programming
      - Remote access
      - Restart/Stop Commands
      - Scan
      - Sensor traffic
      - Suspicion of malicious activity
      - Suspicion of Malware
      - Unauthorized Communication Behavior
      - Unresponsive
   :::column-end:::
:::row-end:::

## Policy engine alerts

Policy engine alerts describe detected deviations from learned baseline behavior.

| Title  | Description | Severity | Category |
|--|--|--|--|
| **Beckhoff Software Changed** | Firmware was updated on a source device.  This may be authorized activity, for example a planned maintenance procedure. | Major | Firmware Change |
| **Database Login Failed** | A failed sign-in attempt was detected from a source device to a destination server. This might be the result of human error, but could also indicate a malicious attempt to compromise the server or data on it. <br><br> Threshold: 2 sign-in failures in 5 minutes | Major | Authentication |
| **Emerson ROC Firmware Version Changed** | Firmware was updated on a source device. This may be authorized activity, for example a planned maintenance procedure. | Major | Firmware Change |
| **External address within the network communicated with Internet** | A source device defined as part of your network is communicating with Internet addresses. The source isn't authorized to communicate with Internet addresses. | Critical | Internet Access |
| **Field Device Discovered Unexpectedly** | A new source device was detected on the network but hasn't been authorized. | Major | Discovery |
| **Firmware Change Detected** | Firmware was updated on a source device. This may be authorized activity, for example a planned maintenance procedure. | Major | Firmware Change |
| **Firmware Version Changed** | Firmware was updated on a source device. This may be authorized activity, for example a planned maintenance procedure. | Major | Firmware Change |
| **Foxboro I/A Unauthorized Operation** | New traffic parameters were detected. This parameter combination hasn't been authorized as learned traffic on your network. The following combination is unauthorized. | Major | Unauthorized Communication Behavior |
| **FTP Login Failed** | A failed sign-in attempt was detected from a source device to a destination server.  This alert might be the result of human error, but could also indicate a malicious attempt to compromise the server or data on it. | Major | Authentication |
| **Function Code Raised Unauthorized Exception** | A source device (secondary) returned an exception to a destination device (primary). | Major | Command Failures |
| **GOOSE Message Type Settings** | Message (identified by protocol ID) settings were changed on a source device. | Warning | Unauthorized Communication Behavior |
| **Honeywell Firmware Version Changed** | Firmware was updated on a source device. This may be authorized activity, for example a planned maintenance procedure. | Major | Firmware Change |
| * **Illegal HTTP Communication** | New traffic parameters were detected. This parameter combination hasn't been authorized as learned traffic on your network. The following combination is unauthorized. | Major | Abnormal HTTP Communication Behavior |
| **Internet Access Detected** | A source device defined as part of your network is communicating with Internet addresses. The source isn't authorized to communicate with Internet addresses. | Major | Internet Access |
| **Mitsubishi Firmware Version Changed** | Firmware was updated on a source device. This may be authorized activity, for example a planned maintenance procedure. | Major | Firmware Change |
| **Modbus Address Range Violation** | A primary device requested access to a new secondary memory address. | Major | Unauthorized Communication Behavior |
| **Modbus Firmware Version Changed** | Firmware was updated on a source device. This may be authorized activity, for example a planned maintenance procedure. | Major | Firmware Change |
| **New Activity Detected - CIP Class** | New traffic parameters were detected. This parameter combination hasn't been authorized as learned traffic on your network. The following combination is unauthorized. | Major | Unauthorized Communication Behavior |
| **New Activity Detected - CIP Class Service** | New traffic parameters were detected. This parameter combination hasn't been authorized as learned traffic on your network. The following combination is unauthorized. | Major | Unauthorized Communication Behavior |
| **New Activity Detected - CIP PCCC Command** | New traffic parameters were detected. This parameter combination hasn't been authorized as learned traffic on your network. The following combination is unauthorized. | Major | Unauthorized Communication Behavior |
| **New Activity Detected - CIP Symbol** | New traffic parameters were detected. This parameter combination hasn't been authorized as learned traffic on your network. The following combination is unauthorized. | Major | Unauthorized Communication Behavior |
| **New Activity Detected - EtherNet/IP I/O Connection** | New traffic parameters were detected. This parameter combination hasn't been authorized as learned traffic on your network. The following combination is unauthorized. | Major | Unauthorized Communication Behavior |
| **New Activity Detected - EtherNet/IP Protocol Command** | New traffic parameters were detected. This parameter combination hasn't been authorized as learned traffic on your network. The following combination is unauthorized. | Major | Unauthorized Communication Behavior |
| **New Activity Detected - GSM Message Code** | New traffic parameters were detected. This parameter combination hasn't been authorized as learned traffic on your network. The following combination is unauthorized. | Major | Unauthorized Communication Behavior |
| **New Activity Detected - LonTalk Command Codes** | New traffic parameters were detected. This parameter combination hasn't been authorized as learned traffic on your network. The following combination is unauthorized. | Major | Unauthorized Communication Behavior |
| **New Port Discovery** | New traffic parameters were detected. This parameter combination hasn't been authorized as learned traffic on your network. The following combination is unauthorized. | Warning | Discovery |
| **New Activity Detected - LonTalk Network Variable** | New traffic parameters were detected. This parameter combination hasn't been authorized as learned traffic on your network. The following combination is unauthorized. | Major | Unauthorized Communication Behavior |
| **New Activity Detected - Ovation Data Request** | New traffic parameters were detected. This parameter combination hasn't been authorized as learned traffic on your network. The following combination is unauthorized. | Major | Unauthorized Communication Behavior |
| **New Activity Detected - Read/Write Command (AMS Index Group)** | New traffic parameters were detected. This parameter combination hasn't been authorized as learned traffic on your network. The following combination is unauthorized. | Major | Configuration Changes |
| **New Activity Detected - Read/Write Command (AMS Index Offset)** | New traffic parameters were detected. This parameter combination hasn't been authorized as learned traffic on your network. The following combination is unauthorized. | Major | Configuration Changes |
| **New Activity Detected - Unauthorized DeltaV Message Type** | New traffic parameters were detected. This parameter combination hasn't been authorized as learned traffic on your network. The following combination is unauthorized. | Major | Unauthorized Communication Behavior |
| **New Activity Detected - Unauthorized DeltaV ROC Operation** | New traffic parameters were detected. This parameter combination hasn't been authorized as learned traffic on your network. The following combination is unauthorized. | Major | Unauthorized Communication Behavior |
| **New Activity Detected - Unauthorized RPC Message Type** | New traffic parameters were detected. This parameter combination hasn't been authorized as learned traffic on your network. The following combination is unauthorized. | Major | Unauthorized Communication Behavior |
| **New Activity Detected - Using AMS Protocol Command** | New traffic parameters were detected. This parameter combination hasn't been authorized as learned traffic on your network. The following combination is unauthorized. | Major | Unauthorized Communication Behavior |
| **New Activity Detected - Using Siemens SICAM Command** | New traffic parameters were detected. This parameter combination hasn't been authorized as learned traffic on your network. The following combination is unauthorized. | Major | Unauthorized Communication Behavior |
| **New Activity Detected - Using Suitelink Protocol command** | New traffic parameters were detected. This parameter combination hasn't been authorized as learned traffic on your network. The following combination is unauthorized. | Major | Unauthorized Communication Behavior |
| **New Activity Detected - Using Suitelink Protocol sessions** | New traffic parameters were detected. This parameter combination hasn't been authorized as learned traffic on your network. The following combination is unauthorized. | Major | Unauthorized Communication Behavior |
| **New Activity Detected - Using Yokogawa VNetIP Command** | New traffic parameters were detected. This parameter combination hasn't been authorized as learned traffic on your network. The following combination is unauthorized. | Major | Unauthorized Communication Behavior |
| **New Asset Detected** | A new source device was detected on the network but hasn't been authorized. <br><br>This alert applies to devices discovered in OT subnets. New devices discovered in IT subnets don't trigger an alert.| Major | Discovery |
| **New LLDP Device Configuration** | A new source device was detected on the network but hasn't been authorized. | Major | Configuration Changes |
| **Omron FINS Unauthorized Command** | New traffic parameters were detected. This parameter combination hasn't been authorized as learned traffic on your network. The following combination is unauthorized. | Major | Unauthorized Communication Behavior |
| **S7 Plus PLC Firmware Changed** | Firmware was updated on a source device. This may be authorized activity, for example a planned maintenance procedure. | Major | Firmware Change |
| **Sampled Values Message Type Settings** | Message (identified by protocol ID) settings were changed on a source device. | Warning | Unauthorized Communication Behavior |
| **Suspicion of Illegal Integrity Scan** | A scan was detected on a DNP3 source device (outstation). This scan wasn't authorized as learned traffic on your network. | Major | Scan |
| **Toshiba Computer Link Unauthorized Command** | New traffic parameters were detected. This parameter combination hasn't been authorized as learned traffic on your network. The following combination is unauthorized. | Minor | Unauthorized Communication Behavior |
| **Unauthorized ABB Totalflow File Operation** | New traffic parameters were detected. This parameter combination hasn't been authorized as learned traffic on your network. The following combination is unauthorized. | Major | Unauthorized Communication Behavior |
| **Unauthorized ABB Totalflow Register Operation** | New traffic parameters were detected. This parameter combination hasn't been authorized as learned traffic on your network. The following combination is unauthorized. | Major | Unauthorized Communication Behavior |
| **Unauthorized Access to Siemens S7 Data Block** | A source device attempted to access a resource on another device. An access attempt to this resource between these two devices hasn't been authorized as learned traffic on your network. | Warning | Unauthorized Communication Behavior |
| **Unauthorized Access to Siemens S7 Plus Object** | New traffic parameters were detected. This parameter combination hasn't been authorized as learned traffic on your network. The following combination is unauthorized. | Major | Unauthorized Communication Behavior |
| **Unauthorized Access to Wonderware Tag** | A source device attempted to access a resource on another device. An access attempt to this resource between these two devices hasn't been authorized as learned traffic on your network. | Major | Unauthorized Communication Behavior |
| **Unauthorized BACNet Object Access** | New traffic parameters were detected. This parameter combination hasn't been authorized as learned traffic on your network. The following combination is unauthorized. | Major | Unauthorized Communication Behavior |
| **Unauthorized BACNet Route** | New traffic parameters were detected. This parameter combination hasn't been authorized as learned traffic on your network. The following combination is unauthorized. | Major | Unauthorized Communication Behavior |
| **Unauthorized Database Login** | A sign-in attempt between a source client and destination server was detected. Communication between these devices hasn't been authorized as learned traffic on your network. | Major | Authentication |
| **Unauthorized Database Operation** | New traffic parameters were detected. This parameter combination hasn't been authorized as learned traffic on your network. The following combination is unauthorized. | Major | Abnormal Communication Behavior |
| **Unauthorized Emerson ROC Operation** | New traffic parameters were detected. This parameter combination hasn't been authorized as learned traffic on your network. The following combination is unauthorized. | Major | Unauthorized Communication Behavior |
| **Unauthorized GE SRTP File Access** | New traffic parameters were detected. This parameter combination hasn't been authorized as learned traffic on your network. The following combination is unauthorized. | Major | Unauthorized Communication Behavior |
| **Unauthorized GE SRTP Protocol Command** | New traffic parameters were detected. This parameter combination hasn't been authorized as learned traffic on your network. The following combination is unauthorized. | Major | Unauthorized Communication Behavior |
| **Unauthorized GE SRTP System Memory Operation** | New traffic parameters were detected. This parameter combination hasn't been authorized as learned traffic on your network. The following combination is unauthorized. | Major | Unauthorized Communication Behavior |
| **Unauthorized HTTP Activity** | New traffic parameters were detected. This parameter combination hasn't been authorized as learned traffic on your network. The following combination is unauthorized. | Major | Abnormal HTTP Communication Behavior |
| * **Unauthorized HTTP SOAP Action** | New traffic parameters were detected. This parameter combination hasn't been authorized as learned traffic on your network. The following combination is unauthorized. | Major | Abnormal HTTP Communication Behavior |
| * **Unauthorized HTTP User Agent** | An unauthorized application was detected on a source device. The application hasn't been authorized as a learned application on your network. | Major | Abnormal HTTP Communication Behavior |
| **Unauthorized Internet Connectivity Detected** | A source device defined as part of your network is communicating with Internet addresses. The source isn't authorized to communicate with Internet addresses. | Critical | Internet Access |
| **Unauthorized Mitsubishi MELSEC Command** | New traffic parameters were detected. This parameter combination hasn't been authorized as learned traffic on your network. The following combination is unauthorized. | Major | Unauthorized Communication Behavior |
| **Unauthorized MMS Program Access** | A source device attempted to access a resource on another device. An access attempt to this resource between these two devices hasn't been authorized as learned traffic on your network. | Major | Programming |
| **Unauthorized MMS Service** | New traffic parameters were detected. This parameter combination hasn't been authorized as learned traffic on your network. The following combination is unauthorized. | Major | Unauthorized Communication Behavior |
| **Unauthorized Multicast/Broadcast Connection** | A Multicast/Broadcast connection was detected between a source device and other devices. Multicast/Broadcast communication isn't authorized. | Critical | Abnormal Communication Behavior |
| **Unauthorized Name Query** | New traffic parameters were detected. This parameter combination hasn't been authorized as learned traffic on your network. The following combination is unauthorized. | Major | Abnormal Communication Behavior |
| **Unauthorized OPC UA Activity** | New traffic parameters were detected. This parameter combination hasn't been authorized as learned traffic on your network. The following combination is unauthorized. | Major | Unauthorized Communication Behavior |
| **Unauthorized OPC UA Request/Response** | New traffic parameters were detected. This parameter combination hasn't been authorized as learned traffic on your network. The following combination is unauthorized. | Major | Unauthorized Communication Behavior |
| **Unauthorized Operation was detected by a User Defined Rule** | Traffic was detected between two devices. This activity is unauthorized, based on a Custom Alert Rule defined by a user. | Major | Custom Alerts |
| **Unauthorized PLC Configuration Read** | The source device isn't defined as a programming device but performed a read/write operation on a destination controller. Programming changes should only be performed by programming devices. A programming application may have been installed on this device. | Warning | Configuration Changes |
| **Unauthorized PLC Configuration Write** | The source device sent a command to read/write the program of a destination controller. This activity wasn't previously seen. | Major | Configuration Changes |
| **Unauthorized PLC Program Upload** | The source device sent a command to read/write the program of a destination controller. This activity wasn't previously seen. | Major | Programming |
| **Unauthorized PLC Programming** | The source device isn't defined as a programming device but performed a read/write operation on a destination controller. Programming changes should only be performed by programming devices. A programming application may have been installed on this device. | Critical | Programming |
| **Unauthorized Profinet Frame Type** | New traffic parameters were detected. This parameter combination hasn't been authorized as learned traffic on your network. The following combination is unauthorized. | Major | Unauthorized Communication Behavior |
| **Unauthorized SAIA S-Bus Command** | New traffic parameters were detected. This parameter combination hasn't been authorized as learned traffic on your network. The following combination is unauthorized. | Major | Unauthorized Communication Behavior |
| **Unauthorized Siemens S7 Execution of Control Function** | New traffic parameters were detected. This parameter combination hasn't been authorized as learned traffic on your network. The following combination is unauthorized. | Major | Unauthorized Communication Behavior |
| **Unauthorized Siemens S7 Execution of User Defined Function** | New traffic parameters were detected. This parameter combination hasn't been authorized as learned traffic on your network. The following combination is unauthorized. | Major | Unauthorized Communication Behavior |
| **Unauthorized Siemens S7 Plus Block Access** | New traffic parameters were detected. This parameter combination hasn't been authorized as learned traffic on your network. The following combination is unauthorized. | Major | Unauthorized Communication Behavior |
| **Unauthorized Siemens S7 Plus Operation** | New traffic parameters were detected. This parameter combination hasn't been authorized as learned traffic on your network. The following combination is unauthorized. | Major | Unauthorized Communication Behavior |
| **Unauthorized SMB Login** | A sign-in attempt between a source client and destination server was detected. Communication between these devices hasn't been authorized as learned traffic on your network. | Major | Authentication |
| **Unauthorized SNMP Operation** | New traffic parameters were detected. This parameter combination hasn't been authorized as learned traffic on your network. The following combination is unauthorized. | Major | Abnormal Communication Behavior |
| **Unauthorized SSH Access** | New traffic parameters were detected. This parameter combination hasn't been authorized as learned traffic on your network. The following combination is unauthorized. | Major | Remote Access |
| **Unauthorized Windows Process** | An unauthorized application was detected on a source device. The application hasn't been authorized as a learned application on your network. | Major | Abnormal Communication Behavior |
| **Unauthorized Windows Service** | An unauthorized application was detected on a source device. The application hasn't been authorized as a learned application on your network. | Major | Abnormal Communication Behavior |
| **Unauthorized Operation was detected by a User Defined Rule** | New traffic parameters were detected. This parameter combination violates a user defined rule | Major |
| **Unpermitted Modbus Schneider Electric Extension** | New traffic parameters were detected. This parameter combination hasn't been authorized as learned traffic on your network. The following combination is unauthorized. | Major | Unauthorized Communication Behavior |
| **Unpermitted Usage of ASDU Types** | New traffic parameters were detected. This parameter combination hasn't been authorized as learned traffic on your network. The following combination is unauthorized. | Major | Unauthorized Communication Behavior |
| **Unpermitted Usage of DNP3 Function Code** | New traffic parameters were detected. This parameter combination hasn't been authorized as learned traffic on your network. The following combination is unauthorized. | Major | Unauthorized Communication Behavior |
| **Unpermitted Usage of Internal Indication (IIN)** | A DNP3 source device (outstation) reported an internal indication (IIN) that hasn't authorized as learned traffic on your network. | Major | Illegal Commands |
| **Unpermitted Usage of Modbus Function Code** | New traffic parameters were detected. This parameter combination hasn't been authorized as learned traffic on your network. The following combination is unauthorized. | Major | Unauthorized Communication Behavior |

## Anomaly engine alerts

Anomaly engine alerts describe detected anomalies in network activity.

| Title | Description | Severity | Category |
|--|--|--|--|
| **Abnormal Exception Pattern in Slave** | An excessive number of errors were detected on a source device.  This alert may be the result of an operational issue. <br><br> Threshold: 20 exceptions in 1 hour | Minor | Abnormal Communication Behavior |
| * **Abnormal HTTP Header Length** | The source device sent an abnormal message.  This alert may indicate an attempt to attack the destination device. | Critical | Abnormal HTTP Communication Behavior |
| * **Abnormal Number of Parameters in HTTP Header** | The source device sent an abnormal message.  This alert may indicate an attempt to attack the destination device. | Critical | Abnormal HTTP Communication Behavior |
| **Abnormal Periodic Behavior In Communication Channel** | A change in the frequency of communication between the source and destination devices was detected. | Minor | Abnormal Communication Behavior |
| **Abnormal Termination of Applications** | An excessive number of stop commands were detected on a source device. This alert may be the result of an operational issue or an attempt to manipulate the device. <br><br> Threshold: 20 stop commands in 3 hours | Major | Abnormal Communication Behavior |
| **Abnormal Traffic Bandwidth** | Abnormal bandwidth was detected on a channel. Bandwidth appears to be lower/higher than previously detected. For details, work with the Total Bandwidth widget. | Warning | Bandwidth Anomalies |
| **Abnormal Traffic Bandwidth Between Devices** | Abnormal bandwidth was detected on a channel. Bandwidth appears to be lower/higher than previously detected. For details, work with the Total Bandwidth widget. | Warning | Bandwidth Anomalies |
| **Address Scan Detected** | A source device was detected scanning network devices. This device hasn't been authorized as a network scanning device. <br><br> Threshold: 50 connections to the same B class subnet in 2 minutes | Critical | Scan |
| **ARP Address Scan Detected** | A source device was detected scanning network devices using Address Resolution Protocol (ARP). This device address hasn't been authorized as valid ARP scanning address. <br><br> Threshold: 40 scans in 6 minutes | Critical | Scan |
| **ARP Spoofing** | An abnormal quantity of packets was detected in the network.  This alert could indicate an attack, for example, an ARP spoofing or ICMP flooding attack. <br><br> Threshold: 60 packets in 1 minute | Warning | Abnormal Communication Behavior |
| **Excessive Login Attempts** | A source device was seen performing excessive sign-in attempts to a destination server.  This alert may indicate a brute force attack. The server may be compromised by a malicious actor. <br><br> Threshold: 20 sign-in attempts in 1 minute | Critical | Authentication |
| **Excessive Number of Sessions** | A source device was seen performing excessive sign-in attempts to a destination server. This may indicate a brute force attack. The server may be compromised by a malicious actor. <br><br> Threshold: 50 sessions in 1 minute | Critical | Abnormal Communication Behavior |
| **Excessive Restart Rate of an Outstation** | An excessive number of restart commands were detected on a source device. These alerts may be the result of an operational issue or an attempt to manipulate the device. <br><br> Threshold: 10 restarts in 1 hour | Major | Restart/ Stop Commands |
| **Excessive SMB login attempts** | A source device was seen performing excessive sign-in attempts to a destination server. This may indicate a brute force attack. The server may be compromised by a malicious actor. <br><br> Threshold: 10 sign-in attempts in 10 minutes | Critical | Authentication |
| **ICMP Flooding** | An abnormal quantity of packets was detected in the network.  This alert could indicate an attack, for example, an ARP spoofing or ICMP flooding attack. <br><br> Threshold: 60 packets in 1 minute | Warning | Abnormal Communication Behavior |
|* **Illegal HTTP Header Content** | The source device initiated an invalid request. | Critical | Abnormal HTTP Communication Behavior |
| **Inactive Communication Channel** | A communication channel between two devices was inactive during a period in which activity is usually observed. This might indicate that the program generating this traffic was changed, or the program might be unavailable. It's recommended to review the configuration of installed program and verify that it's configured properly. <br><br> Threshold: 1 minute | Warning | Unresponsive |
| **Long Duration Address Scan Detected** | A source device was detected scanning network devices. This device hasn't been authorized as a network scanning device. <br><br> Threshold: 50 connections to the same B class subnet in 10 minutes | Critical | Scan |
| **Password Guessing Attempt Detected** | A source device was seen performing excessive sign-in attempts to a destination server. This may indicate a brute force attack. The server may be compromised by a malicious actor. <br><br> Threshold: 100 attempts in 1 minute | Critical | Authentication |
| **PLC Scan Detected** | A source device was detected scanning network devices. This device hasn't been authorized as a network scanning device. <br><br> Threshold: 10 scans in 2 minutes | Critical | Scan |
| **Port Scan Detected** | A source device was detected scanning network devices. This device hasn't been authorized as a network scanning device. <br><br> Threshold: 25 scans in 2 minutes | Critical | Scan |
| **Unexpected message length** | The source device sent an abnormal message.  This alert may indicate an attempt to attack the destination device. <br><br> Threshold: text length - 32768 | Critical | Abnormal Communication Behavior |
| **Unexpected Traffic for Standard Port** | Traffic was detected on a device using a port reserved for another protocol. | Major | Abnormal Communication Behavior |

## Protocol violation engine alerts

Protocol engine alerts describe detected deviations in the packet structure, or field values compared to protocol specifications.

| Title | Description | Severity | Category |
|--|--|--|--|
| **Excessive Malformed Packets In a Single Session** | An abnormal number of malformed packets sent from the source device to the destination device. This alert might indicate erroneous communications, or an attempt to manipulate the targeted device. <br><br> Threshold: 2 malformed packets in 10 minutes | Major | Illegal Commands |
| **Firmware Update** | A source device sent a command to update firmware on a destination device. Verify that recent programming, configuration and  firmware upgrades made to the destination device are valid. | Warning | Firmware Change |
| **Function Code Not Supported by Outstation** | The destination device received an invalid request. | Major | Illegal Commands |
| **Illegal BACNet message** | The source device initiated an invalid request. | Major | Illegal Commands |
| **Illegal Connection Attempt on Port 0** | A source device attempted to connect to destination device on port number zero (0). For TCP, port 0 is reserved and can’t be used. For UDP, the port is optional and a value of 0 means no port. There's usually no service on a system that listens on port 0. This event may indicate an attempt to attack the destination device, or indicate that an application was programmed incorrectly. | Minor | Illegal Commands |
| **Illegal DNP3 Operation** | The source device initiated an invalid request. | Major | Illegal Commands |
| **Illegal MODBUS Operation (Exception Raised by Master)** | The source device initiated an invalid request. | Major | Illegal Commands |
| **Illegal MODBUS Operation (Function Code Zero)** | The source device initiated an invalid request. | Major | Illegal Commands |
| **Illegal Protocol Version** | The source device initiated an invalid request. | Major | Illegal Commands |
| **Incorrect Parameter Sent to Outstation** | The destination device received an invalid request. | Major | Illegal Commands |
| **Initiation of an Obsolete Function Code (Initialize Data)** | The source device initiated an invalid request. | Minor | Illegal Commands |
| **Initiation of an Obsolete Function Code (Save Config)** | The source device initiated an invalid request. | Minor | Illegal Commands |
| **Master Requested an Application Layer Confirmation** | The source device initiated an invalid request. | Warning | Illegal Commands |
| **Modbus Exception** | A source device (secondary) returned an exception to a destination device (primary). | Major | Illegal Commands |
| **Slave Device Received Illegal ASDU Type** | The destination device received an invalid request. | Major | Illegal Commands |
| **Slave Device Received Illegal Command Cause of Transmission** | The destination device received an invalid request. | Major | Illegal Commands |
| **Slave Device Received Illegal Common Address** | The destination device received an invalid request. | Major | Illegal Commands |
| **Slave Device Received Illegal Data Address Parameter** | The destination device received an invalid request. | Major | Illegal Commands |
| **Slave Device Received Illegal Data Value Parameter** | The destination device received an invalid request. | Major | Illegal Commands |
| **Slave Device Received Illegal Function Code** | The destination device received an invalid request. | Major | Illegal Commands |
| **Slave Device Received Illegal Information Object Address** | The destination device received an invalid request. | Major | Illegal Commands |
| **Unknown Object Sent to Outstation** | The destination device received an invalid request. | Major | Illegal Commands |
| **Usage of a Reserved Function Code** | The source device initiated an invalid request. | Major | Illegal Commands |
| **Usage of Improper Formatting by Outstation** | The source device initiated an invalid request. | Warning | Illegal Commands |
| **Usage of Reserved Status Flags (IIN)** | A DNP3 source device (outstation) used the reserved Internal Indicator 2.6. It's recommended to check the device's configuration. | Warning | Illegal Commands |

## Malware engine alerts

Malware engine alerts describe detected malicious network activity.

| Title | Description| Severity | Category |
|--|--|--|--|
| **Connection Attempt to Known Malicious IP** | Suspicious network activity was detected. This activity may be associated with an attack exploiting a method used by known malware. | Major | Suspicion of Malicious Activity |
| **Invalid SMB Message (DoublePulsar Backdoor Implant)** | Suspicious network activity was detected. This activity may be associated with an attack exploiting a method used by known malware. | Critical | Suspicion of Malware |
| **Malicious Domain Name Request** | Suspicious network activity was detected. This activity may be associated with an attack exploiting a method used by known malware. | Major | Suspicion of Malicious Activity |
| **Malware Test File Detected - EICAR AV Success** | An EICAR AV test file was detected in traffic between two devices (over any transport - TCP or UDP). The file isn't malware. It's used to confirm that the antivirus software is installed correctly. Demonstrate what happens when a virus is found, and check internal procedures and reactions when a virus is found. Antivirus software should detect EICAR as if it were a real virus. | Major | Suspicion of Malicious Activity |
| **Suspicion of Conficker Malware** | Suspicious network activity was detected. This activity may be associated with an attack exploiting a method used by known malware. | Major | Suspicion of Malware |
| **Suspicion of Denial Of Service Attack** | A source device attempted to initiate an excessive number of new connections to a destination device. This may indicate a Denial Of Service (DOS) attack against the destination device, and might interrupt device functionality, affect performance and service availability, or cause unrecoverable errors. <br><br> Threshold: 3000 attempts in 1 minute | Critical | Suspicion of Malicious Activity |
| **Suspicion of Malicious Activity** | Suspicious network activity was detected. This activity may be associated with an attack that triggered known 'Indicators of Compromise' (IOCs). Alert metadata should be reviewed by the security team. | Major | Suspicion of Malicious Activity |
| **Suspicion of Malicious Activity (BlackEnergy)** | Suspicious network activity was detected. This activity may be associated with an attack exploiting a method used by known malware. | Critical | Suspicion of Malware |
| **Suspicion of Malicious Activity (DarkComet)** | Suspicious network activity was detected. This activity may be associated with an attack exploiting a method used by known malware. | Critical | Suspicion of Malware |
| **Suspicion of Malicious Activity (Duqu)** | Suspicious network activity was detected. This activity may be associated with an attack exploiting a method used by known malware. | Critical | Suspicion of Malware |
| **Suspicion of Malicious Activity (Flame)** | Suspicious network activity was detected. This activity may be associated with an attack exploiting a method used by known malware. | Critical | Suspicion of Malware |
| **Suspicion of Malicious Activity (Havex)** | Suspicious network activity was detected. This activity may be associated with an attack exploiting a method used by known malware. | Critical | Suspicion of Malware |
| **Suspicion of Malicious Activity (Karagany)** | Suspicious network activity was detected. This activity may be associated with an attack exploiting a method used by known malware. | Critical | Suspicion of Malware |
| **Suspicion of Malicious Activity (LightsOut)** | Suspicious network activity was detected. This activity may be associated with an attack exploiting a method used by known malware. | Critical | Suspicion of Malware |
| **Suspicion of Malicious Activity (Name Queries)** | Suspicious network activity was detected. This activity may be associated with an attack exploiting a method used by known malware. <br><br> Threshold: 25 name queries in 1 minute | Major | Suspicion of Malicious Activity |
| **Suspicion of Malicious Activity (Poison Ivy)** | Suspicious network activity was detected. This activity may be associated with an attack exploiting a method used by known malware. | Critical | Suspicion of Malware |
| **Suspicion of Malicious Activity (Regin)** | Suspicious network activity was detected. This activity may be associated with an attack exploiting a method used by known malware. | Critical | Suspicion of Malware |
| **Suspicion of Malicious Activity (Stuxnet)** | Suspicious network activity was detected. This activity may be associated with an attack exploiting a method used by known malware. | Critical | Suspicion of Malware |
| **Suspicion of Malicious Activity (WannaCry)** | Suspicious network activity was detected. This activity may be associated with an attack exploiting a method used by known malware. | Major | Suspicion of Malware |
| **Suspicion of NotPetya Malware - Illegal SMB Parameters Detected** | Suspicious network activity was detected. This activity may be associated with an attack exploiting a method used by known malware. | Critical | Suspicion of Malware |
| **Suspicion of NotPetya Malware - Illegal SMB Transaction Detected** | Suspicious network activity was detected. This activity may be associated with an attack exploiting a method used by known malware. | Critical | Suspicion of Malware |
| **Suspicion of Remote Code Execution with PsExec** | Suspicious network activity was detected. This activity may be associated with an attack exploiting a method used by known malware. | Major | Suspicion of Malicious Activity |
| **Suspicion of Remote Windows Service Management** | Suspicious network activity was detected. This activity may be associated with an attack exploiting a method used by known malware. | Major | Suspicion of Malicious Activity |
| **Suspicious Executable File Detected on Endpoint** | Suspicious network activity was detected. This activity may be associated with an attack exploiting a method used by known malware. | Major | Suspicion of Malicious Activity |
| **Suspicious Traffic Detected** | Suspicious network activity was detected. This activity may be associated with an attack that triggered known 'Indicators of Compromise' (IOCs). Alert metadata should be reviewed by the security team | Critical | Suspicion of Malicious Activity |
| **Backup Activity with Antivirus Signatures**  | Traffic detected between the source device and the destination backup server triggered this alert. The traffic includes backup of antivirus software that might contain malware signatures. This is most likely legitimate backup activity. | Warning | Backup

## Operational engine alerts

Operational engine alerts describe detected operational incidents, or malfunctioning entities.

| Title | Description | Severity | Category |
|--|--|--|--|
| **An S7 Stop PLC Command was Sent** | The source device sent a stop command to a destination controller. The controller will stop operating until a start command is sent. | Warning | Restart/ Stop Commands |
| **BACNet Operation Failed** | A server returned an error code.  This alert indicates a server error or an invalid request by a client. | Major | Command Failures |
| **Bad MMS Device State** | An MMS Virtual Manufacturing Device (VMD) sent a status message. The message indicates that the server may not be configured correctly, partially operational, or not operational at all. | Major | Operational Issues |
| **Change of Device Configuration** | A configuration change was detected on a source device. | Minor | Configuration Changes |
| **Continuous Event Buffer Overflow at Outstation** | A buffer overflow event was detected on a source device. The event may cause data corruption, program crashes, or execution of malicious code. <br><br> Threshold: 3 occurrences in 10 minutes  | Major | Buffer Overflow |
| **Controller Reset** | A source device sent a reset command to a destination controller. The controller stopped operating temporarily and started again automatically. | Warning | Restart/ Stop Commands |
| **Controller Stop** | The source device sent a stop command to a destination controller. The controller will stop operating until a start command is sent. | Warning | Restart/ Stop Commands |
| **Device Failed to Receive a Dynamic IP Address** | The source device is configured to receive a dynamic IP address from a DHCP server but didn't receive an address. This indicates a configuration error on the device, or an operational error in the DHCP server. It's recommended to notify the network administrator of the incident | Major | Command Failures |
| **Device is Suspected to be Disconnected (Unresponsive)** | A source device didn't respond to a command sent to it. It may have been disconnected when the command was sent. <br><br> Threshold: 8 attempts in 5 minutes | Major | Unresponsive |
| **EtherNet/IP CIP Service Request Failed** | A server returned an error code. This indicates a server error or an invalid request by a client. | Major | Command Failures |
| **EtherNet/IP Encapsulation Protocol Command Failed** | A server returned an error code. This indicates a server error or an invalid request by a client. | Major | Command Failures |
| **Event Buffer Overflow in Outstation** | A buffer overflow event was detected on a source device. The event may cause data corruption, program crashes, or execution of malicious code. | Major | Buffer Overflow |
| **Expected Backup Operation Did Not Occur** | Expected backup/file transfer activity didn't occur between two devices. This alert may indicate errors in the backup / file transfer process. <br><br> Threshold: 100 seconds | Major | Backup |
| **GE SRTP Command Failure** | A server returned an error code.  This alert indicates a server error or an invalid request by a client. | Major | Command Failures |
| **GE SRTP Stop PLC Command was Sent** | The source device sent a stop command to a destination controller. The controller will stop operating until a start command is sent. | Warning | Restart/ Stop Commands |
| **GOOSE Control Block Requires Further Configuration** | A source device sent a GOOSE message indicating that the device needs commissioning. This means that the GOOSE control block requires further configuration and GOOSE messages are partially or completely non-operational. | Major | Configuration Changes |
| **GOOSE Dataset Configuration was Changed** | A message (identified by protocol ID) dataset was changed on a source device. This means the device will report a different dataset for this message. | Warning | Configuration Changes |
| **Honeywell Controller Unexpected Status** | A Honeywell Controller sent an unexpected diagnostic message indicating a status change. | Warning | Operational Issues |
|*  **HTTP Client Error** | The source device initiated an invalid request. | Warning | Abnormal HTTP Communication Behavior |
| **Illegal IP Address** | System detected traffic between a source device and an IP address that is an invalid address. This may indicate wrong configuration or an attempt to generate illegal traffic. | Minor | Abnormal Communication Behavior |
| **Master-Slave Authentication Error** | The authentication process between a DNP3 source device (primary) and a destination device (outstation) failed. | Minor | Authentication |
| **MMS Service Request Failed** | A server returned an error code. This indicates a server error or an invalid request by a client. | Major | Command Failures |
| **No Traffic Detected on Sensor Interface** | A sensor stopped detecting network traffic on a network interface. | Critical | Sensor Traffic |
| **OPC UA Server Raised an Event That Requires User's Attention** | An OPC UA server sent an event notification to a client. This type of event requires user attention | Major | Operational Issues |
| **OPC UA Service Request Failed** | A server returned an error code. This indicates a server error or an invalid request by a client. | Major | Command Failures |
| **Outstation Restarted** | A cold restart was detected on a source device. This means the device was physically turned off and back on again. | Warning | Restart/ Stop Commands |
| **Outstation Restarts Frequently** | An excessive number of cold restarts were detected on a source device. This means the device was physically turned off and back on again an excessive number of times. <br><br> Threshold: 2 restarts in 10 minutes | Minor | Restart/ Stop Commands |
| **Outstation's Configuration Changed** | A configuration change was detected on a source device. | Major | Configuration Changes |
| **Outstation's Corrupted Configuration Detected** | This DNP3 source device (outstation) reported a corrupted configuration. | Major | Configuration Changes |
| **Profinet DCP Command Failed** | A server returned an error code. This indicates a server error or an invalid request by a client. | Major | Command Failures |
| **Profinet Device Factory Reset** | A source device sent a factory reset command to a Profinet destination device. The reset command clears Profinet device configurations and stops its operation. | Warning | Restart/ Stop Commands |
| * **RPC Operation Failed** | A server returned an error code.  This alert indicates a server error or an invalid request by a client. | Major | Command Failures |
| **Sampled Values Message Dataset Configuration was Changed** | A message (identified by protocol ID) dataset was changed on a source device. This means the device will report a different dataset for this message. | Warning | Configuration Changes |
| **Slave Device Unrecoverable Failure** | An unrecoverable condition error was detected on a source device. This kind of error usually indicates a hardware failure or failure to perform a specific command. | Major | Command Failures |
| **Suspicion of Hardware Problems in Outstation** | An unrecoverable condition error was detected on a source device. This kind of error usually indicates a hardware failure or failure to perform a specific command. | Major | Operational Issues |
| **Suspicion of Unresponsive MODBUS Device** | A source device didn't respond to a command sent to it. It may have been disconnected when the command was sent. <br><br> Threshold: Minimum of 1 valid response for a minimum of 3 requests within 5 minutes | Minor | Unresponsive |
| **Traffic Detected on Sensor Interface** | A sensor resumed detecting network traffic on a network interface. | Warning | Sensor Traffic |

\* The alert is disabled by default, but can be enabled again. To enable the alert, navigate to the Support page, find the alert and select **Enable**. You need administrative level permissions to access the Support page.

## Next steps

For more information, see:

- [View and manage alerts on the Defender for IoT portal (Preview)](how-to-manage-cloud-alerts.md)
- [Manage alerts](how-to-manage-the-alert-event.md)
- [View alerts on your sensor](how-to-view-alerts.md)
- [Accelerate alert workflows](how-to-accelerate-alert-incident-response.md)
- [Forward alert information](how-to-forward-alert-information-to-partners.md)
- [Work with alerts on the on-premises management console](how-to-work-with-alerts-on-premises-management-console.md)
- [Alert management API reference for on-premises management consoles](api/management-alert-apis.md)
- [Alert management API reference for OT monitoring sensors](api/sensor-alert-apis.md)
- [Forward alert information](how-to-forward-alert-information-to-partners.md)

