---
title: Internet of Things (IoT) security best practices 
description: Best practices for securing your IoT data and infrastructure
author: eross-msft
ms.service: iot-fundamentals
services: iot-fundamentals
ms.topic: conceptual
ms.date: 08/26/2022
ms.author: lizross
---
# Security best practices for Internet of Things (IoT)

Securing an Internet of Things (IoT) infrastructure requires a rigorous security-in-depth strategy. This strategy requires you to secure data in the cloud, protect data integrity while in transit over the public internet, and securely provision devices. Each layer builds greater security assurance in the overall infrastructure.

## Secure an IoT infrastructure

This security-in-depth strategy can be developed and executed with active participation of various players involved with the manufacturing, development, and deployment of IoT devices and infrastructure. Following is a high-level description of these players.

* **IoT hardware manufacturer/integrator**: Typically, these players are the manufacturers of IoT hardware being deployed, integrators assembling hardware from various manufacturers, or suppliers providing hardware for an IoT deployment manufactured or integrated by other suppliers.

* **IoT solution developer**: The development of an IoT solution is typically done by a solution developer. This developer may part of an in-house team or a system integrator (SI) specializing in this activity. The IoT solution developer can develop various components of the IoT solution from scratch, or integrate various off-the-shelf or open-source components.

* **IoT solution deployer**: After an IoT solution is developed, it needs to be deployed in the field. This process involves deployment of hardware, interconnection of devices, and deployment of solutions in hardware devices or the cloud.

* **IoT solution operator**: After the IoT solution is deployed, it requires long-term operations, monitoring, upgrades, and maintenance. These tasks can be done by an in-house team that comprises information technology specialists, hardware operations and maintenance teams, and domain specialists who monitor the correct behavior of overall IoT infrastructure.

The sections that follow provide best practices for each of these players to help develop, deploy, and operate a secure IoT infrastructure.

## IoT hardware manufacturer/integrator

The following are the best practices for IoT hardware manufacturers and hardware integrators.

* **Scope hardware to minimum requirements**: The hardware design should include the minimum features required for operation of the hardware, and nothing more. An example is to include USB ports only if necessary for the operation of the device. These additional features open the device for unwanted attack vectors that should be avoided.

* **Make hardware tamper proof**: Build in mechanisms to detect physical tampering, such as opening of the device cover or removing a part of the device. These tamper signals may be part of the data stream uploaded to the cloud, which could alert operators of these events.

* **Build around secure hardware**: If COGS permits, build security features such as secure and encrypted storage, or boot functionality based on Trusted Platform Module (TPM). These features make devices more secure and help protect the overall IoT infrastructure.

* **Make upgrades secure**: Firmware upgrades during the lifetime of the device are inevitable. Building devices with secure paths for upgrades and cryptographic assurance of firmware versions will allow the device to be secure during and after upgrades.

## IoT solution developer

The following are the best practices for IoT solution developers:

* **Follow secure software development methodology**: Development of secure software requires ground-up thinking about security, from the inception of the project all the way to its implementation, testing, and deployment. The choices of platforms, languages, and tools are all influenced with this methodology. The Microsoft Security Development Lifecycle provides a step-by-step approach to building secure software.

* **Choose open-source software with care**: Open-source software provides an opportunity to quickly develop solutions. When you're choosing open-source software, consider the activity level of the community for each open-source component. An active community ensures that software is supported and that issues are discovered and addressed. Alternatively, an obscure and inactive open-source software project might not be supported and issues are not likely be discovered.

* **Integrate with care**: Many software security flaws exist at the boundary of libraries and APIs. Functionality that may not be required for the current deployment might still be available via an API layer. To ensure overall security, make sure to check all interfaces of components being integrated for security flaws.

## IoT solution deployer

The following are best practices for IoT solution deployers:

* **Deploy hardware securely**: IoT deployments may require hardware to be deployed in unsecure locations, such as in public spaces or unsupervised locales. In such situations, ensure that hardware deployment is tamper-proof to the maximum extent. If USB or other ports are available on the hardware, ensure that they are covered securely. Many attack vectors can use these as entry points.

* **Keep authentication keys safe**: During deployment, each device requires device IDs and associated authentication keys generated by the cloud service. Keep these keys physically safe even after the deployment. Any compromised key can be used by a malicious device to masquerade as an existing device.

