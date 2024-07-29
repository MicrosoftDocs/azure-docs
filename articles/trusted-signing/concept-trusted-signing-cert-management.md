---
title: Trusted Signing certificate management
description: Get an introduction to Trusted Signing certificates. Learn about unique certificate attributes, the service's zero-touch certificate lifecycle management process, and effective ways to manage certificates.
author: ianjmcm
ms.author: ianmcm
ms.service: trusted-signing
ms.topic: concept-article
ms.date: 04/03/2024
ms.custom: template-concept
---

# Trusted Signing certificate management

This article describes Trusted Signing certificates, including their two unique attributes, the service's zero-touch lifecycle management process, the importance of time stamp countersignatures, and Microsoft active threat monitoring and revocation actions.

The certificates that are used in the Trusted Signing service follow standard practices for X.509 code signing certificates. To support a healthy ecosystem, the service includes a fully managed experience for X.509 certificates and asymmetric keys for signing. The fully managed Trusted Signing experience provides all certificate lifecycle actions for all certificates in a Trusted Signing certificate profile resource.

## Certificate attributes

Trusted Signing uses the certificate profile resource type to create and manage X.509 v3 certificates that Trusted Signing customers use for signing. The certificates conform to the RFC 5280 standard and to relevant Microsoft PKI Services Certificate Policy (CP) and Certification Practice Statements (CPS) resources that are in the [Microsoft PKI Services repository](https://www.microsoft.com/pkiops/docs/repository.htm).

In addition to standard features, certificate profiles in Trusted Signing include the following two unique features to help mitigate risks and impacts that are associated with misuse or abuse of certificate signing:

- Short-lived certificates
- Subscriber identity validation Extended Key Usage (EKU) for durable identity pinning

### Short-lived certificates

To help reduce the impact of signing misuse and abuse, Trusted Signing certificates are renewed daily and are valid for only 72 hours. In these short-lived certificates, revocation actions can be as acute as a single day or as broad as needed to cover any incidents of misuse and abuse.

For example, if it's determined that a subscriber signed code that was malware or a potentially unwanted application (PUA) as defined in [How Microsoft identifies malware and potentially unwanted applications](/microsoft-365/security/defender/criteria), revocation actions can be isolated to revoking only the certificate that signed the malware or PUA. The revocation affects only the code that was signed by using that certificate on the day that it was issued. The revocation doesn't apply to any code that was signed before that day or after that day.

### Subscriber identity validation EKU

It's common for X.509 end-entity signing certificates to be renewed on a regular timeline to ensure key hygiene. Due to Trusted Signing's *daily certificate renewal*, pinning trust or validation to an end-entity certificate that uses certificate attributes (for example, the public key) or a certificate's *thumbprint* (the hash of the certificate) isn't durable. Also, Subject Distinguished Name (subject DN) values can change over the lifetime of an identity or organization.

To address these issues, Trusted Signing provides a durable identity value in each certificate that's associated with the subscription's identity validation resource. The durable identity value is a custom EKU that has the prefix `1.3.6.1.4.1.311.97.` and is followed by more octet values that are unique to the identity validation resource that's used on the certificate profile. Here are some examples:

- **Public Trust identity validation example**

   A value of `1.3.6.1.4.1.311.97.990309390.766961637.194916062.941502583` indicates a Trusted Signing subscriber that uses Public Trust identity validation. The `1.3.6.1.4.1.311.97.` prefix is the Trusted Signing Public Trust code signing type. The `990309390.766961637.194916062.941502583` value is unique to the subscriber's identity validation for Public Trust.

- **Private Trust identity validation example**

   A  value of `1.3.6.1.4.1.311.97.1.3.1.29433.35007.34545.16815.37291.11644.53265.56135` indicates a Trusted Signing subscriber that uses Private Trust identity validation. The `1.3.6.1.4.1.311.97.1.3.1.` prefix is the Trusted Signing Private Trust code signing type. The `29433.35007.34545.16815.37291.11644.53265.56135` value is unique to the subscriber's identity validation for Private Trust.
  
   Because you can use Private Trust identity validations for Windows Defender Application Control (WDAC) code integrity (CI) policy signing, they have a different EKU prefix: `1.3.6.1.4.1.311.97.1.4.1.`. But the suffix values match the durable identity value for the subscriber's identity validation for Private Trust.  

> [!NOTE]
> You can use durable identity EKUs in WDAC CI policy settings to pin trust to an identity in Trusted Signing. For information about creating WDAC policies, see [Use signed policies to protect Windows Defender Application Control against tampering](/windows/security/application-security/application-control/windows-defender-application-control/deployment/use-signed-policies-to-protect-wdac-against-tampering) and [Windows Defender Application Control Wizard](/windows/security/application-security/application-control/windows-defender-application-control/design/wdac-wizard).

All Trusted Signing Public Trust certificates also contain the `1.3.6.1.4.1.311.97.1.0` EKU to be easily identified as a publicly trusted certificate from Trusted Signing. All EKUs are provided in addition to the code signing EKU (`1.3.6.1.5.5.7.3.3`) to identify the specific usage type for certificate consumers. The only exception is certificates that are the Trusted Signing Private Trust CI Policy certificate profile type, in which no code signing EKU is present.

## Zero-touch certificate lifecycle management

Trusted Signing aims to simplify signing as much as possible for each subscriber. A major part of simplifying signing is to provide a fully automated certificate lifecycle management solution. The Trusted Signing zero-touch certificate lifecycle management feature automatically handles all standard certificate actions for you.

It includes:

- Secure key generation, storage, and usage in FIPS 140-2 Level 3 hardware crypto modules that the service manages.
- Daily renewals of certificates to ensure that you always have a valid certificate to use to sign your certificate profile resources.

Every certificate that you create and issue is logged in the Azure portal. You can view logging data feeds that include certificate serial number, thumbprint, created date, expiry date, and status (for example, **Active**, **Expired**, or **Revoked**) in the portal.

> [!NOTE]
> Trusted Signing does *not* support importing or exporting private keys and certificates. All certificates and keys that you use in Trusted Signing are managed inside FIPS 140-2 Level 3 operated hardware crypto modules.

## Time stamp countersignatures

The standard practice in signing is to countersign all signatures with an RFC 3161-compliant time stamp. Because Trusted Signing uses short-lived certificates, time stamp countersigning is critical for a signature to be valid beyond the life of the signing certificate. A time stamp countersignature provides a cryptographically secure time stamp token from a Time Stamping Authority (TSA) that meets the standards of the Code Signing Baseline Requirements (CSBRs).

A countersignature provides a reliable date and time of when signing occurred. If the time stamp countersignature is inside the signing certificate's validity period and the TSA certificate's validity period, the signature is valid. It's valid long after the signing certificate and the TSA certificate expire (unless either are revoked).

Trusted Signing provides a generally available TSA endpoint at `http://timestamp.acs.microsoft.com`. We recommend that all Trusted Signing subscribers use this TSA endpoint to countersign any signatures they produce.

## Active monitoring

Trusted Signing passionately supports a healthy ecosystem by using active threat intelligence monitoring to constantly look for cases of misuse and abuse of Trusted Signing subscribers' Public Trust certificates.

- For a confirmed case of misuse or abuse, Trusted Signing immediately takes the necessary steps to mitigate and remediate any threats, including targeted or broad certificate revocation and account suspension.

- You can complete revocation actions directly in the Azure portal for any certificates that are logged under a certificate profile that you own.

## Next step

>[!div class="nextstepaction"]
>[Set up Trusted Signing](./quickstart.md)
