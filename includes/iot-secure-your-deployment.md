---
 title: include file
 description: include file
 services: iot-fundamentals
 author: robinsh
 ms.service: iot-fundamentals
 ms.topic: include
 ms.date: 08/07/2018
 ms.author: robinsh
 ms.custom: include file
---

# Secure your IoT deployment

This article provides the next level of detail for securing the Azure IoT-based Internet of Things (IoT) infrastructure. It links to implementation level details for configuring and deploying each component. It also provides comparisons and choices between various competing methods.

Securing the Azure IoT deployment can be divided into the following three security areas:

* **Device Security**: Securing the IoT device while it is deployed in the wild.

* **Connection Security**: Ensuring all data transmitted between the IoT device and IoT Hub is confidential and tamper-proof.

* **Cloud Security**: Providing a means to secure data while it moves through, and is stored in the cloud.

![Three security areas](./media/iot-secure-your-deployment/overview.png)

## Secure device provisioning and authentication

The IoT solution accelerators secure IoT devices using the following two methods:

* By providing a unique identity key (security tokens) for each device, which can be used by the device to communicate with the IoT Hub.

* By using an on-device [X.509 certificate](http://www.itu.int/rec/T-REC-X.509-201210-I/en) and private key as a means to authenticate the device to the IoT Hub. This authentication method ensures that the private key on the device is not known outside the device at any time, providing a higher level of security.

The security token method provides authentication for each call made by the device to IoT Hub by associating the symmetric key to each call. X.509-based authentication allows authentication of an IoT device at the physical layer as part of the TLS connection establishment. The security-token-based method can be used without the X.509 authentication, which is a less secure pattern. The choice between the two methods is primarily dictated by how secure the device authentication needs to be, and availability of secure storage on the device (to store the private key securely).

## IoT Hub security tokens

IoT Hub uses security tokens to authenticate devices and services to avoid sending keys on the network. Additionally, security tokens are limited in time validity and scope. Azure IoT SDKs automatically generate tokens without requiring any special configuration. Some scenarios, however, require the user to generate and use security tokens directly. These scenarios include the direct use of the MQTT, AMQP, or HTTP surfaces, or the implementation of the token service pattern.

More details on the structure of the security token and its usage can be found in the following articles:

* [Security token structure](../articles/iot-hub/iot-hub-devguide-security.md#security-token-structure)

* [Using SAS tokens as a device](../articles/iot-hub/iot-hub-devguide-security.md#use-sas-tokens-in-a-device-app)

Each IoT Hub has an [identity registry](../articles/iot-hub/iot-hub-devguide-identity-registry.md) that can be used to create per-device resources in the service, such as a queue that contains in-flight cloud-to-device messages, and to allow access to the device-facing endpoints. The IoT Hub identity registry provides secure storage of device identities and security keys for a solution. Individual or groups of device identities can be added to an allow list, or a block list, enabling complete control over device access. The following articles provide more details on the structure of the identity registry and supported operations.

[IoT Hub supports protocols such as MQTT, AMQP, and HTTP](../articles//iot-hub/iot-hub-devguide-security.md). Each of these protocols uses security tokens from the IoT device to IoT Hub differently:

* AMQP: SASL PLAIN and AMQP Claims-based security (`{policyName}@sas.root.{iothubName}` with IoT hub-level tokens; `{deviceId}` with device-scoped tokens).

* MQTT: CONNECT packet uses `{deviceId}` as the `{ClientId}`, `{IoThubhostname}/{deviceId}` in the **Username** field and an SAS token in the **Password** field.

* HTTP: Valid token is in the authorization request header.

IoT Hub identity registry can be used to configure per-device security credentials and access control. However, if an IoT solution already has a significant investment in a [custom device identity registry and/or authentication scheme](../articles/iot-hub/iot-hub-devguide-security.md#custom-device-and-module-authentication), it can be integrated into an existing infrastructure with IoT Hub by creating a token service.

### X.509 certificate-based device authentication

The use of a [device-based X.509 certificate](../articles/iot-hub/iot-hub-devguide-security.md) and its associated private and public key pair allows additional authentication at the physical layer. The private key is stored securely in the device and is not discoverable outside the device. The X.509 certificate contains information about the device, such as device ID, and other organizational details. A signature of the certificate is generated by using the private key.

High-level device provisioning flow:

* Associate an identifier to a physical device – device identity and/or X.509 certificate associated to the device during device manufacturing or commissioning.

* Create a corresponding identity entry in IoT Hub – device identity and associated device information in the IoT Hub identity registry.

* Securely store X.509 certificate thumbprint in IoT Hub identity registry.

### Root certificate on device

While establishing a secure TLS connection with IoT Hub, the IoT device authenticates IoT Hub using a root certificate that is part of the device SDK. For the C client SDK, the certificate is located under the folder "\\c\\certs" under the root of the repo. Though these root certificates are long-lived, they still may expire or be revoked. If there is no way of updating the certificate on the device, the device may not be able to subsequently connect to the IoT Hub (or any other cloud service). Having a means to update the root certificate once the IoT device is deployed effectively mitigates this risk.

## Securing the connection

Internet connection between the IoT device and IoT Hub is secured using the Transport Layer Security (TLS) standard. Azure IoT supports [TLS 1.2](https://tools.ietf.org/html/rfc5246), TLS 1.1, and TLS 1.0, in this order. Support for TLS 1.0 is provided for backward compatibility only. If possible, use TLS 1.2 as it provides the most security.

## Securing the cloud

Azure IoT Hub allows definition of [access control policies](../articles/iot-hub/iot-hub-devguide-security.md) for each security key. It uses the following set of permissions to grant access to each of IoT Hub's endpoints. Permissions limit the access to an IoT Hub based on functionality.

* **RegistryRead**. Grants read access to the identity registry. For more information, see [identity registry](../articles/iot-hub/iot-hub-devguide-identity-registry.md).

* **RegistryReadWrite**. Grants read and write access to the identity registry. For more information, see [identity registry](../articles/iot-hub/iot-hub-devguide-identity-registry.md).

* **ServiceConnect**. Grants access to cloud service-facing communication and monitoring endpoints. For example, it grants permission to back-end cloud services to receive device-to-cloud messages, send cloud-to-device messages, and retrieve the corresponding delivery acknowledgments.

* **DeviceConnect**. Grants access to device-facing endpoints. For example, it grants permission to send device-to-cloud messages and receive cloud-to-device messages. This permission is used by devices.

There are two ways to obtain **DeviceConnect** permissions with IoT Hub with [security tokens](../articles/iot-hub/iot-hub-devguide-security.md#use-sas-tokens-in-a-device-app): using a device identity key, or a shared access key. Moreover, it is important to note that all functionality accessible from devices is exposed by design on endpoints with prefix `/devices/{deviceId}`.

[Service components can only generate security tokens](../articles/iot-hub/iot-hub-devguide-security.md#use-security-tokens-from-service-components) using shared access policies granting the appropriate permissions.

Azure IoT Hub and other services that may be part of the solution allow management of users using the Azure Active Directory.

Data ingested by Azure IoT Hub can be consumed by a variety of services such as Azure Stream Analytics and Azure blob storage. These services allow management access. Read more about these services and available options:

* [Azure Cosmos DB](https://azure.microsoft.com/services/cosmos-db/): A scalable, fully-indexed database service for semi-structured data that manages metadata for the devices you provision, such as attributes, configuration, and security properties. Azure Cosmos DB offers high-performance and high-throughput processing, schema-agnostic indexing of data, and a rich SQL query interface.

* [Azure Stream Analytics](https://azure.microsoft.com/services/stream-analytics/): Real-time stream processing in the cloud that enables you to rapidly develop and deploy a low-cost analytics solution to uncover real-time insights from devices, sensors, infrastructure, and applications. The data from this fully-managed service can scale to any volume while still achieving high throughput, low latency, and resiliency.

* [Azure App Services](https://azure.microsoft.com/services/app-service/): A cloud platform to build powerful web and mobile apps that connect to data anywhere; in the cloud or on-premises. Build engaging mobile apps for iOS, Android, and Windows. Integrate with your Software as a Service (SaaS) and enterprise applications with out-of-the-box connectivity to dozens of cloud-based services and enterprise applications. Code in your favorite language and IDE (.NET, Node.js, PHP, Python, or Java) to build web apps and APIs faster than ever.

* [Logic Apps](https://azure.microsoft.com/services/app-service/logic/): The Logic Apps feature of Azure App Service helps integrate your IoT solution to your existing line-of-business systems and automate workflow processes. Logic Apps enables developers to design workflows that start from a trigger and then execute a series of steps—rules and actions that use powerful connectors to integrate with your business processes. Logic Apps offers out-of-the-box connectivity to a vast ecosystem of SaaS, cloud-based, and on-premises applications.

* [Azure Blob storage](https://azure.microsoft.com/services/storage/): Reliable, economical cloud storage for the data that your devices send to the cloud.

## Conclusion

This article provides overview of implementation level details for designing and deploying an IoT infrastructure using Azure IoT. Configuring each component to be secure is key in securing the overall IoT infrastructure. The design choices available in Azure IoT provide some level of flexibility and choice; however, each choice may have security implications. It is recommended that each of these choices be evaluated through a risk/cost assessment.
