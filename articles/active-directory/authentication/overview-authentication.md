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

#Customer intent: As an Azure AD Administrator, I want to protect user authentication so I deploy features like SSPR and MFA to make the sign-in process safe.
---
# What features of Azure Active Directory can I use to protect user authentication

Microsoft Azure Active Directory (Azure AD) includes a long list of features that an Organization can deploy in order to accomplish many tasks. Azure Multi-Factor Authentication and Azure AD self-service password reset (SSPR) are important topics for protecting user authentication.

## Self-service password reset

Users regularly forget their passwords or lock themselves out requiring a call to an organization's help desk.

Azure Active Directory (Azure AD) self-service password reset (SSPR) provides users the ability to reset their passwords on their own when and where they need to. At the same time, administrators can control complexity, age, and means of reset. Users no longer need to call a help desk just to reset their password. Azure AD SSPR includes:

* **Self-service password change:** I know my password but want to change it to something new.
* **Self-service password reset:** I can't sign in and want to reset my password using one or more administrator approved authentication methods.
* **Self-service account unlock:** I can't sign in because my account is locked out and I want to unlock using one or more administrator approved authentication methods.

### Azure AD SSPR availabilityg

SSPR is afailable in three tiers depending on your subscription:

* **Azure AD Free:** Cloud-only administrators can reset their own passwords.
* **Azure AD Basic** or any **paid Office 365 subscription:** Cloud-only users can reset their own passwords.
* **Azure AD Premium:** Any user or administrator, including cloud-only, federated, pass-through authentication, or password hash synchronized users, can reset their own passwords. **On-premises users require password writeback to be enabled.**

## Multi-Factor Authentication

Azure Multi-Factor Authentication (MFA) is Microsoft's two-step verification solution. Azure MFA helps safeguard access to data and applications while meeting user demand for a simple sign-in process. It delivers strong authentication via a range of verification methods, including phone call, text message, or mobile app verification.

### Azure Multi-Factor Authentication availability

Azure MFA is available to users in the following versions:

* Multi-Factor Authentication for Office 365: This version works **exclusively with Office 365 applications** and is managed from the Office 365 portal. Administrators can secure Office 365 resources with two-step verification. This version is part of an Office 365 subscription.
* Multi-Factor Authentication for Azure AD Administrators: Users assigned the Global Administrator role in Azure AD tenants can enable two-step verification for their Azure AD Global Admin accounts at no additional cost.
* Azure Multi-Factor Authentication: Often referred to as the "full" version, Azure Multi-Factor Authentication offers the richest set of capabilities. It provides additional configuration options via the Azure portal, advanced reporting, and support for a range of on-premises and cloud applications. Azure Multi-Factor Authentication is included in Azure Active Directory Premium plans and can be deployed either in the cloud or on-premises.

## Next steps

The next step is to dive in and configure self-service password reset and Azure Multi-Factor Authentication.

To get started with self-service password reset, see the [enable SSPR quickstart article](quickstart-sspr.md).

To get started with Azure Multi-Factor Authentication, see the [enable MFA quickstart article](quickstart-mfa.md)