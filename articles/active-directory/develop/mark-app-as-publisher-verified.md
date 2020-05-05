---
title: Mark an app as publisher verified
description: Describes how to mark an app as publisher verified.
services: active-directory
author: rwike77
manager: CelesteDG
ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 05/05/2020
ms.author: ryanwi
ms.custom: aaddev
ms.reviewer: jesakowi
---

# Mark your app as publisher verified

This article describes how to mark your app as publisher verified.

## Quickstart
If you are already enrolled in the Microsoft Partner Network (MPN) and have met the [pre-requisites](publisher-verification-overview.md#requirements), you can get started right away: 

1. Navigate to the preview [App Registration portal](https://aka.ms/PublisherVerificationPreview).

1. Choose an app and click **Branding**. 

1. Click **Add MPN ID to verify publisher** and review the listed requirements.

1. Enter your MPN ID and click **Verify and save**.

For more details on specific benefits, requirements, and frequent asked questions see the [overview](publisher-verification-overview.md).


## Mark your app as publisher verified
Make sure you have met the [pre-requisites](publisher-verification-overview.md#requirements), then follow these steps to mark your app(s) as Publisher Verified.  

1. Ensure you are signed in with an organizational (Azure AD) account that is authorized to make changes to the app(s) you want to mark as Publisher Verified and on the MPN Account in Partner Center. 

    1. In Azure AD this user must either be the Owner of the app or have one of the following roles: Application Admin, Cloud Application Admin, Global Admin. 

    1. In Partner Center this user must have of the following roles: MPN Admin, Accounts Admin, or a Global Admin (this is a shared role mastered in Azure AD). 

1. Navigate to the preview version of the App Registration portal:  

1. Click on an app you would like to mark as Publisher Verified and open the Branding blade. 

1. Ensure the app’s Publisher Domain is set appropriately. This domain must be: 

    1. Be added to the Azure AD tenant as a DNS-verified custom domain,  

    1. Match the domain of the email address used during the verification process for your MPN account. 

1. Click **Add MPN ID to verify publisher** near the bottom of the page. 

1. Enter your **MPN ID**. This MPN ID must be for: 

    1. A valid Microsoft Partner Network account that has completed the verification process.  

    1. The Partner global account (PGA) for your organization. 

1. Click **Verify and save**. 

1. Wait for the request to process, this may take a few minutes. 

1. If the verification was successful, the publisher verification window will close, returning you to the Branding blade. You will see a blue verified badge next to your verified **Publisher display name**. 

1. Users who get prompted to consent to your app will start seeing the badge soon after you have gone through the process successfully, although it may take some time for this to replicate throughout the system. 

1. Test this functionality by signing into your application and ensuring the verified badge shows up on the consent screen. If you are signed in as a user who has already granted consent to the app, you can use the *prompt=consent* query parameter to force a consent prompt. 

1. Repeat this process as needed for any additional apps you would like the badge to be displayed for. You can use Microsoft Graph to do this more quickly in bulk, and PowerShell cmdlets will be available soon. See [Making Microsoft API Graph calls](troubleshoot-publisher-verification.md#making-microsoft-graph-api-calls) for more info. 

That’s it! Let us know if you have any feedback about the process, the results, or the feature in general. 

## Next steps
If you run into problems, read the [troubleshooting information](troubleshoot-publisher-verification.md).