---
title: 'Configure HTTPS for your custom domain - Azure Front Door'
description: In this article, you'll learn how to configure HTTPS on an Azure Front Door custom domain.
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: article
ms.workload: infrastructure-services
ms.date: 10/31/2023
ms.author: duau
ms.custom: devx-track-azurepowershell
#Customer intent: As a website owner, I want to add a custom domain to my Front Door configuration so that my users can use my custom domain to access my content.
---

# Configure HTTPS on an Azure Front Door custom domain using the Azure portal

Azure Front Door enables secure TLS delivery to your applications by default when you use your own custom domains. To learn more about custom domains, including how custom domains work with HTTPS, see [Domains in Azure Front Door](../domain.md).

Azure Front Door supports Azure-managed certificates and customer-managed certificates. In this article, you'll learn how to configure both types of certificates for your Azure Front Door custom domains.

## Prerequisites

* Before you can configure HTTPS for your custom domain, you must first create an Azure Front Door profile. For more information, see [Create an Azure Front Door profile](../create-front-door-portal.md).

* If you don't already have a custom domain, you must first purchase one with a domain provider. For example, see [Buy a custom domain name](../../app-service/manage-custom-dns-buy-domain.md).

* If you're using Azure to host your [DNS domains](../../dns/dns-overview.md), you must delegate the domain provider's domain name system (DNS) to an Azure DNS. For more information, see [Delegate a domain to Azure DNS](../../dns/dns-delegate-domain-azure-dns.md). Otherwise, if you're using a domain provider to handle your DNS domain, you must manually validate the domain by entering prompted DNS TXT records.

## Azure Front Door-managed certificates for non-Azure pre-validated domains

