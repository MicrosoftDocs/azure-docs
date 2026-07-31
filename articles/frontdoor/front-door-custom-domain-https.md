---
title: Configure HTTPS on an Azure Front Door Custom Domain
description: Learn how to enable and disable HTTPS on an existing Azure Front Door (classic) custom domain by using your own certificate.
author: halkazwini
ms.author: halkazwini
ms.service: azure-frontdoor
ms.topic: how-to
ms.date: 07/30/2026
ms.custom:
  - build-2025
  - sfi-image-nochange

#Customer intent: As a website owner, I want to enable HTTPS on the custom domain in my Front Door (classic) so that my users can use my custom domain to access their content securely.
---

# Configure HTTPS on an Azure Front Door (classic) custom domain

**Applies to:** :heavy_check_mark: Front Door (classic)

[!INCLUDE [Azure Front Door (classic) retirement notice](../../includes/front-door-classic-retirement.md)]

This article explains how to enable HTTPS for a custom domain associated with your Front Door (classic). Using HTTPS on your custom domain (for example, `https://www.contoso.com`) ensures secure data transmission through TLS/SSL encryption. When a web browser connects to a website by using HTTPS, it validates the website's security certificate and verifies its legitimacy, providing security and protecting your web applications from malicious attacks.

Azure Front Door supports HTTPS by default on its default hostname (for example, `https://contoso.azurefd.net`). However, you need to enable HTTPS separately for custom domains like `www.contoso.com`.

In this tutorial, you learn how to:
> [!div class="checklist"]
> - Enable HTTPS on your custom domain.
> - Use your own TLS/SSL certificate stored in Azure Key Vault.
> - Disable HTTPS on your custom domain.

## Prerequisites

# [**PowerShell**](#tab/powershell)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- An Azure Front Door with at least one custom domain onboarded. For more information, see [Add a custom domain to your Front Door](front-door-custom-domain.md).

- Azure Cloud Shell or Azure PowerShell to register Front Door service principal in your Microsoft Entra ID.

    The steps in this article run the Azure PowerShell cmdlets interactively in [Azure Cloud Shell](/azure/cloud-shell/overview). To run the cmdlets in the Cloud Shell, select **Open Cloud Shell** at the upper-right corner of a code block. Select **Copy** to copy the code and then paste it into Cloud Shell to run it. You can also run the Cloud Shell from within the Azure portal.

    You can also [install Azure PowerShell locally](/powershell/azure/install-azure-powershell) to run the cmdlets. If you run PowerShell locally, sign in to Azure by using the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) cmdlet.

# [**Azure CLI**](#tab/cli)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- An Azure Front Door with at least one custom domain onboarded. For more information, see [Add a custom domain to your Front Door](front-door-custom-domain.md).

