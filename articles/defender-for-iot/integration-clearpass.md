---
title: ClearPass integration
description: 
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 11/11/2020
ms.topic: article
ms.service: azure
---

# 1. Introduction

This Integration Guide covers the configuration and use of the integration between the CyberX platform and ClearPass Policy Manager. The CyberX platform delivers continuous ICS threat monitoring and asset discovery, combining a deep embedded understanding of industrial protocols, devices, and applications with ICS-specific behavioral anomaly detection, threat intelligence, risk analytics, and automated threat modeling.

This integration focuses on the ability of CyberX to detect, discover and classify OT/ICS endpoints and share information directly with ClearPass using the ClearPass Security Exchange framework and the open API.

CyberX automatically updates the ClearPass Policy Manager Endpoint Database with endpoint classification data and several custom security attributes.

:::image type="content" source="media/integration-clearpass/image1.png" alt-text="Screenshot of CyberX platform.":::

The integration allows the following:

- Viewing ICS/SCADA security threats identified by CyberX security engines.

- Viewing asset inventory information discovered by the CyberX sensor, which delivers centralized visibility of network assets and endpoints across IT and OT infrastructure. From here a centralized endpoint and edge security policy can be defined and administered in the ClearPass system.

## About CyberX and Aruba

CyberX delivers the only industrial cybersecurity platform built by blue-team experts with a track record of defending critical national infrastructure. That difference is the foundation for the most widely deployed platform for continuously reducing IoT and ICS risk and preventing production outages, safety failures, and theft of intellectual property.

Notable CyberX customers include 2 of the top 5 US energy providers; a top 5 global pharmaceutical company; a top 5 US chemical company; and national electric and gas utilities across Europe and Asia-Pacific. Strategic partners include Palo Alto Networks, HP Aruba, Splunk, Optiv Security, McAfee, DXC Technology, and Deutsche-Telekom/T-Systems.

Aruba ClearPass is a world-class Network Access Controller that provides agentless visibility and dynamic role-based access control for seamless security enforcement and response across your wired and wireless networks. Together with CyberX, Aruba ClearPass extends network access controls to IoT and ICS networks. For example, relying on precise detail from the CyberX platform, Aruba quarantines and blocks IoT and ICS devices based on zero-day threats. In addition, Aruba remediates machines with outdated or non-compliant software.

## Software requirements

This section covers:

- **Aruba ClearPass Requirements**

- **CyberX Requirements**

### Aruba ClearPass requirements

At the time of writing, ClearPass version 6.8.0 is available and the recommended release. CPPM runs on hardware appliances with pre-installed software or as a Virtual Machine under the following hypervisors. Hypervisors that run on a client computer such as VMware Player are not supported.

- VMware ESXi 5.5, 6.0, 6.5, 6.6 or higher

- Microsoft Hyper-V Server 2012 R2 or 2016 R2

- Hyper-V on Microsoft Windows Server 2012 R2 or 2016 R2

- KVM on CentOS 7.5 or later.

### CyberX requirements

- CyberX version 2.5.1 or higher.

## Configure ClearPass to integrate with CyberX

Prior to creating and enabling the integration in CyberX, carryout the following ClearPass configurations.

- **Create a ClearPass ‘API’ User**

- **Create a ClearPass Operator Profile**

- **Create a ClearPass OAuth API Client**

## Create a ClearPass ‘API’ user

As part of the communications channel between the two products, CyberX uses a number of API’s {both TIPS and REST}, access to the TIPS API’s is validated via Username/Password combination credentials. This userId needs to have minimum levels of access. Do not use a Super Administrator profile, use API Administrator as shown below.

**To create a ClearPass API user:**

1. In the left pane, select **Administration -> Users and Privileges** and select +**ADD**.

2. In the **Add Admin User** dialog box, set the following parameters:

:::image type="content" source="media/integration-clearpass/image7.png" alt-text="Screenshot of the Admin User dialog box.":::

| Parameter           | Description                         |
| ------------------- | ----------------------------------- |
| **UserID**          | Enter the user ID/                  |
| **Name**            | Enter the user name.                |
| **Password**        | Ener the password.                  |
| **Enable User**     | Verify that this option is enabled. |
| **Privilege Level** | Select **API Administrator**        |

