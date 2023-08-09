---
title: Hybrid or air-gapped deployment path for sensor management - Microsoft Defender for IoT
description: Learn about additional steps involved in deploying Microsoft Defender for IoT in a hybrid or air-gapped environment.
ms.topic: install-set-up-deploy
ms.date: 08/07/2023
---

# Deploy hybrid or air-gapped OT sensor management

> [!IMPORTANT]
> The [legacy on-premises management console](../legacy-central-management/legacy-air-gapped-deploy.md) is planned for deprecation on September 1, 2023. Instead, we recommend using either Microsoft cloud services or existing IT infrastructure for central monitoring and maintenance in hybrid and air-gapped environments.
>
> For more information, see [Recommended architecture for hybrid or air-gapped environments](air-gapped-architecture.md).
>

Digital transformation across OT infrastructure has left many fully air-gapped organizations moving to some level of hybrid cloud connectivity. Rather than not using the cloud at all, many organizations focus on using cloud service securely. Attackers continue evolving in parallel, learning to travel laterally across silos and perimeters, creating an ever growing attack surface.

This article describes how to deploy Microsoft Defender for IoT when working in an air-gapped or hybrid environment.  Rather than keeping all Defender for IoT's maintenance infrastructure contained in a closed architecture, we recommend that you use existing IT infrastructure and any cloud services, especially Microsoft cloud services, to keep your security operations running smoothly and efficiently.

## Architecture recommendations

The following image shows a high-level map of Defender for IoT's architecture guidance for air-gapped and hybrid networks.

:::image type="content" source="../media/on-premises-architecture/on-premises-architecture.png" alt-text="Diagram of the new architecture for hybrid and air-gapped support.":::

In this architecture, three sensors connect to four routers in different logical zones across the organization. The sensors sit behind a firewall, and support local, on-premises maintenance abilities, such as:

- Proxy services for accessing non-local resources
- Backup and restore. We recommend that after backing up your sensor, you further push your backup files to other local file systems.
- Software updates. Download version updates from the Microsoft cloud and then run your updates locally on individual sensors. <!--what if you have many? link to cli?-->
- Alert forwarding, such as to local security information and event management (SIEM) systems

We also recommend that you connect each sensor to a SNMP MIB server for sensor health monitoring.

> [!TIP]
> Defender for IoT's OT sensors can communicate directly with your existing security stack via API. For more information, see [Defender for IoT API reference](../references-work-with-defender-for-iot-apis.md).
>
> Wherever possible, we recommend that you configure cloud-to-cloud integrations from Azure for reliability to your partner services and lower costs. For example, see [Stream Defender for IoT cloud alerts to a partner SIEM](../integrations/send-cloud-data-to-partners.md).


## Deployment flow
<!--THIS ARTICLE NEEDS TO BE REWORKED WITH NEW DEPLOYMENT GUIDANCE FOR NEW ARCHITECTURE-->



When you're working with multiple, air-gapped OT sensors that can't be managed by the Azure portal, we recommend deploying an on-premises management console to manage your air-gapped OT sensors.

The following image describes the steps included in deploying an on-premises management console. Learn more about each deployment step in the sections below, including relevant cross-references for more details.

Deploying an on-premises management console is done by your deployment team. You can deploy an on-premises management console before or after you deploy your OT sensors, or in parallel.

:::image type="content" source="../media/deployment-paths/air-gapped-deploy.png" alt-text="Diagram of an OT monitoring deployment path." border="false" lightbox="../media/deployment-paths/air-gapped-deploy.png":::

## Deployment steps

