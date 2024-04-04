---
title: Configure OPC UA certificates infrastructure
description:  How to configure and manage the OPC UA certificates trust relationship in the context of OPC UA Broker
author: cristipogacean
ms.author: crpogace
ms.subservice: opcua-broker
ms.custom: devx-track-azurecli
ms.topic: how-to
ms.date: 03/01/2024

# CustomerIntent: As an industrial edge IT or operations user, I want to to understand how to manage the OPC UA Certificates
# in the context of OPC UA Broker.
---

# Configure OPC UA certificates infrastructure for Azure IoT OPC UA Broker Preview

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

In this article, you learn how to configure the OPC UA Certificates infrastructure for Azure IoT OPC UA Broker. This infrastructure provides you with control over which OPC UA servers in the field are trusted to securely establish a session and collect telemetry for your solution. In accord with the [OPC UA specification](https://reference.opcfoundation.org/), OPC UA Broker acts as a single UA application when it establishes secure communication to OPC UA servers. Azure IoT OPC UA Broker uses the same application instance certificate for all secure channels between itself and the OPC UA servers that it connects to.

## Prerequisites

Azure IoT Operations Preview installed. For more information, see [Quickstart: Deploy Azure IoT Operations – to an Arc-enabled Kubernetes cluster](../get-started/quickstart-deploy.md).

## Features supported
The following table shows the feature support level for authentication in the current version of OPC UA Broker:

| Features  | Meaning | Symbol |
|---------|---------|---------:|
| Configuration of OPC UA self-signed application instance certificate          | Supported   |   ✅     |
| Handling of OPC UA trusted certificates list                                  | Supported   |   ✅     |
| Handling of OPC UA issuer certificates lists                                  | Supported   |   ✅     |
| Configuration of OPC UA enterprise grade application instance certificate     | Supported   |   ✅     |
| Handling of OPC UA untrusted certificates                                     | Unsupported |   ❌     |
| Handling of OPC UA Global Discovery Service (GDS)                             | Unsupported |   ❌     |

## Configuration of a self-signed OPC UA application instance certificate

The default deployment of the OPC UA Broker installs all the resources needed by the Kubernetes [cert-manager](https://cert-manager.io/) to create an OPC UA compliant self-signed certificate. This certificate is stored in the `aio-opc-opcuabroker-default-application-cert` kubernetes secret. This secret is mapped into all the OPC UA connector kubernetes pods and acts as the OPC UA Client application instance certificate. Renewal of the application instance certificate is automatically done by the Kubernetes cert-manager.

This configuration is typically good enough to ensure a compliant and secure communication between your OPC UA-capable asset and OPC UA Broker for demonstration and testing purposes. For production purposes, you should use enterprise grade application instance certificates in your deployment.

## How to handle the OPC UA trusted certificates list

To connect to an asset, first you need to establish the application authentication mutual trust. For OPC UA Broker, do the following steps:

1. Get the OPC UA server application's instance certificate (public key only) in `*.der` or `*.crt` file format.

   Typically OPC UA servers have an interface that enables export of their application instance certificate. This interface isn't standardized. For servers like PTC KepWareEx, a Windows-based configuration UI is available for certificates management. Some other servers have a web interface while others use certain folders in the operating system to store the certificates. Refer to the user manual of your server to find out how to export the application instance certificate. After you have the certificate as a file, make sure it's either in *.der or *.crt (PEM) file format. If the certificate isn't in one of those formats, use tools like openssl to transform the certificate into the required *.der or *.crt file format.

1. Push the OPC UA Server's application instance certificate in Azure Key Vault as a secret.

    For `*.der` file format certificate file *./my-server.der* run the following command:

    ```bash
    # Upload my-server.der OPC UA Server's certificate as secret to Azure Key Vault
    az keyvault secret set \
      --name "my-server-der" \
      --vault-name <azure-key-vault-name> \
      --file ./my-server.der \
      --encoding hex \
      --content-type application/pkix-cert
    ```

    For `*.crt` file format (PEM) certificate file *./my-server.crt* run the following command:

    ```bash
    # Upload my-server.der OPC UA Server's certificate as secret to Azure Key Vault
    az keyvault secret set \
      --name "my-server-crt" \
      --vault-name <azure-key-vault-name> \
      --file ./my-server.crt \
      --encoding hex \
      --content-type application/x-pem-file
    ```

1. Configure the secret provider class (SPC) `aio-opc-ua-broker-trust-list` custom resource (CR) in the connected cluster. Use a K8s client such as kubectl to configure the secrets (`my-server-der` or `my-server-crt` in the following example) in the SPC object array in the connected cluster.

   The following example shows a complete SPC CR containing the trusted OPC UA server certificate in `*.der` file format configuration:

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
              objectName: my-server-der
              objectType: secret
              objectAlias: my-server.der
              objectEncoding: hex
    ```

   The following example shows a complete SPC CR containing the trusted OPC UA server certificate in `*.crt` file format configuration:

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
              objectName: my-server-crt
              objectType: secret
              objectAlias: my-server.crt
              objectEncoding: hex
    ```

    The projection of the Azure Key Vault secrets and certificates into the cluster takes some time depending on the configured polling interval.

If your OPC UA Server uses a certificate issued by a Certificate Authority (CA), you can trust the CA by adding its public key certificate to OPC UA Broker's trusted certificates list. This way your OPC UA Broker instance automatically trusts all the servers that use a valid certificate issued by the CA. In this case, you don't need to explicitly add the OPC UA Server's certificate to the OPC UA Broker's trusted certificates list.

To trust a CA, use the following configuration steps:

1. Get the CA certificate public key in `*.der` or `*.crt` file format. Get the CA's certificate revocation list (CRL) in `*.crl` file format. Consult the OPC UA Server's documentation to find the specific details.

1. Push the CA certificate and the CRL in Azure Key Vault as secrets.

    For `*.der` file format certificate file *./my-server-ca.der* run the following command:

    ```bash
    # Upload CA certificate as secret to Azure Key Vault
    az keyvault secret set \
      --name "my-server-ca-der" \
      --vault-name <azure-key-vault-name> \
      --file ./my-server-ca.der \
      --encoding hex \
      --content-type application/pkix-cert

    # Upload the CRT as secret to Azure Key Vault
    az keyvault secret set \
      --name "my-server-crl" \
      --vault-name <azure-key-vault-name> \
      --file ./my-server-ca.crl \
      --encoding hex \
      --content-type application/pkix-crl
    ```

    For `*.crt` file format (PEM) certificate file *./my-server-ca.crt* run the following command:

    ```bash
    # Upload CA certificate as secret to Azure Key Vault
    az keyvault secret set \
      --name "my-server-ca-crt" \
      --vault-name <azure-key-vault-name> \
      --file ./my-server-ca.crt \
      --encoding hex \
      --content-type application/x-pem-file

    # Upload the CRL as secret to Azure Key Vault
    az keyvault secret set \
      --name "my-server-crl" \
      --vault-name <azure-key-vault-name> \
      --file ./my-server-ca.crl \
      --encoding hex \
      --content-type application/pkix-crl
    ```

1. Configure the secret provider class (SPC) `aio-opc-ua-broker-trust-list` custom resource (CR) in the connected cluster. Use a K8s client such as kubectl to configure the secrets (`my-server-ca-der` or `my-server-ca-crt` in the following example) in the SPC object array in the connected cluster.

   The following example shows a complete SPC CR containing the trusted OPC UA server certificate in `*.der` file format configuration:

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
              objectName: my-server-ca-der
              objectType: secret
              objectAlias: my-server-ca.der
              objectEncoding: hex
            - |
              objectName: my-server-ca-crl
              objectType: secret
              objectAlias: my-server-ca.crl
              objectEncoding: hex
    ```

   The following example shows a complete SPC CR containing the trusted OPC UA server certificate in `*.crt` file format configuration:

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
              objectName: my-server-ca-crt
              objectType: secret
              objectAlias: my-server-ca.crt
              objectEncoding: hex
            - |
              objectName: my-server-ca-crl
              objectType: secret
              objectAlias: my-server-ca.crl
              objectEncoding: hex
    ```

    The projection of the Azure Key Vault secrets and certificates into the cluster takes some time depending on the configured polling interval.

## How to handle the OPC UA issuer certificates List

If your OPC UA server uses a certificate issued by a Certificate Authority (CA), but don't want to trust the CA, complete the following steps:

1. Trust the OPC UA server's application instance certificate following the first three steps in the previous section. 

1. Besides the certificate itself, the OPC UA Broker needs the CA certificate to properly validate the issuer chain of the OPC UA Server's certificate. You add the CA certificate and its CRL file to a separate list named  `aio-opc-ua-broker-issuer-list`.

    Push the CA certificate in Azure Key Vault as a secret.

    For `*.der` file format certificate file *./my-server-ca.der* run the following command:

    ```bash
    # Upload CA certificate as secret to Azure Key Vault
    az keyvault secret set \
      --name "my-server-ca-der" \
      --vault-name <azure-key-vault-name> \
      --file ./my-server-ca.der \
      --encoding hex \
      --content-type application/pkix-cert

    # Upload the CRT as secret to Azure Key Vault
    az keyvault secret set \
      --name "my-server-crl" \
      --vault-name <azure-key-vault-name> \
      --file ./my-server-ca.crl \
      --encoding hex \
      --content-type application/pkix-crl
    ```

    For `*.crt` file format (PEM) certificate file *./my-server-ca.crt* run the following command:

    ```bash
    # Upload CA certificate as secret to Azure Key Vault
    az keyvault secret set \
      --name "my-server-ca-crt" \
      --vault-name <azure-key-vault-name> \
      --file ./my-server-ca.crt \
      --encoding hex \
      --content-type application/x-pem-file

    # Upload the CRL as secret to Azure Key Vault
    az keyvault secret set \
      --name "my-server-crl" \
      --vault-name <azure-key-vault-name> \
      --file ./my-server-ca.crl \
      --encoding hex \
      --content-type application/pkix-crl
    ```

1. Configure the secret provider class (SPC) `aio-opc-ua-broker-issuer-list` custom resource (CR) in the connected cluster. Use a K8s client such as kubectl to configure the secrets (`my-server-ca-der` or `my-server-ca-crt` in the following example) in the SPC object array in the connected cluster.

   The following example shows a complete SPC CR containing the trusted OPC UA server certificate in `*.der` file format configuration:

    ```yml
    apiVersion: secrets-store.csi.x-k8s.io/v1
    kind: SecretProviderClass
    metadata:
      name: aio-opc-ua-broker-issuer-list
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
              objectName: my-server-ca-der
              objectType: secret
              objectAlias: my-server-ca.der
              objectEncoding: hex
            - |
              objectName: my-server-ca-crl
              objectType: secret
              objectAlias: my-server-ca.crl
              objectEncoding: hex
    ```

   The following example shows a complete SPC CR containing the trusted OPC UA server certificate in `*.crt` file format configuration:

    ```yml
    apiVersion: secrets-store.csi.x-k8s.io/v1
    kind: SecretProviderClass
    metadata:
      name: aio-opc-ua-broker-issuer-list
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
              objectName: my-server-ca-crt
              objectType: secret
              objectAlias: my-server-ca.crt
              objectEncoding: hex
            - |
              objectName: my-server-ca-crl
              objectType: secret
              objectAlias: my-server-ca.crl
              objectEncoding: hex
    ```

    The projection of the Azure Key Vault secrets and certificates into the cluster takes some time depending on the configured polling interval.

## Export OPC UA Broker application instance certificate and establish mutual trust with the OPC UA Server

After you trusted the OPC UA Server's certificate, you extract OPC UA Broker's certificate from the kubernetes secret and add it to the trusted certificates list of your OPC UA Server.

1. Extract OPC UA Broker's certificate into a `opcuabroker.crt` file:

    ```bash
    kubectl -n azure-iot-operations get secret aio-opc-opcuabroker-default-application-cert -o jsonpath='{.data.tls\.crt}' | base64 -d > opcuabroker.crt
    ```

    In PowerShell, you can complete the same task with the following command:

    ```powershell
    kubectl -n azure-iot-operations get secret aio-opc-opcuabroker-default-application-cert -o jsonpath='{.data.tls\.crt}' | %{ [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($_)) } > opcuabroker.crt
    ```

2. Many OPC UA Servers support certificates in `*.der` file format only. If necessary, use the following command to convert an extracted `opcuabroker.crt` certificate into `opcuabroker.der`:
    ```bash
    openssl x509 -outform der -in opcuabroker.crt -out opcuabroker.der
    ```

3. Consult the documentation of your OPC UA server and add the `opcuabroker.crt` or `opcuabroker.der` file to the trusted certificates.

## Configure OPC UA enterprise grade application instance certificate

For production environments, you can configure OPC UA Broker to use an enterprise grade application instance certificate. Typically an enterprise certificate authority (CA) issues this certificate, therefore you need the CA cert in your configuration. Often a hierarchy of CAs is involved. You need the complete validation chain of CAs for your configuration. 

The following code examples reference the following items:
- `opcuabroker-certificate.der` - the public key certificate of the enterprise grade application instance certificate file
- `opcuabroker-certificate.pem` - the private key certificate of the enterprise grade application instance certificate file
- `subjectName` - the subject name embedded in the application instance certificate in string format. The default value is: "CN=aio-opc-opcuabroker". Ideally the enterprise grade certificate is already generated with the default subject name
- `applicationUri` - the application instance uri that is embedded in the application instance certificate. The default value is: "urn:microsoft.com:aio:opc:opcuabroker". Ideally the enterprise grade certificate is already generated with the default application uri.
- `enterprise-grade-ca-1.der` - the public key certificate of the enterprise grade CA file
- `enterprise-grade-ca-1.crl` - the CA's certificate revocation list (CRL) file

For configuration of the enterprise grade application instance certificate, Azure Key Vault and CSI / secrets provider class(CSP) mechanism is used to project the certificates in your kubernetes cluster.

To configure your enterprise grade application instance certificate, complete the following steps. 

1. Push all the certificates and into Azure Key Vault by using the following commands:

   ```bash
    # Upload OPC UA Broker public key certificate as secret to Azure Key Vault
    az keyvault secret set \
      --name "opcuabroker-certificate-der" \
      --vault-name <azure-key-vault-name> \
      --file ./opcuabroker-certificate.der \
      --encoding hex \
      --content-type application/pkix-cert

    # Upload OPC UA Broker private key certificate as secret to Azure Key Vault
    az keyvault secret set \
      --name "opcuabroker-certificate-pem" \
      --vault-name <azure-key-vault-name> \
      --file ./opcuabroker-certificate.pem \
      --encoding hex \
      --content-type application/x-pem-file

    # Upload CA public key certificate as secret to Azure Key Vault
    az keyvault secret set \
      --name "enterprise-grade-ca-1-der" \
      --vault-name <azure-key-vault-name> \
      --file ./enterprise-grade-ca-1.der \
      --encoding hex \
      --content-type application/pkix-cert

    # Upload CA certificate revocation list as secret to Azure Key Vault
    az keyvault secret set \
      --name "enterprise-grade-ca-1-crl" \
      --vault-name <azure-key-vault-name> \
      --file ./enterprise-grade-ca-1.crl \
      --encoding hex \
      --content-type application/pkix-crl
    ```

1. Configure the secret provider class `aio-opc-ua-broker-client-certificate` custom resource (CR) in the connected cluster. Use a K8s client such as kubectl to configure the secrets `opcuabroker-certificate-der` and `opcuabroker-certificate-pem` in the SPC object array in the connected cluster.

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
              objectName: opcuabroker-certificate-der
              objectType: secret
              objectAlias: opcuabroker-certificate.der
              objectEncoding: hex
            - |
              objectName: opcuabroker-certificate-pem
              objectType: secret
              objectAlias: opcuabroker-certificate.pem
              objectEncoding: hex
    ```

1. If you use the CA, configure the secret provider class `aio-opc-ua-broker-issuer-list` custom resource (CR) in the connected cluster. Use a K8s client such as kubectl to configure the secrets `enterprise-grade-ca-1-der` and `enterprise-grade-ca-1-crl` in the SPC object array in the connected cluster.

    The following example shows a complete SPC CR after you added the secret configurations:
    ```yml
    apiVersion: secrets-store.csi.x-k8s.io/v1
    kind: SecretProviderClass
    metadata:
      name: aio-opc-ua-broker-issuer-list
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
              objectName: enterprise-grade-ca-1-der
              objectType: secret
              objectAlias: enterprise-grade-ca-1.der
              objectEncoding: hex
            - |
              objectName: enterprise-grade-ca-1-crl
              objectType: secret
              objectAlias: enterprise-grade-ca-1.crl
              objectEncoding: hex
    ```

1. Update OPC UA Broker's deployment to use the new CPS source for application instance certificates by using the following command:

    ```bash
    az k8s-extension update \
        --version 0.3.0-preview \
        --name opc-ua-broker \
        --release-train preview \
        --cluster-name <cluster-name> \
        --resource-group <azure-resource-group> \
        --cluster-type connectedClusters \
        --auto-upgrade-minor-version false \
        --config securityPki.applicationCert=aio-opc-ua-broker-client-certificate \
        --config securityPki.subjectName=<subjectName> \
        --config securityPki.applicationUri=<applicationUri>
    ```

Now that the enterprise certificate is used by the OPC UA Broker, don't forget to add the new certificate's public key in the trusted certificate lists of all OPC UA servers you need to connect to.

## Related content

- [Configure OPC UA authentication options](howto-configure-opcua-authentication-options.md)
