---
title: About the Fortinet integration
description: 
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 11/11/2020
ms.topic: article
ms.service: azure
---

# CyberX-Fortinet IIoT & ICS threat detection & prevention

CyberX mitigates IIoT and ICS/SCADA risk with patented, ICS-aware self-learning engines that deliver immediate insights about ICS assets, vulnerabilities, and threats — in less than an hour and without relying on agents, rules or signatures, specialized skills, or prior knowledge of the environment.

CyberX and Fortinet have established a technology partnership in order to detect and stop attacks on IoT and ICS networks.

Together, Fortinet and CyberX prevent:

 - Unauthorized changes to Programmable Logic Controllers
 - Malware that manipulates ICS and/or IoT devices via their native protocols
 - Reconnaissance tools from collecting data
 - Protocol violations caused by misconfigurations or malicious attackers

## CyberX-FortiGate joint solution

CyberX detects anomalous behavior in IoT and ICS networks and delivers that information to FortiGate and FortiSIEM, as follows:

 - **Visibility:** The information provided by CyberX gives FortiSIEM administrators visibility into previously “dark” IoT and ICS networks.
 - **Blocking malicious attacks:** FortiGate administrators can use the information discovered by CyberX and create rules to stop the anomalous behavior-- whether that behavior is caused by chaotic actors or simply misconfigured assets-- before it causes damage to production, profits, or people.

## The CyberX platform

The CyberX platform auto-discovers and fingerprints unmanaged IoT and ICS devices while continuously monitoring for targeted attacks and malware. Risk and vulnerability management capabilities include automated threat modeling as well as comprehensive reporting about both endpoint and network vulnerabilities, with risk-prioritized mitigation recommendations.  

The CyberX platform is agentless, non-intrusive and easy to deploy, delivering actionable insights less than an hour after being connected to the network.

## Fortinet FortiSIEM

Effective security requires visibility – all the assets, all the infrastructure in realtime, but also with context: what assets represent a threat, what is their capability so you manage the threat the business faces, not the noise multiple security tools create.  
Endpoints, IoT, Infrastructure, Security Tools, Applications, VM’s and Cloud – the number of things administrators need to secure and monitor grows constantly.

FortiSIEM – Fortinet’s Multivendor Security Incident and Events Management solution brings it all together: visibility, correlation, automated response and remediation in a single, scalable solution.

Using a Business Services view, the complexity of managing network and security operations is reduced, freeing resources, improving breach detection. FortiSIEM provides the cross correlation, applies machine learning and UEBA to improve response, to stop breaches before they occur.

## Fortinet FortiGate next-generation firewalls

FortiGate next-generation firewalls (NGFWs) utilize purpose-built security processors and threat intelligence security services from AI-powered FortiGuard labs to deliver top-rated protection, high performance inspection of clear-texted and encrypted traffic.

Next-generation firewalls reduce cost and complexity with full visibility into applications, users and networks and provides best of breed security. As an integral part of the Fortinet Security Fabric next-generation firewalls can communicate within Fortinet’s comprehensive security portfolio as well as third-party security solutions in a multivendor environment to share threat intelligence and improve security posture.

## Use cases

**Prevent Unauthorized changes to Programmable Logic Controllers**

Organizations use programmable logic controllers (PLCs) to manage physical processes such as robotic arms in factories, spinning turbines in wind farms, and centrifuges in nuclear power plants.

An update to the ladder logic or firmware of a PLC can represent a legitimate activity or an attempt to compromise the device by inserting malicious code.  CyberX can detect unauthorized changes to PLCs, and then deliver information about that change to both FortiSIEM and FortiGate.  Armed with that information, FortSIEM administrators can decide how to best mitigate the solution. One mitigation option would be to create a rule in FortiGate that stops further communication to the effected asset.

**Stop Ransomware before it damages IoT/ICS networks**

CyberX continuously monitors ICS/IoT networks for behaviors that are caused by ransomware such as LockerGoga, WannaCry, and NotPetya. When integrated with FortiSIEM and FortiGate, CyberX can deliver information about the presence of these types of ransomware so that ForiSIEM operators can see where the malware is and FortiGate administrators can stop the ransomware from spreading and wreaking additional havoc.

## Getting more information

- For support and troubleshooting information, contact [support@cyberx-labs.com](mailto:support@cyberx-labs.com).

## Set sending CyberX alerts to FortiSIEM

