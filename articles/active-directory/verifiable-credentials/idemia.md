---
title: Configure Verified ID by IDEMIA as your Identity Verification Partner 
description: This article shows you the steps you need to follow to configure IDEMIA as your identity verification partner
services: active-directory
author: barclayn
manager: amycolannino
ms.service: decentralized-identity
ms.subservice: verifiable-credentials
ms.topic: how-to
ms.date: 07/20/2023
ms.author: barclayn
# Customer intent: As a developer, I'm looking for information about the open standards that are supported by Microsoft Entra Verified ID.
---

# Configure Verified ID by IDEMIA as your Identity Verification Partner

In this article, we cover the steps needed to integrate Microsoft Entra Verified ID with [IDEMIA](https://www.idemia.com/). IDEMIA is a global leader in identity technologies building future-proof solutions that secure billions of frictionless interactions in the physical and digital world. 

Users of Microsoft Azure AD verifiable credentials can be verified by IDEMIA’s Identity Proofing platform, which offers a powerful and robust identity verification solution for enterprises that need to know, trust, and verify the identities of their customers and end users. It enables service providers to digitize the user registration process across various channels, while ensuring total security. 

Identity proofing is completed using biometric and document capture through customer smartphones. Once a user submits their data, biometric and document data is extracted and verified against one another, or against an authoritative data source such as a national identity database or a trusted system of record. Counter-fraud and high-risk profile verifications may also be performed for additional assurance. 

The result is a trusted customer identity that gives service providers the assurance they need to proceed with customer onboarding. 

## Prerequisites

Before you can continue with the steps below you need to meet the following requirements: 

- A tenant configured for Entra Verified ID service on your Azure account. 
  - If you do not have an existing tenant, you can create an Azure account for free. 
- You need to have completed the onboarding process with IDEMIA. 
  - Register on the IDEMIA Experience Portal where you can easily create your own Microsoft VC Entra Application with a few steps low code integration. 

>[!IMPORTANT]
>Before you proceed, you must have received the URL from IDEMIA for users to be issued Verified IDs. If you have not yet received it, follow up with IDEMIA before you attempt following the steps documented below.


## Scenario description

Users of Microsoft Azure AD verifiable credentials can in association with IDEMIA Identity Proofing solution: 

- Secure access to high-value applications and sensitive resources. 
- Have faster remote onboarding of employees, partners and customers thanks to a trustworthy self-service enrollment by digitally validating information. 
- Reduce support phone calls and security questions with a simpler, more secure process to verify identity. 

This provides a safer, faster and easier way to verify users: 

- More protection against breaches.
- Credentials verified by IDEMIA’s industry-leading ID verification platform.
- Meets regulatory requirements by default.
- No custom integration.
- No need to store PII.
- Lower cost.
- Verify once, use everywhere.

/media/idemia/verified-id-deployment-diagram.jpg

## Configure IDEMIA as your identity verification proofing solution

To configure IDEMIA as your identity verification proofing solution, follow these steps:

1. Go to Quickstart in the Azure portal and select **Verified ID**.
2. Choose select issuer.
3. Look for IDEMIA in the search/select issuers drop down.

/media/idemia/search-seclect-issuers.pngsearch-seclect-issuers.png

4. Select VerifiedCredentialExpert as the credential type.
5. Select **Add** and then select review.
6. Download the request body and cop/paste the POST API request URL

## Developer steps

As a developer you now have the request URL and body from your tenant admin, follow these steps to update your application or website:

1. Add the request URL and body to your application or website to request Verified IDs from your users.
    >[!IMPORTANT]
    >If you are using one of the sample apps, you'll need to replace the contents of the presentation_request_config.json with the request body obtained in Part 1. The sample code overwrites the trustedIssuers values with IssuerAuthority value from appsettings.json. Copy the trustedIssuers value from the payload to IssuerAuthority in appsettings.json file.
2. Replace the **URL** and **api key** values with your own values.
3. [Grant permissions](verifiable-credentials-configure-tenant.md#grant-permissions-to-get-access-tokens) to your app so it can obtain an access token for the Verified ID service request service principal.

## Test the user flow

User flow is specific to your application or website. However, if you are using one of the sample apps follow the steps outlined as part of the sample app's documentation.

## Next steps

- [Verifiable credentials admin API](admin-api.md)
- [Request Service REST API issuance specification](issuance-request-api.md)