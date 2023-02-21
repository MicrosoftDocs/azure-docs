---
title: System-preferred multifactor authentication (MFA) - Azure Active Directory
description: Learn how to use system-preferred multifactor authentication
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 02/15/2023
ms.author: justinha
author: justinha
manager: amycolannino
ms.reviewer: msft-poulomi
ms.collection: M365-identity-device-management


# Customer intent: As an identity administrator, I want to encourage users to use the Microsoft Authenticator app in Azure AD to improve and secure user sign-in events.
---
# System-preferred multifactor authentication  - Authentication methods policy

System-preferred multifactor authentication (MFA) prompts users to sign in by using the most secure method available. Administrators can enable system-preferred MFA to improve sign-in security and discourage less secure sign-in methods like SMS.

For example, if a user has registered both SMS and Microsoft Authenticator push notifications as methods for MFA, system-preferred MFA prompts the user to sign in by using the more secure push notification method. The user can still choose to sign in by using another method, but they are first prompted to try the most secure method that's available to them. 

Authentication Policy Administrators can enable system-preferred MFA by using Microsoft Graph API. 

## How does system-preferred multifactor authentication work?

When a 

## Prerequisites



## Enable system-preferred MFA

By default, system-preferred MFA is Microsoft managed and set as disabled during preview. When system-preferred MFA becomes generally available, the Microsoft managed setting will change to be enabled. 

To enable system-preferred MFA, you'll need to choose a single target group for the schema configuration. Then use the following API endpoint to change the systemCredentialPreferences property under featureSettings to **enabled**, and include or exclude groups:

```
https://graph.microsoft.com/beta/authenticationMethodsPolicy/systemCredentialPreferences
```

>[!NOTE]
>In Graph Explorer, you'll need to consent to the **Policy.ReadWrite.AuthenticationMethod** permission. 

## Examples


## Known issues

## Common questions

### How does system-preferred MFA affect AD FS or NPS extension?

System-preferred MFA has no affect on users who sign in by using Active Directory Federation Services (AD FS) or Network Policy Server (NPS) extension. 

## Next steps
