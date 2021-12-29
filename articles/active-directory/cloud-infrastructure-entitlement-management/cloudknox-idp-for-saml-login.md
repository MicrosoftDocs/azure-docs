---
title: Microsoft CloudKnox Permissions Management - Configure an identity provider (IDP) to enable the Security Assertions Markup Language (SAML) login process
description: How to configure the identity provider (IDP) to enable the Security Assertions Markup Language (SAML) login process in Microsoft CloudKnox Permissions Management.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 12/27/2021
ms.author: v-ydequadros
---

# Microsoft CloudKnox Permissions Management - Configure an identity provider (IDP) to enable the Security Assertions Markup Language (SAML) login process

This topic describes how you can configure an identity provider (IDP) to enable the Security Assertions Markup Language (SAML) login process using single sign-on (SSO) integration.

> [!NOTE]
> Contact your system administrator if you receive a message that says you don’t have enough permissions for the task.

**To enable the SAML login process:** 

1. Enter the following information:

   - **SAML Profile (Artifact / POST)**: POST
   - **SAML Version**: 2.0
   - **Connection ID / Entity ID**: https://app.cloudknox.io
   - **Assertion Consumer URL**: Add the customer organization ID to the path displayed.
     <!---https://app.cloudknox.io/saml/<Customer Organization Id>--->
   - **Application available on mobile? If yes, is it through application or browser?**: No

2. Enter the user attributes with the exact name that the Application Service Provider (ASP) will search for in the user store:

   - **First_Name**: Enter the first name of the Security Assertions Markup Language (SAML) login user.
   - **Last_Name**: Enter the last name of the SAML login user.
   - **Email_Address**: Enter the email ID of the SAML login user.
   - **Groups**: Enter the group names in which the SAML login user is a member. Group names are used to assign group-based permissions on the CloudKnox Console.

   After completing configuration, you can email the IDP metadata to CloudKnox to enable the SAML login process.

<!---## Next steps--->