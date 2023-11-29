---
title: Configure OPC UA authentication options
titleSuffix: Azure IoT OPC UA Broker
description: How to configure OPC UA authentication options to use with Azure IoT OPC UA Broker
author: timlt
ms.author: timlt
ms.subservice: opcua-broker
ms.topic: how-to
ms.custom: ignite-2023, devx-track-azurecli
ms.date: 11/6/2023

# CustomerIntent: As a user in IT, operations, or development, I want to configure my OPC UA industrial edge environment
# with custom authentication options to keep it secure and work with my solution.
---

# Configure OPC UA authentication options

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

In this article, you learn how to configure several OPC UA authentication options. These options provide more control over your OPC UA authentication, and let you configure authentication in a way that makes sense for your solution. 

You can configure OPC UA authentication for the following areas:
- **Transport authentication**. In accord with the [OPC UA specification](https://reference.opcfoundation.org/), OPC UA Broker acts as a single UA application when it establishes secure communication to OPC UA servers. Azure IoT OPC UA Broker (preview) uses the same client certificate for all secure channels between itself and the OPC UA servers that it connects to.
- **User authentication**. When a session is established on the secure communication channel, OPC UA server requires it to authenticate as a user.

## Prerequisites

Azure IoT Operations Preview installed. For more information, see [Quickstart: Deploy Azure IoT Operations – to an Arc-enabled Kubernetes cluster](../get-started/quickstart-deploy.md). 

## Features supported
The following table shows the feature support level for authentication in the current version of OPC UA Broker: 

| Features  | Meaning | Symbol | 
|---------|---------|---------:|
| Configuration of OPC UA transport authentication                              | Supported   |   ✅     |
| Configuration of OPC UA mutual trust                                          | Supported   |   ✅     |
| Configuration of OPC UA user authentication with username and password        | Supported   |   ✅     |
| Creating a self-signed certificate for transport authorization                | Supported   |   ✅     |
| Configuration of OPC UA user authentication with an X.509 user certificate	  | Unsupported |   ❌     |
| Configuration of OPC UA issuer and trust lists                                | Unsupported |   ❌     |

## Configure OPC UA transport authentication
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

## Configure OPC UA mutual trust
When you connect an OPC UA client (such as OPC UA Broker) to an OPC UA server, the OPC UA specification supports mutual authentication by using X.509 certificates. Mutual authentication requires you to configure the certificates before the connection is established. Otherwise, authentication fails with a certificate trust error. 

The provisioning on the OPC UA server depends on the OPC UA Server system that you use. For OPC UA servers like PTC KepWareEx, the Windows UI of the KepWareEx lets you manage and register the certificates to be used in operation. 

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

## Configure OPC UA user authentication with username and password
If an OPC UA Server requires user authentication with username and password, you can select that option in Operations Experience, and configure the secrets references for the username and password. 

Before you can configure secrets for the username and password, you need to complete two more configuration steps:

1. Configure the username and password in Azure Key Vault. In the following example, use the `username` and `password` as secret references for the configuration in Operations Experience.

    > [!NOTE]
    > Replace the values in the example for user (*user1*) and password (*password*) with the actual credentials used in the OPC UA server to connect.


    To configure the username and password, run the following code:

    ```bash
    # Create username Secret in Azure Key Vault
      az keyvault secret set --name "username" --vault-name <azure-key-vault-name> --value "user1" --content-type "text/plain"
        
    # Create password Secret in Azure Key Vault
      az keyvault secret set --name "password" --vault-name <azure-key-vault-name> --value "password" --content-type "text/plain"
    ```

1. Configure the secret provider class `aio-opc-ua-broker-user-authentication` custom resource (CR) in the connected cluster. Use a K8s client such as kubectl to configure the secrets (`username` and `password`, in the following example) in the SPC object array in the connected cluster.

    The following example shows a complete SPC CR after you add the secret configurations:

    ```yml
    apiVersion: secrets-store.csi.x-k8s.io/v1
    kind: SecretProviderClass
    metadata:
      name: aio-opc-ua-broker-user-authentication
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
              objectName: username
              objectType: secret
              objectVersion: ""
            - |
              objectName: password
              objectType: secret
              objectVersion: ""
    ```
   
    The projection of the Azure Key Vault secrets and certificates into the cluster takes some time depending on the configured polling interval. 

## Create a self-signed certificate for transport authorization
Optionally, rather than configure the secret provider class CR, you can configure a self-signed certificate for transport authentication.

To create a self-signed certificate for transport authentication, run the following commands:

```bash
# Create cert.pem and key.pem
  openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -sha256 -days 365 -nodes \
    -subj "/CN=opcuabroker/O=Microsoft" \
    -addext "subjectAltName=URI:urn:microsoft.com:opc:ua:broker" \
    -addext "keyUsage=critical, nonRepudiation, digitalSignature, keyEncipherment, dataEncipherment, keyCertSign" \
    -addext "extendedKeyUsage = critical, serverAuth, clientAuth" \
    -addext "basicConstraints=CA:FALSE"

  mkdir secret

  # Transform cert.pem to cert.der
  openssl x509 -outform der -in cert.pem -out secret/cert.der

  # Rename key.pem to cert.pem as the private key needs to have the same file name as the certificate
  cp key.pem secret/cert.pem

  # Get thumbprint of the certificate
  Thumbprint ="$(openssl dgst -sha1 -hex  secret/cert.der | cut -d' ' -f2)"
  echo “Use the following thumbprint when configuring the Asset endpoint in the DOE portal:”
  echo $Thumbprint
```

## Related content

- [Configure an OPC PLC simulator](howto-configure-opc-plc-simulator.md)