- Azure Cloud Shell or Azure CLI to register Front Door service principal in your Microsoft Entra ID.

    The steps in this article run the Azure CLI commands interactively in [Azure Cloud Shell](/azure/cloud-shell/overview). To run the commands in the Cloud Shell, select **Open Cloud Shell** at the upper-right corner of a code block. Select **Copy** to copy the code, and paste it into Cloud Shell to run it. You can also run the Cloud Shell from within the Azure portal.

    You can also [install Azure CLI locally](/cli/azure/install-azure-cli) to run the commands. If you run Azure CLI locally, sign in to Azure using the [az login](/cli/azure/reference-index#az-login) command.

---

## TLS/SSL certificates

Azure Front Door uses Server Name Indication (SNI) TLS/SSL. To enable HTTPS on an existing Front Door (classic) custom domain, use your own TLS/SSL certificate through an integration with Azure Key Vault. Ensure your certificate is from a [Microsoft Trusted CA List](https://ccadb.my.salesforce-sites.com/microsoft/IncludedCACertificateReportForMSFT) and has a complete certificate chain.

### Prepare your key vault and certificate

1. Create a Key Vault account in the same Azure subscription as your Front Door.
1. Configure your key vault to allow trusted Microsoft services to bypass the firewall if network access restrictions are enabled.
1. Use the *Key Vault access policy* permission model.
1. Upload your certificate as a **certificate** object, not a **secret**.

> [!NOTE]
> Front Door doesn't support certificates with elliptic curve (EC) cryptography algorithms. The certificate must have a complete certificate chain with leaf and intermediate certificates, and root CA must be part of the [Microsoft Trusted CA list](https://ccadb.my.salesforce-sites.com/microsoft/IncludedCACertificateReportForMSFT).

### Register Azure Front Door

Register the Azure Front Door service principal in your Microsoft Entra ID by using Azure PowerShell or Azure CLI.

# [**PowerShell**](#tab/powershell)

Use the [New-AzADServicePrincipal](/powershell/module/az.resources/new-azadserviceprincipal) cmdlet to register the Front Door service principal in your Microsoft Entra ID.

```azurepowershell-interactive
New-AzADServicePrincipal -ApplicationId "ad0e1c7e-6d38-4ba4-9efd-0bc77ba9f037"
```

# [**Azure CLI**](#tab/cli)

Use the [az-ad-sp create](/cli/azure/ad/sp#az-ad-sp-create) command to register the Front Door service principal in your Microsoft Entra ID.

```azurecli-interactive
az ad sp create --id ad0e1c7e-6d38-4ba4-9efd-0bc77ba9f037
```

---

### Grant Azure Front Door access to your key vault

1. In your key vault account, select **Access policies**.

1. Select **Create** to create a new access policy.

1. In **Secret permissions**, select **Get**.

1. In **Certificate permissions**, select **Get**.

1. In **Select principal**, search for **ad0e1c7e-6d38-4ba4-9efd-0bc77ba9f037** and select **Microsoft.Azure.Frontdoor**. Select **Next**.

1. Select **Next** in **Application**.

1. Select **Create** in **Review + create**.

> [!NOTE]
> If your key vault has network access restrictions, allow trusted Microsoft services to access your key vault.

### Select the certificate for Azure Front Door to deploy

1. Return to your Front Door in the portal.

1. Select the custom domain for which you want to enable HTTPS.

1. Under **Certificate management type**, select **Use my own certificate**.

1. Select a key vault, secret, and secret version.

    > [!NOTE]
    > To enable automatic certificate rotation, set the secret version to **Latest**. If you select a specific version, you must manually update it for certificate rotation.

    > [!WARNING]
    > Ensure your service principal has **GET** permission on the Key Vault. To see the certificate in the portal drop-down, your user account must have **LIST** and **GET** permissions on the Key Vault.

## Wait for propagation

After you save the HTTPS configuration, it can take up to 6-8 hours for the custom domain HTTPS feature to activate. When complete, the custom HTTPS status in the Azure portal is set to **Enabled**.

## Clean up resources

To disable HTTPS on your custom domain:

### Disable the HTTPS feature

1. In the [Azure portal](https://portal.azure.com), go to your **Azure Front Door** configuration.

1. Select the custom domain for which you want to disable HTTPS.

1. Select **Disabled** and select **Save**.

### Wait for propagation

After disabling the custom domain HTTPS feature, it can take up to 6-8 hours to take effect. When complete, the custom HTTPS status in the Azure portal is set to **Disabled**.

### Operation progress

The following table shows the operation progress when disabling HTTPS:

| Operation progress | Operation details |
| --- | --- |
| 1. Submitting request | Submitting your request |
| 2. Certificate deprovisioning | Deleting certificate |
| 3. Complete | Certificate deleted |

## Next step

> [!div class="nextstepaction"]
> [Set up a geo-filtering policy](/azure/web-application-firewall/afds/waf-front-door-tutorial-geo-filtering?toc=/azure/frontdoor/toc.json)
