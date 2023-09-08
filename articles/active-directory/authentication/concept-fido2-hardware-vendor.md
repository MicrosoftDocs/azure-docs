---
title: Become a Microsoft-Compatible FIDO2 Security Key Vendor for sign-in to Azure AD
description: Explains process to become a FIDO2 hardware partner
ms.date: 01/29/2023
services: active-directory
ms.service: active-directory
ms.subservice: authentication
author: martincoetzer
ms.author: martinco
ms.topic: conceptual
ms.collection: M365-identity-device-management
---

# Become a Microsoft-compatible FIDO2 security key vendor

Most hacking related breaches use either stolen or weak passwords. Often, IT enforce stronger password complexity or frequent password changes to reduce the risk of a security incident. However, this increases help desk costs and leads to poor user experiences as users are required to memorize or store new, complex passwords.

FIDO2 security keys offer an alternative. FIDO2 security keys can replace weak credentials with strong hardware-backed public/private-key credentials that can't be reused, replayed, or shared across services. Security keys support shared device scenarios, allowing you to carry your credential with you and safely authenticate to an Azure Active Directory joined Windows 10 device that’s part of your organization.

Microsoft partners with FIDO2 security key vendors to ensure that security devices work on Windows, the Microsoft Edge browser, and online Microsoft accounts. FIDO2 security keys enable strong password-less authentication.

You can become a Microsoft-compatible FIDO2 security key vendor through the following process.  Microsoft doesn't commit to do go-to-market activities with the partner and evaluates partner priority based on customer demand.