## IoT solution operator

The following are the best practices for IoT solution operators:

* **Keep the system up-to-date**: Ensure that device operating systems and all device drivers are upgraded to the latest versions. If you turn on automatic updates in Windows 10 (IoT or other SKUs), Microsoft keeps it up-to-date, providing a secure operating system for IoT devices. Keeping other operating systems (such as Linux) up-to-date helps ensure that they are also protected against malicious attacks.

* **Protect against malicious activity**: If the operating system permits, install the latest antivirus and antimalware capabilities on each device operating system. This practice can help mitigate most external threats. You can protect most modern operating systems against threats by taking appropriate steps.

* **Audit frequently**: Auditing IoT infrastructure for security-related issues is key when responding to security incidents. Most operating systems provide built-in event logging that should be reviewed frequently to make sure no security breach has occurred. Audit information can be sent as a separate telemetry stream to the cloud service where it can be analyzed.

* **Physically protect the IoT infrastructure**: The worst security attacks against IoT infrastructure are launched using physical access to devices. One important safety practice is to protect against malicious use of USB ports and other physical access. One key to uncovering breaches that might have occurred is logging of physical access, such as USB port use. Again, Windows 10 (IoT and other SKUs) enables detailed logging of these events.

* **Protect cloud credentials**: Cloud authentication credentials used for configuring and operating an IoT deployment are possibly the easiest way to gain access and compromise an IoT system. Protect the credentials by changing the password frequently, and refrain from using these credentials on public machines.

Capabilities of different IoT devices vary. Some devices might be computers running common desktop operating systems, and some devices might be running very light-weight operating systems. The security best practices described previously might be applicable to these devices in varying degrees. If provided, additional security and deployment best practices from the manufacturers of these devices should be followed.

Some legacy and constrained devices might not have been designed specifically for IoT deployment. These devices might lack the capability to encrypt data, connect with the Internet, or provide advanced auditing. In these cases, a modern and secure field gateway can aggregate data from legacy devices and provide the security required for connecting these devices over the Internet. Field gateways can provide secure authentication, negotiation of encrypted sessions, receipt of commands from the cloud, and many other security features.

## See also

Read about IoT Hub security in [Control access to IoT Hub](../iot-hub/iot-hub-devguide-security.md) in the IoT Hub developer guide.

# Security recommendations for Azure Internet of Things (IoT) deployment

This article contains security recommendations for IoT. Implementing these recommendations will help you fulfill your security obligations as described in our shared responsibility model. For more information on what Microsoft does to fulfill service provider responsibilities, read [Shared responsibilities for cloud computing](../security/fundamentals/shared-responsibility.md).

Some of the recommendations included in this article can be automatically monitored by Microsoft Defender for IoT, the first line of defense in protecting your resources in Azure. It periodically analyzes the security state of your Azure resources to identify potential security vulnerabilities. It then provides you with recommendations on how to address them.

- For more information on Microsoft Defender for IoT recommendations, see [Security recommendations in Microsoft Defender for IoT](../security-center/security-center-recommendations.md).
- For information on Microsoft Defender for IoT see the [What is Microsoft Defender for IoT?](../security-center/security-center-introduction.md)

## General

| Recommendation | Comments |
|-|----|
| Stay up-to-date | Use the latest versions of supported platforms, programming languages, protocols, and frameworks. |
| Keep authentication keys safe | Keep the device IDs and their authentication keys physically safe after deployment. This will avoid a malicious device masquerade as a registered device. |
| Use device SDKs when possible | Device SDKs implement a variety of security features, such as, encryption, authentication, and so on, to assist you in developing a robust and secure device application. See [Understand and use Azure IoT Hub SDKs](../iot-hub/iot-hub-devguide-sdks.md) for more information. |

## Identity and access management 

