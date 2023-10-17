---
title: Map an existing custom domain to Azure Spring Apps
description: Learn how to map an existing custom Distributed Name Service (DNS) name to Azure Spring Apps
author: KarlErickson
ms.service: spring-apps
ms.topic: how-to
ms.date: 03/19/2020
ms.author: karler
ms.custom: devx-track-java, devx-track-extended-java, devx-track-azurecli, event-tier1-build-2022
---

# Map an existing custom domain to Azure Spring Apps

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Java ✔️ C#

**This article applies to:** ✔️ Standard ✔️ Enterprise

Domain Name Service (DNS) is a technique for storing network node names throughout a network. This article maps a domain, such as `www.contoso.com`, using a CNAME record. It secures the custom domain with a certificate and shows how to enforce Transport Layer Security (TLS), also known as Secure Sockets Layer (SSL).

Certificates encrypt web traffic. These TLS/SSL certificates can be stored in Azure Key Vault.

## Prerequisites

- An Azure subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
- (Optional) [Azure CLI](/cli/azure/install-azure-cli) version 2.45.0 or higher. Use the following command to install the Azure Spring Apps extension: `az extension add --name spring`
- An application deployed to Azure Spring Apps (see [Quickstart: Launch an existing application in Azure Spring Apps using the Azure portal](./quickstart.md), or use an existing app). If your application is deployed using the Basic plan, be sure to upgrade to the Standard plan.
- A domain name with access to the DNS registry for a domain provider, such as GoDaddy.
- A private certificate (that is, your self-signed certificate) from a third-party provider. The certificate must match the domain.
- A deployed instance of Azure Key Vault. For more information, see [About Azure Key Vault](../key-vault/general/overview.md).

## Key Vault private link considerations

The IP addresses for Azure Spring Apps management aren't yet part of the Azure Trusted Microsoft services. Therefore, to enable Azure Spring Apps to load certificates from a Key Vault protected with private endpoint connections, you must add the following IP addresses to Azure Key Vault firewall:

- `20.99.204.111`
- `20.201.9.97`
- `20.74.97.5`
- `52.235.25.35`
- `20.194.10.0`
- `20.59.204.46`
- `104.214.186.86`
- `52.153.221.222`
- `52.160.137.39`
- `20.39.142.56`
- `20.199.190.222`
- `20.79.64.6`
- `20.211.128.96`
- `52.149.104.144`
- `20.197.121.209`
- `40.119.175.77`
- `20.108.108.22`
- `102.133.143.38`
- `52.226.244.150`
- `20.84.171.169`
- `20.93.48.108`
- `20.75.4.46`
- `20.78.29.213`
- `20.106.86.34`
- `20.193.151.132`

## Import certificate

### Prepare your certificate file in PFX (optional)

Azure Key Vault supports importing private certificate in PEM and PFX format. If the PEM file you obtained from your certificate provider doesn't work in the [Save certificate in Key Vault](#save-certificate-in-key-vault) section, follow the steps here to generate a PFX for Azure Key Vault.

#### Merge intermediate certificates

If your certificate authority gives you multiple certificates in the certificate chain, you need to merge the certificates in order.

To do this task, open each certificate you received in a text editor.

Create a file for the merged certificate, called _mergedcertificate.crt_. In a text editor, copy the content of each certificate into this file. The order of your certificates should follow the order in the certificate chain, beginning with your certificate and ending with the root certificate. It looks like the following example:

