---
title: Encrypt internal traffic for the Azure IoT Operations MQTT broker
description: Learn how to configure encryption of broker internal traffic and internal certificates for the Azure IoT Operations MQTT broker.
author: PatAltimore
ms.author: patricka
ms.topic: how-to
ms.service: azure-iot-operations
ms.subservice: azure-mqtt-broker
ms.date: 11/04/2024

#CustomerIntent: As an operator, I want to configure MQTT broker so that I can encrypt internal communication and data.
---

# Configure encryption of broker internal traffic and internal certificates

Ensuring the security of internal communications within your infrastructure is important for maintaining data integrity and confidentiality. You can configure the MQTT broker to encrypt internal traffic and data. Encryption certificates are automatically managed using credential manager.

## Encrypt internal traffic

> [!IMPORTANT]
> This setting requires modifying the Broker resource and can only be configured at initial deployment time using the Azure CLI or Azure Portal. A new deployment is required if Broker configuration changes are needed. To learn more, see [Customize default Broker](./overview-broker.md#customize-default-broker).

The **encrypt internal traffic** feature is used to encrypt the internal traffic between the MQTT broker frontend and backend pods. To use this feature, cert-manager, which is installed by default when using the Azure IoT Operations, is required.

The benefits include:

- **Secure internal traffic**: All internal traffic between the frontend and backend pods is encrypted.

- **Secure data at rest**: All data at rest is encrypted.

- **Secure data in transit**: All data in transit is encrypted.

- **Secure data in memory**: All data in memory is encrypted.

- **Secure data in the message buffer**: All data in the message buffer is encrypted.

- **Secure data in the message buffer on disk**: All data in the [message buffer on disk](./howto-disk-backed-message-buffer.md) is encrypted.

By default, encrypting internal traffic enabled. To mitigate security threats, we recommend that you keep the encryption enabled. However, disabling the encryption can improve the performance of the MQTT broker, which can be useful in IoT deployments with high throughput requirements. 

To disable the encryption, change the `advanced.encryptInternalTraffic` setting in the Broker resource. Currently, disabling encryption is only supported using the `--broker-config-file` flag when you deploy the Azure IoT Operations using the `az iot ops create` command. 

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