| Recommendation | Comments |
|-|----|
| Define access control for the hub | [Understand and define the type of access](#securing-the-cloud) each component will have in your IoT Hub solution, based on the functionality. The allowed permissions are *Registry Read*, *RegistryReadWrite*, *ServiceConnect*, and *DeviceConnect*. Default [shared access policies in your IoT hub](../iot-hub/iot-hub-dev-guide-sas.md#access-control-and-permissions) can also help define the permissions for each component based on its role. |
| Define access control for backend services | Data ingested by your IoT Hub solution can be consumed by other Azure services such as [Azure Cosmos DB](../cosmos-db/index.yml), [Stream Analytics](../stream-analytics/index.yml), [App Service](../app-service/index.yml), [Logic Apps](../logic-apps/index.yml), and [Blob storage](../storage/blobs/storage-blobs-introduction.md). Make sure to understand and allow appropriate access permissions as documented for these services. |

## Data protection

| Recommendation | Comments |
|-|----|
| Secure device authentication | Ensure secure communication between your devices and your IoT hub, by using either [a unique identity key or security token](iot-hub-security-tokens), or [an on-device X.509 certificate](#x509-certificate-based-device-authentication) for each device. Use the appropriate method to [use security tokens based on the chosen protocol (MQTT, AMQP, or HTTPS)](../iot-hub/iot-hub-dev-guide-sas.md). |
| Secure device communication | IoT Hub secures the connection to the devices using Transport Layer Security (TLS) standard, supporting versions 1.2 and 1.0. Use [TLS 1.2](https://tools.ietf.org/html/rfc5246) to ensure maximum security. |
| Secure service communication | IoT Hub provides endpoints to connect to backend services such as [Azure Storage](../storage/index.yml) or [Event Hubs](../event-hubs/index.yml) using only the TLS protocol, and no endpoint is exposed on an unencrypted channel. Once this data reaches these backend services for storage or analysis, make sure to employ appropriate security and encryption methods for that service, and protect sensitive information at the backend. |

## Networking

| Recommendation | Comments |
|-|----|
| Protect access to your devices | Keep hardware ports in your devices to a bare minimum to avoid unwanted access. Additionally, build mechanisms to prevent or detect physical tampering of the device. Read [IoT security best practices](iot-security-best-practices.md) for details. |
| Build secure hardware | Incorporate security features such as encrypted storage, or Trusted Platform Module (TPM), to keep devices and infrastructure more secure. Keep the device operating system and drivers upgraded to latest versions, and if space permits, install antivirus and antimalware capabilities. Read [IoT security architecture](iot-security-architecture.md) to understand how this can help mitigate several security threats. |

## Monitoring

| Recommendation | Comments | Supported by Microsoft Defender for IoT |
|-|----|--|
| Monitor unauthorized access to your devices |  Use your device operating system's logging feature to monitor any security breaches or physical tampering of the device or its ports. | Yes |
| Monitor your IoT solution from the cloud | Monitor the overall health of your IoT Hub solution using the [metrics in Azure Monitor](../iot-hub/monitor-iot-hub.md). | Yes |
| Set up diagnostics | Closely watch your operations by logging events in your solution, and then sending the diagnostic logs to Azure Monitor to get visibility into the performance. Read [Monitor and diagnose problems in your IoT hub](../iot-hub/monitor-iot-hub.md) for more information. | Yes |

## Next steps

For advanced scenarios involving Azure IoT, you may need to consider additional security requirements. See [IoT security architecture](iot-security-architecture.md) for more guidance.

---
 title: include file
 description: include file
 services: iot-fundamentals
 author: kgremban
 ms.service: iot-fundamentals
 ms.topic: include
 ms.date: 08/07/2018
 ms.author: kgremban
 ms.custom: include file
---

This article provides the next level of detail for securing the Azure IoT-based Internet of Things (IoT) infrastructure. It links to implementation level details for configuring and deploying each component. It also provides comparisons and choices between various competing methods.

Securing the Azure IoT deployment can be divided into the following three security areas:

* **Device Security**: Securing the IoT device while it is deployed in the wild.

* **Connection Security**: Ensuring all data transmitted between the IoT device and IoT Hub is confidential and tamper-proof.

* **Cloud Security**: Providing a means to secure data while it moves through, and is stored in the cloud.

![Three security areas](./media/iot-security-best-practices/overview.png)

## Secure device provisioning and authentication

IoT solutions secure IoT devices using the following two methods:

* By providing a unique identity key (security tokens) for each device, which can be used by the device to communicate with the IoT Hub.

* By using an on-device [X.509 certificate](https://www.itu.int/rec/T-REC-X.509-201210-S) and private key as a means to authenticate the device to the IoT Hub. This authentication method ensures that the private key on the device is not known outside the device at any time, providing a higher level of security.

The security token method provides authentication for each call made by the device to IoT Hub by associating the symmetric key to each call. X.509-based authentication allows authentication of an IoT device at the physical layer as part of the TLS connection establishment. The security-token-based method can be used without the X.509 authentication, which is a less secure pattern. The choice between the two methods is primarily dictated by how secure the device authentication needs to be, and availability of secure storage on the device (to store the private key securely).

## IoT Hub security tokens

IoT Hub uses security tokens to authenticate devices and services to avoid sending keys on the network. Additionally, security tokens are limited in time validity and scope. Azure IoT SDKs automatically generate tokens without requiring any special configuration. Some scenarios, however, require the user to generate and use security tokens directly. These scenarios include the direct use of the MQTT, AMQP, or HTTP surfaces, or the implementation of the token service pattern.

More details on the structure of the security token and its usage can be found in the following articles:

* [Security token structure](../articles/iot-hub/iot-hub-dev-guide-sas.md#sas-token-structure)

* [Using SAS tokens as a device](../articles/iot-hub/iot-hub-dev-guide-sas.md#use-sas-tokens-as-a-device)

Each IoT Hub has an [identity registry](../articles/iot-hub/iot-hub-devguide-identity-registry.md) that can be used to create per-device resources in the service, such as a queue that contains in-flight cloud-to-device messages, and to allow access to the device-facing endpoints. The IoT Hub identity registry provides secure storage of device identities and security keys for a solution. Individual or groups of device identities can be added to an allowlist, or a blocklist, enabling complete control over device access. The following articles provide more details on the structure of the identity registry and supported operations.

[IoT Hub supports protocols such as MQTT, AMQP, and HTTP](../articles//iot-hub/iot-hub-dev-guide-sas.md). Each of these protocols uses security tokens from the IoT device to IoT Hub differently:

* AMQP: SASL PLAIN and AMQP Claims-based security (`{policyName}@sas.root.{iothubName}` with IoT hub-level tokens; `{deviceId}` with device-scoped tokens).

* MQTT: CONNECT packet uses `{deviceId}` as the `{ClientId}`, `{IoThubhostname}/{deviceId}` in the **Username** field and an SAS token in the **Password** field.

* HTTP: Valid token is in the authorization request header.

IoT Hub identity registry can be used to configure per-device security credentials and access control. However, if an IoT solution already has a significant investment in a [custom device identity registry and/or authentication scheme](../articles/iot-hub/iot-hub-dev-guide-sas.md#create-a-token-service-to-integrate-existing-devices), it can be integrated into an existing infrastructure with IoT Hub by creating a token service.

### X.509 certificate-based device authentication

The use of a [device-based X.509 certificate](../articles/iot-hub/iot-hub-dev-guide-sas.md) and its associated private and public key pair allows additional authentication at the physical layer. The private key is stored securely in the device and is not discoverable outside the device. The X.509 certificate contains information about the device, such as device ID, and other organizational details. A signature of the certificate is generated by using the private key.

High-level device provisioning flow:

* Associate an identifier to a physical device – device identity and/or X.509 certificate associated to the device during device manufacturing or commissioning.

* Create a corresponding identity entry in IoT Hub – device identity and associated device information in the IoT Hub identity registry.

* Securely store X.509 certificate thumbprint in IoT Hub identity registry.

### Root certificate on device

While establishing a secure TLS connection with IoT Hub, the IoT device authenticates IoT Hub using a root certificate that is part of the device SDK. For the C client SDK, the certificate is located under the folder "\\c\\certs" under the root of the repo. Though these root certificates are long-lived, they still may expire or be revoked. If there is no way of updating the certificate on the device, the device may not be able to subsequently connect to the IoT Hub (or any other cloud service). Having a means to update the root certificate once the IoT device is deployed effectively mitigates this risk.

## Securing the connection

Internet connection between the IoT device and IoT Hub is secured using the Transport Layer Security (TLS) standard. Azure IoT supports [TLS 1.2](https://tools.ietf.org/html/rfc5246), TLS 1.1, and TLS 1.0, in this order. Support for TLS 1.0 is provided for backward compatibility only. Check [TLS support in IoT Hub](../articles/iot-hub/iot-hub-tls-support.md) to see how to configure your hub to use TLS 1.2, as it provides the most security.

## Securing the cloud

Azure IoT Hub allows definition of [access control policies](../articles/iot-hub/iot-hub-dev-guide-sas.md) for each security key. It uses the following set of permissions to grant access to each of IoT Hub's endpoints. Permissions limit the access to an IoT Hub based on functionality.

* **RegistryRead**. Grants read access to the identity registry. For more information, see [identity registry](../articles/iot-hub/iot-hub-devguide-identity-registry.md).

* **RegistryReadWrite**. Grants read and write access to the identity registry. For more information, see [identity registry](../articles/iot-hub/iot-hub-devguide-identity-registry.md).

* **ServiceConnect**. Grants access to cloud service-facing communication and monitoring endpoints. For example, it grants permission to back-end cloud services to receive device-to-cloud messages, send cloud-to-device messages, and retrieve the corresponding delivery acknowledgments.

* **DeviceConnect**. Grants access to device-facing endpoints. For example, it grants permission to send device-to-cloud messages and receive cloud-to-device messages. This permission is used by devices.

There are two ways to obtain **DeviceConnect** permissions with IoT Hub with [security tokens](../articles/iot-hub/iot-hub-dev-guide-sas.md#use-sas-tokens-as-a-device): using a device identity key, or a shared access key. Moreover, it is important to note that all functionality accessible from devices is exposed by design on endpoints with prefix `/devices/{deviceId}`.

[Services can only generate security tokens](../articles/iot-hub/iot-hub-dev-guide-sas.md#use-sas-tokens-from-services) using shared access policies granting the appropriate permissions.

Azure IoT Hub and other services that may be part of the solution allow management of users using the Azure Active Directory.

Data ingested by Azure IoT Hub can be consumed by a variety of services such as Azure Stream Analytics and Azure blob storage. These services allow management access. Read more about these services and available options:

* [Azure Cosmos DB](https://azure.microsoft.com/services/cosmos-db/): A scalable, fully-indexed database service for semi-structured data that manages metadata for the devices you provision, such as attributes, configuration, and security properties. Azure Cosmos DB offers high-performance and high-throughput processing, schema-agnostic indexing of data, and a rich SQL query interface.

* [Azure Stream Analytics](https://azure.microsoft.com/services/stream-analytics/): Real-time stream processing in the cloud that enables you to rapidly develop and deploy a low-cost analytics solution to uncover real-time insights from devices, sensors, infrastructure, and applications. The data from this fully-managed service can scale to any volume while still achieving high throughput, low latency, and resiliency.

* [Azure App Services](https://azure.microsoft.com/services/app-service/): A cloud platform to build powerful web and mobile apps that connect to data anywhere; in the cloud or on-premises. Build engaging mobile apps for iOS, Android, and Windows. Integrate with your Software as a Service (SaaS) and enterprise applications with out-of-the-box connectivity to dozens of cloud-based services and enterprise applications. Code in your favorite language and IDE (.NET, Node.js, PHP, Python, or Java) to build web apps and APIs faster than ever.

* [Logic Apps](https://azure.microsoft.com/services/app-service/logic/): The Logic Apps feature of Azure App Service helps integrate your IoT solution to your existing line-of-business systems and automate workflow processes. Logic Apps enables developers to design workflows that start from a trigger and then execute a series of steps—rules and actions that use powerful connectors to integrate with your business processes. Logic Apps offers out-of-the-box connectivity to a vast ecosystem of SaaS, cloud-based, and on-premises applications.

* [Azure Blob storage](https://azure.microsoft.com/services/storage/): Reliable, economical cloud storage for the data that your devices send to the cloud.

## Conclusion

This article provides overview of implementation level details for designing and deploying an IoT infrastructure using Azure IoT. Configuring each component to be secure is key in securing the overall IoT infrastructure. The design choices available in Azure IoT provide some level of flexibility and choice; however, each choice may have security implications. It is recommended that each of these choices be evaluated through a risk/cost assessment.