```crt
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

#### Export certificate to PFX

Export your merged TLS/SSL certificate with the private key that your certificate request was generated with.

If you generated your certificate request using OpenSSL, then you have created a private key file. To export your certificate to PFX, run the following command. Replace the placeholders _&lt;private-key-file>_ and _&lt;merged-certificate-file>_ with the paths to your private key and your merged certificate file.

```bash
openssl pkcs12 -export -out myserver.pfx -inkey <private-key-file> -in <merged-certificate-file>
```

When prompted, define an export password. Use this password when uploading your TLS/SSL certificate to Azure Key Vault later.

If you used IIS or _Certreq.exe_ to generate your certificate request, install the certificate to your local machine, and then [export the certificate to PFX](/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/cc754329(v=ws.11)).

### Save certificate in Key Vault

The procedure to import a certificate requires the PEM or PFX encoded file to be on disk and you must have the private key.

#### [Azure portal](#tab/Azure-portal)

Use the following steps to upload your certificate to key vault:

1. Go to your key vault instance.
1. In the navigation pane, select **Certificates**.
1. On the upper menu, select **Generate/import**.
1. On the **Create a certificate** page, select **Import** for **Method of Certificate Creation**, and then provide a value for **Certificate Name**.
1. Under **Upload Certificate File**, navigate to certificate location and select it.
1. Under **Password**, if you're uploading a password protected certificate file, provide that password here. Otherwise, leave it blank. Once the certificate file is successfully imported, key vault removes that password.
1. Select **Create**.

   :::image type="content" source="./media/how-to-custom-domain/import-certificate-a.png" alt-text="Screenshot of the Create a certificate pane." lightbox="./media/how-to-custom-domain/import-certificate-a.png":::

#### [Azure CLI](#tab/Azure-CLI)

Use the following command to import a certificate:

```azurecli
az keyvault certificate import \
    --file <path-to-pfx-or-pem-file> \
    --name <certificate-name> \
    --vault-name <key-vault-name> \
    --password <password-if-needed>
```

---

### Grant Azure Spring Apps access to your key vault

You need to grant Azure Spring Apps access to your key vault before you import the certificate.

#### [Azure portal](#tab/Azure-portal)

use the following steps to grant access using the Azure portal:

1. Go to your key vault instance.
1. In the navigation pane, select **Access policies**.
1. On the upper menu, select **Create**.
1. Fill in the info, and select **Add** button, then **Create** access police.

| Secret permission | Certificate permission | Select principal                     |
|-------------------|------------------------|--------------------------------------|
| Get, List         | Get, List              | Azure Spring Apps Domain-Management  |

   > [!NOTE]
   > If you don't find the "Azure Spring Apps Domain-Management", search for "Azure Spring Cloud Domain-Management".

   :::image type="content" source="./media/how-to-custom-domain/import-certificate-b.png" alt-text="Screenshot of the Azure portal showing the Add Access Policy page for a key vault with Get and List selected from Secret permissions and from Certificate permissions." lightbox="./media/how-to-custom-domain/import-certificate-b.png":::

   :::image type="content" source="./media/how-to-custom-domain/import-certificate-c.png" alt-text="Screenshot of the Azure portal showing the Create Access Policy page for a key vault with Azure Spring Apps Domain-management selected from the Select a principal dropdown." lightbox="./media/how-to-custom-domain/import-certificate-c.png":::

#### [Azure CLI](#tab/Azure-CLI)

Use the following command to grant Azure Spring Apps read access to key vault:

```azurecli
az keyvault set-policy \
    --resource-group <key-vault-resource-group-name> \
    --name <key-vault-name> \
    --object-id 938df8e2-2b9d-40b1-940c-c75c33494239 \
    --certificate-permissions get list \
    --secret-permissions get list
```

---

### Import certificate to Azure Spring Apps

#### [Azure portal](#tab/Azure-portal)

1. Go to your Azure Spring Apps instance.
1. From the navigation pane, select **TLS/SSL settings**.
1. Select **Import key vault certificate**.

   :::image type="content" source="./media/how-to-custom-domain/import-certificate.png" alt-text="Screenshot of the Azure portal showing the TLS/SSL settings page for an Azure Spring Apps instance, with the Import key vault certificate button highlighted." lightbox="./media/how-to-custom-domain/import-certificate.png":::

1. On the **Select certificate from Azure** page, select the **Subscription**, **Key Vault**, and **Certificate** from the drop-down options, and then choose **Select**.

   :::image type="content" source="./media/how-to-custom-domain/select-certificate-from-key-vault.png" alt-text="Screenshot of the Azure portal showing the Select certificate from Azure page." lightbox="./media/how-to-custom-domain/select-certificate-from-key-vault.png":::

1. On the opened **Set certificate name** page, enter your certificate name, tick the **Enable auto sync** checkbox if needed, and then select **Apply**. For more details of certificate auto sync, see [here](#certificate-auto-sync).

   :::image type="content" source="./media/how-to-custom-domain/set-certificate-name.png" alt-text="Screenshot of setting certificate name.":::

1. When you have successfully imported your certificate, it displays in the list of **Private Key Certificates**.

   :::image type="content" source="./media/how-to-custom-domain/key-certificates.png" alt-text="Screenshot of a private key certificate.":::

#### [Azure CLI](#tab/Azure-CLI)

Use the following command to add a certificate:

```azurecli
az spring certificate add \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name> \
    --name <cert-name> \
    --vault-uri <key-vault-uri> \
    --vault-certificate-name <key-vault-cert-name> \
    --enable-auto-sync false
