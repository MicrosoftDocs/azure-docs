---
title: Configure Verified ID by IDEMIA as your identity verification partner 
description: This article shows you the steps you need to follow to configure IDEMIA as your identity verification partner
services: active-directory
author: barclayn
manager: amycolannino
ms.service: decentralized-identity
ms.subservice: verifiable-credentials
ms.topic: how-to
ms.date: 10/12/2023
ms.author: barclayn
# Customer intent: As a developer, I'm looking for information about the open standards that are supported by Microsoft Entra Verified ID.
---

# Configure Verified ID by IDEMIA as your identity verification partner

In this article, we cover the steps needed to integrate Microsoft Entra Verified ID (Verified ID) with [IDEMIA](https://www.idemia.com/).

## Prerequisites

Before you can continue with the steps below you need to meet the following requirements: 

- A tenant configured with Verified ID.
   - If you don't have an existing tenant, you can create an Azure account for free. 
- You need to have completed the onboarding process with IDEMIA. 
   - Register on the IDEMIA Experience Portal where you can create your own Microsoft verifiable credential application with a few steps low code integration. 

>[!IMPORTANT]
>Before you can proceed, you must have already received a URL from IDEMIA. If you have not yet received it, follow up with IDEMIA before you try the steps documented below.


## Scenario description

Verified ID users can have their identity verified using IDEMIA's identity document capture and verification.
The Identity proofing process is completed using biometric and document capture via the users' smartphones. Once a user submits their data, biometric and document data is extracted and verified against one another, or against an authoritative data source such as a national identity database or a trusted system of record. Counter-fraud and high-risk profile verification could also be performed for additional assurance. 

The result is a trusted user identity that gives service providers the assurance they need to proceed with customer onboarding. 


After verification, users are issued a reusable identity credential, which expedites the onboarding process for employees, partners, and customers​.


## Configure IDEMIA as your identity verification proofing solution

To configure IDEMIA as your identity verification proofing solution, follow these steps:

1. Go to Quickstart in the Azure portal and select **Verified ID**.
2. Choose select issuer.
3. Look for IDEMIA in the search/select issuers drop down.
4. Select VerifiedCredentialExpert as the credential type.
5. Select **Add** and then select review.
6. Download the request body and copy/paste the POST API request URL

## Developer steps

As a developer you now have the request URL and body from your tenant admin, follow these steps to update your application or website:

1. Add the request URL and body to your application or website to request Verified IDs from your users.
    >[!IMPORTANT]
    >If you are using one of the sample apps, you'll need to replace the contents of the presentation_request_config.json with the request body obtained in Part 1. The sample code overwrites the trustedIssuers values with IssuerAuthority value from ```appsettings.json```. Copy the trustedIssuers value from the payload to IssuerAuthority in ```appsettings.json``` file.
2. Replace the **URL** and **api key** values with your own values.
3. [Grant permissions](verifiable-credentials-configure-tenant.md#grant-permissions-to-get-access-tokens) to your app so it can obtain an access token for the Verified ID service request service principal.

## Test the user flow

User flow is specific to your application or website. However, if you are using one of the sample apps follow the steps outlined as part of the sample app's documentation.

## Next steps

- [Verifiable credentials admin API](admin-api.md)
- [Request Service REST API issuance specification](issuance-request-api.md)