CyberX alerts provide information about an extensive range of security events, including:

 - Deviations from learned baseline network activity
 - Malware detections
 - Detections based on suspicious operational changes
 - Network anomalies
 - Protocol deviations from protocol specifications

:::image type="content" source="media/integration-fortinet/image3.png" alt-text="Screenshot of Address Scan Detected window":::

You can configure CyberX to send alerts to the FortiSIEM server, where alert information is displayed in the Analytics window:

:::image type="content" source="media/integration-fortinet/image4.png" alt-text="Screenshot of Analytics window":::

Each CyberX alert is parsed without any additional configuration on the FortiSIEM side and they are presented in the FortiSIEM as security events. The following event details appear by default:

:::image type="content" source="media/integration-fortinet/image5.png" alt-text="Screenshot of Event Details":::

## Define alert forwarding rules

Use CyberX Forwarding Rules to send alert information to FortiSIEM.

Options are available to customize the alert rules based on the:

 - Specific protocols detected
 - Severity of the event
 - CyberX engine that detects events

### To create a forwarding rule:

1. From the Sensor or on-premises management console left pane, select **Forwarding**.

    :::image type="content" source="media/integration-fortinet/image6.png" alt-text="Screenshot of Forwarding window":::

2. Select **Create Forwarding Rules**. In the **Create Forwarding Rule** window define rule parameters.

    :::image type="content" source="media/integration-fortinet/image7.png" alt-text="Screenshot of Create Forwarding Rule window":::

    | Parameter | Description |
    | --------- | ----------- |
    | **Name** | The forwarding rule name. |
    | **Select Severity** | The minimal security level incident to forward. For example, if Minor is selected, minor alerts <u>and any alert above this severity level will be forwarded.</u> |
    | **Protocols** | By default, all the protocols are selected.<br><br>To select a specific protocol, select **Specific** and select the protocol for which this rule is applied. |
    | **Engines** | By default, all the security engines are involved.<br><br>To select a specific security engine for which this rule is applied, select **Specific** and select the engine. |
    | **System Notifications** | Forward sensor online/offline status. This option is only available if you have logged into the on-premises management console. |

3. To instruct CyberX to send alert information to FortiSIEM, select **Action** and then select **Send to FortiSIEM**.

    :::image type="content" source="media/integration-fortinet/image8.png" alt-text="Screenshot of Create Forwarding Rule window_Select":::

4. Enter the FortiSIEM server details.

    :::image type="content" source="media/integration-fortinet/image9.png" alt-text="Screenshot of Create Forwarding Rule window_Enter details":::

    | Parameter | Description |
    | --------- | ----------- |
    | **Host** | FortiSIEM server address |
    | **Port** | FortiSIEM server port |
    | **Timezone** | The time stamp for the alert detection. |

5. Select **Submit**.

## Set blocking suspected traffic using Fortigate firewall

You can set blocking policies automatically in the FortiGate firewall based on CyberX alerts.

:::image type="content" source="media/integration-fortinet/image10.png" alt-text="Screenshot of FortiGate Firewall window":::

For example, the following alert has an option to block the malicious source:

:::image type="content" source="media/integration-fortinet/image11.png" alt-text="Screenshot of NotPetya Malware window":::

**To set a FortiGate firewall rule that blocks this malicious source:**

1. In FortiGate, create an API key required for the CyberX forwarding rule, see ***Create an API Key in FortiGate***.
2. In CyberX **Forwarding**, set a forwarding rule that blocks malware related alerts, see ***Configure a forwarding rule to block suspected traffic using the FortiGate firewall***.
3. In CyberX **Alerts**, block the malicious source, see ***Block the Suspicious Source***.
The malicious source address appears in the FortiGage **Administrator** window.

    :::image type="content" source="media/integration-fortinet/image12.png" alt-text="Screenshot of FortiGate Administrator window":::

    The blocking policy was automatically created, and it appears in the FortiGate **IPv4 Policy** window.

    :::image type="content" source="media/integration-fortinet/image13.png" alt-text="Screenshot of FortiGate IPv4 Policy window":::

    :::image type="content" source="media/integration-fortinet/image14.png" alt-text="Screenshot of FortiGate IPv4 Policy Edit window":::

## Create an API key in FortiGate

1. In FortiGate, select **System > Admin Profiles**.

2. Create a profile with the following permissions:

    :::image type="content" source="media/integration-fortinet/image15.png" alt-text="A screenshot of a computer Description automatically generated":::

