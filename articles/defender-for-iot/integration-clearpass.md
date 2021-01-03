---
title: ClearPass integration
description: 
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 12/9/2020
ms.topic: article
ms.service: azure
---

# Introduction

This Integration Guide covers the configuration and use of the integration between the Defender for IoT platform and ClearPass Policy Manager. The Defender for IoT platform delivers continuous ICS threat monitoring and device discovery, combining a deep embedded understanding of industrial protocols, devices, and applications with ICS-specific behavioral anomaly detection, threat intelligence, risk analytics, and automated threat modeling.

This integration focuses on the ability of Defender for IoT to detect, discover and classify OT and ICS endpoints and share information directly with ClearPass using the ClearPass Security Exchange framework and the open API.

Defender for IoT automatically updates the ClearPass Policy Manager Endpoint Database with endpoint classification data and several custom security attributes.

:::image type="content" source="media/integration-clearpass/compare.png" alt-text="Screenshot of Defender for IoT platform.":::

The integration allows the following:

- Viewing ICS and SCADA security threats identified by Defender for IoT security engines.

- Viewing device inventory information discovered by the Defender for IoT sensor, which delivers centralized visibility of network devices and endpoints across IT and OT infrastructure. From here a centralized endpoint and edge security policy can be defined and administered in the ClearPass system.

## About Defender for IoT and Aruba

Defender for IoT delivers the only industrial cybersecurity platform built by blue-team experts with a track record of defending critical national infrastructure. That difference is the foundation for the most widely deployed platform for continuously reducing IoT and ICS risk and preventing production outages, safety failures, and theft of intellectual property.

Notable Defender for IoT customers include 2 of the top 5 US energy providers; a top 5 global pharmaceutical company; a top 5 US chemical company; and national electric and gas utilities across Europe and Asia-Pacific. Strategic partners include Palo Alto Networks, HP Aruba, Splunk, Optiv Security, McAfee, DXC Technology, and Deutsche-Telekom and T-Systems.

Aruba ClearPass is a world-class Network Access Controller that provides agentless visibility and dynamic role-based access control for seamless security enforcement and response across your wired and wireless networks. Together with Defender for IoT, Aruba ClearPass extends network access controls to IoT and ICS networks. For example, relying on precise detail from the Defender for IoT platform, Aruba quarantines and blocks IoT and ICS devices based on zero-day threats. In addition, Aruba remediates machines with outdated or non-compliant software.

## Software requirements

This section covers:

- **Aruba ClearPass Requirements**

- **Defender for IoT Requirements**

### Aruba ClearPass requirements

At the time of writing, ClearPass version 6.8.0 is available and the recommended release. CPPM runs on hardware appliances with pre-installed software or as a Virtual Machine under the following hypervisors. Hypervisors that run on a client computer such as VMware Player are not supported.

- VMware ESXi 5.5, 6.0, 6.5, 6.6 or higher.

- Microsoft Hyper-V Server 2012 R2 or 2016 R2.

- Hyper-V on Microsoft Windows Server 2012 R2 or 2016 R2.

- KVM on CentOS 7.5 or later.

### Defender for IoT requirements

- Defender for IoT version 2.5.1 or higher.

## Configure ClearPass to integrate with Defender for IoT

Prior to creating and enabling the integration in Defender for IoT, carryout the following ClearPass configurations.

- **Create a ClearPass ‘API’ User**

- **Create a ClearPass Operator Profile**

- **Create a ClearPass OAuth API Client**

## Create a ClearPass ‘API’ user

As part of the communications channel between the two products, Defender for IoT uses a number of API’s {both TIPS and REST}, access to the TIPS API’s is validated via username and password combination credentials. This user Id needs to have minimum levels of access. Do not use a Super Administrator profile, use API Administrator as shown below.

To create a ClearPass API user:

1. In the left pane, select **Administration** > **Users and Privileges** and select **ADD**.

2. In the **Add Admin User** dialog box, set the following parameters:

    :::image type="content" source="media/integration-clearpass/policy-manager.png" alt-text="The administrator user's dialog box view.":::

    | Parameter | Description |
    |--|--|
    | **UserID** | Enter the user ID. |
    | **Name** | Enter the user name. |
    | **Password** | Enter the password. |
    | **Enable User** | Verify that this option is enabled. |
    | **Privilege Level** | Select **API Administrator**. |

