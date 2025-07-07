---
title: Secure your IoT solutions
description: Learn how to secure IoT solutions, with best practices for cloud-based and edge-based solutions. Includes recommendations for assets, devices, data, and infrastructure
author: dominicbetts
ms.service: azure-iot
services: iot
ms.topic: conceptual
ms.custom: horz-security
ms.date: 06/13/2025
ms.author: dobett
# Customer intent: As a solution builder, I want a high-level overview of the the key concepts around securing a typical Azure IoT solution.
---

# Secure your IoT solutions

IoT solutions let you connect, monitor, and control your IoT devices and assets at scale. In a cloud-based solution, devices and assets connect directly to the cloud. In an edge-based solution, devices and assets connect to an edge runtime environment. You must secure your physical assets and devices, edge infrastructure, and cloud services to protect your IoT solution from threats. You must also secure the data that flows through your IoT solution, whether it's at the edge or in the cloud.

This article provides guidance on how to best secure your IoT solution. Each section includes links to content that provides further detail and guidance.

# [Edge-based solution](#tab/edge)

The following diagram shows a high-level view of the components in a typical [edge-based IoT solution](iot-introduction.md#edge-based-solution). This article focuses on the security of an edge-based IoT solution:

<!-- Art Library Source# ConceptArt-0-000-032 -->
:::image type="content" source="media/iot-overview-security/iot-edge-security-architecture.svg" alt-text="Diagram that shows the high-level IoT edge-based solution architecture highlighting security." border="false":::

In an edge-based IoT solution, you can divide security into the following four areas:

- **Asset security**: Secure the IoT asset while it's deployed on premises.

- **Connection security**: Ensure all data in transit between the asset, edge, and cloud services is confidential and tamper-proof.

- **Edge security**: Secure your data as it moves through, and is stored at the edge.

- **Cloud security**: Secure your data as it moves through, and is stored in the cloud.

### Microsoft Defender for IoT and for Containers

Microsoft Defender for IoT is a unified security solution built specifically to identify IoT and operational technology (OT) devices, vulnerabilities, and threats. Microsoft Defender for Containers is a cloud-native solution to improve, monitor, and maintain the security of your containerized assets (Kubernetes clusters, Kubernetes nodes, Kubernetes workloads, container registries, container images and more), and their applications, across multicloud and on-premises environments.

Both Defender for IoT and Defender for Containers can automatically monitor some of the recommendations included in this article. Defender for IoT and Defender for Containers should be the frontline of defense to protect your edge-based solution. To learn more, see:

- [Microsoft Defender for Containers - overview](/azure/defender-for-cloud/defender-for-containers-introduction)
- [Microsoft Defender for IoT for organizations - overview](../defender-for-iot/organizations/overview.md).

### Asset security

This section provides guidance on how to secure your assets, such as industrial equipment, sensors, and other devices that are part of your IoT solution. The security of the asset is crucial to ensure the integrity and confidentiality of the data it generates and transmits.

- **Use Azure Key Vault and the secret store extension**: Use [Azure Key Vault](/azure/key-vault/general/overview) to store and manage asset's sensitive information such as keys, passwords, certificates, and secrets. Azure IoT Operations uses Azure Key Vault as the managed vault solution on the cloud, and uses [Azure Key Vault Secret Store extension for Kubernetes](/azure/azure-arc/kubernetes/secret-store-extension) to sync the secrets down from the cloud and store them on the edge as Kubernetes secrets. To learn more, see [Manage secrets for your Azure IoT Operations deployment](../iot-operations/secure-iot-ops/howto-manage-secrets.md).

- **Set up secure certificate management**: Managing certificates is crucial for ensuring secure communication between assets and your edge runtime environment. Azure IoT Operations provides tools for managing certificates, including issuing, renewing, and revoking certificates. To learn more, see [Certificate management for Azure IoT Operations internal communication](../iot-operations/secure-iot-ops/concept-default-root-ca.md).

- **Select tamper-proof hardware**: Choose asset hardware with built-in mechanisms to detect physical tampering, such as the opening of the device cover or the removal of a part of the device. These tamper signals can be part of the data stream uploaded to the cloud, alerting operators to these events.

- **Enable secure updates for asset firmware**: Use services that enable over-the-air updates for your assets. Build assets with secure paths for updates and cryptographic assurance of firmware versions to secure your assets during and after updates.

- **Deploy asset hardware securely**: Ensure that asset hardware deployment is as tamper-proof as possible, especially in unsecure locations such as public spaces or unsupervised locales. Only enable necessary features to minimize the physical attack footprint, such as securely covering USB ports if they're not needed.

- **Follow device manufacturer security and deployment best practices**: If the device manufacturer provides security and deployment guidance, follow that guidance along with the general guidance in this article.

### Connection security

This section provides guidance on how to secure the connections between your assets, edge runtime environment, and cloud services. The security of the connections is crucial to ensure the integrity and confidentiality of the data transmitted.

- **Use Transport Layer Security (TLS) to secure connections from assets**: All communication within Azure IoT Operations is encrypted using TLS. To provide a secure-by-default experience that minimizes inadvertent exposure of your edge-based solution to attackers, Azure IoT Operations is deployed with a default root CA and issuer for TLS server certificates. For a production deployment, we recommend using your own CA issuer and an enterprise PKI solution.

- **Bring your own CA for production**: For production deployments, replace the default self-signed root CA with your own CA issuer and integrate with an enterprise PKI to ensure trust and compliance. To learn more, see [Certificate management for Azure IoT Operations internal communication](../iot-operations/secure-iot-ops/concept-default-root-ca.md#bring-your-own-issuer).

- **Consider using enterprise firewalls or proxies to manage outbound traffic**: If you use enterprise firewalls or proxies, add the  [Azure IoT Operations endpoints](../iot-operations/deploy-iot-ops/overview-deploy.md#azure-iot-operations-endpoints) to your allowlist.

- **Encrypt internal traffic of message broker**: Ensuring the security of internal communications within your edge infrastructure is important to maintain data integrity and confidentiality. You should configure the MQTT broker to encrypt internal traffic and data in transit between the MQTT broker frontend and backend pods. To learn more, see [Configure encryption of broker internal traffic and internal certificates](../iot-operations/manage-mqtt-broker/howto-encrypt-internal-traffic.md).

- **Configure TLS with automatic certificate management for listeners in your MQTT broker**: Azure IoT Operations provides automatic certificate management for listeners in your MQTT broker. This capability reduces the administrative overhead of manually managing certificates, ensures timely renewals, and helps maintain compliance with security policies. To learn more, see [Secure MQTT broker communication by using BrokerListener](../iot-operations/manage-mqtt-broker/howto-configure-brokerlistener.md).

- **Set up a secure connection to OPC UA server**: When connecting to an OPC UA server, you should determine which OPC UA servers you trust to securely establish a session with. To learn more, see [Configure OPC UA certificates infrastructure for the connector for OPC UA](../iot-operations/discover-manage-assets/howto-configure-opcua-certificates-infrastructure.md).

- **Isolate and segment networks**: Use network segmentation and firewalls to isolate IoT Operations clusters and edge devices from other network resources. Add required endpoints to your allowlist if using enterprise firewalls or proxies. To learn more, see [Production deployment guidelines – Networking](../iot-operations/deploy-iot-ops/concept-production-guidelines.md#networking).

### Edge security

This section provides guidance on how to secure your edge runtime environment, which is the software that runs on your edge platform. This software processes your asset data and manages the communication between your assets and cloud services. The security of the edge runtime environment is crucial to ensure the integrity and confidentiality of the data processed and transmitted.

- **Keep the edge runtime environment up-to-date**: Keep your cluster and Azure IoT Operations deployment up-to-date with the latest patches and minor releases to get all available security and bug fixes. For production deployments, [turn off autoupgrade for Azure Arc](/azure/azure-arc/kubernetes/agent-upgrade#toggle-automatic-upgrade-on-or-off-when-connecting-a-cluster-to-azure-arc) to have complete control over when new updates are applied to your cluster. Instead, [manually upgrade agents](/azure/azure-arc/kubernetes/agent-upgrade#manually-upgrade-agents) as needed.

- **Verify the integrity of container and helm images**: Before deploying any image to your cluster, verify that the image is signed by Microsoft. To learn more, see [Validate image signing](../iot-operations/secure-iot-ops/howto-validate-images.md).

- **Always use X.509 certificates or Kubernetes service account tokens for authentication with your MQTT broker**: An MQTT broker supports multiple authentication methods for clients. You can configure each listener port to have its own authentication settings with a BrokerAuthentication resource. To learn more, see [Configure MQTT broker authentication](../iot-operations/manage-mqtt-broker/howto-configure-authentication.md).

- **Provide the least privilege needed for the topic asset in your MQTT broker**: Authorization policies determine what actions the clients can perform on the broker, such as connecting, publishing, or subscribing to topics. Configure the MQTT broker to use one or multiple authorization policies with the BrokerAuthorization resource. To learn more, see [Configure MQTT broker authorization](../iot-operations/manage-mqtt-broker/howto-configure-authorization.md).

### Cloud security

This section provides guidance on how to secure your cloud services, which are the services that process and store your asset data. The security of the cloud services is crucial to ensure the integrity and confidentiality of your data.

- **Use user-assigned managed identities for cloud connections**: Always use managed identity authentication. When possible, [use user-assigned managed identity](../iot-operations/connect-to-cloud/howto-configure-mqtt-endpoint.md#user-assigned-managed-identity) in data flow endpoints for flexibility and auditability. To learn more, see [Enable secure settings in Azure IoT Operations](../iot-operations/deploy-iot-ops/howto-enable-secure-settings.md#set-up-a-user-assigned-managed-identity-for-cloud-connections).

- **Deploy observability resources and set up logs**: Observability provides visibility into every layer of your Azure IoT Operations configuration. It gives you insight into the actual behavior of issues, which increases the effectiveness of site reliability engineering. Azure IoT Operations offers observability through custom curated Grafana dashboards that are hosted in Azure. These dashboards are powered by Azure Monitor managed service for Prometheus and by Container Insights. [Deploy observability resources](../iot-operations/configure-observability-monitoring/howto-configure-observability.md) on your cluster before deploying Azure IoT Operations.

- **Secure access to assets and asset endpoints with Azure RBAC**: Assets and asset endpoints in Azure IoT Operations have representations in both the Kubernetes cluster and the Azure portal. Use Azure RBAC to secure access to these resources. Azure RBAC is an authorization system that enables you to manage access to Azure resources. Use Azure RBAC to grant permissions to users, groups, and applications at a certain scope. To learn more, see [Secure access to assets and asset endpoints](../iot-operations/discover-manage-assets/howto-secure-assets.md).

# [Cloud-based solution](#tab/cloud)

The following diagram shows a high-level view of the components in a typical [cloud-based IoT solution](iot-introduction.md#cloud-based-solution). This article focuses on security in a cloud-based IoT solution:

<!-- Art Library Source# ConceptArt-0-000-032 -->
:::image type="content" source="media/iot-overview-security/iot-cloud-security-architecture.svg" alt-text="Diagram that shows the high-level IoT cloud-based solution architecture highlighting security." border="false":::

In a cloud--based IoT solution, you can divide security into the following three areas:

- **Device security**: Secure the IoT device while it's deployed on premises.

- **Connection security**: Ensure all data transmitted between the IoT device and the IoT cloud services is confidential and tamper-proof.

- **Cloud security**: Secure your data as it moves through, and is stored in the cloud.

The recommendations in this article help you meet the security obligations described in the [shared responsibility model](../security/fundamentals/shared-responsibility.md).

### Microsoft Defender for IoT

Microsoft Defender for IoT automatically monitors some of the recommendations in this article. Microsoft Defender for IoT periodically analyzes the security state of your Azure resources to identify potential security vulnerabilities and then offers recommendations on how to address them. To learn more, see:

- [What is Microsoft Defender for IoT for organizations?](../defender-for-iot/organizations/overview.md).
- [What is Microsoft Defender for IoT for device builders?](../defender-for-iot/device-builders/overview.md).
- [Enhance security posture with security recommendations](../defender-for-iot/organizations/recommendations.md).

### Device security

This section provides guidance on how to secure your IoT devices, which are the hardware components that collect and transmit data. The security of the device is crucial to ensure the integrity and confidentiality of the data it generates and transmits.

- **Scope hardware to minimum requirements**: Select your device hardware to include the minimum features required for its operation, and nothing more. For example, only include USB ports if they're necessary for the operation of the device in your solution. Extra features can expose the device to unwanted attack vectors.

- **Select tamper-proof hardware**: Select device hardware with built-in mechanisms to detect physical tampering, such as the opening of the device cover or the removal of a part of the device. These tamper signals can be part of the data stream uploaded to the cloud, which can alert operators to these events.

- **Select secure hardware**: If possible, choose device hardware that includes security features such as secure and encrypted storage and boot functionality based on a [Trusted Platform Module](../iot-dps/concepts-tpm-attestation.md). These features make devices more secure and help protect the overall IoT infrastructure.

- **Enable secure updates**: Use services like [Device Update for IoT Hub](../iot-hub-device-update/understand-device-update.md) for over the air updates for your IoT devices. Build devices with secure paths for updates and cryptographic assurance of firmware versions to secure your devices during and after updates.

- **Follow a secure software development methodology**: The development of secure software requires you to consider security from the inception of the project all the way through implementation, testing, and deployment. The [Microsoft Security Development Lifecycle](https://www.microsoft.com/securityengineering/sdl/) provides a step-by-step approach to building secure software.

- **Use device SDKs whenever possible**: Device SDKs implement various security features such as encryption and authentication that help you develop robust and secure device applications. To learn more, see [Azure IoT SDKs](iot-sdks.md).

- **Choose open-source software with care**: Open-source software provides an opportunity to quickly develop solutions. When you choose open-source software, consider the activity level of the community for each open-source component. An active community ensures that software is supported and that issues are discovered and addressed. An obscure and inactive open-source software project might not be supported, and issues aren't likely be discovered.

- **Deploy hardware securely**: IoT deployments might require you to deploy hardware in unsecured locations, such as in public spaces or unsupervised locales. In these situations, make hardware deployment as tamper proof as possible, and enable only the necessary features to minimize the physical attack footprint.

- **Store credentials in hardware security modules (HSMs)**: Use HSMs to securely store device secrets, such as private keys and certificates, to protect against extraction and tampering. To learn more, see [IoT Hub X.509 authentication](../iot-hub/authenticate-authorize-x509.md#authenticate-identities-with-x509-certificates), [DPS HSM guidance](../iot-dps/concepts-service.md#hardware-security-module), and [IoT Edge security manager](../iot-edge/iot-edge-security-manager.md).

- **Rotate device keys and certificates regularly**: Regularly rotate credentials, especially after a breach or expiration, to minimize the risk of unauthorized access. To learn more, see [How to roll certificates in DPS](../iot-dps/how-to-roll-certificates.md), and [IoT Central X.509 certificate management](../iot-central/core/how-to-connect-devices-x509.md#roll-your-x509-device-certificates).

- **Update and patch**: Keep all runtimes, SDKs, and OS components up to date with the latest security patches and updates. To learn more, see [IoT Edge update guidance](../iot-edge/how-to-update-iot-edge.md).

- **Protect against malicious activity**: If the operating system permits, install the latest antivirus and anti-malware capabilities on each device operating system.

- **Audit frequently**: Audit IoT infrastructure for security issues to enable you to respond to security incidents. Most operating systems provide built-in event logging. Review logs frequently to check for security breaches. A device can send audit information as a separate data stream to the cloud service, where you can analyze it.

- **Follow device manufacturer security and deployment best practices**: If the device manufacturer provides security and deployment guidance, follow that guidance along with the general guidance in this article.

- **Use a field gateway to provide security services for legacy or constrained devices**: Legacy and constrained devices might lack the capability to encrypt data, connect with the Internet, or provide advanced auditing. In these cases, a modern and secure field gateway can aggregate data from legacy devices and provide the security needed to connect these devices over the internet. An [IoT Edge device can be used as a gateway](../iot-edge/iot-edge-as-gateway.md) and provide secure authentication, negotiation of encrypted sessions, receipt of commands from the cloud, and many other security features. [Azure Sphere](/azure-sphere/product-overview/what-is-azure-sphere?view=azure-sphere-integrated&preserve-view=true) can act as a guardian module to secure other devices, including existing legacy systems not designed for trusted connectivity.

- **Encrypt data at rest**: Use OS-level encryption, such as BitLocker for Windows, for device and edge storage to protect data if devices are lost or stolen. To learn more, see [IoT Edge security](../iot-edge/security.md).

### Connection security

This section provides guidance on how to secure the connections between your IoT devices and cloud services. The security of the connections is crucial to ensure the integrity and confidentiality of the data transmitted.

- **Use X.509 certificates to authenticate your devices to IoT Hub or IoT Central**: IoT Hub and IoT Central support X509 certificates for device authentication. Use X509-based authentication in production environments as it provides greater security than symmetric keys. To learn more, see [Authenticating a device to IoT Hub](../iot-hub/authenticate-authorize-x509.md) and [Device authentication concepts in IoT Central](../iot-central/core/concepts-device-authentication.md).

- **Avoid shared symmetric keys**: If you use symmetric keys, don't share symmetric keys across devices. Each device needs unique credentials to prevent widespread compromise if a key is leaked. To learn more, see [Security practices for device manufacturers](../iot-dps/concepts-device-oem-security-practices.md#shared-symmetric-key).

- **Use Transport Layer Security (TLS) 1.2 to secure connections from devices**: IoT Hub and IoT Central use TLS to secure connections from IoT devices and services. Three versions of the TLS protocol are currently supported: 1.0, 1.1, and 1.2. TLS 1.0 and 1.1 are considered legacy. To learn more, see [Transport Layer Security (TLS) support in IoT Hub](../iot-hub/iot-hub-tls-support.md) and [TLS support in Azure IoT Hub Device Provisioning Service (DPS)](../iot-dps/tls-support.md).

- **Use strong cipher suites and keep root CA certificates up to date**: Update cipher suites and trusted root certificates regularly to maintain secure connections. To learn more, see [IoT Hub TLS support](../iot-hub/iot-hub-tls-support.md#cipher-suites).

- **Ensure you have a way to update the TLS root certificate on your devices**: TLS root certificates last a long time, but they can expire or be revoked. If you can't update the certificate on the device, the device might not be able to connect to IoT Hub, IoT Central, or any other cloud service at a later date. To learn more, see [How to roll X.509 device certificates](../iot-dps/how-to-roll-certificates.md).

- **Consider using Azure Private Link**: Azure Private Link lets you connect your devices to a private endpoint on your virtual network, enabling you to block access to your IoT hub's public device-facing endpoints. To learn more, see [Ingress connectivity to IoT Hub using Azure Private Link](../iot-hub/virtual-network-support.md#ingress-connectivity-to-iot-hub-using-azure-private-link) and [Network security for IoT Central using private endpoints](../iot-central/core/concepts-private-endpoints.md).

- **Restrict network access**: Use IP filtering to limit access to trusted sources and networks. To learn more, see [IoT Hub IP filtering](../iot-hub/iot-hub-ip-filtering.md), [IoT Central private endpoints](../iot-central/core/concepts-private-endpoints.md), and [DPS IP filtering](../iot-dps/iot-dps-ip-filtering.md).

- **Disable public network access if not required**: Prevent exposure to the public internet by disabling public endpoints when you can. To learn more, see [IoT Hub public network access](../iot-hub/iot-hub-public-network-access.md) and [DPS public network access](../iot-dps/public-network-access.md).

- **Isolate edge devices and services in secure network segments**: Use network segmentation and firewalls to isolate IoT Edge devices and services from other network resources. To learn more, see [IoT Edge for Linux on Windows security](../iot-edge/iot-edge-for-linux-on-windows-security.md).

### Cloud security

This section provides guidance on how to secure your cloud services, which are the services that process and store your IoT device data. The security of the cloud services is crucial to ensure the integrity and confidentiality of your data.

- **Follow a secure software development methodology**: The development of secure software requires you to consider security from the inception of the project all the way through implementation, testing, and deployment. The [Microsoft Security Development Lifecycle](https://www.microsoft.com/securityengineering/sdl/) provides a step-by-step approach to building secure software.

- **Choose open-source software with care**: Open-source software provides an opportunity to quickly develop solutions. When you're choosing open-source software, consider the activity level of the community for each open-source component. An active community ensures that software is supported and that issues are discovered and addressed. An obscure and inactive open-source software project might not be supported and issues aren't likely be discovered.

- **Integrate with care**: Many software security flaws exist at the boundary of libraries and APIs. Functionality that isn't required for the current deployment might still be available through an API layer. To ensure overall security, check all interfaces of integrated components for security flaws.

- **Protect cloud credentials**: An attacker can use the cloud authentication credentials you use to configure and operate your IoT deployment to gain access to and compromise your IoT system. Protect the credentials by changing the password often, and don't use these credentials on public machines.

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

- **Grant only the minimum permissions required**: Apply the principle of least privilege when you assign roles and permissions to users, apps, and devices. To learn more, see  [Identity management best practices](../security/fundamentals/identity-management-best-practices.md).

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
