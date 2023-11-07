---
title: Configure an OPC PLC simulator
description: How to configure an OPC PLC simulator 
author: timlt
ms.author: timlt
# ms.subservice: opcua-broker
ms.topic: how-to 
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

OPC UA transport authentication requires you to configure the following items:
- The OPC UA X.509 client transport certificate to be used for transport authentication and encryption.  Currently, this certificate is an application certificate used for all transport in OPC UA Broker.
- The private key to be used for the authentication and encryption.  Currently, password protected private key files aren't supported. 

In Azure IoT Digital Operations Experience, the first step to set up an asset endpoint requires you to configure the thumbprint of the transport certificate. The following code examples reference the certificate file *./secret/cert.der*.  

To complete the configuration of an asset endpoint in Operations Experience, do the following steps:

1. Configure the transport certificate and private key in Azure Key Vault. In the following example, the file *./secret/cert.der* contains the transport certificate and the file *./secret/cert.pem* contains the private key. 

    To configure the transport certificate, run the following commands: 

    
    ```bash
    # Upload cert.der Application certificate as secret to Azure Key Vault
    az keyvault secret set \
      --name "aio-opc-opcua-connector-der" \
      --vault-name <azure-key-vault-name> \
      --file ./secret/cert.der \
      --encoding hex \
      --content-type application/pkix-cert
    
    # Upload cert.pem private key as secret to Azure Key Vault
    az keyvault secret set \
      --name "aio-opc-opcua-connector-pem" \
      --vault-name <azure-key-vault-name> \
      --file ./secret/cert.pem \
      --encoding hex \
      --content-type application/x-pem-file
    ```
    
1. Configure the secret provider class `aio-opc-ua-broker-client-certificate` custom resource (CR) in the connected cluster. Use a K8s client such as kubectl to configure the secrets `aio-opc-opcua-connector-der` and `aio-opc-opcua-connector-pem` in the SPC object array in the connected cluster. 

    The following example shows a complete SPC CR after you added the secret configurations:

    
    ```yml
    apiVersion: secrets-store.csi.x-k8s.io/v1
    kind: SecretProviderClass
    metadata:
      name: aio-opc-ua-broker-client-certificate
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
              objectName: aio-opc-opcua-connector-der
              objectType: secret
              objectAlias: aio-opc-opcua-connector.der
              objectEncoding: hex
            - |
              objectName: aio-opc-opcua-connector-pem
              objectType: secret
              objectAlias: aio-opc-opcua-connector.pem
              objectEncoding: hex
    ```
    
    The projection of the Azure Key Vault secrets and certificates into the cluster takes some time depending on the configured polling interval. 

    > [!NOTE]
    > Currently, the secret for the private key does not support password protected key files yet. Also, OPC UA Broker uses the certificate for transport authentication for all secure connections. 


1. Optionally, rather than configure the secret provider class CR, you can configure a self-signed certificate for transport authentication. 

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

When you connect an OPC UA client (such as OPC UA Broker) to an OPC UA server, the OPC UA specification supports mutual authentication by using X.509 certificates. Mutual authentication requires you to configure the certificates before the connection is established. Otherwise, authentication fails with a certificate trust error. 

To configure OPC UA Broker with a trusted OPC UA server certificate, there are two requirements:
- The certificate should be configured for transport authentication as described previously. 
- The connection should be established.

To complete the configuration of mutual trust, do the following steps:  

1. To configure the trusted certificate file *./secret/my-server.der* in Azure Key Vault, run the following command:

    ```bash
    # Upload my-server.der OPC UA Server's certificate as secret to Azure Key Vault 
    az keyvault secret set \ 
      --name "my-server-der" \ 
      --vault-name <azure-key-vault-name> \ 
      --file ./secret/my-server.der \ 
      --encoding hex \ 
      --content-type application/pkix-cert
    ```

    Typically you can export the trusted certificate of the OPC UA server by using the OPC UA server's management console. For more information, please see the [OPC UA Server documentation](https://reference.opcfoundation.org/). 

1. Configure the secret provider class `aio-opc-ua-broker-client-certificate` CR in the connected cluster. Use a K8s client such as kubectl to configure the secrets (`my-server-der` in the following example) in the SPC object array in the connected cluster.

    The following example shows a complete SPC CR after you configure the required transport certificate and add the trusted OPC UA server certificate configuration:

    
    ```yml
    apiVersion: secrets-store.csi.x-k8s.io/v1 
    kind: SecretProviderClass 
    metadata: 
      name: aio-opc-ua-broker-client-certificate 
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
              objectName: aio-opc-opcua-connector-der 
              objectType: secret 
              objectAlias: aio-opc-opcua-connector.der 
              objectEncoding: hex 
            - | 
              objectName: aio-opc-opcua-connector-pem 
              objectType: secret 
              objectAlias: aio-opc-opcua-connector.pem 
              objectEncoding: hex 
              | 
              objectName: my-server-der 
              objectType: secret 
              objectAlias: my-server.der 
              objectEncoding: hex
    ```
    
    The projection of the Azure Key Vault secrets and certificates into the cluster takes some time depending on the configured polling interval. 

## Optionally configure for no authentication

You can optionally configure an OPC PLC to run with no authentication. In general you shouldn't turn off TLS and authentication in production.

> [!CAUTION]
> Don't configure for no authentication in production or pre-production. Exposing your cluster to the internet without authentication can lead to unauthorized access and even DDOS attacks.

However, if you understand the risks and need to use an insecure port in a well-controlled environment, you can turn off authentication for testing purposes. 

To run an OPC PLC with no security profile, you can manually adjust the `AssetEndpointProfile` for OPC UA with the `additionalConfiguration` setting.  

Configure the setting as shown in the following example JSON code:

```json
"security": {
        "autoAcceptUntrustedServerCertificates": true
         }
```

## Related content

- [Autodetect assets using Azure IoT Akri Preview](howto-autodetect-opcua-assets-using-akri.md)