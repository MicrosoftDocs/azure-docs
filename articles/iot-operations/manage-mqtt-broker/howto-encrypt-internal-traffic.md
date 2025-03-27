---
title: Encrypt internal traffic for the Azure IoT Operations MQTT broker
description: Learn how to configure encryption of broker internal traffic and internal certificates for the Azure IoT Operations MQTT broker.
author: PatAltimore
ms.author: patricka
ms.topic: how-to
ms.service: azure-iot-operations
ms.subservice: azure-mqtt-broker
ms.date: 11/12/2024

#CustomerIntent: As an operator, I want to configure an MQTT broker so that I can encrypt internal communication and data.
---

# Configure encryption of broker internal traffic and internal certificates

Ensuring the security of internal communications within your infrastructure is important to maintain data integrity and confidentiality. You can configure the MQTT broker to encrypt internal traffic and data. Encryption certificates are automatically managed by using the credential manager.

## Encrypt internal traffic

> [!IMPORTANT]
> This setting requires that you modify the Broker resource. It's configured only at initial deployment by using the Azure CLI or the Azure portal. A new deployment is required if Broker configuration changes are needed. To learn more, see [Customize default Broker](./overview-broker.md#customize-default-broker).

The **encrypt internal traffic** feature is used to encrypt the internal traffic in transit between the MQTT broker frontend and backend pods. It's enabled by default when you deploy Azure IoT Operations.

To disable encryption, modify the `advanced.encryptInternalTraffic` setting in the Broker resource. You can do this step only by using the `--broker-config-file` flag during the deployment of IoT Operations with the `az iot ops create` command.

> [!CAUTION]
> Disabling encryption can improve MQTT broker performance. To protect against security threats like man-in-the-middle attacks, we strongly recommend that you keep this setting enabled. Disable encryption only in controlled nonproduction environments for testing.

```json
{
  "advanced": {
    "encryptInternalTraffic": "Disabled"
  }
}
```

Then, deploy IoT Operations by using the `az iot ops create` command with the `--broker-config-file` flag, like the following command. (Other parameters are omitted for brevity.)

```azurecli
az iot ops create ... --broker-config-file <FILE>.json
```

## Internal certificates

When encryption is enabled, the MQTT broker uses cert-manager to generate and manage the certificates used for encrypting the internal traffic. Cert-manager automatically renews certificates when they expire. You can configure certificate settings like duration, when to renew, and the private key algorithm in the Broker resource. Currently, changing the certificate settings is supported only by using the `--broker-config-file` flag when you deploy IoT Operations by using the `az iot ops create` command.

For example, to set the certificate `duration` to 240 hours, the `renewBefore` time to 45 minutes, and the `privateKey` `algorithm` to RSA 2048, prepare a Broker configuration file in JSON format:

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

Then, deploy IoT Operations by using the `az iot ops create` command with `--broker-config-file <FILE>.json`.

To learn more, see [Azure CLI support for advanced MQTT broker configuration](https://aka.ms/aziotops-broker-config) and [Broker examples](/rest/api/iotoperations/broker/create-or-update#examples).

## Related content

- [Configure broker listeners](./howto-configure-brokerlistener.md)