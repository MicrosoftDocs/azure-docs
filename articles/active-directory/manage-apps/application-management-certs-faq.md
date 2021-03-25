---
title: Azure Active Directory Application Management certificates frequently asked questions
description: Learn answers to frequently asked questions (FAQ) about managing certificates for apps using Azure Active Directory as an Identity Provider (IdP).  
services: active-directory
author: kenwith
manager: daveba
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: reference
ms.date: 03/19/2021
ms.author: kenwith
ms.reviewer: secherka, mifarca, shchaur, shravank, sureshja
---

# Azure Active Directory (Azure AD) Application Management certificates frequently asked questions

This page answers frequently asked questions about managing the certificates for apps using Azure Active Directory (Azure AD) as an Identity Provider (IdP).

## Is there a way to generate a list of expiring SAML signing certificates?

You can export all app registrations with expiring secrets, certificates and their owners for the specified apps from your directory in a CSV file through [PowerShell scripts](app-management-powershell-samples.md). 

## Where can I find the information about soon to expire certificates renewal steps?

You can find the steps [here](manage-certificates-for-federated-single-sign-on.md#renew-a-certificate-that-will-soon-expire).

## How can I customize the expiration date for the certificates issued by Azure AD?

By default, Azure AD configures a certificate to expire after three years when it is created automatically during SAML single sign-on configuration. Because you can't change the date of a certificate after you save it, you need to create a new certificate. For steps on how to do so, please refer [Customize the expiration date for your federation certificate and roll it over to a new certificate](manage-certificates-for-federated-single-sign-on.md#customize-the-expiration-date-for-your-federation-certificate-and-roll-it-over-to-a-new-certificate).

## How can I automate the certificates expiration notifications?

Azure AD will send an email notification 60, 30, and 7 days before the SAML certificate expires. You may add more than one email address to receive notifications. 

> [!NOTE]
> You can add up to 5 email addresses to the Notification list (including the email address of the admin who added the application). If you need more people to be notified, use the distribution list emails. 

To specify the emails you want the notifications to be sent to, see [Add email notification addresses for certificate expiration](manage-certificates-for-federated-single-sign-on.md#add-email-notification-addresses-for-certificate-expiration).

There is no option to edit or customize these email notifications received from `aadnotification@microsoft.com`. However, you can export app registrations with expiring secrets and certificates through [PowerShell scripts](app-management-powershell-samples.md).

## Who can update the certificates?

The owner of the application or Global Administrator or Application Administrator can update the certificates through Azure portal UI, PowerShell or Microsoft Graph.

## I need more details about certificate signing options.

In Azure AD, you can set up certificate signing options and the certificate signing algorithm. To learn more, see [Advanced SAML token certificate signing options for Azure AD apps](certificate-signing-options.md).

## I need to replace the certificate for Azure AD Application Proxy applications and need more instructions.

To replace certificates for Azure AD Application Proxy applications, see [PowerShell sample - Replace certificate in Application Proxy apps](scripts/powershell-get-custom-domain-replace-cert.md).

## How do I manage certificates for custom domains in Azure AD Application Proxy?

To configure an on-premises app to use a custom domain, you need a verified Azure Active Directory custom domain, a PFX certificate for the custom domain, and an on-premises app to configure. To learn more, see [Custom domains in Azure AD Application Proxy](application-proxy-configure-custom-domain.md). 

## I need to update the token signing certificate on the application side. Where can I get it on Azure AD side?

You can renew a SAML X.509 Certificate, see [SAML Signing certificate](configure-saml-single-sign-on.md#saml-signing-certificate).

## What is Azure AD signing key rollover?

You can find more details [here](../develop/active-directory-signing-key-rollover.md). 

## How do I renew application token encryption certificate?

To renew an application token encryption certificate, see [How to renew a token encryption certificate for an enterprise application](howto-saml-token-encryption.md). 

## How do I renew application token signing certificate?

To renew an application token signing certificate, see [How to renew a token signing certificate for an enterprise application](manage-certificates-for-federated-single-sign-on.md).

## How do I update Azure AD after changing my federation certificates?

To update Azure AD after changing your federation certificates, see [Renew federation certificates for Microsoft 365 and Azure Active Directory](../hybrid/how-to-connect-fed-o365-certs.md).