Follow the steps below if you have your own domain, and the domain is not already associated with [another Azure service that pre-validates domains for Azure Front Door](../domain.md#domain-validation).

1. Select **Domains** under settings for your Azure Front Door profile and then select **+ Add** to add a new domain.

    :::image type="content" source="../media/how-to-configure-https-custom-domain/add-new-custom-domain.png" alt-text="Screenshot of domain configuration landing page.":::

1. On the **Add a domain** page, enter or select the following information, then select **Add** to onboard the custom domain.

    :::image type="content" source="../media/how-to-configure-https-custom-domain/add-domain-azure-managed.png" alt-text="Screenshot of add a domain page with Azure managed DNS selected.":::

    | Setting | Value |
    |--|--|
    | Domain type | Select **Non-Azure pre-validated domain** |
    | DNS management | Select **Azure managed DNS (Recommended)** |
    | DNS zone | Select the **Azure DNS zone** that host the custom domain. |
    | Custom domain | Select an existing domain or add a new domain. |
    | HTTPS | Select **AFD Managed (Recommended)** | 

1. Validate and associate the custom domain to an endpoint by following the steps in enabling [custom domain](how-to-add-custom-domain.md).

1. After the custom domain is associated with an endpoint successfully, Azure Front Door generates a certificate and deploys it. This process may take from several minutes to an hour to complete.

## Azure-managed certificates for Azure pre-validated domains

Follow the steps below if you have your own domain, and the domain is associated with [another Azure service that pre-validates domains for Azure Front Door](../domain.md#domain-validation).

1. Select **Domains** under settings for your Azure Front Door profile and then select **+ Add** to add a new domain.

    :::image type="content" source="../media/how-to-configure-https-custom-domain/add-new-custom-domain.png" alt-text="Screenshot of domain configuration landing page.":::

1. On the **Add a domain** page, enter or select the following information, then select **Add** to onboard the custom domain.

    :::image type="content" source="../media/how-to-configure-https-custom-domain/add-pre-validated-domain.png" alt-text="Screenshot of add a domain page with pre-validated domain.":::

    | Setting | Value |
    |--|--|
    | Domain type | Select **Azure pre-validated domain** |
    | Pre-validated custom domain | Select a custom domain name from the drop-down list of Azure services. |
    | HTTPS | Select **Azure managed (Recommended)** | 

1. Validate and associate the custom domain to an endpoint by following the steps in enabling [custom domain](how-to-add-custom-domain.md).

1. Once the custom domain gets associated to endpoint successfully, an AFD managed certificate gets deployed to Front Door. This process may take from several minutes to an hour to complete.

## Using your own certificate

You can also choose to use your own TLS certificate. Your TLS certificate must meet certain requirements. For more information, see [Certificate requirements](../domain.md?pivot=front-door-standard-premium#certificate-requirements).

#### Prepare your key vault and certificate

If you already have a certificate, you can upload it to your key vault. Otherwise, create a new certificate directly through Azure Key Vault from one of the partner certificate authorities (CAs) that Azure Key Vault integrates with.

> [!WARNING]
> Azure Front Door currently only supports Key Vault accounts in the same subscription as the Front Door configuration. Choosing a Key Vault under a different subscription than your Front Door will result in a failure.

> [!NOTE]
> * Front Door doesn't support certificates with elliptic curve (EC) cryptography algorithms. Also, your certificate must have a complete certificate chain with leaf and intermediate certificates, and the root certification authority (CA) must be part of the [Microsoft Trusted CA List](https://ccadb-public.secure.force.com/microsoft/IncludedCACertificateReportForMSFT).
> * We recommend using [**managed identity**](../managed-identity.md) to allow access to your Azure Key Vault certificates because App registration will be retired in the future.

#### Register Azure Front Door

Register the service principal for Azure Front Door as an app in your Microsoft Entra ID by using Azure PowerShell or the Azure CLI.

> [!NOTE]
> * This action requires you to have *Global Administrator* permissions in Microsoft Entra ID. The registration only needs to be performed **once per Microsoft Entra tenant**.
> * The application ID of **205478c0-bd83-4e1b-a9d6-db63a3e1e1c8** and **d4631ece-daab-479b-be77-ccb713491fc0** is predefined by Azure for Front Door Standard and Premium across all Azure tenants and subscriptions. Azure Front Door (Classic) has a different application ID.

# [Azure PowerShell](#tab/powershell)

1. If needed, install [Azure PowerShell](/powershell/azure/install-azure-powershell) in PowerShell on your local machine.

1. Use PowerShell, run the following command:

    **Azure public cloud:**

     ```azurepowershell-interactive
     New-AzADServicePrincipal -ApplicationId '205478c0-bd83-4e1b-a9d6-db63a3e1e1c8'
     ```

    **Azure government cloud:**

    ```azurepowershell-interactive
     New-AzADServicePrincipal -ApplicationId 'd4631ece-daab-479b-be77-ccb713491fc0'
     ```

# [Azure CLI](#tab/cli)

1. If needed, install [Azure CLI](/cli/azure/install-azure-cli) on your local machine.

1. Use the Azure CLI to run the following command:

    **Azure public cloud:**

    ```azurecli-interactive
    az ad sp create --id 205478c0-bd83-4e1b-a9d6-db63a3e1e1c8
    ```

    **Azure government cloud:**

    ```azurecli-interactive
     az ad sp create --id d4631ece-daab-479b-be77-ccb713491fc0
     ```
---

#### Grant Azure Front Door access to your key vault

Grant Azure Front Door permission to access the certificates in your Azure Key Vault account.

1. In your key vault account, select **Access policies**.

1. Select **Add new** or **Create** to create a new access policy.

1. In **Secret permissions**, select **Get** to allow Front Door to retrieve the certificate.

1. In **Certificate permissions**, select **Get** to allow Front Door to retrieve the certificate.

1. In **Select principal**, search for **205478c0-bd83-4e1b-a9d6-db63a3e1e1c8**, and select **Microsoft.AzureFrontDoor-Cdn**. Select **Next**.

1. In **Application**, select **Next**.

1. In **Review + create**, select **Create**.

> [!NOTE]
> If your key vault is protected with network access restrictions, make sure to allow trusted Microsoft services to access your key vault.

Azure Front Door can now access this key vault and the certificates it contains.

#### Select the certificate for Azure Front Door to deploy

1. Return to your Azure Front Door Standard/Premium in the portal.

1. Navigate to **Secrets** under *Settings* and select **+ Add certificate**.

    :::image type="content" source="../media/how-to-configure-https-custom-domain/add-certificate.png" alt-text="Screenshot of Azure Front Door secret landing page.":::

1. On the **Add certificate** page, select the checkbox for the certificate you want to add to Azure Front Door Standard/Premium.

1. When you select a certificate, you must [select the certificate version](../domain.md#rotate-own-certificate). If you select **Latest**, Azure Front Door will automatically update whenever the certificate is rotated (renewed). Alternatively, you can select a specific certificate version if you prefer to manage certificate rotation yourself.

   Leave the version selection as "Latest" and select **Add**.

    :::image type="content" source="../media/how-to-configure-https-custom-domain/add-certificate-page.png" alt-text="Screenshot of add certificate page.":::

1. Once the certificate gets provisioned successfully, you can use it when you add a new custom domain.

    :::image type="content" source="../media/how-to-configure-https-custom-domain/successful-certificate-provisioned.png" alt-text="Screenshot of certificate successfully added to secrets.":::

1. Navigate to **Domains** under *Setting* and select **+ Add** to add a new custom domain. On the **Add a domain** page, choose
"Bring Your Own Certificate (BYOC)" for *HTTPS*. For *Secret*, select the certificate you want to use from the drop-down.

    > [!NOTE]
    > The common name (CN) of the selected certificate must match the custom domain being added.

    :::image type="content" source="../media/how-to-configure-https-custom-domain/add-custom-domain-https.png" alt-text="Screenshot of add a custom domain page with HTTPS.":::

1. Follow the on-screen steps to validate the certificate. Then associate the newly created custom domain to an endpoint as outlined in [creating a custom domain](how-to-add-custom-domain.md) guide.

## Switch between certificate types

You can change a domain between using an Azure Front Door-managed certificate and a customer-managed certificate. For more information, see [Domains in Azure Front Door](../domain.md#switch-between-certificate-types).

1. Select the certificate state to open the **Certificate details** page.

    :::image type="content" source="../media/how-to-configure-https-custom-domain/domain-certificate.png" alt-text="Screenshot of certificate state on domains landing page.":::

1. On the **Certificate details** page, you can change between *Azure managed* and *Bring Your Own Certificate (BYOC)*.

   If you select *Bring Your Own Certificate (BYOC)*, follow the steps described above to select a certificate.

1. Select **Update** to change the associated certificate with a domain.

    :::image type="content" source="../media/how-to-configure-https-custom-domain/certificate-details-page.png" alt-text="Screenshot of certificate details page.":::

## Next steps

* Learn about [caching with Azure Front Door Standard/Premium](../front-door-caching.md).
* [Understand custom domains](../domain.md) on Azure Front Door.
* Learn about [End-to-end TLS with Azure Front Door](../end-to-end-tls.md).
