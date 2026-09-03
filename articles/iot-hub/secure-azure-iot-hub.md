---
title: Secure your Azure IoT Hub deployment
description: Learn how to secure Azure IoT Hub, with best practices for protecting your deployment.
author: msmbaldwin
ms.author: mbaldwin
ms.service: azure-iot-hub
ms.topic: best-practice
ms.custom: horz-security
ms.date: 08/13/2026
ai-usage: ai-assisted
---

# Secure your Azure IoT Hub deployment

Azure IoT Hub provides a central message hub for bidirectional communication between IoT applications and the devices they manage. When deploying this service, it's important to follow security best practices to protect data, configurations, and infrastructure.

This article provides guidance on how to best secure your Azure IoT Hub deployment. If you're also using other Azure IoT services, see [Secure your IoT solutions](/azure/iot/iot-overview-security).

[!INCLUDE [Security horizontal Zero Trust statement](~/reusable-content/ce-skilling/azure/includes/security/zero-trust-security-horizontal.md)]

## Device security

Securing the devices that connect to your IoT Hub is critical for the overall security of your IoT solution.

- **Use renewable device credentials**: Implement a process for regularly updating device credentials, such as rolling X.509 certificates, to limit the impact of compromised authentication. For more information, see [How to roll X.509 device certificates](/azure/iot-dps/how-to-roll-certificates).

- **Deploy update agents on devices**: Ensure devices have update agents for receiving and applying security updates, keeping firmware and software secure throughout the device lifecycle. For more information, see [Device Update for IoT Hub](/azure/iot-hub-device-update/understand-device-update).

- **Implement secure device provisioning**: Use Azure IoT Hub Device Provisioning Service (DPS) for secure, zero-touch provisioning of devices at scale with appropriate authentication mechanisms. For more information, see [IoT Hub Device Provisioning Service](/azure/iot-dps/).

- **Use Trusted Platform Modules**: Deploy devices with hardware-based security features like Trusted Platform Modules (TPMs) to provide secure storage for cryptographic keys and protect against physical tampering. For more information, see [TPM attestation](/azure/iot-dps/concepts-tpm-attestation).

- **Revoke access for compromised devices**: Implement procedures to quickly revoke access for devices that show signs of compromise, preventing them from connecting to your IoT Hub and potentially impacting other devices. For more information, see [How to revoke device access](/azure/iot-dps/how-to-revoke-device-access-portal).

## Network security

Securing network access to your IoT Hub is crucial to prevent unauthorized access and protect the data flowing between your devices and the cloud.

- **Enable private endpoints**: Eliminate public internet exposure by routing traffic through your virtual network with Azure Private Link, and allow devices to connect to your IoT hub without exposure to the public internet. For more information, see [IoT Hub support for virtual networks with Azure Private Link](/azure/iot-hub/virtual-network-support).

- **Disable public network access**: Prevent direct access from the public internet by disabling public endpoints when you can use private endpoints instead. For more information, see [Managing public network access for your IoT hub](/azure/iot-hub/iot-hub-public-network-access).

- **Configure IP filtering**: Restrict connections to your IoT Hub by allowing only specific IP addresses or ranges, and limit exposure to potential attacks. For more information, see [IoT Hub IP filtering](/azure/iot-hub/iot-hub-ip-filtering).

