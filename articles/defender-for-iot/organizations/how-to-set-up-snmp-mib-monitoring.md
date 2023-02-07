---
title: Set up SNMP MIB monitoring
description: Perform sensor health monitoring by using SNMP. The sensor responds to SNMP queries sent from an authorized monitoring server.
ms.date: 05/31/2022
ms.topic: how-to
---

# Set up SNMP MIB monitoring

Monitor sensor health through the Simple Network Management Protocol (SNMP), as the sensor responds to SNMP requests sent by an authorized monitoring server, and the SNMP monitor polls sensor OIDs periodically (up to 50 times a second).

Supported SNMP versions are SNMP version 2 and version 3. The SNMP protocol utilizes UDP as its transport protocol with port 161.

## Prerequisites

- To set up SNMP monitoring, you must be able to access the OT network sensor as an **Admin** user.

    For more information, see [On-premises users and roles for OT monitoring with Defender for IoT](roles-on-premises.md).

- To download the SNMP MIB file, make sure you can access the Azure portal as a [Security admin](../../role-based-access-control/built-in-roles.md#security-admin), [Contributor](../../role-based-access-control/built-in-roles.md#contributor), or [Owner](../../role-based-access-control/built-in-roles.md#owner) user.

    If you don't already have an Azure account, you can [create your free Azure account today](https://azure.microsoft.com/free/).

### Prerequisites for AES and 3-DES Encryption Support for SNMP Version 3

- The network management station (NMS) must support Simple Network Management Protocol (SNMP) Version 3 to be able to use this feature.

- It's important to understand the SNMP architecture and the terminology of the architecture to understand the security model used and how the security model interacts with the other subsystems in the architecture.

- Before you begin configuring SNMP monitoring, you need to open the port UDP 161 in the firewall.

## Set up SNMP monitoring

Set up SNMP monitoring through the OT sensor console.

You can also download the log that contains all the SNMP queries that the sensor receives, including the connection data and raw data, from the same **SNMP MIB monitoring configuration** pane.

To set up SNMP monitoring:

1. Sign in to your OT sensor as an **Admin** user.
1. Select **System Settings** on the left and then, under **Sensor Management**, select **SNMP MIB Monitoring**.
1. Select **+ Add host** and enter the IP address of the server that performs the system health monitoring. You can add multiple servers.

    For example:

    :::image type="content" source="media/configure-active-monitoring/set-up-snmp-mib-monitoring.png" alt-text="Screenshot of the SNMP MIB monitoring configuration page." lightbox="media/configure-active-monitoring/set-up-snmp-mib-monitoring.png":::

1. In the **Authentication** section, select the SNMP version:
    - If you select **V2**, type a string in **SNMP v2 Community String**.

        You can enter up to 32 characters, and include any combination of alphanumeric characters with no spaces.

    - If you select **V3**, specify the following parameters:

        | Parameter | Description |
        |--|--|
        | **Username** | Enter a unique username. <br><br> The SNMP username can contain up to 32 characters and include any combination of alphanumeric characters with no spaces. <br><br> The username for the SNMP v3 authentication must be configured on the system and on the SNMP server. |
        | **Password** | Enter a case-sensitive authentication password. <br><br> The authentication password can contain 8 to 12 characters and include any combination of alphanumeric characters. <br><br> The password for the SNMP v3 authentication must be configured on the system and on the SNMP server. |
        | **Auth Type** | Select **MD5** or **SHA-1**. |
        | **Encryption** |  Select one of the following: <br>- **DES** (56-bit key size):  RFC3414 User-based Security Model (USM) for version 3 of the Simple Network Management Protocol (SNMPv3). <br>- **AES** (AES 128 bits supported): RFC3826 The Advanced Encryption Standard (AES) Cipher Algorithm in the SNMP User-based Security Model. |
        | **Secret Key** | The key must contain exactly eight characters and include any combination of alphanumeric characters. |



1. When you're done adding servers, select **Save**.

## Download the SNMP MIB file

To download the SNMP MIB file from Defender for IoT in the Azure portal:

1. Sign in to the Azure portal.
1. Select **Sites and sensors > More actions > Download SNMP MIB file**.

[!INCLUDE [root-of-trust](includes/root-of-trust.md)]

## Sensor OIDs

Use the following table for reference regarding sensor object identifier values (OIDs):

| Management console and sensor | OID | Format | Description |
|--|--|--|--|
| Appliance name | 1.3.6.1.2.1.1.5.0 | STRING | Appliance name for the on-premises management console |
| Vendor | 1.3.6.1.2.1.1.4.0 | STRING | Microsoft Support (support.microsoft.com) |
| Platform | 1.3.6.1.2.1.1.1.0 | STRING | Sensor or on-premises management console |
| Serial number | 1.3.6.1.4.1.53313.1 |STRING | String that the license uses |
| Software version | 1.3.6.1.4.1.53313.2 | STRING | Xsense full-version string and management full-version string |
| CPU usage | 1.3.6.1.4.1.53313.3.1 | GAUGE32 | Indication for zero to 100 |
| CPU temperature | 1.3.6.1.4.1.53313.3.2 | STRING | Celsius indication for zero to 100 based on Linux input. <br><br>  Any machine that has no actual physical temperature sensor (for example VMs) will return "No sensors found" |
| Memory usage | 1.3.6.1.4.1.53313.3.3 | GAUGE32 | Indication for zero to 100 |
| Disk Usage | 1.3.6.1.4.1.53313.3.4 | GAUGE32 | Indication for zero to 100 |
| Service Status | 1.3.6.1.4.1.53313.5  |STRING | Online or offline if one of the four crucial components is down |
| Locally/cloud connected | 1.3.6.1.4.1.53313.6   |STRING | Activation mode of this appliance: Cloud Connected / Locally Connected |
| License status | 1.3.6.1.4.1.53313.7  |STRING | Activation period of this appliance: Active / Expiration Date / Expired |

Note that:

- Non-existing keys respond with null, HTTP 200.
- Hardware-related MIBs (CPU usage, CPU temperature, memory usage, disk usage) should be tested on all architectures and physical sensors. CPU temperature on virtual machines is expected to be not applicable.

## Next steps

For more information, see [Export troubleshooting logs](how-to-troubleshoot-the-sensor-and-on-premises-management-console.md)