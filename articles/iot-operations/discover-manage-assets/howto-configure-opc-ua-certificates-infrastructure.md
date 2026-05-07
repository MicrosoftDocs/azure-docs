---
title: Configure OPC UA certificates infrastructure
description: How to configure and manage the OPC UA certificates trust relationship in the context of the connector for OPC UA.
author: dominicbetts
ms.author: dobett
ms.subservice: azure-opcua-connector
ms.custom: devx-track-azurecli
ms.topic: how-to
ms.date: 05/07/2026
ms.service: azure-iot-operations
ai-usage: ai-assisted

# CustomerIntent: As an industrial edge IT or operations user, I want to understand how to manage the OPC UA Certificates in the context of the connector for OPC UA.
---

# Configure OPC UA certificates infrastructure

In this article, you learn how to configure the OPC UA certificates infrastructure for the connector for OPC UA. This configuration lets you determine which OPC UA servers you trust to securely establish a session with.

Based on the [OPC UA specification](https://reference.opcfoundation.org/), the connector for OPC UA acts as a single OPC UA application when it establishes secure communications with OPC UA servers. The connector for OPC UA uses the same application instance certificate for all secure channels it opens to your OPC UA servers.

The connector for OPC UA must trust the OPC UA servers it connects to. The connector maintains a list of trusted certificates. To learn more, see:

- [Manage certificates for your Azure IoT Operations deployment](../secure-iot-ops/howto-manage-certificates.md) - this article describes how Azure IoT Operations uses Azure Key Vault to manage certificates.
- [OPC UA certificates infrastructure for the connector for OPC UA](overview-opc-ua-connector-certificates-management.md) - this article describes the roles of the trusted certificates list and issuer certificates list.

## Prerequisites

An Azure IoT Operations instance deployed with secure settings and the connector for OPC UA enabled. If you deployed Azure IoT Operations with test settings, you need to first [enable secure settings](../deploy-iot-ops/howto-enable-secure-settings.md).

## Configure a self-signed application instance certificate for the connector for OPC UA

The default deployment of the connector for OPC UA installs all the resources needed by [cert-manager](https://cert-manager.io/) to create an OPC UA compliant self-signed certificate. This certificate is stored in the `aio-opc-opcuabroker-default-application-cert` secret. This secret is mapped into all the connector for OPC UA pods and acts as the OPC UA client application instance certificate. `cert-manager` handles the automatic renewal of this application instance certificate.

This configuration is typically sufficient for compliant and secure communication between your OPC UA servers and the connector for OPC UA in a demonstration or exploration environment. For a production environment, use [enterprise-grade application instance certificates](#configure-an-enterprise-grade-application-instance-certificate) in your deployment.

## Configure the trusted certificates list

To connect to an OPC UA server, first you need to establish the application authentication mutual trust. To configure the trusted certificates list of the servers you want the connector for OPC UA to connect to:

# [Operations experience](#tab/portal)

To use the operations experience web UI to manage the trusted certificates list, complete the following steps:

1. Get the OPC UA server application's instance certificate as a file. These files typically have a `.der` or `.crt` extension. This file contains the public key only.

    > [!TIP]
    > Typically, an OPC UA server has an interface that lets you export its application instance certificate. This interface isn't standardized. For servers such as KEPServerEx, there's a Windows-based configuration UI for certificates management. Other servers might have a web interface or use operating system folders to store the certificates. To find out how to export the application instance certificate, refer to the user manual of your server. After you have the certificate, make sure it's either DER or PEM encoded. These certificates are typically stored in files with either the `.der` or `.crt` extension. If the certificate isn't in one of those file formats, use a tool such as `openssl` to transform the certificate into the required format.

1. You can add the certificate directly to your Azure Key Vault as a secret and import from there, or you can upload the certificate to the trusted certificates list using the operations experience.

    > [!NOTE]
    > The connector for OPC UA uses a Kubernetes-native secret named `aio-opc-ua-broker-trust-list` to store the trusted certificates list. This secret is created when you deploy Azure IoT Operations.

1. Go to the **Devices** page in the [operations experience](https://iotoperations.azure.com) web UI.

1. To view the trusted certificates list, select **Manage certificates and secrets** and then **Certificates**:

    :::image type="content" source="media/howto-configure-opc-ua-certificates-infrastructure/view-trusted-certificates.png" lightbox="media/howto-configure-opc-ua-certificates-infrastructure/view-trusted-certificates.png" alt-text="Screenshot of operations experience showing certificate upload page for the trusted certificates list.":::

1. You can upload a certificate file from your local machine or add one that you previously added as a secret in your Azure Key Vault:

    :::image type="content" source="media/howto-configure-opc-ua-certificates-infrastructure/successful-certificate-upload.png" lightbox="media/howto-configure-opc-ua-certificates-infrastructure/successful-certificate-upload.png" alt-text="Screenshot of operations experience showing successfully uploaded certificate.":::

1. Select **Apply** to save the changes. The certificate is now added to the trusted certificates list. If you upload the certificate, it's automatically added to your Azure Key Vault as a secret.

If your OPC UA server uses a certificate issued by a certificate authority (CA), you can trust the CA by adding its public key certificate to the trusted certificates list. The connector for OPC UA now automatically trusts all the servers that use a valid certificate issued by the CA. Therefore, you don't need to explicitly add the OPC UA server's certificate to the connector for OPC UA's trusted certificates list. Currently, you can't use the operations experience to add a certificate revocation list to the trusted certificates list.

> [!TIP]
> To add a new certificate in the operations experience, you must be assigned to the **Key Vault Secrets Officer** role for your Azure Key Vault.

> [!IMPORTANT]
> If you're adding a certificate from Azure Key Vault, it must be stored as a secret and not as a certificate.

# [Azure CLI](#tab/cli)

To use the Azure CLI to manage the trusted certificates list, complete the following steps:

1. Get the OPC UA server application's instance certificate as a file. These files typically have a `.der` or `.crt` extension. This file contains the public key only.

    > [!TIP]
    > Typically, an OPC UA server has an interface that lets you export its application instance certificate. This interface isn't standardized. For servers such as KEPServerEx, there's a Windows-based configuration UI for certificates management. Other servers might have a web interface or use operating system folders to store the certificates. To find out how to export the application instance certificate, refer to the user manual of your server. After you have the certificate, make sure it's either DER or PEM encoded. These certificates are typically stored in files with either the `.der` or `.crt` extension. If the certificate isn't in one of those file formats, use a tool such as `openssl` to transform the certificate into the required format.

1. Add the OPC UA server's application instance certificate to the trusted certificates list. This list is implemented as a Kubernetes-native secret named `aio-opc-ua-broker-trust-list` that's created when you deploy Azure IoT Operations.

    For a DER encoded certificate in a file such as `./my-server.der`, run the following command:

    ```azurecli
    # Append my-server.der OPC UA server certificate to the trusted certificate list secret as a new entry
    az iot ops connector opcua trust add --instance <your instance name> --resource-group <your resource group> --certificate-file "./my-server.der"
    ```

    For a PEM encoded certificate in a file such as `./my-server.crt`, run the following command:

    ```azurecli
    # Append my-server.crt OPC UA server certificate to the trusted certificate list secret as a new entry
    az iot ops connector opcua trust add --instance <your instance name> --resource-group <your resource group> --certificate-file "./my-server.crt"
    ```

If your OPC UA server uses a certificate issued by a certificate authority (CA), you can trust the CA by adding its public key certificate to the connector for OPC UA trusted certificates list. The connector for OPC UA now automatically trusts all the servers that use a valid certificate issued by the CA. Therefore, you don't need to explicitly add the OPC UA server's certificate to the connector for OPC UA trusted certificates list.

To trust a CA, complete the following steps:

1. Get the CA certificate public key encoded in DER or PEM format. These certificates are typically stored in files with either the `.der` or `.crt` extension. Get the CA's CRL. This list is typically in a file with the `.crl` extension. Check the documentation for your OPC UA server for details.

1. Save the CA certificate and the CRL in the `aio-opc-ua-broker-trust-list` Kubernetes-native secret:

    For a DER encoded CA certificate in a file such as `./my-server-ca.der`, run the following commands:

    ```bash
    # Append CA certificate to the trusted certificate list secret as a new entry
    az iot ops connector opcua trust add --instance <your instance name> --resource-group <your resource group> --certificate-file "./my-server-ca.der"

    # Append the CRL to the trusted certificate list secret as a new entry
    data=$(kubectl create secret generic temp --from-file=my-server-ca.crl=./my-server-ca.crl --dry-run=client -o jsonpath='{.data}')
    kubectl patch secret aio-opc-ua-broker-trust-list -n azure-iot-operations -p "{\"data\": $data}"
    ```

    ```powershell
    # Append CA certificate to the trusted certificate list secret as a new entry
    az iot ops connector opcua trust add --instance <your instance name> --resource-group <your resource group> --certificate-file "./my-server-ca.der"

    # Append the CRL to the trusted certificate list secret as a new entry
    $data = kubectl create secret generic temp --from-file=my-server-ca.crl=./my-server-ca.crl --dry-run=client -o jsonpath='{.data}'
    kubectl patch secret aio-opc-ua-broker-trust-list -n azure-iot-operations -p "{`"data`": $data}"
    ```

    For a PEM encoded CA certificate in a file such as `./my-server-ca.crt`, run the following commands:

    ```bash
    # Append CA certificate to the trusted certificate list secret as a new entry
    az iot ops connector opcua trust add --instance <your instance name> --resource-group <your resource group> --certificate-file "./my-server-ca.crt"

    # Append the CRL to the trusted certificates list secret as a new entry
    data=$(kubectl create secret generic temp --from-file=my-server-ca.crl=./my-server-ca.crl --dry-run=client -o jsonpath='{.data}')
    kubectl patch secret aio-opc-ua-broker-trust-list -n azure-iot-operations -p "{\"data\": $data}"
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
    > The connector for OPC UA uses a Kubernetes-native secret named `aio-opc-ua-broker-issuer-list` to store the issuer certificates list. This secret is created when you deploy Azure IoT Operations.

1. Go to the **Devices** page in the [operations experience](https://iotoperations.azure.com) web UI.

1. To view the issuer certificates list, select **Manage certificates and secrets** and then **Certificates**. The filter box lets you view the different certificate lists:

    :::image type="content" source="media/howto-configure-opc-ua-certificates-infrastructure/upload-issuer-certificate.png" lightbox="media/howto-configure-opc-ua-certificates-infrastructure/upload-issuer-certificate.png" alt-text="Screenshot of operations experience showing certificate upload page for the issuer certificates list.":::

1. You can upload an issuer certificate file from your local machine or add one that you previously added as a secret in your Azure Key Vault:

    :::image type="content" source="media/howto-configure-opc-ua-certificates-infrastructure/successful-issuer-upload.png" lightbox="media/howto-configure-opc-ua-certificates-infrastructure/successful-issuer-upload.png" alt-text="Screenshot of operations experience showing successfully uploaded issuer certificate.":::

1. Select **Apply** to save the changes. The certificate is now added to the issuer certificates list. If you upload the certificate, it's automatically added to your Azure Key Vault as a secret.

You can also use the operations experience to add a certificate revocation list (.crl file) to the issuer certificates list.

> [!TIP]
> To add a new certificate in the operations experience, you must be assigned to the **Key Vault Secrets Officer** role for your Azure Key Vault.

> [!IMPORTANT]
> If you're adding a certificate from Azure Key Vault, it must be stored as a secret and not as a certificate.

# [Azure CLI](#tab/cli)

Before you can configure the issuer certificates list with your intermediate certificates, you need to add the CA certificate to the trusted certificates list. The connector for OPC UA uses the CA certificate to validate the issuer chain of the OPC UA server's certificate.

To use the Azure CLI to manage the issuer certificates list, complete the following steps:

1. Save the CA certificate and the CRL in the `aio-opc-ua-broker-issuer-list` secret:

    ```azurecli
    # Append CA certificate to the issuer list secret as a new entry
    az iot ops connector opcua issuer add --instance <your instance name> --resource-group <your resource group> --certificate-file "./my-server-ca.der"

    # Append the CRL to the issuer list secret as a new entry
    az iot ops connector opcua issuer add --instance <your instance name> --resource-group <your resource group> --certificate-file "./my-server-ca.crl"
    ```

1. For a PEM encoded certificate in a file such as `./my-server-ca.crt`, run the following commands:

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

1. Many OPC UA servers only support certificates in the DER format. If necessary, use the following command to convert the `opcuabroker.crt` certificate to `opcuabroker.der`:

    ```bash
    openssl x509 -outform der -in opcuabroker.crt -out opcuabroker.der
    ```

1. Consult the documentation of your OPC UA server to learn how to add the `opcuabroker.crt` or `opcuabroker.der` certificate file to the server's trusted certificates list.

## Configure an enterprise-grade application instance certificate

For production environments, you can configure the connector for OPC UA to use an enterprise-grade application instance certificate. Typically, an enterprise CA issues this certificate and you need to add the CA certificate to your configuration. Often, there's a hierarchy of CAs and you need to add the complete validation chain of CAs to your configuration.

The following example references the following items:

| Item | Description |
| ---- | ----------- |
| `opcuabroker-certificate.der` | File that contains the enterprise-grade application instance certificate public key. |
| `opcuabroker-certificate.pem` | File that contains the enterprise-grade application instance certificate private key. |
| `subjectName`                 | The subject name string embedded in the application instance certificate. |
| `applicationUri`              | The application instance URI embedded in the application instance. |
| `enterprise-grade-ca-1.der`   | File that contains the enterprise-grade CA certificate public key. |
| `enterprise-grade-ca-1.crl`   | The CA's CRL file. |

Like the previous examples, you use a dedicated Kubernetes secret to store the certificates and CRLs. To configure the enterprise-grade application instance certificate, complete the following steps:

1. Save the certificates and the CRL in the `aio-opc-ua-broker-client-certificate` secret by using the following command:

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

    > [!IMPORTANT]
    > The `--subject-name` and `--application-uri` values must exactly match the corresponding values in the certificate. A mismatch causes the OPC UA session establishment to fail, as the OPC UA server validates that the application instance certificate matches the client's declared identity.

1. If you use the CA to issue certificates for your connector for OPC UA, configure the `aio-opc-ua-broker-issuer-list` secret. Use a Kubernetes client such as `kubectl` to configure the secrets `enterprise-grade-ca-1.der` and `enterprise-grade-ca-1.crl`:

    ```azurecli
    # Append CA certificate to the issuer list secret as a new entry
    az iot ops connector opcua issuer add --instance <your instance name> --resource-group <your resource group> --certificate-file "./enterprise-grade-ca-1.der"

    # Append the CRL to the issuer list secret as a new entry
    az iot ops connector opcua issuer add --instance <your instance name> --resource-group <your resource group> --certificate-file "./enterprise-grade-ca-1.crl"
    ```

Now that the connector for OPC UA uses the enterprise certificate, don't forget to add the new certificate's public key to the trusted certificate lists of all OPC UA servers it needs to connect to.

### Relax the certificate validation on your OPC UA connector (optional)

> [!CAUTION]
> Only use the following settings in test or QA environments where target OPC UA servers use legacy certificates.

To lower the connector's PKI security restrictions to allow communication with OPC UA servers that use weaker certificates:

# [Bash](#tab/bash)

```bash
az k8s-extension update --name <your instance name> \
  --cluster-name <your cluster name> \
  --resource-group <your resource group> \
  --cluster-type connectedClusters \
  --config connectors.values.securityPki.minimumCertificateKeySize=1024 \
  --config connectors.values.securityPki.rejectSha1SignedCertificates=false
```

# [PowerShell](#tab/powershell)

```powershell
az k8s-extension update --name <your instance name> `
  --cluster-name <your cluster name> `
  --resource-group <your resource group> `
  --cluster-type connectedClusters `
  --config connectors.values.securityPki.minimumCertificateKeySize=1024 `
  --config connectors.values.securityPki.rejectSha1SignedCertificates=false
```

---

## Configure certificate subject alternative names

The connector's self-signed certificate automatically includes the application URI and the local hostname in the Subject Alternative Name (SAN) extension. If OPC UA servers access the connector through other hostnames or IP addresses, you need to add those identities to the SAN. To learn more about SAN and when you need custom entries, see [Certificate subject alternative name](overview-opc-ua-connector-certificates-management.md#certificate-subject-alternative-name).

> [!NOTE]
> This configuration only applies to the connector's self-generated certificate. If you use an enterprise-grade certificate, configure the SAN entries when you generate that certificate externally. For more information, see [Configure an enterprise-grade application instance certificate](#configure-an-enterprise-grade-application-instance-certificate).

To add custom DNS names, IP addresses, or both, add the `SubjectAlternativeDnsNames` and `SubjectAlternativeIpAddresses` properties to the connector's `SecurityPki` configuration in the `additionalConfiguration` field of the connector's deployment:

```json
{
  "SecurityPki": {
    "SubjectName": "CN=aio-opc-opcuabroker",
    "ApplicationUri": "urn:microsoft.com:aio:opc:ua:broker",
    "SubjectAlternativeDnsNames": "opcua-connector.iot-ops.svc.cluster.local,opcua.contoso.com",
    "SubjectAlternativeIpAddresses": "192.168.1.100,10.0.0.50"
  }
}
```

The resulting certificate SAN includes the application URI, all specified DNS names and IP addresses, and the local hostname that the connector adds automatically.

### Regenerate the certificate with new SAN entries

If you change the SAN configuration on a running connector, regenerate the certificate to apply the new entries:

1. Update the configuration with the new SAN values.
1. Delete the existing certificate from the PKI store:

   ```bash
   rm -rf -- /tmp/opcuabroker/pki/own/certs/* /tmp/opcuabroker/pki/own/private/*
   ```

1. Restart the connector pod. The connector automatically generates a new certificate with the updated SAN entries.

To verify the new certificate contains the expected SAN entries, run the following command:

```bash
openssl x509 -in /tmp/opcuabroker/pki/own/certs/your-cert-file.der -inform DER -text -noout | grep -A 10 "Subject Alternative Name"
```

### Troubleshoot SAN validation failures

If an OPC UA server rejects connections with certificate hostname or IP validation errors:

1. Check the server's error message for the hostname or IP address it validated against.
1. Add that hostname or IP address to the appropriate SAN configuration property (`SubjectAlternativeDnsNames` or `SubjectAlternativeIpAddresses`).
1. Regenerate the certificate as described in the previous section.

## SecurityPki configuration reference

Configure `securityPki` settings by using `az k8s-extension update`:

```bash
az k8s-extension update --name <your instance name> \
  --cluster-name <your cluster name> \
  --resource-group <your resource group> \
  --cluster-type connectedClusters \
  --config connectors.values.securityPki.<settingName>=<value>
```

```powershell
az k8s-extension update --name <your instance name> `
  --cluster-name <your cluster name> `
  --resource-group <your resource group> `
  --cluster-type connectedClusters `
  --config connectors.values.securityPki.<settingName>=<value>
```

### Certificate validation settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `minimumCertificateKeySize` | int | `2048` | Minimum RSA key size to accept. Supported values: `1024` (deprecated), `2048`, `3072`, `4096`. |
| `rejectSha1SignedCertificates` | bool | `true` | Whether to reject peer certificates signed with the deprecated SHA-1 algorithm. |
| `rejectUnknownRevocationStatus` | bool | `false` | Whether to reject CA certificates whose revocation status cannot be verified (for example, CRL not available). Should be `false` when `deployDefaultIssuerCA` is used. |
| `suppressNonceValidationErrors` | bool | `false` | Suppresses errors caused by non-conformant clients or servers that may repeat nonce or use nonce with insufficient entropy. Only use in test/QA environments. |

### Certificate chain and trust settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `sendCertificateChain` | bool | `true` | Whether to send the full certificate chain for CA-signed application instance certificates during authentication with a server. |
| `trustOwnCertIssuer` | bool | `true` | Whether to trust the issuer CA when provided in the own certificate store. |
| `deployDefaultIssuerCA` | bool | `false` | Whether to deploy a default issuer CA for the connector for OPC UA to use to sign application instance certificates. When enabled, automatically creates a self-signed root CA and issuer certificates. |

### Application instance certificate identity

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `subjectName` | string | `"aio-opc-opcuabroker"` | Subject of the application instance certificate. Must match the certificate's `Common Name`. |
| `applicationUri` | string | `"urn:microsoft.com:aio:opc:ua:broker"` | The URI of the application instance certificate. Must match the certificate's `Subject Alternative Name URI`. |