---
title: On-premises management console deployment path - Microsoft Defender for IoT
description: Learn about the steps involved in deploying a Microsoft Defender for IoT on-premises management console to centrally manage and view data from multiple locally-managed, air-gapped OT sensors.
ms.topic: install-set-up-deploy
ms.date: 02/22/2023
---

# Deploy air-gapped OT sensor management

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

- [Active Directory integration](../manage-users-on-premises-management-console.md#integrate-users-with-active-directory), to allow Active Directory users to sign into your on-premises management console, use Active Directory groups, and configure global access groups.

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
|**Secure connections**     | An on-premises management console SSL/TLS certificate is applied to create a secure connection between the primary and secondary appliances. Use a CA-signed certificate or the self-signed certificate generated during installation. For more information, see: <br>- [SSL/TLS certificate requirements for on-premises resources](../best-practices/certificate-requirements.md) <br>- [Create SSL/TLS certificates for OT appliances](create-ssl-certificates.md) <br>- [Manage SSL/TLS certificates](../how-to-manage-the-on-premises-management-console.md#manage-ssltls-certificates) |
|**Data backups**     |  The primary on-premises management console data is automatically backed up to the secondary on-premises management console every 10 minutes. <br><br>For more information, see [Backup and restore the on-premises management console](../back-up-restore-management.md).       |
|**System settings**     |  The system settings defined on the primary on-premises management console are duplicated on the secondary. For example, if the system settings are updated on the primary, they're also updated on the secondary.       |

For more information, see [About high availability](../how-to-set-up-high-availability.md).

## Next steps

> [!div class="step-by-step"]
> [Prepare an on-premises management console appliance »](prepare-management-appliance.md)
