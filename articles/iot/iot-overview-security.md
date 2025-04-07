---
title: Security best practices for IoT solutions
description: Security best practices for building, deploying, and operating your IoT solution. Includes recommendations for assets, devices, data, and infrastructure
author: asergaz
ms.service: azure-iot
services: iot
ms.topic: overview
ms.date: 02/24/2025
ms.author: sergaz
# Customer intent: As a solution builder, I want a high-level overview of the the key concepts around securing a typical Azure IoT solution.
---

# Security best practices for IoT solutions

This overview introduces the key concepts around securing a typical Azure IoT solution. Each section includes links to content that provides further detail and guidance.

# [Edge-based solution](#tab/edge)

The following diagram shows a high-level view of the components in a typical [edge-based IoT solution](iot-introduction.md#edge-based-solution). This article focuses on the security of an edge-based IoT solution:

<!-- Art Library Source# ConceptArt-0-000-032 -->
:::image type="content" source="media/iot-overview-security/iot-edge-security-architecture.svg" alt-text="Diagram that shows the high-level IoT edge-based solution architecture highlighting security." border="false":::

You can divide security in an edge-based IoT solution into the following four areas:

- **Asset security**: Secure the physical or virtual item of value that you want to manage, monitor, and collect data from.

- **Connection security**: Ensure all data in transit between the asset, edge, and cloud services is confidential and tamper-proof.

- **Edge security**: Secure your data while it moves through, and is stored in the edge.

- **Cloud security**: Secure your data while it moves through, and is stored in the cloud.

Typically on an edge-based solution, you want to secure your end-to-end operations by using Azure security capabilities. Azure IoT Operations has built-in security capabilities such as [secrets management](../iot-operations/secure-iot-ops/howto-manage-secrets.md), [certificate management](../iot-operations/secure-iot-ops/concept-default-root-ca.md), and [secure settings](../iot-operations/deploy-iot-ops/howto-enable-secure-settings.md) on an [Azure Arc-enabled Kubernetes](/azure/azure-arc/kubernetes/overview) cluster. When a Kubernetes cluster is connected to Azure, an outbound connection to Azure is initiated, using industry-standard SSL to secure data in transit, and several other security features are enabled, such as:

- View and monitor your clusters using [Azure Monitor for containers](/azure/azure-monitor/containers/kubernetes-monitoring-enable).
- Enforce threat protection using [Microsoft Defender for Containers](/azure/defender-for-cloud/defender-for-containers-introduction).
- Ensure governance through applying policies with [Azure Policy for Kubernetes](/azure/governance/policy/concepts/policy-for-kubernetes).
- Grant access and connect to your Kubernetes clusters from anywhere, and manage access by using [Azure role-based access control (Azure RBAC)](/azure/azure-arc/kubernetes/azure-rbac) on your cluster.

### Microsoft Defender for IoT and for Containers

Microsoft Defender for IoT is a unified security solution built specifically to identify IoT and operational technology (OT) devices, vulnerabilities, and threats. Microsoft Defender for Containers is a cloud-native solution to improve, monitor, and maintain the security of your containerized assets (Kubernetes clusters, Kubernetes nodes, Kubernetes workloads, container registries, container images and more), and their applications, across multicloud and on-premises environments.

Both Defender for IoT and Defender for Containers can automatically monitor some of the recommendations included in this article. Defender for IoT and Defender for Containers should be the frontline of defense to protect your edge-based solution. To learn more, see:

- [Microsoft Defender for Containers - overview](/azure/defender-for-cloud/defender-for-containers-introduction)
- [Microsoft Defender for IoT for organizations - overview](../defender-for-iot/organizations/overview.md).

### Asset security

- **Secrets management**: Use [Azure Key Vault](/azure/key-vault/general/overview) to store and manage asset's sensitive information such as keys, passwords, certificates, and secrets. Azure IoT Operations uses Azure Key Vault as the managed vault solution on the cloud, and uses [Azure Key Vault Secret Store extension for Kubernetes](/azure/azure-arc/kubernetes/secret-store-extension) to sync the secrets down from the cloud and store them on the edge as Kubernetes secrets. To learn more, see [Manage secrets for your Azure IoT Operations deployment](../iot-operations/secure-iot-ops/howto-manage-secrets.md).

- **Certificate management**: Managing certificates is crucial for ensuring secure communication between assets and your edge runtime environment. Azure IoT Operations provides tools for managing certificates, including issuing, renewing, and revoking certificates. To learn more, see [Certificate management for Azure IoT Operations internal communication](../iot-operations/secure-iot-ops/concept-default-root-ca.md).

- **Select tamper-proof hardware for assets**: Choose asset hardware with built-in mechanisms to detect physical tampering, such as the opening of the device cover or the removal of a part of the device. These tamper signals can be part of the data stream uploaded to the cloud, alerting operators to these events.

- **Enable secure updates for asset firmware**: Use services that enable over-the-air updates for your assets. Build assets with secure paths for updates and cryptographic assurance of firmware versions to secure your assets during and after updates.

- **Deploy asset hardware securely**: Ensure that asset hardware deployment is as tamper-proof as possible, especially in unsecure locations such as public spaces or unsupervised locales. Only enable necessary features to minimize the physical attack footprint, such as securely covering USB ports if they aren't needed.

- **Follow device manufacturer security and deployment best practices**: If the device manufacturer provides security and deployment guidance, follow that guidance in addition to the generic guidance listed in this article.

### Connection security

- **Use Transport Layer Security (TLS) to secure connections from assets**: All communication within Azure IoT Operations is encrypted using TLS. To provide a secure-by-default experience that minimizes inadvertent exposure of your edge-based solution to attackers, Azure IoT Operations is deployed with a default root CA and issuer for TLS server certificates. For a production deployment, we recommend using your own CA issuer and an enterprise PKI solution.

- **Consider using enterprise firewalls or proxies to manage outbound traffic**: If you use enterprise firewalls or proxies, add the  [Azure IoT Operations endpoints](../iot-operations/deploy-iot-ops/overview-deploy.md#azure-iot-operations-endpoints) to your allowlist.

- **Encrypt internal traffic of message broker**: Ensuring the security of internal communications within your edge infrastructure is important to maintain data integrity and confidentiality. You should configure the MQTT broker to encrypt internal traffic and data in transit between the MQTT broker frontend and backend pods. To learn more, see [Configure encryption of broker internal traffic and internal certificates](../iot-operations/manage-mqtt-broker/howto-encrypt-internal-traffic.md).

- **Configure TLS with automatic certificate management for listeners in your MQTT broker**: Azure IoT Operations provides automatic certificate management for listeners in your MQTT broker. This reduces the administrative overhead of manually managing certificates, ensures timely renewals, and helps maintain compliance with security policies. To learn more, see [Secure MQTT broker communication by using BrokerListener](../iot-operations/manage-mqtt-broker/howto-configure-brokerlistener.md).

- **Set up a secure connection to OPC UA server**: When connecting to an OPC UA server, you should determine which OPC UA servers you trust to securely establish a session with. To learn more, see [Configure OPC UA certificates infrastructure for the connector for OPC UA](../iot-operations/discover-manage-assets/howto-configure-opcua-certificates-infrastructure.md).

### Edge security

- **Keep the edge runtime environment up-to-date**: Keep your cluster and Azure IoT Operations deployment up-to-date with the latest patches and minor releases to get all available security and bug fixes. For production deployments, [turn off auto-upgrade for Azure Arc](/azure/azure-arc/kubernetes/agent-upgrade#toggle-automatic-upgrade-on-or-off-when-connecting-a-cluster-to-azure-arc) to have complete control over when new updates are applied to your cluster. Instead, [manually upgrade agents](/azure/azure-arc/kubernetes/agent-upgrade#manually-upgrade-agents) as needed.

- **Verify the integrity of docker and helm images**: Before deploying any image to your cluster, verify that the image is signed by Microsoft. To learn more, see [Validate image signing](../iot-operations/secure-iot-ops/howto-validate-images.md).

- **Always use X.509 certificates or Kubernetes service account tokens for authentication with your MQTT broker**: An MQTT broker supports multiple authentication methods for clients. You can configure each listener port to have its own authentication settings with a BrokerAuthentication resource. To learn more, see [Configure MQTT broker authentication](../iot-operations/manage-mqtt-broker/howto-configure-authentication.md).

- **Provide the least privilege needed for the topic asset in your MQTT broker**: Authorization policies determine what actions the clients can perform on the broker, such as connecting, publishing, or subscribing to topics. Configure the MQTT broker to use one or multiple authorization policies with the BrokerAuthorization resource. To learn more, see [Configure MQTT broker authorization](../iot-operations/manage-mqtt-broker/howto-configure-authorization.md).

### Cloud security

- **Use user-assigned managed identities for cloud connections**: Always use managed identity authentication. When possible, [use user-assigned managed identity](../iot-operations/connect-to-cloud/howto-configure-mqtt-endpoint.md#user-assigned-managed-identity) in data flow endpoints for flexibility and auditability.

- **Deploy observability resources and set up logs**: Observability provides visibility into every layer of your Azure IoT Operations configuration. It gives you insight into the actual behavior of issues, which increases the effectiveness of site reliability engineering. Azure IoT Operations offers observability through custom curated Grafana dashboards that are hosted in Azure. These dashboards are powered by Azure Monitor managed service for Prometheus and by Container Insights. [Deploy observability resources](../iot-operations/configure-observability-monitoring/howto-configure-observability.md) on your cluster before deploying Azure IoT Operations.

- **Secure access to assets and asset endpoints with Azure RBAC**: Assets and asset endpoints in Azure IoT Operations have representations in both the Kubernetes cluster and the Azure portal. You can use Azure RBAC to secure access to these resources. Azure RBAC is an authorization system that enables you to manage access to Azure resources. You can use Azure RBAC to grant permissions to users, groups, and applications at a certain scope. To learn more, see [Secure access to assets and asset endpoints](../iot-operations/discover-manage-assets/howto-secure-assets.md).


# [Cloud-based solution](#tab/cloud)

The following diagram shows a high-level view of the components in a typical [cloud-based IoT solution](iot-introduction.md#cloud-based-solution). This article focuses on the security of a cloud-based IoT solution:

<!-- Art Library Source# ConceptArt-0-000-032 -->
:::image type="content" source="media/iot-overview-security/iot-cloud-security-architecture.svg" alt-text="Diagram that shows the high-level IoT cloud-based solution architecture highlighting security." border="false":::


You can divide security in a cloud-based IoT solution into the following three areas:

- **Device security**: Secure the IoT device while it's deployed in the wild.

- **Connection security**: Ensure all data transmitted between the IoT device and the IoT cloud services is confidential and tamper-proof.

- **Cloud security**: Secure your data while it moves through, and is stored in the cloud.

Implementing the recommendations in this article helps you meet the security obligations described in the [shared responsibility model](../security/fundamentals/shared-responsibility.md).

### Microsoft Defender for IoT

Microsoft Defender for IoT can automatically monitor some of the recommendations included in this article. Microsoft Defender for IoT should be the frontline of defense to protect your cloud-based solution. Microsoft Defender for IoT periodically analyzes the security state of your Azure resources to identify potential security vulnerabilities. It then provides you with recommendations on how to address them. To learn more, see:

- [Enhance security posture with security recommendations](../defender-for-iot/organizations/recommendations.md).
- [What is Microsoft Defender for IoT for organizations?](../defender-for-iot/organizations/overview.md).
- [What is Microsoft Defender for IoT for device builders?](../defender-for-iot/device-builders/overview.md).

### Device security

- **Scope hardware to minimum requirements**: Select your device hardware to include the minimum features required for its operation, and nothing more. For example, only include USB ports if they're necessary for the operation of the device in your solution. Extra features can expose the device to unwanted attack vectors.

- **Select tamper proof hardware**: Select device hardware with built-in mechanisms to detect physical tampering, such as the opening of the device cover or the removal of a part of the device. These tamper signals can be part of the data stream uploaded to the cloud, which can alert operators to these events.

- **Select secure hardware**: If possible choose device hardware that includes security features such as secure and encrypted storage and boot functionality based on a [Trusted Platform Module](../iot-dps/concepts-tpm-attestation.md). These features make devices more secure and help protect the overall IoT infrastructure.

- **Enable secure updates**: Use services like [Device Update for IoT Hub](../iot-hub-device-update/understand-device-update.md) for over-the-air updates for your IoT devices. Build devices with secure paths for updates and cryptographic assurance of firmware versions to secure your devices during and after updates.

- **Follow a secure software development methodology**: The development of secure software requires you to consider security from the inception of the project all the way through implementation, testing, and deployment. The [Microsoft Security Development Lifecycle](https://www.microsoft.com/securityengineering/sdl/) provides a step-by-step approach to building secure software.

- **Use device SDKs whenever possible**: Device SDKs implement various security features such as encryption and authentication that help you develop robust and secure device applications. To learn more, see [Azure IoT SDKs](iot-sdks.md).

- **Choose open-source software with care**: Open-source software provides an opportunity to quickly develop solutions. When you're choosing open-source software, consider the activity level of the community for each open-source component. An active community ensures that software is supported and that issues are discovered and addressed. An obscure and inactive open-source software project might not be supported and issues aren't likely be discovered.

- **Deploy hardware securely**: IoT deployments might require you to deploy hardware in unsecure locations, such as in public spaces or unsupervised locales. In such situations, ensure that hardware deployment is as tamper-proof as possible, and only the necessary features are enabled to minimize physical attack footprint. For example, if the hardware has USB ports ensure that they're covered securely.

- **Keep authentication keys safe**: During deployment, each device requires device IDs and associated authentication keys generated by the cloud service. Keep these keys physically safe and use [renewable credentials](../iot-dps/how-to-roll-certificates.md). A malicious device can use any compromised key to masquerade as an existing device.

- **Keep the system up-to-date**: Ensure that device operating systems and all device drivers are upgraded to the latest versions. Keeping operating systems up-to-date helps ensure that they're protected against malicious attacks.

- **Protect against malicious activity**: If the operating system permits, install the latest antivirus and anti-malware capabilities on each device operating system.

- **Audit frequently**: Auditing IoT infrastructure for security-related issues is key when responding to security incidents. Most operating systems provide built-in event logging that you should review frequently to make sure no security breach has occurred. A device can send audit information as a separate telemetry stream to the cloud service where it can be analyzed.

- **Follow device manufacturer security and deployment best practices**: If the device manufacturer provides security and deployment guidance, follow that guidance in addition to the generic guidance listed in this article.

- **Use a field gateway to provide security services for legacy or constrained devices**: Legacy and constrained devices might lack the capability to encrypt data, connect with the Internet, or provide advanced auditing. In these cases, a modern and secure field gateway can aggregate data from legacy devices and provide the security required for connecting these devices over the Internet. An [IoT Edge device can be used as a gateway](../iot-edge/iot-edge-as-gateway.md) and provide secure authentication, negotiation of encrypted sessions, receipt of commands from the cloud, and many other security features. [Azure Sphere](/azure-sphere/product-overview/what-is-azure-sphere?view=azure-sphere-integrated&preserve-view=true) can be used as a guardian module to secure other devices, including existing legacy systems not designed for trusted connectivity.

### Connection security

- **Use X.509 certificates to authenticate your devices to IoT Hub or IoT Central**: IoT Hub and IoT Central support both X509 certificate-based authentication and security tokens as methods for a device to authenticate. If possible, use X509-based authentication in production environments as it provides greater security. To learn more, see [Authenticating a device to IoT Hub](../iot-hub/authenticate-authorize-x509.md) and [Device authentication concepts in IoT Central](../iot-central/core/concepts-device-authentication.md).

- **Use Transport Layer Security (TLS) 1.2 to secure connections from devices**: IoT Hub and IoT Central use TLS to secure connections from IoT devices and services. Three versions of the TLS protocol are currently supported: 1.0, 1.1, and 1.2. TLS 1.0 and 1.1 are considered legacy. To learn more, see [Transport Layer Security (TLS) support in IoT Hub](../iot-hub/iot-hub-tls-support.md) and [TLS support in Azure IoT Hub Device Provisioning Service (DPS)](../iot-dps/tls-support.md).

- **Ensure you have a way to update the TLS root certificate on your devices**: TLS root certificates are long-lived, but they still might expire or be revoked. If there's no way of updating the certificate on the device, the device might not be able to connect to IoT Hub, IoT Central, or any other cloud service at a later date. To learn more, see [How to roll X.509 device certificates](../iot-dps/how-to-roll-certificates.md).

- **Consider using Azure Private Link**: Azure Private Link lets you connect your devices to a private endpoint on your virtual network, enabling you to block access to your IoT hub's public device-facing endpoints. To learn more, see [Ingress connectivity to IoT Hub using Azure Private Link](../iot-hub/virtual-network-support.md#ingress-connectivity-to-iot-hub-using-azure-private-link) and [Network security for IoT Central using private endpoints](../iot-central/core/concepts-private-endpoints.md).

### Cloud security

- **Follow a secure software development methodology**: The development of secure software requires you to consider security from the inception of the project all the way through implementation, testing, and deployment. The [Microsoft Security Development Lifecycle](https://www.microsoft.com/securityengineering/sdl/) provides a step-by-step approach to building secure software.

- **Choose open-source software with care**: Open-source software provides an opportunity to quickly develop solutions. When you're choosing open-source software, consider the activity level of the community for each open-source component. An active community ensures that software is supported and that issues are discovered and addressed. An obscure and inactive open-source software project might not be supported and issues aren't likely be discovered.

- **Integrate with care**: Many software security flaws exist at the boundary of libraries and APIs. Functionality that might not be required for the current deployment might still be available by through an API layer. To ensure overall security, make sure to check all interfaces of components being integrated for security flaws.

- **Protect cloud credentials**: An attacker can use the cloud authentication credentials you use to configure and operate your IoT deployment to gain access to and compromise your IoT system. Protect the credentials by changing the password frequently, and don't use these credentials on public machines.

- **Define access controls for your IoT hub**: Understand and define the type of access that each component in your IoT Hub solution needs based on the required functionality. There are two ways you can grant permissions for the service APIs to connect to your IoT hub: [Microsoft Entra ID](../iot-hub/authenticate-authorize-azure-ad.md) or [Shared Access signatures](../iot-hub/authenticate-authorize-sas.md). If possible, use Microsoft Entra ID in production environments as it provides greater security.

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

- **Monitor your IoT solution from the cloud**: Monitor the overall health of your IoT solution using the [IoT Hub metrics in Azure Monitor](../iot-hub/monitor-iot-hub.md) or [Monitor IoT Central application health](../iot-central/core/howto-manage-and-monitor-iot-central.md#monitor-application-health).

- **Set up diagnostics**: Monitor your operations by logging events in your solution, and then sending the diagnostic logs to Azure Monitor. To learn more, see [Monitor and diagnose problems in your IoT hub](../iot-hub/monitor-iot-hub.md).

---

## Related content

- [Azure security baseline for Azure Arc enabled Kubernetes](/security/benchmark/azure/baselines/azure-arc-enabled-kubernetes-security-baseline?toc=/azure/azure-arc/kubernetes/toc.json)
- [Concepts for keeping your cloud-native workload secure](https://kubernetes.io/docs/concepts/security/)
- [Azure security baseline for Azure IoT Hub](/security/benchmark/azure/baselines/iot-hub-security-baseline?toc=/azure/iot-hub/TOC.json)
- [IoT Central security guide](../iot-central/core/overview-iot-central-security.md)
- [Well-Architected Framework perspective on Azure IoT Hub](/azure/well-architected/service-guides/iot-hub)
