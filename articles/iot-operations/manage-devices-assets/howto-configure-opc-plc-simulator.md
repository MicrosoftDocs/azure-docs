---
title: Configure an OPC PLC simulator
description: How to configure an OPC PLC simulator
author: timlt
ms.author: timlt
ms.subservice: opcua-broker
ms.topic: how-to
ms.date: 03/01/2024

# CustomerIntent: As a developer, I want to configure an OPC PLC simulator in my
# industrial edge environment to test the process of managing OPC UA assets connected to the simulator.
---

# Configure an OPC PLC simulator

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

In this article, you learn how to configure and connect to an OPC UA server simulator with different nodes that generate random data, anomalies, and configuration of user defined nodes. For developers, an OPC UA simulator enables you to test the process of managing OPC UA assets that are connected to the simulator.

## Prerequisites

Azure IoT Operations installed. For more information, see [Quickstart: Deploy Azure IoT Operations – to an Arc-enabled Kubernetes cluster](../get-started/quickstart-deploy.md). If you deploy Azure IoT Operations as described, the process installs an OPC PLC simulator.

## Deploy the OPC PLC simulator

This section shows how to deploy the OPC PLC simulator. 

> [!IMPORTANT]
> Don't use the following example in production, use it for simulation and test purposes only. The example lowers the security level for the OPC PLC so that it accepts connections from any client without an explicit peer certificate trust operation.

Run the following code to update the OPC UA Broker deployment and apply the new settings:

```bash
az k8s-extension update \
    --version 0.3.0-preview \
    --name opc-ua-broker \
    --release-train preview \
    --cluster-name <cluster-name> \
    --resource-group <azure-resource-group> \
    --cluster-type connectedClusters \
    --auto-upgrade-minor-version false \
    --config opcPlcSimulation.deploy=true \
    --config opcPlcSimulation.autoAcceptUntrustedCertificates=true
```

The OPC PLC OPC UA server should run in the same deployment as a separate pod.

## Get the certificate of the OPC PLC simulator
The application instance certificate of the OPC PLC is a self-signed certificate managed by cert-manager and stored in the `secret aio-opc-ua-opcplc-default-application-cert-000000` kubernetes secret.

To get the certificate, run the following commands on your cluster:

```bash
# extract the public key of the opc plc from the kubernetes secret
kubectl -n azure-iot-operations get secret aio-opc-ua-opcplc-default-application-cert-000000 -o jsonpath='{.data.tls\.crt}' | base64 -d > opcplc.crt

# optionally transform the certificate in *.der format
openssl x509 -outform der -in opcplc.crt -out opcplc.der
```

## Configure OPC UA mutual trust
The next step in OPC UA authentication is to configure mutual trust. In OPC UA communication, the OPC UA client and server authenticate each other.

To complete this configuration, follow the steps to [configure mutual trust](howto-configure-opcua-certificates-infrastructure.md#how-to-handle-the-opc-ua-trusted-certificates-list). Use the certificate file you extracted in the previous section. 

For simplicity, on the OPC PLC you don't need to do a mutual trust action. Mutual trust is configured with `autoAcceptUntrustedCertificates`, which accepts connections from any OPC UA client.

## Optionally configure for no authentication

You can optionally configure an asset endpoint profile for the OPC PLC to run without mutual trust established. If you understand the risks, you can turn off authentication for testing purposes.

> [!CAUTION]
> Don't configure for no authentication in production or pre-production. Exposing your cluster to the internet without authentication can lead to unauthorized access and even DDOS attacks.

To allow your asset endpoint profile to connect to any OPC PLC server without establishing mutual trust, use the `additionalConfiguration` setting to change the `AssetEndpointProfile` for OPC UA.

Configure the setting as shown in the following example JSON code:

```json
"security": {
        "autoAcceptUntrustedServerCertificates": true
         }
```

## Related content

- [Autodetect assets using Azure IoT Akri Preview](howto-autodetect-opcua-assets-using-akri.md)