- **Enforce TLS 1.2 and strong cipher suites**: Strengthen connection security by enforcing the use of TLS 1.2 and recommended cipher suites for all device and service connections. For more information, see [Transport Layer Security (TLS) support in IoT Hub](/azure/iot-hub/iot-hub-tls-support#enforce-iot-hub-to-use-tls-12-and-strong-cipher-suites).

## Identity and access management

Proper identity and access management is essential for controlling who can administer your IoT Hub and how devices authenticate to it.

- **Use Microsoft Entra ID authentication**: Implement Microsoft Entra ID (formerly Azure AD) for authenticating and authorizing service API requests, and enable more granular access control than shared access policies. For more information, see [Control access to IoT Hub by using Microsoft Entra ID](/azure/iot-hub/iot-hub-dev-guide-azure-ad-rbac).

- **Implement Azure RBAC for granular permissions**: Assign least-privilege role-based access control to users and applications accessing IoT Hub management APIs, and reduce the risk of unauthorized operations. For more information, see [Manage access to IoT Hub by using Azure RBAC role assignment](/azure/iot-hub/iot-hub-dev-guide-azure-ad-rbac#manage-access-to-iot-hub-by-using-azure-rbac-role-assignment).

- **Use X.509 certificates for device authentication**: Implement X.509 certificate-based authentication instead of SAS tokens for production environments to increase security and enable better credential management. For more information, see [Authenticate identities with X.509 certificates](/azure/iot-hub/authenticate-authorize-x509).

- **Avoid shared symmetric keys across devices**: Assign unique credentials to each device to prevent widespread compromise if a single key is leaked, and limit the impact of potential credential exposure. For more information, see [Security practices for device manufacturers](/azure/iot-dps/concepts-device-oem-security-practices#shared-symmetric-key).

- **Disable shared access policies when not needed**: Reduce the attack surface by disabling shared access policies and tokens when using Microsoft Entra ID for authentication. For more information, see [Enforce Microsoft Entra authentication](/azure/iot-hub/authenticate-authorize-azure-ad#enforce-microsoft-entra-authentication).

## Data protection

Protecting data both in transit and at rest is vital for maintaining the confidentiality and integrity of your IoT solution.

- **Use hardware security modules for device secrets**: Store device certificates and private keys in hardware security modules (HSMs) to protect against extraction and tampering. This practice enhances the security of authentication credentials. For more information, see [Hardware security module](/azure/iot-dps/concepts-service#hardware-security-module).

- **Implement device-level data encryption**: Encrypt sensitive data on devices before transmission to IoT Hub to add a layer of protection beyond TLS, particularly for highly sensitive information. Also ensure that data stored in stateful components such as device twins is protected. For more information, see [Security architecture for IoT solutions](/azure/iot/iot-overview-security).

- **Use the latest SDK versions**: Use the most recent IoT Hub device SDKs, which implement various security features including encryption and authentication. For more information, see [Azure IoT SDKs](/azure/iot-hub/iot-sdks).

- **Keep root CA certificates updated**: Regularly update the trusted root certificates on your devices to maintain secure TLS connections. This practice helps you avoid connection failures due to expired or revoked certificates. For more information, see [IoT Hub TLS support](/azure/iot-hub/iot-hub-tls-support#iot-hubs-server-tls-certificate).

## Logging and monitoring

Comprehensive logging and monitoring is essential for detecting and responding to potential security issues in your IoT solution.

- **Enable resource logs for connections and device telemetry**: Configure diagnostic settings to send IoT Hub resource logs to Azure Monitor Logs. This configuration helps you track connection attempts, errors, and operations for security investigation. For more information, see [Monitor and diagnose problems in your IoT hub](/azure/iot-hub/monitor-iot-hub).

- **Set up alerts for connectivity issues**: Create alerts based on metrics and logs to detect unusual patterns like repeated authentication failures or unexpected disconnections that might indicate security problems. For more information, see [Monitor, diagnose, and troubleshoot Azure IoT Hub device connectivity](/azure/iot-hub/iot-hub-troubleshoot-connectivity).

- **Enable Microsoft Defender for IoT**: Activate Microsoft Defender for IoT on your IoT Hub to gain real-time security monitoring, recommendations, and alerts for potential threats targeting your IoT solution. For more information, see [Quickstart: Enable Microsoft Defender for IoT on your Azure IoT Hub](/azure/defender-for-iot/device-builders/quickstart-onboard-iot-hub).

## Compliance and governance

Establishing proper governance and ensuring compliance with security standards are key aspects of maintaining a secure IoT solution.

- **Apply Azure Policy for IoT Hub**: Implement Azure Policy to enforce and audit security configurations across your IoT hubs, ensuring consistent security standards are maintained. For more information, see [Azure Policy built-in definitions for Azure IoT Hub](/azure/iot-hub/policy-reference).

- **Regularly audit access permissions**: Review and validate the IoT Hub shared access policies and Microsoft Entra ID role assignments granted to users, applications, and devices to ensure they adhere to the principle of least privilege. For more information, see [Control access to IoT Hub by using Microsoft Entra ID](/azure/iot-hub/iot-hub-dev-guide-azure-ad-rbac).

- **Retain audit logs for compliance**: Route IoT Hub resource logs and audit events to a Log Analytics workspace or storage account with a retention period that satisfies your compliance requirements, preserving records for security investigations and regulatory audits. For more information, see [Monitor and diagnose problems in your IoT hub](/azure/iot-hub/monitor-iot-hub).

## Backup and recovery

Planning for regional outages helps you maintain the availability and integrity of your IoT solution during disruptions.

- **Plan for regional failover**: Use IoT Hub manual failover to recover your hub's operations to its Azure geo-paired region during a regional outage, and validate your recovery process on a regular basis. For more information, see [Perform manual failover for an IoT hub](/azure/iot-hub/tutorial-manual-failover).

## Learn more

- [Architecture best practices for Azure IoT Hub](/azure/well-architected/service-guides/azure-iot-hub)
- [Secure your IoT solutions](/azure/iot/iot-overview-security)
