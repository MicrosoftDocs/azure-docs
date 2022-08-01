---
title: Integrations with partner services - Microsoft Defender for IoT
description: Learn about supported integrations with Microsoft Defender for IoT.
ms.date: 06/21/2022
ms.topic: overview
---

# Integrations with partner services

Integrate Microsoft Defender for Iot with partner services to view partner data in Defender for IoT, or to view Defender for IoT data in a partner service.

## Supported integrations

The following table lists available integrations for Microsoft Defender for IoT, as well as links for specific configuration information.


|Partner service  |Description | Learn more  |
|---------|---------|---------|
|**Aruba ClearPass**     | Share Defender for IoT data with ClearPass Security Exchange and update the ClearPass Policy Manager Endpoint Database with Defender for IoT data. | [Integrate ClearPass with Microsoft Defender for IoT](tutorial-clearpass.md)       |
|**CyberArk**     | Send CyberArk PSM syslog data on remote sessions and verification failures to Defender for IoT for data correlation.   | [Integrate CyberArk with Microsoft Defender for IoT](tutorial-cyberark.md)       |
|**Forescout**     | Automate actions in Forescout based on activity detected by Defender for IoT, and correlate Defender for IoT data with other *Forescout eyeExtended* modules that oversee monitoring, incident management, and device control.  | [Integrate Forescout with Microsoft Defender for IoT](tutorial-forescout.md)      |
|**Fortinet**     | Send Defender for IoT data to Fortinet services for: <br><br>- Enhanced network visibility in FortiSIEM<br>- Extra abilities in FortiGate to stop anomalous behavior    | [Integrate Fortinet with Microsoft Defender for IoT](tutorial-fortinet.md)     |
|**Palo Alto**     |Use Defender for IoT data to block critical threats with Palo Alto firewalls, either with automatic blocking or with blocking recommendations.   | [Integrate Palo-Alto with Microsoft Defender for IoT](tutorial-palo-alto.md)      |
|**QRadar**     |Forward Defender for IoT alerts to IBM QRadar.   | [Integrate Qradar with Microsoft Defender for IoT](tutorial-qradar.md)      |
|**ServiceNow**     |  View Defender for IoT device detections, attributes, and connections in ServiceNow.   | [Integrate ServiceNow with Microsoft Defender for IoT](tutorial-servicenow.md)    |
| **Splunk** | Send Defender for IoT alerts to Splunk | [Integrate Splunk with Microsoft Defender for IoT](tutorial-splunk.md) |
|**Axonius Cybersecurity Asset Management**    | Import and manage device inventory discovered by Defender for IoT in your Axonius instance. | [Axonius documentation](https://docs.axonius.com/docs/azure-defender-for-iot)       |

## Next steps

For more information, see:

**Device inventory**:

- [Use the Device inventory in the Azure portal](how-to-manage-device-inventory-for-organizations.md)
- [Use the Device inventory in the OT sensor](how-to-investigate-sensor-detections-in-a-device-inventory.md)
- [Use the Device inventory in the on-premises management console](how-to-investigate-all-enterprise-sensor-detections-in-a-device-inventory.md)

**Alerts**:

- [View alerts in the Azure portal](how-to-manage-cloud-alerts.md)
- [View alerts in the OT sensor](how-to-view-alerts.md)
- [View alerts in the on-premises management console](how-to-work-with-alerts-on-premises-management-console.md)
