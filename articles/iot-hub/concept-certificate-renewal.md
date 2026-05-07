---
title: Certificate Renewal in Azure IoT Hub Certificate Management (Preview)
titleSuffix: Azure IoT Hub
description: Learn how certificate renewal works in Azure IoT Hub certificate management, including when to renew, how the renewal flow works, and how devices can track certificate expiration.
author: sethmanheim
ms.author: sethm
ms.service: azure-iot-hub
services: iot-hub
ms.topic: concept-article
ai-usage: ai-generated
ms.date: 03/20/2026
#Customer intent: As an IoT developer or administrator, I want to understand how certificate renewal works in Azure IoT Hub certificate management so I can keep my devices connected without interruption.
---

# Certificate renewal in Azure IoT Hub certificate management (preview)

Certificate renewal is the process where an already provisioned device requests and receives a new operational certificate for its existing device identity. Renewal is used to replace certificates that are nearing expiration or have expired. The device remains provisioned with the same identity; only the operational certificate is updated. Each IoT device must track certificate expiration and initiate a renewal before expiration. This article explains when to renew, the available renewal paths, how to track expiration, and what to do if a certificate expires.

[!INCLUDE [iot-hub-public-preview-banner](includes/public-preview-banner.md)]

## When devices need to renew

Certificate management issues operational certificates with a validity period that you set when you configure the policy in Azure Device Registry (ADR). The validity period ranges from 7 to 90 days. 

Short-lived certificates improve security because they reduce exposure time if a certificate is compromised. Each device must start renewal before its current operational certificate expires to keep connectivity to IoT Hub. Plan renewal before the expiration date. Add renewal logic to your device firmware or application so it sends a renewal request when the certificate reaches a set percentage of its validity period, such as 80 percent.

## How renewal works

You can renew an operational certificate in either of these ways:

- **Repeat certificate issuance through DPS**: The device starts a new Device Provisioning Service (DPS) registration, uses its onboarding credential, and submits a new certificate signing request (CSR). This path follows the same flow as initial certificate issuance. For more information, see [Device certificate issuance in Azure IoT Hub certificate management](concept-certificate-issuance.md).

- **Submit a new CSR directly to IoT Hub**: The device submits the CSR to IoT Hub over MQTT. IoT Hub handles the renewal request, coordinates with ADR to get a new operational certificate, and publish the renewal response. For more information, see [Renew a device certificate (operational certificate)](iot-mqtt-connect-to-iot-hub.md#renew-a-device-certificate-operational-certificate).

In both paths, the device should detect when renewal is needed, generate a new key pair to produce the CSR, replace the local certificate, and reconnect with the new certificate.

## Track certificate expiration on devices

Each device must track expiration for its operational certificate. Certificate management doesn't send automatic renewal notifications to devices. The operational certificate includes `Valid from` and `Valid until` fields. The device can read these fields to determine when the certificate expires and when to start renewal.

Your device firmware or application code must:

1. Read the `Valid until` field from the certificate after each successful provisioning.
1. Calculate the time remaining before expiration.
1. Trigger a renewal request before the certificate expires, either by reprovisioning through DPS or by submitting a new CSR directly to IoT Hub.

## Reporting certificate expiration with device twins

During public preview, devices should use [device twin reported properties](iot-hub-devguide-device-twins.md#device-twins) to report the `Valid from` and `Valid until` dates of the current operational certificate. These reported properties support fleet-wide visibility, such as dashboards that show devices with certificates close to expiration.

The following example shows a reported properties structure:

```json
{
  "reported": {
    "certificate": {
      "validFrom": "2026-03-01T00:00:00Z",
      "validUntil": "2026-03-31T00:00:00Z"
    }
  }
}
```

After devices report these properties, you can use the [IoT Hub query language](iot-hub-devguide-query-language.md) to identify devices across your fleet that require renewal.

## What happens when a certificate expires

If a device doesn't renew its certificate before expiration, it loses the ability to authenticate with IoT Hub. IoT Hub rejects connections from devices that present expired certificates. 

To recover a device with an expired certificate, the device must be re-provisioned using Device Provisioning Service:

1. Confirm that the device still has its onboarding credential. This credential is used for initial provisioning, such as a symmetric key or TPM.
1. Have the device initiate a new registration call to DPS that includes a new CSR.

1. DPS issues a fresh operational certificate through ADR by using the same CSR-based provisioning flow.
1. The device connects to IoT Hub with the new certificate.

If a device loses its onboarding credential and its operational certificate expires, you must reprovision the device with a new onboarding credential through your organization's device management workflow.

## Relationship to certificate revocation

Certificate renewal addresses expiration and is separate from certificate revocation. Revocation is a security action that invalidates a device certificate before expiration. After revocation, the device must obtain a new certificate again, through DPS reprovisioning and the same CSR-based issuance flow. For more information about revocation, see [Certificate revocation and policy management concepts](concepts-certificate-policy-management.md).

To remove access for a device that uses an X.509 operational certificate without revocation, you can disable the device in IoT Hub. For more information, see [Disable or delete a device](create-connect-device.md#disable-or-delete-a-device).

## Related content

- [Certificate issuance in Azure IoT Hub certificate management](concept-certificate-issuance.md)
- [Certificate revocation and policy management concepts](concepts-certificate-policy-management.md)
- [Key concepts for certificate management](iot-hub-certificate-management-concepts.md)
- [What is certificate management (preview)?](iot-hub-certificate-management-overview.md)
- [Device twins in Azure IoT Hub](iot-hub-devguide-device-twins.md)
- [Deploy Azure IoT Hub with ADR integration and certificate management](iot-hub-device-registry-setup.md)

