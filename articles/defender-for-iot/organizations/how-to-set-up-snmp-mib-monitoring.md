---
title: Set up SNMP MIB monitoring
description: You can perform sensor health monitoring by using SNMP. The sensor responds to SNMP queries sent from an authorized monitoring server.
ms.date: 01/31/2022
ms.topic: how-to
---

# Set up SNMP MIB monitoring

You can perform sensor health monitoring by using Simple Network Management Protocol (SNMP). The sensor responds to SNMP queries sent from an authorized monitoring server. The SNMP monitor polls the sensor OIDs periodically (up to 50 times a second).

The SNMP supported versions are SNMP v2 or SNMP v3. SNMP uses UDP as its transport protocol with port 161 (SNMP).

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



## Set up SNMP monitoring

1. Before you begin configuring SNMP monitoring, you need to open the port UDP 161 in the firewall.
1. On the side menu, select **System Settings**.
2. Expand **Sensor Management**, and select **SNMP MIB Monitoring** :
3. Select **Add host** and enter the IP address of the server that performs the system health monitoring. You can add multiple servers.
4. In **Authentication** section, select the SNMP version.
    - If you select V2, type the string in **SNMP v2 Community String**. You can enter up to 32 characters, and include any combination of alphanumeric characters (uppercase letters, lowercase letters, and numbers). Spaces aren't allowed.
    - If you select V3, specify the following:
    
        | Parameter | Description |
        |--|--|
        | **Username** | The SNMP username can contain up to 32 characters and include any combination of alphanumeric characters (uppercase letters, lowercase letters, and numbers). Spaces are not allowed. <br /> <br />The username for the SNMP v3 authentication must be configured on the system and on the SNMP server. |
        | **Password** | Enter a case-sensitive authentication password. The authentication password can contain 8 to 12 characters and include any combination of alphanumeric characters (uppercase letters, lowercase letters, and numbers). <br /> <br/>The username for the SNMP v3 authentication must be configured on the system and on the SNMP server. |
        | **Auth Type** | Select MD5 or SHA. |
        | **Encryption** | Select DES or AES. |
        | **Secret Key** | The key must contain exactly eight characters and include any combination of alphanumeric characters (uppercase letters, lowercase letters, and numbers). |

5. Select **Save**.

## See also

[Export troubleshooting logs](how-to-troubleshoot-the-sensor-and-on-premises-management-console.md)
