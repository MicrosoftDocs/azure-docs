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
ms.date: 01/18/2023
ms.author: gasinh
---

# Identity verification and proofing partners

With Azure Active Directory B2C (Azure AD B2C) and solutions from software-vendor partners, customers can enable end-user identity verification and proofing for account registration. Identity verification and proofing can check documents, knowledge-based information, and liveness.

## Architecture diagram

The following architecture diagram illustrates the verification and proofing flow.

   ![Diagram of the identity proofing flow, from registration to access approval.](./media/partner-gallery/third-party-identity-proofing.png)

1. User begins registration with a device.
2. User enters information.
3. Digital-risk score is assessed, then third-party identity proofing and identity validation occurs.
4. Identity is validated or rejected.
5. User attributes are passed to Azure Active Directory B2C.
6. If user verification is successful, a user account is created in Azure AD B2C during sign-in.
7. Based on the verification result, the user receives an access-approved or -denied message.

## Software vendors and integration documentation

Microsoft partners with independent software vendors (ISVs). Use the following table to locate an ISV and related integration documentation. 

| ISV logo | ISV link and description| Integration documentation|
|---|---|---|
| ![Screenshot of the Deduce logo.](./media/partner-gallery/deduce-logo.png) | [Deduce](https://www.deduce.com/): Identity verification and proofing provider that helps stop account takeover and registration fraud. Use it to combat identity fraud and create a trusted user experience. |[Configure Azure AD B2C with Deduce to combat identity fraud and create a trusted user experience](partner-deduce.md)|
| ![Screenshot of the eID-Me logo.](./media/partner-gallery/eid-me-logo.png) |  [Bluink, Ltd.](https://bluink.ca/): eID-Me is an identity verification and decentralized digital identity solution for Canadian citizens. Use it to meet Identity Assurance Level (IAL) 2 and Know Your Customer (KYC) requirements. |[Configure eID-Me with Azure AD B2C for identity verification](partner-eid-me.md)|
|![Screenshot of the Experian logo.](./media/partner-gallery/experian-logo.png) | [Experian Information Solutions, Inc.](https://www.experian.com/business/products/crosscore): Identity verification and proofing provider with solutions that perform risk assessments based on user attributes. |[Tutorial: Configure Experian with Azure AD B2C](partner-experian.md)|
|![Screenshot of the IDology logo.](./media/partner-gallery/idology-logo.png) | [IDology, a GBG company](https://www.idology.com/solutions/): Identity verification and proofing provider with ID verification, fraud prevention, and compliance solutions.|[Tutorial for configuring IDology with Azure AD B2C](partner-idology.md)|
|![Screenshot of the Jumio logo.](./media/partner-gallery/jumio-logo.png) | [Jumio](https://www.jumio.com/): Identify verification service with products for real-time, automated ID verification. |[Tutorial for configuring Jumio with Azure AD B2C](partner-jumio.md)|
| ![Screenshot of the LexisNexis logo.](./media/partner-gallery/lexisnexis-logo.png) | [LexisNexis Risk Solutions Group](https://risk.lexisnexis.com/products/threatmetrix): Profiling and identity validation provider that verifies user identification and provides risk assessment based on user devices. See, ThreatMetrix. |[Tutorial for configuring LexisNexis with Azure AD B2C](partner-lexisnexis.md)|
| ![Screenshot of the Onfido logo.](./media/partner-gallery/onfido-logo.png) | [Onfido](https://onfido.com/): Document ID and facial biometrics verification solutions to meet Know Your Customer (KYC) and identity requirements.  |[Tutorial for configuring Onfido with Azure AD B2C](partner-onfido.md)|

## Resources

- [Azure AD B2C custom policy overview](custom-policy-overview.md)
- [Tutorial: Create user flows and custom policies in Azure Active Directory B2C](tutorial-create-user-flows.md?pivots=b2c-custom-policy&tabs=applications)

## Next steps

Select and contact a partner from the previous table to get started on solution integration with Azure AD B2C. The partners have similar processes to contact them for a product demo.
