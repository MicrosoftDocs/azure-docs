---
title: Set up SNMP MIB monitoring
description: You can perform sensor health monitoring by using SNMP. The sensor responds to SNMP queries sent from an authorized monitoring server.
ms.date: 12/14/2020
ms.topic: how-to
---

# Set up SNMP MIB monitoring

You can perform sensor health monitoring by using Simple Network Management Protocol (SNMP). The sensor responds to SNMP queries sent from an authorized monitoring server. The SNMP monitor polls the sensor OIDs periodically (up to 50 times a second).

The SNMP supported versions are SNMP v2 or SNMP v3. SNMP uses UDP as its transport protocol with port 161 (SNMP).

Before you begin configuring SNMP monitoring, you need to open the port UDP 161 in the firewall.

## OIDs

| Management console and sensor | OID | Format | Description |
|--|--|--|--|
| Appliance name | 1.3.6.1.2.1.1.5.0 | DISPLAYSTRING | Appliance name for the on-premises management console |
| Vendor | 1.3.6.1.2.1.1.4.0 | DISPLAYSTRING | Microsoft Support (support.microsoft.com) |
| Platform | 1.3.6.1.2.1.1.1.0 | DISPLAYSTRING | Sensor or on-premises management console |
| Serial number | 1.3.6.1.4.1.9.9.53313.1 | DISPLAYSTRING | String that the license uses |
| Software version | 1.3.6.1.4.1.9.9.53313.2 | DISPLAYSTRING | Xsense full-version string and management full-version string |
| CPU usage | 1.3.6.1.4.1.9.9.53313.3.1 | GAUGE32 | Indication for zero to 100 |
| CPU temperature | 1.3.6.1.4.1.9.9.53313.3.2 | DISPLAYSTRING | Celsius indication for zero to 100 based on Linux input |
| Memory usage | 1.3.6.1.4.1.9.9.53313.3.3 | GAUGE32 | Indication for zero to 100 |
| Disk Usage | 1.3.6.1.4.1.9.9.53313.3.4 | GAUGE32 | Indication for zero to 100 |
| Service Status | 1.3.6.1.4.1.9.9.53313.5 | DISPLAYSTRING | Online or offline if one of the four crucial components is down |
| Bandwidth | Out of scope for 2.4 |  | The bandwidth received on each monitor interface in Xsense |

   - Non-existing keys respond with null, HTTP 200, based on [Stack Overflow](https://stackoverflow.com/questions/51419026/querying-for-non-existing-record-returns-null-with-http-200).
    
   - Hardware-related MIBs (CPU usage, CPU temperature, memory usage, disk usage) should be tested on all architectures and physical sensors. CPU temperature on virtual machines is expected to be not applicable.

You can download the log that contains all the SNMP queries that the sensor receives, including the connection data and raw data from the packet.

To define SNMP v2 health monitoring:

1. On the side menu, select **System Settings**.

2. In the **Active Discovery** pane, select **SNMP MIB Monitoring** :::image type="icon" source="media/how-to-set-up-snmp-mib-monitoring/snmp-icon.png" border="false":::.

    :::image type="content" source="media/how-to-set-up-snmp-mib-monitoring/edit-snmp.png" alt-text="Edit your SNMP window.":::

3. In the **Allowed Hosts** section, select **Add host** and enter the IP address of the server that performs the system health monitoring.

    :::image type="content" source="media/how-to-set-up-snmp-mib-monitoring/snmp-allowed-ip-addess.png" alt-text="Enter the IP address for allowed hosts.":::

4. In the **Authentication** section, in the **SNMP v2 Community String** box, enter the string. The SNMP community string can contain up to 32 characters and include any combination of alphanumeric characters (uppercase letters, lowercase letters, and numbers). Spaces are not allowed.

5. Select **Save**.

To define SNMP v3 health monitoring:

1. On the side menu, select **System Settings**.

2. On the **Active Discovery** pane, select **SNMP MIB Monitoring** :::image type="icon" source="media/how-to-set-up-snmp-mib-monitoring/snmp-icon.png" border="false":::.

    :::image type="content" source="media/how-to-set-up-snmp-mib-monitoring/edit-snmp.png" alt-text="Edit your SNMP window.":::

3. In the **Allowed Hosts** section, select **Add host** and enter the IP address of the server that performs the system health monitoring.

    :::image type="content" source="media/how-to-set-up-snmp-mib-monitoring/snmp-allowed-ip-addess.png" alt-text="Enter the IP address for the allowed hosts.":::

4. In the **Authentication** section, set the following parameters:

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