|Step  |Description  |
|---------|---------|
|**[Prepare an on-premises management console appliance](prepare-management-appliance.md)**     |   Just as you'd [prepared an on-premises appliance](../best-practices/plan-prepare-deploy.md#prepare-on-premises-appliances) for your OT sensors, prepare an appliance for your on-premises management console. To deploy a CA-signed certificate for production environments, make sure to prepare your certificate as well. |
|**[Install Microsoft Defender for IoT on-premises management console software](install-software-on-premises-management-console.md)**     |   Download installation software from the Azure portal and install it on your on-premises management console appliance.  |
|**[Activate and set up an on-premises management console](activate-deploy-management.md)**     |    Use an activation file downloaded from the Azure portal to activate your on-premises management console.  |
|**[Create OT sites and zones on an on-premises management console](sites-and-zones-on-premises.md)**     |  If you're working with a large, air-gapped deployment, we recommend creating sites and zones on your on-premises management console, which help you monitor for unauthorized traffic crossing network segments, and is part of deploying Defender for IoT with [Zero Trust](/security/zero-trust/zero-trust-overview) principles.   |
|**[Connect OT network sensors to the on-premises management console](connect-sensors-to-management.md)**     |     Connect your air-gapped OT sensors to your on-premises management console to view aggregated data and configure further settings across all connected systems.    |

> [!NOTE]
> Sites and zones configured on the Azure portal are not synchronized with [sites and zones configured on an on-premises management console](sites-and-zones-on-premises.md).
>
> When working with a large deployment, we recommend that you use the Azure portal to manage cloud-connected sensors, and an on-premises management console to manage locally-managed sensors.

## Optional configurations

When deploying an on-premises management console, you may also want to configure the following options:

- [Active Directory integration](../legacy-central-management/install-software-on-premises-management-console.md#integrate-users-with-active-directory), to allow Active Directory users to sign into your on-premises management console, use Active Directory groups, and configure global access groups.

- [Proxy tunneling access](#access-ot-network-sensors-via-proxy-tunneling) from OT network sensors, enhancing system security across your Defender for IoT system

- [High availability](#high-availability-for-on-premises-management-consoles) for on-premises management consoles, lowering the risk on your OT sensor management resources

#### Access OT network sensors via proxy tunneling

You might want to enhance your system security by preventing the on-premises management console to access OT sensors directly.

In such cases, configure proxy tunneling on your on-premises management console to allow users to connect to OT sensors via the on-premises management console. For example:

:::image type="content" source="../media/tutorial-install-components/sensor-system-graph.png" alt-text="Screenshot that shows access to the sensor." border="false":::

Once signed into the OT sensor, user experience remains the same. For more information, see [Configure OT sensor access via tunneling](connect-sensors-to-management.md#configure-ot-sensor-access-via-tunneling).

#### High availability for on-premises management consoles

When deploying a large OT monitoring system with Defender for IoT, you may want to use a pair of primary and secondary machines for high availability on your on-premises management console.

When using a high availability architecture:

|Feature  |Description  |
|---------|---------|
|**Secure connections**     | An on-premises management console SSL/TLS certificate is applied to create a secure connection between the primary and secondary appliances. Use a CA-signed certificate or the self-signed certificate generated during installation. For more information, see: <br>- [SSL/TLS certificate requirements for on-premises resources](../best-practices/certificate-requirements.md) <br>- [Create SSL/TLS certificates for OT appliances](create-ssl-certificates.md) <br>- [Manage SSL/TLS certificates](../legacy-central-management/how-to-manage-the-on-premises-management-console.md#manage-ssltls-certificates) |
|**Data backups**     |  The primary on-premises management console data is automatically backed up to the secondary on-premises management console every 10 minutes. <br><br>For more information, see [Backup and restore the on-premises management console](../legacy-central-management/back-up-restore-management.md).       |
|**System settings**     |  The system settings defined on the primary on-premises management console are duplicated on the secondary. For example, if the system settings are updated on the primary, they're also updated on the secondary.       |

For more information, see [About high availability](../how-to-set-up-high-availability.md).

## Next steps

> [!div class="step-by-step"]
> [Prepare an on-premises management console appliance »](prepare-management-appliance.md)
