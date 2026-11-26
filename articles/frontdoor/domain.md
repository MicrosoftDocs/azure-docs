---
title: Domains
titleSuffix: Azure Front Door
description: Learn about custom domains in Azure Front Door, including subdomains, apex domains, and wildcard domains.
author: halkazwini
ms.author: halkazwini
ms.service: azure-frontdoor
ms.topic: concept-article
ms.date: 11/26/2026
---

# Domains in Azure Front Door

**Applies to:** :heavy_check_mark: Front Door Standard :heavy_check_mark: Front Door Premium

A *domain* represents a custom domain name that Azure Front Door uses to receive your application's traffic. Azure Front Door supports adding three types of domain names:

- **Subdomains** are the most common type of custom domain name. An example subdomain is `myapplication.contoso.com`.
- **Apex domains** don't contain a subdomain. An example apex domain is `contoso.com`. For more information about using apex domains with Azure Front Door, see [Apex domains](./apex-domain.md).
- **Wildcard domains** allow traffic to be received for any subdomain. An example wildcard domain is `*.contoso.com`. For more information about using wildcard domains with Azure Front Door, see [Wildcard domains](./front-door-wildcard-domain.md).

Add domains to your Azure Front Door profile. You can use a domain in multiple routes within an endpoint if you use different paths in each route.

To learn how to add a custom domain to your Azure Front Door profile, see [Configure a custom domain on Azure Front Door using the Azure portal](standard-premium/how-to-add-custom-domain.md).

## DNS configuration

When you add a domain to your Azure Front Door profile, you configure two records in your DNS server:

* A DNS TXT record, which is required to validate ownership of your domain name. For more information on the DNS TXT records, see [Domain validation](#domain-validation).
* A DNS CNAME record, which controls the flow of internet traffic to Azure Front Door.

> [!TIP]
> You can add a domain name to your Azure Front Door profile before making any DNS changes. This approach can be helpful if you need to set your Azure Front Door configuration together, or if you have a separate team that changes your DNS records.
>
> You can also add your DNS TXT record to validate your domain ownership before you add the CNAME record to control traffic flow. This approach can help you avoid experiencing migration downtime if you have an application already in production.

## Domain validation

You must validate all domains you add to Azure Front Door. Validation helps protect you from accidental misconfiguration and also helps protect other people from domain spoofing. In some situations, another Azure service can *prevalidate* domains. Otherwise, you need to follow the Azure Front Door domain validation process to prove your ownership of the domain name.

* **Azure prevalidated domains** are domains that another supported Azure service validates. If you onboard and validate a domain to another Azure service, and then configure Azure Front Door later, you might work with a prevalidated domain. You don't need to validate the domain through Azure Front Door when you use this type of domain.

    > [!NOTE]
    > Azure Front Door currently only accepts prevalidated domains that [Azure Static Web Apps](https://azure.microsoft.com/products/app-service/static/) configured.

* **Non-Azure validated domains** are domains that a supported Azure service doesn't validate. You can host this domain type with any DNS service, including [Azure DNS](https://azure.microsoft.com/products/dns/) and must validate its ownership by Azure Front Door.  

### TXT record validation

To validate a domain, create a DNS TXT record. The name of the TXT record must be of the form `_dnsauth.{subdomain}`. Azure Front Door provides a unique value for your TXT record when you start to add the domain to Azure Front Door.

For example, suppose you want to use the custom subdomain `myapplication.contoso.com` with Azure Front Door. First, add the domain to your Azure Front Door profile, and note the TXT record value that you need to use. Then, configure a DNS record with the following properties:

| Property | Value |
|-|-|
| Record name | `_dnsauth.myapplication` |
| Record value | *use the value provided by Azure Front Door* |
| Time to live (TTL) | 1 hour |

After your domain is validated successfully, you can safely delete the TXT record from your DNS server.

For more information about adding a DNS TXT record for a custom domain, see [Configure a custom domain on Azure Front Door using the Azure portal](standard-premium/how-to-add-custom-domain.md).

### Domain validation states

The following table lists the validation states that a domain might show.

| Domain validation state | Description and actions |
|--|--|
| Submitting | The custom domain is being created. <br /><br /> Wait until the domain resource is ready. |
| Pending | The DNS TXT record value is generated, and Azure Front Door is ready for you to add the DNS TXT record. <br /><br /> Add the DNS TXT record to your DNS provider and wait for the validation to complete. If the status remains **Pending** even after the TXT record is updated by the DNS provider, select **Regenerate** to refresh the TXT record, and then add the TXT record to your DNS provider again. |
| Pending revalidation | The managed certificate is less than 45 days from expiring and domain ownership needs to be revalidated. <br /><br /> Automatic HTTP file-token validation can complete renewal for supported domains, including supported indirect CNAME configurations. If manual revalidation is needed, select **Pending revalidation**, then **Regenerate**, and update the corresponding DNS TXT record with the new value. For requirements and limitations, see [Renew Azure Front Door-managed certificates](#renew-azure-front-door-managed-certificates). |
| Refreshing validation token | A domain goes into a *Refreshing Validation Token* state for a brief period after the **Regenerate** button is selected. Once a new TXT record value is issued, the state changes to **Pending**. <br /> No action is required. |
| Approved | The domain is successfully validated, and Azure Front Door can accept traffic that uses this domain. <br /><br /> No action is required. |
| Rejected | The certificate provider or authority rejected the issuance for the managed certificate. For example, the domain name might be invalid. <br /><br /> Select the **Rejected** link and then select **Regenerate** on the *Validate the custom domain* page. Then, select **Add** to add the TXT record in the DNS provider. |
| Timeout | The TXT record isn't added to your DNS provider within seven days, or an invalid DNS TXT record is added. <br /><br /> Select the **Timeout** link and then select **Regenerate** on the *Validate the custom domain* page. Then select **Add** to add a new TXT record to the DNS provider. Ensure that you use the updated value. |
| Internal error | An unknown error occurred. <br /><br /> Retry validation by selecting the **Refresh** or **Regenerate** button. If you're still experiencing issues, submit a support request to Azure support. |

> [!NOTE]
> - The default TTL for TXT records is one hour. When you need to regenerate the TXT record for revalidation, pay attention to the TTL for the previous TXT record. If it doesn't expire, the validation fails until the previous TXT record expires. 
> - If the **Regenerate** button doesn't work, delete and recreate the domain.
> - If the domain state doesn't reflect as expected, select the **Refresh** button.

## HTTPS for custom domains

By using the HTTPS protocol on your custom domain, you ensure your sensitive data is delivered securely by using TLS/SSL encryption when it's sent across the internet. When a client, like a web browser, connects to a website by using HTTPS, the client validates the website's security certificate, and ensures it was issued by a legitimate certificate authority. This process provides security and protects your web applications from attacks.

Azure Front Door supports using HTTPS with your own domains, and offloads transport layer security (TLS) certificate management from your origin servers. When you use custom domains, you can either use Azure-managed TLS certificates (recommended), or you can purchase and use your own TLS certificates.

For more information on how Azure Front Door works with TLS, see [End-to-end TLS with Azure Front Door](end-to-end-tls.md).

In addition to selecting a certificate, you can configure a domain's [TLS policy](tls-policy.md) for protocol versions and cipher suites and its [TLS key exchange policy](tls-key-exchange-policy.md) for classical and hybrid post-quantum supported groups. These policies control client-to-Front Door TLS negotiation, not certificate issuance or renewal. Hybrid post-quantum key exchange requires TLS 1.3. The domain's key exchange policy doesn't configure the separate Front Door-to-origin connection.

### Azure Front Door-managed TLS certificates

Azure Front Door can automatically manage TLS certificates for subdomains and apex domains. When you use managed certificates, you don't need to create keys or certificate signing requests, and you don't need to upload, store, or install the certificates. Additionally, Azure Front Door can automatically rotate (renew) managed certificates without any human intervention. This process avoids downtime caused by a failure to renew your TLS certificates in time.

The process of generating, issuing, and installing a managed TLS certificate can take from several minutes to an hour to complete, and occasionally it can take longer.

> [!NOTE]
> Front Door supports automatic renewal by using HTTP file-token validation, including through supported indirect CNAME configurations. If automatic validation can't complete, you can use DNS TXT revalidation. For conditions and limitations, see [Renew Azure Front Door-managed certificates](#renew-azure-front-door-managed-certificates).

#### Domain types

The following table summarizes the features available with managed TLS certificates when you use different types of domains:

| Consideration | Subdomain | Apex domain | Wildcard domain |
|-|-|-|-|
| Managed TLS certificates available | Yes | Yes | Yes |
| Managed TLS certificates are rotated automatically | Yes | See below | No |

When you use Azure Front Door-managed TLS certificates with apex domains, the automated certificate rotation might require you to revalidate your domain ownership. For more information, see [Apex domains in Azure Front Door](apex-domain.md#azure-front-door-managed-tls-certificate-rotation).

#### Managed certificate issuance

Azure Front Door's certificates are issued by our partner certification authority, DigiCert. For some domains, you must explicitly allow DigiCert as a certificate issuer by creating a [CAA domain record](https://wikipedia.org/wiki/DNS_Certification_Authority_Authorization) with the value: `0 issue digicert.com`.

Azure fully manages the certificates on your behalf, so any aspect of the managed certificate, including the root issuer, can change at any time. These changes are outside your control. Make sure to avoid hard dependencies on any aspect of a managed certificate, such as checking the certificate thumbprint, or pinning to the managed certificate or any part of the certificate hierarchy. If you need to pin certificates, use a customer-managed TLS certificate, as explained in the next section.

### Customer-managed TLS certificates

Sometimes, you need to provide your own TLS certificates. Common scenarios for providing your own certificates include:

* Your organization requires you to use certificates issued by a specific certification authority.
* You want Azure Key Vault to issue your certificate by using a partner certification authority.
* You need to use a TLS certificate that a client application recognizes.
* You need to use the same TLS certificate on multiple systems.

> [!NOTE]
> - Azure Front Door supports Bring Your Own Certificates (BYOC) for domain ownership validation. Front Door approves the domain ownership if the Certificate Name (CN) or Subject Alternative Name (SAN) of the certificate matches the custom domain.
> - For custom domains created before BYOC based validation, and the domain validation status isn't **Approved**, you need to trigger the auto approval of the domain ownership validation by selecting the **Validation State** and clicking on the **Revalidate** button in the portal. If you use the command line tool, you can trigger domain validation by sending an empty PATCH request to the domain API.
> - Azure managed certificates can be used with wildcard custom domains. When you select an Azure managed certificate, domain validation uses the DNS TXT record.
> - Cross-signed certificates are supported only on Azure Front Door Standard and Premium. For chain requirements and validation guidance, see [Cross-signed certificate chains](#cross-signed-certificate-chains).

#### Certificate requirements

To use your certificate with Azure Front Door, it must meet the following requirements:

- **Complete certificate chain:** When you create your TLS/SSL certificate, you must create a complete certificate chain with an allowed certificate authority (CA) that is part of the [Microsoft Trusted CA List](https://ccadb.my.salesforce-sites.com/microsoft/IncludedCACertificateReportForMSFT). If you use a nonallowed CA, your request is rejected. The root CA must be part of the [Microsoft Trusted CA List](https://ccadb.my.salesforce-sites.com/microsoft/IncludedCACertificateReportForMSFT). If a certificate without complete chain is presented, the requests that involve that certificate aren't guaranteed to work as expected.
- **Common name:** The common name (CN) of the certificate must match the domain configured in Azure Front Door.
- **Algorithm:** Azure Front Door doesn't support certificates with elliptic curve (EC) cryptography algorithms. This certificate requirement is separate from the elliptic-curve groups supported for [TLS key exchange](tls-key-exchange-policy.md).
- **File (content) type:** You must upload your certificate to your key vault from a PFX file, which uses the `application/x-pkcs12` content type.

#### Cross-signed certificate chains

For a customer-managed server certificate on a client-to-Front Door connection, a cross-signed CA certificate can provide a path to a root CA trusted by your clients.

Include the following certificates in the PFX file that you import into Key Vault:

- The server (leaf) certificate.
- The required intermediate CA certificates.
- The cross-signed CA certificate that provides a path to a root CA on the [Microsoft Trusted CA List](https://ccadb.my.salesforce-sites.com/microsoft/IncludedCACertificateReportForMSFT).

Front Door must be able to validate the certificate chain to a root CA trusted by its validator. You can omit the self-signed root certificate from the uploaded PFX when that root is already in the validator's trust store. Include the server certificate and its private key, all required intermediate CA certificates, and the cross-signed CA certificate needed for the intended trust path.

After deployment, inspect the certificate chain served by your custom domain and test validation with your target clients. Confirm that the served chain provides the certificates needed to reach a root those clients trust. The self-signed root certificate does not need to be sent during the TLS handshake. Validation results can differ because clients use different trust stores and certificate path-building behavior.

#### Import a certificate to Azure Key Vault

You must import custom TLS certificates into Azure Key Vault before you can use them with Azure Front Door. To learn how to import a certificate to a key vault, see [Tutorial: Import a certificate in Azure Key Vault](/azure/key-vault/certificates/tutorial-import-certificate).

The key vault must be in the same Azure subscription as your Azure Front Door profile.

> [!WARNING]
> Azure Front Door only supports key vaults in the same subscription as the Front Door profile. Choosing a key vault under a different subscription than your Azure Front Door profile results in a failure.

You must upload certificates as a **certificate** object, rather than a **secret**.

#### Grant access to Azure Front Door

Azure Front Door needs to access your key vault to read your certificate. You need to configure both the key vault's network firewall and the vault's access control.

If your key vault has network access restrictions enabled, you must configure your key vault to allow trusted Microsoft services to bypass the firewall.

You can configure access control on your key vault in two ways:

* Azure Front Door can use a managed identity to access your key vault. You can use this approach when your key vault uses Microsoft Entra authentication. For more information, see [Use managed identities with Azure Front Door Standard/Premium](managed-identity.md).
* Alternatively, you can grant Azure Front Door's service principal access to your key vault. You can use this approach when you use vault access policies.
Azure Front Door uses a managed identity to access your key vault. You can grant the managed identity access by using Azure role-based access control or a vault access policy. For more information, see [Use managed identities with Azure Front Door Standard/Premium](managed-identity.md). App registration (service principal) access to Azure Key Vault retires on **September 30, 2027**.

#### Add your custom certificate to Azure Front Door

After you import your certificate to a key vault, create an Azure Front Door secret resource, which is a reference to the certificate you added to your key vault.

Then, configure your domain to use the Azure Front Door secret for its TLS certificate.

For a guided walkthrough of these steps, see [Configure HTTPS on an Azure Front Door custom domain using the Azure portal](standard-premium/how-to-configure-https-custom-domain.md#use-your-own-certificate).

### Switch between certificate types

You can change a domain between using an Azure Front Door-managed certificate and a user-managed certificate.

* It might take up to an hour for the new certificate to be deployed when you switch between certificate types.
* If your domain state is *Approved*, switching the certificate type between a user-managed and a managed certificate doesn't cause any downtime.
* When switching to a managed certificate, Azure Front Door continues to use the previous certificate until the domain ownership is revalidated and the domain state becomes *Approved*.
* If you switch from BYOC to managed certificate, domain revalidation is required. If you switch from managed certificate to BYOC, you're not required to revalidate the domain.

### Certificate renewal

#### Renew Azure Front Door-managed certificates

Azure Front Door starts renewing managed certificates 45 days before they expire. Front Door supports HTTP file-token validation to automatically revalidate domain ownership during renewal. When automatic validation succeeds, you don't need to update a DNS TXT record for that renewal.

Automatic renewal can work through an indirect CNAME chain, including Azure Traffic Manager, when traffic reaches Front Door and the Front Door endpoint is within the first three CNAME hops.

Automatic validation can fail if traffic is routed to another service instead of Front Door. For example, a validation attempt can fail while Traffic Manager routes traffic to a failover endpoint. Front Door retries periodically and can complete renewal after traffic returns to Front Door. For production deployments with indirect CNAMEs, we recommend customer-managed certificates (BYOC) for more predictable certificate lifecycle management.

**Limitations:** HTTP file-token validation doesn't support wildcard domains. Use DNS TXT revalidation for wildcard managed certificates. For apex domains and CNAME flattening, follow the existing [apex-domain certificate renewal guidance](apex-domain.md#azure-front-door-managed-tls-certificate-rotation).

This section describes renewal of existing managed certificates. It doesn't change the requirements for initial domain validation.

If automatic validation doesn't complete, you can revalidate domain ownership by using a DNS TXT record. When the domain shows **Pending revalidation**, select that status and then select **Regenerate**. Update the corresponding DNS TXT record with the new validation value. Use the newly generated value rather than a value from a previous renewal. You can use this method even while traffic is routed to another service.

Monitor renewal issues through Azure Resource Health and Azure Advisor, and configure Resource Health alerts. We also recommend independent certificate-expiration monitoring. For more information, see [Monitor certificate expiration](#monitor-certificate-expiration).

For more information on the domain validation states, see [Domain validation states](#domain-validation-states).

#### Renew Azure-managed certificates for domains prevalidated by other Azure services

Azure-managed certificates are automatically rotated by the Azure service that validates the domain.

#### <a name="rotate-own-certificate"></a>Renew customer-managed TLS certificates

When you update the certificate in your key vault, Azure Front Door can automatically detect and use the updated certificate. For this functionality to work, set the secret version to **Latest** when you configure your certificate in Azure Front Door.

If you select a specific version of your certificate, you must manually reselect the new version when you update your certificate.

> [!NOTE]
> Some existing cross-signed certificates with an incomplete chain might need to be rotated. For these affected certificates, import a new certificate with a different thumbprint and the complete required chain into Key Vault. Re-uploading the same certificate isn't sufficient. Follow the version-selection guidance in this section, then verify the chain served by your custom domain. For a first-time setup, import the complete required chain; you don't need an additional certificate rotation.

It takes up to 72 hours for the new version of the certificate or secret to be automatically deployed.

If you want to change the secret version from **Latest** to a specified version or vice versa, add a new certificate. 

#### Monitor certificate expiration

Azure Resource Health reports certificate expiration for the following Front Door certificate secret types:

| Secret type | Certificate type |
|--|--|
| `CustomerCertificate` | Customer-managed certificate (BYOC) |
| `ManagedCertificate` | Front Door-managed certificate |
| `AzureFirstPartyManagedCertificate` | Azure first-party managed certificate |

The following table describes the supported expiration reports:

| Condition | When reported | Report level | Reason |
|--|--|--|--|
| Expires soon | The certificate expires within the next 30 days. | Warning | `CertificateExpiresSoon` |
| Expired | The certificate's expiration date has passed. | Error | `CertificateExpired` |

For instructions on setting up notifications, see [Create Resource Health alerts](/azure/service-health/resource-health-alert-monitor-guide).

## Security policies

Use Azure Front Door's web application firewall (WAF) to scan requests to your application for threats and enforce other security requirements.

To use the WAF with a custom domain, use an Azure Front Door security policy resource. A security policy associates a domain with a WAF policy. You can optionally create multiple security policies so that you can use different WAF policies with different domains.

## Related content

- [Configure a custom domain on Azure Front Door](standard-premium/how-to-add-custom-domain.md)
- [End-to-end TLS with Azure Front Door](end-to-end-tls.md)
