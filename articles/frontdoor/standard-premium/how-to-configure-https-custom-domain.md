---
title: 'Configure HTTPS for your custom domain - Azure Front Door'
description: In this article, you'll learn how to configure HTTPS on an Azure Front Door custom domain.
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: article
ms.workload: infrastructure-services
ms.date: 06/06/2022
ms.author: duau
ms.custom: devx-track-azurepowershell
#Customer intent: As a website owner, I want to add a custom domain to my Front Door configuration so that my users can use my custom domain to access my content.
---

# Configure HTTPS on an Azure Front Door custom domain using the Azure portal


Azure Front Door enables secure TLS delivery to your applications by default when a custom domain is added. By using the HTTPS protocol on your custom domain, you ensure your sensitive data get delivered securely with TLS/SSL encryption when it's sent across the internet. When your web browser is connected to a web site via HTTPS, it validates the web site's security certificate, and verifies it gets issued by a legitimate certificate authority. This process provides security and protects your web applications from attacks.

Azure Front Door supports Azure managed certificate and customer-managed certificates.

* A non-Azure validated domain requires domain ownership validation. The managed certificate (AFD managed) is issued and managed by Azure Front Door. Azure Front Door by default automatically enables HTTPS to all your custom domains using Azure managed certificates. No extra steps are required for getting an AFD managed certificate. A certificate is created during the domain validation process.

* An Azure pre-validated domain doesn't require domain validation because it's already validated by another Azure service. The managed certificate (Azure managed) is issued and managed by the Azure service. No extra steps are required for getting an Azure managed certificate. Azure Front Door doesn't issue a new managed certificate for this scenario and instead will reuse the managed certificate issued by the Azure service. For supported Azure service for pre-validated domain, refer to [custom domain](how-to-add-custom-domain.md).

* For both scenarios, you can bring your own certificate. 

## Prerequisites

* Before you can configure HTTPS for your custom domain, you must first create an Azure Front Door profile. For more information, see [Create an Azure Front Door profile](../create-front-door-portal.md).

* If you don't already have a custom domain, you must first purchase one with a domain provider. For example, see [Buy a custom domain name](../../app-service/manage-custom-dns-buy-domain.md).

* If you're using Azure to host your [DNS domains](../../dns/dns-overview.md), you must delegate the domain provider's domain name system (DNS) to an Azure DNS. For more information, see [Delegate a domain to Azure DNS](../../dns/dns-delegate-domain-azure-dns.md). Otherwise, if you're using a domain provider to handle your DNS domain, you must manually validate the domain by entering prompted DNS TXT records.

## AFD managed certificates for Non-Azure pre-validated domain

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
    | HTTPS | Select **AFD managed (Recommended)** | 

1. Validate and associate the custom domain to an endpoint by following the steps in enabling [custom domain](how-to-add-custom-domain.md).

1. Once the custom domain gets associated to an endpoint successfully, an AFD managed certificate gets deployed to Front Door. This process may take from several minutes to an hour to complete.

## Azure managed certificates for Azure pre-validated domain

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

