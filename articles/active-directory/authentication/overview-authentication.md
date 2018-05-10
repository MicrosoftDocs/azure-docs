---
title: Azure Active Directory user authentication
description: As an Azure AD Administrator how do I protect user authentication while reducing end-user impact?

services: active-directory
ms.service: active-directory
ms.component: authentication
ms.topic: overview
ms.date: 04/26/2018

ms.author: joflore
author: MicrosoftGuyJFlo
manager: mtillman
ms.reviewer: sahenry, richagi

#Customer intent: As an Azure AD Administrator, I want to protect user authentication to make the sign-in process safe.
---
# What is user authentication?

Microsoft Azure Active Directory (Azure AD) includes features like Azure Multi-Factor Authentication (Azure MFA) and Azure AD self-service password reset (SSPR) to help administrators protect user authentication.

## Secure from the start

Using things users are already familiar with like their cell phone, desk phone, or an app on their phone, users can reset their password when they forget it or access applications that require a second factor of authentication. We call these things authentication methods.

Administrators retain centralized control of configuration, policy, monitoring, and reporting using Azure AD and the Azure portal.

![Example login.microsoftonline.com login page in Chrome](media/overview-authentication/overview-login.png)

## Self-service password reset

SSPR provides users the ability to reset their password, with no administrator intervention, when and where they need to. Administrators retain control of password complexity, age, and authentication methods allowed. 

> [!VIDEO https://www.youtube.com/embed/hc97Yx5PJiM]

SSPR includes:

* **Self-service password change:** I know my password but want to change it to something new.
* **Self-service password reset:** I can't sign in and want to reset my password using one or more approved authentication methods.
* **Self-service account unlock:** I can't sign in because my account is locked out and I want to unlock using one or more approved authentication methods.

### Azure AD SSPR availability

SSPR is available in three tiers depending on your subscription:

* **Azure AD Free:** Cloud-only administrators can reset their own passwords.
* **Azure AD Basic** or any **paid Office 365 subscription:** Cloud-only users and administrators can reset their own passwords.
* **Azure AD Premium:** Any user or administrator, including cloud-only, federated, pass-through authentication, or password hash synchronized users, can reset their own passwords. **On-premises users require password writeback to be enabled.**

## Multi-Factor Authentication

Azure Multi-Factor Authentication (MFA) is Microsoft's two-step verification solution using the same administrator defined authentication methods. Azure MFA helps safeguard access to data and applications while meeting user demand for a simple sign-in process.

### Azure Multi-Factor Authentication availability

Azure MFA is available to users in the following versions:

* Multi-Factor Authentication for Office 365: This version works **exclusively with Office 365 applications** and is managed from the Office 365 portal. Administrators can secure Office 365 resources with two-step verification. This version is part of an Office 365 subscription.
* Multi-Factor Authentication for Azure AD Administrators: Users assigned the Global Administrator role in Azure AD tenants can enable two-step verification for their Azure AD Global Admin accounts at no additional cost.
* Azure Multi-Factor Authentication: Often referred to as the "full" version, Azure Multi-Factor Authentication offers the richest set of capabilities. It provides additional configuration options via the Azure portal, advanced reporting, and support for a range of on-premises and cloud applications. Azure Multi-Factor Authentication is included in Azure Active Directory Premium plans and can be deployed either in the cloud or on-premises.

## Next steps

The next step is to dive in and configure self-service password reset and Azure Multi-Factor Authentication.

To get started with self-service password reset, see the [enable SSPR quickstart article](quickstart-sspr.md).

To get started with Azure Multi-Factor Authentication, see the [enable MFA quickstart article](quickstart-mfa.md)