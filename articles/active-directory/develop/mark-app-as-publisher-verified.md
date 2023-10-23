---
title: Mark an app as publisher verified
description: Describes how to mark an app as publisher verified. When an application is marked as publisher verified, it means that the publisher (application developer) has verified the authenticity of their organization using a Cloud Partner Program (CPP) account that has completed the verification process and has associated this CPP account with that application registration.
services: active-directory
author: rwike77
manager: CelesteDG
ms.service: active-directory
ms.subservice: develop
ms.topic: how-to
ms.workload: identity
ms.date: 08/17/2023
ms.author: ryanwi
ms.custom: aaddev
ms.reviewer: xurobert
---

# Mark your app as publisher verified

When an app registration has a verified publisher, it means that the publisher of the app has [verified](/partner-center/verification-responses) their identity using their Cloud Partner Program (CPP) account and has associated this CPP account with their app registration. This article describes how to complete the [publisher verification](publisher-verification-overview.md) process.

## Quickstart
If you are already enrolled in the [Cloud Partner Program (CPP)](/partner-center/intro-to-cloud-partner-program-membership) and have met the [pre-requisites](publisher-verification-overview.md#requirements), you can get started right away: 

1. Sign into the [App Registration portal](https://aka.ms/PublisherVerificationPreview) using [multi-factor authentication](../authentication/concept-mfa-licensing.md)

1. Choose an app and click **Branding & properties**. 

1. Click **Add Partner One ID to verify publisher** and review the listed requirements.

1. Enter your Partner One ID and click **Verify and save**.

For more details on specific benefits, requirements, and frequently asked questions see the [overview](publisher-verification-overview.md).

## Mark your app as publisher verified
Make sure you meet the [pre-requisites](publisher-verification-overview.md#requirements), then follow these steps to mark your app(s) as Publisher Verified.  

1. Sign in using [multi-factor authentication](../authentication/concept-mfa-licensing.md) to an organizational (Microsoft Entra) account authorized to make changes to the app you want to mark as Publisher Verified and on the CPP Account in Partner Center.

    - The Microsoft Entra user must have one of the following [roles](../roles/permissions-reference.md): Application Admin, Cloud Application Admin, or Global Administrator. 

    - The user in Partner Center must have the following [roles](/partner-center/permissions-overview): CPP Admin, Accounts Admin, or a Global Administrator (a shared role mastered in Microsoft Entra ID). 

1. Navigate to the **App registrations** blade:  

1. Click on an app you would like to mark as Publisher Verified and open the **Branding & properties** blade. 

1. Ensure the app’s [publisher domain](howto-configure-publisher-domain.md) is set. 

1. Ensure that either the publisher domain or a DNS-verified [custom domain](../fundamentals/add-custom-domain.md) on the tenant matches the domain of the email address used during the verification process for your CPP account.

1. Click **Add Partner One ID to verify publisher** near the bottom of the page. 

1. Enter the **Partner One ID** for: 

    - A valid Cloud Partner Program account that has completed the verification process.  

    - The Partner global account (PGA) for your organization. 

1. Click **Verify and save**. 

1. Wait for the request to process, this may take a few minutes. 

1. If the verification was successful, the publisher verification window closes, returning you to the **Branding & properties** blade. You see a blue verified badge next to your verified **Publisher display name**. 

1. Users who get prompted to consent to your app start seeing the badge soon after you've gone through the process successfully, although it may take some time for updates to replicate throughout the system. 

1. Test this functionality by signing into your application and ensuring the verified badge shows up on the consent screen. If you're signed in as a user who has already granted consent to the app, you can use the *prompt=consent* query parameter to force a consent prompt. This parameter should be used for testing only, and never hard-coded into your app's requests.

1. Repeat these steps as needed for any more apps you would like the badge to be displayed for. You can use Microsoft Graph to do this more quickly in bulk, and PowerShell cmdlets will be available soon. See [Making Microsoft API Graph calls](troubleshoot-publisher-verification.md#making-microsoft-graph-api-calls) for more info. 

That’s it! Let us know if you have any feedback about the process, the results, or the feature in general. 

## Next steps
If you run into problems, read the [troubleshooting information](troubleshoot-publisher-verification.md).
