---
title: Add and manage TLS/SSL certificates
description: Create a free certificate, import an App Service certificate, import a Key Vault certificate, or buy an App Service certificate in Azure App Service.
tags: buy-ssl-certificates

ms.topic: tutorial
ms.date: 07/28/2022
ms.reviewer: yutlin
ms.custom: seodec18
---

# Add and manage TLS/SSL certificates in Azure App Service

You can add digital security certificates to [use in your application code](configure-ssl-certificate-in-code.md) or to [secure custom DNS names](configure-ssl-bindings.md) in [Azure App Service](overview.md), which provides a highly scalable, self-patching web hosting service. Currently called Transport Layer Security (TLS) certificates, also previously known as Secure Socket Layer (SSL) certificates, these private or public certificates help you secure internet connections by encrypting data sent between your browser, websites that you visit, and the website server.

The following table lists the options for you to add certificates in App Service:

|Option|Description|
|-|-|
| Create a free App Service managed certificate | A private certificate that's free of charge and easy to use if you just need to secure your [custom domain](app-service-web-tutorial-custom-domain.md) in App Service. |
| Purchase an App Service certificate | A private certificate that's managed by Azure. It combines the simplicity of automated certificate management and the flexibility of renewal and export options. |
| Import a certificate from Key Vault | Useful if you use [Azure Key Vault](../key-vault/index.yml) to manage your [PKCS12 certificates](https://wikipedia.org/wiki/PKCS_12). See [Private certificate requirements](#private-certificate-requirements). |
| Upload a private certificate | If you already have a private certificate from a third-party provider, you can upload it. See [Private certificate requirements](#private-certificate-requirements). |
| Upload a public certificate | Public certificates aren't used to secure custom domains, but you can load them into your code if you need them to access remote resources. |

> [!NOTE]
> After you upload a certificate to an app, the certificate is stored in a deployment unit that's bound to the App Service plan's resource group, region, and operating system combination, internally called a *webspace*. That way, the certificate is accessible to other apps in the same resource group and region combination. 

## Prerequisites

- [Create an App Service app](./index.yml).

- For a private certificate, make sure that it satisfies all [requirements from App Service](#private-certificate-requirements).

- **Free certificate only**:

  - Map the domain where you want the certificate to App Service. For information, see [Tutorial: Map an existing custom DNS name to Azure App Service](app-service-web-tutorial-custom-domain.md).
  
  - For a root domain (like contoso.com), make sure your app doesn't have any [IP restrictions](app-service-ip-restrictions.md) configured. Both certificate creation and its periodic renewal for a root domain depends on your app being reachable from the internet.

## Private certificate requirements

The [free App Service managed certificate](#create-a-free-managed-certificate) and the [App Service certificate](#buy-and-import-app-service-certificate) already satisfy the requirements of App Service. If you choose to upload or import a private certificate to App Service, your certificate must meet the following requirements:

* Exported as a [password-protected PFX file](https://en.wikipedia.org/w/index.php?title=X.509&section=4#Certificate_filename_extensions), encrypted using triple DES.
* Contains private key at least 2048 bits long
* Contains all intermediate certificates and the root certificate in the certificate chain.

To secure a custom domain in a TLS binding, the certificate has more requirements:

* Contains an [Extended Key Usage](https://en.wikipedia.org/w/index.php?title=X.509&section=4#Extensions_informing_a_specific_usage_of_a_certificate) for server authentication (OID = 1.3.6.1.5.5.7.3.1)
* Signed by a trusted certificate authority

> [!NOTE]
> **Elliptic Curve Cryptography (ECC) certificates** work with App Service but aren't covered by this article. For the exact steps to create ECC certificates, work with your certificate authority.

[!INCLUDE [Prepare your web app](../../includes/app-service-ssl-prepare-app.md)]

## Create a free managed certificate

The free App Service managed certificate is a turn-key solution for securing your custom DNS name in App Service. Without any action required from you, this TLS/SSL server certificate is fully managed by App Service and is automatically renewed continuously in six-month increments, 45 days before expiration, as long as the prerequisites that you set up stay the same. All the associated bindings are updated with the renewed certificate. You create and bind the certificate to a custom domain, and let App Service do the rest.

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

1. On your app's navigation menu, select **TLS/SSL settings**. On the pane that opens, select **Private Key Certificates (.pfx)** > **Create App Service Managed Certificate**.

   ![Screenshot of app menu with "TLS/SSL settings", "Private Key Certificates (.pfx)", and "Create App Service Managed Certificate" selected.](./media/configure-ssl-certificate/create-free-cert.png)

1. Select the custom domain for the free certificate, and then select **Create**. You can create only one certificate for each supported custom domain.

   When the operation completes, the certificate appears in the **Private Key Certificates** list.

   ![Screenshot of "Private Key Certificates" pane with newly created certificate listed.](./media/configure-ssl-certificate/create-free-cert-finished.png)

1. To secure a custom domain with this certificate, you still have to create a certificate binding. Follow the steps in [Secure a custom DNS name with a TLS/SSL binding in Azure App Service](configure-ssl-bindings.md).

## Buy and import App Service certificate

If you purchase an App Service certificate from Azure, Azure manages the following tasks:

- Handles the purchase process from GoDaddy.
- Performs domain verification of the certificate.
- Maintains the certificate in [Azure Key Vault](../key-vault/general/overview.md).
- Manages [certificate renewal](#renew-app-service-certificate).
- Synchronizes the certificate automatically with the imported copies in App Service apps.

To purchase an App Service certificate, go to [Start certificate order](#start-certificate-purchase).

> [!NOTE]
> Currently, App Service certificates aren't supported in Azure National Clouds.

If you already have a working App Service certificate, you can complete the following tasks:

- [Import the certificate into App Service](#import-certificate-into-app-service).
- [Manage the App Service certificate](#manage-app-service-certificates), such as renew, rekey, and export.

### Start certificate purchase

1. Go to the [App Service Certificate creation page](https://portal.azure.com/#create/Microsoft.SSL), and start your purchase for an App Service certificate.

   > [!NOTE]
   > In this article, all prices shown are for example purposes only.
   >
   > App Service Certificates purchased from Azure are issued by GoDaddy. For some domains, you must explicitly allow GoDaddy as a certificate issuer by creating a [CAA domain record](https://wikipedia.org/wiki/DNS_Certification_Authority_Authorization) with the value: `0 issue godaddy.com`

   :::image type="content" source="./media/configure-ssl-certificate/purchase-app-service-cert.png" alt-text="Screenshot of 'Create App Service Certificate' pane with purchase options.":::

1. To help you configure the certificate, use the following table. When you're done, select **Create**.

   | Setting | Description |
   |-|-|
   | **Subscription** | The Azure subscription to associate with the certificate. |
   | **Resource group** | The resource group that will contain the certificate. You can either create a new resource group or select the same resource group as your App Service app. |
   | **SKU** | Determines the type of certificate to create, either a standard certificate or a [wildcard certificate](https://wikipedia.org/wiki/Wildcard_certificate). |
   | **Naked Domain Host Name** | Specify the root domain. The issued certificate secures *both* the root domain and the `www` subdomain. In the issued certificate, the **Common Name** field specifies the root domain, and the **Subject Alternative Name** field specifies the `www` domain. To secure any subdomain only, specify the fully qualified domain name for the subdomain, for example, `mysubdomain.contoso.com`.|
   | **Certificate name** | The friendly name for your App Service certificate. |
   | **Enable auto renewal** | Select whether to automatically renew the certificate before expiration. Each renewal extends the certificate expiration by one year and the cost is charged to your subscription. |

### Store certificate in Azure Key Vault

[Key Vault](../key-vault/general/overview.md) is an Azure service that helps safeguard cryptographic keys and secrets used by cloud applications and services. For App Service certificates, the storage of choice is Key Vault. After you finish the certificate purchase process, you must complete a few more steps before you start using this certificate.

1. On the [App Service Certificates page](https://portal.azure.com/#blade/HubsExtension/Resources/resourceType/Microsoft.CertificateRegistration%2FcertificateOrders), select the certificate. On the certificate menu, select **Certificate Configuration** > **Step 1: Store**.

   ![Screenshot of "Certificate Configuration" pane with "Step 1: Store" selected.](./media/configure-ssl-certificate/configure-key-vault.png)

1. On the **Key Vault Status** page, to create a new vault or choose an existing vault, select **Key Vault Repository**.

1. If you create a new vault, set up the vault based on the following table, and make sure to use the same subscription and resource group as your App Service app. When you're done, select **Create**.

   | Setting | Description |
   |-|-|
   | **Name** | A unique name that uses only alphanumeric characters and dashes. |
   | **Resource group** | Recommended: The same resource group as your App Service certificate. |
   | **Location** | The same location as your App Service app. |
   | **Pricing tier** | For information, see [Azure Key Vault pricing details](https://azure.microsoft.com/pricing/details/key-vault/). |
   | **Access policies** | Defines the applications and the allowed access to the vault resources. You can set up these policies later by following the steps at [Assign a Key Vault access policy](../key-vault/general/assign-access-policy-portal.md). Currently, App Service Certificate supports only Key Vault access policies, not the RBAC model. |
   | **Virtual Network Access** | Restrict vault access to certain Azure virtual networks. You can set up this restriction later by following the steps at [Configure Azure Key Vault Firewalls and Virtual Networks](../key-vault/general/network-security.md) |

1. After you select the vault, close the **Key Vault Repository** page. The **Step 1: Store** option should show a green check mark to indicate success. Keep the page open for the next step.

### Confirm domain ownership

1. From the same **Certificate Configuration** page in the previous section, select **Step 2: Verify**.

   ![Screenshot of "Certificate Configuration" pane with "Step 2: Verify" selected.](./media/configure-ssl-certificate/verify-domain.png)

1. Select **App Service Verification**. However, because you previously mapped the domain to your web app per the [Prerequisites](#prerequisites), the domain is already verified. To finish this step, just select **Verify**, and then select **Refresh** until the message **Certificate is Domain Verified** appears.

The following domain verification methods are supported: 

| Method | Description |
|--------|-------------|
| **App Service** | The most convenient option when the domain is already mapped to an App Service app in the same subscription because the App Service app has already verified the domain ownership. Review the last step in [Confirm domain ownership](#confirm-domain-ownership). |
| **Domain** | Confirm an [App Service domain that you purchased from Azure](manage-custom-dns-buy-domain.md). Azure automatically adds the verification TXT record for you and completes the process. |
| **Mail** | Confirm the domain by sending an email to the domain administrator. Instructions are provided when you select the option. |
| **Manual** | Confirm the domain by using either a DNS TXT record or an HTML page, which applies only to **Standard** certificates per the following note.  The steps are provided after you select the option. The HTML page option doesn't work for web apps with "HTTPS Only' enabled. |

> [!IMPORTANT]
> For a **Standard** certificate, the certificate provider gives you a certificate for the requested top-level domain *and* the `www` subdomain, for example, `contoso.com` and `www.contoso.com`. However, starting December 1, 2021, [a restriction is introduced](https://azure.github.io/AppService/2021/11/22/ASC-1130-Change.html) on **App Service** and the **Manual** verification methods. To confirm domain ownership, both use HTML page verification. This method doesn't allow the certificate provider to include the `www` subdomain when issuing, rekeying, or renewing a certificate.
>
> However, the **Domain** and **Mail** verification methods continue to include the `www` subdomain with the requested top-level domain in the certificate.

### Import certificate into App Service

1. In the [Azure portal](https://portal.azure.com), from the left menu, select **App Services** > **\<app-name>**.

1. From your app's navigation menu, select **TLS/SSL settings** > **Private Key Certificates (.pfx)** > **Import App Service Certificate**.

   ![Screenshot of app menu with "TLS/SSL settings", "Private Key Certificates (.pfx)", and "Import App Service certificate" selected.](./media/configure-ssl-certificate/import-app-service-cert.png)

1. Select the certificate that you just purchased, and then select **OK**.

   When the operation completes, the certificate appears in the **Private Key Certificates** list.

   ![Screenshot of "Private Key Certificates" pane with purchased certificate listed.](./media/configure-ssl-certificate/import-app-service-cert-finished.png)

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

1. In the [Azure portal](https://portal.azure.com), on the left menu, select **App Services** > **\<app-name>**.

1. From your app's navigation menu, select **TLS/SSL settings** > **Private Key Certificates (.pfx)** > **Import Key Vault Certificate**.

   ![Screenshot of "TLS/SSL settings", "Private Key Certificates (.pfx)", and "Import Key Vault Certificate" selected.](./media/configure-ssl-certificate/import-key-vault-cert.png)

1. To help you select the certificate, use the following table:

   | Setting | Description |
   |-|-|
   | **Subscription** | The subscription associated with the key vault. |
   | **Key Vault** | The key vault that has the certificate you want to import. |
   | **Certificate** | From this list, select a PKCS12 certificate that's in the vault. All PKCS12 certificates in the vault are listed with their thumbprints, but not all are supported in App Service. |

   When the operation completes, the certificate appears in the **Private Key Certificates** list. If the import fails with an error, the certificate doesn't meet the [requirements for App Service](#private-certificate-requirements).

   ![Screenshot of "Private Key Certificates" pane with imported certificate listed.](./media/configure-ssl-certificate/import-app-service-cert-finished.png)

   > [!NOTE]
   > If you update your certificate in Key Vault with a new certificate, App Service automatically syncs your certificate within 24 hours.

1. To secure a custom domain with this certificate, you still have to create a certificate binding. Follow the steps in [Secure a custom DNS name with a TLS/SSL binding in Azure App Service](configure-ssl-bindings.md).

## Upload a private certificate

After you get a certificate from your certificate provider, make the certificate ready for App Service by following the steps in this section.

### Merge intermediate certificates

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

### Export merged private certificate to PFX

Now, export your merged TLS/SSL certificate with the private key that was used to generate your certificate request. If you generated your certificate request using OpenSSL, then you created a private key file.

> [!NOTE]
> OpenSSL v3 creates certificate serials with 20 octets (40 chars) as the X.509 specification allows. Currently only 10 octets (20 chars) is supported when uploading certificate PFX files.
> OpenSSL v3 also changed default cipher from 3DES to AES256, but this can be overridden on the command line.
> OpenSSL v1 uses 3DES as default and only uses 8 octets (16 chars) in the serial, so the PFX files generated are supported without any special modifications.

1. To export your certificate to a PFX file, run the following command, but replace the placeholders _&lt;private-key-file>_ and _&lt;merged-certificate-file>_ with the paths to your private key and your merged certificate file.

   ```bash
   openssl pkcs12 -export -out myserver.pfx -inkey <private-key-file> -in <merged-certificate-file>  
   ```

1. When you're prompted, specify a password for the export operation. When you upload your TLS/SSL certificate to App Service later, you must provide this password.

1. If you used IIS or _Certreq.exe_ to generate your certificate request, install the certificate to your local computer, and then [export the certificate to a PFX file](/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/cc754329(v=ws.11)).

### Upload certificate to App Service

You're now ready upload the certificate to App Service.

1. In the [Azure portal](https://portal.azure.com), from the left menu, select **App Services** > **\<app-name>**.

1. From your app's navigation menu, select **TLS/SSL settings** > **Private Key Certificates (.pfx)** > **Upload Certificate**.

   ![Screenshot of "TLS/SSL settings", "Private Key Certificates (.pfx)", "Upload Certificate" selected.](./media/configure-ssl-certificate/upload-private-cert.png)

1. In **PFX Certificate File**, select your PFX file. In **Certificate password**, enter the password that you created when you exported the PFX file. When you're done, select **Upload**. 

   When the operation completes, the certificate appears in the **Private Key Certificates** list.

   ![Screenshot of "Private Key Certificates" pane with uploaded certificate listed.](./media/configure-ssl-certificate/create-free-cert-finished.png)

1. To secure a custom domain with this certificate, you still have to create a certificate binding. Follow the steps in [Secure a custom DNS name with a TLS/SSL binding in Azure App Service](configure-ssl-bindings.md).

## Upload a public certificate

Public certificates are supported in the *.cer* format.

1. In the [Azure portal](https://portal.azure.com), from the left menu, select **App Services** > **\<app-name>**.

1. From your app's navigation menu, select **TLS/SSL settings** > **Public Certificates (.cer)** > **Upload Public Key Certificate**.

1. For **Name**, enter the name for the certificate. In **CER Certificate file**, select your CER file. When you're done, select **Upload**.

   ![Screenshot of name and public key certificate to upload.](./media/configure-ssl-certificate/upload-public-cert.png)

1. After the certificate is uploaded, copy the certificate thumbprint, and then review [Make the certificate accessible](configure-ssl-certificate-in-code.md#make-the-certificate-accessible).

## Renew an expiring certificate

Before a certificate expires, make sure to add the renewed certificate to App Service, and update any [TLS/SSL bindings](configure-ssl-certificate.md) where the process depends on the certificate type. For example, a [certificate imported from Key Vault](#import-a-certificate-from-key-vault), including an [App Service certificate](#buy-and-import-app-service-certificate), automatically syncs to App Service every 24 hours and updates the TLS/SSL binding when you renew the certificate. For an [uploaded certificate](#upload-a-private-certificate), there's no automatic binding update. Based on your scenario, review the corresponding section:

- [Renew an uploaded certificate](#renew-uploaded-certificate)
- [Renew an App Service certificate](#renew-app-service-certificate)
- [Renew a certificate imported from Key Vault](#renew-a-certificate-imported-from-key-vault)

## Renew uploaded certificate

When you replace an expiring certificate, the way you update the certificate binding with the new certificate might adversely affect user experience. For example, your inbound IP address might change when you delete a binding, even if that binding is IP-based. This result is especially impactful when you renew a certificate that's already in an IP-based binding. To avoid a change in your app's IP address, and to avoid downtime for your app due to HTTPS errors, follow these steps in the specified sequence:

1. [Upload the new certificate](#upload-a-private-certificate).

1. Bind the new certificate to the same custom domain without deleting the existing, expiring certificate. For this task, go to your App Service app's TLS/SSL settings pane, and select **Add Binding**.

   This action replaces the binding, rather than remove the existing certificate binding.

1. Delete the existing certificate.

## Renew App Service certificate

By default, App Service certificates have a one-year validity period. Before and nearer to the expiration date, you can automatically or manually renew App Service certificates in one-year increments. The renewal process effectively gives you a new App Service certificate with the expiration date extended to one year from the existing certificate's expiration date.

> [!NOTE]
> Starting September 23 2021, if you haven't verified the domain in the last 395 days, App Service certificates require domain verification during a renew or rekey process. The new certificate order remains in "pending issuance" mode during the renew or rekey process until you complete the domain verification.
> 
> Unlike an App Service managed certificate, domain re-verification for App Service certificates *isn't* automated. Failure to verify domain ownership results in failed renewals. For more information about how to verify your App Service certificate, review [Confirm domain ownership](#confirm-domain-ownership).
>
> The renewal process requires that the well-known [service principal for App Service has the required permissions on your key vault](deploy-resource-manager-template.md#deploy-web-app-certificate-from-key-vault). These permissions are set up for you when you import an App Service certificate through the Azure portal. Make sure that you don't remove these permisisons from your key vault.

1. To change the automatic renewal setting for your App Service certificate at any time, on the [App Service Certificates page](https://portal.azure.com/#blade/HubsExtension/Resources/resourceType/Microsoft.CertificateRegistration%2FcertificateOrders), select the certificate. 

1. On the left menu, select **Auto Renew Settings**.

1. Select **On** or **Off**, and select **Save**.

   If you turn on automatic renewal, certificates can start automatically renewing 32 days before expiration.

   ![Screenshot of specified certificate's auto renewal settings.](./media/configure-ssl-certificate/auto-renew-app-service-cert.png)

1. To manually renew the certificate instead, select **Manual Renew**. You can request to manually renew your certificate 60 days before expiration.

1. After the renew operation completes, select **Sync**.

   The sync operation automatically updates the hostname bindings for the certificate in App Service without causing any downtime to your apps.

   > [!NOTE]
   > If you don't select **Sync**, App Service automatically syncs your certificate within 24 hours.

## Renew a certificate imported from Key Vault

To renew a certificate that you imported into App Service from Key Vault, review [Renew your Azure Key Vault certificate](../key-vault/certificates/overview-renew-certificate.md).

After the certificate renews inside your key vault, App Service automatically syncs the new certificate, and updates any applicable TLS/SSL binding within 24 hours. To sync manually, follow these steps:

1. Go to your app's **TLS/SSL settings** page.

1. Under **Private Key Certificates**, select the imported certificate, and then select **Sync**. 

## Manage App Service certificates

This section includes links to tasks that help you manage an [App Service certificate that you purchased](#buy-and-import-app-service-certificate):

- [Rekey an App Service certificate](#rekey-app-service-certificate)
- [Export an App Service certificate](#export-app-service-certificate)
- [Delete an App Service certificate](#delete-app-service-certificate)
- [Renew an App Service certificate](#renew-app-service-certificate)

### Rekey App Service certificate

If you think your certificate's private key is compromised, you can rekey your certificate. This action rolls the certificate with a new certificate issued from the certificate authority.

1. On the [App Service Certificates page](https://portal.azure.com/#blade/HubsExtension/Resources/resourceType/Microsoft.CertificateRegistration%2FcertificateOrders), select the certificate. From the left menu, select **Rekey and Sync**.

1. To start the process, select **Rekey**. This process can take 1-10 minutes to complete.

   ![Screenshot of rekeying an App Service certificate.](./media/configure-ssl-certificate/rekey-app-service-cert.png)

1. You might also be required to [reconfirm domain ownership](#confirm-domain-ownership).

1. After the rekey operation completes, select **Sync**.

   The sync operation automatically updates the hostname bindings for the certificate in App Service without causing any downtime to your apps.

   > [!NOTE]
   > If you don't select **Sync**, App Service automatically syncs your certificate within 24 hours.

### Export App Service certificate

Because an App Service certificate is a [Key Vault secret](../key-vault/general/about-keys-secrets-certificates.md), you can export a copy as a PFX file, which you can use for other Azure services or outside of Azure.

> [!IMPORTANT]
> The exported certificate is an unmanaged artifact. App Service doesn't sync such artifacts when the App Service Certificate is [renewed](#renew-app-service-certificate). You must export and install the renewed certificate where necessary.

#### [Azure portal](#tab/portal)

1. On the [App Service Certificates page](https://portal.azure.com/#blade/HubsExtension/Resources/resourceType/Microsoft.CertificateRegistration%2FcertificateOrders), select the certificate.

1. On the left menu, select **Export Certificate**.

1. Select **Open in Key Vault**.

1. Select the certificate's current version.

1. Select **Download as a certificate**.

#### [Azure CLI](#tab/cli)

To export the App Service Certificate as a PFX file, run the following commands in [Azure Cloud Shell](https://shell.azure.com). Or, you can locally run Cloud Shell locally if you [installed Azure CLI](/cli/azure/install-azure-cli). Replace the placeholders with the names that you used when you [bought the App Service certificate](#start-certificate-purchase).

```azurecli-interactive
secretname=$(az resource show \
    --resource-group <group-name> \
    --resource-type "Microsoft.CertificateRegistration/certificateOrders" \
    --name <app-service-cert-name> \
    --query "properties.certificates.<app-service-cert-name>.keyVaultSecretName" \
    --output tsv)

az keyvault secret download \
    --file appservicecertificate.pfx \
    --vault-name <key-vault-name> \
    --name $secretname \
    --encoding base64
```

---

The downloaded PFX file is a raw PKCS12 file that contains both the public and private certificates and has an import password that's an empty string. You can locally install the file by leaving the password field empty. You can't [upload the file as-is into App Service](#upload-a-private-certificate) because the file isn't [password protected](#private-certificate-requirements).

### Delete App Service certificate

If you delete an App Service certificate, the delete operation is irreversible and final. The result is a revoked certificate, and any binding in App Service that uses this certificate becomes invalid.

To prevent accidental deletion, Azure puts a lock on the App Service certificate. So, to delete the certificate, you must first remove the delete lock on the certificate.

1. On the [App Service Certificates page](https://portal.azure.com/#blade/HubsExtension/Resources/resourceType/Microsoft.CertificateRegistration%2FcertificateOrders), select the certificate.

1. On the left menu, select **Locks**.

1. On your certificate, find the lock with the lock type named **Delete**. To the right side, select **Delete**.

   ![Screenshot of deleting the lock on an App Service certificate.](./media/configure-ssl-certificate/delete-lock-app-service-cert.png)

1. Now, you can delete the App Service certificate. From the left menu, select **Overview** > **Delete**.

1. When the confirmation box opens, enter the certificate name, and select **OK**.

## Automate with scripts

### Azure CLI

[Bind a custom TLS/SSL certificate to a web app](scripts/cli-configure-ssl-certificate.md)

### PowerShell

[!code-powershell[main](../../powershell_scripts/app-service/configure-ssl-certificate/configure-ssl-certificate.ps1?highlight=1-3 "Bind a custom TLS/SSL certificate to a web app")]

## More resources

* [Secure a custom DNS name with a TLS/SSL binding in Azure App Service](configure-ssl-bindings.md)
* [Enforce HTTPS](configure-ssl-bindings.md#enforce-https)
* [Enforce TLS 1.1/1.2](configure-ssl-bindings.md#enforce-tls-versions)
* [Use a TLS/SSL certificate in your code in Azure App Service](configure-ssl-certificate-in-code.md)
* [FAQ : App Service Certificates](./faq-configuration-and-management.yml)
