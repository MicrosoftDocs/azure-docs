---
title: Configure LexisNexis Risk Solutions as an identity verification partner using Verified ID
description: This article shows you the steps you need to follow to configure LexisNexis as your identity verification partner
services: active-directory
author: barclayn
manager: amycolannino
ms.service: decentralized-identity
ms.subservice: verifiable-credentials
ms.topic: how-to
ms.date: 01/26/2023
ms.author: barclayn
# Customer intent: As a developer, I'm looking for information about the open standards that are supported by Microsoft Entra Verified ID.
---

# Configure Verified ID with LexisNexis as your Identity Verification Partner

You can use Microsoft Entra Verified ID with LexisNexis Risk Solutions to enable faster onboarding by replacing some human interactions. Verifiable Credentials (VCs) can be used to onboard employees, students, citizens, or others to access services.

## Prerequisites

- A tenant [configured](verifiable-credentials-configure-tenant.md) for Microsoft Entra Verified ID service.
    - If you don't have an existing tenant, you can [create an Azure account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Your tenant should also have completed the LexisNexis onboarding process.
    - Create a LexisNexis account, you can request a [demo](https://solutions.risk.lexisnexis.com/did-microsoft). Expect response from your LexisNexis Risk Solutions within 48 hours.

>[!IMPORTANT]
> Before you proceed, you must have received the URL from LexisNexis risk solutions for users to be issued Verified IDs. If you have not yet received it, follow up with LexisNexis before you attempt following the steps documented below.

## Scenario description

Verifiable Credentials can be used to onboard employees, students, citizens, or others to access services. For example, rather than an employee needing to go to a central office to activate an employee badge, they can use a verifiable credential to verify their identity to activate a badge that is delivered to them remotely. Rather than a citizen receiving a code they must redeem to access governmental services, they can use a VC to prove their identity and gain access. Learn more about [account onboarding](./plan-verification-solution.md#account-onboarding). 


:::image type="content" source="media/verified-id-partner-au10tix/vc-solution-architecture-diagram.png" alt-text="Diagram of the verifiable credential solution.":::

## Configure your application to use LexisNexis

To incorporate identity verification into your Apps using LexisNexis Verified ID, follow these steps.

### Part 1

As a developer you'll provide the steps below to your tenant administrator. The instructions help them obtain the verification request URL, and application body or website to request verifiable credentials from your users.

1. Go to [Microsoft Entra admin center -> Verified ID](https://entra.microsoft.com/#view/Microsoft_AAD_DecentralizedIdentity/ResourceOverviewBlade).
    >[!Note]
    > Make sure this is the tenant you set up for Verified ID per the pre-requisites.
1. Go to [Quickstart-> Verification Request -> Start](https://entra.microsoft.com/#view/Microsoft_AAD_DecentralizedIdentity/QuickStartVerifierBlade).
1. Select on **Select Issuer**.
1. Look for LexisNexis in the Search/select issuers drop-down. 
   
   [ ![Screenshot of the select issuer section of the portal showing LexisNexis as the choice.](./media/verified-id-partner-lexisnexis/select-issuer.png)](./media/verified-id-partner-lexisnexis/select-issuer.png#lightbox)
   
1. Check the credential type you've discussed with LexisNexis Customer success manager for your specific needs.
1. Choose **Add** and then choose **Review**.
1. Download the request body and Copy/paste POST API request URL.

### Part 2

As a developer you now have the request URL and body from your tenant admin, follow these steps to update your application or website:

1. Add the request URL and body to your application or website to request Verified IDs from your users.
   >[!Note]
   >If you are using [one of the sample apps](https://aka.ms/vcsample), you'll need to replace the contents of the `presentation_request_config.json` with the request body obtained in [Part 1](#part-1). The sample code overwrites the `trustedIssuers` values with `IssuerAuthority` value from `appsettings.json`. Copy the `trustedIssuers` value from the payload to `IssuerAuthority` in `appsettings.json` file.
1. Replace the values for the "url", "state", and "api-key" with your respective values.
1. Grant your app [permissions](verifiable-credentials-configure-tenant.md#grant-permissions-to-get-access-tokens) to obtain an access token for the Verified ID service request service principal.

## Test the user flow

User flow is specific to your application or website. However if you are using [one of the sample apps](https://aka.ms/vcsample) follow the steps here - [Run the test the sample app](https://aka.ms/vcsample)

## Next steps

- [Verifiable credentials admin API](admin-api.md)
- [Request Service REST API issuance specification](issuance-request-api.md)
