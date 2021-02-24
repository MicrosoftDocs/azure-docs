---
title: Configure HTTPS for your custom domain in an Azure Front Door Standard/Premium SKU configuration
description: In this article, you'll learn how to onboard a custom domain to Azure Front Door Standard/Premium SKU.
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: article
ms.workload: infrastructure-services
ms.date: 02/18/2021
ms.author: amsriva
# As a website owner, I want to add a custom domain to my Front Door configuration so that my users can use my custom domain to access my content.
---

# Configure HTTPS on a Front Door Standard/Premium SKU (Preview) custom domain using the Azure portal

> [!NOTE]
> This documentation is for Azure Front Door Standard/Premium (Preview). Looking for information on Azure Front Door? View [here](../front-door-overview.md).

Azure Front Door Standard/Premium enables secure TLS delivery to your applications by default when a custom domain is added. By using the HTTPS protocol on your custom domain, you ensure your sensitive data get delivered securely with TLS/SSL encryption when it's sent across the internet. When your web browser is connected to a web site via HTTPS, it validates the web site's security certificate and verifies it's issued by a legitimate certificate authority. This process provides security and protects your web applications from attacks.

Azure Front Door Standard/Premium supports both Azure managed certificate and customer-managed certificates. Azure Front Door by default automatically enables HTTPS to all your custom domains using Azure managed certificates. No additional steps are required for getting an Azure managed certificate. A certificate is created during the domain validation process. You can also use your own certificate by integrating Azure Front Door Standard/Premium with your Key Vault.

