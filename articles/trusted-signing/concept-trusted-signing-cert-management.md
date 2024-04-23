---
title: Trusted Signing certificate management
description: Learn about the certificates used in Trusted Signing, including the two unique certificate attributes, the zero-touch certificate lifecycle management process, and most effective ways to manage the certificates.
author: ianjmcm
ms.author: ianmcm
ms.service: trusted-signing
ms.topic: concept-article
ms.date: 04/03/2024
ms.custom: template-concept
---

# Trusted Signing certificate management

The certificates used in the Trusted Signing service follow standard practices for x.509 code signing certificates. To support a healthy ecosystem, the service includes a fully managed experience for the x.509 certificates and asymmetric keys used for signing. This fully managed experience automatically provides the necessary certificate lifecycle actions for all certificates used under a customer's Certificate Profile resource in Trusted Signing.

This article explains the Trusted Signing certificates, including their two unique attributes, the zero-touch lifecycle management process, the importance of timestamp countersignatures, and our active threat monitoring and revocation actions.

## Certificate attributes

Trusted Signing uses the Certificate Profile resource type to create and manage x.509 V3 certificates that Trusted Signing customers use for signing. The certificates conform with the RFC 5280 standard and relevant Microsoft PKI Services Certificate Policy (CP) and Certification Practice Statements (CPS) found on [PKI Repository - Microsoft PKI Services](https://www.microsoft.com/pkiops/docs/repository.htm).

In addition to the standard features, the certificates also include the following two unique features to help mitigate risks and impacts associated with misuse/abuse:

- Short-lived certificates
- Subscriber Identity Validation Extended Key Usage (EKU) for durable identity pinning

### Short-lived certificates

To help reduce the impact of signing misuse and abuse, Trusted Signing certificates are renewed daily and are only valid for 72 hours. These short-lived certificates enable revocation actions to be as acute as a single day or as broad as needed, to cover any incidents of misuse and abuse.

For example, if it's determined that a subscriber signed code that was malware or PUA (Potentially Unwanted Application) as defined by [How Microsoft identifies malware and potentially unwanted applications](/microsoft-365/security/defender/criteria), the revocation actions can be isolated to only revoking the certificate that signed the malware or PUA. Thus, the revocation only impacts the code that was signed with that certificate, on the day it was issued, and not any of the code signed prior to or after that day.

### Subscriber Identity Validation Extended Key Usage (EKU)

It's common for x.509 end-entity signing certificates to be renewed on a regular timeline to ensure key hygiene. Due to Trusted Signing's *daily certificate renewal*, pinning trust or validation to an end-entity certificate using certificate attributes (for exmaple, the public key) or a certificate's "thumbprint" (hash of the certificate) isn't durable. In addition, subjectDN values can change over the lifetime of an identity or organization.

To address these issues, Trusted Signing provides a durable identity value in each certificate that's associated with the Subscription's Identity Validation resource. The durable identity value is a custom EKU that has a prefix of `1.3.6.1.4.1.311.97.` and is followed by additional octet values that are unique to the Identity Validation resource used on the Certificate Profile.

- **Public-Trust Identity Validation example**:
A `1.3.6.1.4.1.311.97.990309390.766961637.194916062.941502583` value indicates a Trusted Signing subscriber using Public-Trust Identity Validation. The `1.3.6.1.4.1.311.97.` prefix is Trusted Signing's Public-Trust code signing type and the `990309390.766961637.194916062.941502583` value is unique to the subscriber's Identity Validation for Public-Trust.

- **Private-Trust Identity Validation example**:
A  `1.3.6.1.4.1.311.97.1.3.1.29433.35007.34545.16815.37291.11644.53265.56135` value indicates a Trusted Signing subscriber using Private-Trust Identity Validation. The `1.3.6.1.4.1.311.97.1.3.1.` prefix is Trusted Signing's Private-Trust code signing type and the `29433.35007.34545.16815.37291.11644.53265.56135` is unique to the subscriber's Identity Validation for Private Trust. Because Private-Trust Identity Validations can be used for WDAC CI Policy signing, there's also a slightly different EKU prefix: `1.3.6.1.4.1.311.97.1.4.1.`. However, the suffix values match the durable identity value for the subscriber's Identity Validation for Private Trust.  

> [!NOTE]
> The durable identity EKUs can be used in WDAC CI Policy settings to pin trust to an identity in Trusted Signing accordingly. Refer to [Use signed policies to protect Windows Defender Application Control against tampering](/windows/security/application-security/application-control/windows-defender-application-control/deployment/use-signed-policies-to-protect-wdac-against-tampering) and [Windows Defender Application Control Wizard](/windows/security/application-security/application-control/windows-defender-application-control/design/wdac-wizard) for WDAC Policy creation.

All Trusted Signing Public Trust certificates also contain the `1.3.6.1.4.1.311.97.1.0` EKU to be easily identified as a publicly trusted certificate from Trusted Signing. All EKUs are in addition to the Code Signing EKU (`1.3.6.1.5.5.7.3.3`) to identify the specific usage type for certificate consumers. The only exception is certificates from CI Policy Certificate Profile types, where no Code Signing EKU is present.

## Zero-touch certificate lifecycle management

Trusted Signing aims to simplify signing as much as possible for subscribers using a zero-touch certificate lifecycle management process. A major part of simplifying signing is to provide a fully automated certificate lifecycle management solution. This is where Trusted Signing's Zero-Touch Certificate Lifecycle Management feature handles all of the standard actions automatically for the subscribers. This includes:

- Secure key generation, storage, and usage in FIPS 140-2 Level 3 hardware crypto modules managed by the service.
- Daily renewals of the certificates to ensure subscribers always have a valid certificate to sign with for their Certificate Profile resources.

Every certificate created and issued is logged for subscribers in the Azure portal and logging data feeds, including the serial number, thumbprint, created date, expiry date, and status (for example, "Active", "Expired", or "Revoked").

> [!NOTE]
> Trusted Signing does NOT support subscribers importing or exporting private keys and certificates. All certificates and keys used in Trusted Signing are managed inside FIPS 140-2 Level 3 operated hardware crypto modules.

### Time stamp countersignatures

The standard practice in signing is to countersign all signatures with an RFC3161 compliant time stamp. Since Trusted Signing uses short-lived certificates, the importance of time stamp countersigning is imperative to the signatures being valid beyond the life of the signing certificate. This is because a time stamp countersignature provides a cryptographically secure time stamp token from a Time Stamp Authority that meets standard requirements in the CSBRs.

The countersignature provides a reliable date and time of when the signing occurred, so if the time stamp countersign is inside the signing certificate's validity period (and the Time Stamp Authority certificate's validity period) the signature is valid even long after the signing (and Time Stamp Authority) certificates have expired (unless either are revoked).

Trusted Signing provides a generally available Time Stamp Authority endpoint at `http://timestamp.acs.microsoft.com`. We recommend that all Trusted Signing subscribers leverage this Time Stamp Authority endpoint for countersigning any signatures they're producing.

### Active monitoring

Trusted Signing passionately supports a healthy ecosystem by using active threat intelligence monitoring to constantly look for cases of misuse and abuse of Trusted Signing subscribers' Public Trust certificates.

- If there's a confirmed case of misuse or abuse, Trusted Signing immediately completes the necessary steps to mitigate and remediate any threats, including targeted or broad certificate revocation and account suspension.

- Subscribers can also complete revocation actions directly from the Azure portal for any certificates that are logged under a Certificate Profile they own.

## Next steps

- Get started with Trusted Signing's [Quickstart Guide](./quickstart.md).