3. Select **Add**.

## Create a Clearpass operator profile

CyberX uses the REST API as part of the integration. REST APIs are authenticated under an OAuth framework. To sync with CyberX, you need to create an API Client.

To secure access to only the REST API for the API Client, create a restricted access Operator Profile.

**To create a ClearPass operator profile:**

- In the Edit Operator Profile window, set all the options to ‘No Access’ except for the following:

| Parameter           | Description                         |
| ------------------- | ----------------------------------- |
| **API Services**    | Set **Allow API Access** to **Allow Access**  |
| **Policy Manager**  | Set the following: <br />- **Dictionaries**: **Attributes** set to **Read, Write, Delete**<br />- **Dictionaries**: **Fingerprintsset** to **Read, Write, Delete**<br />- **Identity**: **Endpoints** set to **Read, Write, Delete** |

:::image type="content" source="media/integration-clearpass/image8.png" alt-text="Screenshot of Edit Operator Profile.":::

:::image type="content" source="media/integration-clearpass/image9.png" alt-text="Screenshot of Policy Manager.":::

## Create a ClearPass OAuth API client

1.  In the main window, select **Administrator -> API Services -> API Clients**.

2.  In the **Create API Client** tab, set the following parameters:

    - **Operating Mode**: This parameter is used for API calls to ClearPass. Select **ClearPass REST API – Client**

    - **Operator Profile:** Use the Profile you created previously

    - **Grant Type:** Set **Client credentials (grant_type = client_credentials)**

3.  Ensure you record the **Client Secret** and the Client ID (for example, cyberx-rest).

:::image type="content" source="media/integration-clearpass/image10.png" alt-text="Screenshot of Create API Client.":::

4.  In the Policy Manager, ensure you collected the following list of information before proceeding to the next step.

    - CPPM UserID

    - CPPM UserId Password

    - CPPM OAuth2 API Client ID

    - CPPM OAuth2 API Client Secret

## CyberX attributes in ClearPass

As part of enabling the CyberX - Aruba integration, CyberX creates several custom Endpoint Dictionary attributes using the ClearPass REST API /attribute. This is a record of the Dictionary Attributes created by CyberX. These custom attributes can then be used for role-mapping/enforcement actions in a Service Policy.

:::image type="content" source="media/integration-clearpass/image11.png" alt-text="Screenshot of a social media post Description automatically generated":::

The Endpoint data is sent by CyberX. It creates the Endpoints, sets the endpoint classification and also configures custom endpoint attributes.

An example of the data sent:

:::image type="content" source="media/integration-clearpass/image12.png" alt-text="Screenshot of the endpoint data.":::

Endpoint data can include the MAC address, MAC vendor, and other endpoint information resolved by CyberX.

Other data, such as the date the endpoint was added and profiled is available. This is the time CyberX updated ClearPass with the asset data.

:::image type="content" source="media/integration-clearpass/image13.png" alt-text="Screenshot of the Endpoint tab.":::

In addition to the standard data, CyberX supplies other customer attributes. Select the Attribute tab to view other attributes. This data can be used in a Policy.

:::image type="content" source="media/integration-clearpass/image14.png" alt-text="Screenshot of the Attribute tab.":::

The "cyberx_authorized" flag is a way to distinguish known, recognized assets operating on the network from new, unexpected and potentially rogue devices that are detected.

Assets that are imported into the system from the customer's inventory list, or discovered during the learning phase, would have authorized=true, and new assets that are seen on the network after the learning phase ended would be added with authorized=false, until an administrator reviewed the asset, decided it's a valid device operating on the network, at which point he could set it to authorized=true.

So the unauthorized assets are either unrecognized and potentially untrusted/malicious, or just haven't yet been "handled" by the administrator to authorize their presence on the network.

Another special attribute is the “cyberx_engineeringStation”, used to signify the function of an node in an OT/ICS system that is monitoring and being used to query/control OT devices. EngineeringStations should be protected and access to these devices specifically controlled an monitored. Knowing which assets on the network are signified for this role is important.

## Configure CyberX to integrate with ClearPass

The ability to view asset inventory information and viewing alerts discovered by CyberX is configured separately as follows:

