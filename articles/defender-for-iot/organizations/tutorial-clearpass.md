---
title: Integrate ClearPass with Microsoft Defender for IoT
description: In this tutorial, you learn how to integrate Microsoft Defender for IoT with ClearPass.
ms.topic: tutorial
ms.date: 02/07/2022
ms.custom: how-to
---

# Integrate ClearPass with Microsoft Defender for IoT

This article helps you learn how to integrate ClearPass Policy Manager (CPPM) with Microsoft Defender for IoT.

The Defender for IoT platform delivers continuous ICS threat monitoring and device discovery, combining a deep embedded understanding of industrial protocols, devices, and applications with ICS-specific behavioral anomaly detection, threat intelligence, risk analytics, and automated threat modeling.

Defender for IoT detects, discovers, and classifies OT and ICS endpoints, and share information directly with ClearPass using the ClearPass Security Exchange framework and the OpenAPI.

Defender for IoT automatically updates the ClearPass Policy Manager Endpoint Database with endpoint classification data and several custom security attributes.

The integration allows for the following:

- Viewing ICS and SCADA security threats identified by Defender for IoT security engines.

- Viewing device inventory information discovered by the Defender for IoT sensor. The sensor delivers centralized visibility of all network devices and endpoints across the IT and OT infrastructure. From here, a centralized endpoint and edge security policy can be defined and administered in the ClearPass system.

In this article, you learn how to:

> [!div class="checklist"]
>
> - Create a ClearPass API user
> - Create a ClearPass operator profile
> - Create a ClearPass OAuth API client
> - Configure Defender for IoT to integrate with ClearPass
> - Define the ClearPass forwarding rule
> - Monitor ClearPass and Defender for IoT communication

## Prerequisites

Before you begin, make sure that you have the following prerequisites:

### Aruba ClearPass requirements

CPPM runs on hardware appliances with pre-installed software or as a Virtual Machine under the following hypervisors. Hypervisors that run on a client computer such as VMware Player aren't supported.

- VMware ESXi 5.5, 6.0, 6.5, 6.6 or higher.

- Microsoft Hyper-V Server 2012 R2 or 2016 R2.

- Hyper-V on Microsoft Windows Server 2012 R2 or 2016 R2.

- KVM on CentOS 7.5 or later.

### Defender for IoT requirements

- Defender for IoT version 2.5.1 or higher.

- Access to a Defender for IoT OT sensor as an Admin user. For more information, see [On-premises users and roles for OT monitoring with Defender for IoT](roles-on-premises.md).

## Create a ClearPass API user

As part of the communications channel between the two products, Defender for IoT uses many APIs (both TIPS, and REST). Access to the TIPS APIs is validated via username and password combination credentials. This user ID needs to have minimum levels of access. Don't use a Super Administrator profile, but instead use API Administrator as shown below.

**To create a ClearPass API user**:

1. Select **Administration** > **Users and Privileges**, and then select **ADD**.

1. In the **Add Admin User** dialog box, set the following parameters:

    | Parameter | Description |
    |--|--|
    | **UserID** | Enter the user ID. |
    | **Name** | Enter the user name. |
    | **Password** | Enter the password. |
    | **Enable User** | Verify that this option is enabled. |
    | **Privilege Level** | Select **API Administrator**. |

1. Select **Add**.

## Create a ClearPass operator profile

Defender for IoT uses the REST API as part of the integration. REST APIs are authenticated under an OAuth framework. To sync with Defender for IoT, you need to create an API Client.

In order to secure access to the REST API for the API Client, create a restricted access operator profile.

**To create a ClearPass operator profile**:

1. Navigate to the **Edit Operator Profile** window.

1. Set all of the options to **No Access** except for the following:

    | Parameter | Description |
    |--|--|
    | **API Services** | Set to **Allow Access** |
    | **Policy Manager** | Set the following: <br />- **Dictionaries**: **Attributes** set to **Read, Write, Delete**<br />- **Dictionaries**: **Fingerprints** set to **Read, Write, Delete**<br />- **Identity**: **Endpoints** set to **Read, Write, Delete** |

## Create a ClearPass OAuth API client

1. In the main window, select **Administrator** > **API Services** > **API Clients**.

1. In the **Create API Client** tab, set the following parameters:

    - **Operating Mode**: This parameter is used for API calls to ClearPass. Select **ClearPass REST API – Client**.

    - **Operator Profile**: Use the profile you created previously.

    - **Grant Type**: Set **Client credentials (grant_type = client_credentials)**.

1. Ensure you record the **Client Secret** and the **Client ID**. For example, `defender-rest`.

