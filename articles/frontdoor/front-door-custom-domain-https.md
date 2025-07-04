---
title: Configure HTTPS on Front Door (classic) custom domain
description: Learn how to enable and disable HTTPS on your Azure Front Door (classic) configuration for a custom domain.
author: halkazwini
ms.author: halkazwini
ms.service: azure-frontdoor
ms.topic: how-to
ms.date: 05/15/2025

#Customer intent: As a website owner, I want to enable HTTPS on the custom domain in my Front Door (classic) so that my users can use my custom domain to access their content securely.
ms.custom:
  - build-2025
---

# Configure HTTPS on an Azure Front Door (classic) custom domain

**Applies to:** :heavy_check_mark: Front Door (classic)

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

## Prerequisites

# [**PowerShell**](#tab/powershell)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An Azure Front Door with at least one custom domain onboarded. For more information, see [Tutorial: Add a custom domain to your Front Door](front-door-custom-domain.md).

- Azure Cloud Shell or Azure PowerShell to register Front Door service principal in your Microsoft Entra ID when [using your own certificate](#option-2-use-your-own-certificate).

    The steps in this article run the Azure PowerShell cmdlets interactively in [Azure Cloud Shell](/azure/cloud-shell/overview). To run the cmdlets in the Cloud Shell, select **Open Cloud Shell** at the upper-right corner of a code block. Select **Copy** to copy the code and then paste it into Cloud Shell to run it. You can also run the Cloud Shell from within the Azure portal.

    You can also [install Azure PowerShell locally](/powershell/azure/install-azure-powershell) to run the cmdlets. If you run PowerShell locally, sign in to Azure using the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) cmdlet.

# [**Azure CLI**](#tab/cli)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An Azure Front Door with at least one custom domain onboarded. For more information, see [Tutorial: Add a custom domain to your Front Door](front-door-custom-domain.md).

- Azure Cloud Shell or Azure CLI to register Front Door service principal in your Microsoft Entra ID when [using your own certificate](#option-2-use-your-own-certificate).

    The steps in this article run the Azure CLI commands interactively in [Azure Cloud Shell](/azure/cloud-shell/overview). To run the commands in the Cloud Shell, select **Open Cloud Shell** at the upper-right corner of a code block. Select **Copy** to copy the code, and paste it into Cloud Shell to run it. You can also run the Cloud Shell from within the Azure portal.

    You can also [install Azure CLI locally](/cli/azure/install-azure-cli) to run the commands. If you run Azure CLI locally, sign in to Azure using the [az login](/cli/azure/reference-index#az-login) command.

---

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
> - Enabling HTTPS via Front Door managed certificate isn't supported for apex/root domains (for example, contoso.com). Use your own certificate for this scenario (see Option 2).

### Option 2: Use your own certificate

You can use your own certificate through an integration with Azure Key Vault. Ensure your certificate is from a [Microsoft Trusted CA List](/security/trusted-root/participants-list) and has a complete certificate chain.

#### Prepare your key vault and certificate

- Create a key vault account in the same Azure subscription as your Front Door.
- Configure your key vault to allow trusted Microsoft services to bypass the firewall if network access restrictions are enabled.
- Use the *Key Vault access policy* permission model.
- Upload your certificate as a **certificate** object, not a **secret**.

> [!NOTE]
> Front Door doesn't support certificates with elliptic curve (EC) cryptography algorithms. The certificate must have a complete certificate chain with leaf and intermediate certificates, and root CA must be part of the [Microsoft Trusted CA list](/security/trusted-root/participants-list).

#### Register Azure Front Door

Register the Azure Front Door service principal in your Microsoft Entra ID using Azure PowerShell or Azure CLI.

# [**PowerShell**](#tab/powershell)

Use [New-AzADServicePrincipal](/powershell/module/az.resources/new-azadserviceprincipal) cmdlet to register the Front Door service principal in your Microsoft Entra ID.

```azurepowershell-interactive
New-AzADServicePrincipal -ApplicationId "ad0e1c7e-6d38-4ba4-9efd-0bc77ba9f037"
```

# [**Azure CLI**](#tab/cli)

Use [az-ad-sp create](/cli/azure/ad/sp#az-ad-sp-create) command to register the Front Door service principal in your Microsoft Entra ID.

```azurecli-interactive
az ad sp create --id ad0e1c7e-6d38-4ba4-9efd-0bc77ba9f037
```

---

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

If your CNAME record still exists and doesn't contain the `afdverify` subdomain, DigiCert automatically validates ownership of your custom domain.

Your CNAME record should be in the following format:

| Name            | Type  | Value                 |
|-----------------|-------|-----------------------|
| <www.contoso.com> | CNAME | contoso.azurefd.net |

For more information about CNAME records, see [Create the CNAME DNS record](../cdn/cdn-map-content-to-custom-domain.md).

If your CNAME record is correct, DigiCert automatically verifies your custom domain and creates a dedicated certificate. The certificate is valid for one year and autorenews before it expires. Continue to [Wait for propagation](#wait-for-propagation).

> [!NOTE]
> If you have a Certificate Authority Authorization (CAA) record with your DNS provider, it must include DigiCert as a valid CA. For more information, see [Manage CAA records](https://support.dnsimple.com/articles/manage-caa-record/).

> [!IMPORTANT]
> As of May 8, 2025, DigiCert no longer supports the WHOIS-based domain validation method.

## Wait for propagation

After domain validation, it can take up to 6-8 hours for the custom domain HTTPS feature to be activated. When complete, the custom HTTPS status in the Azure portal is set to **Enabled**.

### Operation progress

The following table shows the operation progress when enabling HTTPS:

| Operation step | Operation substep details |
| --- | --- |
| 1. Submitting request | Submitting request |
| | Your HTTPS request is being submitted. |
| | Your HTTPS request was submitted successfully. |
| 2. Domain validation | Domain is automatically validated if CNAME mapped to the default .azurefd.net frontend host. |
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

## Next step

> [!div class="nextstepaction"]
> [Set up a geo-filtering policy](/azure/web-application-firewall/afds/waf-front-door-tutorial-geo-filtering?toc=/azure/frontdoor/toc.json)