You can also choose to use your own TLS certificate.  When you create your TLS/SSL certificate, you must create a complete certificate chain with an allowed certificate authority (CA) that is part of the [Microsoft Trusted CA List](https://ccadb-public.secure.force.com/microsoft/IncludedCACertificateReportForMSFT). If you use a non-allowed CA, your request will be rejected.  The root CA must be part of the [Microsoft Trusted CA List](https://ccadb-public.secure.force.com/microsoft/IncludedCACertificateReportForMSFT). If a certificate without complete chain is presented, the requests that involve that certificate aren't guaranteed to work as expected. This certificate must be imported into an Azure Key Vault before you can use it with Azure Front Door Standard/Premium. See how to [import a certificate](../../key-vault/certificates/tutorial-import-certificate.md) to Azure Key Vault.

#### Prepare your key vault and certificate

- You must have a key vault in the same Azure subscription as your Azure Front Door Standard/Premium profile. Create a key vault if you don't have one.

    > [!WARNING]
    > Azure Front Door currently only supports key vaults in the same subscription as the Front Door profile. Choosing a key vault under a different subscription than your Azure Front Door Standard/Premium profile will result in a failure.

- If your key vault has network access restrictions enabled, you must configure your key vault to allow trusted Microsoft services to bypass the firewall.

- Your key vault must be configured to use the *Key Vault access policy* permission model.

- If you already have a certificate, you can upload it to your key vault. Otherwise, create a new certificate directly through Azure Key Vault from one of the partner certificate authorities (CAs) that Azure Key Vault integrates with. Upload your certificate as a **certificate** object, rather than a **secret**.

> [!NOTE]
> Front Door doesn't support certificates with elliptic curve (EC) cryptography algorithms. The certificate must have a complete certificate chain with leaf and intermediate certificates, and root CA must be part of the [Microsoft Trusted CA List](https://ccadb-public.secure.force.com/microsoft/IncludedCACertificateReportForMSFT).

#### Register Azure Front Door

Register the service principal for Azure Front Door as an app in your Azure Active Directory (Azure AD) by using Azure PowerShell or the Azure CLI.

> [!NOTE]
> This action requires you to have Global Administrator permissions in Azure AD. The registration only needs to be performed **once per Azure AD tenant**.

##### Azure PowerShell

1. If needed, install [Azure PowerShell](/powershell/azure/install-az-ps) in PowerShell on your local machine.

2. In PowerShell, run the following command:

     ```azurepowershell-interactive
     New-AzADServicePrincipal -ApplicationId '205478c0-bd83-4e1b-a9d6-db63a3e1e1c8'
     ```

##### Azure CLI

1. If need, install [Azure CLI](/cli/azure/install-azure-cli) on your local machine.

2. In CLI, run the following command:

     ```azurecli-interactive
     az ad sp create --id 205478c0-bd83-4e1b-a9d6-db63a3e1e1c8
     ```

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

1. When you select a certificate, you must [select the certificate version](#rotate-own-certificate). If you select **Latest**, Azure Front Door will automatically update whenever the certificate is rotated (renewed). Alternatively, you can select a specific certificate version if you prefer to manage certificate rotation yourself.

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

## Certificate renewal and changing certificate types

### AFD managed certificate for Non-Azure pre-validated domain

AFD managed certificates are automatically rotated when your custom domain uses a CNAME record that points to an Azure Front Door Standard or Premium endpoint.

Front Door won't automatically rotate certificates in the following scenarios:

* The custom domain CNAME record is pointing to other DNS resources.
* The custom domain points to the Azure Front Door through a long chain. For example, if you put Azure Traffic Manager before Azure Front Door, the CNAME chain is `contoso.com` CNAME in `contoso.trafficmanager.net` CNAME in `contoso.z01.azurefd.net`.

The domain validation state will become *Pending Revalidation* 45 days before the managed certificate expires, or *Rejected* if the managed certificate issuance is rejected by the certificate authority.  Refer to [Add a custom domain](how-to-add-custom-domain.md#domain-validation-state) for actions for each of the domain states.

### Azure managed certificate for Azure pre-validated domain

Azure managed certificates are automatically rotated by the Azure service that validates the domain.

### <a name="rotate-own-certificate"></a>Use your own certificate

In order for the certificate to automatically be rotated to the latest version when a newer version of the certificate is available in your key vault, set the secret version to 'Latest'. If a specific version is selected, you have to reselect the new version manually for certificate rotation. It takes up to 72 hours for the new version of the certificate/secret to be automatically deployed.

If you want to change the secret version from ‘Latest’ to a specified version or vice versa, add a new certificate. 

## How to switch between certificate types

1. You can change an existing Azure managed certificate to a user-managed certificate by selecting the certificate state to open the **Certificate details** page.

    :::image type="content" source="../media/how-to-configure-https-custom-domain/domain-certificate.png" alt-text="Screenshot of certificate state on domains landing page.":::

1. On the **Certificate details** page, you can change between *Azure managed* and
*Bring Your Own Certificate (BYOC)*. Then follow the same steps as earlier to choose a certificate. Select **Update** to change the associated certificate with a domain.

    > [!NOTE]
    > * It may take up to an hour for the new certificate to be deployed when you switch between certificate types.
    > * If your domain state is Approved, switching the certificate type between BYOC and managed certificate won't have any downtime. When switching to managed certificate, unless the domain ownership is re-validated and the domain state becomes Approved, you will continue to be served by the previous certificate.
    > * If you switch from BYOC to managed certificate, domain re-validation is required. If you switch from managed certificate to BYOC, you're not required to re-validate the domain.
    >

    :::image type="content" source="../media/how-to-configure-https-custom-domain/certificate-details-page.png" alt-text="Screenshot of certificate details page.":::

## Next steps

Learn about [caching with Azure Front Door Standard/Premium](../front-door-caching.md).