1. In the Policy Manager, ensure you collected the following list of information before proceeding to the next step.

    - CPPM UserID

    - CPPM UserId Password

    - CPPM OAuth2 API Client ID

    - CPPM OAuth2 API Client Secret

## Configure Defender for IoT to integrate with ClearPass

To enable viewing the device inventory in ClearPass, you need to set up Defender for IoT-ClearPass sync. When the sync configuration is complete, the Defender for IoT platform updates the ClearPass Policy Manager EndpointDb as it discovers new endpoints.

**To configure ClearPass sync on the Defender for IoT sensor**:

1. In the Defender for IoT sensor, select **System settings** > **Integrations** > **ClearPass**.

1. Set the following parameters:

    | Parameter | Description |
    |--|--|
    | **Enable Sync** | Toggle on to enable the sync between Defender for IoT and ClearPass. |
    | **Sync Frequency (minutes)** | Define the sync frequency in minutes. The default is 60 minutes. The minimum is 5 minutes. |
    | **ClearPass Host** | The IP address of the ClearPass system with which Defender for IoT is in sync. |
    | **Client ID** | The client ID that was created on ClearPass for syncing the data with Defender for IoT. |
    | **Client Secret** | The client secret that was created on ClearPass for syncing the data with Defender for IoT. |
    | **Username** | The ClearPass administrator user. |
    | **Password** | The ClearPass administrator password. |

1. Select **Save**.

## Define a ClearPass forwarding rule

To enable viewing the alerts discovered by Defender for IoT in Aruba, you need to set the forwarding rule. This rule defines which information about the ICS, and SCADA security threats identified by Defender for IoT security engines is sent to ClearPass.

Forwarding alert rules run only on alerts triggered after the forwarding rule is created. Alerts already in the system from before the forwarding rule was created aren't affected by the rule.

**To define a ClearPass forwarding rule on the Defender for IoT sensor**:

1. Sign in to the sensor, and select **Forwarding**.

1. Select **+ Create new rule**.

1. In the **Add forwarding rule** pane, define the rule parameters:

    :::image type="content" source="media/tutorial-clearpass/create-rule.png" alt-text="Screenshot of how to create a Forwarding Rule." lightbox="media/tutorial-clearpass/create-rule.png":::

    | Parameter | Description |
    |--|--|
    | **Rule name** | The forwarding rule name. |
    | **Minimal alert level** | The minimal security level incident to forward. For example, if Minor is selected, minor alerts and any alert above this severity level will be forwarded. |
    | **Any protocol detected**     |  Toggle off to select the protocols you want to include in the rule.       |
    | **Traffic detected by any engine**     | Toggle off to select the traffic you want to include in the rule.       |

1. In the **Actions** area, define the following values:

    | Parameter | Description |
    |--|--|
    | **Server** | Select ClearPass. |
    | **Host** | Define the ClearPass server IP to send alert information. |
    | **Port** | Define the ClearPass port to send alert information. |

1. Configure which alert information you want to forward:

    | Parameter | Description |
    |--|--|
    | **Report illegal function codes** | Protocol violations - Illegal field value violating ICS protocol specification (potential exploit). |
    | **Report unauthorized PLC programming / firmware updates** | Unauthorized PLC changes. |
    | **Report unauthorized PLC stop** | PLC stop (downtime). |
    | **Report malware related alerts** | Industrial malware attempts, such as TRITON, NotPetya. |
    | **Report unauthorized scanning** | Unauthorized scanning (potential reconnaissance) |

1. Select **Save**.

## Monitor ClearPass and Defender for IoT communication

Once the sync has started, endpoint data is populated directly into the Policy Manager EndpointDb, you can view the last update time from the integration configuration screen.

**To review the last sync time to ClearPass**:

1. Sign in to the Defender for IoT sensor.

1. Select **System settings** > **Integrations** > **ClearPass**.

    :::image type="content" source="media/tutorial-clearpass/last-sync.png" alt-text="Screenshot of the view the time and date of your last sync." lightbox="media/tutorial-clearpass/last-sync.png":::

If Sync isn't working, or shows an error, then it’s likely you’ve missed capturing some of the information. Recheck the data recorded.

Additionally, you can view the API calls between Defender for IoT and ClearPass from **Guest** > **Administration** > **Support** > **Application Log**.

For example, API logs between Defender for IoT and ClearPass:

:::image type="content" source="media/tutorial-clearpass/log.png" alt-text="Screenshot of API logs between Defender for IoT and ClearPass." lightbox="media/tutorial-clearpass/log.png":::

## Next steps

> [!div class="nextstepaction"]
> [Integrations with Microsoft and partner services](integrate-overview.md)
