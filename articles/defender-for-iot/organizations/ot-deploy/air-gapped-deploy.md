---
title: Hybrid or air-gapped deployment path for sensor management - Microsoft Defender for IoT
description: Learn about additional steps involved in deploying Microsoft Defender for IoT in a hybrid or air-gapped environment.
ms.topic: install-set-up-deploy
ms.date: 09/19/2023
---

# Deploy hybrid or air-gapped OT sensor management

Microsoft Defender for IoT helps organizations achieve and maintain compliance by providing a comprehensive solution for threat detection and management, including coverage across parallel networks. Defender for IoT supports organizations across the industrial, energy, and utility fields, and compliance organizations like NERC CIP or IEC62443.

Many organizations, especially in the fields of government, military, financial services, nuclear power, and industrial manufacturing, maintain air-gapped networks. Air-gapped networks are physically separated from other, unsecured networks like the internet. Defender for IoT helps these organizations comply with global standards for threat detection and management, network segmentation, and more.

While digital transformation has helped businesses to streamline their operations and improve their bottom lines, they often face friction with air-gapped networks. The isolation in air-gapped networks provides security but also complicates digital transformation. For example, measures like a zero-trust architecture and multi-factor authentication are challenging to apply across  for air-gapped networks.

Air-gapped networks are often used to store sensitive data or control cyber physical systems that are not connected to the internet, making them less vulnerable to cyberattacks. However, air-gapped networks are not completely secure and can still be breached. It's therefore imperative to monitor air-gapped networks to detect and respond to any potential threats.

This article describes the architecture of deploying hybrid and air-gapped security solutions, including the challenges and best practices for securing and monitoring hybrid and air-gapped networks. Instead of keeping all Defender for IoT's maintenance infrastructure contained in a closed architecture, we recommend that you integrate your Defender for IoT sensors into your existing IT infrastructure, including on-site or remote resources. This approach ensures that your security operations run smoothly, efficiently, and are easy to maintain.

## Architecture recommendations

The following image shows a sample, high level architecture of our recommendations for monitoring and maintaining Defender for IoT systems, where each OT sensor connects to multiple security management systems in the cloud or on-premises.

:::image type="content" source="../media/on-premises-architecture/on-premises-architecture.png" alt-text="Diagram of the new architecture for hybrid and air-gapped support.":::

In this sample architecture, three sensors connect to four routers in different logical zones across the organization. The sensors are located behind a firewall and integrate with local, on-premises IT infrastructure, such as local backup servers, remote access connections through SASE, and forwarding alerts to an on-premises security event and information management (SIEM) system.

The Defender for IoT architecture guidance for hybrid and air-gapped networks helps you to:

- **Use your existing organizational infrastructure** to monitor and manage your OT sensors, reducing the need for additional hardware or software
- **Use organizational security stack integrations** that are increasingly reliable and robust, whether you are on the cloud or on-premises
- **Collaborate with your global security teams** by auditing and controlling access to cloud and on-premises resources, ensuring consistent visibility and protection across your OT environments
- **Boost your OT security system** by adding cloud-based resources that enhance and empower your existing capabilities, such as threat intelligence, analytics, and automation

## Deployment steps

Use the following steps to deploy a Defender for IoT system in an air-gapped or hybrid environment:

1. Complete deploying each OT network sensor according to your plan, as described in [Deploy Defender for IoT for OT monitoring](ot-deploy-path.md).

1. For each sensor, configure the following settings:

    - [Proxy settings](../connect-sensors.md)
    - [Health monitoring via a SNMP MIB server](../how-to-set-up-snmp-mib-monitoring.md)
    - [A backup server](../back-up-restore-sensor.md), including configurations to [save your backup to an external server (SMB)](../back-up-restore-sensor.md#save-your-backup-to-an-external-server-smb).
    - Alert forwarding to a SIEM, either on-premises or a cloud SIEM like Microsoft Sentinel. For more information, see:

        - [Tutorial: Connect Microsoft Defender for IoT with Microsoft Sentinel](../iot-solution.md)
        - [Forward on-premises OT alert information](../how-to-forward-alert-information-to-partners.md)

####  Transitioning from a legacy on-premises management console

> [!IMPORTANT]
> The [legacy on-premises management console](../legacy-central-management/legacy-air-gapped-deploy.md) won't be supported or available for download after January 1st, 2025. Until then, we recommend transitioning to the new architecture using the full spectrum of on-premises and cloud APIs.
>

Our [current architecture guidance](#architecture-recommendations) is designed to be more efficient, secure, and reliable than using the legacy on-premises management console. The updated guidance has fewer components, which makes it easier to maintain and troubleshoot. The smart sensor technology used in the new architecture allows for on-premises processing, reducing the need for cloud resources and improving performance. The updated guidance keeps your data within your own network, providing better security than cloud computing.

Transitioning to the updated architecture guidance helps gain improved security, performance, and reliability. If you're an existing customer using an on-premises management console to manage your OT sensors, we recommend using the following steps to transition to the updated architecture guidance.

1. For each of your OT sensors, identify the legacy integrations in use and the permissions currently configured for on-premises security teams. For example, what backup systems are in place? Which user groups access the sensor data?

1. Connect your sensors to recommended on-premises, Azure, and other cloud resources, as needed for each site. For example, set up proxy servers, backup storage, and integrations to third-party systems. You may have multiple sites and adopt a hybrid approach, where as only specific sites are kept completely on-premises.

    For more information, see the information linked in the [air-gapped deployment procedure](#deployment-steps), as well as the following cloud resources:

    - [Provision sensors for cloud management](provision-cloud-management.md)
    - [OT threat monitoring in enterprise SOCs](../concept-sentinel-integration.md)
    - [Securing IoT devices in the enterprise](../concept-enterprise.md)

1. Set up permissions and update procedures for accessing your sensors to match the new deployment architecture.

1. Review and validate that all security use cases and procedures have transitioned to the new architecture.

1. After your transition is complete, decommission the on-premises management console.

## Next steps

> [!div class="step-by-step"]
> [Maintain OT network sensors from the sensor console](../how-to-manage-individual-sensors.md)
