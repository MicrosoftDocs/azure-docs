---
title: Investigate and detect threats for IoT devices | Microsoft Docs
description: This tutorial describes how to use the Microsoft Sentinel data connector and solution for Microsoft Defender for IoT to secure your entire  environment. Detect and respond to threats, including multistage attacks that may cross IT and OT boundaries.
ms.topic: tutorial
ms.date: 09/18/2022
ms.subservice: sentinel-integration
---

# Tutorial: Investigate and detect threats for IoT devices

The integration between Microsoft Defender for IoT and [Microsoft Sentinel](../../sentinel/index.yml) enable SOC teams to efficiently and effectively detect and respond to security threats across your network. Enhance your security capabilities with the [Microsoft Defender for IoT solution](../../sentinel/sentinel-solutions-catalog.md#domain-solutions), a set of bundled content configured specifically for Defender for IoT data that includes analytics rules, workbooks, and playbooks.

In this tutorial, you:

> [!div class="checklist"]
>
> * Install the **Microsoft Defender for IoT** solution in your Microsoft Sentinel workspace
> * Learn how to investigate Defender for IoT alerts in Microsoft Sentinel incidents
> * Learn about the analytics rules, workbooks, and playbooks deployed to your Microsoft Sentinel workspace with the **Microsoft Defender for IoT** solution

> [!IMPORTANT]
>
> The Microsoft Sentinel content hub experience is currently in **PREVIEW**, as is the **Microsoft Defender for IoT** solution. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites

Before you start, make sure you have:

- **Read** and **Write** permissions on your Microsoft Sentinel workspace. For more information, see [Permissions in Microsoft Sentinel](../../sentinel/roles.md).

- Completed [Tutorial: Connect Microsoft Defender for IoT with Microsoft Sentinel](iot-solution.md).

## Install the Defender for IoT solution

Microsoft Sentinel [solutions](../../sentinel/sentinel-solutions.md) can help you onboard Microsoft Sentinel security content for a specific data connector using a single process.

The **Microsoft Defender for IoT** solution integrates Defender for IoT data with Microsoft Sentinel's security orchestration, automation, and response (SOAR) capabilities by providing out-of-the-box and optimized playbooks for automated response and prevention capabilities.

**To install the solution**:

1. In Microsoft Sentinel, under **Content management**, select **Content hub** and then locate the **Microsoft Defender for IoT** solution.

1. At the bottom right, select **View details**, and then **Create**. Select the subscription, resource group, and workspace where you want to install the solution, and then review the related security content that will be deployed.

1. When you're done, select **Review + Create** to install the solution.

For more information, see [About Microsoft Sentinel content and solutions](../../sentinel/sentinel-solutions.md) and [Centrally discover and deploy out-of-the-box content and solutions](../../sentinel/sentinel-solutions-deploy.md).

## Detect threats out-of-the-box with Defender for IoT data

The **Microsoft Defender for IoT** data connector includes a default *Microsoft Security* rule named **Create incidents based on Azure Defender for IOT alerts**, which automatically creates new incidents for any new Defender for IoT alerts detected.

The **Microsoft Defender for IoT** solution includes a more detailed set of out-of-the-box analytics rules, which are built specifically for Defender for IoT data and fine-tune the incidents created in Microsoft Sentinel for relevant alerts.

**To use out-of-the-box Defender for IoT alerts**:

1. On the Microsoft Sentinel **Analytics** page, search for and disable the **Create incidents based on Azure Defender for IOT alerts** rule. This step prevents duplicate incidents from being created in Microsoft Sentinel for the same alerts.

1. Search for and enable any of the following out-of-the-box analytics rules, installed with the **Microsoft Defender for IoT** solution:

    | Rule Name | Description|
    | ---------- | ----------|
    | **Illegal function codes for ICS/SCADA traffic** | Illegal function codes in supervisory control and data acquisition (SCADA) equipment may indicate one of the following: <br><br>- Improper application configuration, such as due to a firmware update or reinstallation. <br>- Malicious activity. For example, a cyber threat that attempts to use illegal values within a protocol to exploit a vulnerability in the programmable logic controller (PLC), such as a buffer overflow.              |
    | **Firmware update**      | Unauthorized firmware updates may indicate malicious activity on the network, such as a cyber threat that attempts to manipulate PLC firmware to compromise PLC function.    |
    | **Unauthorized PLC changes**                     | Unauthorized changes to PLC ladder logic code may be one of the following: <br><br>- An indication of new functionality in the PLC. <br>- Improper configuration of an application, such as due to a firmware update or reinstallation. <br>- Malicious activity on the network, such as a cyber threat that attempts to manipulate PLC programming to compromise PLC function.          |
    | **PLC insecure key state**                      | The new mode may indicate that the PLC is not secure. Leaving the PLC in an insecure operating mode may allow adversaries to perform malicious activities on it, such as a program download. <br><br>If the PLC is compromised, devices and processes that interact with it may be impacted. which may affect overall system security and safety.      |
    | **PLC stop**  | The PLC stop command may indicate an improper configuration of an application that has caused the PLC to stop functioning, or malicious activity on the network. For example, a cyber threat that attempts to manipulate PLC programming to affect the functionality of the network.       |
    | **Suspicious malware found in the network**      | Suspicious malware found on the network indicates that suspicious malware is trying to compromise production.    |
    | **Multiple scans in the network**                | Multiple scans on the network can be an indication of one of the following: <br><br>- A new device on the network <br>- New functionality of an existing device <br>- Misconfiguration of an application, such as due to a firmware update or reinstallation <br>- Malicious activity on the network for reconnaissance    |
    | **Internet connectivity**                        | An OT device communicating with internet addresses may indicate an improper application configuration, such as anti-virus software attempting to download updates from an external server, or malicious activity on the network.     |
    | **Unauthorized device in the SCADA network**     | An unauthorized device on the network may be a legitimate, new device recently installed on the network, or an indication of unauthorized or even malicious activity on the network, such as a cyber threat attempting to manipulate the SCADA network.  |
    | **Unauthorized DHCP configuration in the SCADA network**    | An unauthorized DHCP configuration on the network may indicate a new, unauthorized device operating on the network. <br><br>This may be a legitimate, new device recently deployed on the network, or an indication of unauthorized or even malicious activity on the network, such as a cyber threat attempting to manipulate the SCADA network. |
    | **Excessive login attempts**                     | Excessive sign in attempts may indicate improper service configuration, human error, or malicious activity on the network, such as a cyber threat attempting to manipulate the SCADA network.  |
    | **High bandwidth in the network**                | An unusually high bandwidth may be an indication of a new service/process on the network, such as backup, or an indication of malicious activity on the network, such as a cyber threat attempting to manipulate the SCADA network.     |
    | **Denial of Service**    | This alert detects attacks that would prevent the use or proper operation of the DCS system.         |
    | **Unauthorized remote access to the network**    | Unauthorized remote access to the network can compromise the target device. <br><br> This means that if another device on the network is compromised, the target devices can be accessed remotely, increasing the attack surface.         |
    | **No traffic on Sensor Detected**    | A sensor that no longer detects network traffic indicates that the system may be insecure.         |

## Investigate Defender for IoT incidents

After you’ve [configured your Defender for IoT data to trigger new incidents in Microsoft Sentinel](#detect-threats-out-of-the-box-with-defender-for-iot-data), start investigating those incidents in Microsoft Sentinel [as you would other incidents](../../sentinel/investigate-cases.md).

**To investigate Microsoft Defender for IoT incidents**:

1. In Microsoft Sentinel, go to the **Incidents** page.

1. Above the incident grid, select the **Product name** filter and clear the  **Select all** option. Then, select **Microsoft Defender for IoT** to view only incidents triggered by Defender for IoT alerts. For example:

    :::image type="content" source="media/iot-solution/filter-incidents-defender-for-iot.png" alt-text="Screenshot of filtering incidents by product name for Defender for IoT devices." lightbox="media/iot-solution/filter-incidents-defender-for-iot.png":::

1. Select a specific incident to begin your investigation.

    In the incident details pane on the right, view details such as incident severity, a summary of the entities involved, any mapped MITRE ATT&CK tactics or techniques, and more. For example:

    :::image type="content" source="media/iot-solution/investigate-iot-incidents.png" alt-text="Screenshot of a Microsoft Defender for IoT incident in Microsoft Sentinel."lightbox="media/iot-solution/investigate-iot-incidents.png":::

1. Select **View full details** to open the incident details page, where you can drill down even more. For example:

    - Understand the incident's business impact and physical location using details, like an IoT device's site, zone, sensor name, and device importance.

    - Learn about recommended remediation steps by selecting an alert in the incident timeline and viewing the **Remediation steps** area.

    - Select an IoT device entity from the **Entities** list to open its [device entity page](../../sentinel/entity-pages.md). For more information, see [Investigate further with IoT device entities](#investigate-further-with-iot-device-entities). 

For more information, see [Investigate incidents with Microsoft Sentinel](../../sentinel/investigate-cases.md).

> [!TIP]
> To investigate the incident in Defender for IoT, select the **Investigate in Microsoft Defender for IoT** link at the top of the incident details pane on the **Incidents** page.

### Investigate further with IoT device entities

When you are investigating an incident in Microsoft Sentinel and have the incident details pane open on the right, select an IoT device entity from the **Entities** list to view more details about the selected entity. Identify an *IoT device* by the IoT device icon: :::image type="icon" source="media/iot-solution/iot-device-icon.png" border="false":::

If you don't see your IoT device entity right away, select **View full details** to open the full incident page, and then check the **Entities** tab. Select an IoT device entity to view more entity data, like basic device details, owner contact information, and a timeline of events that occurred on the device.

To drill down even further, select the IoT device entity link and open the device entity details page, or hunt for vulnerable devices on the Microsoft Sentinel **Entity behavior** page. For example, view the top five IoT devices with the highest number of alerts, or search for a device by IP address or device name:

:::image type="content" source="media/iot-solution/entity-behavior-iot-devices-alerts.png" alt-text="Screenshot of IoT devices by number of alerts on entity behavior page.":::

For more information, see [Investigate entities with entity pages in Microsoft Sentinel](../../sentinel/entity-pages.md) and [Investigate incidents with Microsoft Sentinel](../../sentinel/investigate-cases.md).

### Investigate the alert in Defender for IoT

To open an alert in Defender for IoT for further investigation, including the ability to [access alert PCAP data](how-to-manage-cloud-alerts.md#access-alert-pcap-data), go to your incident details page and select  **Investigate in Microsoft Defender for IoT**. For example:

:::image type="content" source="media/iot-solution/investigate-in-iot.png" alt-text="Screenshot of the Investigate in Microsoft Defender for IoT option.":::

The Defender for IoT alert details page opens for the related alert. For more information, see [Investigate and respond to an OT network alert](respond-ot-alert.md).

## Visualize and monitor Defender for IoT data

To visualize and monitor your Defender for IoT data, use the workbooks deployed to your Microsoft Sentinel workspace as part of the [Microsoft Defender for IoT](#install-the-defender-for-iot-solution) solution.

The Defenders for IoT workbooks provide guided investigations for OT entities based on open incidents, alert notifications, and activities for OT assets. They also provide a hunting experience across the MITRE ATT&CK® framework for ICS, and are designed to enable analysts, security engineers, and MSSPs to gain situational awareness of OT security posture.

View workbooks in Microsoft Sentinel on the **Threat management > Workbooks > My workbooks** tab. For more information, see [Visualize collected data](../../sentinel/get-visibility.md).

The following table describes the workbooks included in the **Microsoft Defender for IoT** solution:

|Workbook  |Description  |Logs  |
|---------|---------|---------|
|**Overview**     | Dashboard displaying a summary of key metrics for device inventory, threat detection and vulnerabilities.         |    Uses data from Azure Resource Graph (ARG)      |
|**Device Inventory**     | Displays data such as: OT device name, type, IP address, Mac address, Model, OS, Serial Number, Vendor, Protocols, Open alerts, and CVEs and recommendations per device.  Can be filtered by site, zone, and sensor.       |    Uses data from Azure Resource Graph (ARG)      |
|**Incidents**     |   Displays data such as: <br><br>- Incident Metrics, Topmost Incident, Incident over time, Incident by Protocol, Incident by Device Type, Incident by Vendor, and Incident by IP address.<br><br>- Incident by Severity, Incident Mean time to respond, Incident Mean time to resolve and Incident close reasons.       |   Uses data from the following log: `SecurityAlert`       |
|**Alerts**     |  Displays data such as: Alert Metrics, Top Alerts, Alert over time, Alert by Severity, Alert by Engine, Alert by Device Type, Alert by Vendor and Alert by IP address.         |    Uses data from Azure Resource Graph (ARG)     |
|**MITRE ATT&CK® for ICS**     |   Displays data such as: Tactic Count, Tactic Details, Tactic over time, Technique Count.        |   Uses data from the following log: `SecurityAlert`       |
|**Vulnerabilities**     | Displays vulnerabilities and CVEs for vulnerable devices. Can be filtered by device site and CVE severity.         |    Uses data from Azure Resource Graph (ARG)      |

## Automate response to Defender for IoT alerts

[Playbooks](../../sentinel/tutorial-respond-threats-playbook.md) are collections of automated remediation actions that can be run from Microsoft Sentinel as a routine. A playbook can help automate and orchestrate your threat response; it can be run manually or set to run automatically in response to specific alerts or incidents, when triggered by an analytics rule or an automation rule, respectively.

The [Microsoft Defender for IoT](#install-the-defender-for-iot-solution) solution includes out-of-the-box playbooks that provide the following functionality:

- [Automatically close incidents](#automatically-close-incidents)
- [Send email notifications by production line](#send-email-notifications-by-production-line)
- [Create a new ServiceNow ticket](#create-a-new-servicenow-ticket)
- [Update alert statuses in Defender for IoT](#update-alert-statuses-in-defender-for-iot)
- [Automate workflows for incidents with active CVEs](#automate-workflows-for-incidents-with-active-cves)
- [Send email to the IoT/OT device owner](#send-email-to-the-iotot-device-owner)
- [Triage incidents involving highly important devices](#triage-incidents-involving-highly-important-devices)

Before using the out-of-the-box playbooks, make sure to perform the prerequisite steps as listed [below](#playbook-prerequisites).

For more information, see:

- [Tutorial: Use playbooks with automation rules in Microsoft Sentinel](../../sentinel/tutorial-respond-threats-playbook.md)
- [Automate threat response with playbooks in Microsoft Sentinel](../../sentinel/automate-responses-with-playbooks.md)

### Playbook prerequisites

Before using the out-of-the-box playbooks, make sure you perform the following prerequisites, as needed for each playbook:

- [Ensure valid playbook connections](#ensure-valid-playbook-connections)
- [Add a required role to your subscription](#add-a-required-role-to-your-subscription)
- [Connect your incidents, relevant analytics rules, and the playbook](#connect-your-incidents-relevant-analytics-rules-and-the-playbook)

#### Ensure valid playbook connections

This procedure helps ensure that each connection step in your playbook has valid connections, and is required for all solution playbooks.

**To ensure your valid connections**:

1. In Microsoft Sentinel, open the playbook from **Automation** > **Active playbooks**.

1. Select a playbook to open it as a Logic app.

1. With the playbook opened as a Logic app, select **Logic app designer**. Expand each step in the logic app to check for invalid connections, which are indicated by an orange warning triangle. For example:

    :::image type="content" source="media/iot-solution/connection-steps.png" alt-text="Screenshot of the default AD4IOT AutoAlertStatusSync playbook." lightbox="media/iot-solution/connection-steps.png":::

    > [!IMPORTANT]
    > Make sure to expand each step in the logic app. Invalid connections may be hiding inside other steps.

1. Select **Save**.

#### Add a required role to your subscription

This procedure describes how to add a required role to the Azure subscription where the playbook is installed, and is required only for the following playbooks:

- [AD4IoT-AutoAlertStatusSync](#update-alert-statuses-in-defender-for-iot)
- [AD4IoT-CVEAutoWorkflow](#automate-workflows-for-incidents-with-active-cves)
- [AD4IoT-SendEmailtoIoTOwner](#send-email-to-the-iotot-device-owner)
- [AD4IoT-AutoTriageIncident](#triage-incidents-involving-highly-important-devices)

Required roles differ per playbook, but the steps remain the same.

**To add a required role to your subscription**:

1. In Microsoft Sentinel, open the playbook from **Automation** > **Active playbooks**.

1. Select a playbook to open it as a Logic app.

1. With the playbook opened as a Logic app, select **Identity > System assigned**, and then in the **Permissions** area, select the **Azure role assignments** button.

1. In the **Azure role assignments** page, select **Add role assignment**.

1. In the **Add role assignment** pane:

    1. Define the **Scope** as **Subscription**.

    1. From the dropdown, select the **Subscription** where your playbook is installed.

    1. From the **Role** dropdown, select one of the following roles, depending on the playbook you’re working with:

        |Playbook name  |Role  |
        |---------|---------|
        |[AD4IoT-AutoAlertStatusSync](#update-alert-statuses-in-defender-for-iot)  |Security Admin  |
        |[AD4IoT-CVEAutoWorkflow](#automate-workflows-for-incidents-with-active-cves)  |Reader  |
        |[AD4IoT-SendEmailtoIoTOwner](#send-email-to-the-iotot-device-owner)  |Reader  |
        |[AD4IoT-AutoTriageIncident](#triage-incidents-involving-highly-important-devices)  |Reader  |

1. When you're done, select **Save**.

#### Connect your incidents, relevant analytics rules, and the playbook

This procedure describes how to configure a Microsoft Sentinel analytics rule to automatically run your playbooks based on an incident trigger, and is required for all solution playbooks.

**To add your analytics rule**:

1. In Microsoft Sentinel, go to **Automation** > **Automation rules**.

1. To create a new automation rule, select **Create** > **Automation rule**.

1. In the **Trigger** field, select one of the following triggers, depending on the playbook you’re working with:

    - The [AD4IoT-AutoAlertStatusSync](#update-alert-statuses-in-defender-for-iot) playbook: Select the **When an incident is updated** trigger
    - All other solution playbooks: Select the **When an incident is created** trigger

1. In the **Conditions** area, select **If > Analytic rule name > Contains**, and then select the specific analytics rules relevant for Defender for IoT in your organization.

    For example:

    :::image type="content" source="media/iot-solution/automate-playbook.png" alt-text="Screenshot of a Defender for IoT alert status sync automation rule." lightbox="media/iot-solution/automate-playbook.png":::

    You may be using out-of-the-box analytics rules, or you may have modified the out-of-the-box content, or created your own. For more information, see [Detect threats out-of-the-box with Defender for IoT data](#detect-threats-out-of-the-box-with-defender-for-iot-data).

1. In the **Actions** area, select **Run playbook** > *playbook name*.

1. Select **Run**.

> [!TIP]
> You can also manually run a playbook on demand. This can be useful in situations where you want more control over orchestration and response processes. For more information, see [Run a playbook on demand](../../sentinel/tutorial-respond-threats-playbook.md#run-a-playbook-on-demand).

### Automatically close incidents

**Playbook name**: AD4IoT-AutoCloseIncidents

In some cases, maintenance activities generate alerts in Microsoft Sentinel that can distract a SOC team from handling the real problems. This playbook automatically closes incidents created from such alerts during a specified maintenance period, explicitly parsing the IoT device entity fields.

To use this playbook:

- Enter the relevant time period when the maintenance is expected to occur, and the IP addresses of any relevant assets, such as listed in an Excel file.
- Create a watchlist that includes all the asset IP addresses on which alerts should be handled automatically.

### Send email notifications by production line

**Playbook name**: AD4IoT-MailByProductionLine

This playbook sends mail to notify specific stakeholders about alerts and events that occur in your environment.

For example, when you have specific security teams assigned to specific product lines or geographic locations, you'll want that team to be notified about alerts that are relevant to their responsibilities.

To use this playbook, create a watchlist that maps between the sensor names and the mailing addresses of each of the stakeholders you want to alert.

### Create a new ServiceNow ticket

**Playbook name**: AD4IoT-NewAssetServiceNowTicket

Typically, the entity authorized to program a PLC is the Engineering Workstation. Therefore, attackers might create new Engineering Workstations in order to create malicious PLC programming.

This playbook opens a ticket in ServiceNow each time a new Engineering Workstation is detected, explicitly parsing the IoT device entity fields.

### Update alert statuses in Defender for IoT

**Playbook name**: AD4IoT-AutoAlertStatusSync

This playbook updates alert statuses in Defender for IoT whenever a related alert in Microsoft Sentinel has a **Status** update.

This synchronization overrides any status defined in Defender for IoT, in the Azure portal or the sensor console, so that the alert statuses match that of the related incident.

### Automate workflows for incidents with active CVEs

**Playbook name**: AD4IoT-CVEAutoWorkflow

This playbook adds active CVEs into the incident comments of affected devices. An automated triage is performed if the CVE is critical, and an email notification is sent to the device owner, as defined on the site level in Defender for IoT.

To add a device owner, edit the site owner on the **Sites and sensors** page in Defender for IoT. For more information, see [Site management options from the Azure portal](how-to-manage-sensors-on-the-cloud.md#site-management-options-from-the-azure-portal).

### Send email to the IoT/OT device owner

**Playbook name**: AD4IoT-SendEmailtoIoTOwner

This playbook sends an email with the incident details to the device owner as defined on the site level in Defender for IoT, so that they can start investigating, even responding directly from the automated email. Response options include:

- **Yes this is expected**. Select this option to close the incident.

- **No this is NOT expected**. Select this option to keep the incident active, increase the severity, and add a confirmation tag to the incident.

The incident is automatically updated based on the response selected by the device owner.

To add a device owner, edit the site owner on the **Sites and sensors** page in Defender for IoT. For more information, see [Site management options from the Azure portal](how-to-manage-sensors-on-the-cloud.md#site-management-options-from-the-azure-portal).

### Triage incidents involving highly important devices

**Playbook name**: AD4IoT-AutoTriageIncident

This playbook updates the incident severity according to the importance level of the devices involved.

## Next steps

> [!div class="nextstepaction"]
> [Visualize data](../../sentinel/get-visibility.md)

> [!div class="nextstepaction"]
> [Create custom analytics rules](../../sentinel/detect-threats-custom.md)

> [!div class="nextstepaction"]
> [Investigate incidents](../../sentinel/investigate-cases.md)

> [!div class="nextstepaction"]
> [Investigate entities](../../sentinel/entity-pages.md)

> [!div class="nextstepaction"]
> [Use playbooks with automation rules](../../sentinel/tutorial-respond-threats-playbook.md)

For more information, see our blog: [Defending Critical Infrastructure with the Microsoft Sentinel: IT/OT Threat Monitoring Solution](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/defending-critical-infrastructure-with-the-microsoft-sentinel-it/ba-p/3061184)
