---
title: Security best practices
description: Security best practices for building, deploying, and operating your IoT solution. Includes recommendations for devices, data, and infrastructure
author: dominicbetts
ms.service: iot
services: iot
ms.topic: conceptual
ms.date: 02/10/2023
ms.author: dobett
---

# Security best practices for IoT solutions

You can divide security in an IoT solution into the following three areas:

- **Device security**: Securing the IoT device while it's deployed in the wild.

- **Connection security**: Ensuring all data transmitted between the IoT device and IoT Hub is confidential and tamper-proof.

- **Cloud security**: Providing a means to secure data while it moves through, and is stored in the cloud.

Implementing the recommendations in this article will help you meet the security obligations described in the shared responsibility model. To learn more about what Microsoft does to fulfill service provider responsibilities, see [Shared responsibilities for cloud computing](../security/fundamentals/shared-responsibility.md).

## Responsibilities

You can develop and execute an IoT security strategy with the active participation of the various players involved in the manufacturing, development, and deployment of IoT devices and infrastructure. The following list is a high-level description of these players.

- **Hardware manufacturer/integrator**: The manufacturers of IoT hardware you're deploying, the integrators assembling hardware from various manufacturers, or the suppliers providing the hardware.

- **Solution developer**: The solution developer may part of an in-house team or a system integrator specializing in this activity. The IoT solution developer can develop various components of the IoT solution from scratch, or integrate various off-the-shelf or open-source components.

- **Solution deployer**: After an IoT solution is developed, it needs to be deployed in the field. This process involves deployment of hardware, interconnection of devices, and deployment of solutions in hardware devices or the cloud.

- **Solution operator**: After the IoT solution is deployed, it requires long-term operations, monitoring, upgrades, and maintenance. These tasks can be done by an in-house team that monitors the correct behavior of overall IoT infrastructure.

## Microsoft Defender for IoT

Microsoft Defender for IoT can automatically monitor some of the recommendations included in this article. Microsoft Defender for IoT should be the first line of defense to protect your resources in Azure. Microsoft Defender for IoT periodically analyzes the security state of your Azure resources to identify potential security vulnerabilities. It then provides you with recommendations on how to address them.

- To learn more about Microsoft Defender for IoT recommendations, see [Security recommendations in Microsoft Defender for IoT](../security-center/security-center-recommendations.md).
- To learn more about Microsoft Defender for IoT, see [What is Microsoft Defender for IoT?](../security-center/security-center-introduction.md).

## Device security

- **Scope hardware to minimum requirements**: Select your device hardware to include the minimum features required for its operation, and nothing more. For example, only include USB ports if they're necessary for the operation of the device in your solution. Extra features can expose the device to unwanted attack vectors.

- **Select tamper proof hardware**: Select device hardware with built-in mechanisms to detect physical tampering, such as the opening of the device cover or the removal of a part of the device. These tamper signals can be part of the data stream uploaded to the cloud, which can alert operators to these events.

- **Select secure hardware**: If possible choose device hardware that includes security features such as secure and encrypted storage and boot functionality based on a Trusted Platform Module. These features make devices more secure and help protect the overall IoT infrastructure.

- **Enable secure upgrades**: Firmware upgrades during the lifetime of the device are inevitable. Build devices with secure paths for upgrades and cryptographic assurance of firmware versions to secure your devices during and after upgrades.

