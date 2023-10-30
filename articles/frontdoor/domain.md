---
title: 'Domains in Azure Front Door'
description: Learn about custom domains when using Azure Front Door.
services: frontdoor
author: johndowns
ms.service: frontdoor
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 03/10/2023
ms.author: jodowns
---

# Domains in Azure Front Door

A *domain* represents a custom domain name that Azure Front Door uses to receive your application's traffic. Azure Front Door supports adding three types of domain names:

- **Subdomains** are the most common type of custom domain name. An example subdomain is `myapplication.contoso.com`.
- **Apex domains** don't contain a subdomain. An example apex domain is `contoso.com`. For more information about using apex domains with Azure Front Door, see [Apex domains](./apex-domain.md).
- **Wildcard domains** allow traffic to be received for any subdomain. An example wildcard domain is `*.contoso.com`. For more information about using wildcard domains with Azure Front Door, see [Wildcard domains](./front-door-wildcard-domain.md).

Domains are added to your Azure Front Door profile. You can use a domain in multiple routes within an endpoint, if you use different paths in each route.

To learn how to add a custom domain to your Azure Front Door profile, see [Configure a custom domain on Azure Front Door using the Azure portal](standard-premium/how-to-add-custom-domain.md).

## DNS configuration

When you add a domain to your Azure Front Door profile, you configure two records in your DNS server:

* A DNS TXT record, which is required to validate ownership of your domain name. For more information on the DNS TXT records, see [Domain validation](#domain-validation).
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

To validate a domain, you need to create a DNS TXT record. The name of the TXT record must be of the form `_dnsauth.{subdomain}`. Azure Front Door provides a unique value for your TXT record when you start to add the domain to Azure Front Door.

For example, suppose you want to use the custom subdomain `myapplication.contoso.com` with Azure Front Door. First, you should add the domain to your Azure Front Door profile, and note the TXT record value that you need to use. Then, you should configure a DNS record with the following properties:

| Property | Value |
|-|-|
| Record name | `_dnsauth.myapplication` |
| Record value | *use the value provided by Azure Front Door* |
| Time to live (TTL) | 1 hour |

After your domain has been validated successfully, you can safely delete the TXT record from your DNS server.

For more information on adding a DNS TXT record for a custom domain, see [Configure a custom domain on Azure Front Door using the Azure portal](standard-premium/how-to-add-custom-domain.md).

### Domain validation states

The following table lists the validation states that a domain might show.

| Domain validation state | Description and actions |
|--|--|
| Submitting | The custom domain is being created. <br /><br /> Wait until the domain resource is ready. |
| Pending | The DNS TXT record value has been generated, and Azure Front Door is ready for you to add the DNS TXT record. <br /><br /> Add the DNS TXT record to your DNS provider and wait for the validation to complete. If the status remains **Pending** even after the TXT record has been updated with the DNS provider, select **Regenerate** to refresh the TXT record then add the TXT record to your DNS provider again. |
| Pending re-validation | The managed certificate is less than 45 days from expiring. <br /><br /> If you have a CNAME record already pointing to the Azure Front Door endpoint, no action is required for certificate renewal. If the custom domain is pointed to another CNAME record, select the **Pending re-validation** status, and then select **Regenerate** on the *Validate the custom domain* page. Lastly, select **Add** if you're using Azure DNS or manually add the TXT record with your own DNS provider’s DNS management. |
| Refreshing validation token | A domain goes into a *Refreshing Validation Token* state for a brief period after the **Regenerate** button is selected. Once a new TXT record value is issued, the state will change to **Pending**. <br /> No action is required. |
| Approved | The domain has been successfully validated, and Azure Front Door can accept traffic that uses this domain. <br /><br /> No action is required. |
| Rejected | The certificate provider/authority has rejected the issuance for the managed certificate. For example, the domain name might be invalid. <br /><br /> Select the **Rejected** link and then select **Regenerate** on the *Validate the custom domain* page, as shown in the screenshots below this table. Then, select **Add** to add the TXT record in the DNS provider. |
| Timeout | The TXT record wasn't added to your DNS provider within seven days, or an invalid DNS TXT record was added. <br /><br /> Select the **Timeout** link and then select **Regenerate** on the *Validate the custom domain* page. Then select **Add** to add a new TXT record to the DNS provider. Ensure that you use the updated value. |
| Internal error | An unknown error occurred. <br /><br /> Retry validation by selecting the **Refresh** or **Regenerate** button. If you're still experiencing issues, submit a support request to Azure support. |

> [!NOTE]
> - The default TTL for TXT records is 1 hour. When you need to regenerate the TXT record for re-validation, please pay attention to the TTL for the previous TXT record. If it doesn't expire, the validation will fail until the previous TXT record expires. 
> - If the **Regenerate** button doesn't work, delete and recreate the domain.
> - If the domain state doesn't reflect as expected, select the **Refresh** button.

## HTTPS for custom domains

By using the HTTPS protocol on your custom domain, you ensure your sensitive data is delivered securely with TLS/SSL encryption when it's sent across the internet. When a client, like a web browser, is connected to a website by using HTTPS, the client validates the website's security certificate, and ensures it was issued by a legitimate certificate authority. This process provides security and protects your web applications from attacks.

Azure Front Door supports using HTTPS with your own domains, and offloads transport layer security (TLS) certificate management from your origin servers. When you use custom domains, you can either use Azure-managed TLS certificates (recommended), or you can purchase and use your own TLS certificates.

For more information on how Azure Front Door works with TLS, see [End-to-end TLS with Azure Front Door](end-to-end-tls.md).

### Azure Front Door-managed TLS certificates

Azure Front Door can automatically manage TLS certificates for subdomains and apex domains. When you use managed certificates, you don't need to create keys or certificate signing requests, and you don't need to upload, store, or install the certificates. Additionally, Azure Front Door can automatically rotate (renew) managed certificates without any human intervention. This process avoids downtime caused by a failure to renew your TLS certificates in time.

The process of generating, issuing, and installing a managed TLS certificate can take from several minutes to an hour to complete, and occasionally it can take longer.

#### Domain types

The following table summarizes the features available with managed TLS certificates when you use different types of domains:

| Consideration | Subdomain | Apex domain | Wildcard domain |
|-|-|-|-|
| Managed TLS certificates available | Yes | Yes | No |
| Managed TLS certificates are rotated automatically | Yes | See below | No |

When you use Azure Front Door-managed TLS certificates with apex domains, the automated certificate rotation might require you to revalidate your domain ownership. For more information, see [Apex domains in Azure Front Door](apex-domain.md#azure-front-door-managed-tls-certificate-rotation).

#### Managed certificate issuance

Azure Front Door's certificates are issued by our partner certification authority, DigiCert. For some domains, you must explicitly allow DigiCert as a certificate issuer by creating a [CAA domain record](https://wikipedia.org/wiki/DNS_Certification_Authority_Authorization) with the value: `0 issue digicert.com`.

Azure fully manages the certificates on your behalf, so any aspect of the managed certificate, including the root issuer, can change at any time. These changes are outside your control. Make sure to avoid hard dependencies on any aspect of a managed certificate, such as checking the certificate thumbprint, or pinning to the managed certificate or any part of the certificate hierarchy. If you need to pin certificates, you should use a customer-managed TLS certificate, as explained in the next section.

### Customer-managed TLS certificates

Sometimes, you might need to provide your own TLS certificates. Common scenarios for providing your own certificates include:

* Your organization requires you to use certificates issued by a specific certification authority.
* You want Azure Key Vault to issue your certificate by using a partner certification authority.
* You need to use a TLS certificate that a client application recognizes.
* You need to use the same TLS certificate on multiple systems.
* You use [wildcard domains](front-door-wildcard-domain.md). Azure Front Door doesn't provide managed certificates for wildcard domains.

#### Certificate requirements

To use your certificate with Azure Front Door, it must meet the following requirements:

- **Complete certificate chain:** When you create your TLS/SSL certificate, you must create a complete certificate chain with an allowed certificate authority (CA) that is part of the [Microsoft Trusted CA List](https://ccadb-public.secure.force.com/microsoft/IncludedCACertificateReportForMSFT). If you use a non-allowed CA, your request will be rejected.  The root CA must be part of the [Microsoft Trusted CA List](https://ccadb-public.secure.force.com/microsoft/IncludedCACertificateReportForMSFT). If a certificate without complete chain is presented, the requests that involve that certificate aren't guaranteed to work as expected.
- **Common name:** The common name (CN) of the certificate must match the domain configured in Azure Front Door.
- **Algorithm:** Azure Front Door doesn't support certificates with elliptic curve (EC) cryptography algorithms.
- **File (content) type:** Your certificate must be uploaded to your key vault from a PFX file, which uses the `application/x-pkcs12` content type.

#### Import a certificate to Azure Key Vault

Custom TLS certificates must be imported into Azure Key Vault before you can use it with Azure Front Door. To learn how to import a certificate to a key vault, see [Tutorial: Import a certificate in Azure Key Vault](../key-vault/certificates/tutorial-import-certificate.md).

The key vault must be in the same Azure subscription as your Azure Front Door profile.

> [!WARNING]
> Azure Front Door only supports key vaults in the same subscription as the Front Door profile. Choosing a key vault under a different subscription than your Azure Front Door profile will result in a failure.

Certificates must be uploaded as a **certificate** object, rather than a **secret**.

#### Grant access to Azure Front Door

Azure Front Door needs to access your key vault to read your certificate. You need to configure both the key vault's network firewall and the vault's access control.

If your key vault has network access restrictions enabled, you must configure your key vault to allow trusted Microsoft services to bypass the firewall.

There are two ways you can configure access control on your key vault:

* Azure Front Door can use a managed identity to access your key vault. You can use this approach when your key vault uses Microsoft Entra authentication. For more information, see [Use managed identities with Azure Front Door Standard/Premium](managed-identity.md).
* Alternatively you can grant Azure Front Door's service principal access to your key vault. You can use this approach when you use vault access policies.

#### Add your custom certificate to Azure Front Door

After you've imported your certificate to a key vault, create an Azure Front Door secret resource, which is a reference to the certificate you added to your key vault.

Then, configure your domain to use the Azure Front Door secret for its TLS certificate.

For a guided walkthrough of these steps, see [Configure HTTPS on an Azure Front Door custom domain using the Azure portal](standard-premium/how-to-configure-https-custom-domain.md#using-your-own-certificate).

### Switch between certificate types

You can change a domain between using an Azure Front Door-managed certificate and a user-managed certificate.

* It might take up to an hour for the new certificate to be deployed when you switch between certificate types.
* If your domain state is *Approved*, switching the certificate type between a user-managed and a managed certificate won't cause any downtime.
* When switching to a managed certificate, Azure Front Door continues to use the previous certificate until the domain ownership is re-validated and the domain state becomes *Approved*.
* If you switch from BYOC to managed certificate, domain re-validation is required. If you switch from managed certificate to BYOC, you're not required to re-validate the domain.

### Certificate renewal

#### Renew Azure Front Door-managed certificates

For most custom domains, Azure Front Door automatically renews (rotates) managed certificates when they're close to expiry, and you don't need to do anything.

However, Azure Front Door won't automatically rotate certificates in the following scenarios:

* The custom domain's CNAME record is pointing to other DNS records.
* The custom domain points to the Azure Front Door endpoint through a chain. For example, if your DNS record points to Azure Traffic Manager, which in turn resolves to Azure Front Door, the CNAME chain is `contoso.com` CNAME in `contoso.trafficmanager.net` CNAME in `contoso.z01.azurefd.net`. Azure Front Door can't verify the whole chain.
* The custom domain uses an A record. We recommend you always use a CNAME record to point to Azure Front Door.
* The custom domain is an [apex domain](apex-domain.md) and uses CNAME flattening.

If one of the scenarios above applies to your custom domain, then 45 days before the managed certificate expires, the domain validation state becomes *Pending Revalidation*. The *Pending Revalidation* state indicates that you need to create a new DNS TXT record to revalidate your domain ownership.

> [!NOTE]
> DNS TXT records expire after seven days. If you previously added a domain validation TXT record to your DNS server, you need to replace it with a new TXT record. Ensure you use the new value, otherwise the domain validation process will fail.

If your domain can't be validated, the domain validation state becomes *Rejected*. This state indicates that the certificate authority has rejected the request for reissuing a managed certificate.

For more information on the domain validation states, see [Domain validation states](#domain-validation-states).

#### Renew Azure-managed certificates for domains pre-validated by other Azure services

Azure-managed certificates are automatically rotated by the Azure service that validates the domain.

#### <a name="rotate-own-certificate"></a>Renew customer-managed TLS certificates

When you update the certificate in your key vault, Azure Front Door can automatically detect and use the updated certificate. For this functionality to work, set the secret version to 'Latest' when you configure your certificate in Azure Front Door.

If you select a specific version of your certificate, you have to reselect the new version manually when you update your certificate.

It takes up to 72 hours for the new version of the certificate/secret to be automatically deployed.

If you want to change the secret version from ‘Latest’ to a specified version or vice versa, add a new certificate. 

## Security policies

You can use Azure Front Door's web application firewall (WAF) to scan requests to your application for threats, and to enforce other security requirements.

To use the WAF with a custom domain, use an Azure Front Door security policy resource. A security policy associates a domain with a WAF policy. You can optionally create multiple security policies so that you can use different WAF policies with different domains.

## Next steps

To learn how to add a custom domain to your Azure Front Door profile, see [Configure a custom domain on Azure Front Door using the Azure portal](standard-premium/how-to-add-custom-domain.md).