1. First, your authenticator needs to have a FIDO2 certification. We aren't able to work with providers who don't have a FIDO2 certification. To learn more about the certification, visit the [FIDO Alliance Certification Overview website](https://fidoalliance.org/certification/).
2. After you have a FIDO2 certification, [submit a request form](https://forms.office.com/r/NfmQpuS9hF) to become a Microsoft-compatible FIDO2 security key vendor. Our engineering team only confirms the features supported by your FIDO2 devices. We don't retest features already tested as part of the FIDO2 certification and don't evaluate the security of your solutions. The process usually takes a few weeks to complete.
3. After the engineering team successfully confirmed the feature list, we'll confirm vendor's device is listed in the [FIDO Alliance Metadata Service](https://fidoalliance.org/metadata/).
4. Microsoft adds your FIDO2 Security Key on Azure Active Directory backend and to our list of approved FIDO2 vendors.

## Current partners

The following table lists partners who are Microsoft-compatible FIDO2 security key vendors.

| Provider | Biometric | USB | NFC | BLE | FIPS Certified |
|:-|:-:|:-:|:-:|:-:|:-:|
| [AuthenTrend](https://authentrend.com/about-us/#pg-35-3) | ![y] | ![y]| ![y]| ![y]| ![n] |
| [ACS](https://www.acs.com.hk/) | ![n] | ![y]| ![n]| ![n]| ![n] |
| [ATOS](https://atos.net/en/solutions/cyber-security/iot-and-ot-security/smart-card-solution-cardos-for-iot) | ![n] | ![y]| ![y]| ![n]| ![n] |
| [Ciright](https://www.cyberonecard.com/) | ![n] | ![n]| ![y]| ![n]| ![n] |
| [Crayonic](https://www.crayonic.com/keyvault) | ![y] | ![n]| ![y]| ![y]| ![n] |
| [Cryptnox](https://cryptnox.com/) | ![n] | ![y]| ![y]| ![n]| ![n] |
| [Ensurity](https://www.ensurity.com/contact) | ![y] | ![y]| ![n]| ![n]| ![n] |
| [Excelsecu](https://www.excelsecu.com/productdetail/esecufido2secu.html) | ![y] | ![y]| ![y]| ![y]| ![n] |
| [Feitian](https://shop.ftsafe.us/pages/microsoft) | ![y] | ![y]| ![y]| ![y]| ![y] |
| [Fortinet](https://www.fortinet.com/) | ![n] | ![y]| ![n]| ![n]| ![n] |
| [Giesecke + Devrient (G+D)](https://www.gi-de.com/en/identities/enterprise-security/hardware-based-authentication) | ![y] | ![y]| ![y]| ![y]| ![n] |
| [GoTrustID Inc.](https://www.gotrustid.com/idem-key) | ![n] | ![y]| ![y]| ![y]| ![n] |
| [HID](https://www.hidglobal.com/products/crescendo-key) | ![n] | ![y]| ![y]| ![n]| ![n] |
| [HIDEEZ](https://hideez.com/products/hideez-key-4) | ![n] | ![y]| ![y]| ![y]| ![n] |
| [Hypersecu](https://www.hypersecu.com/hyperfido) | ![n] | ![y]| ![n]| ![n]| ![n] |
| [Hypr](https://www.hypr.com/true-passwordless-mfa) | ![y] | ![y]| ![n]| ![y]| ![n] |
| [Identiv](https://www.identiv.com/products/logical-access-control/utrust-fido2-security-keys/nfc) | ![n] | ![y]| ![y]| ![n]| ![n] |
| [IDmelon Technologies Inc.](https://www.idmelon.com/#idmelon) | ![y] | ![y]| ![y]| ![y]| ![n] |
| [Kensington](https://www.kensington.com/solutions/product-category/why-biometrics/) | ![y] | ![y]| ![n]| ![n]| ![n] |
| [KONA I](https://konai.com/business/security/fido) | ![y] | ![n]| ![y]| ![y]| ![n] |
| [NeoWave](https://neowave.fr/en/products/fido-range/) | ![n] | ![y]| ![y]| ![n]| ![n] |
| [Nymi](https://www.nymi.com/nymi-band) | ![y] | ![n]| ![y]| ![n]| ![n] |
| [Octatco](https://octatco.com/) | ![y] | ![y]| ![n]| ![n]| ![n] |
| [OneSpan Inc.](https://www.onespan.com/products/fido) | ![n] | ![y]| ![n]| ![y]| ![n] |
| [Precision Biometric](https://www.innait.com/product/fido/) | ![n] | ![y]| ![n]| ![n]| ![n] |
| [RSA](https://www.rsa.com/products/securid/) | ![n] | ![y]| ![n]| ![n]| ![n] |
| [Sentry](https://sentryenterprises.com/) | ![n] | ![n]| ![y]| ![n]| ![n] |
| [Swissbit](https://www.swissbit.com/en/products/ishield-key/) | ![n] | ![y]| ![y]| ![n]| ![n] |
| [Thales Group](https://cpl.thalesgroup.com/access-management/authenticators/fido-devices) | ![n] | ![y]| ![y]| ![n]| ![y] |
| [Thetis](https://thetis.io/collections/fido2) | ![y] | ![y]| ![y]| ![y]| ![n] |
| [Token2 Switzerland](https://www.token2.swiss/shop/product/token2-t2f2-alu-fido2-u2f-and-totp-security-key) | ![y] | ![y]| ![y]| ![n]| ![n] |
| [Token Ring](https://www.tokenring.com/) | ![y] | ![n]| ![y]| ![n]| ![n] |
| [TrustKey Solutions](https://www.trustkeysolutions.com/en/sub/product.form) | ![y] | ![y]| ![n]| ![n]| ![n] |
| [VinCSS](https://passwordless.vincss.net) | ![n] | ![y]| ![n]| ![n]| ![n] |
| [WiSECURE Technologies](https://wisecure-tech.com/en-us/zero-trust/fido/authtron) | ![n] | ![y]| ![n]| ![n]| ![n] |
| [Yubico](https://www.yubico.com/solutions/passwordless/) | ![y] | ![y]| ![y]| ![n]| ![y] |

<!--Image references-->
[y]: ./media/fido2-compatibility/yes.png
[n]: ./media/fido2-compatibility/no.png

## Next steps

[FIDO2 Compatibility](fido2-compatibility.md)
