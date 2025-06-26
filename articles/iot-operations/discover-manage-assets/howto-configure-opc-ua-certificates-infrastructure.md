---
title: Configure OPC UA certificates
description:  How to configure and manage the OPC UA certificates trust relationship in the context of the connector for OPC UA
author: dominicbetts
ms.author: dobett
ms.subservice: azure-opcua-connector
ms.custom: devx-track-azurecli
ms.topic: how-to
ms.date: 05/12/2025

# CustomerIntent: As an industrial edge IT or operations user, I want to to understand how to manage the OPC UA Certificates in the context of the connector for OPC UA.
ms.service: azure-iot-operations
---

# Configure OPC UA certificates infrastructure for the connector for OPC UA

In this article, you learn how to configure the OPC UA certificates infrastructure for the connector for OPC UA. This configuration lets you determine which OPC UA servers you trust to securely establish a session with.

Based on the [OPC UA specification](https://reference.opcfoundation.org/), the connector for OPC UA acts as a single OPC UA application when it establishes secure communications with OPC UA servers. The connector for OPC UA uses the same application instance certificate for all secure channels it opens to your OPC UA servers.

The connector for OPC UA must trust the OPC UA servers it connects to. The connector maintains a list of trusted certificates. To learn more, see:

- [Manage certificates for your Azure IoT Operations deployment](../secure-iot-ops/howto-manage-certificates.md) - this article describes how Azure IoT Operations uses Azure Key Vault to manage certificates.
- [OPC UA certificates infrastructure for the connector for OPC UA](overview-opcua-broker-certificates-management.md) - this article describes the roles of the trusted certificates list and issuer certificates list.

## Prerequisites

- An Azure IoT Operations instance deployed with secure settings. If you deployed Azure IoT Operations with test settings, you need to first [enable secure settings](../deploy-iot-ops/howto-enable-secure-settings.md).

## Configure a self-signed application instance certificate for the connector for OPC UA

The default deployment of the connector for OPC UA installs all the resources needed by [cert-manager](https://cert-manager.io/) to create an OPC UA compliant self-signed certificate. This certificate is stored in the `aio-opc-opcuabroker-default-application-cert` secret. This secret is mapped into all the connector for OPC UA pods and acts as the OPC UA client application instance certificate. `cert-manager` handles the automatic renewal of this application instance certificate.

This configuration is typically sufficient for compliant and secure communication between your OPC UA servers and the connector for OPC UA in a demonstration or exploration environment. For a production environment, use [enterprise grade application instance certificates](#configure-an-enterprise-grade-application-instance-certificate) in your deployment.

## Configure the trusted certificates list

To connect to an OPC UA server, first you need to establish the application authentication mutual trust. To configure the trusted certificates list of the servers you want the connector for OPC UA to connect to:

# [Operations experience](#tab/portal)

To use the operations experience web UI to manage the trusted certificates list, complete the following steps:

1. Get the OPC UA server application's instance certificate as a file. These files typically have a `.der` or `.crt` extension. This file contains the public key only.

    > [!TIP]
    > Typically, an OPC UA server has an interface that lets you export its application instance certificate. This interface isn't standardized. For servers such as KEPServerEx, there's a Windows-based configuration UI for certificates management. Other servers might have a web interface or use operating system folders to store the certificates. To find out how to export the application instance certificate, refer to the user manual of your server. After you have the certificate, make sure it's either DER or PEM encoded. These certificates are typically stored in files with either the `.der` or `.crt` extension. If the certificate isn't in one of those file formats, use a tool such as `openssl` to transform the certificate into the required format.

1. You can add the certificate directly to your Azure Key Vault as a secret and import from there, or you can upload the certificate to the trusted certificates list using the operations experience.

    > [!NOTE]
    > The connector for OPC UA uses a Kubernetes native secret named *aio-opc-ua-broker-trust-list* to store the trusted certificates list. This secret is created when you deploy Azure IoT Operations.

1. Go to the **Asset endpoints page** in the [operations experience](https://iotoperations.azure.com) web UI.

1. To view the trusted certificates list, select **Manage certificates and secrets** and then **Certificates**:

    :::image type="content" source="media/howto-configure-opc-ua-certificates-infrastructure/view-trusted-certificates.png" lightbox="media/howto-configure-opc-ua-certificates-infrastructure/view-trusted-certificates.png" alt-text="Screenshot of operations experience showing certificate upload page for the trusted certificates list.":::

1. You can upload a certificate file from your local machine or add one that you previously added as a secret in your Azure Key Vault:

    :::image type="content" source="media/howto-configure-opc-ua-certificates-infrastructure/successful-certificate-upload.png" lightbox="media/howto-configure-opc-ua-certificates-infrastructure/successful-certificate-upload.png" alt-text="Screenshot of operations experience showing successfully uploaded certificate.":::

1. Select **Apply** to save the changes. The certificate is now added to the trusted certificates list. If you upload the certificate, it's automatically added to your Azure Key Vault as a secret.

If your OPC UA server uses a certificate issued by a certificate authority (CA), you can trust the CA by adding its public key certificate to the trusted certificates list. The connector for OPC UA now automatically trusts all the servers that use a valid certificate issued by the CA. Therefore, you don't need to explicitly add the OPC UA server's certificate to the connector for OPC UA trusted certificates list. Currently, you can't use the operations experience to add a certificate revocation list to the trusted certificates list.

> [!TIP]
> To add a new certificate in the operations experience, you must be assigned to the **Key Vault Secrets Officer** role for your Azure Key Vault.

> [!IMPORTANT]
> If you're adding a certificate from Azure Key Vault, it must be stored as a secret and not as a certificate.

# [Azure CLI](#tab/cli)

To use the Azure CLI to manage the trusted certificates list, complete the following steps:

1. Get the OPC UA server application's instance certificate as a file. These files typically have a `.der` or `.crt` extension. This file contains the public key only.

    > [!TIP]
    > Typically, an OPC UA server has an interface that lets you export its application instance certificate. This interface isn't standardized. For servers such as KEPServerEx, there's a Windows-based configuration UI for certificates management. Other servers might have a web interface or use operating system folders to store the certificates. To find out how to export the application instance certificate, refer to the user manual of your server. After you have the certificate, make sure it's either DER or PEM encoded. These certificates are typically stored in files with either the `.der` or `.crt` extension. If the certificate isn't in one of those file formats, use a tool such as `openssl` to transform the certificate into the required format.

1. Add the OPC UA server's application instance certificate to the trusted certificates list. This list is implemented as a Kubernetes native secret named *aio-opc-ua-broker-trust-list* that's created when you deploy Azure IoT Operations.

    For a DER encoded certificate in a file such as *./my-server.der*, run the following command:

    ```azurecli
    # Append my-server.der OPC UA server certificate to the trusted certificate list secret as a new entry
    az iot ops connector opcua trust add --instance <your instance name> --resource-group <your resource group> --certificate-file "./my-server.der"
    ```

    For a PEM encoded certificate in a file such as *./my-server.crt*, run the following command:

    ```azurecli
    # Append my-server.crt OPC UA server certificate to the trusted certificate list secret as a new entry
    az iot ops connector opcua trust add --instance <your instance name> --resource-group <your resource group> --certificate-file "./my-server.crt"
    ```

If your OPC UA server uses a certificate issued by a certificate authority (CA), you can trust the CA by adding its public key certificate to the connector for OPC UA trusted certificates list. The connector for OPC UA now automatically trusts all the servers that use a valid certificate issued by the CA. Therefore, you don't need to explicitly add the OPC UA server's certificate to the connector for OPC UA trusted certificates list.

To trust a CA, complete the following steps:

1. Get the CA certificate public key encode in DER or PEM format. These certificates are typically stored in files with either the `.der` or `.crt` extension. Get the CA's CRL. This list is typically in a file with the .crl. Check the documentation for your OPC UA server for details.

1. Save the CA certificate and the CRL in the *aio-opc-ua-broker-trust-list* Kubernetes native secret:

    For a DER encoded CA certificate in a file such as *./my-server-ca.der*, run the following commands:

    ```bash
    # Append CA certificate to the trusted certificate list secret as a new entry
    az iot ops connector opcua trust add --instance <your instance name> --resource-group <your resource group> --certificate-file "./my-server-ca.der"

    # Append the CRL to the trusted certificate list secret as a new entry
    data=$(kubectl create secret generic temp --from-file= my-server-ca.crl=./ my-server-ca.crl --dry-run=client -o jsonpath='{.data}')
    kubectl patch secret aio-opc-ua-broker-trust-list -n azure-iot-operations -p "{`"data`": $data}"
    ```

    ```powershell
    # Append CA certificate to the trusted certificate list secret as a new entry
    az iot ops connector opcua trust add --instance <your instance name> --resource-group <your resource group> --certificate-file "./my-server-ca.der"

    # Append the CRL to the trusted certificate list secret as a new entry
    $data = kubectl create secret generic temp --from-file=my-server-ca.crl=./my-server-ca.crl --dry-run=client -o jsonpath='{.data}'
    kubectl patch secret aio-opc-ua-broker-trust-list -n azure-iot-operations -p "{`"data`": $data}"
    ```

    For a PEM encoded CA certificate in a file such as *./my-server-ca.crt*, run the following commands:

    ```bash
    # Append CA certificate to the trusted certificate list secret as a new entry
    az iot ops connector opcua trust add --instance <your instance name> --resource-group <your resource group> --certificate-file "./my-server-ca.crt"

    # Append the CRL to the trusted certificates list secret as a new entry
    data=$(kubectl create secret generic temp --from-file=my-server-ca.crl=./my-server-ca.crl --dry-run=client -o jsonpath='{.data}')
    kubectl patch secret aio-opc-ua-broker-trust-list -n azure-iot-operations -p "{`"data`": $data}"
    ```

    ```powershell
    # Append CA certificate to the trusted certificate list secret as a new entry
    az iot ops connector opcua trust add --instance <your instance name> --resource-group <your resource group> --certificate-file "./my-server-ca.crt"

    # Append the CRL to the trusted certificate list secret as a new entry
    $data = kubectl create secret generic temp --from-file=my-server-ca.crl=./my-server-ca.crl --dry-run=client -o jsonpath='{.data}'
    kubectl patch secret aio-opc-ua-broker-trust-list -n azure-iot-operations -p "{`"data`": $data}"
    ```

---

## Configure the issuer certificates list

If your OPC UA server uses a certificate issued by a CA, but you don't want to trust all certificates issued by the CA, configure the issuer certificates list:

# [Operations experience](#tab/portal)

Before you can configure the issuer certificates list with your intermediate certificates, you need to add the CA certificate to the trusted certificates list. The connector for OPC UA uses the CA certificate to validate the issuer chain of the OPC UA server's certificate.

To use the operations experience web UI to manage the issuer certificates list, complete the following steps:

1. Get the issuer certificate that was used to sign your server instance certificates as a file. These files typically have a `.der` or `.crt` extension. This file contains the public key only. You might also have a .crl file (certificate revocation list) for the issuer certificate.

1. You can add the issuer certificate directly to your Azure Key Vault as a secret and import from there, or you can upload the certificate and certificate revocation list (.crl file) to the issuer certificates list using the operations experience.

    > [!NOTE]
    > The connector for OPC UA uses a Kubernetes native secret named *aio-opc-ua-broker-issuer-list* to store the issuer certificates list. This secret is created when you deploy Azure IoT Operations.

1. Go to the **Asset endpoints page** in the [operations experience](https://iotoperations.azure.com) web UI.

1. To view the issuer certificates list, select **Manage certificates and secrets** and then **Certificates**:

    :::image type="content" source="media/howto-configure-opc-ua-certificates-infrastructure/upload-issuer-certificate.png" lightbox="media/howto-configure-opc-ua-certificates-infrastructure/upload-issuer-certificate.png" alt-text="Screenshot of operations experience showing certificate upload page for the issuer certificates list.":::

1. You can upload an issuer certificate file from your local machine or add one that you previously added as a secret in your Azure Key Vault:

    :::image type="content" source="media/howto-configure-opc-ua-certificates-infrastructure/successful-issuer-upload.png" lightbox="media/howto-configure-opc-ua-certificates-infrastructure/successful-issuer-upload.png" alt-text="Screenshot of operations experience showing successfully uploaded issuer certificate.":::

1. Select **Apply** to save the changes. The certificate is now added to the issuer certificates list. If you upload the certificate, it's automatically added to your Azure Key Vault as a secret.

You can also use the operations experience to add a certificate revocation list (.crl file) to the trusted certificates list.

> [!TIP]
> To add a new certificate in the operations experience, you must be assigned to the **Key Vault Secrets Officer** role for your Azure Key Vault.

> [!IMPORTANT]
> If you're adding a certificate from Azure Key Vault, it must be stored as a secret and not as a certificate.

# [Azure CLI](#tab/cli)

Before you can configure the issuer certificates list with your intermediate certificates, you need to add the CA certificate to the trusted certificates list. The connector for OPC UA uses the CA certificate to validate the issuer chain of the OPC UA server's certificate.

To use the Azure CLI to manage the issuer certificates list, complete the following steps:

- Save the CA certificate and the CRL in the `aio-opc-ua-broker-issuer-list` secret:

    ```azurecli
    # Append CA certificate to the issuer list secret as a new entry
    az iot ops connector opcua issuer add --instance <your instance name> --resource-group <your resource group> --certificate-file "./my-server-ca.der"

    # Append the CRL to the issuer list secret as a new entry
    az iot ops connector opcua issuer add --instance <your instance name> --resource-group <your resource group> --certificate-file "./my-server-ca.crl"
    ```

    For a PEM encoded certificate in a file such as *./my-server-ca.crt*, run the following commands:

    ```azurecli
    # Append CA certificate to the issuer list secret as a new entry
    az iot ops connector opcua issuer add --instance <your instance name> --resource-group <your resource group> --certificate-file "./my-server-ca.crt"

    # Append the CRL to the issuer list secret as a new entry
    az iot ops connector opcua issuer add --instance <your instance name> --resource-group <your resource group> --certificate-file "./my-server-ca.crl"
    ```

---

## Configure your OPC UA server

To complete the configuration of the application authentication mutual trust, you need to configure your OPC UA server to trust the connector for OPC UA application instance certificate:

1. To extract the connector for OPC UA certificate into a `opcuabroker.crt` file, run the following command:

    ```bash
    kubectl -n azure-iot-operations get secret aio-opc-opcuabroker-default-application-cert -o jsonpath='{.data.tls\.crt}' | base64 -d > opcuabroker.crt
    ```

    ```powershell
    kubectl -n azure-iot-operations get secret aio-opc-opcuabroker-default-application-cert -o jsonpath='{.data.tls\.crt}' | %{ [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($_)) } > opcuabroker.crt
    ```

1. Many OPC UA servers only support certificates in the DER format. If necessary, use the following command to convert the _opcuabroker.crt_ certificate to _opcuabroker.der_:

    ```bash
    openssl x509 -outform der -in opcuabroker.crt -out opcuabroker.der
    ```

1. Consult the documentation of your OPC UA server to learn how to add the `opcuabroker.crt` or `opcuabroker.der` certificate file to the server's trusted certificates list.

## Configure an enterprise grade application instance certificate

For production environments, you can configure the connector for OPC UA to use an enterprise grade application instance certificate. Typically, an enterprise CA issues this certificate and you need the CA certificate to your configuration. Often, there's a hierarchy of CAs and you need to add the complete validation chain of CAs to your configuration.

The following example references the following items:

| Item | Description |
| ---- | ----------- |
| _opcuabroker-certificate.der_ | File that contains the enterprise grade application instance certificate public key. |
| _opcuabroker-certificate.pem_ | File that contains the enterprise grade application instance certificate private key. |
| `subjectName`                 | The subject name string embedded in the application instance certificate. |
| `applicationUri`              | The application instance URI embedded in the application instance. |
| _enterprise-grade-ca-1.der_   | File that contains the enterprise grade CA certificate public key. |
| _enterprise-grade-ca-1.crl_   | The CA's CRL file. |

Like the previous examples, you use a dedicated Kubernetes secret to store the certificates and CRLs. To configure the enterprise grade application instance certificate, complete the following steps:

1. Save the certificates and the CRL in the *aio-opc-ua-broker-client-certificate* secret by using the following command:

    # [Bash](#tab/bash)

    ```bash
    # Create aio-opc-ua-broker-client-certificate secret
    # Upload OPC UA public key certificate as an entry to the secret
    # Upload OPC UA private key certificate as an entry to the secret
    az iot ops connector opcua client add \
        --instance <your instance name> \
        -g <your resource group> \
        --public-key-file "./opcuabroker-certificate.der" \
        --private-key-file "./opcuabroker-certificate.pem" \
        --subject-name <subject name from the public key cert> \
        --application-uri <application uri from the public key cert>
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    # Create aio-opc-ua-broker-client-certificate secret
    # Upload OPC UA public key certificate as an entry to the secret
    # Upload OPC UA private key certificate as an entry to the secret
    az iot ops connector opcua client add `
        --instance <your instance name> `
        -g <your resource group> `
        --public-key-file "./opcuabroker-certificate.der" `
        --private-key-file "./opcuabroker-certificate.pem" `
        --subject-name <subject name from the public key cert> `
        --application-uri <application uri from the public key cert>
    ```

    ---

2. If you use the CA to issue certificates for your OPC UA broker, configure the *aio-opc-ua-broker-issuer-list* secret. Use a Kubernetes client such as `kubectl` to configure the secrets *enterprise-grade-ca-1.der* and *enterprise-grade-ca-1.crl*:

    ```azurecli
    # Append CA certificate to the issuer list secret as a new entry
    az iot ops connector opcua issuer add --instance <your instance name> --resource-group <your resource group> --certificate-file "./enterprise-grade-ca-1.der"

    # Append the CRL to the issuer list secret as a new entry
    az iot ops connector opcua issuer add --instance <your instance name> --resource-group <your resource group> --certificate-file "./enterprise-grade-ca-1.crl"
    ```

Now that the connector for OPC UA uses the enterprise certificate, don't forget to add the new certificate's public key to the trusted certificate lists of all OPC UA servers it needs to connect to.
