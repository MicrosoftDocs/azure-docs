---
title: Azure Active Directory user authentication
description: As an Azure AD Administrator how do I protect user authentication while reducing end-user impact?

ms.service: active-directory
ms.component: authentication
ms.topic: overview
ms.date: 04/26/2018

ms.author: joflore
author: MicrosoftGuyJFlo
manager: mtillman
ms.reviewer: sahenry, richagi

#Customer intent: As an Azure AD Administrator, I want to protect user authentication so I deploy features like SSPR and MFA to make the sign-in process safe.
---
# What features of Azure Active Directory can I use to protect user authentication

Microsoft Azure Active Directory (Azure AD) includes a long list of features that an Organization can deploy in order to accomplish many tasks. Azure Multi-Factor Authentication and Azure AD self-service password reset (SSPR) are important topics for protecting user authentication.

Users regularly forget their passwords or lock themselves out requiring a call to an organization's help desk.

You may want to require users to confirm they are who they say they are when accessing sensitive data or critical applications.

Azure AD allows organizations to define policies where the same authentication data can be used to both allow users to reset their own passwords and prove who they say they are when accessing your organization's critial applications.



## Next steps

The next step is to dive in and configure self-service password reset and Azure Multi-Factor Authentication.

To get started with self-service password reset, see the [enable SSPR quickstart article](quickstart-sspr.md).

To get started with Azure Multi-Factor Authentication, see the [enable MFA quickstart article](quickstart-mfa.md)