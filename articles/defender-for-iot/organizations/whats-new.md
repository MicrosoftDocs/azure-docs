---
title: What's new in Microsoft Defender for IoT
description: This article describes new features available in Microsoft Defender for IoT, including both OT and Enterprise IoT networks, and both on-premises and in the Azure portal.
ms.topic: whats-new
ms.date: 11/22/2023
ms.custom: enterprise-iot
---

# What's new in Microsoft Defender for IoT?

This article describes features available in Microsoft Defender for IoT, across both OT and Enterprise IoT networks, both on-premises and in the Azure portal, and for versions released in the last nine months.

Features released earlier than nine months ago are described in the [What's new archive for Microsoft Defender for IoT for organizations](release-notes-archive.md). For more information specific to OT monitoring software versions, see [OT monitoring software release notes](release-notes.md).

> [!NOTE]
> Noted features listed below are in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include other legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

## December

|Service area  |Updates  |
|---------|---------|
| **OT networks** | [New architecture for hybrid and air-gapped support](#new-architecture-for-hybrid-and-air-gapped-support)|

### New architecture for hybrid and air-gapped support

Hybrid and air-gapped networks are common in many industries, such as government, financial services, or industrial manufacturing. Air-gapped networks are physically separated from other, unsecured networks like the internet, and are less vulnerable to cyber-attacks. However, air-gapped networks are still not completely secure, can still be breached, and must be secured and monitored carefully.

Defender for IoT now provides new guidance for connecting to and monitoring hybrid and air-gapped networks. The new architecture guidance is designed to add efficiency, security, and reliability to your SOC operations, with fewer components to maintain and troubleshoot. The sensor technology used in the new architecture allows for on-premises processing that keeps data within your own network, reducing the need for cloud resources and improving performance.

- **Use your existing organizational infrastructure** to monitor and manage your OT sensors, reducing the need for additional hardware or software
- **Use organizational security stack integrations** that are increasingly reliable and robust, whether you are on the cloud or on-premises
- **Collaborate with your global security teams** by auditing and controlling access to cloud and on-premises resources, ensuring consistent visibility and protection across your OT environments
- **Boost your OT security system** by adding cloud-based resources that enhance and empower your existing capabilities, such as threat intelligence, analytics, and automation

The following image shows a sample, high level architecture of our recommendations for monitoring and maintaining Defender for IoT systems, where each OT sensor connects to multiple security management systems in the cloud or on-premises.

:::image type="content" source="media/on-premises-architecture/on-premises-architecture.png" alt-text="Diagram of the new architecture for hybrid and air-gapped support.":::

We recommend that existing customers who are currently using an on-premises management console to manage OT sensors transition to the updated architecture guidance.

For more information, see [Deploy hybrid or air-gapped OT sensor management](ot-deploy/air-gapped-deploy.md).

#### On-premises management console sunset

The [legacy on-premises management console](../legacy-central-management/legacy-air-gapped-deploy.md) won't be available for download after **January 1st, 2025**. Until then, we recommend transitioning to the new architecture guidance, using the full spectrum of on-premises and cloud APIs.

- Sensor versions released after **January 1, 2024** won't be able to be managed by an on-premises management console.
- Sensor software versions released between **January 1st, 2024 – January 1st, 2025** will continue to support an on-premises management console release.
- Air-gapped sensors that cannot connect to the cloud can be managed directly via the sensor console or using REST APIs.

Our support team is available to help with further guidance as customers begin planning for the transition to the new architecture guidance. For more information, see:

- [ Transitioning from a legacy on-premises management console](ot-deploy/air-gapped-deploy.md#transitioning-from-a-legacy-on-premises-management-console).
- [Versioning and support for on-premises software versions](release-notes.md#versioning-and-support-for-on-premises-software-versions)

## November 2023

|Service area  |Updates  |
|---------|---------|
| **Enterprise IoT networks** | [Enterprise IoT protection now included in Microsoft 365 E5 and E5 Security licenses](#enterprise-iot-protection-now-included-in-microsoft-365-e5-and-e5-security-licenses) |
| **OT networks** | [Updated security stack integration guidance](#updated-security-stack-integration-guidance)|

### Enterprise IoT protection now included in Microsoft 365 E5 and E5 Security licenses

Enterprise IoT (EIoT) security with Defender for IoT discovers unmanaged IoT devices and also provides added security value, including continuous monitoring, vulnerability assessments and tailored recommendations specifically designed for Enterprise IoT devices. Seamlessly integrated with Microsoft 365 Defender, Microsoft Defender Vulnerability Management, and Microsoft Defender for Endpoint on the Microsoft 365 Defender portal, it ensures a holistic approach to safeguarding an organization's network.

Defender for IoT EIoT monitoring is now automatically supported as part of the Microsoft 365 E5 (ME5) and E5 Security plans, covering up to five devices per user license. For example, if your organization possesses 500 ME5 licenses, you can use Defender for IoT to monitor up to 2500 EIoT devices. This integration represents a significant leap toward fortifying your IoT ecosystem within the Microsoft 365 environment.

- **Customers who have ME5 or E5 Security plans but aren't yet using Defender for IoT for their EIoT devices** must [toggle on support](eiot-defender-for-endpoint.md) in the Microsoft 365 Defender portal.

- **New customers** without an ME5 or E5 Security plan can purchase a standalone, **Microsoft Defender for IoT - EIoT Device License - add-on** license, as an add-on to Microsoft Defender for Endpoint P2. Purchase standalone licenses from the Microsoft admin center.

- **Existing customers with both legacy Enterprise IoT plans and ME5/E5 Security plans** are automatically switched to the new licensing method. Enterprise IoT monitoring is now bundled into your license, at no extra charge, and with no action item required from you.

- **Customers with legacy Enterprise IoT plans and no ME5/E5 Security plans** can continue to use their existing plans until the plans expire.

Trial licenses are available for Defender for Endpoint P2 customers as standalone licenses. Trial licenses support 100 number of devices for 90 days.

For more information, see:

- [Securing IoT devices in the enterprise](concept-enterprise.md)
- [Enable Enterprise IoT security with Defender for Endpoint](eiot-defender-for-endpoint.md)
- [Defender for IoT subscription billing](billing.md)
- [Microsoft Defender for IoT Plans and Pricing](https://www.microsoft.com/en-us/security/business/endpoint-security/microsoft-defender-iot-pricing#x2a571382a40c482a993d13d7239102eb)
- Blog: [Enterprise IoT security with Defender for IoT now included in Microsoft 365 E5 and E5 Security plans](https://techcommunity.microsoft.com/t5/microsoft-365-defender-blog/enterprise-iot-security-with-defender-for-iot-now-included-in/ba-p/3967533)

### Updated security stack integration guidance

Defender for IoT is refreshing its security stack integrations to improve the overall robustness, scalability, and ease of maintenance of various security solutions.

If you're integrating your security solution with cloud-based systems, we recommend that you use data connectors through [Microsoft Sentinel](concept-sentinel-integration.md). For on-premises integrations, we recommend that you either configure your OT sensor to [forward syslog events](how-to-forward-alert-information-to-partners.md)), or use [Defender for IoT APIs](references-work-with-defender-for-iot-apis.md).

The legacy Aruba ClearPass, Palo Alto Panorama, and Splunk integrations are supported through October 2024 using sensor version 23.1.3, and won't be supported in upcoming major software versions.

For customers using legacy integration methods, we recommend moving your integrations to newly recommended methods. For more information, see:

- [Integrate ClearPass with Microsoft Defender for IoT](tutorial-clearpass.md)
- [Integrate Palo Alto with Microsoft Defender for IoT](tutorial-palo-alto.md)
- [Integrate Splunk with Microsoft Defender for IoT](tutorial-splunk.md)
- [Integrations with Microsoft and partner services](integrate-overview.md)

## September 2023

|Service area  |Updates  |
|---------|---------|
| **OT networks** | **Version 23.1.3**: <br>- [Troubleshoot OT sensor connectivity](#troubleshoot-ot-sensor-connectivity) <br>- [Event timeline access for OT sensor Read Only users](#event-timeline-access-for-ot-sensor-read-only-users)|

### Troubleshoot OT sensor connectivity

Starting in version 23.1.3, OT sensors automatically help you troubleshoot connectivity issues with the Azure portal. If a cloud-managed sensor isn't connected, an error is indicated in the Azure portal on the **Sites and sensors** page, and on the sensor's **Overview** page.

For example:

:::image type="content" source="media/release-notes/connectivity-error.png" alt-text="Screenshot of a connectivity error on the Overview page." lightbox="media/release-notes/connectivity-error.png":::

From your sensor, do one of the following to open the **Cloud connectivity troubleshooting** pane, which provides details about the connectivity issues and mitigation steps:

- On the **Overview** page, select the **Troubleshoot** link at the top of the page
- Select **System settings > Sensor management > Health and troubleshooting > Cloud connectivity troubleshooting**


For more information, see [Check sensor - cloud connectivity issues](how-to-troubleshoot-sensor.md#check-sensor---cloud-connectivity-issues).

### Event timeline access for OT sensor Read Only users

Starting in version 23.1.3, *Read Only* users on the OT sensor can view the **Event Timeline** page. For example:

:::image type="content" source="media/track-sensor-activity/event-timeline-view-events.png" alt-text="Screenshot of events on the event timeline." lightbox="media/track-sensor-activity/event-timeline-view-events.png":::

For more information, see:

- [Track network and sensor activity with the event timeline](how-to-track-sensor-activity.md)
- [On-premises users and roles for OT monitoring with Defender for IoT](roles-on-premises.md)

## August 2023

|Service area  |Updates  |
|---------|---------|
| **OT networks** | [Defender for IoT's CVEs align to CVSS v3](#defender-for-iots-cves-align-to-cvss-v3) |

### Defender for IoT's CVEs align to CVSS v3

CVE scores shown in the OT sensor and on the Azure portal are aligned with the [National Vulnerability Database (NVD)](https://nvd.nist.gov/vuln-metrics/cvss), and starting with Defender for IoT's August threat intelligence update, CVSS v3 scores are shown if they're relevant. If there's no CVSS v3 score relevant, the CVSS v2 score is shown instead.

View CVE data from the Azure portal, either on a Defender for IoT's device detail's **Vulnerabilities** tab, with resources available with the Microsoft Sentinel solution, or in a data mining query on your OT sensor. For more information, see:

- [Maintain threat intelligence packages on OT network sensors](how-to-work-with-threat-intelligence-packages.md)
- [View full device details](how-to-manage-device-inventory-for-organizations.md#view-full-device-details)
- [Tutorial: Investigate and detect threats for IoT devices with Microsoft Sentinel](iot-advanced-threat-monitoring.md)
- [Create data mining queries](how-to-create-data-mining-queries.md)

## July 2023

|Service area  |Updates  |
|---------|---------|
| **OT networks** | **Version 23.1.2**: <br>- [OT sensor installation and setup enhancements](#ot-sensor-installation-and-setup-enhancements) <br>- [Analyze and fine tune your deployment](#analyze-and-fine-tune-your-deployment) <br>- [Configure monitored interfaces via the sensor GUI](#configure-monitored-interfaces-via-the-sensor-gui)<br>- [Simplified privileged users](#simplified-privileged-users) <br><br>[Migrate to site-based licenses](#migrate-to-site-based-licenses) |

### OT sensor installation and setup enhancements

In version 23.1.2, we've updated the OT sensor installation and setup wizards to be quicker and more user-friendly. Updates include:

- **Installation wizard**: If you're installing software on your own physical or virtual machines, the Linux installation wizard now goes directly through the installation process without requiring any input or details from you.

    You can watch the installation run from a deployment workstation, but you might also choose to install the software without using a keyboard or screen, and let the installation run automatically. When it's done, access the sensor from the browser using the default IP address.

    - The installation uses default values for your network settings. Fine-tune these settings afterwards, either in the CLI as before, or in a new, browser-based wizard.

    - All sensors are installed with a default *support* user and password. Change the default password immediately with the first sign-in.

- **Configure initial setup in the browser**: After installing software and configuring your initial network settings, continue with the same browser-based wizard to activate your sensor and define SSL/TLS certificate settings.

For more information, see [Install and set up your OT sensor](ot-deploy/install-software-ot-sensor.md) and [Configure and activate your OT sensor](ot-deploy/activate-deploy-sensor.md).

### Analyze and fine tune your deployment

After completing the installation and initial setup, analyze the traffic that the sensor detects by default from the sensor settings. On the sensor, select **Sensor settings** > **Basic** > **Deployment** to analyze the current detections. For example:

:::image type="content" source="media/how-to-control-what-traffic-is-monitored/deployment-settings.png" alt-text="Screenshot of the Deployment settings page." lightbox="media/how-to-control-what-traffic-is-monitored/deployment-settings.png":::

You might find that you need to fine tune your deployment, such as changing the sensor's location in the network, or verifying that your monitoring interfaces are connected correctly. Select **Analyze** again after making any changes to see the updated monitoring state. 

For more information, see [Analyze your deployment](how-to-control-what-traffic-is-monitored.md#analyze-your-deployment).

### Configure monitored interfaces via the sensor GUI

If you want to modify the interfaces used to monitor your traffic after the initial sensor setup, now you can use the new **Sensor settings** > **Interface configurations** page to update your settings instead of the Linux wizard accessed by CLI. For example:

:::image type="content" source="media/release-notes/integration-configurations.png" alt-text="Screenshot of the Integration configurations page on the OT sensor.":::

The **Interface configurations** page shows the same options as the **Interface configurations** tab in the [initial setup wizard](ot-deploy/activate-deploy-sensor.md#define-the-interfaces-you-want-to-monitor).

For more information, see [Update a sensor's monitoring interfaces (configure ERSPAN)](../how-to-manage-individual-sensors.md#update-a-sensors-monitoring-interfaces-configure-erspan).

### Simplified privileged users

In new sensor installations of version 23.1.2, only the privileged *support* user is available by default. The *cyberx* and *cyberx_host* users are available, but are disabled by default. If you need to use these users, such as for [Defender for IoT CLI](references-work-with-defender-for-iot-cli-commands.md) access, [change the user password](manage-users-sensor.md#change-a-sensor-users-password).

In sensors that have been updated from previous versions to 23.1.2, the *cyberx* and *cyberx_host* users remain enabled as before.

> [!TIP]
> To run CLI commands that are available only to the *cyberx* or *cyberx_host* users when signed in as the *support* user, make sure to first access the host machine's system root. For more information, see [Access the system root as a *support* user](references-work-with-defender-for-iot-cli-commands.md#access-the-system-root-as-a-support-user).

### Migrate to site-based licenses

Existing customers can now migrate their legacy Defender for IoT purchasing plans to a **Microsoft 365** plan, based on site-based, Microsoft 365 licenses.

On the **Plans and pricing** page, edit your plan and select the **Microsoft 365** plan instead of your current monthly or annual plan. For example:

:::image type="content" source="media/release-notes/migrate-to-365.png" alt-text="Screenshot of updating your pricing plan to Microsoft 365."  lightbox="media/release-notes/migrate-to-365.png":::

Make sure to edit any relevant sites to match your newly licensed site sizes. For example:

:::image type="content" source="media/release-notes/edit-site-size.png" alt-text="Screenshot of editing a site size on the Azure portal."  lightbox="media/release-notes/edit-site-size.png":::

For more information, see [Migrate from a legacy OT plan](how-to-manage-subscriptions.md#migrate-from-a-legacy-ot-plan) and [Defender for IoT subscription billing](billing.md).

## June 2023

|Service area  |Updates  |
|---------|---------|
| **OT networks** | [OT plans billed by site-based licenses](#ot-plans-billed-by-site-based-licenses) <br> [Security recommendations for OT networks for insecure passwords and critical CVEs](#security-recommendations-for-ot-networks-for-insecure-passwords-and-critical-cves) |

### OT plans billed by site-based licenses

Starting June 1, 2023, Microsoft Defender for IoT licenses for OT monitoring are available for purchase only in the [Microsoft 365 admin center](https://admin.microsoft.com/Adminportal/Home).

- **Licenses are available for individual sites**, based on the sizes of those respective sites. A trial license is also available, covering a **Large** site size for 60 days.

    Any purchase of extra licenses is automatically updated in your OT plan in the Azure portal.

- **When you onboard a new sensor**, you're now requested to assign your sensor to a site that's based on your licensed site sizes.

- **Existing customers** can continue to use any legacy OT plan already onboarded to an Azure subscription, with no changes in functionality. However, you can't add a new plan to a new subscription without a corresponding license from the Microsoft 365 admin center.

> [!TIP]
> A Defender for IoT *site* is a physical location, such as a facility, campus, office building, hospital, rig, and so on. Each site can contain any number of network sensors, which identify devices across detected network traffic.
>

For more information, see:

- [Defender for IoT subscription billing](billing.md)
- [Start a Microsoft Defender for IoT trial](getting-started.md)
- [Manage OT plans on Azure subscriptions](how-to-manage-subscriptions.md)
- [Onboard OT sensors to Defender for IoT](onboard-sensors.md)

### Security recommendations for OT networks for insecure passwords and critical CVEs

Defender for IoT now provides security recommendations for insecure passwords and for critical CVEs to help customers manage their OT/IoT network security posture.

You can see the following new security recommendations from the Azure portal for detected devices across your networks:

- **Secure your vulnerable devices**: Devices with this recommendation are found with one or more vulnerabilities with a critical severity. We recommend that you follow the steps listed by the device vendor or CISA (Cybersecurity & Infrastructure Agency).

- **Set a secure password for devices with missing authentication**: Devices with this recommendation are found without authentication based on successful sign-ins. We recommend that you enable authentication, and that you set a stronger password with minimum length and complexity.

- **Set a stronger password with minimum length and complexity**: Devices with this recommendation are found with weak passwords based on successful sign-ins. We recommend that you change the device password to a stronger password with minimum length and complexity.

For more information, see [Supported security recommendations](recommendations.md#supported-security-recommendations).

## May 2023

|Service area  |Updates  |
|---------|---------|
| **OT networks** | **Sensor version 22.3.9**: <br>- [Improved monitoring and support for OT sensor logs](#improved-monitoring-and-support-for-ot-sensor-logs) <br><br> **Sensor versions 22.3.x and higher**: <br>- [Configure Active Directory and NTP settings in the Azure portal](#configure-active-directory-and-ntp-settings-in-the-azure-portal) |

### Improved monitoring and support for OT sensor logs

In version 22.3.9, we've added a new capability to collect logs from the OT sensor through a new endpoint. The extra data helps us troubleshoot customer issues, providing faster response times and more targeted solutions and recommendations. The new endpoint has been added to our list of required endpoints that connect your OT sensors to Azure.

After updating your OT sensors, download the latest list of endpoints and ensure that your sensors can access all endpoints listed.

For more information, see:

- [Update Defender for IoT OT monitoring software](update-ot-software.md)
- [Sensor deployment and access](how-to-manage-sensors-on-the-cloud.md#sensor-deployment-and-access)

### Configure Active Directory and NTP settings in the Azure portal

Now you can configure Active Directory and NTP settings for your OT sensors remotely from the **Sites and sensors** page in the Azure portal. These settings are available for OT sensor versions 22.3.x and higher.

For more information, see [Sensor setting reference](configure-sensor-settings-portal.md#sensor-setting-reference).

## April 2023

|Service area  |Updates  |
|---------|---------|
| **Documentation** | [End-to-end deployment guides](#end-to-end-deployment-guides) |
| **OT networks** | **Sensor version 22.3.8**: <br>- [Proxy support for client SSL/TLS certificates](#proxy-support-for-client-ssltls-certificates) <br>- [Enrich Windows workstation and server data with a local script (Public preview)](#enrich-windows-workstation-and-server-data-with-a-local-script-public-preview) <br>- [Automatically resolved OS notifications](#automatically-resolved-os-notifications) <br>- [UI enhancement when uploading SSL/TLS certificates](#ui-enhancement-when-uploading-ssltls-certificates) |

### End-to-end deployment guides

The Defender for IoT documentation now includes a new **Deploy** section, with a full set of deployment guides for the following scenarios:

- [Standard deployment for OT monitoring](ot-deploy/ot-deploy-path.md)
- [Air-gapped deployment for OT monitoring with an on-premises sensor management](ot-deploy/air-gapped-deploy.md)
- [Enterprise IoT deployment](eiot-defender-for-endpoint.md)

For example, the recommended deployment for OT monitoring includes the following steps, which are all detailed in our new articles:

:::image type="content" source="media/deployment-paths/ot-deploy.png" alt-text="Diagram of an OT monitoring deployment path." border="false" lightbox="media/deployment-paths/ot-deploy.png":::

The step-by-step instructions in each section are intended to help customers optimize for success and deploy for Zero Trust. Navigational elements on each page, including flow charts at the top and **Next steps** links at the bottom, indicate where you are in the process, what you’ve completed, and what your next step should be. For example:

:::image type="content" source="media/deployment-paths/progress-network-level-deployment.png" alt-text="Diagram of a progress bar with Site networking setup highlighted." border="false" lightbox="media/deployment-paths/progress-network-level-deployment.png":::

For more information, see [Deploy Defender for IoT for OT monitoring](ot-deploy/ot-deploy-path.md).

### Proxy support for client SSL/TLS certificates

A client SSL/TLS certificate is required for proxy servers that inspect SSL/TLS traffic, such as when using services like Zscaler and Palo Alto Prisma. Starting in version 22.3.8, you can upload a client certificate through the OT sensor console.

For more information, see [Configure a proxy](connect-sensors.md#configure-proxy-settings-on-an-ot-sensor).

### Enrich Windows workstation and server data with a local script (Public preview)

Use a local script, available from the OT sensor UI, to enrich Microsoft Windows workstation and server data on your OT sensor. The script runs as a utility to detect devices and enrich data, and can be run manually or using standard automation tools.
 
For more information, see [Enrich Windows workstation and server data with a local script](detect-windows-endpoints-script.md).

### Automatically resolved OS notifications

After you've updated your OT sensor to version 22.3.8, no new device notifications for **Operating system changes** are generated. Existing **Operating system changes** notifications are automatically resolved if they aren't dismissed or otherwise handled within 14 days.

For more information, see [Device notification responses](how-to-work-with-the-sensor-device-map.md#device-notification-responses)

### UI enhancement when uploading SSL/TLS certificates

The OT sensor version 22.3.8 has an enhanced **SSL/TLS Certificates** configuration page for defining your SSL/TLS certificate settings and deploying a CA-signed certificate.

For more information, see [Manage SSL/TLS certificates](how-to-manage-individual-sensors.md#manage-ssltls-certificates).

## March 2023

|Service area  |Updates  |
|---------|---------|
| **OT networks** | **Sensor version 22.3.6/22.3.7**: <br>- [Support for transient devices](#support-for-transient-devices)<br>- [Learn DNS traffic by configuring allowlists](#learn-dns-traffic-by-configuring-allowlists)<br>- [Device data retention updates](#device-data-retention-updates)<br>- [UI enhancements when uploading SSL/TLS certificates](#ui-enhancements-when-uploading-ssltls-certificates)<br>- [Activation files expiration updates](#activation-files-expiration-updates)<br>- [UI enhancements for managing the device inventory](#ui-enhancements-for-managing-the-device-inventory)<br>- [Updated severity for all Suspicion of Malicious Activity alerts](#updated-severity-for-all-suspicion-of-malicious-activity-alerts)<br>- [Automatically resolved device notifications](#automatically-resolved-device-notifications) <br><br>Version 22.3.7 includes the same features as 22.3.6. If you have version 22.3.6 installed, we strongly recommend that you update to version 22.3.7, which also includes important bug fixes.<br><br> **Cloud features**: <br>- [New Microsoft Sentinel incident experience for Defender for IoT](#new-microsoft-sentinel-incident-experience-for-defender-for-iot) |

### Support for transient devices

Defender for IoT now identifies *transient* devices as a unique device type that represents devices that were detected for only a short time. We recommend investigating these devices carefully to understand their impact on your network.

For more information, see [Defender for IoT device inventory](device-inventory.md) and [Manage your device inventory from the Azure portal](how-to-manage-device-inventory-for-organizations.md).

### Learn DNS traffic by configuring allowlists

The *support* user can now decrease the number of unauthorized internet alerts by creating an allowlist of domain names on your OT sensor.

When a DNS allowlist is configured, the sensor checks each unauthorized internet connectivity attempt against the list before triggering an alert. If the domain's FQDN is included in the allowlist, the sensor doesn’t trigger the alert and allows the traffic automatically.

All OT sensor users can view the list of allowed DNS domains and their resolved IP addresses in data mining reports.  

For example:

:::image type="content" source="media/release-notes/data-mining-allowlist.png" alt-text="Screenshot of how to create a data mining report for DNS allowlists.":::

For more information, see [Allow internet connections on an OT network](how-to-accelerate-alert-incident-response.md#allow-internet-connections-on-an-ot-network) and [Create data mining queries](how-to-create-data-mining-queries.md).

### Device data retention updates

The device data retention period on the OT sensor and on-premises management console has been updated to 90 days from the date of the **Last activity** value.

For more information, see [Device data retention periods](references-data-retention.md#device-data-retention-periods).

### UI enhancements when uploading SSL/TLS certificates

The OT sensor version 22.3.6 has an enhanced **SSL/TLS Certificates** configuration page for defining your SSL/TLS certificate settings and deploying a CA-signed certificate.

For more information, see [Manage SSL/TLS certificates](how-to-manage-individual-sensors.md#manage-ssltls-certificates).

### Activation files expiration updates

Activation files on locally managed OT sensors now remain activated for as long as your Defender for IoT plan is active on your Azure subscription, just like activation files on cloud-connected OT sensors.

You only need to update your activation file if you're [updating an OT sensor from a legacy version](update-legacy-ot-software.md#update-legacy-ot-sensor-software) or switching the sensor management mode, such as moving from locally managed to cloud-connected.

For more information, see [Manage individual sensors](how-to-manage-individual-sensors.md).

### UI enhancements for managing the device inventory

The following enhancements were added to the OT sensor's device inventory in version 22.3.6:

- A smoother process for [editing device details](how-to-investigate-sensor-detections-in-a-device-inventory.md#edit-device-details) on the OT sensor. Edit device details directly from the device inventory page on the OT sensor console using the new **Edit** button in the toolbar at the top of the page.
- The OT sensor now supports [deleting multiple devices](how-to-investigate-sensor-detections-in-a-device-inventory.md#delete-devices) simultaneously.
- The procedures for [merging](how-to-investigate-sensor-detections-in-a-device-inventory.md#merge-devices) and [deleting](how-to-investigate-sensor-detections-in-a-device-inventory.md#delete-devices) devices now include confirmation messages that appear when the action has completed.

For more information, see [Manage your OT device inventory from a sensor console](how-to-investigate-sensor-detections-in-a-device-inventory.md).

### Updated severity for all Suspicion of Malicious Activity alerts

All alerts with the **Suspicion of Malicious Activity** category now have a severity of **Critical**.

For more information, see [Malware engine alerts](alert-engine-messages.md#malware-engine-alerts).

### Automatically resolved device notifications

Starting in version 22.3.6, selected notifications on the OT sensor's **Device map** page are now automatically resolved if they aren't dismissed or otherwise handled within 14 days.

After you've updated your sensor version, the **Inactive devices** and **New OT devices** notifications no longer appear. While any **Inactive devices** notifications that are left over from before the update are automatically dismissed, you might still have legacy **New OT devices** notifications to handle. Handle these notifications as needed to remove them from your sensor.

For more information, see [Manage device notifications](how-to-work-with-the-sensor-device-map.md#manage-device-notifications).

### New Microsoft Sentinel incident experience for Defender for IoT

Microsoft Sentinel's new [incident experience](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/the-new-incident-experience-is-here/ba-p/3717042) includes specific features for Defender for IoT customers. SOC analysts who are investigating OT/IoT-related can now use the following enhancements on incident details pages:

- **View related sites, zones, sensors, and device importance** to better understand an incident's business impact and physical location.

- **Review an aggregated timeline of affected devices and related device details**, instead of investigating on separate entity details pages for the related devices

- **Review OT alert remediation steps** directly on the incident details page

For more information, see [Tutorial: Investigate and detect threats for IoT devices](iot-advanced-threat-monitoring.md) and [Navigate and investigate incidents in Microsoft Sentinel](../../sentinel/investigate-incidents.md).

## February 2023

|Service area  |Updates  |
|---------|---------|
| **OT networks** | **Cloud features**: <br>- [Microsoft Sentinel: Microsoft Defender for IoT solution version 2.0.2](#microsoft-sentinel-microsoft-defender-for-iot-solution-version-202) <br>- [Download updates from the Sites and sensors page (Public preview)](#download-updates-from-the-sites-and-sensors-page-public-preview) <br>- [Alerts page GA in the Azure portal](#alerts-ga-in-the-azure-portal) <br>- [Device inventory GA in the Azure portal](#device-inventory-ga-in-the-azure-portal) <br>- [Device inventory grouping enhancements (Public preview)](#device-inventory-grouping-enhancements-public-preview) <br>- [Focused inventory in the Azure device inventory (Public preview)](#focused-inventory-in-the-azure-device-inventory-public-preview) <br><br> **Sensor version 22.2.3**: [Configure OT sensor settings from the Azure portal (Public preview)](#configure-ot-sensor-settings-from-the-azure-portal-public-preview) |
| **Enterprise IoT networks** | **Cloud features**: [Alerts page GA in the Azure portal](#alerts-ga-in-the-azure-portal)  |

### Microsoft Sentinel: Microsoft Defender for IoT solution version 2.0.2

[Version 2.0.2](release-notes-sentinel.md#version-202) of the Microsoft Defender for IoT solution is now available in the [Microsoft Sentinel content hub](../../sentinel/sentinel-solutions-catalog.md), with improvements in analytics rules for incident creation, an enhanced incident details page, and performance improvements for analytics rule queries.

For more information, see:

- [Tutorial: Investigate and detect threats for IoT devices](iot-advanced-threat-monitoring.md)
- [Microsoft Defender for IoT solution versions in Microsoft Sentinel](release-notes-sentinel.md)

### Download updates from the Sites and sensors page (Public preview)

If you're running a local software update on your OT sensor or on-premises management console, the **Sites and sensors** page now provides a new wizard for downloading your update packages, accessed via the **Sensor update (Preview)** menu.

For example:

:::image type="content" source="media/update-ot-software/local-update-wizard.png" alt-text="Screenshot of the new Local update pane on the Sites and sensors page." lightbox="media/update-ot-software/local-update-wizard.png":::

- Threat intelligence updates are also now available only from the **Sites and sensors** page > **Threat intelligence update (Preview)** option.

- Update packages for the on-premises management console are also available from the **Getting started** > **On-premises management console** tab.

For more information, see:

- [Update Defender for IoT OT monitoring software](update-ot-software.md)
- [Update threat intelligence packages](how-to-work-with-threat-intelligence-packages.md#update-threat-intelligence-packages)
- [OT monitoring software versions](release-notes.md)

### Device inventory GA in the Azure portal

The **Device inventory** page in the Azure portal is now Generally Available (GA), providing a centralized view across all your detected devices, at scale.

Defender for IoT's device inventory helps you identify details about specific devices, such as manufacturer, type, serial number, firmware, and more. Gathering details about your devices helps your teams proactively investigate vulnerabilities that can compromise your most critical assets.

- **Manage all your IoT/OT devices** by building up-to-date inventory that includes all your managed and unmanaged devices

- **Protect devices with risk-based approach** to identify risks such as missing patches, vulnerabilities and prioritize fixes based on risk scoring and automated threat modeling

- **Update your inventory** by deleting irrelevant devices and adding organization-specific information to emphasize your organization preferences

The **Device inventory** GA includes the following UI enhancements:

|Enhancement |Description  |
|---------|---------|
|**Grid-level enhancements**| - **[Export the entire device inventory](how-to-manage-device-inventory-for-organizations.md#export-the-device-inventory-to-csv)** to review offline and compare notes with your teams   <br>- **[Delete irrelevant devices](how-to-manage-device-inventory-for-organizations.md#delete-a-device)** that no longer exist or are no longer functional <br>- **[Merge devices](how-to-manage-device-inventory-for-organizations.md#merge-duplicate-devices)** to fine-tune the device list if the sensor has discovered separate network entities that are associated with a single, unique device. For example, a PLC with four network cards, a laptop with both WiFi and a physical network card, or a single workstation with multiple network cards.<br>- **[Edit your table views](how-to-manage-device-inventory-for-organizations.md#reference-of-editable-fields)** to reflect only the data you're interested in viewing  |
|**Device-level enhancements**| - **[Edit device details](how-to-manage-device-inventory-for-organizations.md#edit-device-details)** by annotating organization-specific contextual details, such as relative importance, descriptive tags, and business function information     |
|**Filter and search enhancements** |  - **[Run deep searches on any device inventory field](how-to-manage-device-inventory-for-organizations.md#view-the-device-inventory)** to quickly find the devices that matter most <br>- **[Filter the device inventory by any field](how-to-manage-device-inventory-for-organizations.md#view-the-device-inventory)**. For example, filter by *Type* to identify *Industrial* devices, or time fields to determine active and inactive devices.|

Rich security, governance and admin controls also provide the ability to assign admins, restricting who can merge, delete and edit devices on an owner’s behalf.

### Device inventory grouping enhancements (Public preview)

The **Device inventory** page on the Azure portal supports new grouping categories. Now you can group your device inventory by *class*, *data source*, *location*, *Purdue level*, *site*, *type*, *vendor*, and *zone*. For more information, see [View full device details](how-to-manage-device-inventory-for-organizations.md#view-the-device-inventory).

### Focused inventory in the Azure device inventory (Public preview)

The **Device inventory** page on the Azure portal now includes a network location indication for your devices, to help focus your device inventory on the devices within your IoT/OT scope. 

See and filter which devices are defined as *local* or *routed*, according to your configured subnets. The **Network location** filter is on by default. Add the **Network location** column by editing the columns in the device inventory.
 
Configure your subnets either on the Azure portal or on your OT sensor. For more information, see:

- [Manage your device inventory from the Azure portal](how-to-manage-device-inventory-for-organizations.md)
- [Configure OT sensor settings from the Azure portal](configure-sensor-settings-portal.md#subnet)
- [Fine tune your subnet list](how-to-control-what-traffic-is-monitored.md#fine-tune-your-subnet-list)

### Configure OT sensor settings from the Azure portal (Public preview)

For sensor versions 22.2.3 and higher, you can now configure selected settings for cloud-connected sensors using the new **Sensor settings (Preview)** page, accessed via the Azure portal's **Sites and sensors** page. For example:

:::image type="content" source="media/configure-sensor-settings-portal/view-settings.png" alt-text="Screenshot of the OT sensor settings on the Azure portal.":::

For more information, see [Define and view OT sensor settings from the Azure portal (Public preview)](configure-sensor-settings-portal.md).

### Alerts GA in the Azure portal

The **Alerts** page in the Azure portal is now out for General Availability. Microsoft Defender for IoT alerts enhance your network security and operations with real-time details about events detected in your network. Alerts are triggered when OT or Enterprise IoT network sensors, or the [Defender for IoT micro agent](../device-builders/index.yml), detect changes or suspicious activity in network traffic that needs your attention.

Specific alerts triggered by the Enterprise IoT sensor currently remain in public preview.

For more information, see:

- [View and manage alerts from the Azure portal](how-to-manage-cloud-alerts.md)
- [Investigate and respond to an OT network alert](respond-ot-alert.md)
- [OT monitoring alert types and descriptions](alert-engine-messages.md)

## January 2023

|Service area  |Updates  |
|---------|---------|
|**OT networks**     |**Sensor version 22.3.4**: [Azure connectivity status shown on OT sensors](#azure-connectivity-status-shown-on-ot-sensors)<br><br>**Sensor version 22.2.3**: [Update sensor software from the Azure portal](#update-sensor-software-from-the-azure-portal-public-preview)  |

### Update sensor software from the Azure portal (Public preview)

For cloud-connected sensor versions [22.2.3](release-notes.md#2223) and higher, now you can update your sensor software directly from the new **Sites and sensors** page on the Azure portal.

:::image type="content" source="media/update-ot-software/send-package.png" alt-text="Screenshot of the Send package option." lightbox="media/update-ot-software/send-package.png":::

For more information, see [Update your sensors from the Azure portal](update-ot-software.md#update-ot-sensors).

### Azure connectivity status shown on OT sensors

Details about Azure connectivity status are now shown on the **Overview** page in OT network sensors, and errors are shown if the sensor's connection to Azure is lost.

For example:

:::image type="content" source="media/how-to-manage-individual-sensors/connectivity-status.png" alt-text="Screenshot of the Azure connectivity status shown on the OT sensor's Overview page.":::

For more information, see [Manage individual sensors](how-to-manage-individual-sensors.md) and [Onboard OT sensors to Defender for IoT](onboard-sensors.md).

## December 2022

|Service area  |Updates  |
|---------|---------|
|**OT networks**     |  [New purchase experience for OT plans](#new-purchase-experience-for-ot-plans)    |
|**Enterprise IoT networks**     | [Enterprise IoT sensor alerts and recommendations (Public Preview)](#enterprise-iot-sensor-alerts-and-recommendations-public-preview) |

### Enterprise IoT sensor alerts and recommendations (Public Preview)

The Azure portal now provides the following extra security data for traffic detected by Enterprise IoT network sensors:

|Data type  |Description  |
|---------|---------|
|**Alerts**     | The Enterprise IoT network sensor now triggers the following alerts: <br>- **Connection Attempt to Known Malicious IP** <br>- **Malicious Domain Name Request**        |
|**Recommendations**     | The Enterprise IoT network sensor now triggers the following recommendation for detected devices, as relevant: <br>**Disable insecure administration protocol**        |

For more information, see:

- [Malware engine alerts](alert-engine-messages.md#malware-engine-alerts)
- [View and manage alerts from the Azure portal](how-to-manage-cloud-alerts.md)
- [Enhance security posture with security recommendations](recommendations.md)
- [Discover Enterprise IoT devices with an Enterprise IoT network sensor (Public preview)](eiot-sensor.md)

### New purchase experience for OT plans

The **Plans and pricing** page in the Azure portal now includes a new enhanced purchase experience for Defender for IoT plans for OT networks. Edit your OT plan in the Azure portal, for example to change your plan from a trial to a monthly or annual commitment, or update the number of devices or sites.

For more information, see [Manage OT plans on Azure subscriptions](how-to-manage-subscriptions.md).

## November 2022

|Service area  |Updates  |
|---------|---------|
|**OT networks**     |- **Sensor versions 22.x and later**:  [Site-based access control on the Azure portal (Public preview)](#site-based-access-control-on-the-azure-portal-public-preview)  <br><br>- **All OT sensor versions**: [New OT monitoring software release notes](#new-ot-monitoring-software-release-notes)     |

### Site-based access control on the Azure portal (Public preview)

For sensor software versions 22.x, Defender for IoT now supports *site-based access control*, which allows customers to control user access to Defender for IoT features on the Azure portal at the *site* level.

For example, apply the [Security Reader](../../role-based-access-control/built-in-roles.md#security-reader), [Security Admin](../../role-based-access-control/built-in-roles.md#security-admin), [Contributor](../../role-based-access-control/built-in-roles.md#contributor), or [Owner](../../role-based-access-control/built-in-roles.md#owner) roles to determine user access to Azure resources such as the **Alerts**, **Device inventory**, or **Workbooks** pages.

To manage site-based access control, select the site in the **Sites and sensors** page, and then select the **Manage site access control (Preview)** link. For example:

:::image type="content" source="media/release-notes/site-based-access.png" alt-text="Screenshot of the site-based access link in the Sites and sensors page." lightbox="media/release-notes/site-based-access.png":::

For more information, see [Manage OT monitoring users on the Azure portal](manage-users-portal.md) and [Azure user roles for OT and Enterprise IoT monitoring](roles-azure.md).

> [!NOTE]
> *Sites*, and therefore site-based access control, are relevant only for OT network monitoring.
>

### New OT monitoring software release notes

Defender for IoT documentation now has a new [release notes](release-notes.md) page dedicated to OT monitoring software, with details about our version support models and update recommendations.

:::image type="content" source="media/release-notes/ot-release-notes.png" alt-text="Screenshot of the new OT monitoring software release notes page in docs." lightbox="media/release-notes/ot-release-notes.png":::

We continue to update this article, our main **What's new** page, with new features and enhancements for both OT and Enterprise IoT networks. New items listed include both on-premises and cloud features, and are listed per month.

In contrast, the new [OT monitoring software release notes](release-notes.md) lists only OT network monitoring updates that require you to update your on-premises software. Items are listed per major and patch versions, with an aggregated table of versions, dates, and scope.

For more information, see [OT monitoring software release notes](release-notes.md).

## October 2022

|Service area  |Updates  |
|---------|---------|
|**OT networks**     | [Enhanced OT monitoring alert reference](#enhanced-ot-monitoring-alert-reference) |

### Enhanced OT monitoring alert reference

Our alert reference article now includes the following details for each alert:

- **Alert category**, helpful when you want to investigate alerts that are aggregated by a specific activity or configure SIEM rules to generate incidents based on specific activities

- **Alert threshold**, for relevant alerts. Thresholds indicate the specific point at which an alert is triggered. The *cyberx* user can modify alert thresholds as needed from the sensor's **Support** page.

For more information, see [OT monitoring alert types and descriptions](alert-engine-messages.md), and [Supported alert categories](alert-engine-messages.md#supported-alert-categories).

## September 2022

|Service area  |Updates  |
|---------|---------|
|**OT networks**     |**All supported OT sensor software versions**: <br>- [Device vulnerabilities from the Azure portal](#device-vulnerabilities-from-the-azure-portal-public-preview)<br>- [Security recommendations for OT networks](#security-recommendations-for-ot-networks-public-preview)<br><br> **All OT sensor software versions 22.x**: [Updates for Azure cloud connection firewall rules](#updates-for-azure-cloud-connection-firewall-rules-public-preview) <br><br>**Sensor software version 22.2.7**: <br> - Bug fixes and stability improvements <br><br> **Sensor software version 22.2.6**: <br> - Bug fixes and stability improvements <br>- Enhancements to the device type classification algorithm<br><br>**Microsoft Sentinel integration**: <br>- [Investigation enhancements with IoT device entities](#investigation-enhancements-with-iot-device-entities-in-microsoft-sentinel)<br>- [Updates to the Microsoft Defender for IoT solution](#updates-to-the-microsoft-defender-for-iot-solution-in-microsoft-sentinels-content-hub)|

### Security recommendations for OT networks (Public preview)

Defender for IoT now provides security recommendations to help customers manage their OT/IoT network security posture. Defender for IoT recommendations help users form actionable, prioritized mitigation plans that address the unique challenges of OT/IoT networks. Use recommendations for lower your network's risk and attack surface.

You can see the following security recommendations from the Azure portal for detected devices across your networks:

- **Review PLC operating mode**. Devices with this recommendation are found with PLCs set to unsecure operating mode states. We recommend setting PLC operating modes to the **Secure Run** state if access is no longer required to the PLC to reduce the threat of malicious PLC programming.

- **Review unauthorized devices**. Devices with this recommendation must be identified and authorized as part of the network baseline. We recommend taking action to identify any indicated devices. Disconnect any devices from your network that remain unknown even after investigation to reduce the threat of rogue or potentially malicious devices.

Access security recommendations from one of the following locations:

- The **Recommendations** page, which displays all current recommendations across all detected OT devices.

- The **Recommendations** tab on a device details page, which displays all current recommendations for the selected device.

From either location, select a recommendation to drill down further and view lists of all detected OT devices that are currently in a *healthy* or *unhealthy* state, according to the selected recommendation. From the **Unhealthy devices** or **Healthy devices** tab, select a device link to jump to the selected device details page. For example:

:::image type="content" source="media/release-notes/recommendations.png" alt-text="Screenshot of the Review PLC operating mode recommendation page.":::

For more information, see [View the device inventory](how-to-manage-device-inventory-for-organizations.md#view-the-device-inventory) and [Enhance security posture with security recommendations](recommendations.md).

### Device vulnerabilities from the Azure portal (Public preview)

Defender for IoT now provides vulnerability data in the Azure portal for detected OT network devices. Vulnerability data is based on the repository of standards based vulnerability data documented at the [US government National Vulnerability Database (NVD)](https://www.nist.gov/programs-projects/national-vulnerability-database-nvd).

Access vulnerability data in the Azure portal from the following locations:

- On a device details page, select the **Vulnerabilities** tab to view current vulnerabilities on the selected device. For example, from the **Device inventory** page, select a specific device and then select **Vulnerabilities**.

    For more information, see [View the device inventory](how-to-manage-device-inventory-for-organizations.md#view-the-device-inventory).

- A new **Vulnerabilities** workbook displays vulnerability data across all monitored OT devices. Use the **Vulnerabilities** workbook to view data like CVE by severity or vendor, and full lists of detected vulnerabilities and vulnerable devices and components.

    Select an item in the **Device vulnerabilities**, **Vulnerable devices**, or **Vulnerable components** tables to view related information in the tables on the right.

    For example:

    :::image type="content" source="media/release-notes/vulnerabilities-workbook.png" alt-text="Screenshot of a Vulnerabilities workbook in Defender for IoT.":::

    For more information, see [Use Azure Monitor workbooks in Microsoft Defender for IoT](workbooks.md).

### Updates for Azure cloud connection firewall rules (Public preview)

OT network sensors connect to Azure to provide alert and device data and sensor health messages, access threat intelligence packages, and more. Connected Azure services include IoT Hub, Blob Storage, Event Hubs, and the Microsoft Download Center.

For OT sensors with software versions 22.x and higher, Defender for IoT now supports increased security when adding outbound allow rules for connections to Azure. Now you can define your outbound allow rules to connect to Azure without using wildcards.

When defining outbound *allow* rules to connect to Azure, you need to enable HTTPS traffic to each of the required endpoints on port 443. Outbound *allow* rules are defined once for all OT sensors onboarded to the same subscription.

For supported sensor versions, download the full list of required secure endpoints from the following locations in the Azure portal:

- **A successful sensor registration page**: After onboarding a new OT sensor with version 22.x, the successful registration page now provides instructions for next steps, including a link to the endpoints you'll need to add as secure outbound allow rules on your network. Select the **Download endpoint details** link to download the JSON file.

    For example:

    :::image type="content" source="media/release-notes/download-endpoints.png" alt-text="Screenshot of a successful OT sensor registration page with the download endpoints link.":::

- **The Sites and sensors page**: Select an OT sensor with software versions 22.x or higher, or a site with one or more supported sensor versions. Then, select **More actions** > **Download endpoint details** to download the JSON file. For example:

    :::image type="content" source="media/release-notes/download-endpoints-sites-sensors.png" alt-text="Screenshot of the Sites and sensors page with the download endpoint details link.":::

For more information, see:

- [Tutorial: Get started with Microsoft Defender for IoT for OT security](tutorial-onboarding.md)
- [Manage sensors with Defender for IoT in the Azure portal](how-to-manage-sensors-on-the-cloud.md)
- [Networking requirements](networking-requirements.md#sensor-access-to-azure-portal)

### Investigation enhancements with IoT device entities in Microsoft Sentinel

Defender for IoT's integration with Microsoft Sentinel now supports an IoT device entity page. When investigating incidents and monitoring IoT security in Microsoft Sentinel, you can now identify your most sensitive devices and jump directly to more details on each device entity page.

The IoT device entity page provides contextual device information about an IoT device, with basic device details and device owner contact information. Device owners are defined by site in the **Sites and sensors** page in Defender for IoT.

The IoT device entity page can help prioritize remediation based on device importance and business impact, as per each alert's site, zone, and sensor. For example:

:::image type="content" source="media/release-notes/iot-device-entity-page.png" alt-text="Screenshot of the IoT device entity page in Microsoft Sentinel.":::

You can also now hunt for vulnerable devices on the Microsoft Sentinel **Entity behavior** page. For example, view the top five IoT devices with the highest number of alerts, or search for a device by IP address or device name:

:::image type="content" source="media/release-notes/entity-behavior-iot-devices-alerts.png" alt-text="Screenshot of the Entity behavior page in Microsoft Sentinel.":::

For more information, see [Investigate further with IoT device entities](../../sentinel/iot-advanced-threat-monitoring.md#investigate-further-with-iot-device-entities) and [Site management options from the Azure portal](how-to-manage-sensors-on-the-cloud.md#site-management-options-from-the-azure-portal).

### Updates to the Microsoft Defender for IoT solution in Microsoft Sentinel's content hub

This month, we've released version 2.0 of the **Microsoft Defender for IoT** solution in Microsoft Sentinel's content hub, previously known as the **IoT/OT Threat Monitoring with Defender for IoT** solution.

Updates in this version of the solution include:

- **A name change**. If you'd previously installed the **IoT/OT Threat Monitoring with Defender for IoT** solution in your Microsoft Sentinel workspace, the solution is automatically renamed to **Microsoft Defender for IoT**, even if you don't update the solution.

- **Workbook improvements**: The **Defender for IoT** workbook now includes:

    - A new **Overview** dashboard with key metrics on the device inventory, threat detection, and security posture. For example:

        :::image type="content" source="media/release-notes/sentinel-workbook-overview.png" alt-text="Screenshot of the new Overview tab in the IoT OT Threat Monitoring with Defender for IoT workbook." lightbox="media/release-notes/sentinel-workbook-overview.png":::

    - A new **Vulnerabilities** dashboard with details about CVEs shown in your network and their related vulnerable devices. For example:

        :::image type="content" source="media/release-notes/sentinel-workbook-vulnerabilities.png" alt-text="Screenshot of the new Vulnerability tab in the IoT OT Threat Monitoring with Defender for IoT workbook." lightbox="media/release-notes/sentinel-workbook-vulnerabilities.png":::

    - Improvements on the **Device inventory** dashboard, including access to device recommendations, vulnerabilities, and direct links to the Defender for IoT device details pages. The **Device inventory** dashboard in the **IoT/OT Threat Monitoring with Defender for IoT** workbook is fully aligned with the Defender for IoT [device inventory data](how-to-manage-device-inventory-for-organizations.md).

- **Playbook updates**: The **Microsoft Defender for IoT** solution now supports the following SOC automation functionality with new playbooks:

  - **Automation with CVE details**: Use the *AD4IoT-CVEAutoWorkflow* playbook to enrich incident comments with CVEs of related devices based on Defender for IoT data. The incidents are triaged, and if the CVE is critical, the asset owner is notified about the incident by email.

  - **Automation for email notifications to device owners**. Use the *AD4IoT-SendEmailtoIoTOwner* playbook to have a notification email automatically sent to a device's owner about new incidents. Device owners can then reply to the email to update the incident as needed. Device owners are defined at the site level in Defender for IoT.

  - **Automation for incidents with sensitive devices**:  Use the *AD4IoT-AutoTriageIncident* playbook to automatically update an incident's severity based on the devices involved in the incident, and their sensitivity level or importance to your organization. For example, any incident involving a sensitive device can be automatically escalated to a higher severity level.

For more information, see [Investigate Microsoft Defender for IoT incidents with Microsoft Sentinel](../../sentinel/iot-advanced-threat-monitoring.md?bc=%2fazure%2fdefender-for-iot%2fbreadcrumb%2ftoc.json&toc=%2fazure%2fdefender-for-iot%2forganizations%2ftoc.json).

## August 2022

|Service area  |Updates  |
|---------|---------|
|**OT networks**     |**Sensor software version 22.2.5**: Minor version with stability improvements<br><br>**Sensor software version 22.2.4**: [New alert columns with timestamp data](#new-alert-columns-with-timestamp-data)<br><br>**Sensor software version 22.1.3**: [Sensor health from the Azure portal (Public preview)](#sensor-health-from-the-azure-portal-public-preview) |

### New alert columns with timestamp data

Starting with OT sensor version 22.2.4, Defender for IoT alerts in the Azure portal and the sensor console now show the following columns and data:

- **Last detection**. Defines the last time the alert was detected in the network, and replaces the **Detection time** column.

- **First detection**. Defines the first time the alert was detected in the network.

- **Last activity**. Defines the last time the alert was changed, including manual updates for severity or status, or automated changes for device updates or device/alert deduplication.

The **First detection** and **Last activity** columns aren't displayed by default. Add them to your **Alerts** page as needed.

> [!TIP]
> If you're also a Microsoft Sentinel user, you'll be familiar with similar data from your Log Analytics queries. The new alert columns in Defender for IoT are mapped as follows:
>
> - The Defender for IoT **Last detection** time is similar to the Log Analytics **EndTime**
> - The Defender for IoT **First detection** time is similar to the Log Analytics **StartTime**
> - The Defender for IoT **Last activity** time is similar to the Log Analytics **TimeGenerated**
For more information, see:

- [View alerts on the Defender for IoT portal](how-to-manage-cloud-alerts.md)
- [View alerts on your sensor](how-to-view-alerts.md)
- [OT threat monitoring in enterprise SOCs](concept-sentinel-integration.md)

### Sensor health from the Azure portal (Public preview)

For OT sensor versions 22.1.3 and higher, you can use the new sensor health widgets and table column data to monitor sensor health directly from the **Sites and sensors** page on the Azure portal.

:::image type="content" source="media/release-notes/sensor-health.png" alt-text="Screenshot showing the new sensor health widgets." lightbox="media/release-notes/sensor-health.png":::

We've also added a sensor details page, where you drill down to a specific sensor from the Azure portal. On the **Sites and sensors** page, select a specific sensor name. The sensor details page lists basic sensor data, sensor health, and any sensor settings applied.

For more information, see [Understand sensor health](how-to-manage-sensors-on-the-cloud.md#understand-sensor-health) and [Sensor health message reference](sensor-health-messages.md).

## July 2022

|Service area  |Updates  |
|---------|---------|
|**Enterprise IoT networks**     | - [Enterprise IoT and Defender for Endpoint integration in GA](#enterprise-iot-and-defender-for-endpoint-integration-in-ga)        |
|**OT networks**     |**Sensor software version 22.2.4**: <br>- [Device inventory enhancements](#device-inventory-enhancements)<br>- [Enhancements for the ServiceNow integration API](#enhancements-for-the-servicenow-integration-api)<br><br>**Sensor software version 22.2.3**:<br>- [OT appliance hardware profile updates](#ot-appliance-hardware-profile-updates)<br>- [PCAP access from the Azure portal](#pcap-access-from-the-azure-portal-public-preview)<br>- [Bi-directional alert synch between sensors and the Azure portal](#bi-directional-alert-synch-between-sensors-and-the-azure-portal-public-preview)<br>- [Sensor connections restored after certificate rotation](#sensor-connections-restored-after-certificate-rotation)<br>- [Support diagnostic log enhancements](#support-diagnostic-log-enhancements-public-preview)<br>- [Improved security for uploading protocol plugins](#improved-security-for-uploading-protocol-plugins)<br>- [Sensor names shown in browser tabs](#sensor-names-shown-in-browser-tabs)<br><br>**Sensor software version 22.1.7**: <br>- [Same passwords for *cyberx_host* and *cyberx* users](#same-passwords-for-cyberx_host-and-cyberx-users)  |
|**Cloud-only features**     |  - [Microsoft Sentinel incident synch with Defender for IoT alerts](#microsoft-sentinel-incident-synch-with-defender-for-iot-alerts) |

### Enterprise IoT and Defender for Endpoint integration in GA

The Enterprise IoT integration with Microsoft Defender for Endpoint is now in General Availability (GA). With this update, we've made the following updates and improvements:

- Onboard an Enterprise IoT plan directly in Defender for Endpoint. For more information, see [Manage your subscriptions](how-to-manage-subscriptions.md) and the [Defender for Endpoint documentation](/microsoft-365/security/defender-endpoint/enable-microsoft-defender-for-iot-integration).

- Seamless integration with Microsoft Defender for Endpoint to view detected Enterprise IoT devices, and their related alerts, vulnerabilities, and recommendations in the Microsoft 365 Security portal. For more information, see the [Enterprise IoT tutorial](tutorial-getting-started-eiot-sensor.md) and the [Defender for Endpoint documentation](/microsoft-365/security/defender-endpoint/enable-microsoft-defender-for-iot-integration). You can continue to view detected Enterprise IoT devices on the Defender for IoT **Device inventory** page in the Azure portal.

- All Enterprise IoT sensors are now automatically added to the same site in Defender for IoT, named **Enterprise network**. When onboarding a new Enterprise IoT device, you only need to define a sensor name and select your subscription, without defining a site or zone.

> [!NOTE]
> The Enterprise IoT network sensor and all detections remain in Public Preview.

### Same passwords for cyberx_host and cyberx users

During OT monitoring software installations and updates, the **cyberx** user is assigned a random password. When you update from version 10.x.x to version 22.1.7, the **cyberx_host** password is assigned with an identical password to the **cyberx** user.

For more information, see [Install OT agentless monitoring software](how-to-install-software.md) and [Update Defender for IoT OT monitoring software](update-ot-software.md).

### Device inventory enhancements

Starting in OT sensor versions 22.2.4, you can now take the following actions from the sensor console's **Device inventory** page:

- **Merge duplicate devices**. You might need to merge devices if the sensor has discovered separate network entities that are associated with a single, unique device. Examples of this scenario might include a PLC with four network cards, a laptop with both WiFi and a physical network card, or a single workstation with multiple network cards.

- **Delete single devices**. Now, you can delete a single device that hasn't communicated for at least 10 minutes.

- **Delete inactive devices by admin users**. Now, all admin users, in addition to the **cyberx** user, can delete inactive devices.

Also starting in version 22.2.4, in the sensor console's **Device inventory** page, the **Last seen** value in the device details pane is replaced by **Last activity**. For example:

:::image type="content" source="media/release-notes/last-activity-new.png" alt-text="Screenshot of the new Last activity field showing in the sensor console's device details pane on the Device inventory page.":::

For more information, see [Manage your OT device inventory from a sensor console](how-to-investigate-sensor-detections-in-a-device-inventory.md).

### Enhancements for the ServiceNow integration API

OT sensor version 22.2.4 provides enhancements for the `devicecves` API, which gets details about the CVEs found for a given device.

Now you can add any of the following parameters to your query to fine tune your results:

- “**sensorId**” - Shows results from a specific sensor, as defined by the given sensor ID.
- “**score**” - Determines a minimum CVE score to be retrieved. All results have a CVE score equal to or higher than the given value. Default = **0**.
- “**deviceIds**” -  A comma-separated list of device IDs from which you want to show results. For example: **1232,34,2,456**

For more information, see [Integration API reference for on-premises management consoles (Public preview)](api/management-integration-apis.md).

### OT appliance hardware profile updates

We've refreshed the naming conventions for our OT appliance hardware profiles for greater transparency and clarity.

The new names reflect both the *type* of profile, including *Corporate*, *Enterprise*, and *Production line*, and also the related disk storage size.

Use the following table to understand the mapping between legacy hardware profile names and the current names used in the updated software installation:

|Legacy name  |New name  | Description |
|---------|---------|---------|
|**Corporate**     |    **C5600** | A *Corporate* environment, with: <br>16 Cores<br>32-GB RAM<br>5.6-TB disk storage |
|**Enterprise**     | **E1800** | An *Enterprise* environment, with: <br>Eight Cores<br>32-GB RAM<br>1.8-TB disk storage        |
|**SMB**    |    **L500**   | A *Production line* environment, with: <br>Four Cores<br>8-GB RAM<br>500-GB disk storage  |
|**Office**     | **L100**  | A *Production line* environment, with: <br>Four Cores<br>8-GB RAM<br>100-GB disk storage      |
|**Rugged**     |   **L64** | A *Production line* environment, with: <br>Four Cores<br>8-GB RAM<br>64-GB disk storage     |

We also now support new enterprise hardware profiles, for sensors supporting both 500 GB and 1-TB disk sizes.

For more information, see [Which appliances do I need?](ot-appliance-sizing.md)

### PCAP access from the Azure portal (Public preview)

Now you can access the raw traffic files, known as packet capture files or PCAP files, directly from the Azure portal. This feature supports SOC or OT security engineers who want to investigate alerts from Defender for IoT or Microsoft Sentinel, without having to access each sensor separately.

:::image type="content" source="media/release-notes/pcap-request.png" alt-text="Screenshot of the Download PCAP button." lightbox="media/release-notes/pcap-request.png":::

PCAP files are downloaded to your Azure storage.

For more information, see [View and manage alerts from the Azure portal](how-to-manage-cloud-alerts.md).

### Bi-directional alert synch between sensors and the Azure portal (Public preview)

For sensors updated to version 22.2.1, alert statuses and learn statuses are now fully synchronized between the sensor console and the Azure portal. For example, this means that you can close an alert on the Azure portal or the sensor console, and the alert status is updated in both locations.

*Learn* an alert from either the Azure portal or the sensor console to ensure that it's not triggered again the next time the same network traffic is detected.

The sensor console is also synchronized with an on-premises management console, so that alert statuses and learn statuses remain up-to-date across your management interfaces.

For more information, see:

- [View and manage alerts from the Azure portal](how-to-manage-cloud-alerts.md)
- [View and manage alerts on your sensor](how-to-view-alerts.md)
- [Work with alerts on the on-premises management console](legacy-central-management/how-to-work-with-alerts-on-premises-management-console.md)

### Sensor connections restored after certificate rotation

Starting in version 22.2.3, after rotating your certificates, your sensor connections are automatically restored to your on-premises management console, and you don't need to reconnect them manually.

For more information, see [Create SSL/TLS certificates for OT appliances](ot-deploy/create-ssl-certificates.md) and [Manage SSL/TLS certificates](how-to-manage-individual-sensors.md#manage-ssltls-certificates).

### Support diagnostic log enhancements (Public preview)

Starting in sensor version [22.1.1](#new-support-diagnostics-log), you've been able to download a diagnostic log from the sensor console to send to support when you open a ticket.

Now, for locally managed sensors, you can upload that diagnostic log directly on the Azure portal.

:::image type="content" source="media/how-to-manage-sensors-on-the-cloud/upload-diagnostics-log.png" alt-text="Screenshot of the Send diagnostic files to support option." lightbox="media/how-to-manage-sensors-on-the-cloud/upload-diagnostics-log.png":::

> [!TIP]
> For cloud-connected sensors, starting from sensor version [22.1.3](#march-2022), the diagnostic log is automatically available to support when you open the ticket.
>
For more information, see:

- [Download a diagnostics log for support](how-to-troubleshoot-sensor.md#download-a-diagnostics-log-for-support)
- [Upload a diagnostics log for support](how-to-manage-sensors-on-the-cloud.md#upload-a-diagnostics-log-for-support)

### Improved security for uploading protocol plugins

This version of the sensor provides an improved security for uploading proprietary plugins you've created using the Horizon SDK.

:::image type="content" source="media/release-notes/horizon.png" alt-text="Screenshot of the new Protocols DPI (Horizon Plugins) page." lightbox="media/release-notes/horizon.png":::

For more information, see [Manage proprietary protocols with Horizon plugins](resources-manage-proprietary-protocols.md).

### Sensor names shown in browser tabs

Starting in sensor version 22.2.3, your sensor's name is displayed in the browser tab, making it easier for you to identify the sensors you're working with.

For example:

:::image type="content" source="media/release-notes/sensor-name-in-tab.png" alt-text="Screenshot of the sensor name shown in the browser tab.":::

For more information, see [Manage individual sensors](how-to-manage-individual-sensors.md).

### Microsoft Sentinel incident synch with Defender for IoT alerts

The **IoT OT Threat Monitoring with Defender for IoT** solution now ensures that alerts in Defender for IoT are updated with any related incident **Status** changes from Microsoft Sentinel.

This synchronization overrides any status defined in Defender for IoT, in the Azure portal or the sensor console, so that the alert statuses match that of the related incident.

Update your **IoT OT Threat Monitoring with Defender for IoT** solution to use the latest synchronization support, including the new **AD4IoT-AutoAlertStatusSync** playbook. After updating the solution, make sure that you also take the [required steps](../../sentinel/iot-advanced-threat-monitoring.md?#update-alert-statuses-in-defender-for-iot) to ensure that the new playbook works as expected.

For more information, see:

- [Tutorial: Integrate Defender for IoT and Sentinel](../../sentinel/iot-solution.md?tabs=use-out-of-the-box-analytics-rules-recommended)
- [View and manage alerts on the Defender for IoT portal (Preview)](how-to-manage-cloud-alerts.md)
- [View alerts on your sensor](how-to-view-alerts.md)

## June 2022

- **Sensor software version 22.1.6**: Minor version with maintenance updates for internal sensor components

- **Sensor software version 22.1.5**:  Minor version to improve TI installation packages and software updates

We've also recently optimized and enhanced our documentation as follows:

- [Updated appliance catalog for OT environments](#updated-appliance-catalog-for-ot-environments)
- [Documentation reorganization for end-user organizations](#documentation-reorganization-for-end-user-organizations)

### Updated appliance catalog for OT environments

We've refreshed and revamped the catalog of supported appliances for monitoring OT environments. These appliances support flexible deployment options for environments of all sizes and can be used to host both the OT monitoring sensor and on-premises management consoles.

Use the new pages as follows:

1. **Understand which hardware model best fits your organization's needs.** For more information, see [Which appliances do I need?](ot-appliance-sizing.md)

1. **Learn about the preconfigured hardware appliances that are available to purchase, or system requirements for virtual machines.** For more information, see [Preconfigured physical appliances for OT monitoring](ot-pre-configured-appliances.md) and [OT monitoring with virtual appliances](ot-virtual-appliances.md).

    For more information about each appliance type, use the linked reference page, or browse through our new **Reference > OT monitoring appliances** section.

    :::image type="content" source="media/release-notes/appliance-catalog.png" alt-text="Screenshot of the new appliance catalog reference section." lightbox="media/release-notes/appliance-catalog.png":::

    Reference articles for each appliance type, including virtual appliances, include specific steps to configure the appliance for OT monitoring with Defender for IoT. Generic software installation and troubleshooting procedures are still documented in [Defender for IoT software installation](how-to-install-software.md).

### Documentation reorganization for end-user organizations

We recently reorganized our Defender for IoT documentation for end-user organizations, highlighting a clearer path for onboarding and getting started.

Check out our new structure to follow through viewing devices and assets, managing alerts, vulnerabilities and threats, integrating with other services, and deploying and maintaining your Defender for IoT system.

**New and updated articles include**:

- [Welcome to Microsoft Defender for IoT for organizations](overview.md)
- [Microsoft Defender for IoT architecture](architecture.md)
- [Quickstart: Get started with Defender for IoT](getting-started.md)
- [Tutorial: Microsoft Defender for IoT trial setup](tutorial-onboarding.md)
- [Tutorial: Get started with Enterprise IoT](tutorial-getting-started-eiot-sensor.md)

> [!NOTE]
> To send feedback on docs via GitHub, scroll to the bottom of the page and select the **Feedback** option for **This page**. We'd be glad to hear from you!
>

## April 2022

- [Extended device property data in the Device inventory](#extended-device-property-data-in-the-device-inventory)

### Extended device property data in the Device inventory

**Sensor software version**: 22.1.4

Starting for sensors updated to version 22.1.4, the **Device inventory** page on the Azure portal shows extended data for the following fields:

- **Description**
- **Tags**
- **Protocols**
- **Scanner**
- **Last Activity**

For more information, see [Manage your device inventory from the Azure portal](how-to-manage-device-inventory-for-organizations.md).

## March 2022

**Sensor version**: 22.1.3

- [Use Azure Monitor workbooks with Microsoft Defender for IoT](#use-azure-monitor-workbooks-with-microsoft-defender-for-iot-public-preview)
- [IoT OT Threat Monitoring with Defender for IoT solution GA](#iot-ot-threat-monitoring-with-defender-for-iot-solution-ga)
- [Edit and delete devices from the Azure portal](#edit-and-delete-devices-from-the-azure-portal-public-preview)
- [Key state alert updates](#key-state-alert-updates-public-preview)
- [Sign out of a CLI session](#sign-out-of-a-cli-session)

### Use Azure Monitor workbooks with Microsoft Defender for IoT (Public preview)

[Azure Monitor workbooks](../../azure-monitor/visualize/workbooks-overview.md) provide graphs and dashboards that visually reflect your data, and are now available directly in Microsoft Defender for IoT with data from [Azure Resource Graph](../../governance/resource-graph/index.yml).

In the Azure portal, use the new Defender for IoT **Workbooks** page to view workbooks created by Microsoft and provided out-of-the-box, or create custom workbooks of your own.

:::image type="content" source="media/release-notes/workbooks.png" alt-text="Screenshot of the new Workbooks page." lightbox="media/release-notes/workbooks.png":::

For more information, see [Use Azure Monitor workbooks in Microsoft Defender for IoT](workbooks.md).

### IoT OT Threat Monitoring with Defender for IoT solution GA

The IoT OT Threat Monitoring with Defender for IoT solution in Microsoft Sentinel is now GA. In the Azure portal, use this solution to help secure your entire OT environment, whether you need to protect existing OT devices or build security into new OT innovations.

For more information, see [OT threat monitoring in enterprise SOCs](concept-sentinel-integration.md) and [Tutorial: Integrate Defender for IoT and Sentinel](../../sentinel/iot-solution.md?tabs=use-out-of-the-box-analytics-rules-recommended).

### Edit and delete devices from the Azure portal (Public preview)

The **Device inventory** page in the Azure portal now supports the ability to edit device details, such as security, classification, location, and more:

:::image type="content" source="media/release-notes/edit-device-details.png" alt-text="Screenshot of the Device inventory page showing the Edit pane." lightbox="media/release-notes/edit-device-details.png":::

For more information, see [Edit device details](how-to-manage-device-inventory-for-organizations.md#edit-device-details).

You can only delete devices from Defender for IoT if they've been inactive for more than 14 days.  For more information, see [Delete a device](how-to-manage-device-inventory-for-organizations.md#delete-a-device).

### Key state alert updates (Public preview)

Defender for IoT now supports the Rockwell protocol for PLC operating mode detections.

For the Rockwell protocol, the **Device inventory** pages in both the Azure portal and the sensor console now indicate the PLC operating mode key and run state, and whether the device is currently in a secure mode.

If the device's PLC operating mode is ever switched to an unsecured mode, such as *Program* or *Remote*, a **PLC Operating Mode Changed** alert is generated.

For more information, see [Manage your IoT devices with the device inventory for organizations](how-to-manage-device-inventory-for-organizations.md).

### Sign out of a CLI session

Starting in this version, CLI users are automatically signed out of their session after 300 inactive seconds. To sign out manually, use the new `logout` CLI command.

For more information, see [Work with Defender for IoT CLI commands](references-work-with-defender-for-iot-cli-commands.md).

## February 2022

**Sensor software version**: 22.1.1

- [New sensor installation wizard](#new-sensor-installation-wizard)
- [Sensor redesign and unified Microsoft product experience](#sensor-redesign-and-unified-microsoft-product-experience)
- [Enhanced sensor Overview page](#enhanced-sensor-overview-page)
- [New support diagnostics log](#new-support-diagnostics-log)
- [Alert updates](#alert-updates)
- [Custom alert updates](#custom-alert-updates)
- [CLI command updates](#cli-command-updates)
- [Update to version 22.1.x](#update-to-version-221x)
- [New connectivity model and firewall requirements](#new-connectivity-model-and-firewall-requirements)
- [Protocol improvements](#protocol-improvements)
- [Modified, replaced, or removed options and configurations](#modified-replaced-or-removed-options-and-configurations)

### New sensor installation wizard

Previously, you needed to use separate dialogs to upload a sensor activation file, verify your sensor network configuration, and configure your SSL/TLS certificates.

Now, when installing a new sensor or a new sensor version, our installation wizard provides a streamlined interface to do all these tasks from a single location.

For more information, see [Defender for IoT installation](how-to-install-software.md).

### Sensor redesign and unified Microsoft product experience

The Defender for IoT sensor console has been redesigned to create a unified Microsoft Azure experience and enhance and simplify workflows.

These features are now Generally Available (GA). Updates include the general look and feel, drill-down panes, search and action options, and more. For example:

**Simplified workflows include**:

- The **Device inventory** page now includes detailed device pages. Select a device in the table and then select **View full details** on the right.

    :::image type="content" source="media/release-notes/device-inventory-details.png" alt-text="Screenshot of the View full details button." lightbox="media/release-notes/device-inventory-details.png":::

- Properties updated from the sensor's inventory are now automatically updated in the cloud device inventory.

- The device details pages, accessed either from the **Device map** or **Device inventory** pages, is shown as read only. To modify device properties, select **Edit properties** on the bottom-left.

- The **Data mining** page now includes reporting functionality. While the **Reports** page was removed, users with read-only access can view updates on the **Data mining page** without the ability to modify reports or settings.

    For admin users creating new reports, you can now toggle on a **Send to CM** option to send the report to a central management console as well. For more information, see [Create a report](how-to-create-data-mining-queries.md#create-an-ot-sensor-custom-data-mining-report)

- The **System settings** area has been reorganized in to sections for *Basic* settings, settings for *Network monitoring*, *Sensor management*, *Integrations*, and *Import settings*.

- The sensor online help now links to key articles in the Microsoft Defender for IoT documentation.

**Defender for IoT maps now include**:

- A new **Map View** is now shown for alerts and on the device details pages, showing where in your environment the alert or device is found.

- Right-click a device on the map to view contextual information about the device, including related alerts, event timeline data, and connected devices.

- Select **Disable Display IT Networks Groups** to prevent the ability to collapse IT networks in the map. This option is turned on by default.

- The **Simplified Map View** option has been removed.

We've also implemented global readiness and accessibility features to comply with Microsoft standards. In the on-premises sensor console, these updates include both high contrast and regular screen display themes and localization for over 15 languages.

For example:

:::image type="content" source="media/release-notes/dark-mode.png" alt-text="Screenshot of the sensor console in dark mode." lightbox="media/release-notes/dark-mode.png":::

Access global readiness and accessibility options from the **Settings** icon at the top-right corner of your screen:

:::image type="content" source="media/release-notes/settings-icon.png" alt-text="Screenshot that shows localization options." lightbox="media/release-notes/settings-icon.png":::

### Enhanced sensor Overview page

The Defender for IoT sensor portal's **Dashboard** page has been renamed as **Overview**, and now includes data that better highlights system deployment details, critical network monitoring health, top alerts, and important trends and statistics.

:::image type="content" source="media/release-notes/new-interface.png" alt-text="Screenshot that shows the updated interface." lightbox="media/release-notes/new-interface.png":::

The Overview page also now serves as a *black box* to view your overall sensor status in case your outbound connections, such as to the Azure portal, go down.

Create more dashboards using the **Trends & Statistics** page, located under the **Analyze** menu on the left.

### New support diagnostics log

Now you can get a summary of the log and system information that gets added to your support tickets. In the **Backup and Restore** dialog, select **Support Ticket Diagnostics**.

:::image type="content" source="media/release-notes/support-ticket-diagnostics.png" alt-text="Screenshot of the Backup and Restore dialog showing the Support Ticket Diagnostics option." lightbox="media/release-notes/support-ticket-diagnostics.png":::

For more information, see [Download a diagnostics log for support](how-to-troubleshoot-sensor.md#download-a-diagnostics-log-for-support)

### Alert updates

**In the Azure portal**:

Alerts are now available in Defender for IoT in the Azure portal. Work with alerts to enhance the security and operation of your IoT/OT network.

The new **Alerts** page is currently in Public Preview, and provides:

- An aggregated, real-time view of threats detected by network sensors.
- Remediation steps for devices and network processes.
- Streaming alerts to Microsoft Sentinel and empower your SOC team.
- Alert storage for 90 days from the time they're first detected.
- Tools to investigate source and destination activity, alert severity and status, MITRE ATT&CK information, and contextual information about the alert.

For example:

:::image type="content" source="media/release-notes/mitre.png" alt-text="Screenshot of the Alerts page showing MITRE information." lightbox="media/release-notes/mitre.png":::

**On the sensor console**:

On the sensor console, the **Alerts** page now shows details for alerts detected by sensors that are configured with a cloud-connection to Defender for IoT on Azure. Users working with alerts in both Azure and on-premises should understand how alerts are managed between the Azure portal and the on-premises components.

:::image type="content" source="media/release-notes/alerts-in-console.png" alt-text="Screenshot of the new Alerts page on the sensor console." lightbox="media/release-notes/alerts-in-console.png":::

Other alert updates include:

- **Access contextual data** for each alert, such as events that occurred around the same time, or a map of connected devices. Maps of connected devices are available for sensor console alerts only.

- **Alert statuses** are updated, and, for example,  now include a *Closed* status instead of *Acknowledged*.

- **Alert storage** for 90 days from the time that they're first detected.

- The **Backup Activity with Antivirus Signatures Alert**. This new alert warning is triggered for traffic detected between a source device and destination backup server, which is often legitimate backup activity. Critical or major malware alerts are no longer triggered for such activity.

- **During upgrades**, sensor console alerts that are currently archived are deleted. Pinned alerts are no longer supported, so pins are removed for sensor console alerts as relevant.

For more information, see [View alerts on your sensor](how-to-view-alerts.md).

### Custom alert updates

The sensor console's **Custom alert rules** page now provides:

- Hit count information in the **Custom alert rules** table, with at-a-glance details about the number of alerts triggered in the last week for each rule you've created.

- The ability to schedule custom alert rules to run outside of regular working hours.

- The ability to alert on any field that can be extracted from a protocol using the DPI engine.

- Complete protocol support when creating custom rules, and support for an extensive range of related protocol variables.

    :::image type="content" source="media/how-to-manage-sensors-on-the-cloud/protocol-support-custom-alerts.png" alt-text="Screenshot of the updated Custom alerts dialog. "lightbox="media/how-to-manage-sensors-on-the-cloud/protocol-support-custom-alerts.png":::

For more information, see [Create custom alert rules on an OT sensor](how-to-accelerate-alert-incident-response.md#create-custom-alert-rules-on-an-ot-sensor).

### CLI command updates

The Defender for IoT sensor software installation is now containerized. With the now-containerized sensor, you can use the *cyberx_host* user to investigate issues with other containers or the operating system, or to send files via FTP.

This *cyberx_host* user is available by default and connects to the host machine. If you need to, recover the password for the *cyberx_host* user from the **Sites and sensors** page in Defender for IoT.

As part of the containerized sensor, the following CLI commands have been modified:

|Legacy name  |Replacement  |
|---------|---------|
|`cyberx-xsense-reconfigure-interfaces`    |`sudo dpkg-reconfigure iot-sensor`         |
|`cyberx-xsense-reload-interfaces`     |  `sudo dpkg-reconfigure iot-sensor`      |
|`cyberx-xsense-reconfigure-hostname`     | `sudo dpkg-reconfigure iot-sensor`       |
| `cyberx-xsense-system-remount-disks` |`sudo dpkg-reconfigure iot-sensor` |

The `sudo cyberx-xsense-limit-interface-I eth0 -l value` CLI command was removed. This command was used to limit the interface bandwidth that the sensor uses for day-to-day procedures, and is no longer supported.

For more information, see [Defender for IoT installation](how-to-install-software.md), [Work with Defender for IoT CLI commands](references-work-with-defender-for-iot-cli-commands.md), and [CLI command reference from OT network sensors](cli-ot-sensor.md).

### Update to version 22.1.x

To use all of Defender for IoT's latest features, make sure to update your sensor software versions to 22.1.x.

If you're on a legacy version, you might need to run a series of updates in order to get to the latest version. You'll also need to update your firewall rules and reactivate your sensor with a new activation file.

After you've upgraded to version 22.1.x, the new upgrade log can be found at the following path, accessed via SSH and the *cyberx_host* user: `/opt/sensor/logs/legacy-upgrade.log`.

For more information, see [Update OT system software](update-ot-software.md).

> [!NOTE]
> Upgrading to version 22.1.x is a large update, and you should expect the update process to require more time than previous updates.
>

### New connectivity model and firewall requirements

Defender for IoT version 22.1.x supports a new set of sensor connection methods that provide simplified deployment, improved security, scalability, and flexible connectivity.

In addition to [migration steps](update-legacy-ot-software.md#migrate-a-cloud-connection-from-the-legacy-method), this new connectivity model requires that you open a new firewall rule. For more information, see:

- **New firewall requirements**: [Sensor access to Azure portal](networking-requirements.md#sensor-access-to-azure-portal).
- **Architecture**: [Sensor connection methods](architecture-connections.md)
- **Connection procedures**: [Connect your sensors to Microsoft Defender for IoT](connect-sensors.md)

### Protocol improvements

This version of Defender for IoT provides improved support for:

- Profinet DCP
- Honeywell
- Windows endpoint detection

For more information, see [Microsoft Defender for IoT - supported IoT, OT, ICS, and SCADA protocols](concept-supported-protocols.md).

### Modified, replaced, or removed options and configurations

The following Defender for IoT options and configurations have been moved, removed, and/or replaced:

- Reports previously found on the **Reports** page are now shown on the **Data Mining** page instead. You can also continue to view data mining information directly from the on-premises management console.

- Changing a locally managed sensor name is now supported only by onboarding the sensor to the Azure portal again with the new name. Sensor names can no longer be changed directly from the sensor. For more information, see [Upload a new activation file](how-to-manage-individual-sensors.md#upload-a-new-activation-file).

## Next steps

[Getting started with Defender for IoT](getting-started.md)
