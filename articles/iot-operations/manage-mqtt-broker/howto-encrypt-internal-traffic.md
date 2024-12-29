---
title: Encrypt internal traffic for the Azure IoT Operations MQTT broker
description: Learn how to configure encryption of broker internal traffic and internal certificates for the Azure IoT Operations MQTT broker.
author: PatAltimore
ms.author: patricka
ms.topic: how-to
ms.service: azure-iot-operations
ms.subservice: azure-mqtt-broker
ms.date: 11/12/2024

#CustomerIntent: As an operator, I want to configure MQTT broker so that I can encrypt internal communication and data.
---

# Configure encryption of broker internal traffic and internal certificates

Ensuring the security of internal communications within your infrastructure is important for maintaining data integrity and confidentiality. You can configure the MQTT broker to encrypt internal traffic and data. Encryption certificates are automatically managed using credential manager.

## Encrypt internal traffic

> [!IMPORTANT]
> This setting requires modifying the Broker resource and can only be configured at initial deployment time using the Azure CLI or Azure Portal. A new deployment is required if Broker configuration changes are needed. To learn more, see [Customize default Broker](./overview-broker.md#customize-default-broker).

The **encrypt internal traffic** feature is used to encrypt the internal traffic in transit between the MQTT broker frontend and backend pods. It's enabled by default when you deploy Azure IoT Operations.

To disable encryption, modify the `advanced.encryptInternalTraffic` setting in the Broker resource. This can only be done using the `--broker-config-file` flag during the deployment of Azure IoT Operations with the `az iot ops create` command.

> [!CAUTION]
> Disabling encryption can improve MQTT broker performance. However, to protect against security threats like man-in-the-middle attacks, we strongly recommend keeping this setting enabled. Only disable encryption in controlled non-production environments for testing.

```json
{
  "advanced": {
    "encryptInternalTraffic": "Disabled"
  }
}
```

Then, deploy Azure IoT Operations using the `az iot ops create` command with the `--broker-config-file` flag, like the following command (other parameters omitted for brevity):

```azurecli
az iot ops create ... --broker-config-file <FILE>.json
```

## Internal certificates

When encryption is enabled, the broker uses cert-manager to generate and manage the certificates used for encrypting the internal traffic. Cert-manager automatically renews certificates when they expire. You can configure the certificate settings, like duration, when to renew, and private key algorithm in the Broker resource. Currently, changing the certificate settings are only supported using the `--broker-config-file` flag when you deploy the Azure IoT Operations using the `az iot ops create` command.

For example, to set the certificate duration to 240 hours, renew before 45 minutes, and private key algorithm to RSA 2048, prepare a Broker config file in JSON format:

```json
{
  "advanced": {
    "encryptInternalTraffic": "Enabled", 
    "internalCerts": {
      "duration": "240h",
      "renewBefore": "45m",
      "privateKey": {
        "algorithm": "Rsa2048",
        "rotationPolicy": "Always"
      }
    }
  }
}
```

Then, deploy Azure IoT Operations using the `az iot ops create` command with the `--broker-config-file <FILE>.json`.

To learn more, see [Azure CLI support for advanced MQTT broker configuration](https://aka.ms/aziotops-broker-config) and [Broker examples](/rest/api/iotoperations/broker/create-or-update#examples).

## Next steps

- [Configure broker listeners](./howto-configure-brokerlistener.md)