> [!IMPORTANT]
> Azure Front Door Standard/Premium (Preview) is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [**Supplemental Terms of Use for Microsoft Azure Previews**](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

* Before you can configure HTTPS for your custom domain, you must first create an Azure Front Door Standard/Premium profile. For more information, see [Quickstart: Create an Azure Front Door Standard/Premium profile](create-front-door-portal.md).

* If you don't already have a custom domain, you must first purchase one with a domain provider. For example, see [Buy a custom domain name](../../app-service/manage-custom-dns-buy-domain.md).

* If you're using Azure to host your [DNS domains](../../dns/dns-overview.md), you must delegate the domain provider's domain name system (DNS) to an Azure DNS. For more information, see [Delegate a domain to Azure DNS](../../dns/dns-delegate-domain-azure-dns.md). Otherwise, if you're using a domain provider to handle your DNS domain, you must manually validate the domain by entering prompted DNS TXT records.

## Azure managed certificates

1. Under Settings for your Azure Front Door Standard/Premium profile, select **Domains** and then select **+ Add** to add a new domain.

    :::image type="content" source="../media/how-to-configure-https-custom-domain/add-new-custom-domain.png" alt-text="Screenshot of domain configuration landing page.":::

1. On the **Add a domain** page, for *DNS management* select the **Azure managed DNS** option. 

    :::image type="content" source="../media/how-to-configure-https-custom-domain/add-domain-azure-managed.png" alt-text="Screen shot of add a domain page with Azure managed DNS selected.":::

1. Validate and associate the custom domain to an endpoint by following the steps in enabling [custom domain](how-to-add-custom-domain.md).

1. Once the custom domain gets associated to endpoint successfully, an Azure managed certificate gets deployed to Front Door. This process may take a few minutes to complete.

## Using your own certificate

You can also choose to use your own TLS certificate. This certificate must be imported into an Azure Key Vault before you can use it with Azure Front Door Standard/Premium. See [import a certificate](../../key-vault/certificates/tutorial-import-certificate.md) to Azure Key Vault. 

#### Prepare your Azure Key vault account and certificate
 
1. You must have a running Azure Key Vault account under the same subscription as your Azure Front Door Standard/Premium that you want to enable custom HTTPS. Create an Azure Key Vault account if you don't have one.

    > [!WARNING]
    > Azure Front Door currently only supports Key Vault accounts in the same subscription as the Front Door configuration. Choosing a Key Vault under a different subscription than your Azure Front Door Standard/Premium will result in a failure.

1. If you already have a certificate, you can upload it directly to your Azure Key Vault account. Otherwise, create a new certificate directly through Azure Key Vault from one of the partner Certificate Authorities that Azure Key Vault integrates with. Upload your certificate as a **certificate** object, rather than a **secret**.

    > [!NOTE]
    > For your own TLS/SSL certificate, Front Door doesn't support certificates with EC cryptography algorithms.

#### Register Azure Front Door

Register the service principal for Azure Front Door as an app in your Azure Active Directory via PowerShell.

> [!NOTE]
> This action requires Global Administrator permissions, and needs to be performed only **once** per tenant.

1. If needed, install [Azure PowerShell](/powershell/azure/install-az-ps) in PowerShell on your local machine.

1. In PowerShell, run the following command:

     `New-AzADServicePrincipal -ApplicationId "205478c0-bd83-4e1b-a9d6-db63a3e1e1c8"`              

#### Grant Azure Front Door access to your key vault
 
Grant Azure Front Door permission to access the  certificates in your Azure Key Vault account.

1. In your key vault account, under SETTINGS, select **Access policies**. Then select **Add new** to create a new policy.

1. In **Select principal**, search for **205478c0-bd83-4e1b-a9d6-db63a3e1e1c8**, and choose ** Microsoft.AzureFrontDoor-Cdn**. Click **Select**.

1. In **Secret permissions**, select **Get** to allow Front Door to retrieve the certificate.

1. In **Certificate permissions**, select **Get** to allow Front Door to retrieve the certificate.

1. Select **OK**. 

#### Select the certificate for Azure Front Door to deploy
 
1. Return to your Azure Front Door Standard/Premium in the portal.

1. Navigate to **Secrets** under *Settings* and select **Add certificate**.

    :::image type="content" source="../media/how-to-configure-https-custom-domain/add-certificate.png" alt-text="Screenshot of Azure Front Door secret landing page.":::

1. On the **Add certificate** page, select the checkbox for the certificate you want to add to Azure Front Door Standard/Premium. Leave the version selection as "Latest" and select **Add**. 

    :::image type="content" source="../media/how-to-configure-https-custom-domain/add-certificate-page.png" alt-text="Screenshot of add certificate page.":::

1. Once the certificate gets provisioned successfully, you can use it when you add a new custom domain.

    :::image type="content" source="../media/how-to-configure-https-custom-domain/successful-certificate-provisioned.png" alt-text="Screenshot of certificate successfully added to secrets.":::

1. Navigate to **Domains** under *Setting* and select **+ Add** to add a new custom domain. On the **Add a domain** page, choose 
"Bring Your Own Certificate (BYOC)" for *HTTPS*. For *Secret*, select the certificate you want to use from the drop-down. 

    > [!NOTE]
    > The selected certificate must have a common name (CN) same as the custom domain being added.

    :::image type="content" source="../media/how-to-configure-https-custom-domain/add-custom-domain-https.png" alt-text="Screenshot of add a custom domain page with HTTPS.":::

1. Follow the on-screen steps to validate the certificate. Then associate the newly created custom domain to an endpoint as outlined in [creating a custom domain](how-to-add-custom-domain.md) guide.

#### Change from Azure managed to Bring Your Own Certificate (BYOC)

1. You can change an existing Azure managed certificate to a user-managed certificate by selecting the certificate state to open the **Certificate details** page.

    :::image type="content" source="../media/how-to-configure-https-custom-domain/domain-certificate.png" alt-text="Screenshot of certificate state on domains landing page." lightbox="../media/how-to-configure-https-custom-domain/domain-certificate-expanded.png":::

1. On the **Certificate details** page, you can change from "Azure managed" to "Bring Your Own Certificate (BYOC)" option. Then follow the same steps as earlier to choose a certificate. Select **Update** to change the associated certificate with a domain.

    :::image type="content" source="../media/how-to-configure-https-custom-domain/certificate-details-page.png" alt-text="Screenshot of certificate details page.":::

## Next steps

Learn about [caching with Azure Front Door Standard/Premium](concept-caching.md).
