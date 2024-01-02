---
title: Add and manage TLS/SSL certificates
description: Create a free certificate, import an App Service certificate, import a Key Vault certificate, or buy an App Service certificate in Azure App Service.
tags: buy-ssl-certificates

ms.topic: tutorial
ms.date: 07/28/2023
ms.reviewer: yutlin
ms.custom: seodec18
ms.author: msangapu
author: msangapu-msft
---

# Add and manage TLS/SSL certificates in Azure App Service

You can add digital security certificates to [use in your application code](configure-ssl-certificate-in-code.md) or to [secure custom DNS names](configure-ssl-bindings.md) in [Azure App Service](overview.md), which provides a highly scalable, self-patching web hosting service. Currently called Transport Layer Security (TLS) certificates, also previously known as Secure Socket Layer (SSL) certificates, these private or public certificates help you secure internet connections by encrypting data sent between your browser, websites that you visit, and the website server.

The following table lists the options for you to add certificates in App Service:

|Option|Description|
|-|-|
| Create a free App Service managed certificate | A private certificate that's free of charge and easy to use if you just need to secure your [custom domain](app-service-web-tutorial-custom-domain.md) in App Service. |
| Import an App Service certificate | A private certificate that's managed by Azure. It combines the simplicity of automated certificate management and the flexibility of renewal and export options. |
| Import a certificate from Key Vault | Useful if you use [Azure Key Vault](../key-vault/index.yml) to manage your [PKCS12 certificates](https://wikipedia.org/wiki/PKCS_12). See [Private certificate requirements](#private-certificate-requirements). |
| Upload a private certificate | If you already have a private certificate from a third-party provider, you can upload it. See [Private certificate requirements](#private-certificate-requirements). |
| Upload a public certificate | Public certificates aren't used to secure custom domains, but you can load them into your code if you need them to access remote resources. |

> [!NOTE]
> After you upload a certificate to an app, the certificate is stored in a deployment unit that's bound to the App Service plan's resource group, region, and operating system combination, internally called a *webspace*. That way, the certificate is accessible to other apps in the same resource group and region combination. Certificates uploaded or imported to App Service are shared with App Services in the same deployment unit. 

## Prerequisites

- [Create an App Service app](./index.yml). The app's [App Service plan](overview-hosting-plans.md) must be in the **Basic**, **Standard**, **Premium**, or **Isolated** tier. See [Scale up an app](manage-scale-up.md#scale-up-your-pricing-tier) to update the tier.

- For a private certificate, make sure that it satisfies all [requirements from App Service](#private-certificate-requirements).

- **Free certificate only**:

  - Map the domain where you want the certificate to App Service. For information, see [Tutorial: Map an existing custom DNS name to Azure App Service](app-service-web-tutorial-custom-domain.md).
  
  - For a root domain (like contoso.com), make sure your app doesn't have any [IP restrictions](app-service-ip-restrictions.md) configured. Both certificate creation and its periodic renewal for a root domain depends on your app being reachable from the internet.

## Private certificate requirements

The [free App Service managed certificate](#create-a-free-managed-certificate) and the [App Service certificate](configure-ssl-app-service-certificate.md) already satisfy the requirements of App Service. If you choose to upload or import a private certificate to App Service, your certificate must meet the following requirements:

* Exported as a [password-protected PFX file](https://en.wikipedia.org/w/index.php?title=X.509&section=4#Certificate_filename_extensions), encrypted using triple DES.
* Contains private key at least 2048 bits long
* Contains all intermediate certificates and the root certificate in the certificate chain.

To secure a custom domain in a TLS binding, the certificate has more requirements:

* Contains an [Extended Key Usage](https://en.wikipedia.org/w/index.php?title=X.509&section=4#Extensions_informing_a_specific_usage_of_a_certificate) for server authentication (OID = 1.3.6.1.5.5.7.3.1)
* Signed by a trusted certificate authority

> [!NOTE]
> **Elliptic Curve Cryptography (ECC) certificates** work with App Service but aren't covered by this article. For the exact steps to create ECC certificates, work with your certificate authority.

## Create a free managed certificate

The free App Service managed certificate is a turn-key solution for securing your custom DNS name in App Service. Without any action from you, this TLS/SSL server certificate is fully managed by App Service and is automatically renewed continuously in six-month increments, 45 days before expiration, as long as the prerequisites that you set up stay the same. All the associated bindings are updated with the renewed certificate. You create and bind the certificate to a custom domain, and let App Service do the rest.

> [!IMPORTANT]
> Before you create a free managed certificate, make sure you have [met the prerequisites](#prerequisites) for your app.
>
> Free certificates are issued by DigiCert. For some domains, you must explicitly allow DigiCert as a certificate issuer by creating a [CAA domain record](https://wikipedia.org/wiki/DNS_Certification_Authority_Authorization) with the value: `0 issue digicert.com`.
>
> Azure fully manages the certificates on your behalf, so any aspect of the managed certificate, including the root issuer, can change at anytime. These changes are outside your control. Make sure to avoid hard dependencies and "pinning" practice certificates to the managed certificate or any part of the certificate hierarchy. If you need the certificate pinning behavior, add a certificate to your custom domain using any other available method in this article.

The free certificate comes with the following limitations:

- Doesn't support wildcard certificates.
- Doesn't support usage as a client certificate by using certificate thumbprint, which is planned for deprecation and removal.
- Doesn't support private DNS.
- Isn't exportable.
- Isn't supported in an App Service Environment (ASE).
- Only supports alphanumeric characters, dashes (-), and periods (.).

### [Apex domain](#tab/apex)
- Must have an A record pointing to your web app's IP address.
- Isn't supported on apps that aren't publicly accessible.
- Isn't supported with root domains that are integrated with Traffic Manager.
- Must meet all the above for successful certificate issuances and renewals.

### [Subdomain](#tab/subdomain)
- Must have CNAME mapped _directly_ to `<app-name>.azurewebsites.net` or [trafficmanager.net](configure-domain-traffic-manager.md#enable-custom-domain). Mapping to an intermediate CNAME value blocks certificate issuance and renewal.
- Must meet all the above for successful certificate issuance and renewals.

---

1. In the [Azure portal](https://portal.azure.com), from the left menu, select **App Services** > **\<app-name>**.

1. On your app's navigation menu, select **Certificates**. In the **Managed certificates** pane, select **Add certificate**.

   :::image type="content" source="media/configure-ssl-certificate/create-free-cert.png" alt-text="Screenshot of app menu with 'Certificates', 'Managed certificates', and 'Add certificate' selected.":::

1. Select the custom domain for the free certificate, and then select **Validate**. When validation completes, select **Add**. You can create only one managed certificate for each supported custom domain.

   When the operation completes, the certificate appears in the **Managed certificates** list.

    :::image type="content" source="media/configure-ssl-certificate/create-free-cert-finished.png" alt-text="Screenshot of 'Managed certificates' pane with newly created certificate listed.":::

1. To secure a custom domain with this certificate, you still have to create a certificate binding. Follow the steps in [Secure a custom DNS name with a TLS/SSL binding in Azure App Service](configure-ssl-bindings.md).

## Import an App Service certificate

To import an App Service certificate, first [buy and configure an App Service certificate](configure-ssl-app-service-certificate.md#buy-and-configure-an-app-service-certificate), then follow the steps here.

1. In the [Azure portal](https://portal.azure.com), from the left menu, select **App Services** > **\<app-name>**.

1. From your app's navigation menu, select **Certificates** > **Bring your own certificates (.pfx)** > **Add certificate**.

1. In Source, select **Import App Service Certificate**.
1. In **App Service certificate**, select the certificate you just created.
1. In **Certificate friendly name**, give the certificate a name in your app.
1. Select **Validate**. When validation succeeds, select **Add**.

    :::image type="content" source="media/configure-ssl-certificate/import-app-service-cert.png" alt-text="Screenshot of app management page with 'Certificates', 'Bring your own certificates (.pfx)', and 'Import App Service certificate' selected, and the completed 'Add private key certificate' page with the **Validate** button.":::

   When the operation completes, the certificate appears in the **Bring your own certificates** list.

    :::image type="content" source="media/configure-ssl-certificate/import-app-service-cert-finished.png" alt-text="Screenshot of 'Bring your own certificates (.pfx)' pane with purchased certificate listed.":::

1. To secure a custom domain with this certificate, you still have to create a certificate binding. Follow the steps in [Secure a custom DNS name with a TLS/SSL binding in Azure App Service](configure-ssl-bindings.md).

## Import a certificate from Key Vault

If you use Azure Key Vault to manage your certificates, you can import a PKCS12 certificate into App Service from Key Vault if you met the [requirements](#private-certificate-requirements).

### Authorize App Service to read from the vault

By default, the App Service resource provider doesn't have access to your key vault. To use a key vault for a certificate deployment, you must [authorize read access for the resource provider to the key vault](../key-vault/general/assign-access-policy-cli.md). 

> [!NOTE]
> Currently, a Key Vault certificate supports only the Key Vault access policy, not RBAC model.

| Resource provider | Service principal AppId | Key vault secret permissions | Key vault certificate permissions |
|--|--|--|--|
| **Microsoft Azure App Service** or **Microsoft.Azure.WebSites** | - `abfa0a7c-a6b6-4736-8310-5855508787cd`, which is the same for all Azure subscriptions <br><br>- For Azure Government cloud environment, use `6a02c803-dafd-4136-b4c3-5a6f318b4714`. | Get | Get |
| **Microsoft.Azure.CertificateRegistration** |  | Get<br/>List<br/>Set<br/>Delete | Get<br/>List |

### Import a certificate from your vault to your app

1. In the [Azure portal](https://portal.azure.com), from the left menu, select **App Services** > **\<app-name>**.

1. From your app's navigation menu, select **Certificates** > **Bring your own certificates (.pfx)** > **Add certificate**.

1. In Source, select **Import from Key Vault**.

1. Select **Select key vault certificate**.

    :::image type="content" source="media/configure-ssl-certificate/import-key-vault-cert.png" alt-text="Screenshot of app management page with 'Certificates', 'Bring your own certificates (.pfx)', and 'Import from Key Vault' selected":::

1. To help you select the certificate, use the following table:

   | Setting | Description |
   |-|-|
   | **Subscription** | The subscription associated with the key vault. |
   | **Key vault** | The key vault that has the certificate you want to import. |
   | **Certificate** | From this list, select a PKCS12 certificate that's in the vault. All PKCS12 certificates in the vault are listed with their thumbprints, but not all are supported in App Service. |

1. When finished with your selection, select **Select**, **Validate**, then **Add**.

   When the operation completes, the certificate appears in the **Bring your own certificates** list. If the import fails with an error, the certificate doesn't meet the [requirements for App Service](#private-certificate-requirements).

    :::image type="content" source="media/configure-ssl-certificate/import-app-service-cert-finished.png" alt-text="Screenshot of 'Bring your own certificates (.pfx)' pane with imported certificate listed.":::

   > [!NOTE]
   > If you update your certificate in Key Vault with a new certificate, App Service automatically syncs your certificate within 24 hours.

1. To secure a custom domain with this certificate, you still have to create a certificate binding. Follow the steps in [Secure a custom DNS name with a TLS/SSL binding in Azure App Service](configure-ssl-bindings.md).

## Upload a private certificate

After you get a certificate from your certificate provider, make the certificate ready for App Service by following the steps in this section.

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

1. When you're prompted, specify a password for the export operation. When you upload your TLS/SSL certificate to App Service later, you must provide this password.

1. If you used IIS or _Certreq.exe_ to generate your certificate request, install the certificate to your local computer, and then [export the certificate to a PFX file](/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/cc754329(v=ws.11)).

#### Upload certificate to App Service

You're now ready upload the certificate to App Service.

1. In the [Azure portal](https://portal.azure.com), from the left menu, select **App Services** > **\<app-name>**.

1. From your app's navigation menu, select **Certificates** > **Bring your own certificates (.pfx)** > **Upload Certificate**.

    :::image type="content" source="media/configure-ssl-certificate/upload-private-cert.png" alt-text="Screenshot of 'Certificates', 'Bring your own certificates (.pfx)', 'Upload Certificate' selected.":::

1. To help you upload the .pfx certificate, use the following table:

   | Setting | Description |
   |-|-|
   | **PFX certificate file** | Select your .pfx file. |
   | **Certificate password** | Enter the password that you created when you exported the PFX file. |
   | **Certificate friendly name** | The certificate name that will be shown in your web app. |

1. When finished with your selection, select **Select**, **Validate**, then **Add**.

   When the operation completes, the certificate appears in the **Bring your own certificates** list.

    :::image type="content" source="media/configure-ssl-certificate/import-app-service-cert-finished.png" alt-text="Screenshot of 'Bring your own certificates' pane with uploaded certificate listed.":::

1. To secure a custom domain with this certificate, you still have to create a certificate binding. Follow the steps in [Secure a custom DNS name with a TLS/SSL binding in Azure App Service](configure-ssl-bindings.md).

## Upload a public certificate

Public certificates are supported in the *.cer* format.

1. In the [Azure portal](https://portal.azure.com), from the left menu, select **App Services** > **\<app-name>**.

1. From your app's navigation menu, select **Certificates** > **Public key certificates (.cer)** > **Add certificate**.

1. To help you upload the .cer certificate, use the following table:

   | Setting | Description |
   |-|-|
   | **CER certificate file** | Select your .cer file. |
   | **Certificate friendly name** | The certificate name that will be shown in your web app. |

1. When you're done, select **Add**.

    :::image type="content" source="media/configure-ssl-certificate/upload-public-cert.png" alt-text="Screenshot of name and public key certificate to upload.":::

1. After the certificate is uploaded, copy the certificate thumbprint, and then review [Make the certificate accessible](configure-ssl-certificate-in-code.md#make-the-certificate-accessible).

## Renew an expiring certificate

Before a certificate expires, make sure to add the renewed certificate to App Service, and update any certificate bindings where the process depends on the certificate type. For example, a [certificate imported from Key Vault](#import-a-certificate-from-key-vault), including an [App Service certificate](configure-ssl-app-service-certificate.md), automatically syncs to App Service every 24 hours and updates the TLS/SSL binding when you renew the certificate. For an [uploaded certificate](#upload-a-private-certificate), there's no automatic binding update. Based on your scenario, review the corresponding section:

- [Renew an uploaded certificate](#renew-uploaded-certificate)
- [Renew an App Service certificate](configure-ssl-app-service-certificate.md#renew-an-app-service-certificate)
- [Renew a certificate imported from Key Vault](#renew-a-certificate-imported-from-key-vault)

#### Renew uploaded certificate

When you replace an expiring certificate, the way you update the certificate binding with the new certificate might adversely affect user experience. For example, your inbound IP address might change when you delete a binding, even if that binding is IP-based. This result is especially impactful when you renew a certificate that's already in an IP-based binding. To avoid a change in your app's IP address, and to avoid downtime for your app due to HTTPS errors, follow these steps in the specified sequence:

1. [Upload the new certificate](#upload-a-private-certificate).

1. Go to the **Custom domains** page for your app, select the **...** actions button, and select **Update binding**.

1. Select the new certificate and select **Update**.

1. Delete the existing certificate.

#### Renew a certificate imported from Key Vault

> [!NOTE]
> To renew an App Service certificate, see [Renew an App Service certificate](configure-ssl-app-service-certificate.md#renew-an-app-service-certificate).

To renew a certificate that you imported into App Service from Key Vault, review [Renew your Azure Key Vault certificate](../key-vault/certificates/overview-renew-certificate.md).

After the certificate renews inside your key vault, App Service automatically syncs the new certificate, and updates any applicable certificate binding within 24 hours. To sync manually, follow these steps:

1. Go to your app's **Certificate** page.

1. Under **Bring your own certificates (.pfx)**, select the **...** details button for the imported key vault certificate, and then select **Sync**. 

## Frequently asked questions

- [How can I automate adding a bring-your-owncertificate to an app?](#how-can-i-automate-adding-a-bring-your-owncertificate-to-an-app)
- [Frequently asked questions for App Service certificates](configure-ssl-app-service-certificate.md#frequently-asked-questions)
#### How can I automate adding a bring-your-owncertificate to an app?

- [Azure CLI: Bind a custom TLS/SSL certificate to a web app](scripts/cli-configure-ssl-certificate.md)
- [Azure PowerShell Bind a custom TLS/SSL certificate to a web app using PowerShell](scripts/powershell-configure-ssl-certificate.md)

## More resources

* [Secure a custom DNS name with a TLS/SSL binding in Azure App Service](configure-ssl-bindings.md)
* [Enforce HTTPS](configure-ssl-bindings.md#enforce-https)
* [Enforce TLS 1.1/1.2](configure-ssl-bindings.md#enforce-tls-versions)
* [Use a TLS/SSL certificate in your code in Azure App Service](configure-ssl-certificate-in-code.md)
* [FAQ : App Service Certificates](./faq-configuration-and-management.yml)
