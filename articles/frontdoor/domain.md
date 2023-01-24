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

All domains added to Azure Front Door must be validated. Validation helps to protect you from accidental misconfiguration, and also helps to protect other people from domain spoofing. In some situation, domains can be *pre-validated* by another Azure service. Otherwise, you need to follow the Azure Front Door domain validation process to prove your ownership of the domain name.

* **Azure pre-validated domains** are domains that have been validated by another supported Azure service. If you onboard and validate a domain to another Azure service, and then configure Azure Front Door later, you might work with a pre-validated domain. You don't need to validate the domain through Azure Front Door when you use this type of domain.

    > [!NOTE]
    > Azure Front Door currently only accepts pre-validated domains that have been configured with [Azure Static Web Apps](https://azure.microsoft.com/products/app-service/static/).

* **Non-Azure validated domains** are domains that aren't validated by a supported Azure service. This domain type can be hosted with any DNS service, including [Azure DNS](https://azure.microsoft.com/products/dns/), and requires that domain ownership is validated by Azure Front Door. 

### TXT record validation

To validate a domain, you need to create a DNS TXT record. The name of the TXT record must match the subdomain. Azure Front Door provides a unique value for your TXT record when you start to add the domain to Azure Front Door.

For example, suppose you want to use the custom subdomain `myapplication.contoso.com` with Azure Front Door. First, you should add the domain to your Azure Front Door profile, and note the TXT record value that you need to use. Then, you should configure a DNS record with the following properties:

| Property | Value |
|-|-|
| Record name | `myapplication` |
| Record value | *use the value provided by Azure Front Door* |
| Time to live (TTL) | 1 hour |

For more information on adding a DNS TXT record for a custom domain, see [Configure a custom domain on Azure Front Door using the Azure portal](standard-premium/how-to-add-custom-domain.md).

### Domain validation states

The following table lists the validation states that a domain might show.

| Domain validation state | Description and actions |
|--|--|
| Submitting | The custom domain is being created. Please wait until the domain resource is ready. |
| Pending | The DNS TXT record value has been generated. Add the DNS TXT record to your DNS provider and wait for the validation to complete. If the status remains **Pending** even after the TXT record has been updated with the DNS provider, select **Regenerate** to refresh the TXT record then add the TXT record to your DNS provider again. |
| Pending re-validation | The managed certificate is less than 45 days from expiring. If you have a CNAME record already pointing to the Azure Front Door endpoint, no action is required for certificate renewal. If the custom domain is pointed to another CNAME record, select the **Pending re-validation** status, and then select **Regenerate** on the *Validate the custom domain* page. Lastly, select **Add** if you're using Azure DNS or manually add the TXT record with your own DNS provider’s DNS management. |
| Refreshing validation token | A domain goes into a *Refreshing Validation Token* state for a brief period after the **Regenerate** button is selected. Once a new TXT record value is issued, the state will change to **Pending**. |
| Approved | The domain has been successfully validated. |
| Rejected | The certificate provider/authority has rejected the issuance for the managed certificate. For example, the domain name might be invalid. Select the **Rejected** link and then select **Regenerate** on the *Validate the custom domain* page, as shown in the screenshots below this table. Then select **Add** to add the TXT record in the DNS provider. |
| Timeout | The TXT record wasn't added to your DNS provider within seven days, or an invalid DNS TXT record was added. Select the **Timeout** link and then select **Regenerate** on the *Validate the custom domain* page. Then select **Add** to add the TXT record to the DNS provider. |
| Internal error | Retry validation by selecting the **Refresh** or **Regenerate** button. If you're still experiencing issues, submit a support request to Azure support. |

> [!NOTE]
> - The default TTL for TXT records is 1 hour. When you need to regenerate the TXT record for re-validation, please pay attention to the TTL for the previous TXT record. If it doesn't expire, the validation will fail until the previous TXT record expires. 
> - If the **Regenerate** button doesn't work, delete and recreate the domain.
> - If the domain state doesn't reflect as expected, select the **Refresh** button.

## Root/apex domains

The DNS protocol prevents the assignment of CNAME records at the zone apex. For example, if your domain is `contoso.com`, you can create a CNAME record for `myappliation.contoso.com`, but you can't create a CNAME record for `contoso.com` itself. These records are called *apex*, *root*, or *naked* domains.

Azure Front Door doesn't expose the frontend IP address associated with your Azure Front Door endpoint. This means that you can't map an apex domain to an IP address if your intent is to onboard it to Azure Front Door. 

> [!WARNING]
> TODO don't add an A record as IP address might change

However, this problem can be resolved by using alias records in Azure DNS. Unlike CNAME records, alias records are created at the zone apex. You can point a zone apex record to an Azure Front Door profile that has public endpoints. Multiple application owners can point to the same Azure Front Door endpoint that's used for any other domain within their DNS zone. For example, `contoso.com` and `www.contoso.com` can point to the same Azure Front Door endpoint.

Mapping your apex or root domain to your Azure Front Door profile uses *CNAME flattening*, sometimes called *DNS chasing*. CNAME flattening is where a DNS provider recursively resolves CNAME entries until it resolves an IP address. This functionality is supported by Azure DNS for Azure Front Door endpoints.

> [!NOTE]
> There are other DNS providers as well that support CNAME flattening or DNS chasing. However, Azure Front Door recommends using Azure DNS for its customers for hosting their domains.

TODO validation process

To add a root or apex domain to your Azure Front Door profile, see [Onboard a root or apex domain on your Azure Front Door profile](front-door-how-to-onboard-apex-domain.md).

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