3. Select **Add**.

## Create a ClearPass operator profile

Defender for IoT uses the REST API as part of the integration. REST APIs are authenticated under an OAuth framework. To sync with Defender for IoT, you need to create an API Client.

In order to secure access to only the REST API for the API Client, create a restricted access operator profile.

To create a ClearPass operator profile:

- In the Edit operator profile window, set all the options to **No Access** except for the following:

| Parameter | Description |
|--|--|
| **API Services** | Set to **Allow Access** |
| **Policy Manager** | Set the following: <br />- **Dictionaries**: **Attributes** set to **Read, Write, Delete**<br />- **Dictionaries**: **Fingerprintsset** to **Read, Write, Delete**<br />- **Identity**: **Endpoints** set to **Read, Write, Delete** |

:::image type="content" source="media/integration-clearpass/api-profile.png" alt-text="SThe edit operator profile.":::

:::image type="content" source="media/integration-clearpass/policy.png" alt-text="Select your option from the Policy Manager screen.":::

## Create a ClearPass OAuth API client

1. In the main window, select **Administrator** > **API Services** > **API Clients**.

2. In the **Create API Client** tab, set the following parameters:

    - **Operating Mode**: This parameter is used for API calls to ClearPass. Select **ClearPass REST API – Client**.

    - **Operator Profile:** Use the profile you created previously.

    - **Grant Type:** Set **Client credentials (grant_type = client_credentials)**.

3. Ensure you record the **Client Secret** and the client ID. For example, `defender-rest`.

    :::image type="content" source="media/integration-clearpass/aruba.png" alt-text="Screenshot of Create API Client.":::

4. In the Policy Manager, ensure you collected the following list of information before proceeding to the next step.

    - CPPM UserID

    - CPPM UserId Password

    - CPPM OAuth2 API Client ID

    - CPPM OAuth2 API Client Secret

## Defender for IoT attributes in ClearPass

As part of enabling the Defender for IoT - Aruba integration, Defender for IoT creates several custom Endpoint Dictionary attributes using the ClearPass REST API attribute. This is a record of the Dictionary Attributes created by Defender for IoT. These custom attributes can then be used for role-mapping and enforcement actions in a Service Policy.

:::image type="content" source="media/integration-clearpass/dictionary.png" alt-text="Screenshot of a social media post Description automatically generated":::

The Endpoint data is sent by Defender for IoT. It creates the Endpoints, sets the endpoint classification and also configures custom endpoint attributes.

An example of the data sent:

:::image type="content" source="media/integration-clearpass/endpoints.png" alt-text="The endpoint data that is listed.":::

Endpoint data can include the MAC address, MAC vendor, and other endpoint information resolved by Defender for IoT.

Other data, such as the date the endpoint was added and profiled is available. This is the time Defender for IoT updated ClearPass with the device data.

:::image type="content" source="media/integration-clearpass/edit-end.png" alt-text="Edit your criteria in the Endpoint tab.":::

In addition to the standard data, Defender for IoT supplies other customer attributes. Select the Attribute tab to view other attributes. This data can be used in a Policy.

:::image type="content" source="media/integration-clearpass/attributes.png" alt-text="A view of the attribute tab.":::

The "cyberx_authorized" flag is a way to distinguish known, recognized devices operating on the network from new, unexpected and potentially rogue devices that are detected.

Devices that are imported into the system from the customer's inventory list, or discovered during the learning phase, would have `authorized=true`, and new devices that are seen on the network after the learning phase ended would be added with `authorized=false`, until an administrator reviewed the device, decided it's a valid device operating on the network, at which point he could set it to `authorized=true`.

So the unauthorized devices are either unrecognized and potentially untrusted and malicious, or just haven't yet been handled by the administrator to authorize their presence on the network.

Another special attribute is the “cyberx_engineeringStation”, used to signify the function of an node in an OT and ICS system that is monitoring and being used to query and control OT devices. Engineering Stations should be protected and access to these devices specifically controlled an monitored. Knowing which devices on the network are signified for this role is important.

## Configure Defender for IoT to integrate with ClearPass

The ability to view device inventory information and viewing alerts discovered by Defender for IoT is configured separately as follows:

