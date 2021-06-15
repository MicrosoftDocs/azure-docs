---
title: About the Cisco ISE pxGrid integration
description: Bridging the capabilities of Defender for IoT with Cisco ISE pxGrid, provides security teams unprecedented device visibility to the enterprise ecosystem.
ms.date: 12/28/2020
ms.topic: how-to
---

# About the Cisco ISE pxGrid integration

Defender for IoT delivers the only ICS and IoT cybersecurity platform built by blue-team experts with a track record defending critical national infrastructure, and the only platform with patented ICS-aware threat analytics and machine learning. Defender for IoT provides:

- Immediate insights about ICS devices, vulnerabilities, and known and zero-day threats.

- ICS-aware deep embedded knowledge of OT protocols, devices, applications, and their behaviors.

- An automated ICS threat modeling technology to predict the most likely paths of targeted ICS attacks via proprietary analytics.

## Powerful device visibility and control

The Defender for IoT integration with Cisco ISE pxGrid provides a new level of centralized visibility, monitoring, and control for the OT landscape.

These bridged platforms enable automated device visibility and protection to previously unreachable ICS and IIoT devices.

### ICS and IIoT device visibility: comprehensive and deep

Patented Defender for IoT technologies ensures comprehensive and deep ICS and IIoT device discovery and inventory management for enterprise data.

Device types, manufacturers, open ports, serial numbers, firmware revisions, IP addresses, and MAC address data and more are updated in real time. Defender for IoT can further enhance visibility, discovery, and analysis from this baseline by integrating with critical enterprise data sources. For example, CMDBs, DNS, Firewalls, and Web APIs.

In addition, the Defender for IoT platform combines passive monitoring and optional selective probing techniques to provide the most accurate and detailed inventory of devices in industrial and critical infrastructure organizations.

### Bridged capabilities

Bridging these capabilities with Cisco ISE pxGrid, provides security teams unprecedented device visibility to the enterprise ecosystem.

Seamless, robust integration with Cisco ISE pxGrid ensures no OT device goes undiscovered and no device information is missed.

:::image type="content" source="media/integration-cisco-isepxgrid-integration/endpoint-categories.png" alt-text="Sample of the endpoint categories OUI.":::

:::image type="content" source="media/integration-cisco-isepxgrid-integration/endpoints.png" alt-text="Sample endpoints in the system":::  

:::image type="content" source="media/integration-cisco-isepxgrid-integration/attributes.png" alt-text="Screenshot of the attributes located in the system.":::  

### Use case coverage: ISE policies based on Defender for IoT attributes

Use powerful ISE policies based on Defender for IoT deep learning to handle ICS and IoT use case requirements.

Working with policies lets you close the security cycle and bring your network to compliance in real time.

For example, customers can use Defender for IoT ICS and IoT attributes to create policies that handle the following use cases, such as:

- Create an authorization policy to allow known and authorized devices into a sensitive zone based on allowed attributes - for example, specific firmware version for Rockwell Automation PLCs.

- Notify security teams when an ICS device is detected in a non-OT zone.

- Remediate machines with outdated or noncompliant vendors.

- Quarantine and block devices as required.

- Generate reports on PLCs or RTUs running firmware with known vulnerabilities (CVEs).

### About this article

This article describes how to set up pxGrid and the Defender for IoT platform to ensure that Defender for IoT injects OT attributes to Cisco ISE.

### Getting more information

For more information about Cisco ISE pxGrid integration requirements, see <https://www.cisco.com/c/en/us/products/security/pxgrid.html>

## Integration system requirements

This article describes integration system requirements:

Defender for IoT requirements

- Defender for IoT version 2.5

Cisco requirements

- pxGrid version 2.0

- Cisco ISE version 2.4

Network requirements

- Verify that the Defender for IoT appliance has access to the Cisco ISE management interface.

- Verify that you have CLI access to all Defender for IoT appliances in your enterprise.

> [!NOTE]
> Only devices with MAC addresses are synced with Cisco ISE pxGrid.

## Cisco ISE pxGrid setup

This article describes how to:

- Set up communication with pxGrid

- Subscribe to the endpoint device topic

- Generate certificates

- Define pxGrid settings

## Set up communication with pxGrid

This article describes how to set up communication with pxGrid.

To set up communication:

1. Sign in to Cisco ISE.

1. Select **Administration**>**System** and **Deployment**.

1. Select the required node. In the General Settings tab, select the **pxGrid checkbox**.

    :::image type="content" source="media/integration-cisco-isepxgrid-integration/pxgrid.png" alt-text="Ensure the pxgrid checkbox is selected.":::

1. Select the **Profiling Configuration** tab.

1. Select the **pxGrid checkbox**. Add a description.

    :::image type="content" source="media/integration-cisco-isepxgrid-integration/profile-configuration.png" alt-text="Screenshot of the add description":::

## Subscribe to the endpoint device topic

Verify that the ISE pxGrid node has subscribed to the endpoint device topic. Navigate to **Administration**>**pxGrid Services**>**Web Clients**. There, you can verify that ISE has subscribed to the endpoint device topic.

## Generate certificates

This article describes how to generate certificates.

To generate:

1. Select **Administration** > **pxGrid Services**, and then select **Certificates**.

    :::image type="content" source="media/integration-cisco-isepxgrid-integration/certificates.png" alt-text="Select the certificates tab in order to generate a certificate.":::

1. In the **I Want To** field, select **Generate a single certificate (without a certificate signing request)**.

1. Fill in the remaining fields and select **Create**.

1. Create the client certificate key and the server certificate, and then convert them to java keystore format. You’ll need to copy these to each Defender for IoT sensor in your network.

## Define pxGrid settings

To define settings:

1. Select **Administration** > **pxGrid Services** and then select **Settings**.

1. Enable the **Automatically approve new certificate-based accounts** and **Allow password-based account creation.**

  :::image type="content" source="media/integration-cisco-isepxgrid-integration/allow-these.png" alt-text="Ensure both checkboxes are selected.":::

## Set up the Defender for IoT appliances

This article describes how to set up Defender for IoT appliances to communicate with pxGrid. The configuration should be carried out on all Defender for IoT appliances that will inject data to Cisco ISE.

To set up appliances:

1. Sign in to the sensor CLI.

1. Copy `trust.jks`, and  , which were previously created on the sensor. Copy them to: `/var/cyberx/properties/`.

1. Edit `/var/cyberx/properties/pxgrid.properties`:

    1. Add a key and trust, then store filenames and passwords.

    2. Add the hostname of the pxGrid instance.

    3. `Enabled=true`

1. Restart the appliance.

1. Repeat these steps for each appliance in your enterprise that will inject data.

## View and manage detections in Cisco ISE

1. Endpoint detections are displayed in the ISE Context **Visibility** > **Endpoints** tab.

1. Select **Policy** > **Profiling** > **Add** > **Rules** > **+ Condition** > **Create New Condition**.

1. Select **Attribute** and use the IOT device dictionaries to build a profiling rule based on the attributes injected. The following attributes are injected.

    - Device type

    - Hardware revision

    - IP address

    - MAC address

    - Name

    - Product ID

    - Protocol

    - Serial number

    - Software revision

    - Vendor

Only devices with MAC addresses are synced.

## Troubleshooting and logs

Logs can be found in:

- `/var/cyberx/logs/pxgrid.log`

- `/var/cyberx/logs/core.log`

## Next steps

Learn how to [Forward alert information](how-to-forward-alert-information-to-partners.md).
