---
title: Configure an OPC PLC simulator
description: How to configure the OPC PLC simulator to work with Azure IoT OPC UA Broker. The simulator generates sample data for testing and development purposes.
author: dominicbetts
ms.author: dobett
ms.subservice: opcua-broker
ms.topic: how-to
ms.date: 05/16/2024

# CustomerIntent: As a developer, I want to configure an OPC PLC simulator in my industrial edge environment to test the process of managing OPC UA assets connected to the simulator.
---

# Configure the OPC PLC simulator to work with Azure IoT OPC UA Broker Preview

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

In this article, you learn how to configure and connect the OPC PLC simulator. The simulator simulates an OPC UA server with multiple nodes that generate random data and anomalies. You can configure user defined nodes. The OPC UA simulator lets you test the process of managing OPC UA assets with the [Azure IoT Operations (preview) portal](howto-manage-assets-remotely.md) or [Azure IoT Akri Preview](overview-akri.md).

## Prerequisites

A deployed instance of Azure IoT Operations Preview. To deploy Azure IoT Operations for demonstration and exploration purposes, see [Quickstart: Deploy Azure IoT Operations – to an Arc-enabled Kubernetes cluster](../get-started/quickstart-deploy.md). If you deploy Azure IoT Operations as described, the installation includes the OPC PLC simulator.

## Deploy the OPC PLC simulator

This section shows how to deploy the OPC PLC simulator if you didn't include it when you first deployed Azure IoT Operations.

The following step lowers the security level for the OPC PLC so that it accepts connections from Azure Iot OPC UA Broker or any client without an explicit peer certificate trust operation.

> [!IMPORTANT]
> Don't use the following example in production, use it for simulation and test purposes only.

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

The OPC PLC simulator runs as a separate pod in the `azure-iot-operations` namespace. The pod name looks like `opcplc-000000-7b6447f99c-mqwdq`.

## Configure mutual trust between Azure Iot OPC UA Broker and the OPC PLC

To learn more about mutual trust in OPC UA, see [OPC UA certificates infrastructure for Azure IoT OPC UA Broker](overview-opcua-broker-certificates-management.md).

The application instance certificate of the OPC PLC simulator is a self-signed certificate managed by [cert-manager](https://cert-manager.io/) and stored in the `aio-opc-ua-opcplc-default-application-cert-000000` Kubernetes secret.

To configure mutual trust between Azure Iot OPC UA Broker and the OPC PLC simulator:

1. Get the certificate and push it to Azure Key Vault:

    ```bash
    kubectl -n azure-iot-operations get secret aio-opc-ua-opcplc-default-application-cert-000000 -o jsonpath='{.data.tls\.crt}' | \
    base64 -d | \
    xargs -0 -I {} \
    az keyvault secret set \
        --name "opcplc-crt" \
        --vault-name <your-azure-key-vault-name> \
        --value {} \
        --content-type application/x-pem-file
    ```

1. Add the certificate to the `aio-opc-ua-broker-trust-list` custom resource in the cluster. Use a Kubernetes client such as `kubectl` to configure the `opcplc.crt` secret in the `SecretProviderClass` object array in the cluster.

    The following example shows a complete `SecretProviderClass` custom resource that contains the simulator certificate in a PEM encoded file with the .crt extension:

    ```yml
    apiVersion: secrets-store.csi.x-k8s.io/v1
    kind: SecretProviderClass
    metadata:
      name: aio-opc-ua-broker-trust-list
      namespace: azure-iot-operations
    spec:
      provider: azure
      parameters:
        usePodIdentity: 'false'
        keyvaultName: <your-azure-key-vault-name>
        tenantId: <your-azure-tenant-id>
        objects: |
          array:
            - |
              objectName: opcplc-crt
              objectType: secret
              objectAlias: opcplc.crt
    ```

    > [!NOTE]
    > The time it takes to project Azure Key Vault certificates into the cluster depends on the configured polling interval.

The Azure IoT OPC UA Broker trust relationship with OPC PLC simulator is now established and you can create an `AssetEndpointProfile` to connect to your OPC PLC simulator.

## Optionally configure your `AssetEndpointProfile` without mutual trust established

Optionally, you can configure an asset endpoint profile without establishing mutual trust between OPC UA Broker and the OPC PLC simulator. If you understand the risks, you can turn off authentication for testing purposes.

> [!CAUTION]
> Don't configure for no authentication in production or pre-production environments. Exposing your cluster to the internet without authentication can lead to unauthorized access and even DDOS attacks.

To allow your asset endpoint profile to connect to an OPC PLC server without establishing mutual trust, use the `additionalConfiguration` setting to modify the `AssetEndpointProfile` configuration.

Patch the asset endpoint with `autoAcceptUntrustedServerCertificates=true`:

```bash
ENDPOINT_NAME=<name-of-you-endpoint-here>
kubectl patch AssetEndpointProfile $ENDPOINT_NAME \
-n azure-iot-operations \
--type=merge \
-p '{"spec":{"additionalConfiguration":"{\"applicationName\":\"'"$ENDPOINT_NAME"'\",\"security\":{\"autoAcceptUntrustedServerCertificates\":true}}"}}'
```

## Related content

- [OPC UA certificates infrastructure for Azure IoT OPC UA Broker Preview](overview-opcua-broker-certificates-management.md)
- [Autodetect assets using Azure IoT Akri Preview](howto-autodetect-opcua-assets-using-akri.md)
