---
title: Manage App Service Certificates
description: Learn how to purchase and manage App Service certificates for your custom domain in Azure App Service.
keywords: App Service certificate, buy SSL certificate, Azure security, domain encryption
tags: buy-ssl-certificates

ms.topic: tutorial
ms.date: 02/15/2025
ms.reviewer: yutlin
ms.author: msangapu
author: msangapu-msft
---

# Buy and manage App Service certificates

This article shows you how to create an Azure App Service certificate and perform management tasks like renewing, synchronizing, and deleting certificates. After you have an App Service certificate, you can then import it into an App Service app. An App Service certificate is a private certificate that Azure manages. It combines the simplicity of automated certificate management and the flexibility of renewal and export options.

If you purchase an App Service certificate from Azure, Azure manages the following tasks:

- Handles the purchase process from GoDaddy.
- Performs domain verification of the certificate.
- Maintains the certificate in [Azure Key Vault](/azure/key-vault/general/overview).
- Manages [certificate renewal](#renew-an-app-service-certificate).
- Synchronizes the certificate automatically with the imported copies in App Service apps.

After you upload a certificate to an app, the certificate is stored in a deployment unit that's bound to the App Service plan's resource group, region, and operating system combination. Internally, it's called a *webspace*. That way, the certificate is accessible to other apps in the same resource group and region combination. Certificates uploaded or imported to App Service are shared with app services in the same deployment unit.

## Prerequisites

- [Create an App Service app](./index.yml). The app's [App Service plan](overview-hosting-plans.md) must be in the Basic, Standard, Premium, or Isolated tier. To update the tier, see [Scale up an app](manage-scale-up.md#scale-up-your-pricing-tier).

Currently, App Service certificates aren't supported in Azure national clouds.

## Buy and configure an App Service certificate

#### Buy the certificate

1. Go to the [Create App Service certificate page](https://portal.azure.com/#create/Microsoft.SSL) to start the purchase.

   > [!NOTE]
   > GoDaddy issues App Service certificates that are purchased from Azure. For some domains, you must explicitly allow GoDaddy as a certificate issuer by creating a [Certification Authority Authorization domain record](https://wikipedia.org/wiki/DNS_Certification_Authority_Authorization) with the value `0 issue godaddy.com`.

   :::image type="content" source="./media/configure-ssl-certificate/purchase-app-service-cert.png" alt-text="Screenshot that shows the Create App Service certificate pane with purchase options.":::

1. To configure the certificate, use the following table. When you're finished, select **Review + Create**, and then select **Create**.

   | Setting | Description |
   |-|-|
   | **Subscription** | The Azure subscription to associate with the certificate. |
   | **Resource Group** | The resource group that contains the certificate. You can either create a new resource group or select the same resource group as your App Service app. |
   | **SKU** | Determines the type of certificate to create, either a standard certificate or a [wildcard certificate](https://wikipedia.org/wiki/Wildcard_certificate). |
   | **Naked domain hostname** | Specify the root domain. The issued certificate provides security for *both* the root domain and the `www` subdomain. In the issued certificate, the **Common Name** field specifies the root domain. The **Subject Alternative Name** field specifies the `www` domain. To provide security for only a subdomain, specify the fully qualified domain name for the subdomain, for example, `mysubdomain.contoso.com`.|
   | **Certificate name** | The friendly name for your App Service certificate. |
   | **Enable auto renewal** | Select whether to automatically renew the certificate before expiration. Each renewal extends the certificate expiration by one year. The cost is charged to your subscription. |

1. After the deployment is finished, select **Go to resource**.

#### Store the certificate in Azure Key Vault

[Key Vault](/azure/key-vault/general/overview) is an Azure service that helps safeguard cryptographic keys and secrets used by cloud applications and services. For App Service certificates, we recommend that you use Key Vault. After you finish the certificate purchase process, you must complete a few more steps before you start using the certificate.

1. On the [App Service Certificates page](https://portal.azure.com/#blade/HubsExtension/Resources/resourceType/Microsoft.CertificateRegistration%2FcertificateOrders), select the certificate. On the certificate pane, select **Certificate Configuration** > **Step 1: Store**.

    :::image type="content" source="media/configure-ssl-certificate/configure-key-vault.png" alt-text="Screenshot that shows the Certificate Configuration pane with Step 1: Store selected.":::

1. On the **Key Vault Status** page, choose **Select from Key Vault**.

1. If you create a new vault, set up the vault based on the following table. Make sure to use the same subscription and resource group as your App Service app.

   | Setting | Description |
   |-|-|
   | **Resource group** | Recommended: The same resource group as your App Service certificate. |
   | **Key vault name** | A unique name that uses only alphanumeric characters and dashes. |
   | **Region** | The same location as your App Service app. |
   | **Pricing tier** | For information, see [Azure Key Vault pricing details](https://azure.microsoft.com/pricing/details/key-vault/). |
   | **Days to retain deleted vaults** | The number of days, after deletion, that objects remain recoverable. (See [Azure Key Vault soft-delete overview](/azure/key-vault/general/soft-delete-overview).) Set a value between 7 and 90. |
   | **Purge protection** | Enabling this option forces all deleted objects to remain in soft-deleted state for the entire duration of the retention period. |

1. Select **Next** and then select **Vault access policy**. Currently, App Service certificates support only Key Vault access policies, not the role-based access control model.
1. Select **Review + create**, and then select **Create**.
1. After the key vault is created, don't select **Go to resource**. Wait for the **Select key vault from Azure Key Vault** page to reload.
1. Choose **Select**.
1. After you select the vault, close the **Key Vault Repository** page. The **Step 1: Store** option should show a green check mark to indicate success. Keep the page open for the next step.

#### Confirm domain ownership

1. On the same **Certificate Configuration** page as in the previous section, select **Step 2: Verify**.

    :::image type="content" source="media/configure-ssl-certificate/verify-domain.png" alt-text="Screenshot the shows the Certificate Configuration pane with Step 2: Verify selected.":::

1. Select **App Service Verification**. Because you mapped the domain to your web app earlier in this section, the domain is already verified. To finish this step, select **Verify**, and then select **Refresh** until the message **Certificate is Domain Verified** appears.

The following domain verification methods are supported:

| Method | Description |
|--------|-------------|
| App Service verification | The most convenient option when the domain is already mapped to an App Service app in the same subscription because the App Service app verified the domain ownership. Review the last step in [Confirm domain ownership](#confirm-domain-ownership). |
| Domain verification | Confirm an [App Service domain that you purchased from Azure](manage-custom-dns-buy-domain.md). Azure automatically adds the verification TXT record for you and finishes the process. |
| Mail verification | Confirm the domain by sending an email to the domain administrator. Instructions are provided when you select the option. |
| Manual verification | Confirm the domain by using either a Domain Name System (DNS) TXT record or an HTML page. (The latter applies only to Standard certificates. See the following note.) The steps are provided after you select the option. The HTML page option doesn't work for web apps with **HTTPS Only** enabled. For domain verification via DNS TXT record for either the root domain (for example, `contoso.com`) or the subdomain (for example, `www.contoso.com` or `test.api.contoso.com`) and regardless of the certificate SKU, you need to add a TXT record at the root domain level. Use `@` for the name and the domain verification token for the value in your DNS record. |

> [!IMPORTANT]
> With the Standard certificate, you get a certificate for the requested top-level domain *and* the `www` subdomain, for example, `contoso.com` and `www.contoso.com`. App Service verification and manual verification both use HTML page verification, which doesn't support the `www` subdomain when you issue, rekey, or renew a certificate. For the Standard certificate, use domain verification and mail verification to include the `www` subdomain with the requested top-level domain in the certificate.

After your certificate is domain verified, [you can import it into an App Service app](configure-ssl-certificate.md#import-an-app-service-certificate).

## Renew an App Service certificate

By default, App Service certificates have a one-year validity period. Before the expiration date, you can automatically or manually renew App Service certificates in one-year increments. The renewal process effectively gives you a new App Service certificate with the expiration date extended to one year from the existing certificate's expiration date.

As of September 23, 2021, if you haven't verified the domain in the last 395 days, App Service certificates require domain verification during a renewal, autorenewal, or rekey process. The new certificate order remains in **Pending issuance** mode during the renewal, autorenewal, or rekey process until you finish the domain verification.

Unlike the free App Service managed certificate, purchased App Service certificates don't have automated domain reverification. Failure to verify domain ownership results in failed renewals. For more information about how to verify your App Service certificate, review [Confirm domain ownership](#confirm-domain-ownership).

The renewal process requires that the service principal for App Service has the required permissions on your key vault. These permissions are set up for you when you import an App Service certificate through the Azure portal. Make sure that you don't remove these permissions from your key vault.

1. To change the automatic renewal setting for your App Service certificate at any time, on the [App Service Certificates page](https://portal.azure.com/#blade/HubsExtension/Resources/resourceType/Microsoft.CertificateRegistration%2FcertificateOrders), select the certificate.

1. On the left pane, select **Auto Renew Settings**.

1. Select **On** or **Off**, and then select **Save**.

   If you turn on automatic renewal, certificates can start automatically renewing 32 days before expiration.

   :::image type="content" source="./media/configure-ssl-certificate/auto-renew-app-service-cert.png" alt-text="Screenshot that shows the specified certificate's autorenewal settings." lightbox="./media/configure-ssl-certificate/auto-renew-app-service-cert.png":::

1. To manually renew the certificate instead, select **Manual Renew**. You can request to manually renew your certificate 60 days before expiration, but [certificates can't be issued for longer than 397 days](https://www.godaddy.com/help/important-notification-about-ssl-offerings-9322).

1. After the renewal operation finishes, select **Sync**.

   The sync operation automatically updates the hostname bindings for the certificate in App Service without causing any downtime to your apps.

   If you don't select **Sync**, App Service automatically syncs your certificate within 24 hours.

## Rekey an App Service certificate

If you think your certificate's private key is compromised, you can rekey your certificate. This action rotates the certificate with a new certificate issued from the certificate authority.

As of September 23, 2021, if you haven't verified the domain in the last 395 days, App Service certificates require domain verification during a renewal, autorenewal, or rekey process. The new certificate order remains in **Pending issuance** mode during the renewal, autorenewal, or rekey process until you finish the domain verification.

Unlike the free App Service managed certificate, purchased App Service certificates don't have automated domain reverification. Failure to verify domain ownership results in failed renewals. For more information about how to verify your App Service certificate, review [Confirm domain ownership](#confirm-domain-ownership).

The rekey process requires that the service principal for App Service has the required permissions on your key vault. These permissions are set up for you when you import an App Service certificate through the Azure portal. Make sure that you don't remove these permissions from your key vault.

1. On the [App Service Certificates page](https://portal.azure.com/#blade/HubsExtension/Resources/resourceType/Microsoft.CertificateRegistration%2FcertificateOrders), select the certificate. On the left pane, select **Rekey and Sync**.

1. To start the process, select **Rekey**. This process can take 1 to 10 minutes to finish.

   :::image type="content" source="./media/configure-ssl-certificate/rekey-app-service-cert.png" alt-text="Screenshot that shows rekeying an App Service certificate." lightbox="./media/configure-ssl-certificate/rekey-app-service-cert.png":::

1. You might also be required to [reconfirm domain ownership](#confirm-domain-ownership).

1. After the rekey operation finishes, select **Sync**.

   The sync operation automatically updates the hostname bindings for the certificate in App Service without causing any downtime to your apps.

   If you don't select **Sync**, App Service automatically syncs your certificate within 24 hours.

## Export an App Service certificate

Because an App Service certificate is a [Key Vault secret](/azure/key-vault/general/about-keys-secrets-certificates), you can export a copy as a .pfx file, which you can use for other Azure services or outside of Azure.

The exported certificate is an unmanaged artifact. App Service doesn't sync such artifacts when the App Service certificate is [renewed](#renew-an-app-service-certificate). You must export and install the renewed certificate where necessary.

#### [Azure portal](#tab/portal)

1. On the [App Service Certificates page](https://portal.azure.com/#blade/HubsExtension/Resources/resourceType/Microsoft.CertificateRegistration%2FcertificateOrders), select the certificate.

1. On the left pane, select **Export Certificate**.

1. Select **Open Key Vault Secret**.

1. Select the certificate's current version.

1. Select **Download as a certificate**.

#### [Azure CLI](#tab/cli)

Run the following commands in [Azure Cloud Shell](https://shell.azure.com), or run them locally if you [installed the Azure CLI](/cli/azure/install-azure-cli). Replace the placeholders with the names that you used when you [bought the App Service certificate](#buy-the-certificate).

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

#### [Azure PowerShell](#tab/powershell)

```azurepowershell-interactive
$ascName = <app-service-cert-name>
$ascResource = Get-AzResource -ResourceType "Microsoft.CertificateRegistration/certificateOrders" -Name $ascName -ResourceGroupName <group-name> -ExpandProperties
$keyVaultSecretName = $ascResource.Properties.certificates[0].$ascName.KeyVaultSecretName
$CertBase64 = Get-AzKeyVaultSecret -VaultName <key-vault-name> -Name $keyVaultSecretName -AsPlainText
$CertBytes = [Convert]::FromBase64String($CertBase64)
Set-Content -Path appservicecertificate.pfx -Value $CertBytes -AsByteStream
```

---

The downloaded .pfx file is a raw PKCS12 file that contains both the public and private certificates and has an import password that's an empty string. You can locally install the file by leaving the password field empty. You can't [upload the file as it is into App Service](configure-ssl-certificate.md#upload-a-private-certificate) because the file isn't [password protected](configure-ssl-certificate.md#private-certificate-requirements).

## Use Azure Advisor for App Service certificates

An App Service certificate is integrated with [Azure Advisor](/azure/advisor/advisor-overview) to provide reliability recommendations for when your certificate requires domain verification. If you haven't verified the domain in the last 395 days, you must verify domain ownership for your certificate during the renewal, autorenewal, or rekey process. To make sure that you don't miss any certificate that requires verification or risk any certificate from expiring, use Advisor to view and set up alerts for the App Service certificate.

### View Advisor recommendations

To view Advisor recommendations for the App Service certificate:

1. Go to the [Azure Advisor page](https://portal.azure.com/#view/Microsoft_Azure_Expert/AdvisorMenuBlade/~/overview).

1. On the left pane, select **Recommendations** > **Reliability**.

1. Select the filter option **Type equals** and search for **App Service Certificates** in the dropdown list. If the value doesn't exist in the dropdown list, that means no recommendation was generated for your App Service certificate resources because none of them requires domain ownership verification.

### Create Advisor alerts

You create Advisor alerts on new recommendations by using different configurations. To set up Advisor alerts specifically for an App Service certificate so that you can get notifications when your certificate requires domain ownership validation:

1. Go to the [Azure Advisor page](https://portal.azure.com/#view/Microsoft_Azure_Expert/AdvisorMenuBlade/~/overview).

1. On the left pane, select **Monitoring** > **Alerts (Preview)**.

1. Select **+ New Advisor Alert** on the bar at the top to open the **Create Advisor Alerts** pane.

1. Under **Condition**, select the following option:

   |Configured by| Recommendation type|
   |-|-|
   |Recommendation type|Domain verification required to issue your App Service certificate.|

1. Fill out the rest of the required fields, and then select **Create alert**.

## Delete an App Service certificate

If you delete an App Service certificate, the delete operation is irreversible and final. The result is a revoked certificate. Any binding in App Service that uses the certificate becomes invalid.

1. On the [App Service Certificates page](https://portal.azure.com/#blade/HubsExtension/Resources/resourceType/Microsoft.CertificateRegistration%2FcertificateOrders), select the certificate.

1. On the left pane, select **Overview** > **Delete**.

1. When the confirmation box opens, enter the certificate name, and then select **OK**.

## Frequently asked questions

#### Why doesn't my App Service certificate have a value in Key Vault?

Your App Service certificate is probably not yet domain verified. Until [domain ownership is confirmed](#confirm-domain-ownership), your App Service certificate isn't ready for use. As a key vault secret, it maintains an `Initialize` tag, and its value and content type remain empty. When domain ownership is confirmed, the key vault secret shows a value and a content type, and the tag changes to `Ready`.

#### Why can't I export my App Service certificate with PowerShell?

Your App Service certificate is probably not yet domain verified. Until [domain ownership is confirmed](#confirm-domain-ownership), your App Service certificate isn't ready for use.

#### What changes does the App Service certificate creation process make to my existing key vault?

The creation process makes the following changes:

- Adds two access policies in the vault:
    - **Microsoft Azure App Service** (or `Microsoft.Azure.WebSites`)
    - **Microsoft certificate reseller CSM Resource Provider** (or `Microsoft.Azure.CertificateRegistration`)
- Creates a [delete lock](../azure-resource-manager/management/lock-resources.md) called `AppServiceCertificateLock` on the vault to prevent accidental deletion of the key vault.

## Related content

* [Secure a custom DNS name with a TLS/SSL binding in Azure App Service](configure-ssl-bindings.md)
* [Enforce HTTPS](configure-ssl-bindings.md#enforce-https)
* [Enforce TLS 1.1/1.2](configure-ssl-bindings.md#enforce-tls-versions)
* [Use a TLS/SSL certificate in your code in Azure App Service](configure-ssl-certificate-in-code.md)
* [Frequently asked questions about creating or deleting resources in Azure App Service](./faq-configuration-and-management.yml)
