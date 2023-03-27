---
title: Zero Trust and your OT networks - Microsoft Defender for IoT
description: Learn about how implementing a Zero Trust security strategy with Microsoft Defender for IoT can protect your operational technology (OT) networks.
ms.date: 02/15/2023
ms.topic: conceptual
ms.collection:
  -       zerotrust-services
---

# Zero Trust and your OT networks

[!INCLUDE [zero-trust-principles](../../../includes/security/zero-trust-principles.md)]

Implement Zero Trust principles across your operational technology (OT) networks to help you with challenges, such as:

- Controlling remote connections into your OT systems, securing your network jump posts, and preventing lateral movement across your network

- Reviewing and reducing interconnections between dependent systems, simplifying identity processes, such as for contractors signing into your network

- Finding single points of failure in your network, identifying issues in specific network segments, and reducing delays and bandwidth bottlenecks

## Unique risks and challenges for OT networks

OT network architectures often differ from traditional IT infrastructure.  OT systems use unique technology with proprietary protocols, and may have aging platforms and limited connectivity and power. OT networks also may have specific safety requirements and unique exposures to physical or local attacks, such as via external contractors signing into your network.

Since OT systems often support critical network infrastructures, they're often designed to prioritize physical safety or availability over secure access and monitoring. For example, your OT networks might function separately from other enterprise network traffic to avoid downtime for regular maintenance or to mitigate specific security issues.

As more OT networks migrate to cloud-based environments, applying Zero Trust principles may present specific challenges. For example:

- OT systems may not be designed for multiple users and role-based access policies, and may only have simple authentication processes.
- OT systems may not have the processing power available to fully apply secure access policies, and instead trust all traffic received as safe.
- Aging technology presents challenges in retaining organizational knowledge, applying updates, and using standard security analytics tools to get visibility and drive threat detection.

However, a security compromise in your mission critical systems can lead to real-world consequences beyond traditional IT incidents, and non-compliance can affect your organization's ability to conform to government and industry regulations.

## Applying Zero Trust principles to OT networks

Continue to apply the same Zero Trust principles in your OT networks as you would in traditional IT networks, but with some logistical modifications as needed. For example:

- **Make sure that all connections between networks and devices are identified and managed**, preventing unknown interdependencies between systems and containing any unexpected downtime during maintenance procedures.

    Since some OT systems may not support all of the security practices you need, we recommend limiting connections between networks and devices to a limited number of jump hosts. Jump hosts can then be used to start remote sessions with other devices.

    Make sure your jump hosts have stronger security measures and authentication practices, such as multi-factor authentication and privileged access management systems.

- **Segment your network to limit data access**, ensuring that all communication between devices and segments is encrypted and secured, and preventing lateral movement between systems. For example, make sure that all devices that access the network are pre-authorized and secured according to your organization's policies.

    You may need to trust communication across your entire industrial control and safety information systems (ICS and SIS). However, you can often further segment your network into smaller areas, making it easier to monitor for security and maintenance.

- **Evaluate signals like device location, health, and behavior**, using health data to gate access or flag for remediation. Require that devices must be up-to-date for access, and use analytics to get visibility and scale defenses with automated responses.

- **Continue to monitor security metrics**, such as authorized devices and your network traffic baseline, to ensure that your security perimeter retains its integrity and changes in your organization happen over time. For example, you may need to modify your segments and access policies as people, devices, and systems change.

## Zero Trust with Defender for IoT

Deploy [Microsoft Defender for IoT network sensors](architecture.md) to detect devices and monitor traffic across your OT networks. Defender for IoT assesses your devices for vulnerabilities and provides risk-based mitigation steps, and continuously monitors your devices for anomalous or unauthorized behavior.

When [deploying OT network sensors](onboard-sensors.md), use *sites*, and *zones* to segment your network.

- **Sites** reflect many devices grouped by a specific geographical location, such the office at a specific address.
- **Zones** reflect a logical segment within a site to define a functional area, such as a specific production line. 

Assign each OT sensor to a specific site and zone to ensure that each OT sensor covers a specific area of the network. Segmenting your sensor across sites and zones helps you monitor for any traffic passing between segments and enforce security policies for each zone.

Make sure to assign [site-based access policies](manage-users-portal.md#manage-site-based-access-control-public-preview) so that you can provide least-privileged access to Defender for IoT data and activities.

For example, if your growing company has factories and offices in Paris, Lagos, Dubai, and Tianjin, you might segment your network as follows:

|Site  |Zones  |
|---------|---------|
|**Paris office**     |    - Ground floor (Guests) <br>- Floor 1 (Sales)  <br>- Floor 2 (Executive)        |
|**Lagos office**     |   - Ground floor (Offices) <br>- Floors 1-2 (Factory)      |
|**Dubai office**     |     - Ground floor (Convention center) <br>- Floor 1 (Sales)<br>- Floor 2 (Offices)     |
|**Tianjin office**     |   - Ground floor (Offices) <br>- Floors 1-2 (Factory)        |

### Zero Trust and air-gapped environments

If you're working with a large, air-gapped environment, we recommend that you [deploy an on-premises management console](ot-deploy/install-software-on-premises-management-console.md) for central maintenance and security monitoring. Use the on-premises management console to create sites and zones across all connected OT sensors.

> [!NOTE]
> Sites and zones configured on the Azure portal are not synchronized with sites and zones configured on an on-premises management console. 
>
> If you're working with a large deployment, we recommend that you use the Azure portal to manage cloud-connected sensors, and the on-premises management console to manage locally-managed sensors.

## Next steps

Create sites and zones as you onboard OT sensors in the Azure portal, and assign site-based access policies to your Azure users. 

If you're working in an air-gapped environment with an on-premises management console, create OT site and zones directly on the on-premises management console.

Use built-in Defender for IoT workbooks and create custom workbooks of your own to monitor your security perimeter over time.

For more information, see:

- [Create sites and zones when onboarding an OT sensor](onboard-sensors.md)
- [Create OT sites and zones on an on-premises management console](ot-deploy/sites-and-zones-on-premises.md)
- [Manage site-based access control](manage-users-portal.md#manage-site-based-access-control-public-preview)
- [Monitor your OT network with Zero Trust principles](monitor-zero-trust.md)

For more information, see:

- [Azure user roles and permissions for Defender for IoT](roles-azure.md)
- [Zero Trust Guidance Center](/security/zero-trust/zero-trust-overview)
- White paper: [Zero Trust Cybersecurity for the Internet of Things](https://azure.microsoft.com/mediahandler/files/resourcefiles/zero-trust-cybersecurity-for-the-internet-of-things/Zero%20Trust%20Security%20Whitepaper_4.30_3pm.pdf)
