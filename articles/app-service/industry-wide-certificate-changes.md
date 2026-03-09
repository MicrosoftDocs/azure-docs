---
title: Industry-wide certificate changes impacting Azure App Service
description: Describes industry-wide TLS certificate changes that affect Azure App Service Managed Certificates and App Service Certificates, including scope, timelines, and required actions.
author: msangapu-msft
ms.author: msangapu
ms.date: 02/03/2026
ms.topic: concept-article
ms.service: azure-app-service
---

# Industry-wide certificate changes impacting Azure App Service

Industry-wide requirements defined by browser programs and the CA/Browser Forum (CA/B Forum) are changing how public TLS certificates are issued and validated. To remain compliant with these requirements, Azure App Service applies the changes to App Service Managed Certificates (ASMC) and App Service Certificates (ASC).

Most customers using certificates within Azure App Service do not need to take action. However, certain scenarios may require customer action to avoid service disruption or may change how certificates are managed over time. This article explains what is changing, when action is required, and what operational impacts to expect.


## Scope

This article applies to:
- App Service Managed Certificates (ASMC)
- App Service Certificates (ASC)

## When action is required
Action is required **only** in the following scenarios to avoid service disruption:

- **Certificate pinning**  
  Apps that pin certificates or certificate chains must review and remove pinning before the certificate chain migration.

- **Mutual TLS (mTLS)**  
  Apps that rely on these certificates for client authentication must transition to an alternative authentication mechanism.

If neither of these scenarios applies, no immediate action is required.

## Operational changes to be aware of

Some scenarios do not require immediate action, but may require changes to how you manage certificates over time:

- **Exporting App Service Certificates**  
  If you export certificates for use outside Azure App Service, you may need to re-export and update them more frequently due to the shortened validity period.

- **Domain ownership validation (ASC only)**  
  Domain ownership validation may be required more frequently for certificate issuance, renewals, or rekeys.


## Quick reference: What’s changing

| Change area | Affected certificate type | Customer impact |
|------------|--------------------------|-----------------|
| Certificate validity period | ASC only | Shorter validity with overlapping issuance |
| Domain validation reuse | ASC only | More frequent domain validation required |
| Certificate chain | ASMC and ASC | Certificate pinning must be removed |
| Client authentication EKU | ASMC and ASC | mTLS using these certs no longer supported |

## Certificate validity period (ASC only)

### What’s changing
Starting March 2026, App Service Certificates are issued with a shorter validity period of **198 days** to remain compliant with industry requirements defined by the CA/Browser Forum, including the schedule introduced in 
[CA/Browser Forum Ballot SC‑081v3](https://cabforum.org/2025/04/11/ballot-sc081v3-introduce-schedule-of-reducing-validity-and-data-reuse-periods/).

### Impact on App Service Managed Certificates (ASMC)
No change. ASMCs already comply with the new industry requirements.

### Impact on App Service Certificates (ASC)
To maintain one year of certificate coverage, Azure App Service automatically issues overlapping certificates at no additional cost.

- If App Service Certificates are used only with Azure App Service, no action is required. The platform automatically syncs and updates certificates.
- If certificates are exported and used outside Azure App Service, the certificates may need to be re-exported more frequently due to the shorter validity period.


## Domain validation reuse (ASC only)

### What’s changing
Starting March 2026, domain ownership validation for App Service Certificates can be reused for up to **198 days** to remain compliant with industry requirements defined by the CA/Browser Forum.

### Impact on App Service Managed Certificates (ASMC)
No change. Domain ownership validation for ASMC is automated and requires no customer action.

### Impact on App Service Certificates (ASC)
- Domain validation completed before March 2026 cannot be reused. Certificate issuance starting March 2026 requires domain ownership validation.
- During March 2026, domain ownership validation might be required again for each renewal and rekey.
- After March 2026, domain ownership must be revalidated only if the domain was not validated within the past 198 days.
- App Service Certificates do not automatically revalidate domains.

If validation is required, certificate orders remain in a pending issuance state until validation is completed.

> [!IMPORTANT]
> Failure to complete domain validation can result in certificate issuance or renewal failure, potentially leading to certificate expiration and service disruption.

## Client authentication EKU (ASMC and ASC)

App Service Managed Certificates and App Service Certificates will stop supporting the client authentication extended key usage (EKU) as part of industry-driven changes to public TLS certificates.

For background on this change across Azure services, see [Changes to the Managed TLS feature](/azure/security/fundamentals/managed-tls-changes).

> [!NOTE]
> Apps that rely on these certificates for mutual TLS (mTLS) must transition to an alternative authentication mechanism before the migration dates.


## Certificate chain changes (ASMC and ASC)

Both App Service Managed Certificates and App Service Certificates will migrate to a new certificate chain as part of industry-driven updates to TLS certificates, which includes changes to certificate authorities and intermediates.

Apps that pin certificates or certificate chains must review and remove pinning before the migration dates to avoid service disruption.

For background on the managed TLS certificate authority changes across Azure services, see [Changes to the Managed TLS feature](/azure/security/fundamentals/managed-tls-changes).

> [!NOTE]
> Certificate pinning is not recommended for App Service Managed Certificates (ASMC), because certificate issuance and rotation are controlled by the service.  
> For App Service Certificates (ASC), pinning may also break due to certificate chain changes and should be reviewed carefully before the migration.

## Timeline of key dates

| Date | Change | ASMC | ASC |
|-----|--------|------|-----|
| Feb–Mar 2026 | New certificate chain | Migrates to new chain | — |
| Starting March 2026 | Validity period + validation reuse | — | Shortened validity and validation reuse |
| Mar–Apr 2026 (TBD) | New certificate chain + Client auth EKU | — | Migrates to new chain; EKU removed |
| Mar–Apr 2026 (TBD) | Client auth EKU | EKU removed | — |


## Frequently asked questions

### Will I lose certificate coverage due to the shorter validity period?
No. For App Service Certificates, Azure App Service automatically issues overlapping certificates to maintain continuous coverage for the full term you purchased.

### Are these changes specific to DigiCert or GoDaddy?
No. These are industry-wide changes driven by browser programs and the CA/Browser Forum, and they apply to public TLS certificates issued by all certificate authorities.

### Do these changes affect certificates from other certificate authorities?
Yes. These are industry-wide changes that apply to public TLS certificates regardless of the issuing certificate authority. For certificates not managed by Azure App Service, contact your certificate authority for guidance.

### Do I need to take action now?
If you do not pin certificates and do not use these certificates for mutual TLS (mTLS), no immediate action is required.

### Why does my App Service Managed Certificate show an expiration date in April 2026 even though it was renewed recently?
App Service Managed Certificates are issued with an approximately six-month validity period, which already complies with current industry requirements.

The April 2026 expiration date is not related to certificate validity changes. It reflects a certificate chain transition that is occurring across the industry to maintain browser trust.

Certificates issued from the existing certificate chain can only be issued until April 2026. To address this, Azure App Service is migrating App Service Managed Certificates to a new certificate chain and reissuing certificates from that chain.

For customers using App Service Managed Certificates as intended, this process is fully automated and no service disruption is expected. As a best practice, App Service Managed Certificates should not be pinned, because both the certificate and its issuing chain are managed and rotated by the platform.


## Related documentation

- App Service Managed Certificates
- App Service Certificates
- Configure TLS/SSL bindings in Azure App Service
