---
title: Secure your IoT solutions
description: Learn how to secure IoT solutions, with best practices for cloud-connected and edge-connected solutions. Includes recommendations for assets, devices, data, and infrastructure.
author: dominicbetts
ms.service: azure-iot
services: iot
ms.topic: best-practice
ms.custom: horz-security
ms.date: 07/07/2026
ms.author: dobett
# Customer intent: As a solution builder, I want a high-level overview of the key concepts around securing a typical Azure IoT solution.
---

# Secure your IoT solutions

IoT solutions let you connect, monitor, and control your IoT devices and assets at scale. In a cloud-connected solution, devices and assets connect directly to the cloud. In an edge-connected solution, devices and assets connect to an edge runtime environment. You must secure your physical assets and devices, edge infrastructure, and cloud services to protect your IoT solution from threats. You must also secure the data that flows through your IoT solution, whether it's at the edge or in the cloud.

This article provides guidance on how to best secure your IoT solution. Each section includes links to content that provides further detail and guidance.

# [Edge-connected solution](#tab/edge)

The following diagram shows a high-level view of the components in a typical [edge-connected IoT solution](iot-introduction.md#edge-connected-pattern). This article focuses on the security of an edge-connected IoT solution:

<!-- Art Library Source# ConceptArt-0-000-032 -->
:::image type="content" source="media/iot-overview-security/iot-edge-security-architecture.svg" alt-text="Diagram that shows the high-level IoT edge-connected solution architecture highlighting security." border="false":::

In an edge-connected IoT solution, you can divide security into the following four areas:

- **Asset security**: Secure the IoT asset while it's deployed on premises.

- **Connection security**: Ensure all data in transit between the asset, edge, and cloud services is confidential and tamper-proof.

- **Edge security**: Secure your data as it moves through, and is stored at the edge.

- **Cloud security**: Secure your data as it moves through, and is stored in the cloud.

### Microsoft Defender for IoT and Microsoft Defender for Containers

Microsoft Defender for IoT is a unified security solution built specifically to identify IoT and operational technology (OT) devices, vulnerabilities, and threats. Microsoft Defender for Containers is a cloud-native solution that helps you improve, monitor, and maintain the security of your containerized assets (Kubernetes clusters, Kubernetes nodes, Kubernetes workloads, container registries, container images, and more) and their applications across multicloud and on-premises environments.

Both Defender for IoT and Defender for Containers can automatically monitor some of the recommendations included in this article. Defender for IoT and Defender for Containers should be your first line of defense to protect your edge-connected solution. To learn more, see:

- [Microsoft Defender for Containers - overview](/azure/defender-for-cloud/defender-for-containers-introduction)
- [Microsoft Defender for IoT for organizations - overview](/azure/defender-for-iot/organizations/overview).

### OT, IT, and cloud security boundaries

Azure IoT Operations lets organizations connect OT assets and industrial data sources to cloud-based management, analytics, and automation services.

Connecting OT environments to IT and cloud systems provides significant operational benefits, but it also changes traditional security boundaries. Data, identities, management operations, and workloads might span environments that historically operated in isolation.

When you design an Azure IoT Operations deployment, consider the following principles:

- Apply network segmentation between OT, IT, and cloud-connected environments. For a Purdue/ISA-95 segmented topology, use a [layered network](../iot-operations/manage-layered-network/overview-layered-network.md) deployment to restrict communication to adjacent layers.
- Use least-privilege access controls for users, applications, and management systems, and configure dedicated identities through [secure settings and managed identities](../iot-operations/secure-iot-ops/howto-enable-secure-settings.md).
- Treat cloud-connected operational data as informational unless validated by your operational safety processes. Data routed through the [operations experience and dashboards](../iot-operations/overview-iot-operations.md) is best suited to monitoring.
- Avoid using cloud dashboards, analytics, or monitoring views as the sole authority for safety-critical or emergency operational decisions.
- Follow applicable industry standards, regulatory requirements, and site-specific safety policies when connecting OT assets to cloud services.

Applying [Zero Trust](/azure/defender-for-iot/organizations/concept-zero-trust) security principles helps you secure these boundaries: verify explicitly, use least-privilege access, and assume breach. You remain responsible for determining which operational data and control paths are appropriate for cloud integration within your environment.

### Asset security

This section provides guidance on how to secure your assets, such as industrial equipment, sensors, and other devices that are part of your IoT solution. The security of the asset is crucial to ensure the integrity and confidentiality of the data it generates and transmits.

- **Use Azure Key Vault and the secret store extension**: Use [Azure Key Vault](/azure/key-vault/general/overview) to store and manage sensitive information for your assets, such as keys, passwords, certificates, and secrets. Azure IoT Operations uses Azure Key Vault as the managed vault solution in the cloud, and uses the [Azure Key Vault Secret Store extension for Kubernetes](/azure/azure-arc/kubernetes/secret-store-extension) to sync secrets from the cloud and store them at the edge as Kubernetes secrets. To learn more, see [Manage secrets for your Azure IoT Operations deployment](../iot-operations/secure-iot-ops/howto-manage-secrets.md).

- **Set up secure certificate management**: Managing certificates is crucial for ensuring secure communication between assets and your edge runtime environment. Azure IoT Operations provides tools for managing certificates, including issuing, renewing, and revoking certificates. To learn more, see [Manage certificates for your Azure IoT Operations deployment](../iot-operations/secure-iot-ops/howto-manage-certificates.md).

- **Select tamper-proof hardware**: Choose asset hardware with built-in mechanisms to detect physical tampering, such as the opening of the device cover or the removal of a part of the device. These tamper signals can be part of the data stream uploaded to the cloud, alerting operators to these events.

- **Enable secure updates for asset firmware**: Use services that enable over-the-air updates for your assets. Build assets with secure paths for updates and cryptographic assurance of firmware versions to secure your assets during and after updates.

- **Deploy asset hardware securely**: Ensure that asset hardware deployment is as tamper-proof as possible, especially in unsecure locations such as public spaces or unsupervised locales. Only enable necessary features to minimize the physical attack footprint, such as securely covering USB ports if they're not needed.

- **Follow device manufacturer security and deployment best practices**: If the device manufacturer provides security and deployment guidance, follow that guidance along with the general guidance in this article.

### Connection security

This section provides guidance on how to secure the connections between your assets, edge runtime environment, and cloud services. The security of the connections is crucial to ensure the integrity and confidentiality of the data transmitted.

- **Follow Azure IoT Operations production deployment guidelines for connections**: For production Azure IoT Operations deployments, [production deployment guidelines](../iot-operations/deploy-iot-ops/concept-production-guidelines.md) provide detailed configuration for [bringing your own CA issuer with enterprise PKI](../iot-operations/deploy-iot-ops/howto-bring-your-own-issuer.md#bring-your-own-issuer), [MQTT broker internal traffic encryption](../iot-operations/deployment-plan/deployment-planning-encryption.md), [automatic TLS certificate management for BrokerListener](../iot-operations/manage-mqtt-broker/howto-configure-brokerlistener.md), and [secure connections to OPC UA servers](../iot-operations/discover-manage-assets/howto-configure-opc-ua-certificates-infrastructure.md).

- **Use Transport Layer Security (TLS) to secure connections from assets**: All communication within Azure IoT Operations is encrypted by using TLS. To provide a secure-by-default experience that minimizes inadvertent exposure of your edge-connected solution to attackers, Azure IoT Operations is deployed with a default root CA and issuer for TLS server certificates. For a production deployment, use your own CA issuer and an enterprise PKI solution.

- **Isolate and segment networks**: Use network segmentation and firewalls to isolate IoT Operations clusters and edge devices from other network resources. Add required endpoints to your allow list if using enterprise firewalls or proxies. To learn more, see [Production deployment guidelines – Networking](../iot-operations/deploy-iot-ops/concept-production-guidelines.md#networking).

### Edge security

This section provides guidance on how to secure your edge runtime environment, which is the software that runs on your edge platform. This software processes your asset data and manages the communication between your assets and cloud services. The security of the edge runtime environment is crucial to ensure the integrity and confidentiality of the data processed and transmitted.

- **Follow Azure IoT Operations production deployment guidelines for the edge runtime**: For production Azure IoT Operations deployments, follow the [production deployment guidelines](../iot-operations/deploy-iot-ops/concept-production-guidelines.md), which cover [validating Microsoft-signed images](../iot-operations/secure-iot-ops/howto-validate-images.md), keeping the cluster patched, [controlling Arc autoupgrade](/azure/azure-arc/kubernetes/agent-upgrade#toggle-automatic-upgrade-on-or-off-when-connecting-a-cluster-to-azure-arc), [MQTT broker authentication](../iot-operations/manage-mqtt-broker/howto-configure-authentication.md), and [least-privilege topic authorization](../iot-operations/manage-mqtt-broker/howto-configure-authorization.md).

### Cloud security

This section provides guidance on how to secure your cloud services, which are the services that process and store your asset data. The security of the cloud services is crucial to ensure the integrity and confidentiality of your data.

- **Follow Azure IoT Operations production deployment guidelines for cloud connections**: For production Azure IoT Operations deployments, [production deployment guidelines](../iot-operations/deploy-iot-ops/concept-production-guidelines.md) cover [user-assigned managed identities for data flow endpoints and cloud connections](../iot-operations/secure-iot-ops/howto-enable-secure-settings.md#set-up-a-user-assigned-managed-identity-for-cloud-connections) and [deploying observability resources](../iot-operations/deploy-iot-ops/howto-configure-observability.md) before deployment.

- **Secure access to assets and asset endpoints with Azure RBAC**: Assets and asset endpoints in Azure IoT Operations have representations in both the Kubernetes cluster and the Azure portal. Use Azure RBAC to secure access to these resources. Azure RBAC is an authorization system that enables you to manage access to Azure resources. Use Azure RBAC to grant permissions to users, groups, and applications at a certain scope. To learn more, see [Custom RBAC roles for your Azure IoT Operations resources](../iot-operations/reference/custom-rbac.md).

# [Cloud-connected solution](#tab/cloud)

The following diagram shows a high-level view of the components in a typical [cloud-connected IoT solution](iot-introduction.md#cloud-connected-pattern). This article focuses on the security of a cloud-connected IoT solution:

<!-- Art Library Source# ConceptArt-0-000-032 -->
:::image type="content" source="media/iot-overview-security/iot-cloud-security-architecture.svg" alt-text="Diagram that shows the high-level IoT cloud-connected solution architecture highlighting security." border="false":::

In a cloud-connected IoT solution, you can divide security into the following three areas:

- **Device security**: Secure the IoT device while it's deployed on premises.

- **Connection security**: Ensure all data transmitted between the IoT device and the IoT cloud services is confidential and tamper-proof.

- **Cloud security**: Secure your data as it moves through, and is stored in the cloud.

The recommendations in this article help you meet the security obligations described in the [shared responsibility model](../security/fundamentals/shared-responsibility.md).

### Microsoft Defender for IoT

Microsoft Defender for IoT automatically monitors some of the recommendations in this article. Microsoft Defender for IoT periodically analyzes the security state of your Azure resources to identify potential security vulnerabilities and then offers recommendations on how to address them. To learn more, see:

- [What is Microsoft Defender for IoT for organizations?](/azure/defender-for-iot/organizations/overview)
- [What is Microsoft Defender for IoT for device builders?](/azure/defender-for-iot/device-builders/overview)
- [Enhance security posture with security recommendations](/azure/defender-for-iot/organizations/recommendations)

### Device security

This section provides guidance on how to secure your IoT devices, which are the hardware components that collect and transmit data. The security of the device is crucial to ensure the integrity and confidentiality of the data it generates and transmits.

- **Scope hardware to minimum requirements**: Select your device hardware to include the minimum features required for its operation, and nothing more. For example, only include USB ports if they're necessary for the operation of the device in your solution. Extra features can expose the device to unwanted attack vectors.

- **Select tamper-proof hardware**: Select device hardware with built-in mechanisms to detect physical tampering, such as the opening of the device cover or the removal of a part of the device. These tamper signals can be part of the data stream uploaded to the cloud, which can alert operators to these events.

- **Select secure hardware**: If possible, choose device hardware that includes security features such as secure and encrypted storage and boot functionality based on a [Trusted Platform Module](../iot-dps/concepts-tpm-attestation.md). These features make devices more secure and help protect the overall IoT infrastructure.

- **Enable secure updates**: Use services like [Device Update for IoT Hub](../iot-hub-device-update/understand-device-update.md) for over-the-air updates for your IoT devices. Build devices with secure paths for updates and cryptographic assurance of firmware versions to secure your devices during and after updates.

- **Follow a secure software development methodology**: The development of secure software requires you to consider security from the inception of the project all the way through implementation, testing, and deployment. The [Microsoft Security Development Lifecycle](https://www.microsoft.com/securityengineering/sdl/) provides a step-by-step approach to building secure software.

- **Use device SDKs whenever possible**: Device SDKs implement various security features such as encryption and authentication that help you develop robust and secure device applications. To learn more, see [Azure IoT SDKs](../iot-hub/iot-sdks.md).

- **Choose open-source software with care**: Open-source software provides an opportunity to quickly develop solutions. When you choose open-source software, consider the activity level of the community for each open-source component. An active community ensures that software is supported and that issues are discovered and addressed. An obscure and inactive open-source software project might not be supported, and issues aren't likely to be discovered.

- **Deploy hardware securely**: IoT deployments might require you to deploy hardware in unsecured locations, such as in public spaces or unsupervised locales. In these situations, make hardware deployment as tamper-proof as possible, and enable only the necessary features to minimize the physical attack footprint.

- **Store credentials in hardware security modules (HSMs)**: Use HSMs to securely store device secrets, such as private keys and certificates, to protect against extraction and tampering. To learn more, see [IoT Hub X.509 authentication](../iot-hub/authenticate-authorize-x509.md), [DPS HSM guidance](../iot-dps/concepts-service.md#hardware-security-module), and [IoT Edge security manager](../iot-edge/iot-edge-security-manager.md).

- **Rotate device keys and certificates regularly**: Regularly rotate credentials, especially after a breach or expiration, to minimize the risk of unauthorized access. To learn more, see [How to roll certificates in DPS](../iot-dps/how-to-roll-certificates.md), and [IoT Central X.509 certificate management](../iot-central/core/how-to-connect-devices-x509.md#roll-your-x509-device-certificates).

- **Update and patch**: Keep all runtimes, SDKs, and OS components up to date with the latest security patches and updates. To learn more, see [IoT Edge update guidance](../iot-edge/how-to-update-iot-edge.md).

- **Protect against malicious activity**: If the operating system permits, install the latest antivirus and anti-malware capabilities on each device operating system.

- **Audit frequently**: Audit IoT infrastructure for security issues to enable you to respond to security incidents. Most operating systems provide built-in event logging. Review logs frequently to check for security breaches. A device can send audit information as a separate data stream to the cloud service, where you can analyze it.

- **Follow device manufacturer security and deployment best practices**: If the device manufacturer provides security and deployment guidance, follow that guidance along with the general guidance in this article.

- **Use a field gateway to provide security services for legacy or constrained devices**: Legacy and constrained devices might lack the capability to encrypt data, connect to the internet, or provide advanced auditing. In these cases, a modern and secure field gateway can aggregate data from legacy devices and provide the security needed to connect these devices over the internet. An [IoT Edge device can be used as a gateway](../iot-edge/iot-edge-as-gateway.md) and provide secure authentication, negotiation of encrypted sessions, receipt of commands from the cloud, and many other security features. [Azure Sphere](/azure-sphere/product-overview/what-is-azure-sphere?view=azure-sphere-integrated&preserve-view=true) can act as a guardian module to secure other devices, including existing legacy systems not designed for trusted connectivity.

- **Encrypt data at rest**: Use OS-level encryption, such as BitLocker for Windows, for device and edge storage to protect data if devices are lost or stolen. To learn more, see [IoT Edge security](../iot-edge/security.md).

### Connection security

This section provides guidance on how to secure the connections between your IoT devices and cloud services. The security of the connections is crucial to ensure the integrity and confidentiality of the data transmitted.

- **Use X.509 certificates to authenticate your devices to IoT Hub or IoT Central**: IoT Hub and IoT Central support X.509 certificates for device authentication. Use X.509-based authentication in production environments because it provides greater security than symmetric keys. To learn more, see [Authenticating a device to IoT Hub](../iot-hub/authenticate-authorize-x509.md) and [Device authentication concepts in IoT Central](../iot-central/core/concepts-device-authentication.md).

- **Avoid shared symmetric keys**: If you use symmetric keys, don't share symmetric keys across devices. Each device needs unique credentials to prevent widespread compromise if a key is leaked. To learn more, see [Security practices for device manufacturers](../iot-dps/concepts-device-oem-security-practices.md#shared-symmetric-key).

- **Use Transport Layer Security (TLS) 1.2 to secure connections from devices**: IoT Hub and IoT Central use TLS to secure connections from IoT devices and services. IoT Hub supports TLS 1.0, 1.1, and 1.2. TLS 1.0 and 1.1 are legacy and should be avoided. To learn more, see [Transport Layer Security (TLS) support in IoT Hub](../iot-hub/iot-hub-tls-support.md) and [TLS support in Azure IoT Hub Device Provisioning Service (DPS)](../iot-dps/tls-support.md).

- **Use strong cipher suites and keep root CA certificates up to date**: Update cipher suites and trusted root certificates regularly to maintain secure connections. To learn more, see [IoT Hub TLS support](../iot-hub/iot-hub-tls-support.md#cipher-suites).

- **Ensure you have a way to update the TLS root certificate on your devices**: TLS root certificates last a long time, but they can expire or be revoked. If you can't update the certificate on the device, the device might not be able to connect to IoT Hub, IoT Central, or any other cloud service at a later date. To learn more, see [How to roll X.509 device certificates](../iot-dps/how-to-roll-certificates.md).

- **Consider using Azure Private Link**: Azure Private Link lets you connect your devices to a private endpoint on your virtual network, so you can block access to your IoT hub's public device-facing endpoints. To learn more, see [Ingress connectivity to IoT Hub using Azure Private Link](../iot-hub/virtual-network-support.md#ingress-connectivity-to-iot-hub-using-azure-private-link) and [Network security for IoT Central using private endpoints](../iot-central/core/concepts-private-endpoints.md).

- **Restrict network access**: Use IP filtering to limit access to trusted sources and networks. To learn more, see [IoT Hub IP filtering](../iot-hub/iot-hub-ip-filtering.md), [IoT Central private endpoints](../iot-central/core/concepts-private-endpoints.md), and [DPS IP filtering](../iot-dps/iot-dps-ip-filtering.md).

- **Disable public network access if not required**: Prevent exposure to the public internet by disabling public endpoints when you can. To learn more, see [IoT Hub public network access](../iot-hub/iot-hub-public-network-access.md) and [DPS public network access](../iot-dps/public-network-access.md).

- **Isolate edge devices and services in secure network segments**: Use network segmentation and firewalls to isolate IoT Edge devices and services from other network resources. To learn more, see [IoT Edge for Linux on Windows security](../iot-edge/iot-edge-for-linux-on-windows-security.md).

### Cloud security

This section provides guidance on how to secure your cloud services, which are the services that process and store your IoT device data. The security of the cloud services is crucial to ensure the integrity and confidentiality of your data.

- **Follow a secure software development methodology**: The development of secure software requires you to consider security from the inception of the project all the way through implementation, testing, and deployment. The [Microsoft Security Development Lifecycle](https://www.microsoft.com/securityengineering/sdl/) provides a step-by-step approach to building secure software.

- **Choose open-source software with care**: Open-source software provides an opportunity to quickly develop solutions. When you're choosing open-source software, consider the activity level of the community for each open-source component. An active community ensures that software is supported and that issues are discovered and addressed. An obscure and inactive open-source software project might not be supported, and issues aren't likely to be discovered.

- **Integrate with care**: Many software security flaws exist at the boundary of libraries and APIs. Functionality that isn't required for the current deployment might still be available through an API layer. To ensure overall security, check all interfaces of integrated components for security flaws.

- **Protect cloud credentials**: Attackers can use the cloud authentication credentials you use to configure and operate your IoT deployment to gain access to and compromise your IoT system. Protect the credentials by changing the password often, and don't use these credentials on shared or unmanaged machines.

- **Use Microsoft Entra ID and RBAC with IoT Hub**: Use Microsoft Entra ID and Azure RBAC for service and management API access to enable granular, identity-based access control. To learn more, see [IoT Hub Entra ID authentication](../iot-hub/authenticate-authorize-azure-ad.md) and [DPS Entra ID authentication](../iot-dps/concepts-control-access-dps-azure-ad.md).

- **Disable shared access policies if not needed**: Reduce attack surface by disabling shared access policies and tokens when you don't need them. To learn more, see [IoT Hub shared access policies](../iot-hub/authenticate-authorize-azure-ad.md#enforce-microsoft-entra-authentication).

- **Define access controls for your IoT Central application**: Understand and define the type of access that you enable for your IoT Central application. To learn more, see:

  - [Manage users and roles in your IoT Central application](../iot-central/core/howto-manage-users-roles.md)
  - [Manage IoT Central organizations](../iot-central/core/howto-create-organizations.md)
  - [Use audit logs to track activity in your IoT Central application](../iot-central/core/howto-use-audit-logs.md)
  - [How to authenticate and authorize IoT Central REST API calls](../iot-central/core/howto-authorize-rest-api.md)

- **Define access controls for backend services**: Other Azure services can consume the data your IoT hub or IoT Central application ingests from your devices. You can route messages from your devices to other Azure services. Understand and configure appropriate access permissions for IoT Hub or IoT Central to connect to these services. To learn more, see:

  - [Read device-to-cloud messages from the IoT Hub built-in endpoint](../iot-hub/iot-hub-devguide-messages-read-builtin.md)
  - [Use IoT Hub message routing to send device-to-cloud messages to different endpoints](../iot-hub/iot-hub-devguide-messages-d2c.md)
  - [Export IoT Central data](../iot-central/core/howto-export-to-blob-storage.md)
  - [Export IoT Central data to a secure destination on an Azure Virtual Network](../iot-central/core/howto-connect-secure-vnet.md)

- **Grant only the minimum permissions required**: Apply the principle of least privilege when you assign roles and permissions to users, apps, and devices. To learn more, see [Identity management best practices](../security/fundamentals/identity-management-best-practices.md).

- **Monitor your IoT solution from the cloud**: Monitor the overall health of your IoT solution using [IoT Hub metrics in Azure Monitor](../iot-hub/monitor-iot-hub.md) or [Monitor IoT Central application health](../iot-central/core/howto-manage-and-monitor-iot-central.md#monitor-application-health).

- **Set up diagnostics**: Monitor your operations by logging events in your solution, and then send the diagnostic logs to Azure Monitor. To learn more, see [Monitor and diagnose problems in your IoT hub](../iot-hub/monitor-iot-hub.md).

---

## Related content

- [IoT Hub security](../iot-hub/iot-hub-devguide-security.md)
- [IoT Central security guide](../iot-central/core/overview-iot-central-security.md)
- [DPS security practices](../iot-dps/concepts-device-oem-security-practices.md)
- [IoT Edge security framework](../iot-edge/security.md)
- [Azure security baseline for Azure IoT Hub](/security/benchmark/azure/baselines/iot-hub-security-baseline?toc=/azure/iot-hub/TOC.json)
- [Well-Architected Framework perspective on Azure IoT Hub](/azure/well-architected/service-guides/iot-hub)
- [Azure security baseline for Azure Arc enabled Kubernetes](/security/benchmark/azure/baselines/azure-arc-enabled-kubernetes-security-baseline?toc=/azure/azure-arc/kubernetes/toc.json)
- [Concepts for keeping your cloud-native workload secure](https://kubernetes.io/docs/concepts/security/)
