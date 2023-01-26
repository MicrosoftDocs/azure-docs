---
title: 'Domains in Azure Front Door'
description: Learn about custom domains when using Azure Front Door.
services: frontdoor
author: johndowns
ms.service: frontdoor
ms.topic: article
ms.workload: infrastructure-services
ms.date: 01/26/2023
ms.author: jodowns
---

# Domains in Azure Front Door

In Azure Front Door, a *domain* represents a custom domain name that Front Door uses to receive your application's traffic. Azure Front Door supports adding three types of domain names:

- **Subdomains** are the most common type of custom domain name. An example subdomain is `myapplication.contoso.com`.
- **Apex domains** don't contain a subdomain. An example apex domain is `contoso.com`. For more information about using apex domains with Azure Front Door, see [Apex domains](./apex-domain.md).
- **Wildcard domains** allow traffic to be received for any subdomain. An example wildcard domain is `*.contoso.com`. For more information about using wildcard domains with Azure Front Door, see [Wildcard domains](./front-door-wildcard-domain.md).

Domains are added to your Azure Front Door profile. You can use a domain in multiple endpoints, if you use different paths in each route.

To learn how to add a custom domain to your Azure Front Door profile, see [Configure a custom domain on Azure Front Door using the Azure portal](standard-premium/how-to-add-custom-domain.md).

## DNS configuration

When you add a domain to your Azure Front Door profile, you typically need to configure two records in your DNS server:

* A DNS TXT record, which is usually required to validate ownership of your domain name. For more information on the DNS TXT records, see [Domain validation](#domain-validation).
* A DNS CNAME record, which controls the flow of internet traffic to Azure Front Door.

> [!TIP]
> You can add a domain name to your Azure Front Door profile before making any DNS changes. This approach can be helpful if you need to set your Azure Front Door configuration together, or if you have a separate team that changes your DNS records.
>
> You can also add your DNS TXT record to validate your domain ownership before you add the CNAME record to control traffic flow. This approach can be useful to avoid experiencing migration downtime if you have an application already in production.

## Domain validation

All domains added to Azure Front Door must be validated. Validation helps to protect you from accidental misconfiguration, and also helps to protect other people from domain spoofing. In some situation, domains can be *pre-validated* by another Azure service. Otherwise, you need to follow the Azure Front Door domain validation process to prove your ownership of the domain name.

* **Azure pre-validated domains** are domains that have been validated by another supported Azure service. If you onboard and validate a domain to another Azure service, and then configure Azure Front Door later, you might work with a pre-validated domain. You don't need to validate the domain through Azure Front Door when you use this type of domain.

    > [!NOTE]
    > Azure Front Door currently only accepts pre-validated domains that have been configured with [Azure Static Web Apps](https://azure.microsoft.com/products/app-service/static/).

* **Non-Azure validated domains** are domains that aren't validated by a supported Azure service. This domain type can be hosted with any DNS service, including [Azure DNS](https://azure.microsoft.com/products/dns/), and requires that domain ownership is validated by Azure Front Door. 

### TXT record validation

To validate a domain, you need to create a DNS TXT record. The name of the TXT record be of the form `_dnsauth.{subdomain}`. Azure Front Door provides a unique value for your TXT record when you start to add the domain to Azure Front Door.

For example, suppose you want to use the custom subdomain `myapplication.contoso.com` with Azure Front Door. First, you should add the domain to your Azure Front Door profile, and note the TXT record value that you need to use. Then, you should configure a DNS record with the following properties:

| Property | Value |
|-|-|
| Record name | `_dnsauth.myapplication` |
| Record value | *use the value provided by Azure Front Door* |
| Time to live (TTL) | 1 hour |

For more information on adding a DNS TXT record for a custom domain, see [Configure a custom domain on Azure Front Door using the Azure portal](standard-premium/how-to-add-custom-domain.md).

### Domain validation states

The following table lists the validation states that a domain might show.

| Domain validation state | Description and actions |
|--|--|
| Submitting | The custom domain is being created. <br /> Please wait until the domain resource is ready. |
| Pending | The DNS TXT record value has been generated, and Azure Front Door is ready for you to add the DNS TXT record. <br /> Add the DNS TXT record to your DNS provider and wait for the validation to complete. If the status remains **Pending** even after the TXT record has been updated with the DNS provider, select **Regenerate** to refresh the TXT record then add the TXT record to your DNS provider again. |
| Pending re-validation | The managed certificate is less than 45 days from expiring. <br /> If you have a CNAME record already pointing to the Azure Front Door endpoint, no action is required for certificate renewal. If the custom domain is pointed to another CNAME record, select the **Pending re-validation** status, and then select **Regenerate** on the *Validate the custom domain* page. Lastly, select **Add** if you're using Azure DNS or manually add the TXT record with your own DNS provider’s DNS management. |
| Refreshing validation token | A domain goes into a *Refreshing Validation Token* state for a brief period after the **Regenerate** button is selected. Once a new TXT record value is issued, the state will change to **Pending**. <br /> No action is required. |
| Approved | The domain has been successfully validated, and Azure Front Door can accept traffic that uses this domain. <br /> No action is required. |
| Rejected | The certificate provider/authority has rejected the issuance for the managed certificate. For example, the domain name might be invalid. <br /> Select the **Rejected** link and then select **Regenerate** on the *Validate the custom domain* page, as shown in the screenshots below this table. Then, select **Add** to add the TXT record in the DNS provider. |
| Timeout | The TXT record wasn't added to your DNS provider within seven days, or an invalid DNS TXT record was added. <br /> Select the **Timeout** link and then select **Regenerate** on the *Validate the custom domain* page. Then select **Add** to add a new TXT record to the DNS provider. Ensure that you use the updated value. |
| Internal error | An unknown error occurred. <br /> Retry validation by selecting the **Refresh** or **Regenerate** button. If you're still experiencing issues, submit a support request to Azure support. |

> [!NOTE]
> - The default TTL for TXT records is 1 hour. When you need to regenerate the TXT record for re-validation, please pay attention to the TTL for the previous TXT record. If it doesn't expire, the validation will fail until the previous TXT record expires. 
> - If the **Regenerate** button doesn't work, delete and recreate the domain.
> - If the domain state doesn't reflect as expected, select the **Refresh** button.

## HTTPS for custom domains

Azure Front Door supports using HTTPS with your own domains, and offloads transport layer security (TLS) certificate management from your origin servers. When you use custom domains, you can either use Azure-managed TLS certificates (recommended), or you can purchase and use your own TLS certificates.

For more information on how Azure Front Door works with TLS, see [End-to-end TLS with Azure Front Door](end-to-end-tls.md).

### Azure Front Door-managed TLS certificates

Azure Front Door can automatically manage TLS certificates for subdomains and apex domains. When you use managed certificates, you don't need to create keys or certificate signing requests, and you don't need to upload, store, or install the certificates. Additionally, Azure Front Door can automatically rotate (renew) managed certificates without any human intervention. This process avoids downtime caused by a failure to renew your TLS certificates in time.

Azure Front Door's certificates are issued by our partner certification authority, DigiCert. <!-- TODO is there ever any extra verification needed from Digicert? -->

#### Domain types

The following table summarizes the features available with managed TLS certificates when you use different types of domains:

| Consideration | Subdomain | Apex domain | Wildcard domain |
|-|-|-|-|
| Managed TLS certificates available | Yes | Yes | No |
| Managed TLS certificates are rotated automatically | Yes | See below | No |

When you use Azure Front Door-managed TLS certificates with apex domains, the automated certificate rotation might require you to revalidate your domain ownership. For more information, see [Apex domains in Azure Front Door](apex-domain.md#azure-front-door-managed-tls-certificate-rotation).

### Customer-managed TLS certificates

Sometimes, you might need to provide your own TLS certificates. Common scenarios for providing your own certificates include:

* Your organization requires you to use certificates issued by a specific certification authority.
* You need to use the same TLS certificate on multiple systems.
* You use [wildcard domains](front-door-wildcard-domain.md). Azure Front Door doesn't provide managed certificates for wildcard domains.

To use your own TLS certificate, you need to follow these steps:

1. Create a key vault.
1. Upload the certificate to your key vault.
1. Grant access so that Azure Front Door can read your certificate. You can grant access by using either of these approaches:
   * Azure Front Door can use a managed identity to access your key vault. You can use this approach when your key vault uses Azure Active Directory (Azure AD) authentication. For more information, see [Use managed identities with Azure Front Door Standard/Premium](managed-identity.md).
   * Alternatively you can grant Azure Front Door's service principal access to your key vault. You can use this approach when you use vault access policies.
1. Create an Azure Front Door secret resource, which is a reference to the certificate you added to your key vault.
1. Configure your domain to use the Azure Front Door secret for its TLS certificate.

For a guided walkthrough of these steps, see [Configure HTTPS on an Azure Front Door custom domain using the Azure portal](standard-premium/how-to-configure-https-custom-domain.md#using-your-own-certificate).

<!-- TODO pull out reference info from the how-to into this page? -->

## Security policies

You can use Azure Front Door's web application firewall (WAF) to scan requests to your application for threats, and to enforce other security requirements.

To use the WAF with a custom domain, use an Azure Front Door security policy resource. A security policy associates a domain with a WAF policy. You can optionally create multiple security policies so that you can use different WAF policies with different domains.

## Next steps

To learn how to add a custom domain to your Azure Front Door profile, see [Configure a custom domain on Azure Front Door using the Azure portal](standard-premium/how-to-add-custom-domain.md).TODO
