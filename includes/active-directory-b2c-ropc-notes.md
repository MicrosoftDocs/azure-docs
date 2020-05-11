---
author: msmimart
ms.service: active-directory-b2c
ms.subservice: B2C
ms.topic: include
ms.date: 02/27/2020
ms.author: mimart
---
## ROPC flow notes
In Azure Active Directory B2C (Azure AD B2C), the following options are supported:

- **Native Client**: User interaction during authentication happens when code runs on a user-side device. The device can be a mobile application that's running in a native operating system, such as Android and iOS.
- **Public client flow**: Only user credentials, gathered by an application, are sent in the API call. The credentials of the application are not sent.
- **Add new claims**: The ID token contents can be changed to add new claims.

The following flows are not supported:

- **Server-to-server**: The identity protection system needs a reliable IP address gathered from the caller (the native client) as part of the interaction. In a server-side API call, only the server’s IP address is used. If a dynamic threshold of failed authentications is exceeded, the identity protection system may identify a repeated IP address as an attacker.
- **Confidential client flow**: The application client ID is validated, but the application secret is not validated.

When using the ROPC flow, consider the following:

- ROPC doesn’t work when there is any interruption to the authentication flow that needs user interaction. For example, when a password has expired or needs to be changed, multi-factor authentication is required, or when more information needs to be collected during sign-in (for example, user consent).
- ROPC supports local accounts only. Users can’t sign in with federated identity providers like Microsoft, Google+, Twitter, AD-FS, or Facebook.
- Session Management, including keep me signed-in (KMSI), is not applicable.
