---
title: Configure an OPC PLC simulator
description: How to configure an OPC PLC simulator
author: timlt
ms.author: timlt
ms.subservice: opcua-broker
ms.topic: how-to
ms.custom:
  - ignite-2023
ms.date: 11/6/2023

# CustomerIntent: As a developer, I want to configure an OPC PLC simulator in my
# industrial edge environment to test the process of managing OPC UA assets connected to the simulator.
---

# Configure an OPC PLC simulator

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

In this article, you learn how to implement an OPC UA server simulator with different nodes that generate random data, anomalies and configuration of user defined nodes. For developers, an OPC UA simulator enables you to test the process of managing OPC UA assets that are connected to the simulator. 

## Prerequisites

Azure IoT Operations Preview installed. For more information, see [Quickstart: Deploy Azure IoT Operations – to an Arc-enabled Kubernetes cluster](../get-started/quickstart-deploy.md). If you deploy Azure IoT Operations as described, the process installs an OPC PLC simulator.

## Get the certificate of the OPC PLC simulator
If you deploy Azure IoT Operations with the OPC PLC simulator enabled, you can get the certificate of the PLC named `simulationPlc`.  By getting the certificate, you can run the simulator with mutual trust.  

To get the certificate, run the following commands on your cluster:

```bash
# Copy the public cert of the simulationPlc in the cluster to a local folder 

OPC_PLC_POD=$(kubectl get pod -l app.kubernetes.io/name=opcplc -n azure-iot-operations -o jsonpath="{.items[0].metadata.name}")  
SERVER_CERT=$(kubectl exec $OPC_PLC_POD -n azure-iot-operations -- ls /app/pki/own/certs) 
kubectl cp azure-iot-operations/${OPC_PLC_POD}:/app/pki/own/certs/${SERVER_CERT} my-server.der
```

## Configure OPC UA transport authentication
After you get the simulator's certificate, the next step is to configure authentication. 

1. To complete this configuration, follow the steps in [Configure OPC UA transport authentication](howto-configure-opcua-authentication-options.md#configure-opc-ua-transport-authentication).

1. Optionally, rather than configure a secret provider class CR, you can configure a self-signed certificate for transport authentication. 

    To create a self-signed certificate to test transport authentication, run the following command:
    
    ```bash
    # Create cert.pem and key.pem
    openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -sha256 -days 365 -nodes \
    -subj "/CN=opcuabroker/O=Microsoft" \
    -addext "subjectAltName=URI:urn:microsoft.com:opc:ua:broker" \
    -addext "keyUsage=critical, nonRepudiation, digitalSignature, keyEncipherment, dataEncipherment, keyCertSign" \
    -addext "extendedKeyUsage = critical, serverAuth, clientAuth" \
    -addext "basicConstraints=CA:FALSE"
    ```
    
## Configure OPC UA mutual trust
Another OPC UA authentication option you can configure is mutual trust. In OPC UA communication, the OPC UA client and server both confirm the identity of each other. 

To complete this configuration, follow the steps in [Configure OPC UA mutual trust](howto-configure-opcua-authentication-options.md#configure-opc-ua-mutual-trust).

## Optionally configure for no authentication

You can optionally configure an OPC PLC to run with no authentication. If you understand the risks, you can turn off authentication for testing purposes. 

> [!CAUTION]
> Don't configure for no authentication in production or pre-production. Exposing your cluster to the internet without authentication can lead to unauthorized access and even DDOS attacks.

To run an OPC PLC with no security profile, you can manually adjust the `AssetEndpointProfile` for OPC UA with the `additionalConfiguration` setting.  

Configure the setting as shown in the following example JSON code:

```json
"security": {
        "autoAcceptUntrustedServerCertificates": true
         }
```

## Related content

- [Autodetect assets using Azure IoT Akri Preview](howto-autodetect-opcua-assets-using-akri.md)
