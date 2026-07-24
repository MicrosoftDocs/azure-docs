---
title: Deployment planning - Internal traffic encryption
description: Plan internal traffic encryption settings for your Azure IoT Operations MQTT broker before deployment.
author: dominicbetts
ms.author: dobett
ms.topic: concept-article
ms.service: azure-iot-operations
ms.date: 04/21/2026
ai-usage: ai-assisted
#customer intent: As an IT administrator, I want to understand internal traffic encryption options so I can decide whether to change the defaults before deploying Azure IoT Operations.
---

# Deployment planning - Internal traffic encryption

Internal traffic encryption is a security feature that encrypts communication between MQTT broker frontend and backend pods. Decide before deployment whether you need to change the default internal traffic encryption settings.

> [!IMPORTANT]
> This setting requires that you modify the Broker resource. It's configured only at initial deployment by using the Azure CLI or the Azure portal. A new deployment is required if Broker configuration changes are needed. To learn more, see [Customize default Broker](../manage-mqtt-broker/overview-broker.md#customize-default-broker).

The **encrypt internal traffic** feature is used to encrypt the internal traffic in transit between the MQTT broker frontend and backend pods. It's enabled by default when you deploy Azure IoT Operations.

To disable encryption, modify the `advanced.encryptInternalTraffic` setting in the Broker resource. You can do this step only by using the `--broker-config-file` flag during the deployment of IoT Operations with the `az iot ops create` command. For more information, see [Azure CLI support for advanced MQTT broker configuration](https://aka.ms/aziotops-broker-config).

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

## Configure internal certificates

When encryption is enabled, the MQTT broker uses [cert-manager](https://cert-manager.io/docs/) to generate and manage the certificates used for encrypting the internal traffic. Cert-manager automatically renews certificates when they expire. You can configure certificate settings like duration, when to renew, and the private key algorithm in the Broker resource. Currently, changing the certificate settings is supported only by using the `--broker-config-file` flag when you deploy IoT Operations by using the `az iot ops create` command.

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

## Next steps

- [Review advanced MQTT options](deployment-planning-mqtt-options.md)
- [Review diagnostics settings](deployment-planning-diagnostics.md)
- [Prepare your cluster](../deploy-iot-ops/howto-prepare-cluster.md)