```

If you wish to enable certificate auto sync, explicitly set `--enable-auto-sync true`. For more details of certificate auto sync, see [here](#certificate-auto-sync).

Use the following command show a list of imported certificates:

```azurecli
az spring certificate list \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name>
```

---


> [!IMPORTANT]
> To secure a custom domain with this certificate, you still need to bind the certificate to a specific domain. Follow the steps in the [Add SSL Binding](#add-ssl-binding) section.

### Certificate auto sync

Certificate stored in key vault may get renewed before it expires. DevOps team in your organization may also replace it with a new one regularly, since your organization may have some security policies in certificate management. Once you enable auto sync for a certificate, Azure Spring Apps will start to poll your key vault for a new version regularly (usually every 24 hours). If a new version is found, Azure Spring Apps will import it, and then reload it for various components using the certificate without causing any downtime. The components include:
- App custom domain
- [VMware Spring Cloud Gateway](./how-to-configure-enterprise-spring-cloud-gateway.md) custom domain
- [API portal for VMware Tanzu](./how-to-use-enterprise-api-portal.md) custom domain
- [VMware Tanzu Application Accelerator](./how-to-use-accelerator.md) custom domain
- [Application Configuration Service for Tanzu](./how-to-enterprise-application-configuration-service.md)

Whenever Azure Spring Apps imports or reloads a certificate for you, an activity log will be generated.  To see your activity logs, navigate to your Azure Spring Apps instance in the Azure portal and select **Activity log** in the navigation pane.

> [!NOTE]
> This feature works with private certificates and public certificates imported from key vault. It is unavailable to content certificate, which is uploaded by customer.

You may choose to enable or disable certificate auto sync feature during importing a certificate from key vault to Azure Spring Apps. For instructions, see [here](#import-certificate-to-azure-spring-apps).

You may also enable or disable this feature for a certificate that has already been imported to Azure Spring Apps.

#### [Azure portal](#tab/Azure-portal)

Use the following steps to enable or disable auto sync for an imported certificate:

1. Go to the list of **Private Key Certificates** or **Public Key Certificates**.
1. Scroll to the right.
1. Click *...*, and then select **Enable auto sync** or **Disble auto sync**.

   :::image type="content" source="./media/how-to-custom-domain/edit-auto-sync.png" alt-text="Screenshot of toggle certificate auto sync." lightbox="./media/how-to-custom-domain/edit-auto-sync.png":::

#### [Azure CLI](#tab/Azure-CLI)

Use the following command to enable auto sync for an imported certificate:

```azurecli
az spring certificate update \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name> \
    --name <cert-name> \
    --enable-auto-sync true
```

Use the following command to disable auto sync for an imported certificate:

```azurecli
az spring certificate update \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name> \
    --name <cert-name> \
    --enable-auto-sync false
