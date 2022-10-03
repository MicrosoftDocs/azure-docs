---
title: Become a Microsoft-Compatible FIDO2 Security Key Vendor for sign-in to Azure AD
description: Explains process to become a FIDO2 hardware partner
ms.date: 08/02/2021
services: active-directory
ms.service: active-directory
ms.subservice: authentication
author: martincoetzer
ms.author: martinco
ms.topic: conceptual
ms.collection: M365-identity-device-management
---

# Become a Microsoft-compatible FIDO2 security key vendor

Most hacking related breaches use either stolen or weak passwords. Often, IT will enforce stronger password complexity or frequent password changes to reduce the risk of a security incident. However, this increases help desk costs and leads to poor user experiences as users are required to memorize or store new, complex passwords.

FIDO2 security keys offer an alternative. FIDO2 security keys can replace weak credentials with strong hardware-backed public/private-key credentials which can't be reused, replayed, or shared across services. Security keys support shared device scenarios, allowing you to carry your credential with you and safely authenticate to an Azure Active Directory joined Windows 10 device that’s part of your organization.

Microsoft partners with FIDO2 security key vendors to ensure that security devices work on Windows, the Microsoft Edge browser, and online Microsoft accounts, to enable strong password-less authentication.

You can become a Microsoft-compatible FIDO2 security key vendor through the following process.  Microsoft doesn't commit to do go-to-market activities with the partner and will evaluate partner priority based on customer demand.

1. First, your authenticator needs to have a FIDO2 certification. We won't be able to work with providers who don't have a FIDO2 certification. To learn more about the certification, please visit this website:  [https://fidoalliance.org/certification/](https://fidoalliance.org/certification/)
2. After you have a FIDO2 certification, please fill in your request to our form here: [https://forms.office.com/r/NfmQpuS9hF](https://forms.office.com/r/NfmQpuS9hF). Our engineering team will only test compatibility of your FIDO2 devices. We won't test security of your solutions.
3. Once we confirm a move forward to the testing phase, the process usually take about 3-6 months. The steps usually involve:
    - Initial discussion between Microsoft and your team.
        - Verify FIDO Alliance Certification or the path to certification if not complete
        - Receive an overview of the device from the vendor
    - Microsoft will share our test scripts with you. Our engineering team will be able to answer questions if you have any specific needs.
    - You'll complete and send all passed results to Microsoft Engineering team
4. Upon successful passing of all tests by Microsoft Engineering team, Microsoft will confirm vendor's device is listed in [the FIDO MDS](https://fidoalliance.org/metadata/).
5. Microsoft will add your FIDO2 Security Key on Azure AD backend and to our list of approved FIDO2 vendors.

## Current partners

The following table lists partners who are Microsoft-compatible FIDO2 security key vendors.

| Provider                  |     Biometric     | USB | NFC | BLE | FIPS Certified | Contact                                                                                             |
|---------------------------|:-----------------:|:---:|:---:|:---:|:--------------:|-----------------------------------------------------------------------------------------------------|
| AuthenTrend               | ![y]              | ![y]| ![y]| ![y]| ![n]           | https://authentrend.com/about-us/#pg-35-3                                                           |
| Ciright                   | ![n]              | ![n]| ![y]| ![n]| ![n]           | https://www.cyberonecard.com/                                                                       |
| Crayonic                  | ![y]              | ![n]| ![y]| ![y]| ![n]           | https://www.crayonic.com/keyvault                                                                   |
| Ensurity                  | ![y]              | ![y]| ![n]| ![n]| ![n]           | https://www.ensurity.com/contact                                                                    |
| Excelsecu                 | ![y]              | ![y]| ![y]| ![y]| ![n]           | https://www.excelsecu.com/productdetail/esecufido2secu.html                                         |
| Feitian                   | ![y]              | ![y]| ![y]| ![y]| ![y]           | https://shop.ftsafe.us/pages/microsoft                                                              |
| Fortinet                  | ![n]              | ![y]| ![n]| ![n]| ![n]           | https://www.fortinet.com/                                                                           |
| Giesecke + Devrient (G+D) | ![y]              | ![y]| ![y]| ![y]| ![n]           | https://www.gi-de.com/en/identities/enterprise-security/hardware-based-authentication               |
| GoTrustID Inc.            | ![n]              | ![y]| ![y]| ![y]| ![n]           | https://www.gotrustid.com/idem-key                                                                  |
| HID                       | ![n]              | ![y]| ![y]| ![n]| ![n]           | https://www.hidglobal.com/contact-us                                                                |
| Hypersecu                 | ![n]              | ![y]| ![n]| ![n]| ![n]           | https://www.hypersecu.com/hyperfido                                                                 |
| IDmelon Technologies Inc. | ![y]              | ![y]| ![y]| ![y]| ![n]           | https://www.idmelon.com/#idmelon                                                                    |
| Kensington                | ![y]              | ![y]| ![n]| ![n]| ![n]           | https://www.kensington.com/solutions/product-category/why-biometrics/                               |
| KONA I                    | ![y]              | ![n]| ![y]| ![y]| ![n]           | https://konai.com/business/security/fido                                                            |
| NeoWave                   | ![n]              | ![y]| ![y]| ![n]| ![n]           | https://neowave.fr/en/products/fido-range/                                                          |
| Nymi                      | ![y]              | ![n]| ![y]| ![n]| ![n]           | https://www.nymi.com/nymi-band                                                                      | 
| Octatco                   | ![y]              | ![y]| ![n]| ![n]| ![n]           | https://octatco.com/                                                                                |
| OneSpan Inc.              | ![n]              | ![y]| ![n]| ![y]| ![n]           | https://www.onespan.com/products/fido                                                               |
| Swissbit                  | ![n]              | ![y]| ![y]| ![n]| ![n]           | https://www.swissbit.com/en/products/ishield-fido2/                                                 |
| Thales Group              | ![n]              | ![y]| ![y]| ![n]| ![y]           | https://cpl.thalesgroup.com/access-management/authenticators/fido-devices                           |
| Thetis                    | ![y]              | ![y]| ![y]| ![y]| ![n]           | https://thetis.io/collections/fido2                                                                 |
| Token2 Switzerland        | ![y]              | ![y]| ![y]| ![n]| ![n]           | https://www.token2.swiss/shop/product/token2-t2f2-alu-fido2-u2f-and-totp-security-key               |
| TrustKey Solutions        | ![y]              | ![y]| ![n]| ![n]| ![n]           | https://www.trustkeysolutions.com/security-keys/                                                    |
| VinCSS                    | ![n]              | ![y]| ![n]| ![n]| ![n]           | https://passwordless.vincss.net                                                                     |
| Yubico                    | ![y]              | ![y]| ![y]| ![n]| ![y]           | https://www.yubico.com/solutions/passwordless/                                                      |



<!--Image references-->
[y]: ./media/fido2-compatibility/yes.png
[n]: ./media/fido2-compatibility/no.png


## Next steps

[FIDO2 Compatibility](fido2-compatibility.md)