- To view device inventory: Configure ClearPass sync on the Defender for IoT sensor.

- To view the alerts: Define the ClearPass forwarding rule on the Defender for IoT sensor.

## Viewing device inventory

To enable viewing the device inventory in ClearPass, you need to set up Defender for IoT-ClearPass sync. When the sync configuration is complete, the Defender for IoT platform updates the ClearPass Policy Manager EndpointDb as it discovers new endpoints.

After configuring ClearPass Sync, the sensor Device Inventory is synced to the ClearPass, as follows:

- Only devices with Mac Address are synced. If a single device has multiple mac addresses, each is synced as a separate endpoint in ClearPass.

- Multicast and Broadcast devices are not synced, even if they have a Mac Address.

To configure ClearPass sync on the Defender for IoT sensor:

1. From the sensor left navigation pane, select **System Settings**.

    :::image type="content" source="media/integration-clearpass/clearpass-icon.png" alt-text="Select the ClearPass icon from the left side.":::

2. In the **System Settings** pane, select **ClearPass**.

    :::image type="content" source="media/integration-clearpass/settings.png" alt-text="Fill out the required information in the System Settings pane.":::

3. Set the following parameters:

    - **Enable Sync:** Enable the sync between Defender for IoT and ClearPass

    - **Sync Frequency:** Define the sync frequency in minutes. The default is 60 minutes. The minimum is 5 minutes.

    - **ClearPass IP Address:** The IP address of the ClearPass system with which Defender for IoT is in sync.

    - **Client ID:** The client ID that was created on ClearPass for syncing the data with Defender for IoT.

    - **Client Secret:** The client secret that was created on ClearPass for syncing the data with Defender for IoT.

    - **Username:** The ClearPass administrator user.

    - **Password:** The ClearPass administrator password.

4. Select **Save**.

## Viewing alerts

To enable viewing the alerts discovered by Defender for IoT in Aruba, you need to set the forwarding rule. This rule defines which information about the ICS and SCADA security threats identified by Defender for IoT security engines is sent to ClearPass.

To define the ClearPass forwarding rule on the Defender for IoT sensor:

1. In the left pane, select **Forwarding**.

    :::image type="content" source="media/integration-clearpass/forwarding.png" alt-text="The Forwarding pane with all of its options.":::

2. In the **Forwarding** pane, select **Create Forwarding Rule**.

    :::image type="content" source="media/integration-clearpass/rule.png" alt-text="Create a Forwarding Rule.":::

3. Add the name and the severity of the rule and then from the **Action** drop-down list, select **Send to**, **ClearPass**. The **ClearPass** integration parameters appear in the **Actions** pane.

    :::image type="content" source="media/integration-clearpass/actions.png" alt-text="Select your actions from the Actions pane.":::

4. In the **Actions** pane, set the following parameters:

| Parameter | Description |
|--|--|
| **Host** | Type the ClearPass server IP address. |
| **Port** | Type the port of the ClearPass on which the forwarding is done. |
| **Configure** | Set up the following options to allow viewing of Defender for IoT alerts in the ClearPass system: <br />- **Report illegal function codes:** Protocol violations - Illegal field value violating ICS protocol specification (potential exploit).<br />- **Report unauthorized PLC programming and firmware updates:** Unauthorized PLC changes.<br />- **Report unauthorized PLC stop:** PLC stop (downtime).<br />- **Report malware related alerts:** Industrial malware attempts, such as TRITON, NotPetya.<br />- **Report unauthorized scanning:** Unauthorized scanning (potential reconnaissance). |

5. Select **Submit**.

## Monitor ClearPass and Defender for IoT communication

Once the sync has started, endpoint data is populated directly into the Policy Manager EndpointDb, you can view the last update time from the integration configuration screen.

Reviewing **Last Sync** time to ClearPass:

:::image type="content" source="media/integration-clearpass/last-sync.png" alt-text="View the time and date of your last sync.":::

If Sync is not working or shows an error then it’s likely you’ve missed capturing some of the information. Recheck the data recorded, additionally you can view the API calls between Defender for IoT and ClearPass from **Guest** > **Administration** > **Support** > **Application Log**.

Example of API logs between Defender for IoT and ClearPass:

:::image type="content" source="media/integration-clearpass/log.png" alt-text="API logs between CyberX and ClearPass.":::