- **Follow a secure software development methodology**: The development of secure software requires you to consider security from the inception of the project all the way through implementation, testing, and deployment. The [Microsoft Security Development Lifecycle](https://www.microsoft.com/securityengineering/sdl/) provides a step-by-step approach to building secure software.

- **Use device SDKs whenever possible**: Device SDKs implement various security features such as encryption and authentication that help you develop robust and secure device applications. To learn more, see [Understand and use Azure IoT Hub SDKs](../iot-hub/iot-hub-devguide-sdks.md).

- **Choose open-source software with care**: Open-source software provides an opportunity to quickly develop solutions. When you're choosing open-source software, consider the activity level of the community for each open-source component. An active community ensures that software is supported and that issues are discovered and addressed. An obscure and inactive open-source software project might not be supported and issues aren't likely be discovered.

- **Deploy hardware securely**: IoT deployments may require you to deploy hardware in unsecure locations, such as in public spaces or unsupervised locales. In such situations, ensure that hardware deployment is as tamper-proof as possible. For example, if the hardware has USB ports ensure that they're covered securely.

- **Keep authentication keys safe**: During deployment, each device requires device IDs and associated authentication keys generated by the cloud service. Keep these keys physically safe even after the deployment. Any compromised key can be used by a malicious device to masquerade as an existing device.

- **Keep the system up-to-date**: Ensure that device operating systems and all device drivers are upgraded to the latest versions. Keeping operating systems up-to-date helps ensure that they're protected against malicious attacks.

- **Protect against malicious activity**: If the operating system permits, install the latest antivirus and antimalware capabilities on each device operating system.

- **Audit frequently**: Auditing IoT infrastructure for security-related issues is key when responding to security incidents. Most operating systems provide built-in event logging that you should review frequently to make sure no security breach has occurred. A device can send audit information as a separate telemetry stream to the cloud service where it can be analyzed.

- **Follow device manufacturer security and deployment best practices**: If the device manufacturer provides security and deployment guidance, follow that guidance in addition to the generic guidance listed in this article.

- **Use a field gateway to provide security services for legacy or constrained devices**: Legacy and constrained devices might lack the capability to encrypt data, connect with the Internet, or provide advanced auditing. In these cases, a modern and secure field gateway can aggregate data from legacy devices and provide the security required for connecting these devices over the Internet. Field gateways can provide secure authentication, negotiation of encrypted sessions, receipt of commands from the cloud, and many other security features.

## Connection security

- **Use X.509 certificates to authenticate your devices to IoT Hub**: IoT Hub supports both X509 certificate-based authentication and security tokens as methods for a device to authenticate with your IoT hub. If possible, use X509-based authentication in production environments as it provides greater security. To learn more, see [Authenticating a device to IoT Hub](../iot-hub/iot-hub-dev-guide-sas.md#authenticating-a-device-to-iot-hub).

- **Use Transport Layer Security (TLS) 1.2 to secure connections from devices**: IoT Hub uses TLS to secure connections from IoT devices and services. Three versions of the TLS protocol are currently supported: 1.0, 1.1, and 1.2. TLS 1.0 and 1.1 are considered legacy. To learn more, see [Transport Layer Security (TLS) support in IoT Hub](../iot-hub/iot-hub-tls-support.md).

- **Ensure you have a way to update the TLS root certificate on your devices**: TLS root certificates are long-lived, but they still may expire or be revoked. If there's no way of updating the certificate on the device, the device may not be able to connect to IoT Hub or any other cloud service at a later date.

- **Consider using Azure Private Link**: Azure Private Link lets you connect your devices to a private endpoint on your VNet, enabling you to block access to your IoT hub's public device-facing endpoints. To learn more, see [Ingress connectivity to IoT Hub using Azure Private Link](../iot-hub/virtual-network-support.md#ingress-connectivity-to-iot-hub-using-azure-private-link).

## Cloud security

- **Follow a secure software development methodology**: The development of secure software requires you to consider security from the inception of the project all the way through implementation, testing, and deployment. The [Microsoft Security Development Lifecycle](https://www.microsoft.com/securityengineering/sdl/) provides a step-by-step approach to building secure software.

- **Choose open-source software with care**: Open-source software provides an opportunity to quickly develop solutions. When you're choosing open-source software, consider the activity level of the community for each open-source component. An active community ensures that software is supported and that issues are discovered and addressed. An obscure and inactive open-source software project might not be supported and issues aren't likely be discovered.

- **Integrate with care**: Many software security flaws exist at the boundary of libraries and APIs. Functionality that may not be required for the current deployment might still be available by through an API layer. To ensure overall security, make sure to check all interfaces of components being integrated for security flaws.

- **Protect cloud credentials**: An attacker can use the cloud authentication credentials you use to configure and operate your IoT deployment to gain access to and compromise your IoT system. Protect the credentials by changing the password frequently, and don't use these credentials on public machines.

- **Define access controls for your IoT hub**: Understand and define the type of access that each component in your IoT Hub solution needs based on the required functionality. There are two ways you can grant permissions for the service APIs to connect to your IoT hub: [Azure Active Directory](../iot-hub/iot-hub-dev-guide-azure-ad-rbac.md) or [Shared Access signatures](../iot-hub/iot-hub-dev-guide-sas.md).

- **Define access controls for backend services**: Other Azure services can consume the data your IoT Hub ingests from your devices by using the IoT hub's Event Hubs-compatible endpoint. You can also use IoT Hub message routing to deliver the data from your devices to other Azure services. Understand and configure appropriate access permissions for IoT Hub to connect to these services. To learn more, see [Read device-to-cloud messages from the built-in endpoint](../iot-hub/iot-hub-devguide-messages-read-builtin.md) and [Use IoT Hub message routing to send device-to-cloud messages to different endpoints](../iot-hub/iot-hub-devguide-messages-d2c.md).

- **Monitor your IoT solution from the cloud**: Monitor the overall health of your IoT Hub solution using the [metrics in Azure Monitor](../iot-hub/monitor-iot-hub.md).

- **Set up diagnostics**: Monitor your operations by logging events in your solution, and then sending the diagnostic logs to Azure Monitor. To learn more, see [Monitor and diagnose problems in your IoT hub](../iot-hub/monitor-iot-hub.md).

## Next steps

Read about IoT Hub security in [Azure security baseline for Azure IoT Hub](/security/benchmark/azure/baselines/iot-hub-security-baseline?toc=/azure/iot-hub/TOC.json) and [Security in your IoT workload](/azure/architecture/framework/iot/iot-security).
