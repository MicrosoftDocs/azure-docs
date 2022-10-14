---
title: Set up SNMP MIB monitoring
description: You can perform sensor health monitoring by using SNMP. The sensor responds to SNMP queries sent from an authorized monitoring server.
ms.date: 05/31/2022
ms.topic: how-to
---

# Set up SNMP MIB monitoring

Monitoring sensor health is possible through the Simple Network Management Protocol (SNMP). The sensor responds to SNMP requests sent by an authorized monitoring server. The SNMP monitor polls sensor OIDs periodically (up to 50 times a second).

Supported SNMP versions are SNMP version 2 and version 3. The SNMP protocol utilizes UDP as its transport protocol with port 161.

## Download the SNMP MIB file

Download the SNMP MIB file from Defender for IoT in the Azure portal. Select **Sites and sensors > More actions > Download SNMP MIB file**.

[!INCLUDE [root-of-trust](includes/root-of-trust.md)]


## Sensor OIDs

| Management console and sensor | OID | Format | Description |
|--|--|--|--|
| Appliance name | 1.3.6.1.2.1.1.5.0 | STRING | Appliance name for the on-premises management console |
| Vendor | 1.3.6.1.2.1.1.4.0 | STRING | Microsoft Support (support.microsoft.com) |
| Platform | 1.3.6.1.2.1.1.1.0 | STRING | Sensor or on-premises management console |
| Serial number | 1.3.6.1.4.1.53313.1 |STRING | String that the license uses |
| Software version | 1.3.6.1.4.1.53313.2 | STRING | Xsense full-version string and management full-version string |
| CPU usage | 1.3.6.1.4.1.53313.3.1 | GAUGE32 | Indication for zero to 100 |
| CPU temperature | 1.3.6.1.4.1.53313.3.2 | STRING | Celsius indication for zero to 100 based on Linux input. "No sensors found" will be returned from any machine that has no actual physical temperature sensor (for example VMs)|
| Memory usage | 1.3.6.1.4.1.53313.3.3 | GAUGE32 | Indication for zero to 100 |
| Disk Usage | 1.3.6.1.4.1.53313.3.4 | GAUGE32 | Indication for zero to 100 |
| Service Status | 1.3.6.1.4.1.53313.5  |STRING | Online or offline if one of the four crucial components is down |
| Locally/cloud connected | 1.3.6.1.4.1.53313.6   |STRING | Activation mode of this appliance: Cloud Connected / Locally Connected |
| License status | 1.3.6.1.4.1.53313.7  |STRING | Activation period of this appliance: Active / Expiration Date / Expired |

Note that:
- Non-existing keys respond with null, HTTP 200. 
- Hardware-related MIBs (CPU usage, CPU temperature, memory usage, disk usage) should be tested on all architectures and physical sensors. CPU temperature on virtual machines is expected to be not applicable.
- You can download the log that contains all the SNMP queries that the sensor receives, including the connection data and raw data.

## Prerequisites for AES and 3-DES Encryption Support for SNMP Version 3
- The network management station (NMS) must support Simple Network Management Protocol (SNMP) Version 3 to be able to use this feature.
- It's important to understand the SNMP architecture and the terminology of the architecture to understand the security model used and how the security model interacts with the other subsystems in the architecture.
- Before you begin configuring SNMP monitoring, you need to open the port UDP 161 in the firewall.


## Set up SNMP monitoring

1. On the side menu, select **System Settings**.
1. Expand **Sensor Management**, and select **SNMP MIB Monitoring** :
1. Select **Add host** and enter the IP address of the server that performs the system health monitoring. You can add multiple servers.
1. In **Authentication** section, select the SNMP version.
    - If you select V2, type the string in **SNMP v2 Community String**. You can enter up to 32 characters, and include any combination of alphanumeric characters (uppercase letters, lowercase letters, and numbers). Spaces aren't allowed.
    - If you select V3, specify the following:
    
        | Parameter | Description |
        |--|--|
        | **Username** | The SNMP username can contain up to 32 characters and include any combination of alphanumeric characters (uppercase letters, lowercase letters, and numbers). Spaces aren't allowed. <br /> <br />The username for the SNMP v3 authentication must be configured on the system and on the SNMP server. |
        | **Password** | Enter a case-sensitive authentication password. The authentication password can contain 8 to 12 characters and include any combination of alphanumeric characters (uppercase letters, lowercase letters, and numbers). <br /> <br/>The username for the SNMP v3 authentication must be configured on the system and on the SNMP server. |
        | **Auth Type** | Select MD5 or SHA-1. |
        | **Encryption** | Select DES (56 bit key size)<sup>[1](#1)</sup> or AES (AES 128 bits supported)<sup>[2](#2)</sup>. |
        | **Secret Key** | The key must contain exactly eight characters and include any combination of alphanumeric characters (uppercase letters, lowercase letters, and numbers). |

    <a name="1"></a><sup>1</sup> RFC3414 User-based Security Model (USM) for version 3 of the Simple Network Management Protocol (SNMPv3)

    <a name="2"></a><sup>2</sup> RFC3826 The Advanced Encryption Standard (AES) Cipher Algorithm in the SNMP User-based Security Model

1. Select **Save**.

## Next steps

For more information, see [Export troubleshooting logs](how-to-troubleshoot-the-sensor-and-on-premises-management-console.md).
