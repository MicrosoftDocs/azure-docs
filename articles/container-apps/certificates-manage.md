---
title: Manage certificates in Azure Container Apps
description: Learn to managing secure certificates in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: how-to
ms.date: 03/11/2024
ms.author: cshoe
---

# Manage certificates in Azure Container Apps

## Import a certificate from Key Vault

If you use Azure Key Vault to manage your certificates, you can import a PKCS12 certificate into Container Apps from Key Vault if your application  meets the [requirements](./certificates-overview.md#private-certificate-requirements).

### Authorize Container Apps to read from the vault

By default, the Container Apps resource provider doesn't have access to your key vault. To use a key vault for a certificate deployment, you must [authorize read access for the resource provider to the key vault](../key-vault/general/assign-access-policy-cli.md).

> [!NOTE]
> Key Vault certificate supports only the Key Vault access policy, not RBAC model.

| Resource provider | Service principal AppId | Key vault secret permissions | Key vault certificate permissions |
|--|--|--|--|
| TODO | TODO | Get | Get |
| TODO | TODO | Get<br/>List<br/>Set<br/>Delete | Get<br/>List |

### Import a certificate from your vault to your app

1. In the [Azure portal](https://portal.azure.com), from the left menu, select **Container Apps** > **\<app-name>**.

1. From your app's navigation menu, select **Certificates** > **Bring your own certificates (.pfx)** > **Add certificate**.

1. In Source, select **Import from Key Vault**.

1. Select **Select key vault certificate**.

    TODO: image

1. To help you select the certificate, use the following table:

   | Setting | Description |
   |-|-|
   | **Subscription** | The subscription associated with the key vault. |
   | **Key vault** | The key vault that has the certificate you want to import. |
   | **Certificate** | From this list, select a PKCS12 certificate that's in the vault. All PKCS12 certificates in the vault are listed with their thumbprints, but not all are supported in Container Apps. |

1. When finished with your selection, select **Select**, **Validate**, then **Add**.

   When the operation completes, the certificate appears in the **Bring your own certificates** list. If the import fails with an error, the certificate doesn't meet the [requirements for Container Apps](./certificates-overview.md#private-certificate-requirements).

    TODO: add image

   > [!NOTE]
   > If you update your certificate in Key Vault with a new certificate, Container Apps automatically syncs your certificate within 24 hours.

1. To secure a custom domain with this certificate, you still have to create a certificate binding. Follow the steps in [Secure a custom DNS name with a TLS/SSL binding in Azure Container Apps](certificates-manage.md).

## Upload a private certificate

After you get a certificate from your certificate provider, make the certificate ready for Container Apps by following the steps in this section.

#### Merge intermediate certificates

If your certificate authority gives you multiple certificates in the certificate chain, you must merge the certificates following the same order.

1. In a text editor, open each received certificate.

1. To store the merged certificate, create a file named _mergedcertificate.crt_. 

1. Copy the content for each certificate into this file. Make sure to follow the certificate sequence specified by the certificate chain, starting with your certificate and ending with the root certificate, for example:

   ```
   -----BEGIN CERTIFICATE-----
   <your entire Base64 encoded SSL certificate>
   -----END CERTIFICATE-----

   -----BEGIN CERTIFICATE-----
   <The entire Base64 encoded intermediate certificate 1>
   -----END CERTIFICATE-----

   -----BEGIN CERTIFICATE-----
   <The entire Base64 encoded intermediate certificate 2>
   -----END CERTIFICATE-----

   -----BEGIN CERTIFICATE-----
   <The entire Base64 encoded root certificate>
   -----END CERTIFICATE-----
   ```

#### Export merged private certificate to PFX

Now, export your merged TLS/SSL certificate with the private key that was used to generate your certificate request. If you generated your certificate request using OpenSSL, then you created a private key file.

> [!NOTE]
> OpenSSL v3 changed default cipher from 3DES to AES256, but this can be overridden on the command line -keypbe PBE-SHA1-3DES -certpbe PBE-SHA1-3DES -macalg SHA1.
> OpenSSL v1 uses 3DES as default, so the PFX files generated are supported without any special modifications.

1. To export your certificate to a PFX file, run the following command, but replace the placeholders _&lt;private-key-file>_ and _&lt;merged-certificate-file>_ with the paths to your private key and your merged certificate file.

   ```bash
   openssl pkcs12 -export -out myserver.pfx -inkey <private-key-file> -in <merged-certificate-file>  
   ```

1. When you're prompted, specify a password for the export operation. When you upload your TLS/SSL certificate to Container Apps later, you must provide this password.

1. If you used IIS or _Certreq.exe_ to generate your certificate request, install the certificate to your local computer, and then [export the certificate to a PFX file](/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/cc754329(v=ws.11)).

#### Upload certificate to Container Apps

You're now ready upload the certificate to Container Apps.

1. In the [Azure portal](https://portal.azure.com), from the left menu, select **Container Apps** > **\<app-name>**.

1. From your app's navigation menu, select **Certificates** > **Bring your own certificates (.pfx)** > **Upload Certificate**.

    TODO: add image

1. To help you upload the .pfx certificate, use the following table:

   | Setting | Description |
   |-|-|
   | **PFX certificate file** | Select your .pfx file. |
   | **Certificate password** | Enter the password that you created when you exported the PFX file. |
   | **Certificate friendly name** | The certificate name that is shown in your web app. |

1. When finished with your selection, select **Select**, **Validate**, then **Add**.

   When the operation completes, the certificate appears in the **Bring your own certificates** list.

    TODO: add image

1. To secure a custom domain with this certificate, you still have to create a certificate binding. Follow the steps in [Secure a custom DNS name with a TLS/SSL binding in Azure Container Apps](certificates-manage.md).
