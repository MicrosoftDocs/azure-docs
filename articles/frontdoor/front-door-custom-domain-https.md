---
title: Configure HTTPS on an Azure Front Door (classic) custom domain
titleSuffix: Azure Front Door
description: Learn how to enable and disable HTTPS on your Azure Front Door (classic) configuration for a custom domain.
services: frontdoor
author: duongau
ms.service: azure-frontdoor
ms.topic: how-to
ms.date: 11/15/2024
ms.author: duau
#Customer intent: As a website owner, I want to enable HTTPS on the custom domain in my Front Door (classic) so that my users can use my custom domain to access their content securely.
---

# Configure HTTPS on an Azure Front Door (classic) custom domain

[!INCLUDE [Azure Front Door (classic) retirement notice](../../includes/front-door-classic-retirement.md)]

This article explains how to enable HTTPS for a custom domain associated with your Front Door (classic). Using HTTPS on your custom domain (for example, `https://www.contoso.com`) ensures secure data transmission via TLS/SSL encryption. When a web browser connects to a website using HTTPS, it validates the website's security certificate and verifies its legitimacy, providing security and protecting your web applications from malicious attacks.

Azure Front Door supports HTTPS by default on its default hostname (for example, `https://contoso.azurefd.net`). However, you need to enable HTTPS separately for custom domains like `www.contoso.com`.

Key attributes of the custom HTTPS feature include:

