---
title: Set up SNMP MIB monitoring on an OT sensor
description: Learn how to set up your OT sensor for health monitoring via SNMP. 
ms.date: 03/22/2023
ms.topic: how-to
---

# Set up SNMP MIB health monitoring on an OT sensor

This article describes show to configure your OT sensors for health monitoring via an authorized SNMP monitoring server. SNMP queries are sent up to 50 times a second, using UDP over port 161.

Setup for SNMP monitoring includes configuring settings on your OT sensor and on your SNMP server. To define Defender for IoT sensors on your SNMP server, either define your settings manually or use a pre-defined SNMP MIB file downloaded from the Azure portal.

SNMP queries are sent up to 50 times a second, using UDP over port 161.

## Prerequisites

Before you perform the procedures in this article, make sure that you have the following:

- **An SNMP monitoring server**, using SNMP versions 2 or 3. If you're using SNMP version 3 and want to use AES and 3-DES encryption, you must also have:

    - A network management station (NMS) that supports SNMP version 3
    - An understanding of SNMP terminology, and the SNMP architecture in your organization
    - The UDP port 161 open in your firewall

    Have the following details of your SNMP server ready:

    - IP address
    - Username and password
    - Authentication type: MD5 or SHA
    - Encryption type: DES or AES
    - Secret key
    - SNMP v2 community string

- **An OT sensor** [installed](ot-deploy/install-software-ot-sensor.md) and [activated](ot-deploy/activate-deploy-sensor.md), with access as an **Admin** user. For more information, see [On-premises users and roles for OT monitoring with Defender for IoT](roles-on-premises.md).

To download a pre-defined SNMP MIB file from the Azure portal, you'll need access to the Azure portal as a [Security admin](../../role-based-access-control/built-in-roles.md#security-admin), [Contributor](../../role-based-access-control/built-in-roles.md#contributor), or [Owner](../../role-based-access-control/built-in-roles.md#owner) user. For more information, see [Azure user roles and permissions for Defender for IoT](roles-azure.md).

## Configure SNMP monitoring settings on your OT sensor

1. Sign into your OT sensor and select **System settings > Sensor management > Health and troubleshooting > SNMP MIB monitoring**.

1. In the **SNMP MIB monitoring configuration** pane, select **+ Add host** and enter the following details:

    - **Host 1**: Enter the IP address of your SNMP monitoring server. Select **+ Add host** again if you have multiple servers, as many times as needed.

    - **SNMP V2**: Select if you're using SNMP version 2, and then enter your SNMP V2 community string. A community string can have up to 32 alphanumeric characters, and no spaces.

    - **SNMP V3**: Select if you're using SNMP version 3, and then enter the following details:

        |Name  |Description  |
        |---------|---------|
        |**Username** and **Password**     |  Enter the SNMP v3 credentials used to access the SNMP server. Both usernames and passwords must be configured on both the OT sensor and the SNMP server.<br><br>Usernames can include up to 32 alphanumeric characters, and no spaces.  <br><br>Passwords are case-sensitive, and can include 8-12 alphanumeric characters.    |
        |**Auth Type**     |Select the authentication type used to access the SNMP server: **MD5** or **SHA**         |
        |**Encryption**     | Select the encryption used when communicating with the SNMP server: <br>- **DES** (56-bit key size):  RFC3414 User-based Security Model (USM) for version 3 of the Simple Network Management Protocol (SNMPv3). <br>- **AES** (AES 128 bits supported): RFC3826 The Advanced Encryption Standard (AES) Cipher Algorithm in the SNMP User-based Security Model.        |
        |**Secret Key**     |   Enter a secret key used when communicating with the SNMP server. The secret key must have exactly eight alphanumeric characters.      |

1. Select **Save** to save your changes.

## Download Defender for IoT's SNMP MIB file

Defender for IoT in the Azure portal provides a downloadable MIB file for you to load into your SNMP monitoring system to pre-define Defender for IoT sensors.

**To download the SNMP MIB file** from [Defender for IoT](https://portal.azure.com/#view/Microsoft_Azure_IoT_Defender/IoTDefenderDashboard/~/Getting_started) on the Azure portal, select **Sites and sensors** > **More actions** > **Download SNMP MIB file**.

[!INCLUDE [root-of-trust](includes/root-of-trust.md)]

## OT sensor OIDs for manual SNMP configurations

If you're configuring Defender for IoT sensors on your SNMP monitoring system manually, use the following table for reference regarding sensor object identifier values (OIDs):

| Management console and sensor | OID | Format | Description |
|--|--|--|--|
| **Appliance name** | 1.3.6.1.2.1.1.5.0 | STRING | Appliance name for the on-premises management console |
| **Vendor** | 1.3.6.1.2.1.1.4.0 | STRING | Microsoft Support (support.microsoft.com) |
| **Platform** | 1.3.6.1.2.1.1.1.0 | STRING | Sensor or on-premises management console |
| **Serial number** | 1.3.6.1.4.1.53313.1 |STRING | String that the license uses |
| **Software version** | 1.3.6.1.4.1.53313.2 | STRING | Xsense full-version string and management full-version string |
| **CPU usage** | 1.3.6.1.4.1.53313.3.1 | GAUGE32 | Indication for zero to 100 |
| **CPU temperature** | 1.3.6.1.4.1.53313.3.2 | STRING | Celsius indication for zero to 100 based on Linux input. <br><br>  Any machine that has no actual physical temperature sensor (for example VMs) returns "No sensors found" |
| **Memory usage** | 1.3.6.1.4.1.53313.3.3 | GAUGE32 | Indication for zero to 100 |
| **Disk Usage** | 1.3.6.1.4.1.53313.3.4 | GAUGE32 | Indication for zero to 100 |
| **Service Status** | 1.3.6.1.4.1.53313.5  |STRING | Online or offline if one of the four crucial components is down |
| **Locally/cloud connected** | 1.3.6.1.4.1.53313.6   |STRING | Activation mode of this appliance: Cloud Connected / Locally Connected |
| **License status** | 1.3.6.1.4.1.53313.7  |STRING | Activation period of this appliance: Active / Expiration Date / Expired |

Note that:

- Nonexisting keys respond with null, HTTP 200.
- Hardware-related MIBs (CPU usage, CPU temperature, memory usage, disk usage) should be tested on all architectures and physical sensors. CPU temperature on virtual machines is expected to be not applicable.

## Next steps

For more information, see [Maintain OT network sensors from the GUI](how-to-manage-individual-sensors.md).
