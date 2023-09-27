---
title: Passwordless authentication with Microsoft Entra ID
description: Microsoft Entra ID enables integration with passwordless authentication protocols that include certificate-based authentication, passwordless security key sign-in, Windows Hello for Business, and passwordless sign-in with Microsoft Authenticator.
services: active-directory
author: janicericketts
manager: martinco
ms.service: active-directory
ms.workload: identity
ms.subservice: fundamentals
ms.topic: conceptual
ms.date: 03/01/2023
ms.author: jricketts
ms.custom: template-concept
---
# Passwordless authentication with Microsoft Entra ID

Microsoft Entra ID enables integration with the following passwordless authentication protocols.

- [Overview of Microsoft Entra certificate-based authentication](../authentication/concept-certificate-based-authentication.md): Microsoft Entra certificate-based authentication (CBA) enables customers to allow or require users to authenticate directly with X.509 certificates against their Microsoft Entra ID for applications and browser sign-in. This feature enables customers to adopt phishing resistant authentication and authenticate with an X.509 certificate against their Public Key Infrastructure (PKI). 
- [Enable passwordless security key sign-in](../authentication/howto-authentication-passwordless-security-key.md): For enterprises that use passwords and have a shared PC environment, security keys provide a seamless way for workers to authenticate without entering a username or password. Security keys provide improved productivity for workers, and have better security. This article explains how to sign in to web-based applications with your Microsoft Entra account using a FIDO2 security key.
- [Windows Hello for Business Overview](/windows/security/identity-protection/hello-for-business/hello-overview): Windows Hello for Business replaces passwords with strong two-factor authentication on devices. This authentication consists of a type of user credential that is tied to a device and uses a biometric or PIN.
- [Enable passwordless sign-in with Microsoft Authenticator](../authentication/howto-authentication-passwordless-phone.md): Microsoft Authenticator can be used to sign in to any Microsoft Entra account without using a password. Microsoft Authenticator uses key-based authentication to enable a user credential that is tied to a device, where the device uses a PIN or biometric. Windows Hello for Business uses a similar technology. Microsoft Authenticator can be used on any device platform, including mobile. Microsoft Authenticator can be used with any app or website that integrates with Microsoft Authentication Libraries.
