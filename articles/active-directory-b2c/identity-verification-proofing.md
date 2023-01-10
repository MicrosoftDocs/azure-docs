---
title: Identity proofing and verification for Azure AD B2C
titleSuffix: Azure AD B2C
description: Learn about our partners who integrate with Azure AD B2C to provide identity proofing and verification solutions 
services: active-directory-b2c
author: gargi-sinha
manager: martinco
ms.reviewer: kengaderdus
ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 01/10/2023
ms.author: gasinh
ms.subservice: B2C
---

# Identity verification and proofing partners

With Azure Active Directory B2C (Azure AD B2C) partners, customers can enable end-user identity verification and proofing before account registration or access can occur. Identity verification and proofing can check document, knowledge-based information, and liveness.

The following architecture diagram illustrates the verfication and proofing flow.

   ![Diagram of of the identity proofing flow, from registration to access approval.](./media/partner-gallery/third-party-identity-proofing.png)

1. User begins registration with a device.
2. User enters information.
3. Digital risk score assessed, then third-party identity proofing and identity validation occurs.
4. Identity is validated.
5. User account is created in Azure Active Directory B2C.
6. User access is assigned.
7. User receives access-approved message.

Microsoft partners with independent software vendors (ISVs). Use the following table to locate an ISV and related integration documentation. 

| ISV logo | ISV link and description| Integration documentation|
|---|---|---|
| ![Screenshot of a deduce logo.](./media/partner-gallery/deduce-logo.png) | [Deduce](https://www.deduce.com/): Identity verification and proofing provider that helps stop account takeover and registration fraud. Use it to combat identity fraud and create a trusted user experience. |[Configure Azure AD B2C with Deduce to combat identity fraud and create a trusted user experience](/azure/active-directory-b2c/partner-deduce)|
| ![Screenshot of a eid-me logo](./media/partner-gallery/eid-me-logo.png) |  [Bluink, Ltd.](https://bluink.ca/): eID-Me is an identity verification and decentralized digital identity solution for Canadian citizens. Use it to meet Identity Assurance Level (IAL) 2 and Know Your Customer (KYC) requirements. |[Configure eID-Me with Azure AD B2C for identity verification](/articles/active-directory-b2c/partner-eid-me.md)|
|![Screenshot of an Experian logo.](./media/partner-gallery/experian-logo.png) | [Experian Information Solutions, Inc.](https://www.experian.com/business/products/crosscore): Identity verification and proofing provider with solutions that perform risk assessments based on user attributes. |[Tutorial: Configure Experian with Azure AD B2C](/articles/active-directory-b2c/partner-experian.md)|
|![Screenshot of an IDology logo.](./media/partner-gallery/idology-logo.png) | [IDology, a GBG company](./partner-idology.md): Identity verification and proofing provider with ID verification, fraud prevention, and compliance solutions.|[Tutorial for configuring IDology with Azure AD B2C](/azure/active-directory-b2c/partner-idology)|
|![Screenshot of a Jumio logo.](./media/partner-gallery/jumio-logo.png) | [Jumio](https://www.jumio.com/): Identify verification service with products for real-time, automated ID verification. |[Tutorial for configuring Jumio with Azure AD B2C](/articles/active-directory-b2c/partner-jumio.md)|
| ![Screenshot of a LexisNexis logo.](./media/partner-gallery/lexisnexis-logo.png) | [LexisNexis Risk Solutions Group](https://risk.lexisnexis.com/products/threatmetrix): Profiling and identity validation provider that verifies user identification and provides risk assessment based on user devices. See, ThreatMetrix. |[Tutorial for configuring LexisNexis with Azure AD B2C](/articles/active-directory-b2c/partner-lexisnexis.md)|
| ![Screenshot of a Onfido logo](./media/partner-gallery/onfido-logo.png) | [Onfido](https://onfido.com/): Document ID and facial biometrics verification solutions to meet Know Your Customer (KYC) and identity requirements.  |[Tutorial for configuring Onfido with Azure AD B2C](/articles/active-directory-b2c/partner-onfido.md)|

## Additional information

- [Azure AD B2C custom policy overview](/articles/active-directory-b2c/custom-policy-overview.md)
- [Tutorial: Create user flows and custom policies in Azure Active Directory B2C](/articles/active-directory-b2c/tutorial-create-user-flows.md?pivots=b2c-custom-policy&tabs=applications)

## Next steps

Select and contact a partner from the previous table to get started on solution integration with Azure AD B2C. The partners have similar processes to contact them for a product demo.
