---
title: About the Cisco ISE pxGrid integration
description: 
Author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 11/11/2020
ms.topic: article
ms.service: azure
---


# About the Cisco ISE pxGrid integration

CyberX delivers the only ICS and IIoT cybersecurity platform built by blue-team experts with a track record defending critical national infrastructure — and the only platform with patented ICS-aware threat analytics and machine learning. CyberX provides:

  - Immediate insights about ICS assets, vulnerabilities, as well as known and zero-day threats.

  - ICS-aware deep embedded knowledge of OT protocols, devices, applications — and their behaviors.

  - An automated ICS threat modeling technology to predict the most likely paths of targeted ICS attacks via proprietary analytics.

## Powerful asset visibility and control

The CyberX integration with Cisco ISE pxGrid provides a new level of centralized visibility, monitoring and control for the OT landscape.

These bridged platforms enable automated asset visibility and protection to previously unreachable ICS& IIoT assets.

### ICS and IIoT asset visibility: comprehensive and deep

Patented CyberX technologies ensure comprehensive and deep ICS and IIoT asset discovery and inventory management for enterprise data.

Device types, manufacturers, open ports, serial numbers, firmware revisions, IP/MAC address data and more are updated in real-time. Cyber X can further enhance visibility, discovery and analysis from this baseline by integrating with critical enterprise data sources, for example, CMDBs, DNS, Firewalls, and Web APIs.

In addition, the CyberX platform combines passive monitoring and optional selective probing techniques to provide the most accurate and detailed inventory of assets in industrial and critical infrastructure organizations.

### Bridged capabilities

Bridging these capabilities with Cisco ISE pxGrid, provides security teams unprecedented asset visibility to the enterprise ecosystem.

Seamless, robust integration with Cisco ISE pxGrid ensures no OT asset goes undiscovered and no asset information is missed.

:::image type="content" source="media/integration-cisco-isepxgrid-integration/image4.png" alt-text="Screenshot of the endpoint categories"::: 
 
:::image type="content" source="media/integration-cisco-isepxgrid-integration/image5.png" alt-text="Screenshot of the endpoints":::  

:::image type="content" source="media/integration-cisco-isepxgrid-integration/image6.png" alt-text="Screenshot of the attributes":::  

### Use Case Coverage: ISE Policies Based on CyberX Attributes

Use powerful ISE policies based on CyberX deep learning to handle ICS & IoT use case requirements.

Working with policies lets you close the security cycle and bring your network to compliance in real-time.

For example, customers can leverage CyberX ICS & IoT attributes to create policies that handle the following use cases, such as:

  - Create an Authorization policy to allow known and authorized assets into a sensitive zone based on allowed attributes - for example, specific firmware version for Rockwell Automation PLCs.

  - Notify security teams when an ICS device is detected in a non-OT zone.

  - Remediate machines with outdated or noncompliant vendors.

  - Quarantine and block devices as required.

  - Generate reports on PLCs or RTUs running firmware with known vulnerabilities (CVEs).

### About this guide

This guide describes how to set up pxGrid and the CyberX platform to ensure that CyberX injects OT attributes to Cisco ISE.

### Getting more information

For CyberX support and troubleshooting, contact: <support@cyberx-labs.com>.

For more information about CyberX capabilities, features and tools, refer to www.cyberx-labs.com.

For more information about Cisco ISE pxGrid integration requirements, refer to <https://www.cisco.com/c/en/us/products/security/pxgrid.html> 

## Integration system requirements

This section describes integration system requirements:

**CyberX Requirements**

  - CyberX version 2.5

**Cisco Requirements**

  - pxGrid version 2.0

  - Cisco ISE version 2.4

**Network Requirements**

  - Verify that the CyberX appliance has access to the Cisco ISE management interface.

  - Verify that you have CLI access to all CyberX appliances in your enterprise.

> [!NOTE]
> Only assets with MAC Addresses are synced with Cisco ISE pxGrid.

## Cisco ISE pxGrid setup

This section describes how to:

  - ***Set up Communication with pxGrid***

  - ***Subscribe to the Endpoint Asset Topic***

  - ***Generate Certificates***

  - ***Define pxGrid Settings***

## Set up communication with pxGrid

This section describes how to set up communication with pxGrid.

**To set up communication:**

1.  Log in to Cisco ISE.

2.  Select **Administration**>**System** and **Deploymen**t.

3.  Select the required node. In the General Settings tab select the **pxGrid checkbox**.

    :::image type="content" source="media/integration-cisco-isepxgrid-integration/image7.png" alt-text="Screenshot of the pxgrid checkbox":::

4.  Select the **Profiling Configuration** tab.

5.  Select the **pxGrid checkbox**. Add a description.

    :::image type="content" source="media/integration-cisco-isepxgrid-integration/image8.png" alt-text="Screenshot of the add discription":::

## Subscribe to the endpoint asset topic

Verify that the ISE pxGrid node has subscribed to the endpoint asset topic.

**To subscribe:**

1.  Select **Administration**>**pxGrid Services**>**Web Clients**. Verify you that see that ISE has subscribed to the endpoint asset topic.

## Generate certificates

This section describes how to generate certificates.

**To generate:**

1.  Select **Administration** > **pxGrid Services**, and then select **Certificates**.

    :::image type="content" source="media/integration-cisco-isepxgrid-integration/image9.png" alt-text="Screenshot of the select certificate":::

2.  In the **I want to** field, select **Generate a single certificate (without a certificate signing request)**.

3.  Enter the remaining fields and select Create.

    :::image type="content" source="media/integration-cisco-isepxgrid-integration/image10.png" alt-text="Screenshot of the generate a single certificate":::

4.  Create client certificate key and the server certificate, and convert them to java keystore format. You’ll need to copy these to each CyberX sensor in your network. ***See Set Up the CyberX*** for details.

## Define pxGrid settings

**To define settings:**

1.  Select **Administration>** **pxGrid Services** and then select **Settings**.

2.  Enable the Automatically approve new certificate-based accounts and **Allow password-based account creation.**

    :::image type="content" source="media/integration-cisco-isepxgrid-integration/image11.png" alt-text="Screenshot of the settings":::

## Set up the CyberX appliances

This section describes how to set up CyberX appliances to communicate with pxGrid. The configuration should be carried out on all CyberX appliances that will inject data to Cisco ISE.

**To set up appliances:**

1.  Login to the sensor CLI.

2.  Copy trust.jks and key.jks previously created to the sensor. It is recommended to copy to: `/var/cyberx/properties/`.

3.  Edit /var/cyberx/properties/pxgrid.properties:

    1.  Add key and trust store filenames and passwords.

    2.  Add the hostname of the pxGrid instance.

    3.  Enabled=true

4.  Restart the appliance.

5.  Repeat these steps for each appliance in your enterprise that will inject data.

## View and manage detections in Cisco ISE

1.  Endpoint detections are displayed in the ISE Context Visibility > Endpoints tab.

2.  Select Policy > Profiling > Add > Rules -> + Condition -> Create New Condition.

3.  Select Attribute and use IOTASSET dictionaries to build a profiling rule based on the attributes injected. The following attributes are injected.


      - Device Type
    
      - Hardware Revision
    
      - IP Address
    
      - MAC Address
    
      - Name
    
      - Product Id
    
      - Protocol
    
      - Serial Number
    
      - Software Revision
    
      - Vendor

Only devices with MAC Addresses are synced.

## Troubleshooting and logs

Logs can be found in:

  - /var/cyberx/logs/pxgrid.log

  - /var/cyberx/logs/core.log

