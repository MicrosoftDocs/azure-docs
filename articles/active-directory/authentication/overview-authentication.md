---
title: Azure Active Directory user authentication
description: As an Azure AD Administrator how do I protect user authentication while reducing end-user impact?

services: active-directory
ms.service: active-directory
ms.component: authentication
ms.topic: overview
ms.date: 05/25/2018

ms.author: joflore
author: MicrosoftGuyJFlo
manager: mtillman
ms.reviewer: sahenry, richagi

#Customer intent: As an Azure AD Administrator, I want to protect user authentication to make the sign-in process safe.
---
# What protects user authentication?

Microsoft Azure Active Directory (Azure AD) includes features like Azure Multi-Factor Authentication (Azure MFA) and Azure AD self-service password reset (SSPR) to help administrators protect user authentication.

When a user needs to access a sensitive application, reset their password, or enable Windows Hello they may be prompted to provide additional verification that they are who they say they are. Additional verification may come in the form of authentication methods such as:

* A code provided in an email or text message
* A phone call
* A notification or code on their phone
* Answers to security questions

Azure MFA and Azure AD self-service password reset can use the same or different authentication methods based on administrator-controlled configuration, policy, monitoring, and reporting using Azure AD and the Azure portal.

![Example login.microsoftonline.com login page in Chrome](media/overview-authentication/overview-login.png)

## Self-service password reset

SSPR provides users the ability to reset their password, with no administrator intervention, when and where they need to. Administrators retain control of password complexity, age, and authentication methods allowed.

> [!VIDEO https://www.youtube.com/embed/hc97Yx5PJiM]

Self-service password reset includes:

* **Self-service password change:** I know my password but want to change it to something new.
* **Self-service password reset:** I can't sign in and want to reset my password using one or more approved authentication methods.
* **Self-service account unlock:** I can't sign in because my account is locked out and I want to unlock using one or more approved authentication methods.

## Multi-Factor Authentication

Azure Multi-Factor Authentication (MFA) is Microsoft's two-step verification solution using the same administrator defined authentication methods. Azure MFA helps safeguard access to data and applications while meeting user demand for a simple sign-in process.

## Next steps

The next step is to dive in and configure self-service password reset and Azure Multi-Factor Authentication.

To get started with self-service password reset, see the [enable SSPR quickstart article](quickstart-sspr.md).

To get started with Azure Multi-Factor Authentication, see the [enable MFA quickstart article](quickstart-mfa.md)