- To view asset inventory: Configure ClearPass sync on the CyberX sensor.

- To view the alerts: Define the ClearPass forwarding rule on the CyberX sensor.

## Viewing asset inventory

To enable viewing the asset inventory in ClearPass, you need to set up CyberX-ClearPass sync. When the sync configuration is complete, the CyberX platform updates the ClearPass Policy Manager EndpointDb as it discovers new endpoints.

After configuring ClearPass Sync, the sensor Asset Inventory is synced to the ClearPass, as follows:

- Only assets with Mac Address are synced. If a single asset has multiple mac addresses, each is synced as a separate endpoint in ClearPass.

- Multicast/Broadcast assets are not synced, even if they have a Mac Address.

**To configure ClearPass sync on the CyberX sensor:**

1. From the sensor left navigation pane, select **System Settings**.

:::image type="content" source="media/integration-clearpass/image15.png" alt-text="Icon of ClearPass.":::

2. In the **System Settings** pane, select **ClearPass**.

:::image type="content" source="media/integration-clearpass/image16.png" alt-text="Screenshot of the System Settings pane.":::

3. Set the following parameters:

- **Enable Sync:** Enable the sync between CyberX and ClearPass

- **Sync Frequency:** Define the sync frequency in mins. Default = 60 mins, Minimum = 5 mins

- **ClearPass IP Address:** The IP address of the ClearPass system with which CyberX is in sync

- **Client ID:** The client ID that was created on ClearPass for syncing the data with CyberX

- **Client Secret:** The client secret that was created on ClearPass for syncing the data with CyberX

- **Username:** ClearPass admin user

- **Password:** ClerPass admin password

4. Select **Save**

## Viewing alerts

To enable viewing the alerts discovered by CyberX in Aruba, you need to set the forwarding rule. This rule defines which information about the ICS/SCADA security threats identified by CyberX security engines is sent to ClearPass.

**To define the ClearPass forwarding rule on the CyberX sensor:**

1.  In the left pane, select **Forwarding**. The Forwarding pane appears.

:::image type="content" source="media/integration-clearpass/image17.png" alt-text="Screenshot of the Forwarding pane.":::

2.  In the **Forwarding** pane, select **Create Forwarding Rule**.

:::image type="content" source="media/integration-clearpass/image18.png" alt-text="Screenshot of Create Forwarding Rule.":::

3.  Add the name and the severity of the rule and then from the **Action** drop-down list, select **Send to** **ClearPass**. The **ClearPass** integration parameters appear in the **Actions** pane.

:::image type="content" source="media/integration-clearpass/image19.png" alt-text="Screenshot of the Actions pane.":::

4.  In the **Actions** pane, set the following parameters:

| Parameter        | Description                                      |
| -----------------| ------------------------------------------------ |
| **Host**         | Type the ClearPass server IP address |
| **Port**         | Type the Port of the ClearPass on which the forwarding is done |
| **Configure**    |Set up the following options to allow viewing of CyberX alerts in the ClearPass system: <br />- **Report illegal function codes:** Protocol violations - Illegal field value violating ICS protocol specification (potential exploit)<br />- **Report unauthorized PLC programming / firmware updates:** Unauthorized PLC changes<br />- **Report unauthorized PLC stop:** PLC stop (downtime)<br />- **Report malware related alerts:** Industrial malware attempts, such as TRITON, NotPetya, and so on<br />- **Report unauthorized scanning:** Unauthorized scanning (potential reconnaissance) |

5.  Select **Submit**.

## Monitor ClearPass/CyberX communication

Once the sync has started, endpoint data is populated directedly into the Policy Manager EndpointDb, you can view the last update time from the integration configuration screen.

Reviewing 'Last Sync' time to ClearPass:

:::image type="content" source="media/integration-clearpass/image20.png" alt-text="Screenshot of a cell phone Description automatically generated.":::

If the Sync is not working or shows an error then it’s likely you’ve missed capturing some of the information. Recheck the data recorded, additionally you can view the API calls between CyberX and ClearPass from **Guest-> Administration-> Support-> Application Log**.

Example of API logs between CyberX and ClearPass:

:::image type="content" source="media/integration-clearpass/image21.png" alt-text="Screenshot of API logs between CyberX and ClearPass.":::
