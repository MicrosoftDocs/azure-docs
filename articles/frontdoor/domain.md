---
title: 'Domains in Azure Front Door'
description: Learn about custom domains when using Azure Front Door.
services: frontdoor
author: johndowns
ms.service: frontdoor
ms.topic: article
ms.workload: infrastructure-services
ms.date: 01/16/2023
ms.author: jodowns
---

# Domains in Azure Front Door

In Azure Front Door, a *domain* represents a custom domain name that Front Door uses to receive your application's traffic. Azure Front Door supports adding three types of domain names:

- **Subdomains** are the most common type of custom domain name. An example subdomain is `myapplication.contoso.com`.
- **Apex domains**, also called *root domains**, don't contain a subdomain. An example root domain is `contoso.com`.
- **Wildcard domains** allow traffic to be received for any subdomain. An example wildcard domain is `*.contoso.com`. For more information about using wildcard domains with Azure Front Door, see [Wildcard domains](./front-door-wildcard-domain.md).

To learn how to add a custom domain to your Azure Front Door profile, see [Configure a custom domain on Azure Front Door using the Azure portal](standard-premium/how-to-add-custom-domain.md).

## DNS records

- Each domain typically needs two DNS records:
  - TXT record, to validate ownership
  - CNAME record, to control traffic flow
- Can be created ahead of any DNS changes, to avoid downtime
- Azure DNS vs. third-party

## Domain validation

All domains added to Azure Front Door must be validated. Validation helps to protect you from accidental misconfiguration, and also helps to protect other people from domain spoofing. In some situation, domains can be *pre-validated* by another Azure service. Otherwise, you need to follow the Azure Front Door domain validatio process to prove your ownership of the domain name.

> [!NOTE]
> Azure managed certificate and customer certificate are supported for TODO . For more information, see [Configure HTTPS on a custom domain](how-to-configure-https-custom-domain.md).

* **Azure pre-validated domains** - are domains validated by another Azure service. This domain type is used when you onboard and validated a domain to an Azure service, and then configured the Azure service behind an Azure Front Door. You don't need to validate the domain through the Azure Front Door when you use this type of domain.

    > [!NOTE]
    > Currently Azure pre-validated domain only supports domain validated by Static Web App.

* **Non-Azure validated domains** - are domains that aren't validated by a supported Azure service. This domain type can be hosted with any DNS service and requires domain ownership validation with Azure Front Door. 


- Pre-validated domains
- Validation
  - Must be validated
  - TXT record validation

### Domain validation state

| Domain validation state | Description and actions |
|--|--|
| Submitting | The custom domain is being created. Please wait until the domain resource is ready. |
| Pending | The DNS TXT record challenge has been generated. Add the DNS TXT record to your DNS provider and wait for the validation to complete. If the status remains **Pending** even after the TXT record has been updated with the DNS provider, select **Regenerate** to refresh the TXT record then add the TXT record to your DNS provider again. |
| Pending re-validation | The managed certificate is less than 45 days from expiring. If you have a CNAME record already pointing to the Azure Front Door endpoint, no action is required for certificate renewal. If the custom domain is pointed to another CNAME record, select the **Pending re-validation** status, and then select **Regenerate** on the *Validate the custom domain* page. Lastly, select **Add** if you're using Azure DNS or manually add the TXT record with your own DNS provider’s DNS management. |
| Refreshing validation token | A domain goes into a *Refreshing Validation Token* state for a brief period after the **Regenerate** button is selected. Once a new TXT record challenge is issued, the state will change to **Pending**. |
| Approved | The domain has been successfully validated. |
| Rejected | The certificate provider/authority has rejected the issuance for the managed certificate. For example, the domain name might be invalid. Select the **Rejected** link and then select **Regenerate** on the *Validate the custom domain* page, as shown in the screenshots below this table. Then select **Add** to add the TXT record in the DNS provider. |
| Timeout | The TXT record wasn't added to your DNS provider within seven days, or an invalid DNS TXT record was added. Select the **Timeout** link and then select **Regenerate** on the *Validate the custom domain* page. Then select **Add** to add the TXT record to the DNS provider. |
| Internal error | Retry validation by selecting the **Refresh** or **Regenerate** button. If you're still experiencing issues, submit a support request to Azure support. |

> [!NOTE]
> - The default TTL for TXT records is 1 hour. When you need to regenerate the TXT record for re-validation, please pay attention to the TTL for the previous TXT record. If it doesn't expire, the validation will fail until the previous TXT record expires. 
> - If the **Regenerate** button doesn't work, delete and recreate the domain.
> - If the domain state doesn't reflect as expected, select the **Refresh** button.

## Root/apex domains
Root/apex domains

For more information, see [Onboard a root or apex domain on your Front Door](front-door-how-to-onboard-apex-domain.md).

## HTTPS for custom domains

For more information on how Azure Front Door works with TLS, see [End-to-end TLS with Azure Front Door](end-to-end-tls.md).

### Managed TLS certificates

- Issuance process
- Extra verification

### BYO TLS certificates

- Need to create a secret as a reference to a KV cert
- Auth - managed identity vs. service principal
- To try it, see TODO how to

## WAF policies

TODO

## Next steps

TODO
