---
title: Configure OPC UA certificates
description:  How to configure and manage the OPC UA certificates trust relationship in the context of OPC UA Broker
author: dominicbetts
ms.author: dobett
ms.subservice: opcua-broker
ms.custom: devx-track-azurecli
ms.topic: how-to
ms.date: 05/15/2024

# CustomerIntent: As an industrial edge IT or operations user, I want to to understand how to manage the OPC UA Certificates in the context of OPC UA Broker.
---

# Configure OPC UA certificates infrastructure for Azure IoT OPC UA Broker Preview

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

In this article, you learn how to configure the OPC UA certificates infrastructure for Azure IoT OPC UA Broker. This configuration lets you determine which OPC UA servers you trust to securely establish a session with.

Based on the [OPC UA specification](https://reference.opcfoundation.org/), OPC UA Broker acts as a single OPC UA application when it establishes secure communications with OPC UA servers. Azure IoT OPC UA Broker uses the same application instance certificate for all secure channels it opens to your OPC UA servers.

To learn more, see [OPC UA certificates infrastructure for Azure IoT OPC UA Broker Preview](overview-opcua-broker-certificates-management.md).

## Prerequisites

A deployed instance of Azure IoT Operations Preview. To deploy Azure IoT Operations for demonstration and exploration purposes, see [Quickstart: Deploy Azure IoT Operations – to an Arc-enabled Kubernetes cluster](../get-started/quickstart-deploy.md).

## Configure a self-signed application instance certificate

The default deployment of the OPC UA Broker installs all the resources needed by [cert-manager](https://cert-manager.io/) to create an OPC UA compliant self-signed certificate. This certificate is stored in the `aio-opc-opcuabroker-default-application-cert` secret. This secret is mapped into all the OPC UA connector pods and acts as the OPC UA client application instance certificate. `cert-manager` handles the automatic renewal of this application instance certificate.

This configuration is typically sufficient for compliant and secure communication between your OPC UA servers and OPC UA Broker in a demonstration or exploration environment. For a production environment, use enterprise grade application instance certificates in your deployment.

## Configure the trusted certificates list

To connect to an asset, first you need to establish the application authentication mutual trust. For OPC UA Broker, complete the following steps:

1. Get the OPC UA server application's instance certificate as a file. These files typically have a .der or .crt extension. This is the public key only.

    > [!TIP]
    > Typically, an OPC UA server has an interface that lets you export its application instance certificate. This interface isn't standardized. For servers such as KEPServerEx, there's a Windows-based configuration UI for certificates management. Other servers might have a web interface or use operating system folders to store the certificates. Refer to the user manual of your server to find out how to export the application instance certificate. After you have the certificate, make sure it's either DER or PEM encoded. Typically stored in files with either the .der or .crt extension. If the certificate isn't in one of those file formats, use a tool such as `openssl` to transform the certificate into the required format.

1. Save the OPC UA server's application instance certificate in Azure Key Vault as a secret.

    For a DER encoded certificate in a file such as *./my-server.der*, run the following command:

    ```azcli
    # Upload my-server.der OPC UA Server's certificate as secret to Azure Key Vault
    az keyvault secret set \
      --name "my-server-der" \
      --vault-name <your-azure-key-vault-name> \
      --file ./my-server.der \
      --encoding hex \
      --content-type application/pkix-cert
    ```

    For a PEM encoded certificate in a file such as *./my-server.crt*, run the following command:

    ```azcli
    # Upload my-server.crt OPC UA Server's certificate as secret to Azure Key Vault
    az keyvault secret set \
      --name "my-server-crt" \
      --vault-name <your-azure-key-vault-name> \
      --file ./my-server.crt \
      --encoding hex \
      --content-type application/x-pem-file
    ```

1. Configure the `aio-opc-ua-broker-trust-list` custom resource in the cluster. Use a Kubernetes client such as `kubectl` to configure the secrets, such as `my-server-der` or `my-server-crt`, in the `SecretProviderClass` object array in the cluster.

    The following example shows a complete `SecretProviderClass` custom resource that contains the trusted OPC UA server certificate in a DER encoded file:

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
              objectName: my-server-der
              objectType: secret
              objectAlias: my-server.der
              objectEncoding: hex
    ```

    The following example shows a complete `SecretProviderClass` custom resource that contains the trusted OPC UA server certificate in a PEM encoded file with the .crt extension:

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
              objectName: my-server-crt
              objectType: secret
              objectAlias: my-server.crt
              objectEncoding: hex
    ```

    > [!NOTE]
    > The time it takes to project Azure Key Vault certificates into the cluster depends on the configured polling interval.

If your OPC UA Server uses a certificate issued by a certificate authority (CA), you can trust the CA by adding its public key certificate to OPC UA Broker trusted certificates list. The OPC UA Broker instance now automatically trusts all the servers that use a valid certificate issued by the CA. Therefore, you don't need to explicitly add the OPC UA server's certificate to the OPC UA Broker trusted certificates list.

To trust a CA, complete the following steps:

1. Get the CA certificate public key encode in DER or PEM format. These certificates are typically stored in files with either the .der or .crt extension. Get the CA's certificate revocation list (CRL). This list is typically in a file with the .crl. Check the documentation for your OPC UA server for details.

1. Save the CA certificate and the CRL in Azure Key Vault as secrets.

    For a DER encoded certificate in a file such as *./my-server-ca.der*, run the following commands:

    ```azcli
    # Upload CA certificate as secret to Azure Key Vault
    az keyvault secret set \
      --name "my-server-ca-der" \
      --vault-name <your-azure-key-vault-name> \
      --file ./my-server-ca.der \
      --encoding hex \
      --content-type application/pkix-cert

    # Upload the CRL as secret to Azure Key Vault
    az keyvault secret set \
      --name "my-server-crl" \
      --vault-name <your-azure-key-vault-name> \
      --file ./my-server-ca.crl \
      --encoding hex \
      --content-type application/pkix-crl
    ```

    For a PEM encoded certificate in a file such as *./my-server-ca.crt*, run the following commands:

    ```azcli
    # Upload CA certificate as secret to Azure Key Vault
    az keyvault secret set \
      --name "my-server-ca-crt" \
      --vault-name <your-azure-key-vault-name> \
      --file ./my-server-ca.crt \
      --encoding hex \
      --content-type application/x-pem-file

    # Upload the CRL as secret to Azure Key Vault
    az keyvault secret set \
      --name "my-server-crl" \
      --vault-name <your-azure-key-vault-name> \
      --file ./my-server-ca.crl \
      --encoding hex \
      --content-type application/pkix-crl
    ```

1. Configure the `aio-opc-ua-broker-trust-list` custom resource in the cluster. Use a Kubernetes client such as `kubectl` to configure the secrets, such as `my-server-ca-der` or `my-server-ca-crt`, in the `SecretProviderClass` object array in the cluster.

    The following example shows a complete `SecretProviderClass` custom resource that contains the trusted OPC UA server certificate in a DER encoded file:

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

    The following example shows a complete `SecretProviderClass` custom resource that contains the trusted OPC UA server certificate in a PEM encoded file with the .crt extension:

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

    > [!NOTE]
    > The time it takes to project Azure Key Vault certificates into the cluster depends on the configured polling interval.

## Configure the issuer certificates list

If your OPC UA server uses a certificate issued by a certificate authority (CA), but you don't want to trust all certificates issued by the CA, complete the following steps:

1. Trust the OPC UA server's application instance certificate by following the first three steps in the previous section.

1. Besides the certificate itself, OPC UA Broker needs the CA certificate to properly validate the issuer chain of the OPC UA server's certificate. Add the CA certificate and its certificate revocation list (CRL) to a separate list called `aio-opc-ua-broker-issuer-list`.

    1. Save the CA certificate and the CRL in Azure Key Vault as secrets.

        For a DER encoded certificate in a file such as *./my-server-ca.der*, run the following commands:

        ```azcli
        # Upload CA certificate as secret to Azure Key Vault
        az keyvault secret set \
          --name "my-server-ca-der" \
          --vault-name <your-azure-key-vault-name> \
          --file ./my-server-ca.der \
          --encoding hex \
          --content-type application/pkix-cert
    
        # Upload the CRL as secret to Azure Key Vault
        az keyvault secret set \
          --name "my-server-crl" \
          --vault-name <your-azure-key-vault-name> \
          --file ./my-server-ca.crl \
          --encoding hex \
          --content-type application/pkix-crl
        ```

        For a PEM encoded certificate in a file such as *./my-server-ca.crt*, run the following commands:

        ```azcli
        # Upload CA certificate as secret to Azure Key Vault
        az keyvault secret set \
          --name "my-server-ca-crt" \
          --vault-name <your-azure-key-vault-name> \
          --file ./my-server-ca.crt \
          --encoding hex \
          --content-type application/x-pem-file
    
        # Upload the CRL as secret to Azure Key Vault
        az keyvault secret set \
          --name "my-server-crl" \
          --vault-name <your-azure-key-vault-name> \
          --file ./my-server-ca.crl \
          --encoding hex \
          --content-type application/pkix-crl
        ```

1. Configure the `aio-opc-ua-broker-issuer-list` custom resource in the cluster. Use a Kubernetes client such as `kubectl` to configure the secrets, such as `my-server-ca-der` or `my-server-ca-crt`, in the `SecretProviderClass` object array in the cluster.

    The following example shows a complete `SecretProviderClass` custom resource that contains the trusted OPC UA server certificate in a DER encoded file:

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
        keyvaultName: <your-azure-key-vault-name>
        tenantId: <your-azure-tenant-id>
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

    The following example shows a complete `SecretProviderClass` custom resource that contains the trusted OPC UA server certificate in a PEM encoded file with the .crt extension:

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
        keyvaultName: <your-azure-key-vault-name>
        tenantId: <your-azure-tenant-id>
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

    > [!NOTE]
    > The time it takes to project Azure Key Vault certificates into the cluster depends on the configured polling interval.

## Configure your OPC UA server

To complete the configuration of the application authentication mutual trust, you need to configure your OPC UA server to trust the OPC UA Broker's application instance certificate:

1. To extract OPC UA Broker's certificate into a `opcuabroker.crt` file, run the following command:

    ```bash
    kubectl -n azure-iot-operations get secret aio-opc-opcuabroker-default-application-cert -o jsonpath='{.data.tls\.crt}' | base64 -d > opcuabroker.crt
    ```

    In PowerShell, you can complete the same task with the following command:

    ```powershell
    kubectl -n azure-iot-operations get secret aio-opc-opcuabroker-default-application-cert -o jsonpath='{.data.tls\.crt}' | %{ [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($_)) } > opcuabroker.crt
    ```

1. Many OPC UA servers only support certificates in the DER format. If necessary, use the following command to convert the _opcuabroker.crt_ certificate to _opcuabroker.der_:

    ```bash
    openssl x509 -outform der -in opcuabroker.crt -out opcuabroker.der
    ```

1. Consult the documentation of your OPC UA server to learn how to add the `opcuabroker.crt` or `opcuabroker.der` certificate file to the server's trusted certificates list.

## Configure an enterprise grade application instance certificate

For production environments, you can configure OPC UA Broker to use an enterprise grade application instance certificate. Typically, an enterprise certificate authority (CA) issues this certificate and you need the CA certificate to your configuration. Often, there's a hierarchy of CAs and you need to add the complete validation chain of CAs to your configuration.

The following example references the following items:

| Item | Description |
| ---- | ----------- |
| _opcuabroker-certificate.der_ | File that contains the enterprise grade application instance certificate public key. |
| _opcuabroker-certificate.pem_ | File that contains the enterprise grade application instance certificate private key. |
| `subjectName`                 | The subject name string embedded in the application instance certificate. |
| `applicationUri`              | The application instance URI embedded in the application instance. |
| _enterprise-grade-ca-1.der_   | File that contains the enterprise grade CA certificate public key. |
| _enterprise-grade-ca-1.crl_   | The CA's certificate revocation list (CRL) file. |

Like the previous examples, you use Azure Key Vault to store the certificates and CRLs. You then configure the `SecretProviderClass` custom resources in the connected cluster to project the certificates and CRLs into the OPC UA Broker pods. To configure the enterprise grade application instance certificate, complete the following steps:

1. Save the certificates and the CRL in Azure Key Vault as secrets by using the following commands:

   ```azcli
    # Upload OPC UA Broker public key certificate as secret to Azure Key Vault
    az keyvault secret set \
      --name "opcuabroker-certificate-der" \
      --vault-name <your-azure-key-vault-name> \
      --file ./opcuabroker-certificate.der \
      --encoding hex \
      --content-type application/pkix-cert

    # Upload OPC UA Broker private key certificate as secret to Azure Key Vault
    az keyvault secret set \
      --name "opcuabroker-certificate-pem" \
      --vault-name <your-azure-key-vault-name> \
      --file ./opcuabroker-certificate.pem \
      --encoding hex \
      --content-type application/x-pem-file

    # Upload CA public key certificate as secret to Azure Key Vault
    az keyvault secret set \
      --name "enterprise-grade-ca-1-der" \
      --vault-name <your-azure-key-vault-name> \
      --file ./enterprise-grade-ca-1.der \
      --encoding hex \
      --content-type application/pkix-cert

    # Upload CA certificate revocation list as secret to Azure Key Vault
    az keyvault secret set \
      --name "enterprise-grade-ca-1-crl" \
      --vault-name <your-azure-key-vault-name> \
      --file ./enterprise-grade-ca-1.crl \
      --encoding hex \
      --content-type application/pkix-crl
    ```

1. Configure the `aio-opc-ua-broker-client-certificate` custom resource in the cluster. Use a Kubernetes client such as `kubectl` to configure the secrets `opcuabroker-certificate-der` and `opcuabroker-certificate-pem` in the `SecretProviderClass` object array in the cluster.

    The following example shows a complete `SecretProviderClass` custom resource after you add the secret configurations:

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
        keyvaultName: <your-azure-key-vault-name>
        tenantId: <your-azure-tenant-id>
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

1. If you use the CA to issue certificates for your OPC UA servers, configure `aio-opc-ua-broker-issuer-list` custom resource in the cluster. Use a Kubernetes client such as `kubectl` to configure the secrets `enterprise-grade-ca-1-der` and `enterprise-grade-ca-1-crl` in the `SecretProviderClass` object array in the cluster.

    The following example shows a complete `SecretProviderClass` custom resource after you add the secret configurations:

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
        keyvaultName: <your-azure-key-vault-name>
        tenantId: <your-azure-tenant-id>
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

1. Update the OPC UA Broker deployment to use the new `SecretProviderClass` source for application instance certificates by using the following command:

    ```azcli
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

Now that the OPC UA Broker uses the enterprise certificate, don't forget to add the new certificate's public key to the trusted certificate lists of all OPC UA servers it needs to connect to.
