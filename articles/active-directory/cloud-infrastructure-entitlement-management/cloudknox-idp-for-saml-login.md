---
title: Configure an identity provider (IDP) to enable the Security Assertions Markup Language (SAML) log in process
description: How to configure the identity provider (IDP) to enable the Security Assertions Markup Language (SAML) log in process.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 12/22/2021
ms.author: v-ydequadros
---

# Configure an identity provider (IDP) to enable the Security Assertions Markup Language (SAML) log in process

This topic describes how you can configure an identity provider (IDP) to enable the Security Assertions Markup Language (SAML) log in process. You can do this by using single sign-on (SSO) integration.

> [!NOTE]
> If CloudKnox displays a message that you don’t have enough permissions for the task, contact your system administrator.

## Enable the SAML log in process

1. Enter the following information:

   - **SAML Profile (Artifact / POST)**: POST
   - **SAML Version**: 2.0
   - **Connection ID / Entity ID**: https://app.cloudknox.io
   - **Assertion Consumer URL**: https://app.cloudknox.io/saml/<Customer Organization Id>
   - **Application available on mobile? If yes, is it through application or browser?**: No

2. Enter the user attributes with the exact name that the Application Service Provider (ASP) will search for in the user store:

   - **First_Name**: Enter the first name of the Security Assertions Markup Language (SAML) log in user.
   - **Last_Name**: Enter the last name of the SAML log in user.
   - **Email_Address**: Enter the email ID of the SAML log in user.
   - **Groups**: Enter the group names to which the SAML login user is a member. This is used to assign group-based permissions on the CloudKnox Console. 

   When you have completed the configuration, the identity provider (IDP) metadata can be emailed to CloudKnox to enable the SAML log in process.

<!---## Next steps--->