```

---

## Add Custom Domain

You can use a CNAME record to map a custom DNS name to Azure Spring Apps.

> [!NOTE]
> The A record isn't supported.

### Create the CNAME record

Go to your DNS provider and add a CNAME record to map your domain to the `<service-name>.azuremicroservices.io`. Here, `<service-name>` is the name of your Azure Spring Apps instance. We support wildcard domain and sub domain.
After you add the CNAME, the DNS records page resembles the following example:

:::image type="content" source="./media/how-to-custom-domain/dns-records.png" alt-text="Screenshot of a DNS records page." lightbox="./media/how-to-custom-domain/dns-records.png":::

## Map your custom domain to Azure Spring Apps app

If you don't have an application in Azure Spring Apps, follow the instructions in [Quickstart: Deploy your first application to Azure Spring Apps](./quickstart.md).

#### [Azure portal](#tab/Azure-portal)

Go to application page.

1. Select **Custom Domain**.
2. Then **Add Custom Domain**.

   :::image type="content" source="./media/how-to-custom-domain/custom-domain.png" alt-text="Screenshot of a custom domain page." lightbox="./media/how-to-custom-domain/custom-domain.png":::

3. Type the fully qualified domain name for which you added a CNAME record, such as www.contoso.com. Make sure that Hostname record type is set to CNAME (`<service-name>.azuremicroservices.io`)
4. Select **Validate** to enable the **Add** button.
5. Select **Add**.

   :::image type="content" source="./media/how-to-custom-domain/add-custom-domain.png" alt-text="Screenshot of the Add custom domain pane.":::

One app can have multiple domains, but one domain can only map to one app. When you successfully mapped your custom domain to the app, it displays on the custom domain table.

:::image type="content" source="./media/how-to-custom-domain/custom-domain-table.png" alt-text="Screenshot of the custom domain table." lightbox="./media/how-to-custom-domain/custom-domain-table.png":::

#### [Azure CLI](#tab/Azure-CLI)

Use the following command to bind a custom domain with the app:

```azurecli
az spring app custom-domain bind \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name> \
    --domain-name <domain-name> \
    --app <app-name> 

```

Use the following command to show the list of custom domains:

```azurecli
az spring app custom-domain list \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name> \
    --app <app-name>
```

---

> [!NOTE]
> A **Not Secure** label for your custom domain means that it's not yet bound to an SSL certificate. Any HTTPS request from a browser to your custom domain receives an error or warning.

## Add SSL binding

#### [Azure portal](#tab/Azure-portal)

In the custom domain table, select **Add ssl binding** as shown in the previous figure.

1. Select your **Certificate** or import it.
1. Select **Save**.

   :::image type="content" source="./media/how-to-custom-domain/add-ssl-binding.png" alt-text="Screenshot of the SSL Binding pane.":::

#### [Azure CLI](#tab/Azure-CLI)

Use the following command to update a custom domain of the app.

```azurecli
az spring app custom-domain update \
    --resource-group <resource-group-name>  \
    --service <service-name> \
    --domain-name <domain-name> \
    --certificate <cert-name> \
    --app <app-name>

```

---

After you successfully add SSL binding, the domain state is secure: **Healthy**.

:::image type="content" source="./media/how-to-custom-domain/secured-domain-state.png" alt-text="Screenshot of an SSL binding." lightbox="./media/how-to-custom-domain/secured-domain-state.png":::

## Enforce HTTPS

By default, anyone can still access your app using HTTP, but you can redirect all HTTP requests to the HTTPS port.

#### [Azure portal](#tab/Azure-portal)

In your app page, in the navigation, select **Custom Domain**. Then, set **HTTPS Only** to `Yes`.

:::image type="content" source="./media/how-to-custom-domain/enforce-https.png" alt-text="Screenshot of an SSL binding with the Https Only option highlighted.":::

#### [Azure CLI](#tab/Azure-CLI)

Use the following command to update the configurations of an app.

```azurecli
az spring app update \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name> \
    --name <app-name> \
    --https-only
```

---

When the operation is complete, navigate to any of the HTTPS URLs that point to your app. Note that HTTP URLs don't work.

## Next steps

- [What is Azure Key Vault?](../key-vault/general/overview.md)
- [Import a certificate](../key-vault/certificates/certificate-scenarios.md#import-a-certificate)
- [Use TLS/SSL certificates](./how-to-use-tls-certificate.md)
