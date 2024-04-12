---
title: Configure an OPC PLC simulator
description: How to configure an OPC PLC simulator to work with Azure IoT OPC UA Broker.
author: timlt
ms.author: timlt
ms.subservice: opcua-broker
ms.topic: how-to
ms.date: 03/01/2024

# CustomerIntent: As a developer, I want to configure an OPC PLC simulator in my industrial edge environment to test the process of managing OPC UA assets connected to the simulator.
---

# Configure an OPC PLC simulator to work with Azure IoT OPC UA Broker Preview

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

In this article, you learn how to configure and connect to an OPC UA server simulator with different nodes that generate random data, anomalies, and configuration of user defined nodes. For developers, an OPC UA simulator enables you to test the process of managing OPC UA assets that are connected to the simulator.

## Prerequisites

Azure IoT Operations installed. For more information, see [Quickstart: Deploy Azure IoT Operations Preview to an Arc-enabled Kubernetes cluster](../get-started/quickstart-deploy.md). If you deploy Azure IoT Operations as described, the process installs an OPC PLC simulator.

## Deploy the OPC PLC simulator

This section shows how to deploy the OPC PLC simulator.

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

The OPC PLC OPC UA server should run in the same deployment as a separate pod.

## Configure OPC UA mutual trust between Azure Iot OPC UA Broker Preview and the OPC PLC

The application instance certificate of the OPC PLC is a self-signed certificate managed by cert-manager and stored in the `secret aio-opc-ua-opcplc-default-application-cert-000000` kubernetes secret.

1. Get the certificate, run the following commands on your cluster, and push it to Azure Key Vault.

    ```bash
    kubectl -n azure-iot-operations get secret aio-opc-ua-opcplc-default-application-cert-000000 -o jsonpath='{.data.tls\.crt}' | \
    xargs -I {} \
    az keyvault secret set \
        --name "opcplc-crt" \
        --vault-name <azure-key-vault-name> \
        --value {} \
        --encoding base64 \
        --content-type application/x-pem-file
    ```

2. Configure the secret provider class (SPC) `aio-opc-ua-broker-trust-list` custom resource (CR) in the connected cluster. Use a K8s client such as kubectl to configure the secret `opcplc.crt`  in the SPC object array in the connected cluster.

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
        keyvaultName: <azure-key-vault-name>
        tenantId: <azure-tenant-id>
        objects: |
          array:
            - |
              objectName: opcplc-crt
              objectType: secret
              objectAlias: opcplc.crt
              objectEncoding: hex
    ```

The projection of the Azure Key Vault secrets and certificates into the cluster takes some time depending on the configured polling interval.

Now, the Azure IoT OPC UA Broker the trust relationship with OPC PLC should be established and you can proceed to create an `AssetEndpointProfile` to connect to your OPC PLC simulation server.

## Optionally configure your `AssetEndpointProfile` without mutual trust established

You can optionally configure an asset endpoint profile for the OPC PLC to run without mutual trust established. If you understand the risks, you can turn off authentication for testing purposes.

> [!CAUTION]
> Don't configure for no authentication in production or pre-production. Exposing your cluster to the internet without authentication can lead to unauthorized access and even DDOS attacks.

To allow your asset endpoint profile to connect to any OPC PLC server without establishing mutual trust, use the `additionalConfiguration` setting to change the `AssetEndpointProfile` for OPC UA.

Patch the asset endpoint with `autoAcceptUntrustedServerCertificates=true`:

```bash
ENDPOINT_NAME=<name-of-you-endpoint-here>
kubectl patch AssetEndpointProfile $ENDPOINT_NAME \
-n azure-iot-operations \
--type=merge \
-p '{"spec":{"additionalConfiguration":"{\"applicationName\":\"'"$ENDPOINT_NAME"'\",\"security\":{\"autoAcceptUntrustedServerCertificates\":true}}"}}'
```

> [!WARNING]
> Don't use untrusted certificates in production environments.

## Related content

- [Autodetect assets using Azure IoT Akri Preview](howto-autodetect-opcua-assets-using-akri.md)