- **No extra cost**: No costs for certificate acquisition, renewal, or HTTPS traffic.
- **Simple enablement**: One-select provisioning via the [Azure portal](https://portal.azure.com), REST API, or other developer tools.
- **Complete certificate management**: Automatic certificate procurement and renewal, eliminating the risk of service interruption due to expired certificates.

In this tutorial, you learn to:
> [!div class="checklist"]
> - Enable HTTPS on your custom domain.
> - Use an AFD-managed certificate.
> - Use your own TLS/SSL certificate.
> - Validate the domain.
> - Disable HTTPS on your custom domain.

[!INCLUDE [updated-for-az](~/reusable-content/ce-skilling/azure/includes/updated-for-az.md)]

## Prerequisites

Before starting, ensure you have a Front Door with at least one custom domain onboarded. For more information, see [Tutorial: Add a custom domain to your Front Door](front-door-custom-domain.md).

## TLS/SSL certificates

To enable HTTPS on a Front Door (classic) custom domain, you need a TLS/SSL certificate. You can either use a certificate managed by Azure Front Door or your own certificate.

### Option 1 (default): Use a certificate managed by Front Door

Using a certificate managed by Azure Front Door allows you to enable HTTPS with a few settings changes. Azure Front Door handles all certificate management tasks, including procurement and renewal. If your custom domain is already mapped to the Front Door's default frontend host (`{hostname}.azurefd.net`), no further action is required. Otherwise, you must validate your domain ownership via email.

To enable HTTPS on a custom domain:

1. In the [Azure portal](https://portal.azure.com), go to your **Front Door** profile.

1. Select the custom domain you want to enable HTTPS for from the list of frontend hosts.

1. Under **Custom domain HTTPS**, select **Enabled** and choose **Front Door managed** as the certificate source.

1. Select **Save**.

1. Proceed to [Validate the domain](#validate-the-domain).

> [!NOTE]
> - DigiCert’s 64 character limit is enforced for Azure Front Door-managed certificates. Validation will fail if this limit is exceeded.
> - Enabling HTTPS via Front Door managed certificate is not supported for apex/root domains (e.g., contoso.com). Use your own certificate for this scenario (see Option 2).

### Option 2: Use your own certificate

You can use your own certificate through an integration with Azure Key Vault. Ensure your certificate is from a [Microsoft Trusted CA List](https://ccadb-public.secure.force.com/microsoft/IncludedCACertificateReportForMSFT) and has a complete certificate chain.

#### Prepare your key vault and certificate

- Create a key vault account in the same Azure subscription as your Front Door.
- Configure your key vault to allow trusted Microsoft services to bypass the firewall if network access restrictions are enabled.
- Use the *Key Vault access policy* permission model.
- Upload your certificate as a **certificate** object, not a **secret**.

> [!NOTE]
> Front Door doesn't support certificates with elliptic curve (EC) cryptography algorithms. The certificate must have a complete certificate chain with leaf and intermediate certificates, and root CA must be part of the [Microsoft Trusted CA list](https://ccadb-public.secure.force.com/microsoft/IncludedCACertificateReportForMSFT).

#### Register Azure Front Door

Register the Azure Front Door service principal in your Microsoft Entra ID using Azure PowerShell or Azure CLI.

##### Azure PowerShell

1. Install [Azure PowerShell](/powershell/azure/install-azure-powershell) if needed.

1. Run the following command:

    ```azurepowershell-interactive
    New-AzADServicePrincipal -ApplicationId "ad0e1c7e-6d38-4ba4-9efd-0bc77ba9f037"
    ```

##### Azure CLI

1. Install [Azure CLI](/cli/azure/install-azure-cli) if needed.

1. Run the following command:

    ```azurecli-interactive
    az ad sp create --id ad0e1c7e-6d38-4ba4-9efd-0bc77ba9f037
    ```

#### Grant Azure Front Door access to your key vault

1. In your key vault account, select **Access policies**.

1. Select **Create** to create a new access policy.

1. In **Secret permissions**, select **Get**.

1. In **Certificate permissions**, select **Get**.

1. In **Select principal**, search for **ad0e1c7e-6d38-4ba4-9efd-0bc77ba9f037** and select **Microsoft.Azure.Frontdoor**. Select **Next**.

1. Select **Next** in **Application**.

1. Select **Create** in **Review + create**.

> [!NOTE]
> If your key vault has network access restrictions, allow trusted Microsoft services to access your key vault.

#### Select the certificate for Azure Front Door to deploy

1. Return to your Front Door in the portal.

1. Select the custom domain for which you want to enable HTTPS.

1. Under **Certificate management type**, select **Use my own certificate**.

1. Select a key vault, Secret, and Secret version.

    > [!NOTE]
    > To enable automatic certificate rotation, set the secret version to 'Latest'. If a specific version is selected, you must manually update it for certificate rotation.

    > [!WARNING]
    > Ensure your service principal has GET permission on the Key Vault. To see the certificate in the portal drop-down, your user account must have LIST and GET permissions on the Key Vault.

1. When using your own certificate, domain validation isn't required. Proceed to [Wait for propagation](#wait-for-propagation).

## Validate the domain

If your custom domain is mapped to your custom endpoint with a CNAME record or you're using your own certificate, continue to [Custom domain is mapped to your Front Door](#custom-domain-is-mapped-to-your-front-door-by-a-cname-record). Otherwise, follow the instructions in [Custom domain isn't mapped to your Front Door](#custom-domain-isnt-mapped-to-your-front-door).

### Custom domain is mapped to your Front Door by a CNAME record

If your CNAME record still exists and doesn't contain the afdverify subdomain, DigiCert automatically validates ownership of your custom domain.

Your CNAME record should be in the following format:

| Name            | Type  | Value                 |
|-----------------|-------|-----------------------|
| <www.contoso.com> | CNAME | contoso.azurefd.net |

For more information about CNAME records, see [Create the CNAME DNS record](../cdn/cdn-map-content-to-custom-domain.md).

If your CNAME record is correct, DigiCert automatically verifies your custom domain and creates a dedicated certificate. The certificate is valid for one year and autorenews before it expires. Continue to [Wait for propagation](#wait-for-propagation).

> [!NOTE]
> If you have a Certificate Authority Authorization (CAA) record with your DNS provider, it must include DigiCert as a valid CA. For more information, see [Manage CAA records](https://support.dnsimple.com/articles/manage-caa-record/).

### Custom domain isn't mapped to your Front Door

If the CNAME record entry for your endpoint no longer exists or contains the afdverify subdomain, follow these instructions.

After enabling HTTPS on your custom domain, DigiCert validates ownership by contacting the domain's registrant via email or phone listed in the WHOIS registration. You must complete domain validation within six business days. DigiCert domain validation works at the subdomain level.

:::image type="content" source="./media/front-door-custom-domain-https/whois-record.png" alt-text="Screenshot of WHOIS record.":::

DigiCert also sends a verification email to the following addresses if the WHOIS registrant information is private:

- admin@&lt;your-domain-name.com&gt;
- administrator@&lt;your-domain-name.com&gt;
- webmaster@&lt;your-domain-name.com&gt;
- hostmaster@&lt;your-domain-name.com&gt;
- postmaster@&lt;your-domain-name.com&gt;

You should receive an email asking you to approve the request. If you don't receive an email within 24 hours, contact Microsoft support.

After approval, DigiCert completes the certificate creation. The certificate is valid for one year and autorenews if the CNAME record is mapped to your Azure Front Door's default hostname.

> [!NOTE]
> Managed certificate autorenewal requires that your custom domain be directly mapped to your Front Door's default .azurefd.net hostname by a CNAME record.

## Wait for propagation

After domain validation, it can take up to 6-8 hours for the custom domain HTTPS feature to be activated. When complete, the custom HTTPS status in the Azure portal is set to **Enabled**.

### Operation progress

The following table shows the operation progress when enabling HTTPS:

| Operation step | Operation substep details |
| --- | --- |
| 1. Submitting request | Submitting request |
| | Your HTTPS request is being submitted. |
| | Your HTTPS request was submitted successfully. |
| 2. Domain validation | Domain is automatically validated if CNAME mapped to the default .azurefd.net frontend host. Otherwise, a verification request is sent to the email listed in your domain's registration record (WHOIS registrant). Verify the domain as soon as possible. |
| | Your domain ownership was successfully validated. |
| | Domain ownership validation request expired (customer likely didn't respond within six days). HTTPS isn't enabled on your domain. * |
| | Domain ownership validation request rejected by the customer. HTTPS isn't enabled on your domain. * |
| 3. Certificate provisioning | The certificate authority is issuing the certificate needed to enable HTTPS on your domain. |
| | The certificate was issued and is being deployed for your Front Door. This process could take several minutes to an hour. |
| | The certificate was successfully deployed for your Front Door. |
| 4. Complete | HTTPS was successfully enabled on your domain. |

\* This message appears only if an error occurs.

If an error occurs before the request is submitted, the following error message is displayed:

<code>
We encountered an unexpected error while processing your HTTPS request. Please try again and contact support if the issue persists.
</code>

## Frequently asked questions

1. **Who is the certificate provider and what type of certificate is used?**

    A dedicated/single certificate, provided by DigiCert, is used for your custom domain.

1. **Do you use IP-based or SNI TLS/SSL?**

    Azure Front Door uses SNI TLS/SSL.

1. **What if I don't receive the domain verification email from DigiCert?**

    If you have a CNAME entry for your custom domain that points directly to your endpoint hostname and you aren't using the afdverify subdomain name, you don't receive a domain verification email. Validation occurs automatically. Otherwise, if you don't have a CNAME entry and didn't receive an email within 24 hours, contact Microsoft support.

1. **Is using a SAN certificate less secure than a dedicated certificate?**

    A SAN certificate follows the same encryption and security standards as a dedicated certificate. All issued TLS/SSL certificates use SHA-256 for enhanced server security.

1. **Do I need a Certificate Authority Authorization record with my DNS provider?**

    No, a Certificate Authority Authorization record isn't currently required. However, if you do have one, it must include DigiCert as a valid CA.

## Clean up resources

To disable HTTPS on your custom domain:

### Disable the HTTPS feature

1. In the [Azure portal](https://portal.azure.com), go to your **Azure Front Door** configuration.

1. Select the custom domain for which you want to disable HTTPS.

1. Select **Disabled** and select **Save**.

### Wait for propagation

After disabling the custom domain HTTPS feature, it can take up to 6-8 hours to take effect. When complete, the custom HTTPS status in the Azure portal is set to **Disabled**.

#### Operation progress

The following table shows the operation progress when disabling HTTPS:

| Operation progress | Operation details |
| --- | --- |
| 1. Submitting request | Submitting your request |
| 2. Certificate deprovisioning | Deleting certificate |
| 3. Complete | Certificate deleted |

## Next steps

To learn how to [set up a geo-filtering policy](front-door-geo-filtering.md) for your Front Door, continue to the next tutorial.
