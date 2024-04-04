---
title: Roles and operations for Azure DPS
titleSuffix: Azure IoT Hub Device Provisioning Service
description: Conceptual overview of the roles and operations involved when developing and IoT solution using the IoT Device Provisioning Service (DPS).
author: kgremban

ms.author: kgremban
ms.date: 09/14/2020
ms.topic: concept-article
ms.service: iot-dps
---

# Roles and operations

The phases of developing an IoT solution can span weeks or months, due to production realities like manufacturing time, shipping, customs process, etc. In addition, they can span activities across multiple roles given the various entities involved. This topic takes a deeper look at the various roles and operations related to each phase, then illustrates the flow in a sequence diagram. 

Provisioning also places requirements on the device manufacturer, specific to enabling the [attestation mechanism](concepts-service.md#attestation-mechanism). Manufacturing operations can also occur independent of the timing of auto-provisioning phases, especially in cases where new devices are procured after auto-provisioning has already been established.

A series of Quickstarts are provided in the table of contents to the left, to help explain auto-provisioning through hands-on experience. In order to facilitate/simplify the learning process, software is used to simulate a physical device for enrollment and registration. Some Quickstarts require you to fulfill operations for multiple roles, including operations for non-existent roles, due to the simulated nature of the Quickstarts.

| Role | Operation | Description |
|------| --------- | ------------|
| Manufacturer | Encode identity and registration URL | Based on the attestation mechanism used, the manufacturer is responsible for encoding the device identity info, and the Device Provisioning Service registration URL.<br><br>**Quickstarts**: since the device is simulated, there is no Manufacturer role. See the Developer role for details on how you get this information, which is used in coding a sample registration application. |
| | Provide device identity | As the originator of the device identity info, the manufacturer is responsible for communicating it to the operator (or a designated agent), or directly enrolling it to the Device Provisioning Service via APIs.<br><br>**Quickstarts**: since the device is simulated, there is no Manufacturer role. See the Operator role for details on how you get the device identity, which is used to enroll a simulated device in your Device Provisioning Service instance. |
| Operator | Configure auto-provisioning | This operation corresponds with the first phase of auto-provisioning.<br><br>**Quickstarts**: You perform the Operator role, configuring the Device Provisioning Service and IoT Hub instances in your Azure subscription. |
|  | Enroll device identity | This operation corresponds with the second phase of auto-provisioning.<br><br>**Quickstarts**: You perform the Operator role, enrolling your simulated device in your Device Provisioning Service instance. The device identity is determined by the attestation method being simulated in the Quickstart (TPM or X.509). See the Developer role for attestation details. |
| Device Provisioning Service,<br>IoT Hub | \<all operations\> | For both a production implementation with physical devices, and Quickstarts with simulated devices, these roles are fulfilled via the IoT services you configure in your Azure subscription. The roles/operations function exactly the same, as the IoT services are indifferent to provisioning of physical vs. simulated devices. |
| Developer | Build/Deploy registration software | This operation corresponds with the third phase of auto-provisioning. The Developer is responsible for building and deploying the registration software to the device, using the appropriate SDK.<br><br>**Quickstarts**: The sample registration application you build simulates a real device, for your platform/language of choice, which runs on your workstation (instead of deploying it to a physical device). The registration application performs the same operations as one deployed to a physical device. You specify the attestation method (TPM or X.509 certificate), plus the registration URL and "ID Scope" of your Device Provisioning Service instance. The device identity is determined by the SDK attestation logic at runtime, based on the method you specify: <ul><li>**TPM attestation** - your development workstation runs a [TPM simulator application](quick-create-simulated-device-tpm.md). Once running, a separate application is used to extract the TPM's "Endorsement Key" and "Registration ID" for use in enrolling the device identity. The SDK attestation logic also uses the simulator during registration, to present a signed SAS token for authentication and enrollment verification.</li><li>**X509 attestation** - you use a tool to [generate a certificate](tutorial-custom-hsm-enrollment-group-x509.md#create-an-x509-certificate-chain). Once generated, you create the certificate file required for use in enrollment. The SDK attestation logic also uses the certificate during registration, to present for authentication and enrollment verification.</li></ul> |
| Device | Bootup and register | This operation corresponds with the third phase of auto-provisioning, fulfilled by the device registration software built by the Developer. See the Developer role for details. Upon first boot: <ol><li>The application connects with the Device Provisioning Service instance, per the global URL and service "ID Scope" specified during development.</li><li>Once connected, the device is authenticated against the attestation method and identity specified during enrollment.</li><li>Once authenticated, the device is registered with the IoT Hub instance specified by the provisioning service instance.</li><li>Upon successful registration, a unique device ID and IoT Hub endpoint are returned to the registration application for communicating with IoT Hub.</li><li> From there, the device can pull down its initial [device twin](~/articles/iot-hub/iot-hub-devguide-device-twins.md) state for configuration, and begin the process of reporting telemetry data.</li></ol>**Quickstarts**: since the device is simulated, the registration software runs on your development workstation.|

The following diagram summarizes the roles and sequencing of operations during device auto-provisioning:
<br><br>
[![Auto-provisioning sequence for a device](./media/concepts-auto-provisioning/sequence-auto-provision-device-vs.png)](./media/concepts-auto-provisioning/sequence-auto-provision-device-vs.png#lightbox) 

> [!NOTE]
> Optionally, the manufacturer can also perform the "Enroll device identity" operation using Device Provisioning Service APIs (instead of via the Operator). For a detailed discussion of this sequencing and more, see the [Zero touch device registration with Azure IoT video](https://youtu.be/cSbDRNg72cU?t=2460) (starting at marker 41:00)

## Roles and Azure accounts

How each role is mapped to an Azure account is scenario-dependent, and there are quite a few scenarios that can be involved. The common patterns below should help provide a general understanding regarding how roles are generally mapped to an Azure account.

#### Chip manufacturer provides security services

In this scenario, the manufacturer manages security for level-one customers. This scenario may be preferred by these level-one customers as they don't have to manage detailed security. 

The manufacturer introduces security into Hardware Security Modules (HSMs). This security can include the manufacturer obtaining keys, certificates, etc. from potential customers who already have DPS instances and enrollment groups setup. The manufacturer could also generate this security information for its customers.

In this scenario, there may be two Azure accounts involved:

- **Account #1**: Likely shared across the operator and developer roles to some degree. This party may purchase the HSM chips from the manufacturer. These chips are pointed to DPS instances associated with the Account #1. With DPS enrollments, this party can lease devices to multiple level-two customers by reconfiguring the device enrollment settings in DPS. This party may also have IoT hubs allocated for end-user backend systems to interface with in order to access device telemetry etc. In this latter case, a second account may not be needed.

- **Account #2**: End users, level-two customers may have their own IoT hubs. The party associated with Account #1 just points leased devices to the correct hub in this account. This configuration requires linking DPS and IoT hubs across Azure accounts, which can be done with Azure Resource Manager templates.

#### All-in-one OEM

The manufacturer could be an "All-in-one OEM" where only a single manufacturer account would be needed. The manufacturer handles security and provisioning end to end.

The manufacturer may provide a cloud-based application to customers who purchase devices. This application would interface with the IoT Hub allocated by the manufacturer.

Vending machines or automated coffee machines represent examples for this scenario.




## Next steps

You may find it helpful to bookmark this article as a point of reference, as you work your way through the corresponding auto-provisioning Quickstarts. 

Begin by completing a "Set up auto-provisioning" Quickstart that best suits your management tool preference, which walks you through the "Service configuration" phase:

- [Set up auto-provisioning using Azure CLI](quick-setup-auto-provision-cli.md)
- [Set up auto-provisioning using the Azure portal](quick-setup-auto-provision.md)
- [Set up auto-provisioning using a Resource Manager template](quick-setup-auto-provision-rm.md)

Then continue with a "Provision a device" Quickstart that suits your device attestation mechanism and Device Provisioning Service SDK/language preference. In this Quickstart, you walk through the "Device enrollment" and "Device registration and configuration" phases: 

| Device attestation mechanism | Quickstart | 
| ------------------------------- | -------------------- |
| Symmetric key | [Provision a simulated symmetric key device](quick-create-simulated-device-symm-key.md) |
| X.509 certificate | [Provision a simulated X.509 device](quick-create-simulated-device-x509.md) |
| Simulated Trusted Platform Module (TPM) | [Provision a simulated TPM device](quick-create-simulated-device-tpm.md)|