3. Select **System > Administrators** and create a new **REST API Admin**.

    :::image type="content" source="media/integration-fortinet/image16.png" alt-text="A screenshot of a cell phone Description automatically generated":::

    | Parameter | Description |
    | --------- | ----------- |
    | **Username** | The forwarding rule name. |
    | **Comments** | The minimal security level incident to forward. For example, if Minor is selected, minor alerts <u>and any alert above this severity level will be forwarded.</u> |
    | **Administrator Profile** | From the dropdown list select the profile name that you have defined in the previous step. |
    | **PKI Group** | Disable |
    | **CORS Allow Origin** | Enable |
    | **Restrict login to trusted hosts** | Add IP addresses of the Sensors/CMs that will connect to the FortiGate |

4. Save the API key.

    :::image type="content" source="media/integration-fortinet/image17.png" alt-text="A screenshot of a cell phone Description automatically generated_New API Key":::

## Configure a forwarding rule to block suspected traffic using the FortiGate firewall

1. In the left pane, click **Forwarding**.

    :::image type="content" source="media/integration-fortinet/image6.png" alt-text="Screenshot of Forwarding window":::

2. Select **Create Forwarding Rules** and define rule parameters.

    :::image type="content" source="media/integration-fortinet/image7.png" alt-text="Screenshot of Create Forwarding Rule window":::

    | Parameter | Description |
    | --------- | ----------- |
    | **Name** | The forwarding rule name. |
    | **Select Severity** | The minimal security level incident to forward. For example, if Minor is selected, minor alerts and any alert above this severity level will be forwarded. |
    | **Protocols** | By default, all the protocols are selected.<br><br>To select a specific protocol, select **Specific** and select the protocol for which this rule is applied. |
    | **Engines** | By default, all the security engines are involved.<br><br>To select a specific security engine for which this rule is applied, select **Specific** and select the engine. |
    | **System Notifications** | Forward sensor *online/offline* status. This option is only available if you have logged into the on-premises management console. |

3. To instruct CyberX to send firewall rules to FortiGate, select **Action** and then select **Send to FortiGate**.

    :::image type="content" source="media/integration-fortinet/image18.png" alt-text="Screenshot of Create Forwarding Rule window_Send to FortiGate":::

4. To configure the FortiGate forwarding rule:

    :::image type="content" source="media/integration-fortinet/image19.png" alt-text="Screenshot of Configure Create Forwarding Rule window":::

5. In the **Actions** pane, set the following parameters:

| Parameter | Description |
|--|--|
| Host | Type the FortiGate server IP address |
| Port | Type the FortiGate server port |
| Username | Type the FortiGate server username |
| API Key | Enter the API key that you have created in FortiGate |
| Incoming Interface| Define how the blocking is executed, as follows:<br /><br />**By IP Address**: Always creates blocking policies on Panorama based on IP address.<br /><br />**By FQDN or IP Address**: Creates blocking policies on Panorama based on FQDN if exists, otherwise IP Address.| 
| Outgoing Interface |Set the email address for the policy notification email. <br /><br /> **Note**: Make sure you have configured a Mail Server in XSense. If no email address is entered, XSense does not send a notification email.| 
|Configure| Set up the following options to allow blocking of the suspicious sources by the FortiGate firewall: <br /><br />**Block illegal function codes**: Protocol violations - Illegal field value violating ICS protocol specification (potential exploit)<br /><br />**Block unauthorized PLC programming / firmware updates**: Unauthorized PLC changes<br /><br />**Block unauthorized PLC stop**: PLC stop (downtime)<br /><br />**Block malware related alerts**: Blocking of the industrial malware attempts (TRITON, NotPetya, etc.). You can select the option of **Automatic blocking**. In that case the blocking is executed automatically and immediately.<br /><br />*Block unauthorized scanning*: Unauthorized scanning (potential reconnaissance)

6. Click **Submit**.

## Block the suspicious source

1. In the **Alerts** pane, click the alert related to Fortinet integration.

    :::image type="content" source="media/integration-fortinet/image20.png" alt-text="Screenshot of Unauthorized PLC programming window":::

2. To automatically block the suspicious source, click **Block Source**.

    :::image type="content" source="media/integration-fortinet/image21.png" alt-text="Confirm window":::

3. In the **Please Confirm** dialog box, click **OK**.