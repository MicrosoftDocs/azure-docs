---
title: Integrate ClearPass with Microsoft Defender for IoT
description: In this tutorial, you learn how to integrate Microsoft Defender for IoT with ClearPass using Defender for IoT's legacy, on-premises integration.
ms.topic: how-to
ms.date: 09/06/2023
ms.custom: how-to
---

# Integrate ClearPass with Microsoft Defender for IoT

> [!CAUTION]
> This article references CentOS, a Linux distribution that is nearing End Of Life (EOL) status. Please consider your use and planning accordingly. For more information, see the [CentOS End Of Life guidance](~/articles/virtual-machines/workloads/centos/centos-end-of-life.md).


This article describes how to integrate Aruba ClearPass with Microsoft Defender for IoT, in order to view both ClearPass and Defender for IoT information in a single place.

Viewing both Defender for IoT and ClearPass information together provides SOC analysts with multidimensional visibility into the specialized OT protocols and devices deployed in industrial environments, along with ICS-aware behavioral analytics to rapidly detect suspicious or anomalous behavior.

## Cloud-based integrations

> [!TIP]
> Cloud-based security integrations provide several benefits over on-premises solutions, such as centralized, simpler sensor management and centralized security monitoring.
>
> Other benefits include real-time monitoring, efficient resource use, increased scalability and robustness, improved protection against security threats, simplified maintenance and updates, and seamless integration with third-party solutions.
>

If you're integrating a cloud-connected OT sensor with Aruba ClearPass, we recommend that you connect to [Microsoft Sentinel](concept-sentinel-integration.md), and then install the [Aruba ClearPass data connector](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-arubaclearpass?tab=Overview).

Microsoft Sentinel is a scalable cloud service for security information event management (SIEM) security orchestration automated response (SOAR).  SOC teams can use the integration between Microsoft Defender for IoT and Microsoft Sentinel to collect data across networks, detect and investigate threats, and respond to incidents.

In Microsoft Sentinel, the Defender for IoT data connector and solution brings out-of-the-box security content to SOC teams, helping them to view, analyze and respond to OT security alerts, and understand the generated incidents in the broader organizational threat contents.

For more information, see:

- [Tutorial: Connect Microsoft Defender for IoT with Microsoft Sentinel](iot-solution.md)
- [Tutorial: Investigate and detect threats for IoT devices](iot-advanced-threat-monitoring.md)
- [Microsoft Sentinel documentation](/azure/sentinel/data-connectors/aruba-clearpass).

## On-premises integrations

If you're working with an air-gapped, locally managed OT sensor, you'll need an on-premises solution to view Defender for IoT and Splunk information in the same place.

In such cases, we recommend that you configure your OT sensor to send syslog files directly to ClearPass, or use Defender for IoT's built-in API.

For more information, see:

- [Forward on-premises OT alert information](how-to-forward-alert-information-to-partners.md)
- [Defender for IoT API reference](references-work-with-defender-for-iot-apis.md)


## On-premises integration (legacy)

This section describes how to integrate Defender for IoT and ClearPass Policy Manager (CPPM) using the legacy, on-premises integration.

> [!IMPORTANT]
> The legacy Aruba ClearPass integration is supported through October 2024 using sensor version 23.1.3, and won't be supported in upcoming major software versions.. For customers using the legacy integration, we recommend moving to one of the following methods:
>
> - If you're integrating your security solution with cloud-based systems, we recommend that you use data connectors through [Microsoft Sentinel](#cloud-based-integrations).
> - For on-premises integrations, we recommend that you either configure your OT sensor to [forward syslog events, or use Defender for IoT APIs](#on-premises-integrations).
>

### Prerequisites

Before you begin, make sure that you have the following prerequisites:

|Prerequisite  |Description  |
|---------|---------|
|**Aruba ClearPass requirements**     |  CPPM runs on hardware appliances with pre-installed software or as a Virtual Machine under the following hypervisors. <br>- VMware ESXi 5.5, 6.0, 6.5, 6.6 or higher. <br>- Microsoft Hyper-V Server 2012 R2 or 2016 R2. <br>- Hyper-V on Microsoft Windows Server 2012 R2 or 2016 R2. <br>- KVM on CentOS 7.5 or later.  <br><br>Hypervisors that run on a client computer such as VMware Player aren't supported.      |
|**Defender for IoT requirements**     |   - Defender for IoT version 2.5.1 or higher. <br>- Access to a Defender for IoT OT sensor as an [Admin user](roles-on-premises.md).     |

### Create a ClearPass API user

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

### Create a ClearPass operator profile

Defender for IoT uses the REST API as part of the integration. REST APIs are authenticated under an OAuth framework. To sync with Defender for IoT, you need to create an API Client.

In order to secure access to the REST API for the API Client, create a restricted access operator profile.

**To create a ClearPass operator profile**:

1. Navigate to the **Edit Operator Profile** window.

1. Set all of the options to **No Access** except for the following:

    | Parameter | Description |
    |--|--|
    | **API Services** | Set to **Allow Access** |
    | **Policy Manager** | Set the following: <br />- **Dictionaries**: **Attributes** set to **Read, Write, Delete**<br />- **Dictionaries**: **Fingerprints** set to **Read, Write, Delete**<br />- **Identity**: **Endpoints** set to **Read, Write, Delete** |

### Create a ClearPass OAuth API client

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

### Configure Defender for IoT to integrate with ClearPass

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

### Define a ClearPass forwarding rule

To enable viewing the alerts discovered by Defender for IoT in Aruba, you need to set the forwarding rule. This rule defines which information about the ICS, and SCADA security threats identified by Defender for IoT security engines is sent to ClearPass.

For more information, see [On-premises integrations](#on-premises-integrations).

### Monitor ClearPass and Defender for IoT communication

Once the sync has started, endpoint data is populated directly into the Policy Manager EndpointDb, you can view the last update time from the integration configuration screen.

**To review the last sync time to ClearPass**:

1. Sign in to the Defender for IoT sensor.

1. Select **System settings** > **Integrations** > **ClearPass**.

    :::image type="content" source="media/tutorial-clearpass/last-sync.png" alt-text="Screenshot of the view the time and date of your last sync." lightbox="media/tutorial-clearpass/last-sync.png":::

If the sync isn't working, or shows an error, then it’s likely you’ve missed capturing some of the information. Recheck the data recorded.

Additionally, you can view the API calls between Defender for IoT and ClearPass from **Guest** > **Administration** > **Support** > **Application Log**.

For example, API logs between Defender for IoT and ClearPass:

:::image type="content" source="media/tutorial-clearpass/log.png" alt-text="Screenshot of API logs between Defender for IoT and ClearPass." lightbox="media/tutorial-clearpass/log.png":::

## Next steps

> [!div class="nextstepaction"]
> [Integrations with Microsoft and partner services](integrate-overview.md)
